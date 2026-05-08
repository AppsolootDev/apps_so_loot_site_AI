I would liek the # Lociware Agency Website

Built with [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10.

## Site Structure

| Section | Highlights |
|---|---|
| **Navbar** | Sticky glass effect on scroll, mobile hamburger with animated X |
| **Hero** | Animated blob background + grid overlay, auto-advancing tech slider (AI → Angular → Flutter → Figma) with SVG icons, live dot nav |
| **Services** | 4 glassmorphism cards with inline SVGs, feature lists, tech chips, hover lime-accent top border |
| **About** | Company story, orbital animated visual with revolving dots, stats grid |
| **Portfolio** | Zarbiter · Chozen One Gym · Patron Assist — large horizontal cards with project details |
| **Testimonials** | 3 dummy client quotes (Sipho Mokoena, Natasha Williams, James Hlongwane) with star ratings |
| **Clients 3D** | CSS `preserve-3d` rotating cylinder carousel — zarbiter.co.za, chozenonegym.com, patron-assist.co.za |
| **Map** | OpenStreetMap iframe with `filter: grayscale→invert→sepia→hue-rotate(55deg)` for black+lime look, lime pulsing pin |
| **Footer** | X/Twitter auto-scroll marquee + Instagram reverse-scroll marquee, all nav columns, copyright |

**Design system**: Lime `#c5f219` accent, `#06070A` dark background, Orbitron headings, Inter body, glassmorphism cards.

**API service** at `src/app/services/lociware-api.service.ts` — update `baseUrl` from `https://api.lociware.co.za` to your real endpoint.

## Development server

```bash
npm start
```

Runs on **http://localhost:5300/**. The app reloads automatically on file changes.

## Build

```bash
ng build
```

Artifacts are output to the `dist/` directory. Production build is optimised for performance.

## Code scaffolding

```bash
ng generate component component-name
```

## Running unit tests

```bash
ng test
```

Uses [Vitest](https://vitest.dev/).

## Additional Resources

[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
