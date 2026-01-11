import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Vote } from '@/types/election';
import { CANDIDATES } from '@/data/candidates';

export interface CandidateResult {
    candidateId: string;
    name: string;
    photo: string;
    number: number;
    voteCount: number;
    percentage: number;
    isWinner: boolean;
}

export function useResults() {
    const [results, setResults] = useState<CandidateResult[]>([]);
    const [totalVotes, setTotalVotes] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchAndAggregate() {
            if (!database) {
                setError(new Error('Firebase not initialized'));
                setLoading(false);
                return;
            }

            try {
                const votesRef = ref(database, 'votes');
                const snapshot = await get(votesRef);
                const votesData = snapshot.val() || {};

                // Count votes per candidate
                const counts: Record<string, number> = {};
                CANDIDATES.forEach(c => counts[c.id] = 0);

                Object.values(votesData).forEach((vote: unknown) => {
                    const v = vote as Vote;
                    if (counts[v.candidate_id] !== undefined) {
                        counts[v.candidate_id]++;
                    }
                });

                const total = Object.values(counts).reduce((a, b) => a + b, 0);
                const maxVotes = Math.max(...Object.values(counts));

                const candidateResults: CandidateResult[] = CANDIDATES.map(c => ({
                    candidateId: c.id,
                    name: c.name,
                    photo: c.photo,
                    number: c.number,
                    voteCount: counts[c.id],
                    percentage: total > 0 ? (counts[c.id] / total) * 100 : 0,
                    isWinner: counts[c.id] === maxVotes && maxVotes > 0,
                }));

                setResults(candidateResults);
                setTotalVotes(total);
                setLoading(false);
            } catch (err) {
                setError(err as Error);
                setLoading(false);
            }
        }

        fetchAndAggregate();
    }, []);

    return { results, totalVotes, loading, error };
}
