import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Button } from '../components/Button';
import { useBooking } from '../context/BookingContext';
import { type Event } from '../data/mock';
import './SeatSelection.css';

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

export function SeatSelection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSeatsForEvent, events } = useBooking();
  
  const event = (events as Event[]).find(e => e.id === id);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  
  if (!event) return <div className="container" style={{ padding: '4rem 0' }}>Event not found</div>;

  const currentSeats = getSeatsForEvent(event.id);

  const toggleSeat = (seatId: string, status: string) => {
    if (status === 'booked') return;
    
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(s => s !== seatId)
        : [...prev, seatId]
    );
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach(seatId => {
      const seat = currentSeats.find(s => s.id === seatId);
      if (seat) {
        total += event.price + seat.price;
      }
    });
    return total;
  };

  return (
    <div className="seat-selection-page container animate-fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title font-display">Select Your Seats</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{event.title} • {event.venue}</p>
      </div>

      <div className="seat-selection-layout">
        <div className="seat-map-container">
          <div className="screen-indicator">Stage / Screen</div>
          
          <div className="seat-grid">
            {rows.map(row => (
              <div key={row} className="seat-row">
                <div className="row-label">{row}</div>
                {currentSeats.filter(s => s.row === row).map(seat => {
                  const isSelected = selectedSeats.includes(seat.id);
                  const isBooked = seat.status === 'booked';
                  return (
                    <button
                      key={seat.id}
                      className={`seat-btn ${seat.status} ${seat.type} ${isSelected ? 'selected' : ''}`}
                      disabled={isBooked}
                      onClick={() => toggleSeat(seat.id, seat.status)}
                      title={isBooked ? 'Already Booked' : `${seat.id} - $${(event.price + seat.price).toFixed(2)}`}
                    >
                      {/* Optional: Add small text for seat number if needed */}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item"><div className="legend-color available"></div> Available</div>
            <div className="legend-item"><div className="legend-color selected"></div> Selected</div>
            <div className="legend-item"><div className="legend-color vip"></div> VIP Premium</div>
            <div className="legend-item"><div className="legend-color booked"></div> Booked</div>
          </div>
        </div>

        <aside>
          <div className="order-summary" style={{ position: 'sticky', top: '100px' }}>
            <h3 className="font-display">Booking Summary</h3>
            
            <div className="summary-row">
              <span>Event</span>
              <span style={{ textAlign: 'right', fontWeight: 500, color: 'var(--text-primary)' }}>{event.title}</span>
            </div>

            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Selected Seats ({selectedSeats.length})
              </div>
              {selectedSeats.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedSeats.map(id => (
                    <span key={id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-strong)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', fontWeight: 600 }}>
                      {id}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.875rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>No seats selected</p>
              )}
            </div>
            
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            <Button 
              size="lg" 
              style={{ width: '100%', marginTop: '1.5rem' }}
              disabled={selectedSeats.length === 0}
              onClick={() => navigate(`/checkout/${event.id}?seats=${selectedSeats.join(',')}`)}
            >
              Continue to Details
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
