export interface Home {
  _id: string;
  title: string;
  type: string;
  price: number;
  rentPerDay: number;
  location: string;
  available: boolean;
  imageUrl: string;
  amenities: string[];
  cloudinaryId?: string;
}