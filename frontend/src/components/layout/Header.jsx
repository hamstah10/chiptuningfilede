import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Bell, MagnifyingGlass, GlobeSimple, FilePlus, CurrencyCircleDollar, Sun, Moon } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export const Header = () => {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const orderText = language === 'de' ? 'Auftrag' : 'Order';
  const creditsText = language === 'de' ? 'Credits kaufen' : 'Buy Credits';

  return (
    <header 
      className="h-16 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-40"
      data-testid="header"
    >
      {/* Left Section - Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-72 pl-9 bg-secondary border-border text-sm"
            data-testid="search-input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* New Order Button */}
        <Button
          className="btn-gradient text-white font-semibold"
          onClick={() => navigate('/file-wizard')}
          data-testid="header-new-order-btn"
        >
          <FilePlus weight="bold" className="w-4 h-4 mr-2" />
          {orderText}
        </Button>

        {/* Buy Credits Button */}
        <Button
          variant="outline"
          className="border-border hover:bg-secondary font-semibold"
          onClick={() => navigate('/credits')}
          data-testid="header-buy-credits-btn"
        >
          <CurrencyCircleDollar weight="bold" className="w-4 h-4 mr-2" />
          {creditsText}
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          onClick={toggleTheme}
          data-testid="theme-toggle"
        >
          {theme === 'dark' ? (
            <Sun weight="regular" className="w-5 h-5" />
          ) : (
            <Moon weight="regular" className="w-5 h-5" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground hover:bg-secondary"
          data-testid="notifications-btn"
        >
          <Bell weight="regular" className="w-5 h-5" />
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center badge-gradient text-white text-[10px] font-bold border-0"
          >
            3
          </Badge>
        </Button>

        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-secondary"
              data-testid="language-switcher"
            >
              <GlobeSimple weight="regular" className="w-5 h-5" />
              <span className="uppercase text-xs font-semibold">{language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem 
              onClick={() => setLanguage('de')}
              className={language === 'de' ? 'bg-primary/20 text-primary' : ''}
              data-testid="lang-de"
            >
              {t('german')}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLanguage('en')}
              className={language === 'en' ? 'bg-primary/20 text-primary' : ''}
              data-testid="lang-en"
            >
              {t('english')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <div 
          className="w-9 h-9 rounded-sm bg-secondary border border-border flex items-center justify-center"
          data-testid="user-avatar"
        >
          <span className="text-sm font-semibold text-foreground">JD</span>
        </div>
      </div>
    </header>
  );
};
