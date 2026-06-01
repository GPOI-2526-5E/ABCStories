import { Component, OnInit, HostListener, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';
import { Book } from '../../services/book';
import { Navbar } from '../navbar/navbar';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';
import { InteractionsService } from '../../services/interactions.service';
import { Api } from '../../services/api';

import { Genere, TUTTI_GENERI } from '../generi/generi';

interface GenereInfo {
  nome: string;
  descrizione: string;
}

export type SortOption = 'default' | 'az' | 'za' | 'author_az' | 'author_za';

export const SORT_LABELS: Record<SortOption, string> = {
  default: 'Predefinito',
  az: 'Titolo A → Z',
  za: 'Titolo Z → A',
  author_az: 'Autore A → Z',
  author_za: 'Autore Z → A',
};

@Component({
  selector: 'app-generi-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './generi-detail.html',
  styleUrls: ['./generi-detail.scss'],
})

export class GeneriDetail implements OnInit {

  slug = '';
  searchQuery = '';
  sortBy: SortOption = 'default';
  dropdownOpen = false;

  readonly sortOptions = Object.entries(SORT_LABELS) as [SortOption, string][];

  private allBooks: Book[] = [];

  private generiMap: Record<string, GenereInfo> = {};

  get genereInfo(): GenereInfo | null {
    return this.generiMap[this.slug] ?? null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private el: ElementRef,
    private interactions: InteractionsService,
    private api: Api,
    private cdr: ChangeDetectorRef
  ) { 
    // Popola la mappa dei generi dinamicamente
    TUTTI_GENERI.forEach(g => {
      this.generiMap[g.slug] = { nome: g.nome, descrizione: g.descrizione };
    });
  }

  get currentSortLabel(): string {
    return SORT_LABELS[this.sortBy];
  }

  get filteredBooks(): Book[] {
    let books = [...this.allBooks];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q)
      );
    }

    switch (this.sortBy) {
      case 'az': books.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'za': books.sort((a, b) => b.title.localeCompare(a.title)); break;
      case 'author_az': books.sort((a, b) => a.author.localeCompare(b.author)); break;
      case 'author_za': books.sort((a, b) => b.author.localeCompare(a.author)); break;
    }

    return books;
  }

  selectSort(opt: SortOption): void {
    this.sortBy = opt;
    this.dropdownOpen = false;
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Chiude il dropdown cliccando fuori
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  toggleBookmark(book: Book, event: Event): void {
    event.stopPropagation();
    book.bookmarked = !book.bookmarked;
    if (book.id) {
      this.interactions.toggleBookmark(String(book.id));
    }
  }

  toggleLike(book: Book, event: Event): void {
    event.stopPropagation();
    book.liked = !book.liked;
    if (book.id) {
      this.interactions.toggleLike(String(book.id));
    }
  }

  onBookClick(book: Book): void {
    console.log('Book clicked:', book);
    this.router.navigate(
      ['/book', book.id],
      {
        state: { book }
      }
    );
  }

  ngOnInit(): void {
    this.interactions.loadUserInteractions();

    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') ?? '';
      
      this.api.getStoriesByGenre(this.slug).subscribe({
        next: (stories) => {
          this.allBooks = stories.map(s => this.mapDbBook(s));
          this.syncBookStates();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Errore fetch generi:", err);
          // Fallback a libri statici
          this.allBooks = this.bookService.getBySlug(this.slug);
          this.syncBookStates();
          this.cdr.detectChanges();
        }
      });
    });
  }

  private mapDbBook(s: any): any {
    return {
      id: s.id,
      title: s.title ?? '',
      author: s.author_name ?? s.author_id ?? 'Autore sconosciuto',
      desc: s.description ?? s.desc ?? '',
      img: s.image_url ?? s.img ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80',
      genre: s.genre ?? '',
      tag: s.tag ?? s.genre ?? '',
      pages: s.pages ?? 0,
      year: s.release_year ?? s.year ?? 0,
      rating: s.rating ? parseFloat(s.rating) : 0,
      readers: s.readers_count ? String(s.readers_count) : (s.readers ?? '0'),
      chaptersCount: s.chapters_count ?? s.chaptersCount ?? 0,
      liked: false,
      bookmarked: false,
    };
  }

  private syncBookStates(): void {
    for (const book of this.allBooks) {
      if (book.id) {
        book.liked = this.interactions.isLiked(String(book.id));
        book.bookmarked = this.interactions.isBookmarked(String(book.id));
      }
    }
  }
}
