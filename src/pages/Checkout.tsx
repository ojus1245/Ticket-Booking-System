import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Wallet, Calendar, CheckCircle, ShieldCheck, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useBooking } from '../context/BookingContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { type Event } from '../data/mock';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format, parseISO } from 'date-fns';
import './Checkout.css';

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  phone: z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  age: z.coerce.number().min(1, 'Age must be at least 1').max(120, 'Invalid age'),
  gender: z.enum(['male', 'female', 'other'], { errorMap: () => ({ message: 'Please select a gender' }) }),
  emergencyContact: z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
  specialRequests: z.string().optional(),
  
  // Payment fields - conditionally required based on payment method later if needed, 
  // but for simplicity we'll validate if present or we can refine.
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvc: z.string().optional()
}).superRefine((data, ctx) => {
  // We can't cleanly access paymentMethod from outside, but we can do basic checks 
  // if card is selected (handled via form logic).
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export function Checkout() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const { bookSeats, events } = useBooking();
  const { addToast } = useToast();
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange'
  });

  const event = (events as Event[]).find(e => e.id === id);
  if (!event) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Event not found</div>;
  }

  const seatsParams = searchParams.get('seats');
  const selectedSeats = seatsParams ? seatsParams.split(',') : [];
  const qty = selectedSeats.length > 0 ? selectedSeats.length : parseInt(searchParams.get('qty') || '1', 10);
  
  const subtotal = selectedSeats.reduce((acc, seatId) => {
    const isVip = seatId.startsWith('A') || seatId.startsWith('B');
    return acc + event.price + (isVip ? 50 : 0);
  }, 0) || (event.price * qty);

  const fees = subtotal * 0.1; // 10% booking fee
  const total = subtotal + fees;

  const onSubmit = async (data: CheckoutForm) => {
    if (paymentMethod === 'card') {
      if (!data.cardName || !data.cardNumber || !data.expiry || !data.cvc) {
        setCheckoutError('Please fill in all card details');
        return;
      }
    }

    setIsProcessing(true);
    setCheckoutError('');
    try {
      // Execute booking request to mock backend
      const success = await bookSeats(event.id, selectedSeats);
      
      if (!success) {
        setCheckoutError('Sorry, one or more of your selected seats were just booked by another user. Please go back and select different seats.');
        return;
      }
      
      // Save booking to Firestore
      await addDoc(collection(db, 'bookings'), {
        userId: user?.uid || 'guest',
        eventId: event.id,
        eventTitle: event.title,
        seats: selectedSeats,
        totalAmount: total,
        passengerDetails: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          age: data.age,
          gender: data.gender
        },
        paymentMethod,
        createdAt: new Date().toISOString()
      });

      console.log('Checkout data:', data, 'Payment:', paymentMethod);
      setIsSuccess(true);
      addToast(`Booking confirmed for ${event.title}!`, 'success');
    } catch (err) {
      console.error(err);
      setCheckoutError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="container success-container animate-fade-in">
        <div className="success-icon">
          <CheckCircle size={48} />
        </div>
        <h1 className="success-title font-display">Booking Confirmed!</h1>
        <p className="success-text">
          Thank you for your purchase. Your tickets for <strong>{event.title}</strong> have been sent to your email.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => navigate('/ticket/123')}>Print Ticket</Button>
          <Button onClick={() => navigate('/dashboard')}>View My Tickets</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container animate-fade-in">
      <div className="checkout-header">
        <h1 className="checkout-title font-display">Checkout</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Complete your purchase securely</p>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-container">
          {checkoutError && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem' }}>{checkoutError}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="checkout-step-title">
                <span className="step-number">1</span> Passenger Details
              </h2>
              <div className="form-grid">
                <Input label="Full Name" placeholder="John Doe" error={errors.fullName?.message} {...register('fullName')} />
                <Input label="Email Address" type="email" placeholder="john@example.com" error={errors.email?.message} {...register('email')} />
              </div>
              <div className="form-grid">
                <Input label="Phone Number" type="tel" placeholder="1234567890" error={errors.phone?.message} {...register('phone')} />
                <Input label="Age" type="number" placeholder="25" min="1" error={errors.age?.message} {...register('age')} />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Gender</label>
                  <select className={`input-field ${errors.gender ? 'input-error' : ''}`} style={{ backgroundColor: 'var(--bg-tertiary)' }} {...register('gender')}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <span className="error-message">{errors.gender.message}</span>}
                </div>
                <Input label="Emergency Contact" type="tel" placeholder="0987654321" error={errors.emergencyContact?.message} {...register('emergencyContact')} />
              </div>
              <div className="input-group" style={{ marginTop: '1rem' }}>
                <label className="input-label">Special Requests (Optional)</label>
                <textarea className="input-field" placeholder="Any dietary requirements or accessibility needs..." rows={3} style={{ resize: 'vertical' }} {...register('specialRequests')}></textarea>
              </div>
            </div>

            <div>
              <h2 className="checkout-step-title">
                <span className="step-number">2</span> Payment Details
              </h2>
              
              <div className="payment-methods">
                <div 
                  className={`payment-method-card ${paymentMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={24} />
                  <span>Credit Card</span>
                </div>
                <div 
                  className={`payment-method-card ${paymentMethod === 'paypal' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <Wallet size={24} />
                  <span>PayPal</span>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="animate-fade-in">
                  <Input label="Cardholder Name" placeholder="JOHN DOE" error={errors.cardName?.message} {...register('cardName')} />
                  <Input label="Card Number" placeholder="0000 0000 0000 0000" maxLength={19} error={errors.cardNumber?.message} {...register('cardNumber')} />
                  <div className="form-grid">
                    <Input label="Expiry Date" placeholder="MM/YY" maxLength={5} error={errors.expiry?.message} {...register('expiry')} />
                    <Input label="CVC" placeholder="123" maxLength={4} error={errors.cvc?.message} {...register('cvc')} />
                  </div>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              size="lg" 
              style={{ width: '100%', marginTop: '2rem' }}
              disabled={isProcessing || !isValid}
            >
              {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
            </Button>
            
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} /> Secure encrypted checkout
            </p>
          </form>
        </div>

        <aside>
          <div className="order-summary">
            <h3 className="font-display">Order Summary</h3>
            
            <div className="summary-event">
              <img src={event.image} alt={event.title} className="summary-img" />
              <div className="summary-details">
                <h4>{event.title}</h4>
                <p><Calendar size={14} /> {format(parseISO(event.date), 'MMM do, yyyy')}</p>
                <p><MapPin size={14} /> {event.venue}</p>
              </div>
            </div>

            <div className="summary-row">
              <span>Seats</span>
              <span style={{ textAlign: 'right' }}>
                {selectedSeats.length > 0 ? selectedSeats.join(', ') : `${qty}x General Admission`}
              </span>
            </div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Booking Fee (10%)</span>
              <span>${fees.toFixed(2)}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
