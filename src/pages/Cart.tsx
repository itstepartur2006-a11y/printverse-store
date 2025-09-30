import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { toast } from 'sonner';

export default function Cart() {
  const { t } = useLanguage();
  const cartItems = store.getCart();
  const products = store.getProducts();

  const cartWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.productId);
    return { ...item, product };
  }).filter(item => item.product);

  const total = cartWithProducts.reduce((sum, item) => {
    return sum + (item.product!.price * item.quantity);
  }, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      store.removeFromCart(productId);
      toast.success('Товар видалено з кошика');
    } else {
      store.updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    store.removeFromCart(productId);
    toast.success('Товар видалено з кошика');
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-black mb-4">{t('cartEmpty')}</h1>
          <p className="text-gray-600 mb-8">
            Додайте товари до кошика, щоб продовжити покупки
          </p>
          <Link to="/catalog">
            <Button size="lg">
              Перейти до каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-black mb-8 flex items-center">
        <ShoppingCart className="w-8 h-8 mr-3" />
        {t('cart')} ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartWithProducts.map(item => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product!.images[0]}
                    alt={item.product!.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <Link 
                      to={`/product/${item.productId}`}
                      className="text-lg font-semibold text-black text-black hover:text-gray-600"
                    >
                      {item.product!.name}
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.product!.material} • {item.product!.color}
                    </p>
                    <p className="text-black font-semibold mt-2">
                      ₴{item.product!.price}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-semibold w-12 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.product!.inStock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-black">
                      ₴{item.product!.price * item.quantity}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-black hover:text-gray-600 hover:bg-gray-50 mt-2"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('remove')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>
                Підсумок замовлення
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Товари:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Підсумок:</span>
                  <span>₴{total}</span>
                </div>

                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span className="text-green-600">
                    Безкоштовно
                  </span>
                </div>

                <hr />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('total')}:</span>
                  <span>₴{total}</span>
                </div>

                <Link to="/checkout" className="block">
                  <Button size="lg" className="w-full">
                    {t('checkout')}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>

                <Link to="/catalog" className="block">
                  <Button variant="outline" className="w-full">
                    Продовжити покупки
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}