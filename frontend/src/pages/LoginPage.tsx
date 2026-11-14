import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  Sparkles,
  Phone,
  Hash,
  GraduationCap,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  X,
  RefreshCw,
  Send
} from 'lucide-react';
import api from '../services/api';
import { InstitutionalFooter } from '../components/InstitutionalFooter';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    document.title = 'Portal Login • GSSSIETW GATE ECE';
  }, []);

  const [role, setRole] = useState<'student' | 'faculty' | 'admin'>('student');
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState(''); // USN for student, Phone Number for faculty/admin
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify' | 'success'>('request');
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const from = new URLSearchParams(location.search).get('redirect') || '/dashboard';

  // Auto-switch role if email explicitly hints faculty or admin
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const low = val.toLowerCase();
    if (low.includes('faculty') && role !== 'faculty') {
      setRole('faculty');
    } else if (low.includes('admin') && role !== 'admin') {
      setRole('admin');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const enteredEmail = email.trim();
      const extractedName = fullName.trim() || enteredEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      // Prepare role-specific attributes
      const extraPayload = {
        role,
        usn: role === 'student' ? identifier.trim() : undefined,
        phone_number: role === 'faculty' || role === 'admin' ? identifier.trim() : undefined
      };

      // Pass the entered name and USN / Phone directly into login so backend updates SQLite in real-time
      const userObj = await login(enteredEmail, password || 'student123', extractedName, extraPayload);

      // Direct to role-specific dashboard
      const roleDefault = userObj.role === 'faculty' ? '/faculty' : userObj.role === 'admin' ? '/admin' : '/dashboard';
      const destination = location.search.includes('redirect=') ? from : roleDefault;

      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 1. Send OTP to user's email
  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!forgotIdentifier.trim()) {
      setForgotError('Please enter your registered Email address or USN.');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post('/auth/forgot-password', {
        email_or_usn: forgotIdentifier.trim()
      });
      setMaskedEmail(res.data.masked_email || res.data.email);
      setForgotStep('verify');
    } catch (err: any) {
      setForgotError(err.response?.data?.detail || 'No account found matching this Email or USN.');
    } finally {
      setForgotLoading(false);
    }
  };

  // 2. Verify OTP & Set New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    if (!resetCode.trim()) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }
    if (newPassword.length < 4) {
      setForgotError('New password must be at least 4 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    setForgotLoading(true);
    try {
      await api.post('/auth/reset-password', {
        email_or_usn: forgotIdentifier.trim(),
        reset_code: resetCode.trim(),
        new_password: newPassword
      });
      setForgotStep('success');
    } catch (err: any) {
      setForgotError(err.response?.data?.detail || 'Failed to reset password. Please check the code.');
    } finally {
      setForgotLoading(false);
    }
  };

  const resetForgotState = () => {
    setShowForgotModal(false);
    setForgotStep('request');
    setForgotIdentifier('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotError('');
  };

  return (
    <div
      className="min-h-screen w-screen flex flex-col justify-between items-center font-sans relative p-3 sm:p-4 select-none"
      style={{
        backgroundImage: "url('/images/gsss-building.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

      {/* Compact Fixed Single-Column Card (Zero Scrolling) */}
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden z-10 flex flex-col my-auto">
        {/* Compact Header Banner */}
        <div className="bg-[#701a2b] text-white px-5 py-3.5 flex items-center justify-between border-b border-rose-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#500713] flex items-center justify-center border border-amber-300/40 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold leading-tight">GSSSIETW Portal Login</h2>
              <p className="text-[10px] text-rose-200">
                GATE ECE Learning &amp; Assessment Platform
              </p>
            </div>
          </div>
          <span className="text-[10px] text-amber-200/80 font-serif italic hidden sm:inline">
            Department of ECE
          </span>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-2.5">
          {error && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-700">
              {error}
            </div>
          )}

          {/* Role Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl text-xs font-semibold mb-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'student' ? 'bg-[#701a2b] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('faculty')}
              className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'faculty' ? 'bg-[#701a2b] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'admin' ? 'bg-[#701a2b] text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* Line 1: Your Full Name */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
              Your Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
              />
            </div>
          </div>

          {/* Line 2: USN for Students / Phone for Faculty & Admin */}
          {role === 'student' && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                University Seat Number (USN)
              </label>
              <div className="relative">
                <Hash className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder="Enter University Seat Number (USN)"
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b] uppercase"
                />
              </div>
            </div>
          )}

          {role === 'faculty' && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                Faculty Contact / Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="tel"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Faculty Phone / Contact Number"
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                />
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
                Administrator Contact / Phone Number
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                <input
                  type="tel"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Administrator Contact Number"
                  className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                />
              </div>
            </div>
          )}

          {/* Line 3: Email Address (Personal / Gmail accepted) */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-700 mb-0.5">
              Email Address (Gmail / Personal Email)
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder={
                  role === 'faculty'
                    ? 'e.g. faculty.ece@gmail.com'
                    : role === 'admin'
                    ? 'e.g. admin.ece@gmail.com'
                    : 'e.g. student@gmail.com'
                }
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
              />
            </div>
          </div>

          {/* Line 4: Password + Forgot Password Link */}
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <label className="block text-[11px] font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => {
                  setForgotIdentifier(email || identifier);
                  setShowForgotModal(true);
                }}
                className="text-[11px] text-[#701a2b] hover:underline font-semibold cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#701a2b] hover:bg-[#500713] text-white font-medium py-2 rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 !mt-3"
          >
            {loading ? (
              <span>Entering Portal...</span>
            ) : (
              <>
                <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Forgot / Reset Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-rose-100 space-y-4 animate-in fade-in duration-150 relative">
            <div className="flex items-start justify-between pb-2 border-b border-rose-50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-[#701a2b] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {forgotStep === 'success' ? 'Password Reset Complete' : 'Reset Account Password'}
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    GSSSIETW GATE ECE Portal
                  </p>
                </div>
              </div>

              <button
                onClick={resetForgotState}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotError && (
              <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-[11px] text-red-700 leading-tight">
                {forgotError}
              </div>
            )}

            {/* Step 1: Request OTP */}
            {forgotStep === 'request' && (
              <form onSubmit={handleSendResetCode} className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your registered **Email Address** or **USN**. We will send a 6-digit verification code to your personal email inbox.
                </p>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Your Registered Email or USN
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      required
                      value={forgotIdentifier}
                      onChange={(e) => setForgotIdentifier(e.target.value)}
                      placeholder="Enter registered email or USN"
                      className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#701a2b] hover:bg-[#500713] text-white font-medium py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {forgotLoading ? (
                    <span>Sending Code...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send 6-Digit Code</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Verify Code and Set New Password */}
            {forgotStep === 'verify' && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div className="p-2.5 bg-rose-50/60 rounded-xl border border-rose-100 text-xs text-stone-700 leading-snug">
                  Verification code dispatched to: <strong className="text-[#701a2b]">{maskedEmail}</strong>. Please check your inbox.
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 582491"
                    className="w-full text-center py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-bold tracking-widest text-[#701a2b] focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Set New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-[#701a2b]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="px-3 py-2 border border-stone-200 rounded-xl text-xs text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 bg-[#701a2b] hover:bg-[#500713] text-white font-medium py-2 rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? (
                      <span>Updating...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {forgotStep === 'success' && (
              <div className="text-center py-3 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-stone-900 text-sm">Password Updated!</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Your account password has been successfully reset. You can now log in immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetForgotState}
                  className="w-full bg-[#701a2b] hover:bg-[#500713] text-white font-semibold py-2 rounded-xl text-xs shadow-xs transition cursor-pointer"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Institutional Guidance & Attribution Footer */}
      <InstitutionalFooter variant="dark" />
    </div>
  );
};
