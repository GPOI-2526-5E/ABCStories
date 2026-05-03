import { AfterViewInit, Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from "@angular/router";
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements AfterViewInit {
  private activeMobileGenre: string | null = null;
  mobileDropdownOpen = false;
  mobileNavOpen = false;
  mobileGenresOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const sliders = document.querySelectorAll<HTMLElement>('.image-slider');

    sliders.forEach((slider) => {

      const container = slider.querySelector<HTMLElement>('.scroll-images');
      const left = slider.querySelector<HTMLButtonElement>('.img-arrow.left');
      const right = slider.querySelector<HTMLButtonElement>('.img-arrow.right');

      if (!container || !left || !right) return;

      const items = container.querySelectorAll<HTMLElement>('.container');

      /* ---------- FUNZIONE AGGIORNA FRECCE ---------- */
      const updateArrows = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        left.style.opacity = container.scrollLeft <= 0 ? "0" : "1";
        left.style.pointerEvents = container.scrollLeft <= 0 ? "none" : "auto";
        right.style.opacity = container.scrollLeft >= maxScroll - 1 ? "0" : "1";
        right.style.pointerEvents = container.scrollLeft >= maxScroll - 1 ? "none" : "auto";
      };

      /* ---------- FUNZIONE AGGIORNA PROFONDITA ---------- */
      const updateDepth = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        items.forEach(item => {
          const itemCenter = item.offsetLeft + item.clientWidth / 2;
          const distance = Math.abs(center - itemCenter);
          if (distance > 200) item.classList.add('dim');
          else item.classList.remove('dim');
        });
      };

      /* ---------- FUNZIONE OVERLAY ---------- */
      const updateOverlays = () => {
        const maxScroll = container.scrollWidth - container.clientWidth;

        const isAtStart = container.scrollLeft <= 2;
        const isAtEnd = container.scrollLeft >= maxScroll - 2;

        if (isAtStart) slider.classList.add('no-left');
        else slider.classList.remove('no-left');

        if (isAtEnd) slider.classList.add('no-right');
        else slider.classList.remove('no-right');
      };

      /* ---------- SNAP AUTOMATICO ---------- */
      const snapScroll = () => {
        const center = container.scrollLeft + container.clientWidth / 2;
        let closest = items[0];
        let minDistance = Infinity;
        items.forEach(item => {
          const itemCenter = item.offsetLeft + item.clientWidth / 2;
          const distance = Math.abs(center - itemCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closest = item;
          }
        });
        const scrollTo = closest.offsetLeft - (container.clientWidth - closest.clientWidth) / 2;
        container.scrollTo({ left: scrollTo, behavior: 'smooth' });
      };

      /* ---------- EVENTI FRECCE ---------- */
      right.addEventListener('click', () => {
        container.scrollBy({ left: 220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });

      left.addEventListener('click', () => {
        container.scrollBy({ left: -220, behavior: 'smooth' });
        setTimeout(() => { updateArrows(); updateDepth(); updateOverlays(); }, 300);
      });

      /* ---------- SCROLL / DRAG ---------- */
      container.addEventListener('scroll', () => {
        updateArrows();
        updateDepth();
        updateOverlays();
      });

      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      container.addEventListener('mousedown', (e) => {
        isDown = true;
        container.classList.add('active');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('mouseleave', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });

      container.addEventListener('mouseup', () => {
        if (isDown) { isDown = false; snapScroll(); container.classList.remove('active'); }
      });

      container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
        updateArrows();
        updateDepth();
        updateOverlays();
      });

      /* ---------- TOUCH SUPPORT ---------- */
      container.addEventListener('touchstart', (e: TouchEvent) => {
        isDown = true;
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });

      container.addEventListener('touchend', () => {
        if (isDown) { isDown = false; snapScroll(); }
      });

      container.addEventListener('touchmove', (e: TouchEvent) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
        updateArrows();
        updateDepth();
        updateOverlays();
      });

      /* ---------- INIZIALIZZAZIONE ---------- */
      updateArrows();
      updateDepth();
      updateOverlays();

    });
  }

  toggleMobileNav(): void {
    this.mobileNavOpen = !this.mobileNavOpen;
    if (!this.mobileNavOpen) {
      this.mobileGenresOpen = false;
      this.activeMobileGenre = null;
    }
  }

  /** Apre/chiude la lista generi */
  toggleMobileGenresPanel(): void {
    this.mobileGenresOpen = !this.mobileGenresOpen;
    if (!this.mobileGenresOpen) {
      this.activeMobileGenre = null;
    }
  }

  /** Apre/chiude il pannello libri di un singolo genere */
  toggleMobileGenre(name: string): void {
    this.activeMobileGenre = this.activeMobileGenre === name ? null : name;
  }

  /** Usato nel template: [class.mn-genre-panel--open]="isMobileOpen('horror')" */
  isMobileOpen(name: string): boolean {
    return this.activeMobileGenre === name;
  }

  /** Chiude tutto se si tocca fuori dalla mobile navbar */
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
