import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCurrentLocationName } from "../../utils/location";

const paymentMethods = [
  { id: "debit-card", label: "Debit Card", icon: "DC" },
  { id: "credit-card", label: "Credit Card", icon: "CC" },
  { id: "cod", label: "Cash on Delivery", icon: "COD" },
  { id: "upi", label: "UPI", icon: "UPI" },
  { id: "razorpay", label: "Razorpay", icon: "R" },
];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const expiryYears = Array.from({ length: 20 }, (_, index) => new Date().getFullYear() + index);

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState("debit-card");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  const isCardPayment = selectedMethod === "debit-card" || selectedMethod === "credit-card";
  const selectedMethodLabel = paymentMethods.find((method) => method.id === selectedMethod)?.label;
  const booking = location.state?.booking ?? {
    guests: { adult: 2, child: 0, infant: 0 },
    guestSummary: "2 Adults",
    priceDetails: { subtotal: 3000, taxesAndFees: 270, total: 3270 },
    experience: { date: "Sat, 12 Sep", time: "7:30 PM", location: "Nungambakkam" },
  };
  const { priceDetails, guestSummary } = booking;
  const bookingLocation = booking.experience?.location || "Nungambakkam";
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
      className="payment-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6f3ef 0%, #f0efe9 100%)",
        padding: "28px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2a1f"
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          minHeight: "calc(100vh - 56px)",
          display: "grid",
          gridTemplateColumns: "0.95fr 1.35fr",
          gap: "24px",
        }}
      >
        <aside
          style={{
            background: "#ffffff",
            borderRadius: "28px",
            border: "1px solid #e6e0d8",
            boxShadow: "0 12px 32px rgba(20, 24, 20, 0.06)",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 18px",
                background: "#dffb6d",
                borderRadius: "999px",
                color: "#1d4d3d",
                fontWeight: 700,
                fontSize: "13px",
                marginBottom: "18px",
              }}
            >
              05 Payment
            </div>

            <h1 style={{ margin: "0 0 10px", fontSize: "2.3rem" }}>Secure checkout</h1>
            <p style={{ margin: 0, color: "#58635d", lineHeight: 1.6, fontSize: "1.02rem" }}>
              Confirm your reservation and complete the payment for your upcoming experience.
            </p>

            <div
              style={{
                marginTop: "26px",
                background: "linear-gradient(135deg, #f4f0dc 0%, #e9f1e7 100%)",
                borderRadius: "22px",
                padding: "18px",
                border: "1px solid #e2dcce",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
                <div>
                  <div style={{ color: "#58715f", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Experience
                  </div>
                  <h2 style={{ margin: "8px 0 0", fontSize: "1.6rem" }}>Chef&apos;s Table Dinner</h2>
                </div>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #c0dba4 0%, #6ca870 100%)",
                    display: "grid",
                    placeItems: "center",
                    fontSize: "28px",
                  }}
                >
                  🍽️
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px", color: "#2b332d" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Date</span>
                  <strong>{booking.experience.date}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Time</span>
                  <strong>{booking.experience.time}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Guests</span>
                  <strong>{guestSummary}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Location</span>
                  <strong>{locationName}</strong>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "26px",
              background: "#f7f5f1",
              borderRadius: "18px",
              border: "1px solid #ece4d7",
              padding: "18px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#5d6b60" }}>Subtotal</span>
              <strong>{formatPrice(priceDetails.subtotal)}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ color: "#5d6b60" }}>Taxes & fees</span>
              <strong>{formatPrice(priceDetails.taxesAndFees)}</strong>
            </div>
            <div style={{ borderTop: "1px solid #e5ddd1", margin: "14px 0 10px", paddingTop: "14px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <strong style={{ color: "#0d5a49" }}>{formatPrice(priceDetails.total)}</strong>
            </div>
          </div>
        </aside>

        <section
          style={{
            background: "#fff",
            borderRadius: "28px",
            border: "1px solid #e7dfd5",
            boxShadow: "0 12px 32px rgba(20, 24, 20, 0.06)",
            padding: "28px 30px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#87c15d" }} />
            <span style={{ fontWeight: 700, color: "#2a3a2f" }}>Payment details</span>
          </div>

          <div style={{ display: "grid", gap: "18px", marginBottom: "22px" }}>
            {isCardPayment ? (
              <>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Cardholder name</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(event) => setCardholderName(event.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    placeholder="Enter full name"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>{selectedMethodLabel} number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="16"
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value.replace(/\D/g, ""))}
                    placeholder="1234567890123456"
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Expiry month and year</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <select aria-label="Expiry month" defaultValue="" style={inputStyle}>
                        <option value="" disabled>Month</option>
                        {months.map((month, index) => (
                          <option key={month} value={index + 1}>{month}</option>
                        ))}
                      </select>
                      <select aria-label="Expiry year" defaultValue="" style={inputStyle}>
                        <option value="" disabled>Year</option>
                        {expiryYears.map((year) => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>CVV</label>
                    <input type="password" placeholder="123" style={inputStyle} />
                  </div>
                </div>
              </>
            ) : selectedMethod === "cod" ? (
              <div style={{ background: "#f4f8ed", border: "1px solid #d9e8cb", borderRadius: "16px", padding: "18px" }}>
                <strong>Pay when you arrive</strong>
                <p style={{ margin: "8px 0 0", color: "#58635d", lineHeight: 1.5 }}>
                  No online payment is required. Please carry the exact amount of {formatPrice(priceDetails.total)} on the day of your experience.
                </p>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
                  {selectedMethod === "upi" ? "UPI ID" : "Razorpay email or mobile number"}
                </label>
                <input
                  type="text"
                  placeholder={selectedMethod === "upi" ? "example@upi" : "Enter email or mobile number"}
                  style={inputStyle}
                />
              </div>
            )}

            {selectedMethod !== "cod" && (
              <>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Billing email</label>
                  <input type="email" placeholder="you@example.com" style={inputStyle} />
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Billing address</label>
                  <textarea rows="3" placeholder="Street address, city, postal code" style={{ ...inputStyle, resize: "vertical" }} />
                </div>
              </>
            )}
          </div>

          <div
            style={{
              border: "1px solid #e8dfd0",
              borderRadius: "16px",
              background: "#faf8f3",
              padding: "16px 18px",
              marginBottom: "24px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontWeight: 700 }}>Choose payment method</span>
              <span style={{ color: "#66836b", fontSize: "13px" }}>Secure</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: "10px" }}>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  style={{
                    border: selectedMethod === method.id ? "2px solid #0d5a49" : "1px solid #d5d0c7",
                    background: selectedMethod === method.id ? "#e9f6ea" : "#fff",
                    borderRadius: "14px",
                    padding: "12px 10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    color: "#243126",
                  }}
                >
                  <span style={{ display: "block", fontSize: "11px", color: "#0d5a49", marginBottom: "4px" }}>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => navigate("/screen3", { state: { guests: booking.guests } })}
              style={{
                flex: 1,
                border: "1px solid #0d5a49",
                background: "transparent",
                color: "#0d5a49",
                padding: "16px 18px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Back
            </button>

            <button
              type="button"
              onClick={() => navigate("/confirmation", { state: { paymentMethod: selectedMethodLabel, booking } })}
              style={{
                flex: 1.3,
                border: "none",
                background: "linear-gradient(135deg, #0d5a49 0%, #0f7b5f 100%)",
                color: "#fff",
                padding: "16px 18px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 12px 22px rgba(13, 90, 73, 0.18)",
              }}
            >
              {selectedMethod === "cod" ? `Confirm booking · ${formatPrice(priceDetails.total)}` : `Pay with ${selectedMethodLabel} · ${formatPrice(priceDetails.total)}`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #d8d2c8",
  fontSize: "1rem",
  boxSizing: "border-box",
};

export default PaymentPage;
