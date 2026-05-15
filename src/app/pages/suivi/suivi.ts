import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';
import { AuthService } from '../../services/auth';
import { environment } from '../../environments/environment';

interface OrderSummary {
  id: number;
  status: string;
  total: number;
  created_at: string;
  restaurant_name: string;
}

interface OrderDetail extends OrderSummary {
  delivery_address: string;
  items: { dish_name: string; quantity: number; unit_price: number }[];
  delivery_driver_info?: { username: string; phone_number: string };
}

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, CartSidebarComponent],
  templateUrl: './suivi.html',
  styleUrls: ['./suivi.scss']
})
export class SuiviComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private auth = inject(AuthService);

  orders = signal<OrderSummary[]>([]);
  selectedOrder = signal<OrderDetail | null>(null);
  loading = signal(false);
  detailLoading = signal(false);
  error = signal('');
  private pollInterval: any;

  steps = [
    { status: 'pending', label: 'Reçue' },
    { status: 'confirmed', label: 'Confirmée' },
    { status: 'preparing', label: 'Préparation' },
    { status: 'ready', label: 'Prête' },
    { status: 'delivering', label: 'Livraison' },
    { status: 'delivered', label: 'Livrée' }
  ];

  statusLabels: Record<string, string> = {
    pending: 'En attente',
    confirmed: 'Confirmée',
    preparing: 'Préparation',
    ready: 'Prête',
    delivering: 'Livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    if (!this.auth.isLoggedIn()) return;
    this.loading.set(true);
    this.http.get<OrderSummary[]>(`${environment.apiUrl}/orders/my-orders/`).subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Impossible de charger vos commandes');
        this.loading.set(false);
      }
    });
  }

  selectOrder(orderId: number) {
    this.detailLoading.set(true);
    this.http.get<OrderDetail>(`${environment.apiUrl}/orders/${orderId}/`).subscribe({
      next: (detail) => {
        this.selectedOrder.set(detail);
        this.detailLoading.set(false);
        this.startPolling();
      },
      error: () => {
        this.error.set('Erreur chargement du détail');
        this.detailLoading.set(false);
      }
    });
  }

  refreshOrder() {
  if (!this.selectedOrder()) {
    console.warn('Aucune commande sélectionnée');
    return;
  }
  const id = this.selectedOrder()!.id;
  console.log('Rafraîchissement de la commande', id);
  this.http.get<OrderDetail>(`${environment.apiUrl}/orders/${id}/`).subscribe({
    next: (detail) => {
      console.log('Nouveau statut reçu :', detail.status);
      this.selectedOrder.set(detail);
    },
    error: (err) => {
      console.error('Erreur rafraîchissement', err);
    }
  });
}
  startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      if (this.selectedOrder()) {
        this.refreshOrder();
      }
    }, 10000); // toutes les 10 secondes
  }

  goBack() {
    this.selectedOrder.set(null);
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  get itemsSummary(): string {
    if (!this.selectedOrder()?.items) return '';
    return this.selectedOrder()!.items.map(i => `${i.dish_name} x${i.quantity}`).join(', ');
  }

  isDone(stepStatus: string): boolean {
    if (!this.selectedOrder()) return false;
    const orderStatus = this.selectedOrder()!.status;
    const statusOrder = this.steps.map(s => s.status);
    const currentIndex = statusOrder.indexOf(orderStatus);
    const stepIndex = statusOrder.indexOf(stepStatus);
    return currentIndex >= stepIndex;
  }

  isCurrent(stepStatus: string): boolean {
    return this.selectedOrder()?.status === stepStatus;
  }

  canCancel(): boolean {
    const status = this.selectedOrder()?.status;
    return status === 'pending' || status === 'confirmed' || status === 'preparing';
  }

  cancelOrder() {
    if (!confirm('Annuler cette commande ?')) return;
    this.http.post(`${environment.apiUrl}/orders/${this.selectedOrder()!.id}/cancel/`, {}).subscribe({
      next: () => {
        this.loadOrders();
        this.selectedOrder.set(null);
        if (this.pollInterval) clearInterval(this.pollInterval);
      },
      error: () => alert('Impossible d\'annuler')
    });
  }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }
}