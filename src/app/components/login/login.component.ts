import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';  // Importamos el Router

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login(): void {
    this.router.navigate(['/adivina']);
  }
}
