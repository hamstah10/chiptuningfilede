import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  ChartBar, CarProfile, TrendUp, Package, CalendarBlank, ArrowUp, ArrowDown,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';

// ── Mock data ──────────────────────────────────────────────────────

const monthlyOrders = [
  { month: 'Okt', orders: 42, credits: 3200 },
  { month: 'Nov', orders: 58, credits: 4600 },
  { month: 'Dez', orders: 35, credits: 2800 },
  { month: 'Jan', orders: 64, credits: 5100 },
  { month: 'Feb', orders: 71, credits: 5800 },
  { month: 'Mär', orders: 89, credits: 7200 },
];

const brandStats = [
  { brand: 'BMW', count: 87, pct: 24, trend: +12 },
  { brand: 'Audi', count: 72, pct: 20, trend: +5 },
  { brand: 'VW', count: 58, pct: 16, trend: -3 },
  { brand: 'Mercedes', count: 52, pct: 14, trend: +8 },
  { brand: 'Seat', count: 34, pct: 9, trend: +2 },
  { brand: 'Skoda', count: 28, pct: 8, trend: -1 },
  { brand: 'Ford', count: 18, pct: 5, trend: +4 },
  { brand: 'Andere', count: 15, pct: 4, trend: 0 },
];

const brandPieData = brandStats.map(b => ({ name: b.brand, value: b.count }));
const PIE_COLORS = ['#8B2635', '#b33a4a', '#d14e5e', '#555', '#777', '#999', '#aaa', '#ccc'];

const topVehicles = [
  { vehicle: 'BMW 330d G20', brand: 'BMW', count: 28, stage: 'Stage 1' },
  { vehicle: 'Audi A4 B9 2.0 TDI', brand: 'Audi', count: 22, stage: 'Stage 1' },
  { vehicle: 'VW Golf 8 2.0 TDI', brand: 'VW', count: 19, stage: 'Stage 2' },
  { vehicle: 'BMW 520d G30', brand: 'BMW', count: 17, stage: 'Stage 1' },
  { vehicle: 'Mercedes C220d W205', brand: 'Mercedes', count: 15, stage: 'Eco' },
  { vehicle: 'Audi A6 C8 3.0 TDI', brand: 'Audi', count: 14, stage: 'Stage 2' },
  { vehicle: 'Seat Leon 2.0 TDI', brand: 'Seat', count: 12, stage: 'Stage 1' },
  { vehicle: 'VW Passat B8 2.0 TDI', brand: 'VW', count: 11, stage: 'Stage 1' },
  { vehicle: 'BMW M340i G20', brand: 'BMW', count: 10, stage: 'Stage 2' },
  { vehicle: 'Skoda Octavia 2.0 TDI', brand: 'Skoda', count: 9, stage: 'Eco' },
];

const stageDistribution = [
  { name: 'Stage 1', value: 148 },
  { name: 'Stage 2', value: 87 },
  { name: 'Eco', value: 64 },
  { name: 'Getriebe', value: 32 },
  { name: 'Nur Optionen', value: 18 },
];
const STAGE_COLORS = ['#8B2635', '#b33a4a', '#22c55e', '#3b82f6', '#a855f7'];

const optionStats = [
  { option: 'DPF-Off', count: 186 },
  { option: 'EGR-Off', count: 154 },
  { option: 'AdBlue-Off', count: 98 },
  { option: 'DTC-Off', count: 72 },
  { option: 'Vmax-Off', count: 65 },
  { option: 'Pops & Bangs', count: 41 },
  { option: 'Launch Control', count: 28 },
  { option: 'Start-Stop-Off', count: 22 },
];

// ── Translations ───────────────────────────────────────────────────

const t_data = {
  de: {
    title: 'Statistiken',
    subtitle: 'Auftr\u00E4ge, Marken und Fahrzeuge im \u00DCberblick',
    totalOrders: 'Auftr\u00E4ge gesamt',
    thisMonth: 'Diesen Monat',
    topBrand: 'Top Marke',
    avgCredits: '\u00D8 Credits/Auftrag',
    monthlyOrders: 'Auftr\u00E4ge pro Monat',
    orders: 'Auftr\u00E4ge',
    credits: 'Credits',
    brandDistribution: 'Markenverteilung',
    brand: 'Marke',
    count: 'Anzahl',
    share: 'Anteil',
    trend: 'Trend',
    topVehicles: 'Top 10 Fahrzeuge',
    vehicle: 'Fahrzeug',
    stage: 'Stage',
    stageDistribution: 'Stage-Verteilung',
    optionStats: 'Beliebteste Optionen',
    option: 'Option',
    vsLastMonth: 'vs. Vormonat',
  },
  en: {
    title: 'Statistics',
    subtitle: 'Orders, brands and vehicles at a glance',
    totalOrders: 'Total Orders',
    thisMonth: 'This Month',
    topBrand: 'Top Brand',
    avgCredits: '\u00D8 Credits/Order',
    monthlyOrders: 'Orders per Month',
    orders: 'Orders',
    credits: 'Credits',
    brandDistribution: 'Brand Distribution',
    brand: 'Brand',
    count: 'Count',
    share: 'Share',
    trend: 'Trend',
    topVehicles: 'Top 10 Vehicles',
    vehicle: 'Vehicle',
    stage: 'Stage',
    stageDistribution: 'Stage Distribution',
    optionStats: 'Most Popular Options',
    option: 'Option',
    vsLastMonth: 'vs. Last Month',
  },
};

// ── Custom tooltip ─────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-sm px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────

export default function Statistics() {
  const { language } = useLanguage();
  const t = (k) => t_data[language]?.[k] || k;

  const totalOrders = monthlyOrders.reduce((s, m) => s + m.orders, 0);
  const thisMonth = monthlyOrders[monthlyOrders.length - 1].orders;
  const avgCredits = Math.round(monthlyOrders.reduce((s, m) => s + m.credits, 0) / totalOrders);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <ChartBar weight="fill" className="w-7 h-7 text-primary" />
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="kpi-cards">
          {[
            { label: t('totalOrders'), value: totalOrders, icon: Package, color: 'text-primary' },
            { label: t('thisMonth'), value: thisMonth, icon: CalendarBlank, color: 'text-green-400', sub: '+25% ' + t('vsLastMonth') },
            { label: t('topBrand'), value: 'BMW', icon: CarProfile, color: 'text-blue-400', sub: `87 ${t('orders')}` },
            { label: t('avgCredits'), value: avgCredits, icon: TrendUp, color: 'text-yellow-400' },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <Card key={i} className="bg-card border-border" data-testid={`kpi-${i}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">{kpi.label}</span>
                    <Icon weight="fill" className={cn("w-5 h-5", kpi.color)} />
                  </div>
                  <p className="text-2xl font-bold text-foreground font-heading">{kpi.value}</p>
                  {kpi.sub && <p className="text-[11px] text-green-400 mt-1">{kpi.sub}</p>}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Row 1: Monthly Orders Chart + Brand Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Monthly orders area chart */}
          <Card className="bg-card border-border" data-testid="monthly-chart">
            <CardContent className="p-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                <ChartBar weight="bold" className="w-3.5 h-3.5" />
                {t('monthlyOrders')}
              </label>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyOrders}>
                  <defs>
                    <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B2635" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#8B2635" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCredits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="left" stroke="#666" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" tick={{ fontSize: 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
                  <Area yAxisId="left" type="monotone" dataKey="orders" name={t('orders')} stroke="#8B2635" fill="url(#gradOrders)" strokeWidth={2} />
                  <Area yAxisId="right" type="monotone" dataKey="credits" name={t('credits')} stroke="#3b82f6" fill="url(#gradCredits)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Brand Pie Chart */}
          <Card className="bg-card border-border" data-testid="brand-pie">
            <CardContent className="p-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                <CarProfile weight="bold" className="w-3.5 h-3.5" />
                {t('brandDistribution')}
              </label>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={brandPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                    {brandPieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                {brandPieData.slice(0, 6).map((b, i) => (
                  <div key={b.name} className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-muted-foreground truncate">{b.name}</span>
                    <span className="text-foreground font-semibold ml-auto">{b.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Brand Table + Stage Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Brand stats table */}
          <Card className="bg-card border-border" data-testid="brand-table">
            <CardContent className="p-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                <CarProfile weight="bold" className="w-3.5 h-3.5" />
                {t('brandDistribution')}
              </label>
              <div className="space-y-0">
                {/* Header */}
                <div className="flex items-center py-2 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <span className="flex-1">{t('brand')}</span>
                  <span className="w-16 text-right">{t('count')}</span>
                  <span className="w-20 text-right">{t('share')}</span>
                  <span className="w-20 text-right">{t('trend')}</span>
                </div>
                {brandStats.map((b, i) => (
                  <div key={b.brand} className="flex items-center py-2.5 border-b border-border/40 last:border-0" data-testid={`brand-row-${i}`}>
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: PIE_COLORS[i] }}>{i + 1}</span>
                      <span className="text-sm font-semibold text-foreground">{b.brand}</span>
                    </div>
                    <span className="w-16 text-right text-sm font-bold text-foreground">{b.count}</span>
                    <span className="w-20 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-10 h-1.5 bg-secondary/60 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${b.pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{b.pct}%</span>
                      </div>
                    </span>
                    <span className="w-20 text-right">
                      <span className={cn("text-xs font-semibold inline-flex items-center gap-0.5",
                        b.trend > 0 ? "text-green-400" : b.trend < 0 ? "text-red-400" : "text-muted-foreground"
                      )}>
                        {b.trend > 0 && <ArrowUp weight="bold" className="w-3 h-3" />}
                        {b.trend < 0 && <ArrowDown weight="bold" className="w-3 h-3" />}
                        {b.trend > 0 ? '+' : ''}{b.trend}%
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage + Options */}
          <div className="space-y-4">
            <Card className="bg-card border-border" data-testid="stage-pie">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                  {t('stageDistribution')}
                </label>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stageDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={2}>
                      {stageDistribution.map((_, i) => <Cell key={i} fill={STAGE_COLORS[i]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-1">
                  {stageDistribution.map((s, i) => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STAGE_COLORS[i] }} />
                        <span className="text-muted-foreground">{s.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border" data-testid="option-stats">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                  {t('optionStats')}
                </label>
                <div className="space-y-2">
                  {optionStats.map(o => (
                    <div key={o.option} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 flex-shrink-0 truncate">{o.option}</span>
                      <div className="flex-1 h-2 bg-secondary/60 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(o.count / optionStats[0].count) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-foreground w-8 text-right">{o.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Row 3: Top 10 Vehicles */}
        <Card className="bg-card border-border" data-testid="top-vehicles">
          <CardContent className="p-5">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
              <TrendUp weight="bold" className="w-3.5 h-3.5" />
              {t('topVehicles')}
            </label>
            <div className="space-y-0">
              <div className="flex items-center py-2 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span className="w-8">#</span>
                <span className="flex-1">{t('vehicle')}</span>
                <span className="w-24">{t('brand')}</span>
                <span className="w-20 text-center">{t('stage')}</span>
                <span className="w-16 text-right">{t('count')}</span>
              </div>
              {topVehicles.map((v, i) => (
                <div key={v.vehicle} className="flex items-center py-2.5 border-b border-border/40 last:border-0" data-testid={`vehicle-row-${i}`}>
                  <span className={cn("w-8 text-sm font-bold", i < 3 ? "text-primary" : "text-muted-foreground")}>{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-foreground">{v.vehicle}</span>
                  <span className="w-24 text-xs text-muted-foreground">{v.brand}</span>
                  <span className="w-20 text-center">
                    <Badge className={cn("text-[10px]",
                      v.stage === 'Stage 1' ? "bg-primary/15 text-primary border-primary/30" :
                      v.stage === 'Stage 2' ? "bg-orange-500/15 text-orange-400 border-orange-500/30" :
                      "bg-green-500/15 text-green-400 border-green-500/30"
                    )}>{v.stage}</Badge>
                  </span>
                  <span className="w-16 text-right">
                    <span className="text-sm font-bold text-foreground">{v.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
