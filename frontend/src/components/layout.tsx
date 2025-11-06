import React from 'react';
import { Header } from './header';
import { Content } from './content';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <Content>
      {children}
    </Content>
  </>
);

