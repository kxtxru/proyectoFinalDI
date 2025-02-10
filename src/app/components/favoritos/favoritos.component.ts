import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { pokemonstate } from '../../services/pokemonstate.service';

@Component({
  selector: 'app-favoritos',
  imports: [CommonModule],
  templateUrl: './favoritos.component.html',
  styleUrl: './favoritos.component.css'
})
export class FavoritosComponent {

  favoritos: any[] = [];

  constructor(private pokemonService: PokemonService, private pokemonStateService: pokemonstate) {}

  ngOnInit(): void {
    this.pokemonStateService.favoritos$.subscribe((data) => {
      this.favoritos = data;
    });
  }
  removePokemonFromFavorites(pokemon: any): void {
    this.pokemonStateService.removeFromFavorites(pokemon);
  }
}
