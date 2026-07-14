import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Music, Trophy, Mic, Monitor, Tent } from 'lucide-react';
import { Button } from '../components/Button';
import { EventCard } from '../components/EventCard';
import { CATEGORIES } from '../data/mock';
import type { Event } from '../data/mock';
import { useBooking } from '../context/BookingContext';
import './Home.css';

const CategoryIcons: Record<string, React.ReactNode> = {
  'Concert': <Music size={24} />,
  'Sports': <Trophy size={24} />,
  'Theater': <Mic size={24} />,
  'Conference': <Monitor size={24} />,
  'Festival': <Tent size={24} />,
};

export function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { events } = useBooking();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');
    if (query) {
      navigate(`/discover?q=${query}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/discover?category=${category}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg">
          <img 
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Concert crowd" 
            className="hero-bg-img"
          />
          <div className="hero-bg-overlay"></div>
        </div>
        
        <div className="container hero-content animate-fade-in">
          <h1 className="hero-title font-display">
            Experience The <span className="text-gradient">Extraordinary</span>
          </h1>
          <p className="hero-subtitle">
            Discover and book tickets for the best concerts, sports, and theater events worldwide.
          </p>
          
          <form className="search-bar" onSubmit={handleSearch}>
            <input 
              type="text" 
              name="q"
              placeholder="Search for events, artists, or venues..." 
              className="search-input"
            />
            <Button type="submit" className="search-btn">
              <Search size={20} />
            </Button>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title font-display">Browse Categories</h2>
            <p className="section-subtitle">Find exactly what you're looking for</p>
          </div>
        </div>
        
        <div className="categories-grid">
          {CATEGORIES.filter(c => c !== 'All').map((category) => (
            <div 
              key={category} 
              className="category-card"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="category-icon">
                {CategoryIcons[category] || <Music size={24} />}
              </div>
              <span className="category-name">{category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title font-display">Featured Events</h2>
            <p className="section-subtitle">Don't miss out on these upcoming experiences</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/discover')}>
            View All
          </Button>
        </div>
        
        <div className="home-events-grid">
          {events.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="event-card" style={{ minHeight: 320 }}>
                  <div style={{ height: 200, background: 'var(--border-strong)', borderRadius: 'var(--radius-lg)', animation: 'pulse 1.5s ease infinite' }} />
                  <div style={{ padding: '1rem' }}>
                    <div style={{ height: 16, width: '60%', background: 'var(--border-strong)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s ease infinite' }} />
                    <div style={{ height: 12, width: '40%', background: 'var(--border-strong)', borderRadius: 4, animation: 'pulse 1.5s ease infinite' }} />
                  </div>
                </div>
              ))
            : (events as Event[]).slice(0, 4).map(event => (
                <EventCard key={event.id} event={event} />
              ))
          }
        </div>
      </section>
    </div>
  );
}
