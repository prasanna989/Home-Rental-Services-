import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';

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

  constructor(private homeService: HomeService) {} 

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
    this.homeService.addBooking(this.home);  
    alert(`Booked ${this.getNights()} nights at ₹${this.home.price * this.getNights()}`);
    this.close.emit();  
    this.bookingConfirmed.emit(this.home.id); 
  }
}
