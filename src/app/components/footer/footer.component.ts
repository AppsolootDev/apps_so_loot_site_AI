import { Component } from '@angular/core';

interface Tweet {
  id: number;
  handle: string;
  name: string;
  time: string;
  content: string;
  likes: number;
  retweets: number;
}

interface IGPost {
  id: number;
  color: string;
  caption: string;
  likes: number;
  tag: string;
  emoji: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  tweets: Tweet[] = [
    { id: 0, handle: '@appsoloot', name: 'AppSoLoot', time: '2h', content: 'Just shipped a new AI arbitration dashboard for Zarbiter. Dispute resolution time cut by 3× — this is what we build for. 🔥 #AI #LegalTech', likes: 47, retweets: 19 },
    { id: 1, handle: '@appsoloot', name: 'AppSoLoot', time: '1d', content: 'Chozen One Gym\'s Flutter app is live on the App Store and Play Store. Class bookings up 40% in week one. Our team is proud of this one. 💪', likes: 93, retweets: 34 },
    { id: 2, handle: '@appsoloot', name: 'AppSoLoot', time: '3d', content: 'We believe great software is a fusion of engineering rigor and design thinking. Every pixel. Every line of code. Intentional. #AppSoLoot', likes: 128, retweets: 52 },
    { id: 3, handle: '@appsoloot', name: 'AppSoLoot', time: '5d', content: 'Patron Assist\'s AI now handles 60% of guest inquiries autonomously. Hospitality teams can focus on what matters — guest experience. 🤖', likes: 71, retweets: 28 },
    { id: 4, handle: '@appsoloot', name: 'AppSoLoot', time: '1w', content: 'Angular 17+ signal-based architecture is a game changer for enterprise apps. We\'ve rebuilt two dashboards and performance gains are significant. #Angular', likes: 156, retweets: 67 },
  ];

  igPosts: IGPost[] = [
    { id: 0, color: '#1a0f2e', caption: 'Crafting pixel-perfect UI for legal tech', likes: 312, tag: '#UIDesign', emoji: '⚖️' },
    { id: 1, color: '#0f1a0f', caption: 'Late nights, clean Angular code ☕', likes: 245, tag: '#AngularDev', emoji: '🅰️' },
    { id: 2, color: '#0a1520', caption: 'Flutter UX that users actually love', likes: 418, tag: '#Flutter', emoji: '📱' },
    { id: 3, color: '#1a100a', caption: 'AI + Hospitality = magic combo', likes: 521, tag: '#AIAgency', emoji: '🤖' },
    { id: 4, color: '#111118', caption: 'Design systems built in Figma', likes: 389, tag: '#FigmaDesign', emoji: '🎨' },
  ];

  quickLinks = [
    { label: 'Services', href: '#services' },
    { label: 'About Us', href: '#about' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Clients', href: '#clients' },
    { label: 'Location', href: '#location' },
    { label: 'Contact', href: '#contact' },
  ];

  services = ['AI Solutions', 'Angular Web Apps', 'Flutter Mobile', 'Figma Design', 'UI/UX Consulting', 'API Development'];
}
