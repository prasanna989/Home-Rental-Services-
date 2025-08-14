import { Component, inject, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Home as HomeModel } from '../../models/home.model';
import { HomeList } from '../../components/home-list/home-list';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, HomeList, Footer, Navbar],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomePage {
  @ViewChild(Navbar) navbar!: Navbar;

  homeService = inject(HomeService);
  router = inject(Router);

  allHomes: HomeModel[] = [];
  filteredHomes: HomeModel[] = [];

  minPrice = 0;
  maxPrice = 10000;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    // Load homes once
    this.homeService.getAvailableHomes().subscribe(homes => {
      this.allHomes = homes;
      this.filteredHomes = [...homes];
      this.homeService.homesCache = this.filteredHomes; // store for Browse page
    });
  }

  applyFilters() {
    this.filteredHomes = this.allHomes.filter(
      home => home.price >= this.minPrice && home.price <= this.maxPrice
    );
    this.homeService.homesCache = this.filteredHomes;
  }

  filterByType(type: string) {
    this.filteredHomes = this.allHomes.filter(
      home =>
        home.type === type &&
        home.price >= this.minPrice &&
        home.price <= this.maxPrice
    );
    this.homeService.homesCache = this.filteredHomes;
  }

  resetFilters() {
    this.minPrice = 0;
    this.maxPrice = 10000;
    this.filteredHomes = [...this.allHomes];
    this.homeService.homesCache = this.filteredHomes;
  }

  navigateToBrowseHomes() {
    this.router.navigate(['/browse-home']);
  }

  bookHome(homeId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const bookings = JSON.parse(localStorage.getItem('bookedHomes') || '[]');
      if (!bookings.includes(homeId)) {
        bookings.push(homeId);
        localStorage.setItem('bookedHomes', JSON.stringify(bookings));
      }
    }
  }
}
