import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { BookSlider } from '../book-slider/book-slider';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';

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

  booksD = [
    { title: 'Orgoglio e Pregiudizio', author: 'Jane Austen', desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { title: 'Il Grande Gatsby', author: 'F. Scott Fitzgerald', desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { title: 'Romeo e Giulietta', author: 'William Shakespeare', desc: 'Due giovani di famiglie nemiche si innamorano perdutamente a Verona. Una storia d\'amore immortale destinata a una fine tragica.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { title: 'Cime Tempestose', author: 'Emily Brontë', desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { title: 'Jane Eyre', author: 'Charlotte Brontë', desc: 'Jane, orfana e determinata, trova lavoro come istitutrice a Thornfield Hall dove si innamora del misterioso Mr. Rochester, nascondendo un segreto oscuro.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
    { title: 'Io prima di te', author: 'Jojo Moyes', desc: 'Louisa Clark diventa la badante di Will Traynor, giovane ricco rimasto tetraplegico. Tra loro nasce un legame profondo che cambierà entrambi per sempre.', img: '/assets/Presentazione/romance/romance6.jpg', liked: false, bookmarked: false },
    { title: 'Le pagine della nostra vita', author: 'Nicholas Sparks', desc: 'Noah e Allie si innamorano nell\'estate del 1940 ma la guerra e le differenze sociali li separano. Decenni dopo, il loro amore viene riletto da un vecchio quaderno.', img: '/assets/Presentazione/romance/romance7.jpg', liked: false, bookmarked: false },
    { title: 'Colpa delle stelle', author: 'John Green', desc: 'Hazel e Augustus si incontrano a un gruppo di supporto per malati di cancro. Insieme affrontano la vita con ironia e coraggio, innamorandosi perdutamente.', img: '/assets/Presentazione/romance/romance8.jpg', liked: false, bookmarked: false },
    { title: 'Chiamami col tuo nome', author: 'André Aciman', desc: 'Nell\'estate del 1983 in Italia, il diciassettenne Elio si innamora di Oliver, il dottorando ospite di suo padre, in un\'estate che non dimenticherà mai.', img: '/assets/Presentazione/romance/romance9.jpg', liked: false, bookmarked: false },
    { title: 'Anna Karenina', author: 'Lev Tolstoj', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', img: '/assets/Presentazione/romance/romance10.jpg', liked: false, bookmarked: false },
    { title: 'Persuasione', author: 'Jane Austen', desc: 'Anne Elliot rincontra il capitano Wentworth, l\'uomo che aveva rifiutato anni prima su consiglio altrui. È ancora possibile una seconda possibilità?', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { title: 'Ragione e Sentimento', author: 'Jane Austen', desc: 'Le sorelle Elinor e Marianne Dashwood affrontano l\'amore in modi opposti: una con razionale compostezza, l\'altra con passione travolgente.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { title: 'Un amore senza fine', author: 'Scott Spencer', desc: 'David è ossessionato da Jade, la ragazza di cui si è innamorato. Una storia d\'amore adolescenziale che diventa qualcosa di pericoloso e incontrollabile.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { title: 'Emma', author: 'Jane Austen', desc: 'Emma Woodhouse, bella e ricca, si crede un\'abile mediatrice sentimentale. Ma nel combinare matrimoni per gli altri rischia di perdere il suo stesso amore.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { title: 'La signora delle camelie', author: 'Alexandre Dumas', desc: 'Margherita Gautier, celebre cortigiana parigina, si innamora sinceramente di Armand Duval in una storia d\'amore condannata dalla società e dalla malattia.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
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
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    const navState = this.router.getCurrentNavigation()?.extras?.state?.['book'];

    if (navState) {
      this.book = navState;
    } else if (isPlatformBrowser(this.platformId)) {
      this.book = history.state?.book ?? null;
    }

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' // <-- Questo ignora il 'smooth' del CSS
      });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  chapters = [
    { num: 1, title: 'Introduzione', img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80' },
    { num: 2, title: 'Fondamenti', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80' },
    { num: 3, title: 'Struttura', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80' },
    { num: 4, title: 'Approfondimento', img: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80' },
    { num: 5, title: 'Esempi pratici', img: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&q=80' },
    { num: 6, title: 'Conclusione', img: 'https://images.unsplash.com/photo-1471970471555-19d4b113e9ed?w=400&q=80' },
    { num: 7, title: 'Analisi critica', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80' },
    { num: 8, title: 'Note finali', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80' },
  ];

  reviews = [
    { name: 'Luca', rating: 5, text: 'Un classico imperdibile, attuale e inquietante.' },
    { name: 'Marta', rating: 5, text: 'Mi ha fatto riflettere molto sulla società moderna.' },
    { name: 'Giorgio', rating: 4, text: 'Lettura densa ma necessaria. Ogni pagina sorprende.' },
    { name: 'Sara', rating: 5, text: 'Spaventosamente attuale. Lo consiglio a tutti.' },
    { name: 'Paolo', rating: 4, text: 'Prosa magistrale, storia indimenticabile.' },
    { name: 'Elena', rating: 5, text: 'Uno dei libri più importanti che abbia mai letto.' },
  ];

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
