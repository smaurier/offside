// src/hooks/useClub.ts
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import type { Club } from "../types";

export function useClub(id: string) {
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const ref = doc(db, "clubs", id);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) {
          setError(new Error("Club non trouvé"));
        } else {
          setClub({ id: snap.id, ...(snap.data() as Omit<Club, "id">) });
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id]);

  return { club, loading, error };
}
