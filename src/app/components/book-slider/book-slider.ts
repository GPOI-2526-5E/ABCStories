import { Component, Input, HostListener, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-slider',
  imports: [CommonModule],
  templateUrl: './book-slider.html',
  styleUrl: './book-slider.scss',
})
export class BookSlider {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() books: any[] = [];

  @ViewChild('scrollContainer') scrollContainer!: ElementRef<HTMLElement>;

  canScrollLeft = false;
  canScrollRight = true;
  readonly scrollStep = 600;

  cardWidth = 204.2;
  currentIndex = 0;

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
    const el = this.scrollContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 5;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
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

  toggleLike(book: any) { book.liked = !book.liked; }
  toggleBookmark(book: any) { book.bookmarked = !book.bookmarked; }
}
