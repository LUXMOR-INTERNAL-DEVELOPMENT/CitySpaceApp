import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentLocationName } from "../../utils/location";

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentMethod = location.state?.paymentMethod || "Selected payment method";
  const booking = location.state?.booking;
  const confirmationNumber = "ST-2026-0325-8472";
  const guestSummary = booking?.guestSummary || "2 Adults";
  const total = booking?.priceDetails?.total ?? 3270;
  const bookingLocation = booking?.experience?.location || "Nungambakkam";
  const [locationName, setLocationName] = useState(bookingLocation);
  const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  useEffect(() => {
    let isMounted = true;

    async function loadLocation() {
      const fetchedLocation = await getCurrentLocationName(bookingLocation);
      if (isMounted) setLocationName(fetchedLocation);
    }

    loadLocation();
    return () => {
      isMounted = false;
    };
  }, [bookingLocation]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f5f2ed 0%, #e8f0e7 100%)",
        padding: "28px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2a1f",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          minHeight: "calc(100vh - 56px)",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <section
          style={{
            width: "100%",
            background: "#fff",
            border: "1px solid #e1ded5",
            borderRadius: "30px",
            boxShadow: "0 18px 45px rgba(20, 44, 30, 0.1)",
            padding: "44px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "76px",
              height: "76px",
              margin: "0 auto 22px",
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              background: "#dff5c7",
              color: "#176246",
              fontSize: "40px",
              fontWeight: 700,
            }}
            aria-label="Payment successful"
          >
            ✓
          </div>

          <div
            style={{
              display: "inline-flex",
              padding: "9px 16px",
              borderRadius: "999px",
              background: "#dffb6d",
              color: "#1d4d3d",
              fontWeight: 700,
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            06 Confirmation
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: "2.6rem" }}>Booking confirmed</h1>
          <p style={{ maxWidth: "560px", margin: "0 auto", color: "#59655c", lineHeight: 1.6, fontSize: "1.05rem" }}>
            Your reservation is confirmed. We have saved your booking details and sent the confirmation to your email.
          </p>

          <div
            style={{
              margin: "32px auto 24px",
              maxWidth: "650px",
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1px",
              background: "#e4e8df",
              border: "1px solid #e4e8df",
              borderRadius: "20px",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            {[
              ["Experience", "Chef's Table Dinner"],
              ["Confirmation number", confirmationNumber],
              ["Date", booking?.experience?.date || "Sat, 12 Sep"],
              ["Time", booking?.experience?.time || "7:30 PM"],
              ["Guests", guestSummary],
              ["Location", locationName],
              ["Payment", paymentMethod],
              ["Amount paid", formatPrice(total)],
            ].map(([label, value]) => (
              <div key={label} style={{ background: "#fbfcf9", padding: "16px 18px" }}>
                <div style={{ color: "#718076", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "7px" }}>
                  {label}
                </div>
                <strong style={{ color: "#26352b" }}>{value}</strong>
              </div>
            ))}
          </div>

          <div
            style={{
              maxWidth: "650px",
              margin: "0 auto 28px",
              padding: "16px 18px",
              borderRadius: "16px",
              background: "#f4f8ed",
              color: "#46614c",
              lineHeight: 1.5,
              textAlign: "left",
            }}
          >
            Please arrive 15 minutes before your selected time. Keep your confirmation number available when you arrive.
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/date-time")}
              style={{
                border: "1px solid #0d5a49",
                background: "transparent",
                color: "#0d5a49",
                padding: "15px 24px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Book another experience
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              style={{
                border: "none",
                background: "linear-gradient(135deg, #0d5a49 0%, #0f7b5f 100%)",
                color: "#fff",
                padding: "15px 24px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Print confirmation
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ConfirmationPage;
