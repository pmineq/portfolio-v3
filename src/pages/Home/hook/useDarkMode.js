import { useEffect, useMemo, useState } from 'react';
const STORAGE_KEY = 'darkmode';
function readStored() {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === null)
            return null;
        return v === 'true';
    }
    catch {
        return null;
    }
}
function prefersDark() {
    if (typeof window === 'undefined' || !window.matchMedia)
        return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
function applyToHtml(isDark) {
    if (typeof document === 'undefined')
        return;
    document.documentElement.dataset.darkmode = isDark ? 'true' : 'false';
}
export function useDarkMode() {
    // 초기값: localStorage → 시스템 선호도 → false
    const initial = useMemo(() => {
        if (typeof window === 'undefined')
            return false;
        const saved = readStored();
        return saved ?? prefersDark();
    }, []);
    const [isDark, setIsDark] = useState(initial);
    // 변경 시 HTML data-attr + localStorage 동기화
    useEffect(() => {
        applyToHtml(isDark);
        try {
            localStorage.setItem(STORAGE_KEY, String(isDark));
        }
        catch { }
    }, [isDark]);
    // 시스템 테마/다른 탭 변경 반영
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const onMedia = (e) => {
            const saved = readStored();
            // 사용자가 저장해둔 값이 없을 때만 시스템 선호도 반영
            if (saved === null)
                setIsDark('matches' in e ? e.matches : media.matches);
        };
        media.addEventListener?.('change', onMedia);
        // storage 이벤트(다른 탭에서 변경) 반영
        const onStorage = (ev) => {
            if (ev.key === STORAGE_KEY && ev.newValue != null) {
                setIsDark(ev.newValue === 'true');
            }
        };
        window.addEventListener('storage', onStorage);
        return () => {
            media.removeEventListener?.('change', onMedia);
            window.removeEventListener('storage', onStorage);
        };
    }, []);
    const toggle = () => setIsDark((v) => !v);
    const setLight = () => setIsDark(false);
    const setDark = () => setIsDark(true);
    return { isDark, toggle, setLight, setDark };
}
