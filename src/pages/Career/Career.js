import { jsx as _jsx } from "react/jsx-runtime";
import cx from 'classnames';
import ComingSoon from 'components/common/ComingSoon';
import './Career.scss';
export default function Career() {
    return (_jsx("div", { className: cx('career'), children: _jsx(ComingSoon, { pageName: "Career" }) }));
}
