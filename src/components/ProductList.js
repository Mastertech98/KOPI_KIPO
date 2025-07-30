import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

function ProductList({ products, addToCart }) {
  if (products.length === 0) return <p>Tidak ada produk tersedia.</p>;
  
  return (
    <Row>
      {products.map(product => (
        <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
          <Card>
            <Card.Body>
              <Card.Title>{product.name}</Card.Title>
              <Card.Text>Harga: Rp {product.price.toLocaleString()}</Card.Text>
              <Button variant="primary" onClick={() => addToCart(product.id)}>
                Tambah ke Keranjang
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProductList;
