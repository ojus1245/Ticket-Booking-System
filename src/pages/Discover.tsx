import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Frown, ArrowUpDown } from 'lucide-react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { EventCard } from '../components/EventCard';
import { CATEGORIES } from '../data/mock';
import type { Event } from '../data/mock';
import { useBooking } from '../context/BookingContext';
import './Discover.css';

type SortOption = 'price-asc' | 'price-desc' | 'newest' | 'popular';

export function Discover() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const { events } = useBooking();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory === 'All' ? [] : [initialCategory]
  );
  const [priceRange, setPriceRange] = useState<number>(500);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [availableOnly, setAvailableOnly] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    const cat = searchParams.get('category');
    if (cat && cat !== 'All') {
      setSelectedCategories([cat]);
    }
  }, [searchParams]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setPriceRange(500);
    setMinRating(0);
    setSortBy('newest');
    setAvailableOnly(false);
    setSearchParams({});
  };

  const sortEvents = (events: Event[]): Event[] => {
    switch (sortBy) {
      case 'price-asc':  return [...events].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...events].sort((a, b) => b.price - a.price);
      case 'popular':    return [...events].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      case 'newest':
      default:           return [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
  };

  const filteredEvents = sortEvents((events as Event[]).filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(query.toLowerCase()) ||
                          event.location.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const matchesPrice = event.price <= priceRange;
    const matchesRating = !event.rating || event.rating >= minRating;
    const matchesAvailability = !availableOnly || (event.availableSeats ?? 1) > 0;
    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability;
  }));

  return (
    <div className="discover-page container animate-fade-in">
      <div className="discover-header">
        <h1 className="discover-title font-display">Discover Events</h1>
        <div className="discover-search">
          <Input
            type="text"
            placeholder="Search events, artists, or locations..."
            icon={<Search size={20} />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="discover-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '8px' }}>
              <Filter size={20} style={{ color: 'var(--accent-primary)' }} />
              <h2 className="font-display" style={{ fontSize: '1.25rem' }}>Filters</h2>
            </div>
            <button onClick={resetFilters} style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              {CATEGORIES.filter(c => c !== 'All').map(category => (
                <label key={category} className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <h3>Max Price: <strong>${priceRange}</strong></h3>
            <input
              type="range"
              min="0"
              max="500"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>$0</span><span>$500</span>
            </div>
          </div>

          {/* Min Rating */}
          <div className="filter-section">
            <h3>Min Rating: <strong>{minRating > 0 ? `${minRating}★` : 'Any'}</strong></h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {[0, 3, 3.5, 4, 4.5].map(r => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid',
                    cursor: 'pointer',
                    fontWeight: 600,
                    borderColor: minRating === r ? 'var(--accent-primary)' : 'var(--border-strong)',
                    background: minRating === r ? 'var(--accent-primary)' : 'transparent',
                    color: minRating === r ? 'white' : 'var(--text-secondary)',
                    transition: 'all 0.15s'
                  }}
                >
                  {r === 0 ? 'Any' : `${r}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="filter-section">
            <label className="filter-checkbox" style={{ fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
              />
              Available Tickets Only
            </label>
          </div>
        </aside>

        {/* Results */}
        <div className="results-section">
          <div className="results-header">
            <span>{filteredEvents.length} result{filteredEvents.length !== 1 ? 's' : ''} found</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowUpDown size={16} style={{ color: 'var(--text-muted)' }} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid-auto-fit">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Frown size={32} />
              </div>
              <h3>No events found</h3>
              <p>We couldn't find any events matching your current filters. Try adjusting your search or resetting filters.</p>
              <Button variant="secondary" style={{ marginTop: '1rem' }} onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
