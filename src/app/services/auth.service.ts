import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  social_instagram?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_website?: string;
  social_tiktok?: string;
  social_linkedin?: string;
  theme?: string;
  notifiche_commenti?: boolean;
  notifiche_seguaci?: boolean;
  notifiche_aggiornamenti?: boolean;
  notifiche_newsletter?: boolean;
  privacy_profilo_pubblico?: boolean;
  privacy_mostra_libreria?: boolean;
  privacy_indicizza?: boolean;
  reading_font?: string;
  reading_font_size?: string;
  reading_mode?: string;
  reading_width?: string;
  sensitive_filter?: boolean;
  visualizza_18plus?: boolean;
  visualizza_18plus_community?: boolean;
  notifiche_community_like?: boolean;
  notifiche_community_commento?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private _user = signal<AuthUser | null>(null);

  isLoggedIn = computed(() => this._user() !== null);
  currentUser = this._user.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        try { this._user.set(JSON.parse(stored)); }
        catch { localStorage.removeItem(this.STORAGE_KEY); }
      }
    }
  }

  login(user: AuthUser): void {
    this._user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  updateCurrentUser(user: AuthUser): void {
    this._user.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    }
  }

  logout(): void {
    this._user.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }
}
