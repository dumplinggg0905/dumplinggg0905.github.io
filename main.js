// Projects are listed in priority order inside each group.
// `group` must match an id in GROUPS; `section` decides which part of the page a group sits in.
const GROUPS = [
  { id: "wells", section: "engineering", label: "Wells & offshore", note: "Diagnosing wells, reading logs and designing for the open sea." },
  { id: "concepts", section: "engineering", label: "Field technology concepts", note: "Spotting a field problem and leading the idea from first sketch to pitch." },
  { id: "subsurface", section: "engineering", label: "Subsurface analysis", note: "Simulation studies that show how I work with data." },
  { id: "people", section: "people", label: null },
];

const PROJECTS = [
  // ---------- Wells & offshore ----------
  {
    id: "petrox", group: "wells",
    title: "PetroX: deepwater FPSO for the Limbayong field",
    result: "Cylindrical FPSO for 40,000 BOPD in up to 1,200 m of water, built and tested as a 1:175 working model.",
    role: "Came up with the cylindrical hull and bilge-box concept, the digital twin and the anti-fouling system",
    context: "IEM Oil & Gas Platform Design Competition 2026, team of 4",
    award: "3rd place nationally",
    key: ["1:175", "model, built and tested"],
    img: "assets/img/petrox.jpg", photo: "assets/img/iem-models.jpg", photoAlt: "Platform scale models at the IEM grand final",
    kpis: [["40,000 BOPD", "oil, plus 180 MMSCFD gas, from 10 subsea wells"], ["up to 87.2%", "lower peak heave response from the bilge box (published CFD)"], ["RM335", "model build cost, against a RM500 limit"], ["185%", "reserve buoyancy in the model"]],
    sections: {
      "My ideas": [
        "Proposed a cylindrical mono-column hull. It stores crude in the hull, offloads to a shuttle tanker and responds the same way to waves from any direction, so no turret is needed.",
        "Added a bilge box at the keel to push the heave natural period out of the 6–12 s wave band and break up vortex-induced motion.",
        "Designed the digital twin for condition-based maintenance, and the anti-fouling system: a silicone fouling-release coating with ultrasonic guided waves, because a moored hull never moves fast enough to self-clean.",
      ],
      "Building and testing the model (team)": [
        "Built the 1:175 model as a team: 62.5 cm across, within every IEM dimension limit, for RM335.",
        "Checked draft, metacentric height and shell buckling by hand before the load and float tests, and placed ballast low in the bilge box to keep the centre of gravity down.",
        "Caught a compliance trap before the final: with the crane booms extended, the model measured over the 80 cm limit, so we presented them parked inboard.",
      ],
      "Presenting": ["Defended the design to IEM OGMTD judges at the grand final in Petaling Jaya."],
    },
    tools: "Concept screening, hydrostatics and stability, topside safety zoning, integrity management, model build",
  },
  {
    id: "dulang", group: "wells",
    title: "Why a stimulated offshore well underperformed, Dulang field",
    result: "Showed the tubing, not the reservoir, limits the well, then ranked lift options on rate, risk and economics.",
    role: "Did the whole study myself",
    context: "Production Engineering, individual study",
    key: ["1,500 STB/d", "with ESP, from 559"],
    img: "assets/img/dulang.jpg",
    kpis: [["45 → 12.6", "skin after stimulation"], ["559 → 721 STB/d", "only 29% more oil"], ["903 STB/d", "with 3-1/2 in tubing, no added power"], ["1,500 STB/d", "with an ESP, if free gas is handled"]],
    sections: {
      "The question": ["Stimulation raised the well's inflow capacity 2.6 times, yet oil rate rose only 29%. Why?"],
      "What I did": [
        "Reconciled inconsistent field and PVT data from sources of different ages before modelling anything.",
        "Built the inflow (Fetkovich IPR), tubing (Beggs–Brill VLP) and choke models and solved them together at the system node.",
        "Ran a ±10% sensitivity: reservoir pressure matters most, then gas gravity and tubing size.",
      ],
      "Recommendation": [
        "Staged plan: stimulate, then upsize the tubing to 3-1/2 in. An ESP gives the most oil and the best economics, provided the ~61% free gas at the pump intake is handled and materials suit CO₂ service.",
        "Gas lift rejected: small gain, higher wellhead pressure, negative return.",
        "The report also covers safety, whole-life cost and emissions for each option.",
      ],
    },
    tools: "Nodal analysis, IPR and VLP, choke modelling, ESP and gas lift design, sensitivity analysis, Excel",
  },
  {
    id: "formation", group: "wells",
    title: "Well log interpretation, well ED-01, East Desaru field",
    result: "Read gamma ray, density, neutron, sonic and resistivity logs over 754 ft to find the pay zones.",
    role: "Did my own full interpretation; the team combined results",
    context: "Formation Evaluation & Well Logging, team of 6",
    key: ["101.5 ft", "primary pay zone"],
    img: "assets/img/formation.jpg",
    kpis: [["5,195–5,949 ft", "interval interpreted"], ["101.5 ft", "primary pay, water saturation ≈ 0.08"], ["67.5 ft", "most likely oil interval"]],
    sections: {
      "My interpretation": [
        "Shale volume from gamma ray; porosity from density, neutron and sonic logs, corrected for shale.",
        "Compared deep and flushed-zone resistivity to spot invasion, then calculated water saturation with Archie (clean sand) and Simandoux (shaly sand).",
      ],
      "Team result": ["A gas-influenced primary pay at 5,376.5–5,478.0 ft, the most likely oil interval at 5,790.5–5,858.0 ft, and a secondary pay zone."],
    },
    tools: "Gamma ray, density, neutron, sonic and resistivity logs, Archie, Simandoux, crossplots",
  },

  // ---------- Field technology concepts ----------
  {
    id: "samudera", group: "concepts",
    title: "SAMUDERA: early warning before an anchor drags onto a subsea cable",
    result: "Combines ship tracks, ocean conditions and seabed data to warn cable operators while there is still time to act.",
    role: "Led the research, the metocean conditions and the business case",
    context: "Hackathon entry, Industry Improvement track, team of 3",
    key: ["~30%", "of cable damage comes from anchors"],
    img: "assets/img/samudera.jpg",
    kpis: [["> 99%", "of international data travels on subsea cables"], ["£0.5–1 M", "typical repair cost per incident"], ["$0", "new marine hardware needed"]],
    sections: {
      "The problem": ["Dragged anchors cause roughly 30% of subsea cable damage, and operators usually find out only after the fault."],
      "My part": [
        "Researched how anchor-drag incidents unfold and what they cost operators.",
        "Researched the metocean conditions (wind, current and waves) that decide whether a ship's anchor can drag.",
        "Built the business case, cost model and rollout plan from one corridor to ASEAN.",
      ],
      "What the team built": ["A dashboard that fuses ship tracking (AIS), ocean and seabed data with a physics check and an anomaly model, then recommends monitor, prepare backup or escalate. A human approves every action."],
    },
    tools: "Metocean research, business modelling, AIS, GIS, Python (team)",
  },
  {
    id: "retrace", group: "concepts",
    title: "ReTrace Intercept: keep recyclables clean before the truck crushes them",
    result: "Smart bin and truck sorter that divert wet bags before compaction. The classifier reached 90% on 500 test drops.",
    role: "Led overall strategy, the business case, impact assessment and the smart bin",
    context: "Team of 5",
    key: ["90%", "accuracy over 500 drops"],
    img: "assets/img/retrace.jpg",
    sections: {
      "My part": [
        "Shaped the overall strategy, built around intercepting only the wet bag that ruptures instead of sorting everything.",
        "Owned the smart-bin portion, which went through four design iterations before the final design.",
        "Wrote the business case and the impact assessment.",
      ],
      "How it works": ["The bin senses each drop (weight, sound, fill level). On the truck, radar scores each bag and a gate diverts wet bags. Any fault returns the truck to normal operation."],
    },
    tools: "Product strategy, design iteration, impact assessment, sensors and IoT (team)",
  },
  {
    id: "leaksweeper", group: "concepts",
    title: "Leak Sweeper: a rover that finds buried pipe leaks from the surface",
    result: "Autonomous rover with swappable acoustic and radar sensors, so leaks are found without digging.",
    role: "Came up with the idea and led the overall strategy",
    context: "XJTLU Dream Chasers 2025, team of 2",
    key: ["~40%", "lower lifetime cost (est.)"],
    img: "assets/img/leaksweeper.jpg", pos: "center 75%",
    sections: {
      "The idea": [
        "70–80% of water lost before it reaches customers leaks from pipes. Fixed sensors are expensive and manual surveys are slow.",
        "One rover carries the sensors a pipe needs, maps its route, pinpoints leaks and writes the maintenance report. The same surface-based approach suits oil and gas flowline surveillance.",
      ],
    },
    tools: "Concept design, strategy, acoustic and radar sensing, asset integrity",
  },

  // ---------- Subsurface analysis ----------
  {
    id: "injection", group: "subsurface",
    title: "Injection well layout for recovery and profit",
    result: "Recovery factor from 20.5% to 72.3%, with 30% less well spending than vertical injectors.",
    role: "Did the whole study myself",
    context: "Reservoir Engineering, individual study in CMG",
    key: ["72.3%", "recovery factor"],
    img: "assets/img/injection.jpg",
    sections: {
      "Summary": ["Compared a 5-spot, a phased down-dip flood and a horizontal line-drive in a dipping reservoir over 15 years. The horizontal line-drive gave the most oil, the least water and the best profit."],
    },
    tools: "CMG IMEX and Builder, waterflood design, project economics",
  },
  {
    id: "waterflood", group: "subsurface",
    title: "Waterflood in a layered reservoir",
    result: "Isolating a thief layer cut water per barrel of oil by a third and kept 99.5% of the value.",
    role: "Did the whole study myself",
    context: "Reservoir Simulation, individual study in tNavigator",
    key: ["−33%", "water per barrel"],
    img: "assets/img/waterflood.jpg",
    sections: {
      "Summary": ["Four strategies, each built to fix the limit the last one exposed. The lesson: keeping pressure up is not the same as sweeping oil, so the simplest effective fix won."],
    },
    tools: "tNavigator, conformance control, economic analysis",
  },
  {
    id: "ipfest", group: "subsurface",
    title: "Gas-injection development plan",
    result: "Better gas-injection placement raised projected recovery from 35.55 to 37.68 MMSTB.",
    role: "Reservoir strategy lead",
    context: "IPFEST 2026 development plan competition",
    key: ["+2.13 MMSTB", "projected"],
    sections: {
      "Summary": ["Compared three development models in tNavigator under competition deadlines and defended the plan to upstream industry evaluators."],
    },
    tools: "tNavigator, gas injection, field development planning",
  },

  // ---------- People ----------
  {
    id: "adstrovert", group: "people",
    title: "Adstrovert: pitching a new marketplace to an industry",
    result: "Spoke to established players in Malaysian outdoor advertising, then pitched; two investors offered to mentor us.",
    role: "Strategy and business development lead",
    context: "Startup pitch competition, team of 4",
    key: ["2", "investors became mentors"],
    img: "assets/img/adstrovert.jpg",
    sections: {
      "What I did": [
        "Started with no background in advertising, so I went to the people who know it: media owners and industry stakeholders.",
        "Used those conversations to find the gap: 125+ independent media owners and about 35% of outdoor ad space in the Klang Valley unsold.",
        "Shaped the marketplace model and pitched it; two investors offered post-competition mentoring.",
      ],
    },
    tools: "Stakeholder interviews, pitching, market research",
  },
  {
    id: "reactor", group: "people",
    title: "Reactor: flood response app, built across five countries",
    result: "Took an open-ended regional flood problem to a finished pitch in four nights.",
    role: "Product and strategy lead",
    context: "ASEAN-China-India Youth Leadership Summit 2025, team of 5 from 5 countries",
    award: "2nd place, S$5,000",
    key: ["4 nights", "problem to final pitch"],
    img: "assets/img/reactor.jpg", photo: "assets/img/podium-aci.jpg", photoAlt: "Team REX receiving the 2nd prize",
    sections: {
      "What I did": ["Led the product direction and strategy for a team from Malaysia, Thailand, India, Myanmar and Vietnam: a citizen mode for SOS and alerts, and a responder mode for trained volunteers."],
    },
    tools: "Cross-cultural teamwork, problem structuring, product strategy",
  },
  {
    id: "foodup", group: "people",
    title: "FoodUp: turning condominium food waste into biogas and fertiliser",
    result: "Founded the venture and modelled a 250-unit pilot with a 3.3-month payback.",
    role: "Founder",
    context: "ASEAN-China-India Startathon 2025",
    award: "National champion, 1st of 70+ teams",
    key: ["1st", "of 70+ teams"],
    img: "assets/img/foodup.jpg",
    sections: {
      "Summary": ["Sealed black soldier fly bins plus an anaerobic digester: food waste becomes feed, fertiliser and biogas, at 3–5 times lower cost than in-vessel composters. RM16,850 pilot cost, RM6,810 net a month."],
    },
    tools: "Anaerobic digestion, process sizing, business modelling, pitching",
  },
  {
    id: "sidequest", group: "people",
    title: "The Side Quest: mobility aids from plastic waste",
    result: "Social enterprise that 3D-prints custom, refurbishable mobility aids for underserved patients.",
    role: "Team member",
    context: "Strategic Leadership Summit 2026 case challenge, Monash University",
    award: "2nd runner up",
    key: ["202%", "5-year ROI"],
    img: "assets/img/sidequest.jpg", photo: "assets/img/podium-sls.jpg", photoAlt: "The team with the 2nd runner up cheque at SLS 2026",
    sections: {
      "Summary": ["Rental, institutional service and custom-sale revenue with lifecycle tracking: 3.23-year payback and RM250k+ revenue by year 3."],
    },
    tools: "Case analysis, financial modelling, presenting to judges",
  },
];

const ALSO = "Also: Résonance, a battery-free fragrance applicator concept for YSL; Splendid 360, a succession-planning strategy for family businesses.";

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function projectHTML(p) {
  const pics = [p.img && `<img src="${p.img}" alt="" loading="lazy"${p.pos ? ` style="object-position:${p.pos}"` : ""}>`,
                p.photo && `<img src="${p.photo}" alt="${esc(p.photoAlt)}" loading="lazy">`].filter(Boolean);
  return `<details class="proj" id="p-${p.id}">
    <summary>
      <span class="proj-main">
        <span class="proj-title">${esc(p.title)}</span>
        <span class="proj-result">${esc(p.result)}</span>
        <span class="proj-role"><strong>My role:</strong> ${esc(p.role)}</span>
        <span class="proj-context">${esc(p.context)}${p.award ? ` <span class="award">${esc(p.award)}</span>` : ""}</span>
      </span>
      <span class="proj-key">${p.key ? `<strong>${esc(p.key[0])}</strong>${esc(p.key[1])}` : ""}</span>
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
    (g.label ? `<div class="group-head"><h3 class="group">${g.label}</h3><p>${g.note}</p></div>` : "") +
    `<div class="projs">${items.map(projectHTML).join("")}</div>`);
}
document.getElementById("list-people").insertAdjacentHTML("beforeend", `<p class="also">${esc(ALSO)}</p>`);

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
