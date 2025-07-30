import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

function Cart({ products, cart, updateCartItem }) {
  const getProduct = (id) => products.find(p => p.id === id) || {};

  const totalPrice = cart.reduce((total, item) => {
    const product = getProduct(item.productId);
    return total + (product.price || 0) * item.quantity;
  }, 0);

  if (cart.length === 0) return <p>Keranjang kosong.</p>;

  return (
    <>
      <h5>Keranjang Belanja</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Harga</th>
            <th>Jumlah</th>
            <th>Subtotal</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => {
            const product = getProduct(item.productId);
            return (
              <tr key={item.productId}>
                <td>{product.name}</td>
                <td>Rp {product.price.toLocaleString()}</td>
                <td>
                  <Form.Control
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={e =>
                      updateCartItem(item.productId, Number(e.target.value))
                    }
                  />
                </td>
                <td>Rp {(product.price * item.quantity).toLocaleString()}</td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => updateCartItem(item.productId, 0)}
                  >
                    Hapus
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <h6>Total Harga: Rp {totalPrice.toLocaleString()}</h6>
    </>
  );
}

export default Cart;
