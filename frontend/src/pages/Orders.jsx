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
  ClockCounterClockwise, 
  Download,
  Eye,
  CarProfile
} from '@phosphor-icons/react';

// Mock data
const orders = [
  { 
    id: 'ORD-2025-001', 
    date: '2025-01-15', 
    vehicle: 'BMW 330d E90', 
    engine: '3.0 TDI 245PS',
    type: 'Stage 1', 
    status: 'completed',
    credits: 75 
  },
  { 
    id: 'ORD-2025-002', 
    date: '2025-01-14', 
    vehicle: 'Audi A4 2.0 TDI', 
    engine: '2.0 TDI 190PS',
    type: 'Stage 2', 
    status: 'processing',
    credits: 120 
  },
  { 
    id: 'ORD-2025-003', 
    date: '2025-01-13', 
    vehicle: 'VW Golf 7 GTI', 
    engine: '2.0 TSI 230PS',
    type: 'Eco Tuning', 
    status: 'completed',
    credits: 65 
  },
  { 
    id: 'ORD-2025-004', 
    date: '2025-01-12', 
    vehicle: 'Mercedes C220d', 
    engine: '2.2 CDI 170PS',
    type: 'Stage 1', 
    status: 'pending',
    credits: 75 
  },
  { 
    id: 'ORD-2025-005', 
    date: '2025-01-10', 
    vehicle: 'Porsche Cayenne', 
    engine: '3.0 V6 340PS',
    type: 'Custom', 
    status: 'completed',
    credits: 150 
  },
];

export default function Orders() {
  const { t } = useLanguage();

  const getStatusBadge = (status) => {
    const styles = {
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      processing: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      pending: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-white/10' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
    };
    const style = styles[status] || styles.pending;
    return `${style.bg} ${style.text} border ${style.border}`;
  };

  return (
    <DashboardLayout title={t('ordersTitle')}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4" data-testid="orders-stats">
          <Card className="bg-card border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="font-heading font-bold text-2xl text-white mt-1">47</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('completed')}</p>
              <p className="font-heading font-bold text-2xl text-green-400 mt-1">42</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('processing')}</p>
              <p className="font-heading font-bold text-2xl text-yellow-400 mt-1">3</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-white/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{t('pending')}</p>
              <p className="font-heading font-bold text-2xl text-muted-foreground mt-1">2</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <Card className="bg-card border-white/10" data-testid="orders-table-card">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
              <ClockCounterClockwise weight="fill" className="w-5 h-5 text-primary" />
              {t('ordersTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-semibold">{t('orderNumber')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">{t('date')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">{t('vehicle')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">{t('type')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">{t('status')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">{t('amount')}</TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-white/5 hover:bg-white/[0.02]"
                    data-testid={`order-row-${order.id}`}
                  >
                    <TableCell className="font-mono text-sm text-white">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{order.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CarProfile weight="fill" className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm text-white">{order.vehicle}</p>
                          <p className="text-xs text-muted-foreground">{order.engine}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-secondary border-white/10">
                        {order.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(order.status)}>
                        {t(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-heading font-semibold text-primary">
                      {order.credits} Credits
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-white/5"
                          data-testid={`view-order-${order.id}`}
                        >
                          <Eye weight="regular" className="w-4 h-4" />
                        </Button>
                        {order.status === 'completed' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                            data-testid={`download-order-${order.id}`}
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
