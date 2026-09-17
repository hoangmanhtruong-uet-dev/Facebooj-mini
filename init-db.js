/**
 * Database Initializer & Seed Data Script (init-db.js)
 * Tự động kết nối & tạo bảng cho Aiven MySQL Cloud hoặc Local MySQL Server.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  console.log('🚀 [Init DB] Đang khởi chạy quy trình cấu hình Aiven / MySQL Cloud Database...');

  const host = process.env.DB_HOST || 'facebook-mini-01-developerhoangtruong-8e80.h.aivencloud.com';
  const port = parseInt(process.env.DB_PORT || '27050', 10);
  const user = process.env.DB_USER || 'avnadmin';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'defaultdb';

  const isSSL = process.env.DB_SSL === 'REQUIRED' || 
                process.env.DB_SSL === 'true' || 
                host.includes('aivencloud.com');

  let connection;

  try {
    // 1. Kết nối trực tiếp đến database được chỉ định (hỗ trợ SSL Aiven)
    const connConfig = {
      host,
      port,
      user,
      password,
      database: dbName,
      ssl: isSSL ? { rejectUnauthorized: false } : false
    };

    connection = await mysql.createConnection(connConfig);
    console.log(`📡 [Init DB] Đã kết nối đến MySQL Server tại ${host}:${port} (Database: ${dbName}, SSL: ${isSSL ? 'Bật' : 'Tắt'})`);

    // 2. Đọc file schema.sql và thực thi
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.startsWith('USE'));

      for (const statement of statements) {
        if (statement) {
          try {
            await connection.query(statement);
          } catch (e) {
            // Bỏ qua lỗi nếu bảng hoặc DB đã tồn tại
            if (!e.message.includes('already exists')) {
              console.warn('⚠️ Statement warning:', e.message);
            }
          }
        }
      }
      console.log('✅ [Init DB] Đã tạo toàn bộ các bảng trong Schema MySQL thành công!');
    }

    // 3. Seed dữ liệu mẫu cho người dùng nếu bảng users rỗng
    const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      console.log('🌱 [Init DB] Đang nạp dữ liệu người dùng mẫu (Seed Users)...');

      await connection.query(`
        INSERT INTO users (id, username, password, full_name, email, role, department, avatar, bio, points)
        VALUES 
        ('usr_001', 'student_an', '123', 'Nguyễn Minh An', 'an.nguyen@vnu.edu.vn', 'student', 'K21 Công nghệ Thông tin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', 'Đam mê Web Development & AI Apps', 150),
        ('usr_mod', 'mod_teacher', '123', 'TS. Nguyễn Văn Đức', 'duc.nv@vnu.edu.vn', 'moderator', 'Khoa CNTT - Giảng viên Kiểm duyệt', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', 'Trưởng ban kiểm duyệt chất lượng tài liệu học thuật', 500)
      `);

      // Seed posts
      await connection.query(`
        INSERT INTO posts (id, user_id, author_name, author_username, department, title, content, tags, status, likes_count, comments_count)
        VALUES
        ('post_501', 'usr_001', 'Nguyễn Minh An', 'student_an', 'K21 CNTT', 'Lỗi Concurrent State Mutation trong React Redux Toolkit Query?', 'Chào mọi người, khi làm project thực tế với Redux Toolkit Query kết hợp Optimistic Updates, mình hay bị tình trạng state bị desync giữa UI và Cache local...', 'reactjs,redux,javascript', 'approved', 42, 14),
        ('post_502', 'usr_mod', 'TS. Nguyễn Văn Đức', 'mod_teacher', 'Khoa CNTT', 'Tổng hợp đề thi & Đáp án Môn Kiến trúc Máy tính 2025', 'Bộ tài liệu ôn tập trọng tâm môn KTTT bao gồm 10 đề thi kỳ trước kèm đáp án giải chi tiết từng câu hỏi...', 'ktt,vnu,detin', 'approved', 128, 35)
      `);

      // Seed documents
      await connection.query(`
        INSERT INTO documents (id, user_id, author_name, author_username, department, title, description, file_type, file_size, download_url, downloads_count, likes_count, status)
        VALUES
        ('doc_101', 'usr_mod', 'TS. Nguyễn Văn Đức', 'mod_teacher', 'Khoa CNTT', 'Giáo trình Lập trình Hệ thống & Mạng nâng cao (PDF)', 'Tài liệu chuẩn hóa kiến thức Socket, Protocol design và Concurrency...', 'pdf', '4.8 MB', '#', 342, 95),
        ('doc_102', 'usr_001', 'Nguyễn Minh An', 'student_an', 'K21 CNTT', 'Slide Bài giảng Cấu trúc Dữ liệu và Giải thuật', 'Bộ slide bài giảng tóm tắt thuật toán Đồ thị, Tree và Dynamic Programming...', 'pptx', '12.5 MB', '#', 189, 44)
      `);

      // Seed notifications
      await connection.query(`
        INSERT INTO notifications (id, user_id, type, title, message, link, icon, icon_bg)
        VALUES
        ('notif_1', 'usr_001', 'system', 'Chào mừng bạn đến với EduHub!', 'Tài khoản sinh viên đã được kích hoạt thành công. Bắt đầu chia sẻ bài học ngay!', 'index.html', 'auto_awesome', 'bg-primary text-on-primary'),
        ('notif_2', 'usr_001', 'moderation', 'Bài viết đã được phê duyệt', 'Bài viết "Lỗi Concurrent State Mutation" của bạn đã được xuất hiện công khai.', 'post-detail.html?id=post_501', 'check_circle', 'bg-emerald-500 text-white')
      `);

      console.log('✅ [Init DB] Nạp dữ liệu mẫu hoàn tất!');
    }

    console.log('🎉 [Init DB] Khởi tạo Aiven MySQL Cloud Database sẵn sàng 100%!');
  } catch (err) {
    console.error('❌ [Init DB Error] Lỗi kết nối Aiven MySQL:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

// Cho phép gọi trực tiếp qua node init-db.js
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;
