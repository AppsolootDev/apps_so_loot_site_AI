import { Component, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { ServicesComponent } from '../services/services.component';
import { AboutComponent } from '../about/about.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { ClientsComponent } from '../clients/clients.component';
import { LocationMapComponent } from '../location-map/location-map.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    AboutComponent,
    PortfolioComponent,
    TestimonialsComponent,
    ClientsComponent,
    LocationMapComponent,
    FooterComponent,
  ],
  template: `
    <app-navbar></app-navbar>
    <main>
      <app-hero></app-hero>
      <app-services></app-services>
      <app-about></app-about>
      <app-portfolio></app-portfolio>
      <app-testimonials></app-testimonials>
      <app-clients></app-clients>
      <app-location-map></app-location-map>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`:host { display: block; } main { overflow: hidden; }`],
})
export class LandingComponent implements AfterViewInit {
  ngAfterViewInit() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('section:not(#home)').forEach(el => observer.observe(el));
  }
}
