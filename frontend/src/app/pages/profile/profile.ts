import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyDetails } from '../property-details/property-details';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, PropertyDetails],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})

export class Profile {
  @Input() propertyId: string = ''; // Fixed Input declaration
  
  authService = inject(AuthService);
  isEditing = false;
  editedUser: any = {};
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  bookedHomes: Home[] = [];
  
  constructor(
    private homeService: HomeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetEditForm();
    this.loadBookedHomes();
  }

  loadBookedHomes() {
    this.bookedHomes = this.homeService.getBookedHomes();
  }

  cancelBooking(home: Home) {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.homeService.cancelBooking(home._id);
      this.bookedHomes = this.bookedHomes.filter(h => h._id !== home._id);
    }
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.resetEditForm();
    }
  }

  resetEditForm() {
    const currentUser = this.authService.currentUser();
    this.editedUser = {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      bio: currentUser?.bio || '',
      dateOfBirth: currentUser?.dateOfBirth ? 
        new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : ''
    };
    this.previewImageUrl = currentUser?.profileImageUrl || null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveProfile() {
    if (this.authService.currentUser()) {
      const updatedUser = {
        ...this.authService.currentUser()!,
        ...this.editedUser,
        profileImageUrl: this.previewImageUrl || this.authService.currentUser()?.profileImageUrl,
        dateOfBirth: this.editedUser.dateOfBirth ? new Date(this.editedUser.dateOfBirth) : undefined
      };
      
      this.authService.updateProfile(updatedUser);
      this.isEditing = false;
    }
  }

  removeFavorite(propertyId: string) {
    this.authService.removeFavoriteProperty(propertyId);
  }
}