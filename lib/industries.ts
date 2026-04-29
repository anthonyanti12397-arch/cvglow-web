export interface Industry {
  slug: string
  name: string
  nameZh: string
  icon: string
  shortDesc: string
  longDesc: string
  topSkills: string[]
  topJobTitles: string[]
  sampleBullets: string[]
  template: string // which CVGlow template to recommend
  salaryRange: string
  topEmployers: string[]
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'finance',
    name: 'Finance & Banking',
    nameZh: '金融及銀行業',
    icon: '🏦',
    shortDesc: 'Investment banking, asset management, corporate finance — built for HKEX and global banks.',
    longDesc: 'Hong Kong is one of the world\'s top financial centres. Finance resumes need to demonstrate deal exposure, quantitative skills, and regulatory knowledge. This template is formatted for HSBC, Standard Chartered, Goldman Sachs, HKMA, and boutique firms.',
    topSkills: ['Financial Modelling', 'Bloomberg', 'CFA', 'Excel/VBA', 'Risk Management', 'AML/KYC'],
    topJobTitles: ['Investment Banking Analyst', 'Risk Manager', 'Fund Manager', 'Compliance Officer', 'Corporate Finance Associate'],
    sampleBullets: [
      'Executed HK$2B IPO on HKEX, managing due diligence and investor roadshow coordination',
      'Built DCF and LBO models for 8 M&A transactions totalling USD 500M deal value',
      'Reduced AML false-positive rate by 35% through enhanced transaction monitoring rules',
    ],
    template: 'finance',
    salaryRange: 'HK$25K–120K/month',
    topEmployers: ['HSBC', 'Bank of China', 'Goldman Sachs', 'JPMorgan', 'BlackRock', 'HKMA'],
  },
  {
    slug: 'technology',
    name: 'Technology',
    nameZh: '科技業',
    icon: '💻',
    shortDesc: 'Software engineering, product, data science — for startups and tech giants in HK.',
    longDesc: 'Hong Kong\'s tech scene spans fintech, logistics tech, proptech, and enterprise software. Tech resumes must lead with concrete impact metrics and technical stack depth. This template is optimised for roles at Alibaba, Tencent, Sea Group, and local startups.',
    topSkills: ['Python', 'React', 'TypeScript', 'AWS', 'Docker', 'Machine Learning'],
    topJobTitles: ['Software Engineer', 'Data Scientist', 'Product Manager', 'DevOps Engineer', 'Mobile Developer'],
    sampleBullets: [
      'Built real-time payment processing system handling HK$50M daily transactions at 99.99% uptime',
      'Reduced page load time by 60% through code splitting and CDN optimisation, improving conversion by 18%',
      'Led team of 6 engineers to ship mobile app with 50K+ downloads in 3 months',
    ],
    template: 'tech',
    salaryRange: 'HK$20K–90K/month',
    topEmployers: ['Alibaba', 'Tencent', 'Sea Group', 'Klook', 'GoGoX', 'GOGOX'],
  },
  {
    slug: 'marketing',
    name: 'Marketing & PR',
    nameZh: '市場推廣及公關',
    icon: '📣',
    shortDesc: 'Brand management, digital marketing, PR — for consumer brands and agencies in HK.',
    longDesc: 'Marketing roles in Hong Kong require both traditional brand-building skills and digital fluency. The HK market is bilingual and requires cultural sensitivity across Chinese and Western audiences. This template highlights campaign results, channel expertise, and audience growth.',
    topSkills: ['Google Analytics', 'Social Media', 'Content Strategy', 'SEO/SEM', 'Campaign Management', 'Cantonese'],
    topJobTitles: ['Marketing Manager', 'Digital Marketing Specialist', 'Brand Manager', 'PR Manager', 'Social Media Manager'],
    sampleBullets: [
      'Grew Instagram following from 12K to 85K in 12 months through UGC campaigns and influencer partnerships',
      'Managed HK$3M annual media budget across digital and OOH, achieving 140% ROI',
      'Launched bilingual campaign (EN/繁中) reaching 2M impressions in first week',
    ],
    template: 'creative',
    salaryRange: 'HK$18K–65K/month',
    topEmployers: ['LVMH', 'Cathay Pacific', 'MTR', 'Hong Kong Tourism Board', 'Edelman'],
  },
  {
    slug: 'legal',
    name: 'Legal',
    nameZh: '法律業',
    icon: '⚖️',
    shortDesc: 'Solicitors, barristers, in-house counsel — built for HK Law Society standards.',
    longDesc: 'Hong Kong\'s legal sector spans international law firms, local practices, and in-house corporate roles. Legal CVs must demonstrate jurisdiction knowledge, practice area expertise, and deal or case experience. Formatted for Linklaters, Clifford Chance, and local firms.',
    topSkills: ['Common Law', 'Corporate Law', 'Litigation', 'M&A', 'PCLL', 'Regulatory Compliance'],
    topJobTitles: ['Solicitor', 'Legal Counsel', 'Associate', 'Paralegal', 'Compliance Manager'],
    sampleBullets: [
      'Advised on USD 200M cross-border acquisition with PRC and Cayman Islands elements',
      'Managed portfolio of 30+ active commercial disputes in HKIAC and SIAC arbitrations',
      'Drafted and negotiated 50+ commercial contracts for Fortune 500 clients',
    ],
    template: 'finance',
    salaryRange: 'HK$30K–150K/month',
    topEmployers: ['Linklaters', 'Clifford Chance', 'Freshfields', 'HKSAR DOJ', 'Deloitte Legal'],
  },
  {
    slug: 'accounting',
    name: 'Accounting & Audit',
    nameZh: '會計及審計',
    icon: '📊',
    shortDesc: 'CPA, audit, tax — for the Big 4 and listed companies in Hong Kong.',
    longDesc: 'Accounting professionals in Hong Kong must demonstrate HKICPA or CPA qualifications, HKFRS knowledge, and experience with listed company audits. This template is structured for Big 4 applications and CFO-track roles at Hong Kong-listed companies.',
    topSkills: ['HKFRS/IFRS', 'Audit', 'Tax', 'CPA/HKICPA', 'Excel', 'ERP Systems'],
    topJobTitles: ['Audit Senior', 'Tax Manager', 'Financial Controller', 'CFO', 'Management Accountant'],
    sampleBullets: [
      'Led statutory audit of Hang Seng Index constituent company with HK$8B revenue',
      'Identified HK$15M tax saving through group restructuring and transfer pricing review',
      'Implemented ERP migration from SAP to Oracle across 3 business units with zero data loss',
    ],
    template: 'finance',
    salaryRange: 'HK$22K–100K/month',
    topEmployers: ['Deloitte', 'PwC', 'KPMG', 'EY', 'BDO', 'Grant Thornton'],
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    nameZh: '醫療業',
    icon: '🏥',
    shortDesc: 'Doctors, nurses, allied health — for HA, private hospitals, and clinics in HK.',
    longDesc: 'Hong Kong healthcare professionals need to highlight HKMC registration, clinical specialties, and both public and private sector experience. This template covers Hospital Authority, private hospital groups, and pharmaceutical companies.',
    topSkills: ['Clinical Assessment', 'HKMC Registration', 'Patient Care', 'EMR Systems', 'Infection Control', 'ACLS'],
    topJobTitles: ['Registered Nurse', 'Medical Officer', 'Physiotherapist', 'Pharmacist', 'Medical Lab Technologist'],
    sampleBullets: [
      'Managed 28-bed acute medical ward, supervising team of 12 nurses across 3 shifts',
      'Reduced average patient discharge time by 20% through streamlined admission protocol',
      'Achieved 0 medication error incidents across 400+ patient encounters over 2 years',
    ],
    template: 'classic',
    salaryRange: 'HK$20K–150K/month',
    topEmployers: ['Hospital Authority', 'HK Sanatorium', 'Matilda Hospital', 'St. Paul\'s Hospital', 'Gleneagles'],
  },
  {
    slug: 'hospitality',
    name: 'Hospitality & Tourism',
    nameZh: '酒店及旅遊業',
    icon: '🏨',
    shortDesc: 'Hotel management, F&B, travel — for international hotel groups and airlines.',
    longDesc: 'Hospitality in Hong Kong spans luxury hotels, airlines, and the tourism ecosystem. Strong candidates demonstrate multilingual abilities, operational metrics (RevPAR, NPS), and international brand experience.',
    topSkills: ['Revenue Management', 'Opera PMS', 'Cantonese/English/Mandarin', 'F&B Operations', 'Guest Relations', 'Yield Management'],
    topJobTitles: ['Front Office Manager', 'F&B Manager', 'Revenue Manager', 'Housekeeping Manager', 'Cabin Crew'],
    sampleBullets: [
      'Increased hotel RevPAR by 22% through dynamic pricing strategy during off-peak seasons',
      'Achieved TripAdvisor Certificate of Excellence for 3 consecutive years, ranked #4 in HK',
      'Managed 60-person F&B team across 3 outlets, achieving 95% guest satisfaction score',
    ],
    template: 'classic',
    salaryRange: 'HK$15K–60K/month',
    topEmployers: ['Mandarin Oriental', 'Four Seasons', 'Cathay Pacific', 'Peninsula Hotels', 'JW Marriott'],
  },
  {
    slug: 'logistics',
    name: 'Logistics & Supply Chain',
    nameZh: '物流及供應鏈',
    icon: '🚢',
    shortDesc: 'Freight, supply chain, procurement — for trading companies and port operators.',
    longDesc: 'As Asia\'s logistics hub, Hong Kong employs tens of thousands in shipping, freight forwarding, and supply chain management. This template highlights operational KPIs, vendor management, and cross-border trade expertise.',
    topSkills: ['SAP', 'Incoterms', 'Customs Clearance', 'WMS', 'Freight Management', 'Six Sigma'],
    topJobTitles: ['Supply Chain Manager', 'Logistics Coordinator', 'Procurement Manager', 'Operations Manager', 'Freight Forwarder'],
    sampleBullets: [
      'Reduced logistics costs by HK$2.8M annually through carrier renegotiation and route optimisation',
      'Managed end-to-end supply chain for 500+ SKUs across 8 countries with 98.5% on-time delivery',
      'Led SAP S/4HANA implementation for logistics module, reducing processing time by 40%',
    ],
    template: 'tech',
    salaryRange: 'HK$20K–80K/month',
    topEmployers: ['Jardine Logistics', 'Kerry Logistics', 'DHL', 'Maersk', 'OOCL', 'Cathay Cargo'],
  },
  {
    slug: 'education',
    name: 'Education',
    nameZh: '教育業',
    icon: '🎓',
    shortDesc: 'Teachers, tutors, academics — for international schools and universities in HK.',
    longDesc: 'Education professionals in Hong Kong span international schools, local schools (EMI/CMI), and universities. This template focuses on curriculum design, student outcomes, and qualifications like PGDE or QTS.',
    topSkills: ['Curriculum Design', 'PGDE/QTS', 'IB/IGCSE', 'Classroom Management', 'Student Assessment', 'Differentiated Learning'],
    topJobTitles: ['Secondary Teacher', 'Primary Teacher', 'Education Consultant', 'Academic Coordinator', 'University Lecturer'],
    sampleBullets: [
      'Improved average IGCSE Math grade from C to B across 30-student cohort in one academic year',
      'Developed IB Economics curriculum adopted school-wide, reducing teacher prep time by 30%',
      'Maintained 100% student pass rate for HKDSE over 5 consecutive years',
    ],
    template: 'classic',
    salaryRange: 'HK$18K–60K/month',
    topEmployers: ['ESF', 'HKIS', 'Chinese International School', 'HKU', 'CUHK', 'HKUST'],
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}

export function generateStaticParams() {
  return INDUSTRIES.map(i => ({ industry: i.slug }))
}
