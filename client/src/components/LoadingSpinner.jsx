import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading healthcare records...' }) => {
  return (
    <div className="state-box" style={{ minHeight: '260px' }}>
      <Loader2
        size={36}
        className="animate-spin"
        style={{ color: 'var(--primary)', marginBottom: '1rem' }}
      />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;
