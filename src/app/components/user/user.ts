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

export type Section = 'profilo' | 'mipiace' | 'preferiti' | 'autori' | 'impostazioni' | 'collezioni';

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
    { id: 'collezioni', label: 'Collezioni', icon: '/assets/Icone/romanzo.png' },
    { id: 'impostazioni', label: 'Impostazioni', icon: '/assets/Icone/impostazioni.png' },
  ];

  likedBooks: UserBook[] = [];

  favoriteBooks: UserBook[] = [];

  // Collezioni
  collections: any[] = [];
  selectedCollection: any = null;
  isEditingCollection = false;
  collectionForm = {
    id: '',
    name: '',
    description: '',
    storyIds: [] as string[]
  };

  // Filtri e ricerca per la creazione della collezione
  filterLikes = true;
  filterFavorites = true;
  pickerSearchText = '';

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
    notifiche: {
      risposte_commenti: true,
      like_commenti: true,
      nuovo_follower: true,
      storie_like: true,
      storie_preferiti: true,
      aggiornamenti_nuova_storia: true,
      aggiornamenti_nuovo_capitolo: true,
      aggiornamenti_modifica_storia: true,
      aggiornamenti_modifica_capitolo: true,
      newsletter: true,
      community_like: true,
      community_commento: true
    },
    privacy: { profiloPubblico: true, mostraLibreria: false, indicizza: true },
    visualizza_18plus: false,
    visualizza_18plus_community: false,
    reading_font: 'sans-serif',
    reading_font_size: 'medium',
    reading_mode: 'scroll',
    reading_width: 'medium',
    sensitive_filter: false
  };

  // Letture Consigliate (Author setting)
  allStories: any[] = [];
  recommendedStoryIds: string[] = [];
  searchStoryText: string = '';
  showStoryDropdown = false;

  dropdownsOpen = {
    tema: false,
    reading_font: false,
    reading_font_size: false,
    reading_width: false
  };

  toggleDropdown(type: 'tema' | 'reading_font' | 'reading_font_size' | 'reading_width', event: Event) {
    event.stopPropagation();
    const currentState = (this.dropdownsOpen as any)[type];
    Object.keys(this.dropdownsOpen).forEach(k => {
      (this.dropdownsOpen as any)[k] = false;
    });
    (this.dropdownsOpen as any)[type] = !currentState;
  }

  selectOption(type: 'tema' | 'reading_font' | 'reading_font_size' | 'reading_width', value: any) {
    (this.settings as any)[type] = value;
    if (type === 'tema') {
      this.themeService.setTheme(value);
    }
    this.saveSettings();
    (this.dropdownsOpen as any)[type] = false;
  }

  getThemeLabel(value: string): string {
    const map: any = {
      tropical: 'Tropicale (Predefinito)',
      dark: 'Scuro (Nero)',
      light: 'Chiaro',
      sunset: 'Sunset (Tramonto)'
    };
    return map[value] || value;
  }

  getFontLabel(value: string): string {
    const map: any = {
      'sans-serif': 'Sans-serif (Lineare)',
      'serif': 'Serif (Grazie)',
      'monospace': 'Monospace (Spazio Fisso)',
      'opendyslexic': 'OpenDyslexic (Alta Leggibilità)'
    };
    return map[value] || value;
  }

  getFontSizeLabel(value: string): string {
    const map: any = {
      small: 'Piccolo',
      medium: 'Medio',
      large: 'Grande',
      'x-large': 'Molto Grande'
    };
    return map[value] || value;
  }

  getWidthLabel(value: string): string {
    const map: any = {
      narrow: 'Stretto',
      medium: 'Medio',
      wide: 'Largo'
    };
    return map[value] || value;
  }

  get filteredStoriesForSearch() {
    if (!this.searchStoryText) return [];
    return this.allStories.filter(s => s.title.toLowerCase().includes(this.searchStoryText.toLowerCase()) && !this.recommendedStoryIds.includes(s.id));
  }

  get recommendedStoriesDetails() {
    return this.recommendedStoryIds.map(id => this.allStories.find(s => s.id === id)).filter(s => !!s);
  }

  MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
  savedFeedback = false;
  showToast = false;
  private toastTimeout: any = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.history && window.history.state) {
      const stateSection = window.history.state.section;
      if (stateSection && ['profilo', 'mipiace', 'preferiti', 'autori', 'impostazioni', 'collezioni'].includes(stateSection)) {
        this.activeSection.set(stateSection as Section);
      }
    }

    const u = this.currentUser();
    if (u) {
      this.loadCollections();
    }
    if (u) {
      this.settings.nome = u.username;
      this.settings.email = u.email;

      this.settings.tema = this.themeService.currentTheme();

      // Carica le interazioni in memoria
      this.settings.handle = u.email;

      if ((u as any).avatar_url) {
        this.preloadImage((u as any).avatar_url);
      }

      this.interactions.loadUserInteractions().subscribe();

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

          if (profile.theme) this.settings.tema = profile.theme;
          if (profile.notifiche_risposte_commenti !== undefined && profile.notifiche_risposte_commenti !== null) this.settings.notifiche.risposte_commenti = profile.notifiche_risposte_commenti;
          if (profile.notifiche_like_commenti !== undefined && profile.notifiche_like_commenti !== null) this.settings.notifiche.like_commenti = profile.notifiche_like_commenti;
          if (profile.notifiche_nuovo_follower !== undefined && profile.notifiche_nuovo_follower !== null) this.settings.notifiche.nuovo_follower = profile.notifiche_nuovo_follower;
          if (profile.notifiche_storie_like !== undefined && profile.notifiche_storie_like !== null) this.settings.notifiche.storie_like = profile.notifiche_storie_like;
          if (profile.notifiche_storie_preferiti !== undefined && profile.notifiche_storie_preferiti !== null) this.settings.notifiche.storie_preferiti = profile.notifiche_storie_preferiti;
          if (profile.notifiche_aggiornamenti_nuova_storia !== undefined && profile.notifiche_aggiornamenti_nuova_storia !== null) this.settings.notifiche.aggiornamenti_nuova_storia = profile.notifiche_aggiornamenti_nuova_storia;
          if (profile.notifiche_aggiornamenti_nuovo_capitolo !== undefined && profile.notifiche_aggiornamenti_nuovo_capitolo !== null) this.settings.notifiche.aggiornamenti_nuovo_capitolo = profile.notifiche_aggiornamenti_nuovo_capitolo;
          if (profile.notifiche_aggiornamenti_modifica_storia !== undefined && profile.notifiche_aggiornamenti_modifica_storia !== null) this.settings.notifiche.aggiornamenti_modifica_storia = profile.notifiche_aggiornamenti_modifica_storia;
          if (profile.notifiche_aggiornamenti_modifica_capitolo !== undefined && profile.notifiche_aggiornamenti_modifica_capitolo !== null) this.settings.notifiche.aggiornamenti_modifica_capitolo = profile.notifiche_aggiornamenti_modifica_capitolo;
          if (profile.notifiche_newsletter !== undefined && profile.notifiche_newsletter !== null) this.settings.notifiche.newsletter = profile.notifiche_newsletter;
          if (profile.notifiche_community_like !== undefined && profile.notifiche_community_like !== null) this.settings.notifiche.community_like = profile.notifiche_community_like;
          if (profile.notifiche_community_commento !== undefined && profile.notifiche_community_commento !== null) this.settings.notifiche.community_commento = profile.notifiche_community_commento;
          if (profile.privacy_profilo_pubblico !== undefined && profile.privacy_profilo_pubblico !== null) this.settings.privacy.profiloPubblico = profile.privacy_profilo_pubblico;
          if (profile.privacy_mostra_libreria !== undefined && profile.privacy_mostra_libreria !== null) this.settings.privacy.mostraLibreria = profile.privacy_mostra_libreria;
          if (profile.privacy_indicizza !== undefined && profile.privacy_indicizza !== null) this.settings.privacy.indicizza = profile.privacy_indicizza;
          if (profile.visualizza_18plus !== undefined && profile.visualizza_18plus !== null) this.settings.visualizza_18plus = profile.visualizza_18plus;
          if (profile.visualizza_18plus_community !== undefined && profile.visualizza_18plus_community !== null) this.settings.visualizza_18plus_community = profile.visualizza_18plus_community;

          if (profile.reading_font) this.settings.reading_font = profile.reading_font;
          if (profile.reading_font_size) this.settings.reading_font_size = profile.reading_font_size;
          if (profile.reading_mode) this.settings.reading_mode = profile.reading_mode;
          if (profile.reading_width) this.settings.reading_width = profile.reading_width;
          if (profile.sensitive_filter !== undefined && profile.sensitive_filter !== null) this.settings.sensitive_filter = profile.sensitive_filter;

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

  toggleNotifications(author: any): void {
    const u = this.currentUser();
    if (!u) return;

    const nextState = author.enable_notifications === false;
    this.api.toggleFollowNotifications(u.id, author.id, nextState).subscribe({
      next: () => {
        author.enable_notifications = nextState;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore modifica notifiche autore', err)
    });
  }

  async logout(): Promise<void> {
    const confirmed = await this.dialogService.confirm('Esci', 'Sei sicuro di voler uscire?');
    if (confirmed) {
      this.authService.logout();
      this.router.navigate(['/']);
    }
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
        social_linkedin: this.settings.social_linkedin || null,
        theme: this.settings.tema,
        notifiche_risposte_commenti: this.settings.notifiche.risposte_commenti,
        notifiche_like_commenti: this.settings.notifiche.like_commenti,
        notifiche_nuovo_follower: this.settings.notifiche.nuovo_follower,
        notifiche_storie_like: this.settings.notifiche.storie_like,
        notifiche_storie_preferiti: this.settings.notifiche.storie_preferiti,
        notifiche_aggiornamenti_nuova_storia: this.settings.notifiche.aggiornamenti_nuova_storia,
        notifiche_aggiornamenti_nuovo_capitolo: this.settings.notifiche.aggiornamenti_nuovo_capitolo,
        notifiche_aggiornamenti_modifica_storia: this.settings.notifiche.aggiornamenti_modifica_storia,
        notifiche_aggiornamenti_modifica_capitolo: this.settings.notifiche.aggiornamenti_modifica_capitolo,
        notifiche_newsletter: this.settings.notifiche.newsletter,
        notifiche_community_like: this.settings.notifiche.community_like,
        notifiche_community_commento: this.settings.notifiche.community_commento,
        privacy_profilo_pubblico: this.settings.privacy.profiloPubblico,
        privacy_mostra_libreria: this.settings.privacy.mostraLibreria,
        privacy_indicizza: this.settings.privacy.indicizza,
        visualizza_18plus: this.settings.visualizza_18plus,
        visualizza_18plus_community: this.settings.visualizza_18plus_community,
        reading_font: this.settings.reading_font,
        reading_font_size: this.settings.reading_font_size,
        reading_mode: this.settings.reading_mode,
        reading_width: this.settings.reading_width,
        sensitive_filter: this.settings.sensitive_filter
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

    this.showToast = true;
    this.cdr.detectChanges();
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  restoreDefaults(): void {
    this.settings.tema = 'tropical';
    this.settings.reading_font = 'sans-serif';
    this.settings.reading_font_size = 'medium';
    this.settings.reading_mode = 'scroll';
    this.settings.reading_width = 'medium';
    this.settings.sensitive_filter = false;
    this.settings.notifiche.risposte_commenti = true;
    this.settings.notifiche.like_commenti = true;
    this.settings.notifiche.nuovo_follower = true;
    this.settings.notifiche.storie_like = true;
    this.settings.notifiche.storie_preferiti = true;
    this.settings.notifiche.aggiornamenti_nuova_storia = true;
    this.settings.notifiche.aggiornamenti_nuovo_capitolo = true;
    this.settings.notifiche.aggiornamenti_modifica_storia = true;
    this.settings.notifiche.aggiornamenti_modifica_capitolo = true;
    this.settings.notifiche.newsletter = true;
    this.settings.privacy.profiloPubblico = true;
    this.settings.privacy.mostraLibreria = false;
    this.settings.privacy.indicizza = true;
    this.settings.visualizza_18plus = false;
    this.settings.visualizza_18plus_community = false;
    this.settings.notifiche.community_like = true;
    this.settings.notifiche.community_commento = true;

    this.saveSettings();
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
      this.saveSettings();
    };
    reader.readAsDataURL(file);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && typeof target.closest === 'function') {
      if (!target.closest('.story-search-container')) {
        this.showStoryDropdown = false;
      }
      if (!target.closest('.glass-select-wrapper')) {
        this.dropdownsOpen.tema = false;
        this.dropdownsOpen.reading_font = false;
        this.dropdownsOpen.reading_font_size = false;
        this.dropdownsOpen.reading_width = false;
      }
    }
  }


  addRecommendedStory(story: any) {
    if (this.recommendedStoryIds.length >= 10) return; // Max 10
    if (!this.recommendedStoryIds.includes(story.id)) {
      this.recommendedStoryIds.push(story.id);
      this.searchStoryText = '';
      this.showStoryDropdown = false;
      this.saveSettings();
    }
  }

  removeRecommendedStory(storyId: string) {
    this.recommendedStoryIds = this.recommendedStoryIds.filter(id => id !== storyId);
    this.saveSettings();
  }

  public mapDbBook(s: any): any {
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

  loadCollections() {
    const u = this.currentUser();
    if (!u) return;
    this.api.getCollections(u.id).subscribe({
      next: (cols) => {
        this.collections = cols;
        if (this.selectedCollection) {
          const updated = cols.find(c => c.id === this.selectedCollection.id);
          this.selectedCollection = updated || null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore caricamento collezioni:', err)
    });
  }

  getMergedBooks(): any[] {
    return [...this.likedBooks, ...this.favoriteBooks].reduce((acc, book) => {
      const existing = acc.find(b => b.id === book.id);
      const inLikes = this.likedBooks.some(b => b.id === book.id);
      const inFavs = this.favoriteBooks.some(b => b.id === book.id);
      if (existing) {
        existing.isLiked = inLikes;
        existing.isFavorite = inFavs;
      } else {
        acc.push({
          ...book,
          isLiked: inLikes,
          isFavorite: inFavs
        });
      }
      return acc;
    }, [] as any[]);
  }

  getFilteredPickerBooks(): any[] {
    const merged = this.getMergedBooks();
    return merged.filter(book => {
      const matchesType = (this.filterLikes && book.isLiked) || (this.filterFavorites && book.isFavorite);
      if (!matchesType) return false;

      if (this.pickerSearchText.trim()) {
        const query = this.pickerSearchText.toLowerCase().trim();
        const matchesTitle = book.title?.toLowerCase().includes(query);
        const matchesAuthor = book.author?.toLowerCase().includes(query);
        return matchesTitle || matchesAuthor;
      }

      return true;
    });
  }

  toggleFilterLikes() {
    this.filterLikes = !this.filterLikes;
  }

  toggleFilterFavorites() {
    this.filterFavorites = !this.filterFavorites;
  }

  openCreateCollection() {
    this.collectionForm = {
      id: '',
      name: '',
      description: '',
      storyIds: []
    };
    this.filterLikes = true;
    this.filterFavorites = true;
    this.pickerSearchText = '';
    this.isEditingCollection = true;
    this.cdr.detectChanges();
  }

  openEditCollection(col: any) {
    this.collectionForm = {
      id: col.id,
      name: col.name,
      description: col.description || '',
      storyIds: col.stories ? col.stories.map((s: any) => s.id) : []
    };
    this.filterLikes = true;
    this.filterFavorites = true;
    this.pickerSearchText = '';
    this.isEditingCollection = true;
    this.cdr.detectChanges();
  }

  toggleStoryInCollectionForm(storyId: string) {
    const index = this.collectionForm.storyIds.indexOf(storyId);
    if (index === -1) {
      this.collectionForm.storyIds.push(storyId);
    } else {
      this.collectionForm.storyIds.splice(index, 1);
    }
    if (this.collectionForm.id) {
      this.autoSaveCollection();
    }
  }

  autoSaveCollection() {
    const u = this.currentUser();
    if (!u || !this.collectionForm.id || !this.collectionForm.name.trim()) return;

    const payload = {
      name: this.collectionForm.name.trim(),
      description: this.collectionForm.description.trim(),
      storyIds: this.collectionForm.storyIds
    };

    this.api.updateCollection(this.collectionForm.id, payload).subscribe({
      next: () => {
        this.loadCollections();
        this.showToast = true;
        this.cdr.detectChanges();
        if (this.toastTimeout) {
          clearTimeout(this.toastTimeout);
        }
        this.toastTimeout = setTimeout(() => {
          this.showToast = false;
          this.cdr.detectChanges();
        }, 3000);
      },
      error: (err) => console.error('Errore auto-salvataggio collezione:', err)
    });
  }

  isStorySelectedInCollectionForm(storyId: string): boolean {
    return this.collectionForm.storyIds.includes(storyId);
  }

  saveCollection() {
    const u = this.currentUser();
    if (!u || !this.collectionForm.name.trim()) return;

    const payload = {
      name: this.collectionForm.name.trim(),
      description: this.collectionForm.description.trim(),
      storyIds: this.collectionForm.storyIds
    };

    if (this.collectionForm.id) {
      this.api.updateCollection(this.collectionForm.id, payload).subscribe({
        next: () => {
          this.isEditingCollection = false;
          this.loadCollections();
        },
        error: (err) => console.error('Errore aggiornamento collezione:', err)
      });
    } else {
      this.api.createCollection(u.id, payload).subscribe({
        next: () => {
          this.isEditingCollection = false;
          this.loadCollections();
        },
        error: (err) => console.error('Errore creazione collezione:', err)
      });
    }
  }

  async deleteCollection(collectionId: string) {
    const confirmed = await this.dialogService.confirm(
      'Elimina Collezione',
      'Sei sicuro di voler eliminare questa collezione? Questa azione non può essere annullata.'
    );
    if (confirmed) {
      this.api.deleteCollection(collectionId).subscribe({
        next: () => {
          this.selectedCollection = null;
          this.loadCollections();
        },
        error: (err) => console.error('Errore eliminazione collezione:', err)
      });
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