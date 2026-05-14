import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './how-it-works.html',
  styleUrls: ['./how-it-works.scss']
})
export class HowItWorksComponent {
  steps = [
    { num:1, icon:'📍', title:'Choisissez votre restaurant', desc:'Localisez le BONICI le plus proche grâce à la carte interactive.' },
    { num:2, icon:'🛒', title:'Composez votre commande',     desc:'Parcourez le menu, ajoutez vos plats et personnalisez-les.' },
    { num:3, icon:'🛵', title:'Recevez votre livraison',     desc:'Suivez votre livreur en temps réel et savourez vos plats chez vous.' },
  ];
}