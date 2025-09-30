import React from 'react';
import { Users, Award, Zap, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';

export default function About() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: 'Сучасні технології',
      description: 'Використовуємо найновіші 3D-принтери та високоякісні матеріали для створення унікальних брелків.'
    },
    {
      icon: <Award className="w-12 h-12 text-blue-600" />,
      title: 'Гарантія якості',
      description: 'Кожен брелок проходить ретельну перевірку якості перед відправкою клієнту.'
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: 'Досвідчена команда',
      description: 'Наша команда має багаторічний досвід у сфері 3D-друку та дизайну.'
    },
    {
      icon: <Heart className="w-12 h-12 text-blue-600" />,
      title: 'Індивідуальний підхід',
      description: 'Ми створюємо персоналізовані брелки за вашими ескізами та побажаннями.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('aboutUs')}</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            {t('aboutText')}
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Ми прагнемо надавати нашим клієнтам найкращі продукти та сервіс. Кожен брелок - це результат нашої пристрасті до деталей та прагнення до досконалості.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Company Story */}
      <div className="bg-gray-50 rounded-lg p-8 mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Наша історія
        </h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Компанія була заснована у 2020 році групою ентузіастів 3D-друку, які хотіли зробити унікальні аксесуари доступними для кожного. Почавши з невеликої майстерні, ми виросли в команду професіоналів, яка обслуговує клієнтів по всій Україні.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Сьогодні ми пишаємося тим, що створили тисячі унікальних брелків для наших клієнтів, кожен з яких розповідає свою особливу історію.
            </p>
          </div>
          <div className="text-center">
            <img 
              src="/api/placeholder/400/300" 
              alt="Our workshop" 
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
          <p className="text-gray-600">
            Задоволених клієнтів
          </p>
        </div>
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
          <p className="text-gray-600">
            Виготовлених брелків
          </p>
        </div>
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
          <p className="text-gray-600">
            Унікальних дизайнів
          </p>
        </div>
        <div>
          <div className="text-4xl font-bold text-blue-600 mb-2">4.9</div>
          <p className="text-gray-600">
            Середня оцінка
          </p>
        </div>
      </div>
    </div>
  );
}