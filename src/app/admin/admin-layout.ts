import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <div class="logo">
          <h2>Bonici Admin</h2>
        </div>
        <nav>
          <a routerLink="/admin/dashboard" routerLinkActive="active">
            📊 Dashboard
          </a>
          <a routerLink="/admin/restaurants" routerLinkActive="active">
            🏪 Restaurants
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active">
            📁 Catégories
          </a>
          <a routerLink="/admin/dishes" routerLinkActive="active">
            🍽️ Plats
          </a>
          <a routerLink="/admin/tables" routerLinkActive="active">
            🪑 Tables
          </a>
          <a routerLink="/admin/promotions" routerLinkActive="active">
            🎁 Promotions
          </a>
        </nav>
      </aside>
      <main class="main-content">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    .sidebar {
      width: 260px;
      background: #1a1a1a;
      color: white;
      padding: 1.5rem;
    }
    .logo h2 {
      color: #C3102F;
      margin-bottom: 2rem;
      font-size: 1.3rem;
    }
    .sidebar nav {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .sidebar nav a {
      color: #ccc;
      text-decoration: none;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.2s;
    }
    .sidebar nav a:hover {
      background: #2c2c2c;
      color: white;
    }
    .sidebar nav a.active {
      background: #C3102F;
      color: white;
    }
    .main-content {
      flex: 1;
      background: #f5f5f5;
    }
  `]
})
export class AdminLayoutComponent {}