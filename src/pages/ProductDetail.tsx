import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  const product = store.getProduct(id!);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          {language === 'uk' ? 'Товар не знайдено' : 'Product not found'}
        </h1>
        <Link to="/catalog">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {language === 'uk' ? 'Повернутися до каталогу' : 'Back to Catalog'}
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.inStock >= quantity) {
      store.addToCart(product.id, quantity);
      toast.success(`${product.name[language]} ${t('addToCart').toLowerCase()} (${quantity} шт.)`);
    } else {
      toast.error(language === 'uk' ? 'Недостатньо товару на складі' : 'Not enough stock');
    }
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.inStock) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmitReview = () => {
    if (newReview.name.trim() && newReview.comment.trim()) {
      const review = {
        id: Date.now().toString(),
        customerName: newReview.name,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0]
      };
      
      product.reviews.push(review);
      store.updateProduct(product.id, product);
      
      setNewReview({ name: '', rating: 5, comment: '' });
      toast.success(language === 'uk' ? 'Відгук додано!' : 'Review added!');
    }
  };

  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link to="/catalog" className="flex items-center text-black hover:text-gray-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {language === 'uk' ? 'Повернутися до каталогу' : 'Back to Catalog'}
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Product Images */}
        <div>
          <div className="mb-4 aspect-square overflow-hidden rounded-lg shadow-lg">
            <img
              src={product.images[selectedImage] || '/api/placeholder/300/300'}
              alt={product.name[language]}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-black' : 'border-black'
                  }`}
                >
                  <img src={image || '/api/placeholder/300/300'} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.isNew && (
              <Badge className="bg-black text-white">
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

          <h1 className="text-3xl font-bold text-black mb-4">
            {product.name[language]}
          </h1>

          {product.reviews.length > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-600 ml-2">
                {averageRating.toFixed(1)} ({product.reviews.length} {t('reviews').toLowerCase()})
              </span>
            </div>
          )}

          <div className="text-4xl font-bold text-blue-600 mb-6">
            ₴{product.price}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <span className="text-gray-600">{t('material')}:</span>
              <Badge variant="outline" className="ml-2">{product.material}</Badge>
            </div>
            <div>
              <span className="text-gray-600">{t('color')}:</span>
              <Badge variant="outline" className="ml-2">{product.color}</Badge>
            </div>
          </div>

          <div className="mb-6">
            <span className={`text-lg font-semibold ${
              product.inStock > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock > 0 
                ? `${t('inStock')} (${product.inStock} шт.)`
                : t('outOfStock')
              }
            </span>
          </div>

          {product.inStock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-600">{t('quantity')}:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.inStock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            disabled={product.inStock === 0}
            size="lg"
            className="w-full mb-6"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t('addToCart')}
          </Button>

          <div>
            <h3 className="text-xl font-semibold mb-3">{t('description')}</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description[language]}
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t('reviews')} ({product.reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {product.reviews.length > 0 ? (
            <div className="space-y-4 mb-6">
              {product.reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{review.customerName}</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-2">{review.date}</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">
              {language === 'uk' ? 'Поки що немає відгуків' : 'No reviews yet'}
            </p>
          )}

          {/* Add Review Form */}
          <div className="border-t pt-6">
            <h4 className="text-lg font-semibold mb-4">
              {language === 'uk' ? 'Залишити відгук' : 'Leave a Review'}
            </h4>
            <div className="space-y-4">
              <Input
                placeholder={t('name')}
                value={newReview.name}
                onChange={(e) => setNewReview({...newReview, name: e.target.value})}
              />
              <div className="flex items-center space-x-2">
                <span>{language === 'uk' ? 'Оцінка:' : 'Rating:'}</span>
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setNewReview({...newReview, rating: i + 1})}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        i < newReview.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder={language === 'uk' ? 'Ваш відгук...' : 'Your review...'}
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
              />
              <Button onClick={handleSubmitReview}>
                {language === 'uk' ? 'Додати відгук' : 'Add Review'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}