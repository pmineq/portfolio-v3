import cx from 'classnames';
import ComingSoon from 'components/common/ComingSoon';
import './About.scss';

export default function About() {
  return (
    <div className={cx('about')}>
      <ComingSoon pageName="About" />
    </div>
  );
}
