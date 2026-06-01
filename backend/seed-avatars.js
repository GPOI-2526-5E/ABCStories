const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function seedAvatars() {
  try {
    const usersRes = await pool.query('SELECT id, username FROM users');
    const users = usersRes.rows;
    let updated = 0;

    for (const user of users) {
      // Sceglie a caso tra uomo (men) e donna (women)
      const gender = Math.random() > 0.5 ? 'men' : 'women';
      // Numero casuale tra 1 e 99 per l'immagine
      const photoId = Math.floor(Math.random() * 99);
      
      // Usa randomuser.me per avere foto reali di persone
      const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${photoId}.jpg`;

      await pool.query(
        'UPDATE users SET avatar_url = $1 WHERE id = $2',
        [avatarUrl, user.id]
      );
      
      updated++;
    }

    console.log(`Aggiornati con successo ${updated} avatar con foto reali.`);
    process.exit(0);
  } catch (err) {
    console.error('Errore durante l\'aggiornamento degli avatar:', err);
    process.exit(1);
  }
}

seedAvatars();
