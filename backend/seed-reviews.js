const { Pool } = require('pg');
const crypto = require('crypto');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const reviewTexts = [
  "Un classico imperdibile, rimane attuale e inquietante a distanza di decenni. La prosa è magistrale.",
  "Mi ha fatto riflettere molto sulla società moderna. Uno di quei libri che rimangono dentro.",
  "Non sono completamente d'accordo: la parte centrale è un po' lenta, ma il finale riscatta tutto.",
  "Prosa magistrale, storia indimenticabile. Lo consiglio a chiunque ami la grande letteratura.",
  "Uno dei libri più importanti che abbia mai letto. Ogni pagina sorprende.",
  "Semplicemente un capolavoro. Lo rileggerei altre mille volte.",
  "Lettura densa ma necessaria. Consigliatissimo a tutti.",
  "Spaventosamente attuale. I personaggi sono descritti divinamente.",
  "L'inizio stenta a decollare, ma una volta entrati nel vivo è impossibile smettere di leggere.",
  "Un romanzo che ha segnato un'epoca, e si capisce perfettamente il perché. Geniale."
];

async function seed() {
  try {
    const storiesRes = await pool.query('SELECT id FROM stories');
    const usersRes = await pool.query('SELECT id FROM users');
    
    if (storiesRes.rows.length === 0 || usersRes.rows.length === 0) {
      console.log('Nessuna storia o utente trovato.');
      process.exit(1);
    }

    const stories = storiesRes.rows;
    const users = usersRes.rows;
    let inserted = 0;

    for (const story of stories) {
      // Check if this story already has reviews
      const existingReviews = await pool.query('SELECT count(*) FROM reviews WHERE story_id = $1', [story.id]);
      if (parseInt(existingReviews.rows[0].count) < 6) {
        // Create 6 reviews
        for (let i = 0; i < 6; i++) {
          const randomUser = users[Math.floor(Math.random() * users.length)];
          const randomText = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
          const randomRating = (Math.floor(Math.random() * 2) + 3) + (Math.random() > 0.5 ? 0.5 : 0.0); // 3.0 to 4.5
          const finalRating = Math.random() > 0.8 ? 5.0 : randomRating; // Add 5.0 as possibility

          await pool.query(
            'INSERT INTO reviews (id, content, author_id, rating, story_id) VALUES ($1, $2, $3, $4, $5)',
            [crypto.randomUUID(), randomText, randomUser.id, finalRating.toFixed(1), story.id]
          );
          inserted++;
        }
      }
    }

    console.log(`Seed completato: inserite ${inserted} nuove recensioni.`);
    process.exit(0);
  } catch (err) {
    console.error('Errore durante il seed:', err);
    process.exit(1);
  }
}

seed();
