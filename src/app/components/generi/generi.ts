import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

export interface Genere {
  slug: string;
  nome: string;
  descrizione: string;
  imageUrl: string;
  count: string;
}

@Component({
  selector: 'app-generi',
  standalone: true,
  imports: [CommonModule, Navbar, Footer],
  templateUrl: './generi.html',
  styleUrls: ['./generi.scss'],
})

export class Generi {

  generi: Genere[] = [
    {
      slug: 'horror',
      nome: 'Horror',
      descrizione: 'Paura, tensione e creature che abitano il buio.',
      imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=600&q=80&fit=crop',
      count: '1.240',
    },
    {
      slug: 'fantasy',
      nome: 'Fantasy',
      descrizione: 'Mondi magici, draghi e mappe che non finiscono mai.',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80&fit=crop',
      count: '3.870',
    },
    {
      slug: 'thriller',
      nome: 'Thriller',
      descrizione: 'Suspense al limite, ogni pagina è un colpo di scena.',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80&fit=crop',
      count: '2.100',
    },
    {
      slug: 'romanzo',
      nome: 'Romanzo',
      descrizione: "Storie d'amore, passioni e cuori spezzati.",
      imageUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80&fit=crop',
      count: '5.600',
    },
    {
      slug: 'fantascienza',
      nome: 'Fantascienza',
      descrizione: 'Galassie lontane, androidi e futuro distopico.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80&fit=crop',
      count: '1.980',
    },
    {
      slug: 'storico',
      nome: 'Storico',
      descrizione: 'Dal passato antico alle grandi guerre moderne.',
      imageUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80&fit=crop',
      count: '870',
    },
    {
      slug: 'western',
      nome: 'Western',
      descrizione: 'Deserti, pistoleri e giustizia fai-da-te.',
      imageUrl: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=600&q=80&fit=crop',
      count: '430',
    },
    {
      slug: 'avventura',
      nome: 'Avventura',
      descrizione: 'Esploratori coraggiosi e missioni impossibili.',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&fit=crop',
      count: '2.340',
    },
    {
      slug: 'biografia',
      nome: 'Biografia',
      descrizione: "Vite straordinarie raccontate dall'interno.",
      imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80&fit=crop',
      count: '310',
    },
    {
      slug: 'giallo',
      nome: 'Giallo',
      descrizione: 'Detective brillanti, indagini oscure e verità nascoste.',
      imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80&fit=crop',
      count: '1.760',
    },
    {
      slug: 'poesia',
      nome: 'Poesia',
      descrizione: 'Versi intensi che trasformano emozioni in parole.',
      imageUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&q=80&fit=crop',
      count: '540',
    },
    {
      slug: 'distopico',
      nome: 'Distopico',
      descrizione: 'Società al collasso, controllo totale e ribellioni silenziose.',
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80&fit=crop',
      count: '920',
    },
    {
      slug: 'young-adult',
      nome: 'Young Adult',
      descrizione: 'Crescita, amicizie e scelte che cambiano tutto.',
      imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80&fit=crop',
      count: '2.780',
    },
    {
      slug: 'mistero',
      nome: 'Mistero',
      descrizione: 'Segreti irrisolti, simboli enigmatici e atmosfere inquietanti.',
      imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80&fit=crop',
      count: '1.120',
    },
  ];

  constructor(private router: Router) {}

  goToGenere(slug: string): void {
    this.router.navigate(['/generi', slug]);
  }
}