'use client'

import React from 'react'

import styles from './AnomalyCard.module.scss'
import clsx from 'clsx'
import {Anomaly} from "@/entities/anomaly/model/types";

interface AnomalyCardProps extends Anomaly {
    onCapture: (id: string) => void
    isCapturing?: boolean
}

export const AnomalyCard: React.FC<AnomalyCardProps> = ({
                                                            id,
                                                            name,
                                                            threat,
                                                            location,
                                                            status,
                                                            onCapture,
                                                            isCapturing = false,
                                                        }) => {
    const handleCapture = () => {
        if (status === 'Active' && !isCapturing) {
            onCapture(id)
        }
    }

    return (
        <div className={clsx(styles.card, status === 'Captured' && styles.captured)}>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h3 className={styles.name}>{name}</h3>
                    <div className={styles.location}>
                        <span className={styles.locationIcon}>📍</span>
                        {location}
                    </div>
                </div>

                <div className={styles.threatBadge}>
                    <div className={clsx(styles.threatLevel, styles[threat.toLowerCase()])}>
                        {threat} Threat
                    </div>
                </div>

                <div className={styles.controls}>
                    <div className={clsx(styles.status, styles[status.toLowerCase()])}>
                        {status}
                    </div>

                    <button
                        className={clsx(
                            styles.captureButton,
                            isCapturing && styles.capturing,
                            status === 'Captured' && styles.disabled
                        )}
                        onClick={handleCapture}
                        disabled={status === 'Captured' || isCapturing}
                    >
                        {isCapturing
                            ? 'Capturing...'
                            : status === 'Captured'
                                ? 'Captured'
                                : 'Capture'}
                    </button>
                </div>
            </div>
        </div>
    )
}