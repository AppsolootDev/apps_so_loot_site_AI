import { Component, signal, HostListener, OnInit, AfterViewInit, ElementRef, ViewChild, effect } from '@angular/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewInit {
  @ViewChild('navIndicator') navIndicator!: ElementRef<HTMLDivElement>;

  scrolled = signal(false);
  menuOpen = signal(false);
  activeSection = signal('home'); // Initialize with 'home'

  navLinks = [
    { label: 'Home', href: '#home', id: 'home' }, // Added home link and id
    { label: 'Services', href: '#services', id: 'services' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Portfolio', href: '#portfolio', id: 'portfolio' },
    { label: 'Clients', href: '#clients', id: 'clients' },
    { label: 'Location', href: '#location', id: 'location' },
  ];

  private sectionOffsets: { id: string; offsetTop: number }[] = [];

  constructor(private el: ElementRef) {
    // Use an effect to react to activeSection changes and update the indicator
    effect(() => {
      // Ensure navIndicator is available and activeSection has a value
      if (this.navIndicator && this.activeSection()) {
        this.updateIndicatorPosition();
      }
    });
  }

  ngOnInit() {
    this.onScroll(); // Set initial scrolled state
  }

  ngAfterViewInit() {
    // Ensure DOM is ready before calculating offsets
    setTimeout(() => {
      this.calculateSectionOffsets();
      this.onScroll(); // Set initial active section
      this.updateIndicatorPosition(); // Update indicator after initial setup
    }, 0);
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 20);

    const scrollPosition = window.scrollY + window.innerHeight / 2; // Mid-viewport

    let currentActiveSection = 'home';
    for (const section of this.sectionOffsets) {
      if (scrollPosition >= section.offsetTop) {
        currentActiveSection = section.id;
      } else {
        break; // Sections are ordered, so we can stop early
      }
    }
    if (this.activeSection() !== currentActiveSection) {
      this.activeSection.set(currentActiveSection);
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateSectionOffsets();
    this.onScroll();
    // The effect will handle calling updateIndicatorPosition when activeSection changes due to resize
  }

  private calculateSectionOffsets() {
    this.sectionOffsets = this.navLinks
      .map(link => {
        const element = document.getElementById(link.id);
        return element ? { id: link.id, offsetTop: element.offsetTop } : null;
      })
      .filter(Boolean) as { id: string; offsetTop: number }[];

    // Sort by offsetTop to ensure correct order
    this.sectionOffsets.sort((a, b) => a.offsetTop - b.offsetTop);
  }

  private updateIndicatorPosition() {
    if (!this.navIndicator || !this.el.nativeElement) return;

    // Query for the active link within the current component's native element
    const activeLinkElement = this.el.nativeElement.querySelector(`.nav-link.active`) as HTMLElement;

    if (activeLinkElement) {
      const navLinksContainer = activeLinkElement.parentElement;
      if (navLinksContainer) {
        const containerRect = navLinksContainer.getBoundingClientRect();
        const linkRect = activeLinkElement.getBoundingClientRect();

        this.navIndicator.nativeElement.style.left = `${linkRect.left - containerRect.left}px`;
        this.navIndicator.nativeElement.style.width = `${linkRect.width}px`;
        this.navIndicator.nativeElement.style.opacity = '1';
      }
    } else {
      this.navIndicator.nativeElement.style.opacity = '0'; // Hide if no active link
    }
  }

  toggleMenu() {
    this.menuOpen.update(v => !v);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}
