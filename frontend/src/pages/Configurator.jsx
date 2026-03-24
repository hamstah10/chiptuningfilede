import { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  CarProfile,
  Truck,
  Motorcycle,
  Tractor,
  Boat,
  DotsThree,
  Lightning,
  Fire,
  Leaf,
  Gear,
  Sliders,
  Engine,
  Drop,
  Fan,
  Gauge,
  Warning,
  Power,
  RocketLaunch,
  Prohibit,
  Thermometer,
  CheckCircle,
  Cpu,
  Wrench,
  ArrowLeft,
  CaretRight,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Vehicle Database (shared with FileWizard) ─────────────────────────────
const vehicleData = {
  'Audi': {
    'A1': { '8X - 2010': ['1.0 TFSI - 95 PS', '1.4 TFSI - 125 PS', '1.4 TDI - 90 PS', '1.6 TDI - 105 PS', '1.8 TFSI - 192 PS', '2.0 TDI - 143 PS'], 'GB - 2018': ['1.0 TFSI - 116 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 116 PS', '2.0 TFSI - 207 PS'] },
    'A3': { '8P - 2003': ['1.6 TDI - 105 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.2 V6 - 250 PS'], '8V - 2012': ['1.0 TFSI - 116 PS', '1.4 TFSI - 125 PS', '1.4 TFSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 310 PS (RS3)'], '8Y - 2020': ['1.0 TFSI - 110 PS', '1.5 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TFSI - 310 PS (RS3)', '2.5 TFSI - 400 PS (RS3)'] },
    'A4': { 'B7 - 2004': ['1.8 T - 163 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TFSI - 200 PS', '3.0 TDI - 204 PS', '4.2 FSI - 344 PS (RS4)'], 'B8 - 2008': ['1.8 TFSI - 120 PS', '1.8 TFSI - 160 PS', '2.0 TDI - 143 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 245 PS', '3.2 FSI - 265 PS'], 'B9 - 2015': ['1.4 TFSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 218 PS', '3.0 TDI - 272 PS', '2.9 TFSI - 450 PS (RS4)'] },
    'A5': { '8T - 2007': ['2.0 TDI - 143 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 204 PS', '3.0 TDI - 245 PS', '3.2 FSI - 265 PS', '4.2 FSI - 450 PS (RS5)'], 'F5 - 2016': ['2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 218 PS', '3.0 TDI - 286 PS', '2.9 TFSI - 450 PS (RS5)'] },
    'A6': { 'C6 - 2004': ['2.0 TDI - 140 PS', '2.7 TDI - 180 PS', '3.0 TDI - 225 PS', '3.0 TDI - 233 PS', '2.0 TFSI - 170 PS', '4.2 FSI - 350 PS', '5.0 V10 - 580 PS (RS6)'], 'C7 - 2011': ['2.0 TDI - 177 PS', '2.0 TFSI - 180 PS', '3.0 TDI - 204 PS', '3.0 TDI EU6 - 218 PS', '3.0 TDI - 272 PS', '3.0 TDI - 326 PS', '3.0 TFSI - 310 PS', '4.0 TFSI - 560 PS (RS6)'], 'C8 - 2018': ['2.0 TDI - 163 PS', '2.0 TDI - 204 PS', '3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '2.0 TFSI - 245 PS', '3.0 TFSI - 340 PS', '4.0 TFSI - 600 PS (RS6)'] },
    'Q5': { '8R - 2008': ['2.0 TDI - 143 PS', '2.0 TDI - 170 PS', '2.0 TDI - 177 PS', '2.0 TFSI - 180 PS', '2.0 TFSI - 211 PS', '3.0 TDI - 240 PS', '3.0 TDI - 258 PS'], 'FY - 2017': ['2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TFSI - 190 PS', '2.0 TFSI - 252 PS', '3.0 TDI - 286 PS', '2.9 TFSI - 381 PS (SQ5)'] },
    'Q7': { '4L - 2006': ['3.0 TDI - 204 PS', '3.0 TDI - 233 PS', '3.0 TDI - 240 PS', '4.2 TDI - 326 PS', '4.2 FSI - 350 PS', '6.0 TDI V12 - 500 PS'], '4M - 2015': ['3.0 TDI - 218 PS', '3.0 TDI - 272 PS', '2.0 TFSI - 252 PS', '3.0 TFSI - 340 PS', '4.0 TDI - 435 PS (SQ7)'] },
  },
  'BMW': {
    '1er': { 'E87 - 2004': ['116i - 115 PS', '118d - 143 PS', '120d - 163 PS', '120d - 177 PS', '123d - 204 PS', '130i - 265 PS'], 'F20 - 2011': ['114d - 95 PS', '116d - 116 PS', '118d - 143 PS', '118d - 150 PS', '120d - 184 PS', '120d - 190 PS', '125d - 218 PS', '125i - 218 PS', 'M135i - 326 PS'], 'F40 - 2019': ['116d - 116 PS', '118d - 150 PS', '118i - 140 PS', '120d - 190 PS', '128ti - 265 PS', 'M135i - 306 PS'] },
    '3er': { 'E90 - 2005': ['318d - 143 PS', '320d - 163 PS', '320d - 177 PS', '325d - 197 PS', '330d - 231 PS', '330d - 245 PS', '335d - 286 PS', '320i - 150 PS', '325i - 218 PS', '335i - 306 PS'], 'F30 - 2012': ['316d - 116 PS', '318d - 143 PS', '318d - 150 PS', '320d - 163 PS', '320d - 184 PS', '320d - 190 PS', '325d - 218 PS', '330d - 258 PS', '335d - 313 PS', '320i - 184 PS', '328i - 245 PS', '335i - 306 PS', '340i - 326 PS'], 'G20 - 2019': ['318d - 150 PS', '320d - 190 PS', '330d - 286 PS', '330e - 292 PS', '320i - 184 PS', '330i - 258 PS', 'M340i - 374 PS', 'M3 - 480 PS', 'M3 Competition - 510 PS'] },
    '5er': { 'E60 - 2003': ['520d - 163 PS', '520d - 177 PS', '525d - 197 PS', '530d - 218 PS', '530d - 231 PS', '530d - 245 PS', '535d - 272 PS', '535d - 286 PS', '525i - 218 PS', '530i - 258 PS', '550i - 367 PS', 'M5 - 507 PS'], 'F10 - 2010': ['518d - 143 PS', '520d - 184 PS', '520d - 190 PS', '525d - 218 PS', '530d - 258 PS', '535d - 313 PS', '520i - 184 PS', '528i - 245 PS', '535i - 306 PS', '550i - 449 PS', 'M5 - 560 PS'], 'G30 - 2017': ['518d - 150 PS', '520d - 190 PS', '530d - 265 PS', '530d - 286 PS', '540d - 320 PS', '520i - 184 PS', '530i - 252 PS', '540i - 340 PS', 'M550i - 462 PS', 'M5 - 600 PS'] },
    'X3': { 'F25 - 2010': ['sDrive18d - 143 PS', 'xDrive20d - 184 PS', 'xDrive20d - 190 PS', 'xDrive30d - 258 PS', 'xDrive35d - 313 PS', 'xDrive20i - 184 PS', 'xDrive28i - 245 PS', 'xDrive35i - 306 PS'], 'G01 - 2017': ['xDrive20d - 190 PS', 'xDrive30d - 265 PS', 'xDrive20i - 184 PS', 'xDrive30i - 252 PS', 'M40i - 360 PS', 'M Competition - 510 PS'] },
    'X5': { 'E70 - 2006': ['xDrive30d - 235 PS', 'xDrive30d - 245 PS', 'xDrive40d - 306 PS', 'xDrive50i - 407 PS', 'M50d - 381 PS', 'M - 555 PS'], 'F15 - 2013': ['sDrive25d - 218 PS', 'xDrive25d - 218 PS', 'xDrive30d - 258 PS', 'xDrive40d - 313 PS', 'M50d - 381 PS', 'xDrive35i - 306 PS', 'xDrive50i - 449 PS', 'M - 575 PS'], 'G05 - 2018': ['xDrive25d - 231 PS', 'xDrive30d - 265 PS', 'xDrive40d - 340 PS', 'M50d - 400 PS', 'xDrive40i - 340 PS', 'M50i - 530 PS', 'M Competition - 625 PS'] },
  },
  'VW': {
    'Golf': { 'Golf 6 - 2008': ['1.2 TSI - 105 PS', '1.4 TSI - 122 PS', '1.4 TSI - 160 PS', '1.6 TDI - 105 PS', '2.0 TDI - 110 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TSI GTI - 210 PS', '2.0 TSI R - 270 PS'], 'Golf 7 - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 105 PS', '1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI GTI - 230 PS', '2.0 TSI GTI TCR - 290 PS', '2.0 TSI R - 300 PS', '2.0 TSI R - 310 PS'], 'Golf 8 - 2019': ['1.0 TSI - 110 PS', '1.5 TSI - 130 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TSI GTI - 245 PS', '2.0 TSI GTI Clubsport - 300 PS', '2.0 TSI R - 320 PS'] },
    'Passat': { 'B7 - 2010': ['1.4 TSI - 122 PS', '1.8 TSI - 160 PS', '2.0 TDI - 140 PS', '2.0 TDI - 170 PS', '2.0 TSI - 210 PS'], 'B8 - 2014': ['1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '1.6 TDI - 120 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TDI - 240 PS (Bi-TDI)', '2.0 TSI - 190 PS', '2.0 TSI - 272 PS'] },
    'Tiguan': { 'AD - 2016': ['1.4 TSI - 125 PS', '1.4 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TDI - 240 PS', '2.0 TSI - 180 PS', '2.0 TSI - 190 PS', '2.0 TSI - 230 PS', '2.0 TSI R - 320 PS'] },
    'T-Roc': { 'A11 - 2017': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TSI - 190 PS', '2.0 TSI R - 300 PS'] },
    'Touareg': { 'CR - 2018': ['3.0 TDI - 231 PS', '3.0 TDI - 286 PS', '3.0 TSI - 340 PS', '4.0 TDI - 422 PS'] },
  },
  'Mercedes': {
    'A-Klasse': { 'W176 - 2012': ['A160 CDI - 90 PS', 'A180 CDI - 109 PS', 'A200 CDI - 136 PS', 'A220 CDI - 177 PS', 'A180 - 122 PS', 'A200 - 156 PS', 'A250 - 211 PS', 'A45 AMG - 360 PS', 'A45 AMG - 381 PS'], 'W177 - 2018': ['A160d - 95 PS', 'A180d - 116 PS', 'A200d - 150 PS', 'A220d - 190 PS', 'A180 - 136 PS', 'A200 - 163 PS', 'A250 - 224 PS', 'A35 AMG - 306 PS', 'A45 AMG - 387 PS', 'A45 S AMG - 421 PS'] },
    'C-Klasse': { 'W204 - 2007': ['C180 CDI - 120 PS', 'C200 CDI - 136 PS', 'C220 CDI - 170 PS', 'C250 CDI - 204 PS', 'C350 CDI - 265 PS', 'C180 - 156 PS', 'C200 - 184 PS', 'C250 - 204 PS', 'C350 - 306 PS', 'C63 AMG - 457 PS'], 'W205 - 2014': ['C180d - 116 PS', 'C200d - 160 PS', 'C220d - 170 PS', 'C250d - 204 PS', 'C300d - 245 PS', 'C180 - 156 PS', 'C200 - 184 PS', 'C300 - 245 PS', 'C43 AMG - 367 PS', 'C43 AMG - 390 PS', 'C63 AMG - 476 PS', 'C63 S AMG - 510 PS'], 'W206 - 2021': ['C200d - 163 PS', 'C220d - 200 PS', 'C300d - 265 PS', 'C200 - 204 PS', 'C300 - 258 PS', 'C43 AMG - 408 PS', 'C63 S AMG E - 680 PS'] },
    'E-Klasse': { 'W212 - 2009': ['E200 CDI - 136 PS', 'E220 CDI - 170 PS', 'E250 CDI - 204 PS', 'E300 CDI - 231 PS', 'E350 CDI - 265 PS', 'E200 - 184 PS', 'E300 - 252 PS', 'E400 - 333 PS', 'E63 AMG - 557 PS', 'E63 S AMG - 585 PS'], 'W213 - 2016': ['E200d - 150 PS', 'E220d - 194 PS', 'E300d - 245 PS', 'E350d - 286 PS', 'E400d - 340 PS', 'E200 - 184 PS', 'E300 - 245 PS', 'E450 - 367 PS', 'E53 AMG - 435 PS', 'E63 AMG - 571 PS', 'E63 S AMG - 612 PS'] },
    'GLC': { 'X253 - 2015': ['GLC 200d - 163 PS', 'GLC 220d - 170 PS', 'GLC 250d - 204 PS', 'GLC 300d - 245 PS', 'GLC 200 - 184 PS', 'GLC 300 - 245 PS', 'GLC 43 AMG - 367 PS', 'GLC 63 AMG - 476 PS', 'GLC 63 S AMG - 510 PS'] },
  },
  'Seat': {
    'Leon': { '5F - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 110 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI Cupra - 280 PS', '2.0 TSI Cupra - 290 PS', '2.0 TSI Cupra R - 310 PS'], 'KL - 2020': ['1.0 TSI - 110 PS', '1.5 TSI - 130 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS'] },
    'Ateca': { 'KH - 2016': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TSI - 190 PS', '2.0 TSI Cupra - 300 PS'] },
  },
  'Skoda': {
    'Octavia': { '5E - 2012': ['1.0 TSI - 110 PS', '1.2 TSI - 110 PS', '1.4 TSI - 150 PS', '1.6 TDI - 110 PS', '2.0 TDI - 150 PS', '2.0 TDI - 184 PS', '2.0 TSI RS - 230 PS', '2.0 TSI RS - 245 PS'], 'NX - 2020': ['1.0 TSI - 110 PS', '1.5 TSI - 150 PS', '2.0 TDI - 115 PS', '2.0 TDI - 150 PS', '2.0 TDI - 200 PS', '2.0 TSI RS - 245 PS'] },
    'Superb': { '3V - 2015': ['1.4 TSI - 150 PS', '1.5 TSI - 150 PS', '2.0 TDI - 150 PS', '2.0 TDI - 190 PS', '2.0 TSI - 272 PS', '2.0 TSI - 280 PS'] },
  },
  'Opel': {
    'Astra': { 'J - 2009': ['1.4 Turbo - 120 PS', '1.4 Turbo - 140 PS', '1.6 CDTI - 110 PS', '1.6 CDTI - 136 PS', '2.0 CDTI - 165 PS', '2.0 Turbo OPC - 280 PS'], 'K - 2015': ['1.0 Turbo - 105 PS', '1.2 Turbo - 130 PS', '1.4 Turbo - 150 PS', '1.6 CDTI - 110 PS', '1.6 CDTI - 136 PS', '1.6 CDTI - 160 PS', '1.6 Turbo - 200 PS'] },
    'Insignia': { 'B - 2017': ['1.5 Turbo - 140 PS', '1.5 Turbo - 165 PS', '2.0 CDTI - 170 PS', '2.0 CDTI - 210 PS', '2.0 Turbo - 260 PS', '2.0 Turbo GSi - 230 PS'] },
  },
  'Ford': {
    'Focus': { 'MK3 - 2011': ['1.0 EcoBoost - 100 PS', '1.0 EcoBoost - 125 PS', '1.5 EcoBoost - 150 PS', '1.5 TDCi - 95 PS', '1.5 TDCi - 120 PS', '2.0 TDCi - 150 PS', '2.3 EcoBoost RS - 350 PS', '2.3 EcoBoost ST - 280 PS'], 'MK4 - 2018': ['1.0 EcoBoost - 100 PS', '1.0 EcoBoost - 125 PS', '1.0 EcoBoost - 155 PS', '1.5 EcoBlue - 120 PS', '1.5 EcoBoost - 150 PS', '1.5 EcoBoost - 182 PS', '2.0 EcoBlue - 150 PS', '2.3 EcoBoost ST - 280 PS'] },
    'Kuga': { 'MK3 - 2019': ['1.5 EcoBlue - 120 PS', '1.5 EcoBoost - 150 PS', '2.0 EcoBlue - 150 PS', '2.0 EcoBlue - 190 PS', '2.5 PHEV - 225 PS'] },
  },
  'Porsche': {
    'Cayenne': { '92A - 2010': ['Diesel - 245 PS', 'S Diesel - 382 PS', 'S - 400 PS', 'S - 420 PS', 'GTS - 440 PS', 'Turbo - 500 PS', 'Turbo S - 570 PS'], 'E3 - 2017': ['3.0 V6 - 340 PS', 'S 2.9 V6 - 440 PS', 'GTS 4.0 V8 - 460 PS', 'Turbo 4.0 V8 - 550 PS', 'Turbo S E-Hybrid - 680 PS'] },
    'Macan': { '95B - 2014': ['2.0 TFSI - 237 PS', '2.0 TFSI - 252 PS', 'S 3.0 V6 - 340 PS', 'S 3.0 V6 - 354 PS', 'GTS 2.9 V6 - 380 PS', 'Turbo 3.6 V6 - 400 PS'] },
    '911': { '991 - 2011': ['Carrera 3.4 - 350 PS', 'Carrera S 3.8 - 400 PS', 'Carrera 3.0T - 370 PS', 'Carrera S 3.0T - 420 PS', 'GTS 3.0T - 450 PS', 'Turbo 3.8T - 540 PS', 'Turbo S 3.8T - 580 PS', 'GT3 4.0 - 500 PS'], '992 - 2019': ['Carrera 3.0T - 385 PS', 'Carrera S 3.0T - 450 PS', 'GTS 3.0T - 480 PS', 'Turbo 3.7T - 580 PS', 'Turbo S 3.7T - 650 PS', 'GT3 4.0 - 510 PS'] },
  },
};

// ─── ECU Database ──────────────────────────────────────────────────────────
const ecuData = {
  'Audi': { 'TDI': ['Bosch EDC17CP14', 'Bosch EDC17CP20', 'Bosch EDC17CP44'], 'TSI': ['Bosch MED17.5', 'Bosch MG1CS011', 'Continental Simos 18.1'], 'TFSI': ['Bosch MED17.1', 'Bosch MG1CS002', 'Continental Simos 18.10'], 'default': ['Bosch EDC17CP14', 'Bosch MED17.1'] },
  'BMW': { 'd': ['Bosch EDC17C50', 'Bosch EDC17CP45', 'Bosch MD1CP002'], 'i': ['Bosch MEVD17.2', 'Bosch MG1CS003', 'Continental MSD80'], 'M': ['Bosch MEVD17.2', 'Bosch MG1CS201'], 'default': ['Bosch EDC17C50', 'Bosch MEVD17.2'] },
  'VW': { 'TDI': ['Bosch EDC17CP14', 'Bosch EDC17C46', 'Bosch MD1CP004'], 'TSI': ['Bosch MED17.5', 'Continental Simos 18.1', 'Continental Simos 19.6'], 'default': ['Bosch EDC17CP14', 'Continental Simos 18.1'] },
  'Mercedes': { 'CDI': ['Bosch EDC17CP46', 'Bosch EDC17CP57', 'Bosch MD1CP001'], 'd': ['Bosch EDC17CP46', 'Bosch MD1CP001'], 'AMG': ['Bosch MED17.7.2', 'Bosch MG1CP002'], 'default': ['Bosch EDC17CP46', 'Bosch MED17.7.2'] },
  'Seat': { 'TDI': ['Bosch EDC17CP14', 'Bosch EDC17C46'], 'TSI': ['Bosch MED17.5', 'Continental Simos 18.1'], 'default': ['Bosch EDC17CP14', 'Continental Simos 18.1'] },
  'Skoda': { 'TDI': ['Bosch EDC17CP14', 'Bosch EDC17C46'], 'TSI': ['Bosch MED17.5', 'Continental Simos 18.1'], 'default': ['Bosch EDC17CP14', 'Continental Simos 18.1'] },
  'Opel': { 'CDTI': ['Bosch EDC17C18', 'Delphi DCM3.7'], 'Turbo': ['Bosch ME17.9', 'Delco E80'], 'default': ['Bosch EDC17C18', 'Delco E80'] },
  'Ford': { 'TDCi': ['Bosch EDC17C10', 'Continental SID807'], 'EcoBoost': ['Bosch MED17.0', 'Continental EMS2510'], 'EcoBlue': ['Bosch EDC17C70', 'Bosch MD1CS005'], 'default': ['Bosch EDC17C10', 'Continental SID807'] },
  'Porsche': { 'default': ['Bosch MED17.1.1', 'Bosch MG1CP007', 'Continental SDI10'] },
};

function getEcuOptions(manufacturer, engine) {
  if (!manufacturer || !ecuData[manufacturer]) return [];
  const mfrEcus = ecuData[manufacturer];
  const fuelTypes = Object.keys(mfrEcus).filter(k => k !== 'default');
  const el = (engine || '').toLowerCase();
  for (const ft of fuelTypes) { if (el.includes(ft.toLowerCase())) return mfrEcus[ft]; }
  return mfrEcus['default'] || [];
}

// ─── Performance calculation ───────────────────────────────────────────────
function getPerformanceData(engine) {
  if (!engine) return null;
  const psMatch = engine.match(/(\d{2,4})\s*PS/);
  if (!psMatch) return null;
  const originalPs = parseInt(psMatch[1]);
  const isDiesel = /TDI|CDI|CDTI|HDI|CRDi|EcoBlue|TDCi|d\b/i.test(engine);
  const torqueMultiplier = isDiesel ? 2.0 : 1.35;
  const originalNm = Math.round(originalPs * torqueMultiplier);
  const stage1Ps = Math.round(originalPs * (1 + (isDiesel ? 0.25 : 0.22)));
  const stage1Nm = Math.round(originalNm * (1 + (isDiesel ? 0.30 : 0.25)));
  const stage2Ps = Math.round(originalPs * (1 + (isDiesel ? 0.40 : 0.35)));
  const stage2Nm = Math.round(originalNm * (1 + (isDiesel ? 0.45 : 0.38)));
  const maxRpm = isDiesel ? 5200 : 7200;
  const peakPsRpm = isDiesel ? 3800 : 5800;
  const peakNmRpm = isDiesel ? 2000 : 3500;
  const curve = (rpm, peak, pr, rise) => {
    const x = rpm / pr;
    return x <= 1 ? peak * (1 - Math.pow(1 - x, rise)) : peak * (1 - 0.25 * Math.pow((rpm - pr) / (maxRpm - pr), 1.5));
  };
  const curveData = [];
  for (let i = 0; i <= 20; i++) {
    const rpm = Math.round(800 + (maxRpm - 800) * (i / 20));
    curveData.push({
      rpm, rpmLabel: rpm >= 1000 ? `${(rpm / 1000).toFixed(1)}k` : String(rpm),
      seriePs: Math.round(curve(rpm, originalPs, peakPsRpm, 1.8)),
      stage1Ps: Math.round(curve(rpm, stage1Ps, peakPsRpm * 0.97, 1.8)),
      stage2Ps: Math.round(curve(rpm, stage2Ps, peakPsRpm * 0.95, 1.8)),
      serieNm: Math.round(curve(rpm, originalNm, peakNmRpm, 2.2)),
      stage1Nm: Math.round(curve(rpm, stage1Nm, peakNmRpm * 0.95, 2.2)),
      stage2Nm: Math.round(curve(rpm, stage2Nm, peakNmRpm * 0.92, 2.2)),
    });
  }
  return { originalPs, originalNm, stage1Ps, stage1Nm, stage2Ps, stage2Nm, isDiesel, curveData, psGainS1: stage1Ps - originalPs, psGainS2: stage2Ps - originalPs, nmGainS1: stage1Nm - originalNm, nmGainS2: stage2Nm - originalNm };
}

// ─── Tuning options ────────────────────────────────────────────────────────
const tuningOptions = [
  { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 0, included: true, Icon: Drop },
  { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 0, included: true, Icon: Fan },
  { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 0, included: true, Icon: Drop },
  { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 0, included: true, Icon: Gauge },
  { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 25, included: false, Icon: Warning },
  { id: 'startstop', name: { de: 'Start-Stop-Off', en: 'Start-Stop-Off' }, credits: 20, included: false, Icon: Power },
  { id: 'pops', name: { de: 'Pops & Bangs', en: 'Pops & Bangs' }, credits: 45, included: false, Icon: Fire },
  { id: 'launch', name: { de: 'Launch Control', en: 'Launch Control' }, credits: 55, included: false, Icon: RocketLaunch },
  { id: 'swirl', name: { de: 'Swirl Flaps-Off', en: 'Swirl Flaps-Off' }, credits: 30, included: false, Icon: Fan },
  { id: 'cat', name: { de: 'Kat-Off', en: 'Cat-Off' }, credits: 35, included: false, Icon: Prohibit },
  { id: 'o2', name: { de: 'O2-Off', en: 'O2-Off' }, credits: 25, included: false, Icon: Thermometer },
  { id: 'hotstart', name: { de: 'Hot Start Fix', en: 'Hot Start Fix' }, credits: 30, included: false, Icon: Thermometer },
];

const gearboxStages = [
  { id: 'gearbox_stage1', name: { de: 'Stage 1', en: 'Stage 1' }, credits: 120 },
  { id: 'gearbox_stage2', name: { de: 'Stage 2', en: 'Stage 2' }, credits: 160 },
  { id: 'gearbox_stage3', name: { de: 'Stage 3', en: 'Stage 3' }, credits: 200 },
];
const gearboxManufacturers = ['VW', 'Audi', 'Seat', 'Cupra', 'Skoda', 'BMW'];

// ─── Vehicle types ─────────────────────────────────────────────────────────
const vehicleTypes = [
  { id: 'pkw', name: { de: 'PKW', en: 'Car' }, Icon: CarProfile },
  { id: 'lkw', name: { de: 'LKW', en: 'Truck' }, Icon: Truck },
  { id: 'motorrad', name: { de: 'Motorrad', en: 'Motorcycle' }, Icon: Motorcycle },
  { id: 'agrar', name: { de: 'Agrar', en: 'Agriculture' }, Icon: Tractor },
  { id: 'jetski', name: { de: 'Jetski', en: 'Jetski' }, Icon: Boat },
  { id: 'andere', name: { de: 'Andere', en: 'Other' }, Icon: DotsThree },
];

// ─── Translations ──────────────────────────────────────────────────────────
const translations = {
  de: {
    title: 'Konfigurator',
    subtitle: 'Fahrzeug konfigurieren und Tuning-Optionen einsehen',
    vehicleType: 'FAHRZEUGTYP',
    manufacturer: 'Hersteller',
    series: 'Baureihe',
    model: 'Modell',
    engine: 'Motor',
    ecu: 'STEUERGERÄT (ECU)',
    performanceTitle: 'LEISTUNGSDATEN',
    power: 'Leistung',
    torque: 'Drehmoment',
    serie: 'Serie',
    stage1: 'Stage 1',
    stage2: 'Stage 2',
    stages: 'TUNING-STUFEN',
    gearbox: 'GETRIEBE',
    gearboxNote: 'Nur bei VW, Audi, Seat, Cupra, Skoda und BMW möglich',
    options: 'VERFÜGBARE OPTIONEN',
    included: 'Inklusive',
    selectPlaceholder: 'Bitte wählen...',
    selectedVehicle: 'AUSGEWÄHLTES FAHRZEUG',
  },
  en: {
    title: 'Configurator',
    subtitle: 'Configure vehicle and view tuning options',
    vehicleType: 'VEHICLE TYPE',
    manufacturer: 'Manufacturer',
    series: 'Series',
    model: 'Model',
    engine: 'Engine',
    ecu: 'ECU (ENGINE CONTROL UNIT)',
    performanceTitle: 'PERFORMANCE DATA',
    power: 'Power',
    torque: 'Torque',
    serie: 'Stock',
    stage1: 'Stage 1',
    stage2: 'Stage 2',
    stages: 'TUNING STAGES',
    gearbox: 'GEARBOX',
    gearboxNote: 'Only available for VW, Audi, Seat, Cupra, Skoda and BMW',
    options: 'AVAILABLE OPTIONS',
    included: 'Included',
    selectPlaceholder: 'Please select...',
    selectedVehicle: 'SELECTED VEHICLE',
  },
};

const DynoTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const rpm = payload[0]?.payload?.rpm;
  return (
    <div className="bg-[#1a1a1a] border border-border rounded-sm px-3 py-2.5 shadow-xl min-w-[140px]">
      <p className="text-[11px] font-bold text-muted-foreground mb-1.5">{rpm?.toLocaleString()} RPM</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-[11px] leading-relaxed">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.stroke || entry.color }} />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-bold text-foreground ml-auto">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────
export default function Configurator() {
  const { language } = useLanguage();
  const t = (key) => translations[language]?.[key] || key;

  const [vehicleType, setVehicleType] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [series, setSeries] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');
  const [showPs, setShowPs] = useState(true);
  const [showNm, setShowNm] = useState(true);
  const [slideDir, setSlideDir] = useState('right'); // animation direction

  const manufacturers = vehicleType === 'pkw' ? Object.keys(vehicleData).sort() : [];
  const seriesOptions = manufacturer && vehicleData[manufacturer] ? Object.keys(vehicleData[manufacturer]).sort() : [];
  const modelOptions = series && vehicleData[manufacturer]?.[series] ? Object.keys(vehicleData[manufacturer][series]).sort() : [];
  const engineOptions = model && vehicleData[manufacturer]?.[series]?.[model] ? vehicleData[manufacturer][series][model] : [];
  const ecuOptions = useMemo(() => getEcuOptions(manufacturer, engine), [manufacturer, engine]);
  const perfData = useMemo(() => getPerformanceData(engine), [engine]);
  const supportsGearbox = gearboxManufacturers.includes(manufacturer);

  // Current selection step derived from state
  const selectionStep = !manufacturer ? 'manufacturer' : !series ? 'series' : !model ? 'model' : !engine ? 'engine' : 'done';

  const resetFrom = (level) => {
    if (level <= 1) { setManufacturer(''); setSeries(''); setModel(''); setEngine(''); }
    if (level === 2) { setSeries(''); setModel(''); setEngine(''); }
    if (level === 3) { setModel(''); setEngine(''); }
    if (level === 4) { setEngine(''); }
  };

  const goBack = () => {
    setSlideDir('left');
    if (engine) setEngine('');
    else if (model) setModel('');
    else if (series) setSeries('');
    else if (manufacturer) setManufacturer('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground flex items-center gap-3">
            <Wrench weight="fill" className="w-7 h-7 text-primary" />
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        {/* Step 1: Vehicle Type */}
        <Card className="bg-card border-border" data-testid="vehicle-type-card">
          <CardContent className="p-5">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
              <CarProfile weight="bold" className="w-3.5 h-3.5" />
              {t('vehicleType')}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {vehicleTypes.map((vt) => {
                const Icon = vt.Icon;
                const isSelected = vehicleType === vt.id;
                return (
                  <button
                    key={vt.id}
                    type="button"
                    onClick={() => { setVehicleType(vt.id); resetFrom(1); }}
                    data-testid={`vtype-${vt.id}`}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-sm border-2 transition-all cursor-pointer",
                      isSelected
                        ? "bg-primary/10 border-primary text-foreground"
                        : "bg-card border-border text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground"
                    )}
                  >
                    <Icon weight={isSelected ? "fill" : "regular"} className={cn("w-7 h-7", isSelected && "text-primary")} />
                    <span className="text-xs font-bold">{vt.name[language]}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Selection - Card Slider */}
        {vehicleType && vehicleType === 'pkw' && selectionStep !== 'done' && (
          <Card className="bg-card border-border overflow-hidden" data-testid="vehicle-select-card">
            <CardContent className="p-5">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 mb-5 flex-wrap">
                <button
                  type="button"
                  onClick={() => { setSlideDir('left'); resetFrom(1); }}
                  className={cn("text-xs font-semibold transition-colors", manufacturer ? "text-primary hover:text-primary/80 cursor-pointer" : "text-foreground")}
                  data-testid="crumb-manufacturer"
                >
                  {t('manufacturer')}
                </button>
                {manufacturer && (
                  <>
                    <CaretRight weight="bold" className="w-3 h-3 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => { setSlideDir('left'); resetFrom(2); }}
                      className={cn("text-xs font-semibold transition-colors", series ? "text-primary hover:text-primary/80 cursor-pointer" : "text-foreground")}
                      data-testid="crumb-series"
                    >
                      {manufacturer}{series ? '' : ` — ${t('series')}`}
                    </button>
                  </>
                )}
                {series && (
                  <>
                    <CaretRight weight="bold" className="w-3 h-3 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => { setSlideDir('left'); resetFrom(3); }}
                      className={cn("text-xs font-semibold transition-colors", model ? "text-primary hover:text-primary/80 cursor-pointer" : "text-foreground")}
                      data-testid="crumb-model"
                    >
                      {series}{model ? '' : ` — ${t('model')}`}
                    </button>
                  </>
                )}
                {model && (
                  <>
                    <CaretRight weight="bold" className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs font-semibold text-foreground">{model} — {t('engine')}</span>
                  </>
                )}
              </div>

              {/* Back button */}
              {manufacturer && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
                  data-testid="cfg-back-btn"
                >
                  <ArrowLeft weight="bold" className="w-3.5 h-3.5" />
                  {language === 'de' ? 'Zurück' : 'Back'}
                </button>
              )}

              {/* Card Grid with animation */}
              <div key={selectionStep} className="animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Manufacturer Cards */}
                {selectionStep === 'manufacturer' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {manufacturers.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => { setSlideDir('right'); setManufacturer(m); }}
                        data-testid={`cfg-mfr-${m}`}
                        className="group flex flex-col items-center gap-3 p-5 rounded-sm border-2 border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        <CarProfile weight="regular" className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm font-bold text-foreground">{m}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Series Cards */}
                {selectionStep === 'series' && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {seriesOptions.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => { setSlideDir('right'); setSeries(s); }}
                        data-testid={`cfg-ser-${s}`}
                        className="group flex flex-col items-center gap-3 p-5 rounded-sm border-2 border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{s}</span>
                        <span className="text-[10px] text-muted-foreground">{manufacturer}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Model Cards */}
                {selectionStep === 'model' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {modelOptions.map(m => {
                      const yearMatch = m.match(/(\d{4})/);
                      const code = m.replace(/\s*-\s*\d{4}/, '').trim();
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => { setSlideDir('right'); setModel(m); }}
                          data-testid={`cfg-mod-${m}`}
                          className="group flex flex-col items-center gap-2 p-5 rounded-sm border-2 border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                        >
                          <span className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{code}</span>
                          {yearMatch && <span className="text-xs text-muted-foreground">{language === 'de' ? 'ab' : 'from'} {yearMatch[1]}</span>}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Engine Cards */}
                {selectionStep === 'engine' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {engineOptions.map(e => {
                      const psMatch = e.match(/(\d{2,4})\s*PS/);
                      const isDiesel = /TDI|CDI|CDTI|HDI|CRDi|EcoBlue|TDCi/i.test(e);
                      return (
                        <button
                          key={e}
                          type="button"
                          onClick={() => { setSlideDir('right'); setEngine(e); }}
                          data-testid={`cfg-eng-${e.replace(/\s+/g, '-')}`}
                          className="group flex items-center gap-4 p-4 rounded-sm border-2 border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer text-left"
                        >
                          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", isDiesel ? "bg-blue-500/15" : "bg-primary/15")}>
                            <Engine weight="fill" className={cn("w-5 h-5", isDiesel ? "text-blue-400" : "text-primary")} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">{e}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{isDiesel ? 'Diesel' : 'Benzin'}{psMatch ? ` — ${psMatch[1]} PS` : ''}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {vehicleType && vehicleType !== 'pkw' && (
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground italic">{language === 'de' ? 'Daten f\u00fcr diesen Fahrzeugtyp werden bald verf\u00fcgbar sein.' : 'Data for this vehicle type will be available soon.'}</p>
            </CardContent>
          </Card>
        )}

        {/* Results (when engine is selected) */}
        {engine && perfData && (
          <>
            {/* Vehicle Header Banner */}
            <div className="relative overflow-hidden rounded-sm border border-border bg-gradient-to-r from-card via-card to-primary/5 p-6" data-testid="vehicle-banner">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">{t('selectedVehicle')}</p>
                  <h2 className="font-heading text-xl font-bold text-foreground">{manufacturer} {series} {model}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{engine}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{t('ecu')}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1 justify-end">
                      {ecuOptions.map(ecu => (
                        <span key={ecu} className="text-xs font-mono text-foreground bg-secondary/80 border border-border px-2 py-1 rounded-sm">{ecu}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Chart + Bars */}
            <Card className="bg-card border-border" data-testid="perf-chart-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                    <Lightning weight="bold" className="w-3.5 h-3.5" />
                    {t('performanceTitle')}
                  </label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setShowPs(p => !p)} data-testid="cfg-toggle-ps" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border transition-all", showPs ? "bg-[#8B2635]/15 border-[#8B2635]/50 text-[#e74c3c]" : "bg-secondary/50 border-border text-muted-foreground")}>
                      <span className={cn("w-2 h-2 rounded-full", showPs ? "bg-[#e74c3c]" : "bg-muted-foreground/40")} /> PS
                    </button>
                    <button type="button" onClick={() => setShowNm(p => !p)} data-testid="cfg-toggle-nm" className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-bold border transition-all", showNm ? "bg-blue-500/15 border-blue-500/50 text-blue-400" : "bg-secondary/50 border-border text-muted-foreground")}>
                      <span className={cn("w-2 h-2 rounded-full", showNm ? "bg-blue-400" : "bg-muted-foreground/40")} /> Nm
                    </button>
                  </div>
                </div>

                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={perfData.curveData} margin={{ top: 5, right: 10, left: -5, bottom: 5 }}>
                      <defs>
                        <linearGradient id="cGradSeriePs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#666" stopOpacity={0.3} /><stop offset="100%" stopColor="#666" stopOpacity={0} /></linearGradient>
                        <linearGradient id="cGradS1Ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8B2635" stopOpacity={0.3} /><stop offset="100%" stopColor="#8B2635" stopOpacity={0} /></linearGradient>
                        <linearGradient id="cGradS2Ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e74c3c" stopOpacity={0.25} /><stop offset="100%" stopColor="#e74c3c" stopOpacity={0} /></linearGradient>
                        <linearGradient id="cGradSerieNm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#555" stopOpacity={0.2} /><stop offset="100%" stopColor="#555" stopOpacity={0} /></linearGradient>
                        <linearGradient id="cGradS1Nm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} /><stop offset="100%" stopColor="#2563eb" stopOpacity={0} /></linearGradient>
                        <linearGradient id="cGradS2Nm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="100%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="rpmLabel" tick={{ fill: '#666', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.08)' }} tickLine={false} />
                      <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<DynoTooltip />} />
                      {showPs && <Area type="monotone" dataKey="seriePs" name={`${t('serie')} PS`} stroke="#666" strokeWidth={2} fill="url(#cGradSeriePs)" strokeDasharray="6 3" dot={false} />}
                      {showPs && <Area type="monotone" dataKey="stage1Ps" name="Stage 1 PS" stroke="#8B2635" strokeWidth={2.5} fill="url(#cGradS1Ps)" dot={false} />}
                      {showPs && <Area type="monotone" dataKey="stage2Ps" name="Stage 2 PS" stroke="#e74c3c" strokeWidth={2.5} fill="url(#cGradS2Ps)" dot={false} />}
                      {showNm && <Area type="monotone" dataKey="serieNm" name={`${t('serie')} Nm`} stroke="#555" strokeWidth={2} fill="url(#cGradSerieNm)" strokeDasharray="6 3" dot={false} />}
                      {showNm && <Area type="monotone" dataKey="stage1Nm" name="Stage 1 Nm" stroke="#2563eb" strokeWidth={2.5} fill="url(#cGradS1Nm)" dot={false} />}
                      {showNm && <Area type="monotone" dataKey="stage2Nm" name="Stage 2 Nm" stroke="#3b82f6" strokeWidth={2.5} fill="url(#cGradS2Nm)" dot={false} />}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-5 h-0.5 inline-block" style={{ borderTop: '2px dashed #666' }} /> {t('serie')}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-5 h-0.5 bg-[#8B2635] inline-block rounded" /> Stage 1</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-5 h-0.5 bg-[#e74c3c] inline-block rounded" /> Stage 2</div>
                </div>

                {/* Horizontal bars - 2 col */}
                <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* PS */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">{t('power')} (PS)</span>
                      <span className="text-xs text-muted-foreground">max {perfData.stage2Ps} PS</span>
                    </div>
                    <div className="space-y-2">
                      {[{ label: t('serie'), ps: perfData.originalPs, gain: null, color: '#555' },
                        { label: 'Stage 1', ps: perfData.stage1Ps, gain: perfData.psGainS1, color: 'linear-gradient(to right, #8B2635, #a52d3a)' },
                        { label: 'Stage 2', ps: perfData.stage2Ps, gain: perfData.psGainS2, color: 'linear-gradient(to right, #c0392b, #e74c3c)' }
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-3">
                          <span className={cn("text-[11px] w-14 text-right flex-shrink-0", row.gain ? "text-foreground font-semibold" : "text-muted-foreground")}>{row.label}</span>
                          <div className="flex-1 h-7 bg-secondary/40 rounded-sm overflow-hidden relative">
                            <div className="h-full rounded-sm" style={{ width: `${(row.ps / perfData.stage2Ps) * 100}%`, background: row.color }} />
                            <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-white">{row.ps} PS</span>
                            {row.gain && <span className="absolute inset-0 flex items-center justify-end pr-3 text-[10px] font-bold text-green-400">+{row.gain}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Nm */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-foreground uppercase tracking-wider">{t('torque')} (Nm)</span>
                      <span className="text-xs text-muted-foreground">max {perfData.stage2Nm} Nm</span>
                    </div>
                    <div className="space-y-2">
                      {[{ label: t('serie'), nm: perfData.originalNm, gain: null, color: '#555' },
                        { label: 'Stage 1', nm: perfData.stage1Nm, gain: perfData.nmGainS1, color: 'linear-gradient(to right, #1d4ed8, #2563eb)' },
                        { label: 'Stage 2', nm: perfData.stage2Nm, gain: perfData.nmGainS2, color: 'linear-gradient(to right, #2563eb, #3b82f6)' }
                      ].map((row) => (
                        <div key={row.label} className="flex items-center gap-3">
                          <span className={cn("text-[11px] w-14 text-right flex-shrink-0", row.gain ? "text-foreground font-semibold" : "text-muted-foreground")}>{row.label}</span>
                          <div className="flex-1 h-7 bg-secondary/40 rounded-sm overflow-hidden relative">
                            <div className="h-full rounded-sm" style={{ width: `${(row.nm / perfData.stage2Nm) * 100}%`, background: row.color }} />
                            <span className="absolute inset-0 flex items-center pl-3 text-xs font-bold text-white">{row.nm} Nm</span>
                            {row.gain && <span className="absolute inset-0 flex items-center justify-end pr-3 text-[10px] font-bold text-green-400">+{row.gain}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tuning Stages - Visual cards without prices */}
            <Card className="bg-card border-border" data-testid="tuning-stages-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                  <Lightning weight="bold" className="w-3.5 h-3.5" />
                  {t('stages')}
                </label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Stage 1', Icon: Lightning, color: 'from-[#8B2635]/20 to-transparent', iconColor: 'text-primary', border: 'border-primary/30', desc: language === 'de' ? 'Optimierte Kennfelder f\u00fcr mehr Leistung und Drehmoment' : 'Optimized maps for more power and torque', highlight: `+${perfData.psGainS1} PS / +${perfData.nmGainS1} Nm` },
                    { name: 'Stage 2', Icon: Fire, color: 'from-orange-500/15 to-transparent', iconColor: 'text-orange-500', border: 'border-orange-500/30', desc: language === 'de' ? 'Maximale Performance mit erweiterten Anpassungen' : 'Maximum performance with extended adjustments', highlight: `+${perfData.psGainS2} PS / +${perfData.nmGainS2} Nm` },
                    { name: 'Eco', Icon: Leaf, color: 'from-green-500/15 to-transparent', iconColor: 'text-green-500', border: 'border-green-500/30', desc: language === 'de' ? 'Verbrauch optimiert bei gleichem Fahrerlebnis' : 'Fuel optimized with same driving experience', highlight: language === 'de' ? 'Bis zu -15% Verbrauch' : 'Up to -15% fuel' },
                    { name: language === 'de' ? 'Nur Optionen' : 'Options Only', Icon: Sliders, color: 'from-white/5 to-transparent', iconColor: 'text-muted-foreground', border: 'border-border', desc: language === 'de' ? 'Einzelne Optionen ohne Stufe w\u00e4hlen' : 'Select individual options without a stage', highlight: language === 'de' ? 'Flexibel' : 'Flexible' },
                  ].map((stage) => (
                    <div key={stage.name} className={cn("relative overflow-hidden rounded-sm border p-5 bg-gradient-to-b", stage.color, stage.border)}>
                      <stage.Icon weight="fill" className={cn("w-8 h-8 mb-3", stage.iconColor)} />
                      <h3 className="text-base font-bold text-foreground font-heading mb-1">{stage.name}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">{stage.desc}</p>
                      <span className="inline-block text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-sm">{stage.highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Gearbox */}
                {supportsGearbox && (
                  <div className="mt-6">
                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                      <Gear weight="bold" className="w-3.5 h-3.5" />
                      {t('gearbox')}
                    </label>
                    <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm mb-4">
                      <Warning weight="fill" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-400">{t('gearboxNote')}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {gearboxStages.map((gs) => (
                        <div key={gs.id} className="relative overflow-hidden rounded-sm border border-blue-500/30 p-5 bg-gradient-to-b from-blue-500/10 to-transparent">
                          <Gear weight="fill" className="w-7 h-7 text-blue-500 mb-2" />
                          <h3 className="text-base font-bold text-foreground font-heading">{language === 'de' ? 'Getriebe' : 'Gearbox'} {gs.name[language]}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{language === 'de' ? 'Schaltoptimierung und Drehmomentanpassung' : 'Shift optimization and torque adjustment'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Options - Visual feature showcase */}
            <Card className="bg-card border-border" data-testid="tuning-options-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                  <Sliders weight="bold" className="w-3.5 h-3.5" />
                  {t('options')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {tuningOptions.map((opt) => {
                    const Icon = opt.Icon;
                    return (
                      <div
                        key={opt.id}
                        data-testid={`cfg-opt-${opt.id}`}
                        className="group flex flex-col items-center gap-2.5 p-4 rounded-sm border border-border bg-secondary/30 hover:bg-secondary/60 hover:border-muted-foreground/40 transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon weight="fill" className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-xs font-bold text-foreground text-center leading-tight">{opt.name[language]}</span>
                        {opt.included && (
                          <div className="flex items-center gap-1">
                            <CheckCircle weight="fill" className="w-3.5 h-3.5 text-green-500" />
                            <span className="text-[10px] font-semibold text-green-400">{t('included')}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
