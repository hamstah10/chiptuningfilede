import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ListBullets,
  CarProfile,
  Truck,
  Gear,
  Leaf,
  Lightning,
  Warning,
  Plus,
  Drop,
  Prohibit,
  Gauge,
  Power,
  Fire,
  RocketLaunch,
  Fan,
  Thermometer,
  CheckCircle,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';

// Tuning Options with prices and icons
const tuningOptions = [
  { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 0, included: true, icon: 'drop', description: { de: 'Partikelfilter', en: 'Particle Filter' } },
  { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 0, included: true, icon: 'fan', description: { de: 'AGR Ventil', en: 'EGR Valve' } },
  { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 0, included: true, icon: 'drop', description: { de: 'SCR System', en: 'SCR System' } },
  { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 0, included: true, icon: 'gauge', description: { de: 'Geschwindigkeit', en: 'Speed Limiter' } },
  { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 25, included: false, icon: 'warning', description: { de: 'Fehlercode', en: 'Error Code' } },
  { id: 'startstop', name: { de: 'Start-Stop-Off', en: 'Start-Stop-Off' }, credits: 20, included: false, icon: 'power', description: { de: 'Start-Stop', en: 'Start-Stop' } },
  { id: 'pops', name: { de: 'Pops & Bangs', en: 'Pops & Bangs' }, credits: 45, included: false, icon: 'fire', description: { de: 'Auspuff Knallen', en: 'Exhaust Crackle' } },
  { id: 'launch', name: { de: 'Launch Control', en: 'Launch Control' }, credits: 55, included: false, icon: 'rocket', description: { de: 'Rennstart', en: 'Race Start' } },
  { id: 'swirl', name: { de: 'Swirl Flaps-Off', en: 'Swirl Flaps-Off' }, credits: 30, included: false, icon: 'fan', description: { de: 'Drallklappen', en: 'Swirl Flaps' } },
  { id: 'cat', name: { de: 'Kat-Off', en: 'Cat-Off' }, credits: 35, included: false, icon: 'prohibit', description: { de: 'Katalysator', en: 'Catalyst' } },
  { id: 'o2', name: { de: 'O2-Off', en: 'O2-Off' }, credits: 25, included: false, icon: 'thermometer', description: { de: 'Lambdasonde', en: 'O2 Sensor' } },
  { id: 'hotstart', name: { de: 'Hot Start Fix', en: 'Hot Start Fix' }, credits: 30, included: false, icon: 'thermometer', description: { de: 'Heißstart', en: 'Hot Start' } },
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
    availableOptions: 'Available Options',
    included: 'Included',
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
    availableOptions: 'Verfügbare Optionen',
    included: 'Inklusive',
    gearboxNote: 'Nur bei VW, Audi, Seat, Cupra, Skoda und BMW möglich',
    allOptions: 'Alle Tuning-Optionen',
    note: 'Preise können je nach Fahrzeug und Steuergerät variieren.',
  }
};

// Option Icon Component
const OptionIcon = ({ iconType, className }) => {
  const iconProps = { weight: "fill", className: className || "w-6 h-6" };
  
  switch(iconType) {
    case 'drop': return <Drop {...iconProps} />;
    case 'fan': return <Fan {...iconProps} />;
    case 'gauge': return <Gauge {...iconProps} />;
    case 'warning': return <Warning {...iconProps} />;
    case 'power': return <Power {...iconProps} />;
    case 'fire': return <Fire {...iconProps} />;
    case 'rocket': return <RocketLaunch {...iconProps} />;
    case 'prohibit': return <Prohibit {...iconProps} />;
    case 'thermometer': return <Thermometer {...iconProps} />;
    default: return <Gear {...iconProps} />;
  }
};

// Option Card Component
const OptionCard = ({ option, language, t }) => {
  const isIncluded = option.included;
  
  return (
    <div 
      className={`p-3 rounded-sm border transition-colors ${
        isIncluded 
          ? 'bg-green-500/10 border-green-500/30' 
          : 'bg-secondary border-border hover:border-white/20'
      }`}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-10 h-10 rounded-sm flex items-center justify-center mb-2 ${
          isIncluded ? 'bg-green-500/20' : 'bg-secondary'
        }`}>
          <OptionIcon 
            iconType={option.icon} 
            className={`w-5 h-5 ${isIncluded ? 'text-green-400' : 'text-muted-foreground'}`} 
          />
        </div>
        <p className={`text-sm font-semibold ${isIncluded ? 'text-green-400' : 'text-foreground'}`}>
          {option.name[language]}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{option.description[language]}</p>
        {isIncluded ? (
          <Badge className="mt-2 bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
            <CheckCircle weight="fill" className="w-3 h-3 mr-1" />
            {t('included')}
          </Badge>
        ) : (
          <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 font-mono text-xs">
            +{option.credits}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Options Grid Component
const OptionsGrid = ({ options, language, t }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {options.map((option) => (
        <OptionCard key={option.id} option={option} language={language} t={t} />
      ))}
    </div>
  );
};

// PKW Stage Card Component
const StageCard = ({ title, basePrice, icon: Icon, language, t }) => {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border pb-4">
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
        <p className="text-sm text-muted-foreground mb-4">{t('availableOptions')}</p>
        <OptionsGrid options={tuningOptions} language={language} t={t} />
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
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border pb-4">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {gearboxPrices.map((item) => (
            <div key={item.stage} className="p-4 bg-secondary rounded-sm border border-border text-center">
              <p className="font-semibold text-foreground text-lg">{item.stage}</p>
              <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 font-heading font-bold text-lg px-3 py-1">
                {item.credits} Credits
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Single Options Card Component - now with grid
const SingleOptionsCard = ({ language, t }) => {
  // All options with their actual prices for single purchase
  const singleOptions = tuningOptions.map(opt => ({
    ...opt,
    credits: opt.included ? 40 : opt.credits, // Set price for "included" options when bought separately
    included: false
  }));

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
          <Plus weight="fill" className="w-5 h-5 text-primary" />
          {t('allOptions')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {singleOptions.map((option) => (
            <div 
              key={option.id}
              className="p-3 rounded-sm border bg-secondary border-border hover:border-white/20 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center mb-2">
                  <OptionIcon iconType={option.icon} className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground">{option.name[language]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{option.description[language]}</p>
                <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 font-mono text-xs">
                  {option.credits}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// LKW Options
const lkwOptions = [
  { id: 'dpf', name: { de: 'DPF-Off', en: 'DPF-Off' }, credits: 0, included: true, icon: 'drop', description: { de: 'Partikelfilter', en: 'Particle Filter' } },
  { id: 'egr', name: { de: 'EGR-Off', en: 'EGR-Off' }, credits: 0, included: true, icon: 'fan', description: { de: 'AGR Ventil', en: 'EGR Valve' } },
  { id: 'adblue', name: { de: 'AdBlue-Off', en: 'AdBlue-Off' }, credits: 0, included: true, icon: 'drop', description: { de: 'SCR System', en: 'SCR System' } },
  { id: 'vmax', name: { de: 'Vmax-Off', en: 'Vmax-Off' }, credits: 0, included: true, icon: 'gauge', description: { de: 'Geschwindigkeit', en: 'Speed Limiter' } },
  { id: 'dtc', name: { de: 'DTC-Off', en: 'DTC-Off' }, credits: 35, included: false, icon: 'warning', description: { de: 'Fehlercode', en: 'Error Code' } },
  { id: 'nox', name: { de: 'NOx-Off', en: 'NOx-Off' }, credits: 50, included: false, icon: 'prohibit', description: { de: 'NOx Sensor', en: 'NOx Sensor' } },
];

// LKW Section Component
const LkwSection = ({ language, t }) => {
  const lkwSingleOptions = lkwOptions.map(opt => ({
    ...opt,
    credits: opt.included ? 55 : opt.credits,
    included: false
  }));

  return (
    <div className="space-y-6">
      {/* Eco with Options */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-4">
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
          <p className="text-sm text-muted-foreground mb-4">{t('availableOptions')}</p>
          <OptionsGrid options={lkwOptions} language={language} t={t} />
        </CardContent>
      </Card>

      {/* Tuning */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-4">
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
          <p className="text-sm text-muted-foreground mb-4">{t('availableOptions')}</p>
          <OptionsGrid options={lkwOptions} language={language} t={t} />
        </CardContent>
      </Card>

      {/* Options Only */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-4">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Plus weight="fill" className="w-5 h-5 text-primary" />
            {t('optionsOnly')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {lkwSingleOptions.map((option) => (
              <div 
                key={option.id}
                className="p-3 rounded-sm border bg-secondary border-border hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center mb-2">
                    <OptionIcon iconType={option.icon} className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{option.name[language]}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{option.description[language]}</p>
                  <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 font-mono text-xs">
                    {option.credits}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
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
  const [lkwSubTab, setLkwSubTab] = useState('eco');

  const mainTabs = [
    { id: 'pkw', Icon: CarProfile, label: t('pkw') },
    { id: 'lkw', Icon: Truck, label: t('lkw') },
  ];

  const pkwSubTabs = [
    { id: 'stage1', label: t('stage1') },
    { id: 'stage2', label: t('stage2') },
    { id: 'eco', label: t('eco') },
    { id: 'gearbox', label: t('gearbox') },
    { id: 'options', label: t('optionsSingle') },
  ];

  const lkwSubTabs = [
    { id: 'eco', label: t('eco') },
    { id: 'tuning', label: t('tuning') },
    { id: 'options', label: t('optionsSingle') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground flex items-center gap-3">
            <ListBullets weight="fill" className="w-7 h-7 text-primary" />
            {t('pageTitle')}
          </h1>
        </div>

        {/* Main Category Tabs (horizontal) */}
        <div className="flex gap-2" data-testid="main-tabs">
          {mainTabs.map(tab => {
            const Icon = tab.Icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-testid={`tab-${tab.id}`}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-3 rounded-sm border-2 transition-all text-left",
                  isActive ? "bg-primary/8 border-primary/40" : "bg-card border-border hover:border-muted-foreground/40"
                )}
              >
                <Icon weight={isActive ? "fill" : "regular"} className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-Tabs (horizontal) */}
        <div className="flex flex-wrap gap-2" data-testid="sub-tabs">
          {(activeTab === 'pkw' ? pkwSubTabs : lkwSubTabs).map(sub => {
            const currentSub = activeTab === 'pkw' ? pkwSubTab : lkwSubTab;
            const isActive = currentSub === sub.id;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => activeTab === 'pkw' ? setPkwSubTab(sub.id) : setLkwSubTab(sub.id)}
                data-testid={`subtab-${sub.id}`}
                className={cn(
                  "px-4 py-2 rounded-sm border-2 text-sm font-semibold transition-all",
                  isActive ? "bg-primary/8 border-primary/40 text-foreground" : "bg-card border-border text-muted-foreground hover:border-muted-foreground/40"
                )}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'pkw' && (
          <>
            {pkwSubTab === 'stage1' && <StageCard title={t('stage1')} basePrice={100} icon={Lightning} language={language} t={t} />}
            {pkwSubTab === 'stage2' && <StageCard title={t('stage2')} basePrice={100} icon={Lightning} language={language} t={t} />}
            {pkwSubTab === 'eco' && <StageCard title={t('eco')} basePrice={100} icon={Leaf} language={language} t={t} />}
            {pkwSubTab === 'gearbox' && <GearboxCard language={language} t={t} />}
            {pkwSubTab === 'options' && <SingleOptionsCard language={language} t={t} />}
          </>
        )}

        {activeTab === 'lkw' && (
          <>
            {lkwSubTab === 'eco' && (
              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border pb-4">
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
                  <p className="text-sm text-muted-foreground mb-4">{t('availableOptions')}</p>
                  <OptionsGrid options={lkwOptions} language={language} t={t} />
                </CardContent>
              </Card>
            )}
            {lkwSubTab === 'tuning' && (
              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border pb-4">
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
                  <p className="text-sm text-muted-foreground mb-4">{t('availableOptions')}</p>
                  <OptionsGrid options={lkwOptions} language={language} t={t} />
                </CardContent>
              </Card>
            )}
            {lkwSubTab === 'options' && (
              <Card className="bg-card border-border">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                    <Plus weight="fill" className="w-5 h-5 text-primary" />
                    {t('allOptions')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {lkwOptions.map(opt => ({ ...opt, credits: opt.included ? 55 : opt.credits, included: false })).map((option) => (
                      <div key={option.id} className="p-3 rounded-sm border bg-secondary border-border hover:border-white/20 transition-colors">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center mb-2">
                            <OptionIcon iconType={option.icon} className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-semibold text-foreground">{option.name[language]}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{option.description[language]}</p>
                          <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 font-mono text-xs">{option.credits}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Note */}
        <p className="text-sm text-muted-foreground text-center pt-4">{t('note')}</p>
      </div>
    </DashboardLayout>
  );
}
