function TimeSlots({ selectedTime, setSelectedTime }) {
  const times = ["6:00 PM", "7:30 PM", "9:00 PM"];

  return (
    <div className="time-section">
      <h3>Available times</h3>
      <div className="time-slots">
        {times.map((time) => (
          <button
            key={time}
            type="button"
            className={selectedTime === time ? "selected-time" : ""}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TimeSlots;
