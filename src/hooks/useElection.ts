import { useState, useEffect } from 'react';
import { ref, onValue, set, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ElectionState, ElectionStatus } from '@/types/election';

// Fallback UUID generator for non-secure contexts (HTTP over LAN)
function generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for non-secure contexts (e.g. LAN IP access via HTTP)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function useElection() {
    const [state, setState] = useState<ElectionState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!database) {
            setError(new Error('Firebase not initialized'));
            setLoading(false);
            return;
        }

        const stateRef = ref(database, 'election_state');
        const unsubscribe = onValue(stateRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setState(data);
            } else {
                // Initialize default state if DB is empty
                setState({
                    status: 'LOCKED',
                    last_updated: Date.now(),
                    session_id: 'initial',
                });
            }
            setLoading(false);
        }, (err) => {
            setError(err);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateStatus = async (newStatus: ElectionStatus) => {
        if (!database) {
            throw new Error('Firebase not initialized');
        }
        const stateRef = ref(database, 'election_state');
        await set(stateRef, {
            status: newStatus,
            last_updated: Date.now(),
            session_id: generateUUID(),
        });
    };

    const unlockBooth = () => updateStatus('READY');
    const lockBooth = () => updateStatus('LOCKED');
    const setVoting = () => updateStatus('VOTING');
    const endElection = () => updateStatus('COMPLETED');

    const resetElection = async () => {
        if (!database) {
            throw new Error('Firebase not initialized');
        }

        // Clear all votes
        const votesRef = ref(database, 'votes');
        await remove(votesRef);

        // Reset state to LOCKED
        await updateStatus('LOCKED');
    };

    return { state, loading, error, unlockBooth, lockBooth, setVoting, endElection, resetElection, updateStatus };
}
