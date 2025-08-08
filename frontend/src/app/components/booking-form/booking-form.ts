import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';

declare var Razorpay: any;

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css'
})
export class BookingForm {
  @Input() home!: Home;
  @Output() close = new EventEmitter<void>();
  @Output() bookingConfirmed = new EventEmitter<number>();

  checkInDate: string = '';
  checkOutDate: string = '';
  paymentMethod: string = '';

  constructor(private homeService: HomeService) { }

  getNights(): number {
    if (this.checkInDate && this.checkOutDate) {
      const checkIn = new Date(this.checkInDate);
      const checkOut = new Date(this.checkOutDate);
      const diff = checkOut.getTime() - checkIn.getTime();
      return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
    }
    return 0;
  }

  submitBooking() {
    const nights = this.getNights();
    if (nights <= 0) {
      alert("Please select valid check-in and check-out dates.");
      return;
    }

    const amount = this.home.price * nights * 100; // amount in paise
    const options: any = {
      key: 'rzp_test_udBZdAzJoFhuYe',
      amount: amount,
      currency: 'INR',
      name: 'Home Rental Booking',
      description: `Booking for ${this.home.title}`,
      image: '',
      handler: (response: any) => {
        console.log('Payment success:', response);
        this.homeService.addBooking(this.home);
        this.bookingConfirmed.emit(this.home.id);
        alert(`✅ Payment successful! Booked ${nights} nights at ₹${this.home.price * nights}`);
        this.close.emit();
      },
      prefill: {
        name: 'Test User',
        email: 'test.user@razorpay.com',
        contact: '9123456789'
      },
      notes: {
        home_id: this.home.id
      },
      theme: {
        color: '#28a745'
      }
    };

    const rzp = new Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      alert(
        `❌ Payment failed!\nReason: ${response.error.reason}\nDescription: ${response.error.description}`
      );
    });

    rzp.on('payment.cancelled', () => {
      alert('⚠️ Payment was cancelled.');
    });

    rzp.open();
  }

}


