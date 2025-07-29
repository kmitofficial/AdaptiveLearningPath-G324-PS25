/**
 * PasswordReset Component
 * Handles both the password recovery request and password reset functionality.
 * Provides a unified interface for users to request a password reset and set a new password.
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import '../styles/Auth.css';

function PasswordReset() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // State management for form fields and feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Determine if we're in reset mode (has token) or forgot password mode
  const isResetMode = Boolean(token);

  /**
   * Handle form submission for both forgot password and reset password
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      if (isResetMode) {
        // Reset password mode
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }

        const response = await axios.post(`${config.apiBaseUrl}/auth/reset-password/${token}`, {
          password
        });
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        // Forgot password mode
        const response = await axios.post(`${config.apiBaseUrl}/auth/forgot-password`, {
          email
        });
        setMessage(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-outer-container">
      <div className="auth-container">
        <h2 className="auth-title">
          {isResetMode ? 'Reset Password' : 'Forgot Password'}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {!isResetMode ? (
            // Forgot Password Form
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          ) : (
            // Reset Password Form
            <>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa${showPassword ? "s" : "r"} fa-eye${showPassword ? "-slash" : ""}`}></i>
                </span>
              </div>

              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={0}
                  role="button"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  <i className={`fa${showConfirmPassword ? "s" : "r"} fa-eye${showConfirmPassword ? "-slash" : ""}`}></i>
                </span>
              </div>
            </>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading 
              ? (isResetMode ? 'Updating Password...' : 'Sending Reset Link...') 
              : (isResetMode ? 'Update Password' : 'Reset Password')}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/" className="link-btn">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default PasswordReset; 