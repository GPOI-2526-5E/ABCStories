import { Component, Input, HostListener, ViewChild, ElementRef, OnInit, AfterViewInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Book } from '../../services/book';
import { InteractionsService } from '../../services/interactions.service';

@Component({
  selector: 'app-book-slider',
  imports: [CommonModule],
  templateUrl: './book-slider.html',
  styleUrl: './book-slider.scss',
})
export class BookSlider implements OnInit, AfterViewInit, OnChanges {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() books: any[] = [];

  displayedBooks: any[] = [];
  readonly defaultPageSize = 6;

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  readonly interactions = inject(InteractionsService);

  canScrollLeft = false;
  canScrollRight = true;
  readonly scrollStep = 600;

  get cardWidth(): number {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return 144.2;
    }
    return 204.2;
  }
  currentIndex = 0;

  // Throttle scroll tramite rAF: evita decine di chiamate/secondo durante lo swipe
  private rafPending = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Avvia il caricamento delle interazioni (se non già fatto).
    // Ora è idempotente e non usa setTimeout.
    this.interactions.loadUserInteractions().subscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => this.updateArrows(), 100);
  }

  getInitialPageSize(): number {
    if (typeof window === 'undefined') return this.defaultPageSize;
    const visibleCount = Math.floor(window.innerWidth / this.cardWidth);
    // Vogliamo mostrare tutti i libri visibili più almeno 3 extra, in modo che 
    // ci sia sempre un libro parzialmente tagliato sulla destra che invita a scorrere.
    return Math.max(this.defaultPageSize, visibleCount + 3);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['books']) {
      const initSize = this.getInitialPageSize();
      this.displayedBooks = (this.books || []).slice(0, initSize);
      console.log(`[SLIDER - ${this.title}] Inizializzato con ${this.books?.length} libri totali. Primi ${this.displayedBooks.length} caricati nel DOM.`);
      setTimeout(() => {
        this.updateArrows();
      }, 100);
    }
  }

  loadMore() {
    const nextIndex = this.displayedBooks.length;
    const chunkSize = this.getInitialPageSize();
    const nextChunk = this.books.slice(nextIndex, nextIndex + chunkSize);
    this.displayedBooks = [...this.displayedBooks, ...nextChunk];
    console.log(`[SLIDER - ${this.title}] Carico altro... Aggiunti ${nextChunk.length} libri al DOM. Totale caricati: ${this.displayedBooks.length}/${this.books.length}`);
    setTimeout(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
      }
    }, 50);
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

  get visible(): number {
    if (typeof window === 'undefined') return 4;
    return Math.floor(window.innerWidth / this.cardWidth);
  }

  get maxIndex(): number {
    return Math.max(0, this.books.length - this.visible);
  }

  @HostListener('window:resize')
  onResize() {
    this.clamp();
    const targetSize = this.getInitialPageSize();
    if (this.displayedBooks.length < targetSize && this.displayedBooks.length < this.books.length) {
      const nextChunk = this.books.slice(this.displayedBooks.length, targetSize);
      this.displayedBooks = [...this.displayedBooks, ...nextChunk];
      console.log(`[SLIDER - ${this.title}] Ridimensionamento: caricati altri libri per riempire lo schermo. Totale caricati: ${this.displayedBooks.length}/${this.books.length}`);
    }
  }

  updateArrows() {
    if (!this.scrollContainer) return;
    // Throttle con rAF: una sola esecuzione per frame, anche durante scroll rapido
    if (this.rafPending) return;
    this.rafPending = true;
    requestAnimationFrame(() => {
      const el = this.scrollContainer?.nativeElement;
      if (el) {
        this.canScrollLeft = el.scrollLeft > 5;
        this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;

        // Prime Video style: check if near end to load more
        const threshold = 150;
        const isNearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - threshold;
        if (isNearEnd && this.displayedBooks.length < this.books.length) {
          console.log(`[SLIDER - ${this.title}] Scroll vicino al termine a destra. Attivazione caricamento incrementale...`);
          this.loadMore();
        }
      }
      this.rafPending = false;
    });
  }

  next() {
    this.scrollContainer.nativeElement.scrollBy({ left: this.scrollStep, behavior: 'smooth' });
  }

  prev() {
    this.scrollContainer.nativeElement.scrollBy({ left: -this.scrollStep, behavior: 'smooth' });
  }

  private clamp() {
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
  }

  onMouseWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return; // ignora scroll verticale
    event.preventDefault();
    if (event.deltaX > 0) this.next();
    else this.prev();
  }

  toggleLike(book: any) {
    if (book.id) {
      this.interactions.toggleLike(book.id);
    }
  }

  toggleBookmark(book: any) {
    if (book.id) {
      this.interactions.toggleBookmark(book.id);
    }
  }
}
