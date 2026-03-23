import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  Engine,
  Check
} from '@phosphor-icons/react';

// Price list data
const priceCategories = [
  {
    category: { de: 'PKW Diesel', en: 'Car Diesel' },
    items: [
      { service: 'Stage 1', credits: 75, description: { de: 'ECU Optimierung', en: 'ECU Optimization' } },
      { service: 'Stage 2', credits: 120, description: { de: 'Stage 1 + DPF/EGR Lösungen', en: 'Stage 1 + DPF/EGR Solutions' } },
      { service: 'Eco Tuning', credits: 65, description: { de: 'Verbrauchsoptimierung', en: 'Fuel Economy' } },
      { service: 'DPF-Off', credits: 40, description: { de: 'Partikelfilter Deaktivierung', en: 'Particle Filter Deactivation' } },
      { service: 'EGR-Off', credits: 30, description: { de: 'AGR Deaktivierung', en: 'EGR Deactivation' } },
      { service: 'AdBlue-Off', credits: 45, description: { de: 'SCR System Deaktivierung', en: 'SCR System Deactivation' } },
      { service: 'DTC-Off', credits: 25, description: { de: 'Fehlercode Unterdrückung', en: 'Error Code Suppression' } },
    ]
  },
  {
    category: { de: 'PKW Benzin', en: 'Car Petrol' },
    items: [
      { service: 'Stage 1', credits: 75, description: { de: 'ECU Optimierung', en: 'ECU Optimization' } },
      { service: 'Stage 2', credits: 120, description: { de: 'Stage 1 + Pops & Bangs', en: 'Stage 1 + Pops & Bangs' } },
      { service: 'Eco Tuning', credits: 65, description: { de: 'Verbrauchsoptimierung', en: 'Fuel Economy' } },
      { service: 'Vmax-Off', credits: 50, description: { de: 'Geschwindigkeitsbegrenzung aufheben', en: 'Speed Limiter Removal' } },
      { service: 'Launch Control', credits: 55, description: { de: 'Launch Control Aktivierung', en: 'Launch Control Activation' } },
      { service: 'Pops & Bangs', credits: 45, description: { de: 'Auspuff Knallen', en: 'Exhaust Crackle' } },
    ]
  },
  {
    category: { de: 'Nutzfahrzeuge', en: 'Commercial Vehicles' },
    items: [
      { service: 'Stage 1', credits: 95, description: { de: 'ECU Optimierung', en: 'ECU Optimization' } },
      { service: 'Eco Tuning', credits: 85, description: { de: 'Verbrauchsoptimierung', en: 'Fuel Economy' } },
      { service: 'DPF-Off', credits: 55, description: { de: 'Partikelfilter Deaktivierung', en: 'Particle Filter Deactivation' } },
      { service: 'EGR-Off', credits: 40, description: { de: 'AGR Deaktivierung', en: 'EGR Deactivation' } },
      { service: 'AdBlue-Off', credits: 60, description: { de: 'SCR System Deaktivierung', en: 'SCR System Deactivation' } },
    ]
  },
  {
    category: { de: 'Landmaschinen', en: 'Agricultural Vehicles' },
    items: [
      { service: 'Stage 1', credits: 110, description: { de: 'ECU Optimierung', en: 'ECU Optimization' } },
      { service: 'Eco Tuning', credits: 95, description: { de: 'Verbrauchsoptimierung', en: 'Fuel Economy' } },
      { service: 'DPF-Off', credits: 65, description: { de: 'Partikelfilter Deaktivierung', en: 'Particle Filter Deactivation' } },
      { service: 'EGR-Off', credits: 50, description: { de: 'AGR Deaktivierung', en: 'EGR Deactivation' } },
    ]
  },
];

const additionalServices = [
  { service: { de: 'Express Bearbeitung', en: 'Express Processing' }, credits: '+25', description: { de: 'Bearbeitung innerhalb 1 Stunde', en: 'Processing within 1 hour' } },
  { service: { de: 'Wochenend-Service', en: 'Weekend Service' }, credits: '+15', description: { de: 'Bearbeitung am Wochenende', en: 'Weekend processing' } },
  { service: { de: 'Custom Tuning', en: 'Custom Tuning' }, credits: 'ab 150', description: { de: 'Individuelle Abstimmung nach Wunsch', en: 'Custom tuning as requested' } },
];

// Translations
const pageTranslations = {
  en: {
    pageTitle: 'Price List',
    service: 'Service',
    credits: 'Credits',
    description: 'Description',
    additionalServices: 'Additional Services',
    allPricesInCredits: 'All prices in Credits',
    note: 'Prices may vary depending on vehicle and ECU type.',
  },
  de: {
    pageTitle: 'Preisliste',
    service: 'Leistung',
    credits: 'Credits',
    description: 'Beschreibung',
    additionalServices: 'Zusatzleistungen',
    allPricesInCredits: 'Alle Preise in Credits',
    note: 'Preise können je nach Fahrzeug und Steuergerät variieren.',
  }
};

export default function PriceList() {
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-white flex items-center gap-3">
              <ListBullets weight="fill" className="w-7 h-7 text-primary" />
              {t('pageTitle')}
            </h1>
            <p className="text-muted-foreground mt-1">{t('allPricesInCredits')}</p>
          </div>
        </div>

        {/* Price Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {priceCategories.map((category, catIndex) => (
            <Card key={catIndex} className="bg-card border-white/10" data-testid={`price-category-${catIndex}`}>
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  {catIndex < 2 ? (
                    <CarProfile weight="fill" className="w-5 h-5 text-primary" />
                  ) : (
                    <Engine weight="fill" className="w-5 h-5 text-primary" />
                  )}
                  {category.category[language]}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-semibold">{t('service')}</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right">{t('credits')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.items.map((item, itemIndex) => (
                      <TableRow key={itemIndex} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell>
                          <div>
                            <p className="font-medium text-white">{item.service}</p>
                            <p className="text-xs text-muted-foreground">{item.description[language]}</p>
                          </div>
                        </TableCell>
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
          ))}
        </div>

        {/* Additional Services */}
        <Card className="bg-card border-white/10" data-testid="additional-services">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
              <Check weight="fill" className="w-5 h-5 text-primary" />
              {t('additionalServices')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">{t('service')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">{t('description')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">{t('credits')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {additionalServices.map((item, index) => (
                  <TableRow key={index} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-white">{item.service[language]}</TableCell>
                    <TableCell className="text-muted-foreground">{item.description[language]}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-heading font-bold">
                        {item.credits}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Note */}
        <p className="text-sm text-muted-foreground text-center">
          {t('note')}
        </p>
      </div>
    </DashboardLayout>
  );
}
