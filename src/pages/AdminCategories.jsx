import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({
    slug: '',
    name: ''
  })
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
    fetchCategories()
  }, [token, navigate])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/admin/categories', { headers })
      const data = await res.json()
      setCategories(data)
    } catch (e) {
      console.error('Ошибка загрузки категорий:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = editingCategory ? `/admin/categories/${editingCategory.id}` : '/admin/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingCategory(null)
        setFormData({ slug: '', name: '' })
        fetchCategories()
      }
    } catch (e) {
      console.error('Ошибка сохранения:', e)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Удалить категорию? Все товары в этой категории станут без категории.')) return
    
    try {
      await fetch(`/admin/categories/${id}`, { method: 'DELETE', headers })
      fetchCategories()
    } catch (e) {
      console.error('Ошибка удаления:', e)
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      slug: category.slug,
      name: category.name
    })
    setShowForm(true)
  }

  if (loading) return <div className="p-6">Загрузка...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление категориями</h1>
        <button
          onClick={() => {
            setShowForm(true)
            setEditingCategory(null)
            setFormData({ slug: '', name: '' })
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Добавить категорию
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="new-arrivals"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="text-xs text-gray-500 mt-1">Используется в URL, только латинские буквы и дефисы</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="New Arrivals"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingCategory ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCategory(null)
                  setFormData({ slug: '', name: '' })
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
          {categories.map((category) => (
            <li key={category.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                  <div className="text-sm text-gray-500">Slug: {category.slug}</div>
                  <div className="text-sm text-gray-500">
                    Создано: {new Date(category.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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

      {categories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Категории не найдены. Создайте первую категорию.
        </div>
      )}
    </div>
  )
}
