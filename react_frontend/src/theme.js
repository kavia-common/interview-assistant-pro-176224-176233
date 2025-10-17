import React, { createContext, useContext } from 'react';

export const defaultTheme = {
  name: 'Ocean Professional',
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
  border: '#e5e7eb',
  gradient: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(249,250,251,1))',
  radius: 12,
};

export const ThemeContext = createContext({ theme: defaultTheme });

// PUBLIC_INTERFACE
export function useTheme() {
  /** Access theme and theme actions. */
  return useContext(ThemeContext);
}
