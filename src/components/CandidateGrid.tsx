'use client';
import { Candidate } from '@/types/candidate';
import { CandidateCard } from './CandidateCard';
import { CANDIDATES } from '@/data/candidates';

interface CandidateGridProps {
    onSelectCandidate: (candidate: Candidate) => void;
}

export function CandidateGrid({ onSelectCandidate }: CandidateGridProps) {
    return (
        <div className="flex-1 w-full p-6 flex flex-col min-h-0">
            <div className="grid grid-cols-2 grid-rows-2 gap-6 flex-1 min-h-0">
                {CANDIDATES.map((candidate) => (
                    <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onSelect={onSelectCandidate}
                    />
                ))}
            </div>
        </div>
    );
}
