import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  ArrowLeft,
  CarProfile,
  Engine,
  Gauge,
  CalendarBlank,
  Clock,
  CheckCircle,
  Spinner,
  XCircle,
  Download,
  FileArrowUp,
  FileArrowDown,
  CurrencyCircleDollar,
  Wrench,
  Note,
  Copy,
  Info
} from '@phosphor-icons/react';
import { mockOrders } from './OrdersNew';

// Translations
const pageTranslations = {
  en: {
    backToOrders: 'Back to Orders',
    orderDetails: 'Order Details',
    vehicleInfo: 'Vehicle Information',
    tuningInfo: 'Tuning Configuration',
    filesInfo: 'Files',
    timeline: 'Timeline',
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
    orderCreated: 'Order Created',
    lastUpdated: 'Last Updated',
    status: 'Status',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    noNotes: 'No notes for this order.',
    copyOrderId: 'Copy Order ID',
    orderNotFound: 'Order not found',
  },
  de: {
    backToOrders: 'Zurück zu Aufträgen',
    orderDetails: 'Auftragsdetails',
    vehicleInfo: 'Fahrzeuginformationen',
    tuningInfo: 'Tuning-Konfiguration',
    filesInfo: 'Dateien',
    timeline: 'Zeitverlauf',
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
    orderCreated: 'Auftrag erstellt',
    lastUpdated: 'Zuletzt aktualisiert',
    status: 'Status',
    pending: 'Wartend',
    processing: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    noNotes: 'Keine Notizen für diesen Auftrag.',
    copyOrderId: 'Auftragsnummer kopieren',
    orderNotFound: 'Auftrag nicht gefunden',
  }
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
          <h2 className="font-heading font-semibold text-xl text-white">{t('orderNotFound')}</h2>
          <Button 
            variant="outline" 
            className="mt-4 border-white/10"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
            {t('backToOrders')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-400', 
        border: 'border-yellow-500/30', 
        icon: Clock,
        label: t('pending')
      },
      processing: { 
        bg: 'bg-blue-500/20', 
        text: 'text-blue-400', 
        border: 'border-blue-500/30', 
        icon: Spinner,
        label: t('processing')
      },
      completed: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-400', 
        border: 'border-green-500/30', 
        icon: CheckCircle,
        label: t('completed')
      },
      cancelled: { 
        bg: 'bg-red-500/20', 
        text: 'text-red-400', 
        border: 'border-red-500/30', 
        icon: XCircle,
        label: t('cancelled')
      },
    };
    return configs[status] || configs.pending;
  };

  const formatDateTime = (dateStr) => {
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

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
              className="text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={() => navigate('/orders')}
              data-testid="back-btn"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-bold text-2xl text-white">{order.id}</h1>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5"
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
            <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} gap-1 px-3 py-1.5`}>
              <StatusIcon weight="fill" className="w-4 h-4" />
              {statusConfig.label}
            </Badge>
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
            <Card className="bg-card border-white/10" data-testid="vehicle-info-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <CarProfile weight="fill" className="w-5 h-5 text-primary" />
                  {t('vehicleInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('manufacturer')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('model')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.model}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('series')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.series}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('year')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.year}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('engine')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.engine}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('power')}</p>
                    <p className="font-semibold text-white mt-1">{order.vehicle.power}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('ecu')}</p>
                    <p className="font-semibold text-white mt-1 font-mono">{order.vehicle.ecu}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tuning Info */}
            <Card className="bg-card border-white/10" data-testid="tuning-info-card">
              <CardHeader className="border-b border-white/10 pb-4">
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
                          <Badge key={idx} variant="outline" className="bg-secondary border-white/10">
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
            <Card className="bg-card border-white/10" data-testid="files-info-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <FileArrowUp weight="fill" className="w-5 h-5 text-primary" />
                  {t('filesInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Original File */}
                  <div className="flex items-center justify-between p-4 bg-secondary rounded-sm border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm bg-white/5 flex items-center justify-center">
                        <FileArrowUp weight="fill" className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('originalFile')}</p>
                        <p className="font-mono text-sm text-white mt-0.5">{order.files.original}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-muted-foreground hover:text-white hover:bg-white/5"
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
                      : 'bg-secondary border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                        order.files.modified ? 'bg-green-500/10' : 'bg-white/5'
                      }`}>
                        <FileArrowDown weight="fill" className={`w-5 h-5 ${
                          order.files.modified ? 'text-green-500' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('modifiedFile')}</p>
                        <p className={`font-mono text-sm mt-0.5 ${
                          order.files.modified ? 'text-white' : 'text-muted-foreground'
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

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline */}
            <Card className="bg-card border-white/10" data-testid="timeline-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <CalendarBlank weight="fill" className="w-5 h-5 text-primary" />
                  {t('timeline')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock weight="fill" className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('orderCreated')}</p>
                      <p className="text-sm text-white font-medium">{formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${statusConfig.bg}`}>
                      <StatusIcon weight="fill" className={`w-4 h-4 ${statusConfig.text}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('lastUpdated')}</p>
                      <p className="text-sm text-white font-medium">{formatDateTime(order.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="bg-card border-white/10" data-testid="notes-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Note weight="fill" className="w-5 h-5 text-primary" />
                  {t('notes')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {order.notes ? (
                  <p className="text-sm text-muted-foreground leading-relaxed">{order.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">{t('noNotes')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
