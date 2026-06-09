'use strict';

const Auth = {
  USERS_KEY: 'habit-tracker-users',
  SESSION_KEY: 'habit-tracker-session',

  _hash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return 'h' + Math.abs(hash).toString(36);
  },

  // Sign up with username, email, password
  // username: required, 3-20 alphanumeric + underscore
  // email: optional, basic email validation if provided
  // password: required, min 4 chars
  // Returns: { success: boolean, message: string }
  signup(username, password, email = '') {
    // Validate username
    if (!username || !username.trim()) return { success: false, message: 'Username is required' };
    const trimmed = username.trim();
    if (!this._isValidUsername(trimmed)) return { success: false, message: 'Username must be 3-20 alphanumeric characters or underscores' };
    if (!password || password.length < 4) return { success: false, message: 'Password must be at least 4 characters' };
    
    // Validate email if provided
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) return { success: false, message: 'Please enter a valid email' };
    }

    const users = this._loadUsers();
    const emailTrimmed = email ? email.trim().toLowerCase() : '';

    // Check duplicate username
    if (users.some(u => u.username.toLowerCase() === trimmed.toLowerCase())) {
      return { success: false, message: 'Username already exists' };
    }
    // Check duplicate email (if provided)
    if (emailTrimmed && users.some(u => u.email && u.email.toLowerCase() === emailTrimmed)) {
      return { success: false, message: 'Email already registered' };
    }

    const user = {
      username: trimmed,
      email: emailTrimmed || '',
      passwordHash: this._hash(password),
      createdAt: Date.now(),
      displayName: trimmed
    };

    users.push(user);
    this._saveUsers(users);
    this._setSession(trimmed);
    return { success: true, message: 'Account created successfully' };
  },

  // Login with username OR email + password
  login(identifier, password) {
    if (!identifier || !identifier.trim() || !password) {
      return { success: false, message: 'Email/username and password are required' };
    }
    const users = this._loadUsers();
    const input = identifier.trim();
    // Try matching by username or email
    const user = users.find(u => 
      u.username.toLowerCase() === input.toLowerCase() || 
      (u.email && u.email.toLowerCase() === input.toLowerCase())
    );
    if (!user || user.passwordHash !== this._hash(password)) {
      return { success: false, message: 'Invalid credentials' };
    }
    this._setSession(user.username);
    return { success: true, message: 'Logged in successfully', user };
  },

  logout() {
    this._clearSession();
  },

  getCurrentUser() {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw);
      if (!session || !session.username) return null;
      const users = this._loadUsers();
      return users.find(u => u.username === session.username) || null;
    } catch { return null; }
  },

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  _loadUsers() {
    try {
      const raw = localStorage.getItem(this.USERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  _saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },

  _setSession(username) {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify({
      username,
      loginTime: Date.now(),
      sessionId: Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    }));
  },

  _clearSession() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  getUserDataPrefix(username) {
    return 'habit-tracker-' + username + '-';
  },

  _isValidUsername(name) {
    return /^[a-zA-Z0-9_]{3,20}$/.test(name);
  }
};

window.Auth = Auth;
