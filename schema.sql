-- MySQL Database Schema cho EduHub Platform (schema.sql)
CREATE DATABASE IF NOT EXISTS eduhub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE eduhub_db;

-- 1. Bảng Người dùng (users)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE,
  role VARCHAR(20) DEFAULT 'student',
  department VARCHAR(100) DEFAULT 'CNTT',
  avatar VARCHAR(255),
  cover VARCHAR(255),
  bio TEXT,
  followers_count INT DEFAULT 0,
  following_count INT DEFAULT 0,
  points INT DEFAULT 100,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng Thảo luận & Bài viết (posts)
CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_username VARCHAR(50),
  department VARCHAR(100) DEFAULT 'CNTT',
  title VARCHAR(255) NOT NULL,
  content LONGTEXT NOT NULL,
  tags VARCHAR(255),
  code_snippet LONGTEXT,
  status VARCHAR(20) DEFAULT 'approved',
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng Tài liệu Học tập (documents)
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_username VARCHAR(50),
  department VARCHAR(100) DEFAULT 'CNTT',
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_type VARCHAR(20) DEFAULT 'pdf',
  file_size VARCHAR(50) DEFAULT '2.4 MB',
  download_url VARCHAR(255),
  downloads_count INT DEFAULT 0,
  likes_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'approved',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_doc_user (user_id),
  INDEX idx_doc_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng Bình luận (comments)
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR(50) PRIMARY KEY,
  target_type VARCHAR(20) NOT NULL DEFAULT 'post',
  target_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  author_name VARCHAR(100) NOT NULL,
  author_avatar VARCHAR(255),
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_target (target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng Lượt thích (likes)
CREATE TABLE IF NOT EXISTS likes (
  id VARCHAR(50) PRIMARY KEY,
  target_type VARCHAR(20) NOT NULL DEFAULT 'post',
  target_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_like (target_type, target_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng Mục đã lưu (saved_items)
CREATE TABLE IF NOT EXISTS saved_items (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  target_type VARCHAR(20) NOT NULL DEFAULT 'post',
  target_id VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_save (user_id, target_type, target_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng Bạn bè & Kết nối (friends)
CREATE TABLE IF NOT EXISTS friends (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  friend_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'accepted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_friendship (user_id, friend_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng Báo cáo Vi phạm (reports)
CREATE TABLE IF NOT EXISTS reports (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  reporter_id VARCHAR(50) NOT NULL,
  reporter_name VARCHAR(100) NOT NULL,
  target_type VARCHAR(20) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(20) DEFAULT 'high',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rep_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng Thông báo (notifications)
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  type VARCHAR(50) DEFAULT 'system',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link VARCHAR(255) DEFAULT 'index.html',
  icon VARCHAR(50) DEFAULT 'notifications',
  icon_bg VARCHAR(100) DEFAULT 'bg-primary text-on-primary',
  is_read TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
