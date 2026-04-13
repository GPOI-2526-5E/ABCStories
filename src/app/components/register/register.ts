import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const elements = document.querySelectorAll(
    '.logo-wrapper, .title-wrapper, p, .inputGroup, .submit-btn, .google-btn, .divisore'
  );

  gsap.set(elements, { opacity: 0, y: 40 });

  gsap.to(elements, {
    opacity: 1,
    y: 0,
    duration: 0.8,      
    ease: 'power3.out', 
    stagger: 0.12      
  });

  const rightImage = document.querySelector('.image-right');

  if (rightImage) {
    gsap.set(rightImage, { opacity: 0, x: 100 });

    gsap.to(rightImage, {
      opacity: 1,
      x: 0,
      duration: 0.9, 
      ease: 'power2.out',
      delay: 0.2        
    });
  }
}

  onRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/home']);
  }
}
