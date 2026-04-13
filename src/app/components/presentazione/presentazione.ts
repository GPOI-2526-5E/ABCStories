import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewChild, ElementRef, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Footer } from '../footer/footer';

gsap.registerPlugin(ScrollTrigger);

interface Book {
  title: string;
  genre: string;
  img: string;
}

@Component({
  selector: 'app-presentazione',
  imports: [Navbar, CommonModule, Footer],
  templateUrl: './presentazione.html',
  styleUrl: './presentazione.scss',
})
export class Presentazione implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  @ViewChild('slider') slider!: ElementRef;
  @ViewChild('genreSlider') genreSlider!: ElementRef;
  @HostListener('window:resize')
  onResize() {
    this.checkGenreArrows();
  }

  showLeft = false;
  showRight = true;
  showLeftGenre = false;
  showRightGenre = true;

  // lista di generi disponibili
  genres = [
    'Romance',
    'Horror',
    'Gialli',
    'Western',
    'Fantasy',
    'Avventura',
    'Romance',
    'Horror',
    'Gialli',
    'Western',
    'Fantasy',
    'Avventura',
  ];

  // libro selezionato
  selectedGenre: string = 'Romance';

  books: Book[] = [
    // --- ROMANCE (10) ---
    {
      title: 'Amore a prima vista',
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance1.jpg',
    },
    { title: 'Sotto il sole', genre: 'Romance', img: 'assets/Presentazione/romance/romance2.jpg' },
    { title: 'Sguardi rubati', genre: 'Romance', img: 'assets/Presentazione/romance/romance3.jpg' },
    {
      title: "Promesse d'amore",
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance4.jpg',
    },
    {
      title: 'Cuori intrecciati',
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance5.jpg',
    },
    {
      title: "Lettere d'autunno",
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance6.jpg',
    },
    {
      title: 'Il valzer eterno',
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance7.jpg',
    },
    {
      title: "Oltre l'orizzonte",
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance8.jpg',
    },
    { title: 'Ultimo bacio', genre: 'Romance', img: 'assets/Presentazione/romance/romance9.jpg' },
    {
      title: 'Sogni romantici',
      genre: 'Romance',
      img: 'assets/Presentazione/romance/romance10.jpg',
    },

    // --- HORROR
    { title: "L'incubo", genre: 'Horror', img: 'assets/Presentazione/horror/horror1.jpg' },
    { title: 'Presenze oscure', genre: 'Horror', img: 'assets/Presentazione/horror/horror2.jpg' },
    { title: 'La stanza buia', genre: 'Horror', img: 'assets/Presentazione/horror/horror3.jpg' },
    {
      title: 'Ombre nel corridoio',
      genre: 'Horror',
      img: 'assets/Presentazione/horror/horror4.jpg',
    },
    {
      title: 'Il castello maledetto',
      genre: 'Horror',
      img: 'assets/Presentazione/horror/horror5.jpg',
    },
    { title: 'Sussurri notturni', genre: 'Horror', img: 'assets/Presentazione/horror/horror6.jpg' },
    { title: 'Terrore puro', genre: 'Horror', img: 'assets/Presentazione/horror/horror7.jpg' },
    { title: 'Il risveglio', genre: 'Horror', img: 'assets/Presentazione/horror/horror8.jpg' },
    { title: 'Voci dal passato', genre: 'Horror', img: 'assets/Presentazione/horror/horror9.jpg' },
    {
      title: 'Mezzanotte di paura',
      genre: 'Horror',
      img: 'assets/Presentazione/horror/horror1.jpg',
    },

    // --- GIALLI (10) ---
    { title: 'Indizio fatale', genre: 'Gialli', img: 'assets/Presentazione/gialli.jpg' },
    {
      title: 'Il segreto di Leonardo',
      genre: 'Gialli',
      img: 'assets/Presentazione/codice-da-vinci.jpg',
    },
    { title: "L'enigma sospeso", genre: 'Gialli', img: 'assets/Presentazione/prova3.png' },
    { title: 'Delitto perfetto', genre: 'Gialli', img: 'assets/Presentazione/gialli.jpg' },
    { title: 'Codici nascosti', genre: 'Gialli', img: 'assets/Presentazione/codice-da-vinci.jpg' },
    { title: 'Tracce sulla neve', genre: 'Gialli', img: 'assets/Presentazione/prova3.png' },
    { title: 'Il caso irrisolto', genre: 'Gialli', img: 'assets/Presentazione/gialli.jpg' },
    {
      title: 'Simbologia antica',
      genre: 'Gialli',
      img: 'assets/Presentazione/codice-da-vinci.jpg',
    },
    { title: "L'ispettore indaga", genre: 'Gialli', img: 'assets/Presentazione/prova3.png' },
    { title: 'Mistero a Milano', genre: 'Gialli', img: 'assets/Presentazione/gialli.jpg' },

    // --- WESTERN (10) ---
    { title: 'Il grilletto facile', genre: 'Western', img: 'assets/Presentazione/western.jpg' },
    { title: 'La frontiera', genre: 'Western', img: 'assets/Presentazione/prova.png' },
    { title: 'Pistole fumanti', genre: 'Western', img: 'assets/Presentazione/western.jpg' },
    { title: 'Mezzogiorno di fuoco', genre: 'Western', img: 'assets/Presentazione/prova.png' },
    { title: 'Il duello', genre: 'Western', img: 'assets/Presentazione/western.jpg' },
    { title: 'Terra di nessuno', genre: 'Western', img: 'assets/Presentazione/prova.png' },
    { title: 'Il bounty killer', genre: 'Western', img: 'assets/Presentazione/western.jpg' },
    { title: "Sceriffo d'acciaio", genre: 'Western', img: 'assets/Presentazione/prova.png' },
    { title: 'Orizzonti selvaggi', genre: 'Western', img: 'assets/Presentazione/western.jpg' },
    { title: 'La carovana', genre: 'Western', img: 'assets/Presentazione/prova.png' },

    // --- FANTASY (10) ---
    { title: "Il boccino d'oro", genre: 'Fantasy', img: 'assets/Presentazione/hp1.jpg' },
    { title: 'Cronache del trono', genre: 'Fantasy', img: 'assets/Presentazione/trono-spade.jpg' },
    { title: 'La trasformazione', genre: 'Fantasy', img: 'assets/Presentazione/metamorfosi.jpg' },
    { title: 'Magia bianca', genre: 'Fantasy', img: 'assets/Presentazione/hp1.jpg' },
    { title: 'Inverno in arrivo', genre: 'Fantasy', img: 'assets/Presentazione/trono-spade.jpg' },
    { title: 'Regno incantato', genre: 'Fantasy', img: 'assets/Presentazione/metamorfosi.jpg' },
    { title: 'La scuola di magia', genre: 'Fantasy', img: 'assets/Presentazione/hp1.jpg' },
    { title: 'I sette regni', genre: 'Fantasy', img: 'assets/Presentazione/trono-spade.jpg' },
    { title: 'Ali di drago', genre: 'Fantasy', img: 'assets/Presentazione/hp1.jpg' },
    { title: 'Creature magiche', genre: 'Fantasy', img: 'assets/Presentazione/metamorfosi.jpg' },

    // --- AVVENTURA (10) ---
    { title: 'Arrakis', genre: 'Avventura', img: 'assets/Presentazione/dune.jpg' },
    {
      title: 'Il viaggio di Siddhartha',
      genre: 'Avventura',
      img: 'assets/Presentazione/siddhartha.jpg',
    },
    { title: 'Lungo il cammino', genre: 'Avventura', img: 'assets/Presentazione/la-strada.jpg' },
    { title: 'Deserti infiniti', genre: 'Avventura', img: 'assets/Presentazione/dune.jpg' },
    {
      title: 'La ricerca interiore',
      genre: 'Avventura',
      img: 'assets/Presentazione/siddhartha.jpg',
    },
    { title: 'Oltre i confini', genre: 'Avventura', img: 'assets/Presentazione/la-strada.jpg' },
    { title: 'Pianeta sabbioso', genre: 'Avventura', img: 'assets/Presentazione/dune.jpg' },
    { title: 'Fiumi lontani', genre: 'Avventura', img: 'assets/Presentazione/siddhartha.jpg' },
    { title: 'Passi nel vuoto', genre: 'Avventura', img: 'assets/Presentazione/la-strada.jpg' },
    { title: "L'esploratore", genre: 'Avventura', img: 'assets/Presentazione/dune.jpg' },
  ];

  get filteredBooks(): Book[] {
    return this.books.filter((book) => book.genre === this.selectedGenre);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.checkArrows();
      this.checkGenreArrows();
    }, 0);

    if (!isPlatformBrowser(this.platformId)) return;

    // animazione iniziale del primo div
    const tl = gsap.timeline({delay: 1.0});

    /*tl.to('.fade-bg', {
      opacity: 1,
      scale: 1,
      duration: 1.2, 
      ease: 'power3.out',
    });*/

    tl.from(
      '.fade-item',
      {
        y: 60,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.9, 
        ease: 'power3.out',
        stagger: 0.18, 
      },
      '-=0.6',
    );

    gsap.set('.fade-button', { scale: 0.8, opacity: 0 });

    tl.to(
      '.fade-button',
      {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
      },
      '-=0.4',
    );

    ScrollTrigger.create({
      trigger: '.cont1-2',
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.create({
      trigger: '.cont1-3',
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    const revealSections = gsap.utils.toArray<HTMLElement>('.reveal-section');

    revealSections.forEach((section, index) => {
      const items = section.querySelectorAll('.reveal-item');
      const button = section.querySelector('.reveal-button');

      const direction = index % 2 === 0 ? -80 : 80;

      gsap.set(items, {
        opacity: 0,
        x: direction,
        y: 40,
        filter: 'blur(10px)',
      });

      if (button) {
        gsap.set(button, {
          opacity: 0,
          scale: 0.85,
          y: 30,
        });
      }

      const tlSection = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });

      tlSection.to(items, {
        opacity: 1,
        x: 0,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8, 
        ease: 'power3.out',
        stagger: 0.12,
      });

      if (button) {
        tlSection.to(
          button,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.4',
        );
      }
    });

    // ANIMAZIONE CONT1-3
    const genreSection = document.querySelector('.cont1-3');

    if (genreSection) {
      const genreElements = genreSection.querySelectorAll('.genre-reveal');
      const genreCards = genreSection.querySelectorAll('.genre-card');

      gsap.set(genreElements, {
        opacity: 0,
        y: 60,
        filter: 'blur(8px)',
      });

      gsap.set(genreCards, {
        opacity: 0,
        y: 50,
        scale: 0.92,
      });

      const tlGenres = gsap.timeline({
        scrollTrigger: {
          trigger: genreSection,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      tlGenres.to(genreElements, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.14,
      });

      tlGenres.to(
        genreCards,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.07,
        },
        '-=0.4',
      );
    }

    // ANIMAZIONE CONT2
    gsap.set('.main-title', { opacity: 0, y: 60, filter: 'blur(8px)' });
    gsap.to('.main-title', {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 1.0, 
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.main-title',
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    // ANIMAZIONE CONT2 - CARD GUADAGNO / SUPPORTO
    const sections = gsap.utils.toArray<HTMLElement>('.sectionCard');

    sections.forEach((section, index) => {
      const card = section.querySelector('.contDivCard');
      const cardItems = section.querySelectorAll('.gain-card-item');
      const image = section.querySelector('.gain-image');

      if (!card || !image) return;

      const direction = index % 2 === 0 ? -90 : 90;
      const imageDirection = index % 2 === 0 ? 110 : -110;

      gsap.set(card, {
        opacity: 0,
        x: direction,
        y: 40,
        scale: 0.96,
      });

      gsap.set(cardItems, {
        opacity: 0,
        y: 25,
        filter: 'blur(8px)',
      });

      gsap.set(image, {
        opacity: 0,
        x: imageDirection,
        y: 35,
        scale: 1.04,
        rotate: index % 2 === 0 ? 1.5 : -1.5,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          end: 'top 35%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.to(card, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
      });

      tl.to(
        cardItems,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.12,
        },
        '-=0.5',
      );

      tl.to(
        image,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.85,
          ease: 'power3.out',
        },
        '-=0.6',
      );
    });

    ScrollTrigger.create({
      trigger: '.cont1-4',
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    // ANIMAZIONE CONT5
    const communityIntro = document.querySelector('.community-intro');

    if (communityIntro) {
      const introItems = communityIntro.querySelectorAll('.community-intro-item');
      const introButton = communityIntro.querySelector('.community-intro-button');

      gsap.set(introItems, {
        opacity: 0,
        y: 50,
        filter: 'blur(10px)',
      });

      if (introButton) {
        gsap.set(introButton, {
          opacity: 0,
          y: 30,
          scale: 0.9,
        });
      }

      const tlCommunityIntro = gsap.timeline({
        scrollTrigger: {
          trigger: communityIntro,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tlCommunityIntro.to(introItems, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
      });

      if (introButton) {
        tlCommunityIntro.to(
          introButton,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'back.out(1.7)',
          },
          '-=0.4',
        );
      }
    }

    const communityTitle = document.querySelector('.community-main-title');

    if (communityTitle) {
      gsap.set(communityTitle, {
        opacity: 0,
        y: 60,
        filter: 'blur(8px)',
      });

      gsap.to(communityTitle, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: communityTitle,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });
    }

    const communityCards = gsap.utils.toArray<HTMLElement>('.community-card');

    communityCards.forEach((card, index) => {
      const items = card.querySelectorAll('.community-card-item');
      const direction = index % 2 === 0 ? -90 : 90;

      gsap.set(card, {
        opacity: 0,
        x: direction,
        y: 40,
        scale: 0.96,
      });

      gsap.set(items, {
        opacity: 0,
        y: 25,
        filter: 'blur(8px)',
      });

      const tlCard = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          end: 'top 40%',
          toggleActions: 'play none none reverse',
        },
      });

      tlCard.to(card, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.75,
        ease: 'power3.out',
      });

      tlCard.to(
        items,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.12,
        },
        '-=0.5',
      );
    });

    const familySection = document.querySelector('.family-section');

    if (familySection) {
      const familyItems = familySection.querySelectorAll('.family-item');
      const familyButton = familySection.querySelector('.family-button');

      gsap.set(familyItems, {
        opacity: 0,
        y: 65,
        filter: 'blur(10px)',
      });

      if (familyButton) {
        gsap.set(familyButton, {
          opacity: 0,
          y: 30,
          scale: 0.88,
        });
      }

      const tlFamily = gsap.timeline({
        scrollTrigger: {
          trigger: familySection,
          start: 'top 75%',
          end: 'top 35%',
          toggleActions: 'play none none reverse',
        },
      });

      tlFamily.to(familyItems, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.16,
      });

      if (familyButton) {
        tlFamily.to(
          familyButton,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.7)',
          },
          '-=0.4',
        );
      }
    }

    ScrollTrigger.create({
      trigger: '.cont1',
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: false,
    });

    ScrollTrigger.refresh();
  }

  scrollLeft() {
    const el = this.slider.nativeElement;
    el.scrollBy({ left: -400, behavior: 'smooth' });
    setTimeout(() => this.checkArrows(), 300);
  }

  scrollRight() {
    const el = this.slider.nativeElement;
    el.scrollBy({ left: 400, behavior: 'smooth' });
    setTimeout(() => this.checkArrows(), 300);
  }

  checkArrows() {
    const el = this.slider.nativeElement;
    const maxScroll = el.scrollWidth - el.clientWidth;

    this.showLeft = el.scrollLeft > 10;
    this.showRight = el.scrollLeft < maxScroll - 10;
  }

  selectGenre(genre: string) {
    this.selectedGenre = genre;

    // reset scroll a sinistra
    this.slider.nativeElement.scrollLeft = 0;

    // aggiornamento frecce
    setTimeout(() => this.checkArrows());
  }

  scrollGenresLeft() {
    this.genreSlider.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  }

  scrollGenresRight() {
    this.genreSlider.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  }

  checkGenreArrows() {
    const el = this.genreSlider.nativeElement;
    const maxScroll = el.scrollWidth - el.clientWidth;
    this.showLeftGenre = el.scrollLeft > 5;
    this.showRightGenre = el.scrollLeft < el.scrollWidth - el.clientWidth - 5;
  }
}
