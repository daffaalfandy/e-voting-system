'use client';

interface ProgressBarProps {
    duration?: number; // milliseconds, default 1500
}

export function ProgressBar({ duration = 1500 }: ProgressBarProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                <div
                    className="h-full bg-coblos-green rounded-full transition-all ease-linear"
                    style={{
                        animation: `progress ${duration}ms linear forwards`,
                    }}
                />
            </div>
            <style jsx>{`
                @keyframes progress {
                    from {
                        width: 0%;
                    }
                    to {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}
