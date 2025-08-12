import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  homes: Home[] = [];
  newAmenity: string = '';
  newProperty: Omit<Home, '_id'> = {
    title: '',
    type: '',
    price: 0,
    rentPerDay: 0,
    location: '',
    available: true,
    imageUrl: '', // Added missing required field
    amenities: []
  };
  editingProperty: Home | null = null;
  selectedFile: File | null = null;
  selectedEditFile: File | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.homeService.getHomes().subscribe({
      next: (homes) => this.homes = homes,
      error: (err) => console.error('Error loading properties', err)
    });
  }

  addProperty(): void {
    const formData = new FormData();
    formData.append('title', this.newProperty.title);
    formData.append('type', this.newProperty.type);
    formData.append('price', this.newProperty.price.toString());
    formData.append('rentPerDay', this.newProperty.rentPerDay.toString());
    formData.append('location', this.newProperty.location);
    formData.append('available', this.newProperty.available.toString());
    
    // Add amenities
    this.newProperty.amenities.forEach(amenity => {
      formData.append('amenities[]', amenity);
    });

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.homeService.addHome(formData).subscribe({
      next: () => {
        this.loadProperties();
        this.resetForm();
      },
      error: (err) => console.error('Error adding property', err)
    });
  }

  removeProperty(_id: string): void {
    if (confirm('Are you sure you want to delete this property?')) {
      this.homeService.removeHome(_id).subscribe({
        next: () => this.loadProperties(),
        error: (err) => console.error('Error removing property', err)
      });
    }
  }

  editProperty(home: Home): void {
    this.editingProperty = { ...home };
  }

  cancelEdit(): void {
    this.editingProperty = null;
  }

  saveChanges(): void {
    if (!this.editingProperty || !this.editingProperty._id) return;

    const formData = new FormData();
    formData.append('title', this.editingProperty.title);
    formData.append('type', this.editingProperty.type);
    formData.append('price', this.editingProperty.price.toString());
    formData.append('rentPerDay', this.editingProperty.rentPerDay.toString());
    formData.append('location', this.editingProperty.location);
    formData.append('available', this.editingProperty.available.toString());
    
    // Add amenities
    this.editingProperty.amenities.forEach(amenity => {
      formData.append('amenities[]', amenity);
    });

    // Add new image if selected
    if (this.selectedEditFile) {
      formData.append('image', this.selectedEditFile);
    }

    this.homeService.updateHome(this.editingProperty._id, formData).subscribe({
      next: () => {
        this.loadProperties();
        this.editingProperty = null;
      },
      error: (err) => console.error('Error updating property', err)
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
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.newProperty.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onEditFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && this.editingProperty) {
      this.selectedEditFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editingProperty!.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedEditFile);
    }
  }

  addAmenity(): void {
    const amenity = this.newAmenity.trim();
    if (amenity && !this.newProperty.amenities.includes(amenity)) {
      this.newProperty.amenities.push(amenity);
    }
    this.newAmenity = '';
  }

  removeAmenity(index: number): void {
    this.newProperty.amenities.splice(index, 1);
  }

  addAmenityToEdit(): void {
    const amenity = this.newAmenity.trim();
    if (amenity && this.editingProperty && !this.editingProperty.amenities.includes(amenity)) {
      this.editingProperty.amenities.push(amenity);
    }
    this.newAmenity = '';
  }

  removeEditAmenity(index: number): void {
    if (this.editingProperty) {
      this.editingProperty.amenities.splice(index, 1);
    }
  }
}