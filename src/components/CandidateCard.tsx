'use client';
import { useState } from 'react';
import { Candidate } from '@/types/candidate';
import Image from 'next/image';

interface CandidateCardProps {
    candidate: Candidate;
    onSelect: (candidate: Candidate) => void;
}

export function CandidateCard({ candidate, onSelect }: CandidateCardProps) {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        if (isClicked) return; // Debounce: prevent double-tap

        setIsClicked(true);
        onSelect(candidate);

        // Reset after 500ms
        setTimeout(() => setIsClicked(false), 500);
    };

    return (
        <button
            onClick={handleClick}
            disabled={isClicked}
            className={`
                relative w-full h-full min-h-touch
                bg-white rounded-lg shadow-lg
                overflow-hidden
                transition-all duration-200
                hover:ring-4 hover:ring-coblos-green hover:shadow-xl
                active:scale-98
                disabled:opacity-70
                flex flex-col
            `}
        >
            {/* Candidate Number Badge */}
            <div className="absolute top-4 left-4 z-10 bg-deep-slate text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold shadow-md">
                {candidate.number}
            </div>

            {/* Candidate Photo */}
            <div className="relative w-full flex-1 bg-slate-100">
                <Image
                    src={candidate.photo}
                    alt={candidate.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                />
            </div>

            {/* Candidate Name */}
            <div className="p-4 bg-white">
                <h2 className="text-2xl font-bold text-deep-slate text-center">
                    {candidate.name}
                </h2>
            </div>
        </button>
    );
}
