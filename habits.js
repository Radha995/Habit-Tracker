'use strict';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: '📋', color: '#7c6ed6' },
  { id: 'fitness', label: 'Fitness', icon: '💪', color: '#d4908a' },
  { id: 'study', label: 'Study', icon: '📚', color: '#6ba0d4' },
  { id: 'health', label: 'Health', icon: '🥗', color: '#6bc5a0' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧘', color: '#b080c0' },
  { id: 'finance', label: 'Finance', icon: '💰', color: '#e0b060' },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const HABIT_ICONS = [
  { icon: '📚', name: 'Reading', default: true },
  { icon: '💪', name: 'Exercise' },
  { icon: '🧘', name: 'Meditation' },
  { icon: '💧', name: 'Hydration' },
  { icon: '🥗', name: 'Healthy Eating' },
  { icon: '✍️', name: 'Writing' },
  { icon: '🎯', name: 'Learning' },
  { icon: '😴', name: 'Sleep' },
  { icon: '☕', name: 'Morning Routine' },
  { icon: '🌿', name: 'Self Care' },
  { icon: '🧠', name: 'Brain Training' },
  { icon: '🎨', name: 'Creative' },
  { icon: '💼', name: 'Work' },
  { icon: '🏃', name: 'Running' },
  { icon: '🚶', name: 'Walking' },
  { icon: '🧹', name: 'Cleaning' },
  { icon: '💰', name: 'Save Money' },
  { icon: '📝', name: 'Journaling' },
  { icon: '🎵', name: 'Music' },
  { icon: '🌎', name: 'Language' },
  { icon: '📱', name: 'Digital Detox' },
  { icon: '🌅', name: 'Sunrise' },
  { icon: '🙏', name: 'Gratitude' },
  { icon: '🧎', name: 'Stretching' },
];

const ICON_TO_CATEGORY = {
  '💪': 'fitness', '🏃': 'fitness', '🚶': 'fitness', '🧎': 'fitness',
  '🥗': 'health', '💧': 'health', '🌿': 'health', '😴': 'health',
  '🧹': 'health', '☕': 'health',
  '📚': 'study', '🎯': 'study', '✍️': 'study', '🧠': 'study', '🌎': 'study',
  '📝': 'study',
  '🧘': 'mindfulness', '🙏': 'mindfulness', '🌅': 'mindfulness', '🎵': 'mindfulness',
  '💰': 'finance',
};

const Habits = {
  HABIT_ICONS,
  CATEGORIES,
  ICON_TO_CATEGORY,

  create(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Habit data must be a non-empty object');
    }

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!name) {
      throw new Error('Habit name is required and must be a non-empty string');
    }

    const description = typeof data.description === 'string' ? data.description.trim() : '';

    const frequency = (data.frequency === 'weekly') ? 'weekly' : 'daily';

    const targetCount = (typeof data.targetCount === 'number' && data.targetCount >= 1)
      ? Math.floor(data.targetCount)
      : 1;

    const color = (typeof data.color === 'string' && /^#[0-9a-f]{6}$/i.test(data.color))
      ? data.color
      : '#7c6ed6';

    let icon = (typeof data.icon === 'string') ? data.icon : '📚';
    const validIcon = HABIT_ICONS.find(i => i.icon === icon);
    if (!validIcon) icon = '📚';

    const reminderTime = data.reminderTime || null;

    const category = ICON_TO_CATEGORY[icon] || 'general';

    return {
      id: undefined,
      name,
      icon,
      category,
      description,
      frequency,
      targetCount,
      color,
      reminderTime,
      createdAt: new Date().toISOString(),
      history: {},
      archived: false,
    };
  },

  add(data) {
    const habit = this.create(data);
    return Storage.saveHabit(habit);
  },

  update(id, data) {
    if (!id) {
      throw new Error('Habit id is required for update');
    }

    const existing = Storage.getHabit(id);
    if (!existing) {
      throw new Error(`Habit with id "${id}" not found`);
    }

    const allowedFields = ['name', 'icon', 'description', 'frequency', 'targetCount', 'color', 'archived', 'reminderTime'];

    for (const key of allowedFields) {
      if (key in data) {
        if (key === 'name') {
          const trimmed = String(data[key]).trim();
          if (!trimmed) {
            throw new Error('Habit name must be a non-empty string');
          }
          existing.name = trimmed;
        } else if (key === 'icon') {
          const validIcon = HABIT_ICONS.find(i => i.icon === data[key]);
          if (validIcon) {
            existing.icon = data[key];
            existing.category = ICON_TO_CATEGORY[data[key]] || 'general';
          }
        } else if (key === 'targetCount') {
          existing.targetCount = (typeof data[key] === 'number' && data[key] >= 1)
            ? Math.floor(data[key])
            : 1;
        } else if (key === 'frequency') {
          existing.frequency = (data[key] === 'weekly') ? 'weekly' : 'daily';
        } else if (key === 'color') {
          existing.color = (typeof data[key] === 'string' && /^#[0-9a-f]{6}$/i.test(data[key]))
            ? data[key]
            : '#7c6ed6';
        } else {
          existing[key] = data[key];
        }
      }
    }

    if (typeof data.description === 'string') {
      existing.description = data.description.trim();
    }

    return Storage.saveHabit(existing);
  },

  delete(id) {
    Storage.deleteHabit(id);
  },

  getAll() {
    return Storage.getHabitsWithStats();
  },

  get(id) {
    return Storage.getHabit(id);
  },

  checkIn(id, date = null, increment = false) {
    const dateStr = date || this.getTodayString();

    const habit = Storage.getHabit(id);
    if (!habit) {
      throw new Error(`Habit with id "${id}" not found`);
    }

    if (!habit.history) {
      habit.history = {};
    }

    if (habit.history[dateStr]) {
      if (increment) {
        habit.history[dateStr].count += 1;
      }
    } else {
      habit.history[dateStr] = { count: 1, timestamp: new Date().toISOString() };
    }

    return Storage.saveHabit(habit);
  },

  uncheckIn(id, date = null) {
    const dateStr = date || this.getTodayString();

    const habit = Storage.getHabit(id);
    if (!habit) {
      throw new Error(`Habit with id "${id}" not found`);
    }

    if (!habit.history || !habit.history[dateStr]) {
      return habit;
    }

    if (habit.history[dateStr].count > 1) {
      habit.history[dateStr].count -= 1;
    } else {
      delete habit.history[dateStr];

      if (Object.keys(habit.history).length === 0) {
        habit.history = {};
      }
    }

    return Storage.saveHabit(habit);
  },

  getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  formatDate(dateStr) {
    const parts = dateStr.split('-').map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const dayName = DAYS[date.getDay()];
    const monthName = MONTHS[date.getMonth()];
    const dayNum = date.getDate();
    return `${dayName}, ${monthName} ${dayNum}`;
  },

  getDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');

    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      dates.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    return dates;
  },

  hasCheckIn(habit, dateStr) {
    return !!(habit.history && habit.history[dateStr]);
  },

  getCheckInCount(habit, dateStr) {
    return (habit.history && habit.history[dateStr] && habit.history[dateStr].count) || 0;
  },

  getPendingHabits() {
    const today = this.getTodayString();
    const habits = Storage.getHabitsWithStats();

    return habits.filter(habit => {
      if (habit.archived) {
        return false;
      }

      const todayEntry = habit.history && habit.history[today];
      const todayCount = (todayEntry && todayEntry.count) || 0;

      return todayCount < habit.targetCount;
    });
  },

  getTodaySummary() {
    const today = this.getTodayString();
    const habits = Storage.getHabitsWithStats();

    const activeHabits = habits.filter(h => !h.archived);
    const total = activeHabits.length;

    let completed = 0;

    for (const habit of activeHabits) {
      const todayEntry = habit.history && habit.history[today];
      const todayCount = (todayEntry && todayEntry.count) || 0;

      if (todayCount >= habit.targetCount) {
        completed++;
      }
    }

    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, rate };
  },
};

window.Habits = Habits;
