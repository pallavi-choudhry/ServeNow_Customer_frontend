import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP, 3 = reset
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'Segoe UI, sans-serif',
    },
    card: {
      backgroundColor: '#fff',
      padding: '40px',
      borderRadius: '15px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '350px',
    },
    title: {
      marginBottom: '25px',
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '10px 12px',
      marginBottom: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '12px',
      marginBottom: '15px',
      backgroundColor: '#4caf50',
      color: '#fff',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    message: {
      textAlign: 'center',
      color: 'green',
      marginTop: '10px',
      fontWeight: 'bold',
    },
    error: {
      textAlign: 'center',
      color: 'red',
      marginTop: '10px',
    },
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/customer/forgotpassword', { email });
      if (res.status === 200) {
        setStep(2);
        setMessage('OTP sent to your email.');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error sending OTP. Make sure your email is registered.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/customer/verifyOtp', { email, otp });
      if (res.status === 200) {
        setStep(3);
        setMessage('OTP verified! Please reset your password.');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/customer/resetpassword', {
        email,
        password: newPassword,
      });

      if (res.status === 200) {
        setMessage('Password reset successfully. You can now log in.');
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('')
        navigate('/login');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to reset password. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form
        style={styles.card}
        onSubmit={
          step === 1
            ? handleEmailSubmit
            : step === 2
            ? handleOtpSubmit
            : handleResetPassword
        }
      >
        <div style={styles.title}>Forgot Password</div>

        {step === 1 && (
          <input
            type="email"
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}

        {step === 2 && (
          <input
            type="text"
            placeholder="Enter OTP"
            style={styles.input}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New Password"
              style={styles.input}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}

        <button type="submit" style={styles.button} disabled={loading}>
          {loading
            ? 'Please wait...'
            : step === 1
            ? 'Send OTP'
            : step === 2
            ? 'Verify OTP'
            : 'Reset Password'}
        </button>

        {message && (
          <div
            style={
              message.toLowerCase().includes('success') ||
              message.toLowerCase().includes('verified') ||
              message.toLowerCase().includes('sent')
                ? styles.message
                : styles.error
            }
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
}

export default ForgotPassword;
