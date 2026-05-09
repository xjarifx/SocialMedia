/**
 * Unified Dark Theme Constants
 * Use these constants throughout the application for consistent theming
 */

export const THEME = {
  // Background Colors
  bg: {
    primary: '#000000',
    secondary: '#16181c',
    hover: '#1a1c20',
  },
  
  // Border Colors
  border: {
    default: '#2f3336',
  },
  
  // Text Colors
  text: {
    primary: '#e7e9ea',
    secondary: '#71767b',
  },
  
  // Accent Colors
  accent: {
    default: '#1d9bf0',
    hover: '#1a8cd8',
  },
  
  // Status Colors
  status: {
    error: {
      bg: 'rgba(239, 68, 68, 0.1)', // red-500/10
      border: 'rgba(239, 68, 68, 0.3)', // red-500/30
      text: '#f87171', // red-400
    },
    success: {
      bg: 'rgba(34, 197, 94, 0.1)', // green-500/10
      border: 'rgba(34, 197, 94, 0.3)', // green-500/30
      text: '#4ade80', // green-400
    },
  },
} as const;

/**
 * Tailwind CSS class strings for common patterns
 */
export const THEME_CLASSES = {
  // Backgrounds
  bgPrimary: 'bg-[#000000]',
  bgSecondary: 'bg-[#16181c]',
  bgHover: 'hover:bg-[#1a1c20]',
  
  // Text
  textPrimary: 'text-[#e7e9ea]',
  textSecondary: 'text-[#71767b]',
  textAccent: 'text-[#1d9bf0]',
  
  // Borders
  border: 'border-[#2f3336]',
  
  // Cards
  card: 'bg-[#16181c] border border-[#2f3336]',
  
  // Inputs
  input: 'bg-[#16181c] border border-[#2f3336] text-[#e7e9ea] placeholder:text-[#71767b] focus:border-[#1d9bf0] focus:ring-1 focus:ring-[#1d9bf0]',
  
  // Buttons
  btnPrimary: 'bg-[#1d9bf0] text-white hover:bg-[#1a8cd8]',
  btnSecondary: 'bg-[#16181c] text-[#e7e9ea] border border-[#2f3336] hover:bg-[#1a1c20]',
  
  // Error States
  error: 'border border-red-500/30 bg-red-500/10 text-red-400',
  
  // Success States
  success: 'border border-green-500/30 bg-green-500/10 text-green-400',
} as const;
