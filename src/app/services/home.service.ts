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
      imageUrl: 'https://wp-tid.zillowstatic.com/18/renting-a-house-with-a-pool-fa1550.jpg',
      amenities: ['WiFi', 'Air Conditioning', 'Parking'],
      isFavorite: false
    },
    {
      id: 2,
      title: 'Cozy Cottage by the Lake',
      type: 'Cottage',
      price: 950,
      location: 'Lake Tahoe',
      available: true,
      imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.MPFaqSXsMLmNrBaZOqvltwHaE8?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Pool', 'Kitchen'],
      isFavorite: false
    },
    {
      id: 3,
      title: 'Luxury Villa with Ocean View',
      type: 'Villa',
      price: 2200,
      location: 'Malibu',
      available: true,
      imageUrl: 'https://u.realgeeks.media/fortmeadehomes/timberbrook/01._Seven_Oaks_home_for_rent.jpg',
      amenities: ['Pool', 'Parking', 'Air Conditioning', 'Kitchen'],
      isFavorite: false
    },
    {
      id: 4,
      title: 'Downtown Loft Apartment',
      type: 'Apartment',
      price: 850,
      location: 'Chicago',
      available: true,
      imageUrl: 'https://www.poconomountainrentals.com/wp-content/uploads/2021/03/8-Bed-Pocono-Mountains-Rental-Homes.jpeg',
      amenities: ['WiFi', 'Kitchen'],
      isFavorite: false
    },
    {
      id: 5,
      title: 'Mountain View Cabin',
      type: 'Cabin',
      price: 750,
      location: 'Aspen',
      available: true,
      imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.Mb_S329u13GmsIVLjnjGJQHaE8?pid=Api&P=0&h=180',
      amenities: ['Parking', 'Kitchen'],
      isFavorite: false
    },
    {
      id: 6,
      title: 'Seaside Bungalow',
      type: 'Bungalow',
      price: 1100,
      location: 'Goa',
      available: true,
      imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.DAWRXOO0hAKyq8g12aPBLwHaEK?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Pool', 'Air Conditioning'],
      isFavorite: false
    },
    {
      id: 7,
      title: 'Penthouse Suite with City View',
      type: 'Penthouse',
      price: 2600,
      location: 'Dubai',
      available: true,
      imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.vJ7cA56QNO-Nqj4byFcLPQHaE8?pid=Api&P=0&h=180',
      amenities: ['WiFi', 'Parking', 'Kitchen', 'Air Conditioning'],
      isFavorite: false
    },
    {
      id: 8,
      title: 'Countryside Farmhouse Retreat',
      type: 'Farmhouse',
      price: 600,
      location: 'Nashville',
      available: true,
      imageUrl: 'https://www.orlandovacationhomes.com/wp-content/uploads/2019/10/c3Studio_835GoldenBearDr_11.19.18_twilight_0009-copy.jpg',
      amenities: ['Kitchen', 'Parking', 'WiFi'],
      isFavorite: false
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
      if (filters.location &&
        !home.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (home.price < filters.minPrice || home.price > filters.maxPrice) {
        return false;
      }

      if (filters.propertyTypes.length > 0 &&
        !filters.propertyTypes.includes(home.type)) {
        return false;
      }

      if (filters.amenities.length > 0 &&
        !filters.amenities.every(a => home.amenities.includes(a))) {
        return false;
      }

      return true;
    });
  }
}
