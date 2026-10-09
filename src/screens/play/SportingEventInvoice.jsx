import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./SportingEventInvoice.css";

const INDIAN_STATES = [
  "Tamil Nadu",
  "Karnataka",
  "Kerala",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Goa",
  "Gujarat",
  "Rajasthan",
  "West Bengal",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Bihar",
  "Odisha",
  "Assam",
];

export default function SportingEventInvoice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const event = location.state?.event || {
    id: id || "se1",
    title: "Chennai Fitness Run 2026",
    date: "Sun, 15 Nov | 5 AM | Chennai",
  };

  const selectedTickets = location.state?.selectedTickets || [
    {
      id: "5k-fitness-run",
      name: "5K Fitness Run",
      price: 599,
      quantity: 1,
      subtotal: 599,
    },
  ];

  const totalPrice = location.state?.totalPrice || 599;
  const totalTickets = location.state?.totalTickets || 1;

  // Form states initialized to empty so placeholders are visible until user types
  const [name, setName] = useState("");
  const [countryCode] = useState("91");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState({});

  // Countdown timer: 09:55
  const [secondsLeft, setSecondsLeft] = useState(595);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // Form validation to ensure all fields are filled before proceeding
  const handleConfirm = () => {
    const err = {};
    if (!name.trim()) err.name = "Name / User identifier is required";
    if (!phone.trim()) {
      err.phone = "Phone number is required";
    } else if (phone.trim().replace(/\D/g, "").length < 10) {
      err.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      err.email = "Please enter a valid email address";
    }

    if (!state) {
      err.state = "Please select your state to generate invoice";
    }

    if (Object.keys(err).length > 0) {
      setErrors(err);
      return;
    }

    setErrors({});

    // Build booking payload for Payment Page
    const ticketSummaryStr = selectedTickets
      .map((t) => `${t.quantity} × ${t.name}`)
      .join(", ");

    const taxesAndFees = Math.round(totalPrice * 0.05); // 5% GST/convenience
    const finalTotal = totalPrice + taxesAndFees;

    const bookingPayload = {
      experience: {
        id: event.id || "se1",
        title: event.title,
        name: event.title,
        date: event.date || "Sun, 15 Nov, 5:00 AM",
        time: "5:00 AM",
        location: event.venueName || event.location || "Olcott Memorial Higher Secondary School, Chennai",
        image: event.bannerImage || event.image || "/chennai-fitness-run-banner.png",
        category: "Sporting Event",
      },
      guests: {
        adult: totalTickets,
        child: 0,
        infant: 0,
      },
      guestSummary: `${totalTickets} ${totalTickets === 1 ? "Ticket" : "Tickets"} (${ticketSummaryStr})`,
      priceDetails: {
        items: selectedTickets.map((t) => ({
          label: `${t.quantity} × ${t.name}`,
          amount: t.subtotal,
        })),
        subtotal: totalPrice,
        taxesAndFees,
        total: finalTotal,
      },
      contact: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        state,
      },
    };

    // Navigate to payment page with booking state
    navigate("/payment", {
      state: {
        booking: bookingPayload,
        experience: bookingPayload.experience,
        totalPrice: finalTotal,
        guestSummary: bookingPayload.guestSummary,
      },
    });
  };

  return (
    <div className="invoice-root">
      {/* Top Header Row with Back button & Event Title */}
      <header className="invoice-header">
        <button
          type="button"
          className="invoice-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="22" height="22">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>

        <div className="invoice-header-info">
          <h1 className="invoice-event-title">{event.title}</h1>
          <p className="invoice-event-subtitle">{event.date || "Sun, 15 Nov | 5 AM | Chennai"}</p>
        </div>
      </header>

      {/* Main Dark Form Container */}
      <main className="invoice-main">
        <div className="invoice-form-card">
          {/* Green Countdown Badge */}
          <div className="invoice-timer-pill">
            <span>Complete your booking in </span>
            <strong className="timer-digits">{formatTimer()} mins</strong>
          </div>

          {/* Section Divider: INVOICE DETAILS */}
          <div className="invoice-divider-row">
            <span className="divider-line" />
            <span className="divider-text">INVOICE DETAILS</span>
            <span className="divider-line" />
          </div>

          {/* Form Fields */}
          <form className="invoice-form" onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
            {/* Field 1: User identifier / Name */}
            <div className="invoice-field-wrap">
              <input
                type="text"
                className={`invoice-input ${errors.name ? "has-error" : ""}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name or user identifier"
              />
              {errors.name && <span className="field-error-msg">{errors.name}</span>}
            </div>

            {/* Field 2: Mobile Number with India Flag & Country Code */}
            <div className="invoice-field-wrap">
              <div className="phone-input-combo">
                <div className="country-code-box">
                  <span className="country-prefix-text">IN</span>
                  <span className="country-code-digits">91</span>
                </div>
                <input
                  type="tel"
                  className={`invoice-input phone-number-field ${errors.phone ? "has-error" : ""}`}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile number"
                  maxLength={10}
                />
              </div>
              <div className="field-helper-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>The phone number associated with your account cannot be modified</span>
              </div>
              {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
            </div>

            {/* Field 3: Email ID */}
            <div className="invoice-field-wrap">
              <input
                type="email"
                className={`invoice-input ${errors.email ? "has-error" : ""}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
              />
              <div className="field-helper-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Email ID is required to send tickets and updates</span>
              </div>
              {errors.email && <span className="field-error-msg">{errors.email}</span>}
            </div>

            {/* Field 4: State Selector Dropdown */}
            <div className="invoice-field-wrap">
              <div className="state-select-wrap">
                <select
                  className={`invoice-select ${errors.state ? "has-error" : ""}`}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                <div className="state-select-arrow">⌄</div>
              </div>
              <div className="field-helper-info">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>State is required to generate your invoice</span>
              </div>
              {errors.state && <span className="field-error-msg">{errors.state}</span>}
            </div>
          </form>
        </div>
      </main>

      {/* Bottom Sticky Action Bar with Confirm button */}
      <footer className="invoice-bottom-bar">
        <button
          type="button"
          className="invoice-confirm-btn"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </footer>
    </div>
  );
}
