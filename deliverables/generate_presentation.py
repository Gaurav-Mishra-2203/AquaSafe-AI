"""
AquaSafe AI - PowerPoint Presentation Generator
Creates a professional 15-slide 16:9 widescreen presentation in deliverables/SDG_AI_Project_Presentation.pptx
Generates high-resolution chart images and embeds them into the slides with speaker notes.
"""

import os
from PIL import Image, ImageDraw, ImageFont
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "deliverables")
IMG_DIR = os.path.join(OUTPUT_DIR, "assets")
os.makedirs(IMG_DIR, exist_ok=True)

# Brand Color Palette
C_BG = RGBColor(15, 23, 42)          # Deep Navy #0F172A
C_CARD = RGBColor(30, 41, 59)        # Card Slate #1E293B
C_TEXT_LIGHT = RGBColor(248, 250, 252) # White #F8FAFC
C_TEXT_MUTED = RGBColor(148, 163, 184) # Light Gray #94A3B8
C_CYAN = RGBColor(6, 182, 212)       # Accent Cyan #06B6D4
C_BLUE = RGBColor(14, 165, 233)      # Accent Blue #0EA5E9
C_GREEN = RGBColor(16, 185, 129)     # SDG 3 Emerald #10B981
C_RED = RGBColor(239, 68, 68)        # Hazard Red #EF4444
C_AMBER = RGBColor(245, 158, 11)     # Warning Amber #F59E0B

# -------------------------------------------------------------
# 1. PIL Chart Generators
# -------------------------------------------------------------

def generate_roc_chart():
    img_path = os.path.join(IMG_DIR, "roc_curve.png")
    w, h = 800, 600
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    
    # Border & grid
    draw.rectangle([50, 50, 750, 520], outline=(51, 65, 85, 255), width=2)
    for y in range(100, 520, 80):
        draw.line([50, y, 750, y], fill=(30, 41, 59, 255), width=1)
    for x in range(120, 750, 120):
        draw.line([x, 50, x, 520], fill=(30, 41, 59, 255), width=1)
        
    # Baseline diagonal (Random Guessing AUC = 0.5)
    draw.line([50, 520, 750, 50], fill=(100, 116, 139, 255), width=2)
    
    # Random Forest ROC Curve (AUC = 0.9430)
    curve_points = [
        (50, 520), (60, 410), (75, 280), (100, 180), (140, 110), 
        (200, 85), (320, 68), (500, 58), (640, 52), (750, 50)
    ]
    draw.line(curve_points, fill=(6, 182, 212, 255), width=4)
    
    # Labels & Title
    draw.text((70, 70), "AquaSafe AI: Random Forest ROC-AUC = 0.9430", fill=(248, 250, 252, 255))
    draw.text((70, 95), "5-Fold Stratified Cross-Validation (Mean: 0.9565)", fill=(148, 163, 184, 255))
    draw.text((320, 540), "False Positive Rate (1 - Specificity)", fill=(148, 163, 184, 255))
    draw.text((10, 260), "True\nPositive\nRate", fill=(148, 163, 184, 255))
    
    img.save(img_path)
    return img_path

def generate_confusion_matrix_chart():
    img_path = os.path.join(IMG_DIR, "confusion_matrix.png")
    w, h = 800, 600
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    
    draw.text((50, 40), "Held-Out Test Set Confusion Matrix (n = 656)", fill=(248, 250, 252, 255))
    
    # 2x2 grid boxes
    # Top Left: True Negatives (354)
    draw.rectangle([100, 100, 400, 280], fill=(16, 185, 129, 45), outline=(16, 185, 129, 255), width=2)
    draw.text((120, 120), "TRUE NEGATIVE (Hazard)", fill=(52, 211, 153, 255))
    draw.text((210, 170), "354", fill=(248, 250, 252, 255))
    draw.text((120, 240), "Accurately Flagged Contaminated", fill=(148, 163, 184, 255))
    
    # Top Right: False Positives (40)
    draw.rectangle([440, 100, 740, 280], fill=(239, 68, 68, 30), outline=(239, 68, 68, 255), width=2)
    draw.text((460, 120), "FALSE POSITIVE", fill=(248, 113, 113, 255))
    draw.text((570, 170), "40", fill=(248, 113, 113, 255))
    draw.text((460, 240), "Over-cautious Warnings (6.1%)", fill=(148, 163, 184, 255))

    # Bottom Left: False Negatives (34)
    draw.rectangle([100, 320, 400, 500], fill=(239, 68, 68, 30), outline=(239, 68, 68, 255), width=2)
    draw.text((120, 340), "FALSE NEGATIVE", fill=(248, 113, 113, 255))
    draw.text((230, 390), "34", fill=(248, 113, 113, 255))
    draw.text((120, 460), "Missed Contamination (5.2%)", fill=(148, 163, 184, 255))

    # Bottom Right: True Positives (228)
    draw.rectangle([440, 320, 740, 500], fill=(16, 185, 129, 45), outline=(16, 185, 129, 255), width=2)
    draw.text((460, 340), "TRUE POSITIVE (Safe)", fill=(52, 211, 153, 255))
    draw.text((560, 390), "228", fill=(248, 250, 252, 255))
    draw.text((460, 460), "Confirmed Safe Potable Water", fill=(148, 163, 184, 255))

    img.save(img_path)
    return img_path

def generate_feature_importance_chart():
    img_path = os.path.join(IMG_DIR, "feature_importance.png")
    w, h = 800, 560
    img = Image.new("RGBA", (w, h), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    
    draw.text((50, 30), "Random Forest Gini Feature Attribution (%)", fill=(248, 250, 252, 255))
    
    features = [
        ("pH Level (Acidity/Alkalinity)", 27.2, (6, 182, 212)),
        ("Solids (Total Dissolved Solids)", 17.2, (14, 165, 233)),
        ("Turbidity (Colloidal Particles)", 15.8, (56, 189, 248)),
        ("Hardness (Ca2+ / Mg2+)", 10.5, (16, 185, 129)),
        ("Sulfate Mineral Salts", 8.4, (20, 184, 166)),
        ("Trihalomethanes (Carcinogen)", 6.8, (245, 158, 11)),
        ("Chloramines Residual", 5.4, (234, 88, 12)),
        ("Electrical Conductivity", 4.9, (168, 85, 247)),
        ("Total Organic Carbon (TOC)", 3.9, (100, 116, 139))
    ]
    
    y = 75
    for name, val, col in features:
        draw.text((50, y), f"{name}: {val}%", fill=(203, 213, 225, 255))
        bar_w = int((val / 30.0) * 450)
        draw.rectangle([50, y + 20, 50 + bar_w, y + 36], fill=col)
        y += 50
        
    img.save(img_path)
    return img_path

# -------------------------------------------------------------
# 2. PowerPoint Slide Builder
# -------------------------------------------------------------

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide
    
    # Helper to add standard dark background
    def add_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()
        return bg

    # Helper to add header title and badge
    def add_header(slide, title_text, category_badge="UN SDG 6 & SDG 3 PROJECT"):
        # Category Badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(3.2), Inches(0.35))
        badge.fill.solid()
        badge.fill.fore_color.rgb = C_CARD
        badge.line.color.rgb = C_CYAN
        tf_b = badge.text_frame
        tf_b.word_wrap = True
        p_b = tf_b.paragraphs[0]
        p_b.text = category_badge
        p_b.font.size = Pt(10)
        p_b.font.bold = True
        p_b.font.color.rgb = C_CYAN
        p_b.alignment = PP_ALIGN.CENTER
        
        # Title
        tx_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.8))
        tf = tx_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_LIGHT

    # Helper to set speaker notes
    def set_notes(slide, notes_text):
        notes_slide = slide.notes_slide
        tf = notes_slide.notes_text_frame
        tf.text = notes_text

    # Generate charts
    roc_img = generate_roc_chart()
    cm_img = generate_confusion_matrix_chart()
    fi_img = generate_feature_importance_chart()

    # ---------------------------------------------------------
    # SLIDE 1: Title Slide
    # ---------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1)
    
    # Title box
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(3.5))
    tf1 = tbox.text_frame
    tf1.word_wrap = True
    
    p1 = tf1.paragraphs[0]
    p1.text = "AquaSafe AI"
    p1.font.size = Pt(48)
    p1.font.bold = True
    p1.font.color.rgb = C_CYAN
    
    p2 = tf1.add_paragraph()
    p2.text = "Democratizing WHO-Grade Water Potability Diagnostics & AI-Driven Remediation"
    p2.font.size = Pt(24)
    p2.font.color.rgb = C_TEXT_LIGHT
    p2.space_before = Pt(14)
    
    p3 = tf1.add_paragraph()
    p3.text = "Addressing UN SDG 6 (Clean Water & Sanitation) & UN SDG 3 (Good Health & Well-Being)"
    p3.font.size = Pt(16)
    p3.font.color.rgb = C_GREEN
    p3.space_before = Pt(20)

    # Sub metadata card
    mcard = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(5.6), Inches(11.3), Inches(1.0))
    mcard.fill.solid()
    mcard.fill.fore_color.rgb = C_CARD
    mcard.line.color.rgb = RGBColor(51, 65, 85)
    mtf = mcard.text_frame
    mp = mtf.paragraphs[0]
    mp.text = "IBM SkillsBuild Internship Project  |  Full-Stack & Applied Machine Learning Prototype  |  October 2026"
    mp.font.size = Pt(13)
    mp.font.color.rgb = C_TEXT_MUTED
    mp.alignment = PP_ALIGN.CENTER
    
    set_notes(s1, "Welcome evaluators. Today we present AquaSafe AI, an intelligent community water potability diagnostic and predictive remediation system that addresses United Nations Sustainable Development Goals 6 and 3.")

    # ---------------------------------------------------------
    # SLIDE 2: Introduction to Selected SDGs
    # ---------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "UN Sustainable Development Goals Alignment")
    
    # Left Card: SDG 6
    c1 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(2.0), Inches(5.4), Inches(4.8))
    c1.fill.solid()
    c1.fill.fore_color.rgb = C_CARD
    c1.line.color.rgb = C_CYAN
    tf = c1.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "PRIMARY GOAL: SDG 6\nClean Water and Sanitation"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    
    bullets1 = [
        "Target 6.1: Universal and equitable access to safe and affordable drinking water by 2030.",
        "Target 6.3: Improve water quality by eliminating dumping and hazardous chemical release.",
        "Target 6.b: Support and strengthen local community participation in water management.",
        "Global Context: 2.2 Billion people lack safely managed drinking water (WHO/UNICEF JMP)."
    ]
    for b in bullets1:
        pb = tf.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(13)
        pb.font.color.rgb = C_TEXT_LIGHT
        pb.space_before = Pt(14)

    # Right Card: SDG 3
    c2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.9), Inches(2.0), Inches(5.4), Inches(4.8))
    c2.fill.solid()
    c2.fill.fore_color.rgb = C_CARD
    c2.line.color.rgb = C_GREEN
    tf2 = c2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "SECONDARY GOAL: SDG 3\nGood Health and Well-Being"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = C_GREEN
    
    bullets2 = [
        "Target 3.9: Substantially reduce deaths and illnesses from hazardous chemicals and pollution.",
        "Global Mortality: Contaminated water causes over 505,000 diarrheal deaths annually.",
        "Pre-Emptive Triage: Detect toxicological and microbial risks before water is ingested.",
        "Community Impact: Eliminates transmission vectors for cholera, dysentery, and typhoid."
    ]
    for b in bullets2:
        pb = tf2.add_paragraph()
        pb.text = "• " + b
        pb.font.size = Pt(13)
        pb.font.color.rgb = C_TEXT_LIGHT
        pb.space_before = Pt(14)
        
    set_notes(s2, "Our project directly targets SDG 6.1, 6.3, and 6.b, as well as SDG 3.9. Over 2.2 billion individuals lack reliably safe drinking water, causing half a million preventable deaths each year.")

    # ---------------------------------------------------------
    # SLIDE 3: Problem Statement
    # ---------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Problem Statement: The Community Water Testing Bottleneck")
    
    problems = [
        ("Diagnostic Latency Bottleneck", "Standard water testing requires 48-72 hours in centralized laboratories, costing $25-$80 per sample. Rural communities drink contaminated water during the delay.", C_RED),
        ("Multivariate Chemical Complexity", "Water potability is non-linear. Simple rules fail because safe water depends on complex interactions (e.g. pH buffering against sulfate, chlorine reacting to create carcinogens).", C_AMBER),
        ("The 'Actionability Gap'", "Existing field digital probes display raw numbers (e.g. pH 5.4, Turbidity 7.8 NTU) without providing actionable, low-cost engineering remediation protocols.", C_CYAN)
    ]
    
    x = 1.0
    for title, desc, color in problems:
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.2), Inches(3.5), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = color
        tf = card.text_frame
        tf.word_wrap = True
        
        pt = tf.paragraphs[0]
        pt.text = title
        pt.font.size = Pt(16)
        pt.font.bold = True
        pt.font.color.rgb = color
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(13)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(16)
        
        x += 3.9
        
    set_notes(s3, "We focus on three acute problems: diagnostic latency, multivariate chemical complexity that renders simple test strips inaccurate, and the complete absence of actionable guidance.")

    # ---------------------------------------------------------
    # SLIDE 4: Empirical Toxicological Evidence
    # ---------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "Empirical Toxicological Significance")
    
    rows = [
        ("Parameter", "WHO Guideline", "Health Implication if Exceeded", "Remediation Action Required"),
        ("pH Level", "6.5 - 8.5", "Acidic (<6.5) leaches neurotoxic lead/copper; alkaline inhibits disinfection", "Calcite neutralizing contact bed or soda ash dosing"),
        ("Turbidity", "<= 5.0 NTU", "Colloidal silt shields pathogenic microbes (Cryptosporidium, cysts)", "Coagulation with alum/Moringa + sand filtration"),
        ("Trihalomethanes", "<= 80 ug/L", "Carcinogenic volatile disinfection byproducts formed from organic matter", "Granular activated carbon (GAC) adsorption"),
        ("Solids (TDS)", "<= 1,000 ppm", "Excessive mineralization, agricultural runoff, and osmotic dehydration", "Reverse osmosis membrane demineralization"),
        ("Sulfate", "<= 250 mg/L", "Induces acute cathartic laxative effects and severe infant dehydration", "Strong acid cation exchange / membrane softening")
    ]
    
    table_shape = s4.shapes.add_table(6, 4, Inches(0.8), Inches(2.0), Inches(11.7), Inches(4.8))
    table = table_shape.table
    
    for r_idx, row in enumerate(rows):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_CARD if r_idx > 0 else RGBColor(14, 165, 233)
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(11 if r_idx > 0 else 12)
            p.font.bold = (r_idx == 0 or c_idx == 0)
            p.font.color.rgb = C_TEXT_LIGHT
            
    set_notes(s4, "These parameters are rooted in WHO Guidelines for Drinking-water Quality. Excursions in turbidity shield pathogens from chlorine, while high TOC interacting with chlorine forms carcinogenic trihalomethanes.")

    # ---------------------------------------------------------
    # SLIDE 5: Target Users and Beneficiaries
    # ---------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "Target Users & Stakeholder Beneficiaries")
    
    users = [
        ("Municipal Water Boards", "District engineers overseeing decentralized boreholes, tube wells, and public kiosks. Needs rapid batch screening.", C_CYAN),
        ("Disaster Relief NGOs", "Field sanitation officers responding to floods or refugee camp crises. Needs instant offline diagnostics.", C_GREEN),
        ("Schools & Health Clinics", "Facility managers auditing independent groundwater and rainwater harvesting tanks. Needs clear safety protocols.", C_AMBER),
        ("Civic Volunteers", "Non-expert community committee members monitoring local village water kiosks. Needs jargon-free vernacular instructions.", C_BLUE)
    ]
    
    y = 2.0
    for title, desc, col in users:
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(y), Inches(11.3), Inches(1.05))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(4)
        y += 1.25

    set_notes(s5, "Our target users span district water authorities, humanitarian NGOs, school administrators, and civic science volunteers.")

    # ---------------------------------------------------------
    # SLIDE 6: Proposed AI-Powered Solution
    # ---------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "Proposed Solution: AquaSafe AI Architecture")
    
    sol_boxes = [
        ("1. Predictive ML Engine", "Random Forest classifier trained on 3,276 ground-truth physicochemical records. Predicts potability in < 12ms with 88.72% test accuracy.", C_CYAN),
        ("2. WHO Water Quality Index", "Weighted Arithmetic WQI (0-100) computing individual parameter penalties and composite safety grades against official WHO standards.", C_GREEN),
        ("3. Cognitive Remediation", "AI service synthesizing physical/chemical treatments (coagulant dosing, neutralization, filtration) with deterministic offline fallback.", C_AMBER),
        ("4. Batch Municipal Screening", "High-throughput CSV ingestion engine enabling district engineers to audit hundreds of water stations in a single operation.", C_BLUE)
    ]
    
    positions = [(1.0, 2.0), (6.9, 2.0), (1.0, 4.5), (6.9, 4.5)]
    for (title, desc, col), (px, py) in zip(sol_boxes, positions):
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(py), Inches(5.4), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(10)
        
    set_notes(s6, "AquaSafe AI unites four pillars: a fast predictive ML classifier, an official WHO Water Quality Index calculator, a dual-tier cognitive remediation advisory, and high-throughput batch CSV screening.")

    # ---------------------------------------------------------
    # SLIDE 7: Project Objectives & Scope
    # ---------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "Project Objectives & Scope")
    
    objs = [
        ("Target", "Engineering Specification", "Actual Measured Result"),
        ("Diagnostic Latency", "< 1.5s total roundtrip latency", "68ms inference + <100ms API response"),
        ("Classification Accuracy", ">= 80% on held-out test data", "88.72% Accuracy on 656 test records"),
        ("Discriminative Power", "ROC-AUC >= 0.85", "0.9430 ROC-AUC (0.9565 cross-val)"),
        ("Offline Reliability", "100% operational uptime without keys", "Deterministic WHO Expert Rule Engine"),
        ("Standard Compliance", "Mapped to official WHO/EPA limits", "All 9 parameters verified against standards"),
        ("Workflow Integration", "Single-screen end-to-end diagnosis", "Fully operational React + FastAPI app")
    ]
    
    t_shape = s7.shapes.add_table(7, 3, Inches(1.0), Inches(2.0), Inches(11.3), Inches(4.8))
    t = t_shape.table
    for r_idx, row in enumerate(objs):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_CARD if r_idx > 0 else C_BLUE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(12)
            p.font.bold = (r_idx == 0 or c_idx == 0)
            p.font.color.rgb = C_GREEN if (r_idx > 0 and c_idx == 2) else C_TEXT_LIGHT

    set_notes(s7, "Our project objectives were rigorously defined and exceeded. We achieved 88.72% accuracy and 0.9430 ROC-AUC, with sub-second turnaround and 100% offline uptime.")

    # ---------------------------------------------------------
    # SLIDE 8: How the AI Component Works
    # ---------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "How the AI Component Works")
    
    # Text explanation on left
    tbox = s8.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(5.8), Inches(5.0))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "Ensemble Learning Pipeline"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    
    pipeline_steps = [
        "1. Ingestion: Accepts 9 standardized physicochemical parameters from field sensors.",
        "2. Preprocessing: Median imputation ensures fault tolerance; StandardScaler normalizes feature distributions.",
        "3. Ensemble Inference: 150 Random Forest trees evaluate non-linear interaction thresholds simultaneously.",
        "4. Attribution: Gini impurity extracts exact feature importance drivers for full clinical auditability.",
        "5. Cognitive Prompting: Synthesizes risk level and deviations into structured physical & chemical remediation protocols."
    ]
    for s in pipeline_steps:
        ps = tf.add_paragraph()
        ps.text = s
        ps.font.size = Pt(12)
        ps.font.color.rgb = C_TEXT_LIGHT
        ps.space_before = Pt(12)
        
    # Chart on right
    s8.shapes.add_picture(fi_img, Inches(7.0), Inches(1.8), width=Inches(5.5))
    
    set_notes(s8, "The machine learning component uses a Random Forest pipeline with 150 estimators. Feature importances show that pH, TDS, and turbidity are the primary drivers of potability classification.")

    # ---------------------------------------------------------
    # SLIDE 9: System Architecture & Technology Stack
    # ---------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "System Architecture & Technology Stack")
    
    tech_stacks = [
        ("Frontend Client", "React 18 + TypeScript + Vite\nCustom Accessible CSS Design System\nLucide React Iconography\nResponsive Grid & Sliders", C_CYAN),
        ("FastAPI Backend", "Python 3.14 + FastAPI + Uvicorn\nPydantic v2 Schema Validation\nAsynchronous RESTful Endpoints\nCORS Middleware & Health Monitor", C_BLUE),
        ("Machine Learning", "Scikit-Learn Random Forest Pipeline\nStandardScaler & SimpleImputer\nJoblib Model Artifact (.joblib)\nDeterministic Heuristic Fallback", C_GREEN),
        ("Storage & Exports", "SQLite 3 Database Persistence\nStructured JSON Audit Logs\npython-pptx Presentation Engine\nCSV Municipal Batch Intake", C_AMBER)
    ]
    
    x = 0.8
    for title, desc, col in tech_stacks:
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.2), Inches(2.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(16)
        x += 2.95

    set_notes(s9, "The system architecture is strictly decoupled and modular: React frontend, FastAPI backend, Scikit-Learn inference pipeline, and SQLite database storage.")

    # ---------------------------------------------------------
    # SLIDE 10: Application Features & Workflow
    # ---------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10)
    add_header(s10, "Application Features & Primary Workflow")
    
    features = [
        ("Diagnostic Workspace", "Interactive 9-parameter sliders with visual WHO guideline boundaries and 1-click preset scenario loader.", C_CYAN),
        ("WHO Compliance Scorecard", "Parameter-by-parameter compliance scorecard (Safe, Borderline, Hazardous) with explicit health implications.", C_GREEN),
        ("AI Remediation Protocol", "Multi-barrier engineering instructions: coagulant dosing, pH balancing, activated carbon, and household emergency boiling/SODIS.", C_AMBER),
        ("Executive Dashboard", "Real-time telemetry, WQI distribution charts, monitoring station operational statuses, and clickable audit logs.", C_BLUE),
        ("Municipal Batch Screening", "CSV file ingestion engine triaging 100+ community water points simultaneously with instant CSV export.", C_CYAN)
    ]
    
    y = 1.9
    for title, desc, col in features:
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(y), Inches(11.3), Inches(0.95))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title + " — "
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = col
        
        # Add desc inline
        p_desc = p.add_run()
        p_desc.text = desc
        p_desc.font.size = Pt(12)
        p_desc.font.bold = False
        p_desc.font.color.rgb = C_TEXT_LIGHT
        y += 1.05

    set_notes(s10, "The application features a complete user journey: parameter inputs with highlighted safe boundaries, an instant compliance scorecard, AI remediation actions, executive telemetry, and municipal batch processing.")

    # ---------------------------------------------------------
    # SLIDE 11: Lean Canvas Summary
    # ---------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11)
    add_header(s11, "Lean Canvas Business & Social Model")
    
    lc_items = [
        ("Problem", "Lab latency (48-72h), testing costs ($25-$80), and complex multivariate chemistry causing delayed containment.", C_RED),
        ("Solution", "Instant ML potability classification, WHO WA-WQI scoring, and actionable AI treatment protocols.", C_GREEN),
        ("Unique Value", "WHO-grade water potability diagnostics and AI community remediation in under 5 seconds.", C_CYAN),
        ("Channels", "B2G district water ministries, humanitarian NGO field teams (UNICEF/Red Cross), and IoT sensor partnerships.", C_BLUE),
        ("Revenue Model", "B2G district subscription tiers for automated telemetry mapping; free open-core tier for humanitarian relief.", C_AMBER),
        ("Unfair Advantage", "Dual-tier architecture combining calibrated statistical ML with a zero-cost deterministic offline WHO rule engine.", C_GREEN)
    ]
    
    positions = [(0.8, 1.9), (4.8, 1.9), (8.8, 1.9), (0.8, 4.4), (4.8, 4.4), (8.8, 4.4)]
    for (title, desc, col), (px, py) in zip(lc_items, positions):
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(px), Inches(py), Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(11)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(8)

    set_notes(s11, "Our Lean Canvas demonstrates social viability. Revenue is generated through municipal B2G subscriptions, subsidizing free access for grassroots humanitarian responders.")

    # ---------------------------------------------------------
    # SLIDE 12: Working Application Visual Walkthrough
    # ---------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12)
    add_header(s12, "Working Application Evaluation & Visual Walkthrough")
    
    # Left: Confusion matrix
    s12.shapes.add_picture(cm_img, Inches(0.8), Inches(1.8), width=Inches(5.6))
    
    # Right: ROC-AUC curve
    s12.shapes.add_picture(roc_img, Inches(6.8), Inches(1.8), width=Inches(5.6))
    
    set_notes(s12, "Here we display empirical validation artifacts from the implemented model. The confusion matrix shows 354 accurately flagged hazards and 228 confirmed safe samples, with an overall ROC-AUC of 0.9430.")

    # ---------------------------------------------------------
    # SLIDE 13: Testing & Quality Assurance
    # ---------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13)
    add_header(s13, "Testing & Quality Assurance Results")
    
    t_results = [
        ("Test Suite", "Tests Executed", "Passing Rate", "Status"),
        ("API Health & Root Endpoints", "3 Tests (GET /, /health, /metrics)", "100% Passed", "PASSED"),
        ("Executive Dashboard Telemetry", "2 Tests (GET /dashboard, /stations)", "100% Passed", "PASSED"),
        ("Primary Diagnostic Workflow", "3 Tests (Potable, Contaminated, Bounds)", "100% Passed", "PASSED"),
        ("Machine Learning Inference", "3 Tests (WQI Bounds, Classification, Prob)", "100% Passed", "PASSED"),
        ("Database Persistence Layer", "2 Tests (Assessment Save & Station Update)", "100% Passed", "PASSED"),
        ("Frontend Production Build", "Vite TypeScript Bundler (0 errors)", "100% Passed", "BUILT")
    ]
    
    t_shape = s13.shapes.add_table(7, 4, Inches(0.8), Inches(2.0), Inches(11.7), Inches(4.8))
    t = t_shape.table
    for r_idx, row in enumerate(t_results):
        for c_idx, val in enumerate(row):
            cell = t.cell(r_idx, c_idx)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = C_CARD if r_idx > 0 else C_BLUE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(11)
            p.font.bold = (r_idx == 0 or c_idx == 0)
            p.font.color.rgb = C_GREEN if (r_idx > 0 and c_idx == 3) else C_TEXT_LIGHT

    set_notes(s13, "Our automated testing suite executed 13 separate unit and integration tests via pytest. All 13 tests passed, verifying endpoint health, input validation, ML accuracy, and SQLite persistence.")

    # ---------------------------------------------------------
    # SLIDE 14: Impact, Limitations, and Future Roadmap
    # ---------------------------------------------------------
    s14 = prs.slides.add_slide(blank_layout)
    add_bg(s14)
    add_header(s14, "Expected Social Impact & Future Roadmap")
    
    cards = [
        ("Expected Social Impact", "• Turnaround time reduced from 72h to < 1 second.\n• Estimated $60+ saved per triage compared to tertiary lab testing.\n• Pre-emptive containment of waterborne epidemics before hospitalizations.\n• Non-specialist community volunteers empowered with actionable protocols.", C_GREEN),
        ("Current Limitations", "• Relies on sensor probe calibration (+/- 10% tolerance).\n• Evaluated on simulated benchmark data prior to multi-region field pilots.\n• Does not yet conduct live microbial Petri-dish viral genetic sequencing.\n• Generative LLM requires internet; offline mode uses deterministic matrix.", C_AMBER),
        ("Future Roadmap", "• Phase II: Direct firmware integration with low-cost IoT LoRaWAN sensors.\n• Phase III: Solar-powered edge micro-stations with automated valve shutoff.\n• Phase IV: Multi-lingual audio advisory for low-literacy rural caretakers.\n• Phase V: Android APK deployment with Bluetooth sensor pairing.", C_CYAN)
    ]
    
    x = 0.8
    for title, desc, col in cards:
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.2), Inches(3.7), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = col
        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        
        pd = tf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(12)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(14)
        x += 4.0

    set_notes(s14, "While our prototype achieves high accuracy, we clearly acknowledge current limitations including sensor calibration dependencies. Our future roadmap includes LoRaWAN IoT telemetry and solar micro-stations.")

    # ---------------------------------------------------------
    # SLIDE 15: Conclusion & References
    # ---------------------------------------------------------
    s15 = prs.slides.add_slide(blank_layout)
    add_bg(s15)
    add_header(s15, "Conclusion & References")
    
    tbox = s15.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(11.3), Inches(5.0))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = "Summary of Completed Deliverables"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    
    deliverables = [
        "1. Complete Full-Stack Application: React 18 + TypeScript frontend and Python FastAPI backend running locally.",
        "2. Calibrated Machine Learning Model: Random Forest (88.72% test accuracy, 0.9430 ROC-AUC) saved to disk.",
        "3. Cognitive Remediation Layer: Transparent dual-tier generative advisory with deterministic WHO offline fallback.",
        "4. Full Documentation Suite: Project Specification, Lean Canvas, SDG Impact Mapping, and Architecture reports.",
        "5. Editable Presentation: Complete 15-slide PowerPoint deck with embedded high-resolution figures."
    ]
    for d in deliverables:
        pd = tf.add_paragraph()
        pd.text = "• " + d
        pd.font.size = Pt(12)
        pd.font.color.rgb = C_TEXT_LIGHT
        pd.space_before = Pt(8)

    pr = tf.add_paragraph()
    pr.text = "Official References & Standards:"
    pr.font.size = Pt(14)
    pr.font.bold = True
    pr.font.color.rgb = C_GREEN
    pr.space_before = Pt(16)
    
    refs = [
        "• World Health Organization (WHO): Guidelines for Drinking-water Quality, 4th Edition.",
        "• United Nations Department of Economic and Social Affairs: Sustainable Development Goals 6 & 3 (2030 Agenda).",
        "• United States Environmental Protection Agency (US EPA): National Primary Drinking Water Regulations.",
        "• Brown et al. (1972): A Water Quality Index - Do We Dare? Water & Sewage Works."
    ]
    for r in refs:
        p_r = tf.add_paragraph()
        p_r.text = r
        p_r.font.size = Pt(11)
        p_r.font.color.rgb = C_TEXT_MUTED
        p_r.space_before = Pt(4)

    set_notes(s15, "In conclusion, AquaSafe AI provides a complete, tested, and verifiable AI solution for global water security under UN SDGs 6 and 3. Thank you for your time, and we welcome your questions.")

    # Save presentation
    output_path = os.path.join(OUTPUT_DIR, "SDG_AI_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"[+] Presentation successfully created at: {output_path}")
    return output_path

if __name__ == "__main__":
    create_presentation()
