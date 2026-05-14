import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterData } from '../../../models/auth-models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // ✅ Signaux de base
  name = signal('');
  email = signal('');
  phone = signal('');  // ✅ Ajouter phone
  password = signal('');
  confirmPassword = signal('');
  showPwd = signal(false);  // ✅ Ajouter showPwd
  loading = signal(false);
  error = signal('');
  success = signal(false);  // ✅ Ajouter success
  
  // ✅ Force du mot de passe
  strength = signal(0);  // ✅ Ajouter strength
  strengthLabel = computed(() => {
    const val = this.strength();
    if (val === 0) return 'Très faible';
    if (val === 1) return 'Faible';
    if (val === 2) return 'Moyen';
    if (val === 3) return 'Fort';
    return 'Très fort';
  });
  
  // ✅ Termes acceptés
  acceptTerms = signal(false);  // ✅ Ajouter acceptTerms
  
  // ✅ Perks (avantages)
  perks = [  // ✅ Ajouter perks
    { label: 'Livraison offerte dès 15 000 CFA', icon: '🚚' },
    { label: '-15% sur votre première commande', icon: '🎁' },
    { label: 'Points fidélité x2 pendant 1 mois', icon: '⭐' }
  ];

  // ✅ Vérifier la force du mot de passe
  checkStrength(pwd: string) {
    let s = 0;
    if (pwd.length >= 6) s++;
    if (pwd.match(/[a-z]/) && pwd.match(/[A-Z]/)) s++;
    if (pwd.match(/[0-9]/)) s++;
    if (pwd.match(/[^a-zA-Z0-9]/)) s++;
    this.strength.set(s);
  }

  onSubmit() {
  if (this.password() !== this.confirmPassword()) {
    this.error.set('Les mots de passe ne correspondent pas.');
    return;
  }
  if (!this.acceptTerms()) {
    this.error.set('Vous devez accepter les conditions.');
    return;
  }
  this.loading.set(true);
  this.error.set('');

  const registerData: RegisterData = {
    username: this.name(),
    email: this.email(),
    phone_number: this.phone() || '',
    password: this.password(),
    password2: this.confirmPassword()
  };

  this.auth.register(registerData).subscribe({
  next: (response) => {
    console.log('Inscription réussie', response);
    this.loading.set(false);
    this.success.set(true);
    setTimeout(() => {
      console.log('Redirection vers /login');
      this.router.navigate(['/login']);
    }, 2000);
  },
  error: (err: HttpErrorResponse) => {
    console.error('Erreur inscription', err);
    this.loading.set(false);
    const firstError = Object.values(err.error)[0];
    this.error.set(Array.isArray(firstError) ? firstError[0] : 'Erreur lors de l’inscription');
  }
});
}
  }
  
//   // ✅ Méthode loginGoogle
//   loginGoogle() {
//     this.loading.set(true);
//     this.auth.loginWithGoogle().subscribe({
//       error: (err: HttpErrorResponse) => {
//         this.loading.set(false);
//         this.error.set('Connexion Google pas encore disponible');
//       }
//     });
//   }
// }