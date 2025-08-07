import { Injectable } from '@angular/core';
import { Home } from '../models/home.model';
import { FilterOptions } from '../models/filter-options.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private homes: Home[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      type: 'Apartment',
      price: 1200,
      location: 'New York',
      available: true,
      imageUrl: 'assets/images/home1.jpg',
      amenities: ['WiFi', 'Air Conditioning', 'Parking']
    },
    {
      id: 2,
      title: 'Cozy Cottage by the Lake',
      type: 'Cottage',
      price: 950,
      location: 'Lake Tahoe',
      available: true,
      imageUrl: 'assets/images/home2.jpg',
      amenities: ['WiFi', 'Pool', 'Kitchen']
    },
    {
      id: 3,
      title: 'Luxury Villa with Ocean View',
      type: 'Villa',
      price: 2200,
      location: 'Malibu',
      available: true,
      imageUrl: 'assets/images/home3.jpg',
      amenities: ['Pool', 'Parking', 'Air Conditioning', 'Kitchen']
    },
    {
      id: 4,
      title: 'Downtown Loft Apartment',
      type: 'Apartment',
      price: 850,
      location: 'Chicago',
      available: true,
      imageUrl: 'assets/images/home4.jpg',
      amenities: ['WiFi', 'Kitchen']
    },
    {
      id: 5,
      title: 'Mountain View Cabin',
      type: 'Cabin',
      price: 1,
      location: 'Aspen',
      available: true,
      imageUrl: 'assets/images/home5.jpg',
      amenities: ['Parking', 'Kitchen']
    }
  ];

  getHomes(): Home[] {
    return this.homes;
  }

  getAvailableHomes(): Home[] {
    return this.homes.filter(home => home.available);
  }

  getHomeById(id: number): Home | undefined {
    return this.homes.find(home => home.id === id);
  }

  getFilteredHomes(filters: FilterOptions): Home[] {
    return this.homes.filter(home => {
      // Location filter
      if (filters.location && 
          !home.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Price filter
      if (home.price < filters.minPrice || home.price > filters.maxPrice) {
        return false;
      }
      
      // Property type filter
      if (filters.propertyTypes.length > 0 && 
          !filters.propertyTypes.includes(home.type)) {
        return false;
      }
      
      // Amenities filter (home should have all selected amenities)
      if (filters.amenities.length > 0 && 
          !filters.amenities.every(a => home.amenities.includes(a))) {
        return false;
      }
      
      return true;
    });
  }
  updateHomeStatus(id: number, status: boolean): void {
    const home = this.homes.find(h => h.id === id);
    if (home) {
      home.available = status;
    }
  }
  // Add this in HomeService
  bookedHomes: Home[] = [];

  addBooking(home: Home) {
    home.available = false;
    this.bookedHomes.push(home);
  }

  getBookedHomes(): Home[] {
    return this.bookedHomes;
  }


}