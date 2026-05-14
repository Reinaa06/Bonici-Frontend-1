import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    
  <div class="admin-container">
    <div class="header">
      <h2>Promotions</h2>
      <button class="btn-add" (click)="openModal()">+ Ajouter</button>
    </div>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Restaurant</th><th>Plats</th><th>Remise</th><th>Début</th><th>Fin</th><th>Actif</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of promotions()">
            <td>{{ p.id }}</td><td>{{ p.restaurant_name }}</td>
            <td>{{ p.dishes_list?.join(', ') }}</td>
            <td>{{ p.discount_percent }}%</td>
            <td>{{ p.start_date | date:'dd/MM/yyyy' }}</td>
            <td>{{ p.end_date | date:'dd/MM/yyyy' }}</td>
            <td>{{ p.is_active ? '✅' : '❌' }}</td>
            <td>
              <button class="btn-icon" (click)="edit(p)">✏️</button>
              <button class="btn-icon" (click)="deletePromotion(p.id)">🗑️</button>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal" *ngIf="showModal" (click)="closeModal()">
    <div class="modal-content" (click)="$event.stopPropagation()">
      <h3>{{ editingId ? 'Modifier' : 'Ajouter' }} une promotion</h3>
      <form (ngSubmit)="save()">
        <label>Restaurant :
          <select [(ngModel)]="form.restaurant" name="restaurant" (change)="onRestaurantChange()" required>
            <option [ngValue]="null">-- Choisir --</option>
            <option *ngFor="let r of restaurants()" [ngValue]="r.id">{{ r.name }}</option>
          </select>
        </label>

        <label>Plats concernés :
          <select multiple [(ngModel)]="form.dishes" name="dishes" class="multiselect" required>
      <option *ngFor="let d of availableDishes()" [value]="d.id">
        {{ d.dish_name }} - {{ d.price | number }} FCFA
      </option>
          </select>
          <small>Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs plats</small>
        </label>

        <label>Remise (%) : <input type="number" [(ngModel)]="form.discount_percent" name="discount_percent" required></label>
        <label>Date de début : <input type="datetime-local" [(ngModel)]="form.start_date" name="start_date" required></label>
        <label>Date de fin : <input type="datetime-local" [(ngModel)]="form.end_date" name="end_date" required></label>
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
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; margin: 0 0.2rem; }
    .multiselect { height: 120px; }
    .modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 20px; width: 550px; max-width: 90%; max-height: 80vh; overflow-y: auto; }
    .modal-content label { display: block; margin: 0.8rem 0; }
    .modal-content input, .modal-content select { width: 100%; padding: 0.5rem; margin-top: 0.2rem; border:1px solid #ddd; border-radius: 8px; }
    .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end; }
    .btn-save { background: #C3102F; color: white; border: none; padding: 0.4rem 1rem; border-radius: 30px; cursor: pointer; }
    .btn-cancel { background: #ccc; border: none; padding: 0.4rem 1rem; border-radius: 30px; cursor: pointer; }

  `]
})
export class PromotionsComponent implements OnInit {
  private admin = inject(AdminService);
  
  promotions = signal<any[]>([]);
  restaurants = signal<any[]>([]);
  availableDishes = signal<any[]>([]);
  showModal = false;
  editingId: number | null = null;
  form: any = {};

  ngOnInit() {
    this.loadPromotions();
    this.loadRestaurants();
  }

  loadPromotions() {
    this.admin.getPromotions().subscribe(data => this.promotions.set(data));
  }

  loadRestaurants() {
    this.admin.getRestaurants().subscribe(data => this.restaurants.set(data));
  }

  onRestaurantChange() {
  if (this.form.restaurant) {
    console.log('Chargement des plats pour restaurant ID:', this.form.restaurant);
    this.admin.getRestaurantDishes(this.form.restaurant).subscribe({
      next: (data) => {
        console.log('Plats reçus :', data);
        this.availableDishes.set(data);
        this.form.dishes = [];
      },
      error: (err) => console.error('Erreur chargement plats', err)
    });
  } else {
    this.availableDishes.set([]);
  }
  this.admin.getRestaurantDishes(this.form.restaurant).subscribe(data => {
  console.log('Structure des plats :', data);
  this.availableDishes.set(data);
});
}

  openModal() {
    this.editingId = null;
    this.form = {
      restaurant: null,
      dishes: [],
      discount_percent: 0,
      start_date: '',
      end_date: '',
      is_active: true
    };
    this.availableDishes.set([]);
    this.showModal = true;
  }

  edit(p: any) {
    this.editingId = p.id;
    this.form = {
      restaurant: p.restaurant,
      dishes: p.dishes || [],
      discount_percent: p.discount_percent,
      start_date: p.start_date?.slice(0, 16),
      end_date: p.end_date?.slice(0, 16),
      is_active: p.is_active
    };
    if (p.restaurant) {
      this.admin.getRestaurantDishes(p.restaurant).subscribe(data => this.availableDishes.set(data));
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
  const data = {
    restaurant: this.form.restaurant,
    dishes: this.form.dishes.map((id: any) => Number(id)), // ← conversion explicite
    discount_percent: this.form.discount_percent,
    start_date: this.form.start_date,
    end_date: this.form.end_date,
    is_active: this.form.is_active
  };
  
  const obs = this.editingId
    ? this.admin.updatePromotion(this.editingId, data)
    : this.admin.createPromotion(data);
  
  obs.subscribe({
    next: () => {
      this.loadPromotions();
      this.closeModal();
    },
    error: (err) => console.error('Erreur sauvegarde', err)
  });
}

  deletePromotion(id: number) {
    if (confirm('Supprimer cette promotion ?')) {
      this.admin.deletePromotion(id).subscribe(() => this.loadPromotions());
    }
  this.admin.getRestaurantDishes(this.form.restaurant).subscribe(data => {
  console.log('Plats reçus (avec leurs ID) :', data);
  this.availableDishes.set(data);
});
  }
}