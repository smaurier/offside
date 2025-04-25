import React from 'react';
// On utilise notre hook perso, typé, pour lire et modifier le thème
import { useTheme } from './contexts/ThemeContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-center 
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}
      `}
    >
      <h1 className="text-4xl font-bold mb-4">Offside ⚽</h1>
      <button
        onClick={toggleTheme}
        className="
          px-4 py-2 rounded shadow border
          hover:bg-opacity-10 transition
        "
      >
        {theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
      </button>
    </div>
  );
}

