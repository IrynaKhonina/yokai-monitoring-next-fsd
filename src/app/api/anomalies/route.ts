import {NextResponse} from 'next/server'
import {ServerState} from "@/entities/anomaly/lib/mock-data";
import {AnomalySchema} from "@/entities/anomaly/model/schemas";

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const serverState = ServerState.getInstance()
        const validatedAnomalies = serverState.anomalies.map((anomaly) =>
            AnomalySchema.parse(anomaly)
        )

        return NextResponse.json(validatedAnomalies)
    } catch (error) {
        console.error('Error fetching anomalies:', error)
        return NextResponse.json(
            {error: 'Internal server error'},
            {status: 500}
        )
    }
}