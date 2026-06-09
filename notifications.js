'use strict';

const Notifications = {
  _interval: null,
  _lastHourlyDate: null,

  async sendEmail(to, subject, body) {
    try {
      await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(to), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ subject, message: body }),
      });
      return true;
    } catch (e) {
      console.warn('Email notification failed:', e);
      return false;
    }
  },

  getEmail() {
    const user = Auth.getCurrentUser();
    return user && user.email ? user.email : null;
  },

  buildReminderBody(pendingHabits) {
    const lines = [
      'Your Habit Tracker Reminder',
      '━━━━━━━━━━━━━━━━━━━━━',
      '',
      'You have pending habits to complete:',
      '',
    ];
    pendingHabits.forEach(h => {
      const today = Habits.getTodayString();
      const count = Habits.getCheckInCount(h, today);
      lines.push(`${h.icon} ${h.name} — ${count}/${h.targetCount} done`);
    });
    lines.push('', '━━━━━━━━━━━━━━━━━━━━━', 'Stay consistent! Every step counts.');
    return lines.join('\n');
  },

  async sendReminder(pendingHabits) {
    if (pendingHabits.length === 0) return;
    const email = this.getEmail();
    if (!email) return;

    const names = pendingHabits.map(h => h.name);
    const subject = `${__('habit.reminder')} — ${names.length} ${__('habits.need.checkin')}`;
    const body = this.buildReminderBody(pendingHabits);
    await this.sendEmail(email, subject, body);
  },

  async sendTimeReminder(habit) {
    const email = this.getEmail();
    if (!email) return;
    const subject = `${__('time.for')}: ${habit.name}`;
    const body = `Time to work on: ${habit.icon} ${habit.name}\n\nYour target: ${habit.targetCount} per ${habit.frequency}\n\nThis is your scheduled reminder from Habit Tracker.`;
    await this.sendEmail(email, subject, body);
  },

  async sendSleepReminder(count, label) {
    const email = this.getEmail();
    if (!email) return;
    const subject = `${__('wind.down')} — ${count} ${label}`;
    const body = `Wind down time!\n\nYou still have ${count} habit${count > 1 ? 's' : ''} pending for today.\n\nCheck them off before you sleep!`;
    await this.sendEmail(email, subject, body);
  },

  async start() {
    if (this._interval) clearInterval(this._interval);
    const settings = Storage.getSettings();
    if (!settings.notifications) return false;
    this._interval = setInterval(() => this._tick(), 30000);
    this._tick();
    return true;
  },

  stop() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    this._lastHourlyDate = null;
  },

  _tick() {
    const settings = Storage.getSettings();
    if (!settings.notifications) return;

    const email = this.getEmail();
    if (!email) return;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [wakeH, wakeM] = (settings.wakeTime || '07:00').split(':').map(Number);
    const [sleepH, sleepM] = (settings.sleepTime || '23:00').split(':').map(Number);
    const wakeMinutes = wakeH * 60 + wakeM;
    const sleepMinutes = sleepH * 60 + sleepM;

    if (currentMinutes < wakeMinutes || currentMinutes >= sleepMinutes) return;

    const allHabits = Habits.getAll().filter(h => !h.archived);
    const pending = Habits.getPendingHabits();

    if (pending.length === 0) return;

    // 1. Time-based email reminders for habits with specific reminder times
    allHabits.forEach(habit => {
      if (!habit.reminderTime) return;
      const [h, m] = habit.reminderTime.split(':').map(Number);
      const habitMinutes = h * 60 + m;
      if (Math.abs(currentMinutes - habitMinutes) <= 1) {
        const todayEntry = habit.history && habit.history[today];
        const todayCount = (todayEntry && todayEntry.count) || 0;
        if (todayCount < habit.targetCount) {
          this.sendTimeReminder(habit);
        }
      }
    });

    // 2. Hourly email summary for incomplete habits (once per hour)
    const hourlyKey = `${today}-${now.getHours()}`;
    if (this._lastHourlyDate !== hourlyKey) {
      this._lastHourlyDate = hourlyKey;
      this.sendReminder(pending);
    }

    // 3. Before-sleep email reminder (30 min before sleep time)
    const beforeSleepMinutes = sleepMinutes - 30;
    if (currentMinutes >= beforeSleepMinutes && currentMinutes < beforeSleepMinutes + 2) {
      this.sendSleepReminder(pending.length, pending.length === 1 ? __('habit.needs.checkin') : __('habits.need.checkin'));
    }
  },
};

window.Notifications = Notifications;
