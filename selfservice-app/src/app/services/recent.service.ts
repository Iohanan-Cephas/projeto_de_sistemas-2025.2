import { Injectable } from '@angular/core';
import { Restaurant } from './restaurant.service';
const KEY = 'recent-restaurants'; const LIMIT = 10;

@Injectable({ providedIn: 'root' })
export class RecentService {
  getAll(): Restaurant[] { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
  push(r: Restaurant) {
    const arr = this.getAll().filter(x => x.id !== r.id);
    arr.unshift(r);
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, LIMIT)));
  }
}
