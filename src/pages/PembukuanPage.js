import React, { useEffect, useState } from 'react';

function PembukuanPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/transactions') // Pastikan endpoint ada di backend
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

  const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0);
  const totalExpense = transactions.reduce((sum, t) => sum + t.expense, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div>
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
              <td>{tx.date}</td>
              <td>{tx.description}</td>
              <td>{tx.income}</td>
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
          <tr>
            <td colSpan="2">Saldo</td>
            <td colSpan="2">{balance}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default PembukuanPage;
