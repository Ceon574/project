import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Calendar,
  DollarSign,
  UserPlus,
  Trash2,
  Filter,
  CheckCircle,
  Clock,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { adminService, symptomService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [activeTab, setActiveTab] = useState('appointments');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Doctor Form state
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    email: '',
    password: 'doc123',
    specializationId: '',
    experienceYears: '5',
    consultationFee: '600',
    qualifications: 'MBBS, MD',
    about: 'Experienced clinical specialist committed to evidence-based healthcare.',
    phone: '+91 9447000000',
  });
  const [creatingDoctor, setCreatingDoctor] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, appRes, specRes] = await Promise.all([
        adminService.getStats(),
        adminService.getAllAppointments(),
        symptomService.getSpecializations(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (appRes.success) setAppointments(appRes.data);
      if (specRes.success) setSpecializations(specRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.email || !doctorForm.specializationId) {
      alert('Please fill in doctor name, username/email, and specialization.');
      return;
    }

    setCreatingDoctor(true);
    try {
      await adminService.createDoctor(doctorForm);
      alert('Doctor created and registered successfully!');
      setShowDoctorModal(false);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to create doctor account.');
    } finally {
      setCreatingDoctor(false);
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
            Hospital Administration Console
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            System-wide analytics, practitioner management, and clinical audit logs.
          </p>
        </div>
        <button onClick={() => setShowDoctorModal(true)} className="btn btn-primary">
          <UserPlus size={16} /> Add Doctor Account
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* KPI Stats Cards */}
      {stats && (
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          <div className="card">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              TOTAL REGISTERED PATIENTS
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0' }}>
              {stats.totalPatients}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
              Active Patient Base
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              ON-DUTY MEDICAL DOCTORS
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0' }}>
              {stats.totalDoctors}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
              Across {stats.totalSpecializations} Departments
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              TOTAL APPOINTMENTS
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0' }}>
              {stats.totalAppointments}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>
              {stats.statusBreakdown?.confirmed || 0} Confirmed •{' '}
              {stats.statusBreakdown?.completed || 0} Completed
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              REVENUE GENERATED
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0', color: 'var(--secondary)' }}>
              ₹{stats.totalRevenue?.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
              Consultation Fees
            </div>
          </div>
        </div>
      )}

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
          onClick={() => setActiveTab('appointments')}
          className={`btn btn-sm ${activeTab === 'appointments' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Hospital Appointments ({appointments.length})
        </button>
      </div>

      {/* Appointments Audit Table */}
      {loading ? (
        <LoadingSpinner message="Loading hospital audit logs..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Appointments Recorded"
          description="There are currently no recorded hospital consultations in the database."
        />
      ) : (
        <div className="card" style={{ padding: '0.5rem' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient Details</th>
                  <th>Assigned Doctor</th>
                  <th>Department</th>
                  <th>Date & Slot</th>
                  <th>Fee</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{app.patient?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.patient?.phone || app.patient?.email}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.doctor?.user?.name || 'N/A'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.doctor?.qualifications}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ backgroundColor: '#f1f5f9' }}>
                        {app.doctor?.specialization?.name || 'General'}
                      </span>
                    </td>
                    <td>
                      <div>{app.date}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {app.slotTime}
                      </div>
                    </td>
                    <td>
                      <strong>₹{app.consultationFee}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${app.status}`}>{app.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Doctor Modal */}
      {showDoctorModal && (
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
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Register New Doctor</h3>
              <button
                onClick={() => setShowDoctorModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor}>
              <div className="form-group">
                <label className="form-label">Doctor Full Name *</label>
                <input
                  type="text"
                  value={doctorForm.name}
                  onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                  placeholder="e.g. Dr. Thomas Kurian"
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Username / Email *</label>
                  <input
                    type="text"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    placeholder="e.g. dr.thomas"
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    value={doctorForm.password}
                    onChange={(e) => setDoctorForm({ ...doctorForm, password: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <select
                  value={doctorForm.specializationId}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, specializationId: e.target.value })
                  }
                  className="form-control"
                  required
                >
                  <option value="">Select Specialty</option>
                  {specializations.map((spec) => (
                    <option key={spec._id} value={spec._id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    value={doctorForm.experienceYears}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, experienceYears: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.consultationFee}
                    onChange={(e) =>
                      setDoctorForm({ ...doctorForm, consultationFee: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input
                  type="text"
                  value={doctorForm.qualifications}
                  onChange={(e) =>
                    setDoctorForm({ ...doctorForm, qualifications: e.target.value })
                  }
                  placeholder="MBBS, MD, DM"
                  className="form-control"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setShowDoctorModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDoctor}
                  className="btn btn-primary"
                  style={{ flex: 2 }}
                >
                  {creatingDoctor ? 'Creating...' : 'Register Doctor Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
