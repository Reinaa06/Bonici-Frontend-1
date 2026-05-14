export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  rating_count: number;
  is_available: boolean;
  prep_time: number;
}

export interface Restaurant_model {
  id: number;
  name: string;
  address: string;
  phone: string;
  imgUrl: string;
  isOpen: boolean;
  hours: string;
  distanceKm: number;
  rating: number;
  delivery_time: string;
}

export interface CartItem {
  dish_id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}