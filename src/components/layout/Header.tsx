import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import cx from 'classnames';
import 'assets/styles/layout.scss';
import AchievementDex from 'components/common/AchievementDex/AchievementDex';
import { ACHIEVEMENTS, useGame } from 'context/GameContext';

export default function Header() {
  const { pathname } = useLocation();
  const { muted, toggleMute, playClick, unlocked } = useGame();
  const [dexOpen, setDexOpen] = useState(false);
  const isHome = pathname === '/';
  const unlockedCount = ACHIEVEMENTS.filter(achievement => unlocked.has(achievement.id)).length;

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
          </nav>
          <div className={cx('nav-actions')} aria-label="포트폴리오 기능">
            <button
              type="button"
              className={cx('nav-action', 'nav-sound', { 'nav-sound--muted': muted })}
              onClick={() => {
                playClick();
                toggleMute();
              }}
              aria-label={muted ? '소리 켜기' : '소리 끄기'}
              title={muted ? '소리 켜기' : '소리 끄기'}
            >
              <span className={cx('nav-action__label')}>소리</span>
              <span className={cx('nav-sound__state')}>{muted ? 'OFF' : 'ON'}</span>
            </button>
            <button
              type="button"
              className={cx('nav-action', 'nav-achievement')}
              onClick={() => {
                playClick();
                setDexOpen(true);
              }}
              aria-label={`업적 도감 열기, 획득 ${unlockedCount}개`}
            >
              <span className={cx('nav-achievement__icon')} aria-hidden />
              <span className={cx('nav-action__label')}>업적</span>
              <span className={cx('nav-achievement__count')}>{unlockedCount}</span>
            </button>
          </div>
        </div>
      </header>
      <AchievementDex open={dexOpen} onClose={() => setDexOpen(false)} />
    </>
  );
}
