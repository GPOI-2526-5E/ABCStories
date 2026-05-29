const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

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
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password_hash = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
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
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
})
