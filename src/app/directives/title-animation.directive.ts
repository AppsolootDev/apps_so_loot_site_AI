import { Directive, ElementRef, AfterViewInit, OnDestroy, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTitleAnimation]',
  standalone: true
})
export class TitleAnimationDirective implements AfterViewInit, OnDestroy {
  @Input() animationDelay: number = 0; // Optional delay for the animation start

  private observer!: IntersectionObserver;
  private animated = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animated) {
          this.animated = true;
          // Apply animation with staggered delay
          const chars = this.el.nativeElement.querySelectorAll('.char');
          chars.forEach((char: HTMLElement, index: number) => {
            this.renderer.setStyle(char, 'animation-delay', `${this.animationDelay + index * 0.04}s`);
          });
          this.renderer.addClass(this.el.nativeElement, 'animate');
          this.observer.unobserve(this.el.nativeElement);
        }
      });
    }, { threshold: 0.15 }); // Trigger when 15% of the element is visible

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
