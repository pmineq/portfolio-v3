import cx from 'classnames';
import './Home.scss';
import SunMoonToggle from './SunMoonToggle/SunMoonToggle';
import { useCharacterMovement } from './hock/useCharacterMovement';

export default function Home() {
  const { posVW, isLeft, isRight } = useCharacterMovement();

  return (
    <div className={cx('home')}>
      <div className={cx('home-content')}>
        <div className={cx('home-bg-mountain')} />
        <div className={cx('home-bg-cloud', 'home-bg-cloud--left')} />
        <div className={cx('home-bg-cloud', 'home-bg-cloud--right')} />

        {/* 해/달 토글 버튼 */}
        <SunMoonToggle />

        {/* 배경 소품 */}
        <div className={cx('home-ballon')} />
        <div className={cx('home-zeppelin')} />
      </div>

      <div className={cx('home-bottom')}>
        <div className={cx('home-character')}>
          <div
            className={cx(
              'home-character_character',
              { 'home-character_character--right': isRight },
              { 'home-character_character--left': isLeft },
            )}
            style={{ transform: `translateX(${posVW}vw)` }}
          >
            <span className={cx('home-character_level')}>
              Lv. <em>6</em>
              <span className={cx('home-character_level-small')}>년차</span>
            </span>
            <span className={cx('home-character_name')}>MINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
