import { useLanguage } from '../../context/LanguageContext';
import { Bell, MagnifyingGlass, GlobeSimple } from '@phosphor-icons/react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';

export const Header = ({ title }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header 
      className="h-16 bg-black/50 backdrop-blur-sm border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40"
      data-testid="header"
    >
      {/* Title */}
      <h2 className="font-heading font-semibold text-xl tracking-tight text-white">
        {title}
      </h2>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-64 pl-9 bg-secondary border-white/10 text-sm"
            data-testid="search-input"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-white hover:bg-white/5"
          data-testid="notifications-btn"
        >
          <Bell weight="regular" className="w-5 h-5" />
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary text-[10px] font-bold"
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
              className="gap-2 text-muted-foreground hover:text-white hover:bg-white/5"
              data-testid="language-switcher"
            >
              <GlobeSimple weight="regular" className="w-5 h-5" />
              <span className="uppercase text-xs font-semibold">{language}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-white/10">
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
          className="w-9 h-9 rounded-sm bg-secondary border border-white/10 flex items-center justify-center"
          data-testid="user-avatar"
        >
          <span className="text-sm font-semibold text-white">JD</span>
        </div>
      </div>
    </header>
  );
};
