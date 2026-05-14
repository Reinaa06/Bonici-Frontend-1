import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface OrderItem {
  dish_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';
  restaurant_name: string;
  delivery_address: string;
  items: OrderItem[];
  total: number;
  created_at?: string;
  customer?: {
    name: string;
    phone: string;
  };
  delivery_driver_info?: {
    username: string;
    phone_number: string;
  };
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`; // Base URL seulement
  
  // 🔧 Méthode pour récupérer le token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ NOUVEAU: Récupérer toutes les commandes (pour le manager)
  getManagerOrders(): Observable<Order[]> {
    console.log('🔄 Chargement des commandes manager...');
    
    return this.http.get<Order[]>(`${this.apiUrl}/manager/orders/`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap({
        next: (orders) => {
          console.log(`✅ ${orders.length} commandes chargées`);
          console.log('📦 Commandes:', orders);
        },
        error: (error) => {
          console.error('❌ Erreur chargement commandes:', error);
          if (error.status === 401) {
            console.error('⛔ Non authentifié - Vérifiez le token');
          }
          if (error.status === 403) {
            console.error('⛔ Permission refusée - Rôle manager requis');
          }
        }
      }),
      catchError(this.handleError)
    );
  }

  // ✅ Récupérer les commandes d'un restaurant spécifique (pour le manager)
  getManagerRestaurantOrders(restaurantId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/manager/restaurants/${restaurantId}/orders/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ✅ Récupérer une commande par son ID (avec auth)
  getOrder(orderId: string | number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ✅ Annuler une commande
  cancelOrder(orderId: string | number): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/${orderId}/cancel/`, {}, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  // ✅ Mettre à jour le statut d'une commande (pour manager)
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/manager/orders/${orderId}/status/`, 
      { status },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ✅ Assigner un livreur à une commande
  assignDriver(orderId: number, driverId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/manager/orders/${orderId}/assign-driver/`,
      { driver_id: driverId },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // ✅ Gestion centralisée des erreurs
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Code ${error.status}: ${error.error?.detail || error.message}`;
    }
    
    console.error('OrderService Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}