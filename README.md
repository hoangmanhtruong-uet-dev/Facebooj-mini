# 🎓 Website Thảo Luận & Chia Sẻ Tài Nguyên Học Tập (StudyHub)

> **Sản phẩm cuối kỳ môn Lập trình mạng (2026 - 2027)**  
> **Công nghệ**: HTML5, CSS3 và JavaScript thuần (Vanilla JS).  
> **Hình thức thực hiện**: Nhóm 2 thành viên.

---

## 📌 1. Giới thiệu Dự án

Trong môi trường học tập số, người học cần một không gian trực quan để đặt câu hỏi, trao đổi lời giải, chia sẻ tài nguyên và kết nối với các thành viên khác. **StudyHub** là nền tảng cộng đồng học tập trực tuyến cho phép sinh viên thảo luận, tìm kiếm, đăng tải và lưu trữ tài liệu học tập một cách dễ dàng và minh bạch.

Dự án được xây dựng 100% bằng **HTML, CSS và JavaScript thuần**, tuân thủ nghiêm ngặt các quy định về chuẩn giao diện, tính năng tương tác, phân quyền người dùng và kiểm duyệt nội dung theo tài liệu yêu cầu.

---

## 🚀 2. Hướng dẫn Khởi chạy Dự án

Do ứng dụng được viết bằng công nghệ Web thuần, bạn không cần cài đặt `node_modules` hay trình đóng gói phức tạp.

### Cách 1: Sử dụng VS Code Extension "Live Server" (Khuyến nghị)
1. Mở thư mục dự án `Facebook-mini` bằng **Visual Studio Code**.
2. Cài đặt Extension **Live Server** (của Ritwick Dey).
3. Nhấp chuột phải vào file `index.html` chọn **Open with Live Server** (hoặc bấm tổ hợp phím `Alt + L, Alt + O`).
4. Trình duyệt sẽ mở ứng dụng tại địa chỉ `http://127.0.0.1:5500`.

### Cách 2: Mở trực tiếp trên Trình duyệt
1. Truy cập thư mục dự án trên máy tính.
2. Nhấp kép chuột vào file `index.html` để mở trực tiếp trên Chrome, Edge hoặc Firefox.

---

## 👥 3. Các Tác nhân Hệ thống & Chức năng Chính

Hệ thống hỗ trợ **3 tác nhân người dùng** chính:

| Tác nhân | Quyền hạn & Chức năng chính |
| :--- | :--- |
| 🧑‍🎓 **Người đăng bài (Student)** | • **Tạo & quản lý thảo luận**: Đăng, sửa, chọn phạm vi hiển thị (`Public`, `Friends`, `Only Me`).<br>• **Tương tác bài viết**: Like/Dislike, bình luận, đính kèm liên kết ảnh/video, trả lời bình luận (Reply).<br>• **Chia sẻ tài liệu**: Đăng tài liệu học tập, tìm kiếm, lọc, sắp xếp, lưu & mở tài nguyên theo phạm vi.<br>• **Tìm kiếm & Báo cáo**: Tìm bài viết/chủ đề quan tâm, báo cáo nội dung vi phạm.<br>• **Kết nối**: Gửi lời mời kết bạn, quản lý danh sách bạn bè.<br>• **Trang cá nhân**: Chỉnh sửa thông tin, thống kê bài viết/tài liệu đã chia sẻ & nội dung đã lưu. |
| 👮 **Người kiểm duyệt (Moderator)** | • Bao gồm đầy đủ chức năng của **Người đăng bài**.<br>• **Kiểm duyệt nội dung**: Xem chi tiết bài chờ duyệt, duyệt bài, yêu cầu chỉnh sửa hoặc loại bỏ nội dung.<br>• **Xử lý báo cáo**: Tiếp nhận báo cáo vi phạm từ người dùng, quyết định ẩn/xóa/giữ bài.<br>• **Thống kê hệ thống**: Thống kê các chủ đề quan tâm, bài viết hữu ích, theo dõi hàng chờ kiểm duyệt và mức độ ưu tiên. |
| 👤 **Khách thăm (Guest)** | • Xem các bài thảo luận và tài liệu học tập được chia sẻ ở chế độ **`Public`** (không cần đăng nhập). |

---

## 🛠️ 4. Cấu trúc Thư mục Dự án

```text
Facebook-mini/
├── index.html                   # Trang chủ chính (Feed bài viết & tài liệu Public)
├── login.html                   # Trang Đăng nhập / Đăng ký
├── profile.html                 # Trang Quản lý cá nhân & Thống kê sinh viên
├── documents.html               # Trang Quản lý & Chia sẻ Tài liệu học tập
├── moderation.html              # Trang Dashboard Kiểm duyệt dành cho Moderator
├── assets/
│   ├── css/
│   │   ├── main.css             # CSS Tổng quan & Reset rules
│   │   ├── components.css       # Style cho Cards, Modal, Buttons, Form inputs, Badges
│   │   ├── responsive.css       # Media Queries (Mobile, Tablet, Desktop)
│   │   └── theme.css            # Color Palette & CSS Variables (Dark/Light mode)
│   ├── js/
│   │   ├── app.js               # Khởi tạo ứng dụng & Navigation logic
│   │   ├── storage.js           # LocalStorage Manager (CRUD mock data Users, Posts, Docs, Reports)
│   │   ├── auth.js              # Xử lý Đăng ký, Đăng nhập, Phân quyền & Session
│   │   ├── posts.js             # Đăng bài, Sửa bài, Phạm vi hiển thị, Tương tác (Like/Comment)
│   │   ├── documents.js         # Đăng tài liệu, Tìm kiếm, Lọc, Sắp xếp & Lưu tài nguyên
│   │   ├── friends.js           # Kết bạn, Quản lý bạn bè & Lọc Feed theo bạn bè
│   │   ├── moderation.js        # Xử lý Hàng chờ kiểm duyệt, Báo cáo vi phạm & Thống kê
│   │   └── utils.js             # Helper functions (Format date, Sanitize HTML, Toast notification)
│   └── images/                  # Ảnh mẫu, avatars, icons
├── Yêu-cầu-sản-phẩm-cuối-kì-LTM_2026_2027 (1).pdf # File đề bài gốc
├── REQUIREMENTS.md              # Tài liệu Đặc tả Yêu cầu (SRS) & Thang điểm
├── ARCHITECTURE.md              # Kiến trúc Hệ thống & UI/UX Design System
├── DATA_MODEL.md                # Cấu trúc Dữ liệu JSON & LocalStorage Schema
├── USER_GUIDE.md                # Hướng dẫn Sử dụng & Ôn tập Vấn đáp Kỹ thuật
└── TASKS.md                     # Roadmap & Phân công Công việc Nhóm 2 Người
```

---

## 📊 5. Thang Điểm & Tiêu Chí Đánh Giá

| STT | Đầu điểm | Tiêu chí chi tiết | Thang điểm |
| :-: | :--- | :--- | :-: |
| **1** | **HTML** | Sử dụng đa dạng đối tượng HTML (Hình ảnh, video, bảng, form, danh sách, semantic tags...) | **0.5 điểm** |
| **2** | **CSS** | Bố cục cân đối, màu sắc hài hòa, kích thước tỉ lệ phù hợp, **yêu cầu Responsive** tốt | **1.0 điểm** |
| **3** | **JavaScript** | • Đăng ký / Đăng nhập & Phân quyền<br>• Chia sẻ & lưu trữ tài liệu<br>• Kết nối bạn bè<br>• Xử lý bài thảo luận (CRUD, Like, Comment, Media link)<br>• Quản lý thông tin cá nhân & Thống kê<br>• Dashboard Kiểm duyệt & Xử lý báo cáo | **1.5 điểm** |
| **4** | **Vấn đáp** | Vấn đáp độc lập từng thành viên để chứng minh nắm vững bản chất code (Không hiểu code = **0 điểm toàn bài thi**) | **2.0 điểm** |
| **5** | **Thi thực hành** | Nhận đề thi trực tiếp và làm bài trong thời gian quy định | **5.0 điểm** |

---

## 📑 6. Danh Mục Tài Liệu Dự Án

* 📄 [REQUIREMENTS.md](file:///d:/MyProjects/Vibe-coding/Facebook-mini/REQUIREMENTS.md): Đặc tả yêu cầu chi tiết (SRS) & Quy chế thi.
* 📄 [ARCHITECTURE.md](file:///d:/MyProjects/Vibe-coding/Facebook-mini/ARCHITECTURE.md): Kiến trúc JavaScript Module & UI Design System.
* 📄 [DATA_MODEL.md](file:///d:/MyProjects/Vibe-coding/Facebook-mini/DATA_MODEL.md): Thiết kế Schema dữ liệu lưu trên `localStorage`.
* 📄 [USER_GUIDE.md](file:///d:/MyProjects/Vibe-coding/Facebook-mini/USER_GUIDE.md): Kịch bản kiểm thử & Bộ câu hỏi ôn tập vấn đáp.
* 📄 [TASKS.md](file:///d:/MyProjects/Vibe-coding/Facebook-mini/TASKS.md): Bảng phân công công việc nhóm 2 người & tiến độ.

---

## ⚠️ 7. Lưu Ý Quan Trọng Thi Cuối Kỳ

> 🛑 **Quy chế thi vấn đáp độc lập**:  
> Mỗi thành viên trong nhóm bắt buộc phải hiểu rõ bản chất mọi dòng code HTML, CSS, JavaScript của hệ thống.  
> Sinh viên sao chép code dưới mọi hình thức nhưng không giải thích được khi vấn đáp sẽ bị tính **0 điểm** vi phạm quy chế thi.
#   F a c e b o o j - m i n i  
 