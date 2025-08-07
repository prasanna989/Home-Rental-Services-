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
  users: any[] = [];
  homes: Home[] = [];

  newAmenity: string = '';
  newProperty: Home = {
    id: 0,
    title: '',
    type: '',
    price: null as any,
    rentPerDay: null as any,
    location: '',
    available: true,
    imageUrl: '',
    amenities: [] // ✅ Ensures it's always defined
  };

  editingProperty: Home | null = null;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homes = this.homeService.getHomes();
  }

  addProperty(): void {
    const newId = this.homes.length > 0 ? Math.max(...this.homes.map(h => h.id)) + 1 : 1;
    const propertyToAdd = { ...this.newProperty, id: newId };

    this.homeService.addHome(propertyToAdd);
    this.homes = this.homeService.getHomes();
    this.resetForm();
  }

  removeProperty(id: number): void {
    this.homeService.removeHome(id);
    this.homes = this.homeService.getHomes();
  }

  editProperty(home: Home): void {
    this.editingProperty = { ...home };
  }

  cancelEdit(): void {
    this.editingProperty = null;
  }

  saveChanges(): void {
    if (this.editingProperty) {
      this.homeService.updateHome(this.editingProperty);
      this.homes = this.homeService.getHomes();
      this.editingProperty = null;
    }
  }

  resetForm(): void {
    this.newProperty = {
      id: 0,
      title: '',
      type: '',
      price: null as any,
      rentPerDay: null as any,
      location: '',
      available: true,
      imageUrl: '',
      amenities: [] // ✅ Reset this as well
    };
    this.newAmenity = '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.newProperty.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
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

  onEditFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && this.editingProperty) {
      const reader = new FileReader();
      reader.onload = () => {
        this.editingProperty!.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  addAmenityToEdit(): void {
    const amenity = this.newAmenity.trim();
    if (amenity && this.editingProperty && !this.editingProperty.amenities.includes(amenity)) {
      this.editingProperty.amenities.push(amenity);
    }
    this.newAmenity = '';
  }
}
