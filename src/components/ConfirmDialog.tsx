'use client';
import { BigButton } from './BigButton';
import * as Dialog from '@radix-ui/react-dialog';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    message: string;
    confirmText: string;
    cancelText?: string;
    variant?: 'danger' | 'warning';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText,
    cancelText = 'Batal',
    variant = 'danger',
    isLoading = false,
}: ConfirmDialogProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full z-50">
                    {/* Close Button */}
                    <Dialog.Close
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        <X className="w-6 h-6 text-slate-600" />
                    </Dialog.Close>

                    {/* Warning Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`p-4 rounded-full ${variant === 'danger' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                            <AlertTriangle className={`w-12 h-12 ${variant === 'danger' ? 'text-indonesian-red' : 'text-yellow-600'}`} />
                        </div>
                    </div>

                    {/* Title */}
                    <Dialog.Title className="text-2xl font-bold text-center text-deep-slate mb-4">
                        {title}
                    </Dialog.Title>

                    {/* Message */}
                    <p className="text-lg text-center text-slate-600 mb-8">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <BigButton
                            variant="danger"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {isLoading ? 'Memproses...' : confirmText}
                        </BigButton>
                        <BigButton
                            variant="primary"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            {cancelText}
                        </BigButton>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
