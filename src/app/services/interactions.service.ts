import { Injectable, signal, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Api } from './api';
import { AuthService } from './auth.service';

/**
 * Servizio centralizzato per gestire i like e i bookmark dell'utente.
 * Mantiene in memoria i Set di story_id liked/bookmarked e li sincronizza col backend.
 */
@Injectable({ providedIn: 'root' })
export class InteractionsService {

  private api = inject(Api);
  private authService = inject(AuthService);

  /** Set di story_id che l'utente ha liked */
  private _likedIds = signal<Set<string>>(new Set());
  /** Set di story_id che l'utente ha bookmarked */
  private _bookmarkedIds = signal<Set<string>>(new Set());

  /** Flag: i dati sono stati già caricati dal server? */
  private loaded = false;

  /**
   * Carica gli ID liked/bookmarked dal backend.
   * Restituisce un Observable che completa quando entrambe le chiamate sono terminate.
   * Può essere chiamato più volte: esegue la chiamata solo la prima volta.
   */
  loadUserInteractions(): Observable<boolean> {
    const user = this.authService.currentUser();
    if (!user) return of(false);
    if (this.loaded) return of(true);
    this.loaded = true;

    return forkJoin({
      likes: this.api.getLikedIds(user.id).pipe(
        tap(ids => this._likedIds.set(new Set(ids))),
        catchError(err => { console.warn('Errore caricamento likes:', err); return of([]); })
      ),
      bookmarks: this.api.getBookmarkedIds(user.id).pipe(
        tap(ids => this._bookmarkedIds.set(new Set(ids))),
        catchError(err => { console.warn('Errore caricamento bookmarks:', err); return of([]); })
      )
    }).pipe(
      // mappa il risultato a true per indicare che il caricamento è completato
      tap(() => {}),
      catchError(() => of(false))
    ) as any as Observable<boolean>;
  }

  /** Forza il ricaricamento (utile dopo login) */
  resetAndLoad(): Observable<boolean> {
    this.loaded = false;
    return this.loadUserInteractions();
  }

  /** Controlla se una storia è liked — legge direttamente dal Signal */
  isLiked(storyId: string): boolean {
    return this._likedIds().has(storyId);
  }

  /** Controlla se una storia è bookmarked — legge direttamente dal Signal */
  isBookmarked(storyId: string): boolean {
    return this._bookmarkedIds().has(storyId);
  }

  /** Toggle like — aggiorna ottimisticamente e chiama il backend */
  toggleLike(storyId: string): void {
    const user = this.authService.currentUser();
    if (!user) return;

    // Aggiornamento ottimistico
    const current = new Set(this._likedIds());
    if (current.has(storyId)) {
      current.delete(storyId);
    } else {
      current.add(storyId);
    }
    this._likedIds.set(current);

    // Chiamata al backend
    this.api.toggleLike(user.id, storyId).subscribe({
      error: (err) => {
        console.error('Errore toggle like:', err);
        // Rollback in caso di errore
        const rollback = new Set(this._likedIds());
        if (rollback.has(storyId)) {
          rollback.delete(storyId);
        } else {
          rollback.add(storyId);
        }
        this._likedIds.set(rollback);
      }
    });
  }

  /** Toggle bookmark — aggiorna ottimisticamente e chiama il backend */
  toggleBookmark(storyId: string): void {
    const user = this.authService.currentUser();
    if (!user) return;

    // Aggiornamento ottimistico
    const current = new Set(this._bookmarkedIds());
    if (current.has(storyId)) {
      current.delete(storyId);
    } else {
      current.add(storyId);
    }
    this._bookmarkedIds.set(current);

    // Chiamata al backend
    this.api.toggleBookmark(user.id, storyId).subscribe({
      error: (err) => {
        console.error('Errore toggle bookmark:', err);
        // Rollback in caso di errore
        const rollback = new Set(this._bookmarkedIds());
        if (rollback.has(storyId)) {
          rollback.delete(storyId);
        } else {
          rollback.add(storyId);
        }
        this._bookmarkedIds.set(rollback);
      }
    });
  }
}
