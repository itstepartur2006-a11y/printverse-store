import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { Product, Order } from '@/lib/types';
import { SocialMedia } from '@/lib/store';
import { materials, colors } from '@/lib/mockData';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] = useState<SocialMedia | null>(null);
  const [isAddingSocialMedia, setIsAddingSocialMedia] = useState(false);

  useEffect(() => {
    // Check if admin is logged in
    if (!localStorage.getItem('adminLoggedIn')) {
      navigate('/admin');
      return;
    }

    // Additional security check - verify admin session
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession || adminSession !== 'verified') {
      localStorage.removeItem('adminLoggedIn');
      navigate('/admin');
      return;
    }

    loadData();
  }, [navigate]);

  const loadData = () => {
    setProducts(store.getProducts());
    setOrders(store.getOrders());
    setSocialMedia(store.getSocialMedia());
  };

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminSession');
    navigate('/admin');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Видалити цей товар?')) {
      store.deleteProduct(productId);
      loadData();
      toast.success('Товар видалено');
    }
  };

  // Social Media handlers
  const handleAddSocialMedia = (socialMedia: Omit<SocialMedia, 'id'>) => {
    store.addSocialMedia(socialMedia);
    loadData();
    setIsAddingSocialMedia(false);
    toast.success('Соціальну мережу додано');
  };

  const handleUpdateSocialMedia = (id: string, socialMedia: Omit<SocialMedia, 'id'>) => {
    store.updateSocialMedia(id, socialMedia);
    loadData();
    setEditingSocialMedia(null);
    toast.success('Соціальну мережу оновлено');
  };

  const handleDeleteSocialMedia = (id: string) => {
    if (confirm('Видалити цю соціальну мережу?')) {
      store.deleteSocialMedia(id);
      loadData();
      toast.success('Соціальну мережу видалено');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    store.updateOrderStatus(orderId, status);
    loadData();
    toast.success(language === 'uk' ? 'Статус оновлено' : 'Status updated');
  };

  const statistics = store.getStatistics();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">{t('adminPanel')}</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              {language === 'uk' ? 'Вийти' : 'Logout'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              Огляд
            </TabsTrigger>
            <TabsTrigger value="products">
              Товари
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t('orders')}
            </TabsTrigger>
            <TabsTrigger value="social">
              Соціальні мережі
            </TabsTrigger>
            <TabsTrigger value="data">
              Дані
            </TabsTrigger>
            <TabsTrigger value="statistics">
              {t('statistics')}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'uk' ? 'Всього товарів' : 'Total Products'}
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'uk' ? 'Всього замовлень' : 'Total Orders'}
                  </CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'uk' ? 'Очікують обробки' : 'Pending Orders'}
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{statistics.pendingOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === 'uk' ? 'Дохід' : 'Revenue'}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₴{statistics.totalRevenue}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {language === 'uk' ? 'Управління товарами' : 'Product Management'}
              </h2>
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {t('addProduct')}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t('addProduct')}</DialogTitle>
                  </DialogHeader>
                  <ProductForm 
                    onSave={() => {
                      setIsAddingProduct(false);
                      loadData();
                    }}
                    onCancel={() => setIsAddingProduct(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {products.map(product => (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.images[0] || '/api/placeholder/300/300'}
                          alt={product.name[language]}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {product.name[language]}
                          </h3>
                          <p className="text-gray-600">
                            ₴{product.price} • {product.material} • {product.color}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === 'uk' ? 'В наявності' : 'In stock'}: {product.inStock}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{product.name[language]}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <img
                                src={product.images[0] || '/api/placeholder/300/300'}
                                alt={product.name[language]}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <p>{product.description[language]}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{t('editProduct')}</DialogTitle>
                            </DialogHeader>
                            <ProductForm 
                              product={product}
                              onSave={() => loadData()}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-black hover:text-gray-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <h2 className="text-xl font-semibold mb-6">
              {language === 'uk' ? 'Управління замовленнями' : 'Order Management'}
            </h2>
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {language === 'uk' ? 'Замовлення' : 'Order'} #{order.id}
                        </h3>
                        <p className="text-gray-600">
                          {order.customerInfo.firstName} {order.customerInfo.lastName} • {order.customerInfo.phone}
                        </p>
                        <p className="text-gray-600">{order.customerInfo.address}</p>
                        {order.customerInfo.isDifferentRecipient && order.customerInfo.recipientInfo && (
                          <p className="text-sm text-black mt-1">
                            {language === 'uk' ? 'Отримувач' : 'Recipient'}: {order.customerInfo.recipientInfo.firstName} {order.customerInfo.recipientInfo.lastName} ({order.customerInfo.recipientInfo.phone})
                          </p>
                        )}
                        <div className="text-sm text-gray-600 mt-2">
                          <p className="font-medium">
                            {language === 'uk' ? 'Доставка' : 'Delivery'}: 
                            {order.delivery.method === 'nova_poshta' ? (
                              <span className="text-black">
                                {language === 'uk' ? ' Нова Пошта' : ' Nova Poshta'} 
                                ({language === 'uk' ? 
                                  order.delivery.novaPoshtaOption === 'branch' ? 'відділення' :
                                  order.delivery.novaPoshtaOption === 'postomat' ? 'поштомат' : 'кур\'єр'
                                  : 
                                  order.delivery.novaPoshtaOption === 'branch' ? 'branch' :
                                  order.delivery.novaPoshtaOption === 'postomat' ? 'postomat' : 'courier'
                                })
                              </span>
                            ) : (
                              <span className="text-black">
                                {language === 'uk' ? ' Самовіз' : ' Pickup'}
                              </span>
                            )}
                          </p>
                          {order.delivery.method === 'nova_poshta' && (
                            <p className="text-xs">
                              {order.delivery.novaPoshtaCity}, {order.delivery.novaPoshtaBranch}
                            </p>
                          )}
                          {order.delivery.method === 'pickup' && (
                            <p className="text-xs">
                              {order.delivery.pickupLocation} • {order.delivery.pickupContact}
                            </p>
                          )}
                        </div>
                        <p className="font-semibold text-black mt-2">
                          {t('total')}: ₴{order.total}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={order.status === 'pending' ? 'destructive' : 'default'}
                          className="mb-2"
                        >
                          {order.status}
                        </Badge>
                        <div className="space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(status: Order['status']) => 
                              handleUpdateOrderStatus(order.id, status)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Соціальні мережі</h2>
                <Dialog open={isAddingSocialMedia} onOpenChange={setIsAddingSocialMedia}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Додати соціальну мережу
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Додати соціальну мережу</DialogTitle>
                    </DialogHeader>
                    <SocialMediaForm 
                      onSubmit={handleAddSocialMedia}
                      onCancel={() => setIsAddingSocialMedia(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {socialMedia.map((social) => (
                  <Card key={social.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{social.name}</h3>
                          <p className="text-gray-600">{social.url}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSocialMedia(social)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Редагувати соціальну мережу</DialogTitle>
                              </DialogHeader>
                              <SocialMediaForm 
                                socialMedia={social}
                                onSubmit={(data) => handleUpdateSocialMedia(social.id, data)}
                                onCancel={() => setEditingSocialMedia(null)}
                              />
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSocialMedia(social.id)}
                            className="text-black hover:text-gray-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Data Management Tab */}
          <TabsContent value="data">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Управління даними</h2>
              
              {/* Data Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Інформація про дані</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p><strong>Товари:</strong> {store.getDataInfo().productsCount}</p>
                      <p><strong>Замовлення:</strong> {store.getDataInfo().ordersCount}</p>
                    </div>
                    <div>
                      <p><strong>Соціальні мережі:</strong> {store.getDataInfo().socialMediaCount}</p>
                      <p><strong>Останнє оновлення:</strong> {store.getDataInfo().lastModified}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Export Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Експорт даних</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Експортуйте всі дані для резервного копіювання перед оновленням коду.
                  </p>
                  <Button 
                    onClick={() => {
                      const data = store.exportData();
                      const blob = new Blob([data], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `printverse-backup-${new Date().toISOString().split('T')[0]}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      toast.success('Дані експортовано успішно!');
                    }}
                  >
                    📥 Експортувати дані
                  </Button>
                </CardContent>
              </Card>

              {/* Import Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Імпорт даних</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Відновіть дані з резервної копії.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const data = event.target?.result as string;
                          if (store.importData(data)) {
                            toast.success('Дані імпортовано успішно!');
                            window.location.reload();
                          } else {
                            toast.error('Помилка при імпорті даних!');
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                </CardContent>
              </Card>

              {/* Restore Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Відновити товари</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Відновити базові товари, якщо вони зникли.
                  </p>
                  <Button 
                    onClick={() => {
                      if (store.restoreDefaultData()) {
                        toast.success('Товари відновлено!');
                        window.location.reload();
                      } else {
                        toast.info('Товари вже існують');
                      }
                    }}
                  >
                    🔄 Відновити товари
                  </Button>
                </CardContent>
              </Card>

              {/* Clear Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Очистити дані</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-black mb-4">
                    ⚠️ Увага! Це дія видалить всі дані і поверне до початкових налаштувань.
                  </p>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Ви впевнені, що хочете видалити всі дані?')) {
                        store.clearAllData();
                        toast.success('Дані очищено!');
                        window.location.reload();
                      }
                    }}
                  >
                    🗑️ Очистити всі дані
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="statistics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{language === 'uk' ? 'Загальна статистика' : 'General Statistics'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{language === 'uk' ? 'Всього товарів:' : 'Total Products:'}</span>
                    <span className="font-semibold">{statistics.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'uk' ? 'Всього замовлень:' : 'Total Orders:'}</span>
                    <span className="font-semibold">{statistics.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'uk' ? 'Очікують обробки:' : 'Pending Orders:'}</span>
                    <span className="font-semibold">{statistics.pendingOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{language === 'uk' ? 'Загальний дохід:' : 'Total Revenue:'}</span>
                    <span className="font-semibold">₴{statistics.totalRevenue}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Product Form Component
const ProductForm: React.FC<{
  product?: Product;
  onSave: () => void;
  onCancel?: () => void;
}> = ({ product, onSave, onCancel }) => {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    material: product?.material || '',
    color: product?.color || '',
    inStock: product?.inStock || 0,
    category: product?.category || '',
    isNew: product?.isNew || false,
    isPopular: product?.isPopular || false,
    isPromotion: product?.isPromotion || false,
  });
  const [images, setImages] = useState<string[]>(product?.images || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Product = {
      id: product?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      images: images.length > 0 ? images : ['/api/placeholder/300/300'],
      material: formData.material,
      color: formData.color,
      inStock: formData.inStock,
      category: formData.category,
      isNew: formData.isNew,
      isPopular: formData.isPopular,
      isPromotion: formData.isPromotion,
      reviews: product?.reviews || []
    };

    if (product) {
      store.updateProduct(product.id, productData);
      toast.success(language === 'uk' ? 'Товар оновлено' : 'Product updated');
    } else {
      store.addProduct(productData);
      toast.success(language === 'uk' ? 'Товар додано' : 'Product added');
    }

    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Назва
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Опис
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'uk' ? 'Зображення товару' : 'Product Images'}
        </label>
        <ImageUpload
          images={images}
          onImagesChange={setImages}
          maxImages={5}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('price')}</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('material')}</label>
          <Select value={formData.material} onValueChange={(value) => setFormData({...formData, material: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {materials.map(material => (
                <SelectItem key={material} value={material}>{material}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t('color')}</label>
          <Select value={formData.color} onValueChange={(value) => setFormData({...formData, color: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colors.map(color => (
                <SelectItem key={color} value={color}>{color}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          {language === 'uk' ? 'Кількість на складі' : 'Stock Quantity'}
        </label>
        <Input
          type="number"
          value={formData.inStock}
          onChange={(e) => setFormData({...formData, inStock: Number(e.target.value)})}
          required
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isNew"
            checked={formData.isNew}
            onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
            className="rounded"
          />
          <label htmlFor="isNew" className="text-sm font-medium">
            {language === 'uk' ? 'Новинка' : 'New Product'}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPopular"
            checked={formData.isPopular}
            onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
            className="rounded"
          />
          <label htmlFor="isPopular" className="text-sm font-medium">
            {language === 'uk' ? 'Популярне' : 'Popular'}
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPromotion"
            checked={formData.isPromotion}
            onChange={(e) => setFormData({...formData, isPromotion: e.target.checked})}
            className="rounded"
          />
          <label htmlFor="isPromotion" className="text-sm font-medium">
            {language === 'uk' ? 'Акція' : 'Promotion'}
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('cancel')}
          </Button>
        )}
        <Button type="submit">
          {t('save')}
        </Button>
      </div>
    </form>
  );
};

// Social Media Form Component
const SocialMediaForm: React.FC<{
  socialMedia?: SocialMedia;
  onSubmit: (data: Omit<SocialMedia, 'id'>) => void;
  onCancel: () => void;
}> = ({ socialMedia, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: socialMedia?.name || '',
    url: socialMedia?.url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim()) {
      toast.error('Заповніть всі поля');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">
          Назва соціальної мережі
        </label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Наприклад: Facebook"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          URL
        </label>
        <Input
          value={formData.url}
          onChange={(e) => setFormData({...formData, url: e.target.value})}
          placeholder="https://facebook.com/printverse"
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Скасувати
        </Button>
        <Button type="submit">
          Зберегти
        </Button>
      </div>
    </form>
  );
};