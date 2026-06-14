import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID, ChangeDetectorRef, inject, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { BookSlider } from '../book-slider/book-slider';
import { FormsModule } from '@angular/forms';
import { Footer } from '../footer/footer';
import { BookService } from '../../services/book';
import { BOOK_UUID_MAP } from '../../services/book-uuid-map';
import { Api } from '../../services/api';
import { LoadingService } from '../../services/loading.service';
import { InteractionsService } from '../../services/interactions.service';

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

export class BookDetail implements OnInit, AfterViewInit, OnDestroy {
  book: any = null;
  chapters: any[] = [];
  readingProgress: any[] = [];
  firstUnreadChapter: any = null;
  overallProgress = 0;
  isSticky = false;
  isOverLightSection = false;

  booksD: any[] = [];

  currentUserInitial = 'T';
  currentUserName = 'Tu';
  currentUserHandle = '@tu';

  newCommentText = '';
  visibleCount = VISIBLE_STEP;
  sortNewest = true;

  comments: Comment[] = [];

  get visibleComments(): Comment[] {
    return this.comments.slice(0, this.visibleCount);
  }

  addComment(): void {
    const text = this.newCommentText.trim();
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    if (!text || !user || !this.book?.id) return;

    this.api.addComment(this.book.id, user.id, text).subscribe({
      next: (newCommentData: any) => {
        const newComment: Comment = {
          id: newCommentData.id,
          author: newCommentData.author_name || this.currentUserName,
          handle: newCommentData.author_handle || this.currentUserHandle,
          timeAgo: 'adesso',
          text: newCommentData.content,
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
        this.cdr.detectChanges();
      },
      error: err => console.error('Error adding comment', err)
    });
  }

  addReply(comment: Comment): void {
    const text = comment.replyDraft.trim();
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    if (!text || !user) return;

    this.api.addReply(comment.id, user.id, text).subscribe({
      next: (newReplyData: any) => {
        const reply: Reply = {
          id: newReplyData.id,
          author: newReplyData.author_name || this.currentUserName,
          handle: newReplyData.author_handle || this.currentUserHandle,
          timeAgo: 'adesso',
          text: newReplyData.content,
          likes: 0,
          liked: false,
        };

        comment.replies.push(reply);
        comment.repliesOpen = true;
        comment.replyBoxOpen = false;
        comment.replyDraft = '';
        this.cdr.detectChanges();
      },
      error: err => console.error('Error adding reply', err)
    });
  }

  toggleLike(item: any, isReply: boolean = false): void {
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    if (!user) return;

    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;

    if (isReply) {
      this.api.toggleReplyLike(item.id, user.id).subscribe({
        error: () => {
          item.liked = !item.liked;
          item.likes += item.liked ? 1 : -1;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.api.toggleCommentLike(item.id, user.id).subscribe({
        error: () => {
          item.liked = !item.liked;
          item.likes += item.liked ? 1 : -1;
          this.cdr.detectChanges();
        }
      });
    }
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

  private loadingService = inject(LoadingService);
  public interactions = inject(InteractionsService);

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Sincronizza lo stato dello scroll iniziale (utile in caso di scroll restoration)
      setTimeout(() => this.onWindowScroll(), 100);
    }
  }

  ngOnDestroy(): void {
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollPos = window.scrollY || document.documentElement.scrollTop || 0;
    this.isSticky = scrollPos > 350;

    const detailsEl = document.querySelector('.divDetails') as HTMLElement;
    if (detailsEl) {
      const rect = detailsEl.getBoundingClientRect();
      const viewHeight = window.innerHeight || document.documentElement.clientHeight;
      this.isOverLightSection = rect.top < viewHeight && rect.bottom > 0;
    }
    this.cdr.detectChanges();
  }

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
      created_at: s.created_at,
      likesCount: s.likes_count ?? 0,
      bookmarksCount: s.bookmarks_count ?? 0,
      rating: s.rating ? parseFloat(s.rating) : 0,
      readers: s.readers_count ? String(s.readers_count) : (s.readers ?? '0'),
      chaptersCount: s.chapters_count ?? s.chaptersCount ?? 0,
      liked: s.liked ?? false,
      bookmarked: s.bookmarked ?? false,
      viewsCount: s.views_count ? parseInt(s.views_count, 10) : 0,
      is_18_plus: !!s.is_18_plus,
      completion_status: s.completion_status ?? 'in_corso',
    };
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.interactions.loadUserInteractions().subscribe();
    }
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    if (user) {
      this.currentUserInitial = user.username ? user.username[0].toUpperCase() : 'U';
      this.currentUserName = user.username || 'Tu';
      this.currentUserHandle = user.email || '@tu';
    }

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      const navState = isPlatformBrowser(this.platformId)
        ? (history.state as any)?.book
        : null;

      if (navState && navState.id) {
        this.book = this.mapDbBook(navState);
      } else {
        this.book = null;
      }

      const storyId = id ?? navState?.id;
      if (storyId) {
        this.loadSideDetails(storyId, user);
        this.api.recordView(storyId, user?.id).subscribe({
          next: () => this.loadMainStory(storyId),
          error: (err) => {
            console.warn("Errore registrazione visualizzazione, procedo:", err);
            this.loadMainStory(storyId);
          }
        });
      }

      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    });
  }

  private loadMainStory(storyId: string) {
    this.api.getStory(storyId).subscribe({
      next: (story) => {
        if (story) {
          const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
          const show18Plus = user?.visualizza_18plus === true;
          if (story.is_18_plus && !show18Plus) {
            this.router.navigate(['/home']);
            return;
          }
          this.book = this.mapDbBook(story);
          this.preloadImage(this.book.img);
        } else if (!this.book) {
          this.book = this.bookService.getById(storyId);
          if (this.book?.img) this.preloadImage(this.book.img);
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
  }

  private loadSideDetails(storyId: string, user: any) {
    this.api.getStoryReviews(storyId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, r) => acc + (parseFloat(r.rating) || 0), 0);
          const avg = sum / reviews.length;
          if (this.book) {
            this.book.rating = avg;
          }
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Errore fetch recensioni:", err);
      }
    });

    this.api.getStoryComments(storyId, user?.id).subscribe({
      next: (comments) => {
        this.comments = comments.map(c => ({
          id: c.id,
          author: c.author_name,
          handle: c.author_handle,
          timeAgo: new Date(c.created_at).toLocaleDateString(),
          text: c.text,
          tags: [],
          likes: parseInt(c.likes_count),
          liked: c.user_liked,
          repliesOpen: false,
          replyBoxOpen: false,
          replyDraft: '',
          replies: c.replies ? c.replies.map((r: any) => ({
            id: r.id,
            author: r.author_name,
            handle: r.author_handle,
            timeAgo: new Date(r.created_at).toLocaleDateString(),
            text: r.text,
            likes: parseInt(r.likes_count),
            liked: r.user_liked
          })) : []
        }));
        this.dynamicSortComments();
        this.cdr.detectChanges();
      },
      error: err => console.error("Errore fetch commenti", err)
    });

    this.api.getSimilarStories(storyId).subscribe({
      next: (similar) => {
        this.booksD = similar.map((s: any) => this.mapDbBook(s));
        this.cdr.detectChanges();
      },
      error: err => console.error("Errore fetch storie simili", err)
    });
  }

  private dynamicSortComments() {
    this.comments.sort((a, b) => this.sortNewest
      ? b.id.localeCompare(a.id)
      : a.id.localeCompare(b.id)
    );
  }

  private preloadImage(url: string) {
    if (!isPlatformBrowser(this.platformId) || !url) return;
    this.loadingService.show();
    const img = new Image();
    img.onload = () => this.loadingService.hide();
    img.onerror = () => this.loadingService.hide();
    img.src = url;
  }

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
              if (prog.length > 0 && chapters.length > 0) {
                const total = prog.reduce((s: number, p: any) => s + p.progress_pct, 0);
                this.overallProgress = Math.round(total / chapters.length);
              }
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

  startReading(): void {
    if (!this.book?.id) return;
    const chapter = this.firstUnreadChapter ?? this.chapters[0];
    if (!chapter) return;
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
      this.router.navigate(['/author'], { state: { authorId } });
    }
  }

  get readButtonLabel(): string {
    if (!this.chapters.length) return 'Inizia a Leggere';
    if (this.overallProgress > 0 && this.overallProgress < 100) {
      return `Continua a Leggere`;
    }
    if (this.overallProgress >= 100) return 'Rileggi';
    return 'Inizia a Leggere';
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  reviews: any[] | null = null;

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
    if (!this.reviews) return [];
    return this.showAllReviews ? this.reviews : this.reviews.slice(0, 4);
  }

  toggleChapters() { this.showAllChapters = !this.showAllChapters; }
  toggleReviews() { this.showAllReviews = !this.showAllReviews; }

  getInitials(name?: string): string {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  getStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => {
      const diff = rating - i;
      if (diff >= 1) return 100;
      if (diff <= 0) return 0;
      return Math.round(diff * 100);
    });
  }

  getFriendlyStatusLabel(status: string): string {
    switch (status) {
      case 'completato': return 'Completato';
      case 'incompleto': return 'Incompleto';
      case 'sospeso': return 'Sospeso';
      case 'in_corso':
      default:
        return 'In corso';
    }
  }
}