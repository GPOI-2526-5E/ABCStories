import { Component, OnInit, inject, ChangeDetectorRef, effect, PLATFORM_ID } from '@angular/core';
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
export class PageLoader implements OnInit {
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
  private showTime: number = Date.now();
  private isWaitingForResources = false;
  
  // Traccia se siamo in fase di navigazione attiva o di bootstrap iniziale
  // In questo modo, le chiamate HTTP di background a pagina già caricata non mostreranno l'overlay.
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

  private updateState() {
    // Carica solo se siamo in fase di transizione rotta/bootstrap e non siamo esplicitamente bloccati da dialogs
    const shouldLoad = this.isNavigatingOrBootstrapping && (this.routerLoading || this.httpLoading) && !this.loadingService.isBlocked();

    if (shouldLoad) {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }
      this.isWaitingForResources = false;

      // Mostra l'overlay istantaneamente per coprire l'intera pagina prima di mostrare elementi parziali
      if (!this.isLoading) {
        this.showTime = Date.now();
        this.isLoading = true;
        this.cdr.detectChanges();
      }

      // Mostra lo spinner visivo e il testo solo se il caricamento supera i 200ms
      // Previene piccoli flash fastidiosi ("piccoli caricamenti") durante passaggi rapidi
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

      if (this.isLoading && !this.hideTimeout && !this.isWaitingForResources) {
        this.isWaitingForResources = true;
        this.waitForAllPageResources().then(() => {
          this.isWaitingForResources = false;

          const currentShouldLoad = this.isNavigatingOrBootstrapping && (this.routerLoading || this.httpLoading) && !this.loadingService.isBlocked();
          if (currentShouldLoad) return;

          const elapsed = Date.now() - this.showTime;
          const minDuration = 400; // Tempo minimo per far finire l'animazione CSS
          const remaining = Math.max(0, minDuration - elapsed);

          // 50ms di grazia per beccare chiamate API concatenate
          const delay = Math.max(50, remaining);

          this.hideTimeout = setTimeout(() => {
            this.isLoading = false;
            this.showSpinner = false;
            this.isNavigatingOrBootstrapping = false; // Fine transizione
            this.cdr.detectChanges();
            this.hideTimeout = null;
          }, delay);
        });
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
      let resolveTimeout: any;

      const checkAndResolve = () => {
        const pending = Array.from(urls).filter(url => !loadedUrls.has(url));
        if (pending.length === 0) {
          if (resolveTimeout) clearTimeout(resolveTimeout);
          // Attende 100ms di stabilità per essere sicuri che non vengano inserite nuove immagini
          resolveTimeout = setTimeout(() => {
            resolve();
          }, 100);
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

      // Eseguiamo una scansione iniziale
      scanDOM();

      // Utilizziamo un MutationObserver per intercettare qualsiasi inserimento asincrono di immagini o cambi di stile
      const observer = new MutationObserver(() => {
        scanDOM();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style', 'class']
      });

      // Timeout di sicurezza massimo di 3 secondi per evitare blocchi infiniti dell'UI
      const safetyTimeout = setTimeout(() => {
        observer.disconnect();
        resolve();
      }, 3000);

      // Sovrascriviamo la resolve per disconnettere l'observer in ogni caso di uscita
      const originalResolve = resolve;
      resolve = () => {
        clearTimeout(safetyTimeout);
        if (resolveTimeout) clearTimeout(resolveTimeout);
        observer.disconnect();
        originalResolve();
      };
    });
  }
}
