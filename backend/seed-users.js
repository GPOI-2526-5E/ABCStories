const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const bios = [
  "Appassionato di romanzi storici e avventure fantasy.",
  "Leggo per vivere mille vite diverse.",
  "Amo i classici della letteratura e la poesia contemporanea.",
  "Sempre alla ricerca del prossimo libro da divorare.",
  "Scrittore amatoriale e lettore accanito.",
  "La biblioteca è il mio posto felice.",
  "Un buon libro e una tazza di tè sono tutto ciò che mi serve.",
  "Viaggiatore, sognatore, lettore.",
  "Collezionista di prime edizioni e storie indimenticabili.",
  "Non c'è amico più leale di un libro."
];

const locations = [
  "Roma, Italia",
  "Milano, Italia",
  "Napoli, Italia",
  "Firenze, Italia",
  "Torino, Italia",
  "Venezia, Italia",
  "Londra, UK",
  "New York, USA",
  "Parigi, Francia",
  "Madrid, Spagna"
];

async function seedUsers() {
  try {
    const usersRes = await pool.query('SELECT id, username FROM users');
    const users = usersRes.rows;
    let updated = 0;

    for (const user of users) {
      const randomBio = bios[Math.floor(Math.random() * bios.length)];
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      
      // Clean username for URLs
      const safeUsername = user.username ? user.username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() : 'user' + updated;
      
      const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${safeUsername}`;
      const websiteUrl = `https://${safeUsername}.blog.com`;

      await pool.query(
        `UPDATE users 
         SET avatar_url = COALESCE(avatar_url, $1),
             bio = COALESCE(bio, $2),
             location = COALESCE(location, $3),
             website_url = COALESCE(website_url, $4)
         WHERE id = $5`,
        [avatarUrl, randomBio, randomLocation, websiteUrl, user.id]
      );
      
      updated++;
    }

    console.log(`Aggiornati con successo ${updated} utenti con i nuovi dati.`);
    process.exit(0);
  } catch (err) {
    console.error('Errore durante l\'aggiornamento degli utenti:', err);
    process.exit(1);
  }
}

seedUsers();
