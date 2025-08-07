import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, Footer],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class About {
  showSearch = false;

  navItems = [
    { name: 'Home', link: '/home' },
    { name: 'Browse Homes', link: '/browse' },
    { name: 'About', link: '/about' },
    { name: 'Contact', link: '/contact' },
    { name: 'Admin', link: '/admin' },
  ];

  constructor(public authService: AuthService) {}

  toggleSearch() {
    this.showSearch = !this.showSearch;
  }

  logout() {
    this.authService.logout();
  }
}
