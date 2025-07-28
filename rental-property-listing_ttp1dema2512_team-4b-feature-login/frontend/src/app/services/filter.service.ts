// filter.service.ts
import { Injectable, signal } from '@angular/core';
import { FilterOptions } from '../models/filter-options.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private _filters = signal<FilterOptions>({
    location: '',
    minPrice: 0,
    maxPrice: 10000,
    propertyTypes: [],
    amenities: []
  });

  // This is a getter property, not a function
  get filters() {
    return this._filters();
  }

  filters$ = new BehaviorSubject<FilterOptions>(this._filters());

  updateFilters(newFilters: Partial<FilterOptions>) {
    this._filters.update(current => {
      const updated = { ...current, ...newFilters };
      this.filters$.next(updated);
      return updated;
    });
  }
}