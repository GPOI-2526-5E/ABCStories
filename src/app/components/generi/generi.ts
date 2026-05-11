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
    {
      slug: 'cyberpunk',
      nome: 'Cyberpunk',
      descrizione: 'Tecnologia estrema, megacorporazioni e città al neon.',
      imageUrl: 'https://images.unsplash.com/photo-1520034475321-cbe63696469a?w=600&q=80&fit=crop',
      count: '860',
    },
    {
      slug: 'steampunk',
      nome: 'Steampunk',
      descrizione: 'Ingranaggi, vapore e avventure in un passato alternativo.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&q=80&fit=crop',
      count: '410',
    },
    {
      slug: 'noir',
      nome: 'Noir',
      descrizione: 'Città piovose, detective tormentati e criminalità urbana.',
      imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80&fit=crop',
      count: '970',
    },
    {
      slug: 'drammatico',
      nome: 'Drammatico',
      descrizione: 'Conflitti profondi e storie che colpiscono il cuore.',
      imageUrl: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=600&q=80&fit=crop',
      count: '3.240',
    },
    {
      slug: 'comico',
      nome: 'Comico',
      descrizione: 'Ironia, equivoci e risate dalla prima all’ultima pagina.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&fit=crop',
      count: '1.450',
    },
    {
      slug: 'psicologico',
      nome: 'Psicologico',
      descrizione: 'Menti fragili, manipolazioni e tensione interiore.',
      imageUrl: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80&fit=crop',
      count: '1.180',
    },
    {
      slug: 'mitologia',
      nome: 'Mitologia',
      descrizione: 'Dei antichi, eroi immortali e leggende senza tempo.',
      imageUrl: 'https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=600&q=80&fit=crop',
      count: '620',
    },
    {
      slug: 'apocalittico',
      nome: 'Apocalittico',
      descrizione: 'La fine del mondo tra caos, sopravvivenza e speranza.',
      imageUrl: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80&fit=crop',
      count: '740',
    },
    {
      slug: 'urban-fantasy',
      nome: 'Urban Fantasy',
      descrizione: 'Magia nascosta tra le strade delle città moderne.',
      imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80&fit=crop',
      count: '890',
    },
    {
      slug: 'dark-fantasy',
      nome: 'Dark Fantasy',
      descrizione: 'Creature oscure e mondi fantasy pieni di pericoli.',
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=600&q=80&fit=crop',
      count: '1.060',
    },
    {
      slug: 'crime',
      nome: 'Crime',
      descrizione: 'Rapine, mafie e indagini nel lato oscuro della società.',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80&fit=crop',
      count: '1.510',
    },
    {
      slug: 'azione',
      nome: 'Azione',
      descrizione: 'Inseguimenti, combattimenti e adrenalina continua.',
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80&fit=crop',
      count: '2.020',
    },
    {
      slug: 'survival',
      nome: 'Survival',
      descrizione: 'Sfide estreme dove ogni scelta può essere l’ultima.',
      imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80&fit=crop',
      count: '680',
    },
    {
      slug: 'paranormale',
      nome: 'Paranormale',
      descrizione: 'Fantasmi, poteri inspiegabili e fenomeni sovrannaturali.',
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&q=80&fit=crop',
      count: '940',
    },
    {
      slug: 'gotico',
      nome: 'Gotico',
      descrizione: 'Castelli decadenti, oscurità e misteri senza fine.',
      imageUrl: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80&fit=crop',
      count: '530',
    },
    {
      slug: 'fiaba',
      nome: 'Fiaba',
      descrizione: 'Regni incantati, magie antiche e creature leggendarie.',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=600&q=80&fit=crop',
      count: '1.270',
    },
    {
      slug: 'umoristico',
      nome: 'Umoristico',
      descrizione: 'Situazioni assurde e personaggi irresistibilmente buffi.',
      imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80&fit=crop',
      count: '760',
    },
    {
      slug: 'militare',
      nome: 'Militare',
      descrizione: 'Strategie di guerra, soldati e battaglie epiche.',
      imageUrl: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?w=600&q=80&fit=crop',
      count: '590',
    },
    {
      slug: 'slice-of-life',
      nome: 'Slice of Life',
      descrizione: 'Piccoli momenti quotidiani raccontati con autenticità.',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80&fit=crop',
      count: '1.340',
    },
    {
      slug: 'epico',
      nome: 'Epico',
      descrizione: 'Eroi leggendari, guerre immense e destini grandiosi.',
      imageUrl: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=600&q=80&fit=crop',
      count: '2.460',
    },
  ];

  constructor(private router: Router) { }

  goToGenere(slug: string): void {
    this.router.navigate(['/generi', slug]);
  }
}
