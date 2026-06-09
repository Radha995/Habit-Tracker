'use strict';

const AICoach = {
  analyzePatterns(habits) {
    const active = habits.filter(h => !h.archived);
    const today = this._getTodayString();
    const todayDate = new Date(today + 'T00:00:00');

    if (active.length === 0) {
      return {
        totalHabits: 0, totalCheckins: 0, overallStreak: 0,
        bestDayOfWeek: null, worstDayOfWeek: null,
        mostConsistentHabit: null, leastConsistentHabit: null,
        streaksAtRisk: [], weeklyTrend: 'steady', monthlyTrend: 'steady',
        dayOfWeekBreakdown: {}, timeOfDayPreference: 'mixed',
        averageCompletionRate: 0, daysSinceFirstHabit: 0, currentStreaks: [],
      };
    }

    const totalHabits = active.length;

    const allEntries = [];
    let oldestDate = today;
    let totalCheckins = 0;

    for (const habit of active) {
      if (!habit.history) continue;
      for (const [date, entry] of Object.entries(habit.history)) {
        const count = entry.count || 1;
        totalCheckins += count;
        allEntries.push({
          date,
          dayOfWeek: this._getDayOfWeek(date),
          count,
          hour: entry.timestamp ? new Date(entry.timestamp).getHours() : -1,
          habitId: habit.id,
          habitName: habit.name,
        });
        if (date < oldestDate) oldestDate = date;
      }
    }

    const overallStreak = Math.max(0, ...active.map(h => h.currentStreak || 0));

    const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayCheckins = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const dayOccurrences = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };

    if (allEntries.length > 0) {
      const rangeDates = this._getDatesInRange(oldestDate, today);
      for (const d of rangeDates) {
        const dw = this._getDayOfWeek(d);
        dayOccurrences[dw]++;
      }
    }

    for (const entry of allEntries) {
      dayCheckins[entry.dayOfWeek] += entry.count;
    }

    const dayOfWeekBreakdown = {};
    for (const d of dayKeys) {
      dayOfWeekBreakdown[d] = dayOccurrences[d] > 0
        ? Math.round((dayCheckins[d] / dayOccurrences[d]) * 10) / 10
        : 0;
    }

    const sortedDays = dayKeys
      .filter(d => dayCheckins[d] > 0)
      .sort((a, b) => dayCheckins[b] - dayCheckins[a]);

    const bestDayOfWeek = sortedDays.length > 0 ? sortedDays[0] : null;
    const worstDayOfWeek = sortedDays.length > 0 ? sortedDays[sortedDays.length - 1] : null;

    let mostConsistentHabit = null;
    let leastConsistentHabit = null;
    let maxRate = -1;
    let minRate = Infinity;

    for (const habit of active) {
      const rate = habit.completionRate || 0;
      if (rate > maxRate) {
        maxRate = rate;
        mostConsistentHabit = habit.name;
      }
      if (rate < minRate && habit.totalCheckins > 0) {
        minRate = rate;
        leastConsistentHabit = habit.name;
      }
    }
    if (minRate === Infinity) leastConsistentHabit = null;

    const streaksAtRisk = active.filter(h => {
      const streak = h.currentStreak || 0;
      if (streak <= 3) return false;
      return !(h.history && h.history[today] && h.history[today].count > 0);
    }).map(h => ({ habitName: h.name, streak: h.currentStreak }));

    const last7 = this._getDateRangeCheckins(allEntries, 7);
    const prev7 = this._getDateRangeCheckins(allEntries, 14, 7);
    const weeklyTrend = this._computeTrend(last7, prev7);

    const last30 = this._getDateRangeCheckins(allEntries, 30);
    const prev30 = this._getDateRangeCheckins(allEntries, 60, 30);
    const monthlyTrend = this._computeTrend(last30, prev30);

    const hourCounts = { morning: 0, afternoon: 0, evening: 0 };
    for (const entry of allEntries) {
      if (entry.hour >= 0) {
        const tod = this._getTimeOfDay(entry.hour);
        hourCounts[tod]++;
      }
    }
    const totalTimed = hourCounts.morning + hourCounts.afternoon + hourCounts.evening;
    let timeOfDayPreference = 'mixed';
    if (totalTimed > 0) {
      const morningPct = hourCounts.morning / totalTimed;
      const afternoonPct = hourCounts.afternoon / totalTimed;
      const eveningPct = hourCounts.evening / totalTimed;
      if (morningPct > 0.5) timeOfDayPreference = 'morning';
      else if (afternoonPct > 0.5) timeOfDayPreference = 'afternoon';
      else if (eveningPct > 0.5) timeOfDayPreference = 'evening';
    }

    const totalCompletionRate = active.length > 0
      ? active.reduce((sum, h) => sum + (h.completionRate || 0), 0) / active.length
      : 0;

    const firstHabitDate = active.reduce((earliest, h) => {
      return h.createdAt && h.createdAt < earliest ? h.createdAt : earliest;
    }, active[0]?.createdAt || today);

    const daysSinceFirstHabit = Math.max(0,
      Math.round((todayDate - new Date(firstHabitDate)) / 86400000));

    const currentStreaks = active
      .filter(h => (h.currentStreak || 0) > 0)
      .map(h => ({ habitName: h.name, streak: h.currentStreak }))
      .sort((a, b) => b.streak - a.streak);

    return {
      totalHabits,
      totalCheckins,
      overallStreak,
      bestDayOfWeek,
      worstDayOfWeek,
      mostConsistentHabit,
      leastConsistentHabit,
      streaksAtRisk,
      weeklyTrend,
      monthlyTrend,
      dayOfWeekBreakdown,
      timeOfDayPreference,
      averageCompletionRate: Math.round(totalCompletionRate * 10) / 10,
      daysSinceFirstHabit,
      currentStreaks,
    };
  },

  getSuggestions(habits, patterns) {
    const suggestions = [];

    if (patterns.totalHabits === 0) {
      suggestions.push({
        icon: '🚀',
        title: 'Start your journey',
        description: 'Create your first habit and begin building consistency. Small steps lead to big changes!',
        priority: 'high',
      });
      return suggestions;
    }

    if (patterns.streaksAtRisk.length > 0) {
      const names = patterns.streaksAtRisk.map(s => s.habitName).join(', ');
      suggestions.push({
        icon: '🔥',
        title: 'Streaks at risk!',
        description: `You have ${patterns.streaksAtRisk.length} streak(s) at risk today: ${names}. Log in now to keep them alive!`,
        priority: 'high',
      });
    }

    if (patterns.weeklyTrend === 'declining') {
      suggestions.push({
        icon: '📉',
        title: 'Weekly dip detected',
        description: 'Your consistency has dipped this week. Remember: small steps add up. Even a single check-in helps!',
        priority: 'high',
      });
    }

    if (patterns.averageCompletionRate < 50 && patterns.totalHabits > 0) {
      suggestions.push({
        icon: '🎯',
        title: 'Focus on consistency',
        description: 'Your overall completion rate is below 50%. Try reducing the number of habits or setting more achievable targets.',
        priority: 'high',
      });
    }

    if (patterns.worstDayOfWeek) {
      suggestions.push({
        icon: '📅',
        title: `${patterns.worstDayOfWeek}s need attention`,
        description: `Your ${patterns.worstDayOfWeek}s have the fewest check-ins. Try setting a recurring reminder for ${patterns.worstDayOfWeek}s.`,
        priority: 'medium',
      });
    }

    if (patterns.leastConsistentHabit) {
      suggestions.push({
        icon: '💪',
        title: 'Break it down',
        description: `Try breaking "${patterns.leastConsistentHabit}" into smaller daily targets to make it more manageable.`,
        priority: 'medium',
      });
    }

    if (patterns.timeOfDayPreference && patterns.timeOfDayPreference !== 'mixed') {
      suggestions.push({
        icon: '⏰',
        title: 'Optimize your schedule',
        description: `You tend to check in most during the ${patterns.timeOfDayPreference}. Try scheduling new habits during this time for better consistency.`,
        priority: 'medium',
      });
    }

    if (patterns.monthlyTrend === 'declining') {
      suggestions.push({
        icon: '📊',
        title: 'Monthly trend down',
        description: 'Your monthly consistency has dropped compared to last month. Review what changed and refocus on your routines.',
        priority: 'medium',
      });
    }

    if (patterns.mostConsistentHabit) {
      suggestions.push({
        icon: '⭐',
        title: 'Build on your strength',
        description: `You're great at "${patterns.mostConsistentHabit}"! Try adding a related habit to expand your routine.`,
        priority: 'low',
      });
    }

    if (patterns.overallStreak > 7) {
      suggestions.push({
        icon: '🏆',
        title: 'Impressive streak!',
        description: `Your ${patterns.overallStreak}-day streak is remarkable! Consistency is your superpower — keep it going!`,
        priority: 'low',
      });
    }

    if (patterns.weeklyTrend === 'improving') {
      suggestions.push({
        icon: '📈',
        title: 'You\'re on an upswing',
        description: 'This week is better than last week. Whatever you\'re doing differently, keep it up!',
        priority: 'low',
      });
    }

    if (suggestions.length < 3) {
      suggestions.push({
        icon: '🌟',
        title: 'Keep showing up',
        description: 'Every check-in builds momentum. You\'re doing great — just keep going!',
        priority: 'low',
      });
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return suggestions.slice(0, 5);
  },

  getQuote(habits) {
    const active = habits.filter(h => !h.archived);
    const stats = this.analyzePatterns(habits);

    if (active.length === 0 || stats.totalCheckins === 0) {
      return Quotes.getQuote();
    }

    const templates = [
      (h, s) => {
        const top = s.currentStreaks.sort((a, b) => b.streak - a.streak)[0];
        if (!top || top.streak < 2) return null;
        return {
          text: `${top.streak} days strong on "${top.habitName}". Momentum like this moves mountains.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        if (s.totalCheckins < 5) return null;
        return {
          text: `You've checked in ${s.totalCheckins} times across ${s.totalHabits} habits. That's real dedication in action.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        if (s.weeklyTrend !== 'improving') return null;
        return {
          text: `Your consistency is trending up! This week is stronger than last. Small steps, big results.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        const consistent = h.find(hab => hab.name === s.mostConsistentHabit);
        if (!consistent || consistent.totalCheckins < 3) return null;
        const pct = Math.round(consistent.completionRate || 0);
        return {
          text: `You've stayed on track with "${consistent.name}" ${pct}% of the time. That's what habits are made of.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        if (!s.bestDayOfWeek || !s.dayOfWeekBreakdown[s.bestDayOfWeek]) return null;
        return {
          text: `${s.bestDayOfWeek}s are your powerhouse day! You average ${s.dayOfWeekBreakdown[s.bestDayOfWeek]} check-ins. Own that momentum.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        if (s.totalHabits < 2) return null;
        return {
          text: `Juggling ${s.totalHabits} habits takes real commitment. You're not just building habits — you're building a lifestyle.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        const atRisk = s.streaksAtRisk.find(st => st.streak >= 5);
        if (!atRisk) return null;
        return {
          text: `Your ${atRisk.streak}-day streak on "${atRisk.habitName}" needs a check-in today. Don't let that fire go out!`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        const newStreak = s.currentStreaks.find(st => st.streak >= 2 && st.streak <= 5);
        if (!newStreak) return null;
        return {
          text: `A ${newStreak.streak}-day streak on "${newStreak.habitName}" is taking root. Nurture it — every day counts!`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        const top = s.currentStreaks.sort((a, b) => b.streak - a.streak)[0];
        if (!top || top.streak < 14) return null;
        return {
          text: `Two weeks strong on "${top.habitName}"! At this point, it's not motivation — it's identity.`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        const low = h.filter(hab => (hab.currentStreak || 0) === 0 && (hab.totalCheckins || 0) > 0);
        if (low.length === 0) return null;
        const names = low.map(hab => `"${hab.name}"`).join(', ');
        return {
          text: `Even the best streaks reset sometimes. The real win is starting again. Pick up ${names} today!`,
          author: 'AI Coach',
        };
      },
      (h, s) => {
        if (s.averageCompletionRate < 30 || s.totalCheckins < 3) return null;
        return {
          text: `Your overall consistency is ${Math.round(s.averageCompletionRate)}%. Not perfection — but real, honest progress. Keep going!`,
          author: 'AI Coach',
        };
      },
    ];

    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    for (let i = 0; i < Math.min(5, shuffled.length); i++) {
      const result = shuffled[i](active, stats);
      if (result) return result;
    }

    return Quotes.getQuote();
  },

  generateWeeklyReview(habits) {
    const active = habits.filter(h => !h.archived);
    const today = this._getTodayString();
    const todayDate = new Date(today + 'T00:00:00');

    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    const prevDates = [];
    for (let i = 13; i >= 7; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      prevDates.push(d.toISOString().slice(0, 10));
    }

    const weekStart = dates[0];
    const weekEnd = dates[dates.length - 1];
    const dateRange = this._formatDateRange(weekStart, weekEnd);

    const dayCheckins = {};
    let totalCheckins = 0;
    let totalPossible = 0;
    const habitCheckins = {};

    for (const d of dates) {
      dayCheckins[d] = 0;
    }

    for (const habit of active) {
      if (!habit.history) continue;
      habitCheckins[habit.id] = { name: habit.name, checkedDays: [], total: 0 };
      for (const d of dates) {
        const c = (habit.history[d] && habit.history[d].count) || 0;
        if (c > 0) {
          dayCheckins[d] += c;
          habitCheckins[habit.id].checkedDays.push(d);
          habitCheckins[habit.id].total += c;
          totalCheckins += c;
        }
      }
      if (habit.targetCount && habit.targetCount > 0) {
        totalPossible += habit.targetCount * dates.length;
      } else {
        totalPossible += dates.length;
      }
    }

    const prevWeekCheckins = {};
    let prevTotal = 0;
    for (const d of prevDates) {
      let count = 0;
      for (const habit of active) {
        if (habit.history && habit.history[d]) {
          count += habit.history[d].count || 0;
        }
      }
      prevWeekCheckins[d] = count;
      prevTotal += count;
    }

    const completionRate = totalPossible > 0
      ? Math.min(100, Math.round((totalCheckins / totalPossible) * 100))
      : 0;

    const bestDay = Object.entries(dayCheckins)
      .filter(([_, c]) => c > 0)
      .sort((a, b) => b[1] - a[1]);
    const bestDayStr = bestDay.length > 0 ? this._formatDate(bestDay[0][0]) : 'N/A';
    const worstDay = Object.entries(dayCheckins)
      .filter(([_, c]) => c > 0)
      .sort((a, b) => a[1] - b[1]);
    const worstDayStr = worstDay.length > 0 ? this._formatDate(worstDay[0][0]) : 'N/A';

    const perfectHabits = Object.values(habitCheckins).filter(h => h.checkedDays.length === dates.length);
    const neglectedHabits = Object.values(habitCheckins).filter(h => h.checkedDays.length === 0 || h.total === 0);
    const partialHabits = Object.values(habitCheckins).filter(h => h.checkedDays.length > 0 && h.checkedDays.length < dates.length);

    const streaksMaintained = active.filter(h => {
      const streak = h.currentStreak || 0;
      return streak >= 7;
    }).length;

    const highlights = [];
    const lowlights = [];
    const trends = [];
    const recommendations = [];

    if (perfectHabits.length > 0) {
      highlights.push(`You didn't miss a day on ${perfectHabits.length} habit(s): ${perfectHabits.map(h => h.name).join(', ')}. Perfect week!`);
    }

    if (bestDay.length > 0) {
      highlights.push(`Your best day was ${bestDayStr} with ${bestDay[0][1]} check-ins.`);
    }

    if (neglectedHabits.length > 0) {
      lowlights.push(`You missed ${neglectedHabits.length} habit(s) entirely this week: ${neglectedHabits.map(h => h.name).join(', ')}.`);
    }

    if (partialHabits.length > 0) {
      lowlights.push(`${partialHabits.length} habit(s) had partial weeks. Try to close the gaps.`);
    }

    if (totalCheckins > prevTotal) {
      trends.push(`You had ${totalCheckins} check-ins this week vs ${prevTotal} last week — that's an improvement!`);
    } else if (totalCheckins < prevTotal) {
      trends.push(`Check-ins dropped from ${prevTotal} last week to ${totalCheckins} this week. Let's turn it around!`);
    } else {
      trends.push(`You matched last week's ${totalCheckins} check-ins. Consistency is your strength!`);
    }

    if (completionRate >= 80) {
      highlights.push(`Overall completion rate of ${completionRate}% — outstanding!`);
    } else if (completionRate >= 50) {
      trends.push(`Your completion rate was ${completionRate}%. Room for growth, but solid effort!`);
    } else {
      lowlights.push(`Your completion rate was only ${completionRate}%. Let's aim higher next week.`);
    }

    if (neglectedHabits.length > 0) {
      recommendations.push(`Focus on reconnecting with ${neglectedHabits.map(h => `"${h.name}"`).join(', ')} next week.`);
    }

    if (partialHabits.length > 0) {
      recommendations.push(`Try to check in at least every other day on ${partialHabits.map(h => `"${h.name}"`).join(', ')}.`);
    }

    if (bestDay.length > 0 && worstDay.length > 0 && bestDay[0][0] !== worstDay[0][0]) {
      const bestDate = new Date(bestDay[0][0] + 'T00:00:00');
      const bestDayName = this._getDayOfWeek(bestDay[0][0]);
      recommendations.push(`You're strongest on ${bestDayName}s. Set a recurring reminder mid-week to boost weaker days.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Keep doing what you\'re doing — consistency is working for you!');
    }

    const rating = this._getRating(completionRate);

    const summary = completionRate >= 80
      ? `This was a fantastic week! You maintained ${perfectHabits.length} perfect habit streak(s) and hit ${completionRate}% completion.`
      : completionRate >= 50
        ? `A decent week with ${totalCheckins} total check-ins across ${active.length} habits. ${highlights.length > 0 ? 'Some bright spots to build on.' : 'Keep pushing!'}`
        : `A tough week with only ${completionRate}% completion. Every week is a fresh start — let's reset and refocus!`;

    return {
      title: 'Weekly Review',
      dateRange,
      summary,
      stats: {
        totalCheckins,
        completionRate,
        streaksMaintained,
        bestDay: bestDayStr,
        worstDay: worstDayStr,
      },
      highlights,
      lowlights,
      trends,
      recommendations,
      rating: rating.rating,
      starRating: rating.stars,
    };
  },

  generateMonthlyReview(habits) {
    const active = habits.filter(h => !h.archived);
    const today = this._getTodayString();
    const todayDate = new Date(today + 'T00:00:00');

    const monthDates = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      monthDates.push(d.toISOString().slice(0, 10));
    }

    const prevMonthDates = [];
    for (let i = 59; i >= 30; i--) {
      const d = new Date(todayDate);
      d.setDate(d.getDate() - i);
      prevMonthDates.push(d.toISOString().slice(0, 10));
    }

    const monthStart = monthDates[0];
    const monthEnd = monthDates[monthDates.length - 1];
    const dateRange = this._formatDateRange(monthStart, monthEnd);

    const dayCheckins = {};
    let totalCheckins = 0;
    let totalPossible = 0;
    const habitCheckins = {};

    for (const d of monthDates) dayCheckins[d] = 0;

    for (const habit of active) {
      if (!habit.history) continue;
      habitCheckins[habit.id] = { name: habit.name, checkedDays: [], total: 0 };
      for (const d of monthDates) {
        const c = (habit.history[d] && habit.history[d].count) || 0;
        if (c > 0) {
          dayCheckins[d] += c;
          habitCheckins[habit.id].checkedDays.push(d);
          habitCheckins[habit.id].total += c;
          totalCheckins += c;
        }
      }
      if (habit.targetCount && habit.targetCount > 0) {
        totalPossible += habit.targetCount * monthDates.length;
      } else {
        totalPossible += monthDates.length;
      }
    }

    let prevMonthTotal = 0;
    for (const d of prevMonthDates) {
      for (const habit of active) {
        if (habit.history && habit.history[d]) {
          prevMonthTotal += habit.history[d].count || 0;
        }
      }
    }

    const completionRate = totalPossible > 0
      ? Math.min(100, Math.round((totalCheckins / totalPossible) * 100))
      : 0;

    const weekBreakdown = [];
    for (let w = 0; w < 4; w++) {
      const start = w * 7;
      const weekDays = monthDates.slice(start, start + 7);
      let count = 0;
      for (const d of weekDays) {
        count += dayCheckins[d] || 0;
      }
      weekBreakdown.push({ week: w + 1, checkins: count });
    }
    weekBreakdown.sort((a, b) => b.checkins - a.checkins);
    const bestWeek = weekBreakdown.length > 0 ? weekBreakdown[0] : null;
    const worstWeek = weekBreakdown.length > 1 ? weekBreakdown[weekBreakdown.length - 1] : null;

    const sortedDays = Object.entries(dayCheckins)
      .filter(([_, c]) => c > 0)
      .sort((a, b) => b[1] - a[1]);
    const bestDayStr = sortedDays.length > 0 ? this._formatDate(sortedDays[0][0]) : 'N/A';
    const worstDayStr = sortedDays.length > 0 ? this._formatDate(sortedDays[sortedDays.length - 1][0]) : 'N/A';

    const perfectHabits = Object.values(habitCheckins).filter(h => h.checkedDays.length >= 25);
    const neglectedHabits = Object.values(habitCheckins).filter(h => h.checkedDays.length === 0 || h.total === 0);
    const partialHabits = Object.values(habitCheckins).filter(h => {
      const ratio = h.checkedDays.length / monthDates.length;
      return ratio > 0 && ratio < 0.8;
    });

    const longestStreakThisMonth = active.reduce((max, h) => {
      return h.currentStreak > max ? h.currentStreak : max;
    }, 0);

    const monthTrend = totalCheckins > prevMonthTotal ? 'improving' :
      totalCheckins < prevMonthTotal ? 'declining' : 'steady';

    const highlights = [];
    const lowlights = [];
    const trends = [];
    const recommendations = [];

    if (sortedDays.length > 0) {
      highlights.push(`Your best day was ${bestDayStr} with ${sortedDays[0][1]} check-ins.`);
      highlights.push(`Your most productive ${this._getDayOfWeek(sortedDays[0][0])}s averaged the most check-ins this month.`);
    }

    if (longestStreakThisMonth >= 30) {
      highlights.push(`You hit a ${longestStreakThisMonth}-day streak! A full month of consistency!`);
    } else if (longestStreakThisMonth >= 14) {
      highlights.push(`Your longest streak was ${longestStreakThisMonth} days. That's two weeks of dedication!`);
    } else if (longestStreakThisMonth > 0) {
      highlights.push(`Your best streak this month was ${longestStreakThisMonth} days. Building momentum!`);
    }

    if (perfectHabits.length > 0) {
      highlights.push(`${perfectHabits.length} habit(s) had near-perfect attendance this month: ${perfectHabits.map(h => h.name).join(', ')}.`);
    }

    if (neglectedHabits.length > 0) {
      lowlights.push(`${neglectedHabits.length} habit(s) were completely missed this month: ${neglectedHabits.map(h => h.name).join(', ')}.`);
    }

    if (partialHabits.length > 0) {
      lowlights.push(`${partialHabits.length} habit(s) had inconsistent check-ins. Aim for more regular attendance next month.`);
    }

    if (bestWeek && worstWeek && bestWeek.week !== worstWeek.week) {
      trends.push(`Week ${bestWeek.week} was your strongest with ${bestWeek.checkins} check-ins, while week ${worstWeek.week} was your weakest with ${worstWeek.checkins}.`);
    }

    if (totalCheckins > prevMonthTotal) {
      trends.push(`You had ${totalCheckins} check-ins this month, up from ${prevMonthTotal} last month. Great improvement!`);
    } else if (totalCheckins < prevMonthTotal) {
      trends.push(`Check-ins dropped from ${prevMonthTotal} last month to ${totalCheckins} this month. Let's bounce back!`);
    } else {
      trends.push(`You matched last month with ${totalCheckins} check-ins. Solid consistency!`);
    }

    trends.push(`Overall trend: ${monthTrend}.`);

    if (neglectedHabits.length > 0) {
      recommendations.push(`Revisit ${neglectedHabits.map(h => `"${h.name}"`).join(', ')}. Consider whether to recommit or replace them.`);
    }

    if (partialHabits.length > 0) {
      recommendations.push(`For ${partialHabits.map(h => `"${h.name}"`).join(', ')}, try setting specific times each day to build a stronger routine.`);
    }

    if (completionRate < 50) {
      recommendations.push('Consider simplifying your habit load. Fewer habits done consistently beats many habits done sporadically.');
    } else if (completionRate >= 80) {
      recommendations.push('You\'re in a great groove! Challenge yourself with a new habit or increase targets on existing ones.');
    }

    if (bestWeek && worstWeek) {
      recommendations.push(`Review what made week ${bestWeek.week} successful and try to replicate that energy in every week.`);
    }

    recommendations.push('Reflect on which habits brought you the most value this month and double down on those.');

    const rating = this._getRating(completionRate);

    const summary = completionRate >= 80
      ? `An outstanding month! You maintained ${totalCheckins} check-ins with a ${completionRate}% completion rate. Your consistency is building real momentum.`
      : completionRate >= 50
        ? `A solid month with ${totalCheckins} total check-ins across ${active.length} habits. You're making progress — keep building!`
        : `This month was challenging with ${completionRate}% completion. Take what you learned and start fresh next month.`;

    return {
      title: 'Monthly Review',
      dateRange,
      summary,
      stats: {
        totalCheckins,
        completionRate,
        longestStreak: longestStreakThisMonth,
        bestDay: bestDayStr,
        worstDay: worstDayStr,
        bestWeek: bestWeek ? bestWeek.week : null,
        worstWeek: worstWeek ? worstWeek.week : null,
      },
      highlights,
      lowlights,
      trends,
      recommendations,
      rating: rating.rating,
      starRating: rating.stars,
    };
  },

  _getDayOfWeek(dateStr) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const d = new Date(dateStr + 'T00:00:00');
    return days[d.getDay()];
  },

  _getTimeOfDay(hour) {
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  },

  _formatDateRange(startDate, endDate) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const start = new Date(startDate + 'T00:00:00');
    const end = new Date(endDate + 'T00:00:00');
    return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  },

  _getRating(percent) {
    if (percent >= 90) return { rating: 'excellent', stars: 5 };
    if (percent >= 75) return { rating: 'great', stars: 4 };
    if (percent >= 50) return { rating: 'good', stars: 3 };
    if (percent >= 25) return { rating: 'fair', stars: 2 };
    return { rating: 'needs_improvement', stars: 1 };
  },

  _getTodayString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  _getDatesInRange(startDate, endDate) {
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

  _getDateRangeCheckins(entries, daysBack, offsetFromEnd) {
    const today = new Date(this._getTodayString() + 'T00:00:00');
    const endOffset = offsetFromEnd || 0;
    const cutoff = new Date(today);
    cutoff.setDate(cutoff.getDate() - endOffset);
    const start = new Date(cutoff);
    start.setDate(start.getDate() - daysBack + 1);

    const startStr = start.toISOString().slice(0, 10);
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    return entries
      .filter(e => e.date >= startStr && e.date <= cutoffStr)
      .reduce((sum, e) => sum + e.count, 0);
  },

  _computeTrend(current, previous) {
    if (previous === 0 && current === 0) return 'steady';
    if (previous === 0) return 'improving';
    const ratio = current / previous;
    if (ratio > 1.1) return 'improving';
    if (ratio < 0.9) return 'declining';
    return 'steady';
  },

  _formatDate(dateStr) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const parts = dateStr.split('-');
    return `${months[parseInt(parts[1], 10) - 1]} ${parseInt(parts[2], 10)}`;
  },
};

window.AICoach = AICoach;
