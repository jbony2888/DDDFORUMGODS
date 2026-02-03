import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUser, showError, showSuccess } from '../api';

export const RegistrationForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !username || !firstName || !lastName || !password || !confirmPassword) {
      showError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await createUser({
        email,
        username,
        firstName,
        lastName,
        password,
      });

      if (response.success && response.data.success) {
        showSuccess(`Account created successfully! User ID: ${response.data.data?.id}`);
        // Clear form
        setEmail('');
        setUsername('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setConfirmPassword('');
      } else {
        // Handle different error types
        const error = response.data.error;
        let errorMessage = 'Failed to create account';

        if (error === 'UsernameAlreadyTaken') {
          errorMessage = 'Username is already taken. Please choose another.';
        } else if (error === 'EmailAlreadyInUse') {
          errorMessage = 'Email is already in use. Please use a different email.';
        } else if (error === 'ValidationError') {
          errorMessage = 'Please fill in all required fields correctly.';
        } else {
          errorMessage = `Error: ${error || 'Unknown error occurred'}`;
        }

        showError(errorMessage);
      }
    } catch (error) {
      showError('Network error. Please check if the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form registration-form">
      <div>Create Account</div>
      <form onSubmit={handleSubmit}>
        <input
          className="registration email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="registatation-input username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="registatation-input username"
          type="text"
          placeholder="first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="registatation-input username"
          type="text"
          placeholder="last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="registatation-input username"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="registatation-input username"
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <div>
          <div className="to-login">
            <div>Already have an account?</div>
            <Link to="/login">Log in</Link>
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};
