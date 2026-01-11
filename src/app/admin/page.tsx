'use client';
import { useAdminAuth } from '@/hooks/useAuth';
import { useElection } from '@/hooks/useElection';
import { PinInput } from '@/components/PinInput';
import { BigButton } from '@/components/BigButton';
import { StatusBanner } from '@/components/StatusBanner';

export const dynamic = 'force-dynamic';


export default function AdminPage() {
    const { isAuthorized, authorize } = useAdminAuth();
    const { state, loading, error, unlockBooth, lockBooth } = useElection();

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
                    <BigButton variant="success" onClick={unlockBooth} className="w-full max-w-md">
                        🔓 BUKA BILIK
                    </BigButton>
                )}

                {state.status === 'READY' && (
                    <div className="text-center space-y-4">
                        <p className="text-xl text-coblos-green font-semibold animate-pulse">
                            Menunggu pemilih memasuki bilik...
                        </p>
                        <BigButton variant="danger" onClick={lockBooth} className="w-full max-w-md">
                            🔒 KUNCI BILIK
                        </BigButton>
                    </div>
                )}

                {state.status === 'COMPLETED' && (
                    <p className="text-xl text-slate-600">
                        Pemilihan telah berakhir. Lihat hasil di layar Kiosk.
                    </p>
                )}
            </div>

            <div className="p-4 text-center text-sm text-slate-400">
                Terakhir diperbarui: {new Date(state.last_updated).toLocaleTimeString('id-ID')}
            </div>
        </div>
    );
}
