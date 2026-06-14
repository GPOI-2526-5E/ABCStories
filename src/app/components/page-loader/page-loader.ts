import { Component, OnInit, inject, ChangeDetectorRef, effect, PLATFORM_ID, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-page-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-loader.html',
  styleUrl: './page-loader.scss'
})
export class PageLoader implements OnInit, OnDestroy {
  // Avvia il loader come attivo di default per coprire la schermata iniziale di bootstrap
  isLoading = true;
  showSpinner = false;
  
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  public loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);

  private routerLoading = false;
  private httpLoading = false;
  private hideTimeout: any;
  private showSpinnerTimeout: any;
  private updateStateTimeout: any = null;
  private showTime: number = Date.now();
  private isWaitingForResources = false;
  
  // Traccia se siamo in fase di navigazione attiva o di bootstrap iniziale
  private isNavigatingOrBootstrapping = true;

  constructor() {
    effect(() => {
      this.httpLoading = this.loadingService.isLoading();
      // Track isBlocked changes to re-run updateState
      const _blocked = this.loadingService.isBlocked();
      this.updateState();
    });
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: Event): e is Event =>
        e instanceof NavigationStart ||
        e instanceof NavigationEnd ||
        e instanceof NavigationCancel ||
        e instanceof NavigationError
      )
    ).subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        this.isNavigatingOrBootstrapping = true;
        this.routerLoading = true;
        this.updateState();
      } else {
        this.routerLoading = false;
        this.updateState();
      }
    });

    // Se l'app si avvia e non c'è navigazione in corso, eseguiamo comunque il controllo iniziale
    // per sbloccare la schermata una volta caricate le immagini del bootstrap iniziale
    setTimeout(() => {
      this.updateState();
    }, 100);
  }

  ngOnDestroy() {
    if (this.showSpinnerTimeout) clearTimeout(this.showSpinnerTimeout);
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    if (this.updateStateTimeout) clearTimeout(this.updateStateTimeout);
  }

  private updateState() {
    if (this.updateStateTimeout) {
      clearTimeout(this.updateStateTimeout);
    }
    this.updateStateTimeout = setTimeout(() => {
      this.updateStateTimeout = null;
      this.executeUpdateState();
    });
  }

  private executeUpdateState() {
    // Carica solo se siamo in fase di transizione rotta/bootstrap e non siamo esplicitamente bloccati da dialogs
    const shouldLoad = this.isNavigatingOrBootstrapping && (this.routerLoading || this.httpLoading) && !this.loadingService.isBlocked();

    if (shouldLoad) {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      this.isWaitingForResources = false;

      // Mostra l'overlay istantaneamente
      if (!this.isLoading) {
        this.showTime = Date.now();
        this.isLoading = true;
        this.cdr.detectChanges();
      }
    } else {
      if (this.isLoading && !this.hideTimeout && !this.isWaitingForResources) {
        this.isWaitingForResources = true;
        this.waitForAllPageResources().then(() => {
          this.isWaitingForResources = false;

          const currentShouldLoad = this.isNavigatingOrBootstrapping && (this.routerLoading || this.httpLoading) && !this.loadingService.isBlocked();
          if (currentShouldLoad) return;

          const elapsed = Date.now() - this.showTime;
          const minDuration = 400; // Tempo minimo per far finire l'animazione CSS
          const remaining = Math.max(0, minDuration - elapsed);
          const delay = Math.max(50, remaining);

          this.hideTimeout = setTimeout(() => {
            this.isLoading = false;
            this.isNavigatingOrBootstrapping = false; // Fine transizione
            this.cdr.detectChanges();
            this.hideTimeout = null;
          }, delay);
        });
      }
    }

    // Gestione dello spinner visivo: mostra lo spinner se isLoading rimane true per più di 200ms
    if (this.isLoading) {
      if (!this.showSpinner && !this.showSpinnerTimeout) {
        this.showSpinnerTimeout = setTimeout(() => {
          this.showSpinner = true;
          this.cdr.detectChanges();
        }, 200);
      }
    } else {
      if (this.showSpinnerTimeout) {
        clearTimeout(this.showSpinnerTimeout);
        this.showSpinnerTimeout = null;
      }
      if (this.showSpinner) {
        this.showSpinner = false;
        this.cdr.detectChanges();
      }
    }
  }

  private waitForAllPageResources(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const urls = new Set<string>();
      const loadedUrls = new Set<string>();

      const checkAndResolve = () => {
        const pending = Array.from(urls).filter(url => !loadedUrls.has(url));
        if (pending.length === 0) {
          resolve();
        }
      };

      const preloadUrl = (url: string) => {
        if (!url || urls.has(url)) return;
        urls.add(url);

        const img = new Image();
        img.onload = () => {
          loadedUrls.add(url);
          checkAndResolve();
        };
        img.onerror = () => {
          loadedUrls.add(url);
          checkAndResolve();
        };
        img.src = url;
        if (img.complete) {
          loadedUrls.add(url);
          checkAndResolve();
        }
      };

      const scanDOM = () => {
        // 1. Raccogliamo i tag <img>
        const images = Array.from(document.querySelectorAll('img'));
        images.forEach(img => {
          if (img.src) {
            preloadUrl(img.src);
          }
        });

        // 2. Raccogliamo gli elementi con immagini di sfondo CSS
        const allElements = Array.from(document.querySelectorAll('*'));
        allElements.forEach(el => {
          const style = (el as HTMLElement).style;
          let bgImg = '';
          if (style) {
            bgImg = style.backgroundImage || window.getComputedStyle(el).backgroundImage;
          }
          if (bgImg && bgImg !== 'none') {
            const match = bgImg.match(/url\((['"]?)(.*?)\1\)/);
            if (match && match[2]) {
              let url = match[2];
              if (!url.startsWith('data:') && !url.startsWith('http') && !url.startsWith('//')) {
                if (url.startsWith('/')) {
                  url = window.location.origin + url;
                } else {
                  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
                  url = base + url;
                }
              }
              preloadUrl(url);
            }
          }
        });

        checkAndResolve();
      };

      // Scansiona il DOM per raccogliere le immagini caricate
      scanDOM();

      // Timeout di sicurezza massimo di 1 secondo per evitare blocchi dell'UI dovuti a caricamenti infiniti
      const safetyTimeout = setTimeout(() => {
        resolve();
      }, 1000);

      // Sovrascriviamo la resolve per pulire i timer
      const originalResolve = resolve;
      resolve = () => {
        clearTimeout(safetyTimeout);
        originalResolve();
      };
    });
  }
}
