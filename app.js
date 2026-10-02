/**
 * ============================================================================
 * KIDS INTERACTIVE TALKING LEARNING APP - MAIN CONTROLLER (app.js)
 * Features:
 *  - Interactive Talking Mascot with lip-sync animations
 *  - Web Speech API (Text-to-Speech: English & Bengali, Turtle mode, Spelling mode)
 *  - Speech Recognition (Kids Voice Assessment & Encouragement)
 *  - Web Audio API Sound Effects Synthesizer (Instant, no lag)
 *  - 5 Engaging Modes: Cards, Listen & Find Quiz, Speaking Challenge, Memory Match, Autoplay
 *  - Confetti Celebrations & Star Rewards System
 * ============================================================================
 */

(function () {
  'use strict';

  // State Management
  const state = {
    allCategories: window.VOCABULARY_DATA || [],
    currentCategory: 'fruits',
    currentWordIndex: 0,
    currentJumboItem: null,
    currentJumboIndex: 0,
    searchQuery: '',
    stars: parseInt(localStorage.getItem('kids_stars') || '0', 10),
    soundEnabled: true,
    currentMode: 'home',
    
    // Quiz State
    quiz: {
      currentQuestion: null,
      score: 0,
      total: 0,
      streak: 0,
      answered: false
    },

    // Speaking Practice State
    speaking: {
      currentIndex: 0,
      targetItem: null,
      isListening: false
    },

    // Memory Match State
    match: {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      lockBoard: false
    },

    // Autoplay State
    autoplay: {
      isPlaying: false,
      currentIndex: 0,
      timer: null
    },

    // Voice Settings
    settings: {
      rate: 0.9,
      pitch: 1.2,
      voiceEn: null,
      voiceBn: null
    }
  };

  // DOM Elements
  const DOM = {
    starCount: document.getElementById('star-count'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    soundIcon: document.getElementById('sound-icon'),
    btnSettings: document.getElementById('btn-settings'),
    settingsModal: document.getElementById('settings-modal'),
    btnSettingsClose: document.getElementById('btn-settings-close'),
    
    // Mascot
    mascotCharacter: document.getElementById('mascot-character'),
    mascotMessage: document.getElementById('mascot-message'),

    // Home Playground & Navigation
    viewHome: document.getElementById('view-home'),
    kidCategoryGrid: document.getElementById('kid-category-grid'),
    btnBackHome: document.getElementById('btn-back-home'),
    btnToggleJumbo: document.getElementById('btn-toggle-jumbo'),
    btnToggleGrid: document.getElementById('btn-toggle-grid'),
    gridViewContainer: document.getElementById('grid-view-container'),

    // Tabs & Categories
    modeTabs: document.querySelectorAll('.mode-tab'),
    viewPanels: document.querySelectorAll('.view-panel'),
    categorySection: document.getElementById('category-section'),
    categoryPills: document.getElementById('category-pills'),

    // View: Cards
    cardsGrid: document.getElementById('cards-grid'),
    currentCatIcon: document.getElementById('current-cat-icon'),
    currentCatTitle: document.getElementById('current-cat-title'),
    currentCatCount: document.getElementById('current-cat-count'),
    wordSearch: document.getElementById('word-search'),

    // Jumbo 3D Stage
    jumboStage: document.getElementById('jumbo-3d-stage'),
    jumboCatBadge: document.getElementById('jumbo-cat-badge'),
    jumboCounter: document.getElementById('jumbo-counter'),
    jumboImg: document.getElementById('jumbo-img'),
    btnJumboTapTalk: document.getElementById('btn-jumbo-tap-talk'),
    jumboWord: document.getElementById('jumbo-word'),
    jumboSpellingPill: document.getElementById('jumbo-spelling-pill'),
    jumboPron: document.getElementById('jumbo-pron'),
    jumboMeaning: document.getElementById('jumbo-meaning'),
    jumboSentence: document.getElementById('jumbo-sentence'),
    btnJumboSentence: document.getElementById('btn-jumbo-sentence'),
    btnJumboBilingual: document.getElementById('btn-jumbo-bilingual'),
    btnJumboSlow: document.getElementById('btn-jumbo-slow'),
    btnJumboSpell: document.getElementById('btn-jumbo-spell'),
    btnJumboMic: document.getElementById('btn-jumbo-mic'),
    jumboMicFeedback: document.getElementById('jumbo-mic-feedback'),
    btnJumboPrev: document.getElementById('btn-jumbo-prev'),
    btnJumboNext: document.getElementById('btn-jumbo-next'),

    // Modal: Word Details
    wordModal: document.getElementById('word-modal'),
    btnModalClose: document.getElementById('btn-modal-close'),
    modalCat: document.getElementById('modal-cat'),
    modalImg: document.getElementById('modal-img'),
    modalWord: document.getElementById('modal-word'),
    modalPron: document.getElementById('modal-pron'),
    modalMeaning: document.getElementById('modal-meaning'),
    modalSentence: document.getElementById('modal-sentence'),
    btnModalSayBilingual: document.getElementById('btn-modal-say-bilingual'),
    btnModalSayEn: document.getElementById('btn-modal-say-en'),
    btnModalSaySlow: document.getElementById('btn-modal-say-slow'),
    btnModalSpelling: document.getElementById('btn-modal-spelling'),
    btnModalSaySentence: document.getElementById('btn-modal-say-sentence'),
    btnModalTestMic: document.getElementById('btn-modal-test-mic'),
    modalMicTarget: document.getElementById('modal-mic-target'),
    modalMicFeedback: document.getElementById('modal-mic-feedback'),
    btnModalPrev: document.getElementById('btn-modal-prev'),
    btnModalNext: document.getElementById('btn-modal-next'),
    modalCounter: document.getElementById('modal-counter'),

    // View: Quiz
    quizQuestionText: document.getElementById('quiz-question-text'),
    quizHint: document.getElementById('quiz-hint'),
    quizOptions: document.getElementById('quiz-options'),
    btnQuizListen: document.getElementById('btn-quiz-listen'),
    btnQuizSkip: document.getElementById('btn-quiz-skip'),
    quizScore: document.getElementById('quiz-score'),
    quizStreak: document.getElementById('quiz-streak'),
    quizFeedback: document.getElementById('quiz-feedback'),

    // View: Speaking
    speakTargetCard: document.getElementById('speak-target-card'),
    speakTargetImg: document.getElementById('speak-target-img'),
    speakTargetWord: document.getElementById('speak-target-word'),
    speakTargetPron: document.getElementById('speak-target-pron'),
    speakTargetMeaning: document.getElementById('speak-target-meaning'),
    btnSpeakListen: document.getElementById('btn-speak-listen'),
    btnMicListen: document.getElementById('btn-mic-listen'),
    btnSpeakNext: document.getElementById('btn-speak-next'),
    speechStatus: document.getElementById('speech-status'),
    speechResultBox: document.getElementById('speech-result-box'),

    // View: Memory Match
    matchGrid: document.getElementById('match-grid'),
    matchMoves: document.getElementById('match-moves'),
    matchPairs: document.getElementById('match-pairs'),
    btnMatchRestart: document.getElementById('btn-match-restart'),

    // View: Autoplay
    autoplayImg: document.getElementById('autoplay-img'),
    autoplayCat: document.getElementById('autoplay-cat'),
    autoplayWord: document.getElementById('autoplay-word'),
    autoplayPron: document.getElementById('autoplay-pron'),
    autoplayMeaning: document.getElementById('autoplay-meaning'),
    autoplaySentence: document.getElementById('autoplay-sentence'),
    btnAutoplayPlaypause: document.getElementById('btn-autoplay-playpause'),
    btnAutoplayPrev: document.getElementById('btn-autoplay-prev'),
    btnAutoplayNext: document.getElementById('btn-autoplay-next'),
    autoplayProgress: document.getElementById('autoplay-progress'),

    // Settings
    settingRate: document.getElementById('setting-rate'),
    settingPitch: document.getElementById('setting-pitch'),
    settingVoiceEn: document.getElementById('setting-voice-en'),
    settingVoiceBn: document.getElementById('setting-voice-bn'),
    btnTestVoice: document.getElementById('btn-test-voice'),

    // Confetti
    confettiCanvas: document.getElementById('confetti-canvas')
  };

  /* ==========================================================================
     AUDIO SYNTHESIZER (WEB AUDIO API)
     Instant sound effects without network delays
     ========================================================================== */
  const SoundFX = {
    ctx: null,

    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        console.warn('Web Audio API not supported', e);
      }
    },

    resume() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },

    playPop() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    },

    playSparkle() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
      });
    },

    playFanfare() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const chords = [
        { f: 523.25, t: 0.0 }, // C5
        { f: 659.25, t: 0.12 }, // E5
        { f: 783.99, t: 0.24 }, // G5
        { f: 1046.50, t: 0.36 } // C6
      ];
      chords.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.f, this.ctx.currentTime + n.t);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime + n.t);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + n.t + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + n.t);
        osc.stop(this.ctx.currentTime + n.t + 0.4);
      });
    },

    playBoing() {
      if (!state.soundEnabled || !this.ctx) return;
      this.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    },

    playCheer() {
      if (!state.soundEnabled) return;
      const cheers = ['sound_super.mp3', 'sound_very_good.mp3', 'sound_nice.mp3', 'sound_win_puzzle.mp3'];
      const c = cheers[Math.floor(Math.random() * cheers.length)];
      try {
        const audio = new Audio(`sounds/${c}`);
        audio.volume = 0.85;
        audio.play().catch(() => this.playFanfare());
      } catch (e) {
        this.playFanfare();
      }
    },

    playCorrect() {
      if (!state.soundEnabled) return;
      try {
        const audio = new Audio('sounds/sound_correct_answer.mp3');
        audio.volume = 0.85;
        audio.play().catch(() => this.playSparkle());
      } catch (e) {
        this.playSparkle();
      }
    }
  };

  /* ==========================================================================
     SPEECH SYNTHESIS CONTROLLER (TALKING ENGINE)
     ========================================================================== */
  const SpeechEngine = {
    synth: window.speechSynthesis,
    voices: [],

    init() {
      if (!this.synth) return;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    },

    loadVoices() {
      this.voices = this.synth.getVoices();
      this.populateVoiceSelects();
    },

    populateVoiceSelects() {
      if (!DOM.settingVoiceEn || !DOM.settingVoiceBn) return;
      DOM.settingVoiceEn.innerHTML = '';
      DOM.settingVoiceBn.innerHTML = '';

      let foundEn = false;
      let foundBn = false;

      this.voices.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = `${v.name} (${v.lang})`;

        if (v.lang.startsWith('en')) {
          DOM.settingVoiceEn.appendChild(opt);
          if (!foundEn && (v.name.includes('Natural') || v.name.includes('Google') || v.default)) {
            state.settings.voiceEn = v;
            opt.selected = true;
            foundEn = true;
          }
        }
        if (v.lang.startsWith('bn')) {
          DOM.settingVoiceBn.appendChild(opt);
          if (!foundBn) {
            state.settings.voiceBn = v;
            opt.selected = true;
            foundBn = true;
          }
        }
      });

      if (!state.settings.voiceEn && this.voices.length > 0) {
        state.settings.voiceEn = this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];
      }
      if (!state.settings.voiceBn && this.voices.length > 0) {
        state.settings.voiceBn = this.voices.find(v => v.lang.startsWith('bn')) || state.settings.voiceEn;
      }
    },

    speak(text, options = {}) {
      if (!this.synth) return Promise.resolve();
      this.synth.cancel(); // Stop any pending speech

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate !== undefined ? options.rate : state.settings.rate;
        utterance.pitch = options.pitch !== undefined ? options.pitch : state.settings.pitch;
        utterance.lang = options.lang || 'en-US';

        if (options.voice) {
          utterance.voice = options.voice;
        } else if (utterance.lang.startsWith('bn') && state.settings.voiceBn) {
          utterance.voice = state.settings.voiceBn;
        } else if (utterance.lang.startsWith('en') && state.settings.voiceEn) {
          utterance.voice = state.settings.voiceEn;
        }

        // Mascot talking animation triggers
        utterance.onstart = () => {
          DOM.mascotCharacter.classList.add('is-talking');
        };

        utterance.onend = () => {
          DOM.mascotCharacter.classList.remove('is-talking');
          resolve();
        };

        utterance.onerror = (e) => {
          DOM.mascotCharacter.classList.remove('is-talking');
          console.warn('Speech error:', e);
          resolve();
        };

        this.synth.speak(utterance);
      });
    },

    speakEnglish(word, slow = false) {
      const rate = slow ? 0.55 : state.settings.rate;
      return this.speak(word, { lang: 'en-US', rate, voice: state.settings.voiceEn });
    },

    speakBengali(text, slow = false) {
      const rate = slow ? 0.65 : state.settings.rate;
      return this.speak(text, { lang: 'bn-BD', rate, voice: state.settings.voiceBn });
    },

    async speakBilingual(word, meaning, slow = false) {
      if (!this.synth) return;
      // 1. First speak English
      await this.speakEnglish(word, slow);
      // Brief natural pause for children to absorb the sound
      await new Promise(r => setTimeout(r, 400));
      // 2. Then speak Bengali meaning
      await this.speakBengali(meaning, slow);
    },

    async spellOut(word, meaning = null) {
      if (!this.synth) return;
      const letters = word.toUpperCase().split('');
      for (const char of letters) {
        if (/[A-Z]/.test(char)) {
          await this.speak(char, { lang: 'en-US', rate: 0.75 });
          await new Promise(r => setTimeout(r, 120));
        }
      }
      await new Promise(r => setTimeout(r, 200));
      if (meaning) {
        await this.speakBilingual(word, meaning);
      } else {
        await this.speakEnglish(word);
      }
    }
  };

  /* ==========================================================================
     SPEECH RECOGNITION (VOICE INPUT FOR KIDS)
     ========================================================================== */
  const SpeechRecognizer = {
    recognition: null,
    isSupported: false,

    init() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.isSupported = true;
      }
    },

    startListening(targetWord, onResultCallback, onEndCallback) {
      if (!this.isSupported || !this.recognition) {
        alert('আপনার ব্রাউজারে মাইক স্পিচ রিকগনিশন সাপোর্ট নেই। গুগল ক্রোম (Google Chrome) ব্যবহার করুন।');
        if (onEndCallback) onEndCallback();
        return;
      }

      this.recognition.onstart = () => {
        state.speaking.isListening = true;
        DOM.btnMicListen.classList.add('is-recording');
        DOM.speechStatus.textContent = 'শুনছি... এখন বলো!';
      };

      this.recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript.trim().toLowerCase();
        const target = targetWord.trim().toLowerCase();
        
        // Exact match or partial word match (e.g. kid says "a red apple" or "apple")
        const isMatch = spoken === target || spoken.includes(target) || target.includes(spoken);
        onResultCallback(spoken, isMatch);
      };

      this.recognition.onerror = (e) => {
        console.warn('SpeechRecognition error:', e);
        DOM.speechStatus.textContent = 'কিছু শোনা যায়নি, আবার চেষ্টা করো!';
      };

      this.recognition.onend = () => {
        state.speaking.isListening = false;
        DOM.btnMicListen.classList.remove('is-recording');
        if (onEndCallback) onEndCallback();
      };

      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Recognition already started', err);
      }
    }
  };

  /* ==========================================================================
     CONFETTI CELEBRATION ENGINE
     ========================================================================== */
  const Confetti = {
    canvas: DOM.confettiCanvas,
    ctx: null,
    particles: [],
    animationId: null,

    init() {
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    },

    resize() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    fire(count = 70) {
      this.resize();
      const colors = ['#FF4757', '#FFA502', '#2ED573', '#1E90FF', '#9B59B6', '#FED330'];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight / 2,
          r: Math.random() * 8 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 14,
          vy: (Math.random() - 0.7) * 16,
          tilt: Math.random() * 10,
          tiltSpeed: Math.random() * 0.1 + 0.05,
          alpha: 1
        });
      }
      if (!this.animationId) {
        this.animate();
      }
    },

    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // Gravity
        p.tilt += p.tiltSpeed;
        p.alpha -= 0.008;

        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();

        if (p.alpha <= 0 || p.y > this.canvas.height) {
          this.particles.splice(idx, 1);
        }
      });

      if (this.particles.length > 0) {
        this.animationId = requestAnimationFrame(() => this.animate());
      } else {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  };

  /* ==========================================================================
     APP CONTROLLER & UI LOGIC
     ========================================================================== */

  function updateStars(amount = 1) {
    state.stars += amount;
    localStorage.setItem('kids_stars', state.stars);
    DOM.starCount.textContent = state.stars;
    SoundFX.playSparkle();
  }

  function setMascotMessage(msg, speakIt = false) {
    DOM.mascotMessage.textContent = msg;
    if (speakIt) {
      SpeechEngine.speakBengali(msg);
    }
  }

  // Get currently selected list of vocabulary items
  function getCurrentItems() {
    if (state.currentCategory === 'all') {
      return state.allCategories.flatMap(c => c.items);
    }
    const cat = state.allCategories.find(c => c.id === state.currentCategory);
    return cat ? cat.items : [];
  }

  // Render category pill navigation
  function renderCategoryPills() {
    DOM.categoryPills.innerHTML = '';

    // "All Words" pill
    const allTotal = state.allCategories.reduce((acc, c) => acc + c.items.length, 0);
    const allPill = document.createElement('button');
    allPill.className = `category-pill ${state.currentCategory === 'all' ? 'active' : ''}`;
    allPill.style.setProperty('--pill-color', '#FF4757');
    allPill.innerHTML = `
      <span class="pill-icon">🌈</span>
      <span class="pill-name">সব শব্দ (All)</span>
      <span class="pill-count">${allTotal}</span>
    `;
    allPill.addEventListener('click', () => {
      SoundFX.playPop();
      selectCategory('all');
    });
    DOM.categoryPills.appendChild(allPill);

    // Each individual category pill
    state.allCategories.forEach(cat => {
      const pill = document.createElement('button');
      pill.className = `category-pill ${state.currentCategory === cat.id ? 'active' : ''}`;
      pill.style.setProperty('--pill-color', cat.color);
      pill.innerHTML = `
        <span class="pill-icon">${cat.icon}</span>
        <span class="pill-name">${cat.titleBn} (${cat.title})</span>
        <span class="pill-count">${cat.items.length}</span>
      `;
      pill.addEventListener('click', () => {
        SoundFX.playPop();
        selectCategory(cat.id);
      });
      DOM.categoryPills.appendChild(pill);
    });
  }

  // ==================== KID CATEGORY PLAYGROUND PORTALS ====================
  function renderKidCategoryGrid() {
    if (!DOM.kidCategoryGrid) return;
    DOM.kidCategoryGrid.innerHTML = '';

    const categoryPreviews = [
      { id: 'fruits', title: 'Fruits', titleBn: 'ফলমূল', icon: '🍎', image: 'images/apple.png', count: 14, theme: 'cat-theme-fruits' },
      { id: 'animals', title: 'Animals', titleBn: 'পশুপাখি', icon: '🦁', image: 'images/lion.png', count: 7, theme: 'cat-theme-animals' },
      { id: 'birds', title: 'Birds', titleBn: 'পাখি', icon: '🦜', image: 'images/swan.png', count: 5, theme: 'cat-theme-birds' },
      { id: 'insects', title: 'Insects', titleBn: 'পোকামাকড়', icon: '🦋', image: 'images/butterfly.png', count: 5, theme: 'cat-theme-insects' },
      { id: 'flowers', title: 'Flowers', titleBn: 'সুন্দর ফুল', icon: '🌸', image: 'images/rose.png', count: 4, theme: 'cat-theme-flowers' },
      { id: 'vehicles', title: 'Vehicles', titleBn: 'যানবাহন', icon: '🚗', image: 'images/car.png', count: 6, theme: 'cat-theme-vehicles' },
      { id: 'household', title: 'My Home', titleBn: 'আমার ঘর', icon: '🛋️', image: 'images/bed.png', count: 9, theme: 'cat-theme-household' },
      { id: 'body_parts', title: 'Body Parts', titleBn: 'শরীরের অঙ্গ', icon: '🧍', image: 'images/face.png', count: 44, theme: 'cat-theme-body' },
      { id: 'nature', title: 'Nature', titleBn: 'সুন্দর প্রকৃতি', icon: '🌊', image: 'images/mountain.png', count: 8, theme: 'cat-theme-nature' },
      { id: 'games', title: 'Fun Games', titleBn: 'মজার খেলা', icon: '🎮', image: 'images/grapes.png', count: '৩টি খেলা', theme: 'cat-theme-games', isGames: true }
    ];

    categoryPreviews.forEach(cat => {
      const card = document.createElement('div');
      card.className = `kid-portal-card ${cat.theme}`;
      card.dataset.catId = cat.id;

      card.innerHTML = `
        <div class="kid-portal-shine"></div>
        <div class="kid-portal-badge">
          <span class="portal-badge-icon">${cat.icon}</span>
          <span class="portal-badge-count">${typeof cat.count === 'number' ? `${toBengaliDigits(cat.count)}টি ছবি` : cat.count}</span>
        </div>
        <div class="kid-portal-img-wrap">
          <img src="${cat.image}" alt="${cat.title}" loading="lazy" class="kid-portal-img">
        </div>
        <div class="kid-portal-title-box">
          <h3 class="kid-portal-bangla">${cat.titleBn}</h3>
          <span class="kid-portal-english">${cat.title}</span>
        </div>
        <div class="kid-portal-tap-hint">
          <span>ট্যাপ করো 👆</span>
        </div>
      `;

      card.addEventListener('click', () => {
        SoundFX.playPop();
        SoundFX.playCheer();
        Confetti.fire(45);

        if (cat.isGames) {
          switchMode('quiz');
        } else {
          selectCategory(cat.id);
          switchMode('cards');
          setCardsSubView('jumbo');
          const items = getCurrentItems();
          if (items.length > 0) {
            updateJumboStage(items[0], true);
          }
        }
      });

      DOM.kidCategoryGrid.appendChild(card);
    });
  }

  // ==================== UNIFIED MODE SWITCHER ====================
  function switchMode(mode) {
    state.currentMode = mode;

    // Update Tab UI
    DOM.modeTabs.forEach(t => {
      if (t.dataset.mode === mode) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Update Panels UI
    DOM.viewPanels.forEach(p => p.classList.remove('active'));
    const activePanel = document.getElementById(`view-${mode}`);
    if (activePanel) activePanel.classList.add('active');

    // Category pills bar visibility: hide in home mode to keep screen clean, show in cards mode
    if (DOM.categorySection) {
      DOM.categorySection.style.display = (mode === 'cards') ? 'block' : 'none';
    }

    // Scroll top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mode specific triggers
    if (mode === 'home') {
      setMascotMessage('হ্যালো ছোট্ট সোনা! চলো ছবি দেখে শিখি ও খেলি! 🎈');
    } else if (mode === 'cards') {
      renderCards();
      setCardsSubView('jumbo');
    } else if (mode === 'quiz') {
      startQuizQuestion();
    } else if (mode === 'speak') {
      loadSpeakingTarget();
    } else if (mode === 'match') {
      setupMemoryMatch();
    } else if (mode === 'autoplay') {
      startAutoplay();
    }

    // Pause autoplay if leaving autoplay mode
    if (mode !== 'autoplay' && state.autoplay.isPlaying) {
      pauseAutoplay();
    }
  }

  // Toggle between Jumbo 3D Book and All Cards Grid
  function setCardsSubView(subView) {
    if (!DOM.btnToggleJumbo || !DOM.btnToggleGrid) return;
    if (subView === 'jumbo') {
      DOM.btnToggleJumbo.classList.add('active');
      DOM.btnToggleGrid.classList.remove('active');
      if (DOM.jumboStage) DOM.jumboStage.style.display = 'block';
      if (DOM.gridViewContainer) DOM.gridViewContainer.style.display = 'none';
    } else {
      DOM.btnToggleGrid.classList.add('active');
      DOM.btnToggleJumbo.classList.remove('active');
      if (DOM.jumboStage) DOM.jumboStage.style.display = 'none';
      if (DOM.gridViewContainer) DOM.gridViewContainer.style.display = 'block';
      renderCards();
    }
  }

  function selectCategory(catId) {
    state.currentCategory = catId;
    renderCategoryPills();

    // Update Category Info Title & Count
    if (catId === 'all') {
      DOM.currentCatIcon.textContent = '🌈';
      DOM.currentCatTitle.textContent = 'সব শব্দ (All Vocabulary)';
      const total = state.allCategories.reduce((acc, c) => acc + c.items.length, 0);
      DOM.currentCatCount.textContent = `${total}টি শব্দ`;
      setMascotMessage('সব শব্দ একসাথে দেখতে পাচ্ছ! যেকোনো ছবিতে চাপ দাও 🎈');
    } else {
      const cat = state.allCategories.find(c => c.id === catId);
      if (cat) {
        DOM.currentCatIcon.textContent = cat.icon;
        DOM.currentCatTitle.textContent = `${cat.titleBn} (${cat.title})`;
        DOM.currentCatCount.textContent = `${cat.items.length}টি শব্দ`;
        setMascotMessage(`এখন আমরা শিখব ${cat.titleBn} (${cat.title})! কার্ডে ট্যাপ করো 🐻`);
      }
    }

    renderCards();
    const currentItems = getCurrentItems();
    if (currentItems.length > 0) {
      updateJumboStage(currentItems[0], false);
    }

    if (state.currentMode === 'quiz') startQuizQuestion();
    if (state.currentMode === 'speak') loadSpeakingTarget();
    if (state.currentMode === 'match') setupMemoryMatch();
    if (state.currentMode === 'autoplay' && state.autoplay.isPlaying) {
      state.autoplay.currentIndex = 0;
      playAutoplaySlide();
    }
  }

  // ==================== JUMBO 3D STAGE CONTROLLER ====================
  function toBengaliDigits(num) {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).replace(/[0-9]/g, d => bnDigits[parseInt(d, 10)]);
  }

  function updateJumboStage(item, autoSpeak = false) {
    if (!item) return;
    state.currentJumboItem = item;

    const items = getCurrentItems();
    const idx = items.findIndex(i => i.id === item.id);
    state.currentJumboIndex = idx >= 0 ? idx : 0;

    let catName = 'ফলমূল';
    let catIcon = '🍎';
    const cat = state.allCategories.find(c => c.items.some(i => i.id === item.id));
    if (cat) {
      catName = `${cat.titleBn} (${cat.title})`;
      catIcon = cat.icon;
    }

    if (DOM.jumboCatBadge) {
      DOM.jumboCatBadge.textContent = `${catIcon} ${catName}`;
    }
    if (DOM.jumboCounter) {
      DOM.jumboCounter.textContent = `${toBengaliDigits(state.currentJumboIndex + 1)} / ${toBengaliDigits(items.length)}`;
    }
    if (DOM.jumboImg) {
      DOM.jumboImg.src = item.image;
      DOM.jumboImg.alt = `${item.word} 3D`;
    }
    if (DOM.jumboWord) {
      DOM.jumboWord.textContent = item.word;
    }
    if (DOM.jumboSpellingPill) {
      DOM.jumboSpellingPill.textContent = item.word.toUpperCase().split('').join(' • ');
    }
    if (DOM.jumboPron) {
      DOM.jumboPron.textContent = item.pron;
    }
    if (DOM.jumboMeaning) {
      DOM.jumboMeaning.textContent = item.meaning;
    }
    if (DOM.jumboSentence) {
      DOM.jumboSentence.textContent = item.sentence || `Look at this ${item.word}!`;
    }

    // Reset mic feedback in Jumbo stage
    if (DOM.jumboMicFeedback) {
      DOM.jumboMicFeedback.style.display = 'none';
      DOM.jumboMicFeedback.textContent = '';
    }

    // Update active highlight on cards grid
    document.querySelectorAll('.word-card').forEach(c => {
      if (c.dataset.wordId === item.id) {
        c.classList.add('is-jumbo-active');
      } else {
        c.classList.remove('is-jumbo-active');
      }
    });

    if (autoSpeak) {
      SpeechEngine.speakBilingual(item.word, item.meaning);
      setMascotMessage(`${item.word} — ${item.meaning}!`);
    }
  }

  function handleJumboPrev() {
    const items = getCurrentItems();
    if (!items.length) return;
    SoundFX.playPop();
    state.currentJumboIndex = (state.currentJumboIndex - 1 + items.length) % items.length;
    updateJumboStage(items[state.currentJumboIndex], true);
  }

  function handleJumboNext() {
    const items = getCurrentItems();
    if (!items.length) return;
    SoundFX.playPop();
    state.currentJumboIndex = (state.currentJumboIndex + 1) % items.length;
    updateJumboStage(items[state.currentJumboIndex], true);
  }

  function handleJumboMic() {
    if (!state.currentJumboItem) return;
    const target = state.currentJumboItem.word;
    SoundFX.playPop();
    if (DOM.jumboMicFeedback) {
      DOM.jumboMicFeedback.style.display = 'block';
      DOM.jumboMicFeedback.innerHTML = `🎙️ শুনছি... মুখে বলো: <strong>"${target}"</strong>!`;
    }

    SpeechRecognizer.startListening(
      target,
      (spoken, isMatch) => {
        if (!DOM.jumboMicFeedback) return;
        if (isMatch) {
          SoundFX.playCorrect();
          SoundFX.playCheer();
          Confetti.fire(60);
          updateStars(2);
          DOM.jumboMicFeedback.innerHTML = `<span style="color:#10B981;">🎉 দারুণ হয়েছে! You said: <strong>"${spoken}"</strong>! ⭐ +২ স্টার</span>`;
          setMascotMessage(`সাবাশ! অসাধারণ উচ্চারণ করেছ: "${target}"! ⭐`, false);
        } else {
          SoundFX.playBoing();
          DOM.jumboMicFeedback.innerHTML = `<span style="color:#EF4444;">🙂 তুমি বলেছ: <em>"${spoken}"</em>। আবার সুন্দর করে বলো: <strong>"${target}"</strong>!</span>`;
          setMascotMessage(`আবার চেষ্টা করো বন্ধু! বলো "${target}" 🐻`, false);
        }
      },
      () => {}
    );
  }

  // Render flashcards grid
  function renderCards() {
    DOM.cardsGrid.innerHTML = '';
    const items = getCurrentItems();
    const query = state.searchQuery.toLowerCase().trim();

    const filtered = items.filter(item => {
      if (!query) return true;
      return item.word.toLowerCase().includes(query) ||
             item.pron.toLowerCase().includes(query) ||
             item.meaning.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
      DOM.cardsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #7F8C8D;">
          <h3>কোনো শব্দ পাওয়া যায়নি! অন্য কিছু লিখে খুঁজুন।</h3>
        </div>
      `;
      return;
    }

    filtered.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'word-card';
      card.dataset.wordId = item.id;
      if (state.currentJumboItem && state.currentJumboItem.id === item.id) {
        card.classList.add('is-jumbo-active');
      }
      card.style.setProperty('--card-theme', getCategoryColor(item));

      card.innerHTML = `
        <button class="card-speaker-badge" title="উচ্চারণ শোনো">🔊</button>
        <div class="card-img-wrap">
          <img src="${item.image}" alt="${item.word}" loading="lazy">
        </div>
        <h3 class="card-english">${item.word}</h3>
        <p class="card-pron">${item.pron}</p>
        <h4 class="card-bangla">${item.meaning}</h4>
        <div class="card-actions-mini">
          <button class="card-btn-mini listen-both">🔊 English + বাংলা</button>
          <button class="card-btn-mini listen-slow">🐢 ধীরে ধীরে</button>
        </div>
      `;

      // Click card body -> Select in Jumbo 3D Stage & Speak Bilingual!
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-btn-mini') || e.target.closest('.card-speaker-badge')) return;
        SoundFX.playPop();
        updateJumboStage(item, true);

        // Smooth scroll up to jumbo stage if needed
        if (DOM.jumboStage) {
          const rect = DOM.jumboStage.getBoundingClientRect();
          if (rect.top < -30 || rect.bottom < 120) {
            DOM.jumboStage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });

      // Quick Bilingual Audio: English first, then Bengali
      const speakerBadge = card.querySelector('.card-speaker-badge');
      const btnBoth = card.querySelector('.listen-both');
      [speakerBadge, btnBoth].forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          SoundFX.playPop();
          updateJumboStage(item, false);
          SpeechEngine.speakBilingual(item.word, item.meaning);
          setMascotMessage(`${item.word} — ${item.meaning}!`);
        });
      });

      // Slow Bilingual Audio
      const btnSlow = card.querySelector('.listen-slow');
      btnSlow.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.playPop();
        updateJumboStage(item, false);
        SpeechEngine.speakBilingual(item.word, item.meaning, true);
        setMascotMessage(`${item.word} — ${item.meaning} (ধীরে ধীরে)!`);
      });

      DOM.cardsGrid.appendChild(card);
    });
  }

  function getCategoryColor(item) {
    for (const c of state.allCategories) {
      if (c.items.some(i => i.id === item.id)) {
        return c.color;
      }
    }
    return '#FF4757';
  }

  // ==================== WORD MODAL ====================
  let currentModalItem = null;

  function openWordModal(item) {
    currentModalItem = item;
    const items = getCurrentItems();
    const idx = items.findIndex(i => i.id === item.id);
    state.currentWordIndex = idx >= 0 ? idx : 0;

    updateModalUI();
    DOM.wordModal.classList.add('active');

    // Auto pronounce word upon opening: First English, then Bengali meaning
    SpeechEngine.speakBilingual(item.word, item.meaning);
  }

  function updateModalUI() {
    const item = currentModalItem;
    if (!item) return;

    DOM.modalImg.src = item.image;
    DOM.modalWord.textContent = item.word;
    DOM.modalPron.textContent = item.pron;
    DOM.modalMeaning.textContent = item.meaning;
    DOM.modalSentence.textContent = item.sentence || `Look at the ${item.word}!`;
    DOM.modalMicTarget.textContent = `"${item.word}"`;
    DOM.modalMicFeedback.textContent = '';

    const items = getCurrentItems();
    DOM.modalCounter.textContent = `${state.currentWordIndex + 1} / ${items.length}`;
  }

  function closeModal() {
    DOM.wordModal.classList.remove('active');
  }

  // ==================== MODE 2: LISTEN & FIND QUIZ ====================
  function startQuizQuestion() {
    const items = getCurrentItems();
    if (items.length < 4) return;

    // Pick 1 correct item and 3 distractors
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const correct = shuffled[0];
    const options = shuffled.slice(0, 4).sort(() => 0.5 - Math.random());

    state.quiz.currentQuestion = { correct, options };
    state.quiz.answered = false;

    DOM.quizQuestionText.textContent = `বলো তো, কোনটি "${correct.word}"? (${correct.meaning})`;
    DOM.quizHint.textContent = `ছবিতে ট্যাপ করে সঠিক উত্তর বেছে নাও!`;
    DOM.quizFeedback.textContent = '';

    // Render options
    DOM.quizOptions.innerHTML = '';
    options.forEach(opt => {
      const optCard = document.createElement('div');
      optCard.className = 'quiz-option-card';
      optCard.innerHTML = `
        <img src="${opt.image}" alt="${opt.word}">
        <span class="option-word">${opt.word}</span>
      `;

      optCard.addEventListener('click', () => handleQuizAnswer(opt, optCard));
      DOM.quizOptions.appendChild(optCard);
    });

    // Voice announcement for kids: speaks English first, then Bengali meaning
    SpeechEngine.speakBilingual(correct.word, `${correct.meaning} কোথায়?`);
  }

  function handleQuizAnswer(selected, cardEl) {
    if (state.quiz.answered) return;
    state.quiz.answered = true;
    state.quiz.total++;

    const correct = state.quiz.currentQuestion.correct;
    if (selected.id === correct.id) {
      // Correct!
      cardEl.classList.add('correct');
      state.quiz.score++;
      state.quiz.streak++;
      updateStars(2);
      Confetti.fire(50);
      SoundFX.playCorrect();
      SoundFX.playCheer();

      DOM.quizFeedback.innerHTML = `<span style="color:#00B894;">🎉 দারুণ! একদম সঠিক! (${correct.word} - ${correct.meaning})</span>`;
      setMascotMessage(`সাবাশ! ${correct.word} মানে ${correct.meaning}! ⭐ +২ স্টার!`);
      // Celebratory bilingual voice feedback
      SpeechEngine.speakBilingual(correct.word, correct.meaning);

      setTimeout(() => {
        startQuizQuestion();
      }, 2000);
    } else {
      // Wrong
      cardEl.classList.add('wrong');
      state.quiz.streak = 0;
      SoundFX.playBoing();

      DOM.quizFeedback.innerHTML = `<span style="color:#FF7675;">হলো না! সঠিক উত্তরটি ছিল: ${correct.word} (${correct.meaning})</span>`;
      setMascotMessage(`একটু ভুল হয়েছে, চলো আবার চেষ্টা করি!`, true);

      setTimeout(() => {
        startQuizQuestion();
      }, 2000);
    }

    DOM.quizScore.textContent = `${state.quiz.score} / ${state.quiz.total}`;
    DOM.quizStreak.textContent = state.quiz.streak;
  }

  // ==================== MODE 3: SPEAK TO MASCOT ====================
  function loadSpeakingTarget() {
    const items = getCurrentItems();
    if (items.length === 0) return;

    if (state.speaking.currentIndex >= items.length) {
      state.speaking.currentIndex = 0;
    }

    const item = items[state.speaking.currentIndex];
    state.speaking.targetItem = item;

    DOM.speakTargetImg.src = item.image;
    DOM.speakTargetWord.textContent = item.word;
    DOM.speakTargetPron.textContent = `উচ্চারণ: ${item.pron}`;
    DOM.speakTargetMeaning.textContent = `অর্থ: ${item.meaning}`;
    DOM.speechStatus.textContent = 'মাইক বাটনে চাপ দিয়ে ইংরেজিতে উচ্চারণ করো!';
    DOM.speechResultBox.innerHTML = '';
  }

  function listenChildVoice() {
    const item = state.speaking.targetItem;
    if (!item) return;

    SoundFX.playPop();
    SpeechRecognizer.startListening(
      item.word,
      (spokenText, isMatch) => {
        if (isMatch) {
          Confetti.fire(60);
          SoundFX.playFanfare();
          updateStars(3);
          DOM.speechResultBox.innerHTML = `
            <span style="color: #00B894; font-size: 24px;">🏆 দারুণ উচ্চারণ! You said: "${spokenText}"! ⭐ +৩</span>
          `;
          setMascotMessage(`চমৎকার! তুমি খুব সুন্দর বলেছ: ${item.word}!`, true);
        } else {
          SoundFX.playBoing();
          DOM.speechResultBox.innerHTML = `
            <span style="color: #E17055;">তুমি বলেছ: "${spokenText}"। চলো আরেকবার চেষ্টা করি! বলো: "${item.word}"</span>
          `;
          setMascotMessage(`কাছাকাছি হয়েছ! আবার বলো: ${item.word}`, true);
        }
      },
      () => {
        DOM.speechStatus.textContent = 'আবার বলতে চাইলে মাইকে চাপ দাও!';
      }
    );
  }

  // ==================== MODE 4: MEMORY MATCH ====================
  function setupMemoryMatch() {
    const items = getCurrentItems();
    if (items.length < 6) return;

    // Pick 6 random items
    const selected = [...items].sort(() => 0.5 - Math.random()).slice(0, 6);
    // Create pairs (12 cards)
    const cardData = [];
    selected.forEach(item => {
      cardData.push({ id: item.id, item, type: 'img' });
      cardData.push({ id: item.id, item, type: 'word' });
    });
    // Shuffle
    cardData.sort(() => 0.5 - Math.random());

    state.match.cards = cardData;
    state.match.flippedCards = [];
    state.match.matchedPairs = 0;
    state.match.moves = 0;
    state.match.lockBoard = false;

    DOM.matchMoves.textContent = '0';
    DOM.matchPairs.textContent = '0 / 6';
    DOM.matchGrid.innerHTML = '';

    cardData.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.dataset.index = index;

      const backContent = data.type === 'img' 
        ? `<img src="${data.item.image}" alt="${data.item.word}">`
        : `<span style="font-size:16px; font-weight:700;">${data.item.word}</span><span style="font-size:11px; color:#FF4757;">${data.item.meaning}</span>`;

      card.innerHTML = `
        <div class="card-face card-front">❓</div>
        <div class="card-face card-back">
          ${backContent}
        </div>
      `;

      card.addEventListener('click', () => handleMemoryCardClick(card, data));
      DOM.matchGrid.appendChild(card);
    });

    setMascotMessage('একই জোড়ার কার্ড খুঁজে বের করো! 🧠✨');
  }

  function handleMemoryCardClick(cardEl, data) {
    if (state.match.lockBoard) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    SoundFX.playPop();
    cardEl.classList.add('flipped');
    state.match.flippedCards.push({ cardEl, data });

    // Say English first, then Bengali meaning when flipped
    SpeechEngine.speakBilingual(data.item.word, data.item.meaning);

    if (state.match.flippedCards.length === 2) {
      state.match.moves++;
      DOM.matchMoves.textContent = state.match.moves;
      checkMemoryMatch();
    }
  }

  function checkMemoryMatch() {
    state.match.lockBoard = true;
    const [c1, c2] = state.match.flippedCards;

    if (c1.data.id === c2.data.id) {
      // Match found!
      setTimeout(() => {
        c1.cardEl.classList.add('matched');
        c2.cardEl.classList.add('matched');
        state.match.matchedPairs++;
        DOM.matchPairs.textContent = `${state.match.matchedPairs} / 6`;
        state.match.flippedCards = [];
        state.match.lockBoard = false;
        SoundFX.playSparkle();

        if (state.match.matchedPairs === 6) {
          // Game Completed!
          Confetti.fire(80);
          SoundFX.playFanfare();
          updateStars(5);
          setMascotMessage('অসাধারণ! তুমি সব জোড়া মিলিয়ে ফেলেছ! 🏆 +৫ স্টার!', true);
        }
      }, 500);
    } else {
      // No match -> Flip back
      setTimeout(() => {
        c1.cardEl.classList.remove('flipped');
        c2.cardEl.classList.remove('flipped');
        state.match.flippedCards = [];
        state.match.lockBoard = false;
      }, 1000);
    }
  }

  // ==================== MODE 5: AUTOPLAY STORYBOOK ====================
  function startAutoplay() {
    state.autoplay.isPlaying = true;
    DOM.btnAutoplayPlaypause.textContent = '⏸️';
    playAutoplaySlide();
  }

  function pauseAutoplay() {
    state.autoplay.isPlaying = false;
    DOM.btnAutoplayPlaypause.textContent = '▶️';
    if (state.autoplay.timer) {
      clearTimeout(state.autoplay.timer);
    }
  }

  async function playAutoplaySlide() {
    if (!state.autoplay.isPlaying) return;
    const items = getCurrentItems();
    if (items.length === 0) return;

    if (state.autoplay.currentIndex >= items.length) {
      state.autoplay.currentIndex = 0;
    }

    const item = items[state.autoplay.currentIndex];
    DOM.autoplayImg.src = item.image;
    DOM.autoplayWord.textContent = item.word;
    DOM.autoplayPron.textContent = `উচ্চারণ: ${item.pron}`;
    DOM.autoplayMeaning.textContent = `অর্থ: ${item.meaning}`;
    DOM.autoplaySentence.textContent = item.sentence || `Look at this ${item.word}!`;

    const pct = ((state.autoplay.currentIndex + 1) / items.length) * 100;
    DOM.autoplayProgress.style.width = `${pct}%`;

    // Speaks English first, then Bengali meaning
    await SpeechEngine.speakBilingual(item.word, item.meaning);

    // Advance to next after 2.5 seconds if still playing
    if (state.autoplay.isPlaying) {
      state.autoplay.timer = setTimeout(() => {
        state.autoplay.currentIndex++;
        playAutoplaySlide();
      }, 2000);
    }
  }

  /* ==========================================================================
     EVENT LISTENERS & BINDINGS
     ========================================================================== */
  function setupEventListeners() {
    // Mode Switch Tabs
    DOM.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        SoundFX.playPop();
        const mode = tab.dataset.mode;
        switchMode(mode);
      });
    });

    // Back to Home Button
    if (DOM.btnBackHome) {
      DOM.btnBackHome.addEventListener('click', () => {
        SoundFX.playPop();
        switchMode('home');
      });
    }

    // Subview Home Buttons (for Quiz, Speak, Match, Autoplay)
    document.querySelectorAll('.btn-subview-home').forEach(btn => {
      btn.addEventListener('click', () => {
        SoundFX.playPop();
        switchMode('home');
      });
    });

    // View Toggles: Jumbo 3D Book vs All Cards Grid
    if (DOM.btnToggleJumbo) {
      DOM.btnToggleJumbo.addEventListener('click', () => {
        SoundFX.playPop();
        setCardsSubView('jumbo');
      });
    }
    if (DOM.btnToggleGrid) {
      DOM.btnToggleGrid.addEventListener('click', () => {
        SoundFX.playPop();
        setCardsSubView('grid');
      });
    }

    // Sound Toggle
    DOM.btnSoundToggle.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      DOM.soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    });

    // Mascot click Easter Egg
    DOM.mascotCharacter.addEventListener('click', () => {
      SoundFX.playSparkle();
      const funGreetings = [
        "আমি তোমার কথা বলা বন্ধু টিটু! 🐻",
        "তুমি প্রতিদিন নতুন নতুন শব্দ শিখছো, দারুণ! ⭐",
        "কোন শব্দটি তোমার সবচেয়ে পছন্দ? আমাকে বলো! 🎈",
        "চলো একসাথে ইংরেজি আর বাংলা শিখি! ✨"
      ];
      const g = funGreetings[Math.floor(Math.random() * funGreetings.length)];
      setMascotMessage(g, true);
    });

    // Search bar filter
    DOM.wordSearch.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderCards();
    });

    // Jumbo 3D Stage Interactive Events
    if (DOM.btnJumboTapTalk) {
      DOM.btnJumboTapTalk.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.jumboImg) {
      DOM.jumboImg.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playSparkle();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboBilingual) {
      DOM.btnJumboBilingual.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning);
          setMascotMessage(`${state.currentJumboItem.word} — ${state.currentJumboItem.meaning}!`);
        }
      });
    }

    if (DOM.btnJumboSlow) {
      DOM.btnJumboSlow.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speakBilingual(state.currentJumboItem.word, state.currentJumboItem.meaning, true);
          setMascotMessage(`${state.currentJumboItem.word} — ${state.currentJumboItem.meaning} (ধীরে ধীরে)!`);
        }
      });
    }

    if (DOM.btnJumboSpell) {
      DOM.btnJumboSpell.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.spellOut(state.currentJumboItem.word, state.currentJumboItem.meaning);
        }
      });
    }

    if (DOM.btnJumboSentence) {
      DOM.btnJumboSentence.addEventListener('click', () => {
        if (state.currentJumboItem) {
          SoundFX.playPop();
          SpeechEngine.speak(state.currentJumboItem.sentence || state.currentJumboItem.word);
        }
      });
    }

    if (DOM.btnJumboMic) {
      DOM.btnJumboMic.addEventListener('click', handleJumboMic);
    }

    if (DOM.btnJumboPrev) {
      DOM.btnJumboPrev.addEventListener('click', handleJumboPrev);
    }

    if (DOM.btnJumboNext) {
      DOM.btnJumboNext.addEventListener('click', handleJumboNext);
    }

    // Modal Events
    DOM.btnModalClose.addEventListener('click', closeModal);
    DOM.wordModal.addEventListener('click', (e) => {
      if (e.target === DOM.wordModal) closeModal();
    });

    if (DOM.btnModalSayBilingual) {
      DOM.btnModalSayBilingual.addEventListener('click', () => {
        if (currentModalItem) SpeechEngine.speakBilingual(currentModalItem.word, currentModalItem.meaning);
      });
    }

    DOM.btnModalSayEn.addEventListener('click', () => {
      if (currentModalItem) SpeechEngine.speakEnglish(currentModalItem.word);
    });

    DOM.btnModalSaySlow.addEventListener('click', () => {
      if (currentModalItem) SpeechEngine.speakBilingual(currentModalItem.word, currentModalItem.meaning, true);
    });

    DOM.btnModalSpelling.addEventListener('click', () => {
      if (currentModalItem) SpeechEngine.spellOut(currentModalItem.word, currentModalItem.meaning);
    });

    DOM.btnModalSaySentence.addEventListener('click', () => {
      if (currentModalItem && currentModalItem.sentence) {
        SpeechEngine.speakEnglish(currentModalItem.sentence);
      }
    });

    // Modal Speech Recognition practice
    DOM.btnModalTestMic.addEventListener('click', () => {
      if (!currentModalItem) return;
      DOM.modalMicFeedback.textContent = 'শুনছি... এখন বলো!';
      SpeechRecognizer.startListening(
        currentModalItem.word,
        (spokenText, isMatch) => {
          if (isMatch) {
            Confetti.fire(50);
            SoundFX.playFanfare();
            updateStars(2);
            DOM.modalMicFeedback.innerHTML = `<span style="color:#00B894;">🎉 দারুণ! You said "${spokenText}"! ⭐ +২</span>`;
          } else {
            SoundFX.playBoing();
            DOM.modalMicFeedback.innerHTML = `<span style="color:#FF7675;">তুমি বলেছ: "${spokenText}"। আরেকবার চেষ্টা করো!</span>`;
          }
        },
        () => {}
      );
    });

    // Modal Prev / Next Navigation
    DOM.btnModalPrev.addEventListener('click', () => {
      const items = getCurrentItems();
      if (items.length === 0) return;
      state.currentWordIndex = (state.currentWordIndex - 1 + items.length) % items.length;
      openWordModal(items[state.currentWordIndex]);
    });

    DOM.btnModalNext.addEventListener('click', () => {
      const items = getCurrentItems();
      if (items.length === 0) return;
      state.currentWordIndex = (state.currentWordIndex + 1) % items.length;
      openWordModal(items[state.currentWordIndex]);
    });

    // Quiz Controls
    DOM.btnQuizListen.addEventListener('click', () => {
      if (state.quiz.currentQuestion) {
        SpeechEngine.speakBilingual(state.quiz.currentQuestion.correct.word, state.quiz.currentQuestion.correct.meaning);
      }
    });

    DOM.btnQuizSkip.addEventListener('click', () => {
      SoundFX.playPop();
      startQuizQuestion();
    });

    // Speaking Practice Controls
    DOM.btnSpeakListen.addEventListener('click', () => {
      if (state.speaking.targetItem) {
        SpeechEngine.speakBilingual(state.speaking.targetItem.word, state.speaking.targetItem.meaning);
      }
    });

    DOM.btnMicListen.addEventListener('click', () => {
      listenChildVoice();
    });

    DOM.btnSpeakNext.addEventListener('click', () => {
      SoundFX.playPop();
      state.speaking.currentIndex++;
      loadSpeakingTarget();
    });

    // Memory Match Restart
    DOM.btnMatchRestart.addEventListener('click', () => {
      SoundFX.playPop();
      setupMemoryMatch();
    });

    // Autoplay Controls
    DOM.btnAutoplayPlaypause.addEventListener('click', () => {
      SoundFX.playPop();
      if (state.autoplay.isPlaying) {
        pauseAutoplay();
      } else {
        startAutoplay();
      }
    });

    DOM.btnAutoplayPrev.addEventListener('click', () => {
      SoundFX.playPop();
      const items = getCurrentItems();
      state.autoplay.currentIndex = (state.autoplay.currentIndex - 1 + items.length) % items.length;
      playAutoplaySlide();
    });

    DOM.btnAutoplayNext.addEventListener('click', () => {
      SoundFX.playPop();
      const items = getCurrentItems();
      state.autoplay.currentIndex = (state.autoplay.currentIndex + 1) % items.length;
      playAutoplaySlide();
    });

    // Settings Modal
    DOM.btnSettings.addEventListener('click', () => {
      SoundFX.playPop();
      DOM.settingsModal.classList.add('active');
    });

    DOM.btnSettingsClose.addEventListener('click', () => {
      DOM.settingsModal.classList.remove('active');
    });

    DOM.settingsModal.addEventListener('click', (e) => {
      if (e.target === DOM.settingsModal) {
        DOM.settingsModal.classList.remove('active');
      }
    });

    DOM.settingRate.addEventListener('input', (e) => {
      state.settings.rate = parseFloat(e.target.value);
    });

    DOM.settingPitch.addEventListener('input', (e) => {
      state.settings.pitch = parseFloat(e.target.value);
    });

    DOM.settingVoiceEn.addEventListener('change', (e) => {
      state.settings.voiceEn = SpeechEngine.voices.find(v => v.name === e.target.value);
    });

    DOM.settingVoiceBn.addEventListener('change', (e) => {
      state.settings.voiceBn = SpeechEngine.voices.find(v => v.name === e.target.value);
    });

    DOM.btnTestVoice.addEventListener('click', () => {
      SpeechEngine.speak("Hello little friend! Welcome to our book!");
    });

    // Keyboard navigation (Escape closes modal, Left/Right navigates)
    window.addEventListener('keydown', (e) => {
      if (document.activeElement === DOM.wordSearch) return;

      if (DOM.wordModal.classList.contains('active')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') DOM.btnModalPrev.click();
        if (e.key === 'ArrowRight') DOM.btnModalNext.click();
      } else if (state.currentMode === 'cards') {
        if (e.key === 'ArrowLeft') handleJumboPrev();
        if (e.key === 'ArrowRight') handleJumboNext();
      }
    });
  }

  // App Initialization
  function init() {
    SoundFX.init();
    SpeechEngine.init();
    SpeechRecognizer.init();
    Confetti.init();

    DOM.starCount.textContent = state.stars;

    renderCategoryPills();
    renderKidCategoryGrid();
    selectCategory('fruits');
    setupEventListeners();
    switchMode('home');

    console.log('Kids Interactive Talking Learning App initialized successfully!');
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
