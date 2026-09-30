import pptx
import os
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

COLOR_DARK_RED = RGBColor(151, 56, 53)    # #973835
COLOR_DARK_GREEN = RGBColor(20, 83, 45)   # #14532D
COLOR_DARK_BLUE = RGBColor(30, 58, 138)   # #1E3A8A
COLOR_BLACK = RGBColor(0, 0, 0)           # #000000
COLOR_DARK_BODY = RGBColor(31, 41, 55)    # #1F2937
COLOR_MUTED_GRAY = RGBColor(75, 85, 99)   # #4B5563
COLOR_WHITE = RGBColor(255, 255, 255)     # #FFFFFF

def set_card_text(shape, title, desc=None, title_size=7.5, desc_size=6.5, title_bold=True, desc_bold=False, title_color=COLOR_BLACK, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER, space_before=2):
    if not shape.has_text_frame:
        return
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.04)
    tf.margin_bottom = Inches(0.04)
    tf.clear()
    
    p0 = tf.paragraphs[0]
    p0.text = title
    p0.alignment = align
    if p0.runs:
        r0 = p0.runs[0]
        r0.font.name = "Arial"
        r0.font.size = Pt(title_size)
        r0.font.bold = title_bold
        if title_color:
            r0.font.color.rgb = title_color
            
    if desc:
        p1 = tf.add_paragraph()
        p1.text = desc
        p1.alignment = align
        p1.space_before = Pt(space_before)
        if p1.runs:
            r1 = p1.runs[0]
            r1.font.name = "Arial"
            r1.font.size = Pt(desc_size)
            r1.font.bold = desc_bold
            if desc_color:
                r1.font.color.rgb = desc_color

def set_left_bullet(shape, title, desc, title_size=8.5, desc_size=7.2):
    if not shape.has_text_frame:
        return
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.02)
    tf.margin_right = Inches(0.02)
    tf.margin_top = Inches(0.02)
    tf.margin_bottom = Inches(0.02)
    tf.clear()
    
    p0 = tf.paragraphs[0]
    r0 = p0.add_run()
    r0.text = title + " "
    r0.font.name = "Arial"
    r0.font.size = Pt(title_size)
    r0.font.bold = True
    r0.font.color.rgb = COLOR_DARK_BLUE
    
    r1 = p0.add_run()
    r1.text = desc
    r1.font.name = "Arial"
    r1.font.size = Pt(desc_size)
    r1.font.bold = False
    r1.font.color.rgb = COLOR_DARK_BODY

def update_table_cell(cell, text, size=8.0, bold=False, color=COLOR_DARK_BODY):
    cell.text_frame.word_wrap = True
    cell.text_frame.margin_left = Inches(0.05)
    cell.text_frame.margin_right = Inches(0.05)
    cell.text_frame.margin_top = Inches(0.03)
    cell.text_frame.margin_bottom = Inches(0.03)
    cell.text_frame.clear()
    p = cell.text_frame.paragraphs[0]
    p.text = text
    if p.runs:
        r = p.runs[0]
        r.font.name = "Arial"
        r.font.size = Pt(size)
        r.font.bold = bold
        r.font.color.rgb = color

def generate_deck():
    template_path = "C:/Users/Siddhant/Downloads/AutoGov_SIH_2026_Submission_Updated.pptx"
    out_pptx = "JalDrishti_SIH2026_Presentation_Final.pptx"
    out_pdf = "JalDrishti_SIH2026_Presentation_Final.pdf"
    
    prs = pptx.Presentation(template_path)
    
    # -------------------------------------------------------------------------
    # SLIDE 1: Title Page
    # -------------------------------------------------------------------------
    s1 = prs.slides[0]
    for sh in s1.shapes:
        if sh.name == "TextBox 4":
            tf = sh.text_frame
            tf.word_wrap = True
            tf.clear()
            lines = [
                ("•  Problem Statement ID – ", "SIH26031 / Open Innovation"),
                ("•  Problem Statement Title – ", "JalDrishti: AI-Powered Geospatial Watershed Siting, Siltation Tracking & Anti-Fraud Verification"),
                ("•  Theme – ", "Agriculture, FoodTech & Rural Development / Smart Automation"),
                ("•  PS Category – ", "Software"),
                ("•  Team ID – ", "T133"),
                ("•  Team Name – ", "Innova8")
            ]
            for idx, (label, val) in enumerate(lines):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(6)
                r1 = p.add_run()
                r1.text = label
                r1.font.name = "Arial"
                r1.font.size = Pt(13.5)
                r1.font.bold = True
                r1.font.color.rgb = COLOR_BLACK
                
                r2 = p.add_run()
                r2.text = val
                r2.font.name = "Arial"
                r2.font.size = Pt(13.5)
                r2.font.bold = False
                r2.font.color.rgb = COLOR_DARK_BODY

    # -------------------------------------------------------------------------
    # SLIDE 2: Idea Title & Proposed Solution
    # -------------------------------------------------------------------------
    s2 = prs.slides[1]
    for sh in s2.shapes:
        if sh.name == "TextBox 6":
            set_card_text(sh, "JALDRISHTI", title_size=18, title_bold=True, title_color=COLOR_DARK_RED, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 7":
            set_card_text(sh, "AI-Powered Geospatial Watershed Intelligence & Verification Platform for Water Security", title_size=10, title_bold=False, title_color=COLOR_MUTED_GRAY, align=PP_ALIGN.LEFT)
        elif sh.name == "Rounded Rectangle 8":
            set_card_text(sh, "Our Solution", title_size=11, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
            
        # Left 4 Feature Bullets
        elif sh.name == "TextBox 10":
            set_left_bullet(sh, "Full-Viewport Vector GIS:", "OpenFreeMap sub-meter vector tile hydrology engine mapping micro-catchments & Strahler streams.")
        elif sh.name == "TextBox 12":
            set_left_bullet(sh, "AI Siting Optimizer:", "Automated DEM slope %, catchment ha & runoff yield modeling for 0–100% check-dam suitability.")
        elif sh.name == "TextBox 14":
            set_left_bullet(sh, "Multi-Layer Neural Forensics:", "CMOS optical sensor Bayer noise & EXIF integrity scanner to eliminate ghost infrastructure.")
        elif sh.name == "TextBox 16":
            set_left_bullet(sh, "Live IoT Mesh & Satellite:", "Real-time LoRaWAN/4G telemetry for groundwater & silt alerts + Sentinel-2 5-season NDVI playback.")

        # Comparison Table (Table 17) - 100% JALDRISHTI CONTENT
        elif sh.has_table:
            table = sh.table
            rows_data = [
                ("Problem today", "How our solution fixes it"),
                ("Unscientific Siting: Check-dams placed by guesswork, failing to recharge water", "AI Siting Optimizer: Algorithmic DEM slope %, catchment area & runoff calculation"),
                ("Ghost Infrastructure: Re-used & synthetic photos claim completion funds", "Multi-Layer Neural Forensics: CMOS Bayer noise & EXIF integrity audit flags fake photos"),
                ("30–60 Day Paper Delays: Field reports take months to reach Zilla Parishads", "Sub-Second IoT Telemetry: Real-time 4G/LoRaWAN groundwater depth & silt alerts"),
                ("Unmeasured Impact: Lack of pre/post monsoon vegetation & water spread tracking", "Sentinel-2 Satellite Playback: 5-season multi-spectral NDVI & NDWI analytics")
            ]
            for r_i, (prob, fix) in enumerate(rows_data):
                if r_i == 0:
                    update_table_cell(table.cell(r_i, 0), prob, size=8.5, bold=True, color=COLOR_DARK_RED)
                    update_table_cell(table.cell(r_i, 1), fix, size=8.5, bold=True, color=COLOR_DARK_RED)
                else:
                    update_table_cell(table.cell(r_i, 0), prob, size=7.2, bold=False, color=COLOR_DARK_BODY)
                    update_table_cell(table.cell(r_i, 1), fix, size=7.2, bold=False, color=COLOR_DARK_RED)

        # 5 Process Flow Cards on Bottom
        elif sh.name == "Rounded Rectangle 19":
            set_card_text(sh, "1. Catchment Ingestion", title_size=7.8, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 20":
            set_card_text(sh, "Sub-meter vector basin delineation & Strahler 1st-3rd order stream classification", title_size=6.8, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
            
        elif sh.name == "Rounded Rectangle 22":
            set_card_text(sh, "2. AI Siting Optimization", title_size=7.8, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 23":
            set_card_text(sh, "Algorithmic DEM slope %, drainage convergence & water yield storage calculation", title_size=6.8, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
            
        elif sh.name == "Rounded Rectangle 25":
            set_card_text(sh, "3. Field Evidence Capture", title_size=7.8, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 26":
            set_card_text(sh, "Mobile geo-tagged photo capture with client-side SHA-256 hashing & EXIF verification", title_size=6.8, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
            
        elif sh.name == "Rounded Rectangle 28":
            set_card_text(sh, "4. Neural AI Forensics", title_size=7.8, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 29":
            set_card_text(sh, "CMOS sensor Bayer noise vs diffusion anomaly scan to verify genuine construction", title_size=6.8, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
            
        elif sh.name == "Rounded Rectangle 31":
            set_card_text(sh, "5. Milestone Fund & IoT", title_size=7.8, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 32":
            set_card_text(sh, "Automated cryptographic audit certificate for fund release + continuous LoRaWAN telemetry", title_size=6.8, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)

    # -------------------------------------------------------------------------
    # SLIDE 3: Technical Approach
    # -------------------------------------------------------------------------
    s3 = prs.slides[2]
    for sh in s3.shapes:
        # 8 Left Tech Stack Cards
        if sh.name == "Rounded Rectangle 8":
            set_card_text(sh, "Vanilla JS / HTML5 / Tailwind", "GIS Command Center & Field Web App", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 9":
            set_card_text(sh, "OpenFreeMap / MapLibre GL", "Sub-meter Vector Tile Hydrology Engine", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 10":
            set_card_text(sh, "Leaflet.js & Chart.js", "Interactive GIS Layers & Telemetry Charts", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 11":
            set_card_text(sh, "PyTorch / OpenCV", "CMOS Bayer Noise & Tamper Detection", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 12":
            set_card_text(sh, "DEM Hydro-Solver Engine", "Automated SCS-CN Runoff & Siting Formula", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 13":
            set_card_text(sh, "LoRaWAN & 4G LTE-M", "Solar Micro-RTU Groundwater & Silt Mesh", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 14":
            set_card_text(sh, "Sentinel-2 MSI (ESA)", "5-Season Multi-Spectral NDVI / NDWI", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 15":
            set_card_text(sh, "SHA-256 & EXIF Digest", "Tamper-Proof Audit Certificate Cryptography", title_size=7.5, desc_size=6.5, title_color=COLOR_DARK_RED, desc_color=COLOR_MUTED_GRAY, align=PP_ALIGN.CENTER)

        # Approach 1 (Blue Box)
        elif sh.name == "Rounded Rectangle 17":
            set_card_text(sh, "1   Approach 1 – Vector GIS Hydrology & AI Siting Optimization", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.LEFT)
        elif sh.name == "Rounded Rectangle 18":
            set_card_text(sh, "Catchment Ingestion", "Sub-meter polygon delineation & Strahler 1st-3rd order stream hierarchy classification", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_BLUE, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 19":
            set_card_text(sh, "DEM Slope Gradient", "Automated DEM slope contour calculation (ideal 3%-12% for masonry check-dams)", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_BLUE, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 20":
            set_card_text(sh, "SCS-CN Runoff Model", "Estimates potential maximum soil water retention and seasonal runoff yield volume", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_BLUE, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 21":
            set_card_text(sh, "Algorithmic Verdict", "Instant 0-100% suitability score + recommended hydraulic structure & capacity", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_BLUE, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)

        # Approach 2 (Green Box)
        elif sh.name == "Rounded Rectangle 23":
            set_card_text(sh, "2   Approach 2 – Multi-Layer Neural AI Forensics & IoT Telemetry Mesh", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.LEFT)
        elif sh.name == "Rounded Rectangle 24":
            set_card_text(sh, "Optical Noise Check", "Evaluates high-frequency CMOS photon noise variance to distinguish real cameras from AI", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_GREEN, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 25":
            set_card_text(sh, "EXIF Cryptography", "Verifies GPS coordinates, timestamp integrity, and camera hardware lens signatures", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_GREEN, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 26":
            set_card_text(sh, "LoRaWAN Sensor Mesh", "Solar Micro-RTU probes deliver continuous groundwater depth, siltation %, and soil moisture", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_GREEN, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 27":
            set_card_text(sh, "Satellite Playback", "Multi-spectral 5-season timeline tracking NDVI biomass gain and NDWI water spread", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_GREEN, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)

        # Final Output (Brown Box)
        elif sh.name == "Rounded Rectangle 29":
            set_card_text(sh, "Final Output: GIS Command Cockpit", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 30":
            set_card_text(sh, "Suitability Score (0–100%)", "Algorithmic rating based on slope, drainage convergence & soil permeability.", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 31":
            set_card_text(sh, "Cryptographic Certificate", "SHA-256 hashed compliance report with GPS coordinates & inspection timestamps.", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 32":
            set_card_text(sh, "5-Season Temporal Slider", "5-season comparison (May drought baseline to Oct peak recharge) tracking NDVI.", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 33":
            set_card_text(sh, "Automated Siltation Alerts", "Ultrasonic sensor threshold (>25% silt) triggers proactive desilting work orders.", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 34":
            set_card_text(sh, "Public Village Dossier", "Gram Panchayat transparency dossier with contractor details & water table rise.", title_size=7.2, desc_size=6.2, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)

    # -------------------------------------------------------------------------
    # SLIDE 4: Feasibility and Viability
    # -------------------------------------------------------------------------
    s4 = prs.slides[3]
    for sh in s4.shapes:
        if sh.name == "TextBox 7":
            set_card_text(sh, "A production-ready, lightweight geospatial intelligence platform designed for immediate deployment in rural watersheds.", title_size=9.2, title_bold=True, title_color=COLOR_DARK_GREEN, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 8":
            set_card_text(sh, "Technically feasible, low-bandwidth architecture operating at < ₹2,500/structure/year with offline-ready field sync.", title_size=8.8, title_bold=False, title_color=COLOR_MUTED_GRAY, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 11":
            tf = sh.text_frame
            tf.word_wrap = True
            tf.clear()
            f_bullets = [
                ("• Zero-Download Web SPA: ", "Runs smoothly on budget Android smartphones and desktop browsers without native app installations."),
                ("• Low-Bandwidth Edge Capability: ", "Sub-50KB JSON payloads and vector tile caching ensure instant map rendering even on 2G/3G networks."),
                ("• Offline-Resilient Field Logging: ", "Field evidence photos and GPS coordinates store in IndexedDB local cache, syncing automatically when online."),
                ("• Open Standards & Modularity: ", "GeoJSON and WMS/WFS compatible with ISRO Bhuvan, CGWB, and National Watershed repositories.")
            ]
            for idx, (head, body) in enumerate(f_bullets):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = head
                r1.font.name = "Arial"
                r1.font.size = Pt(8.5)
                r1.font.bold = True
                r1.font.color.rgb = COLOR_DARK_BLUE
                
                r2 = p.add_run()
                r2.text = body
                r2.font.name = "Arial"
                r2.font.size = Pt(7.8)
                r2.font.bold = False
                r2.font.color.rgb = COLOR_DARK_BODY

        # 4 Risk / Fix pairs
        elif sh.name == "Rounded Rectangle 14":
            set_card_text(sh, "Risk: Valley cellular dead-zones", title_size=7.5, title_bold=True, title_color=COLOR_DARK_RED, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 15":
            set_card_text(sh, "Fix: Dual-hop LoRaWAN mesh relay nodes transmit telemetry to solar gateway.", title_size=6.8, title_bold=False, title_color=COLOR_DARK_GREEN, align=PP_ALIGN.LEFT)
            
        elif sh.name == "Rounded Rectangle 16":
            set_card_text(sh, "Risk: Camera lens dust / smudge", title_size=7.5, title_bold=True, title_color=COLOR_DARK_RED, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 17":
            set_card_text(sh, "Fix: Multi-point Bayer residual variance filtering & EXIF digest cross-validation.", title_size=6.8, title_bold=False, title_color=COLOR_DARK_GREEN, align=PP_ALIGN.LEFT)
            
        elif sh.name == "Rounded Rectangle 18":
            set_card_text(sh, "Risk: Dam siltation capacity loss", title_size=7.5, title_bold=True, title_color=COLOR_DARK_RED, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 19":
            set_card_text(sh, "Fix: Ultrasonic silt profilers trigger automated desiltation work orders at >25% silt.", title_size=6.8, title_bold=False, title_color=COLOR_DARK_GREEN, align=PP_ALIGN.LEFT)
            
        elif sh.name == "Rounded Rectangle 20":
            set_card_text(sh, "Risk: Field contractor adoption", title_size=7.5, title_bold=True, title_color=COLOR_DARK_RED, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 21":
            set_card_text(sh, "Fix: Intuitive mobile PWA with instant digital milestone clearance accelerates payments.", title_size=6.8, title_bold=False, title_color=COLOR_DARK_GREEN, align=PP_ALIGN.LEFT)

        # 5 Implementation ROI boxes on Right
        elif sh.name == "TextBox 25":
            set_card_text(sh, "Drastic Cost Reduction:", "Drops monitoring cost from ₹20,000 (manual travel & paper audits) to ₹2,500/structure/year (~82% savings).", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 27":
            set_card_text(sh, "Immediate Deployability:", "Zero-server setup with static web client and serverless microservices deployable on State Data Centers (SDC).", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 29":
            set_card_text(sh, "Frictionless Adoption:", "Mobile PWA requires zero officer training; plain-language site dossiers with interactive GIS visuals.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 31":
            set_card_text(sh, "Statutory Admissibility:", "Cryptographic SHA-256 digital certificates admissible under PMKSY, MGNREGA, and state audit rules.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)
        elif sh.name == "TextBox 33":
            set_card_text(sh, "Real-Time Telemetry:", "Zilla Parishad & Ministerial dashboard offers live tracking of groundwater rise, silt alerts, and drought vulnerability.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

    # -------------------------------------------------------------------------
    # SLIDE 5: Impact and Benefits
    # -------------------------------------------------------------------------
    s5 = prs.slides[4]
    for sh in s5.shapes:
        # 5 Impact Flow Steps
        if sh.name == "Rounded Rectangle 8":
            set_card_text(sh, "1. GEOSPATIAL PLANNING", "Vector GIS delineates micro-catchments & calculates Strahler stream drainage hierarchies.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 9":
            set_card_text(sh, "2. AI SITING OPTIMIZATION", "DEM slope & runoff convergence algorithm scores optimal check-dam coordinates (0–100%).", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 10":
            set_card_text(sh, "3. FORENSIC EVIDENCE", "Mobile photo capture with CMOS Bayer sensor pattern verification & SHA-256 hashing.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 11":
            set_card_text(sh, "4. MILESTONE CLEARANCE", "Verified cryptographic audit certificate triggers transparent public fund disbursement.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)
        elif sh.name == "Rounded Rectangle 12":
            set_card_text(sh, "5. CONTINUOUS IMPACT", "LoRaWAN sensors & Sentinel-2 satellite track groundwater recharge & +144% farmer income.", title_size=7.8, desc_size=6.8, title_bold=True, title_color=COLOR_DARK_RED, desc_color=COLOR_DARK_BODY, align=PP_ALIGN.CENTER)

        # 5 Benefit Pillar Titles & Descriptions
        elif sh.name == "Rounded Rectangle 15":
            set_card_text(sh, "Target Beneficiaries", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 16":
            set_card_text(sh, "• 250–500 small & marginal farming families per micro-watershed cluster\n• State Water Resources Depts, Zilla Parishads, CSR Foundations & Gram Panchayats", title_size=7.2, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

        elif sh.name == "Rounded Rectangle 18":
            set_card_text(sh, "Hydrological Impact", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 19":
            set_card_text(sh, "• +210% to +340% increase in water retention capacity; prevents flash-flood erosion in valleys\n• +2.4m to +4.2m water table elevation in downstream wells, sustaining borewells through summer", title_size=7.2, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

        elif sh.name == "Rounded Rectangle 21":
            set_card_text(sh, "Socio-Economic Impact", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 22":
            set_card_text(sh, "• Guarantees dual-crop (Kharif + Rabi) cycles, ending distress seasonal migration\n• +144% farmer income growth: average annual income rises from ₹58,000 to ₹1,42,000", title_size=7.2, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

        elif sh.name == "Rounded Rectangle 24":
            set_card_text(sh, "Governance Impact", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 25":
            set_card_text(sh, "• 100% elimination of ghost infrastructure fraud by linking payments to cryptographic AI certificates\n• Slashes administrative verification expenditure by 82% (from ₹20,000 to ₹2,500/year)", title_size=7.2, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

        elif sh.name == "Rounded Rectangle 27":
            set_card_text(sh, "Environmental Impact", title_size=8.5, title_bold=True, title_color=COLOR_WHITE, align=PP_ALIGN.CENTER)
        elif sh.name == "TextBox 28":
            set_card_text(sh, "• Arrests 180+ tons of topsoil erosion per dam/season; cools micro-climate by 1.5°C–2.0°C\n• +0.28 NDVI green cover expansion supports biodiversity and soil organic carbon replenishment", title_size=7.2, title_bold=False, title_color=COLOR_DARK_BODY, align=PP_ALIGN.LEFT)

        elif sh.name == "Rounded Rectangle 29":
            tf = sh.text_frame
            tf.word_wrap = True
            tf.clear()
            p0 = tf.paragraphs[0]
            p0.text = "JALDRISHTI GOVERNANCE VISION"
            p0.alignment = PP_ALIGN.CENTER
            r0 = p0.runs[0]
            r0.font.name = "Arial"
            r0.font.size = Pt(10.0)
            r0.font.bold = True
            r0.font.color.rgb = COLOR_DARK_RED
            
            p1 = tf.add_paragraph()
            p1.text = "\"A high-precision, tamper-proof, and explainable geospatial intelligence infrastructure ensuring every drop of rain is captured and every rupee of water conservation funds delivers verified ground truth.\""
            p1.space_before = Pt(6)
            p1.space_after = Pt(8)
            p1.alignment = PP_ALIGN.CENTER
            r1 = p1.runs[0]
            r1.font.name = "Arial"
            r1.font.size = Pt(8.0)
            r1.font.italic = True
            r1.font.color.rgb = COLOR_DARK_BLUE
            
            metrics = [
                ("✓ +340% Water Retention", "Peak monsoon volume capture"),
                ("✓ +3.5m Aquifer Rise", "Groundwater table elevation"),
                ("✓ +144% Farmer Income", "From ₹58,000 to ₹1,42,000/yr"),
                ("✓ 82% Audit Cost Reduction", "Automating manual audits")
            ]
            for m_head, m_sub in metrics:
                p = tf.add_paragraph()
                p.space_before = Pt(2)
                p.alignment = PP_ALIGN.CENTER
                rm = p.add_run()
                rm.text = m_head + "  "
                rm.font.name = "Arial"
                rm.font.size = Pt(8.5)
                rm.font.bold = True
                rm.font.color.rgb = COLOR_DARK_GREEN
                
                rs = p.add_run()
                rs.text = f"({m_sub})"
                rs.font.name = "Arial"
                rs.font.size = Pt(7.2)
                rs.font.color.rgb = COLOR_MUTED_GRAY

    # -------------------------------------------------------------------------
    # SLIDE 6: Research and References
    # -------------------------------------------------------------------------
    s6 = prs.slides[5]
    for sh in s6.shapes:
        if sh.name == "TextBox 7":
            tf = sh.text_frame
            tf.word_wrap = True
            tf.clear()
            
            sections = [
                ("1. Statutory Standards & Water Policy Frameworks", [
                    ("•  Central Ground Water Board (CGWB), Ministry of Jal Shakti: ", "Master Plan for Artificial Recharge to Ground Water in India (2020 Guidelines)."),
                    ("•  Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - WDC): ", "Statutory guidelines for Geo-tagging and digital asset verification."),
                    ("•  Mission Amrit Sarovar & Jal Jeevan Mission: ", "National geospatial frameworks for rejuvenation of 50,000+ water bodies and rural water security."),
                    ("•  Food and Agriculture Organization (FAO): ", "Watershed Management Field Manual – Soil & Water Conservation Structures (FAO Guide 13/3).")
                ]),
                ("2. Hydrological Modeling, Geospatial Cartography & Remote Sensing", [
                    ("•  USDA-NRCS: ", "Soil Conservation Service Curve Number (SCS-CN) Hydrological Runoff Modeling Methodology."),
                    ("•  Strahler, A. N. (1957): ", "Quantitative Analysis of Watershed Geomorphology — Stream hierarchy classification for erosion control."),
                    ("•  European Space Agency (ESA Copernicus): ", "Sentinel-2 MSI Multi-Spectral Instrument (10m Level-2A Surface Reflectance: NDVI & NDWI)."),
                    ("•  ISRO & NRSC: ", "National Watershed Atlas & Bhuvan Geospatial Hydrology Protocols."),
                    ("•  OpenFreeMap Project: ", "Open-source Vector Tile Topographical Schemas and MapLibre GL Cartography Engine.")
                ]),
                ("3. Computer Vision Forensics, Sensor Pattern Noise & Cryptography", [
                    ("•  Lukas et al. (IEEE TIFS): ", "Digital Camera Sensor Identification Using CMOS Photo-Response Non-Uniformity (PRNU) & Bayer Noise."),
                    ("•  Corvi et al. (IEEE CVPR): ", "On the Detection of Synthetic Diffusion Images Using High-Frequency Residual & Optical Edge Analysis."),
                    ("•  NIST FIPS 180-4: ", "Secure Hash Standard (SHA-256) for Tamper-Proof Electronic Evidence Certification."),
                    ("•  LoRa Alliance: ", "LoRaWAN Link Layer Specification v1.0.4 for Long-Range Rural Micro-RTU Sensor Mesh Networks.")
                ])
            ]
            
            for s_idx, (sec_title, items) in enumerate(sections):
                p_head = tf.paragraphs[0] if s_idx == 0 else tf.add_paragraph()
                p_head.space_before = Pt(4) if s_idx > 0 else Pt(0)
                p_head.space_after = Pt(2)
                r_head = p_head.add_run()
                r_head.text = sec_title
                r_head.font.name = "Arial"
                r_head.font.size = Pt(11.0)
                r_head.font.bold = True
                r_head.font.color.rgb = COLOR_DARK_RED
                
                for prefix, body in items:
                    p = tf.add_paragraph()
                    p.space_after = Pt(1.5)
                    r1 = p.add_run()
                    r1.text = prefix
                    r1.font.name = "Arial"
                    r1.font.size = Pt(9.5)
                    r1.font.bold = True
                    r1.font.color.rgb = COLOR_BLACK
                    
                    r2 = p.add_run()
                    r2.text = body
                    r2.font.name = "Arial"
                    r2.font.size = Pt(9.2)
                    r2.font.bold = False
                    r2.font.color.rgb = COLOR_DARK_BODY

    prs.save(out_pptx)
    print(f"Successfully generated clean {out_pptx}!")
    
    # Export to PDF and re-export PNGs for visual inspection
    try:
        import comtypes.client
        powerpoint = comtypes.client.CreateObject('PowerPoint.Application')
        in_p = os.path.abspath(out_pptx)
        out_p = os.path.abspath(out_pdf)
        deck = powerpoint.Presentations.Open(in_p, WithWindow=False)
        deck.SaveAs(out_p, 32) # PDF
        out_dir = os.path.abspath('slide_images')
        deck.SaveAs(out_dir, 18) # PNG
        deck.Close()
        powerpoint.Quit()
        print(f"Successfully exported {out_pdf} and slide images!")
    except Exception as e:
        print("Export notice:", e)

if __name__ == "__main__":
    generate_deck()
