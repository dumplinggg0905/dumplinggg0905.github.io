// Projects are listed in priority order inside each group.
// To add a project, copy a block; `group` must match an id in GROUPS.
const GROUPS = [
  { id: "offshore", section: "engineering", label: "Offshore & production" },
  { id: "reservoir", section: "engineering", label: "Reservoir & subsurface" },
  { id: "sensing", section: "engineering", label: "Sensing & robotics" },
  { id: "business", section: "business", label: null },
];

const PROJECTS = [
  {
    id: "petrox", group: "offshore",
    title: "PetroX: deepwater FPSO for the Limbayong field",
    result: "Cylindrical FPSO concept for 40,000 BOPD in up to 1,200 m of water, 120 km off Sabah.",
    context: "Offshore platform design engineer, IEM Oil & Gas Platform Design Competition 2026",
    award: "3rd place nationally",
    key: ["1,200 m", "water depth"],
    img: "assets/img/petrox.jpg", photo: "assets/img/iem-models.jpg", photoAlt: "Platform scale models at the IEM grand final",
    kpis: [["40,000 BOPD", "oil, plus 180 MMSCFD gas"], ["10", "subsea wells"], ["~600,000 bbl", "storage inside the hull"], ["up to 87.2%", "lower peak heave response (bilge box, published CFD)"]],
    sections: {
      "The brief": ["Ten wells, 40,000 BOPD and 600,000 bbl of storage on one floating structure, with no export pipeline and no dry-docking for 25–30 years.", "Design drivers: 100-year metocean conditions (Hmax 9.28 m, 1.51 m/s current), an unstable seabed, aggressive tropical biofouling and tight CAPEX."],
      "What we designed": ["Screened jacket, semi-sub, spar, TLP and FPSO concepts. Chose a cylindrical FPSO because it stores crude in the hull and offloads to a shuttle tanker.", "90 m double hull with a bilge box that moves the heave natural period out of the 6–12 s wave band and suppresses vortex-induced motion.", "Topsides with a central process core, accommodation separated from hydrocarbons, two cranes and a 22 m helideck sized to CAP 437 for an S-92."],
      "My part": ["Integrity and energy package: fouling-release coating with ultrasonic guided waves, resident ROV inspection, digital-twin monitoring, and a solar, wave and ORC auxiliary microgrid.", "Presented and defended the design to IEM OGMTD judges at the grand final."],
    },
    tools: "Concept screening, hydrostatics and stability, topside layout, integrity management, SolidWorks",
  },
  {
    id: "dulang", group: "offshore",
    title: "Nodal analysis of a mature offshore well, Dulang field",
    result: "Showed the tubing, not the reservoir, limits the stimulated well, and ranked lift options on rate, risk and economics.",
    context: "Individual project, Production Engineering",
    key: ["1,500 STB/d", "with ESP, from 559"],
    img: "assets/img/dulang.jpg",
    kpis: [["45 → 12.6", "skin after stimulation"], ["559 → 721 STB/d", "actual gain: only 29%"], ["903 STB/d", "with 3-1/2 in tubing, no added power"], ["1,500 STB/d", "with ESP, if free gas is managed"]],
    sections: {
      "The question": ["Stimulation raised inflow capacity 2.6-fold, yet the rate rose only 29%. Why?"],
      "Method": ["Fetkovich IPR, Beggs–Brill VLP for the 2-7/8 in string and a choke model, solved at the system node in Excel.", "Reconciled inconsistent field and PVT data from publications of different ages before modelling.", "±10% tornado sensitivity: reservoir pressure dominates, then gas gravity and tubing ID."],
      "Recommendation": ["Staged plan: stimulate, then upsize the tubing to 3-1/2 in. An ESP gives the most oil and the best economics, provided the ~61% free gas at the intake is handled and materials suit CO₂ service.", "Gas lift rejected: small rate gain, higher wellhead pressure, negative return."],
    },
    tools: "Fetkovich IPR, Beggs–Brill VLP, choke modelling, ESP and gas lift design, sensitivity analysis, Excel",
  },
  {
    id: "samudera", group: "offshore",
    title: "SAMUDERA: anchor-drag warning for subsea cables",
    result: "Fuses vessel tracks, ocean conditions and seabed data to warn operators before a dragging anchor reaches a cable.",
    context: "Team Tofo, hackathon entry, Industry Improvement track",
    key: ["~30%", "of cable damage is from anchors"],
    img: "assets/img/samudera.jpg",
    kpis: [["> 99%", "of international data runs on subsea cables"], ["£0.5–1 M", "typical repair cost per incident"], ["$0", "new marine hardware needed"]],
    sections: {
      "The problem": ["Dragged anchors cause roughly 30% of subsea cable damage, and operators usually learn about it only after the fault."],
      "How it works": ["Ingests AIS vessel tracks, Copernicus and ERA5 metocean data, GEBCO bathymetry and public cable routes into PostGIS, starting with the Mersing corridor.", "A physics engine compares wind, current and wave load with anchor holding capacity. An unsupervised IsolationForest model flags drifting and loitering vessels.", "A policy engine ranks risk by cable criticality and recommends monitor, prepare backup or escalate. A human operator approves every action."],
      "Why it matters offshore": ["The same anchor-drag and seabed-interaction physics applies to pipelines, flowlines and moorings around offshore installations."],
    },
    tools: "Python, FastAPI, PostgreSQL and PostGIS, IsolationForest, Next.js dashboard, AIS, metocean and bathymetry data",
  },
  {
    id: "ipfest", group: "reservoir",
    title: "Gas-injection development plan, IPFEST 2026",
    result: "Optimised gas-injection placement across three models in tNavigator for better pressure maintenance.",
    context: "Reservoir strategy lead, IPFEST 2026 development plan competition",
    key: ["+2.13 MMSTB", "projected recovery"],
    kpis: [["35.55 → 37.68 MMSTB", "projected cumulative production"], ["3", "development models compared"]],
    sections: {
      "What I did": ["Optimised gas-injection well placement across three development models in tNavigator.", "Evaluated dynamic reservoir response and gas-cap sweep under competition deadlines.", "Defended the development strategy to upstream industry evaluators."],
    },
    tools: "tNavigator, gas injection design, pressure maintenance, field development planning",
  },
  {
    id: "waterflood", group: "reservoir",
    title: "Adaptive waterflood in a layered, anisotropic reservoir",
    result: "Isolated a high-permeability thief layer: less water, almost all of the value, and a simpler field to run.",
    context: "Individual project, Reservoir Simulation",
    key: ["−33%", "water per barrel of oil"],
    img: "assets/img/waterflood.jpg",
    kpis: [["100 × 100 × 3", "grid, 15-year forecast"], ["81.3% → 76.6%", "terminal water cut"], ["0.533 → 0.355", "bbl water per bbl oil"], ["99.5%", "of the best case's cash flow, with less complexity"]],
    sections: {
      "Approach": ["Four strategies, each built to fix the limit exposed by the last: natural depletion, anisotropy-aware waterflood, Layer-2 conformance control, dynamic voidage-replacement control.", "Compared rate, cumulative oil, pressure, water cut, 3D sweep, water intensity and net cash flow."],
      "Key insight": ["Pressure support is not the same as sweep. Layer 2 stole the injected water; isolating it cut water cut but moved the constraint to injectivity.", "Dynamic control added only 0.46 MMSTB: it cannot create transmissibility the rock does not have."],
      "Recommendation": ["Conformance control with fixed-rate injection: about 99.5% of the best case's value without the extra surveillance hardware."],
    },
    tools: "tNavigator, waterflood design, conformance control, voidage replacement, economic analysis",
  },
  {
    id: "injection", group: "reservoir",
    title: "Injection-well configuration for recovery and profit",
    result: "Horizontal line-drive gave the most oil and least water for 30% less well CAPEX than vertical injectors.",
    context: "Individual project, Reservoir Engineering",
    key: ["72.3%", "recovery factor, from 20.5%"],
    img: "assets/img/injection.jpg",
    kpis: [["20.5% → 72.3%", "recovery factor, primary to selected case"], ["6.43 MMSTB", "cumulative oil"], ["$10.5 M vs $15 M", "well CAPEX, horizontal vs vertical"], ["$421.8 M", "undiscounted net profit"]],
    sections: {
      "Approach": ["Built a 51 × 51 × 5 dipping model (15°, 70 acres, 200 ft thick) in CMG IMEX and compared a 5-spot, a phased down-dip flood and a horizontal line-drive over 15 years.", "Tracked breakthrough timing, water cut, 2D and 3D saturation fronts, water handling and economics."],
      "Outcome": ["Every waterflood case passed 72% recovery, so well design changed how efficiently oil was displaced more than how much.", "Selected the horizontal line-drive: highest oil, lowest water and the lowest well cost."],
    },
    tools: "CMG IMEX, CMG Builder, Results 3D, waterflood design, project economics",
  },
  {
    id: "formation", group: "reservoir",
    title: "Formation evaluation of well ED-01, East Desaru field",
    result: "Interpreted 754 ft of logs for shale volume, porosity and saturation, and picked the pay zones.",
    context: "Petrophysicist, 6-person team, Formation Evaluation & Well Logging",
    key: ["101.5 ft", "primary pay"],
    img: "assets/img/formation.jpg",
    kpis: [["5,195–5,949 ft", "interval interpreted"], ["101.5 ft", "primary pay, Sw ≈ 0.08"], ["67.5 ft", "likely oil interval, φe ≈ 0.14"]],
    sections: {
      "My analysis": ["Gamma ray index and shale volume, density and neutron porosity with shale correction, and density–neutron crossplots for lithology.", "Rt versus Rxo invasion profiles and water saturation from both Archie (clean sand) and Simandoux (shaly sand)."],
      "Team result": ["A gas-influenced primary pay at 5,376.5–5,478.0 ft, the most likely oil interval at 5,790.5–5,858.0 ft, and a secondary pay zone."],
    },
    tools: "Well-log interpretation, Archie, Simandoux, density–neutron crossplots",
  },
  {
    id: "leaksweeper", group: "sensing",
    title: "Leak Sweeper: autonomous pipe-leak detection rover",
    result: "Rover with swappable acoustic and mmWave-radar sensors that finds buried pipe leaks from the surface.",
    context: "Team member, XJTLU Dream Chasers 2025",
    key: ["~40%", "lower lifetime cost (est.)"],
    img: "assets/img/leaksweeper.jpg", pos: "center 75%",
    sections: {
      "The problem": ["126 billion m³ of water is lost worldwide each year before reaching customers, 70–80% of it through physical leaks. Fixed sensors are costly; manual surveys are slow."],
      "The concept": ["AI picks sensors for each pipeline profile, the rover navigates with SLAM, fuses acoustic and radar data to pinpoint leaks, and writes the maintenance report.", "The same contactless, surface-based approach applies to oil and gas flowline surveillance."],
    },
    tools: "Robotics concept, acoustic sensing, mmWave radar, SLAM, asset integrity",
  },
  {
    id: "retrace", group: "sensing",
    title: "ReTrace Intercept: smart bin and truck-mounted sorter",
    result: "Built and tested sensors that tell wet from dry waste, so wet bags are diverted before compaction.",
    context: "Team member, The TryHards",
    key: ["90%", "accuracy over 500 test drops"],
    img: "assets/img/retrace.jpg",
    sections: {
      "What we built": ["Smart bin with a load cell, ultrasonic fill sensor and acoustic impact classifier; a 7.7 ms duration threshold separates wet from dry.", "Truck unit: mmWave radar reads each bag through the plastic, an ESP32 scores it and a gate diverts wet bags.", "Fail-safe by design: any fault returns the truck to normal operation."],
    },
    tools: "ESP32, acoustic signal features, mmWave radar, LoRa, Blynk IoT, CAD prototyping",
  },

  {
    id: "foodup", group: "business",
    title: "FoodUp: food waste to biogas and fertiliser",
    result: "Condominium-scale black soldier fly and anaerobic digestion system with a 250-unit pilot plan.",
    context: "Founder, ASEAN-China-India Startathon 2025",
    award: "National champion, 1st of 70+ teams",
    key: ["3.3 months", "pilot payback"],
    img: "assets/img/foodup.jpg",
    kpis: [["RM16,850", "pilot start-up cost"], ["150 kg/day", "food waste processed"], ["RM6,810", "net monthly profit (pilot)"]],
    sections: {
      "Concept": ["Sealed larvae bins and an anaerobic digester turn food waste into feed, fertiliser and biogas at 3–5× lower cost than in-vessel composters.", "Revenue from a RM20-per-unit service fee plus product sales, under a service contract with building management."],
    },
    tools: "Anaerobic digestion, process sizing, business modelling, pitching",
  },
  {
    id: "reactor", group: "business",
    title: "Reactor: community flood response for Vietnam",
    result: "Disaster-response app concept built in four nights with teammates from five countries.",
    context: "Product and strategy lead, ASEAN-China-India Youth Leadership Summit 2025",
    award: "2nd place, S$5,000 prize",
    key: ["5", "countries on one team"],
    img: "assets/img/reactor.jpg", photo: "assets/img/podium-aci.jpg", photoAlt: "Team REX receiving the 2nd prize",
    sections: {
      "What we built": ["Citizen mode (SOS, live alerts, flood maps) and Reactor mode for trained community responders, with AI triage of distress calls.", "Pre-disaster training, a freemium revenue model and university and NGO partnerships."],
      "My role": ["Turned an open-ended regional problem into the product direction and overall strategy."],
    },
    tools: "Problem structuring, product strategy, cross-cultural teamwork",
  },
  {
    id: "sidequest", group: "business",
    title: "The Side Quest: mobility aids from plastic waste",
    result: "Social enterprise that 3D-prints custom, refurbishable mobility aids for underserved patients.",
    context: "Team member, Strategic Leadership Summit 2026 case challenge (MAFC and EY, Monash University)",
    award: "2nd runner up",
    key: ["202%", "5-year ROI"],
    img: "assets/img/sidequest.jpg", photo: "assets/img/podium-sls.jpg", photoAlt: "The team with the 2nd runner up cheque at SLS 2026",
    sections: {
      "Highlights": ["Mapped a fragmented system of hospitals, NGOs and corporates where patients wait 4–8 weeks for devices.", "Rental, institutional service and custom-sale revenue with RFID lifecycle tracking: 3.23-year payback and RM250k+ revenue by year 3."],
    },
    tools: "Circular economy, 3D printing, financial modelling",
  },
  {
    id: "adstrovert", group: "business",
    title: "Adstrovert: marketplace for outdoor advertising",
    result: "Entered an unfamiliar industry, interviewed stakeholders and defined a marketplace for unsold billboard space.",
    context: "Strategy and business development lead, Team Atas",
    key: ["2", "investors interested"],
    img: "assets/img/adstrovert.jpg",
    sections: {
      "Highlights": ["Malaysia has 125+ independent media owners and about 35% unsold outdoor inventory in the Klang Valley.", "Defined a 10–15% commission model and phased go-to-market; two investors offered post-competition mentoring."],
    },
    tools: "Market research, stakeholder interviews, business modelling",
  },
  {
    id: "splendid", group: "business",
    title: "Splendid 360: succession planning for family SMEs",
    result: "Lifecycle strategy for a trust company, from founding to handover, through a partner network.",
    context: "Team APTaytude, inter-university corporate case study",
    key: ["60", "phase-1 client contracts"],
    img: "assets/img/splendid.jpg",
    sections: {
      "Highlights": ["Sized the market from 1.2 million SMEs to 10,800 family-owned targets.", "Four pillars: alliance network, lifecycle integration, community and a CRM platform, with SWOT and risk plan."],
    },
    tools: "Corporate strategy, market sizing, risk analysis",
  },
  {
    id: "resonance", group: "business",
    title: "Résonance: kinetic-powered fragrance applicator",
    result: "Battery-free device concept for YSL that turns a perfume spray into a short calming ritual.",
    context: "Team Anchor, luxury beauty-tech case",
    img: "assets/img/resonance.jpg",
    sections: {
      "Engineering": ["Docking drives a Faraday coil; a graphene supercapacitor stores the charge, so there is no lithium battery.", "Skin sensors read stress, a 60 BPM haptic pulse calms the user and a vacuum valve protects the formula. A universal collar fits existing bottles."],
    },
    tools: "Product engineering, energy harvesting, sensors, go-to-market",
  },
];

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function projectHTML(p) {
  const pics = [p.img && `<img src="${p.img}" alt="" loading="lazy">`, p.photo && `<img src="${p.photo}" alt="${esc(p.photoAlt)}" loading="lazy">`].filter(Boolean);
  return `<details class="proj" id="p-${p.id}">
    <summary>
      <span class="proj-main">
        <span class="proj-title">${esc(p.title)}</span>
        <span class="proj-result">${esc(p.result)}</span>
        <span class="proj-context">${esc(p.context)}${p.award ? ` <span class="award">${esc(p.award)}</span>` : ""}</span>
      </span>
      ${p.key ? `<span class="proj-key"><strong>${esc(p.key[0])}</strong>${esc(p.key[1])}</span>` : `<span class="proj-key"></span>`}
      <span class="proj-toggle" aria-hidden="true"></span>
    </summary>
    <div class="proj-body">
      <div class="proj-text">
        ${p.kpis ? `<dl class="kpis">${p.kpis.map(([v, l]) => `<div><dt>${esc(v)}</dt><dd>${esc(l)}</dd></div>`).join("")}</dl>` : ""}
        ${Object.entries(p.sections).map(([h, items]) => `<h4>${esc(h)}</h4><ul>${items.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`).join("")}
        <p class="tools"><strong>Tools and methods:</strong> ${esc(p.tools)}</p>
      </div>
      ${pics.length ? `<div class="proj-pics">${pics.join("")}</div>` : ""}
    </div>
  </details>`;
}

for (const g of GROUPS) {
  const host = document.getElementById(`list-${g.section}`);
  const items = PROJECTS.filter(p => p.group === g.id);
  host.insertAdjacentHTML("beforeend",
    `${g.label ? `<h3 class="group">${g.label}</h3>` : ""}<div class="projs">${items.map(projectHTML).join("")}</div>`);
}

// Links elsewhere on the page (e.g. "Selected results") open the matching project.
function openFromHash() {
  const el = location.hash.startsWith("#p-") && document.querySelector(location.hash);
  if (el) { el.open = true; el.scrollIntoView({ block: "start" }); }
}
addEventListener("hashchange", openFromHash);

// Depth track: maps how far down the page you are to 0–1,200 m,
// the deepest water at Limbayong (the PetroX field).
const MAX_DEPTH = 1200;
const marker = document.getElementById("rail-marker");
const readout = document.getElementById("rail-depth");
const bar = document.getElementById("depth-bar");
const tops = document.getElementById("rail-tops");
const stops = [...document.querySelectorAll("[data-top]")];

function layoutTops() {
  const H = document.documentElement.scrollHeight;
  const trackH = tops.parentElement.clientHeight;
  let last = -Infinity;
  tops.innerHTML = stops.map(s => {
    const f = Math.min(1, Math.max(0, s.offsetTop - 64) / H);
    const y = Math.min(trackH, Math.max(f * trackH, last + 30));
    last = y;
    return `<a href="#${s.id}" style="top:${y.toFixed(1)}px"><span>${Math.round(f * MAX_DEPTH).toLocaleString("en")} m</span>${s.dataset.top}</a>`;
  }).join("");
}
function onScroll() {
  const H = document.documentElement.scrollHeight;
  const max = H - innerHeight;
  const p = max > 0 ? Math.min(1, scrollY / max) : 0;
  const f = Math.min(1, (scrollY + innerHeight * p) / H);
  marker.style.top = (f * 100) + "%";
  readout.textContent = Math.round(f * MAX_DEPTH).toLocaleString("en") + " m";
  bar.style.transform = `scaleX(${p})`;
}
const relayout = () => { layoutTops(); onScroll(); };
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", relayout);
addEventListener("load", () => { relayout(); openFromHash(); });
document.querySelectorAll(".proj").forEach(d => d.addEventListener("toggle", relayout));
relayout();

// Mobile menu
const links = document.querySelector(".nav-links");
const toggle = document.querySelector(".nav-toggle");
toggle.addEventListener("click", () => { const o = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
links.addEventListener("click", e => { if (e.target.tagName === "A") { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); } });

document.getElementById("year").textContent = new Date().getFullYear();
