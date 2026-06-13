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
    console.log("Starting database migration for notifications and follows tables...");

    // 1. Create notifications table IF NOT EXISTS (without dropping it!)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
        story_id UUID REFERENCES stories(id) ON DELETE SET NULL,
        chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
        type VARCHAR(50) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log("Notifications table verified/created.");

    // 2. Adjust constraint for story_id to ON DELETE SET NULL
    try {
      await pool.query('ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_story_id_fkey;');
      await pool.query('ALTER TABLE notifications ADD CONSTRAINT notifications_story_id_fkey FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE SET NULL;');
      console.log("Foreign key constraint notifications_story_id_fkey updated to ON DELETE SET NULL.");
    } catch (err) {
      console.log("Note: Could not update notifications_story_id_fkey constraint:", err.message);
    }

    // Adjust constraint for chapter_id to ON DELETE SET NULL
    try {
      await pool.query('ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_chapter_id_fkey;');
      await pool.query('ALTER TABLE notifications ADD CONSTRAINT notifications_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL;');
      console.log("Foreign key constraint notifications_chapter_id_fkey updated to ON DELETE SET NULL.");
    } catch (err) {
      console.log("Note: Could not update notifications_chapter_id_fkey constraint:", err.message);
    }

    // 3. Create indexes for notifications
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);');
    console.log("Indexes checked/created.");

    // 4. Alter follows table to add enable_notifications column
    await pool.query(`
      ALTER TABLE follows ADD COLUMN IF NOT EXISTS enable_notifications BOOLEAN DEFAULT TRUE;
    `);
    console.log("Column 'enable_notifications' added/verified in follows table.");

    // 5. Alter users table to add settings columns
    await pool.query(`
      ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'tropical',
        ADD COLUMN IF NOT EXISTS notifiche_commenti BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_seguaci BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS notifiche_newsletter BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS privacy_profilo_pubblico BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS privacy_mostra_libreria BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS privacy_indicizza BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS reading_font VARCHAR(50) DEFAULT 'sans-serif',
        ADD COLUMN IF NOT EXISTS reading_font_size VARCHAR(50) DEFAULT 'medium',
        ADD COLUMN IF NOT EXISTS reading_mode VARCHAR(50) DEFAULT 'scroll',
        ADD COLUMN IF NOT EXISTS reading_width VARCHAR(50) DEFAULT 'medium',
        ADD COLUMN IF NOT EXISTS sensitive_filter BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS notifiche_risposte_commenti BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_like_commenti BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_nuovo_follower BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_storie_like BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_storie_preferiti BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti_nuova_storia BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti_nuovo_capitolo BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti_modifica_storia BOOLEAN DEFAULT TRUE,
        ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti_modifica_capitolo BOOLEAN DEFAULT TRUE;
    `);
    console.log("Settings columns added/verified in users table.");

    console.log("Database migration completed successfully.");
  } catch (err) {
    console.error("Error running database migration:", err);
  } finally {
    await pool.end();
  }
}

migrate();
