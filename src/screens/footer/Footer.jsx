import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { QRCodeSVG } from "qrcode.react";
import chartImage from "../../Assets/chart.jpeg";
import "./Footer.css";
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        {}
        <div className="footer-brand">
          <div className="logo-row">
            <div className="logo-icon">
              <img src={chartImage} alt="Cityspace Logo" width="20" height="20" />
            </div>
            <span className="logo-text">Cityspace</span>
          </div>

          <p className="tagline">Discover a brighter Chennai</p>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://wa.me" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X (formerly Twitter)">
              <FaTwitter className="social-icon" aria-hidden="true" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
              <FaYoutube className="social-icon" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="footer-col">
          <h4 className="col-title">Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dining">Dining</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/stores">Stores</Link></li>
            <li><Link to="/activities">Activities</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-col">
          <h4 className="col-title">Support</h4>
          <ul>
            <li><Link to="/help-centre">Help Centre</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/cancellation-refunds">Cancellation & Refunds</Link></li>
            <li><Link to="/safety">Safety</Link></li>
          </ul>
        </div>

        {/* For Partners */}
        <div className="footer-col">
          <h4 className="col-title">For Partners</h4>
          <ul>
            <li><Link to="/list-your-event">List your event</Link></li>
            <li><Link to="/list-your-restaurant">List your Restaurant</Link></li>
            <li><Link to="/add-your-store">Add your store</Link></li>
            <li><Link to="/partner-with-us">Partner with us</Link></li>
          </ul>
        </div>

        {/* Download */}
        <div className="footer-col download-col">
          <h4 className="col-title">Download CitySpace</h4>
          <p className="scan-text">Scan to download</p>
          <div className="download-row">
            <div className="qr-code" aria-label="Google Play Store QR code">
              <QRCodeSVG
                value="https://play.google.com/store/apps"
                size={76}
                bgColor="#ffffff"
                fgColor="#111111"
                level="M"
              />
            </div>
            <div className="store-buttons">
              <a href="https://apps.apple.com" target="_blank" rel="noreferrer">App Store</a>
              <a href="https://play.google.com" target="_blank" rel="noreferrer">Google Play</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="footer-bottom">
        <p>© 2026 City Space. All rights reserved.</p>
        <div className="bottom-links">
          <Link to="/terms">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/privacy">Privacy Policy</Link>
          <span>|</span>
          <Link to="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;