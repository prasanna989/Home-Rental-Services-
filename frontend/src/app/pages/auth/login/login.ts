import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {
  loginForm: FormGroup;
  error = '';
  returnUrl = '/';
  selectedRole: 'owner' | 'tenant' | '' = '';  // New

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  selectRole(role: 'owner' | 'tenant') {
    this.selectedRole = role;
  }

  showRoleError = false;

  onSubmit() {
  if (!this.selectedRole) {
    this.showRoleError = true;
    return;
  }
  
  this.showRoleError = false;

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;
    const role: 'owner' | 'tenant' = this.selectedRole;

    this.authService.login(email, password, role).subscribe({
  next: (res: any) => {
    // Redirect based on selected role
    if (role === 'owner') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  },
  error: (err) => {
    this.error = err.error?.message || 'Invalid email or password';
  }
});

  } else {
    this.loginForm.markAllAsTouched();
  }
}

}
