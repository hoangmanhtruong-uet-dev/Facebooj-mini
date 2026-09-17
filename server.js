/**
 * EduHub Platform - Main Backend Server (server.js)
 * Tích hợp MySQL REST API Backend & Express Static Server cho Frontend.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const initDatabase = require('./init-db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request URL
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`[API ${req.method}] ${req.url}`);
  }
  next();
});

// Register REST API Endpoints
app.use('/api', apiRoutes);

// Serve Frontend Static Views & Assets
app.use(express.static(path.join(__dirname, 'views')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname));

// Fallback route cho Single Page Document / Routing
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Khởi chạy Server
async function startServer() {
  // Khởi tạo Database trước khi bật server
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 [EduHub Server] Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 [MySQL REST API] Endpoints có sẵn tại: http://localhost:${PORT}/api/health`);
    console.log(`==================================================`);
  });
}

startServer();
