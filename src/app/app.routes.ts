import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./pages/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/auth/register/register').then(m => m.RegisterComponent) },
  { path: 'menus', loadComponent: () => import('./pages/menus/menus').then(m => m.MenusComponent), canActivate: [AuthGuard] },
  { path: 'cart', loadComponent: () => import('./pages/cart/cart').then(m => m.CartPageComponent), canActivate: [AuthGuard] },
  { path: 'restaurants', loadComponent: () => import('./pages/restaurants/restaurants').then(m => m.RestaurantsComponent), canActivate: [AuthGuard] },
  { path: 'suivi', loadComponent: () => import('./pages/suivi/suivi').then(m => m.SuiviComponent), canActivate: [AuthGuard] },
  {
  path: 'manager',
  loadChildren: () => import('./manager/manager-module').then(m => m.ManagerModule)
},
  // Routes admin (standalone)
  { path: 'admin/dashboard', loadComponent: () => import('./admin/dashboard/dashboard').then(m => m.DashboardComponent), canActivate: [adminGuard] },
  { path: 'admin/restaurants', loadComponent: () => import('./admin/restaurants/restaurants').then(m => m.RestaurantsComponent), canActivate: [adminGuard] },
  { path: 'admin/categories', loadComponent: () => import('./admin/categories/categories').then(m => m.CategoriesComponent), canActivate: [adminGuard] },
  { path: 'admin/dishes', loadComponent: () => import('./admin/dishes/dishes').then(m => m.DishesComponent), canActivate: [adminGuard] },
  { path: 'admin/tables', loadComponent: () => import('./admin/tables/tables').then(m => m.TablesComponent), canActivate: [adminGuard] },
  { path: 'admin/promotions', loadComponent: () => import('./admin/promotions/promotions').then(m => m.PromotionsComponent), canActivate: [adminGuard] },

  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },


  { path: '**', redirectTo: '' }
];