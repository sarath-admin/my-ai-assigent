import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('Mounting application...');
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find root element');
} else {
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    console.log('Application mounted');
  } catch (error) {
    console.error('Failed to render application:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #1e293b; font-family: sans-serif;">
        <h1 style="font-size: 24px; font-weight: bold;">Failed to load application</h1>
        <p>Please check the browser console for details.</p>
      </div>
    `;
  }
}
