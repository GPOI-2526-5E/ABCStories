import {
  Component, OnInit, OnDestroy, Inject, PLATFORM_ID,
  HostListener, signal, computed, ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reader',
  imports: [CommonModule],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class Reader implements OnInit, OnDestroy {

  chapter: any = null;
  chapters: any[] = [];
  isLoading = true;
  error: string | null = null;

  // Sidebar capitoli
  sidebarOpen = false;

  // Progresso scroll nel capitolo corrente (0-100)
  scrollPercent = signal(0);
  isScrolled = signal(false);
  isPastTitle = signal(false);

  // Progresso globale calcolato
  get globalPercent(): number {
    if (!this.chapter || !this.chapters.length) return 0;
    const idx = this.chapters.findIndex(c => c.id === this.chapter.id);
    const done = idx; // capitoli precedenti = 100%
    const current = this.scrollPercent() / 100;
    return Math.round(((done + current) / this.chapters.length) * 100);
  }

  private saveTimer: any = null;
  private storyId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.storyId = params['storyId'];
      const chapterId = params['chapterId'];
      this.loadChapter(chapterId);
      this.loadChapterList(this.storyId);
    });
  }

  ngOnDestroy(): void {
    if (this.saveTimer) clearInterval(this.saveTimer);
    this.persistProgress();
  }

  private loadChapter(chapterId: string): void {
    this.isLoading = true;
    this.error = null;
    this.scrollPercent.set(0); // Reset del progresso per evitare leak dal capitolo precedente
    this.api.getChapter(chapterId).subscribe({
      next: (data) => {
        this.chapter = data;
        this.isLoading = false;
        this.cdr.detectChanges();
        // Registra visualizzazione alla prima apertura cap. 1
        const user = this.auth.currentUser();
        if (user && data.order_index === 1) {
          this.api.recordView(data.story_id, user.id).subscribe();
        }
        // Recupera progresso salvato
        if (user) {
          this.api.getReadingProgress(user.id, data.story_id).subscribe({
            next: (prog) => {
              const me = prog.find((p: any) => p.chapter_id === chapterId);
              if (me) this.scrollPercent.set(me.progress_pct);
            }
          });
        }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
        }
        this.startSaveTimer();
      },
      error: () => {
        this.error = 'Impossibile caricare il capitolo.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadChapterList(storyId: string): void {
    this.api.getChapters(storyId).subscribe({
      next: (list) => this.chapters = list,
    });
  }

  /** Salva il progresso ogni 5 secondi */
  private startSaveTimer(): void {
    if (this.saveTimer) clearInterval(this.saveTimer);
    this.saveTimer = setInterval(() => this.persistProgress(), 5000);
  }

  private persistProgress(): void {
    const user = this.auth.currentUser();
    if (!user || !this.chapter) return;
    this.api.saveReadingProgress(user.id, this.chapter.id, this.scrollPercent()).subscribe();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.documentElement;
    const scrolled = el.scrollTop;
    
    // Aggiorna lo stato della topbar
    this.isScrolled.set(scrolled > 20); // La barra diventa pillola quasi subito
    this.isPastTitle.set(scrolled > window.innerHeight * 0.4); // Mostra il titolo quando si supera l'header (circa 40vh)
    
    const total = el.scrollHeight - el.clientHeight;
    const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
    this.scrollPercent.set(Math.min(100, pct));
  }

  goToChapter(chapter: any): void {
    this.persistProgress();
    this.sidebarOpen = false;
    this.router.navigate(['/reader', this.storyId, chapter.id]);
  }

  prevChapter(): void {
    if (!this.chapter) return;
    const idx = this.chapters.findIndex(c => c.id === this.chapter.id);
    if (idx > 0) this.goToChapter(this.chapters[idx - 1]);
  }

  nextChapter(): void {
    if (!this.chapter) return;
    const idx = this.chapters.findIndex(c => c.id === this.chapter.id);
    if (idx < this.chapters.length - 1) {
      // Segna il capitolo corrente come 100% letto prima di passare al prossimo
      this.scrollPercent.set(100);
      this.goToChapter(this.chapters[idx + 1]);
    } else {
      // Fine storia → segna come completato e torna ai dettagli
      this.scrollPercent.set(100);
      this.persistProgress();
      this.router.navigate(['/book', this.storyId]);
    }
  }

  get hasPrev(): boolean {
    const idx = this.chapters.findIndex(c => c.id === this.chapter?.id);
    return idx > 0;
  }

  get hasNext(): boolean {
    const idx = this.chapters.findIndex(c => c.id === this.chapter?.id);
    return idx < this.chapters.length - 1;
  }

  get isLastChapter(): boolean {
    const idx = this.chapters.findIndex(c => c.id === this.chapter?.id);
    return idx === this.chapters.length - 1;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  goBack(): void {
    this.persistProgress();
    this.router.navigate(['/book', this.storyId]);
  }

  /** Testo formattato: divide per paragrafi */
  get paragraphs(): string[] {
    return (this.chapter?.content ?? '').split('\n\n').filter((p: string) => p.trim());
  }
}
