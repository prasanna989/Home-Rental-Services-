import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './property-details.html',
  styleUrls: ['./property-details.css']
})
export class PropertyDetails implements OnInit {
  @Input() propertyId!: string;
  @Input() compactView: boolean = false;
  property$!: Observable<Home>;
  loading = true;
  isFavorite = false;

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.property$ = this.homeService.getHomeById(this.propertyId).pipe(
      map(property => {
        this.checkFavoriteStatus(property);
        this.loading = false;
        return property;
      })
    );
  }

  checkFavoriteStatus(property: Home) {
    const user = this.authService.currentUser();
    if (user && property) {
      this.isFavorite = user.favorites.includes(property._id);
    }
  }

  bookNow(property: Home) {
    const result = this.homeService.addBooking(property);
    if (result.success) {
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

  toggleFavorite(property: Home) {
    if (this.isFavorite) {
      this.authService.removeFavoriteProperty(property._id);
      this.snackBar.open('Removed from favorites', 'Close', { 
        duration: 2000,
        panelClass: ['info-snackbar']
      });
    } else {
      this.authService.addFavoriteProperty(property._id);
      this.snackBar.open('Added to favorites', 'Close', { 
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    }
    this.isFavorite = !this.isFavorite;
  }
}