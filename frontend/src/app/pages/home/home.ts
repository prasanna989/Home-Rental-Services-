import { Component, inject, ViewChild, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { FilterService } from '../../services/filter.service';
import { map, switchMap } from 'rxjs/operators';
import { HomeList } from '../../components/home-list/home-list';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { toSignal } from '@angular/core/rxjs-interop';
import { Home as HomeModel } from '../../models/home.model';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Header, HomeList, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomePage {
  @ViewChild(Navbar) navbar!: Navbar;
  homeService = inject(HomeService);
  filterService = inject(FilterService);
  
  filteredHomes = toSignal(
    this.filterService.filters$.pipe(
      switchMap(filters => this.homeService.getFilteredHomes(filters))
    ),
    { initialValue: [] as HomeModel[] }
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  filterByType(type: string) {
    this.filterService.updateFilters({
      propertyTypes: [type]
    });
  }

  resetFilters() {
    this.filterService.updateFilters({
      location: '',
      minPrice: 0,
      maxPrice: 10000,
      propertyTypes: [],
      amenities: []
    });
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