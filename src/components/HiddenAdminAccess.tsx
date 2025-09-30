import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HiddenAdminAccessProps {
  children: React.ReactNode;
}

export const HiddenAdminAccess: React.FC<HiddenAdminAccessProps> = ({ children }) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showAccess, setShowAccess] = useState(false);
  const navigate = useNavigate();

  // Секретная комбинация клавиш: Ctrl + Shift + A + D + M + I + N
  const secretSequence = ['Control', 'Shift', 'KeyA', 'KeyD', 'KeyM', 'KeyI', 'KeyN'];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = [...prev, event.code];
        
        // Проверяем последние 7 нажатий
        if (newSequence.length > 7) {
          newSequence.shift();
        }
        
        // Проверяем совпадение с секретной последовательностью
        if (newSequence.length === 7) {
          const isMatch = secretSequence.every((key, index) => 
            newSequence[newSequence.length - 7 + index] === key
          );
          
          if (isMatch) {
            setShowAccess(true);
            setTimeout(() => setShowAccess(false), 5000); // Скрыть через 5 секунд
          }
        }
        
        return newSequence;
      });
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
