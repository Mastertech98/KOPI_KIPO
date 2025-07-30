import React, { useState, useEffect } from 'react';
import AdminProductForm from '../components/AdminProductForm';
import AdminProductTable from '../components/AdminProductTable';

function AdminPage({ products, addProduct, updateProduct, deleteProduct }) {
  const [editingProduct, setEditingProduct] = useState(null);

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  const handleSaveProduct = (product) => {
    if (editingProduct) {
      updateProduct(product);
    } else {
      addProduct(product);
    }
    setEditingProduct(null);
  };

  return (
    <div className="container mt-4">
      <h2>Kelola Produk Kopi</h2>
      <AdminProductForm
        key={editingProduct ? editingProduct.id : 'new'}
        initialProduct={editingProduct}
        onSave={handleSaveProduct}
        onCancel={handleCancelEdit}
      />
      <AdminProductTable products={products} onEdit={handleEdit} onDelete={deleteProduct} />
    </div>
  );
}

export default AdminPage;
