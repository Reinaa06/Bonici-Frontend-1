import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-sidebar.html',
  styleUrls: ['./cart-sidebar.scss']
})
export class CartSidebarComponent {
  cart = inject(CartService);
  private router = inject(Router);

  checkout() { 
    this.cart.close(); 
    this.router.navigate(['/cart']); 
  }
}