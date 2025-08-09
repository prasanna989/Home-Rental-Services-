import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './property-details.html',
  styleUrls: ['./property-details.css']
})
export class PropertyDetails implements OnInit {
  @Input() propertyId!: number;
  @Input() compactView: boolean = false;
  property?: Home;
  loading = true;
  isFavorite = false;

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadProperty();
  }

  loadProperty() {
    this.property = this.homeService.getHomeById(this.propertyId);
    
    if (this.property) {
      this.checkFavoriteStatus();
    } else {
      this.snackBar.open('Property not found', 'Close', { duration: 3000 });
    }
    
    this.loading = false;
  }

  checkFavoriteStatus() {
  const user = this.authService.currentUser();
  if (user && this.property) {
    this.isFavorite = user.favorites.includes(this.property.id);
  } else {
    this.isFavorite = false;
  }
}

  bookNow() {
    if (this.property) {
      const result = this.homeService.addBooking(this.property);
      if (result.success) {
        this.property = {...this.property, available: false};
        this.snackBar.open('Booking successful!', 'Close', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.snackBar.open(result.message || 'Booking failed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    }
  }

  toggleFavorite() {
    if (!this.property) return;
    
    if (this.isFavorite) {
      this.authService.removeFavoriteProperty(this.property.id);
      this.snackBar.open('Removed from favorites', 'Close', { 
        duration: 2000,
        panelClass: ['info-snackbar']
      });
    } else {
      this.authService.addFavoriteProperty(this.property.id);
      this.snackBar.open('Added to favorites', 'Close', { 
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }
    
    this.isFavorite = !this.isFavorite;
  }
}