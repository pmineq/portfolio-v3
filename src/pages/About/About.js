import { jsx as _jsx } from "react/jsx-runtime";
import cx from 'classnames';
import ComingSoon from 'components/common/ComingSoon';
import './About.scss';
export default function About() {
    return (_jsx("div", { className: cx('about'), children: _jsx(ComingSoon, { pageName: "About" }) }));
}
