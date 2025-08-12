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
      .then((response) => {
        console.log('Products API response:', response);
        console.log('Products with images:', response.items?.filter(p => p.images && p.images.length > 0));
        console.log('Sample product data:', response.items?.[0]);
        setProducts(response);
      })
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
      
      <div style={{ marginBottom: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '5px' }}>
        <h4>Debug Info:</h4>
        <p>Total products: {products.total || 0}</p>
        <p>Products with images: {products.items?.filter(p => p.images && p.images.length > 0).length || 0}</p>
        <p>First product images: {JSON.stringify(products.items?.[0]?.images)}</p>
      </div>
      
      <ProductList products={products.items} />
    </div>
  );
}


