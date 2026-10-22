// Centralized API Client Module for Smart Doctor Appointment System

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to make HTTP requests with automatic JWT injection & error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('smart_doctor_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Auto logout on 401 token expiration
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('smart_doctor_token');
        localStorage.removeItem('smart_doctor_user');
      }
      const errorMsg = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
};

// API Service Functions grouped by domain
export const authService = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

export const doctorService = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/doctors${query ? `?${query}` : ''}`);
  },
  getById: (id) => request(`/doctors/${id}`),
  getMyProfile: () => request('/doctors/profile/me'),
  getAvailability: (id, date) =>
    request(`/doctors/${id}/availability${date ? `?date=${date}` : ''}`),
  setAvailability: (availabilityData) =>
    request('/doctors/availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    }),
};

export const appointmentService = {
  book: (appointmentData) =>
    request('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    }),
  getMyPatientAppointments: () => request('/appointments/my'),
  getDoctorAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/appointments/doctor${query ? `?${query}` : ''}`);
  },
  updateStatus: (id, updateData) =>
    request(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }),
  cancel: (id) =>
    request(`/appointments/${id}`, {
      method: 'DELETE',
    }),
};

export const symptomService = {
  getAll: () => request('/symptoms'),
  getSpecializations: () => request('/symptoms/specializations'),
  check: (symptomIds) =>
    request('/symptoms/check', {
      method: 'POST',
      body: JSON.stringify({ symptomIds }),
    }),
};

export const adminService = {
  getStats: () => request('/admin/stats'),
  getAllAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/appointments${query ? `?${query}` : ''}`);
  },
  createDoctor: (doctorData) =>
    request('/admin/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    }),
  deleteDoctor: (id) =>
    request(`/admin/doctors/${id}`, {
      method: 'DELETE',
    }),
  createSpecialization: (specData) =>
    request('/admin/specializations', {
      method: 'POST',
      body: JSON.stringify(specData),
    }),
  createSymptom: (symptomData) =>
    request('/admin/symptoms', {
      method: 'POST',
      body: JSON.stringify(symptomData),
    }),
};

export default {
  auth: authService,
  doctor: doctorService,
  appointment: appointmentService,
  symptom: symptomService,
  admin: adminService,
};
