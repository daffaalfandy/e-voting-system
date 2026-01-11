'use client';
import { useKioskAuth } from '@/hooks/useAuth';
import { useElection } from '@/hooks/useElection';
import { PinInput } from '@/components/PinInput';
import { StatusBanner } from '@/components/StatusBanner';
import { LockKeyhole } from 'lucide-react';

export const dynamic = 'force-dynamic';


export default function KioskPage() {
    const { isAuthorized, authorize } = useKioskAuth();
    const { state, loading } = useElection();

    if (!isAuthorized) {
        return <PinInput onSubmit={authorize} title="Otorisasi Bilik Suara" />;
    }

    if (loading || !state) {
        return (
            <div className="min-h-screen bg-deep-slate flex items-center justify-center">
                <p className="text-white text-2xl">Menghubungkan...</p>
            </div>
        );
    }

    // LOCKED state - Screensaver
    if (state.status === 'LOCKED') {
        return (
            <div className="min-h-screen bg-deep-slate flex flex-col items-center justify-center">
                <LockKeyhole className="w-32 h-32 text-slate-400 mb-8" />
                <h1 className="text-4xl font-bold text-white mb-4">MENUNGGU PETUGAS</h1>
                <p className="text-xl text-slate-400">Harap tunggu hingga petugas membuka bilik suara</p>
            </div>
        );
    }

    // READY state - Will show candidate grid in Epic 2
    if (state.status === 'READY') {
        return (
            <div className="min-h-screen bg-paper-white flex flex-col">
                <StatusBanner status={state.status} />
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-2xl text-slate-600">
                        [Kandidat akan ditampilkan di sini - Epic 2]
                    </p>
                </div>
            </div>
        );
    }

    // COMPLETED state - Will show results in Epic 3
    return (
        <div className="min-h-screen bg-paper-white flex flex-col">
            <StatusBanner status={state.status} />
            <div className="flex-1 flex items-center justify-center">
                <p className="text-2xl text-slate-600">
                    [Hasil akan ditampilkan di sini - Epic 3]
                </p>
            </div>
        </div>
    );
}
