import { Component, signal, computed, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { InteractionsService } from '../../services/interactions.service';
import { ThemeService, Theme } from '../../services/theme.service';
import { LoadingService } from '../../services/loading.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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
  private loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);

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
    social_instagram: '',
    social_twitter: '',
    social_facebook: '',
    social_website: '',
    social_tiktok: '',
    social_linkedin: '',
    tema: 'tropical' as Theme,
    notifiche: { commenti: true, seguaci: true, aggiornamenti: false, newsletter: true },
    privacy: { profiloPubblico: true, mostraLibreria: false, indicizza: true },
  };

  // Letture Consigliate (Author setting)
  allStories: any[] = [];
  recommendedStoryIds: string[] = [];
  searchStoryText: string = '';
  showStoryDropdown = false;
  
  get filteredStoriesForSearch() {
    if (!this.searchStoryText) return [];
    return this.allStories.filter(s => s.title.toLowerCase().includes(this.searchStoryText.toLowerCase()) && !this.recommendedStoryIds.includes(s.id));
  }

  get recommendedStoriesDetails() {
    return this.recommendedStoryIds.map(id => this.allStories.find(s => s.id === id)).filter(s => !!s);
  }

  savedFeedback = false;

  ngOnInit(): void {
    const u = this.currentUser();
    if (u) {
      this.settings.nome  = u.username;
      this.settings.email = u.email;

      this.settings.tema = this.themeService.currentTheme();

      // Carica le interazioni in memoria
      this.settings.handle = u.email;

      if ((u as any).avatar_url) {
        this.preloadImage((u as any).avatar_url);
      }

      // Fetch user profile from DB to get fresh data
      this.api.getUserProfile(u.id).subscribe({
        next: (profile) => {
          this.fullProfile = profile;
          if (profile.location) this.settings.posizione = profile.location;
          if (profile.social_instagram) this.settings.social_instagram = profile.social_instagram;
          if (profile.social_twitter) this.settings.social_twitter = profile.social_twitter;
          if (profile.social_facebook) this.settings.social_facebook = profile.social_facebook;
          if (profile.social_website) this.settings.social_website = profile.social_website;
          if (profile.social_tiktok) this.settings.social_tiktok = profile.social_tiktok;
          if (profile.social_linkedin) this.settings.social_linkedin = profile.social_linkedin;
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

      // Carica tutte le storie per il dropdown delle letture consigliate
      this.api.getStories().subscribe({
        next: (stories) => this.allStories = stories,
        error: (err) => console.warn('Errore caricamento tutte le storie:', err)
      });

      // Carica letture consigliate salvate
      this.api.getAuthorRecommended(u.id).subscribe({
        next: (stories) => {
          this.recommendedStoryIds = stories.map((s: any) => s.id);
          this.cdr.detectChanges();
        },
        error: (err) => console.warn('Errore caricamento recommended:', err)
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
    
    // Salva le storie raccomandate e il profilo
    const user = this.currentUser();
    if (user) {
      this.api.updateAuthorRecommended(user.id, this.recommendedStoryIds).subscribe({
        next: () => console.log('Letture consigliate aggiornate'),
        error: (err) => console.error('Errore aggiornamento letture consigliate', err)
      });
      
      this.api.updateUserProfile(user.id, {
        social_instagram: this.settings.social_instagram || null,
        social_twitter: this.settings.social_twitter || null,
        social_facebook: this.settings.social_facebook || null,
        social_website: this.settings.social_website || null,
        social_tiktok: this.settings.social_tiktok || null,
        social_linkedin: this.settings.social_linkedin || null
      }).subscribe({
        next: () => console.log('Profilo social aggiornato'),
        error: (err) => console.error('Errore aggiornamento profilo', err)
      });
    }

    this.savedFeedback = true;
    setTimeout(() => (this.savedFeedback = false), 2000);
  }

  addRecommendedStory(story: any) {
    if (this.recommendedStoryIds.length >= 10) return; // Max 10
    if (!this.recommendedStoryIds.includes(story.id)) {
      this.recommendedStoryIds.push(story.id);
      this.searchStoryText = '';
      this.showStoryDropdown = false;
    }
  }

  removeRecommendedStory(storyId: string) {
    this.recommendedStoryIds = this.recommendedStoryIds.filter(id => id !== storyId);
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

  private preloadImage(url: string) {
    if (!isPlatformBrowser(this.platformId) || !url) return;
    this.loadingService.show();
    const img = new Image();
    img.onload = () => this.loadingService.hide();
    img.onerror = () => this.loadingService.hide();
    img.src = url;
  }
}