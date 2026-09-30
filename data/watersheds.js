// JalDrishti Geospatial Watershed Platform - Mock GeoJSON & Telemetry Data
// Covers the Bhima-Krishna River Basins (Western Ghats to Deccan Plateau, Maharashtra)

export const WATERSHED_BASINS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "WB-PUNE-01",
        "name": "Upper Bhima Micro-Watershed",
        "district": "Pune",
        "taluka": "Haveli & Purandar",
        "area_sqkm": 248.5,
        "average_slope": "12.4%",
        "soil_type": "Medium Black Clay & Loam",
        "annual_rainfall_mm": 780,
        "structures_count": 42,
        "health_score": 88,
        "water_storage_mcm": 14.8,
        "vegetation_cover_pct": 34.2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [73.75, 18.62],
          [73.98, 18.65],
          [74.15, 18.55],
          [74.18, 18.38],
          [74.02, 18.28],
          [73.80, 18.32],
          [73.72, 18.48],
          [73.75, 18.62]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "WB-SATARA-02",
        "name": "Krishna Tributary Catchment #4",
        "district": "Satara",
        "taluka": "Wai & Khandala",
        "area_sqkm": 312.0,
        "average_slope": "18.2%",
        "soil_type": "Lateritic & Coarse Sandy Loam",
        "annual_rainfall_mm": 1150,
        "structures_count": 58,
        "health_score": 92,
        "water_storage_mcm": 22.4,
        "vegetation_cover_pct": 46.8
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [73.88, 18.15],
          [74.12, 18.20],
          [74.25, 18.05],
          [74.18, 17.88],
          [73.95, 17.85],
          [73.82, 17.98],
          [73.88, 18.15]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "WB-AHMED-03",
        "name": "Mula-Pravara Sub-Basin C",
        "district": "Ahmednagar",
        "taluka": "Parner",
        "area_sqkm": 420.0,
        "average_slope": "6.8%",
        "soil_type": "Shallow Calcareous Black Soil",
        "annual_rainfall_mm": 510,
        "structures_count": 64,
        "health_score": 76,
        "water_storage_mcm": 9.2,
        "vegetation_cover_pct": 21.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [74.20, 18.75],
          [74.52, 18.82],
          [74.68, 18.65],
          [74.45, 18.48],
          [74.18, 18.52],
          [74.20, 18.75]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "WB-SOLAPUR-04",
        "name": "Sina River Catchment Sub-Division",
        "district": "Solapur",
        "taluka": "Madha & Karmala",
        "area_sqkm": 540.0,
        "average_slope": "4.2%",
        "soil_type": "Deep Black Vertisols",
        "annual_rainfall_mm": 480,
        "structures_count": 71,
        "health_score": 71,
        "water_storage_mcm": 11.5,
        "vegetation_cover_pct": 18.2
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [74.85, 18.20],
          [75.25, 18.30],
          [75.40, 18.05],
          [75.15, 17.85],
          [74.80, 17.95],
          [74.85, 18.20]
        ]]
      }
    }
  ]
};

export const DRAINAGE_STREAMS = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "name": "Mula-Mutha Tributary Stream 1", "order": 3, "status": "Perennial Flowing" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [73.78, 18.58], [73.84, 18.54], [73.92, 18.52], [74.02, 18.49], [74.12, 18.46]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Purandar Mountain Ridge Creek", "order": 2, "status": "Seasonal Stream" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [73.85, 18.30], [73.91, 18.35], [73.97, 18.40], [74.05, 18.48]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Wai Foothills Drainage Gully A", "order": 2, "status": "Recharged by Check-Dams" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [73.90, 18.12], [73.96, 18.05], [74.03, 17.98], [74.12, 17.92]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "name": "Parner Plateau Contour Overflow Stream", "order": 1, "status": "Subsurface Flow Active" },
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [74.28, 18.72], [74.35, 18.66], [74.44, 18.58]
        ]
      }
    }
  ]
};

export const CHECK_DAM_SITES = [
  {
    id: "CD-004",
    name: "Check-Dam #4 (Percolation Weir)",
    type: "Masonry Check Dam",
    basinId: "WB-PUNE-01",
    lat: 18.4820,
    lng: 73.9350,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 14500,
    current_water_level_pct: 84,
    siltation_pct: 12,
    catchment_area_ha: 180,
    completion_date: "2024-11-18",
    inspection_date: "2026-03-12",
    verified_officer: "Er. Ramesh Deshmukh (Zilla Parishad Pune)",
    exif_verified: true,
    contractor: "Sahyadri Infra Projects",
    storage_increase_pct: 312,
    vegetation_index_ndvi: 0.68,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaRYztIajTrq1i7x9U3g8M-BPkQZcKQsM54hud94HrjV7bf_h75m6NweZcGk195Pz4aBDWi2a8vy30odDYfpioKGQawW9AgjkcanrA01eaRg3ntCAFP1TNN0L62wR5-KljqJn55C412QV955rSkiuwmS7k6VhpM_qGA1EyC1txZcyiPMDdCkAEx2mf4Jg178bMAySD8fn_b3PWiGBPij7jx77oTBwZaxTZIyrq9VwsCBqZM3e_jevvlg",
    notes: "Full water crest reached during retreat monsoon. Silt traps functioning within permissible parameters.",
    placeInfo: {
      village: "Saswad (Malhargad Ridge Foothills)",
      taluka: "Purandar",
      district: "Pune",
      state: "Maharashtra",
      elevation: "614m MSL",
      geomorphology: "Upper Sahyadri Basalt Ridges & Valley Step",
      slope: "11.2% (Moderate Runoff Gradient)",
      soilType: "Deccan Basaltic Clayey Loam (Vertisol)",
      annualRainfall: "780 mm",
      groundwaterRechargeRise: "+4.2m rise in aquifer column",
      beneficiaryVillages: "Saswad Khurd, Dimbhewadi, Boripardhi",
      beneficiaryFarmersCount: 340,
      downstreamBorewells: 18,
      microCatchmentStream: "Purandar Ridge Mountain Creek (Order 2)",
      environmentalBenefit: "Arrests topsoil erosion by 34 tons/year; extends green canopy duration by 75 days."
    }
  },
  {
    id: "PT-012",
    name: "Percolation Tank #12",
    type: "Earthen Percolation Tank",
    basinId: "WB-PUNE-01",
    lat: 18.5204,
    lng: 73.8567,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 28000,
    current_water_level_pct: 78,
    siltation_pct: 18,
    catchment_area_ha: 340,
    completion_date: "2025-02-10",
    inspection_date: "2026-02-28",
    verified_officer: "Sunita Gokhale, Soil Conservation Officer",
    exif_verified: true,
    contractor: "Jal-Chetna Trust",
    storage_increase_pct: 260,
    vegetation_index_ndvi: 0.62,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr35QzYE-x2YQvkEU32js2T0sdi4083qK6nIsC8-2gKJTvaw33D0xHJUjRlKfYVC_S_q_0uzTR6WY_UyOHRdkrI8ZbEUMZpZbg630_K-2qN8qPIeTcubqbHxXv4RGcdr6UX0PWDR4o5zwEOdOKtkrrtS2EBDwEe8aLZ_qzj2W2hNdBP4ezRoUyXUzwYbOLvAA3AHF56AW8x_kstAfRUMEz4CcEYnYZ_R20CZuit_QgLag5kwDVhGpv0A",
    notes: "Recharges downstream 14 borewells across 3 surrounding farming hamlets. Borewell water table rose by 4.2m.",
    placeInfo: {
      village: "Khadakwasla Catchment Area",
      taluka: "Haveli",
      district: "Pune",
      state: "Maharashtra",
      elevation: "582m MSL",
      geomorphology: "Undulating Piedmont Plain & Infiltration Basin",
      slope: "7.8% (Gentle Infiltration Slope)",
      soilType: "Medium Black Soil & Weathered Basalt Substratum",
      annualRainfall: "840 mm",
      groundwaterRechargeRise: "+3.8m rise in village open wells",
      beneficiaryVillages: "Khadakwasla Gaon, Kudje, Mandvi",
      beneficiaryFarmersCount: 520,
      downstreamBorewells: 26,
      microCatchmentStream: "Mula-Mutha Tributary Stream 1 (Order 3)",
      environmentalBenefit: "Provides winter rabi crop irrigation security across 3 surrounding farming hamlets."
    }
  },
  {
    id: "GB-008",
    name: "Gabion Silt Arrestor #8",
    type: "Wire-Mesh Gabion",
    basinId: "WB-SATARA-02",
    lat: 18.0450,
    lng: 73.9850,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 6200,
    current_water_level_pct: 65,
    siltation_pct: 26,
    catchment_area_ha: 95,
    completion_date: "2025-05-14",
    inspection_date: "2026-03-05",
    verified_officer: "Anand Pawar (Satara Water Dept)",
    exif_verified: true,
    contractor: "Ghatkopar Rural Builders",
    storage_increase_pct: 145,
    vegetation_index_ndvi: 0.58,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaRYztIajTrq1i7x9U3g8M-BPkQZcKQsM54hud94HrjV7bf_h75m6NweZcGk195Pz4aBDWi2a8vy30odDYfpioKGQawW9AgjkcanrA01eaRg3ntCAFP1TNN0L62wR5-KljqJn55C412QV955rSkiuwmS7k6VhpM_qGA1EyC1txZcyiPMDdCkAEx2mf4Jg178bMAySD8fn_b3PWiGBPij7jx77oTBwZaxTZIyrq9VwsCBqZM3e_jevvlg",
    notes: "Constructed on steep gradient stream bed. Successfully mitigated gully erosion upstream.",
    placeInfo: {
      village: "Wai Foothills / Dhom Sub-Catchment",
      taluka: "Wai",
      district: "Satara",
      state: "Maharashtra",
      elevation: "710m MSL",
      geomorphology: "Steep Sahyadri Escarpment & High Energy Gully",
      slope: "18.5% (Steep Torrential Gradient)",
      soilType: "Lateritic Coarse Gravel & Rocky Skeletal Soil",
      annualRainfall: "1,150 mm",
      groundwaterRechargeRise: "+2.4m in valley floor aquifers",
      beneficiaryVillages: "Bavdhan, Menavali, Wai Rural",
      beneficiaryFarmersCount: 195,
      downstreamBorewells: 12,
      microCatchmentStream: "Wai Foothills Drainage Gully A (Order 2)",
      environmentalBenefit: "Trapped 180+ tons of gravel & silt, protecting downstream irrigation canals from choking."
    }
  },
  {
    id: "CD-019",
    name: "Check Dam Khed-Shivapur",
    type: "Reinforced Concrete Weir",
    basinId: "WB-PUNE-01",
    lat: 18.3650,
    lng: 73.8620,
    status: "Under Construction",
    healthStatus: "In Progress",
    capacity_thousand_liters: 19500,
    current_water_level_pct: 35,
    siltation_pct: 5,
    catchment_area_ha: 220,
    completion_date: "2026-05-30 (Expected)",
    inspection_date: "2026-03-18",
    verified_officer: "Pooja Jadhav, Field Inspector",
    exif_verified: true,
    contractor: "Shree Ganesh Earthmovers",
    storage_increase_pct: 80,
    vegetation_index_ndvi: 0.44,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgL00lyLf7YD3xIR7RZ8bdcs8V_xLIGL3QQUy6BppNfnWM0v3txGBdnu0uZTJ1fAtHQcjkXjxKc9MtKmfO0ghF9eR-NuE5gP8ULvLD0g-8-HFdPN_jZ__LjjY07ZlH0I9d_rH1CZ6wPPpVUGh6C_MRBYK_idyJdzpUf9FRNgQoOWr8oim-Qnnto1x8V5TbH6LcuPDPxW6yjA0X-EFJE_De6Dqkz-ULqDrd8rzz1W3lWI2qyeEsxEQJwQ",
    notes: "Foundation masonry wall completed. Awaiting wing wall curing before monsoon onset.",
    placeInfo: {
      village: "Khed-Shivapur Valley",
      taluka: "Haveli",
      district: "Pune",
      state: "Maharashtra",
      elevation: "625m MSL",
      geomorphology: "Inter-Montane Valley Trough & Fluvial Terraces",
      slope: "9.4%",
      soilType: "Mixed Black & Red Sandy Loam",
      annualRainfall: "760 mm",
      groundwaterRechargeRise: "+1.9m during testing phase",
      beneficiaryVillages: "Khed-Shivapur, Kondhanpur, Shindewadi",
      beneficiaryFarmersCount: 280,
      downstreamBorewells: 15,
      microCatchmentStream: "Shivganga Tributary Creek (Order 2)",
      environmentalBenefit: "Expected to double perennial stream discharge post-monsoon."
    }
  },
  {
    id: "CD-027",
    name: "Parner Drought-Relief Bund #3",
    type: "Cement Nala Bund",
    basinId: "WB-AHMED-03",
    lat: 18.6650,
    lng: 74.4250,
    status: "Siltation Alert",
    healthStatus: "Maintenance Required",
    capacity_thousand_liters: 11000,
    current_water_level_pct: 42,
    siltation_pct: 48,
    catchment_area_ha: 160,
    completion_date: "2023-08-20",
    inspection_date: "2026-02-14",
    verified_officer: "Vikram Gaikwad, BDO Parner",
    exif_verified: true,
    contractor: "Gram Panchayat Works",
    storage_increase_pct: 190,
    vegetation_index_ndvi: 0.41,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr35QzYE-x2YQvkEU32js2T0sdi4083qK6nIsC8-2gKJTvaw33D0xHJUjRlKfYVC_S_q_0uzTR6WY_UyOHRdkrI8ZbEUMZpZbg630_K-2qN8qPIeTcubqbHxXv4RGcdr6UX0PWDR4o5zwEOdOKtkrrtS2EBDwEe8aLZ_qzj2W2hNdBP4ezRoUyXUzwYbOLvAA3AHF56AW8x_kstAfRUMEz4CcEYnYZ_R20CZuit_QgLag5kwDVhGpv0A",
    notes: "High sedimentation detected via Sentinel-2 spectral silt index. Scheduled for community desiltation drive.",
    placeInfo: {
      village: "Parner Plateau (Rain Shadow Zone)",
      taluka: "Parner",
      district: "Ahmednagar",
      state: "Maharashtra",
      elevation: "680m MSL",
      geomorphology: "Arid Basalt Plateau & Extensive Sheet Wash Basin",
      slope: "6.8%",
      soilType: "Shallow Calcareous Black Soil",
      annualRainfall: "510 mm (Drought Prone)",
      groundwaterRechargeRise: "+2.1m (Desiltation Scheduled)",
      beneficiaryVillages: "Parner Rural, Ralegan Shindi, Supe",
      beneficiaryFarmersCount: 410,
      downstreamBorewells: 21,
      microCatchmentStream: "Parner Plateau Contour Overflow Stream (Order 1)",
      environmentalBenefit: "Crucial drinking water security buffer during 5 months of dry season."
    }
  },
  {
    id: "CD-033",
    name: "Wai Highland Water Conservation Weir",
    type: "Masonry Check Dam",
    basinId: "WB-SATARA-02",
    lat: 17.9540,
    lng: 73.9120,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 21000,
    current_water_level_pct: 91,
    siltation_pct: 8,
    catchment_area_ha: 290,
    completion_date: "2024-06-15",
    inspection_date: "2026-03-22",
    verified_officer: "Dr. K. S. Kulkarni (Hydrologist)",
    exif_verified: true,
    contractor: "Western Ghats Ecological Consortium",
    storage_increase_pct: 380,
    vegetation_index_ndvi: 0.76,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB52AdxJ9bDtO2jdI_S3lDMB73Bc_FlN__ymkpbLyK6NcgSJvGYBREnPnb58j_9TkQlaEb3_Vf9BZD5BQtAcXtN2KnIPmM9AjAFZdQ9tDaCXQMnvg61q_LwRjD_YhYJdBC7oi-titi1JNN4HBFm6hFcUTxYiue_cVw1U7Jqmrvs5yJ-U1yyypSygJZ2TGFZSTA49llR7G_4awJXIVydzNwnh21GCoBRXj1uId6EmJJo9mzvreaphTi-7Q",
    notes: "Perennial spring source sustained behind weir. Micro-climate humidity increased by 14%.",
    placeInfo: {
      village: "Wai Highland Catchment",
      taluka: "Wai",
      district: "Satara",
      state: "Maharashtra",
      elevation: "745m MSL",
      geomorphology: "High Altitude Sahyadri Plateau Ridge",
      slope: "14.2%",
      soilType: "Humus-rich Forest Loam & Basaltic Murrum",
      annualRainfall: "1,220 mm",
      groundwaterRechargeRise: "+5.1m in mountain aquifer spring line",
      beneficiaryVillages: "Panchgani Foothills, Dhom Rural, Wai Khurd",
      beneficiaryFarmersCount: 360,
      downstreamBorewells: 24,
      microCatchmentStream: "Krishna Headwater Mountain Creek (Order 1)",
      environmentalBenefit: "Sustained perennial natural spring discharge and elevated valley humidity."
    }
  },
  {
    id: "CD-041",
    name: "Madha Arid Basin Retention Dam",
    type: "Earthen Bund & Spillway",
    basinId: "WB-SOLAPUR-04",
    lat: 18.0650,
    lng: 75.0520,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 17200,
    current_water_level_pct: 54,
    siltation_pct: 15,
    catchment_area_ha: 260,
    completion_date: "2025-01-22",
    inspection_date: "2026-03-10",
    verified_officer: "S. K. More, Executive Engineer",
    exif_verified: true,
    contractor: "Solapur Irrigation Corp",
    storage_increase_pct: 215,
    vegetation_index_ndvi: 0.49,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDr35QzYE-x2YQvkEU32js2T0sdi4083qK6nIsC8-2gKJTvaw33D0xHJUjRlKfYVC_S_q_0uzTR6WY_UyOHRdkrI8ZbEUMZpZbg630_K-2qN8qPIeTcubqbHxXv4RGcdr6UX0PWDR4o5zwEOdOKtkrrtS2EBDwEe8aLZ_qzj2W2hNdBP4ezRoUyXUzwYbOLvAA3AHF56AW8x_kstAfRUMEz4CcEYnYZ_R20CZuit_QgLag5kwDVhGpv0A",
    notes: "Critical drought buffer for 850 marginal farmers during rain shadow dry months.",
    placeInfo: {
      village: "Madha Semi-Arid Basin",
      taluka: "Madha",
      district: "Solapur",
      state: "Maharashtra",
      elevation: "495m MSL",
      geomorphology: "Flat Deccan Vertisol Basin & Sina Valley Plain",
      slope: "4.2%",
      soilType: "Deep Cracking Black Vertisols",
      annualRainfall: "480 mm (High Evaporation)",
      groundwaterRechargeRise: "+3.2m in community borewells",
      beneficiaryVillages: "Madha Central, Kurduwadi, Modnimb",
      beneficiaryFarmersCount: 850,
      downstreamBorewells: 38,
      microCatchmentStream: "Sina River Seasonal Feeder Stream (Order 2)",
      environmentalBenefit: "Critical protective irrigation source for drought-prone sugarcane & jowar crops."
    }
  },
  {
    id: "CD-052",
    name: "Shirur Stream Rejuvenation Check Dam",
    type: "Loose Boulder Structure",
    basinId: "WB-PUNE-01",
    lat: 18.6100,
    lng: 74.1200,
    status: "Active",
    healthStatus: "Optimal",
    capacity_thousand_liters: 8500,
    current_water_level_pct: 72,
    siltation_pct: 14,
    catchment_area_ha: 110,
    completion_date: "2024-09-30",
    inspection_date: "2026-03-15",
    verified_officer: "M. B. Shinde, Tahsildar",
    exif_verified: true,
    contractor: "Youth Watershed Taskforce",
    storage_increase_pct: 185,
    vegetation_index_ndvi: 0.55,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaRYztIajTrq1i7x9U3g8M-BPkQZcKQsM54hud94HrjV7bf_h75m6NweZcGk195Pz4aBDWi2a8vy30odDYfpioKGQawW9AgjkcanrA01eaRg3ntCAFP1TNN0L62wR5-KljqJn55C412QV955rSkiuwmS7k6VhpM_qGA1EyC1txZcyiPMDdCkAEx2mf4Jg178bMAySD8fn_b3PWiGBPij7jx77oTBwZaxTZIyrq9VwsCBqZM3e_jevvlg",
    notes: "Low-cost eco-engineering structure arresting velocity of flash monsoon runoff.",
    placeInfo: {
      village: "Shirur Stream Catchment",
      taluka: "Shirur",
      district: "Pune",
      state: "Maharashtra",
      elevation: "560m MSL",
      geomorphology: "Rolling Basalt Lowlands & Flash Runoff Ravine",
      slope: "8.1%",
      soilType: "Medium Calcareous Loam",
      annualRainfall: "620 mm",
      groundwaterRechargeRise: "+2.8m in village open dug wells",
      beneficiaryVillages: "Shirur Rural, Nighoj, Shikrapur",
      beneficiaryFarmersCount: 290,
      downstreamBorewells: 16,
      microCatchmentStream: "Ghod River Sub-Drainage Channel (Order 2)",
      environmentalBenefit: "Decelerates flash torrents and prevents bank erosion in agricultural plots."
    }
  }
];

export const IOT_TELEMETRY_STATIONS = [
  {
    stationId: "STN-PUNE-01",
    name: "Haveli Groundwater Piezometer #1",
    lat: 18.4950,
    lng: 73.8820,
    type: "Digital Piezometer",
    groundwater_depth_m: 6.8,
    historical_baseline_m: 12.4,
    recharge_rate_cm_day: 1.8,
    battery_pct: 94,
    signal_dbm: -68,
    last_ping: "2 mins ago"
  },
  {
    stationId: "STN-SATARA-02",
    name: "Khandala Rain & Stream Gauge",
    lat: 18.0820,
    lng: 74.0150,
    type: "Automated Weather & Flow Station",
    water_flow_cumecs: 1.4,
    precipitation_last_24h_mm: 0.0,
    soil_moisture_pct: 38.4,
    battery_pct: 89,
    signal_dbm: -74,
    last_ping: "5 mins ago"
  },
  {
    stationId: "STN-AHMED-03",
    name: "Parner Soil Moisture Sensor Array",
    lat: 18.6850,
    lng: 74.3950,
    type: "Soil Moisture Profiler (0-60cm)",
    moisture_top_soil_pct: 22.1,
    moisture_sub_soil_pct: 34.5,
    soil_temperature_c: 27.2,
    battery_pct: 97,
    signal_dbm: -62,
    last_ping: "Just now"
  }
];

export const DISTRICT_PERFORMANCE_METRICS = [
  { district: "Pune", watersheds: 412, area_mha: 14.2, storage_gain_pct: 324, verification_accuracy: 99.6, funds_crores: 128.4, completion_rate: 94.2 },
  { district: "Satara", watersheds: 325, area_mha: 11.8, storage_gain_pct: 342, verification_accuracy: 99.8, funds_crores: 94.6, completion_rate: 96.5 },
  { district: "Ahmednagar", watersheds: 290, area_mha: 10.4, storage_gain_pct: 265, verification_accuracy: 98.9, funds_crores: 88.2, completion_rate: 88.4 },
  { district: "Solapur", watersheds: 245, area_mha: 9.1, storage_gain_pct: 238, verification_accuracy: 99.1, funds_crores: 76.5, completion_rate: 85.1 },
  { district: "Nashik", watersheds: 148, area_mha: 6.5, storage_gain_pct: 295, verification_accuracy: 99.4, funds_crores: 52.8, completion_rate: 91.0 }
];

export const TEMPORAL_SCENARIOS = {
  "may": {
    label: "May 2025 (Pre-Monsoon Arid Baseline)",
    water_spread_index: "0.22",
    avg_soil_moisture: "14%",
    water_color: "#717974",
    water_opacity: 0.35,
    ndvi_mean: 0.28,
    active_water_bodies: "420 ha"
  },
  "jul": {
    label: "July 2025 (Monsoon Onset & Filling)",
    water_spread_index: "0.58",
    avg_soil_moisture: "48%",
    water_color: "#1F7FB8",
    water_opacity: 0.65,
    ndvi_mean: 0.52,
    active_water_bodies: "1,120 ha"
  },
  "aug": {
    label: "August 2025 (Peak Monsoon Water Retention)",
    water_spread_index: "0.92",
    avg_soil_moisture: "68%",
    water_color: "#006495",
    water_opacity: 0.85,
    ndvi_mean: 0.74,
    active_water_bodies: "1,850 ha"
  },
  "oct": {
    label: "October 2025 (Post-Monsoon Sustained Storage)",
    water_spread_index: "0.84",
    avg_soil_moisture: "52%",
    water_color: "#0F3D2E",
    water_opacity: 0.75,
    ndvi_mean: 0.68,
    active_water_bodies: "1,620 ha"
  },
  "jan": {
    label: "January 2026 (Winter Crop Irrigation Buffer)",
    water_spread_index: "0.64",
    avg_soil_moisture: "39%",
    water_color: "#2F7D4F",
    water_opacity: 0.60,
    ndvi_mean: 0.59,
    active_water_bodies: "1,290 ha"
  }
};
