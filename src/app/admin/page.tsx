'use client';
import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAuth';
import { useElection } from '@/hooks/useElection';
import { PinInput } from '@/components/PinInput';
import { BigButton } from '@/components/BigButton';
import { StatusBanner } from '@/components/StatusBanner';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export const dynamic = 'force-dynamic';


export default function AdminPage() {
    const { isAuthorized, authorize } = useAdminAuth();
    const { state, loading, error, unlockBooth, lockBooth, endElection, resetElection } = useElection();

    // Dialog states
    const [showEndDialog, setShowEndDialog] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Handlers
    const handleEndElection = async () => {
        setIsProcessing(true);
        await endElection();
        setIsProcessing(false);
        setShowEndDialog(false);
    };

    const handleResetElection = async () => {
        setIsProcessing(true);
        await resetElection();
        setIsProcessing(false);
        setShowResetDialog(false);
    };

    if (!isAuthorized) {
        return <PinInput onSubmit={authorize} title="Panel Petugas" />;
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
            <div className="min-h-screen bg-paper-white flex items-center justify-center">
                <p className="text-2xl text-slate-600">Menghubungkan ke server...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-paper-white flex flex-col">
            <StatusBanner status={state.status} />

            <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
                <div className="text-center">
                    <p className="text-lg text-slate-500">Status Bilik Suara</p>
                    <p className="text-4xl font-bold text-deep-slate mt-2">
                        {state.status === 'LOCKED' ? 'TERKUNCI' :
                            state.status === 'READY' ? 'SIAP MENERIMA' :
                                state.status === 'VOTING' ? 'SEDANG DIGUNAKAN' : 'SELESAI'}
                    </p>
                </div>

                {state.status === 'LOCKED' && (
                    <div className="flex flex-col gap-4 w-full max-w-md">
                        <BigButton variant="success" onClick={unlockBooth} className="w-full">
                            🔓 BUKA BILIK
                        </BigButton>
                        <BigButton variant="danger" onClick={() => setShowEndDialog(true)} className="w-full">
                            ⚠️ AKHIRI PEMILIHAN
                        </BigButton>
                    </div>
                )}

                {state.status === 'READY' && (
                    <div className="text-center space-y-4 w-full max-w-md">
                        <p className="text-xl text-coblos-green font-semibold animate-pulse">
                            Menunggu pemilih memasuki bilik...
                        </p>
                        <BigButton variant="danger" onClick={lockBooth} className="w-full">
                            🔒 KUNCI BILIK
                        </BigButton>
                        <BigButton variant="danger" onClick={() => setShowEndDialog(true)} className="w-full">
                            ⚠️ AKHIRI PEMILIHAN
                        </BigButton>
                    </div>
                )}

                {state.status === 'VOTING' && (
                    <div className="text-center space-y-4 w-full max-w-md">
                        <p className="text-xl text-coblos-green font-semibold animate-pulse">
                            Pemilih sedang memberikan suara...
                        </p>
                        <BigButton variant="danger" onClick={() => setShowEndDialog(true)} className="w-full">
                            ⚠️ AKHIRI PEMILIHAN
                        </BigButton>
                    </div>
                )}

                {state.status === 'COMPLETED' && (
                    <div className="text-center space-y-4 w-full max-w-md">
                        <p className="text-xl text-slate-600">
                            Pemilihan telah berakhir. Lihat hasil di layar Kiosk.
                        </p>
                        <BigButton variant="danger" onClick={() => setShowResetDialog(true)} className="w-full">
                            🔄 RESET DATA (Testing)
                        </BigButton>
                    </div>
                )}
            </div>

            <div className="p-4 text-center text-sm text-slate-400">
                Terakhir diperbarui: {new Date(state.last_updated).toLocaleTimeString('id-ID')}
            </div>

            {/* End Election Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showEndDialog}
                onConfirm={handleEndElection}
                onCancel={() => setShowEndDialog(false)}
                title="AKHIRI PEMILIHAN?"
                message="Tindakan ini tidak dapat dibatalkan. Setelah pemilihan diakhiri, hasil akan ditampilkan di layar Kiosk."
                confirmText="Ya, Akhiri"
                isLoading={isProcessing}
            />

            {/* Reset Data Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showResetDialog}
                onConfirm={handleResetElection}
                onCancel={() => setShowResetDialog(false)}
                title="RESET SEMUA DATA?"
                message="PERINGATAN: Semua suara akan dihapus dan pemilihan akan direset. Tindakan ini tidak dapat dibatalkan!"
                confirmText="Ya, Reset"
                isLoading={isProcessing}
            />
        </div>
    );
}

