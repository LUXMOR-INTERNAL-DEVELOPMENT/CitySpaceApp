import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./GuestCount.css";

function BookingStep({ number, title, active, onClick }) {
  return (
    <div className={`booking-step ${active ? "active" : ""}`}>
      <div className="step-number">{number}</div>
      <button className="step-link" type="button" onClick={onClick}>
        {title}
      </button>
    </div>
  );
}

function BookingSteps() {
  const [activeStep, setActiveStep] = useState(2);
  const steps = [
    "Details",
    "Date & time",
    "Tickets / guests",
    "Summary",
    "Payment",
    "Confirmation",
  ];

  return (
    <div className="booking-steps">
      <h3>Booking steps</h3>
      <div>
        {steps.map((step, index) => (
          <BookingStep
            key={step}
            number={index + 1}
            title={step}
            active={index === activeStep}
            onClick={() => setActiveStep(index)}
          />
        ))}
      </div>
    </div>
  );
}

function GuestRow({ name, age, price, count, increase, decrease }) {
  return (
    <div className="guest-row">
      <div className="guest-info">
        <h3>{name}</h3>
        <p>{age}</p>
      </div>

      <div className="guest-price">
        {price === 0 ? "Free" : `₹${price.toLocaleString("en-IN")}`}
      </div>

      <div className="counter">
        <button onClick={decrease} disabled={count === 0}>
          −
        </button>
        <span>{count}</span>
        <button onClick={increase}>+</button>
      </div>
    </div>
  );
}

function GuestSelector() {
  const location = useLocation();
  const navigate = useNavigate();
  const adultPrice = Number(String(location.state?.experience?.price ?? "").replace(/[^0-9.-]/g, "")) || 1500;
  const [guests, setGuests] = useState({ adult: 2, child: 0, infant: 0 });

  const increaseGuest = (type) => {
    setGuests((previous) => ({
      ...previous,
      [type]: previous[type] + 1,
    }));
  };

  const decreaseGuest = (type) => {
    setGuests((previous) => ({
      ...previous,
      [type]: Math.max(0, previous[type] - 1),
    }));
  };

  const totalGuests = guests.adult + guests.child + guests.infant;

  const handleContinue = () => {
    if (totalGuests === 0) {
      alert("Please select at least one guest.");
      return;
    }

    navigate("/screen3", {
      state: {
        experience: location.state?.experience,
        guests,
        bookingDate: location.state?.bookingDate,
        bookingTime: location.state?.bookingTime,
      },
    });
  };

  return (
    <div className="guest-card">
      <GuestRow
        name="Adult"
        age="Ages 18+"
        price={adultPrice}
        count={guests.adult}
        increase={() => increaseGuest("adult")}
        decrease={() => decreaseGuest("adult")}
      />

      <GuestRow
        name="Child"
        age="Ages 5–12"
        price={1000}
        count={guests.child}
        increase={() => increaseGuest("child")}
        decrease={() => decreaseGuest("child")}
      />

      <GuestRow
        name="Infant"
        age="Under 5"
        price={500}
        count={guests.infant}
        increase={() => increaseGuest("infant")}
        decrease={() => decreaseGuest("infant")}
      />

      <div className="guest-footer">
        <h3>Total guests: {totalGuests}</h3>
        <button className="continue-btn" onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

function Guestcount() {
  return (
    <main className="tickets-page">
      <div className="page-header">
        {/* <div className="step-label">03 – Tickets / guests</div> */}
        <h1>Select guests</h1>
        <p>Choose the right ticket for everyone.</p>
      </div>

      <div className="booking-layout">
        <BookingSteps />
        <GuestSelector />
      </div>
    </main>
  );
}

export default Guestcount;