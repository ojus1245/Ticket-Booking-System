import { useState } from 'react';
import { User, Bell, Heart, Lock, Camera, MapPin } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MOCK_EVENTS, MOCK_BOOKINGS } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import './UserProfile.css';

type ProfileTab = 'profile' | 'notifications' | 'favorites' | 'security';

const NOTIFICATIONS = [
  { id: 1, title: 'Booking Confirmed — Neon Nights', time: '2 hours ago', unread: true, type: 'success' },
  { id: 2, title: 'Payment successful for BK001', time: '2 hours ago', unread: true, type: 'success' },
  { id: 3, title: 'Special offer: 20% off this weekend!', time: '1 day ago', unread: false, type: 'promo' },
  { id: 4, title: 'Reminder: Symphony Under the Stars in 3 days', time: '2 days ago', unread: false, type: 'reminder' },
  { id: 5, title: 'Your review for Hamlet was approved', time: '1 week ago', unread: false, type: 'info' },
];

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const { user } = useAuth();

  const favoriteEvents = MOCK_EVENTS.slice(0, 3);
  const totalBookings = MOCK_BOOKINGS.length;

  return (
    <div className="profile-page container animate-fade-in">
      <h1 className="font-display" style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '2rem' }}>My Profile</h1>

      <div className="profile-layout">
        {/* Sidebar */}
        <div className="profile-sidebar-card">
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
            <div className="profile-avatar">J</div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-primary)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <Camera size={14} />
            </button>
          </div>
          <div className="profile-name">{user?.fullName || 'User'}</div>
          <div className="profile-email">{user?.email || 'email@example.com'}</div>
          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-value">{totalBookings}</div>
              <div className="profile-stat-label">Bookings</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">{favoriteEvents.length}</div>
              <div className="profile-stat-label">Favorites</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-value">2</div>
              <div className="profile-stat-label">Reviews</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <div className="profile-tabs">
            {([
              { key: 'profile',       label: 'Edit Profile',     icon: <User size={16} /> },
              { key: 'notifications', label: 'Notifications',    icon: <Bell size={16} /> },
              { key: 'favorites',     label: 'Favorites',        icon: <Heart size={16} /> },
              { key: 'security',      label: 'Security',         icon: <Lock size={16} /> },
            ] as { key: ProfileTab; label: string; icon: React.ReactNode }[]).map(t => (
              <button
                key={t.key}
                className={`profile-tab ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* ─── EDIT PROFILE ─── */}
          {activeTab === 'profile' && (
            <div className="card animate-fade-in">
              <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <Input label="Full Name" defaultValue={user?.fullName || ''} />
                <Input label="Phone" type="tel" defaultValue={user?.phone || ''} />
              </div>
              <Input label="Email Address" type="email" defaultValue={user?.email || ''} readOnly />
              <Input label="Location" defaultValue="New York, NY" icon={<MapPin size={18} />} />

              <div className="toggle-row" style={{ marginTop: '1.5rem' }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Switch between light and dark themes</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={darkMode} onChange={e => {
                    setDarkMode(e.target.checked);
                    document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
                  }} />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <Button style={{ marginTop: '1.5rem' }}>Save Changes</Button>
            </div>
          )}

          {/* ─── NOTIFICATIONS ─── */}
          {activeTab === 'notifications' && (
            <div className="animate-fade-in">
              <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Notification Preferences</h3>
                {[
                  { label: 'Email Notifications', desc: 'Booking confirmations and updates', val: emailNotifs, set: setEmailNotifs },
                  { label: 'SMS Notifications',   desc: 'Text alerts for upcoming events',  val: smsNotifs,  set: setSmsNotifs },
                ].map(item => (
                  <div key={item.label} className="toggle-row">
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Notifications</h3>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                    {n.unread && <div className="notification-dot" />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: n.unread ? 600 : 400, color: 'var(--text-primary)', marginBottom: '2px' }}>{n.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── FAVORITES ─── */}
          {activeTab === 'favorites' && (
            <div className="animate-fade-in">
              <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Saved Events</h3>
              <div className="saved-routes-grid">
                {favoriteEvents.map(event => (
                  <div key={event.id} className="saved-route-card">
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}
                    />
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px' }}>{event.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <MapPin size={12} /> {event.location}
                    </div>
                    <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>${event.price}</span>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)' }}>
                        <Heart size={18} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {favoriteEvents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state-icon"><Heart size={32} /></div>
                  <h3>No favorites yet</h3>
                  <p>Tap the heart on any event to save it here.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── SECURITY ─── */}
          {activeTab === 'security' && (
            <div className="card animate-fade-in">
              <h3 className="font-display" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Change Password</h3>
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              <Button style={{ marginTop: '1rem' }}>Update Password</Button>

              <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--error)' }}>Danger Zone</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="ghost" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}>
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
