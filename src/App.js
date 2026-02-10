import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { router } from 'app/router';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import BootLoader from 'components/common/Loader/Loader';
export default function App() {
    const [boot, setBoot] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setBoot(false), 1200); // 연출 시간
        return () => clearTimeout(t);
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(AnimatePresence, { children: boot && _jsx(BootLoader, {}) }), !boot && (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(RouterProvider, { router: router }), _jsx(Footer, {})] }))] }));
}
