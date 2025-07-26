export interface FilterOptions {
  location: string;
  checkIn?: Date;
  checkOut?: Date;
  minPrice: number;
  maxPrice: number;
  propertyTypes: string[];
  amenities: string[];
}