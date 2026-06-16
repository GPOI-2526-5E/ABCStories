import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss'
})
export class Privacy implements OnInit {
  // Integrazione del conteggio notifiche non lette per la sincronizzazione olografica della Navbar[cite: 4]
  unreadCount = 0;

  constructor() { }

  ngOnInit(): void {
    // Caricamento dello stato di sicurezza dell'utente autenticato all'attivazione della vista[cite: 6]
    const user = JSON.parse(localStorage.getItem('auth_user') ?? 'null');
    if (user) {
      this.unreadCount = 0;
    }
  }

  // Helper condizionale per determinare la disattivazione temporanea delle categorie legali[cite: 6]
  isFilterDisabled(category: string): boolean {
    return false;
  }
}