'use client';
import { useResults } from '@/hooks/useResults';
import { ResultBar } from './ResultBar';
import { Trophy } from 'lucide-react';

export function ResultsDisplay() {
    const { results, totalVotes, loading, error } = useResults();

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl text-slate-600">Menghitung suara...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl text-indonesian-red">Gagal memuat hasil: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Trophy className="w-10 h-10 text-coblos-green" />
                    <h1 className="text-4xl font-bold text-deep-slate">HASIL PEMILIHAN</h1>
                    <Trophy className="w-10 h-10 text-coblos-green" />
                </div>
                <p className="text-xl text-slate-600">
                    Total suara masuk: <span className="font-bold text-deep-slate">{totalVotes}</span>
                </p>
            </div>

            {/* Results List */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                {results.map((result) => (
                    <ResultBar key={result.candidateId} result={result} />
                ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
                <p className="text-lg text-slate-500">
                    Pemilihan telah berakhir. Terima kasih atas partisipasi Anda.
                </p>
            </div>
        </div>
    );
}
