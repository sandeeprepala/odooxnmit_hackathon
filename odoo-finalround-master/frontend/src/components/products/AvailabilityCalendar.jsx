import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { productService } from '../../services/productService.js';

export default function AvailabilityCalendar({ productId }) {
  const [start, setStart] = useState(dayjs().format('YYYY-MM-DDTHH:00'));
  const [end, setEnd] = useState(dayjs().add(1, 'day').format('YYYY-MM-DDTHH:00'));
  const [available, setAvailable] = useState(null);
  const [nextAvailableTime, setNextAvailableTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    
    // Get next available time
    productService.getNextAvailableTime(productId)
      .then(data => {
        setNextAvailableTime(data.nextAvailableTime);
        // Update start time if it's before next available time
        const nextTime = new Date(data.nextAvailableTime);
        if (new Date(start) < nextTime) {
          const localDateTime = new Date(nextTime.getTime() - nextTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setStart(localDateTime);
        }
      })
      .catch(error => {
        console.error('Error fetching next available time:', error);
      });

    // Get available time slots
    setLoading(true);
    productService.getAvailableTimeSlots(productId)
      .then(data => {
        setAvailableSlots(data.availableSlots);
      })
      .catch(error => {
        console.error('Error fetching available time slots:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    productService.availability(productId, { startDate: start, endDate: end }).then((res) => setAvailable(res.available));
  }, [productId, start, end]);

  const formatDateTime = (dateString) => {
    if (!dateString) return 'No end time';
    return dayjs(dateString).format('MMM DD, YYYY HH:mm');
  };

  const formatDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const duration = end.diff(start, 'hour', true);
    
    if (duration < 24) {
      return `${duration.toFixed(1)} hours`;
    } else {
      const days = duration / 24;
      return `${days.toFixed(1)} days`;
    }
  };

  return (
    <div className="card">
      <h3>Availability</h3>
      {nextAvailableTime && (
        <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f8f9fa', borderRadius: '4px', fontSize: '0.9em' }}>
          <strong>Next Available:</strong> {new Date(nextAvailableTime).toLocaleString()}
        </div>
      )}
      
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <div>
          <label>Start</label>
          <input 
            type="datetime-local" 
            value={start} 
            onChange={(e) => setStart(e.target.value)}
            min={nextAvailableTime ? new Date(nextAvailableTime).toISOString().slice(0, 16) : undefined}
          />
        </div>
        <div>
          <label>End</label>
          <input 
            type="datetime-local" 
            value={end} 
            onChange={(e) => setEnd(e.target.value)}
            min={start}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'end' }}>
          <div>Available: {available ?? '-'}</div>
        </div>
      </div>

      {/* Available Time Slots */}
      <div style={{ marginTop: '1rem' }}>
        <h4>Available Time Slots</h4>
        {loading ? (
          <div>Loading available slots...</div>
        ) : availableSlots.length > 0 ? (
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {availableSlots.map((slot, index) => (
              <div 
                key={index} 
                style={{ 
                  padding: '0.5rem', 
                  margin: '0.25rem 0', 
                  backgroundColor: '#e8f5e8', 
                  borderRadius: '4px',
                  border: '1px solid #c3e6c3',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (slot.startDate) {
                    const startDateTime = new Date(slot.startDate);
                    const localStart = new Date(startDateTime.getTime() - startDateTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setStart(localStart);
                  }
                  if (slot.endDate) {
                    const endDateTime = new Date(slot.endDate);
                    const localEnd = new Date(endDateTime.getTime() - endDateTime.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    setEnd(localEnd);
                  }
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                  {formatDateTime(slot.startDate)} - {formatDateTime(slot.endDate)}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                  Duration: {formatDuration(slot.startDate, slot.endDate)}
                </div>
                <div style={{ fontSize: '0.8em', color: '#666', fontStyle: 'italic' }}>
                  Click to select this time slot
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '4px', border: '1px solid #ffeaa7' }}>
            No available time slots found
          </div>
        )}
      </div>
    </div>
  );
}


