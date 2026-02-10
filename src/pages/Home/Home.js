import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import cx from 'classnames';
import './Home.scss';
import SunMoonToggle from './SunMoonToggle/SunMoonToggle';
import { useCharacterMovement } from './hook/useCharacterMovement';
export default function Home() {
    const { posVW, isLeft, isRight } = useCharacterMovement();
    return (_jsxs("div", { className: cx('home'), children: [_jsxs("div", { className: cx('home-content'), children: [_jsx("div", { className: cx('home-bg-mountain') }), _jsx("div", { className: cx('home-bg-cloud', 'home-bg-cloud--left') }), _jsx("div", { className: cx('home-bg-cloud', 'home-bg-cloud--right') }), _jsx(SunMoonToggle, {}), _jsx("div", { className: cx('home-ballon') }), _jsx("div", { className: cx('home-zeppelin') })] }), _jsx("div", { className: cx('home-bottom'), children: _jsx("div", { className: cx('home-character'), children: _jsxs("div", { className: cx('home-character_character', { 'home-character_character--right': isRight }, { 'home-character_character--left': isLeft }), style: { transform: `translateX(${posVW}vw)` }, children: [_jsxs("span", { className: cx('home-character_level'), children: ["Lv. ", _jsx("em", { children: "6" }), _jsx("span", { className: cx('home-character_level-small'), children: "\uB144\uCC28" })] }), _jsx("span", { className: cx('home-character_name'), children: "MINE" })] }) }) })] }));
}
