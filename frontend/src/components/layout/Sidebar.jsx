import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  House, 
  FileArrowUp, 
  ClockCounterClockwise, 
  User,
  SignOut,
  Receipt,
  Ticket,
  CaretDown,
  CaretUp,
  CarProfile,
  Sliders,
  CurrencyCircleDollar,
  ListBullets,
  ShoppingCart
} from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Collapsible menu states
  const [tuningOpen, setTuningOpen] = useState(true);
  const [creditsOpen, setCreditsOpen] = useState(true);

  // Translations
  const labels = {
    de: {
      dashboard: 'Dashboard',
      tuningFile: 'Tuning File',
      newOrder: 'Neuer Auftrag',
      allOrders: 'Alle Aufträge',
      priceList: 'Preisliste',
      configurator: 'Konfigurator',
      credits: 'Credits',
      buy: 'Kaufen',
      invoices: 'Rechnungen',
      tickets: 'Tickets',
      profile: 'Profil',
      logout: 'Abmelden',
    },
    en: {
      dashboard: 'Dashboard',
      tuningFile: 'Tuning File',
      newOrder: 'New Order',
      allOrders: 'All Orders',
      priceList: 'Price List',
      configurator: 'Configurator',
      credits: 'Credits',
      buy: 'Buy',
      invoices: 'Invoices',
      tickets: 'Tickets',
      profile: 'Profile',
      logout: 'Logout',
    }
  };

  const t = (key) => labels[language]?.[key] || labels.en[key];

  const isPathActive = (path) => location.pathname === path;
  const isGroupActive = (paths) => paths.some(p => location.pathname === p);

  // Single nav item component
  const NavItem = ({ path, icon: Icon, label, indent = false }) => {
    const isActive = isPathActive(path);
    return (
      <NavLink
        to={path}
        data-testid={`nav-${path.replace('/', '') || 'dashboard'}`}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-sm font-medium text-sm transition-colors duration-200",
          indent && "ml-4",
          isActive 
            ? "bg-primary text-white" 
            : "text-muted-foreground hover:text-white hover:bg-white/5"
        )}
      >
        <Icon weight={isActive ? "fill" : "regular"} className="w-5 h-5" />
        {label}
      </NavLink>
    );
  };

  // Collapsible menu group component
  const MenuGroup = ({ icon: Icon, label, isOpen, onToggle, children, activePaths }) => {
    const hasActiveChild = isGroupActive(activePaths);
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "flex items-center justify-between w-full px-4 py-2.5 rounded-sm font-medium text-sm transition-colors duration-200",
            hasActiveChild 
              ? "text-white" 
              : "text-muted-foreground hover:text-white hover:bg-white/5"
          )}
        >
          <span className="flex items-center gap-3">
            <Icon weight={hasActiveChild ? "fill" : "regular"} className="w-5 h-5" />
            {label}
          </span>
          {isOpen ? (
            <CaretUp weight="bold" className="w-4 h-4" />
          ) : (
            <CaretDown weight="bold" className="w-4 h-4" />
          )}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {children}
          </div>
        )}
      </div>
    );
  };

  // Separator component
  const Separator = () => (
    <div className="my-3 mx-4 h-px bg-white/10" />
  );

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col z-50"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="font-heading font-bold text-xl tracking-tight text-white">
          Chiptuningfile<span className="text-primary">.de</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {/* Dashboard - single */}
        <NavItem path="/" icon={House} label={t('dashboard')} />
        
        <Separator />

        {/* Tuning File - collapsible */}
        <MenuGroup
          icon={CarProfile}
          label={t('tuningFile')}
          isOpen={tuningOpen}
          onToggle={() => setTuningOpen(!tuningOpen)}
          activePaths={['/file-wizard', '/orders', '/price-list']}
        >
          <NavItem path="/file-wizard" icon={FileArrowUp} label={t('newOrder')} indent />
          <NavItem path="/orders" icon={ClockCounterClockwise} label={t('allOrders')} indent />
          <NavItem path="/price-list" icon={ListBullets} label={t('priceList')} indent />
        </MenuGroup>

        <Separator />

        {/* Konfigurator - single */}
        <NavItem path="/configurator" icon={Sliders} label={t('configurator')} />

        <Separator />

        {/* Credits - collapsible */}
        <MenuGroup
          icon={CurrencyCircleDollar}
          label={t('credits')}
          isOpen={creditsOpen}
          onToggle={() => setCreditsOpen(!creditsOpen)}
          activePaths={['/credits', '/invoices']}
        >
          <NavItem path="/credits" icon={ShoppingCart} label={t('buy')} indent />
          <NavItem path="/invoices" icon={Receipt} label={t('invoices')} indent />
        </MenuGroup>

        <Separator />

        {/* Tickets - single */}
        <NavItem path="/tickets" icon={Ticket} label={t('tickets')} />

        {/* Profile - single */}
        <NavItem path="/profile" icon={User} label={t('profile')} />
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          data-testid="logout-btn"
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-sm font-medium text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <SignOut weight="regular" className="w-5 h-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};
