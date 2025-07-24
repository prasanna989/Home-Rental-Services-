import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service'; // adjust path if needed

interface User {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    { email: 'test@example.com', password: 'password123', name: 'Test User' }
  ];
  isAuthenticated = signal(false);
  currentUser = signal<User | null>(null);

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {}

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

  signup(name: string, email: string, password: string): boolean {
    const userExists = this.users.some(u => u.email === email);
    if (userExists) {
      this.notification.error('Signup failed. Email already exists.');
      return false;
    }

    this.users.push({ name, email, password });
    this.notification.success('Signup successful! You are now logged in.');
    // this.login(email, password);
    return true;
  }

  logout() {
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.notification.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
