import { useState } from 'react';

export default function PaymentForm({ onPay }) {
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState('razorpay');
  function submit(e) { e.preventDefault(); onPay?.({ amount: Number(amount), method }); }
  return (
    <form className="card" onSubmit={submit}>
      <h3>Payment</h3>
      <label>Amount</label>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <label>Method</label>
      <select value={method} onChange={(e) => setMethod(e.target.value)}>
        <option value="razorpay">Razorpay</option>
        <option value="cash">Cash</option>
      </select>
      <button className="btn" type="submit">Pay</button>
    </form>
  );
}


