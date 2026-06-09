'use strict';

const Quotes = {
  quotes: {
    low: [
      { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
      { text: 'Every expert was once a beginner.', author: 'Unknown' },
      { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
      { text: 'Small daily improvements over time lead to stunning results.', author: 'Robin Sharma' },
      { text: "Don't watch the clock; do what it does. Keep going.", author: 'Sam Levenson' },
      { text: "You don't have to be extreme, just consistent.", author: 'Unknown' },
      { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
      { text: 'The best time to start was yesterday. The next best time is now.', author: 'Unknown' },
      { text: "Believe you can and you're halfway there.", author: 'Theodore Roosevelt' },
      { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    ],

    medium: [
      { text: "You're building momentum. Keep showing up!", author: 'Unknown' },
      { text: 'Discipline is choosing between what you want now and what you want most.', author: 'Abraham Lincoln' },
      { text: 'Motivation gets you started. Habit keeps you going.', author: 'Jim Ryun' },
      { text: 'The difference between try and triumph is a little umph.', author: 'Marvin Phillips' },
      { text: "Push yourself, because no one else is going to do it for you.", author: 'Unknown' },
      { text: 'You are stronger than you think. Keep going!', author: 'Unknown' },
      { text: 'Success is not final, failure is not fatal. It is the courage to continue that counts.', author: 'Winston Churchill' },
      { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
      { text: 'Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.', author: 'Christian D. Larson' },
      { text: 'Your habits shape your future. Every choice matters.', author: 'Unknown' },
    ],

    high: [
      { text: "You're on fire! Consistency is your superpower.", author: 'Unknown' },
      { text: 'Excellence is not a skill. It is an attitude.', author: 'Ralph Marston' },
      { text: 'The secret of your future is hidden in your daily routine.', author: 'Mike Murdock' },
      { text: 'Success is not an accident. It is a habit.', author: 'Unknown' },
      { text: "Your habits have become your lifestyle. That's powerful!", author: 'Unknown' },
      { text: "It's not about perfect. It's about effort.", author: 'Jillian Michaels' },
      { text: "Be proud of how far you've come. Keep that momentum!", author: 'Unknown' },
      { text: 'The chains of habit are too weak to be felt until they are too strong to be broken.', author: 'Samuel Johnson' },
      { text: 'First we make our habits, then our habits make us.', author: 'Charles C. Noble' },
      { text: 'You are what you repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle' },
    ],

    perfect: [
      { text: 'You are a habit machine! Absolutely unstoppable!', author: 'Unknown' },
      { text: 'Your dedication is an inspiration. Keep raising the bar!', author: 'Unknown' },
      { text: "Mastery is not about perfection. It's about never giving up.", author: 'Unknown' },
      { text: "You've turned your goals into routines. That's legendary.", author: 'Unknown' },
      { text: 'Winners are not people who never fail, but people who never quit.', author: 'Unknown' },
      { text: "Your future self is thanking you for today's discipline.", author: 'Unknown' },
      { text: 'Champions keep playing until they get it right.', author: 'Billie Jean King' },
      { text: 'The pain of discipline is nothing compared to the pain of regret.', author: 'Unknown' },
      { text: "You didn't come this far to only come this far.", author: 'Unknown' },
      { text: "Greatness is not born. It's built, day by day, brick by brick.", author: 'Unknown' },
    ],
  },

  categories: ['low', 'medium', 'high', 'perfect'],

  getPerformanceLevel() {
    const habits = Habits.getAll();
    const active = habits.filter(h => !h.archived);

    if (active.length === 0) return 'low';

    const maxStreak = active.reduce((max, h) => Math.max(max, h.currentStreak || 0), 0);

    const avgRate = active.reduce((sum, h) => sum + (h.completionRate || 0), 0) / active.length;

    if (maxStreak >= 30 && avgRate >= 90) return 'perfect';
    if (maxStreak >= 7 && avgRate >= 60) return 'high';
    if (maxStreak >= 3 && avgRate >= 30) return 'medium';
    return 'low';
  },

  getQuote() {
    const level = this.getPerformanceLevel();
    const levelQuotes = this.quotes[level];
    const quote = levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
    return { ...quote, level };
  },

  getQuoteByLevel(level) {
    const levelQuotes = this.quotes[level];
    if (!levelQuotes) return this.getQuote();
    return levelQuotes[Math.floor(Math.random() * levelQuotes.length)];
  },

  getQuoteOfTheDay() {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
    const level = this.getPerformanceLevel();
    const levelQuotes = this.quotes[level];
    const index = seed % levelQuotes.length;
    return { ...levelQuotes[index], level };
  },
};

window.Quotes = Quotes;
