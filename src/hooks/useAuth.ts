import { useState, useEffect, useCallback } from 'react';

const EVENT_PIN = process.env.NEXT_PUBLIC_EVENT_PIN || '';
const KIOSK_STORAGE_KEY = 'kiosk_authorized';
const ADMIN_COOKIE_NAME = 'admin_session';

export function useKioskAuth() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(KIOSK_STORAGE_KEY);
        setIsAuthorized(stored === 'true');
    }, []);

    const authorize = useCallback((pin: string): boolean => {
        if (pin === EVENT_PIN) {
            localStorage.setItem(KIOSK_STORAGE_KEY, 'true');
            setIsAuthorized(true);
            return true;
        }
        return false;
    }, []);

    return { isAuthorized, authorize };
}

export function useAdminAuth() {
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith(`${ADMIN_COOKIE_NAME}=`));
        setIsAuthorized(cookie?.split('=')[1] === 'true');
    }, []);

    const authorize = useCallback((pin: string): boolean => {
        if (pin === EVENT_PIN) {
            document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/admin; max-age=86400`;
            setIsAuthorized(true);
            return true;
        }
        return false;
    }, []);

    return { isAuthorized, authorize };
}
