import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  private favoritos: any[] = [];
  private adivinado: boolean = false;
  private adivinadoSubject = new BehaviorSubject<boolean>(this.adivinado);
  private favoritosSubject = new BehaviorSubject<any[]>(this.favoritos);


  favoritos$ = this.favoritosSubject.asObservable();

  addToFavorites(pokemon: any, adivinado: boolean): void {
    this.adivinado = adivinado;
    this.adivinadoSubject.next(this.adivinado);
    this.favoritos.push(pokemon);  
    this.favoritos = [...new Set(this.favoritos)];
    this.favoritosSubject.next(this.favoritos);
    console.log("favorito añadido");
  }

  getPokemonById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pokemon/${id}`);
  }

  getRandomPokemon(): Observable<any> {
    const randomId = Math.floor(Math.random() * 898) + 1;
    return this.getPokemonById(randomId);
  }

    
}