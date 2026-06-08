import { Component, signal, computed, inject, OnInit, ChangeDetectorRef, HostListener } from '@angular/core';
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
import { DialogService } from '../../services/dialog.service';

import { RouterModule, Router } from '@angular/router';

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
  img?: string;
  author?: string;
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
  public interactions = inject(InteractionsService);
  public themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private dialogService = inject(DialogService);

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
    { id: 'profilo', label: 'Profilo', icon: '/assets/Icone/profilo.png' },
    { id: 'mipiace', label: 'Mi piace', icon: '/assets/Icone/mipiace.png' },
    { id: 'preferiti', label: 'Preferiti', icon: '/assets/Icone/preferiti.png' },
    { id: 'autori', label: 'Autori seguiti', icon: '/assets/Icone/autore.png' },
    { id: 'impostazioni', label: 'Impostazioni', icon: '/assets/Icone/impostazioni.png' },
  ];

  likedBooks: UserBook[] = [];

  favoriteBooks: UserBook[] = [];

  followedAuthors: any[] = [];

  followersCount = 0;
  followingCount = 0;

  settings = {
    nome: '',
    handle: '',
    email: '',
    posizione: '',
    bio: '',
    avatar_url: '',
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

  MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
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

      this.interactions.loadUserInteractions().subscribe();

      // Fetch user profile from DB to get fresh data
      this.api.getUserProfile(u.id).subscribe({
        next: (profile) => {
          this.fullProfile = profile;
          if (profile.location) this.settings.posizione = profile.location;
          if (profile.bio) this.settings.bio = profile.bio;
          if (profile.avatar_url) this.settings.avatar_url = profile.avatar_url;
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

      // Fetch Followers and Follow Counts
      this.api.getFollowsCount(u.id).subscribe({
        next: (data) => {
          this.followersCount = data.followersCount;
          this.followingCount = data.followingCount;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore caricamento contatori follow:', err)
      });

      // Carica storie liked dal DB
      this.api.getLikedStories(u.id).subscribe({
        next: (stories) => this.likedBooks = stories.map(s => this.mapDbBook(s)),
        error: (err) => console.warn('Errore caricamento liked:', err)
      });

      // Carica storie bookmarked dal DB
      this.api.getBookmarkedStories(u.id).subscribe({
        next: (stories) => this.favoriteBooks = stories.map(s => this.mapDbBook(s)),
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
        this.followingCount = Math.max(0, this.followingCount - 1);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore unfollow', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
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
        username: this.settings.nome,
        bio: this.settings.bio,
        location: this.settings.posizione,
        avatar_url: this.settings.avatar_url,
        social_instagram: this.settings.social_instagram || null,
        social_twitter: this.settings.social_twitter || null,
        social_facebook: this.settings.social_facebook || null,
        social_website: this.settings.social_website || null,
        social_tiktok: this.settings.social_tiktok || null,
        social_linkedin: this.settings.social_linkedin || null
      }).subscribe({
        next: (updatedUser) => {
          console.log('Profilo social e dettagli aggiornati:', updatedUser);
          this.authService.updateCurrentUser(updatedUser);
          this.fullProfile = updatedUser;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore aggiornamento profilo', err)
      });
    }

    this.savedFeedback = true;
    setTimeout(() => (this.savedFeedback = false), 2000);
  }

  onAvatarImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > this.MAX_IMAGE_SIZE_BYTES) {
      this.dialogService.alert('Immagine troppo grande', 'Il limite massimo è 2MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.settings.avatar_url = base64;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && typeof target.closest === 'function' && !target.closest('.story-search-container')) {
      this.showStoryDropdown = false;
    }
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

  private mapDbBook(s: any): any {
    return {
      id: s.id,
      title: s.title ?? '',
      author: s.author_name ?? 'Autore sconosciuto',
      author_id: s.author_id,
      desc: s.description ?? '',
      img: s.image_url ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80',
      genre: s.genre ?? '',
      tag: s.tag ?? s.genre ?? '',
      pages: s.pages ?? 0,
      year: s.release_year ?? s.year ?? 0,
      rating: s.rating ? parseFloat(s.rating) : 0,
      readers: s.readers_count ? String(s.readers_count) : '0',
      chaptersCount: s.chapters_count ?? 0,
      liked: false,
      bookmarked: false,
    };
  }

  onBookClick(book: any, index: number) {
    this.router.navigate(
      ['/book', book.id],
      {
        state: { book }
      }
    );
  }

  goToAuthor(authorId: string | undefined, event: Event) {
    event.stopPropagation();
    if (authorId) {
      this.router.navigate(['/author'], { state: { authorId } });
    }
  }

  toggleLike(book: any) {
    if (book.id) {
      this.interactions.toggleLike(book.id);
      this.likedBooks = this.likedBooks.filter(b => b.id !== book.id);
    }
  }

  toggleBookmark(book: any) {
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