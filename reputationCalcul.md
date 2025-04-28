# Indice "reputation" des clubs

Ce document décrit la formule utilisée dans le front pour générer un score de **réputation** dynamique (0‑100) pour chaque club, à partir de données déjà présentes dans la base.

---

## Variables d’entrée

| Symbole | Champ / source                                          | Plage typique |
| ------- | ------------------------------------------------------- | ------------- |
| **MV**  | `marketValue` (millions €)                              | 1 – 1 200     |
| **C**   | `countryCoeff` (table pays)                             | 2 – 110       |
| **K**   | `clubCoeff` (table club)                                | 0 – 120       |
| **D**   | Niveau de division (dérivé d’`idLeagueUEFA`, 1 = élite) | 1 – 4         |

---

## Étape 1 : mise à l’échelle

```text
MV′  = log10(MV + 1) × 25      # compresse les très gros budgets
C′   = C / 40                  # 0 – 2,7  (Angleterre ≈ 2,7)
K′   = K / 120                 # 0 – 1    (club #1 ≈ 1)
D′   = D^0.8                   # pénalise modérément les divisions inférieures
```

---

## Étape 2 : score brut

```text
raw = MV′ × C′ × ( 0.7 + 0.3 × K′ ) / D′
```

_Le terme **`(0.7 + 0.3 × K′)`** ajoute jusqu’à \***\*+30 %\*\*** selon la performance européenne récente du club._

---

## Étape 3 : normalisation 0‑100

```text
maxRaw     = maximum(raw) sur la liste chargée
displayRep = 100 × raw / maxRaw
```

Le meilleur club vaut **100**, tous les autres sont proportionnels.

---

## Pseudo‑code (JS)

```js
function reputation(mv, countryCoeff, clubCoeff, division, maxRaw) {
  const mvPrime = Math.log10(mv + 1) * 25;
  const cPrime = countryCoeff / 40;
  const kPrime = clubCoeff / 120;
  const dPrime = Math.pow(division, 0.8);

  const raw = (mvPrime * cPrime * (0.7 + 0.3 * kPrime)) / dPrime;
  return (100 * raw) / maxRaw;
}
```

---

## Pourquoi cette formule ?

- **Richesse (MV)** : reflète la qualité de l’effectif sans laisser les géants écraser l’échelle.
- **Force du championnat (C)** : récompense jouer dans une ligue médiatisée.
- **Performance récente (K)** : prise en compte directe de l’indice UEFA du club.
- **Division (D)** : pénalise, mais n’anéantit pas, les clubs de D2/D3.

---

## Exemples résumés

| Club                 | Div. | MV (M€) | C     | K     | Reputation |
| -------------------- | ---- | ------- | ----- | ----- | ---------- |
| Manchester City      | 1    | 1 200   | 109.6 | 137.8 | **100**    |
| Real Madrid          | 1    | 1 050   | 93.0  | 140.0 | 90         |
| PSG                  | 1    | 950     | 61.2  | 111.0 | 62         |
| KV Mechelen (BEL D2) | 2    | 25      | 48.8  | 1.6   | 3          |
| Portsmouth (ENG D3)  | 3    | 18      | 109.6 | 0     | 3 – 4      |

---

### Maintenance

- Le front charge `clubCoeff` et `countryCoeff` lors de l’initialisation.
- `maxRaw` est recalculé à chaque rafraîchissement de la liste des clubs.
- Aucune valeur de réputation n’est stockée en base : toujours calculée à la volée.

---
