
import { Component, Input, OnInit, inject } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home-list.html',
  styleUrls: ['./home-list.css']  
})
export class HomeList implements OnInit {
  @Input() homes: Home[] = [];
  authService = inject(AuthService);

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    if (!this.homes.length) {
      this.homes = this.homeService.getAvailableHomes();
    }

    
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    this.homes.forEach(home => {
      home.isFavorite = favs.some((f: Home) => f.id === home.id);
    });
  }


  trackByHomeId(index: number, home: Home): number {
    return home.id;
  }

  
  toggleFavorite(home: Home): void {
    home.isFavorite = !home.isFavorite;
    let favorites: Home[] = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (home.isFavorite) {
      favorites.push(home);
    } else {
      favorites = favorites.filter((h: Home) => h.id !== home.id);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
