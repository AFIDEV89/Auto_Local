import React, { useState, useEffect } from 'react';
import './RatingForm.css';

// 🟡 API Helpers
const API_BASE = 'https://emporio1-1blc.vercel.app/api';

const sendOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE}/sendOTP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

const verifyOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE}/verifyOTP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, message: 'Failed to verify OTP' };
  }
};

const submitRating = async (StoreID, mobile, email, rating, submitted_at, userName) => {
  try {
    const response = await fetch(`${API_BASE}/submitRating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        StoreID,
        mobile,
        email,
        rating,
        submitted_at,
        name: userName || null,
      }),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting rating:', error);
    return { success: false, message: 'Failed to submit rating' };
  }
};

const RatingForm = ({ storeId, onClose }) => {
  const [userName, setUserName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpValidated, setIsOtpValidated] = useState(false);
  const [rating, setRating] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendCount, setResendCount] = useState(0);
  const [loading, setLoading] = useState({ otp: false, verify: false, submit: false });

  const RESEND_LIMIT = 3;

  useEffect(() => {
    let timer;
    if (otpTimer > 0) timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const showToast = (message, isError = false) => {
    const id = Date.now();
    setToasts((prev) => [{ id, message, isError }, ...prev]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const handleSendOtp = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address', true);
      return;
    }
    setLoading(prev => ({ ...prev, otp: true }));
    try {
      const result = await sendOtp(email);
      if (result.success) {
        setOtpSent(true);
        setOtpTimer(30);
        setResendCount(prev => prev + 1);
        showToast('OTP sent to your email');
      } else {
        showToast(result.message || 'Failed to send OTP', true);
      }
    } finally {
      setLoading(prev => ({ ...prev, otp: false }));
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      showToast('Please enter a valid 6-digit OTP', true);
      return;
    }
    setLoading(prev => ({ ...prev, verify: true }));
    try {
      const result = await verifyOtp(email, otp);
      if (result.success) {
        setIsOtpValidated(true);
        showToast('Verification successful');
      } else {
        showToast(result.message || 'Invalid OTP', true);
      }
    } finally {
      setLoading(prev => ({ ...prev, verify: false }));
    }
  };

  const handleSubmit = async () => {
    if (!rating) {
      showToast('Please select a rating', true);
      return;
    }
    setLoading(prev => ({ ...prev, submit: true }));
    try {
      const result = await submitRating(storeId, mobile, email, rating, new Date().toISOString(), userName);
      if (result.success || result.message?.includes('successfully')) {
        showToast('Thank you for your rating!');
        setTimeout(onClose, 2000);
      }
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="relative overflow-hidden bg-white p-6 md:p-10">
      {/* Toast Overlay */}
      <div className="fixed top-6 right-6 z-[200] space-y-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-slide-in pointer-events-auto ${t.isError ? 'bg-red-500' : 'bg-[#10b981]'}`}>
            {t.message}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Rate Store</h2>
          <div className="h-1 w-12 bg-[#ffb200] mt-1"></div>
        </div>
        <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors group" onClick={onClose}>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors">close</span>
        </button>
      </div>

      <div className="space-y-8">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
            <input 
              type="text" 
              className="rating-input" 
              placeholder="Your Name (Optional)"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isOtpValidated}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Mobile*</label>
            <input 
              type="text" 
              className="rating-input" 
              placeholder="10-digit Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={isOtpValidated}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address*</label>
            <div className="relative">
              <input 
                type="email" 
                className="rating-input pr-32" 
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isOtpValidated}
              />
              {!isOtpValidated && (
                <button 
                  className={`absolute right-2 top-2 bottom-2 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${otpSent ? 'bg-slate-100 text-slate-400' : 'bg-[#ffb200] text-slate-900 hover:bg-[#e6a100]'}`}
                  onClick={handleSendOtp}
                  disabled={loading.otp || (otpSent && otpTimer > 0)}
                >
                  {loading.otp ? '...' : otpSent ? `Resend (${otpTimer}s)` : 'Verify Email'}
                </button>
              )}
              {isOtpValidated && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">check_circle</span> Verified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* OTP Input */}
        {otpSent && !isOtpValidated && (
          <div className="bg-slate-50 p-6 rounded-3xl animate-fade-in border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Enter 6-digit Verification Code</p>
            <div className="flex gap-4">
              <input 
                type="text" 
                className="flex-1 bg-white border-2 border-slate-200 rounded-2xl p-4 text-center text-xl font-black tracking-[0.5em] focus:border-[#ffb200] outline-none transition-colors"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <button 
                className="bg-slate-900 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-lg"
                onClick={handleVerifyOtp}
                disabled={loading.verify}
              >
                {loading.verify ? '...' : 'Verify'}
              </button>
            </div>
          </div>
        )}

        {/* Rating Selection */}
        {isOtpValidated && (
          <div className="animate-fade-in text-center space-y-8 pt-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Share Your Experience</h3>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  key={num} 
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-3xl text-xl font-black transition-all flex items-center justify-center ${rating === num ? 'bg-[#ffb200] text-slate-900 scale-110 shadow-2xl' : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-[#ffb200]'}`}
                  onClick={() => setRating(num)}
                >
                  {num}
                </button>
              ))}
            </div>
            <button 
              className="w-full bg-[#161f1a] text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:bg-black transition-all disabled:opacity-50 mt-4" 
              onClick={handleSubmit} 
              disabled={loading.submit || !rating}
            >
              {loading.submit ? 'Submitting Experience...' : 'Submit Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingForm;
