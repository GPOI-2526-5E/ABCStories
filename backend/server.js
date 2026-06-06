const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 12;

// Permetti richieste dal frontend Vercel (e da localhost in sviluppo)
const allowedOrigins = [
  'http://localhost:4200',
  process.env.FRONTEND_URL,
].filter(Boolean).map(o => o.replace(/\/$/, '')); // rimuove slash finale

app.use(cors({
  origin: (origin, callback) => {
    const normalizedOrigin = origin ? origin.replace(/\/$/, '') : origin;
    if (!normalizedOrigin || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
// Aumentato a 20MB per permettere il trasferimento di immagini Base64
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Connessione DB: usa DATABASE_URL se disponibile (Railway), altrimenti credenziali locali
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


app.get('/api/prova', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM prova');
    res.json(result.rows);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/user/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        id, username, email, avatar_url, bio, location, website_url, created_at,
        social_instagram, social_twitter, social_facebook, social_website, social_tiktok, social_linkedin,
        (SELECT count(*) FROM stories WHERE author_id = users.id) as stories_count
      FROM users WHERE id = $1`, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/user/:id', async (req, res) => {
  const { 
    username, 
    bio, 
    location, 
    avatar_url,
    social_instagram, 
    social_twitter, 
    social_facebook, 
    social_website, 
    social_tiktok, 
    social_linkedin 
  } = req.body;
  try {
    const result = await pool.query(`
      UPDATE users 
      SET 
        username = COALESCE($1, username),
        bio = $2,
        location = $3,
        avatar_url = $4,
        social_instagram = $5,
        social_twitter = $6,
        social_facebook = $7,
        social_website = $8,
        social_tiktok = $9,
        social_linkedin = $10
      WHERE id = $11
      RETURNING *
    `, [
      username || null,
      bio || null,
      location || null,
      avatar_url || null,
      social_instagram || null, 
      social_twitter || null, 
      social_facebook || null, 
      social_website || null,
      social_tiktok || null,
      social_linkedin || null,
      req.params.id
    ]);
    
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Seleziona l'utente solo tramite l'email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      // Confronta la password in chiaro con l'hash estratto dal database
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (isMatch) {
        // Rimuovi l'hash dall'oggetto user prima di inviarlo al frontend per sicurezza
        delete user.password_hash;

        res.json({ success: true, user });
      } else {
        // Password errata
        res.status(401).json({ error: 'Invalid email or password' });
      }
    } else {
      // Email non trovata
      res.status(401).json({ error: 'Invalid email or password' });
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/user/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Controlla se email o username esistono già
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email o username già in uso' });
    }

    // Genera l'hash della password prima di salvarla
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Salva l'hash nel database anziché la password in chiaro
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ═══════════════ USER SETTINGS & RECOMMENDED ═══════════════

// Ottieni le storie raccomandate da un utente
app.get('/api/user/:userId/recommended', async (req, res) => {
  try {
    const userRes = await pool.query('SELECT recommended_story_ids FROM users WHERE id = $1', [req.params.userId]);
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Utente non trovato' });
    
    const storyIds = userRes.rows[0].recommended_story_ids || [];
    if (storyIds.length === 0) return res.json([]);

    // Recupera i dettagli delle storie raccomandate
    const storiesRes = await pool.query(`
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.id = ANY($1) AND s.status = 'published'
    `, [storyIds]);
    
    res.json(storiesRes.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggiorna le storie raccomandate da un utente
app.put('/api/user/:userId/recommended', async (req, res) => {
  const { storyIds } = req.body;
  if (!Array.isArray(storyIds)) return res.status(400).json({ error: 'storyIds deve essere un array' });
  
  try {
    await pool.query('UPDATE users SET recommended_story_ids = $1 WHERE id = $2', [storyIds, req.params.userId]);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ═══════════════ LIKES ═══════════════

// Toggle like (inserisce se non esiste, elimina se esiste)
app.post('/api/likes/toggle', async (req, res) => {
  const { user_id, story_id } = req.body;
  try {
    const exists = await pool.query(
      'SELECT 1 FROM story_likes WHERE user_id = $1 AND story_id = $2',
      [user_id, story_id]
    );
    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM story_likes WHERE user_id = $1 AND story_id = $2', [user_id, story_id]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO story_likes (user_id, story_id) VALUES ($1, $2)', [user_id, story_id]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Restituisce gli ID delle storie liked dall'utente
app.get('/api/likes/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT story_id FROM story_likes WHERE user_id = $1',
      [req.params.userId]
    );
    res.json(result.rows.map(r => r.story_id));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Recupera le recensioni di una specifica storia
app.get('/api/stories/:storyId/reviews', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.id, r.content, r.rating, u.username as name
       FROM reviews r
       JOIN users u ON r.author_id = u.id
       WHERE r.story_id = $1`,
      [req.params.storyId]
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Restituisce le storie liked con tutti i dettagli (per il profilo utente)
app.get('/api/likes/:userId/stories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
              u.username AS author_name, sl.created_at AS liked_at
       FROM story_likes sl
       JOIN stories s ON s.id = sl.story_id
       LEFT JOIN users u ON u.id = s.author_id
       WHERE sl.user_id = $1
       ORDER BY sl.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ BOOKMARKS ═══════════════

// Toggle bookmark (inserisce se non esiste, elimina se esiste)
app.post('/api/bookmarks/toggle', async (req, res) => {
  const { user_id, story_id } = req.body;
  try {
    const exists = await pool.query(
      'SELECT 1 FROM story_bookmarks WHERE user_id = $1 AND story_id = $2',
      [user_id, story_id]
    );
    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM story_bookmarks WHERE user_id = $1 AND story_id = $2', [user_id, story_id]);
      res.json({ bookmarked: false });
    } else {
      await pool.query('INSERT INTO story_bookmarks (user_id, story_id) VALUES ($1, $2)', [user_id, story_id]);
      res.json({ bookmarked: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Restituisce gli ID delle storie bookmarked dall'utente
app.get('/api/bookmarks/:userId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT story_id FROM story_bookmarks WHERE user_id = $1',
      [req.params.userId]
    );
    res.json(result.rows.map(r => r.story_id));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Restituisce le storie bookmarked con tutti i dettagli (per il profilo utente)
app.get('/api/bookmarks/:userId/stories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, 
              (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
              u.username AS author_name, sb.created_at AS bookmarked_at
       FROM story_bookmarks sb
       JOIN stories s ON s.id = sb.story_id
       LEFT JOIN users u ON u.id = s.author_id
       WHERE sb.user_id = $1
       ORDER BY sb.created_at DESC`,
      [req.params.userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ═══════════════ COMMENTS ═══════════════

// Ottieni commenti e risposte di una storia, incluso il conteggio dei like e lo stato like dell'utente se passato
app.get('/api/stories/:storyId/comments', async (req, res) => {
  const userId = req.query.userId || null;
  try {
    // 1. Prendi tutti i commenti
    const commentsRes = await pool.query(`
      SELECT c.id, c.content as text, c.created_at, 
             u.id as author_id, u.username as author_name, u.email as author_handle, u.avatar_url,
             (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) as likes_count
             ${userId ? `, EXISTS(SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = $2) as user_liked` : ''}
      FROM comments c
      JOIN users u ON u.id = c.author_id
      WHERE c.story_id = $1
      ORDER BY c.created_at DESC
    `, userId ? [req.params.storyId, userId] : [req.params.storyId]);
    
    const comments = commentsRes.rows;

    // 2. Prendi tutte le risposte per questi commenti
    if (comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      const repliesRes = await pool.query(`
        SELECT r.id, r.comment_id, r.content as text, r.created_at,
               u.id as author_id, u.username as author_name, u.email as author_handle, u.avatar_url,
               (SELECT COUNT(*) FROM reply_likes rl WHERE rl.reply_id = r.id) as likes_count
               ${userId ? `, EXISTS(SELECT 1 FROM reply_likes rl WHERE rl.reply_id = r.id AND rl.user_id = $2) as user_liked` : ''}
        FROM comment_replies r
        JOIN users u ON u.id = r.author_id
        WHERE r.comment_id = ANY($1)
        ORDER BY r.created_at ASC
      `, userId ? [commentIds, userId] : [commentIds]);
      
      const replies = repliesRes.rows;
      
      // Associa le risposte ai commenti
      comments.forEach(c => {
        c.replies = replies.filter(r => r.comment_id === c.id);
      });
    }

    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggiungi commento
app.post('/api/stories/:storyId/comments', async (req, res) => {
  const { author_id, content } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO comments (story_id, author_id, content) 
      VALUES ($1, $2, $3) RETURNING id, content, created_at
    `, [req.params.storyId, author_id, content]);
    
    // Ritorna il commento appena creato
    const userRes = await pool.query('SELECT username as author_name, email as author_handle, avatar_url FROM users WHERE id = $1', [author_id]);
    res.json({ ...result.rows[0], ...userRes.rows[0], likes_count: 0, user_liked: false, replies: [] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggiungi risposta
app.post('/api/comments/:commentId/replies', async (req, res) => {
  const { author_id, content } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO comment_replies (comment_id, author_id, content) 
      VALUES ($1, $2, $3) RETURNING id, comment_id, content, created_at
    `, [req.params.commentId, author_id, content]);
    
    const userRes = await pool.query('SELECT username as author_name, email as author_handle, avatar_url FROM users WHERE id = $1', [author_id]);
    res.json({ ...result.rows[0], ...userRes.rows[0], likes_count: 0, user_liked: false });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Toggle like commento
app.post('/api/comments/:commentId/like', async (req, res) => {
  const { user_id } = req.body;
  try {
    const exists = await pool.query('SELECT 1 FROM comment_likes WHERE user_id = $1 AND comment_id = $2', [user_id, req.params.commentId]);
    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2', [user_id, req.params.commentId]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO comment_likes (user_id, comment_id) VALUES ($1, $2)', [user_id, req.params.commentId]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Toggle like risposta
app.post('/api/comments/replies/:replyId/like', async (req, res) => {
  const { user_id } = req.body;
  try {
    const exists = await pool.query('SELECT 1 FROM reply_likes WHERE user_id = $1 AND reply_id = $2', [user_id, req.params.replyId]);
    if (exists.rows.length > 0) {
      await pool.query('DELETE FROM reply_likes WHERE user_id = $1 AND reply_id = $2', [user_id, req.params.replyId]);
      res.json({ liked: false });
    } else {
      await pool.query('INSERT INTO reply_likes (user_id, reply_id) VALUES ($1, $2)', [user_id, req.params.replyId]);
      res.json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ═══════════════ STORIES ═══════════════

// Tutte le storie
app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
              (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
              s.pages, s.release_year,
              u.username AS author_name
       FROM stories s
       LEFT JOIN users u ON u.id = s.author_id
       WHERE s.status = 'published'
       ORDER BY rating DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ── Route specifiche PRIMA di :id (altrimenti Express cattura come id) ──

// Storie popolari (più visualizzazioni totali)
app.get('/api/stories/popular', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name,
             COUNT(sv.id) AS view_count
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN story_views sv ON sv.story_id = s.id
      WHERE s.status = 'published'
      GROUP BY s.id, u.username
      ORDER BY view_count DESC, rating DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie di tendenza (visualizzazioni recenti o dalla registrazione utente)
app.get('/api/stories/trending', async (req, res) => {
  try {
    let dateFilter = "NOW() - INTERVAL '7 days'";
    
    // Se viene passato userId, consideriamo le visualizzazioni dalla sua registrazione (se più recente di 7 giorni)
    if (req.query.userId) {
      const userRes = await pool.query('SELECT created_at FROM users WHERE id = $1', [req.query.userId]);
      if (userRes.rows.length > 0) {
        // Usa la data di registrazione se esiste
        dateFilter = `(SELECT created_at FROM users WHERE id = $1)`;
      }
    }

    const query = `
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name,
             COUNT(sv.id) AS week_views
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN story_views sv
        ON sv.story_id = s.id
        AND sv.viewed_at >= ${req.query.userId ? dateFilter : "NOW() - INTERVAL '7 days'"}
      WHERE s.status = 'published'
      GROUP BY s.id, u.username
      ORDER BY week_views DESC, rating DESC
      LIMIT 15
    `;
    
    const params = req.query.userId ? [req.query.userId] : [];
    const result = await pool.query(query, params);
    
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie simili (Potrebbero piacerti anche)
app.get('/api/stories/similar/:storyId', async (req, res) => {
  try {
    // Prima otteniamo il genere della storia corrente
    const storyRes = await pool.query('SELECT genre FROM stories WHERE id = $1', [req.params.storyId]);
    if (storyRes.rows.length === 0) return res.json([]);
    
    const genre = storyRes.rows[0].genre;
    if (!genre) return res.json([]);

    // Troviamo storie simili per genere, escludendo quella corrente, ordinate per popolarità
    const result = await pool.query(`
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name,
             COUNT(sv.id) AS view_count
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN story_views sv ON sv.story_id = s.id
      WHERE s.status = 'published' 
        AND s.id != $1 
        AND s.genre ILIKE $2
      GROUP BY s.id, u.username
      ORDER BY view_count DESC, rating DESC
      LIMIT 50
    `, [req.params.storyId, `%${genre}%`]);
    
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie filtrate per genere
app.get('/api/stories/genre/:genre', async (req, res) => {
  try {
    const genre = `%${req.params.genre}%`;
    const result = await pool.query(`
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.genre ILIKE $1 AND s.status = 'published'
      ORDER BY rating DESC
    `, [genre]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie con lettura incompleta (Riprendi a leggere)
app.get('/api/stories/continue/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH LastRead AS (
        SELECT DISTINCT ON (c.story_id)
               rp.chapter_id,
               rp.progress_pct,
               rp.updated_at,
               c.story_id,
               c.order_index AS chapter_num,
               c.title AS chapter_title
        FROM reading_progress rp
        JOIN chapters c ON c.id = rp.chapter_id
        WHERE rp.user_id = $1
        ORDER BY c.story_id, rp.updated_at DESC
      )
      SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name,
             lr.progress_pct,
             lr.chapter_id,
             lr.chapter_num,
             lr.chapter_title,
             lr.updated_at AS last_read_at
      FROM LastRead lr
      JOIN stories s ON s.id = lr.story_id
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.status = 'published' AND NOT (
        lr.progress_pct = 100 AND 
        lr.chapter_num = (SELECT MAX(order_index) FROM chapters WHERE story_id = lr.story_id)
      )
      ORDER BY lr.updated_at DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Singola storia per UUID (deve stare DOPO le route specifiche)
app.get('/api/stories/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.author_id, s.title, s.description, s.genre, s.image_url,
              (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
              (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
              s.pages, s.release_year,
              u.username AS author_name,
              (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS views_count
       FROM stories s
       LEFT JOIN users u ON u.id = s.author_id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Storia non trovata' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ VIEWS ═══════════════

// Registra una visualizzazione
app.post('/api/views', async (req, res) => {
  const { story_id, user_id } = req.body;
  if (!story_id) return res.status(400).json({ error: 'story_id obbligatorio' });
  try {
    if (user_id) {
      const existing = await pool.query(
        'SELECT 1 FROM story_views WHERE story_id = $1 AND user_id = $2',
        [story_id, user_id]
      );
      if (existing.rows.length > 0) {
        return res.json({ ok: true, duplicate: true });
      }
    }
    await pool.query(
      'INSERT INTO story_views (story_id, user_id) VALUES ($1, $2)',
      [story_id, user_id || null]
    );
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ READING PROGRESS ═══════════════

// Leggi progresso per una storia (tutti i capitoli)
app.get('/api/progress/:userId/:storyId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT rp.chapter_id, rp.progress_pct, rp.updated_at,
             c.order_index, c.title AS chapter_title,
             (SELECT COUNT(*) FROM chapters WHERE story_id = $2) AS total_chapters
      FROM reading_progress rp
      JOIN chapters c ON c.id = rp.chapter_id
      WHERE rp.user_id = $1 AND c.story_id = $2
      ORDER BY c.order_index
    `, [req.params.userId, req.params.storyId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Salva / aggiorna progresso di lettura
app.post('/api/progress', async (req, res) => {
  const { user_id, chapter_id, progress_pct } = req.body;
  if (!user_id || !chapter_id) return res.status(400).json({ error: 'Parametri mancanti' });
  try {
    await pool.query(`
      INSERT INTO reading_progress (user_id, chapter_id, progress_pct, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, chapter_id)
      DO UPDATE SET progress_pct = $3, updated_at = NOW()
    `, [user_id, chapter_id, progress_pct ?? 0]);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ CHAPTERS ═══════════════

// Lista capitoli di una storia
app.get('/api/stories/:id/chapters', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, order_index, status, image_url
      FROM chapters
      WHERE story_id = $1 AND status = 'published'
      ORDER BY order_index
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Contenuto di un singolo capitolo
app.get('/api/chapters/:id', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.title, c.content, c.order_index, c.story_id, COALESCE(c.image_url, s.image_url) AS image_url,
             s.title AS story_title,
             u.username AS author_name,
             (SELECT COUNT(*) FROM chapters WHERE story_id = c.story_id AND status = 'published') AS total_chapters
      FROM chapters c
      JOIN stories s ON s.id = c.story_id
      LEFT JOIN users u ON u.id = s.author_id
      WHERE c.id = $1
    `, [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Capitolo non trovato' });
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ FOLLOWS & AUTHOR ═══════════════

// Segui un utente
app.post('/api/follows', async (req, res) => {
  const { follower_id, followed_id } = req.body;
  try {
    const existing = await pool.query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2',
      [follower_id, followed_id]
    );
    if (existing.rows.length === 0) {
      await pool.query(
        'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)',
        [follower_id, followed_id]
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Smetti di seguire un utente
app.delete('/api/follows/:followerId/:followedId', async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2',
      [req.params.followerId, req.params.followedId]
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ottieni gli utenti che seguono un autore (Followers)
app.get('/api/follows/followers/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.username as name, u.email as handle, u.bio as description, u.avatar_url,
        (SELECT COUNT(*) FROM stories WHERE author_id = u.id AND status = 'published') as stories_count,
        (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
      FROM users u
      JOIN follows f ON f.follower_id = u.id
      WHERE f.followed_id = $1
      ORDER BY f.created_at DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ottieni i conteggi di followers e seguiti
app.get('/api/follows/count/:userId', async (req, res) => {
  try {
    const followers = await pool.query('SELECT COUNT(*) FROM follows WHERE followed_id = $1', [req.params.userId]);
    const following = await pool.query('SELECT COUNT(*) FROM follows WHERE follower_id = $1', [req.params.userId]);
    res.json({
      followersCount: parseInt(followers.rows[0].count, 10),
      followingCount: parseInt(following.rows[0].count, 10)
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Ottieni gli autori seguiti da un utente
app.get('/api/follows/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.username as name, u.email as handle, u.avatar_url, u.bio as description,
        (SELECT COUNT(*) FROM stories WHERE author_id = u.id AND status = 'published') as stories_count,
        (SELECT COUNT(*) FROM follows WHERE followed_id = u.id) as followers_count,
        (SELECT COUNT(*) FROM follows WHERE follower_id = u.id) as following_count
      FROM users u
      JOIN follows f ON f.followed_id = u.id
      WHERE f.follower_id = $1
      ORDER BY f.created_at DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Controlla se un utente ne segue un altro
app.get('/api/follows/check/:followerId/:followedId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT 1 FROM follows WHERE follower_id = $1 AND followed_id = $2',
      [req.params.followerId, req.params.followedId]
    );
    res.json({ following: result.rows.length > 0 });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie di uno specifico autore
app.get('/api/stories/author/:authorId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.title, s.description, s.genre, s.image_url,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             u.username AS author_name
      FROM stories s
      JOIN users u ON u.id = s.author_id
      WHERE s.author_id = $1 AND s.status = 'published'
      ORDER BY rating DESC
    `, [req.params.authorId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ═══════════════ AUTHOR DASHBOARD & EDITOR ═══════════════

// Recupera tutte le storie di un autore (incluse bozze)
app.get('/api/author/my-stories/:userId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.title, s.description, s.genre, s.image_url, s.status,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS readers_count,
             (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE story_id = s.id) AS rating,
             s.pages, s.release_year,
             (SELECT COUNT(*) FROM story_views WHERE story_id = s.id) AS views_count
      FROM stories s
      WHERE s.author_id = $1
      ORDER BY s.id DESC
    `, [req.params.userId]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Crea una nuova storia (bozza)
app.post('/api/stories', async (req, res) => {
  const { author_id, title, genre } = req.body;
  const defaultImage = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80';
  try {
    const result = await pool.query(`
      INSERT INTO stories (author_id, title, genre, status, image_url)
      VALUES ($1, $2, $3, 'draft', $4)
      RETURNING *
    `, [author_id, title, genre || 'Romanzo', defaultImage]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggiorna una storia
app.put('/api/stories/:id', async (req, res) => {
  let { title, description, genre, image_url, status } = req.body;
  // Se image_url è vuota o non fornita, mantieni quella esistente (COALESCE gestisce null)
  const imageToSave = (image_url && image_url.trim() !== '') ? image_url : null;
  try {
    const result = await pool.query(`
      UPDATE stories
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          genre = COALESCE($3, genre),
          image_url = COALESCE($4, image_url),
          status = COALESCE($5, status)
      WHERE id = $6
      RETURNING *
    `, [title, description, genre, imageToSave, status, req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Elimina una storia
app.delete('/api/stories/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM chapters WHERE story_id = $1', [req.params.id]);
    await pool.query('DELETE FROM stories WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Recupera i capitoli di una storia (per l'editor - include bozze)
app.get('/api/author/stories/:id/chapters', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM chapters WHERE story_id = $1 ORDER BY order_index ASC
    `, [req.params.id]);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Crea un nuovo capitolo
app.post('/api/chapters', async (req, res) => {
  const { story_id, title, content, order_index } = req.body;
  const defaultImage = 'https://images.unsplash.com/photo-1455390582262-044cdead2708?auto=format&fit=crop&w=800&q=80';
  try {
    const result = await pool.query(`
      INSERT INTO chapters (story_id, title, content, order_index, status, image_url)
      VALUES ($1, $2, $3, $4, 'published', $5)
      RETURNING *
    `, [story_id, title || 'Nuovo Capitolo', content || '', order_index || 1, defaultImage]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Aggiorna un capitolo
app.put('/api/chapters/:id', async (req, res) => {
  let { title, content, status, image_url } = req.body;
  // Se image_url è vuota o non fornita, mantieni quella esistente (COALESCE gestisce null)
  const imageToSave = (image_url && image_url.trim() !== '') ? image_url : null;
  try {
    const result = await pool.query(`
      UPDATE chapters
      SET title = COALESCE($1, title),
          content = COALESCE($2, content),
          status = COALESCE($3, status),
          image_url = COALESCE($4, image_url)
      WHERE id = $5
      RETURNING *
    `, [title, content, status, imageToSave, req.params.id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Elimina un capitolo
app.delete('/api/chapters/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM chapters WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

