import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  CarProfile,
  CheckCircle,
  Download,
  FileArrowUp,
  FileArrowDown,
  CurrencyCircleDollar,
  Wrench,
  Note,
  Copy,
  Info,
  Package
} from '@phosphor-icons/react';
import { mockOrders } from './OrdersNew';

// Progress steps configuration
const progressSteps = {
  en: [
    { key: 'received', label: 'Request Received' },
    { key: 'analysis', label: 'File Analysis' },
    { key: 'processing', label: 'Processing' },
    { key: 'quality', label: 'Quality Check' },
    { key: 'completed', label: 'Completed' },
  ],
  de: [
    { key: 'received', label: 'Anfrage eingegangen' },
    { key: 'analysis', label: 'Datei-Analyse' },
    { key: 'processing', label: 'In Bearbeitung' },
    { key: 'quality', label: 'Qualitätsprüfung' },
    { key: 'completed', label: 'Abgeschlossen' },
  ]
};

// Map order status to progress step index
const statusToProgress = {
  pending: 0,      // Just received
  processing: 2,   // Processing
  completed: 5,    // Completed (all steps done)
  cancelled: -1,   // Cancelled (special case)
};

// Translations
const pageTranslations = {
  en: {
    backToOrders: 'Back to Orders',
    orderDetails: 'Order Details',
    orderStatus: 'Order Status',
    vehicleInfo: 'Vehicle Information',
    tuningInfo: 'Tuning Configuration',
    filesInfo: 'Files',
    notes: 'Notes',
    manufacturer: 'Manufacturer',
    model: 'Model',
    series: 'Series',
    year: 'Year',
    engine: 'Engine',
    power: 'Power',
    ecu: 'ECU',
    tuningType: 'Tuning Type',
    options: 'Options',
    credits: 'Credits',
    originalFile: 'Original File',
    modifiedFile: 'Modified File',
    downloadFile: 'Download',
    noFile: 'Not available yet',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    noNotes: 'No notes for this order.',
    copyOrderId: 'Copy Order ID',
    orderNotFound: 'Order not found',
    orderCancelled: 'Order Cancelled',
  },
  de: {
    backToOrders: 'Zurück zu Aufträgen',
    orderDetails: 'Auftragsdetails',
    orderStatus: 'Auftragsstatus',
    vehicleInfo: 'Fahrzeuginformationen',
    tuningInfo: 'Tuning-Konfiguration',
    filesInfo: 'Dateien',
    notes: 'Notizen',
    manufacturer: 'Hersteller',
    model: 'Modell',
    series: 'Baureihe',
    year: 'Baujahr',
    engine: 'Motor',
    power: 'Leistung',
    ecu: 'Steuergerät',
    tuningType: 'Tuning-Typ',
    options: 'Optionen',
    credits: 'Credits',
    originalFile: 'Originaldatei',
    modifiedFile: 'Modifizierte Datei',
    downloadFile: 'Herunterladen',
    noFile: 'Noch nicht verfügbar',
    pending: 'Wartend',
    processing: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    noNotes: 'Keine Notizen für diesen Auftrag.',
    copyOrderId: 'Auftragsnummer kopieren',
    orderNotFound: 'Auftrag nicht gefunden',
    orderCancelled: 'Auftrag storniert',
  }
};

// Progress Timeline Component
const ProgressTimeline = ({ order, language, t }) => {
  const steps = progressSteps[language] || progressSteps.en;
  const currentStepIndex = statusToProgress[order.status];
  const isCancelled = order.status === 'cancelled';

  // Generate mock dates for each completed step
  const getStepDate = (index) => {
    if (index > currentStepIndex && !isCancelled) return null;
    const baseDate = new Date(order.createdAt);
    baseDate.setHours(baseDate.getHours() + (index * 2)); // Add 2 hours per step
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(baseDate);
  };

  return (
    <Card className="bg-card border-border" data-testid="order-status-card">
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2 uppercase tracking-wider">
          <Package weight="fill" className="w-5 h-5 text-primary" />
          {t('orderStatus')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Vehicle & Order Info */}
        <div className="mb-6">
          <h3 className="font-heading font-bold text-xl text-foreground">
            {order.vehicle.manufacturer} {order.vehicle.model} {order.vehicle.series} — {order.tuning.type}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Auftrag #{order.id}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          {steps.map((step, index) => {
            const isCompleted = !isCancelled && index < currentStepIndex;
            const isCurrent = !isCancelled && index === currentStepIndex;
            const isPending = !isCancelled && index > currentStepIndex;
            const stepDate = getStepDate(index);

            return (
              <div key={step.key} className="relative">
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-[15px] top-[32px] w-[2px] h-[48px] ${
                      isCompleted ? 'bg-green-500' : 'bg-white/10'
                    }`}
                  />
                )}
                
                {/* Step */}
                <div className="flex items-start gap-4 pb-6">
                  {/* Circle Indicator */}
                  <div className="relative z-10">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center">
                        <CheckCircle weight="fill" className="w-5 h-5 text-green-500" />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full border-2 border-white/20 bg-transparent" />
                    )}
                  </div>
                  
                  {/* Step Content */}
                  <div className="flex-1 pt-1">
                    <p className={`font-semibold ${
                      isCurrent ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </p>
                    {stepDate && (
                      <p className="text-sm text-muted-foreground mt-0.5">{stepDate}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cancelled State */}
          {isCancelled && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-sm">
              <p className="text-red-400 font-semibold">{t('orderCancelled')}</p>
              <p className="text-sm text-muted-foreground mt-1">{order.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;

  // Find order
  const order = mockOrders.find(o => o.id === id);

  if (!order) {
    return (
      <DashboardLayout title={t('orderDetails')}>
        <div className="flex flex-col items-center justify-center py-20">
          <Info weight="fill" className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="font-heading font-semibold text-xl text-foreground">{t('orderNotFound')}</h2>
          <Button 
            variant="outline" 
            className="mt-4 border-border"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
            {t('backToOrders')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout title={t('orderDetails')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
              onClick={() => navigate('/orders')}
              data-testid="back-btn"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-bold text-2xl text-foreground">{order.id}</h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  onClick={() => copyToClipboard(order.id)}
                  data-testid="copy-order-id"
                >
                  <Copy weight="regular" className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground mt-1">
                {order.vehicle.manufacturer} {order.vehicle.model} {order.vehicle.series}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {order.status === 'completed' && order.files.modified && (
              <Button className="bg-primary hover:bg-primary/90" data-testid="download-modified-btn">
                <Download weight="bold" className="w-4 h-4 mr-2" />
                {t('downloadFile')}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Info */}
            <Card className="bg-card border-border" data-testid="vehicle-info-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <CarProfile weight="fill" className="w-5 h-5 text-primary" />
                  {t('vehicleInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('manufacturer')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('model')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('series')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.series}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('year')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('engine')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.engine}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('power')}</p>
                    <p className="font-semibold text-foreground mt-1">{order.vehicle.power}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('ecu')}</p>
                    <p className="font-semibold text-foreground mt-1 font-mono">{order.vehicle.ecu}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tuning Info */}
            <Card className="bg-card border-border" data-testid="tuning-info-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Wrench weight="fill" className="w-5 h-5 text-primary" />
                  {t('tuningInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('tuningType')}</p>
                    <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 text-sm">
                      {order.tuning.type}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('credits')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <CurrencyCircleDollar weight="fill" className="w-5 h-5 text-primary" />
                      <span className="font-heading font-bold text-2xl text-primary">{order.credits}</span>
                    </div>
                  </div>
                  {order.tuning.options.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{t('options')}</p>
                      <div className="flex flex-wrap gap-2">
                        {order.tuning.options.map((opt, idx) => (
                          <Badge key={idx} variant="outline" className="bg-secondary border-border">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Files */}
            <Card className="bg-card border-border" data-testid="files-info-card">
              <CardHeader className="border-b border-border pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <FileArrowUp weight="fill" className="w-5 h-5 text-primary" />
                  {t('filesInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Original File */}
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-sm border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-secondary flex items-center justify-center">
                        <FileArrowUp weight="fill" className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('originalFile')}</p>
                        <p className="font-mono text-sm text-foreground mt-0.5">{order.files.original}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                      data-testid="download-original"
                    >
                      <Download weight="regular" className="w-4 h-4 mr-2" />
                      {t('downloadFile')}
                    </Button>
                  </div>
                  
                  {/* Modified File */}
                  <div className={`flex items-center justify-between p-4 rounded-sm border ${
                    order.files.modified 
                      ? 'bg-green-500/5 border-green-500/20' 
                      : 'bg-secondary border-border'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                        order.files.modified ? 'bg-green-500/10' : 'bg-secondary'
                      }`}>
                        <FileArrowDown weight="fill" className={`w-5 h-5 ${
                          order.files.modified ? 'text-green-500' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('modifiedFile')}</p>
                        <p className={`font-mono text-sm mt-0.5 ${
                          order.files.modified ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {order.files.modified || t('noFile')}
                        </p>
                      </div>
                    </div>
                    {order.files.modified && (
                      <Button 
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="download-modified"
                      >
                        <Download weight="bold" className="w-4 h-4 mr-2" />
                        {t('downloadFile')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Order Status Progress */}
          <div className="space-y-6">
            {/* Progress Timeline */}
            <ProgressTimeline order={order} language={language} t={t} />

            {/* Notes */}
            {order.notes && order.status !== 'cancelled' && (
              <Card className="bg-card border-border" data-testid="notes-card">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                    <Note weight="fill" className="w-5 h-5 text-primary" />
                    {t('notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{order.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
