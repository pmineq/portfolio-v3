import { useState } from 'react';
import emailjs from '@emailjs/browser';

interface EmailData {
  name: string;
  email: string;
  message: string;
}

interface UseEmailJSReturn {
  sendEmail: (data: EmailData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export function useEmailJS(): UseEmailJSReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendEmail = async (data: EmailData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS 환경 변수가 설정되지 않았습니다.');
      }

      const templateParams = {
        contact_name: data.name,
        contact_email: data.email,
        contact_message: data.message,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '이메일 전송에 실패했습니다.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendEmail, isLoading, error, success };
}
