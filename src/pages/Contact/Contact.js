import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import cx from 'classnames';
import './Contact.scss';
import { useEmailJS } from 'hooks/useEmailJS';
export default function Contact() {
    const [formData, setFormData] = useState({
        subject: '',
        name: '',
        email: '',
        message: '',
    });
    const [isAgreed, setIsAgreed] = useState(false);
    const [phoneActive, setPhoneActive] = useState(false);
    const [cupActive, setCupActive] = useState(false);
    const { sendEmail, isLoading, error, success } = useEmailJS();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAgreed) {
            alert('개인정보 수집 및 이용에 동의해주세요.');
            return;
        }
        try {
            await sendEmail(formData);
            alert('메일이 성공적으로 전송되었습니다!');
            // 폼 초기화
            setFormData({
                subject: '',
                name: '',
                email: '',
                message: '',
            });
            setIsAgreed(false);
        }
        catch (err) {
            alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
        }
    };
    return (_jsxs("div", { className: cx('contact'), children: [_jsx("button", { type: "button", className: cx('contact-phone', { active: phoneActive }), onClick: () => setPhoneActive(!phoneActive), "aria-label": "\uC2A4\uB9C8\uD2B8\uD3F0 \uC544\uC774\uCF58" }), _jsx("button", { type: "button", className: cx('contact-cup', { active: cupActive }), onClick: () => setCupActive(!cupActive), "aria-label": "\uCEE4\uD53C\uCEF5 \uC544\uC774\uCF58" }), _jsx("form", { className: cx('contact-letter'), onSubmit: handleSubmit, children: _jsxs("div", { className: cx('contact-letter__body'), children: [_jsxs("div", { className: cx('contact-field'), children: [_jsxs("label", { htmlFor: "subject", children: [_jsx("span", { className: cx('contact-field__icon'), children: "*" }), " \uC81C\uBAA9"] }), _jsx("input", { type: "text", id: "subject", name: "subject", value: formData.subject, onChange: handleChange, className: cx('contact-input') })] }), _jsxs("div", { className: cx('contact-field'), children: [_jsxs("label", { htmlFor: "name", children: [_jsx("span", { className: cx('contact-field__icon'), children: "*" }), " \uC774\uB984"] }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleChange, className: cx('contact-input'), required: true })] }), _jsxs("div", { className: cx('contact-field'), children: [_jsxs("label", { htmlFor: "email", children: [_jsx("span", { className: cx('contact-field__icon'), children: "*" }), " \uC774\uBA54\uC77C"] }), _jsx("input", { type: "email", id: "email", name: "email", value: formData.email, onChange: handleChange, className: cx('contact-input'), required: true })] }), _jsxs("div", { className: cx('contact-field', 'contact-field--message'), children: [_jsxs("label", { htmlFor: "message", children: [_jsx("span", { className: cx('contact-field__icon'), children: "*" }), " \uB0B4\uC6A9"] }), _jsx("textarea", { id: "message", name: "message", value: formData.message, onChange: handleChange, className: cx('contact-textarea'), rows: 5, required: true })] }), _jsx("div", { className: cx('contact-agreement'), children: _jsxs("label", { htmlFor: "agreement", children: ["\uAC1C\uC778\uC815\uBCF4 \uC218\uC9D1 \uBC0F \uC774\uC6A9 \uB3D9\uC758", _jsx("input", { type: "checkbox", id: "agreement", checked: isAgreed, onChange: (e) => setIsAgreed(e.target.checked), className: cx('contact-checkbox') }), _jsx("span", { className: cx('contact-checkbox__custom') })] }) }), error && _jsx("div", { className: cx('contact-message', 'contact-message--error'), children: error }), success && (_jsx("div", { className: cx('contact-message', 'contact-message--success'), children: "\uBA54\uC77C\uC774 \uC131\uACF5\uC801\uC73C\uB85C \uC804\uC1A1\uB418\uC5C8\uC2B5\uB2C8\uB2E4!" })), _jsx("button", { type: "submit", className: cx('contact-submit'), disabled: isLoading, children: isLoading ? '전송 중...' : '전송' })] }) })] }));
}
