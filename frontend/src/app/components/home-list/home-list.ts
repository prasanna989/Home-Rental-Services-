import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { AuthService } from '../../services/auth.service';
import { BookingForm } from '../booking-form/booking-form';


@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, BookingForm],
  templateUrl: './home-list.html',
  styleUrl: './home-list.css'
})
export class HomeList implements OnInit {
  @Input() homes: Home[] = [];
  authService = inject(AuthService);
  showForm = false;
  selectedHome!: Home;

  constructor(private homeService: HomeService) {}

  ngOnInit() {
    if (this.homes.length === 0) {
      this.homeService.getHomes().subscribe(homes => {
        this.homes = homes;
      });
    }
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

  markHomeAsBooked(homeId: string) {
    const home = this.homes.find(h => h._id === homeId);
    if (home) {
      home.available = false;
      const bookings = JSON.parse(localStorage.getItem('bookedHomes') || '[]');
      if (!bookings.includes(homeId)) {
        bookings.push(homeId);
        localStorage.setItem('bookedHomes', JSON.stringify(bookings));
      }
    }
    this.showForm = false;
  }
}