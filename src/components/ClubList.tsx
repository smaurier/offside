import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Club } from "../types";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for MapContainer center property
const defaultCenter: L.LatLngExpression = [48.8566, 2.3522]; // Coordonnées par défaut (Paris)

// Fix for TileLayer attribution property
const tileLayerAttribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// Composant pour ajuster la vue de la carte aux marqueurs
function MapBounds({ clubs }: { clubs: Club[] }) {
  const map = useMap();

  useEffect(() => {
    if (clubs.length > 0) {
      const validClubs = clubs.filter(club =>
        club.lat !== undefined && club.long !== undefined &&
        !isNaN(club.lat) && !isNaN(club.long)
      );

      if (validClubs.length > 0) {
        const bounds = L.latLngBounds(
          validClubs.map(club => [club.lat, club.long] as L.LatLngExpression)
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [clubs, map]);

  return null;
}

// Composant pour gérer un marqueur de club avec un z-index correct
function ClubMarker({
  club,
  isHovered,
  onMouseOver,
  onMouseOut
}: {
  club: Club,
  isHovered: boolean,
  onMouseOver: () => void,
  onMouseOut: () => void
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) {
      const element = markerRef.current.getElement();
      if (element) {
        // Retirer et réinsérer l'élément DOM pour forcer un ordre de z-index correct
        if (isHovered) {
          // Retirer le marqueur du DOM
          const parent = element.parentNode;
          if (parent) {
            parent.removeChild(element);
            // Le réinsérer à la fin pour qu'il apparaisse au-dessus
            parent.appendChild(element);

            // Appliquer un z-index élevé
            element.style.zIndex = '10000';
          }
        } else {
          // Rétablir le z-index normal
          element.style.zIndex = '500';
        }
      }
    }
  }, [isHovered]);

  const customIcon = L.divIcon({
    className: `custom-club-icon ${isHovered ? 'custom-club-icon-hovered' : ''}`,
    html: `
      <div class="relative ${isHovered ? 'scale-125' : ''} transition-all duration-300">
        <div class="absolute inset-0 ${isHovered ? 'shadow-lg' : 'shadow-md'} rounded-full bg-white opacity-80" style="z-index: 1;"></div>
        <div class="relative flex items-center justify-center w-10 h-10 rounded-full" style="z-index: 2;">
          <img 
            src="${club.logo}" 
            class="w-7 h-7 object-contain relative"
            style="z-index: 3; transition: transform 0.3s ease;"
          />
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });

  return (
    <Marker
      ref={markerRef}
      position={
        club.lat !== undefined && club.long !== undefined
          ? [club.lat, club.long]
          : [0, 0] // Coordonnées par défaut si manquantes
      }
      icon={customIcon}
      eventHandlers={{
        mouseover: onMouseOver,
        mouseout: onMouseOut,
      }}
    >
      <Popup>
        <div>
          <h3 className="font-bold">{club.name}</h3>
          <p>{club.city}</p>
          <Link to={`/${club.id}`} className="text-blue-500 underline">
            Voir les détails
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}

export default function ClubList() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hoveredClubId, setHoveredClubId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const querySnapshot = await getDocs(collection(db, "clubs"));
        const clubsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Club, "id">),
        }));
        setClubs(clubsData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchClubs();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  return (
    <div className="flex flex-row h-screen w-screen">
      {/* Liste des clubs à gauche */}
      <div className="w-1/3 p-4 overflow-y-auto bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Liste des Clubs</h1>
        <ul className="space-y-2" role="list">
          {clubs.length === 0 && <p>Aucun club trouvé.</p>}
          {clubs.map((club) => (
            <li
              key={club.id}
              className={`border rounded overflow-hidden transition-all duration-300 ${hoveredClubId === club.id ? "scale-101 shadow-md bg-blue-50" : "transform hover:scale-101 hover:shadow-lg"
                }`}
              onMouseEnter={() => setHoveredClubId(club.id)}
              onMouseLeave={() => setHoveredClubId(null)}
            >
              <Link
                to={`/${club.id}`}
                className="flex items-center space-x-3 p-2"
              >
                <img
                  src={club.logo}
                  alt={`${club.name} logo`}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-semibold">{club.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Carte au centre */}
      <div className="w-2/3 h-full">
        <MapContainer
          center={defaultCenter}
          zoom={6}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution={tileLayerAttribution}
          />
          <MapBounds clubs={clubs} />
          {clubs.map((club) => {
            const isHovered = hoveredClubId === club.id;

            return (
              <ClubMarker
                key={club.id}
                club={club}
                isHovered={isHovered}
                onMouseOver={() => setHoveredClubId(club.id)}
                onMouseOut={() => setHoveredClubId(null)}
              />
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
