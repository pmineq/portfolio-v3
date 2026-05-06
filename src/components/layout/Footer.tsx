import cx from 'classnames';
import { useGame } from 'context/GameContext';
import { useLocation } from 'react-router-dom';
import 'assets/styles/layout.scss';

export default function Footer() {
  const { muted, toggleMute, playClick } = useGame();
  const { pathname } = useLocation();

  return (
    <footer className={cx('footer', { 'footer--home': pathname === '/' })}>
      <span>© 2026 미네 포트폴리오</span>
      <button
        type="button"
        className={cx('footer-mute')}
        onClick={() => {
          playClick();
          toggleMute();
        }}
        aria-label={muted ? '소리 켜기' : '소리 끄기'}
        title={muted ? '소리 켜기' : '소리 끄기'}
      >
        {muted ? '🔇' : '🔊'}
      </button>
    </footer>
  );
}
