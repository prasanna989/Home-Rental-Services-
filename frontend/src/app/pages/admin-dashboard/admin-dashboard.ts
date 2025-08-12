import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
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
  isAdding: boolean = false;
  isUpdating: boolean = false;
  isEditing: boolean = false;

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
    
    this.newProperty.amenities.forEach(amenity => {
      formData.append('amenities[]', amenity);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.homeService.addHome(formData).subscribe({
      next: (addedHome) => {
        this.homes = [...this.homes, addedHome];
        this.resetForm();
        form.resetForm();
        this.isAdding = false;
      },
      error: (err) => {
        console.error('Error adding property', err);
        this.isAdding = false;
      }
    });
  }

  removeProperty(_id: string): void {
    if (!confirm('Are you sure you want to delete this property?')) return;

    const removedIndex = this.homes.findIndex(home => home._id === _id);
    const removedHome = this.homes[removedIndex];
    
    this.homes = this.homes.filter(home => home._id !== _id);

    this.homeService.removeHome(_id).subscribe({
      next: () => console.log('Property removed successfully'),
      error: (err) => {
        console.error('Error removing property', err);
        this.homes.splice(removedIndex, 0, removedHome);
        this.homes = [...this.homes];
      }
    });
  }

  editProperty(home: Home): void {
    this.editingProperty = { ...home };
    this.isEditing = true;
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
  }

saveChanges(editForm: NgForm): void {
    if (!this.isEditing || !this.editingProperty._id || this.isUpdating || !editForm.valid) return;
    
    this.isUpdating = true;
    const formData = new FormData();
    formData.append('title', this.editingProperty.title);
    formData.append('type', this.editingProperty.type);
    formData.append('price', this.editingProperty.price.toString());
    formData.append('rentPerDay', this.editingProperty.rentPerDay.toString());
    formData.append('location', this.editingProperty.location);
    formData.append('available', this.editingProperty.available.toString());
    
    this.editingProperty.amenities.forEach(amenity => {
      formData.append('amenities', JSON.stringify(this.editingProperty.amenities));
    });

    if (this.selectedEditFile) {
      formData.append('image', this.selectedEditFile);
    }

    const updatedIndex = this.homes.findIndex(home => home._id === this.editingProperty._id);
    if (updatedIndex !== -1) {
      const updatedHome = { 
        ...this.editingProperty,
        // Include the new image URL if a file was selected
        imageUrl: this.selectedEditFile ? this.editingProperty.imageUrl : this.homes[updatedIndex].imageUrl
      };
      
      // Create new array to trigger change detection
      this.homes = [
        ...this.homes.slice(0, updatedIndex),
        updatedHome,
        ...this.homes.slice(updatedIndex + 1)
      ];
    }

    this.homeService.updateHome(this.editingProperty._id, formData).subscribe({
      next: (updatedHome) => {
        this.homes = this.homes.map(home => 
          home._id === updatedHome._id ? updatedHome : home
        );
        this.cancelEdit();
        this.isUpdating = false;
      },
      error: (err) => {
        console.error('Error updating property', err);
        if (updatedIndex !== -1) {
          this.homes = [
            ...this.homes.slice(0, updatedIndex),
            this.homes[updatedIndex], 
            ...this.homes.slice(updatedIndex + 1)
          ];
        }
        this.isUpdating = false;
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
    if (input.files && input.files.length > 0 && this.isEditing) {
      this.selectedEditFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.editingProperty.imageUrl = reader.result as string;
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
    if (amenity && this.isEditing && !this.editingProperty.amenities.includes(amenity)) {
      this.editingProperty.amenities.push(amenity);
    }
    this.newAmenity = '';
  }

  removeEditAmenity(index: number): void {
    if (this.isEditing) {
      this.editingProperty.amenities.splice(index, 1);
    }
  }
}