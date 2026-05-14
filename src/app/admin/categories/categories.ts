import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>Catégories</h2>
        <button class="btn-add" (click)="openModal()">+ Ajouter</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>ID</th><th>Nom</th><th>Image</th><th>Ordre</th><th>Actif</th><th>Actions</th></tr></thead>
          <tbody>
            <tr *ngFor="let c of categories()">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td><img *ngIf="c.image" [src]="c.image" width="50" height="50" style="object-fit:cover; border-radius:8px;"></td>
              <td>{{ c.order }}</td>
              <td>{{ c.is_active ? '✅' : '❌' }}</td>
              <td>
                <button class="btn-icon" (click)="edit(c)">✏️</button>
                <button class="btn-icon" (click)="deleteCategory(c.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal" *ngIf="showModal" (click)="showModal=false">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{ editingId ? 'Modifier' : 'Ajouter' }} une catégorie</h3>
        <form (ngSubmit)="save()">
          <label>Nom : <input type="text" [(ngModel)]="form.name" name="name" required></label>
          <label>Image URL : <input type="text" [(ngModel)]="form.image" name="image" placeholder="URL de l'image"></label>
          <label>Ordre : <input type="number" [(ngModel)]="form.order" name="order"></label>
          <label>Actif : <input type="checkbox" [(ngModel)]="form.is_active" name="is_active"></label>
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
    table { width: 100%; background: white; border-radius: 16px; border-collapse: collapse; overflow: hidden; }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; }
    .btn-icon { background: none; border: none; cursor: pointer; }
    .modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 20px; width: 500px; }
    .modal-content label { display: block; margin: 0.8rem 0; }
    .modal-content input { width: 100%; padding: 0.5rem; border:1px solid #ddd; border-radius: 8px; }
    .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end; }
    .btn-save { background: #C3102F; color: white; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
    .btn-cancel { background: #ccc; border: none; padding: 0.4rem 1rem; border-radius: 30px; }
  `]
})
export class CategoriesComponent implements OnInit {
  private admin = inject(AdminService);
  categories = signal<any[]>([]);
  showModal = false;
  editingId: number | null = null;
  form: any = { is_active: true, order: 0 };
  ngOnInit() { this.load(); }
  load() { this.admin.getCategories().subscribe(data => this.categories.set(data)); }
  openModal() { this.editingId = null; this.form = { is_active: true, order: 0 }; this.showModal = true; }
  edit(c: any) { this.editingId = c.id; this.form = { ...c }; this.showModal = true; }
  closeModal() { this.showModal = false; }
  save() {
    const obs = this.editingId ? this.admin.updateCategory(this.editingId, this.form) : this.admin.createCategory(this.form);
    obs.subscribe(() => { this.load(); this.closeModal(); });
  }
  deleteCategory(id: number) { if (confirm('Supprimer ?')) this.admin.deleteCategory(id).subscribe(() => this.load()); }
}