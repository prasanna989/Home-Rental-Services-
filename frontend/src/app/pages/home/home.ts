import { Component, inject, ViewChild } from '@angular/core';
import { Header } from '../../components/header/header';
import { HomeList } from '../../components/home-list/home-list';
import { Footer } from '../../components/footer/footer';
import { Navbar } from '../../components/navbar/navbar';
import { SearchFilter } from '../../components/search-filter/search-filter';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { FilterService } from '../../services/filter.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Header, HomeList, Footer, HomeList],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
@ViewChild(Navbar) navbar!: Navbar;
  homeService = inject(HomeService);
  filterService = inject(FilterService);
  
  filteredHomes = toSignal(
    this.filterService.filters$.pipe(
      map(filters => this.homeService.getFilteredHomes(filters))
    ),
    { initialValue: this.homeService.getFilteredHomes(this.filterService.filters) }
  );

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
  bookHome(homeId: number) {
  const bookings = JSON.parse(localStorage.getItem('bookedHomes') || '[]');

  if (!bookings.includes(homeId)) {
    bookings.push(homeId);
    localStorage.setItem('bookedHomes', JSON.stringify(bookings));
  }

}

}