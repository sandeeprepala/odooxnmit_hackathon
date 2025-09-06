import { useState } from 'react';

export default function RentalForm({ onSubmit }) {
  const [item, setItem] = useState({ productId: '', quantity: 1, startDate: '', endDate: '' });
  function change(e) { setItem((f) => ({ ...f, [e.target.name]: e.target.value })); }
  function submit(e) { e.preventDefault(); onSubmit?.(item); }
  return (
    <form onSubmit={submit} className="card">
      <h3>Create Rental</h3>
      <label>Product ID</label>
      <input name="productId" value={item.productId} onChange={change} />
      <label>Quantity</label>
      <input type="number" name="quantity" value={item.quantity} onChange={change} />
      <label>Start</label>
      <input type="datetime-local" name="startDate" value={item.startDate} onChange={change} />
      <label>End</label>
      <input type="datetime-local" name="endDate" value={item.endDate} onChange={change} />
      <button className="btn" type="submit">Create</button>
    </form>
  );
}


