import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  FileText,
  AlertCircle,
  XCircle,
  CheckCircle,
  Phone,
  PlusCircle,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { appointmentService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

const PatientDashboard = () => {
  const { user, updateUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedNotesAppointment, setSelectedNotesAppointment] = useState(null);

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    age: user?.age || '',
    gender: user?.gender || 'Male',
    address: user?.address || '',
  });

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await appointmentService.getMyPatientAppointments();
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment? Your reserved slot will be released.')) {
      return;
    }

    setCancellingId(id);
    try {
      await appointmentService.cancel(id);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.updateProfile({
        ...profileForm,
        age: profileForm.age ? Number(profileForm.age) : undefined,
      });
      if (res.success && res.user) {
        updateUser(res.user);
        setIsEditingProfile(false);
        alert('Profile details updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  // Filter appointments
  const upcomingAppointments = appointments.filter(
    (app) => app.status === 'confirmed' || app.status === 'pending'
  );
  const pastAppointments = appointments.filter(
    (app) => app.status === 'completed' || app.status === 'cancelled'
  );

  const displayedList = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div>
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.2rem' }}>
            Patient Portal & Records
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Manage your medical appointments, prescriptions, and physician consultations.
          </p>
        </div>
        <Link to="/doctors" className="btn btn-primary">
          <PlusCircle size={18} /> Schedule New Appointment
        </Link>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Grid: Patient Details + Appointments List */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }} className="grid-dashboard">
        {/* Patient Profile Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '14px',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.3rem',
              }}
            >
              {user?.name?.charAt(0) || 'P'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{user?.name}</h3>
              <span className="badge badge-confirmed" style={{ fontSize: '0.7rem' }}>
                Verified Patient
              </span>
            </div>
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="form-control"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Gender</label>
                  <select
                    value={profileForm.gender}
                    onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                    className="form-control"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className="form-control"
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Email/Login:</span>
                <div style={{ fontWeight: 600 }}>{user?.email}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <div style={{ fontWeight: 600 }}>{user?.phone || 'Not specified'}</div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Age:</span>
                  <div style={{ fontWeight: 600 }}>{user?.age ? `${user.age} yrs` : 'N/A'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Gender:</span>
                  <div style={{ fontWeight: 600 }}>{user?.gender || 'N/A'}</div>
                </div>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Address:</span>
                <div style={{ fontWeight: 600 }}>{user?.address || 'Kerala, India'}</div>
              </div>

              <button
                onClick={() => setIsEditingProfile(true)}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '0.5rem' }}
              >
                Edit Profile Info
              </button>
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div>
          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
              paddingBottom: '0.5rem',
            }}
          >
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === 'upcoming' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'upcoming' ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Upcoming Consultations ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-md)',
                border: 'none',
                backgroundColor: activeTab === 'past' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'past' ? 'white' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              Consultation History ({pastAppointments.length})
            </button>
          </div>

          {/* Loading, Empty, Success States */}
          {loading ? (
            <LoadingSpinner message="Loading your appointment bookings..." />
          ) : displayedList.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title={activeTab === 'upcoming' ? 'No Upcoming Appointments' : 'No Past History'}
              description={
                activeTab === 'upcoming'
                  ? 'You currently have no scheduled appointments. Browse our specialists to book a slot.'
                  : 'You have not completed any clinical consultations yet.'
              }
              actionText={activeTab === 'upcoming' ? 'Schedule Consultation' : null}
              onAction={() => (window.location.href = '/doctors')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {displayedList.map((app) => (
                <div
                  key={app._id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.25rem 1.5rem',
                    borderLeft: `4px solid ${
                      app.status === 'confirmed'
                        ? 'var(--primary)'
                        : app.status === 'completed'
                        ? 'var(--success)'
                        : app.status === 'cancelled'
                        ? 'var(--danger)'
                        : 'var(--warning)'
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                        }}
                      >
                        {app.doctor?.specialization?.name || 'Medical Specialist'}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.15rem' }}>
                        {app.doctor?.user?.name || 'Dr. Specialist'}
                      </h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        ICTAK Apex Multi-Specialty Hospital
                      </div>
                    </div>

                    <span className={`badge badge-${app.status}`}>
                      {app.status === 'confirmed' && <CheckCircle size={12} />}
                      {app.status === 'completed' && <CheckCircle size={12} />}
                      {app.status === 'cancelled' && <XCircle size={12} />}
                      {app.status}
                    </span>
                  </div>

                  {/* Date & Slot details */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1.5rem',
                      padding: '0.75rem 1rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={16} style={{ color: 'var(--primary)' }} />
                      <span>
                        Date: <strong>{app.date}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Clock size={16} style={{ color: 'var(--primary)' }} />
                      <span>
                        Slot: <strong>{app.slotTime}</strong>
                      </span>
                    </div>

                    <div style={{ marginLeft: 'auto' }}>
                      Fee: <strong>₹{app.consultationFee}</strong>
                    </div>
                  </div>

                  {/* Symptoms reason */}
                  {app.symptomsDescription && (
                    <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Symptoms Reported: </span>
                      <span>{app.symptomsDescription}</span>
                    </div>
                  )}

                  {/* Actions / Notes */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                    }}
                  >
                    {app.status === 'completed' && (
                      <button
                        onClick={() => setSelectedNotesAppointment(app)}
                        className="btn btn-secondary btn-sm"
                      >
                        <FileText size={14} /> View Prescription & Clinical Notes
                      </button>
                    )}

                    {(app.status === 'confirmed' || app.status === 'pending') && (
                      <button
                        onClick={() => handleCancelAppointment(app._id)}
                        disabled={cancellingId === app._id}
                        className="btn btn-danger btn-sm"
                        style={{ marginLeft: 'auto' }}
                      >
                        {cancellingId === app._id ? 'Cancelling...' : 'Cancel Appointment'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription & Clinical Notes Modal */}
      {selectedNotesAppointment && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Doctor's Clinical Consultation Report
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {selectedNotesAppointment.doctor?.user?.name} •{' '}
                  {selectedNotesAppointment.doctor?.specialization?.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedNotesAppointment(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  Date: <strong>{selectedNotesAppointment.date}</strong>
                </div>
                <div>
                  Patient: <strong>{selectedNotesAppointment.patient?.name}</strong>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Doctor's Clinical Observations:
                </h4>
                <div
                  style={{
                    padding: '0.85rem',
                    backgroundColor: '#fff',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                  }}
                >
                  {selectedNotesAppointment.consultationNotes ||
                    'Clinical observation recorded. Patient advised to rest and observe regimen.'}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0369a1' }}>
                  Prescription & Treatment Regimen (Rx):
                </h4>
                <div
                  style={{
                    padding: '0.85rem',
                    backgroundColor: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    color: '#075985',
                    fontFamily: 'monospace',
                  }}
                >
                  {selectedNotesAppointment.prescription ||
                    'Standard symptomatic medical treatment advised.'}
                </div>
              </div>

              <button
                onClick={() => setSelectedNotesAppointment(null)}
                className="btn btn-secondary btn-block"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 840px) {
          .grid-dashboard {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
