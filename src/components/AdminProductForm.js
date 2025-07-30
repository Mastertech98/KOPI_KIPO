import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';

const DEFAULT_IMAGE_URL = 'https://via.placeholder.com/150?text=No+Image';

function AdminProductForm({ initialProduct, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setPrice(initialProduct.price);
      setImageUrl(initialProduct.imageUrl);
    } else {
      setName('');
      setPrice('');
      setImageUrl('');
    }
  }, [initialProduct]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = { name, price: parseFloat(price), image_url: imageUrl };

    if (initialProduct && initialProduct.id) {
      // update
      fetch(`http://localhost:3001/api/products/${initialProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
        .then(res => {
          if (!res.ok) throw new Error('Gagal update produk');
          return res.json();
        })
        .then(data => onSave(data))
        .catch(err => alert(err.message));
    } else {
      // tambah baru
      fetch('http://localhost:3001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
        .then(res => {
          if (!res.ok) throw new Error('Gagal tambah produk');
          return res.json();
        })
        .then(data => onSave(data))
        .catch(err => alert(err.message));
    }
  };

  return (
    <div className="custom-form-wrapper">

      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="productName" className="mb-3">
          <Form.Label>Nama Produk</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan nama produk"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="productPrice" className="mb-3">
          <Form.Label>Harga (Rp)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan harga"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="productImage" className="mb-3">
          <Form.Label>URL Foto Produk (opsional)</Form.Label>
          <Form.Control
            type="text"
            placeholder="Masukkan URL foto produk"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Form.Text className="text-muted">Jika tidak diisi, akan menggunakan foto default.</Form.Text>
        </Form.Group>
        <Button variant="success" type="submit" className="me-2">
          {initialProduct ? 'Update Produk' : 'Tambah Produk'}
        </Button>
        {initialProduct && (
          <Button variant="secondary" type="button" onClick={onCancel}>
            Batal
          </Button>
        )}
      </Form>
    </div>
  );
}

export default AdminProductForm;
