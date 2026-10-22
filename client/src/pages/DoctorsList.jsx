import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Star,
  Award,
  Calendar,
  Clock,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { doctorService, symptomService } from '../services/api';
import BookingModal from '../components/BookingModal';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';

const DoctorsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSpec = searchParams.get('specialization') || '';

  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState(initialSpec);
  const [searchQuery, setSearchQuery] = useState('');
  const [minExp, setMinExp] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState(null);

  // Load specializations for dropdown
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await symptomService.getSpecializations();
        if (res.success) setSpecializations(res.data);
      } catch (err) {
        console.error('Failed to load specializations:', err);
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch doctors with current filters
  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedSpec) params.specialization = selectedSpec;
      if (searchQuery) params.search = searchQuery;
      if (minExp) params.minExp = minExp;

      const res = await doctorService.getAll(params);
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load doctors list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpec, minExp]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  return (
    <div>
      {/* Title & Filter Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.4rem' }}>
          Find Medical Specialists
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Browse verified physicians, view credentials, and reserve available consultation slots.
        </p>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '1.25rem' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          {/* Search text */}
          <div>
            <label className="form-label">Search Doctor or Specialty</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Dr. Rajesh, Cardiology..."
                className="form-control"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label className="form-label">Department / Specialty</label>
            <select
              value={selectedSpec}
              onChange={(e) => {
                setSelectedSpec(e.target.value);
                setSearchParams(e.target.value ? { specialization: e.target.value } : {});
              }}
              className="form-control"
            >
              <option value="">All Departments</option>
              {specializations.map((spec) => (
                <option key={spec._id} value={spec._id}>
                  {spec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div>
            <label className="form-label">Minimum Experience</label>
            <select
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="form-control"
            >
              <option value="">Any Experience</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
              <option value="15">15+ Years</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              <Search size={16} /> Search
            </button>
            {(selectedSpec || searchQuery || minExp) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSpec('');
                  setSearchQuery('');
                  setMinExp('');
                  setSearchParams({});
                }}
                className="btn btn-secondary"
                title="Reset filters"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 4 Core States: Error State */}
      {error && (
        <Alert
          type="error"
          title="Error Loading Doctors"
          message={error}
          onClose={() => setError('')}
        />
      )}

      {/* 4 Core States: Loading State */}
      {loading ? (
        <LoadingSpinner message="Retrieving verified medical specialists and availability schedules..." />
      ) : doctors.length === 0 ? (
        /* 4 Core States: Empty State */
        <EmptyState
          icon={Stethoscope}
          title="No Specialists Found"
          description="No doctors match your selected filters. Try choosing 'All Departments' or resetting your search."
          actionText="Clear All Filters"
          onAction={() => {
            setSelectedSpec('');
            setSearchQuery('');
            setMinExp('');
            setSearchParams({});
          }}
        />
      ) : (
        /* 4 Core States: Success State */
        <div className="grid-2">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="card card-hover"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '1.5rem',
              }}
            >
              <div>
                {/* Doctor Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--primary-light)',
                        color: 'var(--primary-dark)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.2rem',
                        flexShrink: 0,
                      }}
                    >
                      {doctor.user?.name?.replace('Dr. ', '').charAt(0) || 'D'}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, lineHeight: 1.2 }}>
                        {doctor.user?.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--primary)',
                          fontWeight: 700,
                          marginTop: '0.2rem',
                        }}
                      >
                        {doctor.specialization?.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {doctor.qualifications}
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    <Star size={14} fill="#b45309" />
                    <span>{doctor.rating}</span>
                  </div>
                </div>

                {/* About snippet */}
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: 1.5,
                    marginBottom: '1.25rem',
                  }}
                >
                  {doctor.about}
                </p>

                {/* Badges / stats */}
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Experience: </span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {doctor.experienceYears} Years
                    </strong>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--border)' }} />
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Consultation: </span>
                    <strong style={{ color: 'var(--secondary)' }}>
                      ₹{doctor.consultationFee}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setBookingDoctor(doctor)}
                className="btn btn-primary btn-block"
              >
                <Calendar size={16} /> Book Appointment
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {bookingDoctor && (
        <BookingModal
          doctor={bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          onSuccess={() => {
            setBookingDoctor(null);
          }}
        />
      )}
    </div>
  );
};

export default DoctorsList;
