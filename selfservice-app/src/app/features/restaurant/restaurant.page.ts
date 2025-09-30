import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-restaurant',
  imports: [IonicModule, CommonModule, RouterLink, RouterOutlet],
  templateUrl: './restaurant.page.html',
  styleUrls: ['./restaurant.page.scss'],
})
export class RestaurantPage {
  restaurant = {
    id: 1,
    name: 'GA Bistrô',
    category: 'Brasileira Contemporânea',
    rating: 4.7,
    reviews: 328,
    priceTier: 'R$$',
    cover:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop',
    // removemos "Delivery" e "Pet friendly"
    tags: ['Reserve agora'],
    address: 'Av. Central, 123 - Centro',
  };

  stars = Array.from({ length: 5 });
}

