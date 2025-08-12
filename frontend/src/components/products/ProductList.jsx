import ProductCard from './ProductCard.jsx';

export default function ProductList({ products }) {
  console.log('ProductList received products:', products);
  console.log('Products array length:', products?.length);
  console.log('First product in list:', products?.[0]);
  
  return (
    <div className="grid">
      {products?.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}


