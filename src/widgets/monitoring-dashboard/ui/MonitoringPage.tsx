'use client'

import React from 'react'
import {useMonitoring} from '../lib/use-monitoring'
import styles from './MonitoringPage.module.scss'
import {AnomalyCard} from "@/features/anomaly-capture/ui/AnomalyCard";


export default function MonitoringPage() {
    const {
        anomalies,
        isLoading,
        error,
        stats,
        sseConnected,
        capturingIds,
        handleCapture,
    } = useMonitoring()

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h2>Error Loading Dashboard</h2>
                <p>{(error as Error).message}</p>
                <button
                    onClick={() => window.location.reload()}
                    className={styles.retryButton}
                >
                    Reload
                </button>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Tokyo Spirit Taskforce Monitoring</h1>
                <p className={styles.subtitle}>
                    Real-time monitoring of spiritual energy anomalies across Tokyo.
                    Deploy capture teams when threat levels escalate.
                </p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.total}</div>
                    <div className={styles.statLabel}>Total Anomalies</div>
                </div>

                <div className={`${styles.statCard} ${styles.activeCard}`}>
                    <div className={styles.statValue}>{stats.active}</div>
                    <div className={styles.statLabel}>Active</div>
                </div>

                <div className={`${styles.statCard} ${styles.capturedCard}`}>
                    <div className={styles.statValue}>{stats.captured}</div>
                    <div className={styles.statLabel}>Captured</div>
                </div>

                <div className={`${styles.statCard} ${styles.criticalCard}`}>
                    <div className={styles.statValue}>{stats.critical}</div>
                    <div className={styles.statLabel}>Critical Threats</div>
                </div>
            </div>

            <div className={styles.anomaliesList}>
                {isLoading ? (
                    <div className={styles.loading}>
                        <div className={styles.spinner}></div>
                        <p>Loading anomalies...</p>
                    </div>
                ) : (
                    <>
                        {anomalies.map((anomaly) => (
                            <AnomalyCard
                                key={anomaly.id}
                                {...anomaly}
                                onCapture={handleCapture}
                                isCapturing={capturingIds.includes(anomaly.id)}
                            />
                        ))}

                        {anomalies.length === 0 && (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>🎉</div>
                                <h3>All Clear!</h3>
                                <p>No active anomalies detected.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div
                className={`${styles.sseStatus} ${
                    !sseConnected ? styles.disconnected : ''
                }`}
            >
                <div className={styles.statusDot}></div>
                <span>
          {sseConnected ? 'Real-time updates active' : 'Reconnecting...'}
        </span>
            </div>
        </div>
    )
}