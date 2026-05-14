import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { RestaurantService, Restaurant } from '../../services/restaurant.service';
import { environment } from '../../environments/environment';
//import { RestaurantsComponent } from '../../components/restaurants/restaurants';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, CartSidebarComponent],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartPageComponent implements OnInit {
  cart = inject(CartService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private auth = inject(AuthService);
  private restaurantService = inject(RestaurantService);

  mode = signal<'delivery' | 'takeaway'>('delivery');
  deliveryAddress = signal('');
  paymentMethod = signal('cash');
  loading = signal(false);
  success = signal(false);
  error = signal('');

  restaurants = signal<Restaurant[]>([]);
  selectedRestaurantId = signal<number | null>(null);

  deliveryFee = computed(() => this.mode() === 'delivery' ? 500 : 0);
  grandTotal = computed(() => this.cart.total() + this.deliveryFee());

  ngOnInit() {
    this.loadRestaurants();
  }
loadRestaurants() {
  this.restaurantService.getRestaurants().subscribe({
    next: (data) => {
      console.log('Restaurants chargés :', data);
      this.restaurants.set(data);
      if (data.length) this.selectedRestaurantId.set(data[0].id);
    },
    error: (err) => console.error(err)
  });
}

 

  placeOrder() {
  console.log('1. placeOrder() appelée');

  if (!this.auth.isLoggedIn()) {
    console.log('2. Utilisateur non connecté, redirection vers login');
    this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
    return;
  }

  if (this.cart.getItems().length === 0) {
    console.log('2. Panier vide');
    this.error.set('Votre panier est vide.');
    return;
  }

  if (!this.selectedRestaurantId()) {
    console.log('2. Aucun restaurant sélectionné');
    this.error.set('Veuillez sélectionner un restaurant.');
    return;
  }

  if (this.mode() === 'delivery' && !this.deliveryAddress()) {
    alert('Veuillez entrer votre adresse de livraison');
    return;
  }

  this.loading.set(true);
  this.error.set('');

  const items = this.cart.getItems().map(item => ({
    dish_id: item.dish_id,
    quantity: item.quantity,
    selected_options: []
  }));

  const orderData = {
    restaurant_id: this.selectedRestaurantId(),
    delivery_mode: this.mode(),
    delivery_address: this.deliveryAddress(),
    payment_method: this.paymentMethod(),
    notes: '',
    items: items
  };

  console.log('3. Envoi de la commande', orderData);

  this.http.post(`${environment.apiUrl}/orders/create/`, orderData).subscribe({
    next: (res: any) => {
      console.log('4. Commande créée avec succès', res);
      this.loading.set(false);
      this.success.set(true);
      this.cart.clear();
      const orderId = res.id;
      if (orderId) {
        console.log('5. Redirection vers /suivi avec id', orderId);
        this.router.navigate(['/suivi'], { queryParams: { id: orderId } });
      } else {
        console.error('Réponse sans ID', res);
      }
    },
    error: (err: any) => {
      console.error('6. Erreur commande', err);
      this.loading.set(false);
      if (err.error) console.error('Détail:', err.error);
      this.error.set(err.error?.error || err.error?.detail || 'Erreur lors de la commande');
    }
  });
}
  handleImageError(event: any) {
    event.target.src = 'https://placehold.co/400x300?text=Image';
  }
}