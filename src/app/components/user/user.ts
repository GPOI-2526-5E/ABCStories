import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { InteractionsService } from '../../services/interactions.service';
import { ThemeService, Theme } from '../../services/theme.service';

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
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User implements OnInit {

  private authService = inject(AuthService);
  private api = inject(Api);
  private interactions = inject(InteractionsService);
  public themeService = inject(ThemeService);

  /** Utente loggato (segnale) */
  currentUser = this.authService.currentUser;

  /** Prime 2 lettere del nome utente come iniziali dell'avatar */
  userInitials = computed(() => {
    const name = this.currentUser()?.username ?? '';
    return name.slice(0, 2).toUpperCase();
  });

  activeSection = signal<Section>('profilo');

  navItems: { id: Section; label: string; icon: string }[] = [
    { id: 'profilo', label: 'Profilo', icon: '👤' },
    { id: 'mipiace', label: 'Mi piace', icon: '❤️' },
    { id: 'preferiti', label: 'Preferiti', icon: '🔖' },
    { id: 'autori', label: 'Autori seguiti', icon: '✍️' },
    { id: 'impostazioni', label: 'Impostazioni', icon: '⚙️' },
  ];

  likedBooks: UserBook[] = [];

  favoriteBooks: UserBook[] = [];

  followedAuthors: Author[] = [
    { id: 1, initials: 'EV', name: 'Elena Verdi', handle: '@elenaverdi', description: 'Narratrice fantasy con un tocco di magia celtica. Pubblica ogni domenica.', stories: 18, avatarGradient: 'linear-gradient(135deg,#5bbf8a,#2a8a5a)', following: true },
    { id: 2, initials: 'DW', name: 'DarkWriter88', handle: '@darkwriter88', description: 'Master del thriller psicologico. Le sue storie ti terranno sveglio la notte.', stories: 31, avatarGradient: 'linear-gradient(135deg,#f0a860,#c05820)', following: true },
    { id: 3, initials: 'LS', name: 'Luna Scrittrice', handle: '@lunascrittrice', description: 'Poesia in prosa, romanzi brevi, emozioni allo stato puro.', stories: 9, avatarGradient: 'linear-gradient(135deg,#a060d0,#6030a0)', following: true },
    { id: 4, initials: 'HI', name: 'Historicus', handle: '@historicus', description: 'Romanziere storico appassionato di Roma antica e Medioevo italiano.', stories: 24, avatarGradient: 'linear-gradient(135deg,#f0d870,#c09820)', following: true },
    { id: 5, initials: 'OW', name: 'Ocean Writer', handle: '@oceanwriter', description: 'Avventure in mare aperto, misteri subacquei e vento in poppa.', stories: 12, avatarGradient: 'linear-gradient(135deg,#a0d8f8,#2080c0)', following: false },
  ];

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
    }
  }

  setSection(id: Section): void {
    this.activeSection.set(id);
  }

  toggleFollow(author: Author): void {
    author.following = !author.following;
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