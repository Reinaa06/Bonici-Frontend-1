import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';  // ← ajoute Router ici
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';
import { RestaurantService } from '../../services/restaurant.service';
import { ReviewService } from '../../services/review.service';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent, CartSidebarComponent],
  templateUrl: './restaurants.html',
  styleUrls: ['./restaurants.scss']
})
export class RestaurantsComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private reviewService = inject(ReviewService);
  private auth = inject(AuthService);
  private router = inject(Router);  // ← ajoute cette ligne

  restaurants = signal<any[]>([]);
  loading = signal(false);
  search = signal('');
  selectedRestaurantId = signal<number | null>(null);
  showReviewForm = signal(false);
  newRating = signal<number>(5);
  newComment = signal('');
  reviewSubmitted = signal(false);

  ngOnInit() {
    this.loadRestaurants();
  }

 loadRestaurants() {
  this.loading.set(true);
  this.restaurantService.getRestaurants().subscribe({
    next: (data) => {
      console.log('Données reçues :', data);
      const withSlug = data.map(r => ({
  ...r,
  slug: r.name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // enlève accents (è -> e)
    .replace(/\s+/g, '-')           // remplace espaces par -
    .replace(/[^a-z0-9-]/g, '')     // garde lettres, chiffres et tirets
    .replace(/-+/g, '-')            // évite doubles tirets
    .replace(/^-|-$/g, '')          // enlève tirets au début/fin
}));
      console.log('Avec slug :', withSlug);
      this.restaurants.set(withSlug);
      this.loading.set(false);
    },
    error: (err) => {
      console.error(err);
      this.loading.set(false);
    }
  });
}

  filteredRestaurants() {
    const term = this.search().toLowerCase();
    if (!term) return this.restaurants();
    return this.restaurants().filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.address.toLowerCase().includes(term) ||
      r.city.toLowerCase().includes(term)
    );
  }

  submitReview(restaurantId: number) {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.reviewService.createReview({
      restaurant: restaurantId,
      rating: this.newRating(),
      comment: this.newComment()
    }).subscribe({
      next: () => {
        this.reviewSubmitted.set(true);
        setTimeout(() => this.reviewSubmitted.set(false), 3000);
        this.newComment.set('');
        this.showReviewForm.set(false);
      },
      error: (err) => console.error(err)
    });
  }
}