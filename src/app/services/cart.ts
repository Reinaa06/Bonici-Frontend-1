import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  dish_id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemsSignal = signal<CartItem[]>([]);
  private isOpenSignal = signal<boolean>(false);

  // Signals publics
  items = computed(() => this.itemsSignal());
  total = computed(() => this.itemsSignal().reduce((sum, item) => sum + (item.price * item.quantity), 0));
  count = computed(() => this.itemsSignal().reduce((c, item) => c + item.quantity, 0));
  isOpen = computed(() => this.isOpenSignal());

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem('bonici_cart');
    if (saved) {
      this.itemsSignal.set(JSON.parse(saved));
    }
  }

  private saveToStorage() {
    localStorage.setItem('bonici_cart', JSON.stringify(this.itemsSignal()));
  }

  // Panier drawer
  open() { this.isOpenSignal.set(true); }
  close() { this.isOpenSignal.set(false); }
  toggle() { this.isOpenSignal.update(v => !v); }

  // Ajouter un article
  add(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
    const qty = item.quantity || 1;
    const existing = this.itemsSignal().find(i => i.dish_id === item.dish_id);
    if (existing) {
      this.updateQty(item.dish_id, existing.quantity + qty);
    } else {
      this.itemsSignal.update(items => [...items, { ...item, quantity: qty }]);
      this.saveToStorage();
    }
  }

  // Alias pour mise à jour de quantité
  updateQty(dishId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItemCallback(dishId);
      return;
    }
    this.itemsSignal.update(items =>
      items.map(item => item.dish_id === dishId ? { ...item, quantity } : item)
    );
    this.saveToStorage();
  }

  // Alias pour updateQuantity (pour compatibilité)
  updateQuantity(dishId: number, quantity: number) {
    this.updateQty(dishId, quantity);
  }

  // Supprimer un article (alias)
  remove(dishId: number) {
    this.removeItemCallback(dishId);
  }

  removeItem(dishId: number) {
    this.removeItemCallback(dishId);
  }

  private removeItemCallback(dishId: number) {
    this.itemsSignal.update(items => items.filter(item => item.dish_id !== dishId));
    this.saveToStorage();
  }

  clear() {
    this.itemsSignal.set([]);
    this.saveToStorage();
  }

  clearCart() {
    this.clear();
  }

  getItems() { return this.itemsSignal(); }
  getCount() { return this.count(); }
  getTotal() { return this.total(); }
}