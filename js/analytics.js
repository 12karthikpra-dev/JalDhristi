// JalDrishti Executive Analytics & District Scorecards Module
import { DISTRICT_PERFORMANCE_METRICS } from '../data/watersheds.js';

let ndviChartInstance = null;
let districtChartInstance = null;

export function initAnalytics() {
  renderDistrictTable();
  renderNdviCurveChart();
  renderDistrictComparisonChart();
  setupAnalyticsFilters();
}

function renderDistrictTable(filter = 'All') {
  const tbody = document.getElementById('district-scorecard-tbody');
  if (!tbody) return;

  const filtered = filter === 'All' 
    ? DISTRICT_PERFORMANCE_METRICS 
    : DISTRICT_PERFORMANCE_METRICS.filter(d => d.district.toLowerCase() === filter.toLowerCase());

  tbody.innerHTML = filtered.map(d => `
    <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition">
      <td class="py-3 px-4 font-semibold text-gray-900 dark:text-white">${d.district}</td>
      <td class="py-3 px-4 font-mono">${d.watersheds}</td>
      <td class="py-3 px-4 font-mono">${d.area_mha} Mha</td>
      <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">+${d.storage_gain_pct}%</td>
      <td class="py-3 px-4">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
          ${d.verification_accuracy}%
        </span>
      </td>
      <td class="py-3 px-4 font-mono">₹${d.funds_crores} Cr</td>
      <td class="py-3 px-4">
        <div class="flex items-center gap-2">
          <div class="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${d.completion_rate}%"></div>
          </div>
          <span class="text-xs font-mono text-gray-500">${d.completion_rate}%</span>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderNdviCurveChart() {
  const ctx = document.getElementById('chart-ndvi-trend');
  if (!ctx || !window.Chart) return;

  if (ndviChartInstance) ndviChartInstance.destroy();

  ndviChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Q1 2022', 'Q3 2022', 'Q1 2023', 'Q3 2023', 'Q1 2024', 'Q3 2024', 'Q1 2025', 'Q3 2025', 'Q1 2026 (Now)'],
      datasets: [
        {
          label: 'JalDrishti Intervened Catchments (NDVI)',
          data: [0.26, 0.38, 0.31, 0.49, 0.39, 0.62, 0.44, 0.72, 0.68],
          borderColor: '#0F3D2E',
          backgroundColor: 'rgba(15, 61, 46, 0.15)',
          fill: true,
          tension: 0.38,
          pointRadius: 4,
          pointBackgroundColor: '#1F7FB8',
          borderWidth: 3
        },
        {
          label: 'Control Basins (Unmanaged Arid Reference)',
          data: [0.24, 0.32, 0.23, 0.34, 0.25, 0.36, 0.26, 0.39, 0.28],
          borderColor: '#BA1A1A',
          borderDash: [5, 5],
          backgroundColor: 'transparent',
          tension: 0.3,
          pointRadius: 2,
          borderWidth: 1.5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(25, 28, 27, 0.9)',
          titleFont: { family: 'JetBrains Mono' },
          bodyFont: { family: 'Inter' }
        }
      },
      scales: {
        y: {
          min: 0.1,
          max: 0.9,
          title: { display: true, text: 'Normalized Difference Vegetation Index (NDVI)', font: { size: 11 } },
          grid: { color: 'rgba(200, 200, 200, 0.15)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function renderDistrictComparisonChart() {
  const ctx = document.getElementById('chart-district-comparison');
  if (!ctx || !window.Chart) return;

  if (districtChartInstance) districtChartInstance.destroy();

  const labels = DISTRICT_PERFORMANCE_METRICS.map(d => d.district);
  const actuals = DISTRICT_PERFORMANCE_METRICS.map(d => d.storage_gain_pct);
  const targets = [280, 300, 240, 210, 250];

  districtChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Actual Water Storage Gain (%)',
          data: actuals,
          backgroundColor: '#1F7FB8',
          borderRadius: 6
        },
        {
          label: 'Government Target (%)',
          data: targets,
          backgroundColor: '#EDEEEB',
          borderColor: '#717974',
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, font: { family: 'Inter', size: 12 } } }
      },
      scales: {
        y: {
          title: { display: true, text: 'Storage Gain (%)', font: { size: 11 } },
          grid: { color: 'rgba(200, 200, 200, 0.15)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });
}

function setupAnalyticsFilters() {
  const select = document.getElementById('district-filter-select');
  if (select) {
    select.addEventListener('change', (e) => {
      renderDistrictTable(e.target.value);
    });
  }

  const exportBtn = document.getElementById('btn-export-audit-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportScorecardsCsv();
    });
  }
}

function exportScorecardsCsv() {
  const headers = ["District", "Watersheds", "Monitored Area (Mha)", "Storage Gain (%)", "Verification Accuracy (%)", "Funds Utilized (Cr)", "Completion Rate (%)"];
  const rows = DISTRICT_PERFORMANCE_METRICS.map(d => [
    d.district,
    d.watersheds,
    d.area_mha,
    d.storage_gain_pct,
    d.verification_accuracy,
    d.funds_crores,
    d.completion_rate
  ]);

  let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `JalDrishti_Audit_Scorecard_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
