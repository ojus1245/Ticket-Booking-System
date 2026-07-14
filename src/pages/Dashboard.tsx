import { useState, useEffect } from 'react';
import { Calendar, MapPin, Download } from 'lucide-react';
import { Button } from '../components/Button';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import './Dashboard.css';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const tickets: any[] = [];
        
        for (const bookingDoc of querySnapshot.docs) {
          const bookingData = bookingDoc.data();
          // Fetch event details
          const eventRef = doc(db, 'events', bookingData.eventId);
          const eventSnap = await getDoc(eventRef);
          
          if (eventSnap.exists()) {
            const eventData = eventSnap.data();
            tickets.push({
              id: bookingDoc.id,
              ...eventData,
              ticketQty: bookingData.seats.length,
              orderId: bookingDoc.id.substring(0, 8).toUpperCase(),
              // Simplistic logic for upcoming/past based on current date
              status: new Date(eventData.date) > new Date() ? 'upcoming' : 'past'
            });
          }
        }
        setMyTickets(tickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTickets();
  }, [user]);

  const filteredTickets = myTickets.filter(t => t.status === activeTab);

  return (
    <div className="dashboard-page container animate-fade-in">
      <div className="dashboard-header">
        <div className="user-profile">
          <div className="profile-avatar">{user?.fullName?.charAt(0) || 'U'}</div>
          <div className="profile-info">
            <h1 className="font-display">{user?.fullName || 'User'}</h1>
            <p>{user?.email || ''}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => navigate('/profile')}>Edit Profile</Button>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events
        </button>
      </div>

      <div>
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your tickets...</div>
        ) : filteredTickets.length > 0 ? (
          filteredTickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <img src={ticket.image} alt={ticket.title} className="ticket-img" />
              
              <div className="ticket-content">
                <div className="ticket-header">
                  <h2 className="ticket-title font-display">{ticket.title}</h2>
                  <span className={`ticket-status ${ticket.status}`}>
                    {ticket.status === 'upcoming' ? 'Valid' : 'Expired'}
                  </span>
                </div>

                <div className="ticket-details">
                  <div className="ticket-detail-item">
                    <span className="ticket-detail-label">Date & Time</span>
                    <span className="ticket-detail-value">
                      <Calendar size={14} className="text-muted" />
                      {format(parseISO(ticket.date), 'MMM do, yyyy')} • {ticket.time}
                    </span>
                  </div>
                  
                  <div className="ticket-detail-item">
                    <span className="ticket-detail-label">Location</span>
                    <span className="ticket-detail-value">
                      <MapPin size={14} className="text-muted" />
                      {ticket.venue}
                    </span>
                  </div>

                  <div className="ticket-detail-item">
                    <span className="ticket-detail-label">Order ID</span>
                    <span className="ticket-detail-value">{ticket.orderId}</span>
                  </div>

                  <div className="ticket-detail-item">
                    <span className="ticket-detail-label">Tickets</span>
                    <span className="ticket-detail-value">{ticket.ticketQty}x General Admission</span>
                  </div>
                </div>

                <div className="ticket-actions">
                  <Button variant="ghost" size="sm">
                    <Download size={16} style={{ marginRight: '0.5rem' }} />
                    Download PDF
                  </Button>
                  
                  {ticket.status === 'upcoming' && (
                    <div className="ticket-qr" title="Ticket QR Code">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className={`qr-dot ${Math.random() > 0.5 ? 'active' : ''}`} style={{ opacity: Math.random() > 0.3 ? 1 : 0 }}></div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state" style={{ padding: '4rem 2rem' }}>
            <Calendar size={48} className="text-muted" style={{ marginBottom: '1rem' }} />
            <h3>No {activeTab} tickets</h3>
            <p style={{ marginBottom: '1.5rem' }}>You don't have any {activeTab} events at the moment.</p>
            {activeTab === 'upcoming' && (
              <Button onClick={() => window.location.href = '/discover'}>Browse Events</Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
