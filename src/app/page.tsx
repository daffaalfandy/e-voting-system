'use client';
import { useState } from 'react';
import { useKioskAuth } from '@/hooks/useAuth';
import { useElection } from '@/hooks/useElection';
import { useVote } from '@/hooks/useVote';
import { useDeviceId } from '@/hooks/useDeviceId';
import { PinInput } from '@/components/PinInput';
import { StatusBanner } from '@/components/StatusBanner';
import { CandidateGrid } from '@/components/CandidateGrid';
import { VoteConfirmModal } from '@/components/VoteConfirmModal';
import { ThankYouScreen } from '@/components/ThankYouScreen';
import { ProgressBar } from '@/components/ProgressBar';
import { Candidate } from '@/types/candidate';
import { LockKeyhole } from 'lucide-react';

export const dynamic = 'force-dynamic';


export default function KioskPage() {
    const { isAuthorized, authorize } = useKioskAuth();
    const { state, loading, error, lockBooth, setVoting } = useElection();
    const { submitVote, isSubmitting } = useVote();
    const deviceId = useDeviceId();

    // Voting flow state
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [showThankYou, setShowThankYou] = useState(false);

    // Handlers
    const handleSelectCandidate = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setIsConfirmOpen(true);
    };

    const handleCancelVote = () => {
        setIsConfirmOpen(false);
        setSelectedCandidate(null);
    };

    const handleConfirmVote = async () => {
        if (!selectedCandidate) return;

        if (!deviceId) {
            alert('Error: Device ID missing. Please refresh the kiosk.');
            return;
        }

        setIsConfirmOpen(false);
        await setVoting(); // Transition to VOTING state

        const success = await submitVote(selectedCandidate.id, deviceId);

        if (success) {
            setShowThankYou(true);
        } else {
            // On error, reset to LOCKED state (Admin can unlock again)
            await lockBooth();
            setSelectedCandidate(null);
        }
    };

    const handleThankYouComplete = async () => {
        setShowThankYou(false);
        setSelectedCandidate(null);
        await lockBooth(); // Auto-lock after thank you
    };

    if (!isAuthorized) {
        return <PinInput onSubmit={authorize} title="Otorisasi Bilik Suara" />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-indonesian-red flex flex-col items-center justify-center p-8 text-white">
                <h1 className="text-3xl font-bold mb-4">Gagal Terhubung</h1>
                <p className="text-xl mb-8 text-center">{error.message}</p>
                <div className="bg-white/10 p-4 rounded text-sm font-mono whitespace-pre-wrap text-left w-full max-w-lg overflow-x-auto">
                    <strong>Debug Info:</strong>{'\n'}
                    Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}{'\n'}
                    Database URL: {process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}
                </div>
            </div>
        );
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

    // READY state - Candidate Grid
    if (state.status === 'READY') {
        return (
            <div className="min-h-screen bg-paper-white flex flex-col">
                <StatusBanner status={state.status} />
                <div className="flex-1 flex flex-col min-h-0">
                    <CandidateGrid onSelectCandidate={handleSelectCandidate} />
                </div>
                <VoteConfirmModal
                    candidate={selectedCandidate}
                    isOpen={isConfirmOpen}
                    onConfirm={handleConfirmVote}
                    onCancel={handleCancelVote}
                    isSubmitting={isSubmitting}
                />
            </div>
        );
    }

    // VOTING state - Show progress or thank you
    if (state.status === 'VOTING') {
        if (showThankYou) {
            return <ThankYouScreen onComplete={handleThankYouComplete} />;
        }
        return (
            <div className="min-h-screen bg-paper-white flex flex-col items-center justify-center">
                <StatusBanner status={state.status} />
                <div className="text-center p-8 w-full max-w-2xl">
                    <p className="text-3xl text-slate-600 mb-8 font-semibold">Mencatat suara Anda...</p>
                    <ProgressBar duration={1500} />
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
