import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

console.log('GearGuard: Starting application bootstrap...');

const container = document.getElementById('root');

if (!container) {
  console.error('GearGuard Error: Target container #root not found in the DOM.');
} else {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log('GearGuard: Application rendered successfully.');
  } catch (error) {
    console.error('GearGuard: Fatal error during render:', error);
    container.innerHTML = `<div style="padding: 20px; color: white; background: #900; font-family: sans-serif;">
      <h2>GearGuard: Fatal Render Error</h2>
      <pre>${error instanceof Error ? error.message : 'Unknown error'}</pre>
    </div>`;
  }
}
