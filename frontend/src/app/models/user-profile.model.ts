export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: Date;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FavoriteProperty {
  id: string;
  propertyId: string;
  userId: string;
  addedAt: Date;
}