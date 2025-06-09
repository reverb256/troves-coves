
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityState {
  highContrast: boolean;
  reducedMotion: boolean;
  hdrSupport: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType extends AccessibilityState {
  toggleHighContrast: () => void;
  setFontSize: (size: AccessibilityState['fontSize']) => void;
  setColorBlindMode: (mode: AccessibilityState['colorBlindMode']) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AccessibilityState>({
    highContrast: false,
    reducedMotion: false,
    hdrSupport: false,
    fontSize: 'normal',
    colorBlindMode: 'none'
  });

  useEffect(() => {
    // Detect system preferences
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const p3Query = window.matchMedia('(color-gamut: p3)');
    const rec2020Query = window.matchMedia('(color-gamut: rec2020)');

    setState(prev => ({
      ...prev,
      highContrast: highContrastQuery.matches,
      reducedMotion: reducedMotionQuery.matches,
      hdrSupport: p3Query.matches || rec2020Query.matches
    }));

    // Listen for changes
    const handleContrastChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    highContrastQuery.addEventListener('change', handleContrastChange);
    reducedMotionQuery.addEventListener('change', handleMotionChange);

    return () => {
      highContrastQuery.removeEventListener('change', handleContrastChange);
      reducedMotionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    // Apply accessibility classes to document
    const root = document.documentElement;
    
    root.classList.toggle('high-contrast', state.highContrast);
    root.classList.toggle('reduced-motion', state.reducedMotion);
    root.classList.toggle('hdr-support', state.hdrSupport);
    root.setAttribute('data-font-size', state.fontSize);
    root.setAttribute('data-color-blind-mode', state.colorBlindMode);

    // Set CSS custom properties for dynamic contrast
    if (state.highContrast) {
      root.style.setProperty('--dynamic-contrast-ratio', '21');
    } else {
      root.style.setProperty('--dynamic-contrast-ratio', '7');
    }

  }, [state]);

  const toggleHighContrast = () => {
    setState(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const setFontSize = (fontSize: AccessibilityState['fontSize']) => {
    setState(prev => ({ ...prev, fontSize }));
  };

  const setColorBlindMode = (colorBlindMode: AccessibilityState['colorBlindMode']) => {
    setState(prev => ({ ...prev, colorBlindMode }));
  };

  return (
    <AccessibilityContext.Provider value={{
      ...state,
      toggleHighContrast,
      setFontSize,
      setColorBlindMode
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

// Accessibility toolbar component
export function AccessibilityToolbar() {
  const {
    highContrast,
    fontSize,
    colorBlindMode,
    toggleHighContrast,
    setFontSize,
    setColorBlindMode
  } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border-2 border-contrast-aaa-text rounded-lg p-4 shadow-xl">
      <h3 className="text-aaa-contrast font-bold mb-3">Accessibility Options</h3>
      
      <div className="space-y-3">
        <button
          onClick={toggleHighContrast}
          className={`w-full px-3 py-2 text-left rounded focus-enhanced ${
            highContrast ? 'bg-contrast-aaa-text text-white' : 'bg-gray-100'
          }`}
        >
          High Contrast: {highContrast ? 'On' : 'Off'}
        </button>

        <div>
          <label className="block text-aaa-contrast font-medium mb-1">Font Size:</label>
          <select
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as AccessibilityState['fontSize'])}
            className="w-full px-2 py-1 border border-contrast-aaa-text rounded focus-enhanced"
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        <div>
          <label className="block text-aaa-contrast font-medium mb-1">Color Vision:</label>
          <select
            value={colorBlindMode}
            onChange={(e) => setColorBlindMode(e.target.value as AccessibilityState['colorBlindMode'])}
            className="w-full px-2 py-1 border border-contrast-aaa-text rounded focus-enhanced"
          >
            <option value="none">Normal Vision</option>
            <option value="protanopia">Protanopia Support</option>
            <option value="deuteranopia">Deuteranopia Support</option>
            <option value="tritanopia">Tritanopia Support</option>
          </select>
        </div>
      </div>
    </div>
  );
}
