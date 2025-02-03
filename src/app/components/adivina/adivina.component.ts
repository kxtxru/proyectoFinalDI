import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { ActivatedRoute } from '@angular/router';

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
  nombre: string = '';
  racha: number = 1;
  currentDialogRef: MatDialogRef<any> | null = null;

  constructor(private pokemonService: PokemonService,private dialog: MatDialog,private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadRandomPokemon();
    this.route.paramMap.subscribe(params => {
      this.nombre = params.get('nombre') || 'Invitado';
    });
  }

  loadRandomPokemon(): void {
    this.pokemonService.getRandomPokemon().subscribe((data: any) => {
      this.pokemon = data;
      this.imageUrl = data.sprites.front_default;
    });
  }

  checkGuess(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
    if (this.guess.trim() === '') {
      return;  // Si el campo está vacío, no hacer nada
    }
    if (this.guess.toLowerCase() === this.pokemon.name.toLowerCase()) {
      this.dialog.open(ResultDialogComponent, {
        data: {
          title: '¡Correcto!',
          message: `Es ${this.pokemon.name}, ${this.nombre}, llevas racha de: ${this.racha}`,
        },
      });
      this.racha ++;
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