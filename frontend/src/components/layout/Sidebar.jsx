import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { 
  House, 
  FileArrowUp, 
  Sliders, 
  CurrencyCircleDollar, 
  ClockCounterClockwise, 
  User,
  SignOut,
  Gauge,
  Receipt,
  Ticket
} from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

export const Sidebar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: House, label: t('dashboard') },
    { path: '/file-wizard', icon: FileArrowUp, label: t('fileWizard') },
    { path: '/configurator', icon: Sliders, label: t('configurator') },
    { path: '/credits', icon: CurrencyCircleDollar, label: t('credits') },
    { path: '/orders', icon: ClockCounterClockwise, label: t('orders') },
    { path: '/invoices', icon: Receipt, label: t('invoices') },
    { path: '/tickets', icon: Ticket, label: t('tickets') },
    { path: '/profile', icon: User, label: t('profile') },
  ];

  return (
    <aside 
      className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col z-50"
      data-testid="sidebar"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center">
            <Gauge weight="bold" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg tracking-tight text-white">
              Chiptuningfile
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">.de</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  data-testid={`nav-${item.path.replace('/', '') || 'dashboard'}`}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-sm font-medium text-sm transition-colors duration-200",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <Icon 
                    weight={isActive ? "fill" : "regular"} 
                    className="w-5 h-5" 
                  />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10">
        <button
          data-testid="logout-btn"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-sm font-medium text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors duration-200"
        >
          <SignOut weight="regular" className="w-5 h-5" />
          {t('logout')}
        </button>
      </div>
    </aside>
  );
};
