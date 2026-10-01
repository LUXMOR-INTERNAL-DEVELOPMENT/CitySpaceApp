import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import "./EventBooking.css";

const defaultAreas = [
  { id: "general", name: "General admission", multiplier: 1, description: "Open viewing area" },
  { id: "premium", name: "Premium viewing", multiplier: 1.5, description: "Closer to the stage" },
  { id: "vip", name: "VIP lounge", multiplier: 2, description: "Premium sightlines and lounge access" },
];

const toPrice = (value) => Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;
const formatPrice = (value) => `₹${value.toLocaleString("en-IN")}`;

function EventBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const passedExperience = location.state?.experience;
  const [loadedExperience, setLoadedExperience] = useState(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(!passedExperience && Boolean(id));
  const [selectedAreaId, setSelectedAreaId] = useState(
    location.state?.selectedAreaId || "general"
  );
  const [ticketQuantity, setTicketQuantity] = useState(
    Math.min(8, Math.max(1, Number(location.state?.ticketQuantity) || 1))
  );

  useEffect(() => {
    if (passedExperience || !id) return;

    let isMounted = true;
    fetch("/db.json")
      .then((response) => {
        if (!response.ok) throw new Error("Could not load event details");
        return response.json();
      })
      .then((data) => {
        const foundEvent = (data.Events || []).find((item) => String(item.id) === id);
        if (isMounted) {
          setLoadedExperience(foundEvent || null);
          setIsLoadingEvent(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadedExperience(null);
          setIsLoadingEvent(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, passedExperience]);

  const experience = passedExperience || (String(loadedExperience?.id) === id ? loadedExperience : null);
  const basePrice = toPrice(experience?.price);
  const areas = experience?.ticketAreas?.length
    ? experience.ticketAreas.map((area, index) => ({
        ...area,
        id: area.id || `area-${index}`,
        name: area.name || area.label || `Area ${index + 1}`,
        price: toPrice(area.price) || basePrice,
        description: area.description || "Event viewing area",
      }))
    : defaultAreas.map((area) => ({
        ...area,
        price: Math.round(basePrice * area.multiplier),
      }));
  const selectedArea = areas.find((area) => area.id === selectedAreaId) || areas[0];
  const subtotal = selectedArea ? selectedArea.price * ticketQuantity : 0;
  const taxesAndFees = Math.round(subtotal * 0.08);
  const total = subtotal + taxesAndFees;

  const continueToPayment = () => {
    if (!experience || !selectedArea) return;
    const guestSummary = `${ticketQuantity} ${ticketQuantity === 1 ? "ticket" : "tickets"}`;

    navigate("/payment", {
      state: {
        booking: {
          guests: { adult: ticketQuantity, child: 0, infant: 0 },
          guestSummary,
          ticketQuantity,
          priceDetails: {
            items: [{ label: `${ticketQuantity} × ${selectedArea.name}`, amount: subtotal }],
            subtotal,
            taxesAndFees,
            total,
          },
          experience: {
            ...experience,
            date: experience.date || experience.eventDate || "Date not listed by organizer",
            time: experience.time || experience.eventTime || "Time not listed by organizer",
            viewingArea: selectedArea.name,
            ticketAreaId: selectedArea.id,
            ticketAreaPrice: selectedArea.price,
          },
        },
      },
    });
  };

  if (!experience) {
    return (
      <main className="event-booking-status">
        <p>{isLoadingEvent ? "Loading event details..." : "Event not found."}</p>
        <button type="button" onClick={() => navigate("/events")}>Back to events</button>
      </main>
    );
  }

  return (
    <main className="event-booking-page">
      <div className="event-booking-container">
        <button className="event-booking-back" type="button" onClick={() => navigate(-1)}>
          <FiArrowLeft aria-hidden="true" /> Back to event
        </button>

        <header className="event-booking-header">
          <span className="event-booking-step">Event tickets</span>
          <h1>Choose your view</h1>
          <p>Select a viewing area and ticket count. Event date and time appear here when provided by the organizer.</p>
        </header>

        <div className="event-booking-layout">
          <section className="event-selection-column" aria-label="Event and ticket selection">
            <article className="event-booking-summary">
              <img src={experience.image} alt="" />
              <div>
                <p className="event-summary-category">{experience.category || "Live experience"}</p>
                <h2>{experience.title || experience.name}</h2>
                <p>{experience.date || experience.eventDate || "Date not listed by organizer"}</p>
                <p>{experience.time || experience.eventTime || "Time not listed by organizer"} · {experience.venue || experience.location || "Venue not listed by organizer"}</p>
              </div>
            </article>

            <section className="ticket-area-section">
              <div className="section-heading">
                <div>
                  <span>01</span>
                  <h2>Viewing area</h2>
                </div>
                <small>Price per ticket</small>
              </div>
              <div className="ticket-area-options">
                {areas.map((area) => {
                  const isSelected = area.id === selectedArea?.id;
                  return (
                    <button
                      className={`ticket-area-option ${isSelected ? "is-selected" : ""}`}
                      key={area.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedAreaId(area.id)}
                    >
                      <span className="ticket-area-check">{isSelected && <FiCheck aria-hidden="true" />}</span>
                      <span className="ticket-area-copy">
                        <strong>{area.name}</strong>
                        <small>{area.description}</small>
                      </span>
                      <strong className="ticket-area-price">{formatPrice(area.price)}</strong>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="ticket-quantity-section">
              <div>
                <span className="section-number">02</span>
                <h2>How many people?</h2>
                <p>Up to 8 tickets per booking</p>
              </div>
              <div className="ticket-stepper" aria-label="Ticket quantity">
                <button
                  type="button"
                  aria-label="Remove one ticket"
                  disabled={ticketQuantity <= 1}
                  onClick={() => setTicketQuantity((quantity) => Math.max(1, quantity - 1))}
                >
                  <FiMinus aria-hidden="true" />
                </button>
                <output aria-live="polite">{ticketQuantity}</output>
                <button
                  type="button"
                  aria-label="Add one ticket"
                  disabled={ticketQuantity >= 8}
                  onClick={() => setTicketQuantity((quantity) => Math.min(8, quantity + 1))}
                >
                  <FiPlus aria-hidden="true" />
                </button>
              </div>
            </section>
          </section>

          <aside className="event-order-panel" aria-label="Order summary">
            <div className="order-panel-heading">
              <h2>Your tickets</h2>
              <span>{ticketQuantity}</span>
            </div>
            <div className="order-event-name">{experience.title || experience.name}</div>
            <div className="order-detail-row">
              <span>Event date</span>
              <strong>{experience.date || experience.eventDate || "Not listed by organizer"}</strong>
            </div>
            <div className="order-detail-row">
              <span>Viewing area</span>
              <strong>{selectedArea?.name}</strong>
            </div>
            <div className="order-detail-row">
              <span>Tickets</span>
              <strong>{ticketQuantity} × {formatPrice(selectedArea?.price || 0)}</strong>
            </div>
            <div className="order-price-breakdown">
              <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
              <div><span>Taxes &amp; fees</span><strong>{formatPrice(taxesAndFees)}</strong></div>
              <div className="order-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            </div>
            <button className="event-checkout-button" type="button" onClick={continueToPayment}>
              Continue to payment <span aria-hidden="true">→</span>
            </button>
            <p className="order-note">Your selected viewing area and ticket count will be carried into checkout.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default EventBooking;