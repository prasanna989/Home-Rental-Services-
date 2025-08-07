import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  title = 'Find Your Perfect Home';
  constructor(private router: Router) {}

  goToBrowseHome() {
    this.router.navigate(['/browse-home']);
  }
}
