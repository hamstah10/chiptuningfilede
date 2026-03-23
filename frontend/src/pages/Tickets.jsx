import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { 
  Ticket, 
  Plus,
  MagnifyingGlass,
  FunnelSimple,
  ChatCircle,
  Clock,
  CheckCircle,
  Warning,
  ArrowRight,
  PaperPlaneTilt,
  Paperclip
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

// Mock tickets data
export const mockTickets = [
  {
    id: 'TKT-2025-0012',
    subject: 'Datei funktioniert nicht richtig',
    category: 'technical',
    status: 'open',
    priority: 'high',
    createdAt: '2025-01-15T10:30:00',
    updatedAt: '2025-01-15T14:20:00',
    messages: [
      { 
        id: 1, 
        sender: 'customer', 
        message: 'Die modifizierte Datei für meinen BMW 330d zeigt Fehler im Steuergerät. Das Fahrzeug geht in den Notlauf.', 
        timestamp: '2025-01-15T10:30:00' 
      },
      { 
        id: 2, 
        sender: 'support', 
        message: 'Vielen Dank für Ihre Nachricht. Können Sie bitte die Fehlercodes auslesen und uns mitteilen? Wir werden das Problem schnellstmöglich lösen.', 
        timestamp: '2025-01-15T11:45:00' 
      },
      { 
        id: 3, 
        sender: 'customer', 
        message: 'Die Fehlercodes sind: P0401, P0402. Bitte um schnelle Hilfe.', 
        timestamp: '2025-01-15T14:20:00' 
      },
    ],
    relatedOrder: 'TF-2025-0089',
  },
  {
    id: 'TKT-2025-0011',
    subject: 'Frage zu Stage 2 Tuning',
    category: 'sales',
    status: 'answered',
    priority: 'normal',
    createdAt: '2025-01-14T09:15:00',
    updatedAt: '2025-01-14T16:30:00',
    messages: [
      { 
        id: 1, 
        sender: 'customer', 
        message: 'Welche Hardware-Modifikationen sind für Stage 2 bei meinem Audi A4 notwendig?', 
        timestamp: '2025-01-14T09:15:00' 
      },
      { 
        id: 2, 
        sender: 'support', 
        message: 'Für Stage 2 empfehlen wir einen Downpipe und einen Ladeluftkühler-Upgrade. Optional auch einen Ansaugtrakt. Wir können Ihnen gerne passende Partner empfehlen.', 
        timestamp: '2025-01-14T16:30:00' 
      },
    ],
    relatedOrder: null,
  },
  {
    id: 'TKT-2025-0010',
    subject: 'Rechnung benötigt',
    category: 'billing',
    status: 'closed',
    priority: 'low',
    createdAt: '2025-01-12T14:00:00',
    updatedAt: '2025-01-12T15:30:00',
    messages: [
      { 
        id: 1, 
        sender: 'customer', 
        message: 'Ich benötige eine Rechnung für meine letzte Bestellung TF-2025-0085.', 
        timestamp: '2025-01-12T14:00:00' 
      },
      { 
        id: 2, 
        sender: 'support', 
        message: 'Die Rechnung wurde an Ihre E-Mail-Adresse gesendet. Sie finden sie auch im Bereich "Rechnungen".', 
        timestamp: '2025-01-12T15:30:00' 
      },
    ],
    relatedOrder: 'TF-2025-0085',
  },
  {
    id: 'TKT-2025-0009',
    subject: 'DPF Regeneration nach Tuning',
    category: 'technical',
    status: 'open',
    priority: 'normal',
    createdAt: '2025-01-10T11:00:00',
    updatedAt: '2025-01-10T11:00:00',
    messages: [
      { 
        id: 1, 
        sender: 'customer', 
        message: 'Nach dem Stage 1 Tuning macht mein Fahrzeug keine DPF Regeneration mehr. Ist das normal?', 
        timestamp: '2025-01-10T11:00:00' 
      },
    ],
    relatedOrder: 'TF-2025-0087',
  },
];

// Translations
const pageTranslations = {
  en: {
    pageTitle: 'Support Tickets',
    allTickets: 'All Tickets',
    newTicket: 'New Ticket',
    searchPlaceholder: 'Search tickets...',
    filterByStatus: 'Status',
    allStatus: 'All Status',
    open: 'Open',
    answered: 'Answered',
    closed: 'Closed',
    subject: 'Subject',
    category: 'Category',
    status: 'Status',
    priority: 'Priority',
    created: 'Created',
    lastUpdate: 'Last Update',
    actions: 'Actions',
    noTickets: 'No tickets found',
    technical: 'Technical',
    sales: 'Sales',
    billing: 'Billing',
    other: 'Other',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
    totalTickets: 'Total Tickets',
    openTickets: 'Open',
    awaitingReply: 'Awaiting Reply',
    createTicket: 'Create Ticket',
    ticketSubject: 'Subject',
    ticketCategory: 'Category',
    ticketPriority: 'Priority',
    ticketMessage: 'Message',
    submit: 'Submit',
    cancel: 'Cancel',
    relatedOrder: 'Related Order',
    optional: 'Optional',
  },
  de: {
    pageTitle: 'Support Tickets',
    allTickets: 'Alle Tickets',
    newTicket: 'Neues Ticket',
    searchPlaceholder: 'Tickets suchen...',
    filterByStatus: 'Status',
    allStatus: 'Alle Status',
    open: 'Offen',
    answered: 'Beantwortet',
    closed: 'Geschlossen',
    subject: 'Betreff',
    category: 'Kategorie',
    status: 'Status',
    priority: 'Priorität',
    created: 'Erstellt',
    lastUpdate: 'Letzte Aktualisierung',
    actions: 'Aktionen',
    noTickets: 'Keine Tickets gefunden',
    technical: 'Technisch',
    sales: 'Vertrieb',
    billing: 'Rechnung',
    other: 'Sonstiges',
    high: 'Hoch',
    normal: 'Normal',
    low: 'Niedrig',
    totalTickets: 'Gesamt Tickets',
    openTickets: 'Offen',
    awaitingReply: 'Warten auf Antwort',
    createTicket: 'Ticket erstellen',
    ticketSubject: 'Betreff',
    ticketCategory: 'Kategorie',
    ticketPriority: 'Priorität',
    ticketMessage: 'Nachricht',
    submit: 'Absenden',
    cancel: 'Abbrechen',
    relatedOrder: 'Zugehöriger Auftrag',
    optional: 'Optional',
  }
};

export default function Tickets() {
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter tickets
  const filteredTickets = mockTickets.filter(ticket => {
    const statusMatch = statusFilter === 'all' || ticket.status === statusFilter;
    const searchMatch = searchQuery === '' || 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Stats
  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === 'open').length,
    answered: mockTickets.filter(t => t.status === 'answered').length,
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { 
        bg: 'bg-yellow-500/20', 
        text: 'text-yellow-400', 
        border: 'border-yellow-500/30',
        icon: Clock,
        label: t('open')
      },
      answered: { 
        bg: 'bg-green-500/20', 
        text: 'text-green-400', 
        border: 'border-green-500/30',
        icon: ChatCircle,
        label: t('answered')
      },
      closed: { 
        bg: 'bg-muted', 
        text: 'text-muted-foreground', 
        border: 'border-white/10',
        icon: CheckCircle,
        label: t('closed')
      },
    };
    return configs[status] || configs.open;
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: t('high') },
      normal: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', label: t('normal') },
      low: { bg: 'bg-muted', text: 'text-muted-foreground', border: 'border-white/10', label: t('low') },
    };
    return configs[priority] || configs.normal;
  };

  const getCategoryLabel = (category) => {
    const labels = {
      technical: t('technical'),
      sales: t('sales'),
      billing: t('billing'),
      other: t('other'),
    };
    return labels[category] || category;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-testid="tickets-stats">
          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('totalTickets')}</p>
                  <p className="font-heading font-bold text-3xl text-white mt-2">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-primary/10 flex items-center justify-center">
                  <Ticket weight="fill" className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('openTickets')}</p>
                  <p className="font-heading font-bold text-3xl text-yellow-400 mt-2">{stats.open}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-yellow-500/10 flex items-center justify-center">
                  <Clock weight="fill" className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-white/10">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('awaitingReply')}</p>
                  <p className="font-heading font-bold text-3xl text-green-400 mt-2">{stats.answered}</p>
                </div>
                <div className="w-12 h-12 rounded-sm bg-green-500/10 flex items-center justify-center">
                  <ChatCircle weight="fill" className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <Card className="bg-card border-white/10" data-testid="tickets-list-card">
          <CardHeader className="border-b border-white/10 pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                <Ticket weight="fill" className="w-5 h-5 text-primary" />
                {t('allTickets')}
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
                    className="w-48 pl-9 bg-secondary border-white/10"
                    data-testid="tickets-search"
                  />
                </div>
                
                {/* Status Filter */}
                <FunnelSimple weight="bold" className="w-4 h-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-secondary border-white/10" data-testid="status-filter">
                    <SelectValue placeholder={t('filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="all">{t('allStatus')}</SelectItem>
                    <SelectItem value="open">{t('open')}</SelectItem>
                    <SelectItem value="answered">{t('answered')}</SelectItem>
                    <SelectItem value="closed">{t('closed')}</SelectItem>
                  </SelectContent>
                </Select>

                {/* New Ticket Button */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90" data-testid="new-ticket-btn">
                      <Plus weight="bold" className="w-4 h-4 mr-2" />
                      {t('newTicket')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card border-white/10 max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-heading text-xl">{t('createTicket')}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>{t('ticketSubject')}</Label>
                        <Input 
                          placeholder={t('ticketSubject')}
                          className="bg-secondary border-white/10"
                          data-testid="ticket-subject-input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t('ticketCategory')}</Label>
                          <Select defaultValue="technical">
                            <SelectTrigger className="bg-secondary border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                              <SelectItem value="technical">{t('technical')}</SelectItem>
                              <SelectItem value="sales">{t('sales')}</SelectItem>
                              <SelectItem value="billing">{t('billing')}</SelectItem>
                              <SelectItem value="other">{t('other')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t('ticketPriority')}</Label>
                          <Select defaultValue="normal">
                            <SelectTrigger className="bg-secondary border-white/10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                              <SelectItem value="high">{t('high')}</SelectItem>
                              <SelectItem value="normal">{t('normal')}</SelectItem>
                              <SelectItem value="low">{t('low')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>{t('relatedOrder')} <span className="text-muted-foreground text-xs">({t('optional')})</span></Label>
                        <Input 
                          placeholder="TF-2025-XXXX"
                          className="bg-secondary border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t('ticketMessage')}</Label>
                        <Textarea 
                          placeholder={t('ticketMessage')}
                          className="bg-secondary border-white/10 min-h-[120px]"
                          data-testid="ticket-message-input"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <Button 
                          variant="outline" 
                          className="border-white/10"
                          onClick={() => setIsDialogOpen(false)}
                        >
                          {t('cancel')}
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90">
                          <PaperPlaneTilt weight="bold" className="w-4 h-4 mr-2" />
                          {t('submit')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {filteredTickets.length > 0 ? (
              <div className="divide-y divide-white/5">
                {filteredTickets.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  const priorityConfig = getPriorityConfig(ticket.priority);
                  const StatusIcon = statusConfig.icon;
                  const lastMessage = ticket.messages[ticket.messages.length - 1];
                  
                  return (
                    <div 
                      key={ticket.id}
                      className="p-4 hover:bg-white/[0.02] transition-colors duration-200 cursor-pointer"
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      data-testid={`ticket-item-${ticket.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          {/* Icon */}
                          <div className={`w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 ${statusConfig.bg}`}>
                            <StatusIcon weight="fill" className={`w-5 h-5 ${statusConfig.text}`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-xs text-primary">{ticket.id}</span>
                              <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                {statusConfig.label}
                              </Badge>
                              {ticket.priority === 'high' && (
                                <Badge variant="outline" className={`${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border} gap-1`}>
                                  <Warning weight="fill" className="w-3 h-3" />
                                  {priorityConfig.label}
                                </Badge>
                              )}
                              <Badge variant="outline" className="bg-secondary border-white/10 text-xs">
                                {getCategoryLabel(ticket.category)}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-white mt-1 truncate">{ticket.subject}</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                              {lastMessage.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{formatDate(ticket.createdAt)}</span>
                              {ticket.relatedOrder && (
                                <span className="text-primary">→ {ticket.relatedOrder}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Message Count & Arrow */}
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="font-heading font-bold text-lg text-white">{ticket.messages.length}</p>
                            <p className="text-xs text-muted-foreground">
                              {language === 'de' ? 'Nachrichten' : 'Messages'}
                            </p>
                          </div>
                          <ArrowRight weight="bold" className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {t('noTickets')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
