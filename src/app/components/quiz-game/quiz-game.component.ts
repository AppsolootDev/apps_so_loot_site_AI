import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, NgZone, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // For email input
import { Planet, PLANETS_DATA } from '../../data/planets.data';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  planet: Planet;
  factType: 'techDesc' | 'oneLiner' | 'history' | 'clientBenefit' | 'fact';
}

@Component({
  selector: 'app-quiz-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-game.component.html',
  styleUrl: './quiz-game.component.css'
})
export class QuizGameComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('quizCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() gameEnded = new EventEmitter<{ playAgain: boolean, enterSite: boolean }>();

  gameStarted = signal(false);
  currentQuestion = signal<QuizQuestion | null>(null);
  score = signal(0);
  wrongAnswers = signal(0);
  maxWrongAnswers = 2;
  planetsInPlay = signal<Planet[]>([]); // Planets currently orbiting in the canvas
  gameEndedState = signal(false);
  gameWon = signal(false);
  showEmailPrompt = signal(false);
  emailAddress = signal('');
  winCount = signal(0);

  private availablePlanetsForQuiz: Planet[] = [];
  private quizQuestions: QuizQuestion[] = [];
  private currentQuestionIndex = 0;
  private animFrameId = 0;
  private lastT = 0;
  private sunPosition: { cx: number; cy: number; r: number } | null = null;
  private stars: { x: number; y: number; size: number; opacity: number; twinkle: number }[] = [];
  private nebulaParticles: { x: number; y: number; size: number; color: string; speedX: number; speedY: number }[] = [];


  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    this.loadWinCount();
    // Shuffle planets for quiz questions
    this.availablePlanetsForQuiz = this.shuffleArray([...PLANETS_DATA]);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => this.initCanvas());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
  }

  startGame(): void {
    this.gameStarted.set(true);
    this.score.set(0);
    this.wrongAnswers.set(0);
    this.gameEndedState.set(false);
    this.gameWon.set(false);
    this.showEmailPrompt.set(false);
    this.emailAddress.set('');
    this.currentQuestionIndex = 0;

    // Reset planets in play and add the first one
    this.planetsInPlay.set([]);
    this.quizQuestions = []; // Clear previous questions

    this.generateQuestions();
    this.nextQuestion();
  }

  private generateQuestions(): void {
    const factsToUse: ('techDesc' | 'oneLiner' | 'history' | 'clientBenefit' | 'fact')[] =
      ['techDesc', 'oneLiner', 'history', 'clientBenefit', 'fact'];

    // Ensure we have enough unique planets for 5 questions
    const planetsForThisGame = this.shuffleArray([...PLANETS_DATA]).slice(0, 5);

    for (let i = 0; i < 5; i++) {
      const planet = planetsForThisGame[i];
      const factType = factsToUse[Math.floor(Math.random() * factsToUse.length)];
      const questionText = this.getQuestionText(planet, factType);
      const correctAnswer = planet[factType];

      const options = this.generateOptions(planet, factType, correctAnswer);

      this.quizQuestions.push({
        question: questionText,
        options: this.shuffleArray(options),
        correctAnswer: correctAnswer,
        planet: planet,
        factType: factType,
      });
    }
  }

  private getQuestionText(planet: Planet, factType: QuizQuestion['factType']): string {
    switch (factType) {
      case 'techDesc': return `Which technology is described as: "${planet.techDesc}"?`;
      case 'oneLiner': return `Which technology has this one-liner: "${planet.oneLiner}"?`;
      case 'history': return `Which technology has this historical fact: "${planet.history}"?`;
      case 'clientBenefit': return `Which technology offers this client benefit: "${planet.clientBenefit}"?`;
      case 'fact': return `Which planet is known for this fact: "${planet.fact}"?`;
      default: return `What is a key characteristic of ${planet.name}?`;
    }
  }

  private generateOptions(correctPlanet: Planet, factType: QuizQuestion['factType'], correctAnswer: string): string[] {
    const options = new Set<string>();
    options.add(correctAnswer);

    // Add incorrect options
    while (options.size < 4) {
      const randomPlanet = PLANETS_DATA[Math.floor(Math.random() * PLANETS_DATA.length)];
      let incorrectOption: string;

      if (factType === 'fact') {
        incorrectOption = randomPlanet.fact;
      } else {
        incorrectOption = randomPlanet[factType];
      }

      if (incorrectOption && incorrectOption !== correctAnswer) {
        options.add(incorrectOption);
      }
    }
    return Array.from(options);
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.quizQuestions.length) {
      const question = this.quizQuestions[this.currentQuestionIndex];
      this.currentQuestion.set(question);

      // Add the planet for the current question to planetsInPlay
      this.planetsInPlay.update(planets => {
        if (!planets.some(p => p.name === question.planet.name)) {
          return [...planets, question.planet];
        }
        return planets;
      });

      this.currentQuestionIndex++;
    } else {
      this.endGame(true); // All questions answered, game won
    }
  }

  checkAnswer(selectedAnswer: string): void {
    if (!this.currentQuestion()) return;

    if (selectedAnswer === this.currentQuestion()!.correctAnswer) {
      this.score.update(s => s + 1);
      alert('Correct!');
    } else {
      this.wrongAnswers.update(w => w + 1);
      alert(`Wrong! The correct answer was: "${this.currentQuestion()!.correctAnswer}"`);
    }

    if (this.wrongAnswers() >= this.maxWrongAnswers) {
      this.endGame(false);
    } else {
      this.nextQuestion();
    }
  }

  endGame(won: boolean): void {
    this.gameEndedState.set(true);
    this.gameWon.set(won);
    if (won) {
      this.winCount.update(c => c + 1);
      this.saveWinCount();
      if (this.winCount() >= 50) {
        this.showEmailPrompt.set(true);
      }
    }
  }

  playAgain(): void {
    this.gameEnded.emit({ playAgain: true, enterSite: false });
  }

  enterSite(): void {
    this.gameEnded.emit({ playAgain: false, enterSite: true });
  }

  submitEmail(): void {
    if (this.emailAddress().trim()) {
      alert(`Thank you for your email, ${this.emailAddress()}! We'll be in touch if you win the discount.`);
      // In a real app, you'd send this email to a backend service
      this.showEmailPrompt.set(false);
    } else {
      alert('Please enter a valid email address.');
    }
  }

  private loadWinCount(): void {
    const count = localStorage.getItem('quizWinCount');
    if (count) {
      this.winCount.set(parseInt(count, 10));
    }
  }

  private saveWinCount(): void {
    localStorage.setItem('quizWinCount', this.winCount().toString());
  }

  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // ─── Canvas drawing logic (adapted from HeroComponent) ─────────────────────────────────────────────

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.initNebulaParticles(canvas); // Re-initialize particles on resize
    };
    resize();
    window.addEventListener('resize', resize);

    this.stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }));
    this.initNebulaParticles(canvas);

    let startTime: number | null = null;

    const draw = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      const dt = Math.min(0.05, t - this.lastT);
      this.lastT = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.drawCrabNebula(ctx, canvas, t, dt); // Pass dt for particle movement
      this.drawStars(ctx, canvas, t); // Draw background stars
      this.drawQuestionMarkConstellation(ctx, canvas, t);
      this.drawSun(ctx, this.sunCenter(canvas).cx, this.sunCenter(canvas).cy, t);
      this.drawPlanetsInPlay(ctx, canvas, t);

      this.animFrameId = requestAnimationFrame(draw);
    };
    this.animFrameId = requestAnimationFrame(draw);
  }

  private initNebulaParticles(canvas: HTMLCanvasElement): void {
    this.nebulaParticles = [];
    const numParticles = 200; // More particles for a denser nebula
    const colors = ['rgba(255, 160, 0, 0.05)', 'rgba(255, 0, 0, 0.03)', 'rgba(255, 200, 100, 0.04)', 'rgba(200, 50, 0, 0.06)'];

    for (let i = 0; i < numParticles; i++) {
      this.nebulaParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 10 + 5, // Larger particles
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.5, // Slower, subtle movement
        speedY: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  private drawCrabNebula(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, dt: number): void {
    // Layer 1: Large, soft radial gradients for the main nebula shape
    const gradient1 = ctx.createRadialGradient(
      canvas.width * 0.4, canvas.height * 0.3, 0,
      canvas.width * 0.4, canvas.height * 0.3, Math.min(canvas.width, canvas.height) * 0.6
    );
    gradient1.addColorStop(0, 'rgba(255, 180, 0, 0.08)');
    gradient1.addColorStop(0.5, 'rgba(255, 100, 0, 0.04)');
    gradient1.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradient2 = ctx.createRadialGradient(
      canvas.width * 0.7, canvas.height * 0.7, 0,
      canvas.width * 0.7, canvas.height * 0.7, Math.min(canvas.width, canvas.height) * 0.5
    );
    gradient2.addColorStop(0, 'rgba(255, 0, 0, 0.06)');
    gradient2.addColorStop(0.5, 'rgba(200, 0, 0, 0.03)');
    gradient2.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Layer 2: Moving particles for a gaseous, swirling effect
    for (const p of this.nebulaParticles) {
      p.x += p.speedX * dt * 10; // Scale speed by dt
      p.y += p.speedY * dt * 10;

      // Wrap particles around the canvas
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.filter = `blur(${p.size / 3}px)`; // Apply blur for a softer look
      ctx.fill();
      ctx.filter = 'none'; // Reset filter
    }
  }

  private drawStars(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number): void {
    for (const s of this.stars) {
      const o = s.opacity * (0.55 + 0.45 * Math.sin(t * 1.3 + s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,230,255,${o})`;
      ctx.fill();
    }
  }

  private drawQuestionMarkConstellation(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number): void {
    const centerX = canvas.width * 0.75;
    const centerY = canvas.height * 0.25;
    const scale = Math.min(canvas.width, canvas.height) / 800;

    // Define points for the question mark (relative to centerX, centerY)
    // These are now just base positions, actual stars will be drawn from the background stars
    const questionMarkPoints = [
      { x: 0, y: -30 }, { x: 15, y: -40 }, { x: 25, y: -30 }, { x: 20, y: -10 },
      { x: 5, y: 0 }, { x: -10, y: 10 }, { x: -15, y: 20 }, { x: -10, y: 25 },
      { x: 0, y: 28 }, // End of curve
      { x: 0, y: 40 }  // Dot
    ];

    const constellationStars: { x: number; y: number; size: number; opacity: number; }[] = [];

    // Find nearby existing stars for the constellation points
    for (const qmp of questionMarkPoints) {
      const targetX = centerX + qmp.x * scale;
      const targetY = centerY + qmp.y * scale;

      // Find the closest existing star
      let closestStar = null;
      let minDist = Infinity;
      for (const s of this.stars) {
        const dist = Math.hypot(s.x - targetX, s.y - targetY);
        if (dist < minDist) {
          minDist = dist;
          closestStar = s;
        }
      }

      if (closestStar && minDist < 50 * scale) { // If a star is reasonably close
        constellationStars.push({
          x: closestStar.x,
          y: closestStar.y,
          size: closestStar.size * 1.8, // Make constellation stars brighter/larger
          opacity: closestStar.opacity * 1.5,
        });
      } else { // If no close star, create one at the target position
        constellationStars.push({
          x: targetX,
          y: targetY,
          size: Math.random() * 2 + 1.5,
          opacity: Math.random() * 0.5 + 0.5,
        });
      }
    }

    // Draw constellation stars with enhanced twinkle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < constellationStars.length; i++) {
      const star = constellationStars[i];
      const twinkleFactor = 0.55 + 0.45 * Math.sin(t * 2.5 + i * 0.5); // Faster twinkle
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * twinkleFactor, 0, Math.PI * 2);
      ctx.shadowBlur = star.size * 3;
      ctx.shadowColor = `rgba(75,200,232,${star.opacity * twinkleFactor})`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw starlight lines connecting stars
    ctx.strokeStyle = `rgba(75,200,232,${0.4 + Math.sin(t * 0.8) * 0.2})`; // Pulsing starlight
    ctx.lineWidth = 1.5 * scale;
    ctx.shadowBlur = 10 * scale;
    ctx.shadowColor = 'rgba(75,200,232,0.8)';

    ctx.beginPath();
    if (constellationStars.length > 0) {
      ctx.moveTo(constellationStars[0].x, constellationStars[0].y);
      for (let i = 1; i < constellationStars.length - 1; i++) { // Connect curve points
        ctx.lineTo(constellationStars[i].x, constellationStars[i].y);
      }
    }
    ctx.stroke();

    // Draw the dot separately (last point in questionMarkPoints)
    if (constellationStars.length > 0) {
      const dotStar = constellationStars[constellationStars.length - 1];
      ctx.beginPath();
      ctx.arc(dotStar.x, dotStar.y, dotStar.size * 0.8, 0, Math.PI * 2); // Slightly smaller dot
      ctx.fillStyle = `rgba(75,200,232,${0.8 + Math.sin(t * 1.2) * 0.2})`; // Pulsing dot
      ctx.fill();
    }

    ctx.shadowBlur = 0; // Reset shadow
  }

  private drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number): void {
    const sunRadius = 26 + Math.sin(t * 1.6) * 2;
    this.sunPosition = { cx, cy, r: sunRadius * 2 };

    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 230);
    halo.addColorStop(0, 'rgba(255,195,30,0.24)');
    halo.addColorStop(0.45, 'rgba(255,100,0,0.07)');
    halo.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.fillStyle = halo; ctx.fill();

    const r = sunRadius;
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    g.addColorStop(0, '#fffde0'); g.addColorStop(0.3, '#ffd000');
    g.addColorStop(0.72, '#ff7700'); g.addColorStop(1, 'rgba(255,50,0,0.4)');
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = g; ctx.fill();

    for (let i = 1; i <= 3; i++) {
      const cr = r + i * 9 + Math.sin(t * 2.2 + i * 1.1) * 2.5;
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,${170 - i * 28},0,${0.22 - i * 0.05})`;
      ctx.lineWidth = 1.2 - i * 0.2; ctx.stroke();
    }
  }

  private drawPlanetsInPlay(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number): void {
    const { cx, cy } = this.sunCenter(canvas);

    // Orbit rings for planets in play
    this.planetsInPlay().forEach(p => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180,210,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    const toRender = this.planetsInPlay().map(p => {
      const angle = t * p.speed + p.phase;
      return { p, angle, px: cx + p.rx * Math.cos(angle), py: cy + p.ry * Math.sin(angle) };
    });
    toRender.sort((a, b) => a.py - b.py);

    for (const { p, angle, px, py } of toRender) {
      const behind = Math.sin(angle) < 0;
      const ds = behind ? 0.78 : 1.0;
      ctx.globalAlpha = 1; // Always full opacity for quiz planets
      this.paintPlanet(ctx, px, py, p, ds, angle, cx, cy, t);
      ctx.globalAlpha = 1;
    }
  }

  private paintPlanet(
    ctx: CanvasRenderingContext2D,
    px: number, py: number,
    p: Planet,
    ds: number,
    angle: number,
    cx: number, cy: number,
    t: number
  ): void {
    const r = p.size * ds;
    if (p.hasRings) this.drawRingHalf(ctx, px, py, r, 'back');
    const atm = ctx.createRadialGradient(px, py, r * 0.7, px, py, r * 2.2);
    atm.addColorStop(0, 'transparent');
    atm.addColorStop(1, p.glow + '22');
    ctx.beginPath(); ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = atm; ctx.fill();
    const sph = ctx.createRadialGradient(px - r * 0.35, py - r * 0.35, r * 0.05, px + r * 0.1, py + r * 0.1, r);
    sph.addColorStop(0, p.c[0]);
    sph.addColorStop(0.5, p.c[1]);
    sph.addColorStop(1, p.c[2]);
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = sph; ctx.fill();

    // Planet specific drawings (Earth, Jupiter, Saturn bands)
    if (p.name === 'Earth') {
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.clip();
      const land = ctx.createLinearGradient(px - r, py, px + r, py);
      land.addColorStop(0,   'rgba(44,120,68,0.35)');
      land.addColorStop(0.4, 'transparent');
      land.addColorStop(0.7, 'rgba(44,120,68,0.25)');
      land.addColorStop(1,   'transparent');
      ctx.fillStyle = land; ctx.fillRect(px - r, py - r, r * 2, r * 2);
      ctx.restore();
    }
    if (p.name === 'Jupiter' || p.name === 'Saturn') {
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.clip();
      for (let b = -3; b <= 3; b++) {
        const by = py + b * r * 0.28;
        ctx.beginPath(); ctx.moveTo(px - r, by); ctx.lineTo(px + r, by);
        ctx.strokeStyle = b % 2 === 0 ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.07)';
        ctx.lineWidth = r * 0.15; ctx.stroke();
      }
      ctx.restore();
    }

    if (p.hasRings) this.drawRingHalf(ctx, px, py, r, 'front');

    const hi = ctx.createRadialGradient(px - r * 0.38, py - r * 0.38, 0, px, py, r);
    hi.addColorStop(0, 'rgba(255,255,255,0.32)');
    hi.addColorStop(0.45, 'transparent');
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = hi; ctx.fill();

    // Planet name label
    const lblY = py + r * ds + 4;
    ctx.font = `500 ${Math.max(8, Math.round(9 * ds))}px Orbitron, sans-serif`;
    ctx.fillStyle = p.glow + 'cc';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(p.name, px, lblY);

    // Satellites (simplified for quiz)
    if (p.sats) {
      for (const sat of p.sats) {
        const sa = t * sat.speed + sat.phase;
        const sx = px + sat.rx * ds * Math.cos(sa);
        const sy = py + sat.ry * ds * Math.sin(sa);
        const sg = ctx.createRadialGradient(sx - sat.size * 0.3, sy - sat.size * 0.3, 0, sx, sy, sat.size);
        sg.addColorStop(0, sat.color); sg.addColorStop(1, sat.color + '88');
        ctx.beginPath(); ctx.arc(sx, sy, sat.size * ds, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();
      }
    }
  }

  private drawRingHalf(ctx: CanvasRenderingContext2D, px: number, py: number, r: number, half: 'front' | 'back'): void {
    const [start, end] = half === 'back' ? [Math.PI, Math.PI * 2] : [0, Math.PI];
    for (let ri = 0; ri < 3; ri++) {
      const rr = r * (1.8 + ri * 0.25);
      ctx.beginPath();
      ctx.ellipse(px, py, rr, rr * 0.32, 0, start, end);
      ctx.strokeStyle = `rgba(200,180,130,${0.50 - ri * 0.12})`;
      ctx.lineWidth = r * (0.18 - ri * 0.03);
      ctx.stroke();
    }
  }

  private sunCenter(canvas: HTMLCanvasElement) {
    return { cx: canvas.width * 0.5, cy: canvas.height * 0.52 };
  }
}
