import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Booking summary.css";
import bookingData from "./BookingData.json"; 
import SummarySteps from "./BookingSteps";
import { getCurrentLocationName } from "../../utils/location";

// Booking Summary

function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const guestSelection = location.state?.guests ?? { adult: 0, child: 0, infant: 0 };
  const [currentStep, setCurrentStep] = useState(4);
  const [locationName, setLocationName] = useState(bookingData.experience.location);

  const summary = bookingData.bookingSummary;
  const steps = bookingData.bookingSteps;
  const experience = location.state?.experience || bookingData.experience;
  const actions = bookingData.actions;
  const bookingDate = location.state?.bookingDate || experience.date;
  const bookingTime = location.state?.bookingTime || experience.time;

  const adultCount = guestSelection.adult ?? 0;
  const childCount = guestSelection.child ?? 0;
  const infantCount = guestSelection.infant ?? 0;
  const adultPrice = Number(String(experience.price ?? "").replace(/[^0-9.-]/g, "")) || 1500;

  const itemDefinitions = [
    { label: `${adultCount} × Adult`, amount: adultCount * adultPrice },
    { label: `${childCount} × Child`, amount: childCount * 1000 },
    { label: `${infantCount} × Infant`, amount: infantCount * 500 },
  ].filter((item) => !item.label.startsWith("0 ×"));

  const subtotal = itemDefinitions.reduce((sum, item) => sum + item.amount, 0);
  const taxesAndFees = Math.round(subtotal * 0.09);
  const total = subtotal + taxesAndFees;

  const priceDetails = {
    items: itemDefinitions.length > 0 ? itemDefinitions : [{ label: "0 × Guest", amount: 0 }],
    subtotal,
    taxesAndFees,
    total,
  };

  const activeStep = steps.find((step) => step.id === currentStep) || steps[3];

  const guestSummary = [
    adultCount > 0 ? `${adultCount} Adult${adultCount > 1 ? "s" : ""}` : null,
    childCount > 0 ? `${childCount} Child${childCount > 1 ? "ren" : ""}` : null,
    infantCount > 0 ? `${infantCount} Infant${infantCount > 1 ? "s" : ""}` : null,
  ].filter(Boolean).join(" · ");

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      const fetchedLocation = await getCurrentLocationName(experience.location);
      if (isMounted) setLocationName(fetchedLocation);
    }

    loadLocation();

    return () => {
      isMounted = false;
    };
  }, [experience.location]);

  const handleContinue = () => {
    if (currentStep === 4) {
      navigate("/payment", {
        state: {
          booking: {
            guests: { adult: adultCount, child: childCount, infant: infantCount },
            guestSummary,
            priceDetails,
            experience: { ...experience, date: bookingDate, time: bookingTime, location: locationName },
          },
        },
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="booking-page">
      <BookingHeading summary={summary} description={activeStep.description} />

      <div className="booking-layout">
        <SummarySteps steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />

        <BookingCard
          experience={{
            ...experience,
            date: bookingDate,
            time: bookingTime,
            location: locationName,
            guests: { adults: adultCount + childCount + infantCount },
            guestSummary,
          }}
        />

        <PriceDetails
          priceDetails={priceDetails}
          action={actions.continueButton}
          onContinue={handleContinue}
          currentStep={currentStep}
        />
      </div>
    </div>
  );
}


// -------------------------
// Heading
// -------------------------

function BookingHeading({ summary, description }) {

  return (
    <div className="booking-heading">

      <div className="step-badge">
        {summary.stepNumber} {summary.stepTitle}
      </div>

      <h1>
        {summary.title}
      </h1>

      <p>
        {summary.subtitle}
      </p>

      <div className="step-description">
        {description}
      </div>

    </div>
  );
}



// -------------------------
// Booking Card
// -------------------------

function BookingCard({ experience }) {
  return (
    <div className="booking-card">
      <div
        className="experience-image"
        style={{
          backgroundImage: `url(${experience.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative"
        }}
      >
        <div className="food-icon">🍽️</div>
        <div className="image-shape">
          <div></div>
        </div>
      </div>

      <div className="booking-info">
        <h2>{experience.title}</h2>
        <p>{experience.date} · {experience.time}</p>
        <p>
          {experience.guestSummary || `${experience.guests.adults} Adults`} · {experience.location}
        </p>
      </div>
    </div>
  );
}



// -------------------------
// Price Details
// -------------------------

function PriceDetails({
  priceDetails,
  action,
  onContinue,
  currentStep
}) {
  const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="price-card">
      <h3>Price details</h3>

      {priceDetails.items.map((item, index) => (
        <div className="price-row" key={`${item.label}-${index}`}>
          <span>{item.label}</span>
          <span>{formatPrice(item.amount)}</span>
        </div>
      ))}

      <div className="price-row">
        <span>Taxes & fees</span>
        <span>{formatPrice(priceDetails.taxesAndFees)}</span>
      </div>

      <div className="divider"></div>

      <div className="total-row">
        <span>Total</span>
        <strong>{formatPrice(priceDetails.total)}</strong>
      </div>

      <button className="continue-btn" onClick={onContinue}>
        {currentStep === 4 ? action.label : "Continue"}
      </button>
    </div>
  );
}


export default BookingSummary;