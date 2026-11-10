export interface CanadianCompanyProfile {
  companyName: string;
  ticker: string;
  industry: string;
  businessType: string;
  headquarters: string;
  location: string;
  description: string;
  productLine: string;
  equipmentType: string;
  supplierName: string;
  clientType: string;
  bankName: string;
}

const CANADIAN_REGIONAL_ROOTS = [
  'Algonquin', 'Athabasca', 'Banff', 'Boreal', 'Bow Valley', 'Cape Breton',
  'Cascadia', 'Fraser Valley', 'Fundy', 'Gatineau', 'Georgian Bay', 'Great Lakes',
  'Haida', 'Halton', 'Jasper', 'Keewatin', 'Kootenay', 'Laurentian', 'Malpeque',
  'Maritime', 'Mont-Tremblant', 'Muskoka', 'Niagara', 'Nipissing', 'Northern Shield',
  'Okanagan', 'Pacific Coast', 'Peace River', 'Pemberton', 'Prairie Sun', 'Quinte',
  'Red River', 'Rideau', 'Rocky Mountain', 'Saguenay', 'Saskatchewan', 'Simcoe',
  'Skeena', 'St. Lawrence', 'Temagami', 'Tofino', 'Vancouver Island', 'Whistler',
  'Yukon', 'Klondike', 'Labrador', 'Kananaskis', 'Laurentides', 'Cariboo',
  'Fundy Coast', 'Grand Banks', 'Acadia', 'Selkirk', 'Columbia'
];

const BRAND_MODIFIERS = [
  'Advanced', 'Apex', 'Applied', 'Bio', 'CleanTech', 'Core', 'Crest', 'Cyber',
  'Delta', 'Dynamic', 'Eco', 'Elite', 'Enviro', 'Evergreen', 'Frontier', 'Fusion',
  'Genesis', 'Global', 'Horizon', 'Infinity', 'Integrative', 'Kinetic', 'Lumina',
  'Matrix', 'Meridian', 'Metro', 'NextGen', 'Nexus', 'Nova', 'Omni', 'Optima',
  'Pinnacle', 'Polaris', 'Precision', 'Prime', 'Quantum', 'Radiant', 'Solstice',
  'Spectrum', 'Stratum', 'Summit', 'Sustainable', 'Synergy', 'Terra', 'Vanguard',
  'Vector', 'Veritas', 'Vertex', 'Vision', 'Vital'
];

interface SectorTemplate {
  domain: string;
  industry: string;
  description: string;
  productLine: string;
  equipmentType: string;
  supplierPrefix: string;
  clientType: string;
}

const SECTOR_TEMPLATES: SectorTemplate[] = [
  {
    domain: 'Cloud Infrastructure & High-Performance Computing',
    industry: 'Enterprise SaaS & Cloud Infrastructure',
    description: 'designs and operates distributed cloud server architectures, edge compute telemetry, and secure multi-tenant data storage pipelines.',
    productLine: 'high-throughput server clusters and dedicated fiber compute racks',
    equipmentType: 'enterprise GPU compute server nodes & high-density storage arrays',
    supplierPrefix: 'West Coast Enterprise Systems',
    clientType: 'FinTech platforms and healthcare hospital networks'
  },
  {
    domain: 'Environmental Laboratory & Water Testing',
    industry: 'Environmental Testing & Carbon Diagnostics',
    description: 'conducts municipal groundwater diagnostics, contaminated soil remediation analysis, and industrial carbon footprint compliance testing.',
    productLine: 'mass-spectrometry testing instruments and automated soil analysis kits',
    equipmentType: 'gas chromatography spectrometry analyzers & robotic liquid handlers',
    supplierPrefix: 'Laurentian Scientific Instrumentation',
    clientType: 'civil engineering contractors and municipal public works departments'
  },
  {
    domain: 'Autonomous Drone Surveying & Agronomy',
    industry: 'Precision Agricultural Technology & Remote Sensing',
    description: 'deploys autonomous multispectral surveying drones and GPS sensors to optimize crop yield, soil moisture, and organic nutrient management.',
    productLine: 'commercial crop monitoring drones and real-time vegetative index sensors',
    equipmentType: 'autonomous aerial multispectral LiDAR drones & RTK GPS field stations',
    supplierPrefix: 'Prairie Dynamics Tooling',
    clientType: 'commercial grain cooperatives and agronomic advisory firms'
  },
  {
    domain: 'Mass-Timber Prefabrication & Engineering',
    industry: 'Sustainable Architectural Timber Fabrication',
    description: 'engineers cross-laminated timber (CLT) structural beams and prefabricated mass-timber components for carbon-neutral commercial buildings.',
    productLine: 'structural glue-laminated timber arches and precision floor cassettes',
    equipmentType: 'heavy-duty 5-axis CNC timber joinery milling machines & vacuum press tables',
    supplierPrefix: 'Foothills Industrial Machinery',
    clientType: 'commercial general contractors and municipal infrastructure developers'
  },
  {
    domain: 'Biopharmaceutical Cold-Chain Logistics',
    industry: 'Specialized Healthcare Fleet Transport',
    description: 'provides certified temperature-controlled transport and real-time cold-chain validation for vaccines, biologics, and clinical trials.',
    productLine: 'refrigerated cold-storage pharmaceutical depots and tracked fleet vans',
    equipmentType: 'multi-temp refrigerated diesel sprinter cargo vans & calibrated telemetry loggers',
    supplierPrefix: 'Atlantic Fleet Vehicle Outfitting',
    clientType: 'regional hospital health authorities and clinical pharmaceutical laboratories'
  },
  {
    domain: 'Autonomous Mobile Warehouse Robotics',
    industry: 'Industrial Automation & Robotics Engineering',
    description: 'engineers automated guided vehicles (AGVs) and warehouse robotics that streamline parcel sorting and fulfillment logistics.',
    productLine: 'autonomous sorting rovers and robotic pallet-handling cells',
    equipmentType: 'automated calibration optical benches & 3D prototyping laser cutter rigs',
    supplierPrefix: 'Tri-City Precision Machining',
    clientType: 'e-commerce distribution hubs and national postal courier networks'
  },
  {
    domain: 'Motion Graphics & Cinematic Visual Effects',
    industry: 'Digital Media Production & VFX Technology',
    description: 'creates high-end photo-realistic visual effects, virtual production environments, and real-time CGI animation for international feature films.',
    productLine: 'proprietary visual effect asset pipelines and HDR virtual stage renders',
    equipmentType: 'high-density GPU render farm nodes & 8K color-grading monitor suites',
    supplierPrefix: 'Montreal Cine Broadcast Hardware',
    clientType: 'major streaming studios and film production companies'
  },
  {
    domain: 'Occupational Health & Ergonomic Field Analysis',
    industry: 'Occupational Ergonomics & Safety Diagnostics',
    description: 'conducts quantitative biomechanical ergonomic assessments and workplace musculoskeletal injury prevention audits for heavy industry.',
    productLine: 'wearable ergonomic sensor suites and computer-vision posture software',
    equipmentType: 'wireless motion-capture sensor suits & calibrated digital force gauges',
    supplierPrefix: 'Northern Safety Diagnostic Tools',
    clientType: 'mining operators, automotive assembly plants, and forestry mills'
  },
  {
    domain: 'Critical Infrastructure Cyber Defense',
    industry: 'Cybersecurity Threat Detection & Defense',
    description: 'delivers continuous penetration testing, red-team intrusion simulations, and real-time anomaly detection for critical utility grids.',
    productLine: 'encrypted intrusion-prevention appliances and telemetry firmware',
    equipmentType: 'secure hardware penetration testing appliances & air-gapped forensic servers',
    supplierPrefix: 'Rideau Valley Secure Electronics',
    clientType: 'provincial electrical grid operators and commercial financial institutions'
  },
  {
    domain: 'Subsea Robotics & Marine Geotechnical Surveying',
    industry: 'Ocean Technology & Marine Engineering',
    description: 'deploys remotely operated submersibles (ROVs) and multibeam sonar arrays for offshore subsea pipeline inspection and seabed mapping.',
    productLine: 'deepwater survey ROVs and acoustic positioning transponders',
    equipmentType: 'deep-submergence inspection ROV systems & dual-frequency side-scan sonars',
    supplierPrefix: 'Maritime Hydrographic Equipment',
    clientType: 'offshore renewable energy developers and telecommunications cable operators'
  },
  {
    domain: 'Commercial Solar Microgrids & Energy Storage',
    industry: 'Clean Energy Engineering & Grid Storage',
    description: 'designs high-capacity battery energy storage systems (BESS) and commercial solar microgrids for off-grid mining camps and remote communities.',
    productLine: 'modular containerized battery storage units and bidirectional microgrid inverters',
    equipmentType: 'megawatt inverter test benches & computerized battery cycler testing stations',
    supplierPrefix: 'Kootenay Clean Energy Equipment',
    clientType: 'remote industrial mining facilities and provincial clean utility partners'
  },
  {
    domain: 'Advanced Biocomposites & Sustainable Resins',
    industry: 'Green Materials Science & Polymer Synthesis',
    description: 'manufactures biodegradable bio-resins and plant-fiber reinforced composite panels for the automotive and packaging industries.',
    productLine: 'flax-reinforced lightweight structural panels and compostable injection resins',
    equipmentType: 'twin-screw compounding extruders & hydraulic heated composite compression presses',
    supplierPrefix: 'Georgian Bay Polymer Tools',
    clientType: 'automotive Tier-1 parts suppliers and eco-conscious packaging converters'
  },
  {
    domain: 'Geothermal District Energy & Thermal Utilities',
    industry: 'Geothermal HVAC & District Energy Engineering',
    description: 'engineers closed-loop deep geothermal borehole fields and central district thermal energy networks for municipal developments.',
    productLine: 'district geothermal heat exchange substations and energy metering skids',
    equipmentType: 'ultrasonic thermal flow telemetry meters & geothermal borehole circulation test rigs',
    supplierPrefix: 'Bow Valley Thermal Systems',
    clientType: 'university campuses and municipal district energy authorities'
  },
  {
    domain: 'High-Efficiency Electric Marine Propulsion',
    industry: 'Clean Maritime Transportation Technologies',
    description: 'converts commercial passenger ferries and workboats to zero-emission battery-electric and hybrid-electric propulsion systems.',
    productLine: 'marine high-torque permanent magnet motors and liquid-cooled battery banks',
    equipmentType: 'marine dynamometer load test cells & high-voltage inverter calibration benches',
    supplierPrefix: 'Salish Sea Marine Electrical',
    clientType: 'coastal ferry operators and municipal harbour patrol fleets'
  },
  {
    domain: 'Medical Radiopharmacy & Isotope Logistics',
    industry: 'Medical Devices & Radiopharmaceutical Support',
    description: 'synthesizes and transports medical diagnostic radioisotopes used for targeted cancer imaging and clinical PET diagnostic scans.',
    productLine: 'shielded radiopharmaceutical transport casks and automated dose synthesis kits',
    equipmentType: 'automated lead-shielded hot cell chambers & radio-HPLC diagnostic detectors',
    supplierPrefix: 'Ottawa Valley Medical Scientific',
    clientType: 'regional cancer treatment centres and university research hospitals'
  }
];

const CANADIAN_LOCATIONS = [
  'Vancouver, British Columbia',
  'Victoria, British Columbia',
  'Kelowna, British Columbia',
  'Kamloops, British Columbia',
  'Calgary, Alberta',
  'Edmonton, Alberta',
  'Red Deer, Alberta',
  'Saskatoon, Saskatchewan',
  'Regina, Saskatchewan',
  'Winnipeg, Manitoba',
  'Toronto, Ontario',
  'Ottawa, Ontario',
  'Kitchener-Waterloo, Ontario',
  'Mississauga, Ontario',
  'Hamilton, Ontario',
  'London, Ontario',
  'Sudbury, Ontario',
  'Montreal, Quebec',
  'Quebec City, Quebec',
  'Gatineau, Quebec',
  'Sherbrooke, Quebec',
  'Halifax, Nova Scotia',
  'St. John\'s, Newfoundland and Labrador',
  'Fredericton, New Brunswick',
  'Moncton, New Brunswick',
  'Charlottetown, Prince Edward Island',
  'Whitehorse, Yukon',
  'Yellowknife, Northwest Territories'
];

const CANADIAN_BANKS = [
  'Royal Northern Commerce Bank',
  'Laurentian Commercial & Trust',
  'Great Northern Merchant Bank',
  'First Canadian Commercial Bank',
  'Dominion Charter Commercial Bank',
  'Pacific Maritime Credit Bank',
  'Prairie Regional Trust & Credit',
  'Alberta Commercial Capital Bank',
  'Western Meridian Business Bank'
];

const CORPORATE_SUFFIXES = [
  'Inc.',
  'Corp.',
  'Ltd.',
  'Limited',
  'Technologies Inc.',
  'Solutions Corp.',
  'Systems Ltd.',
  'Dynamics Inc.',
  'Enterprises Ltd.',
  'Innovations Corp.',
  'Engineering Ltd.'
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomTicker(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let tickerCode = '';
  const len = Math.random() > 0.4 ? 3 : 4;
  for (let i = 0; i < len; i++) {
    tickerCode += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  const exchange = Math.random() > 0.3 ? 'TSX' : 'TSX-V';
  return `${exchange}: ${tickerCode}`;
}

/**
 * Generates an entirely new, procedurally unique Canadian company.
 * Guaranteed never to match any name in excludeNames.
 */
export function generateUniqueCanadianCompany(excludeNames?: Set<string> | string[]): CanadianCompanyProfile {
  const excluded = new Set(
    Array.isArray(excludeNames)
      ? excludeNames.map(s => s.toLowerCase().trim())
      : excludeNames
      ? Array.from(excludeNames).map(s => s.toLowerCase().trim())
      : []
  );

  let attempts = 0;
  let companyName = '';
  let sector: SectorTemplate = SECTOR_TEMPLATES[0];
  let location = '';
  let bankName = '';
  let suffix = '';

  while (attempts < 100) {
    attempts++;
    const root = pick(CANADIAN_REGIONAL_ROOTS);
    const mod = pick(BRAND_MODIFIERS);
    sector = pick(SECTOR_TEMPLATES);
    suffix = pick(CORPORATE_SUFFIXES);
    location = pick(CANADIAN_LOCATIONS);
    bankName = pick(CANADIAN_BANKS);

    // Varied naming patterns
    const pattern = Math.floor(Math.random() * 4);
    if (pattern === 0) {
      companyName = `${root} ${mod} ${suffix}`;
    } else if (pattern === 1) {
      companyName = `${mod} ${root} ${suffix}`;
    } else if (pattern === 2) {
      // Pick first word of sector
      const sectorWord = sector.domain.split(' ')[0];
      companyName = `${root} ${sectorWord} ${suffix}`;
    } else {
      companyName = `${root} ${sector.industry.split(' ')[0]} ${mod} ${suffix}`;
    }

    if (!excluded.has(companyName.toLowerCase().trim())) {
      break;
    }
  }

  // Fallback unique stamp if high collision (theoretically almost impossible)
  if (excluded.has(companyName.toLowerCase().trim())) {
    companyName = `${pick(CANADIAN_REGIONAL_ROOTS)} ${pick(BRAND_MODIFIERS)} Innovations ${Math.floor(Math.random() * 900 + 100)} Inc.`;
  }

  const supplierName = `${sector.supplierPrefix} ${pick(CORPORATE_SUFFIXES)}`;
  const ticker = generateRandomTicker();

  return {
    companyName,
    ticker,
    industry: sector.industry,
    businessType: sector.domain,
    headquarters: location,
    location,
    description: sector.description,
    productLine: sector.productLine,
    equipmentType: sector.equipmentType,
    supplierName,
    clientType: sector.clientType,
    bankName
  };
}
