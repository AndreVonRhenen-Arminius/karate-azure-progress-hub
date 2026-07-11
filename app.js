const STORAGE_KEY = 'ka_progress_hub_state_v1';
const CLOUD_CONFIG_KEY = 'ka_progress_hub_cloud_config_v1';
const CLOUD_PROVIDER_KEY = 'ka_progress_hub_cloud_provider_v1';
const MICROSOFT_CONFIG_KEY = 'ka_progress_hub_microsoft_config_v1';
const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const MSAL_BROWSER_VERSION = '5.17.0';
const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const MICROSOFT_GRAPH_SCOPES = ['Files.ReadWrite.AppFolder'];
const ONEDRIVE_STATE_FILE = 'karate-azure-progress-state.json';

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

const APP_VERSION = '1.8.0';
const STATE_VERSION = 5;
const PROGRAMME_START_DATE = '2026-07-11';

const MASTERY_LEVELS = [
  [0, 'Not started'],
  [1, 'Introduced'],
  [2, 'Understood'],
  [3, 'Practised'],
  [4, 'Applied'],
  [5, 'Exam ready']
];

const RECALL_RESULTS = [
  ['incorrect', 'Incorrect'],
  ['partial', 'Partly correct'],
  ['assisted', 'Correct with help'],
  ['independent', 'Correct without help']
];

const KARATE_RATING_FIELDS = [
  ['stance', 'Stance'],
  ['balance', 'Balance'],
  ['hips', 'Hip movement'],
  ['path', 'Technique path'],
  ['timing', 'Timing'],
  ['power', 'Speed and power'],
  ['breathing', 'Breathing'],
  ['right', 'Right side'],
  ['left', 'Left side']
];

const KATA_SECTION_LEVELS = [
  [0, 'Not learned'],
  [1, 'Learning'],
  [2, 'Known slowly'],
  [3, 'Without assistance'],
  [4, 'Grading speed'],
  [5, 'Instructor checked']
];

const KATA_SECTION_NAMES = [
  'Opening section',
  'First direction change',
  'Middle sequence',
  'Final sequence',
  'Embusen and directions',
  'Kiai points',
  'Rhythm',
  'Power and relaxation',
  'Bunkai or explanation'
];

const DAY_PLANS = {
  normal: {
    Monday: {
      family: 'Office day. Complete the task when the day allows. Family and housework remain protected in the evening.',
      tasks: [
        { id: 'az-theory-am', title: 'AZ-104 study and recall', type: 'azure', items: ['Complete the planned Microsoft Learn module or current topic', 'Write concise notes while learning', 'Explain the main concept without notes', 'Record one practical or troubleshooting example', 'Mark difficult concepts for revision', 'Update AZ-104 mastery and review date'] }
      ]
    },
    Tuesday: {
      family: 'Work-from-home and dojo day. Complete the personal training task when it fits around work and family.',
      tasks: [
        { id: 'dan-group-a-am', title: '3rd Dan kihon and current kata', type: 'dan', items: ['Practise Group A kihon from free kamae', 'Work the combinations on both right and left sides', 'Focus on controlled stepping, posture and hip connection', 'Record one technical issue to correct', 'Review the previous section of the current kata', 'Learn or refine one kata section', 'Join the kata sections slowly', 'Update the karate assessment'] }
      ]
    },
    Wednesday: {
      family: 'Office day. Complete the practical task when the day allows.',
      tasks: [
        { id: 'az-lab-am', title: 'AZ-104 practical lab and troubleshooting', type: 'azure', items: ['Complete a portal, PowerShell, Azure CLI or Bicep exercise', 'Record what was configured and why', 'Record what failed and how it was diagnosed', 'Verify the final result', 'Remove unnecessary lab resources', 'Save the lab journal entry and update mastery'] }
      ]
    },
    Thursday: {
      family: 'Work-from-home and dojo day. Complete the personal training task when practical.',
      tasks: [
        { id: 'kata-sequence-am', title: 'Current kata and 3rd Dan kicking', type: 'kata', items: ['Review Tuesday’s kata section', 'Add or refine the next kata section', 'Complete one full slow walkthrough', 'Practise the 3rd Dan kicking combinations', 'Work both right and left sides', 'Focus on balance, correct return and posture', 'Update kata sections and technique ratings'] }
      ]
    },
    Friday: {
      family: 'Office day. Keep this task lighter so recovery remains manageable before the weekend.',
      tasks: [
        { id: 'az-light-am', title: 'Light AZ-104 revision and planning', type: 'azure', items: ['Answer due recall questions', 'Revisit an incorrect knowledge check', 'Review notes or flashcards', 'Complete one small unfinished item if useful', 'Prepare the next practical task', 'Update the next review date'] }
      ]
    },
    Saturday: {
      family: 'Main development day. Complete the combined task when it best fits around family and household activity.',
      tasks: [
        { id: 'az-scenario-am', title: 'AZ-104 practical and kata development', type: 'combined', items: ['Continue the current AZ-104 learning path', 'Complete a practical scenario and record the evidence', 'Record what worked, what failed and what to repeat', 'Review one overdue kata', 'Develop the current kata sequence', 'Record one full kata performance or memory test'] }
      ]
    },
    Sunday: {
      family: 'Church and family day. Complete the review task when the day allows.',
      tasks: [
        { id: 'az-weekly-am', title: 'Weekly review and kata retention', type: 'review', items: ['Review due AZ-104 topics', 'Repeat important Azure settings or commands', 'Identify one weak Azure topic', 'Perform the current kata without assistance', 'Test the most overdue retention kata', 'Record any sequence gaps', 'Complete the weekly review', 'Confirm next week’s priorities'] }
      ]
    }
  },
  minimum: {
    Monday: { family: 'Office day. Complete one focused task when possible.', tasks: [{ id: 'min-az-am', title: 'Minimum AZ-104 task', type: 'azure', items: ['Complete one focused study block and record the next review'] }] },
    Tuesday: { family: 'Work-from-home and dojo day.', tasks: [{ id: 'min-kihon-am', title: 'Minimum 3rd Dan task', type: 'dan', items: ['Practise one syllabus combination slowly on both sides and rate the weak areas'] }] },
    Wednesday: { family: 'Office day.', tasks: [{ id: 'min-rest-wed-am', title: 'Recovery task', type: 'recovery', items: ['No scheduled study or personal karate is required'] }] },
    Thursday: { family: 'Work-from-home and dojo day.', tasks: [{ id: 'min-kata-am', title: 'Minimum kata task', type: 'kata', items: ['Review the current kata sequence and update one section'] }] },
    Friday: { family: 'Office day.', tasks: [{ id: 'min-rest-fri-am', title: 'Recovery task', type: 'recovery', items: ['No scheduled study or personal karate is required'] }] },
    Saturday: { family: 'Short combined development task.', tasks: [{ id: 'min-sat-az-am', title: 'Minimum Azure and kata task', type: 'combined', items: ['Complete one focused AZ-104 theory or lab item', 'Practise the current or most overdue kata'] }] },
    Sunday: { family: 'Church and family day.', tasks: [{ id: 'min-review-am', title: 'Minimum weekly review', type: 'review', items: ['Record progress and select the next Azure and karate priorities'] }] }
  }
};

const TASK_CHECK_MIGRATIONS = {
  normal: {
    Monday: [{ from: 'az-recall-am', to: 'az-theory-am', offset: 3 }],
    Tuesday: [{ from: 'new-kata-am', to: 'dan-group-a-am', offset: 4 }, { from: 'tue-log-am', to: 'dan-group-a-am', offset: 7 }],
    Wednesday: [{ from: 'az-troubleshoot-am', to: 'az-lab-am', offset: 3 }],
    Thursday: [{ from: 'dan-group-b-am', to: 'kata-sequence-am', offset: 3 }, { from: 'thu-log-am', to: 'kata-sequence-am', offset: 6 }],
    Friday: [{ from: 'fri-plan-am', to: 'az-light-am', offset: 3 }],
    Saturday: [{ from: 'kata-main-am', to: 'az-scenario-am', offset: 3 }],
    Sunday: [{ from: 'kata-test-am', to: 'az-weekly-am', offset: 3 }, { from: 'weekly-plan-am', to: 'az-weekly-am', offset: 6 }]
  },
  minimum: {
    Saturday: [{ from: 'min-sat-kata-am', to: 'min-sat-az-am', offset: 1 }]
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

function defaultKataSections(sequenceProgress = 0) {
  const level = Number(sequenceProgress) >= 100 ? 5 : Number(sequenceProgress) > 0 ? Math.max(1, Math.round(Number(sequenceProgress) / 20)) : 0;
  return KATA_SECTION_NAMES.map((name, index) => ({ id: `section-${index + 1}`, name, level }));
}

function defaultRatings() {
  return Object.fromEntries(KARATE_RATING_FIELDS.map(([key]) => [key, 1]));
}

function defaultEvidence() {
  return { learned: false, recalled: false, practised: false, troubleshot: false, verified: false };
}

function defaultState() {
  const today = getNZDateKey();
  return {
    version: STATE_VERSION,
    profile: { name: 'André' },
    settings: { programmeMode: 'normal', programmeStartDate: PROGRAMME_START_DATE, rolloverEnabled: true, rolloverStartDate: PROGRAMME_START_DATE, timezone: 'Pacific/Auckland' },
    azPaths: DEFAULT_AZ_PATHS.map(p => ({
      ...p,
      status: 'not-started',
      confidence: 1,
      notes: '',
      modules: p.modules.map((name, i) => ({
        id: `${p.id}-m${i + 1}`,
        name,
        complete: false,
        masteryLevel: 0,
        evidence: defaultEvidence(),
        lastStudied: '',
        lastReviewed: '',
        nextReview: '',
        reviewIntervalDays: 0,
        lastRecallResult: 'not-tested',
        recallHistory: [],
        customQuestions: []
      }))
    })),
    syllabus: DEFAULT_SYLLABUS.map(s => ({
      ...s,
      status: 'not-started',
      confidence: 1,
      notes: '',
      lastPractised: '',
      rightComplete: false,
      leftComplete: false,
      practiceCount: 0,
      ratings: defaultRatings(),
      lastAssessmentResult: '',
      checkpoints: s.checkpoints.map((name, i) => ({ id: `${s.id}-c${i + 1}`, name, complete: false }))
    })),
    katas: structuredClone(DEFAULT_KATAS).map(kata => ({
      ...kata,
      sections: defaultKataSections(kata.sequenceProgress),
      retentionIntervalDays: kata.category === 'known' ? 14 : 7,
      nextReview: kata.category === 'known' ? today : '',
      lastPerformanceResult: ''
    })),
    azureLabs: [],
    daily: {},
    notes: [],
    weeklyReviews: [],
    updatedAt: new Date().toISOString()
  };
}

function migrateTaskChecks(record, dateKey) {
  const mode = DAY_PLANS[record.planMode] ? record.planMode : 'normal';
  const day = getDayName(dateKey);
  const migrations = TASK_CHECK_MIGRATIONS[mode]?.[day] || [];
  record.checks = record.checks && typeof record.checks === 'object' ? record.checks : {};
  for (const migration of migrations) {
    for (let index = 0; index < 20; index += 1) {
      const oldKey = taskSubKey(migration.from, index);
      if (!(oldKey in record.checks)) continue;
      const newKey = taskSubKey(migration.to, migration.offset + index);
      if (!(newKey in record.checks)) record.checks[newKey] = record.checks[oldKey];
    }
  }
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

  merged.azPaths = mergeCollection(base.azPaths, saved.azPaths, item => {
    const savedPath = (saved.azPaths || []).find(x => x.id === item.id);
    return {
      ...item,
      modules: mergeCollection(item.modules, savedPath?.modules || [], module => {
        const savedModule = (savedPath?.modules || []).find(x => x.id === module.id) || {};
        const completed = Boolean(savedModule.complete ?? module.complete);
        return {
          ...module,
          ...savedModule,
          complete: completed,
          masteryLevel: Number(savedModule.masteryLevel ?? (completed ? 1 : module.masteryLevel ?? 0)),
          evidence: { ...defaultEvidence(), ...(module.evidence || {}), ...(savedModule.evidence || {}), learned: Boolean(savedModule.evidence?.learned ?? completed) },
          recallHistory: Array.isArray(savedModule.recallHistory) ? savedModule.recallHistory : [],
          customQuestions: Array.isArray(savedModule.customQuestions) ? savedModule.customQuestions : []
        };
      })
    };
  });

  merged.syllabus = mergeCollection(base.syllabus, saved.syllabus, item => {
    const savedItem = (saved.syllabus || []).find(x => x.id === item.id) || {};
    const ratings = { ...defaultRatings(), ...(item.ratings || {}), ...(savedItem.ratings || {}) };
    if (savedItem.rightComplete && !savedItem.ratings?.right) ratings.right = 5;
    if (savedItem.leftComplete && !savedItem.ratings?.left) ratings.left = 5;
    return {
      ...item,
      ratings,
      checkpoints: mergeCollection(item.checkpoints, savedItem.checkpoints || [])
    };
  });

  merged.katas = mergeCollection(base.katas, saved.katas, item => {
    const savedKata = (saved.katas || []).find(x => x.id === item.id) || {};
    const progress = Number(savedKata.sequenceProgress ?? item.sequenceProgress ?? 0);
    const defaultSections = defaultKataSections(progress);
    return {
      ...item,
      sections: mergeCollection(defaultSections, savedKata.sections || []),
      retentionIntervalDays: Number(savedKata.retentionIntervalDays || item.retentionIntervalDays || 7),
      nextReview: savedKata.nextReview ?? item.nextReview ?? '',
      lastPerformanceResult: savedKata.lastPerformanceResult || ''
    };
  });

  merged.azureLabs = Array.isArray(saved.azureLabs) ? saved.azureLabs : [];
  const savedDaily = saved.daily && typeof saved.daily === 'object' && !Array.isArray(saved.daily) ? saved.daily : {};
  merged.daily = Object.fromEntries(Object.entries(savedDaily).map(([key, record]) => [key, {
    checks: {},
    notes: '',
    energy: 3,
    result: 'not-set',
    planMode: merged.settings.programmeMode,
    ...(record && typeof record === 'object' ? record : {})
  }]));
  merged.notes = Array.isArray(saved.notes) ? saved.notes : [];
  merged.weeklyReviews = Array.isArray(saved.weeklyReviews) ? saved.weeklyReviews : [];
  if (!DAY_PLANS[merged.settings.programmeMode]) merged.settings.programmeMode = 'normal';

  if (Number(saved.version || 1) < 2) {
    merged.settings.programmeStartDate = PROGRAMME_START_DATE;
  }

  if (Number(saved.version || 1) < 3) {
    Object.values(merged.daily).forEach(record => {
      if (record && !DAY_PLANS[record.planMode]) record.planMode = merged.settings.programmeMode;
    });
  }

  if (Number(saved.version || 1) < 4) {
    Object.entries(merged.daily).forEach(([dateKey, record]) => migrateTaskChecks(record, dateKey));
  }

  if (Number(saved.version || 1) < 5) {
    // Start rollover from the upgrade day so older saved history is never rearranged.
    merged.settings.rolloverEnabled = true;
    merged.settings.rolloverStartDate = getNZDateKey();
    Object.entries(merged.daily).forEach(([dateKey, record]) => {
      record.taskSourceDate = record.taskSourceDate || dateKey;
      record.taskPlanMode = DAY_PLANS[record.taskPlanMode] ? record.taskPlanMode : (DAY_PLANS[record.planMode] ? record.planMode : merged.settings.programmeMode);
    });
  }

  if (typeof merged.settings.rolloverEnabled !== 'boolean') merged.settings.rolloverEnabled = true;
  if (!merged.settings.rolloverStartDate) merged.settings.rolloverStartDate = merged.settings.programmeStartDate || PROGRAMME_START_DATE;

  merged.version = STATE_VERSION;
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
let cloudProvider = loadCloudProvider();
let microsoftConfig = loadMicrosoftConfig();
let microsoftClient = null;
let microsoftAccount = null;
let microsoftModule = null;
let cloudDirty = false;
let syncDebounce = null;
let isSyncing = false;
let installPrompt = null;
let inputSaveTimers = new Map();
let selectedDateKey = getNZDateKey();
let timerDuration = 45 * 60;
let timerRemaining = timerDuration;
let timerInterval = null;
let timerRunning = false;
let timerEndAt = null;

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

function getCurrentRedirectUri() {
  const loc = window.location || location;
  const origin = loc?.origin || '';
  const pathname = loc?.pathname || '/';
  return origin && origin !== 'null' ? `${origin}${pathname}` : '';
}

function loadMicrosoftConfig() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(MICROSOFT_CONFIG_KEY)) || {}; }
  catch { saved = {}; }
  const deployed = window.KA_MICROSOFT_CONFIG || {};
  return {
    clientId: saved.clientId || deployed.clientId || '',
    authority: saved.authority || deployed.authority || 'https://login.microsoftonline.com/common',
    redirectUri: saved.redirectUri || deployed.redirectUri || getCurrentRedirectUri()
  };
}

function loadCloudProvider() {
  const saved = localStorage.getItem(CLOUD_PROVIDER_KEY);
  return ['local', 'supabase', 'onedrive'].includes(saved) ? saved : 'supabase';
}

function setCloudProvider(provider) {
  cloudProvider = ['local', 'supabase', 'onedrive'].includes(provider) ? provider : 'local';
  localStorage.setItem(CLOUD_PROVIDER_KEY, cloudProvider);
  updateAccountUI();
  updateProviderStatus();
}

function oneDriveStateUrl() {
  return `${MICROSOFT_GRAPH_BASE}/me/drive/special/approot:/${encodeURIComponent(ONEDRIVE_STATE_FILE)}:/content`;
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
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
}

function formatDateKey(key, options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) {
  return new Intl.DateTimeFormat('en-NZ', { ...options, timeZone: 'UTC' }).format(parseDateKey(key));
}

function getDayName(key = getNZDateKey()) {
  return new Intl.DateTimeFormat('en-NZ', { weekday: 'long', timeZone: 'UTC' }).format(parseDateKey(key));
}

function addDays(key, count) {
  const date = parseDateKey(key);
  date.setUTCDate(date.getUTCDate() + Number(count));
  return date.toISOString().slice(0, 10);
}

function getWeekStart(key = getNZDateKey()) {
  const date = parseDateKey(key);
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}

function getBasePlanForDate(key, mode = state.settings.programmeMode) {
  const safeMode = DAY_PLANS[mode] ? mode : state.settings.programmeMode;
  return DAY_PLANS[safeMode]?.[getDayName(key)] || null;
}

function getBaseTaskAssignment(sourceDate, mode = state.settings.programmeMode) {
  const safeMode = DAY_PLANS[mode] ? mode : state.settings.programmeMode;
  const plan = getBasePlanForDate(sourceDate, safeMode);
  return plan ? { sourceDate, planMode: safeMode, plan, task: plan.tasks[0] } : null;
}

function taskSubKey(taskId, index) { return `${taskId}::${index}`; }

function taskChecklistCompletion(record, task) {
  if (!record || !task?.items?.length) return 0;
  const checks = record.checks || {};
  const done = task.items.filter((_, index) => checks[taskSubKey(task.id, index)]).length;
  return Math.round(done / task.items.length * 100);
}

function recordAdvancesQueue(record, task) {
  if (task?.type === 'recovery') return true;
  if (!record) return false;
  if (['completed', 'completed-hard', 'skipped'].includes(record.result)) return true;
  return taskChecklistCompletion(record, task) === 100;
}

function getTaskAssignmentForDate(key) {
  const programmeStart = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  if (key < programmeStart) return null;

  const rolloverEnabled = state.settings.rolloverEnabled !== false;
  const rolloverStart = [programmeStart, state.settings.rolloverStartDate || programmeStart].sort().at(-1);
  if (!rolloverEnabled || key < rolloverStart) {
    const saved = state.daily[key];
    return getBaseTaskAssignment(saved?.taskSourceDate || key, saved?.taskPlanMode || saved?.planMode || state.settings.programmeMode);
  }

  const todayKey = getNZDateKey();
  let sourceCursor = rolloverStart;
  let sourceModeCursor = state.daily[rolloverStart]?.taskPlanMode || state.daily[rolloverStart]?.planMode || state.settings.programmeMode;
  let actualDate = rolloverStart;
  let assignment = null;

  while (actualDate <= key) {
    const savedRecord = state.daily[actualDate];
    if (savedRecord?.taskSourceDate) {
      sourceCursor = savedRecord.taskSourceDate;
      sourceModeCursor = savedRecord.taskPlanMode || savedRecord.planMode || sourceModeCursor;
    }

    // A recovery slot still occupies its own original day, but it never blocks a later carried task.
    while (sourceCursor < actualDate) {
      const pending = getBaseTaskAssignment(sourceCursor, sourceModeCursor);
      if (pending?.task?.type !== 'recovery') break;
      sourceCursor = addDays(sourceCursor, 1);
      sourceModeCursor = state.settings.programmeMode;
    }

    const planMode = savedRecord?.taskPlanMode || savedRecord?.planMode || sourceModeCursor;
    assignment = getBaseTaskAssignment(sourceCursor, planMode);
    if (!assignment) return null;
    assignment.actualDate = actualDate;
    assignment.carriedOver = assignment.sourceDate < actualDate;
    assignment.delayDays = Math.max(0, daysBetween(actualDate, assignment.sourceDate));

    if (actualDate === key) return assignment;
    const advances = recordAdvancesQueue(savedRecord, assignment.task) || (!savedRecord && actualDate >= todayKey);
    if (advances) {
      sourceCursor = addDays(assignment.sourceDate, 1);
      sourceModeCursor = state.settings.programmeMode;
    } else {
      sourceCursor = assignment.sourceDate;
      sourceModeCursor = assignment.planMode;
    }
    actualDate = addDays(actualDate, 1);
  }
  return assignment;
}

function getDailyRecord(key = getNZDateKey(), { create = true, assignment = null } = {}) {
  if (state.daily[key]) return state.daily[key];
  const resolved = assignment || getTaskAssignmentForDate(key) || getBaseTaskAssignment(key, state.settings.programmeMode);
  const record = {
    checks: {},
    notes: '',
    energy: 3,
    result: 'not-set',
    planMode: resolved?.planMode || state.settings.programmeMode,
    taskPlanMode: resolved?.planMode || state.settings.programmeMode,
    taskSourceDate: resolved?.sourceDate || key
  };
  if (create) state.daily[key] = record;
  return record;
}

function getPlanModeForDate(key) {
  const assignment = getTaskAssignmentForDate(key);
  return assignment?.planMode || state.settings.programmeMode;
}

function getPlanForDate(key) {
  return getTaskAssignmentForDate(key)?.plan || null;
}

function dayCompletion(key) {
  const assignment = getTaskAssignmentForDate(key);
  const record = state.daily[key];
  if (!assignment || !record || record.result === 'skipped') return 0;
  if (['completed', 'completed-hard'].includes(record.result)) return 100;
  return taskChecklistCompletion(record, assignment.task);
}

function getDayTaskStatus(key) {
  const assignment = getTaskAssignmentForDate(key);
  const record = state.daily[key];
  if (!assignment) return { label: 'No task', className: 'amber' };
  if (record?.result === 'skipped') return { label: 'Skipped', className: 'amber' };
  const completion = dayCompletion(key);
  if (completion === 100) return { label: 'Completed', className: 'green' };
  if (record && (completion > 0 || record.result === 'partial')) return { label: `${completion}% complete`, className: 'blue' };
  if (record?.result === 'not-completed') return { label: 'Not completed', className: 'red' };
  return { label: 'Not started', className: 'blue' };
}

function currentAZPath() {
  return state.azPaths.find(p => !['complete', 'confident'].includes(p.status)) || state.azPaths.at(-1);
}

function currentKata() {
  return state.katas.find(k => k.category === 'planned' && k.status !== 'not-started' && k.status !== 'complete') || state.katas.find(k => k.category === 'planned' && k.status === 'not-started') || state.katas[0];
}

function getAllAzureModules() {
  return state.azPaths.flatMap(path => path.modules.map(module => ({ path, module })));
}

function findAZModule(pathId, moduleId) {
  return findAZ(pathId)?.modules.find(module => module.id === moduleId);
}

function daysBetween(laterKey, earlierKey) {
  if (!laterKey || !earlierKey) return 0;
  return Math.round((parseDateKey(laterKey) - parseDateKey(earlierKey)) / 86400000);
}

function average(values) {
  const numbers = values.map(Number).filter(Number.isFinite);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
}

function getNextReviewInterval(currentDays = 0, result = 'independent') {
  if (result === 'incorrect') return 1;
  if (result === 'partial') return 3;
  if (result === 'assisted') return Math.max(7, Math.min(14, Number(currentDays) || 7));
  const sequence = [1, 3, 7, 14, 30, 60];
  return sequence.find(days => days > Number(currentDays || 0)) || 60;
}

function recordAzureReview(pathId, moduleId, result) {
  const module = findAZModule(pathId, moduleId);
  if (!module) return false;
  const today = getNZDateKey();
  const interval = getNextReviewInterval(module.reviewIntervalDays, result);
  module.lastReviewed = today;
  module.lastRecallResult = result;
  module.reviewIntervalDays = interval;
  module.nextReview = addDays(today, interval);
  module.evidence = { ...defaultEvidence(), ...(module.evidence || {}) };
  module.evidence.recalled = result !== 'incorrect';
  if (result === 'independent') module.masteryLevel = Math.max(Number(module.masteryLevel || 0), 2);
  if (result === 'assisted') module.masteryLevel = Math.max(Number(module.masteryLevel || 0), 1);
  module.recallHistory = Array.isArray(module.recallHistory) ? module.recallHistory : [];
  module.recallHistory.push({ date: today, result, intervalDays: interval });
  return true;
}

function updateKataProgressFromSections(kata) {
  const sections = Array.isArray(kata.sections) ? kata.sections : [];
  kata.sequenceProgress = sections.length ? Math.round(average(sections.map(section => Number(section.level || 0))) / 5 * 100) : 0;
  if (kata.sequenceProgress > 0 && kata.status === 'not-started') kata.status = 'learning';
  if (kata.sequenceProgress >= 100 && ['not-started', 'learning', 'developing'].includes(kata.status)) kata.status = 'sequence-known';
}

function getNextKataInterval(currentDays = 0) {
  const sequence = [3, 7, 14, 30, 60, 90];
  return sequence.find(days => days > Number(currentDays || 0)) || 90;
}

function getAzurePriority(referenceDate = getNZDateKey()) {
  const currentPath = currentAZPath();
  const candidates = getAllAzureModules().map(({ path, module }) => {
    const mastery = Number(module.masteryLevel || 0);
    const overdueDays = module.nextReview && module.nextReview <= referenceDate ? Math.max(0, daysBetween(referenceDate, module.nextReview)) : 0;
    let score = (5 - mastery) * 16;
    if (!module.complete) score += 18;
    if (path.id === currentPath?.id) score += 12;
    if (module.nextReview && module.nextReview <= referenceDate) score += 30 + Math.min(30, overdueDays * 3);
    if (module.lastRecallResult === 'incorrect') score += 28;
    if (module.lastRecallResult === 'partial') score += 18;
    if (!module.evidence?.practised) score += 10;
    if (!module.evidence?.troubleshot) score += 6;
    return { path, module, score, overdueDays };
  }).sort((a, b) => b.score - a.score);

  const priority = candidates[0];
  if (!priority) return null;
  const reasons = [];
  if (priority.module.nextReview && priority.module.nextReview <= referenceDate) reasons.push(priority.overdueDays ? `${priority.overdueDays} day${priority.overdueDays === 1 ? '' : 's'} overdue` : 'review due today');
  if (!priority.module.complete) reasons.push('learning content is incomplete');
  if (Number(priority.module.masteryLevel || 0) < 3) reasons.push(`mastery is ${Number(priority.module.masteryLevel || 0)}/5`);
  if (!priority.module.evidence?.practised) reasons.push('no practical evidence recorded');
  if (priority.module.lastRecallResult === 'incorrect' || priority.module.lastRecallResult === 'partial') reasons.push(`last recall was ${priority.module.lastRecallResult}`);
  return {
    kind: 'Azure',
    title: priority.module.name,
    subtitle: priority.path.name.replace('AZ-104: ', ''),
    reason: reasons.slice(0, 2).join(' · ') || 'best next topic from current progress',
    tasks: [
      `Explain ${priority.module.name} without notes`,
      priority.module.evidence?.practised ? 'Repeat or extend the practical scenario' : 'Complete one portal, PowerShell, CLI or Bicep task',
      'Record one likely failure and how to verify it',
      'Rate recall and schedule the next review'
    ],
    pathId: priority.path.id,
    moduleId: priority.module.id
  };
}

function getDanPriority(referenceDate = getNZDateKey()) {
  const candidates = state.syllabus.map(item => {
    const ratings = KARATE_RATING_FIELDS.map(([key]) => Number(item.ratings?.[key] || 1));
    const ratingAverage = average(ratings);
    const daysSince = item.lastPractised ? Math.max(0, daysBetween(referenceDate, item.lastPractised)) : 30;
    const incompleteChecks = item.checkpoints.filter(check => !check.complete).length;
    const incompleteRatio = item.checkpoints.length ? incompleteChecks / item.checkpoints.length : 0;
    return { item, ratingAverage, score: (5 - ratingAverage) * 20 + Math.min(30, daysSince) + incompleteRatio * 20 };
  }).sort((a, b) => b.score - a.score);
  const priority = candidates[0];
  if (!priority) return null;
  const weakest = KARATE_RATING_FIELDS
    .map(([key, label]) => ({ key, label, value: Number(priority.item.ratings?.[key] || 1) }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 2);
  return {
    kind: '3rd Dan',
    title: priority.item.title,
    subtitle: priority.item.group,
    reason: `${weakest.map(field => `${field.label} ${field.value}/5`).join(' · ')}${priority.item.lastPractised ? ` · last practised ${formatDateKey(priority.item.lastPractised, { day:'numeric', month:'short' })}` : ' · no practice logged'}`,
    tasks: [
      'Perform five slow repetitions on the right',
      'Perform five slow repetitions on the left',
      `Concentrate on ${weakest.map(field => field.label.toLowerCase()).join(' and ')}`,
      'Finish with three repetitions at grading speed and update the assessment'
    ],
    itemId: priority.item.id
  };
}

function getKataPriority(referenceDate = getNZDateKey()) {
  const candidates = state.katas.map(kata => {
    const sectionAverage = average((kata.sections || []).map(section => Number(section.level || 0)));
    const overdueDays = kata.nextReview && kata.nextReview <= referenceDate ? Math.max(0, daysBetween(referenceDate, kata.nextReview)) : 0;
    let score = (5 - sectionAverage) * 12 + (5 - Number(kata.confidence || 1)) * 5;
    if (kata.nextReview && kata.nextReview <= referenceDate) score += 35 + Math.min(30, overdueDays * 3);
    if (kata.status !== 'not-started' && Number(kata.sequenceProgress || 0) < 100) score += 24;
    if (kata.id === currentKata()?.id) score += 15;
    return { kata, sectionAverage, score, overdueDays };
  }).sort((a, b) => b.score - a.score);
  const priority = candidates[0];
  if (!priority) return null;
  const weakSections = [...(priority.kata.sections || [])].sort((a, b) => Number(a.level || 0) - Number(b.level || 0)).slice(0, 2);
  const reasons = [];
  if (priority.kata.nextReview && priority.kata.nextReview <= referenceDate) reasons.push(priority.overdueDays ? `${priority.overdueDays} day${priority.overdueDays === 1 ? '' : 's'} overdue` : 'retention review due today');
  if (Number(priority.kata.sequenceProgress || 0) < 100) reasons.push(`sequence ${Number(priority.kata.sequenceProgress || 0)}%`);
  reasons.push(`${weakSections.map(section => section.name).join(' and ')} need attention`);
  return {
    kind: 'Kata',
    title: priority.kata.name,
    subtitle: priority.kata.status === 'not-started' ? 'Planned kata' : 'Sequence and retention',
    reason: reasons.slice(0, 2).join(' · '),
    tasks: [
      `Review ${weakSections.map(section => section.name.toLowerCase()).join(' and ')}`,
      'Complete one slow walkthrough without stopping',
      'Perform once at grading speed or complete a memory test',
      'Record a clean performance or mistakes found'
    ],
    kataId: priority.kata.id
  };
}

function getAdaptiveFocus(taskType, referenceDate = getNZDateKey()) {
  if (taskType === 'azure') return [getAzurePriority(referenceDate)].filter(Boolean);
  if (taskType === 'dan') return [getDanPriority(referenceDate), getKataPriority(referenceDate)].filter(Boolean);
  if (taskType === 'kata') return [getKataPriority(referenceDate), getDanPriority(referenceDate)].filter(Boolean);
  if (taskType === 'combined' || taskType === 'review') return [getAzurePriority(referenceDate), getKataPriority(referenceDate)].filter(Boolean);
  return [];
}

function renderAdaptiveFocus(taskType, referenceDate) {
  const recommendations = getAdaptiveFocus(taskType, referenceDate);
  if (!recommendations.length) return '';
  return `<div class="coach-panel">
    <div class="coach-heading"><strong>Focus guidance for this task</strong><span>This supports the single daily task; it is not an additional task.</span></div>
    <div class="coach-grid">
      ${recommendations.map(item => `<div class="coach-item">
        <span class="badge ${item.kind === 'Azure' ? 'blue' : 'red'}">${escapeHTML(item.kind)}</span>
        <h4>${escapeHTML(item.title)}</h4>
        <p class="small muted">${escapeHTML(item.subtitle)}</p>
        <p>${escapeHTML(item.reason)}</p>
        <ul>${item.tasks.map(task => `<li>${escapeHTML(task)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>`;
}

function renderKarateFocusSummary(referenceDate = getNZDateKey()) {
  const kata = getKataPriority(referenceDate);
  const grading = getDanPriority(referenceDate);
  if (!kata && !grading) return '';
  return `<div class="focus-summary" aria-label="Current karate priorities">
    ${kata ? `<article class="focus-summary-card kata-focus">
      <span class="focus-kicker">Kata focus</span>
      <h3>${escapeHTML(kata.title)}</h3>
      <p>${escapeHTML(kata.reason)}</p>
    </article>` : ''}
    ${grading ? `<article class="focus-summary-card grading-focus">
      <span class="focus-kicker">3rd Dan grading focus · ${escapeHTML(grading.subtitle)}</span>
      <h3>${escapeHTML(grading.title)}</h3>
      <p>${escapeHTML(grading.reason)}</p>
    </article>` : ''}
  </div>`;
}

function getModuleRecallQuestions(module) {
  const defaults = [
    `Explain ${module.name} in your own words without using notes.`,
    `Describe one Azure configuration or administrative task involving ${module.name}.`,
    `Name one likely failure involving ${module.name} and explain how you would verify it.`,
    `What is the closest alternative or related Azure feature, and when would you use each?`
  ];
  return [...defaults, ...(Array.isArray(module.customQuestions) ? module.customQuestions : [])];
}

function masteryOptions(current) {
  return MASTERY_LEVELS.map(([value, label]) => `<option value="${value}" ${Number(current) === value ? 'selected' : ''}>${value} — ${label}</option>`).join('');
}

function ratingOptions(current) {
  return [1, 2, 3, 4, 5].map(value => `<option value="${value}" ${Number(current) === value ? 'selected' : ''}>${value}/5</option>`).join('');
}

function kataSectionOptions(current) {
  return KATA_SECTION_LEVELS.map(([value, label]) => `<option value="${value}" ${Number(current) === value ? 'selected' : ''}>${value} — ${label}</option>`).join('');
}

function reviewDueText(nextReview) {
  const today = getNZDateKey();
  if (!nextReview) return 'No review scheduled';
  if (nextReview < today) return `${daysBetween(today, nextReview)} day${daysBetween(today, nextReview) === 1 ? '' : 's'} overdue`;
  if (nextReview === today) return 'Due today';
  return `Due ${formatDateKey(nextReview, { day:'numeric', month:'short' })}`;
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
  const key = selectedDateKey;
  const todayKey = getNZDateKey();
  const isToday = key === todayKey;
  const day = getDayName(key);
  const startDate = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const assignment = getTaskAssignmentForDate(key);
  const planMode = assignment?.planMode || state.settings.programmeMode;
  const actualDayPlan = getBasePlanForDate(key, planMode) || assignment?.plan;
  const az = currentAZPath();
  const kata = currentKata();
  const modeLabel = planMode === 'minimum' ? 'Minimum programme' : 'Normal programme';
  const hasSavedDay = !!state.daily[key];

  document.getElementById('page-eyebrow').textContent = isToday ? 'YOUR PLAN' : 'DAILY PLAN';
  document.getElementById('page-title').textContent = isToday ? 'Today' : formatDateKey(key, { weekday:'long', day:'numeric', month:'short' });

  const dateNavigation = `
    <div class="date-navigation" aria-label="Daily plan navigation">
      <button class="secondary-btn" data-action="previous-day" aria-label="Open previous day">← Previous</button>
      <button class="ghost-btn" data-action="go-today" ${isToday ? 'disabled' : ''}>Today</button>
      <button class="secondary-btn" data-action="next-day" aria-label="Open next day">Next →</button>
    </div>`;

  if (key < startDate) {
    const startAssignment = getTaskAssignmentForDate(startDate) || getBaseTaskAssignment(startDate, state.settings.programmeMode);
    const startPlan = startAssignment.plan;
    const daysToStart = Math.max(0, Math.ceil((parseDateKey(startDate) - parseDateKey(key)) / 86400000));
    const previewTask = startAssignment.task;
    document.getElementById('view-today').innerHTML = `
      ${dateNavigation}
      <div class="hero">
        <p class="eyebrow">PROGRAMME STARTS ${escapeHTML(formatDateKey(startDate).toUpperCase())}</p>
        <h2>${escapeHTML(formatDateKey(key, { weekday:'long', day:'numeric', month:'long' }))}</h2>
        <p>The task programme begins in ${daysToStart} day${daysToStart === 1 ? '' : 's'}. Each day has one flexible task that can be completed when the day allows.</p>
        <div class="hero-meta">
          <span class="badge green">Start: ${escapeHTML(formatDateKey(startDate, { weekday:'long', day:'numeric', month:'long', year:'numeric' }))}</span>
          <span class="badge blue">Current AZ-104: ${escapeHTML(az.name.replace('AZ-104: ', ''))}</span>
          <span class="badge red">Current kata: ${escapeHTML(kata.name)}</span>
        </div>
      </div>
      ${renderKarateFocusSummary(startDate)}
      <div class="section-heading"><div><h2>First task preview</h2><p>${escapeHTML(startPlan.family)}</p></div></div>
      <article class="card task-card">
        <div class="task-top"><div><span class="task-category">${escapeHTML(previewTask.type)}</span><h3>${escapeHTML(previewTask.title)}</h3></div><span class="badge amber">Preview</span></div>
        <div class="checklist">${previewTask.items.map(item => `<div class="check-row"><span>○</span><label>${escapeHTML(item)}</label></div>`).join('')}</div>
        ${renderAdaptiveFocus(previewTask.type, startDate)}
      </article>`;
    return;
  }

  const record = getDailyRecord(key, { create: false, assignment });
  const progress = dayCompletion(key);
  const task = assignment.task;
  const status = getDayTaskStatus(key);
  const rolloverNotice = assignment.carriedOver ? `
    <article class="rollover-notice">
      <div><span class="rollover-icon" aria-hidden="true">↪</span></div>
      <div><strong>Task carried over from ${escapeHTML(formatDateKey(assignment.sourceDate, { weekday:'long', day:'numeric', month:'short' }))}</strong>
      <p>This unfinished task moved forward. Complete it today, or select <strong>Skipped — move on</strong>, and the next planned task will follow on the next day.</p></div>
    </article>` : '';

  document.getElementById('view-today').innerHTML = `
    ${dateNavigation}
    <div class="hero">
      <p class="eyebrow">${escapeHTML(formatDateKey(key).toUpperCase())}</p>
      <h2>${escapeHTML(day)} task</h2>
      <p>${escapeHTML(actualDayPlan.family)}</p>
      <div class="hero-meta">
        <span class="badge ${planMode === 'minimum' ? 'amber' : 'green'}">${modeLabel}${hasSavedDay ? ' · saved for this day' : ''}</span>
        ${assignment.carriedOver ? `<span class="badge amber">Carried ${assignment.delayDays} day${assignment.delayDays === 1 ? '' : 's'}</span>` : '<span class="badge green">On schedule</span>'}
        <span class="badge blue">Current AZ-104: ${escapeHTML(az.name.replace('AZ-104: ', ''))}</span>
        <span class="badge red">Current kata: ${escapeHTML(kata.name)}</span>
      </div>
    </div>

    ${rolloverNotice}
    ${renderKarateFocusSummary(key)}

    <div class="section-heading">
      <div><h2>${isToday ? 'Today’s single task' : 'Single task for this day'}</h2><p>Complete this one task and tick each step as evidence.</p></div>
      <span class="badge ${status.className}">${escapeHTML(status.label)}</span>
    </div>
    <div class="progress-line" aria-label="Daily completion"><span style="width:${progress}%"></span></div>
    <div style="margin-top:16px">
      ${renderTaskCard(task, key, record, assignment)}
    </div>

    <div class="grid two" style="margin-top:16px">
      <article class="card flat">
        <h2>Session notes</h2>
        <label>What did you learn, notice or struggle with?
          <textarea data-daily-field="notes" data-date="${key}" placeholder="Add notes for this task...">${escapeHTML(record.notes)}</textarea>
        </label>
      </article>
      <article class="card flat">
        <h2>End-of-task check</h2>
        <div class="form-grid">
          <label>Energy and recovery
            <select data-daily-field="energy" data-date="${key}">
              ${[1,2,3,4,5].map(n => `<option value="${n}" ${Number(record.energy) === n ? 'selected' : ''}>${n}/5</option>`).join('')}
            </select>
          </label>
          <label>Task result
            <select data-daily-field="result" data-date="${key}">
              ${[['not-set','Not recorded'],['not-completed','Not completed — carry over'],['partial','Partially completed — carry over'],['completed-hard','Completed with difficulty'],['completed','Completed'],['skipped','Skipped — move on']].map(([v,l]) => `<option value="${v}" ${record.result === v ? 'selected' : ''}>${l}</option>`).join('')}
            </select>
          </label>
        </div>
        <div class="inline-note rollover-help" style="margin-top:13px">An unfinished or partial task remains at the front of the queue. Completed and skipped tasks allow the next task to move forward.</div>
        <div class="form-actions">
          <button class="secondary-btn" data-action="open-timer">Open focus timer</button>
          <button class="ghost-btn" data-action="toggle-day-mode">Use ${planMode === 'normal' ? 'minimum' : 'normal'} programme for this task</button>
        </div>
      </article>
    </div>`;
}

function renderTaskCard(task, key, record, assignment) {
  const done = task.items.filter((_, i) => record.checks[taskSubKey(task.id, i)]).length;
  const percent = Math.round(done / task.items.length * 100);
  return `<article class="card task-card">
    <div class="task-top">
      <div><span class="task-category">${escapeHTML(task.type === 'combined' ? 'Azure + Karate' : task.type)}</span><h3>${escapeHTML(task.title)}</h3>${assignment.carriedOver ? `<p class="task-origin">Originally planned for ${escapeHTML(formatDateKey(assignment.sourceDate, { weekday:'long', day:'numeric', month:'long' }))}</p>` : ''}</div>
      <div class="task-badges">${assignment.carriedOver ? '<span class="badge amber">Rollover</span>' : ''}<span class="badge ${task.type === 'azure' ? 'blue' : task.type === 'kata' || task.type === 'dan' ? 'red' : task.type === 'recovery' ? 'green' : 'amber'}">${done}/${task.items.length}</span></div>
    </div>
    <div class="checklist">
      ${task.items.map((item, i) => {
        const keyName = taskSubKey(task.id, i);
        const checked = !!record.checks[keyName];
        const inputId = `check-${key.replaceAll('-', '')}-${task.id}-${i}`;
        return `<div class="check-row ${checked ? 'checked' : ''}">
          <input id="${inputId}" type="checkbox" data-daily-check="${escapeHTML(keyName)}" data-date="${key}" ${checked ? 'checked' : ''}>
          <label for="${inputId}">${escapeHTML(item)}</label>
        </div>`;
      }).join('')}
    </div>
    <div class="progress-line"><span style="width:${percent}%"></span></div>
    ${renderAdaptiveFocus(task.type, key)}
  </article>`;
}

function renderWeek() {
  const start = getWeekStart(selectedDateKey);
  const today = getNZDateKey();
  const programmeStart = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const rolloverStart = state.settings.rolloverStartDate || programmeStart;
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  document.getElementById('view-week').innerHTML = `
    <div class="date-navigation" aria-label="Weekly plan navigation">
      <button class="secondary-btn" data-action="previous-week" aria-label="Open previous week">← Previous week</button>
      <button class="ghost-btn" data-action="current-week" ${start === getWeekStart(today) ? 'disabled' : ''}>Current week</button>
      <button class="secondary-btn" data-action="next-week" aria-label="Open next week">Next week →</button>
    </div>
    <div class="hero">
      <p class="eyebrow">WEEK OF ${escapeHTML(formatDateKey(start, { day:'numeric', month:'long', year:'numeric' }).toUpperCase())}</p>
      <h2>${state.settings.programmeMode === 'normal' ? 'Standard task programme' : 'Reduced minimum programme'}</h2>
      <p>Each day contains one flexible task. When automatic rollover is active, an unfinished task moves to the next day and every following task shifts forward in order.</p>
      <div class="hero-meta">
        <span class="badge green">Programme starts ${escapeHTML(formatDateKey(programmeStart, { day:'numeric', month:'long', year:'numeric' }))}</span>
        <span class="badge ${state.settings.rolloverEnabled === false ? 'amber' : 'blue'}">Rollover ${state.settings.rolloverEnabled === false ? 'off' : `active from ${escapeHTML(formatDateKey(rolloverStart, { day:'numeric', month:'short' }))}`}</span>
        <button class="secondary-btn" data-action="toggle-mode">Use ${state.settings.programmeMode === 'normal' ? 'minimum' : 'normal'} programme by default</button>
      </div>
    </div>
    <div class="section-heading"><div><h2>Monday to Sunday</h2><p>Carried tasks are marked clearly. Future days are projected on the assumption that each task is completed when shown.</p></div></div>
    <div class="week-grid">
      ${days.map(key => {
        const day = getDayName(key);
        const beforeStart = key < programmeStart;
        if (beforeStart) {
          const context = getBasePlanForDate(key, state.settings.programmeMode);
          return `<article class="card day-card before-start">
            <h3>${day}<span class="day-date">${formatDateKey(key, { day:'numeric', month:'short' })}</span></h3>
            <span class="badge amber">Before programme start</span>
            <div class="day-block"><strong>Daily context</strong><p>${escapeHTML(context?.family || 'No programme task yet.')}</p></div>
            <div class="day-block"><strong>No task required</strong><p>The programme begins on ${escapeHTML(formatDateKey(programmeStart, { weekday:'long', day:'numeric', month:'long', year:'numeric' }))}.</p></div>
            <div class="form-actions"><button class="ghost-btn" data-action="open-day" data-date="${key}">Open day</button></div>
          </article>`;
        }
        const assignment = getTaskAssignmentForDate(key);
        const mode = assignment.planMode;
        const task = assignment.task;
        const context = getBasePlanForDate(key, mode) || assignment.plan;
        const status = getDayTaskStatus(key);
        const focus = getAdaptiveFocus(task.type, key)[0];
        return `<article class="card day-card ${key === today ? 'today' : ''} ${assignment.carriedOver ? 'carried-day' : ''}">
          <h3>${day}<span class="day-date">${formatDateKey(key, { day:'numeric', month:'short' })}</span></h3>
          <span class="badge ${status.className}">${escapeHTML(status.label)}</span>
          <span class="badge ${mode === 'minimum' ? 'amber' : 'green'}">${mode === 'minimum' ? 'Minimum' : 'Normal'}</span>
          ${assignment.carriedOver ? `<span class="badge amber">From ${escapeHTML(formatDateKey(assignment.sourceDate, { weekday:'short', day:'numeric', month:'short' }))}</span>` : ''}
          <div class="day-block"><strong>Daily context</strong><p>${escapeHTML(context.family)}</p></div>
          <div class="day-block"><strong>${escapeHTML(task.title)}</strong><p>${escapeHTML(task.items.join(' · '))}</p></div>
          ${assignment.carriedOver ? `<div class="day-block rollover-preview"><strong>Automatic rollover</strong><p>This task was originally scheduled for ${escapeHTML(formatDateKey(assignment.sourceDate, { weekday:'long', day:'numeric', month:'long' }))}.</p></div>` : ''}
          ${focus ? `<div class="day-block adaptive-preview"><strong>Recommended focus</strong><p>${escapeHTML(focus.kind)}: ${escapeHTML(focus.title)} — ${escapeHTML(focus.reason)}</p></div>` : ''}
          <div class="form-actions"><button class="ghost-btn" data-action="open-day" data-date="${key}">${key === today ? 'Open today' : 'Open day'}</button></div>
        </article>`;
      }).join('')}
    </div>`;
}

function renderAzure() {
  const modules = getAllAzureModules();
  const completedModules = modules.filter(({ module }) => module.complete).length;
  const totalModules = modules.length;
  const overall = totalModules ? Math.round(completedModules / totalModules * 100) : 0;
  const mastery = totalModules ? Math.round(average(modules.map(({ module }) => Number(module.masteryLevel || 0))) / 5 * 100) : 0;
  const dueReviews = modules.filter(({ module }) => module.nextReview && module.nextReview <= getNZDateKey()).length;
  const recommendation = getAzurePriority();
  const moduleChoices = modules.map(({ path, module }) => `<option value="${path.id}::${module.id}">${escapeHTML(path.name.replace('AZ-104: ', ''))} — ${escapeHTML(module.name)}</option>`).join('');

  document.getElementById('view-azure').innerHTML = `
    <div class="hero">
      <p class="eyebrow">MASTERY, PRACTICE AND RECALL</p>
      <h2>AZ-104 study coach</h2>
      <p>A module is not treated as mastered only because the learning material is complete. Record recall, practical work, troubleshooting and verification evidence.</p>
      <div class="hero-meta">
        <span class="badge blue">${completedModules}/${totalModules} topics learned</span>
        <span class="badge green">${mastery}% mastery</span>
        <span class="badge ${dueReviews ? 'amber' : 'green'}">${dueReviews} reviews due</span>
        <span class="badge blue">${state.azureLabs.length} lab journals</span>
      </div>
    </div>

    ${recommendation ? `<div class="section-heading"><div><h2>Recommended next Azure focus</h2><p>Selected from weak, incomplete and overdue topics.</p></div></div>
      <article class="card priority-card">
        <div><span class="badge blue">Next best topic</span><h2>${escapeHTML(recommendation.title)}</h2><p class="muted">${escapeHTML(recommendation.subtitle)}</p><p>${escapeHTML(recommendation.reason)}</p></div>
        <ul>${recommendation.tasks.map(task => `<li>${escapeHTML(task)}</li>`).join('')}</ul>
      </article>` : ''}

    <div class="section-heading"><div><h2>Azure lab journal</h2><p>Record evidence that can be used for revision and job interviews.</p></div></div>
    <article class="card">
      <form id="azure-lab-form">
        <div class="form-grid">
          <label>Topic
            <select name="moduleRef" required>${moduleChoices}</select>
          </label>
          <label>Tool used
            <select name="tool" required>
              <option value="Azure portal">Azure portal</option>
              <option value="PowerShell">PowerShell</option>
              <option value="Azure CLI">Azure CLI</option>
              <option value="Bicep or ARM">Bicep or ARM</option>
              <option value="Mixed">Mixed tools</option>
            </select>
          </label>
        </div>
        <label style="margin-top:12px">Objective<textarea name="objective" required placeholder="What were you trying to configure or prove?"></textarea></label>
        <div class="form-grid">
          <label>Configuration completed<textarea name="configuration" required placeholder="Resources, settings, scope and permissions used..."></textarea></label>
          <label>What failed<textarea name="failure" placeholder="Error, unexpected result or issue encountered..."></textarea></label>
          <label>Diagnosis and fix<textarea name="diagnosis" placeholder="Checks completed, root cause and resolution..."></textarea></label>
          <label>Final result<textarea name="result" required placeholder="How you verified that the task worked..."></textarea></label>
          <label>Cleanup<textarea name="cleanup" placeholder="Resources removed or costs stopped..."></textarea></label>
          <label>Commands or settings to remember<textarea name="commands" placeholder="Useful commands, settings or portal path..."></textarea></label>
        </div>
        <div class="form-actions"><button class="primary-btn" type="submit">Save lab journal</button></div>
      </form>
    </article>

    ${state.azureLabs.length ? `<div class="section-heading"><div><h2>Recent lab evidence</h2></div></div>
      <div class="grid two">${[...state.azureLabs].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8).map(lab => `
        <article class="card lab-card">
          <div class="item-header"><div><span class="badge blue">${escapeHTML(lab.tool)}</span><h3>${escapeHTML(lab.moduleName)}</h3><span class="small muted">${new Date(lab.createdAt).toLocaleString('en-NZ')}</span></div><button class="ghost-btn" data-action="delete-lab" data-id="${lab.id}">Delete</button></div>
          <p><strong>Objective:</strong> ${escapeHTML(lab.objective)}</p>
          <details><summary class="details-toggle">Open lab details</summary>
            <p><strong>Configuration:</strong> ${escapeHTML(lab.configuration).replace(/\n/g,'<br>')}</p>
            ${lab.failure ? `<p><strong>Failure:</strong> ${escapeHTML(lab.failure).replace(/\n/g,'<br>')}</p>` : ''}
            ${lab.diagnosis ? `<p><strong>Diagnosis:</strong> ${escapeHTML(lab.diagnosis).replace(/\n/g,'<br>')}</p>` : ''}
            <p><strong>Result:</strong> ${escapeHTML(lab.result).replace(/\n/g,'<br>')}</p>
            ${lab.cleanup ? `<p><strong>Cleanup:</strong> ${escapeHTML(lab.cleanup).replace(/\n/g,'<br>')}</p>` : ''}
            ${lab.commands ? `<p><strong>Remember:</strong> ${escapeHTML(lab.commands).replace(/\n/g,'<br>')}</p>` : ''}
          </details>
        </article>`).join('')}</div>` : ''}

    <div class="section-heading"><div><h2>Learning paths</h2><p>Track evidence and schedule recall for every topic.</p></div></div>
    <div class="item-list">
      ${state.azPaths.map(path => {
        const done = path.modules.filter(module => module.complete).length;
        const pathMastery = Math.round(average(path.modules.map(module => Number(module.masteryLevel || 0))) / 5 * 100);
        return `<article class="card item-card">
          <div class="item-header">
            <div><span class="badge blue">${escapeHTML(path.targetWeeks)}</span><h3>${escapeHTML(path.name)}</h3><span class="muted small">${done}/${path.modules.length} topics learned · ${pathMastery}% mastery</span></div>
            <div class="item-controls"><select class="status-select" data-az-status="${path.id}">${statusOptions(path.status, AZ_STATUS_OPTIONS)}</select></div>
          </div>
          <div class="progress-line" style="margin-top:12px"><span style="width:${pathMastery}%"></span></div>
          <details class="item-body">
            <summary class="details-toggle">Open path mastery details</summary>
            <div class="module-mastery-list">
              ${path.modules.map(module => renderAzureModule(path, module)).join('')}
            </div>
            <label style="margin-top:15px">Path notes
              <textarea data-az-notes="${path.id}" placeholder="Difficult concepts, revision priorities and connections between topics...">${escapeHTML(path.notes)}</textarea>
            </label>
          </details>
        </article>`;
      }).join('')}
    </div>`;
}

function renderAzureModule(path, module) {
  const evidence = { ...defaultEvidence(), ...(module.evidence || {}) };
  const evidenceCount = Object.values(evidence).filter(Boolean).length;
  const questions = getModuleRecallQuestions(module);
  return `<article class="module-mastery-card">
    <div class="module-master-head">
      <input type="checkbox" data-az-module="${path.id}" data-module-id="${module.id}" ${module.complete ? 'checked' : ''} aria-label="Learning material completed">
      <div>
        <strong>${escapeHTML(module.name)}</strong>
        <div class="module-badges">
          <span class="badge ${Number(module.masteryLevel || 0) >= 4 ? 'green' : 'blue'}">Mastery ${Number(module.masteryLevel || 0)}/5</span>
          <span class="badge ${module.nextReview && module.nextReview <= getNZDateKey() ? 'amber' : 'green'}">${escapeHTML(reviewDueText(module.nextReview))}</span>
          <span class="badge">${evidenceCount}/5 evidence</span>
        </div>
      </div>
      <label class="compact-label">Mastery
        <select data-az-mastery="${path.id}" data-module-id="${module.id}">${masteryOptions(module.masteryLevel)}</select>
      </label>
    </div>
    <details class="module-review">
      <summary class="details-toggle">Open evidence and recall</summary>
      <div class="evidence-grid">
        ${[['learned','Learned'],['recalled','Recalled'],['practised','Practised'],['troubleshot','Troubleshot'],['verified','Verified']].map(([field,label]) => `
          <label class="evidence-check"><input type="checkbox" data-az-evidence="${field}" data-path-id="${path.id}" data-module-id="${module.id}" ${evidence[field] ? 'checked' : ''}><span>${label}</span></label>`).join('')}
      </div>
      <div class="recall-box">
        <strong>Active-recall questions</strong>
        <ol>${questions.map((question, index) => `<li>${escapeHTML(question)}${index >= 4 ? ` <button type="button" class="inline-delete" data-action="delete-recall-question" data-id="${path.id}" data-module-id="${module.id}" data-question-index="${index - 4}" aria-label="Delete custom question">×</button>` : ''}</li>`).join('')}</ol>
        <div class="recall-question-add">
          <input type="text" data-recall-question-input="${path.id}" data-module-id="${module.id}" maxlength="240" placeholder="Add your own recall question">
          <button type="button" class="secondary-btn" data-action="add-recall-question" data-id="${path.id}" data-module-id="${module.id}">Add question</button>
        </div>
        <p class="small muted">Answer without notes, then record the result.</p>
        <div class="recall-actions">
          ${RECALL_RESULTS.map(([value,label]) => `<button type="button" class="${module.lastRecallResult === value ? 'selected' : ''}" data-action="record-az-review" data-id="${path.id}" data-module-id="${module.id}" data-result="${value}">${escapeHTML(label)}</button>`).join('')}
        </div>
        <p class="small muted">Last reviewed: ${module.lastReviewed ? formatDateKey(module.lastReviewed, { day:'numeric', month:'short', year:'numeric' }) : 'Never'} · Next review: ${module.nextReview ? formatDateKey(module.nextReview, { day:'numeric', month:'short', year:'numeric' }) : 'Not scheduled'}</p>
      </div>
    </details>
  </article>`;
}

function renderDan() {
  const checked = state.syllabus.reduce((sum, item) => sum + item.checkpoints.filter(check => check.complete).length, 0);
  const total = state.syllabus.reduce((sum, item) => sum + item.checkpoints.length, 0);
  const checkpointOverall = percent(checked, total);
  const techniqueAverage = average(state.syllabus.flatMap(item => KARATE_RATING_FIELDS.map(([key]) => Number(item.ratings?.[key] || 1))));
  const priority = getDanPriority();
  const groups = ['Group A', 'Group B', 'Kata', 'Kumite'];
  document.getElementById('view-dan').innerHTML = `
    <div class="hero">
      <p class="eyebrow">TECHNICAL ASSESSMENT</p>
      <h2>JKA 3rd Dan preparation</h2>
      <p>Completion alone does not show grading readiness. Score the quality of stance, balance, hip movement, technique path, timing, power, breathing, and both sides.</p>
      <div class="hero-meta"><span class="badge red">${checkpointOverall}% checkpoints</span><span class="badge amber">${techniqueAverage.toFixed(1)}/5 average quality</span><span class="badge blue">${state.syllabus.reduce((sum,item)=>sum+(item.practiceCount||0),0)} practices logged</span></div>
    </div>
    ${priority ? `<div class="section-heading"><div><h2>Current grading section to focus on</h2><p>Selected from the lowest technical ratings, incomplete checkpoints and oldest practice.</p></div></div>
      <article class="card priority-card grading-priority">
        <div><span class="badge red">${escapeHTML(priority.subtitle)}</span><h2>${escapeHTML(priority.title)}</h2><p>${escapeHTML(priority.reason)}</p></div>
        <ul>${priority.tasks.map(task => `<li>${escapeHTML(task)}</li>`).join('')}</ul>
      </article>` : ''}
    ${groups.map(group => `<div class="section-heading"><div><h2>${escapeHTML(group)}</h2></div></div><div class="item-list">${state.syllabus.filter(item => item.group === group).map(renderSyllabusCard).join('')}</div>`).join('')}`;
}

function renderSyllabusCard(item) {
  const done = item.checkpoints.filter(check => check.complete).length;
  const checkpointProgress = percent(done, item.checkpoints.length);
  const ratingAverage = average(KARATE_RATING_FIELDS.map(([key]) => Number(item.ratings?.[key] || 1)));
  const weakest = KARATE_RATING_FIELDS
    .map(([key,label]) => ({ label, value: Number(item.ratings?.[key] || 1) }))
    .sort((a,b) => a.value - b.value)
    .slice(0,2);
  return `<article class="card item-card">
    <div class="item-header">
      <div>
        <h3>${escapeHTML(item.title)}</h3>
        <span class="muted small">Last practised: ${item.lastPractised ? formatDateKey(item.lastPractised, { day:'numeric', month:'short', year:'numeric' }) : 'Not recorded'} · ${item.practiceCount || 0} sessions${item.lastAssessmentResult ? ` · Assessment saved ${formatDateKey(item.lastAssessmentResult, { day:'numeric', month:'short' })}` : ''}</span>
        <div class="module-badges"><span class="badge red">${ratingAverage.toFixed(1)}/5 quality</span><span class="badge amber">Weakest: ${escapeHTML(weakest.map(field => `${field.label} ${field.value}/5`).join(' · '))}</span></div>
      </div>
      <select class="status-select" data-dan-status="${item.id}">${statusOptions(item.status)}</select>
    </div>
    <div class="progress-line" style="margin-top:12px"><span style="width:${checkpointProgress}%"></span></div>
    <details class="item-body">
      <summary class="details-toggle">Open assessment</summary>
      <div class="assessment-layout">
        <div>
          <h4>Technical checkpoints</h4>
          ${item.checkpoints.map(check => `<div class="module-row"><input type="checkbox" data-dan-check="${item.id}" data-check-id="${check.id}" ${check.complete ? 'checked' : ''}><span>${escapeHTML(check.name)}</span><span></span></div>`).join('')}
        </div>
        <div>
          <h4>Session quality</h4>
          <div class="rating-grid">
            ${KARATE_RATING_FIELDS.map(([key,label]) => `<label>${escapeHTML(label)}<select data-dan-rating="${item.id}" data-rating-field="${key}">${ratingOptions(item.ratings?.[key] || 1)}</select></label>`).join('')}
          </div>
        </div>
      </div>
      <div class="form-grid" style="margin-top:14px">
        <label>Confidence<div class="confidence">${renderConfidence('dan-confidence', item.id, item.confidence)}</div></label>
        <label>Technical and instructor notes<textarea data-dan-notes="${item.id}" placeholder="Record faults, corrections, instructor feedback and questions...">${escapeHTML(item.notes)}</textarea></label>
      </div>
      <div class="form-actions"><button class="primary-btn" data-action="log-dan-practice" data-id="${item.id}">Log practice today</button></div>
    </details>
  </article>`;
}

function renderKata() {
  const retentionStatuses = new Set(['sequence-known', 'comfortable', 'instructor-checked', 'grading-ready', 'complete']);
  const known = state.katas.filter(kata => kata.category === 'known' || Number(kata.sequenceProgress) >= 100 || retentionStatuses.has(kata.status));
  const knownIds = new Set(known.map(kata => kata.id));
  const learning = state.katas.filter(kata => !knownIds.has(kata.id) && kata.status !== 'not-started');
  const planned = state.katas.filter(kata => !knownIds.has(kata.id) && kata.status === 'not-started');
  const sequenceKnown = state.katas.filter(kata => Number(kata.sequenceProgress) >= 100).length;
  const due = state.katas.filter(kata => kata.nextReview && kata.nextReview <= getNZDateKey()).length;
  const priority = getKataPriority();
  document.getElementById('view-kata').innerHTML = `
    <div class="hero">
      <p class="eyebrow">SECTIONS AND RETENTION</p>
      <h2>Kata mastery and review</h2>
      <p>Track each part of the kata separately, then schedule retention reviews. A clean performance increases the review interval; mistakes bring the kata back sooner.</p>
      <div class="hero-meta"><span class="badge red">${sequenceKnown}/${state.katas.length} sequences known</span><span class="badge ${due ? 'amber' : 'green'}">${due} retention reviews due</span><span class="badge blue">Current: ${escapeHTML(currentKata().name)}</span></div>
    </div>
    ${priority ? `<div class="section-heading"><div><h2>Recommended kata focus</h2><p>Selected from overdue reviews, incomplete sections and low confidence.</p></div></div>
      <article class="card priority-card">
        <div><span class="badge red">${escapeHTML(priority.subtitle)}</span><h2>${escapeHTML(priority.title)}</h2><p>${escapeHTML(priority.reason)}</p></div>
        <ul>${priority.tasks.map(task => `<li>${escapeHTML(task)}</li>`).join('')}</ul>
      </article>` : ''}
    <div class="section-heading"><div><h2>Sequence known and retention</h2><p>Completed planned kata automatically move into this rotation.</p></div></div>
    <div class="grid two">${known.map(renderKataCard).join('')}</div>
    <div class="section-heading"><div><h2>Currently learning</h2></div></div>
    ${learning.length ? `<div class="grid two">${learning.map(renderKataCard).join('')}</div>` : `<div class="card empty">No kata is marked as currently learning. Change Jion or another planned kata to “Learning”.</div>`}
    <div class="section-heading"><div><h2>Planned kata</h2><p>Start one or two at a time.</p></div></div>
    <div class="grid two">${planned.map(renderKataCard).join('')}</div>`;
}

function renderKataCard(kata) {
  const sectionAverage = average((kata.sections || []).map(section => Number(section.level || 0)));
  const due = kata.nextReview && kata.nextReview <= getNZDateKey();
  return `<article class="card item-card">
    <div class="item-header">
      <div>
        <h3>${escapeHTML(kata.name)}</h3>
        <span class="muted small">${kata.practiceCount || 0} logged sessions · Last: ${kata.lastPractised ? formatDateKey(kata.lastPractised, { day:'numeric', month:'short' }) : 'Never'}</span>
        <div class="module-badges">
          <span class="badge red">${Number(kata.sequenceProgress) || 0}% section mastery</span>
          <span class="badge ${due ? 'amber' : 'green'}">${escapeHTML(reviewDueText(kata.nextReview))}</span>
          <span class="badge blue">${Number(kata.retentionIntervalDays || 7)}-day interval</span>
        </div>
      </div>
      <select class="status-select" data-kata-status="${kata.id}">${statusOptions(kata.status)}</select>
    </div>
    <div class="progress-line" style="margin-top:12px"><span style="width:${Number(kata.sequenceProgress) || 0}%"></span></div>
    <details class="item-body">
      <summary class="details-toggle">Open kata sections and review</summary>
      <div class="kata-section-grid">
        ${(kata.sections || []).map(section => `<label>${escapeHTML(section.name)}
          <select data-kata-section="${kata.id}" data-section-id="${section.id}">${kataSectionOptions(section.level)}</select>
        </label>`).join('')}
      </div>
      <div class="form-grid" style="margin-top:14px">
        <label>Confidence<div class="confidence">${renderConfidence('kata-confidence', kata.id, kata.confidence)}</div></label>
        <label>Sequence, technical and instructor notes<textarea data-kata-notes="${kata.id}" placeholder="Sections, turns, embusen, kiai, rhythm, bunkai and corrections...">${escapeHTML(kata.notes)}</textarea></label>
      </div>
      <div class="retention-summary">
        <strong>Retention result</strong>
        <span>Last result: ${kata.lastPerformanceResult === 'clean' ? 'Clean performance' : kata.lastPerformanceResult === 'mistakes' ? 'Mistakes found' : 'Not recorded'}</span>
      </div>
      <div class="form-actions">
        <button class="primary-btn" data-action="kata-clean" data-id="${kata.id}">Clean performance</button>
        <button class="secondary-btn" data-action="kata-mistakes" data-id="${kata.id}">Mistakes found</button>
        <button class="ghost-btn" data-action="log-kata-practice" data-id="${kata.id}">Log practice only</button>
      </div>
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
  const modules = getAllAzureModules().map(({ module }) => module);
  const azLearned = modules.filter(module => module.complete).length;
  const azMastery = modules.length ? Math.round(average(modules.map(module => Number(module.masteryLevel || 0))) / 5 * 100) : 0;
  const azDue = modules.filter(module => module.nextReview && module.nextReview <= today).length;
  const danAverage = average(state.syllabus.flatMap(item => KARATE_RATING_FIELDS.map(([key]) => Number(item.ratings?.[key] || 1))));
  const danDone = state.syllabus.reduce((sum,item) => sum + item.checkpoints.filter(check => check.complete).length, 0);
  const danTotal = state.syllabus.reduce((sum,item) => sum + item.checkpoints.length, 0);
  const kataKnown = state.katas.filter(kata => Number(kata.sequenceProgress || 0) >= 100).length;
  const kataDue = state.katas.filter(kata => kata.nextReview && kata.nextReview <= today).length;
  const kataSectionMastery = state.katas.length ? Math.round(average(state.katas.flatMap(kata => (kata.sections || []).map(section => Number(section.level || 0)))) / 5 * 100) : 0;
  const energyRecords = Object.values(state.daily).filter(record => record.energy).map(record => Number(record.energy));
  const averageEnergy = energyRecords.length ? (energyRecords.reduce((sum,value)=>sum+value,0) / energyRecords.length).toFixed(1) : '—';
  const metrics = [
    ['Azure mastery', azMastery],
    ['3rd Dan checkpoints', percent(danDone, danTotal)],
    ['Kata section mastery', kataSectionMastery],
    ['28-day full tasks', percent(completedDays, 28)]
  ];
  document.getElementById('view-progress').innerHTML = `
    <div class="grid four">
      <article class="card metric-card"><small>Azure topics learned</small><strong>${azLearned}</strong><span class="muted small">${azMastery}% mastery · ${azDue} reviews due</span></article>
      <article class="card metric-card"><small>Azure lab journals</small><strong>${state.azureLabs.length}</strong><span class="muted small">Practical evidence</span></article>
      <article class="card metric-card"><small>3rd Dan quality</small><strong>${danAverage.toFixed(1)}</strong><span class="muted small">Average out of 5</span></article>
      <article class="card metric-card"><small>Kata reviews due</small><strong>${kataDue}</strong><span class="muted small">${kataKnown} sequences known</span></article>
    </div>
    <div class="grid two" style="margin-top:16px">
      <article class="card">
        <h2>Mastery progress</h2>
        <div class="bar-chart">
          ${metrics.map(([label,value]) => `<div class="bar-row"><span>${escapeHTML(label)}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-value">${value}%</span></div>`).join('')}
        </div>
      </article>
      <article class="card">
        <h2>Consistency and evidence</h2>
        <div class="bar-chart">
          <div class="bar-row"><span>Active days</span><div class="bar-track"><div class="bar-fill" style="width:${percent(activeDays,28)}%"></div></div><span class="bar-value">${activeDays}</span></div>
          <div class="bar-row"><span>Full tasks</span><div class="bar-track"><div class="bar-fill" style="width:${percent(completedDays,28)}%"></div></div><span class="bar-value">${completedDays}</span></div>
          <div class="bar-row"><span>Kata sessions</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, state.katas.reduce((sum,kata)=>sum+(kata.practiceCount||0),0)*2)}%"></div></div><span class="bar-value">${state.katas.reduce((sum,kata)=>sum+(kata.practiceCount||0),0)}</span></div>
          <div class="bar-row"><span>Dan sessions</span><div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, state.syllabus.reduce((sum,item)=>sum+(item.practiceCount||0),0)*2)}%"></div></div><span class="bar-value">${state.syllabus.reduce((sum,item)=>sum+(item.practiceCount||0),0)}</span></div>
        </div>
      </article>
    </div>
    <div class="grid two" style="margin-top:16px">
      <article class="card metric-card"><small>Average energy</small><strong>${averageEnergy}</strong><span class="muted small">Out of 5</span></article>
      <article class="card metric-card"><small>Weekly reviews</small><strong>${state.weeklyReviews.length}</strong><span class="muted small">Reflection records</span></article>
    </div>
    <div class="section-heading"><div><h2>Last 14 days</h2><p>Single daily task completion.</p></div></div>
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
  const recommendedRedirect = getCurrentRedirectUri();
  const microsoftName = microsoftAccount?.name || microsoftAccount?.username || '';
  document.getElementById('view-settings').innerHTML = `
    <div class="grid two">
      <article class="card">
        <h2>Programme settings</h2>
        <div class="toggle-row"><div><strong>Minimum-week mode</strong><div class="muted small">Use the reduced programme during difficult weeks.</div></div><label class="switch"><input id="mode-toggle" type="checkbox" ${state.settings.programmeMode === 'minimum' ? 'checked' : ''}><span></span></label></div>
        <div class="toggle-row rollover-setting"><div><strong>Automatic task rollover</strong><div class="muted small">Unfinished tasks move to the next day and keep the remaining programme in order.</div></div><label class="switch"><input id="rollover-toggle" type="checkbox" ${state.settings.rolloverEnabled !== false ? 'checked' : ''}><span></span></label></div>
        <div class="form-grid" style="margin-top:13px">
          <label>Programme start date<input id="programme-start-date" type="date" value="${escapeHTML(state.settings.programmeStartDate || PROGRAMME_START_DATE)}"></label>
          <label>Rollover begins from<input id="rollover-start-date" type="date" value="${escapeHTML(state.settings.rolloverStartDate || state.settings.programmeStartDate || PROGRAMME_START_DATE)}"></label>
          <label>Daily structure<input type="text" value="One flexible task per day" disabled></label>
        </div>
        <div class="inline-note rollover-help" style="margin-top:13px">Tasks do not have fixed times. If a task is unfinished, it remains next in the queue. Selecting <strong>Skipped — move on</strong> advances the queue without counting the task as completed.</div>
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

    <div class="section-heading"><div><h2>Cloud synchronisation</h2><p>Choose one active provider. Local data remains the working copy on this device.</p></div></div>
    <article class="card provider-selector-card">
      <div class="provider-selector">
        <label>Active sync provider
          <select id="cloud-provider">
            <option value="local" ${cloudProvider === 'local' ? 'selected' : ''}>Local device only</option>
            <option value="onedrive" ${cloudProvider === 'onedrive' ? 'selected' : ''}>Microsoft OneDrive</option>
            <option value="supabase" ${cloudProvider === 'supabase' ? 'selected' : ''}>Supabase</option>
          </select>
        </label>
        <div class="provider-current"><span class="provider-dot ${cloudProvider}"></span><div><strong>${cloudProvider === 'onedrive' ? 'Microsoft OneDrive' : cloudProvider === 'supabase' ? 'Supabase' : 'Local only'}</strong><div class="muted small">Only the selected provider receives automatic updates.</div></div></div>
      </div>
      <div class="form-actions"><button class="primary-btn" data-action="save-sync-provider">Use selected provider</button></div>
    </article>

    <div class="section-heading"><div><h2>Microsoft OneDrive</h2><p>Sign in with Microsoft and save the app state in its private OneDrive application folder.</p></div></div>
    <div class="grid two">
      <article class="card">
        <div class="provider-title"><span class="microsoft-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div><h2>Microsoft application</h2><p class="muted small">A public SPA client ID is required. Do not enter a client secret.</p></div></div>
        <label>Application (client) ID<input id="microsoft-client-id" type="text" value="${escapeHTML(microsoftConfig.clientId || '')}" placeholder="00000000-0000-0000-0000-000000000000" autocomplete="off"></label>
        <label style="margin-top:12px">Authority<input id="microsoft-authority" type="url" value="${escapeHTML(microsoftConfig.authority || 'https://login.microsoftonline.com/common')}" placeholder="https://login.microsoftonline.com/common"></label>
        <label style="margin-top:12px">SPA redirect URI<input id="microsoft-redirect-uri" type="url" value="${escapeHTML(microsoftConfig.redirectUri || recommendedRedirect)}" placeholder="${escapeHTML(recommendedRedirect)}"></label>
        <div class="inline-note" style="margin-top:14px">Register the exact redirect URI above as a <strong>Single-page application</strong>. Required delegated permission: <code>Files.ReadWrite.AppFolder</code>.</div>
        <div class="form-actions"><button class="primary-btn" data-action="save-microsoft-config">Save Microsoft configuration</button><button class="ghost-btn" data-action="clear-microsoft-config">Clear</button></div>
      </article>
      <article class="card">
        <div class="provider-title"><span class="microsoft-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span><div><h2>${microsoftAccount ? 'Microsoft account' : 'Sign in with Microsoft'}</h2><p class="muted small">The progress file is stored as <code>${ONEDRIVE_STATE_FILE}</code> inside the app’s OneDrive folder.</p></div></div>
        ${microsoftAccount ? `
          <div class="account-summary"><strong>${escapeHTML(microsoftName)}</strong>${microsoftAccount.username ? `<span>${escapeHTML(microsoftAccount.username)}</span>` : ''}</div>
          <div class="form-actions"><button class="microsoft-btn" data-action="sync-onedrive"><span class="microsoft-mini">⊞</span>Sync OneDrive now</button><button class="secondary-btn" data-action="pull-onedrive">Pull OneDrive to this device</button><button class="secondary-btn" data-action="push-onedrive">Push this device to OneDrive</button><button class="ghost-btn" data-action="sign-out-microsoft">Sign out</button></div>
        ` : `
          <p>Use a personal Microsoft account or a permitted work or school account.</p>
          <div class="form-actions"><button class="microsoft-btn" data-action="sign-in-microsoft" ${microsoftConfig.clientId ? '' : 'disabled'}><span class="microsoft-mini">⊞</span>Sign in with Microsoft</button></div>
          ${microsoftConfig.clientId ? '' : '<div class="inline-note warning" style="margin-top:14px">Save the Microsoft application client ID first.</div>'}
        `}
        <div class="inline-note privacy-note" style="margin-top:15px">The permission is limited to this app’s own folder in OneDrive. The app cannot browse your other OneDrive files through this permission.</div>
      </article>
    </div>

    <div class="section-heading"><div><h2>Supabase synchronisation</h2><p>The existing Supabase authentication and database remain available.</p></div></div>
    <div class="grid two">
      <article class="card">
        <h2>Supabase configuration</h2>
        <p class="muted small">Paste the project URL and publishable/anon key. Never use a service-role key.</p>
        <label>Project URL<input id="supabase-url" type="url" value="${escapeHTML(cloudConfig.url || '')}" placeholder="https://your-project.supabase.co"></label>
        <label style="margin-top:12px">Publishable or anon key<input id="supabase-key" type="password" value="${escapeHTML(cloudConfig.key || '')}" placeholder="Supabase publishable key"></label>
        <div class="form-actions"><button class="primary-btn" data-action="save-cloud-config">Save cloud configuration</button><button class="ghost-btn" data-action="clear-cloud-config">Clear</button></div>
      </article>
      <article class="card">
        <h2>${cloudUser ? 'Supabase account' : 'Sign in or create Supabase account'}</h2>
        ${cloudUser ? `
          <p>Signed in as <strong>${escapeHTML(cloudUser.email || cloudUser.id)}</strong>.</p>
          <div class="form-actions"><button class="primary-btn" data-action="sync-now">Sync Supabase now</button><button class="secondary-btn" data-action="pull-cloud">Pull Supabase to this device</button><button class="secondary-btn" data-action="push-cloud">Push this device to Supabase</button><button class="ghost-btn" data-action="sign-out">Sign out</button></div>
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

function scheduleInputSave(key, callback) {
  clearTimeout(inputSaveTimers.get(key));
  inputSaveTimers.set(key, setTimeout(() => {
    inputSaveTimers.delete(key);
    callback();
  }, 500));
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
  const activeIdentity = cloudProvider === 'onedrive'
    ? (microsoftAccount?.username || microsoftAccount?.name)
    : cloudProvider === 'supabase'
      ? cloudUser?.email
      : '';
  badge.textContent = (activeIdentity || state.profile.name || 'A').charAt(0).toUpperCase();
  badge.title = activeIdentity || 'Local profile';
}

function updateSyncPill(status, text) {
  const pill = document.getElementById('sync-pill');
  pill.className = `sync-pill ${status}`;
  pill.textContent = text;
}

function updateProviderStatus() {
  if (cloudProvider === 'local') {
    updateSyncPill('local', 'Local only');
    return;
  }
  if (cloudProvider === 'onedrive') {
    if (!microsoftConfig.clientId) updateSyncPill('error', 'OneDrive setup required');
    else if (!microsoftAccount) updateSyncPill('local', 'OneDrive · signed out');
    else if (!navigator.onLine) updateSyncPill('offline', 'OneDrive offline · changes saved');
    else updateSyncPill('synced', 'OneDrive ready');
    return;
  }
  if (!cloudConfig.url || !cloudConfig.key) updateSyncPill('local', 'Supabase not configured');
  else if (!cloudUser) updateSyncPill('local', 'Supabase · signed out');
  else if (!navigator.onLine) updateSyncPill('offline', 'Supabase offline · changes saved');
  else updateSyncPill('synced', 'Supabase ready');
}

async function ensureMicrosoftClient() {
  if (microsoftClient) return microsoftClient;
  if (!microsoftConfig.clientId) throw new Error('Microsoft application client ID is not configured.');
  microsoftModule = microsoftModule || window.msal;
  if (!microsoftModule?.PublicClientApplication) throw new Error(`MSAL Browser ${MSAL_BROWSER_VERSION} could not be loaded.`);
  microsoftClient = new microsoftModule.PublicClientApplication({
    auth: {
      clientId: microsoftConfig.clientId,
      authority: microsoftConfig.authority || 'https://login.microsoftonline.com/common',
      redirectUri: microsoftConfig.redirectUri || getCurrentRedirectUri(),
      postLogoutRedirectUri: microsoftConfig.redirectUri || getCurrentRedirectUri(),
      navigateToLoginRequestUrl: false
    },
    cache: { cacheLocation: 'localStorage' }
  });
  if (typeof microsoftClient.initialize === 'function') await microsoftClient.initialize();
  const accounts = microsoftClient.getAllAccounts();
  microsoftAccount = microsoftClient.getActiveAccount?.() || accounts[0] || null;
  if (microsoftAccount && microsoftClient.setActiveAccount) microsoftClient.setActiveAccount(microsoftAccount);
  updateAccountUI();
  return microsoftClient;
}

async function initMicrosoft() {
  if (!microsoftConfig.clientId) {
    if (cloudProvider === 'onedrive') updateProviderStatus();
    return;
  }
  try {
    await ensureMicrosoftClient();
    if (microsoftAccount && cloudProvider === 'onedrive') await pullOneDrive({ initial: true });
    else if (cloudProvider === 'onedrive') updateProviderStatus();
    if (currentView === 'settings') renderSettings();
  } catch (error) {
    console.error(error);
    if (cloudProvider === 'onedrive') updateSyncPill('error', 'Microsoft connection error');
  }
}

async function signInMicrosoft() {
  try {
    const client = await ensureMicrosoftClient();
    updateSyncPill('syncing', 'Opening Microsoft sign-in…');
    const result = await client.loginPopup({ scopes: MICROSOFT_GRAPH_SCOPES, prompt: 'select_account' });
    microsoftAccount = result.account;
    if (microsoftAccount && client.setActiveAccount) client.setActiveAccount(microsoftAccount);
    setCloudProvider('onedrive');
    updateAccountUI();
    await pullOneDrive({ initial: true });
    if (currentView === 'settings') renderSettings();
    toast('Signed in with Microsoft. OneDrive synchronisation is active.');
  } catch (error) {
    console.error(error);
    updateProviderStatus();
    toast(`Microsoft sign-in failed: ${error.message}`);
  }
}

async function signOutMicrosoft() {
  if (!microsoftClient || !microsoftAccount) return;
  try {
    const account = microsoftAccount;
    microsoftAccount = null;
    updateAccountUI();
    await microsoftClient.logoutPopup({ account, postLogoutRedirectUri: microsoftConfig.redirectUri || getCurrentRedirectUri(), mainWindowRedirectUri: microsoftConfig.redirectUri || getCurrentRedirectUri() });
  } catch (error) {
    console.error(error);
    toast(`Microsoft sign-out failed: ${error.message}`);
  } finally {
    microsoftAccount = null;
    updateProviderStatus();
    if (currentView === 'settings') renderSettings();
  }
}

async function getMicrosoftAccessToken({ interactive = false } = {}) {
  const client = await ensureMicrosoftClient();
  if (!microsoftAccount) throw new Error('Sign in with Microsoft first.');
  const request = { account: microsoftAccount, scopes: MICROSOFT_GRAPH_SCOPES };
  try {
    return (await client.acquireTokenSilent(request)).accessToken;
  } catch (error) {
    if (!interactive) throw error;
    return (await client.acquireTokenPopup(request)).accessToken;
  }
}

async function graphError(response) {
  try {
    const body = await response.json();
    return new Error(body?.error?.message || `Microsoft Graph request failed (${response.status}).`);
  } catch {
    return new Error(`Microsoft Graph request failed (${response.status}).`);
  }
}

async function readOneDriveState({ interactive = false } = {}) {
  const token = await getMicrosoftAccessToken({ interactive });
  const response = await fetch(oneDriveStateUrl(), {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    redirect: 'follow'
  });
  if (response.status === 404) return null;
  if (!response.ok) throw await graphError(response);
  const text = await response.text();
  if (!text.trim()) return null;
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('The OneDrive progress file is invalid.');
  return parsed;
}

async function writeOneDriveState({ interactive = false } = {}) {
  const token = await getMicrosoftAccessToken({ interactive });
  const response = await fetch(oneDriveStateUrl(), {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(state, null, 2)
  });
  if (!response.ok) throw await graphError(response);
  return response.json();
}

function scheduleOneDriveSync() {
  if (!microsoftClient || !microsoftAccount || !navigator.onLine) {
    if (!navigator.onLine && microsoftAccount) updateSyncPill('offline', 'OneDrive offline · changes saved');
    return;
  }
  updateSyncPill('syncing', 'OneDrive changes pending…');
  clearTimeout(syncDebounce);
  syncDebounce = setTimeout(() => pushOneDrive({ auto: true }), 1600);
}

async function pushOneDrive({ auto = false, force = false } = {}) {
  if (!microsoftClient || !microsoftAccount) {
    if (!auto) toast('Sign in with Microsoft first.');
    return;
  }
  if (!navigator.onLine) {
    updateSyncPill('offline', 'OneDrive offline · changes saved');
    if (!auto) toast('The device is offline. Changes remain saved locally.');
    return;
  }
  if (isSyncing) return;
  isSyncing = true;
  updateSyncPill('syncing', 'Syncing OneDrive…');
  try {
    if (!force) {
      const remote = await readOneDriveState({ interactive: !auto });
      const remoteTime = remote?.updatedAt ? Date.parse(remote.updatedAt) : 0;
      const localTime = state.updatedAt ? Date.parse(state.updatedAt) : 0;
      if (remote && remoteTime > localTime + 1000) {
        state = mergeDefaults(remote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        cloudDirty = false;
        renderCurrentView();
        updateSyncPill('synced', 'Newer OneDrive version loaded');
        toast('A newer OneDrive version was loaded.');
        return;
      }
    }
    await writeOneDriveState({ interactive: !auto });
    cloudDirty = false;
    updateSyncPill('synced', `OneDrive ${new Date().toLocaleTimeString('en-NZ', { hour:'2-digit', minute:'2-digit' })}`);
    if (!auto) toast('OneDrive synchronisation completed.');
  } catch (error) {
    console.error(error);
    updateSyncPill('error', 'OneDrive sync failed');
    if (!auto) toast(`OneDrive sync failed: ${error.message}`);
  } finally {
    isSyncing = false;
  }
}

async function pullOneDrive({ initial = false, force = false } = {}) {
  if (!microsoftClient || !microsoftAccount) {
    if (!initial) toast('Sign in with Microsoft first.');
    return;
  }
  if (!navigator.onLine) {
    updateSyncPill('offline', 'OneDrive offline · changes saved');
    return;
  }
  if (isSyncing) return;
  isSyncing = true;
  updateSyncPill('syncing', 'Checking OneDrive…');
  try {
    const remote = await readOneDriveState({ interactive: !initial });
    if (!remote) {
      await writeOneDriveState({ interactive: !initial });
      hasLocalState = true;
      cloudDirty = false;
      updateSyncPill('synced', 'Initial OneDrive copy saved');
      return;
    }
    const remoteTime = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
    const localTime = state.updatedAt ? Date.parse(state.updatedAt) : 0;
    if (force || !hasLocalState || remoteTime > localTime) {
      state = mergeDefaults(remote);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      hasLocalState = true;
      cloudDirty = false;
      renderCurrentView();
      updateSyncPill('synced', 'OneDrive data loaded');
      if (!initial) toast('OneDrive data loaded onto this device.');
    } else if (localTime > remoteTime) {
      isSyncing = false;
      await pushOneDrive({ auto: initial });
      return;
    } else {
      cloudDirty = false;
      updateSyncPill('synced', 'OneDrive up to date');
    }
  } catch (error) {
    console.error(error);
    updateSyncPill('error', 'OneDrive check failed');
    if (!initial) toast(`OneDrive check failed: ${error.message}`);
  } finally {
    isSyncing = false;
  }
}

async function pushActiveCloud(options = {}) {
  if (cloudProvider === 'onedrive') return pushOneDrive(options);
  if (cloudProvider === 'supabase') return pushCloud(options);
  toast('Cloud sync is set to local device only.');
}

async function pullActiveCloud(options = {}) {
  if (cloudProvider === 'onedrive') return pullOneDrive(options);
  if (cloudProvider === 'supabase') return pullCloud(options);
  if (!options.initial) toast('Cloud sync is set to local device only.');
}

async function initCloud() {
  if (!cloudConfig.url || !cloudConfig.key) {
    if (cloudProvider === 'supabase') updateProviderStatus();
    return;
  }
  try {
    if (cloudProvider === 'supabase') updateSyncPill('syncing', 'Connecting…');
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
        if (cloudUser && cloudProvider === 'supabase') await pullCloud({ initial: true });
        else if (cloudProvider === 'supabase') updateProviderStatus();
        if (currentView === 'settings') renderSettings();
      }, 0);
    });
    if (cloudUser && cloudProvider === 'supabase') await pullCloud({ initial: true });
    else if (cloudProvider === 'supabase') updateProviderStatus();
  } catch (error) {
    console.error(error);
    if (cloudProvider === 'supabase') updateSyncPill('error', 'Cloud connection error');
  }
}

function scheduleCloudSync() {
  if (cloudProvider === 'local') {
    updateSyncPill('local', 'Local only');
    return;
  }
  if (cloudProvider === 'onedrive') {
    scheduleOneDriveSync();
    return;
  }
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
  clearInterval(timerInterval);
  timerRunning = false;
  timerEndAt = null;
  timerDuration = Number(minutes) * 60;
  timerRemaining = timerDuration;
  updateTimerDisplay();
  document.querySelectorAll('[data-minutes]').forEach(btn => btn.classList.toggle('selected', Number(btn.dataset.minutes) === Number(minutes)));
}
function completeTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerEndAt = null;
  timerRemaining = 0;
  updateTimerDisplay();
  const label = document.getElementById('timer-label').value || 'Session';
  toast(`${label} completed.`);
  if ('Notification' in window && Notification.permission === 'granted') new Notification('Session complete', { body: `${label} completed.` });
}
function updateRunningTimer() {
  if (!timerRunning || !timerEndAt) return;
  timerRemaining = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000));
  updateTimerDisplay();
  if (timerRemaining <= 0) completeTimer();
}
function toggleTimer() {
  if (timerRunning) {
    updateRunningTimer();
    clearInterval(timerInterval);
    timerRunning = false;
    timerEndAt = null;
    updateTimerDisplay();
    return;
  }
  if (timerRemaining === 0) timerRemaining = timerDuration;
  timerRunning = true;
  timerEndAt = Date.now() + timerRemaining * 1000;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateRunningTimer, 250);
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
  if (action === 'previous-day') { selectedDateKey = addDays(selectedDateKey, -1); renderToday(); return; }
  if (action === 'next-day') { selectedDateKey = addDays(selectedDateKey, 1); renderToday(); return; }
  if (action === 'go-today') { selectedDateKey = getNZDateKey(); renderToday(); return; }
  if (action === 'previous-week') { selectedDateKey = addDays(getWeekStart(selectedDateKey), -7); renderWeek(); return; }
  if (action === 'next-week') { selectedDateKey = addDays(getWeekStart(selectedDateKey), 7); renderWeek(); return; }
  if (action === 'current-week') { selectedDateKey = getNZDateKey(); renderWeek(); return; }
  if (action === 'open-day') { selectedDateKey = actionEl.dataset.date || getNZDateKey(); showView('today'); return; }
  if (action === 'toggle-day-mode') {
    const record = getDailyRecord(selectedDateKey);
    const currentMode = getPlanModeForDate(selectedDateKey);
    const hasChecks = Object.values(record.checks || {}).some(Boolean);
    if (hasChecks) {
      const ok = await confirmAction('Change this day’s programme?', 'Existing checklist progress will be retained but may not be visible in the other programme mode.');
      if (!ok) return;
    }
    record.planMode = currentMode === 'normal' ? 'minimum' : 'normal';
    record.taskPlanMode = record.planMode;
    saveState({ render: true });
    toast(`This task now uses the ${record.planMode} programme.`);
    return;
  }
  if (action === 'toggle-mode') {
    state.settings.programmeMode = state.settings.programmeMode === 'normal' ? 'minimum' : 'normal';
    saveState({ render: true }); toast(`Switched to ${state.settings.programmeMode} programme.`); return;
  }
  if (action === 'record-az-review') {
    if (recordAzureReview(id, actionEl.dataset.moduleId, actionEl.dataset.result)) {
      saveState({ render: true });
      const module = findAZModule(id, actionEl.dataset.moduleId);
      toast(`Recall recorded. Next review: ${formatDateKey(module.nextReview, { day:'numeric', month:'short' })}.`);
    }
    return;
  }
  if (action === 'add-recall-question') {
    const input = document.querySelector(`[data-recall-question-input="${CSS.escape(id)}"][data-module-id="${CSS.escape(actionEl.dataset.moduleId)}"]`);
    const question = input?.value.trim();
    if (!question) return toast('Enter a recall question first.');
    const module = findAZModule(id, actionEl.dataset.moduleId);
    if (!module) return;
    module.customQuestions = Array.isArray(module.customQuestions) ? module.customQuestions : [];
    module.customQuestions.push(question);
    saveState({ render: true });
    toast('Recall question added.');
    return;
  }
  if (action === 'delete-recall-question') {
    const module = findAZModule(id, actionEl.dataset.moduleId);
    const index = Number(actionEl.dataset.questionIndex);
    if (!module || !Array.isArray(module.customQuestions) || !Number.isInteger(index)) return;
    module.customQuestions.splice(index, 1);
    saveState({ render: true });
    toast('Recall question removed.');
    return;
  }
  if (action === 'delete-lab') {
    if (await confirmAction('Delete lab journal?', 'This practical evidence entry will be permanently removed.')) {
      state.azureLabs = state.azureLabs.filter(lab => lab.id !== id);
      saveState({ render: true });
      toast('Lab journal deleted.');
    }
    return;
  }
  if (action === 'kata-clean') {
    const kata = findKata(id);
    if (!kata) return;
    const today = getNZDateKey();
    kata.practiceCount = (kata.practiceCount || 0) + 1;
    kata.lastPractised = today;
    kata.lastPerformanceResult = 'clean';
    kata.retentionIntervalDays = getNextKataInterval(kata.retentionIntervalDays);
    kata.nextReview = addDays(today, kata.retentionIntervalDays);
    kata.confidence = Math.min(5, Number(kata.confidence || 1) + 1);
    if (Number(kata.sequenceProgress || 0) >= 100 && ['sequence-known', 'developing'].includes(kata.status)) kata.status = 'comfortable';
    saveState({ render: true });
    toast(`${kata.name} retained. Next review: ${formatDateKey(kata.nextReview, { day:'numeric', month:'short' })}.`);
    return;
  }
  if (action === 'kata-mistakes') {
    const kata = findKata(id);
    if (!kata) return;
    const today = getNZDateKey();
    kata.practiceCount = (kata.practiceCount || 0) + 1;
    kata.lastPractised = today;
    kata.lastPerformanceResult = 'mistakes';
    kata.retentionIntervalDays = 3;
    kata.nextReview = addDays(today, 3);
    kata.confidence = Math.max(1, Number(kata.confidence || 1) - 1);
    saveState({ render: true });
    toast(`${kata.name} scheduled again in 3 days.`);
    return;
  }
  if (action === 'az-confidence') { findAZ(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'dan-confidence') { findDan(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'kata-confidence') { findKata(id).confidence = Number(actionEl.dataset.value); saveState({ render:true }); return; }
  if (action === 'log-dan-practice') { const item=findDan(id); item.practiceCount=(item.practiceCount||0)+1; item.lastPractised=getNZDateKey(); item.lastAssessmentResult=getNZDateKey(); if(item.status==='not-started') item.status='learning'; saveState({render:true}); toast('3rd Dan practice and assessment logged.'); return; }
  if (action === 'log-kata-practice') { const item=findKata(id); item.practiceCount=(item.practiceCount||0)+1; item.lastPractised=getNZDateKey(); if(item.status==='not-started') item.status='learning'; if(!item.nextReview) { item.retentionIntervalDays=Number(item.retentionIntervalDays||7); item.nextReview=addDays(getNZDateKey(),item.retentionIntervalDays); } saveState({render:true}); toast(`${item.name} practice logged.`); return; }
  if (action === 'delete-note') { if (await confirmAction('Delete note?', 'This note will be permanently removed.')) { state.notes=state.notes.filter(n=>n.id!==id); saveState({render:true}); } return; }
  if (action === 'export-backup') return exportBackup();
  if (action === 'choose-import') return document.getElementById('import-file').click();
  if (action === 'save-programme-settings') {
    state.settings.programmeMode=document.getElementById('mode-toggle').checked?'minimum':'normal';
    state.settings.programmeStartDate=document.getElementById('programme-start-date').value||PROGRAMME_START_DATE;
    state.settings.rolloverEnabled=document.getElementById('rollover-toggle').checked;
    const selectedRolloverStart=document.getElementById('rollover-start-date').value||state.settings.programmeStartDate;
    state.settings.rolloverStartDate=selectedRolloverStart < state.settings.programmeStartDate ? state.settings.programmeStartDate : selectedRolloverStart;
    saveState({render:true});
    toast('Programme and rollover settings saved.');
    return;
  }
  if (action === 'save-sync-provider') {
    const selected=document.getElementById('cloud-provider').value;
    setCloudProvider(selected);
    if(selected==='onedrive' && microsoftAccount) await pullOneDrive({initial:true});
    if(selected==='supabase' && cloudUser) await pullCloud({initial:true});
    renderSettings();
    toast(`${selected==='onedrive'?'Microsoft OneDrive':selected==='supabase'?'Supabase':'Local-only'} sync selected.`);
    return;
  }
  if (action === 'save-microsoft-config') {
    const clientId=document.getElementById('microsoft-client-id').value.trim();
    const authority=document.getElementById('microsoft-authority').value.trim().replace(/\/$/,'')||'https://login.microsoftonline.com/common';
    const redirectUri=document.getElementById('microsoft-redirect-uri').value.trim()||getCurrentRedirectUri();
    if(!clientId){ toast('Enter the Microsoft application client ID.'); return; }
    localStorage.setItem(MICROSOFT_CONFIG_KEY,JSON.stringify({clientId,authority,redirectUri}));
    toast('Microsoft configuration saved. Reloading app…'); setTimeout(()=>location.reload(),600); return;
  }
  if (action === 'clear-microsoft-config') { if(await confirmAction('Clear Microsoft configuration?','Microsoft sign-in will be disabled until a client ID is configured again.')) { localStorage.removeItem(MICROSOFT_CONFIG_KEY); if(cloudProvider==='onedrive') localStorage.setItem(CLOUD_PROVIDER_KEY,'local'); location.reload(); } return; }
  if (action === 'sign-in-microsoft') return signInMicrosoft();
  if (action === 'sign-out-microsoft') return signOutMicrosoft();
  if (action === 'sync-onedrive') { setCloudProvider('onedrive'); return pushOneDrive({force:false}); }
  if (action === 'pull-onedrive') { setCloudProvider('onedrive'); if(await confirmAction('Replace this device with OneDrive data?','Any newer unsynchronised local changes may be replaced.')) return pullOneDrive({force:true}); return; }
  if (action === 'push-onedrive') { setCloudProvider('onedrive'); if(await confirmAction('Replace OneDrive data with this device?','The local app state will be uploaded as the current OneDrive version.')) return pushOneDrive({force:true}); return; }
  if (action === 'save-cloud-config') {
    const url=document.getElementById('supabase-url').value.trim().replace(/\/$/,'');
    const key=document.getElementById('supabase-key').value.trim();
    if(!url || !key) return toast('Enter both the Supabase project URL and publishable key.');
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify({url,key})); toast('Cloud configuration saved. Reloading app…'); setTimeout(()=>location.reload(),600); return;
  }
  if (action === 'clear-cloud-config') { if(await confirmAction('Clear cloud configuration?','The app will continue in local-only mode.')) { localStorage.removeItem(CLOUD_CONFIG_KEY); location.reload(); } return; }
  if (action === 'sync-now') { setCloudProvider('supabase'); return pushCloud({force:false}); }
  if (action === 'pull-cloud') { setCloudProvider('supabase'); if(await confirmAction('Replace this device with cloud data?','Any newer unsynchronised local changes may be replaced.')) return pullCloud({force:true}); return; }
  if (action === 'push-cloud') { setCloudProvider('supabase'); if(await confirmAction('Replace cloud data with this device?','The local app state will be uploaded as the current cloud version.')) return pushCloud({force:true}); return; }
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
    const record=getDailyRecord(el.dataset.date);
    record[el.dataset.dailyField]=el.value;
    saveState({render:el.dataset.dailyField==='result'});
    return;
  }
  if (el.matches('[data-az-status]')) { findAZ(el.dataset.azStatus).status=el.value; saveState(); return; }
  if (el.matches('[data-az-module]')) {
    const module=findAZModule(el.dataset.azModule,el.dataset.moduleId);
    if (!module) return;
    module.complete=el.checked;
    module.evidence={...defaultEvidence(),...(module.evidence||{}),learned:el.checked};
    if(el.checked){
      module.lastStudied=getNZDateKey();
      module.masteryLevel=Math.max(1,Number(module.masteryLevel||0));
      if(!module.nextReview){ module.reviewIntervalDays=1; module.nextReview=addDays(getNZDateKey(),1); }
    }
    saveState({render:true}); return;
  }
  if (el.matches('[data-az-mastery]')) {
    const module=findAZModule(el.dataset.azMastery,el.dataset.moduleId);
    if (!module) return;
    module.masteryLevel=Number(el.value);
    if(module.masteryLevel>0 && !module.lastStudied) module.lastStudied=getNZDateKey();
    saveState({render:true}); return;
  }
  if (el.matches('[data-az-evidence]')) {
    const module=findAZModule(el.dataset.pathId,el.dataset.moduleId);
    if (!module) return;
    module.evidence={...defaultEvidence(),...(module.evidence||{})};
    module.evidence[el.dataset.azEvidence]=el.checked;
    if(el.checked && el.dataset.azEvidence==='learned'){ module.complete=true; module.masteryLevel=Math.max(1,Number(module.masteryLevel||0)); }
    if(el.checked && el.dataset.azEvidence==='practised') module.masteryLevel=Math.max(3,Number(module.masteryLevel||0));
    if(el.checked && ['troubleshot','verified'].includes(el.dataset.azEvidence)) module.masteryLevel=Math.max(4,Number(module.masteryLevel||0));
    saveState({render:true}); return;
  }
  if (el.matches('[data-dan-status]')) { findDan(el.dataset.danStatus).status=el.value; saveState(); return; }
  if (el.matches('[data-dan-rating]')) {
    const item=findDan(el.dataset.danRating);
    if (!item) return;
    item.ratings={...defaultRatings(),...(item.ratings||{})};
    item.ratings[el.dataset.ratingField]=Number(el.value);
    item.lastAssessmentResult=getNZDateKey();
    if(item.status==='not-started') item.status='learning';
    saveState({render:true}); return;
  }
  if (el.matches('[data-dan-check]')) { const item=findDan(el.dataset.danCheck); item.checkpoints.find(c=>c.id===el.dataset.checkId).complete=el.checked; saveState({render:true}); return; }
  if (el.matches('[data-dan-side]')) { const item=findDan(el.dataset.danId); item[el.dataset.danSide==='right'?'rightComplete':'leftComplete']=el.checked; saveState(); return; }
  if (el.matches('[data-kata-status]')) {
    const item=findKata(el.dataset.kataStatus);
    item.status=el.value;
    if(['sequence-known','comfortable','instructor-checked','grading-ready','complete'].includes(el.value)) {
      item.sections=(item.sections||defaultKataSections(100)).map(section=>({...section,level:5}));
      item.sequenceProgress=100;
      if(!item.nextReview){ item.retentionIntervalDays=Number(item.retentionIntervalDays||7); item.nextReview=addDays(getNZDateKey(),item.retentionIntervalDays); }
    }
    saveState({render:true}); return;
  }
  if (el.matches('[data-kata-section]')) {
    const item=findKata(el.dataset.kataSection);
    if (!item) return;
    const section=(item.sections||[]).find(entry=>entry.id===el.dataset.sectionId);
    if (!section) return;
    section.level=Number(el.value);
    updateKataProgressFromSections(item);
    saveState({render:true}); return;
  }
  if (el.id === 'import-file' && el.files?.[0]) { importBackup(el.files[0]); el.value=''; return; }
});

document.addEventListener('input', event => {
  const el=event.target;
  if (el.matches('[data-daily-field="notes"]')) scheduleInputSave(`daily:${el.dataset.date}`, ()=>{ getDailyRecord(el.dataset.date).notes=el.value; saveState(); });
  if (el.matches('[data-az-notes]')) scheduleInputSave(`az:${el.dataset.azNotes}`, ()=>{ findAZ(el.dataset.azNotes).notes=el.value; saveState(); });
  if (el.matches('[data-dan-notes]')) scheduleInputSave(`dan:${el.dataset.danNotes}`, ()=>{ findDan(el.dataset.danNotes).notes=el.value; saveState(); });
  if (el.matches('[data-kata-notes]')) scheduleInputSave(`kata:${el.dataset.kataNotes}`, ()=>{ findKata(el.dataset.kataNotes).notes=el.value; saveState(); });
});

document.addEventListener('submit', async event => {
  if (event.target.id === 'azure-lab-form') {
    event.preventDefault();
    const data=new FormData(event.target);
    const [pathId,moduleId]=String(data.get('moduleRef')||'').split('::');
    const module=findAZModule(pathId,moduleId);
    if(!module) return toast('Select a valid Azure topic.');
    const objective=String(data.get('objective')||'').trim();
    const configuration=String(data.get('configuration')||'').trim();
    const result=String(data.get('result')||'').trim();
    if(!objective||!configuration||!result) return toast('Complete the objective, configuration and final result.');
    const lab={
      id:crypto.randomUUID(),
      pathId,
      moduleId,
      moduleName:module.name,
      tool:String(data.get('tool')||'Azure portal'),
      objective,
      configuration,
      failure:String(data.get('failure')||'').trim(),
      diagnosis:String(data.get('diagnosis')||'').trim(),
      result,
      cleanup:String(data.get('cleanup')||'').trim(),
      commands:String(data.get('commands')||'').trim(),
      createdAt:new Date().toISOString()
    };
    state.azureLabs.push(lab);
    module.evidence={...defaultEvidence(),...(module.evidence||{}),practised:true,verified:true};
    if(lab.failure||lab.diagnosis) module.evidence.troubleshot=true;
    module.lastStudied=getNZDateKey();
    module.masteryLevel=Math.max(lab.failure||lab.diagnosis?4:3,Number(module.masteryLevel||0));
    if(!module.nextReview){ module.reviewIntervalDays=3; module.nextReview=addDays(getNZDateKey(),3); }
    event.target.reset();
    saveState({render:true});
    toast('Azure lab journal saved and mastery updated.');
    return;
  }
  if (event.target.id === 'note-form') {
    event.preventDefault(); const data=new FormData(event.target);
    const title = data.get('title').trim();
    const body = data.get('body').trim();
    if (!title || !body) { toast('Enter both a note title and note text.'); return; }
    state.notes.push({id:crypto.randomUUID(),title,body,createdAt:new Date().toISOString()});
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
document.getElementById('sync-btn').addEventListener('click', () => {
  if (cloudProvider === 'onedrive' && microsoftAccount) pushOneDrive();
  else if (cloudProvider === 'supabase' && cloudUser) pushCloud();
  else if (cloudProvider === 'local') toast('Cloud sync is set to local device only.');
  else showView('settings');
});
document.getElementById('install-btn').addEventListener('click', requestInstall);
document.querySelectorAll('[data-minutes]').forEach(btn => btn.addEventListener('click', () => setTimerMinutes(btn.dataset.minutes)));
document.getElementById('timer-start').addEventListener('click', toggleTimer);
document.getElementById('timer-reset').addEventListener('click', () => setTimerMinutes(timerDuration / 60));

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt=event; document.getElementById('install-btn').classList.remove('hidden');
});
window.addEventListener('online', () => {
  if (cloudProvider === 'onedrive' && microsoftAccount) { updateSyncPill('syncing','Back online · syncing OneDrive…'); cloudDirty ? pushOneDrive({auto:true}) : pullOneDrive({initial:true}); }
  else if (cloudProvider === 'supabase' && cloudUser) { updateSyncPill('syncing','Back online · syncing Supabase…'); cloudDirty ? pushCloud({auto:true}) : pullCloud({initial:true}); }
  else updateProviderStatus();
});
window.addEventListener('offline', () => {
  if ((cloudProvider === 'onedrive' && microsoftAccount) || (cloudProvider === 'supabase' && cloudUser)) updateSyncPill('offline','Offline · changes saved');
});
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState!=='visible' || !navigator.onLine) return;
  if(cloudProvider==='onedrive' && microsoftAccount) pullOneDrive({initial:true});
  if(cloudProvider==='supabase' && cloudUser) pullCloud({initial:true});
});

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
updateProviderStatus();
initCloud();
initMicrosoft();
setInterval(() => {
  if(!navigator.onLine || cloudDirty) return;
  if(cloudProvider==='onedrive' && microsoftAccount) pullOneDrive({initial:true});
  if(cloudProvider==='supabase' && cloudUser) pullCloud({initial:true});
}, 60000);
