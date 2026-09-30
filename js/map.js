// JalDrishti Interactive GIS Watershed Explorer
import { WATERSHED_BASINS, DRAINAGE_STREAMS, CHECK_DAM_SITES, IOT_TELEMETRY_STATIONS, TEMPORAL_SCENARIOS } from '../data/watersheds.js';
import { getStoredCaseStudies } from './evidence.js';

let mapInstance = null;
let currentBasinLayer = null;
let currentStreamsLayer = null;
let checkDamMarkersLayer = null;
let sensorMarkersLayer = null;
let simulatedWaterOverlay = null;
let selectedSite = null;
let sitingActive = false;
let sitingMarker = null;
let activeHighlightCircle = null;
let searchLocationMarker = null;

export function initMap() {
  if (mapInstance) {
    mapInstance.invalidateSize();
    return;
  }

  const mapContainer = document.getElementById('gis-map-canvas');
  if (!mapContainer) return;

  // Initialize Leaflet Map centered over Maharashtra Watershed Core
  mapInstance = L.map('gis-map-canvas', {
    center: [18.35, 74.20],
    zoom: 9,
    minZoom: 7,
    maxZoom: 18,
    zoomControl: false
  });

  // OpenFreeMap High-Precision Vector Tile Providers (openfreemap.org)
  let ofmLiberty = null;
  let ofmBright = null;
  let ofmPositron = null;

  if (typeof L.maplibreGL === 'function') {
    try {
      ofmLiberty = L.maplibreGL({
        style: 'https://tiles.openfreemap.org/styles/liberty',
        attribution: '&copy; <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      });

      ofmBright = L.maplibreGL({
        style: 'https://tiles.openfreemap.org/styles/bright',
        attribution: '&copy; <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      });

      ofmPositron = L.maplibreGL({
        style: 'https://tiles.openfreemap.org/styles/positron',
        attribution: '&copy; <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
      });
    } catch (err) {
      console.warn('MapLibre GL Vector Tile initialization notice:', err);
    }
  }

  // High-Resolution Satellite & Topographic Layers
  const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; ISRO Bhuvan / USGS',
    maxZoom: 18
  });

  const openTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; OpenTopoMap contributors',
    maxZoom: 17
  });

  const fallbackOsm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  });

  // Default basemap: OpenFreeMap Liberty for precision vector hydrology & topographic clarity
  if (ofmLiberty) {
    ofmLiberty.addTo(mapInstance);
  } else {
    esriSatellite.addTo(mapInstance);
  }

  // Custom Zoom Control bottom-right for clean overlay clearance
  L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

  // Basemap Switch Listener for OpenFreeMap API styles
  const allBaseLayers = [ofmLiberty, ofmBright, ofmPositron, esriSatellite, openTopoMap, fallbackOsm];

  const removeAllBaseLayers = () => {
    allBaseLayers.forEach(layer => {
      if (layer && mapInstance.hasLayer(layer)) {
        mapInstance.removeLayer(layer);
      }
    });
  };

  document.querySelectorAll('input[name="basemap-radio"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const val = e.target.value;
      removeAllBaseLayers();

      if (val === 'ofm-liberty') {
        if (ofmLiberty) ofmLiberty.addTo(mapInstance);
        else fallbackOsm.addTo(mapInstance);
      } else if (val === 'ofm-bright') {
        if (ofmBright) ofmBright.addTo(mapInstance);
        else fallbackOsm.addTo(mapInstance);
      } else if (val === 'ofm-positron') {
        if (ofmPositron) ofmPositron.addTo(mapInstance);
        else fallbackOsm.addTo(mapInstance);
      } else if (val === 'satellite') {
        esriSatellite.addTo(mapInstance);
      } else if (val === 'topo') {
        openTopoMap.addTo(mapInstance);
      }
    });
  });

  // Load Layers
  renderBasinPolygons();
  renderDrainageStreams();
  renderCheckDamMarkers();
  renderIoTSensors();
  setupLayerToggles();
  setupTemporalSlider();
  setupSitingOptimizer();
  setupCoordinateTracker();
  setupAddressLocatorSearch();

  // Initialize with empty standby inspector state (only populate when user chooses data)
  clearSiteSelection();

  // Trigger tile render calculations for full background viewport
  setTimeout(() => {
    if (mapInstance) mapInstance.invalidateSize();
  }, 150);

  window.addEventListener('resize', () => {
    if (mapInstance) mapInstance.invalidateSize();
  });
}

function renderBasinPolygons(scenarioKey = 'oct') {
  if (currentBasinLayer) {
    mapInstance.removeLayer(currentBasinLayer);
  }

  const scenario = TEMPORAL_SCENARIOS[scenarioKey] || TEMPORAL_SCENARIOS.oct;

  currentBasinLayer = L.geoJSON(WATERSHED_BASINS, {
    style: (feature) => ({
      color: '#1F7FB8',
      weight: 2,
      dashArray: '4, 4',
      fillColor: scenario.water_color,
      fillOpacity: scenario.water_opacity * 0.45,
      className: 'watershed-basin-polygon'
    }),
    onEachFeature: (feature, layer) => {
      const p = feature.properties;
      layer.bindTooltip(`
        <div class="p-1">
          <div class="font-bold text-xs font-mono">${p.id}</div>
          <div class="text-sm font-semibold">${p.name}</div>
          <div class="text-xs text-gray-500">Area: ${p.area_sqkm} km² | Health: ${p.health_score}/100</div>
        </div>
      `, { sticky: true });

      layer.on({
        mouseover: (e) => {
          const l = e.target;
          l.setStyle({ weight: 3, fillOpacity: 0.6, dashArray: '' });
        },
        mouseout: (e) => {
          currentBasinLayer.resetStyle(e.target);
        },
        click: (e) => {
          mapInstance.fitBounds(e.target.getBounds(), { padding: [40, 40] });
          showBasinInfo(feature.properties);
        }
      });
    }
  }).addTo(mapInstance);
}

function renderDrainageStreams() {
  if (currentStreamsLayer) {
    mapInstance.removeLayer(currentStreamsLayer);
  }

  currentStreamsLayer = L.geoJSON(DRAINAGE_STREAMS, {
    style: (feature) => {
      const order = feature.properties.order || 1;
      return {
        color: '#70C0FD',
        weight: order === 3 ? 3.5 : (order === 2 ? 2.5 : 1.5),
        opacity: 0.85
      };
    },
    onEachFeature: (feature, layer) => {
      layer.bindTooltip(`
        <div class="text-xs">
          <span class="font-bold text-blue-500">${feature.properties.name}</span>
          <br><span class="text-gray-500">Order ${feature.properties.order} Stream (${feature.properties.status})</span>
        </div>
      `);
      layer.on('click', () => {
        showStreamInfo(feature.properties);
      });
    }
  }).addTo(mapInstance);
}

function renderCheckDamMarkers() {
  if (checkDamMarkersLayer) {
    mapInstance.removeLayer(checkDamMarkersLayer);
  }

  checkDamMarkersLayer = L.layerGroup();

  CHECK_DAM_SITES.forEach(site => {
    const isAlert = site.status === 'Siltation Alert';
    const isInProgress = site.status === 'Under Construction';
    const colorBg = isAlert ? '#BA1A1A' : (isInProgress ? '#B0763F' : '#0F3D2E');
    const ringColor = isAlert ? 'rgba(186, 26, 26, 0.4)' : 'rgba(31, 127, 184, 0.5)';

    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer group" style="width: 36px; height: 36px;">
          <span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style="background-color: ${ringColor};"></span>
          <div class="relative inline-flex items-center justify-center rounded-full text-white shadow-lg border-2 border-white" style="width: 30px; height: 30px; background-color: ${colorBg};">
            <span class="material-symbols-outlined text-sm">${isAlert ? 'warning' : 'waves'}</span>
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const marker = L.marker([site.lat, site.lng], { icon: customIcon });

    marker.bindPopup(`
      <div class="w-64 p-2 text-left">
        <div class="flex items-center justify-between border-b pb-1 mb-2">
          <span class="text-xs font-mono font-bold text-gray-500">${site.id}</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isAlert ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}">${site.status}</span>
        </div>
        <h4 class="font-bold text-sm text-gray-900">${site.name}</h4>
        <p class="text-xs text-gray-600 mt-1">${site.type}</p>
        <div class="grid grid-cols-2 gap-2 my-2 text-xs bg-gray-50 p-2 rounded">
          <div><span class="text-gray-500">Storage:</span> <b>${site.current_water_level_pct}%</b></div>
          <div><span class="text-gray-500">Siltation:</span> <b>${site.siltation_pct}%</b></div>
          <div class="col-span-2"><span class="text-gray-500">Capacity:</span> <b>${(site.capacity_thousand_liters / 1000).toFixed(1)}M Liters</b></div>
        </div>
        <button class="w-full mt-2 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition" onclick="window.selectDamById('${site.id}')">
          Open Telemetry Inspector
        </button>
      </div>
    `);

    marker.on('click', () => {
      selectCheckDamSite(site);
    });

    checkDamMarkersLayer.addLayer(marker);
  });

  checkDamMarkersLayer.addTo(mapInstance);
}

function renderIoTSensors() {
  if (sensorMarkersLayer) {
    mapInstance.removeLayer(sensorMarkersLayer);
  }

  sensorMarkersLayer = L.layerGroup();

  IOT_TELEMETRY_STATIONS.forEach(stn => {
    const sensorIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center cursor-pointer" style="width: 30px; height: 30px;">
          <div class="inline-flex items-center justify-center rounded-lg bg-sky-600 text-white shadow-md border border-white" style="width: 24px; height: 24px;">
            <span class="material-symbols-outlined text-[14px]">sensors</span>
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    const marker = L.marker([stn.lat, stn.lng], { icon: sensorIcon });
    marker.bindPopup(`
      <div class="w-56 p-2 text-left">
        <span class="text-[10px] font-mono text-sky-600 font-bold">${stn.stationId}</span>
        <h4 class="font-bold text-xs text-gray-900 mt-0.5">${stn.name}</h4>
        <div class="text-xs text-gray-600 mt-2 space-y-1">
          <div>Groundwater: <b>${stn.groundwater_depth_m || 'N/A'} m</b></div>
          <div>Battery: <b>${stn.battery_pct}%</b></div>
          <div>Signal: <b>${stn.signal_dbm} dBm</b></div>
        </div>
        <button class="w-full mt-2 py-1 bg-sky-600 text-white rounded text-xs font-medium hover:bg-sky-700 transition" onclick="window.showSensorInfoById('${stn.stationId}')">
          Inspect Sensor Live Feed
        </button>
      </div>
    `);

    marker.on('click', () => {
      showSensorInfo(stn);
    });

    sensorMarkersLayer.addLayer(marker);
  });

  sensorMarkersLayer.addTo(mapInstance);
}

export function clearSiteSelection() {
  selectedSite = null;
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  inspector.innerHTML = `
    <div class="flex flex-col items-center justify-center text-center py-8 px-2 h-full min-h-[420px]">
      <div class="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3 shadow-sm animate-pulse">
        <span class="material-symbols-outlined text-3xl">touch_app</span>
      </div>
      <h3 class="font-headline font-bold text-base text-gray-900 dark:text-white mb-1">No Site Selected</h3>
      <p class="text-xs text-gray-500 dark:text-gray-400 max-w-[240px] leading-relaxed mb-5">
        Click on any check-dam marker, catchment basin, or IoT sensor on the map to inspect live data and verified field photos.
      </p>

      <div class="w-full space-y-2 text-left pt-3 border-t border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1">
          <span>Choose Check-Dam Site:</span>
          <span class="font-mono text-[10px] text-emerald-600 font-bold">${CHECK_DAM_SITES.length} SITES</span>
        </div>
        <div class="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
          ${CHECK_DAM_SITES.map(s => `
            <button onclick="window.selectDamById('${s.id}')" class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 text-xs transition group text-left w-full">
              <div class="min-w-0 flex-1">
                <div class="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">${s.name}</div>
                <div class="text-[10px] text-gray-500 truncate">${s.type} · ${s.capacity_thousand_liters.toLocaleString()} L</div>
              </div>
              <span class="text-[10px] font-mono px-1.5 py-0.5 rounded ${
                s.status === 'Siltation Alert' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' :
                s.status === 'Under Construction' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' :
                'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              } ml-2 shrink-0">${s.id}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

export function selectCheckDamSite(site) {
  selectedSite = site;
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  const place = site.placeInfo || {
    village: site.name.includes("Ridge") ? "Saswad / Purandar Ridge" : (site.name.includes("Wai") ? "Wai Foothills" : "Parner Uplands"),
    taluka: site.basinId === "WB-SATARA-02" ? "Wai" : (site.basinId === "WB-AHMED-03" ? "Parner" : "Haveli / Purandar"),
    district: site.basinId === "WB-SATARA-02" ? "Satara" : (site.basinId === "WB-AHMED-03" ? "Ahmednagar" : "Pune"),
    state: "Maharashtra",
    elevation: "590m MSL",
    geomorphology: "Basalt Catchment Step & Terrace",
    slope: "8.4%",
    soilType: "Deccan Basaltic Medium Black Soil",
    annualRainfall: site.basinId === "WB-SATARA-02" ? "1,150 mm" : (site.basinId === "WB-AHMED-03" ? "510 mm" : "780 mm"),
    groundwaterRechargeRise: `+${((site.storage_increase_pct || 250) / 70).toFixed(1)}m in shallow wells`,
    beneficiaryVillages: "Adjoining farming hamlets",
    beneficiaryFarmersCount: Math.round((site.capacity_thousand_liters || 15000) / 40),
    downstreamBorewells: Math.round((site.capacity_thousand_liters || 15000) / 800),
    microCatchmentStream: "Catchment Feeder Stream (Order 2)",
    environmentalBenefit: "Boosts post-monsoon storage and groundwater replenishment."
  };

  inspector.innerHTML = `
    <div class="space-y-3.5">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="inline-block px-2 py-0.5 rounded text-data-mono font-mono text-[11px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold">
              ${site.id} · ${site.basinId}
            </span>
            <span class="text-[10px] font-mono text-gray-500 font-semibold">${site.type}</span>
          </div>
          <h3 class="text-base font-bold font-headline mt-1 text-gray-900 dark:text-white leading-snug">${site.name}</h3>
          <p class="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
            <span class="material-symbols-outlined text-xs">location_on</span>
            <span>📍 ${place.village}, ${place.taluka} (${place.district})</span>
          </p>
        </div>
        <div class="flex items-center gap-1">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
            site.status === 'Siltation Alert' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' :
            site.status === 'Under Construction' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' :
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
          }">
            ${site.status}
          </span>
          <button onclick="window.clearSiteSelection()" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Close Details">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <!-- Hero Photo with EXIF & Place Watermark -->
      <div class="relative h-44 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-900 group cursor-pointer" onclick="window.openCaseStudyDossier('${site.id}')" title="Click to open Place Dossier">
        <img src="${site.image}" alt="${site.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
        <div class="absolute bottom-2 left-2 right-2 bg-black/75 text-white text-[10px] font-mono px-2.5 py-1.5 rounded-lg backdrop-blur-sm border border-white/10 flex justify-between items-center">
          <span class="truncate">📍 ${place.village}</span>
          <span class="text-emerald-400 shrink-0 font-bold">ALT: ${place.elevation}</span>
        </div>
      </div>

      <!-- 📍 Place Geographical & Agricultural Intelligence Strip -->
      <div class="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
        <div class="flex items-center justify-between font-bold text-blue-950 dark:text-blue-200">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-blue-600">terrain</span>
            <span>Place & Hydro Intelligence</span>
          </span>
          <span class="text-[10px] font-mono text-blue-700 dark:text-blue-300">${place.taluka}, ${place.district}</span>
        </div>
        
        <div class="grid grid-cols-2 gap-2 text-[11px] text-gray-700 dark:text-gray-300">
          <div><span class="text-gray-500 block text-[10px]">Elevation / Slope:</span> <b>${place.elevation} · ${place.slope}</b></div>
          <div><span class="text-gray-500 block text-[10px]">Annual Rainfall:</span> <b>${place.annualRainfall}</b></div>
          <div><span class="text-gray-500 block text-[10px]">Soil Profile:</span> <b class="truncate block">${place.soilType}</b></div>
          <div><span class="text-gray-500 block text-[10px]">Aquifer Rise:</span> <b class="text-emerald-600">${place.groundwaterRechargeRise}</b></div>
        </div>

        <div class="text-[10px] text-blue-900 dark:text-blue-200 pt-1 border-t border-blue-200/60 dark:border-blue-900/40 flex justify-between">
          <span>Beneficiaries: <b>${place.beneficiaryFarmersCount}+ Farmers</b></span>
          <span>Borewells: <b>${place.downstreamBorewells} Active</b></span>
        </div>
      </div>

      <!-- Telemetry Gauge Cards -->
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500 dark:text-gray-400 text-[11px]">Current Storage</div>
          <div class="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">${site.current_water_level_pct}%</div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
            <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${site.current_water_level_pct}%"></div>
          </div>
        </div>

        <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500 dark:text-gray-400 text-[11px]">Silt Accumulation</div>
          <div class="text-lg font-bold ${site.siltation_pct > 30 ? 'text-red-500' : 'text-emerald-600'} mt-0.5">${site.siltation_pct}%</div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1.5">
            <div class="${site.siltation_pct > 30 ? 'bg-red-500' : 'bg-emerald-600'} h-1.5 rounded-full" style="width: ${site.siltation_pct}%"></div>
          </div>
        </div>
      </div>

      <!-- Detailed Specifications -->
      <div class="text-[11px] border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 bg-white/50 dark:bg-gray-800/20">
        <div class="flex justify-between p-2">
          <span class="text-gray-500">Storage Capacity</span>
          <span class="font-semibold">${((site.capacity_thousand_liters || 15000)).toLocaleString()} L</span>
        </div>
        <div class="flex justify-between p-2 bg-gray-50/50 dark:bg-gray-800/30">
          <span class="text-gray-500">Water Gain Impact</span>
          <span class="font-semibold text-emerald-600">+${site.storage_increase_pct}%</span>
        </div>
        <div class="flex justify-between p-2">
          <span class="text-gray-500">Verified Officer</span>
          <span class="font-semibold text-right truncate max-w-[170px]">${site.verified_officer}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2 pt-1">
        <button class="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition active:scale-98" onclick="window.openCaseStudyDossier('${site.id}')">
          <span class="material-symbols-outlined text-base">menu_book</span>
          <span>Open Full Place Dossier</span>
        </button>
        <div class="flex gap-2">
          <button class="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1" onclick="window.zoomToSite(${site.lat}, ${site.lng})">
            <span class="material-symbols-outlined text-sm">zoom_in</span> Focus Map
          </button>
          <button class="py-2 px-3 border border-gray-300 dark:border-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition" onclick="window.navigateToView('view-evidence')">
            Upload Evidence
          </button>
        </div>
      </div>
    </div>
  `;
}

export function showBasinInfo(props) {
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  inspector.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-block px-2 py-0.5 rounded text-data-mono font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">
            ${props.id} · Catchment Basin
          </span>
          <h3 class="text-xl font-bold font-headline mt-1">${props.name}</h3>
          <p class="text-xs text-gray-500">${props.taluka}, ${props.district} District</p>
        </div>
        <button onclick="window.clearSiteSelection()" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Close Details">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Basin Area</div>
          <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">${props.area_sqkm} km²</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Ecological Health</div>
          <div class="text-lg font-bold text-emerald-600 mt-1">${props.health_score}/100</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Storage Volume</div>
          <div class="text-lg font-bold text-blue-600 mt-1">${props.water_storage_mcm} MCM</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Interventions</div>
          <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">${props.structures_count} Structures</div>
        </div>
      </div>

      <div class="text-xs space-y-2 border-t pt-3 border-gray-100 dark:border-gray-800">
        <div class="flex justify-between"><span class="text-gray-500">Soil Characteristic:</span> <span class="font-medium">${props.soil_type}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Average Terrain Slope:</span> <span class="font-medium">${props.average_slope}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Normal Annual Rainfall:</span> <span class="font-medium">${props.annual_rainfall_mm} mm</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Vegetation Cover:</span> <span class="font-medium">${props.vegetation_cover_pct}%</span></div>
      </div>

      <div class="flex gap-2 pt-2">
        <button class="flex-1 py-2 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700 transition" onclick="window.clearSiteSelection()">
          Clear Basin Selection
        </button>
      </div>
    </div>
  `;
}

export function showSensorInfo(stn) {
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  inspector.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-block px-2 py-0.5 rounded text-data-mono font-mono text-xs bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
            ${stn.stationId} · IoT Station
          </span>
          <h3 class="text-lg font-bold font-headline mt-1">${stn.name}</h3>
          <p class="text-xs text-gray-500">${stn.type}</p>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online</span>
          </span>
          <button onclick="window.clearSiteSelection()" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Close Details">
            <span class="material-symbols-outlined text-base">close</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Groundwater Depth</div>
          <div class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">${stn.groundwater_depth_m || '1.4'} m</div>
          <div class="text-[10px] text-emerald-600 mt-1">Recharge: +1.8 cm/day</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Soil Moisture</div>
          <div class="text-xl font-bold font-mono text-gray-900 dark:text-white mt-1">${stn.soil_moisture_pct || '38.4'}%</div>
          <div class="text-[10px] text-blue-600 mt-1">Field Saturation: Optimal</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Battery Level</div>
          <div class="text-lg font-bold font-mono text-emerald-600 mt-1">${stn.battery_pct}%</div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1.5">
            <div class="bg-emerald-500 h-1 rounded-full" style="width: ${stn.battery_pct}%"></div>
          </div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Telemetry Signal</div>
          <div class="text-lg font-bold font-mono text-sky-600 mt-1">${stn.signal_dbm} dBm</div>
          <div class="text-[10px] text-gray-500 mt-1">4G / LoRaWAN Uplink</div>
        </div>
      </div>

      <div class="text-xs space-y-2 border-t pt-3 border-gray-100 dark:border-gray-800">
        <div class="flex justify-between"><span class="text-gray-500">Coordinates:</span> <span class="font-mono">${stn.lat.toFixed(4)}° N, ${stn.lng.toFixed(4)}° E</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Last Telemetry Ping:</span> <span class="font-mono text-sky-600">${stn.last_ping}</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Hardware Gateway:</span> <span class="font-medium">Solar Micro-RTU v2.1</span></div>
      </div>

      <div class="flex gap-2 pt-2">
        <button class="flex-1 py-2 bg-sky-600 text-white rounded text-xs font-semibold hover:bg-sky-700 transition flex items-center justify-center gap-1" onclick="window.zoomToSite(${stn.lat}, ${stn.lng})">
          <span class="material-symbols-outlined text-sm">zoom_in</span> Zoom Station
        </button>
        <button class="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition" onclick="window.navigateToView('view-telemetry')">
          Full Telemetry Feed
        </button>
      </div>
    </div>
  `;
}

export function showStreamInfo(props) {
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  inspector.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-block px-2 py-0.5 rounded text-data-mono font-mono text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
            ${props.id} · Stream Order ${props.order}
          </span>
          <h3 class="text-xl font-bold font-headline mt-1">${props.name}</h3>
          <p class="text-xs text-gray-500">${props.basinId} Catchment Network</p>
        </div>
        <button onclick="window.clearSiteSelection()" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Close Details">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Drainage Status</div>
          <div class="text-lg font-bold text-blue-600 mt-1">${props.status}</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
          <div class="text-gray-500">Strahler Order</div>
          <div class="text-lg font-bold text-gray-900 dark:text-white mt-1">Class ${props.order}</div>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button class="flex-1 py-2 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition" onclick="window.clearSiteSelection()">
          Clear Stream Selection
        </button>
      </div>
    </div>
  `;
}

function setupLayerToggles() {
  const toggleBasins = document.getElementById('toggle-basins');
  if (toggleBasins) {
    toggleBasins.addEventListener('change', (e) => {
      if (e.target.checked) currentBasinLayer.addTo(mapInstance);
      else mapInstance.removeLayer(currentBasinLayer);
    });
  }

  const toggleStreams = document.getElementById('toggle-streams');
  if (toggleStreams) {
    toggleStreams.addEventListener('change', (e) => {
      if (e.target.checked) currentStreamsLayer.addTo(mapInstance);
      else mapInstance.removeLayer(currentStreamsLayer);
    });
  }

  const toggleDams = document.getElementById('toggle-dams');
  if (toggleDams) {
    toggleDams.addEventListener('change', (e) => {
      if (e.target.checked) checkDamMarkersLayer.addTo(mapInstance);
      else mapInstance.removeLayer(checkDamMarkersLayer);
    });
  }

  const toggleSensors = document.getElementById('toggle-sensors');
  if (toggleSensors) {
    toggleSensors.addEventListener('change', (e) => {
      if (e.target.checked) sensorMarkersLayer.addTo(mapInstance);
      else mapInstance.removeLayer(sensorMarkersLayer);
    });
  }
}

function setupTemporalSlider() {
  const slider = document.getElementById('temporal-timeline-slider');
  const labelEl = document.getElementById('temporal-season-label');
  const indexEl = document.getElementById('temporal-spread-index');
  const moistureEl = document.getElementById('temporal-moisture-val');
  const ndviEl = document.getElementById('temporal-ndvi-val');

  if (!slider) return;

  const monthKeys = ['may', 'jul', 'aug', 'oct', 'jan'];

  slider.addEventListener('input', (e) => {
    const idx = parseInt(e.target.value);
    const key = monthKeys[idx] || 'oct';
    const scenario = TEMPORAL_SCENARIOS[key];

    if (labelEl) labelEl.textContent = scenario.label;
    if (indexEl) indexEl.textContent = scenario.water_spread_index;
    if (moistureEl) moistureEl.textContent = scenario.avg_soil_moisture;
    if (ndviEl) ndviEl.textContent = scenario.ndvi_mean.toFixed(2);

    renderBasinPolygons(key);
  });
}

function setupSitingOptimizer() {
  const btn = document.getElementById('btn-siting-optimizer');
  const banner = document.getElementById('siting-mode-banner');

  if (!btn) return;

  btn.addEventListener('click', () => {
    sitingActive = !sitingActive;
    if (sitingActive) {
      btn.classList.add('bg-emerald-600', 'text-white');
      btn.classList.remove('bg-gray-100', 'text-gray-700');
      if (banner) banner.classList.remove('hidden');
    } else {
      btn.classList.remove('bg-emerald-600', 'text-white');
      btn.classList.add('bg-gray-100', 'text-gray-700');
      if (banner) banner.classList.add('hidden');
      if (sitingMarker) mapInstance.removeLayer(sitingMarker);
    }
  });

  mapInstance.on('click', (e) => {
    if (!sitingActive) return;

    const { lat, lng } = e.latlng;
    if (sitingMarker) mapInstance.removeLayer(sitingMarker);

    // Calculate simulated hydrological attributes based on coordinates
    const simulatedSlope = (4 + (Math.abs(Math.sin(lat * 10)) * 12)).toFixed(1);
    const simulatedCatchment = Math.round(80 + (Math.abs(Math.cos(lng * 8)) * 320));
    const estimatedCapacity = Math.round(simulatedCatchment * 42.5);
    const suitabilityScore = Math.min(98, Math.max(62, Math.round(100 - (simulatedSlope * 2.8) + (simulatedCatchment / 18))));

    const sitingIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div class="relative flex items-center justify-center animate-bounce" style="width: 40px; height: 40px;">
          <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-2xl">
            <span class="material-symbols-outlined text-xl">add_location_alt</span>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    sitingMarker = L.marker([lat, lng], { icon: sitingIcon }).addTo(mapInstance);

    sitingMarker.bindPopup(`
      <div class="w-72 p-2">
        <div class="flex justify-between items-center border-b pb-1 mb-2">
          <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">AI SITING ANALYSIS</span>
          <span class="text-xs font-bold text-emerald-600">${suitabilityScore}% SUITABLE</span>
        </div>
        <h4 class="font-bold text-sm text-gray-900">Recommended: Masonry Check-Dam</h4>
        <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded my-2">
          <div>Slope: <b>${simulatedSlope}%</b></div>
          <div>Catchment: <b>${simulatedCatchment} ha</b></div>
          <div class="col-span-2">Estimated Cap: <b>${estimatedCapacity.toLocaleString()} L</b></div>
        </div>
        <p class="text-[11px] text-gray-600">Location satisfies drainage convergence criteria and minimal land submersion.</p>
        <button class="w-full mt-2 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700" onclick="window.saveProposedIntervention(${lat.toFixed(4)}, ${lng.toFixed(4)}, ${suitabilityScore})">
          Save as Proposed Site
        </button>
      </div>
    `).openPopup();
  });
}

function setupCoordinateTracker() {
  const coordDisplay = document.getElementById('map-live-coordinates');
  if (!coordDisplay) return;

  mapInstance.on('mousemove', (e) => {
    const { lat, lng } = e.latlng;
    coordDisplay.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`;
  });
}

function showLocationHUDToast(site) {
  let toast = document.getElementById('map-location-hud-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'map-location-hud-toast';
    toast.className = 'absolute top-16 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-300';
    const canvas = document.getElementById('view-map');
    if (canvas) canvas.appendChild(toast);
  }

  const villageName = site.placeInfo ? site.placeInfo.village : (site.basinName || "Catchment Site");
  const districtName = site.placeInfo ? `${site.placeInfo.taluka}, ${site.placeInfo.district}` : "Maharashtra";

  toast.innerHTML = `
    <div class="bg-gray-900/90 text-white px-4 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md border border-white/20 flex items-center gap-2.5 text-xs">
      <span class="material-symbols-outlined text-emerald-400 text-lg">explore</span>
      <span>
        <b>${site.name}</b> &middot; 📍 ${villageName} <span class="text-gray-300">(${districtName})</span>
      </span>
      <span class="font-mono text-[10px] text-blue-300 font-bold bg-blue-900/70 px-2 py-0.5 rounded border border-blue-700/50">${site.lat.toFixed(4)}°N, ${site.lng.toFixed(4)}°E</span>
    </div>
  `;

  toast.style.opacity = '1';
  setTimeout(() => {
    if (toast) toast.style.opacity = '0';
  }, 4500);
}

// Global window helpers for inline popups & navigation
window.selectDamById = function(id) {
  let site = CHECK_DAM_SITES.find(s => s.id === id || s.name === id);
  if (!site && typeof getStoredCaseStudies === 'function') {
    const caseStudies = getStoredCaseStudies();
    const cs = caseStudies.find(s => s.id === id || s.siteId === id);
    if (cs) {
      site = {
        id: cs.siteId || cs.id,
        name: cs.title,
        type: cs.type,
        basinId: cs.basinId,
        lat: cs.lat,
        lng: cs.lng,
        status: cs.isAiGenerated ? "Siltation Alert" : "Active",
        healthStatus: cs.isAiGenerated ? "Flagged" : "Optimal",
        capacity_thousand_liters: Math.round((cs.capacityLiters || 15000000) / 1000),
        current_water_level_pct: cs.currentWaterLevelPct || 80,
        siltation_pct: cs.siltationPct || 12,
        catchment_area_ha: cs.catchmentAreaHa || 160,
        completion_date: "2026-03-01",
        inspection_date: cs.timestamp ? cs.timestamp.substring(0, 10) : "2026-03-29",
        verified_officer: cs.verifiedOfficer || "Zilla Parishad Officer",
        exif_verified: !cs.isAiGenerated,
        contractor: cs.contractor || "District Agency",
        storage_increase_pct: cs.storageGainPct || 250,
        vegetation_index_ndvi: cs.ndviIndex || 0.65,
        image: cs.image,
        notes: cs.notes || "",
        placeInfo: cs.placeInfo
      };
    }
  }

  if (site) {
    selectCheckDamSite(site);
    if (mapInstance) {
      mapInstance.flyTo([site.lat, site.lng], 15, {
        duration: 1.2,
        easeLinearity: 0.25
      });

      // Show pulsating highlight circle on marker
      if (activeHighlightCircle) {
        mapInstance.removeLayer(activeHighlightCircle);
      }
      activeHighlightCircle = L.circleMarker([site.lat, site.lng], {
        radius: 28,
        color: '#2563eb',
        weight: 3,
        fillColor: '#3b82f6',
        fillOpacity: 0.35
      }).addTo(mapInstance);

      setTimeout(() => {
        if (activeHighlightCircle && mapInstance) {
          mapInstance.removeLayer(activeHighlightCircle);
          activeHighlightCircle = null;
        }
      }, 4000);

      showLocationHUDToast(site);
    }
  }
};

window.showSensorInfoById = function(stationId) {
  const stn = IOT_TELEMETRY_STATIONS.find(s => s.stationId === stationId);
  if (stn) {
    showSensorInfo(stn);
    if (mapInstance) {
      mapInstance.flyTo([stn.lat, stn.lng], 15, { duration: 1.0 });
    }
  }
};

window.clearSiteSelection = clearSiteSelection;
window.showSensorInfo = showSensorInfo;
window.showStreamInfo = showStreamInfo;
window.showBasinInfo = showBasinInfo;
window.selectCheckDamSite = selectCheckDamSite;

window.zoomToSite = function(lat, lng) {
  if (mapInstance) {
    mapInstance.flyTo([lat, lng], 16, { duration: 1.0 });
  }
};

window.saveProposedIntervention = function(lat, lng, score) {
  alert(`Proposed check dam site at (${lat}, ${lng}) with AI Suitability Score ${score}% has been added to the District Water Conservation Master Plan!`);
};

window.triggerSitingAtCoords = function(lat, lng) {
  if (mapInstance) {
    mapInstance.flyTo([lat, lng], 16, { duration: 1.0 });
  }
  const simulatedSlope = (4 + (Math.abs(Math.sin(lat * 10)) * 12)).toFixed(1);
  const simulatedCatchment = Math.round(80 + (Math.abs(Math.cos(lng * 8)) * 320));
  const estimatedCapacity = Math.round(simulatedCatchment * 42.5);
  const suitabilityScore = Math.min(98, Math.max(62, Math.round(100 - (simulatedSlope * 2.8) + (simulatedCatchment / 18))));

  if (sitingMarker && mapInstance) mapInstance.removeLayer(sitingMarker);

  const sitingIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex items-center justify-center animate-bounce" style="width: 40px; height: 40px;">
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center border-4 border-white shadow-2xl">
          <span class="material-symbols-outlined text-xl">add_location_alt</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  sitingMarker = L.marker([lat, lng], { icon: sitingIcon }).addTo(mapInstance);

  sitingMarker.bindPopup(`
    <div class="w-72 p-2">
      <div class="flex justify-between items-center border-b pb-1 mb-2">
        <span class="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">AI SITING ANALYSIS</span>
        <span class="text-xs font-bold text-emerald-600">${suitabilityScore}% SUITABLE</span>
      </div>
      <h4 class="font-bold text-sm text-gray-900">Recommended: Masonry Check-Dam</h4>
      <div class="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2 rounded my-2">
        <div>Slope: <b>${simulatedSlope}%</b></div>
        <div>Catchment: <b>${simulatedCatchment} ha</b></div>
        <div class="col-span-2">Estimated Cap: <b>${estimatedCapacity.toLocaleString()} L</b></div>
      </div>
      <p class="text-[11px] text-gray-600">Location satisfies drainage convergence criteria and minimal land submersion.</p>
      <button class="w-full mt-2 py-1.5 bg-emerald-600 text-white rounded text-xs font-semibold hover:bg-emerald-700" onclick="window.saveProposedIntervention(${lat.toFixed(4)}, ${lng.toFixed(4)}, ${suitabilityScore})">
        Save as Proposed Site
      </button>
    </div>
  `).openPopup();
};

export function showCustomLocationInfo(place) {
  const inspector = document.getElementById('site-inspector-panel');
  if (!inspector) return;

  const lat = place.lat;
  const lng = place.lng;
  const simulatedSlope = (3.5 + (Math.abs(Math.sin(lat * 12)) * 10)).toFixed(1);
  const simulatedCatchment = Math.round(65 + (Math.abs(Math.cos(lng * 9)) * 280));
  const estimatedRainfall = Math.round(650 + (Math.abs(Math.sin((lat + lng) * 5)) * 550));
  const suitabilityScore = Math.min(96, Math.max(65, Math.round(98 - (simulatedSlope * 2.2) + (simulatedCatchment / 22))));

  inspector.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-start justify-between">
        <div>
          <span class="inline-block px-2 py-0.5 rounded text-data-mono font-mono text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            📍 Located Place
          </span>
          <h3 class="text-lg font-bold font-headline mt-1 leading-snug text-gray-900 dark:text-white">${place.name}</h3>
          <p class="text-xs text-gray-500">${place.subtitle || 'Geocoded Location'}</p>
        </div>
        <button onclick="window.clearSiteSelection()" class="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition" title="Close Details">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      </div>

      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">AI Siting Potential</div>
          <div class="text-xl font-bold font-mono text-emerald-600 mt-1">${suitabilityScore}%</div>
          <div class="text-[10px] text-emerald-600 mt-0.5">High Potential</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Terrain Slope</div>
          <div class="text-xl font-bold font-mono text-blue-600 mt-1">${simulatedSlope}%</div>
          <div class="text-[10px] text-gray-500 mt-0.5">Gentle to Moderate</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Catchment Area</div>
          <div class="text-lg font-bold font-mono text-gray-900 dark:text-white mt-1">${simulatedCatchment} ha</div>
          <div class="text-[10px] text-gray-500 mt-0.5">Micro-Catchment</div>
        </div>
        <div class="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg border border-gray-100 dark:border-gray-700">
          <div class="text-gray-500">Est. Rainfall</div>
          <div class="text-lg font-bold font-mono text-cyan-600 mt-1">${estimatedRainfall} mm</div>
          <div class="text-[10px] text-gray-500 mt-0.5">Monsoon Seasonal</div>
        </div>
      </div>

      <div class="text-xs space-y-2 border-t pt-3 border-gray-100 dark:border-gray-800">
        <div class="flex justify-between"><span class="text-gray-500">Coordinates:</span> <span class="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Drainage Zone:</span> <span class="font-medium">Krishna-Bhima Catchment</span></div>
        <div class="flex justify-between"><span class="text-gray-500">Soil Permeability:</span> <span class="font-medium">Medium-High (Clayey Loam)</span></div>
      </div>

      <div class="flex flex-col gap-2 pt-2">
        <button class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow" onclick="window.triggerSitingAtCoords(${lat}, ${lng})">
          <span class="material-symbols-outlined text-sm">architecture</span>
          Run AI Siting Analysis Here
        </button>
        <button class="w-full py-1.5 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 font-medium transition" onclick="window.zoomToSite(${lat}, ${lng})">
          Center & Zoom Closer
        </button>
      </div>
    </div>
  `;
}

function setupAddressLocatorSearch() {
  const searchInput = document.getElementById('map-address-search-input');
  const clearBtn = document.getElementById('btn-clear-address-search');
  const resultsDropdown = document.getElementById('map-address-results-dropdown');

  if (!searchInput || !resultsDropdown) return;

  const PRESET_PLACES = [
    { name: "Saswad", subtitle: "Purandar Taluka, Pune (Karha Catchment)", lat: 18.3444, lng: 74.0309, type: "watershed_hub" },
    { name: "Wai", subtitle: "Satara District (Upper Krishna Basin)", lat: 17.9482, lng: 73.8911, type: "watershed_hub" },
    { name: "Parner Uplands", subtitle: "Ahmednagar District (Rain-Shadow Zone)", lat: 19.0012, lng: 74.4421, type: "watershed_hub" },
    { name: "Satara", subtitle: "Western Ghats Foothills, Maharashtra", lat: 17.6805, lng: 73.9930, type: "district" },
    { name: "Pune", subtitle: "Mula-Mutha & Upper Bhima Catchment", lat: 18.5204, lng: 73.8567, type: "district" },
    { name: "Dhom Reservoir", subtitle: "Wai, Satara (Krishna Tributary)", lat: 17.9833, lng: 73.8167, type: "reservoir" },
    { name: "Bavdhan Hills", subtitle: "Pune Sub-catchment Zone", lat: 18.5158, lng: 73.7719, type: "village" },
    { name: "Jejuri", subtitle: "Purandar, Pune (Karha River Basin)", lat: 18.2757, lng: 74.1565, type: "village" },
    { name: "Shirwal", subtitle: "Khandala, Satara (Nira Basin)", lat: 18.1360, lng: 73.9856, type: "village" },
    { name: "Velhe", subtitle: "Torna Catchment, Gunjawani Basin", lat: 18.2933, lng: 73.6339, type: "village" },
    { name: "Bhor", subtitle: "Bhatghar Reservoir Valley, Pune", lat: 18.1481, lng: 73.8443, type: "village" },
    { name: "Baramati", subtitle: "Nira Left Bank Agricultural Basin", lat: 18.1517, lng: 74.5772, type: "watershed_hub" },
    { name: "Ahmednagar", subtitle: "Sina River Basin, Maharashtra", lat: 19.0948, lng: 74.7480, type: "district" },
    { name: "Khadakwasla Catchment", subtitle: "Mutha River Basin, Pune", lat: 18.4411, lng: 73.7628, type: "reservoir" },
    { name: "Panshet Dam Valley", subtitle: "Ambi River Sub-basin, Velhe", lat: 18.4069, lng: 73.6186, type: "reservoir" },
    { name: "Mahabaleshwar", subtitle: "Krishna River Source / Ridge Headwaters", lat: 17.9237, lng: 73.6586, type: "watershed_hub" }
  ];

  let debounceTimer = null;
  let activeIndex = -1;
  let currentResults = [];

  const selectPlace = (place) => {
    searchInput.value = place.name;
    if (clearBtn) clearBtn.classList.remove('hidden');
    resultsDropdown.classList.add('hidden');
    resultsDropdown.innerHTML = '';

    if (!mapInstance) return;

    mapInstance.flyTo([place.lat, place.lng], 15, {
      duration: 1.4,
      easeLinearity: 0.25
    });

    if (searchLocationMarker && mapInstance) {
      mapInstance.removeLayer(searchLocationMarker);
    }

    const pinIcon = L.divIcon({
      className: 'custom-search-pin',
      html: `
        <div class="relative flex items-center justify-center" style="width: 44px; height: 44px;">
          <div class="absolute w-11 h-11 rounded-full bg-emerald-500/30 animate-ping"></div>
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center border-2 border-white shadow-2xl z-10">
            <span class="material-symbols-outlined text-lg">location_on</span>
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    searchLocationMarker = L.marker([place.lat, place.lng], { icon: pinIcon }).addTo(mapInstance);

    const lat = place.lat;
    const lng = place.lng;
    const simulatedSlope = (3.5 + (Math.abs(Math.sin(lat * 12)) * 10)).toFixed(1);
    const simulatedCatchment = Math.round(65 + (Math.abs(Math.cos(lng * 9)) * 280));
    const suitabilityScore = Math.min(96, Math.max(65, Math.round(98 - (simulatedSlope * 2.2) + (simulatedCatchment / 22))));

    searchLocationMarker.bindPopup(`
      <div class="w-72 p-1.5 font-sans">
        <div class="flex items-center justify-between border-b pb-1.5 mb-2">
          <span class="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded flex items-center gap-1">
            <span class="material-symbols-outlined text-xs">pin_drop</span> LOCATED PLACE
          </span>
          <span class="text-xs font-mono font-bold text-gray-500">${lat.toFixed(4)}°, ${lng.toFixed(4)}°</span>
        </div>
        <h4 class="font-bold text-sm text-gray-900 dark:text-white leading-tight">${place.name}</h4>
        <p class="text-xs text-gray-500 mt-0.5">${place.subtitle || 'Geocoded Address'}</p>
        
        <div class="grid grid-cols-2 gap-1.5 bg-gray-50 dark:bg-gray-800/70 p-2 rounded-lg my-2.5 text-xs">
          <div><span class="text-gray-400">Slope:</span> <b>${simulatedSlope}%</b></div>
          <div><span class="text-gray-400">Catchment:</span> <b>${simulatedCatchment} ha</b></div>
          <div class="col-span-2 flex items-center justify-between pt-1 border-t border-gray-200 dark:border-gray-700 text-emerald-600 font-semibold">
            <span>AI Suitability:</span>
            <span>${suitabilityScore}% High</span>
          </div>
        </div>

        <div class="space-y-1.5">
          <button class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition" onclick="window.triggerSitingAtCoords(${lat}, ${lng})">
            <span class="material-symbols-outlined text-sm">architecture</span>
            Run AI Siting Analysis
          </button>
        </div>
      </div>
    `, { offset: [0, -10] }).openPopup();

    if (activeHighlightCircle && mapInstance) {
      mapInstance.removeLayer(activeHighlightCircle);
    }
    activeHighlightCircle = L.circleMarker([place.lat, place.lng], {
      radius: 32,
      color: '#059669',
      weight: 3,
      fillColor: '#10b981',
      fillOpacity: 0.25
    }).addTo(mapInstance);

    setTimeout(() => {
      if (activeHighlightCircle && mapInstance) {
        mapInstance.removeLayer(activeHighlightCircle);
        activeHighlightCircle = null;
      }
    }, 4000);

    showLocationHUDToast({
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      placeInfo: {
        village: place.name.split(',')[0],
        taluka: place.subtitle ? place.subtitle.split(',')[0] : 'Catchment Area',
        district: place.subtitle && place.subtitle.includes('Satara') ? 'Satara' : (place.subtitle && place.subtitle.includes('Ahmednagar') ? 'Ahmednagar' : 'Pune')
      }
    });

    showCustomLocationInfo(place);
  };

  const renderDropdown = (items) => {
    currentResults = items;
    activeIndex = -1;

    if (!items || items.length === 0) {
      resultsDropdown.innerHTML = `
        <div class="p-3 text-center text-gray-400 text-xs">
          No matching places found. Try entering district, village or road name.
        </div>
      `;
      resultsDropdown.classList.remove('hidden');
      return;
    }

    resultsDropdown.innerHTML = items.map((item, idx) => `
      <div 
        class="address-search-item px-3.5 py-2.5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer flex items-start gap-2.5 transition ${idx === activeIndex ? 'bg-emerald-50 dark:bg-emerald-950/50' : ''}" 
        data-index="${idx}"
      >
        <span class="material-symbols-outlined text-emerald-600 text-base mt-0.5 shrink-0">
          ${item.type === 'checkdam' ? 'water_drop' : item.type === 'basin' ? 'public' : item.type === 'reservoir' ? 'waves' : 'location_on'}
        </span>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 dark:text-white truncate">${item.name}</div>
          <div class="text-[11px] text-gray-500 dark:text-gray-400 truncate">${item.subtitle || ''}</div>
        </div>
        <span class="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded border border-emerald-200/50 shrink-0">
          ${item.lat.toFixed(2)}°, ${item.lng.toFixed(2)}°
        </span>
      </div>
    `).join('');

    resultsDropdown.querySelectorAll('.address-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'));
        if (currentResults[idx]) {
          selectPlace(currentResults[idx]);
        }
      });
    });

    resultsDropdown.classList.remove('hidden');
  };

  const executeSearch = (rawQuery) => {
    const query = rawQuery.trim().toLowerCase();
    if (!query) {
      resultsDropdown.classList.add('hidden');
      resultsDropdown.innerHTML = '';
      return;
    }

    // 1. Search in Check Dam Sites
    const damMatches = CHECK_DAM_SITES.filter(d => 
      d.name.toLowerCase().includes(query) || 
      (d.basinName && d.basinName.toLowerCase().includes(query)) ||
      (d.placeInfo && (d.placeInfo.village.toLowerCase().includes(query) || d.placeInfo.district.toLowerCase().includes(query)))
    ).map(d => ({
      name: d.name,
      subtitle: d.placeInfo ? `${d.placeInfo.village}, ${d.placeInfo.taluka} (${d.basinName || d.basinId})` : `${d.basinId} Check Dam`,
      lat: d.lat,
      lng: d.lng,
      type: 'checkdam',
      rawSite: d
    }));

    // 2. Search in Watershed Basins
    const basinMatches = (WATERSHED_BASINS.features || []).filter(f => 
      f.properties.name.toLowerCase().includes(query) || 
      f.properties.id.toLowerCase().includes(query) ||
      (f.properties.district && f.properties.district.toLowerCase().includes(query))
    ).map(f => {
      const coords = f.geometry.coordinates[0];
      const avgLat = coords.reduce((acc, c) => acc + c[1], 0) / coords.length;
      const avgLng = coords.reduce((acc, c) => acc + c[0], 0) / coords.length;
      return {
        name: f.properties.name,
        subtitle: `${f.properties.taluka}, ${f.properties.district} Basin (${f.properties.area_sqkm} km²)`,
        lat: avgLat,
        lng: avgLng,
        type: 'basin'
      };
    });

    // 3. Search in Local Preset Places
    const presetMatches = PRESET_PLACES.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.subtitle.toLowerCase().includes(query)
    );

    const combinedLocal = [...damMatches, ...presetMatches, ...basinMatches];

    const uniqueLocal = [];
    const seen = new Set();
    combinedLocal.forEach(item => {
      const key = `${item.name}-${item.lat.toFixed(3)}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueLocal.push(item);
      }
    });

    renderDropdown(uniqueLocal.slice(0, 6));

    if (query.length >= 3) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(rawQuery)}&addressdetails=1&limit=5`, {
          headers: { 'Accept-Language': 'en' }
        })
        .then(res => res.json())
        .then(apiData => {
          if (Array.isArray(apiData) && apiData.length > 0) {
            const apiResults = apiData.map(item => ({
              name: item.name || item.display_name.split(',')[0],
              subtitle: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: 'nominatim'
            }));

            const merged = [...uniqueLocal];
            apiResults.forEach(r => {
              if (!merged.some(m => Math.abs(m.lat - r.lat) < 0.01 && Math.abs(m.lng - r.lng) < 0.01)) {
                merged.push(r);
              }
            });

            renderDropdown(merged.slice(0, 7));
          }
        })
        .catch(err => {
          console.warn('Geocoding search notice:', err);
        });
      }, 350);
    }
  };

  searchInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (clearBtn) {
      if (val.length > 0) clearBtn.classList.remove('hidden');
      else clearBtn.classList.add('hidden');
    }
    executeSearch(val);
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length > 0) {
      executeSearch(searchInput.value);
    } else {
      renderDropdown(PRESET_PLACES.slice(0, 6));
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (currentResults.length > 0) {
        activeIndex = (activeIndex + 1) % currentResults.length;
        renderDropdown(currentResults);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentResults.length > 0) {
        activeIndex = (activeIndex - 1 + currentResults.length) % currentResults.length;
        renderDropdown(currentResults);
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && currentResults[activeIndex]) {
        selectPlace(currentResults[activeIndex]);
      } else if (currentResults.length > 0) {
        selectPlace(currentResults[0]);
      }
    } else if (e.key === 'Escape') {
      resultsDropdown.classList.add('hidden');
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.add('hidden');
      resultsDropdown.classList.add('hidden');
      resultsDropdown.innerHTML = '';
      if (searchLocationMarker && mapInstance) {
        mapInstance.removeLayer(searchLocationMarker);
        searchLocationMarker = null;
      }
      if (activeHighlightCircle && mapInstance) {
        mapInstance.removeLayer(activeHighlightCircle);
        activeHighlightCircle = null;
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !resultsDropdown.contains(e.target)) {
      resultsDropdown.classList.add('hidden');
    }
  });
}
