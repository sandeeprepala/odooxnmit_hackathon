export default function StatusBadge({ status }) {
  const map = {
    quotation: 'blue',
    confirmed: 'yellow',
    picked_up: 'green',
    returned: 'green',
    cancelled: 'red'
  };
  const color = map[status] || 'blue';
  const label = (status || '').replace(/_/g, ' ');
  return <span className={`badge ${color}`}>{label}</span>;
}


