import { Component } from '@angular/core';

interface Project {
  id: number;
  name: string;
  client: string;
  url: string;
  description: string;
  tags: string[];
  stack: string[];
  accentColor: string;
  category: string;
  featured?: boolean;
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent {
  projects: Project[] = [
    {
      id: 0,
      name: 'Lociware Platform',
      client: 'Lociware',
      url: 'https://www.lociware.co.za',
      description: 'End-to-end transport management platform — passengers book trips from pick-up to drop-off while operators manage fleets, enforce role-based access control across driver, dispatcher, operator and admin roles, monitor costs in real time, and generate 20+ operational reports for full workload visibility.',
      tags: ['Transport', 'RBAC', 'Analytics', 'Fleet'],
      stack: ['Angular', 'Flutter', 'Node.js', 'PostgreSQL'],
      accentColor: '#4bc8e8',
      category: 'Transport Platform',
      featured: true
    },
    {
      id: 1,
      name: 'Zarbiter Platform',
      client: 'Zarbiter',
      url: 'https://zarbiter.co.za',
      description: 'AI-powered legal arbitration platform that automates dispute resolution workflows. Features intelligent document analysis, outcome prediction, and real-time collaboration between parties.',
      tags: ['AI', 'Legal Tech', 'Angular'],
      stack: ['Angular', 'OpenAI', 'Node.js', 'PostgreSQL'],
      accentColor: '#9f7aea',
      category: 'Web Application'
    },
    {
      id: 2,
      name: 'Chozen One Gym',
      client: 'Chozen One',
      url: 'https://chozenonegym.com',
      description: 'Premium fitness and wellness platform with Flutter mobile app, class booking system, member management, progress tracking, and integrated payment gateway for seamless gym operations.',
      tags: ['Flutter', 'Fitness', 'Mobile'],
      stack: ['Flutter', 'Firebase', 'Stripe', 'Dart'],
      accentColor: '#c5f219',
      category: 'Mobile Application'
    },
    {
      id: 3,
      name: 'Patron Assist',
      client: 'Patron Assist',
      url: 'https://patron-assist.co.za',
      description: 'AI-powered hospitality assistant that handles guest inquiries, automates bookings, and provides real-time analytics for hospitality businesses — reducing staff workload by 60%.',
      tags: ['AI', 'Hospitality', 'Dashboard'],
      stack: ['Angular', 'LangChain', 'Python', 'FastAPI'],
      accentColor: '#54c5f8',
      category: 'AI Solution'
    }
  ];
}
