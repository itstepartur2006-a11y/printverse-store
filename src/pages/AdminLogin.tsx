import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Update admin credentials on component mount
  React.useEffect(() => {
    store.updateAdminCredentials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (store.validateAdmin(credentials.username, credentials.password)) {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminSession', 'verified');
        toast.success(language === 'uk' ? 'Успішний вхід!' : 'Login successful!');
        navigate('/admin/dashboard');
      } else {
        toast.error(language === 'uk' ? 'Невірні дані для входу' : 'Invalid credentials');
      }
    } catch (error) {
      toast.error(language === 'uk' ? 'Помилка входу' : 'Login error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">{t('adminPanel')}</CardTitle>
          <p className="text-gray-600">
            {language === 'uk' ? 'Увійдіть для доступу до панелі адміністратора' : 'Sign in to access admin panel'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {language === 'uk' ? 'Ім\'я користувача' : 'Username'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  placeholder="admin"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('loading')}
                </>
              ) : (
                t('login')
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium mb-2">
              {language === 'uk' ? 'Проблеми з входом?' : 'Having trouble logging in?'}
            </p>
            <p className="text-sm text-yellow-700 mb-2">
              {language === 'uk' ? 'Спробуйте очистити дані браузера:' : 'Try clearing browser data:'}
            </p>
            <button
              type="button"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-sm text-yellow-800 underline hover:text-yellow-900"
            >
              {language === 'uk' ? 'Очистити та перезавантажити' : 'Clear and reload'}
            </button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}