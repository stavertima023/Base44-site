import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (!token || !userData) {
      navigate('/admin/login')
      return
    }

    setUser(JSON.parse(userData))
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  if (loading) {
    return <div className="p-6">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Админ-панель</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Добро пожаловать, {user?.email}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📦</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Товары
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Управление каталогом
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/admin/products')}
                    className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                  >
                    Перейти к товарам →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">🏷️</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Категории
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Разделы товаров
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/admin/categories')}
                    className="text-green-600 hover:text-green-500 text-sm font-medium"
                  >
                    Перейти к категориям →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm font-medium">📋</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Заказы
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Управление заказами
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate('/admin/orders')}
                    className="text-purple-600 hover:text-purple-500 text-sm font-medium"
                  >
                    Перейти к заказам →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
