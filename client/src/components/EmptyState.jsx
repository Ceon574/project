import React from 'react';
import { CalendarX, AlertCircle } from 'lucide-react';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No records found',
  description = 'There are no active records matching your request at this time.',
  actionText,
  onAction,
}) => {
  return (
    <div className="state-box">
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        <Icon size={28} />
      </div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem' }}>
        {title}
      </h3>
      <p
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          maxWidth: '400px',
          marginBottom: actionText ? '1.25rem' : '0',
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
