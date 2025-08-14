import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Home } from '../models/home.model';
import { FilterOptions } from '../models/filter-options.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:5000/api/properties';
  private bookedHomes: Home[] = [];

  // ✅ Cache for homes
  homesCache: Home[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHomes(): Observable<Home[]> {
    return this.http.get<Home[]>(this.apiUrl);
  }

  getMyProperties(): Observable<Home[]> {
    return this.http.get<Home[]>(`${this.apiUrl}/my-properties`);
  }

  // ✅ Uses cache if available
  getAvailableHomes(): Observable<Home[]> {
    if (this.homesCache.length) {
      return new Observable(observer => {
        observer.next(this.homesCache);
        observer.complete();
      });
    } else {
      return new Observable(observer => {
        this.http.get<Home[]>(`${this.apiUrl}?available=true`).subscribe(data => {
          this.homesCache = data;
          observer.next(data);
          observer.complete();
        });
      });
    }
  }

  getHomeById(id: string): Observable<Home> {
    return this.http.get<Home>(`${this.apiUrl}/${id}`);
  }

  getFilteredHomes(filters: FilterOptions): Observable<Home[]> {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice) params.append('price[gte]', filters.minPrice.toString());
    if (filters.maxPrice) params.append('price[lte]', filters.maxPrice.toString());
    if (filters.propertyTypes.length) params.append('type', filters.propertyTypes.join(','));
    if (filters.amenities.length) params.append('amenities', filters.amenities.join(','));

    return new Observable(observer => {
      this.http.get<Home[]>(`${this.apiUrl}?${params.toString()}`).subscribe(data => {
        // ✅ Save filtered results to cache
        this.homesCache = data;
        observer.next(data);
        observer.complete();
      });
    });
  }

  addHome(homeData: FormData): Observable<Home> {
    return this.http.post<Home>(this.apiUrl, homeData);
  }

  updateHome(id: string, homeData: FormData): Observable<Home> {
    return this.http.put<Home>(`${this.apiUrl}/${id}`, homeData);
  }

  removeHome(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateHomeStatus(id: string, status: boolean): Observable<Home> {
    return this.http.patch<Home>(`${this.apiUrl}/${id}/status`, { available: status });
  }

  addBooking(home: Home): { success: boolean; message: string } {
    if (!home.available) {
      return { success: false, message: 'Property is already booked' };
    }
    const bookedHome = { ...home, available: false };
    this.bookedHomes.push(bookedHome);
    return { success: true, message: 'Booking successful' };
  }

  getBookedHomes(): Home[] {
    return [...this.bookedHomes];
  }

  cancelBooking(id: string): void {
    this.bookedHomes = this.bookedHomes.filter(home => home._id !== id);
  }

  uploadImage(imageFile: File): Observable<{ url: string, public_id: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{ url: string, public_id: string }>(`${this.apiUrl}/upload`, formData);
  }

  // ✅ Clear cache when needed (optional)
  clearCache() {
    this.homesCache = [];
  }
}
