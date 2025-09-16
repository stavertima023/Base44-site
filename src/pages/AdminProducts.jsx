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
    category_ids: [],
    images: [],
    attributes: { sizes: ['XS','S','M','L','XL'] }
  })
  const [imageUrl, setImageUrl] = useState('')
  const [editImageUrl, setEditImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [listCategory, setListCategory] = useState('all')
  const [listSort, setListSort] = useState('recent')
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
      const qs = new URLSearchParams()
      if (listCategory && listCategory !== 'all') qs.set('category', listCategory)
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/admin/products?${qs.toString()}`, { headers }),
        fetch('/admin/categories', { headers })
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
    setErrorMsg('')
    if (!formData.title.trim()) {
      setErrorMsg('Введите название товара')
      return
    }
    if (!formData.price_rub || isNaN(Number(formData.price_rub))) {
      setErrorMsg('Укажите корректную цену в рублях')
      return
    }
    if (!formData.category_id) {
      setErrorMsg('Выберите категорию')
      return
    }
    try {
      setSaving(true)
      const url = editingProduct ? `/admin/products/${editingProduct.id}` : '/admin/products'
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
      } else {
        const data = await response.json().catch(() => ({}))
        setErrorMsg(data.error || 'Не удалось сохранить товар')
      }
    } catch (e) {
      console.error('Ошибка сохранения:', e)
      setErrorMsg('Ошибка соединения с сервером')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить товар?')) return
    
    try {
      await fetch(`/admin/products/${id}`, { method: 'DELETE', headers })
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
      category_ids: [],
      images: product.images || [],
      attributes: product.attributes?.sizes ? product.attributes : { sizes: ['XS','S','M','L','XL'] }
    })
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price_rub: '',
      is_active: true,
      category_id: '',
      category_ids: [],
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

  const saveInlineEdit = async (e) => {
    e.preventDefault()
    if (!editingProduct) return
    setSaving(true)
    setErrorMsg('')
    try {
      const res = await fetch(`/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          ...formData,
          price_rub: parseFloat(formData.price_rub)
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error || 'Не удалось сохранить изменения')
      } else {
        setEditingProduct(null)
        setEditImageUrl('')
        fetchData()
      }
    } catch (e) {
      console.error('Ошибка сохранения:', e)
      setErrorMsg('Ошибка соединения с сервером')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold">Управление товарами</h1>
        <div className="flex items-center gap-2">
          <select value={listCategory} onChange={(e)=>{setListCategory(e.target.value); setLoading(true);}} className="px-3 py-2 border rounded-md">
            <option value="all">Все категории</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <button onClick={fetchData} className="px-3 py-2 border rounded-md">Применить</button>
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
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Редактировать товар' : 'Новый товар'}
          </h2>
          {errorMsg && (<div className="text-red-600 text-sm mb-2">{errorMsg}</div>)}
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
                <label className="block text-sm font-medium text-gray-700">Категория (основная)</label>
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
                <label className="block text-sm font-medium text-gray-700">Доп. категории</label>
                <div className="mt-2 grid grid-cols-2 gap-2 max-h-28 overflow-auto border rounded-md p-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(cat.id)}
                        onChange={(e)=>{
                          setFormData(prev=>{
                            const set = new Set(prev.category_ids)
                            if(e.target.checked) set.add(cat.id); else set.delete(cat.id)
                            return { ...prev, category_ids: Array.from(set) }
                          })
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
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
                    const res = await fetch('/admin/upload', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: form })
                    const data = await res.json()
                    if (res.ok && data.url) {
                      setFormData(prev => ({ ...prev, images: [...prev.images, data.url] }))
                    }
                  }} />
                </label>
              </div>
              {imageUrl && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">Предпросмотр URL</div>
                  <img src={imageUrl} alt="preview" className="h-32 w-32 object-cover rounded border" onError={(e) => (e.currentTarget.style.display='none')} />
                </div>
              )}
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
                disabled={saving}
                className="bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {saving ? 'Сохранение…' : (editingProduct ? 'Обновить' : 'Создать')}
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

              {/* Inline edit block */}
              {editingProduct && editingProduct.id === product.id && (
                <div className="mt-4 border-t pt-4">
                  {errorMsg && (<div className="text-red-600 text-sm mb-2">{errorMsg}</div>)}
                  <form onSubmit={saveInlineEdit} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Название</label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Цена (в рублях)</label>
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
                        <label className="block text-xs font-medium text-gray-700">Категория (основная)</label>
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
                        <label className="block text-xs font-medium text-gray-700">Статус</label>
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
                      <label className="block text-xs font-medium text-gray-700">Описание</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700">Изображения</label>
                      <div className="mt-2 flex gap-2">
                        <input
                          type="url"
                          value={editImageUrl}
                          onChange={(e) => setEditImageUrl(e.target.value)}
                          placeholder="URL изображения"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => { if (editImageUrl.trim()) { setFormData(prev=>({ ...prev, images:[...prev.images, editImageUrl.trim()] })); setEditImageUrl('') } }}
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
                      <button type="submit" disabled={saving} className="bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-md hover:bg-green-700">{saving ? 'Сохранение…' : 'Сохранить'}</button>
                      <button type="button" onClick={()=>{ setEditingProduct(null); setErrorMsg('') }} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Отмена</button>
                    </div>
                  </form>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
