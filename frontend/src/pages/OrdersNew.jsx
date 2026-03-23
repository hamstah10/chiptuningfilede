import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  ClockCounterClockwise, 
  CarProfile,
  MagnifyingGlass,
  FunnelSimple,
  Eye,
  Download,
  Clock,
  CheckCircle,
  Spinner,
  XCircle,
  ArrowRight,
  CalendarBlank,
  Engine,
  Gauge
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

// Mock data for orders
export const mockOrders = [
  { 
    id: 'TF-2025-0089', 
    createdAt: '2025-01-15T14:30:00',
    updatedAt: '2025-01-15T16:45:00',
    vehicle: {
      manufacturer: 'BMW',
      model: '330d',
      series: 'E90',
      year: 2011,
      engine: '3.0 TDI',
      power: '245 PS',
      ecu: 'Bosch EDC17',
    },
    tuning: {
      type: 'Stage 1',
      options: ['DPF-Off', 'EGR-Off'],
    },
    status: 'completed',
    credits: 75,
    files: {
      original: 'BMW_330d_E90_original.bin',
      modified: 'BMW_330d_E90_stage1.bin',
    },
    notes: 'Kunde wünscht maximale Leistung ohne Rauchentwicklung.',
  },
  { 
    id: 'TF-2025-0088', 
    createdAt: '2025-01-14T10:15:00',
    updatedAt: '2025-01-14T10:15:00',
    vehicle: {
      manufacturer: 'Audi',
      model: 'A4',
      series: 'B8',
      year: 2015,
      engine: '2.0 TDI',
      power: '190 PS',
      ecu: 'Bosch EDC17C46',
    },
    tuning: {
      type: 'Stage 2',
      options: ['DPF-Off', 'EGR-Off', 'AdBlue-Off'],
    },
    status: 'processing',
    credits: 120,
    files: {
      original: 'Audi_A4_B8_original.bin',
      modified: null,
    },
    notes: 'Downpipe bereits verbaut.',
  },
  { 
    id: 'TF-2025-0087', 
    createdAt: '2025-01-13T09:00:00',
    updatedAt: '2025-01-13T11:30:00',
    vehicle: {
      manufacturer: 'Volkswagen',
      model: 'Golf 7',
      series: 'GTI',
      year: 2018,
      engine: '2.0 TSI',
      power: '230 PS',
      ecu: 'Bosch MED17.5.2',
    },
    tuning: {
      type: 'Eco Tuning',
      options: [],
    },
    status: 'completed',
    credits: 65,
    files: {
      original: 'VW_Golf7_GTI_original.bin',
      modified: 'VW_Golf7_GTI_eco.bin',
    },
    notes: '',
  },
  { 
    id: 'TF-2025-0086', 
    createdAt: '2025-01-12T16:45:00',
    updatedAt: '2025-01-12T16:45:00',
    vehicle: {
      manufacturer: 'Mercedes-Benz',
      model: 'C220d',
      series: 'W205',
      year: 2019,
      engine: '2.0 CDI',
      power: '194 PS',
      ecu: 'Bosch EDC17C57',
    },
    tuning: {
      type: 'Stage 1',
      options: ['EGR-Off'],
    },
    status: 'pending',
    credits: 75,
    files: {
      original: 'Mercedes_C220d_W205_original.bin',
      modified: null,
    },
    notes: 'Bitte auch Pops & Bangs wenn möglich.',
  },
  { 
    id: 'TF-2025-0085', 
    createdAt: '2025-01-10T11:20:00',
    updatedAt: '2025-01-10T14:00:00',
    vehicle: {
      manufacturer: 'Porsche',
      model: 'Cayenne',
      series: '958',
      year: 2016,
      engine: '3.0 V6 Diesel',
      power: '262 PS',
      ecu: 'Bosch EDC17CP44',
    },
    tuning: {
      type: 'Custom',
      options: ['DPF-Off', 'EGR-Off', 'Vmax-Off', 'Start-Stop-Off'],
    },
    status: 'completed',
    credits: 150,
    files: {
      original: 'Porsche_Cayenne_958_original.bin',
      modified: 'Porsche_Cayenne_958_custom.bin',
    },
    notes: 'Vmax-Aufhebung und Komfortfunktionen.',
  },
  { 
    id: 'TF-2025-0084', 
    createdAt: '2025-01-08T08:30:00',
    updatedAt: '2025-01-08T08:30:00',
    vehicle: {
      manufacturer: 'BMW',
      model: 'X5',
      series: 'F15',
      year: 2017,
      engine: '3.0d',
      power: '258 PS',
      ecu: 'Bosch EDC17C56',
    },
    tuning: {
      type: 'Stage 1',
      options: ['DPF-Off'],
    },
    status: 'cancelled',
    credits: 75,
    files: {
      original: 'BMW_X5_F15_original.bin',
      modified: null,
    },
    notes: 'Storniert - Kunde hat falsches File hochgeladen.',
  },
];

// Translations
const pageTranslations = {
  en: {
    pageTitle: 'Orders',
    allOrders: 'All Orders',
    searchPlaceholder: 'Search order or vehicle...',
    filterByStatus: 'Status',
    allStatus: 'All Status',
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    cancelled: 'Cancelled',
    orderNumber: 'Order #',
    vehicle: 'Vehicle',
    tuningType: 'Tuning',
    status: 'Status',
    date: 'Date',
    credits: 'Credits',
    actions: 'Actions',
    viewDetails: 'View Details',
    download: 'Download',
    noOrders: 'No orders found',
    totalOrders: 'Total Orders',
    inProgress: 'In Progress',
    awaitingReview: 'Awaiting Review',
  },
  de: {
    pageTitle: 'Aufträge',
    allOrders: 'Alle Aufträge',
    searchPlaceholder: 'Auftrag oder Fahrzeug suchen...',
    filterByStatus: 'Status',
    allStatus: 'Alle Status',
    pending: 'Wartend',
    processing: 'In Bearbeitung',
    completed: 'Abgeschlossen',
    cancelled: 'Storniert',
    orderNumber: 'Auftrag #',
    vehicle: 'Fahrzeug',
    tuningType: 'Tuning',
    status: 'Status',
    date: 'Datum',
    credits: 'Credits',
    actions: 'Aktionen',
    viewDetails: 'Details ansehen',
    download: 'Download',
    noOrders: 'Keine Aufträge gefunden',
    totalOrders: 'Gesamt Aufträge',
    inProgress: 'In Bearbeitung',
    awaitingReview: 'Warten auf Prüfung',
  }
};

export default function OrdersNew() {
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const statusMatch = statusFilter === 'all' || order.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Stats
  const stats = {
    total: mockOrders.length,
    completed: mockOrders.filter(o => o.status === 'completed').length,
    processing: mockOrders.filter(o => o.status === 'processing').length,
    pending: mockOrders.filter(o => o.status === 'pending').length,
  };

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

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <DashboardLayout title={t('pageTitle')}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="orders-stats">
          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalOrders')}</p>
                  <p className="font-heading font-bold text-3xl text-white mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                  <ClockCounterClockwise weight="fill" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('completed')}</p>
                  <p className="font-heading font-bold text-3xl text-green-400 mt-2">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-green-500/10 flex items-center justify-center">
                  <CheckCircle weight="fill" className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('inProgress')}</p>
                  <p className="font-heading font-bold text-3xl text-blue-400 mt-2">{stats.processing}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-blue-500/10 flex items-center justify-center">
                  <Spinner weight="fill" className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('awaitingReview')}</p>
                  <p className="font-heading font-bold text-3xl text-yellow-400 mt-2">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-yellow-500/10 flex items-center justify-center">
                  <Clock weight="fill" className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Orders List */}
        <Card className="bg-card border-white/10" data-testid="orders-list-card">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <ClockCounterClockwise weight="fill" className="w-5 h-5 text-primary" />
                {t('allOrders')}
              </CardTitle>
              
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-9 bg-secondary border-white/10"
                    data-testid="orders-search"
                  />
                </div>
                
                {/* Status Filter */}
                <FunnelSimple weight="bold" className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 bg-secondary border-white/10" data-testid="status-filter">
                    <SelectValue placeholder={t('filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">{t('allStatus')}</SelectItem>
                    <SelectItem value="pending">{t('pending')}</SelectItem>
                    <SelectItem value="processing">{t('processing')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                    <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredOrders.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filteredOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div 
                      key={order.id}
                      className="p-4 hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/orders/${order.id}`)}
                      data-testid={`order-item-${order.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Vehicle Icon */}
                          <div className="w-14 h-14 rounded-sm bg-secondary flex items-center justify-center border border-white/10">
                            <CarProfile weight="fill" className="w-7 h-7 text-primary" />
                          </div>
                          
                          {/* Order Info */}
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-sm text-primary font-semibold">{order.id}</span>
                              <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} gap-1`}>
                                <StatusIcon weight="fill" className="w-3 h-3" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-white mt-1">
                              {order.vehicle.manufacturer} {order.vehicle.model} {order.vehicle.series}
                            </h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Engine weight="regular" className="w-4 h-4" />
                                {order.vehicle.engine} - {order.vehicle.power}
                              </span>
                              <span className="flex items-center gap-1">
                                <Gauge weight="regular" className="w-4 h-4" />
                                {order.tuning.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarBlank weight="regular" className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Side */}
                        <div className="flex items-center gap-6">
                          {/* Options Tags */}
                          {order.tuning.options.length > 0 && (
                            <div className="hidden lg:flex items-center gap-2">
                              {order.tuning.options.slice(0, 3).map((opt, idx) => (
                                <Badge key={idx} variant="outline" className="bg-secondary border-white/10 text-xs">
                                  {opt}
                                </Badge>
                              ))}
                              {order.tuning.options.length > 3 && (
                                <Badge variant="outline" className="bg-secondary border-white/10 text-xs">
                                  +{order.tuning.options.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* Credits */}
                          <div className="text-right">
                            <p className="font-heading font-bold text-xl text-primary">{order.credits}</p>
                            <p className="text-xs text-muted-foreground">Credits</p>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {order.status === 'completed' && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                onClick={(e) => { e.stopPropagation(); }}
                                data-testid={`download-${order.id}`}
                              >
                                <Download weight="regular" className="w-5 h-5" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 text-muted-foreground hover:text-white hover:bg-white/5"
                              onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}
                              data-testid={`view-${order.id}`}
                            >
                              <ArrowRight weight="bold" className="w-5 h-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {t('noOrders')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
