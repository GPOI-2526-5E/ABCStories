import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookSlider } from '../book-slider/book-slider';
import { Footer } from "../footer/footer";
import { Router } from '@angular/router';
import { BOOK_UUID_MAP } from '../../services/book-uuid-map';
import { Api } from '../../services/api';
import { InteractionsService } from '../../services/interactions.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';

interface Genre {
  name: string;
  img: string;
  wide?: boolean;
}

export interface TalentBook {
  tag: string;
  title: string;
  desc: string;
  img: string;
}

export interface Artist {
  name: string;
  followers: string;
  img: string;
}

@Component({
  selector: 'app-home',
  imports: [Navbar, BookSlider, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements AfterViewInit, OnDestroy, OnInit {
  private slides: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private dotsContainer: HTMLDivElement | null = null;
  private ambientBg: HTMLDivElement | null = null;
  private dots: HTMLElement[] = [];

  // Touch swipe
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private isTouchSwiping = false;
  private readonly swipeThreshold = 40;
  private readonly swipeTimeLimit = 400;

  public slidesCount: number = 0;
  public current = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayDelay = 7000;

  public rankingIndex = 0;
  public readonly totalRankingItems = 12;
  public readonly visibleCards = 5;

  public bgImageA: string = '';
  public bgImageB: string = '';
  public activeBg: 'A' | 'B' = 'A';
  private intervalId: any = null;

  /** Storie di tendenza (classifica settimanale) */
  trendingBooks: any[] = [];
  private rawTrending: any[] = [];

  booksA: any[] = [];
  booksB: any[] = [];
  booksC: any[] = [];
  booksD: any[] = [];
  newTalentsBooks: any[] = [];
  quickReadsBooks: any[] = [];
  popularAuthors: any[] = [];
  ongoingStories: any[] = [];
  completedStories: any[] = [];
  incompleteStories: any[] = [];
  suspendedStories: any[] = [];
  nsfwStories: any[] = [];

  @Input() books: any[] = [];

  @Output() bookSelected = new EventEmitter<any>();
  @Output() readClicked = new EventEmitter<any>();

  @ViewChild('sliderOuter') sliderOuter!: ElementRef;
  @ViewChild('artistsOuter') artistsOuter!: ElementRef;

  // Classifica arrows state
  classificaRafPending = false;
  canScrollClassificaLeft = false;
  canScrollClassificaRight = true;

  // Nuovi talenti arrows state
  talentsRafPending = false;
  canScrollTalentsLeft = false;
  canScrollTalentsRight = true;

  // Artisti arrows state
  artistsRafPending = false;
  canScrollArtistsLeft = false;
  canScrollArtistsRight = true;

  scrollTalents(direction: 1 | -1) {
    const cardWidth = 170 + 12; // width + gap
    this.sliderOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateTalentsArrows(), 350);
  }

  updateTalentsArrows() {
    if (!this.sliderOuter) return;
    if (this.talentsRafPending) return;
    this.talentsRafPending = true;
    requestAnimationFrame(() => {
      const el = this.sliderOuter.nativeElement;
      if (el) {
        this.canScrollTalentsLeft = el.scrollLeft > 5;
        this.canScrollTalentsRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
      }
      this.talentsRafPending = false;
      this.cdr.detectChanges();
    });
  }

  onMouseWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.sliderOuter.nativeElement.scrollLeft += event.deltaX * 1.2;
    this.updateTalentsArrows();
  }

  scrollArtists(direction: 1 | -1) {
    const cardWidth = 130 + 22;
    this.artistsOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateArtistsArrows(), 350);
  }

  updateArtistsArrows() {
    if (!this.artistsOuter) return;
    if (this.artistsRafPending) return;
    this.artistsRafPending = true;
    requestAnimationFrame(() => {
      const el = this.artistsOuter.nativeElement;
      if (el) {
        this.canScrollArtistsLeft = el.scrollLeft > 5;
        this.canScrollArtistsRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
      }
      this.artistsRafPending = false;
      this.cdr.detectChanges();
    });
  }

  onArtistsWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.artistsOuter.nativeElement.scrollLeft += event.deltaX * 1.2;
    this.updateArtistsArrows();
  }

  onBookClick(book: any) {
    this.goToBookDetail(book);
  }

  onReadClick(book: any) {
    this.goToBookDetail(book);
  }

  goToBookDetail(book: any) {
    if (!book || !book.id) return;
    this.router.navigate(['/book', book.id], { state: { book } });
  }

  goToAuthor(authorId: string | undefined, event?: Event) {
    if (event) event.stopPropagation();
    if (authorId) {
      this.router.navigate(['/author'], { state: { authorId } });
    }
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private api: Api,
    private interactions: InteractionsService,
    private loadingService: LoadingService,
  ) {
    this.mapHomeBookIds();
    this.slidesCount = this.books.length;
  }

  /** Mappa i campi DB (snake_case) nel formato locale del book */
  private mapDbBook(s: any): any {
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
      weekViews: s.week_views ? parseInt(s.week_views, 10) : 0,
    };
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const user = this.interactions['authService']?.currentUser?.() ??
      JSON.parse(localStorage.getItem('auth_user') ?? 'null');

    // 1. Carica le interazioni separatamente per non bloccare il rendering dei libri
    this.interactions.loadUserInteractions().subscribe();

    const mapList = (list: any[]) => list.map(s => this.mapDbBook(s));

    // 2. Carica 'Riprendi a leggere' (Books A)
    if (user) {
      this.api.getContinueReading(user.id).pipe(catchError(() => of([]))).subscribe(continueReading => {
        this.booksA = mapList(continueReading as any[]);
        this.cdr.detectChanges();
      });
    }

    const syncTrending = () => {
      let combined = [...this.rawTrending];
      const popularMapped = this.booksB || [];
      for (const p of popularMapped) {
        if (combined.length >= 15) break;
        if (!combined.some(b => b.id === p.id)) {
          combined.push(p);
        }
      }
      if (combined.length === 0) {
        combined = popularMapped.slice(0, 15);
      }
      
      // Ordina la classifica in modo rigoroso per visualizzazioni totali (readers) decrescenti.
      combined.sort((a, b) => {
        const rA = parseInt(a.readers || '0', 10);
        const rB = parseInt(b.readers || '0', 10);
        return rB - rA;
      });

      this.trendingBooks = combined;
      this.cdr.detectChanges();
      setTimeout(() => this.updateClassificaArrows(), 200);
    };

    // 3. Carica 'Popolari' e aggiorna Hero Slider (Books B e Hero)
    this.api.getPopularStories().pipe(catchError(() => of([]))).subscribe(popular => {
      const popularMapped = mapList(popular as any[]);
      
      // Aggiorna hero slider se non è già stato fatto
      if (popularMapped.length > 0 && this.books.length === 0) {
        const today = new Date();
        let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const randomSeeded = () => { const x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
        
        const shuffled = [...popularMapped].sort(() => 0.5 - randomSeeded());
        this.books = shuffled.slice(0, 5);
        this.slidesCount = this.books.length;
        this.current = 0;
        this.updateAmbientBackground();
        
        // Precarica l'immagine corrente dell'hero
        if (this.books[0]?.img && isPlatformBrowser(this.platformId)) {
          this.loadingService.show();
          const img = new Image();
          img.onload = () => this.loadingService.hide();
          img.onerror = () => this.loadingService.hide();
          img.src = this.books[0].img;
        }
      }

      this.booksB = popularMapped;
      syncTrending();
      this.cdr.detectChanges();
    });

    // 4. Carica 'Trending' (Classifica)
    this.api.getTrendingStories(user?.id).pipe(catchError(() => of([]))).subscribe(trending => {
      const trendingMapped = mapList(trending as any[]);
      this.rawTrending = trendingMapped;
      syncTrending();
      this.cdr.detectChanges();
    });

    // 5. Carica 'In base ai preferiti' (Books C)
    this.api.getFavoritesBasedStories(user?.id).pipe(catchError(() => of([]))).subscribe(favBased => {
      this.booksC = mapList(favBased as any[]);
      this.cdr.detectChanges();
    });

    // 6. Carica 'Consigliati' (Books D)
    this.api.getRecommendedStories(user?.id).pipe(catchError(() => of([]))).subscribe(recommended => {
      this.booksD = mapList(recommended as any[]);
      this.cdr.detectChanges();
    });

    // 7. Carica 'Nuovi talenti'
    this.api.getNewTalents().pipe(catchError(() => of([]))).subscribe(talents => {
      this.newTalentsBooks = mapList(talents as any[]);
      this.cdr.detectChanges();
      setTimeout(() => this.updateTalentsArrows(), 200);
    });

    // 8. Carica 'Letture Lampo'
    this.api.getQuickReads().pipe(catchError(() => of([]))).subscribe(quick => {
      this.quickReadsBooks = mapList(quick as any[]);
      this.cdr.detectChanges();
    });

    // 9. Carica 'Artisti' (Scrittori popolari)
    this.api.getPopularAuthors().pipe(catchError(() => of([]))).subscribe(authors => {
      this.popularAuthors = (authors as any[]).map(a => ({
        id: a.id,
        name: a.name ?? 'Autore sconosciuto',
        followers: a.followers ? String(a.followers) : '0',
        img: a.img ?? 'assets/Pippi/pippiIniziale.png'
      }));
      this.cdr.detectChanges();
      setTimeout(() => this.updateArtistsArrows(), 200);
    });

    // 10. Carica storie per completion status
    this.api.getStoriesByCompletionStatus('in_corso').pipe(catchError(() => of([]))).subscribe(ongoing => {
      this.ongoingStories = mapList(ongoing as any[]);
      this.cdr.detectChanges();
    });

    this.api.getStoriesByCompletionStatus('completato').pipe(catchError(() => of([]))).subscribe(completed => {
      this.completedStories = mapList(completed as any[]);
      this.cdr.detectChanges();
    });

    this.api.getStoriesByCompletionStatus('incompleto').pipe(catchError(() => of([]))).subscribe(incomplete => {
      this.incompleteStories = mapList(incomplete as any[]);
      this.cdr.detectChanges();
    });

    this.api.getStoriesByCompletionStatus('sospeso').pipe(catchError(() => of([]))).subscribe(suspended => {
      this.suspendedStories = mapList(suspended as any[]);
      this.cdr.detectChanges();
    });

    // 11. Carica storie 18+ (NSFW)
    this.api.getNsfwStories().pipe(catchError(() => of([]))).subscribe(nsfw => {
      this.nsfwStories = mapList(nsfw as any[]);
      this.cdr.detectChanges();
    });
  }

  private mapHomeBookIds(): void {
    const mapList = (list: any[]) => {
      if (!list) return;
      list.forEach(book => {
        const uuid = BOOK_UUID_MAP[book.title.toLowerCase().trim()];
        if (uuid) {
          book.id = uuid;
        }
      });
    };
    mapList(this.booksA);
    mapList(this.booksB);
    mapList(this.booksC);
    mapList(this.booksD);
    mapList(this.books);
    mapList(this.newTalentsBooks);
    mapList(this.quickReadsBooks);
    mapList(this.ongoingStories);
    mapList(this.completedStories);
    mapList(this.incompleteStories);
    mapList(this.suspendedStories);
    mapList(this.nsfwStories);
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.preloadImages();
      //this.initFooterReveal();
      this.startAutoSlide();
      this.updateAmbientBackground();

      ScrollTrigger.refresh();
    }
  }

  private preloadImages(): void {
    this.books.forEach(book => {
      const img = new Image();
      img.src = book.img;
      // La proprietà decode() è magica: decodifica l'immagine in background
      // senza bloccare il thread principale (niente calo di frame!)
      img.decode().then(() => {
        console.log(`Immagine decodificata: ${book.title}`);
      }).catch((encodingError) => {
        // Immagine non ancora pronta, non bloccare nulla
      });
    });
  }

  /*private initFooterReveal(): void {
    ScrollTrigger.create({
      trigger: ".divStart",
      start: "bottom bottom",
      pin: true,
      pinSpacing: false,
    });
  }*/

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @ViewChild('rankTrack') rankTrack!: ElementRef;

  scrollRank(direction: 1 | -1) {
    const outer = this.rankTrack.nativeElement.parentElement; // rank-scroll-outer
    const cardWidth = 185 + 24;
    outer.scrollBy({ left: direction * cardWidth * 3, behavior: 'smooth' });
    setTimeout(() => this.updateClassificaArrows(), 350);
  }

  updateClassificaArrows() {
    if (!this.rankTrack) return;
    if (this.classificaRafPending) return;
    this.classificaRafPending = true;
    requestAnimationFrame(() => {
      const el = this.rankTrack.nativeElement.parentElement;
      if (el) {
        this.canScrollClassificaLeft = el.scrollLeft > 5;
        this.canScrollClassificaRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 5;
      }
      this.classificaRafPending = false;
      this.cdr.detectChanges();
    });
  }

  // Artisti
  @Input() artists: Artist[] = [
    { name: 'Elena Marino', followers: '12.4k', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Marco Bianchi', followers: '8.1k', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { name: 'Sofia Ricci', followers: '21k', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    { name: 'Luca Ferrari', followers: '5.3k', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Anna Conti', followers: '33k', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80' },
    { name: 'Giorgio Greco', followers: '9.8k', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
    { name: 'Chiara Esposito', followers: '15k', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
    { name: 'Davide Romano', followers: '7.2k', img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80' },
    { name: 'Giulia Mancini', followers: '18k', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
    { name: 'Paolo Barbieri', followers: '4.5k', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
    { name: 'Giulia Mancini', followers: '18k', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
    { name: 'Paolo Barbieri', followers: '4.5k', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
  ];
  @Output() artistSelected = new EventEmitter<Artist>();

  onArtistClick(artist: any) {
    if (artist && artist.id) {
      this.router.navigate(['/author'], { state: { authorId: artist.id } });
    }
  }

  private initSlider(): void {
    this.slides = document.querySelectorAll<HTMLElement>('.slide');
    this.slidesCount = this.slides.length;
    this.prevBtn = document.querySelector<HTMLButtonElement>('.prev');
    this.nextBtn = document.querySelector<HTMLButtonElement>('.next');
    this.ambientBg = document.querySelector<HTMLDivElement>('.ambient-bg');

    this.addEventListeners();
    this.updateSlides();
    this.startAutoSlide();
    this.cdr.detectChanges();
  }

  private addEventListeners(): void {
    this.nextBtn?.addEventListener('click', () => {
      this.nextSlide();
      this.restartAutoSlide();
    });

    this.prevBtn?.addEventListener('click', () => {
      this.prevSlide();
      this.restartAutoSlide();
    });

    const slider = document.querySelector<HTMLElement>('.hero-slider');

    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoSlide());
      slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }

  private updateSlides(): void {
    const total = this.slidesCount;
    if (total === 0) return;

    this.slides.forEach((slide: HTMLElement, index: number) => {
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      if (index === this.current) {
        slide.classList.add('active');
      } else if (index === (this.current - 1 + total) % total) {
        slide.classList.add('prev-slide');
      } else if (index === (this.current + 1) % total) {
        slide.classList.add('next-slide');
      }
    });

    this.updateAmbientBackground();
    this.cdr.detectChanges();
  }

  private updateAmbientBackground(): void {
    const newBg = this.books[this.current]?.img;
    if (newBg) {
      if (!this.bgImageA && !this.bgImageB) {
        this.bgImageA = newBg;
        this.activeBg = 'A';
      } else if (this.activeBg === 'A') {
        if (this.bgImageB !== newBg) {
          this.bgImageB = newBg;
        }
        this.activeBg = 'B';
      } else {
        if (this.bgImageA !== newBg) {
          this.bgImageA = newBg;
        }
        this.activeBg = 'A';
      }
    }
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  public goToSlide(index: number): void {
    this.current = index;
    this.updateAmbientBackground();
  }

  public nextSlide(event?: Event): void {
    // Se c'è un evento (cioè l'utente ha cliccato), blocchiamo propagazioni indesiderate
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.current = (this.current + 1) % this.slidesCount;
    this.updateAmbientBackground();

    // Riavvia l'autoplay solo se l'azione è manuale (click dell'utente)
    if (event) {
      this.restartAutoSlide();
    }
  }

  public prevSlide(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.current = (this.current - 1 + this.slidesCount) % this.slidesCount;
    this.updateAmbientBackground();

    if (event) {
      this.restartAutoSlide();
    }
  }

  public startAutoSlide(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoSlide(); // FONDAMENTALE: uccide sempre il timer vecchio prima di crearne uno nuovo

      this.intervalId = setInterval(() => {
        this.nextSlide(); // Chiamato senza evento, così non va in loop continuo
      }, this.autoplayDelay);
    }
  }

  public stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isTouchSwiping = false;
    this.stopAutoSlide();
  }

  onTouchMove(event: TouchEvent): void {
    const deltaX = Math.abs(event.touches[0].clientX - this.touchStartX);
    const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY);

    // Se il gesto è orizzontale, previeni lo scroll verticale
    if (deltaX > deltaY && deltaX > 8) {
      this.isTouchSwiping = true;
      event.preventDefault();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const elapsed = Date.now() - this.touchStartTime;

    if (this.isTouchSwiping && Math.abs(deltaX) > this.swipeThreshold && elapsed < this.swipeTimeLimit) {
      if (deltaX < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.restartAutoSlide();
    this.isTouchSwiping = false;
  }

  onTouchCancel(): void {
    this.isTouchSwiping = false;
    this.restartAutoSlide();
  }

  nextRanking() {
    const max = this.totalRankingItems - this.visibleCards;
    if (this.rankingIndex < max) {
      this.rankingIndex++;
    }
  }

  prevRanking() {
    if (this.rankingIndex > 0) {
      this.rankingIndex--;
    }
  }

  @Output() genreSelected = new EventEmitter<string>();

  genres: Genre[] = [
    { name: 'Romanzo', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=70', wide: true },
    { name: 'Fantasy', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=70' },
    { name: 'Thriller', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70' },
    { name: 'Horror', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&q=70' },
    { name: 'Fantascienza', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=70' },
    { name: 'Avventura', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=70', wide: true },
    { name: 'Giallo', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=70', wide: true },
    { name: 'Young Adult', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=70' },
    { name: 'Storico', img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=70' },
  ];

  onGenreClick(genre: Genre) {
    this.genreSelected.emit(genre.name);
    this.router.navigate(['/generi', genre.name.toLowerCase()]);
  }
}
