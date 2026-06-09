'use strict';

const Badges = {
  badges: [],

  init() {
    this._registerBadges();
  },

  _registerBadges() {
    this.badges = [
      {
        id: 'first-checkin',
        name: 'First Step',
        icon: '🟢',
        description: 'Complete your first check-in',
        check: (habits, stats) => stats.totalCheckins >= 1
      },
      {
        id: 'week-streak',
        name: 'On Fire',
        icon: '🔥',
        description: 'Maintain a 7-day streak',
        check: (habits, stats) => stats.maxStreak >= 7
      },
      {
        id: 'month-streak',
        name: 'Unstoppable',
        icon: '💪',
        description: 'Maintain a 30-day streak',
        check: (habits, stats) => stats.maxStreak >= 30
      },
      {
        id: 'hundred-streak',
        name: 'Iron Will',
        icon: '⚡',
        description: 'Maintain a 100-day streak',
        check: (habits, stats) => stats.maxStreak >= 100
      },
      {
        id: 'year-streak',
        name: 'Habit Legend',
        icon: '👑',
        description: 'Maintain a 365-day streak',
        check: (habits, stats) => stats.maxStreak >= 365
      },
      {
        id: 'ten-checkins',
        name: 'Getting Started',
        icon: '📋',
        description: 'Complete 10 check-ins',
        check: (habits, stats) => stats.totalCheckins >= 10
      },
      {
        id: 'fifty-checkins',
        name: 'Dedicated',
        icon: '🎯',
        description: 'Complete 50 check-ins',
        check: (habits, stats) => stats.totalCheckins >= 50
      },
      {
        id: 'hundred-checkins',
        name: 'Committed',
        icon: '⭐',
        description: 'Complete 100 check-ins',
        check: (habits, stats) => stats.totalCheckins >= 100
      },
      {
        id: 'fivehundred-checkins',
        name: 'Veteran',
        icon: '🏅',
        description: 'Complete 500 check-ins',
        check: (habits, stats) => stats.totalCheckins >= 500
      },
      {
        id: 'thousand-checkins',
        name: 'Legend',
        icon: '🏆',
        description: 'Complete 1,000 check-ins',
        check: (habits, stats) => stats.totalCheckins >= 1000
      },
      {
        id: 'three-habits',
        name: 'Planter',
        icon: '🌱',
        description: 'Create 3 habits',
        check: (habits, stats) => habits.length >= 3
      },
      {
        id: 'five-habits',
        name: 'Gardener',
        icon: '🌳',
        description: 'Create 5 habits',
        check: (habits, stats) => habits.length >= 5
      },
      {
        id: 'ten-habits',
        name: 'Forester',
        icon: '🌲',
        description: 'Create 10 habits',
        check: (habits, stats) => habits.length >= 10
      },
      {
        id: 'perfect-week',
        name: 'Perfect Week',
        icon: '🌟',
        description: 'Complete all habits every day for a week',
        check: (habits, stats) => stats.bestWeeklyRate >= 100
      },
      {
        id: 'perfect-month',
        name: 'Perfect Month',
        icon: '💎',
        description: 'Complete all habits every day for a month',
        check: (habits, stats) => stats.bestMonthlyRate >= 100
      },
      {
        id: 'early-bird',
        name: 'Early Bird',
        icon: '☀️',
        description: 'Check in before 8 AM',
        check: (habits, stats) => stats.earlyBirdCount >= 1
      },
      {
        id: 'night-owl',
        name: 'Night Owl',
        icon: '🦉',
        description: 'Check in after 10 PM',
        check: (habits, stats) => stats.nightOwlCount >= 1
      },
      {
        id: 'first-habit',
        name: 'Beginner',
        icon: '🎉',
        description: 'Create your first habit',
        check: (habits, stats) => habits.length >= 1
      },
    ];
  },

  getEarnedBadges() {
    const habits = Habits.getAll();
    const stats = this._computeStats(habits);
    this.init();
    return this.badges.filter(b => b.check(habits, stats));
  },

  getNewBadges() {
    const earned = this.getEarnedBadges();
    const saved = this._loadEarnedBadges();
    return earned.filter(b => !saved.includes(b.id));
  },

  saveEarnedBadges() {
    const earned = this.getEarnedBadges();
    const ids = earned.map(b => b.id);
    localStorage.setItem('habit-tracker-badges', JSON.stringify(ids));
  },

  _loadEarnedBadges() {
    try {
      const raw = localStorage.getItem('habit-tracker-badges');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  },

  _computeStats(habits) {
    let totalCheckins = 0;
    let maxStreak = 0;
    let maxLongestStreak = 0;
    let earlyBirdCount = 0;
    let nightOwlCount = 0;
    let bestWeeklyRate = 0;
    let bestMonthlyRate = 0;

    habits.forEach(h => {
      if (!h.archived) {
        totalCheckins += h.totalCheckins || 0;
        if ((h.currentStreak || 0) > maxStreak) maxStreak = h.currentStreak;
        if ((h.longestStreak || 0) > maxLongestStreak) maxLongestStreak = h.longestStreak;

        Object.values(h.history || {}).forEach(entry => {
          if (entry.timestamp) {
            const hour = new Date(entry.timestamp).getHours();
            if (hour < 8) earlyBirdCount++;
            if (hour >= 22) nightOwlCount++;
          }
        });
      }
    });

    const today = new Date();
    const weeklyCompletions = [];
    for (let w = 0; w < 4; w++) {
      let completed = 0;
      let total = 0;
      for (let d = 0; d < 7; d++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (w * 7 + d));
        const dateStr = date.toISOString().slice(0, 10);
        habits.forEach(h => {
          if (!h.archived) {
            total++;
            if (h.history && h.history[dateStr] && h.history[dateStr].count >= (h.targetCount || 1)) {
              completed++;
            }
          }
        });
      }
      const rate = total > 0 ? (completed / total) * 100 : 0;
      weeklyCompletions.push(rate);
    }
    bestWeeklyRate = Math.max(...weeklyCompletions, 0);

    let monthlyCompleted = 0;
    let monthlyTotal = 0;
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    for (let d = 0; d < 30; d++) {
      const date = new Date(monthStart);
      date.setDate(date.getDate() + d);
      const dateStr = date.toISOString().slice(0, 10);
      habits.forEach(h => {
        if (!h.archived) {
          monthlyTotal++;
          if (h.history && h.history[dateStr] && h.history[dateStr].count >= (h.targetCount || 1)) {
            monthlyCompleted++;
          }
        }
      });
    }
    bestMonthlyRate = monthlyTotal > 0 ? (monthlyCompleted / monthlyTotal) * 100 : 0;

    return {
      totalCheckins,
      maxStreak,
      maxLongestStreak,
      habitsCount: habits.length,
      earlyBirdCount,
      nightOwlCount,
      bestWeeklyRate,
      bestMonthlyRate
    };
  },

  getBadge(id) {
    this.init();
    return this.badges.find(b => b.id === id) || null;
  },

  getEarnedCount() {
    return this.getEarnedBadges().length;
  },

  getTotalBadges() {
    this.init();
    return this.badges.length;
  }
};

window.Badges = Badges;
