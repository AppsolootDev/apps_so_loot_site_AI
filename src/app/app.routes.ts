import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LociwareApiRedirectComponent } from './components/lociware-api-redirect/lociware-api-redirect.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    pathMatch: 'full',
  },
  {
    path: 'lociware-api',
    component: LociwareApiRedirectComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
