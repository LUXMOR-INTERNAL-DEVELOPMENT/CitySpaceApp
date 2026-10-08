import React from "react";
import "./ExploreSports.css";

import BadmintonGraphic from "./BadmintonGraphic";
import SwimmingGraphic from "./SwimmingGraphic";
import PickleballGraphic from "./PickleballGraphic";
import TurfFootballGraphic from "./TurfFootballGraphic";
import TableTennisGraphic from "./TableTennisGraphic";
import BoxCricketGraphic from "./BoxCricketGraphic";
import PadelGraphic from "./PadelGraphic";
import CricketNetsGraphic from "./CricketNetsGraphic";
import TennisGraphic from "./TennisGraphic";
import BasketballGraphic from "./BasketballGraphic";
import SnookerGraphic from "./SnookerGraphic";
import PoolGraphic from "./PoolGraphic";
import VolleyballGraphic from "./VolleyballGraphic";
import FootballGraphic from "./FootballGraphic";
import SquashGraphic from "./SquashGraphic";
import CricketGraphic from "./CricketGraphic";

export {
  BadmintonGraphic,
  SwimmingGraphic,
  PickleballGraphic,
  TurfFootballGraphic,
  TableTennisGraphic,
  BoxCricketGraphic,
  PadelGraphic,
  CricketNetsGraphic,
  TennisGraphic,
  BasketballGraphic,
  SnookerGraphic,
  PoolGraphic,
  VolleyballGraphic,
  FootballGraphic,
  SquashGraphic,
  CricketGraphic,
};

export const SPORTS_DATA = [
  { id: "badminton", name: "Badminton", Component: BadmintonGraphic },
  { id: "swimming", name: "Swimming", Component: SwimmingGraphic },
  { id: "pickleball", name: "Pickleball", Component: PickleballGraphic },
  { id: "turf-football", name: "Turf Football", Component: TurfFootballGraphic },
  { id: "table-tennis", name: "Table Tennis", Component: TableTennisGraphic },
  { id: "box-cricket", name: "Box Cricket", Component: BoxCricketGraphic },
  { id: "padel", name: "Padel", Component: PadelGraphic },
  { id: "cricket-nets", name: "Cricket Nets", Component: CricketNetsGraphic },
  { id: "tennis", name: "Tennis", Component: TennisGraphic },
  { id: "basketball", name: "Basketball", Component: BasketballGraphic },
  { id: "snooker", name: "Snooker", Component: SnookerGraphic },
  { id: "pool", name: "Pool", Component: PoolGraphic },
  { id: "volleyball", name: "Volleyball", Component: VolleyballGraphic },
  { id: "football", name: "Football", Component: FootballGraphic },
  { id: "squash", name: "Squash", Component: SquashGraphic },
  { id: "cricket", name: "Cricket", Component: CricketGraphic },
];

export const GRAPHICS_MAP = {
  badminton: BadmintonGraphic,
  swimming: SwimmingGraphic,
  pickleball: PickleballGraphic,
  "turf-football": TurfFootballGraphic,
  "table-tennis": TableTennisGraphic,
  "box-cricket": BoxCricketGraphic,
  padel: PadelGraphic,
  "cricket-nets": CricketNetsGraphic,
  tennis: TennisGraphic,
  basketball: BasketballGraphic,
  snooker: SnookerGraphic,
  pool: PoolGraphic,
  volleyball: VolleyballGraphic,
  football: FootballGraphic,
  squash: SquashGraphic,
  cricket: CricketGraphic,
};

export default function ExploreSports({ sports, selectedSport, onSelectSport }) {
  const sportsList = sports && sports.length > 0 ? sports : SPORTS_DATA;

  // Split into 2 rows of 8 sports each matching the reference 2-row layout
  const row1 = sportsList.slice(0, 8);
  const row2 = sportsList.slice(8, 16);

  const renderCard = (item, uniqueKey) => {
    const id = item.id;
    const name = item.name;
    const customImage = item.image;
    const Component = GRAPHICS_MAP[id] || BadmintonGraphic;
    const isSelected = selectedSport === id;

    return (
      <button
        key={uniqueKey}
        type="button"
        className={`sport-card ${isSelected ? "selected" : ""}`}
        onClick={() => onSelectSport(isSelected ? null : id)}
        aria-label={`Select ${name}`}
      >
        <div className="sport-name">{name}</div>
        <div className="sport-graphic-wrapper">
          {customImage && customImage.trim() !== "" ? (
            <img
              src={customImage}
              alt={name}
              className="sport-img"
              onError={(e) => {
                // Fallback to SVG graphic if image fails to load
                e.target.style.display = "none";
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = "block";
                }
              }}
            />
          ) : null}
          <div
            style={{
              display: customImage && customImage.trim() !== "" ? "none" : "block",
              width: "100%",
              height: "100%",
            }}
          >
            <Component />
          </div>
        </div>
      </button>
    );
  };

  return (
    <section className="explore-sports-section">
      <div className="explore-sports-header">
        <h2 className="explore-sports-title">Explore Sports</h2>
        {selectedSport && (
          <button
            type="button"
            className="clear-sport-filter"
            onClick={() => onSelectSport(null)}
          >
            Show All Sports ✕
          </button>
        )}
      </div>

      <div className="sports-marquee-container">
        {/* Row 1 - Moving Towards Left */}
        <div className="sports-marquee-row row-1">
          <div className="sports-marquee-track">
            {[...row1, ...row1, ...row1, ...row1].map((item, idx) =>
              renderCard(item, `r1-${item.id}-${idx}`)
            )}
          </div>
        </div>

        {/* Row 2 - Moving Towards Left */}
        <div className="sports-marquee-row row-2">
          <div className="sports-marquee-track">
            {[...row2, ...row2, ...row2, ...row2].map((item, idx) =>
              renderCard(item, `r2-${item.id}-${idx}`)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
