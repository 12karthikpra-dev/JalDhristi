// JalDrishti Recent Case Studies & Live Sensor Telemetry Module
import { IOT_TELEMETRY_STATIONS } from '../data/watersheds.js';
import { getStoredCaseStudies, showVerificationCertificate, openCaseStudyDossier } from './evidence.js';

let telemetryInterval = null;
let currentFilter = 'all';

export function initTelemetry() {
  renderRecentCaseStudies();
  renderTelemetryStations();
  setupCaseStudiesFilters();
  startLivePings();
}

export function renderRecentCaseStudies(filter = currentFilter) {
  currentFilter = filter;
  const container = document.getElementById('case-studies-grid');
  const countBadge = document.getElementById('case-studies-count-badge');
  if (!container) return;

  const allStudies = getStoredCaseStudies();
  let filtered = allStudies;

  if (filter === 'authentic') {
    filtered = allStudies.filter(s => !s.isAiGenerated);
  } else if (filter === 'ai-flagged') {
    filtered = allStudies.filter(s => s.isAiGenerated);
  } else if (filter === 'custom') {
    filtered = allStudies.filter(s => s.isCustom);
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Case Studies`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center glass-panel rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
        <span class="material-symbols-outlined text-4xl text-gray-400 mb-2">folder_off</span>
        <h4 class="font-headline font-bold text-base text-gray-900 dark:text-white">No Case Studies in this filter</h4>
        <p class="text-xs text-gray-500 mt-1 mb-4">Upload or create a custom case study in the Field Evidence portal.</p>
        <button onclick="window.navigateToView('view-evidence')" class="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition">
          Go to Field Evidence Portal
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(study => {
    const place = study.placeInfo || {
      village: study.basinName,
      taluka: "District Region",
      district: "Maharashtra",
      elevation: study.altitude || "610m MSL",
      soilType: "Basaltic Alluvial",
      annualRainfall: "780 mm",
      groundwaterRechargeRise: `+${(study.storageGainPct / 70).toFixed(1)}m`,
      beneficiaryFarmersCount: 320
    };

    return `
      <div class="glass-panel rounded-3xl border transition-all duration-300 hover:shadow-2xl overflow-hidden flex flex-col justify-between ${
        study.isAiGenerated 
          ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/20' 
          : 'border-gray-200 dark:border-gray-700/80'
      }">
        <div>
          <!-- Card Image Header (Clickable -> Opens Place Dossier) -->
          <div class="relative h-52 w-full bg-gray-900 overflow-hidden group cursor-pointer" onclick="window.openCaseStudyDossier('${study.id}')" title="Click to view full Place Dossier">
            <img src="${study.image}" alt="${study.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
            
            <!-- Top Left Site ID Badge -->
            <div class="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white font-mono text-[10px] px-2.5 py-1 rounded-lg border border-white/20 font-bold flex items-center gap-1">
              <span>${study.siteId}</span>
              <span class="text-gray-400">&middot;</span>
              <span class="text-blue-300">${study.basinId}</span>
            </div>

            <!-- Top Right AI Authenticity Verdict Pill -->
            <div class="absolute top-3 right-3 shadow-md">
              ${study.isAiGenerated ? `
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white animate-pulse">
                  <span class="material-symbols-outlined text-xs">warning</span>
                  AI Synthetic Flag
                </span>
              ` : `
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                  <span class="material-symbols-outlined text-xs">verified</span>
                  ${study.aiAuthenticityScore}
                </span>
              `}
            </div>

            <!-- Bottom Place & Location Overlay Strip -->
            <div class="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono px-3 py-1.5 rounded-xl flex items-center justify-between border border-white/10">
              <span class="truncate font-semibold flex items-center gap-1">
                <span class="material-symbols-outlined text-xs text-emerald-400">location_on</span>
                ${place.village}
              </span>
              <span class="shrink-0 text-gray-300 text-[9px]">${place.taluka}, ${place.district}</span>
            </div>
          </div>

          <!-- Card Content Body -->
          <div class="p-5 space-y-3.5">
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  study.isCustom 
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                }">
                  ${study.isCustom ? 'User Created' : study.type}
                </span>
                <span class="text-xs text-gray-500 font-medium truncate">${study.basinName}</span>
              </div>
              
              <h3 class="font-headline font-bold text-base text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 cursor-pointer transition" onclick="window.openCaseStudyDossier('${study.id}')">
                ${study.title}
              </h3>
              
              <p class="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">${study.notes}</p>
            </div>

            <!-- Place Quick Summary Strip -->
            <div class="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 text-[11px] grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
              <div><span class="text-gray-500 block text-[10px]">Elevation:</span> <b>${place.elevation}</b></div>
              <div><span class="text-gray-500 block text-[10px]">Aquifer Rise:</span> <b class="text-emerald-600">${place.groundwaterRechargeRise}</b></div>
              <div><span class="text-gray-500 block text-[10px]">Rainfall:</span> <b>${place.annualRainfall}</b></div>
              <div><span class="text-gray-500 block text-[10px]">Beneficiaries:</span> <b>${place.beneficiaryFarmersCount} Farmers</b></div>
            </div>

            <!-- Key Hydrological Metrics Grid -->
            <div class="grid grid-cols-3 gap-2 text-center text-xs pt-0.5">
              <div class="p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                <span class="text-[10px] text-gray-500 block">Water Gain</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">+${study.storageGainPct}%</span>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                <span class="text-[10px] text-gray-500 block">Capacity</span>
                <span class="font-bold text-blue-600 dark:text-blue-400 font-mono text-sm">${(study.capacityLiters / 1000000).toFixed(1)}M L</span>
              </div>
              <div class="p-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60">
                <span class="text-[10px] text-gray-500 block">Siltation</span>
                <span class="font-bold ${study.siltationPct > 20 ? 'text-red-500' : 'text-emerald-600'} font-mono text-sm">${study.siltationPct}%</span>
              </div>
            </div>

            <!-- Officer Info -->
            <div class="text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
              <span class="truncate">Officer: <b class="text-gray-700 dark:text-gray-300 font-medium">${study.verifiedOfficer}</b></span>
            </div>
          </div>
        </div>

        <!-- Action Buttons Footer -->
        <div class="p-4 pt-0 space-y-2">
          <div class="flex gap-2">
            <button onclick="window.navigateToMapAndSelectSite('${study.siteId || study.id}')" class="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md active:scale-98">
              <span class="material-symbols-outlined text-base">explore</span>
              <span>Inspect in GIS Map</span>
            </button>
            <button onclick="window.openCaseStudyDossier('${study.id}')" class="py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-600 hover:text-white text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold border border-emerald-300 dark:border-emerald-800 transition flex items-center gap-1" title="Open Complete Place Dossier">
              <span class="material-symbols-outlined text-base">menu_book</span>
              <span>Place Dossier</span>
            </button>
            <button onclick="window.showCaseStudyCertificate('${study.id}')" class="py-2.5 px-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 transition" title="View Audit Certificate">
              <span class="material-symbols-outlined text-base text-emerald-600">verified</span>
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');
}

function renderTelemetryStations() {
  const container = document.getElementById('telemetry-stations-grid');
  if (!container) return;

  container.innerHTML = IOT_TELEMETRY_STATIONS.map(stn => `
    <div class="glass-panel p-5 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-sm relative overflow-hidden" id="card-${stn.stationId}">
      <div class="flex items-start justify-between">
        <div>
          <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-0.5 rounded">
            ${stn.stationId} &middot; RTU Station
          </span>
          <h4 class="text-base font-bold font-headline mt-1.5">${stn.name}</h4>
          <p class="text-xs text-gray-500">${stn.type}</p>
        </div>
        <div class="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>LIVE</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 my-4 text-xs">
        <div class="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/60">
          <div class="text-gray-500 font-medium">Water Table Depth</div>
          <div class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-0.5" id="depth-${stn.stationId}">
            ${stn.groundwater_depth_m || '1.4'} m
          </div>
          <div class="text-[10px] text-emerald-600 font-semibold mt-1">Recharge: +1.8 cm/day</div>
        </div>

        <div class="p-3 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-700/60">
          <div class="text-gray-500 font-medium">Soil Moisture Profile</div>
          <div class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-0.5" id="moist-${stn.stationId}">
            ${stn.soil_moisture_pct || '38.4'}%
          </div>
          <div class="text-[10px] text-blue-600 font-semibold mt-1">Optimal field saturation</div>
        </div>
      </div>

      <div class="flex items-center justify-between text-[11px] text-gray-500 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <span>Bat: <b class="font-mono text-gray-700 dark:text-gray-300" id="bat-${stn.stationId}">${stn.battery_pct}%</b></span>
          <span>Sig: <b class="font-mono text-gray-700 dark:text-gray-300">${stn.signal_dbm} dBm</b></span>
        </div>
        <span class="font-mono text-[10px] text-sky-600" id="ping-${stn.stationId}">Last: ${stn.last_ping}</span>
      </div>

      <button onclick="window.navigateToMapAndSelectSensor('${stn.stationId}')" class="mt-3 w-full py-1.5 px-3 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-600 hover:text-white text-sky-700 dark:text-sky-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 border border-sky-200 dark:border-sky-800 transition">
        <span class="material-symbols-outlined text-sm">map</span>
        <span>Inspect on GIS Map</span>
      </button>
    </div>
  `).join('');
}

function setupCaseStudiesFilters() {
  const filterBtns = document.querySelectorAll('[data-cs-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-emerald-700', 'text-white', 'shadow');
        b.classList.add('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');
      });
      btn.classList.add('bg-emerald-700', 'text-white', 'shadow');
      btn.classList.remove('bg-white', 'dark:bg-gray-800', 'text-gray-700', 'dark:text-gray-300');

      const filterVal = btn.getAttribute('data-cs-filter');
      renderRecentCaseStudies(filterVal);
    });
  });
}

function startLivePings() {
  if (telemetryInterval) clearInterval(telemetryInterval);

  telemetryInterval = setInterval(() => {
    IOT_TELEMETRY_STATIONS.forEach(stn => {
      if (stn.groundwater_depth_m) {
        const delta = (Math.random() - 0.5) * 0.02;
        stn.groundwater_depth_m = Math.max(2, parseFloat((stn.groundwater_depth_m + delta).toFixed(2)));
        const depthEl = document.getElementById(`depth-${stn.stationId}`);
        if (depthEl) depthEl.textContent = `${stn.groundwater_depth_m} m`;
      }

      if (stn.soil_moisture_pct) {
        const delta = (Math.random() - 0.5) * 0.1;
        stn.soil_moisture_pct = Math.max(10, parseFloat((stn.soil_moisture_pct + delta).toFixed(1)));
        const moistEl = document.getElementById(`moist-${stn.stationId}`);
        if (moistEl) moistEl.textContent = `${stn.soil_moisture_pct}%`;
      }

      const pingEl = document.getElementById(`ping-${stn.stationId}`);
      if (pingEl) pingEl.textContent = "Last: Just now";
    });
  }, 4000);
}

// Global helpers for certificate and case studies
window.showCaseStudyCertificate = function(studyId) {
  const all = getStoredCaseStudies();
  const study = all.find(s => s.id === studyId);
  if (study) {
    showVerificationCertificate(study);
  }
};
