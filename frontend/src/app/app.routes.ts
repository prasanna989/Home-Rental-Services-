import { Routes } from '@angular/router';
import { About } from './pages/about/about';
import { Login } from './pages/auth/login/login';
import { Signup } from './pages/auth/signup/signup';
import { AuthGuard } from './services/auth-guard.service';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { UserListComponent } from './pages/user-list.component/user-list.component';
import { Contact } from './pages/contact/contact';
import { BrowseHome } from './pages/browse-home/browse-home';
import { HomePage } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Home Rental Service' },
  { path: 'about', component: About, title: 'About Us' },
  { path: 'login', component: Login, title: 'Login' },
  { path: 'signup', component: Signup, title: 'Create Account' },
  { path: 'users-list', component: UserListComponent, title: 'User List' },
  { path: 'contact', component: Contact, title: 'Contact Us' },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['owner'] },
    title: 'Admin Dashboard'
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [AuthGuard],
    title: 'Your Profile'
  },
  {
    path: 'book/:id',
    loadComponent: () => import('./pages/book-home/book-home').then(m => m.BookHome),
    canActivate: [AuthGuard],
    title: 'Book Home'
  },
  {
    path: 'browse-home',
    loadComponent: () => import('./pages/browse-home/browse-home').then(m => m.BrowseHome),
    title: 'Browse Home'
  },
  {
    path: 'property/:id',
    loadComponent: () => import('./pages/property-details/property-details').then(m => m.PropertyDetails),
    title: 'Property Details'
  }, 
  { path: 'home', component: HomePage, title: 'Home Rental Service' },
  { path: '**', redirectTo: '', title: 'Not Found' }
];
