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
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.error = '';
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const formValue = this.signupForm.value;

    // Call backend API via AuthService
    this.authService.signup(formValue).subscribe({
      next: () => {
        // On success redirect to login page
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  signUpWithGoogle(): void {
    alert('Google sign-up clicked!');
  }
}
