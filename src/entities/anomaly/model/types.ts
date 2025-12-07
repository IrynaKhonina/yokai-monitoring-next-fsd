export type ThreatLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type AnomalyStatus = 'Active' | 'Captured'

export interface Anomaly {
    id: string
    name: string
    threat: ThreatLevel
    location: string
    status: AnomalyStatus
}