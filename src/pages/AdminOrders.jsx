import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
    fetchOrders()
  }, [token, navigate])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch('/orders', { headers })
      const data = await res.json()
      setOrders(data)
    } catch (e) {
      setError('Ошибка загрузки заказов')
    } finally {
      setLoading(false)
    }
  }


  const updateStatus = async (id, status) => {
    await fetch(`/orders/${id}`, { method: 'PATCH', headers, body: JSON.stringify({ status }) })
    fetchOrders()
  }

  const removeOrder = async (id) => {
    await fetch(`/orders/${id}`, { method: 'DELETE', headers })
    fetchOrders()
  }

  if (loading) return <div className="p-6">Загрузка…</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Админка — заказы</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">E-mail</th>
            <th className="p-2 border">Статус</th>
            <th className="p-2 border">Сумма</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="p-2 border text-xs">{o.id}</td>
              <td className="p-2 border">{o.customer_email || '-'}</td>
              <td className="p-2 border">{o.status}</td>
              <td className="p-2 border">{(o.total_cents ?? 0) / 100} {o.currency}</td>
              <td className="p-2 border space-x-2">
                <button className="px-2 py-1 bg-gray-200" onClick={() => updateStatus(o.id, 'paid')}>Оплачен</button>
                <button className="px-2 py-1 bg-gray-200" onClick={() => updateStatus(o.id, 'shipped')}>Отправлен</button>
                <button className="px-2 py-1 bg-red-200" onClick={() => removeOrder(o.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}




