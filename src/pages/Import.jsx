import React, { useState } from 'react';
import { Product } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ImportPage() {
  const [csvText, setCsvText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleImport = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');

    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setError('CSV должен содержать заголовок и хотя бы одну строку данных.');
      setIsLoading(false);
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const productsToCreate = [];
    const errors = [];
    
    // Ожидаемые заголовки
    const expectedHeaders = [
        "name", "brand", "category", "price", "original_price", "images", 
        "description", "sizes", "colors", "is_featured", "stock_quantity"
    ];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length) {
        errors.push(`Строка ${i + 1}: Неверное количество столбцов. Ожидалось ${headers.length}, получено ${values.length}.`);
        continue;
      }

      const productData = headers.reduce((obj, header, index) => {
        obj[header] = values[index].trim();
        return obj;
      }, {});

      try {
        productsToCreate.push({
          name: productData.name,
          brand: productData.brand,
          category: productData.category.toLowerCase(),
          price: parseFloat(productData.price),
          original_price: productData.original_price ? parseFloat(productData.original_price) : undefined,
          images: productData.images ? productData.images.split(';').map(url => url.trim()) : [],
          description: productData.description,
          sizes: productData.sizes ? productData.sizes.split(';').map(s => s.trim()) : [],
          colors: productData.colors ? productData.colors.split(';').map(c => c.trim()) : [],
          is_featured: productData.is_featured === 'true' || productData.is_featured === '1',
          stock_quantity: parseInt(productData.stock_quantity, 10),
        });
      } catch (e) {
        errors.push(`Строка ${i + 1}: Ошибка форматирования данных. Убедитесь, что числа и булевы значения верны. ${e.message}`);
      }
    }

    if (errors.length > 0) {
      setError(`Найдено ${errors.length} ошибок в данных. Пример: ${errors[0]}`);
      setIsLoading(false);
      return;
    }

    if (productsToCreate.length === 0) {
      setError('Не найдено товаров для импорта. Проверьте ваш CSV файл.');
      setIsLoading(false);
      return;
    }

    try {
      await Product.bulkCreate(productsToCreate);
      setSuccessMessage(`Успешно импортировано ${productsToCreate.length} товаров!`);
      setCsvText('');
    } catch (e) {
      setError(`Ошибка при загрузке данных в базу: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const exampleCsv = `name,brand,category,price,original_price,images,description,sizes,colors,is_featured,stock_quantity
"Nike Air Force 1","Nike","кроссовки",9990,11990,"url1.jpg;url2.jpg","Классические кроссовки","41;42;43","белый",true,50
"Adidas Stan Smith","Adidas","кроссовки",7990,,,"Легендарные теннисные туфли","42;43;44","белый;зеленый",false,30`;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Импорт товаров из CSV</CardTitle>
            <CardDescription>
              Вставьте сюда содержимое вашего CSV файла для массовой загрузки товаров.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Успех!</AlertTitle>
                <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="csv-input" className="font-medium">Содержимое CSV</label>
              <Textarea
                id="csv-input"
                placeholder="Вставьте сюда ваш CSV..."
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                className="h-64 font-mono text-sm"
              />
            </div>
            
            <details className="text-sm text-gray-600 p-4 bg-gray-100 rounded-lg">
                <summary className="font-medium cursor-pointer">Инструкция и формат данных</summary>
                <div className="mt-4 space-y-2">
                    <p>1. Заголовки должны быть в первой строке и разделены запятыми. Регистр не важен.</p>
                    <p>2. Обязательные поля: <strong>name, brand, category, price, stock_quantity</strong>.</p>
                    <p>3. Для полей с несколькими значениями (images, sizes, colors) используйте точку с запятой (<strong>;</strong>) в качестве разделителя.</p>
                    <p>4. Поле <strong>is_featured</strong> должно быть <strong>true</strong> или <strong>false</strong>.</p>
                    <p>5. Столбцы должны идти в следующем порядке: <strong>name,brand,category,price,original_price,images,description,sizes,colors,is_featured,stock_quantity</strong></p>
                    <h4 className="font-semibold pt-2">Пример:</h4>
                    <pre className="p-2 bg-gray-200 rounded text-xs overflow-x-auto">{exampleCsv}</pre>
                </div>
            </details>

            <div className="flex justify-end gap-4">
              <Link to={createPageUrl('Catalog')}>
                <Button variant="outline">Назад в каталог</Button>
              </Link>
              <Button onClick={handleImport} disabled={isLoading || !csvText}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Импортируем...
                  </>
                ) : (
                  'Импортировать товары'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}