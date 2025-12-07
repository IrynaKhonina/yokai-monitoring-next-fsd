import {ServerState} from "@/entities/anomaly/lib/mock-data";
import {ThreatLevel} from "@/entities/anomaly/model/types";

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const encoder = new TextEncoder()
    const serverState = ServerState.getInstance()

    // AbortController для отслеживания закрытия соединения
    const controller = new AbortController()
    const signal = controller.signal

    const stream = new ReadableStream({
        async start(streamController) {
            let isConnectionClosed = false
            let intervalId: NodeJS.Timeout | null = null

            //  для безопасной отправки событий
            const sendEvent = (data: object) => {
                if (isConnectionClosed) {
                    console.log('Connection already closed, skipping event')
                    return
                }

                try {
                    const payload = `data: ${JSON.stringify(data)}\n\n`
                    streamController.enqueue(encoder.encode(payload))
                } catch (error) {
                    console.error('Error sending event:', error)
                    isConnectionClosed = true
                }
            }

            // начальное состояние
            sendEvent({
                type: 'init',
                anomalies: serverState.anomalies,
            })

            // Обновляем случайную аномалию каждые 5 секунд
            intervalId = setInterval(() => {
                if (isConnectionClosed) {
                    if (intervalId) clearInterval(intervalId)
                    return
                }

                const activeAnomalies = serverState.anomalies.filter(
                    (a) => a.status === 'Active'
                )

                if (activeAnomalies.length === 0) {
                    sendEvent({type: 'info', message: 'All anomalies captured'})
                    return
                }

                const randomIndex = Math.floor(Math.random() * activeAnomalies.length)
                const randomAnomaly = activeAnomalies[randomIndex]
                const anomalyIndex = serverState.anomalies.findIndex(
                    (a) => a.id === randomAnomaly.id
                )

                if (anomalyIndex === -1) return

                const threatLevels: ThreatLevel[] = ['Low', 'Medium', 'High', 'Critical']
                let newThreat: ThreatLevel

                do {
                    newThreat = threatLevels[Math.floor(Math.random() * threatLevels.length)]
                } while (newThreat === serverState.anomalies[anomalyIndex].threat)

                // Обновляем состояние сервера
                serverState.anomalies[anomalyIndex] = {
                    ...serverState.anomalies[anomalyIndex],
                    threat: newThreat,
                }

                // Отправляем обновление клиентам
                sendEvent({
                    type: 'threatUpdate',
                    payload: {
                        id: randomAnomaly.id,
                        threat: newThreat,
                    },
                })
            }, 5000)

            // Обрабатываем закрытие соединения
            signal.addEventListener('abort', () => {
                isConnectionClosed = true
                if (intervalId) clearInterval(intervalId)

                try {
                    streamController.close()
                } catch (error) {
                    // Игнорируем ошибку, если контроллер уже закрыт
                }

                console.log('SSE connection closed by client')
            })

            // Обработка закрытия соединения со стороны клиента
            request.signal.addEventListener('abort', () => {
                isConnectionClosed = true
                if (intervalId) clearInterval(intervalId)
                controller.abort()
            })
        },

        cancel() {
            console.log('Stream cancelled')
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
        },
    })
}