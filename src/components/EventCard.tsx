import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Event } from '../data/mock';
import './EventCard.css';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = parseISO(event.date);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <Link to={`/event/${event.id}`} className="event-card">
      <div className="event-card-img-wrapper" style={{ position: 'relative', background: 'var(--bg-tertiary)' }}>
        {!imgLoaded && !imgError && (
          <div className="img-skeleton animate-pulse" style={{ position: 'absolute', inset: 0, background: 'var(--border-strong)' }}></div>
        )}
        {imgError ? (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <ImageIcon size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Image not available</span>
          </div>
        ) : (
          <img 
            src={event.image} 
            alt={event.title} 
            className="event-card-img" 
            loading="lazy" 
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
          />
        )}
        <div className="event-card-date-badge">
          <span className="event-card-date-month">{format(eventDate, 'MMM')}</span>
          <span className="event-card-date-day">{format(eventDate, 'dd')}</span>
        </div>
        <span className="event-card-category">{event.category}</span>
      </div>
      
      <div className="event-card-content">
        <h3 className="event-card-title font-display">{event.title}</h3>
        
        <div className="event-card-info">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        
        <div className="event-card-info">
          <Clock size={16} />
          <span>{event.time}</span>
        </div>
        
        <div className="event-card-footer">
          <span className="event-card-price">${event.price.toFixed(2)}</span>
          <div className="event-card-btn">
            <ArrowRight size={20} className="text-gradient" />
          </div>
        </div>
      </div>
    </Link>
  );
}
