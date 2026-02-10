import cx from 'classnames';
import './ComingSoon.scss';

interface ComingSoonProps {
  pageName?: string;
}

export default function ComingSoon({ pageName }: ComingSoonProps) {
  return (
    <div className={cx('coming-soon')}>
      <div className={cx('coming-soon_character')} />

      <div className={cx('coming-soon_dialog')}>
        {pageName && <span className={cx('coming-soon_name')}>{pageName}</span>}
        <div className={cx('coming-soon_box')}>
          <p className={cx('coming-soon_text')}>
            이 페이지는 아직 준비중이에요!
            <br />
            조금만 기다려 주세요...
          </p>
          <span className={cx('coming-soon_next')} />
        </div>
      </div>
    </div>
  );
}
