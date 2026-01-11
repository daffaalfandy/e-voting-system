'use client';
import { useState } from 'react';
import { Candidate } from '@/types/candidate';
import { BigButton } from './BigButton';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import Image from 'next/image';

interface VoteConfirmModalProps {
    candidate: Candidate | null;
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
}

export function VoteConfirmModal({
    candidate,
    isOpen,
    onConfirm,
    onCancel,
    isSubmitting,
}: VoteConfirmModalProps) {
    const [isVisiMisiExpanded, setIsVisiMisiExpanded] = useState(false);

    if (!candidate) return null;

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-50">
                    {/* Close Button */}
                    <Dialog.Close
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </Dialog.Close>

                    {/* Candidate Photo */}
                    <div className="relative w-full aspect-square max-w-sm mx-auto mb-6 rounded-xl overflow-hidden shadow-lg">
                        <Image
                            src={candidate.photo}
                            alt={candidate.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>

                    {/* Confirmation Text */}
                    <Dialog.Title className="text-3xl font-bold text-center text-deep-slate mb-2">
                        Anda yakin memilih
                    </Dialog.Title>
                    <p className="text-4xl font-bold text-center text-coblos-green mb-6">
                        {candidate.name}?
                    </p>

                    {/* Visi & Misi Expandable Section */}
                    <div className="mb-8 border border-slate-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setIsVisiMisiExpanded(!isVisiMisiExpanded)}
                            className="w-full px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left"
                            disabled={isSubmitting}
                        >
                            <span className="text-xl font-semibold text-deep-slate">
                                Lihat Visi & Misi
                            </span>
                            {isVisiMisiExpanded ? (
                                <ChevronUp className="w-6 h-6 text-slate-600" />
                            ) : (
                                <ChevronDown className="w-6 h-6 text-slate-600" />
                            )}
                        </button>

                        {isVisiMisiExpanded && (
                            <div className="px-6 py-4 bg-white">
                                {/* Visi */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-deep-slate mb-2">
                                        Visi:
                                    </h3>
                                    <p className="text-base text-slate-700 leading-relaxed">
                                        {candidate.visi}
                                    </p>
                                </div>

                                {/* Misi */}
                                <div>
                                    <h3 className="text-lg font-bold text-deep-slate mb-2">
                                        Misi:
                                    </h3>
                                    <ul className="list-disc list-inside space-y-2">
                                        {candidate.misi.map((item, index) => (
                                            <li key={index} className="text-base text-slate-700 leading-relaxed">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <BigButton
                            variant="success"
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Memproses...' : 'Ya, Saya Yakin'}
                        </BigButton>
                        <BigButton
                            variant="danger"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Batal
                        </BigButton>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
