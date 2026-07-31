/**
 * CivicAI - Government Schemes Data & Smart Renewal Mock Data
 */

import { GovtScheme, SchemeRenewalReminder } from '../types';

export const INITIAL_SCHEMES: GovtScheme[] = [
  {
    id: 'scheme-1',
    name: 'PM Kisan Samman Nidhi (PM-KISAN)',
    category: 'Farmer',
    govtType: 'Central',
    description: 'Direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.',
    eligibility: [
      'Small and marginal farmer families holding cultivable land',
      'Valid Aadhaar card linked with bank account',
      'Landholding documents verified in state database',
      'Not paying Income Tax in previous assessment year'
    ],
    benefits: [
      '₹6,000 per year transferred directly to bank account',
      'Disbursed in 3 equal quarterly installments of ₹2,000',
      'Zero processing fee and automated e-KYC'
    ],
    requiredDocuments: ['Aadhaar Card', 'Land Records (Khasra/Khatauni)', 'Bank Passbook Details', 'Mobile Number'],
    lastDate: '2026-12-31',
    estimatedProcessingTime: '7 - 10 Days',
    officialWebsite: 'https://pmkisan.gov.in',
    trustIndex: 99,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Official Central Ministry Direct Portal',
    trustSourceDomain: 'pmkisan.gov.in',
    trustVerificationFactors: [
      'Directly hosted on National Informatics Centre (.gov.in) domain',
      'Direct DBT (Direct Benefit Transfer) Aadhaar API integration',
      'Verified by Ministry of Agriculture & Farmers Welfare',
      '0 Misinformation flags across 14,000+ audited applicants'
    ],
    requiresFarmer: true,
    targetOccupations: ['Farmer', 'Agriculture', 'Landholder'],
    targetMaxIncome: 600000,
  },
  {
    id: 'scheme-2',
    name: 'PM Vidya Lakshmi Higher Education Scholarship',
    category: 'Scholarship',
    govtType: 'Central',
    description: 'Single-window electronic portal for students seeking educational loans and government scholarships for higher education in India and abroad.',
    eligibility: [
      'Enrolled in recognized Higher Education Institution / University',
      'Min 60% marks in 12th Board Examinations or Graduation',
      'Annual family income less than ₹8,000,000'
    ],
    benefits: [
      'Interest subsidy up to 100% during moratorium period',
      'Direct disbursement to college account',
      'Collateral-free loans up to ₹7.5 Lakhs'
    ],
    requiredDocuments: ['10th & 12th Marksheets', 'College Admission Letter', 'Income Certificate', 'Aadhaar Card', 'Fee Structure Sheet'],
    lastDate: '2026-09-30',
    estimatedProcessingTime: '14 Days',
    officialWebsite: 'https://vidyalakshmi.co.in',
    trustIndex: 98,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Official Ministry of Education NSDL Portal',
    trustSourceDomain: 'vidyalakshmi.co.in',
    trustVerificationFactors: [
      'Jointly developed by Dept of Higher Education & NSDL e-Gov',
      'Direct integration with 40+ Public & Private Banks',
      'SSL Encrypted official single-window portal',
      'Zero processing fee mandate enforced'
    ],
    requiresStudent: true,
    targetMinAge: 16,
    targetMaxAge: 30,
    targetMaxIncome: 800000,
  },
  {
    id: 'scheme-3',
    name: 'Ladmila Mahila Samriddhi & Lakhpati Didi Scheme',
    category: 'Women Welfare',
    govtType: 'Central',
    description: 'Empowering women through micro-credit, Self Help Group (SHG) skill development, financial literacy, and ₹1.5 Lakh interest-free business loans.',
    eligibility: [
      'Female citizens aged between 18 to 55 years',
      'Member of registered Self-Help Group (SHG) or rural micro-entrepreneur',
      'Domicile of Indian State / UT'
    ],
    benefits: [
      'Financial grant of ₹1,250 monthly plus collateral-free enterprise loan up to ₹1,500,000',
      'Free skill training in digital banking, tailoring, and solar assembly',
      'Life & Accident Insurance cover'
    ],
    requiredDocuments: ['Aadhaar Card', 'SHG Registration ID / Bank Passbook', 'Address Proof', 'Passport Photo'],
    lastDate: '2026-11-15',
    estimatedProcessingTime: '5 Days',
    officialWebsite: 'https://lakhpatididi.gov.in',
    trustIndex: 99,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Official Ministry of Rural Development Portal',
    trustSourceDomain: 'lakhpatididi.gov.in',
    trustVerificationFactors: [
      'Official National Rural Livelihood Mission (NRLM) Portal',
      'Encrypted portal backed by Ministry of Rural Development',
      'Direct bank account crediting without intermediaries',
      'Community audited & verified by District Collectors'
    ],
    targetGender: 'female',
    targetMinAge: 18,
    targetMaxAge: 55,
  },
  {
    id: 'scheme-4',
    name: 'Atal Pension Yojana (APY)',
    category: 'Pension',
    govtType: 'Central',
    description: 'Guaranteed monthly pension scheme for unorganized sector workers starting from age 60.',
    eligibility: [
      'Indian citizen aged 18 to 40 years',
      'Having a savings bank account',
      'Not an existing subscriber of any statutory social security scheme'
    ],
    benefits: [
      'Guaranteed monthly pension of ₹1,000 to ₹5,000 after age 60',
      'Government co-contribution for eligible subscribers',
      'Spouse receives pension upon subscriber death'
    ],
    requiredDocuments: ['Aadhaar Card', 'Active Savings Bank Account', 'Nominee Details'],
    lastDate: '2026-10-31',
    estimatedProcessingTime: '3 Days',
    officialWebsite: 'https://npscra.nsdl.co.in',
    trustIndex: 99,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'PFRDA Govt Statutory Body Portal',
    trustSourceDomain: 'npscra.nsdl.co.in',
    trustVerificationFactors: [
      'Administered directly by Pension Fund Regulatory and Development Authority (PFRDA)',
      'Government of India guaranteed pension backing',
      'Automated auto-debit through scheduled commercial banks'
    ],
    targetMinAge: 18,
    targetMaxAge: 40,
    targetOccupations: ['Worker', 'Self Employed', 'Unorganized Sector', 'Freelancer', 'Daily Wager'],
  },
  {
    id: 'scheme-5',
    name: 'PM Mudra Yojana (PMMY - Tarun & Kishore Grants)',
    category: 'Startup & MSME',
    govtType: 'Central',
    description: 'Collateral-free business loans up to ₹10 Lakhs for small micro-enterprises, shops, manufacturing units, and tech startups.',
    eligibility: [
      'Any Indian citizen running or planning a non-farm business',
      'Business plan document and financial projection',
      'No history of default in any bank/financial institution'
    ],
    benefits: [
      'Collateral-free loan from ₹50,000 up to ₹1,000,000',
      'Low interest rates with Mudra Card overdraft facility',
      'Flexible repayment tenure up to 5 years'
    ],
    requiredDocuments: ['Business Registration / Udyam Certificate', 'Identity Proof', 'Bank Statement (6 Months)', 'Project Report'],
    lastDate: '2026-12-15',
    estimatedProcessingTime: '10 Days',
    officialWebsite: 'https://mudra.org.in',
    trustIndex: 97,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Micro Units Development & Refinance Portal',
    trustSourceDomain: 'mudra.org.in',
    trustVerificationFactors: [
      'SIDBI Subsidiary official institutional website',
      'Recognized under Dept of Financial Services, Ministry of Finance',
      'Direct Mudra Card distribution backed by RBI guidelines'
    ],
    targetMinAge: 18,
    targetOccupations: ['Entrepreneur', 'Business Owner', 'Shopkeeper', 'Trader', 'Self Employed'],
  },
  {
    id: 'scheme-6',
    name: 'Telangana Rythu Bandhu & Crop Insurance',
    category: 'State Government',
    govtType: 'State',
    stateName: 'Telangana',
    description: 'Agriculture investment support scheme providing ₹10,000 per acre per year directly to landowning farmers in Telangana.',
    eligibility: [
      'Resident farmer of Telangana State',
      'Valid Pattadar Passbook issued by Revenue Dept'
    ],
    benefits: ['₹5,000 per acre per season (Kharif & Rabi)', 'Free Crop Insurance against flood & drought'],
    requiredDocuments: ['Pattadar Passbook', 'Aadhaar Card', 'IFSC Bank Details'],
    lastDate: '2026-08-31',
    estimatedProcessingTime: '4 Days',
    officialWebsite: 'https://rythubandhu.telangana.gov.in',
    trustIndex: 100,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Direct State Revenue Portal (.telangana.gov.in)',
    trustSourceDomain: 'rythubandhu.telangana.gov.in',
    trustVerificationFactors: [
      'Official Telangana State Agriculture Department Portal',
      'Direct synchronization with Dharani Revenue Portal',
      '100% verified state government DBT disbursements'
    ],
    requiresFarmer: true,
  },
  {
    id: 'scheme-7',
    name: 'Divyangjan Swavlamban Divyang Assistance',
    category: 'Central Government',
    govtType: 'Central',
    description: 'Comprehensive financial aid, motorized tricycle subsidies, and skill development grants for persons with disabilities.',
    eligibility: [
      '40% or higher benchmark disability verified by UDID card',
      'Indian citizen of any age'
    ],
    benefits: ['Subsidized assistive devices & motorized wheelchairs', 'Monthly disability pension and skill grants up to ₹50,000'],
    requiredDocuments: ['UDID Card / Disability Certificate', 'Aadhaar Card', 'Income Certificate'],
    lastDate: '2026-11-30',
    estimatedProcessingTime: '8 Days',
    officialWebsite: 'https://swavlambancard.gov.in',
    trustIndex: 99,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Official Unique Disability ID (UDID) National Portal',
    trustSourceDomain: 'swavlambancard.gov.in',
    trustVerificationFactors: [
      'Department of Empowerment of Persons with Disabilities (.gov.in)',
      'Nationally unified UDID database validation',
      'Direct hospital medical board verification'
    ],
    requiresDisability: true,
  },
  {
    id: 'scheme-8',
    name: 'PM AWAS Yojana Urban (PMAY-U 2.0)',
    category: 'Central Government',
    govtType: 'Central',
    description: 'Interest subsidy and direct financial grant of ₹2.5 Lakhs for middle and lower-income families constructing or purchasing first home.',
    eligibility: [
      'Family must not own a pucca house anywhere in India',
      'Annual household income below ₹12,000,000'
    ],
    benefits: ['Up to ₹250,000 direct subsidy credited to home loan account', 'Lower interest rate starting at 6.5%'],
    requiredDocuments: ['Aadhaar Card', 'Income Certificate', 'Property Purchase Document / Layout Plan'],
    lastDate: '2026-08-15',
    estimatedProcessingTime: '15 Days',
    officialWebsite: 'https://pmaymis.gov.in',
    trustIndex: 99,
    isDirectGovtWebsite: true,
    trustBadgeLabel: 'Ministry of Housing & Urban Affairs MIS Portal',
    trustSourceDomain: 'pmaymis.gov.in',
    trustVerificationFactors: [
      'Official MoHUA MIS System hosted on .gov.in domain',
      'Aadhaar deduplication and geo-tagging housing verification',
      'Direct subsidy credit to primary lending institution (PLI)'
    ],
    targetMaxIncome: 1200000,
  }
];

export const INITIAL_RENEWAL_REMINDERS: SchemeRenewalReminder[] = [
  {
    id: 'rem-1',
    schemeId: 'scheme-1',
    schemeName: 'PM-KISAN Annual e-KYC Verification',
    expiryDate: '2026-08-28',
    daysRemaining: 30,
    status: '30_days',
    channels: { push: true, inApp: true, email: true, sms: true },
    requiredDocs: ['Aadhaar Linked Mobile OTP', 'Biometric Fingerprint or Face Authentication'],
    renewalUrl: 'https://pmkisan.gov.in/aadharkyc.aspx',
  },
  {
    id: 'rem-2',
    schemeId: 'scheme-2',
    schemeName: 'Vidya Lakshmi Academic Fee Subsidy Renewal',
    expiryDate: '2026-08-12',
    daysRemaining: 14,
    status: '15_days',
    channels: { push: true, inApp: true, email: true, sms: false },
    requiredDocs: ['Latest Semester Grade Sheet', 'College Bonafide Certificate'],
    renewalUrl: 'https://vidyalakshmi.co.in/Students/renewal',
  },
  {
    id: 'rem-3',
    schemeId: 'scheme-3',
    schemeName: 'Lakhpati Didi SHG Micro-Credit Renewal',
    expiryDate: '2026-08-04',
    daysRemaining: 6,
    status: '7_days',
    channels: { push: true, inApp: true, email: true, sms: true },
    requiredDocs: ['SHG Loan Repayment Proof', 'Audit Book Copy'],
    renewalUrl: 'https://lakhpatididi.gov.in',
  }
];
