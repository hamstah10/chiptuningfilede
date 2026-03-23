import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { ScrollArea } from '../components/ui/scroll-area';
import { 
  ArrowLeft,
  Ticket,
  Clock,
  CheckCircle,
  ChatCircle,
  Warning,
  PaperPlaneTilt,
  User,
  Headset,
  Link as LinkIcon,
  Info
} from '@phosphor-icons/react';
import { mockTickets } from './Tickets';

// Translations
const pageTranslations = {
  en: {
    backToTickets: 'Back to Tickets',
    ticketDetails: 'Ticket Details',
    conversation: 'Conversation',
    ticketInfo: 'Ticket Information',
    status: 'Status',
    priority: 'Priority',
    category: 'Category',
    created: 'Created',
    lastUpdate: 'Last Update',
    relatedOrder: 'Related Order',
    replyPlaceholder: 'Type your message...',
    sendReply: 'Send',
    open: 'Open',
    answered: 'Answered',
    closed: 'Closed',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
    technical: 'Technical',
    sales: 'Sales',
    billing: 'Billing',
    other: 'Other',
    you: 'You',
    support: 'Support',
    ticketNotFound: 'Ticket not found',
    closeTicket: 'Close Ticket',
    reopenTicket: 'Reopen Ticket',
  },
  de: {
    backToTickets: 'Zurück zu Tickets',
    ticketDetails: 'Ticket Details',
    conversation: 'Konversation',
    ticketInfo: 'Ticket Informationen',
    status: 'Status',
    priority: 'Priorität',
    category: 'Kategorie',
    created: 'Erstellt',
    lastUpdate: 'Letzte Aktualisierung',
    relatedOrder: 'Zugehöriger Auftrag',
    replyPlaceholder: 'Ihre Nachricht eingeben...',
    sendReply: 'Senden',
    open: 'Offen',
    answered: 'Beantwortet',
    closed: 'Geschlossen',
    high: 'Hoch',
    normal: 'Normal',
    low: 'Niedrig',
    technical: 'Technisch',
    sales: 'Vertrieb',
    billing: 'Rechnung',
    other: 'Sonstiges',
    you: 'Sie',
    support: 'Support',
    ticketNotFound: 'Ticket nicht gefunden',
    closeTicket: 'Ticket schließen',
    reopenTicket: 'Ticket wiedereröffnen',
  }
};

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = (key) => pageTranslations[language][key] || key;
  const [replyMessage, setReplyMessage] = useState('');

  // Find ticket
  const ticket = mockTickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <DashboardLayout title={t('ticketDetails')}>
        <div className="flex flex-col items-center justify-center py-20">
          <Info weight="fill" className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="font-heading font-semibold text-xl text-white">{t('ticketNotFound')}</h2>
          <Button 
            variant="outline" 
            className="mt-4 border-white/10"
            onClick={() => navigate('/tickets')}
          >
            <ArrowLeft weight="bold" className="w-4 h-4 mr-2" />
            {t('backToTickets')}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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

  const formatDateTime = (dateStr) => {
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const StatusIcon = statusConfig.icon;

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      // Mock sending - would call API
      console.log('Sending reply:', replyMessage);
      setReplyMessage('');
    }
  };

  return (
    <DashboardLayout title={t('ticketDetails')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-muted-foreground hover:text-white hover:bg-white/5"
              onClick={() => navigate('/tickets')}
              data-testid="back-btn"
            >
              <ArrowLeft weight="bold" className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-heading font-bold text-xl text-white">{ticket.id}</h1>
                <Badge variant="outline" className={`${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} gap-1`}>
                  <StatusIcon weight="fill" className="w-3 h-3" />
                  {statusConfig.label}
                </Badge>
                {ticket.priority === 'high' && (
                  <Badge variant="outline" className={`${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border} gap-1`}>
                    <Warning weight="fill" className="w-3 h-3" />
                    {priorityConfig.label}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{ticket.subject}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {ticket.status !== 'closed' ? (
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <CheckCircle weight="bold" className="w-4 h-4 mr-2" />
                {t('closeTicket')}
              </Button>
            ) : (
              <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Clock weight="bold" className="w-4 h-4 mr-2" />
                {t('reopenTicket')}
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-white/10" data-testid="conversation-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <ChatCircle weight="fill" className="w-5 h-5 text-primary" />
                  {t('conversation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  <div className="p-4 space-y-4">
                    {ticket.messages.map((message) => {
                      const isCustomer = message.sender === 'customer';
                      return (
                        <div 
                          key={message.id}
                          className={`flex gap-3 ${isCustomer ? '' : 'flex-row-reverse'}`}
                        >
                          {/* Avatar */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCustomer ? 'bg-primary/20' : 'bg-green-500/20'
                          }`}>
                            {isCustomer ? (
                              <User weight="fill" className="w-4 h-4 text-primary" />
                            ) : (
                              <Headset weight="fill" className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          
                          {/* Message */}
                          <div className={`flex-1 max-w-[80%] ${isCustomer ? '' : 'text-right'}`}>
                            <div className={`inline-block p-3 rounded-sm ${
                              isCustomer 
                                ? 'bg-secondary text-left' 
                                : 'bg-green-500/10 border border-green-500/20 text-left'
                            }`}>
                              <p className="text-xs text-muted-foreground mb-1">
                                {isCustomer ? t('you') : t('support')}
                              </p>
                              <p className="text-sm text-white">{message.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                {/* Reply Box */}
                {ticket.status !== 'closed' && (
                  <div className="border-t border-white/10 p-4">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder={t('replyPlaceholder')}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="bg-secondary border-white/10 min-h-[80px] resize-none"
                        data-testid="reply-input"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={handleSendReply}
                        disabled={!replyMessage.trim()}
                        data-testid="send-reply-btn"
                      >
                        <PaperPlaneTilt weight="bold" className="w-4 h-4 mr-2" />
                        {t('sendReply')}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ticket Info Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-white/10" data-testid="ticket-info-card">
              <CardHeader className="border-b border-white/10 pb-4">
                <CardTitle className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Ticket weight="fill" className="w-5 h-5 text-primary" />
                  {t('ticketInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('status')}</p>
                  <Badge variant="outline" className={`mt-1 ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                    {statusConfig.label}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('priority')}</p>
                  <Badge variant="outline" className={`mt-1 ${priorityConfig.bg} ${priorityConfig.text} border ${priorityConfig.border}`}>
                    {priorityConfig.label}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('category')}</p>
                  <p className="text-sm text-white mt-1">{getCategoryLabel(ticket.category)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('created')}</p>
                  <p className="text-sm text-white mt-1">{formatDateTime(ticket.createdAt)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('lastUpdate')}</p>
                  <p className="text-sm text-white mt-1">{formatDateTime(ticket.updatedAt)}</p>
                </div>
                
                {ticket.relatedOrder && (
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('relatedOrder')}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary hover:text-primary/80"
                      onClick={() => navigate(`/orders/${ticket.relatedOrder}`)}
                    >
                      <LinkIcon weight="bold" className="w-3 h-3 mr-1" />
                      {ticket.relatedOrder}
                    </Button>
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
