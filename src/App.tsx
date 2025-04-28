import { useTheme } from './contexts/ThemeContext';
import { useClubs } from "./hooks/useClubs";

export default function App() {
  const { clubs, loading, error } = useClubs();
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
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Liste des Clubs</h1>
        <ul className="space-y-2">
          {clubs.map((club) => (
            <li
              key={club.id}
              className="flex items-center space-x-3 p-2 border rounded"
            >
              <img
                src={club.logo}
                alt={`${club.name} logo`}
                className="w-8 h-8 object-contain"
              />
              <span>{club.name} — {club.city}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

