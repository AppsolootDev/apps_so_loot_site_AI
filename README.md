# Lociware Agency Website

Built with [Angular CLI](https://github.com/angular/angular-cli) version 21.2.10.

## Site Structure

| Section | Highlights |
|---|---|
| **Pre-loader** | Dynamic countdown timer based on connection speed, ensuring a smooth and engaging start. |
| **Navbar** | Sticky glass effect on scroll, mobile hamburger with animated X |
| **Hero** | Animated blob background + grid overlay, auto-advancing tech slider (AI → Angular → Flutter → Figma) with SVG icons, live dot nav. Features an interactive custom UFO mouse cursor with crosshairs visible only over this section. |
| **Services** | 4 glassmorphism cards with inline SVGs, feature lists, tech chips, hover lime-accent top border |
| **About** | Company story, orbital animated visual with revolving dots, stats grid |
| **Portfolio** | Zarbiter · Chozen One Gym · Patron Assist — large horizontal cards with project details |
| **Testimonials** | 3 dummy client quotes (Sipho Mokoena, Natasha Williams, James Hlongwane) with star ratings |
| **Clients 3D** | CSS `preserve-3d` rotating cylinder carousel — zarbiter.co.za, chozenonegym.com, patron-assist.co.za |
| **Map** | OpenStreetMap iframe with `filter: grayscale→invert→sepia→hue-rotate(55deg)` for black+lime look, lime pulsing pin |
| **Footer** | X/Twitter auto-scroll marquee + Instagram reverse-scroll marquee, all nav columns, copyright |

**Design system**: Lime `#c5f219` accent, `#06070A` dark background, Orbitron headings, Inter body, glassmorphism cards.

**API service** at `src/app/services/lociware-api.service.ts` — update `baseUrl` from `https://api.lociware.co.za` to your real endpoint.

## Interactive Elements & Gamification

The website incorporates several interactive and gamified elements to enhance user engagement:

*   **Dynamic Custom Cursor**: A custom UFO-shaped mouse cursor (`#ufo-cursor`) that is 75% smaller than its original size. Crosshairs (`#crosshair-h`, `#crosshair-v`) are dynamically displayed only when the cursor hovers over the `#hero-section`, creating a focused interactive zone.
*   **Pre-loader Countdown**: A full-screen overlay with a countdown timer that appears before content loads. The initial countdown duration is dynamically set based on perceived connection speed, providing a tailored loading experience.
*   **Clickable Astronaut & Rocket**: Interactive astronaut and rocket elements (identified by IDs like `#astronaut-element` and `#rocket-element`) that, when clicked, trigger informational pop-up modals (`.generic-popup`) instead of simple icon generations.
*   **Question & Answer Pop-ups**: Informational pop-ups (`.qa-popup`) that dynamically adjust their font size to be smaller when displaying more detailed questions, improving readability for extensive content.
*   **Back to Top Rocket**: A visually engaging rocket icon (`.back-to-top`) that appears as the user scrolls down, offering a quick and animated return to the top of the page.

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

## Deployment

To deploy the application to GitHub Pages (or a similar static hosting service), use the following command:

```bash
npm run deploy
```

This script performs the following actions:
1.  `ng build --configuration production --base-href /AppSoLoot/`: Builds the Angular application for production, optimizing it and setting the base href. **Ensure `/AppSoLoot/` matches your GitHub repository name.** If your repository name is different, update the `base-href` accordingly in the `package.json` script.
2.  `gh-pages -d dist/app-so-loot`: Deploys the contents of the `dist/app-so-loot` directory to the `gh-pages` branch of your GitHub repository.

**Prerequisites for Deployment:**
*   Your project must be a Git repository and pushed to GitHub.
*   The `gh-pages` package must be installed as a dev dependency (`npm install gh-pages --save-dev`).

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
