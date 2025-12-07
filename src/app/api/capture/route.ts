import {NextResponse} from 'next/server'

import {CaptureRequestSchema} from '@/entities/anomaly/model/schemas'
import {ServerState} from "@/entities/anomaly/lib/mock-data";

function randomFail() {
    return Math.random() < 0.3 // 30% chance of failure
}

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = CaptureRequestSchema.parse(body)

        const serverState = ServerState.getInstance()
        const anomalyIndex = serverState.anomalies.findIndex(
            (a) => a.id === parsed.id
        )

        if (anomalyIndex === -1) {
            return NextResponse.json(
                {error: 'Anomaly not found'},
                {status: 404}
            )
        }


        await new Promise((resolve) => setTimeout(resolve, 700))


        if (randomFail()) {
            return NextResponse.json(
                {error: 'Capture failed due to spirit resistance'},
                {status: 500}
            )
        }


        serverState.anomalies[anomalyIndex] = {
            ...serverState.anomalies[anomalyIndex],
            status: 'Captured',
        }

        return NextResponse.json({
            success: true,
            anomaly: serverState.anomalies[anomalyIndex],
        })
    } catch (error) {
        console.error('Error capturing anomaly:', error)
        return NextResponse.json(
            {error: 'Invalid request payload'},
            {status: 400}
        )
    }
}