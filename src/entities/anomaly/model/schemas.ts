import {z} from 'zod'

export const AnomalySchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    threat: z.enum(['Low', 'Medium', 'High', 'Critical']),
    location: z.string().min(1),
    status: z.enum(['Active', 'Captured']),
})

export const CaptureRequestSchema = z.object({
    id: z.string().uuid(),
})

export type Anomaly = z.infer<typeof AnomalySchema>
export type CaptureRequest = z.infer<typeof CaptureRequestSchema>