// scripts/seed-firestore.cjs
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Mapping fichier → collection
const mapping = {
  "clubs.json": "clubs",
  "championsLeague.json": "champions_league",
  "europaLeague.json": "europa_league",
  "coupeCoupes.json": "cup_winners_cup",
  "supercoupe.json": "super_cup",
  "intercites.json": "inter_cities_fairs_cup",
  "conferenceLeague.json": "conference_league",
  "stadium.json": "stadiums",
  "uefaCoeff.json": "uefa_coeff",
  "clubsCoeffUefa.json": "clubs_uefa_coeff",
};

// Pour chaque fichier, quel champ utiliser comme ID
const idField = {
  "stadium.json": "idStadium",
  "uefaCoeff.json": "country",
  // les autres utilisent `id` par défaut
};

async function seedFile(fileName, collectionName) {
  const filePath = path.resolve(__dirname, "../data", fileName);
  const raw = fs.readFileSync(filePath, "utf-8");
  const docs = JSON.parse(raw);

  const batch = db.batch();
  const key = idField[fileName] || "id";

  docs.forEach(doc => {
    const docId = doc[key];
    if (!docId) {
      throw new Error(`⛔️ Pas d’ID trouvé pour un doc dans ${fileName} (champ utilisé : ${key})`);
    }
    batch.set(
      db.collection(collectionName).doc(String(docId)),
      doc
    );
  });

  await batch.commit();
  console.log(`✅ Seeded ${docs.length} docs into "${collectionName}"`);
}

async function main() {
  for (const [file, coll] of Object.entries(mapping)) {
    const fullPath = path.resolve(__dirname, "../data", file);
    if (fs.existsSync(fullPath)) {
      await seedFile(file, coll);
    } else {
      console.warn(`⚠️  Fichier manquant, skip: ${file}`);
    }
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
