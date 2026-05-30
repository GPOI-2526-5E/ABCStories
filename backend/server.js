const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();
const SALT_ROUNDS = 12;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
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

// Restituisce le storie liked con tutti i dettagli (per il profilo utente)
app.get('/api/likes/:userId/stories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, sl.created_at AS liked_at
       FROM story_likes sl
       JOIN stories s ON s.id = sl.story_id
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
      `SELECT s.*, sb.created_at AS bookmarked_at
       FROM story_bookmarks sb
       JOIN stories s ON s.id = sb.story_id
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


// ═══════════════ STORIES ═══════════════

// Tutte le storie
app.get('/api/stories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, s.title, s.description, s.genre, s.image_url,
              s.readers_count, s.rating, s.pages, s.release_year,
              u.username AS author_name
       FROM stories s
       LEFT JOIN users u ON u.id = s.author_id
       ORDER BY s.rating DESC`
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
      SELECT s.id, s.title, s.description, s.genre, s.image_url,
             s.readers_count, s.rating, s.pages, s.release_year,
             u.username AS author_name,
             COUNT(sv.id) AS view_count
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN story_views sv ON sv.story_id = s.id
      GROUP BY s.id, u.username
      HAVING COUNT(sv.id) >= 0
      ORDER BY view_count DESC, s.rating DESC
      LIMIT 20
    `);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Storie di tendenza (visualizzazioni ultima settimana)
app.get('/api/stories/trending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.title, s.description, s.genre, s.image_url,
             s.readers_count, s.rating, s.pages, s.release_year,
             u.username AS author_name,
             COUNT(sv.id) AS week_views
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      LEFT JOIN story_views sv
        ON sv.story_id = s.id
        AND sv.viewed_at >= NOW() - INTERVAL '7 days'
      GROUP BY s.id, u.username
      ORDER BY week_views DESC, s.rating DESC
      LIMIT 15
    `);
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
      SELECT s.id, s.title, s.description, s.genre, s.image_url,
             s.readers_count, s.rating, s.pages, s.release_year,
             u.username AS author_name
      FROM stories s
      LEFT JOIN users u ON u.id = s.author_id
      WHERE s.genre ILIKE $1
      ORDER BY s.rating DESC
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
      SELECT s.id, s.title, s.description, s.genre, s.image_url,
             s.readers_count, s.rating, s.pages, s.release_year,
             u.username AS author_name,
             lr.progress_pct,
             lr.chapter_id,
             lr.chapter_num,
             lr.chapter_title,
             lr.updated_at AS last_read_at
      FROM LastRead lr
      JOIN stories s ON s.id = lr.story_id
      LEFT JOIN users u ON u.id = s.author_id
      WHERE NOT (
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
      `SELECT s.id, s.title, s.description, s.genre, s.image_url,
              s.readers_count, s.rating, s.pages, s.release_year,
              u.username AS author_name
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
      SELECT id, title, order_index, status
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
      SELECT c.id, c.title, c.content, c.order_index, c.story_id,
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

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})

