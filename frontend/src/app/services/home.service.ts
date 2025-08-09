import { Injectable } from '@angular/core';
import { Home } from '../models/home.model';
import { FilterOptions } from '../models/filter-options.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private homes: Home[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      type: 'Apartment',
      price: 1200,
      rentPerDay: 150,
      location: 'New York',
      available: true,
      imageUrl: 'https://wp-tid.zillowstatic.com/18/renting-a-house-with-a-pool-fa1550.jpg',
      amenities: ['WiFi', 'Air Conditioning', 'Parking'],
    },
    {
      id: 2,
      title: 'Cozy Cottage by the Lake',
      type: 'Cottage',
      price: 950,
      rentPerDay: 100,
      location: 'Lake Tahoe',
      available: true,
      imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.MPFaqSXsMLmNrBaZOqvltwHaE8?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Pool', 'Kitchen'],
    },
    {
      id: 3,
      title: 'Luxury Villa with Ocean View',
      type: 'Villa',
      price: 2200,
      rentPerDay: 300,
      location: 'Malibu',
      available: true,
      imageUrl: 'https://u.realgeeks.media/fortmeadehomes/timberbrook/01._Seven_Oaks_home_for_rent.jpg',
      amenities: ['Pool', 'Parking', 'Air Conditioning', 'Kitchen'],
    },
    {
      id: 4,
      title: 'Downtown Loft Apartment',
      type: 'Apartment',
      price: 850,
      rentPerDay: 90,
      location: 'Chicago',
      available: true,
      imageUrl: 'https://www.poconomountainrentals.com/wp-content/uploads/2021/03/8-Bed-Pocono-Mountains-Rental-Homes.jpeg',
      amenities: ['WiFi', 'Kitchen'],
    },
    {
      id: 5,
      title: 'Mountain View Cabin',
      type: 'Cabin',
      price: 750,
      rentPerDay: 85,
      location: 'Aspen',
      available: true,
      imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.Mb_S329u13GmsIVLjnjGJQHaE8?pid=Api&P=0&h=180',
      amenities: ['Parking', 'Kitchen'],
    },
    {
      id: 6,
      title: 'Seaside Bungalow',
      type: 'Bungalow',
      price: 1100,
      rentPerDay: 120,
      location: 'Goa',
      available: true,
      imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.DAWRXOO0hAKyq8g12aPBLwHaEK?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Pool', 'Air Conditioning'],
    },
    {
      id: 7,
      title: 'Penthouse Suite with City View',
      type: 'Penthouse',
      price: 2600,
      rentPerDay: 350,
      location: 'Dubai',
      available: true,
      imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.vJ7cA56QNO-Nqj4byFcLPQHaE8?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Air Conditioning'],
    },
    {
      id: 8,
      title: 'Countryside Farmhouse Retreat',
      type: 'Farmhouse',
      price: 600,
      rentPerDay: 70,
      location: 'Nashville',
      available: true,
      imageUrl: 'https://www.orlandovacationhomes.com/wp-content/uploads/2019/10/c3Studio_835GoldenBearDr_11.19.18_twilight_0009-copy.jpg',
      amenities: ['Kitchen', 'Parking', 'WiFi'],
    }
  ];

  private bookedHomes: Home[] = [];

  constructor(private snackBar: MatSnackBar) {}

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
      const matchesLocation =
        !filters.location || home.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchesPrice =
        home.price >= (filters.minPrice ?? 0) && home.price <= (filters.maxPrice ?? Infinity);

      const matchesType =
        filters.propertyTypes.length === 0 || filters.propertyTypes.includes(home.type);

      const matchesAmenities =
        filters.amenities.length === 0 ||
        filters.amenities.every(a => home.amenities.includes(a));

      return (
        matchesLocation &&
        matchesPrice &&
        matchesType &&
        matchesAmenities
      );
    });
  }

  updateHomeStatus(id: number, status: boolean): void {
    const home = this.homes.find(h => h.id === id);
    if (home) {
      home.available = status;
    }
  }

  addBooking(home: Home): {success: boolean, message: string} {
    const homeToBook = this.getHomeById(home.id);
    
    if (!homeToBook) {
      return {success: false, message: 'Property not found'};
    }

    if (!homeToBook.available) {
      return {success: false, message: 'Property is already booked'};
    }

    homeToBook.available = false;
    this.bookedHomes.push({...homeToBook});
    
    this.snackBar.open(`Successfully booked ${homeToBook.title}!`, 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
    
    return {success: true, message: 'Booking successful'};
  }

  getBookedHomes(): Home[] {
    return this.bookedHomes;
  }

  cancelBooking(homeId: number): void {
    const bookingIndex = this.bookedHomes.findIndex(h => h.id === homeId);
    if (bookingIndex !== -1) {
      this.bookedHomes.splice(bookingIndex, 1);
      this.updateHomeStatus(homeId, true);
    }
  }

  getPropertyDetails(id: number): Home | undefined {
    return this.homes.find(h => h.id === id);
  }

  addHome(newHome: Home): void {
    newHome.id = this.homes.length > 0
      ? Math.max(...this.homes.map(h => h.id)) + 1
      : 1;
    newHome.available = true;
    this.homes.push(newHome);
  }

  removeHome(id: number): void {
    this.homes = this.homes.filter(home => home.id !== id);
    this.bookedHomes = this.bookedHomes.filter(home => home.id !== id);
  }

  updateHome(updatedHome: Home): void {
    const index = this.homes.findIndex(h => h.id === updatedHome.id);
    if (index !== -1) {
      this.homes[index] = {...updatedHome};
    }
    
    const bookedIndex = this.bookedHomes.findIndex(h => h.id === updatedHome.id);
    if (bookedIndex !== -1) {
      this.bookedHomes[bookedIndex] = {...updatedHome};
    }
  }
}