import { Component, HostListener, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`:host { display: block; }`],
})
export class App implements AfterViewInit {
  private customCursor!: HTMLElement;
  private crosshairH!: HTMLElement; // New property for horizontal crosshair
  private crosshairV!: HTMLElement; // New property for vertical crosshair
  private locationCard!: HTMLElement;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.customCursor = this.document.getElementById('custom-cursor') as HTMLElement;
    this.crosshairH = this.document.getElementById('crosshair-h') as HTMLElement; // Initialize
    this.crosshairV = this.document.getElementById('crosshair-v') as HTMLElement; // Initialize
    this.locationCard = this.document.getElementById('location-card') as HTMLElement;

    if (this.locationCard) {
      this.locationCard.style.display = 'block'; // Make location card visible
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.customCursor) {
      this.customCursor.style.left = `${event.clientX}px`;
      this.customCursor.style.top = `${event.clientY}px`;
    }
    if (this.crosshairH) {
      this.crosshairH.style.top = `${event.clientY}px`; // Update horizontal crosshair position
    }
    if (this.crosshairV) {
      this.crosshairV.style.left = `${event.clientX}px`; // Update vertical crosshair position
    }

    if (this.locationCard) {
      this.locationCard.innerHTML = `
        <div>X: ${event.clientX}</div>
        <div>Y: ${event.clientY}</div>
      `;
    }
  }
}
