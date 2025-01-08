import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AxiosError } from 'axios';
import api from '../api/axios';
import IMAGES from '../assets/images/image';

const OtpVerification = () => {
  const [searchParams] = useSearchParams();
  const [otpMessage, setOtpMessage] = useState('');
  const [count, setCount] = useState(30);
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';
  
  // Properly type the refs array
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [otpValues, setOtpValues] = useState(Array(6).fill(''));

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const resendOtp = async () => {
    if (count !== 0) return;
    try {
      const response = await api.post(`/auth/resendOtp`, { email });
      if (response.data.success) {
        setCount(30);
        // Clear OTP fields and error message
        setOtpValues(Array(6).fill(''));
        setOtpMessage('');
        // Focus first input
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
        toast.success('A new OTP has been sent to your email!');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setOtpMessage(error.response?.data?.message || 'Failed to resend OTP');
      } else {
        setOtpMessage('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    
    if (!/^\d+$/.test(pastedData.join(''))) return;

    const newOtpValues = [...otpValues];
    pastedData.forEach((value, index) => {
      if (index < 6) newOtpValues[index] = value;
    });
    setOtpValues(newOtpValues);
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpMessage('');
    const otp = otpValues.join('');
    
    if (otp.length !== 6) {
      setOtpMessage('Please enter the complete 6-digit OTP');
      return;
    }
    try {
      const response = await api.post('/auth/verifyOtp', { email, otp });
      toast.success('Successfully verified your email, now you can login!');
      if (response.data) navigate('/login');
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setOtpMessage(error.response?.data?.message || 'An error occurred');
      } else {
        console.error('Verification failed:', error);
        setOtpMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E9E9] p-3 md:p-6 lg:p-8 relative">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      
      <div className="top-8 left-8">
        <img src={IMAGES.navBarLogoDark} alt="WorkSphere Logo" className="w-32 h-auto" />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verify <span className="font-light">OTP</span>
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            An OTP has been sent to your email: <span className="font-semibold">{email}</span>
          </p>

          <form onSubmit={handleVerification} className="space-y-6">
            {otpMessage && (
              <p className="text-red-500 text-sm mb-4">{otpMessage}</p>
            )}

            <div className="flex justify-between gap-2">
              {otpValues.map((value, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-semibold border-2 rounded-lg focus:border-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all duration-200"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={resendOtp}
                type="button"
                className={`text-gray-700 hover:text-black ${
                  count !== 0 && 'opacity-50 cursor-not-allowed'
                } font-semibold transition-colors duration-200`}
                disabled={count !== 0}
              >
                Resend OTP
              </button>
              {count > 0 && (
                <span className="text-gray-500">Resend in {count}s</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-200"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;