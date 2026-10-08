import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingSteps from "../booking/BookingSteps";
import { getCurrentLocationName } from "../../utils/location";

const PAYMENT_METHODS = [
  {
    id: "gpay",
    label: "Google Pay",
    type: "upi-app",
    icon: "GPay",
    brandColor: "#1a73e8",
    bgLight: "#e8f0fe",
    subtext: "Fast UPI checkout",
    defaultHandle: "@oksbi",
  },
  {
    id: "phonepe",
    label: "PhonePe",
    type: "upi-app",
    icon: "PhonePe",
    brandColor: "#5f259f",
    bgLight: "#f3e8ff",
    subtext: "Pay via PhonePe UPI",
    defaultHandle: "@ybl",
  },
  {
    id: "paytm",
    label: "Paytm UPI",
    type: "upi-app",
    icon: "Paytm",
    brandColor: "#00b9f5",
    bgLight: "#e0f7fe",
    subtext: "Paytm UPI & Wallet",
    defaultHandle: "@paytm",
  },
  {
    id: "upi-qr",
    label: "Scan UPI QR",
    type: "upi-qr",
    icon: "QR / UPI",
    brandColor: "#059669",
    bgLight: "#ecfdf5",
    subtext: "Any UPI app (BHIM, Cred)",
  },
  {
    id: "card",
    label: "Cards",
    type: "card",
    icon: "Debit / Credit",
    brandColor: "#1e293b",
    bgLight: "#f1f5f9",
    subtext: "Visa, Mastercard, RuPay",
  },
  {
    id: "netbanking",
    label: "Net Banking",
    type: "netbanking",
    icon: "NetBanking",
    brandColor: "#d97706",
    bgLight: "#fef3c7",
    subtext: "All major Indian banks",
  },
  {
    id: "cod",
    label: "Pay at Venue",
    type: "offline",
    icon: "Pay Later",
    brandColor: "#475569",
    bgLight: "#f8fafc",
    subtext: "Cash / UPI on arrival",
  },
];

const POPULAR_BANKS = [
  { id: "sbi", name: "State Bank of India", code: "SBI" },
  { id: "hdfc", name: "HDFC Bank", code: "HDFC" },
  { id: "icici", name: "ICICI Bank", code: "ICICI" },
  { id: "axis", name: "Axis Bank", code: "AXIS" },
  { id: "kotak", name: "Kotak Mahindra", code: "KOTAK" },
];

const EXPIRY_MONTHS = [
  "01", "02", "03", "04", "05", "06",
  "07", "08", "09", "10", "11", "12",
];
const EXPIRY_YEARS = Array.from({ length: 15 }, (_, i) => String(new Date().getFullYear() + i).slice(-2));

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedMethodId, setSelectedMethodId] = useState("gpay");
  const [upiId, setUpiId] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [selectedBank, setSelectedBank] = useState("sbi");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiryMonth, setCardExpiryMonth] = useState("12");
  const [cardExpiryYear, setCardExpiryYear] = useState("28");
  const [cardCvv, setCardCvv] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper to clear error when user types
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Extract booking details from location state or fallback
  const bookingData = location.state?.booking;
  const experience = bookingData?.experience || location.state?.experience || {
    title: "Chennai Sports & Experience",
    name: "Chennai Sports & Experience",
    date: location.state?.bookingDate || "Today",
    time: location.state?.bookingTime || "06:00 PM",
    location: "Chennai",
    priceNum: 450,
  };

  const guests = bookingData?.guests || location.state?.guests || { adult: 2, child: 0, infant: 0 };
  const guestSummary = bookingData?.guestSummary || "2 Adults";
  const rawSubtotal = bookingData?.priceDetails?.subtotal ?? 900;
  const rawTaxes = bookingData?.priceDetails?.taxesAndFees ?? Math.round(rawSubtotal * 0.08);
  const totalAmount = bookingData?.priceDetails?.total ?? (rawSubtotal + rawTaxes);

  const bookingLocation = experience?.location || "Chennai";
  const [locationName, setLocationName] = useState(bookingLocation);

  const formatPrice = (amt) => `₹${Number(amt || 0).toLocaleString("en-IN")}`;

  useEffect(() => {
    let isMounted = true;
    async function loadLocation() {
      try {
        const fetched = await getCurrentLocationName(bookingLocation);
        if (isMounted && fetched) setLocationName(fetched);
      } catch {
        if (isMounted) setLocationName(bookingLocation);
      }
    }
    loadLocation();
    return () => {
      isMounted = false;
    };
  }, [bookingLocation]);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethodId) || PAYMENT_METHODS[0];

  const handleCompletePayment = () => {
    const validationErrors = {};

    // 1. Validate UPI fields if UPI app is selected without QR mode
    if (["gpay", "phonepe", "paytm"].includes(selectedMethodId) && !showQrCode) {
      const trimmedUpi = upiId.trim();
      if (!trimmedUpi) {
        validationErrors.upiId = `Please enter your ${selectedMethod.label} UPI ID (e.g. yourname${selectedMethod.defaultHandle || "@upi"})`;
      } else if (!trimmedUpi.includes("@") || trimmedUpi.length < 4) {
        validationErrors.upiId = `Please enter a valid UPI ID with '@' (e.g. yourname${selectedMethod.defaultHandle || "@oksbi"})`;
      }
    }

    // 2. Validate Card fields if card payment is selected
    if (selectedMethodId === "card") {
      if (!cardholderName.trim()) {
        validationErrors.cardholderName = "Please enter cardholder name";
      }
      const cleanCard = cardNumber.replace(/\s/g, "");
      if (!cleanCard || cleanCard.length < 15) {
        validationErrors.cardNumber = "Please enter a valid 16-digit card number";
      }
      if (!cardCvv || cardCvv.length < 3) {
        validationErrors.cardCvv = "Please enter 3 or 4 digit CVV";
      }
    }

    // 3. Validate Email for confirmation
    const trimmedEmail = billingEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail) {
      validationErrors.billingEmail = "Email is required to send your booking confirmation & ticket";
    } else if (!emailRegex.test(trimmedEmail)) {
      validationErrors.billingEmail = "Please enter a valid email address (e.g. name@example.com)";
    }

    // 4. Validate Phone for SMS confirmation
    const cleanPhone = billingPhone.trim().replace(/[\s-+]/g, "");
    if (!cleanPhone) {
      validationErrors.billingPhone = "Mobile number is required for SMS confirmation and slot alerts";
    } else if (cleanPhone.length < 10) {
      validationErrors.billingPhone = "Please enter a valid 10-digit mobile number";
    }

    // If there are validation errors, block booking and highlight fields
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsProcessing(true);

    const bookingPayload = {
      experience: {
        title: experience.title || experience.name || "Sports Booking",
        name: experience.title || experience.name || "Sports Booking",
        date: bookingData?.bookingDate || experience.date || "Today",
        time: bookingData?.bookingTime || experience.time || "06:00 PM",
        location: locationName || "Chennai",
        image: experience.image,
      },
      guests,
      guestSummary,
      priceDetails: {
        subtotal: rawSubtotal,
        taxesAndFees: rawTaxes,
        total: totalAmount,
      },
      paymentMethod: selectedMethod.label,
      upiId: selectedMethod.type === "upi-app" ? upiId || `user${selectedMethod.defaultHandle || "@upi"}` : undefined,
      contact: {
        email: trimmedEmail,
        phone: billingPhone.trim(),
      },
    };

    setTimeout(() => {
      setIsProcessing(false);
      navigate("/confirmation", {
        state: {
          paymentMethod: selectedMethod.label,
          booking: bookingPayload,
        },
      });
    }, 800);
  };

  const handleBackToGuests = () => {
    navigate("/guestcount", {
      state: {
        experience,
        guests,
        bookingDate: bookingData?.bookingDate || experience.date,
        bookingTime: bookingData?.bookingTime || experience.time,
      },
    });
  };

  return (
    <main className="payment-page" style={{ minHeight: "100vh", background: "#f5f6f8", padding: "28px 24px 64px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#111827" }}>
      <div style={{ maxWidth: "1240px", margin: "0 auto", display: "grid", gridTemplateColumns: "300px 1fr", gap: "28px", alignItems: "start" }}>
        
        {/* Left Column: Booking Steps & Summary Card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Booking Steps Indicator with 5 Steps */}
          <BookingSteps currentStep={4} />

          {/* Booking Overview Card */}
          <aside style={{ background: "#ffffff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "22px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "20px" }}>🏟️</span>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.5px" }}>Selected Experience</span>
                <h3 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>
                  {experience.title || experience.name || "Sports Arena Booking"}
                </h3>
              </div>
            </div>

            <div style={{ display: "grid", gap: "10px", fontSize: "13px", padding: "14px 0", borderTop: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9", color: "#475569" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Date</span>
                <strong>{bookingData?.bookingDate || experience.date || "Today"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Time</span>
                <strong>{bookingData?.bookingTime || experience.time || "06:00 PM"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Guests / Slots</span>
                <strong>{guestSummary}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Location</span>
                <strong>{locationName}</strong>
              </div>
            </div>

            {/* Price Details */}
            <div style={{ marginTop: "14px", display: "grid", gap: "8px", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Subtotal</span>
                <strong>{formatPrice(rawSubtotal)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Taxes &amp; Service Fee</span>
                <strong>{formatPrice(rawTaxes)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800, color: "#059669", paddingTop: "8px", borderTop: "1px dashed #cbd5e1" }}>
                <span>Total Amount</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Right Column: Interactive Online Payment Section */}
        <section style={{ background: "#ffffff", borderRadius: "24px", border: "1px solid #e2e8f0", padding: "32px 36px", boxShadow: "0 8px 24px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "22px", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <div style={{ display: "inline-block", background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 800, marginBottom: "8px", letterSpacing: "0.3px" }}>
                04 PAYMENT
              </div>
              <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Choose Online Payment Method
              </h1>
              <p style={{ margin: "4px 0 0", color: "#64748b", fontSize: "14px" }}>
                100% Safe &amp; Encrypted Payments via UPI, Cards, and Net Banking.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "6px 12px", borderRadius: "10px", fontSize: "12px", fontWeight: 600, color: "#059669" }}>
              <span>🔒 256-Bit SSL Encrypted</span>
            </div>
          </div>

          {/* Payment Method Selector Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginBottom: "26px" }}>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethodId === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setSelectedMethodId(method.id);
                    setShowQrCode(false);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "12px 10px",
                    borderRadius: "14px",
                    border: isSelected ? `2px solid ${method.brandColor}` : "1.5px solid #e2e8f0",
                    background: isSelected ? method.bgLight : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    textAlign: "center",
                    boxShadow: isSelected ? `0 4px 12px ${method.brandColor}22` : "none",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 800, color: method.brandColor }}>
                    {method.icon}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: isSelected ? 800 : 600, color: "#0f172a" }}>
                    {method.label}
                  </span>
                  <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                    {method.subtext}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Payment Method Details & Fields */}
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "18px", padding: "24px", marginBottom: "26px" }}>
            
            {/* GOOGLE PAY (GPay) */}
            {selectedMethodId === "gpay" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#1a73e8", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "14px" }}>
                      G
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Google Pay UPI</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Enter UPI ID or click to pay instantly with Google Pay</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: 700, color: "#1a73e8", cursor: "pointer" }}
                  >
                    {showQrCode ? "Enter UPI ID" : "Show GPay QR Code"}
                  </button>
                </div>

                {showQrCode ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ width: "180px", height: "180px", margin: "0 auto 12px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "2px dashed #1a73e8", display: "grid", placeItems: "center" }}>
                      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                        <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                        <rect x="10" y="10" width="25" height="25" fill="#1a73e8" />
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="18" y="18" width="9" height="9" fill="#1a73e8" />
                        <rect x="65" y="10" width="25" height="25" fill="#1a73e8" />
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="73" y="18" width="9" height="9" fill="#1a73e8" />
                        <rect x="10" y="65" width="25" height="25" fill="#1a73e8" />
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                        <rect x="18" y="73" width="9" height="9" fill="#1a73e8" />
                        <circle cx="50" cy="50" r="12" fill="#1a73e8" />
                        <text x="50" y="55" fontSize="12" fill="#ffffff" textAnchor="middle" fontWeight="bold">GPay</text>
                      </svg>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Scan using Google Pay App</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>UPI ID: cityspace.pay@oksbi</p>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                      Google Pay UPI ID (e.g. mobile@oksbi, yourname@okaxis) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          clearError("upiId");
                        }}
                        placeholder="yourname@oksbi"
                        style={{
                          flex: 1,
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: errors.upiId ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                          background: errors.upiId ? "#fef2f2" : "#ffffff",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUpiId("shibi.cityspace@oksbi");
                          clearError("upiId");
                        }}
                        style={{ background: "#e8f0fe", border: "1px solid #bfdbfe", color: "#1a73e8", fontWeight: 700, fontSize: "12.5px", padding: "0 14px", borderRadius: "10px", cursor: "pointer" }}
                      >
                        Auto-Fill
                      </button>
                    </div>
                    {errors.upiId && (
                      <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "6px" }}>
                        ⚠️ {errors.upiId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PHONEPE */}
            {selectedMethodId === "phonepe" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#5f259f", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "14px" }}>
                      पे
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>PhonePe UPI</h4>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Pay directly via PhonePe mobile number or VPA</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQrCode(!showQrCode)}
                    style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "6px 12px", fontSize: "12px", fontWeight: 700, color: "#5f259f", cursor: "pointer" }}
                  >
                    {showQrCode ? "Enter UPI ID" : "Show PhonePe QR"}
                  </button>
                </div>

                {showQrCode ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ width: "180px", height: "180px", margin: "0 auto 12px", background: "#ffffff", padding: "12px", borderRadius: "12px", border: "2px dashed #5f259f", display: "grid", placeItems: "center" }}>
                      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                        <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                        <rect x="10" y="10" width="25" height="25" fill="#5f259f" />
                        <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="18" y="18" width="9" height="9" fill="#5f259f" />
                        <rect x="65" y="10" width="25" height="25" fill="#5f259f" />
                        <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                        <rect x="73" y="18" width="9" height="9" fill="#5f259f" />
                        <rect x="10" y="65" width="25" height="25" fill="#5f259f" />
                        <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                        <rect x="18" y="73" width="9" height="9" fill="#5f259f" />
                        <circle cx="50" cy="50" r="14" fill="#5f259f" />
                        <text x="50" y="55" fontSize="10" fill="#ffffff" textAnchor="middle" fontWeight="bold">PhonePe</text>
                      </svg>
                    </div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>Scan with PhonePe App</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>UPI ID: cityspace@ybl</p>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                      PhonePe UPI ID (e.g. 9876543210@ybl, yourname@ibl) <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => {
                          setUpiId(e.target.value);
                          clearError("upiId");
                        }}
                        placeholder="9876543210@ybl"
                        style={{
                          flex: 1,
                          padding: "12px 14px",
                          borderRadius: "10px",
                          border: errors.upiId ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                          background: errors.upiId ? "#fef2f2" : "#ffffff",
                          fontSize: "14px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUpiId("9840123456@ybl");
                          clearError("upiId");
                        }}
                        style={{ background: "#f3e8ff", border: "1px solid #d8b4fe", color: "#5f259f", fontWeight: 700, fontSize: "12.5px", padding: "0 14px", borderRadius: "10px", cursor: "pointer" }}
                      >
                        Auto-Fill
                      </button>
                    </div>
                    {errors.upiId && (
                      <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "6px" }}>
                        ⚠️ {errors.upiId}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* PAYTM UPI */}
            {selectedMethodId === "paytm" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#002e6e", color: "#00b9f5", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "11px" }}>
                    Paytm
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Paytm UPI &amp; Wallet</h4>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Pay using Paytm UPI Handle or Linked Bank Account</p>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                    Paytm UPI ID (e.g. mobile@paytm) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => {
                        setUpiId(e.target.value);
                        clearError("upiId");
                      }}
                      placeholder="mobile@paytm"
                      style={{
                        flex: 1,
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: errors.upiId ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                        background: errors.upiId ? "#fef2f2" : "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUpiId("9840123456@paytm");
                        clearError("upiId");
                      }}
                      style={{ background: "#e0f7fe", border: "1px solid #7dd3fc", color: "#0284c7", fontWeight: 700, fontSize: "12.5px", padding: "0 14px", borderRadius: "10px", cursor: "pointer" }}
                    >
                      Auto-Fill
                    </button>
                  </div>
                  {errors.upiId && (
                    <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "6px" }}>
                      ⚠️ {errors.upiId}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* GENERIC UPI / QR CODE */}
            {selectedMethodId === "upi-qr" && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <h4 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: 800, color: "#0f172a" }}>Scan Dynamic UPI QR Code</h4>
                <p style={{ margin: "0 0 16px", fontSize: "12.5px", color: "#64748b" }}>Open any UPI App (GPay, PhonePe, Paytm, BHIM, Cred) and scan below</p>
                <div style={{ width: "190px", height: "190px", margin: "0 auto 14px", background: "#ffffff", padding: "14px", borderRadius: "14px", border: "2px dashed #059669", display: "grid", placeItems: "center" }}>
                  <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
                    <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                    <rect x="10" y="10" width="25" height="25" fill="#059669" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#059669" />
                    <rect x="65" y="10" width="25" height="25" fill="#059669" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#059669" />
                    <rect x="10" y="65" width="25" height="25" fill="#059669" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#059669" />
                    <circle cx="50" cy="50" r="10" fill="#059669" />
                    <text x="50" y="54" fontSize="9" fill="#ffffff" textAnchor="middle" fontWeight="bold">UPI</text>
                  </svg>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", color: "#065f46", fontWeight: 700 }}>
                  <span>⚡ Instant Payment Verification</span>
                </div>
              </div>
            )}

            {/* CARDS (DEBIT / CREDIT) */}
            {selectedMethodId === "card" && (
              <div style={{ display: "grid", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                    Cardholder Name <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => {
                      setCardholderName(e.target.value);
                      clearError("cardholderName");
                    }}
                    placeholder="Full Name as on card"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: errors.cardholderName ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                      background: errors.cardholderName ? "#fef2f2" : "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.cardholderName && (
                    <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                      ⚠️ {errors.cardholderName}
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                    Card Number <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                      setCardNumber(val);
                      clearError("cardNumber");
                    }}
                    placeholder="4111 2222 3333 4444"
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: errors.cardNumber ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                      background: errors.cardNumber ? "#fef2f2" : "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {errors.cardNumber && (
                    <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                      ⚠️ {errors.cardNumber}
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>Expiry (MM / YY)</label>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <select
                        value={cardExpiryMonth}
                        onChange={(e) => setCardExpiryMonth(e.target.value)}
                        style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                      >
                        {EXPIRY_MONTHS.map((m) => (<option key={m} value={m}>{m}</option>))}
                      </select>
                      <select
                        value={cardExpiryYear}
                        onChange={(e) => setCardExpiryYear(e.target.value)}
                        style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1.5px solid #cbd5e1", fontSize: "13.5px" }}
                      >
                        {EXPIRY_YEARS.map((y) => (<option key={y} value={y}>{y}</option>))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px", color: "#334155" }}>
                      CVV <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value.replace(/\D/g, ""));
                        clearError("cardCvv");
                      }}
                      placeholder="•••"
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "10px",
                        border: errors.cardCvv ? "2px solid #ef4444" : "1.5px solid #cbd5e1",
                        background: errors.cardCvv ? "#fef2f2" : "#ffffff",
                        fontSize: "14px",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                    />
                    {errors.cardCvv && (
                      <span style={{ color: "#dc2626", fontSize: "12.5px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                        ⚠️ {errors.cardCvv}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* NET BANKING */}
            {selectedMethodId === "netbanking" && (
              <div>
                <h4 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: 800, color: "#0f172a" }}>Select Your Bank</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
                  {POPULAR_BANKS.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBank(b.id)}
                      style={{
                        padding: "12px 10px",
                        borderRadius: "10px",
                        border: selectedBank === b.id ? "2px solid #059669" : "1.5px solid #cbd5e1",
                        background: selectedBank === b.id ? "#ecfdf5" : "#ffffff",
                        fontWeight: 700,
                        fontSize: "12.5px",
                        cursor: "pointer",
                        color: selectedBank === b.id ? "#065f46" : "#334155",
                      }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PAY AT VENUE */}
            {selectedMethodId === "cod" && (
              <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #cbd5e1" }}>
                <strong style={{ fontSize: "14.5px", color: "#0f172a" }}>💵 Pay upon arrival at the venue</strong>
                <p style={{ margin: "6px 0 0", fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>
                  You can pay <strong>{formatPrice(totalAmount)}</strong> directly at the counter via Cash, Google Pay, PhonePe, or Cards when you check in.
                </p>
              </div>
            )}

            {/* Billing Contact details */}
            <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid #e2e8f0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px", color: "#475569" }}>
                  Send Confirmation To (Email) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => {
                    setBillingEmail(e.target.value);
                    clearError("billingEmail");
                  }}
                  placeholder="user@example.com"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: errors.billingEmail ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: errors.billingEmail ? "#fef2f2" : "#ffffff",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.billingEmail && (
                  <span style={{ color: "#dc2626", fontSize: "12px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                    ⚠️ {errors.billingEmail}
                  </span>
                )}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px", color: "#475569" }}>
                  Mobile (SMS confirmation) <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="tel"
                  value={billingPhone}
                  onChange={(e) => {
                    setBillingPhone(e.target.value);
                    clearError("billingPhone");
                  }}
                  placeholder="+91 98765 43210"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: errors.billingPhone ? "2px solid #ef4444" : "1px solid #cbd5e1",
                    background: errors.billingPhone ? "#fef2f2" : "#ffffff",
                    fontSize: "13px",
                    boxSizing: "border-box",
                  }}
                />
                {errors.billingPhone && (
                  <span style={{ color: "#dc2626", fontSize: "12px", fontWeight: 600, display: "block", marginTop: "4px" }}>
                    ⚠️ {errors.billingPhone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Validation summary alert banner if any error exists */}
          {Object.keys(errors).length > 0 && (
            <div
              style={{
                background: "#fef2f2",
                border: "1.5px solid #fecaca",
                borderRadius: "14px",
                padding: "14px 18px",
                color: "#991b1b",
                fontSize: "13.5px",
                fontWeight: 600,
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "18px" }}>⚠️</span>
              <div>
                <strong>Please complete all required fields above:</strong>
                <div style={{ fontSize: "12.5px", color: "#b91c1c", marginTop: "2px" }}>
                  Enter your {selectedMethod.label} details, Email, and Mobile number before placing your booking.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleBackToGuests}
              style={{
                padding: "14px 28px",
                borderRadius: "30px",
                border: "1.5px solid #cbd5e1",
                background: "#ffffff",
                color: "#334155",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              ← Back to Guests
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleCompletePayment}
              style={{
                flex: 1,
                padding: "14px 28px",
                borderRadius: "30px",
                border: "none",
                background: isProcessing ? "#94a3b8" : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                color: "#ffffff",
                fontSize: "15px",
                fontWeight: 800,
                cursor: isProcessing ? "not-allowed" : "pointer",
                boxShadow: "0 6px 18px rgba(5, 150, 105, 0.28)",
                transition: "all 0.18s ease",
              }}
            >
              {isProcessing
                ? "Processing Payment..."
                : selectedMethodId === "cod"
                ? `Confirm Booking (${formatPrice(totalAmount)})`
                : `Pay ${formatPrice(totalAmount)} with ${selectedMethod.label}`}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
