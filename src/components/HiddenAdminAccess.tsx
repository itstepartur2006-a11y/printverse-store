import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HiddenAdminAccessProps {
  children: React.ReactNode;
}

export const HiddenAdminAccess: React.FC<HiddenAdminAccessProps> = ({ children }) => {
  const [showAccess, setShowAccess] = useState(false);
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

  return (
    <>
      {children}
      {showAccess && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleAdminAccess}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors text-sm font-medium"
          >
            🔐 Admin Access
          </button>
        </div>
      )}
    </>
  );
};
