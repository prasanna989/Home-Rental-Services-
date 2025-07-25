import { Component, Input, inject, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-list.html',
  styleUrls: ['./home-list.css']
})
export class HomeList implements OnInit {
  @Input() homes: Home[] = [];
  bookings: any[] = [];

  authService = inject(AuthService);

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    
    if (!this.homes || this.homes.length === 0) {
      this.homes = this.homeService.getAvailableHomes();
    }

    
    this.homes = this.homes.map(home => ({
      ...home,
      isFavorite: home.isFavorite ?? false
    }));

    
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      this.bookings = JSON.parse(storedBookings);
    }
  }


  toggleFavorite(home: Home): void {
    home.isFavorite = !home.isFavorite;
  }

 
  trackByHomeId(index: number, home: Home): number {
    return home.id;
  }

  
  trackByBooking(index: number, booking: any): string {
    return booking.name + '_' + booking.date;
  }
}
