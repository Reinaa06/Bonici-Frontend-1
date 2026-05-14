import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/manager`;

  getStats(): Observable<any> { return this.http.get(`${this.apiUrl}/stats/`); }
  getOrders(): Observable<any> { return this.http.get(`${this.apiUrl}/orders/`); }
  updateOrderStatus(id: number, status: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/orders/${id}/`, { status });
}
  assignDriver(orderId: number, driverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/assign-driver/`, { driver_id: driverId });
  }
  getAvailableDrivers(): Observable<any> { return this.http.get(`${this.apiUrl}/drivers/`); }
}