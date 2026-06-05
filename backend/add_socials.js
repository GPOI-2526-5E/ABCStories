const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function run() {
  try {
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS social_instagram TEXT,
      ADD COLUMN IF NOT EXISTS social_twitter TEXT,
      ADD COLUMN IF NOT EXISTS social_facebook TEXT,
      ADD COLUMN IF NOT EXISTS social_website TEXT,
      ADD COLUMN IF NOT EXISTS social_tiktok TEXT,
      ADD COLUMN IF NOT EXISTS social_linkedin TEXT;
    `);
    console.log("Columns added successfully!");
  } catch (err) {
    console.error("Error adding columns:", err);
  } finally {
    pool.end();
  }
}

run();
