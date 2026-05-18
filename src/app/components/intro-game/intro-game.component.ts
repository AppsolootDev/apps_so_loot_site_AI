import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-intro-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './intro-game.component.html',
  styleUrl: './intro-game.component.css'
})
export class IntroGameComponent {
  @Output() gameChosen = new EventEmitter<boolean>();
  showIntro = signal(true);

  playGame() {
    this.showIntro.set(false);
    this.gameChosen.emit(true);
  }

  enterApp() {
    this.showIntro.set(false);
    this.gameChosen.emit(false);
  }
}
