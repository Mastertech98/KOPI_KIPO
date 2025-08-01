import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarMenu from './components/NavbarMenu';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import PembukuanPage from './pages/PembukuanPage';
import AdminOrderPage from './pages/AdminOrderPage';
import RegisterPage from './pages/RegisterPage';
import ContactUsPage from './pages/ContactUsPage';
import AdminRoute from './components/guards/AdminRoute';

function App() {
  // Products state - initially empty
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    //console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUser({ id:decoded.id, username: decoded.username, role: decoded.role });
        if (decoded.role === 'admin'){
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
  console.log('isAdmin updated:', isAdmin);
}, [isAdmin]);

  const addToCart = (product, quantity) => {
    const qty = parseInt(quantity, 10);
    console.log(user);
    if (isNaN(qty) || qty <= 0) {
      alert('Pilih jumlah produk minimal 1');
      return;
    }

    setCartItems((prev) => {
      let updatedCart;
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        updatedCart =  prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      } else {
        updatedCart =  [...prev, { ...product, quantity: qty }];
      }
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      return updatedCart;
    });
    
    // Show success message
    alert(`${product.name} berhasil ditambahkan ke keranjang!`);
  };

  // Functions for cart management
  const updateCartItem = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
    window.location.reload();
  };

  // Functions for product management (Admin)
  const addProduct = (newProduct) => {
    const productWithId = {
      ...newProduct,
      id: Date.now() // Simple ID generation
    };
    setProducts((prev) => [...prev, productWithId]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((prod) => (prod.id === updatedProduct.id ? updatedProduct : prod))
    );
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((prod) => prod.id !== productId));
  };

  // Auth functions
  const handleLogin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Cek apakah token masih valid (boleh ditambahkan cek exp token di sini)
        setIsLoggedIn(true);
        setUser({ id:decoded.id, username: decoded.username, role: decoded.role });
        console.log("cek decoded : ", decoded);
        if (decoded.role === 'admin'){
          setIsAdmin(true);
        } else {
          console.log("decoded role tidak sama dengan admin");
          setIsAdmin(false);
        }
        console.log("cek admin : ", isAdmin);
      } catch (error) {
        setIsLoggedIn(false);
        setUser(null);
        setIsAdmin(false);
      }
    }
    //console.log(isAdmin);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCartItems([]); // Clear cart on logout
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <NavbarMenu isLoggedIn={isLoggedIn} onLogout={handleLogout } isAdmin={isAdmin} />
      <Routes>
        <Route path="contactus" element={<ContactUsPage/>}></Route>
        <Route path="/" element={<HomePage products={products} onAddToCart={addToCart} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/cart" 
          element={
            <CartPage 
              cartItems={cartItems} 
              onUpdateQuantity={updateCartItem}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              user={user}
            />
          } 
        />
        <Route path="/login" element={<LoginPage onLogin={handleLogin}/>} />
        <Route
          path="/admin"
          element={
            <AdminRoute user = {user}>
              <AdminPage
                products={products}
                addProduct={addProduct}
                updateProduct={updateProduct}
                deleteProduct={deleteProduct}
                />
            </AdminRoute>
          }
        />
        <Route path="/pembukuan" element={<AdminRoute user = {user}> <PembukuanPage /></AdminRoute>} />
        <Route path="/orders" element={
          <AdminRoute user = {user}>
            <AdminOrderPage />
          </AdminRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;