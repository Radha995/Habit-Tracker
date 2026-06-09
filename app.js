'use strict';

// Future enhancement: register a service worker for offline support
// navigator.serviceWorker.register('/sw.js');

const App = {
  currentFilter: 'all',
  currentStatsHabitId: null,

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { this._boot(); Chatbot.init(); Scanner.init(); });
    } else {
      this._boot();
      Chatbot.init();
      Scanner.init();
    }
  },

  _boot() {
    UI.initialize();
    Calendar.init('calendar-heatmap');

    // Auth check
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
      Storage.setKeyPrefix(Auth.getUserDataPrefix(currentUser.username));
      UI.hideLogin();
      if (UI.elements.userDisplay) {
        UI.elements.userDisplay.textContent = currentUser.username;
        UI.elements.userDisplay.classList.remove('hidden');
      }
      if (UI.elements.logoutBtn) UI.elements.logoutBtn.classList.remove('hidden');
      UI.renderDashboard();
      UI.renderHabitList();
      UI.renderQuote();
      Badges.init();
      UI.checkNewBadges();
    } else {
      UI.showLogin();
    }

    const settings = Storage.getSettings();
    if (settings.notifications) {
      Notifications.start();
    }

    setInterval(() => {
      if (Auth.isLoggedIn()) {
        UI.renderDashboard();
        UI.renderHabitList(this.currentFilter);
      }
    }, 60000);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && Auth.isLoggedIn()) {
        UI.renderDashboard();
        UI.renderHabitList(this.currentFilter);
      }
    });

    // Scanner buttons
    const scanBtn = document.getElementById('scan-qr-btn');
    const uploadBtn = document.getElementById('upload-img-btn');
    const scannerClose = document.getElementById('scanner-close');
    if (scanBtn) scanBtn.addEventListener('click', () => this.handleScan());
    if (uploadBtn) uploadBtn.addEventListener('click', () => this.handleUpload());
    if (scannerClose) scannerClose.addEventListener('click', () => Scanner.overlayEl.classList.add('hidden'));

    console.log('Habit Tracker initialized');
  },

  async handleScan() {
    const text = await Scanner.scanFromCamera();
    if (text) {
      this._fillHabitFromText(text);
    }
  },

  async handleUpload() {
    const text = await Scanner.uploadImage();
    if (text) {
      this._fillHabitFromText(text);
    }
  },

  _fillHabitFromText(text) {
    const clean = text.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean || clean.length < 2) {
      UI.showToast('Could not read text. Try a clearer image.', 'error');
      return;
    }
    const nameEl = document.getElementById('habit-name');
    if (!nameEl) return;
    nameEl.value = clean.charAt(0).toUpperCase() + clean.slice(1);
    const icon = Scanner.suggestIcon(clean);
    const iconInput = document.querySelector(`#habit-icon-select input[value="${icon}"]`);
    if (iconInput) iconInput.checked = true;
    UI.showToast('Text extracted! Review and save.', 'success');
  },

  handleThemeToggle() {
    UI.toggleTheme();
  },

  handleNotifToggle() {
    UI.toggleNotifications();
    const settings = Storage.getSettings();
    if (settings.notifications) {
      Notifications.requestPermission().then(granted => {
        if (granted) Notifications.start();
      });
    } else {
      Notifications.stop();
    }
  },

  handleAddHabit() {
    UI.openHabitModal();
  },

  handleHabitSave() {
    UI.handleHabitSave();
  },

  handleFilterChange(filter) {
    this.currentFilter = filter;
    document.querySelectorAll('#nav-pills .pill').forEach(p => p.classList.remove('active'));
    const activePill = document.querySelector(`#nav-pills .pill[data-filter="${filter}"]`);
    if (activePill) activePill.classList.add('active');
    UI.renderHabitList(filter);
  },

  handleCheckIn(habitId) {
    const habit = Habits.get(habitId);
    if (!habit) return;

    const today = Habits.getTodayString();
    const isCheckedIn = Habits.hasCheckIn(habit, today);
    const count = Habits.getCheckInCount(habit, today);

    if (isCheckedIn && count >= habit.targetCount) {
      Habits.uncheckIn(habitId, today);
      UI.showToast(__('checkin.removed'), 'info');
    } else if (isCheckedIn && habit.targetCount > 1) {
      Habits.checkIn(habitId, today, true);
      UI.showToast(__('checked.in.plus'), 'success');
    } else {
      Habits.checkIn(habitId, today, false);
      UI.showToast(__('checked.in'), 'success');
    }

    UI.renderDashboard();
    UI.renderHabitList(this.currentFilter);
  },

  handleHabitClick(habitId) {
    const habit = Habits.get(habitId);
    if (habit) {
      UI.openDetailModal(habit);
    }
  },

  handleDetailEdit(habitId) {
    const habit = Habits.get(habitId);
    if (habit) {
      UI.closeModal('detail-modal');
      UI.openHabitModal(habit);
    }
  },

  handleDetailDelete(habitId) {
    if (confirm(__('detail.delete.confirm'))) {
      Habits.delete(habitId);
      UI.closeModal('detail-modal');
      UI.renderDashboard();
      UI.renderHabitList(this.currentFilter);
      UI.showToast(__('habit.deleted'), 'info');
    }
  },

  handleStatsOpen() {
    UI.openStatsModal();
  },

  handleStatsHabitChange(habitId) {
    this.currentStatsHabitId = habitId;
    const activeTab = document.querySelector('#stats-modal .tab.active');
    const period = activeTab ? activeTab.dataset.period : 'weekly';
    UI.renderStats(habitId, period);
  },

  handleStatsTabSwitch(period) {
    if (this.currentStatsHabitId) {
      UI.renderStats(this.currentStatsHabitId, period);
    }
  },

  handleCalendarOpen() {
    UI.openCalendarModal();
  },

  handleCalendarYearChange(year) {
    const habits = Habits.getAll();
    Calendar.render(habits, year);
  }
};

App.init();

window.App = App;
