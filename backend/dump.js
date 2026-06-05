const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres', // db name from server.js
  password: 'postgres', // password from server.js
  port: 5432,
});

async function run() {
  const res = await pool.query('SELECT u.username, r.id, r.content FROM reviews r JOIN users u ON r.author_id = u.id WHERE r.story_id = $1', ['f0000000-0000-0000-0000-000000000050']);
  console.log(JSON.stringify(res.rows, null, 2));
  pool.end();
}

run();
