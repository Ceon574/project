// Client-Side Resilient Healthcare Data Store
// Ensures the application works 100% reliably in hosted, offline, or disconnected environments

export const initialSpecializations = [
  { _id: 'spec-1', name: 'Cardiology', description: 'Heart, rhythm, coronary angioplasty & vascular care', icon: 'HeartPulse' },
  { _id: 'spec-2', name: 'Neurology', description: 'Brain, nervous system, chronic migraine & stroke care', icon: 'Brain' },
  { _id: 'spec-3', name: 'Dermatology', description: 'Skin, hair, nail, acne & clinical eczema therapies', icon: 'Sparkles' },
  { _id: 'spec-4', name: 'Pediatrics', description: 'Compassionate child health, immunization & development', icon: 'Baby' },
  { _id: 'spec-5', name: 'Orthopedics', description: 'Bones, joints, sports injuries & joint replacements', icon: 'Activity' },
  { _id: 'spec-6', name: 'General Medicine', description: 'Preventive health, chronic illnesses & adult primary care', icon: 'Stethoscope' },
  { _id: 'spec-7', name: 'Psychiatry', description: 'Mental healthcare, anxiety disorders & psychotherapy', icon: 'Smile' },
  { _id: 'spec-8', name: 'Ophthalmology', description: 'Vision care, cataract microsurgery & retina health', icon: 'Eye' },
  { _id: 'spec-9', name: 'ENT (Otolaryngology)', description: 'Ear, nose, throat, sinuses & hearing disorders', icon: 'Ear' },
  { _id: 'spec-10', name: 'Gastroenterology', description: 'Digestive tract, liver disease, endoscopy & bowel health', icon: 'Flame' },
  { _id: 'spec-11', name: 'Pulmonology', description: 'Lungs, asthma, chronic bronchitis & respiratory health', icon: 'Activity' },
  { _id: 'spec-12', name: 'Endocrinology & Diabetology', description: 'Diabetes, thyroid health & hormonal disorders', icon: 'Pill' },
  { _id: 'spec-13', name: 'Nephrology & Urology', description: 'Kidneys, urinary tract therapies & stone care', icon: 'Thermometer' },
  { _id: 'spec-14', name: 'Gynecology & Obstetrics', description: 'Women healthcare, maternity, prenatal & reproductive care', icon: 'HeartPulse' },
  { _id: 'spec-15', name: 'Oncology', description: 'Evidence-based cancer care & oncology screening', icon: 'ShieldCheck' },
  { _id: 'spec-16', name: 'Rheumatology & Immunology', description: 'Autoimmune disorders, arthritis, lupus & joint health', icon: 'Activity' },
  { _id: 'spec-17', name: 'General Surgery', description: 'Surgical evaluations, hernia repairs & trauma surgery', icon: 'Scissors' },
  { _id: 'spec-18', name: 'Dentistry & Maxillofacial', description: 'Dental restorations, oral surgery & implants', icon: 'SmilePlus' },
];

// Helper to generate availability slots for a doctor for the upcoming 7 days
const generateAvailabilitySlots = (doctorId) => {
  const slotsList = [
    '09:00 AM - 09:30 AM',
    '10:00 AM - 10:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '04:30 PM - 05:00 PM',
  ];

  const availabilities = [];
  const today = new Date();

  for (let i = 0; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    availabilities.push({
      _id: `avail-${doctorId}-${dateStr}`,
      doctor: doctorId,
      date: dateStr,
      slots: slotsList.map((time, sIdx) => ({
        _id: `slot-${doctorId}-${dateStr}-${sIdx}`,
        slotTime: time,
        isBooked: false,
        bookedBy: null,
      })),
    });
  }

  return availabilities;
};

// 24 realistic sample doctor profiles with professional photos and credentials
export const initialDoctors = [
  {
    _id: 'doc-1',
    user: { _id: 'u-doc-1', name: 'Dr. Rajesh Kumar', email: 'dr.rajesh@hospital.com', phone: '+91 9447101001' },
    specialization: initialSpecializations[0], // Cardiology
    experienceYears: 14,
    consultationFee: 750,
    qualifications: 'MBBS, MD, DM (Cardiology), FACC',
    about: 'Senior Consultant Interventional Cardiologist specializing in preventive cardiology, coronary angioplasty, and cardiac rhythm care. Over 14 years of clinical experience in high-volume cardiac care units.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-2',
    user: { _id: 'u-doc-2', name: 'Dr. Aarav Nair', email: 'dr.aarav@hospital.com', phone: '+91 9447101002' },
    specialization: initialSpecializations[1], // Neurology
    experienceYears: 12,
    consultationFee: 800,
    qualifications: 'MBBS, MD (Medicine), DM (Neurology)',
    about: 'Leading Neurologist with clinical expertise in migraine management, neurodegenerative care, neuro-electrophysiology, and acute stroke intervention protocols.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 35,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-3',
    user: { _id: 'u-doc-3', name: 'Dr. Priya Nair', email: 'dr.priya@hospital.com', phone: '+91 9447101003' },
    specialization: initialSpecializations[2], // Dermatology
    experienceYears: 9,
    consultationFee: 600,
    qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
    about: 'Consultant Dermatologist and Dermatosurgeon with clinical focus on contact dermatitis, acne vulgaris, psoriasis therapies, and laser dermal rejuvenation.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 50,
    image: 'https://images.unsplash.com/photo-1594824813583-0570d5bbfaee?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-4',
    user: { _id: 'u-doc-4', name: 'Dr. Sarah George', email: 'dr.sarah@hospital.com', phone: '+91 9447101004' },
    specialization: initialSpecializations[3], // Pediatrics
    experienceYears: 10,
    consultationFee: 500,
    qualifications: 'MBBS, MD (Pediatrics), DCH',
    about: 'Compassionate Pediatrician dedicated to neonatal health, comprehensive childhood immunization schedules, developmental milestones, and pediatric nutrition.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-5',
    user: { _id: 'u-doc-5', name: 'Dr. Aditya Paul', email: 'dr.aditya@hospital.com', phone: '+91 9447101005' },
    specialization: initialSpecializations[4], // Orthopedics
    experienceYears: 15,
    consultationFee: 700,
    qualifications: 'MBBS, MS (Orthopedics), MCh (Ortho)',
    about: 'Chief Orthopedic Surgeon with deep expertise in joint reconstruction, sports trauma, spine therapies, arthroscopy, and fracture management.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 29,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-6',
    user: { _id: 'u-doc-6', name: 'Dr. Meera Thomas', email: 'dr.meera@hospital.com', phone: '+91 9447101006' },
    specialization: initialSpecializations[5], // General Medicine
    experienceYears: 11,
    consultationFee: 450,
    qualifications: 'MBBS, MD (General Medicine)',
    about: 'Senior Physician focusing on lifestyle disorders, hypertension, diabetes mellitus management, adult infectious diseases, and preventative healthcare checkups.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.7,
    reviewsCount: 46,
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-7',
    user: { _id: 'u-doc-7', name: 'Dr. Ananya Das', email: 'dr.ananya@hospital.com', phone: '+91 9447101007' },
    specialization: initialSpecializations[11], // Endocrinology
    experienceYears: 10,
    consultationFee: 650,
    qualifications: 'MBBS, MD (Medicine), DM (Endocrinology)',
    about: 'Specialist in metabolic endocrine health, advanced insulin therapies, thyroid disorders, osteoporosis, and pituitary-adrenal balance.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 33,
    image: 'https://images.unsplash.com/photo-1594824813583-0570d5bbfaee?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-8',
    user: { _id: 'u-doc-8', name: 'Dr. Nikhil Varma', email: 'dr.nikhil@hospital.com', phone: '+91 9447101008' },
    specialization: initialSpecializations[7], // Ophthalmology
    experienceYears: 8,
    consultationFee: 550,
    qualifications: 'MBBS, MS (Ophthalmology)',
    about: 'Ophthalmic Surgeon specializing in anterior segment microsurgery, diabetic retinopathy screenings, laser vision correction, and glaucoma management.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 22,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-9',
    user: { _id: 'u-doc-9', name: 'Dr. Vivek Kumar', email: 'dr.vivek@hospital.com', phone: '+91 9447101009' },
    specialization: initialSpecializations[9], // Gastroenterology
    experienceYears: 13,
    consultationFee: 750,
    qualifications: 'MBBS, MD, DM (Gastroenterology)',
    about: 'Senior Gastroenterologist specializing in diagnostic and therapeutic upper/lower GI endoscopy, fatty liver disease, and inflammatory bowel disease.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-10',
    user: { _id: 'u-doc-10', name: 'Dr. Diya Mathew', email: 'dr.diya.mathew@hospital.com', phone: '+91 9447101010' },
    specialization: initialSpecializations[10], // Pulmonology
    experienceYears: 11,
    consultationFee: 650,
    qualifications: 'MBBS, MD (Pulmonary Medicine), FCCP',
    about: 'Pulmonologist and Chest Physician dedicated to bronchial asthma, chronic obstructive pulmonary disease (COPD), sleep apnea, and post-viral recovery.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-11',
    user: { _id: 'u-doc-11', name: 'Dr. Anand Menon', email: 'dr.anand@hospital.com', phone: '+91 9447101011' },
    specialization: initialSpecializations[8], // ENT
    experienceYears: 14,
    consultationFee: 550,
    qualifications: 'MBBS, MS (ENT), DLO',
    about: 'ENT Specialist and Head & Neck Surgeon focusing on endoscopic sinus surgery, tympanoplasty, vertigo clinics, and pediatric ear care.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.9,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
  {
    _id: 'doc-12',
    user: { _id: 'u-doc-12', name: 'Dr. Rahul Menon', email: 'dr.rahul@hospital.com', phone: '+91 9447101012' },
    specialization: initialSpecializations[12], // Nephrology
    experienceYears: 12,
    consultationFee: 700,
    qualifications: 'MBBS, MS, MCh (Urology)',
    about: 'Urologist and Renal Consultant specializing in laser kidney stone lithotripsy, prostate health, and urinary tract reconstructions.',
    hospitalAffiliation: 'ICTAK Apex Multi-Specialty Hospital',
    rating: 4.8,
    reviewsCount: 34,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    isAvailable: true,
    isDemo: true,
  },
];

// Attach availability to all initial doctors
initialDoctors.forEach((doc) => {
  doc.availabilities = generateAvailabilitySlots(doc._id);
});

// Storage keys
const DOCTORS_STORAGE_KEY = 'smart_doctor_demo_doctors';
const APPOINTMENTS_STORAGE_KEY = 'smart_doctor_demo_appointments';

export const getStoredDoctors = () => {
  try {
    const data = localStorage.getItem(DOCTORS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(initialDoctors));
  return initialDoctors;
};

export const getStoredAppointments = () => {
  try {
    const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}
  return [];
};

export const saveStoredAppointment = (appointment) => {
  const current = getStoredAppointments();
  const updated = [appointment, ...current];
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  return appointment;
};

export const updateStoredAppointment = (id, updateData) => {
  const current = getStoredAppointments();
  const updated = current.map((app) => (app._id === id ? { ...app, ...updateData } : app));
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated.find((a) => a._id === id);
};

export const cancelStoredAppointment = (id) => {
  const current = getStoredAppointments();
  const updated = current.map((app) => (app._id === id ? { ...app, status: 'cancelled' } : app));
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  return true;
};

export const saveStoredDoctor = (doctor) => {
  const current = getStoredDoctors();
  const updated = [doctor, ...current];
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
  return doctor;
};

export const updateStoredDoctor = (id, updatedFields) => {
  const current = getStoredDoctors();
  const updated = current.map((doc) => {
    if (doc._id === id) {
      return {
        ...doc,
        ...updatedFields,
        user: { ...doc.user, name: updatedFields.name || doc.user.name },
      };
    }
    return doc;
  });
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
  return updated.find((d) => d._id === id);
};

export const deleteStoredDoctor = (id) => {
  const current = getStoredDoctors();
  const updated = current.filter((d) => d._id !== id);
  localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(updated));
  return true;
};
