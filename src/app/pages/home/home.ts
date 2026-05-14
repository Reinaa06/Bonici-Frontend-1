import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { CategoriesComponent } from '../../components/categories/categories';
import { PopularDishesComponent } from '../../components/popular-dishes/popular-dishes';
//import { RestaurantsComponent } from '../../components/restaurants/restaurants';
import { HowItWorksComponent } from '../../components/how-it-works/how-it-works';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { CtaComponent } from '../../components/cta/cta';
import { FooterComponent } from '../../components/footer/footer';
import { CartSidebarComponent } from '../../components/cart-sidebar/cart-sidebar';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    CategoriesComponent,
    PopularDishesComponent,
    //RestaurantsComponent,
    HowItWorksComponent,
    TestimonialsComponent,
    CtaComponent,
    FooterComponent,
    CartSidebarComponent,
  ],
  template: `
    <app-navbar />
    <app-cart-sidebar />
    <main>
      <app-hero />
      <app-categories />
      <app-popular-dishes />
       
      <app-how-it-works />
      <app-testimonials />
      <app-cta />
    </main>
    <app-footer />
  `
})
export class HomeComponent {}