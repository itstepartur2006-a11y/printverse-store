import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { materials, colors } from '@/lib/mockData';

export default function ProductCatalog() {
  const { t } = useLanguage();
  
  // Ensure data exists before getting products
  React.useEffect(() => {
    try {
      store.ensureDataExists();
    } catch (error) {
      console.error('Error ensuring data exists:', error);
    }
  }, []);
  
  const products = store.getProducts();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Search filter
      const searchMatch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Material filter
      const materialMatch = selectedMaterial === 'all' || product.material === selectedMaterial;

      // Color filter
      const colorMatch = selectedColor === 'all' || product.color === selectedColor;

      // Price filter
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];

      return searchMatch && materialMatch && colorMatch && priceMatch;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return a.isNew ? -1 : 1;
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedMaterial, selectedColor, priceRange, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedMaterial('all');
    setSelectedColor('all');
    setPriceRange([0, 500]);
    setSortBy('name');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black mb-4">{t('catalog')}</h1>
        
        {/* Search and Filter Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="md:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            {t('filterBy')}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  {t('filterBy')}
                </span>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Скинути
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {/* Material Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('material')}</label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allMaterials')}</SelectItem>
                      {materials.map(material => (
                        <SelectItem key={material} value={material}>{material}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('color')}</label>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('allColors')}</SelectItem>
                      {colors.map(color => (
                        <SelectItem key={color} value={color}>{color}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('priceRange')}: ₴{priceRange[0]} - ₴{priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={500}
                    min={0}
                    step={10}
                    className="mt-2"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Сортувати
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">
                        За назвою
                      </SelectItem>
                      <SelectItem value="price-low">
                        Ціна: низька → висока
                      </SelectItem>
                      <SelectItem value="price-high">
                        Ціна: висока → низька
                      </SelectItem>
                      <SelectItem value="newest">
                        Спочатку нові
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Знайдено {filteredProducts.length} товарів
          </p>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Товари не знайдені
          </h3>
          <p className="text-gray-500 mb-4">
            Спробуйте змінити параметри пошуку або фільтри
          </p>
          <Button onClick={resetFilters}>
            Скинути фільтри
          </Button>
        </div>
      )}
    </div>
  );
}