import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';
import { CartService } from '../../services/cart';
import { MenuService, Dish, Category } from '../../services/menu-service';
import { environment } from '../../environments/environment';

interface DisplayDish extends Dish {
  imageUrl: string;
  rating: number;
  rating_count: number;
  category_slug: string;
  original_price?: number;  
  discount?: number;
}

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, CartSidebarComponent],
  templateUrl: './menus.html',
  styleUrls: ['./menus.scss']
})
export class MenusComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private menuService = inject(MenuService);
  cart = inject(CartService);

  searchQuery = signal('');
  activeCategory = signal('');
  maxPrice = signal(15000);
  sortBy = signal('popular');
  availableOnly = signal(false);
  gridView = signal(true);

  categories = signal<(Category & { slug: string })[]>([]);
  allDishes = signal<DisplayDish[]>([]);
  loading = signal(false);

  ngOnInit() {
    console.log('Paramètres de l’URL au chargement :', this.route.snapshot.queryParams);
    this.loadCategories();

    this.route.queryParams.subscribe(params => {
      if (params['search']) this.searchQuery.set(params['search']);
      if (params['category']) this.activeCategory.set(params['category']);

      const restaurantParam = params['restaurant'];
      if (restaurantParam && restaurantParam !== '') {
        this.loadRestaurantMenuBySlug(restaurantParam);
      } else {
        this.loadAllDishes();
      }
    });
  }

  loadCategories() {
    this.menuService.getCategories().subscribe({
      next: (data) => {
        const cats = data.map(c => ({
          ...c,
          slug: c.name.toLowerCase().replace(/\s+/g, '_')
        }));
        this.categories.set(cats);
      },
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  loadAllDishes() {
    this.loading.set(true);
    this.menuService.getDishes().subscribe({
      next: (data) => {
        const dishes: DisplayDish[] = data.map(d => ({
          ...d,
          imageUrl: d.image ? `${environment.mediaUrl}/${d.image}` : '/assets/default-dish.jpg',
          rating: 4.5,
          rating_count: 0,
          category_slug: d.category_name.toLowerCase()
        }));
        this.allDishes.set(dishes);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement plats', err);
        this.loading.set(false);
      }
    });
  }

loadRestaurantMenuBySlug(slug: string) {
  this.loading.set(true);
  this.menuService.getRestaurantMenuBySlug(slug).subscribe({
    next: (data: any[]) => {
      const dishes = data.map((item: any) => {
        let originalPrice = item.price;
        let discount = 0;
        let finalPrice = originalPrice;

        if (item.promotion && item.promotion.discount_percent) {
          discount = item.promotion.discount_percent;
          finalPrice = originalPrice * (1 - discount / 100);
        }

        return {
          id: item.dish,
          name: item.dish_name,
          description: item.dish_description,
          price: finalPrice,
          original_price: originalPrice,
          discount: discount,
          category: item.category_name,
          category_name: item.category_name,
          image: item.dish_image,
          is_available: item.is_available,
          is_daily_special: false,
          imageUrl: item.dish_image ? `${environment.mediaUrl}/${item.dish_image}` : '/assets/default-dish.jpg',
          rating: 4.5,
          rating_count: 0,
          category_slug: item.category_name?.toLowerCase().replace(/\s+/g, '_') || ''
        };
      });
      this.allDishes.set(dishes);
      this.loading.set(false);
    },
    error: (err) => {
      console.error('Erreur chargement menu du restaurant', err);
      this.loading.set(false);
    }
  });
}
  filtered = computed(() => {
    let items = [...this.allDishes()];
    const q = this.searchQuery().toLowerCase();
    if (q) items = items.filter(d => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
    if (this.activeCategory()) items = items.filter(d => d.category_slug === this.activeCategory());
    items = items.filter(d => d.price <= this.maxPrice());
    if (this.availableOnly()) items = items.filter(d => d.is_available);
    switch (this.sortBy()) {
      case 'price_asc': items.sort((a,b) => a.price - b.price); break;
      case 'price_desc': items.sort((a,b) => b.price - a.price); break;
      case 'rating': items.sort((a,b) => (b.rating||0) - (a.rating||0)); break;
      default: items.sort((a,b) => (b.rating_count||0) - (a.rating_count||0));
    }
    return items;
  });

  getCategoryName(slug: string) {
    const cat = this.categories().find(c => c.name.toLowerCase() === slug);
    return cat ? cat.name : slug;
  }

  addToCart(dish: DisplayDish) {
    if (!dish.is_available) return;
    this.cart.add({
      dish_id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      imageUrl: dish.imageUrl
    });
  }

  resetFilters() {
    this.searchQuery.set('');
    this.activeCategory.set('');
    this.maxPrice.set(15000);
    this.availableOnly.set(false);
    this.sortBy.set('popular');
  }
}