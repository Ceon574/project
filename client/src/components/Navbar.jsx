import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HeartPulse,
  Calendar,
  User,
  Shield,
  Stethoscope,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <HeartPulse size={22} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: '1.2rem',
                color: 'var(--secondary)',
                letterSpacing: '-0.5px',
                lineHeight: 1.1,
              }}
            >
              SmartDoctor<span style={{ color: 'var(--primary)' }}>+</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              ICTAK MERN CLINICAL PORTAL
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            gap: '1.5rem',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Home
          </Link>
          <Link
            to="/doctors"
            style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}
          >
            Find Doctors
          </Link>
          <Link
            to="/symptom-checker"
            style={{
              fontWeight: 600,
              fontSize: '0.9rem',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <Sparkles size={16} /> Symptom Triage
          </Link>

          {isAuthenticated && user?.role === 'patient' && (
            <Link
              to="/patient-dashboard"
              style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Calendar size={16} /> My Appointments
            </Link>
          )}

          {isAuthenticated && user?.role === 'doctor' && (
            <Link
              to="/doctor-dashboard"
              style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Stethoscope size={16} /> Doctor Portal
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              style={{
                fontWeight: 600,
                fontSize: '0.9rem',
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Shield size={16} /> Admin Console
            </Link>
          )}
        </nav>

        {/* User Actions */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.85rem',
          }}
          className="desktop-actions"
        >
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                  }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.2 }}>
                    {user?.name}
                  </div>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      backgroundColor:
                        user?.role === 'admin'
                          ? '#fef3c7'
                          : user?.role === 'doctor'
                          ? '#e0f2fe'
                          : '#ecfdf5',
                      color:
                        user?.role === 'admin'
                          ? '#b45309'
                          : user?.role === 'doctor'
                          ? '#0369a1'
                          : '#047857',
                    }}
                  >
                    {user?.role}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of account"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--text-main)',
            padding: '0.4rem',
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            padding: '1rem 1.5rem 1.5rem',
            borderTop: '1px solid var(--border)',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '0.95rem' }}
          >
            Home
          </Link>
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '0.95rem' }}
          >
            Find Doctors
          </Link>
          <Link
            to="/symptom-checker"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--primary)' }}
          >
            Symptom Triage
          </Link>

          {isAuthenticated && user?.role === 'patient' && (
            <Link
              to="/patient-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '0.95rem' }}
            >
              My Appointments
            </Link>
          )}

          {isAuthenticated && user?.role === 'doctor' && (
            <Link
              to="/doctor-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '0.95rem' }}
            >
              Doctor Portal
            </Link>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <Link
              to="/admin-dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, fontSize: '0.95rem' }}
            >
              Admin Console
            </Link>
          )}

          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
            {isAuthenticated ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.role}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Responsive Styles for Navbar */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
