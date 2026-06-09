'use strict';

const Scanner = {
  stream: null,
  videoEl: null,
  overlayEl: null,

  init() {
    this.videoEl = document.getElementById('scanner-video');
    this.overlayEl = document.getElementById('scanner-overlay');
  },

  suggestIcon(text) {
    const q = text.toLowerCase();
    const iconMap = [
      { keywords: ['read', 'book', 'study', 'learn', 'course', 'class', 'lesson', 'knowledge', 'education', 'library'], icon: '📚' },
      { keywords: ['run', 'jog', 'sprint', 'marathon', 'cardio'], icon: '🏃' },
      { keywords: ['walk', 'stroll', 'hike', 'trek'], icon: '🚶' },
      { keywords: ['stretch', 'flex', 'yoga', 'pilates'], icon: '🧎' },
      { keywords: ['gym', 'workout', 'exercise', 'lift', 'pushup', 'pullup', 'squat', 'strength'], icon: '💪' },
      { keywords: ['meditate', 'meditation', 'mindful', 'breathe', 'breathing'], icon: '🧘' },
      { keywords: ['water', 'drink', 'hydrate', 'hydration'], icon: '💧' },
      { keywords: ['eat', 'food', 'meal', 'diet', 'nutrition', 'healthy', 'vegan', 'breakfast', 'lunch', 'dinner', 'cook'], icon: '🥗' },
      { keywords: ['sleep', 'bed', 'nap', 'rest', 'dream'], icon: '😴' },
      { keywords: ['write', 'journal', 'diary', 'blog', 'article'], icon: '✍️' },
      { keywords: ['money', 'save', 'finance', 'budget', 'invest', 'expense', 'income', 'bank', 'saving'], icon: '💰' },
      { keywords: ['clean', 'tidy', 'organize', 'declutter', 'wash', 'laundry', 'dish'], icon: '🧹' },
      { keywords: ['work', 'office', 'job', 'career', 'project', 'meeting', 'email', 'task'], icon: '💼' },
      { keywords: ['music', 'guitar', 'piano', 'sing', 'song', 'instrument', 'practice'], icon: '🎵' },
      { keywords: ['language', 'spanish', 'french', 'german', 'chinese', 'japanese', 'vocab'], icon: '🌎' },
      { keywords: ['art', 'draw', 'paint', 'sketch', 'creative', 'design', 'craft'], icon: '🎨' },
      { keywords: ['code', 'program', 'develop', 'software', 'app', 'website', 'javascript'], icon: '💻' },
      { keywords: ['garden', 'plant', 'water', 'flower'], icon: '🌿' },
      { keywords: ['gratitude', 'thankful', 'appreciate'], icon: '🙏' },
      { keywords: ['sunrise', 'morning', 'early'], icon: '🌅' },
      { keywords: ['coffee', 'tea', 'morning routine'], icon: '☕' },
      { keywords: ['brain', 'memory', 'puzzle', 'sudoku', 'crossword', 'chess'], icon: '🧠' },
      { keywords: ['walk', 'pet', 'dog', 'cat', 'animal'], icon: '🐾' },
      { keywords: ['digital detox', 'screen', 'phone', 'social media', 'unplug'], icon: '📱' },
      { keywords: ['self care', 'skincare', 'bath', 'relax', 'spa', 'massage'], icon: '🌿' },
    ];

    for (const entry of iconMap) {
      if (entry.keywords.some(kw => q.includes(kw))) {
        return entry.icon;
      }
    }
    return '📋';
  },

  async scanFromCamera() {
    const BarcodeDetector = window.BarcodeDetector;
    if (!BarcodeDetector) {
      UI.showToast('QR scanning not supported in this browser. Try Chrome on desktop or Android.', 'error');
      return null;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 360, height: 360 }
      });
      if (!this.videoEl || !this.overlayEl) return null;

      this.videoEl.srcObject = this.stream;
      this.overlayEl.classList.remove('hidden');
      this.videoEl.play();

      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      const result = await new Promise((resolve) => {
        let attempts = 0;
        const maxAttempts = 150;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const barcodes = await detector.detect(this.videoEl);
            if (barcodes.length > 0) {
              clearInterval(interval);
              this._stopCamera();
              resolve(barcodes[0].rawValue);
            }
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              this._stopCamera();
              resolve(null);
            }
          } catch {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              this._stopCamera();
              resolve(null);
            }
          }
        }, 200);
      });

      this.overlayEl.classList.add('hidden');
      return result;
    } catch (e) {
      this._stopCamera();
      this.overlayEl.classList.add('hidden');
      UI.showToast('Camera access denied or unavailable.', 'error');
      return null;
    }
  },

  uploadImage() {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) { resolve(null); return; }
        UI.showToast('Processing image...', 'info');
        const text = await this._ocrImage(file);
        resolve(text);
      };
      input.click();
    });
  },

  async _ocrImage(file) {
    try {
      if (typeof Tesseract === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load OCR library'));
        });
        await new Promise(r => setTimeout(r, 500));
      }
      const { data } = await Tesseract.recognize(file, 'eng+hin', { logger: () => {} });
      return data.text.trim() || null;
    } catch (e) {
      console.warn('OCR failed:', e);
      UI.showToast('Could not read text from image. Try a clearer photo.', 'error');
      return null;
    }
  },

  _stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.videoEl) this.videoEl.srcObject = null;
  },

  destroy() {
    this._stopCamera();
    this.videoEl = null;
    this.overlayEl = null;
  },
};

window.Scanner = Scanner;
