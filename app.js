const STORAGE_KEY = 'ka_progress_hub_state_v1';
const CLOUD_CONFIG_KEY = 'ka_progress_hub_cloud_config_v1';
const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['learning', 'Learning'],
  ['sequence-known', 'Sequence known'],
  ['developing', 'Developing technique'],
  ['comfortable', 'Comfortable'],
  ['instructor-checked', 'Instructor checked'],
  ['grading-ready', 'Grading ready'],
  ['complete', 'Completed']
];

const AZ_STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['in-progress', 'In progress'],
  ['theory-complete', 'Theory completed'],
  ['labs-complete', 'Labs completed'],
  ['revision-required', 'Revision required'],
  ['confident', 'Confident'],
  ['complete', 'Completed']
];

const APP_VERSION = '1.3.1';
const PROGRAMME_START_DATE = '2026-07-11';

const DAY_PLANS = {
  normal: {
    Monday: {
      family: 'Office day. Wake at 5:15 am, start at 5:30 am, finish by 7:00 am and leave for work at 8:00 am. Family and housework remain protected from 5:30–9:00 pm.',
      tasks: [
        { id: 'az-theory-am', time: '5:30–6:20 am', title: 'AZ-104 theory', type: 'azure', items: ['Complete the planned Microsoft Learn module', 'Write concise notes while learning', 'Mark difficult concepts for revision'] },
        { id: 'az-recall-am', time: '6:30–7:00 am', title: 'Recall and app update', type: 'azure', items: ['Explain the topic without notes', 'Record one troubleshooting example', 'Update progress and prepare the next session'] }
      ]
    },
    Tuesday: {
      family: 'Work-from-home day and dojo from 6:00–7:30 pm. Wife looks after the children during dojo.',
      tasks: [
        { id: 'dan-group-a-am', time: '5:30–6:15 am', title: '3rd Dan kihon — Group A', type: 'dan', items: ['Free kamae and controlled stepping', 'Punching and blocking combinations', 'Practise right and left sides', 'Record one technical issue'] },
        { id: 'new-kata-am', time: '6:20–6:50 am', title: 'Current kata sequence', type: 'kata', items: ['Review the previous section', 'Learn one new section', 'Join the sections slowly'] },
        { id: 'tue-log-am', time: '6:50–7:00 am', title: 'Progress update', type: 'review', items: ['Add notes and tick off the session'] }
      ]
    },
    Wednesday: {
      family: 'Office day. Wake at 5:15 am, start at 5:30 am, finish by 7:00 am and leave for work at 8:00 am. Family and housework remain protected from 5:30–9:00 pm.',
      tasks: [
        { id: 'az-lab-am', time: '5:30–6:40 am', title: 'AZ-104 practical lab', type: 'azure', items: ['Complete a portal or command-line exercise', 'Record what was configured and why', 'Remove unnecessary lab resources'] },
        { id: 'az-troubleshoot-am', time: '6:40–7:00 am', title: 'Troubleshooting recall', type: 'azure', items: ['List likely failure points', 'Explain how you would verify and fix them', 'Update the app'] }
      ]
    },
    Thursday: {
      family: 'Work-from-home day and dojo from 6:00–7:30 pm. Wife looks after the children during dojo.',
      tasks: [
        { id: 'kata-sequence-am', time: '5:30–6:15 am', title: 'Current kata sequence', type: 'kata', items: ['Review Tuesday’s section', 'Add the next section', 'Complete one full slow walkthrough'] },
        { id: 'dan-group-b-am', time: '6:20–6:50 am', title: '3rd Dan kihon — Group B', type: 'dan', items: ['Practise kicking combinations', 'Work both right and left sides', 'Focus on balance and correct return'] },
        { id: 'thu-log-am', time: '6:50–7:00 am', title: 'Progress update', type: 'review', items: ['Add notes and tick off the session'] }
      ]
    },
    Friday: {
      family: 'Office day. This is the lighter morning so recovery remains manageable before the weekend.',
      tasks: [
        { id: 'az-light-am', time: '5:30–6:15 am', title: 'Light AZ-104 revision', type: 'azure', items: ['Review notes or flashcards', 'Revisit incorrect knowledge checks', 'Prepare the next practical task'] },
        { id: 'fri-plan-am', time: '6:15–6:30 am', title: 'Short catch-up and planning', type: 'review', items: ['Complete one small unfinished item or stop early', 'Confirm Saturday’s task'] }
      ]
    },
    Saturday: {
      family: 'Main development morning. Start at 5:30 am before normal family and household activity.',
      tasks: [
        { id: 'az-scenario-am', time: '5:30–6:45 am', title: 'AZ-104 focused study and lab', type: 'azure', items: ['Continue the current learning path', 'Complete a practical exercise suited to the current topic', 'Record what worked, what failed and what to repeat'] },
        { id: 'kata-main-am', time: '6:55–7:45 am', title: 'Main kata session', type: 'kata', items: ['Review one older kata', 'Develop the current kata sequence', 'Record one full performance or memory test'] }
      ]
    },
    Sunday: {
      family: 'Church and family day. Complete the review before the household routine and church preparation begin.',
      tasks: [
        { id: 'az-weekly-am', time: '5:30–6:30 am', title: 'AZ-104 weekly review', type: 'azure', items: ['Review this week’s modules', 'Repeat important settings or commands', 'Identify one weak topic'] },
        { id: 'kata-test-am', time: '6:40–7:25 am', title: 'Kata memory test', type: 'kata', items: ['Perform the current kata without assistance', 'Test selected older kata', 'Record any sequence gaps'] },
        { id: 'weekly-plan-am', time: '7:25–7:40 am', title: 'Weekly review and planning', type: 'review', items: ['Complete the weekly review', 'Choose next week’s priorities'] }
      ]
    }
  },
  minimum: {
    Monday: { family: 'Office day. Use one focused block only.', tasks: [{ id: 'min-az-am', time: '5:30–6:15 am', title: 'Minimum AZ-104 session', type: 'azure', items: ['Complete one focused 45-minute study block'] }] },
    Tuesday: { family: 'Work-from-home and dojo day.', tasks: [{ id: 'min-kihon-am', time: '5:30–6:00 am', title: 'Minimum 3rd Dan kihon', type: 'dan', items: ['Practise one syllabus combination slowly on both sides'] }] },
    Wednesday: { family: 'Office day.', tasks: [{ id: 'min-rest-wed-am', time: 'Morning', title: 'Recovery morning', type: 'recovery', items: ['No scheduled study or personal karate'] }] },
    Thursday: { family: 'Work-from-home and dojo day.', tasks: [{ id: 'min-kata-am', time: '5:30–6:00 am', title: 'Minimum kata session', type: 'kata', items: ['Review the current kata sequence for 30 minutes'] }] },
    Friday: { family: 'Office day.', tasks: [{ id: 'min-rest-fri-am', time: 'Morning', title: 'Recovery morning', type: 'recovery', items: ['No scheduled study or personal karate'] }] },
    Saturday: { family: 'Short combined development morning.', tasks: [{ id: 'min-sat-az-am', time: '5:30–6:30 am', title: 'AZ-104 focused session', type: 'azure', items: ['Complete one hour of theory or lab work'] }, { id: 'min-sat-kata-am', time: '6:35–7:00 am', title: 'Kata sequence session', type: 'kata', items: ['Practise the current kata for 25 minutes'] }] },
    Sunday: { family: 'Church and family day.', tasks: [{ id: 'min-review-am', time: '5:30–6:00 am', title: 'Weekly review', type: 'review', items: ['Record progress and plan the next week'] }] }
  }
};

const DEFAULT_AZ_PATHS = [
  {
    id: 'az-prerequisites',
    name: 'AZ-104: Prerequisites for Azure administrators',
    targetWeeks: 'Weeks 1–2',
    modules: ['Azure Cloud Shell', 'Azure PowerShell and CLI foundations', 'Azure Resource Manager foundations', 'ARM template fundamentals']
  },
  {
    id: 'az-identities',
    name: 'AZ-104: Manage identities and governance in Azure',
    targetWeeks: 'Weeks 3–6',
    modules: ['Microsoft Entra users and groups', 'Administrative units', 'Subscriptions and management groups', 'Azure RBAC', 'Azure Policy', 'Resource locks', 'Tags and cost management']
  },
  {
    id: 'az-storage',
    name: 'AZ-104: Implement and manage storage in Azure',
    targetWeeks: 'Weeks 7–9',
    modules: ['Storage accounts', 'Storage security and access', 'Azure Blob Storage', 'Azure Files', 'Redundancy and replication', 'Lifecycle management']
  },
  {
    id: 'az-compute',
    name: 'AZ-104: Deploy and manage Azure compute resources',
    targetWeeks: 'Weeks 10–14',
    modules: ['ARM and Bicep deployment', 'Azure virtual machines', 'Availability options', 'VM extensions and disks', 'Azure Container Instances', 'Azure Container Apps', 'Azure App Service']
  },
  {
    id: 'az-networking',
    name: 'AZ-104: Configure and manage virtual networks for Azure administrators',
    targetWeeks: 'Weeks 15–18',
    modules: ['VNets and subnets', 'VNet peering', 'Network security groups', 'Routing', 'Azure DNS', 'Load balancing', 'Network troubleshooting']
  },
  {
    id: 'az-monitor',
    name: 'AZ-104: Monitor and back up Azure resources',
    targetWeeks: 'Weeks 19–21',
    modules: ['Azure Monitor', 'Metrics and logs', 'Alerts and action groups', 'Log Analytics', 'Network Watcher', 'Azure Backup', 'Azure Site Recovery']
  }
];

const DEFAULT_SYLLABUS = [
  { id: 'kihon-1', group: 'Group A', title: 'Kizami Zuki, Jodan Junzuki, Chudan Gyakuzuki — step in', checkpoints: ['Free kamae', 'Correct target levels', 'Stable stepping', 'Hip rotation', 'Hikite and completion'] },
  { id: 'kihon-2', group: 'Group A', title: 'Ageuke, Sotouke with the same arm, Gyakuzuki — step back', checkpoints: ['Block path', 'Same-arm transition', 'Stable retreat', 'Counter timing', 'Finishing posture'] },
  { id: 'kihon-3', group: 'Group A', title: 'Uchiuke, Kizami Zuki, Gyakuzuki — Kokutsu Dachi to Zenkutsu Dachi', checkpoints: ['Kokutsu Dachi', 'Weight transfer', 'Kizami Zuki timing', 'Zenkutsu Dachi finish', 'Hip connection'] },
  { id: 'kihon-4', group: 'Group A', title: 'Kokutsu Shutou Uke, Kizami Maegeri, Zenkutsu Nukite — step back', checkpoints: ['Shutou position', 'Kokutsu balance', 'Maegeri return', 'Transition to Zenkutsu', 'Nukite target'] },
  { id: 'kihon-5', group: 'Group B', title: 'Maegeri, Gyakuzuki, Yokogeri Kekomi, Gyakuzuki, Mawashigeri, Gyakuzuki — step in', checkpoints: ['Kick chamber', 'Correct return', 'Punch connection', 'Balance between kicks', 'Right and left sides'] },
  { id: 'kihon-6', group: 'Group B', title: 'Ushirogeri — step in', checkpoints: ['Head turn', 'Knee line', 'Heel target', 'Balance', 'Controlled recovery'] },
  { id: 'kihon-7', group: 'Group B', title: 'Maegeri, Yokogeri Kekomi, Ushirogeri — same feet, right and left', checkpoints: ['Same-foot sequence', 'Direction changes', 'Chamber position', 'Balance', 'Both sides'] },
  { id: 'tokui-kata', group: 'Kata', title: 'Tokui kata — provisional Bassai Dai', checkpoints: ['Full sequence', 'Embusen', 'Kiai', 'Technical themes', 'Question and answer preparation'] },
  { id: 'jiyu-kumite', group: 'Kumite', title: 'Jiyu Kumite', checkpoints: ['Guard and posture', 'Distance', 'Timing', 'Controlled entries', 'Counters', 'Pressure management'] }
];

const DEFAULT_KATAS = [
  ['taikyoku-shodan', 'Taikyoku Shodan', 'known'],
  ['heian-shodan', 'Heian Shodan', 'known'],
  ['heian-nidan', 'Heian Nidan', 'known'],
  ['heian-sandan', 'Heian Sandan', 'known'],
  ['heian-yondan', 'Heian Yondan', 'known'],
  ['heian-godan', 'Heian Godan', 'known'],
  ['tekki-shodan', 'Tekki Shodan', 'known'],
  ['bassai-dai', 'Bassai Dai', 'known'],
  ['jion', 'Jion', 'planned'],
  ['jitte', 'Jitte', 'planned'],
  ['enpi', 'Enpi', 'planned'],
  ['hangetsu', 'Hangetsu', 'planned'],
  ['kanku-dai', 'Kanku Dai', 'planned'],
  ['gankaku', 'Gankaku', 'planned'],
  ['tekki-nidan', 'Tekki Nidan', 'planned'],
  ['tekki-sandan', 'Tekki Sandan', 'planned'],
  ['bassai-sho', 'Bassai Sho', 'planned'],
  ['kanku-sho', 'Kanku Sho', 'planned'],
  ['nijushiho', 'Nijushiho', 'planned'],
  ['chinte', 'Chinte', 'planned'],
  ['sochin', 'Sochin', 'planned'],
  ['meikyo', 'Meikyo', 'planned'],
  ['wankan', 'Wankan', 'planned'],
  ['jiin', 'Ji’in', 'planned'],
  ['gojushiho-sho', 'Gojushiho Sho', 'planned'],
  ['gojushiho-dai', 'Gojushiho Dai', 'planned'],
  ['unsu', 'Unsu', 'planned']
].map(([id, name, category], index) => ({
  id,
  name,
  category,
  status: category === 'known' ? 'comfortable' : 'not-started',
  sequenceProgress: category === 'known' ? 100 : 0,
  confidence: category === 'known' ? 4 : 1,
  notes: '',
  lastPractised: '',
  practiceCount: 0,
  order: index + 1
}));

function defaultState() {
  return {
    version: 2,
    profile: { name: 'André' },
    settings: { programmeMode: 'normal', programmeStartDate: PROGRAMME_START_DATE, sessionStart: '05:30', preferredEnd: '07:00', timezone: 'Pacific/Auckland' },
    azPaths: DEFAULT_AZ_PATHS.map(p => ({ ...p, status: 'not-started', confidence: 1, notes: '', modules: p.modules.map((name, i) => ({ id: `${p.id}-m${i + 1}`, name, complete: false })) })),
    syllabus: DEFAULT_SYLLABUS.map(s => ({ ...s, status: 'not-started', confidence: 1, notes: '', lastPractised: '', rightComplete: false, leftComplete: false, practiceCount: 0, checkpoints: s.checkpoints.map((name, i) => ({ id: `${s.id}-c${i + 1}`, name, complete: false })) })),
    katas: structuredClone(DEFAULT_KATAS),
    daily: {},
    notes: [],
    weeklyReviews: [],
    updatedAt: new Date().toISOString()
  };
}

function mergeDefaults(saved) {
  const base = defaultState();
  if (!saved || typeof saved !== 'object') return base;
  const merged = {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile || {}) },
    settings: { ...base.settings, ...(saved.settings || {}) }
  };
  merged.azPaths = mergeCollection(base.azPaths, saved.azPaths, item => ({
    ...item,
    modules: mergeCollection(item.modules, (saved.azPaths || []).find(x => x.id === item.id)?.modules || [])
  }));
  merged.syllabus = mergeCollection(base.syllabus, saved.syllabus, item => ({
    ...item,
    checkpoints: mergeCollection(item.checkpoints, (saved.syllabus || []).find(x => x.id === item.id)?.checkpoints || [])
  }));
  merged.katas = mergeCollection(base.katas, saved.katas);
  merged.daily = saved.daily && typeof saved.daily === 'object' ? saved.daily : {};
  merged.notes = Array.isArray(saved.notes) ? saved.notes : [];
  merged.weeklyReviews = Array.isArray(saved.weeklyReviews) ? saved.weeklyReviews : [];

  // Version 2 moves the programme from late evenings to mornings and sets the
  // agreed launch date. Existing study, kata, syllabus and note data is kept.
  if (Number(saved.version || 1) < 2) {
    merged.version = 2;
    merged.settings.programmeStartDate = PROGRAMME_START_DATE;
    merged.settings.sessionStart = '05:30';
    merged.settings.preferredEnd = '07:00';
  }
  return merged;
}

function mergeCollection(defaults, saved = [], transform = x => x) {
  const savedMap = new Map((Array.isArray(saved) ? saved : []).map(item => [item.id, item]));
  const merged = defaults.map(def => transform({ ...def, ...(savedMap.get(def.id) || {}) }));
  for (const item of Array.isArray(saved) ? saved : []) {
    if (!defaults.some(def => def.id === item.id)) merged.push(item);
  }
  return merged;
}

function loadState() {
  try {
    return mergeDefaults(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch (error) {
    console.warn('Could not load saved state', error);
    return defaultState();
  }
}

let hasLocalState = localStorage.getItem(STORAGE_KEY) !== null;
let state = loadState();
let currentView = 'today';
let cloudClient = null;
let cloudUser = null;
let cloudConfig = loadCloudConfig();
let cloudDirty = false;
let syncDebounce = null;
let isSyncing = false;
let installPrompt = null;
let inputSaveTimer = null;
let timerDuration = 45 * 60;
let timerRemaining = timerDuration;
let timerInterval = null;
let timerRunning = false;

const pageTitles = {
  today: ['YOUR PLAN', 'Today'],
  week: ['MONDAY TO SUNDAY', 'Weekly Plan'],
  azure: ['CERTIFICATION STUDY', 'AZ-104'],
  dan: ['JKA SYLLABUS', '3rd Dan Preparation'],
  kata: ['SEQUENCE & RETENTION', 'Kata Library'],
  progress: ['MEASURABLE RESULTS', 'Progress'],
  notes: ['REFLECTION', 'Notes & Reviews'],
  settings: ['APP CONTROL', 'Settings']
};

function loadCloudConfig() {
  try { return JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY)) || {}; }
  catch { return {}; }
}

function saveState({ render = false, sync = true } = {}) {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  hasLocalState = true;
  if (sync) {
    cloudDirty = true;
    scheduleCloudSync();
  }
  if (render) renderCurrentView();
}

function escapeHTML(value = '') {
  return String(value).replace(/[&<>'"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[ch]));
}

function getNZDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const values = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

function formatDateKey(key, options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-NZ', options).format(parseDateKey(key));
}

function getDayName(key = getNZDateKey()) {
  return new Intl.DateTimeFormat('en-NZ', { weekday: 'long' }).format(parseDateKey(key));
}

function addDays(key, count) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + count);
  return getNZDateKey(date);
}

function getWeekStart(key = getNZDateKey()) {
  const date = parseDateKey(key);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return getNZDateKey(date);
}

function getDailyRecord(key = getNZDateKey()) {
  if (!state.daily[key]) state.daily[key] = { checks: {}, notes: '', energy: 3, result: 'not-set' };
  return state.daily[key];
}

function taskSubKey(taskId, index) { return `${taskId}::${index}`; }

function dayCompletion(key) {
  const startDate = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  if (key < startDate) return 0;
  const plan = DAY_PLANS[state.settings.programmeMode][getDayName(key)];
  if (!plan) return 0;
  const total = plan.tasks.reduce((sum, task) => sum + task.items.length, 0);
  if (!total) return 0;
  const record = getDailyRecord(key);
  const done = plan.tasks.reduce((sum, task) => sum + task.items.filter((_, i) => record.checks[taskSubKey(task.id, i)]).length, 0);
  return Math.round(done / total * 100);
}

function currentAZPath() {
  return state.azPaths.find(p => !['complete', 'confident'].includes(p.status)) || state.azPaths.at(-1);
}

function currentKata() {
  return state.katas.find(k => k.category === 'planned' && k.status !== 'not-started' && k.status !== 'complete') || state.katas.find(k => k.category === 'planned' && k.status === 'not-started') || state.katas[0];
}

function statusLabel(status, options = STATUS_OPTIONS) {
  return options.find(([value]) => value === status)?.[1] || status;
}

function statusOptions(current, options = STATUS_OPTIONS) {
  return options.map(([value, label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${label}</option>`).join('');
}

function toast(message) {
  const el = document.getElementById('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2800);
}

function showView(view) {
  currentView = view;
  document.querySelectorAll('.view').forEach(el => el.classList.toggle('active', el.id === `view-${view}`));
  document.querySelectorAll('[data-view]').forEach(el => el.classList.toggle('active', el.dataset.view === view));
  const [eyebrow, title] = pageTitles[view];
  document.getElementById('page-eyebrow').textContent = eyebrow;
  document.getElementById('page-title').textContent = title;
  renderCurrentView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderCurrentView() {
  const renderers = {
    today: renderToday,
    week: renderWeek,
    azure: renderAzure,
    dan: renderDan,
    kata: renderKata,
    progress: renderProgress,
    notes: renderNotes,
    settings: renderSettings
  };
  renderers[currentView]?.();
  updateAccountUI();
}

function renderToday() {
  const key = getNZDateKey();
  const day = getDayName(key);
  const startDate = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const plan = DAY_PLANS[state.settings.programmeMode][day];
  const az = currentAZPath();
  const kata = currentKata();
  const modeLabel = state.settings.programmeMode === 'minimum' ? 'Minimum programme' : 'Normal programme';

  if (key < startDate) {
    const startDay = getDayName(startDate);
    const startPlan = DAY_PLANS[state.settings.programmeMode][startDay];
    const daysToStart = Math.max(0, Math.ceil((parseDateKey(startDate) - parseDateKey(key)) / 86400000));
    document.getElementById('view-today').innerHTML = `
      <div class="hero">
        <p class="eyebrow">PROGRAMME STARTS ${escapeHTML(formatDateKey(startDate).toUpperCase())}</p>
        <h2>Morning programme begins in ${daysToStart} day${daysToStart === 1 ? '' : 's'}</h2>
        <p>Your first session starts at <strong>${escapeHTML(state.settings.sessionStart || '05:30')} am</strong>. Until then, use this time to prepare your study area, karate space and sleep routine.</p>
        <div class="hero-meta">
          <span class="badge green">Start: ${escapeHTML(formatDateKey(startDate, { weekday:'long', day:'numeric', month:'long', year:'numeric' }))}</span>
          <span class="badge blue">Morning start: ${escapeHTML(state.settings.sessionStart || '05:30')} am</span>
          <span class="badge red">Current kata: ${escapeHTML(kata.name)}</span>
        </div>
      </div>
      <div class="section-heading"><div><h2>First morning preview</h2><p>${escapeHTML(startPlan.family)}</p></div></div>
      <div class="grid two">
        ${startPlan.tasks.map(task => `<article class="card task-card"><div class="task-top"><div><span class="task-time">${escapeHTML(task.time)}</span><h3>${escapeHTML(task.title)}</h3></div><span class="badge amber">Preview</span></div><div class="checklist">${task.items.map(item => `<div class="check-row"><span>○</span><label>${escapeHTML(item)}</label></div>`).join('')}</div></article>`).join('')}
      </div>
      <article class="card flat" style="margin-top:16px">
        <h2>Preparation before the start date</h2>
        <div class="checklist">
          <div class="check-row"><span>○</span><label>Aim to be in bed by about 9:45–10:00 pm.</label></div>
          <div class="check-row"><span>○</span><label>Set out clothing and prepare the laptop the night before.</label></div>
          <div class="check-row"><span>○</span><label>Choose a quiet karate practice area and keep the first sessions controlled.</label></div>
        </div>
      </article>`;
    return;
  }

  const record = getDailyRecord(key);
  const progress = dayCompletion(key);

  document.getElementById('view-today').innerHTML = `
    <div class="hero">
      <p class="eyebrow">${escapeHTML(formatDateKey(key).toUpperCase())}</p>
      <h2>${escapeHTML(day)} morning plan</h2>
      <p>${escapeHTML(plan.family)}</p>
      <div class="hero-meta">
        <span class="badge ${state.settings.programmeMode === 'minimum' ? 'amber' : 'green'}">${modeLabel}</span>
        <span class="badge blue">Current AZ-104: ${escapeHTML(az.name.replace('AZ-104: ', ''))}</span>
        <span class="badge red">Current kata: ${escapeHTML(kata.name)}</span>
      </div>
    </div>

    <div class="section-heading">
      <div><h2>This morning’s sessions</h2><p>Tick each step as you complete it.</p></div>
      <strong>${progress}%</strong>
    </div>
    <div class="progress-line" aria-label="Daily completion"><span style="width:${progress}%"></span></div>
    <div class="grid two" style="margin-top:16px">
      ${plan.tasks.map(task => renderTaskCard(task, key, record)).join('')}
    </div>

    <div class="grid two" style="margin-top:16px">
      <article class="card flat">
        <h2>Session notes</h2>
        <label>What did you learn, notice or struggle with?
          <textarea data-daily-field="notes" data-date="${key}" placeholder="Add notes for this morning...">${escapeHTML(record.notes)}</textarea>
        </label>
      </article>
      <article class="card flat">
        <h2>End-of-session check</h2>
        <div class="form-grid">
          <label>Energy and recovery
            <select data-daily-field="energy" data-date="${key}">
              ${[1,2,3,4,5].map(n => `<option value="${n}" ${Number(record.energy) === n ? 'selected' : ''}>${n}/5</option>`).join('')}
            </select>
          </label>
          <label>Session result
            <select data-daily-field="result" data-date="${key}">
              ${[['not-set','Not recorded'],['not-completed','Not completed'],['partial','Partially completed'],['completed-hard','Completed with difficulty'],['completed','Completed']].map(([v,l]) => `<option value="${v}" ${record.result === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="form-actions">
          <button class="secondary-btn" data-action="open-timer">Open session timer</button>
          <button class="ghost-btn" data-action="toggle-mode">Switch to ${state.settings.programmeMode === 'normal' ? 'minimum' : 'normal'} week</button>
        </div>
      </article>
    </div>`;
}

function renderTaskCard(task, key, record) {
  const done = task.items.filter((_, i) => record.checks[taskSubKey(task.id, i)]).length;
  const percent = Math.round(done / task.items.length * 100);
  return `<article class="card task-card">
    <div class="task-top">
      <div><span class="task-time">${escapeHTML(task.time)}</span><h3>${escapeHTML(task.title)}</h3></div>
      <span class="badge ${task.type === 'azure' ? 'blue' : task.type === 'kata' || task.type === 'dan' ? 'red' : task.type === 'recovery' ? 'green' : 'amber'}">${done}/${task.items.length}</span>
    </div>
    <div class="checklist">
      ${task.items.map((item, i) => {
        const keyName = taskSubKey(task.id, i);
        const checked = !!record.checks[keyName];
        return `<div class="check-row ${checked ? 'checked' : ''}">
          <input id="check-${task.id}-${i}" type="checkbox" data-daily-check="${escapeHTML(keyName)}" data-date="${key}" ${checked ? 'checked' : ''}>
          <label for="check-${task.id}-${i}">${escapeHTML(item)}</label>
        </div>`;
      }).join('')}
    </div>
    <div class="progress-line"><span style="width:${percent}%"></span></div>
  </article>`;
}

function renderWeek() {
  const start = getWeekStart();
  const today = getNZDateKey();
  const programmeStart = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const planSet = DAY_PLANS[state.settings.programmeMode];
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  document.getElementById('view-week').innerHTML = `
    <div class="hero">
      <p class="eyebrow">WEEK OF ${escapeHTML(formatDateKey(start, { day:'numeric', month:'long', year:'numeric' }).toUpperCase())}</p>
      <h2>${state.settings.programmeMode === 'normal' ? 'Standard morning programme' : 'Reduced minimum programme'}</h2>
      <p>Morning sessions start at ${escapeHTML(state.settings.sessionStart || '05:30')} am. Office-day sessions finish by ${escapeHTML(state.settings.preferredEnd || '07:00')} am so you can prepare and leave for work at 8:00 am.</p>
      <div class="hero-meta"><span class="badge green">Programme starts ${escapeHTML(formatDateKey(programmeStart, { day:'numeric', month:'long', year:'numeric' }))}</span><button class="secondary-btn" data-action="toggle-mode">Use ${state.settings.programmeMode === 'normal' ? 'minimum' : 'normal'} programme</button></div>
    </div>
    <div class="section-heading"><div><h2>Monday to Sunday</h2><p>Swipe horizontally on a phone.</p></div></div>
    <div class="week-grid">
      ${days.map(key => {
        const day = getDayName(key);
        const plan = planSet[day];
        const beforeStart = key < programmeStart;
        return `<article class="card day-card ${key === today ? 'today' : ''} ${beforeStart ? 'before-start' : ''}">
          <h3>${day}<span class="day-date">${formatDateKey(key, { day:'numeric', month:'short' })}</span></h3>
          ${beforeStart ? '<span class="badge amber">Before programme start</span>' : `<span class="badge ${dayCompletion(key) === 100 ? 'green' : 'blue'}">${dayCompletion(key)}% complete</span>`}
          <div class="day-block"><strong>Daily context</strong><p>${escapeHTML(plan.family)}</p></div>
          ${beforeStart ? '<div class="day-block"><strong>No session required</strong><p>The programme begins on Saturday 11 July 2026.</p></div>' : plan.tasks.map(task => `<div class="day-block"><strong>${escapeHTML(task.time)} — ${escapeHTML(task.title)}</strong><p>${escapeHTML(task.items.join(' · '))}</p></div>`).join('')}
        </article>`;
      }).join('')}
    </div>`;
}

function renderAzure() {
  const completedModules = state.azPaths.reduce((sum, p) => sum + p.modules.filter(m => m.complete).length, 0);
  const totalModules = state.azPaths.reduce((sum, p) => sum + p.modules.length, 0);
  const overall = totalModules ? Math.round(completedModules / totalModules * 100) : 0;
  document.getElementById('view-azure').innerHTML = `
    <div class="hero">
      <p class="eyebrow">SIX LEARNING PATHS ONLY</p>
      <h2>AZ-104 study tracker</h2>
      <p>Use Monday for theory, Wednesday and Saturday for practical work, Friday for light revision and Sunday for retrieval practice. All sessions are scheduled in the morning.</p>
      <div class="hero-meta"><span class="badge blue">${completedModules}/${totalModules} topics</span><span class="badge green">${overall}% overall</span></div>
    </div>
    <div class="section-heading"><div><h2>Learning paths</h2><p>Update status, confidence, modules and notes.</p></div></div>
    <div class="item-list">
      ${state.azPaths.map(path => {
        const done = path.modules.filter(m => m.complete).length;
        const pct = Math.round(done / path.modules.length * 100);
        return `<article class="card item-card">
          <div class="item-header">
            <div><span class="badge blue">${escapeHTML(path.targetWeeks)}</span><h3>${escapeHTML(path.name)}</h3><span class="muted small">${done}/${path.modules.length} topics complete</span></div>
            <div class="item-controls"><select class="status-select" data-az-status="${path.id}">${statusOptions(path.status, AZ_STATUS_OPTIONS)}</select></div>
          </div>
          <div class="progress-line" style="margin-top:12px"><span style="width:${pct}%"></span></div>
          <details class="item-body">
            <summary class="details-toggle">Open path details</summary>
            <div style="margin-top:14px">
              ${path.modules.map(module => `<div class="module-row"><input type="checkbox" data-az-module="${path.id}" data-module-id="${module.id}" ${module.complete ? 'checked' : ''}><span>${escapeHTML(module.name)}</span><span class="small muted">${module.complete ? 'Done' : ''}</span></div>`).join('')}
              <div class="form-grid" style="margin-top:15px">
                <label>Confidence
                  <div class="confidence">${renderConfidence('az-confidence', path.id, path.confidence)}</div>
                </label>
                <label>Study notes
                  <textarea data-az-notes="${path.id}" placeholder="Difficult concepts, lab results and troubleshooting notes...">${escapeHTML(path.notes)}</textarea>
                </label>
              </div>
            </div>
          </details>
        </article>`;
      }).join('')}
    </div>`;
}

function renderDan() {
  const checked = state.syllabus.reduce((sum, s) => sum + s.checkpoints.filter(c => c.complete).length, 0);
  const total = state.syllabus.reduce((sum, s) => sum + s.checkpoints.length, 0);
  const overall = Math.round(checked / total * 100);
  const groups = ['Group A', 'Group B', 'Kata', 'Kumite'];
  document.getElementById('view-dan').innerHTML = `
    <div class="hero">
      <p class="eyebrow">PERSONAL PRACTICE</p>
      <h2>JKA 3rd Dan preparation</h2>
      <p>Teaching dojo classes is recorded separately. These cards track your own syllabus preparation and instructor feedback.</p>
      <div class="hero-meta"><span class="badge red">${overall}% checkpoints</span><span class="badge amber">Right and left sides</span></div>
    </div>
    ${groups.map(group => `<div class="section-heading"><div><h2>${escapeHTML(group)}</h2></div></div><div class="item-list">${state.syllabus.filter(s => s.group === group).map(renderSyllabusCard).join('')}</div>`).join('')}`;
}

function renderSyllabusCard(item) {
  const done = item.checkpoints.filter(c => c.complete).length;
  const pct = Math.round(done / item.checkpoints.length * 100);
  return `<article class="card item-card">
    <div class="item-header">
      <div><h3>${escapeHTML(item.title)}</h3><span class="muted small">Last practised: ${item.lastPractised ? formatDateKey(item.lastPractised, { day:'numeric', month:'short', year:'numeric' }) : 'Not recorded'} · ${item.practiceCount || 0} sessions</span></div>
      <select class="status-select" data-dan-status="${item.id}">${statusOptions(item.status)}</select>
    </div>
    <div class="progress-line" style="margin-top:12px"><span style="width:${pct}%"></span></div>
    <details class="item-body">
      <summary class="details-toggle">Open technical checklist</summary>
      <div style="margin-top:13px">
        ${item.checkpoints.map(c => `<div class="module-row"><input type="checkbox" data-dan-check="${item.id}" data-check-id="${c.id}" ${c.complete ? 'checked' : ''}><span>${escapeHTML(c.name)}</span><span></span></div>`).join('')}
        <div class="toggle-row"><span>Right side completed</span><label class="switch"><input type="checkbox" data-dan-side="right" data-dan-id="${item.id}" ${item.rightComplete ? 'checked' : ''}><span></span></label></div>
        <div class="toggle-row"><span>Left side completed</span><label class="switch"><input type="checkbox" data-dan-side="left" data-dan-id="${item.id}" ${item.leftComplete ? 'checked' : ''}><span></span></label></div>
        <div class="form-grid" style="margin-top:14px">
          <label>Confidence<div class="confidence">${renderConfidence('dan-confidence', item.id, item.confidence)}</div></label>
          <label>Technical and instructor notes<textarea data-dan-notes="${item.id}" placeholder="Record faults, corrections and questions...">${escapeHTML(item.notes)}</textarea></label>
        </div>
        <div class="form-actions"><button class="primary-btn" data-action="log-dan-practice" data-id="${item.id}">Log practice today</button></div>
      </div>
    </details>
  </article>`;
}

function renderKata() {
  const known = state.katas.filter(k => k.category === 'known');
  const learning = state.katas.filter(k => k.category === 'planned' && k.status !== 'not-started' && k.status !== 'complete');
  const planned = state.katas.filter(k => k.category === 'planned' && (k.status === 'not-started' || k.status === 'complete'));
  const sequenceKnown = state.katas.filter(k => k.sequenceProgress >= 100).length;
  document.getElementById('view-kata').innerHTML = `
    <div class="hero">
      <p class="eyebrow">SEQUENCES FIRST</p>
      <h2>Kata sequence and retention</h2>
      <p>The immediate objective is to know the correct sequence, directions and general structure. Stronger technique and timing can be developed after the sequence foundation is established.</p>
      <div class="hero-meta"><span class="badge red">${sequenceKnown}/${state.katas.length} sequences known</span><span class="badge blue">Current: ${escapeHTML(currentKata().name)}</span></div>
    </div>
    <div class="section-heading"><div><h2>Already known</h2><p>Keep these in the retention rotation.</p></div></div>
    <div class="grid two">${known.map(renderKataCard).join('')}</div>
    <div class="section-heading"><div><h2>Currently learning</h2></div></div>
    ${learning.length ? `<div class="grid two">${learning.map(renderKataCard).join('')}</div>` : `<div class="card empty">No kata is marked as currently learning. Change Jion or another planned kata to “Learning”.</div>`}
    <div class="section-heading"><div><h2>Planned kata</h2><p>Start one or two at a time.</p></div></div>
    <div class="grid two">${planned.map(renderKataCard).join('')}</div>`;
}

function renderKataCard(kata) {
  return `<article class="card item-card">
    <div class="item-header">
      <div><h3>${escapeHTML(kata.name)}</h3><span class="muted small">${kata.practiceCount || 0} logged sessions · Last: ${kata.lastPractised ? formatDateKey(kata.lastPractised, { day:'numeric', month:'short' }) : 'Never'}</span></div>
      <select class="status-select" data-kata-status="${kata.id}">${statusOptions(kata.status)}</select>
    </div>
    <label style="margin-top:13px">Sequence progress: <strong>${Number(kata.sequenceProgress) || 0}%</strong>
      <input type="range" min="0" max="100" step="10" value="${Number(kata.sequenceProgress) || 0}" data-kata-progress="${kata.id}">
    </label>
    <div class="progress-line"><span style="width:${Number(kata.sequenceProgress) || 0}%"></span></div>
    <details class="item-body">
      <summary class="details-toggle">Open kata notes</summary>
      <div class="form-grid" style="margin-top:14px">
        <label>Confidence<div class="confidence">${renderConfidence('kata-confidence', kata.id, kata.confidence)}</div></label>
        <label>Sequence and technical notes<textarea data-kata-notes="${kata.id}" placeholder="Sections, turns, embusen, kiai and questions...">${escapeHTML(kata.notes)}</textarea></label>
      </div>
      <div class="form-actions"><button class="primary-btn" data-action="log-kata-practice" data-id="${kata.id}">Log practice today</button></div>
    </details>
  </article>`;
}

function renderConfidence(action, id, current) {
  return [1,2,3,4,5].map(n => `<button type="button" data-action="${action}" data-id="${id}" data-value="${n}" class="${Number(current) === n ? 'active' : ''}" aria-label="Confidence ${n} of 5">${n}</button>`).join('');
}

function renderProgress() {
  const today = getNZDateKey();
  const last28 = Array.from({ length: 28 }, (_, i) => addDays(today, -i));
  const activeDays = last28.filter(key => dayCompletion(key) > 0).length;
  const completedDays = last28.filter(key => dayCompletion(key) === 100).length;
  const azDone = state.azPaths.reduce((s,p) => s + p.modules.filter(m => m.complete).length, 0);
  const azTotal = state.azPaths.reduce((s,p) => s + p.modules.length, 0);
  const danDone = state.syllabus.reduce((s,p) => s + p.checkpoints.filter(c => c.complete).length, 0);
  const danTotal = state.syllabus.reduce((s,p) => s + p.checkpoints.length, 0);
  const kataKnown = state.katas.filter(k => k.sequenceProgress >= 100).length;
  const energyRecords = Object.values(state.daily).filter(d => d.energy).map(d => Number(d.energy));
  const averageEnergy = energyRecords.length ? (energyRecords.reduce((a,b)=>a+b,0) / energyRecords.length).toFixed(1) : '—';
  const metrics = [
    ['AZ-104 topics', percent(azDone, azTotal)],
    ['3rd Dan checkpoints', percent(danDone, danTotal)],
    ['Kata sequences', percent(kataKnown, state.katas.length)],
    ['28-day full sessions', percent(completedDays, 28)]
  ];
  document.getElementById('view-progress').innerHTML = `
    <div class="grid four">
      <article class="card metric-card"><small>Active days in 28 days</small><strong>${activeDays}</strong><span class="muted small">Any checklist progress</span></article>
      <article class="card metric-card"><small>Fully completed days</small><strong>${completedDays}</strong><span class="muted small">Last 28 days</span></article>
      <article class="card metric-card"><small>Kata sequences known</small><strong>${kataKnown}</strong><span class="muted small">Out of ${state.katas.length}</span></article>
      <article class="card metric-card"><small>Average energy</small><strong>${averageEnergy}</strong><span class="muted small">Out of 5</span></article>
    </div>
    <div class="grid two" style="margin-top:16px">
      <article class="card">
        <h2>Programme progress</h2>
        <div class="bar-chart">
          ${metrics.map(([label,value]) => `<div class="bar-row"><span>${escapeHTML(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-value">${value}%</span></div>`).join('')}
        </div>
      </article>
      <article class="card">
        <h2>Practice totals</h2>
        <div class="bar-chart">
          <div class="bar-row"><span>Kata sessions</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, state.katas.reduce((s,k)=>s+(k.practiceCount||0),0)*2)}%"></div></div><span class="bar-value">${state.katas.reduce((s,k)=>s+(k.practiceCount||0),0)}</span></div>
          <div class="bar-row"><span>3rd Dan sessions</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, state.syllabus.reduce((s,k)=>s+(k.practiceCount||0),0)*2)}%"></div></div><span class="bar-value">${state.syllabus.reduce((s,k)=>s+(k.practiceCount||0),0)}</span></div>
          <div class="bar-row"><span>Reviews saved</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, state.weeklyReviews.length*10)}%"></div></div><span class="bar-value">${state.weeklyReviews.length}</span></div>
        </div>
      </article>
    </div>
    <div class="section-heading"><div><h2>Last 14 days</h2><p>Daily checklist completion.</p></div></div>
    <div class="grid four">
      ${Array.from({ length: 14 }, (_, i) => addDays(today, i - 13)).map(key => `<article class="card flat metric-card"><small>${formatDateKey(key, { weekday:'short', day:'numeric', month:'short' })}</small><strong>${dayCompletion(key)}%</strong><div class="progress-line"><span style="width:${dayCompletion(key)}%"></span></div></article>`).join('')}
    </div>`;
}

function percent(value, total) { return total ? Math.round(value / total * 100) : 0; }

function renderNotes() {
  const weekStart = getWeekStart();
  const existing = state.weeklyReviews.find(r => r.weekStart === weekStart);
  document.getElementById('view-notes').innerHTML = `
    <div class="grid two">
      <article class="card">
        <h2>Add a general note</h2>
        <form id="note-form">
          <label>Title<input name="title" type="text" maxlength="100" required placeholder="Example: Jion section to ask Sensei about"></label>
          <label style="margin-top:12px">Note<textarea name="body" required placeholder="Write your note..."></textarea></label>
          <div class="form-actions"><button class="primary-btn" type="submit">Save note</button></div>
        </form>
      </article>
      <article class="card">
        <h2>Weekly review</h2>
        <p class="muted small">Week starting ${formatDateKey(weekStart, { day:'numeric', month:'long', year:'numeric' })}</p>
        <form id="review-form" data-week-start="${weekStart}">
          <label>Main success<textarea name="success" required>${escapeHTML(existing?.success || '')}</textarea></label>
          <label>Main difficulty<textarea name="difficulty" required>${escapeHTML(existing?.difficulty || '')}</textarea></label>
          <label>What I learned<textarea name="learned">${escapeHTML(existing?.learned || '')}</textarea></label>
          <label>Adjustment for next week<textarea name="adjustment" required>${escapeHTML(existing?.adjustment || '')}</textarea></label>
          <div class="form-grid">
            <label>Sleep impact<select name="sleepImpact">${[['none','No noticeable impact'],['minor','Minor impact'],['significant','Significant impact']].map(([v,l]) => `<option value="${v}" ${existing?.sleepImpact===v?'selected':''}>${l}</option>`).join('')}</select></label>
            <label>Overall week<select name="rating">${[1,2,3,4,5].map(n => `<option value="${n}" ${Number(existing?.rating||3)===n?'selected':''}>${n}/5</option>`).join('')}</select></label>
          </div>
          <div class="form-actions"><button class="primary-btn" type="submit">${existing ? 'Update' : 'Save'} weekly review</button></div>
        </form>
      </article>
    </div>
    <div class="section-heading"><div><h2>Saved notes</h2></div></div>
    <div class="grid two">${state.notes.length ? [...state.notes].reverse().map(note => `<article class="card note-card"><div><h3>${escapeHTML(note.title)}</h3><div class="note-meta">${new Date(note.createdAt).toLocaleString('en-NZ')}</div></div><p>${escapeHTML(note.body).replace(/\n/g,'<br>')}</p><div class="note-actions"><button class="ghost-btn" data-action="delete-note" data-id="${note.id}">Delete</button></div></article>`).join('') : '<div class="card empty">No general notes yet.</div>'}</div>
    <div class="section-heading"><div><h2>Weekly review history</h2></div></div>
    <div class="review-grid">${state.weeklyReviews.length ? [...state.weeklyReviews].sort((a,b)=>b.weekStart.localeCompare(a.weekStart)).map(r => `<article class="card review-card"><h3>Week of ${formatDateKey(r.weekStart,{day:'numeric',month:'long',year:'numeric'})}</h3><span class="badge blue">${r.rating}/5</span><p><strong>Success:</strong> ${escapeHTML(r.success)}</p><p><strong>Difficulty:</strong> ${escapeHTML(r.difficulty)}</p>${r.learned ? `<p><strong>Learned:</strong> ${escapeHTML(r.learned)}</p>` : ''}<p><strong>Next adjustment:</strong> ${escapeHTML(r.adjustment)}</p></article>`).join('') : '<div class="card empty">No weekly reviews saved yet.</div>'}</div>`;
}

function renderSettings() {
  document.getElementById('view-settings').innerHTML = `
    <div class="grid two">
      <article class="card">
        <h2>Programme settings</h2>
        <div class="toggle-row"><div><strong>Minimum-week mode</strong><div class="muted small">Use the reduced programme during difficult weeks.</div></div><label class="switch"><input id="mode-toggle" type="checkbox" ${state.settings.programmeMode === 'minimum' ? 'checked' : ''}><span></span></label></div>
        <div class="form-grid" style="margin-top:13px">
          <label>Programme start date<input id="programme-start-date" type="date" value="${escapeHTML(state.settings.programmeStartDate || PROGRAMME_START_DATE)}"></label>
          <label>Morning start time<input id="session-start" type="time" value="${escapeHTML(state.settings.sessionStart || '05:30')}"></label>
          <label>Office-day finish time<input id="preferred-end" type="time" value="${escapeHTML(state.settings.preferredEnd || '07:00')}"></label>
        </div>
        <div class="form-actions"><button class="primary-btn" data-action="save-programme-settings">Save programme settings</button></div>
        <p class="muted small" style="margin-top:12px">App version ${APP_VERSION}</p>
      </article>
      <article class="card">
        <h2>Backup and restore</h2>
        <p class="muted">Export a complete JSON backup of your schedule, progress and notes.</p>
        <div class="form-actions"><button class="secondary-btn" data-action="export-backup">Export backup</button><button class="secondary-btn" data-action="choose-import">Import backup</button><input id="import-file" class="hidden" type="file" accept="application/json,.json"></div>
        <div class="inline-note warning" style="margin-top:15px">Importing replaces the current local data after confirmation.</div>
      </article>
    </div>

    <div class="section-heading"><div><h2>Cloud synchronisation</h2><p>Supabase account and database.</p></div></div>
    <div class="grid two">
      <article class="card">
        <h2>Supabase configuration</h2>
        <p class="muted small">Paste the project URL and publishable/anon key. Never use a service-role key.</p>
        <label>Project URL<input id="supabase-url" type="url" value="${escapeHTML(cloudConfig.url || '')}" placeholder="https://your-project.supabase.co"></label>
        <label style="margin-top:12px">Publishable or anon key<input id="supabase-key" type="password" value="${escapeHTML(cloudConfig.key || '')}" placeholder="Supabase publishable key"></label>
        <div class="form-actions"><button class="primary-btn" data-action="save-cloud-config">Save cloud configuration</button><button class="ghost-btn" data-action="clear-cloud-config">Clear</button></div>
      </article>
      <article class="card">
        <h2>${cloudUser ? 'Cloud account' : 'Sign in or create account'}</h2>
        ${cloudUser ? `
          <p>Signed in as <strong>${escapeHTML(cloudUser.email || cloudUser.id)}</strong>.</p>
          <div class="form-actions"><button class="primary-btn" data-action="sync-now">Sync now</button><button class="secondary-btn" data-action="pull-cloud">Pull cloud to this device</button><button class="secondary-btn" data-action="push-cloud">Push this device to cloud</button><button class="ghost-btn" data-action="sign-out">Sign out</button></div>
        ` : `
          <form id="auth-form">
            <label>Email<input name="email" type="email" required autocomplete="email"></label>
            <label style="margin-top:12px">Password<input name="password" type="password" minlength="8" required autocomplete="current-password"></label>
            <div class="form-actions"><button class="primary-btn" type="submit" name="authAction" value="sign-in">Sign in</button><button class="secondary-btn" type="submit" name="authAction" value="sign-up">Create account</button></div>
          </form>
          ${cloudConfig.url && cloudConfig.key ? '' : '<div class="inline-note warning" style="margin-top:14px">Save the Supabase configuration first.</div>'}
        `}
      </article>
    </div>

    <div class="section-heading"><div><h2>App installation</h2></div></div>
    <article class="card">
      <p>Host the folder over HTTPS, then use the browser’s install command. The app will continue to work offline and synchronise when a connection returns.</p>
      <div class="form-actions"><button class="secondary-btn" data-action="install-app">Install app</button></div>
      <div class="inline-note" style="margin-top:14px">On Android, use Chrome’s <strong>Install app</strong> or <strong>Add to Home screen</strong>. On Windows Edge, use <strong>Apps → Install this site as an app</strong>.</div>
    </article>

    <div class="section-heading"><div><h2>Danger zone</h2></div></div>
    <article class="card"><div class="inline-note danger-note">Resetting deletes this device’s local records. Export a backup first.</div><div class="form-actions"><button class="danger-btn" data-action="reset-data">Reset all local data</button></div></article>`;
}

function scheduleInputSave(callback) {
  clearTimeout(inputSaveTimer);
  inputSaveTimer = setTimeout(callback, 500);
}

function findAZ(id) { return state.azPaths.find(x => x.id === id); }
function findDan(id) { return state.syllabus.find(x => x.id === id); }
function findKata(id) { return state.katas.find(x => x.id === id); }

async function confirmAction(title, message) {
  const dialog = document.getElementById('confirm-dialog');
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-message').textContent = message;
  return new Promise(resolve => {
    const handler = () => {
      dialog.removeEventListener('close', handler);
      resolve(dialog.returnValue === 'default');
    };
    dialog.addEventListener('close', handler);
    dialog.showModal();
  });
}

function exportBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `karate-azure-progress-backup-${getNZDateKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Backup exported.');
}

async function importBackup(file) {
  try {
    const parsed = JSON.parse(await file.text());
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid backup');
    const ok = await confirmAction('Import backup?', 'This will replace the current data on this device.');
    if (!ok) return;
    state = mergeDefaults(parsed);
    saveState({ render: true });
    toast('Backup imported.');
  } catch (error) {
    toast(`Import failed: ${error.message}`);
  }
}

function updateAccountUI() {
  const badge = document.getElementById('account-badge');
  badge.textContent = (cloudUser?.email || state.profile.name || 'A').charAt(0).toUpperCase();
  badge.title = cloudUser ? cloudUser.email : 'Local profile';
}

function updateSyncPill(status, text) {
  const pill = document.getElementById('sync-pill');
  pill.className = `sync-pill ${status}`;
  pill.textContent = text;
}

async function initCloud() {
  if (!cloudConfig.url || !cloudConfig.key) {
    updateSyncPill('local', 'Local only');
    return;
  }
  try {
    updateSyncPill('syncing', 'Connecting…');
    const { createClient } = await import(SUPABASE_ESM);
    cloudClient = createClient(cloudConfig.url, cloudConfig.key, {
      auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
    });
    const { data, error } = await cloudClient.auth.getSession();
    if (error) throw error;
    cloudUser = data.session?.user || null;
    cloudClient.auth.onAuthStateChange((_event, session) => {
      cloudUser = session?.user || null;
      setTimeout(async () => {
        updateAccountUI();
        if (cloudUser) await pullCloud({ initial: true });
        else updateSyncPill('local', 'Signed out');
        if (currentView === 'settings') renderSettings();
      }, 0);
    });
    if (cloudUser) await pullCloud({ initial: true });
    else updateSyncPill('local', 'Cloud ready · signed out');
  } catch (error) {
    console.error(error);
    updateSyncPill('error', 'Cloud connection error');
  }
}

function scheduleCloudSync() {
  if (!cloudClient || !cloudUser || !navigator.onLine) {
    if (!navigator.onLine && cloudUser) updateSyncPill('offline', 'Offline · changes saved');
    return;
  }
  updateSyncPill('syncing', 'Changes pending…');
  clearTimeout(syncDebounce);
  syncDebounce = setTimeout(() => pushCloud({ auto: true }), 1400);
}

async function pushCloud({ auto = false, force = false } = {}) {
  if (!cloudClient || !cloudUser) {
    if (!auto) toast('Sign in to cloud sync first.');
    return;
  }
  if (isSyncing) return;
  isSyncing = true;
  updateSyncPill('syncing', 'Syncing…');
  try {
    if (!force) {
      const { data: remote, error: readError } = await cloudClient.from('user_app_state').select('state,updated_at').eq('user_id', cloudUser.id).maybeSingle();
      if (readError) throw readError;
      const remoteTime = remote?.state?.updatedAt ? Date.parse(remote.state.updatedAt) : 0;
      const localTime = state.updatedAt ? Date.parse(state.updatedAt) : 0;
      if (remote && remoteTime > localTime + 1000) {
        state = mergeDefaults(remote.state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        cloudDirty = false;
        renderCurrentView();
        updateSyncPill('synced', 'Cloud version loaded');
        toast('A newer cloud version was loaded.');
        return;
      }
    }
    const { error } = await cloudClient.from('user_app_state').upsert({ user_id: cloudUser.id, state }, { onConflict: 'user_id' });
    if (error) throw error;
    cloudDirty = false;
    updateSyncPill('synced', `Synced ${new Date().toLocaleTimeString('en-NZ', { hour:'2-digit', minute:'2-digit' })}`);
    if (!auto) toast('Cloud synchronisation completed.');
  } catch (error) {
    console.error(error);
    updateSyncPill('error', 'Sync failed');
    if (!auto) toast(`Sync failed: ${error.message}`);
  } finally {
    isSyncing = false;
  }
}

async function pullCloud({ initial = false, force = false } = {}) {
  if (!cloudClient || !cloudUser) {
    if (!initial) toast('Sign in to cloud sync first.');
    return;
  }
  if (isSyncing) return;
  isSyncing = true;
  updateSyncPill('syncing', 'Checking cloud…');
  try {
    const { data, error } = await cloudClient.from('user_app_state').select('state,updated_at').eq('user_id', cloudUser.id).maybeSingle();
    if (error) throw error;
    if (!data) {
      await cloudClient.from('user_app_state').insert({ user_id: cloudUser.id, state });
      hasLocalState = true;
      cloudDirty = false;
      updateSyncPill('synced', 'Initial cloud copy saved');
      return;
    }
    const remoteTime = data.state?.updatedAt ? Date.parse(data.state.updatedAt) : 0;
    const localTime = state.updatedAt ? Date.parse(state.updatedAt) : 0;
    // On a newly installed device, prefer the existing cloud copy even if the
    // freshly generated default local state has a newer timestamp.
    if (force || !hasLocalState || remoteTime > localTime) {
      state = mergeDefaults(data.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      hasLocalState = true;
      cloudDirty = false;
      renderCurrentView();
      updateSyncPill('synced', 'Cloud data loaded');
      if (!initial) toast('Cloud data loaded onto this device.');
    } else if (localTime > remoteTime) {
      isSyncing = false;
      await pushCloud({ auto: initial });
      return;
    } else {
      cloudDirty = false;
      updateSyncPill('synced', 'Up to date');
    }
  } catch (error) {
    console.error(error);
    updateSyncPill('error', 'Cloud check failed');
    if (!initial) toast(`Cloud check failed: ${error.message}`);
  } finally {
    isSyncing = false;
  }
}

async function handleAuth(form, action) {
  if (!cloudClient) {
    toast('Save a valid Supabase configuration first.');
    return;
  }
  const email = form.email.value.trim();
  const password = form.password.value;
  try {
    updateSyncPill('syncing', action === 'sign-up' ? 'Creating account…' : 'Signing in…');
    const result = action === 'sign-up'
      ? await cloudClient.auth.signUp({ email, password })
      : await cloudClient.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    if (action === 'sign-up' && !result.data.session) toast('Account created. Check your email to confirm it, then sign in.');
    else toast('Signed in.');
  } catch (error) {
    updateSyncPill('error', 'Authentication failed');
    toast(`Authentication failed: ${error.message}`);
  }
}

function openTimer() { document.getElementById('timer-dialog').showModal(); }
function updateTimerDisplay() {
  const min = String(Math.floor(timerRemaining / 60)).padStart(2, '0');
  const sec = String(timerRemaining % 60).padStart(2, '0');
  document.getElementById('timer-display').textContent = `${min}:${sec}`;
  document.getElementById('timer-start').textContent = timerRunning ? 'Pause' : timerRemaining === 0 ? 'Restart' : 'Start';
}
function setTimerMinutes(minutes) {
  clearInterval(timerInterval); timerRunning = false;
  timerDuration = Number(minutes) * 60; timerRemaining = timerDuration; updateTimerDisplay();
  document.querySelectorAll('[data-minutes]').forEach(btn => btn.classList.toggle('selected', Number(btn.dataset.minutes) === Number(minutes)));
}
function toggleTimer() {
  if (timerRemaining === 0) timerRemaining = timerDuration;
  timerRunning = !timerRunning;
  clearInterval(timerInterval);
  if (timerRunning) {
    timerInterval = setInterval(() => {
      timerRemaining -= 1;
      updateTimerDisplay();
      if (timerRemaining <= 0) {
        clearInterval(timerInterval); timerRunning = false; timerRemaining = 0; updateTimerDisplay();
        toast(`${document.getElementById('timer-label').value || 'Session'} completed.`);
        if ('Notification' in window && Notification.permission === 'granted') new Notification('Session complete', { body: document.getElementById('timer-label').value || 'Focused session completed.' });
      }
    }, 1000);
  }
  updateTimerDisplay();
}

async function requestInstall() {
  if (installPrompt) {
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null;
    document.getElementById('install-btn')?.classList.add('hidden');
  } else {
    toast('Use your browser menu and select Install app or Add to Home screen.');
  }
}

document.addEventListener('click', async event => {
  const nav = event.target.closest('[data-view]');
  if (nav) { showView(nav.dataset.view); return; }
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === 'open-timer') return openTimer();
  if (action === 'toggle-mode') {
    state.settings.programmeMode = state.settings.programmeMode === 'normal' ? 'minimum' : 'normal';
    saveState({ render: true }); toast(`Switched to ${state.settings.programmeMode} programme.`); return;
  }
  if (action === 'az-confidence') { findAZ(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'dan-confidence') { findDan(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'kata-confidence') { findKata(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'log-dan-practice') { const item=findDan(id); item.practiceCount=(item.practiceCount||0)+1; item.lastPractised=getNZDateKey(); if(item.status==='not-started') item.status='learning'; saveState({render:true}); toast('3rd Dan practice logged.'); return; }
  if (action === 'log-kata-practice') { const item=findKata(id); item.practiceCount=(item.practiceCount||0)+1; item.lastPractised=getNZDateKey(); if(item.status==='not-started') item.status='learning'; saveState({render:true}); toast(`${item.name} practice logged.`); return; }
  if (action === 'delete-note') { if (await confirmAction('Delete note?', 'This note will be permanently removed.')) { state.notes=state.notes.filter(n=>n.id!==id); saveState({render:true}); } return; }
  if (action === 'export-backup') return exportBackup();
  if (action === 'choose-import') return document.getElementById('import-file').click();
  if (action === 'save-programme-settings') { state.settings.programmeMode=document.getElementById('mode-toggle').checked?'minimum':'normal'; state.settings.programmeStartDate=document.getElementById('programme-start-date').value||PROGRAMME_START_DATE; state.settings.sessionStart=document.getElementById('session-start').value||'05:30'; state.settings.preferredEnd=document.getElementById('preferred-end').value||'07:00'; saveState({render:true}); toast('Programme settings saved.'); return; }
  if (action === 'save-cloud-config') {
    const url=document.getElementById('supabase-url').value.trim().replace(/\/$/,'');
    const key=document.getElementById('supabase-key').value.trim();
    if(!url || !key) return toast('Enter both the Supabase project URL and publishable key.');
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify({url,key})); toast('Cloud configuration saved. Reloading app…'); setTimeout(()=>location.reload(),600); return;
  }
  if (action === 'clear-cloud-config') { if(await confirmAction('Clear cloud configuration?','The app will continue in local-only mode.')) { localStorage.removeItem(CLOUD_CONFIG_KEY); location.reload(); } return; }
  if (action === 'sync-now') return pushCloud({force:false});
  if (action === 'pull-cloud') { if(await confirmAction('Replace this device with cloud data?','Any newer unsynchronised local changes may be replaced.')) return pullCloud({force:true}); return; }
  if (action === 'push-cloud') { if(await confirmAction('Replace cloud data with this device?','The local app state will be uploaded as the current cloud version.')) return pushCloud({force:true}); return; }
  if (action === 'sign-out') { await cloudClient?.auth.signOut(); toast('Signed out.'); return; }
  if (action === 'install-app') return requestInstall();
  if (action === 'reset-data') { if(await confirmAction('Reset all local data?','This removes progress, notes and reviews from this device.')) { state=defaultState(); localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); hasLocalState=true; cloudDirty=true; renderCurrentView(); toast('Local data reset.'); } return; }
});

document.addEventListener('change', event => {
  const el = event.target;
  if (el.matches('[data-daily-check]')) {
    const record=getDailyRecord(el.dataset.date); record.checks[el.dataset.dailyCheck]=el.checked; saveState({render:true}); return;
  }
  if (el.matches('[data-daily-field]')) {
    const record=getDailyRecord(el.dataset.date); record[el.dataset.dailyField]=el.value; saveState(); return;
  }
  if (el.matches('[data-az-status]')) { findAZ(el.dataset.azStatus).status=el.value; saveState(); return; }
  if (el.matches('[data-az-module]')) { const path=findAZ(el.dataset.azModule); path.modules.find(m=>m.id===el.dataset.moduleId).complete=el.checked; saveState({render:true}); return; }
  if (el.matches('[data-dan-status]')) { findDan(el.dataset.danStatus).status=el.value; saveState(); return; }
  if (el.matches('[data-dan-check]')) { const item=findDan(el.dataset.danCheck); item.checkpoints.find(c=>c.id===el.dataset.checkId).complete=el.checked; saveState({render:true}); return; }
  if (el.matches('[data-dan-side]')) { const item=findDan(el.dataset.danId); item[el.dataset.danSide==='right'?'rightComplete':'leftComplete']=el.checked; saveState(); return; }
  if (el.matches('[data-kata-status]')) { const item=findKata(el.dataset.kataStatus); item.status=el.value; if(el.value==='sequence-known'||el.value==='comfortable'||el.value==='complete') item.sequenceProgress=100; saveState({render:true}); return; }
  if (el.matches('[data-kata-progress]')) { const item=findKata(el.dataset.kataProgress); item.sequenceProgress=Number(el.value); if(item.sequenceProgress===100 && item.status==='learning') item.status='sequence-known'; saveState({render:true}); return; }
  if (el.id === 'import-file' && el.files?.[0]) { importBackup(el.files[0]); el.value=''; return; }
});

document.addEventListener('input', event => {
  const el=event.target;
  if (el.matches('[data-daily-field="notes"]')) scheduleInputSave(()=>{ getDailyRecord(el.dataset.date).notes=el.value; saveState(); });
  if (el.matches('[data-az-notes]')) scheduleInputSave(()=>{ findAZ(el.dataset.azNotes).notes=el.value; saveState(); });
  if (el.matches('[data-dan-notes]')) scheduleInputSave(()=>{ findDan(el.dataset.danNotes).notes=el.value; saveState(); });
  if (el.matches('[data-kata-notes]')) scheduleInputSave(()=>{ findKata(el.dataset.kataNotes).notes=el.value; saveState(); });
});

document.addEventListener('submit', async event => {
  if (event.target.id === 'note-form') {
    event.preventDefault(); const data=new FormData(event.target);
    state.notes.push({id:crypto.randomUUID(),title:data.get('title').trim(),body:data.get('body').trim(),createdAt:new Date().toISOString()});
    saveState({render:true}); toast('Note saved.'); return;
  }
  if (event.target.id === 'review-form') {
    event.preventDefault(); const data=new FormData(event.target); const weekStart=event.target.dataset.weekStart;
    const review={weekStart,success:data.get('success').trim(),difficulty:data.get('difficulty').trim(),learned:data.get('learned').trim(),adjustment:data.get('adjustment').trim(),sleepImpact:data.get('sleepImpact'),rating:Number(data.get('rating')),updatedAt:new Date().toISOString()};
    const index=state.weeklyReviews.findIndex(r=>r.weekStart===weekStart); if(index>=0) state.weeklyReviews[index]=review; else state.weeklyReviews.push(review);
    saveState({render:true}); toast('Weekly review saved.'); return;
  }
  if (event.target.id === 'auth-form') {
    event.preventDefault(); const submitter=event.submitter; await handleAuth(event.target, submitter?.value || 'sign-in'); return;
  }
});

document.getElementById('timer-btn').addEventListener('click', openTimer);
document.getElementById('sync-btn').addEventListener('click', () => cloudUser ? pushCloud() : showView('settings'));
document.getElementById('install-btn').addEventListener('click', requestInstall);
document.querySelectorAll('[data-minutes]').forEach(btn => btn.addEventListener('click', () => setTimerMinutes(btn.dataset.minutes)));
document.getElementById('timer-start').addEventListener('click', toggleTimer);
document.getElementById('timer-reset').addEventListener('click', () => setTimerMinutes(timerDuration / 60));

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt=event; document.getElementById('install-btn').classList.remove('hidden');
});
window.addEventListener('online', () => { if(cloudUser) { updateSyncPill('syncing','Back online · syncing…'); cloudDirty ? pushCloud({auto:true}) : pullCloud({initial:true}); } });
window.addEventListener('offline', () => { if(cloudUser) updateSyncPill('offline','Offline · changes saved'); });
document.addEventListener('visibilitychange', () => { if(document.visibilityState==='visible' && cloudUser && navigator.onLine) pullCloud({initial:true}); });

if ('serviceWorker' in navigator) {
  let reloadingForUpdate = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloadingForUpdate) return;
    reloadingForUpdate = true;
    location.reload();
  });
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).then(registration => {
    registration.update().catch(() => {});
  }).catch(console.error));
}
if ('Notification' in window && Notification.permission === 'default') {
  // Permission is requested only after the user starts a timer, avoiding an intrusive startup prompt.
  document.getElementById('timer-start').addEventListener('click', () => Notification.requestPermission(), { once:true });
}

showView('today');
initCloud();
setInterval(() => { if(cloudUser && navigator.onLine && !cloudDirty) pullCloud({initial:true}); }, 60000);
