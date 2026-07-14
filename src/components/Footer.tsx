import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-logo">
              <Ticket className="text-gradient" size={28} />
              <span>Tix<span className="text-gradient">Now</span></span>
            </div>
            <p>Your premium destination for discovering and booking the best events, concerts, and experiences worldwide.</p>
          </div>
          
          <div className="footer-col">
            <h4>Explore</h4>
            <ul className="footer-links">
              <li><Link to="/discover?category=Concert">Concerts</Link></li>
              <li><Link to="/discover?category=Sports">Sports</Link></li>
              <li><Link to="/discover?category=Theater">Theater</Link></li>
              <li><Link to="/discover?category=Festival">Festivals</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link to="#">About Us</Link></li>
              <li><Link to="#">Careers</Link></li>
              <li><Link to="#">Press</Link></li>
              <li><Link to="#">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><Link to="#">Terms of Service</Link></li>
              <li><Link to="#">Privacy Policy</Link></li>
              <li><Link to="#">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} TixNow. All rights reserved.</p>
          <div className="social-links">
            {/* Social icons can go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
