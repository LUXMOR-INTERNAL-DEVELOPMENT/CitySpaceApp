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

const upiApps = [
  { id: "gpay", label: "Google Pay", short: "GPay" },
  { id: "phonepe", label: "PhonePe", short: "PhonePe" },
  { id: "paytm", label: "Paytm", short: "Paytm" },
  { id: "bhim", label: "BHIM UPI", short: "BHIM" },
  { id: "amazonpay", label: "Amazon Pay", short: "Amazon" },
  { id: "other", label: "Other UPI", short: "Other" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const expiryYears = Array.from({ length: 20 }, (_, index) => new Date().getFullYear() + index);

const initialFormState = {
  cardholderName: "",
  cardNumber: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  email: "",
  address: "",
  upiId: "",
  contact: "",
  selectedUpiApp: "gpay",
  saveCard: false,
  agreeTerms: false,
};

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState("debit-card");
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGpayQr, setShowGpayQr] = useState(false);

  const isCardPayment = selectedMethod === "debit-card" || selectedMethod === "credit-card";
  const selectedMethodLabel = paymentMethods.find((method) => method.id === selectedMethod)?.label ?? "Payment";
  const isMobileDevice =
    typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  const booking = location.state?.booking ?? {
    guests: { adult: 2, child: 0, infant: 0 },
    guestSummary: "2 Adults",
    priceDetails: { subtotal: 3000, taxesAndFees: 270, total: 3270 },
    experience: { date: "Sat, 12 Sep", time: "7:30 PM", location: "Nungambakkam" },
  };

  const { priceDetails, guestSummary } = booking;
  const experience = booking.experience || {};
  const bookingLocation = booking.experience?.location || "Nungambakkam";
  const [locationName, setLocationName] = useState(bookingLocation);
  const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  useEffect(() => {
    if (experience.viewingArea) return;

    let isMounted = true;

    async function loadLocation() {
      const fetchedLocation = await getCurrentLocationName(bookingLocation);
      if (isMounted) setLocationName(fetchedLocation);
    }

    loadLocation();
    return () => {
      isMounted = false;
    };
  }, [bookingLocation, experience.viewingArea]);

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (selectedMethod === "cod") {
      if (!form.agreeTerms) {
        nextErrors.agreeTerms = "Please confirm the checkout terms and booking policy.";
      }
      return nextErrors;
    }

    if (isCardPayment) {
      if (!form.cardholderName.trim()) {
        nextErrors.cardholderName = "Cardholder name is required.";
      }
      if (form.cardNumber.replace(/\s/g, "").length !== 16) {
        nextErrors.cardNumber = "Enter a valid 16-digit card number.";
      }
      if (!form.expiryMonth || !form.expiryYear) {
        nextErrors.expiryMonth = "Select the card expiry date.";
      }
      if (!/^\d{3,4}$/.test(form.cvv)) {
        nextErrors.cvv = "Enter a valid CVV.";
      }
    }

    if (selectedMethod === "upi" && !form.upiId.trim()) {
      nextErrors.upiId = "Please enter your UPI ID.";
    }

    if (selectedMethod === "razorpay" && !form.contact.trim()) {
      nextErrors.contact = "Please enter your email or mobile number.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "A valid billing email is required.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Billing address is required.";
    }

    if (!form.agreeTerms) {
      nextErrors.agreeTerms = "Please accept the booking terms before continuing.";
    }

    return nextErrors;
  };

  const completePayment = () => {
    navigate("/confirmation", {
      state: {
        paymentMethod: selectedMethodLabel,
        booking: {
          ...booking,
          payment: {
            method: selectedMethod,
            amount: priceDetails.total,
            confirmationCode: `CS-${Date.now().toString().slice(-6)}`,
          },
        },
      },
    });
  };

  const gpayRecipient = (form.upiId || "cityspace@upi").trim() || "cityspace@upi";
  const gpayPaymentUrl = `upi://pay?pa=${encodeURIComponent(gpayRecipient)}&pn=${encodeURIComponent("CitySpace")}&am=${Number(priceDetails.total || 0).toFixed(2)}&cu=INR&tn=${encodeURIComponent("CitySpace booking")}`;
  const gpayQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(gpayPaymentUrl)}`;

  const handleSubmit = () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (selectedMethod === "upi" && form.selectedUpiApp === "gpay") {
      if (isMobileDevice) {
        setIsProcessing(true);
        window.location.href = gpayPaymentUrl;
        window.setTimeout(() => {
          setIsProcessing(false);
          completePayment();
        }, 1600);
        return;
      }

      setShowGpayQr(true);
      return;
    }

    setIsProcessing(true);

    window.setTimeout(() => {
      setIsProcessing(false);
      completePayment();
    }, 900);
  };

  const isFormValid = () => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <main
      className="payment-page"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8f5ef 0%, #efece5 100%)",
        padding: "28px",
        fontFamily: "Arial, sans-serif",
        color: "#1f2a1f",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          minHeight: "calc(100vh - 56px)",
          display: "grid",
          gridTemplateColumns: "0.92fr 1.35fr",
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
                  <h2 style={{ margin: "8px 0 0", fontSize: "1.6rem" }}>
                    {experience.title || experience.name || "Experience booking"}
                  </h2>
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
                  {experience.viewingArea ? "🎟️" : "🍽️"}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px", color: "#2b332d" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Date</span>
                  <strong>{experience.date || "Date not listed by organizer"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Time</span>
                  <strong>{experience.time || "Time not listed by organizer"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#5d6b60" }}>Guests</span>
                  <strong>{guestSummary}</strong>
                </div>
                {experience.viewingArea && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#5d6b60" }}>Viewing area</span>
                    <strong>{experience.viewingArea}</strong>
                  </div>
                )}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#87c15d" }} />
              <span style={{ fontWeight: 700, color: "#2a3a2f" }}>Payment details</span>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "#edf7ee",
                color: "#1c5b43",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <span>🔒</span> Secure checkout
            </div>
          </div>

          <div style={{ display: "grid", gap: "18px", marginBottom: "22px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))",
                gap: "10px",
                background: "#faf8f3",
                border: "1px solid #e8dfd0",
                borderRadius: "16px",
                padding: "16px 18px",
              }}
            >
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
                    transition: "all 0.2s ease",
                  }}
                >
                  <span style={{ display: "block", fontSize: "11px", color: "#0d5a49", marginBottom: "4px" }}>{method.icon}</span>
                  {method.label}
                </button>
              ))}
            </div>

            {isCardPayment ? (
              <>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Cardholder name</label>
                  <input
                    type="text"
                    value={form.cardholderName}
                    onChange={(event) => updateField("cardholderName", event.target.value.replace(/[^a-zA-Z\s]/g, ""))}
                    placeholder="Enter full name"
                    style={getInputStyle(Boolean(errors.cardholderName))}
                  />
                  {errors.cardholderName && <span style={errorStyle}>{errors.cardholderName}</span>}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>{selectedMethodLabel} number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="16"
                    value={form.cardNumber}
                    onChange={(event) => updateField("cardNumber", event.target.value.replace(/\D/g, ""))}
                    placeholder="1234567890123456"
                    style={getInputStyle(Boolean(errors.cardNumber))}
                  />
                  {errors.cardNumber && <span style={errorStyle}>{errors.cardNumber}</span>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Expiry date</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <select
                        aria-label="Expiry month"
                        value={form.expiryMonth}
                        onChange={(event) => updateField("expiryMonth", event.target.value)}
                        style={getInputStyle(Boolean(errors.expiryMonth))}
                      >
                        <option value="">Month</option>
                        {months.map((month, index) => (
                          <option key={month} value={String(index + 1).padStart(2, "0")}>
                            {month}
                          </option>
                        ))}
                      </select>
                      <select
                        aria-label="Expiry year"
                        value={form.expiryYear}
                        onChange={(event) => updateField("expiryYear", event.target.value)}
                        style={getInputStyle(Boolean(errors.expiryMonth))}
                      >
                        <option value="">Year</option>
                        {expiryYears.map((year) => (
                          <option key={year} value={String(year)}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    {errors.expiryMonth && <span style={errorStyle}>{errors.expiryMonth}</span>}
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>CVV</label>
                    <input
                      type="password"
                      value={form.cvv}
                      maxLength="4"
                      onChange={(event) => updateField("cvv", event.target.value.replace(/\D/g, ""))}
                      placeholder="123"
                      style={getInputStyle(Boolean(errors.cvv))}
                    />
                    {errors.cvv && <span style={errorStyle}>{errors.cvv}</span>}
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
                {selectedMethod === "upi" && (
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ marginBottom: "10px", fontWeight: 700 }}>Choose UPI app</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "10px" }}>
                      {upiApps.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => updateField("selectedUpiApp", app.id)}
                          style={{
                            border: form.selectedUpiApp === app.id ? "2px solid #0d5a49" : "1px solid #d5d0c7",
                            background: form.selectedUpiApp === app.id ? "#e9f6ea" : "#fff",
                            borderRadius: "12px",
                            padding: "10px 8px",
                            fontWeight: 700,
                            cursor: "pointer",
                            color: "#243126",
                          }}
                        >
                          <span style={{ display: "block", fontSize: "10px", color: "#0d5a49", marginBottom: "4px" }}>
                            {app.short}
                          </span>
                          {app.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>
                  {selectedMethod === "upi" ? `UPI ID for ${upiApps.find((app) => app.id === form.selectedUpiApp)?.label || "Google Pay"}` : "Razorpay email or mobile number"}
                </label>
                <input
                  type="text"
                  value={selectedMethod === "upi" ? form.upiId : form.contact}
                  onChange={(event) =>
                    updateField(selectedMethod === "upi" ? "upiId" : "contact", event.target.value)
                  }
                  placeholder={selectedMethod === "upi" ? "yourname@upi or mobile number" : "Enter email or mobile number"}
                  style={getInputStyle(Boolean(errors.upiId || errors.contact))}
                />
                {(errors.upiId || errors.contact) && (
                  <span style={errorStyle}>{errors.upiId || errors.contact}</span>
                )}

                {selectedMethod === "upi" && form.selectedUpiApp === "gpay" && (
                  <div style={{ marginTop: "16px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      onClick={() => {
                        if (isMobileDevice) {
                          window.location.href = gpayPaymentUrl;
                        } else {
                          window.open("https://pay.google.com/intl/en_in/about/", "_blank", "noopener,noreferrer");
                        }
                      }}
                      style={{
                        border: "none",
                        background: "#0d5a49",
                        color: "#fff",
                        padding: "10px 14px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {isMobileDevice ? "Open GPay" : "Open GPay Web"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowGpayQr(true)}
                      style={{
                        border: "1px solid #0d5a49",
                        background: "transparent",
                        color: "#0d5a49",
                        padding: "10px 14px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Show QR code
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedMethod === "upi" && form.selectedUpiApp === "gpay" && showGpayQr && (
              <div
                style={{
                  background: "#f9faf7",
                  border: "1px solid #dfe8dd",
                  borderRadius: "18px",
                  padding: "18px",
                  display: "grid",
                  placeItems: "center",
                  gap: "12px",
                }}
              >
                <div style={{ fontWeight: 700, color: "#163d32" }}>Scan to pay {formatPrice(priceDetails.total)}</div>
                <img
                  src={gpayQrCodeUrl}
                  alt="Google Pay QR code"
                  style={{ width: "220px", height: "220px", borderRadius: "12px", background: "#fff", padding: "8px" }}
                />
                <div style={{ color: "#58635d", textAlign: "center", fontSize: "14px" }}>
                  Use any UPI app to scan this QR and complete the payment.
                </div>
                <button
                  type="button"
                  onClick={completePayment}
                  style={{
                    border: "none",
                    background: "linear-gradient(135deg, #0d5a49 0%, #0f7b5f 100%)",
                    color: "#fff",
                    padding: "12px 18px",
                    borderRadius: "999px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  I have paid
                </button>
              </div>
            )}

            {selectedMethod !== "cod" && (
              <>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Billing email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@example.com"
                    style={getInputStyle(Boolean(errors.email))}
                  />
                  {errors.email && <span style={errorStyle}>{errors.email}</span>}
                </div>

                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}>Billing address</label>
                  <textarea
                    rows="3"
                    value={form.address}
                    onChange={(event) => updateField("address", event.target.value)}
                    placeholder="Street address, city, postal code"
                    style={{ ...getInputStyle(Boolean(errors.address)), resize: "vertical" }}
                  />
                  {errors.address && <span style={errorStyle}>{errors.address}</span>}
                </div>
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "12px 0 4px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2d3d35", fontWeight: 600, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.saveCard}
                  onChange={(event) => updateField("saveCard", event.target.checked)}
                  style={{ accentColor: "#0d5a49", width: "16px", height: "16px" }}
                />
                Save this payment method for later
              </label>
            </div>

            <div
              style={{
                background: "#f5f7f3",
                border: "1px solid #dfe8dd",
                borderRadius: "14px",
                padding: "14px 16px",
                marginTop: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div style={{ fontWeight: 700 }}>Confirmation & policy</div>
                <div style={{ color: "#5d6b60", fontSize: "12px" }}>Free cancellation</div>
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "12px", cursor: "pointer", color: "#2f3b34", lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(event) => updateField("agreeTerms", event.target.checked)}
                  style={{ accentColor: "#0d5a49", width: "16px", height: "16px", marginTop: "3px" }}
                />
                I agree to the booking terms, cancellation policy, and payment authorization for this reservation.
              </label>
              {errors.agreeTerms && <span style={errorStyle}>{errors.agreeTerms}</span>}
            </div>
          </div>

          <div style={{ marginTop: "auto", display: "flex", gap: "12px" }}>
            <button
              type="button"
              onClick={() => {
                if (experience.ticketAreaId && experience.id) {
                  navigate(`/events/${experience.id}/book`, {
                    state: {
                      experience,
                      selectedAreaId: experience.ticketAreaId,
                      ticketQuantity: booking.ticketQuantity || booking.guests?.adult,
                    },
                  });
                } else {
                  navigate("/screen3", { state: { guests: booking.guests } });
                }
              }}
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
              onClick={handleSubmit}
              disabled={isProcessing}
              style={{
                flex: 1.3,
                border: "none",
                background: isProcessing ? "#7da89f" : "linear-gradient(135deg, #0d5a49 0%, #0f7b5f 100%)",
                color: "#fff",
                padding: "16px 18px",
                borderRadius: "999px",
                fontWeight: 700,
                cursor: isProcessing ? "not-allowed" : "pointer",
                boxShadow: "0 12px 22px rgba(13, 90, 73, 0.18)",
                opacity: isFormValid() || isProcessing ? 1 : 0.9,
              }}
            >
              {isProcessing
                ? "Processing..."
                : selectedMethod === "cod"
                  ? `Confirm booking · ${formatPrice(priceDetails.total)}`
                  : `Pay with ${selectedMethodLabel} · ${formatPrice(priceDetails.total)}`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

const getInputStyle = (hasError = false) => ({
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: `1px solid ${hasError ? "#c94f4f" : "#d8d2c8"}`,
  background: hasError ? "#fff7f7" : "#fff",
  fontSize: "1rem",
  boxSizing: "border-box",
  color: "#1d2b24",
  outline: "none",
});

const errorStyle = {
  display: "block",
  marginTop: "8px",
  color: "#b42727",
  fontSize: "12px",
  fontWeight: 600,
};

export default PaymentPage;
