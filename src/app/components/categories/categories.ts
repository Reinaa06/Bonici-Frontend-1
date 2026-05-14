import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

interface DishItem { name: string; price: string; imageUrl: string; }  // ← imageUrl au lieu de img

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class CategoriesComponent {
  private router = inject(Router);
  activeSlug     = signal('africain');

  categories = [
    { name: 'Africain',   slug: 'africain' },
    { name: 'Européen',   slug: 'europeen'},
    { name: 'Asiatique',  slug: 'asiatique'},
    { name: 'Américain',  slug: 'americain'},
    { name: 'Végétarien', slug: 'vegetarien'},
  ];

  dishMap: Record<string, DishItem[]> = {
    africain:   [
      { name: 'Ayimolou',        price: '1 500', imageUrl: '/plats/ayimolou.jpeg' },
      { name: 'Poulet Braisé',   price: '3 500', imageUrl: '/plats/poulet-braise.jpg' },
      { name: 'Fufu & Sauce',    price: '2 000', imageUrl: '/plats/fufu-sauce-graine.jpeg' },
      { name: 'Thiéboudienne',   price: '4 000', imageUrl: '/plats/thieboudienne.jpeg' }
    ],
    europeen:   [
      { name: 'Steak Frites',     price: '7 500', imageUrl: '/plats/steak-frites.jpg' },
      { name: 'Pâtes Carbonara',  price: '5 000', imageUrl: '/plats/pates-carbonara.jpeg' },
      { name: 'Croque Monsieur',  price: '3 000', imageUrl: '/plats/croque-monsieur.jpg' },
      { name: 'Quiche Lorraine',  price: '4 500', imageUrl: '/plats/quiche-lorraine.jpg' }
    ],
    asiatique:  [
      { name: 'Sushi Mix',   price: '9 000', imageUrl: '/plats/Sushi.jpg' },
      { name: 'Ramen',       price: '5 500', imageUrl: '/plats/ramen.jpg' },
      { name: 'Pad Thaï',    price: '6 000', imageUrl: '/plats/pad-thai.jpg' },
      { name: 'Dim Sum',     price: '4 000', imageUrl: '/plats/dim-sum.jpg' }
    ],
    americain:  [
      { name: 'Pro Burger',  price: '8 000', imageUrl: '/plats/burger.jpg' },
      { name: 'Hot Dog',     price: '3 500', imageUrl: '/plats/hot-dog.jpg' },
      { name: 'Frites XXL',  price: '2 000', imageUrl: '/plats/frites-xxl.jpg' },
      { name: 'BBQ Ribs',    price: '10 000', imageUrl: '/plats/bbq-ribs.jpg' }
    ],
    vegetarien: [
      { name: 'Buddha Bowl',    price: '4 500', imageUrl: '/plats/buddha-bowl.jpg' },
      { name: 'Falafels',       price: '3 000', imageUrl: '/plats/falafels.jpg' },
      { name: 'Pizza Végétale',     price: '6 500', imageUrl: '/plats/Pizza.jpg' },
      { name: 'Wrap Légumes',   price: '3 500', imageUrl: '/plats/wrap-legumes.jpg' }
    ]
  };

  get dishes(): DishItem[] { return this.dishMap[this.activeSlug()] ?? []; }
  setActive(slug: string) { this.activeSlug.set(slug); }
}