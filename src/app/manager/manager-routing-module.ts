import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagerDashboardComponent } from './dashboard/dashboard';
import { ManagerOrdersComponent } from './orders/orders';
import { managerGuard } from '../guards/manager.guard';

const routes: Routes = [
  { path: 'dashboard', component: ManagerDashboardComponent, canActivate: [managerGuard] },
  { path: 'orders', component: ManagerOrdersComponent, canActivate: [managerGuard] },
  
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ManagerRoutingModule { }