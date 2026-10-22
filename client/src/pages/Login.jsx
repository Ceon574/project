import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Key, Mail, ShieldAlert, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import Alert from '../components/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your login ID / email and password.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const loggedInUser = await login(email, password);

      // Redirect according to user role or origin
      if (redirectPath) {
        navigate(redirectPath);
      } else if (loggedInUser.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (loggedInUser.role === 'doctor') {
        navigate('/doctor-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '2rem auto 4rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
            }}
          >
            <LogIn size={24} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Access your SmartDoctor clinical scheduling account
          </p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="patient1, dr.rajesh, or admin"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-control"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary btn-block"
            style={{ padding: '0.75rem', marginTop: '0.5rem', marginBottom: '1.25rem' }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Verifying...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Quick Fill Demo helper buttons */}
        <div
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.65rem',
            }}
          >
            Instant Demo Logins (Click to autofill):
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => handleFillDemo('patient1', 'pat123')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
            >
              <span>👤 Patient: Ananya</span>
              <code style={{ fontSize: '0.7rem' }}>patient1 / pat123</code>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('dr.rajesh', 'doc123')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
            >
              <span>🩺 Doctor: Dr. Rajesh</span>
              <code style={{ fontSize: '0.7rem' }}>dr.rajesh / doc123</code>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo('admin', 'admin123')}
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between' }}
            >
              <span>🛡️ Admin: Hospital Admin</span>
              <code style={{ fontSize: '0.7rem' }}>admin / admin123</code>
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create Patient Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
