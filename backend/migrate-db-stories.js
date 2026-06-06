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

async function migrate() {
  try {
    console.log("Starting database migration to drop columns from stories table...");
    
    // First drop the index on rating if it exists, otherwise it might conflict
    await pool.query('DROP INDEX IF EXISTS idx_stories_rating;');
    console.log("Index idx_stories_rating dropped (if existed).");

    // Drop rating and readers_count columns from stories table
    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS rating;');
    console.log("Column 'rating' dropped from stories table.");

    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS readers_count;');
    console.log("Column 'readers_count' dropped from stories table.");

    // Drop release_year and pages columns from stories table
    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS release_year;');
    console.log("Column 'release_year' dropped from stories table.");

    await pool.query('ALTER TABLE stories DROP COLUMN IF EXISTS pages;');
    console.log("Column 'pages' dropped from stories table.");

    // Add created_at column to stories table
    await pool.query('ALTER TABLE stories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();');
    console.log("Column 'created_at' added/verified in stories table.");

    console.log("Database migration completed successfully.");
  } catch (err) {
    console.error("Error running database migration:", err);
  } finally {
    await pool.end();
  }
}

migrate();
