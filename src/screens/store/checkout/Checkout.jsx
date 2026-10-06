import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';
import { FiChevronLeft, FiCreditCard } from 'react-icons/fi';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, storeName } = location.state || { cartItems: [], storeName: 'Store' };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceStr = item.price.replace(/[^0-9.]/g, '');
      const price = parseFloat(priceStr) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const total = calculateTotal();

  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <button className="back-to-store-btn" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <button className="checkout-back-btn" onClick={() => navigate(-1)}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className="checkout-title">Checkout</h1>
      </div>

      <div className="checkout-content">
        <div className="checkout-store-name">Order from {storeName}</div>
        
        <div className="checkout-items">
          {cartItems.map((item, idx) => (
            <div key={idx} className="checkout-item">
              <img src={item.img} alt={item.name} className="checkout-item-img" />
              <div className="checkout-item-details">
                <div className="checkout-item-name">{item.name}</div>
                <div className="checkout-item-qty">Qty: {item.quantity}</div>
              </div>
              <div className="checkout-item-price">
                ₹{ (parseFloat(item.price.replace(/[^0-9.]/g, '')) * item.quantity).toFixed(2) }
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-summary">
          <div className="summary-row">
            <span>Item Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹40.00</span>
          </div>
          <div className="summary-row">
            <span>Taxes & Charges</span>
            <span>₹{(total * 0.05).toFixed(2)}</span>
          </div>
          <hr className="summary-divider" />
          <div className="summary-row grand-total">
            <span>To Pay</span>
            <span>₹{(total + 40 + (total * 0.05)).toFixed(2)}</span>
          </div>
        </div>

        <button className="place-order-btn" onClick={() => {
          navigate('/payment', { 
            state: { 
              isStoreOrder: true,
              storeName: storeName,
              cartItems: cartItems,
              amount: (total + 40 + (total * 0.05)).toFixed(2) 
            } 
          });
        }}>
          <FiCreditCard size={20} /> Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
