import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { ApiResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  getDishes(params?: { category?: string; is_popular?: boolean; search?: string; ordering?: string }): Observable<ApiResponse<any>> {
    let p = new HttpParams();
    if (params?.category)   p = p.set('category',   params.category);
    if (params?.is_popular) p = p.set('is_popular',  'true');
    if (params?.search)     p = p.set('search',      params.search);
    if (params?.ordering)   p = p.set('ordering',    params.ordering);
    return this.http.get<ApiResponse<any>>(`${this.base}/menus/dishes/`, { params: p });
  }

  getRestaurants(search?: string): Observable<ApiResponse<any>> {
    const p = search ? new HttpParams().set('search', search) : new HttpParams();
    return this.http.get<ApiResponse<any>>(`${this.base}/restaurants/`, { params: p });
  }

  getTestimonials(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.base}/reviews/testimonials/`);
  }

  placeOrder(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/orders/`, payload);
  }

  getOrder(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}/orders/${id}/`);
  }

  cancelOrder(id: string): Observable<any> {
    return this.http.post(`${this.base}/orders/${id}/cancel/`, {});
  }
}