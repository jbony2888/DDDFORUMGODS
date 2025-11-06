import React from 'react';
import { Layout } from '../components/layout';
import { RegistrationForm } from '../components/registrationForm';

export const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <RegistrationForm />
    </Layout>
  );
};

