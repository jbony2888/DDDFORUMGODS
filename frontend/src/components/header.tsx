import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/dddforumlogo.png';

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
}

const HeaderActionButton: React.FC<HeaderActionButtonProps> = ({ user }) => (
  <div id="header-action-button">
    {user ? (
      <div>
        <div>{user.username}</div>
        <u>
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

  return (
    <header id="header" className="flex align-center">
      <Logo />
      <TitleAndSubmission />
      {shouldShowActionButton(location.pathname) ? (
        <HeaderActionButton user={null} />
      ) : (
        null
      )}
    </header>
  );
};

