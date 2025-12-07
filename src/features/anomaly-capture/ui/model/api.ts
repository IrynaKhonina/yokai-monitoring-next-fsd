import {Anomaly} from "@/entities/anomaly/model/types";


export const anomaliesApi = {
    fetchAnomalies: async (): Promise<Anomaly[]> => {
        const response = await fetch('/api/anomalies')
        if (!response.ok) {
            throw new Error('Failed to fetch anomalies')
        }
        return response.json()
    },

    captureAnomaly: async (
        id: string
    ): Promise<{ success: boolean; anomaly: Anomaly }> => {
        const response = await fetch('/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id}),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: 'Capture failed',
            }))
            throw new Error(error.error || 'Capture failed')
        }

        return response.json()
    },
}