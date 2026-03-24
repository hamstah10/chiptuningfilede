import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  User, Buildings, Key, Copy, Eye, EyeSlash, FloppyDisk, CheckCircle,
} from '@phosphor-icons/react';
import { cn } from '../lib/utils';

const mockUser = {
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max.mustermann@example.de',
  phone: '+49 123 456 7890',
  company: 'Mustermann Tuning GmbH',
  street: 'Musterstra\u00DFe 123',
  city: 'M\u00FCnchen',
  zip: '80331',
  country: 'Deutschland',
  vatId: 'DE123456789',
  apiKey: 'ctf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

const tabs = [
  { id: 'personal', Icon: User, name: { de: 'Pers\u00F6nliche Daten', en: 'Personal Info' }, desc: { de: 'Name, E-Mail, Telefon', en: 'Name, email, phone' } },
  { id: 'company', Icon: Buildings, name: { de: 'Firmendaten', en: 'Company Info' }, desc: { de: 'Adresse, USt-IdNr.', en: 'Address, VAT ID' } },
  { id: 'api', Icon: Key, name: { de: 'API Zugang', en: 'API Access' }, desc: { de: 'API-Key & Dokumentation', en: 'API Key & Documentation' } },
];

const t_data = {
  de: {
    title: 'Profil',
    subtitle: 'Deine Konto- und Firmendaten verwalten',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    phone: 'Telefon',
    company: 'Firmenname',
    street: 'Stra\u00DFe',
    zip: 'PLZ',
    city: 'Stadt',
    country: 'Land',
    vatId: 'USt-IdNr.',
    save: '\u00C4nderungen speichern',
    saved: 'Gespeichert!',
    apiKey: 'API Key',
    apiDocTitle: 'API Dokumentation',
    apiDocText: 'Verwende diesen API-Key f\u00FCr die Integration mit der Chiptuningfile.de API. Dein API-Key wird \u00FCber das Super-Admin-Portal verwaltet.',
    viewDocs: 'Dokumentation ansehen',
  },
  en: {
    title: 'Profile',
    subtitle: 'Manage your account and company details',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    company: 'Company Name',
    street: 'Street Address',
    zip: 'ZIP Code',
    city: 'City',
    country: 'Country',
    vatId: 'VAT ID',
    save: 'Save Changes',
    saved: 'Saved!',
    apiKey: 'API Key',
    apiDocTitle: 'API Documentation',
    apiDocText: 'Use this API key to integrate with the Chiptuningfile.de API. Your API key is managed by your super admin portal.',
    viewDocs: 'View Documentation',
  },
};

export default function Profile() {
  const { language } = useLanguage();
  const t = (k) => t_data[language]?.[k] || k;
  const [activeTab, setActiveTab] = useState('personal');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1100px]">
        {/* Header */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <User weight="fill" className="w-7 h-7 text-primary" />
            {t('title')}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
        </div>

        {/* Layout: Tab list left + Content right */}
        <div className="grid grid-cols-1 xl:grid-cols-[240px_1fr] gap-6">
          {/* LEFT: Tab List */}
          <div className="space-y-2" data-testid="profile-tab-list">
            {tabs.map(tab => {
              const Icon = tab.Icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tab-${tab.id}`}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-sm border-2 transition-all text-left",
                    isActive
                      ? "bg-primary/8 border-primary/40"
                      : "bg-card border-border hover:border-muted-foreground/40"
                  )}
                >
                  <Icon weight={isActive ? "fill" : "regular"} className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  <div className="min-w-0">
                    <p className={cn("text-sm font-semibold truncate", isActive ? "text-foreground" : "text-muted-foreground")}>{tab.name[language]}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tab.desc[language]}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: Content */}
          <div>
            {/* Personal */}
            {activeTab === 'personal' && (
              <Card className="bg-card border-border" data-testid="personal-info-card">
                <CardContent className="p-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                    <User weight="bold" className="w-3.5 h-3.5" />
                    {tabs[0].name[language]}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('firstName')}</Label>
                      <Input defaultValue={mockUser.firstName} className="bg-secondary/50 border-border" data-testid="input-firstname" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('lastName')}</Label>
                      <Input defaultValue={mockUser.lastName} className="bg-secondary/50 border-border" data-testid="input-lastname" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('email')}</Label>
                      <Input type="email" defaultValue={mockUser.email} className="bg-secondary/50 border-border" data-testid="input-email" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('phone')}</Label>
                      <Input defaultValue={mockUser.phone} className="bg-secondary/50 border-border" data-testid="input-phone" />
                    </div>
                  </div>
                  <Button className="mt-6 btn-gradient text-white font-semibold" onClick={handleSave} data-testid="save-personal-btn">
                    {saved ? <CheckCircle weight="fill" className="w-4 h-4 mr-2" /> : <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />}
                    {saved ? t('saved') : t('save')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Company */}
            {activeTab === 'company' && (
              <Card className="bg-card border-border" data-testid="company-info-card">
                <CardContent className="p-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                    <Buildings weight="bold" className="w-3.5 h-3.5" />
                    {tabs[1].name[language]}
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">{t('company')}</Label>
                      <Input defaultValue={mockUser.company} className="bg-secondary/50 border-border" data-testid="input-company" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">{t('street')}</Label>
                      <Input defaultValue={mockUser.street} className="bg-secondary/50 border-border" data-testid="input-street" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('zip')}</Label>
                      <Input defaultValue={mockUser.zip} className="bg-secondary/50 border-border" data-testid="input-zip" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('city')}</Label>
                      <Input defaultValue={mockUser.city} className="bg-secondary/50 border-border" data-testid="input-city" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('country')}</Label>
                      <Input defaultValue={mockUser.country} className="bg-secondary/50 border-border" data-testid="input-country" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">{t('vatId')}</Label>
                      <Input defaultValue={mockUser.vatId} className="bg-secondary/50 border-border" data-testid="input-vatid" />
                    </div>
                  </div>
                  <Button className="mt-6 btn-gradient text-white font-semibold" onClick={handleSave} data-testid="save-company-btn">
                    {saved ? <CheckCircle weight="fill" className="w-4 h-4 mr-2" /> : <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />}
                    {saved ? t('saved') : t('save')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* API */}
            {activeTab === 'api' && (
              <Card className="bg-card border-border" data-testid="api-access-card">
                <CardContent className="p-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                    <Key weight="bold" className="w-3.5 h-3.5" />
                    {tabs[2].name[language]}
                  </label>
                  <div className="space-y-5">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('apiKey')}</Label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary/50 rounded-sm border border-border font-mono text-sm text-foreground">
                          {showApiKey ? mockUser.apiKey : '\u2022'.repeat(40)}
                        </div>
                        <Button
                          variant="ghost" size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                          onClick={() => setShowApiKey(!showApiKey)}
                          data-testid="toggle-api-key"
                        >
                          {showApiKey ? <EyeSlash weight="regular" className="w-5 h-5" /> : <Eye weight="regular" className="w-5 h-5" />}
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
                          onClick={() => copyToClipboard(mockUser.apiKey)}
                          data-testid="copy-api-key"
                        >
                          <Copy weight="regular" className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/30 rounded-sm border border-border">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">{t('apiDocTitle')}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{t('apiDocText')}</p>
                      <Button variant="outline" className="mt-4 border-border text-sm font-semibold" data-testid="view-docs-btn">
                        {t('viewDocs')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
