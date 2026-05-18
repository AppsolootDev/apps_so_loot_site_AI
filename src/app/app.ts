import { Component, HostListener, AfterViewInit, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { IntroGameComponent } from './components/intro-game/intro-game.component';
import { LandingComponent } from './components/landing/landing.component';
import { QuizGameComponent } from './components/quiz-game/quiz-game.component'; // Import QuizGameComponent

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IntroGameComponent, LandingComponent, QuizGameComponent], // Add QuizGameComponent
  template: `
    @if (showIntroScreen()) {
      <app-intro-game (gameChosen)="handleGameChoice($event)"></app-intro-game>
    } @else if (playingGame()) {
      <app-quiz-game (gameEnded)="handleQuizGameEnded($event)"></app-quiz-game>
    } @else {
      <app-landing></app-landing>
    }
  `,
  styles: [`:host { display: block; }`],
})
export class App implements AfterViewInit {
  private customCursor!: HTMLElement;
  private crosshairH!: HTMLElement;
  private crosshairV!: HTMLElement;
  private locationCard!: HTMLElement;

  showIntroScreen = signal(true);
  playingGame = signal(false); // New signal to control quiz visibility

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngAfterViewInit(): void {
    this.customCursor = this.document.getElementById('custom-cursor') as HTMLElement;
    this.crosshairH = this.document.getElementById('crosshair-h') as HTMLElement;
    this.crosshairV = this.document.getElementById('crosshair-v') as HTMLElement;
    this.locationCard = this.document.getElementById('location-card') as HTMLElement;

    if (this.locationCard) {
      this.locationCard.style.display = 'block';
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.customCursor) {
      this.customCursor.style.left = `${event.clientX}px`;
      this.customCursor.style.top = `${event.clientY}px`;
    }
    if (this.crosshairH) {
      this.crosshairH.style.top = `${event.clientY}px`;
    }
    if (this.crosshairV) {
      this.crosshairV.style.left = `${event.clientX}px`;
    }

    if (this.locationCard) {
      this.locationCard.innerHTML = `
        <div>X: ${event.clientX}</div>
        <div>Y: ${event.clientY}</div>
      `;
    }
  }

  handleGameChoice(playGame: boolean) {
    this.showIntroScreen.set(false);
    this.playingGame.set(playGame); // Set playingGame based on user's choice
    if (playGame) {
      console.log('User chose to play the game!');
    } else {
      console.log('User chose to enter the application.');
    }
  }

  handleQuizGameEnded(event: { playAgain: boolean, enterSite: boolean }) {
    if (event.playAgain) {
      this.playingGame.set(true); // Restart the game
    } else if (event.enterSite) {
      this.playingGame.set(false); // Go to the main application
    }
  }
}
