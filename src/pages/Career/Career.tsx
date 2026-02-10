import cx from 'classnames';
import ComingSoon from 'components/common/ComingSoon';
import './Career.scss';

export default function Career() {
  return (
    <div className={cx('career')}>
      <ComingSoon pageName="Career" />
    </div>
  );
}
