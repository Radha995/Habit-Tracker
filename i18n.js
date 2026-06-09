'use strict';

const LANGUAGES = {
  en: { label: 'EN', name: 'English' },
  hi: { label: 'HI', name: 'हिन्दी' },
};

const TRANSLATIONS = {
  en: {
    'app.name': 'Habit Tracker',
    'app.tagline': 'Build better habits, one day at a time',
    'app.tagline.short': 'Build better habits',

    // Header
    'notifications.on': 'Notifications ON',
    'notifications.off': 'Notifications OFF',
    'logout': 'Logout',
    'add.habit': '+ Add Habit',
    'settings': 'Settings',
    'badges': 'Badges',
    'toggle.theme': 'Toggle Theme',

    // Sidebar
    'home': 'Home',
    'analytics': 'Analytics',
    'categories': 'Categories',
    'fitness': 'Fitness',
    'study': 'Study',
    'health': 'Health',
    'mindfulness': 'Mindfulness',
    'finance': 'Finance',

    // Time pills
    'all': 'All',
    'today': 'Today',
    'weekly': 'Weekly',
    'monthly': 'Monthly',

    // Dashboard stats
    'stat.total': 'Total Habits',
    'stat.today': "Today's Check-ins",
    'stat.streak': 'Best Streak',
    'stat.completion': 'Avg Completion',
    'stat.checkins': 'Total Check-ins',
    'stat.badges': 'Badges Earned',

    // Habit card
    'day.streak': '{n} day streak',
    'days.streak': '{n} days streak',

    // Empty states
    'empty.title': 'Start building your first habit today!',
    'empty.text': '"Small daily actions create big results."',
    'empty.btn': '+ Create Your First Habit',
    'empty.home.no.habits': 'No habits found in this view.',
    'empty.today.all.done': 'All done for today! Great job!',
    'empty.category': 'No {cat} habits yet.',
    'empty.create.hint': 'Create a habit with a {cat} icon to see it here.',
    'empty.category.title': 'No {cat} habits yet.',

    // Add habit page button
    'add.new.habit': '+ Add New Habit',

    // Habit form
    'new.habit': 'New Habit',
    'edit.habit': 'Edit Habit',
    'habit.name': 'Name',
    'habit.name.placeholder': 'e.g. Read 30 minutes',
    'habit.icon': 'Icon',
    'habit.desc': 'Description',
    'habit.desc.placeholder': 'Optional description',
    'habit.frequency': 'Frequency',
    'habit.target': 'Target Count',
    'habit.daily': 'Daily',
    'habit.weekly': 'Weekly',
    'habit.color': 'Color',
    'habit.reminder': 'Reminder Time',
    'habit.set.reminder': 'Set reminder time',
    'cancel': 'Cancel',
    'save': 'Save',

    // Detail modal
    'current.streak': 'Current Streak',
    'longest.streak': 'Longest Streak',
    'total.checkins': 'Total Check-ins',
    'edit': 'Edit',
    'delete': 'Delete',
    'close': 'Close',
    'detail.delete.confirm': 'Delete this habit? This cannot be undone.',
    'habit.deleted': 'Habit deleted',

    // Toast messages
    'habit.created': 'Habit created!',
    'habit.updated': 'Habit updated!',
    'checked.in': 'Great job! Keep it up! 🔥',
    'checked.in.plus': 'Check-in +1!',
    'checkin.removed': 'Check-in removed',
    'notifications.enabled': 'Notifications enabled',
    'notifications.disabled': 'Notifications disabled',
    'notifications.denied': 'Notification permission denied. Enable in browser settings.',
    'schedule.saved': 'Schedule saved',
    'data.cleared': 'All data cleared',
    'logged.out': 'Logged out successfully',
    'welcome': 'Welcome, {name}!',

    // Settings
    'settings.title': 'Settings',
    'account': 'Account',
    'username': 'Username',
    'email': 'Email',
    'appearance': 'Appearance',
    'dark.mode': 'Dark Mode',
    'daily.schedule': 'Daily Schedule',
    'wake.time': 'Wake Up Time',
    'sleep.time': 'Sleep Time',
    'schedule.hint': 'Incomplete habits will be reminded hourly during waking hours, and all remaining habits will be notified before sleep time.',
    'save.schedule': 'Save Schedule',
    'notifications': 'Notifications',
    'daily.reminders': 'Daily Reminders',
    'reminders.hint': 'Get hourly reminders for incomplete habits during waking hours',
    'analytics.short': 'Analytics',
    'view.statistics': 'View Statistics',
    'view.calendar': 'View Calendar Heatmap',
    'data': 'Data',
    'clear.all.data': 'Clear All Data',
    'clear.confirm': 'Are you sure you want to delete ALL your data? This cannot be undone.',
    'language': 'Language',

    // AI Coach
    'ai.coach': 'AI Habit Coach',
    'overview': 'Overview',
    'weekly.review': 'Weekly Review',
    'monthly.review': 'Monthly Review',
    'insights': 'Insights',
    'suggestions': 'Suggestions',
    'coach.message': "Coach's Message",
    'coach.no.data': 'Not enough data for a weekly review.',
    'coach.no.data.monthly': 'Not enough data for a monthly review.',
    'coach.empty': 'Create a habit first to get AI coaching!',

    // Analytics
    'analytics.dashboard': 'Analytics Dashboard',
    'analytics.subtitle': 'Your progress at a glance',
    'statistics': 'Statistics',
    'calendar.heatmap': 'Calendar Heatmap',
    'this.week': 'This Week',
    'this.month': 'This Month',
    'overall': 'Overall',
    'best.day': 'Best Day',
    'completion.rate': 'Completion Rate',
    'analytics.empty': 'Create some habits to see analytics.',
    'calendar.empty': 'Create some habits to see your calendar heatmap.',

    // Calendar
    'prev.year': '← Prev Year',
    'next.year': 'Next Year →',
    'less': 'Less',
    'more': 'More',
    'activity.calendar': 'Activity Calendar',

    // Chatbot
    'ai.assistant': 'AI Habit Assistant',
    'ask.anything': 'Ask me anything...',

    // Landing
    'get.started': 'Get Started Free',
    'learn.more': 'Learn More',
    'hero.title': 'Build Habits That ',
    'hero.title.stick': 'Stick',
    'hero.subtitle': 'Track, measure, and improve your daily habits with intelligent insights, gamification, and personalized coaching.',
    'hero.badges': 'Achievement Badges',
    'hero.quotes': 'Motivational Quotes',
    'hero.smart.coach': 'Smart Coach',
    'features.title': 'Everything You Need to',
    'features.title.highlight': 'Succeed',
    'features.subtitle': 'Powerful tools to help you build and maintain life-changing habits',
    'feature.checkins': 'Daily Check-ins',
    'feature.checkins.desc': 'One-tap check-ins make it effortless to track your habits every day. Build momentum with consistency.',
    'feature.analytics': 'Smart Analytics',
    'feature.analytics.desc': 'Visual progress charts, weekly and monthly reports, and detailed statistics to measure your growth.',
    'feature.coach': 'AI Habit Coach',
    'feature.coach.desc': 'Personalized insights, smart suggestions, and adaptive motivation based on your unique patterns.',
    'feature.gamification': 'Gamification',
    'feature.gamification.desc': 'Earn badges, build streaks, and challenge yourself with achievement milestones along your journey.',
    'feature.calendar': 'Calendar Heatmap',
    'feature.calendar.desc': 'Visualize your consistency with a GitHub-style activity heatmap showing your daily progress.',
    'feature.theme': 'Dark & Light Mode',
    'feature.theme.desc': 'Choose your preferred theme with smooth transitions between dark and light interfaces.',
    'start.journey': 'Start Your',
    'start.journey.highlight': 'Journey',
    'start.journey.subtitle': 'Create an account or log in to begin tracking your habits',
    'login': 'Login',
    'signup': 'Sign Up',
    'email.or.username': 'Email or Username',
    'password': 'Password',
    'confirm.password': 'Confirm Password',
    'create.account': 'Create Account',
    'login.error': 'Please fill in all fields',
    'signup.error': 'Please fill in all required fields',
    'password.mismatch': 'Passwords do not match',
    'auth.hint.login': "Don't have an account? Sign up",
    'auth.hint.signup': 'Already have an account? Log in',
    'footer.tagline': 'Build better habits, one day at a time.',
    'footer.copyright': '© 2026 Habit Tracker. All rights reserved.',
    'habit.name.required': 'Please enter a habit name',
    'streak': 'streak',
    'add.habit.header': '+ Add Habit',

    // Notification keys
    'needs.checkin': "don't forget to check in",
    'pending': 'Pending',
    'habits.need.checkin': 'habits need check-in today',
    'time.for': 'Time for',
    'wind.down': 'Wind Down Reminder',
    'habit.needs.checkin': 'habit still needs check-in before sleep',
    'notifications.working': 'Notifications are working!',
    'checkin.singular': 'check-in',
    'checkin.plural': 'check-ins',

    // Chatbot
    'chat.greeting': "Hello! I'm your AI Habit Assistant. How can I help you today?",
    'chat.q.progress': 'How am I doing?',
    'chat.q.tip': 'Give me a tip',
    'chat.q.motivate': 'Motivate me!',
    'chat.q.weekly': 'Weekly summary',
    'chat.q.monthly': 'Monthly summary',
    'chat.q.streak': 'My best streak',
    'chat.help': 'I can help you track your habits! Try asking:\n\u2022 "How am I doing?"\n\u2022 "Give me a tip"\n\u2022 "Motivate me!"\n\u2022 "Weekly summary"\n\u2022 "My best streak"',
    'chat.no.habits': "You haven't created any habits yet. Start by tapping the + button to add your first habit!",
    'chat.progress': "Here's your progress:\n\u2022 {completed}/{total} habits done today\n\u2022 {checkins} total check-ins\n\u2022 {rate}% average completion rate\n\u2022 Best streak: {streak} days\nKeep going! \uD83D\uDD25",
    'chat.tip.empty': 'Start with one small habit and build from there. Consistency beats intensity!',
    'chat.tip.none': "You're doing great! Keep up the consistent work.",
    'chat.motivate.empty': "You've got this! Every small step counts toward building a better you. \uD83D\uDCAA",
    'chat.weekly.empty': 'Not enough data for a weekly review. Create some habits first!',
    'chat.monthly.empty': 'Not enough data for a monthly review. Create some habits first!',
    'chat.highlights': 'Highlights',
    'chat.tips': 'Tips',
    'chat.streak.empty': 'No streaks yet. Start a habit to begin your streak!',
    'chat.streak': '\uD83D\uDD25 Your longest streak: {best} days ({name})\n\uD83D\uDD25 Current best: {current} days\nKeep the momentum going!',
    'chat.greeting.empty': 'Welcome! Ready to build better habits? Tap + to get started!',
    'chat.greeting.pending.one': 'Hey there! You have 1 habit pending today. Need a tip or motivation to get going?',
    'chat.greeting.pending.many': 'Hey there! You have {n} habits pending today. Need a tip or motivation to get going?',
    'chat.greeting.done': "Great job! Looks like all your habits are checked off for today. You're killing it! \uD83D\uDCAA",
    'chat.thanks': "You're welcome! Keep up the great work! \uD83D\uDE0A",
    'chat.feeling.good.empty': 'Awesome! Want to add a new habit?',
    'chat.feeling.good.done': 'Glad to hear! All habits done today \u2014 time to relax!',
    'chat.feeling.good.pending': "Glad you're doing well! Don't forget to check off your remaining habits today.",
    'chat.water': 'Staying hydrated is a great habit! Aim for 8 glasses a day. \uD83D\uDCA7',
    'chat.sleep': 'Getting enough sleep is crucial. Aim for 7-9 hours! \uD83D\uDECF\uFE0F',
    'chat.exercise': 'Consistent exercise is key. Even 15 minutes a day makes a difference! \uD83C\uDFC3',
    'chat.reading': 'Reading daily is fantastic! Even 10 pages a day adds up to 30+ books a year. \uD83D\uDCDA',
    'chat.add.habit': "I've added '{name}' to your habits! You can check in daily to track your progress. \uD83C\uDF1F",
    'chat.add.habit.login': 'Please login or sign up first to add habits!',
    'chat.add.habit.prompt': 'What habit would you like to add? Try "add habit [name]" or "track [activity]".',
    'chat.rename.ok': "Renamed '{old}' to '{new}'! \u2705",
    'chat.freq.ok': "Changed '{name}' to {freq} tracking! \u2705",
    'chat.target.ok': "Set '{name}' target to {count} per {freq}! \u2705",
    'chat.delete.ok': "Deleted '{name}' from your habits! \uD83D\uDDD1\uFE0F",
    'chat.delete.confirm': "Are you sure you want to delete '{name}'? Say 'yes' to confirm or 'no' to cancel.",
    'chat.alter.notfound': "I couldn't find a habit named '{name}'. Try checking the spelling.",
    'chat.alter.login': 'Please login or sign up first to modify habits!',
    'chat.alter.prompt': 'Try saying "rename [habit] to [new name]", "change [habit] to weekly", or "delete [habit]".',
    'chat.default': "That's interesting! I'm here to help with your habit journey. Try asking about your progress, tips, or motivation.",
  },

  hi: {
    'app.name': 'हैबिट ट्रैकर',
    'app.tagline': 'बेहतर आदतें बनाएं, एक दिन में एक कदम',
    'app.tagline.short': 'बेहतर आदतें बनाएं',

    // Header
    'notifications.on': 'सूचनाएं चालू',
    'notifications.off': 'सूचनाएं बंद',
    'logout': 'लॉगआउट',
    'add.habit': '+ आदत जोड़ें',
    'settings': 'सेटिंग्स',
    'badges': 'बैज',
    'toggle.theme': 'थीम बदलें',

    // Sidebar
    'home': 'होम',
    'analytics': 'एनालिटिक्स',
    'categories': 'श्रेणियाँ',
    'fitness': 'फिटनेस',
    'study': 'पढ़ाई',
    'health': 'स्वास्थ्य',
    'mindfulness': 'माइंडफुलनेस',
    'finance': 'वित्त',

    // Time pills
    'all': 'सभी',
    'today': 'आज',
    'weekly': 'साप्ताहिक',
    'monthly': 'मासिक',

    // Dashboard stats
    'stat.total': 'कुल आदतें',
    'stat.today': 'आज की चेक-इन',
    'stat.streak': 'सबसे लंबी लकीर',
    'stat.completion': 'औसत पूर्णता',
    'stat.checkins': 'कुल चेक-इन',
    'stat.badges': 'अर्जित बैज',

    // Habit card
    'day.streak': '{n} दिन की लकीर',
    'days.streak': '{n} दिनों की लकीर',

    // Empty states
    'empty.title': 'आज ही अपनी पहली आदत बनाना शुरू करें!',
    'empty.text': '"छोटी दैनिक क्रियाएं बड़े परिणाम देती हैं।"',
    'empty.btn': '+ अपनी पहली आदत बनाएं',
    'empty.home.no.habits': 'इस दृश्य में कोई आदत नहीं मिली।',
    'empty.today.all.done': 'आज के लिए सब हो गया! शानदार!',
    'empty.category': 'अभी तक कोई {cat} आदत नहीं।',
    'empty.create.hint': 'इसे यहां देखने के लिए {cat} आइकन वाली आदत बनाएं।',
    'empty.category.title': 'अभी तक कोई {cat} आदत नहीं।',

    // Add habit page button
    'add.new.habit': '+ नई आदत जोड़ें',

    // Habit form
    'new.habit': 'नई आदत',
    'edit.habit': 'आदत संपादित करें',
    'habit.name': 'नाम',
    'habit.name.placeholder': 'जैसे 30 मिनट पढ़ें',
    'habit.icon': 'आइकन',
    'habit.desc': 'विवरण',
    'habit.desc.placeholder': 'वैकल्पिक विवरण',
    'habit.frequency': 'आवृत्ति',
    'habit.target': 'लक्ष्य संख्या',
    'habit.daily': 'दैनिक',
    'habit.weekly': 'साप्ताहिक',
    'habit.color': 'रंग',
    'habit.reminder': 'याद दिलाने का समय',
    'habit.set.reminder': 'समय निर्धारित करें',
    'cancel': 'रद्द करें',
    'save': 'सहेजें',

    // Detail modal
    'current.streak': 'वर्तमान लकीर',
    'longest.streak': 'सबसे लंबी लकीर',
    'total.checkins': 'कुल चेक-इन',
    'edit': 'संपादित करें',
    'delete': 'हटाएं',
    'close': 'बंद करें',
    'detail.delete.confirm': 'इस आदत को हटाएं? यह वापस नहीं किया जा सकता।',
    'habit.deleted': 'आदत हटा दी गई',

    // Toast messages
    'habit.created': 'आदत बन गई!',
    'habit.updated': 'आदत अपडेट हो गई!',
    'checked.in': 'बहुत अच्छे! ऐसे ही जारी रखें! 🔥',
    'checked.in.plus': 'चेक-इन +1!',
    'checkin.removed': 'चेक-इन हटा दिया गया',
    'checkin.singular': 'चेक-इन',
    'checkin.plural': 'चेक-इन',
    'notifications.enabled': 'सूचनाएं सक्षम',
    'notifications.disabled': 'सूचनाएं अक्षम',
    'notifications.denied': 'सूचना अनुमति अस्वीकृत। ब्राउज़र सेटिंग्स में सक्षम करें।',
    'schedule.saved': 'शेड्यूल सहेज लिया गया',
    'data.cleared': 'सभी डेटा साफ़ हो गया',
    'logged.out': 'सफलतापूर्वक लॉग आउट',
    'welcome': 'स्वागत है, {name}!',

    // Settings
    'settings.title': 'सेटिंग्स',
    'account': 'खाता',
    'username': 'उपयोगकर्ता नाम',
    'email': 'ईमेल',
    'appearance': 'दिखावट',
    'dark.mode': 'डार्क मोड',
    'daily.schedule': 'दैनिक समय-सारणी',
    'wake.time': 'जागने का समय',
    'sleep.time': 'सोने का समय',
    'schedule.hint': 'अधूरी आदतों की याद जागने के घंटों में हर घंटे दी जाएगी, और सोने से पहले सभी शेष आदतों की याद दिलाई जाएगी।',
    'save.schedule': 'शेड्यूल सहेजें',
    'notifications': 'सूचनाएं',
    'daily.reminders': 'दैनिक अनुस्मारक',
    'reminders.hint': 'जागने के घंटों के दौरान अधूरी आदतों के लिए हर घंटे अनुस्मारक प्राप्त करें',
    'analytics.short': 'एनालिटिक्स',
    'view.statistics': 'आंकड़े देखें',
    'view.calendar': 'कैलेंडर हीटमैप देखें',
    'data': 'डेटा',
    'clear.all.data': 'सभी डेटा साफ़ करें',
    'clear.confirm': 'क्या आप वाकई अपना सारा डेटा हटाना चाहते हैं? यह वापस नहीं किया जा सकता।',
    'language': 'भाषा',

    // AI Coach
    'ai.coach': 'एआई हैबिट कोच',
    'overview': 'अवलोकन',
    'weekly.review': 'साप्ताहिक समीक्षा',
    'monthly.review': 'मासिक समीक्षा',
    'insights': 'जानकारी',
    'suggestions': 'सुझाव',
    'coach.message': 'कोच का संदेश',
    'coach.no.data': 'साप्ताहिक समीक्षा के लिए पर्याप्त डेटा नहीं।',
    'coach.no.data.monthly': 'मासिक समीक्षा के लिए पर्याप्त डेटा नहीं।',
    'coach.empty': 'एआई कोचिंग पाने के लिए पहले एक आदत बनाएं!',

    // Analytics
    'analytics.dashboard': 'एनालिटिक्स डैशबोर्ड',
    'analytics.subtitle': 'आपकी प्रगति एक नजर में',
    'statistics': 'आंकड़े',
    'calendar.heatmap': 'कैलेंडर हीटमैप',
    'this.week': 'इस सप्ताह',
    'this.month': 'इस महीने',
    'overall': 'समग्र',
    'best.day': 'सबसे अच्छा दिन',
    'completion.rate': 'पूर्णता दर',
    'analytics.empty': 'एनालिटिक्स देखने के लिए कुछ आदतें बनाएं।',
    'calendar.empty': 'कैलेंडर हीटमैप देखने के लिए कुछ आदतें बनाएं।',

    // Calendar
    'prev.year': '← पिछला वर्ष',
    'next.year': 'अगला वर्ष →',
    'less': 'कम',
    'more': 'अधिक',
    'activity.calendar': 'गतिविधि कैलेंडर',

    // Chatbot
    'ai.assistant': 'एआई हैबिट असिस्टेंट',
    'ask.anything': 'मुझसे कुछ भी पूछें...',

    // Landing
    'get.started': 'मुफ्त शुरू करें',
    'learn.more': 'और जानें',
    'hero.title': 'ऐसी आदतें बनाएं जो ',
    'hero.title.stick': 'टिकें',
    'hero.subtitle': 'बुद्धिमान अंतर्दृष्टि, गेमिफिकेशन और व्यक्तिगत कोचिंग के साथ अपनी दैनिक आदतों को ट्रैक, मापें और सुधारें।',
    'hero.badges': 'उपलब्धि बैज',
    'hero.quotes': 'प्रेरणादायक उद्धरण',
    'hero.smart.coach': 'स्मार्ट कोच',
    'features.title': 'सफलता के लिए आपको जो कुछ',
    'features.title.highlight': 'चाहिए',
    'features.subtitle': 'जीवन बदलने वाली आदतों को बनाने और बनाए रखने में मदद करने के लिए शक्तिशाली उपकरण',
    'feature.checkins': 'दैनिक चेक-इन',
    'feature.checkins.desc': 'एक-टैप चेक-इन हर दिन आपकी आदतों को ट्रैक करना आसान बनाते हैं। निरंतरता के साथ गति बनाएं।',
    'feature.analytics': 'स्मार्ट एनालिटिक्स',
    'feature.analytics.desc': 'दृश्य प्रगति चार्ट, साप्ताहिक और मासिक रिपोर्ट, और आपकी वृद्धि को मापने के लिए विस्तृत आंकड़े।',
    'feature.coach': 'एआई हैबिट कोच',
    'feature.coach.desc': 'आपके अनूठे पैटर्न के आधार पर व्यक्तिगत अंतर्दृष्टि, स्मार्ट सुझाव और अनुकूली प्रेरणा।',
    'feature.gamification': 'गेमिफिकेशन',
    'feature.gamification.desc': 'बैज अर्जित करें, लकीरें बनाएं, और अपनी यात्रा में उपलब्धि माइलस्टोन के साथ खुद को चुनौती दें।',
    'feature.calendar': 'कैलेंडर हीटमैप',
    'feature.calendar.desc': 'अपनी दैनिक प्रगति दिखाने वाले GitHub-शैली गतिविधि हीटमैप के साथ अपनी निरंतरता की कल्पना करें।',
    'feature.theme': 'डार्क और लाइट मोड',
    'feature.theme.desc': 'चिकनी संक्रमण के साथ डार्क और लाइट इंटरफेस के बीच अपनी पसंदीदा थीम चुनें।',
    'start.journey': 'अपनी यात्रा',
    'start.journey.highlight': 'शुरू करें',
    'start.journey.subtitle': 'अपनी आदतों को ट्रैक करना शुरू करने के लिए खाता बनाएं या लॉग इन करें',
    'login': 'लॉग इन',
    'signup': 'साइन अप',
    'email.or.username': 'ईमेल या उपयोगकर्ता नाम',
    'password': 'पासवर्ड',
    'confirm.password': 'पासवर्ड की पुष्टि करें',
    'create.account': 'खाता बनाएं',
    'login.error': 'कृपया सभी फ़ील्ड भरें',
    'signup.error': 'कृपया सभी आवश्यक फ़ील्ड भरें',
    'password.mismatch': 'पासवर्ड मेल नहीं खाते',
    'auth.hint.login': 'खाता नहीं है? साइन अप करें',
    'auth.hint.signup': 'पहले से खाता है? लॉग इन करें',
    'footer.tagline': 'बेहतर आदतें बनाएं, एक दिन में एक कदम।',
    'footer.copyright': '© 2026 हैबिट ट्रैकर। सर्वाधिकार सुरक्षित।',
    'habit.name.required': 'कृपया एक आदत का नाम दर्ज करें',
    'streak': 'लकीर',
    'add.habit.header': '+ आदत जोड़ें',

    // Notification keys
    'needs.checkin': 'को चेक-इन करना न भूलें',
    'pending': 'लंबित',
    'habits.need.checkin': 'आदतों को आज चेक-इन की आवश्यकता है',
    'time.for': 'समय हो गया',
    'wind.down': 'विंड डाउन रिमाइंडर',
    'habit.needs.checkin': 'आदत को सोने से पहले चेक-इन की आवश्यकता है',
    'notifications.working': 'सूचनाएं काम कर रही हैं!',

    // Chatbot
    'chat.greeting': 'नमस्ते! मैं आपका AI हैबिट असिस्टेंट हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
    'chat.q.progress': 'मेरी प्रगति कैसी है?',
    'chat.q.tip': 'मुझे एक सुझाव दें',
    'chat.q.motivate': 'मुझे प्रेरित करें!',
    'chat.q.weekly': 'साप्ताहिक सारांश',
    'chat.q.monthly': 'मासिक सारांश',
    'chat.q.streak': 'मेरी सबसे लंबी लकीर',
    'chat.help': 'मैं आपकी आदतों को ट्रैक करने में मदद कर सकता हूं! पूछने का प्रयास करें:\n\u2022 "मेरी प्रगति कैसी है?"\n\u2022 "मुझे एक सुझाव दें"\n\u2022 "मुझे प्रेरित करें!"\n\u2022 "साप्ताहिक सारांश"\n\u2022 "मेरी सबसे लंबी लकीर"',
    'chat.no.habits': 'आपने अभी तक कोई आदत नहीं बनाई है। अपनी पहली आदत जोड़ने के लिए + बटन दबाएं!',
    'chat.progress': 'आपकी प्रगति:\n\u2022 आज {completed}/{total} आदतें पूरी\n\u2022 कुल {checkins} चेक-इन\n\u2022 {rate}% औसत पूर्णता दर\n\u2022 सबसे लंबी लकीर: {streak} दिन\nजारी रखें! \uD83D\uDD25',
    'chat.tip.empty': 'एक छोटी आदत से शुरू करें और वहां से आगे बढ़ें। निरंतरता तीव्रता से बेहतर है!',
    'chat.tip.none': 'आप बहुत अच्छा कर रहे हैं! लगातार काम करते रहें।',
    'chat.motivate.empty': 'आप यह कर सकते हैं! हर छोटा कदम एक बेहतर आप बनाने की दिशा में मायने रखता है। \uD83D\uDCAA',
    'chat.weekly.empty': 'साप्ताहिक समीक्षा के लिए पर्याप्त डेटा नहीं। पहले कुछ आदतें बनाएं!',
    'chat.monthly.empty': 'मासिक समीक्षा के लिए पर्याप्त डेटा नहीं। पहले कुछ आदतें बनाएं!',
    'chat.highlights': 'मुख्य बिंदु',
    'chat.tips': 'सुझाव',
    'chat.streak.empty': 'अभी तक कोई लकीर नहीं। अपनी लकीर शुरू करने के लिए एक आदत बनाएं!',
    'chat.streak': '\uD83D\uDD25 आपकी सबसे लंबी लकीर: {best} दिन ({name})\n\uD83D\uDD25 वर्तमान सर्वश्रेष्ठ: {current} दिन\nगति बनाए रखें!',
    'chat.greeting.empty': 'स्वागत है! बेहतर आदतें बनाने के लिए तैयार हैं? शुरू करने के लिए + दबाएं!',
    'chat.greeting.pending.one': 'नमस्ते! आज आपके पास 1 लंबित आदत है। क्या आपको कोई सुझाव या प्रेरणा चाहिए?',
    'chat.greeting.pending.many': 'नमस्ते! आज आपके पास {n} लंबित आदतें हैं। क्या आपको कोई सुझाव या प्रेरणा चाहिए?',
    'chat.greeting.done': 'बहुत बढ़िया! लगता है आज की सभी आदतें पूरी हो गईं। आप कमाल कर रहे हैं! \uD83D\uDCAA',
    'chat.thanks': 'आपका स्वागत है! शानदार काम करते रहें! \uD83D\uDE0A',
    'chat.feeling.good.empty': 'बहुत अच्छे! एक नई आदत जोड़ना चाहेंगे?',
    'chat.feeling.good.done': 'सुनकर अच्छा लगा! आज की सभी आदतें पूरी हो गईं \u2014 अब आराम करने का समय!',
    'chat.feeling.good.pending': 'अच्छा लगा कि आप ठीक हैं! आज अपनी बाकी आदतों को पूरा करना न भूलें।',
    'chat.water': 'हाइड्रेटेड रहना एक शानदार आदत है! दिन में 8 गिलास पानी का लक्ष्य रखें। \uD83D\uDCA7',
    'chat.sleep': 'पर्याप्त नींद लेना बहुत महत्वपूर्ण है। 7-9 घंटे सोने का लक्ष्य रखें! \uD83D\uDECF\uFE0F',
    'chat.exercise': 'नियमित व्यायाम महत्वपूर्ण है। दिन में सिर्फ 15 मिनट भी फर्क डालता है! \uD83C\uDFC3',
    'chat.reading': 'रोजाना पढ़ना शानदार है! दिन में सिर्फ 10 पेज भी साल में 30+ किताबें पढ़ सकते हैं। \uD83D\uDCDA',
    'chat.add.habit': "मैंने '{name}' को आपकी आदतों में जोड़ दिया है! आप रोजाना चेक-इन करके अपनी प्रगति ट्रैक कर सकते हैं। \uD83C\uDF1F",
    'chat.add.habit.login': 'कृपया पहले लॉगिन या साइन अप करें!',
    'chat.add.habit.prompt': 'आप कौन सी आदत जोड़ना चाहेंगे? "add habit [नाम]" या "track [गतिविधि]" कहकर देखें।',
    'chat.rename.ok': "'{old}' का नाम बदलकर '{new}' कर दिया गया! \u2705",
    'chat.freq.ok': "'{name}' को {freq} ट्रैकिंग में बदल दिया गया! \u2705",
    'chat.target.ok': "'{name}' का लक्ष्य {count} प्रति {freq} निर्धारित किया गया! \u2705",
    'chat.delete.ok': "'{name}' आपकी आदतों से हटा दिया गया! \uD83D\uDDD1\uFE0F",
    'chat.delete.confirm': "क्या आप वाकई '{name}' को हटाना चाहते हैं? पुष्टि के लिए 'हां' या रद्द करने के लिए 'नहीं' कहें।",
    'chat.alter.notfound': "मुझे '{name}' नाम की कोई आदत नहीं मिली। वर्तनी जांचें।",
    'chat.alter.login': 'कृपया पहले लॉगिन या साइन अप करें!',
    'chat.alter.prompt': '"rename [आदत] से [नया नाम]", "change [आदत] to weekly", या "delete [आदत]" कहकर देखें।',
    'chat.default': 'यह दिलचस्प है! मैं आपकी आदत यात्रा में मदद करने के लिए यहां हूं। अपनी प्रगति, सुझाव या प्रेरणा के बारे में पूछें।',
  },
};

let _currentLang = 'en';

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) lang = 'en';
  _currentLang = lang;
  const settings = Storage.getSettings();
  settings.language = lang;
  Storage.saveSettings(settings);
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
}

function getLanguage() {
  return _currentLang;
}

function __(key, params = {}) {
  const lang = TRANSLATIONS[_currentLang];
  let text = lang[key];
  if (text === undefined) {
    text = TRANSLATIONS.en[key] || key;
  }
  // Replace {param} placeholders
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

window.__ = __;
window.setLanguage = setLanguage;
window.getLanguage = getLanguage;
window.LANGUAGES = LANGUAGES;
