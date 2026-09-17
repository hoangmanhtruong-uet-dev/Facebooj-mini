/**
 * EduHub REST API Routes (routes/api.js)
 * Cung cấp toàn bộ RESTful Endpoints làm việc với MySQL Database.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Trợ giúp tạo ID
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

// ----------------------------------------------------
// 1. HEALTH CHECK & STATUS
// ----------------------------------------------------
router.get('/health', async (req, res) => {
  try {
    const isConnected = await db.checkConnection();
    return res.json({ status: 'ok', mysql: isConnected, timestamp: new Date() });
  } catch (err) {
    return res.status(500).json({ status: 'error', mysql: false, message: err.message });
  }
});

// ----------------------------------------------------
// 2. AUTHENTICATION API
// ----------------------------------------------------

// Đăng nhập
router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập tên tài khoản và mật khẩu!' });
    }

    const users = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác!' });
    }

    const user = users[0];
    // Chuyển đổi tên thuộc tính sang camelCase tương thích với Frontend
    const formattedUser = {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatar: user.avatar,
      bio: user.bio,
      points: user.points
    };

    return res.json({ success: true, user: formattedUser });
  } catch (err) {
    console.error('Lỗi login API:', err);
    return res.status(500).json({ error: 'Lỗi máy chủ khi đăng nhập MySQL DB' });
  }
});

// Đăng ký
router.post('/auth/register', async (req, res) => {
  try {
    const { username, password, fullName, email, department } = req.body;
    if (!username || !password || !fullName) {
      return res.status(400).json({ error: 'Thông tin đăng ký không đầy đủ!' });
    }

    const existing = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Tên đăng nhập này đã được sử dụng!' });
    }

    const userId = generateId('usr');
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`;

    await db.execute(
      `INSERT INTO users (id, username, password, full_name, email, role, department, avatar)
       VALUES (?, ?, ?, ?, ?, 'student', ?, ?)`,
      [userId, username, password, fullName, email || `${username}@vnu.edu.vn`, department || 'CNTT', avatar]
    );

    const newUser = {
      id: userId,
      username,
      fullName,
      email,
      role: 'student',
      department: department || 'CNTT',
      avatar,
      points: 100
    };

    return res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    console.error('Lỗi register API:', err);
    return res.status(500).json({ error: 'Lỗi đăng ký tài khoản vào MySQL' });
  }
});

// Lấy danh sách người dùng
router.get('/auth/users', async (req, res) => {
  try {
    const rows = await db.query('SELECT id, username, full_name as fullName, role, department, avatar FROM users');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 3. POSTS API
// ----------------------------------------------------

// Lấy danh sách bài viết
router.get('/posts', async (req, res) => {
  try {
    const { department, status = 'approved', userId } = req.query;
    let sql = 'SELECT * FROM posts WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (department && department !== 'Tất cả Khoa') {
      sql += ' AND department = ?';
      params.push(department);
    }

    if (userId) {
      sql += ' AND user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await db.query(sql, params);
    
    // Map về format frontend
    const posts = rows.map(p => ({
      id: p.id,
      userId: p.user_id,
      authorName: p.author_name,
      authorUsername: p.author_username,
      department: p.department,
      title: p.title,
      content: p.content,
      tags: p.tags ? p.tags.split(',') : [],
      codeSnippet: p.code_snippet,
      status: p.status,
      likes: new Array(p.likes_count).fill(0), // Mock array length
      likesCount: p.likes_count,
      commentsCount: p.comments_count,
      createdAt: p.created_at
    }));

    return res.json(posts);
  } catch (err) {
    console.error('Lỗi GET /posts:', err);
    return res.status(500).json({ error: 'Lỗi lấy bài viết từ MySQL' });
  }
});

// Tạo bài viết mới
router.post('/posts', async (req, res) => {
  try {
    const { userId, authorName, authorUsername, department, title, content, tags, codeSnippet } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Tiêu đề và nội dung không được để trống!' });
    }

    const postId = generateId('post');
    const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');

    await db.execute(
      `INSERT INTO posts (id, user_id, author_name, author_username, department, title, content, tags, code_snippet, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [postId, userId || 'usr_001', authorName || 'Sinh viên', authorUsername || 'student', department || 'CNTT', title, content, tagsStr, codeSnippet || null]
    );

    const newPost = {
      id: postId,
      userId: userId || 'usr_001',
      authorName: authorName || 'Sinh viên',
      authorUsername: authorUsername || 'student',
      department: department || 'CNTT',
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
      codeSnippet,
      status: 'approved',
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };

    return res.status(201).json(newPost);
  } catch (err) {
    console.error('Lỗi POST /posts:', err);
    return res.status(500).json({ error: 'Lỗi tạo bài viết trong MySQL' });
  }
});

// Thích/Bỏ thích bài viết
router.post('/posts/:id/like', async (req, res) => {
  try {
    const postId = req.params.id;
    const { userId = 'usr_001' } = req.body;

    const existing = await db.query('SELECT id FROM likes WHERE target_type = "post" AND target_id = ? AND user_id = ?', [postId, userId]);
    let liked = false;

    if (existing.length > 0) {
      // Un-like
      await db.execute('DELETE FROM likes WHERE id = ?', [existing[0].id]);
      await db.execute('UPDATE posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = ?', [postId]);
      liked = false;
    } else {
      // Like
      await db.execute('INSERT INTO likes (id, target_type, target_id, user_id) VALUES (?, "post", ?, ?)', [generateId('like'), postId, userId]);
      await db.execute('UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?', [postId]);
      liked = true;
    }

    const posts = await db.query('SELECT likes_count FROM posts WHERE id = ?', [postId]);
    const likesCount = posts.length > 0 ? posts[0].likes_count : 0;

    return res.json({ success: true, liked, likesCount });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 4. DOCUMENTS API
// ----------------------------------------------------

router.get('/documents', async (req, res) => {
  try {
    const { department, status = 'approved' } = req.query;
    let sql = 'SELECT * FROM documents WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (department && department !== 'Tất cả Khoa') {
      sql += ' AND department = ?';
      params.push(department);
    }

    sql += ' ORDER BY created_at DESC';
    const rows = await db.query(sql, params);

    const docs = rows.map(d => ({
      id: d.id,
      userId: d.user_id,
      authorName: d.author_name,
      authorUsername: d.author_username,
      department: d.department,
      title: d.title,
      description: d.description,
      fileType: d.file_type,
      fileSize: d.file_size,
      downloadUrl: d.download_url,
      downloadsCount: d.downloads_count,
      likesCount: d.likes_count,
      status: d.status,
      createdAt: d.created_at
    }));

    return res.json(docs);
  } catch (err) {
    return res.status(500).json({ error: 'Lỗi lấy tài liệu từ MySQL' });
  }
});

router.post('/documents', async (req, res) => {
  try {
    const { userId, authorName, authorUsername, department, title, description, fileType, fileSize } = req.body;
    const docId = generateId('doc');

    await db.execute(
      `INSERT INTO documents (id, user_id, author_name, author_username, department, title, description, file_type, file_size, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved')`,
      [docId, userId || 'usr_001', authorName || 'Sinh viên', authorUsername || 'student', department || 'CNTT', title, description || '', fileType || 'pdf', fileSize || '2.5 MB']
    );

    return res.status(201).json({ id: docId, success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 5. COMMENTS API
// ----------------------------------------------------

router.get('/comments', async (req, res) => {
  try {
    const { targetType = 'post', targetId } = req.query;
    if (!targetId) return res.json([]);

    const rows = await db.query(
      'SELECT * FROM comments WHERE target_type = ? AND target_id = ? ORDER BY created_at ASC',
      [targetType, targetId]
    );

    const comments = rows.map(c => ({
      id: c.id,
      targetType: c.target_type,
      targetId: c.target_id,
      userId: c.user_id,
      authorName: c.author_name,
      authorAvatar: c.author_avatar,
      content: c.content,
      createdAt: c.created_at
    }));

    return res.json(comments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/comments', async (req, res) => {
  try {
    const { targetType = 'post', targetId, userId, authorName, authorAvatar, content } = req.body;
    if (!content || !targetId) {
      return res.status(400).json({ error: 'Thiếu thông tin bình luận!' });
    }

    const commentId = generateId('cmt');
    await db.execute(
      `INSERT INTO comments (id, target_type, target_id, user_id, author_name, author_avatar, content)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [commentId, targetType, targetId, userId || 'usr_001', authorName || 'Sinh viên', authorAvatar || '', content]
    );

    // Cập nhật số lượng comment trong bảng bài viết
    if (targetType === 'post') {
      await db.execute('UPDATE posts SET comments_count = comments_count + 1 WHERE id = ?', [targetId]);
    }

    const newComment = {
      id: commentId,
      targetType,
      targetId,
      userId: userId || 'usr_001',
      authorName: authorName || 'Sinh viên',
      authorAvatar: authorAvatar || '',
      content,
      createdAt: new Date().toISOString()
    };

    return res.status(201).json(newComment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 6. NOTIFICATIONS API
// ----------------------------------------------------

router.get('/notifications', async (req, res) => {
  try {
    const { userId = 'usr_001' } = req.query;
    const rows = await db.query(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    const notifs = rows.map(n => ({
      id: n.id,
      userId: n.user_id,
      type: n.type,
      title: n.title,
      message: n.message,
      link: n.link,
      icon: n.icon,
      iconBg: n.icon_bg,
      read: Boolean(n.is_read),
      createdAt: n.created_at
    }));

    return res.json(notifs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/notifications', async (req, res) => {
  try {
    const { userId, type = 'system', title, message, link, icon, iconBg } = req.body;
    const notifId = generateId('notif');

    await db.execute(
      `INSERT INTO notifications (id, user_id, type, title, message, link, icon, icon_bg)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [notifId, userId || 'usr_001', type, title, message, link || 'index.html', icon || 'notifications', iconBg || 'bg-primary text-on-primary']
    );

    return res.status(201).json({ id: notifId, success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Mark notification read
router.put('/notifications/read', async (req, res) => {
  try {
    const { userId = 'usr_001', notifId } = req.body;
    if (notifId) {
      await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [notifId, userId]);
    } else {
      await db.execute('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
    }
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ----------------------------------------------------
// 7. REPORTS & MODERATION API
// ----------------------------------------------------

router.get('/reports', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM reports ORDER BY created_at DESC');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/reports', async (req, res) => {
  try {
    const { reporterId, reporterName, targetType, targetId, reason, details } = req.body;
    const repId = generateId('rep');
    const code = `#REP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.execute(
      `INSERT INTO reports (id, code, reporter_id, reporter_name, target_type, target_id, reason, details, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [repId, code, reporterId || 'usr_001', reporterName || 'Sinh viên', targetType, targetId, reason, details || '']
    );

    return res.status(201).json({ id: repId, code, success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Xử lý Kỷ luật / Gỡ bài kiểm duyệt
router.post('/moderation/discipline', async (req, res) => {
  try {
    const { itemId, itemType = 'post', action, reason, note, moderatorName = 'Kiểm duyệt viên' } = req.body;
    if (!itemId) {
      return res.status(400).json({ error: 'Thiếu ID nội dung cần xử lý!' });
    }

    const table = itemType === 'post' ? 'posts' : 'documents';
    
    // Tìm bài viết/tài liệu trong MySQL
    const items = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [itemId]);
    let targetUser = 'usr_001';
    let itemTitle = 'Nội dung';

    if (items.length > 0) {
      targetUser = items[0].user_id;
      itemTitle = items[0].title;

      if (action === 'delete') {
        await db.execute(`DELETE FROM ${table} WHERE id = ?`, [itemId]);
      } else {
        const newStatus = action === 'hide' ? 'hidden' : 'warning';
        await db.execute(`UPDATE ${table} SET status = ? WHERE id = ?`, [newStatus, itemId]);
      }
    }

    // Tự động gửi thông báo kỷ luật về tài khoản tác giả
    const notifId = generateId('notif');
    const codeBadge = `#POST-${itemId.toString().replace('post_', '').toUpperCase()}`;
    const actionText = action === 'delete' ? 'Gỡ bỏ & Xóa vĩnh viễn' : (action === 'hide' ? 'Tạm ẩn để khắc phục' : 'Gắn Cảnh báo chính thức');
    
    const notifMsg = `Bài viết "${itemTitle}" của bạn đã bị [${actionText}] bởi Kiểm duyệt viên ${moderatorName}. Lý do: ${reason}.${note ? ' Ghi chú: ' + note : ''}`;

    await db.execute(
      `INSERT INTO notifications (id, user_id, type, title, message, link, icon, icon_bg)
       VALUES (?, ?, 'moderation', ?, ?, 'index.html', 'gavel', 'bg-error text-on-error')`,
      [notifId, targetUser, `⚠️ Thông báo Kỷ luật Kiểm duyệt [${codeBadge}]`, notifMsg]
    );

    return res.json({ success: true, message: 'Đã xử lý kỷ luật và tự động gửi thông báo MySQL thành công!' });
  } catch (err) {
    console.error('Lỗi discipline API:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
