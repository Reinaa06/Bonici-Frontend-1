import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dishes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>Plats</h2>
        <button class="btn-add" (click)="openModal()">+ Ajouter</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Nom</th><th>Catégorie</th><th>Prix</th><th>Dispo</th><th>Menu jour</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let d of dishes()">
              <td>{{ d.id }}</td>
              <td>{{ d.name }}</td>
              <td>{{ d.category_name || d.category }}</td>
              <td>{{ d.price }} FCFA</td>
              <td>{{ d.is_available ? '✅' : '❌' }}</td>
              <td>{{ d.is_daily_special ? '⭐' : '' }}</td>
              <td>
                <button class="btn-icon" (click)="edit(d)">✏️</button>
                <button class="btn-icon" (click)="deleteDish(d.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal" *ngIf="showModal" (click)="showModal=false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{ editingId ? 'Modifier' : 'Ajouter' }} un plat</h3>
        <form (ngSubmit)="save()">
          <label>Nom : <input type="text" [(ngModel)]="form.name" name="name" required></label>
          <label>Description : <textarea [(ngModel)]="form.description" name="description" rows="2"></textarea></label>
          <label>Prix (FCFA) : <input type="number" [(ngModel)]="form.price" name="price" required></label>
          <label>Catégorie :
            <select [(ngModel)]="form.category" name="category">
              <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </label>
          <label>Image URL : <input type="text" [(ngModel)]="form.image" name="image"></label>
          <label>Disponible : <input type="checkbox" [(ngModel)]="form.is_available" name="is_available"></label>
          <label>Menu du jour : <input type="checkbox" [(ngModel)]="form.is_daily_special" name="is_daily_special"></label>
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
    table { width: 100%; background: white; border-radius: 16px; border-collapse: collapse; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; }
    .btn-icon { background: none; border: none; cursor: pointer; }
    .modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 20px; width: 550px; max-width: 90%; }
    .modal-content label { display: block; margin: 0.8rem 0; }
    .modal-content input, .modal-content select, .modal-content textarea { width: 100%; padding: 0.5rem; border:1px solid #ddd; border-radius: 8px; }
    .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end; }
    .btn-save { background: #C3102F; color: white; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
    .btn-cancel { background: #ccc; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
  `]
})
export class DishesComponent implements OnInit {
  private admin = inject(AdminService);
  dishes = signal<any[]>([]);
  categories = signal<any[]>([]);
  showModal = false;
  editingId: number | null = null;
  form: any = { is_available: true, is_daily_special: false };
  ngOnInit() {
    this.load();
    this.admin.getCategories().subscribe(data => this.categories.set(data));
  }
  load() { this.admin.getDishes().subscribe(data => this.dishes.set(data)); }
  openModal() { this.editingId = null; this.form = { is_available: true, is_daily_special: false }; this.showModal = true; }
  edit(d: any) { this.editingId = d.id; this.form = { ...d }; this.showModal = true; }
  closeModal() { this.showModal = false; }
  save() {
    const obs = this.editingId ? this.admin.updateDish(this.editingId, this.form) : this.admin.createDish(this.form);
    obs.subscribe(() => { this.load(); this.closeModal(); });
  }
  deleteDish(id: number) { if (confirm('Supprimer ?')) this.admin.deleteDish(id).subscribe(() => this.load()); }
}