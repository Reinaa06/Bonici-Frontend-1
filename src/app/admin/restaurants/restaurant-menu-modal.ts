import { Component, Inject, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-restaurant-menu-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h2>Gérer le menu - {{ restaurantName }}</h2>
        
        <div class="menu-items">
          <h3>Plats actuels</h3>
          <table class="table">
            <thead>
              <tr><th>Plat</th><th>Prix par défaut</th><th>Prix ici</th><th>Dispo</th><th>Actions</th></tr>
            </thead>
            <tbody>
              @for (item of items(); track item.id) {
                <tr>
                  <td>{{ item.dish_name }}</td>
                  <td>{{ item.dish_price }} FCFA</td>
                  <td><input type="number" [(ngModel)]="item.price" class="price-input"></td>
                  <td><input type="checkbox" [(ngModel)]="item.is_available"></td>
                  <td>
                    <button (click)="updateItem(item)" class="btn-save">💾</button>
                    <button (click)="deleteItem(item.id)" class="btn-delete">🗑️</button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="add-item">
          <h3>Ajouter un plat</h3>
          <select [(ngModel)]="selectedDishId" class="form-control">
            <option [value]="null">-- Choisir un plat --</option>
            @for (dish of availableDishes(); track dish.id) {
              <option [value]="dish.id">{{ dish.name }} ({{ dish.price }} FCFA)</option>
            }
          </select>
          <input type="number" [(ngModel)]="newPrice" placeholder="Prix spécifique" class="price-input">
          <button (click)="addItem()" class="btn-add">➕ Ajouter</button>
        </div>

        <div class="modal-actions">
          <button (click)="close()" class="btn-close">Fermer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
    .modal-content { background: white; border-radius: 20px; padding: 2rem; width: 700px; max-width: 90%; max-height: 80vh; overflow-y: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 8px; text-align: left; border-bottom: 1px solid #eee; }
    .price-input { width: 80px; padding: 4px; }
    .btn-save { background: #28a745; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
    .btn-delete { background: #dc3545; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; margin-left: 4px; }
    .btn-add { background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-left: 8px; }
    .btn-close { background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; margin-top: 1rem; }
    .add-item { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .form-control { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid #ddd; }
  `]
})
export class RestaurantMenuModalComponent implements OnInit {
  private admin = inject(AdminService);
  private dialogRef = inject(MatDialogRef<RestaurantMenuModalComponent>);
  data = inject(MAT_DIALOG_DATA);

  restaurantId = this.data.restaurantId;
  restaurantName = this.data.restaurantName;
  
  items = signal<any[]>([]);
  availableDishes = signal<any[]>([]);
  selectedDishId: number | null = null;
  newPrice: number | null = null;

  ngOnInit() {
    this.loadItems();
    this.loadAvailableDishes();
  }

  loadItems() {
    this.admin.getRestaurantDishes(this.restaurantId).subscribe(data => this.items.set(data));
  }

  loadAvailableDishes() {
    this.admin.getDishes().subscribe(data => this.availableDishes.set(data));
  }

  addItem() {
    if (!this.selectedDishId || !this.newPrice) return;
    this.admin.createRestaurantDish({
      restaurant: this.restaurantId,
      dish: this.selectedDishId,
      price: this.newPrice,
      is_available: true
    }).subscribe(() => {
      this.loadItems();
      this.selectedDishId = null;
      this.newPrice = null;
    });
  }

  updateItem(item: any) {
    this.admin.updateRestaurantDish(item.id, item).subscribe(() => this.loadItems());
  }

  deleteItem(id: number) {
    if (confirm('Supprimer ce plat du restaurant ?')) {
      this.admin.deleteRestaurantDish(id).subscribe(() => this.loadItems());
    }
  }

  close() {
    this.dialogRef.close();
  }
}