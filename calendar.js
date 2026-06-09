'use strict';

const Calendar = {
  container: null,

  MONTHS: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

  DAYS: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  init(containerId) {
    this.container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;
  },

  render(habits, year) {
    if (!this.container) return;

    this.container.textContent = '';
    this.container.className = 'heatmap';

    const frag = document.createDocumentFragment();
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-wrap:wrap;gap:16px;';

    for (let m = 0; m < 12; m++) {
      wrapper.appendChild(this._createMonth(habits, year, m));
    }

    frag.appendChild(wrapper);
    frag.appendChild(this._legend());
    this.container.appendChild(frag);
  },

  _createMonth(habits, year, monthIndex) {
    const block = document.createElement('div');
    block.className = 'heatmap-month';
    block.style.cssText = 'display:flex;flex-direction:column;gap:3px;';
    block.setAttribute('role', 'region');
    block.setAttribute('aria-label', `${this.MONTHS[monthIndex]} ${year}`);

    const label = document.createElement('div');
    label.className = 'heatmap-month-label';
    label.textContent = this.MONTHS[monthIndex];
    block.appendChild(label);

    const dayHeaders = document.createElement('div');
    dayHeaders.style.cssText = 'display:grid;grid-template-columns:repeat(7,14px);gap:2px;margin-bottom:1px;';
    for (let d = 0; d < 7; d++) {
      const el = document.createElement('div');
      el.className = 'heatmap-day-label';
      el.textContent = this.DAYS[d][0];
      el.style.textAlign = 'center';
      dayHeaders.appendChild(el);
    }
    block.appendChild(dayHeaders);

    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDay = new Date(year, monthIndex, 1).getDay();

    const totalSlots = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    const grid = document.createElement('div');
    grid.className = 'heatmap-grid';
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(7,14px);gap:2px;grid-template-rows:none;grid-auto-flow:row;';
    grid.setAttribute('role', 'grid');
    grid.setAttribute('aria-label', `Days in ${this.MONTHS[monthIndex]} ${year}`);

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'heatmap-cell-empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const count = this.getTotalCheckins(habits, dateStr);
      grid.appendChild(this.createDayCell(dateStr, count));
    }

    const remaining = totalSlots - firstDay - daysInMonth;
    for (let i = 0; i < remaining; i++) {
      const empty = document.createElement('div');
      empty.className = 'heatmap-cell-empty';
      grid.appendChild(empty);
    }

    block.appendChild(grid);
    return block;
  },

  getTotalCheckins(habits, dateStr) {
    if (!habits || !Array.isArray(habits)) return 0;
    let total = 0;
    for (let i = 0; i < habits.length; i++) {
      const h = habits[i];
      if (h.history && h.history[dateStr]) {
        total += h.history[dateStr].count || 0;
      }
    }
    return total;
  },

  createDayCell(dateStr, count) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    cell.style.backgroundColor = this.getIntensityColor(count);
    cell.dataset.date = dateStr;

    const parts = dateStr.split('-');
    const monthName = new Date(dateStr + 'T12:00:00').toLocaleString('en-US', { month: 'long' });
    const dayNum = parseInt(parts[2], 10);
    cell.title = `${monthName} ${dayNum}: ${count} ${count === 1 ? __('checkin.singular') : __('checkin.plural')}`;

    cell.setAttribute('role', 'gridcell');
    cell.setAttribute('aria-label', cell.title);
    cell.setAttribute('tabindex', '0');
    return cell;
  },

  getIntensityColor(count) {
    if (count === 0) return '#ebedf0';
    if (count <= 2) return '#d8f0d8';
    if (count <= 5) return '#a8e6cf';
    if (count <= 10) return '#6bc5a0';
    return '#4aad80';
  },

  getYearSummary(habits, year) {
    if (!habits || !Array.isArray(habits)) {
      return { totalCheckins: 0, bestStreak: 0, mostActiveMonth: 'N/A', totalActiveDays: 0, completionRate: 0 };
    }

    const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    const totalDays = isLeap ? 366 : 365;
    let totalCheckins = 0;
    let activeDays = 0;
    const monthCounts = new Array(12).fill(0);
    let currentStreak = 0;
    let bestStreak = 0;

    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const count = this.getTotalCheckins(habits, dateStr);
        if (count > 0) {
          totalCheckins += count;
          activeDays++;
          monthCounts[m] += count;
          currentStreak++;
          if (currentStreak > bestStreak) bestStreak = currentStreak;
        } else {
          currentStreak = 0;
        }
      }
    }

    let maxMonth = 0;
    let mostActiveIdx = 0;
    for (let m = 0; m < 12; m++) {
      if (monthCounts[m] > maxMonth) {
        maxMonth = monthCounts[m];
        mostActiveIdx = m;
      }
    }

    const completionRate = totalDays > 0 ? (activeDays / totalDays) * 100 : 0;

    return {
      totalCheckins,
      bestStreak,
      mostActiveMonth: this.MONTHS[mostActiveIdx],
      totalActiveDays: activeDays,
      completionRate: Math.round(completionRate * 10) / 10,
    };
  },

  _legend() {
    const legend = document.createElement('div');
    legend.style.cssText = 'display:flex;align-items:center;gap:4px;margin-top:12px;justify-content:flex-end;';

    const less = document.createElement('span');
    less.textContent = __('less');
    less.style.cssText = 'font-size:0.75rem;color:var(--text-muted,#b2bec3);margin-right:2px;';
    legend.appendChild(less);

    const levels = [0, 1, 3, 6, 11];
    for (const count of levels) {
      const swatch = document.createElement('span');
      swatch.style.cssText = 'display:inline-block;width:14px;height:14px;border-radius:3px;';
      swatch.style.backgroundColor = this.getIntensityColor(count);
      legend.appendChild(swatch);
    }

    const more = document.createElement('span');
    more.textContent = __('more');
    more.style.cssText = 'font-size:0.75rem;color:var(--text-muted,#b2bec3);margin-left:2px;';
    legend.appendChild(more);

    return legend;
  },
};

window.Calendar = Calendar;
