import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule, RouterLink],
})
export class HomePage {
  q = '';
  selectedCat: string | null = null;

  // restaurante fixo (destaque)
  fixedRestaurant = {
    id: 1,
    name: 'GA Bistrô',
    category: 'Brasileira Contemporânea',
    description: 'Sabores autorais com ingredientes frescos e experiência acolhedora.',
    rating: 4.7,
    image:
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1600&auto=format&fit=crop',
  };

  stars = Array.from({ length: 5 });

  // categorias mock para filtros rápidos
  categories = ['Todos', 'Brasileira', 'Italiana', 'Japonesa', 'Lanches'];

  // recentes mock
  recentRestaurants = [
    { id: 2, name: 'Churrascaria Boi na Brasa', category: 'Churrasco', distance: '1.2 km',
      image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop' },
    { id: 3, name: 'Pizzaria Bella Napoli', category: 'Italiana', distance: '800 m',
      image: 'https://images.unsplash.com/photo-1541745537413-b804bff86f72?q=80&w=800&auto=format&fit=crop' },
  ];

  // resultados de busca (mock)
  results: Array<{ id: number; name: string; category: string; image: string }> = [];

  onSearch() {
    const q = this.q.trim().toLowerCase();
    if (!q) { this.results = []; return; }

    // filtro simples a partir dos "recentes"
    const pool = [...this.recentRestaurants, this.fixedRestaurant as any];
    this.results = pool
      .filter(r => r.name.toLowerCase().includes(q))
      .map(r => ({
        id: r.id,
        name: r.name,
        category: r.category,
        image: (r as any).image || this.fixedRestaurant.image,
      }));
  }

  selectCat(c: string) {
    // “Todos” remove o filtro
    this.selectedCat = c === 'Todos' ? null : c;
    // aqui você pode filtrar a lista conforme a categoria
  }

  seeAllRecents() {
    // coloque a navegação desejada (ex.: página de lista completa)
    // this.router.navigateByUrl('/restaurants');
  }
}

