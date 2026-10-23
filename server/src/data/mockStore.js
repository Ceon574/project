// In-Memory Data Store Fallback for Zero-Config Local Execution
// Seamlessly operates when MongoDB is not running locally

const { specializationsData, symptomsData, doctorsData } = require('./seedData');

class MockStore {
  constructor() {
    this.specializations = [];
    this.symptoms = [];
    this.users = [];
    this.doctors = [];
    this.availabilities = [];
    this.appointments = [];

    this.init();
  }

  init() {
    console.log('📦 Initializing In-Memory Fallback Healthcare Store...');

    // 1. Initialize Specializations
    this.specializations = specializationsData.map((spec, index) => ({
      _id: `spec-${index + 1}`,
      name: spec.name,
      description: spec.description,
      icon: spec.icon,
    }));

    const specMap = {};
    this.specializations.forEach((s) => {
      specMap[s.name] = s;
    });

    // 2. Initialize Symptoms
    this.symptoms = symptomsData.map((sym, index) => ({
      _id: `sym-${index + 1}`,
      name: sym.name,
      specialization: specMap[sym.specializationName] || this.specializations[0],
      guidanceText: sym.guidanceText,
      urgencyLevel: sym.urgencyLevel,
      warningSigns: sym.warningSigns || [],
    }));

    // 3. Initialize Admin & Patients
    const adminUser = {
      _id: 'user-admin',
      name: 'System Hospital Administrator',
      email: 'admin',
      role: 'admin',
      phone: '+91 9447000000',
      password: 'admin123',
    };
    this.users.push(adminUser);

    const patient1 = {
      _id: 'user-patient-1',
      name: 'Ananya Menon',
      email: 'patient1',
      role: 'patient',
      phone: '+91 9876543210',
      age: 28,
      gender: 'Female',
      address: 'Skyline Haven, Kakkanad, Kochi, Kerala',
      password: 'pat123',
    };
    const patient2 = {
      _id: 'user-patient-2',
      name: 'Arjun Krishnan',
      email: 'patient2',
      role: 'patient',
      phone: '+91 9876543211',
      age: 34,
      gender: 'Male',
      address: 'Palm Meadows, Thrissur, Kerala',
      password: 'pat123',
    };
    this.users.push(patient1, patient2);

    // 4. Initialize All 24 Doctors
    const today = new Date();
    const defaultSlots = [
      '09:00 AM - 09:30 AM',
      '10:00 AM - 10:30 AM',
      '11:30 AM - 12:00 PM',
      '02:00 PM - 02:30 PM',
      '03:30 PM - 04:00 PM',
      '04:30 PM - 05:00 PM',
    ];

    doctorsData.forEach((doc, idx) => {
      const username = doc.email.split('@')[0];
      const docUser = {
        _id: `user-doc-${idx + 1}`,
        name: doc.name,
        email: username,
        role: 'doctor',
        phone: doc.phone,
        password: 'doc123',
      };
      this.users.push(docUser);

      const doctorObj = {
        _id: `doc-${idx + 1}`,
        user: docUser,
        specialization: specMap[doc.specializationName] || this.specializations[0],
        experienceYears: doc.experienceYears,
        consultationFee: doc.consultationFee,
        qualifications: doc.qualifications,
        about: doc.about,
        rating: doc.rating,
        reviewsCount: doc.reviewsCount,
        hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
        isAvailable: true,
      };
      this.doctors.push(doctorObj);

      // Create Availability slots for upcoming 7 days
      for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
        const d = new Date(today);
        d.setDate(today.getDate() + dayOffset);
        const dateStr = d.toISOString().split('T')[0];

        this.availabilities.push({
          _id: `avail-${idx + 1}-${dateStr}`,
          doctor: doctorObj._id,
          date: dateStr,
          slots: defaultSlots.map((time, slotIdx) => ({
            _id: `slot-${idx + 1}-${dateStr}-${slotIdx}`,
            slotTime: time,
            isBooked: false,
            bookedBy: null,
          })),
        });
      }
    });

    // 5. Seed Sample Appointments
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    // Appointment 1: Confirmed
    this.appointments.push({
      _id: 'app-1',
      patient: patient1,
      doctor: this.doctors[0], // Dr. Rajesh Kumar (Cardiology)
      specialization: this.doctors[0].specialization,
      date: tomorrowStr,
      slotTime: '10:00 AM - 10:30 AM',
      symptomsDescription: 'Occasional mild palpitations after morning jogging.',
      status: 'confirmed',
      consultationFee: this.doctors[0].consultationFee,
      patientAge: 28,
      patientPhone: '+91 9876543210',
      createdAt: new Date().toISOString(),
    });

    // Mark slot booked in availability
    const availTomorrow = this.availabilities.find(
      (a) => a.doctor === this.doctors[0]._id && a.date === tomorrowStr
    );
    if (availTomorrow) {
      const slot = availTomorrow.slots.find((s) => s.slotTime === '10:00 AM - 10:30 AM');
      if (slot) {
        slot.isBooked = true;
        slot.bookedBy = patient1._id;
      }
    }

    // Appointment 2: Completed with notes & Rx
    this.appointments.push({
      _id: 'app-2',
      patient: patient2,
      doctor: this.doctors[2], // Dr. Priya Nair (Dermatology)
      specialization: this.doctors[2].specialization,
      date: todayStr,
      slotTime: '09:00 AM - 09:30 AM',
      symptomsDescription: 'Contact dermatitis on right forearm after gardening.',
      status: 'completed',
      consultationFee: this.doctors[2].consultationFee,
      patientAge: 34,
      patientPhone: '+91 9876543211',
      consultationNotes: 'Erythematous macular lesions observed. No systemic reaction or infection signs.',
      prescription: 'Rx: Hydrocortisone 1% topical cream twice daily for 7 days. Cetirizine 10mg once daily at bedtime for itching.',
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Mock Store Ready: ${this.doctors.length} Doctors, ${this.specializations.length} Departments, ${this.symptoms.length} Symptoms.`);
  }

  // --- Doctor Queries ---
  getDoctors({ specialization, search, minExp, maxFee } = {}) {
    let result = [...this.doctors];

    if (specialization) {
      result = result.filter(
        (doc) =>
          doc.specialization?._id === specialization ||
          doc.specialization?.name.toLowerCase() === specialization.toLowerCase()
      );
    }

    if (minExp) {
      result = result.filter((doc) => doc.experienceYears >= Number(minExp));
    }

    if (maxFee) {
      result = result.filter((doc) => doc.consultationFee <= Number(maxFee));
    }

    if (search) {
      const term = search.toLowerCase();
      result = result.filter((doc) => {
        const name = doc.user?.name?.toLowerCase() || '';
        const spec = doc.specialization?.name?.toLowerCase() || '';
        return name.includes(term) || spec.includes(term);
      });
    }

    return result;
  }

  getDoctorById(id) {
    const doctor = this.doctors.find((d) => d._id === id);
    if (!doctor) return null;

    const availabilities = this.availabilities.filter((a) => a.doctor === id);
    return {
      ...doctor,
      availabilities,
    };
  }

  getDoctorAvailability(doctorId, date) {
    let query = this.availabilities.filter((a) => a.doctor === doctorId);
    if (date) query = query.filter((a) => a.date === date);
    return query;
  }

  setDoctorAvailability(doctorId, date, slots) {
    let avail = this.availabilities.find((a) => a.doctor === doctorId && a.date === date);
    const formattedSlots = slots.map((s, idx) => ({
      _id: `slot-dyn-${Date.now()}-${idx}`,
      slotTime: typeof s === 'string' ? s : s.slotTime,
      isBooked: false,
    }));

    if (avail) {
      avail.slots = formattedSlots;
    } else {
      avail = {
        _id: `avail-dyn-${Date.now()}`,
        doctor: doctorId,
        date,
        slots: formattedSlots,
      };
      this.availabilities.push(avail);
    }
    return avail;
  }

  // --- Specializations & Symptoms ---
  getSpecializations() {
    return this.specializations;
  }

  getSymptoms() {
    return this.symptoms;
  }

  checkSymptoms(symptomIds = []) {
    const matched = this.symptoms.filter((s) => symptomIds.includes(s._id));
    let highestUrgency = 'LOW';
    const ranks = { LOW: 1, MEDIUM: 2, HIGH: 3 };

    let warningSigns = [];
    const specMap = new Map();

    matched.forEach((sym) => {
      if (ranks[sym.urgencyLevel] > ranks[highestUrgency]) {
        highestUrgency = sym.urgencyLevel;
      }
      if (sym.warningSigns) warningSigns.push(...sym.warningSigns);
      if (sym.specialization) {
        specMap.set(sym.specialization._id, sym.specialization);
      }
    });

    warningSigns = [...new Set(warningSigns)];
    const recommendedSpecializations = Array.from(specMap.values());
    const specIds = Array.from(specMap.keys());

    const recommendedDoctors = this.doctors
      .filter((d) => specIds.includes(d.specialization._id))
      .slice(0, 6);

    return {
      analyzedSymptomsCount: matched.length,
      urgencyLevel: highestUrgency,
      guidanceSummary:
        highestUrgency === 'HIGH'
          ? 'CRITICAL NOTICE: One or more selected symptoms indicate severe medical risk. Seek immediate emergency medical care or visit the nearest emergency department right away.'
          : highestUrgency === 'MEDIUM'
          ? 'CLINICAL NOTICE: Moderate symptoms detected. Schedule a formal consultation with the recommended medical specialist within 24 to 48 hours.'
          : 'MILD NOTICE: Mild symptoms observed. Monitor closely and consult a primary care physician if symptoms persist or worsen.',
      symptoms: matched,
      warningSigns,
      recommendedSpecializations,
      recommendedDoctors,
    };
  }

  // --- Auth & Users ---
  findUser(emailOrUsername) {
    const term = (emailOrUsername || '').toLowerCase();
    return this.users.find(
      (u) =>
        u.email.toLowerCase() === term ||
        (u.email.includes('@') && u.email.split('@')[0].toLowerCase() === term)
    );
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'patient',
      phone: userData.phone || '',
      age: userData.age || null,
      gender: userData.gender || '',
      address: userData.address || '',
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- Appointments ---
  bookAppointment({ patientId, doctorId, date, slotTime, symptomsDescription, patientPhone, patientAge }) {
    const doctor = this.doctors.find((d) => d._id === doctorId);
    const patient = this.users.find((u) => u._id === patientId);

    if (!doctor) throw new Error('Doctor not found');
    if (!patient) throw new Error('Patient not found');

    // Mark slot booked in availability
    const avail = this.availabilities.find((a) => a.doctor === doctorId && a.date === date);
    if (avail) {
      const slot = avail.slots.find((s) => s.slotTime === slotTime);
      if (slot) {
        if (slot.isBooked) throw new Error('This time slot is already booked. Please choose another.');
        slot.isBooked = true;
        slot.bookedBy = patientId;
      }
    }

    const appointment = {
      _id: `app-${Date.now()}`,
      patient,
      doctor,
      specialization: doctor.specialization,
      date,
      slotTime,
      symptomsDescription: symptomsDescription || '',
      status: 'confirmed',
      consultationFee: doctor.consultationFee,
      patientPhone: patientPhone || patient.phone,
      patientAge: patientAge || patient.age,
      createdAt: new Date().toISOString(),
    };

    this.appointments.unshift(appointment);
    return appointment;
  }

  getPatientAppointments(patientId) {
    return this.appointments.filter((a) => a.patient._id === patientId);
  }

  getDoctorAppointments(userId, status) {
    const doctor = this.doctors.find((d) => d.user._id === userId);
    if (!doctor) return [];

    let list = this.appointments.filter((a) => a.doctor._id === doctor._id);
    if (status) list = list.filter((a) => a.status === status);
    return list;
  }

  updateAppointmentStatus(id, { status, consultationNotes, prescription }) {
    const app = this.appointments.find((a) => a._id === id);
    if (!app) throw new Error('Appointment not found');

    if (status) app.status = status;
    if (consultationNotes !== undefined) app.consultationNotes = consultationNotes;
    if (prescription !== undefined) app.prescription = prescription;

    return app;
  }

  cancelAppointment(id, userId, userRole) {
    const app = this.appointments.find((a) => a._id === id);
    if (!app) throw new Error('Appointment not found');

    if (userRole === 'patient' && app.patient._id !== userId) {
      throw new Error('Not authorized to cancel this appointment');
    }

    app.status = 'cancelled';

    // Free slot in availability
    const avail = this.availabilities.find((a) => a.doctor === app.doctor._id && a.date === app.date);
    if (avail) {
      const slot = avail.slots.find((s) => s.slotTime === app.slotTime);
      if (slot) {
        slot.isBooked = false;
        slot.bookedBy = null;
      }
    }

    return app;
  }

  // --- Admin ---
  getAdminStats() {
    const totalPatients = this.users.filter((u) => u.role === 'patient').length;
    const totalDoctors = this.doctors.length;
    const totalSpecializations = this.specializations.length;
    const totalAppointments = this.appointments.length;

    const confirmed = this.appointments.filter((a) => a.status === 'confirmed').length;
    const pending = this.appointments.filter((a) => a.status === 'pending').length;
    const completed = this.appointments.filter((a) => a.status === 'completed').length;
    const cancelled = this.appointments.filter((a) => a.status === 'cancelled').length;

    const totalRevenue = this.appointments
      .filter((a) => a.status === 'confirmed' || a.status === 'completed')
      .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

    return {
      totalPatients,
      totalDoctors,
      totalSpecializations,
      totalAppointments,
      statusBreakdown: { confirmed, pending, completed, cancelled },
      totalRevenue,
      recentAppointments: this.appointments.slice(0, 5),
    };
  }

  getAllAppointments(status, date) {
    let list = [...this.appointments];
    if (status) list = list.filter((a) => a.status === status);
    if (date) list = list.filter((a) => a.date === date);
    return list;
  }
}

// Export singleton instance
const mockStore = new MockStore();
module.exports = mockStore;
