import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { productService } from '../services/productService.js';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext.jsx';
import AvailabilityCalendar from '../components/products/AvailabilityCalendar.jsx';

export default function AdminCreateProductPage() {
  const { token } = useAuth();
  const { notify } = useNotifications();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    basePrice: 0,
    quantity: 1,
    isRentable: true,
    beginRentTime: '',
    endRentTime: '',
    category: 'general' // <-- added category
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdProductId, setCreatedProductId] = useState(null);

  const categoryOptions = [
    { value: 'general', label: 'General' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'appliances', label: 'Appliances' },
    // add more categories as needed
  ];

  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const created = await productService.create(form, files, token);
      setCreatedProductId(created?._id);
      notify('success', 'Product created');
    } catch (e2) {
      notify('error', e2?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className="card" onSubmit={submit}>
        <h3 className="section-title">Create Product</h3>

        <label>Name</label>
        <input name="name" value={form.name} onChange={change} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={change} />

        <div className="two-col">
          <div>
            <label>Base Price</label>
            <input type="number" name="basePrice" value={form.basePrice} onChange={change} />
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

        <div className="two-col">
          <div>
            <label>Begin Rent Time</label>
            <input type="datetime-local" name="beginRentTime" value={form.beginRentTime} onChange={change} />
          </div>
          <div>
            <label>End Rent Time</label>
            <input type="datetime-local" name="endRentTime" value={form.endRentTime} onChange={change} />
          </div>
        </div>

        {/* Category Select */}
        <label>Category</label>
        <select name="category" value={form.category} onChange={change}>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <label>Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files || []))} />

        <button className="btn" type="submit" disabled={loading}>Create</button>
      </form>

      {createdProductId && navigate('/products')}
    </div>
  );
}
