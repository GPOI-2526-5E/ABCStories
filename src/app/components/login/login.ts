import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from "@angular/router";
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private router: Router) { }

  private readonly validEmail = 'a@a.com';
  private readonly validPassword = 'a';

  email: string = '';
  password: string = '';

  ngAfterViewInit(): void {
  if (!isPlatformBrowser(this.platformId)) return;

  const leftElements = document.querySelectorAll(
    ".animate-left .logo, .animate-left .title, .animate-left .form-wrapper, .animate-left .submit-btn, .animate-left .google-btn"
  );

  gsap.set(leftElements, { opacity: 0, y: 40 });

  gsap.to(leftElements, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: "power3.out",
    stagger: 0.12      
  });

  const rightImage = document.querySelector(".animate-right .image-right");
  if (rightImage) {
    gsap.fromTo(
      rightImage,
      { opacity: 0, x: 100, scale: 1.05 },
      { 
        opacity: 1, 
        x: 0, 
        scale: 1, 
        duration: 0.9,  
        ease: "power3.out",
        delay: 0.2    
      }
    );
  }
}

  onLogin(event: Event) {
    event.preventDefault();

    if (this.email === this.validEmail && this.password === this.validPassword) {
      this.router.navigate(['/home']);
      console.log("ok");
    } else {
      alert('Email o password errati');
    }
  }
}
