import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { EVENT_DETAILS_DATA } from "../../data/sportingEventsData";
import "./SportingEventTicketSelect.css";

export default function SportingEventTicketSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const eventId = id || location.state?.event?.id || "se1";
  const matchedEvent = EVENT_DETAILS_DATA[eventId] || EVENT_DETAILS_DATA.se1;

  const event = location.state?.event || matchedEvent;
  const ticketCategories = matchedEvent.ticketCategories || [];

  // Initialize quantities dynamically: pre-select 1 for the 2nd category (or 1st if only 1)
  const [quantities, setQuantities] = useState(() => {
    const initial = {};
    ticketCategories.forEach((cat, index) => {
      initial[cat.id] = index === 1 ? 1 : 0;
    });
    return initial;
  });

  const handleAdd = (catId) => {
    setQuantities((prev) => ({
      ...prev,
      [catId]: 1,
    }));
  };

  const handleIncrement = (catId) => {
    setQuantities((prev) => ({
      ...prev,
      [catId]: Math.min(10, (prev[catId] || 0) + 1),
    }));
  };

  const handleDecrement = (catId) => {
    setQuantities((prev) => ({
      ...prev,
      [catId]: Math.max(0, (prev[catId] || 0) - 1),
    }));
  };

  // Calculate totals
  const totalTickets = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = ticketCategories.reduce((sum, cat) => {
    return sum + (quantities[cat.id] || 0) * cat.price;
  }, 0);

  // Selected items breakdown
  const selectedItems = ticketCategories.filter((cat) => (quantities[cat.id] || 0) > 0).map(
    (cat) => ({
      ...cat,
      quantity: quantities[cat.id],
      subtotal: (quantities[cat.id] || 0) * cat.price,
    })
  );

  const handleAddToCart = () => {
    if (totalTickets === 0) return;

    navigate(`/sporting-events/${event.id || "se1"}/invoice`, {
      state: {
        event,
        selectedTickets: selectedItems,
        totalTickets,
        totalPrice,
      },
    });
  };

  return (
    <div className="ticket-select-root">
      {/* Top minimal header matching District by Zomato navbar */}
      <header className="ticket-select-navbar">
        <div className="ticket-select-nav-inner">
          <button
            type="button"
            className="ticket-nav-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" width="20" height="20">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="ticket-select-event-meta">
            <h2 className="event-meta-title">{event.title}</h2>
            <p className="event-meta-sub">{event.date || "Sun, 15 Nov | 5 AM • Chennai"}</p>
          </div>

          <div className="ticket-select-nav-user">
            <div className="user-avatar-circle">
              <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="ticket-select-main">
        <div className="ticket-select-content">
          <h3 className="choose-tickets-label">CHOOSE TICKETS</h3>

          <div className="ticket-cards-list">
            {ticketCategories.map((cat) => {
              const qty = quantities[cat.id] || 0;

              return (
                <div key={cat.id} className="ticket-category-card">
                  <div className="ticket-card-header">
                    <h4 className="ticket-category-name">{cat.name}</h4>
                  </div>

                  <div className="ticket-price-action-row">
                    <span className="ticket-price-display">₹{cat.price}</span>

                    {qty === 0 ? (
                      <button
                        type="button"
                        className="ticket-add-btn"
                        onClick={() => handleAdd(cat.id)}
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="ticket-qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleDecrement(cat.id)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-number">{qty}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => handleIncrement(cat.id)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="ticket-category-desc">{cat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom Sticky Bar with total & ADD TO CART button */}
      {totalTickets > 0 && (
        <footer className="ticket-bottom-bar">
          <div className="ticket-bottom-inner">
            <div className="bottom-total-col">
              <span className="bottom-total-amount">₹{totalPrice}</span>
              <span className="bottom-total-count">
                {totalTickets} {totalTickets === 1 ? "ticket" : "tickets"}
              </span>
            </div>

            <button
              type="button"
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              BOOK TICKETS
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
