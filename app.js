// LNG281 3-Hour Interactive Korean Study App Logic

const STORAGE_KEY = 'lng281_study_state_v1';
let state = loadState();
let speechRate = 0.95;
let timerInterval = null;
let currentVocabCat = 'ทั้งหมด';
let currentNumDrillMode = 'time';

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
  toast.textContent = '🔊 ' + (label.length > 36 ? label.slice(0, 36) + '…' : label);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function speakWithWebSpeech(text, rate) {
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

function speak(text, rateOverride) {
  const clean = cleanAudioKey(text);
  if (!clean) return;
  const rate = rateOverride || speechRate;
  showAudioToast(clean);

  if (currentAudio) {
    try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
    currentAudio = null;
  }
  if ('speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }

  const manifest = window.AUDIO_MANIFEST || {};
  const mp3Path = manifest[clean] || manifest[clean.replace(/[.?!]$/, '')] || manifest[clean + '.'];

  if (mp3Path) {
    const audio = new Audio(mp3Path);
    audio.playbackRate = rate;
    currentAudio = audio;
    audio.play().catch(() => speakWithWebSpeech(clean, rate));
    return;
  }

  // Fallback for dynamic phrases (e.g., randomized Number Drills): Google TTS MP3 -> Web Speech API
  const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encodeURIComponent(clean)}`;
  const fallbackAudio = new Audio(ttsUrl);
  fallbackAudio.playbackRate = rate;
  currentAudio = fallbackAudio;
  fallbackAudio.play().catch(() => speakWithWebSpeech(clean, rate));
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {};
}

// Allow clicking ANY Korean text (.kr) across the entire page to hear it!
document.addEventListener('click', (e) => {
  if (e.target.closest('button, input, a, summary, audio, .pos-card, .num-tile, .counter-chip, .month-chip, .vocab-card')) return;
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
      <div class="pos-th">${p.th}</div>
      <div class="muted kr" style="font-size:0.78rem;margin-top:4px">🔊 ${p.ex}</div>
    </div>
  `).join('');

  // Key Q&A
  document.getElementById('qa-list').innerHTML = KEY_QA.map(item => `
    <div class="qa-item">
      <div><button class="speak-btn" onclick="speak('${item.q}')">🔊</button> <strong class="kr">A: ${item.q}</strong> <span class="muted">(${item.th})</span></div>
      <div style="margin-top:4px"><button class="speak-btn" onclick="speak('${item.a}')">🔊</button> <span class="kr">B: ${item.a}</span></div>
    </div>
  `).join('');

  initParticleDrill();
}

function initParticleDrill() {
  const shuffled = [...PARTICLE_DRILL_POOL].sort(() => Math.random() - 0.5).slice(0, 6);
  const container = document.getElementById('particle-drill-container');
  container.innerHTML = shuffled.map((item, idx) => `
    <div class="mini-drill-item" id="mdrill-${idx}">
      <div class="mini-drill-q kr">${item.stem} ( ___ ) ${item.suffix}</div>
      <div class="mini-drill-btns">
        ${item.options.map(opt => `
          <button class="mini-opt" onclick="checkMiniDrill(${idx}, '${opt}', '${item.ans}', '${item.reason}', '${item.stem}${item.ans} ${item.suffix}')">${opt}</button>
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
    if (btn.textContent === ans) btn.classList.add('correct');
    else if (btn.textContent === chosen) btn.classList.add('wrong');
  });
  const fb = document.getElementById(`mdrill-fb-${idx}`);
  fb.style.color = chosen === ans ? 'var(--teal)' : 'var(--coral)';
  fb.textContent = (chosen === ans ? '✅ ถูกต้อง! ' : '❌ ผิด — ') + reason;
  speak(fullSentence);
}

// ==================== HOUR 2: NUMBERS & INTERACTIVE DRILLS ====================
function renderNumberTables() {
  document.getElementById('native-num-grid').innerHTML = NATIVE_NUMBERS.map(n => `
    <div class="num-tile" onclick="speak('${n.kr}')">
      <div class="num-digit">${n.d}</div>
      <div class="num-word kr">${n.kr}</div>
      <div class="num-alt kr">${n.alt || '&nbsp;'}</div>
    </div>
  `).join('');

  document.getElementById('sino-num-grid').innerHTML = SINO_NUMBERS.map(n => `
    <div class="num-tile" onclick="speak('${n.kr.split('/')[0]}')">
      <div class="num-digit">${n.d}</div>
      <div class="num-word kr">${n.kr}</div>
      <div class="num-alt">${n.alt || '&nbsp;'}</div>
    </div>
  `).join('');

  document.getElementById('counters-grid').innerHTML = COUNTERS.map(c => `
    <div class="counter-chip" onclick="speak('${c.ex}')">
      <div class="counter-kr kr">${c.kr} <span style="font-size:0.72rem;color:var(--muted)">(${c.sys})</span></div>
      <div class="counter-th">${c.th}</div>
      <div class="kr" style="font-size:0.78rem;color:var(--primary)">🔊 ${c.ex}</div>
    </div>
  `).join('');

  document.getElementById('months-grid').innerHTML = MONTHS.map(m => `
    <div class="month-chip ${m.trap ? 'trap' : ''}" onclick="speak('${m.kr}')">
      <span>${m.num}월 (${m.th})</span>
      <strong class="kr">${m.kr}</strong>
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
  stage.innerHTML = `
    <div class="drill-visual">${visual}</div>
    <div class="drill-prompt">${prompt}</div>
    <div class="drill-choices">
      ${shuffled.map((ch, i) => `
        <button class="choice-btn kr" data-idx="${i}">${ch}</button>
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
        if (b.textContent === correct) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      const fb = document.getElementById('num-drill-fb');
      if (btn.textContent === correct) {
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
        <div class="vocab-meaning hidden-meaning" data-meaning="${v.th}">แตะเพื่อดูคำแปล</div>
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
          <span class="kr"><strong>สคริปต์:</strong> ${item.script}</span>
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
        <div class="quiz-options">
          ${item.opts.map((opt, oIdx) => {
            let cls = 'choice-btn kr';
            if (answered) {
              if (oIdx === item.ans) cls += ' correct';
              else if (oIdx === saved) cls += ' wrong';
            }
            return `<button class="${cls}" ${answered ? 'disabled' : ''} onclick="answerPart2(${qIdx}, ${oIdx})">${oIdx + 1}) ${opt}</button>`;
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
        <div class="writing-input-row">
          <input type="text" class="writing-input" id="winput-${item.id}" placeholder="${item.placeholder}" onkeydown="if(event.key==='Enter') checkWriting('${item.id}')" />
          <button class="btn-tiny btn-primary" onclick="checkWriting('${item.id}')">ตรวจ</button>
        </div>
        <div class="helper-chips">
          ${item.helpers.map(h => `<button class="helper-chip" onclick="appendHelper('${item.id}', '${h}')">+ ${h}</button>`).join('')}
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
    fb.innerHTML = `<strong>✅ ถูกต้องเป๊ะ!</strong> เฉลย: <span class="kr">${item.displayAns}</span> <button class="speak-chip" onclick="speak('${item.displayAns.split('/')[0]}')">🔊 ฟัง</button>`;
  } else {
    fb.innerHTML = `<strong>❌ ลองดูเฉลย:</strong> <span class="kr">${item.displayAns}</span> <button class="speak-chip" onclick="speak('${item.displayAns.split('/')[0]}')">🔊 ฟัง</button>`;
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
updateExamScore();
updateGlobalProgress();
