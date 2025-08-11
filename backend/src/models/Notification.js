import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalOrder' },
    type: { type: String, enum: ['return_reminder', 'pickup_ready', 'payment_due', 'late_return'] },
    message: String,
    isRead: { type: Boolean, default: false },
    scheduledFor: Date,
    sentAt: Date
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;


