import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Review {
  id: number;
  user: number;
  user_name: string;
  restaurant?: number;
  restaurant_name?: string;
  dish?: number;
  dish_name?: string;
  rating: number;
  comment: string;
  reply?: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reviews`;

  getRestaurantReviews(restaurantId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/restaurant/${restaurantId}/`);
  }

  getDishReviews(dishId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/dish/${dishId}/`);
  }

  createReview(review: { restaurant?: number; dish?: number; rating: number; comment: string }): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/create/`, review);
  }
  getAllApprovedReviews(): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/all/`);
}
getAllReviews(): Observable<Review[]> {
  return this.http.get<Review[]>(`${this.apiUrl}/all/`);
}
}