import {
  Component, signal, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener, NgZone
} from '@angular/core';
import { animate, stagger } from 'framer-motion';

interface Client {
  name: string;
  domain: string;
  url: string;
  industry: string;
  description: string;
  logo?: string;
  color: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('trackEl') trackRef!: ElementRef<HTMLElement>;
  @ViewChild('sectionEl') sectionRef!: ElementRef<HTMLElement>;

  currentIndex = signal(0);
  private vc = 2;
  private titleAnimated = false;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  readonly clients: Client[] = [
    {
      name: 'Lociware',
      domain: 'lociware.co.za',
      url: 'https://www.lociware.co.za',
      industry: 'Transport Technology',
      description: 'A complete trip booking platform covering pick-up to drop-off — with role-based access control, live fleet management, driver dispatch and over 20 exportable operational reports.',
      logo: '/assets/clients/lociware.png',
      color: '#4bc8e8',
    },
    {
      name: 'Drink & Derive',
      domain: 'drinkandderive.co.za',
      url: '#',
      industry: 'Events & Entertainment',
      description: 'A curated cocktail-and-car-culture social experience brand — digital booking, event management and community engagement built for a lifestyle audience.',
      logo: '/assets/clients/drink_and_derive.png',
      color: '#f5a623',
    },
    {
      name: 'See AI',
      domain: 'see-ai.co.za',
      url: '#',
      industry: 'Artificial Intelligence',
      description: 'Computer-vision and AI analytics platform transforming raw video feeds into actionable business intelligence — real-time detection, behaviour tracking and insight reporting.',
      logo: '/assets/clients/see-ai.png',
      color: '#9f7aea',
    },
    {
      name: 'Zarbiter',
      domain: 'zarbiter.co.za',
      url: 'https://zarbiter.co.za',
      industry: 'Legal Technology',
      description: 'AI-powered arbitration and dispute resolution platform — streamlines case filing, mediator matching and outcome tracking for faster, more transparent legal processes.',
      color: '#c5f219',
    },
    {
      name: 'Patron Assist',
      domain: 'patron-assist.co.za',
      url: '#',
      industry: 'Hospitality AI',
      description: 'Intelligent hospitality assistant for modern venues — manages reservations, guest preferences, order flows and staff coordination through a unified AI-driven interface.',
      color: '#54c5f8',
    },
  ];

  readonly titleChars = 'Clients & Partners'.split('').map((char, i) => ({ char, i }));

  get maxIndex() { return Math.max(0, this.clients.length - this.vc); }

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.updateVc();
    this.startAutoPlay();
  }

  ngAfterViewInit() {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.titleAnimated) {
          this.titleAnimated = true;
          this.runTitleAnim();
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(this.sectionRef.nativeElement);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  @HostListener('window:resize')
  onResize() {
    const prev = this.vc;
    this.updateVc();
    if (prev !== this.vc) {
      const clamped = Math.min(this.currentIndex(), this.maxIndex);
      this.currentIndex.set(clamped);
      requestAnimationFrame(() => this.slideInstant(clamped));
    }
  }

  private updateVc() { this.vc = window.innerWidth < 768 ? 1 : 2; }

  private runTitleAnim() {
    const chars = this.sectionRef.nativeElement.querySelectorAll('.tci');
    if (chars.length) {
      animate(
        chars,
        { transform: ['translateY(-110%)', 'translateY(0%)'], opacity: [0, 1] },
        { delay: stagger(0.04), duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      );
    }
  }

  private startAutoPlay() {
    this.intervalId = setInterval(() => {
      const next = this.currentIndex() >= this.maxIndex ? 0 : this.currentIndex() + 1;
      this.goTo(next);
    }, 5000);
  }

  private resetAP() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.startAutoPlay();
  }

  goTo(index: number) {
    const clamped = Math.max(0, Math.min(index, this.maxIndex));
    if (clamped === this.currentIndex()) return;
    this.currentIndex.set(clamped);
    this.slideTrack(clamped);
  }

  prev() { this.resetAP(); this.goTo(this.currentIndex() <= 0 ? this.maxIndex : this.currentIndex() - 1); }
  next() { this.resetAP(); this.goTo(this.currentIndex() >= this.maxIndex ? 0 : this.currentIndex() + 1); }
  dot(i: number) { this.resetAP(); this.goTo(i); }

  private slideAmount(): number {
    const track = this.trackRef?.nativeElement;
    if (!track) return 0;
    const card = track.querySelector('.client-card') as HTMLElement | null;
    if (!card) return 0;
    return card.offsetWidth + 24;
  }

  private slideTrack(index: number) {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    animate(track, { x: -(index * this.slideAmount()) }, {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    });
  }

  private slideInstant(index: number) {
    const track = this.trackRef?.nativeElement;
    if (!track) return;
    animate(track, { x: -(index * this.slideAmount()) }, { duration: 0 });
  }

  dotRange() { return Array.from({ length: this.maxIndex + 1 }, (_, i) => i); }

  mono(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}
