import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';

export default function Index() {
  const { t } = useLanguage();

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
      <section className="bg-white py-20">
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

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-black">
            Готові замовити?
          </h2>
          <p className="text-xl mb-8 text-gray-600">
            Перегляньте наш каталог і виберіть ідеальний брелок для себе!
          </p>
          <Link to="/catalog">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white">
              {t('catalog')} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}