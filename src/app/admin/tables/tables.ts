import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>Tables</h2>
        <button class="btn-add" (click)="openModal()">+ Ajouter</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Restaurant</th><th>Numéro</th><th>QR Code</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let t of tables()">
              <td>{{ t.id }}</td>
              <td>{{ t.restaurant_name }}</td>
              <td>{{ t.number }}</td>
              <td>
                <a *ngIf="t.qr_url" [href]="t.qr_url" target="_blank">🔗 Lien</a>
                <button class="btn-qr" (click)="generateQR(t.id)">Générer QR</button>
              </td>
              <td>
                <button class="btn-icon" (click)="edit(t)">✏️</button>
                <button class="btn-icon" (click)="deleteTable(t.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal" *ngIf="showModal" (click)="showModal=false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{ editingId ? 'Modifier' : 'Ajouter' }} une table</h3>
        <form (ngSubmit)="save()">
          <label>Restaurant :
            <select [(ngModel)]="form.restaurant" name="restaurant" required>
              <option *ngFor="let r of restaurants()" [value]="r.id">{{ r.name }}</option>
            </select>
          </label>
          <label>Numéro de table : <input type="number" [(ngModel)]="form.number" name="number" required></label>
          <div class="modal-buttons">
            <button type="submit" class="btn-save">Enregistrer</button>
            <button type="button" class="btn-cancel" (click)="closeModal()">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 2rem; background: #f8f8f6; min-height: 100vh; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .btn-add { background: #C3102F; color: white; border: none; padding: 0.5rem 1.2rem; border-radius: 30px; cursor: pointer; }
    .btn-qr { background: #2c3e50; color: white; border: none; padding: 0.2rem 0.6rem; border-radius: 8px; cursor: pointer; margin-left: 0.5rem; }
    table { width: 100%; background: white; border-radius: 16px; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; }
    .btn-icon { background: none; border: none; cursor: pointer; }
    .modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 20px; width: 450px; }
    .modal-content label { display: block; margin: 0.8rem 0; }
    .modal-content select, .modal-content input { width: 100%; padding: 0.5rem; border:1px solid #ddd; border-radius: 8px; }
    .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end; }
    .btn-save { background: #C3102F; color: white; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
    .btn-cancel { background: #ccc; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
  `]
})
export class TablesComponent implements OnInit {
  private admin = inject(AdminService);
  tables = signal<any[]>([]);
  restaurants = signal<any[]>([]);
  showModal = false;
  editingId: number | null = null;
  form: any = {};
  ngOnInit() {
    this.load();
    this.admin.getRestaurants().subscribe(data => this.restaurants.set(data));
  }
  load() { this.admin.getTables().subscribe(data => this.tables.set(data)); }
  openModal() { this.editingId = null; this.form = {}; this.showModal = true; }
  edit(t: any) { this.editingId = t.id; this.form = { ...t }; this.showModal = true; }
  closeModal() { this.showModal = false; }
  save() {
    const obs = this.editingId ? this.admin.updateTable(this.editingId, this.form) : this.admin.createTable(this.form);
    obs.subscribe(() => { this.load(); this.closeModal(); });
  }
  deleteTable(id: number) { if (confirm('Supprimer ?')) this.admin.deleteTable(id).subscribe(() => this.load()); }
  generateQR(tableId: number) {
    this.admin.generateQR(tableId).subscribe(() => this.load());
  }
}