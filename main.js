// Projects listed in priority order. To reorder, move entries; to add one, copy a block.
const CATEGORIES = [
  { id: "all", label: "All projects" },
  { id: "offshore", label: "Offshore & Production" },
  { id: "reservoir", label: "Reservoir & Subsurface" },
  { id: "innovation", label: "Engineering Innovation" },
  { id: "energy", label: "Energy & Sustainability" },
  { id: "leadership", label: "Leadership & Strategy" },
];

const PROJECTS = [
  {
    id: "petrox", cat: "offshore", featured: true,
    title: "PetroX: Cylindrical Mono-Column FPSO for Limbayong",
    role: "Offshore Platform Design Engineer · IEM 2nd Oil & Gas Platform Design Competition 2026",
    award: "3rd Place",
    img: "assets/img/petrox.jpg",
    summary: "Five-person team design of a floating production, storage and offloading unit for PETRONAS' Limbayong deepwater field: 900–1,200 m water depth, 120 km offshore Sabah.",
    metrics: ["40,000 BOPD", "180 MMSCFD gas", "10 subsea wells", "~600,000 bbl storage"],
    kpis: [["900–1,200 m", "water depth"], ["up to 87.2%", "peak heave RAO reduction (bilge box, published CFD)"], ["80–100", "persons on board"], ["25–30 yr", "design life, no dry-docking"]],
    sections: {
      "The challenge": ["Ten wells, 40,000 BOPD and 600,000 bbl of storage on one floating structure, with no export pipeline and no dry-dock for 25–30 years.", "Design drivers: 100-year metocean conditions (Hmax 9.28 m, 1.51 m/s current), an unstable seabed with slope failures, aggressive tropical biofouling, and tight CAPEX."],
      "What we did": ["Screened five concepts (jacket, semi-sub, spar, TLP, cylindrical FPSO) and selected a mono-column FPSO because it can store crude in the hull and offload to a shuttle tanker.", "Specified a 90 m double-hull cylinder (2.5 m annulus) with an integrated bilge box to push the heave natural period above the 6–12 s wave band and suppress vortex-induced motion.", "Laid out the topsides with a central process core, accommodation separated from hydrocarbon areas, two pedestal cranes and a 22 m helideck sized with the CAP 437 D-value method for an S-92."],
      "My contribution": ["Integrated the integrity and sustainability package: PDMS fouling-release coating combined with ultrasonic guided waves, resident ROV inspection, digital-twin condition monitoring, and a hybrid solar, wave and ORC auxiliary microgrid.", "Defended the concept in the technical presentation and Q&A before IEM OGMTD judges."],
    },
    tools: ["Concept screening", "Hydrostatics & stability", "Topside layout", "Integrity management", "SolidWorks"],
  },
  {
    id: "dulang", cat: "offshore",
    title: "Nodal Analysis & Artificial Lift Selection: Dulang Offshore Field",
    role: "Production / Field Engineer · Individual project, Production Engineering",
    img: "assets/img/dulang.jpg",
    summary: "Diagnosed why a mature, CO₂-rich offshore well in the Dulang field underperformed, and ranked interventions on production, risk and whole-life economics.",
    metrics: ["Skin 45 → 12.6", "559 → 721 STB/d", "ESP to 1,500 STB/d"],
    kpis: [["2.60×", "inflow capacity after stimulation"], ["+29%", "actual rate gain (559.3 → 721.2 STB/d)"], ["903.4 STB/d", "with 3-1/2 in tubing"], ["1,500 STB/d", "with ESP (gas handling needed)"]],
    sections: {
      "The problem": ["Stimulation increased inflow capacity 2.6-fold, but the operating rate rose by only about 29%. I had to find out what was actually constraining the well."],
      "Method": ["Built a Fetkovich IPR, a Beggs–Brill VLP for the 2-7/8 in string and a choke performance model, then solved them at the system node in Excel.", "Before modelling, reconciled inconsistent field and PVT data drawn from publications of different ages.", "Ran a ±10% tornado sensitivity analysis. Reservoir pressure dominated, followed by gas gravity and tubing ID."],
      "Findings & recommendation": ["After stimulation, tubing friction became the dominant constraint. More reservoir treatment would add little.", "Recommended a staged plan: stimulate, then resize the tubing to 3-1/2 in (903 STB/d with no added power). An ESP gives the highest rate (1,500 STB/d) and the best economics, provided the ~61% free gas at the pump intake is managed and materials suit the CO₂ service.", "Rejected gas lift: the small rate gain is offset by higher wellhead pressure and a negative economic return."],
    },
    tools: ["Fetkovich IPR", "Beggs–Brill VLP", "Choke modelling", "ESP / gas lift design", "Sensitivity analysis", "Excel"],
  },
  {
    id: "ipfest", cat: "reservoir",
    title: "IPFEST 2026: Development Plan Competition",
    role: "Reservoir Strategy Lead",
    placeholder: "IPFEST", placeholderSub: "Development plan · 2026",
    summary: "Led reservoir strategy for a competition development plan. Optimised gas-injection placement across three development models in tNavigator.",
    metrics: ["35.55 → 37.68 MMSTB", "3 development models", "tNavigator"],
    kpis: [["+2.13 MMSTB", "projected cumulative production"], ["3", "development models compared"]],
    sections: {
      "What I did": ["Optimised gas-injection well placement across three development models, raising projected cumulative production from 35.55 to 37.68 MMSTB through better pressure maintenance.", "Evaluated dynamic reservoir response and gas-cap sweep under competition deadlines.", "Defended the development strategy before upstream industry evaluators."],
    },
    tools: ["tNavigator", "Gas injection design", "Pressure maintenance", "Field development planning"],
  },
  {
    id: "waterflood", cat: "reservoir",
    title: "Adaptive Waterflood Development in a Heterogeneous Reservoir",
    role: "Reservoir Simulation Engineer · Individual project, Reservoir Simulation",
    img: "assets/img/waterflood.jpg",
    summary: "15-year tNavigator study of a three-layer anisotropic reservoir. Each development strategy was designed to fix the limitation exposed by the one before it.",
    metrics: ["Water cut 81.3% → 76.6%", "Water intensity −33%", "tNavigator"],
    kpis: [["100×100×3", "grid (30,000 cells)"], ["0.533 → 0.355", "bbl water per bbl oil (S2 → S3)"], ["99.5%", "of the best case's NCF captured by the simpler S3"], ["US$15.86 B", "undiscounted NCF (S3)"]],
    sections: {
      "Approach": ["S1 natural depletion → S2 anisotropy-aware waterflood → S3 Layer-2 conformance control → S4 dynamic voidage-replacement (VRR) injection management.", "Evaluated each case on rate, cumulative oil, pressure, water cut, 3D sweep, water intensity and net cash flow."],
      "Key insight": ["Pressure support is not the same as effective displacement. In S2, the high-permeability Layer 2 became a thief zone. Isolating it in S3 cut terminal water cut from 81.3% to 76.6%, but moved the constraint to injectivity.", "Dynamic control in S4 added only 0.46 MMSTB, because it cannot create transmissibility the rock doesn't have."],
      "Recommendation": ["Adopt S3 (conformance control with fixed-rate injection). It delivers about 99.5% of S4's value without the added surveillance hardware and operational complexity."],
    },
    tools: ["tNavigator", "Waterflood design", "Conformance control", "VRR management", "Economic analysis"],
  },
  {
    id: "injection", cat: "reservoir",
    title: "Injection-Well Configuration for EOR & Net Profit",
    role: "Reservoir Engineer · Individual project, Reservoir Engineering",
    img: "assets/img/injection.jpg",
    summary: "CMG IMEX black-oil study of a 15°-dipping reservoir, comparing a 5-spot, a phased down-dip flood and a horizontal line-drive against primary depletion.",
    metrics: ["RF 20.5% → 72.3%", "6.43 MMSTB", "Net profit $421.8 MM"],
    kpis: [["20.49% → 72.34%", "recovery factor, primary → selected case"], ["6.432 MMSTB", "cumulative oil (best)"], ["$10.5 MM vs $15 MM", "well CAPEX, horizontal vs vertical"], ["20.03 MMSTB", "lowest cumulative water"]],
    sections: {
      "Approach": ["Built a 51×51×5 inclined model in CMG Builder (70 acres, 200 ft thick, 15° dip) and ran 15-year forecasts.", "Compared breakthrough timing, water cut, 2D/3D saturation fronts, water handling and undiscounted economics."],
      "Outcome": ["All waterflood cases exceeded 72% RF, so well architecture changed the timing and efficiency of displacement more than ultimate recovery.", "Selected the horizontal line-drive: highest oil, lowest water and one-third less well CAPEX, giving the best net profit."],
    },
    tools: ["CMG IMEX", "CMG Builder", "Results 3D", "Waterflood design", "Project economics"],
  },
  {
    id: "formation", cat: "reservoir",
    title: "Formation Evaluation of Well ED-01, East Desaru Field",
    role: "Petrophysicist · Formation Evaluation & Well Logging (6-person team)",
    img: "assets/img/formation.jpg",
    summary: "Full quick-look and quantitative log interpretation over 5,195–5,949 ft: shale volume, porosity, saturation and pay identification.",
    metrics: ["GR · density · neutron · sonic · resistivity", "Archie & Simandoux", "101.5 ft primary pay"],
    kpis: [["~754 ft", "interval interpreted"], ["101.5 ft", "primary pay, Sw ≈ 0.08"], ["67.5 ft", "likely oil interval, φe ≈ 0.14"]],
    sections: {
      "My individual analysis": ["Computed IGR and Vsh from gamma ray, density and neutron porosity with shale correction, and density–neutron crossplots for lithology.", "Interpreted Rt vs Rxo invasion profiles and calculated water saturation with both Archie (clean sand) and Simandoux (shaly sand) models."],
      "Team result": ["Identified a gas-influenced primary pay at 5,376.5–5,478.0 ft and the most likely oil-bearing interval at 5,790.5–5,858.0 ft, plus a secondary pay zone."],
    },
    tools: ["Well-log interpretation", "Archie", "Simandoux", "Density–neutron crossplots"],
  },
  {
    id: "leaksweeper", cat: "innovation",
    title: "Leak Sweeper: Autonomous Pipe-Leak Detection Rover",
    role: "Team member · XJTLU Dream Chasers 2025",
    img: "assets/img/leaksweeper.jpg", pos: "center 75%",
    summary: "An autonomous AI rover with swappable acoustic and mmWave-radar sensors that detects buried pipeline leaks from the surface, without excavation or pipe access.",
    metrics: ["Multi-sensor fusion", "SLAM navigation", "~40% TCO savings (est.)"],
    sections: {
      "Problem": ["126 billion m³ of water is lost worldwide each year before reaching customers, and 70–80% of that is physical leakage. Fixed sensors are costly, and manual surveys are slow and depend on the operator."],
      "Solution": ["AI recommends a sensor set for each pipeline profile. The rover navigates autonomously using SLAM, fuses acoustic and mmWave data to pinpoint leaks, and generates maintenance reports automatically.", "The same contactless, surface-based integrity approach can be applied to oil & gas flowline and pipeline surveillance."],
    },
    tools: ["Robotics concept", "Acoustic sensing", "mmWave radar", "SLAM", "Asset integrity"],
  },
  {
    id: "retrace", cat: "innovation",
    title: "ReTrace Intercept: AI Pre-Compaction Waste Recovery",
    role: "Team member · The TryHards",
    img: "assets/img/retrace.jpg",
    summary: "Built and tested an IoT smart bin and truck-mounted interceptor that detect wet 'moisture anchor' bags and divert them before compaction contaminates recyclables.",
    metrics: ["90% classification accuracy", "ESP32 edge ML", "LoRa + Blynk dashboard"],
    kpis: [["450 / 500", "drops correctly classified"], ["60–77 GHz", "mmWave radar bag scan"], ["2.5–2.9×", "acoustic feature separation, wet vs dry"]],
    sections: {
      "Engineering": ["Smart bin: reed-switch wake, load cell, ultrasonic fill level and an acoustic impact classifier (5 features per drop). A threshold of 7.7 ms active duration separates wet from dry.", "Truck intercept: mmWave radar reads each bag through opaque plastic, an ESP32 scores it, and an L-gate diverts wet bags to a sealed pod.", "Fail-safe design: every failure mode (power loss, sensor offline, full pod, low confidence) returns the truck to normal operation."],
    },
    tools: ["ESP32", "Acoustic signal features", "mmWave radar", "LoRa", "Blynk IoT", "CAD prototyping"],
  },
  {
    id: "foodup", cat: "energy",
    title: "FoodUp: Food-Waste-to-Resource System",
    role: "Founder · ASEAN-China-India Startathon 2025",
    award: "National Champion",
    img: "assets/img/foodup.jpg",
    summary: "Condominium-scale circular system that combines black soldier fly larvae (BSFL) composting with anaerobic digestion to turn food waste into feed, fertiliser and biogas.",
    metrics: ["1st of 70+ teams", "RM16,850 pilot", "~3.3-month payback"],
    kpis: [["250 units", "pilot condominium"], ["150 kg/day", "food waste processed"], ["~33.75 m³", "biogas per month"], ["RM6,810", "net monthly profit (pilot)"]],
    sections: {
      "Concept": ["Sealed BSFL bins with odour scrubbers and an anaerobic digester give pest-free processing at 3–5× lower cost than in-vessel composters.", "Revenue from an O&M fee (RM20 per unit) plus sales of frass, liquid fertiliser and larvae, using a B2B2C ESCO/BOOT model with building management."],
    },
    tools: ["Anaerobic digestion", "Biogas", "Process sizing", "Business modelling", "Pitching"],
  },
  {
    id: "reactor", cat: "leadership",
    title: "Reactor: Community Flood-Response Platform (Vietnam)",
    role: "Product & Strategy Lead · ASEAN-China-India Youth Leadership Summit 2025",
    award: "1st Runner Up",
    img: "assets/img/reactor.jpg",
    summary: "With teammates from Malaysia, Thailand, India, Myanmar and Vietnam, built a disaster-response app concept in four nights for flood-prone Vietnamese cities.",
    metrics: ["5 countries, 1 team", "4 nights", "2nd overall"],
    sections: {
      "What we built": ["A dual-mode app: Citizen Mode (SOS, live alerts, flood maps) and Reactor Mode (trained community responders). AI triages distress calls and dispatches nearby reactors.", "Curated pre-disaster training, a freemium plus affiliate revenue model, and partnerships with universities and NGOs."],
      "My role": ["Turned an open-ended regional problem into a product direction and overall strategy, coordinating across cultures under severe time pressure."],
    },
    tools: ["Problem structuring", "Product strategy", "Cross-cultural teamwork", "Emergency response"],
  },
  {
    id: "sidequest", cat: "energy",
    title: "The Side Quest: 3D-Printed Mobility Aids from Plastic Waste",
    role: "Team member · MAFC SLS Case Study Challenge 2026",
    img: "assets/img/sidequest.jpg",
    summary: "Social enterprise that turns recovered polymer waste into custom, refurbishable mobility aids for underserved patients through a rental and service model.",
    metrics: ["202% 5-yr ROI", "3.23-yr payback", "RM250k+ revenue by Y3"],
    sections: {
      "Highlights": ["Mapped a fragmented ecosystem of hospitals, NGOs and corporates, where 80% of prosthetists are concentrated in urban hubs and patients wait 4–8 weeks.", "Designed rental, institutional-service and custom-sale revenue streams with RFID lifecycle tracking and a staged plan for MDA regulatory approval."],
    },
    tools: ["Circular economy", "3D printing", "Financial modelling", "SDG impact"],
  },
  {
    id: "resonance", cat: "innovation",
    title: "Résonance: Kinetic-Powered Fragrance Applicator",
    role: "Team Anchor · Luxury beauty-tech innovation case (YSL / L'Oréal Luxe)",
    img: "assets/img/resonance.jpg",
    summary: "Hardware concept that turns a passive perfume spray into a 5-second grounding ritual, powered entirely by kinetic energy harvested when the device docks.",
    metrics: ["Faraday kinetic harvester", "Lithium-free supercapacitor", "Refill ecosystem"],
    sections: {
      "Engineering": ["A magnetic dock drives a piston and Faraday coil to generate power, stored in a graphene supercapacitor (no lithium).", "GSR electrodes sense stress, a 60 BPM haptic actuator calms the user, and a microfluidic vacuum valve protects the formula from air.", "A universal retrofit collar fits existing glass bottles, so no new glass tooling is needed."],
    },
    tools: ["Product engineering", "Energy harvesting", "Sensors", "Go-to-market"],
  },
  {
    id: "adstrovert", cat: "leadership",
    title: "Adstrovert: Out-of-Home Advertising Marketplace",
    role: "Strategy & Business Development Lead · Team Atas",
    img: "assets/img/adstrovert.jpg",
    summary: "Entered an industry I had no background in, interviewed stakeholders, and defined a marketplace connecting SMEs with Malaysia's fragmented billboard and DOOH owners.",
    metrics: ["125+ media owners", "~35% unsold inventory", "2 investors interested"],
    sections: {
      "Highlights": ["Validated the market gap through primary discussions with advertising stakeholders.", "Defined the marketplace model (10–15% commission, enablement and promotion fees) and a phased go-to-market plan.", "Secured interest from 2 investors for post-competition mentoring."],
    },
    tools: ["Market research", "Business modelling", "Stakeholder interviews"],
  },
  {
    id: "splendid", cat: "leadership",
    title: "Splendid 360: Succession & Asset-Protection Ecosystem",
    role: "Team APTaytude · Inter-university corporate case study",
    img: "assets/img/splendid.jpg",
    summary: "Strategy for a trust company to serve family-owned SMEs across their whole lifecycle, from founding to succession, through a multi-partner advisory network.",
    metrics: ["1.2M → 10,800 SMEs", "60 phase-1 contracts", "SWOT & risk plan"],
    sections: {
      "Highlights": ["Diagnosed growth blockers: reliance on word-of-mouth, regulatory limits on promotion, and succession freezes under the Wills Act 1959.", "Designed four pillars (alliance network, lifecycle integration, community and a CRM intelligence platform) with a sized TAM/SAM/SOM."],
    },
    tools: ["Corporate strategy", "Market sizing", "Risk analysis"],
  },
];

const grid = document.getElementById("project-grid");
const filters = document.querySelector(".filters");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const catLabel = id => CATEGORIES.find(c => c.id === id).label;
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function thumb(p, rank) {
  const inner = p.img
    ? `<img src="${p.img}" alt="${esc(p.title)}" loading="lazy"${p.pos ? ` style="object-position:${p.pos}"` : ""}>`
    : `<div>${esc(p.placeholder)}<small>${esc(p.placeholderSub)}</small></div>`;
  return `<div class="thumb${p.img ? "" : " placeholder"}">${inner}
    <span class="rank">#${rank}</span>${p.award ? `<span class="award-tag">🏆 ${esc(p.award)}</span>` : ""}</div>`;
}

grid.innerHTML = PROJECTS.map((p, i) => `
  <button class="card reveal${p.featured ? " featured" : ""}" data-cat="${p.cat}" data-id="${p.id}">
    ${thumb(p, i + 1)}
    <div class="card-body">
      <span class="cat">${catLabel(p.cat)}</span>
      <h3>${esc(p.title)}</h3>
      <div class="role">${esc(p.role)}</div>
      <p class="summary">${esc(p.summary)}</p>
      <div class="metrics">${p.metrics.map(m => `<span class="metric">${esc(m)}</span>`).join("")}</div>
      <span class="more">View details →</span>
    </div>
  </button>`).join("");

filters.innerHTML = CATEGORIES.map(c => {
  const n = c.id === "all" ? PROJECTS.length : PROJECTS.filter(p => p.cat === c.id).length;
  return `<button class="filter" role="tab" data-cat="${c.id}" aria-selected="${c.id === "all"}">${c.label}<span class="count">${n}</span></button>`;
}).join("");

filters.addEventListener("click", e => {
  const b = e.target.closest(".filter"); if (!b) return;
  filters.querySelectorAll(".filter").forEach(f => f.setAttribute("aria-selected", f === b));
  grid.querySelectorAll(".card").forEach(c => {
    const show = b.dataset.cat === "all" || c.dataset.cat === b.dataset.cat;
    c.classList.toggle("hide", !show);
    c.classList.toggle("featured", show && b.dataset.cat === "all" && PROJECTS.find(p => p.id === c.dataset.id).featured);
  });
});

grid.addEventListener("click", e => {
  const c = e.target.closest(".card"); if (!c) return;
  const p = PROJECTS.find(x => x.id === c.dataset.id);
  modalBody.innerHTML = `
    ${p.img ? `<img class="m-img" src="${p.img}" alt="">` : ""}
    <div class="m-body">
      <span class="cat">${catLabel(p.cat)}${p.award ? ` · 🏆 ${esc(p.award)}` : ""}</span>
      <h2 id="modal-title">${esc(p.title)}</h2>
      <div class="m-meta">${esc(p.role)}</div>
      <p>${esc(p.summary)}</p>
      ${p.kpis ? `<h4>Key numbers</h4><div class="kpis">${p.kpis.map(([v, l]) => `<div class="kpi"><strong>${esc(v)}</strong><span>${esc(l)}</span></div>`).join("")}</div>` : ""}
      ${Object.entries(p.sections).map(([h, items]) => `<h4>${esc(h)}</h4><ul>${items.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`).join("")}
      <h4>Tools & methods</h4><ul class="chips">${p.tools.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    </div>`;
  modal.showModal();
  modal.scrollTop = 0;
});
modal.querySelector(".modal-close").addEventListener("click", () => modal.close());
modal.addEventListener("click", e => { if (e.target === modal) modal.close(); });

// nav
const nav = document.querySelector(".nav");
const links = document.querySelector(".nav-links");
const toggle = document.querySelector(".nav-toggle");
addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 8), { passive: true });
toggle.addEventListener("click", () => { const o = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
links.addEventListener("click", e => { if (e.target.tagName === "A") links.classList.remove("open"); });

// reveal on scroll
document.querySelectorAll(".ready, .skill-card, .timeline li, .awards li").forEach(el => el.classList.add("reveal"));
const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .1 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
