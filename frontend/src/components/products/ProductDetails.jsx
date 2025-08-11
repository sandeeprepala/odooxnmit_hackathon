export default function ProductDetails({ product }) {
  if (!product) return null;
  return (
    <div className="card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <div>Category: {product.category}</div>
      <div>Price: ₹{product.basePrice}/{product.rentalUnit}</div>
    </div>
  );
}


