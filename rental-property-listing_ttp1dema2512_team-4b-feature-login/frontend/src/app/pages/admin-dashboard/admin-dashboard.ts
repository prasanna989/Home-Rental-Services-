
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  listings: any[] = [];
  filteredListings: any[] = [];
  selectedStatus = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const listings = this.authService.getAllPropertyListings();
    this.listings = listings;
    this.filteredListings = [...listings];
  }

  filterListings(): void {
    if (this.selectedStatus) {
      this.filteredListings = this.listings.filter(
        listing => listing.status === this.selectedStatus
      );
    } else {
      this.filteredListings = [...this.listings];
    }
  }

  flagListing(listing: any): void {
    listing.status = 'Flagged';
    this.filterListings();
  }

  disableListing(listing: any): void {
    const confirmDisable = confirm(`Are you sure to disable "${listing.title}"?`);
    if (confirmDisable) {
      listing.status = 'Disabled';
      this.filterListings();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin-login']);
  }
}
