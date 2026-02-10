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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    } catch (err) {
      alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className={cx('contact')}>
      {/* 왼쪽 스마트폰 이미지 */}
      <button
        type="button"
        className={cx('contact-phone', { active: phoneActive })}
        onClick={() => setPhoneActive(!phoneActive)}
        aria-label="스마트폰 아이콘"
      />

      {/* 오른쪽 커피컵 이미지 */}
      <button
        type="button"
        className={cx('contact-cup', { active: cupActive })}
        onClick={() => setCupActive(!cupActive)}
        aria-label="커피컵 아이콘"
      />

      <form className={cx('contact-letter')} onSubmit={handleSubmit}>
        <div className={cx('contact-letter__body')}>
          {/* 제목 */}
          <div className={cx('contact-field')}>
            <label htmlFor="subject">
              <span className={cx('contact-field__icon')}>*</span> 제목
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={cx('contact-input')}
            />
          </div>

          {/* 이름 */}
          <div className={cx('contact-field')}>
            <label htmlFor="name">
              <span className={cx('contact-field__icon')}>*</span> 이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={cx('contact-input')}
              required
            />
          </div>

          {/* 이메일 */}
          <div className={cx('contact-field')}>
            <label htmlFor="email">
              <span className={cx('contact-field__icon')}>*</span> 이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={cx('contact-input')}
              required
            />
          </div>

          {/* 내용 */}
          <div className={cx('contact-field', 'contact-field--message')}>
            <label htmlFor="message">
              <span className={cx('contact-field__icon')}>*</span> 내용
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={cx('contact-textarea')}
              rows={5}
              required
            />
          </div>

          {/* 개인정보 수집 및 이용 동의 */}
          <div className={cx('contact-agreement')}>
            <label htmlFor="agreement">
              개인정보 수집 및 이용 동의
              <input
                type="checkbox"
                id="agreement"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className={cx('contact-checkbox')}
              />
              <span className={cx('contact-checkbox__custom')} />
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && <div className={cx('contact-message', 'contact-message--error')}>{error}</div>}

          {/* 성공 메시지 */}
          {success && (
            <div className={cx('contact-message', 'contact-message--success')}>
              메일이 성공적으로 전송되었습니다!
            </div>
          )}

          {/* 전송 버튼 */}
          <button type="submit" className={cx('contact-submit')} disabled={isLoading}>
            {isLoading ? '전송 중...' : '전송'}
          </button>
        </div>
      </form>
    </div>
  );
}
