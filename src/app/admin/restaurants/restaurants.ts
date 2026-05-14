import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { MatDialog } from '@angular/material/dialog';
import { RestaurantMenuModalComponent } from './restaurant-menu-modal';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <div class="header">
        <h2>Restaurants</h2>
        <button class="btn-add" (click)="openModal()">+ Ajouter</button>
      </div>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Adresse</th>
              <th>Ville</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of restaurants()">
              <td>{{ r.id }}</td>
              <td>{{ r.name }}</td>
              <td>{{ r.address }}</td>
              <td>{{ r.city }}</td>
              <td>{{ r.is_active ? '✅' : '❌' }}</td>
              <td>
                <button class="btn-icon" (click)="edit(r)">✏️</button>
                <button class="btn-icon" (click)="deleteRestaurant(r.id)">🗑️</button>
                <button class="btn-menu" (click)="openMenuModal(r)">🍽️ Menu</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <h3>{{ editingId ? 'Modifier' : 'Ajouter' }} un restaurant</h3>
        <form (ngSubmit)="save()">
          <label>Nom : <input type="text" [(ngModel)]="form.name" name="name" (input)="updateSlug()" required></label>
          <label>Slug : <input type="text" [(ngModel)]="form.slug" name="slug" required></label>
          <label>Adresse : <input type="text" [(ngModel)]="form.address" name="address" required></label>
          <label>Ville : <input type="text" [(ngModel)]="form.city" name="city" required></label>
          <label>Téléphone : <input type="text" [(ngModel)]="form.phone_number" name="phone_number" required></label>
          <label>Heure d'ouverture : <input type="time" [(ngModel)]="form.opening_time" name="opening_time" required></label>
          <label>Heure de fermeture : <input type="time" [(ngModel)]="form.closing_time" name="closing_time" required></label>
          <label>Google Maps URL : <input type="url" [(ngModel)]="form.google_maps_url" name="google_maps_url" placeholder="https://maps.app.goo.gl/..."></label>
          <label>Actif : <input type="checkbox" [(ngModel)]="form.is_active" name="is_active"></label>
          <label>Rayon livraison (km) : <input type="number" step="0.1" [(ngModel)]="form.delivery_radius_km" name="delivery_radius_km"></label>
          <label>Frais de livraison de base : <input type="number" [(ngModel)]="form.delivery_fee_base" name="delivery_fee_base"></label>
          <label>Frais de livraison par km : <input type="number" [(ngModel)]="form.delivery_fee_per_km" name="delivery_fee_per_km"></label>
          <label>Montant minimum commande : <input type="number" [(ngModel)]="form.minimum_order_amount" name="minimum_order_amount"></label>
          <label>Active livraison : <input type="checkbox" [(ngModel)]="form.is_delivery_active" name="is_delivery_active"></label>
          <label>Active retrait : <input type="checkbox" [(ngModel)]="form.is_takeaway_active" name="is_takeaway_active"></label>
          <label>Pays : <input type="text" [(ngModel)]="form.country" name="country"></label>
          <label>Description : <textarea [(ngModel)]="form.description" name="description" rows="2"></textarea></label>
          <label>Code postal : <input type="text" [(ngModel)]="form.postal_code" name="postal_code"></label>
          <label>Email : <input type="email" [(ngModel)]="form.email" name="email"></label>
          
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
    table { width: 100%; background: white; border-radius: 16px; border-collapse: collapse; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }
    th, td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f5f5f5; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1.1rem; margin: 0 0.2rem; }
    .btn-menu { background: #28a745; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 20px; cursor: pointer; font-size: 0.8rem; margin-left: 0.5rem; }
    .btn-menu:hover { background: #218838; }
    .modal { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; padding: 1.5rem; border-radius: 20px; width: 600px; max-width: 90%; max-height: 80vh; overflow-y: auto; }
    .modal-content label { display: block; margin: 0.8rem 0; }
    .modal-content input, .modal-content select, .modal-content textarea { width: 100%; padding: 0.5rem; margin-top: 0.2rem; border:1px solid #ddd; border-radius: 8px; }
    .modal-buttons { display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end; }
    .btn-save { background: #C3102F; color: white; border: none; padding: 0.4rem 1rem; border-radius: 30px; cursor: pointer; }
    .btn-cancel { background: #ccc; border: none; padding: 0.4rem 1rem; border-radius: 30px; cursor: pointer; }
  `]
})
export class RestaurantsComponent implements OnInit {
  private admin = inject(AdminService);
  private dialog = inject(MatDialog);
  
  restaurants = signal<any[]>([]);
  showModal = false;
  editingId: number | null = null;
  form: any = {};

  ngOnInit() { 
    this.load(); 
  }
  
  load() { 
    this.admin.getRestaurants().subscribe({
      next: (data) => {
        console.log('Restaurants chargés :', data);
        this.restaurants.set(data);
      },
      error: (err) => console.error('Erreur chargement restaurants', err)
    });
  }
  
  generateSlug(name: string): string {
    if (!name) return '';
    return name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  updateSlug() {
    this.form.slug = this.generateSlug(this.form.name);
  }
  
  openModal() {
    this.editingId = null;
    this.form = {
      name: '',
      slug: '',
      description: '',
      address: '',
      city: '',
      postal_code: '',
      country: 'Togo',
      phone_number: '',
      email: '',
      opening_time: '09:00:00',
      closing_time: '22:00:00',
      is_open_on_sunday: false,
      sunday_opening_time: null,
      sunday_closing_time: null,
      delivery_radius_km: 5,
      delivery_fee_base: 500,
      delivery_fee_per_km: 100,
      minimum_order_amount: 1000,
      is_delivery_active: true,
      is_takeaway_active: true,
      is_active: true,
      order: 0,
      google_maps_url: '',
      cover_image: null
    };
    this.showModal = true;
  }
  
  edit(r: any) { 
    this.editingId = r.id; 
    this.form = { ...r }; 
    this.showModal = true; 
  }
  
  closeModal() { 
    this.showModal = false; 
  }
  
  save() {
    console.log('Données envoyées :', this.form);
    const obs = this.editingId 
      ? this.admin.updateRestaurant(this.editingId, this.form) 
      : this.admin.createRestaurant(this.form);
    
    obs.subscribe({
      next: () => { 
        this.load(); 
        this.closeModal(); 
      },
      error: (err) => console.error('Erreur sauvegarde', err)
    });
  }
  
  deleteRestaurant(id: number) { 
    if (confirm('Supprimer ?')) {
      this.admin.deleteRestaurant(id).subscribe(() => this.load()); 
    }
  }

  openMenuModal(restaurant: any) {
    this.dialog.open(RestaurantMenuModalComponent, {
      data: { restaurantId: restaurant.id, restaurantName: restaurant.name },
      width: '800px'
    });
  }
}