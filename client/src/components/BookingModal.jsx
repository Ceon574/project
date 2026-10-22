import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { appointmentService, doctorService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingModal = ({ doctor, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [patientPhone, setPatientPhone] = useState(user?.phone || '');
  const [patientAge, setPatientAge] = useState(user?.age || '');

  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Default fallback slot schedule
  const defaultSlotsList = [
    '09:00 AM - 09:30 AM',
    '10:00 AM - 10:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '04:30 PM - 05:00 PM',
  ];

  // Fetch slots whenever selectedDate changes
  useEffect(() => {
    const fetchSlots = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const res = await doctorService.getAvailability(doctor._id, selectedDate);
        if (res.success && res.data && res.data.length > 0) {
          setSlots(res.data[0].slots || []);
        } else {
          // If no specific DB record yet for this date, render default unbooked slots
          setSlots(
            defaultSlotsList.map((time) => ({
              slotTime: time,
              isBooked: false,
            }))
          );
        }
      } catch (err) {
        setSlots(
          defaultSlotsList.map((time) => ({
            slotTime: time,
            isBooked: false,
          }))
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    if (doctor?._id) {
      fetchSlots();
    }
  }, [doctor, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      setError('Please select an available consultation time slot.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await appointmentService.book({
        doctorId: doctor._id,
        date: selectedDate,
        slotTime: selectedSlot,
        symptomsDescription,
        patientPhone,
        patientAge: Number(patientAge) || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
        navigate('/patient-dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container" style={{ padding: '1.75rem' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Schedule Consultation</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {doctor?.user?.name} • {doctor?.specialization?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={54} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
              Appointment Confirmed!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your appointment with {doctor?.user?.name} on {selectedDate} at {selectedSlot} has
              been scheduled.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fca5a5',
                  borderRadius: 'var(--radius-md)',
                  color: '#b91c1c',
                  fontSize: '0.85rem',
                  marginBottom: '1rem',
                }}
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Date selection */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} /> Select Consultation Date
              </label>
              <input
                type="date"
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="form-control"
                required
              />
            </div>

            {/* Time Slot selection */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} /> Choose Available Time Slot
              </label>
              {loadingSlots ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                  <Loader2 size={20} className="animate-spin" style={{ margin: '0 auto 0.5rem' }} />
                  <span style={{ fontSize: '0.8rem' }}>Checking doctor's calendar...</span>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.65rem',
                    marginTop: '0.35rem',
                  }}
                >
                  {slots.map((slot, idx) => {
                    const isSelected = selectedSlot === slot.slotTime;
                    const isBooked = slot.isBooked;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedSlot(slot.slotTime)}
                        style={{
                          padding: '0.65rem 0.5rem',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          borderRadius: 'var(--radius-md)',
                          border: isSelected
                            ? '2px solid var(--primary)'
                            : '1px solid var(--border)',
                          backgroundColor: isSelected
                            ? 'var(--primary-light)'
                            : isBooked
                            ? '#f1f5f9'
                            : '#ffffff',
                          color: isSelected
                            ? 'var(--primary-dark)'
                            : isBooked
                            ? '#94a3b8'
                            : 'var(--text-main)',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          textDecoration: isBooked ? 'line-through' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {slot.slotTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Symptoms / Reason */}
            <div className="form-group">
              <label className="form-label">Symptoms or Reason for Consultation</label>
              <textarea
                rows={2}
                value={symptomsDescription}
                onChange={(e) => setSymptomsDescription(e.target.value)}
                placeholder="Briefly describe your symptoms or concern..."
                className="form-control"
              />
            </div>

            {/* Patient Phone & Age */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Patient Age</label>
                <input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="form-control"
                />
              </div>
            </div>

            {/* Consultation Fee summary */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border)',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Consultation Fee:
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                ₹{doctor?.consultationFee}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !selectedSlot}
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Reserving...
                  </>
                ) : (
                  'Confirm & Schedule'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
