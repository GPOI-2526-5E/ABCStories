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

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  readonly interactions = inject(InteractionsService);

  canScrollLeft = false;
  canScrollRight = true;
  readonly scrollStep = 600;

  cardWidth = 204.2;
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['books']) {
      setTimeout(() => {
        this.updateArrows();
      }, 100);
    }
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
