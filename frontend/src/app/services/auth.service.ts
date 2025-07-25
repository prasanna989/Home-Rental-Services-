import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

interface User {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date | string;
  profileImageUrl?: string;
  favorites?: number[]; // Array of property IDs
}

interface PropertyListing {
  id: number;
  title: string;
  location: string;
  owner: string;
  postedAt: Date;
  status: string; // 'Active', 'Flagged', 'Pending', etc.
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
      favorites: [1, 2] 
    }
  ];

  private propertyListings: PropertyListing[] = [
    {
      id: 1,
      title: '2BHK in Bangalore',
      location: 'Whitefield',
      owner: 'user@example.com',
      postedAt: new Date('2025-07-20T09:30:00'),
      status: 'Active'
    },
    {
      id: 2,
      title: 'Studio Apartment',
      location: 'Hyderabad',
      owner: 'user@example.com',
      postedAt: new Date('2025-07-19T17:00:00'),
      status: 'Flagged'
    },
    {
      id: 3,
      title: '3BHK Villa',
      location: 'Chennai',
      owner: 'user@example.com',
      postedAt: new Date('2025-07-18T14:45:00'),
      status: 'Pending'
    }
  ];

  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

  // Existing methods
  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
      this.notification.success('Login successful!');
      this.router.navigate(['/']);
      return true;
    }
    this.notification.error('Invalid email or password');
    return false;
  }

  signup(name: string, email: string, password: string, phone: string): boolean {
    const userExists = this.users.some(u => u.email === email);
    if (userExists) {
      this.notification.error('Signup failed. Email already exists.');
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
    this.login(email, password);
    return true;
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.notification.info('You have been logged out.');
    this.router.navigate(['/login']);
  }

  getAllPropertyListings(): PropertyListing[] {
    return this.propertyListings;
  }

  // New methods for profile features
  updateProfile(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
      // Preserve password if not being updated
      if (!updatedUser.password) {
        updatedUser.password = this.users[index].password;
      }
      
      this.users[index] = updatedUser;
      this.currentUser.set(updatedUser);
      this.notification.success('Profile updated successfully!');
      return true;
    }
    return false;
  }

  addFavoriteProperty(propertyId: number): void {
    const user = this.currentUser();
    if (user) {
      user.favorites = user.favorites || [];
      if (!user.favorites.includes(propertyId)) {
        user.favorites.push(propertyId);
        this.currentUser.set({...user});
        this.updateProfile(user);
        this.notification.success('Added to favorites!');
      }
    }
  }

  removeFavoriteProperty(propertyId: number): void {
    const user = this.currentUser();
    if (user?.favorites) {
      user.favorites = user.favorites.filter(id => id !== propertyId);
      this.currentUser.set({...user});
      this.updateProfile(user);
      this.notification.info('Removed from favorites');
    }
  }

  getPropertyById(id: number): PropertyListing | undefined {
    return this.propertyListings.find(p => p.id === id);
  }

  updateProfileImage(userEmail: string, imageUrl: string): boolean {
    const user = this.users.find(u => u.email === userEmail);
    if (user) {
      user.profileImageUrl = imageUrl;
      if (this.currentUser()?.email === userEmail) {
        this.currentUser.set({...user});
      }
      return true;
    }
    return false;
  }
}