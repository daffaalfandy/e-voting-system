'use client';
import { useState } from 'react';
import { BigButton } from './BigButton';

interface PinInputProps {
    onSubmit: (pin: string) => boolean;
    title: string;
}

export function PinInput({ onSubmit, title }: PinInputProps) {
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = onSubmit(pin);
        if (!success) {
            setError(true);
            setPin('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-paper-white flex items-center justify-center p-8">
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
                <h1 className="text-3xl font-bold text-deep-slate text-center">{title}</h1>
                <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN Acara"
                    className={`
            w-full p-4 text-2xl text-center
            border-2 rounded-lg
            ${error ? 'border-indonesian-red bg-red-50' : 'border-slate-300'}
          `}
                    autoFocus
                />
                {error && (
                    <p className="text-indonesian-red text-center text-lg">PIN salah. Silakan coba lagi.</p>
                )}
                <BigButton type="submit" className="w-full">
                    MASUK
                </BigButton>
            </form>
        </div>
    );
}
