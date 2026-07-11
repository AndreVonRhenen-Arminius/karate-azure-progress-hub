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
  defaultState, mergeDefaults, dayCompletion, getDailyRecord, getPlanForDate, getTaskForDate,
  getDayTypeForDate, getPlanModeForDate, renderToday, renderWeek, renderAzure, renderDan,
  renderKata, renderProgress, renderNotes, renderSettings, getAzurePriority, getDanPriority,
  getKataPriority, recordAzureReview, updateKataProgressFromSections, getNextKataInterval,
  findNextSuitableDates, applyTaskCompletion, moduleContentPercent, moduleMasteryPercent, pathContentPercent,
  pathMasteryPercent, currentAzureModule, currentAzureUnit, currentKata, addDays,
  DAY_PLANS, DEFAULT_WEEKLY_DAY_TYPES, AZURE_STAGE_DEFS, DAY_TYPE_OPTIONS, APP_VERSION,
  STATE_VERSION, MICROSOFT_GRAPH_SCOPES, oneDriveStateUrl, getCurrentRedirectUri,
  loadCloudProvider, ONEDRIVE_STATE_FILE
};`, context);

const api = context.testApi;
const initial = api.getState();
assert.equal(api.APP_VERSION, '1.8.0');
assert.equal(api.STATE_VERSION, 5);
assert.equal(initial.version, 5);
assert.deepEqual(Object.keys(initial.daily), [], 'rendering must not create progress records');
assert.equal(api.getPlanModeForDate(), 'alternating');

// Editable alternating defaults contain one category per day and preserve a rest day.
const defaults = JSON.parse(JSON.stringify(api.DEFAULT_WEEKLY_DAY_TYPES));
assert.equal(defaults.Monday, 'karate');
assert.equal(defaults.Tuesday, 'azure');
assert.equal(defaults.Wednesday, 'rest');
for (const type of Object.values(defaults)) {
  assert.ok(['azure','karate','rest','azure-review','karate-review'].includes(type));
}
for (const [mode, days] of Object.entries(api.DAY_PLANS)) {
  for (const [day, plan] of Object.entries(days)) {
    assert.equal(plan.tasks.length, 1, `${mode} ${day} must contain one task`);
    assert.ok(!Object.prototype.hasOwnProperty.call(plan.tasks[0], 'time'));
  }
}

// Current Azure position is seeded exactly and content remains separate from mastery.
const arm = api.currentAzureModule();
assert.equal(arm.name, 'Deploy Azure infrastructure by using JSON ARM templates');
assert.equal(arm.currentUnit, 5);
assert.equal(arm.units.length, 7);
assert.equal(arm.units.filter(unit => unit.complete).length, 4);
assert.equal(api.currentAzureUnit(arm).name, 'Exercise — Add parameters and outputs to an ARM template');
assert.equal(api.moduleContentPercent(arm), 57);
assert.equal(api.moduleMasteryPercent(arm), 0);
assert.equal(arm.masteryStages.learn.partial, true);
assert.equal(arm.masteryStages.perform.partial, true);
assert.deepEqual(Array.from(api.AZURE_STAGE_DEFS, entry => entry[0]), ['learn','understand','perform','test','review','retain']);

// Jion sequence knowledge is not treated as grading readiness.
const jion = api.currentKata();
assert.equal(jion.id, 'jion');
assert.equal(jion.sequenceProgress, 100);
assert.equal(jion.gradingReadiness, 0);
assert.equal(jion.sections[0].level, 5);
assert.ok(jion.sections.slice(1).every(section => section.level === 0));

// Each generated day has exactly one main task and never combines categories.
const monday = '2026-07-13';
const tuesday = '2026-07-14';
const wednesday = '2026-07-15';
const mondayPlan = api.getPlanForDate(monday);
const tuesdayPlan = api.getPlanForDate(tuesday);
const wednesdayPlan = api.getPlanForDate(wednesday);
assert.equal(mondayPlan.tasks.length, 1);
assert.equal(tuesdayPlan.tasks.length, 1);
assert.equal(wednesdayPlan.tasks.length, 1);
assert.equal(mondayPlan.tasks[0].category, 'karate');
assert.equal(tuesdayPlan.tasks[0].category, 'azure');
assert.equal(wednesdayPlan.tasks[0].category, 'rest');
assert.ok(tuesdayPlan.tasks[0].title.includes('ARM-template Unit 5'));
assert.ok(tuesdayPlan.tasks[0].checklist.some(step => step.includes('allowed value')));
assert.ok(tuesdayPlan.tasks[0].checklist.some(step => step.includes('Clean up')));
assert.ok(mondayPlan.tasks[0].title.includes('Jion'));
assert.equal(Object.keys(api.getState().daily).length, 0, 'previewing tasks must not create daily data');

// Recording progress creates only the selected day record and supports partial completion.
const record = api.getDailyRecord(tuesday);
assert.equal(Object.keys(api.getState().daily).length, 1);
assert.equal(record.task.category, 'azure');
record.checks[`${record.task.id}::0`] = true;
assert.ok(api.dayCompletion(tuesday) > 0 && api.dayCompletion(tuesday) < 100);
record.task.checklist.forEach((_, index) => { record.checks[`${record.task.id}::${index}`] = true; });
assert.equal(api.dayCompletion(tuesday), 100);

// Missed-task suggestions stay in the same category and skip unsuitable days.
const nextAzure = Array.from(api.findNextSuitableDates(tuesday, 'azure', 3));
assert.ok(nextAzure.length >= 1);
assert.ok(nextAzure.every(key => api.getDayTypeForDate(key).startsWith('azure')));
const nextKarate = Array.from(api.findNextSuitableDates(monday, 'karate', 3));
assert.ok(nextKarate.every(key => api.getDayTypeForDate(key).startsWith('karate')));

// Full task completion requires evidence and cannot prematurely complete the ARM Learn stage.
api.setState(api.defaultState());
api.getDailyRecord(tuesday);
const formLike = values => {
  const map = new Map(Object.entries(values));
  return { get: key => map.get(key), entries: () => map.entries() };
};
assert.throws(() => api.applyTaskCompletion(tuesday, formLike({ finished:'yes', evidence:'', confidence:'3', masteryStage:'learn' })), /Add evidence/);
api.applyTaskCompletion(tuesday, formLike({
  finished:'yes', summary:'Completed Unit 5', evidence:'Allowed deployment succeeded; invalid value failed; endpoint captured; resources removed.',
  confidence:'3', masteryStage:'learn', notUnderstood:'', resourcesCreated:'yes', resourcesCleaned:'yes', scheduleReview:'yes'
}));
let completedArm = api.currentAzureModule();
assert.equal(completedArm.units.filter(unit => unit.complete).length, 5);
assert.equal(completedArm.complete, false, 'units 6 and 7 must remain outstanding');
assert.equal(completedArm.masteryStages.learn.complete, false, 'Learn cannot be complete until all module units are complete');
assert.equal(completedArm.masteryStages.learn.partial, true);
assert.equal(api.getState().daily[tuesday].status, 'completed', 'the Unit 5 daily task itself can be complete');

// Karate completion records both sides and evidence without making Jion grading-ready.
api.setState(api.defaultState());
api.getDailyRecord(monday);
api.applyTaskCompletion(monday, formLike({
  finished:'yes', summary:'Dedicated Jion session', evidence:'Video reference 001', confidence:'3', karateSection:'Kata', kata:'Jion',
  improved:'Sequence flow', weak:'Transitions', rightRating:'3', leftRating:'2', instructorFeedback:'Keep the front knee stable',
  mainCorrection:'Improve transitions', scheduleReview:'yes'
}));
const completedJion = api.currentKata();
assert.equal(completedJion.gradingReadiness, 0);
assert.equal(completedJion.mainCorrection, 'Improve transitions');
assert.equal(completedJion.evidence, 'Video reference 001');
const linkedGrading = api.getState().syllabus.find(item => item.id === api.getState().daily[monday].task.refs.syllabusId);
assert.equal(linkedGrading.ratings.right, 3);
assert.equal(linkedGrading.ratings.left, 2);

// Old state is migrated additively and custom progress is retained.
const migrated = api.mergeDefaults({
  version: 4,
  profile: { name: 'André' },
  settings: { programmeMode:'normal' },
  notes: [{ id:'kept-note', title:'Keep me', body:'Existing data', createdAt:'2026-01-01T00:00:00Z' }],
  daily: { '2026-07-01': { notes:'Existing daily note', evidence:'Existing evidence', checks:{'old::0':true} } },
  katas: [{ id:'jion', notes:'Existing Jion note', sequenceProgress:100, status:'sequence-known' }]
});
assert.equal(migrated.version, 5);
assert.equal(migrated.notes[0].id, 'kept-note');
assert.equal(migrated.daily['2026-07-01'].notes, 'Existing daily note');
assert.equal(migrated.daily['2026-07-01'].evidence, 'Existing evidence');
assert.equal(migrated.katas.find(kata => kata.id === 'jion').notes, 'Existing Jion note');
assert.equal(migrated.settings.weeklyDayTypes.Wednesday, 'rest');
assert.equal(migrated.roadmap.months.length, 6);
assert.ok(migrated.roadmap.months.every(month => month.weeks.length >= 4));

// Recall and kata retention logic still work.
const fresh = api.defaultState();
api.setState(fresh);
const currentArm = api.currentAzureModule();
assert.equal(api.recordAzureReview('az-prerequisites', currentArm.id, 'independent'), true);
assert.equal(currentArm.lastRecallResult, 'independent');
assert.ok(currentArm.nextReview > currentArm.lastReviewed);
const currentJion = api.currentKata();
currentJion.sections.forEach(section => { section.level = 5; });
api.updateKataProgressFromSections(currentJion);
assert.equal(currentJion.gradingReadiness, 100);
assert.equal(currentJion.status, 'grading-ready');
assert.equal(api.getNextKataInterval(14), 30);

// All principal views render the new structures without creating phantom records.
api.setState(api.defaultState());
api.setSelectedDate(monday);
api.renderToday();
const todayHtml = getElement('view-today').innerHTML;
assert.ok(todayHtml.toLowerCase().includes('today’s main task'));
assert.ok(todayHtml.includes('Azure focus'));
assert.ok(todayHtml.includes('Kata focus'));
assert.ok(todayHtml.includes('Grading-section focus'));
assert.equal(Object.keys(api.getState().daily).length, 0);
api.renderWeek();
assert.ok(getElement('view-week').innerHTML.toLowerCase().includes('editable alternating week'));
assert.ok(getElement('view-week').innerHTML.includes('Only one main task'));
api.renderAzure();
const azureHtml = getElement('view-azure').innerHTML;
assert.ok(azureHtml.includes('Content completion'));
assert.ok(azureHtml.includes('Mastery'));
assert.ok(azureHtml.includes('Exercise — Add parameters and outputs'));
assert.ok(azureHtml.includes('Retain'));
api.renderDan();
assert.ok(getElement('view-dan').innerHTML.includes('Current grading section'));
api.renderKata();
assert.ok(getElement('view-kata').innerHTML.includes('Jion'));
assert.ok(getElement('view-kata').innerHTML.includes('Reliable grading-standard performance demonstrated'));
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
assert.ok(settingsHtml.includes('Alternating programme settings'));
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
assert.ok(html.includes('app.js?v=1.8.0'));
assert.ok(!/05:30|22:00|10:00\s*pm/i.test(code));

console.log('Smoke tests passed');
