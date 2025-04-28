// src/hooks/useClubs.ts
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Club } from "../types";

export function useClubs() {
  // 1️⃣ État local pour stocker les clubs, le chargement et les erreurs
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 2️⃣ Référence à la collection Firestore
    const collRef = collection(db, "clubs");

    // 3️⃣ Écoute en temps réel (onSnapshot)
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const data = snapshot.docs.map((doc) => {
          // map() transforme chaque doc Firestore en objet Club
          return {
            id: doc.id,
            ...(doc.data() as Omit<Club, "id">),
          };
        });
        setClubs(data);
        setLoading(false);
      },
      (err) => {
        console.error("Erreur Firestore:", err);
        setError(err);
        setLoading(false);
      }
    );

    // 4️⃣ Cleanup automatique à l’unmount
    return () => unsubscribe();
  }, []); // [] signifie que l’effet ne s’exécute qu’une fois, à l’assemblage du composant

  // 5️⃣ Retourne les clubs, le chargement et les erreurs
  return { clubs, loading, error };
}
