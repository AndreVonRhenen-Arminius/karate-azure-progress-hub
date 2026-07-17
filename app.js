const STORAGE_KEY = 'ka_progress_hub_state_v1';
const CLOUD_CONFIG_KEY = 'ka_progress_hub_cloud_config_v1';
const CLOUD_PROVIDER_KEY = 'ka_progress_hub_cloud_provider_v1';
const MICROSOFT_CONFIG_KEY = 'ka_progress_hub_microsoft_config_v1';
const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const MSAL_BROWSER_VERSION = '5.17.0';
const MICROSOFT_GRAPH_BASE = 'https://graph.microsoft.com/v1.0';
const MICROSOFT_GRAPH_SCOPES = ['Files.ReadWrite.AppFolder'];
const ONEDRIVE_STATE_FILE = 'karate-azure-progress-state.json';

const APP_VERSION = '1.9.3';
const STATE_VERSION = 7;
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
  ['azure', 'Microsoft Cloud Study Day'],
  ['karate', 'Karate Training Day'],
  ['rest', 'Rest or Recovery Day'],
  ['azure-review', 'Review Day — Microsoft Cloud'],
  ['karate-review', 'Review Day — Karate'],
  ['weekend-combined', 'Flexible Weekend — Azure, Kata and 3rd Dan']
];

const DEFAULT_WEEKLY_DAY_TYPES = {
  Monday: 'rest',
  Tuesday: 'rest',
  Wednesday: 'rest',
  Thursday: 'rest',
  Friday: 'azure',
  Saturday: 'weekend-combined',
  Sunday: 'weekend-combined'
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
    Monday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-mon-rest', title: 'No scheduled study or karate task', type: 'rest', items: ['Use the day for work, family and recovery'] }] },
    Tuesday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-tue-rest', title: 'No scheduled study or karate task', type: 'rest', items: ['Use the day for work, family and recovery'] }] },
    Wednesday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-wed-rest', title: 'No scheduled study or karate task', type: 'rest', items: ['Use the day for work, family and recovery'] }] },
    Thursday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-thu-rest', title: 'No scheduled study or karate task', type: 'rest', items: ['Use the day for work, family and recovery'] }] },
    Friday: { family: 'Friday-night Microsoft cloud study.', tasks: [{ id: 'legacy-fri-study', title: 'Friday-night Azure study', type: 'azure', items: ['Complete the planned Azure learning task', 'Record evidence and next action'] }] },
    Saturday: { family: 'Flexible weekend programme.', tasks: [{ id: 'legacy-sat-combined', title: 'Azure, kata and 3rd Dan training', type: 'combined', items: ['Complete Azure study', 'Practise Jion kata', 'Train the current 3rd Dan focus'] }] },
    Sunday: { family: 'Flexible weekend programme.', tasks: [{ id: 'legacy-sun-combined', title: 'Azure, kata and 3rd Dan training', type: 'combined', items: ['Complete Azure study', 'Practise Jion kata', 'Train the current 3rd Dan focus'] }] }
  },
  minimum: {
    Monday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-min-mon-rest', title: 'No scheduled task', type: 'rest', items: ['Protect recovery'] }] },
    Tuesday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-min-tue-rest', title: 'No scheduled task', type: 'rest', items: ['Protect recovery'] }] },
    Wednesday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-min-wed-rest', title: 'No scheduled task', type: 'rest', items: ['Protect recovery'] }] },
    Thursday: { family: 'Unscheduled recovery day.', tasks: [{ id: 'legacy-min-thu-rest', title: 'No scheduled task', type: 'rest', items: ['Protect recovery'] }] },
    Friday: { family: 'Reduced Friday-night Azure task.', tasks: [{ id: 'legacy-min-fri-study', title: 'Minimum Azure study task', type: 'azure', items: ['Complete one focused Azure step'] }] },
    Saturday: { family: 'Reduced flexible weekend programme.', tasks: [{ id: 'legacy-min-sat-combined', title: 'Minimum Azure, kata and Dan 3 work', type: 'combined', items: ['Complete one Azure step', 'Complete one Jion performance', 'Complete one Dan 3 correction'] }] },
    Sunday: { family: 'Reduced flexible weekend programme.', tasks: [{ id: 'legacy-min-sun-combined', title: 'Minimum Azure, kata and Dan 3 work', type: 'combined', items: ['Complete one Azure step', 'Complete one Jion performance', 'Complete one Dan 3 correction'] }] }
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


const INTENSIVE_PHASE_DEFS = [
  { id:'az-104', order:1, short:'AZ-104', name:'AZ-104: Microsoft Azure Administrator', months:'1–5', targetDuration:4.5, outcome:'Azure administration foundation', skills:['PowerShell','Azure CLI','Git'] },
  { id:'sc-300', order:2, short:'SC-300', name:'SC-300: Identity and Access Administrator', months:'6–8', targetDuration:3, outcome:'Identity and access administration', skills:['Microsoft Graph','PowerShell','Identity automation'] },
  { id:'md-102', order:3, short:'MD-102', name:'MD-102: Endpoint Administrator', months:'9–12', targetDuration:3.5, outcome:'Endpoint and Intune administration', skills:['Microsoft Graph','Intune automation','PowerShell'] },
  { id:'ms-102', order:4, short:'MS-102', name:'MS-102: Microsoft 365 Administrator', months:'13–15', targetDuration:3, outcome:'Microsoft 365 administration', skills:['Exchange Online','SharePoint Online','Microsoft Teams'] },
  { id:'az-700', order:5, short:'AZ-700', name:'AZ-700: Azure Network Engineer', months:'16–19', targetDuration:3.5, outcome:'Azure networking specialisation', skills:['Azure CLI','PowerShell','Network automation'] },
  { id:'iac', order:6, short:'Bicep + Terraform', name:'Bicep and Terraform practical competency', months:'20–23', targetDuration:3.5, outcome:'Infrastructure-as-code competency', skills:['Bicep','Terraform','Git','CI/CD'] },
  { id:'terraform-004', order:7, short:'Terraform 004', name:'Terraform Associate 004', months:'24', targetDuration:1.25, outcome:'Terraform certification', skills:['Terraform','Git','CI/CD'] },
  { id:'az-305', order:8, short:'AZ-305', name:'AZ-305: Azure Solutions Architect', months:'25–28', targetDuration:3.5, outcome:'Azure solution architecture', skills:['Architecture documentation','Azure design','Cost and resilience'] },
  { id:'sc-500', order:9, short:'SC-500', name:'SC-500: Cloud and infrastructure security', months:'29–32', targetDuration:3.5, outcome:'Cloud infrastructure security', skills:['Security automation','Monitoring','Defender for Cloud'] },
  { id:'consolidation', order:10, short:'Career + B2', name:'Consolidation, German B2 and employment', months:'33–42', targetDuration:4.25, outcome:'Commercial readiness, interviews, renewals and German B2', skills:['Technical German','Interview preparation','Portfolio','Commercial experience'] }
];

const INTENSIVE_STAGE_DEFS = [
  ['foundation','Foundation','Exam structure, prerequisites, tools, plan and baseline assessment.'],
  ['learn','Learn and Understand','Official modules, documentation, structured notes, explanations and knowledge checks.'],
  ['perform','Perform and Build','Guided and independent labs, command-line work, validation, troubleshooting and evidence.'],
  ['test','Test and Diagnose','Scenarios, practical challenges, weak-area correction, reteaching and retesting.'],
  ['exam','Exam and Retention','Timed assessments, final practical checks, portfolio, exam and delayed retention.']
];

const INTENSIVE_SESSION_DEFS = [
  { id:'session-1', label:'Session 1 — Learn and Understand', day:'Friday night', duration:'90–120 minutes', objective:'Learn and explain the next objective', type:'learn' },
  { id:'session-2', label:'Session 2 — Guided Lab', day:'Saturday', duration:'Flexible weekend block', objective:'Complete a guided practical lab and validate it', type:'guided-lab' },
  { id:'session-3', label:'Session 3 — Independent Lab', day:'Saturday', duration:'Flexible weekend block', objective:'Repeat the task independently and troubleshoot errors', type:'independent-lab' },
  { id:'session-4', label:'Session 4 — Test and Review', day:'Sunday', duration:'Flexible weekend block', objective:'Complete active recall, scenarios and weak-area correction', type:'test-review' },
  { id:'session-5', label:'Session 5 — Portfolio and Automation', day:'Sunday', duration:'Flexible weekend block', objective:'Document, automate and publish evidence from the same objective', type:'portfolio' }
];

const CONTINUOUS_SKILL_DEFS = [
  ['powershell','PowerShell'], ['graph','Microsoft Graph'], ['azure-cli','Azure CLI'], ['git','Git'], ['cicd','CI/CD'],
  ['exchange','Exchange Online'], ['sharepoint','SharePoint Online'], ['teams','Microsoft Teams'], ['linux','Linux fundamentals'], ['german','German to B2']
];

const COMPLETION_STANDARD_DEFS = [
  'AZ-104 certified','SC-300 certified','MD-102 certified','MS-102 completed','AZ-700 certified','Bicep practical competency',
  'Terraform practical competency','Terraform Associate 004 certified','AZ-305 certified','SC-500 certified','PowerShell practical competency',
  'Microsoft Graph practical competency','Azure CLI practical competency','Git and CI/CD practical competency','Exchange Online practical competency',
  'SharePoint Online practical competency','Microsoft Teams practical competency','Linux fundamentals completed','German B2 achieved',
  'Portfolio projects completed','Independent troubleshooting demonstrated','Commercial Azure or Microsoft 365 experience developed'
];

const CAREER_MILESTONES = [
  { id:'after-az104', label:'After AZ-104', roles:['Junior Azure Administrator','Azure Support Engineer','Cloud Support Engineer','Infrastructure Support Engineer','Junior Cloud Engineer'] },
  { id:'after-sc300', label:'After AZ-104 and SC-300', roles:['Junior Identity Administrator','Entra ID Administrator','IAM Support Engineer','Microsoft Cloud Administrator'] },
  { id:'after-ms102', label:'After MD-102 and MS-102', roles:['Microsoft 365 Administrator','Endpoint Administrator','Intune Administrator','Modern Workplace Engineer','Microsoft 365 Support Engineer'] },
  { id:'after-terraform', label:'After AZ-700 and Terraform', roles:['Azure Cloud Engineer','Cloud Infrastructure Engineer','Azure Network Engineer','Cloud Automation Engineer','Microsoft Cloud Consultant'] },
  { id:'after-sc500', label:'After AZ-305 and SC-500', roles:['Senior Cloud Engineer','Azure Infrastructure Consultant','Cloud Security Engineer','Azure Solutions Architect','Microsoft Cloud Infrastructure Architect'] }
];

const OLD_V18_WEEKLY_DAY_TYPES = {
  Monday:'karate', Tuesday:'azure', Wednesday:'rest', Thursday:'karate', Friday:'azure', Saturday:'karate-review', Sunday:'azure'
};

const OLD_V19_WEEKLY_DAY_TYPES = {
  Monday:'azure', Tuesday:'karate', Wednesday:'azure', Thursday:'karate', Friday:'azure', Saturday:'karate', Sunday:'azure'
};

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


function addMonthsKey(key, count) {
  const date = parseDateKey(key);
  date.setDate(1);
  date.setMonth(date.getMonth() + Number(count || 0));
  return calendarDateKey(date);
}

function monthKeyForDate(key = getNZDateKey()) {
  return String(key).slice(0, 7);
}

function programmePhaseForMonth(monthNumber) {
  const n = Number(monthNumber || 1);
  if (n <= 5) return INTENSIVE_PHASE_DEFS[0];
  if (n <= 8) return INTENSIVE_PHASE_DEFS[1];
  if (n <= 12) return INTENSIVE_PHASE_DEFS[2];
  if (n <= 15) return INTENSIVE_PHASE_DEFS[3];
  if (n <= 19) return INTENSIVE_PHASE_DEFS[4];
  if (n <= 23) return INTENSIVE_PHASE_DEFS[5];
  if (n === 24) return INTENSIVE_PHASE_DEFS[6];
  if (n <= 28) return INTENSIVE_PHASE_DEFS[7];
  if (n <= 32) return INTENSIVE_PHASE_DEFS[8];
  return INTENSIVE_PHASE_DEFS[9];
}

function phaseMonthPosition(phase, monthNumber) {
  const range = String(phase.months).split('–').map(Number);
  const start = range[0] || Number(monthNumber || 1);
  const end = range[1] || start;
  return { position: Math.max(1, Number(monthNumber) - start + 1), length: Math.max(1, end - start + 1) };
}

function stageForProgrammeMonth(phase, monthNumber) {
  const { position, length } = phaseMonthPosition(phase, monthNumber);
  if (length === 1) return ['integrated','Foundation → Exam and Retention','Complete all five stages in one concentrated certification month.'];
  if (length === 2) return position === 1
    ? ['foundation-learn','Foundation + Learn and Understand','Set up the phase and complete the core learning.']
    : ['perform-test-exam','Perform, Test, Exam and Retention','Build, diagnose, pass the exam gate and schedule retention.'];
  if (length === 3) return position === 1
    ? ['foundation-learn','Foundation + Learn and Understand','Set up the phase and complete core objectives.']
    : position === 2
      ? INTENSIVE_STAGE_DEFS[2]
      : ['test-exam','Test, Diagnose, Exam and Retention','Resolve weak areas, meet the booking gate and retain the knowledge.'];
  if (length === 4) return position === 1 ? INTENSIVE_STAGE_DEFS[0] : position === 2 ? INTENSIVE_STAGE_DEFS[1] : position === 3 ? INTENSIVE_STAGE_DEFS[2] : ['test-exam','Test, Diagnose, Exam and Retention','Complete the final assessment, exam and retention work.'];
  const ratio = position / length;
  if (position === 1) return INTENSIVE_STAGE_DEFS[0];
  if (ratio <= 0.4) return INTENSIVE_STAGE_DEFS[1];
  if (ratio <= 0.7) return INTENSIVE_STAGE_DEFS[2];
  if (ratio < 1) return INTENSIVE_STAGE_DEFS[3];
  return INTENSIVE_STAGE_DEFS[4];
}

function defaultProgrammeSession(def, phase) {
  return {
    id:def.id, label:def.label, day:def.day, type:def.type, plannedDuration:def.duration,
    topic:`${phase.short}: ${def.objective}`, officialModule:'', documentation:'', terminology:'', concepts:'', examObjectives:'', teachBack:false,
    lab:'', objective:'', resources:'', possibleCost:'', portalTasks:'', powershellTasks:'', cliTasks:'',
    challenge:'', instructionsAllowed:'Requirements and official documentation only', commandsUsed:'', problems:'', troubleshooting:'', independentResult:'',
    topicsTested:'', questionTypes:'', practiceScore:'', practicalResult:'', weakAreas:'', corrections:'', retestResult:'', retentionDate:'',
    project:'', milestone:'', automationTool:phase.skills[0] || '', scriptDeployment:'', gitActivity:'',
    evidence:'', durationHours:0, confidence:3, status:'not-started', validation:'', cleanup:'', score:''
  };
}

function defaultIntensiveWeekPlan(monthId, weekIndex, phase, stage) {
  return {
    id:`${monthId}-week-${weekIndex + 1}`,
    label:`Week ${weekIndex + 1}`,
    mainOutcome:`${phase.short} — ${stage[1]}: ${INTENSIVE_SESSION_DEFS[Math.min(weekIndex, 4)].objective}.`,
    technicalTarget:10,
    germanTarget:2.5,
    status:'not-started',
    evidence:''
  };
}

function defaultIntensiveMonth(startDate, index) {
  const monthStart = addMonthsKey(`${String(startDate).slice(0, 7)}-01`, index);
  const monthNumber = index + 1;
  const phase = programmePhaseForMonth(monthNumber);
  const stage = stageForProgrammeMonth(phase, monthNumber);
  const label = new Intl.DateTimeFormat('en-NZ', { month:'long', year:'numeric' }).format(parseDateKey(monthStart));
  const id = `intensive-month-${monthStart}`;
  return {
    id, monthNumber, monthStart, label, phaseId:phase.id, stageId:stage[0], stageLabel:stage[1], startingProgress:0, targetEndingProgress:Math.min(100, Math.round((phaseMonthPosition(phase, monthNumber).position / phaseMonthPosition(phase, monthNumber).length) * 100)),
    targetExamDate:'', primaryOutcome:`${phase.outcome}: complete the ${stage[1].toLowerCase()} outcomes without reducing lab or evidence requirements.`,
    goals:{
      knowledge:{ text:`Complete one substantial ${phase.short} objective group and explain the key concepts.`, complete:false, evidence:'' },
      labs:{ target:6, actual:0, complete:false, evidence:'' },
      independent:{ target:2, actual:0, complete:false, evidence:'' },
      assessments:{ target:2, actual:0, targetScore:80, complete:false, evidence:'' },
      weakAreas:{ target:3, actual:0, complete:false, evidence:'' },
      portfolio:{ text:`Complete one meaningful ${phase.short} portfolio milestone.`, progress:0, complete:false, evidence:'' },
      automation:{ text:`Create or improve one ${phase.skills[0] || 'automation'} script, deployment or documented workflow.`, complete:false, evidence:'' },
      german:{ targetHours:10, actualHours:0, complete:false, evidence:'', topic:`Technical German vocabulary related to ${phase.short}.` }
    },
    plan:{
      officialModules:'', documentationTopics:'', conceptsToExplain:'', examObjectives:'',
      guidedLabs:'', independentLabs:'', troubleshootingTasks:'', resourcesToDeploy:'', validationRequirements:'', cleanupRequirements:'',
      knowledgeQuizzes:'', scenarioAssessments:'', practicalChallenges:'', targetScores:'80% or higher', weakAreasToResolve:'',
      portfolioMilestone:`Complete one ${phase.short} portfolio milestone.`, powershellTask:'', azureCliTask:'', graphTask:'', iacTask:'', gitCicdTask:'',
      germanLevel:'A0/A1', vocabularyTarget:'', grammarTarget:'', listeningHours:2, speakingHours:1, readingTasks:'', writingTasks:'', technicalGermanTopic:`${phase.short} technical vocabulary`
    },
    review:{ plannedProgress:0, actualProgress:0, labsCompleted:0, independentPassed:0, assessmentResults:'', portfolioProgress:0, germanHours:0, weakAreas:'', scheduleStatus:'On Intensive Target', carryOver:'', nextPriority:'' },
    weeks:Array.from({length:5}, (_, weekIndex) => defaultIntensiveWeekPlan(id, weekIndex, phase, stage))
  };
}

function defaultIntensiveProgramme(startDate = PROGRAMME_START_DATE) {
  return {
    targetMonths:36,
    targetRangeMin:30,
    targetRangeMax:42,
    weeklyTechnicalTarget:10,
    weeklyGermanTarget:2.5,
    weeklyTotalTarget:12.5,
    maximumWeeklyHours:16,
    maximumTechnicalSessionHours:3,
    recoveryFrequencyWeeks:7,
    activePhaseId:'az-104',
    careerProfile:'Microsoft Cloud Infrastructure and Modern Workplace Engineer specialising in Azure, Microsoft Entra ID, Intune, Microsoft 365, Azure networking, automation, infrastructure as code and cloud security',
    phases:INTENSIVE_PHASE_DEFS.map((phase, index) => ({
      ...phase, status:index === 0 ? 'active' : 'not-started', progress:0, currentObjective:index === 0 ? 'Deploy Azure infrastructure by using JSON ARM templates' : phase.outcome,
      examDate:'', examPassed:false, objectivesStudied:false, labsCompletePercent:0, independentReady:false, criticalWeakAreas:0,
      practiceScores:'', portfolioPercent:0, retentionPassed:false, notes:''
    })),
    skills:CONTINUOUS_SKILL_DEFS.map(([id, name]) => ({ id, name, progress:0, evidence:'', lastPractised:'' })),
    months:Array.from({length:42}, (_, index) => defaultIntensiveMonth(startDate, index)),
    weeks:{},
    completionStandards:COMPLETION_STANDARD_DEFS.map((text, index) => ({ id:`standard-${index + 1}`, text, complete:false, evidence:'' }))
  };
}

function mergeIntensiveProgramme(base, saved) {
  if (!saved || typeof saved !== 'object') return base;
  const phaseMap = new Map((saved.phases || []).map(item => [item.id, item]));
  const skillMap = new Map((saved.skills || []).map(item => [item.id, item]));
  const standardMap = new Map((saved.completionStandards || []).map(item => [item.id, item]));
  const monthMap = new Map((saved.months || []).map(item => [item.id, item]));
  return {
    ...base,
    ...saved,
    phases:base.phases.map(item => ({ ...item, ...(phaseMap.get(item.id) || {}) })),
    skills:base.skills.map(item => ({ ...item, ...(skillMap.get(item.id) || {}) })),
    completionStandards:base.completionStandards.map(item => ({ ...item, ...(standardMap.get(item.id) || {}) })),
    weeks:{ ...base.weeks, ...(saved.weeks || {}) },
    months:base.months.map(month => {
      const stored = monthMap.get(month.id) || {};
      const storedWeeks = new Map((stored.weeks || []).map(week => [week.id, week]));
      return {
        ...month,
        ...stored,
        goals:{
          knowledge:{...month.goals.knowledge, ...(stored.goals?.knowledge || {})},
          labs:{...month.goals.labs, ...(stored.goals?.labs || {})},
          independent:{...month.goals.independent, ...(stored.goals?.independent || {})},
          assessments:{...month.goals.assessments, ...(stored.goals?.assessments || {})},
          weakAreas:{...month.goals.weakAreas, ...(stored.goals?.weakAreas || {})},
          portfolio:{...month.goals.portfolio, ...(stored.goals?.portfolio || {})},
          automation:{...month.goals.automation, ...(stored.goals?.automation || {})},
          german:{...month.goals.german, ...(stored.goals?.german || {})}
        },
        plan:{...month.plan, ...(stored.plan || {})},
        review:{...month.review, ...(stored.review || {})},
        weeks:month.weeks.map(week => ({...week, ...(storedWeeks.get(week.id) || {})}))
      };
    })
  };
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
      scheduleTemplateVersion: 2,
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
    intensiveProgramme: defaultIntensiveProgramme(PROGRAMME_START_DATE),
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
      concentration: 3,
      enjoyment: 3,
      stress: 3,
      technicalMinutes: 0,
      germanMinutes: 0,
      portfolioMinutes: 0,
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
  merged.intensiveProgramme = mergeIntensiveProgramme(base.intensiveProgramme, saved.intensiveProgramme);
  merged.notes = Array.isArray(saved.notes) ? saved.notes : [];
  merged.weeklyReviews = Array.isArray(saved.weeklyReviews) ? saved.weeklyReviews : [];
  if (!['normal', 'minimum'].includes(merged.settings.programmeMode)) merged.settings.programmeMode = 'normal';

  if (Number(saved.version || 1) < 7) {
    merged.settings.scheduleTemplateVersion = 2;
    merged.settings.weeklyDayTypes = { ...DEFAULT_WEEKLY_DAY_TYPES };
    const todayKey = getNZDateKey();
    for (const key of Object.keys(merged.scheduleOverrides)) {
      if (key < todayKey) continue;
      const record = merged.daily[key];
      const hasProgress = record && (record.status !== 'not-started' || Object.values(record.checks || {}).some(Boolean) || Boolean(record.evidence || record.notes || record.startedAt || record.completedAt));
      if (!hasProgress) delete merged.scheduleOverrides[key];
    }
    for (const [key, record] of Object.entries(merged.daily)) {
      if (key < todayKey) continue;
      const hasProgress = record.status !== 'not-started' || Object.values(record.checks || {}).some(Boolean) || Boolean(record.evidence || record.notes || record.startedAt || record.completedAt);
      if (hasProgress) continue;
      record.dayType = DEFAULT_WEEKLY_DAY_TYPES[getDayName(key)] || 'rest';
      record.task = null;
      record.checks = {};
      record.status = 'not-started';
      record.result = 'not-set';
    }
  }

  if (Number(saved.version || 1) < 6) {
    const savedTypes = saved.settings?.weeklyDayTypes;
    const usedOldDefaults = !savedTypes || Object.keys(OLD_V18_WEEKLY_DAY_TYPES).every(day => savedTypes[day] === OLD_V18_WEEKLY_DAY_TYPES[day]);
    if (usedOldDefaults) merged.settings.weeklyDayTypes = { ...DEFAULT_WEEKLY_DAY_TYPES };
  }

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
let weeklyPlanStartKey = getNZDateKey();
let lastKnownTodayKey = weeklyPlanStartKey;
let timerDuration = 45 * 60;
let timerRemaining = timerDuration;
let timerInterval = null;
let timerRunning = false;
let timerEndAt = null;

const pageTitles = {
  today: ['YOUR PLAN', 'Today'],
  week: ['ROLLING 7-DAY PLAN', 'Weekly Plan'],
  azure: ['CERTIFICATION STUDY', 'AZ-104'],
  dan: ['JKA SYLLABUS', '3rd Dan Preparation'],
  kata: ['SEQUENCE & RETENTION', 'Kata Library'],
  programme: ['30–42 MONTH INTENSIVE PLAN', 'Cloud Study Programme'],
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

function calendarDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function addDays(key, count) {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + count);
  return calendarDateKey(date);
}

function getWeekStart(key = getNZDateKey()) {
  const date = parseDateKey(key);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return calendarDateKey(date);
}

function getRollingPlanDates(startKey = weeklyPlanStartKey) {
  return Array.from({ length: 7 }, (_, index) => addDays(startKey, index));
}

function syncDateContext(currentTodayKey = getNZDateKey()) {
  if (currentTodayKey === lastKnownTodayKey) return false;
  const previousTodayKey = lastKnownTodayKey;
  const weeklyPlanWasFollowingToday = weeklyPlanStartKey === previousTodayKey;
  const selectedDayWasToday = selectedDateKey === previousTodayKey;
  lastKnownTodayKey = currentTodayKey;
  if (weeklyPlanWasFollowingToday) weeklyPlanStartKey = currentTodayKey;
  if (selectedDayWasToday) selectedDateKey = currentTodayKey;
  return true;
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
  if (dayType === 'weekend-combined') return 'combined';
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
    concentration: 3,
    enjoyment: 3,
    stress: 3,
    technicalMinutes: 0,
    germanMinutes: 0,
    portfolioMinutes: 0,
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


function activeProgrammePhase() {
  const programme = state.intensiveProgramme || defaultIntensiveProgramme(state.settings.programmeStartDate || PROGRAMME_START_DATE);
  return programme.phases.find(phase => phase.id === programme.activePhaseId)
    || programme.phases.find(phase => phase.status === 'active')
    || programme.phases[0];
}

function studySessionForDate(key) {
  const day = getDayName(key);
  if (day === 'Friday') return INTENSIVE_SESSION_DEFS[0];
  if (day === 'Saturday') return { ...INTENSIVE_SESSION_DEFS[1], id:'session-2-3', label:'Sessions 2 and 3 — Guided and Independent Labs', duration:'Flexible across Saturday', objective:'Complete guided practice, then repeat the same objective independently' };
  if (day === 'Sunday') return { ...INTENSIVE_SESSION_DEFS[3], id:'session-4-5', label:'Sessions 4 and 5 — Test, Review, Portfolio and Automation', duration:'Flexible across Sunday', objective:'Validate, correct and publish this week’s work' };
  return INTENSIVE_SESSION_DEFS[0];
}

function phaseTopic(phase = activeProgrammePhase()) {
  if (phase?.id === 'az-104') {
    const module = currentAzureModule();
    const unit = currentAzureUnit(module);
    return unit?.name || module?.name || phase.currentObjective;
  }
  return phase?.currentObjective || phase?.outcome || 'Current certification objective';
}

function studyChecklist(session, phase, topic) {
  const common = [
    `Keep the main objective limited to ${topic}`,
    `Use ${phase.skills.slice(0,2).join(' and ') || 'the phase tools'} where relevant`,
    'Validate the result and capture evidence',
    'Record questions, weak areas and the next action'
  ];
  if (session.type === 'learn') return ['Complete the official learning material and relevant documentation','Write structured notes and key terminology','Explain the concepts without copying the source','Complete a short knowledge check',...common];
  if (session.type === 'guided-lab') return ['Review possible charges and prerequisites','Complete the guided portal or command-line lab','Validate each major configuration','Troubleshoot at least one issue or explain what would fail','Clean up chargeable resources',...common];
  if (session.type === 'independent-lab') return ['Build from requirements without step-by-step instructions','Use PowerShell, Azure CLI, Graph, Bicep or Terraform where relevant','Diagnose errors independently','Prove the final result with commands or screenshots','Clean up resources and document the solution',...common];
  return ['Complete scenario questions or a practical challenge','Explain commands and decisions without notes','Correct and retest weak areas','Update the portfolio or automation evidence from the same objective','Commit documentation or code to Git where appropriate','Schedule the next retention review',...common];
}

function defaultIntensiveWeekRecord(weekStart = getWeekStart()) {
  const phase = activeProgrammePhase();
  return {
    weekStart,
    activePhaseId:phase.id,
    stageId:'learn',
    startingProgress:Number(phase.progress || 0),
    targetProgress:Math.min(100, Number(phase.progress || 0) + 4),
    mainOutcome:`Advance ${phase.short} through evidence-based learning, labs, testing and portfolio work.`,
    technicalTarget:Number(state.intensiveProgramme?.weeklyTechnicalTarget || 10),
    germanTarget:Number(state.intensiveProgramme?.weeklyGermanTarget || 2.5),
    recoveryWeek:false,
    temporarilyReduced:false,
    sessions:Object.fromEntries(INTENSIVE_SESSION_DEFS.map(def => [def.id, defaultProgrammeSession(def, phase)])),
    german:{ currentLevel:'A0/A1', daysCompleted:0, vocabularySessions:0, grammarSessions:0, listeningMinutes:0, speakingMinutes:0, readingMinutes:0, writingTasks:0, technicalGerman:'', additionalMinutes:0, dailyMinutes:{} },
    labsCompleted:0,
    assessmentsCompleted:0,
    portfolioHours:0,
    independentTasksPassed:0,
    weakAreaCount:0,
    knowledgeCompleted:'',
    assessmentResult:'',
    portfolioProgress:'',
    strongAreas:'',
    weakAreas:'',
    blockedItems:'',
    carryOver:'',
    nextPriority:'',
    scheduleStatus:'On Intensive Target',
    quality:{ energy:3, concentration:3, enjoyment:3, sleepImpact:1, familyImpact:1, confidence:3, stress:3, rushingLabs:false },
    updatedAt:''
  };
}

function getIntensiveWeek(weekStart = getWeekStart(), { create = true } = {}) {
  const programme = state.intensiveProgramme;
  const base = defaultIntensiveWeekRecord(weekStart);
  const saved = programme.weeks?.[weekStart];
  const merged = saved ? {
    ...base, ...saved,
    sessions:Object.fromEntries(INTENSIVE_SESSION_DEFS.map(def => [def.id, { ...base.sessions[def.id], ...(saved.sessions?.[def.id] || {}) }])),
    german:{...base.german, ...(saved.german || {}), dailyMinutes:{...base.german.dailyMinutes, ...(saved.german?.dailyMinutes || {})}},
    quality:{...base.quality, ...(saved.quality || {})}
  } : base;
  if (create && !saved) programme.weeks[weekStart] = merged;
  return merged;
}

function getWeekIntensityMetrics(weekStart = getWeekStart()) {
  const week = getIntensiveWeek(weekStart, {create:false});
  const technicalHours = Object.values(week.sessions || {}).reduce((sum, session) => sum + Number(session.durationHours || 0), 0);
  const loggedGermanMinutes = Object.values(week.german?.dailyMinutes || {}).reduce((sum, value) => sum + Number(value || 0), 0) + Number(week.german?.additionalMinutes || 0);
  const detailedGermanMinutes = Number(week.german?.listeningMinutes || 0) + Number(week.german?.speakingMinutes || 0) + Number(week.german?.readingMinutes || 0);
  const germanMinutes = Math.max(loggedGermanMinutes, detailedGermanMinutes);
  const germanHours = germanMinutes / 60;
  const germanDays = Math.max(Number(week.german?.daysCompleted || 0), Object.values(week.german?.dailyMinutes || {}).filter(value => Number(value || 0) > 0).length);
  const completedSessions = Object.values(week.sessions || {}).filter(session => session.status === 'completed').length;
  return { week, technicalHours, germanHours, germanDays, completedSessions, totalHours:technicalHours + germanHours };
}

function getProgrammePhaseProgress(phase) {
  const manual = Number(phase?.progress || 0);
  if (phase?.id !== 'az-104') return Math.max(0, Math.min(100, manual));
  const modules = getAllAzureModules();
  const units = modules.flatMap(({module}) => module.units || []);
  const content = percent(units.filter(unit => unit.complete).length, units.length);
  const stages = modules.flatMap(({module}) => AZURE_STAGE_DEFS.map(([id]) => module.masteryStages?.[id]));
  const mastery = percent(stages.filter(stage => stage?.complete).length, stages.length);
  return Math.max(manual, Math.round(content * 0.45 + mastery * 0.55));
}

function overallProgrammeProgress() {
  const phases = state.intensiveProgramme?.phases || [];
  const totalWeight = phases.reduce((sum, phase) => sum + Number(phase.targetDuration || 0), 0) || 1;
  const achieved = phases.reduce((sum, phase) => sum + Number(phase.targetDuration || 0) * getProgrammePhaseProgress(phase) / 100, 0);
  return Math.round(achieved / totalWeight * 100);
}

function monthsBetween(startKey, endKey) {
  const start = parseDateKey(startKey);
  const end = parseDateKey(endKey);
  return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + (end.getDate() - start.getDate()) / 30);
}

function programmeForecast() {
  const programme = state.intensiveProgramme;
  const start = state.settings.programmeStartDate || PROGRAMME_START_DATE;
  const originalEnd = addMonthsKey(start, Number(programme.targetMonths || 36));
  const progress = overallProgrammeProgress();
  const elapsed = Math.max(0.1, monthsBetween(start, getNZDateKey()));
  const savedWeeks = Object.keys(programme.weeks || {}).length;
  let forecastMonths = Number(programme.targetMonths || 36);
  let reason = 'Not enough completed weekly history yet; using the 36-month intensive target.';
  if (savedWeeks >= 2 && progress > 0) {
    forecastMonths = Math.max(elapsed, elapsed / (progress / 100));
    reason = 'Forecast uses weighted phase progress and the pace recorded in completed weeks.';
  }
  const forecastEnd = addMonthsKey(start, Math.ceil(forecastMonths));
  const remainingWeeksToTarget = Math.max(1, monthsBetween(getNZDateKey(), originalEnd) * 4.345);
  const requiredWeeklyPace = Math.max(0, (100 - progress) / remainingWeeksToTarget);
  return { progress, originalEnd, forecastEnd, differenceMonths:Math.round(forecastMonths - Number(programme.targetMonths || 36)), reason, requiredWeeklyPace };
}

function recoveryWeekDue() {
  const weeks = Object.values(state.intensiveProgramme?.weeks || {}).sort((a,b) => a.weekStart.localeCompare(b.weekStart));
  let consecutive = 0;
  for (let index = weeks.length - 1; index >= 0; index -= 1) {
    if (weeks[index].recoveryWeek) break;
    const metrics = getWeekIntensityMetrics(weeks[index].weekStart);
    if (metrics.technicalHours > 0 || metrics.germanHours > 0) consecutive += 1;
  }
  return { due:consecutive >= Number(state.intensiveProgramme?.recoveryFrequencyWeeks || 7), consecutive };
}

function programmeWarnings() {
  const weeks = Object.values(state.intensiveProgramme?.weeks || {}).sort((a,b) => b.weekStart.localeCompare(a.weekStart));
  const metrics = weeks.map(week => ({ week, ...getWeekIntensityMetrics(week.weekStart) }));
  const warnings = [];
  if (metrics.length >= 2 && metrics.slice(0,2).every(item => item.technicalHours < 8 && !item.week.recoveryWeek)) warnings.push('Fewer than 8 technical hours were completed for two consecutive weeks.');
  if (metrics.length >= 2 && metrics.slice(0,2).every(item => Number(item.week.labsCompleted || 0) === 0 && !item.week.recoveryWeek)) warnings.push('No practical lab was completed for two consecutive weeks.');
  if (metrics.length >= 3 && metrics.slice(0,3).every(item => Number(item.week.assessmentsCompleted || 0) === 0 && !item.week.recoveryWeek)) warnings.push('No assessment was completed for three consecutive weeks.');
  if (metrics.length >= 3 && metrics[0].week.weakAreaCount > metrics[1].week.weakAreaCount && metrics[1].week.weakAreaCount > metrics[2].week.weakAreaCount) warnings.push('The weak-area count increased for three consecutive weeks.');
  if (metrics.length >= 2 && metrics.slice(0,2).every(item => item.germanHours < 1.5)) warnings.push('German study was below 90 minutes for two consecutive weeks.');
  if (metrics.length >= 2 && metrics.slice(0,2).every(item => Number(item.week.quality?.energy || 3) <= 2)) warnings.push('Energy was rated 1 or 2 for two consecutive weeks.');
  if (metrics.some(item => item.totalHours > Number(state.intensiveProgramme?.maximumWeeklyHours || 16))) warnings.push('A recorded week exceeded the normal 16-hour sustainability limit.');
  if (metrics.some(item => Object.values(item.week.sessions || {}).some(session => Number(session.durationHours || 0) > Number(state.intensiveProgramme?.maximumTechnicalSessionHours || 3)))) warnings.push('A technical session exceeded the normal three-hour uninterrupted limit.');
  return warnings;
}

function weekRequiresReduction(week, metrics = null) {
  const calculated = metrics || getWeekIntensityMetrics(week.weekStart);
  const q = week.quality || {};
  const hasActivity = calculated.technicalHours > 0 || calculated.germanHours > 0 || Object.values(week.sessions || {}).some(session => session.status !== 'not-started');
  const moreThanHalfIncomplete = hasActivity && calculated.completedSessions < 3;
  return Number(q.energy || 3) <= 2 || Number(q.concentration || 3) <= 2 || Number(q.sleepImpact || 1) >= 4 || Number(q.familyImpact || 1) >= 4 || moreThanHalfIncomplete || Boolean(q.rushingLabs);
}

function nextWeekReductionRecommended(weekStart = getWeekStart()) {
  const metrics = getWeekIntensityMetrics(weekStart);
  return weekRequiresReduction(metrics.week, metrics);
}

function programmePaceStatus(weekStart = getWeekStart()) {
  const metrics = getWeekIntensityMetrics(weekStart);
  if (metrics.week.recoveryWeek) return 'Recovery Week';
  if (metrics.week.temporarilyReduced) return 'Temporarily Reduced';
  const weekdayOrder = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const expected = (weekdayOrder.indexOf(getDayName(getNZDateKey())) + 1) / 7;
  const techRatio = metrics.technicalHours / Math.max(1, Number(metrics.week.technicalTarget || 10));
  const germanRatio = metrics.germanHours / Math.max(0.5, Number(metrics.week.germanTarget || 2.5));
  const ratio = Math.min(techRatio, germanRatio);
  if (ratio >= Math.max(1, expected + 0.15)) return 'Accelerated';
  if (ratio >= Math.max(0.75, expected - 0.1)) return 'On Intensive Target';
  if (ratio >= Math.max(0.5, expected - 0.25)) return 'Slightly Below Intensive Target';
  if (metrics.technicalHours === 0 && expected < 0.25) return 'On Intensive Target';
  return 'Behind';
}

function examReadiness(phase = activeProgrammePhase()) {
  const scores = String(phase.practiceScores || '').split(/[;,\s]+/).map(Number).filter(value => Number.isFinite(value) && value >= 0 && value <= 100).slice(-3);
  const average = scores.length ? scores.reduce((a,b) => a+b,0) / scores.length : 0;
  let score = 0;
  if (phase.objectivesStudied) score += 20;
  score += Math.min(20, Number(phase.labsCompletePercent || 0) * 0.2);
  if (phase.independentReady) score += 15;
  if (Number(phase.criticalWeakAreas || 0) === 0) score += 15;
  score += Math.min(15, average * 0.15);
  score += Math.min(10, Number(phase.portfolioPercent || 0) * 0.1);
  if (phase.retentionPassed) score += 5;
  score = Math.round(score);
  const category = score < 60 ? 'Continue learning and labs' : score < 70 ? 'Major gaps remain' : score < 80 ? 'Nearly ready — targeted review required' : score < 90 ? 'Ready to book' : 'Strong readiness';
  const eligible = Boolean(phase.objectivesStudied && Number(phase.labsCompletePercent || 0) >= 80 && phase.independentReady && Number(phase.criticalWeakAreas || 0) === 0 && scores.length >= 3 && scores.every(value => value >= 80) && Number(phase.portfolioPercent || 0) >= 70 && phase.retentionPassed);
  return { score, category, eligible, average:Math.round(average), scores };
}

function renderIntensityDashboard(referenceDate = getNZDateKey()) {
  const weekStart = getWeekStart(referenceDate);
  const metrics = getWeekIntensityMetrics(weekStart);
  const forecast = programmeForecast();
  const recovery = recoveryWeekDue();
  const warnings = programmeWarnings();
  const phase = activeProgrammePhase();
  const readiness = examReadiness(phase);
  const pace = programmePaceStatus(weekStart);
  const reduction = nextWeekReductionRecommended(weekStart);
  return `<div class="section-heading"><div><h2>Intensive programme dashboard</h2><p>${escapeHTML(phase.name)} · 30–42 month evidence-based route</p></div><span class="badge ${pace.includes('Behind') ? 'red' : pace.includes('Below') || reduction ? 'amber' : 'green'}">${escapeHTML(pace)}</span></div>
  <div class="grid four intensity-grid">
    <article class="card metric-card"><span>Technical target</span><strong>${metrics.technicalHours.toFixed(1)} / ${Number(metrics.week.technicalTarget || 10).toFixed(1)} h</strong><small>Minimum intensive week: 8 hours</small></article>
    <article class="card metric-card"><span>German target</span><strong>${metrics.germanHours.toFixed(1)} / ${Number(metrics.week.germanTarget || 2.5).toFixed(1)} h</strong><small>${metrics.germanDays}/5 study days recorded</small></article>
    <article class="card metric-card"><span>Labs and assessment</span><strong>${Number(metrics.week.labsCompleted || 0)} labs · ${Number(metrics.week.assessmentsCompleted || 0)} assessed</strong><small>${Number(metrics.week.portfolioHours || 0).toFixed(1)} portfolio hours</small></article>
    <article class="card metric-card"><span>Recovery week</span><strong>${recovery.due ? 'Due now' : `${recovery.consecutive}/7 intensive weeks`}</strong><small>${recovery.due ? 'Plan a 5–7 hour technical week.' : 'Recovery is part of the programme.'}</small></article>
  </div>
  <div class="grid two" style="margin-top:16px">
    <article class="card"><h3>Completion forecast</h3><p><strong>Original:</strong> ${escapeHTML(formatDateKey(forecast.originalEnd,{month:'long',year:'numeric'}))}</p><p><strong>Current forecast:</strong> ${escapeHTML(formatDateKey(forecast.forecastEnd,{month:'long',year:'numeric'}))} (${forecast.differenceMonths >= 0 ? '+' : ''}${forecast.differenceMonths} months)</p><p><strong>Required weekly pace:</strong> ${forecast.requiredWeeklyPace.toFixed(2)} programme percentage points</p><p class="muted small">${escapeHTML(forecast.reason)}</p></article>
    <article class="card"><h3>Quality and readiness</h3><p><strong>Programme progress:</strong> ${forecast.progress}%</p><p><strong>${escapeHTML(phase.short)} exam readiness:</strong> ${readiness.score}% — ${escapeHTML(readiness.category)}</p><p><strong>Energy / concentration / stress:</strong> ${metrics.week.quality.energy}/5 · ${metrics.week.quality.concentration}/5 · ${metrics.week.quality.stress}/5</p><p class="${reduction ? 'warning-text' : 'muted'}">${reduction ? 'Reduce next week by 20–30% and prioritise outstanding work, weak areas, validation and review.' : 'Current quality controls do not require a pace reduction.'}</p></article>
  </div>${reduction ? `<div class="form-actions"><button class="secondary-btn" data-action="apply-reduced-next-week">Apply a 25% reduced target next week</button></div>` : ''}${recovery.due ? `<div class="form-actions"><button class="secondary-btn" data-action="schedule-recovery-next-week">Schedule next week as recovery</button></div>` : ''}${warnings.length ? `<article class="card warning-panel"><h3>Programme warnings</h3><ul>${warnings.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul></article>` : ''}`;
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
    const phase = activeProgrammePhase();
    const session = studySessionForDate(key);
    const topic = phaseTopic(phase);
    const isArmUnitFive = phase.id === 'az-104' && azureModule?.id === 'az-prerequisites-m4' && Number(unit?.number) === 5;
    const title = isArmUnitFive && getDayName(key) === 'Friday'
      ? 'Learn and prepare ARM-template Unit 5 using PowerShell'
      : `${session.label.replace(/^Session[s]? \d(?: and \d)? — /,'')} — ${phase.short}`;
    return {
      id:`task-${dateToken}-azure`, category:'azure', dayType, title,
      reason:isArmUnitFive ? 'Unit 5 is the next incomplete AZ-104 unit. It must be learned, deployed, validated, failed safely with an invalid value, and cleaned up.' : `${session.objective}. This advances the active ${phase.short} phase while keeping practical evidence and retention requirements intact.`,
      duration:session.duration, priority:'high', section:phase.name,
      learningPath:phase.id === 'az-104' ? (azure?.path?.name || currentAZPath()?.name || '') : `${phase.short} intensive phase`,
      module:phase.id === 'az-104' ? (azureModule?.name || '') : phase.currentObjective,
      unit:phase.id === 'az-104' ? (unit?.name || '') : topic,
      masteryStage:phase.id === 'az-104' ? (currentStage?.[1] || 'Learn') : session.label,
      studySessionId:session.id, supportingSkill:phase.skills.join(' · '), germanTask:'Not scheduled in the Friday Azure task.',
      refs:{ pathId:azure?.path?.id || currentAZPath()?.id || '', moduleId:azureModule?.id || '', unitId:unit?.id || '', phaseId:phase.id },
      checklist:isArmUnitFive ? [
        'Open Unit 5 and review parameters, allowed values and outputs',
        'Complete the PowerShell-based ARM template work',
        'Deploy successfully using an allowed value',
        'Confirm the expected failure using an invalid value',
        'Capture the storage endpoint output',
        'Validate the result and record anything not understood',
        'Clean up all resources created by the exercise',
        'Complete the short supporting-skill task where it supports the Azure objective',
        'Add evidence before marking the task complete'
      ] : studyChecklist(session, phase, topic)
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

  if (dayType === 'weekend-combined') {
    const phase = activeProgrammePhase();
    const session = studySessionForDate(key);
    const topic = phaseTopic(phase);
    const jion = currentKata();
    const day = getDayName(key);
    const isSaturday = day === 'Saturday';
    return {
      id:`task-${dateToken}-weekend`, category:'combined', dayType,
      title:`${day} flexible programme: Azure, Jion kata and 3rd Dan`,
      reason:'Complete all three focus areas when they fit around the day. No clock time or fixed order is assigned; each area must still be recorded separately with evidence.',
      duration:'Flexible across the day — no scheduled time', priority:'high', section:'Azure · Jion kata · 3rd Dan grading',
      learningPath:phase.id === 'az-104' ? (azure?.path?.name || currentAZPath()?.name || '') : `${phase.short} intensive phase`,
      module:phase.id === 'az-104' ? (azureModule?.name || '') : phase.currentObjective,
      unit:phase.id === 'az-104' ? (unit?.name || '') : topic,
      masteryStage:phase.id === 'az-104' ? (currentStage?.[1] || 'Learn') : session.label,
      studySessionId:session.id, supportingSkill:phase.skills.join(' · '), germanTask:`Optional supporting German may be recorded if completed.`,
      kata:jion?.name || 'Jion', gradingFocus:grading?.title || 'Current weakest grading section',
      refs:{ pathId:azure?.path?.id || currentAZPath()?.id || '', moduleId:azureModule?.id || '', unitId:unit?.id || '', phaseId:phase.id, kataId:jion?.id || 'jion', syllabusId:grading?.item?.id || grading?.itemId || '' },
      checklist:isSaturday ? [
        'AZURE — Complete the guided lab for the current objective',
        'AZURE — Repeat the same objective independently and troubleshoot any errors',
        'AZURE — Validate the result, capture evidence and clean up chargeable resources',
        'KATA — Warm up and perform Jion slowly with technical control',
        'KATA — Perform Jion normally or at grading speed and identify one correction',
        '3RD DAN — Practise the current weakest grading section',
        '3RD DAN — Practise both sides and record right- and left-side ratings',
        'EVIDENCE — Record Azure, kata and Dan 3 results before completing the day'
      ] : [
        'AZURE — Complete active recall, scenarios or a practical challenge',
        'AZURE — Correct weak areas and update portfolio or automation evidence',
        'AZURE — Schedule the next retention review and clean up any resources',
        'KATA — Warm up and perform Jion slowly with technical control',
        'KATA — Perform Jion normally or at grading speed and identify one correction',
        '3RD DAN — Practise the current weakest grading section',
        '3RD DAN — Practise both sides and record right- and left-side ratings',
        'EVIDENCE — Record Azure, kata and Dan 3 results before completing the day'
      ]
    };
  }

  if (dayType === 'karate') {
    const jion = currentKata();
    const day = getDayName(key);
    const afterClass = day === 'Tuesday' || day === 'Thursday';
    return {
      id:`task-${dateToken}-karate`, category:'karate', dayType,
      title:afterClass ? 'Post-class Jion and 3rd Dan training' : 'Saturday Jion and 3rd Dan development session',
      reason:`${afterClass ? 'Use the period after the normal karate class' : 'Use Saturday’s dedicated session'} to improve Jion grading readiness and the weakest current 3rd Dan section. Knowing the sequence alone is not grading readiness.`,
      duration:afterClass ? '30–45 minutes after karate class' : '60–90 minutes', priority:'high', section:'Kata and 3rd Dan grading',
      kata:jion?.name || 'Jion', gradingFocus:grading?.title || 'Current weakest grading section',
      refs:{ kataId:jion?.id || 'jion', syllabusId:grading?.item?.id || grading?.itemId || '' },
      checklist:afterClass ? [
        'Reset and hydrate after the normal class',
        'Perform Jion once slowly with technical control',
        'Practise the current grading-section weakness',
        'Practise the weaker side separately',
        'Perform one normal or grading-speed Jion',
        'Record right-side and left-side ratings',
        'Record instructor feedback or one main correction',
        'Add evidence and mark the session result'
      ] : [
        'Warm up and prepare for focused grading work',
        'Perform one slow technical Jion',
        'Perform one normal Jion',
        'Perform one grading-speed Jion',
        'Train the current weakest Kihon or Kumite section',
        'Practise both sides and assess the weaker side',
        'Record video or instructor feedback where available',
        'Set one correction and the next retention date'
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
  const phase = activeProgrammePhase();
  if (phase?.id !== 'az-104') {
    const currentMonth = state.intensiveProgramme?.months?.find(month => month.monthStart.slice(0,7) === monthKeyForDate());
    const stage = INTENSIVE_STAGE_DEFS.find(item => item[0] === currentMonth?.stageId) || INTENSIVE_STAGE_DEFS[1];
    return {
      certification: phase?.name || 'Microsoft Cloud programme',
      path: `Phase ${phase?.order || ''} · Months ${phase?.months || ''}`,
      module: phase?.currentObjective || phase?.outcome || '',
      unit: `Supporting skills: ${(phase?.skills || []).join(', ')}`,
      stage: stage[1],
      weakArea: phase?.criticalWeakAreas ? `${phase.criticalWeakAreas} critical weak area(s) recorded` : 'No critical weak area recorded',
      nextAction: `Complete the next ${studySessionForDate(getNZDateKey()).label.toLowerCase()} task with evidence.`
    };
  }
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
      <span class="focus-kicker azure-text">Cloud study focus</span>
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
    programme: renderProgramme,
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
    document.getElementById('view-today').innerHTML = `${dateNavigation}<article class="card main-task-card rest-task"><span class="task-category">Programme not started</span><h2>${escapeHTML(formatDateKey(key))}</h2><p>The weekly programme begins on ${escapeHTML(formatDateKey(startDate))}.</p></article>${renderFocusSummary(startDate)}`;
    return;
  }

  const taskClass = task.category === 'azure' ? 'azure-outline' : task.category === 'karate' ? 'karate-outline' : task.category === 'combined' ? 'combined-outline' : 'rest-task';
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
      ${task.category === 'azure' ? `<div class="task-context"><span>${escapeHTML(task.learningPath || '')}</span><strong>${escapeHTML(task.module || '')}</strong><span>${escapeHTML(task.unit || '')}</span><span>Stage: ${escapeHTML(task.masteryStage || '')}</span><span>Supporting skill: ${escapeHTML(task.supportingSkill || '')}</span><span>German: ${escapeHTML(task.germanTask || '')}</span></div>` : ''}
      ${task.category === 'karate' ? `<div class="task-context"><span>Current kata: ${escapeHTML(task.kata || 'Jion')}</span><strong>${escapeHTML(task.gradingFocus || 'Jion technical assessment')}</strong></div>` : ''}
      ${task.category === 'combined' ? `<div class="weekend-focus-grid"><div><span>Azure</span><strong>${escapeHTML(task.module || 'Current cloud objective')}</strong><small>${escapeHTML(task.unit || task.masteryStage || '')}</small></div><div><span>Kata</span><strong>${escapeHTML(task.kata || 'Jion')}</strong><small>Sequence quality, grading performance and one correction</small></div><div><span>3rd Dan</span><strong>${escapeHTML(task.gradingFocus || 'Current weakest grading section')}</strong><small>Both sides, ratings and evidence</small></div></div>` : ''}
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

    ${renderIntensityDashboard(key)}

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
        <label>Energy
          <select data-daily-field="energy" data-date="${key}">${ratingOptions(record.energy || 3)}</select>
        </label>
        <label>Concentration
          <select data-daily-field="concentration" data-date="${key}">${ratingOptions(record.concentration || 3)}</select>
        </label>
        <label>Study enjoyment
          <select data-daily-field="enjoyment" data-date="${key}">${ratingOptions(record.enjoyment || 3)}</select>
        </label>
        <label>Stress
          <select data-daily-field="stress" data-date="${key}">${ratingOptions(record.stress || 3)}</select>
        </label>
      </div>
    </article>`;
}

function renderWeek() {
  syncDateContext();
  const start = weeklyPlanStartKey;
  const today = getNZDateKey();
  const days = getRollingPlanDates(start);
  const weekGoal = findRoadmapWeekForDate(start);
  document.getElementById('view-week').innerHTML = `
    <div class="date-navigation">
      <button class="secondary-btn" data-action="previous-week">← Previous 7 days</button>
      <button class="ghost-btn" data-action="current-week" ${start === today ? 'disabled' : ''}>Start today</button>
      <button class="secondary-btn" data-action="next-week">Next 7 days →</button>
    </div>
    <div class="hero">
      <p class="eyebrow">ROLLING 7-DAY PLAN · STARTING ${escapeHTML(formatDateKey(start, { day:'numeric', month:'long', year:'numeric' }).toUpperCase())}</p>
      <h2>Friday and flexible weekend training plan</h2>
      <p>The default view starts today and shows the next six days. Monday to Thursday remain unscheduled, Friday is Azure only, and Saturday and Sunday each contain Azure, Jion kata and 3rd Dan focus blocks with no fixed time.</p>
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


function renderProgrammePhaseCards() {
  return `<div class="phase-roadmap">${state.intensiveProgramme.phases.map(phase => {
    const progress = getProgrammePhaseProgress(phase);
    const active = phase.id === state.intensiveProgramme.activePhaseId;
    return `<article class="card phase-card ${active ? 'active-phase' : ''}"><div class="phase-card-head"><div><span class="badge ${active ? 'green' : 'blue'}">Phase ${phase.order} · Months ${escapeHTML(phase.months)}</span><h3>${escapeHTML(phase.name)}</h3><p>${escapeHTML(phase.outcome)}</p></div><strong>${progress}%</strong></div><div class="progress-line"><span style="width:${progress}%"></span></div><div class="module-badges">${phase.skills.map(skill => `<span class="badge">${escapeHTML(skill)}</span>`).join('')}</div><div class="stage-list">${INTENSIVE_STAGE_DEFS.map(([,label]) => `<span class="badge">${escapeHTML(label)}</span>`).join('')}</div><div class="form-grid"><label>Status<select data-phase-field="status" data-phase-id="${phase.id}">${[['not-started','Not started'],['active','Active'],['paused','Paused'],['complete','Complete']].map(([v,l]) => `<option value="${v}" ${phase.status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Manual progress %<input type="number" min="0" max="100" step="1" data-phase-field="progress" data-phase-id="${phase.id}" value="${Number(phase.progress||0)}"></label><label>Current objective<input data-phase-field="currentObjective" data-phase-id="${phase.id}" value="${escapeHTML(phase.currentObjective||'')}"></label><label>Exam date<input type="date" data-phase-field="examDate" data-phase-id="${phase.id}" value="${escapeHTML(phase.examDate||'')}"></label></div>${active ? '<span class="badge green">Current active phase</span>' : `<button class="ghost-btn" data-action="set-active-phase" data-id="${phase.id}">Make active</button>`}</article>`;
  }).join('')}</div>`;
}

function renderIntensiveSessionFields(def, session, weekStart) {
  const common = `<div class="form-grid"><label>Main topic<input data-week-session-field="topic" data-session-id="${def.id}" data-week-start="${weekStart}" value="${escapeHTML(session.topic||'')}"></label><label>Status<select data-week-session-field="status" data-session-id="${def.id}" data-week-start="${weekStart}">${TASK_STATUS_OPTIONS.slice(0,5).map(([v,l]) => `<option value="${v}" ${session.status===v?'selected':''}>${l}</option>`).join('')}</select></label><label>Duration hours<input type="number" min="0" max="3" step="0.25" data-week-session-field="durationHours" data-session-id="${def.id}" data-week-start="${weekStart}" value="${Number(session.durationHours||0)}"></label><label>Confidence<select data-week-session-field="confidence" data-session-id="${def.id}" data-week-start="${weekStart}">${ratingOptions(session.confidence||3)}</select></label></div>`;
  const text = (field, label, placeholder='') => `<label>${label}<textarea data-week-session-field="${field}" data-session-id="${def.id}" data-week-start="${weekStart}" placeholder="${escapeHTML(placeholder)}">${escapeHTML(session[field]||'')}</textarea></label>`;
  const input = (field, label, type='text', attrs='') => `<label>${label}<input type="${type}" ${attrs} data-week-session-field="${field}" data-session-id="${def.id}" data-week-start="${weekStart}" value="${escapeHTML(String(session[field]??''))}"></label>`;
  let specific='';
  if (def.id === 'session-1') specific = `<div class="form-grid">${input('officialModule','Official module')}${input('documentation','Documentation')}${input('terminology','Key terminology')}${input('examObjectives','Exam objectives covered')}</div><div class="form-grid">${text('concepts','Concepts to explain')}${text('evidence','Notes and evidence')}</div><label class="checkbox-label"><input type="checkbox" data-week-session-field="teachBack" data-session-id="${def.id}" data-week-start="${weekStart}" ${session.teachBack?'checked':''}> Teach-back completed without copying the source</label>`;
  else if (def.id === 'session-2') specific = `<div class="form-grid">${input('lab','Guided lab')}${input('objective','Objective')}${input('resources','Resources')}${input('possibleCost','Possible cost')}</div><div class="form-grid">${text('portalTasks','Portal tasks')}${text('powershellTasks','PowerShell tasks')}${text('cliTasks','Azure CLI tasks')}${text('validation','Validation')}</div><div class="form-grid">${text('problems','Problems encountered')}${text('troubleshooting','Troubleshooting performed')}${text('cleanup','Cleanup')}${text('evidence','Evidence')}</div>`;
  else if (def.id === 'session-3') specific = `<div class="form-grid">${input('challenge','Independent practical challenge')}${input('instructionsAllowed','Instructions allowed')}${input('resources','Resources created')}${input('independentResult','Independent result')}</div><div class="form-grid">${text('commandsUsed','Commands used')}${text('problems','Problems encountered')}${text('troubleshooting','Troubleshooting performed')}${text('validation','Validation result')}</div><div class="form-grid">${text('cleanup','Cleanup')}${text('evidence','Evidence')}</div>`;
  else if (def.id === 'session-4') specific = `<div class="form-grid">${input('topicsTested','Topics tested')}${input('questionTypes','Question types')}${input('practiceScore','Practice score','number','min="0" max="100"')}${input('practicalResult','Practical result')}</div><div class="form-grid">${text('weakAreas','Weak areas')}${text('corrections','Corrections')}${text('retestResult','Retest result')}${input('retentionDate','Retention review date','date')}</div>${text('evidence','Assessment evidence')}`;
  else specific = `<div class="form-grid">${input('project','Portfolio project')}${input('milestone','Milestone')}${input('automationTool','Automation tool')}${input('gitActivity','Git activity')}</div><div class="form-grid">${text('scriptDeployment','Script or deployment')}${text('documentation','Documentation')}${text('validation','Validation')}${text('evidence','Evidence')}</div>`;
  return `${common}${specific}`;
}

function renderCurrentIntensiveWeek() {
  const weekStart = getWeekStart();
  const week = getIntensiveWeek(weekStart, {create:false});
  const metrics = getWeekIntensityMetrics(weekStart);
  const phase = state.intensiveProgramme.phases.find(item => item.id === week.activePhaseId) || activeProgrammePhase();
  return `<article class="card intensive-week-card"><div class="section-heading"><div><p class="eyebrow">WEEK OF ${escapeHTML(formatDateKey(weekStart,{day:'numeric',month:'long',year:'numeric'}).toUpperCase())}</p><h2>Intensive weekly record</h2><p>Friday night is Azure only. Saturday and Sunday are flexible combined days containing Azure, Jion kata and 3rd Dan training. Monday to Thursday remain unscheduled.</p></div><span class="badge blue">${metrics.technicalHours.toFixed(1)} technical h · ${metrics.germanHours.toFixed(1)} German h</span></div>
  <div class="form-grid"><label>Active certification<select data-week-field="activePhaseId" data-week-start="${weekStart}">${state.intensiveProgramme.phases.map(item => `<option value="${item.id}" ${item.id===week.activePhaseId?'selected':''}>${escapeHTML(item.short)}</option>`).join('')}</select></label><label>Current phase stage<select data-week-field="stageId" data-week-start="${weekStart}">${INTENSIVE_STAGE_DEFS.map(([id,label]) => `<option value="${id}" ${week.stageId===id?'selected':''}>${escapeHTML(label)}</option>`).join('')}</select></label><label>Starting progress %<input type="number" min="0" max="100" data-week-field="startingProgress" data-week-start="${weekStart}" value="${Number(week.startingProgress||0)}"></label><label>Target progress %<input type="number" min="0" max="100" data-week-field="targetProgress" data-week-start="${weekStart}" value="${Number(week.targetProgress||0)}"></label><label>Technical target h<input type="number" min="5" max="16" step="0.5" data-week-field="technicalTarget" data-week-start="${weekStart}" value="${Number(week.technicalTarget||10)}"></label><label>German target h<input type="number" min="1" max="6" step="0.25" data-week-field="germanTarget" data-week-start="${weekStart}" value="${Number(week.germanTarget||2.5)}"></label></div>
  <label>Main weekly outcome<textarea data-week-field="mainOutcome" data-week-start="${weekStart}">${escapeHTML(week.mainOutcome||'')}</textarea></label>
  <div class="toggle-row"><label><input type="checkbox" data-week-field="recoveryWeek" data-week-start="${weekStart}" ${week.recoveryWeek?'checked':''}> Recovery week</label><label><input type="checkbox" data-week-field="temporarilyReduced" data-week-start="${weekStart}" ${week.temporarilyReduced?'checked':''}> Temporarily reduced by 20–30%</label></div>
  <div class="session-list">${INTENSIVE_SESSION_DEFS.map(def => { const session=week.sessions[def.id]; return `<details class="session-card" ${def.id==='session-1'?'open':''}><summary><span>${escapeHTML(def.label)} · ${escapeHTML(def.day)} · ${escapeHTML(def.duration)}</span><span class="badge ${session.status==='completed'?'green':session.status==='partial'?'amber':'blue'}">${escapeHTML(session.status.replaceAll('-',' '))}</span></summary><div class="session-body">${renderIntensiveSessionFields(def,session,weekStart)}</div></details>`; }).join('')}</div>
  <div class="section-heading compact"><div><h3>German weekly record</h3><p>Complete German on at least five days, including one speaking and one technical-German session.</p></div></div><div class="form-grid"><label>Current level<input data-week-german="currentLevel" data-week-start="${weekStart}" value="${escapeHTML(week.german.currentLevel||'A0/A1')}"></label><label>Days completed<input type="number" min="0" max="7" data-week-german="daysCompleted" data-week-start="${weekStart}" value="${Number(week.german.daysCompleted||0)}"></label><label>Vocabulary sessions<input type="number" min="0" max="14" data-week-german="vocabularySessions" data-week-start="${weekStart}" value="${Number(week.german.vocabularySessions||0)}"></label><label>Grammar sessions<input type="number" min="0" max="14" data-week-german="grammarSessions" data-week-start="${weekStart}" value="${Number(week.german.grammarSessions||0)}"></label><label>Listening minutes<input type="number" min="0" data-week-german="listeningMinutes" data-week-start="${weekStart}" value="${Number(week.german.listeningMinutes||0)}"></label><label>Speaking minutes<input type="number" min="0" data-week-german="speakingMinutes" data-week-start="${weekStart}" value="${Number(week.german.speakingMinutes||0)}"></label><label>Reading minutes<input type="number" min="0" data-week-german="readingMinutes" data-week-start="${weekStart}" value="${Number(week.german.readingMinutes||0)}"></label><label>Writing tasks<input type="number" min="0" data-week-german="writingTasks" data-week-start="${weekStart}" value="${Number(week.german.writingTasks||0)}"></label><label>Additional German minutes<input type="number" min="0" data-week-german="additionalMinutes" data-week-start="${weekStart}" value="${Number(week.german.additionalMinutes||0)}"></label><label>Technical German topic<input data-week-german="technicalGerman" data-week-start="${weekStart}" value="${escapeHTML(week.german.technicalGerman||`${phase.short} vocabulary`)}"></label></div>
  <div class="section-heading compact"><div><h3>Weekly review and quality controls</h3></div></div><div class="form-grid"><label>Labs completed<input type="number" min="0" data-week-field="labsCompleted" data-week-start="${weekStart}" value="${Number(week.labsCompleted||0)}"></label><label>Assessments completed<input type="number" min="0" data-week-field="assessmentsCompleted" data-week-start="${weekStart}" value="${Number(week.assessmentsCompleted||0)}"></label><label>Portfolio hours<input type="number" min="0" max="10" step="0.25" data-week-field="portfolioHours" data-week-start="${weekStart}" value="${Number(week.portfolioHours||0)}"></label><label>Independent tasks passed<input type="number" min="0" data-week-field="independentTasksPassed" data-week-start="${weekStart}" value="${Number(week.independentTasksPassed||0)}"></label><label>Current weak-area count<input type="number" min="0" data-week-field="weakAreaCount" data-week-start="${weekStart}" value="${Number(week.weakAreaCount||0)}"></label><label>Schedule status<select data-week-field="scheduleStatus" data-week-start="${weekStart}">${['Accelerated','On Intensive Target','Slightly Below Intensive Target','Recovery Week','Temporarily Reduced','Behind','Paused'].map(v => `<option ${week.scheduleStatus===v?'selected':''}>${v}</option>`).join('')}</select></label></div>
  <div class="quality-grid">${[['energy','Energy'],['concentration','Concentration'],['enjoyment','Study enjoyment'],['sleepImpact','Sleep impact'],['familyImpact','Family impact'],['confidence','Confidence'],['stress','Stress']].map(([field,label]) => `<label>${label}<select data-week-quality="${field}" data-week-start="${weekStart}">${ratingOptions(week.quality[field]||3)}</select></label>`).join('')}<label class="checkbox-label"><input type="checkbox" data-week-quality="rushingLabs" data-week-start="${weekStart}" ${week.quality.rushingLabs?'checked':''}> I rushed labs without understanding them</label></div>
  <div class="form-grid"><label>Knowledge completed<textarea data-week-field="knowledgeCompleted" data-week-start="${weekStart}">${escapeHTML(week.knowledgeCompleted||'')}</textarea></label><label>Assessment result<textarea data-week-field="assessmentResult" data-week-start="${weekStart}">${escapeHTML(week.assessmentResult||'')}</textarea></label><label>Portfolio progress<textarea data-week-field="portfolioProgress" data-week-start="${weekStart}">${escapeHTML(week.portfolioProgress||'')}</textarea></label><label>Strong areas<textarea data-week-field="strongAreas" data-week-start="${weekStart}">${escapeHTML(week.strongAreas||'')}</textarea></label><label>Weak areas<textarea data-week-field="weakAreas" data-week-start="${weekStart}">${escapeHTML(week.weakAreas||'')}</textarea></label><label>Blocked items<textarea data-week-field="blockedItems" data-week-start="${weekStart}">${escapeHTML(week.blockedItems||'')}</textarea></label><label>Carry-over work<textarea data-week-field="carryOver" data-week-start="${weekStart}">${escapeHTML(week.carryOver||'')}</textarea></label><label>Next highest-priority task<textarea data-week-field="nextPriority" data-week-start="${weekStart}">${escapeHTML(week.nextPriority||'')}</textarea></label></div></article>`;
}

function renderExamReadiness() {
  const phase = activeProgrammePhase();
  const readiness = examReadiness(phase);
  return `<article class="card exam-readiness-card"><div class="section-heading"><div><h2>${escapeHTML(phase.short)} exam booking gate</h2><p>A target date alone never makes the exam ready to book.</p></div><span class="badge ${readiness.score>=80?'green':readiness.score>=70?'amber':'red'}">${readiness.score}% · ${escapeHTML(readiness.category)}</span></div><div class="form-grid"><label class="checkbox-label"><input type="checkbox" data-phase-field="objectivesStudied" data-phase-id="${phase.id}" ${phase.objectivesStudied?'checked':''}> All major objectives studied</label><label>Required labs complete %<input type="number" min="0" max="100" data-phase-field="labsCompletePercent" data-phase-id="${phase.id}" value="${Number(phase.labsCompletePercent||0)}"></label><label class="checkbox-label"><input type="checkbox" data-phase-field="independentReady" data-phase-id="${phase.id}" ${phase.independentReady?'checked':''}> Important tasks performed independently</label><label>Critical weak areas<input type="number" min="0" data-phase-field="criticalWeakAreas" data-phase-id="${phase.id}" value="${Number(phase.criticalWeakAreas||0)}"></label><label>Recent practice scores<input data-phase-field="practiceScores" data-phase-id="${phase.id}" value="${escapeHTML(phase.practiceScores||'')}" placeholder="Example: 82, 84, 88"></label><label>Portfolio substantially complete %<input type="number" min="0" max="100" data-phase-field="portfolioPercent" data-phase-id="${phase.id}" value="${Number(phase.portfolioPercent||0)}"></label><label class="checkbox-label"><input type="checkbox" data-phase-field="retentionPassed" data-phase-id="${phase.id}" ${phase.retentionPassed?'checked':''}> Delayed retention check passed</label><label class="checkbox-label"><input type="checkbox" data-phase-field="examPassed" data-phase-id="${phase.id}" ${phase.examPassed?'checked':''}> Official exam passed</label></div><div class="inline-note ${readiness.eligible?'success':'warning'}">${readiness.eligible ? 'All booking rules are currently satisfied.' : 'Do not book yet. Complete every booking rule, including three consistent scores of at least 80%.'}</div></article>`;
}

function renderMonthlyPlan(month) {
  const p=month.plan || {};
  const field=(key,label,area='textarea') => area==='input'
    ? `<label>${label}<input data-intensive-month-plan="${key}" data-month-id="${month.id}" value="${escapeHTML(String(p[key]??''))}"></label>`
    : `<label>${label}<textarea data-intensive-month-plan="${key}" data-month-id="${month.id}">${escapeHTML(p[key]||'')}</textarea></label>`;
  return `<details class="monthly-plan"><summary>Detailed monthly plan</summary><div class="monthly-plan-sections">
    <section><h4>Knowledge goals</h4><div class="form-grid">${field('officialModules','Official modules')}${field('documentationTopics','Documentation topics')}${field('conceptsToExplain','Concepts to explain')}${field('examObjectives','Exam objectives')}</div></section>
    <section><h4>Practical goals</h4><div class="form-grid">${field('guidedLabs','Guided labs')}${field('independentLabs','Independent labs')}${field('troubleshootingTasks','Troubleshooting tasks')}${field('resourcesToDeploy','Resources to deploy')}${field('validationRequirements','Validation requirements')}${field('cleanupRequirements','Cleanup requirements')}</div></section>
    <section><h4>Assessment goals</h4><div class="form-grid">${field('knowledgeQuizzes','Knowledge quizzes')}${field('scenarioAssessments','Scenario assessments')}${field('practicalChallenges','Practical challenges')}${field('targetScores','Target scores','input')}${field('weakAreasToResolve','Weak areas to resolve')}</div></section>
    <section><h4>Portfolio and relevant automation</h4><div class="form-grid">${field('portfolioMilestone','Portfolio milestone')}${field('powershellTask','PowerShell task')}${field('azureCliTask','Azure CLI task')}${field('graphTask','Microsoft Graph task')}${field('iacTask','Bicep or Terraform task')}${field('gitCicdTask','Git or CI/CD task')}</div></section>
    <section><h4>German goals</h4><div class="form-grid">${field('germanLevel','Current level','input')}${field('vocabularyTarget','Vocabulary target')}${field('grammarTarget','Grammar target')}${field('listeningHours','Listening hours','input')}${field('speakingHours','Speaking hours','input')}${field('readingTasks','Reading tasks')}${field('writingTasks','Writing tasks')}${field('technicalGermanTopic','Technical German topic')}</div></section>
  </div></details>`;
}

function renderIntensiveMonths() {
  return `<div class="intensive-month-list">${state.intensiveProgramme.months.map(month => {
    const phase = state.intensiveProgramme.phases.find(item => item.id === month.phaseId) || programmePhaseForMonth(month.monthNumber);
    const stageLabel = month.stageLabel || INTENSIVE_STAGE_DEFS.find(item => item[0] === month.stageId)?.[1] || 'Integrated phase work';
    const completedGoals = Object.values(month.goals).filter(goal => goal.complete).length;
    return `<details class="roadmap-month intensive-month" ${month.monthStart.slice(0,7)===monthKeyForDate()?'open':''}><summary><div><span class="roadmap-month-label">Month ${month.monthNumber} · ${escapeHTML(month.label)}</span><strong>${escapeHTML(phase.short)} — ${escapeHTML(stageLabel)}</strong></div><div class="roadmap-summary-meta"><span class="badge blue">${completedGoals}/8 goals</span><span class="badge">Target ${month.targetEndingProgress}%</span></div></summary><div class="roadmap-month-body"><div class="form-grid"><label>Starting progress %<input type="number" min="0" max="100" data-intensive-month-field="startingProgress" data-month-id="${month.id}" value="${Number(month.startingProgress||0)}"></label><label>Target ending progress %<input type="number" min="0" max="100" data-intensive-month-field="targetEndingProgress" data-month-id="${month.id}" value="${Number(month.targetEndingProgress||0)}"></label><label>Target exam date<input type="date" data-intensive-month-field="targetExamDate" data-month-id="${month.id}" value="${escapeHTML(month.targetExamDate||'')}"></label><label>Primary outcome<textarea data-intensive-month-field="primaryOutcome" data-month-id="${month.id}">${escapeHTML(month.primaryOutcome||'')}</textarea></label></div>
    ${renderMonthlyPlan(month)}
    <div class="monthly-goal-grid">${[['knowledge','Knowledge'],['labs','Practical labs'],['independent','Independent performance'],['assessments','Assessment'],['weakAreas','Weak-area review'],['portfolio','Portfolio'],['automation','Automation'],['german','German']].map(([key,label]) => { const goal=month.goals[key]; const descriptor=goal.text || (key==='german' ? `${goal.targetHours} hours · ${goal.topic}` : `Target ${goal.target||0} · Actual ${goal.actual||0}`); return `<article class="goal-card ${goal.complete?'complete':''}"><label class="goal-check"><input type="checkbox" data-intensive-month-goal="complete" data-goal-key="${key}" data-month-id="${month.id}" ${goal.complete?'checked':''}><strong>${label}</strong></label><p>${escapeHTML(descriptor)}</p>${['labs','independent','assessments','weakAreas'].includes(key)?`<div class="compact-numbers"><label>Target<input type="number" min="0" data-intensive-month-goal="target" data-goal-key="${key}" data-month-id="${month.id}" value="${Number(goal.target||0)}"></label><label>Actual<input type="number" min="0" data-intensive-month-goal="actual" data-goal-key="${key}" data-month-id="${month.id}" value="${Number(goal.actual||0)}"></label></div>`:''}${key==='german'?`<div class="compact-numbers"><label>Target h<input type="number" min="0" data-intensive-month-goal="targetHours" data-goal-key="${key}" data-month-id="${month.id}" value="${Number(goal.targetHours||0)}"></label><label>Actual h<input type="number" min="0" step="0.25" data-intensive-month-goal="actualHours" data-goal-key="${key}" data-month-id="${month.id}" value="${Number(goal.actualHours||0)}"></label></div>`:''}<textarea data-intensive-month-goal="evidence" data-goal-key="${key}" data-month-id="${month.id}" placeholder="Evidence">${escapeHTML(goal.evidence||'')}</textarea></article>`; }).join('')}</div>
    <div class="roadmap-weeks">${month.weeks.map(week => `<details class="roadmap-week"><summary><span>${escapeHTML(week.label)}</span><span class="badge ${week.status==='completed'?'green':week.status==='partial'?'amber':'blue'}">${escapeHTML(week.status.replaceAll('-',' '))}</span></summary><div class="roadmap-week-body"><label>Main weekly outcome<textarea data-intensive-month-week="mainOutcome" data-week-id="${week.id}" data-month-id="${month.id}">${escapeHTML(week.mainOutcome||'')}</textarea></label><div class="form-grid"><label>Technical target h<input type="number" min="5" max="16" step="0.5" data-intensive-month-week="technicalTarget" data-week-id="${week.id}" data-month-id="${month.id}" value="${Number(week.technicalTarget||10)}"></label><label>German target h<input type="number" min="1" max="6" step="0.25" data-intensive-month-week="germanTarget" data-week-id="${week.id}" data-month-id="${month.id}" value="${Number(week.germanTarget||2.5)}"></label><label>Status<select data-intensive-month-week="status" data-week-id="${week.id}" data-month-id="${month.id}">${TASK_STATUS_OPTIONS.slice(0,5).map(([v,l]) => `<option value="${v}" ${week.status===v?'selected':''}>${l}</option>`).join('')}</select></label></div><label>Weekly evidence<textarea data-intensive-month-week="evidence" data-week-id="${week.id}" data-month-id="${month.id}">${escapeHTML(week.evidence||'')}</textarea></label></div></details>`).join('')}</div>
    <details class="monthly-review"><summary>Monthly review</summary><div class="form-grid">${[['plannedProgress','Planned progress %'],['actualProgress','Actual progress %'],['labsCompleted','Labs completed'],['independentPassed','Independent tasks passed'],['portfolioProgress','Portfolio progress %'],['germanHours','German hours']].map(([field,label]) => `<label>${label}<input type="number" min="0" step="0.25" data-intensive-month-review="${field}" data-month-id="${month.id}" value="${Number(month.review[field]||0)}"></label>`).join('')}<label>Schedule status<select data-intensive-month-review="scheduleStatus" data-month-id="${month.id}">${['Ahead','On Intensive Target','Slightly Below Intensive Target','Recovery Week','Temporarily Reduced','Behind','Paused'].map(v => `<option ${month.review.scheduleStatus===v?'selected':''}>${v}</option>`).join('')}</select></label></div><div class="form-grid"><label>Assessment results<textarea data-intensive-month-review="assessmentResults" data-month-id="${month.id}">${escapeHTML(month.review.assessmentResults||'')}</textarea></label><label>Weak areas<textarea data-intensive-month-review="weakAreas" data-month-id="${month.id}">${escapeHTML(month.review.weakAreas||'')}</textarea></label><label>Carry-over work<textarea data-intensive-month-review="carryOver" data-month-id="${month.id}">${escapeHTML(month.review.carryOver||'')}</textarea></label><label>Next month priority<textarea data-intensive-month-review="nextPriority" data-month-id="${month.id}">${escapeHTML(month.review.nextPriority||'')}</textarea></label></div></details></div></details>`;
  }).join('')}</div>`;
}

function renderProgramme() {
  const programme = state.intensiveProgramme;
  const forecast = programmeForecast();
  const workload = `<div class="grid five workload-grid">${[['Main certification learning','3–4 h'],['Practical labs','3–4 h'],['Testing and review','1.5–2 h'],['Portfolio or automation','1.5–2 h'],['German','2–3 h']].map(([label,value]) => `<article class="card metric-card"><span>${escapeHTML(label)}</span><strong>${escapeHTML(value)}</strong></article>`).join('')}</div><article class="card programme-rules"><h3>Minimum intensive week and sustainability limits</h3><div class="grid two"><div><p><strong>Minimum:</strong> 8 technical hours, 2 German hours, one practical lab, and one assessment or active-recall session.</p><p><strong>Normal target:</strong> 10–14 total hours.</p></div><div><p><strong>Maximum:</strong> 16 hours per week, no technical session longer than 3 hours, and no more than six consecutive intensive study days.</p><p>Evidence, independent performance, troubleshooting and retention remain mandatory.</p></div></div></article>`;
  const recovery = `<article class="card recovery-protocol"><div class="section-heading"><div><h2>Recovery-week protocol</h2><p>Schedule one after every 6–8 intensive weeks. It is part of the programme and does not count as falling behind.</p></div><span class="badge green">5–7 technical hours</span></div><div class="grid two"><ul><li>Do not begin a major new objective.</li><li>Review completed material and flashcards.</li><li>Repeat one weak practical lab.</li><li>Continue German at normal intensity.</li></ul><ul><li>Clean up notes and Git repositories.</li><li>Finish incomplete documentation.</li><li>Review the next study block.</li><li>Protect sleep, concentration and family capacity.</li></ul></div></article>`;
  document.getElementById('view-programme').innerHTML = `<div class="hero programme-hero"><p class="eyebrow">INTENSIVE MICROSOFT CLOUD PROGRAMME</p><h2>30–42 months · practical, evidence-based and employability focused</h2><p>${escapeHTML(programme.careerProfile)}</p><div class="hero-meta"><span class="badge blue">10–14 total hours/week</span><span class="badge blue">8–11 technical hours</span><span class="badge blue">2–3 German hours</span><span class="badge green">${forecast.progress}% weighted progress</span></div></div>
  ${renderIntensityDashboard()}
  <div class="section-heading"><div><h2>Weekly workload standard</h2><p>The pace is intensive, but labs, independent work, troubleshooting, portfolio evidence and retention cannot be skipped.</p></div></div>${workload}
  <div class="section-heading"><div><h2>Certification and technical phase sequence</h2><p>AZ-104 → SC-300 → MD-102 → MS-102 → AZ-700 → Bicep and Terraform → Terraform 004 → AZ-305 → SC-500.</p></div></div>${renderProgrammePhaseCards()}
  <div class="section-heading"><div><h2>Current week</h2><p>Friday has one Azure objective. Saturday and Sunday each contain three required flexible focus blocks: Azure, Jion kata and 3rd Dan training.</p></div></div>${renderCurrentIntensiveWeek()}
  ${recovery}
  <div class="section-heading"><div><h2>Exam readiness</h2></div></div>${renderExamReadiness()}
  <div class="section-heading"><div><h2>Continuous supporting skills</h2><p>Prioritise the skills that support the active certification.</p></div></div><div class="grid three skill-grid">${programme.skills.map(skill => `<article class="card"><h3>${escapeHTML(skill.name)}</h3><div class="progress-line"><span style="width:${Number(skill.progress||0)}%"></span></div><label>Practical competency %<input type="number" min="0" max="100" data-skill-field="progress" data-skill-id="${skill.id}" value="${Number(skill.progress||0)}"></label><label>Evidence<textarea data-skill-field="evidence" data-skill-id="${skill.id}">${escapeHTML(skill.evidence||'')}</textarea></label><label>Last practised<input type="date" data-skill-field="lastPractised" data-skill-id="${skill.id}" value="${escapeHTML(skill.lastPractised||'')}"></label></article>`).join('')}</div>
  <div class="section-heading"><div><h2>42-month expandable month → week roadmap</h2><p>The original intensive target is ${programme.targetMonths} months. Months 33–42 provide delay, retake, German B2, interview and commercial-experience capacity.</p></div></div>${renderIntensiveMonths()}
  <div class="section-heading"><div><h2>Career application milestones</h2><p>Applications begin as soon as the relevant certification and practical evidence are present.</p></div></div><div class="grid two">${CAREER_MILESTONES.map(milestone => `<article class="card"><h3>${escapeHTML(milestone.label)}</h3><ul>${milestone.roles.map(role => `<li>${escapeHTML(role)}</li>`).join('')}</ul></article>`).join('')}</div>
  <div class="section-heading"><div><h2>Final completion standard</h2><p>The programme is complete only when every required certification, practical skill, portfolio and employability outcome is demonstrated.</p></div></div><div class="standard-grid">${programme.completionStandards.map(item => `<article class="card standard-item ${item.complete?'complete':''}"><label><input type="checkbox" data-standard-complete="${item.id}" ${item.complete?'checked':''}><span>${escapeHTML(item.text)}</span></label><textarea data-standard-evidence="${item.id}" placeholder="Evidence">${escapeHTML(item.evidence||'')}</textarea></article>`).join('')}</div>`;
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
        <h2>Weekly focus settings</h2>
        <div class="form-grid">
          <label>Programme start date<input id="programme-start-date" type="date" value="${escapeHTML(state.settings.programmeStartDate || PROGRAMME_START_DATE)}"></label>
          <label>Daily structure<input type="text" value="Friday Azure; flexible combined weekends" disabled></label>
        </div>
        <div class="weekly-default-grid" style="margin-top:14px">
          ${Object.keys(DEFAULT_WEEKLY_DAY_TYPES).map(day => `<label>${day}<select data-weekly-default="${day}">${dayTypeOptions(state.settings.weeklyDayTypes?.[day] || DEFAULT_WEEKLY_DAY_TYPES[day])}</select></label>`).join('')}
        </div>
        <div class="inline-note" style="margin-top:13px">Default pattern: Monday–Thursday unscheduled; Friday night Azure only; Saturday and Sunday each include Azure, Jion kata and 3rd Dan training. Weekend blocks have no fixed start time or required order.</div>
        <div class="form-actions"><button class="primary-btn" data-action="save-programme-settings">Save programme settings</button></div>
        <p class="muted small" style="margin-top:12px">App version ${APP_VERSION} · State schema ${STATE_VERSION}</p>
      </article>

      <article class="card">
        <h2>Intensive study targets</h2>
        <div class="form-grid">
          <label>Original target months<input type="number" min="30" max="42" data-intensive-programme-field="targetMonths" value="${Number(state.intensiveProgramme.targetMonths||36)}"></label>
          <label>Technical hours/week<input type="number" min="8" max="14" step="0.5" data-intensive-programme-field="weeklyTechnicalTarget" value="${Number(state.intensiveProgramme.weeklyTechnicalTarget||10)}"></label>
          <label>German hours/week<input type="number" min="2" max="4" step="0.25" data-intensive-programme-field="weeklyGermanTarget" value="${Number(state.intensiveProgramme.weeklyGermanTarget||2.5)}"></label>
          <label>Recovery frequency (weeks)<input type="number" min="6" max="8" data-intensive-programme-field="recoveryFrequencyWeeks" value="${Number(state.intensiveProgramme.recoveryFrequencyWeeks||7)}"></label>
        </div>
        <div class="inline-note warning">Do not routinely exceed 16 total study hours, three uninterrupted technical hours, or six consecutive intensive study days.</div>
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
  document.getElementById('task-completion-title').textContent = task.category === 'azure' ? 'Complete Azure task' : task.category === 'karate' ? 'Complete karate task' : task.category === 'combined' ? 'Complete flexible weekend programme' : 'Complete recovery task';
  const common = `<label>What did you complete?<textarea name="summary" required>${escapeHTML(record.notes || '')}</textarea></label>
    <label>Did you finish the entire planned task?<select name="finished"><option value="yes">Yes</option><option value="partial">Partially</option><option value="no">No</option></select></label>
    <label>What evidence do you have?<textarea name="evidence" placeholder="Required for full completion">${escapeHTML(record.evidence || '')}</textarea></label>
    <label>Confidence rating<select name="confidence">${ratingOptions(record.confidence || 3)}</select></label>`;
  if (task.category === 'combined') {
    fields.innerHTML = `${common}
      <div class="inline-note"><strong>All three weekend areas are required:</strong> Azure, Jion kata and 3rd Dan training. Record the result for each area below.</div>
      <h3>Azure result</h3>
      <label>Which Azure mastery stage was demonstrated?<select name="masteryStage">${AZURE_STAGE_DEFS.map(([id,label]) => `<option value="${id}" ${task.masteryStage === label ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label>What did you not understand?<textarea name="notUnderstood"></textarea></label>
      <div class="form-grid"><label>Azure resources created?<select name="resourcesCreated"><option value="yes">Yes</option><option value="no">No</option></select></label><label>Resources cleaned up?<select name="resourcesCleaned"><option value="yes">Yes</option><option value="no">No</option><option value="not-applicable">Not applicable</option></select></label></div>
      <div class="form-grid"><label>Technical minutes<input name="technicalMinutes" type="number" min="0" max="360" value="${Number(record.technicalMinutes||0)}"></label><label>Portfolio/automation minutes<input name="portfolioMinutes" type="number" min="0" max="180" value="${Number(record.portfolioMinutes||0)}"></label><label>German minutes<input name="germanMinutes" type="number" min="0" max="120" value="${Number(record.germanMinutes||0)}"></label></div>
      <div class="form-grid"><label>Practical lab completed?<select name="labCompleted"><option value="no">No</option><option value="yes">Yes</option></select></label><label>Assessment or recall completed?<select name="assessmentCompleted"><option value="no">No</option><option value="yes">Yes</option></select></label></div>
      <label>Schedule an Azure review?<select name="scheduleAzureReview"><option value="yes">Yes</option><option value="no">No</option></select></label>
      <h3>Jion kata and 3rd Dan result</h3>
      <label>Which grading section was practised?<select name="karateSection"><option>Kihon</option><option selected>Kata</option><option>Kumite</option></select></label>
      <label>Which kata was practised?<input name="kata" type="text" value="${escapeHTML(task.kata || 'Jion')}"></label>
      <label>What improved?<textarea name="improved"></textarea></label>
      <label>What still felt weak?<textarea name="weak"></textarea></label>
      <div class="form-grid"><label>Right-side rating<select name="rightRating">${ratingOptions(1)}</select></label><label>Left-side rating<select name="leftRating">${ratingOptions(1)}</select></label></div>
      <label>Instructor feedback<textarea name="instructorFeedback"></textarea></label>
      <label>Main correction for next time<textarea name="mainCorrection"></textarea></label>
      <label>Schedule a kata retention review?<select name="scheduleKarateReview"><option value="yes">Yes</option><option value="no">No</option></select></label>`;
  } else if (task.category === 'azure') {
    fields.innerHTML = `${common}
      <label>Which mastery stage was demonstrated?<select name="masteryStage">${AZURE_STAGE_DEFS.map(([id,label]) => `<option value="${id}" ${task.masteryStage === label ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      <label>What did you not understand?<textarea name="notUnderstood"></textarea></label>
      <div class="form-grid"><label>Did the task create Azure resources?<select name="resourcesCreated"><option value="yes">Yes</option><option value="no">No</option></select></label><label>Were the resources cleaned up?<select name="resourcesCleaned"><option value="yes">Yes</option><option value="no">No</option><option value="not-applicable">Not applicable</option></select></label></div>
      <div class="form-grid"><label>Main technical minutes<input name="technicalMinutes" type="number" min="0" max="180" value="${Number(record.technicalMinutes||0)}"></label><label>Portfolio/automation minutes<input name="portfolioMinutes" type="number" min="0" max="120" value="${Number(record.portfolioMinutes||0)}"></label><label>German minutes<input name="germanMinutes" type="number" min="0" max="90" value="${Number(record.germanMinutes||0)}"></label></div>
      <label>Was a practical lab completed?<select name="labCompleted"><option value="no">No</option><option value="yes">Yes</option></select></label><label>Was an assessment or active-recall session completed?<select name="assessmentCompleted"><option value="no">No</option><option value="yes">Yes</option></select></label>
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
  const includesAzure = task.category === 'azure' || task.category === 'combined';
  const includesKarate = task.category === 'karate' || task.category === 'combined';
  const finished = String(data.get('finished') || 'partial');
  const evidence = String(data.get('evidence') || '').trim();
  if (finished === 'yes' && task.category !== 'rest' && !evidence) throw new Error('Add evidence before marking the task fully completed.');
  record.notes = String(data.get('summary') || '').trim();
  record.evidence = evidence;
  record.confidence = Number(data.get('confidence') || 3);
  record.status = finished === 'yes' ? 'completed' : finished === 'partial' ? 'partial' : 'missed';
  record.result = record.status;
  record.completedAt = finished === 'yes' ? new Date().toISOString() : '';
  const previousCompletionData = record.completionData || {};
  record.completionData = Object.fromEntries(data.entries());
  if (finished === 'yes') task.checklist.forEach((_, index) => { record.checks[taskSubKey(task.id, index)] = true; });

  if (includesAzure) {
    record.technicalMinutes = Number(data.get('technicalMinutes') || 0);
    record.portfolioMinutes = Number(data.get('portfolioMinutes') || 0);
    record.germanMinutes = Number(data.get('germanMinutes') || 0);
    const weekStart = getWeekStart(dateKey);
    const intensiveWeek = getIntensiveWeek(weekStart);
    const sessionDef = studySessionForDate(dateKey);
    if (sessionDef.id === 'session-2-3') {
      const splitMinutes = record.technicalMinutes / 2;
      intensiveWeek.sessions['session-2'].durationHours = splitMinutes / 60;
      intensiveWeek.sessions['session-2'].status = record.status;
      intensiveWeek.sessions['session-2'].evidence = evidence;
      intensiveWeek.sessions['session-2'].confidence = record.confidence;
      intensiveWeek.sessions['session-3'].durationHours = splitMinutes / 60;
      intensiveWeek.sessions['session-3'].status = record.status;
      intensiveWeek.sessions['session-3'].evidence = evidence;
      intensiveWeek.sessions['session-3'].confidence = record.confidence;
    } else if (sessionDef.id === 'session-4-5') {
      intensiveWeek.sessions['session-4'].durationHours = record.technicalMinutes / 60;
      intensiveWeek.sessions['session-4'].status = record.status;
      intensiveWeek.sessions['session-4'].evidence = evidence;
      intensiveWeek.sessions['session-4'].confidence = record.confidence;
      intensiveWeek.sessions['session-5'].durationHours = record.portfolioMinutes / 60;
      intensiveWeek.sessions['session-5'].status = record.status;
      intensiveWeek.sessions['session-5'].evidence = evidence;
      intensiveWeek.sessions['session-5'].confidence = record.confidence;
    } else if (intensiveWeek.sessions[sessionDef.id]) {
      intensiveWeek.sessions[sessionDef.id].durationHours = (record.technicalMinutes + record.portfolioMinutes) / 60;
      intensiveWeek.sessions[sessionDef.id].status = record.status;
      intensiveWeek.sessions[sessionDef.id].evidence = evidence;
      intensiveWeek.sessions[sessionDef.id].confidence = record.confidence;
    }
    intensiveWeek.german.dailyMinutes[dateKey] = record.germanMinutes;
    if (String(data.get('labCompleted')) === 'yes') intensiveWeek.labsCompleted = Math.max(1, Number(intensiveWeek.labsCompleted || 0) + (previousCompletionData.labCounted ? 0 : 1));
    if (String(data.get('assessmentCompleted')) === 'yes') intensiveWeek.assessmentsCompleted = Math.max(1, Number(intensiveWeek.assessmentsCompleted || 0) + (previousCompletionData.assessmentCounted ? 0 : 1));
    intensiveWeek.portfolioHours = Math.max(Number(intensiveWeek.portfolioHours || 0), record.portfolioMinutes / 60);
    intensiveWeek.quality.energy = record.energy || intensiveWeek.quality.energy;
    intensiveWeek.quality.concentration = record.concentration || intensiveWeek.quality.concentration;
    intensiveWeek.quality.enjoyment = record.enjoyment || intensiveWeek.quality.enjoyment;
    intensiveWeek.quality.stress = record.stress || intensiveWeek.quality.stress;
    intensiveWeek.updatedAt = new Date().toISOString();
    record.completionData.labCounted = String(data.get('labCompleted')) === 'yes';
    record.completionData.assessmentCounted = String(data.get('assessmentCompleted')) === 'yes';
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
      const scheduleAzureReview = String(data.get(task.category === 'combined' ? 'scheduleAzureReview' : 'scheduleReview')) === 'yes';
      if (scheduleAzureReview) {
        module.reviewIntervalDays = Math.max(3, Number(module.reviewIntervalDays || 0));
        module.nextReview = addDays(getNZDateKey(), module.reviewIntervalDays);
        if (stage) stage.reviewDate = module.nextReview;
      }
    }
  }

  if (includesKarate) {
    const kata = findKata(task.refs?.kataId) || currentKata();
    if (kata) {
      kata.practiceCount = (kata.practiceCount || 0) + 1;
      kata.lastPractised = getNZDateKey();
      kata.mainCorrection = String(data.get('mainCorrection') || '').trim() || kata.mainCorrection;
      kata.instructorFeedback = String(data.get('instructorFeedback') || '').trim() || kata.instructorFeedback;
      kata.evidence = evidence || kata.evidence;
      kata.confidence = record.confidence;
      const scheduleKarateReview = String(data.get(task.category === 'combined' ? 'scheduleKarateReview' : 'scheduleReview')) === 'yes';
      if (scheduleKarateReview) {
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
  if (action === 'previous-week') { weeklyPlanStartKey = addDays(weeklyPlanStartKey, -7); renderWeek(); return; }
  if (action === 'next-week') { weeklyPlanStartKey = addDays(weeklyPlanStartKey, 7); renderWeek(); return; }
  if (action === 'current-week') { weeklyPlanStartKey = getNZDateKey(); renderWeek(); return; }
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
  if (action === 'set-active-phase') { state.intensiveProgramme.activePhaseId=id; state.intensiveProgramme.phases.forEach(phase=>{if(phase.id===id)phase.status='active';else if(phase.status==='active')phase.status='not-started';}); saveState({render:true}); toast('Active certification phase updated.'); return; }
  if (action === 'apply-reduced-next-week') { const current=getIntensiveWeek(getWeekStart(),{create:false});const nextStart=addDays(getWeekStart(),7);const next=getIntensiveWeek(nextStart);next.technicalTarget=Math.max(5,Math.round(Number(current.technicalTarget||10)*0.75*2)/2);next.germanTarget=Number(current.germanTarget||2.5);next.temporarilyReduced=true;next.recoveryWeek=false;next.scheduleStatus='Temporarily Reduced';next.mainOutcome='Reduced-capacity week: prioritise outstanding required work, weak areas, practical validation and review before new learning.';next.updatedAt=new Date().toISOString();saveState({render:true});toast(`Next week reduced to ${next.technicalTarget} technical hours.`);return; }
  if (action === 'schedule-recovery-next-week') { const nextStart=addDays(getWeekStart(),7);const next=getIntensiveWeek(nextStart);next.technicalTarget=6;next.germanTarget=Number(state.intensiveProgramme.weeklyGermanTarget||2.5);next.recoveryWeek=true;next.temporarilyReduced=false;next.scheduleStatus='Recovery Week';next.mainOutcome='Recovery week: consolidate completed material, repeat one weak lab, clean notes and Git evidence, finish documentation, and prepare the next block.';next.updatedAt=new Date().toISOString();saveState({render:true});toast('Next week scheduled as a recovery week.');return; }
  if (action === 'save-programme-settings') { state.settings.programmeStartDate=document.getElementById('programme-start-date').value||PROGRAMME_START_DATE; document.querySelectorAll('[data-weekly-default]').forEach(select=>{state.settings.weeklyDayTypes[select.dataset.weeklyDefault]=select.value;}); saveState({render:true});toast('Weekly schedule saved.');return; }
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
  if (el.matches('[data-intensive-programme-field]')) { const field=el.dataset.intensiveProgrammeField;state.intensiveProgramme[field]=el.type==='number'?Number(el.value):el.value;saveState({render:true});return; }
  if (el.matches('[data-phase-field]')) { const phase=state.intensiveProgramme.phases.find(item=>item.id===el.dataset.phaseId);if(phase){phase[el.dataset.phaseField]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;saveState({render:true});}return; }
  if (el.matches('[data-week-field]')) { const week=getIntensiveWeek(el.dataset.weekStart);week[el.dataset.weekField]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;week.updatedAt=new Date().toISOString();saveState({render:true});return; }
  if (el.matches('[data-week-quality]')) { const week=getIntensiveWeek(el.dataset.weekStart);week.quality[el.dataset.weekQuality]=el.type==='checkbox'?el.checked:Number(el.value);saveState({render:true});return; }
  if (el.matches('[data-week-german]')) { const week=getIntensiveWeek(el.dataset.weekStart);week.german[el.dataset.weekGerman]=el.type==='number'?Number(el.value):el.value;saveState({render:true});return; }
  if (el.matches('[data-week-session-field]')) { const week=getIntensiveWeek(el.dataset.weekStart);const session=week.sessions[el.dataset.sessionId];if(session){session[el.dataset.weekSessionField]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;saveState({render:true});}return; }
  if (el.matches('[data-intensive-month-field]')) { const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month[el.dataset.intensiveMonthField]=el.type==='number'?Number(el.value):el.value;saveState();}return; }
  if (el.matches('[data-intensive-month-plan]')) { const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month.plan ||= {};month.plan[el.dataset.intensiveMonthPlan]=el.type==='number'?Number(el.value):el.value;saveState();}return; }
  if (el.matches('[data-intensive-month-goal]')) { const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);const goal=month?.goals?.[el.dataset.goalKey];if(goal){goal[el.dataset.intensiveMonthGoal]=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;saveState({render:el.type==='checkbox'});}return; }
  if (el.matches('[data-intensive-month-week]')) { const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);const week=month?.weeks.find(item=>item.id===el.dataset.weekId);if(week){week[el.dataset.intensiveMonthWeek]=el.type==='number'?Number(el.value):el.value;saveState({render:el.tagName==='SELECT'});}return; }
  if (el.matches('[data-intensive-month-review]')) { const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month.review[el.dataset.intensiveMonthReview]=el.type==='number'?Number(el.value):el.value;saveState();}return; }
  if (el.matches('[data-skill-field]')) { const skill=state.intensiveProgramme.skills.find(item=>item.id===el.dataset.skillId);if(skill){skill[el.dataset.skillField]=el.type==='number'?Number(el.value):el.value;saveState({render:el.type==='number'});}return; }
  if (el.matches('[data-standard-complete]')) { const item=state.intensiveProgramme.completionStandards.find(entry=>entry.id===el.dataset.standardComplete);if(item){item.complete=el.checked;saveState({render:true});}return; }
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
  if(el.matches('[data-week-field]') && ['TEXTAREA','INPUT'].includes(el.tagName) && !['number','checkbox'].includes(el.type))scheduleInputSave(`int-week:${el.dataset.weekStart}:${el.dataset.weekField}`,()=>{const week=getIntensiveWeek(el.dataset.weekStart);week[el.dataset.weekField]=el.value;saveState();});
  if(el.matches('[data-week-session-field]') && ['TEXTAREA','INPUT'].includes(el.tagName) && !['number','checkbox'].includes(el.type))scheduleInputSave(`int-session:${el.dataset.weekStart}:${el.dataset.sessionId}:${el.dataset.weekSessionField}`,()=>{const week=getIntensiveWeek(el.dataset.weekStart);week.sessions[el.dataset.sessionId][el.dataset.weekSessionField]=el.value;saveState();});
  if(el.matches('[data-week-german]') && el.type!=='number')scheduleInputSave(`int-german:${el.dataset.weekStart}:${el.dataset.weekGerman}`,()=>{const week=getIntensiveWeek(el.dataset.weekStart);week.german[el.dataset.weekGerman]=el.value;saveState();});
  if(el.matches('[data-phase-field]') && ['TEXTAREA','INPUT'].includes(el.tagName) && !['number','date','checkbox'].includes(el.type))scheduleInputSave(`int-phase:${el.dataset.phaseId}:${el.dataset.phaseField}`,()=>{const phase=state.intensiveProgramme.phases.find(item=>item.id===el.dataset.phaseId);if(phase){phase[el.dataset.phaseField]=el.value;saveState();}});
  if(el.matches('[data-intensive-month-field]') && ['TEXTAREA','INPUT'].includes(el.tagName) && el.type!=='number' && el.type!=='date')scheduleInputSave(`int-month:${el.dataset.monthId}:${el.dataset.intensiveMonthField}`,()=>{const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month[el.dataset.intensiveMonthField]=el.value;saveState();}});
  if(el.matches('[data-intensive-month-plan]'))scheduleInputSave(`int-month-plan:${el.dataset.monthId}:${el.dataset.intensiveMonthPlan}`,()=>{const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month.plan ||= {};month.plan[el.dataset.intensiveMonthPlan]=el.value;saveState();}});
  if(el.matches('[data-intensive-month-goal="evidence"]'))scheduleInputSave(`int-month-goal:${el.dataset.monthId}:${el.dataset.goalKey}`,()=>{const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month?.goals?.[el.dataset.goalKey]){month.goals[el.dataset.goalKey].evidence=el.value;saveState();}});
  if(el.matches('[data-intensive-month-week]') && el.tagName==='TEXTAREA')scheduleInputSave(`int-month-week:${el.dataset.monthId}:${el.dataset.weekId}:${el.dataset.intensiveMonthWeek}`,()=>{const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);const week=month?.weeks.find(item=>item.id===el.dataset.weekId);if(week){week[el.dataset.intensiveMonthWeek]=el.value;saveState();}});
  if(el.matches('[data-intensive-month-review]') && el.tagName==='TEXTAREA')scheduleInputSave(`int-month-review:${el.dataset.monthId}:${el.dataset.intensiveMonthReview}`,()=>{const month=state.intensiveProgramme.months.find(item=>item.id===el.dataset.monthId);if(month){month.review[el.dataset.intensiveMonthReview]=el.value;saveState();}});
  if(el.matches('[data-skill-field="evidence"]'))scheduleInputSave(`int-skill:${el.dataset.skillId}`,()=>{const skill=state.intensiveProgramme.skills.find(item=>item.id===el.dataset.skillId);if(skill){skill.evidence=el.value;saveState();}});
  if(el.matches('[data-standard-evidence]'))scheduleInputSave(`int-standard:${el.dataset.standardEvidence}`,()=>{const item=state.intensiveProgramme.completionStandards.find(entry=>entry.id===el.dataset.standardEvidence);if(item){item.evidence=el.value;saveState();}});
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
  if (document.visibilityState !== 'visible') return;
  const dateChanged = syncDateContext();
  if (dateChanged && ['today', 'week'].includes(currentView)) renderCurrentView();
  if (!navigator.onLine) return;
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
  const dateChanged = syncDateContext();
  if (dateChanged && ['today', 'week'].includes(currentView)) renderCurrentView();
  if(!navigator.onLine || cloudDirty) return;
  if(cloudProvider==='onedrive' && microsoftAccount) pullOneDrive({initial:true});
  if(cloudProvider==='supabase' && cloudUser) pullCloud({initial:true});
}, 60000);
