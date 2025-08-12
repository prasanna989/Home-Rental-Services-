import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  adminLoginForm: FormGroup;
  error = '';
  infoMessage = '';
  returnUrl = '/';

  private readonly ADMIN_PASSKEY = '1234567890';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      passkey: ['', Validators.required]
    });

    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  onSubmit(): void {
  if (this.adminLoginForm.valid) {
    const { email, passkey } = this.adminLoginForm.value;

    // Get users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = storedUsers.some((u: any) => u.email === email);

    if (!emailExists) {
      this.error = 'Invalid email';
      this.infoMessage = '';
      return;
    }

    if (passkey !== this.ADMIN_PASSKEY) {
      this.error = 'Invalid passkey';
      this.infoMessage = '';
      return;
    }

    // Admin login success
    localStorage.setItem('adminLoggedIn', 'true');
    this.router.navigateByUrl('/admin/dashboard');
  } else {
    this.adminLoginForm.markAllAsTouched();
  }
}


}
