import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class Signup implements OnInit {
  signupForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {

    if (typeof window === 'undefined') {
    console.warn('Running in server mode, skipping signup logic.');
    return;
  }
    if (this.signupForm.valid) {
      const { name, email, password, phone } = this.signupForm.value;

      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');

      // Check if email already exists
      const emailExists = users.some((u: any) => u.email === email);
      if (emailExists) {
        this.error = 'Email already exists';
        return;
      }

      // Push new user
      users.push({ name, email, phone, password });
      localStorage.setItem('users', JSON.stringify(users));

      // Optional: Also use AuthService if needed
      this.authService.signup(name, email, password, phone);

      // Redirect
      this.router.navigate(['/']);
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  signUpWithGoogle(): void {
    alert('Google sign-up clicked!');
  }
}
