import React, { useState,useEffect } from 'react';
import { Table, Image, Button } from 'react-bootstrap';

function AdminProductTable({onEdit}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetch products:', err));
  }, []);

  useEffect(() => {
    console.log(products);
  })

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/api/products/${id}`, {
      method: 'DELETE',
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal hapus produk');
        // Update UI setelah hapus
        setProducts(products.filter(p => p.id !== id));
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-product-table-wrapper">

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nama Produk</th>
            <th>Harga (Rp)</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>
                <Image
                  src={prod.image_url}
                  alt={prod.name}
                  width={80}
                  height={80}
                  rounded
                  onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=No+Image')}
                />
              </td>
              <td>{prod.name}</td>
              <td>{prod.price.toLocaleString('id-ID')}</td>
              <td>
                <Button variant="primary" className="me-2" onClick={() => onEdit(prod)}>
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(prod.id)}>
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AdminProductTable;
