import Razorpay from 'razorpay';
import { env } from './env.js';

let client;

export function getRazorpayClient() {
  if (client) return client;
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    // eslint-disable-next-line no-console
    console.warn('Razorpay keys not set. Payment features will be limited.');
    return null;
  }
  client = new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET
  });
  return client;
}


