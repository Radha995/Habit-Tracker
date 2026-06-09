'use strict';

let _keyPrefix = 'habit-tracker-';

function getKey(type) {
  return _keyPrefix + type;
}

function setKeyPrefix(prefix) {
  _keyPrefix = prefix || 'habit-tracker-';
}

function safeParse(json, fallback) {
  try {
    const parsed = JSON.parse(json);
    return parsed !== null ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadHabits() {
  const raw = localStorage.getItem(getKey('habits'));
  return raw ? safeParse(raw, []) : [];
}

function saveHabits(habits) {
  localStorage.setItem(getKey('habits'), JSON.stringify(habits));
}

function calculateStreaks(history, createdDate) {
  const dates = Object.keys(history).sort().reverse();

  if (dates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, totalCheckins: 0, completionRate: 0 };
  }

  const totalCheckins = dates.reduce((sum, d) => sum + (history[d].count || 0), 0);

  const daysSinceCreation = Math.max(
    1,
    Math.round((Date.now() - new Date(createdDate).getTime()) / 86400000)
  );
  const completionRate = Math.min(100, (totalCheckins / daysSinceCreation) * 100);

  let currentStreak = 0;
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const sortedDates = [...dates].sort().reverse();

  if (sortedDates.length > 0) {
    const latestDate = sortedDates[0];

    const isTodayChecked = history[todayStr] && history[todayStr].count > 0;

    if (isTodayChecked) {
      currentStreak = 1;
      const targetDate = new Date(today);
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(targetDate);
        prevDate.setDate(prevDate.getDate() - i);
        const prevStr = prevDate.toISOString().slice(0, 10);
        if (history[prevStr] && history[prevStr].count > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (history[yesterdayStr] && history[yesterdayStr].count > 0) {
        currentStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const prevDate = new Date(yesterday);
          prevDate.setDate(prevDate.getDate() - i);
          const prevStr = prevDate.toISOString().slice(0, 10);
          if (history[prevStr] && history[prevStr].count > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }
  }

  let longestStreak = 0;
  let streak = 0;
  const chronological = [...dates].sort();
  for (let i = 0; i < chronological.length; i++) {
    const current = new Date(chronological[i]);
    if (i === 0) {
      streak = 1;
    } else {
      const prev = new Date(chronological[i - 1]);
      const diff = (current - prev) / 86400000;
      if (diff <= 1) {
        streak++;
      } else {
        streak = 1;
      }
    }
    if (streak > longestStreak) {
      longestStreak = streak;
    }
  }

  return { currentStreak, longestStreak, totalCheckins, completionRate };
}

const Storage = {
  getHabits() {
    return loadHabits();
  },

  saveHabit(habit) {
    const habits = loadHabits();
    const idx = habits.findIndex(h => h.id === habit.id);
    const entry = { ...habit };
    if (!entry.id) {
      entry.id = generateId();
    }
    if (idx === -1) {
      habits.push(entry);
    } else {
      habits[idx] = entry;
    }
    saveHabits(habits);
    return entry;
  },

  getHabit(id) {
    const habits = loadHabits();
    return habits.find(h => h.id === id) || null;
  },

  deleteHabit(id) {
    const habits = loadHabits();
    const filtered = habits.filter(h => h.id !== id);
    if (filtered.length !== habits.length) {
      saveHabits(filtered);
    }
  },

  getHabitsWithStats() {
    const habits = loadHabits();
    return habits.map(habit => ({
      ...habit,
      ...calculateStreaks(habit.history || {}, habit.createdDate || new Date().toISOString()),
    }));
  },

  getSettings() {
    const raw = localStorage.getItem(getKey('settings'));
    const defaults = {
      theme: 'light', notifications: false, lastReminderTime: null,
      wakeTime: '07:00', sleepTime: '23:00', language: 'en',
    };
    if (!raw) {
      return { ...defaults };
    }
    const parsed = safeParse(raw, null);
    if (!parsed || typeof parsed !== 'object') {
      return { ...defaults };
    }
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      notifications: !!parsed.notifications,
      lastReminderTime: typeof parsed.lastReminderTime === 'string' ? parsed.lastReminderTime : defaults.lastReminderTime,
      wakeTime: typeof parsed.wakeTime === 'string' ? parsed.wakeTime : defaults.wakeTime,
      sleepTime: typeof parsed.sleepTime === 'string' ? parsed.sleepTime : defaults.sleepTime,
      language: typeof parsed.language === 'string' ? parsed.language : defaults.language,
    };
  },

  saveSettings(settings) {
    localStorage.setItem(getKey('settings'), JSON.stringify(settings));
  },

  setKeyPrefix(prefix) {
    setKeyPrefix(prefix);
  },

  clearAll() {
    localStorage.removeItem(getKey('habits'));
    localStorage.removeItem(getKey('settings'));
  },
};

window.Storage = Storage;
