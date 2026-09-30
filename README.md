# 🌊 JalDrishti (जलदृष्टि): Geospatial Watershed Intelligence Platform

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/12karthikpra-dev/JalDhristi)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade, browser-native AI & Geospatial surveillance platform designed for monitoring, planning, and verifying water conservation assets (check-dams, percolation tanks, continuous contour trenches, and farm ponds).

---

## 🌟 Key Features

1. **Interactive Full-Screen GIS Explorer:**
   - Powered by Leaflet & OpenFreeMap (`tiles.openfreemap.org`) vector tile provider with instant basemap switching (Liberty, Bright, Positron, Satellite, Topo).
   - Dynamic GeoJSON catchment polygons, Strahler drainage networks, and IoT station pins.

2. **AI Check-Dam Siting Optimizer:**
   - Real-time slope gradient and catchment runoff area calculations on any clicked terrain coordinate to compute suitability scores ($0\% - 100\%$) and structural recommendations.

3. **Field Evidence AI Forensics Engine:**
   - CMOS Bayer pattern optical sensor verification vs. neural diffusion smoothing anomaly detection to prevent fraud and false fund disbursements.

4. **Place Intelligence & Geo-Dossiers:**
   - Hyper-local village, elevation, geomorphology, soil profile, annual rainfall, aquifer rise, and beneficiary farmer impact profiles.
   - 1-click smooth `flyTo` camera animation with pulsating map focus rings.

5. **5-Season Multi-Spectral Satellite Playback:**
   - Pre- and post-monsoon NDVI & NDWI vegetation growth and surface water retention indices.

6. **Complete Pitch Deck / Presentation Guide:**
   - Read [`content.md`](content.md) for the complete 21-slide PPT-ready presentation deck.

---

## 🚀 Instant Deployment on Render

### Method 1: One-Click Deploy
Click the badge below to deploy directly to your Render account:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/12karthikpra-dev/JalDhristi)

### Method 2: Manual Dashboard Setup (100% Free)
1. Sign in to [Render.com](https://dashboard.render.com/).
2. Click **New +** $\rightarrow$ **Static Site**.
3. Connect your GitHub repository: `https://github.com/12karthikpra-dev/JalDhristi`.
4. Configure the settings:
   - **Name:** `jaldrishti-watershed` (or your choice)
   - **Branch:** `main`
   - **Build Command:** *(leave empty)*
   - **Publish Directory:** `.` *(a single dot)*
5. Click **Create Static Site**.
6. Render will build and deploy your site in ~10 seconds with a free `.onrender.com` HTTPS URL!

---

## 🛠️ Local Development & Testing

Run a local HTTP server in the repository root:
```bash
# Python 3
python -m http.server 8080

# Or Node.js npx
npx serve .
```
Open `http://localhost:8080` in your browser.

---

## 📄 License
MIT License. Built for public water resource governance and environmental resilience.
