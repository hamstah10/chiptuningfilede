import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  CurrencyCircleDollar, 
  Plus,
  ArrowUp,
  ArrowDown,
  Check
} from '@phosphor-icons/react';

// Mock data
const creditPackages = [
  { id: 1, credits: 100, price: 89, popular: false },
  { id: 2, credits: 250, price: 199, popular: true },
  { id: 3, credits: 500, price: 379, popular: false },
  { id: 4, credits: 1000, price: 699, popular: false },
];

const transactions = [
  { id: 1, type: 'purchase', amount: 250, date: '2025-01-15', description: 'Credit Purchase' },
  { id: 2, type: 'spend', amount: -75, date: '2025-01-15', description: 'BMW 330d E90 - Stage 1' },
  { id: 3, type: 'spend', amount: -85, date: '2025-01-14', description: 'Audi A4 2.0 TDI - Stage 2' },
  { id: 4, type: 'purchase', amount: 500, date: '2025-01-10', description: 'Credit Purchase' },
  { id: 5, type: 'spend', amount: -65, date: '2025-01-09', description: 'VW Golf 7 GTI - Eco Tuning' },
];

export default function Credits() {
  const { t } = useLanguage();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const currentBalance = 1250;

  return (
    <DashboardLayout title={t('creditsTitle')}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Balance */}
          <Card className="bg-card border-border" data-testid="balance-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('currentBalance')}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-heading font-bold text-5xl text-primary">
                      {currentBalance.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-lg">Credits</span>
                  </div>
                </div>
                <div className="w-20 h-20 rounded-sm bg-primary/10 flex items-center justify-center">
                  <CurrencyCircleDollar weight="fill" className="w-10 h-10 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Packages */}
          <Card className="bg-card border-border" data-testid="packages-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Plus weight="bold" className="w-5 h-5 text-primary" />
                {t('purchaseCredits')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {creditPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-4 rounded-sm border text-center transition-colors duration-200 ${
                      selectedPackage === pkg.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-white/20'
                    }`}
                    data-testid={`package-${pkg.id}`}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-foreground text-[10px]">
                        Popular
                      </Badge>
                    )}
                    {selectedPackage === pkg.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check weight="bold" className="w-3 h-3 text-foreground" />
                      </div>
                    )}
                    <p className="font-heading font-bold text-2xl text-foreground">{pkg.credits}</p>
                    <p className="text-xs text-muted-foreground">Credits</p>
                    <p className="font-semibold text-primary mt-3">€{pkg.price}</p>
                  </button>
                ))}
              </div>
              
              <Button 
                className="w-full mt-6 bg-primary hover:bg-primary/90 font-semibold"
                disabled={!selectedPackage}
                data-testid="purchase-btn"
              >
                {t('purchaseCredits')}
              </Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-card border-border" data-testid="transactions-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-heading font-semibold text-lg">
                {t('transactionHistory')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {transactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                        tx.type === 'purchase' ? 'bg-green-500/10' : 'bg-primary/10'
                      }`}>
                        {tx.type === 'purchase' ? (
                          <ArrowDown weight="bold" className="w-5 h-5 text-green-500" />
                        ) : (
                          <ArrowUp weight="bold" className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{tx.date}</p>
                      </div>
                    </div>
                    <span className={`font-heading font-bold ${
                      tx.type === 'purchase' ? 'text-green-400' : 'text-primary'
                    }`}>
                      {tx.type === 'purchase' ? '+' : ''}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-card border-border" data-testid="info-card">
            <CardHeader className="border-b border-border pb-4">
              <CardTitle className="font-heading font-semibold text-lg">
                Credit Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check weight="bold" className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Credits never expire</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check weight="bold" className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Secure PayPal payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check weight="bold" className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Instant credit delivery</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check weight="bold" className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span>Bulk discounts available</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
