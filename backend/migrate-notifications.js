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
    console.log("Starting database migration for notifications table...");
    
    // Drop the notifications table if it exists
    await pool.query('DROP TABLE IF EXISTS notifications CASCADE;');
    console.log("Notifications table dropped.");

    // Recreate the notifications table with current schema
    await pool.query(`
      CREATE TABLE notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
        chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Notifications table recreated successfully.");

    // Create indexes for better query performance
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);');
    console.log("Index idx_notifications_user_id created.");

    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);');
    console.log("Index idx_notifications_is_read created.");

    console.log("Database migration completed successfully.");
  } catch (err) {
    console.error("Error running database migration:", err);
  } finally {
    await pool.end();
  }
}

migrate();
