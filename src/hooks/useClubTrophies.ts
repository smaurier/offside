// src/hooks/useClubTrophies.ts
import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// Définis ici tes coupes avec leur collection Firestore et l’URL de l’icône
const COMPETITIONS = [
  {
    key: "championsLeague",
    collection: "champions_league",
  },
  {
    key: "europaLeague",
    collection: "europa_league",
  },
  {
    key: "cupWinnersCup",
    collection: "cup_winners_cup",
  },
  { key: "superCup", collection: "super_cup" },
  {
    key: "interCities",
    collection: "inter_cities_fairs_cup",
  },
  {
    key: "conferenceLeague",
    collection: "conference_league",
  },
];

export function useClubTrophies(clubId: string) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const result: Record<string, number> = {};
        for (const comp of COMPETITIONS) {
          // 1) Construire la requête Firestore pour compter les docs où idWinner==clubId
          const q = query(
            collection(db, comp.collection),
            where("idWinner", "==", clubId)
          );
          // ⏳ getDocs exécute la query et renvoie snapshot.docs.length
          const snap = await getDocs(q);
          result[comp.key] = snap.size;
        }
        if (mounted) {
          setCounts(result);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err);
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [clubId]);
  return { counts, loading, error };
}
