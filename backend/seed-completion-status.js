const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

async function runSeed() {
  try {
    console.log('[SEED] Connessione al database...');
    
    // 1. Aggiorna completion_status per distribuire le storie
    const storiesRes = await pool.query("SELECT id FROM stories WHERE status = 'published'");
    const stories = storiesRes.rows;
    console.log(`[SEED] Trovate ${stories.length} storie pubblicate.`);

    if (stories.length >= 35) {
      // Imposta le prime 15 a 'completato'
      const completedIds = stories.slice(0, 15).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['completato', completedIds]);
      console.log(`[SEED] Impostate ${completedIds.length} storie come 'completato'.`);

      // Imposta le successive 10 a 'incompleto'
      const incompleteIds = stories.slice(15, 25).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['incompleto', incompleteIds]);
      console.log(`[SEED] Impostate ${incompleteIds.length} storie come 'incompleto'.`);

      // Imposta le successive 10 a 'sospeso'
      const suspendedIds = stories.slice(25, 35).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['sospeso', suspendedIds]);
      console.log(`[SEED] Impostate ${suspendedIds.length} storie come 'sospeso'.`);

      // Imposta 15 storie come 18+ (is_18_plus = TRUE)
      await pool.query('UPDATE stories SET is_18_plus = FALSE');
      const nsfwIds = stories.slice(10, 25).map(s => s.id);
      await pool.query('UPDATE stories SET is_18_plus = TRUE WHERE id = ANY($1)', [nsfwIds]);
      console.log(`[SEED] Impostate ${nsfwIds.length} storie come 18+ (is_18_plus = TRUE).`);
    } else {
      console.log('[SEED] Attenzione: non ci sono abbastanza storie nel database per ripartire gli status.');
    }

    // 2. Modifica la data di registrazione degli utenti per testare "Nuovi talenti"
    const usersRes = await pool.query('SELECT id FROM users');
    const users = usersRes.rows;
    console.log(`[SEED] Trovati ${users.length} utenti.`);

    // Metà creati 3 mesi fa (non nuovi talenti), metà creati 15 giorni fa (nuovi talenti)
    for (let i = 0; i < users.length; i++) {
      const interval = i % 2 === 0 ? "3 months" : "15 days";
      await pool.query(`UPDATE users SET created_at = NOW() - INTERVAL '${interval}' WHERE id = $1`, [users[i].id]);
    }
    console.log(`[SEED] Aggiornate date di registrazione utenti.`);

    // 3. Genera visualizzazioni recenti (ultimi 7 giorni) per testare "Classifica"
    // Rimuoviamo vecchie visualizzazioni recenti per avere controllo sui dati di test
    await pool.query("DELETE FROM story_views WHERE viewed_at >= NOW() - INTERVAL '7 days'");

    // Inseriamo da 1 a 10 visualizzazioni per le prime 15 storie
    let viewInsertCount = 0;
    for (let i = 0; i < Math.min(15, stories.length); i++) {
      const storyId = stories[i].id;
      const viewsToInsert = 15 - i; // story 0 ha 15 visualizzazioni, story 1 ha 14, ecc.
      for (let j = 0; j < viewsToInsert; j++) {
        // Distribuisci nei passati 6 giorni
        const daysAgo = j % 6;
        const randomUser = users[Math.floor(Math.random() * users.length)].id;
        await pool.query(
          `INSERT INTO story_views (story_id, user_id, viewed_at) VALUES ($1, $2, NOW() - INTERVAL '${daysAgo} days')`,
          [storyId, randomUser]
        );
        viewInsertCount++;
      }
    }
    console.log(`[SEED] Inserite ${viewInsertCount} visualizzazioni recenti negli ultimi 7 giorni.`);

    // 4. Genera follows per popolare gli artisti
    await pool.query('DELETE FROM follows');
    let followCount = 0;
    for (let i = 0; i < Math.min(10, users.length); i++) {
      const followedId = users[i].id;
      const followerCountForUser = 10 - i; // Il primo ha più followers
      for (let j = 0; j < followerCountForUser; j++) {
        const followerId = users[(i + j + 1) % users.length].id;
        if (followerId !== followedId) {
          await pool.query(
            'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [followerId, followedId]
          );
          followCount++;
        }
      }
    }
    console.log(`[SEED] Inserite relazioni di follow per ${followCount} combinazioni.`);

    console.log('[SEED] Seeding completato con successo!');
    process.exit(0);
  } catch (err) {
    console.error('[SEED ERROR] Errore durante il seeding:', err);
    process.exit(1);
  }
}

runSeed();
