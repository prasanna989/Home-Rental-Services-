import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
// import { decodeJwt } from '../utils/jwt-helper';

import { jwtDecode } from 'jwt-decode';


interface User {
  id?: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date | string;
  profileImageUrl?: string;
  favorites: string[];
  role?: string;
}

interface PropertyListing {
  id: string;
  title: string;
  location: string;
  owner: string;
  postedAt: Date;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';

  private users: User[] = [
    {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phone: '1234567890',
      bio: 'Hello! I love finding great rental properties.',
      dateOfBirth: '1990-01-01',
      profileImageUrl: 'assets/default-profile.png',
      favorites: ['1', '2']
    }
  ];

  private propertyListings: PropertyListing[] = [];
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor(
    private router: Router,
    private notification: NotificationService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwtToken');
      const savedUser = localStorage.getItem('loggedInUser');
      if (token && savedUser) {
        this.isAuthenticated.set(true);
        this.currentUser.set(JSON.parse(savedUser));
      }
    }
  }

  private initializeAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkLocalStorage();
    }
  }

  private checkLocalStorage(): void {
    try {
      const userData = localStorage.getItem('loggedInUser');
      if (userData) {
        const user = JSON.parse(userData);
        this.isAuthenticated.set(true);
        this.currentUser.set(user);
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      this.clearAuthData();
    }
  }

  private clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
    }
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
  }

  private persistUserData(user: User): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user data to localStorage:', error);
      }
    }
  }


  // Signup with backend API
  signup(userData: { name: string; email: string; password: string; phone: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap({
        next: () => {
          this.notification.success('Signup successful! Please login.');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          this.notification.error(err.error?.message || 'Signup failed. Please try again.');
        }
      })
    );
  }

  // Login with backend API, save token & user info
login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap({
        next: (res) => {
          console.log('Login response:', res);
          const userFromToken = jwtDecode(res.token) as User;
          this.isAuthenticated.set(true);
          this.currentUser.set(userFromToken);
          localStorage.setItem('jwtToken', res.token);
          localStorage.setItem('loggedInUser', JSON.stringify(userFromToken));
          this.notification.success('Login successful!');
        },
        error: (err) => {
          this.notification.error(err.error?.message || 'Login failed.');
        }
      })
    );
  }






  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInUser');
    this.notification.info('You have been logged out.');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  updateProfile(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.email === updatedUser.email);

    if (index === -1) return false;

    // Preserve password if not being updated
    updatedUser.password = updatedUser.password || this.users[index].password;

    this.users[index] = updatedUser;
    this.currentUser.set(updatedUser);
    this.persistUserData(updatedUser);
    this.notification.success('Profile updated successfully!');
    return true;
  }

  // Favorite properties methods
  addFavoriteProperty(propertyId: string): void {
    const user = this.currentUser();
    if (!user || user.favorites.includes(propertyId)) return;

    user.favorites.push(propertyId);
    this.currentUser.set({ ...user });
    this.updateProfile(user);
    this.notification.success('Added to favorites!');
  }

  removeFavoriteProperty(propertyId: string): void {
    const user = this.currentUser();
    if (!user) return;

    user.favorites = user.favorites.filter(id => id !== propertyId);
    this.currentUser.set({ ...user });
    this.updateProfile(user);
    this.notification.info('Removed from favorites');
  }

  // Property listing methods
  getAllPropertyListings(): PropertyListing[] {
    return [...this.propertyListings];
  }

  getPropertyById(id: string): PropertyListing | undefined {
    return this.propertyListings.find(p => p.id === id);
  }

  updateProfileImage(userEmail: string, imageUrl: string): boolean {
    const user = this.users.find(u => u.email === userEmail);
    if (!user) return false;

    user.profileImageUrl = imageUrl;
    if (this.currentUser()?.email === userEmail) {
      this.currentUser.set({ ...user });
      this.persistUserData(user);
    }
    return true;
  }

  currentUserValue(): User | null {
    return this.currentUser();
  }
}