# 📖 Hướng Dẫn Sử Dụng & Bộ Câu Hỏi Ôn Tập Vấn Đáp

> **Dự án**: Website Thảo Luận và Chia Sẻ Tài Nguyên Học Tập (StudyHub)  
> **Mục đích**: Hướng dẫn kịch bản kiểm thử tính năng & Bộ câu hỏi mẫu chuẩn bị cho phần thi **Vấn đáp độc lập (2.0 điểm)**.

---

## 🎯 1. Kịch Bản Trải Nghiệm & Kiểm Thử Tính Năng (Testing Scenarios)

### 1.1. Kịch Bản 1: Khách Thăm (Guest - Không Đăng Nhập)
1. Mở file `index.html` trên trình duyệt.
2. Kiểm tra dòng thời gian (Feed): Xem danh sách các bài thảo luận công khai (`Public`).
3. Truy cập trang `documents.html`: Xem các tài liệu học tập công khai.
4. Thử bấm **Thả tim (Like)** hoặc **Bình luận**: Hệ thống sẽ hiển thị Toast thông báo yêu cầu đăng nhập và bật Modal Đăng nhập.

---

### 1.2. Kịch Bản 2: Sinh Viên / Người Đăng Bài (Student)
1. **Đăng ký & Đăng nhập**:
   * Truy cập `login.html` $\rightarrow$ Đăng ký tài khoản sinh viên mới.
   * Đăng nhập với tài khoản vừa tạo.
2. **Tạo Bài Thảo Luận Mới**:
   * Bấm nút "Đăng bài thảo luận mới".
   * Nhập tiêu đề, chọn môn học/chủ đề.
   * Chọn phạm vi hiển thị: Thử nghiệm chuyển giữa `Public`, `Friends` và `Only Me`.
   * Đăng bài $\rightarrow$ Kiểm tra bài viết xuất hiện trên Feed.
3. **Tương Tác Bài Viết**:
   * Thả tim / Like bài viết của người khác.
   * Viết bình luận, chèn đường dẫn ảnh (URL dạng `.jpg`/`.png`) hoặc đường dẫn video YouTube.
   * Bấm "Trả lời" (Reply) một bình luận có sẵn để tạo bình luận lồng nhau.
4. **Chia Sẻ & Quản Lý Tài Liệu**:
   * Chuyển sang trang `documents.html`.
   * Bấm "Chia sẻ tài liệu mới" $\rightarrow$ Nhập thông tin, tải liên kết slide/PDF.
   * Sử dụng thanh tìm kiếm gõ tên môn học $\rightarrow$ Thử nghiệm các nút **Sắp xếp** (Mới nhất, Đánh giá cao, Lưu nhiều nhất).
   * Bấm nút **"Lưu tài liệu"** $\rightarrow$ Kiểm tra số lượng tài liệu đã lưu gia tăng.
5. **Kết Nối Bạn Bè**:
   * Tìm kiếm sinh viên khác $\rightarrow$ Bấm "Gửi lời mời kết bạn".
   * Chuyển sang tab "Bài viết từ bạn bè" để xem Feed lọc riêng cho bạn bè.
6. **Xem Trang Cá Nhân & Thống Kê**:
   * Truy cập `profile.html`.
   * Chỉnh sửa thông tin cá nhân (Tên, avatar, khoa/ngành).
   * Quan sát bảng **Thống kê**: Kiểm tra tổng số bài thảo luận, tài liệu đã đăng và tài liệu đã lưu.

---

### 1.3. Kịch Bản 3: Người Kiểm Duyệt (Moderator)
1. Đăng nhập với tài khoản Moderator: `username: mod_teacher`, `password: admin_password_123`.
2. Truy cập `moderation.html` (Dashboard Kiểm duyệt).
3. **Duyệt bài viết**:
   * Xem hàng chờ các bài viết mới hoặc bài bị gắn cờ.
   * Thực hiện các hành động: `Approve` (Duyệt bài), `Request Edit` (Yêu cầu chỉnh sửa), `Reject` (Từ chối).
4. **Xử lý Báo cáo Vi phạm**:
   * Xem danh sách các bài viết/tài liệu bị sinh viên báo cáo.
   * Chọn hành động: "Ẩn bài viết" hoặc "Bỏ qua báo cáo".
5. **Theo dõi Thống kê Hệ thống**:
   * Quan sát biểu đồ/bảng thống kê các chủ đề được quan tâm nhiều nhất, các nội dung hữu ích nhất và số lượng bài chờ duyệt.

---

## 🎓 2. Bộ Câu Hỏi & Đáp Án Mẫu Ôn Tập Thi Vấn Đáp (2.0 Điểm)

> [!CAUTION]
> Giảng viên sẽ hỏi độc lập từng thành viên trong nhóm về bản chất mã nguồn HTML/CSS/JS. Việc hiểu rõ từng dõng code bên dưới là điều kiện bắt buộc để đạt điểm tuyệt đối.

### ❓ Câu 1: Em hãy giải thích cách ứng dụng tương tác và thay đổi nội dung DOM mà không cần tải lại trang?
* **Trả lời**:
  * Em sử dụng các API thao tác DOM thuần của JavaScript như `document.querySelector()`, `document.getElementById()`, `element.innerHTML`, và `document.createElement()`.
  * Khi người dùng thực hiện một hành động (như đăng bài, thả tim), JS nghe sự kiện qua `addEventListener()`, cập nhật mảng dữ liệu trong bộ nhớ và `localStorage`, sau đó gọi hàm `renderPosts()` để vẽ lại danh sách phần tử HTML mới và gán vào thẻ chứa `<div id="post-feed">`.

---

### ❓ Câu 2: Sự kiện Event Delegation trong dự án của em hoạt động như thế nào và tại sao lại dùng nó?
* **Trả lời**:
  * Trong dự án, các bài thảo luận và bình luận được sinh ra động (dynamic DOM). Nếu gắn `addEventListener` trực tiếp vào từng nút Like/Comment của từng bài viết thì sẽ làm tiêu tốn tài nguyên bộ nhớ và nút mới tạo sẽ không ăn sự kiện.
  * Vì vậy em dùng **Event Delegation**: Lắng nghe 1 sự kiện `click` duy nhất trên thẻ cha cố định `#post-feed`. Khi nhấp chuột, em dùng `e.target.closest('.btn-like')` để kiểm tra xem phần tử được nhấp có thuộc nút Like hay không và lấy `dataset.postId` để xử lý.

---

### ❓ Câu 3: Em quản lý việc đăng nhập và lưu trạng thái người dùng (Session) bằng cách nào khi không dùng Backend?
* **Trả lời**:
  * Em giả lập Session bằng `localStorage`. When người dùng đăng nhập thành công qua `auth.js`, em lưu đối tượng thông tin người dùng vào key `studyhub_current_user`.
  * Khi chuyển giữa các trang (`index.html`, `profile.html`), file `auth.js` tự động đọc `studyhub_current_user`. Nếu tồn tại, hệ thống hiển thị avatar, tên người dùng và các nút chức năng tương ứng với vai trò (`student` hoặc `moderator`). Nếu là `Guest`, hệ thống sẽ ẩn các nút quản trị và yêu cầu đăng nhập khi tương tác.

---

### ❓ Câu 4: Em làm thế nào để trang Web hiển thị co giãn tốt (Responsive) trên cả máy tính và điện thoại?
* **Trả lời**:
  * Em kết hợp giữa bố cục linh hoạt **CSS Flexbox / CSS Grid** và các thẻ **Media Queries (`@media`)** trong file `assets/css/responsive.css`.
  * Trên màn hình máy tính (Desktop >= 1024px), ứng dụng dùng CSS Grid 3 cột (Sidebar trái + Feed giữa + Widget phải).
  * Trên Tablet (768px - 1023px), hệ thống ẩn Widget phải và chuyển thành Layout 2 cột.
  * Trên Mobile (< 768px), hệ thống ẩn Sidebar trái, thu hẹp còn 1 cột duy nhất và hiển thị thanh điều hướng đáy màn hình (**Bottom Navigation Bar**).

---

### ❓ Câu 5: Làm sao em chống được lỗi bảo mật XSS khi cho phép người dùng nhập bình luận và liên kết ảnh/video?
* **Trả lời**:
  * Trước khi hiển thị bất kỳ văn bản nào từ `input` hoặc `textarea` người dùng ra HTML, em đều chạy qua hàm tiện ích `Utils.escapeHTML()`.
  * Hàm này chuyển đổi các ký tự nguy hiểm như `<`, `>`, `&`, `"`, `' thành các đoạn mã HTML Entities (`&lt;`, `&gt;`...). Đối với URL ảnh/video, em sử dụng constructor `new URL()` để kiểm tra giao thức hợp lệ (`http:` hoặc `https:`) trước khi đưa vào thuộc tính `src`.
