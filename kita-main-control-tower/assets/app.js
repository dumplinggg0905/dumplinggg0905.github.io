/* Kita Main Operations Control Tower: prototype app.
   Hash routes (#/overview, #/demand, #/inventory, #/fulfilment, #/engagement, #/vendor/..., #/system),
   so every screen and drawer can be opened and screenshotted by URL (?open=<record id>). */
(() => {
  'use strict';
  const D = window.KM;
  const G = window.GLYPHS || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- helpers ---------- */
  const ic = (n, c = '') => `<svg class="ic ${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${G[n] || ''}</svg>`;
  const fmt = n => Number(n).toLocaleString('en-MY');
  const chip = (tone, t) => `<span class="chip chip--${tone}"><i></i>${t}</span>`;
  const KITN = ['', 'Explore', 'Connect', 'Create'];
  const ENG = ['', 'Demand and cohorts', 'Kits and inventory', 'Fulfilment and delivery', 'Parent engagement'];
  const kitTag = n => n ? `<span class="kit-tag kit-tag--${n}"><b></b>Kit 0${n} ${KITN[n]}</span>` : `<span class="kit-tag kit-tag--0"><b></b>All kits</span>`;
  const brand = (f, alt, cls = '') => `<img class="brand-ic ${cls}" src="assets/icons/${f}.svg" alt="${alt}" width="20" height="20">`;
  const TICK = '<svg viewBox="0 0 16 16" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="m3.5 8.4 2.8 2.8 6-6.2"/></svg>';
  const box = on => `<span class="check-box${on ? ' is-checked' : ''}">${TICK}</span>`;
  const num = n => `<span class="nav-item__num">${n}</span>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- state ---------- */
  const S = {
    filter: 'all',
    selected: new Set(),
    approved: new Set(),
    left: { ...D.queueTotals },
    enrolled: D.cohort.enrolled,
    gateVendor: false,
    gateOpened: false,
    subUsed: false,
    pack: { box: 466, done: 142, checks: { i1: true, i3: true, i4: true }, sub: null, subAsk: false, checker: '' },
    grn: { rows: [['TOY-022', 'Textured sensory balls (set of 4)', 400, 400, 0], ['TOY-011', 'Stacking rings', 400, 380, 0], ['BOK-101', 'Touch-and-feel board book (BM)', 200, 200, 6]], photo: false, sent: false },
    confirm: { sent: false },
    disp: { handed: '', proof: false, done: false },
    issue: null, issueSent: false,
    chat: { lang: 'bm', log: [], step: 'start', item: null },
    cases: D.cases.map(c => ({ ...c })),
    nextCase: 148,
    gateOpen: false,
    routeOf: {},          // application id -> route after a person clears it
    closed: {},           // application id -> closing note (merged, closed with notice)
    asked: new Set(),     // applications waiting on the parent
    caseSt: {},           // case id -> [status, tone] after an action
    shipSt: {},           // tracking number -> [status, tone] after an action
    poSent: false,
    issuePhoto: false,
    importState: 'idle',  // courier tracking import: idle | loading | error | done
    importTries: 0
  };
  const routeOf = a => S.routeOf[a.id] || a.route;
  const queueLeft = () => S.left.green + S.left.amber + S.left.red;
  const openCases = () => S.cases.filter(c => c.tone !== 'ok').length;

  /* ---------- routing ---------- */
  const route = () => {
    const h = location.hash.replace(/^#\/?/, '') || 'overview';
    const [path, q] = h.split('?');
    const parts = path.split('/');
    const params = new URLSearchParams(q || '');
    return { view: parts[0] || 'overview', tab: parts[1] || '', open: params.get('open'), focus: params.get('focus') };
  };

  /* ---------- shell ---------- */
  function side(r) {
    const vendor = r.view === 'vendor';
    const cur = (v, t) => (r.view === v && (t === undefined || (r.tab || '') === t)) ? ' aria-current="page"' : '';
    if (vendor) {
      const t = r.tab || 'pack';
      const vi = (k, glyph, label, badge) => `<a class="nav-item" href="#/vendor/${k}"${t === k ? ' aria-current="page"' : ''}>${ic(glyph)}<span class="nav-item__label">${label}</span>${badge ? `<span class="nav-item__badge">${badge}</span>` : ''}</a>`;
      return `
        <a class="brand" href="#/vendor/pack">${LOGO_SLOT}<span class="brand__text"><span class="brand__name">Kita Main</span><br><span class="brand__sub">Vendor portal</span></span></a>
        <nav aria-label="Vendor portal"><div class="nav-group"><div class="nav-group__label">Vendor A work</div>
          ${vi('pack', 'package-check', 'Pack and inspect', 46)}
          ${vi('receive', 'warehouse', 'Receive stock', 1)}
          ${vi('confirm', 'clipboard-check', 'Confirm batches', S.confirm.sent ? 0 : 1)}
          ${vi('dispatch', 'truck', 'Hand over to courier', S.disp.done ? 0 : 1)}
          ${vi('issue', 'triangle-alert', 'Report a problem')}
        </div>
        <div class="nav-group"><div class="nav-group__label">Switch view</div>
          <a class="nav-item" href="#/overview">${ic('layout-dashboard')}<span class="nav-item__label">YGG team view</span></a>
        </div></nav>
        <div class="side__foot">
          <div class="who"><span class="avatar avatar--soft">VA</span><div><div class="who__name">Vendor A, packing lead</div><div class="who__role">Own work orders only</div></div></div>
        </div>`;
    }
    const item = (href, glyph, label, current, badge, alert) =>
      `<a class="nav-item" href="${href}"${current}>${glyph}<span class="nav-item__label">${label}</span>${badge ? `<span class="nav-item__badge${alert ? ' nav-item__badge--alert' : ''}">${badge}</span>` : ''}</a>`;
    return `
      <a class="brand" href="#/overview">${LOGO_SLOT}<span class="brand__text"><span class="brand__name">Kita Main</span><br><span class="brand__sub">Operations control tower</span></span></a>
      <nav aria-label="Main"><div class="nav-group"><div class="nav-group__label">Overview</div>
        ${item('#/overview', ic('layout-dashboard'), 'Control tower', cur('overview'))}
      </div>
      <div class="nav-group"><div class="nav-group__label">Four engines</div>
        ${item('#/demand', num(1), 'Demand and cohorts', cur('demand'), queueLeft() || '', false)}
        ${item('#/inventory', num(2), 'Kits and inventory', cur('inventory'), S.subUsed ? 1 : 2, !S.subUsed)}
        ${item('#/fulfilment', num(3), 'Fulfilment and delivery', cur('fulfilment'), 3, true)}
        ${item('#/engagement', num(4), 'Parent engagement', cur('engagement'), openCases(), true)}
      </div>
      <div class="nav-group"><div class="nav-group__label">Partners and setup</div>
        ${item('#/vendor/pack', ic('store'), 'Vendor portal', '')}
        ${item('#/system', ic('layers'), 'System map', cur('system'))}
      </div></nav>
      <div class="side__foot">
        <div class="who"><span class="avatar">KM</span><div><div class="who__name">Kita Main manager</div><div class="who__role">All four engines</div></div></div>
      </div>`;
  }

  function top(r) {
    const vendor = r.view === 'vendor';
    return `
      <button class="icon-btn menu-btn" type="button" data-act="menu" aria-label="Open menu">${ic('ellipsis')}</button>
      <form class="search" role="search" data-search><label class="search__label">${ic(vendor ? 'scan-line' : 'search')}<span class="sr">Search records</span><input type="search" name="q" placeholder="${vendor ? 'Scan or type a box label' : 'Find a household, case or tracking number'}" autocomplete="off"></label><span class="kbd" aria-hidden="true">/</span></form>
      <span class="top__spacer"></span>
      <span class="chip chip--warn sample" title="Every record and figure in this prototype is sample data">Sample data</span>
      <span class="top__date">${D.today}</span>
      <div class="seg" role="group" aria-label="Switch view">
        <button type="button" data-act="role" data-role="team" aria-pressed="${!vendor}">YGG team</button>
        <button type="button" data-act="role" data-role="vendor" aria-pressed="${vendor}">Vendor A</button>
      </div>
      ${vendor ? '' : `<a class="icon-btn" href="#/overview?focus=queue" aria-label="Alerts: ${D.priority.length} items in the priority queue">${ic('bell')}<span class="icon-btn__dot"></span></a>`}`;
  }

  // Heading: an engine's number sits inside its h1, the same numbered box used in the nav (the identity motif).
  const head = ({ n, title, sub, actions = '' }) => `
    <div class="page-head">
      <div><h1>${n ? `<span class="h1-num" aria-hidden="true">${n}</span>` : ''}${title}</h1>${sub ? `<p class="page-head__sub">${sub}</p>` : ''}</div>
      ${actions ? `<div class="page-head__actions">${actions}</div>` : ''}
    </div>`;
  // Approved mark (logo-design, "Kit tower", 7 Nov 2026): the three kits stacked into a control tower. Master files in Downloads/Logos/control-tower/kit.
  const LOGO_SLOT = '<span class="brand__logo" aria-hidden="true"><svg viewBox="0 0 256 256"><g fill="#b91b1c"><rect x="124" y="16" width="8" height="30" rx="4"/><path fill-rule="evenodd" d="M58 42 H198 A12 12 0 0 1 209.6 57 L197.8 101 A12 12 0 0 1 187 110 H69 A12 12 0 0 1 58.2 101 L46.4 57 A12 12 0 0 1 58 42 Z M78 64 H178 A8 8 0 0 1 186 72 A8 8 0 0 1 178 80 H78 A8 8 0 0 1 70 72 A8 8 0 0 1 78 64 Z"/><rect x="84" y="120" width="88" height="48" rx="13"/><rect x="103" y="178" width="50" height="58" rx="12"/></g></svg></span>';

  const tabs = (base, list, cur) => `<div class="tabs" role="tablist">${list.map(([k, label, count]) =>
    `<a class="tab" role="tab" href="#/${base}${k ? '/' + k : ''}" aria-selected="${cur === k}">${label}${count !== undefined ? `<span class="count">${count}</span>` : ''}</a>`).join('')}</div>`;

  /* ---------- shared widgets ---------- */
  function dispatchChart() {
    const W = 720, H = 250, L = 40, R = 14, T = 22, B = 34, max = 210;
    const iw = W - L - R, ih = H - T - B, n = D.weeks.length, slot = iw / n, bw = slot * .52;
    const y = v => T + ih - (v / max) * ih;
    let g = '';
    [0, 50, 100, 150, 200].forEach(v => {
      g += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(30,26,25,.08)"/><text x="${L - 8}" y="${y(v) + 4}" font-size="13" fill="#6a6360" text-anchor="end">${v}</text>`;
    });
    D.weeks.forEach((wk, i) => {
      const x = L + slot * i + (slot - bw) / 2;
      let acc = 0;
      wk.k.forEach((v, j) => {
        const y1 = y(acc + v), h = y(acc) - y1;
        g += `<rect x="${x}" y="${y1}" width="${bw}" height="${Math.max(h - 1.5, 0)}" rx="${j === 2 ? 6 : 0}" fill="var(--k${j + 1})"><title>${wk.w}: Kit 0${j + 1} ${v}</title></rect>`;
        acc += v;
      });
      const over = acc > D.capacity;
      g += `<text x="${x + bw / 2}" y="${y(acc) - 7}" font-size="13.5" font-weight="600" text-anchor="middle" fill="${over ? '#b91b1c' : '#1e1a19'}">${acc}${over ? ` (+${acc - D.capacity})` : ''}</text>`;
      g += `<text x="${x + bw / 2}" y="${H - 12}" font-size="13" text-anchor="middle" fill="#463f3d">${wk.w}</text>`;
    });
    g += `<line x1="${L}" x2="${W - R}" y1="${y(D.capacity)}" y2="${y(D.capacity)}" stroke="#1e1a19" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Boxes due each week by kit stage, against packing capacity of 180 a week">${g}</svg>`;
  }

  function dispatchCard() {
    return `<section class="card">
      <div class="card__head"><div class="grow"><div class="card__title">Boxes due, next 8 weeks</div></div>
        <div class="legend"><span><b style="background:var(--k1)"></b>Kit 01</span><span><b style="background:var(--k2)"></b>Kit 02</span><span><b style="background:var(--k3)"></b>Kit 03</span><span><b class="line-key"></b>Capacity 180 a week</span></div></div>
      <div class="card__body">${dispatchChart()}</div>
    </section>`;
  }

  function gateCard(compact) {
    const rows = D.gate.map(g => {
      const ok = g.ok || (g.id === 'vendor' && S.gateVendor);
      const detail = g.id === 'vendor' && S.gateVendor ? 'Vendor A 100 and Vendor B 80 boxes a week, confirmed in the vendor portal' : g.detail;
      return `<div class="gate__row"><span class="gate__icon${ok ? '' : ' gate__icon--pending'}">${ic(ok ? 'check' : 'clock')}</span>
        <div><div class="gate__label">${g.label}</div>${compact ? '' : `<div class="gate__detail">${detail}</div>`}</div>
        ${ok ? '' : `<button class="btn btn--sm" type="button" data-act="gate-vendor">Mark confirmed</button>`}</div>`;
    }).join('');
    const passed = D.gate.filter(g => g.ok).length + (S.gateVendor ? 1 : 0);
    const all = passed === D.gate.length;
    return `<section class="card">
      <div class="card__head"><div class="grow"><div class="card__title">Intake gate, ${D.cohort.nextId}</div><div class="card__meta">${D.cohort.nextCap} places, opens ${D.cohort.nextOpens}</div></div>${S.gateOpen ? chip('ok', 'Open') : chip(all ? 'ok' : 'warn', `${passed} of ${D.gate.length} checks`)}</div>
      <div class="card__body"><div class="gate">${rows}</div></div>
      <div class="card__foot">
        <span class="hint">${S.gateOpen ? 'Open. Kit 01 wave 1 ships the week of 5 Apr.' : all ? 'All checks pass.' : 'Opens when all 5 checks pass.'}</span>
        ${compact ? `<a class="link" href="#/demand/cohorts">Review gate</a>` : `<button class="btn btn--primary" type="button" data-act="gate-open"${all && !S.gateOpen ? '' : ' disabled'}>${S.gateOpen ? 'Intake open' : `Open ${D.cohort.nextId} intake`}</button>`}
      </div>
    </section>`;
  }

  /* ---------- overview ---------- */
  function overview() {
    const eng = (n, href, glyph, big, label, alert, alertTone, kpis) => `
      <a class="card engine span-3" href="${href}">
        <div class="engine__top">${num(n)}<span>${ENG[n]}</span></div>
        <div><div class="engine__num">${big}</div><div class="engine__label">${label}</div></div>
        <div class="engine__alert"><span class="dot dot--${alertTone}"></span><span>${alert}</span></div>
        <div class="engine__kpis">${kpis.map(([v, l]) => `<div><div class="kpi__v">${v}</div><div class="kpi__l">${l}</div></div>`).join('')}</div>
      </a>`;
    const q = D.priority.map(p => `
      <div class="q-item">
        <span class="q-item__sev">${chip(p.sev, p.sev === 'bad' ? 'Urgent' : 'Attention')}</span>
        <div><div class="q-item__title">${p.title}</div><div class="q-item__text">${p.text}</div>
          <div class="q-item__meta"><span class="chip chip--line chip--plain">${num(p.engine)} ${ENG[p.engine]}</span><span class="muted">${p.due}</span></div></div>
        <a class="btn btn--sm" href="${p.go}">${p.action}</a>
      </div>`).join('');
    const y27 = D.trajectory[0].target;
    const traj = D.trajectory.map(t => `<div class="traj__row"><span class="strong">${t.year}</span><div class="bar bar--accent" style="--v:${t.target / 4500}"><i></i></div><span class="traj__v">${fmt(t.target)}</span></div>`).join('');
    const ready = S.left.green;
    return `
      ${head({ title: 'Control tower', sub: `${D.todayLong}. Cohort ${D.cohort.id} is enrolling. Gate review for ${D.cohort.nextId}: 29 March.`,
        actions: queueLeft() ? `<a class="btn btn--primary" href="#/demand">Review ${fmt(queueLeft())} applications</a>` : '' })}
      <div class="grid">
        ${eng(1, '#/demand', 'users', fmt(queueLeft()), 'applications waiting for a decision', ready ? `${ready} pass every rule and can be approved in one batch` : `${S.left.amber} need information, ${S.left.red} need a person`, ready ? 'ok' : 'warn', [['1.6 days', 'median decision time'], [`${fmt(S.enrolled)} / ${D.cohort.cap}`, `${D.cohort.id} enrolled`]])}
        ${eng(2, '#/inventory', 'boxes', S.subUsed ? '1' : '2', 'stock risks in the next 8 weeks', S.subUsed ? 'Puppet shortfall covered by the approved substitute' : 'Hand puppets 120 short for Kit 02', S.subUsed ? 'ok' : 'bad', [['94%', 'supplier fill rate'], ['5', 'open purchase orders']])}
        ${eng(3, '#/fulfilment', 'truck', '468', 'boxes due in March, 341 already dispatched', '3 parcels failed delivery twice in Kelantan', 'bad', [['96.4%', 'dispatched on time'], ['98.9%', 'deliveries with proof']])}
        ${eng(4, '#/engagement', 'message-circle', String(openCases()), 'open family cases, 2 past the 48-hour target', '61% of families answered the last check-in', 'warn', [['97.1%', 'boxes complete and undamaged'], ['4.6 / 5', 'guide rated easy to use']])}
        <div class="span-8 stack">
          ${dispatchCard()}
          <section class="card" id="queue" tabindex="-1">
            <div class="card__head"><div class="grow"><div class="card__title">Needs a decision</div></div><span class="chip">${D.priority.length} items</span></div>
            <div class="queue">${q}</div>
          </section>
        </div>
        <div class="span-4 stack">
          <section class="card">
            <div class="card__head"><div class="grow"><div class="card__title">New families, 2027</div><div class="card__meta">Verified and enrolled</div></div></div>
            <div class="card__body">
              <div class="target__big"><span class="target__num">${fmt(S.enrolled)}</span><span class="muted">of ${fmt(y27)}</span></div>
              <div class="bar bar--accent mt-12" style="--v:${S.enrolled / y27};height:10px"><i></i><span class="bar__mark" style="--m:.25" title="Plan to end of March: 562"></span></div>
              <div class="row row--between mt-8"><span class="hint">Plan to end of March: 562</span><span class="hint">${Math.round(S.enrolled / y27 * 100)}%</span></div>
              <div class="divider mt-16"></div>
              <div class="traj mt-16">${traj}</div>
              <p class="hint mt-12">10,000 families and 30,000 boxes over three years, RM7.5m at RM750 a family.</p>
            </div>
          </section>
          ${gateCard(true)}
        </div>
      </div>`;
  }

  /* ---------- engine 1: demand ---------- */
  function demand(r) {
    const t = r.tab || '';
    const tb = tabs('demand', [['', 'Verification queue', queueLeft()], ['cohorts', 'Cohorts and intake gate']], t);
    const h = head({ n: 1, title: 'Demand and cohorts',
      sub: queueLeft() ? `${fmt(queueLeft())} applications waiting. Oldest: 2 days.` : 'No applications waiting.' });
    if (t === 'cohorts') return h + tb + cohortsTab();
    // "All" keeps processed rows (dimmed) as a record of today's decisions; the route filters show only open work.
    const rows = D.queue.filter(a => S.filter === 'all' || (routeOf(a) === S.filter && !S.approved.has(a.id) && !S.closed[a.id]));
    const routeChip = a => {
      if (S.approved.has(a.id)) return chip('ok', 'Enrolled, 3 kit orders planned');
      if (S.closed[a.id]) return chip('line', S.closed[a.id]);
      if (S.asked.has(a.id)) return chip('info', 'Waiting for parent');
      if (routeOf(a) === 'green') return chip('ok', 'Ready to approve');
      if (routeOf(a) === 'amber') return chip('warn', 'Needs information');
      return chip('bad', 'Needs review');
    };
    const ruleCell = a => `<span class="rules">${a.checks.map((c, i) => `<span class="rule${c === 'ok' ? '' : ' rule--' + c}" title="${D.ruleNames[i]}: ${c === 'ok' ? 'pass' : c === 'warn' ? 'check needed' : 'fail'}">${ic(c === 'ok' ? 'check' : c === 'warn' ? 'circle-alert' : 'x')}</span>`).join('')}</span>`;
    const tr = rows.map(a => {
      const done = S.approved.has(a.id) || !!S.closed[a.id];
      const sel = S.selected.has(a.id);
      const reason = routeOf(a) !== 'green' && !done ? a.reason : '';
      return `<tr data-open="app:${a.id}" class="${done ? 'is-done' : ''}">
        <td>${routeOf(a) === 'green' && !done ? `<button type="button" class="pick${sel ? ' is-checked' : ''}" data-act="sel" data-id="${a.id}" aria-label="Select ${a.id}" aria-pressed="${sel}">${box(sel)}</button>` : ''}</td>
        <td><button type="button" class="rec" data-open="app:${a.id}">${a.id}</button><div class="cell-sub">${a.src}</div></td>
        <td><div class="cell-main">${a.who}</div><div class="cell-sub">${a.place}</div></td>
        <td class="nowrap">${a.age === null ? '<span class="muted">Missing</span>' : `${a.age} months`}</td>
        <td>${ruleCell(a)}</td>
        <td>${routeChip(a)}${reason ? `<div class="cell-sub" style="margin-top:4px">${reason}</div>` : ''}</td>
        <td class="nowrap muted">${a.wait}</td>
      </tr>`;
    }).join('') || `<tr><td colspan="7"><div class="empty"><div class="strong">Nothing in this group right now</div><div class="hint">${S.filter === 'green' ? 'Every application that passed all five rules has been approved.' : 'New applications appear here after the overnight rule check.'}</div></div></td></tr>`;
    const nSel = S.selected.size;
    const f = (k, label, n) => `<button class="filter" type="button" data-act="filter" data-f="${k}" aria-pressed="${S.filter === k}">${label} <b>${n}</b></button>`;
    return h + tb + `
      <section class="card"><div class="stat-row">
        <div class="stat"><div class="stat__v">1.6 days</div><div class="stat__l">Median time from complete application to decision</div></div>
        <div class="stat"><div class="stat__v">67%</div><div class="stat__l">Complete on the first try</div></div>
        <div class="stat"><div class="stat__v">5.2 min</div><div class="stat__l">Staff time per application</div></div>
        <div class="stat"><div class="stat__v">${fmt(S.left.amber)}</div><div class="stat__l">Waiting on a parent for a document or detail</div></div>
      </div></section>
      <section class="card">
        <div class="bulk">
          <div class="filters">${f('all', 'All', queueLeft())}${f('green', 'Pass every rule', S.left.green)}${f('amber', 'Need information', S.left.amber)}${f('red', 'Need a person', S.left.red)}</div>
          <span class="top__spacer"></span>
          <span class="muted">${nSel ? `${nSel} selected` : S.left.green ? 'Green rows can be approved together' : 'No green rows left'}</span>
          <button class="btn btn--primary" type="button" data-act="approve"${S.left.green ? '' : ' disabled'}>${nSel ? `Approve ${nSel} selected` : S.left.green ? `Approve all ${S.left.green} green` : 'All green approved'}</button>
        </div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th style="width:44px"><span class="sr">Select</span></th><th>Application</th><th>Parent or guardian</th><th>Child’s age</th><th>Five rule checks</th><th>Route</th><th>Waiting</th></tr></thead>
          <tbody>${tr}</tbody></table></div>
        <div class="card__foot"><span class="hint">${rows.length ? `Showing the ${rows.length} oldest. ` : ''}Names are shortened on screen.</span></div>
      </section>`;
  }

  function cohortsTab() {
    const kc = (v, n, k) => n ? `<div class="cover" style="min-width:96px"><div class="bar bar--k${k}" style="--v:${v / n}"><i></i></div><span class="cover__v" style="width:auto">${v}</span></div>` : '<span class="muted">Not started</span>';
    const rows = D.cohorts.map(c => {
      const n = c.id === '2027-C1' ? S.enrolled : c.n;
      const st = c.id === '2027-C2' && S.gateOpen ? chip('ok', 'Intake open') : chip(c.tone, c.next);
      return `<tr><td><div class="cell-main nowrap">${c.id}</div><div class="cell-sub nowrap">${c.window}</div><div style="margin-top:6px">${st}</div></td>
        <td class="num">${fmt(n)}${c.cap ? `<span class="muted"> / ${fmt(c.cap)}</span>` : ''}</td>
        <td>${kc(c.k[0], n, 1)}</td><td>${kc(c.k[1], n, 2)}</td><td>${kc(c.k[2], n, 3)}</td></tr>`;
    }).join('');
    return `<div class="grid">
      <div class="span-7 stack">
        <section class="card">
          <div class="card__head"><div class="grow"><div class="card__title">Cohorts</div><div class="card__meta">Kits delivered with proof</div></div></div>
          <div class="table-wrap"><table class="table"><thead><tr><th>Cohort</th><th class="num">Households</th><th>Kit 01 delivered</th><th>Kit 02 delivered</th><th>Kit 03 delivered</th></tr></thead><tbody>${rows}</tbody></table></div>
        </section>
        <section class="card">
          <div class="card__head"><div class="grow"><div class="card__title">Kit orders made on approval</div></div></div>
          <div class="card__body"><div class="kits3">
            ${[[1, 'Next dispatch wave', 'Within 3 weeks'], [2, 'Month 3', 'Sent to a vendor 4 weeks ahead'], [3, 'Month 6', 'Journey ends at month 8']].map(([k, a, b]) => `<div class="kitstep"><div class="kitstep__top">${kitTag(k)}</div><div class="strong">${a}</div><div class="hint">${b}</div></div>`).join('')}
          </div></div>
        </section>
      </div>
      <div class="span-5 stack">${gateCard(false)}</div>
    </div>`;
  }

  /* ---------- engine 2: inventory ---------- */
  function inventory(r) {
    const t = r.tab || '';
    const tb = tabs('inventory', [['', 'Stock', S.subUsed ? 1 : 2], ['kits', 'Kit specifications'], ['orders', 'Purchase orders and receipts']], t);
    const h = head({ n: 2, title: 'Kits and inventory',
      sub: `Stock held at Vendor A and Vendor B. Last count 15 Mar, 08:00.` });
    if (t === 'kits') return h + tb + kitsTab();
    if (t === 'orders') return h + tb + ordersTab();
    const alert = S.subUsed
      ? `<div class="note">${ic('circle-check')}<div><b>Covered.</b> 120 Kit 02 boxes in BATCH-2027-034 will use TOY-034 finger puppets, an approved substitute in KIT02-V1. Vendor B’s work order is updated.</div></div>`
      : S.poSent
        ? `<div class="note">${ic('circle-check')}<div><b>PO-2027-024 sent</b> for 500 hand puppets, due at Vendor B on 5 Apr. BATCH-2027-034 moves its packing start to 5 Apr.</div></div>`
        : `<div class="note note--warn">${ic('triangle-alert')}<div style="flex:1"><b>Hand puppets (TOY-031) are 120 short for BATCH-2027-034,</b> which starts packing on 29 Mar. Vendor B holds 240 of the approved substitute TOY-034. A new order would arrive about 5 Apr.
          <div class="row mt-12"><button class="btn btn--primary btn--sm" type="button" data-act="use-sub">Use the substitute for 120 boxes</button><button class="btn btn--sm" type="button" data-act="po-send">Send PO-2027-024 instead</button></div></div></div>`;
    const rows = D.stock.map(s => {
      const avail = s.a + s.b - s.alloc;
      const cover = s.need ? (avail + s.inc) / s.need : null;
      const short = s.sku === 'TOY-031' && !S.subUsed;
      const tone = cover === null ? '' : cover < 1 ? (s.sku === 'TOY-031' && S.subUsed ? 'warn' : 'accent') : cover < 1.15 ? 'warn' : 'ok';
      return `<tr>
        <td class="mono strong">${s.sku}</td>
        <td><div class="cell-main" style="font-weight:500">${s.item}</div>${s.sub ? `<div class="cell-sub">Approved substitute for ${s.sub}${S.subUsed ? ', 120 allocated' : ''}</div>` : ''}${s.sku === 'TOY-031' && S.subUsed ? '<div class="cell-sub">Shortfall covered by TOY-034</div>' : ''}</td>
        <td>${kitTag(s.kit)}</td>
        <td class="num">${fmt(s.a)}</td><td class="num">${fmt(s.b)}</td>
        <td class="num">${s.q ? `<span class="chip chip--warn">${s.q}</span>` : '<span class="muted">0</span>'}</td>
        <td class="num">${fmt(s.alloc + (s.sku === 'TOY-034' && S.subUsed ? 120 : 0))}</td>
        <td class="num">${s.inc ? `${fmt(s.inc)}<div class="cell-sub">${s.incDate}</div>` : '<span class="muted">0</span>'}</td>
        <td class="num strong">${fmt(avail - (s.sku === 'TOY-034' && S.subUsed ? 120 : 0))}</td>
        <td class="num">${s.need ? fmt(s.need) : '<span class="muted">–</span>'}</td>
        <td>${cover === null ? chip('line', 'Substitute') : `<div class="cover"><div class="bar bar--${tone}" style="--v:${Math.min(cover / 2, 1)}"><i></i><span class="bar__mark" style="--m:.5"></span></div><span class="cover__v${short ? ' down' : ''}">${cover.toFixed(2)}×</span></div>`}</td>
      </tr>`;
    }).join('');
    return h + tb + alert + `
      <section class="card">
        <div class="card__head"><div class="grow"><div class="card__title">Stock by item</div><div class="card__meta">Available is on hand minus allocated. Cover is available plus incoming, divided by the 8-week need; the tick marks 1.0×.</div></div></div>
        <div class="table-wrap"><table class="table">
          <thead><tr><th>SKU</th><th>Item</th><th>Kit</th><th class="num">Vendor A</th><th class="num">Vendor B</th><th class="num">Quarantine</th><th class="num">Allocated</th><th class="num">Incoming</th><th class="num">Available</th><th class="num">Need, 8 weeks</th><th>Cover</th></tr></thead>
          <tbody>${rows}</tbody></table></div>
      </section>`;
  }

  function kitsTab() {
    return `<div class="note note--lock">${ic('lock')}<div>Vendors pack only from these lists. A substitute that is not listed needs the manager’s approval and becomes a new version.</div></div>
      <div class="grid">${D.kits.map(k => `
        <section class="card span-4">
          <div class="card__head"><div class="grow">${kitTag(k.n)}<div class="card__meta" style="margin-top:4px">${k.focus}</div></div>${chip('ok', k.ver)}</div>
          <div class="card__body"><div class="spec">${k.items.map(([sku, item, qty, sub]) => `
            <div class="spec__item"><span class="mono strong">${sku}</span><span>${item}</span><span class="right strong">× ${qty}</span>
              ${sub ? `<span class="spec__sub">${ic('repeat', 'ic--sm')} Approved substitute: ${sub}</span>` : ''}</div>`).join('')}
          </div></div>
          <div class="card__foot"><div><div class="strong">Effective ${k.eff}</div><div class="hint">${k.change}</div></div></div>
        </section>`).join('')}
      </div>`;
  }

  function ordersTab() {
    const rows = D.pos.map(p => { const sent = p.id === 'PO-2027-024' && S.poSent; return `<tr><td class="mono strong">${p.id}</td><td><div class="cell-main" style="font-weight:500">${p.what}</div><div class="cell-sub">${p.sup}, deliver to ${p.to}</div></td><td class="nowrap">${p.by}</td><td>${sent ? chip('info', 'Sent') : chip(p.tone, p.status)}</td></tr>`; }).join('');
    return `<div class="grid">
      <section class="card span-7"><div class="card__head"><div class="grow"><div class="card__title">Purchase orders</div></div></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Order</th><th>Items</th><th>Due</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div></section>
      <section class="card span-5"><div class="card__head"><div class="grow"><div class="card__title">Goods received GRN-2027-044</div><div class="card__meta">Submitted by Vendor B, 8 Mar, 15:20</div></div>${chip('warn', 'Discrepancy')}</div>
        <div class="card__body"><dl class="kv">
          <dt>Order</dt><dd class="mono">PO-2027-019, Supplier S-03</dd>
          <dt>Item</dt><dd>TOY-031 hand puppet set</dd>
          <dt>Ordered</dt><dd>500</dd>
          <dt>Arrived</dt><dd>480 <span class="muted">(20 missing)</span></dd>
          <dt>Accepted to stock</dt><dd>470</dd>
          <dt>Quarantined</dt><dd>10, seams torn</dd>
          <dt>Evidence</dt><dd>3 photos from Vendor B</dd>
        </dl>
        <div class="timeline mt-16">
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Short and damaged units kept out of stock</div><div class="tl__s">Usable stock rose by 470, not 500</div></div><span class="tl__time">8 Mar</span></div>
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">CASE-0144 opened for the manager</div><div class="tl__s">Claim for 20 missing and 10 damaged sent to S-03</div></div><span class="tl__time">8 Mar</span></div>
          <div class="tl"><span class="tl__dot tl__dot--next"></span><div><div class="tl__t">Supplier credit or replacement</div><div class="tl__s">Reply due 17 Mar</div></div><span class="tl__time">Waiting</span></div>
        </div></div>
      </section></div>`;
  }

  /* ---------- engine 3: fulfilment ---------- */
  function fulfilment(r) {
    const t = r.tab || '';
    const tb = tabs('fulfilment', [['', 'Batches'], ['shipments', 'Shipments and proof', 3], ['vendors', 'Vendors']], t);
    const h = head({ n: 3, title: 'Fulfilment and delivery',
      sub: '468 boxes due in March. 341 dispatched, 3 failed delivery twice.',
      actions: `<a class="btn" href="#/vendor/pack">Open vendor portal</a>` });
    if (t === 'shipments') return h + tb + shipmentsTab();
    if (t === 'vendors') return h + tb + vendorsTab();
    const lanes = D.lanes.map(l => `<div class="lane"><div class="lane__head">${l.name}<span class="count">${l.cards.length}</span></div>
      ${l.cards.map(c => `<button class="card bcard" type="button" data-open="batch:${c.id}">
        <div class="bcard__id"><span class="mono strong">${c.id}</span></div>
        ${kitTag(c.kit)}
        <div class="bcard__meta">${c.vendor}, ${c.cohort.replace(/ wave /, ' wave&nbsp;')}</div>
        ${c.done !== undefined ? `<div class="bar bar--k${c.kit}" style="--v:${c.done / c.n}"><i></i></div>` : ''}
        <div class="bcard__meta"><b style="color:var(--ink)">${c.done !== undefined ? `${c.done} of ${c.n}` : `${c.n} boxes`}</b>, due&nbsp;${c.due.replace(' ', '&nbsp;')}</div>
        <div class="bnote"><span class="dot dot--${c.tone === 'line' ? 'mute' : c.tone}"></span><span>${c.note}</span></div>
      </button>`).join('')}</div>`).join('');
    const load = D.vendors.map(v => { const used = v.name === 'Vendor A' ? 88 : 72; return `<div class="load__row"><div class="row row--between"><span class="strong">${v.name}</span><span>${used} of ${v.cap}</span></div><div class="bar bar--${used / v.cap > .85 ? 'warn' : 'ok'}" style="--v:${used / v.cap}"><i></i></div></div>`; }).join('');
    return h + tb + `<div class="grid"><div class="span-8">${dispatchCard()}</div>
      <section class="card span-4"><div class="card__head"><div class="grow"><div class="card__title">Packing load this week</div><div class="card__meta">Booked of confirmed capacity</div></div></div>
        <div class="card__body"><div class="load">${load}</div><div class="divider mt-16"></div>
          <dl class="kv mt-16" style="grid-template-columns:1fr auto"><dt>Packed today</dt><dd>38</dd><dt>Passed QC first time</dt><dd>97.2%</dd><dt>In rework</dt><dd>4</dd><dt>Ready for pickup</dt><dd>130</dd></dl></div>
        <div class="card__foot"><span class="hint">Week of 12 Apr needs 12 more boxes than both vendors can pack.</span></div></section></div>
      <div class="board">${lanes}</div>`;
  }

  function shipmentsTab() {
    const rows = D.shipments.map(s => { const [st, tone] = S.shipSt[s.awb] || [s.st, s.tone]; return `<tr data-open="ship:${s.awb}">
      <td><button type="button" class="rec" data-open="ship:${s.awb}">${s.awb}</button><div class="cell-sub">${s.carrier}</div></td>
      <td><div class="cell-main" style="font-weight:500">${s.ko}</div><div class="cell-sub mono">${s.hh}</div></td>
      <td>${s.to}</td><td class="mono">${s.batch}</td>
      <td>${chip(tone, st)}</td><td class="nowrap muted">${s.last}</td>
      <td>${s.pod ? `<span class="row" style="gap:6px">${ic('shield-check', 'ic--sm')}${s.pod}</span>` : s.kase ? `<span class="chip chip--line chip--plain">${s.kase}</span>` : '<span class="muted">Not yet</span>'}</td></tr>`; }).join('');
    const imp = {
      idle: [`Last J&T tracking import 10:00, 214 updates. Next at 12:00.`, 'Import now', ''],
      loading: ['Importing the J&T tracking file…', '', 'is-loading'],
      error: ['Import failed: the J&T file for 12:00 was not in the shared folder. Statuses below are from 10:00.', 'Try again', 'is-error'],
      done: ['Imported 12:00, 37 new updates. Next at 14:00.', '', 'is-done']
    }[S.importState];
    return `<section class="card"><div class="stat-row">
        <div class="stat"><div class="stat__v">98.9%</div><div class="stat__l">Delivered parcels with photo or signature proof</div></div>
        <div class="stat"><div class="stat__v">2.6 days</div><div class="stat__l">Average from courier handover to delivery</div></div>
        <div class="stat"><div class="stat__v">4</div><div class="stat__l">Parcels moving now in batch 029</div></div>
        <div class="stat"><div class="stat__v down">3</div><div class="stat__l">Failed twice, each opened as a family case</div></div>
      </div></section>
      <section class="card"><div class="card__head"><div class="grow"><div class="card__title">Shipments</div></div></div>
        <div class="import ${imp[2]}" role="status">${S.importState === 'loading' ? '<span class="spin" aria-hidden="true"></span>' : S.importState === 'error' ? ic('circle-alert', 'ic--sm') : ic('refresh-cw', 'ic--sm')}<span>${imp[0]}</span>${imp[1] ? `<button class="btn btn--sm" type="button" data-act="import">${imp[1]}</button>` : ''}</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Tracking number</th><th>Kit order</th><th>Destination</th><th>Batch</th><th>Status</th><th>Last update</th><th>Proof of delivery</th></tr></thead><tbody>${rows}</tbody></table></div>
      </section>`;
  }

  function vendorsTab() {
    const v = D.vendors.map(x => {
      const conf = x.april || (x.name === 'Vendor B' && S.gateVendor);
      return `<section class="card span-4">
      <div class="card__head"><div class="grow"><div class="card__title">${x.name}</div><div class="card__meta">${x.area}, packs ${x.share}% of boxes</div></div>${chip(conf ? 'ok' : 'warn', conf ? 'April confirmed' : 'April not confirmed')}</div>
      <div class="card__body"><div class="engine__kpis" style="border:0;padding:0;gap:16px">
        <div><div class="kpi__v">${x.cap} a week</div><div class="kpi__l">packing capacity</div></div>
        <div><div class="kpi__v">${x.ontime}%</div><div class="kpi__l">dispatched on time</div></div>
        <div><div class="kpi__v">${x.qc}%</div><div class="kpi__l">boxes pass QC first time</div></div>
        <div><div class="kpi__v">${x.grn}%</div><div class="kpi__l">receipts match the order</div></div>
      </div></div>
      <div class="card__foot"><span class="hint">${x.issues} open issues</span></div>
    </section>`;
    }).join('');
    return `<div class="grid">${v}
      <section class="card span-4">
        <div class="card__head"><div class="grow"><div class="card__title">Northern regional partner</div><div class="card__meta">Penang, Kedah, Perak, Perlis</div></div>${chip('line', 'Not needed yet')}</div>
        <div class="card__body"><p style="color:var(--ink-2)">Add a third vendor when northern demand stays above <b>120 boxes a month for two quarters</b> and a northern vendor would cut courier cost or delivery time.</p>
          <div class="cover mt-16"><div class="bar bar--warn" style="--v:${64 / 120}"><i></i></div><span class="cover__v" style="width:auto">64 / 120</span></div><p class="hint mt-8">Northern boxes a month, average of the last quarter</p></div>
      </section></div>`;
  }

  /* ---------- engine 4: engagement ---------- */
  function engagement(r) {
    const t = r.tab || '';
    const tb = tabs('engagement', [['', 'Cases and check-ins', openCases()], ['feedback', 'Feedback'], ['journeys', 'Message journeys']], t);
    const h = head({ n: 4, title: 'Parent engagement',
      sub: `${openCases()} open cases. A person replies within 48 hours.`,
      actions: `<span class="chip chip--line chip--plain">${brand('whatsapp', 'WhatsApp')} WhatsApp through SleekFlow</span>` });
    if (t === 'feedback') return h + tb + feedbackTab();
    if (t === 'journeys') return h + tb + journeysTab();
    return h + tb + `<div class="grid">
      <section class="card span-8" id="cases-card">${casesTable()}</section>
      <section class="card span-4">
        <div class="card__head"><div class="grow"><div class="card__title">Parent check-in</div><div class="card__meta">Sent 3 days after proof of delivery</div></div></div>
        <div class="card__body" id="phone">${phone()}</div>
      </section></div>`;
  }

  function casesTable() {
    const rows = S.cases.map(c => `<tr data-open="case:${c.id}" class="${c.isNew ? 'is-new' : ''}">
      <td><button type="button" class="rec" data-open="case:${c.id}">${c.id}</button><div class="cell-sub" style="margin-top:4px">${kitTag(c.kit)}</div></td>
      <td style="min-width:220px"><div class="cell-main">${c.title}</div><div class="cell-sub">${c.cat}, from ${c.src}</div></td>
      <td><div>${c.owner}</div><div class="cell-sub nowrap ${/over/.test(c.sla) && c.tone !== 'ok' ? 'down strong' : ''}" style="margin-top:2px">Reply: ${c.sla}</div></td><td>${chip(c.tone, c.st)}</td></tr>`).join('');
    return `<div class="card__head"><div class="grow"><div class="card__title">Family cases</div></div><span class="chip">${openCases()} open</span></div>
      <div class="table-wrap"><table class="table"><thead><tr><th>Case</th><th>Issue</th><th>Owner and reply target</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  const T = {
    greet: ['Hai! Kotak Kita Main Kit 02 (Connect) anda telah sampai pada 12 Mac. Boleh kami tanya sedikit tentangnya?', 'Hi! Your Kita Main Kit 02 (Connect) box arrived on 12 March. Can we ask a few quick questions?'],
    q1: ['Adakah anda sudah menerima kotak tersebut?', 'Have you received the box?'],
    yes: ['Ya, sudah terima', 'Yes, I have it'], no: ['Belum terima', 'Not yet'],
    notyet: ['Maaf! Kurier menunjukkan kotak sudah dihantar. Kami telah merekodkan {id} dan akan hubungi anda hari ini.', 'Sorry! The courier shows it as delivered. We’ve logged {id} and will contact you today.'],
    q2: ['Adakah semua barang lengkap dan dalam keadaan baik?', 'Is everything inside complete and in good condition?'],
    all: ['Ya, semua lengkap', 'Yes, all complete'], missing: ['Ada barang hilang', 'Something is missing'], damaged: ['Ada barang rosak', 'Something is damaged'], wrong: ['Saya dapat kit yang salah', 'I got the wrong kit'],
    q3: ['Sudahkah anda mencuba aktiviti dalam panduan?', 'Have you tried an activity from the guide?'],
    tried: ['Ya, sudah', 'Yes'], nottried: ['Belum lagi', 'Not yet'],
    thanks: ['Terima kasih! Kit 03 (Create) akan tiba sekitar bulan Jun.', 'Thank you! Kit 03 (Create) will arrive around June.'],
    tip: ['Cuba aktiviti “Boneka Bercerita”, 10 minit sahaja. Ia di halaman 4 panduan dalam kotak.', 'Try “Puppet Talk”, just 10 minutes. It’s on page 4 of the guide in the box.'],
    whichD: ['Barang mana yang rosak?', 'Which item is damaged?'], whichM: ['Barang mana yang tiada?', 'Which item is missing?'],
    it1: ['Set boneka tangan', 'Hand puppet set'], it2: ['Buku bergambar', 'Picture books'], it3: ['Kad gambar perasaan', 'Feelings picture cards'],
    photo: ['Boleh hantar gambar barang tersebut? Ia membantu kami menyemak pembekal.', 'Could you send a photo of it? It helps us check with the supplier.'],
    send: ['Hantar gambar', 'Send a photo'],
    logged: ['Terima kasih. Aduan anda direkodkan sebagai {id}. Pasukan kami akan membalas dalam 2 hari bekerja dan menghantar pengganti jika perlu.', 'Thank you. We’ve logged this as {id}. Our team will reply within 2 working days and send a replacement if needed.'],
    wrongK: ['Maaf atas kesilapan ini. Kami telah merekodkan {id} dan akan menghantar kit yang betul.', 'Sorry about that. We’ve logged {id} and will send the right kit.'],
    again: ['Mula semula', 'Start again']
  };
  const tx = (k, vars = {}) => T[k][S.chat.lang === 'bm' ? 0 : 1].replace('{id}', vars.id || '');

  function phone() {
    const c = S.chat;
    if (!c.log.length) c.log = [{ who: 'bot', k: 'greet' }, { who: 'bot', k: 'q1' }];
    const replies = {
      start: [['yes', 'q1yes'], ['no', 'q1no']],
      q2: [['all', 'q2all'], ['missing', 'q2missing'], ['damaged', 'q2damaged'], ['wrong', 'q2wrong']],
      q3: [['tried', 'q3yes'], ['nottried', 'q3no']],
      which: [['it1', 'item:it1'], ['it2', 'item:it2'], ['it3', 'item:it3']],
      photo: [['send', 'photo']],
      end: [['again', 'restart']]
    }[c.step] || [];
    const bubbles = c.log.map((m, i) => m.photo
      ? `<div class="bubble bubble--me bubble--photo"><img src="assets/img/kit-box-open-sm.webp" alt="Photo of the box sent by the parent" width="180" height="155"><span class="bubble__t">10:4${i % 10} ✓✓</span></div>`
      : `<div class="bubble${m.who === 'me' ? ' bubble--me' : ''}">${esc(tx(m.k, m))}<span class="bubble__t">10:4${i % 10}${m.who === 'me' ? ' ✓✓' : ''}</span></div>`).join('');
    return `<div class="phone"><div class="phone__screen">
      <div class="wa-head"><span class="avatar">KM</span><div><div class="wa-head__n">Kita Main</div><div class="wa-head__s">Business account</div></div>
        <div class="wa-lang" role="group" aria-label="Message language"><button type="button" data-act="lang" data-l="bm" aria-pressed="${c.lang === 'bm'}">BM</button><button type="button" data-act="lang" data-l="en" aria-pressed="${c.lang === 'en'}">EN</button></div></div>
      <div class="wa-body" id="wa-body">${bubbles}</div>
      <div class="wa-replies">${replies.map(([k, a]) => `<button class="wa-reply" type="button" data-act="chat" data-a="${a}">${tx(k)}</button>`).join('')}</div>
    </div></div>`;
  }

  function chatAct(a) {
    const c = S.chat;
    const say = (who, k, extra = {}) => c.log.push({ who, k, ...extra });
    if (a === 'restart') { c.log = []; c.step = 'start'; c.item = null; return; }
    if (a === 'q1yes') { say('me', 'yes'); say('bot', 'q2'); c.step = 'q2'; return; }
    if (a === 'q1no') { say('me', 'no'); const id = makeCase('Parcel shows delivered but parent has not received it', 'Not received', 'bad'); say('bot', 'notyet', { id }); c.step = 'end'; return; }
    if (a === 'q2all') { say('me', 'all'); say('bot', 'q3'); c.step = 'q3'; return; }
    if (a === 'q3yes') { say('me', 'tried'); say('bot', 'thanks'); c.step = 'end'; return; }
    if (a === 'q3no') { say('me', 'nottried'); say('bot', 'tip'); say('bot', 'thanks'); c.step = 'end'; return; }
    if (a === 'q2missing' || a === 'q2damaged') { c.kind = a === 'q2missing' ? 'missing' : 'damaged'; say('me', c.kind); say('bot', c.kind === 'missing' ? 'whichM' : 'whichD'); c.step = 'which'; return; }
    if (a === 'q2wrong') { say('me', 'wrong'); const id = makeCase('Parent received the wrong kit stage', 'Wrong kit', 'bad'); say('bot', 'wrongK', { id }); c.step = 'end'; return; }
    if (a.startsWith('item:')) {
      const it = a.slice(5); c.item = it; say('me', it);
      if (c.kind === 'damaged') { say('bot', 'photo'); c.step = 'photo'; return; }
      const id = makeCase(`${T[it][1]} missing from Kit 02 box`, 'Item missing', 'warn'); say('bot', 'logged', { id }); c.step = 'end'; return;
    }
    if (a === 'photo') { c.log.push({ who: 'me', photo: true }); const id = makeCase(`${T[c.item][1]} damaged, photo attached`, 'Item damaged', 'warn'); say('bot', 'logged', { id }); c.step = 'end'; }
  }

  function makeCase(title, cat, tone) {
    const id = `CASE-0${S.nextCase++}`;
    S.cases.forEach(x => { x.isNew = false; });
    S.cases.unshift({ id, title, cat, src: 'Parent, WhatsApp', kit: 2, owner: 'Family operations', st: 'New', tone, sla: '48 h left', hh: 'KM-H-2026-0415', isNew: true, live: true });
    setTimeout(() => {
      const card = $('#cases-card'); if (card) card.innerHTML = casesTable();
      $('#side').innerHTML = side(route());
      toast(`${id} opened automatically`, 'Linked to KM-K-2026-0415-02, Vendor B, BATCH-2027-026 and tracking 630118846702');
    }, 60);
    return id;
  }

  function feedbackTab() {
    const kit = (k, rate, comp, tried, easy) => `<section class="card span-4"><div class="card__head"><div class="grow">${kitTag(k)}<div class="card__meta" style="margin-top:4px">Last 90 days</div></div></div>
      <div class="card__body" style="display:grid;gap:14px">
        ${[['Answered the check-in', rate], ['Box complete and undamaged', comp], ['Tried at least one activity', tried]].map(([l, v]) => `<div><div class="row row--between"><span>${l}</span><span class="strong">${v}%</span></div><div class="bar bar--k${k} mt-8" style="--v:${v / 100}"><i></i></div></div>`).join('')}
        <div class="row row--between"><span>Guide rated easy to use</span><span class="strong">${easy} / 5</span></div>
      </div></section>`;
    const issues = [['Item damaged in transit', 9, 'Mostly puppets from PO-2027-019'], ['Item missing from box', 5, 'All Vendor A, batch 028'], ['Parcel not received', 7, 'Kelantan and Terengganu addresses'], ['Wrong kit stage', 1, 'Vendor A, label mix-up'], ['Guide or link problem', 4, 'Fixed in the March guide print']];
    return `<div class="grid">${kit(1, 64, 97.6, 86, 4.7)}${kit(2, 58, 95.9, 79, 4.5)}${kit(3, 61, 98.1, 81, 4.6)}
      <section class="card span-7"><div class="card__head"><div class="grow"><div class="card__title">What families reported</div><div class="card__meta">Last 90 days</div></div></div>
        <div class="table-wrap"><table class="table"><thead><tr><th>Issue</th><th class="num">Cases</th><th>Pattern found</th></tr></thead><tbody>${issues.map(([a, b, c]) => `<tr><td class="strong">${a}</td><td class="num">${b}</td><td>${c}</td></tr>`).join('')}</tbody></table></div></section>
      <section class="card span-5"><div class="card__head"><div class="grow"><div class="card__title">What we changed because of it</div></div></div>
        <div class="card__body"><div class="timeline">
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Supplier quality flag on S-03</div><div class="tl__s">Puppet seams now checked at goods receipt</div></div><span class="tl__time">Mar</span></div>
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Address check 2 weeks before each kit</div><div class="tl__s">Added after east-coast failed deliveries</div></div><span class="tl__time">Feb</span></div>
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Label scan added to Vendor A packing</div><div class="tl__s">After the wrong-kit case</div></div><span class="tl__time">Feb</span></div>
        </div></div></section></div>`;
  }

  function journeysTab() {
    return `<section class="card"><div class="card__head"><div class="grow"><div class="card__title">Message journey, enrolment to month 8</div><div class="card__meta">Last 30 days</div></div>${brand('whatsapp', 'WhatsApp')}</div>
      <div class="msgs">${D.journeys.map(j => `<div class="msg"><span class="msg__n${j.human ? ' msg__n--human' : ''}">${j.human ? ic('users', 'ic--sm') : j.n}</span>
        <div><div class="strong">${j.when}</div><div class="hint" style="color:var(--ink-2)">${j.what}</div></div>
        <div><div class="strong">${fmt(j.sent)}</div><div class="hint">sent</div></div>
        <div>${j.human ? chip('accent', 'A person replies') : `<div class="strong">${j.read}%</div><div class="hint">read</div>`}</div></div>`).join('')}</div></section>`;
  }

  /* ---------- vendor portal ---------- */
  function vendor(r) {
    const t = r.tab || 'pack';
    const flows = [['pack', 'package-check', 'Pack and inspect', `${188 - S.pack.done} boxes left in batch 031`], ['receive', 'warehouse', 'Receive stock', 'PO-2027-021 due 24 Mar'], ['confirm', 'clipboard-check', 'Confirm batches', S.confirm.sent ? 'Nothing waiting' : '1 batch waiting'], ['dispatch', 'truck', 'Hand over to courier', S.disp.done ? 'Batch 033 with J&T' : 'J&T pickup Tue 14:00'], ['issue', 'triangle-alert', 'Report a problem', 'Shortage, damage, delay']];
    const titles = { pack: 'Pack and inspect', receive: 'Receive stock', confirm: 'Confirm batches', dispatch: 'Hand over to courier', issue: 'Report a problem' };
    const subs = {
      pack: `BATCH-2027-031, Kit 01 Explore. ${188 - S.pack.done} boxes left, due 18 Mar.`,
      receive: 'PO-2027-021 from Supplier S-01 arrived today.',
      confirm: S.confirm.sent ? 'Nothing waiting.' : '1 batch waiting for your answer.',
      dispatch: S.disp.done ? 'BATCH-2027-033 is with J&T.' : 'J&T pickup Tuesday 16 Mar, 14:00.',
      issue: 'Goes to the Kita Main manager. Reply within 24 hours.'
    };
    const tiles = `<div class="v-flows">${flows.map(([k, g, a, b]) => `<a class="card v-flow" href="#/vendor/${k}"${t === k ? ' aria-current="page"' : ''}><div class="v-flow__top"><span class="v-flow__icon">${ic(g)}</span></div><div class="v-flow__t">${a}</div><div class="v-flow__s">${b}</div></a>`).join('')}</div>`;
    const h = head({ title: titles[t], sub: subs[t] });
    const body = { pack: vPack, receive: vReceive, confirm: vConfirm, dispatch: vDispatch, issue: vIssue }[t] || vPack;
    return h + tiles + body();
  }

  function vPack() {
    const p = S.pack;
    const items = [
      ['i1', 'TOY-022', 'Textured sensory balls (set of 4)', 1],
      ['i2', 'TOY-011', 'Stacking rings', 1],
      ['i3', 'BOK-101', 'Touch-and-feel board book (BM)', 1],
      ['i4', 'GDE-01', 'Explore parent play guide', 1]
    ];
    const checks = [
      ['c1', 'Every item checked for damage and cleanliness', 'Anything damaged goes back to quarantine with a photo'],
      ['c2', `Delivery label matches KM-H-2027-0${p.box}`, 'No child’s name or programme details on the outside'],
      ['c3', 'Protective fill added and box sealed with Kita Main tape', 'Same box size for every Kit 01']
    ];
    const qcOk = p.checker === 'VA-02';
    const doneCount = items.filter(([k]) => p.checks[k]).length + checks.filter(([k]) => p.checks[k]).length + (qcOk ? 1 : 0);
    const total = 8;
    const itemRow = ([k, sku, name, qty]) => {
      if (k === 'i2' && !p.checks.i2) {
        return `<div class="cl cl--sub" style="cursor:default"><span class="check-box" style="border-color:var(--warn)"></span>
          <div><div class="cl__t">${sku} ${name} <span class="muted">× ${qty}</span></div><div class="cl__s" style="color:#5c3c00">None left at this station. Choose an approved substitute for KIT01-V2.</div></div>${chip('warn', 'Out')}</div>
          <div class="sub-pick"><button class="btn btn--sm" type="button" data-act="pack-sub">${ic('repeat')} Use TOY-016 stacking cups (approved)</button><button class="btn btn--sm" type="button" data-act="pack-ask">Something else</button>
          ${p.subAsk ? `<div class="err" style="flex-basis:100%">${ic('lock')}Only YGG can approve an item that is not on the list. Request SUB-0012 sent to the Kita Main manager; this box waits.</div>` : ''}</div>`;
      }
      const label = k === 'i2' && p.sub ? `TOY-016 Stacking cups <span class="muted">× 1</span>` : `${sku} ${name} <span class="muted">× ${qty}</span>`;
      const sub = k === 'i2' && p.sub ? 'Approved substitute for TOY-011, recorded on this box' : 'Scan the barcode or tick';
      return `<button class="cl${p.checks[k] ? ' is-checked' : ''}" type="button" data-act="pack-check" data-k="${k}">${box(p.checks[k])}<div><div class="cl__t">${label}</div><div class="cl__s">${sub}</div></div>${ic('scan-line', 'ic--sm')}</button>`;
    };
    return `<div class="pack">
      <section class="card">
        <div class="scanbar"><span class="scanbar__qr">${ic('qr-code', 'ic--lg')}</span>
          <div style="flex:1;min-width:200px"><div class="mono strong">KM-K-2027-0${p.box}-01</div><div class="hint" style="color:var(--ink-2)">BATCH-2027-031, ${kitTag(1)}, spec KIT01-V2, box ${p.done + 1} of 188</div></div>
          <button class="btn btn--sm" type="button" data-act="focus-scan">Scan another label</button></div>
        <div class="checklist">
          <div class="cl-group">Items, from the approved list only</div>
          ${items.map(itemRow).join('')}
          <div class="cl-group">Box checks</div>
          ${checks.map(([k, a, b]) => `<button class="cl${p.checks[k] ? ' is-checked' : ''}" type="button" data-act="pack-check" data-k="${k}">${box(p.checks[k])}<div><div class="cl__t">${a}</div><div class="cl__s">${b}</div></div><span></span></button>`).join('')}
        </div>
        <div class="qc">
          <div class="field"><label for="checker">Quality check signed by</label>
            <select class="select" id="checker" data-act="checker"><option value="">Choose the checker</option><option value="VA-07"${p.checker === 'VA-07' ? ' selected' : ''}>VA-07, packer of this box (you)</option><option value="VA-02"${p.checker === 'VA-02' ? ' selected' : ''}>VA-02, shift supervisor</option></select></div>
          ${p.checker === 'VA-07' ? `<div class="err">${ic('circle-alert')}The checker must be a different person from the packer.</div>` : qcOk ? `<div class="row" style="color:var(--ok);font-weight:600">${ic('shield-check')} QC passed by VA-02 at 10:42</div>` : ''}
        </div>
        <div class="pack__foot">
          <div style="flex:1;min-width:200px"><div class="row row--between"><span class="strong">${doneCount} of ${total} checks</span><span class="hint">${doneCount === total ? 'Ready' : 'Finish every check to continue'}</span></div><div class="bar bar--ok mt-8" style="--v:${doneCount / total}"><i></i></div></div>
          <button class="btn btn--primary btn--lg" type="button" data-act="pack-done"${doneCount === total ? '' : ' disabled'}>Mark ready for dispatch</button>
        </div>
      </section>
      <div class="stack">
        <section class="card">
          <div class="big-photo"><img src="assets/img/kit-box-open.webp" alt="The first finished Kit 01 box of the batch, open, with stacking rings, two soft balls and board books" width="1125" height="1088"></div>
          <div class="card__head card__head--flat"><div class="grow"><div class="card__title">First finished box, BATCH-2027-031</div></div>${chip('ok', 'Approved')}</div>
          <div class="card__body"><dl class="kv"><dt>Uploaded</dt><dd>15 Mar, 08:41 by VA-02</dd><dt>Checked by YGG</dt><dd>15 Mar, 09:05</dd><dt>Damage photos</dt><dd>None in this batch</dd><dt>First-pass QC</dt><dd>96.1%, 0 in rework</dd></dl></div>
        </section>
        <div class="note note--lock">${ic('lock')}<div>You see Vendor A’s work orders only. Eligibility documents, income evidence and parent feedback are never shown in this portal.</div></div>
      </div>
    </div>`;
  }

  function vReceive() {
    const g = S.grn;
    const rows = g.rows.map(([sku, name, ord, rec, dmg], i) => {
      const acc = Math.max(rec - dmg, 0);
      return `<tr><td class="mono strong">${sku}</td><td>${name}</td><td class="num">${fmt(ord)}</td>
        <td style="width:120px"><input class="input input--num" type="number" min="0" value="${rec}" data-act="grn" data-i="${i}" data-c="3" aria-label="Received ${sku}"${g.sent ? ' disabled' : ''}></td>
        <td style="width:120px"><input class="input input--num" type="number" min="0" value="${dmg}" data-act="grn" data-i="${i}" data-c="4" aria-label="Damaged ${sku}"${g.sent ? ' disabled' : ''}></td>
        <td class="num strong">${fmt(acc)}</td>
        <td>${rec < ord ? chip('warn', `${ord - rec} short`) : dmg ? chip('warn', `${dmg} to quarantine`) : chip('ok', 'Matches')}</td></tr>`;
    }).join('');
    const short = g.rows.reduce((s, r) => s + Math.max(r[2] - r[3], 0), 0);
    const dmg = g.rows.reduce((s, r) => s + r[4], 0);
    const needPhoto = dmg > 0 && !g.photo;
    return `<div class="pack">
      <section class="card">
        <div class="card__head"><div class="grow"><div class="card__title">PO-2027-021, Kit 01 items</div></div>${g.sent ? chip('ok', 'GRN-2027-051 submitted') : chip('line', 'Draft')}</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Item</th><th class="num">Ordered</th><th>Received</th><th>Damaged</th><th class="num">Accepted</th><th>Result</th></tr></thead><tbody>${rows}</tbody></table></div>
        <div class="qc" style="border-top:1px solid var(--line)">
          <button class="upload${g.photo ? ' is-done' : ''}" type="button" data-act="grn-photo"${g.sent ? ' disabled' : ''}><span class="upload__thumb">${g.photo ? ic('check') : ic('camera')}</span><span><b>${g.photo ? '3 photos attached' : 'Add photos of damaged items'}</b><br><span class="hint">${dmg ? 'Required when anything is damaged' : 'Optional when everything matches'}</span></span></button>
          ${needPhoto ? `<div class="err">${ic('circle-alert')}Add a photo of the ${dmg} damaged items before you submit.</div>` : ''}
          ${g.sent ? `<div class="note note--warn">${ic('triangle-alert')}<div><b>Discrepancy recorded.</b> ${short} units short and ${dmg} damaged. Usable stock rose by the accepted units only; damaged units are in quarantine and CASE-0150 is with the Kita Main manager.</div></div>` : ''}
        </div>
        <div class="pack__foot"><span class="hint">Received by VA-07, 15 Mar</span><button class="btn btn--primary btn--lg" type="button" data-act="grn-send"${g.sent || needPhoto ? ' disabled' : ''}>Submit goods received note</button></div>
      </section>
      <div class="stack"><section class="card"><div class="card__head"><div class="grow"><div class="card__title">On submit</div></div></div>
        <div class="card__body"><div class="timeline">
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Accepted units become stock</div><div class="tl__s">Logged as a receipt movement against the PO</div></div></div>
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Damaged units go to quarantine</div><div class="tl__s">They never count as available</div></div></div>
          <div class="tl"><span class="tl__dot">${ic('check')}</span><div><div class="tl__t">Shortfalls alert the manager</div><div class="tl__s">A case opens with the supplier claim</div></div></div>
        </div></div></section>
        <div class="note note--lock">${ic('lock')}<div>Suppliers deliver straight to you, so YGG never stores or moves stock itself.</div></div></div>
    </div>`;
  }

  function vConfirm() {
    const c = S.confirm;
    const need = [['TOY-022', 'Textured sensory balls', 188, 120, 400], ['TOY-011', 'Stacking rings', 188, 140, 400], ['BOK-101', 'Touch-and-feel board book', 188, 210, 200], ['GDE-01', 'Explore play guide', 188, 600, 0], ['PKG-01', 'Shipping box', 188, 900, 750]];
    return `<div class="pack">
      <section class="card">
        <div class="card__head"><div class="grow"><div class="card__title">BATCH-2027-035, ${kitTag(1)}</div><div class="card__meta">2027-C2 wave 1, 188 boxes, hand to J&T by 7 Apr</div></div>${c.sent ? chip('ok', 'Confirmed') : chip('warn', 'Waiting for you')}</div>
        <div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Item</th><th class="num">Needed</th><th class="num">On hand</th><th class="num">Arriving by 24 Mar</th><th>Enough?</th></tr></thead>
          <tbody>${need.map(([s, n, nd, oh, inc]) => `<tr><td class="mono strong">${s}</td><td>${n}</td><td class="num">${nd}</td><td class="num">${fmt(oh)}</td><td class="num">${inc ? fmt(inc) : '<span class="muted">0</span>'}</td><td>${chip('ok', 'Yes')}</td></tr>`).join('')}</tbody></table></div>
        <div class="qc"><div class="form-grid">
          <div class="field"><label for="d1">Start packing</label><input class="input" id="d1" type="text" value="29 Mar"${c.sent ? ' disabled' : ''}></div>
          <div class="field"><label for="d2">Ready for courier</label><input class="input" id="d2" type="text" value="5 Apr"${c.sent ? ' disabled' : ''}></div>
          <div class="field"><label for="d3">Packers on the line</label><input class="input" id="d3" type="text" value="4"${c.sent ? ' disabled' : ''}></div>
          <div class="field"><label for="d4">April capacity, boxes a week</label><input class="input" id="d4" type="text" value="100"${c.sent ? ' disabled' : ''}></div>
        </div></div>
        ${c.flagged ? `<div class="qc"><div class="note note--warn">${ic('triangle-alert')}<div><b>Flagged to YGG.</b> The Kita Main manager will call you today to agree new dates.</div></div></div>` : ''}
        <div class="pack__foot"><button class="btn" type="button" data-act="confirm-flag"${c.sent || c.flagged ? ' disabled' : ''}>Can’t do it as planned</button><button class="btn btn--primary btn--lg" type="button" data-act="confirm"${c.sent || c.flagged ? ' disabled' : ''}>${c.sent ? 'Batch confirmed' : 'Confirm batch'}</button></div>
      </section>
      <div class="stack"><div class="note">${ic('circle-alert')}<div>Confirming tells YGG this batch is safe to promise families. Your April capacity also feeds the intake gate for ${D.cohort.nextId}.</div></div></div>
    </div>`;
  }

  function vDispatch() {
    const d = S.disp;
    const ok = String(d.handed) === '130' && d.proof;
    const steps = [['Booked with J&T', 'Pickup Tue 16 Mar, 14:00', true], ['Collected by courier', d.done ? 'Signed manifest, 130 parcels' : 'Needs the signed manifest', d.done], ['In transit', 'From J&T tracking', false], ['Out for delivery', 'From J&T tracking', false], ['Delivered', 'Photo or signature required', false]];
    return `<div class="pack">
      <section class="card">
        <div class="card__head"><div class="grow"><div class="card__title">BATCH-2027-033, ${kitTag(3)}</div><div class="card__meta">2026-C3, 130 boxes, every box passed QC</div></div>${d.done ? chip('info', 'With courier') : chip('line', 'Ready for courier')}</div>
        <div class="card__body" style="display:grid;gap:16px">
          <div><div class="row row--between"><span class="strong">Parcels scanned onto the pallet</span><span class="strong">130 of 130</span></div><div class="bar bar--ok mt-8" style="--v:1"><i></i></div></div>
          <div class="form-grid">
            <div class="field"><label for="handed">Parcels the courier took</label><input class="input input--num" id="handed" type="number" min="0" placeholder="Count them with the driver" value="${d.handed}" data-act="handed"${d.done ? ' disabled' : ''}></div>
            <div class="field"><span class="label">Courier</span><div class="input" style="display:flex;align-items:center;background:var(--surface-2)">J&T Express, scheduled pickup</div></div>
          </div>
          ${d.handed !== '' && String(d.handed) !== '130' ? `<div class="err">${ic('circle-alert')}The count must match the 130 scanned parcels. Recount with the driver or report a problem.</div>` : ''}
          <button class="upload${d.proof ? ' is-done' : ''}" type="button" data-act="disp-proof"${d.done ? ' disabled' : ''}><span class="upload__thumb">${d.proof ? '<img src="assets/img/kit-parcel-sm.webp" alt="" width="50" height="30">' : ic('camera')}</span><span><b>${d.proof ? 'Signed pickup manifest attached' : 'Photo of the pickup manifest, signed by the driver'}</b><br><span class="hint">${d.proof ? 'manifest_BATCH-2027-033.jpg, 1.4 MB' : 'Required before handover'}</span></span></button>
          ${d.done ? `<div class="note">${ic('circle-check')}<div><b>Handed over.</b> 130 tracking numbers are linked to their households. Delivery updates now come from J&T tracking, and families get their tracking message automatically.</div></div>` : ''}
        </div>
        <div class="pack__foot"><span class="hint">${ok || d.done ? 'Count and proof match' : 'Needs the count and the signed manifest'}</span><button class="btn btn--primary btn--lg" type="button" data-act="disp-done"${ok && !d.done ? '' : ' disabled'}>${d.done ? 'Handed over' : 'Confirm handover'}</button></div>
      </section>
      <div class="stack"><section class="card"><div class="card__head"><div class="grow"><div class="card__title">Courier status</div></div></div>
        <div class="card__body"><div class="timeline">${steps.map(([a, b, on], i) => `<div class="tl"><span class="tl__dot${on ? '' : (i === 1 || (d.done && i === 2)) ? ' tl__dot--now' : ' tl__dot--next'}">${on ? ic('check') : ''}</span><div><div class="tl__t">${a}</div><div class="tl__s">${b}</div></div></div>`).join('')}</div></div></section></div>
    </div>`;
  }

  function vIssue() {
    const list = [['Supplier sent too few', 'Order, item, how many short'], ['Damaged stock', 'Item, how many, photos'], ['Item missing from a kit', 'Box label, item'], ['Need a substitute', 'Item, what you could use'], ['Packing mistake found', 'Box label, what went wrong'], ['Batch will be late', 'Batch, new date, why'], ['Courier did not collect', 'Batch, booking, what happened'], ['Something else', 'Tell us what happened']];
    const sel = S.issue;
    return `<div class="issue-grid">${list.map(([a, b], i) => `<button class="card issue" type="button" data-act="issue" data-i="${i}" aria-pressed="${sel === i}"><span class="v-flow__icon">${ic(['package', 'image', 'clipboard-list', 'repeat', 'flag', 'clock', 'truck', 'message-circle'][i])}</span><span class="issue__t">${a}</span><span class="issue__s">${b}</span></button>`).join('')}</div>
      ${sel === null ? '' : `<section class="card"><div class="card__head"><div class="grow"><div class="card__title">${list[sel][0]}</div></div></div>
        <div class="card__body"><div class="form-grid">
          <div class="field"><label for="is1">Batch or order</label><select class="select" id="is1"><option>BATCH-2027-031, Kit 01</option><option>PO-2027-021</option><option>BATCH-2027-033, Kit 03</option></select></div>
          <div class="field"><label for="is2">Item</label><select class="select" id="is2"><option>TOY-011 Stacking rings</option><option>TOY-022 Sensory balls</option><option>BOK-101 Board book</option></select></div>
          <div class="field"><label for="is3">How many</label><input class="input input--num" id="is3" type="number" value="24"></div>
          <div class="field"><label for="is4">What happened</label><input class="input" id="is4" type="text" value="Station ran out mid-shift; 24 boxes waiting"></div>
        </div>
        ${S.issueSent ? `<div class="note mt-16">${ic('circle-check')}<div><b>VND-0021 sent.</b> Assigned to the Kita Main manager, reply due by 10:50 tomorrow. You’ll see the answer here and on the batch.</div></div>` : ''}</div>
        <div class="pack__foot"><button class="upload${S.issuePhoto ? ' is-done' : ''}" type="button" style="max-width:320px" data-act="issue-photo"${S.issueSent ? ' disabled' : ''}><span class="upload__thumb">${ic(S.issuePhoto ? 'check' : 'camera')}</span><span><b>${S.issuePhoto ? 'Photo attached' : 'Add a photo'}</b><br><span class="hint">${S.issuePhoto ? 'IMG_0412.jpg' : 'Optional'}</span></span></button><button class="btn btn--primary btn--lg" type="button" data-act="issue-send"${S.issueSent ? ' disabled' : ''}>Send to YGG</button></div></section>`}`;
  }

  /* ---------- system map ---------- */
  function system() {
    const chain = [['Engine 1', 'Application', 'KM-A-2027-1418'], ['Engine 1', 'Household', 'KM-H-2027-0418, verified once'], ['Engine 1', 'Enrolment', 'Cohort 2027-C1, wave 3'], ['Engine 3', 'Kit orders × 3', 'KM-K-2027-0418-01, -02, -03'], ['Engine 2', 'Stock allocation', 'KIT01-V2 items at Vendor A'], ['Engine 3', 'Packing and QC', 'BATCH-2027-031, packer and checker'], ['Engine 3', 'Shipment', 'J&T tracking, proof of delivery'], ['Engine 4', 'Check-in and cases', 'Feedback, CASE-0148']];
    const tables = [
      [1, 'Demand and cohorts', [['HOUSEHOLDS', 'Household ID, guardian, district, source, status'], ['CHILDREN', 'Child ID, birth date, age band'], ['APPLICATIONS', 'Channel, rule results, route'], ['VERIFICATION', 'Rule, result, reviewer, reason'], ['DOCUMENTS', 'Type, restricted link, review'], ['ENROLMENTS', 'Cohort, approved by, date'], ['COHORTS', 'Capacity, gate checks, waves']]],
      [2, 'Kits and inventory', [['KIT_SPECS', 'Kit, version, effective date'], ['KIT_COMPONENTS', 'SKU, quantity, approved substitute'], ['PRODUCTS', 'SKU, supplier, safety notes'], ['SUPPLIERS', 'Lead time, terms, status'], ['PURCHASE_ORDERS', 'Lines, deliver-to vendor, due'], ['GOODS_RECEIPTS', 'Expected, received, accepted'], ['STOCK_MOVEMENTS', 'Type, quantity, location, reference']]],
      [3, 'Fulfilment and delivery', [['KIT_ORDERS', 'Household, kit stage, version, due'], ['BATCHES', 'Vendor, kit, cohort, dates'], ['PACKING_RECORDS', 'Box, packer, time, substitutes'], ['QUALITY_CHECKS', 'Checker, result, rework'], ['SHIPMENTS', 'Carrier, tracking number'], ['SHIPMENT_EVENTS', 'Status, time, proof link']]],
      [4, 'Parent engagement', [['MESSAGES', 'Template, language, sent, read'], ['FEEDBACK', 'Kit order, answers, rating'], ['CASES', 'Category, owner, deadline'], ['CASE_ACTIONS', 'What was done, by whom'], ['REFERRALS', 'Referring household, consent']]]
    ];
    const P = { e: ['edit', 'Edit'], v: ['view', 'View'], o: ['own', 'Own only'], n: ['none', 'None'] };
    const roles = [['CEO, acting manager', 'vvvvvv'], ['Kita Main manager', 'eeeeee'], ['Family operations', 'eeevve'], ['Partnerships and engagement', 'nvnnve'], ['Vendor A or B', 'nnoooo'], ['Parent', 'onnnno']];
    const cols = ['Eligibility documents', 'Households and cohorts', 'Stock and orders', 'Packing and QC', 'Shipments and proof', 'Cases and feedback'];
    const tools = [
      [brand('google-forms', 'Google Forms', 'brand-ic--lg'), 'Google Forms', 'Registration from every channel, one form, required fields'],
      [ic('layout-dashboard', 'ic--lg'), 'AppSheet', 'Staff and vendor screens: approvals, checklists, uploads'],
      [brand('google-sheets', 'Google Sheets', 'brand-ic--lg'), 'Google Sheets, then a database', 'Pilot data store; move to a database before volume slows it'],
      [ic('gauge', 'ic--lg'), 'Looker Studio', 'Management reports and funder scorecards'],
      [brand('whatsapp', 'WhatsApp', 'brand-ic--lg'), 'WhatsApp through SleekFlow', 'Milestone messages and check-ins, replies written back'],
      [brand('google-drive', 'Google Drive', 'brand-ic--lg'), 'Restricted Drive folder', 'Eligibility documents, never in chats or open sheets']
    ];
    return head({ title: 'System map', sub: 'How the records connect, and who can open each one.' }) + `
      <section class="card"><div class="card__head"><div class="grow"><div class="card__title">One household, end to end</div></div></div>
        <div class="card__body"><div class="idchain">${chain.map(([e, k, v], i) => `<div class="idnode"><div class="idnode__top"><span class="idnode__n">${i + 1}</span><span class="idnode__e">${e}</span></div><span class="idnode__k">${k}</span><span class="idnode__v">${v}</span></div>`).join('')}</div></div></section>
      <section class="card"><div class="card__head"><div class="grow"><div class="card__title">Tables by engine</div><div class="card__meta">Shared by all: USERS_AND_ROLES and an EVENT_LOG of every status change, who made it and why</div></div></div>
        <div class="card__body"><div class="tables4">${tables.map(([n, name, list]) => `<div class="tgroup"><div class="tgroup__h">${num(n)} ${name}</div>${list.map(([a, b]) => `<div class="tchip"><div class="tchip__n">${a}</div><div class="tchip__f">${b}</div></div>`).join('')}</div>`).join('')}</div></div></section>
      <div class="grid">
        <section class="card span-12"><div class="card__head"><div class="grow"><div class="card__title">Who can see what</div></div></div>
          <div class="table-wrap"><table class="table matrix"><thead><tr><th>Role</th>${cols.map(c => `<th>${c}</th>`).join('')}</tr></thead>
          <tbody>${roles.map(([r, p]) => `<tr><td class="strong">${r}</td>${[...p].map(x => `<td><span class="perm perm--${P[x][0]}">${P[x][1]}</span></td>`).join('')}</tr>`).join('')}</tbody></table></div></section>
        <section class="card span-12"><div class="card__head"><div class="grow"><div class="card__title">Tools it runs on</div><div class="card__meta">Low-code, on YGG’s Google Workspace</div></div></div>
          <div class="card__body"><div class="tools">${tools.map(([m, a, b]) => `<div class="tool"><span class="tool__mark">${m}</span><div><div class="tool__t">${a}</div><div class="tool__s">${b}</div></div></div>`).join('')}</div>
          <p class="hint mt-12">Product names and logos are trademarks of their owners.</p></div></section>
      </div>`;
  }

  /* ---------- drawers ---------- */
  function drawerHTML(kind, id) {
    if (kind === 'app') {
      const a = D.queue.find(x => x.id === id); if (!a) return '';
      const done = S.approved.has(a.id);
      const hh = 'KM-H-2027-0' + a.id.slice(-3);
      const rules = D.ruleNames.map((n, i) => {
        const c = a.checks[i];
        const why = c === 'ok' ? ['Pass', ''] : i === 3 ? ['Check', 'Same phone number and child’s birth date as KM-H-2027-0217'] : c === 'bad' ? ['Fail', a.reason] : ['Check', a.reason];
        return `<div class="gate__row"><span class="gate__icon${c === 'ok' ? '' : ' gate__icon--pending'}"${c === 'bad' ? ' style="background:var(--bad-soft);color:var(--bad)"' : ''}>${ic(c === 'ok' ? 'check' : c === 'bad' ? 'x' : 'circle-alert')}</span><div><div class="gate__label">${n}</div>${why[1] ? `<div class="gate__detail">${why[1]}</div>` : ''}</div><span class="hint">${why[0]}</span></div>`;
      }).join('');
      const rt = routeOf(a), closedNote = S.closed[a.id], asked = S.asked.has(a.id);
      const close = `<button class="btn" type="button" data-act="close">Close</button>`;
      const foot = done ? `<span class="hint">Enrolled in ${D.cohort.id}</span>`
        : closedNote ? `<span class="hint">${closedNote}</span>`
        : rt === 'green' ? `${close}<button class="btn btn--primary" type="button" data-act="approve-one" data-id="${a.id}">Approve and enrol</button>`
          : rt === 'amber' ? (a.dup ? `<button class="btn" type="button" data-act="app-merge" data-id="${a.id}">Merge with 0217</button><button class="btn btn--primary" type="button" data-act="app-clear" data-id="${a.id}">Not a duplicate</button>` : asked ? `${close}<span class="hint">Upload link sent on WhatsApp</span>` : `${close}<button class="btn btn--primary" type="button" data-act="app-ask" data-id="${a.id}">Ask the parent on WhatsApp</button>`)
            : `${close}<button class="btn btn--primary" type="button" data-act="app-close" data-id="${a.id}">Close with notice</button>`;
      const status = done ? chip('ok', 'Enrolled') : closedNote ? chip('line', closedNote) : asked ? chip('info', 'Waiting for parent') : rt === 'green' ? chip('ok', 'Passes every rule') : rt === 'amber' ? chip('warn', 'Needs information') : chip('bad', 'Needs review');
      return `<div class="drawer__head"><div class="grow"><div class="eyebrow mono">${a.id}</div><div class="drawer__title">${a.who}</div><div class="row mt-8">${status}<span class="chip chip--line chip--plain">${a.src}</span></div></div><button class="icon-btn" type="button" data-act="close" aria-label="Close">${ic('x')}</button></div>
        <div class="drawer__body">
          <div class="d-sec"><div class="d-sec__title">Household</div><dl class="kv"><dt>Household ID</dt><dd class="mono">${hh}</dd><dt>District</dt><dd>${a.place}</dd><dt>Child’s age</dt><dd>${a.age === null ? 'Birth date missing' : a.age + ' months'}</dd><dt>Phone</dt><dd>+60 1X-XXX ${a.id.slice(-4)}</dd><dt>Consent</dt><dd>Given at registration</dd><dt>Waiting</dt><dd>${a.wait}</dd></dl></div>
          <div class="d-sec"><div class="d-sec__title">Five rule checks</div><div class="gate">${rules}</div></div>
          <div class="d-sec"><div class="d-sec__title">On approval, three kit orders are planned</div><div class="kits3">${[[1, 'w/c 22 Mar'], [2, 'June 2027'], [3, 'September 2027']].map(([k, d]) => `<div class="kitstep"><div class="kitstep__top">${kitTag(k)}</div><div class="hint">${done ? 'Planned' : 'Will plan'} for ${d}</div></div>`).join('')}</div></div>
          <div class="note note--lock">${ic('lock')}<div>Documents stay in the restricted Drive folder.</div></div>
        </div><div class="drawer__foot">${foot}</div>`;
    }
    if (kind === 'ship') {
      const s = D.shipments.find(x => x.awb === id); if (!s) return '';
      const failed = s.tone === 'bad';
      const rebooked = !!S.shipSt[s.awb];
      const evs = failed
        ? [['Handed to J&T by Vendor B', 'Signed manifest, 188 parcels', '7 Mar, 14:10', 'ok'], ['In transit', 'Kelantan hub', '9 Mar, 06:20', 'ok'], ['Delivery attempt 1 failed', 'Nobody home', '10 Mar, 15:05', 'bad'], ['Delivery attempt 2 failed', 'Address not found', '12 Mar, 16:40', 'bad'], ['Case opened', 'CASE-0146, family operations', '12 Mar, 16:41', 'now']]
        : [['Handed to courier', s.carrier === 'Lalamove' ? 'Same-day replacement booked with proof required' : 'Signed manifest uploaded by Vendor B', s.carrier === 'Lalamove' ? '13 Mar, 11:20' : '7 Mar, 14:10', 'ok'], ['In transit', s.carrier === 'Lalamove' ? 'Driver assigned' : 'Selangor hub', s.carrier === 'Lalamove' ? '13 Mar, 11:34' : '8 Mar, 07:45', 'ok'], ['Out for delivery', s.to, s.carrier === 'Lalamove' ? '13 Mar, 15:30' : '9 Mar, 09:30', s.st === 'Delivered' ? 'ok' : 'now'], ['Delivered', s.pod ? s.pod + ' recorded' : 'Waiting', s.st === 'Delivered' ? s.last : '', s.st === 'Delivered' ? 'ok' : 'next']];
      const sig = `<svg viewBox="0 0 200 90" aria-label="Recipient signature"><path d="M14 62c12-22 22-38 30-34 9 5-11 38-2 40 10 2 18-30 26-28 7 2-2 26 6 26 10 0 14-22 24-20 8 2 2 18 12 18 9 0 13-14 22-12 6 1 4 10 12 9 12-2 20-10 32-12" fill="none" stroke="#1d3c7a" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><line x1="10" y1="76" x2="190" y2="76" stroke="rgba(30,26,25,.18)"/></svg>`;
      return `<div class="drawer__head"><div class="grow"><div class="eyebrow">${s.carrier}</div><div class="drawer__title mono">${s.awb}</div><div class="row mt-8">${rebooked ? chip(S.shipSt[s.awb][1], S.shipSt[s.awb][0]) : chip(s.tone, s.st)}${s.kase ? `<span class="chip chip--line chip--plain">${s.kase}</span>` : ''}</div></div><button class="icon-btn" type="button" data-act="close" aria-label="Close">${ic('x')}</button></div>
        <div class="drawer__body">
          <dl class="kv"><dt>Kit order</dt><dd>${s.ko}</dd><dt>Household</dt><dd class="mono">${s.hh}</dd><dt>Destination</dt><dd>${s.to}</dd><dt>Batch</dt><dd class="mono">${s.batch}</dd></dl>
          <div class="d-sec"><div class="d-sec__title">Tracking</div><div class="timeline">${evs.map(([a, b, t, st]) => `<div class="tl"><span class="tl__dot${st === 'bad' ? ' tl__dot--bad' : st === 'now' ? ' tl__dot--now' : st === 'next' ? ' tl__dot--next' : ''}">${st === 'ok' ? ic('check') : st === 'bad' ? ic('x') : ''}</span><div><div class="tl__t">${a}</div><div class="tl__s">${b}</div></div><span class="tl__time">${t}</span></div>`).join('')}</div></div>
          ${s.pod ? `<div class="d-sec"><div class="d-sec__title">${ic('shield-check', 'ic--sm')} Proof of delivery</div><div class="evidence">
            <div class="ev"><div class="ev__img"><img src="assets/img/kit-parcel-sm.webp" alt="Delivery photo of the Kita Main parcel" width="472" height="271"></div><div class="ev__cap"><b>Delivery photo</b>${s.last}</div></div>
            ${/signature/.test(s.pod) ? `<div class="ev"><div class="ev__img ev__img--sig">${sig}</div><div class="ev__cap"><b>Signed by the parent</b>Name hidden on screen</div></div>` : `<div class="ev"><div class="ev__img ev__img--sig" style="color:var(--muted)">${ic('pen-line', 'ic--lg')}</div><div class="ev__cap"><b>No signature</b>Left at the door, photo only</div></div>`}
          </div><p class="hint">${s.carrier === 'Lalamove' ? 'Photo and signature come from the Lalamove order, requested when it was booked.' : 'Imported from the J&T tracking export; the household only shows Delivered once proof is in.'}</p></div>`
          : failed ? `<div class="note note--warn">${ic('triangle-alert')}<div><b>Not delivered, so the household still shows Kit 01 as not received.</b> Family operations is confirming the address on WhatsApp before a redelivery is booked.</div></div>` : `<div class="note">${ic('clock')}<div>Proof of delivery is required before this kit counts as delivered.</div></div>`}
        </div><div class="drawer__foot"><button class="btn" type="button" data-act="close">Close</button>${failed && !rebooked ? `<button class="btn btn--primary" type="button" data-act="ship-rebook" data-id="${s.awb}">Book redelivery</button>` : ''}</div>`;
    }
    if (kind === 'case') {
      const c = S.cases.find(x => x.id === id); if (!c) return '';
      const main = c.id === 'CASE-0147';
      const chain = main
        ? [['users', 'Household', 'KM-H-2026-0388, cohort 2026-C4'], ['package', 'Kit order', 'KM-K-2026-0388-02, KIT02-V1'], ['boxes', 'Item', 'TOY-031 hand puppet set'], ['receipt', 'Purchase order', 'PO-2027-019, Supplier S-03'], ['store', 'Packed by', 'Vendor B, BATCH-2027-026, packer VB-04, QC VB-01'], ['truck', 'Shipment', '630118846650, delivered 7 Mar with photo']]
        : c.live ? [['users', 'Household', c.hh + ', cohort 2026-C4'], ['package', 'Kit order', 'KM-K-2026-0415-02, KIT02-V1'], ['boxes', 'Item', 'From the parent’s answer'], ['receipt', 'Purchase order', 'PO-2027-019, Supplier S-03'], ['store', 'Packed by', 'Vendor B, BATCH-2027-026'], ['truck', 'Shipment', '630118846702, delivered 12 Mar with photo']]
          : [['users', 'Household', c.hh || 'Not linked to a family'], ['package', 'Kit order', c.hh ? c.hh.replace('KM-H', 'KM-K') + '-0' + c.kit : 'PO-2027-019'], ['store', 'Vendor', c.src.startsWith('Vendor') ? c.src : 'Vendor A'], ['truck', 'Shipment', c.cat === 'Not received' ? '630118847240, failed twice' : 'Delivered with photo']];
      const acts = main
        ? [['Parent answered the check-in: something damaged', 'Photo attached on WhatsApp', '8 Mar, 10:41', 'ok'], ['Case opened automatically', 'Linked to kit, item, batch, supplier', '8 Mar, 10:41', 'ok'], ['Photo reviewed, replacement approved', 'Family operations. No new kit entitlement', '8 Mar, 14:02', 'ok'], ['Replacement sent with Lalamove', 'LLM-2027-0031 from Vendor B', '13 Mar, 11:20', 'ok'], ['Delivered with photo and signature', 'Parent confirmed on WhatsApp', '13 Mar, 16:08', 'ok']]
        : [['Reported', c.src, c.live ? 'Today, 10:41' : '12 Mar', 'ok'], ['Case opened and assigned', c.owner, c.live ? 'Today, 10:41' : '12 Mar', 'ok'], [c.st, 'Reply target: ' + c.sla, 'Now', 'now'], ['Resolved and confirmed with the family', '', '', 'next']];
      return `<div class="drawer__head"><div class="grow"><div class="eyebrow mono">${c.id}</div><div class="drawer__title">${c.title}</div><div class="row mt-8">${chip(c.tone, c.st)}${kitTag(c.kit)}</div></div><button class="icon-btn" type="button" data-act="close" aria-label="Close">${ic('x')}</button></div>
        <div class="drawer__body">
          <dl class="kv"><dt>Category</dt><dd>${c.cat}</dd><dt>Reported by</dt><dd>${c.src}</dd><dt>Owner</dt><dd>${c.owner}</dd><dt>Reply target</dt><dd>${c.sla}</dd></dl>
          <div class="d-sec"><div class="d-sec__title">Linked records</div><div class="chain">${chain.map(([g, k, v]) => `<div class="chain__row">${ic(g, 'ic--sm')}<span class="chain__k">${k}</span><span class="chain__v">${v}</span></div>`).join('')}</div></div>
          ${main || c.live ? `<div class="note note--warn">${ic('triangle-alert')}<div><b>Third puppet seam fault this month,</b> all from PO-2027-019. Quality flag raised with Supplier S-03.</div></div>` : ''}
          <div class="d-sec"><div class="d-sec__title">What happened</div><div class="timeline">${acts.map(([a, b, t, st]) => `<div class="tl"><span class="tl__dot${st === 'now' ? ' tl__dot--now' : st === 'next' ? ' tl__dot--next' : ''}">${st === 'ok' ? ic('check') : ''}</span><div><div class="tl__t">${a}</div>${b ? `<div class="tl__s">${b}</div>` : ''}</div><span class="tl__time">${t}</span></div>`).join('')}</div></div>
        </div><div class="drawer__foot"><button class="btn" type="button" data-act="close">Close</button>${c.tone === 'ok' || S.caseSt[c.id] || !/damaged|missing|Wrong/i.test(c.cat) ? '' : `<button class="btn btn--primary" type="button" data-act="case-replace" data-id="${c.id}">Approve replacement</button>`}</div>`;
    }
    if (kind === 'batch') {
      let c = null; D.lanes.forEach(l => l.cards.forEach(x => { if (x.id === id) c = { ...x, lane: l.name }; }));
      if (!c) return '';
      const done = c.done === undefined ? 0 : c.done;
      return `<div class="drawer__head"><div class="grow"><div class="eyebrow">${c.vendor}</div><div class="drawer__title mono">${c.id}</div><div class="row mt-8">${chip(c.tone === 'line' ? 'line' : c.tone, c.lane)}${kitTag(c.kit)}</div></div><button class="icon-btn" type="button" data-act="close" aria-label="Close">${ic('x')}</button></div>
        <div class="drawer__body">
          <dl class="kv"><dt>Cohort</dt><dd>${c.cohort}</dd><dt>Boxes</dt><dd>${c.n}</dd><dt>Due</dt><dd>${c.due}</dd><dt>Spec</dt><dd class="mono">KIT0${c.kit}-V${c.kit === 1 ? 2 : 1}</dd><dt>Status</dt><dd>${c.note}</dd></dl>
          <div class="d-sec"><div class="row row--between"><span class="d-sec__title">Progress</span><span class="strong">${done} of ${c.n}</span></div><div class="bar bar--k${c.kit}" style="--v:${done / c.n};height:10px"><i></i></div></div>
          <div class="d-sec"><div class="d-sec__title">Evidence on file</div><div class="evidence">
            <div class="ev"><div class="ev__img"><img src="assets/img/kit-box-open-sm.webp" alt="First finished box of the batch" width="472" height="456"></div><div class="ev__cap"><b>First finished box</b>${done ? 'Approved by YGG' : 'Due when packing starts'}</div></div>
            <div class="ev"><div class="ev__img" style="color:var(--muted)">${ic('clipboard-check', 'ic--lg')}</div><div class="ev__cap"><b>${done} packing records</b>Each with packer, checker and time</div></div>
          </div></div>
        </div><div class="drawer__foot"><a class="btn" href="#/vendor/pack">Open in vendor portal</a><button class="btn btn--primary" type="button" data-act="close">Done</button></div>`;
    }
    return '';
  }

  function openDrawer(spec) {
    const [kind, id] = spec.split(':');
    const html = drawerHTML(kind, id); if (!html) return;
    const d = $('#drawer'); d.innerHTML = html; d.classList.add('is-open'); d.setAttribute('aria-hidden', 'false');
    $('#scrim').classList.add('is-open');
    d.dataset.spec = spec;
    const f = d.querySelector('button, a'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 50);
  }
  function closeDrawer() {
    const d = $('#drawer'); d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); $('#scrim').classList.remove('is-open');
    if (/[?&]open=/.test(location.hash)) history.replaceState(null, '', location.hash.split('?')[0]);
  }
  const refreshDrawer = () => { const d = $('#drawer'); if (d.classList.contains('is-open') && d.dataset.spec) { const [k, i] = d.dataset.spec.split(':'); d.innerHTML = drawerHTML(k, i); } };

  let tt;
  function toast(title, text, tone) {
    const t = $('#toast');
    t.classList.toggle('toast--err', tone === 'err');
    t.innerHTML = `${ic(tone === 'err' ? 'circle-alert' : 'circle-check')}<div><b>${esc(title)}</b>${text ? `<span>${esc(text)}</span>` : ''}</div>`;
    t.classList.add('is-on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('is-on'), 3400);
  }

  // Top-bar search: jumps to the record and opens it; says so plainly when nothing matches.
  function findRecord(raw) {
    const q = raw.trim().toUpperCase();
    if (!q) return;
    const go = h => { location.hash = h; };
    if (route().view === 'vendor') {
      if (/^KM-K-\d{4}-\d{4}-0[1-3]$/.test(q)) { go('#/vendor/pack'); toast(`${q} loaded`, 'Packing list KIT01-V2'); return; }
      toast('Not a box label', 'Box labels look like KM-K-2027-0466-01.', 'err'); return;
    }
    const app = D.queue.find(a => a.id === q);
    if (app) return go(`#/demand?open=${app.id}`);
    const kase = S.cases.find(c => c.id === q || c.hh === q);
    if (kase) return go(`#/engagement?open=${kase.id}`);
    let batch = null; D.lanes.forEach(l => l.cards.forEach(c => { if (c.id === q) batch = c; }));
    if (batch) return go(`#/fulfilment?open=${batch.id}`);
    const ship = D.shipments.find(s => s.awb === q || s.hh === q || s.ko === q);
    if (ship) return go(`#/fulfilment/shipments?open=${ship.awb}`);
    toast(`No record matches “${raw.trim()}”`, 'Try an application (KM-A-…), household (KM-H-…), case, batch or tracking number.', 'err');
  }

  /* ---------- render ---------- */
  function render(keepScroll) {
    const r = route();
    const y = window.scrollY;
    $('#side').innerHTML = side(r);
    $('#top').innerHTML = top(r);
    const v = { overview, demand, inventory, fulfilment, engagement, vendor, system }[r.view] || overview;
    $('#content').innerHTML = v(r);
    document.title = `${{ overview: 'Control tower', demand: 'Demand and cohorts', inventory: 'Kits and inventory', fulfilment: 'Fulfilment and delivery', engagement: 'Parent engagement', vendor: 'Vendor portal', system: 'System map' }[r.view] || 'Control tower'} · Kita Main Control Tower`;
    if (keepScroll) window.scrollTo(0, y);
    const wa = $('#wa-body'); if (wa) wa.scrollTop = wa.scrollHeight;
    $('#side').classList.remove('is-open');
  }

  function onRoute() {
    const r = route();
    render(false);
    window.scrollTo(0, 0);
    if (r.open) {
      const map = { 'KM-A': 'app', 'CASE': 'case', 'BATC': 'batch' };
      const kind = map[r.open.slice(0, 4)] || 'ship';
      openDrawer(`${kind}:${r.open}`);
    } else closeDrawer();
    if (r.focus === 'queue') { const q = $('#queue'); if (q) { q.scrollIntoView({ block: 'start' }); q.focus({ preventScroll: true }); } }
  }

  /* ---------- events ---------- */
  document.addEventListener('click', e => {
    const opener = e.target.closest('[data-open]');
    const a = e.target.closest('[data-act]');
    if (a && a.tagName !== 'SELECT' && a.tagName !== 'INPUT') {
      const act = a.dataset.act;
      e.stopPropagation();
      switch (act) {
        case 'menu': $('#side').classList.toggle('is-open'); return;
        case 'role': location.hash = a.dataset.role === 'vendor' ? '#/vendor/pack' : '#/overview'; return;
        case 'close': closeDrawer(); return;
        case 'app-merge': S.closed[a.dataset.id] = 'Merged with KM-H-2027-0217'; S.left.amber -= 1; render(true); refreshDrawer(); toast('Merged with KM-H-2027-0217', 'One household, one set of three kits.'); return;
        case 'app-clear': S.routeOf[a.dataset.id] = 'green'; S.left.amber -= 1; S.left.green += 1; render(true); refreshDrawer(); toast('Marked as not a duplicate', 'It now passes every rule and can be approved.'); return;
        case 'app-ask': S.asked.add(a.dataset.id); render(true); refreshDrawer(); toast('Upload link sent on WhatsApp', 'A reminder goes out in 3 days if nothing arrives.'); return;
        case 'app-close': S.closed[a.dataset.id] = 'Closed, parent notified'; S.left.red -= 1; render(true); refreshDrawer(); toast('Closed with a notice to the parent', 'The message says why and where else to get help.'); return;
        case 'ship-rebook': S.shipSt[a.dataset.id] = ['Redelivery booked', 'info']; render(true); refreshDrawer(); toast('Redelivery booked', 'J&T retries after the family confirms the address.'); return;
        case 'case-replace': { const c = S.cases.find(x => x.id === a.dataset.id); if (c) { c.st = 'Replacement approved'; c.tone = 'info'; S.caseSt[c.id] = true; } render(true); refreshDrawer(); toast('Replacement approved', 'Linked to the original kit order, so no new kit entitlement.'); return; }
        case 'po-send': S.poSent = true; render(true); toast('PO-2027-024 sent', '500 hand puppets to Vendor B, due 5 Apr.'); return;
        case 'import': S.importState = 'loading'; render(true); setTimeout(() => { S.importTries += 1; S.importState = S.importTries === 1 ? 'error' : 'done'; render(true); }, 1200); return;
        case 'focus-scan': { const s = $('.search input'); if (s) s.focus(); return; }
        case 'confirm-flag': S.confirm.flagged = true; render(true); return;
        case 'issue-photo': S.issuePhoto = true; render(true); return;
        case 'filter': S.filter = a.dataset.f; render(true); return;
        case 'sel': { const id = a.dataset.id; S.selected.has(id) ? S.selected.delete(id) : S.selected.add(id); render(true); return; }
        case 'approve': {
          const ids = S.selected.size ? [...S.selected] : D.queue.filter(x => routeOf(x) === 'green' && !S.approved.has(x.id) && !S.closed[x.id]).map(x => x.id);
          const n = S.selected.size ? S.selected.size : S.left.green;
          ids.forEach(id => S.approved.add(id));
          S.left.green -= n; S.enrolled = Math.min(D.cohort.cap, S.enrolled + n); S.selected.clear();
          render(true);
          toast(`${n} household${n === 1 ? '' : 's'} verified and enrolled`, `${D.cohort.id} is now ${S.enrolled} of ${D.cohort.cap}. ${n * 3} kit orders planned: Kit 01 for the week of 22 Mar.`);
          return;
        }
        case 'approve-one': {
          const id = a.dataset.id; S.approved.add(id); S.selected.delete(id); S.left.green -= 1; S.enrolled = Math.min(D.cohort.cap, S.enrolled + 1);
          render(true); refreshDrawer(); toast('Household enrolled', `3 kit orders planned for ${id.replace('KM-A', 'KM-H')}`); return;
        }
        case 'gate-vendor': S.gateVendor = true; render(true); toast('Vendor B confirmed 80 boxes a week', 'All five gate checks now pass'); return;
        case 'gate-open': S.gateOpen = true; render(true); toast(`${D.cohort.nextId} intake opened`, `${D.cohort.nextCap} places. Verified waitlist families are invited in order of verification.`); return;
        case 'use-sub': S.subUsed = true; render(true); toast('Substitute applied to 120 boxes', 'Vendor B’s work order for BATCH-2027-034 now lists TOY-034 for those boxes'); return;
        case 'pack-check': { const k = a.dataset.k; S.pack.checks[k] = !S.pack.checks[k]; render(true); return; }
        case 'pack-sub': S.pack.sub = 'TOY-016'; S.pack.checks.i2 = true; S.pack.subAsk = false; render(true); return;
        case 'pack-ask': S.pack.subAsk = true; render(true); return;
        case 'pack-done': {
          const p = S.pack; const id = `KM-K-2027-0${p.box}-01`;
          p.done += 1; p.box += 1; p.checks = {}; p.sub = null; p.checker = ''; p.subAsk = false;
          render(true); toast(`${id} ready for dispatch`, `${p.done} of 188 packed in BATCH-2027-031. Next label loaded.`); return;
        }
        case 'grn-photo': S.grn.photo = true; render(true); return;
        case 'grn-send': S.grn.sent = true; render(true); toast('GRN-2027-051 submitted', 'Accepted units added to stock; damaged units quarantined'); return;
        case 'confirm': S.confirm.sent = true; S.gateVendor = S.gateVendor; render(true); toast('BATCH-2027-035 confirmed', 'Packing 29 Mar to 5 Apr, 100 boxes a week'); return;
        case 'disp-proof': S.disp.proof = true; render(true); return;
        case 'disp-done': S.disp.done = true; render(true); toast('130 parcels handed to J&T', 'Families get their tracking message automatically'); return;
        case 'issue': S.issue = Number(a.dataset.i); S.issueSent = false; render(true); return;
        case 'issue-send': S.issueSent = true; render(true); toast('VND-0021 sent to YGG', 'Reply due within 24 hours'); return;
        case 'lang': S.chat.lang = a.dataset.l; $('#phone').innerHTML = phone(); { const wa = $('#wa-body'); if (wa) wa.scrollTop = wa.scrollHeight; } return;
        case 'chat': chatAct(a.dataset.a); $('#phone').innerHTML = phone(); { const wa = $('#wa-body'); if (wa) wa.scrollTop = wa.scrollHeight; } return;
      }
    }
    if (opener && !a) openDrawer(opener.dataset.open);
  });
  document.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.act === 'checker') { S.pack.checker = t.value; render(true); }
  });
  document.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.act === 'grn') { S.grn.rows[+t.dataset.i][+t.dataset.c] = Math.max(0, parseInt(t.value || '0', 10)); }
    if (t.dataset.act === 'handed') { S.disp.handed = t.value; }
  });
  document.addEventListener('focusout', e => {
    const t = e.target;
    if (t.dataset && (t.dataset.act === 'grn' || t.dataset.act === 'handed')) render(true);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeDrawer(); $('#side').classList.remove('is-open'); }
    if (e.key === 'Enter' && e.target.dataset && (e.target.dataset.act === 'handed' || e.target.dataset.act === 'grn')) render(true);
    if (e.key === '/' && !/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) { const s = $('.search input'); if (s) { e.preventDefault(); s.focus(); } }
  });
  document.addEventListener('submit', e => {
    if (e.target.matches('[data-search]')) { e.preventDefault(); findRecord(e.target.q.value); }
  });
  $('#scrim').addEventListener('click', closeDrawer);
  window.addEventListener('hashchange', onRoute);
  onRoute();
})();
