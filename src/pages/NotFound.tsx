import cx from 'classnames';
import { useEffect, type CSSProperties } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from 'context/GameContext';
import './NotFound.scss';

const rescueSteps = ['SCAN', 'MAP', 'WARP'];
const copy = {
  lead: '\ubbf8\ub4f1\ub85d \ud3ec\ud0c8\uc5d0 \ucc29\ub959\ud588\uc5b4\uc694.',
  progress: '\uad6c\uc870 \uc9c4\ud589\ub3c4',
  home: '\ud648\uc73c\ub85c \uc6cc\ud504',
  contact: '\uad6c\uc870 \uc694\uccad',
  cat: '\uc5ec\uae34 \uc544\uc9c1 \ub9f5 \ubc16!',
};
const stars = [
  [12, 16],
  [24, 9],
  [38, 22],
  [52, 13],
  [68, 20],
  [84, 11],
  [8, 42],
  [19, 58],
  [31, 36],
  [46, 48],
  [59, 34],
  [73, 55],
  [89, 43],
  [15, 74],
  [36, 68],
  [57, 76],
  [78, 70],
  [93, 62],
];

export default function NotFound() {
  const { pathname } = useLocation();
  const { unlock, playClick } = useGame();

  useEffect(() => {
    unlock('lost_explorer');
  }, [unlock]);

  return (
    <main className={cx('not-found')}>
      <div className={cx('not-found__world')}>
        <div className={cx('not-found__stars')} aria-hidden>
          {stars.map(([left, top], index) => (
            <span
              key={`${left}-${top}`}
              style={
                {
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${index * -0.13}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        <section className={cx('not-found__panel')} aria-labelledby="not-found-title">
          <div className={cx('not-found__badge')}>HIDDEN ROUTE</div>
          <h1 id="not-found-title">404</h1>
          <p className={cx('not-found__lead')}>{copy.lead}</p>
          <p className={cx('not-found__path')} title={pathname}>
            {pathname}
          </p>

          <div className={cx('not-found__quest')} aria-label={copy.progress}>
            {rescueSteps.map((step) => (
              <span key={step}>{step}</span>
            ))}
          </div>

          <div className={cx('not-found__actions')}>
            <Link className={cx('not-found__button', 'not-found__button--primary')} to="/" onClick={playClick}>
              {copy.home}
            </Link>
            <Link className={cx('not-found__button')} to="/contact" onClick={playClick}>
              {copy.contact}
            </Link>
          </div>
        </section>

        <div className={cx('not-found__scene')} aria-hidden>
          <div className={cx('not-found__portal')} />
          <div className={cx('not-found__cat')}>
            <span>{copy.cat}</span>
          </div>
          <div className={cx('not-found__character')} />
        </div>
      </div>
    </main>
  );
}
