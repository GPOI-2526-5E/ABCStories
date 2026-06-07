import {
  AfterViewInit, Component, HostListener,
  Inject, PLATFORM_ID, inject, computed
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser, NgForOf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { OnInit } from '@angular/core';

import { ImageCarouselSkeletonComponent } from '../image-carousel-skeleton/image-carousel-skeleton.component';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, ImageCarouselSkeletonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit, OnInit {
  users: any[] = [];

  genresList = [
    { name: 'horror', label: 'Horror', icon: 'horror.png' },
    { name: 'western', label: 'Western', icon: 'western.png' },
    { name: 'fantasy', label: 'Fantasy', icon: 'fantasy.png' },
    { name: 'thriller', label: 'Thriller', icon: 'thriller.png' },
    { name: 'romanzo', label: 'Romanzo', icon: 'romanzo.png' },
    { name: 'storico', label: 'Storico', icon: 'storico.png' },
    { name: 'fantascienza', label: 'Fantascienza', icon: 'fantascienza.png' },
    { name: 'avventura', label: 'Avventura', icon: 'avventura.png' },
    { name: 'biografia', label: 'Biografia', icon: 'biografia.png' }
  ];
  genres = this.genresList.map(g => g.name);
  genreBooks: { [genre: string]: any[] } = {};

  // ── Auth ─────────────────────────────────────────────────────────
  authService = inject(AuthService);
  private router = inject(Router);

  userInitials = computed(() => {
    const name = this.authService.currentUser()?.username ?? '';
    return name.slice(0, 2).toUpperCase();
  });

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  onUserClick(): void {
    this.router.navigate(['/user']);
  }

  onSearch(query: string): void {
    const q = query.trim();
    if (q) {
      this.showSuggestions = false;
      this.mobileNavOpen = false;
      this.router.navigate(['/search'], { queryParams: { q } });
    }
  }

  // ── Search Suggestions ───────────────────────────────────────────
  suggestedStories: any[] = [];
  suggestedAuthors: any[] = [];
  suggestedGenres: string[] = [];
  showSuggestions = false;
  currentSuggestionsQuery = '';

  onSearchInput(query: string): void {
    const q = query.trim();
    this.currentSuggestionsQuery = q;
    if (q.length < 1) {
      this.suggestedStories = [];
      this.suggestedAuthors = [];
      this.suggestedGenres = [];
      this.showSuggestions = false;
      return;
    }

    this.api.search(q).subscribe({
      next: (res) => {
        if (this.currentSuggestionsQuery !== q) {
          return;
        }
        this.suggestedStories = (res.stories || [])
          .filter(story => story && story.title && story.title.trim() !== '')
          .slice(0, 3);
        this.suggestedAuthors = (res.authors || [])
          .filter(author => author && author.username && author.username.trim() !== '')
          .slice(0, 3);
        this.suggestedGenres = (res.genres || [])
          .filter(genre => genre && genre.trim() !== '')
          .slice(0, 2);
        this.showSuggestions = this.suggestedStories.length > 0 || this.suggestedAuthors.length > 0 || this.suggestedGenres.length > 0;
      },
      error: (err) => {
        if (this.currentSuggestionsQuery === q) {
          console.error('Errore durante la ricerca dei suggerimenti:', err);
        }
      }
    });
  }

  onSearchFocus(query: string): void {
    const q = query.trim();
    if (q.length >= 1) {
      this.showSuggestions = this.suggestedStories.length > 0 || this.suggestedAuthors.length > 0 || this.suggestedGenres.length > 0;
    }
  }

  onSearchBlur(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  selectStory(storyId: string): void {
    this.showSuggestions = false;
    this.mobileNavOpen = false;
    this.router.navigate(['/book', storyId]);
  }

  selectAuthor(authorId: string): void {
    this.showSuggestions = false;
    this.mobileNavOpen = false;
    this.router.navigate(['/author', authorId]);
  }

  selectGenre(genre: string): void {
    this.showSuggestions = false;
    this.mobileNavOpen = false;
    this.router.navigate(['/generi', genre]);
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

  // ── Mobile nav state ─────────────────────────────────────────────

  private activeMobileGenre: string | null = null;
  mobileNavOpen = false;
  mobileGenresOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: Api) { }

  ngOnInit(): void {
    this.api.getUsers().subscribe((data: any) => {
      this.users = data;
    });

    this.genres.forEach(genre => {
      this.api.getStoriesByGenre(genre).subscribe({
        next: (stories) => {
          this.genreBooks[genre] = (stories || [])
            .map(story => ({
              id: story.id,
              title: story.title,
              img: story.image_url || 'assets/Presentazione/promessi-sposi.jpg',
              author: story.author_name
            }))
            .slice(0, 7);
          
          setTimeout(() => {
            this.initSliders();
          }, 200);
        },
        error: (err) => {
          console.error(`Error loading stories for genre ${genre}:`, err);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.initSliders();
  }

  initSliders(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sliders = document.querySelectorAll<HTMLElement>('.image-slider');

    sliders.forEach((slider) => {
      const container = slider.querySelector<HTMLElement>('.scroll-images');
      const left = slider.querySelector<HTMLButtonElement>('.img-arrow.left');
      const right = slider.querySelector<HTMLButtonElement>('.img-arrow.right');
      if (!container || !left || !right) return;

      const getItems = () => container.querySelectorAll<HTMLElement>('.container');

      const updateArrows = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        left.style.opacity = container.scrollLeft <= 0 ? '0' : '1';
        left.style.pointerEvents = container.scrollLeft <= 0 ? 'none' : 'auto';
        right.style.opacity = container.scrollLeft >= maxScroll - 1 ? '0' : '1';
        right.style.pointerEvents = container.scrollLeft >= maxScroll - 1 ? 'none' : 'auto';
      };

      const updateDepth = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        getItems().forEach(item => {
          const itemCenter = item.offsetLeft + item.clientWidth / 2;
          Math.abs(center - itemCenter) > 200
            ? item.classList.add('dim')
            : item.classList.remove('dim');
        });
      };

      const updateOverlays = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollLeft <= 2
          ? slider.classList.add('no-left')
          : slider.classList.remove('no-left');
        container.scrollLeft >= maxScroll - 2
          ? slider.classList.add('no-right')
          : slider.classList.remove('no-right');
      };

      const snapScroll = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        const items = getItems();
        if (items.length === 0) return;
        let closest = items[0];
        let minDist = Infinity;
        items.forEach(item => {
          const dist = Math.abs((item.offsetLeft + item.clientWidth / 2) - center);
          if (dist < minDist) { minDist = dist; closest = item; }
        });
        container.scrollTo({
          left: closest.offsetLeft - (container.clientWidth - closest.clientWidth) / 2,
          behavior: 'smooth'
        });
      };

      if (slider.getAttribute('data-initialized') === 'true') {
        updateArrows();
        updateDepth();
        updateOverlays();
        return;
      }
      slider.setAttribute('data-initialized', 'true');

      right.addEventListener('click', () => {
        container.scrollBy({ left: 220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });
      left.addEventListener('click', () => {
        container.scrollBy({ left: -220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });

      container.addEventListener('scroll', () => { updateArrows(); updateDepth(); updateOverlays(); });

      let isDown = false, startX = 0, scrollLeft = 0;

      container.addEventListener('mousedown', e => {
        isDown = true; container.classList.add('active');
        startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft;
      });
      container.addEventListener('mouseleave', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });
      container.addEventListener('mouseup', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });
      container.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        container.scrollLeft = scrollLeft - (e.pageX - container.offsetLeft - startX) * 2;
        updateArrows(); updateDepth(); updateOverlays();
      });

      container.addEventListener('touchstart', (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      container.addEventListener('touchend', () => { if (isDown) { isDown = false; snapScroll(); } });
      container.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDown) return;
        container.scrollLeft = scrollLeft - (e.touches[0].pageX - container.offsetLeft - startX) * 2;
        updateArrows(); updateDepth(); updateOverlays();
      });

      updateArrows(); updateDepth(); updateOverlays();
    });
  }

  // ── Mobile helpers (invariati) ────────────────────────────────────
  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    if (!this.mobileNavOpen) {
      this.mobileGenresOpen = false;
      this.activeMobileGenre = null;
    }
  }

  toggleMobileGenresPanel(): void {
    this.mobileGenresOpen = !this.mobileGenresOpen;
    if (!this.mobileGenresOpen) this.activeMobileGenre = null;
  }

  toggleMobileGenre(name: string): void {
    this.router.navigate(['/generi', name]);
  }

  isMobileOpen(name: string): boolean {
    return this.activeMobileGenre === name;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Close suggestions if click is outside the search input container
    const clickedElement = event.target as HTMLElement;
    const isInsideSearch = clickedElement.closest('.container-input') || clickedElement.closest('.mn-search');
    if (!isInsideSearch) {
      this.showSuggestions = false;
    }

    if (window.innerWidth >= 992) return;
    const root = document.querySelector('.mn-root');
    if (root && !root.contains(event.target as Node)) {
      this.mobileNavOpen = false;
      this.mobileGenresOpen = false;
      this.activeMobileGenre = null;
    }
  }
}
