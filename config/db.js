/**
 * Database Config - EduHub MySQL Connection Pool (config/db.js)
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'eduhub_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Tạo Connection Pool kết nối MySQL DB
const pool = mysql.createPool(dbConfig);

// Trợ giúp kiểm tra trạng thái kết nối
async function checkConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ [MySQL Database] Kết nối MySQL Database thành công!');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ [MySQL Database Warning] Không thể kết nối trực tiếp đến MySQL Server:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  dbConfig,
  checkConnection,
  query: async (sql, params) => {
    const [rows, fields] = await pool.query(sql, params);
    return rows;
  },
  execute: async (sql, params) => {
    const [result] = await pool.execute(sql, params);
    return result;
  }
};
