import { useState, useEffect } from 'react';
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
  ArrowRight,
  CarProfile,
  Package,
  Clock,
  Ticket,
  Warning,
  ChatCircle,
  Newspaper,
  CaretLeft,
  CaretRight,
  Circle
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { mockOrders } from './OrdersNew';
import { mockTickets } from './Tickets';

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

// Mock news data
const mockNews = [
  {
    id: 1,
    title: {
      de: 'Neue Stage 2 Lösungen verfügbar',
      en: 'New Stage 2 Solutions Available'
    },
    content: {
      de: 'Ab sofort bieten wir erweiterte Stage 2 Tuning-Lösungen für BMW G-Serie und Mercedes W213 an. Inklusive optimierter DPF- und EGR-Lösungen.',
      en: 'We now offer extended Stage 2 tuning solutions for BMW G-Series and Mercedes W213. Including optimized DPF and EGR solutions.'
    },
    date: '2025-01-15',
    type: 'product'
  },
  {
    id: 2,
    title: {
      de: 'Wartungsarbeiten am 20. Januar',
      en: 'Maintenance on January 20th'
    },
    content: {
      de: 'Am 20. Januar zwischen 02:00 und 04:00 Uhr werden Wartungsarbeiten durchgeführt. Das Portal ist in dieser Zeit nicht erreichbar.',
      en: 'On January 20th between 02:00 and 04:00, maintenance work will be carried out. The portal will not be accessible during this time.'
    },
    date: '2025-01-14',
    type: 'maintenance'
  },
  {
    id: 3,
    title: {
      de: 'Credit-Aktion: 10% Bonus',
      en: 'Credit Promotion: 10% Bonus'
    },
    content: {
      de: 'Nur diese Woche: Bei jedem Credit-Kauf ab 250 Credits erhalten Sie 10% Bonus-Credits geschenkt!',
      en: 'This week only: Get 10% bonus credits free with every credit purchase of 250 credits or more!'
    },
    date: '2025-01-13',
    type: 'promotion'
  },
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

// News Carousel Component
const NewsCarousel = ({ language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const newsTitle = language === 'de' ? 'News' : 'News';
  
  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mockNews.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mockNews.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mockNews.length) % mockNews.length);
  };

  const currentNews = mockNews[currentIndex];

  const getTypeColor = (type) => {
    const colors = {
      product: 'bg-green-500/20 text-green-400 border-green-500/30',
      maintenance: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      promotion: 'bg-primary/20 text-primary border-primary/30',
    };
    return colors[type] || colors.product;
  };

  const getTypeLabel = (type) => {
    const labels = {
      product: language === 'de' ? 'Produkt' : 'Product',
      maintenance: language === 'de' ? 'Wartung' : 'Maintenance',
      promotion: language === 'de' ? 'Aktion' : 'Promotion',
    };
    return labels[type] || type;
  };

  return (
    <Card className="bg-card border-white/10 h-full" data-testid="news-carousel">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Newspaper weight="fill" className="w-5 h-5 text-primary" />
            {newsTitle}
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={goToPrev}
              data-testid="news-prev-btn"
            >
              <CaretLeft weight="bold" className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={goToNext}
              data-testid="news-next-btn"
            >
              <CaretRight weight="bold" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getTypeColor(currentNews.type)}>
              {getTypeLabel(currentNews.type)}
            </Badge>
            <span className="text-xs text-muted-foreground">{currentNews.date}</span>
          </div>
          <h4 className="font-semibold text-white">
            {currentNews.title[language]}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {currentNews.content[language]}
          </p>
        </div>
        
        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/5">
          {mockNews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="p-1"
              data-testid={`news-dot-${index}`}
            >
              <Circle 
                weight={index === currentIndex ? 'fill' : 'regular'} 
                className={`w-2 h-2 transition-colors ${
                  index === currentIndex ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Current Tickets Component
const CurrentTicketsCard = ({ language, navigate }) => {
  const openTickets = mockTickets.filter(t => t.status === 'open' || t.status === 'answered').slice(0, 3);
  
  const getStatusConfig = (status) => {
    const configs = {
      open: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: Clock },
      answered: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: ChatCircle },
    };
    return configs[status] || configs.open;
  };

  const ticketsTitle = language === 'de' ? 'Aktuelle Tickets' : 'Current Tickets';
  const noTickets = language === 'de' ? 'Keine offenen Tickets' : 'No open tickets';
  const viewAll = language === 'de' ? 'Alle ansehen' : 'View all';

  return (
    <Card className="bg-card border-white/10" data-testid="current-tickets-card">
      <CardHeader className="border-b border-white/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
            <Ticket weight="fill" className="w-5 h-5 text-primary" />
            {ticketsTitle}
            {openTickets.length > 0 && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 ml-2">
                {openTickets.length}
              </Badge>
            )}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-muted-foreground hover:text-white"
            onClick={() => navigate('/tickets')}
          >
            {viewAll}
            <ArrowRight weight="bold" className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {openTickets.length > 0 ? (
          <div className="divide-y divide-white/5">
            {openTickets.map((ticket) => {
              const statusConfig = getStatusConfig(ticket.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div 
                  key={ticket.id}
                  className="p-3 hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 ${statusConfig.bg}`}>
                      <StatusIcon weight="fill" className={`w-4 h-4 ${statusConfig.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary">{ticket.id}</span>
                        {ticket.priority === 'high' && (
                          <Warning weight="fill" className="w-3 h-3 text-red-400" />
                        )}
                      </div>
                      <p className="text-sm text-white truncate">{ticket.subject}</p>
                    </div>
                    <ArrowRight weight="bold" className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {noTickets}
          </div>
        )}
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
    <DashboardLayout>
      <div className="space-y-6">
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

        {/* Current Order Progress + Opening Hours + Tickets Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Order Progress - 1/3 width */}
          {latestActiveOrder && (
            <HorizontalOrderProgress 
              order={latestActiveOrder} 
              language={language} 
              navigate={navigate}
            />
          )}
          
          {/* Current Tickets - 1/3 width */}
          <CurrentTicketsCard language={language} navigate={navigate} />
          
          {/* Opening Hours - 1/3 width */}
          <OpeningHoursCard language={language} />
        </div>

        {/* Main Content Grid - Activity + News */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity - 2/3 width */}
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

          {/* News Carousel - 1/3 width */}
          <NewsCarousel language={language} />
        </div>
      </div>
    </DashboardLayout>
  );
}
