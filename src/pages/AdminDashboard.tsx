import { useState } from 'react';
import {
  LayoutDashboard, Users, CalendarDays, Ticket, Settings, TrendingUp,
  Search, Plus, Pencil, Trash2, CheckCircle, XCircle, BarChart2
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MOCK_EVENTS, MOCK_BOOKINGS } from '../data/mock';
import { format, parseISO } from 'date-fns';
import './AdminDashboard.css';

type AdminView = 'overview' | 'events' | 'users' | 'bookings' | 'settings';

const MONTHLY_REVENUE = [42, 58, 45, 70, 65, 89, 95, 78, 110, 98, 125, 140];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MAX_REV = Math.max(...MONTHLY_REVENUE);

const MOCK_USERS = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@email.com', role: 'Customer', bookings: 5, status: 'active', joinDate: '2025-03-12' },
  { id: 'u2', name: 'Bob Smith',     email: 'bob@email.com',   role: 'Customer', bookings: 2, status: 'active', joinDate: '2025-06-20' },
  { id: 'u3', name: 'Carol White',   email: 'carol@email.com', role: 'Admin',    bookings: 0, status: 'active', joinDate: '2024-11-01' },
  { id: 'u4', name: 'David Lee',     email: 'david@email.com', role: 'Customer', bookings: 8, status: 'inactive', joinDate: '2025-01-07' },
];

export function AdminDashboard() {
  const [view, setView] = useState<AdminView>('overview');
  const [eventSearch, setEventSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const totalRevenue = MOCK_BOOKINGS.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.total, 0);

  const navItems: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: 'overview',  label: 'Overview',         icon: <LayoutDashboard size={18} /> },
    { key: 'events',    label: 'Manage Events',    icon: <CalendarDays size={18} /> },
    { key: 'users',     label: 'Manage Users',     icon: <Users size={18} /> },
    { key: 'bookings',  label: 'Bookings',         icon: <Ticket size={18} /> },
    { key: 'settings',  label: 'Settings',         icon: <Settings size={18} /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">⚡ Admin Panel</div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`admin-nav-item ${view === item.key ? 'active' : ''}`}
              onClick={() => setView(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="admin-content animate-fade-in">
        {/* ─── OVERVIEW ─── */}
        {view === 'overview' && (
          <>
            <h1 className="admin-page-title font-display">Dashboard Overview</h1>

            <div className="stats-grid">
              {[
                { label: 'Total Users',      value: MOCK_USERS.length,           icon: <Users size={22} />,        color: '#2563EB', change: '+12%', up: true },
                { label: 'Total Bookings',   value: MOCK_BOOKINGS.length,        icon: <Ticket size={22} />,       color: '#10B981', change: '+8%',  up: true },
                { label: 'Revenue',          value: `$${totalRevenue.toFixed(0)}`,icon: <TrendingUp size={22} />,  color: '#F59E0B', change: '+23%', up: true },
                { label: "Today's Bookings", value: 3,                           icon: <BarChart2 size={22} />,    color: '#8B5CF6', change: '-2%',  up: false },
                { label: 'Active Routes',    value: MOCK_EVENTS.length,          icon: <CalendarDays size={22} />, color: '#EF4444', change: '+1',   up: true },
                { label: 'Pending Refunds',  value: 1,                           icon: <XCircle size={22} />,      color: '#EC4899', change: '-3%',  up: true },
              ].map(stat => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-icon" style={{ background: `${stat.color}18` }}>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                    {stat.up ? '▲' : '▼'} {stat.change} this month
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="chart-container">
              <h3 className="chart-title">Monthly Revenue ($K)</h3>
              <div className="bar-chart">
                {MONTHLY_REVENUE.map((val, i) => (
                  <div key={i} className="bar-group">
                    <div
                      className="bar"
                      style={{ height: `${(val / MAX_REV) * 140}px` }}
                      title={`${MONTHS[i]}: $${val}K`}
                    />
                    <span className="bar-label">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="admin-table-wrapper">
              <div className="admin-table-header">
                <h3 className="font-display" style={{ fontSize: '1rem', fontWeight: 700 }}>Recent Bookings</h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th><th>Event</th><th>Date</th><th>Total</th><th>Status</th><th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BOOKINGS.map(b => {
                    const event = MOCK_EVENTS.find(e => e.id === b.eventId);
                    return (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>{event?.title ?? '—'}</td>
                        <td>{format(parseISO(b.bookingDate), 'MMM d, yyyy')}</td>
                        <td><strong>${b.total.toFixed(2)}</strong></td>
                        <td>
                          <span className={`badge ${b.status === 'upcoming' ? 'badge-info' : b.status === 'past' ? 'badge-success' : 'badge-error'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${b.paymentStatus === 'paid' ? 'badge-success' : b.paymentStatus === 'refunded' ? 'badge-warning' : 'badge-error'}`}>
                            {b.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── EVENTS ─── */}
        {view === 'events' && (
          <>
            <h1 className="admin-page-title font-display">Manage Events</h1>
            <div className="admin-table-wrapper">
              <div className="admin-table-header">
                <Input
                  placeholder="Search events..."
                  icon={<Search size={16} />}
                  value={eventSearch}
                  onChange={e => setEventSearch(e.target.value)}
                />
                <Button size="sm">
                  <Plus size={16} /> Add Event
                </Button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Title</th><th>Category</th><th>Date</th><th>Venue</th><th>Price</th><th>Seats</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_EVENTS.filter(e => e.title.toLowerCase().includes(eventSearch.toLowerCase())).map(event => (
                    <tr key={event.id}>
                      <td><strong>{event.title}</strong></td>
                      <td><span className="badge badge-info">{event.category}</span></td>
                      <td>{format(parseISO(event.date), 'MMM d, yyyy')}</td>
                      <td>{event.venue}</td>
                      <td>${event.price.toFixed(2)}</td>
                      <td>{event.availableTickets}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="action-btn" title="Edit"><Pencil size={14} /></button>
                          <button className="action-btn danger" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── USERS ─── */}
        {view === 'users' && (
          <>
            <h1 className="admin-page-title font-display">Manage Users</h1>
            <div className="admin-table-wrapper">
              <div className="admin-table-header">
                <Input
                  placeholder="Search users..."
                  icon={<Search size={16} />}
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                />
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Bookings</th><th>Join Date</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_USERS.filter(u =>
                    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                    u.email.toLowerCase().includes(userSearch.toLowerCase())
                  ).map(user => (
                    <tr key={user.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                            {user.name[0]}
                          </div>
                          <strong>{user.name}</strong>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${user.role === 'Admin' ? 'badge-warning' : 'badge-info'}`}>{user.role}</span></td>
                      <td>{user.bookings}</td>
                      <td>{format(parseISO(user.joinDate), 'MMM d, yyyy')}</td>
                      <td>
                        <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-error'}`}>{user.status}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button className="action-btn" title="Edit"><Pencil size={14} /></button>
                          <button className="action-btn danger" title="Deactivate"><XCircle size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── BOOKINGS ─── */}
        {view === 'bookings' && (
          <>
            <h1 className="admin-page-title font-display">Booking Management</h1>
            <div className="admin-table-wrapper">
              <div className="admin-table-header">
                <h3 className="font-display" style={{ fontSize: '1rem' }}>All Bookings</h3>
                <Button size="sm" variant="secondary">Export CSV</Button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th><th>Event</th><th>Date</th><th>Seats</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_BOOKINGS.map(b => {
                    const event = MOCK_EVENTS.find(e => e.id === b.eventId);
                    return (
                      <tr key={b.id}>
                        <td><strong>{b.id}</strong></td>
                        <td>{event?.title ?? '—'}</td>
                        <td>{format(parseISO(b.bookingDate), 'MMM d, yyyy')}</td>
                        <td>{b.seats.join(', ')}</td>
                        <td><strong>${b.total.toFixed(2)}</strong></td>
                        <td><span className={`badge ${b.status === 'upcoming' ? 'badge-info' : b.status === 'past' ? 'badge-success' : 'badge-error'}`}>{b.status}</span></td>
                        <td><span className={`badge ${b.paymentStatus === 'paid' ? 'badge-success' : b.paymentStatus === 'refunded' ? 'badge-warning' : 'badge-error'}`}>{b.paymentStatus}</span></td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button className="action-btn" title="Approve"><CheckCircle size={14} /></button>
                            <button className="action-btn danger" title="Cancel"><XCircle size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ─── SETTINGS ─── */}
        {view === 'settings' && (
          <>
            <h1 className="admin-page-title font-display">Settings</h1>
            {[
              { label: 'Company Name', placeholder: 'TixNow Inc.' },
              { label: 'Support Email', placeholder: 'support@tixnow.com', type: 'email' },
              { label: 'Booking Fee (%)', placeholder: '10', type: 'number' },
              { label: 'Currency', placeholder: 'USD' },
            ].map(field => (
              <div key={field.label} style={{ maxWidth: '600px', marginBottom: '1rem' }}>
                <Input label={field.label} placeholder={field.placeholder} type={field.type as any} />
              </div>
            ))}
            <Button style={{ marginTop: '1rem' }}>Save Settings</Button>
          </>
        )}
      </main>
    </div>
  );
}
