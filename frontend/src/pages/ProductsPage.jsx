import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { productService } from '../services/productService.js';
import ProductList from '../components/products/ProductList.jsx';

export default function ProductsPage() {
  const { token, user } = useAuth();
  const [products, setProducts] = useState([]);
  
  useEffect(() => { 
    console.log('ProductsPage useEffect triggered:', { token: !!token, userRole: user?.role });
    productService.list({ includeUnavailable: 'false' }, token, user?.role)
      .then(setProducts)
      .catch(error => {
        console.error('Error loading products:', error);
        setProducts({ items: [], total: 0 });
      }); 
  }, [token, user?.role]);
  
  return (
    <div>
      <h2 className="section-title">Products</h2>
      {user?.role === 'admin' && (
        <div className="admin-controls">
          <p>Admin view: Showing all products including unavailable ones</p>
        </div>
      )}
      <ProductList products={products.items} />
    </div>
  );
}


