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
  Key, 
  Database, 
  ExternalLink, 
  Sparkles,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Copy,
  Check,
  Code
} from 'lucide-react';
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signInWithGoogle,
  resetPasswordForEmail, 
  isSupabaseConfigured, 
  getActiveSupabaseConfig, 
  saveSupabaseConfig, 
  clearSupabaseConfig,
  signOutUser,
  SUPABASE_SQL_SCHEMA
} from './supabaseClient';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'login', // 'login' | 'signup'
  currentUser,
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot' | 'config'
  const [showConfig, setShowConfig] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Supabase Custom Config Fields
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isConfigured, setIsConfigured] = useState(isSupabaseConfigured());
  const [activeConfig, setActiveConfig] = useState(getActiveSupabaseConfig());

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialMode, isOpen]);

  useEffect(() => {
    const cfg = getActiveSupabaseConfig();
    setActiveConfig(cfg);
    setIsConfigured(cfg.isConfigured);
    setSupabaseUrlInput(cfg.url || '');
    setSupabaseKeyInput(cfg.anonKey || '');
  }, [isOpen, showConfig]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Kripya Email aur Password dono bharein.');
      return;
    }

    setLoading(true);
    try {
      const data = await signInWithEmail(email.trim(), password);
      const user = data?.user;
      setSuccessMsg('Aapka Login safalta-purvak ho gaya hai! 🎉');
      
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
      }, 900);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Login fail hua. Kripya credentials check karein.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password) {
      setErrorMsg('Email aur Password required hain.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Password aur Confirm Password match nahi ho rahe.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUpWithEmail(email.trim(), password, {
        fullName: fullName.trim() || email.split('@')[0],
        phone: phone.trim(),
        storeName: storeName.trim()
      });

      const user = data?.user;
      
      if (data?.session) {
        setSuccessMsg('Account safalta-purvak create ho gaya aur aap logged-in hain! 🚀');
        if (user) {
          localStorage.setItem('sidra_auth_unlocked', 'true');
          localStorage.setItem('sidra_auth_type', 'supabase');
          localStorage.setItem('sidra_user_name', fullName.trim() || email.split('@')[0]);
          localStorage.setItem('sidra_user_email', email.trim());
          if (phone.trim()) localStorage.setItem('sidra_user_phone', phone.trim());
          if (storeName.trim()) localStorage.setItem('sidra_store_name', storeName.trim());
        }
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(user);
          onClose();
        }, 1100);
      } else {
        // Confirmation email required
        setSuccessMsg('Account create ho gaya! Kripya apna email check karein verification link ke liye.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMsg(err.message || 'Signup fail hua. Kripya details check karein.');
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
      setErrorMsg('Kripya apna registered email enter karein.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordForEmail(email.trim());
      setSuccessMsg('Password reset link aapke email par bhej diya gaya hai! 📩');
    } catch (err) {
      console.error('Reset error:', err);
      setErrorMsg(err.message || 'Password reset link bhejne me samasya aayi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Saving Custom Supabase Config
  const handleSaveConfig = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!supabaseUrlInput.trim() || !supabaseKeyInput.trim()) {
      setErrorMsg('Supabase Project URL aur Anon Key dono daalna zaroori hai.');
      return;
    }

    if (!supabaseUrlInput.includes('supabase.co') && !supabaseUrlInput.startsWith('http')) {
      setErrorMsg('Invalid URL format. Example: https://xxxx.supabase.co');
      return;
    }

    saveSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    const cfg = getActiveSupabaseConfig();
    setActiveConfig(cfg);
    setIsConfigured(cfg.isConfigured);
    setSuccessMsg('Supabase Credentials safalta se save ho gaye! Live Database Connected! 🟢');
    setTimeout(() => {
      setShowConfig(false);
      setSuccessMsg('');
    }, 1200);
  };

  const handleClearConfig = () => {
    clearSupabaseConfig();
    const cfg = getActiveSupabaseConfig();
    setActiveConfig(cfg);
    setIsConfigured(cfg.isConfigured);
    setSupabaseUrlInput('');
    setSupabaseKeyInput('');
    setSuccessMsg('Custom Supabase credentials hata diye gaye.');
  };

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      const data = await signInWithGoogle();
      const user = data?.user;
      if (user) {
        setSuccessMsg('Google se login safal hua! 🎉');
        const uName = user.user_metadata?.full_name || user.email?.split('@')[0];
        localStorage.setItem('sidra_auth_unlocked', 'true');
        localStorage.setItem('sidra_auth_type', 'supabase');
        localStorage.setItem('sidra_user_name', uName);
        localStorage.setItem('sidra_user_email', user.email || '');
        setTimeout(() => {
          onAuthSuccess && onAuthSuccess(user);
          onClose();
        }, 800);
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setErrorMsg(err.message || 'Google sign-in fail hua.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySchema = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2500);
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
        {/* Header Ribbon */}
        <div style={{
          padding: '20px 24px 14px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 210, 255, 0.4)'
            }}>
              {mode === 'signup' ? <UserPlus size={20} color="#050b14" /> : <LogIn size={20} color="#050b14" />}
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{mode === 'signup' ? 'Create Seller Account' : mode === 'forgot' ? 'Reset Password' : 'Login to Seller Suite'}</span>
                <span style={{
                  fontSize: '9px',
                  background: 'rgba(0, 210, 255, 0.15)',
                  color: '#00d2ff',
                  border: '1px solid rgba(0, 210, 255, 0.3)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: '700'
                }}>SUPABASE AUTH</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Sidra Motion E-Commerce Workstation
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
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

        {/* Supabase Connection Status Pill */}
        <div style={{
          padding: '10px 24px',
          background: isConfigured ? 'rgba(37, 211, 102, 0.08)' : 'rgba(251, 191, 36, 0.08)',
          borderBottom: `1px solid ${isConfigured ? 'rgba(37, 211, 102, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={13} color={isConfigured ? '#25d366' : '#fbbf24'} />
            <span style={{ color: isConfigured ? '#25d366' : '#fbbf24', fontWeight: '700' }}>
              {isConfigured ? '🟢 Supabase Cloud Database Connected' : '⚡ Demo Mode (Supabase Keys Unset)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00d2ff',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '11px',
              textDecoration: 'underline'
            }}
          >
            {showConfig ? 'Hide Config' : 'Project API Keys'}
          </button>
        </div>

        {/* Collapsible Supabase Project API Keys Drawer */}
        {showConfig && (
          <div style={{
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderBottom: '1px solid rgba(0, 210, 255, 0.2)',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: '800', color: '#00d2ff', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Key size={14} /> Connect Your Supabase Project
              </span>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#38bdf8', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none' }}
              >
                Dashboard <ExternalLink size={10} />
              </a>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '11px', margin: '0 0 10px 0', lineHeight: '1.4' }}>
              Apne Supabase Dashboard me jaakar <b>Project Settings → API</b> se URL aur `anon` `public` key copy karke yahan paste karein:
            </p>

            <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase' }}>
                  Project URL (e.g. https://xyz.supabase.co)
                </label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrlInput}
                  onChange={(e) => setSupabaseUrlInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '11px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: '700', textTransform: 'uppercase' }}>
                  Anon Public Key (eyJhbG...)
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={supabaseKeyInput}
                  onChange={(e) => setSupabaseKeyInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#fff',
                    fontSize: '11px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                    color: '#050b14',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: '800',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Save & Connect Live Database
                </button>
                {isConfigured && (
                  <button
                    type="button"
                    onClick={handleClearConfig}
                    style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Disconnect
                  </button>
                )}
              </div>
            </form>

            {/* Copy Supabase SQL Schema for PostgreSQL tables */}
            <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Code size={13} /> PostgreSQL Database Schema (Profiles & Audits)
                </span>
                <button
                  type="button"
                  onClick={handleCopySchema}
                  style={{
                    background: copiedSchema ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${copiedSchema ? '#25d366' : 'rgba(255, 255, 255, 0.2)'}`,
                    color: copiedSchema ? '#25d366' : '#38bdf8',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {copiedSchema ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedSchema ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.4' }}>
                Supabase Dashboard me <b>SQL Editor</b> me jaakar New Query me ye SQL paste karein aur Run dabayein. Profiles aur Social Audits tables automatically create ho jayenge.
              </div>
            </div>
          </div>
        )}

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
              Aap Pehle Se Logged In Hain
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
                  <LogIn size={15} /> Login (Sign In)
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
                  <UserPlus size={15} /> Sign Up (Naya Khata)
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
                {/* Google One-Click Login */}
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
                        boxSizing: 'border-box',
                        transition: 'border 0.2s'
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
                        color: '#38bdf8',
                        fontSize: '11px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        textDecoration: 'underline'
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
                        padding: '11px 40px 11px 38px',
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
                  <span>{loading ? 'Logging in...' : 'Sign In with Supabase'}</span>
                </button>
              </form>
            )}

            {/* TAB 2: SIGNUP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Google One-Click Sign Up */}
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
                      gap: '4px'
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
                    Password Bhool Gaye?
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', lineHeight: '1.4' }}>
                    Apna registered email address daalein. Hum aapko password reset karne ka direct secure link bhejenge.
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
                  ← Wapas Login par jayein
                </button>
              </form>
            )}

            {/* Bottom Footer Note */}
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
              <span>Powered by <b>Supabase Auth</b></span>
              <span>🔒 256-bit Encrypted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
