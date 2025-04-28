# 🏟️ Offside

**Offside** est une application **React pur** conçue pour explorer et documenter l’histoire des **clubs de football oubliés**.

Ce projet a une double ambition :

1. **Célébrer l’histoire du football**, redonner vie aux clubs mythiques tombés dans l’oubli.
2. **Couvrir l’intégralité des concepts avancés de React** (hooks, patterns, performances, rendering modes…) à travers un projet concret et ludique.

---

## 👨‍💻 Démarche personnelle

En **intercontrat**, j'ai décidé de monter sérieusement en compétence sur **React**, puis **Next.js**.

Après avoir étudié en profondeur **React sous le capot** (grâce à la documentation et un accompagnement par **ChatGPT**), il était temps de **passer à la pratique**.

J’ai donc demandé à ChatGPT de me **concocter une idée d'application** qui cocherait **toutes les cases théoriques** que j'avais étudiées.

**L’objectif : apprendre en s’amusant**.  
L’Homme apprend toujours mieux de manière ludique. J’ai donc combiné cette **montée en compétence sur React** avec l’une de mes **passions : le football**.

Ainsi est né **Offside**, un projet où je relie **apprentissage technique** et **plaisir personnel**.

Le nom **Offside** fait aussi écho à ma situation en **intercontrat** : momentanément “hors du terrain”, mais concentré sur mon **entraînement technique**, prêt à revenir plus fort dans le jeu.

---

## 🧩 Objectifs techniques

Offside a été conçu pour :

- **Couvrir 100% du socle React** : hooks (de base + avancés), patterns, performances, error boundaries, portals, Concurrent Mode, Suspense, etc.
- Mettre en évidence les **limitations de React pur** (SSR, SSG, ISR, RSC) et expliquer comment ces besoins seraient couverts avec **Next.js**.
- Créer un **dashboard complexe et évolutif** avec une gestion d’état, du routing avancé, du data fetching simulé et des optimisations de rendering.
- **Un accent particulier sera également donné aux performances** (optimisation du rendu, virtualisation, mémoïsation) ainsi qu'à l'**accessibilité** (ARIA, contrastes, navigation clavier).
- Apprendre **Tailwind CSS**, **TypeScript** et **SCSS** pour garantir un code structuré, typé et des styles maintenables.
- Intégrer **Zustand** pour la gestion des filtres complexes (clubs, joueurs).

---

## 🔍 Stack technique

Ce projet est aussi l'occasion d'apprendre **Tailwind CSS**, une technologie très demandée actuellement à Lyon, afin de compléter ma montée en compétence sur le front-end moderne.

J'utilise également **TypeScript** et **SCSS** pour garantir un code structuré, typé et des styles maintenables.

- **React (v18+)**
- **React Router**
- **Jest + React Testing Library** (tests)
- **CSS Modules / SCSS** (styles)
- **Chart.js / Recharts** (graphes, lazy loaded)
- **Virtualisation (react-window)** (pour les longues listes si nécessaire)
- **Simulated Backend** (local storage / JSON)
- **Zustand** (state management store)

---

## 📚 Concepts visés

### 🧠 Core Concepts React

- Virtual DOM, Diffing Algorithm, Reconciliation ❌
- Fiber Architecture, Concurrent Mode, Scheduler (startTransition, useDeferredValue) ❌

### ⚛️ Hooks

- useState, useEffect ❌
- useMemo, useCallback, React.memo ❌
- useRef, useLayoutEffect ❌
- useReducer ❌
- useImperativeHandle ❌
- useDebugValue ❌
- Custom Hooks, Hook Factories ❌

### 🏛️ Architecture & Patterns

- Context API (global state) ❌
- Compound Components ❌
- Render Props ❌
- Higher-Order Components (HOC) ❌
- Zustand (state management store) ❌

### 🚧 Autres concepts clés

- Error Boundaries (classe) ❌
- Portals ❌
- Strict Mode, Keys dans les listes ❌
- Suspense, Lazy Loading ❌
- Virtualisation de longues listes ❌

### 🚫 Hors périmètre React pur (Sera vu donc, plus tard, dans la version Next.js)

- SSR (Server-Side Rendering) ❌
- SSG (Static Site Generation) ❌
- ISR (Incremental Static Regeneration) ❌
- Streaming SSR ❌
- React Server Components (RSC) ❌

---

## 🚧 Roadmap

1. **Setup projet React + Router + Thème global**
2. **CRUD Clubs avec modals (cocher hooks de base + Portals)**
3. **Ajout filtres lourds (startTransition + useMemo + useCallback)**
4. **Graphiques dynamiques (Render Props + Lazy Loading + Suspense)**
5. **Auth fictive + sécurisation Admin (HOC + Context)**
6. **Tests Jest + React Testing Library**
7. **Intégrer un store Zustand pour la gestion des filtres complexes (clubs, joueurs)**
8. **Optimisations performances (memoisation, virtualisation)**
9. **Error Boundaries partout**

---

## 📝 Limitations & Pistes futures (Next.js)

Certaines fonctionnalités comme le **Server-Side Rendering (SSR)**, **Incremental Static Regeneration (ISR)** ou les **React Server Components (RSC)** ne peuvent être implémentées en React pur.  
Elles seront **documentées** et **comparées** dans le projet, avec un plan de migration potentiel vers **Next.js**.
