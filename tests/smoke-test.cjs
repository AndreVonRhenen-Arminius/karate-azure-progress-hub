const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');

class ClassList {
  add() {}
  remove() {}
  toggle() {}
}
class Element {
  constructor(id='') {
    this.id=id; this.innerHTML=''; this.textContent=''; this.value=''; this.checked=false;
    this.files=[]; this.classList=new ClassList(); this.dataset={}; this.style={};
  }
  addEventListener() {}
  removeEventListener() {}
  showModal() {}
  click() {}
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
  Notification: function(){},
  Blob,
  URL,
  Intl,
  Date,
  Math,
  JSON,
  Object,
  Array,
  Map,
  Set,
  Promise,
  String,
  Number,
  Boolean,
  structuredClone,
  crypto: require('crypto').webcrypto,
  CSS: { escape: value => String(value) },
  setTimeout: fn => { fn(); return 1; },
  clearTimeout: () => {},
  setInterval: () => 1,
  clearInterval: () => {},
};
context.Notification.permission = 'denied';
vm.createContext(context);
const appPath = process.argv[2] || path.join(__dirname, '..', 'app.js');
const code = fs.readFileSync(appPath, 'utf8');
vm.runInContext(code, context, {filename:'app.js'});
vm.runInContext(`globalThis.testApi = {
  getState: () => state,
  setState: value => { state = value; },
  setSelectedDate: value => { selectedDateKey = value; },
  defaultState,
  mergeDefaults,
  dayCompletion,
  getDailyRecord,
  getPlanModeForDate,
  renderToday,
  renderWeek,
  renderAzure,
  renderDan,
  renderKata,
  renderProgress,
  renderNotes,
  renderSettings,
  getAzurePriority,
  getDanPriority,
  getKataPriority,
  recordAzureReview,
  updateKataProgressFromSections,
  getNextKataInterval,
  addDays,
  DAY_PLANS,
  APP_VERSION,
  MICROSOFT_GRAPH_SCOPES,
  oneDriveStateUrl,
  getCurrentRedirectUri,
  loadCloudProvider
};`, context);

const api = context.testApi;
const initial = api.getState();
assert.equal(api.APP_VERSION, '1.7.0', 'application should be version 1.7.0');
assert.equal(initial.version, 4, 'state schema should remain version 4');
assert.deepEqual(Object.keys(initial.daily), [], 'rendering should not create daily records');

for (const [mode, days] of Object.entries(api.DAY_PLANS)) {
  for (const [day, plan] of Object.entries(days)) {
    assert.equal(plan.tasks.length, 1, `${mode} ${day} should contain one task`);
    assert.ok(!Object.prototype.hasOwnProperty.call(plan.tasks[0], 'time'), `${mode} ${day} should not contain a fixed time`);
  }
}

const monday='2026-07-13';
const record=api.getDailyRecord(monday);
assert.equal(record.planMode,'normal');
const mondayTask=api.DAY_PLANS.normal.Monday.tasks[0];
mondayTask.items.forEach((_,index)=> { record.checks[`${mondayTask.id}::${index}`]=true; });
assert.equal(api.dayCompletion(monday),100);
api.getState().settings.programmeMode='minimum';
assert.equal(api.getPlanModeForDate(monday),'normal');
assert.equal(api.dayCompletion(monday),100);

const migrated=api.mergeDefaults({
  version:3,
  settings:{programmeMode:'normal'},
  daily:{
    '2026-07-14':{
      planMode:'normal',
      checks:{'new-kata-am::0':true,'tue-log-am::0':true}
    }
  }
});
assert.equal(migrated.version,4);
assert.equal(migrated.daily['2026-07-14'].checks['dan-group-a-am::4'],true,'old kata checklist should migrate into the combined Tuesday task');
assert.equal(migrated.daily['2026-07-14'].checks['dan-group-a-am::7'],true,'old log checklist should migrate into the combined Tuesday task');

const fresh=api.defaultState();
api.setState(fresh);
assert.equal(api.getAzurePriority().moduleId,'az-prerequisites-m1');
assert.equal(api.getDanPriority().itemId,'kihon-1');
assert.equal(api.getKataPriority().kataId,'jion');

const azureModule=fresh.azPaths[0].modules[0];
assert.equal(api.recordAzureReview(fresh.azPaths[0].id,azureModule.id,'independent'),true);
assert.equal(azureModule.lastRecallResult,'independent');
assert.equal(azureModule.evidence.recalled,true);
assert.ok(azureModule.nextReview > azureModule.lastReviewed);
assert.equal(azureModule.recallHistory.length,1);

const jion=fresh.katas.find(kata=>kata.id==='jion');
jion.status='learning';
jion.sections.forEach(section=> { section.level=5; });
api.updateKataProgressFromSections(jion);
assert.equal(jion.sequenceProgress,100);
assert.equal(jion.status,'sequence-known');
assert.equal(api.getNextKataInterval(14),30);

api.setSelectedDate('2026-07-13');
api.renderToday();
const todayHtml=getElement('view-today').innerHTML;
assert.ok(todayHtml.includes('Single task for this day'));
assert.ok(todayHtml.includes('Kata focus'));
assert.ok(todayHtml.includes('3rd Dan grading focus'));
assert.equal(Object.keys(api.getState().daily).length,0,'viewing Today should not create an empty daily record');


api.renderWeek();
assert.ok(getElement('view-week').innerHTML.includes('one flexible task'));
api.renderAzure();
assert.ok(getElement('view-azure').innerHTML.includes('Azure lab journal'));
assert.ok(getElement('view-azure').innerHTML.includes('Active-recall questions'));
api.renderDan();
assert.ok(getElement('view-dan').innerHTML.includes('Current grading section to focus on'));
api.renderProgress();
assert.ok(getElement('view-progress').innerHTML.includes('Azure lab journals'));
api.renderNotes();
assert.ok(getElement('view-notes').innerHTML.includes('Weekly review'));
api.renderSettings();
assert.ok(getElement('view-settings').innerHTML.includes('One flexible task per day'));
assert.ok(getElement('view-settings').innerHTML.includes('Microsoft OneDrive'));
assert.ok(getElement('view-settings').innerHTML.includes('Sign in with Microsoft'));
assert.ok(getElement('view-settings').innerHTML.includes('Files.ReadWrite.AppFolder'));
assert.deepEqual(Array.from(api.MICROSOFT_GRAPH_SCOPES), ['Files.ReadWrite.AppFolder']);
assert.equal(api.getCurrentRedirectUri(), 'http://localhost:8080/');
assert.ok(api.oneDriveStateUrl().endsWith('/me/drive/special/approot:/karate-azure-progress-state.json:/content'));
assert.equal(api.loadCloudProvider(), 'supabase', 'legacy installations should retain Supabase as the default provider');

jion.status='complete';
jion.sequenceProgress=100;
api.renderKata();
const kataHtml=getElement('view-kata').innerHTML;
assert.ok(kataHtml.includes('Recommended kata focus'));
assert.ok(kataHtml.includes('Sequence known and retention'));
assert.ok(kataHtml.indexOf('Jion') < kataHtml.indexOf('Currently learning'));

console.log('Smoke tests passed');
