import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common'; 
import { MatDialog } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';

@Component({
  selector: 'app-adivina',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './adivina.component.html',
  styleUrls: ['./adivina.component.scss'],
})
export class AdivinaComponent implements OnInit {
  pokemon: any;
  imageUrl: string = '';
  attempts = 3;
  guess = '';

  constructor(private pokemonService: PokemonService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadRandomPokemon();
  }

  loadRandomPokemon(): void {
    this.pokemonService.getRandomPokemon().subscribe((data: any) => {
      this.pokemon = data;
      this.imageUrl = data.sprites.front_default;
    });
  }

  checkGuess(): void {
    if (this.guess.toLowerCase() === this.pokemon.name.toLowerCase()) {
      this.dialog.open(ResultDialogComponent, {
        data: {
          title: '¡Correcto!',
          message: `Es ${this.pokemon.name}`,
        },
      });
      this.loadRandomPokemon();
    } else {
      this.attempts--;
      if (this.attempts === 0) {
        this.dialog.open(ResultDialogComponent, {
          data: {
            title: '¡Perdiste!',
            message: `Era ${this.pokemon.name}`,
          },
        });
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Recarga la página después de 3 segundos
      } else {
        this.dialog.open(ResultDialogComponent, {
          data: {
            title: '¡Inténtalo de nuevo!',
            message: `Te quedan ${this.attempts} intentos.`,
          },
        });
      }
    }
    this.guess = '';
  }
}