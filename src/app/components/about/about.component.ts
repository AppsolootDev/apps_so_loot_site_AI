import { Component } from '@angular/core';
import { TitleAnimationDirective } from '../../directives/title-animation.directive'; // Import the new directive
import { CommonModule } from '@angular/common'; // Import CommonModule for @for

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TitleAnimationDirective], // Add CommonModule and the directive here
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  stats = [
    { value: '50+', label: 'Projects Delivered' },
    { value: '30+', label: 'Happy Clients' },
    { value: '5+', label: 'Years of Excellence' },
    { value: '4', label: 'Core Specializations' },
  ];

  values = [
    { icon: '◈', title: 'Precision-Driven', desc: 'Every pixel, every line of code is intentional. We sweat the details so our clients don\'t have to.' },
    { icon: '◉', title: 'Innovation First', desc: 'We stay ahead of the curve — adopting AI, modern frameworks, and emerging technologies proactively.' },
    { icon: '◍', title: 'Partnership Mindset', desc: 'We embed ourselves in your vision. Your success is our benchmark, not just delivery milestones.' },
  ];

  // Add titleChars for animation
  readonly titleChars = 'Built by Builders, for Visionaries'.split('').map((char, i) => ({ char, i }));
}
