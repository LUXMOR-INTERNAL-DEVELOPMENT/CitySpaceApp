import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PlayBookingSteps.css";

export const PLAY_BOOKING_STEPS = [
  { number: 1, title: "Details", path: "/experience" },
  { number: 2, title: "Date & time", path: "/date-time" },
  { number: 3, title: "Persons / players", path: "/guestcount" },
  { number: 4, title: "Payment", path: "/payment" },
  { number: 5, title: "Confirmation", path: "/confirmation" },
];

export default function PlayBookingSteps({ currentStep }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect step if currentStep is not explicitly provided
  const detectStep = () => {
    if (typeof currentStep === "number") return currentStep;
    const path = location.pathname.toLowerCase();
    if (path.includes("date-time") || path === "/booking") return 2;
    if (path.includes("guestcount") || path.includes("screen2") || path.includes("tickets")) return 3;
    if (path.includes("payment")) return 4;
    if (path.includes("confirmation") || path.includes("screen4")) return 5;
    if (path.includes("experience") || path.includes("details")) return 1;
    return 2;
  };

  const activeStepNumber = detectStep();

  const handleStepClick = (step) => {
    // Only allow navigating to current or previously completed steps
    if (step.number <= activeStepNumber) {
      navigate(step.path, { state: location.state });
    }
  };

  return (
    <aside className="play-booking-steps" aria-label="Booking steps progress">
      <h3 className="play-steps-heading">Booking steps</h3>
      <nav className="play-steps-list">
        {PLAY_BOOKING_STEPS.map((step) => {
          const isCurrent = step.number === activeStepNumber;
          const isCompleted = step.number < activeStepNumber;

          return (
            <div
              key={step.number}
              className={`play-step ${isCurrent ? "current" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => handleStepClick(step)}
              style={{ cursor: step.number <= activeStepNumber ? "pointer" : "default" }}
            >
              <div className="play-step-number">
                {isCompleted ? "✓" : step.number}
              </div>
              <span className="play-step-label">{step.title}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
