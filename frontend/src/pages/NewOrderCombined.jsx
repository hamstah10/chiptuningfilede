import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../components/ui/select';
import {
  Upload, FileArrowUp, CarProfile, Lightning, Fire, Leaf, Gear, Sliders,
  Engine, Drop, Fan, Gauge, Warning, Power, RocketLaunch, Prohibit, Thermometer,
  CheckCircle, ArrowLeft, ArrowRight, Car, GasPump, Tag, Calendar, Cpu,
  PaperPlaneTilt, CreditCard, Pencil, X as XIcon,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ── Vehicle & ECU Database (identical to FileWizard) ──────────────────────
const vehicleData = {
  'Audi': {
    'A1': { '8X - 2010': ['1.0 TFSI - 95 PS', '1.4 TFSI - 125 PS', '1.4 TDI - 90 PS', '1.6 TDI - 105 PS', '1.8 TFSI - 192 PS', '2.0 TDI - 143 PS'], 'GB - 2018': ['1.0 TFSI - 116 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 116 PS', '2.0 TFSI - 207 PS'] },
    'A3': { '8P - 2003': ['1.6 TDI - 105 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.2 V6 - 250 PS'], '8V - 2012': ['1.0 TFSI - 116 PS', '1.4 TFSI - 125 PS', '1.4 TFSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 310 PS (RS3)'], '8Y - 2020': ['1.0 TFSI - 110 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TFSI - 310 PS (RS3)', '2.5 TFSI - 400 PS (RS3)'] },
    'A4': { 'B7 - 2004': ['1.8 T - 163 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.0 TDI - 204 PS', '4.2 FSI - 344 PS (RS4)'], 'B8 - 2008': ['1.8 TFSI - 120 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 143 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 245 PS', '3.2 FSI - 265 PS'], 'B9 - 2015': ['1.4 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 218 PS', '3.0 TDI - 272 PS', '2.9 TFSI - 450 PS (RS4)'] },
    'A6': { 'C7 - 2011': ['2.0 TDI - 177 PS', '3.0 TDI - 204 PS', '3.0 TDI - 272 PS', '3.0 TFSI - 310 PS', '4.0 TFSI - 560 PS (RS6)'], 'C8 - 2018': ['2.0 TDI - 163 PS', '2.0 TDI - 204 PS', '3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '3.0 TFSI - 340 PS', '4.0 TFSI - 600 PS (RS6)'] },
    'Q5': { 'FY - 2017': ['2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 286 PS', '2.9 TFSI - 381 PS (SQ5)'] },
  },
  'BMW': {
    '1er': { 'F20 - 2011': ['116d - 116 PS', '118d - 150 PS', '120d - 190 PS', '125d - 218 PS', 'M135i - 326 PS'], 'F40 - 2019': ['118d - 150 PS', '120d - 190 PS', 'M135i - 306 PS'] },
    '3er': { 'F30 - 2012': ['318d - 150 PS', '320d - 190 PS', '330d - 258 PS', '335d - 313 PS', '335i - 306 PS', '340i - 326 PS'], 'G20 - 2019': ['318d - 150 PS', '320d - 190 PS', '330d - 286 PS', '330i - 258 PS', 'M340i - 374 PS', 'M3 Competition - 510 PS'] },
    '5er': { 'G30 - 2017': ['520d - 190 PS', '530d - 286 PS', '540d - 320 PS', '530i - 252 PS', '540i - 340 PS', 'M5 - 600 PS'] },
    'X3': { 'G01 - 2017': ['xDrive20d - 190 PS', 'xDrive30d - 265 PS', 'M40i - 360 PS', 'M Competition - 510 PS'] },
    'X5': { 'G05 - 2018': ['xDrive30d - 265 PS', 'xDrive40d - 340 PS', 'M50d - 400 PS', 'M50i - 530 PS', 'M Competition - 625 PS'] },
  },
  'VW': {
    'Golf': { 'Golf 7 - 2012': ['1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI GTI - 230 PS', '2.0 TSI R - 310 PS'], 'Golf 8 - 2019': ['1.5 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TSI GTI - 245 PS', '2.0 TSI R - 320 PS'] },
    'Passat': { 'B8 - 2014': ['1.4 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TDI - 240 PS (Bi-TDI)', '2.0 TSI - 272 PS'] },
    'Tiguan': { 'AD - 2016': ['1.4 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TSI - 230 PS', '2.0 TSI R - 320 PS'] },
    'Touareg': { 'CR - 2018': ['3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '3.0 TSI - 340 PS'] },
  },
  'Mercedes': {
    'C-Klasse': { 'W205 - 2014': ['C200d - 160 PS', 'C220d - 170 PS', 'C300d - 245 PS', 'C200 - 184 PS', 'C300 - 245 PS', 'C43 AMG - 390 PS', 'C63 S AMG - 510 PS'] },
    'E-Klasse': { 'W213 - 2016': ['E220d - 194 PS', 'E300d - 245 PS', 'E400d - 340 PS', 'E300 - 245 PS', 'E53 AMG - 435 PS', 'E63 S AMG - 612 PS'] },
    'GLC': { 'X253 - 2015': ['GLC 220d - 170 PS', 'GLC 300d - 245 PS', 'GLC 300 - 245 PS', 'GLC 43 AMG - 367 PS', 'GLC 63 S AMG - 510 PS'] },
  },
  'Seat': { 'Leon': { '5F - 2012': ['1.4 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TSI Cupra - 290 PS'] } },
  'Skoda': { 'Octavia': { '5E - 2012': ['1.4 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TSI RS - 245 PS'], 'NX - 2020': ['1.5 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TSI RS - 245 PS'] } },
  'Ford': { 'Focus': { 'MK4 - 2018': ['1.0 EcoBoost - 155 PS', '1.5 EcoBoost - 182 PS', '2.0 EcoBlue - 150 PS', '2.3 EcoBoost ST - 280 PS'] } },
  'Porsche': { '911': { '992 - 2019': ['Carrera 3.0T - 385 PS', 'Carrera S 3.0T - 450 PS', 'Turbo 3.7T - 580 PS', 'Turbo S 3.7T - 650 PS'] }, 'Cayenne': { 'E3 - 2017': ['3.0 V6 - 340 PS', 'S 2.9 V6 - 440 PS', 'Turbo 4.0 V8 - 550 PS'] } },
};
const allManufacturers = Object.keys(vehicleData).sort();
const ecuData = {
  'Audi': { 'TDI': ['Bosch EDC17CP14', 'Bosch EDC17CP44'], 'TSI': ['Bosch MED17.5', 'Continental Simos 18.1'], 'TFSI': ['Bosch MED17.1', 'Bosch MG1CS002'], 'default': ['Bosch EDC17CP14', 'Bosch MED17.1'] },
  'BMW': { 'd': ['Bosch EDC17C50', 'Bosch EDC17CP45'], 'i': ['Bosch MEVD17.2', 'Bosch MG1CS003'], 'M': ['Bosch MEVD17.2', 'Bosch MG1CS201'], 'default': ['Bosch EDC17C50', 'Bosch MEVD17.2'] },
  'VW': { 'TDI': ['Bosch EDC17CP14', 'Bosch MD1CP004'], 'TSI': ['Bosch MED17.5', 'Continental Simos 18.1'], 'default': ['Bosch EDC17CP14', 'Continental Simos 18.1'] },
  'Mercedes': { 'CDI': ['Bosch EDC17CP46', 'Bosch MD1CP001'], 'd': ['Bosch EDC17CP46'], 'AMG': ['Bosch MED17.7.2', 'Bosch MG1CP002'], 'default': ['Bosch EDC17CP46', 'Bosch MED17.7.2'] },
  'Seat': { 'TDI': ['Bosch EDC17CP14'], 'TSI': ['Continental Simos 18.1'], 'default': ['Bosch EDC17CP14'] },
  'Skoda': { 'TDI': ['Bosch EDC17CP14'], 'TSI': ['Continental Simos 18.1'], 'default': ['Bosch EDC17CP14'] },
  'Ford': { 'EcoBoost': ['Bosch MED17.0'], 'EcoBlue': ['Bosch MD1CS005'], 'default': ['Bosch EDC17C10'] },
  'Porsche': { 'default': ['Bosch MED17.1.1', 'Bosch MG1CP007'] },
};
function getEcuOptions(mfr, eng) {
  if (!mfr || !ecuData[mfr]) return [];
  const d = ecuData[mfr]; const el = (eng || '').toLowerCase();
  for (const k of Object.keys(d).filter(k => k !== 'default')) { if (el.includes(k.toLowerCase())) return d[k]; }
  return d['default'] || [];
}

// ── Performance calculator ────────────────────────────────────────────────
function getPerfData(engine) {
  if (!engine) return null;
  const m = engine.match(/(\d{2,4})\s*PS/); if (!m) return null;
  const oPs = parseInt(m[1]);
  const diesel = /TDI|CDI|CDTI|HDI|EcoBlue|TDCi|d\b/i.test(engine);
  const oNm = Math.round(oPs * (diesel ? 2.0 : 1.35));
  const s1Ps = Math.round(oPs * (1 + (diesel ? 0.25 : 0.22)));
  const s1Nm = Math.round(oNm * (1 + (diesel ? 0.30 : 0.25)));
  const s2Ps = Math.round(oPs * (1 + (diesel ? 0.40 : 0.35)));
  const s2Nm = Math.round(oNm * (1 + (diesel ? 0.45 : 0.38)));
  const maxR = diesel ? 5200 : 7200, ppR = diesel ? 3800 : 5800, pnR = diesel ? 2000 : 3500;
  const c = (r, pk, pr, rs) => { const x = r / pr; return x <= 1 ? pk * (1 - Math.pow(1 - x, rs)) : pk * (1 - 0.25 * Math.pow((r - pr) / (maxR - pr), 1.5)); };
  const curve = []; for (let i = 0; i <= 20; i++) { const r = Math.round(800 + (maxR - 800) * (i / 20)); curve.push({ rpm: r, rpmLabel: r >= 1000 ? `${(r / 1000).toFixed(1)}k` : String(r), seriePs: Math.round(c(r, oPs, ppR, 1.8)), stage1Ps: Math.round(c(r, s1Ps, ppR * 0.97, 1.8)), stage2Ps: Math.round(c(r, s2Ps, ppR * 0.95, 1.8)), serieNm: Math.round(c(r, oNm, pnR, 2.2)), stage1Nm: Math.round(c(r, s1Nm, pnR * 0.95, 2.2)), stage2Nm: Math.round(c(r, s2Nm, pnR * 0.92, 2.2)) }); }
  return { originalPs: oPs, originalNm: oNm, stage1Ps: s1Ps, stage1Nm: s1Nm, stage2Ps: s2Ps, stage2Nm: s2Nm, diesel, curveData: curve, psGainS1: s1Ps - oPs, psGainS2: s2Ps - oPs, nmGainS1: s1Nm - oNm, nmGainS2: s2Nm - oNm };
}

// ── Constants ─────────────────────────────────────────────────────────────
const readingDevices = [
  { group: 'Autotuner', logo: '/logos/autotuner.png', options: ['Tool'] },
  { group: 'Alientech', logo: '/logos/alientech.png', options: ['Kess3'] },
  { group: 'Magic Motorsport', logo: '/logos/magicmotorsport.png', options: ['Flex'] },
  { group: null, logo: '/logos/autoflasher.png', options: ['Autoflasher'] },
  { group: null, logo: null, options: ['CMD Flash'] },
  { group: 'Dimsport', logo: '/logos/dimsport.png', options: ['NewGenius'] },
];
const tuningStages = [
  { id: 'stage1', name: { de: 'Stage 1', en: 'Stage 1' }, credits: 100, Icon: Lightning, gradient: 'from-[#8B2635]/20 to-transparent', iconColor: 'text-primary', border: 'border-primary/40', desc: { de: 'Optimierte Kennfelder', en: 'Optimized maps' } },
  { id: 'stage2', name: { de: 'Stage 2', en: 'Stage 2' }, credits: 150, Icon: Fire, gradient: 'from-orange-500/15 to-transparent', iconColor: 'text-orange-500', border: 'border-orange-500/40', desc: { de: 'Maximale Performance', en: 'Maximum performance' } },
  { id: 'eco', name: { de: 'Eco', en: 'Eco' }, credits: 100, Icon: Leaf, gradient: 'from-green-500/15 to-transparent', iconColor: 'text-green-500', border: 'border-green-500/40', desc: { de: 'Verbrauch optimiert', en: 'Fuel optimized' } },
  { id: 'gearbox', name: { de: 'Getriebe', en: 'Gearbox' }, credits: 0, Icon: Gear, gradient: 'from-blue-500/15 to-transparent', iconColor: 'text-blue-500', border: 'border-blue-500/40', desc: { de: 'Schaltoptimierung', en: 'Shift optimization' } },
  { id: 'optionsOnly', name: { de: 'Nur Optionen', en: 'Options Only' }, credits: 0, Icon: Sliders, gradient: 'from-white/5 to-transparent', iconColor: 'text-muted-foreground', border: 'border-border', desc: { de: 'Einzelne Optionen', en: 'Individual options' } },
];
const gearboxStages = [
  { id: 'gearbox_stage1', name: { de: 'Stage 1', en: 'Stage 1' }, credits: 120 },
  { id: 'gearbox_stage2', name: { de: 'Stage 2', en: 'Stage 2' }, credits: 160 },
  { id: 'gearbox_stage3', name: { de: 'Stage 3', en: 'Stage 3' }, credits: 200 },
];
const gearboxMfrs = ['VW', 'Audi', 'Seat', 'Cupra', 'Skoda', 'BMW'];
const tuningOptions = [
  { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 0, included: true, Icon: Drop, desc: { de: 'Partikelfilter', en: 'Particle Filter' } },
  { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 0, included: true, Icon: Fan, desc: { de: 'AGR Ventil', en: 'EGR Valve' } },
  { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 0, included: true, Icon: Drop, desc: { de: 'SCR System', en: 'SCR System' } },
  { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 0, included: true, Icon: Gauge, desc: { de: 'Geschwindigkeit', en: 'Speed Limiter' } },
  { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 25, included: false, Icon: Warning, desc: { de: 'Fehlercode', en: 'Error Code' } },
  { id: 'startstop', name: { de: 'Start-Stop-Off', en: 'Start-Stop-Off' }, credits: 20, included: false, Icon: Power, desc: { de: 'Start-Stop', en: 'Start-Stop' } },
  { id: 'pops', name: { de: 'Pops & Bangs', en: 'Pops & Bangs' }, credits: 45, included: false, Icon: Fire, desc: { de: 'Auspuff Knallen', en: 'Exhaust Crackle' } },
  { id: 'launch', name: { de: 'Launch Control', en: 'Launch Control' }, credits: 55, included: false, Icon: RocketLaunch, desc: { de: 'Rennstart', en: 'Race Start' } },
  { id: 'swirl', name: { de: 'Swirl Flaps-Off', en: 'Swirl Flaps-Off' }, credits: 30, included: false, Icon: Fan, desc: { de: 'Drallklappen', en: 'Swirl Flaps' } },
  { id: 'cat', name: { de: 'Kat-Off', en: 'Cat-Off' }, credits: 35, included: false, Icon: Prohibit, desc: { de: 'Katalysator', en: 'Catalyst' } },
  { id: 'o2', name: { de: 'O2-Off', en: 'O2-Off' }, credits: 25, included: false, Icon: Thermometer, desc: { de: 'Lambdasonde', en: 'O2 Sensor' } },
  { id: 'hotstart', name: { de: 'Hot Start Fix', en: 'Hot Start Fix' }, credits: 30, included: false, Icon: Thermometer, desc: { de: 'Heißstart', en: 'Hot Start' } },
];

const DynoTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const rpm = payload[0]?.payload?.rpm;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-sm px-3 py-2.5 shadow-xl min-w-[140px]">
      <p className="text-[11px] font-bold text-muted-foreground mb-1.5">{rpm?.toLocaleString()} RPM</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] leading-relaxed">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.stroke }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-bold text-foreground ml-auto">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ── Translations ──────────────────────────────────────────────────────────
const t_data = {
  de: {
    title: 'Neuer Auftrag', subtitle: 'Datei hochladen, Fahrzeug und Tuning konfigurieren',
    step1: 'Datei & Lesegerät', step2: 'Fahrzeug & Tuning', step3: 'Übersicht',
    tuningTool: 'Lesegerät', readingMethod: 'Lesemethode', readingType: 'Leseart', masterSlave: 'Master / Slave', priority: 'Priorität', comment: 'Kommentar',
    dragDrop: 'Datei hier ablegen', or: 'oder', browse: 'Datei auswählen',
    manufacturer: 'Hersteller', series: 'Baureihe', model: 'Modell', engine: 'Motor', ecu: 'Steuergerät',
    selectPlaceholder: 'Bitte wählen...',
    selectTuning: 'TUNING WÄHLEN', performanceData: 'LEISTUNGSDATEN', power: 'Leistung', torque: 'Drehmoment', serie: 'Serie',
    additionalOptions: 'ZUSÄTZLICHE OPTIONEN', includedInStage: 'Inklusive', totalCredits: 'GESAMT',
    gearboxNote: 'Nur bei VW, Audi, Seat, Cupra, Skoda und BMW möglich', selectGearboxStage: 'GETRIEBE-STUFE WÄHLEN',
    nextStep: 'Weiter', prevStep: 'Zurück', submitOrder: 'Auftrag absenden',
    reviewFile: 'DATEI & LESEGERÄT', reviewVehicle: 'FAHRZEUG', reviewTuning: 'TUNING & OPTIONEN', reviewCost: 'KOSTEN',
    editStep: 'Bearbeiten', baseCredits: 'Grundpreis', optionsCredits: 'Optionen', prioritySurcharge: 'Prioritäts-Zuschlag',
    noVehicle: 'Bitte wähle ein Fahrzeug aus', noTuning: 'Kein Tuning ausgewählt',
  },
  en: {
    title: 'New Order', subtitle: 'Upload file, configure vehicle and tuning',
    step1: 'File & Device', step2: 'Vehicle & Tuning', step3: 'Review',
    tuningTool: 'Reading Device', readingMethod: 'Reading Method', readingType: 'Reading Type', masterSlave: 'Master / Slave', priority: 'Priority', comment: 'Comment',
    dragDrop: 'Drop file here', or: 'or', browse: 'Browse file',
    manufacturer: 'Manufacturer', series: 'Series', model: 'Model', engine: 'Engine', ecu: 'ECU',
    selectPlaceholder: 'Please select...',
    selectTuning: 'SELECT TUNING', performanceData: 'PERFORMANCE DATA', power: 'Power', torque: 'Torque', serie: 'Stock',
    additionalOptions: 'ADDITIONAL OPTIONS', includedInStage: 'Included', totalCredits: 'TOTAL',
    gearboxNote: 'Only available for VW, Audi, Seat, Cupra, Skoda and BMW', selectGearboxStage: 'SELECT GEARBOX STAGE',
    nextStep: 'Continue', prevStep: 'Back', submitOrder: 'Submit Order',
    reviewFile: 'FILE & DEVICE', reviewVehicle: 'VEHICLE', reviewTuning: 'TUNING & OPTIONS', reviewCost: 'COST',
    editStep: 'Edit', baseCredits: 'Base price', optionsCredits: 'Options', prioritySurcharge: 'Priority surcharge',
    noVehicle: 'Please select a vehicle', noTuning: 'No tuning selected',
  },
};

function Toggle({ label, selected, onClick, testId }) {
  return (
    <button type="button" onClick={onClick} data-testid={testId} className={cn("flex-1 py-2.5 px-3 text-sm font-semibold rounded-sm border transition-all cursor-pointer text-center", selected ? "bg-primary/10 border-primary text-foreground" : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground")}>
      {label}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════════════════
export default function NewOrder() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const t = (k) => t_data[language]?.[k] || k;
  const [step, setStep] = useState(1);

  // Step 1 state
  const [files, setFiles] = useState([]);
  const [readingDevice, setReadingDevice] = useState('');
  const [readingMethod, setReadingMethod] = useState('OBD');
  const [readingType, setReadingType] = useState('Full Read');
  const [masterSlave, setMasterSlave] = useState('Master');
  const [priority, setPriority] = useState('Normal');
  const [comment, setComment] = useState('');
  const fileRef = useRef(null);

  // Step 2 state (vehicle + tuning combined)
  const [mfr, setMfr] = useState('');
  const [ser, setSer] = useState('');
  const [mod, setMod] = useState('');
  const [eng, setEng] = useState('');
  const [ecuVal, setEcuVal] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedGearboxStage, setSelectedGearboxStage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [showPs, setShowPs] = useState(true);
  const [showNm, setShowNm] = useState(true);

  const seriesOpts = mfr && vehicleData[mfr] ? Object.keys(vehicleData[mfr]).sort() : [];
  const modelOpts = ser && vehicleData[mfr]?.[ser] ? Object.keys(vehicleData[mfr][ser]).sort() : [];
  const engineOpts = mod && vehicleData[mfr]?.[ser]?.[mod] ? vehicleData[mfr][ser][mod] : [];
  const ecuOpts = useMemo(() => getEcuOptions(mfr, eng), [mfr, eng]);
  const perf = useMemo(() => getPerfData(eng), [eng]);
  const supportsGearbox = gearboxMfrs.includes(mfr);

  const resetVehicle = (lvl) => {
    if (lvl <= 1) { setMfr(''); setSer(''); setMod(''); setEng(''); setEcuVal(''); }
    if (lvl === 2) { setSer(''); setMod(''); setEng(''); setEcuVal(''); }
    if (lvl === 3) { setMod(''); setEng(''); setEcuVal(''); }
    if (lvl === 4) { setEng(''); setEcuVal(''); }
  };

  const handleFiles = (fl) => { if (fl?.length) setFiles([fl[0]]); };

  // Compute total credits
  const totalCredits = useMemo(() => {
    let t = 0;
    if (selectedStage === 'gearbox') { t += gearboxStages.find(g => g.id === selectedGearboxStage)?.credits || 0; }
    else { t += tuningStages.find(s => s.id === selectedStage)?.credits || 0; t += selectedOptions.reduce((s, id) => s + (tuningOptions.find(o => o.id === id)?.credits || 0), 0); }
    return t;
  }, [selectedStage, selectedGearboxStage, selectedOptions]);

  // Get perf data for currently selected stage
  const stagePerfData = useMemo(() => {
    if (!perf) return null;
    if (selectedStage === 'stage1') return { ps: perf.stage1Ps, nm: perf.stage1Nm, psGain: perf.psGainS1, nmGain: perf.nmGainS1 };
    if (selectedStage === 'stage2') return { ps: perf.stage2Ps, nm: perf.stage2Nm, psGain: perf.psGainS2, nmGain: perf.nmGainS2 };
    if (selectedStage === 'eco') return { ps: perf.originalPs, nm: perf.originalNm, psGain: 0, nmGain: 0, eco: true };
    return null;
  }, [perf, selectedStage]);

  const steps = [
    { num: 1, label: t('step1') },
    { num: 2, label: t('step2') },
    { num: 3, label: t('step3') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <FileArrowUp weight="fill" className="w-7 h-7 text-primary" />
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={cn("flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold transition-all", step === s.num ? "bg-primary/15 text-foreground border border-primary/40" : step > s.num ? "bg-green-500/10 text-green-400 border border-green-500/30" : "bg-secondary/50 text-muted-foreground border border-border")}>
                {step > s.num ? <CheckCircle weight="fill" className="w-4 h-4 text-green-500" /> : <span className="text-xs font-bold">{s.num}</span>}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>

        {/* ═══ STEP 1: File & Lesegerät ═══ */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Upload */}
            <Card className="bg-card border-border">
              <CardContent className="p-5">
                <div
                  className="border-2 border-dashed border-border rounded-sm p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
                >
                  <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                  <Upload weight="light" className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">{t('dragDrop')} <span className="text-primary font-semibold cursor-pointer">{t('or')} {t('browse')}</span></p>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 flex items-center gap-2 bg-primary/8 border border-primary/30 rounded-sm px-4 py-2">
                    <CheckCircle weight="fill" className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-foreground truncate">{files[0].name}</span>
                    <button onClick={() => setFiles([])} className="ml-auto text-muted-foreground hover:text-foreground"><XIcon weight="bold" className="w-4 h-4" /></button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reading Device */}
            <Card className="bg-card border-border">
              <CardContent className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">{t('tuningTool')}</label>
                  <Select value={readingDevice} onValueChange={setReadingDevice}>
                    <SelectTrigger className="bg-secondary border-border" data-testid="no-reading-device">
                      <SelectValue placeholder={t('selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {readingDevices.flatMap(d => d.options.map(o => <SelectItem key={o} value={o}>{d.group ? `${d.group} - ${o}` : o}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">{t('readingMethod')}</label>
                    <div className="flex gap-2">
                      {['OBD', 'Bench', 'Boot'].map(m => <Toggle key={m} label={m} selected={readingMethod === m} onClick={() => setReadingMethod(m)} testId={`no-rm-${m}`} />)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">{t('readingType')}</label>
                    <div className="flex gap-2">
                      {['Full Read', 'Virtuell'].map(m => <Toggle key={m} label={m} selected={readingType === m} onClick={() => setReadingType(m)} testId={`no-rt-${m}`} />)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">{t('masterSlave')}</label>
                    <div className="flex gap-2">
                      {['Master', 'Slave'].map(m => <Toggle key={m} label={m} selected={masterSlave === m} onClick={() => setMasterSlave(m)} testId={`no-ms-${m}`} />)}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground uppercase tracking-wider block mb-2">{t('priority')}</label>
                    <div className="flex gap-2">
                      {['Normal', 'Express', 'Sofort'].map(m => <Toggle key={m} label={m === 'Express' ? 'Express (+49€)' : m === 'Sofort' ? 'Sofort (+99€)' : m} selected={priority === m} onClick={() => setPriority(m)} testId={`no-pri-${m}`} />)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nav */}
            <div className="flex justify-end">
              <Button className="btn-gradient text-white font-semibold px-8 py-3 h-auto" onClick={() => setStep(2)} data-testid="no-next-1">
                {t('nextStep')} <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Fahrzeug & Tuning (COMBINED) ═══ */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Vehicle Selection */}
            <Card className="bg-card border-border" data-testid="no-vehicle-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                  <CarProfile weight="bold" className="w-3.5 h-3.5" />
                  {t('manufacturer')} / {t('series')} / {t('model')} / {t('engine')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">{t('manufacturer')}</label>
                    <Select value={mfr} onValueChange={(v) => { setMfr(v); resetVehicle(2); }}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="no-mfr"><SelectValue placeholder={t('selectPlaceholder')} /></SelectTrigger>
                      <SelectContent className="bg-card border-border">{allManufacturers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">{t('series')}</label>
                    <Select value={ser} onValueChange={(v) => { setSer(v); resetVehicle(3); }} disabled={!mfr}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="no-ser"><SelectValue placeholder={t('selectPlaceholder')} /></SelectTrigger>
                      <SelectContent className="bg-card border-border">{seriesOpts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">{t('model')}</label>
                    <Select value={mod} onValueChange={(v) => { setMod(v); resetVehicle(4); }} disabled={!ser}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="no-mod"><SelectValue placeholder={t('selectPlaceholder')} /></SelectTrigger>
                      <SelectContent className="bg-card border-border">{modelOpts.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-[11px] text-muted-foreground mb-1.5 block">{t('engine')}</label>
                    <Select value={eng} onValueChange={(v) => { setEng(v); if (ecuOpts.length) setEcuVal(ecuOpts[0]); }} disabled={!mod}>
                      <SelectTrigger className="bg-secondary border-border" data-testid="no-eng"><SelectValue placeholder={t('selectPlaceholder')} /></SelectTrigger>
                      <SelectContent className="bg-card border-border">{engineOpts.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                {/* ECU Display */}
                {eng && ecuOpts.length > 0 && (
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <Cpu weight="bold" className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{t('ecu')}:</span>
                    {ecuOpts.map(e => <span key={e} className="text-xs font-mono text-foreground bg-secondary/80 border border-border px-2 py-1 rounded-sm">{e}</span>)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 2-Column: Stages + Performance (when engine selected) */}
            {eng && perf && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
                  {/* LEFT: Stage Buttons */}
                  <div className="space-y-3" data-testid="no-stages-col">
                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                      <Lightning weight="bold" className="w-3.5 h-3.5" />
                      {t('selectTuning')}
                    </label>
                    {tuningStages.map((stage) => {
                      const Icon = stage.Icon;
                      const isActive = selectedStage === stage.id;
                      return (
                        <button
                          key={stage.id}
                          type="button"
                          onClick={() => { setSelectedStage(isActive ? '' : stage.id); setSelectedGearboxStage(''); }}
                          data-testid={`no-stage-${stage.id}`}
                          className={cn(
                            "w-full flex items-center gap-3 p-4 rounded-sm border-2 transition-all text-left",
                            isActive
                              ? `bg-gradient-to-r ${stage.gradient} ${stage.border}`
                              : "bg-card border-border hover:border-muted-foreground/40"
                          )}
                        >
                          <Icon weight={isActive ? "fill" : "regular"} className={cn("w-6 h-6 flex-shrink-0", isActive ? stage.iconColor : "text-muted-foreground")} />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground">{stage.name[language]}</p>
                            <p className="text-[10px] text-muted-foreground">{stage.desc[language]}</p>
                          </div>
                          {isActive && <CheckCircle weight="fill" className="w-5 h-5 text-green-500 ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* RIGHT: Performance Data */}
                  <Card className="bg-card border-border" data-testid="no-perf-col">
                    <CardContent className="p-5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                        <Lightning weight="bold" className="w-3.5 h-3.5" />
                        {t('performanceData')}
                      </label>

                      {/* Stage-specific highlight */}
                      {stagePerfData && !stagePerfData.eco && (
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-primary/8 border border-primary/30 rounded-sm p-3 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('power')}</p>
                            <p className="text-2xl font-bold text-foreground font-heading mt-1">{stagePerfData.ps} <span className="text-xs font-normal text-muted-foreground">PS</span></p>
                            <Badge className="mt-1 bg-green-500/15 text-green-400 border-green-500/30 text-xs font-bold">+{stagePerfData.psGain} PS</Badge>
                          </div>
                          <div className="bg-blue-500/8 border border-blue-500/30 rounded-sm p-3 text-center">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('torque')}</p>
                            <p className="text-2xl font-bold text-foreground font-heading mt-1">{stagePerfData.nm} <span className="text-xs font-normal text-muted-foreground">Nm</span></p>
                            <Badge className="mt-1 bg-green-500/15 text-green-400 border-green-500/30 text-xs font-bold">+{stagePerfData.nmGain} Nm</Badge>
                          </div>
                        </div>
                      )}
                      {stagePerfData?.eco && (
                        <div className="bg-green-500/8 border border-green-500/30 rounded-sm p-4 mb-4 text-center">
                          <Leaf weight="fill" className="w-6 h-6 text-green-500 mx-auto mb-1" />
                          <p className="text-sm font-bold text-foreground">{language === 'de' ? 'Bis zu -15% Verbrauch' : 'Up to -15% fuel consumption'}</p>
                          <p className="text-xs text-muted-foreground mt-1">{perf.originalPs} PS / {perf.originalNm} Nm {language === 'de' ? 'beibehalten' : 'maintained'}</p>
                        </div>
                      )}

                      {/* PS/Nm bars */}
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">{t('power')} (PS)</span>
                          </div>
                          <div className="space-y-1.5">
                            {[{ l: t('serie'), v: perf.originalPs, g: null, bg: '#555' }, { l: 'Stage 1', v: perf.stage1Ps, g: perf.psGainS1, bg: 'linear-gradient(to right,#8B2635,#a52d3a)' }, { l: 'Stage 2', v: perf.stage2Ps, g: perf.psGainS2, bg: 'linear-gradient(to right,#c0392b,#e74c3c)' }].map(r => (
                              <div key={r.l} className="flex items-center gap-2">
                                <span className={cn("text-[10px] w-12 text-right flex-shrink-0", r.g ? "text-foreground font-semibold" : "text-muted-foreground")}>{r.l}</span>
                                <div className="flex-1 h-6 bg-secondary/40 rounded-sm overflow-hidden relative">
                                  <div className="h-full rounded-sm" style={{ width: `${(r.v / perf.stage2Ps) * 100}%`, background: r.bg }} />
                                  <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-bold text-white">{r.v} PS</span>
                                  {r.g && <span className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-bold text-green-400">+{r.g}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-foreground uppercase tracking-wider">{t('torque')} (Nm)</span>
                          </div>
                          <div className="space-y-1.5">
                            {[{ l: t('serie'), v: perf.originalNm, g: null, bg: '#555' }, { l: 'Stage 1', v: perf.stage1Nm, g: perf.nmGainS1, bg: 'linear-gradient(to right,#1d4ed8,#2563eb)' }, { l: 'Stage 2', v: perf.stage2Nm, g: perf.nmGainS2, bg: 'linear-gradient(to right,#2563eb,#3b82f6)' }].map(r => (
                              <div key={r.l} className="flex items-center gap-2">
                                <span className={cn("text-[10px] w-12 text-right flex-shrink-0", r.g ? "text-foreground font-semibold" : "text-muted-foreground")}>{r.l}</span>
                                <div className="flex-1 h-6 bg-secondary/40 rounded-sm overflow-hidden relative">
                                  <div className="h-full rounded-sm" style={{ width: `${(r.v / perf.stage2Nm) * 100}%`, background: r.bg }} />
                                  <span className="absolute inset-0 flex items-center pl-2 text-[10px] font-bold text-white">{r.v} Nm</span>
                                  {r.g && <span className="absolute inset-0 flex items-center justify-end pr-2 text-[9px] font-bold text-green-400">+{r.g}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Dyno Chart */}
                <Card className="bg-card border-border" data-testid="no-dyno-card">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                        <Lightning weight="bold" className="w-3.5 h-3.5" />
                        {t('performanceData')}
                      </label>
                      <div className="flex gap-2">
                        <button type="button" onClick={() => setShowPs(p => !p)} data-testid="no-toggle-ps" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border transition-all", showPs ? "bg-[#8B2635]/15 border-[#8B2635]/50 text-[#e74c3c]" : "bg-secondary/50 border-border text-muted-foreground")}>
                          <span className={cn("w-2 h-2 rounded-full", showPs ? "bg-[#e74c3c]" : "bg-muted-foreground/40")} /> PS
                        </button>
                        <button type="button" onClick={() => setShowNm(p => !p)} data-testid="no-toggle-nm" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border transition-all", showNm ? "bg-blue-500/15 border-blue-500/50 text-blue-400" : "bg-secondary/50 border-border text-muted-foreground")}>
                          <span className={cn("w-2 h-2 rounded-full", showNm ? "bg-blue-400" : "bg-muted-foreground/40")} /> Nm
                        </button>
                      </div>
                    </div>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={perf.curveData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                          <defs>
                            <linearGradient id="nGsPs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#666" stopOpacity={0.3} /><stop offset="100%" stopColor="#666" stopOpacity={0} /></linearGradient>
                            <linearGradient id="nG1Ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B2635" stopOpacity={0.3} /><stop offset="100%" stopColor="#8B2635" stopOpacity={0} /></linearGradient>
                            <linearGradient id="nG2Ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e74c3c" stopOpacity={0.25} /><stop offset="100%" stopColor="#e74c3c" stopOpacity={0} /></linearGradient>
                            <linearGradient id="nGsNm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#555" stopOpacity={0.2} /><stop offset="100%" stopColor="#555" stopOpacity={0} /></linearGradient>
                            <linearGradient id="nG1Nm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
                            <linearGradient id="nG2Nm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="rpmLabel" tick={{ fill: '#666', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
                          <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <Tooltip content={<DynoTooltip />} />
                          {showPs && <Area type="monotone" dataKey="seriePs" name={`${t('serie')} PS`} stroke="#666" strokeWidth={2} fill="url(#nGsPs)" strokeDasharray="6 3" dot={false} />}
                          {showPs && <Area type="monotone" dataKey="stage1Ps" name="Stage 1 PS" stroke="#8B2635" strokeWidth={2.5} fill="url(#nG1Ps)" dot={false} />}
                          {showPs && <Area type="monotone" dataKey="stage2Ps" name="Stage 2 PS" stroke="#e74c3c" strokeWidth={2.5} fill="url(#nG2Ps)" dot={false} />}
                          {showNm && <Area type="monotone" dataKey="serieNm" name={`${t('serie')} Nm`} stroke="#555" strokeWidth={2} fill="url(#nGsNm)" strokeDasharray="6 3" dot={false} />}
                          {showNm && <Area type="monotone" dataKey="stage1Nm" name="Stage 1 Nm" stroke="#2563eb" strokeWidth={2.5} fill="url(#nG1Nm)" dot={false} />}
                          {showNm && <Area type="monotone" dataKey="stage2Nm" name="Stage 2 Nm" stroke="#3b82f6" strokeWidth={2.5} fill="url(#nG2Nm)" dot={false} />}
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Gearbox Stages (when Getriebe selected) */}
                {selectedStage === 'gearbox' && (
                  <Card className="bg-card border-border" data-testid="no-gearbox-card">
                    <CardContent className="p-5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                        <Gear weight="bold" className="w-3.5 h-3.5" />
                        {t('selectGearboxStage')}
                      </label>
                      <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm mb-4">
                        <Warning weight="fill" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-400">{t('gearboxNote')}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {gearboxStages.map((gs) => {
                          const isActive = selectedGearboxStage === gs.id;
                          return (
                            <button key={gs.id} type="button" onClick={() => setSelectedGearboxStage(isActive ? '' : gs.id)} data-testid={`no-gb-${gs.id}`}
                              className={cn("flex flex-col items-center gap-3 p-5 rounded-sm border-2 transition-all cursor-pointer", isActive ? "bg-blue-500/10 border-blue-500" : "bg-card border-border hover:border-muted-foreground/50")}>
                              {isActive && <CheckCircle weight="fill" className="w-4 h-4 text-green-500 self-end" />}
                              <Gear weight={isActive ? "fill" : "regular"} className={cn("w-7 h-7", isActive ? "text-blue-500" : "text-muted-foreground")} />
                              <span className="text-base font-bold text-foreground">{gs.name[language]}</span>
                              <span className={cn("text-sm font-bold px-4 py-1.5 rounded-full", isActive ? "bg-blue-500 text-white" : "bg-secondary text-muted-foreground")}>{gs.credits} Credits</span>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Options (when NOT gearbox) */}
                {selectedStage !== 'gearbox' && (
                  <Card className="bg-card border-border" data-testid="no-options-card">
                    <CardContent className="p-5">
                      <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                        <Sliders weight="bold" className="w-3.5 h-3.5" />
                        {t('additionalOptions')}
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {tuningOptions.map((opt) => {
                          const Icon = opt.Icon;
                          const isSel = selectedOptions.includes(opt.id);
                          return (
                            <button key={opt.id} type="button" data-testid={`no-opt-${opt.id}`}
                              onClick={() => setSelectedOptions(prev => prev.includes(opt.id) ? prev.filter(id => id !== opt.id) : [...prev, opt.id])}
                              className={cn("relative flex flex-col items-center gap-2 p-4 rounded-sm border transition-all cursor-pointer", isSel ? "bg-primary/8 border-primary/40 ring-1 ring-primary/20" : "bg-card border-border hover:border-muted-foreground/40")}>
                              {isSel && <CheckCircle weight="fill" className="w-4 h-4 text-green-500 absolute top-1.5 right-1.5" />}
                              <Icon weight={isSel ? "fill" : "regular"} className={cn("w-6 h-6", isSel ? "text-primary" : "text-muted-foreground")} />
                              <span className="text-xs font-bold text-foreground text-center leading-tight">{opt.name[language]}</span>
                              {opt.credits > 0 ? <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{opt.credits} Credits</span>
                                : <span className="text-[10px] font-semibold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">0 Credits</span>}
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Credits total */}
                {(selectedStage || selectedOptions.length > 0) && (
                  <Card className="bg-card border-primary/30" data-testid="no-credits-total">
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">{t('totalCredits')}</span>
                      <span className="text-2xl font-bold text-primary">{totalCredits} <span className="text-sm font-medium text-muted-foreground">Credits</span></span>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between">
              <Button variant="outline" className="border-border hover:bg-secondary font-semibold px-6 py-3 h-auto" onClick={() => setStep(1)} data-testid="no-prev-2">
                <ArrowLeft weight="bold" className="w-4 h-4 mr-2" /> {t('prevStep')}
              </Button>
              <Button className="btn-gradient text-white font-semibold px-8 py-3 h-auto" onClick={() => setStep(3)} data-testid="no-next-2">
                {t('nextStep')} <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Übersicht ═══ */}
        {step === 3 && (
          <div className="space-y-5">
            {/* File summary */}
            <Card className="bg-card border-border" data-testid="no-review-file">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase"><Upload weight="bold" className="w-3.5 h-3.5" /> {t('reviewFile')}</label>
                  <button type="button" onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"><Pencil weight="bold" className="w-3.5 h-3.5" /> {t('editStep')}</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[{ l: language === 'de' ? 'Datei' : 'File', v: files[0]?.name || '—' }, { l: t('tuningTool'), v: readingDevice || '—' }, { l: t('readingMethod'), v: readingMethod }, { l: t('readingType'), v: readingType }, { l: t('masterSlave'), v: masterSlave }, { l: t('priority'), v: priority }].map(i => (
                    <div key={i.l} className="bg-secondary/50 border border-border rounded-sm px-4 py-3">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{i.l}</p>
                      <p className="text-sm font-semibold text-foreground">{i.v}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle summary */}
            <Card className="bg-card border-border" data-testid="no-review-vehicle">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase"><CarProfile weight="bold" className="w-3.5 h-3.5" /> {t('reviewVehicle')}</label>
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"><Pencil weight="bold" className="w-3.5 h-3.5" /> {t('editStep')}</button>
                </div>
                {mfr ? (
                  <div className="flex flex-wrap gap-2">
                    {[{ l: t('manufacturer'), v: mfr, icon: true }, ser && { l: t('series'), v: ser }, mod && { l: t('model'), v: mod }, eng && { l: t('engine'), v: eng }].filter(Boolean).map(i => (
                      <div key={i.l} className={cn("flex items-center gap-2 rounded-sm px-4 py-2.5 border", i.icon ? "bg-primary/10 border-primary/30" : "bg-secondary/80 border-border")}>
                        <div><p className="text-[10px] text-muted-foreground uppercase tracking-wider">{i.l}</p><p className="text-sm font-semibold text-foreground">{i.v}</p></div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">{t('noVehicle')}</p>}
              </CardContent>
            </Card>

            {/* Tuning summary */}
            <Card className="bg-card border-border" data-testid="no-review-tuning">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase"><Lightning weight="bold" className="w-3.5 h-3.5" /> {t('reviewTuning')}</label>
                  <button type="button" onClick={() => setStep(2)} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80"><Pencil weight="bold" className="w-3.5 h-3.5" /> {t('editStep')}</button>
                </div>
                {selectedStage ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {(() => { const s = tuningStages.find(x => x.id === selectedStage); if (!s) return null; const I = s.Icon; return (<div className={cn("flex items-center gap-3 rounded-sm px-4 py-2.5 border", s.border, `bg-gradient-to-r ${s.gradient}`)}><I weight="fill" className={cn("w-5 h-5", s.iconColor)} /><span className="text-sm font-bold text-foreground">{s.name[language]}</span>{selectedStage === 'gearbox' && selectedGearboxStage && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">{gearboxStages.find(g => g.id === selectedGearboxStage)?.name[language]} — {gearboxStages.find(g => g.id === selectedGearboxStage)?.credits} Cr</Badge>}{s.credits > 0 && <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">{s.credits} Credits</Badge>}</div>); })()}
                    </div>
                    {selectedStage !== 'gearbox' && selectedOptions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedOptions.map(id => { const o = tuningOptions.find(x => x.id === id); if (!o) return null; const I = o.Icon; return (<div key={id} className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-3 py-2"><I weight="fill" className="w-4 h-4 text-muted-foreground" /><span className="text-xs font-semibold text-foreground">{o.name[language]}</span>{o.credits > 0 ? <span className="text-[10px] font-bold text-primary">+{o.credits}</span> : <span className="text-[10px] font-bold text-green-400">0</span>}</div>); })}
                      </div>
                    )}
                  </div>
                ) : <p className="text-sm text-muted-foreground">{t('noTuning')}</p>}
              </CardContent>
            </Card>

            {/* Cost summary */}
            <Card className="bg-card border-primary/30" data-testid="no-review-cost">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3"><CreditCard weight="bold" className="w-3.5 h-3.5" /> {t('reviewCost')}</label>
                <div className="space-y-2">
                  {selectedStage && <div className="flex justify-between py-2 border-b border-border/50"><span className="text-sm text-muted-foreground">{t('baseCredits')}</span><span className="text-sm font-bold text-foreground">{selectedStage === 'gearbox' ? (gearboxStages.find(g => g.id === selectedGearboxStage)?.credits || 0) : (tuningStages.find(s => s.id === selectedStage)?.credits || 0)} Credits</span></div>}
                  {selectedStage !== 'gearbox' && selectedOptions.length > 0 && <div className="flex justify-between py-2 border-b border-border/50"><span className="text-sm text-muted-foreground">{t('optionsCredits')} ({selectedOptions.length}x)</span><span className="text-sm font-bold text-foreground">{selectedOptions.reduce((s, id) => s + (tuningOptions.find(o => o.id === id)?.credits || 0), 0)} Credits</span></div>}
                  {priority !== 'Normal' && <div className="flex justify-between py-2 border-b border-border/50"><span className="text-sm text-muted-foreground">{t('prioritySurcharge')}: {priority}</span><span className="text-sm font-bold text-primary">+{priority === 'Express' ? '49' : '99'}€</span></div>}
                  <div className="flex justify-between pt-3"><span className="text-sm font-bold text-foreground uppercase tracking-wider">{t('totalCredits')}</span><span className="text-2xl font-bold text-primary font-heading">{totalCredits} <span className="text-sm font-medium text-muted-foreground">Credits</span></span></div>
                </div>
              </CardContent>
            </Card>

            {/* Nav */}
            <div className="flex items-center justify-between">
              <Button variant="outline" className="border-border hover:bg-secondary font-semibold px-6 py-3 h-auto" onClick={() => setStep(2)} data-testid="no-prev-3">
                <ArrowLeft weight="bold" className="w-4 h-4 mr-2" /> {t('prevStep')}
              </Button>
              <Button className="btn-gradient text-white font-semibold px-10 py-3.5 h-auto text-base" data-testid="no-submit-btn"
                onClick={() => navigate('/order-live', { state: { orderData: {
                  fileName: files[0]?.name || '',
                  mfr, ser, mod, eng, ecuVal,
                  readingDevice, readingMethod, readingType, masterSlave, priority,
                  selectedStage, selectedGearboxStage, selectedOptions,
                  totalCredits,
                }}})}
              >
                <PaperPlaneTilt weight="fill" className="w-5 h-5 mr-2" /> {t('submitOrder')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
