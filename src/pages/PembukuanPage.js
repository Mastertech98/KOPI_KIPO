import React, { useEffect, useState } from 'react';
import "../styles/Pembukuan.scss"

function PembukuanPage() {
  const [transactions, setTransactions] = useState([]);

  function formatDate(dateString) {
    const date = new Date(dateString);

    // Ambil komponen tanggal
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // bulan 0-11
    const year = String(date.getFullYear()).slice(-2); // 2 digit tahun

    // Ambil jam dan menit
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Gabungkan sesuai format: DD MM YY - HH:MM
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  useEffect(() => {
    fetch('http://localhost:3001/api/orders') // Pastikan endpoint ada di backend
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => {
        console.error('Gagal load pembukuan:', err);
        // fallback data jika backend belum siap
        setTransactions([
          { id: 1, date: '2025-07-01', description: 'Penjualan Produk A', income: 100000, expense: 0 },
          { id: 2, date: '2025-07-02', description: 'Pembelian Bahan Baku', income: 0, expense: 30000 }
        ]);
      });
  }, []);

  const totalIncome = transactions.reduce((sum, t) => sum + Number(t.total_price), 0);
  const totalExpense = transactions.reduce((sum, t) => 0, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className='pembukuan'>
      <h2>Pembukuan</h2>
      <table>
        <thead>
          <tr>
            <th>Tanggal</th><th>Keterangan</th><th>Pemasukan</th><th>Pengeluaran</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id}>
              <td>{formatDate(tx.order_date)}</td>
              <td>{tx.user_id}</td>
              <td>{Number(tx.total_price)}</td>
              <td>{tx.expense}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">Total</td>
            <td>{totalIncome}</td>
            <td>{totalExpense}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default PembukuanPage;
