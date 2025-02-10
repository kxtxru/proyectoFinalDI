import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common'; 
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResultDialogComponent } from '../result-dialog/result-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { pokemonstate } from '../../services/pokemonstate.service';

@Component({
  selector: 'app-adivina',
  standalone: true, 
  imports: [FormsModule, CommonModule],
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
  pokeName: string = "";
  isPistaVisible: boolean = false;
  private numPistas = 0;
  monedas: number = 0;
  blurAmount: number = 4;
  adivinado: boolean = false;

  constructor(private pokemonService: PokemonService,private dialog: MatDialog,private route: ActivatedRoute, private pokemonstate: pokemonstate) {}

  togglePista() {
    this.isPistaVisible = !this.isPistaVisible; 
  }
  reduceBlur() {
    if (this.monedas >= 10 && this.blurAmount > 0) {
      this.monedas -= 10;
      this.updateMonedas();
      this.blurAmount = Math.max(0, this.blurAmount - 2);
    }
  }

  returnBlur() {
    this.blurAmount = 5;
  }

  ngOnInit(): void {
    // Verifica si ya hay un Pokémon cargado en el estado
    const savedPokemon = this.pokemonstate.getCurrentPokemon();
    if (savedPokemon) {
      this.pokemon = savedPokemon;
      this.imageUrl = savedPokemon.sprites.front_default;
      this.pokeName = savedPokemon.name;
      this.loadLetras();
    } else {
      this.loadRandomPokemon(); // Si no hay Pokémon guardado, carga uno nuevo
    }

    this.route.paramMap.subscribe(params => {
      this.nombre = params.get('nombre') || 'Invitado';
    });

    const savedMonedas = localStorage.getItem('monedas');
    this.monedas = savedMonedas ? parseInt(savedMonedas, 10) : 0;
  }

  addPista() {

    if(!this.isPistaVisible){
      this.isPistaVisible = true;
    }
    if (this.numPistas < this.pokeName.length && this.monedas >= 5) {
      this.numPistas++;
      this.monedas -= 5;
      this.updateMonedas();
      this.revealRandomLetter();
    }
  }

  loadRandomPokemon(): void {
    this.returnBlur();
    this.pokemonService.getRandomPokemon().subscribe((data: any) => {
      this.pokemon = data;
      this.imageUrl = data.sprites.front_default;
      this.pokeName = this.pokemon.name;
      this.pokemonstate.setCurrentPokemon(this.pokemon);
      this.loadLetras();
    });
    this.numPistas = 0;
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
      this.addToHistorial();
      this.adivinado = true;
      this.monedas += 5;
      this.updateMonedas();
      this.attempts = 3; // Resetea los intentos al valor inicial
      this.racha++;
  
      this.loadRandomPokemon(); // Carga un nuevo Pokémon
      this.adivinado = false;
    } else {
      this.attempts--; // Decrementa los intentos
  
      if (this.attempts === 0) {
        // Si no quedan intentos
        this.dialog.open(ResultDialogComponent, {
          data: {
            title: '¡Perdiste!',
            message: `Era ${this.pokemon.name}`,
          },
        });
  
        // Resetear el estado del juego para el siguiente intento
        this.resetGameState(); // Se resetean los valores necesarios sin recargar la página
  
      } else {
        // Si aún quedan intentos
        this.dialog.open(ResultDialogComponent, {
          data: {
            title: 'Inténtalo de nuevo!',
            message: `Te quedan ${this.attempts} intentos.`,
          },
        });
        this.monedas += 5;
        if (!this.isPistaVisible) {
          this.isPistaVisible = true;
        }
        this.addPista();
      }
    }
  
    this.guess = ''; // Limpia la suposición para el siguiente intento
  }

  resetGameState(): void {
    this.attempts = 3;
    this.numPistas = 0;
    this.isPistaVisible = false;
    this.guess = ''; 
    this.loadRandomPokemon(); 
    this.loadLetras();
    this.racha = 1;
    if(this.monedas > 20){
      this.monedas -= 20;
    } else {
      this.monedas = 0;
    }
  }

  addToFavorites(): void {
    this.pokemonstate.addFavorite(this.pokemon); 
  }

  addToHistorial(): void {
    this.pokemonstate.addToHistorial(this.pokemon);
  }
  updateMonedas(): void {
    localStorage.setItem('monedas', this.monedas.toString());
  }
  
}