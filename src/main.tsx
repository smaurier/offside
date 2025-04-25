import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// On importe d'abord le CSS Tailwind pur
import './globals.css';

// Puis ton SCSS personnalisé (qui réimporte index.css déjà, mais c'est plus sûr)
import './globals.scss';
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)