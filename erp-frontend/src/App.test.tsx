import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders ERP application', () => {
  render(<App />);
  const headerElement = screen.getByText(/Amanat Al-Kalima/i);
  expect(headerElement).toBeInTheDocument();
});
