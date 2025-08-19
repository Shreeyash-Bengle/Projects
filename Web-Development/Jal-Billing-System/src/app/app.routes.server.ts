import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'billing/:id',
    renderMode: RenderMode.Server // Exclude dynamic billing from prerender
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
