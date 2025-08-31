import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaArrowLeft, FaSpinner, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import './ForgotPassword.css';

const ResetPasswordForm = ({ email, verificationCode, onBackToVerification }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordValidation = validatePassword(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      setMessage('Password does not meet the requirements.');
      setIsSuccess(false);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setIsSuccess(false);
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post('http://localhost:8080/api/auth/reset-password-with-code', {
        email: email,
        code: verificationCode,
        newPassword: newPassword
      });
      
      setMessage('Password has been reset successfully! Redirecting to login...');
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
      setMessage(errorMessage);
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
            <FaLock className="main-icon" />
          </div>
          <h2>Reset Your Password</h2>
          <p>Enter your new password for <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FaLock />
                </span>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                disabled={loading}
              />
              <div className="input-group-append">
                <span 
                  className="input-group-text cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            
            {/* Password requirements */}
            {newPassword && (
              <div className="password-requirements mt-2">
                <small className="form-text">
                  <div className={`requirement ${passwordValidation.minLength ? 'valid' : 'invalid'}`}>
                    <FaCheckCircle className={passwordValidation.minLength ? 'text-success' : 'text-muted'} />
                    At least 8 characters
                  </div>
                  <div className={`requirement ${passwordValidation.hasUpper ? 'valid' : 'invalid'}`}>
                    <FaCheckCircle className={passwordValidation.hasUpper ? 'text-success' : 'text-muted'} />
                    One uppercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasLower ? 'valid' : 'invalid'}`}>
                    <FaCheckCircle className={passwordValidation.hasLower ? 'text-success' : 'text-muted'} />
                    One lowercase letter
                  </div>
                  <div className={`requirement ${passwordValidation.hasNumber ? 'valid' : 'invalid'}`}>
                    <FaCheckCircle className={passwordValidation.hasNumber ? 'text-success' : 'text-muted'} />
                    One number
                  </div>
                </small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FaLock />
                </span>
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                disabled={loading}
              />
              <div className="input-group-append">
                <span 
                  className="input-group-text cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            
            {/* Password match indicator */}
            {confirmPassword && (
              <small className={`form-text ${newPassword === confirmPassword ? 'text-success' : 'text-danger'}`}>
                <FaCheckCircle className={newPassword === confirmPassword ? 'text-success' : 'text-muted'} />
                {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
              </small>
            )}
          </div>

          <div className="form-group">
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading || !passwordValidation.isValid || newPassword !== confirmPassword}
            >
              {loading && <FaSpinner className="fa-spin me-2" />}
              Reset Password
            </button>
          </div>

          {message && (
            <div className={`alert ${isSuccess ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          )}
        </form>

        <div className="back-to-login">
          <button onClick={onBackToVerification} className="back-link">
            <FaArrowLeft className="me-2" />
            Back to Verification
          </button>
          <Link to="/login" className="back-link ms-3">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
