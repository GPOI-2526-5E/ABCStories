import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth.service';

export type Section = 'profilo' | 'mipiace' | 'preferiti' | 'autori' | 'impostazioni';

export interface Book {
  id: number;
  title: string;
  author: string;
  coverGradient: string;
  coverEmoji: string;
  likes?: string;
  progress?: number;
  completed?: boolean;
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

  likedBooks: Book[] = [
    { id: 1, title: 'La Foresta Silenziosa', author: '@elenaverdi', coverGradient: 'linear-gradient(135deg,#b8e8c8,#5bbf8a)', coverEmoji: '🌲', likes: '4.8k' },
    { id: 2, title: 'Il Cristallo del Tempo', author: '@fantasista99', coverGradient: 'linear-gradient(135deg,#f0d870,#e8a030)', coverEmoji: '🔮', likes: '2.1k' },
    { id: 3, title: 'Buio Pesto', author: '@darkwriter88', coverGradient: 'linear-gradient(135deg,#f0a860,#f08878)', coverEmoji: '🔪', likes: '9.3k' },
    { id: 4, title: 'Sogni di Carta', author: '@lunascrittrice', coverGradient: 'linear-gradient(135deg,#d4a0f0,#a060d0)', coverEmoji: '🌙', likes: '6.7k' },
    { id: 5, title: 'Marea Infinita', author: '@oceanwriter', coverGradient: 'linear-gradient(135deg,#a0d8f8,#3098d8)', coverEmoji: '🌊', likes: '3.5k' },
    { id: 6, title: "L'Eco di Roma", author: '@historicus', coverGradient: 'linear-gradient(135deg,#f8c0a0,#e87840)', coverEmoji: '🏛️', likes: '11k' },
  ];

  favoriteBooks: Book[] = [
    { id: 1, title: 'Radici Profonde', author: '@naturawriter', coverGradient: 'linear-gradient(135deg,#c8e8b0,#78c840)', coverEmoji: '🌿', progress: 72 },
    { id: 2, title: 'Sole di Mezzanotte', author: '@auroraink', coverGradient: 'linear-gradient(135deg,#f8d8a0,#f0a020)', coverEmoji: '☀️', progress: 35 },
    { id: 3, title: 'Petali di Sangue', author: '@rosaviolet', coverGradient: 'linear-gradient(135deg,#e8b0d0,#c050a0)', coverEmoji: '🌸', progress: 100, completed: true },
    { id: 4, title: 'Fulmine Nero', author: '@stormteller', coverGradient: 'linear-gradient(135deg,#a0b8e8,#4060c8)', coverEmoji: '⚡', progress: 8 },
  ];

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
    notifiche: { commenti: true, seguaci: true, aggiornamenti: false, newsletter: true },
    privacy: { profiloPubblico: true, mostraLibreria: false, indicizza: true },
  };

  savedFeedback = false;

  ngOnInit(): void {
    const u = this.currentUser();
    if (u) {
      this.settings.nome  = u.username;
      this.settings.email = u.email;
    }
  }

  setSection(id: Section): void {
    this.activeSection.set(id);
  }

  toggleFollow(author: Author): void {
    author.following = !author.following;
  }

  saveSettings(): void {
    this.savedFeedback = true;
    setTimeout(() => (this.savedFeedback = false), 2000);
  }
}