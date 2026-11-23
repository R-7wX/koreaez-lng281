// LNG281 3-Hour Interactive Korean Study App Logic

const STORAGE_KEY = 'lng281_study_state_v1';
let state = loadState();
let speechRate = 0.95;
let timerInterval = null;
let currentVocabCat = 'ทั้งหมด';
let currentNumDrillMode = 'time';

// ==================== KOREAN TO THAI PRONUNCIATION ENGINE ====================
const CHO_TH = ['ค', 'ก', 'น', 'ท', 'ต', 'ร', 'ม', 'พ', 'ป', 'ซ', 'ซ', 'อ', 'ช', 'จ', 'ช', 'ค', 'ท', 'พ', 'ฮ'];
const CHO_MID = ['ก', 'ก', 'น', 'ด', 'ต', 'ร', 'ม', 'บ', 'ป', 'ซ', 'ซ', 'อ', 'จ', 'จ', 'ช', 'ค', 'ท', 'พ', 'ฮ'];
const JONG_TH = [
  '', 'ก', 'ก', 'ก', 'น', 'น', 'น', 'ด', 'ล', 'ก', 'ม', 'ล', 'ล', 'ล', 'ล', 'ล',
  'ม', 'บ', 'บ', 'ด', 'ด', 'ง', 'ด', 'ด', 'ก', 'ด', 'บ', 'ด'
];
const JONG_TO_CHO = {
  1: 0, 2: 1, 4: 2, 7: 3, 8: 5, 16: 6, 17: 7, 19: 9, 20: 10, 22: 12, 23: 14, 24: 15, 25: 16, 26: 17
};

const KR_READ_OVERRIDES = [
  ['안녕히 가세요', 'อัน-นยอง-ฮี กา-เซ-โย'],
  ['안녕히 계세요', 'อัน-นยอง-ฮี เค-เซ-โย'],
  ['안녕하세요', 'อัน-นยอง-ฮา-เซ-โย'],
  ['감사합니다', 'คัม-ซา-ฮัม-นี-ดา'],
  ['반갑습니다', 'พัน-กับ-ซึม-นี-ดา'],
  ['실례합니다', 'ชิล-เล-ฮัม-นี-ดา'],
  ['실례지만', 'ชิล-เล-จี-มัน'],
  ['좋아해요', 'โช-อา-แฮ-โย'],
  ['싫어해요', 'ชี-รอ-แฮ-โย'],
  ['있어요', 'อิด-ซอ-โย'],
  ['없어요', 'ออบ-ซอ-โย'],
  ['이에요', 'อี-เอ-โย'],
  ['예요', 'เย-โย'],
  ['아니에요', 'อา-นี-เอ-โย'],
  ['뭐예요', 'มวอ-เย-โย'],
  ['거예요', 'กอ-เย-โย'],
  ['여덟', 'ยอ-ดอล'],
  ['며칠', 'มยอ-ชิล'],
  ['몇', 'มยอด'],
  ['유월', 'ยู-วอล'],
  ['시월', 'ชี-วอล'],
  ['십일월', 'ชี-บี-รวอล'],
  ['십이월', 'ชี-บี-วอล'],
  ['전화번호', 'ชอน-ฮวา-บอน-โฮ'],
  ['핸드폰', 'แฮน-ดือ-พน'],
  ['한국어', 'ฮัน-กู-กอ'],
  ['일본어', 'อิล-โบ-นอ'],
  ['중국어', 'ชุง-กู-กอ'],
  ['영어', 'ยอง-ออ'],
  ['화장실', 'ฮวา-จัง-ชิล'],
  ['의사', 'อึย-ซา'],
  ['의자', 'อึย-จา'],
  ['사과', 'ซา-กวา'],
  ['고마워요', 'โค-มา-วอ-โย'],
  ['미안해요', 'มี-อัน-แฮ-โย'],
  ['맞아요', 'มา-จา-โย'],
  ['알아요', 'อา-รา-โย'],
  ['주세요', 'ชู-เซ-โย'],
  ['드릴까요', 'ทือ-ริล-กา-โย'],
  ['어디에', 'ออ-ดี-เอ'],
  ['어느', 'ออ-นือ'],
  ['얼마예요', 'ออล-มา-เย-โย'],
  ['생일', 'แซง-อิล'],
  ['축하합니다', 'ชุก-คา-ฮัม-นี-ดา'],
  ['할아버지', 'ฮา-รา-บอ-จี'],
  ['할머니', 'ฮัล-มอ-นี'],
  ['아버지', 'อา-บอ-จี'],
  ['어머니', 'ออ-มอ-นี'],
  ['부모님', 'พู-โม-นิม'],
  ['오빠', 'โอป-ป้า'],
  ['언니', 'ออน-นี่'],
  ['누나', 'นู-น่า'],
  ['남동생', 'นัม-ดง-แซง'],
  ['여동생', 'ยอ-ดง-แซง'],
  ['막내', 'มัง-แน'],
  ['학년', 'ฮัง-นยอน'],
  ['영화관', 'ยอง-ฮวา-กวัน'],
  ['도서관', 'โท-ซอ-กวัน'],
  ['우체국', 'อู-เช-กุก'],
  ['문구점', 'มุน-กู-จอม'],
  ['서점', 'ซอ-จอม'],
  ['식당', 'ชิก-ตัง'],
  ['병원', 'พยอง-วอน'],
  ['은행', 'อึน-แฮง'],
  ['회사원', 'ฮเว-ซา-วอน'],
  ['은행원', 'อึน-แฮง-วอน'],
  ['선생님', 'ซอน-แซง-นิม'],
  ['학생', 'ฮัก-แซง'],
  ['요리사', 'โย-รี-ซา'],
  ['간호사', 'คัน-โฮ-ซา'],
  ['컴퓨터', 'คอม-พยู-ทอ'],
  ['텔레비전', 'เทล-เล-บี-จอน'],
  ['냉장고', 'แนง-จัง-โก'],
  ['아메리카노', 'อา-เม-รี-คา-โน'],
  ['크루아상', 'คือ-รู-อา-ซัง'],
  ['샌드위치', 'แซน-ดือ-วี-ชี'],
  ['김치찌개', 'คิม-ชี-จี-แก'],
  ['된장찌개', 'ทเวน-จัง-จี-แก'],
  ['삼계탕', 'ซัม-กเย-ทัง'],
  ['비빔밥', 'พี-บิม-บับ'],
  ['냉면', 'แนง-มยอน'],
  ['불고기', 'พุล-โก-กี']
];

function syllableToThai(cho, jung, jong, isWordStart) {
  let c = isWordStart ? CHO_TH[cho] : CHO_MID[cho];
  // ㅅ before ㅣ/ㅑ/ㅕ/ㅛ/ㅠ sounds like ช
  if ((cho === 9 || cho === 10) && [2, 6, 12, 17, 20].includes(jung)) c = 'ช';
  const f = JONG_TH[jong];
  const hasF = f !== '';

  switch (jung) {
    case 0: return hasF ? `${c}ั${f}` : `${c}า`;           // ㅏ
    case 1: return `แ${c}${f}`;                              // ㅐ
    case 2: return hasF ? `${c}ั${f}` === `${c}ั${f}` ? (cho === 11 ? `ยั${f}` : `${c}ยั${f}`) : '' : (cho === 11 ? 'ยา' : `${c}ยา`); // ㅑ
    case 3: return cho === 11 ? `แย${f}` : `แ${c}ย${f}`;    // ㅒ
    case 4: return `${c}อ${f}`;                              // ㅓ
    case 5: return `เ${c}${f}`;                              // ㅔ
    case 6: return cho === 11 ? `ยอ${f}` : `${c}ยอ${f}`;    // ㅕ
    case 7: return cho === 11 ? `เย${f}` : `เ${c}ย${f}`;    // ㅖ
    case 8: return hasF ? `${c}${f === 'ง' || f === 'น' || f === 'ม' ? '' : 'โ'}${f}` : `โ${c}`; // ㅗ (fix below)
    case 9: return hasF ? `${c}วั${f}` : `${c}วา`;           // ㅘ
    case 10: return `แ${c}ว${f}`;                            // ㅙ
    case 11: return `เ${c}ว${f}`;                            // ㅚ
    case 12: return cho === 11 ? (hasF ? `ยง` : 'โย') : `โ${c}ย${f}`; // ㅛ
    case 13: return hasF ? `${c}ุ${f}` : `${c}ู`;            // ㅜ
    case 14: return `${c}วอ${f}`;                            // ㅝ
    case 15: return `เ${c}ว${f}`;                            // ㅞ
    case 16: return `${c}วี${f}`;                            // ㅟ
    case 17: return cho === 11 ? (hasF ? `ยุ${f}` : 'ยู') : `${c}ยู${f}`; // ㅠ
    case 18: return hasF ? `${c}ึ${f}` : `${c}ือ`;           // ㅡ
    case 19: return `${c}ึย${f}`;                            // ㅢ
    case 20: return hasF ? `${c}ิ${f}` : `${c}ี`;            // ㅣ
    default: return c + f;
  }
}

function hangulWordToThai(word) {
  const chars = [...word];
  const syls = chars.map(ch => {
    const code = ch.charCodeAt(0);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      const idx = code - 0xAC00;
      return {
        isKr: true,
        cho: Math.floor(idx / 588),
        jung: Math.floor((idx % 588) / 28),
        jong: idx % 28
      };
    }
    return { isKr: false, ch };
  });

  // Apply simple liaison (연음화): single batchim + ㅇ
  for (let i = 0; i < syls.length - 1; i++) {
    if (syls[i].isKr && syls[i + 1].isKr && syls[i].jong > 0 && syls[i + 1].cho === 11) {
      if (JONG_TO_CHO[syls[i].jong] !== undefined) {
        syls[i + 1].cho = JONG_TO_CHO[syls[i].jong];
        syls[i].jong = 0;
      }
    }
  }

  const out = [];
  for (let i = 0; i < syls.length; i++) {
    const s = syls[i];
    if (!s.isKr) { out.push(s.ch); continue; }
    // Fix ㅗ + batchim (e.g. 공 -> คง, 돈 -> ทน, 옷 -> โอด)
    let th = '';
    if (s.jung === 8 && s.jong > 0) {
      const c = i === 0 ? CHO_TH[s.cho] : CHO_MID[s.cho];
      th = `${c}${JONG_TH[s.jong]}`;
      if (s.cho === 11) th = `โ${c}${JONG_TH[s.jong]}`;
    } else if (s.jung === 12 && s.jong > 0) {
      const c = s.cho === 11 ? 'ย' : `${i === 0 ? CHO_TH[s.cho] : CHO_MID[s.cho]}ย`;
      th = `${c}${JONG_TH[s.jong]}`;
    } else {
      th = syllableToThai(s.cho, s.jung, s.jong, i === 0);
    }
    out.push(th);
  }
  return out.join('-').replace(/-([^ก-๛])-/g, '$1').replace(/-([.,?!])/g, '$1');
}

function hangulToThai(text) {
  if (!text || !/[가-힣]/.test(text)) return '';
  let s = String(text);
  // Replace known natural overrides with placeholders first
  const tokens = [];
  for (const [kr, th] of KR_READ_OVERRIDES) {
    if (s.includes(kr)) {
      const key = `§${tokens.length}§`;
      tokens.push(th);
      s = s.split(kr).join(key);
    }
  }
  // Convert remaining Hangul runs
  s = s.replace(/[가-힣]+/g, m => hangulWordToThai(m));
  // Restore placeholders
  tokens.forEach((th, idx) => {
    s = s.split(`§${idx}§`).join(th);
  });
  return s.replace(/\s+/g, ' ').trim();
}

function readTag(krText, block = false) {
  const th = hangulToThai(krText);
  if (!th) return '';
  return block
    ? `<span class="th-read-block">(${th})</span>`
    : `<span class="th-read">(${th})</span>`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return {
    secondsLeft: 3 * 3600,
    modulesDone: {},
    knownVocab: {},
    part1Answers: {},
    part2Answers: {},
    part3Correct: {}
  };
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  updateGlobalProgress();
}

// ==================== NATIVE KOREAN NEURAL AUDIO ENGINE ====================
let currentAudio = null;
let toastTimer = null;

function cleanAudioKey(text) {
  return String(text || '')
    .replace(/\[.*?\]/g, '')
    .replace(/🔊/g, '')
    .replace(/→/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function showAudioToast(label) {
  let toast = document.getElementById('audio-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'audio-toast';
    toast.className = 'audio-toast kr';
    document.body.appendChild(toast);
  }
  const short = label.length > 34 ? label.slice(0, 34) + '…' : label;
  const mean = typeof lookupWordThai === 'function' ? lookupWordThai(label) : '';
  const read = typeof hangulToThai === 'function' && label.length <= 20 ? hangulToThai(label) : '';
  let text = '🔊 ' + short;
  if (read && state.showReadings !== false) text += ` (${read})`;
  if (mean) text += ` = ${mean}`;
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

let sharedAudio = null;
let speakSeq = 0;

function stopAllAudio() {
  speakSeq++;
  if (sharedAudio) {
    try {
      sharedAudio.pause();
      sharedAudio.currentTime = 0;
    } catch (e) {}
  }
  document.querySelectorAll('audio').forEach(el => {
    try { el.pause(); } catch (e) {}
  });
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
}

function speakWithWebSpeech(text, rate, token) {
  if (token !== speakSeq) return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ko-KR';
  utter.rate = rate;
  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith('ko'));
  if (koVoice) utter.voice = koVoice;
  window.speechSynthesis.speak(utter);
}

function playSingleAudio(src, rate, token, onRealError) {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = 'auto';
  }
  sharedAudio.onended = null;
  sharedAudio.onerror = null;
  sharedAudio.src = src;
  sharedAudio.playbackRate = rate;
  sharedAudio.onerror = () => {
    if (token !== speakSeq) return;
    if (onRealError) onRealError();
  };
  const playPromise = sharedAudio.play();
  if (playPromise && typeof playPromise.catch === 'function') {
    playPromise.catch(err => {
      if (token !== speakSeq) return;
      if (err && err.name === 'AbortError') return;
      if (onRealError) onRealError();
    });
  }
}

function speak(text, rateOverride) {
  const clean = cleanAudioKey(text);
  if (!clean) return;
  const rate = rateOverride || speechRate;
  stopAllAudio();
  const token = speakSeq;
  showAudioToast(clean);

  const manifest = window.AUDIO_MANIFEST || {};
  const mp3Path = manifest[clean] || manifest[clean.replace(/[.?!]$/, '')] || manifest[clean + '.'];

  if (mp3Path) {
    playSingleAudio(mp3Path, rate, token, () => speakWithWebSpeech(clean, rate, token));
    return;
  }

  // Fallback for dynamic phrases (e.g., randomized Number Drills): Google TTS MP3 -> Web Speech API
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encodeURIComponent(clean)}`;
  playSingleAudio(ttsUrl, rate, token, () => speakWithWebSpeech(clean, rate, token));
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// Pause word audio if user plays Track 32 <audio>
document.addEventListener('play', (e) => {
  if (e.target && e.target.tagName === 'AUDIO') {
    speakSeq++;
    if (sharedAudio) {
      try { sharedAudio.pause(); } catch (err) {}
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (err) {}
    }
  }
}, true);

// Allow clicking ANY Korean text (.kr) across the entire page to hear it (never double-firing on buttons/onclick)
document.addEventListener('click', (e) => {
  if (e.target.closest('button, [onclick], input, a, summary, audio, .pos-card, .num-tile, .counter-chip, .month-chip, .vocab-card')) return;
  const krEl = e.target.closest('.kr');
  if (!krEl) return;
  const txt = krEl.textContent || '';
  const hangulOnly = txt.match(/[가-힣0-9\s.,?!~-]+/g);
  if (hangulOnly) {
    const joined = cleanAudioKey(hangulOnly.join(' '));
    if (/[가-힣]/.test(joined)) speak(joined);
  }
});

// ==================== NAVIGATION ====================
function switchTab(tabId) {
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === 'tab-' + tabId);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('.nav-tab').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Sub-pills for Grammar
document.querySelectorAll('#grammar-pills .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#grammar-pills .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.grammar-subpanel').forEach(p => {
      p.classList.toggle('active', p.id === btn.dataset.gpanel);
    });
  });
});

// Sub-pills for Exam Parts
document.querySelectorAll('#exam-part-pills .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#exam-part-pills .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.exam-subpanel').forEach(p => {
      p.classList.toggle('active', p.id === 'epart-' + btn.dataset.epart);
    });
  });
});

// Speed buttons
document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    speechRate = parseFloat(btn.dataset.rate);
    document.querySelectorAll('.speed-btn').forEach(b => {
      b.classList.toggle('btn-primary', b === btn);
      b.classList.toggle('btn-outline', b !== btn);
    });
  });
});

// ==================== 3-HOUR TIMER ====================
function formatTime(sec) {
  const h = String(Math.floor(sec / 3600)).padStart(2, '0');
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function updateTimerUI() {
  document.getElementById('countdown-display').textContent = formatTime(state.secondsLeft);
}

document.getElementById('timer-toggle').addEventListener('click', function () {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    this.textContent = 'เริ่มต่อ';
  } else {
    this.textContent = 'หยุดชั่วคราว';
    timerInterval = setInterval(() => {
      if (state.secondsLeft > 0) {
        state.secondsLeft--;
        updateTimerUI();
        if (state.secondsLeft % 5 === 0) saveState();
      } else {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    }, 1000);
  }
});

document.getElementById('timer-reset').addEventListener('click', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  state.secondsLeft = 3 * 3600;
  document.getElementById('timer-toggle').textContent = 'เริ่ม';
  updateTimerUI();
  saveState();
});

// ==================== DASHBOARD ROADMAP ====================
function markModuleDone(id) {
  state.modulesDone[id] = true;
  saveState();
  renderRoadmap();
}

function toggleModuleDone(id) {
  state.modulesDone[id] = !state.modulesDone[id];
  saveState();
  renderRoadmap();
}

function renderRoadmap() {
  const grid = document.getElementById('roadmap-grid');
  grid.innerHTML = ROADMAP_MODULES.map(m => {
    const done = !!state.modulesDone[m.id];
    return `
      <div class="roadmap-card ${done ? 'done' : ''}">
        <div>
          <div class="roadmap-time">${m.time}</div>
          <h4>${done ? '✅ ' : ''}${m.title}</h4>
          <ul class="roadmap-list">${m.items.map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
        <div class="roadmap-footer">
          <button class="btn-tiny ${done ? 'btn-teal' : 'btn-outline'}" onclick="toggleModuleDone('${m.id}')">
            ${done ? 'เรียนจบแล้ว ✓' : 'ติ๊กเมื่อจบ'}
          </button>
          <button class="btn-tiny btn-primary" onclick="switchTab('${m.tab}')">เปิดบทเรียน →</button>
        </div>
      </div>
    `;
  }).join('');
}

// ==================== POSITION SVG GENERATOR ====================
function getPositionSVG(type) {
  const desk = `<rect x="24" y="38" width="72" height="8" rx="2" fill="#8B6F4E"/><rect x="30" y="46" width="6" height="24" fill="#6E553A"/><rect x="84" y="46" width="6" height="24" fill="#6E553A"/>`;
  const bag = (x, y) => `<g transform="translate(${x},${y})"><rect x="0" y="4" width="18" height="16" rx="4" fill="#D94E4E"/><path d="M5,4 C5,-1 13,-1 13,4" fill="none" stroke="#9E2A2A" stroke-width="2.5"/></g>`;
  const box = `<path d="M26,34 L40,24 L94,24 L80,34 Z" fill="#E6D5B8" stroke="#9C7A4C" stroke-width="1.5"/><rect x="26" y="34" width="54" height="26" fill="#D8C29D" stroke="#9C7A4C" stroke-width="1.5"/><path d="M80,34 L94,24 L94,50 L80,60 Z" fill="#C2A77D" stroke="#9C7A4C" stroke-width="1.5"/>`;

  let inner = '';
  switch (type) {
    case 'top': inner = desk + bag(51, 18); break;
    case 'bottom': inner = desk + bag(51, 50); break;
    case 'front': inner = desk + bag(51, 54) + `<text x="60" y="16" text-anchor="middle" font-size="10" fill="#2B4C7E" font-weight="bold">ด้านหน้า</text>`; break;
    case 'back': inner = bag(51, 28) + desk + `<text x="60" y="16" text-anchor="middle" font-size="10" fill="#2B4C7E" font-weight="bold">ด้านหลัง</text>`; break;
    case 'side': inner = desk + bag(98, 48); break;
    case 'left': inner = desk + bag(4, 48) + `<text x="13" y="42" text-anchor="middle" font-size="11" fill="#D94E4E" font-weight="bold">←</text>`; break;
    case 'right': inner = desk + bag(98, 48) + `<text x="107" y="42" text-anchor="middle" font-size="11" fill="#D94E4E" font-weight="bold">→</text>`; break;
    case 'in': inner = box + `<rect x="44" y="25" width="18" height="12" rx="2" fill="#2B4C7E"/>`; break;
    case 'out': inner = box + `<rect x="98" y="46" width="16" height="11" rx="2" fill="#2B4C7E"/>`; break;
    case 'between': inner = `<rect x="12" y="24" width="24" height="36" rx="4" fill="#9BB1D4"/><rect x="84" y="24" width="24" height="36" rx="4" fill="#9BB1D4"/>` + bag(51, 34); break;
    case 'center': inner = `<rect x="16" y="14" width="88" height="50" rx="6" fill="none" stroke="#2B4C7E" stroke-dasharray="4 3" stroke-width="2"/>` + bag(51, 29); break;
    case 'across': inner = `<rect x="14" y="12" width="28" height="20" rx="3" fill="#9BB1D4"/><line x1="10" y1="40" x2="110" y2="40" stroke="#888" stroke-width="2" stroke-dasharray="6 4"/><rect x="78" y="48" width="28" height="20" rx="3" fill="#D94E4E"/>`; break;
  }
  return `<svg viewBox="0 0 120 74" width="120" height="74">${inner}</svg>`;
}

function renderGrammarSections() {
  // Position cards
  document.getElementById('position-cards-grid').innerHTML = POSITIONS.map(p => `
    <div class="pos-card" onclick="speak('${p.ex}')">
      <div class="pos-svg">${getPositionSVG(p.svg)}</div>
      <div class="pos-kr kr">${p.kr}</div>
      ${readTag(p.kr, true)}
      <div class="pos-th">${p.th}</div>
      <div class="muted kr" style="font-size:0.78rem;margin-top:4px">🔊 ${p.ex}</div>
      ${readTag(p.ex, true)}
    </div>
  `).join('');

  // Key Q&A
  document.getElementById('qa-list').innerHTML = KEY_QA.map(item => `
    <div class="qa-item">
      <div><button class="speak-btn" onclick="speak('${item.q}')">🔊</button> <strong class="kr">A: ${item.q}</strong> ${readTag(item.q)} <span class="muted">(${item.th})</span></div>
      ${buildWordBreakdownHTML(item.q)}
      <div style="margin-top:6px"><button class="speak-btn" onclick="speak('${item.a}')">🔊</button> <span class="kr">B: ${item.a}</span> ${readTag(item.a)}</div>
      ${buildWordBreakdownHTML(item.a)}
    </div>
  `).join('');

  initParticleDrill();
}

function initParticleDrill() {
  const shuffled = [...PARTICLE_DRILL_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
  const container = document.getElementById('particle-drill-container');
  container.innerHTML = shuffled.map((item, idx) => `
    <div class="mini-drill-item" id="mdrill-${idx}">
      <div class="mini-drill-q kr">${item.stem} ${readTag(item.stem)} ( ___ ) ${item.suffix} ${readTag(item.suffix)}</div>
      ${buildWordBreakdownHTML(item.stem + ' ' + item.suffix)}
      <div class="mini-drill-btns" style="margin-top:8px">
        ${item.options.map(opt => `
          <button class="mini-opt" data-val="${opt}" onclick="checkMiniDrill(${idx}, '${opt}', '${item.ans}', '${item.reason}', '${item.stem}${item.ans} ${item.suffix}')">${opt} ${readTag(opt)}</button>
        `).join('')}
      </div>
      <div class="mini-feedback" id="mdrill-fb-${idx}"></div>
    </div>
  `).join('');
}

function checkMiniDrill(idx, chosen, ans, reason, fullSentence) {
  const wrap = document.getElementById(`mdrill-${idx}`);
  wrap.querySelectorAll('.mini-opt').forEach(btn => {
    btn.disabled = true;
    const v = btn.dataset.val || btn.textContent.trim();
    if (v === ans) btn.classList.add('correct');
    else if (v === chosen) btn.classList.add('wrong');
  });
  const fb = document.getElementById(`mdrill-fb-${idx}`);
  fb.style.color = chosen === ans ? 'var(--teal)' : 'var(--coral)';
  fb.innerHTML = `${chosen === ans ? '✅ ถูกต้อง! ' : '❌ ผิด — '}${reason} <span class="kr">(${fullSentence} ${readTag(fullSentence)})</span>`;
  speak(fullSentence);
}

// ==================== HOUR 2: NUMBERS & INTERACTIVE DRILLS ====================
function renderNumberTables() {
  document.getElementById('native-num-grid').innerHTML = NATIVE_NUMBERS.map(n => `
    <div class="num-tile" onclick="speak('${n.kr}')">
      <div class="num-digit">${n.d}</div>
      <div class="num-word kr">${n.kr}</div>
      ${readTag(n.kr, true)}
      <div class="num-alt kr">${n.alt || '&nbsp;'}</div>
    </div>
  `).join('');

  document.getElementById('sino-num-grid').innerHTML = SINO_NUMBERS.map(n => `
    <div class="num-tile" onclick="speak('${n.kr.split('/')[0]}')">
      <div class="num-digit">${n.d}</div>
      <div class="num-word kr">${n.kr}</div>
      ${readTag(n.kr, true)}
      <div class="num-alt">${n.alt || '&nbsp;'}</div>
    </div>
  `).join('');

  document.getElementById('counters-grid').innerHTML = COUNTERS.map(c => `
    <div class="counter-chip" onclick="speak('${c.ex}')">
      <div class="counter-kr kr">${c.kr} ${readTag(c.kr)} <span style="font-size:0.72rem;color:var(--muted)">(${c.sys})</span></div>
      <div class="counter-th">${c.th}</div>
      <div class="kr" style="font-size:0.78rem;color:var(--primary)">🔊 ${c.ex} ${readTag(c.ex)}</div>
    </div>
  `).join('');

  document.getElementById('months-grid').innerHTML = MONTHS.map(m => `
    <div class="month-chip ${m.trap ? 'trap' : ''}" onclick="speak('${m.kr}')">
      <span>${m.num}월 (${m.th})</span>
      <div style="text-align:right"><strong class="kr">${m.kr}</strong>${readTag(m.kr, true)}</div>
    </div>
  `).join('');
}

// Number Drill Generators
const NATIVE_HR = ['', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두'];
const SINO_D = ['공', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];

function toSino(n) {
  if (n === 0) return '공';
  let out = '';
  const man = Math.floor(n / 10000);
  const remMan = n % 10000;
  const cheon = Math.floor(remMan / 1000);
  const remCheon = remMan % 1000;
  const baek = Math.floor(remCheon / 100);
  const remBaek = remCheon % 100;
  const sip = Math.floor(remBaek / 10);
  const il = remBaek % 10;

  if (man > 0) out += (man > 1 ? toSino(man) : '') + '만 ';
  if (cheon > 0) out += (cheon > 1 ? SINO_D[cheon] : '') + '천';
  if (baek > 0) out += (baek > 1 ? SINO_D[baek] : '') + '백';
  if (sip > 0) out += (sip > 1 ? SINO_D[sip] : '') + '십';
  if (il > 0) out += SINO_D[il];
  return out.trim();
}

function generateNumDrill(mode) {
  currentNumDrillMode = mode;
  let visual = '', prompt = '', correct = '', distractors = [], explain = '';

  if (mode === 'time') {
    const isPM = Math.random() > 0.5;
    const hr = Math.floor(Math.random() * 12) + 1;
    const mins = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const min = mins[Math.floor(Math.random() * mins.length)];
    const ampm = isPM ? '오후' : '오전';
    const wrongAmpm = isPM ? '오전' : '오후';
    visual = `${ampm} ${hr}:${String(min).padStart(2, '0')}`;
    prompt = '지금 몇 시예요? (เลือกคำอ่านเวลาที่ถูกต้อง)';
    correct = min === 0 ? `${ampm} ${NATIVE_HR[hr]} 시예요.` : `${ampm} ${NATIVE_HR[hr]} 시 ${toSino(min)} 분이에요.`;
    const wrongSinoHr = `${ampm} ${toSino(hr)} 시 ${min === 0 ? '' : toSino(min) + ' 분'}이에요.`;
    const wrongHrNum = hr === 12 ? 1 : hr + 1;
    const d2 = min === 0 ? `${wrongAmpm} ${NATIVE_HR[hr]} 시예요.` : `${wrongAmpm} ${NATIVE_HR[hr]} 시 ${toSino(min)} 분이에요.`;
    const d3 = `${ampm} ${NATIVE_HR[wrongHrNum]} 시 ${min === 0 ? '십 분이에요.' : toSino(min) + ' 분이에요.'}`;
    distractors = [wrongSinoHr, d2, d3];
    explain = `ชั่วโมง (${hr}시) ใช้เลขเกาหลี "${NATIVE_HR[hr]} 시" + นาที (${min}분) ใช้เลขจีน`;
  } else if (mode === 'price') {
    const prices = [1500, 3000, 4500, 5700, 7800, 9000, 12000, 15000, 17000, 25000, 34000, 50000, 76000];
    const p = prices[Math.floor(Math.random() * prices.length)];
    visual = `₩${p.toLocaleString()}`;
    prompt = '얼마예요? (ราคาเท่าไหร่ — ใช้เลขจีน + 원)';
    correct = `${toSino(p)} 원이에요.`;
    const alt1 = p >= 10000 ? `일${toSino(p)} 원이에요.` : `${toSino(p * 10)} 원이에요.`;
    const alt2 = `${toSino(p + 1000)} 원이에요.`;
    const alt3 = `${toSino(Math.max(500, p - 1000))} 원이에요.`;
    distractors = [alt1, alt2, alt3];
    explain = `₩${p.toLocaleString()} = ${toSino(p)} 원 (จำ: ห้ามใส่ 일 หน้า 백/천/만!)`;
  } else if (mode === 'date') {
    const trapBias = Math.random() < 0.45 ? (Math.random() < 0.5 ? 6 : 10) : (Math.floor(Math.random() * 12) + 1);
    const day = Math.floor(Math.random() * 28) + 1;
    const mObj = MONTHS[trapBias - 1];
    visual = `${trapBias}월 ${day}일`;
    prompt = '오늘이 며칠이에요? (เลือกคำอ่านเดือนและวันที่ที่ถูกต้อง)';
    correct = `${mObj.kr} ${toSino(day)}일이에요.`;
    const trapWrong = trapBias === 6 ? `육월 ${toSino(day)}일이에요.` : trapBias === 10 ? `십월 ${toSino(day)}일이에요.` : `${MONTHS[(trapBias % 12)].kr} ${toSino(day)}일이에요.`;
    const d2 = `${mObj.kr} ${toSino(day === 28 ? 18 : day + 1)}일이에요.`;
    const d3 = `${MONTHS[(trapBias + 1) % 12].kr} ${toSino(day)}일이에요.`;
    distractors = [trapWrong, d2, d3];
    explain = `${trapBias}월 = ${mObj.kr} ${mObj.trap ? '(⚠️ กับดักข้อสอบ! 6월=유월, 10월=시월)' : ''} + ${day}일 = ${toSino(day)}일`;
  } else if (mode === 'phone') {
    const mid = [5920, 5337, 2232, 4948, 9983][Math.floor(Math.random() * 5)];
    const end = [7245, 3010, 8073, 1287, 2312][Math.floor(Math.random() * 5)];
    const readDigits = s => String(s).split('').map(ch => SINO_D[Number(ch)]).join('');
    visual = `010-${mid}-${end}`;
    prompt = '전화번호가 몇 번이에요? (ขีดกลางอ่าน 에, เลข 0 อ่าน 공)';
    correct = `공일공에 ${readDigits(mid)}에 ${readDigits(end)}이에요.`;
    const d1 = `일공일에 ${readDigits(mid)}에 ${readDigits(end)}이에요.`;
    const d2 = `공일공에 ${readDigits(end)}에 ${readDigits(mid)}이에요.`;
    const d3 = `공일공에 ${readDigits(mid + 1)}에 ${readDigits(end)}이에요.`;
    distractors = [d1, d2, d3];
    explain = `010 (공일공) + 에 + ${mid} (${readDigits(mid)}) + 에 + ${end} (${readDigits(end)})`;
  } else {
    const items = [
      { icon: '🍎', name: '사과', unit: '개' },
      { icon: '☕', name: '커피', unit: '잔' },
      { icon: '🍜', name: '냉면', unit: '그릇' },
      { icon: '🥤', name: '콜라', unit: '병' },
      { icon: '📚', name: '책', unit: '권' },
      { icon: '🐱', name: '고양이', unit: '마리' },
      { icon: '🧑', name: '학생', unit: '명' }
    ];
    const it = items[Math.floor(Math.random() * items.length)];
    const cnt = [1, 2, 3, 4, 5, 6, 7, 8][Math.floor(Math.random() * 8)];
    visual = it.icon.repeat(cnt);
    prompt = `${it.name} — มีกี่${it.unit}? (ใช้เลขเกาหลีเปลี่ยนรูป + ลักษณะนาม)`;
    correct = `${it.name} ${NATIVE_HR[cnt]} ${it.unit} 있어요.`;
    const rawNative = ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟'][cnt];
    const d1 = cnt <= 4 ? `${it.name} ${rawNative} ${it.unit} 있어요.` : `${it.name} ${toSino(cnt)} ${it.unit} 있어요.`;
    const d2 = `${it.name} ${NATIVE_HR[cnt === 8 ? 7 : cnt + 1]} ${it.unit} 있어요.`;
    const wrongUnit = it.unit === '개' ? '명' : '개';
    const d3 = `${it.name} ${NATIVE_HR[cnt]} ${wrongUnit} 있어요.`;
    distractors = [d1, d2, d3];
    explain = `นับ ${it.name} ใช้ลักษณะนาม "${it.unit}" และเลข ${cnt} หน้าลักษณะนามคือ "${NATIVE_HR[cnt]}"`;
  }

  const allChoices = [correct, ...distractors].filter((v, i, a) => a.indexOf(v) === i);
  while (allChoices.length < 4) allChoices.push(correct + ' ');
  const shuffled = allChoices.sort(() => Math.random() - 0.5);

  const stage = document.getElementById('num-drill-stage');
  const promptKr = (prompt.match(/[가-힣0-9]+(?:\s+[가-힣0-9]+)*/g) || []).join(' ');
  stage.innerHTML = `
    <div class="drill-visual">${visual}</div>
    <div class="drill-prompt">${prompt} ${promptKr ? readTag(promptKr) : ''}</div>
    ${promptKr ? `<div style="max-width:680px;margin:0 auto 12px;text-align:left">${buildWordBreakdownHTML(promptKr)}</div>` : ''}
    <div class="drill-choices">
      ${shuffled.map((ch, i) => `
        <button class="choice-btn kr" data-idx="${i}" data-val="${ch}">${ch}${readTag(ch, true)}</button>
      `).join('')}
    </div>
    <div id="num-drill-fb" class="drill-feedback"></div>
    <div style="display:flex;justify-content:center;gap:10px">
      <button class="btn-tiny btn-outline" onclick="speak('${correct}')">🔊 ฟังเสียงเฉลย</button>
      <button class="btn btn-primary" onclick="generateNumDrill('${mode}')">สุ่มข้อถัดไป →</button>
    </div>
  `;

  stage.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      stage.querySelectorAll('.choice-btn').forEach(b => {
        b.disabled = true;
        if (b.dataset.val === correct) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      const fb = document.getElementById('num-drill-fb');
      if (btn.dataset.val === correct) {
        fb.style.color = 'var(--teal)';
        fb.textContent = '✅ ถูกต้อง! ' + explain;
      } else {
        fb.style.color = 'var(--coral)';
        fb.textContent = '❌ ยังไม่ถูก — เฉลย: ' + explain;
      }
      speak(correct);
    });
  });
}

document.querySelectorAll('#num-drill-tabs .pill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#num-drill-tabs .pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    generateNumDrill(btn.dataset.ndrill);
  });
});

// ==================== VOCABULARY FLASHCARDS ====================
function renderVocabCategories() {
  const cats = ['ทั้งหมด', ...new Set(VOCAB_DATA.map(v => v.cat))];
  document.getElementById('vocab-category-pills').innerHTML = cats.map(c => `
    <button class="pill ${c === currentVocabCat ? 'active' : ''}" onclick="setVocabCat('${c}')">${c}</button>
  `).join('');
}

function setVocabCat(cat) {
  currentVocabCat = cat;
  renderVocabCategories();
  renderVocabGrid();
}

function renderVocabGrid() {
  const q = document.getElementById('vocab-search').value.trim().toLowerCase();
  const hideKnown = document.getElementById('vocab-hide-known').checked;

  const list = VOCAB_DATA.filter(v => {
    if (currentVocabCat !== 'ทั้งหมด' && v.cat !== currentVocabCat) return false;
    if (hideKnown && state.knownVocab[v.kr]) return false;
    if (q && !v.kr.toLowerCase().includes(q) && !v.th.toLowerCase().includes(q)) return false;
    return true;
  });

  const masteredCount = Object.values(state.knownVocab).filter(Boolean).length;
  document.getElementById('vocab-count-label').textContent = `แสดง ${list.length} / ${VOCAB_DATA.length} คำ`;
  document.getElementById('vocab-mastered-label').textContent = `จำได้แล้ว ${masteredCount} / ${VOCAB_DATA.length} คำ`;

  document.getElementById('vocab-grid').innerHTML = list.map(v => {
    const known = !!state.knownVocab[v.kr];
    return `
      <div class="vocab-card ${known ? 'known' : ''}" onclick="toggleVocabReveal(this)">
        <div class="vocab-top">
          <span class="vocab-cat">${v.cat}</span>
          <button class="speak-btn" onclick="event.stopPropagation(); speak('${v.kr}')">🔊</button>
        </div>
        <div class="vocab-kr kr">${v.kr}</div>
        ${readTag(v.kr, true)}
        <div class="vocab-meaning" data-meaning="${v.th}">${v.th}</div>
        <div class="vocab-actions">
          <button class="btn-tiny ${known ? 'btn-teal' : 'btn-outline'}" onclick="event.stopPropagation(); toggleKnownVocab('${v.kr}')">
            ${known ? '✅ จำได้แล้ว' : 'ติ๊กเมื่อจำได้'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function toggleVocabReveal(card) {
  const m = card.querySelector('.vocab-meaning');
  if (m.classList.contains('hidden-meaning')) {
    m.classList.remove('hidden-meaning');
    m.textContent = m.dataset.meaning;
  } else {
    m.classList.add('hidden-meaning');
    m.textContent = 'แตะเพื่อดูคำแปล';
  }
}

function toggleKnownVocab(kr) {
  state.knownVocab[kr] = !state.knownVocab[kr];
  saveState();
  renderVocabGrid();
}

document.getElementById('vocab-search').addEventListener('input', renderVocabGrid);
document.getElementById('vocab-hide-known').addEventListener('change', renderVocabGrid);

// ==================== HOUR 3: MOCK EXAM (ALL 3 PARTS) ====================
function renderPart1Listening() {
  const container = document.getElementById('listening-quiz-list');
  container.innerHTML = LISTENING_QUIZ.map(item => {
    const saved = state.part1Answers[item.id];
    const answered = saved !== undefined;
    const isCorrect = saved === item.ans;
    return `
      <div class="quiz-item">
        <div class="quiz-q-head">
          <div>
            <div class="muted" style="font-weight:700">${item.title}</div>
            <div class="quiz-q-text">${item.question}</div>
          </div>
          <button class="btn btn-primary" onclick="speak('${item.script.replace(/'/g, "\\'")}')">🔊 ฟังบทสนทนา</button>
        </div>
        <div class="quiz-options">
          ${item.options.map((opt, idx) => {
            let cls = 'choice-btn';
            if (answered) {
              if (idx === item.ans) cls += ' correct';
              else if (idx === saved) cls += ' wrong';
            }
            return `<button class="${cls}" ${answered ? 'disabled' : ''} onclick="answerPart1('${item.id}', ${idx})">${String.fromCharCode(65 + idx)}. ${opt}</button>`;
          }).join('')}
        </div>
        <div class="quiz-explain ${answered ? 'show ' + (isCorrect ? 'ok' : 'bad') : ''}">
          <strong>${isCorrect ? '✅ ถูกต้อง!' : '❌ ยังไม่ถูก'}</strong> — ${item.explain}<br/>
          <span class="kr"><strong>สคริปต์:</strong> ${item.script}</span> ${readTag(item.script, true)}
          ${buildWordBreakdownHTML(item.script)}
        </div>
      </div>
    `;
  }).join('');
}

function answerPart1(id, idx) {
  state.part1Answers[id] = idx;
  saveState();
  renderPart1Listening();
  updateExamScore();
}

function resetPart1() {
  state.part1Answers = {};
  saveState();
  renderPart1Listening();
  updateExamScore();
}

function resetAllExam() {
  state.part1Answers = {};
  state.part2Answers = {};
  state.part3Correct = {};
  saveState();
  renderPart1Listening();
  renderPart2Quiz();
  renderPart3Writing();
  updateExamScore();
}

function renderPart2Quiz() {
  const container = document.getElementById('part2-quiz-list');
  container.innerHTML = PART2_QUIZ.map((item, qIdx) => {
    const saved = state.part2Answers[qIdx];
    const answered = saved !== undefined;
    const isCorrect = saved === item.ans;
    const krMatches = item.q.match(/[가-힣0-9\s.,?!-]+/g);
    const krPrompt = krMatches ? cleanAudioKey(krMatches.join(' ')) : '';
    const hasKr = /[가-힣]/.test(krPrompt);
    return `
      <div class="quiz-item">
        <div class="quiz-q-head">
          <div class="quiz-q-text kr">${item.q}</div>
          ${hasKr ? `<button class="speak-btn" onclick="speak('${krPrompt.replace(/'/g, "\\'")}')">🔊</button>` : ''}
        </div>
        ${hasKr ? buildWordBreakdownHTML(krPrompt) : ''}
        <div class="quiz-options">
          ${item.opts.map((opt, oIdx) => {
            let cls = 'choice-btn kr';
            if (answered) {
              if (oIdx === item.ans) cls += ' correct';
              else if (oIdx === saved) cls += ' wrong';
            }
            return `<button class="${cls}" ${answered ? 'disabled' : ''} onclick="answerPart2(${qIdx}, ${oIdx})">${oIdx + 1}) ${opt}${/[가-힣]/.test(opt) ? readTag(opt, true) : ''}</button>`;
          }).join('')}
        </div>
        <div class="quiz-explain ${answered ? 'show ' + (isCorrect ? 'ok' : 'bad') : ''}">
          <strong>${isCorrect ? '✅ ถูกต้อง!' : '❌ ผิด'}</strong> — ${item.exp}
        </div>
      </div>
    `;
  }).join('');
}

function answerPart2(qIdx, oIdx) {
  state.part2Answers[qIdx] = oIdx;
  const opt = PART2_QUIZ[qIdx].opts[oIdx];
  if (/[가-힣]/.test(opt)) speak(opt);
  saveState();
  renderPart2Quiz();
  updateExamScore();
}

function resetPart2() {
  state.part2Answers = {};
  saveState();
  renderPart2Quiz();
  updateExamScore();
}

function renderPart3Writing() {
  const container = document.getElementById('part3-writing-list');
  container.innerHTML = PART3_WRITING.map(item => {
    const visualHTML = item.visual.startsWith('SVG:')
      ? getPositionSVG(item.visual.replace('SVG:', ''))
      : item.visual;
    const solved = !!state.part3Correct[item.id];
    return `
      <div class="writing-card" id="wcard-${item.id}">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="bp-tag bp-write">${item.tag}</span>
          <span id="wbadge-${item.id}">${solved ? '✅ ผ่านแล้ว' : ''}</span>
        </div>
        <div class="writing-visual">${visualHTML}</div>
        <div style="font-weight:700;font-size:0.94rem" class="kr">${item.prompt}</div>
        ${buildWordBreakdownHTML(item.prompt)}
        <div class="writing-input-row">
          <input type="text" class="writing-input" id="winput-${item.id}" placeholder="${item.placeholder}" onkeydown="if(event.key==='Enter') checkWriting('${item.id}')" />
          <button class="btn-tiny btn-primary" onclick="checkWriting('${item.id}')">ตรวจ</button>
        </div>
        <div class="helper-chips">
          ${item.helpers.map(h => {
            const hm = lookupWordThai(h);
            return `<button class="helper-chip" onclick="appendHelper('${item.id}', '${h}')">+ ${h} ${readTag(h)}${hm ? `<span class="wb-th" style="margin-left:3px">(${hm})</span>` : ''}</button>`;
          }).join('')}
          <button class="helper-chip" style="color:var(--coral)" onclick="document.getElementById('winput-${item.id}').value=''">ล้าง</button>
        </div>
        <div id="wfb-${item.id}" class="quiz-explain"></div>
      </div>
    `;
  }).join('');
}

function appendHelper(id, text) {
  const inp = document.getElementById('winput-' + id);
  const cur = inp.value.trim();
  const joiner = cur && !['할', '아', '버', '지', '머', '니', '일', '이', '오', '구', '공', '영'].includes(text) ? ' ' : '';
  inp.value = cur ? cur + joiner + text : text;
  inp.focus();
  speak(text);
}

function normalizeKr(str) {
  return str.trim().replace(/\s+/g, ' ').replace(/[.?!]$/, '');
}

function checkWriting(id) {
  const item = PART3_WRITING.find(w => w.id === id);
  const inp = document.getElementById('winput-' + id);
  const val = normalizeKr(inp.value);
  const valNoSpace = val.replace(/\s+/g, '');
  const ok = item.answers.some(a => {
    const na = normalizeKr(a);
    return na === val || na.replace(/\s+/g, '') === valNoSpace;
  });

  const fb = document.getElementById('wfb-' + id);
  fb.className = 'quiz-explain show ' + (ok ? 'ok' : 'bad');
  if (ok) {
    state.part3Correct[id] = true;
    saveState();
    document.getElementById('wbadge-' + id).textContent = '✅ ผ่านแล้ว';
    fb.innerHTML = `<strong>✅ ถูกต้องเป๊ะ!</strong> เฉลย: <span class="kr">${item.displayAns}</span> ${readTag(item.displayAns)} <button class="speak-chip" onclick="speak('${item.displayAns.split('/')[0]}')">🔊 ฟัง</button>${buildWordBreakdownHTML(item.displayAns.split('/')[0])}`;
  } else {
    fb.innerHTML = `<strong>❌ ลองดูเฉลย:</strong> <span class="kr">${item.displayAns}</span> ${readTag(item.displayAns)} <button class="speak-chip" onclick="speak('${item.displayAns.split('/')[0]}')">🔊 ฟัง</button>${buildWordBreakdownHTML(item.displayAns.split('/')[0])}`;
  }
  updateExamScore();
}

function resetPart3() {
  state.part3Correct = {};
  saveState();
  renderPart3Writing();
  updateExamScore();
}

// ==================== PROGRESS & SCORE ====================
function updateExamScore() {
  const p1 = LISTENING_QUIZ.filter(q => state.part1Answers[q.id] === q.ans).length;
  const p2 = PART2_QUIZ.filter((q, i) => state.part2Answers[i] === q.ans).length;
  const p3 = PART3_WRITING.filter(w => state.part3Correct[w.id]).length;
  document.getElementById('exam-total-score').textContent = `${p1 + p2 + p3} / 60`;
}

function updateGlobalProgress() {
  const modPct = (Object.values(state.modulesDone).filter(Boolean).length / 3) * 30;
  const vocabPct = (Object.values(state.knownVocab).filter(Boolean).length / VOCAB_DATA.length) * 20;
  const p1 = LISTENING_QUIZ.filter(q => state.part1Answers[q.id] === q.ans).length;
  const p2 = PART2_QUIZ.filter((q, i) => state.part2Answers[i] === q.ans).length;
  const p3 = PART3_WRITING.filter(w => state.part3Correct[w.id]).length;
  const examPct = ((p1 + p2 + p3) / 60) * 50;
  const total = Math.min(100, Math.round(modPct + vocabPct + examPct));
  document.getElementById('global-progress-pct').textContent = `${total}%`;
}

// ==================== READING TOGGLE & STATIC READINGS ====================
function enhanceAllKoreanContent(root = document) {
  // 1. Wrap hardcoded Thai pronunciation parentheses inside #tab-easy so the toggle hides them too
  root.querySelectorAll('#tab-easy .speak-chip, #tab-easy .muted').forEach(el => {
    if (el.dataset.wrappedEasy) return;
    el.innerHTML = el.innerHTML.replace(/(\([ก-๛]+(?:[\s-][ก-๛]+)*(?:\s*→\s*[^)]+)?(?:\s*\/\s*[^)]+)?\))/g, '<span class="th-read">$1</span>');
    el.dataset.wrappedEasy = '1';
  });

  // 2. Add Thai readings to ALL static Korean elements across ALL tabs that don't already have Thai readings
  const readSelectors = [
    '.speak-chip',
    '.study-table td.kr',
    '.study-table strong.kr',
    '.study-table .badge-teal.kr',
    '.study-table .badge-coral.kr',
    '.formula-box .kr',
    '.note-box .kr',
    '.example-list .kr',
    '.passage-kr',
    '.trap-item .kr',
    '.script-grid p',
    '.track32-header h3',
    '.g-box .speak-chip'
  ].join(', ');

  root.querySelectorAll(readSelectors).forEach(el => {
    if (el.dataset.readInjected) return;
    if (el.querySelector('.th-read, .th-read-block')) { el.dataset.readInjected = '1'; return; }
    const txt = el.textContent || '';
    if (!/[가-힣]/.test(txt)) return;
    if (/\([ก-๛]+-[ก-๛]+/.test(txt)) { el.dataset.readInjected = '1'; return; }
    const krParts = txt.match(/[가-힣]+(?:\s+[가-힣]+)*/g);
    if (!krParts) return;
    const th = hangulToThai(krParts.join(' / '));
    if (!th) return;
    const span = document.createElement('span');
    span.className = el.classList.contains('passage-kr') ? 'th-read-block' : 'th-read';
    span.textContent = `(${th})`;
    el.appendChild(span);
    el.dataset.readInjected = '1';
  });

  // 3. Inject word-by-word breakdowns on ALL sentence blocks across Grammar, Numbers, Track 32, Easy, and Guided
  const wbSelectors = [
    '#tab-grammar .example-list li',
    '#tab-grammar .passage-kr',
    '#tab-grammar .formula-box > div',
    '#tab-grammar .note-box',
    '#tab-grammar .rules-list li',
    '#tab-numbers .note-box',
    '.script-grid p',
    '#tab-easy .recipe-box',
    '.track32-header h3'
  ].join(', ');

  root.querySelectorAll(wbSelectors).forEach(el => {
    if (el.dataset.wbInjected) return;
    if (el.querySelector('.wb-strip')) { el.dataset.wbInjected = '1'; return; }
    const krParts = (el.textContent || '').match(/[가-힣0-9]+(?:\s+[가-힣0-9]+)*/g);
    if (!krParts) return;
    const joined = krParts.join(' ');
    if (!/[가-힣]/.test(joined)) return;
    const html = buildWordBreakdownHTML(joined);
    if (html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      el.appendChild(div.firstElementChild);
      el.dataset.wbInjected = '1';
    }
  });
}

function injectStaticReadings() {
  enhanceAllKoreanContent(document);
}

function applyReadingToggleUI() {
  const show = state.showReadings !== false;
  document.body.classList.toggle('hide-readings', !show);
  const readingBtn = document.getElementById('reading-toggle');
  if (readingBtn) {
    readingBtn.textContent = show ? '🔤 คำอ่านไทย: เปิด' : '🔤 คำอ่านไทย: ปิด';
    readingBtn.classList.toggle('btn-teal', show);
    readingBtn.classList.toggle('btn-outline', !show);
  }
}

function applyGlossaryToggleUI() {
  const show = state.showGlossary !== false;
  document.body.classList.toggle('hide-glossary', !show);
  const glossBtn = document.getElementById('glossary-toggle');
  if (glossBtn) {
    glossBtn.textContent = show ? '📖 แปลทีละคำ: เปิด' : '📖 แปลทีละคำ: ปิด';
    glossBtn.classList.toggle('btn-primary', show);
    glossBtn.classList.toggle('btn-outline', !show);
  }
}

const readingBtn = document.getElementById('reading-toggle');
if (readingBtn) {
  readingBtn.addEventListener('click', () => {
    state.showReadings = state.showReadings === false ? true : false;
    saveState();
    applyReadingToggleUI();
  });
}

const glossBtn = document.getElementById('glossary-toggle');
if (glossBtn) {
  glossBtn.addEventListener('click', () => {
    state.showGlossary = state.showGlossary === false ? true : false;
    saveState();
    applyGlossaryToggleUI();
  });
}

// ==================== INIT ====================
updateTimerUI();
renderRoadmap();
renderGrammarSections();
renderNumberTables();
generateNumDrill('time');
renderVocabCategories();
renderVocabGrid();
renderPart1Listening();
renderPart2Quiz();
renderPart3Writing();
injectStaticReadings();
applyReadingToggleUI();
applyGlossaryToggleUI();
updateExamScore();
updateGlobalProgress();
