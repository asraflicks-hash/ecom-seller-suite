import React, { useState, useEffect } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Store, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  resetPasswordForEmail, 
  isSupabaseConfigured,
  signOutUser
} from './supabaseClient';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login', // 'login' | 'signup'
  currentUser,
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await signInWithEmail(email.trim(), password);
      const user = data?.user;
      setSuccessMsg('Successfully signed in! Welcome back. 🎉');
      
      // Update local storage for seamless compatibility with app profile
      if (user) {
        const uName = user.user_metadata?.full_name || email.split('@')[0];
        const uPhone = user.user_metadata?.phone || '';
        const uStore = user.user_metadata?.store_name || '';
        
        localStorage.setItem('sidra_auth_unlocked', 'true');
        localStorage.setItem('sidra_auth_type', 'supabase');
        localStorage.setItem('sidra_user_name', uName);
        localStorage.setItem('sidra_user_email', user.email || email);
        if (uPhone) localStorage.setItem('sidra_user_phone', uPhone);
        if (uStore) localStorage.setItem('sidra_store_name', uStore);
      }

      setTimeout(() => {
        onAuthSuccess && onAuthSuccess(user);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Login error:', err);
      const msg = err.message || '';
      if (msg.toLowerCase().includes('invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please verify your credentials and try again.');
      } else if (msg.toLowerCase().includes('email not confirmed')) {
        setErrorMsg('Please confirm your email address or contact support.');
      } else {
        setErrorMsg(msg || 'Sign in failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your Full Name or Seller Name.');
      return;
    }
    if (!email.trim() || !password) {
      setErrorMsg('Both Email and Password are required.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUpWithEmail(email.trim(), password, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        storeName: storeName.trim()
      });

      const user = data?.user;
      
      if (data?.session) {
        setSuccessMsg('Account created successfully! Workstation unlocked. 🚀');
        if (user) {
          localStorage.setItem('sidra_auth_unlocked', 'true');
          localStorage.setItem('sidra_auth_type', 'supabase');
          localStorage.setItem('sidra_user_name', fullName.trim());
          localStorage.setItem('sidra_user_email', email.trim());
          if (phone.trim()) localStorage.setItem('sidra_user_phone', phone.trim());
          if (storeName.trim()) localStorage.setItem('sidra_store_name', storeName.trim());
        }
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(user);
          onClose();
        }, 900);
      } else {
        // Confirmation email link dispatched or auto-verified
        setSuccessMsg('Account created! Logging you in...');
        // Attempt immediate login in case auto-confirmation is active
        try {
          const loginData = await signInWithEmail(email.trim(), password);
          if (loginData?.user) {
            localStorage.setItem('sidra_auth_unlocked', 'true');
            localStorage.setItem('sidra_auth_type', 'supabase');
            localStorage.setItem('sidra_user_name', fullName.trim());
            localStorage.setItem('sidra_user_email', email.trim());
            setTimeout(() => {
              onAuthSuccess && onAuthSuccess(loginData.user);
              onClose();
            }, 700);
            return;
          }
        } catch (e) {
          // If requires manual link click
          setSuccessMsg('Account created! Please check your email inbox for the verification link.');
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        setErrorMsg('Email limit reached for now. Please wait a few moments or log in if already registered.');
      } else if (msg.toLowerCase().includes('already registered')) {
        setErrorMsg('This email is already registered. Please click "Sign In" above to log in.');
      } else {
        setErrorMsg(msg || 'Registration failed. Please check your details.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordForEmail(email.trim());
      setSuccessMsg('Password reset link has been dispatched to your email address! 📩');
    } catch (err) {
      console.error('Reset error:', err);
      setErrorMsg(err.message || 'Unable to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
      const msg = err.message || '';
      if (msg.includes('provider is not enabled') || msg.includes('Unsupported provider')) {
        setErrorMsg('Google Sign-In is not enabled yet in your Supabase Dashboard. Please enable the Google provider in Supabase > Authentication > Providers > Google.');
      } else {
        setErrorMsg(msg || 'Google Sign-In failed. Please try again.');
      }
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOutUser();
    onAuthSuccess && onAuthSuccess(null);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(5, 10, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0d1527 0%, #080e1b 100%)',
        border: '1.5px solid rgba(0, 210, 255, 0.3)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(0, 210, 255, 0.15)',
        position: 'relative',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        {/* Header Ribbon - Clean & Professional */}
        <div style={{
          padding: '20px 24px 16px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: mode === 'signup' 
                ? 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)' 
                : 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 210, 255, 0.35)'
            }}>
              {mode === 'signup' ? <UserPlus size={20} color="#050b14" /> : <LogIn size={20} color="#050b14" />}
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                {mode === 'signup' ? 'Create Seller Account' : mode === 'forgot' ? 'Reset Password' : 'Login to Seller Suite'}
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Sidra Motion E-Commerce Workstation • 100% Free
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* If Already Logged In View */}
        {currentUser ? (
          <div style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 25px rgba(37, 211, 102, 0.4)'
            }}>
              <ShieldCheck size={32} color="#050b14" />
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '800' }}>
              You are currently signed in
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0' }}>
              Logged in as: <span style={{ color: '#00d2ff', fontWeight: '700' }}>{currentUser.email}</span>
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '11px',
              color: '#cbd5e1',
              textAlign: 'left'
            }}>
              <div>👤 Name: <b>{currentUser.user_metadata?.full_name || 'Verified Seller'}</b></div>
              {currentUser.user_metadata?.phone && <div>📞 Phone: <b>{currentUser.user_metadata.phone}</b></div>}
              {currentUser.user_metadata?.store_name && <div>🏪 Store: <b>{currentUser.user_metadata.store_name}</b></div>}
              <div>🆔 User ID: <code style={{ color: '#38bdf8' }}>{currentUser.id?.substring(0, 16)}...</code></div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Continue Workstation
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          </div>
        ) : (
          /* Normal Login / Signup / Forgot View */
          <div style={{ padding: '24px' }}>
            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.35)',
                padding: '4px',
                borderRadius: '14px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: mode === 'login' ? 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)' : 'transparent',
                    color: mode === 'login' ? '#050b14' : '#94a3b8',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: mode === 'login' ? '0 0 16px rgba(0, 210, 255, 0.3)' : 'none'
                  }}
                >
                  <LogIn size={15} /> Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: mode === 'signup' ? 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)' : 'transparent',
                    color: mode === 'signup' ? '#050b14' : '#94a3b8',
                    fontWeight: '800',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s',
                    boxShadow: mode === 'signup' ? '0 0 16px rgba(37, 211, 102, 0.3)' : 'none'
                  }}
                >
                  <UserPlus size={15} /> Register Account
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#fca5a5',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div style={{
                background: 'rgba(37, 211, 102, 0.15)',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#86efac',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                <CheckCircle size={16} color="#25d366" style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* 1-Click Google Sign In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '12px',
                    padding: '11px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  <span>or continue with email</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    REGISTERED EMAIL ADDRESS *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      required
                      placeholder="seller@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1' }}>
                      PASSWORD *
                    </label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#00d2ff',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 38px 11px 38px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: '#00d2ff' }}
                    />
                    Remember my workstation
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                    color: '#050b14',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)',
                    marginTop: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? <RefreshCw size={18} className="spin-fast" /> : <LogIn size={18} />}
                  <span>{loading ? 'Logging in...' : 'Sign In to Workstation'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: SIGNUP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* 1-Click Google Sign Up */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1.5px solid rgba(255, 255, 255, 0.18)',
                    borderRadius: '12px',
                    padding: '11px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign Up with Google (1-Click)</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '11px',
                  color: '#64748b'
                }}>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  <span>or register with email</span>
                  <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                    FULL NAME / SELLER NAME *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                      WHATSAPP NUMBER
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 38px',
                          borderRadius: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                      BRAND / STORE NAME
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Store size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        placeholder="e.g. Urban Trends"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 12px 11px 38px',
                          borderRadius: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '13px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                    EMAIL ADDRESS *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      required
                      placeholder="seller@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                      PASSWORD *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Min 6 chars"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 10px 11px 32px',
                          borderRadius: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '5px' }}>
                      CONFIRM PASSWORD *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '12px' }} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Re-enter"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '11px 10px 11px 32px',
                          borderRadius: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          border: '1.5px solid rgba(255, 255, 255, 0.12)',
                          color: '#fff',
                          fontSize: '12px',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>100% Free Lifetime Access</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
                    color: '#050b14',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(37, 211, 102, 0.35)',
                    marginTop: '8px'
                  }}
                >
                  {loading ? <RefreshCw size={18} className="spin-fast" /> : <Sparkles size={18} />}
                  <span>{loading ? 'Creating Account...' : 'Create Account & Start Workstation'}</span>
                </button>
              </form>
            )}

            {/* TAB 3: FORGOT PASSWORD FORM */}
            {mode === 'forgot' && (
              <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#f8fafc' }}>
                    Forgot Your Password?
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                    Enter your registered email address and we will dispatch a secure password reset link to your inbox.
                  </p>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    REGISTERED EMAIL ADDRESS *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="email"
                      required
                      placeholder="seller@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 12px 11px 38px',
                        borderRadius: '12px',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1.5px solid rgba(255, 255, 255, 0.12)',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                    color: '#050b14',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)'
                  }}
                >
                  {loading ? <RefreshCw size={18} className="spin-fast" /> : <Mail size={18} />}
                  <span>{loading ? 'Sending Link...' : 'Send Reset Link'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    textDecoration: 'underline'
                  }}
                >
                  ← Back to Sign In
                </button>
              </form>
            )}

            {/* Bottom Footer Note - Clean, Secure & Private */}
            <div style={{
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11px',
              color: '#64748b'
            }}>
              <span>🛡️ Seller Suite Pro Security</span>
              <span>🔒 256-Bit SSL Encrypted • Privacy Protected</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
