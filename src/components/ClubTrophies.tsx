// src/components/ClubTrophies.tsx
import React from 'react';
import { useClubTrophies } from '../hooks/useClubTrophies';

export default function ClubTrophies({ clubId }: { clubId: string }) {
  const { counts, loading, error } = useClubTrophies(clubId);

  if (loading) return <p>Chargement des trophées…</p>;
  if (error) return <p>Erreur trophées : {error.message}</p>;

  return (
    <div className="flex flex-wrap gap-4 items-center">
      {Object.entries(counts).map(([key, count]) => (
        count > 0 && (
          <div key={key} className="flex items-center space-x-2">
            <img
              src={`/icons/${key}.svg`}
              alt={`${key} icon`}
              className="w-8 h-8"
            />
            <span className="font-medium">{count}</span>
          </div>
        )
      ))}
    </div>
  );
}
