import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
  name?: string;
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
    { email: 'test@example.com', password: 'password123', name: 'Test User' }
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

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.isAuthenticated.set(true);
      this.currentUser.set(user);
      this.router.navigate(['/']);
      return true;
    }
    return false;
  }

  signup(name: string, email: string, password: string): boolean {
    const userExists = this.users.some(u => u.email === email);
    if (userExists) return false;

    this.users.push({ name, email, password });
    this.login(email, password);
    return true;
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
  getAllPropertyListings(): PropertyListing[] {
    return this.propertyListings;
  }
}