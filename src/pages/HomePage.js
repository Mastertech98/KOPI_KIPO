import React, { useState, useEffect } from 'react';

function HomePage({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error loading products:', err));
  }, []);

  const handleIncrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrease = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 0) - 1, 0),
    }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id] || 0;
    if (qty > 0) {
      onAddToCart(product, qty);
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    } else {
      alert('Pilih jumlah produk minimal 1');
    }
  };

  return (
    <div className='wrapper'>
        <h2>Daftar Produk Kopi</h2>
        <div className="product-list-wrapper">
            {products.map((product) => (
                <div key={product.id} className="product-card">
                <img src={product.image_url} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">Rp {product.price.toLocaleString('id-ID')}</p>
                <div className="quantity-controls" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <button onClick={() => handleDecrease(product.id)} className="btn-quantity">-</button>
                    <span>{quantities[product.id] || 0}</span>
                    <button onClick={() => handleIncrease(product.id)} className="btn-quantity">+</button>
                </div>
                <button
                    onClick={() => handleAddToCart(product)}
                    className="btn-add-to-cart"
                    disabled={!quantities[product.id]}
                >
                    Tambah ke Keranjang
                </button>
                </div>
            ))}
        </div>
    </div>
  );
}

export default HomePage;
