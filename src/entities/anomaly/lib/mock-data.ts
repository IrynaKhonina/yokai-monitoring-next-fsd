import {v4 as uuidv4} from 'uuid';
import {Anomaly} from "@/entities/anomaly/model/types";

export const initialAnomalies: Anomaly[] = [
    {
        id: uuidv4(),
        name: 'Kitsune',
        threat: 'Medium',
        location: 'Shinjuku',
        status: 'Active',
    },
    {
        id: uuidv4(),
        name: 'Tengu',
        threat: 'High',
        location: 'Ueno Park',
        status: 'Active',
    },
    {
        id: uuidv4(),
        name: 'Yurei',
        threat: 'Low',
        location: 'Asakusa Temple',
        status: 'Active',
    },
    {
        id: uuidv4(),
        name: 'Oni',
        threat: 'Critical',
        location: 'Roppongi Hills',
        status: 'Active',
    },
    {
        id: uuidv4(),
        name: 'Nekomata',
        threat: 'Medium',
        location: 'Shibuya Crossing',
        status: 'Active',
    },
    {
        id: uuidv4(),
        name: 'Kappa',
        threat: 'Low',
        location: 'Sumida River',
        status: 'Active',
    },
]

export class ServerState {
    private static instance: ServerState
    anomalies: Anomaly[]

    private constructor() {
        this.anomalies = [...initialAnomalies]
    }

    static getInstance(): ServerState {
        if (!ServerState.instance) {
            ServerState.instance = new ServerState()
        }
        return ServerState.instance
    }
}