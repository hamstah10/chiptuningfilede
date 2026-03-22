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
  Lightning
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

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

export default function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

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
