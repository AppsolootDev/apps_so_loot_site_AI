import {
  Component, signal, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener, NgZone
} from '@angular/core';

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

interface Planet {
  name: string;
  tech: string;
  techAbbr: string;
  techDesc: string;
  oneLiner: string;
  history: string;
  clientBenefit: string;
  fact: string;
  usedIn: ProjectUsage[];
  rx: number; ry: number;
  speed: number; phase: number;
  size: number;
  c: [string, string, string];
  glow: string;
  hasRings?: boolean;
  sats?: Satellite[];
}

interface HoverInfo {
  name: string; tech: string; techAbbr: string;
  fact: string; techDesc: string; usedIn: ProjectUsage[];
  color: string; x: number; y: number;
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

  readonly teamMembers = [
    {
      emoji: '👽',
      name: 'Mr LGM Matabane',
      role: 'Founder & Lead Developer',
      bio: 'Full-stack engineer and founder of AppSoLoot. Designs and ships Angular dashboards, Flutter mobile apps and AI integrations for clients across transport, legal and hospitality. LGM brings a product-first mindset to every sprint — from whiteboard to production deployment.',
      linkedin: 'https://www.linkedin.com/in/leextremist',
      handle: 'leextremist',
    },
    {
      emoji: '👾',
      name: 'Melvin Modiselle',
      role: 'Creative Developer & Co-Founder',
      bio: 'Co-founder and creative developer at AppSoLoot. Designs component systems in Figma, implements them in Angular and obsesses over the micro-interactions that make software feel premium. Bridges the gap between design and engineering without the traditional handoff overhead.',
      linkedin: 'https://www.linkedin.com/in/melvin-m-3b090024a',
      handle: 'Melvin Modiselle',
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

  private readonly planets: Planet[] = [
    {
      name: 'Mercury', tech: 'Angular', techAbbr: 'NG',
      techDesc: 'Enterprise SPA framework for scalable, reactive web apps with powerful CLI tooling.',
      oneLiner: 'Google\'s enterprise SPA framework — signals, standalone components, and 17 years of production hardening.',
      history: 'AngularJS was released by Google in 2010 as a structural framework for dynamic web apps. A ground-up rewrite as Angular 2 arrived in 2016, introducing TypeScript-first development, a component tree model, and the Angular CLI. Angular 17 brought reactive signals and deferrable views — eliminating whole classes of change-detection bugs.',
      clientBenefit: 'We deploy Angular for every client needing a data-heavy web application. The DI system makes API services portable; the router handles complex multi-layout SPAs cleanly. Lociware\'s fleet-management portal and Patron Assist\'s venue admin both rely on Angular\'s real-time dashboard capabilities.',
      fact: 'Closest to the Sun. Temperatures swing from −173 °C to 427 °C.',
      usedIn: [
        { name: 'Lociware', type: 'web' },
        { name: 'Patron Assist', type: 'web' },
        { name: 'AppSoLoot', type: 'web' },
      ],
      rx: 95,  ry: 36,  speed: 0.65, phase: 0.0,  size: 8,
      c: ['#c8c3bc', '#9e9890', '#6e6860'], glow: '#a09888',
    },
    {
      name: 'Venus', tech: 'Flutter', techAbbr: 'FL',
      techDesc: 'Cross-platform toolkit for native iOS & Android apps from a single codebase.',
      oneLiner: 'Ship iOS and Android from one codebase — with the UI quality of a bespoke native app.',
      history: 'Google launched Flutter in 2018 as a response to the compromises of React Native and Xamarin. Instead of bridging to native widgets, Flutter renders its own pixels via the Skia graphics library (now Impeller on iOS). Flutter 3 (2022) extended support to macOS, Windows, Linux and the web. Dart\'s AOT compilation means apps start fast and stay smooth at 60 fps.',
      clientBenefit: 'Flutter lets us deliver iOS and Android simultaneously, cutting mobile build cost by up to 40 %. Patron Assist\'s table-ordering app was shipped to both the App Store and Google Play in a single sprint. Offline-first with Hive, real-time with Firebase, zero native bridge overhead.',
      fact: 'Hottest planet at 465 °C. Rotates backwards relative to most planets.',
      usedIn: [
        { name: 'Zarbiter', type: 'mobile' },
        { name: 'Patron Assist', type: 'mobile' },
        { name: 'Chozen One', type: 'mobile' },
      ],
      rx: 162, ry: 62,  speed: 0.44, phase: 1.4,  size: 13,
      c: ['#f5df8a', '#e8b845', '#c48a20'], glow: '#d4a030',
    },
    {
      name: 'Earth', tech: 'TypeScript', techAbbr: 'TS',
      techDesc: 'Strongly-typed JS superset that catches errors at compile time for reliable apps.',
      oneLiner: 'JavaScript with compile-time proof that your data shapes are exactly what you think they are.',
      history: 'Microsoft released TypeScript in 2012 as an optional type layer over JavaScript. Adoption accelerated when Angular 2 mandated it in 2016. TypeScript 5.x added decorators as a standard feature and improved inference. Today it is the default for Angular, NestJS, Next.js and Deno — effectively the lingua franca of modern JS engineering.',
      clientBenefit: 'TypeScript interfaces are our first line of defence against API contract drift. When Lociware\'s reporting API changed a field type, TypeScript caught 14 silent failures before they reached QA. Every Angular and NestJS project we build is strictly typed end-to-end.',
      fact: 'Only planet known to harbour life. 71 % covered by water.',
      usedIn: [
        { name: 'Lociware', type: 'web' },
        { name: 'AppSoLoot', type: 'web' },
        { name: 'Patron Assist', type: 'web' },
      ],
      rx: 234, ry: 89,  speed: 0.33, phase: 2.6,  size: 14,
      c: ['#68b8e8', '#2e7a44', '#1a4e88'], glow: '#3a90d0',
      sats: [
        { name: 'Moon', rx: 28, ry: 9,  speed: 2.8,  phase: 0.5, size: 4, color: '#c8c0b8' },
        { name: 'ISS',  rx: 20, ry: 6,  speed: 7.5,  phase: 2.1, size: 2, color: '#e0e8f0' },
      ],
    },
    {
      name: 'Mars', tech: 'JavaScript', techAbbr: 'JS',
      techDesc: 'The language of the web — dynamic, versatile and universal across every browser.',
      oneLiner: 'The only language that runs everywhere — browser, server, edge, and embedded — without asking permission.',
      history: 'Brendan Eich wrote the first version in 10 days at Netscape in 1995. ES6 (2015) transformed it with classes, arrow functions, modules and promises. Today JavaScript is the world\'s most widely deployed programming language, running inside every browser, on Node.js, Deno, Cloudflare Workers, and even microcontrollers.',
      clientBenefit: 'Pure JavaScript handles every dynamic front-end interaction where Angular is overkill — lightweight booking widgets, embeddable event calendars and micro-frontends. Chozen One Gym\'s class-booking widget is a vanilla JS module embedded across multiple pages with zero framework overhead.',
      fact: 'Home to Olympus Mons — the tallest volcano in the solar system at 22 km.',
      usedIn: [
        { name: 'Chozen One', type: 'web' },
        { name: 'Zarbiter', type: 'web' },
        { name: 'Patron Assist', type: 'web' },
      ],
      rx: 305, ry: 116, speed: 0.26, phase: 0.9,  size: 10,
      c: ['#e05a30', '#c03418', '#8a1c08'], glow: '#c03818',
      sats: [
        { name: 'Phobos', rx: 20, ry: 7,  speed: 5.5,  phase: 1.0, size: 3, color: '#9a8878' },
        { name: 'Deimos', rx: 30, ry: 10, speed: 3.2,  phase: 3.5, size: 2, color: '#b8a898' },
      ],
    },
    {
      name: 'Jupiter', tech: 'Dart', techAbbr: 'DT',
      techDesc: 'Client-optimised language powering Flutter\'s silky 60 fps rendering engine.',
      oneLiner: 'Flutter\'s purpose-built language — AOT-compiled, null-safe by default, and a joy to write.',
      history: 'Lars Bak and Kasper Lund designed Dart at Google, releasing it in 2011 as a potential JavaScript replacement. That vision faded, but Dart found its calling as Flutter\'s exclusive language. Dart 2 (2018) introduced sound null safety. Dart 3 (2023) brought records, patterns and class modifiers — dramatically improving large-scale Flutter architecture.',
      clientBenefit: 'Dart\'s strong typing and null safety prevent whole categories of runtime crashes in mobile apps. For Zarbiter\'s dispute-filing flow, complex multi-step forms with conditional validation are written in pure Dart and tested headlessly. Dart isolates handle heavy PDF generation off the main thread, keeping UI at 60 fps.',
      fact: 'Largest planet — its Great Red Spot is a storm raging for over 350 years.',
      usedIn: [
        { name: 'Zarbiter', type: 'mobile' },
        { name: 'Patron Assist', type: 'mobile' },
        { name: 'Chozen One', type: 'mobile' },
      ],
      rx: 390, ry: 148, speed: 0.18, phase: 3.8,  size: 26,
      c: ['#e8c880', '#c8884a', '#8a4c20'], glow: '#c47830',
    },
    {
      name: 'Saturn', tech: 'Go', techAbbr: 'GO',
      techDesc: 'Fast compiled language for high-throughput backend microservices and REST APIs.',
      oneLiner: 'C-speed binaries, Python-readable code, and built-in concurrency — the language that powers modern cloud infrastructure.',
      history: 'Rob Pike, Ken Thompson and Robert Griesemer created Go at Google, open-sourcing it in 2009 to solve C++ compile times and complexity. Go 1 (2012) guaranteed backwards compatibility. Its goroutines and channels make concurrent programming nearly as simple as sequential code. Go powers Docker, Kubernetes, Terraform and much of the cloud-native ecosystem.',
      clientBenefit: 'We write REST APIs and background workers in Go where raw throughput matters. Patron Assist\'s reservation-webhook processor handles 1 000+ concurrent events per second using goroutines — each incoming booking triggers stock checks, seat-map updates and notifications in parallel. Single binary deployments keep infrastructure lean.',
      fact: 'The least dense planet — it would float in water. Its rings are 99 % ice.',
      usedIn: [
        { name: 'Patron Assist', type: 'backend' },
        { name: 'AppSoLoot', type: 'backend' },
        { name: 'Zarbiter', type: 'backend' },
      ],
      rx: 476, ry: 181, speed: 0.13, phase: 1.2,  size: 22,
      c: ['#eed8a0', '#d4aa58', '#a07828'], glow: '#c8982a',
      hasRings: true,
    },
    {
      name: 'Uranus', tech: 'CSS', techAbbr: 'CSS',
      techDesc: 'Cascade styles driving pixel-perfect animations, custom properties and layouts.',
      oneLiner: 'The presentation layer that turns functional software into a brand experience users instinctively trust.',
      history: 'Håkon Wium Lie proposed CSS in 1994; CSS1 published in 1996. Browser wars made it nightmarish for a decade. CSS3 changed everything: Flexbox (2014), Grid (2017), Custom Properties (2016). Modern CSS with nesting, Container Queries and :has() now handles patterns previously owned by JavaScript.',
      clientBenefit: 'We build token-based CSS design systems for every product. One colour-theme change in Lociware\'s token file cascades across 80+ components simultaneously. Our animation library cuts bounce-rate by making interactions feel instant — a metric that directly impacts Patron Assist\'s reservation conversion rate.',
      fact: 'Rotates on its side at 98°. Has 13 known rings and 27 moons.',
      usedIn: [
        { name: 'Lociware', type: 'design' },
        { name: 'AppSoLoot', type: 'design' },
        { name: 'Patron Assist', type: 'design' },
      ],
      rx: 558, ry: 212, speed: 0.09, phase: 4.3,  size: 17,
      c: ['#b8e0ec', '#80c0d8', '#50a0c0'], glow: '#70b8d8',
    },
    {
      name: 'Neptune', tech: 'HTML5', techAbbr: 'H5',
      techDesc: 'Semantic markup, Canvas API and web workers forming the foundation of the modern web.',
      oneLiner: 'Not just markup — a full application runtime with native APIs for multimedia, storage and real-time data.',
      history: 'HTML5 was the WHATWG\'s answer to the browser plugin era (Flash, Silverlight). Standardised in 2014 after incremental browser adoption from 2008, it unified the web around semantic elements, Canvas 2D, Web Workers, WebSockets and IndexedDB. The result ended the Flash era and laid the groundwork for modern PWAs and WebAssembly.',
      clientBenefit: 'HTML5 Canvas is the engine behind this solar system visualisation. For See AI\'s live analytics dashboard, we combine Canvas and WebSockets to render real-time bounding boxes on camera feeds at 30 fps in the browser — no native plugin, no install. HTML5 PWA capabilities let Patron Assist\'s web app install to home screens with full offline support.',
      fact: 'Fastest winds in the solar system — up to 2 100 km/h.',
      usedIn: [
        { name: 'Lociware', type: 'web' },
        { name: 'AppSoLoot', type: 'web' },
        { name: 'Patron Assist', type: 'web' },
      ],
      rx: 636, ry: 242, speed: 0.07, phase: 2.1,  size: 16,
      c: ['#4868e4', '#2840c8', '#1428a8'], glow: '#3050c8',
    },
    {
      name: 'Pluto', tech: 'MySQL', techAbbr: 'MY',
      techDesc: 'Robust relational database powering structured data at production scale with ACID compliance.',
      oneLiner: 'The relentless workhorse of the web — 30 years and still the most-deployed relational database on Earth.',
      history: 'Michael "Monty" Widenius and David Axmark created MySQL in 1994, releasing it in 1995. Acquired by Oracle in 2010, MySQL 8.x brought window functions, CTEs, roles and atomic DDL — making it a genuine enterprise RDBMS. InnoDB\'s MVCC engine ensures ACID compliance without sacrificing throughput. Over 10 million active deployments worldwide.',
      clientBenefit: 'MySQL underpins Patron Assist\'s venue data, Zarbiter\'s case archive and Lociware\'s entire trip history. We design schemas with composite indexes and use partitioning to keep query times under 10 ms on tables with tens of millions of rows. Stored procedures handle complex booking-conflict logic that would be slow in application code.',
      fact: 'Reclassified as a dwarf planet in 2006. One year = 248 Earth years.',
      usedIn: [
        { name: 'Patron Assist', type: 'backend' },
        { name: 'Zarbiter', type: 'backend' },
        { name: 'Lociware', type: 'backend' },
      ],
      rx: 710, ry: 270, speed: 0.05, phase: 5.2,  size: 7,
      c: ['#c0b0a0', '#a09080', '#806858'], glow: '#987868',
    },
  ];

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

  ngOnInit() { this.startSlider(); this.typeText(0); }

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => this.initCanvas());
    this.animateStats();
  }

  ngOnDestroy() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    cancelAnimationFrame(this.animFrameId);
  }

  // ─── Slider / typing / stats ──────────────────────────────────────

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

  // ─── Canvas bootstrap ─────────────────────────────────────────────

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

  // ─── Intro sequence ───────────────────────────────────────────────

  private drawIntro(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number) {
    const { cx, cy } = this.sunCenter(canvas);

    // White → dark background
    const bgP = this.ease(this.clamp01((t - 0.3) / 2.9));
    ctx.fillStyle = `rgb(${Math.round(255 + (7-255)*bgP)},${Math.round(255+(14-255)*bgP)},${Math.round(255+(26-255)*bgP)})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sun fades in
    const sunA = this.clamp01((t - 0.5) / 1.7);
    if (sunA > 0) { ctx.globalAlpha = sunA; this.drawSun(ctx, cx, cy, t); ctx.globalAlpha = 1; }

    // Orbit lines then planets, one set every 0.8s
    const pending: { p: Planet; px: number; py: number; alpha: number }[] = [];

    for (let i = 0; i < this.planets.length; i++) {
      const rs = 2.5 + i * 0.8;
      if (t < rs) break;
      const pl = this.planets[i];
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

  // ─── Normal frame ─────────────────────────────────────────────────

  private drawNormal(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, dt: number) {
    const { cx, cy } = this.sunCenter(canvas);

    // Stars
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

    // Orbit rings
    for (const p of this.planets) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180,210,255,0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Planets — collect, depth-sort, draw
    this.planetPositions = [];
    const toRender = this.planets.map(p => {
      const angle = this.frozenAngles.has(p.name)
        ? this.frozenAngles.get(p.name)!
        : t * p.speed + p.phase;
      return { p, angle, px: cx + p.rx * Math.cos(angle), py: cy + p.ry * Math.sin(angle) };
    });
    toRender.sort((a, b) => a.py - b.py);

    const sel = this.selectedPlanet();
    for (const { p, angle, px, py } of toRender) {
      const behind = Math.sin(angle) < 0;
      const ds = behind ? 0.78 : 1.0;
      const isSelected = sel?.name === p.name;
      const da = sel ? (isSelected ? 1.0 : 0.22) : (behind ? 0.55 : 1.0);
      ctx.globalAlpha = da;
      this.paintPlanet(ctx, px, py, p, ds, angle, cx, cy, t);
      if (isSelected) {
        // Pulsing selection ring
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

  // ─── Sun ──────────────────────────────────────────────────────────

  private drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, t: number) {
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 230);
    halo.addColorStop(0, 'rgba(255,195,30,0.24)');
    halo.addColorStop(0.45, 'rgba(255,100,0,0.07)');
    halo.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, 230, 0, Math.PI * 2);
    ctx.fillStyle = halo; ctx.fill();

    const r = 26 + Math.sin(t * 1.6) * 2;
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

  // ─── Single planet painter ─────────────────────────────────────────

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

    // Saturn back ring (behind planet)
    if (p.hasRings) this.drawRingHalf(ctx, px, py, r, 'back');

    // Atmosphere glow
    const atm = ctx.createRadialGradient(px, py, r * 0.7, px, py, r * 2.2);
    atm.addColorStop(0, 'transparent');
    atm.addColorStop(1, p.glow + '22');
    ctx.beginPath(); ctx.arc(px, py, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = atm; ctx.fill();

    // Planet sphere
    const sph = ctx.createRadialGradient(px - r * 0.35, py - r * 0.35, r * 0.05, px + r * 0.1, py + r * 0.1, r);
    sph.addColorStop(0, p.c[0]);
    sph.addColorStop(0.5, p.c[1]);
    sph.addColorStop(1, p.c[2]);
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = sph; ctx.fill();

    // Earth bands (blue → green landmass hint)
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

    // Jupiter / Saturn band lines
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

    // Saturn front ring (in front of planet)
    if (p.hasRings) this.drawRingHalf(ctx, px, py, r, 'front');

    // Specular highlight
    const hi = ctx.createRadialGradient(px - r * 0.38, py - r * 0.38, 0, px, py, r);
    hi.addColorStop(0, 'rgba(255,255,255,0.32)');
    hi.addColorStop(0.45, 'transparent');
    ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fillStyle = hi; ctx.fill();

    // Tech badge (bottom-right overlay, normal mode only)
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

    // Planet name label
    const lblY = py + r * ds + 4;
    ctx.font = `500 ${Math.max(8, Math.round(9 * ds))}px Inter, sans-serif`;
    ctx.fillStyle = p.glow + 'cc';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(p.name, px, lblY);

    // Satellites (Earth + Mars)
    if (p.sats && t > 0) {
      for (const sat of p.sats) {
        const sa = t * sat.speed + sat.phase;
        const sx = px + sat.rx * ds * Math.cos(sa);
        const sy = py + sat.ry * ds * Math.sin(sa);

        // Satellite orbit ring
        ctx.beginPath(); ctx.ellipse(px, py, sat.rx * ds, sat.ry * ds, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 0.7; ctx.stroke();

        // Satellite body
        const sg = ctx.createRadialGradient(sx - sat.size * 0.3, sy - sat.size * 0.3, 0, sx, sy, sat.size);
        sg.addColorStop(0, sat.color); sg.addColorStop(1, sat.color + '88');
        ctx.beginPath(); ctx.arc(sx, sy, sat.size * ds, 0, Math.PI * 2);
        ctx.fillStyle = sg; ctx.fill();

        // ISS: small solar-panel markers
        if (sat.name === 'ISS') {
          ctx.strokeStyle = sat.color + 'aa';
          ctx.lineWidth = 0.8 * ds;
          const w = 4 * ds;
          ctx.beginPath();
          ctx.moveTo(sx - w, sy); ctx.lineTo(sx + w, sy);
          ctx.stroke();
        }

        // Satellite name
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

  // ─── Shooting stars ───────────────────────────────────────────────

  private tickShootingStars(
    ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number, dt: number
  ) {
    if (t > this.nextShotAt && this.shootingStars.length < 4) {
      const c = this.clientColors[Math.floor(Math.random() * this.clientColors.length)];
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

  // ─── Hover detection ──────────────────────────────────────────────

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (this.introEnded) {
      const canvas = this.canvasRef.nativeElement;
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / rect.width;
      const sy = canvas.height / rect.height;
      const mx = (e.clientX - rect.left) * sx;
      const my = (e.clientY - rect.top) * sy;

      let hit: typeof this.planetPositions[0] | null = null;
      for (const pp of this.planetPositions) {
        const dx = mx - pp.px, dy = my - pp.py;
        if (Math.sqrt(dx * dx + dy * dy) < pp.r + 14) { hit = pp; break; }
      }

      if (hit) {
        if (!this.frozenAngles.has(hit.name)) {
          // Compute current angle to freeze at
          const nt = this.lastT - this.INTRO_DURATION;
          this.frozenAngles.set(hit.name, nt * hit.p.speed + hit.p.phase);
        }
        this.ngZone.run(() => this.hoveredPlanet.set({
          name: hit!.name, tech: hit!.p.tech, techAbbr: hit!.p.techAbbr,
          fact: hit!.p.fact, techDesc: hit!.p.techDesc, usedIn: hit!.p.usedIn,
          color: hit!.p.glow,
          x: hit!.px / sx + rect.left,
          y: hit!.py / sy + rect.top,
        }));
      } else {
        this.frozenAngles.clear();
        if (this.hoveredPlanet()) this.ngZone.run(() => this.hoveredPlanet.set(null));
      }
    }

    // Parallax bg
    this.ngZone.runOutsideAngular(() => {
      if (!this.bgRef?.nativeElement) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 18;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      this.bgRef.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.selectedPlanet()) return;
    this.frozenAngles.clear();
    this.hoveredPlanet.set(null);
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

    for (const pp of this.planetPositions) {
      const dx = mx - pp.px, dy = my - pp.py;
      if (Math.sqrt(dx * dx + dy * dy) < pp.r + 18) {
        this.ngZone.run(() => {
          this.freezeAllPlanets();
          this.selectedPlanet.set(pp.p);
          this.hoveredPlanet.set(null);
          document.body.style.overflow = 'hidden';
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
  }

  toggleRocket(pin = false) {
    if (pin) this.rocketPinned = !this.rocketPinned;
    this.showRocketCard.set(this.rocketPinned || !this.showRocketCard());
  }

  toggleAstronaut(pin = false) {
    if (pin) this.astroPinned = !this.astroPinned;
    this.showAstronautCard.set(this.astroPinned || !this.showAstronautCard());
  }

  openTeam(index: number) {
    this.teamIndex.set(index);
    this.showTeamModal.set(true);
    document.body.style.overflow = 'hidden';
  }

  private freezeAllPlanets() {
    const t = this.lastT - this.INTRO_DURATION;
    for (const p of this.planets) {
      if (!this.frozenAngles.has(p.name)) {
        this.frozenAngles.set(p.name, t * p.speed + p.phase);
      }
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────

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
}
