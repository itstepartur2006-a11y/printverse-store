import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';
import { store } from '@/lib/store';
import { toast } from 'sonner';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Заповніть всі обов\'язкові поля');
      return;
    }

    // Simulate form submission
    toast.success('Повідомлення надіслано! Ми зв\'яжемося з вами найближчим часом.');
    
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-black" />,
      title: 'Телефон',
      content: '+380 63 479 68 80'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-4">{t('contactUs')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Маєте питання або пропозиції? Ми завжди раді допомогти! Зв'яжіться з нами будь-яким зручним способом.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>
                Надішліть нам повідомлення
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('name')} *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ваше ім'я"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t('email')} *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Тема
                  </label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="Тема повідомлення"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Повідомлення *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Ваше повідомлення..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Надіслати
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {contactInfo.map((info, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {info.title}
                    </h3>
                    <p className="text-gray-600 whitespace-pre-line">
                      {info.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>
                Слідкуйте за нами
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                {store.getSocialMedia().map((social, index) => (
                  <Button key={index} variant="outline" size="sm" asChild>
                    <a href={social.url} target="_blank" rel="noopener noreferrer">
                      {social.name}
                    </a>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}