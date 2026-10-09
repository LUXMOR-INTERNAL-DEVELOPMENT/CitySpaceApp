import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentLocationName } from "../../utils/location";
import "./ConfirmationPage.css";

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const booking = location.state?.booking;
  const paymentMethod =
    location.state?.paymentMethod && location.state?.paymentMethod !== "Selected payment method"
      ? location.state?.paymentMethod
      : "Google Pay";

  const confirmationNumber = "ST-2026-0325-8472";
  const guestSummary = booking?.guestSummary || "2 Persons";
  const total = booking?.priceDetails?.total ?? 540;
  const bookingLocation =
    booking?.experience?.location ||
    "HP, Inner Ring Road, Balaji Nagar, Ward 170, Zone 13 Adyar, Chennai, Chennai District, Tamil Nadu, 600032, India";

  const [locationName, setLocationName] = useState(bookingLocation);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancellationId] = useState("CN-2026-9182");

  const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  const displayExperience =
    booking?.experience?.title ||
    booking?.experience?.name ||
    booking?.experience?.experienceName ||
    "Prime Shuttlers Badminton Hub";

  const displayDate = booking?.bookingDate || booking?.experience?.date || "Thu, Oct 8, 2026";
  const displayTime =
    booking?.bookingTime || booking?.experience?.time || "06:00 PM - 07:00 PM (1 hr)";
  const displayPayment = paymentMethod;
  const displayTotal = formatPrice(total);

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      if (booking?.experience?.location) {
        const fetchedLocation = await getCurrentLocationName(booking.experience.location);
        if (isMounted && fetchedLocation) setLocationName(fetchedLocation);
      }
    }

    loadLocation();
    return () => {
      isMounted = false;
    };
  }, [booking]);

  const handleConfirmCancel = () => {
    setIsCancelled(true);
    setIsCancelModalOpen(false);
  };

  return (
    <main className="confirmation-page-main">
      <div className="confirmation-page-container">
        <section className="confirmation-card">
          {/* Top Pill Badge */}
          <div className={`confirmation-step-pill ${isCancelled ? "cancelled" : ""}`}>
            {isCancelled ? "✕ Booking Cancelled" : "05 Confirmation"}
          </div>

          <h1 className="confirmation-title">
            {isCancelled ? "Booking Cancelled" : "Booking confirmed"}
          </h1>

          <p className="confirmation-subtitle">
            {isCancelled
              ? `Your reservation has been cancelled. A refund of ${displayTotal} will be refunded to your original payment method within 5–7 business days.`
              : "Your reservation is confirmed. We have saved your booking details and sent the confirmation to your email."}
          </p>

          {/* Cancellation Alert Banner */}
          {isCancelled && (
            <div className="confirmation-cancelled-banner">
              <span className="cancelled-banner-icon">ℹ️</span>
              <div>
                <strong>Cancellation Successful:</strong> Reference #{cancellationId}. Full refund of{" "}
                <strong>{displayTotal}</strong> initiated to {displayPayment}.
              </div>
            </div>
          )}

          {/* 2-Column Booking Details Grid matching screenshot */}
          <div className="confirmation-details-grid">
            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">EXPERIENCE</span>
              <strong className="confirmation-cell-value">{displayExperience}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">CONFIRMATION NUMBER</span>
              <strong className="confirmation-cell-value">{confirmationNumber}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">DATE</span>
              <strong className="confirmation-cell-value">{displayDate}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">TIME</span>
              <strong className="confirmation-cell-value">{displayTime}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">GUESTS</span>
              <strong className="confirmation-cell-value">{guestSummary}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">LOCATION</span>
              <strong className="confirmation-cell-value">{locationName}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">PAYMENT</span>
              <strong className="confirmation-cell-value">{displayPayment}</strong>
            </div>

            <div className="confirmation-grid-cell">
              <span className="confirmation-cell-label">AMOUNT PAID</span>
              <strong className="confirmation-cell-value">{displayTotal}</strong>
            </div>
          </div>

          {/* Notice Callout Box */}
          <div className="confirmation-info-box">
            <span className="confirmation-info-icon-badge">i</span>
            <span>
              Please arrive 15 minutes before your selected time. Keep your confirmation number available when you arrive.
            </span>
          </div>

          {/* Action Buttons Row */}
          <div className="confirmation-actions-row">
            {!isCancelled && (
              <button
                type="button"
                className="btn-cancel-booking"
                onClick={() => setIsCancelModalOpen(true)}
              >
                <span className="btn-cancel-booking-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </span>
                <span>Cancel Booking</span>
              </button>
            )}

            <button
              type="button"
              className="btn-book-another"
              onClick={() => navigate("/play/venues")}
            >
              Book another experience
            </button>

            <button
              type="button"
              className="btn-print-confirmation"
              onClick={() => window.print()}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              <span>Print confirmation</span>
            </button>
          </div>
        </section>
      </div>

      {/* Cancel Confirmation Modal matching screenshot */}
      {isCancelModalOpen && (
        <div
          className="cancel-modal-overlay"
          onClick={() => setIsCancelModalOpen(false)}
        >
          <div
            className="cancel-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Top row with trash icon and close button */}
            <div className="cancel-modal-top-row">
              <div className="cancel-modal-trash-icon">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </div>
              <button
                type="button"
                className="cancel-modal-close-btn"
                onClick={() => setIsCancelModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <h2 className="cancel-modal-title">Cancel Booking</h2>
            <p className="cancel-modal-question">Are you sure you want to cancel this booking?</p>
            <p className="cancel-modal-desc">
              This action will cancel your reservation for <strong>{displayExperience}</strong> on{" "}
              <strong>{displayDate}</strong>, from <strong>{displayTime}</strong>.
            </p>

            {/* Note alert box */}
            <div className="cancel-modal-alert-box">
              <div className="cancel-modal-alert-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Please note:</span>
              </div>
              <ul className="cancel-modal-alert-list">
                <li>Your booking will be cancelled immediately.</li>
                <li>Amount paid will be refunded to your original payment method within 5–7 business days.</li>
                <li>You will receive a confirmation email once the cancellation is processed.</li>
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="cancel-modal-actions">
              <button
                type="button"
                className="btn-keep-booking"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Keep Booking
              </button>
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ConfirmationPage;
