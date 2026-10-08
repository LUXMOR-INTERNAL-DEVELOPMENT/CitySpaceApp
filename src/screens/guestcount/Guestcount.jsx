import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingSteps from "../booking/BookingSteps";
import "./GuestCount.css";

const QUICK_OPTIONS = [1, 2, 4, 6, 8, 10, 12];

export default function Guestcount() {
  const location  = useLocation();
  const navigate  = useNavigate();

  /* ── price from venue / experience ── */
  const experience = location.state?.experience || {};
  const rawPrice   =
    experience?.priceNum ??
    experience?.price ??
    location.state?.slotPrice ??
    1200;
  const slotPrice = Number(String(rawPrice).replace(/[^0-9.-]/g, "")) || 1200;

  const sportLabel =
    experience?.sportName || experience?.sport || "Court Slot Booking";

  /* ── state ── */
  const initial = location.state?.personsCount || location.state?.guests?.adult || 2;
  const [count, setCount] = useState(initial);

  /* ── navigation ── */
  const handleContinue = () => {
    if (count < 1) return;

    navigate("/payment", {
      state: {
        booking: {
          experience: {
            ...experience,
            date: location.state?.bookingDate || experience?.date || "Today",
            time: location.state?.bookingTime || experience?.time || "6:00 PM",
            location: experience?.location || "Chennai",
          },
          bookingDate: location.state?.bookingDate || "Today",
          bookingTime: location.state?.bookingTime || "6:00 PM",
          personsCount: count,
          totalPersons: count,
          guests: { adult: count, child: 0, infant: 0 },
          guestSummary: `${count} Person${count > 1 ? "s" : ""}`,
          priceDetails: {
            subtotal:    slotPrice,
            taxesAndFees: Math.round(slotPrice * 0.08),
            total:       slotPrice + Math.round(slotPrice * 0.08),
            slotPrice,
          },
        },
      },
    });
  };

  return (
    <main className="sp-page">
      {/* ── Page header ── */}
      <div className="sp-header">
        <h1>Select Persons</h1>
        <p>Choose how many persons will be playing for this slot.</p>
      </div>

      <div className="sp-layout">
        {/* ── Left: booking steps ── */}
        <BookingSteps currentStep={3} />

        {/* ── Right: main card ── */}
        <div className="sp-card">

          {/* Card top row */}
          <div className="sp-card-header">
            <div>
              <h2 className="sp-card-title">Select how many persons</h2>
              <p className="sp-card-sub">Choose the total number of persons playing for this slot.</p>
            </div>
            <div className="sp-badge">
              <span>🏛️</span>
              <span>{sportLabel}</span>
            </div>
          </div>

          {/* Counter row */}
          <div className="sp-counter-row">
            <div className="sp-counter-label">
              <span className="sp-counter-title">Number of Persons</span>
              <span className="sp-counter-sub">Total players joining the game</span>
            </div>

            <div className="sp-fee-block">
              <span className="sp-fee-amount">₹{slotPrice.toLocaleString("en-IN")}</span>
              <span className="sp-fee-label">TOTAL SLOT FEE</span>
            </div>

            <div className="sp-stepper">
              <button
                type="button"
                className="sp-stepper-btn"
                onClick={() => setCount(c => Math.max(1, c - 1))}
                disabled={count <= 1}
                aria-label="Decrease"
              >−</button>
              <span className="sp-stepper-val">{count}</span>
              <button
                type="button"
                className="sp-stepper-btn"
                onClick={() => setCount(c => Math.min(24, c + 1))}
                disabled={count >= 24}
                aria-label="Increase"
              >+</button>
            </div>
          </div>

          {/* Quick select pills */}
          <div className="sp-quick">
            <div className="sp-quick-label">QUICK SELECT PERSONS:</div>
            <div className="sp-quick-pills">
              {QUICK_OPTIONS.map(n => (
                <button
                  key={n}
                  type="button"
                  className={`sp-pill ${count === n ? "active" : ""}`}
                  onClick={() => setCount(n)}
                >
                  {n === 1 ? "1 Person" : `${n} Persons`}
                </button>
              ))}
            </div>
          </div>

          {/* Info banner */}
          <div className="sp-info-banner">
            <span className="sp-info-icon">ℹ️</span>
            <span className="sp-info-text">
              <strong>Court fee covers all players.</strong> No adult or child ticket charges
              — all {count} {count === 1 ? "person has" : "persons have"} full court access for 1 hr.
            </span>
          </div>

          {/* Footer */}
          <div className="sp-footer">
            <div className="sp-total-block">
              <div className="sp-total-persons">
                Total: <strong className="sp-teal">{count} {count === 1 ? "Person" : "Persons"}</strong>
              </div>
              <div className="sp-total-fee">Total Slot Fee: ₹{slotPrice.toLocaleString("en-IN")}</div>
            </div>

            <button
              type="button"
              className="sp-continue-btn"
              onClick={handleContinue}
            >
              Continue to Payment →
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}