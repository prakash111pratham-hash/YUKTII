import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Smartphone,
  LogOut,
  User,
  GraduationCap,
  BookOpen,
  Building,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BranchCode, UserYear } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    isAuthenticated,
    user,
    updateUser,
    loginUser,
    logoutUser,
    incrementXp,
  } = useApp();

  const [authTab, setAuthTab] = useState<'email' | 'phone'>('email');
  const [emailMode, setEmailMode] = useState<'signin' | 'signup'>('signin');

  // Registration Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('National Institute of Technology (NIT)');
  const [branch, setBranch] = useState<BranchCode>('CSE');
  const [currentYear, setCurrentYear] = useState<UserYear>('1st Year');

  // Phone OTP Form State
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber ? user.phoneNumber.replace(/\D/g, '').slice(-10) : '');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [serverOtpHint, setServerOtpHint] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(45);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // UI Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-fill fields if user is currently authenticated
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
      setName(user.name);
      if (user.college) setCollege(user.college);
      if (user.selectedBranch) setBranch(user.selectedBranch);
      if (user.currentYear) setCurrentYear(user.currentYear);
    }
  }, [user]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, resendTimer]);

  if (!isAuthModalOpen) return null;

  // Handle Email Authentication (Sign In & Register)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const endpoint = emailMode === 'signup' ? '/api/auth/register' : '/api/auth/login';
      const payload =
        emailMode === 'signup'
          ? {
              name,
              email,
              password,
              phone: phoneNumber,
              college,
              branch,
              currentYear,
            }
          : {
              email,
              password,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Authentication failed. Please verify your details.');
      }

      // Success: Log in and initialize profile data
      loginUser(data.user, data.isNewAccount);
      confetti({ particleCount: 65, spread: 60, origin: { y: 0.6 } });

      if (data.isNewAccount) {
        setSuccessMsg(`Welcome, ${data.user.name}! Your account has been initialized fresh from zero.`);
      } else {
        setSuccessMsg(`Welcome back, ${data.user.name}! Signed in successfully.`);
      }

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Real Mobile OTP Request
  const handleSendOtp = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to dispatch OTP. Please check your number.');
      }

      setOtpSent(true);
      setResendTimer(45);
      setServerOtpHint(data.otpCode);
      setSuccessMsg(`📩 Real OTP sent to +91 ${cleanPhone}! Code: ${data.otpCode}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Single Digit OTP Input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...otpCode];
    newCode[index] = value.slice(-1);
    setOtpCode(newCode);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verify Real Mobile OTP Code
  const handleVerifyOtp = async () => {
    const entered = otpCode.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter the complete 6-digit OTP code.');
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone, otp: entered }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Incorrect OTP code.');
      }

      // Update state with verified phone number
      updateUser({
        phoneNumber: data.phone,
        isPhoneVerified: true,
      });

      incrementXp(100, 'Real Mobile OTP Verified');
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      setSuccessMsg(`Mobile number ${data.phone} verified successfully! +100 XP Earned`);

      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Sign Out Process
  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logoutUser();
      setSuccessMsg('You have been signed out. Active profile reset to clean state.');
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg(null);
      }, 1000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Quick Switch to Demo Pratham Account
  const handleLoadPrathamDemo = () => {
    loginUser(
      {
        name: 'Pratham',
        email: 'prakash111pratham@gmail.com',
      },
      false
    );
    setSuccessMsg('Loaded Pratham (NIT Surathkal 3rd Year) sample portfolio!');
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setSuccessMsg(null);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-orange-200 relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">YUKTI Account</h3>
            <p className="text-xs text-slate-500">
              Email Authentication & Real Mobile OTP Verification
            </p>
          </div>
        </div>

        {/* Account Status / Sign Out Card */}
        {isAuthenticated ? (
          <div className="mb-5 p-4 rounded-2xl bg-orange-50/80 border border-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  {user.isPhoneVerified && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Phone Verified
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-600 block">{user.email || 'No email attached'}</span>
                <span className="text-[11px] text-orange-800 font-semibold block">
                  {user.currentYear} • {user.selectedBranch || 'CSE'} • {user.college}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-100/80 px-3 py-2 rounded-xl transition-all border border-rose-200 cursor-pointer flex items-center gap-1.5 shrink-0"
              title="Sign out and reset active session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">
              Currently in <strong>Guest Mode</strong>. Sign in or register below to begin your personalized journey!
            </span>
          </div>
        )}

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthTab('email');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'email' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{emailMode === 'signup' ? 'Create New Account (Fresh Start)' : 'Email Sign In'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthTab('phone');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              authTab === 'phone' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP Verification</span>
          </button>
        </div>

        {/* 1. EMAIL AUTHENTICATION TAB */}
        {authTab === 'email' && (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {emailMode === 'signup' && (
              <>
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200 text-xs text-orange-950 font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                  <span>
                    New account will start fresh from zero (0 XP, clean roadmap, blank study streak, and your custom portfolio).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Engineering Branch
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value as BranchCode)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="CSE">Computer Science (CSE)</option>
                      <option value="AIML">AI & Machine Learning (AIML)</option>
                      <option value="IT">Information Tech (IT)</option>
                      <option value="ECE">Electronics (ECE)</option>
                      <option value="EEE">Electrical (EEE)</option>
                      <option value="MECH">Mechanical (MECH)</option>
                      <option value="CIVIL">Civil Engineering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
                    <select
                      value={currentYear}
                      onChange={(e) => setCurrentYear(e.target.value as UserYear)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year / Final">4th Year (Final Year)</option>
                      <option value="Class 12 / JEE">Class 12 / JEE Aspirant</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">College / Institute</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. IIT Delhi, BITS Pilani, NIT Trichy"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@engineering.edu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setEmailMode(emailMode === 'signin' ? 'signup' : 'signin');
                  setErrorMsg(null);
                }}
                className="text-orange-600 font-bold hover:underline cursor-pointer"
              >
                {emailMode === 'signin'
                  ? 'Need a new account? Register here (Start from Zero)'
                  : 'Already have an account? Sign In'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : emailMode === 'signup' ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Create Account & Start Fresh from Zero</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            {/* Quick Demo Switcher */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Switch to verified demo profile:</span>
              <button
                type="button"
                onClick={handleLoadPrathamDemo}
                className="text-orange-700 font-bold hover:underline cursor-pointer"
              >
                Load Pratham (NIT Surathkal)
              </button>
            </div>
          </form>
        )}

        {/* 2. REAL MOBILE NUMBER OTP VERIFICATION TAB */}
        {authTab === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enter 10-Digit Mobile Number (+91)
              </label>
              <div className="flex gap-2">
                <span className="inline-flex items-center px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-600">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 tracking-wider focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-xs cursor-pointer transition-all disabled:opacity-60 shrink-0"
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              </div>
            </div>

            {/* OTP Code Input Boxes */}
            {otpSent && (
              <div className="p-4 rounded-2xl bg-[#fffbf7] border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Enter 6-Digit OTP</span>
                  {serverOtpHint && (
                    <span className="text-[11px] font-bold text-orange-800 bg-orange-100/90 px-2.5 py-0.5 rounded-md border border-orange-200">
                      Code Dispatched: <strong>{serverOtpHint}</strong>
                    </span>
                  )}
                </div>

                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {otpCode.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpInputsRef.current[i] = el;
                      }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-10 h-12 text-center text-lg font-black rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Didn't receive SMS?</span>
                  {resendTimer > 0 ? (
                    <span className="font-semibold text-slate-600">Resend in {resendTimer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-orange-600 font-bold hover:underline cursor-pointer"
                    >
                      Resend Now
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Mobile OTP (+100 XP)</span>
                </button>
              </div>
            )}

            {user.isPhoneVerified && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Mobile number <strong>{user.phoneNumber}</strong> is verified on this account.
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Connected to Firebase: gen-lang-client-0019023513</span>
          <span className="font-semibold text-emerald-600">● Cloud Firestore Online</span>
        </div>
      </div>
    </div>
  );
};
