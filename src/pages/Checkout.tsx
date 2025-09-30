import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { Order } from '@/lib/types';
import { toast } from 'sonner';

export default function Checkout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const cartItems = store.getCart();
  const products = store.getProducts();

  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    isDifferentRecipient: false,
    recipientInfo: {
      firstName: '',
      lastName: '',
      phone: ''
    }
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    method: 'nova_poshta' as 'nova_poshta' | 'pickup',
    novaPoshtaOption: 'branch' as 'branch' | 'postomat' | 'courier',
    novaPoshtaCity: '',
    novaPoshtaBranch: '',
    pickupLocation: '',
    pickupContact: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-select payment method based on delivery method
  React.useEffect(() => {
    if (deliveryInfo.method === 'nova_poshta') {
      setPaymentMethod('card'); // Only card payment for Nova Poshta
    }
  }, [deliveryInfo.method]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'recipient') {
        setCustomerInfo(prev => ({
          ...prev,
          recipientInfo: {
            ...prev.recipientInfo,
            [child]: value
          }
        }));
      } else if (parent === 'delivery') {
        setDeliveryInfo(prev => ({
          ...prev,
          [child]: value
        }));
      }
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.phone || !customerInfo.address) {
        toast.error('Заповніть всі обов\'язкові поля');
        return;
      }

      // Validate recipient info if different recipient is selected
      if (customerInfo.isDifferentRecipient) {
        if (!customerInfo.recipientInfo.firstName || !customerInfo.recipientInfo.lastName || !customerInfo.recipientInfo.phone) {
          toast.error('Заповніть дані отримувача');
          return;
        }
      }

      // Validate delivery info
      if (deliveryInfo.method === 'nova_poshta') {
        if (!deliveryInfo.novaPoshtaCity || !deliveryInfo.novaPoshtaBranch) {
          toast.error('Заповніть дані доставки Новою Поштою');
          return;
        }
      } else if (deliveryInfo.method === 'pickup') {
        if (!deliveryInfo.pickupLocation || !deliveryInfo.pickupContact) {
          toast.error('Заповніть дані самовівозу');
          return;
        }
      }

      if (cartItems.length === 0) {
        toast.error('Кошик порожній');
        return;
      }

      // Calculate total
      const total = cartItems.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);

      // Create order
      const order: Order = {
        id: Date.now().toString(),
        items: cartItems,
        customerInfo,
        delivery: deliveryInfo,
        paymentMethod,
        total,
        status: 'pending',
        date: new Date().toISOString()
      };

      // Save order
      store.addOrder(order);
      store.clearCart();

      toast.success('Замовлення успішно оформлено!');
      navigate('/');

    } catch (error) {
      toast.error('Помилка оформлення замовлення');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          Кошик порожній
        </h1>
        <Button onClick={() => navigate('/catalog')}>
          Перейти до каталогу
        </Button>
      </div>
    );
  }

  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">
            {t('checkout')}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Form */}
              <div className="space-y-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      1. Контактні дані
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="phone">
                        {t('phone')} *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+380 (63) 479-68-80"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="lastName">
                          Прізвище *
                        </Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Ваше прізвище"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="firstName">
                          Ім'я *
                        </Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Ваше ім'я"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">
                        {t('address')} *
                      </Label>
                      <Textarea
                        id="address"
                        value={customerInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Місто, вулиця, будинок, квартира"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="differentRecipient"
                        checked={customerInfo.isDifferentRecipient}
                        onChange={(e) => handleInputChange('isDifferentRecipient', e.target.checked)}
                      />
                      <Label htmlFor="differentRecipient" className="font-medium">
                        Інший отримувач замовлення
                      </Label>
                    </div>

                    {customerInfo.isDifferentRecipient && (
                      <div className="space-y-4 pl-6 border-l-2 border-black">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="recipientLastName">
                              Прізвище отримувача *
                            </Label>
                            <Input
                              id="recipientLastName"
                              value={customerInfo.recipientInfo.lastName}
                              onChange={(e) => handleInputChange('recipient.lastName', e.target.value)}
                              placeholder="Прізвище отримувача"
                              required={customerInfo.isDifferentRecipient}
                            />
                          </div>
                          <div>
                            <Label htmlFor="recipientFirstName">
                              Ім'я отримувача *
                            </Label>
                            <Input
                              id="recipientFirstName"
                              value={customerInfo.recipientInfo.firstName}
                              onChange={(e) => handleInputChange('recipient.firstName', e.target.value)}
                              placeholder="Ім'я отримувача"
                              required={customerInfo.isDifferentRecipient}
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="recipientPhone">
                            Телефон отримувача *
                          </Label>
                          <Input
                            id="recipientPhone"
                            type="tel"
                            value={customerInfo.recipientInfo.phone}
                            onChange={(e) => handleInputChange('recipient.phone', e.target.value)}
                            placeholder="+380 (63) 479-68-80"
                            required={customerInfo.isDifferentRecipient}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Delivery Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      2. Доставка
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup 
                      value={deliveryInfo.method} 
                      onValueChange={(value: 'nova_poshta' | 'pickup') => handleInputChange('delivery.method', value)}
                    >
                      <div className="space-y-4">
                        {/* Nova Poshta Option */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <RadioGroupItem value="nova_poshta" id="nova_poshta" />
                            <Label htmlFor="nova_poshta" className="font-medium flex items-center cursor-pointer">
                              <Truck className="w-5 h-5 mr-2" />
                              Нова Пошта
                            </Label>
                          </div>
                          
                          {deliveryInfo.method === 'nova_poshta' && (
                            <div className="space-y-4 pl-6 border-l-2 border-black">
                              <div className="text-sm text-black font-medium mb-2">
                                Тільки по предоплаті 100%
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                Вартість доставки за тарифами Нової Пошти
                              </div>
                              
                              <RadioGroup 
                                value={deliveryInfo.novaPoshtaOption} 
                                onValueChange={(value: 'branch' | 'postomat' | 'courier') => handleInputChange('delivery.novaPoshtaOption', value)}
                              >
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="branch" id="branch" />
                                    <Label htmlFor="branch" className="cursor-pointer">
                                      У відділення
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="postomat" id="postomat" />
                                    <Label htmlFor="postomat" className="cursor-pointer">
                                      У поштомат
                                    </Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="courier" id="courier" />
                                    <Label htmlFor="courier" className="cursor-pointer">
                                      Кур'єром
                                    </Label>
                                  </div>
                                </div>
                              </RadioGroup>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="novaPoshtaCity">
                                    Місто *
                                  </Label>
                                  <Input
                                    id="novaPoshtaCity"
                                    value={deliveryInfo.novaPoshtaCity}
                                    onChange={(e) => handleInputChange('delivery.novaPoshtaCity', e.target.value)}
                                    placeholder="Введіть місто"
                                    required={deliveryInfo.method === 'nova_poshta'}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="novaPoshtaBranch">
                                    Відділення/Поштомат *
                                  </Label>
                                  <Input
                                    id="novaPoshtaBranch"
                                    value={deliveryInfo.novaPoshtaBranch}
                                    onChange={(e) => handleInputChange('delivery.novaPoshtaBranch', e.target.value)}
                                    placeholder="Номер відділення"
                                    required={deliveryInfo.method === 'nova_poshta'}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pickup Option */}
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-4">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label htmlFor="pickup" className="font-medium flex items-center cursor-pointer">
                              <Truck className="w-5 h-5 mr-2" />
                              Самовіз
                            </Label>
                          </div>
                          
                          {deliveryInfo.method === 'pickup' && (
                            <div className="space-y-4 pl-6 border-l-2 border-black">
                              <div className="text-sm text-black font-medium mb-2">
                                Безкоштовний самовіз
                              </div>
                              <div className="text-sm text-black font-medium mb-2">
                                Можна домовитися у Києві про зустріч
                              </div>
                              <div className="text-sm text-black font-medium mb-4">
                                Можна оплатити готівкою
                              </div>
                              
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="pickupLocation">
                                    Місце зустрічі *
                                  </Label>
                                  <Input
                                    id="pickupLocation"
                                    value={deliveryInfo.pickupLocation}
                                    onChange={(e) => handleInputChange('delivery.pickupLocation', e.target.value)}
                                    placeholder="Наприклад: м. Київ, центр"
                                    required={deliveryInfo.method === 'pickup'}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="pickupContact">
                                    Контакт для домовленості *
                                  </Label>
                                  <Input
                                    id="pickupContact"
                                    value={deliveryInfo.pickupContact}
                                    onChange={(e) => handleInputChange('delivery.pickupContact', e.target.value)}
                                    placeholder="Телефон або Telegram"
                                    required={deliveryInfo.method === 'pickup'}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      3. {t('paymentMethod')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(value: 'cash' | 'card') => setPaymentMethod(value)}>
                      {deliveryInfo.method === 'pickup' ? (
                        // For pickup, both cash and card are available
                        <>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center cursor-pointer">
                              <Truck className="w-5 h-5 mr-2" />
                              Готівка при зустрічі
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center cursor-pointer">
                              <CreditCard className="w-5 h-5 mr-2" />
                              {t('cardPayment')}
                            </Label>
                          </div>
                        </>
                      ) : (
                        // For Nova Poshta, only card payment (100% prepayment)
                        <>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex items-center cursor-pointer">
                              <CreditCard className="w-5 h-5 mr-2" />
                              {t('cardPayment')} (100% предоплата)
                            </Label>
                          </div>
                          <div className="text-sm text-gray-500 mt-2">
                            Нова Пошта приймає тільки предоплату 100%
                          </div>
                        </>
                      )}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ваше замовлення</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;
                        
                        return (
                          <div key={`${item.productId}-${item.quantity}`} className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <img 
                                src={product.images[0] || '/api/placeholder/300/300'} 
                                alt={product.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-gray-600">{product.material} • {product.color}</p>
                              <p className="text-sm text-gray-600">Кількість: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₴{product.price * item.quantity}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>{t('total')}:</span>
                          <span>₴{total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Доставка:</span>
                          <span className={deliveryInfo.method === 'pickup' ? 'text-black' : 'text-black'}>
                            {deliveryInfo.method === 'pickup' 
                              ? 'Безкоштовно'
                              : 'За тарифами Нової Пошти'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                          <span>{t('total')}:</span>
                          <span>₴{total}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600 mt-4">
                      <p>
                        • Самовіз: безкоштовно
                      </p>
                      <p>
                        • Нова Пошта: за тарифами компанії
                      </p>
                      <p>
                        • Термін доставки: 1-3 робочі дні
                      </p>
                      <p>
                        • Гарантія якості продукції
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Обробка...'
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {t('placeOrder')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}