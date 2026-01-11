import Image from 'next/image';
import { Trophy } from 'lucide-react';
import { CandidateResult } from '@/hooks/useResults';

interface ResultBarProps {
    result: CandidateResult;
}

export function ResultBar({ result }: ResultBarProps) {
    return (
        <div className={`flex items-center gap-4 p-4 rounded-xl ${result.isWinner ? 'bg-coblos-green/10 ring-2 ring-coblos-green' : 'bg-slate-50'}`}>
            {/* Candidate Photo */}
            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                <Image
                    src={result.photo}
                    alt={result.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                />
            </div>

            {/* Info & Bar */}
            <div className="flex-1 min-w-0">
                {/* Name Row with Winner Badge */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl font-bold text-deep-slate">
                        {result.number}. {result.name}
                    </span>
                    {result.isWinner && (
                        <Trophy className="w-6 h-6 text-coblos-green flex-shrink-0" />
                    )}
                </div>

                {/* Bar Chart */}
                <div className="h-8 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all duration-500 ${result.isWinner ? 'bg-coblos-green' : 'bg-deep-slate'}`}
                        style={{ width: `${Math.max(result.percentage, 2)}%` }}
                    />
                </div>

                {/* Vote Count */}
                <div className="flex justify-between mt-2 text-lg">
                    <span className="font-semibold text-slate-700">
                        {result.voteCount} suara
                    </span>
                    <span className="text-slate-500">
                        {result.percentage.toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
}
