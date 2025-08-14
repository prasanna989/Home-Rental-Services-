export interface Booking {
  _id: string;
  propertyId: string;
  userId: string;
  checkInDate: Date;
  checkOutDate: Date;
  totalPrice: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: Date;
}