import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertyPreview } from '../../components/property-preview/property-preview';
import { Home } from '../../models/home.model';
import { HomeService } from '../../services/home.service';


@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, PropertyPreview],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})

export class Profile {
  authService = inject(AuthService);
  isEditing = false;
  editedUser: any = {};
  selectedFile: File | null = null;
  previewImageUrl: string | null = null;
  bookedHomes: Home[] = [];
  constructor(private homeService: HomeService) {}

  ngOnInit() {
    this.resetEditForm();
    this.loadBookedHomes();
    this.bookedHomes = this.homeService.getBookedHomes();
  }

  loadBookedHomes() {
    const stored = localStorage.getItem('bookedHomes');
    this.bookedHomes = stored ? JSON.parse(stored) : [];
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

  removeFavorite(propertyId: number) {
    this.authService.removeFavoriteProperty(propertyId);
  }
}