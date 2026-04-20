import React, { useState, useEffect } from 'react';
import './RatingForm.css';

// 🟡 API Helpers
const API_BASE = 'https://emporio1-1blc.vercel.app/api';

const sendOtp = async (email, StoreID) => {
  try {
    const response = await fetch(`${API_BASE}/sendOTP`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, StoreID }),
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
        name: userName || "Prabhat",
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        // Return the specific message from backend (e.g., 409 Conflict)
        return { 
          success: false, 
          message: data.message || data.error || 'Rating submission failed' 
        };
    }

    return { ...data, success: true };
  } catch (error) {
    console.error('Error submitting rating:', error);
    return { success: false, message: 'Network error. Please try again.' };
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
      // 🛡️ Pre-emptive Duplicate Check
      // We'll call sendOTP with StoreID so the backend can check for this specific store.
      const result = await sendOtp(email, storeId);
      
      if (result.success) {
        setOtpSent(true);
        setOtpTimer(30);
        setResendCount(prev => prev + 1);
        showToast('OTP sent to your email 📧');
      } else {
        // Handle "Already Registered" or "Duplicate" messages from the backend
        const msg = result.message || '';
        if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('duplicate')) {
          showToast('You have already submitted a rating with this email.', true);
        } else {
          showToast(msg || 'Failed to send OTP', true);
        }
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
        // Use the specific message from backend (e.g., "Already submitted...")
        showToast(result.message || 'Verification failed', true);
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
      if (result.success || result.message?.toLowerCase().includes('successfully')) {
        showToast('Thank you for your rating! 🙏');
        setTimeout(() => onClose(true), 2500);
      } else {
        showToast(result.message || 'Submission failed', true);
      }
    } finally {
      setLoading(prev => ({ ...prev, submit: false }));
    }
  };

  return (
    <div className="relative overflow-hidden bg-white p-5 md:p-10 max-h-[90vh] overflow-y-auto">
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-card group ${t.isError ? 'error' : 'success'}`}>
            <div className="toast-icon">
              <span className="material-symbols-outlined">
                {t.isError ? 'error' : 'check_circle'}
              </span>
            </div>
            <div className="toast-content">
              <p className="toast-message">{t.message}</p>
            </div>
            <button className="toast-close" onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Rate Store</h2>
          <div className="h-1 w-12 bg-[#ffb200] mt-1"></div>
        </div>
        <button type="button" className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors group" onClick={onClose}>
          <span className="material-symbols-outlined text-slate-400 group-hover:text-slate-900 transition-colors">close</span>
        </button>
      </div>

      <div className="space-y-6 md:space-y-8">
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
            <div className="flex flex-col gap-4 relative">
              <div className="relative">
                <input 
                  type="email" 
                  className={`rating-input w-full ${isOtpValidated ? 'pr-20' : ''}`} 
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isOtpValidated}
                />
                {isOtpValidated && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold text-[10px] flex items-center gap-1 bg-white pl-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Verified
                  </span>
                )}
              </div>
              {!isOtpValidated && (
                <button 
                  type="button"
                  className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${otpSent ? 'bg-slate-50' : 'bg-[#ffb200] text-slate-900 hover:bg-[#e6a100]'}`}
                  onClick={handleSendOtp}
                  disabled={loading.otp || (otpSent && otpTimer > 0)}
                >
                  <span className={otpSent && otpTimer > 0 ? 'timer-active' : ''}>
                    {loading.otp ? 'Verifying...' : otpSent ? `Resend (${otpTimer}s)` : 'Verify Email'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* OTP Input */}
        {otpSent && !isOtpValidated && (
          <div className="otp-input-container animate-fade-in shadow-inner">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Enter 6-digit Verification Code</p>
            <div className="flex flex-col gap-4">
              <input 
                type="text" 
                className="otp-digit-input w-full shadow-sm"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <button 
                type="button"
                className="verify-btn w-full active:scale-95"
                onClick={handleVerifyOtp}
                disabled={loading.verify}
              >
                {loading.verify ? 'Verifying...' : 'Verify Now'}
              </button>
            </div>
          </div>
        )}

        {/* Rating Selection */}
        {isOtpValidated && (
          <div className="animate-fade-in text-center space-y-8 pt-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Share Your Experience</h3>
            <div className="flex justify-center gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button 
                  type="button"
                  key={num} 
                  className={`w-12 h-20 sm:w-16 sm:h-24 rounded-[32px] text-xl font-black transition-all flex items-center justify-center ${rating === num ? 'bg-[#ffb200] text-slate-900 scale-110 shadow-2xl' : 'bg-slate-50 text-slate-400 hover:bg-white hover:shadow-xl border-2 border-transparent hover:border-[#ffb200]'}`}
                  onClick={() => setRating(num)}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Dynamic Emoji feedback */}
            {rating && (
              <div className="animate-bounce-in py-4">
                <div className="text-6xl mb-2">{
                  rating === 1 ? "😠" : 
                  rating === 2 ? "🙁" : 
                  rating === 3 ? "🙂" : 
                  rating === 4 ? "😊" : "😍"
                }</div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#ffb200]">
                  {
                    rating === 1 ? "Terrible" : 
                    rating === 2 ? "Poor" : 
                    rating === 3 ? "Good" : 
                    rating === 4 ? "Very Good" : "Excellent"
                  }
                </p>
              </div>
            )}

            <button 
              type="button"
              className="w-full bg-[#285A48] text-white py-4 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl opacity-100 transition-all disabled:opacity-50 mt-4" 
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
