import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingSteps from "./BookingSteps";
import MyCalendar from "./Calendar";
import TimeSlots from "./TimeSlots";
import "./BookingDate&Time.css";

function BookingPage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date(today));
  const [calendarMonth, setCalendarMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedTime, setSelectedTime] = useState(null);
  const location = useLocation();
  const experience = location.state?.experience;
  const navigate = useNavigate();
  const canContinue = Boolean(selectedDate && selectedTime);

  return (
    <div className="page">
      <main>
        <h1>Choose date and time</h1>
        <p className="subtitle">
          {experience?.title || experience?.name || "Choose your experience"}
        </p>
        <div className="booking-card">
          <BookingSteps />
          <div className="date-section">
            <h2>
              {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <MyCalendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              calendarMonth={calendarMonth}
              onMonthChange={setCalendarMonth}
            />
            <TimeSlots selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
            <button
              className="continue-btn"
              type="button"
              disabled={!canContinue}
              onClick={() => {
                if (canContinue) {
                  navigate("/screen2", {
                    state: {
                      experience,
                      bookingDate: selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }),
                      bookingTime: selectedTime,
                    },
                  });
                }
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BookingPage;
