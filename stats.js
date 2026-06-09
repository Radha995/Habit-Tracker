'use strict';

const Stats = {
  getMonday(d) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  },

  formatDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  },

  getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  },

  getWeeklyStats(habit) {
    const today = new Date();
    const monday = this.getMonday(today);
    const target = habit.targetCount || 1;
    const history = habit.history || {};
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const days = [];
    let totalCompleted = 0;

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = this.formatDateStr(date);
      const entry = history[dateStr];
      const count = entry ? entry.count : 0;
      const completed = count >= target;
      days.push({ date: dateStr, dayName: dayNames[i], count, completed });
      totalCompleted += count;
    }

    const totalTarget = target * 7;
    const completionRate = totalTarget > 0
      ? Math.min(100, (totalCompleted / totalTarget) * 100)
      : 0;

    let bestDay = null;
    let worstDay = null;
    for (const d of days) {
      if (!bestDay || d.count > bestDay.count) {
        bestDay = { dayName: d.dayName, count: d.count };
      }
      if (!worstDay || d.count < worstDay.count) {
        worstDay = { dayName: d.dayName, count: d.count };
      }
    }

    return { days, totalTarget, totalCompleted, completionRate, bestDay, worstDay };
  },

  getMonthlyStats(habit) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const daysInMonth = this.getDaysInMonth(year, month);
    const target = habit.targetCount || 1;
    const history = habit.history || {};
    const days = [];
    let totalCompleted = 0;

    for (let dayOfMonth = 1; dayOfMonth <= daysInMonth; dayOfMonth++) {
      const date = new Date(year, month - 1, dayOfMonth);
      const dateStr = this.formatDateStr(date);
      const entry = history[dateStr];
      const count = entry ? entry.count : 0;
      const completed = count >= target;
      days.push({ date: dateStr, dayOfMonth, count, completed });
      totalCompleted += count;
    }

    const totalTarget = target * daysInMonth;
    const completionRate = totalTarget > 0
      ? Math.min(100, (totalCompleted / totalTarget) * 100)
      : 0;

    const weekBuckets = {};
    for (const d of days) {
      const weekNum = Math.ceil(d.dayOfMonth / 7);
      if (!weekBuckets[weekNum]) {
        weekBuckets[weekNum] = { days: 0, completed: 0 };
      }
      weekBuckets[weekNum].days++;
      if (d.completed) weekBuckets[weekNum].completed++;
    }

    const weeks = Object.entries(weekBuckets).map(([num, data]) => ({
      week: Number(num),
      rate: data.days > 0 ? (data.completed / data.days) * 100 : 0,
    }));

    let bestWeek = null;
    for (const w of weeks) {
      if (!bestWeek || w.rate > (bestWeek.rate || 0)) {
        bestWeek = w;
      }
    }

    return {
      days,
      totalTarget,
      totalCompleted,
      completionRate,
      weeks,
      bestWeek: bestWeek ? bestWeek.week : null,
    };
  },

  getOverallStats(habit) {
    const history = habit.history || {};
    const dates = Object.keys(history).filter(d => history[d].count > 0);
    const target = habit.targetCount || 1;

    let totalCheckins = 0;
    for (const d of Object.keys(history)) {
      totalCheckins += (history[d].count || 0);
    }

    const createdDate = habit.createdAt ? new Date(habit.createdAt) : new Date();
    const now = new Date();
    const daysSinceCreation = Math.max(
      1,
      Math.round((now.getTime() - createdDate.getTime()) / 86400000)
    );

    let daysTargetMet = 0;
    for (let i = 0; i < daysSinceCreation; i++) {
      const d = new Date(createdDate);
      d.setDate(createdDate.getDate() + i);
      const dateStr = this.formatDateStr(d);
      if (history[dateStr] && history[dateStr].count >= target) {
        daysTargetMet++;
      }
    }
    const completionRate = Math.min(100, (daysTargetMet / daysSinceCreation) * 100);

    const sorted = [...dates].sort();
    const chronological = sorted;
    const todayStr = this.formatDateStr(now);

    const isTodayChecked = dates.indexOf(todayStr) !== -1;
    let currentStreak = 0;

    if (isTodayChecked) {
      currentStreak = 1;
      for (let i = 1; i < chronological.length; i++) {
        const prevDate = new Date(now);
        prevDate.setDate(now.getDate() - i);
        const prevStr = this.formatDateStr(prevDate);
        if (dates.indexOf(prevStr) !== -1) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = this.formatDateStr(yesterday);
      if (dates.indexOf(yesterdayStr) !== -1) {
        currentStreak = 1;
        for (let i = 1; i < chronological.length; i++) {
          const prevDate = new Date(yesterday);
          prevDate.setDate(yesterday.getDate() - i);
          const prevStr = this.formatDateStr(prevDate);
          if (dates.indexOf(prevStr) !== -1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    let longestStreak = 0;
    let bestStreak = { start: null, end: null, length: 0 };
    let runStart = null;
    let runLength = 0;

    for (let i = 0; i < chronological.length; i++) {
      if (i === 0) {
        runStart = chronological[i];
        runLength = 1;
      } else {
        const curr = new Date(chronological[i] + 'T00:00:00');
        const prev = new Date(chronological[i - 1] + 'T00:00:00');
        const diff = (curr - prev) / 86400000;
        if (diff <= 1) {
          runLength++;
        } else {
          if (runLength > longestStreak) {
            longestStreak = runLength;
            bestStreak = { start: runStart, end: chronological[i - 1], length: runLength };
          }
          runStart = chronological[i];
          runLength = 1;
        }
      }
    }

    if (runLength > longestStreak) {
      longestStreak = runLength;
      bestStreak = { start: runStart, end: chronological[chronological.length - 1], length: runLength };
    }
    if (longestStreak === 0 && chronological.length > 0) {
      longestStreak = 1;
      bestStreak = { start: chronological[0], end: chronological[0], length: 1 };
    }

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthlyAverages = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const daysInM = this.getDaysInMonth(y, m);
      let completedDays = 0;
      for (let day = 1; day <= daysInM; day++) {
        const date = new Date(y, m - 1, day);
        const dateStr = this.formatDateStr(date);
        if (history[dateStr] && history[dateStr].count >= target) {
          completedDays++;
        }
      }
      const rate = daysInM > 0 ? (completedDays / daysInM) * 100 : 0;
      monthlyAverages.push({ month: monthNames[m - 1], rate });
    }

    return {
      totalCheckins,
      currentStreak,
      longestStreak,
      daysSinceCreation,
      completionRate,
      bestStreak,
      monthlyAverages,
    };
  },

  getWeekComparison(habit) {
    const currentWeekly = this.getWeeklyStats(habit);
    const today = new Date();
    const prevMonday = this.getMonday(today);
    prevMonday.setDate(prevMonday.getDate() - 7);

    const target = habit.targetCount || 1;
    const history = habit.history || {};
    let prevTotal = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(prevMonday);
      date.setDate(prevMonday.getDate() + i);
      const dateStr = this.formatDateStr(date);
      const entry = history[dateStr];
      prevTotal += entry ? entry.count : 0;
    }

    const prevRate = target * 7 > 0 ? Math.min(100, (prevTotal / (target * 7)) * 100) : 0;
    const change = currentWeekly.completionRate - prevRate;

    return {
      currentRate: currentWeekly.completionRate,
      previousRate: prevRate,
      change,
      improved: change >= 0,
    };
  },

  getMonthlyTrend(habit) {
    const history = habit.history || {};
    const target = habit.targetCount || 1;
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const trend = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const daysInM = this.getDaysInMonth(y, m);
      let completedDays = 0;
      for (let day = 1; day <= daysInM; day++) {
        const date = new Date(y, m - 1, day);
        const dateStr = this.formatDateStr(date);
        if (history[dateStr] && history[dateStr].count >= target) {
          completedDays++;
        }
      }
      const rate = daysInM > 0 ? (completedDays / daysInM) * 100 : 0;
      trend.push({ month: monthNames[m - 1], rate });
    }

    return trend;
  },

  // --- CHARTS ---

  _hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      };
    }
    return { r: 108, g: 92, b: 231 };
  },

  _setupCanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, W, H };
  },

  _drawNoData(ctx, W, H) {
    ctx.fillStyle = '#999';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No data', W / 2, H / 2);
  },

  drawWeeklyChart(canvas, weeklyStats, color) {
    if (!canvas) return;

    const { ctx, W, H } = this._setupCanvas(canvas);
    ctx.clearRect(0, 0, W, H);

    if (!weeklyStats || !weeklyStats.days || weeklyStats.days.length === 0) {
      this._drawNoData(ctx, W, H);
      return;
    }

    const { days, totalTarget } = weeklyStats;
    const padding = { top: 12, bottom: 22, left: 10, right: 10 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    if (chartW <= 0 || chartH <= 0) return;

    const barCount = days.length;
    const gap = 4;
    const barWidth = Math.max(1, (chartW - gap * (barCount - 1)) / barCount);
    const maxVal = Math.max(...days.map(d => d.count), totalTarget || 1, 1);

    const rgb = this._hexToRgb(color || '#7c6ed6');

    if (totalTarget > 0) {
      const targetY = padding.top + chartH - (totalTarget / maxVal) * chartH;
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 1;
      ctx.moveTo(padding.left, targetY);
      ctx.lineTo(W - padding.right, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.font = '9px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('target', padding.left + 2, targetY - 2);
    }

    for (let i = 0; i < barCount; i++) {
      const d = days[i];
      const barH = (d.count / maxVal) * chartH;
      const x = padding.left + i * (barWidth + gap);
      const y = padding.top + chartH - barH;

      ctx.fillStyle = d.completed
        ? `rgb(${rgb.r},${rgb.g},${rgb.b})`
        : `rgba(${rgb.r},${rgb.g},${rgb.b},0.35)`;

      const radius = Math.min(3, barWidth / 2, barH / 2);
      if (barH > 0) {
        ctx.beginPath();
        ctx.moveTo(x, padding.top + chartH);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.closePath();
        ctx.fill();
      }

      if (d.count > 0) {
        ctx.fillStyle = '#555';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(String(d.count), x + barWidth / 2, y - 2);
      }

      ctx.fillStyle = '#888';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(d.dayName, x + barWidth / 2, padding.top + chartH + 2);
    }
  },

  drawMonthlyChart(canvas, monthlyTrend, color) {
    if (!canvas) return;

    const { ctx, W, H } = this._setupCanvas(canvas);
    ctx.clearRect(0, 0, W, H);

    if (!monthlyTrend || monthlyTrend.length === 0) {
      this._drawNoData(ctx, W, H);
      return;
    }

    const padding = { top: 15, bottom: 22, left: 35, right: 15 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    if (chartW <= 0 || chartH <= 0) return;

    const rgb = this._hexToRgb(color || '#7c6ed6');
    const n = monthlyTrend.length;
    const maxRate = 100;
    const minRate = 0;

    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let pct = 0; pct <= 100; pct += 25) {
      const y = padding.top + chartH - (pct / maxRate) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#aaa';
      ctx.fillText(pct + '%', padding.left - 4, y);
    }

    const points = monthlyTrend.map((item, i) => {
      const x = padding.left + (n > 1 ? (i / (n - 1)) * chartW : chartW / 2);
      const rate = Math.max(minRate, Math.min(maxRate, item.rate));
      const y = padding.top + chartH - (rate / maxRate) * chartH;
      return { x, y, month: item.month, rate: item.rate };
    });

    if (n > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, padding.top + chartH);
      for (let i = 0; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
      gradient.addColorStop(0, `rgba(${rgb.r},${rgb.g},${rgb.b},0.25)`);
      gradient.addColorStop(1, `rgba(${rgb.r},${rgb.g},${rgb.b},0.02)`);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      for (const p of points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    ctx.fillStyle = '#888';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const p of points) {
      ctx.fillText(p.month, p.x, padding.top + chartH + 2);
    }
  },

  drawCompletionRing(canvas, rate, color, size, label) {
    if (!canvas) return;

    const { ctx, W, H } = this._setupCanvas(canvas);
    ctx.clearRect(0, 0, W, H);

    const rgb = this._hexToRgb(color || '#7c6ed6');
    const ringSize = size || Math.min(W, H);
    const cx = W / 2;
    const cy = H / 2;
    const radius = Math.max(10, ringSize * 0.35);
    const lineWidth = Math.max(4, ringSize * 0.1);

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    const clampedRate = Math.max(0, Math.min(100, rate || 0));
    if (clampedRate > 0) {
      const endAngle = (clampedRate / 100) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    ctx.fillStyle = '#333';
    ctx.font = `bold ${Math.max(10, ringSize * 0.18)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(clampedRate) + '%', cx, cy - (label ? 8 : 0));

    if (label) {
      ctx.fillStyle = '#999';
      ctx.font = `${Math.max(8, ringSize * 0.08)}px sans-serif`;
      ctx.textBaseline = 'top';
      ctx.fillText(label, cx, cy + 6);
    }
  },
};

window.Stats = Stats;
