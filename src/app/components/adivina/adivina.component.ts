import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-adivina',
  standalone: true, 
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './adivina.component.html',
  styleUrls: ['./adivina.component.css'],
})
export class AdivinaComponent implements OnInit {


  private pokemon: any;
  imageUrl: string = '';
  attempts = 3;
  guess = '';
  private nombre: string = '';
  private racha: number = 1;
  private currentDialogRef: MatDialogRef<any> | null = null;
  letras!: any[];
  private pokeName: string = "";
  isPistaVisible: boolean = false;
  private numPistas = 0;
  monedas: number = 0;
  blurAmount: number = 4;
  adivinado: boolean = false;

  constructor(private pokemonService: PokemonService,private dialog: MatDialog,private route: ActivatedRoute) {}

  togglePista() {
    this.isPistaVisible = !this.isPistaVisible; 
  }
  reduceBlur() {
    if (this.monedas >= 10 && this.blurAmount > 0) {
      this.monedas -= 10;
      this.blurAmount = Math.max(0, this.blurAmount - 2);
    }
  }

  returnBlur() {
    this.blurAmount = 5;
  }

  ngOnInit(): void {

    this.loadRandomPokemon();
    this.route.paramMap.subscribe(params => {
      this.nombre = params.get('nombre') || 'Invitado';
    });
  }

  addPista() {

    if(!this.isPistaVisible){
      this.isPistaVisible = true;
    }
    if (this.numPistas < this.pokeName.length && this.monedas >= 5) {
      this.numPistas++;
      this.monedas -= 5;
      this.revealRandomLetter();
    }
  }

  loadRandomPokemon(): void {
    this.returnBlur();
    this.pokemonService.getRandomPokemon().subscribe((data: any) => {
      this.pokemon = data;
      this.imageUrl = data.sprites.front_default;
      this.pokeName = this.pokemon.name;
    });
    this.numPistas = 0;
    this.loadLetras();
  }
  loadLetras() {
    this.letras = Array(this.pokeName.length).fill('_');

    for(var i = 0; i < this.pokeName.length; i++){
      if(this.pokeName.charAt(i).match('-')){
        this.letras[i] = '-';
      }else{
        this.letras[i] = '_';
      }
    }
  }

  revealRandomLetter() {
    const hiddenIndices = this.getHiddenIndices();
    if (hiddenIndices.length === 0) return;

    const randomPos = hiddenIndices[Math.floor(Math.random() * hiddenIndices.length)];
    this.letras[randomPos] = this.pokeName[randomPos];
  }

  private getHiddenIndices(): number[] {
    return this.letras
      .map((char, index) => char === '_' ? index : -1)
      .filter(index => index !== -1);
  }

  checkGuess(): void {
    if (this.currentDialogRef) {
      this.currentDialogRef.close();
    }
    if (this.guess.trim() === '') {
      return;
    }
    if (this.guess.toLowerCase() === this.pokemon.name.toLowerCase()) {
      this.dialog.open(ResultDialogComponent, {
        data: {
          title: '¡Correcto!',
          message: `Es ${this.pokemon.name}, ${this.nombre}, llevas racha de: ${this.racha}`,
        },
      });
      this.adivinado = true;
      this.monedas += 15;
      this.attempts = 3;
      this.racha ++;

      this.loadRandomPokemon();
      this.adivinado = false;
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
        }, 3000);
      } else {
        this.dialog.open(ResultDialogComponent, {
          data: {
            title: 'Inténtalo de nuevo!',
            message: `Te quedan ${this.attempts} intentos.`,
          },
        });
        this.monedas += 5;
        if(!this.isPistaVisible){
          this.isPistaVisible = true;
        }
        this.addPista();
      }
    }
    this.guess = '';
  }

  addToFavorites(): void {
    this.pokemonService.addToFavorites(this.pokemon, this.adivinado);
  }
}