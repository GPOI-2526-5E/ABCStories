import { Component, signal, computed, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { InteractionsService } from '../../services/interactions.service';
import { ThemeService, Theme } from '../../services/theme.service';

import { RouterModule } from '@angular/router';

export type Section = 'profilo' | 'mipiace' | 'preferiti' | 'autori' | 'impostazioni';

export interface UserBook {
  id: string;
  title: string;
  author_id: string;
  description: string;
  genre: string;
  image_url: string;
  rating: number;
  readers_count: string;
  pages: number;
  release_year: number;
}

export interface Author {
  id: number;
  initials: string;
  name: string;
  handle: string;
  description: string;
  stories: number;
  avatarGradient: string;
  following: boolean;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, RouterModule],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User implements OnInit {

  private authService = inject(AuthService);
  private api = inject(Api);
  private interactions = inject(InteractionsService);
  public themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  /** Utente loggato (segnale) */
  currentUser = this.authService.currentUser;

  /** Prime 2 lettere del nome utente come iniziali dell'avatar */
  userInitials = computed(() => {
    const name = this.currentUser()?.username ?? '';
    return name.slice(0, 2).toUpperCase();
  });

  activeSection = signal<Section>('profilo');
  fullProfile: any = null;

  navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'profilo', label: 'Profilo', icon: '👤' },
    { id: 'mipiace', label: 'Mi piace', icon: '❤️' },
    { id: 'preferiti', label: 'Preferiti', icon: '🔖' },
    { id: 'autori', label: 'Autori seguiti', icon: '✍️' },
    { id: 'impostazioni', label: 'Impostazioni', icon: '⚙️' },
  ];

  likedBooks: UserBook[] = [];

  favoriteBooks: UserBook[] = [];

  followedAuthors: any[] = [];

  settings = {
    nome: '',
    handle: '',
    email: '',
    posizione: '',
    tema: 'tropical' as Theme,
    notifiche: { commenti: true, seguaci: true, aggiornamenti: false, newsletter: true },
    privacy: { profiloPubblico: true, mostraLibreria: false, indicizza: true },
  };

  savedFeedback = false;

  ngOnInit(): void {
    const u = this.currentUser();
    if (u) {
      this.settings.nome  = u.username;
      this.settings.email = u.email;

      this.settings.tema = this.themeService.currentTheme();

      // Carica le interazioni in memoria
      this.interactions.loadUserInteractions();

      // Carica il profilo completo (bio, location, avatar, ecc.) dal DB
      this.api.getUserProfile(u.id).subscribe({
        next: (profile) => {
          this.fullProfile = profile;
          if (profile.location) this.settings.posizione = profile.location;
          this.cdr.detectChanges();
        },
        error: (err) => console.warn('Errore caricamento profilo:', err)
      });

      // Carica storie liked dal DB
      this.api.getLikedStories(u.id).subscribe({
        next: (stories) => this.likedBooks = stories,
        error: (err) => console.warn('Errore caricamento liked:', err)
      });

      // Carica storie bookmarked dal DB
      this.api.getBookmarkedStories(u.id).subscribe({
        next: (stories) => this.favoriteBooks = stories,
        error: (err) => console.warn('Errore caricamento bookmarks:', err)
      });
      // Carica autori seguiti dal DB
      this.api.getFollowedAuthors(u.id).subscribe({
        next: (authors) => {
          this.followedAuthors = authors.map(a => ({
            ...a,
            initials: a.name.slice(0, 2).toUpperCase(),
            avatarGradient: 'linear-gradient(135deg, #f0d870, #f08878)'
          }));
          this.cdr.detectChanges();
        },
        error: (err) => console.warn('Errore caricamento autori seguiti:', err)
      });
    }
  }

  setSection(id: Section): void {
    this.activeSection.set(id);
  }

  toggleFollow(author: any): void {
    const u = this.currentUser();
    if (!u) return;
    
    // Unfollow real-time
    this.api.unfollowUser(u.id, author.id).subscribe({
      next: () => {
        // Rimuove l'autore dall'array localmente in modo che la card scompaia
        this.followedAuthors = this.followedAuthors.filter(a => a.id !== author.id);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore unfollow', err)
    });
  }

  saveSettings(): void {
    this.themeService.setTheme(this.settings.tema);
    this.savedFeedback = true;
    setTimeout(() => (this.savedFeedback = false), 2000);
  }

  removeLike(book: UserBook, event: Event): void {
    event.stopPropagation();
    if (book.id) {
      this.interactions.toggleLike(book.id);
      this.likedBooks = this.likedBooks.filter(b => b.id !== book.id);
    }
  }

  removeBookmark(book: UserBook, event: Event): void {
    event.stopPropagation();
    if (book.id) {
      this.interactions.toggleBookmark(book.id);
      this.favoriteBooks = this.favoriteBooks.filter(b => b.id !== book.id);
    }
  }
}