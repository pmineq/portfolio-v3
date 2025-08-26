import { useState, useRef } from 'react';
import cx from 'classnames';
import './SunMoonToggle.scss';
import { useDarkMode } from '../hock/useDarkMode';

export default function SunMoonToggle() {
  const { isDark, toggle } = useDarkMode();
  const [initAppear, setInitAppear] = useState(true); // 최초 1회 등장
  const [isSwapping, setIsSwapping] = useState(false); // 클릭 시 내려갔다 올라오기
  const ref = useRef<HTMLButtonElement>(null);
  const timerRef = useRef<number | null>(null);

  const handleSwap = () => {
    if (isSwapping) return;
    setIsSwapping(true);

    // CSS 변수 --swap-dur 읽어서 절반(바닥) 타이밍에 토글 실행
    const el = ref.current!;
    const styles = getComputedStyle(el);
    const durStr = styles.getPropertyValue('--swap-dur').trim() || '800ms';
    const ms = durStr.endsWith('ms') ? parseFloat(durStr) : parseFloat(durStr) * 1000;

    timerRef.current = window.setTimeout(() => {
      toggle(); // 바닥에서 이미지 교체
    }, ms * 0.5);
  };

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isDark}
      onClick={handleSwap}
      className={cx('home-bg-mountain__item', {
        'init-appear': initAppear,
        'is-swapping': isSwapping,
      })}
      onAnimationEnd={(e) => {
        if (e.animationName === 'dipSwap') {
          setIsSwapping(false);
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
        if (e.animationName === 'fadeItemUp') setInitAppear(false); // 최초 1회만
      }}
    />
  );
}
