import { useState, useEffect } from 'react';

const DEVICE_ID_KEY = 'device_id';

export function useDeviceId() {
    const [deviceId, setDeviceId] = useState<string>('');

    useEffect(() => {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
            // Robust UUID generation that works in non-secure contexts (HTTP)
            if (typeof crypto !== 'undefined' && crypto.randomUUID) {
                id = crypto.randomUUID();
            } else {
                // Fallback for non-secure contexts (e.g. LAN IP access)
                id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    const r = Math.random() * 16 | 0;
                    const v = c === 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }
            localStorage.setItem(DEVICE_ID_KEY, id);
        }
        setDeviceId(id);
    }, []);

    return deviceId;
}
