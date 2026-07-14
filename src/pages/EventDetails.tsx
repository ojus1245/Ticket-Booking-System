import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Info, Ticket, Minus, Plus } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { type Event } from '../data/mock';
import './EventDetails.css';

export function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events } = useBooking();
  const [ticketCount, setTicketCount] = useState(1);

  const event = (events as Event[]).find(e => e.id === id);

  if (!event) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 className="font-display">Event not found</h2>
        <Button onClick={() => navigate('/discover')} style={{ marginTop: '1rem' }}>
          Back to Discover
        </Button>
      </div>
    );
  }

  const eventDate = parseISO(event.date);
  const total = event.price * ticketCount;

  const handleCheckout = () => {
    navigate(`/seat-selection/${event.id}`);
  };

  return (
    <div className="event-details-page animate-fade-in">
      <div className="event-hero">
        <img src={event.image} alt={event.title} className="event-hero-img" />
        <div className="event-hero-overlay"></div>
      </div>

      <div className="container event-content-container">
        <div className="event-main-card">
          
          <div className="event-info-section">
            <div>
              <span className="event-card-category" style={{ position: 'static', display: 'inline-block', marginBottom: '1rem' }}>
                {event.category}
              </span>
              <h1 className="event-title font-display">{event.title}</h1>
              <p className="event-organizer">Presented by {event.organizer}</p>
            </div>

            <div className="event-meta-grid">
              <div className="event-meta-item">
                <Calendar className="event-meta-icon" size={24} />
                <div className="event-meta-content">
                  <h4>Date</h4>
                  <p>{format(eventDate, 'EEEE, MMMM do, yyyy')}</p>
                </div>
              </div>
              
              <div className="event-meta-item">
                <Clock className="event-meta-icon" size={24} />
                <div className="event-meta-content">
                  <h4>Time</h4>
                  <p>{event.time} onwards</p>
                </div>
              </div>

              <div className="event-meta-item">
                <MapPin className="event-meta-icon" size={24} />
                <div className="event-meta-content">
                  <h4>Location</h4>
                  <p>{event.venue}, {event.location}</p>
                </div>
              </div>
            </div>

            <div className="event-description">
              <h3 className="font-display flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
                <Info className="text-gradient" size={24} />
                About this event
              </h3>
              <p>{event.description}</p>
            </div>
          </div>

          <aside className="event-booking-sidebar">
            <div className="booking-price-container">
              <span className="booking-price-label">Price per ticket</span>
              <span className="booking-price">${event.price.toFixed(2)}</span>
            </div>

            <div>
              <span className="booking-price-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Select Quantity</span>
              <div className="ticket-selector">
                <button 
                  className="ticket-qty-btn" 
                  onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                  disabled={ticketCount <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="ticket-qty">{ticketCount}</span>
                <button 
                  className="ticket-qty-btn" 
                  onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                  disabled={ticketCount >= 10}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="booking-summary">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button size="lg" style={{ width: '100%' }} onClick={handleCheckout}>
              <Ticket size={20} />
              Book Now
            </Button>
            
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {event.availableTickets} tickets remaining
            </p>
          </aside>

        </div>
      </div>
    </div>
  );
}
