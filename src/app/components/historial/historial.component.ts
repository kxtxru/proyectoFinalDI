import { Component, OnInit } from '@angular/core';
import { pokemonstate } from '../../services/pokemonstate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css']
})
export class HistorialComponent implements OnInit {
  historial: any[] = [];

  constructor(private pokemonstate: pokemonstate) {}

  ngOnInit(): void {
    this.pokemonstate.historial$.subscribe((data) => {
      this.historial = data;
    });
  }

  addPokemonToFavorites(pokemon: any): void {
    this.pokemonstate.addFavorite(pokemon); 
  }
}
