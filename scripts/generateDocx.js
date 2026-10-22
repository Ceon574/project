const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} = require('docx');

// Helper to create heading
const createHeading = (text, level = HeadingLevel.HEADING_1) =>
  new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
  });

// Helper for standard paragraph
const createParagraph = (text, options = {}) =>
  new Paragraph({
    children: [
      new TextRun({
        text,
        size: 22, // 11pt
        font: 'Calibri',
        ...options,
      }),
    ],
    spacing: { after: 100 },
  });

// Helper for bullet item
const createBullet = (text, boldPrefix = '') =>
  new Paragraph({
    bullet: { level: 0 },
    children: [
      boldPrefix ? new TextRun({ text: boldPrefix, bold: true, size: 22, font: 'Calibri' }) : new TextRun(''),
      new TextRun({ text, size: 22, font: 'Calibri' }),
    ],
    spacing: { after: 60 },
  });

// Helper for table cell
const createCell = (text, isHeader = false) =>
  new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
            bold: isHeader,
            size: 20,
            font: 'Calibri',
            color: isHeader ? 'FFFFFF' : '000000',
          }),
        ],
      }),
    ],
    shading: isHeader ? { fill: '0284C7' } : { fill: 'F8FAFC' },
    margins: { top: 100, bottom: 100, left: 120, right: 120 },
  });

// -------------------------------------------------------------
// 1. GENERATE SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
// -------------------------------------------------------------
const generateSRS = async () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'SOFTWARE REQUIREMENTS SPECIFICATION',
                bold: true,
                size: 36,
                color: '0369A1',
                font: 'Calibri',
              }),
            ],
            spacing: { before: 300, after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Smart Doctor Appointment & Clinical Guidance System',
                bold: true,
                size: 28,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'IEEE Std 830-1998 Compliant Specification\nInformation & Communication Technology Academy of Kerala (ICTAK)',
                size: 20,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 400 },
          }),

          createHeading('1. Introduction', HeadingLevel.HEADING_1),
          createParagraph('This Software Requirements Specification (SRS) defines the functional, non-functional, interface, and behavioral requirements for the Smart Doctor Appointment & Clinical Guidance System. The project is developed for the ICT Academy of Kerala Full Stack Application Development program.'),
          createBullet('Mandatory functional components and architectural layers.', '1.1 Purpose: '),
          createBullet('ICTAK academic evaluators, clinical managers, and full-stack software engineers.', '1.2 Intended Audience: '),
          createBullet('Delivers an integrated MERN stack portal featuring automated symptom triage, real-time doctor availability scheduling, and role-based portals for Patients, Doctors, and Administrators.', '1.3 Scope: '),

          createHeading('2. Overall Description & User Classes', HeadingLevel.HEADING_1),
          createParagraph('The system utilizes a modern 3-tier MERN architecture: a React 18 single-page application communicating via a stateless RESTful JSON API with Node.js/Express, persisting documents in MongoDB.'),
          createBullet('Can self-register, check symptoms with automated triage urgency levels, search specialists, book 30-minute consultation slots, and review doctor notes and prescriptions.', 'Patient Role: '),
          createBullet('Manages upcoming appointments, accepts or cancels consultations, adds availability slots, and enters clinical notes with electronic prescriptions.', 'Doctor Role: '),
          createBullet('Accesses hospital-wide KPIs, audits all consultations, registers new doctor profiles, and manages departments.', 'Administrator Role: '),

          createHeading('3. Functional Requirements', HeadingLevel.HEADING_1),
          createBullet('System shall authenticate users using JWT with bcrypt password salting.', 'FR-01 (Authentication): '),
          createBullet('System shall enforce strict Role-Based Access Control (RBAC), returning 403 Forbidden for unauthorized endpoints.', 'FR-02 (Authorization): '),
          createBullet('Patients can search and filter doctors by department, name, experience, and fee.', 'FR-03 (Doctor Directory): '),
          createBullet('Patients can book unreserved 30-minute consultation slots with atomic reservation checks to prevent double-booking.', 'FR-04 (Slot Booking): '),
          createBullet('Multi-symptom triage matrix calculates overall urgency (HIGH, MEDIUM, LOW) and matches corresponding specialists.', 'FR-05 (Symptom Checker): '),
          createBullet('Doctors can mark consultations as completed, recording clinical diagnosis and prescriptions.', 'FR-06 (Prescription Records): '),
          createBullet('Administrators can view total patients, doctors, appointments, and hospital revenue metrics.', 'FR-07 (Admin Analytics): '),

          createHeading('4. Verification & Test Matrix', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Test ID', true),
                  createCell('Description', true),
                  createCell('Expected Outcome', true),
                  createCell('Result', true),
                ],
              }),
              new TableRow({
                children: [
                  createCell('TC-01'),
                  createCell('User Registration & Login'),
                  createCell('Password hashed with bcrypt; JWT token issued'),
                  createCell('PASSED'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('TC-02'),
                  createCell('RBAC Endpoint Protection'),
                  createCell('Unauthorized role receives 403 Forbidden'),
                  createCell('PASSED'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('TC-03'),
                  createCell('Slot Collision Prevention'),
                  createCell('Already booked slot rejected with 400 Bad Request'),
                  createCell('PASSED'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('TC-04'),
                  createCell('Symptom Triage Analysis'),
                  createCell('Flags High Urgency and displays emergency disclaimer'),
                  createCell('PASSED'),
                ],
              }),
            ],
          }),

          createHeading('5. Non-Functional Requirements', HeadingLevel.HEADING_1),
          createBullet('Average API response time under 300ms for all standard queries.', '5.1 Performance: '),
          createBullet('Stateless JWT token expiration (7 days), zero plain-text passwords, CORS origin filtering.', '5.2 Security: '),
          createBullet('Prominent emergency disclaimer displayed on symptom triage pages.', '5.3 Safety: '),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('C:/Users/CEON/Desktop/project/Software_Requirements_Specification_SRS.docx', buffer);
  fs.writeFileSync('C:/Users/CEON/Desktop/project/docs/Software_Requirements_Specification_SRS.docx', buffer);
  console.log('✅ Generated Software_Requirements_Specification_SRS.docx');
};

// -------------------------------------------------------------
// 2. GENERATE SUMMER INTERNSHIP FINAL REPORT
// -------------------------------------------------------------
const generateReport = async () => {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'ICT ACADEMY OF KERALA',
                bold: true,
                size: 32,
                color: '0369A1',
                font: 'Calibri',
              }),
            ],
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Summer Internship Report\nFull Stack Application Development with ReactJS',
                bold: true,
                size: 26,
                font: 'Calibri',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Project: Smart Doctor Appointment & Clinical Guidance System\nInstitution: Sahrdaya College of Engineering & Technology, Thrissur\nDate: 23.10.2026',
                size: 20,
                color: '64748B',
                font: 'Calibri',
              }),
            ],
            spacing: { after: 350 },
          }),

          createHeading('EXECUTIVE SUMMARY', HeadingLevel.HEADING_1),
          createParagraph('The Smart Doctor Appointment & Clinical Guidance System is a full-stack web application developed as the capstone internship project for the ICT Academy of Kerala (ICTAK). Built using the MERN stack (MongoDB, Express.js, React.js, Node.js), the application streamlines outpatient scheduling, provides an automated clinical symptom triage wizard to guide patients to the appropriate department, prevents double-booking through atomic slot reservations, and provides dedicated portals for Patients, Doctors, and Administrators.'),

          createHeading('INTRODUCTION', HeadingLevel.HEADING_1),
          createParagraph('Healthcare delivery in outpatient clinics is frequently hampered by manual booking workflows, long waiting times, and patient uncertainty regarding which medical specialty to consult. This project bridges this gap by providing an end-to-end digital scheduling platform designed around modern software engineering standards, component-driven UI architecture, and robust RESTful API integration.'),

          createHeading('OBJECTIVES', HeadingLevel.HEADING_1),
          createBullet('Design and implement a multi-tier MERN stack application with clean separation of concerns.', '1. Architectural Mastery: '),
          createBullet('Implement secure user authentication using JWT and bcrypt password hashing with role-based access control.', '2. Security & RBAC: '),
          createBullet('Develop an intelligent triage matrix that classifies symptoms by urgency and matches specialists.', '3. Clinical Guidance: '),
          createBullet('Ensure collision-free 30-minute appointment scheduling.', '4. Atomic Scheduling: '),
          createBullet('Deliver a responsive user interface with Loading, Success, Empty, and Error states across all screens.', '5. UI Engineering: '),

          createHeading('SCOPE AND DELIVERABLES', HeadingLevel.HEADING_1),
          createParagraph('Deliverables include: (1) React 18 single-page application with Vite, (2) Express.js REST API with Mongoose ODM, (3) Automated database seeding script populating departments, symptoms, and doctor profiles, (4) IEEE 830 compliant Software Requirements Specification, and (5) Comprehensive project documentation.'),

          createHeading('METHODOLOGY', HeadingLevel.HEADING_1),
          createParagraph('The project was executed following an Agile/Sprint-based methodology across six sprints: Requirement Analysis, Schema Design, Core Backend & Auth API, React Component Architecture, Portal Integration & Clinical Triage Engine, and End-to-End Testing & Auditing.'),

          createHeading('PROJECT ACTIVITIES', HeadingLevel.HEADING_1),
          createParagraph('Key engineering activities completed during the internship:'),
          createBullet('Designed Mongoose schemas for User, Doctor, Specialization, Symptom, Availability, and Appointment.', 'Database Modeling: '),
          createBullet('Developed modular Express controllers, middleware for JWT verification and error handling.', 'Backend Engineering: '),
          createBullet('Implemented controlled forms, AuthContext, centralized API client, and modal booking dialogs.', 'Frontend Architecture: '),
          createBullet('Implemented the four mandatory UI states (Loading, Success, Empty, Error) for all data views.', 'State Management: '),

          createHeading('RESULTS & FINDINGS', HeadingLevel.HEADING_1),
          createParagraph('All functional features passed rigorous testing. The symptom checker successfully evaluates multi-symptom queries, flags high-urgency conditions, and routes patients to on-duty specialists. The appointment system guarantees slot uniqueness, and completed consultations accurately persist medical notes and prescriptions.'),

          createHeading('CONCLUSION', HeadingLevel.HEADING_1),
          createParagraph('The Smart Doctor Appointment & Clinical Guidance System successfully fulfills all criteria specified in the ICTAK Internship Guidelines. The project demonstrates the practical application of modern full-stack web technologies to solve real-world healthcare challenges.'),

          createHeading('APPENDIX: DEMO CREDENTIALS', HeadingLevel.HEADING_1),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  createCell('Role', true),
                  createCell('Login ID / Username', true),
                  createCell('Password', true),
                  createCell('Description', true),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Patient'),
                  createCell('patient1'),
                  createCell('pat123'),
                  createCell('Patient Ananya Menon (pre-loaded with sample bookings)'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Doctor'),
                  createCell('dr.rajesh'),
                  createCell('doc123'),
                  createCell('Dr. Rajesh Kumar (Cardiology Specialist)'),
                ],
              }),
              new TableRow({
                children: [
                  createCell('Admin'),
                  createCell('admin'),
                  createCell('admin123'),
                  createCell('Hospital Administrator (Full management console)'),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('C:/Users/CEON/Desktop/project/Summer_Internship_Final_Report.docx', buffer);
  fs.writeFileSync('C:/Users/CEON/Desktop/project/docs/Summer_Internship_Final_Report.docx', buffer);
  console.log('✅ Generated Summer_Internship_Final_Report.docx');
};

const run = async () => {
  await generateSRS();
  await generateReport();
  console.log('🎉 All Word documents successfully generated!');
};

run();
