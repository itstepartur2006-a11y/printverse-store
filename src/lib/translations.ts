export const translations = {
    uk: {
      // Navigation
      home: 'Головна',
      catalog: 'Каталог',
      about: 'Про нас',
      contact: 'Контакти',
      cart: 'Кошик',
      admin: 'Адмін',
      
      // Homepage
      welcome: 'Вітаємо у світі 3D-друку!',
      subtitle: 'Тут на вас чекають креативні брелки, корисні аксесуари та яскраві іграшки — усе створене з любов\'ю на 3D-принтері.',
      newProducts: 'Нові товари',
      popularProducts: 'Популярні брелки',
      promotions: 'Акції',
      viewAll: 'Переглянути все',
      
      // Products
      addToCart: 'Додати в кошик',
      price: 'Ціна',
      inStock: 'В наявності',
      outOfStock: 'Немає в наявності',
      material: 'Матеріал',
      color: 'Колір',
      reviews: 'Відгуки',
      description: 'Опис',
      
      // Filters
      filterBy: 'Фільтрувати за',
      allColors: 'Всі кольори',
      allMaterials: 'Всі матеріали',
      priceRange: 'Діапазон цін',
      search: 'Пошук',
      searchPlaceholder: 'Пошук товарів...',
      
      // Cart
      cartEmpty: 'Ваш кошик порожній',
      quantity: 'Кількість',
      remove: 'Видалити',
      total: 'Загалом',
      checkout: 'Оформити замовлення',
      
      // Checkout
      orderForm: 'Оформлення замовлення',
      customerInfo: 'Інформація про клієнта',
      name: 'Ім\'я',
      phone: 'Телефон',
      email: 'Email',
      address: 'Адреса доставки',
      paymentMethod: 'Спосіб оплати',
      cashOnDelivery: 'Оплата при отриманні',
      cardPayment: 'Оплата карткою',
      placeOrder: 'Оформити замовлення',
      
      // Admin
      adminPanel: 'Адміністративна панель',
      login: 'Увійти',
      password: 'Пароль',
      addProduct: 'Додати товар',
      editProduct: 'Редагувати товар',
      deleteProduct: 'Видалити товар',
      orders: 'Замовлення',
      statistics: 'Статистика',
      
      // About & Contact
      aboutUs: 'Про нас',
      aboutText: 'Ми спеціалізуємося на створенні унікальних брелків за допомогою 3D-друку. Наша команда використовує найсучасніші технології та високоякісні матеріали.',
      contactUs: 'Зв\'яжіться з нами',
      
      // Common
      save: 'Зберегти',
      cancel: 'Скасувати',
      edit: 'Редагувати',
      delete: 'Видалити',
      confirm: 'Підтвердити',
      loading: 'Завантаження...',
      error: 'Помилка',
      success: 'Успішно',
    }
  };
  
  export type Language = 'uk';
  export type TranslationKey = keyof typeof translations.uk;