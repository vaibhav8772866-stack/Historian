import { PRIMARY_CAUSAL_CHAIN } from '../data/timelineData';
import { TOP_EVIDENCE_SOURCES } from '../data/mockData';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const HARVEY_KNOWLEDGE_BASE = [
  {
    keywords: ["what happened after", "after supplier", "after price increase", "after the supplier"],
    answer: "The supplier increased prices by 18%. This caused inventory problems and higher shipping costs, which reduced profit.",
    mainCause: "Supplier Price Rise",
    rootCause: "Supplier Price Rise",
    confidence: 94,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[0], // Supplier Contract
      TOP_EVIDENCE_SOURCES[1], // Q3 Financial Report
      TOP_EVIDENCE_SOURCES[2]  // Logistics Email Thread
    ],
    recommendation: "Renegotiate supplier pricing and add volume price caps."
  },
  {
    keywords: ["why did profit decline", "profit decline", "q3 2019", "record sales", "margin", "decline", "profit fell"],
    answer: "Profit fell mainly because supplier costs increased. This led to inventory delays and higher shipping costs.",
    mainCause: "Supplier Price Rise",
    rootCause: "Supplier Price Rise",
    confidence: 94,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[0],
      TOP_EVIDENCE_SOURCES[1],
      TOP_EVIDENCE_SOURCES[2]
    ],
    recommendation: "Restructure supplier agreements with volume price caps before peak demand."
  },
  {
    keywords: ["which supplier", "who caused", "vendor", "global parts", "supplier caused"],
    answer: "Global Parts Ltd. had the largest price increase and delivery delays.",
    mainCause: "Global Parts Ltd. Sourcing Fragility",
    rootCause: "Global Parts Ltd. Sourcing Fragility",
    confidence: 92,
    evidenceCount: 2,
    evidence: [
      TOP_EVIDENCE_SOURCES[0],
      TOP_EVIDENCE_SOURCES[3]
    ],
    recommendation: "Establish secondary regional backup suppliers."
  },
  {
    keywords: ["what should we do", "what to do", "next steps", "action plan", "what should be done"],
    answer: "Renegotiate supplier pricing and improve backup supplier options.",
    mainCause: "Contract Terms & Dual-Sourcing",
    rootCause: "Contract Terms & Dual-Sourcing",
    confidence: 95,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[0],
      TOP_EVIDENCE_SOURCES[1]
    ],
    recommendation: "Institute dynamic price caps across tier-1 supplier contracts."
  },
  {
    keywords: ["what evidence supports", "what evidence", "evidence supports", "proof", "citations"],
    answer: "The main evidence is the supplier contract, inventory report, and Q3 financial report.",
    mainCause: "Verified Contractual & Financial Ledgers",
    rootCause: "Verified Contractual & Financial Ledgers",
    confidence: 96,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[0],
      TOP_EVIDENCE_SOURCES[1],
      TOP_EVIDENCE_SOURCES[3]
    ],
    recommendation: "Review the attached forensic document citations."
  },
  {
    keywords: ["largest inventory shortage", "inventory shortage", "warehouse shortage", "stockout"],
    answer: "The shortage occurred when component purchase orders were delayed during supplier price negotiations.",
    mainCause: "Delayed Purchase Orders & Buffer Depletion",
    rootCause: "Delayed Purchase Orders & Buffer Depletion",
    confidence: 91,
    evidenceCount: 2,
    evidence: [
      TOP_EVIDENCE_SOURCES[3],
      TOP_EVIDENCE_SOURCES[0]
    ],
    recommendation: "Maintain a 45-day safety stock for volatile sub-assemblies."
  },
  {
    keywords: ["best outcomes", "best decisions", "successes", "positive decisions"],
    answer: "Long-term hedging on volume pricing and consolidating regional logistics produced the best cost savings.",
    mainCause: "Strategic Volume Hedging & Logistics Consolidation",
    rootCause: "Strategic Volume Hedging & Logistics Consolidation",
    confidence: 96,
    evidenceCount: 2,
    evidence: [
      TOP_EVIDENCE_SOURCES[1]
    ],
    recommendation: "Scale predictive hedging to all critical commodity categories."
  },
  {
    keywords: ["patterns repeat", "repeat every year", "cyclical", "recurring pattern"],
    answer: "Emergency shipping costs spike in Q3, and component lead times lengthen during summer supplier slowdowns.",
    mainCause: "Seasonal Q3 Shipping Surges",
    rootCause: "Seasonal Q3 Shipping Surges",
    confidence: 93,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[1],
      TOP_EVIDENCE_SOURCES[2]
    ],
    recommendation: "Shift purchase orders 60 days forward to avoid rush logistics."
  }
];

export async function queryHarveyAPI(queryText, sessionId = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/harvey/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: queryText, session_id: sessionId })
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        answer: data.message,
        mainCause: "Historian Analytics Engine",
        rootCause: "Grounded ML Insight",
        confidence: 95,
        evidenceCount: data.sources ? data.sources.length : 1,
        evidence: TOP_EVIDENCE_SOURCES.slice(0, 3),
        recommendation: "Review student analytics dashboard and recommended interventions.",
        sessionId: data.session_id
      };
    }
  } catch (err) {
    console.warn("Backend FastAPI offline, using local HARVEY knowledge engine fallback.");
  }

  return queryHarveyAssistant(queryText);
}

export function queryHarveyAssistant(queryText) {
  const normalized = queryText.toLowerCase().trim();
  
  if (!normalized) {
    return {
      answer: "Please enter a question about enterprise history, student performance, or risk metrics.",
      mainCause: "N/A",
      rootCause: "N/A",
      confidence: 0,
      evidenceCount: 0,
      evidence: [],
      recommendation: "Type any question into the search bar."
    };
  }

  const match = HARVEY_KNOWLEDGE_BASE.find(item => 
    item.keywords.some(kw => normalized.includes(kw))
  );

  if (match) {
    return { ...match };
  }

  // Concise fallback
  return {
    answer: `Historical records link "${queryText}" to recent performance trends and attendance metrics analyzed by Historian.`,
    mainCause: "Student Metric Attribution",
    rootCause: "Grounded Analytics Baseline",
    confidence: 90,
    evidenceCount: 3,
    evidence: [
      TOP_EVIDENCE_SOURCES[0],
      TOP_EVIDENCE_SOURCES[1],
      TOP_EVIDENCE_SOURCES[2]
    ],
    recommendation: "Review historical records and predicted risk factors."
  };
}
