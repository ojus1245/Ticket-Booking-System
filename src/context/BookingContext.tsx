import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, runTransaction, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MOCK_EVENTS } from '../data/mock';

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'booked';
  type: 'vip' | 'standard';
  price: number;
}

interface BookingContextType {
  getSeatsForEvent: (eventId: string) => Seat[];
  bookSeats: (eventId: string, seatIds: string[]) => Promise<boolean>;
  isSeatAvailable: (eventId: string, seatId: string) => boolean;
  events: any[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

// Generate initial seats for an event
const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const seats: Seat[] = [];
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    for (let s = 1; s <= 10; s++) {
      const isBooked = Math.random() < 0.2; // 20% initially booked
      const isVip = r < 2; 
      seats.push({
        id: `${row}${s}`,
        row,
        number: s,
        status: isBooked ? 'booked' : 'available',
        type: isVip ? 'vip' : 'standard',
        price: isVip ? 50 : 0
      });
    }
  }
  return seats;
};

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [eventSeats, setEventSeats] = useState<Record<string, Seat[]>>({});
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    // Check if events are seeded, if not, seed them
    const seedAndListen = async () => {
      const eventsSnap = await getDocs(collection(db, 'events'));
      if (eventsSnap.empty) {
        console.log("Seeding initial events to Firestore...");
        const batch = writeBatch(db);
        MOCK_EVENTS.forEach(event => {
          const eventRef = doc(db, 'events', event.id);
          batch.set(eventRef, {
            ...event,
            seats: generateSeats()
          });
        });
        await batch.commit();
      } else {
        try {
          const batch = writeBatch(db);
          batch.update(doc(db, 'events', 'e1'), { image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' });
          batch.update(doc(db, 'events', 'e2'), { image: 'https://images.unsplash.com/photo-1541445976433-f466f228a409?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' });
          await batch.commit();
        } catch (e) {}
      }

      // Listen to all events in real-time
      const unsubscribe = onSnapshot(collection(db, 'events'), (snapshot) => {
        const seatsMap: Record<string, Seat[]> = {};
        const eventsList: any[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          seatsMap[doc.id] = data.seats || [];
          eventsList.push({ id: doc.id, ...data });
        });
        setEventSeats(seatsMap);
        setEvents(eventsList);
      });

      return unsubscribe;
    };

    let unsubscribeFn: (() => void) | undefined;
    seedAndListen().then(unsub => {
      unsubscribeFn = unsub;
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  const getSeatsForEvent = (eventId: string) => {
    return eventSeats[eventId] || [];
  };

  const isSeatAvailable = (eventId: string, seatId: string) => {
    const seats = getSeatsForEvent(eventId);
    const seat = seats.find(s => s.id === seatId);
    return seat ? seat.status === 'available' : false;
  };

  const bookSeats = async (eventId: string, seatIds: string[]): Promise<boolean> => {
    try {
      const eventRef = doc(db, 'events', eventId);
      
      await runTransaction(db, async (transaction) => {
        const eventDoc = await transaction.get(eventRef);
        if (!eventDoc.exists()) {
          throw new Error("Event does not exist!");
        }

        const data = eventDoc.data();
        const seats: Seat[] = data.seats || [];
        
        // Check availability
        for (const seatId of seatIds) {
          const seat = seats.find(s => s.id === seatId);
          if (!seat || seat.status === 'booked') {
            throw new Error(`Seat ${seatId} is already booked.`);
          }
        }

        // Proceed to book
        const updatedSeats = seats.map(seat => 
          seatIds.includes(seat.id) ? { ...seat, status: 'booked' } : seat
        );

        transaction.update(eventRef, { seats: updatedSeats });
      });

      return true;
    } catch (e) {
      console.error("Transaction failed: ", e);
      return false; // Return false to indicate the booking failed (e.g., race condition)
    }
  };

  return (
    <BookingContext.Provider value={{ getSeatsForEvent, bookSeats, isSeatAvailable, events }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
