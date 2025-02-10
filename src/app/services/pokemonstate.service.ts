import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class pokemonstate {
  private currentPokemon: any;
  private favoritosSubject = new BehaviorSubject<any[]>([]);
  favoritos$ = this.favoritosSubject.asObservable();

  private historialSubject = new BehaviorSubject<any[]>([]);
  historial$ = this.historialSubject.asObservable();

  constructor() {
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      this.loadFromLocalStorage();
    }
  }

  setCurrentPokemon(pokemon: any): void {
    this.currentPokemon = pokemon;
  }

  getCurrentPokemon(): any {
    return this.currentPokemon;
  }

  clearCurrentPokemon(): void {
    this.currentPokemon = null;
  }

  addFavorite(pokemon: any): void {
    const currentFavorites = this.favoritosSubject.getValue();
    if (!currentFavorites.some(fav => fav.name === pokemon.name)) {
      this.favoritosSubject.next([...currentFavorites, pokemon]);
      this.saveToLocalStorage();  // Guardar favoritos en localStorage
    }
  }

  removeFromFavorites(pokemon: any): void {
    const favoritos = this.favoritosSubject.value.filter(
      (fav) => fav.name !== pokemon.name
    );
    this.favoritosSubject.next(favoritos);
    this.saveToLocalStorage();  // Guardar cambios en localStorage
  }

  getFavorites(): any[] {
    return this.favoritosSubject.getValue();
  }

  addToHistorial(pokemon: any): void {
    const currentHistorial = this.historialSubject.getValue();
    if (!currentHistorial.some(p => p.name === pokemon.name)) {
      this.historialSubject.next([...currentHistorial, pokemon]);
      this.saveToLocalStorage();  // Guardar historial en localStorage
    }
  }

  getHistorial(): any[] {
    return this.historialSubject.getValue();
  }

  // Función para guardar favoritos e historial en localStorage
  private saveToLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const favoritos = this.favoritosSubject.getValue();
      const historial = this.historialSubject.getValue();
      localStorage.setItem('favoritos', JSON.stringify(favoritos));
      localStorage.setItem('historial', JSON.stringify(historial));
    }
  }

  // Función para cargar favoritos e historial desde localStorage
  private loadFromLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      const historial = JSON.parse(localStorage.getItem('historial') || '[]');
      this.favoritosSubject.next(favoritos);
      this.historialSubject.next(historial);
    }
  }
  
}
