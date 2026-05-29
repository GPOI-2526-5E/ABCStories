import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements AfterViewInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService,
    private api: Api
  ) {}

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Errori di validazione
  errors: { [key: string]: string } = {};

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

  private validate(): boolean {
    this.errors = {};

    if (!this.email.trim())           this.errors['email']           = "L'email è obbligatoria";
    if (!this.username.trim())        this.errors['username']        = "Il nome utente è obbligatorio";
    if (!this.password)               this.errors['password']        = "La password è obbligatoria";
    if (!this.confirmPassword)        this.errors['confirmPassword'] = "Ripeti la password";
    if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = "Le password non coincidono";
    }

    return Object.keys(this.errors).length === 0;
  }

  onRegister(event: Event) {
    event.preventDefault();

    if (!this.validate()) return;

    this.api.register(this.email, this.username, this.password).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.authService.login(response.user);
          this.router.navigate(['/home']);
        }
      },
      error: (error: any) => {
        if (error.status === 409) {
          alert('Email o username già in uso');
        } else {
          console.error('Registrazione fallita:', error);
          alert('Errore durante la registrazione. Riprova più tardi.');
        }
      }
    });
  }
}
