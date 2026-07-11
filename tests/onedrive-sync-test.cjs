const fs = require('fs');
const vm = require('vm');
const assert = require('assert');
const path = require('path');

class ClassList { add() {} remove() {} toggle() {} }
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
  window: {
    scrollTo(){}, addEventListener(){},
    location: { origin:'http://localhost:8080', pathname:'/', reload(){} },
    KA_MICROSOFT_CONFIG: {},
    msal: {}
  },
  location: { origin:'http://localhost:8080', pathname:'/', reload(){} },
  Notification: function(){},
  Blob,
  URL,
  Response,
  Headers,
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
  fetch: async () => { throw new Error('fetch mock not configured'); }
};
context.Notification.permission = 'denied';
vm.createContext(context);
const appPath = path.join(__dirname, '..', 'app.js');
vm.runInContext(fs.readFileSync(appPath, 'utf8'), context, {filename:'app.js'});
vm.runInContext(`globalThis.oneDriveTestApi = {
  defaultState,
  mergeDefaults,
  oneDriveStateUrl,
  readOneDriveState,
  writeOneDriveState,
  pushOneDrive,
  pullOneDrive,
  setClient: (client, account) => {
    microsoftClient = client;
    microsoftAccount = account;
    cloudProvider = 'onedrive';
  },
  setState: value => { state = value; },
  getState: () => state,
  setHasLocalState: value => { hasLocalState = value; },
  getCloudDirty: () => cloudDirty
};`, context);

(async () => {
  const api = context.oneDriveTestApi;
  const tokenClient = {
    acquireTokenSilent: async request => {
      assert.equal(request.account.username, 'andre@example.com');
      assert.deepEqual(Array.from(request.scopes), ['Files.ReadWrite.AppFolder']);
      return { accessToken: 'test-token' };
    }
  };
  api.setClient(tokenClient, { username:'andre@example.com', name:'Andre' });

  let request;
  context.fetch = async (url, options={}) => {
    request = { url, options };
    return new Response(JSON.stringify({ id:'drive-item-1' }), { status:201, headers:{'Content-Type':'application/json'} });
  };
  const state = api.defaultState();
  state.updatedAt = '2026-07-11T04:00:00.000Z';
  state.profile.name = 'OneDrive test';
  api.setState(state);
  await api.writeOneDriveState();
  assert.equal(request.url, 'https://graph.microsoft.com/v1.0/me/drive/special/approot:/karate-azure-progress-state.json:/content');
  assert.equal(request.options.method, 'PUT');
  assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  assert.equal(request.options.headers['Content-Type'], 'application/json');
  assert.equal(JSON.parse(request.options.body).profile.name, 'OneDrive test');

  context.fetch = async () => new Response('', { status:404 });
  assert.equal(await api.readOneDriveState(), null, 'missing OneDrive state should be treated as a first-use account');

  const remote = api.defaultState();
  remote.updatedAt = '2026-07-12T04:00:00.000Z';
  remote.profile.name = 'Remote copy';
  context.fetch = async () => new Response(JSON.stringify(remote), { status:200, headers:{'Content-Type':'application/json'} });
  const read = await api.readOneDriveState();
  assert.equal(read.profile.name, 'Remote copy');

  const localOlder = api.defaultState();
  localOlder.updatedAt = '2026-07-11T04:00:00.000Z';
  localOlder.profile.name = 'Local old copy';
  api.setState(localOlder);
  api.setHasLocalState(true);
  await api.pullOneDrive({ force:true });
  assert.equal(api.getState().profile.name, 'Remote copy', 'forced pull should replace the device state with OneDrive data');
  assert.equal(api.getCloudDirty(), false);

  let methods = [];
  const localNewer = api.defaultState();
  localNewer.updatedAt = '2026-07-13T04:00:00.000Z';
  localNewer.profile.name = 'Local new copy';
  api.setState(localNewer);
  context.fetch = async (url, options={}) => {
    methods.push(options.method || 'GET');
    if ((options.method || 'GET') === 'GET') return new Response('', { status:404 });
    return new Response(JSON.stringify({ id:'drive-item-2' }), { status:201, headers:{'Content-Type':'application/json'} });
  };
  await api.pushOneDrive();
  assert.deepEqual(methods, ['GET','PUT'], 'first OneDrive push should check for a remote file and then create it');
  assert.equal(api.getCloudDirty(), false);

  console.log('OneDrive sync tests passed');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
