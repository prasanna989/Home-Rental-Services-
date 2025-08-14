import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  homes: Home[] = [];
  errorMessage: string = '';
  newAmenity = '';
  newProperty: Omit<Home, '_id'> = {
    title: '',
    type: '',
    price: 0,
    rentPerDay: 0,
    location: '',
    available: true,
    imageUrl: '',
    amenities: []
  };
  editingProperty: Home = {
    _id: '',
    title: '',
    type: '',
    price: 0,
    rentPerDay: 0,
    location: '',
    available: true,
    imageUrl: '',
    amenities: []
  };
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;
  isAdding = false;
  isUpdating = false;
  isEditing = false;
  loading = false;

  constructor(
    private homeService: HomeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // disable route reuse to force reload on same route
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    const role = this.authService.getLoginRole();
    if (role !== 'owner') {
      this.router.navigate(['/home']);
      return;
    }
    this.loadProperties();
  }

  loadProperties(): void {
    this.loading = true;
    this.homeService.getHomes().subscribe({
      next: (properties) => {
        this.homes = properties ?? [];
        this.loading = false;
        this.cdr.detectChanges(); // force Angular to detect changes
      },
      error: (err) => {
        console.error('Error fetching properties', err);
        this.homes = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addProperty(form: NgForm): void {
    if (this.isAdding || !form.valid) return;
    this.isAdding = true;

    const formData = new FormData();
    formData.append('title', this.newProperty.title);
    formData.append('type', this.newProperty.type);
    formData.append('price', this.newProperty.price.toString());
    formData.append('rentPerDay', this.newProperty.rentPerDay.toString());
    formData.append('location', this.newProperty.location);
    formData.append('available', this.newProperty.available.toString());
    this.newProperty.amenities.forEach(a => formData.append('amenities[]', a));
    if (this.selectedFile) formData.append('image', this.selectedFile);

    this.homeService.addHome(formData).subscribe({
      next: (addedHome) => {
        this.homes = [addedHome, ...this.homes]; // newest first
        this.resetForm();
        form.resetForm();
        this.isAdding = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error adding property', err);
        this.isAdding = false;
      }
    });
  }

  removeProperty(_id: string): void {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const removedIndex = this.homes.findIndex(h => h._id === _id);
    const removedHome = this.homes[removedIndex];
    this.homes = this.homes.filter(h => h._id !== _id);
    this.cdr.detectChanges();

    this.homeService.removeHome(_id).subscribe({
      next: () => {},
      error: (err) => {
        console.error('Error removing property', err);
        this.homes.splice(removedIndex, 0, removedHome);
        this.homes = [...this.homes];
        this.cdr.detectChanges();
      }
    });
  }

  editProperty(home: Home): void {
    this.editingProperty = { ...home };
    this.isEditing = true;
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingProperty = {
      _id: '',
      title: '',
      type: '',
      price: 0,
      rentPerDay: 0,
      location: '',
      available: true,
      imageUrl: '',
      amenities: []
    };
    this.selectedEditFile = null;
    this.newAmenity = '';
    this.cdr.detectChanges();
  }

  saveChanges(editForm: NgForm): void {
  if (!this.isEditing || !this.editingProperty._id || this.isUpdating || !editForm.valid) return;
  
  this.isUpdating = true;
  const originalHomes = [...this.homes]; // Store original state for rollback

  const formData = new FormData();
  formData.append('title', this.editingProperty.title);
  formData.append('type', this.editingProperty.type);
  formData.append('price', this.editingProperty.price.toString());
  formData.append('rentPerDay', this.editingProperty.rentPerDay.toString());
  formData.append('location', this.editingProperty.location);
  formData.append('available', this.editingProperty.available.toString());
  this.editingProperty.amenities.forEach(a => formData.append('amenities', a)); // Changed from 'amenities[]' to 'amenities'
  
  if (this.selectedEditFile) {
    formData.append('image', this.selectedEditFile);
  }

  // Optimistic UI update
  this.homes = this.homes.map(h => 
    h._id === this.editingProperty._id ? {...this.editingProperty} : h
  );

  this.homeService.updateHome(this.editingProperty._id, formData).subscribe({
    next: (updatedHome) => {
      // Final update with server response
      this.homes = this.homes.map(h => 
        h._id === updatedHome._id ? updatedHome : h
      );
      this.cancelEdit();
      this.isUpdating = false;
    },
    error: (err) => {
      console.error('Error updating property', err);
      // Rollback on error
      this.homes = originalHomes;
      this.isUpdating = false;
      this.cdr.detectChanges(); // Force change detection if needed
      
      // Show error message (optional)
      this.errorMessage = 'Failed to save changes. Please try again.';
      setTimeout(() => this.errorMessage = '', 3000);
    },
    complete: () => {
      this.isUpdating = false; // Ensure isUpdating is always reset
    }
  });
}

  resetForm(): void {
    this.newProperty = {
      title: '',
      type: '',
      price: 0,
      rentPerDay: 0,
      location: '',
      available: true,
      imageUrl: '',
      amenities: []
    };
    this.newAmenity = '';
    this.selectedFile = null;
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newProperty.imageUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length && this.isEditing) {
      this.selectedEditFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editingProperty.imageUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedEditFile);
    }
  }

  addAmenity(): void {
    const amenity = this.newAmenity.trim();
    if (amenity && !this.newProperty.amenities.includes(amenity)) {
      this.newProperty.amenities.push(amenity);
      this.cdr.detectChanges();
    }
    this.newAmenity = '';
  }

  removeAmenity(index: number): void {
    this.newProperty.amenities.splice(index, 1);
    this.cdr.detectChanges();
  }

  addAmenityToEdit(): void {
    const amenity = this.newAmenity.trim();
    if (amenity && this.isEditing && !this.editingProperty.amenities.includes(amenity)) {
      this.editingProperty.amenities.push(amenity);
      this.cdr.detectChanges();
    }
    this.newAmenity = '';
  }

  removeEditAmenity(index: number): void {
    if (this.isEditing) {
      this.editingProperty.amenities.splice(index, 1);
      this.cdr.detectChanges();
    }
  }
}
