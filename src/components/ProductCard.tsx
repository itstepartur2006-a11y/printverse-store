import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/types';
import { useLanguage } from './LanguageProvider';
import { store } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.inStock > 0) {
      store.addToCart(product.id);
      toast.success(`${product.name[language]} ${t('addToCart').toLowerCase()}`);
    }
  };

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
        <CardContent className="p-4">
          <div className="relative mb-4 aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[0] || '/api/placeholder/300/300'}
              alt={product.name[language]}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-green-500 text-white">
                  {language === 'uk' ? 'Новинка' : 'New'}
                </Badge>
              )}
              {product.isPromotion && (
                <Badge className="bg-red-500 text-white">
                  {language === 'uk' ? 'Акція' : 'Sale'}
                </Badge>
              )}
              {product.isPopular && (
                <Badge className="bg-yellow-500 text-white">
                  {language === 'uk' ? 'Популярне' : 'Popular'}
                </Badge>
              )}
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name[language]}
          </h3>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description[language]}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('material')}:</span>
              <Badge variant="outline">{product.material}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{t('color')}:</span>
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: getColorCode(product.color) }}
              />
            </div>
          </div>

          {product.reviews.length > 0 && (
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                ({product.reviews.length} {t('reviews').toLowerCase()})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-blue-600">
                {product.price} ₴
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {product.inStock > 0 ? (
                <span className="text-green-600">{t('inStock')}</span>
              ) : (
                <span className="text-red-600">{t('outOfStock')}</span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            className="w-full"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {t('addToCart')}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

// Helper function to get color codes
const getColorCode = (color: string): string => {
  const colorMap: { [key: string]: string } = {
    'Червоний': '#ef4444',
    'Синій': '#3b82f6',
    'Зелений': '#22c55e',
    'Жовтий': '#eab308',
    'Білий': '#ffffff',
    'Чорний': '#000000',
    'Рожевий': '#ec4899',
    'Фіолетовий': '#8b5cf6',
  };
  return colorMap[color] || '#6b7280';
};