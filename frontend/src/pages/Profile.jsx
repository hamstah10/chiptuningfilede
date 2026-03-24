import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import {
  User, Buildings, Key, Copy, Eye, EyeSlash, FloppyDisk, CheckCircle,
  Wrench, GlobeSimple, Gauge, CaretDown, X, Check,
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
  website: 'www.mustermann-tuning.de',
  apiKey: 'ctf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};

const tuningToolOptions = [
  'Autotuner',
  'Alientech Kess3',
  'Alientech K-TAG',
  'CMD Flash',
  'Dimsport New Genius',
  'Dimsport New Trasdata',
  'EVC WinOLS',
  'Frieling Racing',
  'HP Tuners',
  'Magic Motorsport Flex',
  'PCM Flash',
  'BitBox',
];

const diagnoseToolOptions = [
  'VCDS (VAG-COM)',
  'ISTA+ (BMW)',
  'Xentry (Mercedes)',
  'ODIS (VW/Audi)',
  'Autel MaxiSys',
  'Launch X431',
  'Delphi DS150',
  'Bosch KTS',
  'Texa IDC5',
  'Wurth WoW',
  'iCarsoft',
  'Foxwell GT90',
];

const tabs = [
  { id: 'personal', Icon: User, name: { de: 'Pers\u00F6nliche Daten', en: 'Personal Info' }, desc: { de: 'Name, E-Mail, Telefon', en: 'Name, email, phone' } },
  { id: 'company', Icon: Buildings, name: { de: 'Firmendaten', en: 'Company Info' }, desc: { de: 'Adresse, Website, USt-IdNr.', en: 'Address, website, VAT ID' } },
  { id: 'tools', Icon: Wrench, name: { de: 'Tools & Setup', en: 'Tools & Setup' }, desc: { de: 'Dyno, Tuning- & Diagnose-Tools', en: 'Dyno, tuning & diagnostic tools' } },
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
    website: 'Website',
    save: '\u00C4nderungen speichern',
    saved: 'Gespeichert!',
    apiKey: 'API Key',
    apiDocTitle: 'API Dokumentation',
    apiDocText: 'Verwende diesen API-Key f\u00FCr die Integration mit der Chiptuningfile.de API. Dein API-Key wird \u00FCber das Super-Admin-Portal verwaltet.',
    viewDocs: 'Dokumentation ansehen',
    hasDyno: 'Leistungspr\u00FCfstand (Dyno) vorhanden',
    dynoDesc: 'Hast du einen eigenen Leistungspr\u00FCfstand in deiner Werkstatt?',
    tuningTools: 'Tuning-Tools',
    tuningToolsDesc: 'Welche Tuning-Tools / Leseger\u00E4te verwendest du?',
    diagnoseTools: 'Diagnose-Tools',
    diagnoseToolsDesc: 'Welche Diagnose-Tools verwendest du?',
    selectPlaceholder: 'Ausw\u00E4hlen...',
    selected: 'ausgew\u00E4hlt',
    noResults: 'Keine Ergebnisse',
    searchPlaceholder: 'Suchen...',
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
    website: 'Website',
    save: 'Save Changes',
    saved: 'Saved!',
    apiKey: 'API Key',
    apiDocTitle: 'API Documentation',
    apiDocText: 'Use this API key to integrate with the Chiptuningfile.de API. Your API key is managed by your super admin portal.',
    viewDocs: 'View Documentation',
    hasDyno: 'Dynamometer (Dyno) available',
    dynoDesc: 'Do you have a dyno at your workshop?',
    tuningTools: 'Tuning Tools',
    tuningToolsDesc: 'Which tuning tools / reading devices do you use?',
    diagnoseTools: 'Diagnostic Tools',
    diagnoseToolsDesc: 'Which diagnostic tools do you use?',
    selectPlaceholder: 'Select...',
    selected: 'selected',
    noResults: 'No results',
    searchPlaceholder: 'Search...',
  },
};

// ── Multi-Select Dropdown ──────────────────────────────────────────
function MultiSelect({ options, selected, onChange, placeholder, searchPlaceholder, noResults, testId }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = options.filter(o => o.toLowerCase().includes(search.toLowerCase()));

  const toggle = (item) => {
    onChange(selected.includes(item) ? selected.filter(s => s !== item) : [...selected, item]);
  };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        data-testid={testId}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-secondary/50 border border-border rounded-sm text-left transition-all",
          open && "border-primary/50 ring-1 ring-primary/20"
        )}
      >
        <span className={cn("text-sm truncate", selected.length ? "text-foreground" : "text-muted-foreground/50")}>
          {selected.length ? `${selected.length} ${placeholder.split('...')[0]}` : placeholder}
        </span>
        <CaretDown weight="bold" className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", open && "rotate-180")} />
      </button>

      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(item => (
            <Badge key={item} className="bg-primary/10 text-primary border-primary/30 text-[11px] pr-1 gap-1 font-medium">
              {item}
              <button type="button" onClick={() => toggle(item)} className="ml-0.5 hover:text-foreground">
                <X weight="bold" className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-sm shadow-xl max-h-[260px] overflow-hidden" data-testid={`${testId}-dropdown`}>
          {/* Search */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-secondary/50 border border-border rounded-sm px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50"
              data-testid={`${testId}-search`}
            />
          </div>
          {/* Options */}
          <div className="overflow-auto max-h-[200px]">
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-3">{noResults}</p>
            )}
            {filtered.map(item => {
              const isSelected = selected.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggle(item)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-all hover:bg-secondary/60",
                    isSelected && "bg-primary/5"
                  )}
                  data-testid={`${testId}-option-${item.replace(/[\s()\/+]/g, '-')}`}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected ? "bg-primary border-primary" : "border-border"
                  )}>
                    {isSelected && <Check weight="bold" className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn(isSelected ? "text-foreground font-medium" : "text-muted-foreground")}>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────
export default function Profile() {
  const { language } = useLanguage();
  const t = (k) => t_data[language]?.[k] || k;
  const [activeTab, setActiveTab] = useState('personal');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasDyno, setHasDyno] = useState(true);
  const [selectedTuningTools, setSelectedTuningTools] = useState(['Autotuner', 'Alientech Kess3']);
  const [selectedDiagnoseTools, setSelectedDiagnoseTools] = useState(['VCDS (VAG-COM)', 'Autel MaxiSys']);

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

        {/* Layout */}
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
                    isActive ? "bg-primary/8 border-primary/40" : "bg-card border-border hover:border-muted-foreground/40"
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
            {/* ── Personal ── */}
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

            {/* ── Company ── */}
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
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <GlobeSimple weight="regular" className="w-3.5 h-3.5" />
                        {t('website')}
                      </Label>
                      <Input defaultValue={mockUser.website} placeholder="www.example.de" className="bg-secondary/50 border-border" data-testid="input-website" />
                    </div>
                  </div>
                  <Button className="mt-6 btn-gradient text-white font-semibold" onClick={handleSave} data-testid="save-company-btn">
                    {saved ? <CheckCircle weight="fill" className="w-4 h-4 mr-2" /> : <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />}
                    {saved ? t('saved') : t('save')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* ── Tools & Setup ── */}
            {activeTab === 'tools' && (
              <Card className="bg-card border-border" data-testid="tools-setup-card">
                <CardContent className="p-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                    <Wrench weight="bold" className="w-3.5 h-3.5" />
                    {tabs[2].name[language]}
                  </label>
                  <div className="space-y-8">
                    {/* Dyno Toggle */}
                    <div className="flex items-start justify-between p-4 bg-secondary/30 rounded-sm border border-border" data-testid="dyno-section">
                      <div className="flex items-start gap-3">
                        <Gauge weight="fill" className={cn("w-6 h-6 mt-0.5", hasDyno ? "text-green-500" : "text-muted-foreground")} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{t('hasDyno')}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{t('dynoDesc')}</p>
                        </div>
                      </div>
                      <Switch checked={hasDyno} onCheckedChange={setHasDyno} data-testid="dyno-switch" />
                    </div>

                    {/* Tuning Tools */}
                    <div data-testid="tuning-tools-section">
                      <Label className="text-xs text-muted-foreground block mb-1">{t('tuningTools')}</Label>
                      <p className="text-[11px] text-muted-foreground/70 mb-3">{t('tuningToolsDesc')}</p>
                      <MultiSelect
                        options={tuningToolOptions}
                        selected={selectedTuningTools}
                        onChange={setSelectedTuningTools}
                        placeholder={t('selectPlaceholder')}
                        searchPlaceholder={t('searchPlaceholder')}
                        noResults={t('noResults')}
                        testId="tuning-tools-select"
                      />
                    </div>

                    {/* Diagnose Tools */}
                    <div data-testid="diagnose-tools-section">
                      <Label className="text-xs text-muted-foreground block mb-1">{t('diagnoseTools')}</Label>
                      <p className="text-[11px] text-muted-foreground/70 mb-3">{t('diagnoseToolsDesc')}</p>
                      <MultiSelect
                        options={diagnoseToolOptions}
                        selected={selectedDiagnoseTools}
                        onChange={setSelectedDiagnoseTools}
                        placeholder={t('selectPlaceholder')}
                        searchPlaceholder={t('searchPlaceholder')}
                        noResults={t('noResults')}
                        testId="diagnose-tools-select"
                      />
                    </div>
                  </div>

                  <Button className="mt-8 btn-gradient text-white font-semibold" onClick={handleSave} data-testid="save-tools-btn">
                    {saved ? <CheckCircle weight="fill" className="w-4 h-4 mr-2" /> : <FloppyDisk weight="bold" className="w-4 h-4 mr-2" />}
                    {saved ? t('saved') : t('save')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* ── API ── */}
            {activeTab === 'api' && (
              <Card className="bg-card border-border" data-testid="api-access-card">
                <CardContent className="p-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6">
                    <Key weight="bold" className="w-3.5 h-3.5" />
                    {tabs[3].name[language]}
                  </label>
                  <div className="space-y-5">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t('apiKey')}</Label>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary/50 rounded-sm border border-border font-mono text-sm text-foreground">
                          {showApiKey ? mockUser.apiKey : '\u2022'.repeat(40)}
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => setShowApiKey(!showApiKey)} data-testid="toggle-api-key">
                          {showApiKey ? <EyeSlash weight="regular" className="w-5 h-5" /> : <Eye weight="regular" className="w-5 h-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => copyToClipboard(mockUser.apiKey)} data-testid="copy-api-key">
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
