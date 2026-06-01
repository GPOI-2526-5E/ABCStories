const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', password: 'postgres', host: 'localhost', port: 5432, database: 'postgres' });

async function test() {
  try {
    const result = await pool.query(`
      INSERT INTO chapters (story_id, title, content, order_index, status)
      VALUES ('80fcb1dc-acd5-49c6-b6f1-10fd53828bb6', 'Nuovo Capitolo', '', 1, 'draft')
      RETURNING *
    `);
    console.log("Success:", result.rows);
  } catch (err) {
    console.error("Error:", err.message);
  }
  pool.end();
}
test();
