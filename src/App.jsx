import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, XCircle, RotateCcw, Search, Plus, Trash2 } from "lucide-react";

const CARRIERS = [
  { id: "americo", name: "Americo" },
  { id: "aetna", name: "Aetna Accendo" },
  { id: "americanAmicable", name: "American Amicable" },
  { id: "transamerica", name: "Transamerica" },
  { id: "corebridge", name: "Corebridge" },
];

const STATUS_META = {
  green: {
    label: "Immediate / Best",
    card: "border-emerald-300 bg-emerald-50 text-emerald-900",
    badge: "bg-emerald-600 text-white hover:bg-emerald-600",
    icon: CheckCircle2,
  },
  yellow: {
    label: "Modified / Conditional",
    card: "border-amber-300 bg-amber-50 text-amber-900",
    badge: "bg-amber-500 text-white hover:bg-amber-500",
    icon: AlertTriangle,
  },
  red: {
    label: "Decline",
    card: "border-red-300 bg-red-50 text-red-900",
    badge: "bg-red-600 text-white hover:bg-red-600",
    icon: XCircle,
  },
};

const CONDITION_LIBRARY = [
  { key: "diabetes", label: "Diabetes", medicationOptions: ["Unknown", "Metformin / oral meds", "Insulin"] },
  { key: "neuropathy", label: "Neuropathy", causeOptions: ["Unknown", "Due to diabetes", "Not due to diabetes"] },
  { key: "copd", label: "COPD", medicationOptions: ["Unknown", "Inhaler", "Oxygen"] },
  { key: "sleep_apnea", label: "Sleep Apnea", medicationOptions: ["Unknown", "CPAP only", "Oxygen"] },
  { key: "cancer", label: "Cancer", cancerTypeOptions: ["Unknown", "Basal cell", "Squamous cell", "Bladder", "Breast", "Prostate", "Skin", "Melanoma", "Metastatic", "Recurring", "Other serious cancer"] },
  { key: "heart_attack", label: "Heart Attack" },
  { key: "heart_surgery", label: "Heart Surgery" },
  { key: "heart_valve", label: "Heart Valve Replacement" },
  { key: "stroke", label: "Stroke / TIA" },
  { key: "stent", label: "Stent" },
  { key: "angina", label: "Angina / Chest Pain" },
  { key: "aneurysm", label: "Aneurysm" },
  { key: "dui", label: "DUI" },
  { key: "felony", label: "Felony" },
  { key: "hepatitis_a", label: "Hepatitis A" },
  { key: "hepatitis_b", label: "Hepatitis B" },
  { key: "hepatitis_c", label: "Hepatitis C" },
  { key: "illegal_drugs", label: "Illegal Drugs" },
  { key: "jail", label: "Jail / Incarcerated" },
  { key: "parole_probation", label: "Parole / Probation" },
  { key: "oxygen", label: "Oxygen Use" },
  { key: "walker", label: "Walker" },
  { key: "wheelchair", label: "Wheelchair / Scooter / Cart", causeOptions: ["Unknown", "Due to illness/disease", "Not due to illness/disease"] },
  { key: "afib", label: "AFIB / Irregular Heartbeat" },
  { key: "alcohol_drug_abuse", label: "Alcohol / Drug Abuse" },
  { key: "alzheimers", label: "Alzheimer's / Dementia / Memory Loss" },
  { key: "amputation", label: "Amputation", causeOptions: ["Unknown", "Due to disease/diabetes", "Not due to disease"] },
  { key: "arthritis", label: "Arthritis" },
  { key: "assisted_living", label: "Assisted Living / Long Term Care" },
  { key: "asthma", label: "Asthma (Chronic)" },
  { key: "bipolar", label: "Bipolar" },
  { key: "bronchitis", label: "Bronchitis (Chronic)" },
  { key: "cirrhosis", label: "Cirrhosis" },
  { key: "chf", label: "Congestive Heart Failure / Heart Failure" },
  { key: "crohns", label: "Crohn's Disease" },
  { key: "cystic_fibrosis", label: "Cystic Fibrosis" },
  { key: "depression", label: "Depression" },
  { key: "dialysis", label: "Dialysis" },
  { key: "emphysema", label: "Emphysema", hospitalizationOptions: ["Unknown", "No", "More than one in past 24 months"] },
  { key: "epilepsy", label: "Epilepsy / Seizures" },
  { key: "kidney_disease", label: "Kidney Disease / Failure" },
  { key: "liver_disease", label: "Liver Disease" },
  { key: "lupus", label: "Lupus" },
  { key: "mental_incapacity", label: "Mental Incapacity" },
  { key: "multiple_sclerosis", label: "Multiple Sclerosis (MS)" },
  { key: "parkinsons", label: "Parkinson's Disease" },
  { key: "ptsd", label: "PTSD" },
  { key: "schizophrenia", label: "Schizophrenia" },
  { key: "terminal_illness", label: "Terminal Illness" },
  { key: "organ_transplant", label: "Organ Transplant" },
];

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function defaultEntry(conditionKey = "diabetes") {
  return {
    id: uid(),
    conditionKey,
    medication: "Unknown",
    cause: "Unknown",
    cancerType: "Unknown",
    hospitalization: "Unknown",
    notes: "",
  };
}

function findConditionDef(key) {
  return CONDITION_LIBRARY.find((c) => c.key === key);
}

function getCarrierRules(entry) {
  switch (entry.conditionKey) {
    case "diabetes":
      if (entry.medication === "Metformin / oral meds") {
        return {
          americo: "Select 1",
          aetna: "Preferred",
          americanAmicable: "Immediate",
          transamerica: "Select",
          corebridge: "Level",
        };
      }
      if (entry.medication === "Insulin") {
        return {
          americo: "No insulin use for Select 1",
          aetna: "Preferred",
          americanAmicable: "Insulin prior to age 50: ROP; otherwise: Immediate",
          transamerica: "Select",
          corebridge: "Level",
        };
      }
      return {
        americo: "Select 1",
        aetna: "Preferred",
        americanAmicable: "Insulin prior to age 50: ROP; otherwise: Immediate",
        transamerica: "Select",
        corebridge: "Level",
      };

    case "neuropathy":
      if (entry.cause === "Due to diabetes") {
        return {
          americo: "Select 2",
          aetna: "Modified",
          americanAmicable: "Due to diabetes prior to age 50: ROP",
          transamerica: "Select",
          corebridge: "Level",
        };
      }
      return {
        americo: "Select 2",
        aetna: "Not due to diabetes: Immediate",
        americanAmicable: "Not due to diabetes: Immediate",
        transamerica: "Select",
        corebridge: "Level",
      };

    case "copd":
      if (entry.medication === "Inhaler") {
        return {
          americo: "Select 2",
          aetna: "Standard",
          americanAmicable: "Treated within 2 yrs: ROP; within 3 years: Graded; > 3 yrs: Immediate",
          transamerica: "Select",
          corebridge: "Inhaler: Level",
        };
      }
      if (entry.medication === "Oxygen") {
        return {
          americo: "Decline",
          aetna: "Within 1 year: Decline",
          americanAmicable: "Decline",
          transamerica: "Within 12 months: Graded",
          corebridge: "Graded",
        };
      }
      return {
        americo: "Select 2",
        aetna: "Standard",
        americanAmicable: "Treated within 2 yrs: ROP; within 3 years: Graded; > 3 yrs: Immediate",
        transamerica: "Select",
        corebridge: "Inhaler: Level; Oxygen: Graded",
      };

    case "sleep_apnea":
      if (entry.medication === "Oxygen") {
        return {
          americo: "Decline",
          aetna: "See Oxygen Use",
          americanAmicable: "See Oxygen Use",
          transamerica: "See Oxygen Use",
          corebridge: "See Oxygen Use",
        };
      }
      return {
        americo: "Select 1",
        aetna: "Preferred",
        americanAmicable: "See Oxygen Use",
        transamerica: "Select",
        corebridge: "Level",
      };

    case "cancer": {
      const t = entry.cancerType;
      const basalLike = t === "Basal cell" || t === "Squamous cell";
      const coreLevel = ["Bladder", "Breast", "Prostate", "Skin"].includes(t);
      return {
        americo: basalLike ? "Approved" : "Metastatic / Recurrent: Decline; within 2 yrs: Guaranteed Issue; > 2 years: allowed",
        aetna: basalLike ? "Preferred" : "Current or treated within 2 years or recurring: Decline; > 2 yrs: Preferred",
        americanAmicable: "Current: Decline; within 2 yrs: ROP; within 3 years: Graded",
        transamerica: "Never treated: Decline; last treatment within 2 years: Decline; last treatment 2–4 years ago: Graded",
        corebridge: coreLevel ? "Level" : "Any serious cancer must be cancer free 2 years for Level",
      };
    }

    case "heart_attack":
      return {
        americo: "Within 2 yr: Select 2",
        aetna: "Within 1 year: Modified; between 1–2 years: Standard; > 2 yrs: Preferred",
        americanAmicable: "Within 2 yrs: ROP; within 3 yrs: Graded",
        transamerica: "Select",
        corebridge: "Within last 24 months: Decline",
      };

    case "heart_surgery":
      return {
        americo: "Within 1 yr: Select 2",
        aetna: "Within 1 year: Modified; between 1–2 years: Standard; > 2 yrs: Preferred",
        americanAmicable: "Within 2 yrs: ROP; within 3 yrs: Graded",
        transamerica: "Select",
        corebridge: "Within last 24 months: Decline",
      };

    case "heart_valve":
      return {
        americo: "Within 1 yr: Select 2",
        aetna: "Within 1 year: Modified; between 1–2 years: Standard; > 2 yrs: Preferred",
        americanAmicable: "Within 2 yrs: ROP; within 3 yrs: Graded",
        transamerica: "Select",
        corebridge: "Graded",
      };

    case "stroke":
      return {
        americo: "Select 2",
        aetna: "Within 1 year: Modified; between 1–2 years: Standard; > 2 yrs: Preferred",
        americanAmicable: "Stroke or TIA within 2 yrs: ROP; stroke within 3 years: Graded",
        transamerica: "Select",
        corebridge: "Within last 12 months: Decline",
      };

    case "stent":
      return {
        americo: "Within 1 yr: Select 2",
        aetna: "Preferred",
        americanAmicable: "Within 2 yrs: ROP; within 3 yrs: Graded",
        transamerica: "Select",
        corebridge: "Within last 24 months: Graded",
      };

    case "angina":
      return {
        americo: "Select 1",
        aetna: "Treated within 1 year: Modified; between 1–2 years: Standard; > 2 yrs: Preferred",
        americanAmicable: "Within 2 yrs: ROP",
        transamerica: "Select",
        corebridge: "Level without Tobacco",
      };

    case "aneurysm":
      return {
        americo: "Select 1",
        aetna: "Within 1 Year: Modified",
        americanAmicable: "Within 2 years: ROP",
        transamerica: "Select",
        corebridge: "Level",
      };

    case "dui":
      return {
        americo: "Select 1",
        aetna: "Within 2 years: Modified",
        americanAmicable: "Level",
        transamerica: "Select",
        corebridge: "Last 24 months: Decline",
      };

    case "felony":
      return {
        americo: "Within 6 months: Decline",
        aetna: "Preferred",
        americanAmicable: "Level",
        transamerica: "Within 2 years: Decline",
        corebridge: "Within last 24 months: Decline",
      };

    case "hepatitis_a":
      return {
        americo: "Select 1",
        aetna: "Within 2 years: Modified",
        americanAmicable: "Chronic or treated within 2 yrs: ROP",
        transamerica: "Select",
        corebridge: "Level",
      };

    case "hepatitis_b":
      return {
        americo: "Select 2",
        aetna: "Within 2 years: Modified",
        americanAmicable: "Chronic or treated within 2 yrs: ROP",
        transamerica: "Select",
        corebridge: "Graded",
      };

    case "hepatitis_c":
      return {
        americo: "Decline",
        aetna: "Within 2 years: Modified",
        americanAmicable: "Chronic or treated within 2 yrs: ROP; within 3 yrs: Graded",
        transamerica: "Select",
        corebridge: "Graded",
      };

    case "illegal_drugs":
      return {
        americo: "Within 2 yrs: Decline",
        aetna: "Treatment within the past 2 years: Modified",
        americanAmicable: "Used within 2 years: ROP",
        transamerica: "Graded",
        corebridge: "Graded",
      };

    case "jail":
      return {
        americo: "Decline",
        aetna: "Preferred",
        americanAmicable: "Decline",
        transamerica: "Current: Decline",
        corebridge: "Decline",
      };

    case "parole_probation":
      return {
        americo: "Select 2",
        aetna: "Preferred",
        americanAmicable: "Level",
        transamerica: "Decline",
        corebridge: "Level",
      };

    case "oxygen":
      return {
        americo: "Decline",
        aetna: "Within 1 year: Decline",
        americanAmicable: "Decline",
        transamerica: "Within 12 months: Graded",
        corebridge: "Graded",
      };

    case "wheelchair":
      return {
        americo: "Decline",
        aetna: "Use wheelchair or scooter: Decline",
        americanAmicable: "Due to illness or disease: Decline",
        transamerica: "Within 12 months: Graded",
        corebridge: "Graded",
      };

    case "afib":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    case "alcohol_drug_abuse":
      return { americo: "Select 2", aetna: "Treatment within the past 2 years: Modified", americanAmicable: "Treated within 2 years: ROP", transamerica: "Within 2 years: Decline", corebridge: "Graded" };
    case "alzheimers":
      return { americo: "Select 2", aetna: "Decline", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" };
    case "amputation":
      return { americo: "Select 2", aetna: "Modified; Due to disease or diabetes: Decline", americanAmicable: "Caused by disease: Decline", transamerica: "Decline", corebridge: "Graded" };
    case "arthritis":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    case "assisted_living":
      return { americo: "Select 1", aetna: "Decline", americanAmicable: "Decline", transamerica: "Current: Decline", corebridge: "Decline" };
    case "asthma":
      return { americo: "Select 1", aetna: "Standard", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" };
    case "bipolar":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" };
    case "bronchitis":
      return { americo: "Select 2", aetna: "Standard", americanAmicable: "Treated within 2 yrs: ROP; within 3 years: Graded", transamerica: "Select", corebridge: "Level" };
    case "cirrhosis":
      return { americo: "Decline", aetna: "Treated within 2 years: Modified", americanAmicable: "Treated within 2 yrs: ROP; within 3 years: Graded", transamerica: "Graded", corebridge: "Decline" };
    case "chf":
      return { americo: "Select 2", aetna: "Decline", americanAmicable: "Decline", transamerica: "Select", corebridge: "Decline" };
    case "crohns":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    case "cystic_fibrosis":
      return { americo: "Select 2", aetna: "Decline", americanAmicable: "Level", transamerica: "Decline", corebridge: "Level" };
    case "depression":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    case "dialysis":
      return { americo: "Decline", aetna: "Within 1 year: Decline", americanAmicable: "Decline", transamerica: "Within 12 months: Graded", corebridge: "Decline" };
    case "emphysema":
      return { americo: "Select 2", aetna: "Standard", americanAmicable: "Treated within 2 yrs: ROP; within 3 yrs: Graded", transamerica: "Select", corebridge: "Hospitalized more than once in the past 24 months: Decline" };
    case "epilepsy":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Within 3 years: Graded", transamerica: "Select", corebridge: "Level" };
    case "kidney_disease":
      return { americo: "Decline", aetna: "Standard", americanAmicable: "Dialysis: Decline; Failure or Disease: ROP", transamerica: "Decline", corebridge: "Graded" };
    case "liver_disease":
      return { americo: "Decline", aetna: "Standard", americanAmicable: "Liver failure: Decline; Liver disease within 3 yrs: Graded", transamerica: "Decline", corebridge: "Graded" };
    case "lupus":
      return { americo: "Select 1", aetna: "Standard", americanAmicable: "Treated / Diagnosed within 2 yrs: ROP", transamerica: "Select", corebridge: "Within Last 48 Months: Graded" };
    case "mental_incapacity":
      return { americo: "Select 2", aetna: "Standard", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" };
    case "multiple_sclerosis":
      return { americo: "Select 1", aetna: "Level", americanAmicable: "Diagnosed / treated within 3 yrs: Graded", transamerica: "Select", corebridge: "Graded" };
    case "parkinsons":
      return { americo: "Select 2", aetna: "Standard", americanAmicable: "Treated / diagnosed within 3 yrs: Graded", transamerica: "Select", corebridge: "Graded" };
    case "ptsd":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    case "schizophrenia":
      return { americo: "Select 1", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Graded" };
    case "terminal_illness":
      return { americo: "Death in the next 12 months: Decline", aetna: "Decline", americanAmicable: "Death in the next 12 months: Decline", transamerica: "Death in the next 12 months: Decline", corebridge: "Decline" };
    case "organ_transplant":
      return { americo: "Decline", aetna: "Decline", americanAmicable: "Decline", transamerica: "Decline", corebridge: "Decline" };
    case "walker":
      return { americo: "Level", aetna: "Preferred", americanAmicable: "Level", transamerica: "Select", corebridge: "Level" };
    default:
      return { americo: "Check sheet", aetna: "Check sheet", americanAmicable: "Check sheet", transamerica: "Check sheet", corebridge: "Check sheet" };
  }
}

function ruleToStatus(text) {
  const v = String(text || "").toLowerCase();
  if (v.includes("decline")) return "red";
  if (v.includes("graded") || v.includes("modified") || v.includes("rop") || v.includes("gi") || v.includes("guaranteed issue") || v.includes("conditional")) return "yellow";
  return "green";
}

function evaluateAll(entries) {
  const perCarrier = Object.fromEntries(CARRIERS.map((c) => [c.id, { status: "green", rules: [] }]));

  entries.forEach((entry) => {
    const conditionLabel = findConditionDef(entry.conditionKey)?.label || "Condition";
    const ruleMap = getCarrierRules(entry);

    CARRIERS.forEach((carrier) => {
      const ruleText = ruleMap[carrier.id] || "Check sheet";
      perCarrier[carrier.id].rules.push({
        condition: conditionLabel,
        text: ruleText,
        notes: entry.notes,
        status: ruleToStatus(ruleText),
      });
    });
  });

  CARRIERS.forEach((carrier) => {
    const statuses = perCarrier[carrier.id].rules.map((r) => r.status);
    if (statuses.includes("red")) perCarrier[carrier.id].status = "red";
    else if (statuses.includes("yellow")) perCarrier[carrier.id].status = "yellow";
    else perCarrier[carrier.id].status = "green";
  });

  return perCarrier;
}

function PillSelect({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`rounded-full border px-3 py-1.5 text-sm ${value === option ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-700"}`}
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
    <Card className="rounded-2xl border shadow-none">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-full max-w-sm">
            <label className="text-xs font-medium text-slate-500">Condition</label>
            <select
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
              value={entry.conditionKey}
              onChange={(e) => onUpdate({ conditionKey: e.target.value, medication: "Unknown", cause: "Unknown", cancerType: "Unknown", hospitalization: "Unknown", notes: "" })}
            >
              {CONDITION_LIBRARY.map((item) => (
                <option key={item.key} value={item.key}>{item.label}</option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {def?.medicationOptions && (
          <div>
            <label className="text-xs font-medium text-slate-500">Medication / device</label>
            <div className="mt-2">
              <PillSelect value={entry.medication} onChange={(v) => onUpdate({ medication: v })} options={def.medicationOptions} />
            </div>
          </div>
        )}

        {def?.causeOptions && (
          <div>
            <label className="text-xs font-medium text-slate-500">Cause</label>
            <div className="mt-2">
              <PillSelect value={entry.cause} onChange={(v) => onUpdate({ cause: v })} options={def.causeOptions} />
            </div>
          </div>
        )}

        {def?.hospitalizationOptions && (
          <div>
            <label className="text-xs font-medium text-slate-500">Hospitalizations</label>
            <div className="mt-2">
              <PillSelect value={entry.hospitalization} onChange={(v) => onUpdate({ hospitalization: v })} options={def.hospitalizationOptions} />
            </div>
          </div>
        )}

        {def?.cancerTypeOptions && (
          <div>
            <label className="text-xs font-medium text-slate-500">Cancer type</label>
            <div className="mt-2">
              <PillSelect value={entry.cancerType} onChange={(v) => onUpdate({ cancerType: v })} options={def.cancerTypeOptions} />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-slate-500">Optional notes</label>
          <Input className="mt-1 rounded-xl" value={entry.notes} placeholder="Optional call notes" onChange={(e) => onUpdate({ notes: e.target.value })} />
        </div>
      </CardContent>
    </Card>
  );
}

function CarrierCard({ carrier, data }) {
  const meta = STATUS_META[data.status];
  const Icon = meta.icon;

  return (
    <Card className={`rounded-2xl border-2 shadow-sm ${meta.card}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-lg">{carrier.name}</CardTitle>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Badge className={meta.badge}>{meta.label}</Badge>
        {data.rules.length === 0 ? (
          <p className="text-sm">No conditions added yet.</p>
        ) : (
          <div className="space-y-2">
            {data.rules.map((rule, idx) => (
              <div key={`${carrier.id}-${idx}`} className="rounded-xl border border-black/5 bg-white/70 p-3">
                <p className="text-sm font-semibold">{rule.condition}</p>
                <p className="text-sm opacity-90">{rule.text}</p>
                {rule.notes ? <p className="mt-1 text-xs opacity-70">Note: {rule.notes}</p> : null}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CarrierStructuredChecker() {
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
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Carrier Health Checker</h1>
                <p className="text-sm text-slate-500 mt-1">Made by an agent, for agents</p>
                <p className="mt-2 text-slate-600">Same layout, now rule-based. The tool shows the sheet language per carrier instead of trying to decide for you.</p>
                <div className="mt-4">
                  <label className="text-sm font-medium">Smoking status</label>
                  <div className="mt-2 flex gap-2">
                    {["Non-smoker", "Smoker"].map((opt) => (
                      <button key={opt} onClick={() => setSmoker(opt)} className={`rounded-full border px-4 py-2 text-sm ${smoker === opt ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white"}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="rounded-2xl" onClick={resetAll}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4"><p className="text-sm text-slate-600">Immediate / Best</p><p className="text-2xl font-bold">{counts.green}</p></div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><p className="text-sm text-slate-600">Modified / Conditional</p><p className="text-2xl font-bold">{counts.yellow}</p></div>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4"><p className="text-sm text-slate-600">Decline</p><p className="text-2xl font-bold">{counts.red}</p></div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Client conditions</label>
                  <Button className="rounded-2xl" onClick={() => addEntry("diabetes")}>
                    <Plus className="mr-2 h-4 w-4" /> Add row
                  </Button>
                </div>
                <div className="space-y-3">
                  {entries.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-white p-6 text-sm text-slate-500">No condition rows yet. Use Add row or Quick add condition.</div>
                  ) : (
                    entries.map((entry) => (
                      <EntryEditor key={entry.id} entry={entry} onUpdate={(patch) => updateEntry(entry.id, patch)} onRemove={() => removeEntry(entry.id)} />
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Quick add condition</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input className="rounded-2xl pl-9" placeholder="Search condition" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="max-h-[620px] overflow-auto rounded-2xl border bg-white p-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredLibrary.map((item) => (
                      <Button key={item.key} variant="outline" size="sm" className="rounded-full" onClick={() => addEntry(item.key)}>
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-600">Cards stay color-coded for quick scanning, but each carrier now shows the actual sheet wording instead of “review.” Smoking status is tracked for setup and does not change approval colors yet.</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {CARRIERS.map((carrier) => (
            <CarrierCard key={carrier.id} carrier={carrier} data={results[carrier.id]} />
          ))}
        </div>
      </div>
    </div>
  );
}
