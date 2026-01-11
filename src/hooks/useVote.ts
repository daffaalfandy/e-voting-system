import { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Vote } from '@/types/election';

export function useVote() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const submitVote = async (candidateId: string, deviceId: string): Promise<boolean> => {
        if (!database) {
            setError(new Error('Firebase not initialized'));
            return false;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const votesRef = ref(database, 'votes');
            // Cast timestamp to any because serverTimestamp() returns an object placeholder
            // that Firebase converts to number on server.
            const vote = {
                candidate_id: candidateId,
                timestamp: serverTimestamp(),
                device_id: deviceId,
            };
            await push(votesRef, vote);
            return true;
        } catch (err) {
            setError(err as Error);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { submitVote, isSubmitting, error };
}
