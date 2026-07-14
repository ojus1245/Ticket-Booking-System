import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Ticket, Menu, Search, X, LayoutDashboard, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { Button } from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './Navbar.css';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { addToast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/discover', label: 'Events' },
    ...(user ? [{ to: '/dashboard', label: 'My Bookings' }] : []),
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      addToast('Signed out successfully.', 'info');
      navigate('/');
    } catch {
      addToast('Failed to sign out. Please try again.', 'error');
    }
  };

  const userInitial = user?.fullName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <>
      <nav className="navbar">
        <div className="container navbar-content">
          <Link to="/" className="navbar-brand" onClick={() => setMobileOpen(false)}>
            <Ticket size={28} style={{ color: 'var(--accent-primary)' }} />
            <span>Tix<span style={{ color: 'var(--accent-primary)' }}>Now</span></span>
          </Link>

          <div className="navbar-links">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="navbar-actions">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => navigate('/discover')}
            >
              <Search size={20} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Theme"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {user ? (
              /* ── Authenticated: Profile Dropdown ── */
              <div style={{ position: 'relative' }}>
                <button
                  className="avatar"
                  title={user.fullName || user.email}
                  onClick={() => setProfileOpen(p => !p)}
                  aria-label="Open profile menu"
                >
                  {userInitial}
                </button>
                {profileOpen && (
                  <>
                    {/* Backdrop for profile dropdown */}
                    <div
                      style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                      onClick={() => setProfileOpen(false)}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 12px)',
                        right: 0,
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-lg)',
                        minWidth: '220px',
                        zIndex: 20,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease',
                      }}
                    >
                      {/* User info header */}
                      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-light)', background: 'var(--bg-tertiary)' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.fullName || 'User'}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                      </div>

                      {[
                        { to: '/profile',   label: 'My Profile',  icon: <User size={16} /> },
                        { to: '/dashboard', label: 'My Bookings', icon: <Ticket size={16} /> },
                        { to: '/admin',     label: 'Admin Panel', icon: <LayoutDashboard size={16} /> },
                      ].map(item => (
                        <button
                          key={item.to}
                          onClick={(e) => {
                            e.preventDefault();
                            navigate(item.to);
                            setProfileOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 16px',
                            color: 'var(--text-primary)',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            transition: 'background 0.15s',
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-tertiary)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {item.icon} {item.label}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid var(--border-light)', padding: '8px 16px' }}>
                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: 'var(--error)',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%',
                            padding: '4px 0',
                          }}
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* ── Unauthenticated: Login / Sign Up buttons ── */
              <div className="navbar-auth">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  <LogIn size={16} style={{ marginRight: '4px' }} /> Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>Sign Up</Button>
              </div>
            )}

            <button
              className="mobile-menu-btn"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(p => !p)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: 80,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--bg-secondary)',
            zIndex: 150,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            animation: 'fadeIn 0.2s ease',
            overflowY: 'auto',
          }}
        >
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setTimeout(() => setMobileOpen(false), 10)}
              style={{ fontSize: '1.2rem', padding: '0.75rem 0' }}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <>
              <button onClick={(e) => { e.preventDefault(); navigate('/profile'); setMobileOpen(false); }} style={{ fontSize: '1.2rem', padding: '0.75rem 0', color: 'var(--text-primary)', textDecoration: 'none', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Profile</button>
              <button onClick={(e) => { e.preventDefault(); navigate('/admin'); setMobileOpen(false); }} style={{ fontSize: '1.2rem', padding: '0.75rem 0', color: 'var(--text-primary)', textDecoration: 'none', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>Admin</button>
              <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1rem', paddingTop: '1rem' }}>
                <Button variant="ghost" style={{ color: 'var(--error)', width: '100%' }} onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <LogOut size={16} style={{ marginRight: '6px' }} /> Sign Out
                </Button>
              </div>
            </>
          ) : (
            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" onClick={() => { navigate('/login'); setMobileOpen(false); }} style={{ flex: 1 }}>Login</Button>
              <Button onClick={() => { navigate('/register'); setMobileOpen(false); }} style={{ flex: 1 }}>Sign Up</Button>
            </div>
          )}
        </div>
      )}


    </>
  );
}
