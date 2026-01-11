import { ElectionStatus } from '@/types/election';
import { LockKeyhole, Unlock, Vote, Trophy } from 'lucide-react';

const STATUS_CONFIG: Record<ElectionStatus, { label: string; bgColor: string; icon: typeof LockKeyhole }> = {
    LOCKED: { label: 'MENUNGGU PETUGAS', bgColor: 'bg-indonesian-red', icon: LockKeyhole },
    READY: { label: 'SILAKAN MEMILIH', bgColor: 'bg-coblos-green', icon: Unlock },
    VOTING: { label: 'SEDANG MEMILIH...', bgColor: 'bg-deep-slate', icon: Vote },
    COMPLETED: { label: 'PEMILIHAN SELESAI', bgColor: 'bg-deep-slate', icon: Trophy },
};

export function StatusBanner({ status }: { status: ElectionStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <div className={`${config.bgColor} text-white py-4 px-6 flex items-center justify-center gap-3`}>
            <Icon className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-wide">{config.label}</span>
        </div>
    );
}
