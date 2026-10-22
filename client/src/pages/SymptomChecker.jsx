import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Calendar,
  Star,
  Info,
  Check,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { symptomService } from '../services/api';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const res = await symptomService.getAll();
        if (res.success) {
          setSymptoms(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load symptoms database');
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  const toggleSymptom = (id) => {
    if (selectedSymptomIds.includes(id)) {
      setSelectedSymptomIds(selectedSymptomIds.filter((item) => item !== id));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, id]);
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptomIds.length === 0) {
      setError('Please select at least one symptom to analyze.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const res = await symptomService.check(selectedSymptomIds);
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.message || 'Symptom analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptomIds([]);
    setResult(null);
    setError('');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.65rem',
            backgroundColor: '#e0f2fe',
            color: '#0369a1',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.65rem',
          }}
        >
          <Sparkles size={14} /> CLINICAL TRIAGE ASSISTANT
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Smart Health Symptom Guidance
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Select the symptoms you are experiencing to receive automated urgency triage and specialist
          recommendations.
        </p>
      </div>

      {/* Medical Disclaimer Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: 'var(--radius-md)',
          color: '#92400e',
          fontSize: '0.85rem',
          marginBottom: '2rem',
        }}
      >
        <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px', color: '#b45309' }} />
        <div>
          <strong>Emergency Care Disclaimer:</strong> This triage tool provides general health
          guidance and is not a clinical diagnosis. If you are experiencing chest pain, severe
          breathing difficulty, profuse bleeding, or sudden paralysis, please seek immediate
          emergency room medical care.
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner message="Loading clinical symptom catalog..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
          {/* Step 1: Symptom Selector */}
          <div className="card">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border)',
                paddingBottom: '0.75rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                  Select Current Symptoms ({selectedSymptomIds.length} selected)
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Tap all options that match your condition
                </p>
              </div>
              {selectedSymptomIds.length > 0 && (
                <button onClick={handleReset} className="btn btn-secondary btn-sm">
                  Reset
                </button>
              )}
            </div>

            {/* Symptoms Chips Grid */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.65rem',
                marginBottom: '1.75rem',
                maxHeight: '400px',
                overflowY: 'auto',
                padding: '0.25rem',
              }}
            >
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptomIds.includes(symptom._id);

                return (
                  <button
                    key={symptom._id}
                    type="button"
                    onClick={() => toggleSymptom(symptom._id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.9rem',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '4px',
                        border: isSelected ? 'none' : '1px solid #cbd5e1',
                        backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {isSelected && <Check size={14} />}
                    </div>
                    <span>{symptom.name}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={analyzing || selectedSymptomIds.length === 0}
              className="btn btn-primary btn-block"
              style={{ padding: '0.85rem' }}
            >
              {analyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Evaluating Symptoms...
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Run Triage & Match Specialists
                </>
              )}
            </button>
          </div>

          {/* Step 2: Triage Results Section */}
          {result && (
            <div className="card" style={{ border: '2px solid var(--border)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '0.75rem',
                }}
              >
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Triage Assessment Result</h3>
                <span
                  className={`badge ${
                    result.urgencyLevel === 'HIGH'
                      ? 'badge-urgency-high'
                      : result.urgencyLevel === 'MEDIUM'
                      ? 'badge-urgency-medium'
                      : 'badge-urgency-low'
                  }`}
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
                >
                  Urgency: {result.urgencyLevel}
                </span>
              </div>

              {/* Guidance text banner */}
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor:
                    result.urgencyLevel === 'HIGH'
                      ? '#fef2f2'
                      : result.urgencyLevel === 'MEDIUM'
                      ? '#fffbeb'
                      : '#ecfdf5',
                  color:
                    result.urgencyLevel === 'HIGH'
                      ? '#991b1b'
                      : result.urgencyLevel === 'MEDIUM'
                      ? '#92400e'
                      : '#065f46',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  border: '1px solid',
                  borderColor:
                    result.urgencyLevel === 'HIGH'
                      ? '#fca5a5'
                      : result.urgencyLevel === 'MEDIUM'
                      ? '#fcd34d'
                      : '#a7f3d0',
                }}
              >
                {result.guidanceSummary}
              </div>

              {/* Red-Flag Warning Signs */}
              {result.warningSigns && result.warningSigns.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    <AlertTriangle size={16} /> Red-Flag Warning Signs To Watch For:
                  </h4>
                  <ul
                    style={{
                      paddingLeft: '1.25rem',
                      fontSize: '0.825rem',
                      color: 'var(--text-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.3rem',
                    }}
                  >
                    {result.warningSigns.map((sign, idx) => (
                      <li key={idx}>{sign}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommended Specialists */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.85rem' }}>
                  Recommended Department Specialists:
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.recommendedDoctors.map((doc) => (
                    <div
                      key={doc._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                          {doc.user?.name}
                        </div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary)',
                            fontWeight: 600,
                          }}
                        >
                          {doc.specialization?.name} • ₹{doc.consultationFee}
                        </div>
                      </div>

                      <button
                        onClick={() => setBookingDoctor(doc)}
                        className="btn btn-primary btn-sm"
                      >
                        <Calendar size={14} /> Book Slot
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onSuccess={() => setBookingDoctor(null)}
        />
      )}
    </div>
  );
};

export default SymptomChecker;
