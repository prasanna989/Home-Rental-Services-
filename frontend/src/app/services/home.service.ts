import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Home } from '../models/home.model';
import { FilterOptions } from '../models/filter-options.model';
import { AuthService } from './auth.service';

type HomesResponse = Home[] | { data?: Home[]; success?: boolean };

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:5000/api/properties';
  private bookedHomes: Home[] = [];


  homesCache: Home[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  
  private normalizeList(res: HomesResponse): Home[] {
    return Array.isArray(res) ? res : (res?.data ?? []);
  }

  getHomes(): Observable<Home[]> {
    return this.http.get<HomesResponse>(this.apiUrl).pipe(
      map(res => this.normalizeList(res)),
      tap(list => (this.homesCache = list))
    );
  }

  /** Only use if you implement this route on backend */
  getMyProperties(): Observable<Home[]> {
    return this.http.get<HomesResponse>(`${this.apiUrl}/my-properties`).pipe(
      map(res => this.normalizeList(res))
    );
  }

  getAvailableHomes(): Observable<Home[]> {
    if (this.homesCache.length) {
      return of(this.homesCache);
    }
    return this.http.get<HomesResponse>(`${this.apiUrl}?available=true`).pipe(
      map(res => this.normalizeList(res)),
      tap(list => (this.homesCache = list))
    );
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

    return this.http.get<HomesResponse>(`${this.apiUrl}?${params.toString()}`).pipe(
      map(res => this.normalizeList(res)),
      tap(list => (this.homesCache = list))
    );
  }

addHome(homeData: FormData): Observable<Home> {
  return this.http.post<Home>(this.apiUrl, homeData).pipe(
    tap(newHome => {
      this.homesCache = [...this.homesCache, newHome]; // update cache
    })
  );
}

  updateHome(id: string, homeData: FormData): Observable<Home> {
  return this.http.put<Home | { success: boolean; data: Home }>(`${this.apiUrl}/${id}`, homeData)
      .pipe(map(res => (res && 'data' in res ? res.data : (res as Home))));
}

  removeHome(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateHomeStatus(id: string, status: boolean): Observable<Home> {
    return this.http.patch<Home | { success: boolean; data: Home }>(`${this.apiUrl}/${id}/status`, { available: status })
      .pipe(map(res => (res && 'data' in res ? res.data : (res as Home))));
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

  uploadImage(imageFile: File): Observable<{ url: string; public_id: string }> {
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.post<{ url: string; public_id: string }>(`${this.apiUrl}/upload`, formData);
  }

  // ✅ Clear cache when needed (optional)
  clearCache() {
    this.homesCache = [];
  }
}
