import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import initialDb from '../../data/db.json';
import './Signin.css';

const mainBanner = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80';

const SIGNIN_API_URL = import.meta.env.VITE_SIGNIN_API_URL || 'http://localhost:5000/api/signin';
const STORAGE_KEY = 'app_db_users';

const authenticateUser = (credentials) => {
  let users = initialDb?.users || [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      users = JSON.parse(stored);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch (err) {
    console.error('Error reading localStorage:', err);
  }

  const { email, password, role = 'user', provider = 'local' } = credentials;
  const trimmedInput = email?.trim().toLowerCase();

  if (provider === 'google') {
    let existingUser = users.find((u) => u.email?.toLowerCase() === trimmedInput);
    if (!existingUser) {
      existingUser = {
        id: Date.now().toString(),
        fullName: credentials.fullName || email.split('@')[0],
        email: trimmedInput,
        mobile: '',
        role,
        provider: 'google',
        createdAt: new Date().toISOString(),
      };
      users.push(existingUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
    const cleanUser = { ...existingUser };
    delete cleanUser.password;
    return { success: true, message: 'Google login successful!', user: cleanUser };
  }

  const user = users.find(
    (u) =>
      (u.email?.toLowerCase() === trimmedInput || u.mobile === trimmedInput) &&
      u.role === role
  );

  if (!user) {
    return {
      success: false,
      message: 'You are not registered. Kindly register your details.',
    };
  }

  if (user.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }

  const cleanUser = { ...user };
  delete cleanUser.password;

  return { success: true, message: 'Login successful!', user: cleanUser };
};

const Signin = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [userType, setUserType] = useState('user');
  const [rememberMe, setRememberMe] = useState(false);
  const [sessionExpired] = useState(
    new URLSearchParams(window.location.search).get('expired') === 'true'
  );
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
        const loggedInUser = {
          email: user.email,
          fullName: user.name,
          picture: user.picture,
          role: userType,
          provider: 'google',
        };

        try {
          const res = await fetch(SIGNIN_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loggedInUser),
          });
          const data = await res.json();
          if (res.ok && data.success !== false) {
            toast.success(data.message || 'Google login successful!');
            if (onSuccess) onSuccess(data.user || loggedInUser);
            else navigate('/');
            return;
          }
        } catch (apiErr) {
          console.warn('Backend server offline, using local storage fallback:', apiErr.message);
        }

        const result = authenticateUser(loggedInUser);
        if (result.success) {
          toast.success(result.message);
          if (onSuccess) onSuccess(result.user);
          else navigate('/');
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error('Google login failed:', error);
        toast.error('Unable to sign in with Google');
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
          text: 'signin_with',
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
    if (name === 'email') {
      if (/^\d*$/.test(value)) {
        if (value.length > 10) return;
      }
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const { email, password } = formData;
    const trimmedInput = email.trim();

    if (!trimmedInput) {
      toast.error('Email address or mobile number is required');
      return false;
    }

    const isNumeric = /^\d+$/.test(trimmedInput);

    if (isNumeric) {
      if (trimmedInput.length !== 10) {
        toast.error('Mobile number must be exactly 10 digits');
        return false;
      }
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedInput)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    }

    if (!password) {
      toast.error('Password is required');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
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
      email: formData.email,
      password: formData.password,
      role: userType,
      provider: 'local',
    };

    try {
      const response = await fetch(SIGNIN_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        toast.success(data.message || 'Login successful!');
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(data.user || payload);
          } else {
            navigate('/');
          }
        }, 1000);
        return;
      } else {
        toast.error(data.message || 'Login failed');
        return;
      }
    } catch (networkErr) {
      console.warn('Backend server offline, using local storage fallback:', networkErr.message);
    }

    const result = authenticateUser(payload);
    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(result.user);
        } else {
          navigate('/');
        }
      }, 1000);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="login-page-wrapper">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />

      <div className="mainBanner">
        <img src={mainBanner} alt="Background Banner" className="image" />
        <div className="mainBanner-overlay"></div>
      </div>

      <div className="login-bg-blob-top"></div>
      <div className="login-bg-blob-bottom"></div>

      <div className="login-section">
        <div className="login-card">
        {sessionExpired && (
          <div className="session-expired-alert">
            <svg className="session-expired-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="session-expired-text">Your session has expired. Please sign in again.</span>
          </div>
        )}

        <div className="login-header">
          <h2 className="welcome-title">Welcome To City Space </h2>
          <p className="welcome-subtitle">Please enter your details to sign in.</p>

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

            <div className="social-login-grid">
              <div ref={googleButtonRef} aria-label="Sign in with Google" />
            </div>

          <div className="divider-container">
            <div className="divider-line"></div>
            <span className="divider-text">Or sign in with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-inputs-spacing">
            <div className="input-group">
              <label className="input-label">Email Address / Mobile Number</label>
              <div className="relative">
                <div className="input-icon-wrapper">
                  <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email / Mobile"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="relative">
                <div className="input-icon-wrapper">
                  <svg className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
          </div>

          <div className="remember-forgot-container">
            <div className="remember-me-wrapper">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="remember-checkbox"
              />
              <label htmlFor="remember-me" className="remember-label">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="forgot-password-link">Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Sign In
          </button>

          <p className="signup-footer">
            Don't have an account?{' '}
            <Link to="/signup" className="signup-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  );
};

export default Signin;