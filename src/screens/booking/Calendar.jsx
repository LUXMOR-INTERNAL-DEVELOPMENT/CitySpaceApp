import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { useEffect, useRef, useState } from "react";
const calendarApiUrl = import.meta.env.VITE_CALENDAR_API_URL || "/api/calendar";

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDates(payload) {
  const values = Array.isArray(payload)
    ? payload
    : payload.dates || payload.availableDates || payload.days || [];

  return values
    .filter((value) => typeof value === "string" || value.available !== false)
    .map((value) => (typeof value === "string" ? value : value.date))
    .map((value) => new Date(`${value}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()));
}

function createFallbackDates(referenceDate) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();

  return Array.from(
    { length: lastDay },
    (_, index) => new Date(year, month, index + 1)
  );
}

function MyCalendar({ selectedDate, setSelectedDate, calendarMonth, onMonthChange }) {
  const [availableDates, setAvailableDates] = useState([]);
  const [status, setStatus] = useState("loading");
  const initialDate = useRef(new Date());

  useEffect(() => {
    const controller = new AbortController();

    async function loadCalendar() {
      try {
        const response = await fetch(calendarApiUrl, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`Calendar request failed with ${response.status}`);
        }

        const dates = parseDates(await response.json());
        setAvailableDates(dates);
        setStatus(dates.length ? "ready" : "empty");

        if (dates[0]) {
          onMonthChange?.(new Date(dates[0].getFullYear(), dates[0].getMonth(), 1));
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          const fallbackDates = createFallbackDates(initialDate.current);
          setAvailableDates(fallbackDates);
          setStatus("ready");

        }
      }
    }

    loadCalendar();
    return () => controller.abort();
  }, [onMonthChange]);

  const availableDateKeys = new Set(availableDates.map(formatDate));

  if (status === "loading") {
    return <p>Loading available dates...</p>;
  }

  if (status === "empty") {
    return <p>There are no available dates.</p>;
  }

  return (
    <Calendar
      onChange={setSelectedDate}
      value={selectedDate}
      activeStartDate={calendarMonth}
      calendarType="iso8601"
      showNeighboringMonth={false}
      onActiveStartDateChange={({ activeStartDate }) => onMonthChange?.(activeStartDate)}
      tileDisabled={({ date, view }) => view === "month" && !availableDateKeys.has(formatDate(date))}
      tileClassName={({ date, view }) =>
        view === "month" && availableDateKeys.has(formatDate(date)) ? "available-day" : ""
      }
    />
  );
}

export default MyCalendar;
