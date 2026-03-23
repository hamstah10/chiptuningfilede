import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CurrencyCircleDollar, 
  ClockCounterClockwise, 
  CheckCircle, 
  Wallet,
  Plus,
  ArrowRight,
  CarProfile,
  Lightning,
  Package,
  Clock
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from './OrdersNew';

// Mock user data - will come from API
const mockUser = {
  name: 'Max Mustermann',
  credits: 1250,
  pendingOrders: 3,
  completedFiles: 47,
  totalSpent: 4580,
};

const mockActivity = [
  { id: 1, type: 'file', vehicle: 'BMW 330d E90', status: 'completed', date: '2025-01-15', credits: 75 },
  { id: 2, type: 'credits', amount: 500, date: '2025-01-14' },
  { id: 3, type: 'file', vehicle: 'Audi A4 2.0 TDI', status: 'processing', date: '2025-01-14', credits: 85 },
  { id: 4, type: 'file', vehicle: 'VW Golf 7 GTI', status: 'completed', date: '2025-01-13', credits: 65 },
];

// Progress steps for horizontal display
const progressSteps = {
  en: [
    { key: 'received', label: 'Received' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'processing', label: 'Processing' },
    { key: 'quality', label: 'Quality Check' },
    { key: 'completed', label: 'Completed' },
  ],
  de: [
    { key: 'received', label: 'Eingegangen' },
    { key: 'analysis', label: 'Analyse' },
    { key: 'processing', label: 'Bearbeitung' },
    { key: 'quality', label: 'Prüfung' },
    { key: 'completed', label: 'Fertig' },
  ]
};

const statusToProgress = {
  pending: 0,
  processing: 2,
  completed: 5,
  cancelled: -1,
};

// Opening hours configuration
const openingHours = {
  1: { open: '08:00', close: '18:00' }, // Monday
  2: { open: '08:00', close: '18:00' }, // Tuesday
  3: { open: '08:00', close: '18:00' }, // Wednesday
  4: { open: '08:00', close: '18:00' }, // Thursday
  5: { open: '08:00', close: '18:00' }, // Friday
  6: { open: '09:00', close: '13:00' }, // Saturday
  0: null, // Sunday - closed
};

const isBusinessOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hours = openingHours[day];
  
  if (!hours) return false;
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = hours.open.split(':').map(Number);
  const [closeH, closeM] = hours.close.split(':').map(Number);
  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;
  
  return currentTime >= openTime && currentTime < closeTime;
};

// Opening Hours Component
const OpeningHoursCard = ({ language }) => {
  const isOpen = isBusinessOpen();
  const now = new Date();
  const currentDay = now.getDay();
  
  const dayNames = language === 'de' 
    ? ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const closedText = language === 'de' ? 'Geschlossen' : 'Closed';
  const openText = language === 'de' ? 'Geöffnet' : 'Open';
  const hoursTitle = language === 'de' ? 'Öffnungszeiten' : 'Opening Hours';

  return (
    <Card className="bg-card border-white/10" data-testid="opening-hours-card">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Clock weight="fill" className="w-5 h-5 text-primary" />
            {hoursTitle}
          </CardTitle>
          <Badge className={`${isOpen ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} border`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {isOpen ? openText : closedText}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 text-sm">
          {/* Mo-Fr */}
          <div className={`flex justify-between py-1.5 px-2 rounded-sm ${currentDay >= 1 && currentDay <= 5 ? 'bg-primary/10 border border-primary/20' : ''}`}>
            <span className={currentDay >= 1 && currentDay <= 5 ? 'text-white font-medium' : 'text-muted-foreground'}>
              {language === 'de' ? 'Mo - Fr' : 'Mon - Fri'}
            </span>
            <span className={currentDay >= 1 && currentDay <= 5 ? 'text-white font-medium' : 'text-muted-foreground'}>
              08:00 - 18:00
            </span>
          </div>
          {/* Sa */}
          <div className={`flex justify-between py-1.5 px-2 rounded-sm ${currentDay === 6 ? 'bg-primary/10 border border-primary/20' : ''}`}>
            <span className={currentDay === 6 ? 'text-white font-medium' : 'text-muted-foreground'}>
              {language === 'de' ? 'Sa' : 'Sat'}
            </span>
            <span className={currentDay === 6 ? 'text-white font-medium' : 'text-muted-foreground'}>
              09:00 - 13:00
            </span>
          </div>
          {/* So */}
          <div className={`flex justify-between py-1.5 px-2 rounded-sm ${currentDay === 0 ? 'bg-red-500/10 border border-red-500/20' : ''}`}>
            <span className={currentDay === 0 ? 'text-red-400 font-medium' : 'text-muted-foreground'}>
              {language === 'de' ? 'So' : 'Sun'}
            </span>
            <span className={currentDay === 0 ? 'text-red-400 font-medium' : 'text-muted-foreground'}>
              {closedText}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Horizontal Progress Component
const HorizontalOrderProgress = ({ order, language, navigate }) => {
  const steps = progressSteps[language] || progressSteps.en;
  const currentStepIndex = statusToProgress[order.status];
  const isCancelled = order.status === 'cancelled';

  if (isCancelled) return null;

  return (
    <Card className="bg-card border-white/10" data-testid="current-order-progress">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Package weight="fill" className="w-5 h-5 text-primary" />
            {language === 'de' ? 'Aktueller Auftrag' : 'Current Order'}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-white"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            {language === 'de' ? 'Details' : 'Details'}
            <ArrowRight weight="bold" className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Order Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
              <CarProfile weight="fill" className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-lg text-white">
                {order.vehicle.manufacturer} {order.vehicle.model} {order.vehicle.series}
              </h4>
              <p className="text-sm text-muted-foreground">
                {order.id} · {order.tuning.type}
              </p>
            </div>
          </div>
          <Badge className="bg-primary/20 text-primary border border-primary/30">
            {order.credits} Credits
          </Badge>
        </div>

        {/* Horizontal Progress Steps */}
        <div className="relative">
          {/* Progress Line Background */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/10" />
          
          {/* Progress Line Active */}
          <div 
            className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-500"
            style={{ 
              width: `${Math.min((currentStepIndex / (steps.length - 1)) * 100, 100)}%` 
            }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center" style={{ width: '20%' }}>
                  {/* Circle */}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isCompleted 
                      ? 'bg-green-500' 
                      : isCurrent 
                        ? 'bg-primary' 
                        : 'bg-secondary border-2 border-white/20'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle weight="fill" className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    ) : null}
                  </div>
                  
                  {/* Label */}
                  <span className={`mt-3 text-xs font-medium text-center ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-white' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function Dashboard() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Get the most recent non-cancelled order
  const latestOrder = mockOrders.find(o => o.status !== 'cancelled' && o.status !== 'completed');
  const latestActiveOrder = latestOrder || mockOrders.find(o => o.status === 'completed');

  const stats = [
    { 
      label: t('availableCredits'), 
      value: mockUser.credits.toLocaleString(), 
      icon: CurrencyCircleDollar,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      label: t('pendingOrders'), 
      value: mockUser.pendingOrders, 
      icon: ClockCounterClockwise,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    { 
      label: t('completedFiles'), 
      value: mockUser.completedFiles, 
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    { 
      label: t('totalSpent'), 
      value: `€${mockUser.totalSpent.toLocaleString()}`, 
      icon: Wallet,
      color: 'text-muted-foreground',
      bgColor: 'bg-white/5'
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      processing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      pending: 'bg-muted text-muted-foreground border-white/10',
    };
    return styles[status] || styles.pending;
  };

  return (
    <DashboardLayout title={t('dashboard')}>
      <div className="space-y-6">
        {/* Welcome */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-white">
              {t('welcome')}, {mockUser.name}
            </h1>
            <p className="text-muted-foreground mt-1">{t('overview')}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-testid="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="bg-card border-white/10 hover:border-white/20 transition-colors duration-200"
                data-testid={`stat-card-${index}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className={`font-heading font-bold text-3xl mt-2 ${stat.color}`}>
                        {stat.value}
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-sm ${stat.bgColor} flex items-center justify-center`}>
                      <Icon weight="fill" className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Order Progress + Opening Hours Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Order Progress - 2/3 width */}
          {latestActiveOrder && (
            <div className="lg:col-span-2">
              <HorizontalOrderProgress 
                order={latestActiveOrder} 
                language={language} 
                navigate={navigate}
              />
            </div>
          )}
          
          {/* Opening Hours - 1/3 width */}
          <div className={latestActiveOrder ? '' : 'lg:col-start-3'}>
            <OpeningHoursCard language={language} />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 bg-card border-white/10" data-testid="recent-activity-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <ClockCounterClockwise weight="fill" className="w-5 h-5 text-primary" />
                {t('recentActivity')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {mockActivity.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {mockActivity.map((activity) => (
                    <div 
                      key={activity.id} 
                      className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                          activity.type === 'file' ? 'bg-primary/10' : 'bg-green-500/10'
                        }`}>
                          {activity.type === 'file' ? (
                            <CarProfile weight="fill" className="w-5 h-5 text-primary" />
                          ) : (
                            <CurrencyCircleDollar weight="fill" className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        <div>
                          {activity.type === 'file' ? (
                            <>
                              <p className="text-sm font-medium text-white">{activity.vehicle}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className={getStatusBadge(activity.status)}>
                                  {t(activity.status)}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{activity.credits} Credits</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm font-medium text-white">{t('purchaseCredits')}</p>
                              <p className="text-xs text-green-400 mt-1">+{activity.amount} Credits</p>
                            </>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  {t('noActivity')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card border-white/10" data-testid="quick-actions-card">
            <CardHeader className="border-b border-white/10 pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Lightning weight="fill" className="w-5 h-5 text-primary" />
                {t('quickActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Button 
                className="w-full justify-between bg-primary hover:bg-primary/90 text-white font-semibold"
                onClick={() => navigate('/file-wizard')}
                data-testid="new-request-btn"
              >
                <span className="flex items-center gap-2">
                  <Plus weight="bold" className="w-4 h-4" />
                  {t('newRequest')}
                </span>
                <ArrowRight weight="bold" className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-between border-white/10 hover:bg-white/5 hover:border-white/20 font-semibold"
                onClick={() => navigate('/credits')}
                data-testid="buy-credits-btn"
              >
                <span className="flex items-center gap-2">
                  <CurrencyCircleDollar weight="bold" className="w-4 h-4" />
                  {t('buyCredits')}
                </span>
                <ArrowRight weight="bold" className="w-4 h-4" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full justify-between border-white/10 hover:bg-white/5 hover:border-white/20 font-semibold"
                onClick={() => navigate('/orders')}
                data-testid="view-orders-btn"
              >
                <span className="flex items-center gap-2">
                  <ClockCounterClockwise weight="bold" className="w-4 h-4" />
                  {t('viewOrders')}
                </span>
                <ArrowRight weight="bold" className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Hero Banner */}
        <Card className="relative overflow-hidden bg-card border-white/10" data-testid="hero-banner">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ 
              backgroundImage: `url('https://images.pexels.com/photos/261985/pexels-photo-261985.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <CardContent className="relative p-8">
            <div className="max-w-lg">
              <h3 className="font-heading font-bold text-2xl text-white mb-2">
                {t('configuratorTitle')}
              </h3>
              <p className="text-muted-foreground mb-4">
                Configure your vehicle tuning with our advanced configurator. Get instant price estimates and submit your request.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate('/configurator')}
                data-testid="go-configurator-btn"
              >
                {t('configurator')}
                <ArrowRight weight="bold" className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
