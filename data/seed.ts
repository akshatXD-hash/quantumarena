/**
 * Medical Knowledge Base — RAG Seed Dataset
 * ============================================
 * Sources: WHO, CDC, NIH/MedlinePlus, Mayo Clinic, NHS, PubMed-reviewed literature
 * Version: 1.0.0
 * Last updated: 2025
 *
 * IMPORTANT: This dataset is intended for informational retrieval only.
 * It does not constitute medical advice. All entries are sourced from
 * authoritative, peer-reviewed, and institutional medical references.
 */

const medicalData = [

  // ─── CHRONIC DISEASES ───────────────────────────────────────────────────────

  {
    id: "chronic-001",
    disease: "Type 2 Diabetes Mellitus",
    icd10: "E11",
    category: "chronic",
    overview: "Type 2 diabetes is a chronic metabolic disorder characterized by insulin resistance and relative insulin deficiency, resulting in persistently elevated blood glucose levels (hyperglycemia). It accounts for approximately 90–95% of all diabetes cases worldwide.",
    causes: [
      "Insulin resistance in muscle, fat, and liver cells",
      "Progressive loss of insulin secretion by pancreatic beta cells",
      "Excess glucose production by the liver",
      "Impaired incretin effect (reduced GLP-1/GIP signaling)"
    ],
    riskFactors: [
      "Overweight or obesity (BMI ≥ 25)",
      "Physical inactivity",
      "Family history of diabetes",
      "Age ≥ 45 years",
      "Prediabetes (HbA1c 5.7–6.4%)",
      "Gestational diabetes or birth of baby > 4 kg",
      "Polycystic ovary syndrome (PCOS)",
      "Hypertension (≥ 140/90 mmHg)",
      "Abnormal cholesterol or triglyceride levels",
      "History of cardiovascular disease"
    ],
    symptoms: [
      "Increased thirst (polydipsia)",
      "Frequent urination (polyuria)",
      "Unexplained weight loss",
      "Fatigue and low energy",
      "Blurred vision",
      "Slow-healing wounds or frequent infections",
      "Numbness or tingling in hands or feet (peripheral neuropathy)",
      "Darkened skin patches (acanthosis nigricans)",
      "Many patients are asymptomatic initially"
    ],
    labValues: {
      fastingGlucose: "≥ 126 mg/dL (7.0 mmol/L) on two separate occasions",
      hba1c: "≥ 6.5% (48 mmol/mol) indicates diabetes; 5.7–6.4% indicates prediabetes",
      oralGlucoseTolerance: "2-hour glucose ≥ 200 mg/dL during 75g OGTT",
      randomGlucose: "≥ 200 mg/dL with classic symptoms"
    },
    diagnosis: [
      "Fasting plasma glucose (FPG) test",
      "Hemoglobin A1c (HbA1c) test",
      "Oral glucose tolerance test (OGTT)",
      "Random plasma glucose with symptoms",
      "Continuous glucose monitoring (CGM) in some cases"
    ],
    treatments: [
      "Lifestyle modifications: dietary changes (low glycemic diet), weight loss, regular exercise (150 min/week moderate intensity)",
      "First-line medication: Metformin (reduces hepatic glucose production)",
      "GLP-1 receptor agonists: Semaglutide, Liraglutide (weight loss + glucose control)",
      "SGLT2 inhibitors: Empagliflozin, Dapagliflozin (cardiovascular and renal protective)",
      "DPP-4 inhibitors: Sitagliptin, Saxagliptin",
      "Sulfonylureas: Glipizide, Glimepiride (stimulate insulin secretion)",
      "Insulin therapy: Basal, prandial, or premixed (when oral agents insufficient)",
      "Blood pressure and lipid management (ACE inhibitors, statins)",
      "Regular foot care and ophthalmologic screening"
    ],
    prevention: [
      "Achieve and maintain healthy body weight",
      "Regular aerobic exercise (150 minutes/week)",
      "Adopt a balanced, high-fiber, low-sugar diet",
      "Avoid smoking and limit alcohol intake",
      "Regular diabetes screening for at-risk individuals",
      "Diabetes Prevention Program (DPP) for prediabetes"
    ],
    complications: [
      "Diabetic retinopathy (leading cause of blindness in adults)",
      "Diabetic nephropathy (chronic kidney disease)",
      "Peripheral neuropathy and diabetic foot ulcers",
      "Cardiovascular disease (2–4x increased risk)",
      "Stroke",
      "Hyperosmolar hyperglycemic state (HHS)"
    ],
    whenToSeeDoctor: "Seek care immediately if experiencing extreme thirst, confusion, rapid breathing, or fruity breath (signs of diabetic ketoacidosis or HHS). Schedule routine monitoring if diagnosed: every 3 months for HbA1c until stable, then every 6 months.",
    sources: ["WHO", "American Diabetes Association (ADA)", "CDC", "NIH/MedlinePlus", "Mayo Clinic"]
  },

  {
    id: "chronic-002",
    disease: "Hypertension (High Blood Pressure)",
    icd10: "I10",
    category: "chronic",
    overview: "Hypertension is a chronic condition where the force of blood against artery walls is persistently elevated (≥ 130/80 mmHg per ACC/AHA 2017, or ≥ 140/90 mmHg per WHO). It is a major risk factor for heart disease, stroke, and kidney failure. Often called the 'silent killer' due to lack of symptoms.",
    causes: [
      "Primary (essential) hypertension: No identifiable cause (90–95% of cases), multifactorial",
      "Secondary hypertension causes: Chronic kidney disease, primary aldosteronism, renal artery stenosis, obstructive sleep apnea, thyroid disorders, pheochromocytoma, coarctation of the aorta, certain medications (NSAIDs, oral contraceptives, decongestants)"
    ],
    riskFactors: [
      "Age (risk increases with age)",
      "Family history of hypertension",
      "Overweight or obesity",
      "Physical inactivity",
      "High sodium diet (> 2,300 mg/day)",
      "Low potassium diet",
      "Excessive alcohol consumption",
      "Smoking and tobacco use",
      "Chronic stress",
      "Diabetes mellitus",
      "Chronic kidney disease",
      "Race (higher prevalence in Black adults)"
    ],
    symptoms: [
      "Most patients are asymptomatic",
      "Headaches (typically occipital, worse in morning) — in severe cases",
      "Dizziness or lightheadedness",
      "Shortness of breath",
      "Nosebleeds (epistaxis) — in severe hypertension",
      "Visual changes",
      "Chest pain (hypertensive urgency/emergency)"
    ],
    labValues: {
      normal: "< 120/80 mmHg",
      elevated: "120–129 / < 80 mmHg",
      stage1: "130–139 / 80–89 mmHg",
      stage2: "≥ 140 / ≥ 90 mmHg",
      hypertensivecrisis: "≥ 180 / ≥ 120 mmHg"
    },
    diagnosis: [
      "Sphygmomanometer blood pressure measurement (confirmed on ≥ 2 separate visits)",
      "Ambulatory blood pressure monitoring (ABPM) — gold standard",
      "Home blood pressure monitoring",
      "Urinalysis and kidney function tests (BMP/CMP)",
      "Lipid panel, blood glucose",
      "ECG for left ventricular hypertrophy",
      "Echocardiogram if indicated",
      "Renal ultrasound if secondary hypertension suspected"
    ],
    treatments: [
      "Lifestyle modifications: DASH diet, sodium restriction (< 2,300 mg/day), weight loss, regular aerobic exercise, alcohol reduction",
      "Thiazide diuretics: Hydrochlorothiazide, Chlorthalidone (first-line)",
      "ACE inhibitors: Lisinopril, Enalapril (preferred in diabetes and CKD)",
      "ARBs: Losartan, Valsartan (alternative to ACE inhibitors)",
      "Calcium channel blockers: Amlodipine, Diltiazem",
      "Beta-blockers: Metoprolol, Atenolol (for specific indications)",
      "Combination therapy often required for Stage 2",
      "Treatment of underlying cause in secondary hypertension"
    ],
    prevention: [
      "Maintain healthy weight (BMI 18.5–24.9)",
      "Follow DASH (Dietary Approaches to Stop Hypertension) diet",
      "Limit sodium intake",
      "Exercise regularly (30 minutes most days)",
      "Limit alcohol to ≤ 1 drink/day (women), ≤ 2 drinks/day (men)",
      "Quit smoking",
      "Manage stress"
    ],
    whenToSeeDoctor: "Seek emergency care if BP ≥ 180/120 mmHg with symptoms like chest pain, shortness of breath, back pain, visual changes, or neurological symptoms (hypertensive emergency). Routine care: annual BP checks for normal adults; more frequent for those at risk.",
    sources: ["WHO", "ACC/AHA 2017 Guidelines", "CDC", "NIH/MedlinePlus", "Mayo Clinic", "NHS"]
  },

  {
    id: "chronic-003",
    disease: "Chronic Obstructive Pulmonary Disease (COPD)",
    icd10: "J44",
    category: "chronic",
    overview: "COPD is a progressive, preventable, and treatable chronic inflammatory lung disease causing persistent airflow obstruction. It encompasses emphysema (alveolar destruction) and chronic bronchitis (bronchial inflammation). COPD is the third leading cause of death worldwide (WHO).",
    causes: [
      "Cigarette smoking (primary cause — responsible for ~85% of cases)",
      "Long-term exposure to air pollutants, chemical fumes, dusts",
      "Occupational dust and chemicals (miners, construction, agriculture)",
      "Indoor air pollution (biomass fuel combustion in developing countries)",
      "Alpha-1 antitrypsin deficiency (genetic risk factor)",
      "Childhood respiratory infections",
      "Asthma and airway hyperresponsiveness"
    ],
    riskFactors: [
      "Smoking (current or past)",
      "Age ≥ 40 years",
      "Occupational exposure to dust and chemicals",
      "Indoor/outdoor air pollution exposure",
      "Alpha-1 antitrypsin genetic deficiency",
      "Low socioeconomic status",
      "Frequent childhood respiratory infections"
    ],
    symptoms: [
      "Chronic productive cough (often the first symptom)",
      "Dyspnea (shortness of breath), especially on exertion",
      "Wheezing",
      "Chest tightness",
      "Increased mucus/sputum production",
      "Cyanosis (blue lips or fingertips — advanced disease)",
      "Barrel chest appearance (emphysema)",
      "Frequent respiratory infections",
      "Fatigue and weight loss (advanced stages)"
    ],
    diagnosis: [
      "Spirometry (gold standard): FEV1/FVC ratio < 0.70 post-bronchodilator confirms diagnosis",
      "GOLD staging (Grade 1–4) based on FEV1% predicted",
      "Chest X-ray (hyperinflation, flattened diaphragm)",
      "CT scan of chest (emphysema pattern)",
      "Arterial blood gas (ABG) in severe cases",
      "Alpha-1 antitrypsin level testing",
      "COPD Assessment Test (CAT) and mMRC dyspnea scale"
    ],
    treatments: [
      "Smoking cessation — most effective intervention to slow progression",
      "Short-acting bronchodilators (SABA): Salbutamol (Albuterol) for rescue",
      "Long-acting bronchodilators (LABA): Salmeterol, Formoterol",
      "Long-acting muscarinic antagonists (LAMA): Tiotropium, Umeclidinium",
      "Inhaled corticosteroids (ICS): Fluticasone — for frequent exacerbations",
      "Combination inhalers (ICS/LABA/LAMA)",
      "Pulmonary rehabilitation",
      "Oxygen therapy (long-term if PaO2 ≤ 55 mmHg)",
      "Systemic corticosteroids and antibiotics for acute exacerbations",
      "Lung volume reduction surgery or lung transplant (selected severe cases)",
      "Annual influenza and pneumococcal vaccination"
    ],
    prevention: [
      "Never smoke or quit smoking immediately",
      "Avoid occupational and environmental air pollutants",
      "Use proper protective equipment in dusty/chemical environments",
      "Improve indoor ventilation",
      "Vaccinations (influenza, pneumococcal, COVID-19)",
      "Early spirometry screening for at-risk individuals"
    ],
    whenToSeeDoctor: "Seek emergency care for severe dyspnea, cyanosis, confusion, or inability to speak full sentences (acute exacerbation). Routine care for persistent cough > 3 months, progressive dyspnea, or if you are a current/former smoker age ≥ 40.",
    sources: ["GOLD Guidelines 2024", "WHO", "NIH/NHLBI", "Mayo Clinic", "NHS"]
  },

  {
    id: "chronic-004",
    disease: "Coronary Artery Disease (CAD)",
    icd10: "I25",
    category: "chronic",
    overview: "Coronary artery disease is the narrowing or blockage of coronary arteries due to atherosclerosis — a buildup of cholesterol-rich plaque. It is the most common form of heart disease and the leading cause of death globally. CAD can lead to angina, heart attack (myocardial infarction), and sudden cardiac death.",
    causes: [
      "Atherosclerosis: buildup of lipid-laden plaques in coronary artery walls",
      "Plaque rupture leading to thrombosis and acute coronary syndrome",
      "Coronary artery spasm (vasospastic/variant angina)",
      "Microvascular dysfunction (especially in women)"
    ],
    riskFactors: [
      "Smoking",
      "Hyperlipidemia (high LDL cholesterol)",
      "Hypertension",
      "Diabetes mellitus",
      "Obesity",
      "Physical inactivity",
      "Family history of premature CAD (first-degree male < 55, female < 65)",
      "Age (men ≥ 45, women ≥ 55)",
      "Chronic kidney disease",
      "Inflammatory conditions (rheumatoid arthritis, lupus)",
      "Obstructive sleep apnea",
      "Chronic stress and depression"
    ],
    symptoms: [
      "Angina: Chest pain or pressure, tightness, squeezing — often triggered by exertion or stress",
      "Pain radiating to the left arm, jaw, neck, shoulder, or back",
      "Shortness of breath (dyspnea)",
      "Palpitations",
      "Fatigue",
      "Dizziness or lightheadedness",
      "Nausea (more common in women)",
      "Women may present atypically: fatigue, nausea, shortness of breath without classic chest pain",
      "Silent ischemia (no symptoms) is common in diabetics"
    ],
    diagnosis: [
      "12-lead ECG (ST changes, Q waves)",
      "Cardiac biomarkers: Troponin I or T (elevated in myocardial injury), CK-MB",
      "Stress testing (exercise ECG, nuclear stress test, stress echocardiogram)",
      "Coronary angiography (catheterization) — gold standard for anatomy",
      "CT coronary angiography (non-invasive)",
      "Coronary artery calcium (CAC) score",
      "Echocardiogram",
      "Lipid panel, fasting glucose, HbA1c, CRP"
    ],
    treatments: [
      "Antiplatelet therapy: Aspirin, Clopidogrel, Ticagrelor",
      "Statins: Atorvastatin, Rosuvastatin (LDL reduction, plaque stabilization)",
      "Beta-blockers: Metoprolol, Carvedilol (reduce heart rate and oxygen demand)",
      "ACE inhibitors/ARBs (especially post-MI or with heart failure)",
      "Nitrates: Nitroglycerin (sublingual for acute angina)",
      "Ranolazine (chronic angina)",
      "Percutaneous coronary intervention (PCI) with stenting",
      "Coronary artery bypass graft surgery (CABG)",
      "Cardiac rehabilitation",
      "Lifestyle changes: smoking cessation, Mediterranean diet, regular exercise"
    ],
    prevention: [
      "Quit smoking",
      "Control blood pressure, diabetes, and cholesterol",
      "Regular aerobic exercise",
      "Heart-healthy diet (Mediterranean or DASH diet)",
      "Maintain healthy weight",
      "Aspirin prophylaxis in selected high-risk patients (per physician guidance)",
      "Regular cardiovascular risk screening"
    ],
    whenToSeeDoctor: "Call emergency services (911) immediately for chest pain lasting > 5 minutes, especially with radiation to the arm or jaw, sweating, and shortness of breath. Do not drive yourself. Routine care: annual cardiovascular risk assessment for adults with risk factors.",
    sources: ["ACC/AHA Guidelines", "WHO", "NIH/NHLBI", "Mayo Clinic", "NHS"]
  },

  {
    id: "chronic-005",
    disease: "Chronic Kidney Disease (CKD)",
    icd10: "N18",
    category: "chronic",
    overview: "Chronic kidney disease is the progressive, irreversible loss of kidney function over months to years, defined by GFR < 60 mL/min/1.73m² or markers of kidney damage persisting for ≥ 3 months. CKD affects approximately 10% of the global population and significantly increases cardiovascular risk.",
    causes: [
      "Diabetic nephropathy (leading cause — ~40% of CKD cases)",
      "Hypertensive nephrosclerosis (second most common cause)",
      "Glomerulonephritis (IgA nephropathy, lupus nephritis)",
      "Polycystic kidney disease (genetic)",
      "Recurrent kidney infections (pyelonephritis)",
      "Obstructive uropathy",
      "Chronic NSAID use nephrotoxicity",
      "Contrast-induced nephropathy"
    ],
    riskFactors: [
      "Diabetes mellitus",
      "Hypertension",
      "Cardiovascular disease",
      "Family history of kidney disease",
      "Age ≥ 60 years",
      "Obesity",
      "Smoking",
      "Low birth weight",
      "Recurrent urinary tract infections",
      "NSAID overuse",
      "Autoimmune diseases"
    ],
    symptoms: [
      "Early stages often asymptomatic",
      "Fatigue and weakness",
      "Decreased urine output or nocturia",
      "Foamy or bubbly urine (proteinuria)",
      "Swelling in legs, ankles, feet (edema)",
      "Shortness of breath (fluid overload)",
      "Hypertension (worsening)",
      "Nausea, vomiting, loss of appetite",
      "Muscle cramps and restless legs",
      "Persistent itching (uremic pruritus)",
      "Confusion and decreased alertness (uremia — late stage)"
    ],
    labValues: {
      gfrStage1: "G1: GFR ≥ 90 (normal or high) + kidney damage markers",
      gfrStage2: "G2: GFR 60–89 (mildly decreased)",
      gfrStage3a: "G3a: GFR 45–59 (mild-to-moderate)",
      gfrStage3b: "G3b: GFR 30–44 (moderate-to-severe)",
      gfrStage4: "G4: GFR 15–29 (severely decreased)",
      gfrStage5: "G5: GFR < 15 (kidney failure — requires dialysis or transplant)",
      uacr: "Urine albumin-to-creatinine ratio (UACR) ≥ 30 mg/g indicates kidney damage"
    },
    diagnosis: [
      "Serum creatinine and estimated GFR (eGFR) using CKD-EPI equation",
      "Urine albumin-to-creatinine ratio (UACR)",
      "Urinalysis with microscopy",
      "Renal ultrasound (size, echogenicity, obstruction)",
      "BMP/CMP (electrolytes, BUN, creatinine)",
      "CBC (anemia of chronic kidney disease)",
      "Kidney biopsy (for unclear etiology)"
    ],
    treatments: [
      "Control underlying cause: optimize BP (target < 130/80), glycemic control in diabetes",
      "ACE inhibitors or ARBs (first-line for CKD with proteinuria — nephroprotective)",
      "SGLT2 inhibitors: Dapagliflozin, Empagliflozin (shown to slow CKD progression)",
      "Dietary protein restriction (0.6–0.8 g/kg/day in advanced CKD)",
      "Phosphate binders (for hyperphosphatemia)",
      "Erythropoiesis-stimulating agents (for CKD anemia)",
      "Vitamin D supplementation",
      "Diuretics (for fluid management)",
      "Dialysis (hemodialysis or peritoneal dialysis) when GFR < 10–15",
      "Kidney transplantation (definitive treatment for ESRD)"
    ],
    prevention: [
      "Maintain tight blood glucose control (HbA1c < 7%)",
      "Achieve and maintain BP < 130/80 mmHg",
      "Avoid nephrotoxic medications (limit NSAIDs, contrast when possible)",
      "Quit smoking",
      "Maintain healthy weight and exercise regularly",
      "Annual screening for at-risk patients (diabetics, hypertensives)"
    ],
    whenToSeeDoctor: "Seek urgent care for markedly decreased urine output, severe edema, difficulty breathing, or confusion. Routine nephrology referral recommended for eGFR < 30 or rapidly declining eGFR.",
    sources: ["KDIGO 2024 Guidelines", "NIH/NIDDK", "WHO", "Mayo Clinic", "NHS"]
  },

  // ─── INFECTIOUS DISEASES ─────────────────────────────────────────────────────

  {
    id: "infectious-001",
    disease: "Tuberculosis (TB)",
    icd10: "A15",
    category: "infectious",
    overview: "Tuberculosis is an airborne infectious disease caused by Mycobacterium tuberculosis. It primarily affects the lungs (pulmonary TB) but can affect any organ (extrapulmonary TB). TB remains one of the world's leading infectious disease killers, second only to COVID-19 among single infectious agents.",
    causes: [
      "Mycobacterium tuberculosis (primary causative organism)",
      "Mycobacterium bovis (rare, associated with unpasteurized dairy)",
      "Transmitted via airborne droplet nuclei when infected person coughs, sneezes, or speaks"
    ],
    riskFactors: [
      "HIV infection (greatest risk factor — 18x increased risk)",
      "Living or working in high-TB-burden countries",
      "Close contact with active TB patient",
      "Homelessness or congregate living settings (prisons, shelters)",
      "Malnutrition and underweight",
      "Diabetes mellitus",
      "Immunosuppressive therapy (corticosteroids, TNF-inhibitors)",
      "Organ transplant recipients",
      "Substance use disorders",
      "Silicosis",
      "Age < 5 or > 65 years"
    ],
    symptoms: [
      "Persistent cough > 2–3 weeks (may produce blood-streaked sputum — hemoptysis)",
      "Night sweats",
      "Fever (low-grade, afternoon/evening)",
      "Unexplained weight loss",
      "Fatigue and malaise",
      "Chest pain",
      "Loss of appetite (anorexia)",
      "Latent TB: No symptoms (not contagious)",
      "Extrapulmonary TB: Symptoms depend on site (meningitis, lymphadenopathy, urinary symptoms, back pain)"
    ],
    diagnosis: [
      "Tuberculin Skin Test (TST / Mantoux) — screens for TB exposure",
      "Interferon-Gamma Release Assays (IGRA): QuantiFERON-TB Gold, T-SPOT.TB",
      "Sputum smear microscopy (acid-fast bacilli staining)",
      "Sputum culture (gold standard — Lowenstein-Jensen medium, 6–8 weeks)",
      "GeneXpert MTB/RIF (rapid PCR — detects TB and rifampicin resistance in 2 hours)",
      "Chest X-ray (upper lobe infiltrates, cavitations, calcification)",
      "CT chest for complex cases",
      "Lumbar puncture, biopsy for extrapulmonary TB"
    ],
    treatments: [
      "Latent TB: Isoniazid (INH) 9 months; or INH + Rifapentine weekly for 3 months (3HP regimen)",
      "Active TB — Standard RIPE regimen:",
      "  Intensive phase (2 months): Rifampin + Isoniazid + Pyrazinamide + Ethambutol",
      "  Continuation phase (4 months): Rifampin + Isoniazid",
      "Drug-resistant TB (MDR-TB): Longer regimens with second-line drugs (fluoroquinolones, bedaquiline, delamanid)",
      "Directly Observed Therapy (DOT) strongly recommended to ensure adherence",
      "Pyridoxine (Vitamin B6) supplementation to prevent INH-induced neuropathy"
    ],
    prevention: [
      "BCG (Bacille Calmette-Guérin) vaccination (given at birth in high-burden countries)",
      "Early identification and treatment of active TB cases",
      "Treatment of latent TB in high-risk groups",
      "Infection control in healthcare settings (N95 respirators, negative pressure rooms)",
      "HIV treatment and prevention (reduces TB risk dramatically)",
      "Nutritional support",
      "Adequate ventilation in living and working spaces"
    ],
    whenToSeeDoctor: "See a doctor promptly for persistent cough > 3 weeks, especially with weight loss, night sweats, or blood in sputum. TB is a notifiable disease — testing and treatment are typically provided free of charge through public health programs.",
    sources: ["WHO Global TB Report 2023", "CDC", "NIH/NIAID", "NHS", "Mayo Clinic"]
  },

  {
    id: "infectious-002",
    disease: "Community-Acquired Pneumonia (CAP)",
    icd10: "J18",
    category: "infectious",
    overview: "Community-acquired pneumonia is an acute infection of the lung parenchyma acquired outside of healthcare settings. It is one of the most common infectious diseases and a leading cause of death worldwide, especially in children under 5 and adults over 65.",
    causes: [
      "Bacterial — Streptococcus pneumoniae (most common bacterial cause)",
      "Atypical bacteria: Mycoplasma pneumoniae, Chlamydophila pneumoniae, Legionella pneumophila",
      "Viral: Influenza A/B, SARS-CoV-2, RSV, Adenovirus",
      "Haemophilus influenzae (especially in COPD patients)",
      "Staphylococcus aureus (including MRSA — post-influenza)",
      "Fungi: Pneumocystis jirovecii (PCP) in immunocompromised",
      "Aspiration pneumonia (anaerobes)"
    ],
    riskFactors: [
      "Age > 65 or < 2 years",
      "Smoking",
      "COPD, asthma, or other lung disease",
      "Diabetes mellitus",
      "Heart failure",
      "Immunosuppression (HIV, chemotherapy, steroids)",
      "Alcohol use disorder",
      "Dysphagia (aspiration risk)",
      "Malnutrition",
      "Recent viral respiratory infection"
    ],
    symptoms: [
      "Productive cough (yellow, green, or rust-colored sputum)",
      "Fever and chills",
      "Dyspnea (shortness of breath)",
      "Pleuritic chest pain (sharp, worse with breathing/coughing)",
      "Fatigue",
      "Tachypnea (rapid breathing)",
      "Tachycardia",
      "Decreased breath sounds, crackles on auscultation",
      "Elderly may present with confusion or falls rather than fever"
    ],
    diagnosis: [
      "Chest X-ray (lobar or segmental consolidation — gold standard for confirmation)",
      "CT chest (more sensitive, especially for atypical or complex cases)",
      "Sputum Gram stain and culture",
      "Blood cultures (before antibiotic administration in hospitalized patients)",
      "CBC (leukocytosis or leukopenia)",
      "CMP (electrolytes, kidney function)",
      "Procalcitonin and CRP (markers of bacterial infection severity)",
      "Urinary antigen tests: Streptococcus pneumoniae, Legionella",
      "Nasopharyngeal swab PCR (influenza, COVID-19, RSV)",
      "PSI/PORT score or CURB-65 score for severity and hospitalization decision"
    ],
    treatments: [
      "Outpatient mild CAP (no comorbidities): Amoxicillin 1g TID × 5 days, or Doxycycline",
      "Outpatient with comorbidities: Amoxicillin-clavulanate + macrolide, or respiratory fluoroquinolone (Levofloxacin, Moxifloxacin)",
      "Inpatient non-ICU: Beta-lactam + macrolide, or respiratory fluoroquinolone",
      "ICU/severe CAP: Beta-lactam + azithromycin ± antipseudomonal coverage",
      "Viral pneumonia: Supportive care; Oseltamivir for influenza; antivirals for COVID-19",
      "Supplemental oxygen to maintain SpO2 ≥ 94%",
      "IV fluids and electrolyte replacement",
      "Antipyretics for fever and pain",
      "Mechanical ventilation for respiratory failure"
    ],
    prevention: [
      "Annual influenza vaccination",
      "Pneumococcal vaccinations (PCV15/PCV20, PPSV23) per CDC schedule",
      "COVID-19 vaccination",
      "Smoking cessation",
      "Good hand hygiene",
      "Aspiration precautions in at-risk patients"
    ],
    whenToSeeDoctor: "Seek emergency care for SpO2 < 94%, severe dyspnea, confusion, cyanosis, or BP < 90/60. See a doctor promptly for fever with productive cough, chest pain, and difficulty breathing, especially in elderly or immunocompromised individuals.",
    sources: ["IDSA/ATS 2019 Guidelines", "WHO", "CDC", "NIH/MedlinePlus", "NHS", "Mayo Clinic"]
  },

  {
    id: "infectious-003",
    disease: "Urinary Tract Infection (UTI)",
    icd10: "N39.0",
    category: "infectious",
    overview: "A urinary tract infection is a bacterial (occasionally fungal) infection of any part of the urinary system: kidneys (pyelonephritis), bladder (cystitis), ureters, or urethra (urethritis). Cystitis is the most common form. UTIs are the most common bacterial infections in women, affecting 50–60% at least once in their lifetime.",
    causes: [
      "Escherichia coli (E. coli) — responsible for ~80–85% of UTIs",
      "Staphylococcus saprophyticus (common in sexually active young women)",
      "Klebsiella pneumoniae",
      "Proteus mirabilis",
      "Enterococcus faecalis",
      "Pseudomonas aeruginosa (hospital-acquired or catheter-associated)",
      "Candida species (in immunocompromised or catheterized patients)"
    ],
    riskFactors: [
      "Female sex (shorter urethra)",
      "Sexual activity ('honeymoon cystitis')",
      "Urinary catheters",
      "Urinary tract abnormalities or obstructions",
      "Kidney stones",
      "Diabetes mellitus",
      "Menopause (reduced estrogen leading to vaginal microbiome changes)",
      "Pregnancy",
      "Immunosuppression",
      "Inadequate fluid intake",
      "Recent antibiotic use (alters protective flora)"
    ],
    symptoms: [
      "Dysuria: Burning or pain during urination",
      "Urinary urgency and frequency",
      "Suprapubic pain or pelvic pressure",
      "Cloudy, dark, or foul-smelling urine",
      "Hematuria (blood in urine)",
      "Pyelonephritis additionally: flank/back pain, fever ≥ 38°C, chills, nausea, vomiting",
      "Elderly may present with confusion, falls, or agitation without classic symptoms"
    ],
    diagnosis: [
      "Urinalysis with microscopy: pyuria (> 5–10 WBCs/hpf), bacteriuria, nitrites, leukocyte esterase",
      "Urine culture and sensitivity (gold standard — ≥ 10^5 CFU/mL significant)",
      "CBC and CMP for pyelonephritis",
      "Blood cultures for severe pyelonephritis or urosepsis",
      "Renal ultrasound/CT (for recurrent UTI, abscess, or obstruction)"
    ],
    treatments: [
      "Uncomplicated cystitis (women): Nitrofurantoin 100mg BD × 5 days (first-line); or Trimethoprim-Sulfamethoxazole DS × 3 days; or Fosfomycin 3g single dose",
      "Uncomplicated pyelonephritis (outpatient): Ciprofloxacin 500mg BD × 7 days; or TMP-SMX × 14 days (if sensitive)",
      "Severe pyelonephritis or urosepsis: IV Ceftriaxone or fluoroquinolones; step-down to oral after 48–72h",
      "Catheter-associated UTI: Remove catheter if possible; treat symptomatic cases only",
      "Increased fluid intake (2–3L/day)",
      "Phenazopyridine for symptomatic bladder pain relief (not an antibiotic)",
      "Recurrent UTI prophylaxis: low-dose nitrofurantoin or TMP-SMX nightly; or postcoital dosing"
    ],
    prevention: [
      "Wipe front to back after bowel movements",
      "Urinate after sexual intercourse",
      "Stay well-hydrated (≥ 2L water/day)",
      "Avoid spermicide-containing contraceptives",
      "Cranberry products (weak evidence for prevention)",
      "Topical vaginal estrogen (postmenopausal women)",
      "Avoid unnecessary catheterization; remove catheters as soon as possible"
    ],
    whenToSeeDoctor: "Seek care for fever with urinary symptoms, flank/back pain, pregnancy with any UTI symptoms, or symptoms not improving within 2–3 days of treatment. Seek emergency care for confusion, severe pain, or inability to tolerate oral fluids.",
    sources: ["IDSA Guidelines", "NIH/MedlinePlus", "CDC", "Mayo Clinic", "NHS", "EAU Guidelines"]
  },

  {
    id: "infectious-004",
    disease: "COVID-19 (SARS-CoV-2 Infection)",
    icd10: "U07.1",
    category: "infectious",
    overview: "COVID-19 is an infectious respiratory illness caused by SARS-CoV-2 (Severe Acute Respiratory Syndrome Coronavirus 2). Emerged in late 2019, it caused a global pandemic declared by WHO in March 2020. Clinical presentation ranges from asymptomatic to critical illness. Long COVID (post-acute sequelae) affects a significant proportion of survivors.",
    causes: [
      "SARS-CoV-2 coronavirus (Betacoronavirus genus, family Coronaviridae)",
      "Transmitted via respiratory droplets and aerosols (primary route)",
      "Close contact with infected person (< 6 feet, prolonged contact)",
      "Fomite transmission (touching contaminated surfaces then touching face) — less common"
    ],
    riskFactors: [
      "Older age (risk increases significantly after age 50)",
      "Obesity (BMI ≥ 30)",
      "Diabetes mellitus",
      "Cardiovascular disease",
      "Chronic lung disease",
      "Chronic kidney disease",
      "Immunosuppression (cancer, HIV, organ transplant)",
      "Pregnancy",
      "Smoking",
      "Unvaccinated status"
    ],
    symptoms: [
      "Fever or chills",
      "Dry cough",
      "Dyspnea (shortness of breath)",
      "Fatigue",
      "Myalgia (muscle aches)",
      "Headache",
      "Loss of taste (ageusia) or smell (anosmia) — more common with earlier variants",
      "Sore throat",
      "Rhinorrhea (runny nose)",
      "Nausea, vomiting, diarrhea",
      "Severe: Low SpO2, rapid breathing, chest pain, confusion"
    ],
    diagnosis: [
      "NAAT/PCR test (nasopharyngeal swab) — gold standard, high sensitivity",
      "Rapid antigen test (RAT/at-home test) — high specificity, lower sensitivity",
      "Serology/antibody testing (for past infection, not acute diagnosis)",
      "Chest CT (ground-glass opacities in bilateral lower lobes — characteristic pattern)",
      "Chest X-ray",
      "CBC, CMP, D-dimer, ferritin, CRP, IL-6 for severity assessment"
    ],
    treatments: [
      "Mild/moderate, high-risk: Nirmatrelvir/ritonavir (Paxlovid) × 5 days (within 5 days of symptom onset)",
      "Molnupiravir (alternative oral antiviral for adults)",
      "Remdesivir (IV, for hospitalized patients requiring low-flow O2)",
      "Dexamethasone 6mg/day for hospitalized patients requiring supplemental O2 or ventilation",
      "Baricitinib or Tocilizumab (anti-inflammatory for severe COVID with rapid progression)",
      "Anticoagulation (heparin) for hospitalized patients",
      "Supplemental oxygen, high-flow O2, non-invasive ventilation, mechanical ventilation as needed",
      "Supportive care: rest, hydration, antipyretics",
      "COVID-19 monoclonal antibodies (availability varies by variant)"
    ],
    prevention: [
      "COVID-19 vaccination (primary series + updated boosters per CDC/WHO schedule)",
      "Wearing well-fitted masks (N95/KN95) in high-risk settings",
      "Improve indoor ventilation",
      "Hand hygiene (soap and water or hand sanitizer)",
      "Staying home when sick",
      "Testing before gatherings (especially with vulnerable individuals)",
      "Nirmatrelvir/ritonavir for post-exposure prophylaxis in high-risk individuals"
    ],
    whenToSeeDoctor: "Seek emergency care for severe difficulty breathing, persistent chest pain/pressure, confusion, inability to wake or stay awake, or bluish lips or face (SpO2 < 94%). High-risk individuals should contact doctor early for antiviral therapy within 5 days of symptom onset.",
    sources: ["WHO", "CDC", "NIH COVID-19 Treatment Guidelines", "Mayo Clinic", "IDSA"]
  },

  {
    id: "infectious-005",
    disease: "Dengue Fever",
    icd10: "A90",
    category: "infectious",
    overview: "Dengue fever is an acute mosquito-borne viral disease caused by one of four dengue virus serotypes (DENV 1–4). It is transmitted primarily by the Aedes aegypti mosquito. Dengue is endemic in over 100 countries in tropical and subtropical regions, with approximately 400 million infections annually (WHO).",
    causes: [
      "Dengue viruses (DENV-1, DENV-2, DENV-3, DENV-4) — Flavivirus genus",
      "Transmitted by bite of infected female Aedes aegypti or Aedes albopictus mosquitoes",
      "No direct person-to-person transmission (except rare blood transfusion/organ transplant)"
    ],
    riskFactors: [
      "Living or traveling to tropical/subtropical dengue-endemic regions",
      "Urban areas with Aedes mosquito habitats (stagnant water containers)",
      "Previous dengue infection with different serotype (increases risk of severe dengue)",
      "Young children (higher risk of severe dengue)",
      "Age extremes",
      "Rainy season (increased mosquito breeding)"
    ],
    symptoms: [
      "Sudden high fever (39–40°C), often called 'breakbone fever'",
      "Severe headache (retro-orbital/behind-eye pain)",
      "Severe joint and muscle aches (myalgia, arthralgia)",
      "Nausea and vomiting",
      "Fatigue",
      "Maculopapular or petechial skin rash (appears 3–5 days after fever)",
      "Mild bleeding (epistaxis, gingival bleeding, easy bruising)",
      "Severe dengue warning signs: abdominal pain, persistent vomiting, rapid breathing, bleeding gums, blood in vomit/stool, restlessness, pallor"
    ],
    labValues: {
      platelets: "Thrombocytopenia (< 100,000/μL is warning sign; < 20,000/μL with bleeding = severe dengue)",
      hematocrit: "Hemoconcentration (Hct rise ≥ 20% above baseline indicates plasma leakage)",
      wbc: "Leukopenia (WBC < 4,000/μL is typical in dengue)"
    },
    diagnosis: [
      "NS1 antigen test (positive days 1–5 of illness — high sensitivity in early phase)",
      "Dengue IgM/IgG serology (positive from day 5 onwards)",
      "RT-PCR (gold standard for early confirmation, expensive)",
      "CBC with differential (thrombocytopenia, leukopenia, hemoconcentration)",
      "Liver function tests (elevated AST/ALT common)",
      "Coagulation studies (PT/PTT — in severe dengue)"
    ],
    treatments: [
      "No specific antiviral treatment currently available",
      "Supportive care is the mainstay of treatment",
      "Oral rehydration with electrolyte solutions for mild-moderate disease",
      "IV crystalloid fluids (isotonic saline) for plasma leakage/severe dengue",
      "Antipyretics: Paracetamol/Acetaminophen for fever and pain",
      "AVOID: NSAIDs (ibuprofen, aspirin) and anticoagulants (increase bleeding risk)",
      "Platelet transfusion only for active severe bleeding + platelets < 10,000/μL",
      "Close monitoring of platelet count, hematocrit, fluid balance",
      "ICU care for dengue shock syndrome or severe bleeding"
    ],
    prevention: [
      "Dengue vaccine (Dengvaxia): Recommended only for seropositive individuals aged 9–45 in endemic areas",
      "QDenga (Takeda): Approved in some countries for ages 4–60 regardless of prior exposure",
      "Mosquito control: Eliminate standing water (flowerpots, tires, containers)",
      "Personal protection: DEET-based repellents, permethrin-treated clothing",
      "Use mosquito nets (especially during day — Aedes bites during daytime)",
      "Wear long-sleeved clothing",
      "Window screens and air conditioning"
    ],
    whenToSeeDoctor: "Seek emergency care if dengue patient develops: severe abdominal pain, persistent vomiting, rapid breathing, bleeding gums, blood in vomit/stool/urine, or restlessness/confusion (signs of severe dengue/shock). These can be life-threatening within hours.",
    sources: ["WHO Dengue Guidelines 2023", "CDC", "NIH/MedlinePlus", "Mayo Clinic"]
  },

  // ─── MENTAL HEALTH CONDITIONS ─────────────────────────────────────────────────

  {
    id: "mental-001",
    disease: "Major Depressive Disorder (MDD)",
    icd10: "F32",
    category: "mental health",
    overview: "Major depressive disorder is a common, serious, and treatable mental health condition characterized by persistent depressed mood, loss of interest or pleasure, and associated cognitive, behavioral, and physical symptoms lasting ≥ 2 weeks. It is the leading cause of disability worldwide (WHO) and a major contributor to global burden of disease.",
    causes: [
      "Biological: Dysregulation of monoamine neurotransmitters (serotonin, norepinephrine, dopamine)",
      "Neuroinflammation and HPA (hypothalamic-pituitary-adrenal) axis dysregulation",
      "Genetic predisposition (heritability ~40%)",
      "Psychological: Cognitive distortions, learned helplessness, maladaptive thought patterns",
      "Social: Trauma, abuse, loss, social isolation, stressful life events",
      "Medical comorbidities: Hypothyroidism, chronic pain, cancer, Parkinson's disease",
      "Medications: Corticosteroids, beta-blockers, interferons, oral contraceptives"
    ],
    riskFactors: [
      "Personal or family history of depression",
      "Trauma or adverse childhood experiences (ACEs)",
      "Major life stressors (bereavement, job loss, relationship breakdown)",
      "Female sex (2x more common in women)",
      "Chronic medical illness (diabetes, cancer, heart disease)",
      "Substance use disorders",
      "Personality disorders",
      "Social isolation and loneliness",
      "Postpartum period",
      "Chronic pain"
    ],
    symptoms: [
      "Persistent low mood, sadness, or emotional emptiness (most days, most of the day)",
      "Anhedonia: Loss of interest or pleasure in activities previously enjoyed",
      "Fatigue or loss of energy",
      "Changes in appetite (increased or decreased) with weight changes",
      "Insomnia or hypersomnia",
      "Psychomotor agitation or retardation (observable by others)",
      "Feelings of worthlessness or excessive guilt",
      "Difficulty concentrating, thinking, or making decisions",
      "Recurrent thoughts of death, suicidal ideation, or suicide attempts",
      "Physical symptoms: Unexplained aches, headaches, digestive problems"
    ],
    diagnosis: [
      "Clinical interview based on DSM-5 criteria (≥ 5 symptoms for ≥ 2 weeks, including depressed mood or anhedonia)",
      "PHQ-9 (Patient Health Questionnaire-9) screening tool",
      "Exclusion of medical causes: TSH, CBC, BMP, vitamin B12, folate, vitamin D",
      "Beck Depression Inventory (BDI) for severity assessment",
      "Ruling out bipolar disorder (history of manic/hypomanic episodes)",
      "Suicide risk assessment"
    ],
    treatments: [
      "First-line: Selective Serotonin Reuptake Inhibitors (SSRIs): Sertraline, Escitalopram, Fluoxetine",
      "SNRIs: Venlafaxine, Duloxetine (especially with pain comorbidity)",
      "Bupropion (also helpful for smoking cessation, weight-neutral)",
      "Mirtazapine (sedating, useful for insomnia and poor appetite)",
      "Cognitive Behavioral Therapy (CBT) — highly effective, equal to medication for mild-moderate",
      "Interpersonal Therapy (IPT)",
      "Combination of psychotherapy + medication for moderate-severe depression",
      "Electroconvulsive Therapy (ECT) for treatment-resistant depression or severe suicidality",
      "Transcranial Magnetic Stimulation (TMS) for treatment-resistant cases",
      "Esketamine (intranasal, Spravato) for treatment-resistant depression",
      "Lifestyle: Regular aerobic exercise (evidence-based), social engagement, sleep hygiene"
    ],
    prevention: [
      "Build and maintain strong social support networks",
      "Regular aerobic exercise (150 min/week)",
      "Adequate, consistent sleep (7–9 hours)",
      "Stress management and mindfulness-based interventions",
      "Cognitive Behavioral Therapy for relapse prevention",
      "Limit alcohol and avoid illicit drugs",
      "Continuation of antidepressants for ≥ 6–12 months after remission",
      "Early intervention for subthreshold depressive symptoms"
    ],
    whenToSeeDoctor: "Seek immediate help if having thoughts of suicide or self-harm (call 988 Suicide and Crisis Lifeline in the US). Schedule a doctor's visit if symptoms of low mood, anhedonia, and associated features persist for ≥ 2 weeks and interfere with daily functioning.",
    sources: ["DSM-5 (APA)", "WHO", "NICE Guidelines", "NIH/NIMH", "Mayo Clinic", "NHS"]
  },

  {
    id: "mental-002",
    disease: "Generalized Anxiety Disorder (GAD)",
    icd10: "F41.1",
    category: "mental health",
    overview: "Generalized Anxiety Disorder is a common mental health condition characterized by persistent, excessive, and difficult-to-control worry about a variety of everyday events or activities, lasting ≥ 6 months. It is associated with physical symptoms and significant functional impairment.",
    causes: [
      "Complex interplay of genetic, neurobiological, and environmental factors",
      "Dysregulation of the amygdala and prefrontal cortex (fear circuitry)",
      "Imbalance in GABA, serotonin, and norepinephrine neurotransmitter systems",
      "Psychological: Intolerance of uncertainty, cognitive avoidance, maladaptive beliefs",
      "Chronic stress and adverse life events",
      "Trauma history"
    ],
    riskFactors: [
      "Female sex (2x more prevalent in women)",
      "Family history of anxiety disorders",
      "Childhood trauma or adversity",
      "Chronic medical illness",
      "Substance use",
      "Neuroticism personality trait",
      "Low socioeconomic status",
      "Stressful life events or transitions"
    ],
    symptoms: [
      "Excessive, uncontrollable worry (≥ 6 months) about multiple areas (work, health, family, finances)",
      "Restlessness or feeling keyed up/on edge",
      "Being easily fatigued",
      "Difficulty concentrating (mind going blank)",
      "Irritability",
      "Muscle tension",
      "Sleep disturbances (difficulty falling or staying asleep)",
      "Physical symptoms: Headaches, GI disturbances, sweating, trembling",
      "Avoidance behaviors"
    ],
    diagnosis: [
      "Clinical interview based on DSM-5 criteria",
      "GAD-7 screening questionnaire (score ≥ 10 suggests GAD)",
      "Rule out medical causes (hyperthyroidism, cardiac arrhythmias, pheochromocytoma)",
      "TSH, ECG, CBC, metabolic panel",
      "Distinguish from other anxiety disorders (panic disorder, social anxiety, OCD, PTSD)"
    ],
    treatments: [
      "Cognitive Behavioral Therapy (CBT) — first-line psychological treatment",
      "Acceptance and Commitment Therapy (ACT)",
      "SSRIs: Escitalopram, Paroxetine (first-line pharmacotherapy)",
      "SNRIs: Duloxetine, Venlafaxine",
      "Buspirone (anxiolytic, non-addictive)",
      "Pregabalin (especially for somatic symptoms)",
      "Benzodiazepines (short-term use only due to dependence risk): Lorazepam, Diazepam",
      "Mindfulness-Based Stress Reduction (MBSR)",
      "Regular exercise, yoga",
      "Sleep hygiene optimization"
    ],
    prevention: [
      "Regular physical exercise",
      "Mindfulness and relaxation techniques",
      "Limiting caffeine and alcohol",
      "Building resilience through social support",
      "Early intervention and therapy for subclinical anxiety",
      "Stress management skills training"
    ],
    whenToSeeDoctor: "Seek care when worry is excessive, uncontrollable, present most days for ≥ 6 months, and significantly impairs daily functioning, relationships, or work. Seek urgent help if experiencing panic attacks with chest pain, palpitations, or difficulty breathing.",
    sources: ["DSM-5 (APA)", "NICE Guidelines", "NIH/NIMH", "Mayo Clinic", "NHS"]
  },

  {
    id: "mental-003",
    disease: "Schizophrenia",
    icd10: "F20",
    category: "mental health",
    overview: "Schizophrenia is a serious chronic mental health disorder characterized by disruptions in thought processes, perception, emotional responsiveness, and social functioning. It affects approximately 24 million people worldwide (~1 in 300, WHO). Typically emerges in late adolescence to early adulthood.",
    causes: [
      "Genetic factors (heritability ~80%; polygenic risk)",
      "Dopamine hyperactivity in mesolimbic pathway (positive symptoms)",
      "Glutamate/NMDA receptor dysfunction",
      "Neurodevelopmental abnormalities",
      "Prenatal infections, obstetric complications",
      "Cannabis use (particularly heavy adolescent use increases risk 2–4x)",
      "Urban environment and migration",
      "Childhood trauma and adversity"
    ],
    riskFactors: [
      "Family history of schizophrenia or psychosis",
      "Cannabis use in adolescence",
      "Advanced paternal age",
      "Obstetric complications",
      "Childhood trauma",
      "Urban birth/upbringing",
      "Migrant status",
      "Male sex (earlier onset)"
    ],
    symptoms: [
      "Positive symptoms (added behaviors): Hallucinations (auditory most common), delusions, disorganized thought/speech, disorganized or catatonic behavior",
      "Negative symptoms (diminished functions): Flat affect, alogia (poverty of speech), avolition, anhedonia, asociality",
      "Cognitive symptoms: Impaired working memory, attention, and executive function",
      "Mood symptoms: Depression, anxiety, suicidal ideation",
      "Symptoms must be present for ≥ 1 month (active phase) and overall disturbance ≥ 6 months (DSM-5)"
    ],
    diagnosis: [
      "Comprehensive psychiatric evaluation (DSM-5 criteria)",
      "Rule out medical causes: Brain MRI, TSH, drug screen, CBC, metabolic panel, vitamin B12",
      "Brief Psychiatric Rating Scale (BPRS) or PANSS (Positive and Negative Syndrome Scale)",
      "Neuropsychological testing",
      "EEG if seizures suspected"
    ],
    treatments: [
      "Antipsychotic medications (cornerstone of treatment):",
      "  Second-generation (atypical): Risperidone, Olanzapine, Quetiapine, Aripiprazole, Clozapine (for treatment-resistant cases)",
      "  First-generation (typical): Haloperidol, Chlorpromazine",
      "Long-acting injectable antipsychotics (LAIs) for adherence",
      "Clozapine — most effective for treatment-resistant schizophrenia (requires WBC monitoring)",
      "Psychosocial interventions: Cognitive Behavioral Therapy for psychosis (CBTp)",
      "Supported employment (Individual Placement and Support model)",
      "Social skills training",
      "Family therapy and psychoeducation",
      "Assertive Community Treatment (ACT) for severe cases",
      "Coordinated Specialty Care (CSC) for first-episode psychosis"
    ],
    prevention: [
      "No definitive prevention, but early intervention improves outcomes",
      "Avoid cannabis use especially in adolescence",
      "Early Psychosis Intervention Programs (EPIP)",
      "Address and treat prodromal symptoms",
      "Support mental health in pregnancy and early childhood"
    ],
    whenToSeeDoctor: "Seek immediate emergency care if person is a danger to themselves or others, severely confused, or unable to care for themselves. Seek urgent psychiatric evaluation for sudden behavioral changes, hallucinations, or delusions.",
    sources: ["DSM-5 (APA)", "WHO", "NICE Guidelines", "NIH/NIMH", "Mayo Clinic"]
  },

  // ─── LIFESTYLE-RELATED DISORDERS ─────────────────────────────────────────────

  {
    id: "lifestyle-001",
    disease: "Obesity",
    icd10: "E66",
    category: "lifestyle-related",
    overview: "Obesity is a complex chronic disease defined by excessive accumulation of adipose tissue resulting in adverse health effects. Defined as BMI ≥ 30 kg/m² (WHO). Obesity is a global epidemic affecting over 1 billion people worldwide and is a major risk factor for multiple non-communicable diseases.",
    causes: [
      "Chronic energy imbalance: caloric intake exceeds caloric expenditure",
      "Ultra-processed food consumption and food environment",
      "Physical inactivity and sedentary lifestyle",
      "Genetic predisposition (heritability ~40–70%)",
      "Gut microbiome dysbiosis",
      "Hormonal factors (leptin resistance, insulin resistance)",
      "Sleep deprivation",
      "Certain medications (antipsychotics, corticosteroids, insulin, antidepressants)",
      "Endocrine disorders: Hypothyroidism, Cushing's syndrome, PCOS",
      "Socioeconomic and environmental determinants"
    ],
    riskFactors: [
      "Family history of obesity",
      "High-calorie, nutrient-poor diet",
      "Physical inactivity",
      "Insufficient sleep (< 7 hours/night)",
      "Stress and emotional eating",
      "Low socioeconomic status",
      "Certain medications",
      "Underlying endocrine disorders",
      "Smoking cessation (temporary weight gain)"
    ],
    labValues: {
      bmiNormal: "BMI 18.5–24.9 kg/m²",
      bmiOverweight: "BMI 25–29.9 kg/m²",
      bmiObese1: "BMI 30–34.9 kg/m² (Class I)",
      bmiObese2: "BMI 35–39.9 kg/m² (Class II)",
      bmiObese3: "BMI ≥ 40 kg/m² (Class III / Severe obesity)",
      waistCircumference: "Increased metabolic risk: Men > 94cm (102cm high risk), Women > 80cm (88cm high risk)"
    },
    diagnosis: [
      "BMI calculation (weight kg / height m²)",
      "Waist circumference measurement",
      "Waist-to-hip ratio",
      "Body composition analysis (DEXA, bioelectrical impedance)",
      "Screening for complications: BP, lipid panel, fasting glucose/HbA1c, liver enzymes (NAFLD), sleep study",
      "Assess for secondary causes: TSH, cortisol if indicated"
    ],
    treatments: [
      "Behavioral/lifestyle intervention: caloric deficit (500–750 kcal/day deficit), structured physical activity (200–300 min/week), behavioral support",
      "Meal replacement programs (very low-calorie diets under supervision)",
      "Anti-obesity medications (adjunct to lifestyle):",
      "  Semaglutide (Wegovy) 2.4mg weekly — ~15% weight loss",
      "  Tirzepatide (Zepbound) — up to ~22% weight loss",
      "  Liraglutide (Saxenda) 3mg daily",
      "  Phentermine/topiramate (Qsymia)",
      "  Naltrexone/bupropion (Contrave)",
      "  Orlistat (inhibits fat absorption)",
      "Bariatric surgery (BMI ≥ 40, or ≥ 35 with comorbidities):",
      "  Roux-en-Y gastric bypass (most effective long-term)",
      "  Sleeve gastrectomy (most common procedure)",
      "  Adjustable gastric band",
      "Treat underlying conditions and comorbidities"
    ],
    prevention: [
      "Eat a balanced, minimally-processed diet rich in fruits, vegetables, whole grains, lean protein",
      "Limit sugar-sweetened beverages and ultra-processed foods",
      "Regular physical activity (150–300 min moderate/week)",
      "Adequate sleep (7–9 hours)",
      "Manage stress",
      "Supportive food environment policies",
      "Breastfeeding (protective in early life)"
    ],
    whenToSeeDoctor: "Discuss weight with a healthcare provider if BMI ≥ 30, or BMI ≥ 25 with weight-related health conditions (hypertension, diabetes, joint pain, sleep apnea). Seek urgent care for chest pain, severe dyspnea, or signs of cardiac complications.",
    sources: ["WHO", "CDC", "American Society for Metabolic and Bariatric Surgery (ASMBS)", "NIH/NIDDK", "Mayo Clinic", "NICE Guidelines"]
  },

  {
    id: "lifestyle-002",
    disease: "Non-Alcoholic Fatty Liver Disease (NAFLD) / Metabolic-Associated Steatotic Liver Disease (MASLD)",
    icd10: "K76.0",
    category: "lifestyle-related",
    overview: "NAFLD (now renamed MASLD — Metabolic-Associated Steatotic Liver Disease) is fat accumulation in the liver (≥ 5% of hepatocytes) in the absence of significant alcohol consumption, representing a spectrum from simple steatosis to NASH (nonalcoholic steatohepatitis), fibrosis, cirrhosis, and hepatocellular carcinoma. It affects ~25% of the global population.",
    causes: [
      "Insulin resistance (central pathophysiology)",
      "Excess caloric intake, particularly refined carbohydrates and saturated fat",
      "Visceral obesity",
      "Type 2 diabetes mellitus",
      "Dyslipidemia (high triglycerides, low HDL)",
      "Gut microbiome dysfunction",
      "Genetic factors (PNPLA3, TM6SF2 gene variants)",
      "Fructose overconsumption (high-fructose corn syrup)"
    ],
    riskFactors: [
      "Obesity (especially central/visceral)",
      "Type 2 diabetes",
      "Metabolic syndrome",
      "Dyslipidemia",
      "Hypertension",
      "Sedentary lifestyle",
      "Hypothyroidism",
      "Polycystic ovary syndrome",
      "Certain medications (tamoxifen, corticosteroids, amiodarone)"
    ],
    symptoms: [
      "Often asymptomatic (incidental finding on imaging)",
      "Fatigue",
      "Mild right upper quadrant discomfort",
      "Hepatomegaly on examination",
      "Advanced disease/cirrhosis: Jaundice, ascites, peripheral edema, easy bruising, portal hypertension"
    ],
    diagnosis: [
      "Liver enzymes: Elevated ALT, AST (AST/ALT ratio < 1 in NAFLD; > 2 suggests alcoholic disease)",
      "Abdominal ultrasound (hyperechoic liver — bright liver sign; poor sensitivity for early/mild steatosis)",
      "MRI-PDFF (most accurate non-invasive for quantifying liver fat)",
      "Controlled Attenuation Parameter (CAP) via FibroScan",
      "FIB-4 score (age × AST / PLT × √ALT) — non-invasive fibrosis assessment",
      "Liver biopsy (gold standard for staging NASH and fibrosis — reserved for cases where diagnosis/staging is uncertain)",
      "Exclude other liver diseases: viral hepatitis, autoimmune, Wilson's disease, hemochromatosis"
    ],
    treatments: [
      "Weight loss (7–10% of body weight reduces liver fat and inflammation significantly)",
      "Mediterranean diet",
      "Regular aerobic and resistance exercise",
      "Vitamin E (800 IU/day) — for biopsy-proven NASH in non-diabetics (per AASLD)",
      "Pioglitazone (for NASH with T2DM)",
      "Semaglutide and other GLP-1 agonists (shown to reduce liver fat and NASH activity in trials)",
      "Resmetirom (Rezdiffra) — FDA-approved 2024 for MASH with significant fibrosis",
      "Obeticholic acid (phase 3 trials showed fibrosis improvement)",
      "Management of comorbidities: BP, lipids, glycemic control",
      "Avoid hepatotoxins: alcohol, unnecessary medications, herbal supplements",
      "Liver transplantation for end-stage cirrhosis"
    ],
    prevention: [
      "Maintain healthy weight",
      "Follow Mediterranean-style diet",
      "Limit fructose, added sugars, and saturated fats",
      "Regular physical activity",
      "Limit or avoid alcohol",
      "Annual liver enzyme monitoring in diabetics and obese individuals"
    ],
    whenToSeeDoctor: "See a doctor for elevated liver enzymes on routine blood tests, unexplained fatigue, or right upper quadrant discomfort. Urgent care needed for jaundice, severe abdominal pain, or signs of liver failure.",
    sources: ["AASLD Practice Guidance 2023", "EASL Guidelines", "NIH/NIDDK", "WHO", "Mayo Clinic"]
  },

  // ─── PRIMARY CARE / COMMON CONDITIONS ────────────────────────────────────────

  {
    id: "primary-001",
    disease: "Iron Deficiency Anemia",
    icd10: "D50",
    category: "primary care",
    overview: "Iron deficiency anemia is the most common form of anemia worldwide, characterized by decreased hemoglobin synthesis due to insufficient iron stores. Iron is essential for hemoglobin production, oxygen transport, and cellular energy metabolism. It affects approximately 1.2 billion people globally (WHO).",
    causes: [
      "Inadequate iron intake (poor diet, restricted eating patterns)",
      "Increased iron requirements (pregnancy, infancy, adolescence, intense exercise)",
      "Chronic blood loss: GI bleeding (ulcers, IBD, colorectal cancer, NSAIDs), heavy menstrual bleeding (menorrhagia)",
      "Malabsorption: Celiac disease, Helicobacter pylori infection, post-gastric surgery, proton pump inhibitor use",
      "Hookworm and other parasitic infections (global cause)",
      "Intravascular hemolysis (paroxysmal nocturnal hemoglobinuria)"
    ],
    riskFactors: [
      "Women of childbearing age (menstrual losses)",
      "Pregnancy and breastfeeding",
      "Infants and young children (rapid growth)",
      "Vegetarian/vegan diet",
      "Frequent blood donation",
      "GI disorders (IBD, celiac disease)",
      "NSAID users",
      "Elderly (poor intake + GI blood loss)",
      "Endurance athletes (foot-strike hemolysis)"
    ],
    symptoms: [
      "Fatigue and weakness (most common)",
      "Pallor (pale skin, conjunctivae, nail beds)",
      "Shortness of breath on exertion",
      "Palpitations",
      "Dizziness and lightheadedness",
      "Headache",
      "Cold hands and feet",
      "Pica (craving for non-food items: ice, dirt, starch — called pagophagia, pica)",
      "Restless legs syndrome",
      "Koilonychia (spoon-shaped nails — classic sign)",
      "Angular cheilitis, glossitis",
      "Hair loss"
    ],
    labValues: {
      hemoglobin: "Men: < 13.0 g/dL; Women: < 12.0 g/dL; Pregnant: < 11.0 g/dL",
      mcv: "< 80 fL (microcytic)",
      ferritin: "< 12–15 ng/mL (depleted stores); < 30 ng/mL often diagnostic in symptomatic patients",
      transferrinSaturation: "< 16%",
      serumIron: "Low",
      tibc: "High (> 400 μg/dL)"
    },
    diagnosis: [
      "CBC: Low Hgb, low MCV, low MCHC, elevated RDW (microcytic hypochromic anemia)",
      "Serum ferritin (best single test for iron stores)",
      "Serum iron, TIBC, transferrin saturation",
      "Peripheral blood smear: microcytes, hypochromic cells, target cells",
      "Reticulocyte count (elevated after iron treatment — response marker)",
      "If cause unclear: stool occult blood test, upper/lower GI endoscopy, celiac antibodies (anti-tTG IgA)",
      "Exclude other causes of microcytic anemia: thalassemia (Hgb electrophoresis), anemia of chronic disease"
    ],
    treatments: [
      "Oral iron supplementation: Ferrous sulfate 325mg (65mg elemental iron) 1–3 times daily (most cost-effective)",
      "Take iron on empty stomach for better absorption, or with vitamin C",
      "Alternative oral iron: Ferrous gluconate, ferrous fumarate, iron polymaltose (better tolerated)",
      "IV iron (Ferric carboxymaltose, Iron sucrose): for malabsorption, intolerance to oral iron, severe anemia, pre-surgery, hemodialysis",
      "Treat underlying cause of blood loss (H. pylori eradication, celiac diet, menorrhagia management)",
      "Dietary advice: Increase heme iron (red meat, poultry, fish), non-heme iron (legumes, fortified cereals), vitamin C with meals",
      "Avoid iron inhibitors with meals: tea, coffee, calcium",
      "Blood transfusion for severe symptomatic anemia (Hgb < 7–8 g/dL)"
    ],
    prevention: [
      "Iron-rich diet: lean red meat, beans, lentils, dark leafy greens, fortified foods",
      "Eat vitamin C with plant-based iron sources",
      "Iron supplementation in pregnancy (routine)",
      "Routine iron supplementation for infants at risk",
      "Screen and treat heavy menstrual bleeding",
      "Screening for celiac disease and H. pylori in iron-deficient patients without obvious cause"
    ],
    whenToSeeDoctor: "See a doctor for fatigue, pallor, and shortness of breath. Seek urgent care for heart palpitations, chest pain, or syncope with anemia. GI blood loss requires prompt investigation to exclude colorectal cancer or peptic ulcer.",
    sources: ["WHO", "BSH Guidelines", "NIH/MedlinePlus", "Mayo Clinic", "NHS", "AAFP"]
  },

  {
    id: "primary-002",
    disease: "Hypothyroidism",
    icd10: "E03.9",
    category: "primary care",
    overview: "Hypothyroidism is a condition in which the thyroid gland fails to produce sufficient thyroid hormones (T3 and T4), leading to slowed metabolic processes throughout the body. Primary hypothyroidism (originating in the thyroid) is the most common form. Hashimoto's thyroiditis (autoimmune) is the leading cause in iodine-sufficient regions.",
    causes: [
      "Hashimoto's thyroiditis (autoimmune thyroiditis) — most common cause in developed countries",
      "Radioactive iodine therapy (post-treatment for hyperthyroidism or thyroid cancer)",
      "Thyroidectomy (surgical removal)",
      "Iodine deficiency — most common global cause",
      "Medications: Amiodarone, lithium, interferon-alpha, sunitinib",
      "Pituitary hypothyroidism (secondary): TSH deficiency",
      "Hypothalamic (tertiary): TRH deficiency",
      "Congenital hypothyroidism",
      "Transient: Postpartum thyroiditis, subacute thyroiditis"
    ],
    riskFactors: [
      "Female sex (5–8x more common in women)",
      "Age > 60",
      "Personal or family history of autoimmune disease",
      "History of thyroid problems or neck radiation",
      "Pregnancy (postpartum thyroiditis)",
      "Down syndrome or Turner syndrome",
      "Type 1 diabetes",
      "Certain medications"
    ],
    symptoms: [
      "Fatigue and sluggishness",
      "Weight gain despite normal appetite",
      "Cold intolerance",
      "Constipation",
      "Dry skin and hair",
      "Hair thinning or loss",
      "Bradycardia (slow heart rate)",
      "Depression and cognitive slowing ('brain fog')",
      "Menstrual irregularities (heavy periods)",
      "Hoarse voice",
      "Myxedema (non-pitting edema, particularly periorbital)",
      "Hyperlipidemia",
      "Goiter (in Hashimoto's and iodine deficiency)",
      "Myxedema coma (rare, life-threatening emergency with extreme hypothyroidism)"
    ],
    labValues: {
      tsh: "Elevated TSH: > 4.0–5.0 mIU/L (primary hypothyroidism)",
      ft4: "Low free T4: < 0.8 ng/dL (overt hypothyroidism)",
      subclinical: "TSH 4–10 mIU/L with normal free T4 = subclinical hypothyroidism"
    },
    diagnosis: [
      "TSH (third-generation assay) — best initial test",
      "Free T4 (fT4) — confirms overt vs subclinical",
      "Thyroid peroxidase antibodies (TPO-Ab) — positive in Hashimoto's",
      "Thyroglobulin antibodies (TgAb)",
      "Thyroid ultrasound (heterogeneous echotexture in Hashimoto's; goiter)",
      "CBC, lipid panel, CMP (abnormalities secondary to hypothyroidism)"
    ],
    treatments: [
      "Levothyroxine (LT4) — synthetic T4, gold standard treatment",
      "Starting dose: 1.6 mcg/kg/day (lower in elderly and cardiac patients)",
      "Take on empty stomach, 30–60 min before breakfast",
      "Avoid calcium, iron supplements, antacids within 4 hours",
      "Recheck TSH every 6–8 weeks after dose initiation or change",
      "Maintenance TSH target: 0.5–2.5 mIU/L",
      "Liothyronine (LT3) combination: considered in select patients with persistent symptoms",
      "Subclinical hypothyroidism treatment: Consider if TSH > 10 or symptomatic or pregnant",
      "Congenital hypothyroidism: Must be treated immediately to prevent intellectual disability"
    ],
    prevention: [
      "Adequate iodine intake (iodized salt, seafood, dairy) — prevents iodine-deficiency hypothyroidism",
      "Neonatal thyroid screening (TSH testing at birth) — universal in most countries",
      "Thyroid function monitoring during pregnancy and postpartum",
      "Regular TSH screening in women > 50 and those with autoimmune conditions"
    ],
    whenToSeeDoctor: "Seek medical care for unexplained fatigue, cold intolerance, weight gain, constipation, or depression — especially in women over 40. Seek emergency care for myxedema coma: confusion, hypothermia, extreme fatigue — this is a life-threatening emergency.",
    sources: ["ATA Guidelines", "NHS", "NIH/MedlinePlus", "Mayo Clinic", "WHO"]
  },

  {
    id: "primary-003",
    disease: "Migraine",
    icd10: "G43",
    category: "primary care",
    overview: "Migraine is a primary headache disorder characterized by recurrent episodes of moderate-to-severe, often unilateral, pulsating headache lasting 4–72 hours, associated with nausea, vomiting, and photophobia/phonophobia. It is the second leading cause of disability worldwide (GBD). Migraine with aura involves transient neurological symptoms preceding the headache.",
    causes: [
      "Trigeminovascular activation and neurogenic inflammation",
      "Cortical spreading depression (underlying aura mechanism)",
      "Calcitonin gene-related peptide (CGRP) release (key mediator)",
      "Genetic predisposition (FHM genes: CACNA1A, ATP1A2, SCN1A)",
      "Central sensitization",
      "Serotonin system dysregulation"
    ],
    riskFactors: [
      "Female sex (3x more common in women, related to hormonal fluctuations)",
      "Family history of migraines",
      "Hormonal changes (menstruation, oral contraceptives, menopause)",
      "Sleep disruption (too much or too little)",
      "Stress",
      "Skipping meals or dehydration",
      "Caffeine excess or withdrawal",
      "Certain foods (alcohol — especially red wine, aged cheese, processed meats)",
      "Bright lights, strong smells, weather changes",
      "Obesity"
    ],
    symptoms: [
      "Prodrome (hours-days before): Mood changes, food cravings, neck stiffness, frequent yawning",
      "Aura (in ~30%): Visual disturbances (scintillating scotoma, fortification spectra), numbness/tingling, speech disturbances — lasting 20–60 minutes",
      "Headache phase: Moderate-severe unilateral (60%) or bilateral pulsating pain; worsened by physical activity; 4–72 hours",
      "Nausea and/or vomiting",
      "Photophobia (sensitivity to light)",
      "Phonophobia (sensitivity to sound)",
      "Postdrome: Fatigue, cognitive difficulties ('migraine hangover') for up to 24 hours"
    ],
    diagnosis: [
      "Clinical diagnosis based on ICHD-3 criteria",
      "No laboratory tests or imaging required for typical migraine",
      "Brain MRI with/without contrast: If red flags present (worst headache of life, fever, papilledema, neurological deficits, new-onset > 50 years)",
      "Headache diary (tracks frequency, triggers, response to treatment)",
      "Screen for medication overuse headache (MOH): > 10–15 days/month triptan or analgesic use"
    ],
    treatments: [
      "Acute/abortive treatment:",
      "  Mild-moderate: NSAIDs (ibuprofen 400–600mg, naproxen), paracetamol/acetaminophen",
      "  Moderate-severe: Triptans (Sumatriptan, Rizatriptan, Eletriptan) — 5-HT1B/1D agonists",
      "  CGRP receptor antagonists (gepants): Ubrogepant, Rimegepant — no vasoconstriction (safe in cardiovascular disease)",
      "  Lasmiditan (5-HT1F agonist)",
      "  Antiemetics: Metoclopramide, Prochlorperazine",
      "  Dihydroergotamine (DHE) for status migrainosus",
      "Preventive therapy (if ≥ 4 migraine days/month or severe attacks):",
      "  Beta-blockers: Propranolol, Metoprolol",
      "  Tricyclics: Amitriptyline",
      "  Topiramate, Valproate",
      "  Anti-CGRP monoclonal antibodies: Erenumab (Aimovig), Fremanezumab (Ajovy), Galcanezumab (Emgality) — highly effective",
      "  Botulinum toxin type A (Botox) — for chronic migraine ≥ 15 days/month",
      "Non-pharmacological: Identify and avoid triggers, biofeedback, CBT, adequate sleep, regular meals"
    ],
    prevention: [
      "Identify and minimize personal triggers",
      "Maintain regular sleep schedule",
      "Stay hydrated",
      "Regular moderate exercise",
      "Limit caffeine",
      "Stress management",
      "Magnesium supplementation (400–600mg/day — evidence-based preventive)"
    ],
    whenToSeeDoctor: "Seek emergency care ('thunderclap headache') for worst headache of life, headache with fever and stiff neck, sudden onset severe headache, or headache with neurological deficits. See a neurologist for ≥ 4 headache days/month, increasing frequency, or poor response to treatment.",
    sources: ["ICHD-3 (IHS)", "AHS Guidelines", "NIH/NINDS", "NHS", "Mayo Clinic"]
  },

  {
    id: "primary-004",
    disease: "Gastroesophageal Reflux Disease (GERD)",
    icd10: "K21",
    category: "primary care",
    overview: "GERD is a chronic digestive disease where stomach acid or bile flows back into the esophagus (acid reflux), causing irritation of the esophageal lining. It affects ~13% of the global population. Chronic, untreated GERD can lead to Barrett's esophagus and esophageal adenocarcinoma.",
    causes: [
      "Lower esophageal sphincter (LES) dysfunction and relaxation",
      "Hiatal hernia (stomach protrudes through diaphragm)",
      "Delayed gastric emptying",
      "Increased intra-abdominal pressure (obesity, pregnancy, tight clothing)",
      "Transient LES relaxations triggered by distension"
    ],
    riskFactors: [
      "Obesity",
      "Pregnancy",
      "Hiatal hernia",
      "Smoking",
      "Large meals and lying down after eating",
      "Dietary triggers: fatty/fried foods, chocolate, caffeine, alcohol, citrus, tomatoes, spicy food, peppermint",
      "Certain medications: NSAIDs, calcium channel blockers, benzodiazepines, theophylline, bisphosphonates",
      "Connective tissue disorders (scleroderma)"
    ],
    symptoms: [
      "Heartburn: Burning sensation in chest, often after eating or at night",
      "Regurgitation of food or sour liquid",
      "Dysphagia (difficulty swallowing)",
      "Chest pain (atypical presentation — must differentiate from cardiac)",
      "Chronic cough",
      "Laryngitis, hoarse voice (laryngopharyngeal reflux)",
      "Sensation of lump in throat (globus)",
      "Worsening at night, when bending over, or lying flat",
      "Erosive esophagitis: odynophagia (painful swallowing)",
      "Barrett's esophagus: typically asymptomatic"
    ],
    diagnosis: [
      "Clinical diagnosis in typical uncomplicated GERD (heartburn + regurgitation)",
      "Trial of proton pump inhibitor (PPI test) — response confirms diagnosis",
      "Upper endoscopy (EGD): for alarm symptoms (dysphagia, weight loss, GI bleeding, age > 45, persistent symptoms)",
      "24-hour pH monitoring/impedance — gold standard for acid exposure quantification",
      "Esophageal manometry (for LES function, pre-surgical evaluation)",
      "Barium swallow (limited use)"
    ],
    treatments: [
      "Lifestyle modifications: elevate head of bed 15–20cm, avoid lying down 2–3 hours after meals, weight loss, avoid dietary triggers",
      "Antacids: Calcium carbonate, magnesium hydroxide — rapid symptom relief",
      "H2 blockers: Famotidine, Ranitidine (discontinued) — partial acid suppression",
      "Proton pump inhibitors (PPIs): Omeprazole, Esomeprazole, Lansoprazole, Pantoprazole — gold standard for healing esophagitis",
      "Take PPIs 30–60 minutes before first meal",
      "Alginate-antacid combinations: Gaviscon",
      "PPIs long-term: use lowest effective dose; consider H. pylori testing and eradication",
      "Surgical option: Laparoscopic Nissen fundoplication for refractory GERD",
      "LINX procedure (magnetic sphincter augmentation)"
    ],
    prevention: [
      "Maintain healthy weight",
      "Eat smaller, more frequent meals",
      "Avoid lying down within 3 hours of eating",
      "Avoid dietary triggers",
      "Elevate head of bed",
      "Quit smoking",
      "Limit alcohol and caffeine",
      "Avoid tight-fitting clothing"
    ],
    whenToSeeDoctor: "See a doctor for heartburn > 2 days/week unresponsive to OTC medications, or if experiencing dysphagia, odynophagia, unexplained weight loss, anemia, or vomiting blood (alarm features requiring urgent endoscopy). Chest pain should be evaluated urgently to exclude cardiac cause.",
    sources: ["ACG Guidelines 2022", "NICE", "NIH/MedlinePlus", "Mayo Clinic", "NHS"]
  },

  {
    id: "primary-005",
    disease: "Osteoporosis",
    icd10: "M81",
    category: "primary care",
    overview: "Osteoporosis is a skeletal disease characterized by decreased bone mass and deterioration of bone microarchitecture, leading to increased bone fragility and fracture risk. Defined by WHO as bone mineral density (BMD) T-score ≤ -2.5. It affects approximately 200 million people globally; postmenopausal women are most affected.",
    causes: [
      "Hormonal decline: Postmenopausal estrogen deficiency (primary cause in women), hypogonadism in men",
      "Aging (peak bone mass declines after 30–35 years)",
      "Secondary causes: Glucocorticoid use (most common drug-induced cause), hyperthyroidism, hyperparathyroidism, celiac disease, inflammatory bowel disease, rheumatoid arthritis, malabsorption syndromes",
      "Immobilization and disuse",
      "Vitamin D and calcium deficiency",
      "Alcohol excess and smoking"
    ],
    riskFactors: [
      "Female sex",
      "Age ≥ 65 (women), ≥ 70 (men)",
      "Postmenopausal status",
      "Low body weight (BMI < 18.5)",
      "Family history of osteoporosis or fragility fracture",
      "Prior fragility fracture",
      "Long-term glucocorticoid use (≥ 3 months)",
      "Smoking",
      "Alcohol > 3 units/day",
      "Vitamin D/calcium deficiency",
      "Sedentary lifestyle"
    ],
    labValues: {
      tScoreNormal: "T-score > -1.0 (normal bone mass)",
      tScoreOsteopenia: "T-score -1.0 to -2.5 (osteopenia/low bone mass)",
      tScoreOsteoporosis: "T-score ≤ -2.5 (osteoporosis)",
      severOsteoporosis: "T-score ≤ -2.5 + fragility fracture"
    },
    diagnosis: [
      "DEXA (Dual-energy X-ray absorptiometry) scan: BMD at lumbar spine and hip — gold standard",
      "WHO T-score criteria",
      "FRAX tool (Fracture Risk Assessment) — 10-year fracture probability",
      "Vertebral fracture assessment (VFA) via DEXA or lateral spine X-ray",
      "Lab workup to exclude secondary causes: calcium, phosphate, ALP, 25-OH vitamin D, PTH, TSH, testosterone (men), CBC, CMP, SPEP",
      "Bone turnover markers: CTX, P1NP (for monitoring treatment response)"
    ],
    treatments: [
      "Calcium: 1,000–1,200 mg/day total (diet + supplements); dietary sources preferred",
      "Vitamin D: 800–2,000 IU/day (maintain serum 25-OH Vitamin D ≥ 30 ng/mL)",
      "Bisphosphonates (first-line pharmacotherapy): Alendronate 70mg weekly, Risedronate, Zoledronic acid 5mg annual IV infusion",
      "Denosumab (Prolia): 60mg SC injection every 6 months — anti-RANKL; use in renal impairment",
      "Teriparatide (Forteo) and Abaloparatide: Anabolic agents — 2-year course for severe osteoporosis",
      "Romosozumab (Evenity): Sclerostin inhibitor — 12 months; anabolic + antiresorptive",
      "HRT (hormone replacement therapy) — for postmenopausal women with additional indications",
      "Fall prevention: Vitamin D, balance and strength training, home modifications",
      "Weight-bearing and resistance exercise",
      "Smoking cessation and alcohol reduction"
    ],
    prevention: [
      "Adequate calcium and vitamin D intake throughout life",
      "Regular weight-bearing exercise and strength training",
      "Quit smoking",
      "Limit alcohol",
      "Falls prevention measures",
      "DEXA screening: Women ≥ 65, men ≥ 70, and younger if risk factors present",
      "Minimize glucocorticoid exposure; prophylactic bisphosphonate if long-term use > 3 months"
    ],
    whenToSeeDoctor: "Seek care for back pain following minor fall or lift (possible vertebral fracture), loss of height > 4 cm, or if risk factors present and not yet screened. Fracture after minimal trauma requires urgent evaluation.",
    sources: ["NOF Guidelines", "IOF", "AACE", "NICE", "NIH/MedlinePlus", "Mayo Clinic"]
  },

  // ─── ADDITIONAL CONDITIONS ───────────────────────────────────────────────────

  {
    id: "chronic-006",
    disease: "Asthma",
    icd10: "J45",
    category: "chronic",
    overview: "Asthma is a chronic inflammatory disease of the airways characterized by variable, reversible airflow obstruction, airway hyper-responsiveness, and bronchospasm. Symptoms typically include recurrent wheezing, coughing, chest tightness, and dyspnea. It affects ~262 million people worldwide (WHO 2023).",
    causes: [
      "Airway inflammation mediated by eosinophils, mast cells, and T-helper 2 lymphocytes",
      "Genetic predisposition (multiple susceptibility genes including IL-4, IL-13, ORMDL3)",
      "Hygiene hypothesis: Reduced microbial exposure in early life",
      "Allergen sensitization",
      "Bronchial smooth muscle hyperresponsiveness"
    ],
    riskFactors: [
      "Allergic sensitization (atopy, allergic rhinitis, eczema)",
      "Family history of asthma or atopy",
      "Exposure to indoor allergens (dust mites, cockroaches, pet dander, mold)",
      "Outdoor air pollution and traffic-related pollution",
      "Tobacco smoke exposure (active and passive)",
      "Obesity",
      "Respiratory infections in early childhood",
      "Occupational exposures (baker's asthma, isocyanates, latex)"
    ],
    symptoms: [
      "Recurrent episodes of wheezing",
      "Dyspnea (shortness of breath)",
      "Chest tightness",
      "Cough (often nocturnal or early morning)",
      "Symptom variability — often worse at night, with exercise, cold air, allergen exposure",
      "Severe exacerbation: Accessory muscle use, inability to speak full sentences, silent chest (ominous sign)"
    ],
    diagnosis: [
      "Spirometry: FEV1/FVC < 0.75; ≥ 12% and 200mL improvement post-bronchodilator (reversibility)",
      "Peak expiratory flow (PEF) variability > 10–15%",
      "Bronchoprovocation (methacholine challenge) for atypical cases",
      "FeNO (fractional exhaled nitric oxide): > 25 ppb indicates eosinophilic airway inflammation",
      "Blood eosinophils (elevated in type 2 asthma)",
      "Allergy testing (skin prick or specific IgE — RAST/ImmunoCAP)",
      "Chest X-ray (to exclude other diagnoses)"
    ],
    treatments: [
      "Reliever (rescue): Short-acting beta-2 agonists (SABA): Salbutamol/Albuterol MDI",
      "Controller therapy (step-up approach per GINA 2024):",
      "  Step 1: As-needed low-dose ICS-formoterol (preferred) or SABA alone",
      "  Step 2: Regular low-dose ICS",
      "  Step 3: Low-dose ICS + LABA (e.g., Budesonide-Formoterol)",
      "  Step 4: Medium/high-dose ICS-LABA",
      "  Step 5: Add-on therapy: Tiotropium, Biologics (Dupilumab, Mepolizumab, Benralizumab, Omalizumab)",
      "Leukotriene receptor antagonists (LTRA): Montelukast (adjunct or alternative to ICS)",
      "Biologics: Anti-IL-5 (Mepolizumab, Benralizumab), Anti-IL-4/13 (Dupilumab), Anti-IgE (Omalizumab) for severe Type 2 asthma",
      "Acute exacerbation: SABA nebulization, systemic corticosteroids, ipratropium, IV magnesium sulfate, O2 therapy",
      "Allergen immunotherapy (SCIT/SLIT) for allergic asthma"
    ],
    prevention: [
      "Reduce allergen exposure: dust mite covers, HEPA filters, pet dander reduction",
      "Avoid tobacco smoke",
      "Vaccinations (influenza, pneumococcal)",
      "Identify and avoid personal triggers",
      "Written asthma action plan",
      "Regular adherence to ICS therapy",
      "Maintain healthy weight"
    ],
    whenToSeeDoctor: "Seek emergency care for severe dyspnea at rest, SpO2 < 92%, inability to speak, cyanosis, or peak flow < 50% predicted (severe exacerbation). See doctor if using SABA > 2 days/week for symptom relief (indicates poorly controlled asthma).",
    sources: ["GINA 2024 Report", "WHO", "NIH/NHLBI", "Mayo Clinic", "NHS", "NICE"]
  },

  {
    id: "chronic-007",
    disease: "Rheumatoid Arthritis (RA)",
    icd10: "M05",
    category: "chronic",
    overview: "Rheumatoid arthritis is a chronic, systemic autoimmune disease characterized by symmetric, erosive polyarthritis — primarily affecting synovial joints. Untreated, it leads to progressive joint destruction, disability, and increased cardiovascular risk. It affects ~1% of the global population, predominantly women.",
    causes: [
      "Autoimmune: T-cell and B-cell mediated synovial inflammation",
      "Autoantibodies: Rheumatoid factor (RF) and anti-citrullinated protein antibodies (ACPA/anti-CCP) are disease-specific",
      "Genetic factors: HLA-DRB1 shared epitope (strongest genetic risk factor)",
      "Environmental triggers: Smoking (strongest modifiable risk factor — doubles RA risk), microbiome dysbiosis, periodontitis"
    ],
    riskFactors: [
      "Female sex (3x more common in women)",
      "Age 40–60 years (peak onset)",
      "Smoking",
      "HLA-DRB1 positive genotype",
      "Family history of RA",
      "Obesity",
      "History of periodontitis",
      "Silica dust exposure"
    ],
    symptoms: [
      "Symmetric polyarthritis: wrists, MCP, PIP joints most commonly affected",
      "Morning stiffness > 1 hour (hallmark symptom — improves with activity)",
      "Tender, swollen, warm joints",
      "Fatigue",
      "Low-grade fever",
      "Weight loss",
      "Extra-articular features: Rheumatoid nodules (elbow, pressure points), sicca syndrome, interstitial lung disease, vasculitis, scleritis, pericarditis, Felty's syndrome (splenomegaly + neutropenia)"
    ],
    labValues: {
      antiCCP: "Anti-CCP antibody: Highly specific (> 95%) and sensitive for RA",
      rf: "Rheumatoid factor (RF): Positive in ~70–80% of RA patients",
      crp: "Elevated CRP and ESR (markers of systemic inflammation)",
      cbc: "Normocytic normochromic anemia of chronic disease; thrombocytosis in active disease"
    },
    diagnosis: [
      "2010 ACR/EULAR classification criteria (joint count, serology, acute-phase reactants, duration)",
      "RF and anti-CCP antibodies",
      "ESR and CRP",
      "CBC, CMP, LFTs, urinalysis",
      "X-rays of hands, wrists, feet (periarticular osteopenia, erosions, joint space narrowing)",
      "MRI and ultrasound (detect early synovitis and erosions before X-ray changes)",
      "Synovial fluid analysis (inflammatory: WBC 2,000–50,000/mm³)"
    ],
    treatments: [
      "Treat-to-target strategy: Goal is remission or low disease activity (DAS28 < 2.6)",
      "DMARDs (Disease-Modifying Anti-Rheumatic Drugs):",
      "  Methotrexate (MTX): First-line DMARD; 15–25mg weekly; supplement with folic acid",
      "  Hydroxychloroquine (mild disease)",
      "  Sulfasalazine",
      "  Leflunomide",
      "  DMARD combination therapy",
      "Biologic DMARDs (for inadequate response to csDMARDs):",
      "  Anti-TNF: Adalimumab, Etanercept, Infliximab, Certolizumab, Golimumab",
      "  Abatacept (CTLA-4-Ig, T-cell co-stimulation blockade)",
      "  Rituximab (anti-CD20, B-cell depletion)",
      "  Tocilizumab, Sarilumab (IL-6 receptor inhibitors)",
      "Targeted synthetic DMARDs (JAK inhibitors): Tofacitinib, Baricitinib, Upadacitinib",
      "NSAIDs and COX-2 inhibitors (symptomatic relief)",
      "Low-dose glucocorticoids (bridge therapy — minimize long-term use)",
      "Intra-articular corticosteroid injections",
      "Physical and occupational therapy, joint protection techniques"
    ],
    prevention: [
      "Smoking cessation (reduces risk and severity)",
      "Dental hygiene (periodontal disease treatment)",
      "Healthy weight maintenance",
      "No established definitive primary prevention",
      "Early aggressive treatment prevents joint damage"
    ],
    whenToSeeDoctor: "See a rheumatologist promptly for symmetric joint swelling, morning stiffness > 45 minutes, and positive RF/anti-CCP. Early treatment (within 3–6 months of onset) dramatically improves outcomes. Seek urgent care for acute joint swelling with fever (rule out septic arthritis).",
    sources: ["ACR/EULAR Guidelines 2022", "NICE", "NIH/NIAMS", "Mayo Clinic", "NHS"]
  },

  {
    id: "primary-006",
    disease: "Peptic Ulcer Disease (PUD)",
    icd10: "K27",
    category: "primary care",
    overview: "Peptic ulcer disease comprises ulcerations of the gastric or duodenal mucosa that penetrate through the muscularis mucosae. Duodenal ulcers (DU) are more common than gastric ulcers (GU). H. pylori infection and NSAID use are the two predominant causes.",
    causes: [
      "Helicobacter pylori infection (responsible for ~70% of duodenal and ~50% of gastric ulcers)",
      "NSAIDs and aspirin use (second most common — disrupts prostaglandin-mediated mucosal protection)",
      "Acid hypersecretory states: Zollinger-Ellison syndrome (gastrinoma)",
      "Stress ulcers (critically ill patients)",
      "Smoking (impairs mucosal healing, increases acid)",
      "Rare: Crohn's disease, CMV, HSV, idiopathic"
    ],
    riskFactors: [
      "H. pylori infection",
      "Regular NSAID or aspirin use",
      "Smoking",
      "Personal or family history of PUD",
      "Physiological stress (critical illness, burns, trauma)",
      "Corticosteroid use (combined with NSAIDs — greatly increased risk)",
      "Alcohol excess"
    ],
    symptoms: [
      "Epigastric pain: gnawing/burning pain (classic — usually improved by food in DU, worsened by food in GU)",
      "Nocturnal pain (wakes patient at 1–3 AM) — more common in DU",
      "Nausea and vomiting",
      "Bloating and early satiety",
      "Complications: Melena (dark, tarry stools) or hematemesis (vomiting blood) — GI bleeding",
      "Sudden severe abdominal pain (perforation — surgical emergency)",
      "Vomiting undigested food (gastric outlet obstruction)"
    ],
    diagnosis: [
      "Upper GI endoscopy (EGD): Gold standard — visualizes and biopsies ulcer (to exclude malignancy in GU)",
      "H. pylori testing: Urea breath test (most accurate non-invasive), stool antigen test, CLO rapid urease test (endoscopic biopsy), serology (can't distinguish active vs past infection)",
      "Upper GI barium study (if endoscopy unavailable)",
      "CBC (anemia with GI blood loss)",
      "Fasting serum gastrin (if Zollinger-Ellison suspected)"
    ],
    treatments: [
      "H. pylori eradication (if positive): Standard triple therapy × 14 days:",
      "  PPI + Clarithromycin + Amoxicillin",
      "  Or PPI + Bismuth + Metronidazole + Tetracycline (quadruple therapy)",
      "  Confirm eradication by urea breath test ≥ 4 weeks after treatment",
      "Proton pump inhibitors (PPIs): Omeprazole, Esomeprazole, Pantoprazole × 4–8 weeks",
      "H2 blockers: Famotidine (alternative if PPI intolerant)",
      "Sucralfate (mucosal protective agent)",
      "Bismuth subsalicylate",
      "Discontinue NSAIDs if possible; switch to COX-2 inhibitor + PPI if NSAIDs necessary",
      "GI bleed: IV PPI infusion, endoscopic hemostasis (injection, thermal, clips)",
      "Perforation: Emergency surgery"
    ],
    prevention: [
      "H. pylori eradication if positive",
      "Use lowest effective dose of NSAIDs for shortest duration",
      "Co-prescribe PPI with NSAIDs in high-risk patients",
      "Quit smoking",
      "Limit alcohol",
      "Consider misoprostol as NSAID gastroprotection in very high-risk patients"
    ],
    whenToSeeDoctor: "Seek emergency care for severe sudden abdominal pain (perforation), vomiting blood, or passing black/tarry stools (GI bleeding). See a doctor for persistent epigastric pain, especially with alarm features: weight loss, dysphagia, anemia, or age > 45.",
    sources: ["ACG Guidelines", "NICE", "NIH/MedlinePlus", "Mayo Clinic", "NHS"]
  },

  {
    id: "infectious-006",
    disease: "HIV/AIDS",
    icd10: "B20",
    category: "infectious",
    overview: "Human Immunodeficiency Virus (HIV) is a retrovirus that attacks CD4+ T-lymphocytes, progressively weakening the immune system. Without treatment, HIV infection leads to AIDS (Acquired Immunodeficiency Syndrome), defined by CD4 count < 200 cells/μL or an AIDS-defining illness. Modern antiretroviral therapy (ART) allows people with HIV to live near-normal lifespans.",
    causes: [
      "HIV-1 (global pandemic strain) and HIV-2 (primarily West Africa, less virulent)",
      "Transmitted via: Blood (shared needles, transfusions), sexual contact (anal sex highest risk, vaginal, oral), vertical (mother-to-child: pregnancy, delivery, breastfeeding)",
      "NOT transmitted via: casual contact, saliva, tears, sharing utensils, mosquito bites"
    ],
    riskFactors: [
      "Unprotected anal or vaginal intercourse",
      "Multiple sexual partners",
      "Other STIs (especially ulcerative: herpes, syphilis — increase HIV transmission 2–5x)",
      "Injection drug use with shared needles",
      "Blood transfusions in countries without universal screening",
      "Healthcare workers (needlestick — low risk ~0.3%)",
      "Uncircumcised male partners",
      "Mother-to-child transmission (untreated pregnancy)"
    ],
    symptoms: [
      "Acute HIV (2–4 weeks post-exposure): Fever, lymphadenopathy, pharyngitis, rash (morbilliform), myalgia, headache, oral ulcers — 'mono-like syndrome'",
      "Clinical latency: Asymptomatic (can last years without ART)",
      "Advanced HIV/AIDS: Weight loss > 10%, chronic diarrhea, recurrent fever, persistent lymphadenopathy",
      "AIDS-defining illnesses: Pneumocystis pneumonia (PCP), cryptococcal meningitis, CMV retinitis, toxoplasmosis, Kaposi's sarcoma, MAC infection, TB, NHL, HIV encephalopathy",
      "CD4 count < 200/μL without AIDS-defining illness = AIDS by laboratory criteria"
    ],
    labValues: {
      cd4Normal: "Normal CD4: 500–1,200 cells/μL",
      hivPositive: "Confirmed by: HIV-1/2 antibody-antigen test (4th generation) + HIV viral load",
      viralLoad: "Suppressed: < 200 copies/mL (treatment success); Undetectable = Untransmittable (U=U)",
      cd4Aids: "< 200 cells/μL defines AIDS"
    },
    diagnosis: [
      "HIV-1/2 Ag/Ab combination immunoassay (4th generation ELISA) — screening",
      "HIV-1 RNA viral load PCR (quantitative) — confirms acute infection and monitors treatment",
      "HIV-1 Western blot or supplemental antibody test (confirmatory)",
      "CD4+ T-lymphocyte count (staging and OI prophylaxis decisions)",
      "HIV resistance testing (genotype) before ART initiation",
      "HBsAg, HCV antibody (co-infection screening)",
      "STI screening, TB screen, baseline metabolic labs"
    ],
    treatments: [
      "Antiretroviral Therapy (ART) — recommended for ALL HIV-positive individuals regardless of CD4 count:",
      "Preferred regimens (per DHHS/WHO 2024):",
      "  Bictegravir/Tenofovir AF/Emtricitabine (Biktarvy) — single pill daily",
      "  Dolutegravir + Tenofovir + Emtricitabine (Triumeq)",
      "  Cabotegravir + Rilpivirine long-acting injectable (every 1–2 months)",
      "Goal: Achieve and maintain undetectable viral load (< 50 copies/mL)",
      "OI prophylaxis: Trimethoprim-sulfamethoxazole (PCP prophylaxis if CD4 < 200), Azithromycin (MAC if CD4 < 50)",
      "Pre-Exposure Prophylaxis (PrEP):",
      "  Emtricitabine/Tenofovir DF (Truvada) — daily oral",
      "  Cabotegravir injectable long-acting (every 2 months) — highly effective",
      "Post-Exposure Prophylaxis (PEP): Must start within 72 hours of exposure, for 28 days",
      "Treatment of AIDS-defining opportunistic infections"
    ],
    prevention: [
      "PrEP for high-risk HIV-negative individuals",
      "Consistent and correct condom use",
      "ART for HIV-positive individuals (Treatment as Prevention — TasP)",
      "Needle and syringe programs for PWID",
      "Voluntary medical male circumcision (reduces transmission by ~60% in heterosexual men)",
      "Universal HIV testing",
      "Prevention of mother-to-child transmission (PMTCT): ART throughout pregnancy, elective C-section if VL > 1000, formula feeding or breastfeeding with maternal/infant ART",
      "Blood supply screening"
    ],
    whenToSeeDoctor: "Get tested if any risk exposure, as early treatment dramatically improves outcomes. Start ART as soon as possible after diagnosis — same day if ready. Seek urgent care for any signs of opportunistic infection (severe dyspnea, confusion, vision changes) in known HIV-positive individuals.",
    sources: ["WHO 2024", "CDC", "DHHS HIV Treatment Guidelines 2024", "NIH/MedlinePlus", "UNAIDS", "Mayo Clinic"]
  },

  {
    id: "chronic-008",
    disease: "Heart Failure (HF)",
    icd10: "I50",
    category: "chronic",
    overview: "Heart failure is a clinical syndrome resulting from structural or functional cardiac abnormalities that impair the heart's ability to fill with or eject blood sufficiently to meet metabolic demands. HFrEF (Heart Failure with reduced ejection fraction, EF < 40%) and HFpEF (EF ≥ 50%) are the main subtypes. Affects ~64 million people worldwide.",
    causes: [
      "Coronary artery disease (CAD) / ischemic cardiomyopathy (most common cause)",
      "Hypertension (pressure overload)",
      "Dilated cardiomyopathy (idiopathic, viral, alcohol, peripartum)",
      "Valvular heart disease (aortic stenosis, mitral regurgitation)",
      "Hypertrophic cardiomyopathy",
      "Arrhythmias (atrial fibrillation — tachycardia-induced cardiomyopathy)",
      "Diabetes mellitus (diabetic cardiomyopathy)",
      "Cardiotoxins: Doxorubicin, trastuzumab",
      "Infiltrative disease: Amyloidosis, sarcoidosis",
      "Thyroid disease"
    ],
    riskFactors: [
      "Coronary artery disease",
      "Hypertension",
      "Diabetes mellitus",
      "Obesity",
      "Smoking",
      "Atrial fibrillation",
      "Family history of cardiomyopathy",
      "Heavy alcohol use",
      "Prior cardiotoxic chemotherapy",
      "Sleep apnea"
    ],
    symptoms: [
      "Dyspnea on exertion (progressive)",
      "Orthopnea (difficulty breathing when lying flat)",
      "Paroxysmal nocturnal dyspnea (waking from sleep short of breath)",
      "Bilateral lower extremity edema (pitting)",
      "Fatigue and exercise intolerance",
      "Nocturia",
      "Rapid weight gain (fluid retention > 2 kg/48h = decompensation)",
      "Persistent cough or wheezing ('cardiac asthma')",
      "Elevated JVP (jugular venous pressure), S3 gallop, displaced PMI on examination",
      "Acute pulmonary edema: sudden severe dyspnea, pink frothy sputum — emergency"
    ],
    labValues: {
      bnp: "BNP > 100 pg/mL (or NT-proBNP > 300 pg/mL) supports HF diagnosis; useful for monitoring",
      echo: "Ejection fraction by echocardiography: HFrEF < 40%, HFmrEF 41–49%, HFpEF ≥ 50%"
    },
    diagnosis: [
      "Clinical history and examination (Framingham criteria)",
      "BNP/NT-proBNP (best biomarker for HF diagnosis and monitoring)",
      "Echocardiography (transthoracic echo — essential: EF, structural/valvular abnormalities)",
      "ECG (arrhythmias, LVH, prior MI)",
      "Chest X-ray (cardiomegaly, pulmonary edema, pleural effusions, Kerley B lines)",
      "CBC, CMP, LFTs, TSH, iron studies",
      "Cardiopulmonary exercise testing (functional capacity)",
      "Cardiac MRI (myocardial viability, infiltrative disease)",
      "Coronary angiography (if ischemic etiology suspected)"
    ],
    treatments: [
      "HFrEF (EF < 40%) — Four pillars of therapy (\"fantastic four\"):",
      "  ACE inhibitor or ARB or ARNi (Sacubitril/Valsartan / Entresto — preferred) — reduces mortality",
      "  Beta-blockers: Carvedilol, Bisoprolol, Metoprolol succinate — reduces mortality",
      "  Mineralocorticoid receptor antagonists (MRAs): Spironolactone, Eplerenone",
      "  SGLT2 inhibitors: Dapagliflozin, Empagliflozin — reduce hospitalizations and mortality",
      "Diuretics: Furosemide, Torsemide (symptom management — decongestion)",
      "Ivabradine (for HR ≥ 70 bpm in sinus rhythm on max tolerated beta-blocker)",
      "Device therapy: ICD (if EF ≤ 35% on optimal medical therapy for > 3 months), CRT/CRT-D (LBBB + EF ≤ 35%)",
      "Heart transplantation (selected end-stage HF)",
      "LVAD (left ventricular assist device) as bridge to transplant or destination therapy",
      "HFpEF: SGLT2 inhibitors; treat underlying hypertension, AF; diuretics for congestion"
    ],
    prevention: [
      "Control hypertension (target BP < 130/80)",
      "Manage CAD (revascularization if indicated)",
      "Glycemic control in diabetes",
      "Achieve healthy weight",
      "Quit smoking",
      "Limit alcohol to 1–2 drinks/day (or less)",
      "Regular aerobic exercise",
      "Early cardiac rehabilitation post-MI"
    ],
    whenToSeeDoctor: "Seek emergency care for sudden severe dyspnea at rest, SpO2 < 90%, coughing pink frothy sputum (acute pulmonary edema), or unexplained sudden weight gain ≥ 2kg in 48 hours. Regular cardiology follow-up every 3–6 months for stable heart failure.",
    sources: ["ACC/AHA/HFSA 2022 Guidelines", "ESC HF Guidelines 2021", "NIH/NHLBI", "WHO", "Mayo Clinic"]
  },

  {
    id: "chronic-009",
    disease: "Atrial Fibrillation (AF/AFib)",
    icd10: "I48",
    category: "chronic",
    overview: "Atrial fibrillation is the most common sustained cardiac arrhythmia, characterized by chaotic, irregular atrial electrical activity, resulting in irregular ventricular response. It significantly increases the risk of stroke (5x), heart failure, and mortality. Affects > 43 million people globally.",
    causes: [
      "Hypertension (most common risk factor)",
      "Coronary artery disease",
      "Heart failure",
      "Valvular heart disease (especially mitral stenosis/regurgitation)",
      "Obstructive sleep apnea",
      "Hyperthyroidism",
      "Alcohol excess ('holiday heart syndrome')",
      "Pulmonary embolism",
      "Post-cardiac surgery",
      "Idiopathic/'Lone AF' (no identifiable cause, in young patients)"
    ],
    symptoms: [
      "Palpitations (awareness of irregular heartbeat)",
      "Dyspnea",
      "Fatigue",
      "Dizziness or lightheadedness",
      "Exercise intolerance",
      "Chest discomfort",
      "Syncope (fainting)",
      "Many patients are asymptomatic (incidental ECG finding)",
      "Stroke symptoms: facial droop, arm weakness, speech difficulty (FAST) — medical emergency"
    ],
    diagnosis: [
      "12-lead ECG: Irregularly irregular RR intervals, absent P waves, irregular fibrillatory baseline — gold standard",
      "Holter monitor or implantable loop recorder (for paroxysmal/intermittent AF)",
      "Echocardiography (TTE/TEE): Structural disease, left atrial thrombus before cardioversion",
      "Thyroid function tests (TSH)",
      "CBC, CMP, BNP",
      "Sleep study (if OSA suspected)",
      "CHA₂DS₂-VASc score (stroke risk assessment): ≥ 2 in men or ≥ 3 in women = anticoagulation indicated"
    ],
    treatments: [
      "Anticoagulation (priority — prevents stroke):",
      "  Direct oral anticoagulants (DOACs) preferred: Apixaban (Eliquis), Rivaroxaban (Xarelto), Dabigatran (Pradaxa), Edoxaban",
      "  Warfarin (INR 2.0–3.0) — for mitral stenosis or mechanical heart valves",
      "  NOT aspirin alone (insufficient for stroke prevention)",
      "Rate control (HR < 110 bpm at rest, < 80 if symptomatic):",
      "  Beta-blockers: Metoprolol, Atenolol",
      "  Non-dihydropyridine CCBs: Diltiazem, Verapamil",
      "  Digoxin (adjunct, less preferred)",
      "Rhythm control (restore sinus rhythm):",
      "  Antiarrhythmics: Flecainide, Propafenone (no structural disease); Amiodarone, Sotalol",
      "  Electrical cardioversion (DC cardioversion)",
      "  Catheter ablation (pulmonary vein isolation) — superior to antiarrhythmics for paroxysmal/persistent AF",
      "Treat underlying causes (hyperthyroidism, OSA, HF)",
      "Left atrial appendage closure (Watchman device) — for anticoagulation contraindication"
    ],
    prevention: [
      "Control hypertension",
      "Manage sleep apnea",
      "Limit alcohol",
      "Regular moderate exercise",
      "Maintain healthy weight",
      "Optimize thyroid function",
      "Manage heart failure and CAD"
    ],
    whenToSeeDoctor: "Call emergency services for sudden severe dyspnea, stroke symptoms (FAST), chest pain, or syncope. Seek same-day care for new palpitations with dizziness. If already on anticoagulation, do not stop without medical guidance.",
    sources: ["ACC/AHA/HRS 2023 AF Guidelines", "ESC 2020 AF Guidelines", "NIH/NHLBI", "Mayo Clinic"]
  },

  {
    id: "chronic-010",
    disease: "Inflammatory Bowel Disease (IBD): Crohn's Disease and Ulcerative Colitis",
    icd10: "K50/K51",
    category: "chronic",
    overview: "Inflammatory bowel disease (IBD) encompasses two distinct chronic inflammatory conditions of the GI tract: Crohn's disease (CD — can affect any segment from mouth to perianal area, transmural inflammation) and ulcerative colitis (UC — limited to colon and rectum, mucosal inflammation). Combined, IBD affects approximately 10 million people worldwide, primarily in high-income countries.",
    causes: [
      "Dysregulated immune response to gut microbiome in genetically susceptible individuals",
      "Genetic factors: > 240 susceptibility loci identified (NOD2, IL23R most prominent)",
      "Western diet (high fat, low fiber, ultra-processed foods)",
      "Altered gut microbiome (reduced diversity, dysbiosis)",
      "Appendectomy (protective for UC, variable for CD)",
      "Smoking: Protective for UC but worsens Crohn's disease"
    ],
    riskFactors: [
      "Family history of IBD (most significant risk factor — 10–25x increased risk in first-degree relatives)",
      "Ashkenazi Jewish ancestry",
      "Age 15–35 years (peak onset), second peak 50–70",
      "Urban lifestyle (hygiene hypothesis)",
      "Antibiotic use in childhood",
      "NSAIDs (may exacerbate or trigger IBD flares)",
      "Oral contraceptives (modest association)",
      "Smoking (CD)"
    ],
    symptoms: [
      "UC: Bloody diarrhea, mucus in stool, urgency, tenesmus (feeling of incomplete evacuation), left-sided/crampy abdominal pain",
      "CD: Crampy right lower quadrant pain (if ileocolitis), non-bloody diarrhea, weight loss, fatigue, perianal disease (fistulae, abscesses)",
      "Both: Fatigue, fever, anemia",
      "Extra-intestinal manifestations (EIMs): Uveitis/episcleritis, erythema nodosum, pyoderma gangrenosum, primary sclerosing cholangitis (UC), ankylosing spondylitis, peripheral arthritis",
      "Severe UC: Toxic megacolon — emergency (colonic dilatation > 6cm, fever, tachycardia, abdominal distension)"
    ],
    diagnosis: [
      "Colonoscopy with ileoscopy and biopsies (gold standard for diagnosis and differentiation)",
      "CT enterography / MRI enterography (Crohn's — small bowel assessment, fistulae, abscesses)",
      "Fecal calprotectin (marker of GI inflammation — guides endoscopy need, monitoring)",
      "CRP, ESR (disease activity)",
      "CBC: Anemia, leukocytosis, thrombocytosis",
      "Iron studies, vitamin B12, folate (malabsorption in CD)",
      "ANCA (pANCA — UC), ASCA (Saccharomyces — CD) serology (adjunctive)"
    ],
    treatments: [
      "5-Aminosalicylates (5-ASA/mesalazine): First-line for mild-moderate UC; limited role in CD",
      "Corticosteroids: Prednisone, budesonide — for induction only (not maintenance)",
      "Immunomodulators: Azathioprine, 6-mercaptopurine, methotrexate (CD) — steroid-sparing maintenance",
      "Biologic therapies:",
      "  Anti-TNF: Infliximab, Adalimumab, Golimumab (UC), Certolizumab (CD)",
      "  Anti-integrins: Vedolizumab (gut-selective — excellent safety profile)",
      "  Anti-IL-12/23: Ustekinumab",
      "  Anti-IL-23: Risankizumab, Mirikizumab (UC), Guselkumab",
      "Small molecule therapies: JAK inhibitors (Tofacitinib, Upadacitinib for UC), Ozanimod (S1P modulator)",
      "Surgery: Proctocolectomy (curative for UC); resection for CD complications (strictures, fistulae, abscesses, cancer)",
      "Treat-to-target: Mucosal healing endpoint"
    ],
    prevention: [
      "No definitive prevention identified",
      "Smoking cessation (especially for Crohn's patients)",
      "High-fiber, Mediterranean-style diet",
      "Avoid NSAIDs when possible",
      "Breastfeeding may be protective",
      "Annual colorectal cancer surveillance colonoscopy after 8–10 years of extensive colitis"
    ],
    whenToSeeDoctor: "Seek emergency care for severe abdominal pain, high fever, bloody diarrhea > 6 stools/day, severe distension (toxic megacolon — emergency). See a gastroenterologist promptly for persistent bloody diarrhea, unintentional weight loss, or suspected IBD.",
    sources: ["ECCO Guidelines", "ACG Guidelines", "NIH/NIDDK", "Mayo Clinic", "Crohn's and Colitis Foundation", "NHS"]
  },

  {
    id: "mental-004",
    disease: "Post-Traumatic Stress Disorder (PTSD)",
    icd10: "F43.1",
    category: "mental health",
    overview: "PTSD is a psychiatric disorder that may develop after exposure to or witnessing a traumatic event (actual or threatened death, serious injury, sexual violence). It is characterized by intrusive symptoms, avoidance, negative cognitions/mood, and hyperarousal. Affects approximately 20% of trauma survivors.",
    causes: [
      "Direct trauma: combat, assault, rape, accident, natural disaster",
      "Witnessed trauma: observing injury or death",
      "Indirect trauma: learning about violent or sudden death of close person",
      "Repeated occupational exposure (first responders, healthcare workers)",
      "Neurobiological: Dysregulation of amygdala-prefrontal cortex circuits, HPA axis hyperactivation, elevated norepinephrine, impaired fear extinction"
    ],
    riskFactors: [
      "Severity and duration of trauma",
      "Prior trauma exposure",
      "Female sex (2x more likely to develop PTSD post-trauma)",
      "Peritraumatic dissociation",
      "Lack of social support",
      "Prior mental health history",
      "Genetic factors (serotonin transporter polymorphisms)",
      "Combat exposure",
      "Childhood adversity"
    ],
    symptoms: [
      "Criterion B — Intrusion: Flashbacks, nightmares, intrusive memories, intense distress to trauma reminders",
      "Criterion C — Avoidance: Of trauma-related thoughts, feelings, people, places",
      "Criterion D — Negative cognitions/mood: Distorted blame, persistent negative emotions, detachment, anhedonia, amnesia for trauma aspects",
      "Criterion E — Hyperarousal: Hypervigilance, exaggerated startle response, sleep disturbances, angry outbursts, concentration problems, reckless behavior",
      "Symptoms duration > 1 month; associated with significant impairment (DSM-5)"
    ],
    diagnosis: [
      "Clinical interview based on DSM-5 criteria",
      "PCL-5 (PTSD Checklist for DSM-5) — validated screening tool",
      "Clinician-Administered PTSD Scale (CAPS-5) — gold standard diagnostic interview",
      "Functional impairment assessment",
      "Comorbidity screening: Depression, substance use, traumatic brain injury"
    ],
    treatments: [
      "First-line psychotherapies (most evidence):",
      "  Prolonged Exposure (PE) therapy",
      "  Cognitive Processing Therapy (CPT)",
      "  Eye Movement Desensitization and Reprocessing (EMDR)",
      "  Trauma-Focused CBT",
      "First-line pharmacotherapy: SSRIs — Sertraline, Paroxetine (FDA approved for PTSD)",
      "SNRIs: Venlafaxine",
      "Prazosin (alpha-1 blocker — specifically for PTSD nightmares)",
      "Emerging: MDMA-assisted therapy (Phase 3 trials, compassionate use in some countries)",
      "Ketamine/esketamine (research phase for treatment-resistant PTSD)",
      "Avoid benzodiazepines (may impair fear extinction; worsen prognosis)"
    ],
    prevention: [
      "Psychological first aid (PFA) immediately post-trauma",
      "Social support mobilization after trauma",
      "Early psychological debriefing (evidence limited)",
      "Propranolol (in research — may blunt memory consolidation if given immediately post-trauma)",
      "Building resilience and social support networks",
      "Screening high-risk populations (combat veterans, sexual assault survivors, ICU survivors)"
    ],
    whenToSeeDoctor: "Seek help promptly if trauma-related symptoms persist > 1 month and impair functioning. Seek immediate help for suicidal thoughts or self-harm behaviors — common in PTSD.",
    sources: ["DSM-5 (APA)", "VA/DoD PTSD Guidelines", "NICE", "NIH/NIMH", "Mayo Clinic", "WHO ICD-11"]
  },

  {
    id: "primary-007",
    disease: "Hyperlipidemia (Dyslipidemia)",
    icd10: "E78",
    category: "primary care",
    overview: "Hyperlipidemia refers to elevated levels of lipids in the bloodstream, primarily LDL cholesterol and/or triglycerides, and/or low HDL cholesterol. Dyslipidemia is a major modifiable risk factor for atherosclerotic cardiovascular disease (ASCVD), including coronary artery disease, stroke, and peripheral arterial disease.",
    causes: [
      "Primary (familial): Familial hypercholesterolemia (FH — LDL receptor mutations, very high LDL); Familial hypertriglyceridemia",
      "Secondary: Hypothyroidism, diabetes mellitus, obesity, chronic kidney disease, nephrotic syndrome, cholestatic liver disease",
      "Medications: Corticosteroids, thiazides, beta-blockers, antiretrovirals, isotretinoin",
      "Diet: High saturated fat, trans fat, and cholesterol intake",
      "Lifestyle: Sedentary behavior, alcohol excess"
    ],
    riskFactors: [
      "Family history of hyperlipidemia or premature cardiovascular disease",
      "Obesity",
      "Sedentary lifestyle",
      "High-saturated-fat diet",
      "Diabetes mellitus",
      "Hypothyroidism",
      "Smoking",
      "Alcohol excess",
      "Age (increases with age)"
    ],
    labValues: {
      ldlOptimal: "LDL < 100 mg/dL (optimal for most); < 70 mg/dL (very high CV risk); < 55 mg/dL (extremely high risk)",
      hdlLow: "HDL < 40 mg/dL (men), < 50 mg/dL (women) = low HDL (increased risk)",
      triglyceridesNormal: "Triglycerides < 150 mg/dL (normal); ≥ 500 mg/dL (pancreatitis risk)",
      totalCholesterol: "Total cholesterol: < 200 mg/dL (desirable)"
    },
    diagnosis: [
      "Fasting lipid panel: Total cholesterol, LDL-C, HDL-C, triglycerides, non-HDL cholesterol",
      "Non-fasting lipid panel acceptable for initial screening",
      "ApoB (alternative LDL risk marker)",
      "Lp(a) — independent risk factor; measure once in lifetime per guidelines",
      "ASCVD 10-year risk calculator (ACC/AHA Pooled Cohort Equations)",
      "Coronary artery calcium (CAC) score — for risk reclassification in borderline risk",
      "Screen for secondary causes if LDL > 190 or TG > 500: TSH, glucose/HbA1c, renal/hepatic function"
    ],
    treatments: [
      "Therapeutic lifestyle changes (first-line and adjunct):",
      "  Heart-healthy diet: Reduce saturated fat (< 6% calories), eliminate trans fats, increase soluble fiber",
      "  Regular aerobic exercise",
      "  Weight reduction",
      "  Limit alcohol; quit smoking",
      "Statins (first-line pharmacotherapy — most evidence-based):",
      "  High-intensity: Atorvastatin 40–80mg, Rosuvastatin 20–40mg (reduce LDL by ≥ 50%)",
      "  Moderate-intensity: Atorvastatin 10–20mg, Simvastatin 20–40mg, Pravastatin",
      "Ezetimibe (add-on to statin or monotherapy): Reduces LDL by 15–25% additional",
      "PCSK9 inhibitors: Evolocumab (Repatha), Alirocumab (Praluent) — reduce LDL 50–70%; for FH, ASCVD on max statin",
      "Inclisiran (siRNA against PCSK9 — twice-yearly injection)",
      "Bempedoic acid (oral PCSK9 alternative for statin-intolerant patients)",
      "For hypertriglyceridemia: Fibrates (Fenofibrate), omega-3 fatty acids (icosapentaenoic acid — Vascepa)",
      "Bile acid sequestrants: Cholestyramine, Colesevelam (LDL reduction, GI side effects)"
    ],
    prevention: [
      "Heart-healthy diet throughout life",
      "Regular aerobic exercise",
      "Maintain healthy weight",
      "Avoid smoking",
      "Limit alcohol",
      "Routine lipid screening: Adults age ≥ 20 every 5 years; more frequent for high-risk individuals",
      "Screen children with FH family history from age 2–8"
    ],
    whenToSeeDoctor: "No specific emergency for hyperlipidemia itself, but see a doctor for routine lipid screening. Urgent evaluation for LDL > 190 mg/dL (possible familial hypercholesterolemia) or symptoms of cardiovascular disease (chest pain, stroke symptoms).",
    sources: ["ACC/AHA 2018 Cholesterol Guidelines", "NIH/MedlinePlus", "CDC", "Mayo Clinic", "ESC/EAS 2019 Lipid Guidelines"]
  },

  {
    id: "primary-008",
    disease: "Gout",
    icd10: "M10",
    category: "primary care",
    overview: "Gout is an inflammatory arthritis caused by deposition of monosodium urate (MSU) crystals in joints and periarticular tissues, resulting from chronic hyperuricemia. It is the most common inflammatory arthritis in adults. Characterized by sudden, severe attacks of joint pain, swelling, and redness (gouty flares), typically affecting the first metatarsophalangeal joint (podagra).",
    causes: [
      "Uric acid overproduction: High purine diet, excessive alcohol (especially beer), rapid cell turnover (psoriasis, hemolytic anemia, myeloproliferative disorders), inherited enzyme defects (Lesch-Nyhan syndrome)",
      "Uric acid underexcretion: Chronic kidney disease (most common), hypertension, thiazide diuretics, low-dose aspirin, cyclosporine, lead nephropathy",
      "Combination: Mixed overproduction and underexcretion"
    ],
    riskFactors: [
      "Male sex (higher baseline uric acid; pre-menopause estrogen is uricosuric in women)",
      "Age (older adults — post-menopause in women)",
      "Diet: Red meat, organ meats, shellfish, high-fructose corn syrup, alcohol",
      "Obesity",
      "Hypertension",
      "Chronic kidney disease",
      "Diuretic use (especially thiazides, loop diuretics)",
      "Cyclosporine (transplant recipients)",
      "Metabolic syndrome"
    ],
    labValues: {
      hyperuricemia: "Serum uric acid > 6.8 mg/dL (> 408 μmol/L) = hyperuricemia (crystals can form)",
      target: "Treatment target: Serum uric acid < 6.0 mg/dL (< 360 μmol/L); < 5.0 mg/dL for tophi"
    },
    symptoms: [
      "Acute gouty arthritis: Sudden onset of severe joint pain, typically at night; marked swelling, warmth, redness, and exquisite tenderness (even bedsheet contact unbearable)",
      "Most common site: 1st metatarsophalangeal joint (podagra) — ~50% of first attacks",
      "Other sites: Ankle, knee, mid-foot, wrist",
      "Spontaneously resolves in 7–14 days even without treatment",
      "Intercritical period: Asymptomatic between attacks",
      "Chronic tophaceous gout: Firm, white, chalky deposits (tophi) over joints, ears, bursae — seen after years of recurrent attacks",
      "Uric acid kidney stones (nephrolithiasis)",
      "Systemic symptoms: Fever and leukocytosis during acute attacks"
    ],
    diagnosis: [
      "Synovial fluid analysis with polarized microscopy: Needle-shaped, negatively birefringent urate crystals — gold standard",
      "Serum uric acid (note: may be normal during acute attack — urate shifts to joints)",
      "CBC, CMP, renal function",
      "Dual-energy CT scan (DECT): Non-invasive detection of urate crystals",
      "Musculoskeletal ultrasound: Double contour sign (urate on cartilage surface)",
      "X-ray (late disease): 'Rat-bite' erosions with overhanging edges"
    ],
    treatments: [
      "Acute gouty flare treatment:",
      "  NSAIDs: Indomethacin or Naproxen — start immediately",
      "  Colchicine: 1.2mg then 0.6mg 1 hour later (low-dose regimen — as effective as high-dose, fewer GI side effects)",
      "  Corticosteroids: Prednisone 30–40mg/day × 5 days (if NSAIDs/colchicine contraindicated)",
      "  Intra-articular corticosteroid injection for monoarthritis",
      "  Canakinumab (IL-1β inhibitor) for frequent flares with contraindications to above",
      "Urate-lowering therapy (ULT — for recurrent flares, tophi, uric acid kidney stones):",
      "  Allopurinol (first-line): Start low (50–100mg/day), titrate to achieve SUA < 6.0 mg/dL; check HLA-B*58:01 in Asians (risk of severe skin reactions)",
      "  Febuxostat (second-line): More potent xanthine oxidase inhibitor",
      "  Probenecid (uricosuric — if underexcretor, normal renal function, no kidney stones)",
      "  Pegloticase (Krystexxa): IV biologic enzyme — for refractory chronic tophaceous gout",
      "Prophylaxis during ULT initiation: Colchicine 0.6mg once or twice daily × 6 months (prevents mobilization flares)"
    ],
    prevention: [
      "Maintain healthy weight",
      "Low-purine diet: Limit red meat, organ meats, shellfish",
      "Avoid high-fructose corn syrup and sugary drinks",
      "Limit or eliminate alcohol (especially beer and spirits)",
      "Stay well-hydrated (decreases urate crystallization)",
      "Switch from thiazide diuretics to alternatives if possible (consult physician)",
      "Regular serum uric acid monitoring and ULT adherence",
      "Cherries and cherry extract (modest evidence for reducing flare frequency)"
    ],
    whenToSeeDoctor: "Seek urgent care for first joint attack with fever (rule out septic arthritis). See a doctor for recurring attacks (≥ 2/year), evidence of tophi, or kidney stones. Emergency care if can't bear weight, severe joint swelling with high fever.",
    sources: ["ACR 2020 Gout Guidelines", "EULAR Guidelines", "NIH/NIAMS", "NIH/MedlinePlus", "Mayo Clinic", "NHS"]
  },

  {
    id: "infectious-007",
    disease: "Malaria",
    icd10: "B50-B54",
    category: "infectious",
    overview: "Malaria is a life-threatening parasitic disease transmitted by bites of infected female Anopheles mosquitoes. Caused by Plasmodium species (P. falciparum — most severe and common; P. vivax; P. ovale; P. malariae; P. knowlesi). WHO reported ~249 million cases and ~608,000 deaths in 2022, predominantly in Sub-Saharan Africa.",
    causes: [
      "Plasmodium falciparum (most severe, majority of global deaths)",
      "Plasmodium vivax (most geographically widespread, can relapse from liver hypnozoites)",
      "Plasmodium ovale (relapsing malaria)",
      "Plasmodium malariae (mild, chronic quartan malaria)",
      "Plasmodium knowlesi (zoonotic, Southeast Asia — can be severe)"
    ],
    riskFactors: [
      "Travel to or residence in malaria-endemic areas (Sub-Saharan Africa, South/Southeast Asia, Latin America)",
      "Lack of malaria prophylaxis",
      "No access to insecticide-treated bed nets",
      "Pregnancy (increases severity risk and maternal/infant mortality)",
      "Children < 5 years (highest mortality group)",
      "Immunocompromised individuals",
      "Sickle cell trait (protective for P. falciparum — partial resistance)",
      "Blood transfusion (rare)"
    ],
    symptoms: [
      "Classic malaria paroxysm: Cold stage (shaking chills) → Hot stage (high fever 39–41°C) → Sweating stage (diaphoresis, defervescence)",
      "Headache, myalgia (muscle aches)",
      "Nausea, vomiting",
      "Fatigue",
      "Splenomegaly (chronic/repeated infections)",
      "Hepatomegaly",
      "Anemia and jaundice (hemolysis)",
      "Severe P. falciparum malaria: Cerebral malaria (seizures, coma, altered consciousness), severe anemia (Hgb < 7 g/dL), respiratory distress, acute kidney injury, hypoglycemia, hyperparasitemia (> 5%)"
    ],
    diagnosis: [
      "Thick and thin peripheral blood smears with Giemsa stain — gold standard (species identification, parasite density)",
      "Rapid diagnostic tests (RDTs): HRP-2 antigen (P. falciparum specific) or pLDH — bedside diagnosis",
      "PCR (most sensitive — distinguishes species, detects low parasitemia, drug resistance markers)",
      "CBC: Thrombocytopenia, anemia (hemolytic)",
      "CMP: Hypoglycemia, elevated bilirubin, creatinine (in severe malaria)",
      "Blood glucose (critical — hypoglycemia common in severe falciparum and with quinine treatment)"
    ],
    treatments: [
      "Uncomplicated P. falciparum (in areas with chloroquine resistance):",
      "  Artemisinin-based combination therapy (ACT) — WHO first-line:",
      "  Artemether-lumefantrine (Coartem) × 3 days (most widely used)",
      "  Artesunate-amodiaquine or artesunate-mefloquine",
      "Uncomplicated P. vivax/ovale:",
      "  Chloroquine (where sensitive) + Primaquine 14 days (radical cure — eliminates hypnozoites; check G6PD before)",
      "  ACT + Primaquine in chloroquine-resistant P. vivax regions",
      "Severe/complicated P. falciparum malaria (ICU):",
      "  IV Artesunate (superior to IV quinine) — WHO recommendation",
      "  Followed by oral ACT to complete treatment",
      "  Adjunctive: IV dextrose for hypoglycemia, transfusion for severe anemia, mechanical ventilation for ARDS",
      "Malaria in pregnancy: Quinine + Clindamycin (1st trimester); ACT (2nd/3rd trimester)"
    ],
    prevention: [
      "Chemoprophylaxis for travelers: Atovaquone-proguanil (Malarone), Doxycycline, Mefloquine — based on region and resistance patterns",
      "Insecticide-treated bed nets (ITNs) — most effective vector control",
      "Indoor residual spraying (IRS)",
      "DEET-containing mosquito repellents (50% DEET)",
      "Protective clothing (long sleeves, pants at dusk/dawn)",
      "RTS,S/AS01 (Mosquirix) malaria vaccine — approved by WHO in 2021 for African children ≥ 5 months",
      "R21/Matrix-M vaccine — second approved malaria vaccine (WHO 2023)",
      "Seasonal malaria chemoprevention (SMC) in high-burden African children",
      "Intermittent preventive treatment in pregnancy (IPTp) with sulfadoxine-pyrimethamine"
    ],
    whenToSeeDoctor: "Seek emergency care for any fever within 3 months of travel to malaria-endemic area — malaria can be fatal within 24 hours if untreated. Treat as medical emergency until malaria is excluded. Children with fever in Africa require immediate evaluation.",
    sources: ["WHO World Malaria Report 2023", "CDC", "ACOG", "NIH/NIAID", "Mayo Clinic"]
  },

  {
    id: "primary-009",
    disease: "Allergic Rhinitis",
    icd10: "J30",
    category: "primary care",
    overview: "Allergic rhinitis is an IgE-mediated inflammatory condition of the nasal mucosa triggered by allergen exposure. It is one of the most prevalent chronic diseases worldwide, affecting 10–40% of the global population. Strongly associated with asthma, eczema, and sinusitis (the 'united airway' concept). Classified as seasonal (hay fever), perennial, or episodic.",
    causes: [
      "IgE-mediated Type I hypersensitivity reaction to inhaled allergens",
      "Seasonal allergens: Tree pollen (spring), grass pollen (summer), weed pollen (autumn)",
      "Perennial allergens: House dust mites (Dermatophagoides), pet dander (cats, dogs), mold spores, cockroach allergens"
    ],
    riskFactors: [
      "Personal or family history of atopy (asthma, eczema, allergic rhinitis)",
      "Exposure to allergens",
      "Air pollution",
      "First-born child (less microbial exposure — hygiene hypothesis)",
      "Early use of antibiotics",
      "Urban living"
    ],
    symptoms: [
      "Rhinorrhea: Thin, watery nasal discharge",
      "Nasal congestion/obstruction",
      "Sneezing (particularly paroxysmal)",
      "Nasal and ocular pruritus (itching)",
      "Allergic conjunctivitis: Red, watery, itchy eyes",
      "Post-nasal drip (chronic cough, throat clearing)",
      'Allergic "salute" (pushing nose upward), "allergic shiners" (infraorbital darkening)',
      "Symptoms typically immediately after allergen exposure",
      "Associated asthma worsening during pollen season"
    ],
    diagnosis: [
      "Clinical diagnosis based on history and symptom pattern",
      "Skin prick test (SPT): Gold standard for allergen identification",
      "Serum specific IgE (RAST/ImmunoCAP): Blood test alternative to SPT",
      "Nasal smear (eosinophilia in allergic rhinitis)",
      "Nasal endoscopy (if sinusitis or polyps suspected)",
      "ARIA (Allergic Rhinitis and its Impact on Asthma) classification: Intermittent vs Persistent; Mild vs Moderate-Severe",
      "Total serum IgE (elevated in atopic individuals — not diagnostic alone)"
    ],
    treatments: [
      "Allergen avoidance: Dust mite covers, HEPA air purifiers, minimize outdoor exposure during peak pollen, pet restriction",
      "Intranasal corticosteroids (INS): Most effective medication (mometasone, fluticasone, budesonide) — first-line",
      "Antihistamines: 2nd-generation non-sedating (Cetirizine, Loratadine, Fexofenadine) preferred over 1st-generation (sedating)",
      "Intranasal antihistamines: Azelastine (fast-acting, good for breakthrough symptoms)",
      "Combination: Intranasal fluticasone + azelastine (Dymista) — superior to either alone",
      "Decongestants: Pseudoephedrine (oral — short term); Oxymetazoline (nasal — max 3 days to avoid rebound congestion/rhinitis medicamentosa)",
      "Leukotriene receptor antagonists: Montelukast (useful when asthma coexists)",
      "Nasal saline irrigation (adjunct — removes allergens and mucus)",
      "Allergen immunotherapy (AIT): Subcutaneous (SCIT) or sublingual (SLIT) — induces long-term tolerance; only disease-modifying treatment"
    ],
    prevention: [
      "Reduce allergen exposure in home (HEPA vacuum, mattress covers)",
      "Monitor pollen counts and limit outdoor activity on high-count days",
      "Keep windows closed during pollen season",
      "Shower after outdoor activity to remove pollen",
      "Allergen immunotherapy for long-term prevention of progression to asthma"
    ],
    whenToSeeDoctor: "See a doctor for symptoms significantly impairing sleep or daily functioning, or if OTC treatments are insufficient. See an allergist for allergy testing and consideration of immunotherapy. Seek urgent care for severe dyspnea (associated asthma attack).",
    sources: ["ARIA Guidelines 2020", "BSACI", "AAAAI", "NIH/MedlinePlus", "Mayo Clinic", "WHO"]
  },

  {
    id: "primary-010",
    disease: "Celiac Disease",
    icd10: "K90.0",
    category: "primary care",
    overview: "Celiac disease is a chronic autoimmune disorder triggered by the ingestion of gluten (a protein in wheat, barley, and rye) in genetically predisposed individuals (HLA-DQ2/DQ8). Immune-mediated damage to small intestinal villi causes malabsorption. Affects ~1% of the global population, with significant underdiagnosis.",
    causes: [
      "Immune response to gliadin (gluten protein) fragment in genetically susceptible individuals",
      "HLA-DQ2 (present in ~95% of celiac patients) and HLA-DQ8 genotypes",
      "T-cell mediated villous atrophy in small intestine",
      "Tissue transglutaminase (tTG) acts as auto-antigen"
    ],
    riskFactors: [
      "First-degree relative with celiac disease (~10% risk)",
      "HLA-DQ2 or DQ8 genotype",
      "Type 1 diabetes mellitus",
      "Autoimmune thyroid disease (Hashimoto's, Graves')",
      "Turner syndrome, Down syndrome, Williams syndrome",
      "IgA deficiency",
      "Microscopic colitis"
    ],
    symptoms: [
      "Classic GI: Chronic diarrhea, steatorrhea (fatty stools), abdominal bloating/distension, flatulence",
      "Unintentional weight loss",
      "Nutritional deficiencies: Iron deficiency anemia (most common presenting feature), vitamin D, vitamin B12, folate, zinc, magnesium",
      "Failure to thrive (children)",
      "Non-GI symptoms: Dermatitis herpetiformis (intensely pruritic blistering skin rash — pathognomonic), peripheral neuropathy, ataxia, osteoporosis, recurrent aphthous ulcers, delayed puberty, infertility/recurrent miscarriage, fatigue, 'brain fog'",
      "Asymptomatic (silent celiac): Found incidentally during screening of high-risk groups"
    ],
    diagnosis: [
      "Serology (while on gluten-containing diet for accuracy):",
      "  Anti-tissue transglutaminase IgA (anti-tTG IgA) — best first-line test (sensitivity ~98%)",
      "  Anti-deamidated gliadin peptide IgG/IgA (anti-DGP) — useful when IgA deficient",
      "  Total serum IgA (to exclude IgA deficiency which causes false-negative tTG-IgA)",
      "  Anti-endomysial antibody (EMA-IgA) — high specificity",
      "Upper GI endoscopy with ≥ 4 duodenal biopsies: Villous atrophy, crypt hyperplasia, intraepithelial lymphocytosis — gold standard (Marsh classification)",
      "HLA-DQ2/DQ8 typing (negative result virtually excludes celiac disease — very high NPV)",
      "Note: Must be on gluten-containing diet for at least 6 weeks before testing"
    ],
    treatments: [
      "Strict, lifelong gluten-free diet (GFD) — ONLY effective treatment",
      "Eliminate: Wheat, barley, rye, and cross-contaminated oats",
      "Safe grains: Rice, corn/maize, quinoa, millet, certified gluten-free oats, potato, tapioca",
      "Dietitian consultation for GFD education",
      "Nutritional supplementation: Iron, folic acid, vitamin D, calcium, vitamin B12 (to correct deficiencies)",
      "Vaccination: Pneumococcal vaccine (functional hyposplenism in celiac disease)",
      "Monitoring: Repeat serology (tTG-IgA) at 6–12 months to confirm dietary adherence (should normalize)",
      "DXA scan for osteoporosis assessment",
      "Follow-up endoscopy for patients with persistent symptoms or non-response to GFD",
      "Emerging: Latiglutenase (enzyme therapy), IL-15 antagonists (for refractory celiac disease)"
    ],
    prevention: [
      "No preventive measures confirmed to prevent disease onset",
      "Avoid delay in diagnosis (complications increase with time on gluten)",
      "Screen high-risk groups: First-degree relatives, T1DM, autoimmune thyroid disease, Down syndrome",
      "Regular DEXA and bone health monitoring",
      "Annual follow-up including serology and dietary assessment"
    ],
    whenToSeeDoctor: "See a doctor for persistent GI symptoms, unexplained iron deficiency anemia, weight loss, or osteoporosis without obvious cause. See a gastroenterologist for endoscopic biopsy confirmation before starting GFD (GFD before testing makes diagnosis unreliable).",
    sources: ["ACG Clinical Guideline 2023", "British Society of Gastroenterology", "NIH/NIDDK", "Mayo Clinic", "NHS", "Celiac Disease Foundation"]
  }

];

module.exports = medicalData;