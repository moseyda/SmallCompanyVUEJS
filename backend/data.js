export const workspaceData = {
  kpis: [
    { label: 'Projects Scanned', value: '12', trend: '+3 this month' },
    { label: 'Critical Issues Found', value: '24', trend: '-45% from last month' },
    { label: 'Code Quality Score', value: '8.4/10', trend: '+0.6 points' },
    { label: 'Security Risk Level', value: 'Medium', trend: '↓ Down from High' }
  ],
  initiatives: [
    { title: 'Enable continuous scanning', note: 'Integrate scanners into CI/CD pipelines for automated code analysis.' },
    { title: 'Reduce critical vulnerabilities', note: 'Target zero critical issues across all projects by quarter end.' },
    { title: 'Improve team code quality', note: 'Establish quality standards and provide remediation guidance.' }
  ],
  projects: [
    {
      name: 'api-gateway',
      status: 'Active',
      risk_level: 'High',
      last_scan: '2 hours ago',
      issues: 8,
      summary: 'Core API routing service with authentication layer.',
      impact: '12 critical vulnerabilities detected'
    },
    {
      name: 'frontend-dashboard',
      status: 'Active',
      risk_level: 'Low',
      last_scan: '1 day ago',
      issues: 2,
      summary: 'Main analytics dashboard and reporting UI.',
      impact: 'Latest scan: 2 minor issues fixed'
    },
    {
      name: 'payment-service',
      status: 'Active',
      risk_level: 'Critical',
      last_scan: '6 hours ago',
      issues: 15,
      summary: 'Payment processing and transaction handling service.',
      impact: '3 critical security flaws in encryption logic'
    },
    {
      name: 'user-management',
      status: 'Active',
      risk_level: 'Medium',
      last_scan: '12 hours ago',
      issues: 5,
      summary: 'User authentication and profile management system.',
      impact: 'Password validation logic needs review'
    }
  ],
  services: [
    {
      name: 'Security Scanner',
      description: 'Detects vulnerabilities, SQL injection risks, and security compliance issues.',
      bullets: ['OWASP scanning', 'Dependency vulnerability checks', 'SSL/TLS validation']
    },
    {
      name: 'Code Quality Analysis',
      description: 'Legacy migration plans focused on measurable outcomes and low-risk transitions.',
      bullets: ['Service decomposition', 'Performance profiling', 'Reliability scorecards']
    },
    {
      name: 'Performance & Metrics',
      description: 'Analyzes code efficiency, memory usage, and performance bottlenecks.',
      bullets: ['Complexity analysis', 'Memory profiling', 'Load time metrics']
    },
    {
      name: 'Compliance Checker',
      description: 'Ensures code meets industry standards (SOC2, PCI-DSS, HIPAA).',
      bullets: ['Compliance auditing', 'Regulatory reporting', 'Policy enforcement']
    }
  ],
  teamMembers: [
    {
      name: 'Sarah Chen',
      role: 'Security Lead',
      focus: 'Vulnerabilities',
      bio: 'Leads security analysis and prioritizes critical vulnerability remediation.',
      photo: '/team/mark.jpg'
    },
    {
      name: 'Mike Rodriguez',
      role: 'Backend Security Engineer',
      focus: 'Infrastructure',
      bio: 'Manages secure deployments and infrastructure scanning pipelines.',
      photo: '/team/person2.jpg'
    },
    {
      name: 'Lisa Park',
      role: 'Frontend Code Reviewer',
      focus: 'Frontend Quality',
      bio: 'Ensures frontend code meets quality standards and performance benchmarks.',
      photo: '/team/person3.jpg'
    },
    {
      name: 'David Chen',
      role: 'DevOps Engineer',
      focus: 'CI/CD Integration',
      bio: 'Integrates scanning tools into deployment pipelines and manages automation.',
      photo: '/team/person4.jpg'
    },
    {
      name: 'Emma Wilson',
      role: 'Quality Assurance',
      focus: 'Testing',
      bio: 'Maintains test coverage and validates code quality across all projects.',
      photo: '/team/person5.jpg'
    },
    {
      name: 'Marco Ferreira',
      role: 'Platform Engineer',
      focus: 'Infrastructure',
      bio: 'Manages scanning infrastructure and tool optimization for enterprise scale.',
      photo: '/team/person6.jpg'
    }
  ],
  milestones: [
    { quarter: 'Q1', title: 'Security Baseline', note: 'Scanned 8 projects, established baseline vulnerability metrics.' },
    { quarter: 'Q2', title: 'CI/CD Integration', note: 'Integrated scanners into all deployment pipelines.' },
    { quarter: 'Q3', title: 'Custom Rulesets', note: 'Built company-specific quality rules and compliance checking.' },
    { quarter: 'Q4', title: 'AI-Powered Remediation', note: 'Launched AI suggestions for vulnerability fixes.' }
  ],
  insightSignals: [
    { label: 'Critical Issues Blocked', value: 93, detail: 'Prevented 93% of critical vulnerabilities from reaching production' },
    { label: 'Average Fix Time', value: 4.2, detail: 'Days from detection to remediation (trending down)' },
    { label: 'Code Quality Score', value: 8.4, detail: 'Out of 10, up from 7.2 last quarter' },
    { label: 'Security Compliance Rate', value: 89, detail: 'Meets 89% of OWASP Top 10 standards' }
  ],
  insightActions: [
    {
      title: 'Address payment-service vulnerabilities',
      detail: 'Three critical encryption flaws require immediate remediation.',
      owner: 'Security'
    },
    {
      title: 'Implement automated fixes',
      detail: 'Enable auto-remediation for low-severity dependency updates.',
      owner: 'DevOps'
    },
    {
      title: 'Expand scanning scope',
      detail: 'Onboard 4 additional microservices and infrastructure code scanning.',
      owner: 'Engineering'
    }
  ],
  rulesets: [
    { name: 'OWASP Top 10', enabled: true, rules_count: 12, last_updated: '2 weeks ago' },
    { name: 'CWE Top 25', enabled: true, rules_count: 25, last_updated: '1 month ago' },
    { name: 'PCI-DSS v3.2.1', enabled: true, rules_count: 34, last_updated: '3 weeks ago' },
    { name: 'Custom Code Quality', enabled: true, rules_count: 18, last_updated: '5 days ago' }
  ]
}

export const defaultSettings = {
  name: 'Security Lead',
  email: 'security@codebase.io',
  cadence: 'Weekly',
  notifyEmail: true,
  notifyPush: true,
  shareSummary: true
}
