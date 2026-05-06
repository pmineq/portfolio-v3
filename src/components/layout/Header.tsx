import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import cx from 'classnames';
import 'assets/styles/layout.scss';
import AchievementDex from 'components/common/AchievementDex/AchievementDex';
import { useGame } from 'context/GameContext';

export default function Header() {
  const { pathname } = useLocation();
  const { playClick, unlocked } = useGame();
  const [dexOpen, setDexOpen] = useState(false);
  const isHome = pathname === '/';

  return (
    <>
      <header className={cx('header', { 'header--sub': !isHome })}>
        <NavLink to="/" className={cx('logo')} onClick={playClick}>
          <span className="blind">UI Developer 미네 포트폴리오</span>
        </NavLink>
        <div className={cx('nav-wrap')}>
          <nav id="main-navigation" className={cx('nav')}>
            <NavLink to="/" onClick={playClick}>Home</NavLink>
            <NavLink to="/about" onClick={playClick}>About</NavLink>
            <NavLink to="/career" onClick={playClick}>Career</NavLink>
            <NavLink to="/contact" onClick={playClick}>Contact</NavLink>
            <button
              type="button"
              className={cx('nav-achievement')}
              onClick={() => {
                playClick();
                setDexOpen(true);
              }}
              aria-label={`업적 도감 열기, 획득 ${unlocked.size}개`}
            >
              ACH <span>{unlocked.size}</span>
            </button>
          </nav>
        </div>
      </header>
      <AchievementDex open={dexOpen} onClose={() => setDexOpen(false)} />
    </>
  );
}
