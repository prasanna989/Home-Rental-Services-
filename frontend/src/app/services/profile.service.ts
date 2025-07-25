import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, FavoriteProperty } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'api/profile'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  updateProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${profile.id}`, profile);
  }

  getFavorites(userId: string): Observable<FavoriteProperty[]> {
    return this.http.get<FavoriteProperty[]>(`${this.apiUrl}/${userId}/favorites`);
  }

  addFavorite(userId: string, propertyId: string): Observable<FavoriteProperty> {
    return this.http.post<FavoriteProperty>(`${this.apiUrl}/${userId}/favorites`, { propertyId });
  }

  removeFavorite(favoriteId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/favorites/${favoriteId}`);
  }
}