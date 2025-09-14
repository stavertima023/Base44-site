import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_rub: '',
    is_active: true,
    category_id: '',
    images: [],
    attributes: { sizes: ['XS','S','M','L','XL'] }
  })
  const [imageUrl, setImageUrl] = useState('')
  const navigate = useNavigate()

  const token = localStorage.getItem('adminToken')
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    fetchData()
  }, [token, navigate])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/categories', { headers })
      ])
      
      const productsData = await productsRes.json()
      const categoriesData = await categoriesRes.json()
      
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (e) {
      console.error('Ошибка загрузки данных:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
      const method = editingProduct ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          price_rub: parseFloat(formData.price_rub)
        })
      })

      if (response.ok) {
        setShowForm(false)
        setEditingProduct(null)
        resetForm()
        fetchData()
      }
    } catch (e) {
      console.error('Ошибка сохранения:', e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return
    
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers })
      fetchData()
    } catch (e) {
      console.error('Ошибка удаления:', e)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description || '',
      price_rub: product.price_cents ? (product.price_cents / 100).toFixed(2) : '',
      is_active: product.is_active,
      category_id: product.category_id || '',
      images: product.images || [],
      attributes: product.attributes?.sizes ? product.attributes : { sizes: ['XS','S','M','L','XL'] }
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price_rub: '',
      is_active: true,
      category_id: '',
      images: [],
      attributes: { sizes: ['XS','S','M','L','XL'] }
    })
    setImageUrl('')
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

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingProduct(null)
            resetForm()
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Добавить товар
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
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
                <label className="block text-sm font-medium text-gray-700">Цена (в рублях)</label>
                <input
                  type="number"
                  required
                  value={formData.price_rub}
                  step="0.01"
                  onChange={(e) => setFormData(prev => ({ ...prev, price_rub: e.target.value }))}
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
              <div>
                <label className="block text-sm font-medium text-gray-700">Статус</label>
                <select
                  value={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value={true}>Активен</option>
                  <option value={false}>Неактивен</option>
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
                <label className="bg-gray-100 border px-4 py-2 rounded-md cursor-pointer hover:bg-gray-200">
                  Загрузить файл
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const form = new FormData()
                    form.append('file', file)
                    const res = await fetch('/api/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: form })
                    const data = await res.json()
                    if (res.ok && data.url) {
                      setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
                    }
                  }} />
                </label>
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
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingProduct ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingProduct(null)
                  resetForm()
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Отмена
              </button>
            </div>
          </form>
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
                      {(product.price_cents / 100).toFixed(2)} {product.currency} | 
                      Остаток: {product.stock} | 
                      Категория: {product.category_name || 'Без категории'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
