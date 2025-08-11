import dayjs from 'dayjs';

export function calculateDuration(startDate, endDate, unit = 'day') {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffHours = end.diff(start, 'hour');
  switch (unit) {
    case 'hour':
      return Math.max(1, diffHours);
    case 'day':
      return Math.max(1, Math.ceil(diffHours / 24));
    case 'week':
      return Math.max(1, Math.ceil(diffHours / (24 * 7)));
    case 'month':
      return Math.max(1, Math.ceil(diffHours / (24 * 30)));
    default:
      return Math.max(1, Math.ceil(diffHours / 24));
  }
}

export function applyDiscount(price, discountType, discountValue) {
  if (!discountValue) return price;
  if (discountType === 'percentage') return Math.max(0, price - price * (discountValue / 100));
  return Math.max(0, price - discountValue);
}

export function calculateItemPrice({ basePrice, unit, startDate, endDate, rule }) {
  const duration = calculateDuration(startDate, endDate, unit);
  const base = basePrice * duration;
  if (!rule) return { duration, pricePerUnit: basePrice, totalPrice: base };
  const discounted = applyDiscount(rule.price * duration, rule.discountType, rule.discountValue);
  return { duration, pricePerUnit: rule.price, totalPrice: discounted };
}

export function calculateOrderTotals(items) {
  const totalAmount = items.reduce((sum, it) => sum + (it.totalPrice || 0), 0);
  const deposit = Math.round(totalAmount * 0.2); // 20% deposit as example
  return { totalAmount, deposit };
}

export function calculateLateFees({ expectedReturn, actualReturn, dailyLateFee = 100 }) {
  const daysLate = Math.max(0, dayjs(actualReturn).diff(dayjs(expectedReturn), 'day'));
  return daysLate * dailyLateFee;
}


