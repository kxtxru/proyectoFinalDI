import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  password: string = '';
  username: string = '';
  loginForm!: FormGroup;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }
  

  login(): void {
    if (this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      console.log('Usuario:', username); 

      this.router.navigate(['/adivina', username]);
    }
  }
}
