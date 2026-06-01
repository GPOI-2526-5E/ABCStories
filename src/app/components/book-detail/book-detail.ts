import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { BookSlider } from '../book-slider/book-slider';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { BookService } from '../../services/book';
import { BOOK_UUID_MAP } from '../../services/book-uuid-map';
import { Api } from '../../services/api';

export interface Reply {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  text: string;
  likes: number;
  liked: boolean;
}

export interface Comment {
  id: string;
  author: string;
  handle: string;
  timeAgo: string;
  text: string;
  tags: string[];
  likes: number;
  liked: boolean;
  replies: Reply[];
  repliesOpen: boolean;
  replyBoxOpen: boolean;
  replyDraft: string;
}

const VISIBLE_STEP = 4;

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, Navbar, BookSlider, FormsModule, Footer],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})

export class BookDetail implements OnInit {
  book: any = null;
  chapters: any[] = [];
  readingProgress: any[] = []; // progresso per capitolo
  firstUnreadChapter: any = null;  // capitolo da cui riprendere
  overallProgress = 0; // % totale lettura

  booksD = [
    { id: 34, title: 'Orgoglio e Pregiudizio', author: 'Jane Austen', desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { id: 35, title: 'Il Grande Gatsby', author: 'F. Scott Fitzgerald', desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { id: 36, title: 'Romeo e Giulietta', author: 'William Shakespeare', desc: 'Due giovani di famiglie nemiche si innamorano perdutamente a Verona. Una storia d\'amore immortale destinata a una fine tragica.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { id: 37, title: 'Cime Tempestose', author: 'Emily Brontë', desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { id: 38, title: 'Jane Eyre', author: 'Charlotte Brontë', desc: 'Jane, orfana e determinata, trova lavoro come istitutrice a Thornfield Hall dove si innamora del misterioso Mr. Rochester, nascondendo un segreto oscuro.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
    { id: 39, title: 'Io prima di te', author: 'Jojo Moyes', desc: 'Louisa Clark diventa la badante di Will Traynor, giovane ricco rimasto tetraplegico. Tra loro nasce un legame profondo che cambierà entrambi per sempre.', img: '/assets/Presentazione/romance/romance6.jpg', liked: false, bookmarked: false },
    { id: 40, title: 'Le pagine della nostra vita', author: 'Nicholas Sparks', desc: 'Noah e Allie si innamorano nell\'estate del 1940 ma la guerra e le differenze sociali li separano. Decenni dopo, il loro amore viene riletto da un vecchio quaderno.', img: '/assets/Presentazione/romance/romance7.jpg', liked: false, bookmarked: false },
    { id: 41, title: 'Colpa delle stelle', author: 'John Green', desc: 'Hazel e Augustus si incontrano a un gruppo di supporto per malati di cancro. Insieme affrontano la vita con ironia e coraggio, innamorandosi perdutamente.', img: '/assets/Presentazione/romance/romance8.jpg', liked: false, bookmarked: false },
    { id: 42, title: 'Chiamami col tuo nome', author: 'André Aciman', desc: 'Nell\'estate del 1983 in Italia, il diciassettenne Elio si innamora di Oliver, il dottorando ospite di suo padre, in un\'estate che non dimenticherà mai.', img: '/assets/Presentazione/romance/romance9.jpg', liked: false, bookmarked: false },
    { id: 43, title: 'Anna Karenina', author: 'Lev Tolstoj', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', img: '/assets/Presentazione/romance/romance10.jpg', liked: false, bookmarked: false },
    { id: 44, title: 'Persuasione', author: 'Jane Austen', desc: 'Anne Elliot rincontra il capitano Wentworth, l\'uomo che aveva rifiutato anni prima su consiglio altrui. È ancora possibile una seconda possibilità?', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { id: 45, title: 'Ragione e Sentimento', author: 'Jane Austen', desc: 'Le sorelle Elinor e Marianne Dashwood affrontano l\'amore in modi opposti: una con razionale compostezza, l\'altra con passione travolgente.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { id: 46, title: 'Un amore senza fine', author: 'Scott Spencer', desc: 'David è ossessionato da Jade, la ragazza di cui si è innamorato. Una storia d\'amore adolescenziale che diventa qualcosa di pericoloso e incontrollabile.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { id: 47, title: 'Emma', author: 'Jane Austen', desc: 'Emma Woodhouse, bella e ricca, si crede un\'abile mediatrice sentimentale. Ma nel combinare matrimoni per gli altri rischia di perdere il suo stesso amore.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { id: 48, title: 'La signora delle camelie', author: 'Alexandre Dumas', desc: 'Margherita Gautier, celebre cortigiana parigina, si innamora sinceramente di Armand Duval in una storia d\'amore condannata dalla società e dalla malattia.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
  ];

  currentUserInitial = 'T';
  currentUserName = 'Tu';
  currentUserHandle = '@tu';

  newCommentText = '';
  visibleCount = VISIBLE_STEP;
  sortNewest = true;

  comments: Comment[] = [
    {
      id: '1',
      author: 'Luca Bianchi',
      handle: '@lucabianchi',
      timeAgo: '2 giorni fa',
      text: 'Un classico imperdibile, rimane attuale e inquietante a distanza di decenni. La prosa è magistrale.',
      tags: ['imperdibile', 'classico'],
      likes: 48,
      liked: false,
      repliesOpen: false,
      replyBoxOpen: false,
      replyDraft: '',
      replies: [
        { id: '1-1', author: 'Giulia Verdi', handle: '@giuliaverdi', timeAgo: '1 giorno fa', text: 'Concordo! Il finale mi ha lasciata senza parole.', likes: 8, liked: false },
        { id: '1-2', author: 'Alessandro Moretti', handle: '@alessandrom', timeAgo: '23 ore fa', text: 'Vero, il colpo di scena è stato pazzesco!', likes: 5, liked: false },
      ],
    },
    {
      id: '2',
      author: 'Marta Romano',
      handle: '@martaromano',
      timeAgo: '2 giorni fa',
      text: 'Mi ha fatto riflettere molto sulla società moderna. Uno di quei libri che rimangono dentro.',
      tags: ['consigliato', 'riflessivo'],
      likes: 31, liked: false, repliesOpen: false, replyBoxOpen: false, replyDraft: '', replies: [],
    },
    {
      id: '3',
      author: 'Sara Conti',
      handle: '@saraconti',
      timeAgo: '3 giorni fa',
      text: 'Non sono completamente d\'accordo: la parte centrale è un po\' lenta, ma il finale riscatta tutto.',
      tags: ['onesto'],
      likes: 9, liked: false, repliesOpen: false, replyBoxOpen: false, replyDraft: '',
      replies: [
        { id: '3-1', author: 'Marco De Luca', handle: '@marcodeluca', timeAgo: '1 giorno fa', text: 'Capisco cosa intendi, ma era necessaria per costruire il finale.', likes: 4, liked: false },
      ],
    },
    {
      id: '4',
      author: 'Paolo Ferrari',
      handle: '@paoloferrari',
      timeAgo: '4 giorni fa',
      text: 'Prosa magistrale, storia indimenticabile. Lo consiglio a chiunque ami la grande letteratura.',
      tags: ['ben scritto'],
      likes: 22, liked: false, repliesOpen: false, replyBoxOpen: false, replyDraft: '', replies: [],
    },
    {
      id: '5',
      author: 'Elena Russo',
      handle: '@elenarusso',
      timeAgo: '5 giorni fa',
      text: 'Uno dei libri più importanti che abbia mai letto. Ogni pagina sorprende.',
      tags: [],
      likes: 17, liked: false, repliesOpen: false, replyBoxOpen: false, replyDraft: '', replies: [],
    },
  ];

  get visibleComments(): Comment[] {
    return this.comments.slice(0, this.visibleCount);
  }

  // ────────────────────────────────────────────────────────────
  // METODI da aggiungere in BookDetail
  // ────────────────────────────────────────────────────────────


  addComment(): void {
    const text = this.newCommentText.trim();
    if (!text) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: this.currentUserName,
      handle: this.currentUserHandle,
      timeAgo: 'adesso',
      text,
      tags: [],
      likes: 0,
      liked: false,
      replies: [],
      repliesOpen: false,
      replyBoxOpen: false,
      replyDraft: '',
    };

    this.comments.unshift(newComment);
    this.newCommentText = '';

    // TODO: persistere su backend
    // this.commentService.create(this.book.id, newComment).subscribe();
  }

  addReply(comment: Comment): void {
    const text = comment.replyDraft.trim();
    if (!text) return;

    const reply: Reply = {
      id: crypto.randomUUID(),
      author: this.currentUserName,
      handle: this.currentUserHandle,
      timeAgo: 'adesso',
      text,
      likes: 0,
      liked: false,
    };

    comment.replies.push(reply);
    comment.repliesOpen = true;
    comment.replyBoxOpen = false;
    comment.replyDraft = '';

    // TODO: persistere su backend
    // this.commentService.createReply(comment.id, reply).subscribe();
  }

  toggleLike(item: Comment | Reply): void {
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;

    // TODO: sincronizzare con backend
    // this.commentService.like(item.id, item.liked).subscribe();
  }

  toggleReplies(comment: Comment): void {
    comment.repliesOpen = !comment.repliesOpen;
  }

  toggleReplyBox(comment: Comment): void {
    comment.replyBoxOpen = !comment.replyBoxOpen;
    if (!comment.replyBoxOpen) comment.replyDraft = '';
  }

  toggleSort(): void {
    this.sortNewest = !this.sortNewest;
    this.comments.sort((a, b) => this.sortNewest
      ? b.id.localeCompare(a.id)
      : a.id.localeCompare(b.id)
    );
  }

  loadMore(): void {
    this.visibleCount += VISIBLE_STEP;
  }

  get sortLabel() { return this.sortNewest ? 'Più recenti ▾' : 'Meno recenti ▾'; }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookService,
    private api: Api,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  /** Mappa un oggetto storia dal DB nel formato usato dal template */
  private mapDbBook(s: any): any {
    return {
      id: s.id,
      title: s.title ?? '',
      author: s.author_name ?? s.author_id ?? 'Autore sconosciuto',
      author_id: s.author_id,
      desc: s.description ?? s.desc ?? '',
      img: s.image_url ?? s.img ?? 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80',
      genre: s.genre ?? '',
      tag: s.tag ?? s.genre ?? '',
      pages: s.pages ?? 0,
      year: s.release_year ?? s.year ?? 0,
      rating: s.rating ? parseFloat(s.rating) : 0,
      readers: s.readers_count ? String(s.readers_count) : (s.readers ?? '0'),
      chaptersCount: s.chapters_count ?? s.chaptersCount ?? 0,
      liked: s.liked ?? false,
      bookmarked: s.bookmarked ?? false,
    };
  }

  ngOnInit(): void {
    // Map booksD ids to UUIDs
    if (this.booksD) {
      this.booksD.forEach(book => {
        const uuid = BOOK_UUID_MAP[book.title.toLowerCase().trim()];
        if (uuid) {
          book.id = uuid as any;
        }
      });
    }

    const id = this.route.snapshot.paramMap.get('id');

    // Pre-caricamento ottimistico: mostra subito il libro dallo state se disponibile
    // (es. click da slider) — ma chiamiamo SEMPRE l'API per sicurezza
    const navState = isPlatformBrowser(this.platformId)
      ? (history.state as any)?.book
      : null;

    if (navState && navState.id) {
      // Mostra subito il libro dallo state mentre l'API carica
      this.book = this.mapDbBook(navState);
    }

    // Chiama sempre l'API con l'UUID nell'URL
    const storyId = id ?? navState?.id;
    if (storyId) {
      this.api.getStory(storyId).subscribe({
        next: (story) => {
          if (story) {
            this.book = this.mapDbBook(story);
          } else if (!this.book) {
            this.book = this.bookService.getById(storyId);
          }
          this.cdr.detectChanges();
          this.loadChaptersAndProgress(storyId);
        },
        error: (err) => {
          console.error("Errore fetch storia:", err);
          if (!this.book) {
            this.book = this.bookService.getById(storyId);
            this.cdr.detectChanges();
          }
          this.loadChaptersAndProgress(storyId);
        }
      });

      this.api.getStoryReviews(storyId).subscribe({
        next: (reviews) => {
          this.reviews = reviews;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error("Errore fetch recensioni:", err);
        }
      });
    }

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }

  /** Carica capitoli e progresso di lettura */
  private loadChaptersAndProgress(storyId: string): void {
    this.api.getChapters(storyId).subscribe({
      next: (chapters) => {
        this.chapters = chapters;
        const user = (this as any).auth?.currentUser?.() ||
          JSON.parse(localStorage.getItem('auth_user') ?? 'null');
        if (user) {
          this.api.getReadingProgress(user.id, storyId).subscribe({
            next: (prog) => {
              this.readingProgress = prog;
              // Calcola % globale
              if (prog.length > 0 && chapters.length > 0) {
                const total = prog.reduce((s: number, p: any) => s + p.progress_pct, 0);
                this.overallProgress = Math.round(total / chapters.length);
              }
              // Trova il primo capitolo non completato (< 100%)
              const readMap = new Map(prog.map((p: any) => [p.chapter_id, p.progress_pct]));
              this.firstUnreadChapter = chapters.find(
                c => !readMap.has(c.id) || (readMap.get(c.id) ?? 0) < 100
              ) ?? chapters[0];
              this.cdr.detectChanges();
            }
          });
        } else {
          this.firstUnreadChapter = chapters[0] ?? null;
          this.cdr.detectChanges();
        }
      }
    });
  }

  /** Naviga al Reader */
  startReading(): void {
    if (!this.book?.id) return;
    const chapter = this.firstUnreadChapter ?? this.chapters[0];
    if (!chapter) return;
    // Registra visualizzazione
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    this.api.recordView(this.book.id, user?.id).subscribe();
    this.router.navigate(['/reader', this.book.id, chapter.id]);
  }

  goToChapter(chapterId: string): void {
    if (!this.book?.id || !chapterId) return;
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    this.api.recordView(this.book.id, user?.id).subscribe();
    this.router.navigate(['/reader', this.book.id, chapterId]);
  }

  goToAuthor(authorId: string | undefined, event?: Event) {
    if (event) event.stopPropagation();
    if (authorId) {
      this.router.navigate(['/author', authorId]);
    }
  }

  /** Label dinamica del bottone */
  get readButtonLabel(): string {
    if (!this.chapters.length) return 'Inizia a Leggere';
    if (this.overallProgress > 0 && this.overallProgress < 100) {
      return `Continua a Leggere (${this.overallProgress}%)`;
    }
    if (this.overallProgress >= 100) return 'Rileggi';
    return 'Inizia a Leggere';
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // La lista capitoli è caricata dall'API in loadChaptersAndProgress()
  // La vecchia lista statica è stata rimossa

  reviews: any[] = [];

  similarBooks = [
    { title: '1984', author: 'G. Orwell', img: 'assets/books/1984.jpg' },
    { title: 'Il processo', author: 'F. Kafka', img: 'assets/books/kafka.jpg' },
    { title: 'Brave New World', author: 'A. Huxley', img: 'assets/books/huxley.jpg' },
    { title: 'Il maestro e Margherita', author: 'M. Bulgakov', img: 'assets/books/bulgakov.jpg' },
  ];

  defaultLearnings = [
    'Comprendere i meccanismi di un regime totalitario',
    'Analizzare la manipolazione della verità e della propaganda',
    'Riflettere sul controllo e la libertà individuale',
  ];

  showAllChapters = false;
  showAllReviews = false;

  get visibleChapters() {
    // Usa i capitoli dall'API se disponibili, altrimenti array vuoto
    return this.showAllChapters ? this.chapters : this.chapters.slice(0, 4);
  }

  get visibleReviews() {
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 4);
  }

  toggleChapters() { this.showAllChapters = !this.showAllChapters; }
  toggleReviews() { this.showAllReviews = !this.showAllReviews; }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'filled' : 'empty');
  }
}
