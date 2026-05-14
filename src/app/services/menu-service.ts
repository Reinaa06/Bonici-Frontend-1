import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Category {
  id: number;
  name: string;
  image: string | null;
  order: number;
  is_active: boolean;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  category_name: string;
  image: string | null;
  is_available: boolean;
  
  is_daily_special: boolean;
  // champs additionnels pour l’affichage (non venus de l’API)
  imageUrl?: string;
  rating?: number;
  rating_count?: number;
  
}

@Injectable({ providedIn: 'root' })
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/menus`;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories/`);
  }

  getDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(`${this.apiUrl}/dishes/`);
  }
  getRestaurantMenu(restaurantId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/menus/restaurant/${restaurantId}/dishes/`);
}
getRestaurantMenuBySlug(slug: string): Observable<any[]> {
  // Supprime le "/menus" ici car apiUrl contient déjà "/menus"
  return this.http.get<any[]>(`${this.apiUrl}/restaurant/${slug}/dishes/`);
}
}