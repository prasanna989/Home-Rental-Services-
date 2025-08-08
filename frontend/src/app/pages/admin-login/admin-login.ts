import { Component, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  email: string = '';
  password: string = '';
  error: string = '';
  returnUrl: string = '/';

  isLoggedIn = computed(() => this.authService.isAuthenticated());
  currentUser = computed(() => this.authService.currentUser());

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  onSubmit(): void {
    const success = this.authService.login(this.email, this.password);

    if (success) {
      this.router.navigateByUrl('/admin/dashboard');
    } else {
      this.error = 'Invalid email or password';
    }
  }
}
