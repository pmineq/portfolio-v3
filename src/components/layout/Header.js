import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink, useLocation } from 'react-router-dom';
import cx from 'classnames';
import 'assets/styles/layout.scss';
import { useCallback, useEffect, useRef, useState } from 'react';
export default function Header() {
    const { pathname } = useLocation();
    const isHome = pathname === '/';
    const [isOpen, setIsOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const navWrapRef = useRef(null);
    useEffect(() => {
        setIsOpen(false);
        setIsClosing(false);
    }, [pathname]);
    const handleClose = useCallback(() => {
        setIsClosing(true);
        setIsOpen(false);
        const timer = setTimeout(() => setIsClosing(false), 300);
        return () => clearTimeout(timer);
    }, []);
    const handleToggle = useCallback(() => {
        if (isOpen) {
            handleClose();
        }
        else {
            setIsOpen(true);
        }
    }, [isOpen, handleClose]);
    // 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (e) => {
            if (navWrapRef.current && !navWrapRef.current.contains(e.target)) {
                handleClose();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isOpen, handleClose]);
    return (_jsxs("header", { className: cx('header', { 'header--sub': !isHome }), children: [_jsx(NavLink, { to: "/", className: cx('logo'), children: _jsx("span", { className: "blind", children: "UI Developer \uBBF8\uB124 \uD3EC\uD2B8\uD3F4\uB9AC\uC624" }) }), _jsxs("div", { ref: navWrapRef, className: cx('nav-wrap'), children: [!isHome && (_jsxs("button", { type: "button", className: cx('nav-button', { 'nav-button--open': isOpen }), onClick: handleToggle, "aria-expanded": isOpen, "aria-controls": "main-navigation", "aria-label": isOpen ? '메뉴 닫기' : '메뉴 열기', children: [_jsx("span", { className: "nav-button__bar" }), _jsx("span", { className: "nav-button__bar" }), _jsx("span", { className: "nav-button__bar" })] })), _jsxs("nav", { id: "main-navigation", className: cx('nav', { 'nav--open': isOpen, 'nav--closing': isClosing }), children: [_jsx(NavLink, { to: "/", children: "Home" }), _jsx(NavLink, { to: "/about", children: "About" }), _jsx(NavLink, { to: "/career", children: "Career" }), _jsx(NavLink, { to: "/contact", children: "Contact" })] })] })] }));
}
