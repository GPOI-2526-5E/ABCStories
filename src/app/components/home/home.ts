import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ChangeDetectorRef, OnInit, HostListener, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookSlider } from '../book-slider/book-slider';
import { Footer } from "../footer/footer";
import { Router } from '@angular/router';

interface Genre {
  name: string;
  img: string;
  wide?: boolean;
}

export interface TalentBook {
  tag: string;
  title: string;
  desc: string;
  img: string;
}

export interface Artist {
  name: string;
  followers: string;
  img: string;
}

@Component({
  selector: 'app-home',
  imports: [Navbar, BookSlider, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})

export class Home implements AfterViewInit, OnDestroy {
  private slides: NodeListOf<HTMLElement> = {} as NodeListOf<HTMLElement>;
  private prevBtn: HTMLButtonElement | null = null;
  private nextBtn: HTMLButtonElement | null = null;
  private dotsContainer: HTMLDivElement | null = null;
  private ambientBg: HTMLDivElement | null = null;
  private dots: HTMLElement[] = [];

  // Touch swipe
  private touchStartX = 0;
  private touchStartY = 0;
  private touchStartTime = 0;
  private isTouchSwiping = false;
  private readonly swipeThreshold = 40;
  private readonly swipeTimeLimit = 400;

  public slidesCount: number = 0;
  public current = 0;
  private interval: ReturnType<typeof setInterval> | null = null;
  private readonly autoplayDelay = 7000;

  public rankingIndex = 0;
  public readonly totalRankingItems = 12;
  public readonly visibleCards = 5;

  public currentBgImage: string = '';
  private intervalId: any = null;

  booksA = [
    { id: 1, title: 'Il Nome della Rosa', author: 'U. Eco', desc: 'Un monaco francescano indaga su una serie di morti misteriose in un monastero medievale, tra labirinti di libri e segreti inconfessabili.', img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80', liked: false, bookmarked: false },
    { id: 2, title: "L'Alchimista", author: 'P. Coelho', desc: 'Un giovane pastore spagnolo intraprende un viaggio verso le piramidi d\'Egitto seguendo un sogno ricorrente e imparando a leggere i segni del destino.', img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&q=80', liked: false, bookmarked: false },
    { id: 3, title: 'Cime Tempestose', author: 'E. Brontë', desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.', img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=320&q=80', liked: false, bookmarked: false },
    { id: 4, title: 'Orgoglio e Pregiudizio', author: 'J. Austen', desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.', img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=320&q=80', liked: false, bookmarked: false },
    { id: 5, title: 'Il Grande Gatsby', author: 'F.S. Fitzgerald', desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.', img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=320&q=80', liked: false, bookmarked: false },
    { id: 6, title: 'Delitto e Castigo', author: 'F. Dostoevskij', desc: 'Raskolnikov, uno studente in miseria, commette un omicidio convinto di essere al di sopra della legge morale. Ma la coscienza non perdona.', img: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=320&q=80', liked: false, bookmarked: false },
    { id: 7, title: 'Don Chisciotte', author: 'M. de Cervantes', desc: 'Un nobiluomo spagnolo, ossessionato dai romanzi cavallereschi, si convince di essere un cavaliere errante e parte per avventure immaginarie con il fedele Sancho Panza.', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80', liked: false, bookmarked: false },
    { id: 8, title: 'Anna Karenina', author: 'L. Tolstoy', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
    { id: 9, title: 'Anna Karenina', author: 'L. Tolstoy', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80', liked: false, bookmarked: false },
  ];

  booksB = [
    { id: 10, title: 'Cento anni di solitudine', author: 'G.G. Márquez', desc: 'La saga della famiglia Buendía attraverso sette generazioni nella città immaginaria di Macondo, tra magia e tragedia, amore e guerra.', img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&q=80', liked: false, bookmarked: false },
    { id: 11, title: 'La Metamorfosi', author: 'F. Kafka', desc: 'Gregor Samsa si sveglia una mattina trasformato in un enorme insetto. Un racconto sull\'alienazione, la famiglia e l\'identità perduta.', img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&q=80', liked: false, bookmarked: false },
    { id: 12, title: 'Il Processo', author: 'F. Kafka', desc: 'Josef K. viene arrestato senza sapere il perché e si trova intrappolato in un sistema giudiziario assurdo e kafkiano da cui non riesce a sfuggire.', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=320&q=80', liked: false, bookmarked: false },
    { id: 13, title: 'Lolita', author: 'V. Nabokov', desc: 'Il professor Humbert Humbert racconta la sua ossessione per la dodicenne Dolores Haze, in uno dei romanzi più controversi e stilisticamente brillanti del Novecento.', img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=320&q=80', liked: false, bookmarked: false },
    { id: 14, title: 'Il Signore degli Anelli', author: 'J.R.R. Tolkien', desc: 'Frodo Baggins intraprende un viaggio epico per distruggere l\'Unico Anello e salvare la Terra di Mezzo dal dominio del Signore Oscuro Sauron.', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=80', liked: false, bookmarked: false },
    { id: 15, title: '1984', author: 'G. Orwell', desc: 'In uno Stato totalitario dove il Grande Fratello sorveglia ogni pensiero, Winston Smith osa sognare la libertà in un mondo dove la verità è un crimine.', img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80', liked: false, bookmarked: false },
    { id: 16, title: 'Siddharta', author: 'H. Hesse', desc: 'Il giovane Siddharta abbandona ogni privilegio per cercare l\'illuminazione spirituale in un viaggio interiore attraverso l\'India antica.', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80', liked: false, bookmarked: false },
    { id: 17, title: 'Il Conte di Montecristo', author: 'A. Dumas', desc: 'Edmond Dantès, ingiustamente imprigionato, evade e costruisce una nuova identità per portare a termine una vendetta meticolosa contro chi lo ha tradito.', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80', liked: false, bookmarked: false },
    { id: 18, title: 'Sherlock Holmes', author: 'A.C. Doyle', desc: 'Il geniale detective Sherlock Holmes e il fedele dottor Watson risolvono i casi più intricati di Londra con deduzione infallibile e mente sopraffina.', img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80', liked: false, bookmarked: false },
    { id: 19, title: '1984', author: 'G. Orwell', desc: 'In uno Stato totalitario dove il Grande Fratello sorveglia ogni pensiero, Winston Smith osa sognare la libertà in un mondo dove la verità è un crimine.', img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80', liked: false, bookmarked: false },
    { id: 20, title: 'Il Vecchio e il Mare', author: 'E. Hemingway', desc: 'Santiago, un vecchio pescatore cubano, affronta per giorni e notti un enorme marlin nell\'oceano in una lotta che diventa metafora della condizione umana.', img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=320&q=80', liked: false, bookmarked: false },
    { id: 21, title: 'Siddharta', author: 'H. Hesse', desc: 'Il giovane Siddharta abbandona ogni privilegio per cercare l\'illuminazione spirituale in un viaggio interiore attraverso l\'India antica.', img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80', liked: false, bookmarked: false },
    { id: 22, title: 'Il Conte di Montecristo', author: 'A. Dumas', desc: 'Edmond Dantès, ingiustamente imprigionato, evade e costruisce una nuova identità per portare a termine una vendetta meticolosa contro chi lo ha tradito.', img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80', liked: false, bookmarked: false },
    { id: 23, title: 'Sherlock Holmes', author: 'A.C. Doyle', desc: 'Il geniale detective Sherlock Holmes e il fedele dottor Watson risolvono i casi più intricati di Londra con deduzione infallibile e mente sopraffina.', img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80', liked: false, bookmarked: false },
  ];

  booksC = [
    { id: 24, title: 'Dracula', author: 'Bram Stoker', desc: 'Il conte Dracula, vampiro immortale della Transilvania, minaccia l\'Inghilterra vittoriana. Un gruppo di coraggiosi si unisce per fermarlo prima che sia troppo tardi.', img: '/assets/Presentazione/horror/horror1.jpg', liked: false, bookmarked: false },
    { id: 25, title: 'Shining', author: 'Stephen King', desc: 'Jack Torrance porta la famiglia all\'Overlook Hotel per la stagione invernale. Isolati dalla neve, forze oscure iniziano a far cedere la sua mente.', img: '/assets/Presentazione/horror/horror2.jpg', liked: false, bookmarked: false },
    { id: 26, title: "L'Esorcista", author: 'William P. Blatty', desc: 'La dodicenne Regan inizia a manifestare comportamenti inspiegabili. Sua madre, disperata, si rivolge a un prete esorcista per salvare l\'anima di sua figlia.', img: '/assets/Presentazione/horror/horror3.jpg', liked: false, bookmarked: false },
    { id: 27, title: 'It', author: 'Stephen King', desc: 'Nel Maine una creatura millenaria, che si manifesta come Pennywise il clown, terrorizza la città di Derry nutrendosi della paura dei bambini.', img: '/assets/Presentazione/horror/horror4.jpg', liked: false, bookmarked: false },
    { id: 28, title: 'Frankenstein', author: 'Mary Shelley', desc: 'Lo scienziato Victor Frankenstein crea vita da resti umani, ma la creatura che nasce è condannata a vagare sola in un mondo che la rifiuta con orrore.', img: '/assets/Presentazione/horror/horror5.jpg', liked: false, bookmarked: false },
    { id: 29, title: 'Il Silenzio degli Innocenti', author: 'Thomas Harris', desc: 'L\'agente dell\'FBI Clarice Starling deve chiedere aiuto al geniale e terrificante dottor Hannibal Lecter per catturare un serial killer in libertà.', img: '/assets/Presentazione/horror/horror6.jpg', liked: false, bookmarked: false },
    { id: 30, title: 'Pet Sematary', author: 'Stephen King', desc: 'La famiglia Creed scopre un antico cimitero indiano con il potere di riportare in vita i morti. Ma ciò che ritorna non è mai lo stesso di prima.', img: '/assets/Presentazione/horror/horror7.jpg', liked: false, bookmarked: false },
    { id: 31, title: 'Cujo', author: 'Stephen King', desc: 'Un San Bernardo amichevole viene morso da un pipistrello rabbioso e si trasforma in una macchina da uccidere che intrappolerà una madre e suo figlio.', img: '/assets/Presentazione/horror/horror8.jpg', liked: false, bookmarked: false },
    { id: 32, title: 'The Ring', author: 'Koji Suzuki', desc: 'Dopo aver visionato una misteriosa videocassetta, una giornalista riceve una telefonata: morirà tra sette giorni. Inizia una corsa contro il tempo.', img: '/assets/Presentazione/horror/horror9.jpg', liked: false, bookmarked: false },
    { id: 33, title: 'Psico', author: 'Robert Bloch', desc: 'Marion Crane si ferma al Bates Motel gestito dal timido Norman Bates e dalla sua possessiva madre. Una sosta che cambierà tutto per sempre.', img: '/assets/Presentazione/horror/horror10.jpg', liked: false, bookmarked: false },
  ];

  booksD = [
    { id: 34, title: 'Orgoglio e Pregiudizio', author: 'Jane Austen', desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { id: 35, title: 'Il Grande Gatsby', author: 'F. Scott Fitzgerald', desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { id: 36, title: 'Romeo e Giulietta', author: 'William Shakespeare', desc: 'Due giovani di famiglie nemiche si innamorano perdutamente a Verona. Una storia d\'amore immortale destinata a una fine tragica.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { id: 37, title: 'Cime Tempestose', author: 'Emily Brontë', desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { id: 38, title: 'Jane Eyre', author: 'Charlotte Brontë', desc: 'Jane, orfana e determinata, trova lavoro come istitutrice a Thornfield Hall dove si innamora del misterioso Mr. Rochester, nascondendo un segreto oscuro.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
    { id: 39, title: 'Io prima di te', author: 'Jojo Moyes', desc: 'Louisa Clark diventa la badante di Will Traynor, giovane ricco rimasto tetraplegico. Tra loro nasce un legame profondo che cambierà entrambi per sempre.', img: '/assets/Presentazione/romance/romance6.jpg', liked: false, bookmarked: false },
    { id: 40, title: 'Le pagine della nostra vita', author: 'Nicholas Sparks', desc: 'Noah e Allie si innamorano nell\'estate del 1940 ma la guerra e le differenze sociali li separano. Decenni dopo, il loro amore viene riletto da un vecchio quaderno.', img: '/assets/Presentazione/romance/romance7.jpg', liked: false, bookmarked: false },
    { id: 41, title: 'Colpa delle stelle', author: 'John Green', desc: 'Hazel e Augustus si incontrano a un gruppo di supporto per malati di cancro. Insieme affrontano la vita con ironia e coraggio, innamorandosi perdutamente.', img: '/assets/Presentazione/romance/romance8.jpg', liked: false, bookmarked: false },
    { id: 42, title: 'Chiamami col tuo nome', author: 'André Aciman', desc: 'Nell\'estate del 1983 in Italia, il diciassettenne Elio si innamora di Oliver, il dottorando ospite di suo padre, in un\'estate che non dimenticherà mai.', img: '/assets/Presentazione/romance/romance9.jpg', liked: false, bookmarked: false },
    { id: 43, title: 'Anna Karenina', author: 'Lev Tolstoj', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', img: '/assets/Presentazione/romance/romance10.jpg', liked: false, bookmarked: false },
    { id: 44, title: 'Persuasione', author: 'Jane Austen', desc: 'Anne Elliot rincontra il capitano Wentworth, l\'uomo che aveva rifiutato anni prima su consiglio altrui. È ancora possibile una seconda possibilità?', img: '/assets/Presentazione/romance/romance1.jpg', liked: false, bookmarked: false },
    { id: 45, title: 'Ragione e Sentimento', author: 'Jane Austen', desc: 'Le sorelle Elinor e Marianne Dashwood affrontano l\'amore in modi opposti: una con razionale compostezza, l\'altra con passione travolgente.', img: '/assets/Presentazione/romance/romance2.jpg', liked: false, bookmarked: false },
    { id: 46, title: 'Un amore senza fine', author: 'Scott Spencer', desc: 'David è ossessionato da Jade, la ragazza di cui si è innamorato. Una storia d\'amore adolescenziale che diventa qualcosa di pericoloso e incontrollabile.', img: '/assets/Presentazione/romance/romance3.jpg', liked: false, bookmarked: false },
    { id: 47, title: 'Emma', author: 'Jane Austen', desc: 'Emma Woodhouse, bella e ricca, si crede un\'abile mediatrice sentimentale. Ma nel combinare matrimoni per gli altri rischia di perdere il suo stesso amore.', img: '/assets/Presentazione/romance/romance4.jpg', liked: false, bookmarked: false },
    { id: 48, title: 'La signora delle camelie', author: 'Alexandre Dumas', desc: 'Margherita Gautier, celebre cortigiana parigina, si innamora sinceramente di Armand Duval in una storia d\'amore condannata dalla società e dalla malattia.', img: '/assets/Presentazione/romance/romance5.jpg', liked: false, bookmarked: false },
  ];

  @Input() books: TalentBook[] = [
    {
      tag: 'Fantasy',
      title: 'Le Radici del Cielo',
      desc: 'Una giovane maga scopre che il suo potere è legato a un\'antica profezia che potrebbe cambiare il destino del regno.',
      img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    },
    {
      tag: 'Romance',
      title: 'Sotto lo Stesso Cielo',
      desc: 'Due anime che si cercano tra continenti diversi, unite da lettere scritte in un\'estate che nessuno dimenticherà.',
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80',
    },
    {
      tag: 'Thriller',
      title: 'Ombre nel Buio',
      desc: 'Un detective scopre che il caso più oscuro della sua carriera lo riporta a una notte che credeva di aver dimenticato.',
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
    {
      tag: 'Avventura',
      title: 'Il Confine del Mondo',
      desc: 'Tre ragazzi partono per un viaggio che li porterà oltre i confini di ciò che credevano possibile.',
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
    },
    {
      tag: 'Horror',
      title: 'La Casa dei Sussurri',
      desc: 'Una famiglia si trasferisce in una villa isolata. I muri parlano — e quello che dicono fa paura.',
      img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=600&q=80',
    },
    {
      tag: 'Fantascienza',
      title: 'Oltre le Stelle',
      desc: 'Un astronauta solitario riceve un segnale dall\'altra parte della galassia. Non è solo.',
      img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
    },
    {
      tag: 'Storico',
      title: 'Il Sangue dei Re',
      desc: 'Nella Roma del 50 a.C., uno schiavo scopre di essere l\'erede di un\'antica casata.',
      img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80',
    },
  ];

  @Output() bookSelected = new EventEmitter<TalentBook>();
  @Output() readClicked = new EventEmitter<TalentBook>();

  @ViewChild('sliderOuter') sliderOuter!: ElementRef;

  scroll(direction: 1 | -1) {
    const cardWidth = 170 + 12; // width + gap
    this.sliderOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth'
    });
  }

  onMouseWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.sliderOuter.nativeElement.scrollBy({
      left: event.deltaX * 2,
      behavior: 'smooth'
    });
  }

  @ViewChild('artistsOuter') artistsOuter!: ElementRef;

  scrollArtists(direction: 1 | -1) {
    const cardWidth = 130 + 22;
    this.artistsOuter.nativeElement.scrollBy({
      left: direction * cardWidth * 3,
      behavior: 'smooth' // smooth solo per i bottoni
    });
  }

  onArtistsWheel(event: WheelEvent) {
    const isHorizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
    if (!isHorizontal) return;
    event.preventDefault();
    this.artistsOuter.nativeElement.scrollLeft += event.deltaX * 1.2; // niente smooth, diretto
  }

  onBookClick(book: TalentBook) {
    this.bookSelected.emit(book);
  }

  onReadClick(book: TalentBook) {
    this.readClicked.emit(book);
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { this.slidesCount = this.books.length; }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.preloadImages();
      //this.initFooterReveal();
      this.startAutoSlide();
      this.updateAmbientBackground();

      ScrollTrigger.refresh();
    }
  }

  private preloadImages(): void {
    this.books.forEach(book => {
      const img = new Image();
      img.src = book.img;
      // La proprietà decode() è magica: decodifica l'immagine in background
      // senza bloccare il thread principale (niente calo di frame!)
      img.decode().then(() => {
        console.log(`Immagine decodificata: ${book.title}`);
      }).catch((encodingError) => {
        // Immagine non ancora pronta, non bloccare nulla
      });
    });
  }

  /*private initFooterReveal(): void {
    ScrollTrigger.create({
      trigger: ".divStart",
      start: "bottom bottom",
      pin: true,
      pinSpacing: false,
    });
  }*/

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  @ViewChild('rankTrack') rankTrack!: ElementRef;

  scrollRank(direction: 1 | -1) {
    const outer = this.rankTrack.nativeElement.parentElement; // rank-scroll-outer
    const cardWidth = 185 + 24;
    outer.scrollBy({ left: direction * cardWidth * 3, behavior: 'smooth' });
  }

  // Artisti
  @Input() artists: Artist[] = [
    { name: 'Elena Marino', followers: '12.4k', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80' },
    { name: 'Marco Bianchi', followers: '8.1k', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
    { name: 'Sofia Ricci', followers: '21k', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80' },
    { name: 'Luca Ferrari', followers: '5.3k', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80' },
    { name: 'Anna Conti', followers: '33k', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&q=80' },
    { name: 'Giorgio Greco', followers: '9.8k', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80' },
    { name: 'Chiara Esposito', followers: '15k', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' },
    { name: 'Davide Romano', followers: '7.2k', img: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80' },
    { name: 'Giulia Mancini', followers: '18k', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
    { name: 'Paolo Barbieri', followers: '4.5k', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
    { name: 'Giulia Mancini', followers: '18k', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80' },
    { name: 'Paolo Barbieri', followers: '4.5k', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80' },
  ];
  @Output() artistSelected = new EventEmitter<Artist>();

  onArtistClick(artist: Artist) {
    this.artistSelected.emit(artist);
  }

  private initSlider(): void {
    this.slides = document.querySelectorAll<HTMLElement>('.slide');
    this.slidesCount = this.slides.length;
    this.prevBtn = document.querySelector<HTMLButtonElement>('.prev');
    this.nextBtn = document.querySelector<HTMLButtonElement>('.next');
    this.ambientBg = document.querySelector<HTMLDivElement>('.ambient-bg');

    this.addEventListeners();
    this.updateSlides();
    this.startAutoSlide();
    this.cdr.detectChanges();
  }

  private addEventListeners(): void {
    this.nextBtn?.addEventListener('click', () => {
      this.nextSlide();
      this.restartAutoSlide();
    });

    this.prevBtn?.addEventListener('click', () => {
      this.prevSlide();
      this.restartAutoSlide();
    });

    const slider = document.querySelector<HTMLElement>('.hero-slider');

    if (slider) {
      slider.addEventListener('mouseenter', () => this.stopAutoSlide());
      slider.addEventListener('mouseleave', () => this.startAutoSlide());
    }
  }

  private updateSlides(): void {
    const total = this.slidesCount;
    if (total === 0) return;

    this.slides.forEach((slide: HTMLElement, index: number) => {
      slide.classList.remove('active', 'prev-slide', 'next-slide');
      if (index === this.current) {
        slide.classList.add('active');
      } else if (index === (this.current - 1 + total) % total) {
        slide.classList.add('prev-slide');
      } else if (index === (this.current + 1) % total) {
        slide.classList.add('next-slide');
      }
    });

    this.updateAmbientBackground();
    this.cdr.detectChanges();
  }

  private updateAmbientBackground(): void {
    // Invece di manipolare il DOM, aggiorniamo una variabile legata al template
    const newBg = this.books[this.current]?.img;
    if (newBg) {
      this.currentBgImage = newBg;
    }
    this.cdr.markForCheck();
    // Oppure, se non basta:
    this.cdr.detectChanges();
  }

  public goToSlide(index: number): void {
    this.current = index;
    this.updateAmbientBackground();
  }

  public nextSlide(event?: Event): void {
    // Se c'è un evento (cioè l'utente ha cliccato), blocchiamo propagazioni indesiderate
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.current = (this.current + 1) % this.slidesCount;
    this.updateAmbientBackground();

    // Riavvia l'autoplay solo se l'azione è manuale (click dell'utente)
    if (event) {
      this.restartAutoSlide();
    }
  }

  public prevSlide(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.current = (this.current - 1 + this.slidesCount) % this.slidesCount;
    this.updateAmbientBackground();

    if (event) {
      this.restartAutoSlide();
    }
  }

  public startAutoSlide(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.stopAutoSlide(); // FONDAMENTALE: uccide sempre il timer vecchio prima di crearne uno nuovo

      this.intervalId = setInterval(() => {
        this.nextSlide(); // Chiamato senza evento, così non va in loop continuo
      }, this.autoplayDelay);
    }
  }

  public stopAutoSlide(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public restartAutoSlide(): void {
    this.stopAutoSlide();
    this.startAutoSlide();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.touchStartTime = Date.now();
    this.isTouchSwiping = false;
    this.stopAutoSlide();
  }

  onTouchMove(event: TouchEvent): void {
    const deltaX = Math.abs(event.touches[0].clientX - this.touchStartX);
    const deltaY = Math.abs(event.touches[0].clientY - this.touchStartY);

    // Se il gesto è orizzontale, previeni lo scroll verticale
    if (deltaX > deltaY && deltaX > 8) {
      this.isTouchSwiping = true;
      event.preventDefault();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const elapsed = Date.now() - this.touchStartTime;

    if (this.isTouchSwiping && Math.abs(deltaX) > this.swipeThreshold && elapsed < this.swipeTimeLimit) {
      if (deltaX < 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }

    this.restartAutoSlide();
    this.isTouchSwiping = false;
  }

  onTouchCancel(): void {
    this.isTouchSwiping = false;
    this.restartAutoSlide();
  }

  nextRanking() {
    const max = this.totalRankingItems - this.visibleCards;
    if (this.rankingIndex < max) {
      this.rankingIndex++;
    }
  }

  prevRanking() {
    if (this.rankingIndex > 0) {
      this.rankingIndex--;
    }
  }

  @Output() genreSelected = new EventEmitter<string>();

  genres: Genre[] = [
    { name: 'Romanzo', img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=70', wide: true },
    { name: 'Fantasy', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=70' },
    { name: 'Thriller', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=70' },
    { name: 'Horror', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&q=70' },
    { name: 'Fantascienza', img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=70' },
    { name: 'Avventura', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=70', wide: true },
    { name: 'Giallo', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=70', wide: true },
    { name: 'Young Adult', img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&q=70' },
    { name: 'Storico', img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=70' },
  ];

  onGenreClick(genre: Genre) {
    this.genreSelected.emit(genre.name);
    this.router.navigate(['/generi', genre.name.toLowerCase()]);
  }
}
