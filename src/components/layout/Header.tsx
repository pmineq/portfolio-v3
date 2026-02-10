import { NavLink, useLocation } from 'react-router-dom';
import cx from 'classnames';
import 'assets/styles/layout.scss';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navWrapRef = useRef<HTMLDivElement>(null);

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
    } else {
      setIsOpen(true);
    }
  }, [isOpen, handleClose]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navWrapRef.current && !navWrapRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, handleClose]);

  return (
    <header className={cx('header', { 'header--sub': !isHome })}>
      <NavLink to="/" className={cx('logo')}>
        <span className="blind">UI Developer 미네 포트폴리오</span>
      </NavLink>
      <div ref={navWrapRef} className={cx('nav-wrap')}>
        {!isHome && (
          <button
            type="button"
            className={cx('nav-button', { 'nav-button--open': isOpen })}
            onClick={handleToggle}
            aria-expanded={isOpen}
            aria-controls="main-navigation"
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <span className="nav-button__bar" />
            <span className="nav-button__bar" />
            <span className="nav-button__bar" />
          </button>
        )}
        <nav
          id="main-navigation"
          className={cx('nav', { 'nav--open': isOpen, 'nav--closing': isClosing })}
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/career">Career</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
      </div>
    </header>
  );
}
