import { Injectable, signal, computed, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AuthUser {
  email: string;
  username?: string;
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

  login(email: string, username?: string): void {
    const user: AuthUser = { email, username };
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
