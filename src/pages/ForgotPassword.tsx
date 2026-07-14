import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import './Auth.css';

export function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please check the address and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-bg-decoration"></div>
      
      <div className="auth-card">
        {isSent ? (
          <div style={{ textAlign: 'center' }}>
            <div className="auth-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
              <CheckCircle size={32} />
            </div>
            <h1 className="auth-title font-display">Check your email</h1>
            <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
              We've sent a password reset link to your email address.
            </p>
            <Button onClick={() => setIsSent(false)} style={{ width: '100%', marginBottom: '1rem' }}>
              Resend Email
            </Button>
            <Link to="/login" className="auth-link flex-center" style={{ gap: '0.5rem' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <>
            <div className="auth-header">
              <div className="auth-icon">
                <KeyRound size={32} />
              </div>
              <h1 className="auth-title font-display">Forgot Password</h1>
              <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="john@example.com"
                icon={<Mail size={20} />}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />

              {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginTop: '-0.5rem' }}>{error}</p>}

              <Button type="submit" size="lg" style={{ marginTop: '1rem' }} disabled={isLoading || !email}>
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="auth-footer" style={{ marginTop: '2rem' }}>
              <Link to="/login" className="auth-link flex-center" style={{ gap: '0.5rem' }}>
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
