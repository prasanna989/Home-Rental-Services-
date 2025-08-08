import { Component,Input, inject } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BookingForm } from '../booking-form/booking-form';


@Component({
  selector: 'app-home-list',
  imports: [CommonModule,BookingForm],
  templateUrl: './home-list.html',
  styleUrl: './home-list.css'
})
export class HomeList {
  @Input() homes: Home[] = [];
  authService = inject(AuthService);
  showForm = false;
  selectedHome!: Home;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.homes = this.homeService.getHomes();
  }

  bookHome(home: Home) {
    this.homeService.updateHomeStatus(home.id, false);
  }
  openBooking(home: Home) {
  if (!this.authService.isLoggedIn()) {
    alert('Please login to book a home');
    return;
  }

  this.selectedHome = home;
  this.showForm = true;
}

  closeBooking() {
    this.showForm = false;
  }
  markHomeAsBooked(homeId: number) {
    const home = this.homes.find(h => h.id === homeId);
    if (home) {
      home.available = false;

      // Save to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookedHomes') || '[]');
      if (!bookings.includes(homeId)) {
        bookings.push(homeId);
        localStorage.setItem('bookedHomes', JSON.stringify(bookings));
      }
    }

    this.showForm = false;
  }

}