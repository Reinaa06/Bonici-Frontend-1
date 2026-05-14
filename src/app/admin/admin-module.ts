import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing-module';
import { DashboardComponent } from './dashboard/dashboard';
import { RestaurantsComponent } from './restaurants/restaurants';
import { CategoriesComponent } from './categories/categories';
import { DishesComponent } from './dishes/dishes';
import { TablesComponent } from './tables/tables';
import { PromotionsComponent } from './promotions/promotions';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardComponent,
    RestaurantsComponent,
    CategoriesComponent,
    DishesComponent,
    TablesComponent,
    PromotionsComponent
  ]
})
export class AdminModule { }