import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, CarProfile, CheckCircle, Download, FileArrowUp, FileArrowDown,
  CurrencyCircleDollar, Wrench, Note, Copy, Info, Package,
  Upload, Cpu, MagnifyingGlass, Lightning,
  Headset, Clock, Pulse, Warning, XCircle,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import { mockOrders } from './OrdersNew';

const t_data = {
  de: {
    backToOrders: 'Zur\u00FCck zu Auftr\u00E4gen',
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
    ecu: 'Steuerger\u00E4t',
    tuningType: 'Tuning-Typ',
    options: 'Optionen',
    credits: 'Credits',
    originalFile: 'Originaldatei',
    modifiedFile: 'Modifizierte Datei',
    downloadFile: 'Herunterladen',
    noFile: 'Noch nicht verf\u00FCgbar',
    pending: 'Wartend',
    processing: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    noNotes: 'Keine Notizen.',
    copyOrderId: 'Kopieren',
    orderNotFound: 'Auftrag nicht gefunden',
    orderCancelled: 'Auftrag storniert',
    liveStatus: 'LIVE STATUS',
    vehicle: 'FAHRZEUG',
    tuning: 'TUNING',
    file: 'DATEI',
    ph_receiving: 'Datei wird empfangen...',
    ph_receiving_done: 'Datei empfangen',
    ph_winols: 'WinOLS Pr\u00FCfung wird gestartet...',
    ph_scanning: 'WinOLS durchsucht Datenbank...',
    ph_match: 'Match gefunden! File existiert bereits',
    ph_no_match: 'Kein Match gefunden',
    ph_auto: 'File wird automatisch erstellt...',
    ph_support: 'Wird vom Support bearbeitet',
    ph_done_auto: 'File erstellt & bereit zum Download',
    ph_done_support: 'Support wurde benachrichtigt',
    auto_info: 'WinOLS hat eine passende Konfiguration gefunden. Das File wird automatisch generiert.',
    support_info: 'Diese Konfiguration muss manuell erstellt werden. Unser Support-Team wurde benachrichtigt.',
    support_time: 'Gesch\u00E4tzte Bearbeitungszeit: 30-60 Minuten',
    support_handling: 'Wird vom Support bearbeitet',
    download_ready: 'Dein modifiziertes File ist bereit!',
    step_received: 'Datei empfangen',
    step_check_db: 'Check Database',
    step_no_match: 'Kein Match gefunden',
    step_manual: 'Manuelle Bearbeitung',
    step_support_notified: 'Support benachrichtigt',
  },
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
    noNotes: 'No notes.',
    copyOrderId: 'Copy',
    orderNotFound: 'Order not found',
    orderCancelled: 'Order Cancelled',
    liveStatus: 'LIVE STATUS',
    vehicle: 'VEHICLE',
    tuning: 'TUNING',
    file: 'FILE',
    ph_receiving: 'Receiving file...',
    ph_receiving_done: 'File received',
    ph_winols: 'Starting WinOLS check...',
    ph_scanning: 'WinOLS scanning database...',
    ph_match: 'Match found! File already exists',
    ph_no_match: 'No match found',
    ph_auto: 'File is being auto-created...',
    ph_support: 'Being handled by support',
    ph_done_auto: 'File created & ready for download',
    ph_done_support: 'Support has been notified',
    auto_info: 'WinOLS found a matching configuration. The file is being auto-generated.',
    support_info: 'This configuration needs manual creation. Our support team has been notified.',
    support_time: 'Estimated processing time: 30-60 minutes',
    support_handling: 'Being handled by support',
    download_ready: 'Your modified file is ready!',
    step_received: 'File received',
    step_check_db: 'Check Database',
    step_no_match: 'No match found',
    step_manual: 'Manual processing',
    step_support_notified: 'Support notified',
  },
};

// ─── Horizontal Status Stepper (static, for pending/processing orders) ──
function StatusStepper({ order, t }) {
  // Steps for horizontal display
  const steps = [
    { id: 'received', label: t('step_received'), icon: Upload, status: 'done' },
    { id: 'check', label: t('step_check_db'), icon: Cpu, status: 'done' },
    { id: 'nomatch', label: t('step_no_match'), icon: XCircle, status: 'error' },
    { id: 'manual', label: t('step_manual'), sub: t('step_support_notified'), icon: Headset, status: 'active' },
  ];

  return (
    <div className="space-y-6">
      {/* Horizontal stepper */}
      <Card className="bg-card border-border" data-testid="status-stepper">
        <CardContent className="p-6">
          <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
            <Pulse weight="bold" className="w-3.5 h-3.5" />
            {t('orderStatus')}
          </label>

          <div className="flex items-start" data-testid="stepper-row">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isLast = idx === steps.length - 1;
              return (
                <div key={step.id} className="flex items-start flex-1 min-w-0" data-testid={`stepper-${step.id}`}>
                  {/* Step circle + label */}
                  <div className="flex flex-col items-center text-center flex-1">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all",
                      step.status === 'done' && "bg-green-500/15 border-green-500",
                      step.status === 'error' && "bg-red-500/15 border-red-500",
                      step.status === 'active' && "bg-yellow-500/15 border-yellow-500",
                    )}>
                      {step.status === 'done' && <CheckCircle weight="fill" className="w-5 h-5 text-green-500" />}
                      {step.status === 'error' && <Icon weight="fill" className="w-5 h-5 text-red-400" />}
                      {step.status === 'active' && <Icon weight="fill" className="w-5 h-5 text-yellow-400" />}
                    </div>
                    <p className={cn(
                      "text-xs font-semibold leading-tight",
                      step.status === 'done' && "text-green-400",
                      step.status === 'error' && "text-red-400",
                      step.status === 'active' && "text-foreground",
                    )}>
                      {step.label}
                    </p>
                    {step.sub && (
                      <p className="text-[10px] text-yellow-400 font-medium mt-0.5">{step.sub}</p>
                    )}
                  </div>

                  {/* Connector line */}
                  {!isLast && (
                    <div className="flex items-center pt-5 -mx-1">
                      <div className={cn(
                        "h-[2px] w-8 md:w-12 lg:w-16",
                        idx < 1 ? "bg-green-500/60" :
                        idx === 1 ? "bg-red-500/40" :
                        "bg-border"
                      )} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Support info panel */}
      <Card className="bg-blue-500/5 border-blue-500/20" data-testid="support-panel">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Headset weight="fill" className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-blue-400">{t('support_handling')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('support_info')}</p>
              <p className="text-xs text-yellow-400 font-semibold mt-2 flex items-center gap-1.5">
                <Clock weight="fill" className="w-3.5 h-3.5" />
                {t('support_time')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Completed View ─────────────────────────────────────────────────
function CompletedView({ order, t }) {
  return (
    <div className="space-y-6">
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
            {[
              ['manufacturer', order.vehicle.manufacturer],
              ['model', order.vehicle.model],
              ['series', order.vehicle.series],
              ['year', order.vehicle.year],
              ['engine', order.vehicle.engine],
              ['power', order.vehicle.power],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t(k)}</p>
                <p className="font-semibold text-foreground mt-1">{v}</p>
              </div>
            ))}
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
              <Badge className="mt-2 bg-primary/20 text-primary border border-primary/30 text-sm">{order.tuning.type}</Badge>
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
                    <Badge key={idx} variant="outline" className="bg-secondary border-border">{opt}</Badge>
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
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-sm border border-border">
            <div className="flex items-center gap-3">
              <FileArrowUp weight="fill" className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('originalFile')}</p>
                <p className="font-mono text-sm text-foreground mt-0.5">{order.files.original}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Download weight="regular" className="w-4 h-4 mr-2" /> {t('downloadFile')}
            </Button>
          </div>
          <div className={cn("flex items-center justify-between p-4 rounded-sm border", order.files.modified ? "bg-green-500/5 border-green-500/20" : "bg-secondary border-border")}>
            <div className="flex items-center gap-3">
              <FileArrowDown weight="fill" className={cn("w-5 h-5", order.files.modified ? "text-green-500" : "text-muted-foreground")} />
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('modifiedFile')}</p>
                <p className={cn("font-mono text-sm mt-0.5", order.files.modified ? "text-foreground" : "text-muted-foreground")}>
                  {order.files.modified || t('noFile')}
                </p>
              </div>
            </div>
            {order.files.modified && (
              <Button className="bg-green-600 hover:bg-green-700" data-testid="download-modified">
                <Download weight="bold" className="w-4 h-4 mr-2" /> {t('downloadFile')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => t_data[language]?.[key] || key;

  const order = mockOrders.find(o => o.id === id);

  if (!order) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20">
          <Info weight="fill" className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="font-heading font-semibold text-xl text-foreground">{t('orderNotFound')}</h2>
          <Button variant="outline" className="mt-4 border-border" onClick={() => navigate('/orders')}>
            <ArrowLeft weight="bold" className="w-4 h-4 mr-2" /> {t('backToOrders')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isInProgress = order.status === 'pending' || order.status === 'processing';

  const statusBadge = {
    pending: { cls: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', label: t('pending') },
    processing: { cls: 'bg-primary/15 text-primary border-primary/30', label: t('processing') },
    completed: { cls: 'bg-green-500/15 text-green-400 border-green-500/30', label: t('completed') },
    cancelled: { cls: 'bg-red-500/15 text-red-400 border-red-500/30', label: t('cancelled') },
  }[order.status];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => navigate('/orders')} data-testid="back-btn">
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                {isInProgress && (
                  <div className="relative">
                    <Pulse weight="fill" className="w-6 h-6 text-primary" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                )}
                {!isInProgress && <CheckCircle weight="fill" className={cn("w-6 h-6", order.status === 'completed' ? "text-green-500" : "text-red-400")} />}
                <h1 className="font-heading font-bold text-2xl text-foreground">{order.id}</h1>
                <Badge className={cn("text-xs", statusBadge.cls)}>{statusBadge.label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {order.vehicle.manufacturer} {order.vehicle.model} {order.vehicle.series} &mdash; {order.tuning.type}
              </p>
            </div>
          </div>
          {order.status === 'completed' && order.files.modified && (
            <Button className="btn-gradient text-white font-bold" data-testid="download-modified-btn">
              <Download weight="bold" className="w-4 h-4 mr-2" /> {t('downloadFile')}
            </Button>
          )}
        </div>

        {/* Content: Different layout based on status */}
        {isInProgress ? (
          /* ── In Progress: Live Tracking (like OrderLive) ── */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* LEFT: Static Status Stepper */}
            <StatusStepper order={order} t={t} />

            {/* RIGHT: Order Summary Cards */}
            <div className="space-y-4">
              {/* Vehicle */}
              <Card className="bg-card border-border" data-testid="summary-vehicle">
                <CardContent className="p-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                    <CarProfile weight="bold" className="w-3.5 h-3.5" />
                    {t('vehicle')}
                  </label>
                  <div className="space-y-2">
                    {[
                      [t('manufacturer'), order.vehicle.manufacturer],
                      [t('series'), order.vehicle.series],
                      [t('model'), order.vehicle.model],
                      [t('engine'), order.vehicle.engine],
                      [t('power'), order.vehicle.power],
                      [t('ecu'), order.vehicle.ecu],
                    ].map(([l, v]) => (
                      <div key={l} className="flex justify-between py-1.5 border-b border-border/40 last:border-0">
                        <span className="text-xs text-muted-foreground">{l}</span>
                        <span className="text-xs font-semibold text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tuning */}
              <Card className="bg-card border-border" data-testid="summary-tuning">
                <CardContent className="p-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                    <Lightning weight="bold" className="w-3.5 h-3.5" />
                    {t('tuning')}
                  </label>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1.5 border-b border-border/40">
                      <span className="text-xs text-muted-foreground">{t('tuningType')}</span>
                      <Badge className="bg-primary/15 text-primary border-primary/30 text-xs">{order.tuning.type}</Badge>
                    </div>
                    {order.tuning.options.length > 0 && (
                      <div className="py-1.5 border-b border-border/40">
                        <span className="text-xs text-muted-foreground block mb-2">{t('options')}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {order.tuning.options.map(opt => (
                            <span key={opt} className="text-[10px] font-semibold bg-secondary/80 border border-border px-2 py-1 rounded-sm text-foreground">{opt}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between py-1.5">
                      <span className="text-xs text-muted-foreground">{t('credits')}</span>
                      <span className="text-sm font-bold text-primary">{order.credits} Credits</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* File */}
              <Card className="bg-card border-border" data-testid="summary-file">
                <CardContent className="p-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                    <Upload weight="bold" className="w-3.5 h-3.5" />
                    {t('file')}
                  </label>
                  <div className="py-1.5">
                    <span className="text-xs text-muted-foreground block mb-1">{t('originalFile')}</span>
                    <span className="text-xs font-mono font-semibold text-foreground break-all">{order.files.original}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              {order.notes && (
                <Card className="bg-card border-border" data-testid="summary-notes">
                  <CardContent className="p-5">
                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                      <Note weight="bold" className="w-3.5 h-3.5" />
                      {t('notes')}
                    </label>
                    <p className="text-xs text-muted-foreground leading-relaxed">{order.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* ── Completed/Cancelled: Detail Cards View ── */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CompletedView order={order} t={t} />
            </div>
            <div className="space-y-6">
              {/* Status card */}
              <Card className="bg-card border-border" data-testid="order-status-card">
                <CardHeader className="border-b border-border pb-4">
                  <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2 uppercase tracking-wider">
                    <Package weight="fill" className="w-5 h-5 text-primary" />
                    {t('orderStatus')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center py-4">
                    {order.status === 'completed' ? (
                      <>
                        <CheckCircle weight="fill" className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-lg font-bold text-green-400">{t('completed')}</p>
                      </>
                    ) : (
                      <>
                        <Warning weight="fill" className="w-12 h-12 text-red-400 mx-auto mb-3" />
                        <p className="text-lg font-bold text-red-400">{t('orderCancelled')}</p>
                      </>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(order.updatedAt))}
                    </p>
                  </div>
                </CardContent>
              </Card>

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
        )}
      </div>
    </DashboardLayout>
  );
}
