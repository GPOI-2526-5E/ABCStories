import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs/operators';
import { SKIP_LOADER } from './loading.context';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADER)) {
    return next(req);
  }

  const isMutation = req.method !== 'GET';
  const isAuth = req.url.includes('/login') || req.url.includes('/register');
  
  // Background endpoints that are fetched quietly
  const quietEndpoints = [
    '/api/likes', 
    '/api/bookmarks', 
    '/api/reading_progress',
    '/api/follows',
    '/api/interactions',
    '/api/search'
  ];
  const isQuiet = quietEndpoints.some(ep => req.url.includes(ep));

  if ((isMutation && !isAuth) || isQuiet) {
    return next(req);
  }

  const loadingService = inject(LoadingService);
  loadingService.show();
  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
