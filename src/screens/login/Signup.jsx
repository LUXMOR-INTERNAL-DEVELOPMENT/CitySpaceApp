import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import initialDb from '../../data/db.json';
import './Signup.css';

const mainBanner = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80';

const SIGNUP_API_URL = import.meta.env.VITE_SIGNUP_API_URL || 'http://localhost:5000/api/signup';
const STORAGE_KEY = 'app_db_users';

const saveToLocalDb = (userData) => {
  let users = initialDb?.users || [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      users = JSON.parse(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch (err) {
    console.error('Error accessing localStorage:', err);
  }

  const { fullName, email, mobile, password, role = 'user', provider = 'local' } = userData;
  const lowerEmail = email?.toLowerCase().trim();

  if (provider === 'google') {
    let existingUser = users.find((u) => u.email?.toLowerCase() === lowerEmail);
    if (!existingUser) {
      existingUser = {
        id: Date.now().toString(),
        fullName: fullName || email.split('@')[0],
        email: lowerEmail,
        mobile: mobile || '',
        role,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      users.push(existingUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    const cleanUser = { ...existingUser };
    delete cleanUser.password;
    return { success: true, message: 'Google account connected successfully!', user: cleanUser };
  }

  const emailMatch = users.find((u) => u.email?.toLowerCase() === lowerEmail);
  if (emailMatch) {
    return { success: false, message: 'User with this email already exists.' };
  }

  if (mobile) {
    const mobileMatch = users.find((u) => u.mobile === mobile.trim());
    if (mobileMatch) {
      return { success: false, message: 'User with this mobile number already exists.' };
    }
  }

  const newUser = {
    id: Date.now().toString(),
    fullName: fullName ? fullName.trim() : '',
    email: lowerEmail,
    mobile: mobile ? mobile.trim() : '',
    password,
    role,
    provider: 'local',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));

  const cleanUser = { ...newUser };
  delete cleanUser.password;

  return { success: true, message: 'Account created successfully!', user: cleanUser };
};

const Signup = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [userType, setUserType] = useState('user');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const googleButtonRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is not configured.');
      return undefined;
    }

    const handleGoogleResponse = async (response) => {
      try {
        const user = JSON.parse(atob(response.credential.split('.')[1]));
        const registeredUser = {
          fullName: user.name,
          email: user.email,
          picture: user.picture,
          role: userType,
          provider: 'google',
        };

        try {
          const res = await fetch(SIGNUP_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registeredUser),
          });
          const data = await res.json();
          if (res.ok && data.success !== false) {
            toast.success(data.message || 'Google account connected successfully!');
            if (onSuccess) onSuccess(data.user || registeredUser);
            else navigate('/');
            return;
          }
        } catch (apiErr) {
          console.warn('Backend server offline, using local storage fallback:', apiErr.message);
        }

        const result = saveToLocalDb(registeredUser);
        if (result.success) {
          toast.success(result.message);
          if (onSuccess) onSuccess(result.user);
          else navigate('/');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Google signup failed:', error);
        toast.error('Unable to sign up with Google');
      }
    };

    const renderGoogleButton = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signup_with',
        });
      }
    };

    if (window.google) {
      renderGoogleButton();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      document.body.appendChild(script);
    }

    return undefined;
  }, [navigate, onSuccess, userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'mobile') {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { fullName, email, mobile, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }

    if (!email.trim()) {
      toast.error('Email address is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address');
      return false;
    }

    if (!mobile.trim()) {
      toast.error('Mobile number is required');
      return false;
    }

    if (mobile.trim().length !== 10) {
      toast.error('Mobile number must be exactly 10 digits');
      return false;
    }

    if (!password) {
      toast.error('Password is required');
      return false;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service & Privacy Policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      mobile: formData.mobile,
      password: formData.password,
      role: userType,
      provider: 'local',
    };

    try {
      const response = await fetch(SIGNUP_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        toast.success(data.message || 'Account created successfully!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(data.user || payload);
          } else {
            navigate('/signin');
          }
        }, 1500);
        return;
      } else {
        toast.error(data.message || 'Signup failed');
        return;
      }
    } catch (networkErr) {
      console.warn('Backend server offline, using local storage fallback:', networkErr.message);
    }

    const mockResult = saveToLocalDb(payload);
    if (mockResult.success) {
      toast.success(mockResult.message);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(mockResult.user);
        } else {
          navigate('/signin');
        }
      }, 1500);
    } else {
      toast.error(mockResult.message);
    }
  };

  return (
    <div className="signup-page-wrapper">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="mainBanner">
        <img src={mainBanner} alt="Background Banner" className="image" />
        <div className="mainBanner-overlay"></div>
      </div>

      <div className="signup-section">
        <div className="signup-card">
          <div className="signup-header">
            <h2 className="signup-title">Join City Space</h2>
            <p className="signup-subtitle">Create an account to get started.</p>

            <div className="user-type-group">
              <label className="user-type-label">
                <input
                  type="radio"
                  name="userType"
                  value="owner"
                  checked={userType === 'owner'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="user-type-radio"
                />
                <span>I'm vendor</span>
              </label>
              <label className="user-type-label">
                <input
                  type="radio"
                  name="userType"
                  value="user"
                  checked={userType === 'user'}
                  onChange={(e) => setUserType(e.target.value)}
                  className="user-type-radio"
                />
                <span>I'm user</span>
              </label>
            </div>

            <div ref={googleButtonRef} className="social-login-grid" aria-label="Sign up with Google" />

            <div className="divider-container">
              <div className="divider-line"></div>
              <span className="divider-text">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-inputs-spacing">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <div className="relative">
                  <div className="input-icon-wrapper">
                    <svg
                      className="input-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <div className="input-icon-wrapper">
                    <svg
                      className="input-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Mobile Number</label>
                <div className="relative">
                  <div className="input-icon-wrapper">
                    <svg
                      className="input-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="10-digit mobile number"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <div className="relative">
                  <div className="input-icon-wrapper">
                    <svg
                      className="input-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Confirm Password</label>
                <div className="relative">
                  <div className="input-icon-wrapper">
                    <svg
                      className="input-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            <div className="terms-container">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="terms-checkbox"
              />
              <label htmlFor="agree-terms" className="terms-label">
                I agree to the{' '}
                <a href="#" className="terms-link">
                  Terms of Service
                </a>{' '}
                &{' '}
                <a href="#" className="terms-link">
                  Privacy Policy
                </a>
              </label>
            </div>

            <button type="submit" className="submit-btn">
              Create Account
            </button>

            <p className="signin-footer">
              Already have an account?{' '}
              <Link to="/" className="signin-link">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;