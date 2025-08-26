import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import 'assets/styles/layout.scss';

export default function Header() {
  return (
    <header className={cx('header')}>
      <div className={cx('logo')}>
        <span className="blind">UI Developer 미네 포트폴리오</span>
      </div>
      <nav className={cx('nav')}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/projects">Projects</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
    </header>
  );
}
