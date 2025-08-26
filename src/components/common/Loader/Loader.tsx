import { motion } from 'framer-motion';
import cx from 'classnames';
import 'components/common/Loader/Loader.scss';

export default function Loader() {
  return (
    <motion.div
      className={cx('loader', 'is-full')}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={cx('loader__brand')} />

      <div className={cx('loader__bar')}>
        <motion.div
          className={cx('loader__bar-percent')}
          initial={{ translateX: '-100%' }}
          animate={{ translateX: 0 }}
          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        ></motion.div>
      </div>
      <div className={cx('loader__text')}>LOADING</div>
    </motion.div>
  );
}
