export type ElectionStatus = 'LOCKED' | 'READY' | 'VOTING' | 'COMPLETED';

export interface ElectionState {
    status: ElectionStatus;
    last_updated: number;
    session_id: string;
}

export interface Vote {
    candidate_id: string;
    timestamp: number;
    device_id: string;
}
