import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, LoginCredentials, showError, showSuccess } from '../api';
import { useAuth } from '../context/authContext';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      showError('Please provide both email and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials: LoginCredentials = { email, password };
      const response = await loginUser(credentials);

      if (response.success && response.data.success) {
        const authenticatedUser = response.data.data ?? null;
        if (authenticatedUser) {
          setUser(authenticatedUser);
        }
        const username = response.data.data?.username ?? 'friend';
        showSuccess(`Welcome back, ${username}!`);
        navigate('/', { replace: true });
        setEmail('');
        setPassword('');
      } else {
        const errorKey = response.data.error;
        let errorMessage = 'Unable to log you in. Try again.';

        if (errorKey === 'InvalidCredentials') {
          errorMessage = 'Invalid email or password. Please double-check.';
        } else if (errorKey === 'UserNotFound') {
          errorMessage = 'No account found for that email.';
        } else if (errorKey === 'ValidationError') {
          errorMessage = 'Both fields are required.';
        } else if (response.status === 401) {
          errorMessage = 'Invalid credentials.';
        }

        showError(errorMessage);
      }
    } catch (error) {
      showError('Network error. Please confirm the backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-form login-form">
      <div>Sign in</div>
      <form onSubmit={handleSubmit}>
        <input
          className="auth-input email"
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          className="auth-input password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSubmitting}
        />
        <div className="auth-footer">
          <div className="to-login">
            <span>Don't have an account?</span>
            <Link to="/register">Create one</Link>
          </div>
          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  );
};
