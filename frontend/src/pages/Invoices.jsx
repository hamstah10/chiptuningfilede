import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { 
  Receipt, 
  Download,
  Eye,
  CurrencyCircleDollar,
  CalendarBlank,
  FunnelSimple,
  FileText,
  CheckCircle,
  Clock,
  XCircle
} from '@phosphor-icons/react';

// Mock data for invoices/purchases
const invoices = [
  { 
    id: 'INV-2025-0047', 
    date: '2025-01-15', 
    credits: 250,
    amount: 199.00,
    tax: 37.81,
    total: 236.81,
    status: 'paid',
    paymentMethod: 'PayPal',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-0046', 
    date: '2025-01-10', 
    credits: 500,
    amount: 379.00,
    tax: 71.01,
    total: 451.01,
    status: 'paid',
    paymentMethod: 'PayPal',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2025-0045', 
    date: '2025-01-05', 
    credits: 100,
    amount: 89.00,
    tax: 16.91,
    total: 105.91,
    status: 'paid',
    paymentMethod: 'PayPal',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2024-0044', 
    date: '2024-12-20', 
    credits: 250,
    amount: 199.00,
    tax: 37.81,
    total: 236.81,
    status: 'paid',
    paymentMethod: 'PayPal',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2024-0043', 
    date: '2024-12-15', 
    credits: 1000,
    amount: 699.00,
    tax: 132.81,
    total: 831.81,
    status: 'paid',
    paymentMethod: 'Überweisung',
    downloadUrl: '#'
  },
  { 
    id: 'INV-2024-0042', 
    date: '2024-12-01', 
    credits: 250,
    amount: 199.00,
    tax: 37.81,
    total: 236.81,
    status: 'cancelled',
    paymentMethod: 'PayPal',
    downloadUrl: null
  },
];

// Translations for this page
const pageTranslations = {
  en: {
    pageTitle: 'Invoices & Purchases',
    totalPurchases: 'Total Purchases',
    totalCredits: 'Credits Purchased',
    totalSpent: 'Total Spent',
    pendingInvoices: 'Pending',
    invoiceList: 'Invoice History',
    invoiceNumber: 'Invoice #',
    date: 'Date',
    credits: 'Credits',
    netAmount: 'Net',
    tax: 'VAT (19%)',
    total: 'Total',
    status: 'Status',
    payment: 'Payment',
    actions: 'Actions',
    paid: 'Paid',
    pending: 'Pending',
    cancelled: 'Cancelled',
    download: 'Download PDF',
    view: 'View',
    filterByYear: 'Filter by Year',
    allYears: 'All Years',
    filterByStatus: 'Filter by Status',
    allStatus: 'All Status',
    noInvoices: 'No invoices found',
  },
  de: {
    pageTitle: 'Rechnungen & Käufe',
    totalPurchases: 'Gesamte Käufe',
    totalCredits: 'Gekaufte Credits',
    totalSpent: 'Gesamtausgaben',
    pendingInvoices: 'Ausstehend',
    invoiceList: 'Rechnungsverlauf',
    invoiceNumber: 'Rechnung #',
    date: 'Datum',
    credits: 'Credits',
    netAmount: 'Netto',
    tax: 'MwSt. (19%)',
    total: 'Gesamt',
    status: 'Status',
    payment: 'Zahlung',
    actions: 'Aktionen',
    paid: 'Bezahlt',
    pending: 'Ausstehend',
    cancelled: 'Storniert',
    download: 'PDF herunterladen',
    view: 'Ansehen',
    filterByYear: 'Nach Jahr filtern',
    allYears: 'Alle Jahre',
    filterByStatus: 'Nach Status filtern',
    allStatus: 'Alle Status',
    noInvoices: 'Keine Rechnungen gefunden',
  }
};

export default function Invoices() {
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;
  
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Calculate stats
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const totalCredits = paidInvoices.reduce((sum, inv) => sum + inv.credits, 0);
  const totalSpent = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending').length;

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    const yearMatch = yearFilter === 'all' || inv.date.startsWith(yearFilter);
    const statusMatch = statusFilter === 'all' || inv.status === statusFilter;
    return yearMatch && statusMatch;
  });

  const getStatusBadge = (status) => {
    const styles = {
      paid: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: CheckCircle },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: Clock },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: XCircle },
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;
    return (
      <Badge variant="outline" className={`${style.bg} ${style.text} border ${style.border} gap-1`}>
        <Icon weight="fill" className="w-3 h-3" />
        {t(status)}
      </Badge>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateStr) => {
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <DashboardLayout title={t('pageTitle')}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="invoices-stats">
          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalPurchases')}</p>
                  <p className="font-heading font-bold text-3xl text-white mt-2">
                    {paidInvoices.length}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Receipt weight="fill" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalCredits')}</p>
                  <p className="font-heading font-bold text-3xl text-primary mt-2">
                    {totalCredits.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                  <CurrencyCircleDollar weight="fill" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalSpent')}</p>
                  <p className="font-heading font-bold text-3xl text-white mt-2">
                    {formatCurrency(totalSpent)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-green-500/10 flex items-center justify-center">
                  <FileText weight="fill" className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('pendingInvoices')}</p>
                  <p className="font-heading font-bold text-3xl text-yellow-400 mt-2">
                    {pendingCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-yellow-500/10 flex items-center justify-center">
                  <Clock weight="fill" className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Invoice Table */}
        <Card className="bg-card border-white/10" data-testid="invoices-table-card">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Receipt weight="fill" className="w-5 h-5 text-primary" />
                {t('invoiceList')}
              </CardTitle>
              
              <div className="flex items-center gap-3">
                <FunnelSimple weight="bold" className="w-4 h-4 text-muted-foreground" />
                <Select value={yearFilter} onValueChange={setYearFilter}>
                  <SelectTrigger className="w-32 bg-secondary border-white/10" data-testid="year-filter">
                    <SelectValue placeholder={t('filterByYear')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">{t('allYears')}</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-secondary border-white/10" data-testid="status-filter">
                    <SelectValue placeholder={t('filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">{t('allStatus')}</SelectItem>
                    <SelectItem value="paid">{t('paid')}</SelectItem>
                    <SelectItem value="pending">{t('pending')}</SelectItem>
                    <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredInvoices.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-semibold">{t('invoiceNumber')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">{t('date')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">{t('credits')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-right">{t('netAmount')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-right">{t('tax')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-right">{t('total')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">{t('payment')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">{t('status')}</TableHead>
                    <TableHead className="text-muted-foreground font-semibold text-right">{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow 
                      key={invoice.id} 
                      className="border-white/5 hover:bg-white/[0.02]"
                      data-testid={`invoice-row-${invoice.id}`}
                    >
                      <TableCell className="font-mono text-sm text-white">{invoice.id}</TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CalendarBlank weight="regular" className="w-4 h-4" />
                          {formatDate(invoice.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CurrencyCircleDollar weight="fill" className="w-4 h-4 text-primary" />
                          <span className="font-heading font-semibold text-primary">{invoice.credits}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-white">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{formatCurrency(invoice.tax)}</TableCell>
                      <TableCell className="text-right font-semibold text-white">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-secondary border-white/10">
                          {invoice.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5"
                            data-testid={`view-invoice-${invoice.id}`}
                          >
                            <Eye weight="regular" className="w-4 h-4" />
                          </Button>
                          {invoice.status === 'paid' && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                              data-testid={`download-invoice-${invoice.id}`}
                            >
                              <Download weight="regular" className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {t('noInvoices')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
