import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Tableau de bord</h1>
      <div class="stats-grid">
        <div class="card"><h3>Commandes totales</h3><p>{{ stats.total_orders || 0 }}</p></div>
        <div class="card"><h3>Chiffre d'affaires</h3><p>{{ (stats.total_revenue || 0) | number:'1.0-0' }} FCFA</p></div>
        <div class="card"><h3>Commandes en attente</h3><p>{{ stats.pending_orders || 0 }}</p></div>
        <div class="card"><h3>Utilisateurs</h3><p>{{ stats.total_users || 0 }}</p></div>
      </div>
      <div class="charts">
        <div class="chart-section">
          <h3>Commandes des 30 derniers jours</h3>
          <ul>
            <li *ngFor="let day of stats.orders_by_day || []">{{ day.day }} : {{ day.count }} commande(s)</li>
          </ul>
        </div>
        <div class="chart-section">
          <h3>Plats les plus commandés</h3>
          <ol>
            <li *ngFor="let dish of stats.top_dishes || []">{{ dish.dish__name }} ({{ dish.total }} commandes)</li>
          </ol>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; background: #f8f8f6; min-height: 100vh; }
    .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 2rem; }
    .card { background: white; padding: 1rem; border-radius: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
    .card h3 { margin: 0 0 0.5rem; }
    .card p { font-size: 1.5rem; font-weight: bold; margin: 0; color: #C3102F; }
    .charts { display: flex; gap: 2rem; }
    .chart-section { background: white; border-radius: 16px; padding: 1rem; flex:1; }
  `]
})
export class DashboardComponent implements OnInit {
  private admin = inject(AdminService);
  stats: any = {};
  ngOnInit() {
  this.admin.getStats().subscribe({
    next: (data) => {
      console.log('Stats reçues :', data);
      this.stats = data;
    },
    error: (err) => console.error('Erreur chargement stats', err)
  });
}
}