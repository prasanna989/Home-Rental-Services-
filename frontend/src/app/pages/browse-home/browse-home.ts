import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-browse-home',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './browse-home.html',
  styleUrls: ['./browse-home.css']
})
export class BrowseHome implements OnInit {
  homes: Home[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homeService.getAvailableHomes().subscribe(homes => {
      this.homes = homes;
    });
  }
}