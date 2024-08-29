const mysql = require('mysql2/promise');

const dbConfig = {
  connectionLimit: 10,
  socketPath: process.env.DB_SOCKET_PATH,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
};

const pool = mysql.createPool(dbConfig);

const query = async (sql, params) => {
  try {
    const [rows, fields] = await pool.execute(sql, params);
    return [rows, fields];
  } catch (error) {
    console.error('SQL Query Error:', sql);
    console.error('SQL Parameters:', params);
    console.error('Error details:', error);
    throw error;
  }
};

module.exports = { query, pool };
