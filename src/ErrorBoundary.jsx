import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Workstation Error Boundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      // Clear potentially corrupt session keys
      sessionStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  handleReset = () => {
    try {
      localStorage.removeItem('sidra_auth_type');
      localStorage.removeItem('sidra_mock_session');
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 0%, #173359 0%, #0c182e 45%, #070d19 100%)',
          color: '#f8fafc',
          padding: '20px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            background: 'linear-gradient(145deg, #0f172a 0%, #090e1a 100%)',
            border: '1.5px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '24px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(239, 68, 68, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1.5px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              color: '#f87171'
            }}>
              <AlertCircle size={28} />
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff' }}>
              Workstation Recovery Active
            </h2>

            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 20px 0' }}>
              A temporary client script exception was detected. Please reload or reset to restore normal operations:
            </p>

            {this.state.error && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 14px',
                fontSize: '11px',
                color: '#fca5a5',
                textAlign: 'left',
                fontFamily: 'monospace',
                marginBottom: '20px',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                  color: '#050b14',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <RefreshCw size={15} /> Refresh Workstation
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Home size={15} /> Reset
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
