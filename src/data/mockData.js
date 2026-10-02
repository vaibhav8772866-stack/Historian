export const USER_PROFILE = {
  name: "Arambh Srivastava",
  role: "CEO",
  email: "arambh@historian.enterprise",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  initials: "AS",
  organization: "Global Enterprise Holdings",
  securityStatus: "Secure Session",
  lastActive: "Just now",
};

export const SYSTEM_STATUS = {
  overallStatus: "All Systems Operational",
  statusColor: "emerald",
  services: [
    { name: "PostgreSQL", status: "Connected", latency: "14ms", uptime: "99.99%" },
    { name: "Neo4j Graph DB", status: "Connected", latency: "22ms", uptime: "99.98%" },
    { name: "Vector Database", status: "Connected", latency: "18ms", uptime: "99.95%" },
    { name: "AI Services", status: "Connected", latency: "45ms", uptime: "99.99%" },
    { name: "Storage", status: "Connected", latency: "12ms", uptime: "100.0%" },
  ]
};

export const HERO_CARDS_DATA = {
  recentQuery: {
    title: "Recent Query",
    question: "Why did profit decline by 14% in Q3 2019 despite record sales?",
    timestamp: "Asked just now",
    category: "Financial Root Cause",
    department: "Finance & Logistics",
  },
  rootCause: {
    title: "Top Root Cause Identified",
    mainText: "Supplier Price Rise triggered a chain of events leading to Margin Collapse",
    confidence: 94,
    impactLevel: "Critical",
    attributionTime: "0.42s",
  },
  aiRecommendation: {
    title: "AI Recommendation",
    summary: "Restructure supplier agreements with volume price caps before peak Q3 demand windows.",
    cta: "View Full Recommendation →",
    details: {
      actionPlan: [
        "Institute index-linked price ceilings across Tier-1 precision component suppliers.",
        "Implement dynamic buffer inventory holding for high-volatility raw materials 45 days prior to seasonal surges.",
        "Renegotiate spot-freight SLAs with regional logistics partners to prevent surge-rate emergency shipments."
      ],
      projectedSavings: "₹1.8M – ₹2.4M annually",
      riskMitigation: "Reduces margin sensitivity to raw material price shocks by 78%",
      estimatedImplementationTime: "3 to 4 weeks"
    }
  }
};

export const KPI_METRICS = [
  {
    id: "accuracy",
    title: "Cause Attribution Accuracy",
    value: "94%",
    description: "High confidence insights",
    change: "↑ 18% vs last month",
    trend: "up",
    color: "emerald",
    icon: "Target"
  },
  {
    id: "time-saved",
    title: "Investigation Time Saved",
    value: "10x",
    description: "Faster root cause analysis",
    change: "↑ 12x vs last month",
    trend: "up",
    color: "blue",
    icon: "Zap"
  },
  {
    id: "loss-prevented",
    title: "Potential Loss Prevented",
    value: "₹2.4M",
    description: "Average annual impact",
    change: "↑ 22% vs last month",
    trend: "up",
    color: "indigo",
    icon: "ShieldCheck"
  },
  {
    id: "data-sources",
    title: "Data Sources Connected",
    value: "18",
    description: "Enterprise systems",
    change: "↑ 3 new this month",
    trend: "up",
    color: "purple",
    icon: "Database"
  },
  {
    id: "insights-generated",
    title: "Insights Generated",
    value: "247",
    description: "This month",
    change: "↑ 31% vs last month",
    trend: "up",
    color: "rose",
    icon: "Sparkles"
  }
];

export const TOP_EVIDENCE_SOURCES = [
  {
    id: "doc-1",
    title: "Supplier Contract — Global Parts Ltd.",
    type: "PDF",
    confidence: 94,
    fileSize: "2.4 MB",
    date: "May 12, 2019",
    category: "Procurement",
    snippet: "Clause 14.2 allows quarterly raw material price adjustments up to 20% under commodity surge clauses.",
    keyQuotes: [
      "Supplier revised baseline unit pricing for Tier-1 assembly modules by +18.4% effective May 15, 2019.",
      "Cost escalation was attributed to global supply chain raw lithium & copper spot price increases."
    ]
  },
  {
    id: "doc-2",
    title: "Q3 2019 Financial Report",
    type: "XLSX",
    confidence: 92,
    fileSize: "4.1 MB",
    date: "Oct 05, 2019",
    category: "Financial",
    snippet: "Gross margins contracted by 380 bps from 41.2% to 37.4%; Operating margin declined by 14.1% YoY.",
    keyQuotes: [
      "Total sales hit all-time record of ₹48.2M (+12% YoY), yet net EBITDA collapsed to ₹4.1M.",
      "Expedited shipping expenditures surged 27% over budgeted operational allocations."
    ]
  },
  {
    id: "doc-3",
    title: "Logistics Email Thread (Jun–Jul 2019)",
    type: "EML",
    confidence: 90,
    fileSize: "680 KB",
    date: "Jul 18, 2019",
    category: "Communications",
    snippet: "Urgent air freight authorizations issued by VP of Supply Chain to avert assembly line shutdown.",
    keyQuotes: [
      "From: logistics-dispatch@enterprise.com — 'We had to reroute 42 container loads via priority air cargo at 3.2x standard sea rates.'",
      "Line stoppage was prevented, but logistics unit cost per pallet rose by 27.3%."
    ]
  },
  {
    id: "doc-4",
    title: "Inventory Report — Warehouse A",
    type: "XLSX",
    confidence: 89,
    fileSize: "3.5 MB",
    date: "Jun 28, 2019",
    category: "Operations",
    snippet: "Inventory turnover ratio dropped by 23% due to critical stockout in connector sub-assemblies.",
    keyQuotes: [
      "Warehouse A stockout incidents spiked from 4 to 31 active backorders within 4 weeks.",
      "Assembly line utilization fell to 68% during Week 24 due to missing sub-components."
    ]
  },
  {
    id: "doc-5",
    title: "Customer Complaints Report",
    type: "PDF",
    confidence: 87,
    fileSize: "1.8 MB",
    date: "Aug 14, 2019",
    category: "Customer Experience",
    snippet: "Late fulfillment inquiries surged 310% during July-August 2019 with enterprise SLA penalties.",
    keyQuotes: [
      "Customer satisfaction score dipped from 92 to 74 among enterprise tier-1 key accounts.",
      "Fulfillment delay penalty credits totaled ₹320,000 in Q3."
    ]
  }
];

export const INSIGHTS_DATA = [
  {
    id: "ins-1",
    category: "Root Causes",
    title: "Uncapped Supplier Price Revision Clauses",
    description: "Multi-year supplier agreements lacked inflationary caps, allowing suppliers to push 18% cost surges directly during peak seasonal demand.",
    confidence: 96,
    evidenceCount: 8,
    impact: "High Severity",
    impactColor: "rose",
    department: "Procurement",
    timeline: "May 2019 – Present"
  },
  {
    id: "ins-2",
    category: "Emerging Patterns",
    title: "End-of-Quarter Expedited Freight Spikes",
    description: "Every Q3 over 4 consecutive years shows a 22-28% increase in emergency spot-rate air logistics to meet quarterly delivery commitments.",
    confidence: 91,
    evidenceCount: 14,
    impact: "Medium Severity",
    impactColor: "amber",
    department: "Logistics",
    timeline: "2018 – 2022"
  },
  {
    id: "ins-3",
    category: "Recurring Problems",
    title: "Sub-assembly Inventory Buffer Depletion",
    description: "Warehouse buffer thresholds are calibrated against average monthly sales rather than peak seasonal variance, causing stockouts.",
    confidence: 88,
    evidenceCount: 6,
    impact: "High Severity",
    impactColor: "rose",
    department: "Warehouse & Operations",
    timeline: "Annual Q2/Q3"
  },
  {
    id: "ins-4",
    category: "Business Opportunities",
    title: "Consolidated Dual-Sourcing Strategy",
    description: "Introducing secondary regional component fabricators can lower procurement exposure by 34% and improve delivery reliability by 21%.",
    confidence: 93,
    evidenceCount: 11,
    impact: "High Positive Impact",
    impactColor: "emerald",
    department: "Strategic Sourcing",
    timeline: "Forward Looking"
  },
  {
    id: "ins-5",
    category: "Risk Signals",
    title: "Commodity Spot Index Divergence",
    description: "Copper and aluminum spot index price anomalies predict component price escalation by a 60-day leading indicator window.",
    confidence: 95,
    evidenceCount: 19,
    impact: "Critical Early Warning",
    impactColor: "purple",
    department: "Risk Management",
    timeline: "Active Real-Time"
  }
];

export const FORECAST_DATA = [
  { month: "Jan", historicalRevenue: 38.2, forecastRevenue: null, historicalProfit: 5.8, forecastProfit: null, inventoryDays: 32, demandIndex: 104 },
  { month: "Feb", historicalRevenue: 39.5, forecastRevenue: null, historicalProfit: 6.1, forecastProfit: null, inventoryDays: 31, demandIndex: 108 },
  { month: "Mar", historicalRevenue: 42.1, forecastRevenue: null, historicalProfit: 6.4, forecastProfit: null, inventoryDays: 30, demandIndex: 115 },
  { month: "Apr", historicalRevenue: 41.8, forecastRevenue: null, historicalProfit: 6.2, forecastProfit: null, inventoryDays: 33, demandIndex: 112 },
  { month: "May", historicalRevenue: 44.0, forecastRevenue: null, historicalProfit: 6.7, forecastProfit: null, inventoryDays: 35, demandIndex: 120 },
  { month: "Jun", historicalRevenue: 46.2, forecastRevenue: null, historicalProfit: 6.9, forecastProfit: null, inventoryDays: 38, demandIndex: 128 },
  { month: "Jul", historicalRevenue: 45.9, forecastRevenue: 45.9, historicalProfit: 6.5, forecastProfit: 6.5, inventoryDays: 41, demandIndex: 130 },
  { month: "Aug", historicalRevenue: null, forecastRevenue: 48.4, historicalProfit: null, forecastProfit: 7.2, inventoryDays: 40, demandIndex: 135 },
  { month: "Sep", historicalRevenue: null, forecastRevenue: 51.2, historicalProfit: null, forecastProfit: 7.8, inventoryDays: 37, demandIndex: 142 },
  { month: "Oct", historicalRevenue: null, forecastRevenue: 53.0, historicalProfit: null, forecastProfit: 8.1, inventoryDays: 35, demandIndex: 146 },
  { month: "Nov", historicalRevenue: null, forecastRevenue: 55.4, historicalProfit: null, forecastProfit: 8.5, inventoryDays: 34, demandIndex: 152 },
  { month: "Dec", historicalRevenue: null, forecastRevenue: 58.1, historicalProfit: null, forecastProfit: 9.0, inventoryDays: 33, demandIndex: 160 },
];

export const REPORTS_DATA = [
  {
    id: "rep-1",
    title: "Q3 2019 Profit & Margin Variance Root Cause Audit",
    created: "Today, 10:24 AM",
    createdBy: "Harvey (Automated)",
    status: "Published",
    confidence: 94,
    pages: 14,
    summary: "Comprehensive forensic investigation of the 14% margin collapse across supplier contracts, inventory shifts, and logistics surcharges."
  },
  {
    id: "rep-2",
    title: "Multi-Year Supplier Pricing Sensitivity Analysis (2018–2023)",
    created: "Yesterday, 4:15 PM",
    createdBy: "Arambh Srivastava",
    status: "Published",
    confidence: 92,
    pages: 22,
    summary: "Attribution model tracing ₹8.4M in supplier price shifts to raw commodity indexes and contracted price adjustment clauses."
  },
  {
    id: "rep-3",
    title: "Logistics Optimization & Expedited Freight Mitigation Plan",
    created: "Aug 16, 2026",
    createdBy: "Harvey (AI Synthesis)",
    status: "Draft",
    confidence: 89,
    pages: 9,
    summary: "Predictive recommendations to eliminate repeat ₹1.2M emergency freight expenditure during peak Q3 shipment windows."
  },
  {
    id: "rep-4",
    title: "Enterprise Knowledge Graph Causal Linkage Summary",
    created: "Aug 12, 2026",
    createdBy: "System Archival",
    status: "Published",
    confidence: 96,
    pages: 31,
    summary: "Graph topology report mapping 1,420 causal entity links across 18 connected corporate data silos."
  }
];

export const ALERTS_DATA = [
  {
    id: "alt-1",
    severity: "Critical",
    title: "Supplier Risk Detected",
    description: "Precision Components Ltd. raw material lead time spiked by 14 days, matching the precursor pattern of the 2019 supply bottleneck.",
    timestamp: "12m ago",
    entity: "Global Parts Ltd.",
    recommendation: "Engage backup supplier agreement and increase safety buffer stock by 20% immediately.",
    status: "Active"
  },
  {
    id: "alt-2",
    severity: "Critical",
    title: "Unusual Logistics Cost Surge Detected",
    description: "Air freight dispatch spending increased by 31% over normal weekly threshold in Central European distribution hub.",
    timestamp: "1h ago",
    entity: "Logistics Hub B",
    recommendation: "Review freight forwarding authorizations and transition non-urgent pallets to rail transit.",
    status: "Active"
  },
  {
    id: "alt-3",
    severity: "Warning",
    title: "Inventory Shortage Pattern Detected",
    description: "Connector sub-assembly safety buffer at Warehouse A dropped below 10-day burn rate limit.",
    timestamp: "3h ago",
    entity: "Warehouse A",
    recommendation: "Trigger automatic reorder from secondary supplier.",
    status: "Acknowledged"
  },
  {
    id: "alt-4",
    severity: "Informational",
    title: "Customer Complaint Metric Stabilized",
    description: "Late fulfillment inquiries normalized to baseline 1.2% following priority dispatch adjustments.",
    timestamp: "1d ago",
    entity: "Customer Support",
    recommendation: "No action required.",
    status: "Resolved"
  }
];

export const SUGGESTED_QUERIES = [
  "Why did profit decline in Q3 2019?",
  "Which suppliers caused the most operational issues?",
  "What caused our largest inventory shortage?",
  "Which decisions produced the best outcomes?",
  "What patterns repeat every year?"
];
