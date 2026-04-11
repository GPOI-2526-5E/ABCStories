import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookSlider } from '../book-slider/book-slider';
import { Footer } from "../footer/footer";

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

export class Home implements AfterViewInit, OnDestroy {
  private slides: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private dotsContainer: HTMLDivElement | null = null;
  private ambientBg: HTMLDivElement | null = null;
  private dots: HTMLElement[] = [];

  public slidesCount: number = 0;
  public current = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayDelay = 7000;

  public rankingIndex = 0;
  public readonly totalRankingItems = 12;
  public readonly visibleCards = 5;

  booksA = [
    { title: 'Il Nome della Rosa', author: 'U. Eco', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80', liked: false, bookmarked: false },
    { title: "L'Alchimista", author: 'P. Coelho', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Cime Tempestose', author: 'E. Brontë', img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Orgoglio e Pregiudizio', author: 'J. Austen', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Grande Gatsby', author: 'F.S. Fitzgerald', img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Delitto e Castigo', author: 'F. Dostoevskij', img: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Don Chisciotte', author: 'M. de Cervantes', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'L. Tolstoy', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'L. Tolstoy', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
  ];

  booksB = [
    { title: 'Cento anni di solitudine', author: 'G.G. Márquez', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&q=80', liked: false, bookmarked: false },
    { title: 'La Metamorfosi', author: 'F. Kafka', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Processo', author: 'F. Kafka', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Lolita', author: 'V. Nabokov', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Signore degli Anelli', author: 'J.R.R. Tolkien', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=80', liked: false, bookmarked: false },
    { title: '1984', author: 'G. Orwell', img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Vecchio e il Mare', author: 'E. Hemingway', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Siddharta', author: 'H. Hesse', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Conte di Montecristo', author: 'A. Dumas', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Sherlock Holmes', author: 'A.C. Doyle', img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80', liked: false, bookmarked: false },
    { title: '1984', author: 'G. Orwell', img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Vecchio e il Mare', author: 'E. Hemingway', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Siddharta', author: 'H. Hesse', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Il Conte di Montecristo', author: 'A. Dumas', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80', liked: false, bookmarked: false },
    { title: 'Sherlock Holmes', author: 'A.C. Doyle', img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80', liked: false, bookmarked: false },
  ];

  booksC = [
    { title: 'Dracula', author: 'Bram Stoker', img: '/assets/Presentazione/horror/horror1.jpg', liked: false, bookmarked: false },
    { title: 'Shining', author: 'Stephen King', img: '/assets/Presentazione/horror/horror2.jpg', liked: false, bookmarked: false },
    { title: "L'Esorcista", author: 'William P. Blatty', img: '/assets/Presentazione/horror/horror3.jpg', liked: false, bookmarked: false },
    { title: 'It', author: 'Stephen King', img: '/assets/Presentazione/horror/horror4.jpg', liked: false, bookmarked: false },
    { title: 'Frankenstein', author: 'Mary Shelley', img: '/assets/Presentazione/horror/horror5.jpg', liked: false, bookmarked: false },
    { title: 'Il Silenzio degli Innocenti', author: 'Thomas Harris', img: '/assets/Presentazione/horror/horror6.jpg', liked: false, bookmarked: false },
    { title: 'Pet Sematary', author: 'Stephen King', img: '/assets/Presentazione/horror/horror7.jpg', liked: false, bookmarked: false },
    { title: 'Cujo', author: 'Stephen King', img: '/assets/Presentazione/horror/horror8.jpg', liked: false, bookmarked: false },
    { title: 'The Ring', author: 'Koji Suzuki', img: '/assets/Presentazione/horror/horror9.jpg', liked: false, bookmarked: false },
    { title: 'Psico', author: 'Robert Bloch', img: '/assets/Presentazione/horror/horror10.jpg', liked: false, bookmarked: false },
  ];

  booksD = [
    { title: 'Orgoglio e Pregiudizio', author: 'Jane Austen', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { title: 'Il Grande Gatsby', author: 'F. Scott Fitzgerald', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { title: 'Romeo e Giulietta', author: 'William Shakespeare', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { title: 'Cime Tempestose', author: 'Emily Brontë', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
    { title: 'Io prima di te', author: 'Jojo Moyes', img: '/assets/Presentazione/romance/romance6.jpg', liked: false, bookmarked: false },
    { title: 'Le pagine della nostra vita', author: 'Nicholas Sparks', img: '/assets/Presentazione/romance/romance7.jpg', liked: false, bookmarked: false },
    { title: 'Colpa delle stelle', author: 'John Green', img: '/assets/Presentazione/romance/romance8.jpg', liked: false, bookmarked: false },
    { title: 'Chiamami col tuo nome', author: 'André Aciman', img: '/assets/Presentazione/romance/romance9.jpg', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'Lev Tolstoj', img: '/assets/Presentazione/romance/romance10.jpg', liked: false, bookmarked: false },
    // Ripetizione immagini per arrivare a 15 con nuovi titoli
    { title: 'Persuasione', author: 'Jane Austen', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { title: 'Ragione e Sentimento', author: 'Jane Austen', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { title: 'Un amore senza fine', author: 'Scott Spencer', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { title: 'Emma', author: 'Jane Austen', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { title: 'La signora delle camelie', author: 'Alexandre Dumas', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
  ];

  @Input() books: TalentBook[] = [
    {
      tag: 'Fantasy',
      title: 'Le Radici del Cielo',
      desc: 'Una giovane maga scopre che il suo potere è legato a un\'antica profezia che potrebbe cambiare il destino del regno.',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    },
    {
      tag: 'Romance',
      title: 'Sotto lo Stesso Cielo',
      desc: 'Due anime che si cercano tra continenti diversi, unite da lettere scritte in un\'estate che nessuno dimenticherà.',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    },
    {
      tag: 'Thriller',
      title: 'Ombre nel Buio',
      desc: 'Un detective scopre che il caso più oscuro della sua carriera lo riporta a una notte che credeva di aver dimenticato.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
    {
      tag: 'Avventura',
      title: 'Il Confine del Mondo',
      desc: 'Tre ragazzi partono per un viaggio che li porterà oltre i confini di ciò che credevano possibile.',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    },
    {
      tag: 'Horror',
      title: 'La Casa dei Sussurri',
      desc: 'Una famiglia si trasferisce in una villa isolata. I muri parlano — e quello che dicono fa paura.',
      img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80',
    },
    {
      tag: 'Fantascienza',
      title: 'Oltre le Stelle',
      desc: 'Un astronauta solitario riceve un segnale dall\'altra parte della galassia. Non è solo.',
      img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
    },
    {
      tag: 'Storico',
      title: 'Il Sangue dei Re',
      desc: 'Nella Roma del 50 a.C., uno schiavo scopre di essere l\'erede di un\'antica casata.',
      img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80',
    },
  ];

  @Output() bookSelected = new EventEmitter<TalentBook>();
  @Output() readClicked = new EventEmitter<TalentBook>();

  @ViewChild('sliderOuter') sliderOuter!: ElementRef;

  scroll(direction: 1 | -1) {
    const cardWidth = 170 + 12; // width + gap
    this.sliderOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth'
    });
  }

  onMouseWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.sliderOuter.nativeElement.scrollBy({
      left: event.deltaX * 2,
      behavior: 'smooth'
    });
  }

  @ViewChild('artistsOuter') artistsOuter!: ElementRef;

  scrollArtists(direction: 1 | -1) {
    const cardWidth = 130 + 22;
    this.artistsOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth' // smooth solo per i bottoni
    });
  }

  onArtistsWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.artistsOuter.nativeElement.scrollLeft += event.deltaX * 1.2; // niente smooth, diretto
  }

  onBookClick(book: TalentBook) {
    this.bookSelected.emit(book);
  }

  onReadClick(book: TalentBook) {
    this.readClicked.emit(book);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);

      setTimeout(() => {
        this.initSlider();
        this.initFooterReveal();
      }, 100);
    }
  }

  private initFooterReveal(): void {
    ScrollTrigger.create({
      trigger: ".divStart",
      start: "bottom bottom",
      pin: true,
      pinSpacing: false,
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @ViewChild('rankTrack') rankTrack!: ElementRef;

  scrollRank(direction: 1 | -1) {
    const outer = this.rankTrack.nativeElement.parentElement; // rank-scroll-outer
    const cardWidth = 185 + 24;
    outer.scrollBy({ left: direction * cardWidth * 3, behavior: 'smooth' });
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

  onArtistClick(artist: Artist) {
    this.artistSelected.emit(artist);
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
    if (!this.ambientBg || !this.slides[this.current]) return;

    const bgImage = this.slides[this.current].dataset['bg'];
    if (!bgImage) return;

    this.ambientBg.style.opacity = '0';

    setTimeout(() => {
      if (this.ambientBg) {
        this.ambientBg.style.backgroundImage = `url('${bgImage}')`;
        this.ambientBg.style.opacity = '0.95';
      }
    }, 180);
  }

  public goToSlide(index: number): void {
    this.current = index;
    this.updateSlides();
  }

  private nextSlide(): void {
    this.current = (this.current + 1) % this.slides.length;
    this.updateSlides();
  }

  private prevSlide(): void {
    this.current = (this.current - 1 + this.slides.length) % this.slides.length;
    this.updateSlides();
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();

    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.autoplayDelay);
  }

  private stopAutoSlide(): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  public restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
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
    { name: 'Romance', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=70', wide: true },
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
  }
}
