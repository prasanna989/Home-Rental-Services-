import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from '../../services/home.service';
import { Home } from '../../models/home.model';

@Component({
  selector: 'app-browse-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './browse-home.html',
  styleUrls: ['./browse-home.css']
})
export class BrowseHome implements OnInit {
  homes: Home[] = [];

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.homes = this.homeService.getAvailableHomes();
  }
}
