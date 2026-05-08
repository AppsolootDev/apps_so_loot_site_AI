import { Component, signal, OnInit, OnDestroy } from '@angular/core';

interface Service {
  id: number;
  icon: 'ai' | 'angular' | 'flutter' | 'figma';
  name: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  tech: string[];
  image: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit, OnDestroy {
  current = signal(0);
  slideVisible = signal(true);
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private transitioning = false;

  services: Service[] = [
    {
      id: 0,
      icon: 'ai',
      name: 'AI Solutions',
      tagline: 'Intelligent Automation',
      description: 'We build intelligent systems powered by large language models, computer vision, and predictive analytics — automating complex decisions and unlocking business insights that were previously impossible at scale.',
      features: ['LLM & ChatGPT Integration', 'Predictive Analytics', 'NLP & AI Chatbots', 'Workflow Automation', 'Computer Vision', 'Data Intelligence'],
      color: '#9f7aea',
      tech: ['OpenAI', 'LangChain', 'TensorFlow', 'Python', 'FastAPI'],
      image: 'linear-gradient(135deg, #1a0f2e 0%, #0d0918 50%, #06070a 100%)'
    },
    {
      id: 1,
      icon: 'angular',
      name: 'Angular Web Apps',
      tagline: 'Enterprise-Grade Web',
      description: 'Scalable, blazing-fast web applications built with Angular 17+ — fully responsive across all devices, PWA-ready for offline access, with real-time dashboards and complex data architectures handled elegantly.',
      features: ['Fully Responsive Design', 'Progressive Web Apps (PWA)', 'Real-time Dashboards', 'API & Microservices Integration', 'State Management (NgRx)', 'Performance Optimised'],
      color: '#f05340',
      tech: ['Angular 17+', 'TypeScript', 'RxJS', 'NgRx', 'Tailwind'],
      image: 'linear-gradient(135deg, #1a0a08 0%, #120a08 50%, #06070a 100%)'
    },
    {
      id: 2,
      icon: 'flutter',
      name: 'Flutter Mobile',
      tagline: 'Cross-Platform Native',
      description: 'Beautiful, pixel-perfect mobile apps for iOS and Android from a single Flutter codebase — native-quality animations, offline-first architecture, and seamless OS integrations, shipped faster than any other stack.',
      features: ['iOS & Android Native Feel', 'Offline-First Architecture', 'Push Notifications', 'App Store & Play Store', 'Biometric Auth', 'Native Sensors & APIs'],
      color: '#54c5f8',
      tech: ['Flutter', 'Dart', 'Firebase', 'BLoC', 'Riverpod'],
      image: 'linear-gradient(135deg, #071520 0%, #050f18 50%, #06070a 100%)'
    },
    {
      id: 3,
      icon: 'figma',
      name: 'Figma Design',
      tagline: 'UI/UX Excellence',
      description: 'From user research and information architecture to polished design systems and responsive prototypes in Figma — we create interfaces that delight users, convert visitors, and hand off cleanly to developers.',
      features: ['UX Research & Strategy', 'Design Systems & Tokens', 'Responsive Prototypes', 'Interactive Animations', 'Developer Handoff', 'Brand Identity'],
      color: '#f24e1e',
      tech: ['Figma', 'Principle', 'Lottie', 'Zeplin', 'Framer'],
      image: 'linear-gradient(135deg, #1a0a06 0%, #120806 50%, #06070a 100%)'
    }
  ];

  ngOnInit() {
    this.intervalId = setInterval(() => this.advance(), 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  advance() {
    this.goTo((this.current() + 1) % this.services.length);
  }

  goTo(index: number) {
    if (this.transitioning || index === this.current()) return;
    this.transitioning = true;
    this.slideVisible.set(false);
    setTimeout(() => {
      this.current.set(index);
      this.slideVisible.set(true);
      this.transitioning = false;
    }, 350);
  }

  selectAndReset(index: number) {
    if (this.intervalId) clearInterval(this.intervalId);
    this.goTo(index);
    this.intervalId = setInterval(() => this.advance(), 5000);
  }

  get active() { return this.services[this.current()]; }
}
