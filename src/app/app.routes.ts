import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin.guard';
import { managerGuard } from './guards/manager.guard';

// Imports des composants admin
import { DashboardComponent } from './admin/dashboard/dashboard';
import { RestaurantsComponent as AdminRestaurantsComponent } from './admin/restaurants/restaurants';
import { CategoriesComponent } from './admin/categories/categories';
import { DishesComponent } from './admin/dishes/dishes';
import { TablesComponent } from './admin/tables/tables';
import { PromotionsComponent } from './admin/promotions/promotions';
import { AdminLayoutComponent } from './admin/admin-layout';

// Imports des composants manager
import { ManagerDashboardComponent } from './manager/dashboard/dashboard';
import { ManagerOrdersComponent } from './manager/orders/orders';

// Autres imports
import { HomeComponent } from './pages/home/home';
import { LoginComponent } from './pages/auth/login/login';
import { RegisterComponent } from './pages/auth/register/register';
import { MenusComponent } from './pages/menus/menus';
import { CartPageComponent } from './pages/cart/cart';
import { RestaurantsComponent } from './pages/restaurants/restaurants';
import { SuiviComponent } from './pages/suivi/suivi';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'menus', component: MenusComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: CartPageComponent, canActivate: [AuthGuard] },
  { path: 'restaurants-page', component: RestaurantsComponent, canActivate: [AuthGuard] },
  { path: 'suivi', component: SuiviComponent, canActivate: [AuthGuard] },

  // Routes admin avec layout
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'restaurants', component: AdminRestaurantsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'dishes', component: DishesComponent },
      { path: 'tables', component: TablesComponent },
      { path: 'promotions', component: PromotionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Routes manager
  {
    path: 'manager',
    canActivate: [managerGuard],
    children: [
      { path: 'dashboard', component: ManagerDashboardComponent },
      { path: 'orders', component: ManagerOrdersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];