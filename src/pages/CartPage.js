import React, {useEffect, useState} from 'react';

function CartPage({onClearCart, user}) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // load cart from localStorage or backend if implemented
    const savedCart = localStorage.getItem('cart');
    console.log("user cart page : " + user);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? {...item, qty} : item));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    if (quantity >= 0) {
      updateQuantity(productId, quantity);
    }
  };

  const handleCheckout = async() => {
    if (cartItems.length === 0) {
      alert('Keranjang kosong!');
      return;
    }

    console.log("user : " , user);

    try {
    // Buat payload sesuai kebutuhan backend
      const orderData = {
        user_id: user.id, // pastikan user sudah login dan user.id tersedia
        status: "pending", // default status
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity || item.qty, // sesuaikan properti jumlah item Anda
        })),
      };

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order berhasil dibuat dengan ID ${result.orderId}`);
        setCartItems([]); // reset keranjang setelah checkout
        localStorage.removeItem('cart'); // bersihkan localStorage juga jika perlu
      } else {
        const errorData = await response.json();
        alert(`Gagal checkout: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saat checkout:', error);
      alert('Terjadi kesalahan saat checkout.');
    }
    // alert(`Terima kasih! Total pembayaran: Rp ${totalPrice.toLocaleString('id-ID')}`);
    // onClearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-container">
        <h2>Keranjang Belanja</h2>
        <div className="alert alert-info">
          <p>Keranjang Anda kosong.</p>
          <a href="/" className="btn btn-primary">Mulai Belanja</a>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Keranjang Belanja</h2>
      <div className="row">
        <div className="col-md-8">
          {cartItems.map((item) => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0">
                <div className="col-md-3">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="img-fluid rounded"
                    style={{ height: '150px', objectFit: 'cover',margin : '10px' }}
                  />
                </div>
                <div className="col-md-9">
                  <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Harga: Rp {item.price.toLocaleString('id-ID')}</p>
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <label htmlFor={`quantity-${item.id}`} className="form-label">Jumlah:</label>
                        <div className="input-group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            id={`quantity-${item.id}`}
                            className="form-control text-center"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            min="0"
                          />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <strong>Subtotal: Rp {(item.price * item.quantity).toLocaleString('id-ID')}</strong>
                      </div>
                      <div className="col-md-4">
                        <button
                          className="btn btn-danger"
                          onClick={() => removeItem(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Ringkasan Pesanan</h5>
              <div className="mb-3">
                <p>Total Item: {cartItems.reduce((total, item) => total + item.quantity, 0)}</p>
                <hr />
                <h4>Total: Rp {totalPrice.toLocaleString('id-ID')}</h4>
              </div>
              <div className="d-grid gap-2">
                <button className="btn btn-success btn-lg" onClick={handleCheckout}>Checkout</button>
                <button
                  className="btn btn-outline-danger"
                  onClick={onClearCart}
                >
                  Bersihkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
