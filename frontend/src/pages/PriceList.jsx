import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { 
  ListBullets,
  CarProfile,
  Truck,
  Gear,
  Leaf,
  Lightning,
  Warning,
  Plus
} from '@phosphor-icons/react';

// Tuning Options with prices
const tuningOptions = [
  { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 40, description: { de: 'Partikelfilter Deaktivierung', en: 'Particle Filter Deactivation' } },
  { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 30, description: { de: 'AGR Deaktivierung', en: 'EGR Deactivation' } },
  { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 45, description: { de: 'SCR System Deaktivierung', en: 'SCR System Deactivation' } },
  { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 25, description: { de: 'Fehlercode Unterdrückung', en: 'Error Code Suppression' } },
  { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 50, description: { de: 'Geschwindigkeitsbegrenzung aufheben', en: 'Speed Limiter Removal' } },
  { id: 'startstop', name: { de: 'Start-Stop-Off', en: 'Start-Stop-Off' }, credits: 20, description: { de: 'Start-Stop Deaktivierung', en: 'Start-Stop Deactivation' } },
  { id: 'pops', name: { de: 'Pops & Bangs', en: 'Pops & Bangs' }, credits: 45, description: { de: 'Auspuff Knallen', en: 'Exhaust Crackle' } },
  { id: 'launch', name: { de: 'Launch Control', en: 'Launch Control' }, credits: 55, description: { de: 'Launch Control Aktivierung', en: 'Launch Control Activation' } },
  { id: 'swirl', name: { de: 'Swirl Flaps-Off', en: 'Swirl Flaps-Off' }, credits: 30, description: { de: 'Drallklappen Deaktivierung', en: 'Swirl Flaps Deactivation' } },
  { id: 'cat', name: { de: 'Kat-Off', en: 'Cat-Off' }, credits: 35, description: { de: 'Katalysator Deaktivierung', en: 'Catalyst Deactivation' } },
  { id: 'o2', name: { de: 'O2-Off', en: 'O2-Off' }, credits: 25, description: { de: 'Lambdasonde Deaktivierung', en: 'O2 Sensor Deactivation' } },
  { id: 'hotstart', name: { de: 'Hot Start Fix', en: 'Hot Start Fix' }, credits: 30, description: { de: 'Heißstart Korrektur', en: 'Hot Start Correction' } },
];

// Translations
const pageTranslations = {
  en: {
    pageTitle: 'Price List',
    pkw: 'Cars (PKW)',
    lkw: 'Truck / Agri / Bus',
    stage1: 'Stage 1',
    stage2: 'Stage 2',
    eco: 'Eco',
    gearbox: 'Gearbox',
    optionsSingle: 'Single Options',
    tuning: 'Tuning',
    optionsOnly: 'Options Only',
    basePrice: 'Base Price',
    option: 'Option',
    credits: 'Credits',
    description: 'Description',
    includedOptions: 'Available Options (Additional)',
    gearboxNote: 'Only available for VW, Audi, Seat, Cupra, Skoda and BMW',
    allOptions: 'All Tuning Options',
    note: 'Prices may vary depending on vehicle and ECU type.',
  },
  de: {
    pageTitle: 'Preisliste',
    pkw: 'PKW',
    lkw: 'LKW / Agrar / Bus',
    stage1: 'Stage 1',
    stage2: 'Stage 2',
    eco: 'Öko',
    gearbox: 'Getriebe',
    optionsSingle: 'Optionen einzeln',
    tuning: 'Tuning',
    optionsOnly: 'Nur Optionen',
    basePrice: 'Grundpreis',
    option: 'Option',
    credits: 'Credits',
    description: 'Beschreibung',
    includedOptions: 'Verfügbare Optionen (Zusätzlich)',
    gearboxNote: 'Nur bei VW, Audi, Seat, Cupra, Skoda und BMW möglich',
    allOptions: 'Alle Tuning-Optionen',
    note: 'Preise können je nach Fahrzeug und Steuergerät variieren.',
  }
};

// PKW Stage Card Component
const StageCard = ({ title, basePrice, icon: Icon, language, t }) => {
  return (
    <Card className="bg-card border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Icon weight="fill" className="w-5 h-5 text-primary" />
            {title}
          </CardTitle>
          <Badge className="bg-primary/20 text-primary border border-primary/30 font-heading font-bold text-lg px-3 py-1">
            {basePrice} Credits
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground mb-3">{t('includedOptions')}</p>
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">{t('option')}</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">+ {t('credits')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tuningOptions.map((option) => (
              <TableRow key={option.id} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell>
                  <div>
                    <p className="font-medium text-white">{option.name[language]}</p>
                    <p className="text-xs text-muted-foreground">{option.description[language]}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="bg-secondary border-white/10 font-mono">
                    +{option.credits}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Gearbox Card Component
const GearboxCard = ({ language, t }) => {
  const gearboxPrices = [
    { stage: 'Stage 1', credits: 120 },
    { stage: 'Stage 2', credits: 160 },
    { stage: 'Stage 3', credits: 200 },
  ];

  return (
    <Card className="bg-card border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
          <Gear weight="fill" className="w-5 h-5 text-primary" />
          {t('gearbox')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {/* Warning Note */}
        <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-sm mb-4">
          <Warning weight="fill" className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-400">{t('gearboxNote')}</p>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">Stage</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">{t('credits')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gearboxPrices.map((item) => (
              <TableRow key={item.stage} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell className="font-medium text-white">{item.stage}</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-primary/20 text-primary border border-primary/30 font-heading font-bold">
                    {item.credits}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Single Options Card Component
const SingleOptionsCard = ({ language, t }) => {
  return (
    <Card className="bg-card border-white/10">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
          <Plus weight="fill" className="w-5 h-5 text-primary" />
          {t('allOptions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground font-semibold">{t('option')}</TableHead>
              <TableHead className="text-muted-foreground font-semibold">{t('description')}</TableHead>
              <TableHead className="text-muted-foreground font-semibold text-right">{t('credits')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tuningOptions.map((option) => (
              <TableRow key={option.id} className="border-white/5 hover:bg-white/[0.02]">
                <TableCell className="font-medium text-white">{option.name[language]}</TableCell>
                <TableCell className="text-muted-foreground">{option.description[language]}</TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-primary/20 text-primary border border-primary/30 font-heading font-bold">
                    {option.credits}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// LKW Section Component
const LkwSection = ({ language, t }) => {
  const lkwEcoOptions = [
    { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 55 },
    { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 45 },
    { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 60 },
    { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 35 },
    { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 65 },
  ];

  return (
    <div className="space-y-6">
      {/* Eco with Options */}
      <Card className="bg-card border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
              <Leaf weight="fill" className="w-5 h-5 text-green-500" />
              {t('eco')}
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border border-green-500/30 font-heading font-bold text-lg px-3 py-1">
              120 Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">{t('includedOptions')}</p>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">{t('option')}</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">+ {t('credits')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lkwEcoOptions.map((option) => (
                <TableRow key={option.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-white">{option.name[language]}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-secondary border-white/10 font-mono">
                      +{option.credits}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Tuning */}
      <Card className="bg-card border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
              <Lightning weight="fill" className="w-5 h-5 text-primary" />
              {t('tuning')}
            </CardTitle>
            <Badge className="bg-primary/20 text-primary border border-primary/30 font-heading font-bold text-lg px-3 py-1">
              150 Credits
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-3">{t('includedOptions')}</p>
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">{t('option')}</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">+ {t('credits')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lkwEcoOptions.map((option) => (
                <TableRow key={option.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-white">{option.name[language]}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="bg-secondary border-white/10 font-mono">
                      +{option.credits}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Options Only */}
      <Card className="bg-card border-white/10">
        <CardHeader className="border-b border-white/10 pb-4">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Plus weight="fill" className="w-5 h-5 text-primary" />
            {t('optionsOnly')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold">{t('option')}</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-right">{t('credits')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lkwEcoOptions.map((option) => (
                <TableRow key={option.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-white">{option.name[language]}</TableCell>
                  <TableCell className="text-right">
                    <Badge className="bg-primary/20 text-primary border border-primary/30 font-heading font-bold">
                      {option.credits}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default function PriceList() {
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;
  const [activeTab, setActiveTab] = useState('pkw');
  const [pkwSubTab, setPkwSubTab] = useState('stage1');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-2xl tracking-tight text-white flex items-center gap-3">
            <ListBullets weight="fill" className="w-7 h-7 text-primary" />
            {t('pageTitle')}
          </h1>
        </div>

        {/* Main Category Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-secondary border border-white/10 p-1 w-full justify-start">
            <TabsTrigger 
              value="pkw" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 px-6"
            >
              <CarProfile weight="bold" className="w-5 h-5" />
              {t('pkw')}
            </TabsTrigger>
            <TabsTrigger 
              value="lkw" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white flex items-center gap-2 px-6"
            >
              <Truck weight="bold" className="w-5 h-5" />
              {t('lkw')}
            </TabsTrigger>
          </TabsList>

          {/* PKW Content */}
          <TabsContent value="pkw" className="mt-6">
            <Tabs value={pkwSubTab} onValueChange={setPkwSubTab}>
              <TabsList className="bg-card border border-white/10 p-1 flex-wrap h-auto gap-1">
                <TabsTrigger 
                  value="stage1" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  {t('stage1')}
                </TabsTrigger>
                <TabsTrigger 
                  value="stage2" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  {t('stage2')}
                </TabsTrigger>
                <TabsTrigger 
                  value="eco" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  {t('eco')}
                </TabsTrigger>
                <TabsTrigger 
                  value="gearbox" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  {t('gearbox')}
                </TabsTrigger>
                <TabsTrigger 
                  value="options" 
                  className="data-[state=active]:bg-white/10 data-[state=active]:text-white"
                >
                  {t('optionsSingle')}
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="stage1">
                  <StageCard 
                    title={t('stage1')} 
                    basePrice={100} 
                    icon={Lightning}
                    language={language}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="stage2">
                  <StageCard 
                    title={t('stage2')} 
                    basePrice={100} 
                    icon={Lightning}
                    language={language}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="eco">
                  <StageCard 
                    title={t('eco')} 
                    basePrice={100} 
                    icon={Leaf}
                    language={language}
                    t={t}
                  />
                </TabsContent>

                <TabsContent value="gearbox">
                  <GearboxCard language={language} t={t} />
                </TabsContent>

                <TabsContent value="options">
                  <SingleOptionsCard language={language} t={t} />
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>

          {/* LKW Content */}
          <TabsContent value="lkw" className="mt-6">
            <LkwSection language={language} t={t} />
          </TabsContent>
        </Tabs>

        {/* Note */}
        <p className="text-sm text-muted-foreground text-center pt-4">
          {t('note')}
        </p>
      </div>
    </DashboardLayout>
  );
}
