import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagerService } from '../../services/manager.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styles: [`
    :host { display: block; }
    .page { padding: 2rem; min-height: 100vh; background: #F5F5F5; }
    .page-title { font-size: 24px; font-weight: 600; color: #1A1A1A; margin-bottom: 2rem; display: flex; align-items: center; gap: 10px; }
    .page-title-icon { color: #C0392B; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 2rem; }
    .metric-card { background: white; border-radius: 14px; padding: 1.2rem; border: 1px solid #E0E0E0; border-left: 4px solid #C0392B; }
    .metric-card-label { font-size: 12px; text-transform: uppercase; color: #888; margin-bottom: 8px; }
    .metric-card-value { font-size: 30px; font-weight: 600; color: #1A1A1A; }
    .metric-card-value span { font-size: 14px; font-weight: 400; color: #888; }
    .metric-card-sub { margin-top: 6px; font-size: 12px; color: #C0392B; }
    .card { background: white; border-radius: 14px; border: 1px solid #E0E0E0; overflow: hidden; }
    .card-header { padding: 1rem 1.25rem; border-bottom: 1px solid #E0E0E0; display: flex; align-items: center; justify-content: space-between; }
    .card-header-title { font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .card-header-title-icon { color: #C0392B; }
    .card-body { padding: 1rem; }
    .table-row { display: flex; align-items: center; justify-content: space-between; padding: 14px; border-bottom: 1px solid #E0E0E0; }
    .badge { display: inline-flex; align-items: center; padding: 5px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .badge-pending { background: #FEF9E7; color: #B7770D; }
    .badge-active { background: #EAF7F0; color: #1E8449; }
    .badge-cancelled { background: #FADBD8; color: #922B21; }
    .badge-delivered { background: #EBF5FB; color: #1A5276; }
    .empty-state { padding: 3rem 1rem; text-align: center; }
    .empty-state-icon { font-size: 40px; display: block; margin-bottom: 10px; color: #E0E0E0; }
    .empty-state-text { font-size: 15px; color: #888; }
    .empty-state-subtext { font-size: 12px; color: #BBBBBB; margin-top: 4px; }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  private manager = inject(ManagerService);
  stats: any = { recent_orders: [] };
  ngOnInit() {
    this.manager.getStats().subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Erreur chargement dashboard', err)
    });
  }
}