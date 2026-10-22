import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  FileCheck,
  Plus,
  Loader2,
  Phone,
} from 'lucide-react';
import { appointmentService, doctorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Complete consultation modal state
  const [activeConsultationApp, setActiveConsultationApp] = useState(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [submittingNotes, setSubmittingNotes] = useState(false);

  // New slot modal state
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSlotTime, setNewSlotTime] = useState('09:00 AM - 09:30 AM');
  const [addingSlot, setAddingSlot] = useState(false);

  const fetchDoctorData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, appRes] = await Promise.all([
        doctorService.getMyProfile().catch(() => ({})),
        appointmentService.getDoctorAppointments({ status: statusFilter }),
      ]);

      if (profileRes.success) setProfile(profileRes.data);
      if (appRes.success) setAppointments(appRes.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctor dashboard records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [statusFilter]);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateStatus(appointmentId, { status: newStatus });
      fetchDoctorData();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleCompleteConsultation = async (e) => {
    e.preventDefault();
    if (!activeConsultationApp) return;

    setSubmittingNotes(true);
    try {
      await appointmentService.updateStatus(activeConsultationApp._id, {
        status: 'completed',
        consultationNotes,
        prescription,
      });

      setActiveConsultationApp(null);
      setConsultationNotes('');
      setPrescription('');
      fetchDoctorData();
    } catch (err) {
      alert(err.message || 'Failed to complete consultation');
    } finally {
      setSubmittingNotes(false);
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddingSlot(true);
    try {
      await doctorService.setAvailability({
        date: newSlotDate,
        slots: [{ slotTime: newSlotTime, isBooked: false }],
      });
      alert(`Availability slot ${newSlotTime} added for ${newSlotDate}!`);
      setShowSlotModal(false);
    } catch (err) {
      alert(err.message || 'Failed to add availability slot');
    } finally {
      setAddingSlot(false);
    }
  };

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
            Doctor Clinical Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Welcome, {user?.name}. Manage consultations, patient triage, and hospital scheduling.
          </p>
        </div>
        <button onClick={() => setShowSlotModal(true)} className="btn btn-primary">
          <Plus size={16} /> Add Availability Slot
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Doctor Summary Banner */}
      {profile && (
        <div
          className="card"
          style={{
            marginBottom: '2rem',
            background: 'linear-gradient(to right, #ffffff, #f0fdf4)',
            border: '1px solid #bbf7d0',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '12px',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Stethoscope size={28} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {profile.user?.name} ({profile.specialization?.name})
                </h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {profile.qualifications} • {profile.experienceYears} Years Experience • Rating:{' '}
                  {profile.rating} ★
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Consultation: </span>
                <strong>₹{profile.consultationFee}</strong>
              </div>
              <div
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status: </span>
                <strong style={{ color: '#16a34a' }}>On-Duty / Available</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => setStatusFilter('')}
          className={`btn btn-sm ${statusFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Consultations
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`btn btn-sm ${statusFilter === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Confirmed
        </button>
        <button
          onClick={() => setStatusFilter('completed')}
          className={`btn btn-sm ${statusFilter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter('cancelled')}
          className={`btn btn-sm ${statusFilter === 'cancelled' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Cancelled
        </button>
      </div>

      {/* Appointments List */}
      {loading ? (
        <LoadingSpinner message="Loading patient consultation roster..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Appointments Scheduled"
          description="There are no patient appointments matching this status filter."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {appointments.map((app) => (
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
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Patient Consultation
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    {app.patient?.name || 'Patient'}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      gap: '1rem',
                      marginTop: '0.2rem',
                    }}
                  >
                    <span>Age: {app.patientAge || app.patient?.age || 'N/A'}</span>
                    <span>Gender: {app.patient?.gender || 'N/A'}</span>
                    <span>Phone: {app.patientPhone || app.patient?.phone || 'N/A'}</span>
                  </div>
                </div>

                <span className={`badge badge-${app.status}`}>{app.status}</span>
              </div>

              {/* Slot Details */}
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

              {/* Symptoms reported */}
              {app.symptomsDescription && (
                <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Reported Symptoms: </strong>
                  <span style={{ color: 'var(--text-muted)' }}>{app.symptomsDescription}</span>
                </div>
              )}

              {/* Recorded Notes (if completed) */}
              {app.status === 'completed' && app.consultationNotes && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.825rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#166534', marginBottom: '0.2rem' }}>
                    Recorded Notes & Prescription:
                  </div>
                  <div>{app.consultationNotes}</div>
                  {app.prescription && (
                    <div style={{ marginTop: '0.35rem', color: '#15803d', fontFamily: 'monospace' }}>
                      {app.prescription}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.65rem',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.75rem',
                }}
              >
                {app.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(app._id, 'cancelled')}
                      className="btn btn-danger btn-sm"
                    >
                      <XCircle size={14} /> Cancel
                    </button>

                    <button
                      onClick={() => {
                        setActiveConsultationApp(app);
                        setConsultationNotes(app.consultationNotes || '');
                        setPrescription(app.prescription || '');
                      }}
                      className="btn btn-success btn-sm"
                    >
                      <FileCheck size={14} /> Complete Consultation & Prescribe
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Consultation Notes Modal */}
      {activeConsultationApp && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Complete Consultation</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Patient: {activeConsultationApp.patient?.name} ({activeConsultationApp.date})
                </p>
              </div>
              <button
                onClick={() => setActiveConsultationApp(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteConsultation}>
              <div className="form-group">
                <label className="form-label">Clinical Observations & Diagnosis</label>
                <textarea
                  rows={3}
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  placeholder="Record physical findings, vitals, and diagnostic assessment..."
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prescription (Rx) & Medication Regimen</label>
                <textarea
                  rows={3}
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  placeholder="e.g. Tab. Paracetamol 500mg TDS x 3 days, Tab. Cetirizine 10mg HS..."
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveConsultationApp(null)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingNotes}
                  className="btn btn-success"
                  style={{ flex: 2 }}
                >
                  {submittingNotes ? 'Saving...' : 'Finalize & Mark Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Slot Modal */}
      {showSlotModal && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Add Availability Slot</h3>
              <button
                onClick={() => setShowSlotModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSlot}>
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Window</label>
                <select
                  value={newSlotTime}
                  onChange={(e) => setNewSlotTime(e.target.value)}
                  className="form-control"
                >
                  <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                  <option value="10:00 AM - 10:30 AM">10:00 AM - 10:30 AM</option>
                  <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                  <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM</option>
                  <option value="06:00 PM - 06:30 PM">06:00 PM - 06:30 PM</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSlotModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingSlot}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {addingSlot ? 'Adding...' : 'Save Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
