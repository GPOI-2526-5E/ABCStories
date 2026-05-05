import {
  AfterViewInit, Component, HostListener,
  Inject, PLATFORM_ID, inject
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {

  // ── Auth ─────────────────────────────────────────────────────────
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  // ── Mobile nav state ─────────────────────────────────────────────
  private activeMobileGenre: string | null = null;
  mobileNavOpen = false;
  mobileGenresOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // ── Slider desktop (invariato) ────────────────────────────────────
  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const sliders = document.querySelectorAll<HTMLElement>('.image-slider');

    sliders.forEach((slider) => {
      const container = slider.querySelector<HTMLElement>('.scroll-images');
      const left = slider.querySelector<HTMLButtonElement>('.img-arrow.left');
      const right = slider.querySelector<HTMLButtonElement>('.img-arrow.right');
      if (!container || !left || !right) return;

      const items = container.querySelectorAll<HTMLElement>('.container');

      const updateArrows = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        left.style.opacity = container.scrollLeft <= 0 ? '0' : '1';
        left.style.pointerEvents = container.scrollLeft <= 0 ? 'none' : 'auto';
        right.style.opacity = container.scrollLeft >= maxScroll - 1 ? '0' : '1';
        right.style.pointerEvents = container.scrollLeft >= maxScroll - 1 ? 'none' : 'auto';
      };

      const updateDepth = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        items.forEach(item => {
          const itemCenter = item.offsetLeft + item.clientWidth / 2;
          Math.abs(center - itemCenter) > 200
            ? item.classList.add('dim')
            : item.classList.remove('dim');
        });
      };

      const updateOverlays = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        container.scrollLeft <= 2
          ? slider.classList.add('no-left')
          : slider.classList.remove('no-left');
        container.scrollLeft >= maxScroll - 2
          ? slider.classList.add('no-right')
          : slider.classList.remove('no-right');
      };

      const snapScroll = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = items[0];
        let minDist = Infinity;
        items.forEach(item => {
          const dist = Math.abs((item.offsetLeft + item.clientWidth / 2) - center);
          if (dist < minDist) { minDist = dist; closest = item; }
        });
        container.scrollTo({
          left: closest.offsetLeft - (container.clientWidth - closest.clientWidth) / 2,
          behavior: 'smooth'
        });
      };

      right.addEventListener('click', () => {
        container.scrollBy({ left: 220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });
      left.addEventListener('click', () => {
        container.scrollBy({ left: -220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });

      container.addEventListener('scroll', () => { updateArrows(); updateDepth(); updateOverlays(); });

      let isDown = false, startX = 0, scrollLeft = 0;

      container.addEventListener('mousedown', e => {
        isDown = true; container.classList.add('active');
        startX = e.pageX - container.offsetLeft; scrollLeft = container.scrollLeft;
      });
      container.addEventListener('mouseleave', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });
      container.addEventListener('mouseup', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });
      container.addEventListener('mousemove', e => {
        if (!isDown) return; e.preventDefault();
        container.scrollLeft = scrollLeft - (e.pageX - container.offsetLeft - startX) * 2;
        updateArrows(); updateDepth(); updateOverlays();
      });

      container.addEventListener('touchstart', (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      container.addEventListener('touchend', () => { if (isDown) { isDown = false; snapScroll(); } });
      container.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDown) return;
        container.scrollLeft = scrollLeft - (e.touches[0].pageX - container.offsetLeft - startX) * 2;
        updateArrows(); updateDepth(); updateOverlays();
      });

      updateArrows(); updateDepth(); updateOverlays();
    });
  }

  // ── Mobile helpers (invariati) ────────────────────────────────────
  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    if (!this.mobileNavOpen) {
      this.mobileGenresOpen = false;
      this.activeMobileGenre = null;
    }
  }

  toggleMobileGenresPanel(): void {
    this.mobileGenresOpen = !this.mobileGenresOpen;
    if (!this.mobileGenresOpen) this.activeMobileGenre = null;
  }

  toggleMobileGenre(name: string): void {
    this.activeMobileGenre = this.activeMobileGenre === name ? null : name;
  }

  isMobileOpen(name: string): boolean {
    return this.activeMobileGenre === name;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (window.innerWidth >= 992) return;
    const root = document.querySelector('.mn-root');
    if (root && !root.contains(event.target as Node)) {
      this.mobileNavOpen = false;
      this.mobileGenresOpen = false;
      this.activeMobileGenre = null;
    }
  }
}
