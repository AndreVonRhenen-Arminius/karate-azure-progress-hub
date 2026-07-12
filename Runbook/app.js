
(function () {
  'use strict';

  const runbook = (typeof window.RUNBOOK === 'object' && window.RUNBOOK) || { groups: [], pages: {} };
  const navEl = document.getElementById('nav');
  const contentEl = document.getElementById('content');
  const searchEl = document.getElementById('search');
  const homeBtn = document.getElementById('btnHome');
  const globalSearchBtn = document.getElementById('btnGlobalSearch');
  const favoriteBtn = document.getElementById('btnFavorite');
  const globalSearchOverlay = document.getElementById('globalSearchOverlay');
  const globalSearchInput = document.getElementById('globalSearchInput');
  const globalSearchResults = document.getElementById('globalSearchResults');
  const closeGlobalSearchBtn = document.getElementById('btnCloseGlobalSearch');
  const themeBtn = document.getElementById('btnTheme');
  const sidebarBtn = document.getElementById('btnSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const clearNavSearchBtn = document.getElementById('btnClearNavSearch');

  const esc = (v) => String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // Core storage helpers. All new and existing modules can continue using the
  // same keys while malformed values or browser storage failures fail safely.
  function sKey(...parts){ return 'runbook:' + parts.join(':'); }
  function storageGet(key){ try { return localStorage.getItem(key); } catch (err) { console.warn('Runbook storage read failed:', key, err); return null; } }
  function storageSet(key, value){ try { localStorage.setItem(key, value); return true; } catch (err) { console.error('Runbook storage save failed:', key, err); return false; } }
  function saveJson(key, value){ return storageSet(key, JSON.stringify(value)); }
  function loadJson(key, fallback){ try { const raw = storageGet(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } }
  function saveText(key, value){ return storageSet(key, value || ''); }
  function loadText(key, fallback=''){ const raw = storageGet(key); return raw == null ? fallback : raw; }

  function applyTheme(theme){
    const selected = theme === 'soft' ? 'soft' : 'soc';
    document.body.dataset.theme = selected;
    storageSet('runbook:theme', selected);
    if (themeBtn) { themeBtn.textContent = selected === 'soft' ? '◑' : '◐'; themeBtn.title = selected === 'soft' ? 'Switch to SOC theme' : 'Switch to Soft theme'; }
  }
  applyTheme(storageGet('runbook:theme') || 'soc');

  function pageExists(id){ return id === 'runbook-home' || !!(runbook.pages && runbook.pages[id]); }
  function getPage(id){ return id === 'runbook-home' ? {title:'Home', pills:[], body:[]} : runbook.pages[id]; }
  function currentPageId(){
    const raw = location.hash.replace(/^#/, '').trim();
    if (raw && pageExists(raw)) return raw;
    const last = loadText('runbook:last-page', 'case-working-template');
    return pageExists(last) ? last : 'case-working-template';
  }


  const ICON_PATHS = {
    home:'<path d="M3 10.8 12 3l9 7.8V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/><path d="M9 22v-7h6v7"/>',
    case:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 5V3h8v2M3 10h18M9 14h6"/>',
    troubleshoot:'<path d="M14.7 6.3a4 4 0 0 0-5-5L12 3.6 3.6 12 1 11l-1 2.6 4.4 4.4L7 17l-1-2.6 8.4-8.4z" transform="translate(3 2) scale(.82)"/>',
    network:'<rect x="3" y="3" width="7" height="6" rx="1"/><rect x="14" y="15" width="7" height="6" rx="1"/><rect x="3" y="15" width="7" height="6" rx="1"/><path d="M6.5 9v3h11V9M17.5 12v3M6.5 12v3"/>',
    wifi:'<path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16.2a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>',
    shield:'<path d="M12 2 20 5v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z"/><path d="m9 12 2 2 4-5"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
    sparkles:'<path d="m12 2 1.3 4.2L17 8l-3.7 1.8L12 14l-1.3-4.2L7 8l3.7-1.8zM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8zM19 13l.7 1.8L22 16l-2.3.8L19 19l-.7-2.2L16 16l2.3-1.2z"/>',
    template:'<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v6h5M9 13h8M9 17h8M9 9h2"/>',
    knowledge:'<path d="M4 4h6a3 3 0 0 1 3 3v14a3 3 0 0 0-3-3H4zM20 4h-6a3 3 0 0 0-3 3v14a3 3 0 0 1 3-3h6z"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9A1.7 1.7 0 0 0 21 10h.2v4H21a1.7 1.7 0 0 0-1.6 1z"/>',
    archive:'<path d="M3 4h18v5H3zM5 9h14v12H5zM9 13h6"/>',
    arrow:'<path d="M7 17 17 7M8 7h9v9"/>',
    printer:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>',
    phone:'<path d="M6.6 2h3l1.5 5-2.2 1.7a16 16 0 0 0 6.4 6.4L17 12.9l5 1.5v3c0 2.2-1.8 4-4 4A16 16 0 0 1 2 5.9c0-2.2 1.8-3.9 4.6-3.9z"/>',
    search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
    legacy:'<path d="M12 8v5l3 2M4.9 4.9A10 10 0 1 1 2 12H0l3-3 3 3H4a8 8 0 1 0 2.3-5.7"/>'
  };

  function iconSvg(name, extraClass=''){
    const path = ICON_PATHS[name] || ICON_PATHS.template;
    return `<svg class="runbook-icon ${esc(extraClass)}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
  }

  function iconForGroup(title){
    const t = String(title || '').toLowerCase();
    if (t.includes('case desk')) return iconSvg('case');
    if (t.includes('troubleshoot')) return iconSvg('troubleshoot');
    if (t.includes('technical')) return iconSvg('network');
    if (t.includes('template')) return iconSvg('template');
    if (t.includes('knowledge')) return iconSvg('knowledge');
    if (t.includes('tool')) return iconSvg('settings');
    if (t.includes('archive')) return iconSvg('legacy');
    return iconSvg('template');
  }

  function iconForPage(id, title){
    const t = `${id || ''} ${title || ''}`.toLowerCase();
    if (t.includes('home')) return iconSvg('home');
    if (t.includes('email')) return iconSvg('mail');
    if (t.includes('case')) return iconSvg('case');
    if (t.includes('switch') || t.includes('vlan') || t.includes('mac')) return iconSvg('network');
    if (t.includes('ap-') || t.includes('access point') || t.includes('wifi') || t.includes('wlan')) return iconSvg('wifi');
    if (t.includes('firewall') || t.includes('fw-') || t.includes('palo')) return iconSvg('shield');
    if (t.includes('dns') || t.includes('service')) return iconSvg('globe');
    if (t.includes('print')) return iconSvg('printer');
    if (t.includes('voip') || t.includes('phone')) return iconSvg('phone');
    if (t.includes('escalat') || t.includes('tier2') || t.includes('mn3') || t.includes('p2')) return iconSvg('arrow');
    if (t.includes('knowledge') || t.includes('notes')) return iconSvg('knowledge');
    if (t.includes('backup') || t.includes('access')) return iconSvg('settings');
    if (t.includes('search') || t.includes('troubleshooting-hub')) return iconSvg('search');
    return iconSvg('template');
  }


  function navToneClass(title){
    const t = String(title || '').toLowerCase();
    if (t.includes('case desk')) return 'nav-group-case';
    if (t.includes('troubleshoot')) return 'nav-group-troubleshoot';
    if (t.includes('technical')) return 'nav-group-technical';
    if (t.includes('template')) return 'nav-group-template';
    if (t.includes('knowledge')) return 'nav-group-knowledge';
    if (t.includes('tool')) return 'nav-group-tools';
    if (t.includes('archive')) return 'nav-group-archive';
    return 'nav-group-default';
  }

  function renderNavItem(item, depth){
    if (!item) return '';
    if (item.id) {
      if (!pageExists(item.id)) return '';
      return `<a class="navitem depth-${depth}" href="#${esc(item.id)}" data-page-id="${esc(item.id)}"><span class="nav-page-icon">${iconForPage(item.id, item.title)}</span><span>${esc(item.title || item.id)}</span></a>`;
    }
    const children = (item.items || []).map(child => renderNavItem(child, depth + 1)).join('');
    if (!children.trim()) return '';
    return `<div class="nav-subgroup depth-${depth}"><details><summary><span class="nav-sub-icon">◇</span><span class="nav-subtitle">${esc(item.title || 'Untitled')}</span></summary><div class="nav-sublist">${children}</div></details></div>`;
  }

  function highlightActive(){
    const activeId = currentPageId();
    navEl.querySelectorAll('.navitem').forEach(link => link.classList.toggle('active', link.dataset.pageId === activeId));
  }

  function navUiStateKey(){ return sKey('ui-state', 'navigation'); }

  function saveNavUiState(){
    if (!navEl || !navEl.querySelector('details')) return;
    const open = {};
    navEl.querySelectorAll('details').forEach((el, index) => {
      const summary = cleanup(el.querySelector(':scope > summary')?.textContent || '');
      const key = `${summary || 'nav'}:${index}`;
      open[key] = !!el.open;
    });
    saveJson(navUiStateKey(), { open, savedAt: Date.now() });
  }

  function restoreNavUiState(){
    if (!navEl) return;
    const state = loadJson(navUiStateKey(), null);
    const open = state && state.open ? state.open : {};
    navEl.querySelectorAll('details').forEach((el, index) => {
      const summary = cleanup(el.querySelector(':scope > summary')?.textContent || '');
      const key = `${summary || 'nav'}:${index}`;
      if (Object.prototype.hasOwnProperty.call(open, key)) el.open = !!open[key];
      el.addEventListener('toggle', saveNavUiState);
    });
  }

  function renderNav(query=''){
    saveNavUiState();
    const q = String(query || '').trim().toLowerCase();
    const itemMatches = (item) => {
      if (!q) return true;
      const text = ((item.title || '') + ' ' + (item.id || '')).toLowerCase();
      if (text.includes(q)) return true;
      return (item.items || []).some(itemMatches);
    };
    navEl.innerHTML = (runbook.groups || []).map(group => {
      const items = (group.items || []).filter(itemMatches);
      const inner = items.map(item => renderNavItem(item, 1)).join('');
      if (!inner.trim()) return '';
      return `<div class="group ${navToneClass(group.title)}"><details><summary><span class="group-icon">${iconForGroup(group.title)}</span><span class="group-title">${esc(group.title || 'Group')}</span></summary><div class="navlist">${inner}</div></details></div>`;
    }).join('');
    restoreNavUiState();
    highlightActive();
  }

  

function isTemplatePage(pageId){
  return /template|email|follow|whitelist|blocked|resolved|escalation|p2/i.test(String(pageId || ''));
}

function escapeHtml(s){
  return String(s || '')
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

function cleanup(text){
    return String(text || '')
      .split('\n')
      .filter(line => !/^\s*Tagged\s+VLANs\s*:\s*$/i.test(line))
      .join('\n')
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }


  function removeCustomerSignature(text){
    let body = String(text || '').replace(/\r/g, '');

    // Remove signatures previously added by older runbook versions. This is
    // deliberately limited to André's saved signature so normal customer text
    // ending with another sign-off is left unchanged.
    const fullSignature = /(?:\n|^)+\s*Kind regards,?\s*(?:\n|\s)+Andr[eé] Von Rhenen\s*(?:\n|\s)+Customer Support Specialist\s*$/i;
    const shortSignature = /(?:\n|^)+\s*Kind regards,?\s*(?:\n|\s)+Andr[eé](?: Von Rhenen)?\s*$/i;

    body = body.replace(fullSignature, '').replace(shortSignature, '').trimEnd();
    return cleanup(body);
  }

  function normalizeCustomerTemplateTicketSentence(text){
    let body = removeCustomerSignature(text).replace(/\r/g, '').trim();
    if (!body) return '';

    // Only update the original built-in wording when it is actually present.
    // Do not insert a ticket sentence and do not overwrite a sentence that the
    // user has edited in the editable template body.
    body = body.replace(
      /Thank you for contacting N4L\. Your case number for this ticket is #\{\{ticket_number\}\}\./gi,
      'Thank you for reaching out to N4L, your case number for this ticket is #{{ticket_number}}.'
    );

    // Older versions could save the same standard ticket sentence more than
    // once. Keep only the first standard line while leaving custom wording
    // untouched.
    const lines = body.split('\n');
    const out = [];
    let standardTicketSeen = false;
    const standardTicketRe = /^Thank you for (?:contacting N4L\. Your|reaching out to N4L, your) case number for this ticket is #?(?:\{\{ticket_number\}\}|[A-Za-z0-9-]+)\.$/i;

    for (const line of lines) {
      if (standardTicketRe.test(line.trim())) {
        if (standardTicketSeen) continue;
        standardTicketSeen = true;
      }
      out.push(line);
    }

    return cleanup(out.join('\n'));
  }


  function removeTicketSentenceFromProactiveTemplate(formKey, text){
    let body = String(text || '').replace(/\r/g, '');
    if (!isProactiveEmailTemplate(formKey)) return cleanup(body);

    const placeholderSentence = /^\s*Thank you for reaching out to N4L, your case number for this ticket is #\{\{ticket_number\}\}\.\s*$/i;
    const generatedSentence = /^\s*Thank you for reaching out to N4L, your case number for this ticket is #?[A-Za-z0-9-]+\.\s*$/i;

    body = body
      .split('\n')
      .filter(line => !placeholderSentence.test(line) && !generatedSentence.test(line))
      .join('\n');

    return cleanup(body);
  }

  function collapseDuplicateGeneratedTicketSentences(text){
    let source = String(text || '').replace(/\r/g, '');
    source = source.replace(
      /Thank you for contacting N4L\. Your case number for this ticket is #([A-Za-z0-9-]+)\./gi,
      'Thank you for reaching out to N4L, your case number for this ticket is #$1.'
    );

    const lines = source.split('\n');
    const out = [];
    let standardTicketSeen = false;
    const standardTicketRe = /^Thank you for reaching out to N4L, your case number for this ticket is #?[A-Za-z0-9-]+\.$/i;

    for (const line of lines) {
      if (standardTicketRe.test(line.trim())) {
        if (standardTicketSeen) continue;
        standardTicketSeen = true;
      }
      out.push(line);
    }
    return cleanup(out.join('\n'));
  }

  function removeTicketSentenceFromSelectedFollowupTemplates(){
    const targetPages = new Set([
      'email-resolved', 'email-followup', 'email-followup2', 'email-resolved5',
      'email-proactive-fw', 'email-proactive-ap', 'email-proactive-switch'
    ]);
    const sentenceRe = /^\s*Thank you for reaching out to N4L, your case number for this ticket is #(?:\{\{ticket_number\}\}|[A-Za-z0-9-]+)\.\s*$/i;

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key || !/templateBody$/i.test(key)) continue;

        const parts = key.split(':');
        const pageId = parts.length > 1 ? parts[1] : '';
        if (!targetPages.has(pageId)) continue;

        const current = localStorage.getItem(key);
        if (current == null) continue;

        const cleaned = cleanup(
          String(current)
            .replace(/\r/g, '')
            .split('\n')
            .filter(line => !sentenceRe.test(line))
            .join('\n')
        );

        if (cleaned !== current) localStorage.setItem(key, cleaned);
      }
    } catch (_) {
      // Built-in template defaults still apply if browser storage is unavailable.
    }
  }

  function normalizeSavedCustomerTemplates(){
    removeTicketSentenceFromSelectedFollowupTemplates();
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key || !/^runbook:/.test(key)) continue;
        const current = localStorage.getItem(key);
        if (current == null) continue;

        const keyParts = key.split(':');
        const pageId = keyParts.length > 1 ? keyParts[1] : '';
        const proactivePage = /^email-proactive-(?:fw|ap|switch)$/i.test(pageId);

        if (/templateBody$/i.test(key)) {
          let normalized = normalizeCustomerTemplateTicketSentence(current);
          if (proactivePage) normalized = removeTicketSentenceFromProactiveTemplate(pageId, normalized);
          if (normalized !== current) localStorage.setItem(key, normalized);
          continue;
        }

        if (/:output$/i.test(key)) {
          let normalized = collapseDuplicateGeneratedTicketSentences(current);
          if (proactivePage) normalized = removeTicketSentenceFromProactiveTemplate(pageId, normalized);
          if (normalized !== current) localStorage.setItem(key, normalized);
        }
      }
    } catch (_) {
      // Continue with built-in templates if browser storage is unavailable.
    }
  }

  function removeSavedCustomerSignatures(){
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (!key || !/^runbook:/.test(key) || !/(templateBody|output)$/i.test(key)) continue;
        const current = localStorage.getItem(key);
        if (current == null) continue;
        const cleaned = removeCustomerSignature(current);
        if (cleaned !== current) localStorage.setItem(key, cleaned);
      }
    } catch (_) {
      // The runbook still works if browser storage is temporarily unavailable.
    }
  }

  removeSavedCustomerSignatures();
  normalizeSavedCustomerTemplates();

  // These Salesforce administration fields are recognised only as boundaries.
  // They are intentionally ignored and are never imported into the working case.
  const SALESFORCE_IGNORED_IMPORT_FIELDS = [
    'Product','Installed N4L Products','Call Driver','School Migration Status','Form Status',
    'Estimated ICT SoW Amount','ICT Implementation Contact','Opportunity','ICT Implementation Provider'
  ];

  const SALESFORCE_FIELD_MARKERS = [
    'Tabs','Feed','Case Details','Notes & Attachments','Related Cases','Emails','Jira','Case Comments','Files',
    'Status','Case Owner Name','Date/Time Under Action','Date and Time Case Opened','Subject','Account Name','Account (Reporting)',
    'Contact Phone','Contact Mobile','Contact Name','Contact Email','Email',
    ...SALESFORCE_IGNORED_IMPORT_FIELDS,
    'Secondary Contact','Secondary Contact Mobile','Secondary Contact Email','Secondary Contact Phone','MoE ID','Firewall ID'
  ];

  function markerRegex(markers){
    const list = (markers && markers.length ? markers : SALESFORCE_FIELD_MARKERS)
      .map(m => String(m).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'));
    // Salesforce paste can glue values and labels together, e.g.
    // "Tokoroa High SchoolStatusUnder ActionCase Owner Name...".
    // Do not require a word boundary after the marker because the next label value
    // may start immediately after it. This is used only to cut field values safely.
    return new RegExp('(?:\\s+|)(' + list.join('|') + ')(?:\\s*:|(?=[A-Z0-9#])|$)', 'i');
  }


  function cleanSalesforceFieldValue(value, markers){
    let out = cleanup(value).replace(/\s+/g, ' ').trim();
    if (!out) return '';
    const re = markerRegex(markers);
    const m = out.match(re);
    if (m && m.index > 0) out = out.slice(0, m.index).trim();
    return out.replace(/\s{2,}/g, ' ').trim();
  }

  function cleanSalesforceSubject(value){
    let subject = cleanup(value).replace(/\s+/g, ' ').trim();
    if (!subject) return '';

    // Salesforce copy/paste can merge navigation labels into the subject, e.g.
    // "VPN → randomly disconnectsTabsTabsFeedCase Details..." or
    // "VPN → randomly disconnects Date/Time Under Action ...".
    subject = cleanSalesforceFieldValue(subject, [
      'Tabs','Feed','Case Details','Notes & Attachments','Related Cases','Emails','Jira','Case Comments','Files',
      'Date/Time Under Action','Date and Time Case Opened','Status','Case Owner Name','Account Name','Contact Name',
      'Contact Phone','Contact Mobile','Contact Email','Email',
      ...SALESFORCE_IGNORED_IMPORT_FIELDS
    ]);

    subject = subject.replace(/\s+(Date\/Time Under Action|Date and Time Case Opened)\b[\s\S]*$/i, '').trim();
    return subject;
  }


  function salesforceLabelPattern(label){
    return String(label || '')
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/\s+/g, '\\s*');
  }

  function extractSalesforceField(raw, labelNames, stopLabels){
    const source = String(raw || '').replace(/\r/g, '\n');
    if (!source.trim()) return '';
    const labels = (labelNames || []).filter(Boolean);
    const stops = (stopLabels && stopLabels.length ? stopLabels : SALESFORCE_FIELD_MARKERS)
      .filter(Boolean)
      .filter(m => !labels.some(l => normalizeSalesforceLabel(l) === normalizeSalesforceLabel(m)))
      .sort((a,b) => String(b).length - String(a).length);
    const labelPat = labels.map(salesforceLabelPattern).join('|');
    const stopPat = stops.map(salesforceLabelPattern).join('|');
    if (!labelPat) return '';
    const re = new RegExp('(?:^|\\n|\\s)(' + labelPat + ')(?:\\s*:)?\\s*([\\s\\S]*?)(?=(?:^|\\n|\\s)?(?:' + stopPat + ')(?:\\s*:|(?=[A-Z0-9#])|\\s|$)|$)', 'i');
    const m = source.match(re);
    if (!m) return '';
    return cleanup(String(m[2] || ''));
  }

  function normalizeSalesforceLabel(v){
    return String(v || '').trim().replace(/:+$/, '').toLowerCase().replace(/\s+/g, ' ');
  }

  function digitsOnlyPhone(value){
    return cleanup(value).replace(/[^0-9+]/g, '').trim();
  }

  function finalCleanImportedField(value, stopLabels){
    return cleanSalesforceFieldValue(value, stopLabels || SALESFORCE_FIELD_MARKERS);
  }

  function extractSalesforceLineField(raw, labelNames){
    const source = String(raw || '').replace(/\r/g, '\n');
    const lines = source.split('\n').map(v => String(v || '').trim()).filter(Boolean);
    const wanted = new Set((labelNames || []).map(normalizeSalesforceLabel));
    const known = new Set(SALESFORCE_FIELD_MARKERS.map(normalizeSalesforceLabel));
    // Extra Salesforce labels that appear in copied case pages.
    [
      'Case','Case Number','Ticket Number','School Name','Site','Accepted by N4L','Product','Description',
      'Device Name','Contact Number','Landline','Phone','Student Name','Address','Issue / Request Details',
      'Evidence Collected','Resolution or Next Step','Action Summary','Troubleshooting / Resolution / Next Step'
    ].forEach(v => known.add(normalizeSalesforceLabel(v)));

    for (let i = 0; i < lines.length; i++) {
      if (!wanted.has(normalizeSalesforceLabel(lines[i]))) continue;
      const collected = [];
      for (let j = i + 1; j < lines.length; j++) {
        const next = lines[j];
        const n = normalizeSalesforceLabel(next);
        if (known.has(n) || wanted.has(n)) break;
        collected.push(next);
      }
      const value = cleanup(collected.join('\n'));
      if (value) return value;
    }
    return '';
  }




  function hardExtractSalesforceValue(raw, labelNames, stopLabels){
    const source = String(raw || '').replace(/\r/g, '\n');
    if (!source.trim()) return '';
    const labels = (labelNames || []).filter(Boolean);
    const stops = (stopLabels && stopLabels.length ? stopLabels : SALESFORCE_FIELD_MARKERS)
      .filter(Boolean)
      .filter(m => !labels.some(l => normalizeSalesforceLabel(l) === normalizeSalesforceLabel(m)))
      .sort((a,b) => String(b).length - String(a).length);
    const esc = (v) => String(v || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
    const labelRe = new RegExp('(?:^|\\n|\\s)(' + labels.map(esc).join('|') + ')(?:\\s*:)?', 'gi');
    let match;
    while ((match = labelRe.exec(source))) {
      let start = labelRe.lastIndex;
      while (start < source.length && /[\s:\-]/.test(source[start])) start++;
      let end = source.length;
      for (const stop of stops) {
        const stopRe = new RegExp(esc(stop) + '(?:\\s*:|(?=[A-Z0-9#])|\\s|$)', 'gi');
        stopRe.lastIndex = start;
        const sm = stopRe.exec(source);
        if (sm && sm.index >= start && sm.index < end) end = sm.index;
      }
      let value = source.slice(start, end).replace(/\s+/g, ' ').trim();
      value = cleanSalesforceFieldValue(value, stops);
      if (!value) continue;
      const norm = normalizeSalesforceLabel(value);
      if (SALESFORCE_FIELD_MARKERS.map(normalizeSalesforceLabel).includes(norm)) continue;
      return value;
    }
    return '';
  }

  function extractSalesforceExactValue(raw, labelNames){
    const hard = hardExtractSalesforceValue(raw, labelNames, SALESFORCE_FIELD_MARKERS);
    if (hard) return hard;
    // Strict Salesforce copy/paste parser.
    // Reads only the first non-empty value immediately after the requested label.
    // This prevents fields such as Account Name/School Name from swallowing the
    // following Salesforce labels when the paste contains glued text.
    const source = normaliseSalesforcePasteText(raw);
    const lines = source.split('\n').map(v => String(v || '').trim()).filter(Boolean);
    const wanted = new Set((labelNames || []).map(normalizeSalesforceLabel));
    const known = new Set(SALESFORCE_FIELD_MARKERS.map(normalizeSalesforceLabel));
    [
      'Case','Case Number','Ticket Number','School Name','Site','Accepted by N4L','Product','Description',
      'Device Name','Contact Number','Landline','Phone','Student Name','Address','Issue / Request Details',
      'Evidence Collected','Resolution or Next Step','Action Summary','Troubleshooting / Resolution / Next Step'
    ].forEach(v => known.add(normalizeSalesforceLabel(v)));

    for (let i = 0; i < lines.length; i++) {
      const lineNorm = normalizeSalesforceLabel(lines[i]);
      if (!wanted.has(lineNorm)) continue;
      for (let j = i + 1; j < lines.length; j++) {
        const candidate = lines[j];
        const candNorm = normalizeSalesforceLabel(candidate);
        if (!candidate) continue;
        if (known.has(candNorm) || wanted.has(candNorm)) break;
        return cleanSalesforceFieldValue(candidate, SALESFORCE_FIELD_MARKERS);
      }
    }
    return '';
  }

  function cleanImportedSchoolName(value){
    let out = cleanSalesforceFieldValue(value, [
      'Status','Case Owner Name','Subject','Date/Time Under Action','Tabs','Contact Name','Contact Phone',
      'Contact Mobile','Contact Email','Email','School Migration Status','Estimated ICT SoW Amount','Account (Reporting)'
    ]);
    // Extra guard for pasted/glued Salesforce data that has already been saved into the field.
    out = out.replace(/\s*(Status|Case Owner Name|Subject|Date\/Time Under Action|Tabs|Contact Name|Contact Phone|Contact Mobile|Contact\s*Email|Email|School Migration\s*Status|Estimated ICT SoW Amount|Account \(Reporting\))[\s\S]*$/i, '').trim();
    return out;
  }

  function looksLikeSalesforceLabelOnly(value){
    const norm = normalizeSalesforceLabel(value);
    if (!norm) return true;
    const labels = SALESFORCE_FIELD_MARKERS.concat([
      'Case','Case Number','Ticket Number','School Name','Site','Landline','Phone','Mobile','Contact Number',
      'Description','Issue / Request Details','Evidence Collected','Action Summary','Troubleshooting / Resolution / Next Step'
    ]).map(normalizeSalesforceLabel);
    return labels.includes(norm);
  }

  function cleanImportedContactName(value){
    const out = finalCleanImportedField(value, ['Contact Phone','Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Status','Tabs','Feed','Case Details','School Migration Status','Account (Reporting)']);
    return looksLikeSalesforceLabelOnly(out) ? '' : out;
  }

  function cleanImportedPhone(value){
    const out = finalCleanImportedField(value, ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Status','Tabs','Feed','Case Details','Contact Name']);
    if (!out || looksLikeSalesforceLabelOnly(out)) return '';
    return /\d{3,}/.test(out) ? out : '';
  }

  function cleanImportedMobile(value){
    const out = finalCleanImportedField(value, ['Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Status','Tabs','Feed','Case Details','Contact Name']);
    if (!out || looksLikeSalesforceLabelOnly(out)) return '';
    return /\d{3,}/.test(out) ? out : '';
  }

  function cleanImportedEmail(value){
    const email = (String(value || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i) || [])[0] || '';
    return email;
  }

  function cleanImportedSubject(value){
    const out = cleanSalesforceSubject(value);
    return looksLikeSalesforceLabelOnly(out) ? '' : out;
  }


  const STRICT_SALESFORCE_IMPORT_FIELDS = [
    { label: 'Case', key: 'ticket_number' },
    { label: 'Account Name', key: 'school_name' },
    { label: 'MoE ID', key: 'moe_id' },
    { label: 'Firewall ID', key: 'firewall_id' },
    { label: 'Contact Phone', key: 'contact_phone' },
    { label: 'Contact Name', key: 'contact_name' },
    { label: 'Contact Mobile', key: 'contact_mobile' },
    { label: 'Contact Email', key: 'contact_email' },
    { label: 'Subject', key: 'subject' },
    { label: 'Description', key: 'raw_salesforce' }
  ];

  function strictSalesforceLabels(){
    return Array.from(new Set(SALESFORCE_FIELD_MARKERS.concat([
      'Case','Case Number','Ticket Number','Account Name','Account (Reporting)','Contact Phone','Contact Name',
      'Contact Mobile','Contact Email','Subject','School Migration Status','MoE ID','Firewall ID','Landline',
      'Mobile','Phone','Description','Case Details','Date/Time Under Action','Date and Time Case Opened',
      'Installed N4L Products','Secondary Contact','Secondary Contact Mobile','Secondary Contact Email',
      'Secondary Contact Phone','Status','Case Owner Name','Email'
    ]))).sort((a,b) => b.length - a.length);
  }

  function normaliseStrictSalesforceImportText(raw){
    let text = String(raw || '').replace(/\r/g, '\n').replace(/\t/g, '\n');
    const labels = strictSalesforceLabels();
    const alt = labels.map(label => String(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*')).join('|');
    // Use one longest-first alternation so smaller labels such as "Phone" or "Status"
    // do not split longer Salesforce labels like "Contact Phone" or "School Migration Status".
    text = text.replace(new RegExp('([^\\n\\s])(' + alt + ')(?=\\s*:|[A-Z0-9#]|\\s|$)', 'gi'), '$1\n$2');
    text = text.replace(new RegExp('(^|\\n)\\s*(' + alt + ')(?:\\s*:)?(?=[A-Z0-9#])', 'gi'), '$1$2\n');
    text = text.replace(new RegExp('(^|\\n)\\s*(' + alt + ')\\s*:\\s*', 'gi'), '$1$2\n');
    text = text.replace(/Tabs\s*Tabs/gi, 'Tabs\nTabs');
    return text;
  }

  function isStrictKnownSalesforceLabel(line){
    const norm = normalizeSalesforceLabel(line);
    if (!norm) return false;
    return strictSalesforceLabels().map(normalizeSalesforceLabel).includes(norm);
  }

  function cleanStrictImportedValue(key, value){
    let out = cleanup(value);
    if (!out) return '';
    // Keep the Salesforce Description readable when it is placed into the Raw Case field.
    // Other header fields remain single-line values.
    if (key !== 'raw_salesforce') out = out.replace(/\s+/g, ' ').trim();
    // Cut anything after a known Salesforce heading if a pasted value was still glued.
    const labels = strictSalesforceLabels().filter(l => normalizeSalesforceLabel(l) !== normalizeSalesforceLabel(STRICT_SALESFORCE_IMPORT_FIELDS.find(f => f.key === key)?.label));
    out = key === 'raw_salesforce'
      ? cleanup(out)
      : cleanSalesforceFieldValue(out, labels).trim();
    if (key === 'raw_salesforce') {
      const ignoredPattern = SALESFORCE_IGNORED_IMPORT_FIELDS
        .slice()
        .sort((a,b) => b.length - a.length)
        .map(label => String(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*'))
        .join('|');
      // Administrative Salesforce headings are boundaries only. Remove them and
      // anything following them if a copied page still left them in Description.
      out = out.replace(new RegExp('(?:^|\\n)\\s*(?:' + ignoredPattern + ')(?:\\s*:)?[\\s\\S]*$', 'i'), '').trim();
    }
    if (key !== 'raw_salesforce') {
      out = out.replace(/\s*(Status|Case Owner Name|Date\/Time Under Action|Date and Time Case Opened|Tabs|Feed|Case Details|Notes & Attachments|Related Cases|Emails|Jira|School Migration Status|Estimated ICT SoW Amount|Account \(Reporting\)|Contact Phone|Contact Name|Contact Mobile|Contact Email|Email|Subject|Description|MoE ID|Firewall ID)\b[\s\S]*$/i, '').trim();
    }
    if (looksLikeSalesforceLabelOnly(out)) return '';
    if (key === 'ticket_number') {
      const m = out.match(/#?\d{5,}/);
      return m ? m[0].replace(/^#/, '') : '';
    }
    if (key === 'contact_phone' || key === 'contact_mobile') return /\d{3,}/.test(out) ? out : '';
    if (key === 'contact_email') return cleanImportedEmail(out);
    if (key === 'subject') return cleanImportedSubject(out);
    if (key === 'school_name') return cleanImportedSchoolName(out);
    if (key === 'contact_name') return cleanImportedContactName(out);
    return out;
  }

  function parseSalesforceCaseHeaderOnly(raw){
    const out = { ticket_number:'', school_name:'', account_name:'', moe_id:'', firewall_id:'', contact_phone:'', contact_name:'', contact_mobile:'', contact_email:'', email:'', subject:'', raw_salesforce:'' };
    const text = normaliseStrictSalesforceImportText(raw);
    const lines = text.split('\n').map(v => String(v || '').trim()).filter(Boolean);
    const wanted = new Map(STRICT_SALESFORCE_IMPORT_FIELDS.map(f => [normalizeSalesforceLabel(f.label), f]));
    const known = new Set(strictSalesforceLabels().map(normalizeSalesforceLabel));

    function collectAfter(index){
      const collected = [];
      for (let j = index + 1; j < lines.length; j++) {
        const n = normalizeSalesforceLabel(lines[j]);
        if (known.has(n)) break;
        collected.push(lines[j]);
      }
      return cleanup(collected.join('\n'));
    }

    for (let i = 0; i < lines.length; i++) {
      const norm = normalizeSalesforceLabel(lines[i]);
      const field = wanted.get(norm);
      if (field) {
        if (!out[field.key]) out[field.key] = cleanStrictImportedValue(field.key, collectAfter(i));
        continue;
      }

      // Fallback for single-line "Label value" cases. Avoid treating "Case Details" as "Case".
      for (const f of STRICT_SALESFORCE_IMPORT_FIELDS) {
        if (out[f.key]) continue;
        const label = f.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
        const re = new RegExp('^' + label + '\\s+(.+)$', 'i');
        const m = lines[i].match(re);
        if (!m) continue;
        if (f.label === 'Case' && !/^#?\d{5,}\b/.test(m[1].trim())) continue;
        out[f.key] = cleanStrictImportedValue(f.key, m[1]);
      }
    }

    out.account_name = out.school_name;
    out.email = out.contact_email;
    return out;
  }


  function normaliseSalesforcePasteText(raw){
    let text = String(raw || '').replace(/\r/g, '');
    const markers = SALESFORCE_FIELD_MARKERS.slice().sort((a,b) => b.length - a.length);
    for (const marker of markers) {
      const escMarker = String(marker).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
      // Add a line break before labels accidentally joined to a previous value.
      text = text.replace(new RegExp('([^\\n])(' + escMarker + ')(?=\\s*:|[A-Z0-9#]|\\s|$)', 'gi'), '$1\\n$2');
      // Add a line break after labels accidentally joined to the value, e.g. SubjectVPN or StatusUnder.
      text = text.replace(new RegExp('(^|\\n)\\s*(' + escMarker + ')(?=\\s*:)', 'gi'), '$1$2');
      text = text.replace(new RegExp('(^|\\n)\\s*(' + escMarker + ')(?=[A-Z0-9#])', 'gi'), '$1$2\\n');
    }
    // Common Salesforce copy artefact where labels can be repeated without spaces.
    text = text.replace(/Tabs\s*Tabs/gi, 'Tabs\nTabs');
    return text;
  }




  function parseJsonSafe(raw){ try { return raw ? JSON.parse(raw) : {}; } catch { return {}; } }

  function workingCaseHasContent(obj){
    return Object.entries(obj || {}).some(([k, v]) => !String(k).startsWith('__') && cleanup(v));
  }

  function ticketOfWorkingCase(obj){
    return cleanup((obj || {}).ticket_number || (obj || {}).case_number || '').replace(/^#/, '');
  }

  function splitLegacyContactNumber(value){
    const text = cleanup(value);
    const out = { contact_phone:'', contact_mobile:'' };
    if (!text) return out;
    const mobile = text.match(/Mobile:\s*([^|\n]+)/i);
    const landline = text.match(/(?:Landline|Phone):\s*([^|\n]+)/i);
    if (mobile) out.contact_mobile = cleanup(mobile[1]);
    if (landline) out.contact_phone = cleanup(landline[1]);
    if (!out.contact_mobile && /^02\d/.test(text)) out.contact_mobile = text;
    if (!out.contact_phone && !out.contact_mobile) out.contact_phone = text;
    return out;
  }

  function normaliseImportedWorkingCase(record, sfRaw=''){
    const legacy = withAliases(record || {});
    let parsed = {};
    if (sfRaw && !workingCaseHasContent(legacy)) {
      try { parsed = withAliases(parseSmart(sfRaw)); } catch { parsed = {}; }
    }
    const contacts = splitLegacyContactNumber(legacy.contact_number || legacy.phone || parsed.contact_number || '');
    const issue = cleanup(legacy.issue_details || legacy.issue_summary || parsed.issue_details || legacy.subject || parsed.subject || '');
    const converted = {
      ticket_number: legacy.ticket_number || legacy.case_number || parsed.ticket_number || parsed.case_number || '',
      school_name: legacy.school_name || legacy.account_name || parsed.school_name || parsed.account_name || '',
      moe_id: legacy.moe_id || parsed.moe_id || '',
      firewall_id: legacy.firewall_id || legacy.moe_firewall || legacy.firewall_moe || parsed.firewall_id || parsed.moe_firewall || parsed.firewall_moe || '',
      contact_name: legacy.contact_name || legacy.to_name || parsed.contact_name || parsed.to_name || '',
      contact_phone: legacy.contact_phone || contacts.contact_phone || parsed.contact_phone || '',
      contact_mobile: legacy.contact_mobile || contacts.contact_mobile || parsed.contact_mobile || '',
      contact_email: legacy.contact_email || legacy.email || parsed.contact_email || parsed.email || '',
      subject: cleanSalesforceSubject(legacy.subject || legacy.issue_summary || parsed.subject || issue.split('\n')[0] || ''),
      raw_salesforce: legacy.raw_salesforce || legacy.sf_import || parsed.raw_salesforce || '',
      working_notes: cleanup(legacy.working_notes || [legacy.checks_done, legacy.evidence].filter(Boolean).join('\n\n')),
      my_next_checks: legacy.my_next_checks || legacy.resolution_or_next_step || '',
      final_output: legacy.final_output || legacy.salesforce_notes || '',
      account_name: legacy.account_name || legacy.school_name || parsed.account_name || parsed.school_name || '',
      case_number: legacy.case_number || legacy.ticket_number || parsed.case_number || parsed.ticket_number || '',
      to_name: legacy.to_name || legacy.contact_name || parsed.to_name || parsed.contact_name || '',
      email: legacy.email || legacy.contact_email || parsed.email || parsed.contact_email || ''
    };
    if (!converted.raw_salesforce && sfRaw) converted.raw_salesforce = sfRaw;
    if (!converted.raw_salesforce && issue) converted.raw_salesforce = issue;
    return withAliases(converted);
  }

  function buildRunbookKeyMapFromLocalStorage(){
    const keys = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('runbook:')) keys[key] = localStorage.getItem(key);
    }
    return keys;
  }

  function restoreWorkingCaseSlotsFromKeyMap(keys, options={}){
    const slotCount = 100;
    const newPrefix = 'runbook:case-working-template:workingCase:slot:';
    const legacyPrefix = 'runbook:workingCase:slot:';
    const clearCurrent = options.clearCurrent !== false;
    const rows = [];
    const seen = new Set();

    const addRow = (slot, record, sfRaw, outputRaw, progressRaw) => {
      const normalised = normaliseImportedWorkingCase(record, sfRaw || '');
      if (!workingCaseHasContent(normalised) && !cleanup(sfRaw || '') && !cleanup(outputRaw || '')) return;
      const ticket = ticketOfWorkingCase(normalised);
      const subject = cleanup(normalised.subject || '');
      const sig = ticket ? `ticket:${ticket}` : `slot:${slot}:${subject}:${cleanup(normalised.school_name || '')}`;
      if (seen.has(sig)) return;
      seen.add(sig);
      const parsedOutput = parseJsonSafe(outputRaw);
      rows.push({
        values: normalised,
        sf: cleanup(sfRaw || normalised.raw_salesforce || ''),
        outputs: (parsedOutput && typeof parsedOutput === 'object' && !Array.isArray(parsedOutput)) ? parsedOutput : { working: cleanup(outputRaw || '') },
        progress: parseJsonSafe(progressRaw)
      });
    };

    for (let n = 1; n <= slotCount; n++) {
      addRow(n, parseJsonSafe(keys[newPrefix + n]), keys[newPrefix + n + ':sf_import'] || '', keys[newPrefix + n + ':outputs'] || '', keys[newPrefix + n + ':progress'] || '');
    }
    for (let n = 1; n <= slotCount; n++) {
      addRow(n, parseJsonSafe(keys[legacyPrefix + n]), keys[legacyPrefix + n + ':sf_import'] || '', keys['runbook:workingCase:output:' + n] || '', keys[legacyPrefix + n + ':progress'] || '');
    }

    if (clearCurrent) {
      for (let n = 1; n <= slotCount; n++) {
        saveJson(newPrefix + n, {});
        saveJson(newPrefix + n + ':outputs', {working:''});
        saveText(newPrefix + n + ':sf_import', '');
        saveJson(newPrefix + n + ':progress', {});
      }
    }

    rows.slice(0, slotCount).forEach((row, idx) => {
      const n = idx + 1;
      saveJson(newPrefix + n, row.values || {});
      saveJson(newPrefix + n + ':outputs', row.outputs || {working:''});
      saveText(newPrefix + n + ':sf_import', row.sf || '');
      saveJson(newPrefix + n + ':progress', row.progress || {});
    });
    if (rows.length) {
      localStorage.setItem('runbook:case-working-template:workingCase:active-slot', '1');
      localStorage.setItem('runbook:migration:workingCaseRestore:last', new Date().toISOString());
      localStorage.setItem('runbook:migration:workingCaseRestore:count', String(Math.min(rows.length, slotCount)));
    }
    return Math.min(rows.length, slotCount);
  }

  function migrateLegacyWorkingCaseSlots(){
    const migrationMarker = 'runbook:migration:workingCaseSlots:v20-complete';
    if (localStorage.getItem(migrationMarker) === '1') return 0;

    const pageId = 'case-working-template';
    const formKey = 'workingCase';
    const slotCount = 100;

    // Current-format data must always be treated as authoritative. Earlier
    // builds re-ran the legacy migration at every startup and forced slot 1
    // back to Current Active case, undoing a user's parked state.
    let hasCurrentData = false;
    for (let n = 1; n <= slotCount; n++) {
      if (hasMeaningfulTicketData(pageId, formKey, n)) {
        hasCurrentData = true;
        break;
      }
    }

    if (hasCurrentData) {
      localStorage.setItem(migrationMarker, '1');
      return 0;
    }

    const keys = buildRunbookKeyMapFromLocalStorage();
    const legacyPrefix = 'runbook:workingCase:slot:';
    const hasLegacyData = Object.keys(keys).some(key => key.startsWith(legacyPrefix));
    if (!hasLegacyData) {
      localStorage.setItem(migrationMarker, '1');
      return 0;
    }

    const restored = restoreWorkingCaseSlotsFromKeyMap(keys, { clearCurrent:false });
    // Imported legacy tickets begin parked. A legacy migration must not make
    // an arbitrary ticket active.
    setActiveWorkingSlot(pageId, formKey, 0);
    localStorage.setItem(migrationMarker, '1');
    return restored;
  }

  try { migrateLegacyWorkingCaseSlots(); } catch (err) { console.error('Legacy working case migration failed:', err); }

  function formatCaseNumber(value){
    const clean = cleanup(value).replace(/^#+/, '');
    if (!clean) return '';
    return '#' + clean;
  }

  function formatUrlListForEmail(value){
    const raw = cleanup(value);
    if (!raw) return '';
    const matches = Array.from(new Set((raw.match(/(?:https?:\/\/)?[A-Za-z0-9.-]+\.[A-Za-z]{2,}(?:\/[^\s'"]*)?/g) || [])
      .map(v => v.replace(/^['"]|['"]$/g, '').replace(/[),.;]+$/g, ''))));
    if (matches.length >= 2) return matches.join('\n');
    return raw;
  }

  function bulletizeLines(text){
    const clean = cleanup(text);
    if (!clean) return '';
    return clean.split('\n').map(line => line.trim()).filter(Boolean).map(line => line.match(/^[•\-*]/) ? line : `• ${line}`).join('\n');
  }

  // Case issue/request text must stay as raw customer/request text.
  // Do not auto-bullet this field, because Salesforce/customer details often need
  // to remain as plain lines rather than a generated bullet list.
  function cleanIssueDetailsText(text){
    const clean = cleanup(text);
    if (!clean) return '';
    return clean.split('\n')
      .map(line => line.replace(/^\s*[•*-]\s+/, '').trimEnd())
      .join('\n')
      .trim();
  }

  function combineUniqueBlocks(parts){
    const seen = new Set();
    const out = [];
    (parts || []).forEach(part => {
      const clean = cleanup(part);
      if (!clean) return;
      const key = clean.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push(clean);
    });
    return cleanup(out.join('\n\n'));
  }

  
  function isDisplayHeading(line){
    const t = String(line || '').trim();
    if (!t.endsWith(':')) return false;
    if (t.length > 120) return false;
    if (/^(telnet|ssh|admin|root)?@/i.test(t)) return false;
    if (/^https?:\/\//i.test(t)) return false;
    if (/^\d{1,3}(?:\.\d{1,3}){3}/.test(t)) return false;
    if (/^VLANs?\s+\d+/i.test(t)) return false;
    return /^[A-Za-z0-9][A-Za-z0-9\s\/\-()?#.&]+:$/.test(t);
  }

function formatOutputHTML(text, options={}){
    const clean = cleanup(text);
    const noAutoBold = !!options.noAutoBold;
    if (!clean) return '';
    return clean.split('\n').map(line => {
      const safe = esc(line);
      if (!line.trim()) return '<div class=\"out-blank\"></div>';
      if (!noAutoBold && isDisplayHeading(line)) return `<div class=\"out-label\"><strong>${safe}</strong></div>`;
      return `<div class=\"out-line\">${safe}</div>`;
    }).join('');
  }

  function renderOutputArea(el, text){
    if (!el) return;
    const clean = cleanup(text);
    el.dataset.rawOutput = clean;
    el.innerHTML = formatOutputHTML(clean, { noAutoBold: el.dataset.noAutoBold === 'true' });
  }
  function withAliases(values){
    const v = Object.assign({}, values || {});

    // Core Salesforce / case aliases
    if (!v.account_name && v.school_name) v.account_name = v.school_name;
    if (!v.school_name && v.account_name) v.school_name = v.account_name;

    if (!v.ticket_number && v.case_number) v.ticket_number = v.case_number;
    if (!v.case_number && v.ticket_number) v.case_number = v.ticket_number;

    if (!v.contact_name && v.to_name) v.contact_name = v.to_name;
    if (!v.to_name && v.contact_name) v.to_name = v.contact_name;

    if (!v.contact_phone && v.contact_number) v.contact_phone = v.contact_number;
    if (!v.contact_number && v.contact_phone) v.contact_number = v.contact_phone;

    if (!v.contact_email && v.email) v.contact_email = v.email;
    if (!v.email && v.contact_email) v.email = v.contact_email;

    if (!v.firewall_id && v.moe_firewall) v.firewall_id = v.moe_firewall;
    if (!v.moe_firewall && v.firewall_id) v.moe_firewall = v.firewall_id;
    if (!v.firewall_moe && v.firewall_id) v.firewall_moe = v.firewall_id;

    // Issue aliases
    if (!v.issue_details && v.issue_summary) v.issue_details = v.issue_summary;
    if (!v.issue_summary && v.issue_details) v.issue_summary = v.issue_details;
    if (!v.summary_issue && v.issue_details) v.summary_issue = v.issue_details;
    if (!v.summary_of_issue && v.issue_details) v.summary_of_issue = v.issue_details;
    if (!v.subject && v.issue_summary) v.subject = v.issue_summary;
    if (v.subject) v.subject = cleanSalesforceSubject(v.subject);

    // Evidence aliases
    if (!v.evidence_collected && v.evidence) v.evidence_collected = v.evidence;
    if (!v.evidence && v.evidence_collected) v.evidence = v.evidence_collected;

    // Action Summary aliases - keeps renamed Action Summary compatible with old templates
    if (!v.resolution_next && v.resolution_or_next_step) v.resolution_next = v.resolution_or_next_step;
    if (!v.resolution_or_next_step && v.resolution_next) v.resolution_or_next_step = v.resolution_next;
    if (!v.next_steps && v.resolution_next) v.next_steps = v.resolution_next;
    if (!v.next_action && v.resolution_next) v.next_action = v.resolution_next;
    if (!v.checks_done && v.resolution_next) v.checks_done = v.resolution_next;
    if (!v.troubleshooting_performed && v.resolution_next) v.troubleshooting_performed = v.resolution_next;
    if (!v.steps_taken && v.resolution_next) v.steps_taken = v.resolution_next;

    // T2 / MN3 / policy aliases
    if (!v.best_technical_contact && v.contact_name) v.best_technical_contact = v.contact_name;
    // Do not auto-copy general IP values into Source / External IP or other IP fields.
    // These fields should only populate when the user enters them directly.
    if (!v.mac_address && v.mac) v.mac_address = v.mac;
    if (!v.destination && v.ports) v.destination = v.ports;

    if (!v.security_policy && v.policy) v.security_policy = v.policy;
    if (!v.url_access_profile && v.url_access_management_profile) v.url_access_profile = v.url_access_management_profile;
    if (!v.url_access_management_profile && v.url_access_profile) v.url_access_management_profile = v.url_access_profile;
    if (!v.custom_url_categories && v.custom_url_category) v.custom_url_categories = v.custom_url_category;
    if (!v.custom_url_category && v.custom_url_categories) v.custom_url_category = v.custom_url_categories;

    // Email template aliases
    // Keep Extra Info For Email blank unless the user types into that field directly.
    if (v.__fromCaseGenerator) v.custom_value = '';

    // v24 fast working-case aliases
    if (!v.cli_findings && (v.evidence || v.cli_evidence)) v.cli_findings = [v.evidence, v.cli_evidence].filter(Boolean).join('\n\n');
    if (!v.final_output && v.salesforce_notes) v.final_output = v.salesforce_notes;
    if (!v.raw_salesforce && (v.issue_details || v.working_notes || v.my_next_checks)) {
      v.raw_salesforce = [v.issue_details, v.working_notes, v.my_next_checks].filter(Boolean).join('\n\n');
    }

    // P2 / outage aliases
    if (!v.discovery_details && v.contact_name) {
      v.discovery_details = [v.contact_name, v.contact_mobile || v.contact_phone || v.contact_number, v.contact_email || v.email].filter(Boolean).join(' | ');
    }
    if (!v.opened_time && v.start_time) v.opened_time = v.start_time;
    if (!v.outage_start && v.start_time) v.outage_start = v.start_time;

    return v;
  }

  function buildIssueSummary(values){
    values = withAliases(values);
    return cleanup([values.subject, values.issue_summary, values.issue_details].filter(Boolean).join('\n\n'));
  }

  function buildContactInfo(values){
    values = withAliases(values);
    return cleanup([
      values.contact_name ? `Contact Name: ${values.contact_name}` : '',
      values.contact_phone ? `Landline: ${values.contact_phone}` : '',
      values.contact_mobile ? `Mobile: ${values.contact_mobile}` : '',
      values.contact_email ? `Contact Email: ${values.contact_email}` : '',
      values.email && values.email !== values.contact_email ? `Email: ${values.email}` : ''
    ].filter(Boolean).join('\n'));
  }

  function buildIpMacInfo(values, fallbackText=''){
    values = withAliases(values);
    const ips = values.ip || values.ip_address || '';
    const macs = values.mac || values.mac_address || '';
    return cleanup([
      ips ? `IP Address(es): ${ips}` : '',
      macs ? `MAC Address(es): ${macs}` : ''
    ].filter(Boolean).join('\n'));
  }

  function buildSourceDestInfo(values, fallbackText=''){
    values = withAliases(values);
    return cleanup([
      values.source_ip ? `Source / External IP: ${values.source_ip}` : '',
      values.destination ? `Destination / Ports: ${values.destination}` : ''
    ].filter(Boolean).join('\n'));
  }


  function splitProactiveDeviceInformation(raw){
    const lines = String(raw || '')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(v => cleanup(v))
      .filter(Boolean)
      .filter(v => !/^Device Information$/i.test(v));
    const schoolIdx = lines.findIndex(v => /\b(school|college|kura|high school|primary|intermediate)\b/i.test(v));
    const school = schoolIdx >= 0 ? lines[schoolIdx] : '';
    const deviceLines = lines.filter((_, i) => i !== schoolIdx);
    return { school, deviceInfo: cleanup(deviceLines.join('\n')) };
  }

  function isProactiveEmailTemplate(formKey){
    return /^email-proactive-/i.test(String(formKey || ''));
  }


  function extractNamedSection(text, names){
    const raw = String(text || '').replace(/\r/g, '');
    const nameList = Array.isArray(names) ? names : [names];
    for (const name of nameList) {
      const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(?:^|\\n)\\s*(?:\\*\\*)?' + escaped + '(?:\\*\\*)?\\s*:?\\s*\\n([\\s\\S]*?)(?=\\n\\s*(?:\\*\\*)?[A-Z][A-Za-z0-9 /?&().-]{2,80}(?:\\*\\*)?\\s*:?\\s*\\n|$)', 'i');
      const m = raw.match(re);
      if (m && cleanup(m[1])) return cleanup(m[1]);
    }
    return '';
  }


  function parseTier2EscalationFields(raw){
    const text = String(raw || '').replace(/\r/g, '');
    const map = [
      ['ticket_number', ['Case Number', 'Ticket Number']],
      ['subject', ['Subject']],
      ['school_name', ['Account Name', 'School Name', 'Site']],
      ['moe_id', ['MoE ID']],
      ['firewall_id', ['Firewall ID']],
      ['reason', ['Why is this being escalated?', 'Why is this being escalated', 'Escalation Reason']],
      ['issue_summary', ['Summary of Issue?', 'Summary of Issue']],
      ['quick_fix', ['Is there a confluence article or quick fix documented?', 'Is there a confluence article or quick fix documented', 'Quick Fix']],
      ['affected_users', ['Number of impacted devices/users?', 'Number of impacted devices/users', 'Impacted Devices/Users']],
      ['area', ['Is this isolated to a physical area or SSID/VLAN?', 'Is this isolated to a physical area or SSID/VLAN', 'Physical Area / SSID / VLAN']],
      ['wire_type', ['Is this affecting wireless/wired?', 'Is this affecting wireless/wired', 'Wireless/Wired']],
      ['start_time', ['When did this start?', 'When did this start']],
      ['recurring', ['Is it a recurring issue?', 'Is it a recurring issue']],
      ['faz_check', ['IF filtering issue - is there anything blocked on FAZ?', 'If filtering issue - is there anything blocked on FAZ', 'FAZ Check']],
      ['evidence', ['Evidence Collected', 'Evidence']],
      ['contact_info', ['Names / Contact info', 'Names / Contact Info', 'Contact Info']],
      ['ip_mac', ['IP / MAC addresses', 'IP / MAC Addresses', 'IP/MAC addresses']],
      ['source_destination', ['Source / external IP / destination / ports', 'Source / External IP / Destination / Ports']],
      ['troubleshooting_summary', ['Summary of troubleshooting steps and configurational changes done so far?', 'Summary of troubleshooting steps and configurational changes done so far', 'Troubleshooting Summary']],
      ['missing_evidence_t2', ['Missing Evidence Before T2 Accepts', 'Missing Evidence']]
    ];
    const aliasToKey = new Map();
    map.forEach(([key, aliases]) => aliases.forEach(a => aliasToKey.set(String(a).trim().toLowerCase().replace(/:+$/, '').replace(/\s+/g, ' '), key)));
    const result = {};
    const lines = text.split('\n');
    let current = null;
    const strip = (line) => String(line || '')
      .trim()
      .replace(/^[-*•]\s*/, '')
      .replace(/^\*\*/, '')
      .replace(/\*\*$/, '')
      .trim()
      .replace(/:+$/, '')
      .trim();
    const normal = (line) => strip(line).toLowerCase().replace(/\s+/g, ' ');
    for (const rawLine of lines) {
      const key = aliasToKey.get(normal(rawLine));
      if (key) {
        current = key;
        if (!(current in result)) result[current] = '';
        continue;
      }
      if (current) {
        const line = String(rawLine || '').replace(/^\s*[-*•]\s*/, '').trimEnd();
        if (!line.trim() && !result[current]) continue;
        result[current] = cleanup([result[current], line].filter(Boolean).join('\n'));
      }
    }
    Object.keys(result).forEach(k => { result[k] = cleanup(result[k].replace(/^N\/A$/i, 'N/A')); });
    return result;
  }

  function parseSmart(raw){
    const text = normaliseSalesforcePasteText(raw);
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    const out = {};
    const take = (re) => { const m = text.match(re); return m ? cleanup(m[1] || m[0]) : ''; };

    const labels = new Set([
      'case','case number','ticket number','account name','school name','site','status','accepted by n4l','case owner name',
      'subject','tabs','feed','case details','notes & attachments','related cases','emails','email','contact phone',
      'contact mobile','contact name','contact email','form status','estimated ict sow amount','ict implementation contact',
      'opportunity','ict implementation provider','product','description','school migration status','7-in use','moe id','firewall id','device name',
      'contact number','landline','issue / request details','issue details','when it started','how many users','error message / anything change','evidence collected','resolution or next step','action summary','date/time under action',
      'student name','account (reporting)','installed n4l products','secondary contact','secondary contact mobile',
      'secondary contact email','secondary contact phone','description','security policy','url access management profile','url access profile','custom url categories','custom url category','troubleshooting / resolution / next step','address','phone',
      'why is this being escalated?','why is this being escalated','summary of issue?','summary of issue','is there a confluence article or quick fix documented?','is there a confluence article or quick fix documented','number of impacted devices/users?','number of impacted devices/users','is this isolated to a physical area or ssid/vlan?','is this isolated to a physical area or ssid/vlan','is this affecting wireless/wired?','is this affecting wireless/wired','when did this start?','when did this start','is it a recurring issue?','is it a recurring issue','if filtering issue - is there anything blocked on faz?','if filtering issue is there anything blocked on faz','names / contact info','ip / mac addresses','source / external ip / destination / ports','summary of troubleshooting steps and configurational changes done so far?','summary of troubleshooting steps and configurational changes done so far','missing evidence before t2 accepts'
    ]);
    function normalizeLabel(v){ return String(v || '').trim().replace(/:+$/, '').toLowerCase().replace(/\s+/g, ' '); }
    function getFieldValue(labelNames){
      const wanted = new Set(labelNames.map(normalizeLabel));
      for (let i = 0; i < lines.length; i++) {
        const line = normalizeLabel(lines[i]);
        if (!wanted.has(line)) continue;
        const collected = [];
        for (let j = i + 1; j < lines.length; j++) {
          const next = lines[j].trim();
          if (!next) continue;
          if (wanted.has(normalizeLabel(next)) || labels.has(normalizeLabel(next))) break;
          collected.push(next);
        }
        if (collected.length) return cleanup(collected.join('\n'));
      }
      return '';
    }

    const strict = {
      ticket_number: hardExtractSalesforceValue(raw, ['Case Number','Ticket Number','Case'], ['Account Name','Status','Case Owner Name','Subject']) || extractSalesforceExactValue(raw, ['Case Number','Ticket Number','Case']) || extractSalesforceLineField(raw, ['Case Number','Ticket Number','Case']),
      school_name: hardExtractSalesforceValue(raw, ['Account Name','School Name','Site'], ['Status','Case Owner Name','Subject','Date/Time Under Action','Tabs','Feed','Case Details','Contact Name','Contact Phone','Contact Mobile','Contact Email','School Migration Status','Estimated ICT SoW Amount','Account (Reporting)']) || extractSalesforceExactValue(raw, ['Account Name','School Name','Site']) || extractSalesforceLineField(raw, ['Account Name','School Name','Site']),
      contact_name: hardExtractSalesforceValue(raw, ['Contact Name'], ['School Migration Status','Contact Phone','Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Account (Reporting)']) || extractSalesforceExactValue(raw, ['Contact Name']) || extractSalesforceLineField(raw, ['Contact Name']),
      contact_phone: hardExtractSalesforceValue(raw, ['Contact Phone','Landline','Phone'], ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Contact Name']) || extractSalesforceExactValue(raw, ['Contact Phone','Landline','Phone']) || extractSalesforceLineField(raw, ['Contact Phone','Landline','Phone']),
      contact_mobile: hardExtractSalesforceValue(raw, ['Contact Mobile','Mobile'], ['Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Contact Name']) || extractSalesforceExactValue(raw, ['Contact Mobile','Mobile']) || extractSalesforceLineField(raw, ['Contact Mobile','Mobile']),
      contact_email: hardExtractSalesforceValue(raw, ['Contact Email'], ['Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Case Details','Student Name','Account (Reporting)']) || extractSalesforceExactValue(raw, ['Contact Email']) || extractSalesforceLineField(raw, ['Contact Email']),
      subject: hardExtractSalesforceValue(raw, ['Subject'], ['Date/Time Under Action','Tabs','Feed','Case Details','Notes & Attachments','Related Cases','Emails','Jira','Account Name','Contact Name','Status', ...SALESFORCE_IGNORED_IMPORT_FIELDS]) || extractSalesforceExactValue(raw, ['Subject']) || extractSalesforceLineField(raw, ['Subject'])
    };

    out.ticket_number = strict.ticket_number || extractSalesforceField(raw, ['Case Number','Ticket Number','Case'], ['Account Name','School Name','Status','Case Owner Name','Subject','Contact Name'])
      || take(/(?:ticket|case)\s*number\s*:\s*(.+)/i) || getFieldValue(['case number','ticket number','case']);
    out.school_name = strict.school_name || extractSalesforceField(raw, ['Account Name','School Name','Site'], ['Status','Case Owner Name','Subject','Date/Time Under Action','Tabs','Contact Name','Contact Phone','Contact Mobile','Contact Email','Email','School Migration Status','Estimated ICT SoW Amount','Account (Reporting)'])
      || take(/(?:school\s*name|account\s*name|site)\s*:\s*(.+)/i) || getFieldValue(['account name','school name','site']);
    out.moe_id = extractSalesforceField(raw, ['MoE ID'], ['Firewall ID','Account Name','Contact Name','Subject','Status'])
      || take(/moe\s*id\s*:\s*(.+)/i) || getFieldValue(['moe id']) || ((text.match(/\b\d{3}-\d{4}\b/) || [])[0] || '');
    out.firewall_id = extractSalesforceField(raw, ['Firewall ID'], ['Contact Name','Contact Phone','Contact Mobile','Contact Email','Subject','Status','Tabs'])
      || take(/firewall\s*id\s*:\s*(.+)/i) || getFieldValue(['firewall id']);
    out.contact_name = strict.contact_name || extractSalesforceField(raw, ['Contact Name'], ['Contact Phone','Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','School Migration Status','Account (Reporting)'])
      || take(/contact\s*name\s*:\s*(.+)/i) || take(/^name\s*:\s*(.+)$/im) || getFieldValue(['contact name']);
    const combinedPhone = extractSalesforceField(raw, ['Contact Phone','Landline','Phone','Contact Number'], ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Contact Name'])
      || take(/(?:contact\s*phone|landline|phone)\s*:\s*(.+)/i) || getFieldValue(['landline','contact phone','phone','contact number']);
    const landlineFromCombined = (combinedPhone.match(/(?:^|\b)L\s*[:\-]\s*([^|\n]+)/i) || [])[1] || '';
    const mobileFromCombined = (combinedPhone.match(/(?:^|\b)M\s*[:\-]\s*([^|\n]+)/i) || [])[1] || '';
    out.contact_phone = strict.contact_phone || extractSalesforceField(raw, ['Contact Phone','Landline'], ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject'])
      || take(/landline\s*:\s*(.+)/i) || landlineFromCombined || combinedPhone || getFieldValue(['landline']);
    out.contact_mobile = strict.contact_mobile || extractSalesforceField(raw, ['Contact Mobile','Mobile'], ['Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Case Details'])
      || take(/contact\s*mobile\s*:\s*(.+)/i) || take(/mobile\s*:\s*(.+)/i) || mobileFromCombined || getFieldValue(['contact mobile','mobile']);
    out.contact_number = take(/contact\s*number\s*:\s*(.+)/i) || out.contact_phone || take(/phone\s*:\s*(.+)/i) || '';
    out.contact_email = strict.contact_email || extractSalesforceField(raw, ['Contact Email'], ['Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Case Details','Student Name','Account (Reporting)'])
      || take(/contact\s*email\s*:\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i) || getFieldValue(['contact email']) || take(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})\b/i);
    out.email = out.contact_email;

    const deviceNameValue = getFieldValue(['device name']);
    if (!out.firewall_id) {
      const fwMatch = (text.match(/\b[a-z0-9._-]*fw\d+\b/i) || [])[0] || (deviceNameValue.match(/\b[a-z0-9._-]*fw\d+\b/i) || [])[0] || '';
      out.firewall_id = fwMatch || '';
    }

    const subjectValue = strict.subject || extractSalesforceField(raw, ['Subject'], ['Date/Time Under Action','Tabs','Feed','Case Details','Notes & Attachments','Related Cases','Emails','Jira','Account Name','Contact Name','Status', ...SALESFORCE_IGNORED_IMPORT_FIELDS]) || take(/subject\s*:\s*(.+)/i) || getFieldValue(['subject']);
    const descValue = cleanIssueDetailsText(getFieldValue(['description']));
    const deviceTable = extractDeviceTable(text);
    out.subject = cleanSalesforceSubject(subjectValue);
    out.school_name = cleanSalesforceFieldValue(out.school_name, ['Status','Case Owner Name','Contact Phone','Contact Mobile','Contact Name','Contact Email','Email','Tabs','Feed','Case Details','Account (Reporting)','Subject','School Migration Status','Estimated ICT SoW Amount']);
    out.firewall_id = cleanSalesforceFieldValue(out.firewall_id, ['Contact Name','Contact Phone','Contact Mobile','Contact Email','Subject','Tabs','Feed','Case Details']);
    out.contact_name = cleanSalesforceFieldValue(out.contact_name, ['Contact Phone','Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Feed','Case Details']);
    out.contact_phone = cleanSalesforceFieldValue(out.contact_phone, ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Feed','Case Details']);
    out.contact_mobile = cleanSalesforceFieldValue(out.contact_mobile, ['Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Feed','Case Details']);
    out.contact_email = cleanSalesforceFieldValue(out.contact_email, ['Form Status','Estimated ICT SoW Amount','Subject','Tabs','Feed','Case Details']);
    out.email = out.contact_email;

    // Final guard: ensure imported fields contain only their own Salesforce value.
    // Exact label-value extraction wins here because Salesforce case pages often repeat Account Name and Subject.
    const exactSchoolName = hardExtractSalesforceValue(raw, ['Account Name','School Name','Site'], ['Status','Case Owner Name','Subject','Date/Time Under Action','Tabs','Feed','Case Details','Contact Name','Contact Phone','Contact Mobile','Contact Email','School Migration Status','Estimated ICT SoW Amount','Account (Reporting)']) || extractSalesforceExactValue(raw, ['Account Name','School Name','Site']);
    const exactContactName = hardExtractSalesforceValue(raw, ['Contact Name'], ['School Migration Status','Contact Phone','Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject','Account (Reporting)']) || extractSalesforceExactValue(raw, ['Contact Name']);
    const exactPhone = hardExtractSalesforceValue(raw, ['Contact Phone','Landline'], ['Contact Mobile','Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject']) || extractSalesforceExactValue(raw, ['Contact Phone','Landline']);
    const exactMobile = hardExtractSalesforceValue(raw, ['Contact Mobile','Mobile'], ['Contact Email','Email','Form Status','Estimated ICT SoW Amount','Subject']) || extractSalesforceExactValue(raw, ['Contact Mobile','Mobile']);
    const exactContactEmail = hardExtractSalesforceValue(raw, ['Contact Email'], ['Email','Form Status','Estimated ICT SoW Amount','Subject','Tabs','Case Details']) || extractSalesforceExactValue(raw, ['Contact Email']);
    const exactSubject = hardExtractSalesforceValue(raw, ['Subject'], ['Date/Time Under Action','Tabs','Feed','Case Details','Notes & Attachments','Related Cases','Emails','Jira','Account Name','Contact Name','Status', ...SALESFORCE_IGNORED_IMPORT_FIELDS]) || extractSalesforceExactValue(raw, ['Subject']);
    if (exactSchoolName) out.school_name = exactSchoolName;
    if (exactContactName) out.contact_name = exactContactName;
    if (exactPhone) out.contact_phone = exactPhone;
    if (exactMobile) out.contact_mobile = exactMobile;
    if (exactContactEmail) out.contact_email = exactContactEmail;
    if (exactSubject) out.subject = exactSubject;

    out.school_name = cleanImportedSchoolName(out.school_name);
    out.subject = cleanImportedSubject(out.subject);
    out.ticket_number = finalCleanImportedField(out.ticket_number, ['Account Name','School Name','Status','Case Owner Name','Subject','Contact Name']);
    out.moe_id = finalCleanImportedField(out.moe_id, ['Firewall ID','Account Name','Contact Name','Subject','Status']);
    out.firewall_id = finalCleanImportedField(out.firewall_id, ['Account Name','Contact Name','Contact Phone','Contact Mobile','Contact Email','Subject','Status']);
    out.contact_name = cleanImportedContactName(out.contact_name);
    out.contact_phone = cleanImportedPhone(out.contact_phone);
    out.contact_mobile = cleanImportedMobile(out.contact_mobile);
    out.contact_email = cleanImportedEmail(out.contact_email);
    out.email = out.contact_email;

    out.start_time = take(/(?:when\s*it\s*started|start\s*time|date\/time\s*under\s*action)\s*:\s*(.+)/i) || getFieldValue(['when it started','start time','date/time under action']);
    out.affected_users = take(/how\s*many\s*users\s*:\s*(.+)/i) || getFieldValue(['how many users']);
    out.address = take(/address\s*:\s*(.+)/i) || getFieldValue(['address']);
    out.opened_time = take(/date\s*(?:and)?\s*time\s*case\s*opened\s*[:\-]\s*(.+)/i) || getFieldValue(['date and time case opened']);
    out.outage_start = take(/outage\s*start\s*time\s*[:\-]\s*(.+)/i) || getFieldValue(['outage start time']);
    out.discovery_mode = /\bproactive\b/i.test(text) ? 'Proactive' : (/\breactive\b|reported/i.test(text) ? 'Reactive' : '');
    out.discovery_details = take(/how\s*did\s*we\s*find\s*out\s*[-:]\s*([\s\S]*?)(?:\n(?:issue|troubleshooting\s*steps|next\s*action)\s*[-:]|$)/i);
    out.issue_summary = extractNamedSection(text, ['Technical Summary','Problem','Working Case Note','Current Status','Summary of Issue']) || take(/issue\s*[-:]\s*([\s\S]*?)(?:\n(?:troubleshooting\s*steps|next\s*action)\s*[-:]|$)/i);
    out.steps_taken = extractNamedSection(text, ['Immediate Next Checks','Troubleshooting Performed','Action Summary','Evidence / Checks']) || take(/troubleshooting\s*steps\s*[-:]\s*([\s\S]*?)(?:\n(?:next\s*action)\s*[:\-]|$)/i);
    out.next_steps = extractNamedSection(text, ['Next Step','Recommended Next Action','Decision Point']) || take(/next\s*action\s*[:\-]\s*([\s\S]*?)$/i);
    out.network_version = /\bMN3\b/i.test(text) ? 'MN3' : (/\bMN2\b/i.test(text) ? 'MN2' : '');
    out.security_policy = getFieldValue(['security policy']);
    out.url_access_profile = getFieldValue(['url access management profile','url access profile']);
    out.custom_url_categories = getFieldValue(['custom url categories','custom url category']);
    out.issue_details = cleanIssueDetailsText(getFieldValue(['issue / request details','issue details']) || take(/issue\s*\/\s*request\s*details\s*:\s*([\s\S]*?)(?:\n\s*\n[A-Z][^\n]*:|\n[A-Z][^\n]*:|$)/i)
      || take(/issue\s*details\s*:\s*([\s\S]*?)(?:\n\s*\n[A-Z][^\n]*:|\n[A-Z][^\n]*:|$)/i)
      || descValue || '');
    out.error_message = getFieldValue(['error message / anything change','error message','anything change']) || take(/error\s*message\s*\/\s*anything\s*change\s*:\s*([\s\S]*?)(?:\n\s*\n[A-Z][^\n]*:|\n[A-Z][^\n]*:|$)/i);
    out.checks_done = getFieldValue(['troubleshooting performed']) || take(/troubleshooting\s*performed\s*:\s*([\s\S]*?)(?:\n\s*\n[A-Z][^\n]*:|\n[A-Z][^\n]*:|$)/i);
    out.evidence = getFieldValue(['evidence collected','evidence']) || extractNamedSection(text, ['Evidence Collected','Confirmed Evidence','Evidence / Checks','Evidence to Capture']) || take(/evidence\s*collected\s*:\s*([\s\S]*?)(?:\n\s*\n[A-Z][^\n]*:|\n[A-Z][^\n]*:|$)/i) || '';
    if (deviceTable) out.evidence = cleanup([out.evidence, deviceTable].filter(Boolean).join('\n'));
    out.device = cleanup(extractDeviceNames(deviceTable || text).join(', '));
    out.mac = '';
    out.ip = '';
    out.resolution_or_next_step = getFieldValue(['action summary','troubleshooting / resolution / next step','resolution or next step','next step']) || take(/action\s*summary\s*:\s*([\s\S]*?)$/i) || take(/troubleshooting\s*\/\s*resolution\s*\/\s*next\s*step\s*:\s*([\s\S]*?)$/i) || take(/resolution\s*or\s*next\s*step\s*:\s*([\s\S]*?)$/i) || take(/next\s*step\s*:\s*([\s\S]*?)$/i);

    // Tier 2 escalation fields from escalation notes
    out.reason = getFieldValue(['why is this being escalated?','why is this being escalated','escalation reason']) || extractNamedSection(text, ['Why is this being escalated?','Why is this being escalated','Escalation Reason']);
    out.quick_fix = getFieldValue(['is there a confluence article or quick fix documented?','is there a confluence article or quick fix documented','quick fix']) || extractNamedSection(text, ['Is there a confluence article or quick fix documented?','Is there a confluence article or quick fix documented','Quick Fix']);
    out.affected_users = out.affected_users || getFieldValue(['number of impacted devices/users?','number of impacted devices/users','impacted devices/users']) || extractNamedSection(text, ['Number of impacted devices/users?','Number of impacted devices/users','Impacted Devices/Users']);
    out.area = getFieldValue(['is this isolated to a physical area or ssid/vlan?','is this isolated to a physical area or ssid/vlan','physical area','ssid/vlan']) || extractNamedSection(text, ['Is this isolated to a physical area or SSID/VLAN?','Is this isolated to a physical area or SSID/VLAN']);
    out.wire_type = getFieldValue(['is this affecting wireless/wired?','is this affecting wireless/wired','wireless/wired']) || extractNamedSection(text, ['Is this affecting wireless/wired?','Is this affecting wireless/wired']);
    out.recurring = getFieldValue(['is it a recurring issue?','is it a recurring issue','recurring issue']) || extractNamedSection(text, ['Is it a recurring issue?','Is it a recurring issue']);
    out.faz_check = getFieldValue(['if filtering issue - is there anything blocked on faz?','if filtering issue is there anything blocked on faz','faz check']) || extractNamedSection(text, ['IF filtering issue - is there anything blocked on FAZ?','If filtering issue - is there anything blocked on FAZ','FAZ Check']);
    out.contact_info = getFieldValue(['names / contact info','names/contact info','contact info']) || extractNamedSection(text, ['Names / Contact info','Names / Contact Info','Contact Info']);
    out.ip_mac = getFieldValue(['ip / mac addresses','ip/mac addresses']) || extractNamedSection(text, ['IP / MAC addresses','IP / MAC Addresses']);
    out.source_destination = getFieldValue(['source / external ip / destination / ports','source external ip destination ports']) || extractNamedSection(text, ['Source / external IP / destination / ports','Source / External IP / Destination / Ports']);
    out.missing_evidence_t2 = getFieldValue(['missing evidence before t2 accepts']) || extractNamedSection(text, ['Missing Evidence Before T2 Accepts','Missing Evidence']);
    out.troubleshooting_summary = getFieldValue(['summary of troubleshooting steps and configurational changes done so far?','summary of troubleshooting steps and configurational changes done so far']) || extractNamedSection(text, ['Summary of troubleshooting steps and configurational changes done so far?','Summary of troubleshooting steps and configurational changes done so far']);

    const tier2Parsed = parseTier2EscalationFields(text);
    Object.entries(tier2Parsed).forEach(([k, v]) => { if (cleanup(v)) out[k] = cleanup(v); });

    if (!out.issue_details) {
      out.issue_details = '';
    }
    if (!out.error_message) {
      out.error_message = '';
    }
    if (!out.checks_done) {
      out.checks_done = lines.filter(l => /checked|investigat|tested|reviewed|confirmed|validated/i.test(l)).join('\n');
    }
    if (!out.evidence) {
      out.evidence = '';
    }
    if (deviceTable && !out.evidence.includes(deviceTable)) {
      out.evidence = cleanup([out.evidence, deviceTable].filter(Boolean).join('\n'));
    }
    // Keep Troubleshooting / Resolution / Next Step clear unless Salesforce text contains
    // an explicit Resolution/Next Step field. Do not infer this from Status, Resolved,
    // Awaiting, Follow up, or other status-style Salesforce lines.
    if (!out.resolution_or_next_step) {
      out.resolution_or_next_step = '';
    }
    return withAliases(out);
  }

  function extractIPs(text){ return Array.from(new Set((String(text||'').match(/\b\d{1,3}(?:\.\d{1,3}){3}\b/g)||[]))); }
  function extractMACs(text){ return Array.from(new Set((String(text||'').match(/\b(?:[0-9a-fA-F]{2}[:\-]){5}[0-9a-fA-F]{2}\b/g)||[]))); }
  function extractDeviceTable(text){
    const raw = String(text || '').replace(/\r/g, '');
    const match = raw.match(/device\s*name[\s\S]*?(?=\n(?:resolution\s*or\s*next\s*step|troubleshooting\s*performed|evidence\s*collected)\s*:|$)/i);
    if (!match) return '';
    return cleanup(match[0]);
  }
  function extractDeviceNames(text){
    return Array.from(new Set((String(text || '').match(/\b[A-Z0-9][A-Z0-9._-]*-[A-Z0-9._-]+\b/g) || [])));
  }
  function extractPorts(text){
    const found = [];
    const re = /(?:port\s*:?\s*|tcp\/|udp\/)?(\d{2,5})/ig;
    let m;
    while ((m = re.exec(String(text||'')))) {
      if (m[1]) found.push(m[1]);
    }
    return Array.from(new Set(found.filter(x => Number(x) <= 65535)));
  }

  function parseInternetSpeedFields(raw){
    const text = String(raw || '').replace(/\r/g,'');
    const pick = (n, next) => {
      const pattern = '(?:^|\\n)\\s*' + n + '\\.\\s*[\\s\\S]*?(?:\\n|:)([\\s\\S]*?)(?=\\n\\s*' + next + '\\.|$)';
      const re = new RegExp(pattern, 'i');
      const m = text.match(re);
      return m ? cleanup(m[1]) : '';
    };
    return {
      website_scope: pick(1,2),
      lan_wifi_comparison: pick(2,3),
      speedtest: pick(3,4),
      trace_routes: pick(4,5),
      grafana: pick(5,6),
      bandwidth: pick(6,7),
      device_troubleshooting: pick(7,8)
    };
  }

  function inferNext(values){
    values = withAliases(values);
    return cleanup(values.resolution_or_next_step || values.reason || (/deny|blocked|policy/i.test(values.evidence || '') ? 'Needs escalation' : ''));
  }

  function makeSection(label, value){ value = cleanup(value); return value ? `${label}:\n${value}` : ''; }

  
  function cleanImportantCli(raw){
    const text = cleanup(raw || '');
    if (!text) return '';

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const important = [];
    const seen = new Set();

    const keepPatterns = [
      /^Port\s+\S+\s+is a member/i,
      /^VLANs\s+\d+/i,
      /^Untagged VLAN\s*:\s*\d+/i,
      /^Added untagged port/i,
      /^Removed/i,
      /^Write startup-config done/i,
      /^Copy Done/i,
      /\d{1,3}(?:\.\d{1,3}){3}\s*→.*(?:working|getting)/i,
      /scan working/i,
      /print.*working/i,
      /now getting/i
    ];

    const dropPatterns = [
      /^telnet@/i,
      /^No password has been assigned/i,
      /^conf t$/i,
      /^auth$/i,
      /^vlan\s+\d+/i,
      /^exit$/i,
      /^end$/i,
      /^wr m$/i,
      /^write memory is in progress/i,
      /^Automatic copy/i,
      /^Flash Memory Write/i,
      /^\.+$/i,
      /^MAC VLANs\s*:/i
    ];

    for (const line of lines) {
      if (dropPatterns.some(p => p.test(line))) continue;
      if (!keepPatterns.some(p => p.test(line))) continue;
      if (!seen.has(line)) {
        important.push(line);
        seen.add(line);
      }
    }

    return cleanup(important.join('\n'));
  }


  function standardiseCaseNoteHeadings(text){
    const headings = new Set([
      'Working Case Note','Action Summary','Evidence Collected','Troubleshooting Performed','Current Status','Next Step','Escalation Justification',
      'Problem','Evidence / Checks','Evidence','Checks Completed','My Next Checks','Final Output','Checks Completed / Findings / CLI Results','Salesforce Note / Outcome Summary','Technical Summary','Confirmed Evidence','Likely Fault Domain','Immediate Next Checks','Evidence to Capture','Decision Point','Short Working Note'
    ].map(h => h.toLowerCase()));
    return String(text || '').split('\n').map(line => {
      const trimmed = line.trim().replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
      const noColon = trimmed.replace(/:+$/, '').trim();
      if (headings.has(noColon.toLowerCase())) return noColon + ':';
      return line;
    }).join('\n');
  }

  function cleanCaseNoteText(text){
    let raw = cleanup(text || '');
    raw = standardiseCaseNoteHeadings(raw);
    if (!raw) return '';

    // Remove full contact details from generated Salesforce note
    raw = raw.replace(/\nMobile:\n[\s\S]*?(?=\n(?:Contact Email|Subject|Issue \/ Request Details|Evidence Collected|Troubleshooting \/ Resolution \/ Next Step|Action Summary):)/gi, '');
    raw = raw.replace(/\nContact Email:\n[\s\S]*?(?=\n(?:Subject|Issue \/ Request Details|Evidence Collected|Troubleshooting \/ Resolution \/ Next Step|Action Summary):)/gi, '');

    // Rename old troubleshooting section
    raw = raw.replace(/Troubleshooting \/ Resolution \/ Next Step:/gi, 'Action Summary:');

    // Keep raw CLI, but make CLI prompts cleaner for Salesforce notes:
    // telnet@SWITCH#command  -> telnet@SWITCH→command
    // This only applies to raw CLI prompt lines, not normal headings or text.
    raw = raw.replace(/^(\s*(?:telnet|ssh|admin|root)?@?[A-Za-z0-9_.-]+(?:\([^)]+\))?)#/gmi, '$1→');

    return cleanup(raw);
  }

function buildOutput(type, values, extra={}){
    values = withAliases(values);
    if (type === 'callCase') {
      const header = cleanup([
        'Call Case Note',
        makeSection('Account Name', values.school_name),
        makeSection('MoE ID', values.moe_id),
        makeSection('Firewall ID', values.firewall_id || values.moe_firewall || values.firewall_moe),
        makeSection('Contact Name', values.contact_name),
        makeSection('Subject', values.subject)
      ].filter(Boolean).join('\n'));
      const compactOutput = cleanup([
        header,
        makeSection('Issue / Request Details', cleanIssueDetailsText(values.issue_details) || values.subject),
        makeSection('Action Summary', values.resolution_or_next_step)
      ].filter(Boolean).join('\n'));
      return cleanCaseNoteText(compactOutput);
    }

    if (type === 'workingCase') {
      // Working Case output should stay short and Salesforce-focused.
      // Do not prepend school or caller headers; those already live in the case fields.
      const finalNotes = cleanup(values.final_output || values.salesforce_notes || '').replace(/\*\*/g, '');
      if (finalNotes) return cleanCaseNoteText(finalNotes);

      const issueSummary = combineUniqueBlocks([
        values.subject,
        values.raw_salesforce,
        values.working_notes,
        values.my_next_checks
      ]);
      const findingsSummary = combineUniqueBlocks([
        values.cli_findings,
        values.evidence,
        values.cli_evidence,
        values.ai_synopsis ? 'Technical Triage:\n' + values.ai_synopsis : ''
      ]);

      const compactOutput = cleanup([
        makeSection('Working Case Note', cleanIssueDetailsText(values.subject) || 'N/A'),
        makeSection('Action Summary', cleanIssueDetailsText(combineUniqueBlocks([values.raw_salesforce, values.latest_update])) || 'N/A'),
        makeSection('Evidence Collected', findingsSummary || 'N/A'),
        makeSection('Troubleshooting Performed', values.cli_findings || values.evidence || values.cli_evidence || 'N/A'),
        makeSection('Current Status', values.resolution_or_next_step || values.current_status || 'Further testing / update required.')
      ].filter(Boolean).join('\n'));
      return cleanCaseNoteText(compactOutput);
    }

    if (type === 'tier2') {
      return cleanup([
        'Tier 2 Escalation',
        makeSection('Case Number', values.ticket_number || values.case_number),
        makeSection('Subject', values.subject),
        makeSection('Account Name', values.school_name || values.account_name),
        makeSection('MoE ID', values.moe_id),
        makeSection('Firewall ID', values.firewall_id || values.moe_firewall || values.firewall_moe),
        makeSection('Why is this being escalated?', values.reason),
        makeSection('Summary of Issue?', values.issue_summary),
        makeSection('Is there a confluence article or quick fix documented?', values.quick_fix),
        makeSection('Number of impacted devices/users?', values.affected_users),
        makeSection('Is this isolated to a physical area or SSID/VLAN?', values.area),
        makeSection('Is this affecting wireless/wired?', values.wire_type),
        makeSection('When did this start?', values.start_time),
        makeSection('Is it a recurring issue?', values.recurring),
        makeSection('IF filtering issue - is there anything blocked on FAZ?', values.faz_check),
        makeSection('Evidence Collected', values.evidence),
        makeSection('Names / Contact info', values.contact_info || buildContactInfo(values)),
        makeSection('IP / MAC addresses', values.ip_mac || buildIpMacInfo(values)),
        makeSection('Source / external IP / destination / ports', values.source_destination || buildSourceDestInfo(values)),
        makeSection('Summary of troubleshooting steps and configurational changes done so far?', values.troubleshooting_summary || values.resolution_or_next_step || values.checks_done || values.troubleshooting_performed),
        makeSection('Missing Evidence Before T2 Accepts', values.missing_evidence_t2)
      ].filter(Boolean).join('\n'));
    }
    if (type === 'incp2') {
      return cleanup([
        'Fortigate INC P2 Escalation',
        makeSection('MoE ID', values.moe_id),
        makeSection('Firewall ID', values.firewall_id || values.moe_firewall || values.firewall_moe),
        makeSection('Account Name', values.school_name),
        makeSection('Summary of Issue', buildIssueSummary(values)),
        makeSection('Evidence Collected', values.evidence || values.faz_check),
        makeSection('Action Summary', values.resolution_or_next_step || values.troubleshooting || values.checks_done || values.steps_taken),
        makeSection('Resolution or Next Step', values.resolution_or_next_step || values.next_steps)
      ].filter(Boolean).join('\n'));
    }
    if (type === 'p2googlechat') {
      const heading = cleanup(`P2 Initial ${values.ticket_number || ''} || ${values.network_version || ''}`);
      return cleanup([
        heading,
        values.school_name || '',
        values.moe_id ? `MoE: ${values.moe_id}` : '',
        values.address || '',
        values.opened_time ? `Date and Time Case Opened: ${values.opened_time}` : '',
        values.outage_start ? `Outage Start Time - ${values.outage_start}` : '',
        values.discovery_mode || values.discovery_details ? `How did we find out - ${cleanup([values.discovery_mode, values.discovery_details].filter(Boolean).join(' - '))}` : '',
        values.issue_summary ? `Issue - ${values.issue_summary}` : '',
        values.steps_taken ? `Troubleshooting Steps - ${values.steps_taken}` : '',
        values.next_steps ? `Next Action: ${values.next_steps}` : ''
      ].filter(Boolean).join('\n'));
    }
    if (type === 'internet_speed') {
      return cleanup([
        'Internet Speed Issue Template',
        makeSection('Account Name', values.school_name),
        makeSection('MoE ID', values.moe_id),
        makeSection('Firewall ID', values.firewall_id || values.moe_firewall || values.firewall_moe),
        makeSection('Best technical contact', values.best_technical_contact || buildContactInfo(values)),
        'Please engage ICT for information on points 1–3. I’ll escalate this to Tier 2 as soon as I receive their feedback.',
        makeSection('1. Verify whether more than one website is experiencing slow accessibility or just a single Website', values.website_scope),
        makeSection('2. Speed comparison between LAN and Wireless?', values.lan_wifi_comparison),
        makeSection('3. Speedtest', values.speedtest),
        makeSection('4. Provide trace routes (Source and Destination IP) and Trace result indicating slow throughput of the Network.', values.trace_routes),
        makeSection('5. Monitor Network Traffic: Grafana tool. Is there any packet loss, latency or congestion ?', values.grafana),
        makeSection('6. Bandwidth Utilization: Monitor network bandwidth usage to identify any bandwidth-heavy applications, users or activities.', values.bandwidth),
        makeSection('7. Device Troubleshooting: FW hardware utilization stats e.g. high CPU, Memory etc Port limitation, CRC Error on switch uplinks ?', values.device_troubleshooting),
        makeSection('Next Action', values.next_steps)
      ].filter(Boolean).join('\n'));
    }

    if (type === 'email') {
      const formKey = extra.formKey || '';
      const proactiveInfo = isProactiveEmailTemplate(formKey) ? splitProactiveDeviceInformation(values.custom_value || values.url || '') : { school:'', deviceInfo:'' };
      const rawCustomValue = cleanup(isProactiveEmailTemplate(formKey) ? proactiveInfo.deviceInfo : (values.custom_value || values.url || ''));
      const customValue = /whitelisted|blocked/i.test(formKey) ? formatUrlListForEmail(rawCustomValue) : rawCustomValue;
      const schoolName = cleanup(values.school_name || proactiveInfo.school || '');
      const ticketNumber = formatCaseNumber(values.ticket_number || '');
      let body = removeTicketSentenceFromProactiveTemplate(
        formKey,
        normalizeCustomerTemplateTicketSentence(extra.templateBody || 'Kia ora {{to_name}},\n\n{{custom_value}}')
      )
        .replace(/{{to_name}}/g, values.to_name || values.contact_name || 'team')
        .replace(/{{ticket_number}}/g, ticketNumber)
        .replace(/{{school_name}}/g, schoolName)
        .replace(/{{custom_value}}/g, customValue)
        .replace(/{{url}}/g, customValue)
        .replace(/{{subject}}/g, customValue)
        .replace(/#{2,}(?=\d)/g, '#');

      if (customValue && !isProactiveEmailTemplate(formKey) && !/{{\s*custom_value\s*}}/i.test(extra.templateBody || '') && !body.includes(customValue)) {
        body = body.trimEnd() + '\n\n' + customValue;
      }
      return removeCustomerSignature(body);
    }
    if (type === 'mn3_truck_roll') {
      return cleanup([
        'MN3 Truck Roll Template',
        makeSection('Has an isolation test been completed?', values.isolation_test),
        makeSection('Yes / No - Comments', values.isolation_comments),
        makeSection('Has the ONT been power cycled?', values.ont_power_cycled),
        makeSection('Yes / No - Comments', values.ont_power_cycle_comments),
        makeSection("What are the current status' of the ONT lights:", [
          values.ont_power ? `Power = ${values.ont_power}` : '',
          values.ont_alarm ? `Alarm = ${values.ont_alarm}` : '',
          values.ont_optical ? `Optical = ${values.ont_optical}` : '',
          values.ont_lan ? `LAN = ${values.ont_lan}` : ''
        ].filter(Boolean).join('\n')),
        makeSection('Are there any reported fibre outages in the region?', values.fibre_outages),
        makeSection('School Site Contact Details', [
          values.site_contact_name ? `Name: ${values.site_contact_name}` : '',
          values.site_contact_mobile ? `Mobile: ${values.site_contact_mobile}` : '',
          values.site_access ? `Site Access: ${values.site_access}` : ''
        ].filter(Boolean).join('\n'))
      ].filter(Boolean).join('\n'));
    }
    return cleanup(JSON.stringify(values, null, 2));
  }

  async function copyPlainText(text, options={}){
    // Clean spacing for Salesforce
    let clean = cleanup(String(text || ''))
      .replace(/\r/g,'')
      .replace(/\n{3,}/g,'\n\n')
      .trim();

    const templateSpacing = !!options.templateSpacing;
    const disableHtmlBold = !!options.disableHtmlBold;

    // Keep compact case notes, but give customer/email/escalation templates paragraph spacing.
    const knownHeadingRegex = /^(Account Name|MoE ID|Firewall ID|Contact Name|Landline|Mobile|Contact Email|Names \/ Contact info|Subject|Issue \/ Request Details|Evidence Collected|Action Summary|Verification \/ Important CLI Info|Reason for Request|Summary of Issue|Next Action|Troubleshooting Steps|Security Policy|URL Access Management Profile|Custom URL Categories|Why is this being escalated\?|When did this start\?|Is it a recurring issue\?|IF filtering issue - is there anything blocked on FAZ\?|IP \/ MAC addresses|Source \/ external IP \/ destination \/ ports|Summary of troubleshooting steps and configurational changes done so far\?):$/i;

    function isOutputHeading(line){
      const t = String(line || '').trim();
      if (!t.endsWith(':')) return false;
      if (knownHeadingRegex.test(t)) return true;

      // Generic safe heading rule: bold short field labels ending in colon.
      // Avoid CLI, URLs, IPs and VLAN output.
      if (t.length > 120) return false;
      if (/^(telnet|ssh|admin|root)?@/i.test(t)) return false;
      if (/^https?:\/\//i.test(t)) return false;
      if (/^\d{1,3}(?:\.\d{1,3}){3}/.test(t)) return false;
      if (/^VLANs?\s+\d+/i.test(t)) return false;
      return /^[A-Za-z0-9][A-Za-z0-9\s\/\-()?#.&]+:$/.test(t);
    }

    const html = clean
      .split('\n')
      .map(line => {
        const trimmed = line.trim();

        if (!trimmed){
          return '<div style="height:10px; line-height:10px; margin:0; padding:0; font-size:1px;">&nbsp;</div>';
        }

        const margin = 'margin:0; padding:0; line-height:1.2;';

        if (!disableHtmlBold && isOutputHeading(trimmed)){
          return `<div style="${margin}"><strong>${escapeHtml(trimmed)}</strong></div>`;
        }

        return `<div style="${margin}">${escapeHtml(line)}</div>`;
      })
      .join('');

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/plain': new Blob([clean], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' })
        });

        await navigator.clipboard.write([item]);
        return;
      }
    } catch(err){
      console.error(err);
    }

    // Fallback: add actual blank lines for template copies if HTML clipboard is unavailable.
    const fallbackText = clean;

    const ta = document.createElement('textarea');
    ta.value = fallbackText;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }

  function renderList(items){ return `<ul>${(items||[]).map(i => `<li>${esc(i)}</li>`).join('')}</ul>`; }

  function stableHash(text){
    let h = 0;
    const str = String(text || '');
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  }


  function commandSafetyMeta(pageId, block){
    const raw = String(block?.code || '');
    const code = raw.split(/\n/).map(line => line.replace(/^\s*(?:#|\/\/).*$/, '').trim()).filter(Boolean).join('\n').toLowerCase();
    const page = String(pageId || '').toLowerCase();
    const disruptive = /(^|\n)\s*(?:reboot|reload|set factory(?:\s+reboot)?|request restart system|debug software restart|erase|format)(?:\s|$)|\bclear\s+(?:session|vpn|arp|mac|counter|counters)\b/.test(code);
    const approval = /\b(?:write memory|manager connect|manager disconnect|configure terminal|conf t|commit(?: force)?|copy\s+\S+\s+flash|boot system|delete\s+\S+|set director|set scg|set ipaddr|set vlan)\b/.test(code) || /firmware|reset|backup-controller|commit-jobs/.test(page);
    const advanced = /\b(?:tcpdump|packet-diag|packet capture|pcap|debug|test vpn|show session all filter)\b/.test(code) || /advanced|pcap|evidence|telemetry|auth-admin|management/.test(page);
    if (disruptive) return {tone:'command-disruptive',label:'DISRUPTIVE — APPROVAL REQUIRED',description:'May interrupt service or clear operational state. Confirm impact, approval and rollback before use.'};
    if (approval) return {tone:'command-approval',label:'CHANGE / APPROVAL REQUIRED',description:'Review the exact platform, impact and rollback. Do not run as routine T1 troubleshooting.'};
    if (advanced) return {tone:'command-safe-t2',label:'T2 / ADVANCED — READ ONLY',description:'Use for deeper investigation. Capture the exact command, timestamp and output.'};
    return {tone:'command-safe-t1',label:'T1 SAFE — READ ONLY',description:'Read-only check. Compare the result with the expected healthy state and record the evidence.'};
  }

  function renderCode(pageId, block){
    const noteKey = sKey(pageId || 'page', 'cliWork', stableHash((block.title || '') + '|' + (block.code || '')));
    const safety = commandSafetyMeta(pageId, block);
    return `<div class="cli-section-wrap ${safety.tone}"><div class="command-safety-strip"><span class="command-safety-badge">${esc(safety.label)}</span><small>${esc(safety.description)}</small></div><div class="codewrap"><div class="code-actions"><button class="codebtn" type="button" data-copy-code="${esc(block.code || '')}">Copy</button></div><pre><code>${esc(block.code || '')}</code></pre></div>
      <div class="cli-workbox">
        <label>My CLI notes / working details</label>
        <textarea data-cli-work-area="${esc(noteKey)}" placeholder="Paste your own CLI notes, checks, or results here.">${esc(loadText(noteKey, ''))}</textarea>
        <div class="btnrow"><button class="btn secondary" type="button" data-pin-live-cli-section="${esc(noteKey)}" data-pin-live-cli-code="${esc(block.code || '')}">Pin whole CLI section to Workspace</button><button class="btn secondary" type="button" data-cli-work-copy="${esc(noteKey)}">Copy notes</button><button class="btn secondary" type="button" data-cli-work-clear="${esc(noteKey)}">Clear section</button></div>
      </div></div>`;
  }

  function renderFormGrid(fields, values){
    return `<div class="form-grid">${(fields || []).map(field => {
      const value = values[field.name] || '';
      const full = field.type === 'textarea' ? ' full' : '';

      if (field.type === 'select') {
        return `<div class="${full.trim()}"><label>${esc(field.label || field.name)}</label><select data-field="${esc(field.name)}"><option value="">Select...</option>${(field.options || []).map(opt => `<option value="${esc(opt)}" ${opt===value?'selected':''}>${esc(opt)}</option>`).join('')}</select></div>`;
      }

      if (field.type === 'textarea') {
        if (field.name === 'case_update') {
          return `<details class="full case-latest-update-panel"><summary>${esc(field.label || 'Latest Update / Case Update')}</summary><div class="case-latest-update-body"><textarea class="no-autoexpand" data-field="${esc(field.name)}" placeholder="${esc(field.placeholder || '')}">${esc(value)}</textarea></div></details>`;
        }

        if (field.collapsible) {
          const hasValue = cleanup(value) ? ' has-value' : '';
          return `<details class="full collapsible-field${hasValue}" data-collapsible-field="${esc(field.name)}">
            <summary>
              <span class="collapsible-title">${esc(field.label || field.name)}</span>
              <span class="collapsible-actions">
                <button class="field-copy-btn collapsible-copy-btn" type="button" data-copy-collapsible="${esc(field.name)}">Copy</button>
                <span class="collapsible-state">Click to expand</span>
              </span>
            </summary>
            <textarea class="no-autoexpand collapsible-textarea" data-field="${esc(field.name)}" placeholder="${esc(field.placeholder || '')}">${esc(value)}</textarea>
          </details>`;
        }

        return `<div class="full"><label>${esc(field.label || field.name)}</label><textarea data-field="${esc(field.name)}" placeholder="${esc(field.placeholder || '')}">${esc(value)}</textarea></div>`;
      }

      return `<div><label>${esc(field.label || field.name)}</label><input type="text" data-field="${esc(field.name)}" value="${esc(value)}" placeholder="${esc(field.placeholder || '')}" /></div>`;
    }).join('')}</div>`;
  }

  function getSendTargetOptions(){
    const pages = runbook.pages || {};
    const groups = [
      ['Workspace', ['case-working-template']],
      ['Email Templates', ['email-new','email-resolved','email-followup','email-followup2','email-resolved5','email-whitelisted','email-blocked','email-google-sites-blocking']],
      ['Escalation', ['template-tier2','template-mn3-truck-roll','template-p2-googlechat','template-internet-speed']]
    ];
    const out = ['<option value="">Select template...</option>'];
    groups.forEach(([label, ids]) => {
      const options = ids.map(id => {
        const page = pages[id];
        return page ? `<option value="${esc(id)}">${esc(page.title || id)}</option>` : '';
      }).filter(Boolean).join('');
      if (options) out.push(`<optgroup label="${esc(label)}">${options}</optgroup>`);
    });
    return out.join('');
  }

  function outputColumnsHTML(outputs){
    const working = cleanup(outputs.working || '');
    return `<div class="output-grid">
      <div class="output-card"><div class="output-head"><span>Working / Case Note</span><button class="btn secondary small-copy" type="button" data-copy-output="working">Copy</button></div><div class="output-area" data-output-area="working" data-raw-output="${esc(working)}">${formatOutputHTML(working)}</div></div>
    </div>`;
  }

  function renderCaseProgressBar(pageId, formKey){
    return '';
  }

  function hasMeaningfulTicketData(pageId, formKey, n){
    const values = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
    const importantFields = [
      'ticket_number','case_number','school_name','account_name','moe_id','firewall_id',
      'contact_name','contact_phone','contact_mobile','contact_email','subject',
      'raw_salesforce','latest_update','cli_findings','missing_evidence','resolution_or_next_step','final_output','workflow_status','issue_type','impact_scope','started_when'
    ];
    const hasFieldData = importantFields.some(k => cleanup(values && values[k]));
    const sfImport = cleanup(loadText(sKey(pageId, formKey, 'slot', n, 'sf_import'), ''));
    const outputs = loadJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''});
    const hasOutput = cleanup(outputs && outputs.working);
    return !!(hasFieldData || sfImport || hasOutput);
  }

  function renderTicketButton(pageId, formKey, n, active, displayLabel, hidden=false){
    const label = displayLabel || `Ticket ${n}`;
    const hiddenAttr = hidden ? ' hidden' : '';
    return `<button class="tabbtn ${active ? 'active' : ''}" type="button" data-slot-tab="${esc(formKey)}" data-slot-no="${n}"${hiddenAttr}>${esc(label)}</button>`;
  }

  function getActiveWorkingSlot(pageId, formKey, slotCount){
    const raw = Number(loadText(sKey(pageId, formKey, 'active-slot'), '0'));
    if (raw >= 1 && raw <= slotCount && hasMeaningfulTicketData(pageId, formKey, raw)) return raw;
    return 0;
  }

  function setActiveWorkingSlot(pageId, formKey, slotNo){
    const n = Number(slotNo || 0);
    if (Number.isFinite(n) && n >= 0) saveText(sKey(pageId, formKey, 'active-slot'), String(n));
  }

  function renderTicketGroups(pageId, formKey, slotCount){
    const activeSlot = getActiveWorkingSlot(pageId, formKey, slotCount);
    const parkedButtons = [];
    const activeButtons = [];
    let firstEmptySlot = null;

    for (let i = 1; i <= slotCount; i++) {
      const used = hasMeaningfulTicketData(pageId, formKey, i);
      const isActiveSlot = activeSlot > 0 && i === activeSlot;
      const label = used || isActiveSlot ? undefined : `Ticket ${i} — Empty`;
      const btn = renderTicketButton(pageId, formKey, i, isActiveSlot, label, !(used || isActiveSlot))
        .replace('tabbtn ', `tabbtn ${isActiveSlot ? 'current-working-ticket active-case-ticket ' : 'parked-ticket parked-case-ticket '} `);

      if (isActiveSlot) activeButtons.push(btn);
      else parkedButtons.push(btn);
      if (!used && firstEmptySlot == null) firstEmptySlot = i;
    }

    const phoneCallButton = firstEmptySlot == null
      ? `<button class="tabbtn phone-call-ticket" type="button" disabled>Phone Call / New Case - No empty slots</button>`
      : `<button class="tabbtn phone-call-ticket" type="button" data-slot-tab="${esc(formKey)}" data-slot-no="${firstEmptySlot}">Phone Call / New Case</button>`;

    return `<div class="ticket-groups">
      <div class="phone-call-ticket-wrap">${phoneCallButton}</div>
      <div class="ticket-search-wrap"><input class="ticket-search ticket-search-all" data-ticket-search="all" placeholder="Search ticket #" aria-label="Search ticket number across current and parked cases" /></div>
      <details class="ticket-group current-working-group parked-cases-group"><summary><span class="ticket-group-title"><span class="semantic-status-dot parked" aria-hidden="true"></span>Park / Working on cases</span><span class="park-header-actions"><button class="park-clear-btn" type="button" data-clear-selected-parked title="Clear the currently selected parked case">Clear selected</button><button class="park-clear-btn park-clear-all-btn" type="button" data-clear-all-parked title="Clear all parked cases">Clear all</button></span><span class="ticket-count-wrap"><span class="ticket-count" data-ticket-count="working">${parkedButtons.filter(b => !b.includes(' hidden')).length}</span><span class="ticket-group-arrow" aria-hidden="true"></span></span></summary><div class="tabrow ticket-tabrow" data-ticket-group="working">${parkedButtons.join('')}</div></details>
      <details class="ticket-group parked-ticket-group active-case-group"><summary><span class="ticket-group-title active-title"><span class="semantic-status-dot active" aria-hidden="true"></span>Current Active case</span> <span class="ticket-count" data-ticket-count="parked">${activeButtons.length}</span></summary><div class="tabrow ticket-tabrow" data-ticket-group="parked">${activeButtons.join('')}</div></details>
      <div class="active-case-move-section"><button class="btn move-working-btn" type="button" data-move-slot-to-working>Move this case to Current Active case</button></div>
    </div>`;
  }

  function renderIssueGuidancePanel(issue){
    const flow=ISSUE_WORKFLOWS.find(x=>x.issue===issue)||ISSUE_WORKFLOWS.find(x=>x.issue==='Other');
    return `<div class="case-guidance" data-case-guidance>
      <div class="case-guidance-head"><span>${iconSvg(flow.icon)}</span><div><small>GUIDED WORKFLOW</small><strong>${esc(flow.title)}</strong><p>${esc(flow.summary)}</p></div></div>
      <div class="case-guidance-columns"><div><h4>Ask first</h4>${renderList(flow.questions)}</div><div><h4>Check next</h4>${renderList(flow.checks)}</div><div><h4>Record before deciding</h4>${renderList(flow.evidence)}</div></div>
      <div class="btnrow">${flow.links.map(([label,id])=>`<a class="btn secondary" href="#${esc(id)}">${esc(label)}</a>`).join('')}<a class="btn secondary" href="#troubleshooting-hub">All workflows</a></div>
    </div>`;
  }


  function caseEvidenceReadiness(values){
    const v = withAliases(values || {});
    const critical = [
      ['Primary issue', v.issue_type],
      ['Impact / scope', v.impact_scope],
      ['Confirmed checks or findings', v.cli_findings],
      ['Current decision / next action', v.resolution_or_next_step]
    ];
    const recommended = [
      ['Ticket number', v.ticket_number],
      ['When it started', v.started_when],
      ['School', v.school_name]
    ];
    const missingCritical = critical.filter(([,value]) => !cleanup(value)).map(([label]) => label);
    const missingRecommended = recommended.filter(([,value]) => !cleanup(value)).map(([label]) => label);
    if (missingCritical.length) return {tone:'not-ready', icon:'✕', title:'Not ready for escalation', detail:`Missing: ${missingCritical.join(', ')}`};
    if (missingRecommended.length) return {tone:'warning', icon:'!', title:'Evidence ready with warnings', detail:`Recommended: ${missingRecommended.join(', ')}`};
    return {tone:'ready', icon:'✓', title:'Evidence ready', detail:'Core issue, scope, findings and next action are recorded.'};
  }

  function renderEvidenceReadiness(values){
    const state = caseEvidenceReadiness(values);
    return `<div class="evidence-readiness ${state.tone}" data-evidence-readiness><span class="evidence-readiness-icon" aria-hidden="true">${state.icon}</span><div><strong>${esc(state.title)}</strong><small>${esc(state.detail)}</small></div></div>`;
  }

  function renderSlotForm(pageId, block){
    const slot = 1;
    const values = withAliases(loadJson(sKey(pageId, block.formKey, 'slot', slot), {}));
    const outputs = loadJson(sKey(pageId, block.formKey, 'slot', slot, 'outputs'), {working:''});
    if(pageId!=='case-working-template') return `<div class="step"><div class="step-title">${esc(block.title || 'Generator')}</div>${renderTicketGroups(pageId, block.formKey, block.slotCount || 10)}<div class="form" data-slot-form="${esc(block.formKey)}" data-page-id="${esc(pageId)}" data-template-type="${esc(block.templateType || '')}" data-slot-count="${esc(block.slotCount || 10)}">${block.salesforceImport ? `<label>Paste Salesforce ticket text (optional)</label><textarea class="no-autoexpand sf-import-box" data-sf-import placeholder="Paste the raw Salesforce ticket text here, then click Import Salesforce text."></textarea><div class="btnrow"><button class="btn" type="button" data-sf-import-btn>Import Salesforce text</button><button class="btn secondary danger-clear" type="button" data-clear-slot>CLEAR CASE</button></div>` : ''}${renderFormGrid(block.fields || [], values)}<div class="btnrow generate-row"><button class="btn generate-main" type="button" data-generate-slot>GENERATE</button></div><div class="btnrow"><select class="search" data-send-target>${getSendTargetOptions()}</select><button class="btn" type="button" data-send-slot>Send to selected template</button></div><div class="statusline" data-slot-status>Saved locally.</div><div class="muted" style="margin-top:14px;font-weight:700;">Generated output</div>${outputColumnsHTML(outputs)}<div class="btnrow bottom-case-actions"><button class="btn secondary danger-clear" type="button" data-clear-slot>CLEAR CASE</button></div></div></div>`;

    const fields=block.fields||[];
    const pick=names=>fields.filter(f=>names.includes(f.name));
    const phase=loadText(sKey('case-working-template','workspace-phase'),'intake');
    const intake=pick(['ticket_number','school_name','moe_id','firewall_id','contact_name','contact_phone','contact_mobile','contact_email','subject','workflow_status','issue_type','impact_scope','started_when']);
    const troubleshoot=pick(['raw_salesforce']);
    const evidence=pick(['cli_findings','missing_evidence','resolution_or_next_step']);
    const output=pick(['final_output']);
    const status=values.workflow_status||'Investigating';
    return `<section class="case-desk active-case-shell ${statusClass(status)}" data-modern-case-desk>
      <div class="case-desk-top"><div><span class="eyebrow">DAILY CASE WORKSPACE</span><h2>Current and parked support cases</h2><p>One case record follows you through troubleshooting pages, evidence and final outputs.</p></div><div class="case-desk-state"><span class="status-pill ${statusClass(status)}" data-desk-status-pill>${esc(status)}</span></div></div>
      ${renderTicketGroups(pageId, block.formKey, block.slotCount || 100)}
      <div class="form case-stage-form" data-slot-form="${esc(block.formKey)}" data-page-id="${esc(pageId)}" data-template-type="${esc(block.templateType || '')}" data-slot-count="${esc(block.slotCount || 100)}">
        <nav class="case-stage-tabs" aria-label="Case workflow stages">
          ${[['intake','1','Intake','Case details and impact'],['troubleshoot','2','Troubleshoot','Plan and working notes'],['evidence','3','Evidence','Results and decision'],['output','4','Output','Salesforce, customer or escalation']].map(([id,n,label,desc])=>`<button class="case-stage-tab stage-${id} ${phase===id?'active':''}" type="button" data-case-phase="${id}"><span>${n}</span><div><strong>${label}</strong><small>${desc}</small></div></button>`).join('')}
        </nav>
        <section class="case-stage-panel stage-intake ${phase==='intake'?'active':''}" data-case-panel="intake">
          <div class="stage-heading"><div><span class="eyebrow">STAGE 1</span><h3>Intake and classification</h3><p>Import Salesforce details, confirm the customer impact, and select the primary issue.</p></div>${iconSvg('case')}</div>
          ${block.salesforceImport ? `<div class="sf-intake-card"><label>Paste Salesforce ticket text</label><textarea class="no-autoexpand sf-import-box" data-sf-import placeholder="Paste the raw Salesforce ticket text here, then import it into the case."></textarea><div class="btnrow"><button class="btn" type="button" data-sf-import-btn>Import Salesforce text</button><button class="btn secondary danger-clear" type="button" data-clear-slot>Clear case</button></div></div>` : ''}
          ${renderFormGrid(intake,values)}
          <div class="stage-next"><button class="btn" type="button" data-open-case-phase="troubleshoot">Continue to Troubleshoot →</button></div>
        </section>
        <section class="case-stage-panel stage-troubleshoot ${phase==='troubleshoot'?'active':''}" data-case-panel="troubleshoot">
          <div class="stage-heading"><div><span class="eyebrow">STAGE 2</span><h3>Troubleshoot the reported symptom</h3><p>Use the guided workflow, record working notes, and move from the closest layer to the user.</p></div>${iconSvg('troubleshoot')}</div>
          <div data-case-guidance-host>${renderIssueGuidancePanel(values.issue_type||'Other')}</div>
          ${renderFormGrid(troubleshoot,values)}
          <div class="stage-next"><button class="btn secondary" type="button" data-open-case-phase="intake">← Intake</button><button class="btn" type="button" data-open-case-phase="evidence">Continue to Evidence →</button></div>
        </section>
        <section class="case-stage-panel stage-evidence ${phase==='evidence'?'active':''}" data-case-panel="evidence">
          <div class="stage-heading"><div><span class="eyebrow">STAGE 3</span><h3>Evidence and technical decision</h3><p>Separate confirmed results from assumptions and identify exactly what remains missing.</p></div>${iconSvg('shield')}</div>
          <div class="diagnostic-decision-grid">
            <section class="diagnostic-card confirmed-facts"><div class="diagnostic-card-head"><span>CONFIRMED FACTS</span><small>Record observed output, not assumptions.</small></div>${renderFormGrid(pick(['cli_findings']),values)}</section>
            <section class="diagnostic-card next-test"><div class="diagnostic-card-head"><span>MISSING EVIDENCE / NEXT TEST</span><small>State what still needs to be proved.</small></div>${renderFormGrid(pick(['missing_evidence']),values)}</section>
            <section class="diagnostic-card current-decision"><div class="diagnostic-card-head"><span>CURRENT DECISION</span><small>Explain the next action and why.</small></div>${renderFormGrid(pick(['resolution_or_next_step']),values)}</section>
          </div>
          ${renderEvidenceReadiness(values)}
          <div class="evidence-mini-checks"><label><input type="checkbox"> Scope confirmed</label><label><input type="checkbox"> IP / MAC / VLAN captured</label><label><input type="checkbox"> Timestamp recorded</label><label><input type="checkbox"> Logs or CLI recorded</label><label><input type="checkbox"> Owner and next action clear</label></div>
          <div class="stage-next"><button class="btn secondary" type="button" data-open-case-phase="troubleshoot">← Troubleshoot</button><button class="btn" type="button" data-open-case-phase="output">Continue to Output →</button></div>
        </section>
        <section class="case-stage-panel stage-output ${phase==='output'?'active':''}" data-case-panel="output">
          <div class="stage-heading"><div><span class="eyebrow">STAGE 4</span><h3>Create the case outcome</h3><p>Generate a Salesforce note, send the case to a customer template, or prepare an escalation.</p></div>${iconSvg('template')}</div>
          ${renderFormGrid(output,values)}
          <div class="btnrow generate-row"><button class="btn generate-main" type="button" data-generate-slot>Generate Runbook Output</button></div>
          <div class="send-template-row"><select class="search" data-send-target>${getSendTargetOptions()}</select><button class="btn" type="button" data-send-slot>Send to selected template</button></div>
          <div class="muted output-label">Generated output</div>${outputColumnsHTML(outputs)}
          <div class="output-packet-actions"><button class="btn secondary" type="button" data-copy-salesforce-packet>Copy Salesforce packet</button><button class="btn secondary gemini-packet-btn" type="button" data-copy-gemini-packet>Copy redacted Gemini packet</button></div>
          <div class="case-completion-actions"><a class="btn secondary" href="#email-resolved">Resolved email</a><a class="btn secondary escalation-action" href="#template-tier2">Tier 2 escalation</a><button class="btn archive-btn" type="button" data-archive-clear-slot>Move to Knowledgebase</button></div>
          <div class="stage-next"><button class="btn secondary" type="button" data-open-case-phase="evidence">← Evidence</button><button class="btn secondary danger-clear" type="button" data-clear-slot>Clear case</button></div>
        </section>
        <div class="statusline case-save-status" data-slot-status>Saved locally.</div>
      </div>
    </section>`;
  }

  function bindModernCaseDesk(){
    const root=contentEl.querySelector('[data-modern-case-desk]');if(!root)return;
    const form=root.querySelector('[data-slot-form]');
    const activate=phase=>{root.querySelectorAll('[data-case-phase]').forEach(b=>b.classList.toggle('active',b.dataset.casePhase===phase));root.querySelectorAll('[data-case-panel]').forEach(p=>p.classList.toggle('active',p.dataset.casePanel===phase));saveText(sKey('case-working-template','workspace-phase'),phase);root.scrollIntoView({block:'start',behavior:'smooth'});};
    root.querySelectorAll('[data-case-phase]').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.casePhase)));
    root.querySelectorAll('[data-open-case-phase]').forEach(btn=>btn.addEventListener('click',()=>activate(btn.dataset.openCasePhase)));
    const issue=form?.querySelector('[data-field="issue_type"]');
    const updateGuidance=()=>{const host=root.querySelector('[data-case-guidance-host]');if(host)host.innerHTML=renderIssueGuidancePanel(issue?.value||'Other');};
    issue?.addEventListener('change',updateGuidance);
    const status=form?.querySelector('[data-field="workflow_status"]');
    const updateStatusPill=()=>{const pill=root.querySelector('[data-desk-status-pill]');if(pill){pill.textContent=status?.value||'Investigating';pill.className='status-pill '+statusClass(status?.value);}};
    status?.addEventListener('change',updateStatusPill);
    const readCurrentValues=()=>{const current={};form?.querySelectorAll('[data-field]').forEach(el=>current[el.dataset.field]=el.value);return withAliases(current);};
    const updateEvidenceReadiness=()=>{const oldBox=root.querySelector('[data-evidence-readiness]');if(oldBox)oldBox.outerHTML=renderEvidenceReadiness(readCurrentValues());};
    root.querySelector('[data-copy-salesforce-packet]')?.addEventListener('click',async e=>{await copyPlainText(buildCasePacket(readCurrentValues(),false),{disableHtmlBold:true});const b=e.currentTarget;const old=b.textContent;b.textContent='✓ Salesforce packet copied';setTimeout(()=>b.textContent=old,1400);});
    root.querySelector('[data-copy-gemini-packet]')?.addEventListener('click',async e=>{await copyPlainText(buildGeminiPacket(readCurrentValues()),{disableHtmlBold:true});const b=e.currentTarget;const old=b.textContent;b.textContent='✓ Redacted packet copied';setTimeout(()=>b.textContent=old,1400);});
    updateGuidance();
    updateStatusPill();
    updateEvidenceReadiness();
    let caseBarRefreshTimer=0;
    const scheduleCaseBarRefresh=()=>{clearTimeout(caseBarRefreshTimer);caseBarRefreshTimer=setTimeout(()=>{const oldBar=contentEl.querySelector('.active-case-bar');if(oldBar){oldBar.outerHTML=renderActiveCaseBar();bindActiveCaseBar();}},560);};
    form?.addEventListener('input',()=>{scheduleCaseBarRefresh();updateEvidenceReadiness();});
    form?.addEventListener('change',()=>{scheduleCaseBarRefresh();updateEvidenceReadiness();});
  }


  function renderSingleOutput(label, text, options={}){
    const cleanText = cleanup(text || '');
    const noAutoBoldAttr = options.noAutoBold ? ' data-no-auto-bold="true"' : '';
    return `<div class="output-card"><div class="output-head"><span>${esc(label)}</span><button class="btn secondary small-copy" type="button" data-copy-output="single">Copy</button></div><div class="output-area" data-output-area="single" data-raw-output="${esc(cleanText)}"${noAutoBoldAttr}>${formatOutputHTML(cleanText, { noAutoBold: !!options.noAutoBold })}</div></div>`;
  }

  function renderGeneratorForm(pageId, block){
    const values = withAliases(loadJson(sKey(pageId, block.formKey, 'state'), {}));
    const output = removeCustomerSignature(loadText(sKey(pageId, block.formKey, 'output'), ''));
    return `<div class="step">
      <div class="step-title">${esc(block.title || 'Generator')}</div>
      <div class="form" data-generator-form="${esc(block.formKey)}" data-page-id="${esc(pageId)}" data-template-type="${esc(block.templateType || '')}" data-slot-count="${esc(block.slotCount || 10)}">
        ${block.noteImport ? `<label>${block.templateType === 'tier2' ? 'Paste Salesforce / working-case / escalation details to auto-populate this Tier 2 template' : 'Paste call note / working note / Salesforce case text (optional)'}</label><textarea class="no-autoexpand import-box" data-note-import placeholder="Paste the details here, then click Import."></textarea><div class="btnrow"><button class="btn" type="button" data-note-import-btn>Import note into this form</button><button class="btn secondary danger-clear" type="button" data-clear-form>CLEAR CASE</button></div>` : `<div class="btnrow"><button class="btn secondary danger-clear" type="button" data-clear-form>CLEAR CASE</button></div>`}
        ${renderFormGrid(block.fields || [], values)}
        <div class="btnrow generate-row">
          <button class="btn generate-main" type="button" data-generate-form>GENERATE</button>
        </div>
        <div class="btnrow">
          <select class="search" data-send-target>${getSendTargetOptions()}</select>
          <button class="btn" type="button" data-send-form>Send to selected template</button>
          ${block.templateType === 'tier2' ? '<button class="btn secondary" type="button" data-add-tier2-tracking>Add / Update Tier 2 Tracking Case</button>' : ''}
        </div>
        <div class="statusline" data-form-status>Saved locally.</div>
        <div class="muted" style="margin-top:14px;font-weight:700;">Generated output</div>
        ${renderSingleOutput(block.title || 'Output', output)}
        <div class="btnrow bottom-case-actions"><button class="btn secondary danger-clear" type="button" data-clear-form>CLEAR CASE</button></div>
      </div>
    </div>`;
  }

  function renderEmailTemplateForm(pageId, block){
    const values = withAliases(loadJson(sKey(pageId, block.formKey, 'state'), {}));
    const output = loadText(sKey(pageId, block.formKey, 'output'), '');
    const body = removeTicketSentenceFromProactiveTemplate(
      block.formKey,
      normalizeCustomerTemplateTicketSentence(loadText(sKey(pageId, block.formKey, 'templateBody'), block.templateBody || ''))
    );
    return `<div class="step">
      <div class="step-title">${esc(block.title || 'Email Template')}</div>
      <div class="form" data-email-form="${esc(block.formKey)}" data-page-id="${esc(pageId)}" data-template-type="email" data-template-subject="${esc(block.subject || '')}" data-template-body-default="${esc(removeTicketSentenceFromProactiveTemplate(block.formKey, normalizeCustomerTemplateTicketSentence(block.templateBody || '')))}">
        <div class="btnrow"><button class="btn secondary danger-clear" type="button" data-clear-form>CLEAR CASE</button><button class="btn" type="button" data-reset-email-template>Reset template body</button></div>
        ${renderFormGrid(block.fields || [], values)}
        <label class="full">Editable email template body</label>
        <textarea class="full" data-email-template-body>${esc(body)}</textarea>
        <div class="btnrow generate-row">
          <button class="btn generate-main" type="button" data-generate-email>GENERATE</button>
        </div>
        <div class="statusline" data-form-status>Saved locally.</div>
        <div class="muted" style="margin-top:14px;font-weight:700;">Generated output</div>
        ${renderSingleOutput(block.title || 'Email', output, { noAutoBold: true })}
        <div class="btnrow bottom-case-actions"><button class="btn secondary danger-clear" type="button" data-clear-form>CLEAR CASE</button></div>
      </div>
    </div>`;
  }

  function renderCommandSearch(pageId, block){
    return `<div class="step"><div class="step-title">${esc(block.title || 'Command Search')}</div><input class="search" data-command-search placeholder="${esc(block.placeholder || 'Search commands...')}" /><div data-command-results class="search-results"></div></div>`;
  }

  function renderCliCleanup(pageId, block){
    const inputKey = sKey(pageId, 'cliCleanup', 'input');
    const outputKey = sKey(pageId, 'cliCleanup', 'output');
    return `<div class="step"><div class="step-title">${esc(block.title || 'CLI Cleanup Helper')}</div>
      <div class="muted" style="margin-bottom:10px;">Paste CLI notes here. This helper only changes CLI prompt # characters to → so Salesforce notes do not break. Ticket references like #00812345 are preserved.</div>
      <div class="form">
        <label>Paste CLI notes</label>
        <textarea class="no-autoexpand cli-input-box" data-cli-clean-input placeholder="Paste CLI output here. This box will not auto-expand.">${esc(loadText(inputKey, ''))}</textarea>
        <div class="btnrow"><button class="btn" type="button" data-cli-clean-btn>Clean CLI for Salesforce</button><button class="btn" type="button" data-cli-clear-btn>Clear CLI section</button></div>
        <label>Cleaned result</label>
        <textarea data-cli-clean-output placeholder="Cleaned CLI output will appear here.">${esc(loadText(outputKey, ''))}</textarea>
        <div class="btnrow"><button class="btn" type="button" data-cli-copy-btn>Copy cleaned CLI</button></div>
        <div class="statusline" data-cli-clean-status>Ready.</div>
      </div>
    </div>`;
  }

  function renderEditableLinks(block){
    return `<div class="step"><div class="step-title">${esc(block.title || 'Links')}</div><div class="links-wrap">${(block.links||[]).map(link => `<div class="link-card"><div><strong>${esc(link.title || '')}</strong></div><div class="muted">${esc(link.text || '')}</div><div style="margin-top:8px"><a href="${esc(link.url || '#')}" target="_blank" rel="noopener noreferrer">${esc(link.url || '')}</a></div></div>`).join('')}</div></div>`;
  }

  function renderEditableNotes(pageId, block){
    return `<div class="step"><div class="step-title">${esc(block.title || 'Notes')}</div>${(block.notes||[]).map((n, idx) => `<div class="note-item"><label>${esc(n.label || 'Note')}</label><textarea data-note-key="${esc(sKey(pageId,'note',idx))}">${esc(loadText(sKey(pageId,'note',idx), n.value || ''))}</textarea><div class="btnrow"><button class="btn secondary" type="button" data-copy-note="${esc(sKey(pageId,'note',idx))}">Copy</button><button class="btn secondary" type="button" data-clear-note="${esc(sKey(pageId,'note',idx))}">Clear</button></div></div>`).join('')}</div>`;
  }


  function normaliseLocalRows(rows, fallback){
    if (!Array.isArray(rows) || !rows.length) return fallback.map(x => Object.assign({}, x));
    return rows.map(r => ({
      title: r.title || r.company || '',
      details: r.details || ''
    }));
  }

  function renderEditableRows(container, rows, prefix){
    container.innerHTML = rows.map((row, i) => `
      <div class="editor-panel local-info-row" data-row-index="${i}">
        <label>Title</label>
        <input data-${prefix}-title="${i}" value="${esc(row.title || '')}" placeholder="Title" />
        <label>Details</label>
        <textarea data-${prefix}-details="${i}" placeholder="Details...">${esc(row.details || '')}</textarea>
        <div class="btnrow">
          <button class="smallbtn" type="button" data-${prefix}-remove="${i}">Remove</button>
        </div>
      </div>
    `).join('');
  }


  const DEFAULT_QUICK_LINKS = [{"title": "How to locate your IP address", "url": "https://www.tp-link.com/us/support/faq/838/", "notes": "Useful link for users who need help finding their local IP address."}];

  function normaliseQuickLinks(rows){
    if (!Array.isArray(rows) || !rows.length) {
      return DEFAULT_QUICK_LINKS.map(x => Object.assign({}, x));
    }
    return rows.map(r => ({
      title: r.title || '',
      url: r.url || r.value || '',
      notes: r.notes || r.details || ''
    }));
  }

  function renderQuickLinksTool(pageId){
    return `
      <div class="step">
        <div class="step-title">Quick Links</div>
        <div class="muted">Expandable quick links. You can copy each link/field and add more entries. Saved locally in this browser.</div>
        <div data-quick-links-list></div>
        <div class="btnrow">
          <button class="btn" type="button" data-add-quick-link>Add Link / Field</button>
          <button class="btn secondary" type="button" data-reset-quick-links>Save / Update</button>
        </div>
        <div class="tool-status" data-quick-links-status>Saved locally.</div>
      </div>`;
  }

  function renderQuickLinksRows(container, rows){
    container.innerHTML = rows.map((row, i) => `
      <details class="local-compact-row">
        <summary>
          <span>${esc(row.title || 'Quick Link')}</span>
          <span class="muted">Click to expand</span>
        </summary>
        <div class="compact-grid">
          <div class="compact-field full">
            <label>Title</label>
            <div class="copy-field-row">
              <input data-quick-title="${i}" value="${esc(row.title || '')}" placeholder="Title" />
              <button class="smallbtn" type="button" data-copy-quick-field="title-${i}">Copy</button>
            </div>
          </div>
          <div class="compact-field full">
            <label>Link / Value</label>
            <div class="copy-field-row">
              <input data-quick-url="${i}" value="${esc(row.url || '')}" placeholder="https://..." />
              <button class="smallbtn" type="button" data-copy-quick-field="url-${i}">Copy</button>
            </div>
          </div>
          <div class="compact-field full">
            <label>Notes</label>
            <div class="copy-field-row">
              <textarea data-quick-notes="${i}" placeholder="Notes...">${esc(row.notes || '')}</textarea>
              <button class="smallbtn" type="button" data-copy-quick-field="notes-${i}">Copy</button>
            </div>
          </div>
        </div>
        <div class="btnrow">
          <button class="smallbtn" type="button" data-copy-quick-entry="${i}">Copy Entry</button>
          <button class="smallbtn" type="button" data-remove-quick-link="${i}">Remove Entry</button>
        </div>
      </details>
    `).join('');
  }

  function bindQuickLinksTool(){
    const list = contentEl.querySelector('[data-quick-links-list]');
    if (!list) return;

    const key = sKey('quickLinksV3', 'rows');
    const status = contentEl.querySelector('[data-quick-links-status]');
    let rows = normaliseQuickLinks(loadJson(key, DEFAULT_QUICK_LINKS));

    const save = () => {
      rows = Array.from(list.querySelectorAll('.local-compact-row')).map((row, i) => ({
        title: row.querySelector(`[data-quick-title="${i}"]`)?.value || '',
        url: row.querySelector(`[data-quick-url="${i}"]`)?.value || '',
        notes: row.querySelector(`[data-quick-notes="${i}"]`)?.value || ''
      }));
      saveJson(key, rows);
      if (status) status.textContent = 'Saved locally.';
    };

    const render = () => {
      renderQuickLinksRows(list, rows);
      list.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', save));

      list.querySelectorAll('[data-copy-quick-field]').forEach(btn => btn.addEventListener('click', async () => {
        const [field, idx] = (btn.dataset.copyQuickField || '').split('-');
        const selector = `[data-quick-${field}="${idx}"]`;
        const el = list.querySelector(selector);
        await copyPlainText(el ? el.value || '' : '');
        const old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = old, 900);
      }));

      list.querySelectorAll('[data-copy-quick-entry]').forEach(btn => btn.addEventListener('click', async () => {
        const idx = btn.dataset.copyQuickEntry;
        const title = list.querySelector(`[data-quick-title="${idx}"]`)?.value || '';
        const url = list.querySelector(`[data-quick-url="${idx}"]`)?.value || '';
        const notes = list.querySelector(`[data-quick-notes="${idx}"]`)?.value || '';
        await copyPlainText([title, url, notes].filter(Boolean).join('\n'));
        const old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = old, 900);
      }));

      list.querySelectorAll('[data-remove-quick-link]').forEach(btn => btn.addEventListener('click', () => {
        rows.splice(Number(btn.dataset.removeQuickLink), 1);
        if (!rows.length) rows = [{ title: '', url: '', notes: '' }];
        saveJson(key, rows);
        render();
      }));

      autoResizeTextareas(list);
    };

    render();

    contentEl.querySelector('[data-add-quick-link]')?.addEventListener('click', () => {
      rows.push({ title: '', url: '', notes: '' });
      saveJson(key, rows);
      render();
    });

    contentEl.querySelector('[data-reset-quick-links]')?.addEventListener('click', () => {
      rows = DEFAULT_QUICK_LINKS.map(x => Object.assign({}, x));
      saveJson(key, rows);
      render();
      if (status) status.textContent = 'Save / Update.';
    });
  }



  const DEFAULT_URL_POLICY_ROWS = [
    { url: '*.minecrafteduservices.com', category: 'Computer-and-Internet-Info' },
    { url: 'login.microsoftonline.com', category: 'Computer-and-Internet-Info' },
    { url: 'aadcdn.msauth.net', category: 'Computer-and-Internet-Info' },
    { url: 'graph.microsoft.com', category: 'Computer-and-Internet-Info' },
    { url: '*.sharepoint.com', category: 'Computer-and-Internet-Info' },
    { url: '*.minecraft-services.net', category: 'Games' },
    { url: '*.xboxlive.com', category: 'Games' },
    { url: '*.playfabapi.com', category: 'Games' },
    { url: '*.tynker.com', category: 'Training-and-Tools' }
  ];

  function normaliseUrlPolicyRows(rows){
    const source = Array.isArray(rows) && rows.length ? rows : DEFAULT_URL_POLICY_ROWS;
    return source.map(row => ({
      url: row.url || '',
      category: row.category || ''
    }));
  }

  function getUrlPolicyRowsFromDom(){
    return Array.from(contentEl.querySelectorAll('[data-url-policy-row]')).map((row, i) => ({
      url: row.querySelector(`[data-url-policy-url="${i}"]`)?.value.trim() || '',
      category: row.querySelector(`[data-url-policy-category="${i}"]`)?.value.trim() || ''
    })).filter(row => row.url || row.category);
  }

  function urlPolicyPlainUrls(rows){
    return rows.map(r => r.url.trim()).filter(Boolean).join('\n');
  }

  function urlPolicyCsv(rows){
    const headers = ['URL','Category'];
    const csvEscape = value => '"' + String(value || '').replace(/"/g, '""') + '"';
    return [headers.join(',')].concat(rows.map(r => [r.url, r.category].map(csvEscape).join(','))).join('\n');
  }

  function urlPolicyNotes(rows){
    const groups = new Map();
    rows.forEach(row => {
      const url = (row.url || '').trim();
      if (!url) return;
      const category = (row.category || 'Uncategorised').trim();
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push(url);
    });
    const sections = Array.from(groups.entries()).map(([category, urls]) => `${category}\n${Array.from(new Set(urls)).map(url => `- ${url}`).join('\n')}`);
    return cleanup(['**URLs Requested**', '', sections.join('\n\n')].join('\n'));
  }

  function downloadTextFile(filename, text, mime='text/plain'){
    const blob = new Blob([text || ''], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function renderUrlPolicyRows(rows){
    return rows.map((row, i) => `
      <tr data-url-policy-row="${i}">
        <td><input class="url-policy-input url-policy-url" data-url-policy-url="${i}" value="${esc(row.url || '')}" placeholder="example.com or *.example.com" /></td>
        <td><input class="url-policy-input" data-url-policy-category="${i}" value="${esc(row.category || '')}" placeholder="Category" /></td>
        <td><button class="smallbtn" type="button" data-url-policy-remove="${i}">Remove</button></td>
      </tr>`).join('');
  }


  function renderUrlPolicyTool(pageId){
    const key = sKey(pageId, 'urlPolicyRows');
    const rows = normaliseUrlPolicyRows(loadJson(key, DEFAULT_URL_POLICY_ROWS));
    const plainUrls = urlPolicyPlainUrls(rows);
    const notes = urlPolicyNotes(rows);
    return `
      <div class="step url-policy-tool">
        <div class="step-title">Firewall URL Policy Helper</div>
        <div class="muted">Three modes: firewall copy, documentation table, and Salesforce notes. Saved locally in this browser.</div>

        <div class="url-policy-controls">
          <input class="search" data-url-policy-search placeholder="Search URLs or categories..." />
          <button class="btn" type="button" data-url-policy-add>Add URL</button>
          <button class="btn secondary" type="button" data-url-policy-reset>Reset Example</button>
        </div>

        <div class="section-title">1. Firewall Copy Mode</div>
        <div class="muted">Plain text only. One URL per line. Use this for Palo Alto Custom URL Category, URL Access Management Profile, FortiGate/Web filtering, and policy exceptions.</div>
        <div class="outputwrap">
          <button class="copy-corner" type="button" data-copy-url-policy="urls">Copy All URLs</button>
          <pre class="url-policy-copy-block"><code data-url-policy-plain>${esc(plainUrls)}</code></pre>
        </div>
        <div class="btnrow">
          <button class="btn" type="button" data-export-url-policy-txt>Export TXT</button>
        </div>

        <div class="section-title">2. Documentation Mode</div>
        <div class="muted">Use this table for evidence, screenshots, peer review, and future troubleshooting.</div>
        <div class="url-policy-table-wrap">
          <table class="url-policy-table">
            <thead><tr><th>URL</th><th>Category</th><th></th></tr></thead>
            <tbody data-url-policy-list>${renderUrlPolicyRows(rows)}</tbody>
          </table>
        </div>
        <div class="btnrow">
          <button class="btn" type="button" data-copy-url-policy="table">Copy Documentation Table</button>
          <button class="btn" type="button" data-export-url-policy-csv>Export CSV</button>
        </div>

        <div class="section-title">3. Salesforce Notes Mode</div>
        <div class="muted">Salesforce-friendly grouped bullet list. No table or HTML styling.</div>
        <div class="btnrow"><button class="btn" type="button" data-generate-url-policy-notes>Generate Case Notes</button><button class="btn" type="button" data-copy-url-policy="notes">Copy Notes for Salesforce</button></div>
        <div class="outputwrap">
          <div class="output-area url-policy-notes-output" data-url-policy-notes>${esc(notes)}</div>
        </div>
        <div class="tool-status" data-url-policy-status>Saved locally.</div>
      </div>`;
  }

  function bindUrlPolicyTool(pageId){
    const list = contentEl.querySelector('[data-url-policy-list]');
    if (!list) return;
    const key = sKey(pageId, 'urlPolicyRows');
    const status = contentEl.querySelector('[data-url-policy-status]');
    const plainEl = contentEl.querySelector('[data-url-policy-plain]');
    const notesEl = contentEl.querySelector('[data-url-policy-notes]');
    const searchEl = contentEl.querySelector('[data-url-policy-search]');
    let rows = normaliseUrlPolicyRows(loadJson(key, DEFAULT_URL_POLICY_ROWS));

    const duplicateUrls = () => {
      const counts = new Map();
      rows.forEach(r => {
        const u = (r.url || '').trim().toLowerCase();
        if (u) counts.set(u, (counts.get(u) || 0) + 1);
      });
      return counts;
    };

    const updateOutputs = () => {
      rows = getUrlPolicyRowsFromDom();
      saveJson(key, rows);
      const plain = urlPolicyPlainUrls(rows);
      const notes = urlPolicyNotes(rows);
      if (plainEl) plainEl.textContent = plain;
      if (notesEl) notesEl.textContent = notes;
      const counts = duplicateUrls();
      contentEl.querySelectorAll('[data-url-policy-row]').forEach(row => {
        const idx = row.dataset.urlPolicyRow;
        const url = row.querySelector(`[data-url-policy-url="${idx}"]`)?.value.trim().toLowerCase() || '';
        row.classList.toggle('duplicate-url', !!url && counts.get(url) > 1);
      });
      if (status) status.textContent = 'Saved locally.';
    };

    const applyFilters = () => {
      const q = (searchEl?.value || '').trim().toLowerCase();
      contentEl.querySelectorAll('[data-url-policy-row]').forEach(row => {
        const idx = row.dataset.urlPolicyRow;
        const item = {
          url: row.querySelector(`[data-url-policy-url="${idx}"]`)?.value || '',
          category: row.querySelector(`[data-url-policy-category="${idx}"]`)?.value || ''
        };
        const text = Object.values(item).join(' ').toLowerCase();
        const show = !q || text.includes(q);
        row.style.display = show ? '' : 'none';
      });
    };

    const renderRows = () => {
      list.innerHTML = renderUrlPolicyRows(rows);
      list.querySelectorAll('input, select').forEach(el => el.addEventListener('input', () => { updateOutputs(); applyFilters(); }));
      list.querySelectorAll('[data-url-policy-remove]').forEach(btn => btn.addEventListener('click', () => {
        rows.splice(Number(btn.dataset.urlPolicyRemove), 1);
        if (!rows.length) rows = [{ url: '', category: '' }];
        saveJson(key, rows);
        renderRows(); updateOutputs(); applyFilters();
      }));
      updateOutputs(); applyFilters();
    };

    searchEl?.addEventListener('input', applyFilters);
    contentEl.querySelector('[data-url-policy-add]')?.addEventListener('click', () => {
      rows = getUrlPolicyRowsFromDom();
      rows.push({ url: '', category: '' });
      saveJson(key, rows);
      renderRows();
    });
    contentEl.querySelector('[data-url-policy-reset]')?.addEventListener('click', () => {
      rows = DEFAULT_URL_POLICY_ROWS.map(x => Object.assign({}, x));
      saveJson(key, rows);
      renderRows();
    });
    contentEl.querySelectorAll('[data-copy-url-policy]').forEach(btn => btn.addEventListener('click', async () => {
      updateOutputs();
      const mode = btn.dataset.copyUrlPolicy;
      let text = '';
      if (mode === 'urls') text = urlPolicyPlainUrls(rows);
      if (mode === 'notes') text = urlPolicyNotes(rows);
      if (mode === 'table') text = ['URL\tCategory'].concat(rows.map(r => [r.url, r.category].join('\t'))).join('\n');
      await copyPlainText(text);
      const old = btn.textContent;
      btn.textContent = 'Copied';
      setTimeout(() => btn.textContent = old, 900);
    }));
    contentEl.querySelector('[data-generate-url-policy-notes]')?.addEventListener('click', () => {
      updateOutputs();
      if (status) status.textContent = 'Generated Salesforce notes.';
    });
    contentEl.querySelector('[data-export-url-policy-txt]')?.addEventListener('click', () => { updateOutputs(); downloadTextFile('firewall-url-list.txt', urlPolicyPlainUrls(rows)); });
    contentEl.querySelector('[data-export-url-policy-csv]')?.addEventListener('click', () => { updateOutputs(); downloadTextFile('firewall-url-documentation.csv', urlPolicyCsv(rows), 'text/csv'); });

    renderRows();
  }

  function renderPaCliHelper(pageId, block){
    const id = 'pa-helper-' + stableHash((block.helper || '') + '|' + (block.title || ''));
    const helper = String(block.helper || 'generic');
    const title = block.title || 'Palo Alto command fields';
    const fieldSets = {
      traffic: [['clientIp','Client IP'],['serverIp','Server / Destination IP'],['port','Destination Port'],['app','Application'],['rule','Rule Name'],['action','Action']],
      session: [['srcIp','Source IP'],['dstIp','Destination IP'],['app','Application'],['sessionId','Session ID']],
      connectivity: [['sourceIp','Source IP'],['destIp','Destination IP / FQDN'],['interfaceName','Interface'],['dnsServer','DNS Server'],['hostname','Hostname']],
      health: [['jobId','Job ID'],['process','Process name']],
      interface: [['interfaceName','Interface, e.g. ethernet1/1'],['ipAddress','IP address'],['zone','Zone']],
      routing: [['vrName','Virtual Router'],['dstIp','Destination IP'],['prefix','Prefix, e.g. 10.10.10.0/24']],
      nat: [['srcIp','Source IP'],['dstIp','Destination IP'],['dstPort','Destination Port'],['protocol','Protocol']],
      userid: [['ipAddress','IP address'],['domain','Domain'],['username','Username'],['group','Group Name'],['agent','User-ID Agent']],
      url: [['clientIp','Client IP'],['url','URL / Domain'],['action','Action'],['severity','Threat Severity']],
      pcap: [['srcIp','Source IP'],['dstIp','Destination IP'],['srcPort','Source Port'],['dstPort','Destination Port']],
      vpn: [['gateway','Gateway Name'],['tunnel','Tunnel Name']],
      commit: [['jobId','Job ID']],
      evidence: [['tftpHost','TFTP Host'],['scpTarget','SCP target username@host:path']],
      management: [['ipAddress','Management IP'],['gateway','Gateway'],['dnsServer','DNS Server']],
      panorama: [['serial','Serial Number'],['deviceGroup','Device Group'],['template','Template']],
      generic: [['value','Value']]
    };
    const fields = fieldSets[helper] || fieldSets.generic;
    return `<details class="pa-cli-helper" data-pa-cli-helper="${esc(helper)}" id="${esc(id)}">
      <summary><span>${esc(title)}</span><span class="muted">Click to enter values and build commands</span></summary>
      <div class="pa-cli-helper-body">
        <div class="form-grid">${fields.map(([name,label]) => `<div><label>${esc(label)}</label><input type="text" data-pa-field="${esc(name)}" placeholder="${esc(label)}"></div>`).join('')}</div>
        <div class="btnrow"><button class="btn secondary" type="button" data-pa-build-cli>Build Commands</button><button class="btn secondary" type="button" data-pa-copy-cli>Copy</button><button class="btn secondary" type="button" data-pa-pin-cli>Pin to Workspace</button><button class="btn secondary" type="button" data-pa-clear-cli>Clear</button></div>
        <textarea class="cli-input-box" data-pa-cli-output placeholder="Generated commands will show here."></textarea>
      </div>
    </details>`;
  }

  function buildPaCommands(helper, v){
    const has = x => String(x || '').trim();
    const lines = [];
    if (helper === 'traffic') {
      if (has(v.clientIp)) lines.push(`show log traffic query '( addr.src in ${v.clientIp} )'`);
      if (has(v.serverIp)) lines.push(`show log traffic query '( addr.dst in ${v.serverIp} )'`);
      if (has(v.port)) lines.push(`show log traffic query '( port.dst eq ${v.port} )'`);
      if (has(v.app)) lines.push(`show log traffic query '( app eq ${v.app} )'`);
      if (has(v.rule)) lines.push(`show log traffic query '( rule eq "${v.rule}" )'`);
      if (has(v.action)) lines.push(`show log traffic query '( action eq ${v.action} )'`);
      if (has(v.clientIp) && has(v.action)) lines.push(`show log traffic query '( addr.src in ${v.clientIp} ) and ( action eq ${v.action} )'`);
      if (!lines.length) lines.push('show log traffic last 50');
    } else if (helper === 'session') {
      lines.push('show session info');
      if (has(v.srcIp)) lines.push(`show session all filter source ${v.srcIp}`);
      if (has(v.dstIp)) lines.push(`show session all filter destination ${v.dstIp}`);
      if (has(v.app)) lines.push(`show session all filter application ${v.app}`);
      if (has(v.sessionId)) lines.push(`show session id ${v.sessionId}`, `clear session id ${v.sessionId}`);
      if (has(v.srcIp)) lines.push(`clear session all filter source ${v.srcIp}`);
    } else if (helper === 'connectivity') {
      if (has(v.destIp)) lines.push(`ping host ${v.destIp}`, `traceroute host ${v.destIp}`);
      if (has(v.sourceIp) && has(v.destIp)) lines.push(`ping source ${v.sourceIp} host ${v.destIp}`, `traceroute source ${v.sourceIp} host ${v.destIp}`);
      if (has(v.interfaceName) && has(v.destIp)) lines.push(`traceroute ${v.interfaceName} ${v.destIp}`);
      if (has(v.interfaceName) && has(v.dnsServer) && has(v.hostname)) lines.push(`dig ${v.interfaceName} ${v.dnsServer} ${v.hostname}`);
      if (!lines.length) lines.push('show netstat statistics yes');
    } else if (helper === 'interface') {
      lines.push('show interface all', 'show zone', 'show arp all');
      if (has(v.interfaceName)) lines.push(`show interface ${v.interfaceName}`, `show counter interface ${v.interfaceName}`, `show arp interface ${v.interfaceName}`);
      if (has(v.ipAddress)) lines.push(`show arp all | match ${v.ipAddress}`);
      lines.push('show mac all');
    } else if (helper === 'routing') {
      lines.push('show routing route', 'show routing protocol');
      if (has(v.dstIp)) lines.push(`show routing route destination ${v.dstIp}`);
      if (has(v.vrName) && has(v.dstIp)) lines.push(`test routing fib-lookup virtual-router ${v.vrName} ip ${v.dstIp}`);
      if (has(v.vrName) && has(v.prefix)) lines.push(`show routing fib virtual-router ${v.vrName} | match ${v.prefix}`);
    } else if (helper === 'nat') {
      lines.push('show running nat-policy', 'test nat-policy-match', 'show running ippool', 'show running global-ippool');
    } else if (helper === 'userid') {
      lines.push('show user user-id-agent state all', 'show user group-mapping state all');
      if (has(v.ipAddress)) lines.push(`show user ip-user-mapping ip ${v.ipAddress}`, `clear user-cache ip ${v.ipAddress}`);
      if (has(v.domain) && has(v.username)) lines.push(`show user ip-user-mapping all | match ${v.domain}\\${v.username}`);
      if (has(v.group)) lines.push(`show user group name ${v.group}`);
      if (has(v.agent)) lines.push(`show user user-id-agent config name ${v.agent}`, `show log userid datasourcename equal ${v.agent} direction equal backward`);
    } else if (helper === 'url') {
      lines.push('show log system last 50', 'show log threat last 50', 'show log url');
      if (has(v.clientIp)) lines.push(`show log threat query '( addr.src in ${v.clientIp} )'`, `show log url query '( addr.src in ${v.clientIp} )'`);
      if (has(v.url)) lines.push(`show log url query '( url contains "${v.url}" )'`);
      if (has(v.action)) lines.push(`show log url query '( action eq ${v.action} )'`);
      if (has(v.severity)) lines.push(`show log threat query '( severity geq ${v.severity} )'`);
    } else if (helper === 'pcap') {
      lines.push('debug dataplane packet-diag show setting', 'debug dataplane packet-diag clear all', 'debug dataplane packet-diag clear log log');
      if (has(v.srcIp)) lines.push(`debug dataplane packet-diag set filter match source ${v.srcIp}`);
      if (has(v.dstIp)) lines.push(`debug dataplane packet-diag set filter match destination ${v.dstIp}`);
      lines.push('debug dataplane packet-diag set filter enable', 'debug dataplane packet-diag set capture on', 'show counter global filter delta yes packet-filter yes', 'debug dataplane packet-diag set capture off');
    } else if (helper === 'vpn') {
      lines.push('show vpn flow', 'show vpn gateway', 'show vpn ike-sa', 'show vpn ipsec-sa', 'show vpn tunnel');
      if (has(v.gateway)) lines.push(`test vpn ike-sa gateway ${v.gateway}`, `clear vpn ike-sa gateway ${v.gateway}`);
      if (has(v.tunnel)) lines.push(`test vpn ipsec-sa tunnel ${v.tunnel}`, `clear vpn ipsec-sa tunnel ${v.tunnel}`);
    } else if (helper === 'commit') {
      lines.push('check pending changes', 'show system last-commit-info', 'show jobs all');
      if (has(v.jobId)) lines.push(`show jobs id ${v.jobId}`);
    } else if (helper === 'evidence') {
      if (has(v.tftpHost)) lines.push(`tftp export tech-support to ${v.tftpHost}`);
      if (has(v.scpTarget)) lines.push(`scp export tech-support to ${v.scpTarget}`);
      if (!lines.length) lines.push('tftp export tech-support to <tftp-host>', 'scp export tech-support to <username@host:path>');
    } else if (helper === 'health') {
      lines.push('show system info', 'show system resources', 'show running resource-monitor', 'show system disk-space', 'show system software status', 'request license info', 'show admins all');
      if (has(v.jobId)) lines.push(`show jobs id ${v.jobId}`);
    } else {
      lines.push('show system info');
    }
    return Array.from(new Set(lines)).join('\n');
  }

  function bindPaCliHelpers(){
    contentEl.querySelectorAll('[data-pa-cli-helper]').forEach(root => {
      const helper = root.dataset.paCliHelper || 'generic';
      const out = root.querySelector('[data-pa-cli-output]');
      const values = () => {
        const v = {};
        root.querySelectorAll('[data-pa-field]').forEach(el => v[el.dataset.paField] = el.value.trim());
        return v;
      };
      const build = () => { if (out) out.value = buildPaCommands(helper, values()); autoResizeTextareas(root); };
      root.querySelector('[data-pa-build-cli]')?.addEventListener('click', build);
      root.querySelectorAll('[data-pa-field]').forEach(el => el.addEventListener('input', () => { if (out && out.value.trim()) build(); }));
      root.querySelector('[data-pa-copy-cli]')?.addEventListener('click', async () => { if (!out?.value.trim()) build(); await copyPlainText(out ? out.value : ''); });
      root.querySelector('[data-pa-pin-cli]')?.addEventListener('click', () => { if (!out?.value.trim()) build(); setLiveWorkspaceValue('selectedCommands', out ? out.value : '', 'append'); });
      root.querySelector('[data-pa-clear-cli]')?.addEventListener('click', () => { root.querySelectorAll('[data-pa-field]').forEach(el => el.value=''); if(out) out.value=''; autoResizeTextareas(root); });
    });
  }


function renderBlock(pageId, block){
    if (!block) return '';
    switch (block.type) {
      case 'notice': return `<div class="notice">${esc(block.text || '')}</div>`;
      case 'list': return renderList(block.items || []);
      case 'rowCards': return `<div class="row">${(block.cards||[]).map(card => `<a class="topic-card" href="${esc(card.href || '#')}" style="color:inherit;text-decoration:none;display:block;"><h3>${esc(card.title || '')}</h3><div class="muted">${esc(card.text || '')}</div></a>`).join('')}</div>`;
      case 'step': return `<div class="step"><div class="step-title">${esc(block.title || '')}</div>${block.content ? (block.content || []).map(b => renderBlock(pageId, b)).join('') : (block.code ? renderCode(pageId, block) : renderList(block.items || []))}</div>`;
      case 'code': return renderCode(pageId, block);
      case 'slotForm': return renderSlotForm(pageId, block);
      case 'generatorForm': return renderGeneratorForm(pageId, block);
      case 'emailTemplateForm': return renderEmailTemplateForm(pageId, block);
      case 'commandSearch': return renderCommandSearch(pageId, block);
      case 'cliCleanup': return renderCliCleanup(pageId, block);
      case 'paCliHelper': return renderPaCliHelper(pageId, block);
      case 'editableLinks': return renderEditableLinks(block);
      case 'editableNotes': return renderEditableNotes(pageId, block);
      case 'iframeEmbed': return `<div class="iframe-embed-wrap"><iframe class="iframe-embed" src="${esc(block.src || '')}" title="${esc(block.title || 'Embedded content')}" loading="lazy"></iframe></div>`;
      case 'html': return block.html || '';
      case 'customCaseKnowledgebase': return renderCaseKnowledgebaseTool(pageId);
      case 'customPersonalNotes': return '<div data-personal-notes-root></div>';
      case 'customRandomContactsInfo': return renderRandomContactsInfoTool(pageId);
      case 'customQuickLinksEditable': return renderQuickLinksEditableTool(pageId);
      case 'customSshLoginDetails': return renderSshLoginDetailsTool(pageId);
      case 'customTier2EscalationCases': return renderTier2EscalationCasesTool(pageId);
      case 'customArchivedWorkingCases': return renderArchivedWorkingCasesTool(pageId);
      case 'customCaseUpdateBuilder': return renderCaseUpdateBuilderTool(pageId);
      case 'customJustNotes': return renderJustNotesTool(pageId);
      case 'customUrlPolicyTool': return renderUrlPolicyTool(pageId);
      case 'html': return block.html || '';
      case 'customCaseKnowledgebase': return renderCaseKnowledgebaseTool(pageId);
      case 'customPersonalNotes': return '<div data-personal-notes-root></div>';
      case 'customRandomContactsInfo': return renderRandomContactsInfoTool(pageId);
      case 'customQuickLinks': return renderQuickLinksTool(pageId);
      default: return '';
    }
  }


  function flattenText(value){
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (Array.isArray(value)) return value.map(flattenText).join(' ');
    if (typeof value === 'object') return Object.values(value).map(flattenText).join(' ');
    return '';
  }

  function buildGlobalIndex(){
    const navTitles = {};
    const walkNav = (items, trail=[]) => (items || []).forEach(item => {
      if (item.id) navTitles[item.id] = trail.concat(item.title || item.id).join(' › ');
      if (item.items) walkNav(item.items, trail.concat(item.title || ''));
    });
    (runbook.groups || []).forEach(g => walkNav(g.items || [], [g.title || 'Runbook']));
    return Object.entries(runbook.pages || {}).map(([id, page]) => ({
      id,
      title: page.title || navTitles[id] || id,
      trail: navTitles[id] || 'Runbook',
      text: cleanup([page.title, (page.pills || []).join(' '), flattenText(page.body || [])].join(' '))
    }));
  }

  const globalIndex = buildGlobalIndex();

  function getRecentPages(){ return []; }
  function setRecentPage(pageId){ /* Recent pages disabled by request. Pinned pages remain available. */ }
  function getFavorites(){ return loadJson(sKey('meta','favorites'), []); }
  function saveFavorites(list){ saveJson(sKey('meta','favorites'), Array.from(new Set(list)).slice(0, 20)); }
  function isFavorite(pageId){ return getFavorites().includes(pageId); }
  function updateFavoriteButton(){
    if (!favoriteBtn) return;
    const id = currentPageId();
    favoriteBtn.textContent = isFavorite(id) ? '★ Pinned' : '☆ Pin';
    favoriteBtn.title = 'Pin or unpin this runbook page';
  }

  function escapeRegex(value){ return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function snippetFor(text, q){
    const clean = cleanup(text).replace(/\s+/g, ' ');
    if (!q) return clean.slice(0, 220);
    const idx = clean.toLowerCase().indexOf(q.toLowerCase());
    const start = Math.max(0, idx - 70);
    const snippet = clean.slice(start, start + 260);
    return idx >= 0 ? (start ? '…' : '') + snippet.replace(new RegExp(escapeRegex(q), 'ig'), m => `<mark>${esc(m)}</mark>`) + (start + 260 < clean.length ? '…' : '') : esc(clean.slice(0, 220));
  }

  function renderGlobalSearchResults(){
    if (!globalSearchResults || !globalSearchInput) return;
    const q = cleanup(globalSearchInput.value || '').toLowerCase();
    if (!q) { globalSearchResults.innerHTML = '<div class="muted">Start typing. Tip: search symptoms like RSSI, blocked, NAT, DNS, port, AP offline, policy, VLAN, P2, whitelist.</div>'; return; }
    const terms = q.split(/\s+/).filter(Boolean);
    const scored = globalIndex.map(item => {
      const hay = `${item.title} ${item.trail} ${item.text}`.toLowerCase();
      if (!terms.every(t => hay.includes(t))) return null;
      let score = 0;
      terms.forEach(t => {
        if ((item.title || '').toLowerCase().includes(t)) score += 20;
        if ((item.trail || '').toLowerCase().includes(t)) score += 8;
        if ((item.text || '').toLowerCase().includes(t)) score += 2;
      });
      return Object.assign({}, item, {score});
    }).filter(Boolean).sort((a,b) => b.score - a.score).slice(0, 30);
    globalSearchResults.innerHTML = scored.length ? `<div class="search-result-summary"><span>${scored.length} result${scored.length === 1 ? '' : 's'}</span><span class="status-badge searchable">Searchable</span></div>` + scored.map(item => `<a class="global-result" href="#${esc(item.id)}"><div class="global-result-title">${esc(item.title)}</div><div class="global-result-meta">${esc(item.trail)}</div><div>${snippetFor(item.text, q)}</div></a>`).join('') : '<div class="muted">No results found. Try a shorter keyword or vendor/tool name.</div>';
  }

  function openGlobalSearch(){
    if (!globalSearchOverlay) return;
    globalSearchOverlay.hidden = false;
    setTimeout(() => { globalSearchInput?.focus(); globalSearchInput?.select(); renderGlobalSearchResults(); }, 0);
  }
  function closeGlobalSearch(){ if (globalSearchOverlay) globalSearchOverlay.hidden = true; }

  function buildPageTools(pageId){
    const favs = getFavorites();
    const favHtml = favs.length ? favs.map(id => getPage(id) ? `<a class="pill" href="#${esc(id)}">★ ${esc(getPage(id).title || id)}</a>` : '').join('') : '<span class="muted">No pinned pages yet.</span>';
    return `
    <div class="quick-actions cleaner-toolbar">
      <div class="toolbar-row toolbar-title">
        <div class="toolbar-heading">Troubleshooting Runbook</div>
      </div>

      <div class="toolbar-row toolbar-actions">
        <button class="btn secondary" type="button" data-open-smart-search>Smart Search</button>
        <button class="btn secondary" type="button" data-copy-page-link>Copy Page Link</button>
        <button class="btn secondary" type="button" data-expand-all>Expand All</button>
        <button class="btn secondary" type="button" data-collapse-all>Collapse All</button>
      </div>

      <div class="toolbar-row toolbar-pinned">
        <span class="toolbar-label">Pinned:</span>
        <div class="toolbar-pills">${favHtml}</div>
      </div>

    </div>`;
  }



  function renderLiveTroubleshootingWorkspace(pageId){
    const defaults = {open:false, username:'', password:'', host:'', selectedCommands:'', workingNotes:'', findings:'', latestUpdate:'', pinnedSections:[]};
    const state = Object.assign({}, defaults, loadJson(sKey('liveWorkspace','state'), defaults));
    if (!Array.isArray(state.pinnedSections)) state.pinnedSections = [];
    const openAttr = ''; // Keep Live Troubleshooting Workspace collapsed when opening a case/page.
    const pinnedHtml = state.pinnedSections.length ? state.pinnedSections.map((pin, i) => `
          <details class="live-pinned-card live-collapsible-panel" data-live-pin-card="${i}"${pin.open ? ' open' : ''}>
            <summary class="live-pinned-head"><strong>${esc(pin.title || 'Pinned section')}</strong><button class="smallbtn" type="button" data-live-remove-pin="${i}">Remove</button></summary>
            <div class="live-pinned-grid live-panel-body">
              ${pin.username !== undefined ? `<div class="live-field"><label>Username</label><input data-live-pin-field="username" data-live-pin-index="${i}" value="${esc(pin.username||'')}"></div>` : ''}
              ${pin.password !== undefined ? `<div class="live-field"><label>Password</label><input type="password" data-live-pin-field="password" data-live-pin-index="${i}" value="${esc(pin.password||'')}"></div>` : ''}
              ${pin.host !== undefined ? `<div class="live-field"><label>Host / IP</label><input data-live-pin-field="host" data-live-pin-index="${i}" value="${esc(pin.host||'')}"></div>` : ''}
              ${pin.commands !== undefined ? `<div class="live-field full"><label>Commands / SSH command</label><textarea data-live-pin-field="commands" data-live-pin-index="${i}">${esc(pin.commands||'')}</textarea></div>` : ''}
              ${pin.notes !== undefined ? `<div class="live-field full"><label>Working notes</label><textarea data-live-pin-field="notes" data-live-pin-index="${i}">${esc(pin.notes||'')}</textarea></div>` : ''}
              ${pin.type === 'ssh' ? `<div class="btnrow full"><button class="smallbtn" type="button" data-live-update-ssh-pin="${i}">Update SSH command</button><button class="smallbtn" type="button" data-live-copy-pin-commands="${i}">Copy SSH command</button></div>` : ''}
            </div>
          </details>`).join('') : '';
    return `<details class="live-workspace" data-live-workspace${openAttr}>
      <summary><span>Live Troubleshooting Workspace</span><span class="muted">Pinned sections + working fields</span></summary>
      <div class="live-workspace-inner">
        ${pinnedHtml ? `<div class="live-pinned-section"><div class="live-pinned-title">Pinned sections</div>${pinnedHtml}</div>` : ''}
        <div class="live-stack">
          <details class="live-panel live-collapsible-panel"><summary>Working notes</summary><div class="live-panel-body"><textarea data-live-working-notes placeholder="Paste switch/AP output, observations, and checks here.">${esc(state.workingNotes||'')}</textarea><div class="btnrow"><button class="smallbtn" type="button" data-live-copy-box="notes">Copy notes</button><button class="smallbtn" type="button" data-live-clear-box="notes">Clear</button></div></div></details>
          <details class="live-panel live-collapsible-panel"><summary>Findings / evidence for case note</summary><div class="live-panel-body"><textarea data-live-findings placeholder="Summarise useful evidence only. Example: AP is on wrong VLAN, DHCP address mismatch, MAC seen on port x/x/x.">${esc(state.findings||'')}</textarea><div class="btnrow"><button class="smallbtn" type="button" data-live-copy-box="findings">Copy findings</button><button class="smallbtn" type="button" data-live-clear-box="findings">Clear</button></div></div></details>
          <details class="live-panel live-collapsible-panel"><summary>CLI commands to use</summary><div class="live-panel-body"><textarea data-live-selected-commands placeholder="Paste or build the CLI commands you need for this case.">${esc(state.selectedCommands||'')}</textarea><div class="btnrow"><button class="smallbtn" type="button" data-live-copy-box="commands">Copy commands</button><button class="smallbtn" type="button" data-live-clear-box="commands">Clear</button></div></div></details>
        </div>
        <div class="btnrow"><button class="btn secondary" type="button" data-live-build-update>Build Latest Update from findings</button><button class="btn secondary" type="button" data-live-clear-workspace>Clear workspace</button></div>
        <div class="tool-status" data-live-status>Saved locally.</div>
      </div>
    </details>`;
  }

  function bindLiveTroubleshootingWorkspace(){
    const root = contentEl.querySelector('[data-live-workspace]');
    if (!root) return;
    const key = sKey('liveWorkspace','state');
    const q = sel => root.querySelector(sel);
    const getState = () => ({
      open: root.open,
      username: q('[data-live-username]')?.value || '',
      password: q('[data-live-password]')?.value || '',
      host: q('[data-live-host]')?.value || '',
      selectedCommands: q('[data-live-selected-commands]')?.value || '',
      workingNotes: q('[data-live-working-notes]')?.value || '',
      findings: q('[data-live-findings]')?.value || '',
      latestUpdate: q('[data-live-latest-update]')?.value || '',
      pinnedSections: Array.from(root.querySelectorAll('[data-live-pin-card]')).map(card => {
        const pin = {};
        const current = loadJson(key, {pinnedSections:[]}).pinnedSections?.[Number(card.dataset.livePinCard)] || {};
        pin.type = current.type || 'pinned';
        pin.title = card.querySelector('.live-pinned-head strong')?.textContent || current.title || 'Pinned section';
        pin.open = !!card.open;
        card.querySelectorAll('[data-live-pin-field]').forEach(el => { pin[el.dataset.livePinField] = el.value || ''; });
        return pin;
      })
    });
    const status = q('[data-live-status]');
    const save = () => { autoResizeTextareas(root); saveJson(key, getState()); if(status) status.textContent = 'Saved locally.'; };
    root.addEventListener('toggle', save);
    root.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', save));
    autoResizeTextareas(root);
    root.querySelectorAll('[data-live-pin-card]').forEach(card => card.addEventListener('toggle', save));
    root.querySelectorAll('[data-live-remove-pin]').forEach(btn => btn.addEventListener('click', () => {
      const st = getState();
      st.pinnedSections.splice(Number(btn.dataset.liveRemovePin), 1);
      st.open = true;
      saveJson(key, st);
      renderPage(location.hash.replace('#','') || activePageId);
    }));
    root.querySelectorAll('[data-live-update-ssh-pin]').forEach(btn => btn.addEventListener('click', () => {
      const card = btn.closest('[data-live-pin-card]');
      if (!card) return;
      const username = card.querySelector('[data-live-pin-field="username"]')?.value.trim() || '';
      const host = card.querySelector('[data-live-pin-field="host"]')?.value.trim() || '';
      const commandBox = card.querySelector('[data-live-pin-field="commands"]');
      if (commandBox && username && host) {
        commandBox.value = `ssh -oHostKeyAlgorithms=+ssh-rsa -oKexAlgorithms=+diffie-hellman-group1-sha1 ${username}@${host}`;
        save();
        autoResizeTextareas(card);
        if(status) status.textContent = 'Pinned SSH command updated.';
      } else if (status) {
        status.textContent = 'Username and Host / IP are required to update SSH command.';
      }
    }));
    root.querySelectorAll('[data-live-copy-pin-commands]').forEach(btn => btn.addEventListener('click', async () => {
      const card = btn.closest('[data-live-pin-card]');
      const commandBox = card?.querySelector('[data-live-pin-field="commands"]');
      await copyPlainText(commandBox ? commandBox.value || '' : '');
      const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent=old, 900);
    }));
    const copyMap = {username:'[data-live-username]', password:'[data-live-password]', host:'[data-live-host]'};
    root.querySelectorAll('[data-live-copy]').forEach(btn => btn.addEventListener('click', async () => {
      const el = q(copyMap[btn.dataset.liveCopy]);
      await copyPlainText(el ? el.value || '' : '');
      const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent=old,900);
    }));
    q('[data-live-copy-ssh]')?.addEventListener('click', async () => {
      const st = getState();
      const ssh = st.username && st.host ? `ssh -oHostKeyAlgorithms=+ssh-rsa -oKexAlgorithms=+diffie-hellman-group1-sha1 ${st.username}@${st.host}` : '';
      await copyPlainText(ssh);
      if(status) status.textContent = ssh ? 'SSH command copied.' : 'Username and Host / IP are required.';
    });
    q('[data-live-clear-creds]')?.addEventListener('click', () => { ['[data-live-username]','[data-live-password]','[data-live-host]'].forEach(sel=>{ const el=q(sel); if(el) el.value=''; }); save(); });
    const boxMap = {commands:'[data-live-selected-commands]', notes:'[data-live-working-notes]', findings:'[data-live-findings]', latest:'[data-live-latest-update]'};
    root.querySelectorAll('[data-live-copy-box]').forEach(btn => btn.addEventListener('click', async () => {
      const el = q(boxMap[btn.dataset.liveCopyBox]); await copyPlainText(el ? el.value || '' : '');
      const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent=old,900);
    }));
    root.querySelectorAll('[data-live-clear-box]').forEach(btn => btn.addEventListener('click', () => { const el=q(boxMap[btn.dataset.liveClearBox]); if(el) el.value=''; save(); autoResizeTextareas(root); }));
    q('[data-live-copy-latest]')?.addEventListener('click', async () => {
      const val = (q('[data-live-latest-update]')?.value || '').trim();
      await copyPlainText(val ? `Latest Update:\n${val}` : '');
      if(status) status.textContent = 'Latest update copied.';
    });
    q('[data-live-build-update]')?.addEventListener('click', () => {
      const findings = (q('[data-live-findings]')?.value || '').trim();
      const notes = (q('[data-live-working-notes]')?.value || '').trim();
      const parts = [];
      if (findings) parts.push(findings);
      if (notes) parts.push('CLI / Working Notes:\n' + notes);
      const out = q('[data-live-latest-update]');
      if (out) out.value = parts.join('\n\n');
      save(); autoResizeTextareas(root); if(status) status.textContent = 'Latest update built.';
    });
    q('[data-live-clear-workspace]')?.addEventListener('click', () => {
      const blank = {open:true, username:'', password:'', host:'', selectedCommands:'', workingNotes:'', findings:'', latestUpdate:'', pinnedSections:[]};
      saveJson(key, blank);
      renderPage(location.hash.replace('#','') || activePageId);
    });
  }

  function setLiveWorkspaceValue(field, value, mode = 'replace'){
    const key = sKey('liveWorkspace','state');
    const defaults = {open:true, username:'', password:'', host:'', selectedCommands:'', workingNotes:'', findings:'', latestUpdate:'', pinnedSections:[]};
    const state = Object.assign({}, defaults, loadJson(key, defaults));
    const cleanValue = String(value || '').trim();
    if (!cleanValue) return;
    state.open = true;
    if (mode === 'append') {
      const existing = String(state[field] || '').trim();
      state[field] = existing ? existing + '\n\n' + cleanValue : cleanValue;
    } else {
      state[field] = cleanValue;
    }
    saveJson(key, state);

    const root = contentEl.querySelector('[data-live-workspace]');
    if (root) {
      root.open = true;
      const map = {
        username: '[data-live-username]',
        password: '[data-live-password]',
        host: '[data-live-host]',
        selectedCommands: '[data-live-selected-commands]',
        workingNotes: '[data-live-working-notes]',
        findings: '[data-live-findings]',
        latestUpdate: '[data-live-latest-update]'
      };
      const el = root.querySelector(map[field]);
      if (el) el.value = state[field] || '';
      autoResizeTextareas(root);
      const status = root.querySelector('[data-live-status]');
      if (status) status.textContent = 'Pinned to workspace.';
    }
  }


  function pinLiveWorkspaceSection(section){
    const key = sKey('liveWorkspace','state');
    const defaults = {open:true, username:'', password:'', host:'', selectedCommands:'', workingNotes:'', findings:'', latestUpdate:'', pinnedSections:[]};
    const state = Object.assign({}, defaults, loadJson(key, defaults));
    if (!Array.isArray(state.pinnedSections)) state.pinnedSections = [];
    const clean = Object.assign({type:'pinned', title:'Pinned section', open:false}, section || {});
    clean.open = false;
    state.open = true;
    state.pinnedSections.push(clean);
    saveJson(key, state);
    const current = location.hash.replace('#','') || activePageId;
    renderPage(current);
    const root = contentEl.querySelector('[data-live-workspace]');
    if (root) {
      root.open = true;
      const status = root.querySelector('[data-live-status]');
      if (status) status.textContent = 'Pinned section added.';
      root.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  function renderOperationsDashboard(pageId){
    return `<div class="step"><div class="step-title">Operations Dashboard</div>
      <div class="ops-grid">
        <div class="ops-card"><strong>1. Paste Salesforce case</strong><div class="muted">Use Call Case or Working Case Generator first. Let the parser extract case number, school, contact, MoE, firewall ID, subject, IPs and MACs.</div></div>
        <div class="ops-card"><strong>2. Choose workflow</strong><div class="muted">Use Smart Search or pinned pages for WiFi, firewall, URL filtering, port forwards, APs, switches, P2, MN3, or T2 escalation.</div></div>
        <div class="ops-card"><strong>3. Capture evidence</strong><div class="muted">Record policy, profile, custom URL category, screenshots, logs, testing result, affected user/site, and next action.</div></div>
        <div class="ops-card"><strong>4. Generate output</strong><div class="muted">Create Salesforce notes, customer emails, Google Chat updates, or escalation templates from the same details.</div></div>
      </div>
    </div>`;
  }

  function renderTimelineTool(pageId){
    const key = sKey('tool','timeline','log');
    const saved = loadText(key, '');
    const items = ['Received / reviewed case','Verified contact and school details','Checked firewall/security policy','Checked logs / FAZ / SCM evidence','Confirmed user impact and scope','Tested after change','Escalated to T2/CSE','Updated customer / Salesforce'];
    return `<div class="step"><div class="step-title">Case Timeline Builder</div><div class="muted">Use this while working a case. Each button adds a timestamped action for clean Salesforce notes and handovers.</div><div class="btnrow">${items.map(x => `<button class="btn secondary" type="button" data-timeline-add="${esc(x)}">${esc(x)}</button>`).join('')}<button class="btn" type="button" data-copy-timeline>Copy Timeline</button><button class="btn secondary" type="button" data-clear-timeline>Clear</button></div><textarea class="timeline-log" data-timeline-log>${esc(saved)}</textarea><div class="tool-status" data-timeline-status>Saved locally.</div></div>`;
  }

  function renderEvidenceChecklist(pageId){
    const key = sKey('tool','evidenceChecklist');
    const saved = loadJson(key, {});
    const checks = ['Case number verified','Contact verified in CRM','School / MoE confirmed','Firewall ID / device confirmed','Issue scope confirmed','IP / MAC / URL / port captured','Security policy checked','URL Access Management Profile checked','Custom URL Category checked','Logs or screenshots captured','Customer test result recorded','Next step / owner clear'];
    return `<div class="step"><div class="step-title">Evidence Quality Checklist</div><div class="checklist-grid">${checks.map((c,i) => `<label class="check-item"><input type="checkbox" data-evidence-check="${i}" ${saved[i] ? 'checked' : ''}>${esc(c)}</label>`).join('')}</div><div class="btnrow"><button class="btn secondary" type="button" data-reset-evidence-checklist>Reset checklist</button></div><div class="tool-status" data-evidence-status>Use this before escalation or case closure.</div></div>`;
  }

  function migrateArchivedCasesIntoKnowledgebase(){
    const migrationKey = sKey('caseKnowledgebase','archivedMigrationV1');
    if (loadText(migrationKey, '') === 'done') return;

    const archivedKey = sKey('archivedWorkingCasesV1','rows');
    const archivedRows = loadJson(archivedKey, []);
    if (!Array.isArray(archivedRows) || !archivedRows.length) {
      saveText(migrationKey, 'done');
      return;
    }

    const entries = loadJson(sKey('caseKnowledgebase','entries'), []);
    const existing = new Set(entries.map(entry => {
      const values = entry && entry.values ? entry.values : {};
      return [cleanup(values.ticket_number || values.case_number || ''), cleanup(values.subject || ''), cleanup(entry.savedAt || '')].join('|').toLowerCase();
    }));

    archivedRows.forEach(row => {
      const values = withAliases({
        ticket_number: cleanup(row.caseNumber || ''),
        case_number: cleanup(row.caseNumber || ''),
        school_name: cleanup(row.schoolName || ''),
        account_name: cleanup(row.schoolName || ''),
        subject: cleanup(row.subject || ''),
        contact_name: cleanup(row.contactName || ''),
        contact_email: cleanup(row.contactEmail || ''),
        raw_salesforce: cleanup(row.rawCase || ''),
        cli_findings: cleanup(row.findings || ''),
        final_output: cleanup(row.note || ''),
        latest_update: cleanup(row.latestUpdate || '')
      });
      const savedAt = cleanup(row.archivedAt || '');
      const signature = [cleanup(values.ticket_number || ''), cleanup(values.subject || ''), savedAt].join('|').toLowerCase();
      if (!existing.has(signature)) {
        entries.push({
          title: cleanup(row.title || caseTitle(values)),
          savedAt: savedAt || new Date().toLocaleString('en-NZ', { hour12:false }),
          sourcePage: 'archived-working-cases',
          values
        });
        existing.add(signature);
      }
    });

    saveJson(sKey('caseKnowledgebase','entries'), entries.slice(0, 500));
    saveJson(archivedKey, []);
    saveText(migrationKey, 'done');
  }

  function getCaseKnowledgebaseEntries(){
    migrateArchivedCasesIntoKnowledgebase();
    return loadJson(sKey('caseKnowledgebase','entries'), []);
  }
  function saveCaseKnowledgebaseEntries(entries){ saveJson(sKey('caseKnowledgebase','entries'), entries || []); }
  function caseTitle(values){
    values = withAliases(values || {});
    const ticket = cleanup(values.ticket_number || '').replace(/^#/, '');
    const subject = cleanup(values.subject || values.issue_type || 'Untitled case');
    return `${ticket ? '#' + ticket + ' — ' : ''}${subject}`;
  }
  function summariseCaseValues(values){
    values = withAliases(values || {});
    return cleanup([
      makeSection('Case Number', values.ticket_number),
      makeSection('School', values.school_name),
      makeSection('MoE', values.moe_id),
      makeSection('Contact', values.contact_name),
      makeSection('Subject', values.subject),
      makeSection('Live Call Classification', values.live_call_classification),
      makeSection('Raw Salesforce / Original Intake', values.raw_salesforce),
      makeSection('Issue Type', values.issue_type),
      makeSection('Fault Domain', values.fault_domain),
      makeSection('Switch / Device', values.switch_name || values.device),
      makeSection('Port / Interface', values.port),
      makeSection('VLAN', values.vlan),
      makeSection('IP Address', values.ip || values.ip_address),
      makeSection('MAC Address', values.mac || values.mac_address),
      makeSection('Raw Salesforce Intake', values.raw_salesforce),
      makeSection('Issue Details', values.issue_details),
      makeSection('Technical Summary', values.technical_summary),
      makeSection('Raw Case / Working Notes / Checks Needed', values.raw_salesforce),
      makeSection('Checks Completed / Findings / CLI Results', values.cli_findings),
      makeSection('Salesforce Note / Outcome Summary', values.final_output),
      makeSection('AI Synopsis', values.ai_synopsis),
      makeSection('Troubleshooting Guidance', values.ai_troubleshooting),
      makeSection('CLI Evidence', values.cli_evidence),
      makeSection('Evidence Collected', values.evidence),
      makeSection('Missing Evidence', values.missing_evidence),
      makeSection('Learning Notes', values.learning_notes),
      makeSection('Action Summary / Next Step', values.resolution_or_next_step),
      makeSection('Final Salesforce Notes', values.salesforce_notes),
      makeSection('Customer Reply Draft', values.customer_reply_draft)
    ].filter(Boolean).join('\n'));
  }
  function renderCaseKnowledgebaseTool(pageId){
    const entries = getCaseKnowledgebaseEntries();
    const cards=entries.map((entry, idx) => {
      const values=withAliases(entry.values||{});
      const search=[entry.title,entry.savedAt,values.ticket_number,values.school_name,values.subject,values.issue_type].filter(Boolean).join(' ').toLowerCase();
      return `<details class="case-card kb-case-card" data-kb-index="${idx}" data-kb-search="${esc(search)}" data-kb-date="${esc(entry.savedAt||'')}">
      <summary>${esc(entry.title || caseTitle(values))}<span class="case-card-meta">${esc(entry.savedAt || '')}</span></summary>
      <div class="case-card-body">
        <div class="kb-case-tags"><span class="pill">${esc(values.ticket_number||'No case #')}</span><span class="pill">${esc(values.school_name||'No school')}</span></div>
        <div class="btnrow">
          <button class="btn secondary" type="button" data-copy-kb-entry="${idx}">Copy</button>
          <button class="btn" type="button" data-restore-kb-active="${idx}">Restore to Current Active</button>
          <button class="btn secondary" type="button" data-restore-kb-park="${idx}">Restore to Park / Working</button>
          <button class="btn secondary danger-clear" type="button" data-delete-kb-entry="${idx}">Delete</button>
        </div>
        <div class="output-area">${formatOutputHTML(summariseCaseValues(values))}</div>
      </div>
    </details>`;
    }).join('');
    const emptyState = entries.length ? '' : `<div class="notice kb-empty-state">No saved learning cases yet. Use Case Knowledgebase from a Working Case ticket.</div>`;
    return `<div class="kb-toolbar"><div class="kb-search-wrap"><span>⌕</span><input class="search" data-kb-search-input placeholder="Search case number, school or subject" aria-label="Search Case Knowledgebase"></div><select class="search kb-sort" data-kb-sort aria-label="Sort Case Knowledgebase"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="az">Case / subject A–Z</option></select><span class="pill" data-kb-result-count>${entries.length} case${entries.length === 1 ? '' : 's'}</span></div><div data-kb-list>${cards}${emptyState}</div>`;
  }

  
/* v12: preserve Live Call dropdown values when sending to Intake/Working */
function buildLiveCallClassificationSummary(values){
  values = values || {};
  const lines = [];
  const push = (label, key) => {
    const v = cleanup(values[key]);
    if (v) lines.push(`${label}: ${v}`);
  };
  push('Issue Type', 'issue_type');
  push('Device Type', 'device_type');
  push('Fault Domain', 'fault_domain');
  push('Caller Role', 'caller_role');
  return lines.length ? `Live Call Classification:\n${lines.join('\n')}` : '';
}

function normaliseCaseTransferValues(values){
  const out = Object.assign({}, values || {});

  const classification = buildLiveCallClassificationSummary(out);
  if (classification && !cleanup(out.live_call_classification)) {
    out.live_call_classification = classification;
  }

  // Live Call / Case status mapping
  if (!cleanup(out.current_status) && cleanup(out.case_status)) {
    out.current_status = out.case_status;
  }
  if (!cleanup(out.case_status) && cleanup(out.current_status)) {
    out.case_status = out.current_status;
  }

  // Case Intake -> Working Case mapping
  if (!cleanup(out.ai_synopsis) && cleanup(out.technical_summary)) {
    out.ai_synopsis = out.technical_summary;
  }

  // Working Case -> Case Intake fallback mapping
  if (!cleanup(out.technical_summary) && cleanup(out.ai_synopsis)) {
    out.technical_summary = out.ai_synopsis;
  }

  // Live Call notes -> Intake/Working summary fallback
  if (!cleanup(out.technical_summary) && cleanup(out.issue_details)) {
    out.technical_summary = out.issue_details;
  }

  // Preserve raw source evidence if present.
  if (!cleanup(out.raw_salesforce) && cleanup(out.original_intake)) {
    out.raw_salesforce = out.original_intake;
  }

  return withAliases(out);
}

  let renderedPageId = '';

  function pageUiStateKey(pageId){
    return sKey('ui-state', pageId);
  }

  function describeDetailsElement(el, index){
    const attrs = [
      'data-collapsible-field','data-live-workspace','data-live-pin-card',
      'data-pa-cli-helper','data-ticket-group','data-page-section'
    ];
    for (const attr of attrs) {
      if (el.hasAttribute(attr)) return `${attr}:${el.getAttribute(attr) || 'true'}`;
    }
    const summary = cleanup(el.querySelector(':scope > summary')?.textContent || '');
    const classes = Array.from(el.classList || []).sort().join('.');
    return `${classes || 'details'}:${summary || index}:${index}`;
  }

  function savePageUiState(pageId){
    if (!pageId || !contentEl || !contentEl.firstElementChild) return;
    const details = {};
    contentEl.querySelectorAll('details').forEach((el, index) => {
      details[describeDetailsElement(el, index)] = !!el.open;
    });
    const main = contentEl.closest('.main');
    const active = document.activeElement && contentEl.contains(document.activeElement)
      ? document.activeElement : null;
    let focus = null;
    if (active) {
      focus = {
        field: active.getAttribute('data-field') || '',
        sfImport: active.hasAttribute('data-sf-import'),
        name: active.getAttribute('name') || '',
        id: active.id || '',
        selectionStart: typeof active.selectionStart === 'number' ? active.selectionStart : null,
        selectionEnd: typeof active.selectionEnd === 'number' ? active.selectionEnd : null
      };
    }
    saveJson(pageUiStateKey(pageId), {
      details,
      scrollTop: main ? main.scrollTop : 0,
      focus,
      savedAt: Date.now()
    });
  }

  function restorePageUiState(pageId){
    if (!contentEl) return;
    const state = loadJson(pageUiStateKey(pageId), null);

    // First visit: every expandable field starts collapsed. Some page renderers
    // include an `open` attribute for legacy reasons, so normalise them here.
    // Once the user opens or closes a field, the saved state below becomes the
    // authority and is restored whenever they return to the page or reopen the
    // runbook.
    if (!state) {
      contentEl.querySelectorAll('details').forEach(el => { el.open = false; });
      return;
    }

    const detailsState = state.details || {};
    contentEl.querySelectorAll('details').forEach((el, index) => {
      const key = describeDetailsElement(el, index);
      // New fields added after a saved state was created should also default to
      // collapsed until the user explicitly opens them.
      el.open = Object.prototype.hasOwnProperty.call(detailsState, key)
        ? !!detailsState[key]
        : false;
    });
    const main = contentEl.closest('.main');
    const wantedScrollTop = Number.isFinite(Number(state.scrollTop)) ? (Number(state.scrollTop) || 0) : 0;
    if (main) main.scrollTop = wantedScrollTop;
    requestAnimationFrame(() => {
      if (main && main.scrollTop !== wantedScrollTop) main.scrollTop = wantedScrollTop;
      const f = state.focus;
      if (!f) return;
      let target = null;
      if (f.id) target = contentEl.querySelector(`#${CSS.escape(f.id)}`);
      if (!target && f.field) target = contentEl.querySelector(`[data-field="${CSS.escape(f.field)}"]`);
      if (!target && f.sfImport) target = contentEl.querySelector('[data-sf-import]');
      if (!target && f.name) target = contentEl.querySelector(`[name="${CSS.escape(f.name)}"]`);
      if (target && typeof target.focus === 'function') {
        target.focus({preventScroll:true});
        if (typeof target.setSelectionRange === 'function' && f.selectionStart != null) {
          try { target.setSelectionRange(f.selectionStart, f.selectionEnd ?? f.selectionStart); } catch {}
        }
      }
    });
  }



  const ISSUE_WORKFLOWS = [
    {issue:'Internet Offline',title:'Internet offline',summary:'Whole-site or partial loss of connectivity.',icon:'globe',links:[['Quick isolation','qt-switch-no-network'],['Firewall checks','fw-pa-connectivity'],['Traffic logs','fw-pa-traffic']],questions:['Whole school, one VLAN, one area, or one device?','Are wired and wireless both affected?','When did it start and what changed?'],checks:['Confirm client IP, gateway and DNS.','Test the local gateway before testing upstream.','Check switch/AP path, then firewall and access circuit.'],evidence:['Affected scope and exact start time','Client IP/VLAN and gateway result','Firewall/access status and timestamps']},
    {issue:'Slow Internet',title:'Slow internet',summary:'Poor throughput, latency, or intermittent performance.',icon:'globe',links:[['Internet speed template','template-internet-speed'],['iPerf throughput','fw-pa-iperf-throughput'],['System health','fw-pa-health']],questions:['All users or a specific room/SSID/VLAN?','What time is performance worst?','Is the issue internal, external, or both?'],checks:['Capture a controlled speed test.','Compare wired and wireless performance.','Check interface errors, utilisation and firewall health.'],evidence:['Speed test and timestamp','Affected VLAN/SSID and device','Interface errors/utilisation']},
    {issue:'No IP Address',title:'No IP address',summary:'Client is not receiving a valid DHCP lease.',icon:'network',links:[['Wrong VLAN','qt-switch-wrong-vlan'],['Switch port','qt-switch-port-down'],['DNS / addressing','svc-dns']],questions:['One device or multiple devices?','Wired or wireless?','What address is currently shown?'],checks:['Check link/association and VLAN first.','Confirm MAC learning on the expected port.','Check DHCP scope and relay path.'],evidence:['Client MAC and switch/AP location','Port/SSID and VLAN','DHCP result or lease evidence']},
    {issue:'Wireless Issue',title:'Wi-Fi issue',summary:'Connection, coverage, SSID, authentication, or roaming issue.',icon:'wifi',links:[['Cannot connect','qt-wifi-client-connect'],['Poor signal','qt-wifi-poor-signal'],['SSID missing','qt-wifi-ssid-missing'],['AP offline','qt-wifi-ap-offline']],questions:['Which SSID and device?','Which AP/room and how many users?','Does wired connectivity work?'],checks:['Confirm AP and SSID state.','Check authentication, VLAN and DHCP.','Review signal, channel and client evidence.'],evidence:['SSID, AP and client details','RSSI/authentication result','VLAN/DHCP result']},
    {issue:'Switch Port',title:'Switch port',summary:'Link, VLAN, cabling, authentication, or forwarding issue.',icon:'network',links:[['Port down','qt-switch-port-down'],['Wrong VLAN','qt-switch-wrong-vlan'],['MAC authentication','qt-switch-macauth']],questions:['Switch name and exact port?','Link light and device type?','Was a known-good cable/device tested?'],checks:['Check interface state and counters.','Check untagged/tagged VLANs.','Check MAC/LLDP and authentication.'],evidence:['Switch/port and link state','VLAN and MAC learning','Cable/device swap result']},
    {issue:'PoE Issue',title:'PoE issue',summary:'Powered device is offline or not receiving enough power.',icon:'network',links:[['PoE workflow','qt-switch-poe'],['Ruckus PoE reference','switch-ruckus-poe']],questions:['Which powered device and port?','Does it power on elsewhere?','Are other PoE devices affected?'],checks:['Check PoE state and draw.','Check switch PoE budget.','Test a known-good port/cable where approved.'],evidence:['Port PoE state and power draw','Switch power budget','Known-good test result']},
    {issue:'Firewall / Filtering',title:'Firewall or filtering',summary:'Traffic is denied, reset, not matched, or filtered by policy/category.',icon:'shield',links:[['Traffic logs','fw-pa-traffic'],['Threat / URL logs','fw-pa-url-threat'],['Sessions','fw-pa-session'],['Safety / Approval','fw-pa-safety']],questions:['Source IP/user and destination?','Exact timestamp and error?','One user, VLAN, or whole school?'],checks:['Confirm Layer 1–3 path first.','Check traffic and URL logs using the timestamp.','Record action, rule, app and category.'],evidence:['Source, destination and timestamp','Action, rule and URL category','Session or log result']},
    {issue:'DNS Issue',title:'DNS issue',summary:'Name resolution fails or returns an unexpected result.',icon:'globe',links:[['DNS troubleshooting','svc-dns'],['Firewall connectivity','fw-pa-connectivity']],questions:['Which domain and device?','Which DNS server is configured?','Does direct IP access work?'],checks:['Run lookup against the configured DNS server.','Compare name lookup with IP reachability.','Check whether the problem is isolated or widespread.'],evidence:['Domain and lookup result','DNS server and client IP','Direct IP test result']},
    {issue:'Printing Issue',title:'Printing',summary:'Printer discovery, reachability, queue, driver, or VLAN issue.',icon:'printer',links:[['Printing troubleshooting','svc-print']],questions:['Printer name/IP and affected users?','Direct print or print server?','Wired or wireless clients?'],checks:['Check printer IP and reachability.','Confirm VLAN and print path.','Check queue, driver, and recent changes.'],evidence:['Printer IP/name and VLAN','Ping/queue result','Affected devices and error']},
    {issue:'VoIP / Phones',title:'VoIP / phones',summary:'No dial tone, registration, audio, VLAN, PoE, or call-flow issue.',icon:'phone',links:[['VoIP troubleshooting','svc-voip'],['PoE workflow','qt-switch-poe']],questions:['One handset or multiple?','Phone MAC/IP and switch port?','No dial tone, no registration, or call issue?'],checks:['Check link and PoE.','Confirm voice VLAN and DHCP.','Check registration and upstream traffic.'],evidence:['Phone MAC/IP and port','VLAN/PoE/DHCP result','Registration or traffic evidence']},
    {issue:'Authentication Issue',title:'Authentication',summary:'User, device, MAC-auth, RADIUS, or access-control failure.',icon:'shield',links:[['Switch authentication','switch-ruckus-auth'],['MAC auth workflow','qt-switch-macauth'],['Palo Alto User-ID','fw-pa-userid']],questions:['Username/device and exact time?','Which SSID, port, or VLAN?','Are other users affected?'],checks:['Confirm identity and device details.','Check access method and relevant logs.','Compare with a known-working user/device.'],evidence:['Username/device and timestamp','Authentication/log result','Scope and known-good comparison']},
    {issue:'Other',title:'Other issue',summary:'Use structured fault isolation when the symptom does not fit a standard workflow.',icon:'troubleshoot',links:[['Top service checks','svc-top'],['Top firewall checks','fw-top'],['Ruckus troubleshooting','switch-ruckus-troubleshooting']],questions:['What is the exact customer wording?','What is affected and what still works?','When did it start and what changed?'],checks:['Confirm scope and expected behaviour.','Start at the closest layer to the user.','Record each result before moving upstream.'],evidence:['Exact symptom and scope','Known-good comparison','Checks completed and next decision']}
  ];

  function currentCaseContext(){
    const pageId='case-working-template', formKey='workingCase', slotCount=100;
    const slot=getActiveWorkingSlot(pageId,formKey,slotCount);
    if(!slot) return {slot:0,values:{}};
    return {slot,values:withAliases(loadJson(sKey(pageId,formKey,'slot',slot),{}))};
  }

  function startNewWorkingCase(){
    for(let slot=1;slot<=100;slot++){
      if(!hasMeaningfulTicketData('case-working-template','workingCase',slot)){
        const values={workflow_status:'Investigating'};
        saveJson(sKey('case-working-template','workingCase','slot',slot),values);
        saveJson(sKey('case-working-template','workingCase','slot',slot,'outputs'),{working:''});
        saveText(sKey('case-working-template','workingCase','active-slot'),String(slot));
        saveText(sKey('case-working-template','workspace-phase'),'intake');
        location.hash='#case-working-template';
        return slot;
      }
    }
    return 0;
  }

  function parkedCaseCount(){
    const active=currentCaseContext().slot;
    let count=0;
    for(let i=1;i<=100;i++) if(i!==active && hasMeaningfulTicketData('case-working-template','workingCase',i)) count++;
    return count;
  }

  function statusClass(status){
    const t=String(status||'Investigating').toLowerCase();
    if(t.includes('resolved')) return 'resolved';
    if(t.includes('escalat')) return 'escalated';
    if(t.includes('waiting')) return 'waiting';
    return 'investigating';
  }

  function buildCasePacket(values, maskPersonal=true){
    values=withAliases(values||{});
    const contact=maskPersonal ? (values.contact_name ? 'School contact details masked' : '') : [values.contact_name,values.contact_phone||values.contact_mobile,values.contact_email].filter(Boolean).join(' / ');
    return cleanup([
      makeSection('Case', values.ticket_number),
      makeSection('School', values.school_name),
      makeSection('MoE', values.moe_id),
      makeSection('Firewall ID', values.firewall_id),
      makeSection('Contact', contact),
      makeSection('Subject', values.subject),
      makeSection('Status', values.workflow_status || 'Investigating'),
      makeSection('Primary Issue', values.issue_type),
      makeSection('Impact / Scope', values.impact_scope),
      makeSection('When It Started', values.started_when),
      makeSection('Original Case / Working Notes', values.raw_salesforce),
      makeSection('Checks Completed / Findings', values.cli_findings),
      makeSection('Missing Evidence / Next Checks', values.missing_evidence),
      makeSection('Current Decision / Next Action', values.resolution_or_next_step),
      makeSection('Current Salesforce Note', values.final_output)
    ].filter(Boolean).join('\n')) || 'No active case details are available yet.';
  }


  function buildGeminiPacket(values){
    const v = withAliases(values || {});
    return cleanup([
      'ROLE',
      'Act as a cautious Tier 2 support coach. Separate confirmed facts from assumptions. Prefer read-only checks. Do not invent results, topology, commands, or configuration. Label any potentially impactful action and explain the approval required.',
      '',
      'CASE CONTEXT — REDACTED',
      'Case reference: Redacted',
      'Customer / site: Redacted',
      makeSection('Primary issue', v.issue_type),
      makeSection('Impact / scope', v.impact_scope),
      makeSection('When it started', v.started_when),
      '',
      'CONFIRMED FACTS AND RESULTS',
      cleanup(v.cli_findings) || 'No confirmed technical results recorded yet.',
      '',
      'MISSING EVIDENCE / NEXT CHECKS',
      cleanup(v.missing_evidence) || 'Not yet recorded.',
      '',
      'CURRENT DECISION / NEXT ACTION',
      cleanup(v.resolution_or_next_step) || 'Not yet recorded.',
      '',
      'RESPONSE FORMAT REQUIRED',
      '1. Confirmed facts',
      '2. Assumptions or missing information',
      '3. Most likely fault domains, ranked',
      '4. Next three checks in order',
      '5. Expected healthy and abnormal result for each check',
      '6. How each result changes the investigation',
      '7. Evidence to record',
      '8. Escalation threshold',
      '9. Unsafe or change-controlled actions to avoid'
    ].filter(Boolean).join('\n'));
  }

  function renderActiveCaseBar(){
    const ctx=currentCaseContext();
    if(!ctx.slot) return `<section class="active-case-bar empty"><div class="active-case-main">${iconSvg('case')}<div><span class="case-kicker">NO ACTIVE CASE</span><strong>Start or restore a case to keep context across the runbook.</strong></div></div><div class="active-case-actions"><a class="btn" href="#case-working-template">Open Case Desk</a></div></section>`;
    const v=ctx.values;
    const status=v.workflow_status||'Investigating';
    const title=caseTitle(v);
    return `<section class="active-case-bar ${statusClass(status)}" data-active-case-bar>
      <div class="active-case-main">${iconSvg('case')}<div><span class="case-kicker">CURRENT CASE · SLOT ${ctx.slot}</span><strong>${esc(title)}</strong><span class="active-case-sub">${esc(v.school_name||'School not entered')} · ${esc(v.issue_type||'Issue not classified')}</span></div></div>
      <label class="case-status-control"><span>Status</span><select data-casebar-status>${['Investigating','Waiting for Customer','Waiting for ICT / Provider','Escalated','Resolved'].map(x=>`<option ${x===status?'selected':''}>${esc(x)}</option>`).join('')}</select></label>
      <div class="active-case-actions"><a class="btn secondary" href="#case-working-template">Open</a><button class="btn secondary" type="button" data-casebar-copy>Copy packet</button><a class="btn secondary" href="#email-resolved">Resolve</a><a class="btn" href="#template-tier2">Escalate</a></div>
    </section>`;
  }

  function bindActiveCaseBar(){
    const root=contentEl.querySelector('[data-active-case-bar]');
    if(!root) return;
    const ctx=currentCaseContext();
    root.querySelector('[data-casebar-copy]')?.addEventListener('click',async e=>{await copyPlainText(buildCasePacket(ctx.values,false),{disableHtmlBold:true});const b=e.currentTarget;b.textContent='✓ Copied';setTimeout(()=>b.textContent='Copy packet',1300);});
    root.querySelector('[data-casebar-status]')?.addEventListener('change',e=>{const current=currentCaseContext();if(!current.slot)return;current.values.workflow_status=e.target.value;saveJson(sKey('case-working-template','workingCase','slot',current.slot),current.values);renderPage(currentPageId());});
  }

  function bindOperationsHome(){
    contentEl.querySelector('[data-start-new-case]')?.addEventListener('click',()=>{
      const slot=startNewWorkingCase();
      if(!slot){
        const btn=contentEl.querySelector('[data-start-new-case]');
        if(btn){btn.textContent='No empty case slots';btn.disabled=true;}
      }
    });

    contentEl.querySelectorAll('[data-home-case-view]').forEach(btn=>btn.addEventListener('click',()=>{
      saveText(sKey('meta','case-desk-view'), btn.dataset.homeCaseView || '');
      location.hash='#case-working-template';
    }));

    const pinnedToggle=contentEl.querySelector('[data-toggle-pinned-pages]');
    const pinnedPanel=contentEl.querySelector('[data-home-pinned-panel]');
    if(pinnedToggle&&pinnedPanel){
      pinnedToggle.addEventListener('click',()=>{
        const willOpen=pinnedPanel.hidden;
        pinnedPanel.hidden=!willOpen;
        pinnedToggle.setAttribute('aria-expanded',willOpen?'true':'false');
        if(willOpen) requestAnimationFrame(()=>pinnedPanel.scrollIntoView({behavior:'smooth',block:'nearest'}));
      });
    }

    contentEl.querySelectorAll('[data-unpin-home-page]').forEach(btn=>btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const pageId=btn.dataset.unpinHomePage||'';
      saveFavorites(getFavorites().filter(id=>id!==pageId));
      updateFavoriteButton();
      renderPage('runbook-home');
    }));
  }

  function renderTroubleshootingHub(){

    return `<section class="workflow-hub">
      <div class="workflow-hero"><div><span class="eyebrow">START WITH THE SYMPTOM</span><h1>Choose the problem the customer reports</h1><p>The Runbook will set the case classification, show the evidence needed, and link to the relevant technical checks.</p></div>${iconSvg('troubleshoot','hero-icon')}</div>
      <div class="workflow-filter"><span>${iconSvg('search')}</span><input class="search" data-workflow-filter placeholder="Filter symptoms, evidence or technology..." /></div>
      <div class="symptom-grid" data-symptom-grid>${ISSUE_WORKFLOWS.map((w,i)=>`<article class="symptom-card" data-workflow-card data-workflow-search="${esc([w.issue,w.title,w.summary,...w.questions,...w.checks,...w.evidence].join(' ').toLowerCase())}">
        <div class="symptom-head"><span class="symptom-icon">${iconSvg(w.icon)}</span><div><h2>${esc(w.title)}</h2><p>${esc(w.summary)}</p></div></div>
        <div class="workflow-columns"><div><h3>Ask first</h3>${renderList(w.questions)}</div><div><h3>Check next</h3>${renderList(w.checks)}</div><div><h3>Record</h3>${renderList(w.evidence)}</div></div>
        <div class="symptom-actions"><button class="btn" type="button" data-set-case-issue="${esc(w.issue)}">Use with current case</button>${w.links.map(([label,id])=>`<a class="btn secondary" href="#${esc(id)}">${esc(label)}</a>`).join('')}</div>
      </article>`).join('')}</div>
    </section>`;
  }

  function bindTroubleshootingHub(){
    const input=contentEl.querySelector('[data-workflow-filter]');
    const cards=Array.from(contentEl.querySelectorAll('[data-workflow-card]'));
    input?.addEventListener('input',()=>{const q=input.value.trim().toLowerCase();cards.forEach(c=>c.hidden=!!q&&!c.dataset.workflowSearch.includes(q));});
    contentEl.querySelectorAll('[data-set-case-issue]').forEach(btn=>btn.addEventListener('click',()=>{
      const ctx=currentCaseContext();
      if(!ctx.slot){location.hash='#case-working-template';return;}
      ctx.values.issue_type=btn.dataset.setCaseIssue||'';
      if(!ctx.values.workflow_status) ctx.values.workflow_status='Investigating';
      saveJson(sKey('case-working-template','workingCase','slot',ctx.slot),ctx.values);
      saveText(sKey('case-working-template','workspace-phase'),'troubleshoot');
      location.hash='#case-working-template';
    }));
  }

  function renderModernHome(){
    const ctx=currentCaseContext();
    const v=ctx.values||{};
    const parked=parkedCaseCount();
    const favoriteIds=getFavorites();
    const pinnedItems=favoriteIds.map(id=>({
      id,
      title:id==='runbook-home'?'Operations Home':((runbook.pages&&runbook.pages[id]&&runbook.pages[id].title)||id)
    }));
    const pinnedList=pinnedItems.length
      ? pinnedItems.map(item=>`<div class="home-pinned-item"><a href="#${esc(item.id)}">${esc(item.title)}</a><button class="btn secondary" type="button" data-unpin-home-page="${esc(item.id)}">Unpin</button></div>`).join('')
      : `<div class="home-pinned-empty">No pages are pinned. Open a runbook page and select ☆ Pin in the top bar.</div>`;
    const activeHtml=ctx.slot ? `<div class="home-active-case ${statusClass(v.workflow_status)}"><div class="home-active-top"><span class="eyebrow">RESUME CURRENT CASE</span><span class="status-pill ${statusClass(v.workflow_status)}">${esc(v.workflow_status||'Investigating')}</span></div><h2>${esc(caseTitle(v))}</h2><p>${esc(v.school_name||'School not entered')} · ${esc(v.issue_type||'Issue not classified')} · ${esc(v.impact_scope||'Scope not entered')}</p><div class="home-active-actions"><a class="btn" href="#case-working-template">Open Case Desk</a><a class="btn secondary" href="#troubleshooting-hub">Choose workflow</a></div></div>` : `<div class="home-active-case empty"><span class="eyebrow">START A CASE</span><h2>No active case</h2><p>Paste a Salesforce ticket or start a phone call case. The active case will remain available while you move through technical pages.</p><div class="home-active-actions"><button class="btn" type="button" data-start-new-case>Start new case</button><a class="btn secondary" href="#case-knowledgebase">Restore from Knowledgebase</a></div></div>`;
    return `<section class="operations-home">
      <div class="operations-hero"><div><span class="eyebrow">DAILY SUPPORT OPERATIONS</span><h1>Work the case from intake to outcome</h1><p>Keep the customer issue, technical evidence, Salesforce note and escalation path in one controlled workflow.</p><div class="operations-flow"><span>1 Intake</span><i></i><span>2 Troubleshoot</span><i></i><span>3 Evidence</span><i></i><span>4 Output</span></div></div><div class="hero-orbit">${iconSvg('case')}<small>OFFLINE<br>RUNBOOK</small></div></div>
      <div class="home-metrics"><button type="button" data-home-case-view="active" title="Open the Current Active case section"><strong>${ctx.slot?1:0}</strong><span>Active case</span></button><button type="button" data-home-case-view="parked" title="Open Park / Working on cases"><strong>${parked}</strong><span>Parked cases</span></button><button type="button" data-toggle-pinned-pages aria-expanded="false" title="Show pinned pages"><strong>${favoriteIds.length}</strong><span>Pinned pages</span></button><div><strong>Local</strong><span>Autosave</span></div></div>
      <section class="home-pinned-panel" data-home-pinned-panel hidden><div class="home-pinned-head"><div><span class="eyebrow">PINNED PAGES</span><h2>Choose a page or remove a pin</h2></div></div><div class="home-pinned-list">${pinnedList}</div></section>
      ${activeHtml}
      <div class="home-section-head"><div><span class="eyebrow">PRIMARY ACTIONS</span><h2>What do you need to do?</h2></div><button class="btn secondary" type="button" data-open-smart-search>${iconSvg('search')} Search everything</button></div>
      <div class="operation-action-grid">
        <a class="operation-card primary" href="#case-working-template"><span>${iconSvg('case')}</span><div><h3>Case Desk</h3><p>Import, classify, troubleshoot, record evidence and create the outcome.</p></div><b>Open</b></a>
        <a class="operation-card" href="#troubleshooting-hub"><span>${iconSvg('troubleshoot')}</span><div><h3>Start by symptom</h3><p>Choose what the customer reports and follow the correct fault-isolation path.</p></div><b>Choose</b></a>
        <a class="operation-card" href="#case-knowledgebase"><span>${iconSvg('knowledge')}</span><div><h3>Knowledgebase</h3><p>Search resolved and escalated cases, then restore useful case details.</p></div><b>Search</b></a>
      </div>
      <div class="home-section-head compact"><div><span class="eyebrow">COMMON FAULTS</span><h2>Jump into a workflow</h2></div></div>
      <div class="fault-shortcuts">
        <a href="#qt-wifi-client-connect">${iconSvg('wifi')}<span>Wi-Fi client</span></a>
        <a href="#qt-wifi-ap-offline">${iconSvg('wifi')}<span>AP offline</span></a>
        <a href="#qt-switch-port-down">${iconSvg('network')}<span>Switch port</span></a>
        <a href="#qt-switch-poe">${iconSvg('network')}<span>PoE</span></a>
        <a href="#fw-pa-traffic">${iconSvg('shield')}<span>Firewall logs</span></a>
        <a href="#svc-dns">${iconSvg('globe')}<span>DNS</span></a>
        <a href="#svc-print">${iconSvg('printer')}<span>Printing</span></a>
        <a href="#svc-voip">${iconSvg('phone')}<span>VoIP</span></a>
      </div>
      <div class="home-bottom-grid"><section><span class="eyebrow">RECOMMENDED FLOW</span><h3>Keep one source of truth</h3><ol><li>Import the case into Case Desk.</li><li>Classify the primary issue and impact.</li><li>Use symptom-led and technical guides.</li><li>Record only confirmed evidence.</li><li>Resolve, update, or escalate.</li></ol></section><section><span class="eyebrow">SAFETY</span><h3>Human review remains required</h3><ul><li>Keep customer and credential data within approved work systems.</li><li>Review commands before running them.</li><li>Mark configuration changes as approval required.</li><li>Do not store passwords in the Runbook.</li></ul><a class="text-link" href="#tool-backup-restore">Open Backup / Restore →</a></section></div>
    </section>`;
  }

function renderPage(pageId){
    const nextPageId = pageExists(pageId) ? pageId : currentPageId();
    if (renderedPageId) savePageUiState(renderedPageId);
    pageId = nextPageId;
    saveText('runbook:last-page', pageId);
    const page = getPage(pageId) || getPage('case-working-template') || {title:'Runbook', body:[]};
    let bodyHtml = '';
    try {
      if (Array.isArray(page.body) && page.body.length) {
        bodyHtml = (page.body || []).map(block => {
          try {
            return renderBlock(pageId, block);
          } catch (err) {
            console.error('Block render failed:', err, block);
            return `<div class="notice">This section could not render. Check this page block configuration.</div>`;
          }
        }).join('');
      } else if (page.content) {
        bodyHtml = String(page.content || '');
      } else {
        bodyHtml = '';
      }
    } catch (err) {
      console.error('Page render failed:', err);
      bodyHtml = `<div class="notice">This page could not render. Please select another page or reload the runbook.</div>`;
    }

    const pills = Array.isArray(page.pills) && page.pills.length
      ? `<div class="pills">${page.pills.map(p => `<span class="pill">${esc(p)}</span>`).join('')}</div>`
      : '';

    if (pageId === 'runbook-home') {
      contentEl.innerHTML = renderModernHome();
    } else if (pageId === 'troubleshooting-hub') {
      contentEl.innerHTML = `${renderActiveCaseBar()}${renderTroubleshootingHub()}`;
    } else if (pageId === 'case-working-template') {
      contentEl.innerHTML = `${renderActiveCaseBar()}${bodyHtml}`;
    } else {
      const pageIcon = iconForPage(pageId, page.title);
      const typeBadges = `<div class="page-statuses"><span class="status-badge offline">Offline</span><span class="status-badge searchable">Searchable</span>${isTemplatePage(pageId) ? '<span class="status-badge autosave">Autosave</span>' : ''}</div>`;
      contentEl.innerHTML = `${renderActiveCaseBar()}<div class="card page-card"><div class="page-heading"><div class="page-title-icon">${pageIcon}</div><div class="page-title-copy"><h2>${esc(page.title || pageId)}</h2>${pills}</div>${typeBadges}</div>${buildPageTools(pageId)}${bodyHtml}</div>`;
    }

    try { bindOperationsHome(); } catch (err) { console.error('bindOperationsHome failed:', err); }
    try { bindActiveCaseBar(); } catch (err) { console.error('bindActiveCaseBar failed:', err); }
    try { bindTroubleshootingHub(); } catch (err) { console.error('bindTroubleshootingHub failed:', err); }
    try { bindPage(pageId); } catch (err) { console.error('bindPage failed:', err); }
    try { bindModernCaseDesk(); } catch (err) { console.error('bindModernCaseDesk failed:', err); }
    try { bindRunbookTools(pageId); } catch (err) { console.error('bindRunbookTools failed:', err); }
    try { bindQuickLinksTool(); } catch (err) { console.error('bindQuickLinksTool failed:', err); }
    try { bindCustomLocalInfoTools(); } catch (err) { console.error('bindCustomLocalInfoTools failed:', err); }
    try { bindCaseUpdateBuilderTool(); } catch (err) { console.error('bindCaseUpdateBuilderTool failed:', err); }
    try { bindUrlPolicyTool(pageId); } catch (err) { console.error('bindUrlPolicyTool failed:', err); }
    try { bindPaCliHelpers(); } catch (err) { console.error('bindPaCliHelpers failed:', err); }
    try { autoResizeTextareas(contentEl); } catch (err) {}
    try { highlightActive(); } catch (err) {}
    try { setRecentPage(pageId); } catch (err) {}
    try { updateFavoriteButton(); } catch (err) {}
    renderedPageId = pageId;
    try { restorePageUiState(pageId); } catch (err) { console.error('restorePageUiState failed:', err); }
    try {
      contentEl.querySelectorAll('details').forEach(el => el.addEventListener('toggle', () => savePageUiState(pageId)));
    } catch (err) {}
    // One lightweight notification for optional page enhancements. This
    // replaces continuous polling and recursive whole-page observers.
    try { document.dispatchEvent(new CustomEvent('runbook:page-rendered', {detail:{pageId}})); } catch (err) {}
  }


  function bindRunbookTools(pageId){


    // Backup / Restore for all runbook Local Storage data.
    const backupStatusEl = contentEl.querySelector('[data-backup-status]');
    const setBackupStatus = (message) => {
      if (!backupStatusEl) return;
      const stamp = new Date().toLocaleString('en-NZ', { hour12:false });
      backupStatusEl.textContent = `${stamp}\n${message}`;
    };
    const buildRunbookBackup = () => {
      const keys = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('runbook:')) keys[key] = localStorage.getItem(key);
      }
      return {
        backupType: 'troubleshooting-runbook-local-storage',
        backupVersion: 1,
        runbookVersion: 'André Offline Runbook v53 - IAM Send Destination',
        exportedAt: new Date().toISOString(),
        keyCount: Object.keys(keys).length,
        keys
      };
    };
    const serialiseRunbookBackup = () => JSON.stringify(buildRunbookBackup(), null, 2);
    contentEl.querySelector('[data-export-runbook-backup]')?.addEventListener('click', () => {
      const backup = serialiseRunbookBackup();
      const blob = new Blob([backup], { type: 'application/json' });
      const a = document.createElement('a');
      const date = new Date().toISOString().slice(0,10);
      a.href = URL.createObjectURL(blob);
      a.download = `runbook-backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      setBackupStatus(`Exported ${buildRunbookBackup().keyCount} runbook Local Storage keys to JSON.\nSave this file somewhere safe, then import it on the other device.`);
    });
    contentEl.querySelector('[data-copy-runbook-backup]')?.addEventListener('click', async () => {
      const backup = serialiseRunbookBackup();
      await copyPlainText(backup);
      setBackupStatus(`Copied backup JSON to clipboard.\nKey count: ${buildRunbookBackup().keyCount}`);
    });
    contentEl.querySelector('[data-copy-backup-status]')?.addEventListener('click', async () => {
      await copyPlainText(backupStatusEl ? backupStatusEl.textContent || '' : '');
    });
    contentEl.querySelector('[data-import-runbook-backup]')?.addEventListener('click', async () => {
      const input = contentEl.querySelector('[data-import-runbook-backup-file]');
      const file = input && input.files && input.files[0];
      if (!file) { setBackupStatus('No backup file selected. Choose a JSON backup file first.'); return; }
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const keys = parsed && parsed.keys && typeof parsed.keys === 'object' ? parsed.keys : parsed;
        if (!keys || typeof keys !== 'object') throw new Error('Backup file does not contain a valid keys object.');
        const entries = Object.entries(keys).filter(([key]) => String(key).startsWith('runbook:'));
        if (!entries.length) throw new Error('No runbook: keys found in the selected file.');
        entries.forEach(([key, value]) => localStorage.setItem(key, String(value ?? '')));
        localStorage.setItem('runbook:meta:lastImportedBackupKeys', JSON.stringify(keys));
        const restoredCount = restoreWorkingCaseSlotsFromKeyMap(keys, { clearCurrent:true });
        localStorage.setItem('runbook:meta:lastImportedBackup', file.name);
        setBackupStatus(`Imported ${entries.length} runbook Local Storage keys from ${file.name}.\nRestored ${restoredCount} Working Case ticket(s) into the current Working Case Workspace.\nClick Reload Runbook, then open Working Case Workspace and check the Ticket buttons.`);
      } catch (err) {
        setBackupStatus(`Import failed. ${err && err.message ? err.message : err}`);
      }
    });
    contentEl.querySelector('[data-repair-working-case-import]')?.addEventListener('click', () => {
      let keys = {};
      try { keys = JSON.parse(localStorage.getItem('runbook:meta:lastImportedBackupKeys') || '{}'); } catch { keys = {}; }
      if (!keys || !Object.keys(keys).length) keys = buildRunbookKeyMapFromLocalStorage();
      const restoredCount = restoreWorkingCaseSlotsFromKeyMap(keys, { clearCurrent:true });
      setBackupStatus(`Repair / restore completed. Restored ${restoredCount} Working Case ticket(s).\nClick Reload Runbook, then open Working Case Workspace.`);
    });
    contentEl.querySelector('[data-reload-after-backup]')?.addEventListener('click', () => location.reload());
    contentEl.querySelector('[data-open-smart-search]')?.addEventListener('click', openGlobalSearch);
    contentEl.querySelector('[data-copy-page-link]')?.addEventListener('click', async () => {
      await copyPlainText(location.href);
    });
    contentEl.querySelector('[data-expand-all]')?.addEventListener('click', () => document.querySelectorAll('details').forEach(d => d.open = true));
    contentEl.querySelector('[data-collapse-all]')?.addEventListener('click', () => document.querySelectorAll('details').forEach(d => d.open = false));

    const timelineLog = contentEl.querySelector('[data-timeline-log]');
    const timelineStatus = contentEl.querySelector('[data-timeline-status]');
    if (timelineLog) {
      const key = sKey('tool','timeline','log');
      const saveTimeline = () => { saveText(key, timelineLog.value || ''); if (timelineStatus) timelineStatus.textContent = 'Saved locally.'; };
      timelineLog.addEventListener('input', saveTimeline);
      contentEl.querySelectorAll('[data-timeline-add]').forEach(btn => btn.addEventListener('click', () => {
        const stamp = new Date().toLocaleString('en-NZ', { hour12:false });
        timelineLog.value = cleanup(`${timelineLog.value || ''}\n${stamp} - ${btn.dataset.timelineAdd}`);
        saveTimeline(); autoResizeTextareas(contentEl);
      }));
      contentEl.querySelector('[data-copy-timeline]')?.addEventListener('click', async () => { await copyPlainText(timelineLog.value || ''); if (timelineStatus) timelineStatus.textContent = 'Copied timeline.'; });
      contentEl.querySelector('[data-clear-timeline]')?.addEventListener('click', () => { timelineLog.value = ''; saveTimeline(); autoResizeTextareas(contentEl); });
    }


    contentEl.querySelector('[data-add-personal-note]')?.addEventListener('click', () => {
      const titleEl = contentEl.querySelector('[data-personal-note-title]');
      const categoryEl = contentEl.querySelector('[data-personal-note-category]');
      const bodyEl = contentEl.querySelector('[data-personal-note-body]');
      const title = cleanup(titleEl?.value || '');
      const category = cleanup(categoryEl?.value || '');
      const body = cleanup(bodyEl?.value || '');
      if (!title && !body) return;
      const entries = getPersonalNotes();
      entries.unshift({ title: title || 'Untitled Note', category, body, savedAt: new Date().toLocaleString('en-NZ', { hour12:false }) });
      savePersonalNotes(entries.slice(0, 200));
      renderPage(pageId);
    });

    contentEl.querySelectorAll('[data-copy-personal-note]').forEach(btn => btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.copyPersonalNote);
      const entries = getPersonalNotes();
      const note = entries[idx];
      if (!note) return;
      const text = cleanup([note.title, note.category ? `Category: ${note.category}` : '', note.body].filter(Boolean).join('\n\n'));
      await copyPlainText(text);
    }));

    contentEl.querySelectorAll('[data-delete-personal-note]').forEach(btn => btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.deletePersonalNote);
      const entries = getPersonalNotes();
      entries.splice(idx, 1);
      savePersonalNotes(entries);
      renderPage(pageId);
    }));

    const evidenceChecks = contentEl.querySelectorAll('[data-evidence-check]');
    if (evidenceChecks.length) {
      const key = sKey('tool','evidenceChecklist');
      const saveChecks = () => {
        const state = {};
        evidenceChecks.forEach(cb => state[cb.dataset.evidenceCheck] = cb.checked);
        saveJson(key, state);
      };
      evidenceChecks.forEach(cb => cb.addEventListener('change', saveChecks));
      contentEl.querySelector('[data-reset-evidence-checklist]')?.addEventListener('click', () => { evidenceChecks.forEach(cb => cb.checked = false); saveChecks(); });
    }
  }

  function bindSavedRowsTool(listSelector, key, fallbackRows, prefix, statusSelector, addSelector, copySelector, resetSelector, resetText){
    const list = contentEl.querySelector(listSelector);
    if (!list) return;

    const status = contentEl.querySelector(statusSelector);
    let rows = normaliseLocalRows(loadJson(key, fallbackRows), fallbackRows);

    const saveFromDom = () => {
      rows = Array.from(list.querySelectorAll('.local-info-row')).map((row, i) => ({
        title: row.querySelector(`[data-${prefix}-title="${i}"]`)?.value || '',
        details: row.querySelector(`[data-${prefix}-details="${i}"]`)?.value || ''
      }));
      saveJson(key, rows);
      if (status) status.textContent = 'Saved locally.';
    };

    const render = () => {
      renderEditableRows(list, rows, prefix);
      list.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', saveFromDom));
      list.querySelectorAll(`[data-${prefix}-remove]`).forEach(btn => btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute(`data-${prefix}-remove`));
        rows.splice(idx, 1);
        if (!rows.length) rows = [{ title: '', details: '' }];
        saveJson(key, rows);
        render();
      }));
      autoResizeTextareas(list);
    };

    render();

    contentEl.querySelector(addSelector)?.addEventListener('click', () => {
      rows.push({ title: '', details: '' });
      saveJson(key, rows);
      render();
    });

    contentEl.querySelector(copySelector)?.addEventListener('click', async () => {
      saveFromDom();
      const text = rows.map(r => [r.title, r.details].filter(Boolean).join('\\n')).filter(Boolean).join('\\n\\n');
      await copyPlainText(text);
      if (status) status.textContent = 'Copied.';
    });

    contentEl.querySelector(resetSelector)?.addEventListener('click', () => {
      rows = fallbackRows.map(x => Object.assign({}, x));
      saveJson(key, rows);
      render();
      if (status) status.textContent = resetText || 'Reset.';
    });
  }


  

  function normaliseSimpleNoteRows(rows){
    if (!Array.isArray(rows) || !rows.length) return [{ subject: '', note: '' }];
    return rows.map(r => ({ subject: r.subject || r.title || '', note: r.note || r.notes || '' }));
  }

  function renderSimpleNoteRows(container, rows, prefix){
    container.innerHTML = rows.map((row,i)=>{
      const tier2MoveButtons = prefix === 'tier2note'
        ? `<button class="smallbtn" type="button" data-tier2-move-active="${i}">Move to Current Active case</button><button class="smallbtn" type="button" data-tier2-move-park="${i}">Move to Park / Working on cases</button>`
        : '';
      return `<details class="local-compact-row"><summary><span>${esc(row.subject || (prefix === 'tier2note' ? 'Tier 2 case' : 'Note'))}</span><span class="muted">Click to expand</span></summary><div class="compact-grid"><div class="compact-field"><label>Subject</label><div class="copy-field-row"><input data-${prefix}-subject="${i}" value="${esc(row.subject||'')}" placeholder="Subject"><button class="smallbtn" type="button" data-copy-simple-note="${prefix}-subject-${i}">Copy</button></div></div><div class="compact-field full"><label>Note</label><div class="copy-field-row"><textarea data-${prefix}-note="${i}" placeholder="Note...">${esc(row.note||'')}</textarea><button class="smallbtn" type="button" data-copy-simple-note="${prefix}-note-${i}">Copy</button></div></div></div><div class="btnrow">${tier2MoveButtons}<button class="smallbtn" type="button" data-${prefix}-remove="${i}">Remove Entry</button></div></details>`;
    }).join('');
  }

  function extractTrackingSection(text, heading){
    const raw = String(text || '');
    const safeHeading = String(heading || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('(?:^|\\n)' + safeHeading + ':?\\s*\\n([\\s\\S]*?)(?=\\n[A-Za-z][A-Za-z /]+:?\\n|$)', 'i');
    const match = raw.match(re);
    return cleanup(match ? match[1] : '');
  }


  function getTrackingLine(text, label){
    const raw = String(text || '');
    const safe = String(label || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('^\\s*' + safe + '\\s*:\\s*(.*)$', 'i');
    const line = raw.split(/\r?\n/).find(l => re.test(l));
    const m = line ? line.match(re) : null;
    return cleanup(m ? m[1] : '');
  }

  function tier2TrackingRowToWorkingValues(row){
    const note = String(row && row.note || '');
    const subject = cleanup(getTrackingLine(note, 'Subject') || (row && row.subject) || '');
    const caseNo = cleanup(getTrackingLine(note, 'Case Number') || getTrackingLine(note, 'Case') || '');
    const school = cleanup(getTrackingLine(note, 'School') || getTrackingLine(note, 'Account Name') || '');
    const status = cleanup(extractTrackingSection(note, 'Current Status') || getTrackingLine(note, 'Current Status'));
    const evidence = cleanup(extractTrackingSection(note, 'Evidence / Checks') || extractTrackingSection(note, 'Evidence'));
    const reason = cleanup(extractTrackingSection(note, 'Escalation Reason'));
    const followUp = cleanup(extractTrackingSection(note, 'Follow-up Notes') || extractTrackingSection(note, 'Notes'));
    return withAliases({
      ticket_number: caseNo.replace(/^#/, ''),
      case_number: caseNo.replace(/^#/, ''),
      school_name: school,
      account_name: school,
      subject,
      latest_update: cleanup([status, followUp].filter(Boolean).join('\n')),
      issue_details: reason,
      cli_findings: evidence,
      evidence,
      resolution_or_next_step: status || followUp,
      final_output: cleanup(note)
    });
  }

  function isMeaningfulWorkingValues(values){
    values = withAliases(values || {});
    return !!cleanup([
      values.ticket_number, values.case_number, values.school_name, values.account_name,
      values.subject, values.latest_update, values.issue_details, values.cli_findings,
      values.evidence, values.final_output
    ].filter(Boolean).join(' '));
  }

  function findWorkingCaseSlotForValues(values, slotCount=100){
    const pageId = 'case-working-template';
    const formKey = 'workingCase';
    const incomingCase = cleanup((values && (values.ticket_number || values.case_number)) || '').replace(/^#/, '');
    let firstEmpty = 0;
    for (let n = 1; n <= slotCount; n++) {
      const existing = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
      const existingCase = cleanup(existing.ticket_number || existing.case_number || '').replace(/^#/, '');
      const hasExisting = hasMeaningfulTicketData(pageId, formKey, n);
      if (incomingCase && existingCase && existingCase === incomingCase) return n;
      if (!hasExisting && !firstEmpty) firstEmpty = n;
    }
    return firstEmpty;
  }

  function moveTier2TrackingRowToWorkingCase(row, makeActive){
    const pageId = 'case-working-template';
    const formKey = 'workingCase';
    const values = tier2TrackingRowToWorkingValues(row);
    if (!isMeaningfulWorkingValues(values)) return { ok:false, message:'Nothing to move. Add a case number, school, subject, or note first.' };
    const slotNo = findWorkingCaseSlotForValues(values, 100);
    if (!slotNo) return { ok:false, message:'No empty Working Case slots available.' };
    const existing = withAliases(loadJson(sKey(pageId, formKey, 'slot', slotNo), {}));
    saveJson(sKey(pageId, formKey, 'slot', slotNo), Object.assign({}, existing, values));
    saveJson(sKey(pageId, formKey, 'slot', slotNo, 'outputs'), { working: cleanup(values.final_output || '') });
    if (makeActive) {
      setActiveWorkingSlot(pageId, formKey, slotNo);
    } else if (getActiveWorkingSlot(pageId, formKey, 100) === slotNo) {
      setActiveWorkingSlot(pageId, formKey, 0);
    }
    return { ok:true, slotNo, label: slotNo ? `Ticket ${slotNo}` : 'ticket' };
  }

  function addTier2EscalationCaseRecord(values){
    values = withAliases(values || {});
    const caseNo = cleanup(values.ticket_number || values.case_number || '');
    const school = cleanup(values.school_name || values.account_name || '');
    const subject = cleanup(values.subject || values.reason || values.issue_summary || values.issue_details || '');
    if (!caseNo && !subject && !school) return;

    const reason = cleanup(values.reason || values.escalation_reason || values.issue_summary || values.final_output || values.salesforce_note || values.resolution_or_next_step || '');
    const evidence = cleanup(values.evidence || values.evidence_collected || values.findings_cli_results || values.cli_findings || values.cli_evidence || '');
    const checks = cleanup(values.troubleshooting_summary || values.checks_done || values.troubleshooting || values.troubleshooting_performed || values.steps_taken || '');
    const status = cleanup(values.current_status || values.status || 'Escalated to Tier 2');

    const key = sKey('tier2EscalationCasesV1','rows');
    const rows = normaliseSimpleNoteRows(loadJson(key, [])).filter(r => cleanup(r.subject || r.note || ''));
    const idx = rows.findIndex(r => {
      const note = String(r.note || '');
      const existingCase = cleanup((note.match(/Case Number:\s*(.*)/i) || [,''])[1]);
      const existingSubject = cleanup(r.subject || '');
      return (caseNo && (existingCase === caseNo || note.includes(caseNo))) ||
             (!caseNo && subject && existingSubject.toLowerCase() === subject.toLowerCase());
    });

    const previous = idx >= 0 ? rows[idx] : { subject: subject || caseNo || 'Tier 2 case', note: '' };
    const previousNote = previous.note || '';
    const previousOutcome = extractTrackingSection(previousNote, 'Outcome');
    const previousFollowUp = extractTrackingSection(previousNote, 'Follow-up Notes') || extractTrackingSection(previousNote, 'Notes');

    const note = cleanup([
      caseNo ? `Case Number: ${caseNo}` : '',
      school ? `School: ${school}` : '',
      subject ? `Subject: ${subject}` : '',
      `Escalated Date: ${new Date().toLocaleString('en-NZ', { hour12:false })}`,
      '',
      'Escalation Reason:',
      reason || 'To be updated.',
      '',
      'Evidence / Checks:',
      cleanup([evidence, checks].filter(Boolean).join('\n')) || 'To be updated.',
      '',
      'Current Status:',
      status || 'Escalated to Tier 2',
      '',
      'Outcome:',
      previousOutcome || '',
      '',
      'Follow-up Notes:',
      previousFollowUp || ''
    ].join('\n'));

    const row = { subject: subject || previous.subject || caseNo || 'Tier 2 case', note };
    if (idx >= 0) rows.splice(idx, 1, row);
    else rows.unshift(row);
    saveJson(key, rows);
  }


  function renderArchivedWorkingCasesTool(pageId){
    const rows = loadJson(sKey('archivedWorkingCasesV1','rows'), []);
    if (!rows.length) return `<div class="notice">No archived working cases yet. Use Case Knowledgebase from the bottom of the Working Case Workspace when a case is finished.</div>`;
    return `<div class="step"><div class="step-title">Archived Working Cases</div><div class="muted">Cases archived from Working Case Workspace. Newest records show first.</div>${rows.map((row, idx) => {
      const body = cleanup([
        makeSection('Case Number', row.caseNumber),
        makeSection('School', row.schoolName),
        makeSection('Subject', row.subject),
        makeSection('Contact', row.contactName),
        makeSection('Email', row.contactEmail),
        makeSection('Archived Date', row.archivedAt),
        makeSection('Latest Update', row.latestUpdate),
        makeSection('Salesforce Note / Outcome Summary', row.note),
        makeSection('Checks Completed / Findings / CLI Results', row.findings)
      ].filter(Boolean).join('\n'));
      return `<details class="case-card"><summary>${esc(row.title || row.subject || 'Archived case')}<span class="case-card-meta">${esc(row.archivedAt || '')}</span></summary><div class="case-card-body"><div class="btnrow"><button class="btn secondary" type="button" data-copy-archived-case="${idx}">Copy</button><button class="btn secondary" type="button" data-delete-archived-case="${idx}">Delete</button></div><div class="output-area" data-archived-case-body="${idx}" data-raw-output="${esc(body)}">${formatOutputHTML(body)}</div></div></details>`;
    }).join('')}<div class="tool-status" data-archived-cases-status>Saved locally.</div></div>`;
  }
  function renderTier2EscalationCasesTool(pageId){
    return `<div class="step"><div class="step-title">Tier 2 Escalation Cases</div><div class="muted">Autosaves a record of cases sent to the Tier 2 template. You can also edit or add entries manually.</div><div data-tier2-note-list></div><div class="btnrow"><button class="btn" type="button" data-add-tier2-note>Add Case Note</button><button class="btn secondary" type="button" data-save-tier2-notes>Autosaved</button></div><div class="tool-status" data-tier2-notes-status>Saved locally.</div></div>`;
  }

  function renderJustNotesTool(pageId){
    return `<div class="step"><div class="step-title">Just Notes</div><div class="muted">Simple editable notes. Fields: Subject and Note. Autosaves locally.</div><div data-just-note-list></div><div class="btnrow"><button class="btn" type="button" data-add-just-note>Add Note</button><button class="btn secondary" type="button" data-save-just-notes>Autosaved</button></div><div class="tool-status" data-just-notes-status>Saved locally.</div></div>`;
  }

  function bindSimpleNotesTool(listSelector, keyName, prefix, addSelector, saveSelector, statusSelector){
    const list = contentEl.querySelector(listSelector);
    if (!list) return;
    const key = sKey(keyName,'rows');
    const status = contentEl.querySelector(statusSelector);
    let rows = normaliseSimpleNoteRows(loadJson(key, [{ subject: '', note: '' }]));
    const save = () => {
      rows = Array.from(list.querySelectorAll('.local-compact-row')).map((row,i)=>({
        subject: row.querySelector(`[data-${prefix}-subject="${i}"]`)?.value || '',
        note: row.querySelector(`[data-${prefix}-note="${i}"]`)?.value || ''
      }));
      if (!rows.length) rows = [{ subject: '', note: '' }];
      saveJson(key, rows);
      if (status) status.textContent = 'Saved locally.';
    };
    const render = () => {
      renderSimpleNoteRows(list, rows, prefix);
      list.querySelectorAll('input, textarea').forEach(el=>el.addEventListener('input',()=>{ save(); autoResizeTextareas(list); }));
      list.querySelectorAll(`[data-${prefix}-remove]`).forEach(btn=>btn.addEventListener('click',()=>{ rows.splice(Number(btn.dataset[`${prefix}Remove`]),1); if(!rows.length) rows=[{subject:'',note:''}]; saveJson(key,rows); render(); }));
      if (prefix === 'tier2note') {
        const moveTier2Row = (idx, makeActive) => {
          save();
          const row = rows[idx];
          const result = moveTier2TrackingRowToWorkingCase(row, makeActive);
          if (!result.ok) { if (status) status.textContent = result.message; return; }
          rows.splice(idx, 1);
          if (!rows.length) rows = [{ subject:'', note:'' }];
          saveJson(key, rows);
          if (status) status.textContent = makeActive
            ? `Moved ${result.label} to Current Active case and removed it from Tier 2 Escalation Cases.`
            : `Moved ${result.label} to Park / Working on cases and removed it from Tier 2 Escalation Cases.`;
          render();
        };
        list.querySelectorAll('[data-tier2-move-active]').forEach(btn=>btn.addEventListener('click',()=>moveTier2Row(Number(btn.dataset.tier2MoveActive), true)));
        list.querySelectorAll('[data-tier2-move-park]').forEach(btn=>btn.addEventListener('click',()=>moveTier2Row(Number(btn.dataset.tier2MovePark), false)));
      }
      list.querySelectorAll('[data-copy-simple-note]').forEach(btn=>btn.addEventListener('click', async ()=>{
        const parts = (btn.dataset.copySimpleNote || '').split('-');
        const idx = parts.pop();
        const field = parts.pop();
        const pfx = parts.join('-');
        const el = list.querySelector(`[data-${pfx}-${field}="${idx}"]`);
        await copyPlainText(el ? el.value || '' : '');
        const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent=old,900);
      }));
      autoResizeTextareas(list);
    };
    render();
    contentEl.querySelector(addSelector)?.addEventListener('click',()=>{ rows.push({subject:'',note:''}); saveJson(key,rows); render(); });
    contentEl.querySelector(saveSelector)?.addEventListener('click',()=>{ save(); if(status) status.textContent='Saved / updated.'; });
  }

  const DEFAULT_RANDOM_CONTACTS = [{"title": "New Era IT", "phone": "0800 438 428", "email": "", "notes": ""}, {"title": "Spark", "phone": "0800 645 327", "email": "", "notes": ""}, {"title": "Assure direct line", "phone": "0800105352", "email": "", "notes": ""}, {"title": "Allied Telesis (direct ICT for firmware)", "phone": "0800114 141", "email": "", "notes": ""}, {"title": "Ministry of education", "phone": "0800225542", "email": "", "notes": ""}, {"title": "N4L", "phone": "0800 532 764", "email": "support@n4l.co.nz", "notes": ""}, {"title": "Invoices", "phone": "", "email": "accountspayable@n4l.co.nz", "notes": ""}, {"title": "Ministry", "phone": "09 610 8889", "email": "educationservicedesk@n4l.co.nz", "notes": ""}, {"title": "Vonage", "phone": "", "email": "", "notes": "24/7 Customer Support\nUK: 08003161317\nEurope: +442077608888\nFrance: +33170377180\nUSA: +18558006342\nAus: 1800456143 or +611800444686\nSingapore: +6531583285\nNew Zealand: +6498873826 or 0800001254"}];
  const DEFAULT_SSH_LOGIN_DETAILS = [{"title":"SSH command","username":"","password":"","host":"","notes":""},{"title":"For APs","username":"","password":"","host":"","notes":""},{"title":"ER controller","username":"","password":"","host":"","notes":""},{"title":"Admin Account","username":"","password":"","host":"","notes":""},{"title":"Palo Read-Only","username":"","password":"","host":"","notes":""}];

  function normaliseSshRows(rows){
    if (!Array.isArray(rows) || !rows.length) return DEFAULT_SSH_LOGIN_DETAILS.map(x => Object.assign({}, x));
    return rows.map(r => ({title:r.title||'', username:r.username||'', password:r.password||'', host:r.host||'', notes:r.notes||r.details||''}));
  }
  function normaliseContactRows(rows){
    if (!Array.isArray(rows) || !rows.length) return DEFAULT_RANDOM_CONTACTS.map(x => Object.assign({}, x));
    return rows.map(r => ({title:r.title||r.company||'', phone:r.phone||'', email:r.email||'', notes:r.notes||r.details||''}));
  }

  function renderCaseUpdateBuilderTool(pageId){
    const prevKey = sKey('caseUpdateBuilderV1','previousNotes');
    const latestKey = sKey('caseUpdateBuilderV1','latestUpdate');
    const evidenceKey = sKey('caseUpdateBuilderV1','evidence');
    const nextKey = sKey('caseUpdateBuilderV1','nextStep');
    const includeKey = sKey('caseUpdateBuilderV1','includePrevious');
    const outputKey = sKey('caseUpdateBuilderV1','output');
    const includePrevious = loadText(includeKey, '') === 'yes';
    return `<div class="step case-update-builder"><div class="step-title">Case Update Builder</div>
      <div class="muted">Paste previous notes for context, then write only the newest update. The generated output stays clean and only includes fields with data.</div>
      <div class="form">
        <label>Previous case notes / history</label>
        <textarea class="no-autoexpand" data-case-update-prev placeholder="Paste older Salesforce notes here. This is reference only unless you turn on Include Previous Notes.">${esc(loadText(prevKey, ''))}</textarea>
        <label>Latest update</label>
        <textarea data-case-update-latest placeholder="What changed today? Example: School confirmed APs are still offline after power outage.">${esc(loadText(latestKey, ''))}</textarea>
        <label>Evidence collected</label>
        <textarea data-case-update-evidence placeholder="New evidence only. Example: APs are receiving the wrong IP address.">${esc(loadText(evidenceKey, ''))}</textarea>
        <label>Next step</label>
        <textarea data-case-update-next placeholder="Optional. Example: Checking DHCP/VLAN path before escalating to Tier 2.">${esc(loadText(nextKey, ''))}</textarea>
        <div class="btnrow">
          <button class="btn" type="button" data-case-update-generate>Generate Update</button>
          <button class="btn secondary" type="button" data-case-update-toggle-prev data-enabled="${includePrevious ? 'yes' : 'no'}">${includePrevious ? 'Previous Notes: Included' : 'Include Previous Notes'}</button>
          <button class="btn secondary" type="button" data-case-update-clear-latest>Clear Latest Update</button>
          <button class="btn secondary" type="button" data-case-update-clear-all>Clear All</button>
        </div>
        <input type="hidden" data-case-update-include-prev value="${includePrevious ? 'yes' : ''}">
        <div class="statusline" data-case-update-status>Saved locally.</div>
        <div class="muted" style="margin-top:14px;font-weight:700;">Generated update output</div>
        <div class="output-card case-update-output-card"><div class="output-head"><span>Latest Update</span><button class="btn secondary small-copy" type="button" data-case-update-copy-head>Copy</button></div><div class="output-area" data-case-update-output></div></div>
      </div>
    </div>`;
  }

  function buildCaseUpdateOutput(values){
    const includePrevious = !!values.includePrevious;
    return cleanup([
      includePrevious ? makeSection('Previous Case Notes', values.previousNotes) : '',
      makeSection('Latest Update', values.latestUpdate),
      makeSection('Evidence Collected', values.evidence),
      makeSection('Next Step', values.nextStep)
    ].filter(Boolean).join('\n'));
  }

  function bindCaseUpdateBuilderTool(){
    const root = contentEl.querySelector('.case-update-builder');
    if (!root) return;
    const prevKey = sKey('caseUpdateBuilderV1','previousNotes');
    const latestKey = sKey('caseUpdateBuilderV1','latestUpdate');
    const evidenceKey = sKey('caseUpdateBuilderV1','evidence');
    const nextKey = sKey('caseUpdateBuilderV1','nextStep');
    const includeKey = sKey('caseUpdateBuilderV1','includePrevious');
    const outputKey = sKey('caseUpdateBuilderV1','output');
    const prev = root.querySelector('[data-case-update-prev]');
    const latest = root.querySelector('[data-case-update-latest]');
    const evidence = root.querySelector('[data-case-update-evidence]');
    const next = root.querySelector('[data-case-update-next]');
    const include = root.querySelector('[data-case-update-include-prev]');
    const includeBtn = root.querySelector('[data-case-update-toggle-prev]');
    const out = root.querySelector('[data-case-update-output]');
    const status = root.querySelector('[data-case-update-status]');
    const saveInputs = () => {
      saveText(prevKey, prev?.value || '');
      saveText(latestKey, latest?.value || '');
      saveText(evidenceKey, evidence?.value || '');
      saveText(nextKey, next?.value || '');
      saveText(includeKey, include?.value === 'yes' ? 'yes' : '');
      if (status) status.textContent = 'Saved locally.';
    };
    const collect = () => ({
      previousNotes: prev?.value || '',
      latestUpdate: latest?.value || '',
      evidence: evidence?.value || '',
      nextStep: next?.value || '',
      includePrevious: include?.value === 'yes'
    });
    const generate = () => {
      saveInputs();
      const output = buildCaseUpdateOutput(collect());
      saveText(outputKey, output);
      renderOutputArea(out, output);
      if (status) status.textContent = output ? 'Generated latest update.' : 'Nothing to generate. Add latest update, evidence, next step, or include previous notes.';
      return output;
    };
    [prev, latest, evidence, next].forEach(el => el && el.addEventListener('input', () => { saveInputs(); autoResizeTextareas(root); }));
    includeBtn?.addEventListener('click', () => {
      const enabled = include?.value === 'yes';
      if (include) include.value = enabled ? '' : 'yes';
      includeBtn.textContent = enabled ? 'Include Previous Notes' : 'Previous Notes: Included';
      includeBtn.dataset.enabled = enabled ? 'no' : 'yes';
      saveInputs();
    });
    root.querySelector('[data-case-update-generate]')?.addEventListener('click', generate);
    const copy = async () => {
      const text = (out?.dataset.rawOutput || '') || generate();
      await copyPlainText(text);
      if (status) status.textContent = 'Copied latest update.';
    };
    root.querySelector('[data-case-update-copy-head]')?.addEventListener('click', copy);
    root.querySelector('[data-case-update-clear-latest]')?.addEventListener('click', () => {
      if (latest) latest.value = '';
      if (evidence) evidence.value = '';
      if (next) next.value = '';
      saveInputs();
      saveText(outputKey, '');
      renderOutputArea(out, '');
      if (status) status.textContent = 'Cleared latest update fields.';
      autoResizeTextareas(root);
    });
    root.querySelector('[data-case-update-clear-all]')?.addEventListener('click', () => {
      [prev, latest, evidence, next].forEach(el => { if (el) el.value = ''; });
      if (include) include.value = '';
      if (includeBtn) { includeBtn.textContent = 'Include Previous Notes'; includeBtn.dataset.enabled = 'no'; }
      saveInputs();
      saveText(outputKey, '');
      renderOutputArea(out, '');
      if (status) status.textContent = 'Cleared all case update fields.';
      autoResizeTextareas(root);
    });
    renderOutputArea(out, loadText(outputKey, ''));
    autoResizeTextareas(root);
  }

  function renderSshLoginDetailsTool(pageId){
    return `<div class="step"><div class="step-title">SSH login details</div><div class="muted">Compact expandable SSH details. Entries are saved in this browser. Do not store passwords here; use the approved password manager.</div><div data-ssh-login-list></div><div class="btnrow"><button class="btn" type="button" data-add-ssh-login>Add Entry</button><button class="btn secondary" type="button" data-reset-ssh-login>Reset to Defaults</button></div><div class="tool-status" data-ssh-login-status>Saved locally.</div></div>`;
  }
  function renderRandomContactsInfoTool(pageId){
    return `<div class="step"><div class="step-title">Random Contact Numbers</div><div class="muted">Compact expandable contact list. Each phone, email, and notes field can be copied separately and saves locally.</div><div data-random-contacts-list></div><div class="btnrow"><button class="btn" type="button" data-add-random-contact>Add Contact</button><button class="btn secondary" type="button" data-reset-random-contacts>Save / Update</button></div><div class="tool-status" data-random-contacts-status>Saved locally.</div></div>`;
  }
  function renderSshRows(container, rows){
    container.innerHTML = rows.map((row,i)=>`<details class="local-compact-row" ><summary><span>${esc(row.title||'SSH entry')}</span><span class="muted">Click to expand</span></summary><div class="compact-grid"><div class="compact-field full"><label>Title</label><input data-ssh-title="${i}" value="${esc(row.title||'')}" placeholder="Title"></div><div class="compact-field"><label>Username</label><div class="copy-field-row"><input data-ssh-username="${i}" value="${esc(row.username||'')}" placeholder="Username"><button class="smallbtn" type="button" data-copy-field="ssh-username-${i}">Copy</button></div></div><div class="compact-field"><label>Password</label><div class="copy-field-row"><input type="password" data-ssh-password="${i}" value="${esc(row.password||'')}" placeholder="Password"><button class="smallbtn" type="button" data-copy-field="ssh-password-${i}">Copy</button></div></div><div class="compact-field"><label>Host / IP</label><div class="copy-field-row"><input data-ssh-host="${i}" value="${esc(row.host||'')}" placeholder="Host / IP"><button class="smallbtn" type="button" data-copy-field="ssh-host-${i}">Copy</button></div></div><div class="compact-field full"><label>Notes / SSH command</label><div class="copy-field-row"><textarea data-ssh-notes="${i}" placeholder="Notes / SSH command...">${esc(row.notes||'')}</textarea><button class="smallbtn" type="button" data-update-ssh-command="${i}">Update</button><button class="smallbtn" type="button" data-copy-field="ssh-notes-${i}">Copy</button></div></div></div><div class="btnrow"><button class="smallbtn" type="button" data-pin-live-ssh-section="${i}">Pin whole SSH section to Workspace</button><button class="smallbtn" type="button" data-ssh-remove="${i}">Remove Entry</button></div></details>`).join('');
  }
  function renderContactRows(container, rows){
    container.innerHTML = rows.map((row,i)=>`<details class="local-compact-row" ><summary><span>${esc(row.title||'Contact')}</span><span class="muted">Click to expand</span></summary><div class="compact-grid"><div class="compact-field full"><label>Company / Contact</label><input data-contact-title="${i}" value="${esc(row.title||'')}" placeholder="Company / Contact"></div><div class="compact-field"><label>Phone</label><div class="copy-field-row"><input data-contact-phone="${i}" value="${esc(row.phone||'')}" placeholder="Phone"><button class="smallbtn" type="button" data-copy-field="contact-phone-${i}">Copy</button></div></div><div class="compact-field"><label>Email</label><div class="copy-field-row"><input data-contact-email="${i}" value="${esc(row.email||'')}" placeholder="Email"><button class="smallbtn" type="button" data-copy-field="contact-email-${i}">Copy</button></div></div><div class="compact-field full"><label>Notes</label><div class="copy-field-row"><textarea data-contact-notes="${i}" placeholder="Notes...">${esc(row.notes||'')}</textarea><button class="smallbtn" type="button" data-copy-field="contact-notes-${i}">Copy</button></div></div></div><div class="btnrow"><button class="smallbtn" type="button" data-contact-remove="${i}">Remove Contact</button></div></details>`).join('');
  }
  function bindCompactCopyButtons(scope){
    scope.querySelectorAll('[data-copy-field]').forEach(btn => btn.addEventListener('click', async () => {
      const parts = (btn.dataset.copyField||'').split('-');
      const prefix = parts[0], field = parts[1], idx = parts[2];
      const selector = prefix === 'ssh' ? `[data-ssh-${field}="${idx}"]` : `[data-contact-${field}="${idx}"]`;
      const el = scope.querySelector(selector);
      await copyPlainText(el ? el.value || '' : '');
      const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent=old, 900);
    }));
    scope.querySelectorAll('[data-pin-live-ssh-section]').forEach(btn => btn.addEventListener('click', () => {
      const idx = btn.dataset.pinLiveSshSection;
      const title = scope.querySelector(`[data-ssh-title="${idx}"]`)?.value || 'SSH command';
      const username = scope.querySelector(`[data-ssh-username="${idx}"]`)?.value || '';
      const password = scope.querySelector(`[data-ssh-password="${idx}"]`)?.value || '';
      const host = scope.querySelector(`[data-ssh-host="${idx}"]`)?.value || '';
      const notes = scope.querySelector(`[data-ssh-notes="${idx}"]`)?.value || '';
      pinLiveWorkspaceSection({type:'ssh', title, username, password, host, commands:notes});
      const old = btn.textContent; btn.textContent = 'Pinned'; setTimeout(()=>btn.textContent=old, 900);
    }));
  }
  function bindCustomLocalInfoTools(){
    const archivedKey = sKey('archivedWorkingCasesV1','rows');
    contentEl.querySelectorAll('[data-copy-archived-case]').forEach(btn => btn.addEventListener('click', async () => {
      const idx = Number(btn.dataset.copyArchivedCase);
      const txt = contentEl.querySelector(`[data-archived-case-body="${idx}"]`)?.dataset.rawOutput || '';
      await copyPlainText(txt);
      const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(()=>btn.textContent = old || 'Copy', 900);
    }));
    contentEl.querySelectorAll('[data-delete-archived-case]').forEach(btn => btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.deleteArchivedCase);
      const rows = loadJson(archivedKey, []);
      rows.splice(idx, 1);
      saveJson(archivedKey, rows);
      renderPage(pageId);
    }));
    bindSimpleNotesTool('[data-tier2-note-list]', 'tier2EscalationCasesV1', 'tier2note', '[data-add-tier2-note]', '[data-save-tier2-notes]', '[data-tier2-notes-status]');
    bindSimpleNotesTool('[data-just-note-list]', 'justNotesV1', 'justnote', '[data-add-just-note]', '[data-save-just-notes]', '[data-just-notes-status]');
    const sshList = contentEl.querySelector('[data-ssh-login-list]');
    if (sshList) {
      const key = sKey('sshLoginDetailsV3','rows'); const status = contentEl.querySelector('[data-ssh-login-status]');
      let rows = normaliseSshRows(loadJson(key, DEFAULT_SSH_LOGIN_DETAILS));
      const save = () => { rows = Array.from(sshList.querySelectorAll('.local-compact-row')).map((row,i)=>({title:row.querySelector(`[data-ssh-title="${i}"]`)?.value||'', username:row.querySelector(`[data-ssh-username="${i}"]`)?.value||'', password:row.querySelector(`[data-ssh-password="${i}"]`)?.value||'', host:row.querySelector(`[data-ssh-host="${i}"]`)?.value||'', notes:row.querySelector(`[data-ssh-notes="${i}"]`)?.value||''})); saveJson(key, rows); if(status)status.textContent='Saved locally.'; };
      const render = () => { renderSshRows(sshList, rows); sshList.querySelectorAll('input, textarea').forEach(el=>el.addEventListener('input', save)); sshList.querySelectorAll('[data-ssh-remove]').forEach(btn=>btn.addEventListener('click',()=>{ rows.splice(Number(btn.dataset.sshRemove),1); if(!rows.length)rows=[{title:'',username:'',password:'',host:'',notes:''}]; saveJson(key,rows); render(); })); bindCompactCopyButtons(sshList);
        sshList.querySelectorAll('[data-update-ssh-command]').forEach(btn=>btn.addEventListener('click',()=>{
          const i = btn.dataset.updateSshCommand;
          const username = sshList.querySelector(`[data-ssh-username="${i}"]`)?.value || '';
          const host = sshList.querySelector(`[data-ssh-host="${i}"]`)?.value || '';
          const notes = sshList.querySelector(`[data-ssh-notes="${i}"]`);
          if (notes && username && host) {
            notes.value = `ssh -oHostKeyAlgorithms=+ssh-rsa -oKexAlgorithms=+diffie-hellman-group1-sha1 ${username}@${host}`;
            save();
            autoResizeTextareas(sshList);
            if(status)status.textContent='SSH command updated.';
          } else if(status) {
            status.textContent='Username and Host / IP are required to update command.';
          }
        }));
        autoResizeTextareas(sshList); };
      render();
      contentEl.querySelector('[data-add-ssh-login]')?.addEventListener('click',()=>{ rows.push({title:'',username:'',password:'',host:'',notes:''}); saveJson(key,rows); render(); });
      contentEl.querySelector('[data-reset-ssh-login]')?.addEventListener('click',()=>{ save(); if(status)status.textContent='Saved / updated.'; });
    }
    const contactList = contentEl.querySelector('[data-random-contacts-list]');
    if (contactList) {
      const key = sKey('randomContactsInfoV3','rows'); const status = contentEl.querySelector('[data-random-contacts-status]');
      let rows = normaliseContactRows(loadJson(key, DEFAULT_RANDOM_CONTACTS));
      const save = () => { rows = Array.from(contactList.querySelectorAll('.local-compact-row')).map((row,i)=>({title:row.querySelector(`[data-contact-title="${i}"]`)?.value||'', phone:row.querySelector(`[data-contact-phone="${i}"]`)?.value||'', email:row.querySelector(`[data-contact-email="${i}"]`)?.value||'', notes:row.querySelector(`[data-contact-notes="${i}"]`)?.value||''})); saveJson(key, rows); if(status)status.textContent='Saved locally.'; };
      const render = () => { renderContactRows(contactList, rows); contactList.querySelectorAll('input, textarea').forEach(el=>el.addEventListener('input', save)); contactList.querySelectorAll('[data-contact-remove]').forEach(btn=>btn.addEventListener('click',()=>{ rows.splice(Number(btn.dataset.contactRemove),1); if(!rows.length)rows=[{title:'',phone:'',email:'',notes:''}]; saveJson(key,rows); render(); })); bindCompactCopyButtons(contactList); autoResizeTextareas(contactList); };
      render();
      contentEl.querySelector('[data-add-random-contact]')?.addEventListener('click',()=>{ rows.push({title:'',phone:'',email:'',notes:''}); saveJson(key,rows); render(); });
      contentEl.querySelector('[data-reset-random-contacts]')?.addEventListener('click',()=>{ rows=DEFAULT_RANDOM_CONTACTS.map(x=>Object.assign({},x)); saveJson(key,rows); render(); if(status)status.textContent='Save / Update.'; });
    }
  }

function collectFields(root){
    const values = {};
    root.querySelectorAll('[data-field]').forEach(el => values[el.dataset.field] = (el.value || '').trim());
    return withAliases(values);
  }

  function updateCollapsibleIndicators(root){
    (root || document).querySelectorAll('details.collapsible-field').forEach(details => {
      const textarea = details.querySelector('textarea[data-field]');
      const hasContent = !!cleanup(textarea ? textarea.value : '');
      details.classList.toggle('has-value', hasContent);
      details.classList.toggle('is-empty', !hasContent);
      const state = details.querySelector('.collapsible-state');
      if (state) state.textContent = details.open ? 'Open - scroll inside field' : 'Click to expand';
    });
  }

  function setFields(root, values){
    root.querySelectorAll('[data-field]').forEach(el => { el.value = values[el.dataset.field] || ''; });
    updateCollapsibleIndicators(root);
    autoResizeTextareas(root);
  }

  function autoResizeTextareas(scope){
    (scope || document).querySelectorAll('textarea:not(.no-autoexpand)').forEach(ta => {
      ta.style.height = 'auto';
      ta.style.height = Math.max(ta.scrollHeight, 92) + 'px';
    });
  }

  function mergeToTarget(targetId, values, sourcePageId=''){
    if (!targetId) return;
    values = normaliseCaseTransferValues(withAliases(values));

    const targetMap = {
      'case-working-template': { formKey:'workingCase', slotCount:100 }
    };

    const targetStateMap = {
      'email-new':'email-new',
      'email-resolved':'email-resolved',
      'email-followup':'email-followup',
      'email-followup2':'email-followup2',
      'email-resolved5':'email-resolved5',
      'email-whitelisted':'email-whitelisted',
      'email-blocked':'email-blocked',
      'email-google-sites-blocking':'email-google-sites-blocking',
      'template-mn3-truck-roll':'mn3-truck-roll',
      'template-p2-googlechat':'p2googlechat',
      'template-internet-speed':'internet-speed'
    };

    const transferValues = Object.assign({}, values, {
      to_name: values.to_name || values.contact_name || '',
      custom_value: '',
      issue_summary: values.issue_summary || values.final_output || values.working_notes || values.salesforce_notes || values.ai_synopsis || values.subject || '',
      steps_taken: values.steps_taken || values.final_output || values.working_notes || values.salesforce_notes || values.ai_troubleshooting || values.cli_evidence || '',
      next_steps: values.next_steps || values.my_next_checks || values.resolution_or_next_step || '',
      cli_findings: values.cli_findings || values.evidence || values.cli_evidence || '',
      reason: values.reason || values.subject || values.issue_details || '',
      evidence: values.evidence || values.cli_evidence || '',
      best_technical_contact: values.best_technical_contact || values.contact_name || '',
      policy_name: values.policy_name || '',
      network_version: values.network_version || ''
    });

    if (targetMap[targetId]) {
      const target = targetMap[targetId];

      for (let n=1; n<=target.slotCount; n++) {
        const key = sKey(targetId, target.formKey, 'slot', n);
        const existing = withAliases(loadJson(key, {}));

        if (!cleanup(existing.ticket_number || '') && !cleanup(existing.subject || '') && !cleanup(existing.school_name || '')) {
          saveJson(key, Object.assign({}, existing, transferValues));
          if (targetId === 'case-working-template') {
            localStorage.setItem('runbook:case-working-template:workingCase:active-slot', String(n));
          }
          location.hash = '#' + targetId;
          return;
        }
      }

      saveJson(sKey(targetId, target.formKey, 'slot', target.slotCount), Object.assign({}, transferValues));
      if (targetId === 'case-working-template') {
        localStorage.setItem('runbook:case-working-template:workingCase:active-slot', String(target.slotCount));
      }
      location.hash = '#' + targetId;
      return;
    }

    const evidenceText = [values.faz_check, values.evidence, values.error_message].filter(Boolean).join('\n');

    if (targetStateMap[targetId]) {
      const formKey = targetStateMap[targetId];
      const existing = loadJson(sKey(targetId, formKey, 'state'), {});
      const isEmailTarget = /^email-/.test(targetId);
      if (isEmailTarget) {
        saveJson(sKey(targetId, formKey, 'state'), Object.assign({}, existing, {
          to_name: transferValues.to_name || '',
          ticket_number: transferValues.ticket_number || '',
          school_name: transferValues.school_name || '',
          custom_value: ''
        }));
      } else {
        saveJson(sKey(targetId, formKey, 'state'), Object.assign({}, existing, transferValues));
      }
      location.hash = '#' + targetId;
      return;
    }

    if (targetId === 'template-tier2') {
      const existing = loadJson(sKey(targetId, 'tier2', 'state'), {});
      const merged = Object.assign({}, existing, {
        ticket_number: values.ticket_number || existing.ticket_number || '',
        subject: values.subject || existing.subject || '',
        moe_id: values.moe_id || existing.moe_id || '',
        firewall_id: values.firewall_id || values.moe_firewall || values.firewall_moe || existing.firewall_id || existing.moe_firewall || '',
        moe_firewall: values.firewall_id || values.moe_firewall || values.firewall_moe || existing.moe_firewall || existing.firewall_id || '',
        school_name: values.school_name || existing.school_name || '',
        reason: values.reason || values.subject || existing.reason || '',
        issue_summary: values.issue_summary || values.final_output || values.issue_details || values.technical_summary || values.ai_synopsis || existing.issue_summary || '',
        quick_fix: values.quick_fix || existing.quick_fix || '',
        affected_users: values.affected_users || existing.affected_users || '',
        area: values.area || existing.area || '',
        wire_type: values.wire_type || existing.wire_type || '',
        start_time: values.start_time || existing.start_time || '',
        recurring: values.recurring || existing.recurring || '',
        faz_check: values.faz_check || existing.faz_check || '',
        evidence: values.evidence || values.evidence_collected || values.cli_findings || values.cli_evidence || existing.evidence || '',
        security_policy: values.security_policy || existing.security_policy || '',
        url_access_profile: values.url_access_profile || existing.url_access_profile || '',
        custom_url_categories: values.custom_url_categories || existing.custom_url_categories || '',
        contact_name: values.contact_name || existing.contact_name || '',
        contact_phone: values.contact_phone || values.contact_number || existing.contact_phone || existing.contact_number || '',
        contact_mobile: values.contact_mobile || existing.contact_mobile || '',
        contact_email: values.contact_email || values.email || existing.contact_email || existing.email || '',
        email: values.contact_email || values.email || existing.email || '',
        device: values.device || values.device_type || existing.device || '',
        ip: values.ip || values.ip_address || existing.ip || '',
        mac: values.mac || values.mac_address || existing.mac || '',
        source_ip: values.source_ip || existing.source_ip || '',
        destination: values.destination || values.destination_port || existing.destination || '',
        checks_done: values.checks_done || values.cli_findings || values.resolution_or_next_step || values.troubleshooting || existing.checks_done || '',
        resolution_or_next_step: values.resolution_or_next_step || values.final_output || existing.resolution_or_next_step || '',
        changes_done: ''
      });
      saveJson(sKey(targetId, 'tier2', 'state'), merged);
      addTier2EscalationCaseRecord(merged);
      location.hash = '#' + targetId;
      return;
    }

    // Remaining legacy template handling is intentionally left unchanged by falling back to original broad field copy.
    const existing = loadJson(sKey(targetId, 'state', 'state'), {});
    saveJson(sKey(targetId, 'state', 'state'), Object.assign({}, existing, values));
    location.hash = '#' + targetId;
  }

  function bindPage(pageId){
    // code copy
    contentEl.querySelectorAll('[data-copy-code]').forEach(btn => {
      btn.onclick = async () => { await copyPlainText(btn.dataset.copyCode || ''); };
    });
    contentEl.querySelectorAll('[data-pin-live-cli-section]').forEach(btn => {
      btn.onclick = () => {
        const noteKey = btn.dataset.pinLiveCliSection;
        const noteArea = contentEl.querySelector(`[data-cli-work-area="${noteKey}"]`);
        const commands = btn.dataset.pinLiveCliCode || '';
        const notes = noteArea ? noteArea.value || '' : '';
        const title = btn.closest('.codeblock, .cli-workbox, details, .step')?.querySelector('.step-title, summary span, strong, label')?.textContent || 'CLI section';
        pinLiveWorkspaceSection({type:'cli', title, commands, notes});
        const old = btn.textContent; btn.textContent = 'Pinned'; setTimeout(()=>btn.textContent=old, 900);
      };
    });

    contentEl.querySelectorAll('[data-cli-work-area]').forEach(ta => {
      ta.addEventListener('input', () => {
        saveText(ta.dataset.cliWorkArea, ta.value || '');
        autoResizeTextareas(ta.closest('.cli-workbox') || contentEl);
      });
    });
    contentEl.querySelectorAll('[data-cli-work-copy]').forEach(btn => {
      btn.onclick = async () => {
        const ta = contentEl.querySelector(`[data-cli-work-area="${btn.dataset.cliWorkCopy}"]`);
        await copyPlainText(ta ? ta.value || '' : '');
      };
    });
    contentEl.querySelectorAll('[data-cli-work-clear]').forEach(btn => {
      btn.onclick = () => {
        const ta = contentEl.querySelector(`[data-cli-work-area="${btn.dataset.cliWorkClear}"]`);
        saveText(btn.dataset.cliWorkClear, '');
        if (ta) ta.value = '';
      };
    });



    // Generic copy support for static output panels.
    contentEl.querySelectorAll('.outputwrap .copy-corner').forEach(btn => {
      if (btn.dataset.copyOutput || btn.dataset.copyUrlPolicy) return;
      btn.onclick = async () => {
        const wrap = btn.closest('.outputwrap');
        const target = wrap ? (wrap.querySelector('.output') || wrap.querySelector('.output-area') || wrap.querySelector('pre code')) : null;
        await copyPlainText(target ? (target.textContent || '') : '');
        const old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = old || 'Copy', 900);
      };
    });
    contentEl.querySelectorAll('.codewrap .codebtn:not([data-copy-code])').forEach(btn => {
      btn.onclick = async () => {
        const wrap = btn.closest('.codewrap');
        const target = wrap ? wrap.querySelector('pre code') : null;
        await copyPlainText(target ? (target.textContent || '') : '');
        const old = btn.textContent;
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = old || 'Copy', 900);
      };
    });

    // notes
    contentEl.querySelectorAll('[data-copy-note]').forEach(btn => btn.onclick = async () => { await copyPlainText(loadText(btn.dataset.copyNote, '')); });
    contentEl.querySelectorAll('[data-clear-note]').forEach(btn => btn.onclick = () => { saveText(btn.dataset.clearNote, ''); const ta = contentEl.querySelector(`[data-note-key="${btn.dataset.clearNote}"]`); if (ta) ta.value = ''; });
    contentEl.querySelectorAll('[data-note-key]').forEach(ta => ta.addEventListener('input', () => { autoResizeTextareas(ta.parentElement || contentEl); saveText(ta.dataset.noteKey, ta.value || ''); }));

    // slot forms
    contentEl.querySelectorAll('[data-slot-form]').forEach(root => {
      const formKey = root.dataset.slotForm;
      const slotStep = root.closest('.step') || root.parentElement || root;
      const slotTabs = () => slotStep.querySelectorAll(`[data-slot-tab="${formKey}"]`);
      let activeSlotNo = getActiveWorkingSlot(pageId, formKey, Number(root.dataset.slotCount || 10));
      let slotNo = activeSlotNo || 1;
      let selectedFromPhoneCall = false;
      if(pageId==='case-working-template'){
        const requestedView=loadText(sKey('meta','case-desk-view'),'');
        if(requestedView){
          saveText(sKey('meta','case-desk-view'),'');
          const target=requestedView==='parked'
            ? slotStep.querySelector('.current-working-group')
            : slotStep.querySelector('.parked-ticket-group');
          if(target){
            target.open=true;
            requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
          }
        }
      }
      const stateKey = () => sKey(pageId, formKey, 'slot', slotNo);
      const outputsKey = () => sKey(pageId, formKey, 'slot', slotNo, 'outputs');
      const progressKey = () => sKey(pageId, formKey, 'slot', slotNo, 'progress');
      const updateProgressButtons = () => {
        const panel = root.querySelector('[data-case-progress-panel]');
        if (!panel) return;
        const progress = loadJson(progressKey(), {});
        panel.querySelectorAll('[data-case-progress-step]').forEach(btn => {
          const step = btn.dataset.caseProgressStep;
          const done = !!progress[step];
          btn.classList.toggle('done', done);
          btn.setAttribute('aria-pressed', done ? 'true' : 'false');
          const cleanLabel = btn.textContent.replace(/^✓\s*/, '');
          btn.textContent = done ? `✓ ${cleanLabel}` : cleanLabel;
        });
        const doneCount = Object.values(progress).filter(Boolean).length;
        const status = panel.querySelector('[data-case-progress-status]');
        if (status) status.textContent = `${doneCount}/6 workflow steps completed for this ticket.`;
      };
      const slotLabel = (n) => {
        const saved = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
        const ticket = cleanup(saved.ticket_number || saved.case_number || '').replace(/^#/, '');
        const subject = cleanup(saved.subject || saved.issue_type || '');
        const shortSubject = subject.length > 72 ? subject.slice(0, 69) + '...' : subject;
        if (ticket && subject) return `Ticket ${n} — #${ticket} — ${shortSubject}`;
        if (ticket) return `Ticket ${n} — #${ticket}`;
        if (subject) return `Ticket ${n} — ${shortSubject}`;
        return `Ticket ${n} — Empty`;
      };
      const slotCount = Number(root.dataset.slotCount || 10);
      const isMeaningfulSlot = (vals, n) => {
        const v = withAliases(vals || {});
        const importantFields = [
          'ticket_number','case_number','school_name','account_name','moe_id','firewall_id',
          'contact_name','contact_phone','contact_mobile','contact_email','subject',
          'raw_salesforce','latest_update','cli_findings','missing_evidence','resolution_or_next_step','final_output','workflow_status','issue_type','impact_scope','started_when'
        ];
        if (importantFields.some(k => cleanup(v[k]))) return true;
        if (n && cleanup(loadText(sKey(pageId, formKey, 'slot', n, 'sf_import'), ''))) return true;
        const out = n ? loadJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''}) : {working:''};
        return !!cleanup(out && out.working);
      };
      const clearSlotData = (n) => {
        saveJson(sKey(pageId, formKey, 'slot', n), {});
        saveJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''});
        saveText(sKey(pageId, formKey, 'slot', n, 'sf_import'), '');
        saveJson(sKey(pageId, formKey, 'slot', n, 'progress'), {});
      };
      const compactSlots = () => {
        const rows = [];
        for (let n = 1; n <= slotCount; n++) {
          const vals = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
          if (!isMeaningfulSlot(vals, n)) continue;
          rows.push({
            values: vals,
            outputs: loadJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''}),
            sf: loadText(sKey(pageId, formKey, 'slot', n, 'sf_import'), ''),
            progress: loadJson(sKey(pageId, formKey, 'slot', n, 'progress'), {}),
            originalSlot: n
          });
        }
        const oldActiveSlotNo = activeSlotNo;
        let newActiveSlotNo = 0;
        for (let n = 1; n <= slotCount; n++) {
          const row = rows[n - 1];
          saveJson(sKey(pageId, formKey, 'slot', n), row ? row.values : {});
          saveJson(sKey(pageId, formKey, 'slot', n, 'outputs'), row ? row.outputs : {working:''});
          saveText(sKey(pageId, formKey, 'slot', n, 'sf_import'), row ? row.sf : '');
          saveJson(sKey(pageId, formKey, 'slot', n, 'progress'), row ? row.progress || {} : {});
          if (row && row.originalSlot === oldActiveSlotNo) newActiveSlotNo = n;
        }
        if (slotNo > Math.max(rows.length, 1)) slotNo = Math.max(rows.length, 1);
        activeSlotNo = newActiveSlotNo;
        setActiveWorkingSlot(pageId, formKey, activeSlotNo);
      };

      const removeSlotAndCompact = (removeSlotNo) => {
        const oldActiveSlotNo = getActiveWorkingSlot(pageId, formKey, slotCount);
        const rows = [];
        for (let n = 1; n <= slotCount; n++) {
          if (n === removeSlotNo) continue;
          const vals = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
          if (!isMeaningfulSlot(vals, n)) continue;
          rows.push({
            values: vals,
            outputs: loadJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''}),
            sf: loadText(sKey(pageId, formKey, 'slot', n, 'sf_import'), ''),
            progress: loadJson(sKey(pageId, formKey, 'slot', n, 'progress'), {}),
            originalSlot: n
          });
        }
        let newActiveSlotNo = 0;
        for (let n = 1; n <= slotCount; n++) {
          const row = rows[n - 1];
          saveJson(sKey(pageId, formKey, 'slot', n), row ? row.values : {});
          saveJson(sKey(pageId, formKey, 'slot', n, 'outputs'), row ? row.outputs : {working:''});
          saveText(sKey(pageId, formKey, 'slot', n, 'sf_import'), row ? row.sf : '');
          saveJson(sKey(pageId, formKey, 'slot', n, 'progress'), row ? row.progress || {} : {});
          if (row && row.originalSlot === oldActiveSlotNo) newActiveSlotNo = n;
        }
        slotNo = Math.min(removeSlotNo, Math.max(rows.length, 1));
        activeSlotNo = newActiveSlotNo;
        setActiveWorkingSlot(pageId, formKey, activeSlotNo);
      };
      const selectPhoneCallNewCaseSlot = () => {
        let firstEmptySlot = null;
        for (let n = 1; n <= slotCount; n++) {
          if (!hasMeaningfulTicketData(pageId, formKey, n)) {
            firstEmptySlot = n;
            break;
          }
        }
        activeSlotNo = 0;
        setActiveWorkingSlot(pageId, formKey, 0);
        if (firstEmptySlot != null) {
          slotNo = firstEmptySlot;
          selectedFromPhoneCall = true;
        } else {
          slotNo = Math.max(1, Math.min(slotNo, slotCount));
          selectedFromPhoneCall = false;
        }
      };
      const buildSlotSnapshot = () => {
        const snapshot = new Map();
        for (let n = 1; n <= slotCount; n++) {
          const values = withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
          const sfImport = cleanup(loadText(sKey(pageId, formKey, 'slot', n, 'sf_import'), ''));
          const outputs = loadJson(sKey(pageId, formKey, 'slot', n, 'outputs'), {working:''});
          const importantFields = [
            'ticket_number','case_number','school_name','account_name','moe_id','firewall_id',
            'contact_name','contact_phone','contact_mobile','contact_email','subject',
            'raw_salesforce','latest_update','cli_findings','missing_evidence','resolution_or_next_step','final_output','workflow_status','issue_type','impact_scope','started_when'
          ];
          const used = importantFields.some(k => cleanup(values && values[k])) || !!sfImport || !!cleanup(outputs && outputs.working);
          snapshot.set(n, { values, used });
        }
        return snapshot;
      };

      let lastSlotSnapshot = null;
      const refreshTabLabels = () => {
        activeSlotNo = getActiveWorkingSlot(pageId, formKey, slotCount);
        const workingGroup = slotStep.querySelector('[data-ticket-group="working"]');
        const activeGroup = slotStep.querySelector('[data-ticket-group="parked"]');
        const phoneBtn = slotStep.querySelector('.phone-call-ticket');
        const buttons = Array.from(slotStep.querySelectorAll('.ticket-tabrow .tabbtn:not(.phone-call-ticket)'))
          .sort((a, b) => Number(a.dataset.slotNo || 0) - Number(b.dataset.slotNo || 0));
        const parkedButtons = [];
        const activeButtons = [];
        let firstEmptySlot = null;
        const snapshot = buildSlotSnapshot();
        lastSlotSnapshot = snapshot;

        for (let n = 1; n <= slotCount; n++) {
          if (!snapshot.get(n)?.used && firstEmptySlot == null) firstEmptySlot = n;
        }

        buttons.forEach(btn => {
          const n = Number(btn.dataset.slotNo);
          const used = !!snapshot.get(n)?.used;
          const isActiveSlot = activeSlotNo > 0 && n === activeSlotNo;
          btn.classList.toggle('active', n === slotNo);
          btn.classList.toggle('current-working-ticket', isActiveSlot);
          btn.classList.toggle('parked-ticket', !isActiveSlot);
          btn.hidden = !(used || isActiveSlot);
          const saved = snapshot.get(n)?.values || {};
          const number = cleanup(saved.ticket_number || saved.case_number || '');
          const subject = cleanup(saved.subject || '');
          btn.textContent = number || subject ? `Ticket ${n}${number ? ' — #' + number.replace(/^#/, '') : ''}${subject ? ' — ' + subject.slice(0,72) : ''}` : `Ticket ${n}`;
          if (!btn.hidden) {
            if (isActiveSlot) activeButtons.push(btn);
            else parkedButtons.push(btn);
          }
        });

        if (phoneBtn) {
          if (firstEmptySlot == null) {
            phoneBtn.textContent = 'Phone Call / New Case - No empty slots';
            phoneBtn.disabled = true;
            phoneBtn.removeAttribute('data-slot-no');
            phoneBtn.classList.remove('active');
          } else {
            phoneBtn.textContent = 'Phone Call / New Case';
            phoneBtn.disabled = false;
            phoneBtn.dataset.slotNo = String(firstEmptySlot);
            phoneBtn.dataset.slotTab = formKey;
            phoneBtn.classList.toggle('active', firstEmptySlot === slotNo && !hasMeaningfulTicketData(pageId, formKey, slotNo));
          }
        }

        if (workingGroup) parkedButtons.forEach(btn => workingGroup.appendChild(btn));
        if (activeGroup) activeButtons.forEach(btn => activeGroup.appendChild(btn));
        const workingCounter = slotStep.querySelector('[data-ticket-count="working"]');
        if (workingCounter) workingCounter.textContent = String(parkedButtons.length);
        const activeCounter = slotStep.querySelector('[data-ticket-count="parked"]');
        if (activeCounter) activeCounter.textContent = String(activeButtons.length);
        const currentTicketSearch = slotStep.querySelector('[data-ticket-search="all"]');
        if (currentTicketSearch) currentTicketSearch.dispatchEvent(new Event('input'));

        const moveBtn = slotStep.querySelector('[data-move-slot-to-working]');
        const focusStatus = slotStep.querySelector('[data-working-focus-status]');
        const selectedHasContent = hasMeaningfulTicketData(pageId, formKey, slotNo);
        const selectedIsPhoneCall = phoneBtn && Number(phoneBtn.dataset.slotNo || 0) === slotNo && !selectedHasContent;
        const selectedIsActive = activeSlotNo > 0 && slotNo === activeSlotNo;
        if (moveBtn) {
          moveBtn.hidden = selectedIsPhoneCall || !selectedHasContent;
          moveBtn.textContent = selectedIsActive ? 'Move this case to Park / Working on cases' : 'Move this case to Current Active case';
        }
        if (focusStatus) {
          focusStatus.textContent = selectedIsPhoneCall
            ? 'Phone Call / New Case selected. Add details and it will move to Current Active case.'
            : (selectedIsActive
              ? 'This is the current active case. It will stay selected when you leave and return.'
              : 'This case is parked. Use the move button to make it the current active case.');
        }
      };

      const renderState = () => {
        setFields(root, withAliases(loadJson(stateKey(), {})));
        const out = loadJson(outputsKey(), {working:''});
        root.querySelectorAll('[data-output-area]').forEach(el => { renderOutputArea(el, out[el.dataset.outputArea] || ''); });
        const sfBox = root.querySelector('[data-sf-import]');
        if (sfBox) sfBox.value = loadText(sKey(pageId, formKey, 'slot', slotNo, 'sf_import'), '');
        updateCollapsibleIndicators(root);
        refreshTabLabels();
        updateProgressButtons();
      };

      slotTabs().forEach(btn => btn.onclick = () => {
        slotNo = Number(btn.dataset.slotNo);
        const isPhoneCall = btn.classList.contains('phone-call-ticket');
        selectedFromPhoneCall = !!(isPhoneCall && !hasMeaningfulTicketData(pageId, formKey, slotNo));
        if (selectedFromPhoneCall) {
          setActiveWorkingSlot(pageId, formKey, 0);
          activeSlotNo = 0;
        }
        renderState();
        autoResizeTextareas(root);
      });

      const clearSelectedParkedBtn = slotStep.querySelector('[data-clear-selected-parked]');
      if (clearSelectedParkedBtn) {
        const stopHeaderToggle = (ev) => ev.stopPropagation();
        clearSelectedParkedBtn.addEventListener('click', stopHeaderToggle);
        clearSelectedParkedBtn.addEventListener('keydown', stopHeaderToggle);
        clearSelectedParkedBtn.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const selectedHasContent = hasMeaningfulTicketData(pageId, formKey, slotNo);
          const selectedIsActive = activeSlotNo > 0 && slotNo === activeSlotNo;
          if (!selectedHasContent || selectedIsActive) {
            const status = root.querySelector('[data-slot-status]');
            if (status) status.textContent = selectedIsActive
              ? 'The selected case is active. Move it to Park / Working on cases before clearing it here.'
              : 'Select a parked case first, then click Clear selected.';
            return;
          }
          const label = slotLabel(slotNo);
          clearSlotData(slotNo);
          compactSlots();
          selectPhoneCallNewCaseSlot();
          renderState();
          const status = root.querySelector('[data-slot-status]');
          if (status) status.textContent = `Cleared ${label}. Ready for Phone Call / New Case.`;
          autoResizeTextareas(root);
        };
      }

      const clearAllParkedBtn = slotStep.querySelector('[data-clear-all-parked]');
      if (clearAllParkedBtn) {
        const stopHeaderToggle = (ev) => ev.stopPropagation();
        clearAllParkedBtn.addEventListener('click', stopHeaderToggle);
        clearAllParkedBtn.addEventListener('keydown', stopHeaderToggle);
        clearAllParkedBtn.onclick = (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          const currentActive = getActiveWorkingSlot(pageId, formKey, slotCount);
          let clearedCount = 0;
          for (let n = 1; n <= slotCount; n++) {
            if (n === currentActive) continue;
            if (hasMeaningfulTicketData(pageId, formKey, n)) {
              clearSlotData(n);
              clearedCount++;
            }
          }
          compactSlots();
          if (currentActive > 0) {
            const refreshedActive = getActiveWorkingSlot(pageId, formKey, slotCount);
            activeSlotNo = refreshedActive;
            slotNo = refreshedActive || 1;
          } else {
            selectPhoneCallNewCaseSlot();
          }
          renderState();
          const status = root.querySelector('[data-slot-status]');
          if (status) status.textContent = clearedCount
            ? `Cleared ${clearedCount} case${clearedCount === 1 ? '' : 's'} from Park / Working on cases.`
            : 'There are no parked cases to clear.';
          autoResizeTextareas(root);
        };
      }

      const moveWorkingBtn = slotStep.querySelector('[data-move-slot-to-working]');
      if (moveWorkingBtn) moveWorkingBtn.onclick = () => {
        saveJson(stateKey(), collectFields(root));
        const selectedIsActive = activeSlotNo > 0 && slotNo === activeSlotNo;
        if (selectedIsActive) {
          const movedLabel = slotLabel(slotNo);
          selectedFromPhoneCall = false;
          setActiveWorkingSlot(pageId, formKey, 0);
          activeSlotNo = 0;
          selectPhoneCallNewCaseSlot();
          renderState();
          const status = root.querySelector('[data-slot-status]');
          if (status) status.textContent = `Moved ${movedLabel} to Park / Working on cases. Phone Call / New Case is now selected.`;
          return;
        } else {
          selectedFromPhoneCall = false;
          setActiveWorkingSlot(pageId, formKey, slotNo);
          activeSlotNo = slotNo;
          const status = root.querySelector('[data-slot-status]');
          if (status) status.textContent = `Moved ${slotLabel(slotNo)} to Current Active case.`;
        }
        refreshTabLabels();
      };

      const applyTicketSearch = () => {
        const ticketSearch = slotStep.querySelector('[data-ticket-search="all"]');
        const q = cleanup(ticketSearch ? ticketSearch.value : '').toLowerCase();
        const all = Array.from(slotStep.querySelectorAll('.ticket-tabrow .tabbtn:not(.phone-call-ticket)'));
        let parkedMatch = false;
        let activeMatch = false;
        all.forEach(btn => {
          const n = Number(btn.dataset.slotNo);
          const cached = lastSlotSnapshot && lastSlotSnapshot.get(n);
          const used = cached ? !!cached.used : hasMeaningfulTicketData(pageId, formKey, n);
          const isActiveSlot = activeSlotNo > 0 && n === activeSlotNo;
          const baseHidden = !(used || isActiveSlot);
          const label = (btn.textContent || '').toLowerCase();
          const saved = cached ? cached.values : withAliases(loadJson(sKey(pageId, formKey, 'slot', n), {}));
          const ticketNumber = cleanup(saved.ticket_number || '').toLowerCase();
          const caseNumber = cleanup(saved.case_number || '').toLowerCase();
          const subject = cleanup(saved.subject || '').toLowerCase();
          const match = !q || label.includes(q) || ticketNumber.includes(q) || caseNumber.includes(q) || subject.includes(q);
          btn.hidden = baseHidden || !match;
          if (q && match && !baseHidden) {
            if (isActiveSlot) activeMatch = true;
            else parkedMatch = true;
          }
        });
        if (q) {
          const parkedDetails = slotStep.querySelector('.current-working-group');
          const activeDetails = slotStep.querySelector('.parked-ticket-group');
          if (parkedDetails && parkedMatch) parkedDetails.open = true;
          if (activeDetails && activeMatch) activeDetails.open = true;
        }
      };

      const ticketSearch = slotStep.querySelector('[data-ticket-search="all"]');
      if (ticketSearch) {
        ticketSearch.addEventListener('click', ev => ev.stopPropagation());
        ticketSearch.addEventListener('keydown', ev => ev.stopPropagation());
        ticketSearch.addEventListener('input', applyTicketSearch);
      }

      // v50 performance: debounce synchronous localStorage writes and the
      // 100-slot label refresh. Lightweight visual updates remain immediate.
      let caseAutosaveTimer = 0;
      let sfAutosaveTimer = 0;
      const saveWorkingFields = (changedField='') => {
        const nextValues = collectFields(root);
        const previousValues = loadJson(stateKey(), {});
        if (changedField === 'latest_update') {
          nextValues.__latest_update_at = cleanup(nextValues.latest_update || '')
            ? new Date().toLocaleTimeString('en-NZ', { hour:'2-digit', minute:'2-digit', hour12:false })
            : '';
        } else if (previousValues.__latest_update_at) {
          nextValues.__latest_update_at = previousValues.__latest_update_at;
        }
        saveJson(stateKey(), nextValues);
        if (pageId === 'case-working-template' && selectedFromPhoneCall && hasMeaningfulTicketData(pageId, formKey, slotNo) && activeSlotNo !== slotNo) {
          setActiveWorkingSlot(pageId, formKey, slotNo);
          activeSlotNo = slotNo;
          selectedFromPhoneCall = false;
        }
        refreshTabLabels();
      };
      root.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', () => {
        const details = el.closest('details.collapsible-field');
        if (details) {
          const hasContent = !!cleanup(el.value || '');
          details.classList.toggle('has-value', hasContent);
          details.classList.toggle('is-empty', !hasContent);
        }
        if (el.tagName === 'TEXTAREA') autoResizeTextareas(el.parentElement || root);
        clearTimeout(caseAutosaveTimer);
        caseAutosaveTimer = setTimeout(() => saveWorkingFields(el.dataset.field || ''), 350);
      }));
      const sfInput = root.querySelector('[data-sf-import]');
      if (sfInput) sfInput.addEventListener('input', () => {
        clearTimeout(sfAutosaveTimer);
        sfAutosaveTimer = setTimeout(() => {
          saveText(sKey(pageId, formKey, 'slot', slotNo, 'sf_import'), sfInput.value || '');
          if (pageId === 'case-working-template' && selectedFromPhoneCall && hasMeaningfulTicketData(pageId, formKey, slotNo) && activeSlotNo !== slotNo) {
            setActiveWorkingSlot(pageId, formKey, slotNo);
            activeSlotNo = slotNo;
            selectedFromPhoneCall = false;
          }
          refreshTabLabels();
        }, 350);
      });


      // localStorage writes are synchronous, but save the visible slot once
      // more when the browser hides, suspends, or closes the local runbook.
      const persistVisibleWorkingCase = () => {
        try {
          saveJson(stateKey(), collectFields(root));
          const visibleSfBox = root.querySelector('[data-sf-import]');
          if (visibleSfBox) saveText(sKey(pageId, formKey, 'slot', slotNo, 'sf_import'), visibleSfBox.value || '');
          setActiveWorkingSlot(pageId, formKey, activeSlotNo);
        } catch (err) {
          console.error('Unable to persist working case state:', err);
        }
      };
      // Keep only the latest visible-case persistence callback. Global lifecycle
      // listeners are registered once below, preventing listener accumulation.
      window.__runbookPersistVisibleWorkingCase = persistVisibleWorkingCase;

      root.querySelectorAll('[data-case-progress-step]').forEach(btn => btn.addEventListener('click', () => {
        const progress = loadJson(progressKey(), {});
        const step = btn.dataset.caseProgressStep;
        progress[step] = !progress[step];
        saveJson(progressKey(), progress);
        updateProgressButtons();
      }));
      root.querySelector('[data-case-progress-reset]')?.addEventListener('click', () => {
        saveJson(progressKey(), {});
        updateProgressButtons();
      });

      const importBtn = root.querySelector('[data-sf-import-btn]');
      if (importBtn) {
        let importRunning = false;
        const runSalesforceImport = () => {
          if (importRunning) return;
          importRunning = true;
          clearTimeout(caseAutosaveTimer);
          clearTimeout(sfAutosaveTimer);
          const sfRaw = root.querySelector('[data-sf-import]')?.value || '';
        saveText(sKey(pageId, formKey, 'slot', slotNo, 'sf_import'), sfRaw);
        const parsed = withAliases(parseSalesforceCaseHeaderOnly(sfRaw));
        const current = collectFields(root);
        const merged = Object.assign({}, current, {
          ticket_number: parsed.ticket_number || '',
          school_name: parsed.school_name || '',
          account_name: parsed.school_name || '',
          moe_id: parsed.moe_id || current.moe_id || '',
          firewall_id: parsed.firewall_id || current.firewall_id || '',
          contact_name: parsed.contact_name || '',
          contact_phone: parsed.contact_phone || '',
          contact_mobile: parsed.contact_mobile || '',
          contact_email: parsed.contact_email || '',
          email: parsed.contact_email || '',
          subject: parsed.subject || '',
          raw_salesforce: parsed.raw_salesforce || current.raw_salesforce || '',
          crm_verified: parsed.crm_verified || current.crm_verified || '',
          issue_details: parsed.issue_details || current.issue_details || '',
          start_time: parsed.start_time || current.start_time || '',
          affected_users: parsed.affected_users || current.affected_users || '',
          error_message: parsed.error_message || current.error_message || '',
          evidence: parsed.evidence || extractNamedSection(root.querySelector('[data-note-import]')?.value || '', ['Evidence Collected']) || current.evidence || '',
          security_policy: parsed.security_policy || current.security_policy || '',
          url_access_profile: parsed.url_access_profile || current.url_access_profile || '',
          custom_url_categories: parsed.custom_url_categories || current.custom_url_categories || '',
          case_update: parsed.case_update || current.case_update || '',
          device: parsed.device || current.device || '',
          ip: current.ip || current.ip_address || '',
          mac: current.mac || current.mac_address || '',
          resolution_or_next_step: parsed.resolution_or_next_step || current.resolution_or_next_step || ''
        });
        saveJson(stateKey(), merged);
        setFields(root, merged);
        if (pageId === 'case-working-template' && selectedFromPhoneCall && hasMeaningfulTicketData(pageId, formKey, slotNo)) {
          setActiveWorkingSlot(pageId, formKey, slotNo);
          activeSlotNo = slotNo;
          selectedFromPhoneCall = false;
        }
        refreshTabLabels();
        const count = Object.values(merged).filter(Boolean).length;
        root.querySelector('[data-slot-status]').textContent = count ? `Imported ${count} fields into ${slotLabel(slotNo)}.` : 'No usable fields found.';
        autoResizeTextareas(root);
        importRunning = false;
      };
        importBtn.addEventListener('pointerdown', (e) => {
          if (e.pointerType === 'mouse' || e.pointerType === 'pen' || e.pointerType === 'touch') {
            e.preventDefault();
            runSalesforceImport();
          }
        });
        importBtn.addEventListener('click', (e) => {
          if (e.detail === 0) runSalesforceImport();
        });
      }

      const genBtn = root.querySelector('[data-generate-slot]');
      if (genBtn) genBtn.onclick = () => {
        const values = collectFields(root);
        saveJson(stateKey(), values);
        refreshTabLabels();
        const outputs = {
          working: buildOutput(root.dataset.templateType, values)
        };
        saveJson(outputsKey(), outputs);
        root.querySelectorAll('[data-output-area]').forEach(el => { renderOutputArea(el, outputs[el.dataset.outputArea] || ''); });
        root.querySelector('[data-slot-status]').textContent = `Generated output for ${slotLabel(slotNo)}.`;
      };

      root.querySelectorAll('[data-clear-slot]').forEach(clearBtn => clearBtn.onclick = () => {
        const cleared = slotNo;
        clearSlotData(cleared);
        compactSlots();
        selectPhoneCallNewCaseSlot();
        renderState();
        const status = root.querySelector('[data-slot-status]');
        if (status) status.textContent = `Cleared Ticket ${cleared}. Ready for Phone Call / New Case.`;
        autoResizeTextareas(root);
      });

      root.querySelectorAll('[data-archive-clear-slot]').forEach(archiveClearBtn => archiveClearBtn.onclick = () => {
        const values = withAliases(collectFields(root));
        const caseNo = cleanup(values.ticket_number || values.case_number || '').replace(/^#/, '');
        const subject = cleanup(values.subject || 'Untitled case');
        const hasContent = Object.entries(values || {}).some(([k,v]) => !String(k).startsWith('__') && cleanup(v));
        if (!hasContent) {
          root.querySelector('[data-slot-status]').textContent = 'Nothing to archive for this ticket.';
          return;
        }
        const archivedAt = new Date().toLocaleString('en-NZ', { hour12:false });
        const kbValues = withAliases(Object.assign({}, values, {
          ticket_number: caseNo || cleanup(values.ticket_number || values.case_number || ''),
          case_number: caseNo || cleanup(values.ticket_number || values.case_number || ''),
          subject,
          final_output: cleanup(values.final_output || buildOutput('workingCase', values))
        }));
        const entries = getCaseKnowledgebaseEntries();
        entries.unshift({
          title: `${caseNo ? '#' + caseNo + ' — ' : ''}${subject}`,
          savedAt: archivedAt,
          sourcePage: pageId,
          values: kbValues
        });
        saveCaseKnowledgebaseEntries(entries.slice(0, 500));
        const cleared = slotNo;
        clearSlotData(cleared);
        compactSlots();
        renderState();
        root.querySelector('[data-slot-status]').textContent = `Saved to Case Knowledgebase and cleared Ticket ${cleared}.`;
        autoResizeTextareas(root);
      });

      const sendBtn = root.querySelector('[data-send-slot]');
      if (sendBtn) sendBtn.onclick = () => {
        const targetId = root.querySelector('[data-send-target]')?.value || '';
        const sentSlot = slotNo;
        mergeToTarget(targetId, collectFields(root), pageId);
        if (
          (pageId === 'case-call-template' && (targetId === 'case-working-template' || targetId === 'case-intake-workspace')) ||
          (pageId === 'case-intake-workspace' && targetId === 'case-working-template')
        ) {
          clearSlotData(sentSlot);
          compactSlots();
          renderState();
          root.querySelector('[data-slot-status]').textContent = `Sent to selected workspace and removed from current active list. Remaining cases moved up.`;
        } else {
          root.querySelector('[data-slot-status]').textContent = 'Sent ticket details to selected workspace.';
        }
      };



      const workingTier2TrackingBtn = root.querySelector('[data-add-working-tier2-tracking]');
      if (workingTier2TrackingBtn) workingTier2TrackingBtn.onclick = () => {
        const values = collectFields(root);
        if (!isMeaningfulSlot(values, slotNo)) {
          const status = root.querySelector('[data-slot-status]');
          if (status) status.textContent = 'Nothing to add to Tier 2 Tracking Cases.';
          return;
        }
        const removedLabel = slotLabel(slotNo);
        saveJson(stateKey(), values);
        addTier2EscalationCaseRecord(values);
        removeSlotAndCompact(slotNo);
        renderState();
        const status = root.querySelector('[data-slot-status]');
        if (status) status.textContent = `Added / updated Tier 2 Tracking Cases and removed ${removedLabel} from Current Active case / Park / Working on cases.`;
        autoResizeTextareas(root);
      };

      const saveKbBtn = root.querySelector('[data-save-slot-kb]');
      if (saveKbBtn) saveKbBtn.onclick = () => {
        const values = withAliases(collectFields(root));
        if (!isMeaningfulSlot(values)) {
          root.querySelector('[data-slot-status]').textContent = 'Nothing to save to Knowledgebase.';
          return;
        }
        const entries = getCaseKnowledgebaseEntries();
        entries.unshift({
          title: caseTitle(values),
          savedAt: new Date().toLocaleString('en-NZ', { hour12:false }),
          sourcePage: pageId,
          values
        });
        saveCaseKnowledgebaseEntries(entries.slice(0, 200));
        clearSlotData(slotNo);
        compactSlots();
        renderState();
        root.querySelector('[data-slot-status]').textContent = 'Saved to Case Knowledgebase and removed from active workspace.';
      };


      root.querySelectorAll('[data-copy-output]').forEach(btn => btn.onclick = async () => {
        const which = btn.dataset.copyOutput;
        const text = root.querySelector(`[data-output-area="${which}"]`)?.dataset.rawOutput || '';
        await copyPlainText(text, { templateSpacing: isTemplatePage(pageId) });
        root.querySelector('[data-slot-status]').textContent = `Copied ${which}.`;
      });

      renderState();
    });

    // generator forms + email forms
    contentEl.querySelectorAll('[data-generator-form], [data-email-form]').forEach(root => {
      const formKey = root.dataset.generatorForm || root.dataset.emailForm;
      const stateKey = sKey(pageId, formKey, 'state');
      const outputKey = sKey(pageId, formKey, 'output');
      setFields(root, withAliases(loadJson(stateKey, {})));

      root.querySelectorAll('[data-field]').forEach(el => el.addEventListener('input', () => { autoResizeTextareas(root); saveJson(stateKey, collectFields(root)); }));
      const templateBodyEl = root.querySelector('[data-email-template-body]');
      if (templateBodyEl) templateBodyEl.addEventListener('input', () => { autoResizeTextareas(root); saveText(sKey(pageId, formKey, 'templateBody'), templateBodyEl.value || ''); });

      const importBtn = root.querySelector('[data-note-import-btn]');
      if (importBtn) importBtn.onclick = () => {
        const parsed = parseSmart(root.querySelector('[data-note-import]')?.value || '');
        const evidenceText = cleanup([parsed.evidence, parsed.error_message].filter(Boolean).join('\n'));
        const current = collectFields(root);
        const merged = Object.assign({}, current, {
          ticket_number: parsed.ticket_number || current.ticket_number || '',
          moe_id: parsed.moe_id || current.moe_id || '',
          firewall_id: parsed.firewall_id || parsed.moe_firewall || current.firewall_id || '',
          school_name: parsed.school_name || current.school_name || '',
          contact_name: parsed.contact_name || '',
          contact_phone: parsed.contact_phone || parsed.contact_number || '',
          contact_mobile: parsed.contact_mobile || '',
          subject: parsed.subject || '',
          contact_email: parsed.contact_email || parsed.email || '',
          email: parsed.contact_email || parsed.email || '',
          best_technical_contact: parsed.contact_name || current.best_technical_contact || '',
          reason: parsed.reason || current.reason || '',
          issue_summary: parsed.issue_summary || extractNamedSection(root.querySelector('[data-note-import]')?.value || '', ['Summary of Issue?','Summary of Issue','Technical Summary','Problem','Working Case Note','Current Status']) || current.issue_summary || '',
          quick_fix: parsed.quick_fix || current.quick_fix || '',
          affected_users: parsed.affected_users || current.affected_users || '',
          area: parsed.area || current.area || '',
          wire_type: parsed.wire_type || current.wire_type || '',
          recurring: parsed.recurring || current.recurring || '',
          faz_check: parsed.faz_check || current.faz_check || '',
          evidence: parsed.evidence || extractNamedSection(root.querySelector('[data-note-import]')?.value || '', ['Evidence Collected']) || current.evidence || '',
          security_policy: parsed.security_policy || current.security_policy || '',
          url_access_profile: parsed.url_access_profile || current.url_access_profile || '',
          custom_url_categories: parsed.custom_url_categories || current.custom_url_categories || '',
          start_time: parsed.start_time || current.start_time || '',
          troubleshooting_summary: parsed.troubleshooting_summary || parsed.steps_taken || extractNamedSection(root.querySelector('[data-note-import]')?.value || '', ['Summary of troubleshooting steps and configurational changes done so far?','Summary of troubleshooting steps and configurational changes done so far','Immediate Next Checks','Troubleshooting Performed','Action Summary','Evidence / Checks']) || current.troubleshooting_summary || current.checks_done || '',
          checks_done: parsed.troubleshooting_summary || parsed.steps_taken || current.checks_done || '',
          resolution_or_next_step: parsed.resolution_or_next_step || current.resolution_or_next_step || '',
          contact_info: parsed.contact_info || current.contact_info || '',
          ip_mac: parsed.ip_mac || current.ip_mac || '',
          source_destination: parsed.source_destination || current.source_destination || '',
          missing_evidence_t2: parsed.missing_evidence_t2 || current.missing_evidence_t2 || '',
          ip: parsed.ip || current.ip || '',
          mac: parsed.mac || current.mac || '',
          source_ip: parsed.source_ip || current.source_ip || '',
          destination: parsed.destination || current.destination || '',
          address: parsed.address || current.address || '',
          opened_time: parsed.opened_time || parsed.start_time || current.opened_time || '',
          outage_start: parsed.outage_start || parsed.start_time || current.outage_start || '',
          discovery_mode: parsed.discovery_mode || current.discovery_mode || '',
          discovery_details: parsed.discovery_details || current.discovery_details || cleanup([parsed.contact_name, parsed.contact_mobile || parsed.contact_phone || parsed.contact_number, parsed.contact_email || parsed.email].filter(Boolean).join(' | ')),
          steps_taken: parsed.steps_taken || current.steps_taken || '',
          next_steps: parsed.next_steps || current.next_steps || '',
          network_version: parsed.network_version || current.network_version || ''
        });
        if (root.dataset.templateType === 'internet_speed') {
          const speedFields = parseInternetSpeedFields(root.querySelector('[data-note-import]')?.value || '');
          Object.entries(speedFields).forEach(([k,v]) => { if (v && !merged[k]) merged[k] = v; });
        }
        saveJson(stateKey, merged);
        setFields(root, merged);
        root.querySelector('[data-form-status]').textContent = 'Imported note into form.';
        autoResizeTextareas(root);
      };

      const genBtn = root.querySelector('[data-generate-form], [data-generate-email]');
      if (genBtn) genBtn.onclick = () => {
        const values = collectFields(root);
        if (root.dataset.templateType === 'email' && isProactiveEmailTemplate(formKey)) {
          const proactiveInfo = splitProactiveDeviceInformation(values.custom_value || values.url || '');
          if (!cleanup(values.school_name || '') && proactiveInfo.school) values.school_name = proactiveInfo.school;
          if (proactiveInfo.deviceInfo && /^email-proactive-switch$/i.test(formKey)) values.custom_value = proactiveInfo.deviceInfo;
          setFields(root, values);
        }
        saveJson(stateKey, values);
        const output = buildOutput(root.dataset.templateType, values, { templateBody: templateBodyEl ? templateBodyEl.value : root.dataset.templateBodyDefault, formKey: formKey });
        saveText(outputKey, output);
        if (root.dataset.templateType === 'tier2') addTier2EscalationCaseRecord(values);
        const area = root.querySelector('[data-output-area="single"]');
        if (area) renderOutputArea(area, output);
        root.querySelector('[data-form-status]').textContent = 'Generated output.';
      };

      root.querySelectorAll('[data-clear-form]').forEach(clearBtn => clearBtn.onclick = () => {
        saveJson(stateKey, {});
        saveText(outputKey, '');
        root.querySelectorAll('[data-field]').forEach(el => el.value = '');
        root.querySelectorAll('[data-note-import], [data-sf-import]').forEach(el => el.value = '');
        const area = root.querySelector('[data-output-area="single"]');
        if (area) renderOutputArea(area, '');
        const status = root.querySelector('[data-form-status]');
        if (status) status.textContent = 'Cleared form and import box.';
        autoResizeTextareas(root);
      });

      const resetBtn = root.querySelector('[data-reset-email-template]');
      if (resetBtn) resetBtn.onclick = () => {
        const def = normalizeCustomerTemplateTicketSentence(root.dataset.templateBodyDefault || '');
        saveText(sKey(pageId, formKey, 'templateBody'), def);
        if (templateBodyEl) templateBodyEl.value = def;
        autoResizeTextareas(root);
      };

      const sendBtn = root.querySelector('[data-send-form]');
      if (sendBtn) sendBtn.onclick = () => mergeToTarget(root.querySelector('[data-send-target]').value, collectFields(root), pageId);

      const tier2TrackingBtn = root.querySelector('[data-add-tier2-tracking]');
      if (tier2TrackingBtn) tier2TrackingBtn.onclick = () => {
        const values = collectFields(root);
        saveJson(stateKey, values);
        addTier2EscalationCaseRecord(values);
        const status = root.querySelector('[data-form-status]');
        if (status) status.textContent = 'Added / updated Tier 2 Escalation Cases.';
      };

      const saveKbBtn = root.querySelector('[data-save-slot-kb]');
      if (saveKbBtn) saveKbBtn.onclick = () => {
        const values = withAliases(collectFields(root));
        if (!isMeaningfulSlot(values)) {
          root.querySelector('[data-slot-status]').textContent = 'Nothing to save to Knowledgebase.';
          return;
        }
        const entries = getCaseKnowledgebaseEntries();
        entries.unshift({
          title: caseTitle(values),
          savedAt: new Date().toLocaleString('en-NZ', { hour12:false }),
          sourcePage: pageId,
          values
        });
        saveCaseKnowledgebaseEntries(entries.slice(0, 200));
        clearSlotData(slotNo);
        compactSlots();
        renderState();
        root.querySelector('[data-slot-status]').textContent = 'Saved to Case Knowledgebase and removed from active workspace.';
      };

      root.querySelectorAll('[data-copy-output]').forEach(btn => btn.onclick = async () => {
        const text = root.querySelector('[data-output-area="single"]')?.dataset.rawOutput || '';
        await copyPlainText(text, { templateSpacing: isTemplatePage(pageId), disableHtmlBold: root.dataset.templateType === 'email' });
        root.querySelector('[data-form-status]').textContent = 'Copied output.';
      });

      const saved = loadText(outputKey, '');
      const area = root.querySelector('[data-output-area="single"]');
      if (area) renderOutputArea(area, saved);
      if (templateBodyEl) templateBodyEl.value = loadText(sKey(pageId, formKey, 'templateBody'), root.dataset.templateBodyDefault || '');
      autoResizeTextareas(root);
    });

    // CLI cleanup helper
    contentEl.querySelectorAll('[data-cli-clean-input]').forEach(input => {
      const step = input.closest('.step') || contentEl;
      const output = step.querySelector('[data-cli-clean-output]');
      const status = step.querySelector('[data-cli-clean-status]');
      const inputKey = sKey(pageId, 'cliCleanup', 'input');
      const outputKey = sKey(pageId, 'cliCleanup', 'output');
      const cleanCli = (text) => String(text || '').replace(/(\S)#(?!\d{6,})/g, '$1→');
      input.addEventListener('input', () => saveText(inputKey, input.value || ''));
      if (output) output.addEventListener('input', () => { saveText(outputKey, output.value || ''); autoResizeTextareas(step); });
      const cleanBtn = step.querySelector('[data-cli-clean-btn]');
      if (cleanBtn) cleanBtn.onclick = () => {
        const cleaned = cleanCli(input.value || '');
        if (output) output.value = cleaned;
        saveText(inputKey, input.value || '');
        saveText(outputKey, cleaned);
        if (status) status.textContent = 'CLI cleaned. # was replaced only where it appears in CLI prompts.';
        autoResizeTextareas(step);
      };
      const copyBtn = step.querySelector('[data-cli-copy-btn]');
      if (copyBtn) copyBtn.onclick = async () => {
        await copyPlainText(output ? output.value || '' : '');
        if (status) status.textContent = 'Copied cleaned CLI.';
      };
      const clearBtn = step.querySelector('[data-cli-clear-btn]');
      if (clearBtn) clearBtn.onclick = () => {
        input.value = '';
        if (output) output.value = '';
        saveText(inputKey, '');
        saveText(outputKey, '');
        if (status) status.textContent = 'CLI section cleared.';
        autoResizeTextareas(step);
      };
      autoResizeTextareas(step);
    });

    // command search
    contentEl.querySelectorAll('[data-command-search]').forEach(input => {
      const resultsEl = contentEl.querySelector('[data-command-results]');
      const index = [];
      Object.entries(runbook.pages || {}).forEach(([id, page]) => {
        (page.body || []).forEach(block => {
          const walk = (b) => {
            if (!b) return;
            if (b.type === 'code') index.push({ pageId:id, pageTitle:page.title || id, title:b.title || 'Code', text:b.code || '' });
            if (b.type === 'step') { index.push({ pageId:id, pageTitle:page.title || id, title:b.title || 'Step', text: JSON.stringify(b) }); (b.content || []).forEach(walk); }
            if (b.type === 'list') index.push({ pageId:id, pageTitle:page.title || id, title:'List', text:(b.items || []).join(' ') });
          };
          walk(block);
        });
      });
      const renderResults = () => {
        const q = (input.value || '').trim().toLowerCase();
        if (!q) { resultsEl.innerHTML = '<div class="muted">Type a command, topic, or note to search.</div>'; return; }
        const found = index.filter(item => (`${item.pageTitle} ${item.title} ${item.text}`).toLowerCase().includes(q)).slice(0, 40);
        resultsEl.innerHTML = found.length ? found.map(item => `<div class="search-result"><div><a href="#${esc(item.pageId)}"><strong>${esc(item.pageTitle)}</strong></a></div><div class="muted">${esc(item.title)}</div><pre style="white-space:pre-wrap">${esc(item.text).slice(0,600)}</pre></div>`).join('') : '<div class="muted">No results found.</div>';
      };
      input.addEventListener('input', renderResults);
      renderResults();
    });
  }

  if (searchEl) searchEl.addEventListener('input', () => {
    renderNav(searchEl.value || '');
    document.body.classList.toggle('nav-search-active', !!searchEl.value.trim());
  });
  if (clearNavSearchBtn) clearNavSearchBtn.addEventListener('click', () => {
    if (searchEl) { searchEl.value = ''; renderNav(''); searchEl.focus(); }
    document.body.classList.remove('nav-search-active');
  });
  const closeSidebar = () => document.body.classList.remove('sidebar-open');
  if (sidebarBtn) sidebarBtn.addEventListener('click', () => document.body.classList.toggle('sidebar-open'));
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);
  if (navEl) navEl.addEventListener('click', e => {
    const link = e.target.closest('.navitem');
    if (!link) return;
    if (renderedPageId) savePageUiState(renderedPageId);
    document.body.classList.add('page-switching');
    if (window.innerWidth <= 980) closeSidebar();
  });
  if (globalSearchBtn) globalSearchBtn.addEventListener('click', openGlobalSearch);
  if (closeGlobalSearchBtn) closeGlobalSearchBtn.addEventListener('click', closeGlobalSearch);
  if (globalSearchInput) globalSearchInput.addEventListener('input', renderGlobalSearchResults);
  if (globalSearchOverlay) globalSearchOverlay.addEventListener('click', (e) => { if (e.target === globalSearchOverlay) closeGlobalSearch(); });
  if (favoriteBtn) favoriteBtn.addEventListener('click', () => {
    const id = currentPageId();
    const favs = getFavorites();
    saveFavorites(favs.includes(id) ? favs.filter(x => x !== id) : favs.concat(id));
    updateFavoriteButton();
    renderPage(id);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openGlobalSearch(); }
    if (e.key === 'Escape') closeGlobalSearch();
  });
  document.addEventListener('click', (e) => { if (e.target.closest('.global-result')) closeGlobalSearch(); });
  if (themeBtn) themeBtn.addEventListener('click', () => applyTheme(document.body.dataset.theme === 'soft' ? 'soc' : 'soft'));
  if (homeBtn) homeBtn.addEventListener('click', () => location.hash = '#runbook-home');
  window.addEventListener('hashchange', () => { renderPage(currentPageId()); requestAnimationFrame(() => document.body.classList.remove('page-switching')); });
  window.addEventListener('pagehide', () => { if (renderedPageId) savePageUiState(renderedPageId); saveNavUiState(); });
  window.addEventListener('beforeunload', () => { if (renderedPageId) savePageUiState(renderedPageId); saveNavUiState(); });

  // Preserve the current DOM while switching applications, browser windows,
  // locking Windows, or returning from Salesforce. Re-rendering on visibility
  // changes collapses navigation and form panels, so visibility changes only
  // save state. A rebuild is used only if the page content is genuinely absent.
  const restoreOnlyIfMissing = () => {
    if (contentEl && contentEl.firstElementChild) return;
    const pageId = currentPageId();
    if (!location.hash && pageExists(pageId)) {
      try { history.replaceState(null, '', '#' + pageId); }
      catch (e) { location.hash = '#' + pageId; }
    }
    renderNav(searchEl ? searchEl.value || '' : '');
    renderPage(pageId);
  };

  window.addEventListener('pageshow', restoreOnlyIfMissing);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (renderedPageId) savePageUiState(renderedPageId);
      saveNavUiState();
    }
    // Deliberately do nothing when visible again. The existing DOM, expanded
    // panels, selected ticket, pasted text, scroll position, and cursor remain.
  });

  renderNav('');
  renderPage(currentPageId());
})();

// v50 performance: register lifecycle persistence once. The callback is
// replaced whenever a Working Case slot is rendered.
(function registerRunbookLifecyclePersistence(){
  if (window.__runbookLifecyclePersistenceRegistered) return;
  window.__runbookLifecyclePersistenceRegistered = true;
  const persist = () => {
    try {
      if (typeof window.__runbookPersistVisibleWorkingCase === 'function') {
        window.__runbookPersistVisibleWorkingCase();
      }
    } catch (err) {
      console.error('Unable to persist current Working Case:', err);
    }
  };
  window.addEventListener('pagehide', persist, {passive:true});
  window.addEventListener('beforeunload', persist, {passive:true});
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') persist();
  }, {passive:true});
})();




/* v10 Live Call dynamic issue helpers */
(function(){
  function issueHelperText(issue){
    const map = {
      "Internet Offline": "Ask: Is the whole school offline or only some users? Check WAN/firewall status, affected VLANs, and whether wired/wireless are both impacted.",
      "Slow Internet": "Ask: Is it all users or one area? Capture speed test, time started, affected VLAN/SSID, and whether issue is internal or external.",
      "No IP Address": "Check: VLAN, DHCP scope, MAC learning, port status, AP/client connection, and whether only one device or many devices are affected.",
      "Wireless Issue": "Check: SSID, AP name/location, client count, authentication, VLAN, DHCP, and whether wired works.",
      "Switch Port": "Capture switch name, port, link light, VLAN, MAC address, port status, and whether a known-good device/cable was tested.",
      "PoE Issue": "Check: device power, PoE draw, switch PoE budget, port status, cabling, and whether the device powers on a known-good port.",
      "Firewall / Filtering": "Capture source IP, user/device, destination URL/IP, application, time of test, action, rule, and URL category.",
      "DNS Issue": "Capture device IP, DNS server, domain failing, nslookup result, whether direct IP works, and whether issue is isolated.",
      "Printing Issue": "Capture printer IP/name, VLAN, affected users, wired/wireless, ping result, print server details, and recent changes.",
      "VoIP / Phones": "Capture phone MAC/IP, VLAN, switch port, PoE, DHCP, registration status, and whether issue is one phone or many.",
      "Speakers": "Capture speaker MAC/IP, switch/port, VLAN, PoE, link light, MAC learning, DHCP lease, and patching/outlet status.",
      "Authentication Issue": "Capture username/device, SSID/VLAN, auth method, time of failure, radius/log evidence, and whether other users are affected.",
      "Other": "Capture exact customer wording, scope, affected devices/users, when it started, and what has changed."
    };
    return map[issue] || "Select an issue type to see suggested call questions and evidence.";
  }

  function updateLiveCallHelpers(root){
    if (!root) return;
    root.querySelectorAll('select[name="issue_type"], [data-field-name="issue_type"] select').forEach(sel => {
      let helper = sel.closest('.field, label, div')?.querySelector('.issue-helper-text');
      const host = sel.closest('.field, div') || sel.parentElement;
      if (!helper && host) {
        helper = document.createElement('div');
        helper.className = 'issue-helper-text';
        host.appendChild(helper);
      }
      const render = () => { if (helper) helper.textContent = issueHelperText(sel.value); };
      sel.removeEventListener('change', render);
      sel.addEventListener('change', render);
      render();
    });
  }

  document.addEventListener('DOMContentLoaded', () => updateLiveCallHelpers(document), {once:true});
  document.addEventListener('runbook:page-rendered', () => updateLiveCallHelpers(document));
})();



/* v18 robust personal notes module - v8 per-note TXT import/export + autosaved editable saved notes */
(function(){
  function pnKey(){ return 'runbook:personalNotes:entries'; }
  function pnDraftKey(){ return 'runbook:personalNotes:draft'; }

  function pnLoad(){
    try { return JSON.parse(localStorage.getItem(pnKey()) || '[]'); }
    catch { return []; }
  }

  function pnSave(entries){ localStorage.setItem(pnKey(), JSON.stringify(entries || [])); }

  function pnLoadDraft(){
    try { return JSON.parse(localStorage.getItem(pnDraftKey()) || '{}'); }
    catch { return {}; }
  }

  function pnSaveDraft(draft){ localStorage.setItem(pnDraftKey(), JSON.stringify(draft || {})); }
  function pnClearDraft(){ localStorage.removeItem(pnDraftKey()); }

  function pnEsc(v){
    return String(v ?? '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function pnClean(v){ return String(v ?? '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim(); }

  function pnSafeFileName(value){
    const name = pnClean(value || 'personal-note')
      .replace(/[\\/:*?"<>|]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 80);
    return (name || 'personal-note') + '.txt';
  }

  function pnNoteToTxt(note){
    const title = pnClean(note?.title || 'Untitled Note');
    const category = pnClean(note?.category || '');
    const body = pnClean(note?.body || '');
    const savedAt = pnClean(note?.savedAt || '');
    return [
      `Title: ${title}`,
      category ? `Category: ${category}` : 'Category:',
      savedAt ? `Saved: ${savedAt}` : '',
      '',
      body
    ].filter((line, idx) => idx < 2 || line !== '').join('\n').trim() + '\n';
  }

  function pnTxtToNote(text, fallbackTitle){
    const raw = String(text || '').replace(/\r\n/g, '\n');
    const lines = raw.split('\n');
    let title = '';
    let category = '';
    let startIndex = 0;

    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      const line = lines[i].trim();
      if (/^Title\s*:/i.test(line)) {
        title = line.replace(/^Title\s*:/i, '').trim();
        startIndex = Math.max(startIndex, i + 1);
      } else if (/^Category\s*:/i.test(line)) {
        category = line.replace(/^Category\s*:/i, '').trim();
        startIndex = Math.max(startIndex, i + 1);
      } else if (/^Saved\s*:/i.test(line)) {
        startIndex = Math.max(startIndex, i + 1);
      }
    }

    let body = pnClean(lines.slice(startIndex).join('\n'));
    if (!title && body) {
      const first = body.split('\n').find(Boolean) || '';
      title = first.length <= 80 ? first : first.slice(0, 77) + '...';
    }

    return {
      title: pnClean(title || fallbackTitle || 'Imported Note'),
      category: pnClean(category),
      body: body,
      savedAt: new Date().toLocaleString('en-NZ', { hour12:false })
    };
  }

  function pnDownload(filename, text){
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  }

  function pnReadFile(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Could not read file.'));
      reader.readAsText(file);
    });
  }

  function pnSetStatus(text){
    const status = document.querySelector('[data-pn-status]');
    if (status) status.textContent = text || 'Autosaved locally.';
  }

  function pnAutosaveExisting(idx){
    const entries = pnLoad();
    if (!entries[idx]) return;
    const titleEl = document.querySelector(`[data-pn-edit-title="${idx}"]`);
    const categoryEl = document.querySelector(`[data-pn-edit-category="${idx}"]`);
    const bodyEl = document.querySelector(`[data-pn-edit-body="${idx}"]`);
    entries[idx] = {
      title: pnClean(titleEl?.value || '') || 'Untitled Note',
      category: pnClean(categoryEl?.value || ''),
      body: pnClean(bodyEl?.value || ''),
      savedAt: entries[idx].savedAt || new Date().toLocaleString('en-NZ', { hour12:false }),
      updatedAt: new Date().toLocaleString('en-NZ', { hour12:false })
    };
    pnSave(entries);
    pnSetStatus(`Autosaved note ${idx + 1}.`);
  }

  function pnAutosaveDraft(){
    const titleEl = document.querySelector('[data-pn-title]');
    const categoryEl = document.querySelector('[data-pn-category]');
    const bodyEl = document.querySelector('[data-pn-body]');
    pnSaveDraft({
      title: titleEl?.value || '',
      category: categoryEl?.value || '',
      body: bodyEl?.value || ''
    });
    pnSetStatus('Draft autosaved locally.');
  }

  function pnRender(){
    const host = document.querySelector('[data-personal-notes-root]');
    if (!host) return;

    const entries = pnLoad();
    const draft = pnLoadDraft();
    const cards = entries.length ? entries.map((note, idx) => `
      <details class="case-card personal-note-card">
        <summary>${pnEsc(note.title || `Note ${idx + 1}`)}${note.category ? `<span class="case-card-meta">${pnEsc(note.category)}</span>` : ''}</summary>
        <div class="case-card-body">
          <div class="form-grid personal-note-edit-grid">
            <div>
              <label>Note Title</label>
              <input type="text" data-pn-edit-title="${idx}" value="${pnEsc(note.title || `Note ${idx + 1}`)}">
            </div>
            <div>
              <label>Category</label>
              <input type="text" data-pn-edit-category="${idx}" value="${pnEsc(note.category || '')}">
            </div>
            <div class="full">
              <label>Note</label>
              <textarea class="personal-note-editor" data-pn-edit-body="${idx}" placeholder="Edit this note here. Changes autosave while you type.">${pnEsc(note.body || '')}</textarea>
            </div>
          </div>
          <div class="btnrow">
            <button class="btn secondary" type="button" data-pn-clear-body="${idx}">Clear Note Text</button>
            <button class="btn secondary" type="button" data-pn-copy="${idx}">Copy</button>
            <button class="btn secondary" type="button" data-pn-export="${idx}">Export TXT</button>
            <button class="btn secondary" type="button" data-pn-import-trigger="${idx}">Import TXT to this note</button>
            <input type="file" accept=".txt,text/plain" data-pn-import-file="${idx}" hidden>
            <button class="btn secondary" type="button" data-pn-delete="${idx}">Delete</button>
          </div>
          <div class="statusline">This note autosaves while you type. Import/Export works one saved note at a time only.</div>
        </div>
      </details>
    `).join('') : `<div class="notice">No personal notes saved yet.</div>`;

    host.innerHTML = `
      <div class="step personal-notes-tool">
        <details class="case-card" open>
          <summary>Add New Note</summary>
          <div class="case-card-body">
            <div class="form-grid">
              <div>
                <label>Note Title</label>
                <input type="text" data-pn-title value="${pnEsc(draft.title || '')}" placeholder="Example: Useful PoE checks">
              </div>
              <div>
                <label>Category</label>
                <input type="text" data-pn-category value="${pnEsc(draft.category || '')}" placeholder="Example: Ruckus / Palo Alto / Salesforce">
              </div>
              <div class="full">
                <label>Note</label>
                <textarea data-pn-body placeholder="Write your note here. This draft autosaves while you type.">${pnEsc(draft.body || '')}</textarea>
              </div>
            </div>
            <div class="btnrow">
              <button class="btn" type="button" data-pn-add>Add Note</button>
              <button class="btn secondary" type="button" data-pn-import-new-trigger>Import TXT as New Note</button>
              <input type="file" accept=".txt,text/plain" data-pn-import-new-file hidden>
            </div>
            <div class="statusline" data-pn-status>Draft and saved notes autosave locally. Use Add Note only to create the saved note card.</div>
          </div>
        </details>

        <div class="section-title">Saved Notes</div>
        ${cards}
      </div>
    `;

    document.querySelectorAll('[data-pn-title], [data-pn-category], [data-pn-body]').forEach(el => {
      el.addEventListener('input', () => { pnAutosaveDraft(); if (typeof autoResizeTextareas === 'function') autoResizeTextareas(host); });
    });

    document.querySelectorAll('[data-pn-edit-title], [data-pn-edit-category], [data-pn-edit-body]').forEach(el => {
      el.addEventListener('input', () => {
        const idx = Number(el.dataset.pnEditTitle ?? el.dataset.pnEditCategory ?? el.dataset.pnEditBody);
        pnAutosaveExisting(idx);
        if (typeof autoResizeTextareas === 'function') autoResizeTextareas(host);
      });
    });

    if (typeof autoResizeTextareas === 'function') autoResizeTextareas(host);
  }

  document.addEventListener('click', async function(e){
    const add = e.target.closest('[data-pn-add]');
    if (add) {
      const titleEl = document.querySelector('[data-pn-title]');
      const categoryEl = document.querySelector('[data-pn-category]');
      const bodyEl = document.querySelector('[data-pn-body]');

      const title = pnClean(titleEl?.value || '');
      const category = pnClean(categoryEl?.value || '');
      const body = pnClean(bodyEl?.value || '');

      if (!title && !body) return;

      const entries = pnLoad();
      entries.unshift({
        title: title || 'Untitled Note',
        category,
        body,
        savedAt: new Date().toLocaleString('en-NZ', { hour12:false })
      });

      pnSave(entries.slice(0, 200));
      pnClearDraft();
      pnRender();
      return;
    }

    const importNewTrigger = e.target.closest('[data-pn-import-new-trigger]');
    if (importNewTrigger) {
      document.querySelector('[data-pn-import-new-file]')?.click();
      return;
    }

    const clearBody = e.target.closest('[data-pn-clear-body]');
    if (clearBody) {
      const idx = Number(clearBody.dataset.pnClearBody);
      const bodyEl = document.querySelector(`[data-pn-edit-body="${idx}"]`);
      if (bodyEl) bodyEl.value = '';
      pnAutosaveExisting(idx);
      return;
    }

    const copy = e.target.closest('[data-pn-copy]');
    if (copy) {
      const idx = Number(copy.dataset.pnCopy);
      const note = pnLoad()[idx];
      if (!note) return;

      const text = [note.title, note.category ? `Category: ${note.category}` : '', note.body]
        .filter(Boolean).join('\n\n');

      try {
        await navigator.clipboard.writeText(text);
        copy.textContent = 'Copied';
        setTimeout(() => copy.textContent = 'Copy', 1200);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      return;
    }

    const exp = e.target.closest('[data-pn-export]');
    if (exp) {
      const idx = Number(exp.dataset.pnExport);
      const note = pnLoad()[idx];
      if (!note) return;
      pnDownload(pnSafeFileName(note.title || `note-${idx + 1}`), pnNoteToTxt(note));
      exp.textContent = 'Exported';
      setTimeout(() => exp.textContent = 'Export TXT', 1200);
      return;
    }

    const importTrigger = e.target.closest('[data-pn-import-trigger]');
    if (importTrigger) {
      const idx = Number(importTrigger.dataset.pnImportTrigger);
      document.querySelector(`[data-pn-import-file="${idx}"]`)?.click();
      return;
    }

    const del = e.target.closest('[data-pn-delete]');
    if (del) {
      const idx = Number(del.dataset.pnDelete);
      const entries = pnLoad();
      entries.splice(idx, 1);
      pnSave(entries);
      pnRender();
      return;
    }
  });

  document.addEventListener('change', async function(e){
    const importNew = e.target.closest('[data-pn-import-new-file]');
    if (importNew) {
      const file = importNew.files && importNew.files[0];
      importNew.value = '';
      if (!file) return;
      try {
        const text = await pnReadFile(file);
        const note = pnTxtToNote(text, file.name.replace(/\.txt$/i, ''));
        if (!note.title && !note.body) return;
        const entries = pnLoad();
        entries.unshift(note);
        pnSave(entries.slice(0, 200));
        pnClearDraft();
        pnRender();
      } catch { alert('Could not import the TXT file.'); }
      return;
    }

    const importExisting = e.target.closest('[data-pn-import-file]');
    if (importExisting) {
      const idx = Number(importExisting.dataset.pnImportFile);
      const file = importExisting.files && importExisting.files[0];
      importExisting.value = '';
      if (!file) return;
      try {
        const text = await pnReadFile(file);
        const imported = pnTxtToNote(text, file.name.replace(/\.txt$/i, ''));
        const entries = pnLoad();
        if (!entries[idx]) return;
        entries[idx] = imported;
        pnSave(entries);
        pnRender();
      } catch { alert('Could not import the TXT file.'); }
    }
  });

  // Render only when the Personal Notes page has just been created.
  document.addEventListener('runbook:page-rendered', () => {
    if (document.querySelector('[data-personal-notes-root]') && !document.querySelector('[data-pn-add]')) pnRender();
  });
  window.renderPersonalNotesStandalone = pnRender;
})();





/* v20 no-blank watchdog */
(function(){
  function ensureContent(){
    const content = document.getElementById('content');
    if (!content) return;
    if (!content.textContent.trim()) {
      try {
        const raw = location.hash.replace(/^#/, '').trim();
        const pageId = raw && window.RUNBOOK && window.RUNBOOK.pages && window.RUNBOOK.pages[raw] ? raw : 'case-working-template';
        if (typeof renderPage === 'function') renderPage(pageId);
      } catch (err) {
        content.innerHTML = '<div class="card"><h2>Runbook</h2><div class="notice">The page could not load. Please reload the runbook.</div></div>';
      }
    }
  }
  document.addEventListener('DOMContentLoaded', () => setTimeout(ensureContent, 300));
  document.addEventListener('runbook:page-rendered', ensureContent);
  setTimeout(ensureContent, 1000);
})();

/* v21-no-auto-expand */


/* v23 easy copy buttons for working-case fields */
(function(){
  const copyFieldNames = new Set([
    'raw_salesforce',
    'working_notes',
    'cli_findings',
    'final_output',
    'technical_summary',
    'ai_synopsis',
    'ai_troubleshooting',
    'my_next_checks',
    'cli_evidence',
    'evidence',
    'missing_evidence',
    'salesforce_notes',
    'customer_reply_draft',
    'learning_notes',
    'resolution_or_next_step',
    'live_call_classification'
  ]);

  const copyLabelFragments = [
    'Raw Intake',
    'Original Email Chain',
    'Raw Salesforce',
    'Raw Case / Email / CLI',
    'My Working Notes',
    'Checks Completed / Findings / CLI Results',
    'Salesforce Note / Outcome Summary',
    'Final Output',
    'Chat 1',
    'Technical Synopsis',
    'Chat 2',
    'Troubleshooting Plan',
    'My Next Checks',
    'CLI Evidence',
    'Evidence Collected',
    'Evidence Still Missing',
    'Final Salesforce Notes',
    'Customer Reply',
    'Learning Notes',
    'Action Summary',
    'Live Call Classification'
  ];

  function shouldCopyField(el){
    if (!el || !['TEXTAREA', 'INPUT'].includes(el.tagName)) return false;
    const name = el.getAttribute('name') || '';
    if (copyFieldNames.has(name)) return true;

    const field = el.closest('.field,.form-field,.full,div');
    const label = field ? field.querySelector('label') : null;
    const labelText = label ? label.textContent || '' : '';
    return copyLabelFragments.some(x => labelText.includes(x));
  }

  function findLabel(el){
    const field = el.closest('.field,.form-field,.full,div');
    if (field) {
      const label = field.querySelector('label');
      if (label) return label;
    }

    let prev = el.previousElementSibling;
    while (prev) {
      if (prev.tagName === 'LABEL') return prev;
      prev = prev.previousElementSibling;
    }

    return null;
  }

  async function copyText(text, btn){
    text = String(text || '');
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }

    if (btn) {
      const old = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = old || 'Copy';
        btn.classList.remove('copied');
      }, 1200);
    }
  }

  function addCopyButtons(){
    document.querySelectorAll('textarea, input[type="text"], input:not([type])').forEach(el => {
      if (!shouldCopyField(el)) return;
      if (el.dataset.v23CopyButton === 'true') return;

      const label = findLabel(el);
      if (!label) return;

      el.dataset.v23CopyButton = 'true';

      let wrap = label.closest('.copy-label-wrap');
      if (!wrap) {
        wrap = document.createElement('span');
        wrap.className = 'copy-label-wrap';
        label.parentNode.insertBefore(wrap, label);
        wrap.appendChild(label);
      }

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'field-copy-btn';
      btn.textContent = 'Copy';
      btn.title = 'Copy this field for Salesforce or working notes';
      btn.addEventListener('click', () => copyText(el.value, btn));
      wrap.appendChild(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', addCopyButtons);
  document.addEventListener('runbook:page-rendered', addCopyButtons);

  // Page navigation hooks above are sufficient; no continuous DOM observer.
})();


/* v24 copy buttons for simplified field names */
(function(){
  const names = ['raw_salesforce','working_notes','final_output','ai_synopsis','ai_troubleshooting','my_next_checks','cli_evidence','evidence','missing_evidence','salesforce_notes','customer_reply_draft','learning_notes','resolution_or_next_step','live_call_classification'];
  function copy(txt, btn){
    navigator.clipboard?.writeText(txt).then(() => {
      const old = btn.textContent; btn.textContent='Copied';
      setTimeout(() => btn.textContent=old, 1000);
    }).catch(() => {});
  }
  function ensure(){
    names.forEach(name => {
      document.querySelectorAll(`[name="${name}"]`).forEach(el => {
        if (el.dataset.v24copy) return;
        const parent = el.parentElement;
        if (!parent) return;
        const label = parent.querySelector('label');
        if (!label) return;
        el.dataset.v24copy = '1';
        if (parent.querySelector(`[data-copy-for="${name}"]`)) return;
        const btn = document.createElement('button');
        btn.type='button';
        btn.className='field-copy-btn';
        btn.dataset.copyFor=name;
        btn.textContent='Copy';
        btn.addEventListener('click', () => copy(el.value || '', btn));
        label.insertAdjacentElement('afterend', btn);
      });
    });
  }
  document.addEventListener('DOMContentLoaded', ensure);
  document.addEventListener('runbook:page-rendered', ensure);
  // Page navigation hooks above are sufficient; no continuous DOM observer.
})();




/* v27-tier2-tracking-update */




/* v27 true collapsible Working Case fields */
(function(){
  function copyPlain(text){
    text = String(text || '');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  function refreshCollapsibleState(root=document){
    root.querySelectorAll('details.collapsible-field').forEach(details => {
      const state = details.querySelector('.collapsible-state');
      if (state) state.textContent = details.open ? 'Open - scroll inside field' : 'Click to expand';
      const textarea = details.querySelector('textarea.collapsible-textarea');
      if (textarea) {
        textarea.classList.add('no-autoexpand');
        textarea.style.height = details.open ? '320px' : '0px';
        textarea.style.maxHeight = details.open ? '320px' : '0px';
        textarea.style.overflowY = details.open ? 'auto' : 'hidden';
      }
    });
  }

  document.addEventListener('click', async function(e){
    const copyBtn = e.target.closest('[data-copy-collapsible]');
    if (!copyBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const details = copyBtn.closest('details.collapsible-field');
    const textarea = details ? details.querySelector('textarea[data-field]') : null;
    await copyPlain(textarea ? textarea.value : '');

    const old = copyBtn.textContent;
    copyBtn.textContent = 'Copied';
    setTimeout(() => copyBtn.textContent = old || 'Copy', 1000);
  }, true);

  document.addEventListener('toggle', function(e){
    if (e.target && e.target.matches && e.target.matches('details.collapsible-field')) {
      refreshCollapsibleState(e.target.parentElement || document);
    }
  }, true);

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => refreshCollapsibleState(), 200));
  document.addEventListener('runbook:page-rendered', () => refreshCollapsibleState());

  // Collapsible state updates on DOM ready, navigation and toggle events.
})();

/* v38: universal scratchpad, template variables, breadcrumbs, escalation validation, PWA install */
(function(){
  'use strict';
  const LS = {
    scratchGlobal: 'runbook:v38:scratchpad:global',
    scratchPagePrefix: 'runbook:v38:scratchpad:page:',
    vars: 'runbook:v38:template-variables'
  };
  const getPageId = () => (location.hash || '#runbook-home').replace(/^#/, '') || 'runbook-home';
  const load = (k, d='') => { const v=localStorage.getItem(k); return v==null?d:v; };
  const save = (k,v) => localStorage.setItem(k, String(v ?? ''));
  const loadObj = (k,d={}) => { try { return JSON.parse(localStorage.getItem(k)||'null') || d; } catch { return d; } };
  const saveObj = (k,v) => localStorage.setItem(k, JSON.stringify(v));
  const esc2 = v => String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function pagePath(pageId){
    const groups=(window.RUNBOOK&&window.RUNBOOK.groups)||[];
    let found=null;
    function walk(items,path){
      for(const item of items||[]){
        const next=[...path,item.title||item.id||'Untitled'];
        if(item.id===pageId){ found=next; return true; }
        if(item.items&&walk(item.items,next)) return true;
      }
      return false;
    }
    for(const g of groups){ if(walk(g.items||[],[g.title||'Runbook'])) break; }
    return found || [((window.RUNBOOK&&window.RUNBOOK.pages&&window.RUNBOOK.pages[pageId]||{}).title||pageId)];
  }
  function renderBreadcrumbs(){
    const pageId=getPageId();
    const card=document.querySelector('#content .page-card');
    if(!card || pageId==='runbook-home') return;
    card.querySelector('.runbook-breadcrumbs')?.remove();
    const path=pagePath(pageId);
    const nav=document.createElement('nav'); nav.className='runbook-breadcrumbs'; nav.setAttribute('aria-label','Breadcrumb');
    let html='<a href="#runbook-home">Home</a>';
    path.forEach((name,i)=>{ html += '<span class="crumb-sep">›</span>' + (i===path.length-1 ? `<span class="crumb-current">${esc2(name)}</span>` : `<span>${esc2(name)}</span>`); });
    nav.innerHTML=html;
    const heading=card.querySelector('.page-heading');
    if(heading) heading.insertAdjacentElement('afterend',nav); else card.prepend(nav);
  }

  function ensureShell(){
    if(document.querySelector('.workflow-fab-stack')) return;
    const stack=document.createElement('div'); stack.className='workflow-fab-stack';
    stack.innerHTML='<button class="workflow-fab variables" type="button" data-open-vars>Template Variables</button><button class="workflow-fab" type="button" data-open-scratch>Scratchpad</button>';
    document.body.appendChild(stack);
    const backdrop=document.createElement('div'); backdrop.className='workflow-drawer-backdrop'; backdrop.hidden=true; document.body.appendChild(backdrop);
    const scratch=document.createElement('aside'); scratch.className='workflow-drawer'; scratch.id='universalScratchpad'; scratch.innerHTML=`
      <div class="workflow-drawer-head"><div><h2>Universal Scratchpad</h2><div class="muted">Saved automatically in this browser.</div></div><button class="drawer-close" type="button" aria-label="Close">×</button></div>
      <div class="scratchpad-tabs"><button class="scratchpad-tab active" data-scratch-tab="global">Global</button><button class="scratchpad-tab" data-scratch-tab="case">Current case</button><button class="scratchpad-tab" data-scratch-tab="page">Current page</button></div>
      <textarea class="scratchpad-area" data-scratch-area placeholder="Keep temporary IPs, MAC addresses, VLANs, commands, customer details, and working notes here..."></textarea>
      <div class="drawer-status" data-scratch-status>Autosaved locally.</div>
      <div class="drawer-actions"><button class="btn secondary" type="button" data-copy-scratch>Copy</button><button class="btn secondary danger-clear" type="button" data-clear-scratch>Clear current tab</button></div>`;
    document.body.appendChild(scratch);
    const vars=document.createElement('aside'); vars.className='workflow-drawer'; vars.id='templateVariables'; vars.innerHTML=`
      <div class="workflow-drawer-head"><div><h2>Template Variables</h2><div class="muted">Reusable values for email and escalation forms.</div></div><button class="drawer-close" type="button" aria-label="Close">×</button></div>
      <p class="template-vars-note">Save common case details once, then apply them to the currently open template. Existing non-empty fields are preserved unless you choose overwrite.</p>
      <div class="template-vars-grid">
        <div><label>Recipient Name</label><input data-var="to_name"></div><div><label>Case Number</label><input data-var="ticket_number"></div>
        <div class="full"><label>Account / School Name</label><input data-var="school_name"></div>
        <div><label>Contact Name</label><input data-var="contact_name"></div><div><label>Subject</label><input data-var="subject"></div>
        <div><label>Contact Phone</label><input data-var="contact_phone"></div><div><label>Contact Mobile</label><input data-var="contact_mobile"></div>
        <div class="full"><label>Contact Email</label><input data-var="contact_email"></div>
        <div class="full"><label>Reusable Custom Detail</label><textarea data-var="custom_value" rows="5"></textarea></div>
      </div>
      <div class="drawer-status" data-vars-status>Saved locally.</div>
      <div class="drawer-actions"><button class="btn" type="button" data-apply-vars>Apply to blank fields</button><button class="btn secondary" type="button" data-overwrite-vars>Overwrite matching fields</button><button class="btn secondary" type="button" data-load-vars>Load from current form</button><button class="btn secondary danger-clear" type="button" data-clear-vars>Clear variables</button></div>`;
    document.body.appendChild(vars);

    const closeAll=()=>{ document.querySelectorAll('.workflow-drawer').forEach(d=>d.classList.remove('open')); backdrop.hidden=true; };
    function openDrawer(el){ closeAll(); el.classList.add('open'); backdrop.hidden=false; }
    stack.querySelector('[data-open-scratch]').onclick=()=>{ openDrawer(scratch); setScratchMode(scratch.dataset.mode||'global'); };
    stack.querySelector('[data-open-vars]').onclick=()=>{ openDrawer(vars); refreshVars(); };
    backdrop.onclick=closeAll; document.querySelectorAll('.drawer-close').forEach(b=>b.onclick=closeAll);
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeAll(); });

    function currentCaseScratchId(){
      const selected=document.querySelector('#content [data-slot-tab].active');
      let slot=Number(selected?.dataset.slotNo||0);
      if(!slot) slot=Number(localStorage.getItem('runbook:case-working-template:workingCase:active-slot')||0);
      if(!slot) return 'unassigned';
      let values={};
      try{ values=JSON.parse(localStorage.getItem('runbook:case-working-template:workingCase:slot:'+slot)||'{}'); }catch{}
      const ticket=String(values.ticket_number||values.case_number||'').replace(/^#/,'').trim();
      return ticket ? 'ticket-'+ticket : 'slot-'+slot;
    }
    function scratchKey(mode){
      if(mode==='page') return LS.scratchPagePrefix+getPageId();
      if(mode==='case') return 'runbook:v45:scratchpad:case:'+currentCaseScratchId();
      return LS.scratchGlobal;
    }
    function setScratchMode(mode){ scratch.dataset.mode=mode; scratch.querySelectorAll('[data-scratch-tab]').forEach(b=>b.classList.toggle('active',b.dataset.scratchTab===mode)); scratch.querySelector('[data-scratch-area]').value=load(scratchKey(mode),''); }
    scratch.querySelectorAll('[data-scratch-tab]').forEach(b=>b.onclick=()=>setScratchMode(b.dataset.scratchTab));
    const area=scratch.querySelector('[data-scratch-area]');
    area.addEventListener('input',()=>{ save(scratchKey(scratch.dataset.mode||'global'),area.value); scratch.querySelector('[data-scratch-status]').textContent='Autosaved locally · '+new Date().toLocaleTimeString('en-NZ',{hour:'2-digit',minute:'2-digit'}); });
    scratch.querySelector('[data-copy-scratch]').onclick=async()=>{ try{ await navigator.clipboard.writeText(area.value||''); }catch{} };
    scratch.querySelector('[data-clear-scratch]').onclick=()=>{ area.value=''; save(scratchKey(scratch.dataset.mode||'global'),''); };
    setScratchMode('global');

    function collectVars(){ const out={}; vars.querySelectorAll('[data-var]').forEach(el=>out[el.dataset.var]=el.value||''); return out; }
    function persistVars(){ saveObj(LS.vars,collectVars()); vars.querySelector('[data-vars-status]').textContent='Saved locally · '+new Date().toLocaleTimeString('en-NZ',{hour:'2-digit',minute:'2-digit'}); }
    function refreshVars(){ const obj=loadObj(LS.vars,{}); vars.querySelectorAll('[data-var]').forEach(el=>el.value=obj[el.dataset.var]||''); }
    vars.querySelectorAll('[data-var]').forEach(el=>el.addEventListener('input',persistVars));
    function currentForm(){ return document.querySelector('#content [data-generator-form], #content [data-slot-form]'); }
    function applyVars(overwrite){ const obj=collectVars(); const root=currentForm(); if(!root){ vars.querySelector('[data-vars-status]').textContent='Open a template or escalation form first.'; return; } let count=0;
      Object.entries(obj).forEach(([name,val])=>{ if(!val) return; let field=root.querySelector(`[data-field="${CSS.escape(name)}"]`); if(!field && name==='to_name') field=root.querySelector('[data-field="contact_name"]'); if(!field && name==='custom_value') field=root.querySelector('[data-field="url"], [data-field="custom_value"]'); if(field && (overwrite || !String(field.value||'').trim())){ field.value=val; field.dispatchEvent(new Event('input',{bubbles:true})); field.dispatchEvent(new Event('change',{bubbles:true})); count++; }});
      vars.querySelector('[data-vars-status]').textContent=`Applied ${count} value${count===1?'':'s'} to the current form.`;
    }
    vars.querySelector('[data-apply-vars]').onclick=()=>applyVars(false); vars.querySelector('[data-overwrite-vars]').onclick=()=>applyVars(true);
    vars.querySelector('[data-load-vars]').onclick=()=>{ const root=currentForm(); if(!root) return; const obj=loadObj(LS.vars,{}); root.querySelectorAll('[data-field]').forEach(el=>{ const n=el.dataset.field; if(n in obj || ['to_name','ticket_number','school_name','contact_name','subject','contact_phone','contact_mobile','contact_email','custom_value'].includes(n)) obj[n]=el.value||''; }); if(!obj.to_name && obj.contact_name) obj.to_name=obj.contact_name; saveObj(LS.vars,obj); refreshVars(); vars.querySelector('[data-vars-status]').textContent='Loaded matching values from the current form.'; };
    vars.querySelector('[data-clear-vars]').onclick=()=>{ saveObj(LS.vars,{}); refreshVars(); };
    refreshVars();
  }

  const escalationRules={
    'template-tier2':[['ticket_number','Case number'],['school_name','Account name'],['reason','Escalation reason'],['issue_summary','Issue summary'],['troubleshooting_summary','Troubleshooting completed'],['evidence','Evidence collected'],['contact_info','Contact information']],
    'template-mn3-truck-roll':[['isolation_test','Isolation test'],['ont_power_cycled','ONT power cycle'],['site_contact_name','Site contact'],['site_contact_mobile','Contact mobile'],['site_access','Site access details']],
    'template-p2-googlechat':[['ticket_number','Case number'],['school_name','Account name'],['issue_summary','Issue summary'],['steps_taken','Troubleshooting steps'],['next_steps','Next action']],
    'template-internet-speed':[['school_name','Account name'],['best_technical_contact','Technical contact'],['website_scope','Website scope'],['speedtest','Speed test'],['next_steps','Next action']]
  };
  function addValidation(){
    const pageId=getPageId(), rules=escalationRules[pageId]; if(!rules) return;
    const form=document.querySelector('#content [data-generator-form]'); if(!form) return;
    form.querySelector('.escalation-validation')?.remove();
    const panel=document.createElement('section'); panel.className='escalation-validation'; panel.innerHTML='<div class="validation-head"><div class="validation-title">Escalation Readiness</div><span class="validation-badge incomplete" data-validation-badge>Needs review</span></div><div class="validation-list" data-validation-list></div><div class="validation-help">This check is advisory only. It does not block generation or copying.</div>';
    const row=form.querySelector('.generate-row'); if(row) row.before(panel); else form.prepend(panel);
    function update(){ let complete=0; const list=panel.querySelector('[data-validation-list]'); list.innerHTML=''; rules.forEach(([name,label])=>{ const el=form.querySelector(`[data-field="${CSS.escape(name)}"]`); const ok=!!(el&&String(el.value||'').trim()); if(ok) complete++; const item=document.createElement('div'); item.className='validation-item '+(ok?'ok':'missing'); item.innerHTML=`<span>${ok?'✓':'!'}</span><span>${esc2(label)}</span>`; list.appendChild(item); }); const badge=panel.querySelector('[data-validation-badge]'); const ready=complete===rules.length; badge.className='validation-badge '+(ready?'ready':'incomplete'); badge.textContent=ready?'Ready to escalate':`${complete}/${rules.length} complete`; }
    form.addEventListener('input',update); form.addEventListener('change',update); update();
  }

  function enhance(){
    ensureShell();
    renderBreadcrumbs();
    addValidation();
    // Template Variables and Scratchpad are universal workflow tools.
    // Keep both launch buttons visible on every runbook page, including
    // Working Case Workspace, rather than hiding Template Variables by page type.
    const varsBtn=document.querySelector('[data-open-vars]');
    if(varsBtn) varsBtn.hidden=false;
  }
  document.addEventListener('DOMContentLoaded', enhance);
  document.addEventListener('runbook:page-rendered', enhance);
  // Enhancements run on DOM ready and page navigation only.
})();


/* v45: split workspace, case scratchpad, command favourites, archive tools, display density */
(function(){
  'use strict';
  const LS={
    density:'runbook:v45:density',
    commandFavorites:'runbook:v45:command-favorites',
    splitOpen:'runbook:v45:split-open',
    splitWidth:'runbook:v45:split-width',
    kbEntries:'runbook:caseKnowledgebase:entries'
  };
  const read=(k,d='')=>{const v=localStorage.getItem(k);return v==null?d:v};
  const readObj=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch{return d}};
  const writeObj=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const escV=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy=async text=>{try{await navigator.clipboard.writeText(String(text||''));}catch{const t=document.createElement('textarea');t.value=String(text||'');document.body.appendChild(t);t.select();document.execCommand('copy');t.remove();}};
  function selectedSlot(){
    const el=document.querySelector('#content [data-slot-tab].active');
    return Number(el?.dataset.slotNo||localStorage.getItem('runbook:case-working-template:workingCase:active-slot')||0);
  }
  function slotValues(slot){try{return JSON.parse(localStorage.getItem('runbook:case-working-template:workingCase:slot:'+slot)||'{}')}catch{return {}}}
  function caseScratchKey(slot){const v=slotValues(slot);const ticket=String(v.ticket_number||v.case_number||'').replace(/^#/,'').trim();return 'runbook:v45:scratchpad:case:'+(ticket?'ticket-'+ticket:'slot-'+(slot||'unassigned'));}

  // Display density setting
  function applyDensity(v){v=['compact','comfortable','large'].includes(v)?v:'comfortable';document.body.dataset.density=v;localStorage.setItem(LS.density,v);const s=document.querySelector('[data-density-select]');if(s)s.value=v;}
  function ensureDensity(){
    if(document.querySelector('[data-density-select]')) return;
    const actions=document.querySelector('.top-actions')||document.querySelector('.topbar'); if(!actions)return;
    const wrap=document.createElement('label');wrap.className='density-control';wrap.title='Display density';wrap.innerHTML='<span>Density</span><select data-density-select aria-label="Display density"><option value="compact">Compact</option><option value="comfortable">Comfortable</option><option value="large">Large text</option></select>';
    actions.appendChild(wrap);wrap.querySelector('select').addEventListener('change',e=>applyDensity(e.target.value));applyDensity(read(LS.density,'comfortable'));
  }

  // Split-screen current-case panel
  function splitWidthBounds(){
    const viewport=Math.max(document.documentElement.clientWidth||0,window.innerWidth||0);
    return {min:300,max:Math.max(300,Math.min(760,viewport-360))};
  }
  function applySplitWidth(value,save=false){
    const bounds=splitWidthBounds();
    let width=Number.parseInt(value,10);
    if(!Number.isFinite(width)) width=390;
    width=Math.max(bounds.min,Math.min(bounds.max,width));
    document.documentElement.style.setProperty('--case-split-width',width+'px');
    if(save)localStorage.setItem(LS.splitWidth,String(width));
    return width;
  }
  function ensureSplit(){
    if(document.getElementById('caseSplitPanel')) return;
    const actions=document.querySelector('.top-actions')||document.querySelector('.topbar'); if(!actions)return;
    applySplitWidth(read(LS.splitWidth,'390'));
    const btn=document.createElement('button');btn.className='btn top-action-btn';btn.type='button';btn.dataset.toggleSplit='';btn.innerHTML='<span>◫</span> Split View';actions.appendChild(btn);
    const panel=document.createElement('aside');panel.id='caseSplitPanel';panel.className='case-split-panel';panel.innerHTML=`<div class="case-split-resizer" data-split-resizer role="separator" aria-label="Resize split view" aria-orientation="vertical" tabindex="0" title="Drag to resize the split view"></div><div class="case-split-head"><div><small>ACTIVE WORKSPACE</small><h2>Current Case</h2></div><button type="button" class="drawer-close" data-close-split>×</button></div><div data-split-case></div><div class="case-split-scratch"><label>Case-specific scratchpad</label><textarea data-split-scratch placeholder="IP, MAC, VLAN, commands, findings and temporary notes..."></textarea><div class="drawer-status" data-split-status>Autosaved for this case.</div></div><div class="drawer-actions"><a class="btn" href="#case-working-template">Open Working Case Workspace</a><button class="btn secondary" type="button" data-copy-split>Copy scratchpad</button></div>`;
    document.body.appendChild(panel);
    const setOpen=o=>{document.body.classList.toggle('split-view-open',!!o);localStorage.setItem(LS.splitOpen,o?'1':'0');if(o)refreshSplit();};
    btn.onclick=()=>setOpen(!document.body.classList.contains('split-view-open'));panel.querySelector('[data-close-split]').onclick=()=>setOpen(false);
    const dock=document.querySelector('.workflow-fab-stack');
    if(dock && !dock.querySelector('[data-open-split-dock]')){
      const dockBtn=document.createElement('button');
      dockBtn.className='workflow-fab split-dock-fab';
      dockBtn.type='button';
      dockBtn.dataset.openSplitDock='';
      dockBtn.textContent='Split View';
      dockBtn.onclick=()=>btn.click();
      dock.appendChild(dockBtn);
    }
    const resizer=panel.querySelector('[data-split-resizer]');
    let resizing=false;
    const resizeToPointer=e=>applySplitWidth(window.innerWidth-e.clientX,true);
    const stopResize=()=>{
      if(!resizing)return;
      resizing=false;
      document.body.classList.remove('split-resizing');
      window.removeEventListener('pointermove',resizeToPointer);
      window.removeEventListener('pointerup',stopResize);
      window.removeEventListener('pointercancel',stopResize);
    };
    resizer.addEventListener('pointerdown',e=>{
      if(window.matchMedia('(max-width: 900px)').matches)return;
      resizing=true;
      e.preventDefault();
      resizer.setPointerCapture?.(e.pointerId);
      document.body.classList.add('split-resizing');
      window.addEventListener('pointermove',resizeToPointer);
      window.addEventListener('pointerup',stopResize);
      window.addEventListener('pointercancel',stopResize);
    });
    resizer.addEventListener('keydown',e=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      e.preventDefault();
      const current=Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue('--case-split-width'),10)||390;
      const bounds=splitWidthBounds();
      const next=e.key==='Home'?bounds.min:e.key==='End'?bounds.max:current+(e.key==='ArrowLeft'?20:-20);
      applySplitWidth(next,true);
    });
    window.addEventListener('resize',()=>applySplitWidth(read(LS.splitWidth,'390')),{passive:true});
    const ta=panel.querySelector('[data-split-scratch]');
    ta.addEventListener('input',()=>{localStorage.setItem(caseScratchKey(selectedSlot()),ta.value);panel.querySelector('[data-split-status]').textContent='Autosaved · '+new Date().toLocaleTimeString('en-NZ',{hour:'2-digit',minute:'2-digit'});});
    panel.querySelector('[data-copy-split]').onclick=()=>copy(ta.value);
    if(read(LS.splitOpen,'0')==='1')setOpen(true);
  }
  function refreshSplit(){
    const panel=document.getElementById('caseSplitPanel');if(!panel)return;
    const slot=Number(localStorage.getItem('runbook:case-working-template:workingCase:active-slot')||selectedSlot()||0);const v=slotValues(slot);const box=panel.querySelector('[data-split-case]');
    if(!slot||!Object.values(v).some(x=>String(x||'').trim())) box.innerHTML='<div class="notice">No Current Active case. Start a Phone Call / New Case or move a parked case to Current Active.</div>';
    else box.innerHTML=`<div class="split-case-card"><div class="split-case-number">${escV(v.ticket_number||v.case_number||'No case #')}</div><h3>${escV(v.subject||'Untitled case')}</h3><p><strong>${escV(v.school_name||v.account_name||'No account')}</strong></p><dl><dt>MoE number</dt><dd>${escV(v.moe_id||'—')}</dd><dt>Firewall ID</dt><dd>${escV(v.firewall_id||'—')}</dd></dl></div>`;
    panel.querySelector('[data-split-scratch]').value=read(caseScratchKey(slot),'');
  }

  // Command favourites
  function favorites(){return readObj(LS.commandFavorites,[])}
  function saveFavorites(v){writeObj(LS.commandFavorites,v.slice(0,100));renderFavorites();enhanceCommands();}
  function ensureFavorites(){
    if(document.getElementById('commandFavoritesDrawer'))return;
    const stack=document.querySelector('.workflow-fab-stack')||document.body.appendChild(Object.assign(document.createElement('div'),{className:'workflow-fab-stack'}));
    const btn=document.createElement('button');btn.className='workflow-fab command-fav-fab';btn.type='button';btn.textContent='★ Commands';btn.dataset.openCommandFav='';stack.prepend(btn);
    const drawer=document.createElement('aside');drawer.id='commandFavoritesDrawer';drawer.className='workflow-drawer';drawer.innerHTML='<div class="workflow-drawer-head"><div><h2>Command Favourites</h2><div class="muted">Pinned CLI commands available from every page.</div></div><button class="drawer-close" type="button">×</button></div><div data-command-fav-list></div>';
    document.body.appendChild(drawer);
    btn.onclick=()=>drawer.classList.toggle('open');drawer.querySelector('.drawer-close').onclick=()=>drawer.classList.remove('open');renderFavorites();
  }
  function enhanceCommands(){
    const fav=favorites();document.querySelectorAll('.codewrap').forEach(w=>{if(w.querySelector('[data-command-favorite]'))return;const code=(w.querySelector('code')?.textContent||'').trim();if(!code)return;const b=document.createElement('button');b.type='button';b.className='command-favorite-btn';b.dataset.commandFavorite='';b.title='Add or remove command favourite';b.textContent=fav.includes(code)?'★':'☆';b.classList.toggle('saved',fav.includes(code));b.onclick=()=>{let a=favorites();a=a.includes(code)?a.filter(x=>x!==code):[code,...a];saveFavorites(a)};(w.querySelector('.code-actions')||w).appendChild(b);});
  }
  function renderFavorites(){const root=document.querySelector('[data-command-fav-list]');if(!root)return;const a=favorites();root.innerHTML=a.length?a.map((c,i)=>`<div class="command-fav-card"><pre><code>${escV(c)}</code></pre><div class="btnrow"><button class="btn secondary" data-copy-command-fav="${i}">Copy</button><button class="btn secondary danger-clear" data-remove-command-fav="${i}">Remove</button></div></div>`).join(''):'<div class="notice">No pinned commands yet. Use the ☆ button on any command block.</div>';root.querySelectorAll('[data-copy-command-fav]').forEach(b=>b.onclick=()=>copy(a[Number(b.dataset.copyCommandFav)]));root.querySelectorAll('[data-remove-command-fav]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.removeCommandFav);const x=favorites();x.splice(n,1);saveFavorites(x)});}

  // Case Knowledgebase controls and restore
  function entries(){return readObj(LS.kbEntries,[])}
  function firstEmptySlot(){for(let i=1;i<=100;i++){const v=slotValues(i);if(!Object.values(v).some(x=>String(x||'').trim()))return i}return 0}
  function restoreEntry(idx,toActive){const a=entries(),e=a[idx];if(!e)return;const slot=firstEmptySlot();if(!slot){alert('No empty Working Case slots are available.');return;}localStorage.setItem('runbook:case-working-template:workingCase:slot:'+slot,JSON.stringify(e.values||{}));localStorage.setItem('runbook:case-working-template:workingCase:slot:'+slot+':outputs',JSON.stringify({working:''}));localStorage.setItem('runbook:case-working-template:workingCase:slot:'+slot+':sf_import','');if(toActive)localStorage.setItem('runbook:case-working-template:workingCase:active-slot',String(slot));a.splice(idx,1);writeObj(LS.kbEntries,a);location.hash='#case-working-template';setTimeout(()=>location.reload(),60)}
  function enhanceKnowledgebase(){
    const input=document.querySelector('[data-kb-search-input]'),list=document.querySelector('[data-kb-list]');if(!input||!list||input.dataset.ready)return;input.dataset.ready='1';const sort=document.querySelector('[data-kb-sort]'),count=document.querySelector('[data-kb-result-count]');
    const apply=()=>{const q=input.value.trim().toLowerCase();let cards=[...list.querySelectorAll('.kb-case-card')];cards.forEach(c=>c.hidden=!!q&&!c.dataset.kbSearch.includes(q));const visible=cards.filter(c=>!c.hidden);visible.sort((a,b)=>{if(sort.value==='az')return a.dataset.kbSearch.localeCompare(b.dataset.kbSearch);const av=Date.parse(a.dataset.kbDate)||0,bv=Date.parse(b.dataset.kbDate)||0;return sort.value==='oldest'?av-bv:bv-av});visible.forEach(c=>list.appendChild(c));count.textContent=visible.length+' case'+(visible.length===1?'':'s');};input.oninput=apply;sort.onchange=apply;apply();
    list.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;let idx;if(b.dataset.copyKbEntry!=null){idx=Number(b.dataset.copyKbEntry);const e2=entries()[idx];if(e2)copy(JSON.stringify(e2.values||{},null,2));}else if(b.dataset.deleteKbEntry!=null){idx=Number(b.dataset.deleteKbEntry);const a=entries();a.splice(idx,1);writeObj(LS.kbEntries,a);location.reload();}else if(b.dataset.restoreKbActive!=null)restoreEntry(Number(b.dataset.restoreKbActive),true);else if(b.dataset.restoreKbPark!=null)restoreEntry(Number(b.dataset.restoreKbPark),false);});
  }

  function ensureUtilityDockToggle(){
    const stack=document.querySelector('.workflow-fab-stack');
    if(!stack) return;
    let toggle=stack.querySelector('[data-toggle-utility-dock]');
    if(!toggle){
      toggle=document.createElement('button');
      toggle.className='workflow-fab utility-dock-toggle';
      toggle.type='button';
      toggle.dataset.toggleUtilityDock='';
      stack.prepend(toggle);
      toggle.addEventListener('click',()=>{
        const collapsed=!stack.classList.contains('collapsed');
        stack.classList.toggle('collapsed',collapsed);
        localStorage.setItem('runbook:utilityDockCollapsed',collapsed?'1':'0');
        updateUtilityDockToggle(stack,toggle);
      });
    }
    const saved=localStorage.getItem('runbook:utilityDockCollapsed');
    const collapsed=saved==null ? true : saved==='1';
    stack.classList.toggle('collapsed',collapsed);
    updateUtilityDockToggle(stack,toggle);
  }
  function updateUtilityDockToggle(stack,toggle){
    const collapsed=stack.classList.contains('collapsed');
    toggle.textContent=collapsed?'☰ Tools':'× Hide tools';
    toggle.setAttribute('aria-expanded',collapsed?'false':'true');
    toggle.title=collapsed?'Show runbook tools':'Hide runbook tools';
  }

  function enhance(){ensureDensity();ensureSplit();ensureFavorites();ensureUtilityDockToggle();enhanceCommands();enhanceKnowledgebase();refreshSplit();}
  document.addEventListener('DOMContentLoaded', enhance);
  document.addEventListener('runbook:page-rendered', enhance);
  document.addEventListener('input',e=>{if(e.target.closest('[data-slot-form]'))setTimeout(refreshSplit,80)});
  document.addEventListener('click',e=>{if(e.target.closest('[data-slot-tab],[data-move-slot-to-working],[data-clear-slot]'))setTimeout(refreshSplit,180)});
  // Enhancements run on DOM ready and page navigation only.
})();

/* v49 visual-only shell refinements */
(function(){
  'use strict';
  function buildViewMenu(){
    const actions=document.querySelector('.top-actions')||document.querySelector('.topbar');
    if(!actions||actions.querySelector('.view-menu')) return;
    const theme=document.getElementById('btnTheme');
    const density=actions.querySelector('.density-control');
    const split=actions.querySelector('[data-toggle-split]');
    if(!theme||!density||!split) return;
    const menu=document.createElement('details'); menu.className='view-menu';
    menu.innerHTML='<summary>View</summary><div class="view-menu-panel"></div>';
    const panel=menu.querySelector('.view-menu-panel');
    actions.appendChild(menu); panel.append(theme,density,split);
    document.addEventListener('click',e=>{if(menu.open&&!menu.contains(e.target))menu.open=false;});
  }
  function refineActiveCase(){
    let anyActiveCase=false;
    document.querySelectorAll('.parked-ticket-group').forEach(group=>{
      const row=group.querySelector('.ticket-tabrow');
      const hasCase=!!row?.querySelector('[data-slot-tab]');
      if(hasCase) anyActiveCase=true;
      group.classList.toggle('active-case-empty',!hasCase);
      if(row&&!hasCase&&!row.querySelector('.active-empty-message')){
        row.innerHTML='<div class="active-empty-message"><strong>No active case</strong>Select a parked case and use the move button, or start a Phone Call / New Case.</div>';
      }
    });
    document.querySelectorAll('[data-modern-case-desk]').forEach(desk=>{
      desk.classList.toggle('has-active-case',anyActiveCase);
      desk.classList.toggle('no-active-case',!anyActiveCase);
    });
  }
  function refine(){buildViewMenu();refineActiveCase();}
  document.addEventListener('DOMContentLoaded', refine);
  document.addEventListener('runbook:page-rendered', refine);
  // Visual refinements run on DOM ready and page navigation only.
})();

/* v56 safe universal green-tick feedback for every copy control */
(function enableUniversalCopyFeedback(){
  'use strict';

  const activeTimers = new WeakMap();

  function isCopyControl(element){
    if (!element) return false;

    const attributes = Array.from(element.attributes || []);
    const hasCopyAttribute = attributes.some(attribute =>
      /copy/i.test(attribute.name) ||
      (attribute.name === 'onclick' && /copy/i.test(attribute.value || ''))
    );

    const label = [
      element.textContent || '',
      element.getAttribute?.('aria-label') || '',
      element.getAttribute?.('title') || ''
    ].join(' ');

    return hasCopyAttribute || /\bcopy\b/i.test(label);
  }

  function showCopiedTick(control){
    if (!control || !control.isConnected) return;

    const previousTimer = activeTimers.get(control);
    if (previousTimer) window.clearTimeout(previousTimer);

    control.querySelectorAll(':scope > .copy-success-tick').forEach(node => node.remove());
    control.classList.add('copy-success-state');

    const tick = document.createElement('span');
    tick.className = 'copy-success-tick';
    tick.setAttribute('aria-hidden', 'true');
    tick.textContent = '✓';
    control.appendChild(tick);

    const timer = window.setTimeout(() => {
      if (!control.isConnected) return;
      control.querySelectorAll(':scope > .copy-success-tick').forEach(node => node.remove());
      control.classList.remove('copy-success-state');
      activeTimers.delete(control);
    }, 1200);

    activeTimers.set(control, timer);
  }

  document.addEventListener('click', event => {
    const control = event.target.closest('button, a, [role="button"]');
    if (!isCopyControl(control)) return;

    // Run after the existing copy handler has had a chance to update its own label.
    window.setTimeout(() => showCopiedTick(control), 120);
  });
})();
