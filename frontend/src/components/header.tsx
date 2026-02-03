import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/dddforumlogo.png';
import { useAuth } from '../context/authContext';

const Logo: React.FC = () => (
  <div id="app-logo">
    <img src={logo} alt="DDD Forum Logo" />
  </div>
);

const TitleAndSubmission: React.FC = () => (
  <div id="title-container">
    <h1>Domain-Driven Designers</h1>
    <h3>Where awesome domain driven designers are made</h3>
    <Link to="/submit">submit</Link>
  </div>
);

interface HeaderActionButtonProps {
  user?: {
    username: string;
  } | null;
  onLogout?: () => void;
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({ user, onLogout }) => (
  <div id="header-action-button">
    {user ? (
      <div>
        <div>{user.username}</div>
        <u
          role="button"
          onClick={onLogout}
          style={{ cursor: onLogout ? 'pointer' : 'default' }}
        >
          <div>logout</div>
        </u>
      </div>
    ) : (
      <Link to="/register">Join</Link>
    )}
  </div>
);

const shouldShowActionButton = (pathName: string): boolean => {
  return pathName !== '/register';
};

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header id="header" className="flex align-center">
      <Logo />
      <TitleAndSubmission />
      {shouldShowActionButton(location.pathname) ? (
        <HeaderActionButton user={user} onLogout={handleLogout} />
      ) : (
        null
      )}
    </header>
  );
};
