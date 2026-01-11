'use client';
import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ThankYouScreenProps {
    onComplete: () => void; // Called after display duration
    duration?: number;      // milliseconds, default 3000
}

export function ThankYouScreen({ onComplete, duration = 3000 }: ThankYouScreenProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, duration);

        return () => clearTimeout(timer);
    }, [onComplete, duration]);

    return (
        <div className="min-h-screen bg-coblos-green flex flex-col items-center justify-center p-8">
            <CheckCircle2 className="w-32 h-32 text-white mb-8 animate-bounce" />
            <h1 className="text-6xl font-bold text-white mb-4 text-center">
                TERIMA KASIH
            </h1>
            <p className="text-2xl text-white/90 text-center">
                Suara Anda telah tercatat
            </p>
        </div>
    );
}
