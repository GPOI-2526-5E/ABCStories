import { Component, OnInit, inject, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  isLoading = false;
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  public loadingService = inject(LoadingService);

  private routerLoading = false;
  private httpLoading = false;
  private hideTimeout: any;

  constructor() {
    effect(() => {
      this.httpLoading = this.loadingService.isLoading();
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
        this.routerLoading = true;
        this.updateState();
      } else {
        this.routerLoading = false;
        this.updateState();
      }
    });
  }

  private showTime: number = 0;

  private updateState() {
    const shouldLoad = this.routerLoading || this.httpLoading;

    if (shouldLoad) {
      if (this.hideTimeout) {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
      }

      // Mostra istantaneamente il loader
      if (!this.isLoading) {
        this.showTime = Date.now();
        this.isLoading = true;
        this.cdr.detectChanges();
      }
    } else {
      if (!this.hideTimeout) {
        const elapsed = Date.now() - this.showTime;
        const minDuration = 400; // Tempo minimo per far finire l'animazione CSS
        const remaining = Math.max(0, minDuration - elapsed);

        // 50ms di grazia per beccare chiamate API concatenate
        const delay = Math.max(50, remaining);

        this.hideTimeout = setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
          this.hideTimeout = null;
        }, delay);
      }
    }
  }
}
