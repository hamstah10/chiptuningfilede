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

        {/* Main layout: Packages grid + Purchase sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          {/* LEFT: Package Grid */}
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
                  {/* Badge */}
                  {badge && (
                    <div className={cn("absolute -top-3 right-4 px-3 py-0.5 rounded-sm text-[10px] font-bold tracking-wider", badge.cls)}>
                      {badge.label}
                    </div>
                  )}

                  {/* Check indicator */}
                  {isActive && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check weight="bold" className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  {/* Price row */}
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <span className="text-2xl font-bold text-foreground font-heading">{fmt(pkg.price)} &euro;</span>
                      {pkg.oldPrice && (
                        <span className="ml-2 text-sm text-muted-foreground line-through">{fmt(pkg.oldPrice)} &euro;</span>
                      )}
                    </div>
                    <span className="text-primary font-bold text-sm mt-1">{pkg.credits.toLocaleString('de-DE')} {t('credits')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4">{fmt(pkg.priceInkl)} &euro; {t('inclVat')}</p>

                  {/* Divider */}
                  <div className="h-px bg-border mb-3" />

                  {/* Features */}
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">{t('features')}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {pkg.features.map((f, i) => (
                      <span key={i} className="text-sm text-foreground flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary flex-shrink-0" />
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Per-file info */}
                  {pkg.perFile && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400 font-semibold">
                      <Tag weight="fill" className="w-3.5 h-3.5" />
                      {pkg.perFile}&euro; / File
                    </div>
                  )}

                  {/* Buy button in card */}
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

          {/* RIGHT: Purchase Sidebar (sticky) */}
          <div className="space-y-4 xl:sticky xl:top-6 self-start">
            {/* Selected package summary */}
            <Card className={cn("border-2 transition-all", selected ? "bg-card border-primary/50" : "bg-card border-border")} data-testid="purchase-sidebar">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4">
                  <Lightning weight="bold" className="w-3.5 h-3.5" />
                  {t('selectedPackage')}
                </label>

                {selected ? (
                  <div className="space-y-4">
                    {/* Credits amount */}
                    <div className="text-center py-4 bg-primary/8 border border-primary/30 rounded-sm">
                      <Coins weight="fill" className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-4xl font-bold text-foreground font-heading">{selected.credits.toLocaleString('de-DE')}</p>
                      <p className="text-sm text-muted-foreground">{t('credits')}</p>
                    </div>

                    {/* Price breakdown */}
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t('price')} (netto)</span>
                        <span className="text-sm font-bold text-foreground">{fmt(selected.price)} &euro;</span>
                      </div>
                      {selected.oldPrice && (
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">Alter Preis</span>
                          <span className="text-sm font-bold text-muted-foreground line-through">{fmt(selected.oldPrice)} &euro;</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-b border-border/50">
                        <span className="text-sm text-muted-foreground">{t('vat')} (19%)</span>
                        <span className="text-sm font-bold text-foreground">{fmt(selected.priceInkl)} &euro;</span>
                      </div>
                      {selected.perFile && (
                        <div className="flex justify-between py-2 border-b border-border/50">
                          <span className="text-sm text-muted-foreground">{t('perFile')}</span>
                          <span className="text-sm font-bold text-green-400">{selected.perFile}&euro;</span>
                        </div>
                      )}
                    </div>

                    {/* Pay button */}
                    <Button className="w-full btn-gradient text-white font-bold py-3.5 h-auto text-base" data-testid="purchase-btn">
                      <CreditCard weight="fill" className="w-5 h-5 mr-2" />
                      {t('buyNow')} &mdash; {fmt(selected.priceInkl)} &euro;
                    </Button>

                    {/* PayPal hint */}
                    <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wider">{t('payWith')} PayPal</p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart weight="light" className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t('selectHint')}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits info card */}
            <Card className="bg-card border-border" data-testid="benefits-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-3">
                  <Star weight="bold" className="w-3.5 h-3.5" />
                  {t('infoTitle')}
                </label>
                <ul className="space-y-2.5">
                  {['info1', 'info2', 'info3', 'info4', 'info5'].map((k) => (
                    <li key={k} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check weight="bold" className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {t(k)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Vorkasse Invoice Request */}
            <Card className="bg-card border-border border-2" data-testid="vorkasse-card">
              <CardContent className="p-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-1">
                  <Bank weight="bold" className="w-3.5 h-3.5" />
                  {t('vorkasseTitle')}
                </label>
                <p className="text-[11px] text-muted-foreground mb-4">{t('vorkasseDesc')}</p>

                {vorkasseSent ? (
                  <div className="space-y-4">
                    <div className="text-center py-5 bg-green-500/8 border border-green-500/30 rounded-sm">
                      <CheckCircle weight="fill" className="w-10 h-10 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-bold text-green-400">{t('vorkasseSent')}</p>
                      <p className="text-xs text-muted-foreground mt-1 px-3">{t('vorkasseSentMsg')}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-border font-semibold text-sm"
                      data-testid="vorkasse-new-btn"
                      onClick={() => { setVorkasseSent(false); setVorkasseCredits(''); }}
                    >
                      {t('vorkasseNew')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Credits input */}
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1.5">{t('vorkasseCredits')}</label>
                      <div className="relative">
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
                      {vorkasseNum > 0 && vorkasseNum < 10 && (
                        <p className="text-[10px] text-primary mt-1">{t('vorkasseMin')}</p>
                      )}
                    </div>

                    {/* Price calculation */}
                    {vorkasseNum >= 10 && (
                      <div className="bg-secondary/30 border border-border/50 rounded-sm p-3 space-y-2">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('vorkasseCalc')}</p>
                        <div className="flex justify-between py-1">
                          <span className="text-xs text-muted-foreground">{t('vorkasseNetto')}</span>
                          <span className="text-sm font-bold text-foreground">{fmt(vorkassePrice.netto)} &euro;</span>
                        </div>
                        <div className="flex justify-between py-1 border-t border-border/40">
                          <span className="text-xs text-muted-foreground">{t('vorkasseBrutto')}</span>
                          <span className="text-sm font-bold text-primary">{fmt(vorkassePrice.brutto)} &euro;</span>
                        </div>
                      </div>
                    )}

                    {/* Submit */}
                    <Button
                      className="w-full bg-secondary/80 hover:bg-secondary border border-border text-foreground font-bold py-3 h-auto text-sm"
                      disabled={vorkasseNum < 10}
                      data-testid="vorkasse-submit-btn"
                      onClick={() => setVorkasseSent(true)}
                    >
                      <Receipt weight="fill" className="w-4 h-4 mr-2" />
                      {t('vorkasseBtn')}
                    </Button>

                    <p className="text-[10px] text-muted-foreground leading-relaxed">{t('vorkasseNote')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
