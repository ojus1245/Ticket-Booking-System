import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      className="animate-fade-in"
      style={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          fontSize: '9rem',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-highlight))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: '1rem',
          userSelect: 'none',
        }}
      >
        404
      </div>
      <h1
        className="font-display"
        style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}
      >
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 400, marginBottom: '2.5rem', lineHeight: 1.7 }}>
        Looks like this ticket has expired! The page you're looking for doesn't exist
        or has been moved to a new location.
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    </div>
  );
}
