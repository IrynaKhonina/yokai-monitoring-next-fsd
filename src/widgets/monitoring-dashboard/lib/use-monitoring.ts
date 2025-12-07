'use client'

import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {Anomaly} from "@/entities/anomaly/model/types";
import {anomaliesApi} from "@/features/anomaly-capture/ui/model/api";
import {toast} from "@/shared/lib/toast";

export const useMonitoring = () => {
    const queryClient = useQueryClient()
    const [sseConnected, setSseConnected] = useState(true)
    const [capturingIds, setCapturingIds] = useState<string[]>([])


    const {
        data: anomalies = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ['anomalies'],
        queryFn: anomaliesApi.fetchAnomalies,
    })


    const captureMutation = useMutation({
        mutationFn: anomaliesApi.captureAnomaly,
        onMutate: async (id: string) => {

            await queryClient.cancelQueries({ queryKey: ['anomalies'] })


            const previousAnomalies = queryClient.getQueryData<Anomaly[]>(['anomalies'])


            queryClient.setQueryData<Anomaly[]>(['anomalies'], (old) =>
                old?.map((anomaly) =>
                    anomaly.id === id ? { ...anomaly, status: 'Captured' } : anomaly
                ) || []
            )

            setCapturingIds((prev) => [...prev, id])

            return { previousAnomalies }
        },
        onError: (err: Error, id: string, context?: { previousAnomalies?: Anomaly[] }) => {

            if (context?.previousAnomalies) {
                queryClient.setQueryData(['anomalies'], context.previousAnomalies)
            }
            toast.error(`Capture failed: ${err.message}`)
        },
        onSuccess: (data) => {
            toast.success(`${data.anomaly.name} captured successfully!`)
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['anomalies'] })
        },
    })

    // SSE connection for real-time updates
    useEffect(() => {
        const eventSource = new EventSource('/api/events')

        eventSource.onopen = () => {
            setSseConnected(true)
        }

        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)

                if (data.type === 'init' && data.anomalies) {
                    queryClient.setQueryData(['anomalies'], data.anomalies)
                }

                if (data.type === 'threatUpdate' && data.payload) {
                    queryClient.setQueryData<Anomaly[]>(['anomalies'], (old) =>
                        old?.map((anomaly) =>
                            anomaly.id === data.payload.id
                                ? { ...anomaly, threat: data.payload.threat }
                                : anomaly
                        ) || []
                    )
                }
            } catch (error) {
                console.error('SSE parsing error:', error)
            }
        }

        eventSource.onerror = () => {
            setSseConnected(false)
            eventSource.close()
        }

        return () => {
            eventSource.close()
        }
    }, [queryClient])

    const handleCapture = (id: string) => {
        captureMutation.mutate(id)
        setCapturingIds((prev) => [...prev, id])
    }

    // Calculate stats
    const stats = {
        total: anomalies.length,
        active: anomalies.filter((a) => a.status === 'Active').length,
        captured: anomalies.filter((a) => a.status === 'Captured').length,
        critical: anomalies.filter((a) => a.threat === 'Critical').length,
    }

    return {
        anomalies,
        isLoading,
        error,
        stats,
        sseConnected,
        capturingIds,
        handleCapture,
    }
}