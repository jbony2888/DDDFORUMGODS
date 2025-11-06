import React from 'react';

interface ContentProps {
  children: React.ReactNode;
}

export const Content: React.FC<ContentProps> = ({ children }) => (
  <div className="content-container">
    {children}
  </div>
);

