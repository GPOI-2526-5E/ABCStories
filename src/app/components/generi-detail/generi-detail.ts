import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book';
import { Book } from '../../services/book';
import { Navbar } from '../navbar/navbar';
import { Router } from '@angular/router';
import { Footer } from '../footer/footer';

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

  private generiMap: Record<string, GenereInfo> = {
    horror: { nome: 'Horror', descrizione: 'Paura, tensione e creature che abitano il buio. Lasciati travolgere dall\'oscurità.' },
    fantasy: { nome: 'Fantasy', descrizione: 'Mondi magici, draghi e mappe che non finiscono mai. Ogni pagina è un portale.' },
    thriller: { nome: 'Thriller', descrizione: 'Suspense al limite, ogni pagina è un colpo di scena. Il cuore accelera.' },
    romanzo: { nome: 'Romanzo', descrizione: 'Storie d\'amore, passioni e cuori spezzati. Emozioni che restano.' },
    fantascienza: { nome: 'Fantascienza', descrizione: 'Galassie lontane, androidi e futuro distopico. Il domani inizia qui.' },
    storico: { nome: 'Storico', descrizione: 'Dal passato antico alle grandi guerre moderne. La storia si fa racconto.' },
    western: { nome: 'Western', descrizione: 'Deserti, pistoleri e giustizia fai-da-te. Il west non dimentica.' },
    avventura: { nome: 'Avventura', descrizione: 'Esploratori coraggiosi e missioni impossibili. L\'ignoto aspetta.' },
    biografia: { nome: 'Biografia', descrizione: 'Vite straordinarie raccontate dall\'interno. Reale più del reale.' },
  };

  get genereInfo(): GenereInfo | null {
    return this.generiMap[this.slug] ?? null;
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
  }

  toggleLike(book: Book, event: Event): void {
    event.stopPropagation();
    book.liked = !book.liked;
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.slug = params.get('slug') ?? '';
      this.allBooks = this.bookService.getBySlug(this.slug);
    });
  }
}
