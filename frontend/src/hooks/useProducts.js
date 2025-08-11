import { useEffect, useState } from 'react';
import { productService } from '../services/productService.js';

export function useProducts(query) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    productService.list(query).then((res) => setData(res)).finally(() => setLoading(false));
  }, [JSON.stringify(query || {})]);
  return { data, loading };
}


