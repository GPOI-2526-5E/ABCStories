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

async function setup() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("comments table created.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comment_replies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        author_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("comment_replies table created.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comment_likes (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, comment_id)
      );
    `);
    console.log("comment_likes table created.");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS reply_likes (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        reply_id UUID REFERENCES comment_replies(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, reply_id)
      );
    `);
    console.log("reply_likes table created.");

    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS recommended_story_ids UUID[] DEFAULT '{}';
    `);
    console.log("recommended_story_ids column added to users.");

    // Create an index on story_views for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
    `);
    console.log("index idx_story_views_story_id created.");

    // Create an index on stories.rating
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_stories_rating ON stories(rating DESC);
    `);
    console.log("index idx_stories_rating created.");

    console.log("Database setup complete.");
  } catch (err) {
    console.error("Error setting up database", err);
  } finally {
    await pool.end();
  }
}

setup();
