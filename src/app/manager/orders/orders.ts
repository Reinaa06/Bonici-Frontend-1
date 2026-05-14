import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManagerService } from '../../services/manager.service';

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  customer_name: string;
  delivery_address: string;
  delivery_driver?: { id: number; username: string } | null;
}

interface Driver {
  id: number;
  username: string;
  phone_number: string;
}

@Component({
  selector: 'app-manager-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-title">
        <span class="page-title-icon">⬢</span>
        Gestion des commandes
      </div>

      <div class="filters-bar">
        <select class="filter-select" [(ngModel)]="statusFilter" (change)="loadOrders()">
          <option value="">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmée</option>
          <option value="preparing">En préparation</option>
          <option value="ready">Prête</option>
          <option value="delivering">En livraison</option>
          <option value="delivered">Livrée</option>
        </select>
        <button class="btn-refresh" (click)="loadOrders()" [disabled]="loading()">
          🔄 Rafraîchir
        </button>
      </div>

      @if (loading()) {
        <div class="loader">Chargement...</div>
      } @else {
        <div class="orders-list">
          @for (order of filteredOrders(); track order.id) {
            <div class="order-card">
              <div class="order-header">
                <strong>Commande #{{ order.id }}</strong>
                <span class="badge" [ngClass]="{
                  'badge-pending': order.status === 'pending',
                  'badge-confirmed': order.status === 'confirmed',
                  'badge-preparing': order.status === 'preparing',
                  'badge-ready': order.status === 'ready',
                  'badge-delivering': order.status === 'delivering',
                  'badge-delivered': order.status === 'delivered'
                }">{{ order.status }}</span>
              </div>
              <div class="order-body">
                <p><strong>Client :</strong> {{ order.customer_name }}</p>
                <p><strong>Adresse :</strong> {{ order.delivery_address || 'Non renseignée' }}</p>
                <p><strong>Total :</strong> {{ order.total | number }} FCFA</p>
                <p><strong>Date :</strong> {{ order.created_at | date:'dd/MM/yyyy HH:mm' }}</p>
                <p><strong>Livreur :</strong> {{ order.delivery_driver?.username || 'Non assigné' }}</p>
              </div>
              <div class="order-actions">
                <select class="status-select" [(ngModel)]="order.status" (change)="updateStatus(order)">
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="preparing">En préparation</option>
                  <option value="ready">Prête</option>
                  <option value="delivering">En livraison</option>
                  <option value="delivered">Livrée</option>
                </select>

                <select class="driver-select" [(ngModel)]="selectedDriver[order.id]" (change)="assignDriver(order)">
                  <option [ngValue]="null">-- Assigner un livreur --</option>
                  @for (driver of drivers(); track driver.id) {
                    <option [ngValue]="driver.id">{{ driver.username }}</option>
                  }
                </select>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <span class="empty-state-icon">⌁</span>
              <div class="empty-state-text">Aucune commande trouvée</div>
              <div class="empty-state-subtext">Les commandes apparaîtront ici</div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .page { padding: 2rem; min-height: 100vh; background: #F5F5F5; }
    .page-title { font-size: 24px; font-weight: 600; color: #1A1A1A; margin-bottom: 2rem; display: flex; align-items: center; gap: 10px; }
    .page-title-icon { color: #C0392B; }
    .filters-bar { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; }
    .filter-select { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #E0E0E0; background: white; min-width: 180px; cursor: pointer; }
    .btn-refresh { padding: 0.5rem 1rem; border-radius: 8px; background: #C0392B; color: white; border: none; cursor: pointer; transition: background 0.2s; }
    .btn-refresh:hover { background: #922B21; }
    .btn-refresh:disabled { opacity: 0.6; cursor: not-allowed; }
    .loader { text-align: center; padding: 2rem; color: #C0392B; }
    .orders-list { display: flex; flex-direction: column; gap: 1rem; }
    .order-card { background: white; border-radius: 14px; padding: 1rem; border: 1px solid #E0E0E0; transition: box-shadow 0.2s; }
    .order-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid #E0E0E0; }
    .badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 20px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; }
    .badge-pending { background: #FEF9E7; color: #B7770D; }
    .badge-confirmed { background: #E3F2FD; color: #1565C0; }
    .badge-preparing { background: #E3F2FD; color: #1565C0; }
    .badge-ready { background: #E3F2FD; color: #1565C0; }
    .badge-delivering { background: #E8F5E9; color: #2E7D32; }
    .badge-delivered { background: #E8F5E9; color: #1B5E20; }
    .order-body p { margin: 0.3rem 0; font-size: 0.85rem; color: #555; }
    .order-actions { margin-top: 0.8rem; display: flex; gap: 1rem; }
    .status-select, .driver-select { flex: 1; padding: 0.5rem; border-radius: 8px; border: 1px solid #E0E0E0; background: white; cursor: pointer; }
    .empty-state { text-align: center; padding: 3rem 1rem; }
    .empty-state-icon { font-size: 40px; display: block; margin-bottom: 10px; color: #E0E0E0; }
    .empty-state-text { font-size: 15px; color: #888; }
    .empty-state-subtext { font-size: 12px; color: #BBBBBB; margin-top: 4px; }
  `]
})
export class ManagerOrdersComponent implements OnInit {
  private manager = inject(ManagerService);
  allOrders = signal<Order[]>([]);
  drivers = signal<Driver[]>([]);
  loading = signal(false);
  statusFilter = signal('');
  selectedDriver: { [key: number]: number | null } = {};

  ngOnInit() {
  this.loadOrders();
  this.loadDrivers();
  // Rafraîchir automatiquement toutes les 10 secondes
  // setInterval(() => {
  //   this.loadOrders();
  // }, 10000);
}

  loadOrders() {
    this.loading.set(true);
    this.manager.getOrders().subscribe({
      next: (data) => {
        this.allOrders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  loadDrivers() {
    this.manager.getAvailableDrivers().subscribe({
      next: (data) => this.drivers.set(data),
      error: (err) => console.error(err)
    });
  }

  filteredOrders() {
    const filter = this.statusFilter();
    if (!filter) return this.allOrders();
    return this.allOrders().filter(order => order.status === filter);
  }

  updateStatus(order: any) {
  this.manager.updateOrderStatus(order.id, order.status).subscribe({
    next: () => {
      console.log('Statut mis à jour avec succès');
      this.loadOrders(); // Recharge la liste des commandes
    },
    error: (err) => console.error('Erreur mise à jour statut', err)
  });
}
  

  assignDriver(order: Order) {
    const driverId = this.selectedDriver[order.id];
    if (!driverId) return;
    this.manager.assignDriver(order.id, driverId).subscribe({
      next: () => {
        console.log('Livreur assigné');
        this.loadOrders();
      },
      error: (err) => console.error(err)
    });
  }
}