'use strict';

const Chatbot = {
  _open: false,
  _firstOpen: true,
  _pendingDelete: null,
  _recognition: null,
  _isListening: false,

  init() {
    this.toggleBtn = document.getElementById('chatbot-toggle');
    this.window = document.getElementById('chatbot-window');
    this.closeBtn = document.getElementById('chatbot-close');
    this.messages = document.getElementById('chatbot-messages');
    this.input = document.getElementById('chatbot-input');
    this.sendBtn = document.getElementById('chatbot-send');
    this.suggestionsContainer = document.getElementById('chatbot-suggestions');
    this.voiceBtn = document.getElementById('chatbot-voice');

    if (!this.toggleBtn) return;

    this.toggleBtn.addEventListener('click', () => this.toggle());
    this.closeBtn.addEventListener('click', () => this.close());
    this.sendBtn.addEventListener('click', () => this.handleSend());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => this.toggleVoice());
    }
  },

  toggle() {
    if (this._open) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    this._open = true;
    this.window.classList.remove('hidden');
    if (this._firstOpen) {
      this._firstOpen = false;
      this.addBotMessage(__('chat.greeting'));
      this.showSuggestions();
    }
    setTimeout(() => this.input.focus(), 300);
  },

  close() {
    this._open = false;
    this.window.classList.add('hidden');
  },

  addBotMessage(text, speak) {
    const div = document.createElement('div');
    div.className = 'chat-message bot';
    div.textContent = text;
    this.messages.appendChild(div);
    this.scrollBottom();
    if (speak) this.speak(text);
  },

  addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-message user';
    div.textContent = text;
    this.messages.appendChild(div);
    this.scrollBottom();
  },

  addSystemMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-message system';
    div.textContent = text;
    this.messages.appendChild(div);
    this.scrollBottom();
  },

  scrollBottom() {
    this.messages.scrollTop = this.messages.scrollHeight;
  },

  showSuggestions(suggestions) {
    this.suggestionsContainer.innerHTML = '';
    const defaults = [
      __('chat.q.progress'),
      __('chat.q.tip'),
      __('chat.q.motivate'),
      __('chat.q.weekly'),
      __('chat.q.monthly'),
      __('chat.q.streak'),
    ];
    (suggestions || defaults).forEach(text => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-suggestion-btn';
      btn.textContent = text;
      btn.addEventListener('click', () => {
        this.addUserMessage(text);
        this.handleQuery(text);
        this.suggestionsContainer.innerHTML = '';
      });
      this.suggestionsContainer.appendChild(btn);
    });
  },

  handleSend() {
    const text = this.input.value.trim();
    if (!text) return;
    this.addUserMessage(text);
    this.input.value = '';
    this.suggestionsContainer.innerHTML = '';
    this.handleQuery(text);
  },

  handleQuery(query) {
    const q = query.toLowerCase();
    const isLoggedIn = Auth.isLoggedIn();
    const habits = isLoggedIn ? Habits.getAll().filter(h => !h.archived) : [];

    // Brief pause to simulate thinking
    setTimeout(() => {
      let reply = null;
      let createdHabit = false;

      if (this._isAddHabitQuery(q)) {
        if (!isLoggedIn) {
          reply = __('chat.add.habit.login');
        } else {
          const name = this._parseHabitName(query);
          if (name) {
            try {
              Habits.add({ name });
              UI.renderHabitList();
              UI.renderDashboard();
              reply = __('chat.add.habit', { name });
              createdHabit = true;
            } catch (e) {
              reply = __('chat.default');
            }
          } else {
            reply = __('chat.add.habit.prompt');
          }
        }
      } else if (this._isAlterQuery(q)) {
        if (!isLoggedIn) {
          reply = __('chat.alter.login');
        } else {
          reply = this._handleAlterQuery(query, q, habits);
        }
      } else if (q.includes('how am i') || q.includes('my progress') || q.includes('how do i')) {
        reply = this._getProgressReply(habits);
      } else if (q.includes('tip') || q.includes('advice') || q.includes('suggest')) {
        reply = this._getTipReply(habits);
      } else if (q.includes('motivate') || q.includes('inspire') || q.includes('quote')) {
        reply = this._getMotivationReply(habits);
      } else if (q.includes('weekly')) {
        reply = this._getWeeklyReply(habits);
      } else if (q.includes('monthly')) {
        reply = this._getMonthlyReply(habits);
      } else if (q.includes('streak') || q.includes('best')) {
        reply = this._getStreakReply(habits);
      } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        reply = this._getGreetingReply(habits);
      } else if (q.includes('help') || q.includes('what can you')) {
        reply = __('chat.help');
      } else {
        reply = this._getGenericReply(habits, q);
      }

      this.addBotMessage(reply, true);
      if (!createdHabit) this.showSuggestions();
    }, 500);
  },

  _isAddHabitQuery(q) {
    const patterns = [
      'add habit', 'create habit', 'new habit', 'track',
      'start habit', 'add a habit', 'create a habit',
      'i want to', "i'd like to", 'add new habit',
    ];
    return patterns.some(p => q.includes(p));
  },

  _parseHabitName(text) {
    const q = text.toLowerCase();
    let name = '';

    const patterns = [
      /(?:add|create|start|track)\s+(?:a\s+|the\s+|new\s+)?habit\s+(?:to\s+|for\s+|called\s+)?['"]?(.+?)['"]?\s*$/i,
      /(?:add|create|start|track)\s+(?:a\s+|the\s+|new\s+)?habit\s+(?:called\s+|named\s+)?['"]?(.+?)['"]?\s*$/i,
      /(?:i want to|i'd like to|let me|i will)\s+(.+)/i,
      /track\s+(?:my\s+)?(.+)/i,
      /add\s+(?:a\s+|the\s+)?(.+?)(?:\s+habit)?\s*$/i,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        name = match[1].trim();
        break;
      }
    }

    if (!name) {
      const words = text.split(/[,;:]/).pop().trim();
      const stopwords = ['add', 'create', 'start', 'track', 'new', 'a', 'the', 'habit', 'to', 'for', 'i want', "i'd like", 'let me', 'i will', 'please'];
      const parts = words.split(/\s+/).filter(w => !stopwords.includes(w.toLowerCase()));
      if (parts.length >= 1 && parts.length <= 6) {
        name = parts.join(' ');
      }
    }

    name = name.replace(/[.,!?]+$/, '').trim();
    return name.length >= 2 ? name.charAt(0).toUpperCase() + name.slice(1) : null;
  },

  _isAlterQuery(q) {
    if (this._pendingDelete) return true;
    const patterns = ['rename', 'change', 'delete', 'remove', 'set target', 'edit habit'];
    return patterns.some(p => q.includes(p));
  },

  _findHabit(habits, name) {
    const q = name.toLowerCase();
    return habits.find(h => h.name.toLowerCase() === q)
      || habits.find(h => h.name.toLowerCase().includes(q))
      || habits.find(h => q.includes(h.name.toLowerCase()));
  },

  _handleAlterQuery(query, q, habits) {
    if (this._pendingDelete) {
      const confirm = q.includes('yes') || q.includes('yeah') || q.includes('yep') || q.includes('confirm') || q.includes('han') || q.includes('haha') || q.includes('haan');
      if (confirm) {
        try {
          Habits.delete(this._pendingDelete);
          UI.renderHabitList();
          UI.renderDashboard();
          const name = habits.find(h => h.id === this._pendingDelete)?.name || '';
          this._pendingDelete = null;
          return __('chat.delete.ok', { name });
        } catch (e) {
          this._pendingDelete = null;
          return __('chat.default');
        }
      } else {
        this._pendingDelete = null;
        return __('chat.alter.prompt');
      }
    }

    if (q.includes('rename') || q.includes('change') && (q.includes('to') || q.includes('name'))) {
      const renameMatch = query.match(/rename\s+(.+?)\s+to\s+(.+)/i)
        || query.match(/change\s+(.+?)\s+(?:name\s+)?to\s+(.+)/i);
      if (renameMatch) {
        const habit = this._findHabit(habits, renameMatch[1]);
        if (!habit) return __('chat.alter.notfound', { name: renameMatch[1].trim() });
        const newName = renameMatch[2].trim().replace(/[.,!?]+$/, '');
        if (newName.length < 2) return __('chat.alter.prompt');
        Habits.update(habit.id, { name: newName });
        UI.renderHabitList();
        UI.renderDashboard();
        return __('chat.rename.ok', { old: habit.name, new: newName });
      }
    }

    if (q.includes('target') || q.includes('count')) {
      const targetMatch = query.match(/(?:change|set|update)\s+(.+?)\s+(?:target|count)\s+(?:to\s+)?(\d+)/i);
      if (targetMatch) {
        const habit = this._findHabit(habits, targetMatch[1]);
        if (!habit) return __('chat.alter.notfound', { name: targetMatch[1].trim() });
        const count = parseInt(targetMatch[2], 10);
        if (count < 1) return __('chat.alter.prompt');
        Habits.update(habit.id, { targetCount: count });
        UI.renderHabitList();
        UI.renderDashboard();
        return __('chat.target.ok', { name: habit.name, count, freq: habit.frequency });
      }
    }

    if (q.includes('delete') || q.includes('remove')) {
      const deleteMatch = query.match(/(?:delete|remove)\s+(?:the\s+|habit\s+)?['"]?(.+?)['"]?(?:\s+habit)?\s*$/i);
      if (deleteMatch) {
        const habit = this._findHabit(habits, deleteMatch[1]);
        if (!habit) return __('chat.alter.notfound', { name: deleteMatch[1].trim() });
        this._pendingDelete = habit.id;
        return __('chat.delete.confirm', { name: habit.name });
      }
    }

    if (q.includes('change') || q.includes('make')) {
      const freqMatch = query.match(/(?:change|make)\s+(.+?)\s+(?:to\s+)?(daily|weekly)/i);
      if (freqMatch) {
        const habit = this._findHabit(habits, freqMatch[1]);
        if (!habit) return __('chat.alter.notfound', { name: freqMatch[1].trim() });
        const freq = freqMatch[2].toLowerCase();
        Habits.update(habit.id, { frequency: freq });
        UI.renderHabitList();
        UI.renderDashboard();
        return __('chat.freq.ok', { name: habit.name, freq: freq === 'daily' ? 'daily' : 'weekly' });
      }
    }

    return __('chat.alter.prompt');
  },

  _getProgressReply(habits) {
    if (!habits || habits.length === 0) return __('chat.no.habits');
    const today = Habits.getTodayString();
    const completed = habits.filter(h => Habits.getCheckInCount(h, today) >= h.targetCount).length;
    const total = habits.length;
    const allCheckins = habits.reduce((s, h) => s + (h.totalCheckins || 0), 0);
    const avgRate = habits.length ? Math.round(habits.reduce((s, h) => s + (h.completionRate || 0), 0) / habits.length) : 0;
    return __('chat.progress', {completed, total, checkins: allCheckins, rate: avgRate, streak: Math.max(...habits.map(h => h.longestStreak || 0))});
  },

  _getTipReply(habits) {
    if (!habits || habits.length === 0) return __('chat.tip.empty');
    const patterns = AICoach.analyzePatterns(habits);
    const suggestions = AICoach.getSuggestions(habits, patterns);
    if (suggestions.length === 0) return __('chat.tip.none');
    const s = suggestions[0];
    return `\uD83D\uDCA1 ${s.title}\n${s.description}`;
  },

  _getMotivationReply(habits) {
    const quote = AICoach.getQuote(habits) || Quotes.getQuoteOfTheDay();
    if (!quote) return __('chat.motivate.empty');
    return `\u201C${quote.text}\u201D\n\u2014 ${quote.author}`;
  },

  _getWeeklyReply(habits) {
    if (!habits || habits.length === 0) return __('chat.weekly.empty');
    const report = AICoach.generateWeeklyReview(habits);
    const stars = '\u2B50'.repeat(report.starRating);
    return `${report.title}\n${report.dateRange}\n${stars} (${report.rating})\n\n${report.summary}\n\n${__('chat.highlights')}:\n${report.highlights.map(h => '\u2022 ' + h).join('\n')}\n\n${__('chat.tips')}:\n${report.recommendations.map(r => '\u2022 ' + r).join('\n')}`;
  },

  _getMonthlyReply(habits) {
    if (!habits || habits.length === 0) return __('chat.monthly.empty');
    const report = AICoach.generateMonthlyReview(habits);
    const stars = '\u2B50'.repeat(report.starRating);
    return `${report.title}\n${report.dateRange}\n${stars} (${report.rating})\n\n${report.summary}\n\n${__('chat.highlights')}:\n${report.highlights.map(h => '\u2022 ' + h).join('\n')}\n\n${__('chat.tips')}:\n${report.recommendations.map(r => '\u2022 ' + r).join('\n')}`;
  },

  _getStreakReply(habits) {
    if (!habits || habits.length === 0) return __('chat.streak.empty');
    const best = Math.max(...habits.map(h => h.longestStreak || 0));
    const current = Math.max(...habits.map(h => h.currentStreak || 0));
    const bestHabit = habits.find(h => h.longestStreak === best);
    return __('chat.streak', {best, name: bestHabit ? bestHabit.name : '-', current});
  },

  _getGreetingReply(habits) {
    if (!habits || habits.length === 0) return __('chat.greeting.empty');
    const pending = Habits.getPendingHabits();
    if (pending.length > 0) {
      return pending.length === 1 ? __('chat.greeting.pending.one') : __('chat.greeting.pending.many', {n: pending.length});
    }
    return __('chat.greeting.done');
  },

  _getGenericReply(habits, query) {
    if (query.includes('thank')) return __('chat.thanks');
    if (query.includes('good') || query.includes('fine') || query.includes('great')) {
      if (habits.length === 0) return __('chat.feeling.good.empty');
      const pending = Habits.getPendingHabits();
      if (pending.length === 0) return __('chat.feeling.good.done');
      return __('chat.feeling.good.pending');
    }
    if (query.includes('water') || query.includes('drink')) return __('chat.water');
    if (query.includes('sleep') || query.includes('bed')) return __('chat.sleep');
    if (query.includes('exercise') || query.includes('workout') || query.includes('gym')) return __('chat.exercise');
    if (query.includes('read') || query.includes('book')) return __('chat.reading');
    return __('chat.default');
  },

  // --- Voice Assistant ---

  getVoiceLang() {
    const lang = getLanguage();
    return lang === 'hi' ? 'hi-IN' : 'en-US';
  },

  speak(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[^\w\s\u0900-\u097F.,!?'"()-]/g, ''));
    utterance.lang = this.getVoiceLang();
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const lang = getLanguage();
    const voice = voices.find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en'));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  },

  toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.addSystemMessage('Voice input not supported in this browser. Try Chrome.');
      return;
    }

    if (this._isListening) {
      this._stopListening();
      return;
    }

    this._recognition = new SpeechRecognition();
    this._recognition.lang = this.getVoiceLang();
    this._recognition.continuous = false;
    this._recognition.interimResults = false;

    this._recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      this._stopListening();
      this.input.value = transcript;
      this.handleSend();
    };

    this._recognition.onerror = () => {
      this._stopListening();
      this.addSystemMessage('Voice input failed. Try again.');
    };

    this._recognition.onend = () => {
      this._stopListening();
    };

    try {
      this._recognition.start();
      this._isListening = true;
      if (this.voiceBtn) {
        this.voiceBtn.classList.add('listening');
        this.voiceBtn.title = 'Listening...';
      }
    } catch (e) {
      this._stopListening();
    }
  },

  _stopListening() {
    this._isListening = false;
    if (this.voiceBtn) {
      this.voiceBtn.classList.remove('listening');
      this.voiceBtn.title = 'Voice input';
    }
  },
};

window.Chatbot = Chatbot;
