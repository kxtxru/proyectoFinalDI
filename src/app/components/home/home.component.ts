import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(private router: Router) {}

  jugarComoInvitado(): void {
    this.router.navigate(['/adivina']);
  }

  iniciarSesion(): void {
    this.router.navigate(['/login']);
  }
}


