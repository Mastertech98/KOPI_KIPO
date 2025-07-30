import React, { useEffect, useState } from 'react';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';

function OrderPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Gagal load produk:', err));
  }, []);

  const addToCart = (product) => {
    setCart(prevCart => {
      const exist = prevCart.find(item => item.id === product.id);
      if (exist) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const updateCartItem = (productId, qty) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, qty } : item
      )
    );
  };

  return (
    <div>
      <h2>Order Page</h2>
      <ProductList products={products} addToCart={addToCart} />
      <Cart cart={cart} updateCartItem={updateCartItem} />
    </div>
  );
}

export default OrderPage;
