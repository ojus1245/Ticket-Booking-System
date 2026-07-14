import { useParams, useNavigate } from 'react-router-dom';
import { Download, Share2, ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { Button } from '../components/Button';
import { MOCK_EVENTS, MOCK_BOOKINGS } from '../data/mock';
import { format, parseISO } from 'date-fns';
import './TicketPage.css';

// Simple deterministic QR-code-like grid
function QRCode() {
  const pattern = [
    [1,1,1,0,1,1,1],
    [1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1],
    [0,0,0,1,0,0,0],
    [1,0,1,1,1,0,1],
    [1,0,1,0,1,0,1],
    [1,1,1,0,1,1,1],
  ];
  return (
    <div className="ticket-qr">
      <div className="ticket-qr-inner">
        {pattern.flat().map((cell, i) => (
          <div key={i} className="ticket-qr-cell" style={{ background: cell ? '#000' : '#fff' }} />
        ))}
      </div>
    </div>
  );
}

export function TicketPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use first booking for demo, or find by id
  const booking = MOCK_BOOKINGS.find(b => b.id === id) ?? MOCK_BOOKINGS[0];
  const event = MOCK_EVENTS.find(e => e.id === booking.eventId) ?? MOCK_EVENTS[0];

  return (
    <div className="ticket-page container animate-fade-in">
      <div className="ticket-actions">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </Button>
        <Button variant="secondary" onClick={() => window.print()}>
          <Download size={18} /> Download PDF
        </Button>
        <Button variant="ghost">
          <Share2 size={18} /> Share Ticket
        </Button>
      </div>

      <div className="ticket-card">
        {/* Header */}
        <div className="ticket-header">
          <div>
            <div className="ticket-logo">⚡ TixNow</div>
            <div className="ticket-booking-id">Booking ID: {booking.id}</div>
          </div>
          <QRCode />
        </div>

        {/* Body */}
        <div className="ticket-body">
          <h2 className="ticket-event-name">{event.title}</h2>

          <div className="ticket-info-grid">
            <div className="ticket-info-item">
              <label><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} /> Date</label>
              <span>{format(parseISO(event.date), 'EEEE, MMMM do yyyy')}</span>
            </div>
            <div className="ticket-info-item">
              <label><Clock size={12} style={{ display: 'inline', marginRight: 4 }} /> Time</label>
              <span>{event.time}</span>
            </div>
            <div className="ticket-info-item">
              <label><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> Venue</label>
              <span>{event.venue}</span>
            </div>
            <div className="ticket-info-item">
              <label>Location</label>
              <span>{event.location}</span>
            </div>
            <div className="ticket-info-item">
              <label>Passenger</label>
              <span>John Doe</span>
            </div>
            <div className="ticket-info-item">
              <label>Organizer</label>
              <span>{event.organizer}</span>
            </div>
          </div>

          {/* Dashed Divider */}
          <div className="ticket-divider">
            <div className="ticket-divider-circle" />
          </div>

          {/* Seat & Price */}
          <div className="ticket-seat">
            <div>
              <div className="ticket-seat-label">Seats</div>
              <div className="ticket-seat-number">{booking.seats.join(' · ')}</div>
            </div>
            <div>
              <div className="ticket-price-label">Total Paid</div>
              <div className="ticket-price">${booking.total.toFixed(2)}</div>
            </div>
          </div>

          {/* Barcode (decorative) */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '1rem' }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i % 3 === 0 ? '3px' : '1px',
                  height: i % 5 === 0 ? '48px' : '36px',
                  background: 'var(--text-primary)',
                  borderRadius: '1px',
                  opacity: 0.85,
                }}
              />
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.3em', marginBottom: '1.5rem' }}>
            {booking.id}-{event.id.toUpperCase()}-TIX2026
          </p>
        </div>

        {/* Footer */}
        <div className="ticket-footer">
          <strong>Terms & Conditions:</strong> This ticket is non-transferable and non-refundable after 24 hours of purchase.
          Present this ticket (printed or digital) at the venue entrance. Management reserves the right to refuse admission.
          For support, contact us at support@tixnow.com.
        </div>
      </div>
    </div>
  );
}
