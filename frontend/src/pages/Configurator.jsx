import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  CarProfile, 
  Engine, 
  Lightning,
  CurrencyCircleDollar,
  Check
} from '@phosphor-icons/react';

// Mock data - will come from API
const manufacturers = ['Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Porsche'];
const models = {
  'Audi': ['A3', 'A4', 'A6', 'Q5', 'RS3', 'S4'],
  'BMW': ['320d', '330d', 'M3', 'M5', 'X3', 'X5'],
  'Mercedes-Benz': ['C220d', 'E300', 'AMG C63', 'GLC'],
  'Volkswagen': ['Golf GTI', 'Golf R', 'Passat', 'Tiguan'],
  'Porsche': ['911', 'Cayenne', 'Macan', 'Panamera'],
};
const engines = ['2.0 TDI 150PS', '2.0 TDI 190PS', '3.0 TDI 272PS', '2.0 TFSI 252PS'];
const tuningTypes = [
  { id: 'stage1', name: 'Stage 1', credits: 75, description: 'ECU Remap for improved performance' },
  { id: 'stage2', name: 'Stage 2', credits: 120, description: 'Stage 1 + DPF/EGR solutions' },
  { id: 'eco', name: 'Eco Tuning', credits: 65, description: 'Fuel economy optimization' },
  { id: 'custom', name: 'Custom', credits: 150, description: 'Fully customized tuning solution' },
];

export default function Configurator() {
  const { t } = useLanguage();
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [engine, setEngine] = useState('');
  const [selectedTuning, setSelectedTuning] = useState(null);

  const availableModels = manufacturer ? models[manufacturer] || [] : [];
  const totalCredits = selectedTuning ? tuningTypes.find(tt => tt.id === selectedTuning)?.credits : 0;

  return (
    <DashboardLayout title={t('configuratorTitle')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vehicle Selection */}
          <Card className="bg-card border-white/10" data-testid="vehicle-selection-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <CarProfile weight="fill" className="w-5 h-5 text-primary" />
                {t('selectVehicle')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t('selectManufacturer')}
                  </label>
                  <Select value={manufacturer} onValueChange={(val) => { setManufacturer(val); setModel(''); }}>
                    <SelectTrigger className="bg-secondary border-white/10" data-testid="manufacturer-select">
                      <SelectValue placeholder={t('selectManufacturer')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {manufacturers.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t('selectModel')}
                  </label>
                  <Select value={model} onValueChange={setModel} disabled={!manufacturer}>
                    <SelectTrigger className="bg-secondary border-white/10" data-testid="model-select">
                      <SelectValue placeholder={t('selectModel')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {availableModels.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {t('selectEngine')}
                  </label>
                  <Select value={engine} onValueChange={setEngine} disabled={!model}>
                    <SelectTrigger className="bg-secondary border-white/10" data-testid="engine-select">
                      <SelectValue placeholder={t('selectEngine')} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {engines.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tuning Type Selection */}
          <Card className="bg-card border-white/10" data-testid="tuning-selection-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Engine weight="fill" className="w-5 h-5 text-primary" />
                {t('selectTuningType')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tuningTypes.map((tuning) => (
                  <button
                    key={tuning.id}
                    onClick={() => setSelectedTuning(tuning.id)}
                    className={`p-4 rounded-sm border text-left transition-colors duration-200 ${
                      selectedTuning === tuning.id
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 bg-secondary hover:border-white/20'
                    }`}
                    data-testid={`tuning-${tuning.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{tuning.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tuning.description}</p>
                      </div>
                      {selectedTuning === tuning.id && (
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check weight="bold" className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <CurrencyCircleDollar weight="fill" className="w-4 h-4 text-primary" />
                      <span className="font-heading font-bold text-primary">{tuning.credits}</span>
                      <span className="text-xs text-muted-foreground">Credits</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-6">
          <Card className="bg-card border-white/10 sticky top-24" data-testid="summary-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Lightning weight="fill" className="w-5 h-5 text-primary" />
                {t('estimatedPrice')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Selected Vehicle */}
                <div className="p-4 bg-secondary rounded-sm border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('vehicle')}</p>
                  {manufacturer && model ? (
                    <p className="font-semibold text-white">
                      {manufacturer} {model}
                      {engine && <span className="text-muted-foreground font-normal ml-2">({engine})</span>}
                    </p>
                  ) : (
                    <p className="text-muted-foreground">-</p>
                  )}
                </div>

                {/* Selected Tuning */}
                <div className="p-4 bg-secondary rounded-sm border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('type')}</p>
                  {selectedTuning ? (
                    <Badge className="bg-primary/20 text-primary border border-primary/30">
                      {tuningTypes.find(t => t.id === selectedTuning)?.name}
                    </Badge>
                  ) : (
                    <p className="text-muted-foreground">-</p>
                  )}
                </div>

                {/* Total */}
                <div className="p-4 bg-primary/10 rounded-sm border border-primary/30">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Total</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-heading font-bold text-4xl text-primary">
                      {totalCredits}
                    </span>
                    <span className="text-muted-foreground">Credits</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-primary hover:bg-primary/90 font-semibold"
                  disabled={!manufacturer || !model || !engine || !selectedTuning}
                  data-testid="submit-config-btn"
                >
                  {t('newRequest')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
