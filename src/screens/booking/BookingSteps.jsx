import { NavLink, useLocation } from "react-router-dom";

const steps = [
  ["Details", "/details"],
  ["Date & time", "/date-time"],
  ["Tickets / guests", "/tickets"],
  ["Summary", "/summary"],
  ["Payment", "/payment"],
  ["Confirmation", "/confirmation"]
];

function BookingSteps() {
  const location = useLocation();

  return (
    <div className="booking-steps">
      <h3>Booking steps</h3>
      {steps.map(([step, path], index) => {
        const isCurrentStep =
          location.pathname === path ||
          (path === "/date-time" && location.pathname === "/");

        return (
          <NavLink
            className={`step ${isCurrentStep ? "current" : ""}`}
            to={path}
            key={step}
          >
            <div className="step-number">{index + 1}</div>
            <span>{step}</span>
          </NavLink>
        );
      })}
    </div>
  );
}

export default BookingSteps;
