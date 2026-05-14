import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';  // ✅ Ajouter cet import

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  email = signal('');
  password = signal('');
  showPwd = signal(false);
  loading = signal(false);
  error = signal('');

  onSubmit() {
  if (!this.email() || !this.password()) {
    this.error.set('Veuillez remplir tous les champs.');
    return;
  }
  this.loading.set(true);
  this.error.set('');

 this.auth.login({ email: this.email(), password: this.password() }).subscribe({
  next: (response) => {
    console.log('Connexion réussie', response);
    const url = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(url);
  },
  error: (err: HttpErrorResponse) => {
    console.error('Erreur connexion', err);
    this.loading.set(false);
    this.error.set(err.status === 401 ? 'Email ou mot de passe incorrect.' : 'Erreur serveur. Réessayez.');
  }
});
}
}

