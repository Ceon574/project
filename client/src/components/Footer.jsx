import React from 'react';
import { HeartPulse, ShieldCheck, PhoneCall, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        padding: '3rem 1.5rem 1.5rem',
        marginTop: 'auto',
        borderTop: '1px solid #1e293b',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Brand Col */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              color: 'white',
              fontWeight: 800,
              fontSize: '1.25rem',
              marginBottom: '0.85rem',
            }}
          >
            <HeartPulse size={24} style={{ color: '#38bdf8' }} />
            <span>SmartDoctor+ Clinical System</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>
            A full-stack healthcare scheduling and clinical symptom triage system built for the
            ICT Academy of Kerala Full Stack Application Development Internship Capstone.
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.75rem',
              background: '#1e293b',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              color: '#38bdf8',
            }}
          >
            <ShieldCheck size={16} /> MERN Stack Certified Architecture
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Medical & Triage Disclaimer
          </h4>
          <p style={{ fontSize: '0.8rem', lineHeight: 1.6 }}>
            The symptom checker and health guidance features provided in this web application are
            designed strictly for educational and preliminary appointment scheduling guidance. They
            do not constitute medical diagnosis or emergency care. In life-threatening emergencies,
            please immediately contact your regional ambulance emergency hotline.
          </p>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem' }}>
            Clinical Facility Contacts
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} style={{ color: '#38bdf8' }} />
              <span>ICTAK Apex Healthcare Complex, Kerala, India</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PhoneCall size={16} style={{ color: '#38bdf8' }} />
              <span>Emergency Hotline: +91 (0484) 299-1000</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '1.5rem',
          borderTop: '1px solid #1e293b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.75rem',
        }}
      >
        <div>© 2026 SmartDoctor+. ICT Academy of Kerala Full Stack React Internship.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>MongoDB</span>
          <span>•</span>
          <span>Express.js</span>
          <span>•</span>
          <span>React.js</span>
          <span>•</span>
          <span>Node.js</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
