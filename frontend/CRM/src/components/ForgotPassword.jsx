import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
import VerificationCode from './VerificationCode';
import ResetPasswordForm from './ResetPasswordForm';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: verification, 3: reset password
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email: email
      });
      
      setMessage(response.data.message);
      setIsSuccess(true);
      setStep(2); // Move to verification step
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (code) => {
    setVerificationCode(code);
    setStep(3); // Move to reset password step
  };

  const handleBackToEmail = () => {
    setStep(1);
    setMessage('');
    setIsSuccess(false);
  };

  const handleBackToVerification = () => {
    setStep(2);
    setMessage('');
    setIsSuccess(false);
  };

  // Step 1: Email input
  if (step === 1) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-box">
          <div className="forgot-password-header">
            <div className="icon-wrapper">
              <FaEnvelope className="main-icon" />
            </div>
            <h2>Forgot Password?</h2>
            <p>Enter your email address and we'll send you a verification code to reset your password.</p>
          </div>

          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FaEnvelope />
                  </span>
                </div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading || !email}
              >
                {loading && <FaSpinner className="fa-spin me-2" />}
                Send Verification Code
              </button>
            </div>

            {message && (
              <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
                {message}
              </div>
            )}
          </form>

          <div className="back-to-login">
            <Link to="/login" className="back-link">
              <FaArrowLeft className="me-2" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Verification code
  if (step === 2) {
    return (
      <VerificationCode 
        email={email}
        onVerificationSuccess={handleVerificationSuccess}
        onBackToEmail={handleBackToEmail}
      />
    );
  }

  // Step 3: Reset password
  if (step === 3) {
    return (
      <ResetPasswordForm
        email={email}
        verificationCode={verificationCode}
        onBackToVerification={handleBackToVerification}
      />
    );
  }

  return null;
};

export default ForgotPassword;
