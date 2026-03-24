import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Wrench,
  PlugsConnected,
  BookOpen,
  CircleHalf,
  Timer,
  CloudArrowUp,
  CloudArrowDown,
  ArrowRight,
  ArrowLeft,
  X,
  File as FileIcon,
  Upload,
  Sliders,
  CheckCircle,
  CarProfile,
  HardDrives,
  Crown,
  Link,
  Car,
  Engine,
  Calendar,
  Tag,
  GasPump
} from '@phosphor-icons/react';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';

// Vehicle database: Hersteller -> Baureihe -> Modell -> Motor
const vehicleData = {
  'Audi': {
    'A1': {
      '8X - 2010': ['1.0 TFSI - 95 PS', '1.4 TFSI - 125 PS', '1.4 TDI - 90 PS', '1.6 TDI - 105 PS', '1.8 TFSI - 192 PS', '2.0 TDI - 143 PS'],
      'GB - 2018': ['1.0 TFSI - 116 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 116 PS', '2.0 TFSI - 207 PS'],
    },
    'A3': {
      '8P - 2003': ['1.6 TDI - 105 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.2 V6 - 250 PS'],
      '8V - 2012': ['1.0 TFSI - 116 PS', '1.4 TFSI - 125 PS', '1.4 TFSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 310 PS (RS3)'],
      '8Y - 2020': ['1.0 TFSI - 110 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TFSI - 310 PS (RS3)', '2.5 TFSI - 400 PS (RS3)'],
    },
    'A4': {
      'B7 - 2004': ['1.8 T - 163 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.0 TDI - 204 PS', '4.2 FSI - 344 PS (RS4)'],
      'B8 - 2008': ['1.8 TFSI - 120 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 143 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 245 PS', '3.2 FSI - 265 PS'],
      'B9 - 2015': ['1.4 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 218 PS', '3.0 TDI - 272 PS', '2.9 TFSI - 450 PS (RS4)'],
    },
    'A5': {
      '8T - 2007': ['2.0 TDI - 143 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 204 PS', '3.0 TDI - 245 PS', '3.2 FSI - 265 PS', '4.2 FSI - 450 PS (RS5)'],
      'F5 - 2016': ['2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 218 PS', '3.0 TDI - 286 PS', '2.9 TFSI - 450 PS (RS5)'],
    },
    'A6': {
      'C6 - 2004': ['2.0 TDI - 140 PS', '2.7 TDI - 180 PS', '3.0 TDI - 225 PS', '3.0 TDI - 233 PS', '2.0 TFSI - 170 PS', '4.2 FSI - 350 PS', '5.0 V10 - 580 PS (RS6)'],
      'C7 - 2011': ['2.0 TDI - 177 PS', '2.0 TFSI - 180 PS', '3.0 TDI - 204 PS', '3.0 TDI EU6 - 218 PS', '3.0 TDI - 272 PS', '3.0 TDI - 326 PS', '3.0 TFSI - 310 PS', '4.0 TFSI - 560 PS (RS6)'],
      'C8 - 2018': ['2.0 TDI - 163 PS', '2.0 TDI - 204 PS', '3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '2.0 TFSI - 245 PS', '3.0 TFSI - 340 PS', '4.0 TFSI - 600 PS (RS6)'],
    },
    'Q5': {
      '8R - 2008': ['2.0 TDI - 143 PS', '2.0 TDI - 170 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 180 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 240 PS', '3.0 TDI - 258 PS'],
      'FY - 2017': ['2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 286 PS', '2.9 TFSI - 381 PS (SQ5)'],
    },
    'Q7': {
      '4L - 2006': ['3.0 TDI - 204 PS', '3.0 TDI - 233 PS', '3.0 TDI - 240 PS', '4.2 TDI - 326 PS', '4.2 FSI - 350 PS', '6.0 TDI V12 - 500 PS'],
      '4M - 2015': ['3.0 TDI - 218 PS', '3.0 TDI - 272 PS', '2.0 TFSI - 252 PS', '3.0 TFSI - 340 PS', '4.0 TDI - 435 PS (SQ7)'],
    },
  },
  'BMW': {
    '1er': {
      'E87 - 2004': ['116i - 115 PS', '118d - 143 PS', '120d - 163 PS', '120d - 177 PS', '123d - 204 PS', '130i - 265 PS'],
      'F20 - 2011': ['114d - 95 PS', '116d - 116 PS', '118d - 143 PS', '118d - 150 PS', '120d - 184 PS', '120d - 190 PS', '125d - 218 PS', '125i - 218 PS', 'M135i - 326 PS'],
      'F40 - 2019': ['116d - 116 PS', '118d - 150 PS', '118i - 140 PS', '120d - 190 PS', '128ti - 265 PS', 'M135i - 306 PS'],
    },
    '3er': {
      'E90 - 2005': ['318d - 143 PS', '320d - 163 PS', '320d - 177 PS', '325d - 197 PS', '330d - 231 PS', '330d - 245 PS', '335d - 286 PS', '320i - 150 PS', '325i - 218 PS', '335i - 306 PS'],
      'F30 - 2012': ['316d - 116 PS', '318d - 143 PS', '318d - 150 PS', '320d - 163 PS', '320d - 184 PS', '320d - 190 PS', '325d - 218 PS', '330d - 258 PS', '335d - 313 PS', '320i - 184 PS', '328i - 245 PS', '335i - 306 PS', '340i - 326 PS'],
      'G20 - 2019': ['318d - 150 PS', '320d - 190 PS', '330d - 286 PS', '330e - 292 PS', '320i - 184 PS', '330i - 258 PS', 'M340i - 374 PS', 'M3 - 480 PS', 'M3 Competition - 510 PS'],
    },
    '5er': {
      'E60 - 2003': ['520d - 163 PS', '520d - 177 PS', '525d - 197 PS', '530d - 218 PS', '530d - 231 PS', '530d - 245 PS', '535d - 272 PS', '535d - 286 PS', '525i - 218 PS', '530i - 258 PS', '550i - 367 PS', 'M5 - 507 PS'],
      'F10 - 2010': ['518d - 143 PS', '520d - 184 PS', '520d - 190 PS', '525d - 218 PS', '530d - 258 PS', '535d - 313 PS', '520i - 184 PS', '528i - 245 PS', '535i - 306 PS', '550i - 449 PS', 'M5 - 560 PS'],
      'G30 - 2017': ['518d - 150 PS', '520d - 190 PS', '530d - 265 PS', '530d - 286 PS', '540d - 320 PS', '520i - 184 PS', '530i - 252 PS', '540i - 340 PS', 'M550i - 462 PS', 'M5 - 600 PS'],
    },
    'X3': {
      'F25 - 2010': ['sDrive18d - 143 PS', 'xDrive20d - 184 PS', 'xDrive20d - 190 PS', 'xDrive30d - 258 PS', 'xDrive35d - 313 PS', 'xDrive20i - 184 PS', 'xDrive28i - 245 PS', 'xDrive35i - 306 PS'],
      'G01 - 2017': ['xDrive20d - 190 PS', 'xDrive30d - 265 PS', 'xDrive20i - 184 PS', 'xDrive30i - 252 PS', 'M40i - 360 PS', 'M Competition - 510 PS'],
    },
    'X5': {
      'E70 - 2006': ['xDrive30d - 235 PS', 'xDrive30d - 245 PS', 'xDrive40d - 306 PS', 'xDrive50i - 407 PS', 'M50d - 381 PS', 'M - 555 PS'],
      'F15 - 2013': ['sDrive25d - 218 PS', 'xDrive25d - 218 PS', 'xDrive30d - 258 PS', 'xDrive40d - 313 PS', 'M50d - 381 PS', 'xDrive35i - 306 PS', 'xDrive50i - 449 PS', 'M - 575 PS'],
      'G05 - 2018': ['xDrive25d - 231 PS', 'xDrive30d - 265 PS', 'xDrive40d - 340 PS', 'M50d - 400 PS', 'xDrive40i - 340 PS', 'M50i - 530 PS', 'M Competition - 625 PS'],
    },
  },
  'VW': {
    'Golf': {
      'Golf 6 - 2008': ['1.2 TSI - 105 PS', '1.4 TSI - 122 PS', '1.4 TSI - 160 PS', '1.6 TDI - 105 PS', '2.0 TDI - 110 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TSI GTI - 210 PS', '2.0 TSI R - 270 PS'],
      'Golf 7 - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 105 PS', '1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI GTI - 230 PS', '2.0 TSI GTI TCR - 290 PS', '2.0 TSI R - 300 PS', '2.0 TSI R - 310 PS'],
      'Golf 8 - 2019': ['1.0 TSI - 110 PS', '1.5 TSI - 130 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TSI GTI - 245 PS', '2.0 TSI GTI Clubsport - 300 PS', '2.0 TSI R - 320 PS'],
    },
    'Passat': {
      'B7 - 2010': ['1.4 TSI - 122 PS', '1.8 TSI - 160 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TSI - 210 PS'],
      'B8 - 2014': ['1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '1.6 TDI - 120 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TDI - 240 PS (Bi-TDI)', '2.0 TSI - 190 PS', '2.0 TSI - 272 PS'],
    },
    'Tiguan': {
      'AD - 2016': ['1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TDI - 240 PS', '2.0 TSI - 180 PS', '2.0 TSI - 190 PS', '2.0 TSI - 230 PS', '2.0 TSI R - 320 PS'],
    },
    'T-Roc': {
      'A11 - 2017': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TSI - 190 PS', '2.0 TSI R - 300 PS'],
    },
    'Touareg': {
      'CR - 2018': ['3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '3.0 TSI - 340 PS', '4.0 TDI - 422 PS'],
    },
  },
  'Mercedes': {
    'A-Klasse': {
      'W176 - 2012': ['A160 CDI - 90 PS', 'A180 CDI - 109 PS', 'A200 CDI - 136 PS', 'A220 CDI - 177 PS', 'A180 - 122 PS', 'A200 - 156 PS', 'A250 - 211 PS', 'A45 AMG - 360 PS', 'A45 AMG - 381 PS'],
      'W177 - 2018': ['A160d - 95 PS', 'A180d - 116 PS', 'A200d - 150 PS', 'A220d - 190 PS', 'A180 - 136 PS', 'A200 - 163 PS', 'A250 - 224 PS', 'A35 AMG - 306 PS', 'A45 AMG - 387 PS', 'A45 S AMG - 421 PS'],
    },
    'C-Klasse': {
      'W204 - 2007': ['C180 CDI - 120 PS', 'C200 CDI - 136 PS', 'C220 CDI - 170 PS', 'C250 CDI - 204 PS', 'C350 CDI - 265 PS', 'C180 - 156 PS', 'C200 - 184 PS', 'C250 - 204 PS', 'C350 - 306 PS', 'C63 AMG - 457 PS'],
      'W205 - 2014': ['C180d - 116 PS', 'C200d - 160 PS', 'C220d - 170 PS', 'C250d - 204 PS', 'C300d - 245 PS', 'C180 - 156 PS', 'C200 - 184 PS', 'C300 - 245 PS', 'C43 AMG - 367 PS', 'C43 AMG - 390 PS', 'C63 AMG - 476 PS', 'C63 S AMG - 510 PS'],
      'W206 - 2021': ['C200d - 163 PS', 'C220d - 200 PS', 'C300d - 265 PS', 'C200 - 204 PS', 'C300 - 258 PS', 'C43 AMG - 408 PS', 'C63 S AMG E - 680 PS'],
    },
    'E-Klasse': {
      'W212 - 2009': ['E200 CDI - 136 PS', 'E220 CDI - 170 PS', 'E250 CDI - 204 PS', 'E300 CDI - 231 PS', 'E350 CDI - 265 PS', 'E200 - 184 PS', 'E300 - 252 PS', 'E400 - 333 PS', 'E63 AMG - 557 PS', 'E63 S AMG - 585 PS'],
      'W213 - 2016': ['E200d - 150 PS', 'E220d - 194 PS', 'E300d - 245 PS', 'E350d - 286 PS', 'E400d - 340 PS', 'E200 - 184 PS', 'E300 - 245 PS', 'E450 - 367 PS', 'E53 AMG - 435 PS', 'E63 AMG - 571 PS', 'E63 S AMG - 612 PS'],
    },
    'GLC': {
      'X253 - 2015': ['GLC 200d - 163 PS', 'GLC 220d - 170 PS', 'GLC 250d - 204 PS', 'GLC 300d - 245 PS', 'GLC 200 - 184 PS', 'GLC 300 - 245 PS', 'GLC 43 AMG - 367 PS', 'GLC 63 AMG - 476 PS', 'GLC 63 S AMG - 510 PS'],
    },
  },
  'Seat': {
    'Leon': {
      '5F - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 110 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI Cupra - 280 PS', '2.0 TSI Cupra - 290 PS', '2.0 TSI Cupra R - 310 PS'],
      'KL - 2020': ['1.0 TSI - 110 PS', '1.5 TSI - 130 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS'],
    },
    'Ateca': {
      'KH - 2016': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TSI - 190 PS', '2.0 TSI Cupra - 300 PS'],
    },
  },
  'Skoda': {
    'Octavia': {
      '5E - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 110 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI RS - 230 PS', '2.0 TSI RS - 245 PS'],
      'NX - 2020': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 200 PS', '2.0 TSI RS - 245 PS'],
    },
    'Superb': {
      '3V - 2015': ['1.4 TSI - 150 PS', '1.5 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TSI - 272 PS', '2.0 TSI - 280 PS'],
    },
  },
  'Opel': {
    'Astra': {
      'J - 2009': ['1.4 Turbo - 120 PS', '1.4 Turbo - 140 PS', '1.6 CDTI - 110 PS', '1.6 CDTI - 136 PS', '2.0 CDTI - 165 PS', '2.0 Turbo OPC - 280 PS'],
      'K - 2015': ['1.0 Turbo - 105 PS', '1.2 Turbo - 130 PS', '1.4 Turbo - 150 PS', '1.6 CDTI - 110 PS', '1.6 CDTI - 136 PS', '1.6 CDTI - 160 PS', '1.6 Turbo - 200 PS'],
    },
    'Insignia': {
      'B - 2017': ['1.5 Turbo - 140 PS', '1.5 Turbo - 165 PS', '2.0 CDTI - 170 PS', '2.0 CDTI - 210 PS', '2.0 Turbo - 260 PS', '2.0 Turbo GSi - 230 PS'],
    },
  },
  'Ford': {
    'Focus': {
      'MK3 - 2011': ['1.0 EcoBoost - 100 PS', '1.0 EcoBoost - 125 PS', '1.5 EcoBoost - 150 PS', '1.5 TDCi - 95 PS', '1.5 TDCi - 120 PS', '2.0 TDCi - 150 PS', '2.3 EcoBoost RS - 350 PS', '2.3 EcoBoost ST - 280 PS'],
      'MK4 - 2018': ['1.0 EcoBoost - 100 PS', '1.0 EcoBoost - 125 PS', '1.0 EcoBoost - 155 PS', '1.5 EcoBlue - 120 PS', '1.5 EcoBoost - 150 PS', '1.5 EcoBoost - 182 PS', '2.0 EcoBlue - 150 PS', '2.3 EcoBoost ST - 280 PS'],
    },
    'Kuga': {
      'MK3 - 2019': ['1.5 EcoBlue - 120 PS', '1.5 EcoBoost - 150 PS', '2.0 EcoBlue - 150 PS', '2.0 EcoBlue - 190 PS', '2.5 PHEV - 225 PS'],
    },
  },
  'Porsche': {
    'Cayenne': {
      '92A - 2010': ['Diesel - 245 PS', 'S Diesel - 382 PS', 'S - 400 PS', 'S - 420 PS', 'GTS - 440 PS', 'Turbo - 500 PS', 'Turbo S - 570 PS'],
      'E3 - 2017': ['3.0 V6 - 340 PS', 'S 2.9 V6 - 440 PS', 'GTS 4.0 V8 - 460 PS', 'Turbo 4.0 V8 - 550 PS', 'Turbo S E-Hybrid - 680 PS'],
    },
    'Macan': {
      '95B - 2014': ['2.0 TFSI - 237 PS', '2.0 TFSI - 252 PS', 'S 3.0 V6 - 340 PS', 'S 3.0 V6 - 354 PS', 'GTS 2.9 V6 - 380 PS', 'Turbo 3.6 V6 - 400 PS'],
    },
    '911': {
      '991 - 2011': ['Carrera 3.4 - 350 PS', 'Carrera S 3.8 - 400 PS', 'Carrera 3.0T - 370 PS', 'Carrera S 3.0T - 420 PS', 'GTS 3.0T - 450 PS', 'Turbo 3.8T - 540 PS', 'Turbo S 3.8T - 580 PS', 'GT3 4.0 - 500 PS'],
      '992 - 2019': ['Carrera 3.0T - 385 PS', 'Carrera S 3.0T - 450 PS', 'GTS 3.0T - 480 PS', 'Turbo 3.7T - 580 PS', 'Turbo S 3.7T - 650 PS', 'GT3 4.0 - 510 PS'],
    },
  },
};

const allManufacturers = Object.keys(vehicleData).sort();

const readingDevices = [
  { group: 'Autotuner', logo: '/logos/autotuner.png', options: ['Tool'] },
  { group: 'Alientech', logo: '/logos/alientech.png', options: ['Kess3'] },
  { group: 'Magic Motorsport', logo: '/logos/magicmotorsport.png', options: ['Flex'] },
  { group: null, logo: '/logos/autoflasher.png', options: ['Autoflasher'] },
  { group: null, logo: null, options: ['CMD Flash'] },
  { group: 'Dimsport', logo: '/logos/dimsport.png', options: ['NewGenius'] },
];

const ALLOWED_EXTENSIONS = ['.bin', '.ori', '.mod', '.ecu', '.hex', '.s19', '.bkp', '.slave'];

function ToggleOption({ label, selected, onClick, extra, testId, icon, IconComponent }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={cn(
        "flex-1 py-3 px-4 text-sm font-semibold rounded-sm border transition-all duration-200 cursor-pointer flex items-center justify-center gap-2",
        selected
          ? "bg-primary/10 border-primary text-foreground"
          : "bg-secondary/50 border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon && <img src={icon} alt="" className="h-5 w-5 object-contain" />}
      {IconComponent && <IconComponent weight="bold" className="w-5 h-5" />}
      <span>{label}</span>
      {extra && (
        <span className="ml-1 text-primary font-bold">{extra}</span>
      )}
    </button>
  );
}

export default function FileWizard() {
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    readingDevice: '',
    readingMethod: 'OBD',
    readingType: 'Full Read',
    masterSlave: 'Master',
    priority: 'Normal',
    comment: '',
    // Step 2 - Fahrzeug
    manufacturer: '',
    series: '',
    vehicleModel: '',
    engine: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Parse filename into readable parts
  const parsedFilename = useMemo(() => {
    if (uploadedFiles.length === 0) return null;
    const name = uploadedFiles[0].name;
    const nameWithoutExt = name.replace(/\.[^/.]+$/, '');
    // Split by underscore, dash, space — keep parenthesized groups together
    const parts = nameWithoutExt.split(/[_\-\s]+/).filter(Boolean);
    
    const manufacturers = ['BMW', 'VW', 'Volkswagen', 'Audi', 'Mercedes', 'Benz', 'Porsche', 'Seat', 'Skoda', 'Opel', 'Ford', 'Toyota', 'Honda', 'Renault', 'Peugeot', 'Citroen', 'Fiat', 'Alfa', 'Hyundai', 'Kia', 'Volvo', 'Jaguar', 'Land', 'Range', 'Mini', 'Mazda', 'Nissan', 'Subaru', 'Mitsubishi', 'Suzuki', 'Dacia', 'Chevrolet', 'Dodge', 'Jeep', 'Cupra', 'DS', 'MAN', 'DAF', 'Scania', 'Iveco'];
    
    let parsed = { manufacturer: '', series: '', model: '', engine: '', ecu: '', readMethod: '', readType: '', rest: [] };
    let remaining = [...parts];
    
    // 1. Find manufacturer
    const mfIdx = remaining.findIndex(p => 
      manufacturers.some(m => m.toLowerCase() === p.toLowerCase())
    );
    if (mfIdx !== -1) {
      parsed.manufacturer = remaining.splice(mfIdx, 1)[0];
    }
    
    // 2. Find ECU (Bosch, EDC17, MED17, Siemens, Delphi, Continental etc.)
    const ecuStartPattern = /^(EDC|MED|PCR|MD1|MG1|SID|DCM|MEDC|Bosch|Siemens|Delphi|Continental|Marelli)/i;
    const ecuIdx = remaining.findIndex(p => ecuStartPattern.test(p));
    if (ecuIdx !== -1) {
      const ecuParts = remaining.splice(ecuIdx);
      // Separate reading method/type from ECU parts
      const readMethods = ['OBD', 'Bench', 'Boot'];
      const readTypes = ['VR', 'FR'];
      const cleanEcuParts = [];
      ecuParts.forEach(p => {
        const upper = p.toUpperCase();
        if (readMethods.includes(upper)) {
          parsed.readMethod = upper === 'OBD' ? 'OBD' : upper.charAt(0).toUpperCase() + upper.slice(1).toLowerCase();
        } else if (readTypes.includes(upper)) {
          parsed.readType = upper === 'VR' ? 'Virtuell' : 'Full Read';
        } else {
          cleanEcuParts.push(p);
        }
      });
      parsed.ecu = cleanEcuParts.join(' ');
    }
    
    // 3. Find year (4-digit number 1990-2030)
    let year = '';
    const yearIdx = remaining.findIndex(p => /^(19|20)\d{2}$/.test(p));
    if (yearIdx !== -1) {
      year = remaining.splice(yearIdx, 1)[0];
    }
    
    // 4. Find generation code in parentheses like (F5), (C7) or plain like F30, B8
    let genCode = '';
    const parenIdx = remaining.findIndex(p => /^\(.*\)$/.test(p));
    if (parenIdx !== -1) {
      genCode = remaining.splice(parenIdx, 1)[0].replace(/[()]/g, '');
    }
    
    // 5. Engine tokens: displacement, fuel type, norms, power
    const engineTokens = [];
    const enginePatterns = [
      /^\d+\.?\d*$/, // displacement: 2.0, 3.0
      /^(TDI|TSI|TFSI|CDI|HDI|JTD|CDTI|CRDi|CRDI|FSI|BlueHDI|EcoBoost|EcoBlue|dCi|JTDM|Turbo|Bi|CR|CRTD|BiTDI|BiTurbo)$/i,
      /^(EU\d|Euro\d)$/i, // emission norm
      /^\d{2,4}$/,  // power number (190, 218)
      /^(PS|hp|kW|bhp|pk)$/i, // power unit
      /^(N\d{2}|M\d{2,3}|EA\d{3}|OM\d{3}|B\d{2}|S\d{2})$/i, // engine codes
    ];
    
    remaining = remaining.filter(p => {
      if (enginePatterns.some(pattern => pattern.test(p))) {
        engineTokens.push(p);
        return false;
      }
      return true;
    });
    if (engineTokens.length > 0) {
      parsed.engine = engineTokens.join(' ');
    }
    
    // 6. First remaining = series (A5, A6, Golf, 3er etc.)
    if (remaining.length > 0) parsed.series = remaining.shift();
    
    // 7. If no genCode yet, check if next remaining looks like a gen code (B8, C7, F30, etc.)
    if (!genCode && remaining.length > 0) {
      const genPattern = /^[A-Z]\d{1,2}$/i;
      if (genPattern.test(remaining[0])) {
        genCode = remaining.shift();
      }
    }
    
    // 8. Build model from year + genCode
    if (year && genCode) {
      parsed.model = `${genCode} - ${year}`;
    } else if (genCode) {
      parsed.model = genCode;
    } else if (year) {
      parsed.model = year;
    }
    
    parsed.rest = remaining;
    
    const readableParts = [parsed.manufacturer, parsed.series, parsed.model, parsed.engine, parsed.ecu, ...parsed.rest].filter(Boolean);
    
    return {
      original: name,
      readable: readableParts.join(' '),
      parts: parsed,
    };
  }, [uploadedFiles]);

  const t = (key) => {
    const texts = {
      de: {
        pageTitle: 'Neuer Auftrag',
        stepTitle: 'File & Lesegerät',
        step: 'STEP',
        tuningTool: 'TUNING TOOL / LESEGERÄT',
        selectDevice: 'Lesegerät auswählen...',
        readingMethod: 'LESEMETHODE',
        readingType: 'LESEART',
        masterSlave: 'MASTER / SLAVE',
        priority: 'PRIORITÄT',
        comment: 'KOMMENTAR (OPTIONAL)',
        commentPlaceholder: 'Zusätzliche Hinweise, Wünsche oder Informationen...',
        dropFile: 'Datei hierher ziehen',
        orClick: 'oder klicken zum Auswählen',
        addressesMore: 'Adressen und mehr',
        nextStep: 'Weiter zu Schritt 2',
        prevStep: 'Zurück',
        fileAdded: 'Datei hinzugefügt',
        removeFile: 'Entfernen',
        // Step 2
        step2Title: 'Fahrzeugauswahl',
        uploadedFile: 'HOCHGELADENE DATEI',
        parsedAs: 'Erkannt als',
        manufacturer: 'HERSTELLER',
        manufacturerPlaceholder: 'Hersteller wählen...',
        series: 'BAUREIHE',
        seriesPlaceholder: 'Baureihe wählen...',
        vehicleModel: 'MODELL',
        vehicleModelPlaceholder: 'Modell wählen...',
        engine: 'MOTOR',
        enginePlaceholder: 'Motor wählen...',
        ecu: 'STEUERGERÄT',
        readMethodBadge: 'LESEMETHODE',
        readTypeBadge: 'LESEART',
        applyParsed: 'Übernehmen',
        nextStep3: 'Weiter zu Schritt 3',
      },
      en: {
        pageTitle: 'New Order',
        stepTitle: 'File & Reading Device',
        step: 'STEP',
        tuningTool: 'TUNING TOOL / READING DEVICE',
        selectDevice: 'Select reading device...',
        readingMethod: 'READING METHOD',
        readingType: 'READING TYPE',
        masterSlave: 'MASTER / SLAVE',
        priority: 'PRIORITY',
        comment: 'COMMENT (OPTIONAL)',
        commentPlaceholder: 'Additional notes, wishes or information...',
        dropFile: 'Drag file here',
        orClick: 'or click to select',
        addressesMore: 'Addresses and more',
        nextStep: 'Continue to Step 2',
        prevStep: 'Back',
        fileAdded: 'File added',
        removeFile: 'Remove',
        // Step 2
        step2Title: 'Vehicle Selection',
        uploadedFile: 'UPLOADED FILE',
        parsedAs: 'Detected as',
        manufacturer: 'MANUFACTURER',
        manufacturerPlaceholder: 'Select manufacturer...',
        series: 'SERIES',
        seriesPlaceholder: 'Select series...',
        vehicleModel: 'MODEL',
        vehicleModelPlaceholder: 'Select model...',
        engine: 'ENGINE',
        enginePlaceholder: 'Select engine...',
        ecu: 'ECU',
        readMethodBadge: 'METHOD',
        readTypeBadge: 'READ TYPE',
        applyParsed: 'Apply',
        nextStep3: 'Continue to Step 3',
      },
    };
    return texts[language]?.[key] || texts.de[key] || key;
  };

  const handleFileSelect = useCallback((files) => {
    const validFiles = Array.from(files).filter((file) => {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });
    if (validFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Apply parsed filename data to the cascade dropdowns
  const handleApplyParsed = useCallback(() => {
    if (!parsedFilename) return;
    const { manufacturer, series, model, engine } = parsedFilename.parts;
    
    // Fuzzy match helper: check if a string contains all keywords from search
    const fuzzyMatch = (haystack, needle) => {
      if (!needle) return false;
      const h = haystack.toLowerCase();
      const keywords = needle.toLowerCase().split(/\s+/);
      return keywords.every(kw => h.includes(kw));
    };
    
    // Match manufacturer
    const matchedMfr = allManufacturers.find(m => m.toLowerCase() === manufacturer.toLowerCase()) || '';
    
    let matchedSeries = '';
    let matchedModel = '';
    let matchedEngine = '';
    
    if (matchedMfr && vehicleData[matchedMfr]) {
      // Match series (e.g. "A6" matches "A6")
      const seriesKeys = Object.keys(vehicleData[matchedMfr]);
      matchedSeries = seriesKeys.find(s => s.toLowerCase() === series.toLowerCase()) || '';
      
      if (matchedSeries && vehicleData[matchedMfr][matchedSeries]) {
        // Match model fuzzy: parsed.model could be "F5 - 2016", DB has "F5 - 2016"
        const modelKeys = Object.keys(vehicleData[matchedMfr][matchedSeries]);
        matchedModel = modelKeys.find(m => {
          const mLower = m.toLowerCase().replace(/\s/g, '');
          const parsedModel = model.toLowerCase().replace(/\s/g, '');
          // Extract gen code and year from both
          const getGenYear = (str) => {
            const yearM = str.match(/(19|20)\d{2}/);
            const codeM = str.match(/([a-z]\d{1,2})/i);
            return { year: yearM?.[0] || '', code: codeM?.[1]?.toLowerCase() || '' };
          };
          const db = getGenYear(m);
          const parsed2 = getGenYear(model);
          // Match if gen code matches (or year matches)
          if (db.code && parsed2.code && db.code === parsed2.code) return true;
          if (db.year && parsed2.year && db.year === parsed2.year && db.code === parsed2.code) return true;
          return mLower.includes(parsedModel) || parsedModel.includes(mLower);
        }) || '';
        
        if (matchedModel) {
          // Match engine fuzzy: extract key parts (displacement + type) from parsed engine
          // e.g. "2 0 TDI EU6 190PS" -> look for entries containing "2.0 TDI" and "190"
          const engines = vehicleData[matchedMfr][matchedSeries][matchedModel];
          if (engine) {
            // Extract displacement (e.g. "2.0" or "3 0" -> "3.0")
            const dispMatch = engine.match(/(\d)[\s.]?(\d)/);
            const displacement = dispMatch ? `${dispMatch[1]}.${dispMatch[2]}` : '';
            // Extract fuel type (TDI, TSI, etc.)
            const fuelMatch = engine.match(/(TDI|TSI|TFSI|CDI|HDI|FSI|EcoBoost|EcoBlue|CDTI|CRDi|Turbo)/i);
            const fuel = fuelMatch ? fuelMatch[1] : '';
            // Extract power (190PS, 218PS, 190 hp, 190hp)
            const powerMatch = engine.match(/(\d{2,4})\s?(PS|hp|kW|bhp|pk)/i);
            const power = powerMatch ? powerMatch[1] : '';
            
            // Score all engines and pick the best match
            let bestScore = 0;
            let bestEngine = '';
            engines.forEach(e => {
              const eLower = e.toLowerCase();
              let score = 0;
              if (displacement && eLower.includes(displacement)) score++;
              if (fuel && eLower.includes(fuel.toLowerCase())) score++;
              if (power && eLower.includes(power)) score++;
              if (score > bestScore) {
                bestScore = score;
                bestEngine = e;
              }
            });
            if (bestScore >= 2) matchedEngine = bestEngine;
          }
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      manufacturer: matchedMfr,
      series: matchedSeries,
      vehicleModel: matchedModel,
      engine: matchedEngine,
    }));
  }, [parsedFilename]);

  const wizardSteps = [
    { id: 1, icon: Upload, label: language === 'de' ? 'File & Lesegerät' : 'File & Device' },
    { id: 2, icon: CarProfile, label: language === 'de' ? 'Fahrzeug' : 'Vehicle' },
    { id: 3, icon: Sliders, label: language === 'de' ? 'Optionen' : 'Options' },
    { id: 4, icon: CheckCircle, label: language === 'de' ? 'Übersicht' : 'Review' },
  ];
  const progress = (currentStep / wizardSteps.length) * 100;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Step Progress Indicator */}
        <Card className="bg-card border-border" data-testid="wizard-progress-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {wizardSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-sm flex items-center justify-center transition-colors duration-200",
                          isActive && "bg-primary text-white",
                          isCompleted && "bg-green-500/20 text-green-400 border border-green-500/30",
                          !isActive && !isCompleted && "bg-secondary text-muted-foreground"
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle weight="fill" className="w-6 h-6" />
                        ) : (
                          <Icon weight={isActive ? "fill" : "regular"} className="w-6 h-6" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs mt-2 font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.label}
                      </span>
                    </div>
                    {index < wizardSteps.length - 1 && (
                      <div className={cn(
                        "h-0.5 w-16 md:w-24 mx-2",
                        isCompleted ? "bg-green-500/50" : "bg-border"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
            <Progress value={progress} className="h-1" />
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight">
              {currentStep === 1 ? t('stepTitle') : t('step2Title')}
            </h1>
            <div className="w-10 h-1 bg-green-500 rounded-full mt-2" />
          </div>
          <span className="text-primary font-heading font-bold text-sm tracking-widest" data-testid="step-indicator">
            {t('step')} {String(currentStep).padStart(2, '0')}
          </span>
        </div>

        {/* ====== STEP 1: File & Lesegerät ====== */}
        {currentStep === 1 && (<>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form Fields */}
          <Card className="bg-card border-border" data-testid="wizard-form-card">
            <CardContent className="p-6 space-y-7">
              {/* Tuning Tool / Lesegerät */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <Wrench weight="bold" className="w-3.5 h-3.5" />
                  {t('tuningTool')}
                </label>
                <Select
                  value={formData.readingDevice}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, readingDevice: val }))}
                >
                  <SelectTrigger
                    className="w-full h-12 bg-secondary/50 border-border text-sm"
                    data-testid="reading-device-select"
                  >
                    <SelectValue placeholder={t('selectDevice')}>
                      {formData.readingDevice && (() => {
                        const selected = readingDevices.find((e) =>
                          e.group
                            ? e.options.some((o) => `${e.group} - ${o}` === formData.readingDevice)
                            : e.options.includes(formData.readingDevice)
                        );
                        const logo = selected?.logo;
                        const label = formData.readingDevice.includes(' - ')
                          ? formData.readingDevice.split(' - ')[1]
                          : formData.readingDevice;
                        return (
                          <span className="flex items-center gap-2.5">
                            {logo && <img src={logo} alt="" className="h-4 w-16 object-contain object-left" />}
                            {label}
                          </span>
                        );
                      })()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {readingDevices.map((entry, idx) =>
                      entry.group ? (
                        <SelectGroup key={idx}>
                          {idx > 0 && <div className="h-px bg-border mx-2 my-1.5" />}
                          <SelectLabel className="flex items-center gap-2.5 text-muted-foreground font-semibold text-xs uppercase tracking-wider py-2">
                            {entry.logo ? (
                              <img src={entry.logo} alt={entry.group} className="h-4 w-16 object-contain object-left" />
                            ) : (
                              entry.group
                            )}
                          </SelectLabel>
                          {entry.options.map((opt) => (
                            <SelectItem key={opt} value={`${entry.group} - ${opt}`}>
                              {opt}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      ) : (
                        <div key={idx}>
                          {idx > 0 && <div className="h-px bg-border mx-2 my-1.5" />}
                          {entry.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              <span className="flex items-center gap-2.5">
                                {entry.logo ? (
                                  <img src={entry.logo} alt="" className="h-4 w-16 object-contain object-left" />
                                ) : (
                                  opt
                                )}
                              </span>
                            </SelectItem>
                          ))}
                        </div>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Lesemethode */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <PlugsConnected weight="bold" className="w-3.5 h-3.5" />
                  {t('readingMethod')}
                </label>
                <div className="flex gap-2" data-testid="reading-method-group">
                  {[
                    { label: 'OBD', icon: '/logos/obd.svg' },
                    { label: 'Bench', icon: '/logos/bench.svg' },
                    { label: 'Boot', icon: '/logos/boot.svg' },
                  ].map((method) => (
                    <ToggleOption
                      key={method.label}
                      label={method.label}
                      icon={method.icon}
                      selected={formData.readingMethod === method.label}
                      onClick={() => setFormData((prev) => ({ ...prev, readingMethod: method.label }))}
                      testId={`method-${method.label.toLowerCase()}`}
                    />
                  ))}
                </div>
              </div>

              {/* Leseart */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <BookOpen weight="bold" className="w-3.5 h-3.5" />
                  {t('readingType')}
                </label>
                <div className="flex gap-2" data-testid="reading-type-group">
                  {[
                    { label: 'Full Read', Icon: HardDrives },
                    { label: 'Virtuell', Icon: CloudArrowDown },
                  ].map((type) => (
                    <ToggleOption
                      key={type.label}
                      label={type.label}
                      IconComponent={type.Icon}
                      selected={formData.readingType === type.label}
                      onClick={() => setFormData((prev) => ({ ...prev, readingType: type.label }))}
                      testId={`type-${type.label.toLowerCase().replace(' ', '-')}`}
                    />
                  ))}
                </div>
              </div>

              {/* Master / Slave */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <CircleHalf weight="bold" className="w-3.5 h-3.5" />
                  {t('masterSlave')}
                </label>
                <div className="flex gap-2" data-testid="master-slave-group">
                  {[
                    { label: 'Master', Icon: Crown },
                    { label: 'Slave', Icon: Link },
                  ].map((ms) => (
                    <ToggleOption
                      key={ms.label}
                      label={ms.label}
                      IconComponent={ms.Icon}
                      selected={formData.masterSlave === ms.label}
                      onClick={() => setFormData((prev) => ({ ...prev, masterSlave: ms.label }))}
                      testId={`ms-${ms.label.toLowerCase()}`}
                    />
                  ))}
                </div>
              </div>

              {/* Priorität */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                  <Timer weight="bold" className="w-3.5 h-3.5" />
                  {t('priority')}
                </label>
                <div className="flex gap-2" data-testid="priority-group">
                  <ToggleOption
                    label="Normal"
                    selected={formData.priority === 'Normal'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Normal' }))}
                    testId="priority-normal"
                  />
                  <ToggleOption
                    label="Express"
                    extra="+49€"
                    selected={formData.priority === 'Express'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Express' }))}
                    testId="priority-express"
                  />
                  <ToggleOption
                    label="Sofort"
                    extra="+99€"
                    selected={formData.priority === 'Sofort'}
                    onClick={() => setFormData((prev) => ({ ...prev, priority: 'Sofort' }))}
                    testId="priority-sofort"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column - File Upload */}
          <Card className="bg-card border-border" data-testid="wizard-upload-card">
            <CardContent className="p-6 h-full flex flex-col">
              {/* Uploaded files list */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-secondary/50 border border-border rounded-sm"
                      data-testid={`uploaded-file-${index}`}
                    >
                      <div className="flex items-center gap-2">
                        <FileIcon weight="fill" className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground font-medium truncate max-w-[200px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`remove-file-${index}`}
                      >
                        <X weight="bold" className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Drag & Drop Zone */}
              <div
                className={cn(
                  "flex-1 min-h-[280px] border-2 border-dashed rounded-sm flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/50"
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                data-testid="file-drop-zone"
              >
                <CloudArrowUp
                  weight="thin"
                  className={cn(
                    "w-14 h-14 transition-colors",
                    isDragOver ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <div className="text-center">
                  <p className="font-heading font-semibold text-foreground">
                    {t('dropFile')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('orClick')}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground tracking-wide">
                  {ALLOWED_EXTENSIONS.join(' ')}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_EXTENSIONS.join(',')}
                  multiple
                  onChange={(e) => {
                    handleFileSelect(e.target.files);
                    e.target.value = '';
                  }}
                  data-testid="file-input"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comment Section (Full Width) */}
        <Card className="bg-card border-border" data-testid="wizard-comment-card">
          <CardContent className="p-6">
            <label className="block text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
              {t('comment')}
            </label>
            <Textarea
              value={formData.comment}
              onChange={(e) => setFormData((prev) => ({ ...prev, comment: e.target.value }))}
              placeholder={t('commentPlaceholder')}
              className="min-h-[120px] bg-secondary/30 border-border resize-y"
              data-testid="comment-textarea"
            />
          </CardContent>
        </Card>

        {/* Step 1 Navigation */}
        <div className="flex justify-end">
          <Button
            className="btn-gradient text-white font-semibold px-8 py-3 h-auto"
            data-testid="wizard-next-btn"
            onClick={() => setCurrentStep(2)}
          >
            {t('nextStep')}
            <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
          </Button>
        </div>
        </>)}

        {/* ====== STEP 2: Fahrzeugauswahl ====== */}
        {currentStep === 2 && (<>
          {/* Filename Display with parsed badges */}
          {parsedFilename && (
            <Card className="bg-card border-border" data-testid="filename-display-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                  <FileIcon weight="bold" className="w-3.5 h-3.5" />
                  {t('uploadedFile')}
                </label>
                <div className="flex items-center gap-3 bg-secondary/50 border border-border rounded-sm px-4 py-3 mb-4">
                  <FileIcon weight="fill" className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-mono text-foreground truncate">{parsedFilename.original}</p>
                    {parsedFilename.readable && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {t('parsedAs')}: <span className="text-foreground font-medium">{parsedFilename.readable}</span>
                      </p>
                    )}
                  </div>
                </div>
                {/* Parsed badges + Übernehmen button */}
                <div className="flex flex-wrap items-center gap-3">
                  {parsedFilename.parts.manufacturer && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-sm px-4 py-2">
                      <Car weight="bold" className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('manufacturer')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.manufacturer}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.series && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <Tag weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('series')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.series}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.model && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <Calendar weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('vehicleModel')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.model}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.engine && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <Engine weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('engine')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.engine}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.ecu && (
                    <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-sm px-4 py-2">
                      <GasPump weight="bold" className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('ecu')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.ecu}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.readMethod && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <PlugsConnected weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('readMethodBadge')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.readMethod}</p>
                      </div>
                    </div>
                  )}
                  {parsedFilename.parts.readType && (
                    <div className="flex items-center gap-2 bg-secondary/80 border border-border rounded-sm px-4 py-2">
                      <BookOpen weight="bold" className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('readTypeBadge')}</p>
                        <p className="text-sm font-semibold text-foreground">{parsedFilename.parts.readType}</p>
                      </div>
                    </div>
                  )}
                  {/* Übernehmen Button */}
                  <Button
                    onClick={handleApplyParsed}
                    className="btn-gradient text-white font-semibold px-5 py-2 h-auto ml-auto"
                    data-testid="apply-parsed-btn"
                  >
                    <ArrowRight weight="bold" className="w-4 h-4 mr-1.5" />
                    {t('applyParsed')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cascade Vehicle Selection */}
          <Card className="bg-card border-border" data-testid="vehicle-cascade-card">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Hersteller */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Car weight="bold" className="w-3.5 h-3.5" />
                    {t('manufacturer')}
                  </label>
                  <Select
                    value={formData.manufacturer}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, manufacturer: val, series: '', vehicleModel: '', engine: '' }))}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/50 border-border text-sm" data-testid="select-manufacturer">
                      <SelectValue placeholder={t('manufacturerPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {allManufacturers.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 2. Baureihe */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Tag weight="bold" className="w-3.5 h-3.5" />
                    {t('series')}
                  </label>
                  <Select
                    value={formData.series}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, series: val, vehicleModel: '', engine: '' }))}
                    disabled={!formData.manufacturer}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/50 border-border text-sm" data-testid="select-series">
                      <SelectValue placeholder={formData.manufacturer ? t('seriesPlaceholder') : '—'} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {formData.manufacturer && vehicleData[formData.manufacturer] &&
                        Object.keys(vehicleData[formData.manufacturer]).map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* 3. Modell */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Calendar weight="bold" className="w-3.5 h-3.5" />
                    {t('vehicleModel')}
                  </label>
                  <Select
                    value={formData.vehicleModel}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, vehicleModel: val, engine: '' }))}
                    disabled={!formData.series}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/50 border-border text-sm" data-testid="select-model">
                      <SelectValue placeholder={formData.series ? t('vehicleModelPlaceholder') : '—'} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {formData.manufacturer && formData.series && vehicleData[formData.manufacturer]?.[formData.series] &&
                        Object.keys(vehicleData[formData.manufacturer][formData.series]).map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {/* 4. Motor */}
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Engine weight="bold" className="w-3.5 h-3.5" />
                    {t('engine')}
                  </label>
                  <Select
                    value={formData.engine}
                    onValueChange={(val) => setFormData(prev => ({ ...prev, engine: val }))}
                    disabled={!formData.vehicleModel}
                  >
                    <SelectTrigger className="w-full h-12 bg-secondary/50 border-border text-sm" data-testid="select-engine">
                      <SelectValue placeholder={formData.vehicleModel ? t('enginePlaceholder') : '—'} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {formData.manufacturer && formData.series && formData.vehicleModel &&
                        vehicleData[formData.manufacturer]?.[formData.series]?.[formData.vehicleModel]?.map((e) => (
                          <SelectItem key={e} value={e}>{e}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              className="border-border hover:bg-secondary font-semibold px-6 py-3 h-auto"
              onClick={() => setCurrentStep(1)}
              data-testid="wizard-prev-btn"
            >
              <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
              {t('prevStep')}
            </Button>
            <Button
              className="btn-gradient text-white font-semibold px-8 py-3 h-auto"
              data-testid="wizard-next-btn-step2"
            >
              {t('nextStep3')}
              <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </>)}

      </div>
    </DashboardLayout>
  );
}
