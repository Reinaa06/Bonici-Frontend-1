import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { RestaurantsComponent } from './restaurants/restaurants';
import { CategoriesComponent } from './categories/categories';
import { DishesComponent } from './dishes/dishes';
import { TablesComponent } from './tables/tables';
import { PromotionsComponent } from './promotions/promotions';
import { adminGuard } from '../guards/admin.guard';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },
  { path: 'restaurants', component: RestaurantsComponent, canActivate: [adminGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [adminGuard] },
  { path: 'dishes', component: DishesComponent, canActivate: [adminGuard] },
  { path: 'tables', component: TablesComponent, canActivate: [adminGuard] },
  { path: 'promotions', component: PromotionsComponent, canActivate: [adminGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }