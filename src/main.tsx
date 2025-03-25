
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Clear any cached data from localStorage when the app starts
// This helps prevent stale data issues that might cause loading problems
try {
  // We're only clearing auth-related or potentially problematic cache items
  // instead of all localStorage to avoid disrupting important user settings
  const keysToPreserve = ['theme', 'preferences']; // Add keys to preserve

  Object.keys(localStorage).forEach(key => {
    if (!keysToPreserve.includes(key) && 
        (key.includes('auth') || key.includes('session') || key.includes('sb-'))) {
      localStorage.removeItem(key);
    }
  });
} catch (e) {
  console.error('Error clearing cached data:', e);
}

createRoot(document.getElementById("root")!).render(<App />);
