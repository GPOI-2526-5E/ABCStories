import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export type Theme = 'tropical' | 'dark' | 'light' | 'sunset';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  currentTheme = signal<Theme>('tropical');
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  constructor() {
    this.loadTheme();

    // Sincronizza il tema con le impostazioni dell'utente loggato
    effect(() => {
      const user = this.authService.currentUser();
      if (user && (user as any).theme) {
        this.currentTheme.set((user as any).theme);
      }
    });

    // Effect to apply theme to document root whenever it changes
    effect(() => {
      const theme = this.currentTheme();
      const isLoggedIn = this.authService.isLoggedIn();
      
      const themeToApply = isLoggedIn ? theme : 'tropical';
      this.applyTheme(themeToApply);
    });
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('abc_stories_theme', theme);
    }
  }

  private loadTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('abc_stories_theme') as Theme;
      if (savedTheme) {
        this.currentTheme.set(savedTheme);
      }
    }
  }

  private applyTheme(theme: Theme) {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }
}
