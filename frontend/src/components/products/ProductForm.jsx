import { useState } from 'react';

export default function ProductForm({ initial = {}, onSubmit }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    category: initial.category || '',
    basePrice: initial.basePrice || 0,
    rentalUnit: initial.rentalUnit || 'day',
    quantity: initial.quantity || 1
  });

  function change(e) { setForm((f) => ({ ...f, [e.target.name]: e.target.value })); }

  function submit(e) {
    e.preventDefault();
    onSubmit?.(form);
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Product</h3>
      <label>Name</label>
      <input name="name" value={form.name} onChange={change} required />
      <label>Description</label>
      <textarea name="description" value={form.description} onChange={change} />
      <label>Category</label>
      <input name="category" value={form.category} onChange={change} />
      <label>Base Price</label>
      <input type="number" name="basePrice" value={form.basePrice} onChange={change} />
      <label>Rental Unit</label>
      <select name="rentalUnit" value={form.rentalUnit} onChange={change}>
        <option value="hour">Hour</option>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      <label>Quantity</label>
      <input type="number" name="quantity" value={form.quantity} onChange={change} />
      <button className="btn" type="submit">Save</button>
    </form>
  );
}


