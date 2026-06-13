-- ══════════════════════════════════════════════════════════════════════════════
-- ABCStories Unified Database Schema Update Script
-- Use this script to update your Railway PostgreSQL database schema
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. Table: email_verifications
CREATE TABLE IF NOT EXISTS email_verifications (
  email VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table: comment_replies
CREATE TABLE IF NOT EXISTS comment_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table: comment_likes
CREATE TABLE IF NOT EXISTS comment_likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, comment_id)
);

-- 5. Table: reply_likes
CREATE TABLE IF NOT EXISTS reply_likes (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES comment_replies(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, reply_id)
);

-- 6. Table: notifications
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

-- 7. Notification Constraints and Indexes
ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_story_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_story_id_fkey FOREIGN KEY (story_id) REFERENCES stories(id) ON DELETE SET NULL;

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_chapter_id_fkey;
ALTER TABLE notifications ADD CONSTRAINT notifications_chapter_id_fkey FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- 8. Alter follows table
ALTER TABLE follows ADD COLUMN IF NOT EXISTS enable_notifications BOOLEAN DEFAULT TRUE;

-- 9. Alter users table with theme and notification preferences
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
  ADD COLUMN IF NOT EXISTS notifiche_aggiornamenti_modifica_capitolo BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS visualizza_18plus BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS recommended_story_ids UUID[] DEFAULT '{}';

-- 10. Alter stories table
DROP INDEX IF EXISTS idx_stories_rating;
ALTER TABLE stories DROP COLUMN IF EXISTS rating;
ALTER TABLE stories DROP COLUMN IF EXISTS readers_count;
ALTER TABLE stories DROP COLUMN IF EXISTS release_year;
ALTER TABLE stories DROP COLUMN IF EXISTS pages;

ALTER TABLE stories 
  ADD COLUMN IF NOT EXISTS is_18_plus BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS completion_status VARCHAR(50) DEFAULT 'in_corso',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 11. Table: collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Table: collection_stories
CREATE TABLE IF NOT EXISTS collection_stories (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  PRIMARY KEY (collection_id, story_id)
);

ALTER TABLE collection_stories ADD COLUMN IF NOT EXISTS order_index INTEGER;
ALTER TABLE collection_stories ALTER COLUMN order_index DROP NOT NULL;

-- 13. Index on story_views
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
