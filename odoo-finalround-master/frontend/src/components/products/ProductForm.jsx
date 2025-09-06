import { useState } from 'react';

export default function ProductForm({ initial = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    basePrice: initial.basePrice || 0,
    quantity: initial.quantity || 1,
    category: initial.category || 'General'
  });

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function submit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Product</h3>

      {/* Name */}
      <label>Name</label>
      <input name="name" value={form.name} onChange={change} required />

      {/* Description */}
      <label>Description</label>
      <textarea name="description" value={form.description} onChange={change} />

      {/* Price */}
      <label>Price (₹)</label>
      <input
        type="number"
        name="basePrice"
        value={form.basePrice}
        onChange={change}
        min="0"
        required
      />

      {/* Quantity */}
      <label>Quantity</label>
      <input
        type="number"
        name="quantity"
        value={form.quantity}
        onChange={change}
        min="1"
        required
      />

      {/* Category */}
      <label>Category</label>
      <input
        name="category"
        value={form.category}
        onChange={change}
        placeholder="e.g. Electronics, Clothing"
      />

      <button className="btn" type="submit">Save</button>
    </form>
  );
}
