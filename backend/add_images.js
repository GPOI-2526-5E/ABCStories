const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

const images = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80', // Spiaggia
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1000&q=80', // Montagne
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1000&q=80', // Foresta
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1000&q=80', // Lago
  'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=1000&q=80'  // Neve
];

async function updateChapters() {
  try {
    const res = await pool.query('SELECT id FROM chapters');
    for (let i = 0; i < res.rows.length; i++) {
      const chapterId = res.rows[i].id;
      const randomImage = images[i % images.length];
      await pool.query('UPDATE chapters SET image_url = $1 WHERE id = $2', [randomImage, chapterId]);
    }
    console.log(`Updated ${res.rows.length} chapters with sample images.`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    pool.end();
  }
}

updateChapters();
