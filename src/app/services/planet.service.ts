import { Injectable } from '@angular/core';

interface ProjectUsage {
  name: string;
  type: 'web' | 'mobile' | 'ai' | 'backend' | 'design';
}

interface Satellite {
  name: string; rx: number; ry: number;
  speed: number; phase: number; size: number; color: string;
}

export interface ChemicalElement {
  symbol: string;
  number: number | undefined;
  weight: number | undefined;
}

export interface Planet {
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
  composition: ChemicalElement[]; // Added
  clickable: boolean; // Added
  moonsCount: number; // Added
  dayLength: string; // Added
}

@Injectable({
  providedIn: 'root'
})
export class PlanetService {

  private readonly atomicNumbersMap: { [key: string]: number } = {
    'H': 1, 'He': 2, 'Li': 3, 'Be': 4, 'B': 5, 'C': 6, 'N': 7, 'O': 8, 'F': 9, 'Ne': 10,
    'Na': 11, 'Mg': 12, 'Al': 13, 'Si': 14, 'P': 15, 'S': 16, 'Cl': 17, 'Ar': 18, 'K': 19, 'Ca': 20,
    'Fe': 26, 'Ni': 28,
    // Molecules (atomic number 0 as they are not single atoms)
    'CO2': 0, 'CH4': 0, 'SO2': 0, 'NH3': 0, 'H2O': 0, 'C2H6': 0, 'Tholins': 0,
    'N2': 0, 'O2': 0, 'H2': 0, 'CO': 0,
  };

  private readonly atomicWeightsMap: { [key: string]: number } = {
    'H': 1.008, 'He': 4.0026, 'Li': 6.94, 'Be': 9.0122, 'B': 10.81, 'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
    'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974, 'S': 32.06, 'Cl': 35.45, 'Ar': 39.948, 'K': 39.098, 'Ca': 40.078,
    'Fe': 55.845, 'Ni': 58.6934,
    // Common molecules/compounds - average molecular weight
    'CO2': 44.01, 'CH4': 16.04, 'SO2': 64.06, 'NH3': 17.03, 'H2O': 18.015, 'C2H6': 30.07, 'Tholins': 100, // Placeholder average
    'N2': 28.014, // 2 * 14.007
    'O2': 31.998, // 2 * 15.999
    'H2': 2.016,  // 2 * 1.008
    'CO': 28.010, // 12.011 + 15.999
  };

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
      composition: [
        { symbol: 'Fe', number: 26, weight: 55.845 },
        { symbol: 'Ni', number: 28, weight: 58.6934 },
        { symbol: 'Si', number: 14, weight: 28.085 }
      ],
      clickable: true,
      moonsCount: 0,
      dayLength: '58.6 Earth days',
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
      composition: [
        { symbol: 'CO2', number: this.atomicNumbersMap['CO2'], weight: this.atomicWeightsMap['CO2'] },
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] },
        { symbol: 'SO2', number: this.atomicNumbersMap['SO2'], weight: this.atomicWeightsMap['SO2'] }
      ],
      clickable: true,
      moonsCount: 0,
      dayLength: '243 Earth days',
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
      composition: [
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] },
        { symbol: 'O2', number: this.atomicNumbersMap['O2'], weight: this.atomicWeightsMap['O2'] },
        { symbol: 'Ar', number: this.atomicNumbersMap['Ar'], weight: this.atomicWeightsMap['Ar'] }
      ],
      clickable: true,
      moonsCount: 1,
      dayLength: '24 hours',
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
      composition: [
        { symbol: 'CO2', number: this.atomicNumbersMap['CO2'], weight: this.atomicWeightsMap['CO2'] },
        { symbol: 'Ar', number: this.atomicNumbersMap['Ar'], weight: this.atomicWeightsMap['Ar'] },
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] }
      ],
      clickable: true,
      moonsCount: 2,
      dayLength: '24.6 hours',
    },
    {
      name: 'Jupiter', tech: 'Dart', techAbbr: 'DT',
      techDesc: 'Client-optimised language powering Flutter\'s silky 60 fps rendering engine.',
      oneLiner: 'Flutter\'s purpose-built language — AOT-compiled, null-safe by default, and a joy to write.',
      history: 'Lars Bak and Kasper Lund designed Dart at Google, open-sourcing it in 2011 as a potential JavaScript replacement. That vision faded, but Dart found its calling as Flutter\'s exclusive language. Dart 2 (2018) introduced sound null safety. Dart 3 (2023) brought records, patterns and class modifiers — dramatically improving large-scale Flutter architecture.',
      clientBenefit: 'Dart\'s strong typing and null safety prevent whole categories of runtime crashes in mobile apps. For Zarbiter\'s dispute-filing flow, complex multi-step forms with conditional validation are written in pure Dart and tested headlessly. Dart isolates handle heavy PDF generation off the main thread, keeping UI at 60 fps.',
      fact: 'Largest planet — its Great Red Spot is a storm raging for over 350 years.',
      usedIn: [
        { name: 'Zarbiter', type: 'mobile' },
        { name: 'Patron Assist', type: 'mobile' },
        { name: 'Chozen One', type: 'mobile' },
      ],
      rx: 390, ry: 148, speed: 0.18, phase: 3.8,  size: 26,
      c: ['#e8c880', '#c8884a', '#8a4c20'], glow: '#c47830',
      composition: [
        { symbol: 'H2', number: this.atomicNumbersMap['H2'], weight: this.atomicWeightsMap['H2'] },
        { symbol: 'He', number: this.atomicNumbersMap['He'], weight: this.atomicWeightsMap['He'] },
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] }
      ],
      clickable: true,
      moonsCount: 95,
      dayLength: '9.9 hours',
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
      composition: [
        { symbol: 'H2', number: this.atomicNumbersMap['H2'], weight: this.atomicWeightsMap['H2'] },
        { symbol: 'He', number: this.atomicNumbersMap['He'], weight: this.atomicWeightsMap['He'] },
        { symbol: 'NH3', number: this.atomicNumbersMap['NH3'], weight: this.atomicWeightsMap['NH3'] }
      ],
      clickable: true,
      moonsCount: 146,
      dayLength: '10.7 hours',
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
      composition: [
        { symbol: 'H2', number: this.atomicNumbersMap['H2'], weight: this.atomicWeightsMap['H2'] },
        { symbol: 'He', number: this.atomicNumbersMap['He'], weight: this.atomicWeightsMap['He'] },
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] }
      ],
      clickable: true,
      moonsCount: 27,
      dayLength: '17.2 hours',
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
      composition: [
        { symbol: 'H2', number: this.atomicNumbersMap['H2'], weight: this.atomicWeightsMap['H2'] },
        { symbol: 'He', number: this.atomicNumbersMap['He'], weight: this.atomicWeightsMap['He'] },
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] }
      ],
      clickable: true,
      moonsCount: 14,
      dayLength: '16.1 hours',
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
      composition: [
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] },
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] },
        { symbol: 'CO', number: this.atomicNumbersMap['CO'], weight: this.atomicWeightsMap['CO'] }
      ],
      clickable: true,
      moonsCount: 5,
      dayLength: '6.4 Earth days',
    },
    {
      name: 'Eris', tech: 'Dwarf Planet', techAbbr: 'DP',
      techDesc: 'A distant dwarf planet, larger than Pluto, in the scattered disc.',
      oneLiner: 'A cold, distant world, a testament to the outer reaches of our solar system.',
      history: 'Discovered in 2005, Eris was initially thought to be the tenth planet. Its discovery, along with several other similar objects, led to the redefinition of "planet" and Pluto\'s reclassification as a dwarf planet.',
      clientBenefit: 'N/A',
      fact: 'Has one moon, Dysnomia. Takes 558 Earth years to orbit the Sun.',
      usedIn: [],
      rx: 780, ry: 290, speed: 0.03, phase: 1.0, size: 6,
      c: ['#808080', '#606060', '#404040'], glow: '#505050',
      composition: [
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] },
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] },
        { symbol: 'C2H6', number: this.atomicNumbersMap['C2H6'], weight: this.atomicWeightsMap['C2H6'] }
      ],
      clickable: false,
      moonsCount: 1,
      dayLength: '1.08 Earth days',
    },
    {
      name: 'Haumea', tech: 'Dwarf Planet', techAbbr: 'DP',
      techDesc: 'An unusual, rapidly rotating dwarf planet with an elongated shape.',
      oneLiner: 'A cosmic rugby ball, spinning rapidly with its own ring system.',
      history: 'Discovered in 2004, Haumea is unique for its elongated shape and rapid rotation, which distorts it into an ellipsoid. It also has two moons and a faint ring system.',
      clientBenefit: 'N/A',
      fact: 'Its day is only 4 hours long, making it one of the fastest rotating large objects in the Solar System.',
      usedIn: [],
      rx: 850, ry: 310, speed: 0.028, phase: 2.5, size: 8,
      c: ['#a0a0a0', '#707070', '#505050'], glow: '#606060',
      hasRings: true,
      composition: [
        { symbol: 'H2O', number: this.atomicNumbersMap['H2O'], weight: this.atomicWeightsMap['H2O'] },
        { symbol: 'NH3', number: this.atomicNumbersMap['NH3'], weight: this.atomicWeightsMap['NH3'] }
      ],
      clickable: false,
      moonsCount: 2,
      dayLength: '3.9 hours',
    },
    {
      name: 'Makemake', tech: 'Dwarf Planet', techAbbr: 'DP',
      techDesc: 'A red-tinged dwarf planet in the Kuiper Belt, known for its methane ice.',
      oneLiner: 'A reddish world, covered in frozen methane, far from the sun\'s warmth.',
      history: 'Discovered in 2005, Makemake is one of the largest objects in the Kuiper Belt. It is notable for its reddish color, believed to be caused by methane ice on its surface.',
      clientBenefit: 'N/A',
      fact: 'Has no known moons, making it unique among the largest Kuiper Belt objects.',
      usedIn: [],
      rx: 920, ry: 330, speed: 0.025, phase: 4.0, size: 7,
      c: ['#b06060', '#804040', '#502020'], glow: '#703030',
      composition: [
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] },
        { symbol: 'C2H6', number: this.atomicNumbersMap['C2H6'], weight: this.atomicWeightsMap['C2H6'] },
        { symbol: 'N2', number: this.atomicNumbersMap['N2'], weight: this.atomicWeightsMap['N2'] }
      ],
      clickable: false,
      moonsCount: 0,
      dayLength: '22.5 hours',
    },
    {
      name: 'Gonggong', tech: 'Dwarf Planet', techAbbr: 'DP',
      techDesc: 'A large, dark red dwarf planet with a highly eccentric orbit.',
      oneLiner: 'A mysterious, dark red world, slowly traversing its elongated path around the sun.',
      history: 'Discovered in 2007, Gonggong is a large dwarf planet with a very eccentric orbit that takes it far from the Sun. It has a reddish color and a moon named Xiangliu.',
      clientBenefit: 'N/A',
      fact: 'Its surface is thought to be rich in water ice, but its dark red color suggests complex organic compounds.',
      usedIn: [],
      rx: 990, ry: 350, speed: 0.022, phase: 5.5, size: 9,
      c: ['#703030', '#502020', '#301010'], glow: '#401818',
      composition: [
        { symbol: 'H2O', number: this.atomicNumbersMap['H2O'], weight: this.atomicWeightsMap['H2O'] },
        { symbol: 'CH4', number: this.atomicNumbersMap['CH4'], weight: this.atomicWeightsMap['CH4'] },
        { symbol: 'Tholins', number: this.atomicNumbersMap['Tholins'], weight: this.atomicWeightsMap['Tholins'] }
      ],
      clickable: false,
      moonsCount: 1,
      dayLength: '22.4 hours',
    },
    {
      name: 'Quaoar', tech: 'Dwarf Planet', techAbbr: 'DP',
      techDesc: 'A large Kuiper Belt object with a recently discovered ring system.',
      oneLiner: 'A distant icy world, surprisingly adorned with a faint, unexpected ring.',
      history: 'Discovered in 2002, Quaoar is a large trans-Neptunian object. Recent observations in 2023 revealed it possesses a ring system, making it one of the few minor planets known to have rings.',
      clientBenefit: 'N/A',
      fact: 'Its ring is much farther out than the Roche limit, challenging current theories of ring formation.',
      usedIn: [],
      rx: 1060, ry: 370, speed: 0.02, phase: 0.8, size: 7,
      c: ['#9090b0', '#606080', '#404060'], glow: '#505070',
      hasRings: true,
      composition: [
        { symbol: 'H2O', number: this.atomicNumbersMap['H2O'], weight: this.atomicWeightsMap['H2O'] },
        { symbol: 'NH3', number: this.atomicNumbersMap['NH3'], weight: this.atomicWeightsMap['NH3'] },
        { symbol: 'C2H6', number: this.atomicNumbersMap['C2H6'], weight: this.atomicWeightsMap['C2H6'] }
      ],
      clickable: false,
      moonsCount: 1,
      dayLength: '8.9 hours',
    },
  ];

  getPlanets(): Planet[] {
    return [...this.planets]; // Return a copy to prevent external modification
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
      'DP': 'dwarf-planet.png', // Assuming you have a dwarf-planet icon
    };
    const iconFileName = iconMap[techAbbr];
    return iconFileName ? `/assets/icons/${iconFileName}` : '';
  }
}
