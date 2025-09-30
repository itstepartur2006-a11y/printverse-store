import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from './LanguageProvider';
import { store } from '@/lib/store';
import { useAdminAccess } from './HiddenAdminAccess';

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const cartItems = store.getCart();
  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Получаем функцию для мобильного доступа к админке
  let handleLogoPress: (() => void) | undefined;
  try {
    const adminAccess = useAdminAccess();
    handleLogoPress = adminAccess.handleLogoPress;
  } catch {
    // Контекст недоступен, это нормально
  }

  const navItems = [
    { path: '/', label: t('home') },
    { path: '/catalog', label: t('catalog') },
    { path: '/about', label: t('about') },
    { path: '/contact', label: t('contact') },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3"
            onClick={handleLogoPress}
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black">
              <img 
                src="/logo.jpg" 
                alt="PRINTVERSE" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-black">PRINTVERSE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-gray-600 hover:text-black transition-colors ${
                  location.pathname === item.path ? 'text-black font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link to="/cart">
              <Button variant="outline" size="sm" className="relative border-black text-black hover:bg-black hover:text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {t('cart')}
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-black text-white text-xs">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden border-black text-black hover:bg-black hover:text-white">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="md:hidden">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};