'use strict';

const UI = {
  elements: {},
  currentView: 'all',
  calendarYear: new Date().getFullYear(),

  // --- DOM CACHE ---

  init() {
    this.elements = {
      habitList: document.getElementById('habit-list'),
      dashboard: document.getElementById('dashboard'),
      addBtn: document.getElementById('add-habit-btn'),
      themeToggle: document.getElementById('theme-toggle'),
      notifToggle: document.getElementById('notif-toggle'),
      statsBtn: document.getElementById('stats-btn'),
      navPills: document.querySelectorAll('#home-view .nav-pills .nav-pill'),
      sidebarBtns: document.querySelectorAll('#sidebar .sidebar-btn'),
      categoryView: document.getElementById('category-view'),
      categoryHabitList: document.getElementById('category-habit-list'),
      modals: {
        habit: document.getElementById('habit-modal'),
        calendar: document.getElementById('calendar-modal'),
        stats: document.getElementById('stats-modal'),
        detail: document.getElementById('detail-modal'),
        badge: document.getElementById('badge-modal'),
        login: document.getElementById('login-modal'),
        aiCoach: document.getElementById('ai-coach-modal'),
        settings: document.getElementById('settings-modal'),
      },
      modalCancel: document.getElementById('modal-cancel'),
      modalSave: document.getElementById('modal-save'),
      habitForm: document.getElementById('habit-form'),
      editId: document.getElementById('edit-id'),
      habitName: document.getElementById('habit-name'),
      habitDesc: document.getElementById('habit-desc'),
      habitFreq: document.getElementById('habit-freq'),
      habitTarget: document.getElementById('habit-target'),
      modalTitle: document.getElementById('modal-title'),
      toastContainer: document.getElementById('toast-container'),
      detailName: document.getElementById('detail-name'),
      detailCurrentStreak: document.getElementById('detail-current-streak'),
      detailLongestStreak: document.getElementById('detail-longest-streak'),
      detailTotalCheckins: document.getElementById('detail-total-checkins'),
      detailHistory: document.getElementById('detail-history'),
      detailEdit: document.getElementById('detail-edit'),
      detailDelete: document.getElementById('detail-delete'),
      statsHabitSelect: document.getElementById('stats-habit-select'),
      statsWeeklyTab: document.getElementById('stats-weekly-tab'),
      statsMonthlyTab: document.getElementById('stats-monthly-tab'),
      statsWeeklyPanel: document.getElementById('stats-weekly'),
      statsMonthlyPanel: document.getElementById('stats-monthly'),
      weeklyPercent: document.getElementById('weekly-percent'),
      monthlyPercent: document.getElementById('monthly-percent'),
      weeklyChart: document.getElementById('weekly-chart'),
      monthlyChart: document.getElementById('monthly-chart'),
      weeklyBreakdown: document.getElementById('weekly-breakdown'),
      monthlySummary: document.getElementById('monthly-summary'),
      statsTotalCheckins: document.getElementById('stats-total-checkins'),
      statsCurrentStreak: document.getElementById('stats-current-streak'),
      statsLongestStreak: document.getElementById('stats-longest-streak'),
      statsBestDay: document.getElementById('stats-best-day'),
      statsAlltimeRate: document.getElementById('stats-alltime-rate'),
      calPrev: document.getElementById('cal-prev'),
      calNext: document.getElementById('cal-next'),
      calYear: document.getElementById('cal-year'),
      calendarHeatmap: document.getElementById('calendar-heatmap'),
      statTotal: document.getElementById('stat-total-num'),
      statToday: document.getElementById('stat-today-num'),
      statStreak: document.getElementById('stat-streak-num'),
      statCompletion: document.getElementById('stat-completion-num'),
      statCheckins: document.getElementById('stat-checkins-num'),
      statBadges: document.getElementById('stat-badges-num'),
      userDisplay: document.getElementById('user-display'),
      logoutBtn: document.getElementById('logout-btn'),
      calBtn: document.getElementById('cal-btn'),
      badgeBtn: document.getElementById('badge-btn'),
      settingsBtn: document.getElementById('settings-btn'),
      settingsModal: document.getElementById('settings-modal'),
      settingsUsername: document.getElementById('settings-username'),
      settingsEmail: document.getElementById('settings-email'),
      settingsThemeToggle: document.getElementById('settings-theme-toggle'),
      settingsNotifToggle: document.getElementById('settings-notif-toggle'),
      settingsStatsBtn: document.getElementById('settings-stats-btn'),
      settingsCalBtn: document.getElementById('settings-cal-btn'),
      settingsClearBtn: document.getElementById('settings-clear-btn'),
      quickStats: null,
      quickCal: null,
      app: document.getElementById('app'),
      landingPage: document.getElementById('landing-page'),
      landingLoginBtn: document.getElementById('landing-login-btn'),
      landingSignupBtn: document.getElementById('landing-signup-btn'),
      heroGetStarted: document.getElementById('hero-get-started'),
      heroLearnMore: document.getElementById('hero-learn-more'),
      landingLoginForm: document.getElementById('landing-login-form'),
      landingSignupForm: document.getElementById('landing-signup-form'),
      authLoginTab: document.getElementById('auth-login-tab'),
      authSignupTab: document.getElementById('auth-signup-tab'),
      landingLoginEmail: document.getElementById('landing-login-email'),
      landingLoginPassword: document.getElementById('landing-login-password'),
      landingLoginError: document.getElementById('landing-login-error'),
      landingSignupUsername: document.getElementById('landing-signup-username'),
      landingSignupEmail: document.getElementById('landing-signup-email'),
      landingSignupPassword: document.getElementById('landing-signup-password'),
      landingSignupConfirm: document.getElementById('landing-signup-confirm'),
      landingSignupError: document.getElementById('landing-signup-error'),
      landingSwitchSignup: document.getElementById('landing-switch-signup'),
      landingSwitchLogin: document.getElementById('landing-switch-login'),
      aiCoachModal: document.getElementById('ai-coach-modal'),
      coachOverview: document.getElementById('coach-overview'),
      coachWeekly: document.getElementById('coach-weekly'),
      coachMonthly: document.getElementById('coach-monthly'),
      coachInsights: document.getElementById('coach-insights'),
      coachSuggestions: document.getElementById('coach-suggestions'),
      coachQuote: document.getElementById('coach-quote'),
      weeklyReport: document.getElementById('weekly-report'),
      monthlyReport: document.getElementById('monthly-report'),
      loginModal: document.getElementById('login-modal'),
      loginForm: document.getElementById('login-form'),
      signupForm: document.getElementById('signup-form'),
      loginTab: document.getElementById('login-tab-btn'),
      signupTab: document.getElementById('signup-tab-btn'),
      loginUsername: document.getElementById('login-username'),
      loginPassword: document.getElementById('login-password'),
      loginError: document.getElementById('login-error'),
      signupUsername: document.getElementById('signup-username'),
      signupPassword: document.getElementById('signup-password'),
      signupConfirm: document.getElementById('signup-confirm'),
      signupError: document.getElementById('signup-error'),
      loginSwitchSignup: document.getElementById('login-switch-signup'),
      signupSwitchLogin: document.getElementById('signup-switch-login'),
      badgeModal: document.getElementById('badge-modal'),
      badgeGrid: document.getElementById('badge-grid'),
      quoteBar: document.getElementById('quote-bar'),
      quoteText: document.getElementById('quote-text'),
      quoteAuthor: document.getElementById('quote-author'),

      // Analytics page
      homeView: document.getElementById('home-view'),
      analyticsPage: document.getElementById('analytics-page'),
      analyticsHabitSelect: document.getElementById('analytics-habit-select'),
      analyticsStatsPanel: document.getElementById('analytics-stats'),
      analyticsCalPanel: document.getElementById('analytics-calendar'),
      aWeeklyPercent: document.getElementById('a-weekly-percent'),
      aMonthlyPercent: document.getElementById('a-monthly-percent'),
      aWeeklyLabel: document.getElementById('a-weekly-label'),
      aMonthlyLabel: document.getElementById('a-monthly-label'),
      aWeeklyChart: document.getElementById('a-weekly-chart'),
      aMonthlyChart: document.getElementById('a-monthly-chart'),
      aWeeklyBreakdown: document.getElementById('a-weekly-breakdown'),
      aMonthlySummary: document.getElementById('a-monthly-summary'),
      aTotalCheckins: document.getElementById('a-total-checkins'),
      aCurrentStreak: document.getElementById('a-current-streak'),
      aLongestStreak: document.getElementById('a-longest-streak'),
      aBestDay: document.getElementById('a-best-day'),
      aAlltimeRate: document.getElementById('a-alltime-rate'),
      aCalPrev: document.getElementById('a-cal-prev'),
      aCalNext: document.getElementById('a-cal-next'),
      aCalYear: document.getElementById('a-cal-year'),
      aCalendarHeatmap: document.getElementById('a-calendar-heatmap'),

      // Habit time input
      habitReminderTime: document.getElementById('habit-reminder-time'),
      habitHasTime: document.getElementById('habit-has-time'),

      // Settings time inputs
      settingsWakeTime: document.getElementById('settings-wake-time'),
      settingsSleepTime: document.getElementById('settings-sleep-time'),
    };
  },

  // --- MODAL MANAGEMENT ---

  openModal(modalId) {
    const modal = this.elements.modals[modalId] || document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      requestAnimationFrame(() => overlay.classList.add('open'));
      overlay.addEventListener('click', () => this.closeModal(modalId), { once: true });
    }
    const handler = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modalId);
        document.removeEventListener('keydown', handler);
      }
    };
    document.addEventListener('keydown', handler);
    modal._escHandler = handler;
  },

  closeModal(modalId) {
    const modal = this.elements.modals[modalId] || document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) overlay.classList.remove('open');
    if (modal._escHandler) {
      document.removeEventListener('keydown', modal._escHandler);
      delete modal._escHandler;
    }
  },

  closeAllModals() {
    Object.keys(this.elements.modals).forEach(key => this.closeModal(key));
  },

  // --- TOAST NOTIFICATIONS ---

  showToast(message, type = 'info', duration = 3000) {
    const container = this.elements.toastContainer;
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 250);
    }, duration);
  },

  // --- AUTH METHODS ---

  showLogin() {
    if (this.elements.landingPage) this.elements.landingPage.classList.remove('hidden');
    if (this.elements.app) this.elements.app.classList.add('hidden');
    this.elements.landingLoginForm.classList.remove('hidden');
    this.elements.landingSignupForm.classList.add('hidden');
    this.elements.authLoginTab.classList.add('active');
    this.elements.authSignupTab.classList.remove('active');
    this.elements.landingLoginError.classList.add('hidden');
    this.elements.landingSignupError.classList.add('hidden');
  },

  hideLogin() {
    if (this.elements.landingPage) this.elements.landingPage.classList.add('hidden');
    if (this.elements.app) this.elements.app.classList.remove('hidden');
  },

  showLoginError(msg) {
    const el = this.elements.landingLoginError;
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  },

  showSignupError(msg) {
    const el = this.elements.landingSignupError;
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
  },

  switchLoginTab(tab) {
    if (tab === 'login') {
      this.elements.landingLoginForm.classList.remove('hidden');
      this.elements.landingSignupForm.classList.add('hidden');
      this.elements.authLoginTab.classList.add('active');
      this.elements.authSignupTab.classList.remove('active');
      this.elements.landingLoginError.classList.add('hidden');
    } else {
      this.elements.landingLoginForm.classList.add('hidden');
      this.elements.landingSignupForm.classList.remove('hidden');
      this.elements.authLoginTab.classList.remove('active');
      this.elements.authSignupTab.classList.add('active');
      this.elements.landingSignupError.classList.add('hidden');
    }
  },

  onLoginSuccess(username) {
    this.hideLogin();
    const el = this.elements;
    if (el.userDisplay) {
      el.userDisplay.textContent = username;
      el.userDisplay.classList.remove('hidden');
    }
    if (el.logoutBtn) el.logoutBtn.classList.remove('hidden');
    Storage.setKeyPrefix(Auth.getUserDataPrefix(username));
    this.renderDashboard();
    this.renderHabitList();
    this.renderQuote();
    this.showToast(__('welcome', {name: username}), 'success');
  },

  onLogout() {
    const el = this.elements;
    if (el.userDisplay) {
      el.userDisplay.textContent = '';
      el.userDisplay.classList.add('hidden');
    }
    if (el.logoutBtn) el.logoutBtn.classList.add('hidden');
    Storage.setKeyPrefix('habit-tracker-');
    this.showLogin();
    this.showToast(__('logged.out'), 'info');
  },

  // --- BADGE METHODS ---

  renderBadgeModal() {
    const el = this.elements;
    const earned = Badges.getEarnedBadges();
    const allBadges = Badges.badges;
    const earnedIds = earned.map(b => b.id);

    el.badgeGrid.innerHTML = '';
    const frag = document.createDocumentFragment();

    allBadges.forEach(badge => {
      const isEarned = earnedIds.includes(badge.id);
      const card = document.createElement('div');
      card.className = 'badge-card' + (isEarned ? ' earned' : ' locked');
      card.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.description}</div>
      `;
      frag.appendChild(card);
    });

    el.badgeGrid.appendChild(frag);
    this.openModal('badge');
  },

  checkNewBadges() {
    const newBadges = Badges.getNewBadges();
    if (newBadges.length > 0) {
      newBadges.forEach(badge => {
        this.showToast('\uD83C\uDFC6 ' + badge.name + '!', 'badge', 5000);
      });
      Badges.saveEarnedBadges();
    }
  },

  // --- QUOTE METHODS ---

  renderQuote() {
    const el = this.elements;
    const habits = Habits.getAll();
    const active = habits.filter(h => !h.archived);
    if (active.length === 0) {
      el.quoteBar.classList.add('hidden');
      return;
    }
    const quote = AICoach.getQuote(habits) || Quotes.getQuoteOfTheDay();
    if (el.quoteText) el.quoteText.textContent = '\u201C' + quote.text + '\u201D';
    if (el.quoteAuthor) el.quoteAuthor.textContent = '\u2014 ' + quote.author;
    el.quoteBar.classList.remove('hidden');
  },

  _renderIconPicker(selectedIcon) {
    const container = document.getElementById('habit-icon-select');
    if (!container) return;
    container.innerHTML = '';
    const icons = Habits.HABIT_ICONS;
    icons.forEach(item => {
      const label = document.createElement('label');
      label.className = 'icon-option';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'habit-icon';
      input.value = item.icon;
      if (item.icon === (selectedIcon || '📚')) input.checked = true;
      const span = document.createElement('span');
      span.className = 'icon-swatch';
      span.textContent = item.icon;
      span.title = item.name;
      label.appendChild(input);
      label.appendChild(span);
      container.appendChild(label);
    });
  },

  // --- SETTINGS METHODS ---

  openSettings() {
    const el = this.elements;
    const user = Auth.getCurrentUser();
    if (el.settingsUsername) el.settingsUsername.textContent = user ? user.username : '-';
    if (el.settingsEmail) el.settingsEmail.textContent = user && user.email ? user.email : '-';
    // Sync toggle states
    const settings = Storage.getSettings();
    if (el.settingsThemeToggle) el.settingsThemeToggle.checked = settings.theme === 'dark';
    if (el.settingsNotifToggle) el.settingsNotifToggle.checked = !!settings.notifications;
    if (el.settingsWakeTime) el.settingsWakeTime.value = settings.wakeTime || '07:00';
    if (el.settingsSleepTime) el.settingsSleepTime.value = settings.sleepTime || '23:00';
    this.openModal('settings');
  },

  saveDailySchedule() {
    const el = this.elements;
    const settings = Storage.getSettings();
    if (el.settingsWakeTime) settings.wakeTime = el.settingsWakeTime.value || '07:00';
    if (el.settingsSleepTime) settings.sleepTime = el.settingsSleepTime.value || '23:00';
    Storage.saveSettings(settings);
    this.showToast(__('schedule.saved'), 'success');
  },

  // --- AI COACH METHODS ---

  openAICoach() {
    const el = this.elements;
    const habits = Habits.getAll().filter(h => !h.archived);
    if (habits.length === 0) {
      this.showToast(__('coach.empty'), 'info');
      return;
    }

    const patterns = AICoach.analyzePatterns(habits);

    // Render insights
    this._renderCoachInsights(patterns);

    // Render suggestions
    this._renderCoachSuggestions(habits, patterns);

    // Render coach quote
    this._renderCoachQuote(habits);

    // Reset to overview tab
    el.coachOverview.classList.add('active');
    el.coachWeekly.classList.remove('active');
    el.coachMonthly.classList.remove('active');
    document.querySelectorAll('.coach-tab').forEach(t => t.classList.remove('active'));
    document.querySelector('.coach-tab[data-coach-view="overview"]').classList.add('active');

    this.openModal('aiCoach');
  },

  _renderCoachInsights(patterns) {
    const el = this.elements;
    if (!el.coachInsights) return;
    el.coachInsights.innerHTML = '';

    const items = [
      { value: patterns.totalCheckins, label: __('stat.checkins') },
      { value: patterns.overallStreak + 'd', label: __('stat.streak') },
      { value: Math.round(patterns.averageCompletionRate) + '%', label: __('stat.completion') },
      { value: patterns.totalHabits, label: __('stat.total') },
      { value: patterns.bestDayOfWeek || '-', label: __('best.day') },
      { value: patterns.weeklyTrend.charAt(0).toUpperCase() + patterns.weeklyTrend.slice(1), label: __('weekly') + ' ' + __('all').toLowerCase() },
    ];

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'insight-card';
      card.innerHTML = `<div class="insight-value">${item.value}</div><div class="insight-label">${item.label}</div>`;
      el.coachInsights.appendChild(card);
    });
  },

  _renderCoachSuggestions(habits, patterns) {
    const el = this.elements;
    if (!el.coachSuggestions) return;
    el.coachSuggestions.innerHTML = '';
    const suggestions = AICoach.getSuggestions(habits, patterns);

    suggestions.forEach(s => {
      const card = document.createElement('div');
      card.className = 'suggestion-card priority-' + s.priority;
      card.innerHTML = `
        <div class="suggestion-icon">${s.icon}</div>
        <div class="suggestion-content">
          <div class="suggestion-title">${s.title}</div>
          <div class="suggestion-desc">${s.description}</div>
        </div>
      `;
      el.coachSuggestions.appendChild(card);
    });
  },

  _renderCoachQuote(habits) {
    const el = this.elements;
    if (!el.coachQuote) return;
    const quote = AICoach.getQuote(habits);
    if (quote) {
      el.coachQuote.innerHTML = `
        <div class="quote-text">\u201C${quote.text}\u201D</div>
        <div class="quote-author">\u2014 ${quote.author}</div>
      `;
    }
  },

  renderWeeklyReview() {
    const el = this.elements;
    if (!el.weeklyReport) return;
    const habits = Habits.getAll().filter(h => !h.archived);
    if (habits.length === 0) {
      el.weeklyReport.innerHTML = '<p class="empty-state">' + __('coach.no.data') + '</p>';
      return;
    }
    const report = AICoach.generateWeeklyReview(habits);
    el.weeklyReport.innerHTML = this._formatReportHTML(report);
  },

  renderMonthlyReview() {
    const el = this.elements;
    if (!el.monthlyReport) return;
    const habits = Habits.getAll().filter(h => !h.archived);
    if (habits.length === 0) {
      el.monthlyReport.innerHTML = '<p class="empty-state">' + __('coach.no.data.monthly') + '</p>';
      return;
    }
    const report = AICoach.generateMonthlyReview(habits);
    el.monthlyReport.innerHTML = this._formatReportHTML(report);
  },

  _formatReportHTML(report) {
    const stars = '\u2B50'.repeat(report.starRating) + '\u2606'.repeat(5 - report.starRating);
    const highlights = report.highlights.map(h => '<li>' + h + '</li>').join('');
    const lowlights = report.lowlights.map(h => '<li>' + h + '</li>').join('');
    const trends = report.trends.map(h => '<li>' + h + '</li>').join('');
    const recommendations = report.recommendations.map(h => '<li>' + h + '</li>').join('');

    return `
      <div class="report-header">
        <div class="report-title">${report.title}</div>
        <div class="report-date">${report.dateRange}</div>
        <div class="report-rating">
          <div class="report-stars">${stars}</div>
          <span class="report-label ${report.rating}">${report.rating.replace('_', ' ')}</span>
        </div>
      </div>
      <div class="report-summary">${report.summary}</div>
      <div class="report-stats-grid">
        ${Object.entries(report.stats).map(([k, v]) => `
          <div class="report-stat">
            <div class="report-stat-value">${v}</div>
            <div class="report-stat-label">${k.replace(/([A-Z])/g, ' $1').trim()}</div>
          </div>
        `).join('')}
      </div>
      ${highlights ? '<div class="report-section"><div class="report-section-title">\u2728 Highlights</div><ul class="report-list highlights">' + highlights + '</ul></div>' : ''}
      ${lowlights ? '<div class="report-section"><div class="report-section-title">\u26A0\uFE0F Areas to Improve</div><ul class="report-list lowlights">' + lowlights + '</ul></div>' : ''}
      ${trends ? '<div class="report-section"><div class="report-section-title">\uD83D\uDCC8 Trends</div><ul class="report-list trends">' + trends + '</ul></div>' : ''}
      ${recommendations ? '<div class="report-section"><div class="report-section-title">\uD83D\uDCA1 Recommendations</div><ul class="report-list recommendations">' + recommendations + '</ul></div>' : ''}
    `;
  },

  // --- RENDER METHODS ---

  renderDashboard() {
    const habits = Habits.getAll();
    const active = habits.filter(h => !h.archived);
    const total = active.length;
    const todaySummary = Habits.getTodaySummary();
    const maxStreak = active.reduce((m, h) => Math.max(m, h.currentStreak || 0), 0);
    const avgRate = active.length
      ? Math.round(active.reduce((s, h) => s + (h.completionRate || 0), 0) / active.length)
      : 0;
    const totalCheckins = active.reduce((s, h) => s + (h.totalCheckins || 0), 0);
    const earnedBadges = active.length > 0 ? Badges.getEarnedBadges().length : 0;

    const el = this.elements;
    if (el.statTotal) el.statTotal.textContent = total;
    if (el.statToday) el.statToday.textContent = todaySummary.completed + '/' + todaySummary.total;
    if (el.statStreak) el.statStreak.textContent = maxStreak;
    if (el.statCompletion) el.statCompletion.textContent = avgRate + '%';
    if (el.statCheckins) el.statCheckins.textContent = totalCheckins;
    if (el.statBadges) el.statBadges.textContent = earnedBadges + '/' + Badges.getTotalBadges();
    // Update stat labels
    const labels = [
      ['stat-total', 'stat.total'],
      ['stat-today', 'stat.today'],
      ['stat-streak', 'stat.streak'],
      ['stat-completion', 'stat.completion'],
      ['stat-checkins', 'stat.checkins'],
      ['stat-badges', 'stat.badges'],
    ];
    labels.forEach(([id, key]) => {
      const card = document.getElementById(id);
      if (card) {
        const lbl = card.querySelector('.stat-label');
        if (lbl) lbl.textContent = __(key);
      }
    });
  },

  renderHabitList(filter) {
    filter = filter || this.currentView;
    this.currentView = filter;
    const habits = Habits.getAll();
    const today = Habits.getTodayString();
    const now = new Date();

    let filtered = habits.filter(h => !h.archived);

    // Check if filter is a category
    const isCat = Habits.CATEGORIES.some(c => c.id === filter);
    if (filter === 'today') {
      filtered = filtered.filter(h => Habits.getCheckInCount(h, today) < h.targetCount);
    } else if (filter === 'weekly') {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      filtered = filtered.filter(h =>
        Object.keys(h.history || {}).some(d => new Date(d + 'T00:00:00') >= weekStart)
      );
    } else if (filter === 'monthly') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filtered = filtered.filter(h =>
        Object.keys(h.history || {}).some(d => new Date(d + 'T00:00:00') >= monthStart)
      );
    } else if (isCat) {
      filtered = filtered.filter(h => (h.category || 'general') === filter);
    }

    const container = this.elements.habitList;
    if (!container) return;
    container.innerHTML = '';

    if (filtered.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      const isCat = Habits.CATEGORIES.some(c => c.id === filter);
      if (isCat) {
        const cat = Habits.CATEGORIES.find(c => c.id === filter);
        empty.innerHTML = '<span class="empty-icon" style="font-size:3rem">' + (cat ? cat.icon : '&#128203;') + '</span><p class="empty-text" style="margin-top:8px">' + __('empty.category', {cat: cat ? cat.label.toLowerCase() : ''}) + '</p>';
      } else if (filter === 'today') {
        empty.innerHTML = '<span class="empty-icon" style="font-size:3rem">&#9989;</span><p class="empty-text" style="margin-top:8px">' + __('empty.today.all.done') + '</p>';
      } else {
        empty.innerHTML = '<span class="empty-icon" style="font-size:3rem">&#128203;</span><p class="empty-text" style="margin-top:8px">' + __('empty.home.no.habits') + '</p>';
      }
      container.appendChild(empty);
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach(h => frag.appendChild(this.createHabitCard(h)));
    container.appendChild(frag);
  },

  createHabitCard(habit) {
    const today = Habits.getTodayString();
    const isCheckedIn = Habits.hasCheckIn(habit, today);
    const todayCount = Habits.getCheckInCount(habit, today);
    const streak = habit.currentStreak || 0;

    const card = document.createElement('div');
    card.className = 'habit-card';
    card.dataset.id = habit.id;

    const iconDiv = document.createElement('div');
    iconDiv.className = 'habit-card-icon';
    iconDiv.textContent = habit.icon || '📚';

    const infoDiv = document.createElement('div');
    infoDiv.className = 'habit-info';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'habit-name';
    nameDiv.textContent = habit.name;

    const descDiv = document.createElement('div');
    descDiv.className = 'habit-description';
    descDiv.textContent = habit.description || '';

    const streakDiv = document.createElement('div');
    streakDiv.className = 'habit-streak';
    let streakText = '\uD83D\uDD25 ' + (streak === 1 ? __('day.streak', {n: streak}) : __('days.streak', {n: streak}));
    if (habit.reminderTime) {
      streakText += '  \u23F0 ' + habit.reminderTime;
    }
    streakDiv.textContent = streakText;

    const cat = Habits.CATEGORIES.find(c => c.id === (habit.category || 'general'));
    const catBadge = document.createElement('span');
    catBadge.className = 'habit-category';
    catBadge.textContent = (cat ? cat.icon : '📋') + ' ' + (cat ? cat.label : __('home'));
    if (cat) catBadge.style.color = cat.color;
    infoDiv.appendChild(nameDiv);
    infoDiv.appendChild(descDiv);
    infoDiv.appendChild(streakDiv);
    infoDiv.appendChild(catBadge);

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'habit-actions';

    const checkBtn = document.createElement('button');
    checkBtn.className = 'checkin-btn' + (isCheckedIn ? ' checked' : '');
    checkBtn.dataset.id = habit.id;
    checkBtn.dataset.action = 'checkin';
    checkBtn.textContent = isCheckedIn ? '\u2713' : (streak > 0 ? '\uD83D\uDD25' : '');

    actionsDiv.appendChild(checkBtn);

    if (habit.targetCount > 1) {
      const badge = document.createElement('span');
      badge.className = 'streak-badge';
      badge.textContent = todayCount + '/' + habit.targetCount;
      actionsDiv.appendChild(badge);
    }

    card.appendChild(iconDiv);
    card.appendChild(infoDiv);
    card.appendChild(actionsDiv);

    card.addEventListener('click', (e) => {
      if (e.target.closest('.checkin-btn') || e.target.closest('.habit-actions')) return;
      this.openDetailModal(habit);
    });

    return card;
  },

  // --- HABIT MODAL (ADD / EDIT) ---

  openHabitModal(habit) {
    const el = this.elements;
    el.modalTitle.textContent = habit ? __('edit.habit') : __('new.habit');
    el.editId.value = habit ? habit.id : '';
    el.habitName.value = habit ? habit.name : '';
    el.habitDesc.value = habit ? (habit.description || '') : '';
    el.habitFreq.value = habit ? habit.frequency : 'daily';
    el.habitTarget.value = habit ? habit.targetCount : 1;
    this._renderIconPicker(habit ? habit.icon : null);

    // Time field
    const hasTime = !!(habit && habit.reminderTime);
    if (el.habitReminderTime) {
      el.habitReminderTime.value = hasTime ? habit.reminderTime : '08:00';
      el.habitReminderTime.disabled = !hasTime;
    }
    if (el.habitHasTime) {
      el.habitHasTime.checked = hasTime;
    }

    const colorRadio = el.habitForm.querySelector('input[name="color"][value="' + (habit ? habit.color : '#4CAF50') + '"]');
    if (colorRadio) colorRadio.checked = true;

    this.openModal('habit');
  },

  handleHabitSave(e) {
    e.preventDefault();
    const el = this.elements;
    const name = el.habitName.value.trim();
    if (!name) {
      this.showToast(__('habit.name.required'), 'error');
      return;
    }
    const colorInput = el.habitForm.querySelector('input[name="color"]:checked');
    const iconInput = el.habitForm.querySelector('input[name="habit-icon"]:checked');
    const reminderTime = el.habitHasTime && el.habitHasTime.checked && el.habitReminderTime
      ? el.habitReminderTime.value
      : null;
    const data = {
      name: name,
      icon: iconInput ? iconInput.value : '📚',
      description: el.habitDesc.value.trim(),
      frequency: el.habitFreq.value,
      targetCount: parseInt(el.habitTarget.value, 10) || 1,
      color: colorInput ? colorInput.value : '#4CAF50',
      reminderTime: reminderTime,
    };

    try {
      const editId = el.editId.value;
      if (editId) {
        Habits.update(editId, data);
        this.showToast(__('habit.updated'), 'success');
      } else {
        Habits.add(data);
        this.showToast(__('habit.created'), 'success');
      }
      this.closeModal('habit');
      this.renderDashboard();
      this.renderHabitList();
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  },

  // --- DETAIL MODAL ---

  openDetailModal(habit) {
    const el = this.elements;
    el.detailName.textContent = habit.name;
    el.detailCurrentStreak.textContent = habit.currentStreak || 0;
    el.detailLongestStreak.textContent = habit.longestStreak || 0;
    el.detailTotalCheckins.textContent = habit.totalCheckins || 0;
    el.detailEdit.dataset.id = habit.id;
    el.detailDelete.dataset.id = habit.id;

    el.detailHistory.innerHTML = '';
    const days = Habits.getDateRange(
      new Date(Date.now() - 29 * 86400000).toISOString().slice(0, 10),
      Habits.getTodayString()
    );
    const grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:12px';
    days.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell level-' + (Habits.hasCheckIn(habit, d) ? '4' : '0');
      cell.title = Habits.formatDate(d) + ': ' + (Habits.hasCheckIn(habit, d) ? '\u2713' : '\u2717');
      grid.appendChild(cell);
    });
    el.detailHistory.appendChild(grid);
    this.openModal('detail');
  },

  // --- STATISTICS MODAL ---

  openStatsModal() {
    const el = this.elements;
    const habits = Habits.getAll().filter(h => !h.archived);
    el.statsHabitSelect.innerHTML = '';
    habits.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = h.name;
      el.statsHabitSelect.appendChild(opt);
    });
    if (habits.length) this.renderStats(habits[0].id, 'weekly');
    this.openModal('stats');
  },

  renderStats(habitId, period) {
    const el = this.elements;
    const habit = Habits.get(habitId);
    if (!habit) return;

    const today = new Date();
    let days;

    if (period === 'weekly') {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().slice(0, 10));
      }
    } else {
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      days = [];
      for (let i = 1; i <= lastDay; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        days.push(d.toISOString().slice(0, 10));
      }
    }

    let completedDays = 0;
    const chartData = days.map(d => {
      const count = Habits.getCheckInCount(habit, d);
      if (count > 0) completedDays++;
      return { label: d.slice(5), value: count };
    });

    const totalTarget = days.length;
    const percent = totalTarget ? Math.round((completedDays / totalTarget) * 100) : 0;

    if (period === 'weekly') {
      el.weeklyPercent.textContent = percent + '%';
      if (el.weeklyChart) {
        el.weeklyChart.width = (el.weeklyChart.parentElement.clientWidth || 300);
        el.weeklyChart.height = 120;
        this.drawBarChart(el.weeklyChart, chartData, habit.color);
      }
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      el.weeklyBreakdown.innerHTML = '';
      days.forEach((d, i) => {
        const count = Habits.getCheckInCount(habit, d);
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;padding:4px 0;font-size:0.8125rem';
        row.innerHTML = '<span>' + dayNames[i] + '</span><span>' + (count > 0 ? '\u2713'.repeat(count) : '\u2014') + '</span>';
        el.weeklyBreakdown.appendChild(row);
      });
    } else {
      el.monthlyPercent.textContent = percent + '%';
      if (el.monthlyChart) {
        el.monthlyChart.width = (el.monthlyChart.parentElement.clientWidth || 300);
        el.monthlyChart.height = 120;
        this.drawLineChart(el.monthlyChart, chartData, habit.color);
      }
      el.monthlySummary.innerHTML = '<p style="font-size:0.875rem;color:var(--text-secondary);margin-top:8px">' + completedDays + ' of ' + totalTarget + ' days completed (' + percent + '%)</p>';
    }

    if (el.statsTotalCheckins) el.statsTotalCheckins.textContent = habit.totalCheckins || 0;
    if (el.statsCurrentStreak) el.statsCurrentStreak.textContent = habit.currentStreak || 0;
    if (el.statsLongestStreak) el.statsLongestStreak.textContent = habit.longestStreak || 0;
    if (el.statsAlltimeRate) el.statsAlltimeRate.textContent = Math.round(habit.completionRate || 0) + '%';

    let bestDay = '\u2014';
    let bestCount = 0;
    Object.entries(habit.history || {}).forEach(([date, entry]) => {
      if (entry.count > bestCount) { bestCount = entry.count; bestDay = Habits.formatDate(date); }
    });
    if (el.statsBestDay) el.statsBestDay.textContent = bestDay;
  },

  // --- CANVAS CHARTS ---

  drawBarChart(canvas, data, color) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!data || !data.length) return;

    const maxVal = Math.max(1, ...data.map(d => d.value));
    const barW = Math.max(2, (w - 20) / data.length - 2);

    data.forEach((item, i) => {
      const barH = Math.max(2, (item.value / maxVal) * (h - 24));
      const x = 10 + i * (barW + 2);
      const y = h - 12 - barH;

      ctx.fillStyle = color;
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
      } else {
        ctx.rect(x, y, barW, barH);
      }
      ctx.fill();

      ctx.fillStyle = '#888';
      ctx.font = '8px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.label, x + barW / 2, h - 2);
    });
  },

  drawLineChart(canvas, data, color) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!data || !data.length) return;

    const maxVal = Math.max(1, ...data.map(d => d.value));
    const padY = 10;
    const chartH = h - padY - 14;
    const chartW = w - 20;
    const stepX = data.length > 1 ? chartW / (data.length - 1) : 0;

    const points = data.map((item, i) => ({
      x: 10 + i * stepX,
      y: h - 12 - (item.value / maxVal) * chartH,
    }));

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();

    if (points.length > 1) {
      const grad = ctx.createLinearGradient(0, padY, 0, h - 12);
      grad.addColorStop(0, color + '40');
      grad.addColorStop(1, color + '05');
      ctx.beginPath();
      ctx.moveTo(points[0].x, h - 12);
      points.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(points[points.length - 1].x, h - 12);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.fillStyle = '#888';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    const labelStep = data.length < 15 ? 1 : Math.floor(data.length / 10);
    points.forEach((p, i) => {
      if (i % labelStep === 0 || i === points.length - 1) {
        ctx.fillText(data[i].label, p.x, h - 2);
      }
    });
  },

  // --- CALENDAR HEATMAP ---

  openCalendarModal() {
    this.calendarYear = new Date().getFullYear();
    if (this.elements.calYear) this.elements.calYear.textContent = this.calendarYear;
    this.renderCalendarHeatmap(this.calendarYear);
    this.openModal('calendar');
  },

  renderCalendarHeatmap(year) {
    const container = this.elements.calendarHeatmap;
    if (!container) return;
    container.innerHTML = '';

    const habits = Habits.getAll().filter(h => !h.archived);
    const aggregate = {};
    habits.forEach(h => {
      Object.entries(h.history || {}).forEach(([date, entry]) => {
        const d = new Date(date + 'T00:00:00');
        if (d.getFullYear() === year) {
          aggregate[date] = (aggregate[date] || 0) + entry.count;
        }
      });
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-wrap:wrap;gap:20px;justify-content:center';

    for (let m = 0; m < 12; m++) {
      const block = document.createElement('div');
      block.style.cssText = 'display:flex;flex-direction:column;align-items:center';

      const label = document.createElement('div');
      label.className = 'heatmap-month-label';
      label.textContent = monthNames[m];
      block.appendChild(label);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,14px);gap:2px;margin-top:4px';

      const firstDay = new Date(year, m, 1).getDay();
      const daysInMonth = new Date(year, m + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.style.cssText = 'width:14px;height:14px';
        grid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = year + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const count = aggregate[dateStr] || 0;
        const cell = document.createElement('div');
        let level;
        if (count === 0) level = 0;
        else if (count <= 3) level = 1;
        else if (count <= 7) level = 2;
        else if (count <= 15) level = 3;
        else level = 4;
        cell.className = 'heatmap-cell level-' + level;
        cell.title = monthNames[m] + ' ' + d + ', ' + year + ': ' + count + ' check-in' + (count !== 1 ? 's' : '');
        grid.appendChild(cell);
      }

      block.appendChild(grid);
      wrapper.appendChild(block);
    }

    container.appendChild(wrapper);
  },

  // --- ANALYTICS PAGE ---

  openAnalyticsPage() {
    const el = this.elements;
    this.analyticsCalYear = new Date().getFullYear();
    if (el.aCalYear) el.aCalYear.textContent = this.analyticsCalYear;

    // Populate habit selector
    const habits = Habits.getAll().filter(h => !h.archived);
    el.analyticsHabitSelect.innerHTML = '';
    habits.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = h.icon + ' ' + h.name;
      el.analyticsHabitSelect.appendChild(opt);
    });

    if (habits.length) {
      // Default to first habit stats
      document.querySelector('.analytics-tab[data-analytics-view="stats"]').classList.add('active');
      document.querySelector('.analytics-tab[data-analytics-view="calendar"]').classList.remove('active');
      el.analyticsStatsPanel.classList.add('active');
      el.analyticsCalPanel.classList.remove('active');
      this.renderAnalyticsStats(habits[0].id, 'weekly');
      this.renderAnalyticsCalendar(this.analyticsCalYear);
    } else {
      el.analyticsStatsPanel.innerHTML = '<div class="empty-state"><span class="empty-icon">&#128202;</span><p class="empty-text">' + __('analytics.empty') + '</p></div>';
      el.analyticsCalPanel.innerHTML = '<div class="empty-state"><span class="empty-icon">&#128197;</span><p class="empty-text">' + __('calendar.empty') + '</p></div>';
    }
  },

  renderAnalyticsStats(habitId, period) {
    const el = this.elements;
    if (!habitId) return;
    const habit = Habits.get(habitId);
    if (!habit) return;

    const today = new Date();
    let days;

    if (period === 'weekly') {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push(d.toISOString().slice(0, 10));
      }
      el.aWeeklyPercent.style.display = '';
      el.aWeeklyLabel.style.display = '';
      el.aWeeklyChart.style.display = '';
      el.aWeeklyBreakdown.style.display = '';
      el.aMonthlyPercent.style.display = 'none';
      el.aMonthlyLabel.style.display = 'none';
      el.aMonthlyChart.style.display = 'none';
      el.aMonthlySummary.style.display = 'none';
    } else {
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      days = [];
      for (let i = 1; i <= lastDay; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        days.push(d.toISOString().slice(0, 10));
      }
      el.aWeeklyPercent.style.display = 'none';
      el.aWeeklyLabel.style.display = 'none';
      el.aWeeklyChart.style.display = 'none';
      el.aWeeklyBreakdown.style.display = 'none';
      el.aMonthlyPercent.style.display = '';
      el.aMonthlyLabel.style.display = '';
      el.aMonthlyChart.style.display = '';
      el.aMonthlySummary.style.display = '';
    }

    let completedDays = 0;
    const chartData = days.map(d => {
      const count = Habits.getCheckInCount(habit, d);
      if (count > 0) completedDays++;
      return { label: d.slice(5), value: count };
    });

    const totalTarget = days.length;
    const percent = totalTarget ? Math.round((completedDays / totalTarget) * 100) : 0;

    if (period === 'weekly') {
      el.aWeeklyPercent.textContent = percent + '%';
      if (el.aWeeklyChart) {
        el.aWeeklyChart.width = (el.aWeeklyChart.parentElement.clientWidth || 300);
        el.aWeeklyChart.height = 120;
        this.drawBarChart(el.aWeeklyChart, chartData, habit.color);
      }
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      el.aWeeklyBreakdown.innerHTML = '';
      days.forEach((d, i) => {
        const count = Habits.getCheckInCount(habit, d);
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;justify-content:space-between;padding:4px 0;font-size:0.8125rem';
        row.innerHTML = '<span>' + dayNames[i] + '</span><span>' + (count > 0 ? '\u2713'.repeat(count) : '\u2014') + '</span>';
        el.aWeeklyBreakdown.appendChild(row);
      });
    } else {
      el.aMonthlyPercent.textContent = percent + '%';
      if (el.aMonthlyChart) {
        el.aMonthlyChart.width = (el.aMonthlyChart.parentElement.clientWidth || 300);
        el.aMonthlyChart.height = 120;
        this.drawLineChart(el.aMonthlyChart, chartData, habit.color);
      }
      el.aMonthlySummary.innerHTML = '<p style="font-size:0.875rem;color:var(--text-secondary);margin-top:8px">' + completedDays + ' of ' + totalTarget + ' days completed (' + percent + '%)</p>';
    }

    if (el.aTotalCheckins) el.aTotalCheckins.textContent = habit.totalCheckins || 0;
    if (el.aCurrentStreak) el.aCurrentStreak.textContent = habit.currentStreak || 0;
    if (el.aLongestStreak) el.aLongestStreak.textContent = habit.longestStreak || 0;
    if (el.aAlltimeRate) el.aAlltimeRate.textContent = Math.round(habit.completionRate || 0) + '%';

    let bestDay = '\u2014';
    let bestCount = 0;
    Object.entries(habit.history || {}).forEach(([date, entry]) => {
      if (entry.count > bestCount) { bestCount = entry.count; bestDay = Habits.formatDate(date); }
    });
    if (el.aBestDay) el.aBestDay.textContent = bestDay;
  },

  renderAnalyticsCalendar(year) {
    const container = this.elements.aCalendarHeatmap;
    if (!container) return;
    container.innerHTML = '';

    const habits = Habits.getAll().filter(h => !h.archived);
    const aggregate = {};
    habits.forEach(h => {
      Object.entries(h.history || {}).forEach(([date, entry]) => {
        const d = new Date(date + 'T00:00:00');
        if (d.getFullYear() === year) {
          aggregate[date] = (aggregate[date] || 0) + entry.count;
        }
      });
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-wrap:wrap;gap:20px;justify-content:center';

    for (let m = 0; m < 12; m++) {
      const block = document.createElement('div');
      block.style.cssText = 'display:flex;flex-direction:column;align-items:center';

      const label = document.createElement('div');
      label.className = 'heatmap-month-label';
      label.textContent = monthNames[m];
      block.appendChild(label);

      const grid = document.createElement('div');
      grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,14px);gap:2px;margin-top:4px';

      const firstDay = new Date(year, m, 1).getDay();
      const daysInMonth = new Date(year, m + 1, 0).getDate();

      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.style.cssText = 'width:14px;height:14px';
        grid.appendChild(empty);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = year + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
        const count = aggregate[dateStr] || 0;
        const cell = document.createElement('div');
        let level;
        if (count === 0) level = 0;
        else if (count <= 3) level = 1;
        else if (count <= 7) level = 2;
        else if (count <= 15) level = 3;
        else level = 4;
        cell.className = 'heatmap-cell level-' + level;
        cell.title = monthNames[m] + ' ' + d + ', ' + year + ': ' + count + ' check-in' + (count !== 1 ? 's' : '');
        grid.appendChild(cell);
      }

      block.appendChild(grid);
      wrapper.appendChild(block);
    }

    container.appendChild(wrapper);
  },

  // --- CATEGORY VIEW ---

  renderCategoryView(category) {
    const el = this.elements;
    if (!el.categoryHabitList) return;
    const habits = Habits.getAll().filter(h => !h.archived && (h.category || 'general') === category);
    const cat = Habits.CATEGORIES.find(c => c.id === category);

    el.categoryHabitList.innerHTML = '';

    if (habits.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<span class="empty-icon" style="font-size:3rem">' + (cat ? cat.icon : '&#128203;') + '</span><p class="empty-title" style="margin-top:8px">' + __('empty.category.title', {cat: cat ? cat.label.toLowerCase() : ''}) + '</p><p class="empty-text">' + __('empty.create.hint', {cat: cat ? cat.label : ''}) + '</p>';
      el.categoryHabitList.appendChild(empty);
      return;
    }

    // Header
    const header = document.createElement('div');
    header.className = 'category-header';
    header.innerHTML = '<h2 class="category-title">' + (cat ? cat.icon + ' ' + cat.label : '&#128203; Habits') + '</h2><span class="category-count">' + habits.length + ' habit' + (habits.length !== 1 ? 's' : '') + '</span>';
    el.categoryHabitList.appendChild(header);

    const frag = document.createDocumentFragment();
    habits.forEach(h => frag.appendChild(this.createHabitCard(h)));
    el.categoryHabitList.appendChild(frag);
  },

  // --- LANGUAGE ---

  toggleLanguage() {
    const current = getLanguage();
    const newLang = current === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    this.applyLanguage();
    this.showToast(__('language') + ': ' + LANGUAGES[newLang].name, 'info');
  },

  applyLanguage() {
    const lang = getLanguage();
    // Update text content with i18n attribute
    document.querySelectorAll('[i18n]').forEach(el => {
      const key = el.getAttribute('i18n');
      el.textContent = __(key);
    });
    // Update placeholders with i18n-placeholder attribute
    document.querySelectorAll('[i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('i18n-placeholder');
      el.placeholder = __(key);
    });
    // Update titles with i18n-title attribute
    document.querySelectorAll('[i18n-title]').forEach(el => {
      const key = el.getAttribute('i18n-title');
      el.title = __(key);
    });
    // Update title attributes
    const titleEls = ['lang-toggle', 'logout-btn', 'badge-btn', 'settings-btn', 'theme-toggle'];
    titleEls.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const key = el.id === 'lang-toggle' ? 'language' : el.id.replace('-btn', '').replace('-', '.');
        el.title = __(key === 'logout' ? 'logout' : key === 'badge' ? 'badges' : key === 'settings' ? 'settings' : key === 'theme' ? 'toggle.theme' : key === 'language' ? 'language' : key);
      }
    });
    const notifEl = document.getElementById('notif-toggle');
    if (notifEl) {
      const s = Storage.getSettings();
      notifEl.title = s.notifications ? __('notifications.on') : __('notifications.off');
    }
    document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
    // Re-render dynamic content
    if (Auth.isLoggedIn()) {
      this.renderDashboard();
      this.renderHabitList();
      this.renderQuote();
    }
  },

  // --- THEME ---

  toggleTheme() {
    const isDark = document.body.classList.toggle('dark');
    const settings = Storage.getSettings();
    settings.theme = isDark ? 'dark' : 'light';
    Storage.saveSettings(settings);
    if (this.elements.themeToggle) {
      this.elements.themeToggle.textContent = isDark ? '\uD83C\uDF19' : '\u2600\uFE0F';
      this.elements.themeToggle.className = 'icon-btn ' + (isDark ? 'dark-mode' : 'light-mode');
    }
    if (this.elements.settingsThemeToggle) {
      this.elements.settingsThemeToggle.checked = isDark;
    }
  },

  applyTheme() {
    const settings = Storage.getSettings();
    const isDark = settings.theme === 'dark';
    if (isDark) {
      document.body.classList.add('dark');
      if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = '\uD83C\uDF19';
        this.elements.themeToggle.className = 'icon-btn dark-mode';
      }
    } else {
      document.body.classList.remove('dark');
      if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = '\u2600\uFE0F';
        this.elements.themeToggle.className = 'icon-btn light-mode';
      }
    }
    if (this.elements.settingsThemeToggle) {
      this.elements.settingsThemeToggle.checked = isDark;
    }
  },

  // --- NOTIFICATIONS ---

  syncNotifIcon() {
    const settings = Storage.getSettings();
    if (this.elements.notifToggle) {
      this.elements.notifToggle.textContent = settings.notifications ? '\uD83D\uDD14' : '\uD83D\uDD15';
      this.elements.notifToggle.title = settings.notifications ? 'Notifications ON' : 'Notifications OFF';
    }
  },

  toggleNotifications() {
    const settings = Storage.getSettings();
    settings.notifications = !settings.notifications;
    Storage.saveSettings(settings);

    // Update header bell icon state
    if (this.elements.notifToggle) {
      this.elements.notifToggle.textContent = settings.notifications ? '\uD83D\uDD14' : '\uD83D\uDD15';
      this.elements.notifToggle.title = settings.notifications ? 'Notifications ON' : 'Notifications OFF';
    }
    if (this.elements.settingsNotifToggle) {
      this.elements.settingsNotifToggle.checked = !!settings.notifications;
    }

    if (settings.notifications) {
      Notifications.start().then(granted => {
        if (granted) {
          this.showToast(__('notifications.enabled'), 'success');
        } else {
          settings.notifications = false;
          Storage.saveSettings(settings);
          if (this.elements.notifToggle) {
            this.elements.notifToggle.textContent = '\uD83D\uDD15';
            this.elements.notifToggle.title = __('notifications.off');
          }
          if (this.elements.settingsNotifToggle) {
            this.elements.settingsNotifToggle.checked = false;
          }
          this.showToast(__('notifications.denied'), 'error');
        }
      });
    } else {
      Notifications.stop();
      this.showToast(__('notifications.disabled'), 'info');
    }
  },

  // --- EVENT BINDING ---

  bindEvents() {
    const el = this.elements;

    if (el.themeToggle) el.themeToggle.addEventListener('click', () => this.toggleTheme());
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) langBtn.addEventListener('click', () => this.toggleLanguage());
    if (el.notifToggle) el.notifToggle.addEventListener('click', () => this.toggleNotifications());
    if (el.badgeBtn) el.badgeBtn.addEventListener('click', () => this.renderBadgeModal());
    if (el.settingsBtn) el.settingsBtn.addEventListener('click', () => this.openSettings());
    const landingLangBtn = document.getElementById('landing-lang-toggle');
    if (landingLangBtn) landingLangBtn.addEventListener('click', () => this.toggleLanguage());
    if (el.landingLoginBtn) el.landingLoginBtn.addEventListener('click', () => {
      document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
      this.switchLoginTab('login');
    });
    if (el.landingSignupBtn) el.landingSignupBtn.addEventListener('click', () => {
      document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
      this.switchLoginTab('signup');
    });
    if (el.heroGetStarted) el.heroGetStarted.addEventListener('click', () => {
      document.getElementById('auth-section').scrollIntoView({ behavior: 'smooth' });
      this.switchLoginTab('signup');
    });
    if (el.heroLearnMore) el.heroLearnMore.addEventListener('click', () => {
      document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
    });
    if (el.addBtn) el.addBtn.addEventListener('click', () => this.openHabitModal());
    const headerAddBtn = document.getElementById('add-habit-header-btn');
    if (headerAddBtn) headerAddBtn.addEventListener('click', () => this.openHabitModal());
    const emptyAddBtn = document.getElementById('empty-add-btn');
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => this.openHabitModal());
    const pageAddBtn = document.getElementById('add-habit-page-btn');
    if (pageAddBtn) pageAddBtn.addEventListener('click', () => this.openHabitModal());
    if (el.modalCancel) el.modalCancel.addEventListener('click', () => this.closeModal('habit'));
    if (el.habitForm) el.habitForm.addEventListener('submit', (e) => this.handleHabitSave(e));

    // Habit time checkbox toggles time input visibility
    if (el.habitHasTime) {
      el.habitHasTime.addEventListener('change', () => {
        if (el.habitReminderTime) {
          el.habitReminderTime.disabled = !el.habitHasTime.checked;
          if (el.habitHasTime.checked && !el.habitReminderTime.value) {
            el.habitReminderTime.value = '08:00';
          }
        }
      });
    }

    // Sidebar navigation
    el.sidebarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        el.sidebarBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;

        // Reset all views
        el.homeView.classList.add('hidden');
        el.categoryView.classList.add('hidden');
        el.analyticsPage.classList.add('hidden');

        if (view === 'home') {
          el.homeView.classList.remove('hidden');
        } else if (view === 'analytics') {
          el.analyticsPage.classList.remove('hidden');
          this.openAnalyticsPage();
        } else {
          // Category view
          el.categoryView.classList.remove('hidden');
          this.renderCategoryView(view);
        }
      });
    });

    // Home nav pills (time filters)
    el.navPills.forEach(pill => {
      pill.addEventListener('click', () => {
        el.navPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        this.renderHabitList(pill.dataset.view);
        this.renderDashboard();
      });
    });

    if (el.detailEdit) {
      el.detailEdit.addEventListener('click', () => {
        const id = el.detailEdit.dataset.id;
        const habit = id && Habits.get(id);
        if (habit) { this.closeModal('detail'); this.openHabitModal(habit); }
      });
    }

    if (el.detailDelete) {
      el.detailDelete.addEventListener('click', () => {
        const id = el.detailDelete.dataset.id;
        if (id && confirm(__('detail.delete.confirm'))) {
          Habits.delete(id);
          this.closeModal('detail');
          this.renderDashboard();
          this.renderHabitList();
          this.showToast(__('habit.deleted'), 'info');
        }
      });
    }

    if (el.statsHabitSelect) {
      el.statsHabitSelect.addEventListener('change', () => {
        const p = el.statsWeeklyPanel.classList.contains('active') ? 'weekly' : 'monthly';
        this.renderStats(el.statsHabitSelect.value, p);
      });
    }

    if (el.statsWeeklyTab) {
      el.statsWeeklyTab.addEventListener('click', () => {
        el.statsWeeklyTab.classList.add('active');
        el.statsMonthlyTab.classList.remove('active');
        el.statsWeeklyPanel.classList.add('active');
        el.statsMonthlyPanel.classList.remove('active');
        this.renderStats(el.statsHabitSelect.value, 'weekly');
      });
    }

    if (el.statsMonthlyTab) {
      el.statsMonthlyTab.addEventListener('click', () => {
        el.statsMonthlyTab.classList.add('active');
        el.statsWeeklyTab.classList.remove('active');
        el.statsMonthlyPanel.classList.add('active');
        el.statsWeeklyPanel.classList.remove('active');
        this.renderStats(el.statsHabitSelect.value, 'monthly');
      });
    }

    if (el.calPrev) {
      el.calPrev.addEventListener('click', () => {
        this.calendarYear--;
        if (el.calYear) el.calYear.textContent = this.calendarYear;
        this.renderCalendarHeatmap(this.calendarYear);
      });
    }

    if (el.calNext) {
      el.calNext.addEventListener('click', () => {
        this.calendarYear++;
        if (el.calYear) el.calYear.textContent = this.calendarYear;
        this.renderCalendarHeatmap(this.calendarYear);
      });
    }

    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.modal-close-btn');
      if (closeBtn && closeBtn.dataset.modal) this.closeModal(closeBtn.dataset.modal);
    });

    // Coach tab switching
    document.querySelectorAll('.coach-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.coach-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.coachView;
        document.querySelectorAll('.coach-panel').forEach(p => p.classList.remove('active'));
        const panel = document.getElementById('coach-' + view);
        if (panel) {
          panel.classList.add('active');
          if (view === 'weekly') this.renderWeeklyReview();
          if (view === 'monthly') this.renderMonthlyReview();
        }
      });
    });

    // Analytics tab switching
    document.querySelectorAll('.analytics-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.analytics-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.analyticsView;
        document.querySelectorAll('.analytics-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('analytics-' + view).classList.add('active');
      });
    });

    // Analytics stats tabs
    document.querySelectorAll('.a-stats-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.a-stats-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const period = tab.dataset.aPeriod;
        this.renderAnalyticsStats(el.analyticsHabitSelect.value, period);
      });
    });

    // Analytics habit dropdown
    if (el.analyticsHabitSelect) {
      el.analyticsHabitSelect.addEventListener('change', () => {
        const activeTab = document.querySelector('.a-stats-tab.active');
        const period = activeTab ? activeTab.dataset.aPeriod : 'weekly';
        this.renderAnalyticsStats(el.analyticsHabitSelect.value, period);
      });
    }

    // Analytics calendar nav
    if (el.aCalPrev) {
      el.aCalPrev.addEventListener('click', () => {
        this.analyticsCalYear--;
        if (el.aCalYear) el.aCalYear.textContent = this.analyticsCalYear;
        this.renderAnalyticsCalendar(this.analyticsCalYear);
      });
    }
    if (el.aCalNext) {
      el.aCalNext.addEventListener('click', () => {
        this.analyticsCalYear++;
        if (el.aCalYear) el.aCalYear.textContent = this.analyticsCalYear;
        this.renderAnalyticsCalendar(this.analyticsCalYear);
      });
    }

    if (el.habitList) {
      el.habitList.addEventListener('click', (e) => {
        const btn = e.target.closest('.checkin-btn');
        if (!btn) return;
        const id = btn.dataset.id;
        const habit = id && Habits.get(id);
        if (!habit) return;
        const today = Habits.getTodayString();
        if (Habits.hasCheckIn(habit, today)) {
          Habits.uncheckIn(id);
          this.showToast(__('checkin.removed'), 'info');
        } else {
          Habits.checkIn(id);
          this.showToast(__('checked.in'), 'success');
        }
        this.renderDashboard();
        this.renderHabitList(this.currentView);
        this.checkNewBadges();
      });
    }

    // Auth events
    if (el.loginTab) {
      el.loginTab.addEventListener('click', () => this.switchLoginTab('login'));
    }
    if (el.signupTab) {
      el.signupTab.addEventListener('click', () => this.switchLoginTab('signup'));
    }
    if (el.loginSwitchSignup) {
      el.loginSwitchSignup.addEventListener('click', (e) => { e.preventDefault(); this.switchLoginTab('signup'); });
    }
    if (el.signupSwitchLogin) {
      el.signupSwitchLogin.addEventListener('click', (e) => { e.preventDefault(); this.switchLoginTab('login'); });
    }
    if (el.loginForm) {
      el.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = el.loginUsername.value.trim();
        const password = el.loginPassword.value;
        if (!username || !password) {
          this.showLoginError('Please fill in all fields');
          return;
        }
        const result = Auth.login(username, password);
        if (result.success) {
          this.onLoginSuccess(username);
        } else {
          this.showLoginError(result.message);
        }
      });
    }
    if (el.signupForm) {
      el.signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = el.signupUsername.value.trim();
        const password = el.signupPassword.value;
        const confirm = el.signupConfirm.value;
        if (!username || !password || !confirm) {
          this.showSignupError('Please fill in all fields');
          return;
        }
        if (password !== confirm) {
          this.showSignupError('Passwords do not match');
          return;
        }
        const result = Auth.signup(username, password);
        if (result.success) {
          this.onLoginSuccess(username);
        } else {
          this.showSignupError(result.message);
        }
      });
    }

    // Landing page auth forms
    if (el.authLoginTab) el.authLoginTab.addEventListener('click', () => this.switchLoginTab('login'));
    if (el.authSignupTab) el.authSignupTab.addEventListener('click', () => this.switchLoginTab('signup'));
    if (el.landingSwitchSignup) el.landingSwitchSignup.addEventListener('click', (e) => { e.preventDefault(); this.switchLoginTab('signup'); });
    if (el.landingSwitchLogin) el.landingSwitchLogin.addEventListener('click', (e) => { e.preventDefault(); this.switchLoginTab('login'); });

    if (el.landingLoginForm) {
      el.landingLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = el.landingLoginEmail.value.trim();
        const password = el.landingLoginPassword.value;
        if (!identifier || !password) {
          this.showLoginError('Please fill in all fields');
          return;
        }
        const result = Auth.login(identifier, password);
        if (result.success) {
          this.onLoginSuccess(result.user.username);
        } else {
          this.showLoginError(result.message);
        }
      });
    }

    if (el.landingSignupForm) {
      el.landingSignupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = el.landingSignupUsername.value.trim();
        const email = el.landingSignupEmail.value.trim();
        const password = el.landingSignupPassword.value;
        const confirm = el.landingSignupConfirm.value;
        if (!username || !password || !confirm) {
          this.showSignupError('Please fill in all required fields');
          return;
        }
        if (password !== confirm) {
          this.showSignupError('Passwords do not match');
          return;
        }
        const result = Auth.signup(username, password, email);
        if (result.success) {
          this.onLoginSuccess(username);
        } else {
          this.showSignupError(result.message);
        }
      });
    }
    if (el.logoutBtn) {
      el.logoutBtn.addEventListener('click', () => {
        Auth.logout();
        this.onLogout();
      });
    }

    // Settings buttons
    if (el.settingsStatsBtn) el.settingsStatsBtn.addEventListener('click', () => { this.closeModal('settings'); this.openStatsModal(); });
    if (el.settingsCalBtn) el.settingsCalBtn.addEventListener('click', () => { this.closeModal('settings'); this.openCalendarModal(); });
    if (el.settingsThemeToggle) {
      el.settingsThemeToggle.addEventListener('change', () => this.toggleTheme());
    }
    if (el.settingsNotifToggle) {
      el.settingsNotifToggle.addEventListener('change', () => this.toggleNotifications());
    }
    const scheduleSaveBtn = document.getElementById('settings-save-schedule');
    if (scheduleSaveBtn) {
      scheduleSaveBtn.addEventListener('click', () => this.saveDailySchedule());
    }

    if (el.settingsClearBtn) {
      el.settingsClearBtn.addEventListener('click', () => {
        if (confirm(__('clear.confirm'))) {
          Storage.clearAll();
          this.closeModal('settings');
          this.renderDashboard();
          this.renderHabitList();
          this.showToast(__('data.cleared'), 'info');
        }
      });
    }

    // Override login modal ESC to not close it
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const openModals = Object.entries(this.elements.modals).filter(([, m]) => m && !m.classList.contains('hidden') && m.id !== 'login-modal');
        if (openModals.length) this.closeModal(openModals[openModals.length - 1][0]);
      }
    });
  },

  // --- INITIALIZATION ---

  initialize() {
    this.init();
    // Init language
    const settings = Storage.getSettings();
    if (settings.language) setLanguage(settings.language);
    this.applyLanguage();
    this.applyTheme();
    this.syncNotifIcon();
    this.bindEvents();
    this.renderDashboard();
    this.renderHabitList();
    // Show home by default
    if (this.elements.homeView) this.elements.homeView.classList.remove('hidden');
  },
};

window.UI = UI;
