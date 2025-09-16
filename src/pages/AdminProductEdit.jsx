import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminProductEdit() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const productId = params.get('id')

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
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

  const token = localStorage.getItem('adminToken')
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }

  useEffect(() => {
    if (!token) { navigate('/admin/login'); return }
    load()
  }, [productId])

  const load = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch(`/admin/products/${productId}`, { headers }),
        fetch('/admin/categories', { headers })
      ])
      const p = await pRes.json()
      const cats = await cRes.json()
      setCategories(cats)
      setFormData({
        title: p.title,
        description: p.description || '',
        price_rub: p.price_cents ? (p.price_cents / 100).toFixed(2) : '',
        is_active: p.is_active,
        category_id: p.category_id || '',
        category_ids: Array.isArray(p.category_ids) ? p.category_ids : [],
        images: p.images || [],
        attributes: p.attributes?.sizes ? p.attributes : { sizes: ['XS','S','M','L','XL'] }
      })
    } catch (e) {
      console.error(e)
      setErrorMsg('Не удалось загрузить товар')
    } finally {
      setLoading(false)
    }
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')
    try {
      const res = await fetch(`/admin/products/${productId}`, {
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
        navigate('/admin/products')
      }
    } catch (e) {
      console.error(e)
      setErrorMsg('Ошибка соединения с сервером')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6">Загрузка…</div>

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin/products')} className="px-3 py-2 border rounded-md">← Назад</button>
        <h1 className="text-2xl font-bold">Редактирование товара</h1>
        <div />
      </div>

      {errorMsg && (<div className="text-red-600 text-sm mb-2">{errorMsg}</div>)}

      <form onSubmit={save} className="space-y-4">
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
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
            {formData.images.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Product ${index + 1}`} className="w-full h-24 object-cover rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="bg-green-600 disabled:opacity-50 text-white px-4 py-2 rounded-md hover:bg-green-700">{saving ? 'Сохранение…' : 'Сохранить'}</button>
          <button type="button" onClick={()=>navigate('/admin/products')} className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Назад</button>
        </div>
      </form>
    </div>
  )
}
