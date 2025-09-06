import dayjs from 'dayjs';

// Simple overlap & capacity checker for MVP
export function areRangesOverlapping(aStart, aEnd, bStart, bEnd) {
  return dayjs(aStart).isBefore(dayjs(bEnd)) && dayjs(bStart).isBefore(dayjs(aEnd));
}

export function getAvailableQuantity({ product, rentals, startDate, endDate }) {
  let booked = 0;
  for (const order of rentals) {
    // Only consider confirmed and picked up orders for availability calculation
    if (!['confirmed', 'picked_up'].includes(order.status)) {
      continue;
    }
    
    for (const item of order.items) {
      if (String(item.productId) !== String(product._id)) continue;
      if (areRangesOverlapping(item.startDate, item.endDate, startDate, endDate)) {
        booked += item.quantity;
      }
    }
  }
  return Math.max(0, product.quantity - booked);
}


