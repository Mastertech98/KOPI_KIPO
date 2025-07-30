import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api/orders';

const AdminOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Ambil semua order
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      alert('Gagal mengambil data orders');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Ambil detail order by id
  const fetchOrderDetail = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}`);
      const data = await res.json();
      setSelectedOrder(data);
    } catch (error) {
      alert('Gagal mengambil detail order');
    }
  };

  // Update status order
  const updateOrderStatus = async (orderId, newStatus) => {
    setStatusUpdating(true);
    try {
      const res = await fetch(`${API_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert('Status order berhasil diperbarui');
        fetchOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          fetchOrderDetail(orderId); // refresh detail
        }
      } else {
        alert('Gagal memperbarui status order');
      }
    } catch (error) {
      alert('Error saat mengubah status order');
    }
    setStatusUpdating(false);
  };

  return (
    <div>
      <h2>Admin - Kelola Pesanan</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: 20 }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ cursor: 'pointer' }} onClick={() => fetchOrderDetail(order.id)}>
                <td>{order.id}</td>
                <td>{order.user_id}</td>
                <td>{order.total_price.toLocaleString()}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); fetchOrderDetail(order.id); }}>
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <div style={{ borderTop: '1px solid #ccc', paddingTop: 10 }}>
          <h3>Detail Pesanan ID: {selectedOrder.id}</h3>
          <p>User ID: {selectedOrder.user_id}</p>
          <p>Status: <b>{selectedOrder.status}</b></p>
          <p>Total Harga: Rp {selectedOrder.total_price.toLocaleString()}</p>
          <h4>Items:</h4>
          <ul>
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              selectedOrder.items.map(item => (
                <li key={item.id}>
                  {item.name} (Harga: Rp {item.price.toLocaleString()}) x {item.quantity}
                </li>
              ))
            ) : <p>Tidak ada item pada pesanan ini.</p>}
          </ul>

          <h4>Ubah Status Pesanan</h4>
          <select
            value={selectedOrder.status}
            onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
            disabled={statusUpdating}
          >
            <option value="pending">Pending</option>
            <option value="diproses">Diproses</option>
            <option value="dikirim">Dikirim</option>
            <option value="selesai">Selesai</option>
            <option value="dibatalkan">Dibatalkan</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default AdminOrderPage;
