const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');

class ClassList { add(){} remove(){} toggle(){} }
class Element {
  constructor(id='') {
    this.id=id; this.innerHTML=''; this.textContent=''; this.value=''; this.checked=false;
    this.files=[]; this.classList=new ClassList(); this.dataset={}; this.style={}; this.disabled=false;
  }
  addEventListener(){} removeEventListener(){} showModal(){ this.open=true; } close(){ this.open=false; }
  click(){} focus(){} reset(){}
}
const elements = new Map();
const getElement = id => {
  if (!elements.has(id)) elements.set(id, new Element(id));
  return elements.get(id);
};
const local = new Map();
const localStorage = {
  getItem: key => local.has(key) ? local.get(key) : null,
  setItem: (key,value) => local.set(key,String(value)),
  removeItem: key => local.delete(key)
};
const document = {
  getElementById: getElement,
  querySelectorAll: () => [],
  querySelector: () => null,
  addEventListener: () => {},
  visibilityState: 'visible'
};
const context = {
  console,
  localStorage,
  document,
  navigator: { onLine: true },
  window: { scrollTo(){}, addEventListener(){}, location: { origin:'http://localhost:8080', pathname:'/', reload(){} } },
  location: { origin:'http://localhost:8080', pathname:'/', reload(){} },
  Notification: function(){}, Blob, URL, Intl, Date, Math, JSON, Object, Array, Map, Set, Promise,
  String, Number, Boolean, structuredClone,
  crypto: require('crypto').webcrypto,
  CSS: { escape: value => String(value) },
  setTimeout: fn => { fn(); return 1; }, clearTimeout: () => {}, setInterval: () => 1, clearInterval: () => {}
};
context.Notification.permission = 'denied';
vm.createContext(context);
const projectRoot = path.join(__dirname, '..');
const appPath = process.argv[2] || path.join(projectRoot, 'app.js');
const code = fs.readFileSync(appPath, 'utf8');
vm.runInContext(code, context, {filename:'app.js'});
vm.runInContext(`globalThis.testApi = {
  getState: () => state,
  setState: value => { state = value; },
  setSelectedDate: value => { selectedDateKey = value; },
  setWeeklyPlanStart: value => { weeklyPlanStartKey = value; },
  getWeeklyPlanStart: () => weeklyPlanStartKey,
  setLastKnownToday: value => { lastKnownTodayKey = value; },
  getSelectedDate: () => selectedDateKey,
  defaultState, mergeDefaults, dayCompletion, getDailyRecord, getPlanForDate, getTaskForDate,
  getDayTypeForDate, getPlanModeForDate, renderToday, renderWeek, renderAzure, renderDan,
  renderKata, renderProgramme, renderProgress, renderNotes, renderSettings, getAzurePriority, getDanPriority,
  getKataPriority, recordAzureReview, updateKataProgressFromSections, getNextKataInterval,
  findNextSuitableDates, applyTaskCompletion, moduleContentPercent, moduleMasteryPercent, pathContentPercent,
  pathMasteryPercent, currentAzureModule, currentAzureUnit, currentKata, setAzureModuleContentComplete, addDays, getRollingPlanDates, syncDateContext,
  DAY_PLANS, DEFAULT_WEEKLY_DAY_TYPES, AZURE_STAGE_DEFS, DAY_TYPE_OPTIONS, APP_VERSION,
  STATE_VERSION, MICROSOFT_GRAPH_SCOPES, oneDriveStateUrl, getCurrentRedirectUri,
  loadCloudProvider, ONEDRIVE_STATE_FILE, activeProgrammePhase, studySessionForDate, getIntensiveWeek, getWeekIntensityMetrics, overallProgrammeProgress, programmeForecast, examReadiness, recoveryWeekDue, programmeWarnings, programmePhaseForMonth, stageForProgrammeMonth, weekRequiresReduction
};`, context);

const api = context.testApi;
const initial = api.getState();
assert.equal(api.APP_VERSION, '1.9.6');
assert.equal(api.STATE_VERSION, 8);
assert.equal(initial.version, 8);
assert.deepEqual(Object.keys(initial.daily), [], 'rendering must not create progress records');
assert.equal(api.getPlanModeForDate(), 'alternating');
assert.equal(initial.intensiveProgramme.targetRangeMin, 30);
assert.equal(initial.intensiveProgramme.targetRangeMax, 42);
assert.equal(initial.intensiveProgramme.months.length, 42);
assert.equal(initial.intensiveProgramme.activePhaseId, 'az-104');
assert.equal(api.activeProgrammePhase().id, 'az-104');
assert.equal(api.studySessionForDate('2026-07-17').id, 'session-1');
assert.equal(api.studySessionForDate('2026-07-18').id, 'session-2-3');
assert.equal(api.studySessionForDate('2026-07-19').id, 'session-4-5');
assert.equal(api.programmePhaseForMonth(1).id, 'az-104');
assert.equal(api.programmePhaseForMonth(6).id, 'sc-300');
assert.equal(api.programmePhaseForMonth(24).id, 'terraform-004');
assert.equal(api.programmePhaseForMonth(42).id, 'consolidation');
assert.ok(api.stageForProgrammeMonth(api.programmePhaseForMonth(24), 24)[1].includes('Foundation'));
assert.equal(initial.intensiveProgramme.months[0].goals.labs.target, 6);
assert.equal(initial.intensiveProgramme.months[0].goals.independent.target, 2);
assert.equal(initial.intensiveProgramme.months[0].goals.assessments.target, 2);
assert.equal(initial.intensiveProgramme.months[0].goals.german.targetHours, 10);
assert.equal(initial.intensiveProgramme.months[0].weeks.length, 5);

// The weekly planner is a rolling seven-day view beginning on its selected start date.
assert.deepEqual(Array.from(api.getRollingPlanDates('2026-07-13')), [
  '2026-07-13','2026-07-14','2026-07-15','2026-07-16','2026-07-17','2026-07-18','2026-07-19'
]);
assert.deepEqual(Array.from(api.getRollingPlanDates('2026-07-16')), [
  '2026-07-16','2026-07-17','2026-07-18','2026-07-19','2026-07-20','2026-07-21','2026-07-22'
]);
api.setWeeklyPlanStart('2026-07-13');
api.renderWeek();
const rollingWeekHtml = getElement('view-week').innerHTML;
assert.ok(rollingWeekHtml.includes('ROLLING 7-DAY PLAN'));
assert.ok(rollingWeekHtml.includes('13 Jul'));
assert.ok(rollingWeekHtml.includes('19 Jul'));
assert.ok(!rollingWeekHtml.includes('>6 Jul<'));
api.setWeeklyPlanStart('2026-07-13');
api.setSelectedDate('2026-07-13');
api.setLastKnownToday('2026-07-13');
assert.equal(api.syncDateContext('2026-07-14'), true);
assert.equal(api.getWeeklyPlanStart(), '2026-07-14', 'a live rolling plan must advance to the new date');
assert.equal(api.getSelectedDate(), '2026-07-14', 'Today view must advance when it was following the previous date');

// Default schedule reserves Monday–Thursday and places all planned work on Friday–Sunday.
const defaults = JSON.parse(JSON.stringify(api.DEFAULT_WEEKLY_DAY_TYPES));
assert.equal(defaults.Monday, 'rest');
assert.equal(defaults.Tuesday, 'rest');
assert.equal(defaults.Wednesday, 'rest');
assert.equal(defaults.Thursday, 'rest');
assert.equal(defaults.Friday, 'azure');
assert.equal(defaults.Saturday, 'weekend-combined');
assert.equal(defaults.Sunday, 'weekend-combined');
for (const type of Object.values(defaults)) {
  assert.ok(['azure','karate','rest','azure-review','karate-review','weekend-combined'].includes(type));
}
for (const [mode, days] of Object.entries(api.DAY_PLANS)) {
  for (const [day, plan] of Object.entries(days)) {
    assert.equal(plan.tasks.length, 1, `${mode} ${day} must contain one task`);
    assert.ok(!Object.prototype.hasOwnProperty.call(plan.tasks[0], 'time'));
  }
}

// Current Azure position follows the supplied Microsoft Learn order and keeps content separate from mastery.
const azurePaths = initial.azPaths;
assert.deepEqual(Array.from(azurePaths, path => path.name), [
  'AZ-104: Prerequisites for Azure administrators',
  'AZ-104: Manage identities and governance in Azure',
  'AZ-104: Implement and manage storage in Azure',
  'AZ-104: Deploy and manage Azure compute resources',
  'AZ-104: Configure and manage virtual networks',
  'AZ-104: Monitor and back up Azure resources'
]);
assert.deepEqual(Array.from(azurePaths[0].modules, module => module.name), [
  'Introduction to Azure Cloud Shell',
  'Deploy Azure infrastructure by using JSON ARM templates'
]);
assert.ok(azurePaths[0].modules.every(module => module.complete));
assert.equal(azurePaths[0].status, 'complete');
assert.deepEqual(Array.from(azurePaths[1].modules, module => module.name), [
  'Understand Microsoft Entra ID',
  'Create, configure, and manage identities',
  'Describe the core architectural components of Azure',
  'Azure Policy initiatives',
  'Secure your Azure resources with Azure role-based access control',
  'Allow users to reset their password with Microsoft Entra self-service password reset'
]);
const entraOverview = api.currentAzureModule();
assert.equal(initial.azureFocus.currentPathId, 'az-identities');
assert.equal(entraOverview.name, 'Understand Microsoft Entra ID');
assert.equal(entraOverview.units.length, 1);
assert.equal(entraOverview.units.filter(unit => unit.complete).length, 0);
assert.equal(api.moduleContentPercent(entraOverview), 0);
assert.equal(api.moduleMasteryPercent(entraOverview), 0);
assert.equal(entraOverview.masteryStages.learn.complete, false);
assert.deepEqual(Array.from(api.AZURE_STAGE_DEFS, entry => entry[0]), ['learn','understand','perform','test','review','retain']);
api.setState(api.defaultState());
assert.equal(api.setAzureModuleContentComplete('az-identities','az-identities-entra-overview',true), true);
const checkedEntra = api.getState().azPaths.find(path => path.id === 'az-identities').modules[0];
assert.equal(checkedEntra.complete, true);
assert.equal(checkedEntra.masteryStages.learn.complete, true);
assert.equal(checkedEntra.masteryStages.understand.complete, false, 'module content completion must not equal mastery');
assert.equal(api.currentAzureModule().name, 'Create, configure, and manage identities');
api.setState(initial);

// Jion sequence knowledge is not treated as grading readiness.
const jion = api.currentKata();
assert.equal(jion.id, 'jion');
assert.equal(jion.sequenceProgress, 100);
assert.equal(jion.gradingReadiness, 0);
assert.equal(jion.sections[0].level, 5);
assert.ok(jion.sections.slice(1).every(section => section.level === 0));

// Each date has one day plan; weekend plans explicitly contain Azure, kata and 3rd Dan blocks.
const monday = '2026-07-13';
const friday = '2026-07-17';
const saturday = '2026-07-18';
const sunday = '2026-07-19';
const mondayPlan = api.getPlanForDate(monday);
const fridayPlan = api.getPlanForDate(friday);
const saturdayPlan = api.getPlanForDate(saturday);
const sundayPlan = api.getPlanForDate(sunday);
assert.equal(mondayPlan.tasks.length, 1);
assert.equal(fridayPlan.tasks.length, 1);
assert.equal(saturdayPlan.tasks.length, 1);
assert.equal(sundayPlan.tasks.length, 1);
assert.equal(mondayPlan.tasks[0].category, 'rest');
assert.equal(fridayPlan.tasks[0].category, 'azure');
assert.equal(saturdayPlan.tasks[0].category, 'combined');
assert.equal(sundayPlan.tasks[0].category, 'combined');
assert.equal(fridayPlan.tasks[0].module, 'Understand Microsoft Entra ID');
assert.equal(fridayPlan.tasks[0].learningPath, 'AZ-104: Manage identities and governance in Azure');
assert.ok(fridayPlan.tasks[0].checklist.some(step => step.includes('official learning material')));
assert.ok(fridayPlan.tasks[0].checklist.some(step => step.includes('Validate the result')));
assert.ok(saturdayPlan.tasks[0].title.includes('Azure'));
assert.ok(saturdayPlan.tasks[0].title.includes('Jion'));
assert.ok(saturdayPlan.tasks[0].title.includes('3rd Dan'));
assert.ok(saturdayPlan.tasks[0].checklist.some(step => step.startsWith('AZURE')));
assert.ok(saturdayPlan.tasks[0].checklist.some(step => step.startsWith('KATA')));
assert.ok(saturdayPlan.tasks[0].checklist.some(step => step.startsWith('3RD DAN')));
assert.equal(saturdayPlan.tasks[0].duration, 'Flexible across the day — no scheduled time');
assert.equal(Object.keys(api.getState().daily).length, 0, 'previewing tasks must not create daily data');

// Recording progress creates only the selected day record and supports partial completion.
const record = api.getDailyRecord(friday);
assert.equal(Object.keys(api.getState().daily).length, 1);
assert.equal(record.task.category, 'azure');
record.checks[`${record.task.id}::0`] = true;
assert.ok(api.dayCompletion(friday) > 0 && api.dayCompletion(friday) < 100);
record.task.checklist.forEach((_, index) => { record.checks[`${record.task.id}::${index}`] = true; });
assert.equal(api.dayCompletion(friday), 100);

// Missed-task suggestions stay in the same category and skip unsuitable days.
const nextAzure = Array.from(api.findNextSuitableDates(friday, 'azure', 3));
assert.ok(nextAzure.length >= 1);
assert.ok(nextAzure.every(key => api.getDayTypeForDate(key) === 'azure'));
const nextWeekend = Array.from(api.findNextSuitableDates(saturday, 'weekend-combined', 3));
assert.ok(nextWeekend.length >= 1);
assert.ok(nextWeekend.every(key => api.getDayTypeForDate(key) === 'weekend-combined'));

// Full task completion requires evidence and advances to the next ordered Microsoft Learn module.
api.setState(api.defaultState());
api.getDailyRecord(friday);
const formLike = values => {
  const map = new Map(Object.entries(values));
  return { get: key => map.get(key), entries: () => map.entries() };
};
assert.throws(() => api.applyTaskCompletion(friday, formLike({ finished:'yes', evidence:'', confidence:'3', masteryStage:'learn' })), /Add evidence/);
api.applyTaskCompletion(friday, formLike({
  finished:'yes', summary:'Completed Understand Microsoft Entra ID', evidence:'Module completed; key Entra concepts explained in my own words.',
  confidence:'3', masteryStage:'learn', notUnderstood:'', resourcesCreated:'no', resourcesCleaned:'not-applicable', scheduleReview:'yes', technicalMinutes:'90', portfolioMinutes:'0', germanMinutes:'30', labCompleted:'no', assessmentCompleted:'yes'
}));
const identitiesPath = api.getState().azPaths.find(path => path.id === 'az-identities');
const completedEntra = identitiesPath.modules[0];
assert.equal(completedEntra.complete, true);
assert.equal(completedEntra.masteryStages.learn.complete, true);
assert.equal(api.currentAzureModule().name, 'Create, configure, and manage identities');
assert.equal(api.getState().daily[friday].status, 'completed');
const intensiveWeek = api.getIntensiveWeek('2026-07-13');
const intensity = api.getWeekIntensityMetrics('2026-07-13');
assert.equal(intensiveWeek.sessions['session-1'].status, 'completed');
assert.equal(intensity.technicalHours, 1.5);
assert.equal(intensity.germanHours, 0.5);
assert.equal(intensiveWeek.labsCompleted, 0);
assert.equal(intensiveWeek.assessmentsCompleted, 1);
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.sessions['session-1'], 'officialModule'));
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.sessions['session-2'], 'possibleCost'));
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.sessions['session-3'], 'independentResult'));
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.sessions['session-4'], 'retentionDate'));
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.sessions['session-5'], 'gitActivity'));
assert.ok(Object.prototype.hasOwnProperty.call(intensiveWeek.german, 'daysCompleted'));

// Flexible weekend completion records Azure, Jion and 3rd Dan evidence together.
api.setState(api.defaultState());
api.getDailyRecord(saturday);
api.applyTaskCompletion(saturday, formLike({
  finished:'yes', summary:'Completed all Saturday focus blocks', evidence:'Azure output and Jion video reference 001', confidence:'3',
  masteryStage:'perform', notUnderstood:'', resourcesCreated:'yes', resourcesCleaned:'yes', technicalMinutes:'180', portfolioMinutes:'0', germanMinutes:'0',
  labCompleted:'yes', assessmentCompleted:'no', scheduleAzureReview:'yes', karateSection:'Kata', kata:'Jion', improved:'Sequence flow', weak:'Transitions',
  rightRating:'3', leftRating:'2', instructorFeedback:'Keep the front knee stable', mainCorrection:'Improve transitions', scheduleKarateReview:'yes'
}));
const completedJion = api.currentKata();
assert.equal(completedJion.gradingReadiness, 0);
assert.equal(completedJion.mainCorrection, 'Improve transitions');
assert.equal(completedJion.evidence, 'Azure output and Jion video reference 001');
const linkedGrading = api.getState().syllabus.find(item => item.id === api.getState().daily[saturday].task.refs.syllabusId);
assert.equal(linkedGrading.ratings.right, 3);
assert.equal(linkedGrading.ratings.left, 2);
const saturdayWeek = api.getIntensiveWeek('2026-07-13');
assert.equal(saturdayWeek.sessions['session-2'].status, 'completed');
assert.equal(saturdayWeek.sessions['session-3'].status, 'completed');
assert.equal(saturdayWeek.sessions['session-2'].durationHours, 1.5);
assert.equal(saturdayWeek.sessions['session-3'].durationHours, 1.5);

// Old state is migrated additively and custom progress is retained.
const migrated = api.mergeDefaults({
  version: 4,
  profile: { name: 'André' },
  settings: { programmeMode:'normal' },
  notes: [{ id:'kept-note', title:'Keep me', body:'Existing data', createdAt:'2026-01-01T00:00:00Z' }],
  daily: { '2026-07-01': { notes:'Existing daily note', evidence:'Existing evidence', checks:{'old::0':true} } },
  katas: [{ id:'jion', notes:'Existing Jion note', sequenceProgress:100, status:'sequence-known' }]
});
assert.equal(migrated.version, 8);
assert.equal(migrated.notes[0].id, 'kept-note');
assert.equal(migrated.daily['2026-07-01'].notes, 'Existing daily note');
assert.equal(migrated.daily['2026-07-01'].evidence, 'Existing evidence');
assert.equal(migrated.katas.find(kata => kata.id === 'jion').notes, 'Existing Jion note');
assert.equal(migrated.settings.weeklyDayTypes.Monday, 'rest');
assert.equal(migrated.settings.weeklyDayTypes.Tuesday, 'rest');
assert.equal(migrated.settings.weeklyDayTypes.Saturday, 'weekend-combined');
assert.equal(migrated.settings.weeklyDayTypes.Sunday, 'weekend-combined');
assert.equal(migrated.roadmap.months.length, 6);
assert.ok(migrated.roadmap.months.every(month => month.weeks.length >= 4));
assert.equal(migrated.intensiveProgramme.months.length, 42);
assert.equal(migrated.intensiveProgramme.phases.length, 10);
assert.equal(migrated.intensiveProgramme.skills.length, 10);
assert.equal(migrated.intensiveProgramme.months[23].phaseId, 'terraform-004');
assert.equal(migrated.intensiveProgramme.months[41].phaseId, 'consolidation');
assert.ok(migrated.intensiveProgramme.months[0].plan.cleanupRequirements !== undefined);
assert.equal(migrated.azureFocus.currentPathId, 'az-identities');
assert.equal(migrated.azureFocus.currentModuleId, 'az-identities-entra-overview');
assert.ok(migrated.azPaths.find(path => path.id === 'az-prerequisites').modules.every(module => module.complete));
assert.deepEqual(Array.from(migrated.azPaths.find(path => path.id === 'az-monitor').modules, module => module.name), [
  'Introduction to Azure Backup',
  'Protect your virtual machines by using Azure Backup',
  'Monitor your Azure virtual machines with Azure Monitor'
]);
assert.deepEqual(Array.from(migrated.azPaths, path => path.modules.length), [2,6,4,5,8,3]);
assert.ok(!migrated.azPaths.flatMap(path => path.modules).some(module => module.name === 'Administrative units'));
const migratedLegacyAzure = api.mergeDefaults({
  version:7,
  azureFocus:{currentPathId:'az-prerequisites',currentModuleId:'az-prerequisites-m4'},
  azPaths:[
    {id:'az-prerequisites',modules:[
      {id:'az-prerequisites-m1',name:'Azure Cloud Shell',units:[{id:'az-prerequisites-m1-u1',number:1,name:'Old',complete:false}]},
      {id:'az-prerequisites-m4',name:'Deploy Azure infrastructure by using JSON ARM templates',units:[
        {id:'az-prerequisites-m4-u1',number:1,name:'Unit 1',complete:true},
        {id:'az-prerequisites-m4-u2',number:2,name:'Unit 2',complete:true},
        {id:'az-prerequisites-m4-u3',number:3,name:'Unit 3',complete:true},
        {id:'az-prerequisites-m4-u4',number:4,name:'Unit 4',complete:true},
        {id:'az-prerequisites-m4-u5',number:5,name:'Unit 5',complete:false},
        {id:'az-prerequisites-m4-u6',number:6,name:'Unit 6',complete:false},
        {id:'az-prerequisites-m4-u7',number:7,name:'Unit 7',complete:false}
      ]}
    ]},
    {id:'az-identities',modules:[{id:'az-identities-m4',name:'Azure RBAC',units:[{id:'old',number:1,name:'Old',complete:false}]}]}
  ],
  azureLabs:[{id:'legacy-lab',pathId:'az-identities',moduleId:'az-identities-m4',moduleName:'Azure RBAC'}]
});
assert.ok(migratedLegacyAzure.azPaths.find(path => path.id === 'az-prerequisites').modules.every(module => module.complete));
assert.equal(migratedLegacyAzure.azureFocus.currentModuleId, 'az-identities-entra-overview');
assert.equal(migratedLegacyAzure.azureLabs[0].moduleId, 'az-identities-rbac');
assert.equal(migratedLegacyAzure.azureLabs[0].moduleName, 'Secure your Azure resources with Azure role-based access control');

// Schema 6 schedule migration preserves progressed records and regenerates only unstarted future plans.
const migratedSchedule = api.mergeDefaults({
  version: 6,
  settings: { weeklyDayTypes: { Monday:'azure', Tuesday:'karate', Wednesday:'azure', Thursday:'karate', Friday:'azure', Saturday:'karate', Sunday:'azure' } },
  scheduleOverrides: { '2026-07-18':'karate', '2026-07-19':'azure' },
  daily: {
    '2026-07-18': { dayType:'karate', status:'not-started', checks:{}, notes:'', evidence:'', task:{ id:'old-sat', category:'karate', checklist:['Old'] } },
    '2026-07-19': { dayType:'azure', status:'in-progress', checks:{'old::0':true}, notes:'Progress must remain', evidence:'Evidence', task:{ id:'old-sun', category:'azure', checklist:['Old'] } }
  }
});
assert.equal(migratedSchedule.settings.weeklyDayTypes.Monday, 'rest');
assert.equal(migratedSchedule.settings.weeklyDayTypes.Friday, 'azure');
assert.equal(migratedSchedule.settings.weeklyDayTypes.Saturday, 'weekend-combined');
assert.equal(migratedSchedule.daily['2026-07-18'].dayType, 'weekend-combined');
assert.equal(migratedSchedule.daily['2026-07-18'].task, null);
assert.equal(migratedSchedule.scheduleOverrides['2026-07-18'], undefined);
assert.equal(migratedSchedule.daily['2026-07-19'].dayType, 'azure', 'progressed future record must remain unchanged');
assert.equal(migratedSchedule.daily['2026-07-19'].notes, 'Progress must remain');

// Warning, recovery and exam gates are evidence-based.
api.setState(api.defaultState());
['2026-06-22','2026-06-29','2026-07-06'].forEach((key, index) => {
  const week=api.getIntensiveWeek(key);
  week.quality.energy=2;
  week.weakAreaCount=index + 1;
});
const warnings=Array.from(api.programmeWarnings());
assert.ok(warnings.some(text => text.includes('Fewer than 8 technical hours')));
assert.ok(warnings.some(text => text.includes('No practical lab')));
assert.ok(warnings.some(text => text.includes('No assessment')));
assert.ok(warnings.some(text => text.includes('German study')));
assert.equal(api.weekRequiresReduction(api.getIntensiveWeek('2026-07-06')), true);
api.setState(api.defaultState());
['2026-05-25','2026-06-01','2026-06-08','2026-06-15','2026-06-22','2026-06-29','2026-07-06'].forEach(key => {
  const week=api.getIntensiveWeek(key);
  week.sessions['session-1'].durationHours=1;
});
assert.equal(api.recoveryWeekDue().due, true);
const readyPhase=api.activeProgrammePhase();
Object.assign(readyPhase,{objectivesStudied:true,labsCompletePercent:80,independentReady:true,criticalWeakAreas:0,practiceScores:'80,84,88',portfolioPercent:75,retentionPassed:true});
assert.equal(api.examReadiness(readyPhase).eligible, true);
readyPhase.labsCompletePercent=79;
assert.equal(api.examReadiness(readyPhase).eligible, false);

// Recall and kata retention logic still work.
const fresh = api.defaultState();
api.setState(fresh);
const currentEntra = api.currentAzureModule();
assert.equal(api.recordAzureReview('az-identities', currentEntra.id, 'independent'), true);
assert.equal(currentEntra.lastRecallResult, 'independent');
assert.ok(currentEntra.nextReview > currentEntra.lastReviewed);
const currentJion = api.currentKata();
currentJion.sections.forEach(section => { section.level = 5; });
api.updateKataProgressFromSections(currentJion);
assert.equal(currentJion.gradingReadiness, 100);
assert.equal(currentJion.status, 'grading-ready');
assert.equal(api.getNextKataInterval(14), 30);

// All principal views render the new structures without creating phantom records.
api.setState(api.defaultState());
api.setSelectedDate(friday);
api.renderToday();
const todayHtml = getElement('view-today').innerHTML;
assert.ok(todayHtml.toLowerCase().includes('today’s main task'));
assert.ok(todayHtml.includes('Cloud study focus'));
assert.ok(todayHtml.includes('Kata focus'));
assert.ok(todayHtml.includes('Grading-section focus'));
assert.equal(Object.keys(api.getState().daily).length, 0);
api.setSelectedDate(saturday);
api.renderToday();
const saturdayHtml = getElement('view-today').innerHTML;
assert.ok(saturdayHtml.includes('Flexible across the day — no scheduled time'));
assert.ok(saturdayHtml.includes('<span>Azure</span>'));
assert.ok(saturdayHtml.includes('<span>Kata</span>'));
assert.ok(saturdayHtml.includes('<span>3rd Dan</span>'));
assert.ok(saturdayHtml.includes('AZURE —'));
assert.ok(saturdayHtml.includes('KATA —'));
assert.ok(saturdayHtml.includes('3RD DAN —'));
api.renderWeek();
assert.ok(getElement('view-week').innerHTML.toLowerCase().includes('rolling 7-day plan'));
assert.ok(getElement('view-week').innerHTML.includes('Saturday and Sunday each contain Azure, Jion kata and 3rd Dan'));
api.renderAzure();
const azureHtml = getElement('view-azure').innerHTML;
assert.ok(azureHtml.includes('Content completion'));
assert.ok(azureHtml.includes('Mastery'));
assert.ok(azureHtml.includes('Understand Microsoft Entra ID'));
assert.ok(azureHtml.includes('Create, configure, and manage identities'));
assert.ok(azureHtml.includes('Current AZ-104 roadmap position'));
assert.ok(azureHtml.includes('Microsoft Learn module completed'));
assert.ok(azureHtml.includes('Retain'));
api.renderDan();
assert.ok(getElement('view-dan').innerHTML.includes('Current grading section'));
api.renderKata();
assert.ok(getElement('view-kata').innerHTML.includes('Jion'));
assert.ok(getElement('view-kata').innerHTML.includes('Reliable grading-standard performance demonstrated'));
api.renderProgramme();
const programmeHtml = getElement('view-programme').innerHTML;
assert.ok(programmeHtml.includes('30–42 months'));
assert.ok(programmeHtml.includes('Intensive weekly record'));
assert.ok(programmeHtml.includes('42-month expandable'));
assert.ok(programmeHtml.includes('German weekly record'));
assert.ok(programmeHtml.toLowerCase().includes('exam booking gate'));
assert.ok(programmeHtml.includes('Terraform Associate 004'));
assert.ok(programmeHtml.includes('Weekly workload standard'));
assert.ok(programmeHtml.includes('Recovery-week protocol'));
assert.ok(programmeHtml.includes('Official module'));
assert.ok(programmeHtml.includes('Possible cost'));
assert.ok(programmeHtml.includes('Independent practical challenge'));
assert.ok(programmeHtml.includes('Retention review date'));
assert.ok(programmeHtml.includes('Git activity'));
assert.ok(programmeHtml.includes('Detailed monthly plan'));
assert.ok(programmeHtml.includes('Current level'));
api.renderProgress();
const progressHtml = getElement('view-progress').innerHTML;
assert.ok(progressHtml.includes('Monthly → weekly goals'));
assert.ok(progressHtml.includes('What lies ahead'));
assert.ok(progressHtml.includes('Progress report'));
assert.ok(progressHtml.includes('Overall karate grading readiness'));
api.renderNotes();
assert.ok(getElement('view-notes').innerHTML.includes('Weekly review'));
api.renderSettings();
const settingsHtml = getElement('view-settings').innerHTML;
assert.ok(settingsHtml.includes('Weekly focus settings'));
assert.ok(settingsHtml.includes('Intensive study targets'));
assert.ok(settingsHtml.includes('Microsoft OneDrive'));
assert.ok(settingsHtml.includes('Files.ReadWrite.AppFolder'));

// Microsoft and OneDrive integration remains restricted and compatible.
assert.deepEqual(Array.from(api.MICROSOFT_GRAPH_SCOPES), ['Files.ReadWrite.AppFolder']);
assert.equal(api.ONEDRIVE_STATE_FILE, 'karate-azure-progress-state.json');
assert.equal(api.getCurrentRedirectUri(), 'http://localhost:8080/');
assert.ok(api.oneDriveStateUrl().endsWith('/me/drive/special/approot:/karate-azure-progress-state.json:/content'));
assert.equal(api.loadCloudProvider(), 'supabase');

// Required dialogs and versioned assets are included in the shell.
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
assert.ok(html.includes('id="task-completion-dialog"'));
assert.ok(html.includes('id="task-completion-form"'));
assert.ok(html.includes('id="reschedule-dialog"'));
assert.ok(html.includes('app.js?v=1.9.6'));
assert.ok(html.includes('id="view-programme"'));
assert.ok(html.includes('data-view="programme"'));
assert.ok(!/05:30|22:00|10:00\s*pm/i.test(code));

console.log('Smoke tests passed');
