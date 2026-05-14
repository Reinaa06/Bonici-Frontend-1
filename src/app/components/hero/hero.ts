import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule],  // ✅ Supprimer RouterLink
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  private router = inject(Router);
  searchQuery = signal('');

  onSearch() {
    const q = this.searchQuery().trim();
    this.router.navigate(['/menus'], q ? { queryParams: { search: q } } : {});
  }
}