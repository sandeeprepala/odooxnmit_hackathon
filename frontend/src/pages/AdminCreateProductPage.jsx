import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { productService } from '../services/productService.js';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';

export default function AdminCreateProductPage() {
  const { token } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', description: '', category: '', basePrice: 0, rentalUnit: 'day', quantity: 1, isRentable: true
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      await productService.create(form, files, token);
      notify('success', 'Product created');
      navigate('/products');
    } catch (e2) {
      notify('error', e2?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h3 className="section-title">Create Product</h3>
      <label>Name</label>
      <input name="name" value={form.name} onChange={change} required />
      <label>Description</label>
      <textarea name="description" value={form.description} onChange={change} />
      <label>Category</label>
      <input name="category" value={form.category} onChange={change} />
      <div className="two-col">
        <div>
          <label>Base Price</label>
          <input type="number" name="basePrice" value={form.basePrice} onChange={change} />
        </div>
        <div>
          <label>Rental Unit</label>
          <select name="rentalUnit" value={form.rentalUnit} onChange={change}>
            <option value="hour">Hour</option>
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>
      <div className="two-col">
        <div>
          <label>Quantity</label>
          <input type="number" name="quantity" value={form.quantity} onChange={change} />
        </div>
        <div>
          <label>
            <input type="checkbox" name="isRentable" checked={form.isRentable} onChange={change} /> Rentable
          </label>
        </div>
      </div>
      <label>Images</label>
      <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
      <button className="btn" type="submit" disabled={loading}>Create</button>
    </form>
  );
}


