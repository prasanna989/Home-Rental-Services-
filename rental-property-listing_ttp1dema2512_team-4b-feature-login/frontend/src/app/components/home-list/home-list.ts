import { Component,Input, inject } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-list.html',
  styleUrl: './home-list.css'
})
export class HomeList {
  @Input() homes: Home[] = [];
  authService = inject(AuthService);

  constructor(private homeService: HomeService) {
    // Initialize with available homes if no input is provided
    if (!this.homes.length) {
      this.homes = this.homeService.getAvailableHomes();
    }
  }
}