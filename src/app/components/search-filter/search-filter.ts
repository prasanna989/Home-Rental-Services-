import { Component, inject } from '@angular/core';
import { FilterService } from '../../services/filter.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-filter.html',
  styleUrl: './search-filter.css'
})
export class SearchFilter {

filterService = inject(FilterService);
  
  propertyTypes = ['Apartment', 'Villa', 'Cottage', 'House', 'Condo'];
  amenities = ['WiFi', 'Pool', 'Parking', 'Air Conditioning', 'Kitchen'];
  
  checkInDate?: string;
  checkOutDate?: string;

  // Update to use the getter property without ()
  get currentFilters() {
    return this.filterService.filters;
  }

  updateDates() {
    this.filterService.updateFilters({
      checkIn: this.checkInDate ? new Date(this.checkInDate) : undefined,
      checkOut: this.checkOutDate ? new Date(this.checkOutDate) : undefined
    });
  }

  togglePropertyType(type: string) {
    const types = [...this.currentFilters.propertyTypes];
    const index = types.indexOf(type);
    
    if (index > -1) {
      types.splice(index, 1);
    } else {
      types.push(type);
    }
    
    this.filterService.updateFilters({ propertyTypes: types });
  }

  toggleAmenity(amenity: string) {
    const amenities = [...this.currentFilters.amenities];
    const index = amenities.indexOf(amenity);
    
    if (index > -1) {
      amenities.splice(index, 1);
    } else {
      amenities.push(amenity);
    }
    
    this.filterService.updateFilters({ amenities });
  }
}