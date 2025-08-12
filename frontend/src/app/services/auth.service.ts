import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { isPlatformBrowser } from '@angular/common';

interface User {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date | string;
  profileImageUrl?: string;
  favorites: string[];
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeAuthState();
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

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      this.notification.error('Invalid email or password');
      return false;
    }

    this.isAuthenticated.set(true);
    this.currentUser.set(user);
    this.persistUserData(user);
    this.notification.success('Login successful!');
    this.router.navigate(['/']);
    return true;
  }

  signup(name: string, email: string, password: string, phone: string): boolean {
    if (this.users.some(u => u.email === email)) {
      this.notification.error('Email already exists');
      return false;
    }

    const newUser: User = {
      name,
      email,
      password,
      phone,
      profileImageUrl: 'assets/default-profile.png',
      favorites: []
    };

    this.users.push(newUser);
    return this.login(email, password);
  }

  logout(): void {
    this.clearAuthData();
    this.notification.info('You have been logged out');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
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
    this.currentUser.set({...user});
    this.updateProfile(user);
    this.notification.success('Added to favorites!');
  }

  removeFavoriteProperty(propertyId: string): void {
    const user = this.currentUser();
    if (!user) return;

    user.favorites = user.favorites.filter(id => id !== propertyId);
    this.currentUser.set({...user});
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
      this.currentUser.set({...user});
      this.persistUserData(user);
    }
    return true;
  }

  currentUserValue(): User | null {
    return this.currentUser();
  }
}