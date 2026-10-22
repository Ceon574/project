import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse,
  Sparkles,
  Calendar,
  ShieldCheck,
  Stethoscope,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Activity,
  Brain,
  Baby,
  Smile,
  Eye,
} from 'lucide-react';
import { symptomService, doctorService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await symptomService.getSpecializations();
        if (res.success) {
          setSpecializations(res.data);
        }
      } catch (err) {
        console.error('Failed to load specializations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecializations();
  }, []);

  const handleQuickDemoLogin = async (email, password, redirectPath) => {
    setDemoLoginLoading(true);
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      alert(`Demo login failed: ${err.message}`);
    } finally {
      setDemoLoginLoading(false);
    }
  };

  const specIcons = {
    Cardiology: HeartPulse,
    Neurology: Brain,
    Dermatology: Sparkles,
    Pediatrics: Baby,
    Orthopedics: Activity,
    'General Medicine': Stethoscope,
    Psychiatry: Smile,
    Ophthalmology: Eye,
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0369a1 100%)',
          color: 'white',
          borderRadius: 'var(--radius-xl)',
          padding: '3.5rem 2rem',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.25rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <ShieldCheck size={16} style={{ color: '#38bdf8' }} />
            <span>ICTAK Capstone Project • Production Ready MERN Architecture</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1px',
              marginBottom: '1.25rem',
            }}
          >
            Next-Generation Clinical Scheduling & Health Guidance
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: '#e0f2fe',
              marginBottom: '2rem',
              maxWidth: '650px',
            }}
          >
            Schedule verified consultations with top medical specialists, receive preliminary
            symptom analysis, and manage hospital appointments seamlessly from any device.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/doctors"
              className="btn btn-primary"
              style={{
                backgroundColor: 'white',
                color: 'var(--primary-dark)',
                padding: '0.8rem 1.5rem',
                fontSize: '0.95rem',
              }}
            >
              <Calendar size={18} /> Book Appointment
            </Link>

            <Link
              to="/symptom-checker"
              className="btn btn-secondary"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.25)',
                padding: '0.8rem 1.5rem',
                fontSize: '0.95rem',
              }}
            >
              <Sparkles size={18} style={{ color: '#38bdf8' }} /> Check Symptoms
            </Link>
          </div>
        </div>
      </section>

      {/* Evaluator Quick Access Credentials Banner */}
      <section
        className="card"
        style={{
          marginBottom: '3rem',
          border: '1px solid #bfdbfe',
          backgroundColor: '#eff6ff',
          padding: '1.5rem 1.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} style={{ color: '#2563eb' }} />
              Examiner & Reviewer Quick Demo Logins
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#3b82f6', marginTop: '0.2rem' }}>
              Click any role below to instantly log in and evaluate that user's view and features:
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Patient 1 */}
          <button
            onClick={() => handleQuickDemoLogin('patient1', 'pat123', '/patient-dashboard')}
            disabled={demoLoginLoading}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0.85rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', marginBottom: '0.3rem' }}>
              <Users size={16} style={{ color: '#0284c7' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Patient Account</span>
              <span className="badge badge-confirmed" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>Patient</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ananya Menon (patient1 / pat123)</div>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600, marginTop: '0.4rem' }}>
              Click to login as Patient →
            </div>
          </button>

          {/* Doctor 1 */}
          <button
            onClick={() => handleQuickDemoLogin('dr.rajesh', 'doc123', '/doctor-dashboard')}
            disabled={demoLoginLoading}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0.85rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', marginBottom: '0.3rem' }}>
              <Stethoscope size={16} style={{ color: '#059669' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Doctor Portal</span>
              <span className="badge badge-completed" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>Doctor</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dr. Rajesh Kumar (Cardiology)</div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '0.4rem' }}>
              Click to login as Doctor →
            </div>
          </button>

          {/* Admin */}
          <button
            onClick={() => handleQuickDemoLogin('admin', 'admin123', '/admin-dashboard')}
            disabled={demoLoginLoading}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: '0.85rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', marginBottom: '0.3rem' }}>
              <ShieldCheck size={16} style={{ color: '#d97706' }} />
              <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Admin Console</span>
              <span className="badge badge-pending" style={{ marginLeft: 'auto', fontSize: '0.65rem' }}>Admin</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hospital Administrator (admin / admin123)</div>
            <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600, marginTop: '0.4rem' }}>
              Click to login as Admin →
            </div>
          </button>
        </div>
      </section>

      {/* Hospital Features */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Comprehensive Healthcare Workflow
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Engineered with modern full-stack web standards to optimize clinical scheduling.
          </p>
        </div>

        <div className="grid-3">
          <div className="card card-hover">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Calendar size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Real-time Slot Booking
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Pick doctors by specialty and choose exact 30-minute consultation slots. Prevents
              double-booking with automated availability checks.
            </p>
          </div>

          <div className="card card-hover">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Smart Symptom Guidance
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Clinical triage matrix flags high-urgency symptoms, highlights red-flag warning signs,
              and connects patients to the exact medical specialty.
            </p>
          </div>

          <div className="card card-hover">
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Role-Based Portals
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Tailored dashboards for Patients, Doctors, and Hospital Admins with JWT token security
              and strict server-side authorization checks.
            </p>
          </div>
        </div>
      </section>

      {/* Clinical Departments / Specializations */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Medical Specializations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Browse board-certified doctors across specialized hospital departments.
            </p>
          </div>
          <Link
            to="/doctors"
            style={{
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            View All Doctors <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid-4">
          {specializations.map((spec) => {
            const Icon = specIcons[spec.name] || Stethoscope;
            return (
              <Link
                key={spec._id}
                to={`/doctors?specialization=${spec._id}`}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon size={20} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {spec.name}
                </h4>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '0.85rem',
                    flex: 1,
                  }}
                >
                  {spec.description}
                </p>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  Browse Specialists →
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
