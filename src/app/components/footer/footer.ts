import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  year  = new Date().getFullYear();
  email = signal('');
  imgs  = [
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=70',
    'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&q=70',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&q=70',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=70',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=200&q=70',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=200&q=70',
  ];
  subscribe() {
    if (this.email().trim()) { alert(`Abonné : ${this.email()}`); this.email.set(''); }
  }
}