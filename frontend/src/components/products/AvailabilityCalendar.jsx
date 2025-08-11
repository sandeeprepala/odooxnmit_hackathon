import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { productService } from '../../services/productService.js';

export default function AvailabilityCalendar({ productId }) {
  const [start, setStart] = useState(dayjs().format('YYYY-MM-DDTHH:00'));
  const [end, setEnd] = useState(dayjs().add(1, 'day').format('YYYY-MM-DDTHH:00'));
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    if (!productId) return;
    productService.availability(productId, { startDate: start, endDate: end }).then((res) => setAvailable(res.available));
  }, [productId, start, end]);

  return (
    <div className="card">
      <h3>Availability</h3>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div>
          <label>Start</label>
          <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label>End</label>
          <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <div>Available: {available ?? '-'}</div>
        </div>
      </div>
    </div>
  );
}


