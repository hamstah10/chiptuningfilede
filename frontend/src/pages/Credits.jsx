import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  CurrencyCircleDollar, ShoppingCart, Check, Lightning, Star,
  Fire, Tag, ArrowRight, CreditCard, Receipt, Coins,
  Invoice, PaperPlaneTilt, CheckCircle, Bank, X as XIcon,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';

const creditPackages = [
  { id: 1, credits: 10, price: 12, priceInkl: 14.28, features: ['10 Tuning Credits'], badge: null, oldPrice: null, perFile: null },
  { id: 2, credits: 50, price: 58, priceInkl: 69.02, features: ['50 Tuning Credits'], badge: null, oldPrice: null, perFile: null },
  { id: 3, credits: 100, price: 115, priceInkl: 136.85, features: ['100 Tuning Credits', 'BESTSELLER %'], badge: 'bestseller', oldPrice: null, perFile: null },
  { id: 4, credits: 200, price: 225, priceInkl: 267.75, features: ['200 Tuning Credits'], badge: null, oldPrice: null, perFile: null },
  { id: 5, credits: 500, price: 550, priceInkl: 654.50, features: ['500 Tuning Credits'], badge: null, oldPrice: null, perFile: null },
  { id: 6, credits: 1000, price: 950, priceInkl: 1249.50, features: ['1000 Tuning Credits', 'AM BELIEBTESTEN !!'], badge: 'popular', oldPrice: 1050, perFile: null },
  { id: 7, credits: 2000, price: 2000, priceInkl: 2380, features: ['2000 Tuning Credits', '100\u20AC / File'], badge: null, oldPrice: null, perFile: 100 },
  { id: 8, credits: 3000, price: 2850, priceInkl: 3391.50, features: ['3000 Tuning Credits', '95\u20AC / File'], badge: null, oldPrice: null, perFile: 95 },
  { id: 9, credits: 4000, price: 3600, priceInkl: 4284, features: ['4000 Tuning Credits', '90\u20AC / File'], badge: null, oldPrice: null, perFile: 90 },
  { id: 10, credits: 5000, price: 4250, priceInkl: 5057.50, features: ['5000 Tuning Credits', '85\u20AC / File'], badge: 'top', oldPrice: null, perFile: 85 },
];

const fmt = (n) => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const t_data = {
  de: {
    title: 'Credits kaufen',
    subtitle: 'Tuning Credits erwerben und sofort nutzen',
    yourBalance: 'Dein Guthaben',
    credits: 'Credits',
    features: 'Eigenschaften',
    buyNow: 'Jetzt kaufen',
    inclVat: 'inkl. MwSt.',
    selectedPackage: 'Ausgewähltes Paket',
    selectPackage: 'Paket auswählen',
    selectHint: 'Bitte ein Credit-Paket auswählen',
    price: 'Preis',
    vat: 'inkl. MwSt.',
    payWith: 'Bezahlen mit',
    perFile: 'pro File',
    bestseller: 'BESTSELLER',
    popular: 'AM BELIEBTESTEN',
    topDeal: 'TOP DEAL',
    infoTitle: 'Deine Vorteile',
    info1: 'Credits verfallen nie',
    info2: 'Sichere PayPal-Zahlung',
    info3: 'Sofortige Gutschrift',
    info4: 'Mengenrabatte bei gro\u00DFen Paketen',
    info5: 'Rechnungen als PDF',
    // Vorkasse
    vorkasseTitle: 'Rechnung auf Vorkasse',
    vorkasseDesc: 'Individuelle Rechnung mit gew\u00FCnschtem Betrag anfordern',
    vorkasseCredits: 'Gew\u00FCnschte Credits',
    vorkasseCalc: 'Berechneter Preis',
    vorkasseNetto: 'Netto',
    vorkasseBrutto: 'Brutto (inkl. 19% MwSt.)',
    vorkasseBtn: 'Rechnung anfordern',
    vorkasseNote: 'Die Rechnung wird per E-Mail zugesendet. Credits werden nach Zahlungseingang gutgeschrieben.',
    vorkasseMin: 'Mindestens 10 Credits',
    vorkasseSent: 'Anfrage gesendet!',
    vorkasseSentMsg: 'Deine Vorkasse-Rechnung wird erstellt und per E-Mail zugesendet.',
    vorkasseClose: 'Schlie\u00DFen',
    vorkasseNew: 'Neue Anfrage',
  },
  en: {
    title: 'Buy Credits',
    subtitle: 'Purchase tuning credits and use them instantly',
    yourBalance: 'Your Balance',
    credits: 'Credits',
    features: 'Features',
    buyNow: 'Buy Now',
    inclVat: 'incl. VAT',
    selectedPackage: 'Selected Package',
    selectPackage: 'Select Package',
    selectHint: 'Please select a credit package',
    price: 'Price',
    vat: 'incl. VAT',
    payWith: 'Pay with',
    perFile: 'per File',
    bestseller: 'BESTSELLER',
    popular: 'MOST POPULAR',
    topDeal: 'TOP DEAL',
    infoTitle: 'Your Benefits',
    info1: 'Credits never expire',
    info2: 'Secure PayPal payment',
    info3: 'Instant delivery',
    info4: 'Bulk discounts on large packages',
    info5: 'PDF invoices',
    // Vorkasse
    vorkasseTitle: 'Prepayment Invoice',
    vorkasseDesc: 'Request a custom invoice with your desired amount',
    vorkasseCredits: 'Desired Credits',
    vorkasseCalc: 'Calculated Price',
    vorkasseNetto: 'Net',
    vorkasseBrutto: 'Gross (incl. 19% VAT)',
    vorkasseBtn: 'Request Invoice',
    vorkasseNote: 'The invoice will be sent via email. Credits are added after payment is received.',
    vorkasseMin: 'Minimum 10 credits',
    vorkasseSent: 'Request sent!',
    vorkasseSentMsg: 'Your prepayment invoice is being created and will be sent via email.',
    vorkasseClose: 'Close',
    vorkasseNew: 'New Request',
  },
};

export default function Credits() {
  const { language } = useLanguage();
  const t = (k) => t_data[language]?.[k] || k;
  const [selectedId, setSelectedId] = useState(null);
  const [vorkasseCredits, setVorkasseCredits] = useState('');
  const [vorkasseSent, setVorkasseSent] = useState(false);
  const currentBalance = 1250;
  const selected = creditPackages.find(p => p.id === selectedId);

  // Calculate Vorkasse price based on package tiers
  const calcVorkassePrice = (credits) => {
    if (!credits || credits < 10) return { netto: 0, brutto: 0 };
    // Find best matching tier for price-per-credit
    const sorted = [...creditPackages].sort((a, b) => b.credits - a.credits);
    const tier = sorted.find(p => credits >= p.credits) || creditPackages[0];
    const pricePerCredit = tier.price / tier.credits;
    const netto = Math.round(credits * pricePerCredit * 100) / 100;
    const brutto = Math.round(netto * 1.19 * 100) / 100;
    return { netto, brutto };
  };

  const vorkasseNum = parseInt(vorkasseCredits) || 0;
  const vorkassePrice = calcVorkassePrice(vorkasseNum);

  const getBadge = (pkg) => {
    if (pkg.badge === 'bestseller') return { label: t('bestseller'), cls: 'bg-primary text-white border-primary' };
    if (pkg.badge === 'popular') return { label: t('popular'), cls: 'bg-orange-500 text-white border-orange-500' };
    if (pkg.badge === 'top') return { label: t('topDeal'), cls: 'bg-green-500 text-white border-green-500' };
    return null;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1400px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <ShoppingCart weight="fill" className="w-7 h-7 text-primary" />
              {t('title')}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-3 bg-card border border-border rounded-sm px-5 py-3" data-testid="balance-display">
            <CurrencyCircleDollar weight="fill" className="w-8 h-8 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('yourBalance')}</p>
              <p className="text-xl font-bold text-foreground font-heading">{currentBalance.toLocaleString('de-DE')} <span className="text-sm font-normal text-muted-foreground">{t('credits')}</span></p>
            </div>
          </div>
        </div>

        {/* Packages grid - full width */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4" data-testid="packages-grid">
          {creditPackages.map((pkg) => {
            const isActive = selectedId === pkg.id;
            const badge = getBadge(pkg);
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(pkg.id)}
                data-testid={`package-${pkg.id}`}
                className={cn(
                  "relative text-left rounded-sm border-2 transition-all p-5 group",
                  isActive
                    ? "bg-primary/8 border-primary ring-1 ring-primary/30"
                    : badge
                      ? "bg-card border-border hover:border-primary/50"
                      : "bg-card border-border hover:border-muted-foreground/40"
                )}
              >
                {badge && (
                  <div className={cn("absolute -top-3 right-4 px-3 py-0.5 rounded-sm text-[10px] font-bold tracking-wider", badge.cls)}>
                    {badge.label}
                  </div>
                )}
                {isActive && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Check weight="bold" className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                {/* Credits amount - hero */}
                <p className="text-3xl font-bold text-primary font-heading">{pkg.credits.toLocaleString('de-DE')}</p>
                <p className="text-xs text-muted-foreground mb-3">{t('credits')}</p>
                {/* Price */}
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{fmt(pkg.price)} &euro;</span>
                  {pkg.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">{fmt(pkg.oldPrice)} &euro;</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mb-4">{fmt(pkg.priceInkl)} &euro; {t('inclVat')}</p>
                <div className="h-px bg-border mb-3" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{t('features')}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {pkg.features.map((f, i) => (
                    <span key={i} className="text-sm text-foreground flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>
                {pkg.perFile && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                    <Tag weight="fill" className="w-3.5 h-3.5" />
                    {pkg.perFile}&euro; / File
                  </div>
                )}
                <button
                  type="button"
                  className={cn(
                    "mt-4 w-full py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-all",
                    isActive
                      ? "btn-gradient text-white"
                      : "bg-primary/15 text-primary border border-primary/30 group-hover:bg-primary/25"
                  )}
                >
                  {t('buyNow')}
                </button>
              </button>
            );
          })}
        </div>

        {/* Bottom row: Purchase summary + Vorkasse */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected package / Buy */}
          <Card className={cn("border-2 transition-all", selected ? "bg-card border-primary/50" : "bg-card border-border")} data-testid="purchase-sidebar">
            <CardContent className="p-5">
              {selected ? (
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Coins weight="fill" className="w-8 h-8 text-primary" />
                    <div>
                      <p className="text-3xl font-bold text-foreground font-heading">{selected.credits.toLocaleString('de-DE')}</p>
                      <p className="text-xs text-muted-foreground">{t('credits')}</p>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">{t('price')} (netto)</span>
                        <span className="font-bold text-foreground">{fmt(selected.price)} &euro;</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">{t('vat')} (19%)</span>
                        <span className="font-bold text-foreground">{fmt(selected.priceInkl)} &euro;</span>
                      </div>
                    </div>
                  </div>
                  <Button className="btn-gradient text-white font-bold py-3 px-8 h-auto text-sm flex-shrink-0" data-testid="purchase-btn">
                    <CreditCard weight="fill" className="w-5 h-5 mr-2" />
                    {t('buyNow')} &mdash; {fmt(selected.priceInkl)} &euro;
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4 py-2">
                  <ShoppingCart weight="light" className="w-8 h-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">{t('selectHint')}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vorkasse */}
          <Card className="bg-card border-border border-2" data-testid="vorkasse-card">
            <CardContent className="p-5">
              {vorkasseSent ? (
                <div className="flex items-center gap-4">
                  <CheckCircle weight="fill" className="w-10 h-10 text-green-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-green-400">{t('vorkasseSent')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{t('vorkasseSentMsg')}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border font-semibold text-sm flex-shrink-0"
                    data-testid="vorkasse-new-btn"
                    onClick={() => { setVorkasseSent(false); setVorkasseCredits(''); }}
                  >
                    {t('vorkasseNew')}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                      <Bank weight="bold" className="w-3.5 h-3.5" />
                      {t('vorkasseTitle')}
                    </label>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{t('vorkasseDesc')}</p>
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        min="10"
                        step="10"
                        value={vorkasseCredits}
                        onChange={(e) => setVorkasseCredits(e.target.value)}
                        placeholder="z.B. 500"
                        data-testid="vorkasse-input"
                        className="w-full bg-secondary/50 border border-border rounded-sm px-4 py-2.5 text-sm text-foreground font-semibold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">Credits</span>
                    </div>
                    {vorkasseNum >= 10 && (
                      <span className="text-sm font-bold text-primary whitespace-nowrap">{fmt(vorkassePrice.brutto)} &euro;</span>
                    )}
                    <Button
                      className="bg-secondary/80 hover:bg-secondary border border-border text-foreground font-bold py-2.5 h-auto text-sm flex-shrink-0"
                      disabled={vorkasseNum < 10}
                      data-testid="vorkasse-submit-btn"
                      onClick={() => setVorkasseSent(true)}
                    >
                      <Receipt weight="fill" className="w-4 h-4 mr-2" />
                      {t('vorkasseBtn')}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
