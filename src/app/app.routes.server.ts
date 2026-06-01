import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'book/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'reader/:storyId/:chapterId',
    renderMode: RenderMode.Server
  },
  {
    path: 'generi/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'author/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'scrivi/:storyId',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

