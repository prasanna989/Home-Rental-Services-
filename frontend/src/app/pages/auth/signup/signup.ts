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
  submitted = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    });
  }

  onSubmit() {
  this.submitted = true;

  if (this.signupForm.invalid) {
    this.signupForm.markAllAsTouched(); 
    return;
  }

  const { name, email, password, phone } = this.signupForm.value;
  const success = this.authService.signup(name, email, password, phone);
  if (success) {
    this.router.navigate(['/']);
  } else {
    this.error = 'Email already exists';
  }
}

  signUpWithGoogle() {
    // Integrate Firebase or Google OAuth API
    alert('Google sign-up clicked!');
  }
}

