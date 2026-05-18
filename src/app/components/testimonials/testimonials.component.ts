import { Component } from '@angular/core';
import { TitleAnimationDirective } from '../../directives/title-animation.directive';
import { CommonModule } from '@angular/common'; // Import CommonModule for @for

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  initials: string;
  avatarColor: string;
  rating: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [
    CommonModule, // Add CommonModule
    TitleAnimationDirective
  ],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 0,
      quote: 'AppSoLoot completely transformed our arbitration process. Their AI solution reduced dispute resolution time by 3x and eliminated manual errors we\'d struggled with for years. The Angular dashboard they built is lightning-fast and our team loves it.',
      author: 'Sipho Mokoena',
      role: 'Chief Executive Officer',
      company: 'Zarbiter',
      initials: 'SM',
      avatarColor: '#9f7aea',
      rating: 5
    },
    {
      id: 1,
      quote: 'Our Flutter app from AppSoLoot is the single best investment we\'ve made for the gym. Class bookings increased 40% in the first month, and the design is so clean that members actually thank us for it. The team delivered on time and over-delivered on quality.',
      author: 'Natasha Williams',
      role: 'Founder & Owner',
      company: 'Chozen One Gym',
      initials: 'NW',
      avatarColor: '#c5f219',
      rating: 5
    },
    {
      id: 2,
      quote: 'Working with AppSoLoot was an absolute pleasure. They understood our hospitality challenges immediately and built an AI assistant that now handles 60% of guest inquiries autonomously. The Figma designs were pixel-perfect — developers said it was the cleanest handoff they\'d ever received.',
      author: 'James Hlongwane',
      role: 'Founder',
      company: 'Patron Assist',
      initials: 'JH',
      avatarColor: '#54c5f8',
      rating: 5
    }
  ];

  // Add titleChars for animation
  readonly titleChars = 'What Our Clients Say'.split('').map((char, i) => ({ char, i }));

  stars(rating: number): number[] {
    return Array.from({ length: rating }, (_, i) => i);
  }
}
