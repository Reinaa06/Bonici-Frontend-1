import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { OrderService, Order } from '../../services/order-service';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';

type Status = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

@Component({
  selector: 'app-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, CartSidebarComponent],
  templateUrl: './suivi.html',
  styleUrls: ['./suivi.scss']
})
export class SuiviComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  orderId = signal('');
  loading = signal(false);
  error = signal('');
  order = signal<Order | null>(null);
  private pollInterval: any;

  steps = [
    { status: 'pending' as const,    label: 'Reçue',          icon: '📋' },
    { status: 'confirmed' as const,  label: 'Confirmée',      icon: '✅' },
    { status: 'preparing' as const,  label: 'En préparation', icon: '👨‍🍳' },
    { status: 'ready' as const,      label: 'Prête',          icon: '📦' },
    { status: 'delivering' as const, label: 'En livraison',   icon: '🛵' },
    { status: 'delivered' as const,  label: 'Livrée',         icon: '🏠' },
  ];

  statusOrder: Status[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered'];
  statusLabels: Record<Status, string> = {
    pending:   'Commande reçue',
    confirmed: 'Confirmée',
    preparing: 'En préparation',
    ready:     'Prête',
    delivering:'En livraison',
    delivered: 'Livrée',
    cancelled: 'Annulée'
  };

  ngOnInit() {
    this.route.queryParams.subscribe(p => {
      if (p['id']) {
        this.orderId.set(p['id']);
        this.loadOrder();
      }
    });
  }

  loadOrder() {
    const id = this.orderId();
    if (!id) return;

    this.loading.set(true);
    this.error.set('');
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        this.order.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Commande introuvable ou erreur serveur.');
        this.loading.set(false);
      }
    });
  }

  cancelOrder() {
    if (!confirm('Confirmer l\'annulation ?')) return;
    this.orderService.cancelOrder(this.orderId()).subscribe({
      next: () => this.loadOrder(),
      error: () => alert('Impossible d\'annuler cette commande.')
    });
  }

  get itemsSummary(): string {
    if (!this.order()) return '';
    return this.order()!.items.map(i => `${i.dish_name} x${i.quantity}`).join(', ');
  }

  stepIndex(s: Status) { return this.statusOrder.indexOf(s); }
  isDone(s: Status)    { return this.order() ? this.stepIndex(this.order()!.status) > this.stepIndex(s) : false; }
  isCurrent(s: Status) { return this.order()?.status === s; }
  canCancel()          { return ['pending', 'confirmed', 'preparing'].includes(this.order()?.status ?? ''); }

  ngOnDestroy() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }
}