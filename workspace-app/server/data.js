export const workspaceData = {
  kpis: [
    { label: 'Active Clients', value: '148', trend: '+18% this quarter' },
    { label: 'Projects In Flight', value: '23', trend: '+6 added this month' },
    { label: 'Avg. Delivery Score', value: '96.2%', trend: '+3.1 points QoQ' },
    { label: 'Automation Coverage', value: '72%', trend: '+11% this release' }
  ],
  initiatives: [
    { title: 'Scale delivery squads', note: 'Move from one core squad to three product pods by next quarter.' },
    { title: 'Accelerate launch velocity', note: 'Target 2.5x faster concept-to-shipping cycle across teams.' },
    { title: 'Unify service operations', note: 'Bring customer, product, and analytics in one shared workflow.' }
  ],
  projects: [
    {
      name: 'Northstar CRM Refresh',
      status: 'In Build',
      sector: 'SaaS',
      summary: 'Unified sales and support experiences with a modular Vue frontend.',
      impact: 'Projected 28% faster lead conversion'
    },
    {
      name: 'Harbor Health Portal',
      status: 'Research',
      sector: 'Healthcare',
      summary: 'Patient scheduling and telehealth workflows with accessibility-first design.',
      impact: 'Expected 34% drop in support tickets'
    },
    {
      name: 'Lumen Logistics Board',
      status: 'Live',
      sector: 'Operations',
      summary: 'Live fleet orchestration dashboard with KPI streaming and alerting.',
      impact: '16% reduction in route delays'
    },
    {
      name: 'Craftline Commerce Suite',
      status: 'Live',
      sector: 'Retail',
      summary: 'Composable checkout and inventory analytics for regional stores.',
      impact: '22% increase in repeat purchase rate'
    }
  ],
  services: [
    {
      name: 'Product Sprint Pods',
      description: 'Cross-functional teams shipped in 2-week loops for roadmap acceleration.',
      bullets: ['Weekly strategy reviews', 'Design + engineering pairing', 'Continuous QA automation']
    },
    {
      name: 'Modernization Architecture',
      description: 'Legacy migration plans focused on measurable outcomes and low-risk transitions.',
      bullets: ['Service decomposition', 'Performance profiling', 'Reliability scorecards']
    },
    {
      name: 'Data and Insight Layer',
      description: 'Operational metrics connected to real user outcomes for better product decisions.',
      bullets: ['Warehouse modeling', 'Dashboard implementation', 'Experiment tracking']
    }
  ],
  teamMembers: [
    {
      name: 'Mina Alvarez',
      role: 'Product Director',
      focus: 'Strategy',
      bio: 'Shapes roadmap bets around customer impact and long-term platform quality.',
      photo: '/team/mark.jpg'
    },
    {
      name: 'Theo Morgan',
      role: 'Lead Frontend Engineer',
      focus: 'Engineering',
      bio: 'Builds resilient Vue systems with rich interaction design and performance discipline.',
      photo: '/team/person2.jpg'
    },
    {
      name: 'Priya Das',
      role: 'Design Systems Lead',
      focus: 'Design',
      bio: 'Crafts expressive interfaces and scalable UI foundations for rapid product evolution.',
      photo: '/team/person3.jpg'
    },
    {
      name: 'Jordan Kim',
      role: 'Data Product Analyst',
      focus: 'Data',
      bio: 'Turns product telemetry into focused decisions and experiment playbooks.',
      photo: '/team/person4.jpg'
    },
    {
      name: 'Amari Bell',
      role: 'Delivery Manager',
      focus: 'Operations',
      bio: 'Keeps complex programs on track through transparent communication and strong planning.',
      photo: '/team/person5.jpg'
    },
    {
      name: 'Lila Rahman',
      role: 'Client Partner',
      focus: 'Strategy',
      bio: 'Aligns teams and leadership stakeholders around clear milestones and business outcomes.',
      photo: '/team/person6.jpg'
    }
  ],
  milestones: [
    { quarter: 'Q1', title: 'Platform Audit', note: 'Mapped risks, tech debt, and user friction points.' },
    { quarter: 'Q2', title: 'Core Rebuild', note: 'Introduced modular architecture and automated quality checks.' },
    { quarter: 'Q3', title: 'Market Expansion', note: 'Localized key experiences for three new regional markets.' },
    { quarter: 'Q4', title: 'AI-Assisted Ops', note: 'Launched recommendation tools for support and logistics teams.' }
  ],
  insightSignals: [
    { label: 'Customer health score', value: 86, detail: 'Stable and trending upward for 9 weeks' },
    { label: 'Feature adoption velocity', value: 74, detail: 'Strong onboarding performance after UI refresh' },
    { label: 'Release confidence index', value: 91, detail: 'High confidence with expanded automated coverage' },
    { label: 'Ops alert response SLA', value: 67, detail: 'Improving but still below quarterly target' }
  ],
  insightActions: [
    {
      title: 'Reduce alert response lag',
      detail: 'Introduce routing rules and escalation ownership for overnight incidents.',
      owner: 'Operations'
    },
    {
      title: 'Improve onboarding retention',
      detail: 'Test two guided activation flows for first-time workspace admins.',
      owner: 'Product'
    },
    {
      title: 'Tighten release confidence',
      detail: 'Add smoke tests on critical account and billing workflows.',
      owner: 'Engineering'
    }
  ],
  offices: [
    { city: 'San Francisco', address: '98 Harbor Point, Suite 400', focus: 'Product strategy and venture launches' },
    { city: 'Berlin', address: '22 Linden Passage, Floor 3', focus: 'Design systems and enterprise delivery' },
    { city: 'Dubai', address: '17 Marina Crescent, Unit 11', focus: 'Regional growth and analytics programs' }
  ]
}

export const defaultSettings = {
  name: 'Project Lead',
  email: 'lead@smallcompany.io',
  cadence: 'Bi-weekly',
  notifyEmail: true,
  notifyPush: true,
  shareSummary: false
}
