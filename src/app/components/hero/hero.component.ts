import {
  Component, signal, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener, NgZone
} from '@angular/core';
import { Planet, PLANETS_DATA } from '../../data/planets.data'; // Import Planet interface and PLANETS_DATA

interface Slide {
  id: number; name: string; tagline: string; description: string;
  features: string[]; icon: 'ai' | 'angular' | 'flutter' | 'figma';
  color: string; bg: string;
}

interface Star {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; twinkle: number;
}

interface ShootingStar {
  x: number; y: number; dx: number; dy: number;
  trail: number; life: number; decay: number;
  color: string; label: string;
}

interface Satellite {
  name: string; rx: number; ry: number;
  speed: number; phase: number; size: number; color: string;
}

interface ProjectUsage {
  name: string;
  type: 'web' | 'mobile' | 'ai' | 'backend' | 'design';
}

interface HoverInfo {
  name: string; tech: string; techAbbr: string;
  fact: string; techDesc: string; usedIn: ProjectUsage[];
  color: string; x: number; y: number;
}

interface TeamMember {
  emoji: string;
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  handle: string;
  yearsExperience: number;
  linkedinProfilePic: string;
  behanceIcon: string;
  instagramIcon: string;
  xIcon: string;
  facebookIcon: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('heroCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('heroBg') bgRef!: ElementRef<HTMLDivElement>;

  currentSlide = signal(0);
  typedText = signal('');
  statValues = signal([0, 0, 0]);
  cardVisible = signal(true);
  introComplete = signal(false);
  hoveredPlanet = signal<HoverInfo | null>(null);
  selectedPlanet = signal<Planet | null>(null);
  showRocketCard = signal(false);
  showAstronautCard = signal(false);
  showTeamModal = signal(false);
  teamIndex = signal(0);
  rocketPinned = false;
  astroPinned = false;
  planetsAligned = signal(false);
  private sunAlignedTimeout: any;

  readonly teamMembers: TeamMember[] = [
    {
      emoji: '👽',
      name: 'Mr LGM Matabane',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack engineer and founder of AppSoLoot. Designs and ships Angular dashboards, Flutter mobile apps and AI integrations for clients across transport, legal and hospitality. LGM brings a product-first mindset to every sprint — from whiteboard to production deployment.',
      linkedin: 'https://www.linkedin.com/in/leextremist',
      handle: '@leextremist',
      yearsExperience: 10,
      behanceIcon: '',
      linkedinProfilePic: 'https://media.licdn.com/dms/image/v2/D4D03AQGfIr5Ew_szMw/profile-displayphoto-crop_800_800/B4DZlT4V5fJAAM-/0/1758048903781?e=1779926400&v=beta&t=iaAld9rUqdq-fFUz7wu_wUxQQAbxcYL6OtKMIaPg8sc',
      instagramIcon: '/assets/icons/instagram.png',
      xIcon: '/assets/icons/twitter.png',
      facebookIcon: '/assets/icons/facebook.png',
    },
    {
      emoji: '👾',
      name: 'Ms Melvin Modiselle',
      role: 'Creative Developer & Co-Founder',
      bio: 'Co-founder and creative developer at AppSoLoot. Designs component systems in Figma, implements them in Angular and obsesses over the micro-interactions that make software feel premium. Bridges the gap between design and engineering without the traditional handoff overhead.',
      linkedin: 'https://www.linkedin.com/in/melvin-m-3b090024a',
      handle: '@Melvin_modiselle',
      yearsExperience: 8,
      behanceIcon: '/assets/icons/behance.png',
      linkedinProfilePic: 'https://media.licdn.com/dms/image/v2/D4D03QHPMvXx0MZP4A/profile-displayphoto-crop_800_800/B4DZk3qh3BG8AI-/0/1757575521575?e=1779926400&v=beta&t=QaMVT9bAWqhR73O9Ls11MCWXIOGHmskvXCpcXKHB-x8',
      instagramIcon: '/assets/icons/instagram.png',
      xIcon: '/assets/icons/twitter.png',
      facebookIcon: '/assets/icons/facebook.png',
    },
  ];

  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private typeTimeout: ReturnType<typeof setTimeout> | null = null;
  private animFrameId = 0;
  private stars: Star[] = [];
  private shootingStars: ShootingStar[] = [];
  private transitioning = false;
  private introEnded = false;
  private lastT = 0;
  private nextShotAt = 3 + Math.random() * 2;

  /** Canvas-space positions of each planet, updated every frame */
  private planetPositions: { name: string; px: number; py: number; r: number; p: Planet }[] = [];
  /** Frozen angle per planet when hovered (planet name → angle) */
  private frozenAngles = new Map<string, number>();

  private readonly INTRO_DURATION = 10;

  private readonly clientColors = [
    { color: '#4bc8e8', label: 'Lociware' },
    { color: '#9f7aea', label: 'Zarbiter' },
    { color: '#c5f219', label: 'Chozen One' },
    { color: '#54c5f8', label: 'Patron Assist' },
  ];

  private readonly planets: Planet[] = PLANETS_DATA; // Use imported PLANETS_DATA

  slides: Slide[] = [
    {
      id: 0, name: 'AI Solutions', tagline: 'Intelligent Automation',
      description: 'We harness large language models, machine learning, and predictive analytics to build AI systems that automate decisions, surface insights, and transform entire business operations.',
      features: ['LLM & ChatGPT Integration', 'Predictive Analytics', 'NLP & AI Chatbots', 'Workflow Automation'],
      icon: 'ai', color: '#9f7aea',
      bg: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(159,122,234,0.18) 0%, transparent 70%)'
    },
    {
      id: 1, name: 'Angular Web Apps', tagline: 'Enterprise-Grade Web',
      description: 'Scalable, blazing-fast web applications built with Angular 17+ — featuring fully responsive design, Progressive Web App (PWA) capabilities, real-time dashboards, and API-first architecture.',
      features: ['Responsive Design', 'Progressive Web Apps', 'Real-time Dashboards', 'API Integration'],
      icon: 'angular', color: '#f05340',
      bg: 'radial-gradient(ellipse 80% 60% at 40% 40%, rgba(240,83,64,0.18) 0%, transparent 70%)'
    },
    {
      id: 2, name: 'Flutter Mobile', tagline: 'Cross-Platform Native',
      description: 'Beautiful, native-feeling mobile apps for iOS and Android from a single Flutter codebase — delivering pixel-perfect UI, offline-first architecture, and seamless OS-level integrations.',
      features: ['iOS & Android Native', 'Offline-First Architecture', 'Push Notifications', 'App Store Deployment'],
      icon: 'flutter', color: '#54c5f8',
      bg: 'radial-gradient(ellipse 80% 60% at 60% 60%, rgba(84,197,248,0.18) 0%, transparent 70%)'
    },
    {
      id: 3, name: 'Figma Design', tagline: 'UI/UX Excellence',
      description: 'From user research and wireframing to polished design systems and pixel-perfect Figma prototypes — we craft interfaces that delight users and hand off cleanly to developers.',
      features: ['UX Research & Strategy', 'Design Systems', 'Interactive Prototypes', 'Responsive Layouts'],
      icon: 'figma', color: '#f24e1e',
      bg: 'radial-gradient(ellipse 80% 60% at 40% 60%, rgba(242,78,30,0.18) 0%, transparent 70%)'
    },
  ];

  line1Letters = 'WE BUILD'.split('').map((c, i) => ({
    char: c === ' ' ? ' ' : c, delay: `${i * 0.07}s`
  }));
  line2Letters = 'THE FUTURE'.split('').map((c, i) => ({
    char: c === ' ' ? ' ' : c, delay: `${0.56 + i * 0.07}s`
  }));

  readonly subtitles = [
    'AI-powered solutions, enterprise web apps, native mobile experiences and Figma-crafted design.',
    'Responsive. Intelligent. Beautiful. Built by AppSoLoot.'
  ];

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.startSlider();
    this.typeText(0);
    this.setBodyCursor('url("/assets/ufo-icon.png") 8 8, auto'); // Corrected path
  }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initCanvas());
    this.animateStats();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    cancelAnimationFrame(this.animFrameId);
    if (this.sunAlignedTimeout) clearTimeout(this.sunAlignedTimeout);
    this.setBodyCursor('default');
  }

  private startSlider() {
    this.slideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.cardVisible.set(false);
    setTimeout(() => {
      this.currentSlide.update(v => (v + 1) % this.slides.length);
      this.cardVisible.set(true);
      this.transitioning = false;
    }, 400);
  }

  goToSlide(i: number) {
    if (this.transitioning || i === this.currentSlide()) return;
    this.transitioning = true;
    this.cardVisible.set(false);
    if (this.slideInterval) clearInterval(this.slideInterval);
    setTimeout(() => {
      this.currentSlide.set(i);
      this.cardVisible.set(true);
      this.transitioning = false;
      this.startSlider();
    }, 400);
  }

  private typeText(idx: number) {
    const text = this.subtitles[idx % this.subtitles.length];
    let i = 0;
    this.typedText.set('');
    const type = () => {
      if (i <= text.length) {
        this.typedText.set(text.slice(0, i++));
        this.typeTimeout = setTimeout(type, 28);
      }
    };
    this.typeTimeout = setTimeout(type, 1200);
  }

  private animateStats() {
    const targets = [50, 30, 5];
    const start = performance.now();
    const update = (now: number) => {
      const p = Math.min((now - start) / 2000, 1);
      const e = 1 - Math.pow(1 - p, 4);
      this.statValues.set(targets.map(t => Math.round(t * e)));
      if (p < 1) requestAnimationFrame(update);
    };
    setTimeout(() => requestAnimationFrame(update), 800);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    this.stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.07,
      vy: (Math.random() - 0.5) * 0.07,
      size: Math.random() * 2.4 + 0.2,
      opacity: Math.random() * 0.7 + 0.15,
      twinkle: Math.random() * Math.PI * 2,
    }));

    let startTime: number | null = null;

    const draw = (ts: number) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) / 1000;
      const dt = Math.min(0.05, t - this.lastT);
      this.lastT = t;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (t < this.INTRO_DURATION) {
        this.drawIntro(ctx, canvas, t);
      } else {
        if (!this.introEnded) {
          this.introEnded = true;
          this.ngZone.run(() => this.introComplete.set(true));
        }
        this.drawNormal(ctx, canvas, t - this.INTRO_DURATION, dt);
      }
      this.animFrameId = requestAnimationFrame(draw);
    };
    this.animFrameId = requestAnimationFrame(draw);
  }

  private drawIntro(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number) {
    const { cx, cy } = this.sunCenter(canvas);
    const bgP = this.ease(this.clamp01((t - 0.3) / 2.9));
    ctx.fillStyle = `rgb(${Math.round(255 + (7-255)*bgP)},${Math.round(255+(14-255)*bgP)},${Math.round(255+(26-255)*bgP)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const sunA = this.clamp01((t - 0.5) / 1.7);
    if (sunA > 0) { ctx.globalAlpha = sunA; this.drawSun(ctx, cx, cy, t); ctx.globalAlpha = 1; }

    const pending: { p: Planet; px: number; py: number; alpha: number }[] = [];

    for (let i = 0; i < this.planets.length; i++) { // Use this.planets
      const rs = 2.5 + i * 0.8;
      if (t < rs) break;
      const pl = this.planets[i]; // Use this.planets
      const ringP = this.clamp01((t - rs) / 0.55);

      ctx.beginPath();
      ctx.ellipse(cx, cy, pl.rx, pl.ry, 0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * ringP);
      ctx.strokeStyle = 'rgba(180,210,255,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      const pA = this.easeBack(this.clamp01((t - rs - 0.38) / 0.45));
      if (pA > 0) {
        pending.push({
          p: pl,
          px: cx + pl.rx * Math.cos(pl.phase),
          py: cy + pl.ry * Math.sin(pl.phase),
          alpha: Math.min(1, pA),
        });
      }
    }

    pending.sort((a, b) => a.py - b.py);
    for (const { p, px, py, alpha } of pending) {
      ctx.globalAlpha = alpha;
      this.paintPlanet(ctx, px, py, p, 1.0, p.phase, cx, cy, 0);
      ctx.globalAlpha = 1;
    }
  }

  private drawNormal(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, dt: number) {
    const { cx, cy } = this.sunCenter(canvas);
    const starFade = Math.min(1, t / 2);
    for (const s of this.stars) {
      s.x = (s.x + s.vx + canvas.width) % canvas.width;
      s.y = (s.y + s.vy + canvas.height) % canvas.height;
      const o = s.opacity * starFade * (0.55 + 0.45 * Math.sin(t * 1.3 + s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(215,230,255,${o})`;
      ctx.fill();
    }

    this.tickShootingStars(ctx, canvas, t, dt);
    this.drawSun(ctx, cx, cy, t);

    for (const p of this.planets) { // Use this.planets
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180,210,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    this.planetPositions = [];
    const toRender = this.planets.map(p => { // Use this.planets
      let angle = this.frozenAngles.has(p.name)
        ? this.frozenAngles.get(p.name)!
        : t * p.speed + p.phase;

      if (this.planetsAligned()) {
        angle = Math.PI / 2;
      }

      return { p, angle, px: cx + p.rx * Math.cos(angle), py: cy + p.ry * Math.sin(angle) };
    });
    toRender.sort((a, b) => a.py - b.py);

    const sel = this.selectedPlanet();
    for (const { p, angle, px, py } of toRender) {
      const behind = Math.sin(angle) < 0;
      const ds = behind ? 0.78 : 1.0;
      const isSelected = sel?.name === p.name;
      const da = sel ? (isSelected ? 1.0 : 0.22) : (behind ? 0.55 : 1.0);

      // Assuming all planets are clickable by default, or you'd add a 'clickable' property to Planet interface
      // if (!p.clickable) {
      //   ctx.globalAlpha = da * 0.4;
      // } else {
        ctx.globalAlpha = da;
      // }

      this.paintPlanet(ctx, px, py, p, ds, angle, cx, cy, t);
      if (isSelected) {
        const r = p.size * ds;
        const pulse = 1 + 0.18 * Math.sin(t * 4);
        ctx.globalAlpha = 0.55 + 0.3 * Math.sin(t * 4);
        ctx.beginPath();
        ctx.arc(px, py, r * 1.6 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = p.glow;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, r * 2.2 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = p.glow + '55';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      this.planetPositions.push({ name: p.name, px, py, r: p.size * ds, p });
    }
  }

  private drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
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

  private sunPosition: { cx: number; cy: number; r: number } | null = null;

  private paintPlanet(
    ctx: CanvasRenderingContext2D,
    px: number, py: number,
    p: Planet,
    ds: number,
    angle: number,
    cx: number, cy: number,
    t: number
  ) {
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

    if (t > 0) {
      const br = Math.max(7, r * 0.42);
      const bx = px + r * 0.70;
      const by = py + r * 0.70;
      ctx.beginPath();
      ctx.arc(bx, by, br + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(7,14,26,0.90)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.strokeStyle = p.glow;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.font = `700 ${Math.max(5, Math.round(br * 0.70))}px Inter, sans-serif`;
      ctx.fillStyle = p.glow;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.techAbbr, bx, by);
    }

    const lblY = py + r * ds + 4;
    ctx.font = `500 ${Math.max(8, Math.round(9 * ds))}px Inter, sans-serif`;
    ctx.fillStyle = p.glow + 'cc';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(p.name, px, lblY);

    if (p.sats && t > 0) {
      for (const sat of p.sats) {
        const sa = t * sat.speed + sat.phase;
        const sx = px + sat.rx * ds * Math.cos(sa);
        const sy = py + sat.ry * ds * Math.sin(sa);
        ctx.beginPath(); ctx.ellipse(px, py, sat.rx * ds, sat.ry * ds, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.7; ctx.stroke();
        const sg = ctx.createRadialGradient(sx - sat.size * 0.3, sy - sat.size * 0.3, 0, sx, sy, sat.size);
        sg.addColorStop(0, sat.color); sg.addColorStop(1, sat.color + '88');
        ctx.beginPath(); ctx.arc(sx, sy, sat.size * ds, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();
        if (sat.name === 'ISS') {
          ctx.strokeStyle = sat.color + 'aa';
          ctx.lineWidth = 0.8 * ds;
          const w = 4 * ds;
          ctx.beginPath();
          ctx.moveTo(sx - w, sy); ctx.lineTo(sx + w, sy);
          ctx.stroke();
        }
        ctx.font = `400 ${Math.max(6, Math.round(7 * ds))}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(200,220,240,0.5)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'top';
        ctx.fillText(sat.name, sx, sy + sat.size * ds + 2);
      }
    }
  }

  private drawRingHalf(ctx: CanvasRenderingContext2D, px: number, py: number, r: number, half: 'front' | 'back') {
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

  private tickShootingStars(
    ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, dt: number
  ) {
    if (t > this.nextShotAt && this.shootingStars.length < 4) {
      const c = this.clientColors[Math.floor(Math.random() * this.clientColors.length)]; // Use clientColors
      const fromLeft = Math.random() > 0.5;
      const sx = fromLeft ? -10 : Math.random() * canvas.width * 0.7;
      const sy = fromLeft ? Math.random() * canvas.height * 0.5 : -10;
      const ang = fromLeft ? 0.3 + Math.random() * 0.5 : Math.PI / 4 + (Math.random() - 0.5) * 0.6;
      const spd = 320 + Math.random() * 180;
      this.shootingStars.push({
        x: sx, y: sy, dx: Math.cos(ang) * spd, dy: Math.sin(ang) * spd,
        trail: 90 + Math.random() * 60, life: 0,
        decay: 0.28 + Math.random() * 0.22, color: c.color, label: c.label,
      });
      this.nextShotAt = t + 3 + Math.random() * 2;
    }
    this.shootingStars = this.shootingStars.filter(s => s.life < 1);
    for (const s of this.shootingStars) {
      const alpha = s.life < 0.15 ? s.life / 0.15 : s.life > 0.75 ? (1 - s.life) / 0.25 : 1;
      const len = Math.hypot(s.dx, s.dy);
      const tx = s.x - (s.dx / len) * s.trail, ty = s.y - (s.dy / len) * s.trail;
      const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
      grad.addColorStop(0, 'transparent'); grad.addColorStop(0.6, s.color + '66'); grad.addColorStop(1, s.color);
      ctx.globalAlpha = alpha * 0.9;
      ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad; ctx.lineWidth = 1.8; ctx.stroke();
      const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 7);
      glow.addColorStop(0, s.color); glow.addColorStop(1, 'transparent');
      ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
      if (alpha > 0.4) {
        ctx.globalAlpha = alpha * 0.85;
        ctx.font = '600 9px Inter, sans-serif'; ctx.fillStyle = s.color;
        ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
        ctx.fillText(s.label, s.x + 10, s.y - 4);
      }
      ctx.globalAlpha = 1;
      s.x += s.dx * dt; s.y += s.dy * dt; s.life += s.decay * dt;
    }
  }

  private defaultCursor = 'url("/assets/ufo-icon.png") 8 8, auto'; // Corrected path

  private setBodyCursor(cursor: string) {
    document.body.style.cursor = cursor;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.introEnded) {
      const canvas = this.canvasRef.nativeElement;
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / rect.width;
      const sy = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * sx;
      const my = (e.clientY - rect.top) * sy;

      let hitPlanet: typeof this.planetPositions[0] | null = null;
      for (const pp of this.planetPositions) {
        const dx = mx - pp.px, dy = my - pp.py;
        // All planets are clickable in the main view, no 'clickable' property needed here
        if (Math.sqrt(dx * dx + dy * dy) < pp.r + 14) { hitPlanet = pp; break; }
      }

      let hitSun = false;
      if (this.sunPosition) {
        const dx = mx - this.sunPosition.cx, dy = my - this.sunPosition.cy;
        if (Math.sqrt(dx * dx + dy * dy) < this.sunPosition.r) {
          hitSun = true;
        }
      }

      if (this.selectedPlanet()) { // If a planet modal is open, keep crosshair
        this.setBodyCursor('crosshair');
      } else if (hitPlanet) {
        if (!this.frozenAngles.has(hitPlanet.name)) {
          const nt = this.lastT - this.INTRO_DURATION;
          this.frozenAngles.set(hitPlanet.name, nt * hitPlanet.p.speed + hitPlanet.p.phase);
        }
        this.ngZone.run(() => {
          this.hoveredPlanet.set({
            name: hitPlanet!.name, tech: hitPlanet!.p.tech, techAbbr: hitPlanet!.p.techAbbr,
            fact: hitPlanet!.p.fact, techDesc: hitPlanet!.p.techDesc, usedIn: hitPlanet!.p.usedIn,
            color: hitPlanet!.p.glow,
            x: hitPlanet!.px / sx + rect.left,
            y: hitPlanet!.py / sy + rect.top,
          });
          this.setBodyCursor(this.defaultCursor); // Still use default UFO cursor on hover, crosshair only for open modal
        });
      } else if (hitSun) {
        this.ngZone.run(() => {
          this.setBodyCursor('pointer');
        });
      }
      else {
        this.frozenAngles.clear();
        if (this.hoveredPlanet()) {
          this.ngZone.run(() => {
            this.hoveredPlanet.set(null);
          });
        }
        this.setBodyCursor(this.defaultCursor); // Revert to default UFO cursor
      }
    }

    this.ngZone.runOutsideAngular(() => {
      if (!this.bgRef?.nativeElement) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      this.bgRef.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.selectedPlanet()) return; // If modal is open, don't change cursor
    this.frozenAngles.clear();
    this.hoveredPlanet.set(null);
    this.setBodyCursor(this.defaultCursor); // Revert to default UFO cursor
  }

  @HostListener('click', ['$event'])
  onCanvasClick(e: MouseEvent) {
    if (!this.introEnded) return;
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const mx = (e.clientX - rect.left) * sx;
    const my = (e.clientY - rect.top) * sy;

    if (this.sunPosition) {
      const dx = mx - this.sunPosition.cx, dy = my - this.sunPosition.cy;
      if (Math.sqrt(dx * dx + dy * dy) < this.sunPosition.r) {
        this.ngZone.run(() => {
          this.planetsAligned.set(true);
          if (this.sunAlignedTimeout) clearTimeout(this.sunAlignedTimeout);
          this.sunAlignedTimeout = setTimeout(() => {
            this.planetsAligned.set(false);
            this.frozenAngles.clear();
          }, 3 * 1000);
        });
        return;
      }
    }

    for (const pp of this.planetPositions) {
      const dx = mx - pp.px, dy = my - pp.py;
      if (Math.sqrt(dx * dx + dy * dy) < pp.r + 18) {
        // All planets are clickable in the main view, no 'clickable' property needed here
        this.ngZone.run(() => {
          this.freezeAllPlanets();
          this.selectedPlanet.set(pp.p);
          this.hoveredPlanet.set(null);
          document.body.style.overflow = 'hidden';
          this.setBodyCursor('crosshair'); // Set crosshair when a clickable planet modal opens
        });
        return;
      }
    }
  }

  @HostListener('document:keydown.escape')
  closePlanet() {
    this.selectedPlanet.set(null);
    this.showTeamModal.set(false);
    this.frozenAngles.clear();
    document.body.style.overflow = '';
    this.setBodyCursor(this.defaultCursor); // Revert to default UFO cursor when modal closes
  }

  toggleRocket() {
    this.rocketPinned = !this.rocketPinned;
    this.showRocketCard.set(this.rocketPinned);
  }

  toggleAstronaut() {
    this.astroPinned = !this.astroPinned;
    this.showAstronautCard.set(this.astroPinned);
  }

  openTeam(index: number) {
    this.teamIndex.set(index);
    this.showTeamModal.set(true);
    document.body.style.overflow = 'hidden';
    this.setBodyCursor('default');
  }

  private freezeAllPlanets() {
    const t = this.lastT - this.INTRO_DURATION;
    for (const p of this.planets) { // Use this.planets
      if (!this.frozenAngles.has(p.name)) {
        this.frozenAngles.set(p.name, t * p.speed + p.phase);
      }
    }
  }

  private sunCenter(canvas: HTMLCanvasElement) {
    return { cx: canvas.width * 0.5, cy: canvas.height * 0.52 };
  }
  private clamp01(v: number) { return Math.min(1, Math.max(0, v)); }
  private ease(t: number) { return t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; }
  private easeBack(t: number) {
    const c = 1.70158; return 1 + (c+1)*Math.pow(t-1,3) + c*Math.pow(t-1,2);
  }

  get activeSlide() { return this.slides[this.currentSlide()]; }

  tooltipPos(info: HoverInfo): { left: string; top: string } {
    const vw = window?.innerWidth ?? 1280;
    const vh = window?.innerHeight ?? 800;
    const left = info.x > vw * 0.58 ? `${info.x - 316}px` : `${info.x + 24}px`;
    const top = `${Math.max(80, Math.min(info.y - 90, vh - 320))}px`;
    return { left, top };
  }

  getTechIconPath(techAbbr: string): string {
    const iconMap: { [key: string]: string } = {
      'NG': 'angular.png',
      'FL': 'flutter.png',
      'TS': 'typescript.png',
      'JS': 'javascript.png',
      'DT': 'dart.png',
      'GO': 'go.png',
      'CSS': 'css.png',
      'H5': 'html5.png',
      'MY': 'mysql.png',
      'DP': 'dwarf-planet.png',
    };
    const iconFileName = iconMap[techAbbr];
    return iconFileName ? `assets/icons/${iconFileName}` : '';
  }
}
