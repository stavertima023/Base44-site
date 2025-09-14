import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminSimple() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([
    { id: '1', name: 'Футболки', slug: 't-shirts' },
    { id: '2', name: 'Худи', slug: 'hoodies' },
    { id: '3', name: 'New Arrivals', slug: 'new-arrivals' }
  ])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    sku: '',
    title: '',
    description: '',
    price_cents: '',
    stock: '',
    category_id: '',
    images: []
  })
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()

  const addProduct = () => {
    if (formData.sku && formData.title && formData.price_cents) {
      const newProduct = {
        id: Date.now().toString(),
        ...formData,
        price_cents: parseInt(formData.price_cents),
        stock: parseInt(formData.stock),
        created_at: new Date().toISOString()
      }
      setProducts([newProduct, ...products])
      setFormData({
        sku: '',
        title: '',
        description: '',
        price_cents: '',
        stock: '',
        category_id: '',
        images: []
      })
      setShowForm(false)
    }
  }

  const deleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const addImage = () => {
    if (imageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()]
      }))
      setImageUrl('')
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Админ-панель (Простая версия)</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">admin@base44.com</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Простая версия админ-панели
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>Эта версия работает без базы данных. Товары сохраняются только в памяти браузера.</p>
                    <p>Для полной функциональности нужно исправить подключение к базе данных.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Управление товарами</h2>
            <button
              onClick={() => setShowForm(true)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Добавить товар
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-semibold mb-4">Новый товар</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Название</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Цена (в центах)</label>
                    <input
                      type="number"
                      required
                      value={formData.price_cents}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_cents: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Остаток</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Категория</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Выберите категорию</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Изображения</label>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL изображения"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Добавить
                    </button>
                  </div>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                    {formData.images.map((url, index) => (
                      <div key={index} className="relative">
                        <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={addProduct}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Создать товар
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {products.map((product) => (
                <li key={product.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.title}</div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                        <div className="text-sm text-gray-500">
                          {(product.price_cents / 100).toFixed(2)} USD | 
                          Остаток: {product.stock}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Удалить
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Товары не найдены. Добавьте первый товар.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
