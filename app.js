const STORAGE_KEY = 'ka_progress_hub_state_v1';
const CLOUD_CONFIG_KEY = 'ka_progress_hub_cloud_config_v1';
const CLOUD_PROVIDER_KEY = 'ka_progress_hub_cloud_provider_v1';
const MICROSOFT_CONFIG_KEY = 'ka_progress_hub_microsoft_config_v1';
const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const MSAL_BROWSER_VERSION = '5.17.0';
const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const MICROSOFT_GRAPH_SCOPES = ['Files.ReadWrite.AppFolder'];
const ONEDRIVE_STATE_FILE = 'karate-azure-progress-state.json';

const APP_VERSION = '1.8.0';
const STATE_VERSION = 5;
const PROGRAMME_START_DATE = '2026-07-11';

const STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['learning', 'Learning'],
  ['understood', 'Understood'],
  ['guided', 'Practised with guidance'],
  ['independent', 'Practised independently'],
  ['grading-ready', 'Grading-ready'],
  ['needs-review', 'Needs review']
];

const KATA_STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['learning', 'Learning'],
  ['sequence-known', 'Sequence known'],
  ['developing', 'Needs correction'],
  ['comfortable', 'Reliable in training'],
  ['instructor-checked', 'Instructor checked'],
  ['grading-ready', 'Grading-ready'],
  ['needs-review', 'Needs review']
];

const AZ_STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['in-progress', 'In progress'],
  ['theory-complete', 'Content completed'],
  ['labs-complete', 'Practical work completed'],
  ['revision-required', 'Revision required'],
  ['confident', 'Confident'],
  ['complete', 'Completed']
];

const DAY_TYPE_OPTIONS = [
  ['azure', 'Azure Study Day'],
  ['karate', 'Karate Training Day'],
  ['rest', 'Rest or Recovery Day'],
  ['azure-review', 'Review Day — Azure'],
  ['karate-review', 'Review Day — Karate']
];

const DEFAULT_WEEKLY_DAY_TYPES = {
  Monday: 'karate',
  Tuesday: 'azure',
  Wednesday: 'rest',
  Thursday: 'karate',
  Friday: 'azure',
  Saturday: 'karate-review',
  Sunday: 'azure'
};

const TASK_STATUS_OPTIONS = [
  ['not-started', 'Not started'],
  ['in-progress', 'In progress'],
  ['completed', 'Completed'],
  ['partial', 'Partially completed'],
  ['missed', 'Missed'],
  ['rescheduled', 'Rescheduled']
];

const AZURE_STAGE_DEFS = [
  ['learn', 'Learn', 'Complete the lesson, unit or module.'],
  ['understand', 'Understand', 'Explain the topic in your own words.'],
  ['perform', 'Perform', 'Complete a portal, PowerShell, Azure CLI, ARM or Bicep task.'],
  ['test', 'Test', 'Complete questions, an assessment or a scenario.'],
  ['review', 'Review', 'Correct mistakes and review weak areas.'],
  ['retain', 'Retain', 'Pass a later recall or practical check.']
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
  [0, 'Not assessed'],
  [1, 'Needs major work'],
  [2, 'Developing'],
  [3, 'Acceptable in training'],
  [4, 'Near grading standard'],
  [5, 'Grading standard demonstrated']
];

const KATA_SECTION_NAMES = [
  'Complete sequence known',
  'Embusen verified',
  'Stances assessed',
  'Transitions assessed',
  'Rhythm assessed',
  'Timing assessed',
  'Kime assessed',
  'Speed and power assessed',
  'Kiai points confirmed',
  'Technical questions practised',
  'Reliable grading-standard performance demonstrated'
];

// Kept as a compatibility fallback for old daily records. Active scheduling uses editable day types.
const DAY_PLANS = {
  normal: {
    Monday: { family: 'Karate training day.', tasks: [{ id: 'legacy-mon-karate', title: 'Karate training', type: 'karate', items: ['Complete the planned karate session', 'Record ratings and evidence'] }] },
    Tuesday: { family: 'Azure study day.', tasks: [{ id: 'legacy-tue-azure', title: 'Azure study', type: 'azure', items: ['Complete the planned Azure work', 'Validate and record evidence'] }] },
    Wednesday: { family: 'Rest or recovery day.', tasks: [{ id: 'legacy-wed-rest', title: 'Rest or recovery', type: 'rest', items: ['Protect recovery and prepare for the next task'] }] },
    Thursday: { family: 'Karate training day.', tasks: [{ id: 'legacy-thu-karate', title: 'Karate training', type: 'karate', items: ['Complete the planned karate session', 'Record ratings and evidence'] }] },
    Friday: { family: 'Azure study day.', tasks: [{ id: 'legacy-fri-azure', title: 'Azure study', type: 'azure', items: ['Complete the planned Azure work', 'Validate and record evidence'] }] },
    Saturday: { family: 'Karate review day.', tasks: [{ id: 'legacy-sat-karate-review', title: 'Karate review', type: 'karate-review', items: ['Review the due kata or grading section', 'Record the retention result'] }] },
    Sunday: { family: 'Azure study day.', tasks: [{ id: 'legacy-sun-azure', title: 'Azure study', type: 'azure', items: ['Complete the planned Azure work', 'Record the next action'] }] }
  },
  minimum: {
    Monday: { family: 'Reduced karate task.', tasks: [{ id: 'legacy-min-mon-karate', title: 'Minimum karate task', type: 'karate', items: ['Complete one focused technique or kata review'] }] },
    Tuesday: { family: 'Reduced Azure task.', tasks: [{ id: 'legacy-min-tue-azure', title: 'Minimum Azure task', type: 'azure', items: ['Complete one focused Azure step'] }] },
    Wednesday: { family: 'Recovery day.', tasks: [{ id: 'legacy-min-wed-rest', title: 'Recovery', type: 'rest', items: ['No study or training required'] }] },
    Thursday: { family: 'Reduced karate task.', tasks: [{ id: 'legacy-min-thu-karate', title: 'Minimum karate task', type: 'karate', items: ['Complete one focused technique or kata review'] }] },
    Friday: { family: 'Reduced Azure task.', tasks: [{ id: 'legacy-min-fri-azure', title: 'Minimum Azure task', type: 'azure', items: ['Complete one focused Azure step'] }] },
    Saturday: { family: 'Karate retention review.', tasks: [{ id: 'legacy-min-sat-review', title: 'Minimum karate review', type: 'karate-review', items: ['Review one due kata or grading section'] }] },
    Sunday: { family: 'Reduced Azure task.', tasks: [{ id: 'legacy-min-sun-azure', title: 'Minimum Azure task', type: 'azure', items: ['Complete one focused Azure step'] }] }
  }
};

const TASK_CHECK_MIGRATIONS = {
  normal: {
    Monday: [{ from: 'az-recall-am', to: 'legacy-mon-karate', offset: 0 }],
    Tuesday: [{ from: 'new-kata-am', to: 'legacy-tue-azure', offset: 0 }],
    Wednesday: [{ from: 'az-troubleshoot-am', to: 'legacy-wed-rest', offset: 0 }],
    Thursday: [{ from: 'dan-group-b-am', to: 'legacy-thu-karate', offset: 0 }],
    Friday: [{ from: 'fri-plan-am', to: 'legacy-fri-azure', offset: 0 }],
    Saturday: [{ from: 'kata-main-am', to: 'legacy-sat-karate-review', offset: 0 }],
    Sunday: [{ from: 'az-weekly-am', to: 'legacy-sun-azure', offset: 0 }]
  },
  minimum: {}
};

const DEFAULT_AZ_PATHS = [
  {
    id: 'az-prerequisites',
    name: 'AZ-104: Prerequisites for Azure administrators',
    targetWeeks: 'Weeks 1–2',
    modules: ['Azure Cloud Shell', 'Azure PowerShell and CLI foundations', 'Azure Resource Manager foundations', 'Deploy Azure infrastructure by using JSON ARM templates']
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
  { id: 'kihon-1', group: 'Kihon', title: 'Kizami Zuki, Jodan Junzuki, Chudan Gyakuzuki', checkpoints: ['Free kamae', 'Correct target levels', 'Stable stepping', 'Hip rotation', 'Hikite and completion'] },
  { id: 'kihon-2', group: 'Kihon', title: 'Ageuke, Sotouke with the same arm, Gyakuzuki', checkpoints: ['Block path', 'Same-arm transition', 'Stable retreat', 'Counter timing', 'Finishing posture'] },
  { id: 'kihon-3', group: 'Kihon', title: 'Uchiuke, Kizami Zuki, Gyakuzuki', checkpoints: ['Kokutsu Dachi', 'Weight transfer', 'Kizami Zuki timing', 'Zenkutsu Dachi finish', 'Hip connection'] },
  { id: 'kihon-4', group: 'Kihon', title: 'Kokutsu Dachi to Zenkutsu Dachi transition', checkpoints: ['Stable Kokutsu Dachi', 'Controlled weight transfer', 'Hip connection', 'Stable Zenkutsu Dachi'] },
  { id: 'kihon-5', group: 'Kihon', title: 'Kokutsu Shutou Uke, Kizami Maegeri, Zenkutsu Nukite', checkpoints: ['Shutou position', 'Kokutsu balance', 'Maegeri return', 'Transition to Zenkutsu', 'Nukite target'] },
  { id: 'kihon-6', group: 'Kihon', title: 'Maegeri, Gyakuzuki, Yokogeri Kekomi, Gyakuzuki, Mawashigeri, Gyakuzuki', checkpoints: ['Kick chamber', 'Correct return', 'Punch connection', 'Balance between kicks', 'Right and left sides'] },
  { id: 'kihon-7', group: 'Kihon', title: 'Ushirogeri', checkpoints: ['Head turn', 'Knee line', 'Heel target', 'Balance', 'Controlled recovery'] },
  { id: 'kihon-8', group: 'Kihon', title: 'Maegeri, Yokogeri Kekomi and Ushirogeri on both sides', checkpoints: ['Same-foot sequence', 'Direction changes', 'Chamber position', 'Balance', 'Both sides'] },
  { id: 'tokui-kata', group: 'Kata', title: 'Tokui kata — Jion', checkpoints: ['Select and confirm tokui kata', 'Complete sequence', 'Embusen', 'Stances and transitions', 'Rhythm and timing', 'Kime, speed and power', 'Kiai points', 'Technical questions', 'Reliable grading-standard performance'] },
  { id: 'jiyu-kumite', group: 'Kumite', title: 'Jiyu Kumite', checkpoints: ['Movement', 'Distance control', 'Timing', 'Attacking combinations', 'Defence and counterattacks', 'Fitness and composure', 'Grading-standard practice rounds'] }
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
  status: category === 'known' ? 'sequence-known' : 'not-started',
  sequenceProgress: category === 'known' ? 100 : 0,
  confidence: category === 'known' ? 3 : 1,
  notes: '',
  lastPractised: '',
  practiceCount: 0,
  order: index + 1,
  mainCorrection: '',
  weakerSide: 'not-assessed',
  instructorFeedback: '',
  evidence: '',
  gradingReadiness: 0
}));

const ROADMAP_BLUEPRINTS = [
  {
    title: 'Foundation and current-position month',
    monthlyGoals: [
      ['Azure', 'Complete ARM-template units 5, 6 and 7 without marking the topic mastered prematurely.'],
      ['Azure', 'Demonstrate Learn, Understand and Perform for the ARM-template topic with PowerShell evidence.'],
      ['Karate', 'Establish a Jion grading baseline and assess embusen, stances and transitions.'],
      ['Karate', 'Record baseline right- and left-side ratings for all 3rd Dan kihon combinations.']
    ],
    weeks: [
      [['Azure', 'Complete ARM-template unit 5 using PowerShell and capture all required evidence.'], ['Karate', 'Complete a dedicated Jion session and identify one main correction.']],
      [['Azure', 'Complete unit 6 and verify template behaviour and outputs.'], ['Karate', 'Assess Jion embusen, stances and transitions.']],
      [['Azure', 'Complete unit 7 and finish the module content.'], ['Karate', 'Assess Kihon combinations 1–4 on both sides.']],
      [['Azure', 'Test and review ARM templates; schedule the first retention check.'], ['Karate', 'Assess Kihon combinations 5–8 and complete one Jion grading-speed performance.']],
      [['Azure', 'Use this week for catch-up or a second ARM-template practical check.'], ['Karate', 'Use this week for Jion correction work or an instructor check.']]
    ]
  },
  {
    title: 'Identity, governance and Jion quality month',
    monthlyGoals: [
      ['Azure', 'Progress through Manage identities and governance with practical RBAC and Policy evidence.'],
      ['Azure', 'Complete at least two active-recall checks without notes.'],
      ['Karate', 'Improve Jion rhythm, timing, kime and power.'],
      ['Karate', 'Complete at least one focused kumite session each week.']
    ],
    weeks: [
      [['Azure', 'Study Microsoft Entra users and groups and complete one administration task.'], ['Karate', 'Jion rhythm and timing assessment.']],
      [['Azure', 'Study subscriptions, management groups and scope.'], ['Karate', 'Jion kime, speed and power assessment.']],
      [['Azure', 'Complete an Azure RBAC lab and troubleshoot one access issue.'], ['Karate', 'Kumite movement and distance-control session.']],
      [['Azure', 'Study Azure Policy, locks and tags; complete a scenario test.'], ['Karate', 'Jion technical questions and full performance review.']],
      [['Azure', 'Catch up and complete due identity/governance reviews.'], ['Karate', 'Instructor feedback or video review.']]
    ]
  },
  {
    title: 'Storage and technical consistency month',
    monthlyGoals: [
      ['Azure', 'Complete the storage learning path with security and access labs.'],
      ['Azure', 'Record cleanup and cost-control evidence for practical work.'],
      ['Karate', 'Raise the weakest kihon side by at least one rating point.'],
      ['Karate', 'Demonstrate Jion reliably three times across the month.']
    ],
    weeks: [
      [['Azure', 'Configure a storage account and document redundancy choices.'], ['Karate', 'Kihon weak-side technique session.']],
      [['Azure', 'Complete Blob Storage access and security practice.'], ['Karate', 'Jion stances and transitions correction.']],
      [['Azure', 'Complete Azure Files or lifecycle-management practice.'], ['Karate', 'Kumite timing and counterattack session.']],
      [['Azure', 'Complete storage assessment, review mistakes and schedule retention.'], ['Karate', 'Full Jion performance and evidence review.']],
      [['Azure', 'Catch up or repeat a weak storage lab.'], ['Karate', 'Kata retention and technical questions.']]
    ]
  },
  {
    title: 'Compute and grading-integration month',
    monthlyGoals: [
      ['Azure', 'Complete core compute topics with VM and App Service evidence.'],
      ['Azure', 'Use PowerShell or Bicep for at least two deployments.'],
      ['Karate', 'Combine kihon, Jion and kumite into grading-style sessions.'],
      ['Karate', 'Obtain an instructor check or video-based self-assessment.']
    ],
    weeks: [
      [['Azure', 'Deploy and validate a virtual machine using the preferred tool.'], ['Karate', 'Kihon grading sequence session.']],
      [['Azure', 'Practise availability, disks and extensions.'], ['Karate', 'Jion full-performance session.']],
      [['Azure', 'Practise Container Instances, Container Apps or App Service.'], ['Karate', 'Jiyu Kumite grading rounds.']],
      [['Azure', 'Complete compute assessment and correct mistakes.'], ['Karate', 'Combined grading mock and weakness review.']],
      [['Azure', 'Catch up or repeat the weakest compute scenario.'], ['Karate', 'Recovery, mobility and technical correction.']]
    ]
  },
  {
    title: 'Networking and pressure-testing month',
    monthlyGoals: [
      ['Azure', 'Complete networking topics with routing, NSG and troubleshooting evidence.'],
      ['Azure', 'Explain traffic flow and diagnose at least two failure scenarios.'],
      ['Karate', 'Maintain Jion while improving kumite distance, timing and composure.'],
      ['Karate', 'Complete two grading-style pressure sessions.']
    ],
    weeks: [
      [['Azure', 'Configure VNets, subnets and peering.'], ['Karate', 'Jion retention and correction.']],
      [['Azure', 'Configure NSGs and routing; validate traffic flow.'], ['Karate', 'Kumite distance and timing.']],
      [['Azure', 'Practise Azure DNS and load balancing.'], ['Karate', 'Kihon under fatigue while preserving form.']],
      [['Azure', 'Use Network Watcher and troubleshoot a network scenario.'], ['Karate', 'Grading mock with recorded evidence.']],
      [['Azure', 'Catch up and complete due networking reviews.'], ['Karate', 'Instructor feedback and targeted correction.']]
    ]
  },
  {
    title: 'Monitoring, backup and readiness month',
    monthlyGoals: [
      ['Azure', 'Complete monitoring and backup topics and consolidate all weak areas.'],
      ['Azure', 'Complete at least one timed AZ-104 practice assessment and review errors.'],
      ['Karate', 'Demonstrate Jion at grading standard and retain older kata.'],
      ['Karate', 'Complete a full 3rd Dan mock and create the final correction list.']
    ],
    weeks: [
      [['Azure', 'Configure Azure Monitor, metrics, logs and alerts.'], ['Karate', 'Jion grading-standard performance.']],
      [['Azure', 'Practise Log Analytics and Network Watcher.'], ['Karate', 'Kihon full syllabus assessment.']],
      [['Azure', 'Configure or explain Azure Backup and Site Recovery.'], ['Karate', 'Kumite grading rounds and composure.']],
      [['Azure', 'Complete a practice assessment and review every incorrect answer.'], ['Karate', 'Full grading mock and final correction list.']],
      [['Azure', 'Retest weak areas and confirm exam-readiness evidence.'], ['Karate', 'Retention review and recovery.']]
    ]
  }
];

function defaultKataSections(sequenceProgress = 0) {
  return KATA_SECTION_NAMES.map((name, index) => ({ id: `section-${index + 1}`, name, level: index === 0 && Number(sequenceProgress) >= 100 ? 5 : 0 }));
}

function defaultRatings() {
  return Object.fromEntries(KARATE_RATING_FIELDS.map(([key]) => [key, 1]));
}

function defaultEvidence() {
  return { learned: false, recalled: false, practised: false, troubleshot: false, verified: false };
}

function defaultMasteryStages() {
  return Object.fromEntries(AZURE_STAGE_DEFS.map(([id]) => [id, {
    complete: false,
    partial: false,
    date: '',
    notes: '',
    evidence: '',
    confidence: 1,
    reviewDate: ''
  }]));
}

function defaultAzureUnits(pathId, moduleId, name) {
  if (pathId === 'az-prerequisites' && moduleId === 'az-prerequisites-m4') {
    return [
      { id: `${moduleId}-u1`, number: 1, name: 'Unit 1', complete: true },
      { id: `${moduleId}-u2`, number: 2, name: 'Unit 2', complete: true },
      { id: `${moduleId}-u3`, number: 3, name: 'Unit 3', complete: true },
      { id: `${moduleId}-u4`, number: 4, name: 'Unit 4', complete: true },
      { id: `${moduleId}-u5`, number: 5, name: 'Exercise — Add parameters and outputs to an ARM template', complete: false },
      { id: `${moduleId}-u6`, number: 6, name: 'Unit 6', complete: false },
      { id: `${moduleId}-u7`, number: 7, name: 'Unit 7', complete: false }
    ];
  }
  return [{ id: `${moduleId}-u1`, number: 1, name: `${name} module content`, complete: false }];
}

function defaultRoadmap(startDate = PROGRAMME_START_DATE) {
  const [year, month] = startDate.split('-').map(Number);
  return {
    startMonth: `${year}-${String(month).padStart(2, '0')}-01`,
    months: ROADMAP_BLUEPRINTS.map((blueprint, monthIndex) => {
      const date = new Date(year, month - 1 + monthIndex, 1, 12);
      const monthStart = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
      const monthName = new Intl.DateTimeFormat('en-NZ', { month: 'long', year: 'numeric' }).format(date);
      return {
        id: `month-${monthStart}`,
        monthStart,
        title: blueprint.title,
        goals: blueprint.monthlyGoals.map(([category, text], index) => ({ id: `month-${monthStart}-g${index + 1}`, category, text, complete: false, evidence: '' })),
        weeks: blueprint.weeks.map((goals, weekIndex) => ({
          id: `month-${monthStart}-w${weekIndex + 1}`,
          label: `Week ${weekIndex + 1}`,
          goals: goals.map(([category, text], goalIndex) => ({ id: `month-${monthStart}-w${weekIndex + 1}-g${goalIndex + 1}`, category, text, complete: false, evidence: '' }))
        })),
        label: monthName
      };
    })
  };
}
function defaultState() {
  const today = getNZDateKey();
  const state = {
    version: STATE_VERSION,
    profile: { name: 'André' },
    settings: {
      programmeMode: 'normal',
      programmeStartDate: PROGRAMME_START_DATE,
      timezone: 'Pacific/Auckland',
      weeklyDayTypes: { ...DEFAULT_WEEKLY_DAY_TYPES }
    },
    azureFocus: {
      certification: 'AZ-104: Microsoft Azure Administrator',
      currentPathId: 'az-prerequisites',
      currentModuleId: 'az-prerequisites-m4',
      preferredTool: 'PowerShell',
      weakArea: 'ARM template parameters, allowed values and outputs',
      nextAction: 'Complete unit 5 using PowerShell and capture deployment, failure, output and cleanup evidence.'
    },
    azPaths: DEFAULT_AZ_PATHS.map(path => ({
      ...path,
      status: path.id === 'az-prerequisites' ? 'in-progress' : 'not-started',
      confidence: 1,
      notes: '',
      modules: path.modules.map((name, index) => {
        const id = `${path.id}-m${index + 1}`;
        const module = {
          id,
          name,
          complete: false,
          masteryLevel: 0,
          masteryStages: defaultMasteryStages(),
          evidence: defaultEvidence(),
          units: defaultAzureUnits(path.id, id, name),
          currentUnit: 1,
          preferredTool: '',
          assessmentScores: [],
          weakAreas: '',
          lastStudied: '',
          lastReviewed: '',
          nextReview: '',
          reviewIntervalDays: 0,
          lastRecallResult: 'not-tested',
          recallHistory: [],
          customQuestions: []
        };
        if (id === 'az-prerequisites-m4') {
          module.currentUnit = 5;
          module.preferredTool = 'PowerShell';
          module.weakAreas = 'Parameters, allowed values, outputs and validating expected failures.';
          module.masteryStages.learn.partial = true;
          module.masteryStages.learn.notes = 'Units 1–4 of 7 completed. Unit 5 has not yet been started.';
          module.masteryStages.learn.confidence = 2;
          module.masteryStages.perform.partial = true;
          module.masteryStages.perform.notes = 'Initial ARM template deployment work completed; unit 5 evidence is still required.';
          module.masteryStages.perform.confidence = 2;
          module.evidence.practised = true;
          module.masteryLevel = 1;
        }
        return module;
      })
    })),
    syllabus: DEFAULT_SYLLABUS.map(item => ({
      ...item,
      status: 'not-started',
      confidence: 1,
      notes: '',
      mainCorrection: '',
      instructorFeedback: '',
      evidence: '',
      lastPractised: '',
      nextReview: '',
      rightComplete: false,
      leftComplete: false,
      practiceCount: 0,
      ratings: defaultRatings(),
      lastAssessmentResult: '',
      checkpoints: item.checkpoints.map((name, index) => ({ id: `${item.id}-c${index + 1}`, name, complete: item.id === 'tokui-kata' && index === 1 }))
    })),
    katas: structuredClone(DEFAULT_KATAS).map(kata => {
      const isJion = kata.id === 'jion';
      const sequenceKnown = kata.category === 'known' || isJion;
      return {
        ...kata,
        status: isJion ? 'sequence-known' : kata.status,
        sequenceProgress: sequenceKnown ? 100 : 0,
        sections: defaultKataSections(sequenceKnown ? 100 : 0),
        retentionIntervalDays: sequenceKnown ? 14 : 7,
        nextReview: kata.category === 'known' ? today : '',
        lastPerformanceResult: '',
        gradingReadiness: 0,
        mainCorrection: '',
        weakerSide: 'not-assessed',
        instructorFeedback: '',
        evidence: ''
      };
    }),
    azureLabs: [],
    daily: {},
    scheduleOverrides: {},
    roadmap: defaultRoadmap(PROGRAMME_START_DATE),
    notes: [],
    weeklyReviews: [],
    updatedAt: new Date().toISOString()
  };
  return state;
}

function migrateTaskChecks(record, dateKey) {
  record.checks = record.checks && typeof record.checks === 'object' ? record.checks : {};
  if (Object.keys(record.checks).length === 0) return;
  const ordered = Object.entries(record.checks).filter(([, value]) => Boolean(value));
  if (!record.legacyChecks) record.legacyChecks = Object.fromEntries(ordered);
}

function mergeMasteryStages(defaultStages, savedStages, legacyModule = {}) {
  const merged = {};
  for (const [stageId] of AZURE_STAGE_DEFS) {
    merged[stageId] = { ...defaultStages[stageId], ...(savedStages?.[stageId] || {}) };
  }
  if (!savedStages) {
    merged.learn.complete = Boolean(legacyModule.complete || legacyModule.evidence?.learned);
    merged.understand.complete = Boolean(legacyModule.evidence?.recalled);
    merged.perform.complete = Boolean(legacyModule.evidence?.practised);
    merged.test.complete = Boolean(legacyModule.evidence?.verified);
    merged.review.complete = Boolean(legacyModule.lastReviewed);
    merged.retain.complete = legacyModule.lastRecallResult === 'independent' && Number(legacyModule.reviewIntervalDays || 0) >= 14;
    if (legacyModule.nextReview) merged.review.reviewDate = legacyModule.nextReview;
  }
  return merged;
}

function mergeRoadmap(baseRoadmap, savedRoadmap) {
  if (!savedRoadmap?.months) return baseRoadmap;
  const savedMonths = new Map(savedRoadmap.months.map(month => [month.id, month]));
  return {
    ...baseRoadmap,
    ...savedRoadmap,
    months: baseRoadmap.months.map(month => {
      const savedMonth = savedMonths.get(month.id) || {};
      const savedGoals = new Map((savedMonth.goals || []).map(goal => [goal.id, goal]));
      const savedWeeks = new Map((savedMonth.weeks || []).map(week => [week.id, week]));
      return {
        ...month,
        ...savedMonth,
        goals: month.goals.map(goal => ({ ...goal, ...(savedGoals.get(goal.id) || {}) })),
        weeks: month.weeks.map(week => {
          const savedWeek = savedWeeks.get(week.id) || {};
          const savedWeekGoals = new Map((savedWeek.goals || []).map(goal => [goal.id, goal]));
          return {
            ...week,
            ...savedWeek,
            goals: week.goals.map(goal => ({ ...goal, ...(savedWeekGoals.get(goal.id) || {}) }))
          };
        })
      };
    })
  };
}

function mergeDefaults(saved) {
  const base = defaultState();
  if (!saved || typeof saved !== 'object') return base;
  const merged = {
    ...base,
    ...saved,
    profile: { ...base.profile, ...(saved.profile || {}) },
    settings: {
      ...base.settings,
      ...(saved.settings || {}),
      weeklyDayTypes: { ...DEFAULT_WEEKLY_DAY_TYPES, ...(saved.settings?.weeklyDayTypes || {}) }
    },
    azureFocus: { ...base.azureFocus, ...(saved.azureFocus || {}) }
  };

  merged.azPaths = mergeCollection(base.azPaths, saved.azPaths, path => {
    const savedPath = (saved.azPaths || []).find(entry => entry.id === path.id) || {};
    return {
      ...path,
      ...savedPath,
      modules: mergeCollection(path.modules, savedPath.modules || [], module => {
        const savedModule = (savedPath.modules || []).find(entry => entry.id === module.id) || {};
        const baseUnits = module.units || defaultAzureUnits(path.id, module.id, module.name);
        const savedUnits = new Map((savedModule.units || []).map(unit => [unit.id, unit]));
        const units = baseUnits.map(unit => ({ ...unit, ...(savedUnits.get(unit.id) || {}) }));
        const complete = units.length ? units.every(unit => unit.complete) : Boolean(savedModule.complete ?? module.complete);
        const stages = mergeMasteryStages(module.masteryStages, savedModule.masteryStages, savedModule);
        const completedStages = Object.values(stages).filter(stage => stage.complete).length;
        return {
          ...module,
          ...savedModule,
          units,
          complete,
          masteryStages: stages,
          masteryLevel: Math.max(Number(savedModule.masteryLevel || 0), Math.min(5, completedStages)),
          evidence: { ...defaultEvidence(), ...(module.evidence || {}), ...(savedModule.evidence || {}) },
          assessmentScores: Array.isArray(savedModule.assessmentScores) ? savedModule.assessmentScores : [],
          recallHistory: Array.isArray(savedModule.recallHistory) ? savedModule.recallHistory : [],
          customQuestions: Array.isArray(savedModule.customQuestions) ? savedModule.customQuestions : []
        };
      })
    };
  });

  merged.syllabus = mergeCollection(base.syllabus, saved.syllabus, item => {
    const savedItem = (saved.syllabus || []).find(entry => entry.id === item.id) || {};
    const ratings = { ...defaultRatings(), ...(savedItem.ratings || {}) };
    if (savedItem.rightComplete && !savedItem.ratings?.right) ratings.right = 5;
    if (savedItem.leftComplete && !savedItem.ratings?.left) ratings.left = 5;
    return {
      ...item,
      ...savedItem,
      group: item.group,
      ratings,
      mainCorrection: savedItem.mainCorrection || '',
      instructorFeedback: savedItem.instructorFeedback || '',
      evidence: savedItem.evidence || '',
      nextReview: savedItem.nextReview || '',
      checkpoints: mergeCollection(item.checkpoints, savedItem.checkpoints || [])
    };
  });

  merged.katas = mergeCollection(base.katas, saved.katas, item => {
    const savedKata = (saved.katas || []).find(entry => entry.id === item.id) || {};
    const oldSections = new Map((savedKata.sections || []).map(section => [section.id, section]));
    const sections = defaultKataSections(savedKata.sequenceProgress ?? item.sequenceProgress).map(section => ({
      ...section,
      ...(oldSections.get(section.id) || {}),
      name: section.name
    }));
    return {
      ...item,
      ...savedKata,
      sections,
      retentionIntervalDays: Number(savedKata.retentionIntervalDays || item.retentionIntervalDays || 7),
      nextReview: savedKata.nextReview ?? item.nextReview ?? '',
      lastPerformanceResult: savedKata.lastPerformanceResult || '',
      mainCorrection: savedKata.mainCorrection || '',
      weakerSide: savedKata.weakerSide || 'not-assessed',
      instructorFeedback: savedKata.instructorFeedback || '',
      evidence: savedKata.evidence || '',
      gradingReadiness: Number(savedKata.gradingReadiness || 0)
    };
  });

  merged.azureLabs = Array.isArray(saved.azureLabs) ? saved.azureLabs : [];
  const savedDaily = saved.daily && typeof saved.daily === 'object' && !Array.isArray(saved.daily) ? saved.daily : {};
  merged.daily = Object.fromEntries(Object.entries(savedDaily).map(([key, rawRecord]) => {
    const record = rawRecord && typeof rawRecord === 'object' ? rawRecord : {};
    const dayType = DAY_TYPE_OPTIONS.some(([value]) => value === record.dayType)
      ? record.dayType
      : (base.settings.weeklyDayTypes[getDayName(key)] || 'rest');
    const mergedRecord = {
      checks: {},
      notes: '',
      evidence: '',
      energy: 3,
      confidence: 3,
      result: 'not-set',
      status: record.result === 'completed' ? 'completed' : 'not-started',
      priority: 'high',
      dayType,
      startedAt: '',
      completedAt: '',
      task: null,
      ...record,
      dayType
    };
    migrateTaskChecks(mergedRecord, key);
    return [key, mergedRecord];
  }));
  merged.scheduleOverrides = saved.scheduleOverrides && typeof saved.scheduleOverrides === 'object' ? saved.scheduleOverrides : {};
  merged.roadmap = mergeRoadmap(base.roadmap, saved.roadmap);
  merged.notes = Array.isArray(saved.notes) ? saved.notes : [];
  merged.weeklyReviews = Array.isArray(saved.weeklyReviews) ? saved.weeklyReviews : [];
  if (!['normal', 'minimum'].includes(merged.settings.programmeMode)) merged.settings.programmeMode = 'normal';

  if (Number(saved.version || 1) < 5) {
    const arm = merged.azPaths.find(path => path.id === 'az-prerequisites')?.modules.find(module => module.id === 'az-prerequisites-m4');
    if (arm && !saved.azureFocus) {
      arm.units = defaultAzureUnits('az-prerequisites', 'az-prerequisites-m4', arm.name).map(unit => ({
        ...unit,
        ...(arm.units || []).find(existing => existing.id === unit.id)
      }));
      arm.currentUnit = Math.max(5, Number(arm.currentUnit || 5));
      arm.masteryStages.learn.partial = !arm.masteryStages.learn.complete;
      arm.masteryStages.perform.partial = !arm.masteryStages.perform.complete;
    }
    const jion = merged.katas.find(kata => kata.id === 'jion');
    if (jion && !saved.katas?.find(kata => kata.id === 'jion')?.mainCorrection) {
      jion.status = 'sequence-known';
      jion.sequenceProgress = 100;
      jion.sections[0].level = 5;
    }
  }

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

function dayTypeLabel(value) {
  return DAY_TYPE_OPTIONS.find(([id]) => id === value)?.[1] || value;
}

function dayTypeOptions(current) {
  return DAY_TYPE_OPTIONS.map(([value, label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('');
}

function taskStatusLabel(value) {
  return TASK_STATUS_OPTIONS.find(([id]) => id === value)?.[1] || value;
}

function getDayTypeForDate(key = getNZDateKey()) {
  const stored = state.daily[key]?.dayType;
  if (DAY_TYPE_OPTIONS.some(([value]) => value === stored)) return stored;
  const override = state.scheduleOverrides?.[key];
  if (DAY_TYPE_OPTIONS.some(([value]) => value === override)) return override;
  return state.settings.weeklyDayTypes?.[getDayName(key)] || DEFAULT_WEEKLY_DAY_TYPES[getDayName(key)] || 'rest';
}

function dayTypeCategory(dayType) {
  if (dayType.startsWith('azure')) return 'azure';
  if (dayType.startsWith('karate')) return 'karate';
  return 'rest';
}

function currentAZPath() {
  return state.azPaths.find(path => path.id === state.azureFocus?.currentPathId)
    || state.azPaths.find(path => !['complete', 'confident'].includes(path.status))
    || state.azPaths.at(-1);
}

function getAllAzureModules() {
  return state.azPaths.flatMap(path => path.modules.map(module => ({ path, module })));
}

function findAZModule(pathId, moduleId) {
  return findAZ(pathId)?.modules.find(module => module.id === moduleId);
}

function currentAzureModule() {
  const path = currentAZPath();
  return path?.modules.find(module => module.id === state.azureFocus?.currentModuleId)
    || path?.modules.find(module => !module.complete)
    || path?.modules.at(-1);
}

function currentAzureUnit(module = currentAzureModule()) {
  if (!module) return null;
  return module.units?.find(unit => Number(unit.number) === Number(module.currentUnit))
    || module.units?.find(unit => !unit.complete)
    || module.units?.at(-1)
    || null;
}

function currentKata() {
  return state.katas.find(kata => kata.id === 'jion')
    || state.katas.find(kata => kata.status !== 'grading-ready' && kata.status !== 'not-started')
    || state.katas.find(kata => kata.status === 'not-started')
    || state.katas[0];
}

function moduleContentPercent(module) {
  const units = Array.isArray(module?.units) ? module.units : [];
  return percent(units.filter(unit => unit.complete).length, units.length);
}

function moduleMasteryPercent(module) {
  const stages = module?.masteryStages || {};
  return percent(AZURE_STAGE_DEFS.filter(([id]) => stages[id]?.complete).length, AZURE_STAGE_DEFS.length);
}

function pathContentPercent(path) {
  const units = path.modules.flatMap(module => module.units || []);
  return percent(units.filter(unit => unit.complete).length, units.length);
}

function pathMasteryPercent(path) {
  const stages = path.modules.flatMap(module => AZURE_STAGE_DEFS.map(([id]) => module.masteryStages?.[id]));
  return percent(stages.filter(stage => stage?.complete).length, stages.length);
}

function getCurrentMasteryStage(module) {
  const partial = AZURE_STAGE_DEFS.find(([id]) => module?.masteryStages?.[id]?.partial && !module.masteryStages[id].complete);
  if (partial) return partial;
  return AZURE_STAGE_DEFS.find(([id]) => !module?.masteryStages?.[id]?.complete) || AZURE_STAGE_DEFS.at(-1);
}

function getDailyRecord(key = getNZDateKey(), { create = true } = {}) {
  if (state.daily[key]) {
    const record = state.daily[key];
    record.dayType = getDayTypeForDate(key);
    if (create && !record.task) record.task = buildDailyTask(key, record.dayType);
    return record;
  }
  const dayType = getDayTypeForDate(key);
  const record = {
    checks: {},
    notes: '',
    evidence: '',
    energy: 3,
    confidence: 3,
    result: 'not-set',
    status: 'not-started',
    priority: 'high',
    dayType,
    startedAt: '',
    completedAt: '',
    rescheduledFrom: '',
    rescheduledTo: '',
    task: create ? buildDailyTask(key, dayType) : null
  };
  if (create) state.daily[key] = record;
  return record;
}

function getPlanModeForDate() {
  return 'alternating';
}

function getTaskForDate(key, { create = false } = {}) {
  const record = state.daily[key];
  if (record?.task) return record.task;
  if (create) return getDailyRecord(key).task;
  return buildDailyTask(key, getDayTypeForDate(key));
}

function getPlanForDate(key) {
  const task = getTaskForDate(key);
  return { family: task.reason, tasks: [task] };
}

function taskSubKey(taskId, index) {
  return `${taskId}::${index}`;
}

function buildDailyTask(key, dayType = getDayTypeForDate(key)) {
  const dateToken = key.replaceAll('-', '');
  const azure = getAzurePriority(key);
  const kata = getKataPriority(key);
  const grading = getDanPriority(key);
  const azureModule = azure?.module || currentAzureModule();
  const unit = azureModule ? currentAzureUnit(azureModule) : null;
  const currentStage = azureModule ? getCurrentMasteryStage(azureModule) : AZURE_STAGE_DEFS[0];

  if (dayType === 'azure') {
    const isArmUnitFive = azureModule?.id === 'az-prerequisites-m4' && Number(unit?.number) === 5;
    return {
      id: `task-${dateToken}-azure`,
      category: 'azure',
      dayType,
      title: isArmUnitFive ? 'Complete ARM-template Unit 5 using PowerShell' : (azure ? `${azure.title} — ${unit?.name || currentStage[1]}` : 'AZ-104 focused study'),
      reason: isArmUnitFive
        ? 'This is the next incomplete unit in your current AZ-104 module and is required before the module can be completed.'
        : (azure?.reason || 'This is the highest-priority incomplete Azure topic.'),
      duration: isArmUnitFive ? '60–90 minutes' : '45–60 minutes',
      priority: 'high',
      section: 'AZ-104',
      learningPath: azure?.path?.name || currentAZPath()?.name || '',
      module: azureModule?.name || '',
      unit: unit?.name || '',
      masteryStage: currentStage?.[1] || 'Learn',
      refs: { pathId: azure?.path?.id || currentAZPath()?.id || '', moduleId: azureModule?.id || '', unitId: unit?.id || '' },
      checklist: isArmUnitFive ? [
        'Open the module and Unit 5 exercise',
        'Complete the PowerShell-based ARM template work',
        'Deploy successfully using an allowed value',
        'Confirm the expected failure using an invalid value',
        'Capture the storage endpoint output',
        'Validate the final result',
        'Clean up all resources created by the exercise',
        'Add evidence and record anything not understood'
      ] : [
        'Open the current module or lab',
        'Complete the required learning or practical work',
        'Validate the result',
        'Add evidence',
        'Record anything not understood',
        'Clean up resources if required',
        'Mark the task complete'
      ]
    };
  }

  if (dayType === 'azure-review') {
    return {
      id: `task-${dateToken}-azure-review`,
      category: 'azure',
      dayType,
      title: `Review ${azure?.title || currentAzureModule()?.name || 'the current AZ-104 topic'}`,
      reason: azure?.reason || 'A later recall or practical check is needed before the topic can be retained.',
      duration: '30–45 minutes',
      priority: azure?.overdueDays ? 'high' : 'medium',
      section: 'AZ-104 review',
      learningPath: azure?.path?.name || currentAZPath()?.name || '',
      module: azure?.module?.name || currentAzureModule()?.name || '',
      unit: '',
      masteryStage: 'Review / Retain',
      refs: { pathId: azure?.path?.id || '', moduleId: azure?.module?.id || '', unitId: '' },
      checklist: [
        'Answer the recall questions without notes',
        'Repeat one portal, PowerShell, CLI, ARM or Bicep step',
        'Correct every mistake found',
        'Add evidence or an assessment score',
        'Set the confidence rating',
        'Schedule the next review',
        'Mark the review complete'
      ]
    };
  }

  if (dayType === 'karate') {
    const jion = currentKata();
    return {
      id: `task-${dateToken}-karate`,
      category: 'karate',
      dayType,
      title: jion?.id === 'jion' ? 'Dedicated Jion technical training session' : `Dedicated ${jion?.name || 'kata'} training session`,
      reason: `${jion?.name || 'The current kata'} sequence is known, but grading readiness has not yet been demonstrated. ${grading ? `The current grading weakness is ${grading.title}.` : ''}`,
      duration: '45–60 minutes',
      priority: 'high',
      section: 'Kata',
      kata: jion?.name || 'Jion',
      gradingFocus: grading?.title || '',
      refs: { kataId: jion?.id || 'jion', syllabusId: grading?.item?.id || grading?.itemId || '' },
      checklist: [
        'Warm up',
        'Complete one slow technical performance',
        'Complete one normal performance',
        'Complete one grading-speed performance',
        'Review stances and transitions',
        'Practise the weaker side or grading weakness',
        'Record instructor feedback or video evidence if available',
        'Identify one main correction and mark the task complete'
      ]
    };
  }

  if (dayType === 'karate-review') {
    return {
      id: `task-${dateToken}-karate-review`,
      category: 'karate',
      dayType,
      title: `Retention review — ${kata?.title || currentKata()?.name || 'Jion'}`,
      reason: kata?.reason || 'A retention check is due before the kata or grading section can be considered reliable.',
      duration: '30–45 minutes',
      priority: kata?.overdueDays ? 'high' : 'medium',
      section: 'Kata retention / grading review',
      kata: kata?.kata?.name || currentKata()?.name || 'Jion',
      gradingFocus: grading?.title || '',
      refs: { kataId: kata?.kata?.id || currentKata()?.id || '', syllabusId: grading?.item?.id || grading?.itemId || '' },
      checklist: [
        'Warm up',
        'Perform the kata or grading skill without assistance',
        'Check the weaker side',
        'Assess the main correction',
        'Record mistakes or a clean performance',
        'Add instructor feedback or evidence',
        'Schedule the next retention review',
        'Mark the review complete'
      ]
    };
  }

  return {
    id: `task-${dateToken}-rest`,
    category: 'rest',
    dayType: 'rest',
    title: 'Rest and recovery',
    reason: 'Recovery protects consistency and prevents Azure study and karate training from becoming unsustainable.',
    duration: 'Flexible',
    priority: 'low',
    section: 'Recovery',
    refs: {},
    checklist: ['Protect the recovery day', 'Prepare anything needed for the next scheduled task']
  };
}

function dayCompletion(key) {
  const startDate = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  if (key < startDate) return 0;
  const record = state.daily[key];
  if (!record) return 0;
  if (record.status === 'completed') return 100;
  const task = record.task || getTaskForDate(key);
  const total = task?.checklist?.length || 0;
  if (!total) return 0;
  const done = task.checklist.filter((_, index) => record.checks?.[taskSubKey(task.id, index)]).length;
  return Math.round(done / total * 100);
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
  module.masteryStages = mergeMasteryStages(defaultMasteryStages(), module.masteryStages, module);
  module.masteryStages.review.complete = true;
  module.masteryStages.review.date = today;
  module.masteryStages.review.reviewDate = module.nextReview;
  module.masteryStages.review.confidence = result === 'independent' ? 5 : result === 'assisted' ? 4 : result === 'partial' ? 2 : 1;
  if (result === 'independent') {
    module.masteryStages.understand.complete = true;
    module.masteryStages.understand.date ||= today;
    if (module.masteryStages.test.complete && module.masteryStages.perform.complete) {
      module.masteryStages.retain.complete = true;
      module.masteryStages.retain.date = today;
      module.masteryStages.retain.reviewDate = module.nextReview;
      module.masteryStages.retain.confidence = 5;
    }
  }
  module.recallHistory = Array.isArray(module.recallHistory) ? module.recallHistory : [];
  module.recallHistory.push({ date: today, result, intervalDays: interval });
  module.masteryLevel = Math.min(5, AZURE_STAGE_DEFS.filter(([id]) => module.masteryStages[id]?.complete).length);
  return true;
}

function updateKataProgressFromSections(kata) {
  const sections = Array.isArray(kata.sections) ? kata.sections : [];
  kata.sequenceProgress = Number(sections[0]?.level || 0) >= 5 ? 100 : Math.round(Number(sections[0]?.level || 0) / 5 * 100);
  kata.gradingReadiness = sections.length ? Math.round(average(sections.map(section => Number(section.level || 0))) / 5 * 100) : 0;
  if (kata.sequenceProgress > 0 && kata.status === 'not-started') kata.status = 'learning';
  if (kata.sequenceProgress >= 100 && ['not-started', 'learning'].includes(kata.status)) kata.status = 'sequence-known';
  if (kata.gradingReadiness >= 100) kata.status = 'grading-ready';
}

function getNextKataInterval(currentDays = 0) {
  const sequence = [3, 7, 14, 30, 60, 90];
  return sequence.find(days => days > Number(currentDays || 0)) || 90;
}

function getAzurePriority(referenceDate = getNZDateKey()) {
  const focusPath = currentAZPath();
  const focusModule = currentAzureModule();
  const candidates = getAllAzureModules().map(({ path, module }) => {
    const content = moduleContentPercent(module);
    const mastery = moduleMasteryPercent(module);
    const overdueDays = module.nextReview && module.nextReview <= referenceDate ? Math.max(0, daysBetween(referenceDate, module.nextReview)) : 0;
    let score = (100 - mastery) * .45 + (100 - content) * .25;
    if (path.id === focusPath?.id) score += 20;
    if (module.id === focusModule?.id) score += 60;
    if (module.nextReview && module.nextReview <= referenceDate) score += 35 + Math.min(30, overdueDays * 3);
    if (module.lastRecallResult === 'incorrect') score += 25;
    if (module.lastRecallResult === 'partial') score += 15;
    return { path, module, score, overdueDays, content, mastery };
  }).sort((a, b) => b.score - a.score);
  const priority = candidates[0];
  if (!priority) return null;
  const unit = currentAzureUnit(priority.module);
  const stage = getCurrentMasteryStage(priority.module);
  const reasons = [];
  if (priority.module.id === state.azureFocus?.currentModuleId) reasons.push('current AZ-104 module');
  if (priority.content < 100) reasons.push(`${priority.content}% content complete`);
  if (priority.mastery < 100) reasons.push(`${priority.mastery}% mastery`);
  if (priority.module.nextReview && priority.module.nextReview <= referenceDate) reasons.push(priority.overdueDays ? `${priority.overdueDays} days overdue` : 'review due today');
  return {
    kind: 'Azure',
    title: priority.module.name,
    subtitle: priority.path.name.replace('AZ-104: ', ''),
    reason: reasons.slice(0, 3).join(' · '),
    tasks: [
      unit ? `Continue ${unit.name}` : `Continue ${priority.module.name}`,
      `Demonstrate the ${stage?.[1] || 'Learn'} stage`,
      'Add evidence and record weak areas',
      'Schedule the next review'
    ],
    path: priority.path,
    module: priority.module,
    unit,
    stage,
    pathId: priority.path.id,
    moduleId: priority.module.id,
    overdueDays: priority.overdueDays
  };
}

function getDanPriority(referenceDate = getNZDateKey()) {
  const candidates = state.syllabus.map(item => {
    const ratings = KARATE_RATING_FIELDS.map(([key]) => Number(item.ratings?.[key] || 1));
    const ratingAverage = average(ratings);
    const daysSince = item.lastPractised ? Math.max(0, daysBetween(referenceDate, item.lastPractised)) : 30;
    const incompleteChecks = item.checkpoints.filter(check => !check.complete).length;
    const incompleteRatio = item.checkpoints.length ? incompleteChecks / item.checkpoints.length : 0;
    let score = (5 - ratingAverage) * 20 + Math.min(30, daysSince) + incompleteRatio * 20;
    if (item.id === 'tokui-kata') score += 12;
    return { item, ratingAverage, score };
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
    reason: `${weakest.map(field => `${field.label} ${field.value}/5`).join(' · ')}${priority.item.lastPractised ? ` · last practised ${formatDateKey(priority.item.lastPractised, { day:'numeric', month:'short' })}` : ' · not yet assessed'}`,
    tasks: [
      'Perform slow repetitions on both sides',
      `Concentrate on ${weakest.map(field => field.label.toLowerCase()).join(' and ')}`,
      'Complete repetitions at grading speed',
      'Record the main correction and instructor feedback'
    ],
    item: priority.item,
    itemId: priority.item.id
  };
}

function getKataPriority(referenceDate = getNZDateKey()) {
  const jion = currentKata();
  const candidates = state.katas.map(kata => {
    const readiness = Number(kata.gradingReadiness || 0);
    const overdueDays = kata.nextReview && kata.nextReview <= referenceDate ? Math.max(0, daysBetween(referenceDate, kata.nextReview)) : 0;
    let score = (100 - readiness) * .55 + (5 - Number(kata.confidence || 1)) * 6;
    if (kata.nextReview && kata.nextReview <= referenceDate) score += 30 + Math.min(30, overdueDays * 3);
    if (kata.id === jion?.id) score += 60;
    return { kata, score, overdueDays, readiness };
  }).sort((a, b) => b.score - a.score);
  const priority = candidates[0];
  if (!priority) return null;
  const weakSections = [...(priority.kata.sections || [])]
    .filter((_, index) => index > 0)
    .sort((a, b) => Number(a.level || 0) - Number(b.level || 0))
    .slice(0, 2);
  const reasons = [];
  if (priority.kata.id === 'jion') reasons.push('current tokui kata focus');
  reasons.push(`${priority.readiness}% grading readiness`);
  if (priority.kata.nextReview && priority.kata.nextReview <= referenceDate) reasons.push(priority.overdueDays ? `${priority.overdueDays} days overdue` : 'retention review due');
  if (weakSections.length) reasons.push(`${weakSections.map(section => section.name).join(' and ')} need assessment`);
  return {
    kind: 'Kata',
    title: priority.kata.name,
    subtitle: priority.kata.sequenceProgress >= 100 ? 'Sequence known · grading quality not yet confirmed' : 'Sequence learning',
    reason: reasons.slice(0, 3).join(' · '),
    tasks: [
      'Complete slow, normal and grading-speed performances',
      'Assess stances and transitions',
      'Identify one main correction',
      'Record evidence or instructor feedback'
    ],
    kata: priority.kata,
    kataId: priority.kata.id,
    overdueDays: priority.overdueDays
  };
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
  return options.map(([value, label]) => `<option value="${value}" ${value === current ? 'selected' : ''}>${escapeHTML(label)}</option>`).join('');
}

function ratingOptions(current) {
  return [1, 2, 3, 4, 5].map(value => `<option value="${value}" ${Number(current) === value ? 'selected' : ''}>${value}/5</option>`).join('');
}

function kataSectionOptions(current) {
  return KATA_SECTION_LEVELS.map(([value, label]) => `<option value="${value}" ${Number(current) === value ? 'selected' : ''}>${value} — ${escapeHTML(label)}</option>`).join('');
}

function getModuleRecallQuestions(module) {
  return [
    `Explain ${module.name} in your own words without using notes.`,
    `Describe one Azure configuration or administrative task involving ${module.name}.`,
    `Name one likely failure involving ${module.name} and explain how you would verify it.`,
    `What is the closest alternative or related Azure feature, and when would you use each?`,
    ...(Array.isArray(module.customQuestions) ? module.customQuestions : [])
  ];
}

function getAzureFocusSummary() {
  const path = currentAZPath();
  const module = currentAzureModule();
  const unit = currentAzureUnit(module);
  const stage = getCurrentMasteryStage(module);
  return {
    certification: state.azureFocus?.certification || 'AZ-104: Microsoft Azure Administrator',
    path: path?.name || '',
    module: module?.name || '',
    unit: unit ? `Unit ${unit.number} — ${unit.name}` : 'No current unit',
    stage: stage?.[1] || 'Learn',
    weakArea: module?.weakAreas || state.azureFocus?.weakArea || 'Not entered',
    nextAction: state.azureFocus?.nextAction || 'Continue the current unit.'
  };
}

function renderFocusSummary(referenceDate = getNZDateKey()) {
  const azure = getAzureFocusSummary();
  const kataPriority = getKataPriority(referenceDate);
  const kata = kataPriority?.kata || currentKata();
  const grading = getDanPriority(referenceDate);
  const last = kata?.lastPractised ? formatDateKey(kata.lastPractised, { day:'numeric', month:'short', year:'numeric' }) : 'Not practised';
  const retention = kata?.nextReview ? reviewDueText(kata.nextReview) : 'Not scheduled';
  const weakSide = kata?.weakerSide === 'right' ? 'Right' : kata?.weakerSide === 'left' ? 'Left' : kata?.weakerSide === 'equal' ? 'Equal' : 'Not assessed';
  return `<div class="focus-cards grid three">
    <article class="card focus-detail azure-outline">
      <span class="focus-kicker azure-text">Azure focus</span>
      <h3>${escapeHTML(azure.module)}</h3>
      <dl>
        <div><dt>Certification</dt><dd>${escapeHTML(azure.certification)}</dd></div>
        <div><dt>Learning path</dt><dd>${escapeHTML(azure.path.replace('AZ-104: ', ''))}</dd></div>
        <div><dt>Current unit</dt><dd>${escapeHTML(azure.unit)}</dd></div>
        <div><dt>Mastery stage</dt><dd>${escapeHTML(azure.stage)}</dd></div>
        <div><dt>Weak area</dt><dd>${escapeHTML(azure.weakArea)}</dd></div>
        <div><dt>Next action</dt><dd>${escapeHTML(azure.nextAction)}</dd></div>
      </dl>
    </article>
    <article class="card focus-detail karate-outline">
      <span class="focus-kicker">Kata focus</span>
      <h3>${escapeHTML(kata?.name || 'Jion')}</h3>
      <dl>
        <div><dt>Sequence status</dt><dd>${kata?.sequenceProgress >= 100 ? 'Known' : 'Learning'}</dd></div>
        <div><dt>Grading readiness</dt><dd>${Number(kata?.gradingReadiness || 0)}%</dd></div>
        <div><dt>Main correction</dt><dd>${escapeHTML(kata?.mainCorrection || 'Not yet entered')}</dd></div>
        <div><dt>Weaker side</dt><dd>${weakSide}</dd></div>
        <div><dt>Last practised</dt><dd>${escapeHTML(last)}</dd></div>
        <div><dt>Retention</dt><dd>${escapeHTML(retention)}</dd></div>
      </dl>
    </article>
    <article class="card focus-detail grading-outline">
      <span class="focus-kicker grading-text">Grading-section focus</span>
      <h3>${escapeHTML(grading?.subtitle || 'Kihon')}</h3>
      <dl>
        <div><dt>Specific focus</dt><dd>${escapeHTML(grading?.title || 'Not assessed')}</dd></div>
        <div><dt>Main weakness</dt><dd>${escapeHTML(grading?.reason || 'Not assessed')}</dd></div>
        <div><dt>Next training task</dt><dd>${escapeHTML(grading?.tasks?.[0] || 'Complete a baseline assessment')}</dd></div>
      </dl>
    </article>
  </div>`;
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
  document.querySelectorAll('.view').forEach(element => element.classList.toggle('active', element.id === `view-${view}`));
  document.querySelectorAll('[data-view]').forEach(element => element.classList.toggle('active', element.dataset.view === view));
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
  const startDate = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const dayType = getDayTypeForDate(key);
  const savedRecord = state.daily[key];
  const record = savedRecord || {
    checks: {}, notes: '', evidence: '', energy: 3, confidence: 3, result: 'not-set', status: 'not-started', priority: 'high', dayType
  };
  const task = savedRecord?.task || buildDailyTask(key, dayType);
  const completion = dayCompletion(key);
  const status = record.status || 'not-started';

  document.getElementById('page-eyebrow').textContent = isToday ? 'TODAY’S FOCUS' : 'DAILY PLAN';
  document.getElementById('page-title').textContent = isToday ? 'Today' : formatDateKey(key, { weekday:'long', day:'numeric', month:'short' });

  const dateNavigation = `<div class="date-navigation" aria-label="Daily plan navigation">
    <button class="secondary-btn" data-action="previous-day">← Previous</button>
    <button class="ghost-btn" data-action="go-today" ${isToday ? 'disabled' : ''}>Today</button>
    <button class="secondary-btn" data-action="next-day">Next →</button>
  </div>`;

  if (key < startDate) {
    document.getElementById('view-today').innerHTML = `${dateNavigation}<article class="card main-task-card rest-task"><span class="task-category">Programme not started</span><h2>${escapeHTML(formatDateKey(key))}</h2><p>The alternating programme begins on ${escapeHTML(formatDateKey(startDate))}.</p></article>${renderFocusSummary(startDate)}`;
    return;
  }

  const taskClass = task.category === 'azure' ? 'azure-outline' : task.category === 'karate' ? 'karate-outline' : 'rest-task';
  const statusClass = status === 'completed' ? 'green' : status === 'in-progress' ? 'amber' : status === 'missed' ? 'red' : 'blue';
  document.getElementById('view-today').innerHTML = `
    ${dateNavigation}
    <article class="card main-task-card ${taskClass}">
      <div class="main-task-header">
        <div>
          <p class="eyebrow">TODAY’S MAIN TASK</p>
          <span class="task-category">${escapeHTML(dayTypeLabel(dayType))}</span>
          <h2>${escapeHTML(task.title)}</h2>
        </div>
        <div class="task-badges"><span class="badge ${statusClass}">${escapeHTML(taskStatusLabel(status))}</span><span class="badge">${escapeHTML(task.priority || record.priority || 'Medium')} priority</span></div>
      </div>
      <div class="task-facts">
        <div><span>Why this matters</span><strong>${escapeHTML(task.reason)}</strong></div>
        <div><span>Estimated duration</span><strong>${escapeHTML(task.duration)}</strong></div>
        <div><span>Current section</span><strong>${escapeHTML(task.section || dayTypeLabel(dayType))}</strong></div>
      </div>
      ${task.category === 'azure' ? `<div class="task-context"><span>${escapeHTML(task.learningPath || '')}</span><strong>${escapeHTML(task.module || '')}</strong><span>${escapeHTML(task.unit || '')}</span><span>Mastery: ${escapeHTML(task.masteryStage || '')}</span></div>` : ''}
      ${task.category === 'karate' ? `<div class="task-context"><span>Current kata: ${escapeHTML(task.kata || 'Jion')}</span><strong>${escapeHTML(task.gradingFocus || 'Jion technical assessment')}</strong></div>` : ''}
      <div class="progress-line"><span style="width:${completion}%"></span></div>
      <div class="task-action-row">
        <button class="primary-btn" data-action="start-task" ${['completed','missed','rescheduled'].includes(status) ? 'disabled' : ''}>Start task</button>
        <button class="secondary-btn" data-action="mark-next-step" ${['completed','missed','rescheduled'].includes(status) ? 'disabled' : ''}>Mark step complete</button>
        <button class="secondary-btn" data-action="add-task-evidence">Add evidence</button>
        <button class="primary-btn" data-action="complete-task" ${status === 'completed' ? 'disabled' : ''}>Complete task</button>
        <button class="ghost-btn" data-action="reschedule-task" ${status === 'completed' ? 'disabled' : ''}>Reschedule</button>
        <button class="ghost-btn danger-text" data-action="miss-task" ${['completed','missed'].includes(status) ? 'disabled' : ''}>Mark as missed</button>
      </div>
    </article>

    <div class="section-heading"><div><h2>Current focus summary</h2><p>These cards show progress only and do not create extra tasks today.</p></div></div>
    ${renderFocusSummary(key)}

    <div class="section-heading"><div><h2>Daily task checklist</h2><p>Tick individual evidence steps. Partial progress does not complete the full topic.</p></div><strong>${completion}%</strong></div>
    <article class="card ${taskClass}">
      <div class="checklist">
        ${task.checklist.map((item, index) => {
          const checkKey = taskSubKey(task.id, index);
          const checked = Boolean(record.checks?.[checkKey]);
          return `<div class="check-row ${checked ? 'checked' : ''}"><input id="check-${task.id}-${index}" type="checkbox" data-daily-check="${escapeHTML(checkKey)}" data-date="${key}" ${checked ? 'checked' : ''}><label for="check-${task.id}-${index}">${escapeHTML(item)}</label></div>`;
        }).join('')}
      </div>
      <div class="form-grid daily-evidence-grid">
        <label>Evidence, command output, screenshot reference or score
          <textarea id="daily-evidence-${key}" data-daily-field="evidence" data-date="${key}" placeholder="Record evidence before claiming full completion...">${escapeHTML(record.evidence || '')}</textarea>
        </label>
        <label>Notes and anything not understood
          <textarea data-daily-field="notes" data-date="${key}" placeholder="Record questions, corrections or unfinished work...">${escapeHTML(record.notes || '')}</textarea>
        </label>
        <label>Confidence
          <select data-daily-field="confidence" data-date="${key}">${ratingOptions(record.confidence || 3)}</select>
        </label>
        <label>Energy and recovery
          <select data-daily-field="energy" data-date="${key}">${ratingOptions(record.energy || 3)}</select>
        </label>
      </div>
    </article>`;
}

function renderWeek() {
  const start = getWeekStart(selectedDateKey);
  const today = getNZDateKey();
  const days = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const weekGoal = findRoadmapWeekForDate(start);
  document.getElementById('view-week').innerHTML = `
    <div class="date-navigation">
      <button class="secondary-btn" data-action="previous-week">← Previous week</button>
      <button class="ghost-btn" data-action="current-week" ${start === getWeekStart(today) ? 'disabled' : ''}>Current week</button>
      <button class="secondary-btn" data-action="next-week">Next week →</button>
    </div>
    <div class="hero">
      <p class="eyebrow">EDITABLE ALTERNATING WEEK · ${escapeHTML(formatDateKey(start, { day:'numeric', month:'long', year:'numeric' }).toUpperCase())}</p>
      <h2>Alternating Azure and karate plan</h2>
      <p>Only one main task is allowed per day. Changing the day type replaces the generated task for that day; it never adds a second task.</p>
      ${weekGoal ? `<div class="hero-meta"><span class="badge blue">Roadmap: ${escapeHTML(weekGoal.month.label)} · ${escapeHTML(weekGoal.week.label)}</span><span class="badge green">${weekGoal.progress}% goals complete</span></div>` : ''}
    </div>
    <div class="week-grid editable-week-grid">
      ${days.map(key => {
        const dayType = getDayTypeForDate(key);
        const task = getTaskForDate(key);
        const record = state.daily[key];
        const status = record?.status || 'not-started';
        const completion = dayCompletion(key);
        return `<article class="card day-card ${key === today ? 'today' : ''} ${task.category}-outline">
          <h3>${escapeHTML(getDayName(key))}<span class="day-date">${escapeHTML(formatDateKey(key, { day:'numeric', month:'short' }))}</span></h3>
          <label class="compact-label">Focus type<select data-day-type-date="${key}">${dayTypeOptions(dayType)}</select></label>
          <div class="module-badges"><span class="badge ${status === 'completed' ? 'green' : status === 'missed' ? 'red' : 'blue'}">${escapeHTML(taskStatusLabel(status))}</span><span class="badge">${completion}%</span></div>
          <div class="day-block"><strong>${escapeHTML(task.title)}</strong><p>${escapeHTML(task.duration)} · ${escapeHTML(task.reason)}</p></div>
          <div class="form-actions"><button class="ghost-btn" data-action="open-day" data-date="${key}">Open day</button></div>
        </article>`;
      }).join('')}
    </div>`;
}

function renderAzure() {
  const modules = getAllAzureModules();
  const unitTotals = modules.flatMap(({ module }) => module.units || []);
  const contentPercent = percent(unitTotals.filter(unit => unit.complete).length, unitTotals.length);
  const stageTotals = modules.flatMap(({ module }) => AZURE_STAGE_DEFS.map(([id]) => module.masteryStages?.[id]));
  const masteryPercent = percent(stageTotals.filter(stage => stage?.complete).length, stageTotals.length);
  const dueReviews = modules.filter(({ module }) => module.nextReview && module.nextReview <= getNZDateKey()).length;
  const focus = getAzureFocusSummary();
  const moduleChoices = modules.map(({ path, module }) => `<option value="${path.id}::${module.id}">${escapeHTML(path.name.replace('AZ-104: ', ''))} — ${escapeHTML(module.name)}</option>`).join('');
  document.getElementById('view-azure').innerHTML = `
    <div class="hero azure-hero">
      <p class="eyebrow">CONTENT AND MASTERY ARE SEPARATE</p>
      <h2>AZ-104 learning-path tracker</h2>
      <p>Reading a module records content progress. A topic is mastered only after Learn, Understand, Perform, Test, Review and Retain are all demonstrated.</p>
      <div class="hero-meta"><span class="badge blue">Content completion: ${contentPercent}%</span><span class="badge green">Mastery: ${masteryPercent}%</span><span class="badge ${dueReviews ? 'amber' : 'green'}">${dueReviews} reviews due</span><span class="badge blue">${state.azureLabs.length} labs</span></div>
    </div>
    <article class="card current-focus-panel azure-outline">
      <span class="focus-kicker azure-text">Current Azure position</span>
      <h2>${escapeHTML(focus.module)}</h2>
      <div class="grid two compact-info-grid">
        <div><span>Certification</span><strong>${escapeHTML(focus.certification)}</strong></div>
        <div><span>Learning path</span><strong>${escapeHTML(focus.path)}</strong></div>
        <div><span>Current unit</span><strong>${escapeHTML(focus.unit)}</strong></div>
        <div><span>Current mastery stage</span><strong>${escapeHTML(focus.stage)}</strong></div>
        <div><span>Preferred tool</span><strong>${escapeHTML(state.azureFocus?.preferredTool || 'PowerShell')}</strong></div>
        <div><span>Next required action</span><strong>${escapeHTML(focus.nextAction)}</strong></div>
      </div>
      <div class="inline-note warning">The ARM-template module remains incomplete until units 5, 6 and 7 are completed. Topic mastery remains separate from module content completion.</div>
    </article>

    <div class="section-heading"><div><h2>Azure lab journal</h2><p>Record the configuration, validation, failure, diagnosis and cleanup.</p></div></div>
    <article class="card">
      <form id="azure-lab-form">
        <div class="form-grid">
          <label>Topic<select name="moduleRef" required>${moduleChoices}</select></label>
          <label>Tool used<select name="tool" required><option>PowerShell</option><option>Azure portal</option><option>Azure CLI</option><option>Bicep or ARM</option><option>Mixed tools</option></select></label>
        </div>
        <label style="margin-top:12px">Objective<textarea name="objective" required></textarea></label>
        <div class="form-grid">
          <label>Configuration completed<textarea name="configuration" required></textarea></label>
          <label>What failed<textarea name="failure"></textarea></label>
          <label>Diagnosis and fix<textarea name="diagnosis"></textarea></label>
          <label>Final validation result<textarea name="result" required></textarea></label>
          <label>Resources created and cleanup<textarea name="cleanup"></textarea></label>
          <label>Commands or settings to retain<textarea name="commands"></textarea></label>
        </div>
        <div class="form-actions"><button class="primary-btn" type="submit">Save lab journal</button></div>
      </form>
    </article>

    ${state.azureLabs.length ? `<div class="section-heading"><div><h2>Recent practical evidence</h2></div></div><div class="grid two">${[...state.azureLabs].sort((a,b) => b.createdAt.localeCompare(a.createdAt)).slice(0,8).map(lab => `<article class="card lab-card"><div class="item-header"><div><span class="badge blue">${escapeHTML(lab.tool)}</span><h3>${escapeHTML(lab.moduleName)}</h3><span class="small muted">${new Date(lab.createdAt).toLocaleString('en-NZ')}</span></div><button class="ghost-btn" data-action="delete-lab" data-id="${lab.id}">Delete</button></div><p><strong>Objective:</strong> ${escapeHTML(lab.objective)}</p><details><summary class="details-toggle">Open evidence</summary><p><strong>Configuration:</strong> ${escapeHTML(lab.configuration).replace(/\n/g,'<br>')}</p>${lab.failure ? `<p><strong>Failure:</strong> ${escapeHTML(lab.failure).replace(/\n/g,'<br>')}</p>` : ''}${lab.diagnosis ? `<p><strong>Diagnosis:</strong> ${escapeHTML(lab.diagnosis).replace(/\n/g,'<br>')}</p>` : ''}<p><strong>Result:</strong> ${escapeHTML(lab.result).replace(/\n/g,'<br>')}</p>${lab.cleanup ? `<p><strong>Cleanup:</strong> ${escapeHTML(lab.cleanup).replace(/\n/g,'<br>')}</p>` : ''}</details></article>`).join('')}</div>` : ''}

    <div class="section-heading"><div><h2>AZ-104 learning paths</h2><p>Expand a path, then expand individual mastery stages.</p></div></div>
    <div class="item-list">${state.azPaths.map(path => {
      const content = pathContentPercent(path);
      const mastery = pathMasteryPercent(path);
      const current = path.id === state.azureFocus?.currentPathId;
      return `<article class="card item-card ${current ? 'azure-outline' : ''}"><div class="item-header"><div><span class="badge blue">${escapeHTML(path.targetWeeks)}</span>${current ? '<span class="badge green">Current path</span>' : ''}<h3>${escapeHTML(path.name)}</h3><span class="muted small">Content ${content}% · Mastery ${mastery}%</span></div><select class="status-select" data-az-status="${path.id}">${statusOptions(path.status, AZ_STATUS_OPTIONS)}</select></div><div class="dual-progress"><div><span>Content</span><div class="progress-line"><span style="width:${content}%"></span></div><strong>${content}%</strong></div><div><span>Mastery</span><div class="progress-line mastery-bar"><span style="width:${mastery}%"></span></div><strong>${mastery}%</strong></div></div><details class="item-body" ${current ? 'open' : ''}><summary class="details-toggle">Open modules, units and mastery stages</summary><div class="module-mastery-list">${path.modules.map(module => renderAzureModule(path,module)).join('')}</div><label>Path notes<textarea data-az-notes="${path.id}">${escapeHTML(path.notes || '')}</textarea></label></details></article>`;
    }).join('')}</div>`;
}

function renderAzureModule(path, module) {
  const content = moduleContentPercent(module);
  const mastery = moduleMasteryPercent(module);
  const completedUnits = module.units.filter(unit => unit.complete).length;
  const labCount = state.azureLabs.filter(lab => lab.pathId === path.id && lab.moduleId === module.id).length;
  const currentUnit = currentAzureUnit(module);
  const current = module.id === state.azureFocus?.currentModuleId;
  const questions = getModuleRecallQuestions(module);
  return `<article class="module-mastery-card ${current ? 'current-module' : ''}">
    <div class="module-master-head">
      <div><strong>${escapeHTML(module.name)}</strong><div class="module-badges">${current ? '<span class="badge green">Current module</span>' : ''}<span class="badge blue">${completedUnits}/${module.units.length} units</span><span class="badge green">${mastery}% mastery</span><span class="badge ${module.nextReview && module.nextReview <= getNZDateKey() ? 'amber' : 'blue'}">${escapeHTML(reviewDueText(module.nextReview))}</span><span class="badge">${labCount} labs</span></div></div>
    </div>
    <div class="dual-progress"><div><span>Content completion</span><div class="progress-line"><span style="width:${content}%"></span></div><strong>${content}%</strong></div><div><span>Mastery</span><div class="progress-line mastery-bar"><span style="width:${mastery}%"></span></div><strong>${mastery}%</strong></div></div>
    <details class="module-review" ${current ? 'open' : ''}><summary class="details-toggle">Open module details</summary>
      <div class="module-detail-grid">
        <section><h4>Units</h4><div class="unit-list">${module.units.map(unit => `<label class="unit-row ${unit.complete ? 'complete' : ''}"><input type="checkbox" data-az-unit="${path.id}" data-module-id="${module.id}" data-unit-id="${unit.id}" ${unit.complete ? 'checked' : ''}><span><strong>Unit ${unit.number}</strong>${escapeHTML(unit.name)}</span>${Number(module.currentUnit) === Number(unit.number) ? '<em>Current</em>' : ''}</label>`).join('')}</div><p class="small muted">Current unit: ${currentUnit ? `Unit ${currentUnit.number} — ${escapeHTML(currentUnit.name)}` : 'None'}</p></section>
        <section><h4>Module tracking</h4><label>Preferred tool<input type="text" data-az-module-field="preferredTool" data-path-id="${path.id}" data-module-id="${module.id}" value="${escapeHTML(module.preferredTool || '')}" placeholder="PowerShell, portal, CLI..."></label><label>Weak areas<textarea data-az-module-field="weakAreas" data-path-id="${path.id}" data-module-id="${module.id}">${escapeHTML(module.weakAreas || '')}</textarea></label><div class="assessment-entry"><input type="number" min="0" max="100" data-assessment-score-input="${path.id}" data-module-id="${module.id}" placeholder="Assessment %"><button class="secondary-btn" type="button" data-action="add-assessment-score" data-id="${path.id}" data-module-id="${module.id}">Add score</button></div><p class="small muted">Scores: ${module.assessmentScores?.length ? module.assessmentScores.map(score => `${score.score}% (${formatDateKey(score.date,{day:'numeric',month:'short'})})`).join(' · ') : 'None recorded'}</p></section>
      </div>
      <h4>Six mastery stages</h4>
      <div class="stage-list">${AZURE_STAGE_DEFS.map(([stageId,label,definition]) => renderMasteryStage(path,module,stageId,label,definition)).join('')}</div>
      <div class="recall-box"><strong>Active-recall questions</strong><ol>${questions.map((question,index) => `<li>${escapeHTML(question)}${index >= 4 ? ` <button type="button" class="inline-delete" data-action="delete-recall-question" data-id="${path.id}" data-module-id="${module.id}" data-question-index="${index-4}">×</button>` : ''}</li>`).join('')}</ol><div class="recall-question-add"><input type="text" data-recall-question-input="${path.id}" data-module-id="${module.id}" maxlength="240" placeholder="Add your own recall question"><button type="button" class="secondary-btn" data-action="add-recall-question" data-id="${path.id}" data-module-id="${module.id}">Add question</button></div><div class="recall-actions">${RECALL_RESULTS.map(([value,label]) => `<button type="button" class="${module.lastRecallResult === value ? 'selected' : ''}" data-action="record-az-review" data-id="${path.id}" data-module-id="${module.id}" data-result="${value}">${escapeHTML(label)}</button>`).join('')}</div></div>
    </details>
  </article>`;
}

function renderMasteryStage(path,module,stageId,label,definition) {
  const stage = module.masteryStages?.[stageId] || defaultMasteryStages()[stageId];
  return `<details class="mastery-stage-card ${stage.complete ? 'complete' : stage.partial ? 'partial' : ''}"><summary><span><input type="checkbox" data-az-stage="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}" ${stage.complete ? 'checked' : ''} onclick="event.stopPropagation()"><strong>${escapeHTML(label)}</strong><small>${escapeHTML(definition)}</small></span><span class="badge ${stage.complete ? 'green' : stage.partial ? 'amber' : 'blue'}">${stage.complete ? 'Completed' : stage.partial ? 'In progress' : 'Outstanding'}</span></summary><div class="stage-fields"><label>Completion date<input type="date" data-az-stage-field="date" data-path-id="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}" value="${escapeHTML(stage.date || '')}"></label><label>Confidence<select data-az-stage-field="confidence" data-path-id="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}">${ratingOptions(stage.confidence || 1)}</select></label><label>Review date<input type="date" data-az-stage-field="reviewDate" data-path-id="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}" value="${escapeHTML(stage.reviewDate || '')}"></label><label>Notes<textarea data-az-stage-field="notes" data-path-id="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}">${escapeHTML(stage.notes || '')}</textarea></label><label>Evidence<textarea data-az-stage-field="evidence" data-path-id="${path.id}" data-module-id="${module.id}" data-stage-id="${stageId}">${escapeHTML(stage.evidence || '')}</textarea></label></div></details>`;
}

function renderDan() {
  const totalCheckpoints = state.syllabus.flatMap(item => item.checkpoints);
  const checkpointPercent = percent(totalCheckpoints.filter(check => check.complete).length, totalCheckpoints.length);
  const quality = average(state.syllabus.flatMap(item => [Number(item.ratings?.right || 1), Number(item.ratings?.left || 1)]));
  const priority = getDanPriority();
  const groups = ['Kihon','Kata','Kumite'];
  document.getElementById('view-dan').innerHTML = `<div class="hero karate-hero"><p class="eyebrow">3RD DAN GRADING PREPARATION</p><h2>Kihon, kata and kumite evidence</h2><p>Knowing the sequence does not equal grading readiness. Track both sides, corrections, instructor feedback and later review dates.</p><div class="hero-meta"><span class="badge red">${checkpointPercent}% checkpoints</span><span class="badge amber">${quality.toFixed(1)}/5 side quality</span><span class="badge blue">${state.syllabus.reduce((sum,item)=>sum+(item.practiceCount||0),0)} sessions</span></div></div>${priority ? `<article class="card priority-card grading-priority"><div><span class="focus-kicker grading-text">Current grading section</span><span class="badge red">${escapeHTML(priority.subtitle)}</span><h2>${escapeHTML(priority.title)}</h2><p>${escapeHTML(priority.reason)}</p></div><ul>${priority.tasks.map(task=>`<li>${escapeHTML(task)}</li>`).join('')}</ul></article>` : ''}${groups.map(group => `<div class="section-heading"><div><h2>${group}</h2></div></div><div class="item-list">${state.syllabus.filter(item=>item.group===group).map(renderSyllabusCard).join('')}</div>`).join('')}`;
}

function renderSyllabusCard(item) {
  const checkpointProgress = percent(item.checkpoints.filter(check=>check.complete).length,item.checkpoints.length);
  const ratingAverage = average(KARATE_RATING_FIELDS.map(([key])=>Number(item.ratings?.[key]||1)));
  const weakest = KARATE_RATING_FIELDS.map(([key,label])=>({label,value:Number(item.ratings?.[key]||1)})).sort((a,b)=>a.value-b.value).slice(0,2);
  return `<article class="card item-card karate-outline"><div class="item-header"><div><h3>${escapeHTML(item.title)}</h3><span class="muted small">${item.lastPractised ? `Last practised ${formatDateKey(item.lastPractised,{day:'numeric',month:'short',year:'numeric'})}` : 'Not yet practised'} · ${item.practiceCount||0} sessions</span><div class="module-badges"><span class="badge red">${ratingAverage.toFixed(1)}/5</span><span class="badge amber">Weakest: ${escapeHTML(weakest.map(field=>`${field.label} ${field.value}/5`).join(' · '))}</span><span class="badge ${item.nextReview && item.nextReview <= getNZDateKey() ? 'red':'blue'}">${escapeHTML(reviewDueText(item.nextReview))}</span></div></div><select class="status-select" data-dan-status="${item.id}">${statusOptions(item.status,STATUS_OPTIONS)}</select></div><div class="progress-line"><span style="width:${checkpointProgress}%"></span></div><details class="item-body"><summary class="details-toggle">Open training assessment</summary><div class="assessment-layout"><div><h4>Checklist</h4>${item.checkpoints.map(check=>`<label class="unit-row"><input type="checkbox" data-dan-check="${item.id}" data-check-id="${check.id}" ${check.complete?'checked':''}><span>${escapeHTML(check.name)}</span></label>`).join('')}</div><div><h4>Technique ratings</h4><div class="rating-grid">${KARATE_RATING_FIELDS.map(([key,label])=>`<label>${escapeHTML(label)}<select data-dan-rating="${item.id}" data-rating-field="${key}">${ratingOptions(item.ratings?.[key]||1)}</select></label>`).join('')}</div></div></div><div class="form-grid"><label>Main correction<textarea data-dan-field="mainCorrection" data-dan-id="${item.id}">${escapeHTML(item.mainCorrection||'')}</textarea></label><label>Instructor feedback<textarea data-dan-field="instructorFeedback" data-dan-id="${item.id}">${escapeHTML(item.instructorFeedback||'')}</textarea></label><label>Evidence or video reference<textarea data-dan-field="evidence" data-dan-id="${item.id}">${escapeHTML(item.evidence||'')}</textarea></label><label>Next review date<input type="date" data-dan-field="nextReview" data-dan-id="${item.id}" value="${escapeHTML(item.nextReview||'')}"></label><label>Confidence<div class="confidence">${renderConfidence('dan-confidence',item.id,item.confidence)}</div></label><label>Additional notes<textarea data-dan-notes="${item.id}">${escapeHTML(item.notes||'')}</textarea></label></div><div class="form-actions"><button class="primary-btn" data-action="log-dan-practice" data-id="${item.id}">Log practice today</button></div></details></article>`;
}

function renderKata() {
  const jion = state.katas.find(kata=>kata.id==='jion') || currentKata();
  const due = state.katas.filter(kata=>kata.nextReview && kata.nextReview<=getNZDateKey()).length;
  const known = state.katas.filter(kata=>kata.sequenceProgress>=100);
  const learning = state.katas.filter(kata=>kata.sequenceProgress<100 && kata.status!=='not-started');
  const planned = state.katas.filter(kata=>kata.status==='not-started');
  document.getElementById('view-kata').innerHTML = `<div class="hero karate-hero"><p class="eyebrow">CURRENT TOKUI KATA</p><h2>Jion readiness and retention</h2><p>The Jion sequence is recorded as known. Every technical area remains outstanding until it is assessed and demonstrated.</p><div class="hero-meta"><span class="badge red">Jion readiness ${Number(jion.gradingReadiness||0)}%</span><span class="badge green">Sequence known</span><span class="badge ${due?'amber':'green'}">${due} retention reviews due</span></div></div><div class="section-heading"><div><h2>Current kata focus</h2></div></div>${renderKataCard(jion,true)}<div class="section-heading"><div><h2>Sequence known and retention</h2></div></div><div class="grid two">${known.filter(kata=>kata.id!==jion.id).map(kata=>renderKataCard(kata,false)).join('')||'<div class="card empty">No other kata records.</div>'}</div><div class="section-heading"><div><h2>Currently learning</h2></div></div><div class="grid two">${learning.map(kata=>renderKataCard(kata,false)).join('')||'<div class="card empty">No other kata currently learning.</div>'}</div><div class="section-heading"><div><h2>Planned kata</h2></div></div><div class="grid two">${planned.map(kata=>renderKataCard(kata,false)).join('')}</div>`;
}

function renderKataCard(kata,current=false) {
  const readiness = Number(kata.gradingReadiness||0);
  return `<article class="card item-card karate-outline ${current?'current-kata-card':''}"><div class="item-header"><div>${current?'<span class="badge red">Current kata</span>':''}<h3>${escapeHTML(kata.name)}</h3><span class="muted small">Sequence: ${kata.sequenceProgress>=100?'Known':'Learning'} · Readiness: ${readiness}% · Last: ${kata.lastPractised?formatDateKey(kata.lastPractised,{day:'numeric',month:'short'}):'Not practised'}</span><div class="module-badges"><span class="badge red">${readiness}% grading readiness</span><span class="badge ${kata.nextReview&&kata.nextReview<=getNZDateKey()?'amber':'blue'}">${escapeHTML(reviewDueText(kata.nextReview))}</span></div></div><select class="status-select" data-kata-status="${kata.id}">${statusOptions(kata.status,KATA_STATUS_OPTIONS)}</select></div><div class="progress-line karate-progress"><span style="width:${readiness}%"></span></div><details class="item-body" ${current?'open':''}><summary class="details-toggle">Open kata assessment</summary><div class="kata-section-grid">${(kata.sections||[]).map(section=>`<label>${escapeHTML(section.name)}<select data-kata-section="${kata.id}" data-section-id="${section.id}">${kataSectionOptions(section.level)}</select></label>`).join('')}</div><div class="form-grid"><label>Main technical correction<textarea data-kata-field="mainCorrection" data-kata-id="${kata.id}" placeholder="Not yet entered">${escapeHTML(kata.mainCorrection||'')}</textarea></label><label>Weaker side<select data-kata-field="weakerSide" data-kata-id="${kata.id}"><option value="not-assessed" ${kata.weakerSide==='not-assessed'?'selected':''}>Not assessed</option><option value="right" ${kata.weakerSide==='right'?'selected':''}>Right</option><option value="left" ${kata.weakerSide==='left'?'selected':''}>Left</option><option value="equal" ${kata.weakerSide==='equal'?'selected':''}>Equal</option></select></label><label>Instructor feedback<textarea data-kata-field="instructorFeedback" data-kata-id="${kata.id}">${escapeHTML(kata.instructorFeedback||'')}</textarea></label><label>Evidence or video reference<textarea data-kata-field="evidence" data-kata-id="${kata.id}">${escapeHTML(kata.evidence||'')}</textarea></label><label>Retention due date<input type="date" data-kata-field="nextReview" data-kata-id="${kata.id}" value="${escapeHTML(kata.nextReview||'')}"></label><label>Confidence<div class="confidence">${renderConfidence('kata-confidence',kata.id,kata.confidence)}</div></label><label>Notes<textarea data-kata-notes="${kata.id}">${escapeHTML(kata.notes||'')}</textarea></label></div><div class="retention-summary"><strong>Retention result</strong><span>${kata.lastPerformanceResult==='clean'?'Clean performance':kata.lastPerformanceResult==='mistakes'?'Mistakes found':'Not recorded'}</span></div><div class="form-actions"><button class="primary-btn" data-action="kata-clean" data-id="${kata.id}">Clean performance</button><button class="secondary-btn" data-action="kata-mistakes" data-id="${kata.id}">Mistakes found</button><button class="ghost-btn" data-action="log-kata-practice" data-id="${kata.id}">Log practice only</button></div></details></article>`;
}

function renderConfidence(action,id,current) {
  return [1,2,3,4,5].map(value=>`<button type="button" data-action="${action}" data-id="${id}" data-value="${value}" class="${Number(current)===value?'active':''}" aria-label="Confidence ${value} of 5">${value}</button>`).join('');
}

function percent(value,total) {
  return total ? Math.round(value/total*100) : 0;
}

function findRoadmapGoal(goalId) {
  for (const month of state.roadmap?.months || []) {
    const monthGoal = month.goals.find(goal=>goal.id===goalId);
    if (monthGoal) return monthGoal;
    for (const week of month.weeks) {
      const weekGoal = week.goals.find(goal=>goal.id===goalId);
      if (weekGoal) return weekGoal;
    }
  }
  return null;
}

function goalCollectionProgress(goals=[]) {
  return percent(goals.filter(goal=>goal.complete).length,goals.length);
}

function monthRoadmapProgress(month) {
  return goalCollectionProgress([...month.goals,...month.weeks.flatMap(week=>week.goals)]);
}

function findRoadmapWeekForDate(dateKey) {
  const date=parseDateKey(dateKey);
  const month=state.roadmap?.months?.find(item=>item.monthStart.slice(0,7)===dateKey.slice(0,7));
  if(!month) return null;
  const weekIndex=Math.min(month.weeks.length-1,Math.floor((date.getDate()-1)/7));
  const week=month.weeks[weekIndex];
  return {month,week,progress:goalCollectionProgress(week.goals)};
}

function progressStatus(actual, target = 70) {
  if (actual >= Math.min(100, target + 15)) return 'Ahead';
  if (actual >= Math.max(0, target - 15)) return 'On track';
  if (actual >= Math.max(0, target - 35)) return 'Slightly behind';
  return 'Behind';
}

function renderRoadmap() {
  const currentMonth=getNZDateKey().slice(0,7);
  return `<div class="roadmap-list">${(state.roadmap?.months||[]).map(month=>{
    const progress=monthRoadmapProgress(month);
    return `<details class="roadmap-month" ${month.monthStart.slice(0,7)===currentMonth?'open':''}><summary><div><span class="focus-kicker">${escapeHTML(month.label)}</span><strong>${escapeHTML(month.title)}</strong></div><div><span class="badge ${progress>=75?'green':progress>=40?'amber':'blue'}">${progress}% complete</span></div></summary><div class="roadmap-body"><h4>Monthly goals</h4>${month.goals.map(renderRoadmapGoal).join('')}<div class="roadmap-weeks">${month.weeks.map(week=>`<details class="roadmap-week"><summary><strong>${escapeHTML(week.label)}</strong><span class="badge">${goalCollectionProgress(week.goals)}%</span></summary>${week.goals.map(renderRoadmapGoal).join('')}</details>`).join('')}</div></div></details>`;
  }).join('')}</div>`;
}

function renderRoadmapGoal(goal) {
  return `<div class="roadmap-goal ${goal.complete?'complete':''}"><label><input type="checkbox" data-roadmap-goal="${goal.id}" ${goal.complete?'checked':''}><span><em class="${goal.category.toLowerCase()}">${escapeHTML(goal.category)}</em>${escapeHTML(goal.text)}</span></label><input type="text" data-roadmap-evidence="${goal.id}" value="${escapeHTML(goal.evidence||'')}" placeholder="Evidence or note"></div>`;
}

function renderProgress() {
  const today=getNZDateKey();
  const modules=getAllAzureModules().map(({module})=>module);
  const allUnits=modules.flatMap(module=>module.units||[]);
  const allStages=modules.flatMap(module=>AZURE_STAGE_DEFS.map(([id])=>module.masteryStages?.[id]));
  const azContent=percent(allUnits.filter(unit=>unit.complete).length,allUnits.length);
  const azMastery=percent(allStages.filter(stage=>stage?.complete).length,allStages.length);
  const currentMastery=moduleMasteryPercent(currentAzureModule());
  const kihon=state.syllabus.filter(item=>item.group==='Kihon');
  const kumite=state.syllabus.find(item=>item.group==='Kumite');
  const kihonProgress=percent(kihon.flatMap(item=>item.checkpoints).filter(check=>check.complete).length,kihon.flatMap(item=>item.checkpoints).length);
  const jion=state.katas.find(kata=>kata.id==='jion')||currentKata();
  const kataReadiness=Number(jion?.gradingReadiness||0);
  const kumiteReadiness=kumite?Math.round(average(KARATE_RATING_FIELDS.map(([key])=>Number(kumite.ratings?.[key]||1)))/5*100):0;
  const karateOverall=Math.round(average([kihonProgress,kataReadiness,kumiteReadiness]));
  const roadmapGoals=(state.roadmap?.months||[]).flatMap(month=>[...month.goals,...month.weeks.flatMap(week=>week.goals)]);
  const roadmapProgress=goalCollectionProgress(roadmapGoals);
  const currentRoadmap=findRoadmapWeekForDate(today);
  const weekdayIndex=(parseDateKey(today).getDay()+6)%7;
  const currentMonth=currentRoadmap?.month;
  const currentWeek=currentRoadmap?.week;
  const weekProgress=currentWeek?goalCollectionProgress(currentWeek.goals):roadmapProgress;
  const currentWeekIndex=currentMonth&&currentWeek?Math.max(0,currentMonth.weeks.findIndex(week=>week.id===currentWeek.id)):0;
  const expectedWeek=Math.round((weekdayIndex+1)/7*100);
  const expectedMonth=currentMonth?Math.min(100,Math.round((currentWeekIndex+(weekdayIndex+1)/7)/currentMonth.weeks.length*100)):25;
  const currentMonthGoals=currentMonth?[...currentMonth.goals,...currentMonth.weeks.flatMap(week=>week.goals)]:roadmapGoals;
  const azureRoadmapGoals=currentMonthGoals.filter(goal=>goal.category==='Azure');
  const karateRoadmapGoals=currentMonthGoals.filter(goal=>goal.category==='Karate');
  const azureGoalProgress=goalCollectionProgress(azureRoadmapGoals);
  const karateGoalProgress=goalCollectionProgress(karateRoadmapGoals);
  const completedDaily=Object.entries(state.daily).filter(([,record])=>record.status==='completed'&&record.evidence).slice(-8);
  const partialDaily=Object.entries(state.daily).filter(([key,record])=>record.status==='partial'||(record.status==='in-progress'&&dayCompletion(key)>0)).slice(-8);
  const outstandingStages=getAllAzureModules().flatMap(({path,module})=>AZURE_STAGE_DEFS.filter(([id])=>!module.masteryStages?.[id]?.complete).map(([id,label])=>`${path.name.replace('AZ-104: ','')} — ${module.name}: ${label}`)).slice(0,8);
  const azStatus=progressStatus(azureGoalProgress,expectedMonth);
  const karateStatus=progressStatus(karateGoalProgress,expectedMonth);
  const overallStatus=progressStatus(weekProgress,expectedWeek);
  document.getElementById('view-progress').innerHTML=`
    <div class="hero"><p class="eyebrow">MONTHLY AND WEEKLY ROADMAP</p><h2>What lies ahead</h2><p>Expand each month and week. Check goals only when the result is supported by evidence or a clear training record.</p><div class="hero-meta"><span class="badge blue">All roadmap goals ${roadmapProgress}%</span><span class="badge blue">Current week ${weekProgress}% · expected ${expectedWeek}%</span><span class="badge ${overallStatus==='Behind'?'red':overallStatus==='Slightly behind'?'amber':'green'}">Weekly status: ${overallStatus}</span></div></div>
    <div class="section-heading"><div><h2>Monthly → weekly goals</h2><p>Use the evidence field to record what proves each goal was reached.</p></div></div>${renderRoadmap()}
    <div class="section-heading"><div><h2>Progress report</h2></div></div>
    <div class="grid three report-status-grid"><article class="card"><span>Azure</span><strong>${azStatus}</strong><small>${azureGoalProgress}% current-month goals · ${azContent}% content · ${azMastery}% mastery</small></article><article class="card"><span>Karate</span><strong>${karateStatus}</strong><small>${karateGoalProgress}% current-month goals · ${karateOverall}% estimated readiness</small></article><article class="card"><span>Current week</span><strong>${overallStatus}</strong><small>${weekProgress}% complete · ${expectedWeek}% expected by today</small></article></div>
    <div class="grid two" style="margin-top:16px"><article class="card"><h2>Current focus</h2><p><strong>Azure:</strong> ${escapeHTML(getAzureFocusSummary().module)} — ${escapeHTML(getAzureFocusSummary().unit)}</p><p><strong>Kata:</strong> Jion — ${kataReadiness}% evidence-based readiness</p><p><strong>Grading section:</strong> ${escapeHTML(getDanPriority()?.title||'Not assessed')}</p></article><article class="card"><h2>Progress percentages</h2><div class="bar-chart">${[['AZ-104 content',azContent,'Evidence-based'],['Current Azure-topic mastery',currentMastery,'Evidence-based'],['3rd Dan kihon',kihonProgress,'Estimated'],['Jion readiness',kataReadiness,kataReadiness?'Evidence-based':'Not enough evidence'],['Kumite readiness',kumiteReadiness,kumiteReadiness>20?'Estimated':'Not enough evidence'],['Overall karate grading readiness',karateOverall,'Estimated']].map(([label,value,quality])=>`<div class="bar-row report-bar"><span>${escapeHTML(label)}<small>${escapeHTML(quality)}</small></span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><span class="bar-value">${value}%</span></div>`).join('')}</div></article></div>
    <div class="grid three" style="margin-top:16px"><article class="card report-list"><h2>Items I can check off</h2>${completedDaily.length?completedDaily.map(([key,record])=>`<p><span class="badge green">${formatDateKey(key,{day:'numeric',month:'short'})}</span> ${escapeHTML(record.task?.title||'Completed task')}<small>${escapeHTML(record.evidence)}</small></p>`).join(''):'<p class="muted">No fully completed task with evidence yet.</p>'}</article><article class="card report-list"><h2>Partially completed</h2>${partialDaily.length?partialDaily.map(([key,record])=>`<p><span class="badge amber">${formatDateKey(key,{day:'numeric',month:'short'})}</span> ${escapeHTML(record.task?.title||'Task')}<small>${dayCompletion(key)}% checklist progress</small></p>`).join(''):'<p class="muted">No partial tasks recorded.</p>'}</article><article class="card report-list"><h2>Still outstanding</h2>${outstandingStages.map(item=>`<p>${escapeHTML(item)}</p>`).join('')||'<p class="muted">No outstanding mastery stages.</p>'}</article></div>`;
}

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
        <h2>Alternating programme settings</h2>
        <div class="form-grid">
          <label>Programme start date<input id="programme-start-date" type="date" value="${escapeHTML(state.settings.programmeStartDate || PROGRAMME_START_DATE)}"></label>
          <label>Daily structure<input type="text" value="One main task per day" disabled></label>
        </div>
        <div class="weekly-default-grid" style="margin-top:14px">
          ${Object.keys(DEFAULT_WEEKLY_DAY_TYPES).map(day => `<label>${day}<select data-weekly-default="${day}">${dayTypeOptions(state.settings.weeklyDayTypes?.[day] || DEFAULT_WEEKLY_DAY_TYPES[day])}</select></label>`).join('')}
        </div>
        <div class="inline-note" style="margin-top:13px">Azure and karate are never generated as main tasks on the same day. Review days remain tied to Azure or karate, and rest days remain available.</div>
        <div class="form-actions"><button class="primary-btn" data-action="save-programme-settings">Save programme settings</button></div>
        <p class="muted small" style="margin-top:12px">App version ${APP_VERSION} · State schema ${STATE_VERSION}</p>
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

function findNextSuitableDates(sourceKey, dayType, limit = 3) {
  const matches = [];
  for (let offset = 1; offset <= 42 && matches.length < limit; offset += 1) {
    const key = addDays(sourceKey, offset);
    if (getDayTypeForDate(key) !== dayType) continue;
    const record = state.daily[key];
    const occupied = record && (record.status !== 'not-started' || Object.values(record.checks || {}).some(Boolean) || record.evidence || record.notes);
    if (!occupied) matches.push(key);
  }
  return matches;
}

function openTaskCompletionDialog(dateKey = selectedDateKey) {
  const record = getDailyRecord(dateKey);
  const task = record.task;
  const dialog = document.getElementById('task-completion-dialog');
  const form = document.getElementById('task-completion-form');
  const fields = document.getElementById('task-completion-fields');
  form.dataset.date = dateKey;
  document.getElementById('task-completion-title').textContent = task.category === 'azure' ? 'Complete Azure task' : task.category === 'karate' ? 'Complete karate task' : 'Complete recovery task';
  const common = `<label>What did you complete?<textarea name="summary" required>${escapeHTML(record.notes || '')}</textarea></label>
    <label>Did you finish the entire planned task?<select name="finished"><option value="yes">Yes</option><option value="partial">Partially</option><option value="no">No</option></select></label>
    <label>What evidence do you have?<textarea name="evidence" placeholder="Required for full completion">${escapeHTML(record.evidence || '')}</textarea></label>
    <label>Confidence rating<select name="confidence">${ratingOptions(record.confidence || 3)}</select></label>`;
  if (task.category === 'azure') {
    fields.innerHTML = `${common}
      <label>Which mastery stage was demonstrated?<select name="masteryStage">${AZURE_STAGE_DEFS.map(([id,label]) => `<option value="${id}" ${task.masteryStage === label ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label>What did you not understand?<textarea name="notUnderstood"></textarea></label>
      <div class="form-grid"><label>Did the task create Azure resources?<select name="resourcesCreated"><option value="yes">Yes</option><option value="no">No</option></select></label><label>Were the resources cleaned up?<select name="resourcesCleaned"><option value="yes">Yes</option><option value="no">No</option><option value="not-applicable">Not applicable</option></select></label></div>
      <label>Should a review be scheduled?<select name="scheduleReview"><option value="yes">Yes</option><option value="no">No</option></select></label>`;
  } else if (task.category === 'karate') {
    fields.innerHTML = `${common}
      <label>Which section was practised?<select name="karateSection"><option>Kihon</option><option selected>Kata</option><option>Kumite</option></select></label>
      <label>Which kata was practised?<input name="kata" type="text" value="${escapeHTML(task.kata || 'Jion')}"></label>
      <label>What improved?<textarea name="improved"></textarea></label>
      <label>What still felt weak?<textarea name="weak"></textarea></label>
      <div class="form-grid"><label>Right-side rating<select name="rightRating">${ratingOptions(1)}</select></label><label>Left-side rating<select name="leftRating">${ratingOptions(1)}</select></label></div>
      <label>Instructor feedback<textarea name="instructorFeedback"></textarea></label>
      <label>Main correction for next time<textarea name="mainCorrection"></textarea></label>
      <label>Should a retention review be scheduled?<select name="scheduleReview"><option value="yes">Yes</option><option value="no">No</option></select></label>`;
  } else {
    fields.innerHTML = common;
  }
  dialog.showModal();
}

function openRescheduleDialog(dateKey = selectedDateKey) {
  const record = getDailyRecord(dateKey);
  const suggestions = findNextSuitableDates(dateKey, record.dayType);
  const dialog = document.getElementById('reschedule-dialog');
  const form = document.getElementById('reschedule-form');
  form.dataset.date = dateKey;
  const input = document.getElementById('reschedule-date');
  input.min = addDays(dateKey, 1);
  input.value = suggestions[0] || addDays(dateKey, 1);
  document.getElementById('reschedule-suggestions').innerHTML = suggestions.length
    ? suggestions.map(key => `<button type="button" class="secondary-btn" data-action="choose-reschedule-date" data-date="${key}">${escapeHTML(formatDateKey(key, { weekday:'short', day:'numeric', month:'short' }))}</button>`).join('')
    : '<span class="muted small">No matching scheduled day was found in the next six weeks. Choose a date manually; its focus type will be changed to match this task.</span>';
  document.getElementById('reschedule-description').textContent = `This ${dayTypeLabel(record.dayType)} task will replace the generated task on the destination date. No second task will be created.`;
  dialog.showModal();
}

function applyTaskCompletion(dateKey, data) {
  const record = getDailyRecord(dateKey);
  const task = record.task;
  const finished = String(data.get('finished') || 'partial');
  const evidence = String(data.get('evidence') || '').trim();
  if (finished === 'yes' && task.category !== 'rest' && !evidence) throw new Error('Add evidence before marking the task fully completed.');
  record.notes = String(data.get('summary') || '').trim();
  record.evidence = evidence;
  record.confidence = Number(data.get('confidence') || 3);
  record.status = finished === 'yes' ? 'completed' : finished === 'partial' ? 'partial' : 'missed';
  record.result = record.status;
  record.completedAt = finished === 'yes' ? new Date().toISOString() : '';
  record.completionData = Object.fromEntries(data.entries());
  if (finished === 'yes') task.checklist.forEach((_, index) => { record.checks[taskSubKey(task.id, index)] = true; });

  if (task.category === 'azure') {
    const module = findAZModule(task.refs?.pathId, task.refs?.moduleId);
    if (module) {
      const stageId = String(data.get('masteryStage') || 'learn');
      const stage = module.masteryStages?.[stageId];
      const unit = module.units?.find(entry => entry.id === task.refs?.unitId);
      if (unit && finished === 'yes') unit.complete = true;
      const nextUnit = module.units?.find(entry => !entry.complete);
      module.currentUnit = nextUnit?.number || module.units?.at(-1)?.number || 1;
      module.complete = module.units?.every(entry => entry.complete) || false;
      if (stage) {
        const canCompleteStage = stageId !== 'learn' || module.complete;
        stage.complete = finished === 'yes' && canCompleteStage;
        stage.partial = finished === 'partial' || (finished === 'yes' && !canCompleteStage);
        stage.date = stage.complete ? getNZDateKey() : stage.date;
        stage.notes = [stage.notes, String(data.get('notUnderstood') || '').trim()].filter(Boolean).join('\n');
        stage.evidence = evidence || stage.evidence;
        stage.confidence = record.confidence;
      }
      module.lastStudied = getNZDateKey();
      module.evidence.learned = module.complete;
      module.evidence.practised = module.evidence.practised || stageId === 'perform';
      module.evidence.verified = module.evidence.verified || stageId === 'test';
      module.masteryLevel = Math.min(5, AZURE_STAGE_DEFS.filter(([id]) => module.masteryStages[id]?.complete).length);
      if (String(data.get('scheduleReview')) === 'yes') {
        module.reviewIntervalDays = Math.max(3, Number(module.reviewIntervalDays || 0));
        module.nextReview = addDays(getNZDateKey(), module.reviewIntervalDays);
        if (stage) stage.reviewDate = module.nextReview;
      }
    }
  }

  if (task.category === 'karate') {
    const kata = findKata(task.refs?.kataId) || currentKata();
    if (kata) {
      kata.practiceCount = (kata.practiceCount || 0) + 1;
      kata.lastPractised = getNZDateKey();
      kata.mainCorrection = String(data.get('mainCorrection') || '').trim() || kata.mainCorrection;
      kata.instructorFeedback = String(data.get('instructorFeedback') || '').trim() || kata.instructorFeedback;
      kata.evidence = evidence || kata.evidence;
      kata.confidence = record.confidence;
      if (String(data.get('scheduleReview')) === 'yes') {
        kata.retentionIntervalDays = Number(kata.retentionIntervalDays || 7);
        kata.nextReview = addDays(getNZDateKey(), kata.retentionIntervalDays);
      }
    }
    const syllabus = findDan(task.refs?.syllabusId);
    if (syllabus) {
      syllabus.ratings.right = Number(data.get('rightRating') || syllabus.ratings.right || 1);
      syllabus.ratings.left = Number(data.get('leftRating') || syllabus.ratings.left || 1);
      syllabus.mainCorrection = String(data.get('mainCorrection') || '').trim() || syllabus.mainCorrection;
      syllabus.instructorFeedback = String(data.get('instructorFeedback') || '').trim() || syllabus.instructorFeedback;
      syllabus.lastPractised = getNZDateKey();
      syllabus.practiceCount = (syllabus.practiceCount || 0) + 1;
    }
  }
}

document.addEventListener('click', async event => {
  const nav = event.target.closest('[data-view]');
  if (nav) { showView(nav.dataset.view); return; }
  const actionEl = event.target.closest('[data-action]');
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === 'close-task-completion') { document.getElementById('task-completion-dialog')?.close(); return; }
  if (action === 'close-reschedule') { document.getElementById('reschedule-dialog')?.close(); return; }
  if (action === 'open-timer') return openTimer();
  if (action === 'previous-day') { selectedDateKey = addDays(selectedDateKey, -1); renderToday(); return; }
  if (action === 'next-day') { selectedDateKey = addDays(selectedDateKey, 1); renderToday(); return; }
  if (action === 'go-today') { selectedDateKey = getNZDateKey(); renderToday(); return; }
  if (action === 'previous-week') { selectedDateKey = addDays(getWeekStart(selectedDateKey), -7); renderWeek(); return; }
  if (action === 'next-week') { selectedDateKey = addDays(getWeekStart(selectedDateKey), 7); renderWeek(); return; }
  if (action === 'current-week') { selectedDateKey = getNZDateKey(); renderWeek(); return; }
  if (action === 'open-day') { selectedDateKey = actionEl.dataset.date || getNZDateKey(); showView('today'); return; }
  if (action === 'start-task') { const record=getDailyRecord(selectedDateKey); if(record.status==='not-started'||record.status==='partial'){record.status='in-progress';record.startedAt ||= new Date().toISOString();saveState({render:true});toast('Task started.');} return; }
  if (action === 'mark-next-step') { const record=getDailyRecord(selectedDateKey); const task=record.task; const index=task.checklist.findIndex((_,i)=>!record.checks[taskSubKey(task.id,i)]); if(index<0)return toast('All checklist steps are already marked.'); record.checks[taskSubKey(task.id,index)]=true; record.status='in-progress'; record.startedAt ||= new Date().toISOString(); saveState({render:true}); return; }
  if (action === 'add-task-evidence') { getDailyRecord(selectedDateKey); renderToday(); setTimeout(()=>document.getElementById(`daily-evidence-${selectedDateKey}`)?.focus(),0); return; }
  if (action === 'complete-task') { openTaskCompletionDialog(selectedDateKey); return; }
  if (action === 'reschedule-task') { openRescheduleDialog(selectedDateKey); return; }
  if (action === 'choose-reschedule-date') { document.getElementById('reschedule-date').value=actionEl.dataset.date; return; }
  if (action === 'miss-task') { if(await confirmAction('Mark this task as missed?','It will remain missed until you reschedule it to a suitable day.')){const record=getDailyRecord(selectedDateKey);record.status='missed';record.result='missed';saveState({render:true});} return; }
  if (action === 'record-az-review') { if(recordAzureReview(id,actionEl.dataset.moduleId,actionEl.dataset.result)){saveState({render:true});const module=findAZModule(id,actionEl.dataset.moduleId);toast(`Recall recorded. Next review: ${formatDateKey(module.nextReview,{day:'numeric',month:'short'})}.`);} return; }
  if (action === 'add-recall-question') { const input=document.querySelector(`[data-recall-question-input="${CSS.escape(id)}"][data-module-id="${CSS.escape(actionEl.dataset.moduleId)}"]`); const question=input?.value.trim(); if(!question)return toast('Enter a recall question first.'); const module=findAZModule(id,actionEl.dataset.moduleId); module.customQuestions ||= []; module.customQuestions.push(question); saveState({render:true}); return; }
  if (action === 'delete-recall-question') { const module=findAZModule(id,actionEl.dataset.moduleId); const index=Number(actionEl.dataset.questionIndex); if(module?.customQuestions?.[index]!==undefined){module.customQuestions.splice(index,1);saveState({render:true});} return; }
  if (action === 'add-assessment-score') { const input=document.querySelector(`[data-assessment-score-input="${CSS.escape(id)}"][data-module-id="${CSS.escape(actionEl.dataset.moduleId)}"]`); const score=Number(input?.value); if(!Number.isFinite(score)||score<0||score>100)return toast('Enter an assessment score from 0 to 100.'); const module=findAZModule(id,actionEl.dataset.moduleId); module.assessmentScores ||= []; module.assessmentScores.push({score,date:getNZDateKey()}); saveState({render:true}); return; }
  if (action === 'delete-lab') { if(await confirmAction('Delete lab journal?','This evidence entry will be removed.')){state.azureLabs=state.azureLabs.filter(lab=>lab.id!==id);saveState({render:true});} return; }
  if (action === 'kata-clean') { const kata=findKata(id); if(!kata)return; kata.practiceCount=(kata.practiceCount||0)+1;kata.lastPractised=getNZDateKey();kata.lastPerformanceResult='clean';kata.retentionIntervalDays=getNextKataInterval(kata.retentionIntervalDays);kata.nextReview=addDays(getNZDateKey(),kata.retentionIntervalDays);kata.confidence=Math.min(5,Number(kata.confidence||1)+1);saveState({render:true});return; }
  if (action === 'kata-mistakes') { const kata=findKata(id); if(!kata)return; kata.practiceCount=(kata.practiceCount||0)+1;kata.lastPractised=getNZDateKey();kata.lastPerformanceResult='mistakes';kata.retentionIntervalDays=3;kata.nextReview=addDays(getNZDateKey(),3);kata.confidence=Math.max(1,Number(kata.confidence||1)-1);saveState({render:true});return; }
  if (action === 'dan-confidence') { findDan(id).confidence=Number(actionEl.dataset.value);saveState({render:true});return; }
  if (action === 'kata-confidence') { findKata(id).confidence=Number(actionEl.dataset.value);saveState({render:true});return; }
  if (action === 'log-dan-practice') { const item=findDan(id);item.practiceCount=(item.practiceCount||0)+1;item.lastPractised=getNZDateKey();item.lastAssessmentResult=getNZDateKey();if(item.status==='not-started')item.status='learning';saveState({render:true});return; }
  if (action === 'log-kata-practice') { const item=findKata(id);item.practiceCount=(item.practiceCount||0)+1;item.lastPractised=getNZDateKey();if(item.status==='not-started')item.status='learning';if(!item.nextReview)item.nextReview=addDays(getNZDateKey(),Number(item.retentionIntervalDays||7));saveState({render:true});return; }
  if (action === 'delete-note') { if(await confirmAction('Delete note?','This note will be removed.')){state.notes=state.notes.filter(note=>note.id!==id);saveState({render:true});} return; }
  if (action === 'export-backup') return exportBackup();
  if (action === 'choose-import') return document.getElementById('import-file').click();
  if (action === 'save-programme-settings') { state.settings.programmeStartDate=document.getElementById('programme-start-date').value||PROGRAMME_START_DATE; document.querySelectorAll('[data-weekly-default]').forEach(select=>{state.settings.weeklyDayTypes[select.dataset.weeklyDefault]=select.value;}); saveState({render:true});toast('Alternating schedule saved.');return; }
  if (action === 'save-sync-provider') { const selected=document.getElementById('cloud-provider').value;setCloudProvider(selected);if(selected==='onedrive'&&microsoftAccount)await pullOneDrive({initial:true});if(selected==='supabase'&&cloudUser)await pullCloud({initial:true});renderSettings();return; }
  if (action === 'save-microsoft-config') { const clientId=document.getElementById('microsoft-client-id').value.trim();const authority=document.getElementById('microsoft-authority').value.trim().replace(/\/$/,'')||'https://login.microsoftonline.com/common';const redirectUri=document.getElementById('microsoft-redirect-uri').value.trim()||getCurrentRedirectUri();if(!clientId)return toast('Enter the Microsoft application client ID.');localStorage.setItem(MICROSOFT_CONFIG_KEY,JSON.stringify({clientId,authority,redirectUri}));toast('Microsoft configuration saved. Reloading app…');setTimeout(()=>location.reload(),600);return; }
  if (action === 'clear-microsoft-config') { if(await confirmAction('Clear Microsoft configuration?','Microsoft sign-in will be disabled.')){localStorage.removeItem(MICROSOFT_CONFIG_KEY);if(cloudProvider==='onedrive')localStorage.setItem(CLOUD_PROVIDER_KEY,'local');location.reload();}return; }
  if (action === 'sign-in-microsoft') return signInMicrosoft();
  if (action === 'sign-out-microsoft') return signOutMicrosoft();
  if (action === 'sync-onedrive') { setCloudProvider('onedrive');return pushOneDrive({force:false}); }
  if (action === 'pull-onedrive') { setCloudProvider('onedrive');if(await confirmAction('Replace this device with OneDrive data?','Newer unsynchronised local changes may be replaced.'))return pullOneDrive({force:true});return; }
  if (action === 'push-onedrive') { setCloudProvider('onedrive');if(await confirmAction('Replace OneDrive data with this device?','The current device state will become the OneDrive copy.'))return pushOneDrive({force:true});return; }
  if (action === 'save-cloud-config') { const url=document.getElementById('supabase-url').value.trim().replace(/\/$/,'');const key=document.getElementById('supabase-key').value.trim();if(!url||!key)return toast('Enter both the Supabase project URL and publishable key.');localStorage.setItem(CLOUD_CONFIG_KEY,JSON.stringify({url,key}));toast('Cloud configuration saved. Reloading app…');setTimeout(()=>location.reload(),600);return; }
  if (action === 'clear-cloud-config') { if(await confirmAction('Clear cloud configuration?','The app will continue locally.')){localStorage.removeItem(CLOUD_CONFIG_KEY);location.reload();}return; }
  if (action === 'sync-now') { setCloudProvider('supabase');return pushCloud({force:false}); }
  if (action === 'pull-cloud') { setCloudProvider('supabase');if(await confirmAction('Replace this device with cloud data?','Newer local changes may be replaced.'))return pullCloud({force:true});return; }
  if (action === 'push-cloud') { setCloudProvider('supabase');if(await confirmAction('Replace cloud data with this device?','The current device state will become the cloud copy.'))return pushCloud({force:true});return; }
  if (action === 'sign-out') { await cloudClient?.auth.signOut();return; }
  if (action === 'install-app') return requestInstall();
  if (action === 'reset-data') { if(await confirmAction('Reset all local data?','Export a backup first.')){state=defaultState();localStorage.setItem(STORAGE_KEY,JSON.stringify(state));hasLocalState=true;cloudDirty=true;renderCurrentView();}return; }
});

document.addEventListener('change', async event => {
  const el=event.target;
  if (el.matches('[data-day-type-date]')) { const key=el.dataset.dayTypeDate;const existing=state.daily[key];if(existing&&(existing.status!=='not-started'||Object.values(existing.checks||{}).some(Boolean)||existing.evidence||existing.notes)){const ok=await confirmAction('Replace this day’s task?', 'Existing task progress for this day will be cleared.');if(!ok){renderWeek();return;}}state.scheduleOverrides[key]=el.value;if(existing){existing.dayType=el.value;existing.task=buildDailyTask(key,el.value);existing.checks={};existing.status='not-started';existing.result='not-set';existing.evidence='';existing.notes='';}saveState({render:true});return; }
  if (el.matches('[data-daily-check]')) { const record=getDailyRecord(el.dataset.date);record.checks[el.dataset.dailyCheck]=el.checked;if(el.checked&&record.status==='not-started')record.status='in-progress';saveState({render:true});return; }
  if (el.matches('[data-daily-field]')) { const record=getDailyRecord(el.dataset.date);record[el.dataset.dailyField]=['confidence','energy'].includes(el.dataset.dailyField)?Number(el.value):el.value;saveState();return; }
  if (el.matches('[data-az-status]')) { findAZ(el.dataset.azStatus).status=el.value;saveState();return; }
  if (el.matches('[data-az-unit]')) { const module=findAZModule(el.dataset.azUnit,el.dataset.moduleId);const unit=module?.units.find(entry=>entry.id===el.dataset.unitId);if(!unit)return;unit.complete=el.checked;module.complete=module.units.every(entry=>entry.complete);const next=module.units.find(entry=>!entry.complete);module.currentUnit=next?.number||module.units.at(-1)?.number||1;if(module.complete){module.masteryStages.learn.complete=true;module.masteryStages.learn.partial=false;module.masteryStages.learn.date=getNZDateKey();module.evidence.learned=true;}else{module.masteryStages.learn.partial=module.units.some(entry=>entry.complete);}saveState({render:true});return; }
  if (el.matches('[data-az-stage]')) { const module=findAZModule(el.dataset.azStage,el.dataset.moduleId);const stage=module?.masteryStages?.[el.dataset.stageId];if(!stage)return;if(el.dataset.stageId==='learn'&&el.checked&&!module.units.every(unit=>unit.complete)){stage.complete=false;stage.partial=true;toast('Complete every module unit before marking Learn complete.');saveState({render:true});return;}stage.complete=el.checked;stage.partial=false;stage.date=el.checked?(stage.date||getNZDateKey()):'';module.masteryLevel=Math.min(5,AZURE_STAGE_DEFS.filter(([id])=>module.masteryStages[id]?.complete).length);saveState({render:true});return; }
  if (el.matches('[data-az-stage-field]')) { const module=findAZModule(el.dataset.pathId,el.dataset.moduleId);const stage=module?.masteryStages?.[el.dataset.stageId];if(!stage)return;stage[el.dataset.azStageField]=el.dataset.azStageField==='confidence'?Number(el.value):el.value;saveState();return; }
  if (el.matches('[data-dan-status]')) { findDan(el.dataset.danStatus).status=el.value;saveState();return; }
  if (el.matches('[data-dan-rating]')) { const item=findDan(el.dataset.danRating);item.ratings[el.dataset.ratingField]=Number(el.value);item.lastAssessmentResult=getNZDateKey();if(item.status==='not-started')item.status='learning';saveState({render:true});return; }
  if (el.matches('[data-dan-check]')) { const item=findDan(el.dataset.danCheck);item.checkpoints.find(check=>check.id===el.dataset.checkId).complete=el.checked;saveState({render:true});return; }
  if (el.matches('[data-dan-field]')) { const item=findDan(el.dataset.danId);item[el.dataset.danField]=el.value;saveState();return; }
  if (el.matches('[data-kata-status]')) { const item=findKata(el.dataset.kataStatus);item.status=el.value;if(el.value==='sequence-known'){item.sequenceProgress=100;item.sections[0].level=5;}if(el.value==='grading-ready'){item.sections.forEach(section=>{section.level=5;});updateKataProgressFromSections(item);}saveState({render:true});return; }
  if (el.matches('[data-kata-section]')) { const item=findKata(el.dataset.kataSection);const section=item?.sections.find(entry=>entry.id===el.dataset.sectionId);if(!section)return;section.level=Number(el.value);updateKataProgressFromSections(item);saveState({render:true});return; }
  if (el.matches('[data-kata-field]')) { const item=findKata(el.dataset.kataId);item[el.dataset.kataField]=el.value;saveState();return; }
  if (el.matches('[data-roadmap-goal]')) { const goal=findRoadmapGoal(el.dataset.roadmapGoal);if(goal){goal.complete=el.checked;saveState({render:true});}return; }
  if (el.id==='import-file'&&el.files?.[0]){importBackup(el.files[0]);el.value='';return;}
});

document.addEventListener('input', event => {
  const el=event.target;
  if(el.matches('[data-daily-field="notes"],[data-daily-field="evidence"]'))scheduleInputSave(`daily:${el.dataset.date}:${el.dataset.dailyField}`,()=>{getDailyRecord(el.dataset.date)[el.dataset.dailyField]=el.value;saveState();});
  if(el.matches('[data-az-notes]'))scheduleInputSave(`az:${el.dataset.azNotes}`,()=>{findAZ(el.dataset.azNotes).notes=el.value;saveState();});
  if(el.matches('[data-az-module-field]'))scheduleInputSave(`az-module:${el.dataset.moduleId}:${el.dataset.azModuleField}`,()=>{findAZModule(el.dataset.pathId,el.dataset.moduleId)[el.dataset.azModuleField]=el.value;saveState();});
  if(el.matches('[data-az-stage-field="notes"],[data-az-stage-field="evidence"]'))scheduleInputSave(`az-stage:${el.dataset.moduleId}:${el.dataset.stageId}:${el.dataset.azStageField}`,()=>{findAZModule(el.dataset.pathId,el.dataset.moduleId).masteryStages[el.dataset.stageId][el.dataset.azStageField]=el.value;saveState();});
  if(el.matches('[data-dan-notes]'))scheduleInputSave(`dan:${el.dataset.danNotes}`,()=>{findDan(el.dataset.danNotes).notes=el.value;saveState();});
  if(el.matches('[data-dan-field]'))scheduleInputSave(`dan-field:${el.dataset.danId}:${el.dataset.danField}`,()=>{findDan(el.dataset.danId)[el.dataset.danField]=el.value;saveState();});
  if(el.matches('[data-kata-notes]'))scheduleInputSave(`kata:${el.dataset.kataNotes}`,()=>{findKata(el.dataset.kataNotes).notes=el.value;saveState();});
  if(el.matches('[data-kata-field]'))scheduleInputSave(`kata-field:${el.dataset.kataId}:${el.dataset.kataField}`,()=>{findKata(el.dataset.kataId)[el.dataset.kataField]=el.value;saveState();});
  if(el.matches('[data-roadmap-evidence]'))scheduleInputSave(`roadmap:${el.dataset.roadmapEvidence}`,()=>{const goal=findRoadmapGoal(el.dataset.roadmapEvidence);if(goal){goal.evidence=el.value;saveState();}});
});

document.addEventListener('submit', async event => {
  if(event.target.id==='task-completion-form'){event.preventDefault();try{applyTaskCompletion(event.target.dataset.date,new FormData(event.target));document.getElementById('task-completion-dialog').close();saveState({render:true});toast('Task result saved.');}catch(error){toast(error.message);}return;}
  if(event.target.id==='reschedule-form'){event.preventDefault();const sourceKey=event.target.dataset.date;const destinationKey=String(new FormData(event.target).get('date')||'');if(!destinationKey||destinationKey<=sourceKey)return toast('Choose a future date.');const source=getDailyRecord(sourceKey);const destinationExisting=state.daily[destinationKey];if(destinationExisting&&(destinationExisting.status!=='not-started'||Object.values(destinationExisting.checks||{}).some(Boolean)||destinationExisting.evidence))return toast('The destination date already has recorded progress. Choose another date.');state.scheduleOverrides[destinationKey]=source.dayType;const destination=getDailyRecord(destinationKey);destination.dayType=source.dayType;destination.task=structuredClone(source.task);destination.task.id=`${source.task.id}-rescheduled-${destinationKey.replaceAll('-','')}`;destination.checks={};destination.status='not-started';destination.result='not-set';destination.rescheduledFrom=sourceKey;source.status='rescheduled';source.result='rescheduled';source.rescheduledTo=destinationKey;document.getElementById('reschedule-dialog').close();saveState({render:true});toast(`Task moved to ${formatDateKey(destinationKey,{weekday:'long',day:'numeric',month:'short'})}.`);return;}
  if(event.target.id==='azure-lab-form'){event.preventDefault();const data=new FormData(event.target);const [pathId,moduleId]=String(data.get('moduleRef')||'').split('::');const module=findAZModule(pathId,moduleId);if(!module)return toast('Select a valid Azure topic.');const objective=String(data.get('objective')||'').trim();const configuration=String(data.get('configuration')||'').trim();const result=String(data.get('result')||'').trim();if(!objective||!configuration||!result)return toast('Complete the objective, configuration and final result.');const lab={id:crypto.randomUUID(),pathId,moduleId,moduleName:module.name,tool:String(data.get('tool')||'PowerShell'),objective,configuration,failure:String(data.get('failure')||'').trim(),diagnosis:String(data.get('diagnosis')||'').trim(),result,cleanup:String(data.get('cleanup')||'').trim(),commands:String(data.get('commands')||'').trim(),createdAt:new Date().toISOString()};state.azureLabs.push(lab);module.evidence.practised=true;module.evidence.verified=true;if(lab.failure||lab.diagnosis)module.evidence.troubleshot=true;module.masteryStages.perform.partial=false;module.masteryStages.perform.complete=true;module.masteryStages.perform.date=getNZDateKey();module.masteryStages.perform.evidence=`${objective}\n${result}`;module.masteryStages.perform.confidence=Math.max(3,module.masteryStages.perform.confidence||1);module.lastStudied=getNZDateKey();module.nextReview ||= addDays(getNZDateKey(),3);event.target.reset();saveState({render:true});toast('Azure lab journal saved.');return;}
  if(event.target.id==='note-form'){event.preventDefault();const data=new FormData(event.target);const title=String(data.get('title')||'').trim();const body=String(data.get('body')||'').trim();if(!title||!body)return toast('Enter both a title and note.');state.notes.push({id:crypto.randomUUID(),title,body,createdAt:new Date().toISOString()});saveState({render:true});return;}
  if(event.target.id==='review-form'){event.preventDefault();const data=new FormData(event.target);const weekStart=event.target.dataset.weekStart;const review={weekStart,success:String(data.get('success')||'').trim(),difficulty:String(data.get('difficulty')||'').trim(),learned:String(data.get('learned')||'').trim(),adjustment:String(data.get('adjustment')||'').trim(),sleepImpact:data.get('sleepImpact'),rating:Number(data.get('rating')),updatedAt:new Date().toISOString()};const index=state.weeklyReviews.findIndex(entry=>entry.weekStart===weekStart);if(index>=0)state.weeklyReviews[index]=review;else state.weeklyReviews.push(review);saveState({render:true});return;}
  if(event.target.id==='auth-form'){event.preventDefault();await handleAuth(event.target,event.submitter?.value||'sign-in');return;}
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
