import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface PopDish { 
  id: number; 
  name: string; 
  price: string; 
  count: number; 
  imageUrl: string;   // ← remplace emoji
  bg?: string;        // gardé mais on peut le supprimer ou adapter
}

@Component({
  selector: 'app-popular-dishes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './popular-dishes.html',
  styleUrls: ['./popular-dishes.scss']
})
export class PopularDishesComponent {
  page     = signal(0);
  pageSize = 4;

  all: PopDish[] = [
    { id:1, name:'Poulet Braisé',           price:'3 500', count:8000, imageUrl:'/plats/poulet-braise.jpg' },
    { id:2, name:'Pro Burger',              price:'8 000', count:8000, imageUrl:'/plats/burger.jpg' },
    { id:3, name:'Pâtes Carbonara',         price:'5 000', count:8000, imageUrl:'/plats/pates-carbonara.jpeg' },
    { id:4, name:'Pizza Margherita',        price:'6 500', count:9200, imageUrl:'/plats/Pizza.jpg' },
    { id:5, name:'Sushi Mix',               price:'9 000', count:6500, imageUrl:'/plats/Sushi.jpg' },
    { id:6, name:'Thiéboudienne',           price:'4 000', count:7200, imageUrl:'/plats/thieboudienne.jpeg' },
    { id:7, name:'Buddha Bowl',             price:'4 500', count:5800, imageUrl:'/plats/buddha-bowl.jpg' },
    { id:8, name:'BBQ Ribs',                price:'10 000',count:9200, imageUrl:'/plats/bbq-ribs.jpg' }
  ];

  get visible(): PopDish[] { 
    return this.all.slice(this.page() * this.pageSize, (this.page() + 1) * this.pageSize); 
  }
  get canPrev() { return this.page() > 0; }
  get canNext() { return (this.page() + 1) * this.pageSize < this.all.length; }
  prev() { if (this.canPrev) this.page.update(v => v - 1); }
  next() { if (this.canNext) this.page.update(v => v + 1); }
}