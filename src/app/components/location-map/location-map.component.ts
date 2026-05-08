import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-location-map',
  standalone: true,
  imports: [],
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

  constructor() {
    const sanitizer = inject(DomSanitizer);
    this.mapUrl = sanitizer.bypassSecurityTrustResourceUrl(
      'https://www.openstreetmap.org/export/embed.html?bbox=28.228%2C-25.790%2C28.258%2C-25.775&layer=mapnik&marker=-25.7826%2C28.2429'
    );
  }
}
