import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdivinaComponent } from './components/adivina/adivina.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; 
import { ResultDialogComponent } from './components/result-dialog/result-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AdivinaComponent, MatDialogModule, ResultDialogComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoFinalDI';
}
