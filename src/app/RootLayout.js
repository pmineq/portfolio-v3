import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import BootLoader from 'components/common/Loader/Loader';
export default function RootLayout() {
    const [boot, setBoot] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setBoot(false), 1200); // 디자인용 부트 로딩 시간
        return () => clearTimeout(t);
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: boot && _jsx(BootLoader, {}) }), !boot && (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "container", children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }))] }));
}
