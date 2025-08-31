import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaSpinner, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import './ForgotPassword.css';

const VerificationCode = ({ email, onVerificationSuccess, onBackToEmail }) => {
  const [code, setCode] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedCode = text.replace(/\D/g, '').slice(0, 4);
        const newCode = [...code];
        for (let i = 0; i < 4; i++) {
          newCode[i] = pastedCode[i] || '';
        }
        setCode(newCode);
        
        // Focus last filled input or first empty one
        const lastFilledIndex = Math.min(pastedCode.length - 1, 3);
        inputRefs[lastFilledIndex].current?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 4) {
      setMessage('Please enter all 4 digits.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:8080/api/auth/verify-code', {
        email: email,
        code: verificationCode
      });
      
      setIsSuccess(true);
      onVerificationSuccess(verificationCode);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid verification code. Please try again.';
      setMessage(errorMessage);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/auth/forgot-password', {
        email: email
      });
      
      setMessage('A new verification code has been sent to your email.');
      setIsSuccess(true);
      setTimeLeft(600); // Reset timer
      setCode(['', '', '', '']); // Clear current code
      inputRefs[0].current?.focus(); // Focus first input
    } catch (error) {
      setMessage('Failed to resend code. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <div className="forgot-password-header">
          <div className="icon-wrapper">
            <FaShieldAlt className="main-icon" />
          </div>
          <h2>Enter Verification Code</h2>
          <p>We've sent a 4-digit verification code to <strong>{email}</strong></p>
          <p className="time-remaining">
            Time remaining: <span className={timeLeft <= 60 ? 'text-danger' : 'text-warning'}>
              {formatTime(timeLeft)}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="verification-code-group">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                className="verification-input"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength="1"
                disabled={loading || timeLeft === 0}
                autoComplete="off"
              />
            ))}
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading || code.join('').length !== 4 || timeLeft === 0}
            >
              {loading && <FaSpinner className="fa-spin me-2" />}
              Verify Code
            </button>
          </div>

          <div className="form-group">
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-block"
              onClick={handleResendCode}
              disabled={loading || timeLeft > 540} // Can only resend after 1 minute
            >
              {loading && <FaSpinner className="fa-spin me-2" />}
              Resend Code {timeLeft > 540 && `(${formatTime(600 - timeLeft)})`}
            </button>
          </div>

          {message && (
            <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="back-to-login">
          <button onClick={onBackToEmail} className="back-link">
            <FaArrowLeft className="me-2" />
            Back to Email
          </button>
          <Link to="/login" className="back-link ms-3">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode;
