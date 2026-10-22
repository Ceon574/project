import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const Alert = ({ type = 'info', title, message, onClose }) => {
  const configs = {
    error: {
      bg: '#fef2f2',
      border: '#fca5a5',
      color: '#b91c1c',
      Icon: AlertCircle,
    },
    success: {
      bg: '#ecfdf5',
      border: '#6ee7b7',
      color: '#047857',
      Icon: CheckCircle2,
    },
    warning: {
      bg: '#fffbeb',
      border: '#fcd34d',
      color: '#b45309',
      Icon: AlertTriangle,
    },
    info: {
      bg: '#f0f9ff',
      border: '#7dd3fc',
      color: '#0369a1',
      Icon: Info,
    },
  };

  const { bg, border, color, Icon } = configs[type] || configs.info;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        padding: '0.9rem 1.15rem',
        borderRadius: 'var(--radius-md)',
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color: color,
        marginBottom: '1rem',
      }}
    >
      <Icon size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1, fontSize: '0.875rem' }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{title}</div>}
        <div>{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
          }}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
