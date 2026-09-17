/**
 * EduHub Platform - Auth Service (assets/js/auth.js)
 * Quản lý Đăng ký, Đăng nhập, Đăng xuất, Session và Phân quyền người dùng.
 */

window.Auth = {
  SESSION_KEY: 'current_user',

  // Lấy thông tin người dùng đang đăng nhập
  getCurrentUser() {
    const user = StorageManager.get(this.SESSION_KEY, null);
    if (!user) {
      // Mặc định khởi tạo session cho student_an để trải nghiệm ứng dụng liền mạch
      const defaultUser = StorageManager.get('users', []).find(u => u.username === 'student_an');
      if (defaultUser) {
        this.setCurrentUser(defaultUser);
        return defaultUser;
      }
    }
    return user;
  },

  // Đặt thông tin session người dùng
  setCurrentUser(user) {
    StorageManager.set(this.SESSION_KEY, user);
  },

  // Đăng nhập
  login(username, password) {
    const users = StorageManager.get('users', []);
    const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
    
    if (user) {
      this.setCurrentUser(user);
      Utils.showToast(`Chào mừng ${user.fullName} đã quay trở lại!`, 'success');
      return { success: true, user };
    } else {
      Utils.showToast('Tên đăng nhập hoặc mật khẩu không chính xác!', 'error');
      return { success: false, error: 'Thông tin đăng nhập không hợp lệ' };
    }
  },

  // Đăng ký tài khoản sinh viên mới
  register(data) {
    const users = StorageManager.get('users', []);
    
    if (users.some(u => u.username === data.username)) {
      Utils.showToast('Tên đăng nhập đã tồn tại!', 'error');
      return { success: false, error: 'Tên đăng nhập trùng lặp' };
    }

    const newUser = {
      id: Utils.generateId('usr'),
      username: data.username,
      password: data.password || '123',
      fullName: data.fullName,
      email: data.email || `${data.username}@student.edu.vn`,
      role: 'student',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDiZgW59iKVUVGv3CPk5My43-_Q6O2sQ7dal5C-pGq5cKMZSSSdp2d87NI-q6oq69z1XtJLaBK3gDKUKTtg2_FqFjq983x_MWxd3r0ajqW4L8ovDwh-V9sI-RLRHqhb3nlXCG0J6sb-C6NZNdRf57TgFdrGPtPRFZisSB4SfcNDUeT1k7ui-OIqNL3TKfkjOjNQADjm0bWeBPR5mVuNgpaaD0jKQt7jdt5suxCbpeYI1RP7fSSCCi9BEQ',
      department: data.department || 'Công nghệ Thông tin',
      school: data.school || 'Đại học Bách Khoa',
      savedDocIds: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    StorageManager.set('users', users);
    this.setCurrentUser(newUser);
    Utils.showToast('Đăng ký tài khoản sinh viên thành công!', 'success');
    return { success: true, user: newUser };
  },

  // Đăng xuất
  logout() {
    StorageManager.remove(this.SESSION_KEY);
    Utils.showToast('Đã đăng xuất khỏi hệ thống', 'info');
    setTimeout(() => {
      window.location.href = 'public.html';
    }, 500);
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  isModerator() {
    const user = this.getCurrentUser();
    return user && (user.role === 'moderator' || user.role === 'admin');
  },

  // Đồng bộ giao diện Header / Sidebar theo phiên đăng nhập thực tế
  syncUI() {
    const user = this.getCurrentUser();
    if (!user) return;

    // Cập nhật tên và avatar ở Header
    document.querySelectorAll('.user-name-display').forEach(el => el.textContent = user.fullName);
    document.querySelectorAll('.user-role-display').forEach(el => el.textContent = (user.role === 'moderator' || user.role === 'admin') ? 'Moderator' : 'Sinh viên');
    document.querySelectorAll('.user-avatar-display').forEach(el => {
      if (el.tagName === 'IMG') el.src = user.avatar;
    });

    // An/hiện Moderator Zone dựa vào role
    const isMod = this.isModerator();
    document.querySelectorAll('.moderator-only-zone').forEach(zone => {
      if (isMod) {
        zone.classList.remove('hidden');
      } else {
        zone.classList.add('hidden');
      }
    });

    if (window.Moderation && isMod) {
      const queue = Moderation.getPendingQueue();
      document.querySelectorAll('.moderator-only-zone .bg-error').forEach(badge => {
        badge.textContent = queue.length;
      });
    }
  }
};
