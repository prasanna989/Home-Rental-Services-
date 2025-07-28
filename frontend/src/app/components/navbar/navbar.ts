import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { SearchFilter } from '../search-filter/search-filter';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, SearchFilter],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  authService = inject(AuthService);
  showSearch = false;

  navItems = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
    { name: 'Admin', link: '/admin' },
  ];

  logout() {
    this.authService.logout();
  }
  toggleSearch() {
    this.showSearch = !this.showSearch;
  }
}
