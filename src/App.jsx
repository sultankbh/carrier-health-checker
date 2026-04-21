
import React, { useMemo, useState } from "react";

const CARRIERS = [
  { id: "americo", name: "Americo" },
  { id: "aetna", name: "Aetna Accendo" },
  { id: "americanAmicable", name: "American Amicable" },
  { id: "transamerica", name: "Transamerica" },
  { id: "corebridge", name: "Corebridge" },
];

const STATUS_META = {
  green: { label: "Approved", card: "card-green", badge: "badge-green", dot: "dot-green" },
  yellow: { label: "Modified / Review", card: "card-yellow", badge: "badge-yellow", dot: "dot-yellow" },
  red: { label: "Decline", card: "card-red", badge: "badge-red", dot: "dot-red" },
};

const RECENCY_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "current", label: "Current / ongoing" },
  { value: "lt1", label: "Within 1 year" },
  { value: "1to2", label: "1 to 2 years ago" },
  { value: "2to3", label: "2 to 3 years ago" },
  { value: "3to4", label: "3 to 4 years ago" },
  { value: "gt2", label: "More than 2 years ago" },
  { value: "gt3", label: "More than 3 years ago" },
  { value: "gt4", label: "More than 4 years ago" },
];

const CONDITION_LIBRARY = [
  { key: "diabetes", label: "Diabetes", medicationOptions: ["Unknown", "Metformin / oral meds", "Insulin"] },
  { key: "neuropathy", label: "Neuropathy", causeOptions: ["Unknown", "Due to diabetes", "Not due to diabetes"] },
  { key: "copd", label: "COPD", medicationOptions: ["Unknown", "Inhaler", "Oxygen"] },
  { key: "sleep_apnea", label: "Sleep Apnea", medicationOptions: ["Unknown", "CPAP only", "Oxygen"] },
  { key: "heart_attack", label: "Heart Attack", recency: true },
  { key: "heart_surgery", label: "Heart Surgery", recency: true },
  { key: "heart_valve", label: "Heart Valve Replacement", recency: true },
  { key: "stroke", label: "Stroke / TIA", recency: true },
  { key: "stent", label: "Stent", recency: true },
  { key: "angina", label: "Angina / Chest Pain", recency: true },
  { key: "aneurysm", label: "Aneurysm", recency: true },
  { key: "dui", label: "DUI", recency: true },
  { key: "felony", label: "Felony", recency: true },
  { key: "hepatitis_a", label: "Hepatitis A", recency: true },
  { key: "hepatitis_b", label: "Hepatitis B", recency: true },
  { key: "hepatitis_c", label: "Hepatitis C", recency: true },
  { key: "illegal_drugs", label: "Illegal Drugs", recency: true },
  { key: "jail", label: "Jail / Incarcerated", currentToggle: true },
  { key: "parole_probation", label: "Parole / Probation", currentToggle: true },
  { key: "oxygen", label: "Oxygen Use", recency: true },
  { key: "walker", label: "Walker" },
  { key: "wheelchair", label: "Wheelchair / Scooter / Cart", recency: true, causeOptions: ["Unknown", "Due to illness/disease", "Not due to illness/disease"] },
  { key: "afib", label: "AFIB / Irregular Heartbeat" },
  { key: "alcohol_drug_abuse", label: "Alcohol / Drug Abuse", recency: true },
  { key: "alzheimers", label: "Alzheimer's / Dementia / Memory Loss" },
  { key: "amputation", label: "Amputation", causeOptions: ["Unknown", "Due to disease/diabetes", "Not due to disease"] },
  { key: "arthritis", label: "Arthritis" },
  { key: "assisted_living", label: "Assisted Living / Long Term Care", currentToggle: true },
  { key: "asthma", label: "Asthma (Chronic)" },
  { key: "bipolar", label: "Bipolar" },
  { key: "bronchitis", label: "Bronchitis (Chronic)", recency: true },
  { key: "cancer", label: "Cancer", recency: true },
  { key: "cirrhosis", label: "Cirrhosis", recency: true },
  { key: "chf", label: "Congestive Heart Failure / Heart Failure" },
  { key: "crohns", label: "Crohn's Disease" },
  { key: "cystic_fibrosis", label: "Cystic Fibrosis" },
  { key: "depression", label: "Depression" },
  { key: "dialysis", label: "Dialysis", recency: true },
  { key: "emphysema", label: "Emphysema", recency: true, hospitalizationOptions: ["Unknown", "No", "More than one in past 24 months"] },
  { key: "epilepsy", label: "Epilepsy / Seizures", recency: true },
  { key: "kidney_disease", label: "Kidney Disease / Failure", currentToggle: true },
  { key: "liver_disease", label: "Liver Disease", recency: true },
  { key: "lupus", label: "Lupus", recency: true },
  { key: "mental_incapacity", label: "Mental Incapacity" },
  { key: "multiple_sclerosis", label: "Multiple Sclerosis (MS)", recency: true },
  { key: "parkinsons", label: "Parkinson's Disease", recency: true },
  { key: "ptsd", label: "PTSD" },
  { key: "schizophrenia", label: "Schizophrenia" },
  { key: "terminal_illness", label: "Terminal Illness", currentToggle: true },
  { key: "organ_transplant", label: "Organ Transplant" },
];

function outcomeStatus(text) {
  const v = String(text || "").toLowerCase();
  if (v.includes("decline") && !v.includes("graded") && !v.includes("modified") && !v.includes("rop") && !v.includes("review") && !v.includes("gi")) return "red";
  if (v.includes("modified") || v.includes("graded") || v.includes("rop") || v.includes("review") || v.includes("gi") || v.includes("guaranteed issue") || v.includes("manual")) return "yellow";
  return "green";
}

function worstStatus(statuses) {
  if (statuses.includes("red")) return "red";
  if (statuses.includes("yellow")) return "yellow";
  return "green";
}

function findConditionDef(key) {
  return CONDITION_LIBRARY.find((c) => c.key === key);
}

function defaultEntry(conditionKey = "diabetes") {
  return {
    id: crypto.randomUUID(),
    conditionKey,
    medication: "Unknown",
    cause: "Unknown",
    recency: "unknown",
    current: false,
    hospitalization: "Unknown",
    notes: "",
  };
}

function makeUnknownMap() {
  return {
    americo: "Review",
    aetna: "Review",
    americanAmicable: "Review",
    transamerica: "Review",
    corebridge: "Review",
  };
}

function evaluateEntry(entry) {
  const r = entry.recency;
  const currentish = entry.current || r === "current";

  switch (entry.conditionKey) {
    case "diabetes":
      if (entry.medication === "Metformin / oral meds") {
        return {
          label: "Diabetes - Metformin / oral meds",
          outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Immediate", transamerica: "Select", corebridge: "Level" },
        };
      }
      if (entry.medication === "Insulin") {
        return {
          label: "Diabetes - Insulin",
          outcomes: {
            americo: "Review - sheet says no insulin use for Select 1",
            aetna: "Preferred",
            americanAmicable: "ROP if insulin prior to age 50 / otherwise Immediate",
            transamerica: "Select",
            corebridge: "Level",
          },
        };
      }
      return {
        label: "Diabetes",
        outcomes: {
          americo: "Select 1",
          aetna: "Preferred",
          americanAmicable: "ROP if insulin prior to age 50 / otherwise Immediate",
          transamerica: "Select",
          corebridge: "Level",
        },
      };

    case "neuropathy":
      return entry.cause === "Due to diabetes"
        ? {
            label: "Neuropathy - due to diabetes",
            outcomes: { americo: "Select 2", aetna: "Modified", americanAmicable: "ROP if due to diabetes prior to age 50", transamerica: "Select", corebridge: "Level" },
          }
        : {
            label: "Neuropathy - not due to diabetes / unspecified",
            outcomes: { americo: "Select 2", aetna: "Immediate", americanAmicable: "Immediate", transamerica: "Select", corebridge: "Level" },
          };

    case "copd":
      if (entry.medication === "Oxygen") {
        return {
          label: "COPD - oxygen",
          outcomes: { americo: "Decline", aetna: "Decline", americanAmicable: "Decline", transamerica: "Graded", corebridge: "Graded" },
        };
      }
      if (entry.medication === "Inhaler") {
        return {
          label: "COPD - inhaler",
          outcomes: {
            americo: "Select 2",
            aetna: "Standard",
            americanAmicable: r === "gt3" ? "Immediate" : r === "2to3" ? "Graded" : r === "lt1" || r === "1to2" ? "ROP" : "Review - depends on recency",
            transamerica: "Select",
            corebridge: "Level",
          },
        };
      }
      return {
        label: "COPD",
        outcomes: {
          americo: "Select 2",
          aetna: "Standard",
          americanAmicable: "ROP / Graded / Immediate depending on recency",
          transamerica: "Select",
          corebridge: "Level if inhaler / Graded if oxygen",
        },
      };

    case "sleep_apnea":
      if (entry.medication === "Oxygen") {
        return {
          label: "Sleep Apnea - oxygen",
          outcomes: { americo: "Decline", aetna: "Decline", americanAmicable: "Decline", transamerica: "Graded", corebridge: "Graded" },
        };
      }
      return {
        label: "Sleep Apnea",
        outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Review oxygen use", transamerica: "Select", corebridge: "Level" },
      };

    case "heart_attack":
    case "heart_surgery":
    case "heart_valve": {
      const label = entry.conditionKey === "heart_attack" ? "Heart Attack" : entry.conditionKey === "heart_surgery" ? "Heart Surgery" : "Heart Valve Replacement";
      return {
        label,
        outcomes: {
          americo: "Select 2",
          aetna: r === "lt1" ? "Modified" : r === "1to2" ? "Standard" : r === "gt2" || r === "2to3" || r === "3to4" || r === "gt3" || r === "gt4" ? "Preferred" : "Review - depends on recency",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review - depends on recency",
          transamerica: "Select",
          corebridge: entry.conditionKey === "heart_valve" ? "Graded" : r === "lt1" || r === "1to2" ? "Decline" : "Review",
        },
      };
    }

    case "stroke":
      return {
        label: "Stroke / TIA",
        outcomes: {
          americo: "Select 2",
          aetna: r === "lt1" ? "Modified" : r === "1to2" ? "Standard" : r === "gt2" || r === "2to3" || r === "3to4" || r === "gt3" || r === "gt4" ? "Preferred" : "Review - depends on recency",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review - depends on recency",
          transamerica: "Select",
          corebridge: r === "lt1" ? "Decline" : "Review",
        },
      };

    case "stent":
      return {
        label: "Stent",
        outcomes: {
          americo: "Select 2",
          aetna: "Preferred",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review - depends on recency",
          transamerica: "Select",
          corebridge: r === "lt1" || r === "1to2" ? "Graded" : "Review",
        },
      };

    case "angina":
      return {
        label: "Angina / Chest Pain",
        outcomes: {
          americo: "Select 1",
          aetna: r === "lt1" ? "Modified" : r === "1to2" ? "Standard" : r === "gt2" || r === "2to3" || r === "3to4" || r === "gt3" || r === "gt4" ? "Preferred" : "Review - depends on recency",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : "Review",
          transamerica: "Select",
          corebridge: "Level",
        },
      };

    case "aneurysm":
      return {
        label: "Aneurysm",
        outcomes: {
          americo: "Select 1",
          aetna: r === "lt1" ? "Modified" : "Review",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : "Review",
          transamerica: "Select",
          corebridge: "Level",
        },
      };

    case "dui":
      return {
        label: "DUI",
        outcomes: {
          americo: "Select 1",
          aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review",
          americanAmicable: "Level",
          transamerica: "Select",
          corebridge: r === "lt1" || r === "1to2" ? "Decline" : "Review",
        },
      };

    case "felony":
      return {
        label: "Felony",
        outcomes: {
          americo: r === "lt1" ? "Decline" : "Review",
          aetna: "Preferred",
          americanAmicable: "Level",
          transamerica: r === "lt1" || r === "1to2" ? "Decline" : "Review",
          corebridge: r === "lt1" || r === "1to2" ? "Decline" : "Review",
        },
      };

    case "hepatitis_a":
      return {
        label: "Hepatitis A",
        outcomes: {
          americo: "Select 1",
          aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review",
          americanAmicable: currentish || r === "lt1" || r === "1to2" ? "ROP" : "Review",
          transamerica: "Select",
          corebridge: "Level",
        },
      };

    case "hepatitis_b":
      return {
        label: "Hepatitis B",
        outcomes: {
          americo: "Select 2",
          aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review",
          americanAmicable: currentish || r === "lt1" || r === "1to2" ? "ROP" : "Review",
          transamerica: "Select",
          corebridge: "Graded",
        },
      };

    case "hepatitis_c":
      return {
        label: "Hepatitis C",
        outcomes: {
          americo: "Decline",
          aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review",
          americanAmicable: currentish || r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review",
          transamerica: "Select",
          corebridge: "Graded",
        },
      };

    case "illegal_drugs":
      return {
        label: "Illegal Drugs",
        outcomes: {
          americo: r === "lt1" || r === "1to2" ? "Decline" : "Review",
          aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : "Review",
          transamerica: "Graded",
          corebridge: "Graded",
        },
      };

    case "jail":
      return {
        label: "Jail / Incarcerated",
        outcomes: {
          americo: currentish ? "Decline" : "Review",
          aetna: "Preferred",
          americanAmicable: "Decline",
          transamerica: currentish ? "Decline" : "Review",
          corebridge: "Decline",
        },
      };

    case "parole_probation":
      return {
        label: "Parole / Probation",
        outcomes: {
          americo: "Select 2",
          aetna: "Preferred",
          americanAmicable: "Level",
          transamerica: currentish ? "Decline" : "Review",
          corebridge: "Level",
        },
      };

    case "oxygen":
      return {
        label: "Oxygen Use",
        outcomes: {
          americo: "Decline",
          aetna: currentish || r === "lt1" ? "Decline" : "Review",
          americanAmicable: "Decline",
          transamerica: "Graded",
          corebridge: "Graded",
        },
      };

    case "wheelchair":
      return {
        label: "Wheelchair / Scooter / Cart",
        outcomes: {
          americo: "Decline",
          aetna: entry.cause === "Due to illness/disease" ? "Decline" : "Review",
          americanAmicable: entry.cause === "Due to illness/disease" ? "Decline" : "Review",
          transamerica: currentish || r === "lt1" ? "Graded" : "Review",
          corebridge: "Graded",
        },
      };

    case "emphysema":
      return {
        label: "Emphysema",
        outcomes: {
          americo: "Select 2",
          aetna: "Standard",
          americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review",
          transamerica: "Select",
          corebridge: entry.hospitalization === "More than one in past 24 months" ? "Decline" : "Review",
        },
      };

    default: {
      const simple = {
        afib: { label: "AFIB / Irregular Heartbeat", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
        alcohol_drug_abuse: { label: "Alcohol / Drug Abuse", outcomes: { americo: "Select 2", aetna: "Modified", americanAmicable: "ROP", transamerica: "Decline", corebridge: "Graded" } },
        alzheimers: { label: "Alzheimer's / Dementia / Memory Loss", outcomes: { americo: "Select 2", aetna: "Decline", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" } },
        amputation: { label: "Amputation", outcomes: { americo: "Select 2", aetna: entry.cause === "Due to disease/diabetes" ? "Decline" : "Modified", americanAmicable: entry.cause === "Due to disease/diabetes" ? "Decline" : "Review", transamerica: "Decline", corebridge: "Graded" } },
        arthritis: { label: "Arthritis", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
        assisted_living: { label: "Assisted Living / Long Term Care", outcomes: { americo: "Select 1", aetna: "Decline", americanAmicable: "Decline", transamerica: currentish ? "Decline" : "Review", corebridge: "Decline" } },
        asthma: { label: "Asthma (Chronic)", outcomes: { americo: "Select 1", aetna: "Standard", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" } },
        bipolar: { label: "Bipolar", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" } },
        bronchitis: { label: "Bronchitis (Chronic)", outcomes: { americo: "Select 2", aetna: "Standard", americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review", transamerica: "Select", corebridge: "Level" } },
        cancer: { label: "Cancer", outcomes: { americo: r === "lt1" || r === "1to2" ? "GI" : "Review", aetna: currentish || r === "lt1" || r === "1to2" ? "Decline" : "Review", americanAmicable: currentish || r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review", transamerica: currentish || r === "lt1" || r === "1to2" ? "Decline" : r === "2to3" || r === "3to4" ? "Graded" : "Review", corebridge: "Review / some cancers Level" } },
        cirrhosis: { label: "Cirrhosis", outcomes: { americo: "Decline", aetna: r === "lt1" || r === "1to2" ? "Modified" : "Review", americanAmicable: r === "lt1" || r === "1to2" ? "ROP" : r === "2to3" ? "Graded" : "Review", transamerica: "Graded", corebridge: "Decline" } },
        chf: { label: "Congestive Heart Failure / Heart Failure", outcomes: { americo: "Select 2", aetna: "Decline", americanAmicable: "Decline", transamerica: "Select", corebridge: "Decline" } },
        crohns: { label: "Crohn's Disease", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
        cystic_fibrosis: { label: "Cystic Fibrosis", outcomes: { americo: "Select 2", aetna: "Decline", americanAmicable: "Level", transamerica: "Decline", corebridge: "Level" } },
        depression: { label: "Depression", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
        dialysis: { label: "Dialysis", outcomes: { americo: "Decline", aetna: "Decline", americanAmicable: "Decline", transamerica: "Graded", corebridge: "Decline" } },
        epilepsy: { label: "Epilepsy / Seizures", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: r === "lt1" || r === "1to2" || r === "2to3" ? "Graded" : "Review", transamerica: "Select", corebridge: "Level" } },
        kidney_disease: { label: "Kidney Disease / Failure", outcomes: { americo: "Decline", aetna: "Standard", americanAmicable: currentish ? "ROP / Decline if dialysis" : "Review", transamerica: "Decline", corebridge: "Graded" } },
        liver_disease: { label: "Liver Disease", outcomes: { americo: "Decline", aetna: "Standard", americanAmicable: currentish || r === "lt1" || r === "1to2" || r === "2to3" ? "Graded / Decline if liver failure" : "Review", transamerica: "Decline", corebridge: "Graded" } },
        lupus: { label: "Lupus", outcomes: { americo: "Select 1", aetna: "Standard", americanAmicable: currentish || r === "lt1" || r === "1to2" ? "ROP" : "Review", transamerica: "Select", corebridge: r === "lt1" || r === "1to2" || r === "2to3" || r === "3to4" ? "Graded" : "Review" } },
        mental_incapacity: { label: "Mental Incapacity", outcomes: { americo: "Select 2", aetna: "Standard", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" } },
        multiple_sclerosis: { label: "Multiple Sclerosis (MS)", outcomes: { americo: "Select 1", aetna: "Level", americanAmicable: r === "lt1" || r === "1to2" || r === "2to3" ? "Graded" : "Review", transamerica: "Select", corebridge: "Graded" } },
        parkinsons: { label: "Parkinson's Disease", outcomes: { americo: "Select 2", aetna: "Standard", americanAmicable: r === "lt1" || r === "1to2" || r === "2to3" ? "Graded" : "Review", transamerica: "Select", corebridge: "Graded" } },
        ptsd: { label: "PTSD", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
        schizophrenia: { label: "Schizophrenia", outcomes: { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" } },
        terminal_illness: { label: "Terminal Illness", outcomes: { americo: currentish ? "Decline" : "Review", aetna: "Decline", americanAmicable: currentish ? "Decline" : "Review", transamerica: currentish ? "Decline" : "Review", corebridge: "Decline" } },
        organ_transplant: { label: "Organ Transplant", outcomes: { americo: "Decline", aetna: "Decline", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" } },
        walker: { label: "Walker", outcomes: { americo: "Level", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" } },
      };
      return simple[entry.conditionKey] || { label: findConditionDef(entry.conditionKey)?.label || "Condition", outcomes: makeUnknownMap() };
    }
  }
}

function evaluateAll(entries) {
  const perCarrier = Object.fromEntries(CARRIERS.map((c) => [c.id, { status: "green", reasons: [] }]));
  entries.forEach((entry) => {
    const evaluated = evaluateEntry(entry);
    CARRIERS.forEach((carrier) => {
      const outcome = evaluated.outcomes[carrier.id] || "Review";
      perCarrier[carrier.id].reasons.push({ label: evaluated.label, outcome, status: outcomeStatus(outcome), notes: entry.notes });
    });
  });
  CARRIERS.forEach((carrier) => {
    const statuses = perCarrier[carrier.id].reasons.map((r) => r.status);
    perCarrier[carrier.id].status = statuses.length ? worstStatus(statuses) : "green";
  });
  return perCarrier;
}

function PillSelect({ value, onChange, options }) {
  return (
    <div className="pill-row">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`pill ${value === option ? "pill-active" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function EntryEditor({ entry, onUpdate, onRemove }) {
  const def = findConditionDef(entry.conditionKey);
  return (
    <div className="panel entry-card">
      <div className="entry-top">
        <div className="field">
          <label>Condition</label>
          <select value={entry.conditionKey} onChange={(e) => onUpdate({ conditionKey: e.target.value, medication: "Unknown", cause: "Unknown", recency: "unknown", current: false, hospitalization: "Unknown", notes: "" })}>
            {CONDITION_LIBRARY.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
          </select>
        </div>
        <button className="icon-btn" onClick={onRemove}>✕</button>
      </div>

      {def?.medicationOptions && (
        <div className="field">
          <label>Medication / device</label>
          <PillSelect value={entry.medication} onChange={(v) => onUpdate({ medication: v })} options={def.medicationOptions} />
        </div>
      )}

      {def?.causeOptions && (
        <div className="field">
          <label>Cause</label>
          <PillSelect value={entry.cause} onChange={(v) => onUpdate({ cause: v })} options={def.causeOptions} />
        </div>
      )}

      {def?.recency && (
        <div className="field">
          <label>Recency</label>
          <select value={entry.recency} onChange={(e) => onUpdate({ recency: e.target.value })}>
            {RECENCY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      )}

      {def?.currentToggle && (
        <div className="field">
          <label>Current status</label>
          <PillSelect value={entry.current ? "Current" : "Not current / unknown"} onChange={(v) => onUpdate({ current: v === "Current" })} options={["Current", "Not current / unknown"]} />
        </div>
      )}

      {def?.hospitalizationOptions && (
        <div className="field">
          <label>Hospitalizations</label>
          <PillSelect value={entry.hospitalization} onChange={(v) => onUpdate({ hospitalization: v })} options={def.hospitalizationOptions} />
        </div>
      )}

      <div className="field">
        <label>Optional notes</label>
        <input value={entry.notes} placeholder="Example: insulin started at 47, oxygen only at night" onChange={(e) => onUpdate({ notes: e.target.value })} />
      </div>
    </div>
  );
}

function CarrierCard({ carrier, data, smoker }) {
  const meta = STATUS_META[data.status];
  return (
    <div className={`panel carrier-card ${meta.card}`}>
      <div className="carrier-head">
        <h3>{carrier.name}</h3>
        <span className={`dot ${meta.dot}`}></span>
      </div>
      <span className={`badge ${meta.badge}`}>{meta.label}</span>
      <div className="smoker-line">Rate class: {smoker}</div>
      {data.reasons.length === 0 ? (
        <p className="empty-text">No conditions added yet.</p>
      ) : (
        <div className="reasons">
          {data.reasons.map((reason, idx) => (
            <div key={`${carrier.id}-${idx}`} className="reason-box">
              <div className="reason-title">{reason.label}</div>
              <div className="reason-outcome">{reason.outcome}</div>
              {reason.notes ? <div className="reason-note">Note: {reason.notes}</div> : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [smoker, setSmoker] = useState("Non-smoker");

  const filteredLibrary = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return CONDITION_LIBRARY;
    return CONDITION_LIBRARY.filter((item) => item.label.toLowerCase().includes(q));
  }, [search]);

  const results = useMemo(() => evaluateAll(entries), [entries]);

  const counts = useMemo(() => {
    const values = Object.values(results);
    return {
      green: values.filter((v) => v.status === "green").length,
      yellow: values.filter((v) => v.status === "yellow").length,
      red: values.filter((v) => v.status === "red").length,
    };
  }, [results]);

  const addEntry = (conditionKey) => setEntries((prev) => [...prev, defaultEntry(conditionKey)]);
  const updateEntry = (id, patch) => setEntries((prev) => prev.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)));
  const removeEntry = (id) => setEntries((prev) => prev.filter((entry) => entry.id !== id));
  const resetAll = () => { setEntries([]); setSearch(""); setSmoker("Non-smoker"); };

  return (
    <div className="app-shell">
      <div className="container">
        <div className="panel hero">
          <div className="hero-row">
            <div>
              <h1>Carrier Health Checker</h1>
              <p>Add conditions with structured details like medication, oxygen, recency, cause, smoking status, and current status.</p>
            </div>
            <button className="btn btn-outline" onClick={resetAll}>Reset</button>
          </div>

          <div className="field">
            <label>Smoking status</label>
            <PillSelect value={smoker} onChange={setSmoker} options={["Non-smoker", "Smoker"]} />
          </div>

          <div className="stat-grid">
            <div className="stat stat-green"><div>Approved</div><strong>{counts.green}</strong></div>
            <div className="stat stat-yellow"><div>Modified / Review</div><strong>{counts.yellow}</strong></div>
            <div className="stat stat-red"><div>Decline</div><strong>{counts.red}</strong></div>
          </div>

          <div className="two-col">
            <div>
              <div className="section-head">
                <label>Client conditions</label>
                <button className="btn" onClick={() => addEntry("diabetes")}>+ Add row</button>
              </div>
              <div className="stack">
                {entries.length === 0 ? <div className="empty-panel">No condition rows yet. Add one from the right or click “Add row”.</div> : null}
                {entries.map((entry) => (
                  <EntryEditor key={entry.id} entry={entry} onUpdate={(patch) => updateEntry(entry.id, patch)} onRemove={() => removeEntry(entry.id)} />
                ))}
              </div>
            </div>

            <div>
              <label>Quick add condition</label>
              <div className="search-box">
                <input placeholder="Search condition" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="panel quick-add">
                <div className="quick-list">
                  {filteredLibrary.map((item) => (
                    <button key={item.key} className="pill" onClick={() => addEntry(item.key)}>{item.label}</button>
                  ))}
                </div>
              </div>
              <div className="note-box">
                Green = immediate coverage. Yellow = modified, graded, ROP, GI, or review needed. Red = straight decline.
              </div>
            </div>
          </div>
        </div>

        <div className="carrier-grid">
          {CARRIERS.map((carrier) => (
            <CarrierCard key={carrier.id} carrier={carrier} data={results[carrier.id]} smoker={smoker} />
          ))}
        </div>
      </div>
    </div>
  );
}
