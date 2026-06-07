import { Component, AfterViewInit, Inject, PLATFORM_ID, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Api } from '../../services/api';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule, NgIf],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements AfterViewInit, OnDestroy {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private authService: AuthService,
    private api: Api,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef
  ) {}

  email: string = '';
  username: string = '';
  password: string = '';
  confirmPassword: string = '';

  // Verification-related states
  isCodeSent: boolean = false;
  isEmailVerified: boolean = false;
  verificationCode: string = '';
  isSendingCode: boolean = false;
  isVerifyingCode: boolean = false;
  resendCountdown: number = 0;
  resendTimerId: any = null;

  // Validation and verification errors
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

  ngOnDestroy(): void {
    if (this.resendTimerId) {
      clearInterval(this.resendTimerId);
    }
  }

  sendCode() {
    this.errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.email || !emailRegex.test(this.email)) {
      this.errors['email'] = "Inserisci un indirizzo email valido";
      return;
    }

    this.isSendingCode = true;
    this.api.sendVerificationCode(this.email).subscribe({
      next: (response: any) => {
        this.isSendingCode = false;
        this.isCodeSent = true;
        this.startResendTimer();
        
        let msg = 'Abbiamo inviato un codice di verifica alla tua email.';
        if (response.devMode) {
          msg = `[DEVELOPER MODE] Il server SMTP non è configurato. Usa questo codice per verificare la tua email: ${response.code}`;
        }
        this.dialogService.alert('Codice Inviato', msg);
      },
      error: (error) => {
        this.isSendingCode = false;
        if (error.status === 409) {
          this.dialogService.alert('Email non disponibile', 'Questo indirizzo email è già associato a un account.');
        } else {
          console.error('Invio codice fallito:', error);
          this.dialogService.alert('Errore', 'Impossibile inviare il codice. Riprova più tardi.');
        }
      }
    });
  }

  startResendTimer() {
    this.resendCountdown = 60;
    if (this.resendTimerId) {
      clearInterval(this.resendTimerId);
    }
    this.resendTimerId = setInterval(() => {
      this.resendCountdown--;
      this.cdr.detectChanges(); // Forza l'aggiornamento grafico immediato ad ogni secondo
      if (this.resendCountdown <= 0) {
        clearInterval(this.resendTimerId);
      }
    }, 1000);
  }

  verifyCode() {
    this.errors = {};
    if (!this.verificationCode || this.verificationCode.trim().length !== 6) {
      this.errors['code'] = 'Inserisci il codice a 6 cifre';
      return;
    }

    this.isVerifyingCode = true;
    this.api.verifyCode(this.email, this.verificationCode).subscribe({
      next: (response) => {
        this.isVerifyingCode = false;
        this.isEmailVerified = true;
        this.cdr.detectChanges(); // Forza il rendering immediato del DOM
        if (this.resendTimerId) {
          clearInterval(this.resendTimerId);
        }
        // Trigger reveal animation using GSAP for newly rendered registration fields
        setTimeout(() => {
          const elements = document.querySelectorAll('.reveal-field');
          gsap.set(elements, { opacity: 0, y: 30 });
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1
          });
        }, 50);
      },
      error: (error) => {
        this.isVerifyingCode = false;
        this.errors['code'] = 'Codice errato o scaduto. Riprova.';
      }
    });
  }

  modifyEmail() {
    this.isCodeSent = false;
    this.verificationCode = '';
    this.errors = {};
    if (this.resendTimerId) {
      clearInterval(this.resendTimerId);
      this.resendCountdown = 0;
    }
  }

  private validate(): boolean {
    this.errors = {};

    if (!this.email.trim())           this.errors['email']           = "L'email è obbligatoria";
    if (!this.username.trim())        this.errors['username']        = "Il nome utente è obbligatorio";
    
    if (!this.password) {
      this.errors['password'] = "La password è obbligatoria";
    } else {
      const hasUppercase = /[A-Z]/.test(this.password);
      const hasLowercase = /[a-z]/.test(this.password);
      const hasNumber = /[0-9]/.test(this.password);
      const hasSpecial = /[\W_]/.test(this.password);
      const isLengthValid = this.password.length >= 8;

      if (!isLengthValid || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        this.errors['password'] = "La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola, un numero e un carattere speciale (es. !@#$%).";
      }
    }

    if (!this.confirmPassword)        this.errors['confirmPassword'] = "Ripeti la password";
    if (this.password && this.confirmPassword && this.password !== this.confirmPassword) {
      this.errors['confirmPassword'] = "Le password non coincidono";
    }

    return Object.keys(this.errors).length === 0;
  }

  onRegister(event: Event) {
    event.preventDefault();

    if (!this.isEmailVerified) {
      this.dialogService.alert('Errore', 'Devi prima verificare la tua email.');
      return;
    }

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
          this.dialogService.alert('Registrazione fallita', 'Email o username già in uso');
        } else {
          console.error('Registrazione fallita:', error);
          this.dialogService.alert('Errore', 'Errore durante la registrazione. Riprova più tardi.');
        }
      }
    });
  }
}
