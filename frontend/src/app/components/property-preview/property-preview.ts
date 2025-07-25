import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-preview',
  standalone: true,
  template: `
    <div class="property-preview">
      <h4>{{ getProperty()?.title }}</h4>
      <p>{{ getProperty()?.location }}</p>
    </div>
  `,
  styles: [`
    .property-preview {
      padding: 1rem;
    }
  `]
})

export class PropertyPreview {
  @Input() propertyId!: number;
  
  constructor(private authService: AuthService) {}

  getProperty() {
    return this.authService.getAllPropertyListings().find(p => p.id === this.propertyId);
  }
}