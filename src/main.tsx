// src/main.tsx atau index.tsx
import React from 'react'; // WAJIB untuk JSX di TypeScript
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // opsional jika pakai tailwind atau global css

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
