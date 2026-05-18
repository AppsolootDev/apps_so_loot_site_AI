import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TitleAnimationDirective } from '../../directives/title-animation.directive'; // Import the new directive
import { CommonModule } from '@angular/common'; // Import CommonModule for @for

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    TitleAnimationDirective
  ],
  templateUrl: './location-map.component.html',
  styleUrl: './location-map.component.css'
})
export class LocationMapComponent {
  address = '767 Norman Eaton Avenue';
  suburb = 'Phillip Nel Park, Pretoria';
  postalCode = '0184';
  phone = '+2772 438 9229';
  email = 'gabriel@appsoloot.co.za';
  mapUrl: SafeResourceUrl;

  // Add titleChars for animation
  readonly titleChars = 'Our Location'.split('').map((char, i) => ({ char, i }));

  constructor() {
    const sanitizer = inject(DomSanitizer);
    this.mapUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.openstreetmap.org/export/embed.html?bbox=28.138312%2C-25.732047%2C28.138312%2C-25.732047&layer=mapnik&marker=-25.732047%2C28.138312'
    );
  }
}
