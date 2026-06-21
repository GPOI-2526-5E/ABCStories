import {
  Component, OnInit, OnDestroy, Inject, PLATFORM_ID,
  HostListener, signal, computed, ChangeDetectorRef, inject
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { DialogService } from '../../services/dialog.service';

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

  currentUser = inject(AuthService).currentUser;
  private dialogService = inject(DialogService);

  readingFontClass = computed(() => {
    const user = this.currentUser();
    const font = (user as any)?.reading_font || 'sans-serif';
    return `font-${font}`;
  });

  readingFontSizeClass = computed(() => {
    const user = this.currentUser();
    const size = (user as any)?.reading_font_size || 'medium';
    return `size-${size}`;
  });

  readingWidthClass = computed(() => {
    const user = this.currentUser();
    const width = (user as any)?.reading_width || 'medium';
    return `width-${width}`;
  });

  readingModeClass = computed(() => {
    const user = this.currentUser();
    return `mode-${(user as any)?.reading_mode || 'scroll'}`;
  });

  isPageMode = computed(() => {
    const user = this.currentUser();
    return (user as any)?.reading_mode === 'page';
  });

  currentPage = signal(1);
  totalPages = signal(1);

  updatePageCount(el: HTMLElement) {
    if (!el) return;
    const w = el.clientWidth;
    const s = el.scrollWidth;
    if (w > 0) {
      this.totalPages.set(Math.max(1, Math.round(s / w)));
      this.currentPage.set(Math.max(1, Math.round(el.scrollLeft / w) + 1));
    }
  }

  scrollPage(direction: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.querySelector('.reader-text') as HTMLElement;
    if (el) {
      const w = el.clientWidth;
      el.scrollBy({
        left: direction * w,
        behavior: 'smooth'
      });
    }
  }

  onReaderTextScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.updatePageCount(el);

    const user = this.currentUser();
    if ((user as any)?.reading_mode !== 'page') return;

    const scrolled = el.scrollLeft;
    const total = el.scrollWidth - el.clientWidth;
    const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
    this.scrollPercent.set(Math.min(100, pct));
  }

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

  // Sottolineature
  chapterHighlights: any[] = [];
  paragraphsWithSegments: any[] = [];
  activeSelection: any = null;
  selectedHighlightToDelete: any = null;
  floatingBtnStyle = {
    display: 'none',
    top: '0px',
    left: '0px'
  };

  highlightModeActive: boolean = false;
  selectedColor: string = 'rgba(241, 196, 15, 0.3)';

  hoveredHighlightId: string | null = null;
  activeHighlightId: string | null = null;
  shareMenuOpenForHighlightId: string | null = null;
  activeShareHighlight: any = null;
  private hoverTimeout: any = null;

  highlightColors = [
    { name: 'Giallo', value: 'rgba(241, 196, 15, 0.3)', textShadow: 'rgba(241, 196, 15, 0.6)' },
    { name: 'Verde', value: 'rgba(46, 204, 113, 0.3)', textShadow: 'rgba(46, 204, 113, 0.6)' },
    { name: 'Rosso', value: 'rgba(231, 76, 60, 0.3)', textShadow: 'rgba(231, 76, 60, 0.6)' },
    { name: 'Blu', value: 'rgba(52, 152, 219, 0.3)', textShadow: 'rgba(52, 152, 219, 0.6)' },
    { name: 'Viola', value: 'rgba(155, 89, 182, 0.3)', textShadow: 'rgba(155, 89, 182, 0.6)' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api,
    private auth: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private highlightIdToScroll: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.highlightIdToScroll = queryParams['highlightId'] || null;
    });

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
        this.loadHighlights();
        this.cdr.detectChanges();
        // Registra visualizzazione alla prima apertura cap. 1
        const user = this.auth.currentUser();
        if (user && data.order_index === 1) {
          this.api.recordView(data.story_id, user.id).subscribe();
        }
        // Recupera progresso salvato
        if (user) {
          if ((user as any).reading_mode === 'page') {
            this.isScrolled.set(true);
            this.isPastTitle.set(true);
          }
          this.api.getReadingProgress(user.id, data.story_id).subscribe({
            next: (prog) => {
              const me = prog.find((p: any) => p.chapter_id === chapterId);
              if (me) this.scrollPercent.set(me.progress_pct);
            }
          });
        }
        if (isPlatformBrowser(this.platformId)) {
          setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 50);
          setTimeout(() => {
            const el = document.querySelector('.reader-text') as HTMLElement;
            if (el) this.updatePageCount(el);
          }, 300);
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

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const el = document.querySelector('.reader-text') as HTMLElement;
    if (el) this.updatePageCount(el);
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

  loadHighlights(): void {
    const user = this.auth.currentUser();
    if (!user || !this.chapter) {
      this.recomputeSegments();
      return;
    }
    this.api.getChapterHighlights(this.chapter.id, user.id).subscribe({
      next: (data) => {
        this.chapterHighlights = data;
        this.recomputeSegments();
        this.cdr.detectChanges();

        if (this.highlightIdToScroll) {
          this.scrollToHighlight(this.highlightIdToScroll);
          this.highlightIdToScroll = null;
        }
      },
      error: (err) => {
        console.warn('Errore nel caricamento delle sottolineature:', err);
        this.recomputeSegments();
      }
    });
  }

  private scrollToHighlight(highlightId: string): void {
    setTimeout(() => {
      const el = document.getElementById('highlight-' + highlightId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
        el.classList.add('highlight-pulse');
        setTimeout(() => el.classList.remove('highlight-pulse'), 2000);
      }
    }, 200);
  }

  recomputeSegments(): void {
    const rawParas = this.paragraphs;
    const segmentsList = [];

    for (let pIdx = 0; pIdx < rawParas.length; pIdx++) {
      const text = rawParas[pIdx];
      let pHighlights = [...this.chapterHighlights.filter(h => h.paragraph_index === pIdx)];

      // Applicazione della selezione mobile come preview temporanea
      if (this.isTouchDevice() && this.activeSelection && this.activeSelection.paragraphIndex === pIdx) {
        const selStart = this.activeSelection.startOffset;
        const selEnd = this.activeSelection.endOffset;

        const overlapping = pHighlights.filter(h =>
          selStart < h.end_offset && selEnd > h.start_offset
        );

        if (overlapping.length > 0) {
          const mergedStart = Math.min(selStart, ...overlapping.map(o => o.start_offset));
          const mergedEnd = Math.max(selEnd, ...overlapping.map(o => o.end_offset));

          pHighlights = pHighlights.filter(h => !overlapping.includes(h));
          pHighlights.push({
            id: 'selection-preview',
            user_id: '',
            story_id: '',
            chapter_id: '',
            paragraph_index: pIdx,
            start_offset: mergedStart,
            end_offset: mergedEnd,
            text: text.slice(mergedStart, mergedEnd),
            color: this.selectedColor,
            isPreview: true
          } as any);
        } else {
          pHighlights.push({
            id: 'selection-preview',
            user_id: '',
            story_id: '',
            chapter_id: '',
            paragraph_index: pIdx,
            start_offset: selStart,
            end_offset: selEnd,
            text: this.activeSelection.text,
            color: this.selectedColor,
            isPreview: true
          } as any);
        }
      }

      pHighlights.sort((a, b) => a.start_offset - b.start_offset);

      const segments = [];
      let idx = 0;

      for (const h of pHighlights) {
        if (h.start_offset >= idx && h.start_offset <= text.length) {
          if (h.start_offset > idx) {
            segments.push({
              text: text.slice(idx, h.start_offset),
              highlighted: false,
              start: idx,
              end: h.start_offset
            });
          }
          const end = Math.min(h.end_offset, text.length);
          segments.push({
            text: text.slice(h.start_offset, end),
            highlighted: true,
            highlightId: h.id,
            color: h.color,
            start: h.start_offset,
            end: end
          });
          idx = end;
        }
      }

      if (idx < text.length) {
        segments.push({
          text: text.slice(idx),
          highlighted: false,
          start: idx,
          end: text.length
        });
      }

      segmentsList.push(segments);
    }

    this.paragraphsWithSegments = segmentsList;
  }

  getSelectionCharacterOffsetsWithin(element: HTMLElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;
    return { start, end };
  }

  getRangeCharacterOffsetsWithin(range: Range, element: HTMLElement) {
    const preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(element);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    const start = preSelectionRange.toString().length;
    const end = start + range.toString().length;
    return { start, end };
  }

  hideFloatingBtn() {
    this.floatingBtnStyle = {
      display: 'none',
      top: '0px',
      left: '0px'
    };
    this.activeSelection = null;
  }

  @HostListener('document:selectionchange')
  onSelectionChange() {
    if (!isPlatformBrowser(this.platformId)) return;
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      // Do NOT clear activeSelection here — this causes a race condition on mobile:
      // tapping "Sottolinea" collapses the selection (firing selectionchange) BEFORE
      // the click handler fires, so activeSelection would be null when we need it.
      // Cleanup is handled by onDocumentClick when the user taps outside text+panel.
      return;
    }

    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const pEl = startContainer.parentElement?.closest('.reader-paragraph') as HTMLElement;
    if (!pEl) {
      this.hideFloatingBtn();
      return;
    }

    const pIdxStr = pEl.getAttribute('data-para-index');
    if (pIdxStr === null) {
      this.hideFloatingBtn();
      return;
    }

    const paragraphIndex = parseInt(pIdxStr, 10);
    const selectedText = selection.toString();

    const offsets = this.getSelectionCharacterOffsetsWithin(pEl);
    if (!offsets) {
      this.hideFloatingBtn();
      return;
    }

    this.activeSelection = {
      paragraphIndex,
      startOffset: offsets.start,
      endOffset: offsets.end,
      text: selectedText
    };

    this.cdr.detectChanges();
  }

  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event: any) {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = event.target as HTMLElement;
    const panel = document.querySelector('.highlight-panel-container');
    if (panel && panel.contains(target)) {
      return;
    }
    // On desktop (mouseup): auto-highlight if mode is active
    if (event.type === 'mouseup' && this.highlightModeActive && this.activeSelection) {
      this.createHighlight();
    }
    // On mobile (touchend): do NOT auto-highlight — user must tap "Sottolinea" button
  }

  /** Returns true on touch devices (mobile/tablet) */
  isTouchDevice(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
  }

  /**
   * On mobile when highlight mode is active, tapping the text triggers a range selection
   * preview: the first tap on a word starts selection, the second tap on another word in
   * the same paragraph expands selection to cover everything in between.
   */
  onReaderTextClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.highlightModeActive || !this.isTouchDevice()) return;

    // Don't interfere with taps on existing highlights (except selection-preview)
    const target = event.target as HTMLElement;
    const highlightedEl = target.closest('.text-highlighted');
    if (highlightedEl && !highlightedEl.classList.contains('selection-preview')) return;
    if (target.closest('.highlight-actions-popover')) return;

    // Resolve caret position from tap coordinates
    let range: Range | null = null;
    const x = event.clientX;
    const y = event.clientY;

    if (typeof (document as any).caretRangeFromPoint === 'function') {
      // Chrome, Safari, Edge
      range = (document as any).caretRangeFromPoint(x, y);
    } else if (typeof (document as any).caretPositionFromPoint === 'function') {
      // Firefox
      const pos = (document as any).caretPositionFromPoint(x, y);
      if (pos && pos.offsetNode) {
        range = document.createRange();
        range.setStart(pos.offsetNode, pos.offset);
        range.setEnd(pos.offsetNode, pos.offset);
      }
    }

    if (!range || range.startContainer.nodeType !== Node.TEXT_NODE) return;

    // Make sure the tap is inside the reader content
    const readerText = document.querySelector('.reader-text');
    if (!readerText || !readerText.contains(range.startContainer)) return;

    // Expand the caret range to full word boundaries
    const textNode = range.startContainer as Text;
    const fullText = textNode.textContent || '';
    const WORD_BREAK = /[\s\n\r,;:.!?'"«»\-\u2013\u2014()\[\]]/;

    let startOff = range.startOffset;
    let endOff = range.startOffset;

    while (startOff > 0 && !WORD_BREAK.test(fullText[startOff - 1])) startOff--;
    while (endOff < fullText.length && !WORD_BREAK.test(fullText[endOff])) endOff++;

    if (startOff >= endOff) return; // Tapped on whitespace/punctuation only

    range.setStart(textNode, startOff);
    range.setEnd(textNode, endOff);

    // Apply selection
    const pEl = range.startContainer.parentElement?.closest('.reader-paragraph') as HTMLElement;
    if (!pEl) return;
    const pIdxStr = pEl.getAttribute('data-para-index');
    if (pIdxStr === null) return;
    const paragraphIndex = parseInt(pIdxStr, 10);

    const wordOffsets = this.getRangeCharacterOffsetsWithin(range, pEl);
    if (!wordOffsets) return;

    // Word text
    const selectedText = fullText.slice(startOff, endOff);

    // If we have an active selection in the same paragraph, expand it!
    if (this.activeSelection && this.activeSelection.paragraphIndex === paragraphIndex) {
      // Find start and end offset spanning both selections
      const start = Math.min(this.activeSelection.startOffset, wordOffsets.start);
      const end = Math.max(this.activeSelection.endOffset, wordOffsets.end);
      const paragraphText = this.paragraphs[paragraphIndex] || '';

      this.activeSelection = {
        paragraphIndex,
        startOffset: start,
        endOffset: end,
        text: paragraphText.slice(start, end)
      };
    } else {
      // Otherwise, start a new selection
      this.activeSelection = {
        paragraphIndex,
        startOffset: wordOffsets.start,
        endOffset: wordOffsets.end,
        text: selectedText
      };
    }

    // Clear native selection so browser handles don't clash with our preview
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }

    // Recompute segments to show the selection preview immediately
    this.recomputeSegments();
    this.cdr.detectChanges();
  }

  toggleHighlightMode() {
    if (this.activeSelection) {
      this.createHighlight();
    } else {
      this.highlightModeActive = !this.highlightModeActive;
    }
    this.cdr.detectChanges();
  }

  selectColor(color: string) {
    this.selectedColor = color;
    this.highlightModeActive = true;

    // Se c'è una selezione attiva, applica subito la sottolineatura!
    if (this.activeSelection) {
      this.createHighlight();
    }
    this.cdr.detectChanges();
  }

  getHighlightClass(color: string): string {
    if (!color) return 'hl-yellow';
    if (color.includes('46, 204, 113') || color === 'green') return 'hl-green';
    if (color.includes('231, 76, 60') || color === 'red') return 'hl-red';
    if (color.includes('52, 152, 219') || color === 'blue') return 'hl-blue';
    if (color.includes('155, 89, 182') || color === 'purple') return 'hl-purple';
    return 'hl-yellow';
  }

  createHighlight() {
    const user = this.auth.currentUser();
    if (!user || !this.chapter || !this.activeSelection) return;

    // Rimuoviamo subito la selezione nativa del browser per evitare che rimanga blu
    if (isPlatformBrowser(this.platformId)) {
      window.getSelection()?.removeAllRanges();
    }

    const paragraphIndex = this.activeSelection.paragraphIndex;
    const start = this.activeSelection.startOffset;
    const end = this.activeSelection.endOffset;
    const text = this.activeSelection.text;

    // Troviamo eventuali sottolineature sovrapposte nello stesso paragrafo
    const overlapping = this.chapterHighlights.filter(h =>
      h.paragraph_index === paragraphIndex &&
      start < h.end_offset &&
      end > h.start_offset
    );

    const activeSelBackup = { ...this.activeSelection };
    this.hideFloatingBtn();

    if (overlapping.length > 0) {
      // Manteniamo un backup per poter ripristinare in caso di errore
      const backupHighlights = JSON.parse(JSON.stringify(this.chapterHighlights));

      const paragraphText = this.paragraphs[paragraphIndex] || '';
      const newStart = Math.min(start, ...overlapping.map(o => o.start_offset));
      const newEnd = Math.max(end, ...overlapping.map(o => o.end_offset));
      const mergedText = paragraphText ? paragraphText.slice(newStart, newEnd) : text;

      const targetHighlight = overlapping[0];
      const otherOverlapping = overlapping.slice(1);

      // Aggiorniamo ottimisticamente il target highlight
      targetHighlight.start_offset = newStart;
      targetHighlight.end_offset = newEnd;
      targetHighlight.text = mergedText;
      targetHighlight.color = this.selectedColor;

      // Rimuoviamo gli altri sovrapposti dall'elenco locale
      const otherIds = otherOverlapping.map(o => o.id);
      this.chapterHighlights = this.chapterHighlights.filter(h => !otherIds.includes(h.id));

      this.recomputeSegments();
      this.cdr.detectChanges();

      // 1. Chiamata API per aggiornare il primo
      this.api.updateHighlight(targetHighlight.id, {
        color: this.selectedColor,
        startOffset: newStart,
        endOffset: newEnd,
        text: mergedText
      }).subscribe({
        next: (updated) => {
          this.chapterHighlights = this.chapterHighlights.map(h => h.id === targetHighlight.id ? updated : h);
          this.recomputeSegments();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Errore aggiornamento sottolineatura sovrapposta:', err);
          this.chapterHighlights = backupHighlights;
          this.recomputeSegments();
          this.cdr.detectChanges();
        }
      });

      // 2. Chiamate API per eliminare gli altri duplicati/sovrapposti
      for (const otherId of otherIds) {
        this.api.deleteHighlight(otherId).subscribe({
          error: (err) => console.error('Errore eliminazione highlight sovrapposto duplicato:', err)
        });
      }
    } else {
      // Nessuna sovrapposizione: crea una nuova sottolineatura
      const tempId = 'temp-' + Date.now();
      const tempHighlight = {
        id: tempId,
        user_id: user.id,
        story_id: this.chapter.story_id,
        chapter_id: this.chapter.id,
        paragraph_index: paragraphIndex,
        start_offset: start,
        end_offset: end,
        text: text,
        color: this.selectedColor
      };

      this.chapterHighlights.push(tempHighlight);
      this.recomputeSegments();
      this.cdr.detectChanges();

      const payload = {
        userId: user.id,
        storyId: this.chapter.story_id,
        chapterId: this.chapter.id,
        paragraphIndex: activeSelBackup.paragraphIndex,
        startOffset: activeSelBackup.startOffset,
        endOffset: activeSelBackup.endOffset,
        text: activeSelBackup.text,
        color: this.selectedColor
      };

      this.api.addHighlight(payload).subscribe({
        next: (newHighlight) => {
          this.chapterHighlights = this.chapterHighlights.filter(h => h.id !== tempId);
          this.chapterHighlights.push(newHighlight);
          this.recomputeSegments();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Errore creazione sottolineatura:', err);
          this.chapterHighlights = this.chapterHighlights.filter(h => h.id !== tempId);
          this.recomputeSegments();
          this.cdr.detectChanges();
        }
      });
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const target = event.target as HTMLElement;
    const readerArticle = document.querySelector('.reader-article');
    const panel = document.querySelector('.highlight-panel-container');

    // Controlliamo se il click è dentro l'articolo o nel pannello dei colori/highlight
    const isInsideText = readerArticle && readerArticle.contains(target);
    const isInsidePanel = panel && panel.contains(target);

    // Controlliamo se è un click su un dialog di conferma o un overlay (per l'eliminazione)
    const isInsideDialog = target.closest('.dialog-overlay') || target.closest('.dialog-container') || target.closest('.modal-container');

    if (!isInsideText && !isInsidePanel && !isInsideDialog) {
      window.getSelection()?.removeAllRanges();
      this.hideFloatingBtn();
      this.highlightModeActive = false;
      this.cdr.detectChanges();
    }

    if (!target.closest('.text-highlighted') && !target.closest('.highlight-actions-popover') && !target.closest('.mobile-share-sheet')) {
      this.activeHighlightId = null;
      this.shareMenuOpenForHighlightId = null;
      this.activeShareHighlight = null;
      this.cdr.detectChanges();
    }
  }

  onHighlightMouseEnter(highlightId: string) {
    if (this.hoverTimeout) clearTimeout(this.hoverTimeout);
    this.hoveredHighlightId = highlightId;
    this.cdr.detectChanges();
  }

  onHighlightMouseLeave(highlightId: string) {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredHighlightId = null;
      this.cdr.detectChanges();
    }, 500); // 500ms delay to keep the popover open while moving mouse
  }

  onHighlightClick(seg: any, event: Event) {
    event.stopPropagation();
    // Toggle active lock on click (works on both desktop and mobile)
    if (this.activeHighlightId === seg.highlightId) {
      this.activeHighlightId = null;
      this.shareMenuOpenForHighlightId = null;
    } else {
      this.activeHighlightId = seg.highlightId;
    }
    this.cdr.detectChanges();
  }

  async deleteHighlightFromPopover(highlightId: string, event: Event) {
    event.stopPropagation();
    const hl = this.chapterHighlights.find(h => h.id === highlightId);
    if (hl) {
      const confirmed = await this.dialogService.confirm(
        'Elimina Sottolineatura',
        'Sei sicuro di voler eliminare questa frase dalle tue sottolineature?'
      );
      if (confirmed) {
        this.selectedHighlightToDelete = hl;
        this.confirmDeleteHighlight();
      }
    }
  }

  confirmDeleteHighlight() {
    if (!this.selectedHighlightToDelete) return;
    this.api.deleteHighlight(this.selectedHighlightToDelete.id).subscribe({
      next: () => {
        this.chapterHighlights = this.chapterHighlights.filter(h => h.id !== this.selectedHighlightToDelete.id);
        this.recomputeSegments();
        this.selectedHighlightToDelete = null;
        this.activeHighlightId = null;
        this.hoveredHighlightId = null;
        this.shareMenuOpenForHighlightId = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore eliminazione sottolineatura:', err);
        this.selectedHighlightToDelete = null;
      }
    });
  }

  cancelDeleteHighlight() {
    this.selectedHighlightToDelete = null;
  }

  toggleHighlightShareMenu(seg: any, event: Event) {
    event.stopPropagation();
    if (this.isTouchDevice()) {
      this.activeShareHighlight = seg;
    } else {
      if (this.shareMenuOpenForHighlightId === seg.highlightId) {
        this.shareMenuOpenForHighlightId = null;
      } else {
        this.shareMenuOpenForHighlightId = seg.highlightId;
      }
    }
    this.cdr.detectChanges();
  }

  closeMobileShareMenu() {
    this.activeShareHighlight = null;
    this.cdr.detectChanges();
  }

  copyHighlightLink(seg: any, event: Event) {
    event.stopPropagation();
    if (!seg.highlightId || !this.chapter) return;
    const url = window.location.origin + '/reader/' + this.chapter.story_id + '/' + this.chapter.id + '?highlightId=' + seg.highlightId;
    navigator.clipboard.writeText(url).then(
      () => {
        this.dialogService.alert('Copiato', 'Link della citazione copiato negli appunti!');
        this.shareMenuOpenForHighlightId = null;
        this.activeShareHighlight = null;
        this.cdr.detectChanges();
      },
      () => {
        this.dialogService.alert('Errore', 'Impossibile copiare il link.');
      }
    );
  }

  shareHighlightToCommunity(seg: any, event: Event) {
    event.stopPropagation();
    if (!this.chapter) return;
    this.shareMenuOpenForHighlightId = null;
    this.activeShareHighlight = null;
    this.router.navigate(['/community'], {
      queryParams: {
        shareStoryId: this.chapter.story_id,
        shareHighlightText: seg.text
      }
    });
  }

  isNativeShareSupported(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!navigator.share;
  }

  shareHighlightOnSocial(seg: any, platform: string, event: Event) {
    event.stopPropagation();
    if (!this.chapter) return;
    const url = encodeURIComponent(window.location.origin + '/reader/' + this.chapter.story_id + '/' + this.chapter.id + '?highlightId=' + seg.highlightId);
    const title = encodeURIComponent(`"${seg.text}" - Citazione da ${this.chapter.story_title}`);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: `Citazione da ${this.chapter.story_title}`,
            text: `"${seg.text}"`,
            url: decodeURIComponent(url)
          }).then(() => {
            this.shareMenuOpenForHighlightId = null;
            this.activeShareHighlight = null;
            this.cdr.detectChanges();
          }).catch((err) => {
            console.log('Condivisione annullata o fallita:', err);
          });
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      this.shareMenuOpenForHighlightId = null;
      this.activeShareHighlight = null;
      this.cdr.detectChanges();
    }
  }
}
