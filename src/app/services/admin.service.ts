import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;  // ← corrigé : apiUrl au lieu de baseUrl

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/`);
  }
  getRestaurants(): Observable<any> { return this.http.get(`${this.apiUrl}/restaurants/`); }
  createRestaurant(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/restaurants/`, data); }
  updateRestaurant(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/restaurants/${id}/`, data); }
  deleteRestaurant(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/restaurants/${id}/`); }

  getCategories(): Observable<any> { return this.http.get(`${this.apiUrl}/categories/`); }
  createCategory(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/categories/`, data); }
  updateCategory(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/categories/${id}/`, data); }
  deleteCategory(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/categories/${id}/`); }

  getDishes(): Observable<any> { return this.http.get(`${this.apiUrl}/dishes/`); }
  createDish(data: FormData): Observable<any> { return this.http.post(`${this.apiUrl}/dishes/`, data); }
  updateDish(id: number, data: FormData): Observable<any> { return this.http.patch(`${this.apiUrl}/dishes/${id}/`, data); }
  deleteDish(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/dishes/${id}/`); }

  getTables(): Observable<any> { return this.http.get(`${this.apiUrl}/tables/`); }
  createTable(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/tables/`, data); }
  updateTable(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/tables/${id}/`, data); }
  deleteTable(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/tables/${id}/`); }
  generateQR(tableId: number): Observable<any> { return this.http.post(`${this.apiUrl}/tables/${tableId}/generate-qr/`, {}); }

  getPromotions(): Observable<any> { return this.http.get(`${this.apiUrl}/promotions/`); }
  createPromotion(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/promotions/`, data); }
  updatePromotion(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/promotions/${id}/`, data); }
  deletePromotion(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/promotions/${id}/`); }

  // ========== NOUVELLES MÉTHODES POUR RESTAURANT DISH ==========
  getRestaurantDishes(restaurantId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant-dishes/?restaurant_id=${restaurantId}`);
  }

  createRestaurantDish(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/restaurant-dishes/`, data);
  }

  updateRestaurantDish(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/restaurant-dishes/${id}/`, data);
  }

  deleteRestaurantDish(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/restaurant-dishes/${id}/`);
  }
  
}
