import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Контекст для передачи функции доступа к админке
const AdminAccessContext = createContext<{
  handleLogoPress: () => void;
} | null>(null);

export const useAdminAccess = () => {
  const context = useContext(AdminAccessContext);
  if (!context) {
    throw new Error('useAdminAccess must be used within HiddenAdminAccess');
  }
  return context;
};

interface HiddenAdminAccessProps {
  children: React.ReactNode;
}

export const HiddenAdminAccess: React.FC<HiddenAdminAccessProps> = ({ children }) => {
  const [showAccess, setShowAccess] = useState(false);
  const [logoPressCount, setLogoPressCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Проверяем комбинацию Ctrl + Shift + A
      if (event.ctrlKey && event.shiftKey && event.code === 'KeyA') {
        event.preventDefault();
        setShowAccess(true);
        setTimeout(() => setShowAccess(false), 5000); // Скрыть через 5 секунд
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  // Функция для мобильного доступа через логотип
  const handleLogoPress = () => {
    setLogoPressCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setShowAccess(true);
        setTimeout(() => setShowAccess(false), 5000);
        return 0; // Сброс счетчика
      }
      // Сброс счетчика через 3 секунды
      setTimeout(() => setLogoPressCount(0), 3000);
      return newCount;
    });
  };

  return (
    <AdminAccessContext.Provider value={{ handleLogoPress }}>
      {children}
      {showAccess && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleAdminAccess}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-sm font-medium"
          >
            🔐 Admin Access
          </button>
        </div>
      )}
    </AdminAccessContext.Provider>
  );
};
