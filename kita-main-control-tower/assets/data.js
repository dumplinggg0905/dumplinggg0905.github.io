/* Illustrative data for the prototype. Every figure is a planning example, not YGG data.
   Anchors: Case 1 base trajectory 2,250 / 3,250 / 4,500 new families (2027-2029), RM750 per family (3 boxes x RM250),
   quarterly cohorts, Kit 01 at enrolment, Kit 02 about month 3, Kit 03 about month 6, journey ends month 8. */
window.KM = {
  today: 'Mon, 15 Mar 2027',
  todayLong: 'Monday 15 March 2027',

  trajectory: [
    { year: '2027', target: 2250, phase: 'Prove' },
    { year: '2028', target: 3250, phase: 'Replicate' },
    { year: '2029', target: 4500, phase: 'Scale' }
  ],

  // cohort 2027-C1: capacity 562, 466 enrolled before today's queue
  cohort: { id: '2027-C1', cap: 562, enrolled: 466, nextId: '2027-C2', nextCap: 563, nextOpens: '1 Apr' },

  queue: [
    { id: 'KM-A-2027-1418', who: 'Nurul Aina R.', place: 'Klang, Selangor', age: 14, src: 'PPR partner', wait: '2 d', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1421', who: 'Kavitha S.', place: 'Ipoh, Perak', age: 9, src: 'Cerita Jiran video', wait: '2 d', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1425', who: 'Mei Ling T.', place: 'Batu Pahat, Johor', age: 21, src: 'Hospital QR poster', wait: '2 d', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1427', who: 'Siti Hajar M.', place: 'Kota Bharu, Kelantan', age: 6, src: 'Cerita Jiran video', wait: '1 d', route: 'amber', reason: 'Income evidence not uploaded', checks: ['ok', 'ok', 'ok', 'ok', 'warn'] },
    { id: 'KM-A-2027-1430', who: 'Farah Hanim A.', place: 'Shah Alam, Selangor', age: 17, src: 'Parent referral', wait: '1 d', route: 'amber', reason: 'Possible duplicate of KM-H-2027-0217', dup: true, checks: ['ok', 'ok', 'ok', 'warn', 'ok'] },
    { id: 'KM-A-2027-1432', who: 'Rajeswari P.', place: 'Seremban, N. Sembilan', age: 11, src: 'PPR partner', wait: '1 d', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1433', who: 'Nor Azlina K.', place: 'Kuantan, Pahang', age: 30, src: 'Cerita Jiran video', wait: '1 d', route: 'amber', reason: 'Uploaded document is unreadable', checks: ['ok', 'ok', 'ok', 'ok', 'warn'] },
    { id: 'KM-A-2027-1436', who: 'Siew Lan W.', place: 'Kota Kinabalu, Sabah', age: 12, src: 'Cerita Jiran video', wait: '20 h', route: 'red', reason: 'Outside the Peninsular service area', checks: ['ok', 'ok', 'bad', 'ok', 'ok'] },
    { id: 'KM-A-2027-1438', who: 'Aminah Z.', place: 'Alor Setar, Kedah', age: 8, src: 'Ruang Play pilot', wait: '18 h', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1440', who: 'Hui Min L.', place: 'Butterworth, Penang', age: 15, src: 'Hospital QR poster', wait: '15 h', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1441', who: 'Zuraidah I.', place: 'Kuala Terengganu, Terengganu', age: null, src: 'PPR partner', wait: '12 h', route: 'amber', reason: 'Child’s date of birth missing', checks: ['warn', 'warn', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1444', who: 'Hafizah N.', place: 'Klang, Selangor', age: 74, src: 'Cerita Jiran video', wait: '9 h', route: 'red', reason: 'Child is older than the programme age band', checks: ['ok', 'bad', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1446', who: 'Devi M.', place: 'Kajang, Selangor', age: 19, src: 'PPR partner', wait: '6 h', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] },
    { id: 'KM-A-2027-1447', who: 'Noraini S.', place: 'Melaka Tengah, Melaka', age: 10, src: 'Cerita Jiran video', wait: '4 h', route: 'green', checks: ['ok', 'ok', 'ok', 'ok', 'ok'] }
  ],
  queueTotals: { green: 96, amber: 38, red: 9 },
  ruleNames: ['Form complete', 'Child age in band', 'Peninsular address', 'No duplicate household', 'Evidence received'],

  cohorts: [
    { id: '2026-C3', window: 'Jul to Sep 2026', n: 180, k: [180, 178, 131], next: 'Kit 03 dispatching', tone: 'info' },
    { id: '2026-C4', window: 'Oct to Dec 2026', n: 150, k: [150, 0, 0], next: 'Kit 02 in QC (BATCH-2027-032)', tone: 'info' },
    { id: '2027-C1', window: 'Jan to Mar 2027', n: 466, cap: 562, k: [374, 0, 0], next: 'Kit 01 wave 3 packing', tone: 'ok' },
    { id: '2027-C2', window: 'Apr to Jun 2027', n: 0, cap: 563, k: [0, 0, 0], next: 'Intake gate: 4 of 5 checks', tone: 'warn' }
  ],

  gate: [
    { id: 'demand', label: 'Verified demand covers the intake', detail: '618 verified households waiting for 563 places', ok: true },
    { id: 'funding', label: 'Funding confirmed for the cohort', detail: '563 families × RM750 = RM422,250, Q2 grant tranche received', ok: true },
    { id: 'stock', label: 'Kit 01 stock covers the first wave', detail: '1.6× cover once PO-2027-021 lands on 24 Mar', ok: true },
    { id: 'vendor', label: 'Packing capacity confirmed for April', detail: 'Vendor A confirmed 100 boxes a week. Vendor B has not confirmed 80 a week.', ok: false },
    { id: 'courier', label: 'Courier pickups scheduled', detail: 'J&T pickups at both vendors, Tuesdays and Fridays', ok: true }
  ],

  // dispatch plan, boxes per week by kit stage; packing capacity 180 a week (Vendor A 100 + Vendor B 80)
  capacity: 180,
  weeks: [
    { w: '15 Mar', k: [47, 38, 33] },
    { w: '22 Mar', k: [47, 37, 32] },
    { w: '29 Mar', k: [47, 38, 33] },
    { w: '5 Apr', k: [47, 93, 40] },
    { w: '12 Apr', k: [47, 93, 52] },
    { w: '19 Apr', k: [47, 40, 35] },
    { w: '26 Apr', k: [47, 47, 30] },
    { w: '3 May', k: [47, 47, 30] }
  ],

  priority: [
    { sev: 'bad', engine: 2, title: 'Hand puppets are 120 short for Kit 02 (2027-C1)', text: 'BATCH-2027-034 starts packing on 29 Mar. The approved substitute TOY-034 finger puppets has 240 in stock at Vendor B.', due: 'Decide by 22 Mar', action: 'Use approved substitute', go: '#/inventory' },
    { sev: 'bad', engine: 3, title: '3 parcels failed delivery twice in Kelantan', text: 'J&T returned them to the hub. The families need a confirmed address before redelivery.', due: 'Today', action: 'Open shipments', go: '#/fulfilment/shipments' },
    { sev: 'warn', engine: 1, title: '2027-C2 intake gate: Vendor B has not confirmed April capacity', text: '4 of 5 checks pass. The cohort cannot open on 1 Apr until packing capacity is confirmed.', due: 'Gate on 29 Mar', action: 'Review gate', go: '#/demand/cohorts' },
    { sev: 'warn', engine: 3, title: 'Week of 12 Apr is 12 boxes over packing capacity', text: 'Move 12 Kit 03 boxes to the week of 19 Apr, or ask Vendor A for one extra shift.', due: 'Plan by 1 Apr', action: 'Open plan', go: '#/fulfilment' },
    { sev: 'warn', engine: 4, title: '2 parent cases are past the 48-hour reply target', text: 'CASE-0146 (failed delivery) and CASE-0142 (wrong kit stage).', due: 'Overdue', action: 'Open cases', go: '#/engagement' }
  ],

  stock: [
    { sku: 'TOY-022', item: 'Textured sensory balls (set of 4)', kit: 1, a: 120, b: 96, q: 0, alloc: 141, inc: 400, incDate: '24 Mar', need: 376 },
    { sku: 'TOY-011', item: 'Stacking rings', kit: 1, a: 140, b: 102, q: 0, alloc: 141, inc: 400, incDate: '24 Mar', need: 376 },
    { sku: 'BOK-101', item: 'Touch-and-feel board book (BM)', kit: 1, a: 210, b: 180, q: 0, alloc: 141, inc: 200, incDate: '24 Mar', need: 376 },
    { sku: 'GDE-01', item: 'Explore parent play guide', kit: 1, a: 600, b: 450, q: 0, alloc: 141, inc: 0, need: 376 },
    { sku: 'TOY-031', item: 'Hand puppet set (2 pieces)', kit: 2, a: 0, b: 292, q: 10, alloc: 0, inc: 0, need: 412, alert: 'short' },
    { sku: 'TOY-034', item: 'Finger puppets', kit: 2, a: 0, b: 240, q: 0, alloc: 0, inc: 0, need: 0, sub: 'TOY-031' },
    { sku: 'BOK-205', item: 'Picture books, BM and English (3)', kit: 2, a: 220, b: 212, q: 0, alloc: 0, inc: 0, need: 412, alert: 'thin' },
    { sku: 'CRD-02', item: 'Feelings picture cards', kit: 2, a: 300, b: 260, q: 0, alloc: 0, inc: 0, need: 412 },
    { sku: 'TOY-047', item: 'Wooden shape sorter', kit: 3, a: 160, b: 0, q: 0, alloc: 130, inc: 300, incDate: '2 Apr', need: 215 },
    { sku: 'TOY-052', item: 'Chunky puzzle (6 pieces)', kit: 3, a: 220, b: 155, q: 0, alloc: 130, inc: 0, need: 215, alert: 'thin' },
    { sku: 'PKG-01', item: 'Kita Main shipping box', kit: 0, a: 900, b: 700, q: 0, alloc: 271, inc: 1500, incDate: '22 Mar', need: 1003 }
  ],

  kits: [
    { n: 1, name: 'Explore', focus: 'Sensory and motor skills', ver: 'KIT01-V2', eff: '2 Feb 2027',
      change: 'TOY-014 sensory ball discontinued by the supplier; replaced by TOY-022. Approved by the Kita Main manager.',
      items: [['TOY-022', 'Textured sensory balls (set of 4)', 1, 'TOY-015 sensory ball pair'], ['TOY-011', 'Stacking rings', 1, 'TOY-016 stacking cups'], ['BOK-101', 'Touch-and-feel board book (BM)', 1, 'BOK-102 cloth book (BM)'], ['GDE-01', 'Explore parent play guide', 1, null]] },
    { n: 2, name: 'Connect', focus: 'Language and interaction', ver: 'KIT02-V1', eff: '4 Jan 2027',
      change: 'First release.',
      items: [['TOY-031', 'Hand puppet set (2 pieces)', 1, 'TOY-034 finger puppets'], ['BOK-205', 'Picture books, BM and English', 3, 'BOK-206 picture book set'], ['CRD-02', 'Feelings picture cards', 1, null], ['GDE-02', 'Connect parent play guide', 1, null]] },
    { n: 3, name: 'Create', focus: 'Cognition and problem solving', ver: 'KIT03-V1', eff: '4 Jan 2027',
      change: 'First release.',
      items: [['TOY-047', 'Wooden shape sorter', 1, 'TOY-048 shape puzzle board'], ['TOY-052', 'Chunky puzzle (6 pieces)', 1, null], ['BOK-310', 'Counting picture book', 1, null], ['GDE-03', 'Create parent play guide', 1, null]] }
  ],

  pos: [
    { id: 'PO-2027-024', what: 'TOY-031 hand puppets × 500', sup: 'Supplier S-03', to: 'Vendor B', by: '5 Apr', status: 'Draft', tone: 'line' },
    { id: 'PO-2027-023', what: 'PKG-01 shipping boxes × 1,500', sup: 'Supplier S-07', to: 'Vendor A, Vendor B', by: '22 Mar', status: 'Confirmed', tone: 'info' },
    { id: 'PO-2027-022', what: 'TOY-047 shape sorters × 300', sup: 'Supplier S-05', to: 'Vendor A', by: '2 Apr', status: 'Sent', tone: 'line' },
    { id: 'PO-2027-021', what: 'Kit 01 items: TOY-022 × 400, TOY-011 × 400, BOK-101 × 200', sup: 'Supplier S-01', to: 'Vendor A', by: '24 Mar', status: 'Confirmed', tone: 'info' },
    { id: 'PO-2027-019', what: 'TOY-031 hand puppets × 500', sup: 'Supplier S-03', to: 'Vendor B', by: '8 Mar', status: 'Part received', tone: 'warn' }
  ],

  lanes: [
    { id: 'plan', name: 'Planned', cards: [
      { id: 'BATCH-2027-035', vendor: 'Vendor A', kit: 1, cohort: '2027-C2 wave 1', n: 188, due: '7 Apr', note: 'Waits on the intake gate', tone: 'line' } ] },
    { id: 'confirm', name: 'Awaiting vendor', cards: [
      { id: 'BATCH-2027-034', vendor: 'Vendor B', kit: 2, cohort: '2027-C1 wave 1', n: 186, due: '5 Apr', note: 'Stock risk: hand puppets', tone: 'bad' } ] },
    { id: 'packing', name: 'Packing', cards: [
      { id: 'BATCH-2027-031', vendor: 'Vendor A', kit: 1, cohort: '2027-C1 wave 3', n: 188, done: 142, due: '18 Mar', note: 'On track', tone: 'ok' } ] },
    { id: 'qc', name: 'Quality check', cards: [
      { id: 'BATCH-2027-032', vendor: 'Vendor B', kit: 2, cohort: '2026-C4', n: 150, done: 146, due: '17 Mar', note: '4 boxes in rework', tone: 'warn' } ] },
    { id: 'ready', name: 'Ready for courier', cards: [
      { id: 'BATCH-2027-033', vendor: 'Vendor A', kit: 3, cohort: '2026-C3', n: 130, done: 130, due: '16 Mar', note: 'J&T pickup Tue 14:00', tone: 'info' } ] },
    { id: 'courier', name: 'With courier', cards: [
      { id: 'BATCH-2027-029', vendor: 'Vendor B', kit: 1, cohort: '2027-C1 wave 2', n: 188, done: 181, due: '9 Mar', note: '181 delivered, 4 moving, 3 failed', tone: 'warn' },
      { id: 'BATCH-2027-030', vendor: 'Vendor A', kit: 3, cohort: '2026-C3', n: 120, done: 120, due: '11 Mar', note: 'All delivered with proof', tone: 'ok' } ] }
  ],

  shipments: [
    { awb: '630118847221', ko: 'KM-K-2027-0312-01', hh: 'KM-H-2027-0312', to: 'Klang, Selangor', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'Delivered', tone: 'ok', last: '9 Mar, 14:32', pod: 'Photo and signature' },
    { awb: '630118847235', ko: 'KM-K-2027-0318-01', hh: 'KM-H-2027-0318', to: 'Ipoh, Perak', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'Delivered', tone: 'ok', last: '10 Mar, 11:05', pod: 'Photo' },
    { awb: '630118847240', ko: 'KM-K-2027-0331-01', hh: 'KM-H-2027-0331', to: 'Kota Bharu, Kelantan', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'Failed twice', tone: 'bad', last: '12 Mar, 16:40', pod: null, kase: 'CASE-0146' },
    { awb: '630118847252', ko: 'KM-K-2027-0336-01', hh: 'KM-H-2027-0336', to: 'Kuala Krai, Kelantan', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'Failed twice', tone: 'bad', last: '12 Mar, 17:15', pod: null },
    { awb: '630118847266', ko: 'KM-K-2027-0341-01', hh: 'KM-H-2027-0341', to: 'Batu Pahat, Johor', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'Out for delivery', tone: 'info', last: '15 Mar, 09:12', pod: null },
    { awb: '630118847271', ko: 'KM-K-2027-0347-01', hh: 'KM-H-2027-0347', to: 'Alor Setar, Kedah', batch: 'BATCH-2027-029', carrier: 'J&T Express', st: 'In transit', tone: 'info', last: '14 Mar, 22:40', pod: null },
    { awb: 'LLM-2027-0031', ko: 'Replacement, CASE-0147', hh: 'KM-H-2026-0388', to: 'Shah Alam, Selangor', batch: 'Replacement', carrier: 'Lalamove', st: 'Delivered', tone: 'ok', last: '13 Mar, 16:08', pod: 'Photo and signature' }
  ],

  vendors: [
    { name: 'Vendor A', area: 'Klang Valley', cap: 100, april: true, ontime: 97.8, qc: 96.1, grn: 99.2, issues: 2, share: 55 },
    { name: 'Vendor B', area: 'Klang Valley', cap: 80, april: false, ontime: 95.0, qc: 98.4, grn: 96.0, issues: 3, share: 45 }
  ],

  cases: [
    { id: 'CASE-0147', title: 'Hand puppet seam torn', cat: 'Item damaged', src: 'Parent, WhatsApp', kit: 2, owner: 'Family operations', st: 'Replacement delivered', tone: 'ok', sla: 'Met', hh: 'KM-H-2026-0388' },
    { id: 'CASE-0146', title: 'Parcel not delivered after two attempts', cat: 'Not received', src: 'Courier', kit: 1, owner: 'Family operations', st: 'Waiting for address', tone: 'bad', sla: '6 h over', hh: 'KM-H-2027-0331' },
    { id: 'CASE-0145', title: 'Board book missing from box', cat: 'Item missing', src: 'Parent, WhatsApp', kit: 1, owner: 'Family operations', st: 'Investigating', tone: 'warn', sla: '1 d left', hh: 'KM-H-2027-0290' },
    { id: 'CASE-0144', title: 'Supplier sent 480 of 500 puppets', cat: 'Short shipment', src: 'Vendor B', kit: 2, owner: 'Kita Main manager', st: 'Waiting for supplier', tone: 'warn', sla: '2 d left', hh: null },
    { id: 'CASE-0143', title: 'Play guide link does not open', cat: 'Guidance', src: 'Parent, WhatsApp', kit: 1, owner: 'Partnerships and engagement', st: 'Resolved', tone: 'ok', sla: 'Met', hh: 'KM-H-2027-0254' },
    { id: 'CASE-0142', title: 'Received Kit 03 instead of Kit 02', cat: 'Wrong kit', src: 'Parent, WhatsApp', kit: 2, owner: 'Family operations', st: 'Replacement packing', tone: 'bad', sla: '9 h over', hh: 'KM-H-2026-0402' }
  ],

  journeys: [
    { n: 1, when: 'Household enrolled', what: 'Welcome, what the programme is, when Kit 01 arrives', sent: 466, read: 91, human: false },
    { n: 2, when: 'Kit 01 handed to courier', what: 'Tracking number and delivery window', sent: 412, read: 88, human: false },
    { n: 3, when: 'Kit 01 delivered', what: 'Explore play tips and the guide link', sent: 374, read: 84, human: false },
    { n: 4, when: '3 days after delivery', what: 'Parent check-in: box complete? tried an activity?', sent: 361, read: 79, human: false },
    { n: 5, when: 'Problem reported in check-in', what: 'Case opened, a person replies within 48 hours', sent: 19, read: 100, human: true },
    { n: 6, when: '2 weeks before Kit 02', what: 'Confirm the delivery address is still right', sent: 150, read: 82, human: false },
    { n: 7, when: 'Kit 02 and Kit 03 delivered', what: 'Connect and Create play tips', sent: 309, read: 81, human: false },
    { n: 8, when: 'Month 8, journey complete', what: 'Impact survey and optional invite to share a story', sent: 212, read: 74, human: false }
  ]
};
