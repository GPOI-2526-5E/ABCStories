import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { InteractionsService } from '../../services/interactions.service';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, Footer],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(Api);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  public interactions = inject(InteractionsService);

  searchQuery = '';
  loading = false;
  stories: any[] = [];
  authors: any[] = [];
  genres: string[] = [];

  selectedTab: 'Tutti' | 'Storie' | 'Autori' | 'Generi' = 'Tutti';
  followedStatusMap: { [key: string]: boolean } = {};

  ngOnInit(): void {
    // Carica le interazioni dell'utente (like/bookmark)
    this.interactions.loadUserInteractions().subscribe();

    // Sottoscrizione ai queryParams di routing
    this.route.queryParams.subscribe(params => {
      const q = params['q'] || '';
      this.searchQuery = q.trim();
      if (this.searchQuery) {
        this.performSearch(this.searchQuery);
      } else {
        this.stories = [];
        this.authors = [];
        this.genres = [];
        this.loading = false;
      }
    });
  }

  performSearch(query: string): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.api.search(query).subscribe({
      next: (res) => {
        this.stories = res.stories || [];
        this.authors = res.authors || [];
        this.genres = res.genres || [];
        this.loading = false;

        // Se l'utente è loggato, controlla quali autori segue
        const currentUser = this.auth.currentUser();
        if (currentUser && this.authors.length > 0) {
          this.api.getFollowedAuthors(currentUser.id).subscribe({
            next: (followedList) => {
              const followedIds = new Set(followedList.map(a => a.id));
              this.authors.forEach(author => {
                this.followedStatusMap[author.id] = followedIds.has(author.id);
              });
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Errore nel recupero degli autori seguiti:', err);
              this.cdr.detectChanges();
            }
          });
        } else {
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Errore durante la ricerca:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'Tutti' | 'Storie' | 'Autori' | 'Generi'): void {
    this.selectedTab = tab;
  }

  isCurrentUser(authorId: string): boolean {
    const user = this.auth.currentUser();
    return user ? user.id === authorId : false;
  }

  toggleFollow(author: any): void {
    const currentUser = this.auth.currentUser();
    if (!currentUser || this.isCurrentUser(author.id)) return;

    const currentlyFollowing = this.followedStatusMap[author.id] || false;

    if (currentlyFollowing) {
      this.api.unfollowUser(currentUser.id, author.id).subscribe({
        next: () => {
          this.followedStatusMap[author.id] = false;
          const currentCount = Number(author.followers_count) || 0;
          author.followers_count = Math.max(0, currentCount - 1);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore durante l\'unfollow:', err)
      });
    } else {
      this.api.followUser(currentUser.id, author.id).subscribe({
        next: () => {
          this.followedStatusMap[author.id] = true;
          const currentCount = Number(author.followers_count) || 0;
          author.followers_count = currentCount + 1;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore durante il follow:', err)
      });
    }
  }

  getInitials(name: string): string {
    return name ? name.slice(0, 2).toUpperCase() : 'US';
  }

  getGenreIcon(genre: string): string {
    const iconMap: { [key: string]: string } = {
      horror: 'horror.png',
      western: 'western.png',
      fantasy: 'fantasy.png',
      thriller: 'thriller.png',
      romanzo: 'romanzo.png',
      storico: 'storico.png',
      fantascienza: 'fantascienza.png',
      avventura: 'avventura.png',
      biografia: 'biografia.png'
    };
    const file = iconMap[genre.toLowerCase()] || 'romanzo.png';
    return `assets/Icone/${file}`;
  }

  getRatingStars(rating: any): number[] {
    const rate = parseFloat(rating) || 0;
    const rounded = Math.round(rate);
    return Array(5).fill(0).map((_, i) => i < rounded ? 1 : 0);
  }

  toggleLike(story: any): void {
    this.interactions.toggleLike(story.id);
  }

  toggleBookmark(story: any): void {
    this.interactions.toggleBookmark(story.id);
  }
}
