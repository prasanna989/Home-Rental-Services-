export interface Home {
  id: number;
  title: string;
  type: string;
  price: number;
  location: string;
  available: boolean;
  imageUrl: string;
  amenities: string[]; 
}