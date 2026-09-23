function BookingSteps({ steps, currentStep, setCurrentStep }) {
  return (
    <div className="steps-card">
      <h3>Booking steps</h3>

      <div className="steps-list">
        {steps.map((step) => (
          <div
            className={`step-item ${currentStep === step.id ? "active" : ""}`}
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="step-circle">{step.id}</div>
            <span>{step.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookingSteps;
