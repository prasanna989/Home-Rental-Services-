import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  name = '';
  email = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.authService.signup(this.name, this.email, this.password)) {
      this.router.navigate(['/']);
    } else {
      this.error = 'Email already exists';
    }
  }
}
