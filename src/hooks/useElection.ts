import { useState, useEffect } from 'react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { ElectionState, ElectionStatus } from '@/types/election';

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
            session_id: crypto.randomUUID(),
        });
    };

    const unlockBooth = () => updateStatus('READY');
    const lockBooth = () => updateStatus('LOCKED');
    const setVoting = () => updateStatus('VOTING');

    return { state, loading, error, unlockBooth, lockBooth, setVoting, updateStatus };
}
