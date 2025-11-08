import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    mode: 'light', // light, dark, auto
    primaryColor: 'primary', // primary, success, warning, error
    fontSize: 'medium', // small, medium, large
    language: 'zh', // zh, en
  });

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        setTheme(prev => ({ ...prev, ...parsedTheme }));
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, []);

  // Update theme
  const updateTheme = (updates) => {
    const newTheme = { ...theme, ...updates };
    setTheme(newTheme);
    localStorage.setItem('theme', JSON.stringify(newTheme));
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply mode (light/dark)
    if (theme.mode === 'dark') {
      root.classList.add('dark');
    } else if (theme.mode === 'light') {
      root.classList.remove('dark');
    } else if (theme.mode === 'auto') {
      // Check system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDarkMode) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    root.classList.add(`text-${theme.fontSize === 'small' ? 'sm' : theme.fontSize === 'large' ? 'lg' : 'base'}`);

    // Apply primary color
    root.classList.remove('theme-primary', 'theme-success', 'theme-warning', 'theme-error');
    root.classList.add(`theme-${theme.primaryColor}`);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme.mode === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const root = document.documentElement;
        if (mediaQuery.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme.mode]);

  const value = {
    theme,
    updateTheme,
    setMode: (mode) => updateTheme({ mode }),
    setPrimaryColor: (color) => updateTheme({ primaryColor: color }),
    setFontSize: (size) => updateTheme({ fontSize: size }),
    setLanguage: (lang) => updateTheme({ language: lang }),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;