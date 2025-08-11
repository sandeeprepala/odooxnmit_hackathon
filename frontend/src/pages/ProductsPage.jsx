import { useEffect, useState } from 'react';
import { productService } from '../services/productService.js';
import ProductList from '../components/products/ProductList.jsx';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => { productService.list().then(setProducts); }, []);
  return (
    <div>
      <h2 className="section-title">Products</h2>
      <ProductList products={products.items} />
    </div>
  );
}


