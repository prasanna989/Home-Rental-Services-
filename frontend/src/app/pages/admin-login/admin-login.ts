import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-admin-login',
  standalone:true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrls: ['./admin-login.css']
})
export class AdminLogin {
  email = '';
    password = '';
    error = '';
    returnUrl = '/';
  
    constructor(
      private authService: AuthService, 
      private router: Router,
      private route: ActivatedRoute
    ) {
      
      this.route.queryParams.subscribe(params => {
        this.returnUrl = params['returnUrl'] || '/';
      });
    }
  
    onSubmit() {
      if (this.authService.login(this.email, this.password)) {
        this.router.navigateByUrl('/admin/dashboard');
      } else {
        this.error = 'Invalid email or password';
      }
  }

}
