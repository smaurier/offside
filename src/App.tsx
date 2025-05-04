import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Club } from "./types";

function useClubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Club, "id">) }));
        setClubs(clubsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  return { clubs, loading, error };
}

import { useTheme } from './contexts/ThemeContext';
import { Routes, Route } from "react-router-dom";
import ClubList from "./components/ClubList";
import ClubDetail from "./pages/ClubDetail";

export default function App() {
  const { loading, error } = useClubs();
  const { theme, toggleTheme } = useTheme();

  if (loading) return <p>Chargement des clubs…</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-center 
        ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}
      `}
    >
      <header className="w-full p-4 bg-gray-800 text-white">
        <nav className='flex items-center justify-between'>
          <h1 className="text-4xl font-bold mb-4">Offside</h1>
          <button
            onClick={toggleTheme}
            className="
              px-4 py-2 rounded shadow border
              hover:bg-opacity-10 transition
            "
          >
            {theme === 'dark' ? 'Passer en clair' : 'Passer en sombre'}
          </button>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<ClubList />} />
        <Route path="/:id" element={<ClubDetail />} />
      </Routes>

      <footer className="w-full p-4 bg-gray-800 text-white mt-auto">
        <p className="text-center">© {new Date().getFullYear()} Offside</p>
        <p className="text-center">Tous droits réservés</p>
      </footer>
    </div>
  );
}

