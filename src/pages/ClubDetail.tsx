import { useParams, useNavigate } from "react-router-dom";
import { useClub } from "../hooks/useClub";

export default function ClubDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();               // ← on récupère navigate
  const { club, loading, error } = useClub(id!);

  if (loading) return <p>Chargement du club…</p>;
  if (error)   return <p>Erreur : {error.message}</p>;
  if (!club)   return <p>Aucun club à afficher</p>;

  return (
    <div className="space-y-4">
      {/* Bouton Retour */}
      <button
        onClick={() => navigate(-1)}             /* ← remonte d'une entrée dans l'historique */
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold">{club.name}</h1>
      <img src={club.logo} alt={`${club.name} logo`} className="w-24" />
      <p><strong>Ville :</strong> {club.city}</p>
      <p><strong>Pays (ISO) :</strong> {club.isoCountry}</p>
      <p>
        <strong>Fondation :</strong>{" "}
        {new Date(club.fondationDate).toLocaleDateString()}
      </p>
      <p>
        <a
          href={club.website}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 underline"
        >
          Site officiel
        </a>
      </p>
      {/* Plus tard : carte, stats, filtre… */}
    </div>
  );
}
