import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';

export default function Index() {
  const { t } = useLanguage();
  const products = store.getProducts();
  
  const newProducts = products.filter(p => p.isNew).slice(0, 3);
  const popularProducts = products.filter(p => p.isPopular).slice(0, 3);
  const promotionProducts = products.filter(p => p.isPromotion).slice(0, 3);

  const features = [
    {
      icon: <Truck className="w-8 h-8 text-black" />,
      title: 'Швидка доставка',
      description: 'Доставка по всій Україні за 1-3 дні'
    },
    {
      icon: <Shield className="w-8 h-8 text-black" />,
      title: 'Якісні матеріали',
      description: 'Використовуємо тільки високоякісні пластики'
    },
    {
      icon: <Headphones className="w-8 h-8 text-black" />,
      title: 'Підтримка 24/7',
      description: 'Завжди готові допомогти з вашими питаннями'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-black mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {t('welcome')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-in fade-in delay-300 duration-700">
            {t('subtitle')}
          </p>
          <Link to="/catalog">
            <Button size="lg" className="animate-in fade-in delay-500 duration-700 bg-black hover:bg-gray-800 text-white">
              {t('viewAll')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-black">{t('newProducts')}</h2>
              <Link to="/catalog?filter=new">
                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                  {t('viewAll')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">{t('popularProducts')}</h2>
              <Link to="/catalog?filter=popular">
                <Button variant="outline">
                  {t('viewAll')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {popularProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Promotions Section */}
      {promotionProducts.length > 0 && (
        <section className="py-16 bg-red-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center">
                <Star className="w-8 h-8 text-red-500 mr-2" />
                {t('promotions')}
              </h2>
              <Link to="/catalog?filter=promotion">
                <Button variant="outline">
                  {t('viewAll')} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {promotionProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Готові замовити?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Перегляньте наш каталог і виберіть ідеальний брелок для себе!
          </p>
          <Link to="/catalog">
            <Button size="lg" variant="secondary">
              {t('catalog')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}