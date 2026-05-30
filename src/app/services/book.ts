import { Injectable } from '@angular/core';
import { BOOK_UUID_MAP } from './book-uuid-map';

export interface Book {
  id: string | number;
  title: string;
  author: string;
  img: string;
  // interazioni
  bookmarked: boolean;
  liked: boolean;
  // dettagli libro
  desc: string;
  genre: string;
  pages: number;
  year: number;
  tag: string;
  // statistiche
  rating: number;
  readers: string;
  chaptersCount: number;
}

@Injectable({ providedIn: 'root' })
export class BookService {

  constructor() {
    this.initBookUuids();
  }

  private initBookUuids() {
    for (const key of Object.keys(this.books)) {
      this.books[key] = this.books[key].map(book => {
        const uuid = BOOK_UUID_MAP[book.title.toLowerCase().trim()];
        if (uuid) {
          book.id = uuid;
        }
        return book;
      });
    }
  }


  private books: Record<string, Book[]> = {
    booksA: [{
      id: 1, title: 'Il Nome della Rosa', author: 'U. Eco',
      desc: 'Un monaco francescano indaga su una serie di morti misteriose in un monastero medievale, tra labirinti di libri e segreti inconfessabili.',
      genre: 'Giallo Storico', pages: 512, year: 1980, tag: 'Medioevo', rating: 4.8, readers: '2.1M', chaptersCount: 7, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80'
    },
    {
      id: 2, title: "L'Alchimista", author: 'P. Coelho',
      desc: 'Un giovane pastore spagnolo intraprende un viaggio verso le piramidi d\'Egitto seguendo un sogno ricorrente e imparando a leggere i segni del destino.',
      genre: 'Filosofico', pages: 208, year: 1988, tag: 'Destino', rating: 4.4, readers: '65M', chaptersCount: 2, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=320&q=80'
    },
    {
      id: 3, title: 'Cime Tempestose', author: 'E. Brontë',
      desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.',
      genre: 'Classico', pages: 400, year: 1847, tag: 'Passione', rating: 4.6, readers: '4.5M', chaptersCount: 34, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=320&q=80'
    },
    {
      id: 4, title: 'Orgoglio e Pregiudizio', author: 'J. Austen',
      desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.',
      genre: 'Classico', pages: 432, year: 1813, tag: 'Regency', rating: 4.9, readers: '8M', chaptersCount: 61, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=320&q=80'
    },
    {
      id: 5, title: 'Il Grande Gatsby', author: 'F.S. Fitzgerald',
      desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.',
      genre: 'Classico', pages: 180, year: 1925, tag: 'Jazz Age', rating: 4.5, readers: '5.2M', chaptersCount: 9, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=320&q=80'
    },
    {
      id: 6, title: 'Delitto e Castigo', author: 'F. Dostoevskij',
      desc: 'Raskolnikov, uno studente in miseria, commette un omicidio convinto di essere al di sopra della legge morale. Ma la coscienza non perdona.',
      genre: 'Letteratura Russa', pages: 650, year: 1866, tag: 'Morale', rating: 4.9, readers: '3.8M', chaptersCount: 40, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=320&q=80'
    },
    {
      id: 7, title: 'Don Chisciotte', author: 'M. de Cervantes',
      desc: 'Un nobiluomo spagnolo, ossessionato dai romanzi cavallereschi, si convince di essere un cavaliere errante e parte per avventure immaginarie con il fedele Sancho Panza.',
      genre: 'Classico', pages: 1100, year: 1605, tag: 'Follia', rating: 4.7, readers: '10M', chaptersCount: 126, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=320&q=80'
    },
    {
      id: 8, title: 'Anna Karenina', author: 'L. Tolstoy',
      desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.',
      genre: 'Letteratura Russa', pages: 864, year: 1877, tag: 'Tragedia', rating: 4.8, readers: '4.1M', chaptersCount: 239, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80'
    },
    {
      id: 9, title: 'Anna Karenina', author: 'L. Tolstoy', // (Duplicato come richiesto)
      desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.',
      genre: 'Letteratura Russa', pages: 864, year: 1877, tag: 'Società', rating: 4.8, readers: '4.1M', chaptersCount: 239, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=320&q=80'
    },
    {
      id: 10, title: 'Cento anni di solitudine', author: 'G.G. Márquez',
      desc: 'La saga della famiglia Buendía attraverso sette generazioni nella città immaginaria di Macondo, tra magia e tragedia, amore e guerra.',
      genre: 'Realismo Magico', pages: 448, year: 1967, tag: 'Famiglia', rating: 4.9, readers: '7.2M', chaptersCount: 20, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=320&q=80'
    },
    {
      id: 11, title: 'La Metamorfosi', author: 'F. Kafka',
      desc: 'Gregor Samsa si sveglia una mattina trasformato in un enorme insetto. Un racconto sull\'alienazione, la famiglia e l\'identità perduta.',
      genre: 'Classico', pages: 96, year: 1915, tag: 'Esistenziale', rating: 4.7, readers: '3.5M', chaptersCount: 3, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=320&q=80'
    },
    {
      id: 12, title: 'Il Processo', author: 'F. Kafka',
      desc: 'Josef K. viene arrestato senza sapere il perché e si trova intrappolato in un sistema giudiziario assurdo e kafkiano da cui non riesce a sfuggire.',
      genre: 'Classico', pages: 280, year: 1925, tag: 'Angoscia', rating: 4.6, readers: '1.9M', chaptersCount: 10, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=320&q=80'
    },
    {
      id: 13, title: 'Lolita', author: 'V. Nabokov',
      desc: 'Il professor Humbert Humbert racconta la sua ossessione per la dodicenne Dolores Haze, in uno dei romanzi più controversi e stilisticamente brillanti del Novecento.',
      genre: 'Contemporaneo', pages: 368, year: 1955, tag: 'Controverso', rating: 4.3, readers: '2.8M', chaptersCount: 69, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=320&q=80'
    },
    {
      id: 14, title: 'Il Signore degli Anelli', author: 'J.R.R. Tolkien',
      desc: 'Frodo Baggins intraprende un viaggio epico per distruggere l\'Unico Anello e salvare la Terra di Mezzo dal dominio del Signore Oscuro Sauron.',
      genre: 'Fantasy', pages: 1216, year: 1954, tag: 'Epico', rating: 5.0, readers: '15M', chaptersCount: 62, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=320&q=80'
    },
    {
      id: 15, title: '1984', author: 'G. Orwell',
      desc: 'In uno Stato totalitario dove il Grande Fratello sorveglia ogni pensiero, Winston Smith osa sognare la libertà in un mondo dove la verità è un crimine.',
      genre: 'Distopico', pages: 328, year: 1949, tag: 'Libertà', rating: 4.9, readers: '12M', chaptersCount: 24, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80'
    },
    {
      id: 16, title: 'Siddharta', author: 'H. Hesse',
      desc: 'Il giovane Siddharta abbandona ogni privilegio per cercare l\'illuminazione spirituale in un viaggio interiore attraverso l\'India antica.',
      genre: 'Filosofico', pages: 160, year: 1922, tag: 'Spiritualità', rating: 4.8, readers: '4M', chaptersCount: 12, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80'
    },
    {
      id: 17, title: 'Il Conte di Montecristo', author: 'A. Dumas',
      desc: 'Edmond Dantès, ingiustamente imprigionato, evade e costruisce una nuova identità per portare a termine una vendetta meticolosa contro chi lo ha tradito.',
      genre: 'Avventura', pages: 1200, year: 1844, tag: 'Vendetta', rating: 4.9, readers: '5M', chaptersCount: 117, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80'
    },
    {
      id: 18, title: 'Sherlock Holmes', author: 'A.C. Doyle',
      desc: 'Il geniale detective Sherlock Holmes e il fedele dottor Watson risolvono i casi più intricati di Londra con deduzione infallibile e mente sopraffina.',
      genre: 'Giallo', pages: 320, year: 1887, tag: 'Investigazione', rating: 4.8, readers: '9M', chaptersCount: 12, bookmarked: false, liked: false,
      img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80'
    },
    { id: 19, title: '1984', author: 'G. Orwell', desc: 'In uno Stato totalitario dove il Grande Fratello sorveglia ogni pensiero, Winston Smith osa sognare la libertà in un mondo dove la verità è un crimine.', genre: 'Distopico', pages: 328, year: 1949, tag: 'Dittatura', rating: 4.9, readers: '12M', chaptersCount: 24, bookmarked: false, liked: false, img: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=320&q=80' },
    { id: 20, title: 'Il Vecchio e il Mare', author: 'E. Hemingway', desc: 'Santiago, un vecchio pescatore cubano, affronta per giorni e notti un enorme marlin nell\'oceano in una lotta che diventa metafora della condizione umana.', genre: 'Classico', pages: 128, year: 1952, tag: 'Resistenza', rating: 4.7, readers: '6M', chaptersCount: 1, bookmarked: false, liked: false, img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=320&q=80' },
    { id: 21, title: 'Siddharta', author: 'H. Hesse', desc: 'Il giovane Siddharta abbandona ogni privilegio per cercare l\'illuminazione spirituale in un viaggio interiore attraverso l\'India antica.', genre: 'Filosofico', pages: 160, year: 1922, tag: 'Illuminazione', rating: 4.8, readers: '4M', chaptersCount: 12, bookmarked: false, liked: false, img: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=320&q=80' },
    { id: 22, title: 'Il Conte di Montecristo', author: 'A. Dumas', desc: 'Edmond Dantès, ingiustamente imprigionato, evade e costruisce una nuova identità per portare a termine una vendetta meticolosa contro chi lo ha tradito.', genre: 'Avventura', pages: 1200, year: 1844, tag: 'Giustizia', rating: 4.9, readers: '5M', chaptersCount: 117, bookmarked: false, liked: false, img: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=320&q=80' },
    { id: 23, title: 'Sherlock Holmes', author: 'A.C. Doyle', desc: 'Il geniale detective Sherlock Holmes e il fedele dottor Watson risolvono i casi più intricati di Londra con deduzione infallibile e mente sopraffina.', genre: 'Giallo', pages: 320, year: 1887, tag: 'Londra', rating: 4.8, readers: '9M', chaptersCount: 12, bookmarked: false, liked: false, img: 'https://images.unsplash.com/photo-1515705576963-95cad62945b6?w=320&q=80' },],

    // ────────────────── HORROR ──────────────────
    booksB: [
      {
        id: 24, title: 'Dracula', author: 'Bram Stoker',
        desc: 'Il conte Dracula, vampiro immortale della Transilvania, minaccia l\'Inghilterra vittoriana. Un gruppo di coraggiosi si unisce per fermarlo prima che sia troppo tardi.',
        genre: 'Horror', pages: 416, year: 1897, tag: 'Vampiro', rating: 4.7, readers: '5.5M', chaptersCount: 27, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror1.jpg'
      },
      {
        id: 25, title: 'Shining', author: 'Stephen King',
        desc: 'Jack Torrance porta la famiglia all\'Overlook Hotel per la stagione invernale. Isolati dalla neve, forze oscure iniziano a far cedere la sua mente.',
        genre: 'Horror', pages: 537, year: 1977, tag: 'Psicologico', rating: 4.8, readers: '4.2M', chaptersCount: 58, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror2.jpg'
      },
      {
        id: 26, title: "L'Esorcista", author: 'William P. Blatty',
        desc: 'La dodicenne Regan inizia a manifestare comportamenti inspiegabili. Sua madre, disperata, si rivolge a un prete esorcista per salvare l\'anima di sua figlia.',
        genre: 'Horror', pages: 310, year: 1971, tag: 'Demoniaco', rating: 4.6, readers: '2.1M', chaptersCount: 14, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror3.jpg'
      },
      {
        id: 27, title: 'It', author: 'Stephen King',
        desc: 'Nel Maine una creatura millenaria, che si manifesta come Pennywise il clown, terrorizza la città di Derry nutrendosi della paura dei bambini.',
        genre: 'Horror', pages: 1138, year: 1986, tag: 'Clown', rating: 4.9, readers: '6.8M', chaptersCount: 22, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror4.jpg'
      },
      {
        id: 28, title: 'Frankenstein', author: 'Mary Shelley',
        desc: 'Lo scienziato Victor Frankenstein crea vita da resti umani, ma la creatura che nasce è condannata a vagare sola in un mondo che la rifiuta con orrore.',
        genre: 'Horror Gotico', pages: 280, year: 1818, tag: 'Creatura', rating: 4.7, readers: '3.9M', chaptersCount: 24, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror5.jpg'
      },
      {
        id: 29, title: 'Il Silenzio degli Innocenti', author: 'Thomas Harris',
        desc: 'L\'agente dell\'FBI Clarice Starling deve chiedere aiuto al geniale e terrificante dottor Hannibal Lecter per catturare un serial killer in libertà.',
        genre: 'Thriller', pages: 368, year: 1988, tag: 'Hannibal', rating: 4.8, readers: '3.1M', chaptersCount: 61, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror6.jpg'
      },
      {
        id: 30, title: 'Pet Sematary', author: 'Stephen King',
        desc: 'La famiglia Creed scopre un antico cimitero indiano con il potere di riportare in vita i morti. Ma ciò che ritorna non è mai lo stesso di prima.',
        genre: 'Horror', pages: 416, year: 1983, tag: 'Zombi', rating: 4.5, readers: '2.4M', chaptersCount: 62, bookmarked: false, liked: false,
        img: '/assets/Presentazione/horror/horror7.jpg'
      },
      { id: 31, title: 'Cujo', author: 'Stephen King', desc: 'Un San Bernardo amichevole viene morso da un pipistrello rabbioso e si trasforma in una macchina da uccidere che intrappolerà una madre e suo figlio.', genre: 'Horror', pages: 320, year: 1981, tag: 'Bestia', rating: 4.2, readers: '1.5M', chaptersCount: 1, bookmarked: false, liked: false, img: '/assets/Presentazione/horror/horror8.jpg' },
      { id: 32, title: 'The Ring', author: 'Koji Suzuki', desc: 'Dopo aver visionato una misteriosa videocassetta, una giornalista riceve una telefonata: morirà tra sette giorni. Inizia una corsa contro il tempo.', genre: 'Horror J-Horror', pages: 288, year: 1991, tag: 'Maledizione', rating: 4.4, readers: '1.2M', chaptersCount: 20, bookmarked: false, liked: false, img: '/assets/Presentazione/horror/horror9.jpg' },
      { id: 33, title: 'Psico', author: 'Robert Bloch', desc: 'Marion Crane si ferma al Bates Motel gestito dal timido Norman Bates e dalla sua possessiva madre. Una sosta che cambierà tutto per sempre.', genre: 'Thriller/Horror', pages: 220, year: 1959, tag: 'Suspense', rating: 4.6, readers: '950K', chaptersCount: 17, bookmarked: false, liked: false, img: '/assets/Presentazione/horror/horror10.jpg' },
    ],

    // ────────────────── ROMANCE (SENTIMENTALE) ──────────────────
    BooksC: [
      {
        id: 34, title: 'Orgoglio e Pregiudizio', author: 'Jane Austen',
        desc: 'Elizabeth Bennet e Mr. Darcy si scontrano tra pregiudizi sociali e orgoglio ferito, in un romanzo che ha definito il genere sentimentale moderno.',
        genre: 'Sentimentale', pages: 432, year: 1813, tag: 'Amore', rating: 4.9, readers: '8M', chaptersCount: 61, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance1.jpg'
      },
      {
        id: 35, title: 'Il Grande Gatsby', author: 'F. Scott Fitzgerald',
        desc: 'Nell\'America degli anni Venti, il misterioso Jay Gatsby organizza feste sfarzose sperando di riconquistare l\'amore perduto di Daisy Buchanan.',
        genre: 'Sentimentale', pages: 180, year: 1925, tag: 'Sogno', rating: 4.5, readers: '5.2M', chaptersCount: 9, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance2.jpg'
      },
      {
        id: 36, title: 'Romeo e Giulietta', author: 'William Shakespeare',
        desc: 'Due giovani di famiglie nemiche si innamorano perdutamente a Verona. Una storia d\'amore immortale destinata a una fine tragica.',
        genre: 'Dramma Teatrale', pages: 160, year: 1597, tag: 'Tragico', rating: 4.8, readers: '20M', chaptersCount: 5, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance3.jpg'
      },
      {
        id: 37, title: 'Cime Tempestose', author: 'Emily Brontë',
        desc: 'Una storia d\'amore selvaggia e tormentata tra Heathcliff e Catherine, ambientata tra le brughiere dello Yorkshire e destinata a sfidare la morte stessa.',
        genre: 'Sentimentale Gotico', pages: 400, year: 1847, tag: 'Tormento', rating: 4.6, readers: '4.5M', chaptersCount: 34, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance4.jpg'
      },
      {
        id: 38, title: 'Jane Eyre', author: 'Charlotte Brontë',
        desc: 'Jane, orfana e determinata, trova lavoro come istitutrice a Thornfield Hall dove si innamora del misterioso Mr. Rochester, nascondendo un segreto oscuro.',
        genre: 'Sentimentale', pages: 500, year: 1847, tag: 'Indipendenza', rating: 4.8, readers: '3.7M', chaptersCount: 38, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance5.jpg'
      },
      {
        id: 39, title: 'Io prima di te', author: 'Jojo Moyes',
        desc: 'Louisa Clark diventa la badante di Will Traynor, giovane ricco rimasto tetraplegico. Tra loro nasce un legame profondo che cambierà entrambi per sempre.',
        genre: 'Sentimentale', pages: 390, year: 2012, tag: 'Emozionante', rating: 4.7, readers: '4.8M', chaptersCount: 28, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance6.jpg'
      },
      {
        id: 40, title: 'Le pagine della nostra vita', author: 'Nicholas Sparks',
        desc: 'Noah e Allie si innamorano nell\'estate del 1940 ma la guerra e le differenze sociali li separano. Decenni dopo, il loro amore viene riletto da un vecchio quaderno.',
        genre: 'Sentimentale', pages: 220, year: 1996, tag: 'Memoria', rating: 4.6, readers: '3.2M', chaptersCount: 12, bookmarked: false, liked: false,
        img: '/assets/Presentazione/romance/romance7.jpg'
      },
      { id: 41, title: 'Colpa delle stelle', author: 'John Green', desc: 'Hazel e Augustus si incontrano a un gruppo di supporto per malati di cancro. Insieme affrontano la vita con ironia e coraggio, innamorandosi perdutamente.', genre: 'Young Adult', pages: 313, year: 2012, tag: 'Lacrime', rating: 4.7, readers: '5.5M', chaptersCount: 25, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance8.jpg' },
      { id: 42, title: 'Chiamami col tuo nome', author: 'André Aciman', desc: 'Nell\'estate del 1983 in Italia, il diciassettenne Elio si innamora di Oliver, il dottorando ospite di suo padre, in un\'estate che non dimenticherà mai.', genre: 'Sentimentale', pages: 272, year: 2007, tag: 'Estate', rating: 4.8, readers: '2.1M', chaptersCount: 4, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance9.jpg' },
      { id: 43, title: 'Anna Karenina', author: 'Lev Tolstoj', desc: 'Anna, brillante nobildonna russa, abbandona marito e figlio per seguire una passione travolgente che la società dell\'epoca non potrà mai perdonare.', genre: 'Sentimentale/Drammatico', pages: 864, year: 1877, tag: 'Russia', rating: 4.8, readers: '4.1M', chaptersCount: 239, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance10.jpg' },
      { id: 44, title: 'Persuasione', author: 'Jane Austen', desc: 'Anne Elliot rincontra il capitano Wentworth, l\'uomo che aveva rifiutato anni prima su consiglio altrui. È ancora possibile una seconda possibilità?', genre: 'Sentimentale', pages: 280, year: 1817, tag: 'Seconda Chance', rating: 4.7, readers: '1.8M', chaptersCount: 24, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance1.jpg' },
      { id: 45, title: 'Ragione e Sentimento', author: 'Jane Austen', desc: 'Le sorelle Elinor e Marianne Dashwood affrontano l\'amore in modi opposti: una con razionale compostezza, l\'altra con passione travolgente.', genre: 'Sentimentale', pages: 350, year: 1811, tag: 'Sorelle', rating: 4.7, readers: '2.5M', chaptersCount: 50, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance2.jpg' },
      { id: 46, title: 'Un amore senza fine', author: 'Scott Spencer', desc: 'David è ossessionato da Jade, la ragazza di cui si è innamorato. Una storia d\'amore adolescenziale che diventa qualcosa di pericoloso e incontrollabile.', genre: 'Sentimentale/Noir', pages: 416, year: 1979, tag: 'Ossessione', rating: 4.1, readers: '800K', chaptersCount: 15, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance3.jpg' },
      { id: 47, title: 'Emma', author: 'Jane Austen', desc: 'Emma Woodhouse, bella e ricca, si crede un\'abile mediatrice sentimentale. Ma nel combinare matrimoni per gli altri rischia di perdere il suo stesso amore.', genre: 'Sentimentale/Commedia', pages: 480, year: 1815, tag: 'Equivoci', rating: 4.8, readers: '2.2M', chaptersCount: 55, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance4.jpg' },
      { id: 48, title: 'La signora delle camelie', author: 'Alexandre Dumas', desc: 'Margherita Gautier, celebre cortigiana parigina, si innamora sinceramente di Armand Duval in una storia d\'amore condannata dalla società e dalla malattia.', genre: 'Sentimentale/Classico', pages: 240, year: 1848, tag: 'Parigi', rating: 4.5, readers: '1.4M', chaptersCount: 27, bookmarked: false, liked: false, img: '/assets/Presentazione/romance/romance5.jpg' },],

    // ────────────────── HORROR ──────────────────
    horror: [
      {
        id: 101, title: 'Dracula', author: 'Bram Stoker',
        desc: 'Ambientato nella nebbiosa Transilvania e nella grigia Inghilterra vittoriana, il romanzo segue il giovane avvocato Jonathan Harker mentre si reca al castello del conte Dracula per concludere un affare immobiliare, ignaro del pericolo mortale che lo attende. Attraverso diari personali, lettere e articoli di giornale, Stoker costruisce un mosaico narrativo di terrore crescente mentre il vampiro si insedia a Londra, seminando morte e trasformando le sue vittime in non-morti. Un gruppo di coraggiosi guidati dal professor Van Helsing dovrà affrontare il male immortale in una corsa disperata tra il mondo dei vivi e quello dei morti.',
        genre: 'Horror', pages: 418, year: 1897, tag: 'Vampiri', rating: 4.6, readers: '3.8M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 102, title: 'Shining', author: 'Stephen King',
        desc: 'Jack Torrance, scrittore in crisi e alcolista in recupero, accetta il lavoro di custode invernale dell\'Overlook Hotel, un lussuoso resort del Colorado che rimane isolato dalla neve per mesi. Con lui porta la moglie Wendy e il figlioletto Danny, un bambino dotato di un potere paranormale chiamato "la luccicanza" che gli permette di percepire le energie maligne che pervadono l\'hotel. Man mano che l\'isolamento avanza, le forze oscure dell\'Overlook iniziano a fare presa sulla mente fragile di Jack, trasformando il marito e padre in una minaccia mortale per la sua stessa famiglia.',
        genre: 'Horror', pages: 447, year: 1977, tag: 'Paranormale', rating: 4.7, readers: '5.2M', chaptersCount: 58, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 103, title: 'It', author: 'Stephen King',
        desc: 'Nella sonnolenta cittadina di Derry, nel Maine, una creatura millenaria si risveglia ogni ventisette anni per nutrirsi della paura e della carne dei bambini, assumendo la forma di Pennywise, un terrificante clown dai denti affilati. Sette ragazzi che si auto-denominano il "Club dei Perdenti" si uniscono per combattere il mostro negli anni Cinquanta, giurando di tornare se It dovesse risvegliarsi ancora. Trent anni dopo, ormai adulti e con le memorie di quell estate cancellate, sono richiamati a Derry per mantenere il loro patto e affrontare nuovamente l orrore primordiale.',
        genre: 'Horror', pages: 1138, year: 1986, tag: 'Mostri', rating: 4.8, readers: '6.1M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80&fit=crop'
      },
      {
        id: 104, title: 'Frankenstein', author: 'Mary Shelley',
        desc: 'Il giovane scienziato Victor Frankenstein, ossessionato dal sogno di sconfiggere la morte, riesce nell\'impresa proibita di assemblare un essere da parti di cadaveri e dargli vita attraverso la forza elettrica. Ma la creatura che nasce è condannata a vivere in un mondo che la rifiuta con orrore e disgusto a causa del suo aspetto mostruoso, spingendola verso la solitudine, la rabbia e infine la vendetta. Un romanzo che esplora con straordinaria profondità i confini della scienza, la responsabilità del creatore nei confronti della propria creazione e le devastanti conseguenze dell\'ambizione senza etica.',
        genre: 'Horror', pages: 280, year: 1818, tag: 'Scienza Oscura', rating: 4.5, readers: '4.2M', chaptersCount: 24, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80&fit=crop'
      },
      {
        id: 105, title: 'Pet Sematary', author: 'Stephen King',
        desc: 'La famiglia Creed si trasferisce in una tranquilla cittadina del Maine, ma scopre presto che dietro i boschi si cela un antico cimitero indiano Micmac con il potere soprannaturale di riportare in vita i morti. Quando una tragedia colpisce la famiglia, il padre Louis, devastato dal dolore, cede alla tentazione di usare quel luogo maledetto, ignorando gli avvertimenti del vicino anziano Jud. Ma ciò che torna dalla morte non è mai lo stesso di prima, e la famiglia Creed si troverà a fare i conti con qualcosa di molto peggio del lutto.',
        genre: 'Horror', pages: 374, year: 1983, tag: 'Non-Morti', rating: 4.6, readers: '3.5M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 106, title: 'The Haunting', author: 'Shirley Jackson',
        desc: 'Hill House, dimora oscura e contorta, attende da decenni chi possa interpretare le sue manifestazioni soprannaturali; il dottor Montague vi conduce un\'indagine scientifica con tre ospiti, tra cui Eleanor, donna solitaria e fragile che sente un legame inquietante con la casa. La Jackson costruisce un orrore psicologico magistrale in cui è impossibile distinguere tra il soprannaturale e la mente che si sgretola, tra la casa che divora e la donna che vuole essere divorata. Considerato uno dei migliori romanzi horror del Novecento, sfida il lettore a chiedersi dove finisca il fantasma e dove inizi la follia.',
        genre: 'Horror', pages: 246, year: 1959, tag: 'Case Infestate', rating: 4.4, readers: '1.9M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80&fit=crop'
      },
      {
        id: 107, title: "L'Esorcista", author: 'W. P. Blatty',
        desc: 'La dodicenne Regan MacNeil inizia a manifestare comportamenti sempre più inquietanti e violenti nella sua casa di Washington D.C., con episodi che la medicina non riesce a spiegare. Sua madre Chris, attrice di Hollywood, si rivolge disperata a Padre Karras, un gesuita in crisi di fede che diventa suo malgrado al centro di un confronto diretto con una forza demoniaca di antichissima origine. Un romanzo che ha ridefinito il genere horror mescolando teologia, psicologia e terrore viscerale in una storia che ancora oggi conserva tutta la sua potenza dirompente.',
        genre: 'Horror', pages: 340, year: 1971, tag: 'Demoni', rating: 4.5, readers: '2.8M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 108, title: 'Interview col Vampiro', author: 'Anne Rice',
        desc: 'Louis de Pointe du Lac, un malinconico vampiro del XVIII secolo, racconta la propria storia a un giornalista di San Francisco, ripercorrendo due secoli di esistenza immortale costellata di rimorsi, orrori e ricerca di senso. Trasformato dal carismatico e crudele Lestat, Louis si trova a navigare tra la propria umanità residua e la natura predatrice del vampiro, trovando conforto nell\'adozione della piccola Claudia, condannata anch\'essa all\'immortalità nel corpo di una bambina. Anne Rice reinventa il mito vampirico con straordinaria profondità emotiva e filosofica, rendendolo un\'esplorazione dell\'immortalità, del dolore e della solitudine esistenziale.',
        genre: 'Horror', pages: 342, year: 1976, tag: 'Vampiri', rating: 4.5, readers: '3.1M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 109, title: 'American Gods', author: 'Neil Gaiman',
        desc: 'Shadow Moon, appena uscito di prigione, viene assunto dall\'enigmatico Wednesday come guardia del corpo, scoprendo presto di essere entrato nel mezzo di una guerra invisibile tra gli antichi dèi portati in America dagli immigrati di ogni epoca e le nuove divinità nate dalla tecnologia, dalla televisione e dai media moderni. Gaiman tesse un arazzo narrativo straordinario che attraversa gli Stati Uniti reali e mitologici, esplorando cosa significhi credere, cosa sopravvive quando la fede svanisce e cosa accomuna l\'uomo di ieri con quello di oggi. Un romanzo che è allo stesso tempo road novel, mitologia americana e meditazione sulla natura del sacro.',
        genre: 'Horror', pages: 465, year: 2001, tag: 'Mitologia', rating: 4.6, readers: '4.0M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80&fit=crop'
      },
      {
        id: 110, title: 'Misery', author: 'Stephen King',
        desc: 'Paul Sheldon, celebre autore di romanzi romantici, rimane gravemente ferito in un incidente stradale durante una tempesta di neve nel Colorado e viene "salvato" da Annie Wilkes, che si dichiara la sua fan numero uno. Rinchiuso nella sua casa remota, Paul scopre presto che Annie è una donna instabile e pericolosissima, capace di atti di violenza inimmaginabili, che lo costringe a scrivere un nuovo romanzo resuscitando il personaggio di Misery che lui aveva ucciso nell\'ultimo libro. Un thriller claustrofobico che è anche una riflessione sul processo creativo, sulla dipendenza dal pubblico e sulla tortura della pagina bianca.',
        genre: 'Horror', pages: 370, year: 1987, tag: 'Prigionia', rating: 4.7, readers: '3.9M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 111, title: 'The Ring', author: 'Koji Suzuki',
        desc: 'La giornalista Reiko Asakawa inizia a indagare su una serie di morti inspiegabili di quattro adolescenti avvenute simultaneamente, scoprendo che tutte le vittime avevano visto la stessa misteriosa videocassetta una settimana prima di morire. Quando anche lei guarda il nastro, riceve una telefonata anonima che le annuncia che le restano sette giorni di vita, spingendola in una frenetica caccia alla verità che la porta fino alle remote isole Izu e a una storia di tragedia e vendetta soprannaturale. Suzuki costruisce un horror tecnologico capace di sfruttare le ansie del mondo moderno, trasformando un comune oggetto quotidiano in un vettore del terrore assoluto.',
        genre: 'Horror', pages: 262, year: 1991, tag: 'Soprannaturale', rating: 4.4, readers: '2.3M', chaptersCount: 17, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 112, title: 'Rebecca', author: 'Daphne du Maurier',
        desc: 'Una giovane donna senza nome sposa il ricco e affascinante vedovo Maxim de Winter e si trasferisce a Manderley, la sua magnifica tenuta sulla costa della Cornovaglia, scoprendo presto di vivere nell\'ombra schiacciante di Rebecca, la prima moglie morta in circostanze misteriose. La governante Mrs. Danvers, devota alla memoria di Rebecca in modo quasi ossessivo, fa di tutto per distruggere psicologicamente la nuova signora de Winter, che deve affrontare la propria insicurezza e i segreti sepolti di una casa che sembra ancora appartenere alla defunta padrona. Un capolavoro gotico di tensione psicologica, gelosia e segreti oscuri.',
        genre: 'Horror', pages: 400, year: 1938, tag: 'Gotico', rating: 4.7, readers: '3.3M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 113, title: 'Bird Box', author: 'Josh Malerman',
        desc: 'In un futuro prossimo, delle creature misteriose hanno invaso il mondo: chiunque le guardi perde istantaneamente la sanità mentale e si uccide in modo brutale, costringendo i sopravvissuti a vivere bendati o al chiuso con le finestre oscurate. Malorie, una delle poche superstiti, tenta una disperata fuga su un fiume con due bambini piccoli, tutti e tre bendati, verso un rifugio di cui ha sentito parlare. Il romanzo alterna la fuga sul fiume con i flashback che mostrano come sia arrivata a quel punto, costruendo una tensione insostenibile basata sull\'assenza del senso della vista.',
        genre: 'Horror', pages: 262, year: 2014, tag: 'Apocalisse', rating: 4.3, readers: '2.7M', chaptersCount: 36, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80&fit=crop'
      },
      {
        id: 114, title: 'The Silent Patient', author: 'Alex Michaelides',
        desc: 'Alicia Berenson, celebre pittrice, smette di parlare dopo aver sparato cinque colpi in faccia al marito Gabriel, negando ogni spiegazione per il suo gesto e condannandosi al silenzio assoluto. Lo psicoterapeuta Theo Faber, ossessionato dal caso, ottiene di essere assegnato alla clinica psichiatrica dove Alicia è internata, convinto di poterla far parlare e svelare il mistero celato nell\'unico indizio rimasto: un quadro intitolato "Alcesti". Un thriller psicologico dal ritmo incalzante con un colpo di scena finale che riscrive completamente tutto ciò che il lettore credeva di aver capito.',
        genre: 'Horror', pages: 336, year: 2019, tag: 'Psicologico', rating: 4.5, readers: '4.8M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80&fit=crop'
      },
      {
        id: 115, title: 'Haunted', author: 'Chuck Palahniuk',
        desc: 'Diciassette aspiranti scrittori rispondono a un annuncio che promette tre mesi di ritiro creativo lontano dal mondo, portando con sé le proprie storie, le proprie ossessioni e i propri demoni. Rinchiusi in un teatro abbandonato da un misterioso ospite, i partecipanti iniziano a sabotare deliberatamente le proprie condizioni di vita per creare la storia di sofferenza e sopravvivenza più vendibile possibile. Palahniuk intreccia una cornice narrativa disturbante con venti racconti nel racconto, ciascuno una bomba letteraria di estrema provocazione che esplora i confini del corpo, del dolore e della disperazione umana.',
        genre: 'Horror', pages: 404, year: 2005, tag: 'Disturbante', rating: 4.1, readers: '1.5M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80&fit=crop'
      },
      {
        id: 116, title: 'House of Leaves', author: 'Mark Z. Danielewski',
        desc: 'Un giovane trova il manoscritto di un vecchio cieco di nome Zampanò, che analizza un documentario chiamato "The Navidson Record" riguardante una casa che all\'interno è fisicamente più grande di quanto sia possibile all\'esterno, con corridoi oscuri che si generano spontaneamente e cambiano disposizione. Il romanzo è esso stesso un\'opera labirintica, con note a piè di pagina che si moltiplicano, testo stampato in direzioni diverse, pagine quasi vuote e appendici che sembrano sfuggire a qualsiasi logica, mimando il disorientamento fisico e mentale dei personaggi. Una sfida editoriale e narrativa unica nel suo genere che trasforma il libro stesso in un oggetto inquietante.',
        genre: 'Horror', pages: 709, year: 2000, tag: 'Sperimentale', rating: 4.3, readers: '1.2M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 117, title: 'Cujo', author: 'Stephen King',
        desc: 'Cujo è un San Bernardo amichevole e bonario che vive in una fattoria del Maine: un giorno viene morso da un pipistrello rabbioso e lentamente, tra sofferenza e febbre, si trasforma in una macchina da uccidere senza pietà. Donna Trenton e suo figlio Tad rimangono intrappolati nella loro Pinto in panne nel cortile della fattoria, sotto un sole cocente, mentre il cane idrofobo assedia il veicolo. King costruisce un thriller di sopravvivenza di potenza brutale, che è anche una riflessione sul caso, sulla fragilità della vita quotidiana e su come il male possa nascondersi nelle cose più innocenti.',
        genre: 'Horror', pages: 319, year: 1981, tag: 'Sopravvivenza', rating: 4.2, readers: '2.1M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 118, title: 'The Troop', author: 'Nick Cutter',
        desc: 'Un gruppo di boy scout si reca su un\'isola remota canadese per un campeggio, quando arriva uno sconosciuto emaciato e febbricitante che porta con sé qualcosa di orribile: un parassita capace di svuotare letteralmente il corpo umano dall\'interno mentre alimenta una fame insaziabile. Cutter scrive un horror corporeo di rara brutalità e inventiva, che attinge sia all\'orrore classico di Lord of the Flies sia al body horror più estremo, mettendo alla prova i limiti del lettore con scene di disgusto fisico ed emotivo magistralmente calibrate. Una storia di sopravvivenza, contagio e il sottile confine tra civiltà e barbarie.',
        genre: 'Horror', pages: 355, year: 2014, tag: 'Body Horror', rating: 4.2, readers: '980K', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 119, title: 'Hex', author: 'Thomas Olde Heuvelt',
        desc: 'La piccola città di Black Spring nello stato di New York è da secoli maledetta dalla presenza della Strega Nera, una donna impiccata nel XVII secolo che vaga per le strade con gli occhi e la bocca cuciti, apparendo nelle case degli abitanti senza preavviso. Gli abitanti hanno imparato a convivere con lei, monitorandola con telecamere e scoraggiando i visitatori dal venire, finché un gruppo di giovani decide di sfidare le regole e svegliare qualcosa che non avrebbe mai dovuto essere disturbato. Heuvelt mescola folklore europeo, tensione sociale e orrore moderno in un romanzo originale che esplora come le comunità gestiscano i propri segreti oscuri.',
        genre: 'Horror', pages: 384, year: 2013, tag: 'Stregoneria', rating: 4.2, readers: '870K', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 120, title: 'The Cabin at the End', author: 'Paul Tremblay',
        desc: 'Andrew e Eric sono in vacanza in una remota baita nel New Hampshire con la figlioletta adottiva Wen quando quattro sconosciuti armati di strumenti improvvisati li prendono in ostaggio. I quattro sostengono di avere visioni apocalittiche e affermano che la famiglia deve fare una scelta impossibile per prevenire la fine del mondo: sacrificare volontariamente uno dei propri membri. Tremblay scrive un horror ambiguo e perturbante che non rivela mai con certezza se gli invasori siano veramente profeti di una catastrofe imminente o semplicemente pericolosi fanatici, lasciando il lettore in un disagio permanente.',
        genre: 'Horror', pages: 273, year: 2018, tag: 'Apocalisse', rating: 4.1, readers: '1.3M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 121, title: 'Guts', author: 'Chuck Palahniuk',
        desc: 'Originariamente pubblicato come racconto autonomo, "Guts" è diventato leggendario per aver fatto svenire decine di lettori durante le letture pubbliche dell\'autore, a causa della sua descrizione clinicamente precisa e brutalmente comica di incidenti sessuali domestici dai risvolti catastrofici. Palahniuk trasforma il corpo umano in teatro del grottesco e dell\'assurdo, usando un tono deliberatamente neutro e quasi burocratico per amplificare l\'orrore di ciò che descrive. Un testo breve ma di impatto devastante che dimostra come la letteratura possa essere una sfida fisica oltre che intellettuale per il lettore.',
        genre: 'Horror', pages: 20, year: 2004, tag: 'Provocatorio', rating: 3.9, readers: '750K', chaptersCount: 1, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80&fit=crop'
      },
      {
        id: 122, title: 'The Hellbound Heart', author: 'Clive Barker',
        desc: 'Frank Cotton risolve un enigmatico puzzle box acquisendo un piacere oltre ogni immaginazione umana, ma viene smembrato e portato in una dimensione di dolore eterno dai Cenobiti, esseri che hanno trasceso i confini tra piacere e tormento. Quando il sangue del fratello gocciolato sul pavimento della casa riporta parzialmente Frank alla vita, la cognata Julia inizia a procurargli vittime per completare la sua rigenerazione, dando vita a una storia di desiderio perverso, tradimento e orrore cosmico. La novella fondativa dell\'universo di Hellraiser, un capolavoro del body horror filosofico.',
        genre: 'Horror', pages: 165, year: 1986, tag: 'Body Horror', rating: 4.4, readers: '1.6M', chaptersCount: 11, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 123, title: 'Something Wicked', author: 'Ray Bradbury',
        desc: 'Nel tardo ottobre, in una piccola città dell\'Illinois, arriva il Carnival Dark, un luna park notturno che promette di esaudire i desideri più profondi dei visitatori — ma a un prezzo oscuro e imprevedibile. I dodicenni Jim Nightshade e Will Halloway vengono attratti dal Carnevale e devono affrontare le forze del male incarnate nell\'enigmatico Mr. Dark, un uomo ricoperto di tatuaggi che è la somma di tutte le anime che il Carnevale ha consumato. Bradbury scrive un poema in prosa sull\'infanzia, sulla paura del tempo e sull\'eterna lotta tra giovinezza e corruzione.',
        genre: 'Horror', pages: 293, year: 1962, tag: 'Gotico', rating: 4.5, readers: '1.9M', chaptersCount: 54, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 124, title: 'The Ruins', author: 'Scott Smith',
        desc: 'Quattro turisti americani e due greci seguono un giovane tedesco fino alle rovine di un sito maya in Messico, dove vengono circondati dagli abitanti del villaggio vicino che impediscono loro di andarsene, costringendoli a rimanere sulle rovine infestate da una pianta carnivora intelligente e inarrestabile. Smith costruisce un horror di sopravvivenza brutale e senza speranza, in cui i personaggi sono consumati fisicamente e psicologicamente dalla pianta, dagli elementi e dalla disperazione, in una progressione inarrestabile verso il peggio. Un romanzo che rifugge ogni happy ending in favore di una visione cupa e spietata della natura.',
        genre: 'Horror', pages: 319, year: 2006, tag: 'Sopravvivenza', rating: 4.2, readers: '1.4M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 125, title: 'Carrie', author: 'Stephen King',
        desc: 'Carrie White è una sedicenne timida e introversa, figlia di una madre religiosa fanatica e violenta, perennemente vittima dei compagni di scuola che la tormentano senza pietà. Quando manifesta poteri telecinetici e viene invitata al ballo di fine anno da un ragazzo gentile — frutto in realtà di uno scherzo crudele orchestrato dalla studentessa più popolare — il cumulo di umiliazioni raggiunge un punto di non ritorno. Il romanzo di esordio di King è una potente allegoria sul bullismo, sull\'emarginazione sociale e su come la società spinga le sue vittime verso la distruzione.',
        genre: 'Horror', pages: 199, year: 1974, tag: 'Telecinesi', rating: 4.4, readers: '3.2M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=300&q=80&fit=crop'
      },
      {
        id: 126, title: 'Coraline', author: 'Neil Gaiman',
        desc: 'La piccola Coraline Jones si trasferisce in una vecchia casa divisa in appartamenti con i genitori troppo occupati per prestarle attenzione, e scopre una piccola porta nel muro che conduce a un\'altra versione della sua casa, con un\'altra madre e un altro padre — uguali ai suoi, ma migliori e più affettuosi, tranne che per gli occhi neri come bottoni. Gaiman scrive una fiaba oscura di rara bellezza che esplora il desiderio infantile di genitori perfetti, il coraggio necessario per affrontare il male e la differenza fondamentale tra ciò che si desidera e ciò di cui si ha davvero bisogno. Terrificante e poetico in egual misura.',
        genre: 'Horror', pages: 163, year: 2002, tag: 'Dark Fantasy', rating: 4.6, readers: '5.1M', chaptersCount: 13, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80&fit=crop'
      },
      {
        id: 127, title: 'The Ritual', author: 'Adam Nevill',
        desc: 'Quattro amici di vecchia data intraprendono un trekking sulle montagne scandinave per riconnettersi dopo anni, ma decidono di prendere una scorciatoia attraverso una foresta antica e selvaggia che si rivela essere qualcosa di molto più oscuro di un semplice bosco. Troveranno resti animali appesi agli alberi come offerte votive, una capanna abbandonata con simboli rituali sulle pareti e la presenza di qualcosa di antico e terribile che li segue tra gli alberi. Nevill costruisce un horror folcloristico ispirato ai miti nordici con una tensione crescente e un senso di inevitabile condanna che permea ogni pagina.',
        genre: 'Horror', pages: 346, year: 2011, tag: 'Folklore', rating: 4.3, readers: '1.1M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&q=80&fit=crop'
      },
      {
        id: 128, title: 'NOS4A2', author: 'Joe Hill',
        desc: 'Charlie Manx è un immortale che guida una Rolls-Royce Wraith del 1938 con la targa NOS4A2, rapendo bambini e portandoli a Christmasland, una dimensione da lui creata dove è Natale per sempre — ma i bambini che vi arrivano perdono la propria anima e si trasformano in mostri sorridenti dai denti affilati. Victoria McQueen, una donna con poteri soprannaturali che permettono di trovare oggetti perduti, lo ha già affrontato da bambina e ora, anni dopo, deve salvare il proprio figlio dalla stessa sorte. Hill scrive un romanzo horror di ampio respiro che onora la tradizione paterna pur essendo pienamente originale.',
        genre: 'Horror', pages: 692, year: 2013, tag: 'Soprannaturale', rating: 4.6, readers: '1.8M', chaptersCount: 60, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 129, title: 'The Exorcist', author: 'William P. Blatty',
        desc: 'Basato su eventi reali avvenuti nel 1949, il romanzo segue la progressiva possessione demoniaca della dodicenne Regan attraverso gli occhi della madre disperata e di Padre Karras, un gesuita che lotta con la propria fede vacillante mentre affronta qualcosa che va ben oltre qualsiasi razionale spiegazione medica o psicologica. Blatty intreccia il terrore soprannaturale con profonde domande teologiche sull\'esistenza del male, la natura di Dio e il sacrificio di sé stessi per il bene altrui, creando un\'opera che è allo stesso tempo horror viscerale e meditazione spirituale. Considerato da molti il romanzo horror più spaventoso mai scritto.',
        genre: 'Horror', pages: 340, year: 1971, tag: 'Demoni', rating: 4.5, readers: '2.8M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80&fit=crop'
      },
      {
        id: 130, title: 'Ghostland', author: 'Duncan Ralston',
        desc: 'In un futuro prossimo, i fantasmi sono diventati un fenomeno documentato e le loro dimore infestate sono diventate attrazioni turistiche che i visitatori esplorano con speciali occhiali che permettono di vedere i defunti. Ben e Lily si recano al Ghostland, il più grande parco a tema del soprannaturale, ma qualcosa va storto e i visitatori rimangono intrappolati insieme ai fantasmi che ora possono toccare i vivi. Ralston costruisce un horror ad alta adrenalina che mescola suspense, azione e un originale premessa fantascientifica, esplorando il confine tra intrattenimento e pericolo reale.',
        genre: 'Horror', pages: 450, year: 2017, tag: 'Fantasmi', rating: 4.1, readers: '620K', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── FANTASY ──────────────────
    fantasy: [
      {
        id: 201, title: 'Il Signore degli Anelli', author: 'J.R.R. Tolkien',
        desc: 'La Compagnia dell\'Anello, guidata dal giovane hobbit Frodo Baggins, intraprende un viaggio epico attraverso la Terra di Mezzo per distruggere l\'Unico Anello nelle fiamme del Monte Fato, l\'unico luogo dove la sua corruzione millenaria può essere annullata. Tolkien costruisce un mondo di straordinaria profondità, con lingue inventate, mitologie stratificate e una geografia ricchissima, intrecciando temi universali di amicizia, sacrificio, coraggio di fronte all\'impossibile e la lotta della luce contro le tenebre. Pubblicato in tre volumi, rimane il punto di riferimento assoluto del fantasy moderno e una delle opere letterarie più influenti del XX secolo.',
        genre: 'Fantasy', pages: 1178, year: 1954, tag: 'Epico', rating: 4.9, readers: '15.0M', chaptersCount: 62, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&q=80&fit=crop'
      },
      {
        id: 202, title: 'Harry Potter e la Pietra', author: 'J.K. Rowling',
        desc: 'Harry Potter, orfano cresciuto in condizioni di miseria dai perfidi zii Dursley, scopre l\'undicesimo compleanno di essere un mago e viene ammesso alla Scuola di Magia e Stregoneria di Hogwarts, dove impara che è famoso nel mondo magico per essere sopravvissuto all\'attacco del Signore Oscuro Lord Voldemort quando aveva solo un anno. Tra amicizia con Ron Weasley e Hermione Granger, lezioni di volo su scopa, partite di Quidditch e la scoperta di un mistero nascosto nelle profondità della scuola, Harry inizia il suo lungo percorso verso il destino che lo attende. Il libro che ha rivoluzionato la letteratura per ragazzi e riportato il piacere della lettura a un\'intera generazione.',
        genre: 'Fantasy', pages: 309, year: 1997, tag: 'Magia', rating: 4.8, readers: '25.0M', chaptersCount: 17, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&q=80&fit=crop'
      },
      {
        id: 203, title: 'Il Nome del Vento', author: 'Patrick Rothfuss',
        desc: 'Kvothe, leggendario mago, musicista e avventuriero, oggi si nasconde sotto falsa identità come semplice oste di villaggio; quando il Cronista lo trova, Kvothe acconsente a raccontare la vera storia della propria vita nel corso di tre giorni. Il primo giorno copre la sua infanzia tra i Edema Ruh, troupe di artisti girovaghi, la tragica morte dei genitori per opera degli Amyr, gli anni di sopravvivenza come orfano nelle strade di Tarbean e l\'ammissione all\'Università per imparare la simpatia — la magia della sua tradizione. Un primo volume di straordinaria bellezza letteraria che ha rinnovato il fantasy epico con una voce narrativa di rara eleganza.',
        genre: 'Fantasy', pages: 662, year: 2007, tag: 'Magia', rating: 4.8, readers: '7.2M', chaptersCount: 92, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80&fit=crop'
      },
      {
        id: 204, title: 'Eragon', author: 'Christopher Paolini',
        desc: 'Il quindicenne Eragon trova nella foresta un\'insolita pietra lucente che si rivela essere un uovo di drago, da cui nasce Saphira, una dragonessa azzurra con cui forma un legame telepatico e fisico indissolubile. Quando gli agenti del malvagio Re Galbatorix distruggono la sua fattoria e uccidono suo zio, Eragon intraprende con il vecchio narratore Brom un viaggio per unirsi ai Varden, la resistenza ribelle, imparando nel frattempo la magia antica degli Elfi e scoprendo la propria vera origine. Scritto da Paolini a quindici anni, è un omaggio ai grandi classici del fantasy con una voce propria e appassionata.',
        genre: 'Fantasy', pages: 503, year: 2003, tag: 'Draghi', rating: 4.4, readers: '6.5M', chaptersCount: 59, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&q=80&fit=crop'
      },
      {
        id: 205, title: 'Stardust', author: 'Neil Gaiman',
        desc: 'Il giovane Tristran Thorn promette alla bellissima Victoria di portarle la stella cadente che entrambi hanno visto oltre il Muro che separa il tranquillo villaggio di Wall dal magico regno di Faerie, ma quando raggiunge la stella scopre che è una giovane donna di nome Yvaine, ferita dalla caduta e poco disposta a farsi portare da nessuna parte. Nel mondo incantato di Faerie, però, la stella è desiderata anche dai figli di un re morto che competono per la successione al trono, e da una strega crudele che vuole il suo cuore per conservare la giovinezza. Gaiman firma una fiaba per adulti di straordinaria grazia narrativa.',
        genre: 'Fantasy', pages: 248, year: 1999, tag: 'Fiaba', rating: 4.5, readers: '3.8M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&q=80&fit=crop'
      },
      {
        id: 206, title: 'Le Cronache del Ghiaccio', author: 'G.R.R. Martin',
        desc: 'Nei Sette Regni di Westeros, nobili casate si contendono il Trono di Spade mentre una minaccia soprannaturale si avvicina dal Grande Inverno oltre la Barriera di ghiaccio a nord. La saga segue le vicende di numerose famiglie — i Lannister, gli Stark, i Baratheon — in una narrativa corale che non risparmia i propri personaggi e sovverte ogni aspettativa narrativa tradizionale del genere. Martin scrive fantasy epico con la complessità morale di un grande romanzo storico, esplorando il potere, la sopravvivenza e le conseguenze delle scelte in un mondo crudele e privo di eroi infallibili.',
        genre: 'Fantasy', pages: 835, year: 1996, tag: 'Politico', rating: 4.7, readers: '12.0M', chaptersCount: 73, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=300&q=80&fit=crop'
      },
      {
        id: 207, title: 'Narnia', author: 'C.S. Lewis',
        desc: 'Quattro fratelli — Peter, Susan, Edmund e Lucy Pevensie — sfollati a Londra durante la Seconda Guerra Mondiale si ritrovano a vivere nella grande casa di un anziano professore, dove Lucy scopre per prima che attraverso il guardaroba si accede a Narnia, un mondo magico congelato in un eterno inverno dalla Strega Bianca Jadis. Guidati dal leone Aslan, creatore di Narnia, i quattro ragazzi diventano re e regine di un regno che devono liberare dal male. Lewis scrive una delle allegorie cristiane più famose della letteratura, trasparente nella sua simbologia eppure universalmente affascinante nelle avventure che racconta.',
        genre: 'Fantasy', pages: 206, year: 1950, tag: 'Classico', rating: 4.6, readers: '9.5M', chaptersCount: 17, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=300&q=80&fit=crop'
      },
      {
        id: 208, title: 'Mistborn', author: 'Brandon Sanderson',
        desc: 'In un mondo coperto di cenere dove il sole tramonta rosso e la nebbia notturna cela creature misteriose, l\'Assemblea — l\'Imperatore Vivente — regna da millenni con potere assoluto. Vin, una giovane ladra degli slums, scopre di essere un\'Allomante Nata, capace di bruciare metalli per ottenere poteri soprannaturali, e viene reclutata in una banda di rivoluzionari guidata dall\'ineguagliabile Kelsier. Sanderson costruisce uno dei sistemi di magia più originali e rigorosi della letteratura fantasy, unito a una trama piena di colpi di scena che rimette in discussione tutto ciò che il lettore credeva di sapere.',
        genre: 'Fantasy', pages: 541, year: 2006, tag: 'Sistema Magico', rating: 4.8, readers: '6.8M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&q=80&fit=crop'
      },
      {
        id: 209, title: 'The Way of Kings', author: 'Brandon Sanderson',
        desc: 'Il primo volume del Cosmere di Sanderson segue tre narratori principali in Roshar, un pianeta devastato da enormi tempeste magiche e popolato da creature blindate, dove si intrecciano le storie del generale di schiavi Kaladin, dotato del potere degli antichi Cavalieri Radiosi, dell\'studiosa Shallan in cerca di un mentor per finanziare la propria famiglia, e del principe guerriero Dalinar ossessionato da visioni del passato eroico. Un edificio narrativo grandioso di quasi mille pagine che posa le fondamenta di una saga epica decennale, con un worldbuilding di inaudita profondità e ambizione.',
        genre: 'Fantasy', pages: 1007, year: 2010, tag: 'Epico', rating: 4.8, readers: '4.5M', chaptersCount: 75, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80&fit=crop'
      },
      {
        id: 210, title: 'Elantris', author: 'Brandon Sanderson',
        desc: 'Un tempo Elantris era la città degli dèi, abitata da esseri trasformati dalla magia in creature di luce capaci di grandi opere. Poi qualcosa è andato storto: la trasformazione è diventata una maledizione, e gli Elantrani sopravvivono in una città-prigione, morti viventi che non riescono a morire né a guarire. Quando il principe Raoden viene colpito dalla maledizione alla vigilia delle nozze, deve sopravvivere in Elantris mentre la promessa sposa Sarene, convinta di essere vedova, arriva nel regno e inizia a tessere intrighi politici per proteggerlo. Il romanzo di esordio di Sanderson, già maturo nelle ambizioni e nel sistema magico.',
        genre: 'Fantasy', pages: 496, year: 2005, tag: 'Magia', rating: 4.4, readers: '2.3M', chaptersCount: 63, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80&fit=crop'
      },
      {
        id: 211, title: 'The Witcher', author: 'Andrzej Sapkowski',
        desc: 'Geralt di Rivia è un Witcher — un cacciatore di mostri modificato geneticamente dalla prima infanzia per diventare più forte, più veloce e privo delle emozioni umane ordinarie — che vaga per un mondo medievale in cui esseri umani, elfi, nani e mostri di ogni tipo coesistono in un equilibrio precario e violento. Sapkowski raccoglie il mito europeo e slavo e lo immerge in una narrativa adulta e moralmente ambigua dove non esistono veri eroi né veri villain, solo persone che cercano di sopravvivere in un mondo brutale. I racconti e i romanzi del ciclo del Witcher sono la base di uno dei franchise fantasy più amati al mondo.',
        genre: 'Fantasy', pages: 288, year: 1993, tag: 'Dark Fantasy', rating: 4.7, readers: '8.5M', chaptersCount: 8, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80&fit=crop'
      },
      {
        id: 212, title: 'Malazan Book of the Fallen', author: 'Steven Erikson',
        desc: 'La Caduta di Gardens of the Moon dà il via a una delle saghe fantasy più ambiziose mai scritte, che abbraccia continenti, millenni di storia, dèi mortali e immortali, eserciti di zombie, razze aliene e un pantheon in continuo conflitto. Erikson non fa concessioni al lettore: la saga inizia in medias res, con una miriade di personaggi e fazioni introdotti senza spiegazione, affidando al lettore il compito di ricostruire il quadro completo nel corso dei dieci volumi. Un\'opera di straordinaria complessità che ricompensa chi ha la pazienza di affidarsi alla sua corrente narrativa.',
        genre: 'Fantasy', pages: 666, year: 1999, tag: 'Epico', rating: 4.6, readers: '2.1M', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80&fit=crop'
      },
      {
        id: 213, title: 'The First Law', author: 'Joe Abercrombie',
        desc: 'La trilogia della Prima Legge si apre con tre narratori apparentemente stereotipati — l\'inquisitore cinico Glokta, il nobile guerriero incompetente Jezal dan Luthar, e il barbaro del nord Logen Nove-Dita — che Abercrombie smonta sistematicamente, rivelando la complessità dolorosa dietro ogni facciata. In un mondo in guerra su più fronti, le storie si intrecciano verso una conclusione che rifiuta ogni consolazione narrativa e rimette radicalmente in discussione le convenzioni del genere. Il fantasy grimdark nella sua forma più brillante, crudele e letterariamente consapevole.',
        genre: 'Fantasy', pages: 515, year: 2006, tag: 'Grimdark', rating: 4.7, readers: '3.5M', chaptersCount: 55, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 214, title: 'The Blade Itself', author: 'Joe Abercrombie',
        desc: 'Primo volume della trilogia della Prima Legge, introduce il barbaro Logen Nove-Dita — l\'uomo più pericoloso del Nord — e il Primo dei Magi Bayaz, una figura enigmatica di immenso potere che riunisce intorno a sé un gruppo eterogeneo di personaggi per scopi che solo lui conosce pienamente. Nel frattempo l\'Inquisitore Glokta, ex campione di scherma reso storpio dalla tortura, indaga su tradimenti e cospirazioni nella capitale dell\'Unione mentre un\'invasione barbara si avvicina da nord. Abercrombie stabilisce fin dal primo volume le regole del proprio universo brutale e moralmente ambiguo.',
        genre: 'Fantasy', pages: 515, year: 2006, tag: 'Grimdark', rating: 4.6, readers: '3.2M', chaptersCount: 55, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 215, title: "Assassin's Apprentice", author: 'Robin Hobb',
        desc: 'Fitz è il figlio illegittimo del principe Chivalry dei Sei Ducati, cresciuto a corte come paria e affidato allo stalliere Burrich, scoprendo con il tempo di possedere il Wit — la capacità di legarsi mentalmente agli animali — e lo Skill — la magia reale della sua stirpe. Addestrato in segreto come assassino al servizio del Re Astuto, Fitz deve anche affrontare la minaccia dei Raiders Rossi che attaccano le coste, portando con sé un orrore peggiore della morte: il Forgiare, che priva le vittime di ogni umanità. Hobb scrive fantasy emotivamente intensissimo, con una voce in prima persona che rende Fitz uno dei personaggi più amati del genere.',
        genre: 'Fantasy', pages: 356, year: 1995, tag: 'Politico', rating: 4.7, readers: '2.8M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 216, title: 'Wheel of Time', author: 'Robert Jordan',
        desc: 'L\'Occhio del Mondo apre la saga fantasy più lunga della storia con un numero impressionante di pagine: Rand al\'Thor e i suoi amici del villaggio di Due Fiumi vengono braccati da creature del Tenebroso e guidati dalla Aes Sedai Moiraine in una fuga attraverso un mondo in cui una profezia antichissima si sta realizzando. La Ruota del Tempo gira sempre, e con essa le Ere si succedono — e qualcuno tra i giovani di Due Fiumi potrebbe essere il Dragon Rinato, predestinato a combattere il Tenebroso nell\'ultima battaglia. Jordan costruisce uno dei worldbuilding più ricchi e dettagliati del genere, con culture, magie e storia millennari.',
        genre: 'Fantasy', pages: 782, year: 1990, tag: 'Epico', rating: 4.6, readers: '7.0M', chaptersCount: 53, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&q=80&fit=crop'
      },
      {
        id: 217, title: 'Draconomicon', author: 'Andy Collins',
        desc: 'Un manuale definitivo dedicato interamente ai draghi nell\'universo di Dungeons & Dragons, questo volume esplora la biologia, la psicologia, la tassonomia e i costumi sociali di ciascuna varietà di drago cromatico e metallico, oltre a presentare nuove varianti di creature, antri, tesori e avventure interamente incentrate su questi magnifici predatori. Ricco di illustrazioni e di tavole dettagliate, fornisce ai giocatori e ai Dungeon Master strumenti per creare incontri con i draghi che vadano ben oltre il semplice scontro fisico, esplorando la loro natura di creature di straordinaria intelligenza e ambizione.',
        genre: 'Fantasy', pages: 288, year: 2003, tag: 'Draghi', rating: 4.3, readers: '420K', chaptersCount: 8, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=300&q=80&fit=crop'
      },
      {
        id: 218, title: 'Perdido Street Station', author: 'China Miéville',
        desc: 'Nella città-stato di New Crobuzon, una metropoli steampunk caotica e magnificamente immaginata, lo scienziato Isaac Dan der Grimnebulin viene contattato da Yagharek, un garuda — essere umano-rapace — privato delle ali come punizione per un crimine che non rivela. Mentre Isaac studia la natura del volo, acquista per errore una larva che si sviluppa in un essere di orrore cosmico capace di nutrirsi dei sogni, scatenando una catastrofe su New Crobuzon. Miéville firma uno dei romanzi fantasy più straordinari degli anni Zero, con una prosa barocca, una città viva e perturbante, e temi politici espliciti.',
        genre: 'Fantasy', pages: 710, year: 2000, tag: 'Weird Fiction', rating: 4.5, readers: '1.4M', chaptersCount: 50, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 219, title: 'Uprooted', author: 'Naomi Novik',
        desc: 'Ogni dieci anni il mago noto come il Drago sceglie una ragazza del villaggio per portarla nella sua torre e tenerla con sé un decennio — nessuno sa esattamente perché. Agnieszka, goffa e poco appariscente, è sicura di non essere scelta, ma il Drago la prende lo stesso, scoprendo che possiede un potere magico antico e selvaggio che non assomiglia a nessun sistema conosciuto. Insieme dovranno affrontare il Bosco, un\'entità oscura e corrotta che minaccia di inghiottire il regno intero. Novik firma un romanzo ispirato alle fiabe slave di Baba Yaga, elegante e originale.',
        genre: 'Fantasy', pages: 438, year: 2015, tag: 'Fiaba', rating: 4.6, readers: '3.2M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 220, title: 'Spinning Silver', author: 'Naomi Novik',
        desc: 'Ispirato alla fiaba di Tremotino, il romanzo segue Miryem, figlia di un usuraio ebreo troppo gentile per riscuotere i debiti, che decide di occuparsi lei stessa degli affari di famiglia e si guadagna la fama di poter trasformare l\'argento in oro. Quando un re dei Staryk — creature fatate dell\'inverno — la sfida a dimostrarlo davvero, Miryem si trova intrappolata in un mondo di ghiaccio eterno mentre a casa sua un altro tipo di mostro — il tsar posseduto da un demone del fuoco — minaccia tutto ciò che ama. Novik intreccia tre voci femminili in un racconto di sopravvivenza, potere e scelta.',
        genre: 'Fantasy', pages: 480, year: 2018, tag: 'Fiaba', rating: 4.5, readers: '2.1M', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 221, title: 'The Name of the Wind', author: 'Patrick Rothfuss',
        desc: 'Kvothe narra la storia della propria vita al Cronista nel corso di tre giorni nella quiete della taverna dove si nasconde, ripercorrendo l\'infanzia tra i Edema Ruh, i vagabondi drammaturghi, la perdita devastante della famiglia per mano degli Amyr e gli anni di sopravvivenza nelle strade di Tarbean. Il romanzo è celebre per la sua prosa di straordinaria cura stilistica, che trasforma ogni scena in un\'esperienza estetica oltre che narrativa, e per il sistema di magia basato sulla simpatia — relazioni logiche tra oggetti — tra i più originali del genere fantasy. Una storia nella storia che cattura il lettore dalla prima all\'ultima pagina.',
        genre: 'Fantasy', pages: 662, year: 2007, tag: 'Magia', rating: 4.8, readers: '7.2M', chaptersCount: 92, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 222, title: 'A Darker Shade of Magic', author: 'V.E. Schwab',
        desc: 'Kell è uno dei rarissimi maghi capaci di viaggiare tra i quattro Londra che esistono in parallelo: Londra Grigia senza magia, Londra Bianca dove la magia devora i suoi utilizzatori, Londra Nera — distrutta — e la sua Londra Rossa dove la magia fiorisce in armonia. Quando Kell contrabbanda per errore un artefatto di Londra Nera, viene trascinato in un\'avventura insieme a Lila Bard, una giovane ladra di Londra Grigia assetata di avventura. Schwab costruisce un universo originale con una prosa vivace e personaggi carismatici, inaugurando una delle serie fantasy urban più amate degli anni Dieci.',
        genre: 'Fantasy', pages: 400, year: 2015, tag: 'Multiverso', rating: 4.6, readers: '4.1M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 223, title: 'Circe', author: 'Madeline Miller',
        desc: 'Circe, figlia del dio del sole Helios, cresce consapevole di essere diversa dagli altri dèi: non ha né la bellezza né il potere della sua stirpe, ma scopre la pharmakeia — la magia delle erbe — che le permette di trasformare esseri viventi. Dopo aver esercitato i suoi poteri in modo che Olimpo non può tollerare, viene esiliata sull\'isola di Aiaia, dove incontra nel corso della sua lunga vita alcune delle figure più celebri della mitologia greca: Dedalo, Minosse, Odisseo, Medea. Miller ridà voce a una figura marginale del mito con una prosa sensuale, psicologicamente ricca e femminista.',
        genre: 'Fantasy', pages: 393, year: 2018, tag: 'Mitologia', rating: 4.7, readers: '5.3M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 224, title: 'The Song of Achilles', author: 'Madeline Miller',
        desc: 'Patroclo, figlio di re esiliato e ragazzo goffo senza talenti evidenti, viene mandato alla corte del re Peleo e lì incontra Achille, figlio semi-divino destinato alla gloria. La loro amicizia si trasforma lentamente in qualcosa di più profondo e indissolubile, e quando la guerra di Troia chiama Achille al destino che la profezia gli ha assegnato — gloria breve e morte giovane o vita lunga nell\'oscurità — Patroclo lo segue sapendo cosa lo attende. Miller riscrive l\'Iliade dal punto di vista del personaggio più amato di Achille, con una prosa di grande lirismo e una storia d\'amore di rara intensità emotiva.',
        genre: 'Fantasy', pages: 378, year: 2012, tag: 'Mitologia', rating: 4.7, readers: '4.8M', chaptersCount: 36, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 225, title: 'Piranesi', author: 'Susanna Clarke',
        desc: 'Piranesi vive in una Casa infinita di sale marmoree, scale maestose e statue, dove il mare entra dalle finestre dei livelli inferiori e le nuvole fluttuano attraverso i corridoi superiori. Conosce solo un\'altra persona, chiamata l\'Altro, che lo incontra settimanalmente. Attraverso i diari che scrive con cura ossessiva, il lettore scopre gradualmente chi fosse Piranesi prima di dimenticarsi, come sia finito nella Casa e cosa voglia davvero l\'Altro da lui. Un romanzo breve ma di rara potenza immaginativa, che costruisce un atmosfera onirica e inquietante senza mai perdere umanità.',
        genre: 'Fantasy', pages: 272, year: 2020, tag: 'Surreale', rating: 4.6, readers: '2.9M', chaptersCount: 6, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 226, title: 'Jonathan Strange', author: 'Susanna Clarke',
        desc: 'Nell\'Inghilterra delle guerre napoleoniche, dove la magia era un tempo praticata da seri accademici inglesi prima di scomparire misteriosamente, il recluso Mr. Norrell emerge come il primo mago praticante da secoli. Prende come allievo il brillante Jonathan Strange, con cui forma una partnership destinata a spezzarsi drammaticamente, mentre entrambi si trovano ad affrontare il Gentiluomo dai Capelli come Cardi di Cardo, una creatura fatata la cui interferenza nei loro piani ha conseguenze imprevedibili. Clarke scrive con lo stile ironico e controllato di Austen applicato a una storia di magia epica, con note a piè di pagina che costruiscono un intera storia alternativa.',
        genre: 'Fantasy', pages: 846, year: 2004, tag: 'Storico', rating: 4.6, readers: '2.2M', chaptersCount: 76, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 227, title: 'The Night Circus', author: 'Erin Morgenstern',
        desc: 'Il Circo dei Sogni appare senza preavviso, aperto solo di notte, con tende bianche e nere che nascondono meraviglie inspiegabili — una foresta di ghiaccio, un labirinto di nuvole, una giostra di animali fantastici. Al centro del circo si svolge una sfida tra due maghi giovani — Celia e Marco — cresciuti da maestri rivali per competere in una gara di cui non conoscono le regole né la posta in gioco, e che si innamorano nel processo, intrecciando il loro destino a quello del circo e di tutti coloro che vi lavorano. Un romanzo di atmosfera fascinante, scritto con prosa che sa di incantesimo.',
        genre: 'Fantasy', pages: 387, year: 2011, tag: 'Atmosferico', rating: 4.5, readers: '4.7M', chaptersCount: 34, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80&fit=crop'
      },
      {
        id: 228, title: 'Six of Crows', author: 'Leigh Bardugo',
        desc: 'Kaz Brekker, il criminale più brillante e spietato di Ketterdam, viene ingaggiato per una missione apparentemente impossibile: infiltrarsi nell\'imprendibile Prigione di Ghiaccio e liberare uno scienziato che ha creato una droga capace di potenziare — e poi distruggere — i Grisha, i maghi del mondo. Raccoglie intorno a sé una banda di sei personaggi straordinariamente costruiti — ognuno con un passato doloroso e un\'abilità unica — in quello che diventa un ocean\'s eleven fantasy di ritmo serrato e dialoghi brillanti. Bardugo espande il suo Grishaverse con una storia più oscura e complessa della trilogia originale.',
        genre: 'Fantasy', pages: 465, year: 2015, tag: 'Heist', rating: 4.8, readers: '7.5M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&q=80&fit=crop'
      },
      {
        id: 229, title: 'Shadow and Bone', author: 'Leigh Bardugo',
        desc: 'Alina Starkov, orfana e cartografa militare del Ravka, scopre di possedere un potere straordinario di luce quando la sua unità attraversa la Piega — una barriera oscura e mostruosa che divide il paese — e viene portata nella Little Palace per essere addestrata dai Grisha, i maghi del Ravka. Lì il carismatico Generale Kirigan, il Darkling, la prende sotto la propria ala, convinto che il suo potere possa distruggere la Piega. Ma le sue motivazioni sono molto più oscure di quanto sembri. Bardugo fonde folklore russo e fantasy young adult in una storia di identità, potere e tradimento.',
        genre: 'Fantasy', pages: 358, year: 2012, tag: 'Young Adult', rating: 4.4, readers: '6.2M', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&q=80&fit=crop'
      },
      {
        id: 230, title: 'Fourth Wing', author: 'Rebecca Yarros',
        desc: 'Violet Sorrengail è stata preparata per tutta la vita per entrare nelle Scritture, ma sua madre — generale dell\'esercito — la costringe invece a competere per un posto alla Scuola dei Cavalieri di Drago di Basgiath, dove i candidati vengono uccisi dai draghi durante le selezioni se non vengono scelti. Nel brutale ambiente della scuola militare, Violet deve sopravvivere tra avversari che non le perdonano la sua fragilità fisica, mentre sviluppa una connessione inaspettata con il figlio del nemico della propria famiglia. Un romance fantasy esplosivo che ha conquistato milioni di lettori in tutto il mondo.',
        genre: 'Fantasy', pages: 517, year: 2023, tag: 'Draghi', rating: 4.5, readers: '8.9M', chaptersCount: 57, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── THRILLER ──────────────────
    thriller: [
      {
        id: 301, title: 'Gone Girl', author: 'Gillian Flynn',
        desc: 'La mattina del quinto anniversario di matrimonio di Nick e Amy Dunne, Amy scompare senza lasciare traccia nella loro casa nel Missouri. Le indagini della polizia rivelano presto che il matrimonio non era il paradiso che entrambi raccontavano al mondo, e Nick diventa rapidamente il principale sospettato. Flynn alterna le voci di Nick nel presente e di Amy attraverso i suoi diari, costruendo una narrativa di inaffidabilità totale in cui ogni capitolo ribalta la percezione del lettore sulla verità. Un thriller psicologico che è anche una feroce dissezione del matrimonio, delle aspettative di genere e della manipolazione mediatica.',
        genre: 'Thriller', pages: 422, year: 2012, tag: 'Psicologico', rating: 4.5, readers: '9.8M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300&q=80&fit=crop'
      },
      {
        id: 302, title: 'The Girl on the Train', author: 'Paula Hawkins',
        desc: 'Rachel Watson prende ogni mattina lo stesso treno pendolare che passa vicino alla sua vecchia casa dove abita l\'ex marito con la nuova moglie e il loro bambino, e ogni giorno osserva una coppia apparentemente felice che vive a qualche porta di distanza. Quando la donna che osservava scompare, Rachel — alcolizzata e con vuoti di memoria — sostiene di aver visto qualcosa la sera della scomparsa ma non riesce a ricordare esattamente cosa. Hawkins costruisce un thriller dalla struttura corale di tre voci femminili che si sovrappongono e si contraddicono, tenendo il lettore nell\'incertezza fino all\'ultimo.',
        genre: 'Thriller', pages: 336, year: 2015, tag: 'Psicologico', rating: 4.3, readers: '8.2M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1474506221399-ac56ba7ee9ae?w=300&q=80&fit=crop'
      },
      {
        id: 303, title: 'Il Codice da Vinci', author: 'Dan Brown',
        desc: 'Il professore di simbologia Robert Langdon viene chiamato al Louvre di Parigi dove il curatore Jacques Saunière è stato trovato morto in una posa criptata, con messaggi cifrati scritti sul proprio corpo e sul pavimento del museo. Insieme alla crittologa Sophie Neveu, nipote della vittima, Langdon viene coinvolto in una caccia al tesoro attraverso i simboli dell\'arte rinascimentale, la storia dei Cavalieri Templari e le teorie sulla discendenza di Maria Maddalena, braccato sia dalla polizia che da una setta religiosa assassina. Brown confeziona un thriller di ritmo cinematografico che ha fatto discutere il mondo intero.',
        genre: 'Thriller', pages: 454, year: 2003, tag: 'Cospirazioni', rating: 4.2, readers: '14.0M', chaptersCount: 105, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80&fit=crop'
      },
      {
        id: 304, title: 'Millennium', author: 'Stieg Larsson',
        desc: 'Il giornalista Mikael Blomkvist, fresco di condanna per diffamazione, viene ingaggiato dall\'anziano industriale Henrik Vanger per risolvere il mistero della scomparsa della nipote Harriet, avvenuta trent\'anni prima su un\'isola durante il blocco di un ponte. Con l\'aiuto di Lisbeth Salander, la straordinaria hacker con una memoria fotografica e un passato traumatico, Blomkvist scopre che dietro la scomparsa si cela una storia di violenza, misoginia e segreti familiari oscuri. Il primo volume di una trilogia svedese che ha rivoluzionato il noir europeo.',
        genre: 'Thriller', pages: 465, year: 2005, tag: 'Noir', rating: 4.6, readers: '10.5M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=300&q=80&fit=crop'
      },
      {
        id: 305, title: 'Big Little Lies', author: 'Liane Moriarty',
        desc: 'Tre madri di bambini della prima elementare a Pirriwee, sulla costa australiana — Madeline, la combattiva; Celeste, la bella che nasconde qualcosa; e Jane, la nuova arrivata con un segreto — si ritrovano al centro di un caso di omicidio durante la serata di raccolta fondi della scuola. Moriarty alterna la narrazione principale con le testimonianze dei testimoni nell\'aftermath, creando una struttura che rivela progressivamente la verità su tre matrimoni, una violenza domestica e le gerarchie crudeli tra le madri del quartiere bene. Un thriller sociale acuto, spesso divertente, sempre mordace.',
        genre: 'Thriller', pages: 460, year: 2014, tag: 'Sociale', rating: 4.4, readers: '5.7M', chaptersCount: 65, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&q=80&fit=crop'
      },
      {
        id: 306, title: 'Behind Closed Doors', author: 'B.A. Paris',
        desc: 'Jack e Grace Angel sembrano la coppia perfetta: lui avvocato di successo e affascinante, lei bella e devota, una relazione invidiata da tutti. Ma dietro le porte chiuse della loro villa perfetta si cela un incubo: Jack è un mostro controllante che ha trasformato la vita di Grace in una prigione senza sbarre, con la sorella minore di lei come arma di ricatto. Paris costruisce un thriller claustrofobico di abuso psicologico che alterna passato e presente, mostrando come si sviluppano le relazioni tossiche e quanto sia difficile fuggirne anche quando se ne è consapevoli.',
        genre: 'Thriller', pages: 294, year: 2016, tag: 'Psicologico', rating: 4.2, readers: '3.8M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80&fit=crop'
      },
      {
        id: 307, title: 'The Silent Patient', author: 'Alex Michaelides',
        desc: 'Alicia Berenson, pittrice di fama, smette di parlare dopo aver sparato cinque colpi al marito Gabriel senza fornire mai una spiegazione, lasciando solo un dipinto intitolato "Alcesti" come indizio. Lo psicoterapeuta Theo Faber è ossessionato dal suo caso e manovra per essere assegnato all\'unità di salute mentale dove lei è internata, convinto che sia la chiave per capire qualcosa su se stesso oltre che su di lei. Il colpo di scena finale del romanzo riscrive completamente tutto ciò che il lettore credeva di aver capito, in uno dei twist più riusciti degli ultimi anni.',
        genre: 'Thriller', pages: 336, year: 2019, tag: 'Psicologico', rating: 4.5, readers: '7.1M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 308, title: 'In the Woods', author: 'Tana French',
        desc: 'Il detective Rob Ryan è l\'unico sopravvissuto di un\'estate in cui due suoi amici d\'infanzia sono scomparsi nel bosco di Knocknaree, in Irlanda, senza che lui conservi alcun ricordo di cosa sia successo — un trauma che ha sepolto per tutta la vita. Quando un corpo di ragazza viene trovato proprio a Knocknaree, Ryan viene assegnato al caso insieme alla partner Cassie, portando con sé un segreto che potrebbe distruggere l\'indagine. French scrive un noir irlandese di rara qualità letteraria che intreccia il mistero del presente con quello del passato irrisolto.',
        genre: 'Thriller', pages: 429, year: 2007, tag: 'Noir', rating: 4.4, readers: '2.9M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 309, title: 'The Woman in the Window', author: 'A.J. Finn',
        desc: 'Anna Fox, ex psicologa infantile affetta da agorafobia, trascorre le giornate nella sua grande casa newyorkese spiando i vicini, bevendo vino e guardando film noir in bianco e nero. Quando crede di assistere a un crimine attraverso la finestra del vicino di fronte, nessuno le crede — inclusa la polizia — mettendo in dubbio la sua sanità mentale già compromessa. Finn costruisce un omaggio esplicito ai grandi classici del thriller hitchcockiano, con una narratrice inaffidabile per eccellenza e una tensione crescente che non permette mai al lettore di sentirsi al sicuro.',
        genre: 'Thriller', pages: 427, year: 2018, tag: 'Psicologico', rating: 4.2, readers: '4.3M', chaptersCount: 98, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 310, title: 'Sharp Objects', author: 'Gillian Flynn',
        desc: 'La giornalista Camille Preaker viene mandata nella sua città natale di Wind Gap, Missouri, per indagare sul caso di due ragazzine uccise in circostanze misteriose, ritrovandosi immersa in un ambiente familiare che l\'aveva devastata da bambina. Camille — che porta i segni fisici di anni di autolesionismo tatuati sotto forma di parole incise sulla propria pelle — deve fare i conti con la madre Adora, donna manipolativa con una malattia oscura, e la sorellastra adolescente Amma. Flynn esordisce con una storia che mescola thriller psicologico e dramma familiare con una crudeltà chirurgica.',
        genre: 'Thriller', pages: 254, year: 2006, tag: 'Dark', rating: 4.4, readers: '4.1M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 311, title: 'Dark Places', author: 'Gillian Flynn',
        desc: 'Libby Day è l\'unica sopravvissuta al massacro della sua famiglia avvenuto nel Kansas negli anni Ottanta, e la sua testimonianza aveva condannato il fratello Ben per l\'omicidio. Venticinque anni dopo, una società di appassionati di casi irrisolti la contatta offrendole denaro per riaprire il caso, e Libby — piatta e amorale come solo Flynn sa disegnare — inizia a scoprire che la verità è molto più complicata di quanto la bambina traumatizzata avesse percepito. Flynn costruisce un thriller che si muove tra passato e presente con maestria narrativa.',
        genre: 'Thriller', pages: 349, year: 2009, tag: 'Noir', rating: 4.3, readers: '3.2M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 312, title: 'The Good Girl', author: 'Mary Kubica',
        desc: 'Mia Dennett, figlia di un giudice di Chicago, viene rapita da Colin Thatcher, ma qualcosa di inaspettato accade durante la reclusione: tra rapitore e rapita si sviluppa un legame che trasforma la situazione in qualcosa di ben più complesso di un semplice sequestro. Il romanzo si costruisce attraverso più voci — la madre di Mia, il detective che indaga, Colin e infine Mia stessa — in una struttura temporale che avanza e arretra, rivelando progressivamente cosa sia veramente accaduto durante le settimane di prigionia e cosa Mia ricordi quando finalmente viene ritrovata.',
        genre: 'Thriller', pages: 347, year: 2014, tag: 'Rapimento', rating: 4.2, readers: '2.8M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 313, title: 'The Couple Next Door', author: 'Shari Lapena',
        desc: 'Anne e Marco Conti vanno alla cena dei vicini portando il baby monitor, lasciando la figlia Cora di sei mesi a dormire nell\'appartamento accanto — una scelta che si rivelerà fatale quando tornano a casa e trovano la culla vuota. Le indagini rivelano progressivamente che nessuno dei presenti alla cena quella sera stava dicendo la verità, inclusi i genitori disperati, e che i segreti che ogni personaggio cela possono riguardare direttamente la scomparsa della bambina. Lapena costruisce un thriller domestico di ritmo serrato con un cast di personaggi tutti potenzialmente colpevoli.',
        genre: 'Thriller', pages: 305, year: 2016, tag: 'Domestico', rating: 4.1, readers: '3.5M', chaptersCount: 62, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80&fit=crop'
      },
      {
        id: 314, title: 'The Last House Guest', author: 'Megan Miranda',
        desc: 'Avery Greer e Sadie Loman sono amiche inseparabili in una piccola città balneare del Maine dove la ricca famiglia Loman domina la vita sociale. Quando Sadie viene trovata morta nell\'estate successiva e la polizia archivia il caso come suicidio, Avery — che era l\'ultima ad averla vista viva — inizia a dubitare della versione ufficiale e a indagare tra i segreti della comunità. Miranda costruisce un thriller atmosferico che sfrutta magnificamente il contrasto tra la bellezza della costa del Maine e le tensioni di classe e segreti che covano sotto la superficie.',
        genre: 'Thriller', pages: 330, year: 2019, tag: 'Mistero', rating: 4.1, readers: '1.9M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 315, title: 'The Chalk Man', author: 'C.J. Tudor',
        desc: 'Nell\'estate del 1986 a Anderbury, Eddie e i suoi amici inventano un linguaggio segreto usando omini di gesso per comunicare. Quando trovano il corpo di una ragazza smembrata e gli omini iniziano ad apparire a indicarne le parti, l\'estate si trasforma in un incubo. Trent\'anni dopo, Eddie riceve una lettera con un omino di gesso che riporta a galla i segreti di quell\'estate, e uno dei testimoni di allora viene trovato morto. Tudor costruisce un thriller che si muove su due piani temporali con l\'abilità consumata di King, esplorando come i segreti d\'infanzia ci seguano per tutta la vita.',
        genre: 'Thriller', pages: 293, year: 2018, tag: 'Mistero', rating: 4.3, readers: '2.1M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 316, title: 'The Whisper Man', author: 'Alex North',
        desc: 'Dopo la morte della moglie, Tom Kennedy si trasferisce con il figlio Jake nella piccola città di Featherbank per ricominciare, ma la città porta i segni di un vecchio trauma: anni prima, un serial killer chiamato il Sussurratore aveva rapito e ucciso bambini, ed è ora in prigione. Quando un altro bambino scompare con le stesse modalità, il detective Pete Willis capisce che il Sussurratore ha un imitatore — o forse un complice rimasto libero. North intreccia la storia del padre in lutto con l\'indagine in un thriller emotivamente ricco e atmosferico.',
        genre: 'Thriller', pages: 352, year: 2019, tag: 'Serial Killer', rating: 4.4, readers: '2.5M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80&fit=crop'
      },
      {
        id: 317, title: 'Verity', author: 'Colleen Hoover',
        desc: 'La scrittrice in difficoltà economiche Lowen Ashleigh viene ingaggiata per completare la serie bestseller della celebre autrice Verity Crawford, rimasta gravemente invalida dopo un incidente, e si trasferisce nella loro villa nel Vermont per accedere ai materiali di ricerca. Tra i file trova un\'autobiografia non destinata alla pubblicazione in cui Verity descrive in dettaglio crimini orribili — ma è vera confessione o fiction? E il marito Jeremy, con cui Lowen sviluppa un\'attrazione irresistibile, cosa sa davvero della moglie? Hoover sfida il romanticismo con un thriller che non risparmia nessuno.',
        genre: 'Thriller', pages: 314, year: 2018, tag: 'Dark Romance', rating: 4.6, readers: '8.3M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 318, title: 'The Maid', author: 'Nita Prose',
        desc: 'Molly Gray è una cameriera d\'hotel con eccezionali capacità di ordine e pulizia e qualche difficoltà a interpretare le sfumature sociali, che trova profondo significato nel suo lavoro di ripristinare l\'ordine nel caos delle camere. Quando trova il corpo di un ricco ospite nella sua camera, Molly diventa la principale sospettata e deve decifrare il labirinto di bugie e interessi che circondano l\'Hôtel Coldwell con l\'aiuto di alleati inaspettati. Un thriller cozy e originale che offre anche una rappresentazione autentica e rispettosa della neuroatipicità.',
        genre: 'Thriller', pages: 304, year: 2022, tag: 'Cozy Mystery', rating: 4.4, readers: '3.1M', chaptersCount: 34, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 319, title: 'Still Life', author: 'Louise Penny',
        desc: 'Il Chief Inspector Armand Gamache viene chiamato nel pittoresco villaggio di Three Pines nel Quebec per indagare sulla morte di Jane Neal, anziana insegnante in pensione trovata nel bosco durante la caccia. Quello che sembra un incidente di caccia rivela presto una complessità di rancori, segreti e dinamiche di villaggio che Gamache, con la sua filosofia investigativa fatta di ascolto e pazienza, deve districare. Penny inaugura con questo romanzo una delle serie di mystery più amate degli ultimi due decenni, con un detective e un luogo di rara profondità.',
        genre: 'Thriller', pages: 312, year: 2005, tag: 'Cozy Mystery', rating: 4.5, readers: '2.3M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80&fit=crop'
      },
      {
        id: 320, title: 'The Thursday Murder Club', author: 'Richard Osman',
        desc: 'In un elegante villaggio-residenza per pensionati nel Kent, quattro anziani si riuniscono ogni giovedì per discutere casi di omicidio irrisolti — un\'attività innocua finché non viene ritrovato nelle vicinanze il cadavere di un costruttore. I quattro — Elizabeth, Joyce, Ibrahim e Ron — con le rispettive competenze di ex-spia, ex-infermiera, ex-psichiatra e ex-sindacalista, decidono di indagare in proprio mentre si trovano a fare da mentori a due detective locali impreparati. Osman firma una commedia gialla affettuosa e brillante che è anche un\'acuta riflessione sulla vecchiaia.',
        genre: 'Thriller', pages: 382, year: 2020, tag: 'Cozy Mystery', rating: 4.4, readers: '4.2M', chaptersCount: 64, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80&fit=crop'
      },
      {
        id: 321, title: 'The Plot', author: 'Jean Hanff Korelitz',
        desc: 'Jacob Finch Bonner, scrittore una volta promettente ora ridotto a insegnare in un mediocre MFA, ascolta durante un workshop il pitch di un romanzo che sa essere imbattibile — e quando lo studente muore senza averlo scritto, decide di appropriarsene e pubblicarlo come proprio. Il romanzo diventa un successo mondiale, ma qualcuno sa cosa ha fatto Jacob e inizia a tormentarlo con messaggi anonimi accusatori, costringendolo in una spirale di paranoia che mette a rischio tutto ciò che ha costruito con l\'inganno. Un thriller meta-letterario sulla paternità artistica, il furto di identità e la colpa.',
        genre: 'Thriller', pages: 320, year: 2021, tag: 'Meta-Fiction', rating: 4.2, readers: '2.8M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 322, title: 'Apples Never Fall', author: 'Liane Moriarty',
        desc: 'Stan e Joy Delaney, ex campioni di tennis che hanno dedicato la vita all\'accademia sportiva della famiglia, sembrano aver raggiunto la quiete della pensione quando Joy scompare improvvisamente e Stan diventa il principale sospettato. I quattro figli adulti, ognuno con le proprie ferite legate all\'infanzia sacrificata al tennis, iniziano a interrogarsi su cosa fosse davvero il matrimonio dei genitori sotto la superficie perfetta. Moriarty costruisce un thriller familiare che esplora il mito della famiglia felice e i modi in cui i genitori plasmano i figli nel bene e nel male.',
        genre: 'Thriller', pages: 480, year: 2021, tag: 'Familiare', rating: 4.3, readers: '3.4M', chaptersCount: 58, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 323, title: 'The Maidens', author: 'Alex Michaelides',
        desc: 'Mariana, terapista di gruppo a Londra, è ancora paralizzata dal dolore per la morte del marito quando la nipote Zoe la chiama da Cambridge: la sua migliore amica è stata trovata brutalmente assassinata. Convinta che il colpevole sia Edward Fosca, affascinante professore di greco antico con un gruppo segreto di studentesse chiamate le Maiden, Mariana inizia a indagare per conto proprio nonostante le prove sembrino scagionarlo. Michaelides porta il suo stile di thriller psicologico dai grandi colpi di scena nell\'ambiente suggestivo delle università di Cambridge.',
        genre: 'Thriller', pages: 384, year: 2021, tag: 'Psicologico', rating: 4.1, readers: '2.2M', chaptersCount: 48, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 324, title: 'Rock Paper Scissors', author: 'Alice Feeney',
        desc: 'Adam e Amelia Wright si recano in un castello diroccato in Scozia per quello che dovrebbe essere un fine settimana di riconciliazione per il loro matrimonio in crisi, ma la neve li isola dal mondo e iniziano a ricevere lettere anonime che rivelano segreti su ciascuno di loro. Feeney alterna la narrazione tra la voce di Adam nel presente e le lettere anonime del passato, costruendo una tensione claustrofobica in cui nessuno dei due personaggi — né il lettore — può fidarsi di nessuno. Un thriller coniugale che gioca abilmente con le aspettative di genere.',
        genre: 'Thriller', pages: 320, year: 2021, tag: 'Psicologico', rating: 4.2, readers: '2.7M', chaptersCount: 48, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 325, title: 'Local Woman Missing', author: 'Mary Kubica',
        desc: 'Nella tranquilla cittadina di Downers Grove, Illinois, la notte in cui la doula Shelby Tebow scompare camminando sola di notte, anche la sua cliente Meredith Dickey sparisce lasciando orfana la figlia Delilah di sei anni. Undici anni dopo, Delilah torna a casa camminando barcollante lungo la strada di campagna, e la sua ricomparsa riapre tutte le domande della doppia scomparsa. Kubica alterna le voci di Delilah, di sua madre prima della scomparsa e di altri testimoni in un puzzle narrativo che si rivela solo nell\'ultimo atto.',
        genre: 'Thriller', pages: 352, year: 2021, tag: 'Mistero', rating: 4.2, readers: '1.9M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 326, title: 'The Other Mrs', author: 'Mary Kubica',
        desc: 'Sadie e Will Foust si trasferiscono nella fredda isola del Maine dopo la morte della cognata, portando con sé i figli e l\'eredità di una casa che sente ancora dell\'altra donna. Quando la vicina viene trovata assassinata, Sadie diventa oggetto di sospetti — e lei stessa inizia a dubitare di se stessa, di Will e di ciò che è realmente accaduto quella notte. Kubica costruisce un thriller gotico ambientato in un\'isola isolata dove nessuno è ciò che sembra e il passato preme continuamente sul presente.',
        genre: 'Thriller', pages: 329, year: 2020, tag: 'Gotico', rating: 4.1, readers: '1.7M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80&fit=crop'
      },
      {
        id: 327, title: 'The Guest List', author: 'Lucy Foley',
        desc: 'Il matrimonio glamour di Jules Keegan, fondatrice di una rivista online, e Will Slater, star di un reality show sulla sopravvivenza, si tiene su un\'isola selvaggia al largo delle coste irlandesi, con un gruppo di ospiti selezionati e nessuna via di fuga quando la tempesta chiude il porto. La sera stessa del ricevimento, qualcuno tra gli ospiti viene ucciso — ma chi, e chi l\'ha fatto? Foley alterna i punti di vista di cinque personaggi prima, durante e dopo il matrimonio, rivelando progressivamente le reti di segreti e risentimenti che uniscono gli invitati.',
        genre: 'Thriller', pages: 321, year: 2020, tag: 'Whodunit', rating: 4.3, readers: '4.5M', chaptersCount: 48, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 328, title: 'The Hunting Party', author: 'Lucy Foley',
        desc: 'Un gruppo di amici dell\'università si retrova ogni Capodanno in una location remota, e quest\'anno hanno scelto un lodge di caccia in Scozia, nel mezzo di una tormenta di neve che li isola dal resto del mondo. Il primo gennaio, uno di loro viene trovato morto. Foley alterna la voce del detective che indaga con quella dei diversi ospiti nelle ore precedenti la morte, costruendo una struttura a puzzle in cui le amicizie longeve rivelano le proprie fratture, i risentimenti accumulati e i segreti che cambiano tutto.',
        genre: 'Thriller', pages: 321, year: 2019, tag: 'Whodunit', rating: 4.2, readers: '3.1M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80&fit=crop'
      },
      {
        id: 329, title: 'One by One', author: 'Ruth Ware',
        desc: 'Lo staff di una startup tecnologica di successo si ritira in un chalet di lusso sulle Alpi francesi per un team building aziendale, ma una valanga blocca l\'edificio isolandoli dal mondo proprio nel momento in cui i conflitti interni sull\'acquisizione dell\'azienda raggiungono il punto di ebollizione. Quando i membri del gruppo iniziano a morire uno a uno, i sopravvissuti devono capire chi tra loro abbia un motivo sufficiente per uccidere, con il freddo e l\'isolamento come alleati del killer. Ware costruisce un thriller claustrofobico da manuale.',
        genre: 'Thriller', pages: 384, year: 2020, tag: 'Claustrofobico', rating: 4.2, readers: '2.4M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 330, title: 'The Turn of the Key', author: 'Ruth Ware',
        desc: 'Rowan Caine scrive dal carcere all\'avvocato che spera la difenderà, raccontando come si sia ritrovata ad essere assunta come babysitter in una magnifica e tecnologicamente avanzata "Smart house" in Scozia — e come un bambino sia poi morto mentre lei era in servizio. Ware costruisce un thriller epistolare che rivisita "Il Giro di Vite" di Henry James in chiave moderna, usando la tecnologia della casa connessa per amplificare il senso di sorveglianza e paranoia, in un\'atmosfera gotica di rara efficacia.',
        genre: 'Thriller', pages: 357, year: 2019, tag: 'Gotico Moderno', rating: 4.3, readers: '2.1M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── ROMANZO ──────────────────
    romanzo: [
      {
        id: 401, title: 'Orgoglio e Pregiudizio', author: 'Jane Austen',
        desc: 'Elizabeth Bennet, seconda di cinque sorelle in una famiglia della gentry inglese dell\'inizio Ottocento, incontra il ricco e altezzoso Mr. Darcy a un ballo locale e tra loro nasce immediatamente un\'antipatia reciproca alimentata da orgoglio ferito e pregiudizio sociale. Mentre le sorelle cercano marito e la madre ansiosa trama combinazioni matrimoniali, Elizabeth e Darcy si ritrovano a rimettere in discussione le proprie prime impressioni attraverso una serie di incontri e rivelazioni che smontano le certezze di entrambi. Austen firma il romanzo sentimentale per eccellenza, di straordinaria modernità nell\'ironia, nella psicologia dei personaggi e nella critica sociale.',
        genre: 'Romanzo', pages: 432, year: 1813, tag: 'Classico', rating: 4.8, readers: '12.5M', chaptersCount: 61, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1474472226712-ac0f0961a954?w=300&q=80&fit=crop'
      },
      {
        id: 402, title: 'Cime Tempestose', author: 'Emily Brontë',
        desc: 'Heathcliff, trovatello oscuro adottato dal benvolente Mr. Earnshaw nelle brughiere dello Yorkshire, cresce amando appassionatamente Catherine, la figlia della famiglia, di un amore che supera ogni convenzione sociale e morale. Quando Catherine sceglie di sposare il ricco Edgar Linton per posizione sociale, Heathcliff scompare e ritorna anni dopo ricco e implacabile, deciso a vendicarsi di tutti coloro che lo hanno umiliato e a possedere in qualche modo ciò che gli è stato negato. Emily Brontë crea con il suo unico romanzo un\'opera di devastante intensità emotiva che esplora amore, vendetta e la violenza degli affetti umani.',
        genre: 'Romanzo', pages: 342, year: 1847, tag: 'Gotico', rating: 4.5, readers: '6.8M', chaptersCount: 34, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80&fit=crop'
      },
      {
        id: 403, title: 'Me Before You', author: 'Jojo Moyes',
        desc: 'Louisa Clark, ragazza allegra e stravagante di un piccolo villaggio inglese che perde il lavoro nella caffetteria locale, accetta per necessità economica di fare da caregiver a William Traynor, giovane ricco e brillante diventato tetraplegico in seguito a un incidente motociclistico e chiuso in un\'amarezza feroce verso la vita. Tra i due nasce un\'amicizia improbabile che si trasforma in qualcosa di più profondo, mentre Louisa scopre che Will ha preso una decisione irreversibile che lei tenterà disperatamente di cambiare. Un romanzo che affronta con rara onestà il tema dell\'eutanasia senza semplificazioni.',
        genre: 'Romanzo', pages: 369, year: 2012, tag: 'Romantico', rating: 4.5, readers: '7.3M', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80&fit=crop'
      },
      {
        id: 404, title: "L'Amore ai Tempi del Colera", author: 'Gabriel García Márquez',
        desc: 'Florentino Ariza si innamora follemente di Fermina Daza da adolescente e le giura amore eterno, ma lei lo rifiuta e sposa il dottor Juvenal Urbino, medico stimato e uomo di mondo. Per cinquantuno anni, nove mesi e quattro giorni, Florentino aspetta fedelmente mantenendo viva la propria fiamma attraverso centinaia di avventure amorose, convinto che quando il dottore morirà potrà tornare da Fermina. García Márquez intreccia una storia d\'amore di proporzioni mitiche con la rappresentazione vividissima di una città caraibica attraverso decenni di cambiamenti storici e sociali.',
        genre: 'Romanzo', pages: 348, year: 1985, tag: 'Realismo Magico', rating: 4.7, readers: '5.9M', chaptersCount: 6, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=300&q=80&fit=crop'
      },
      {
        id: 405, title: 'Dopo', author: 'Anna Todd',
        desc: 'Tessa Young arriva al college con il fidanzato di liceo Noah e con il sogno di una carriera universitaria brillante, ma il suo mondo ordinato viene sconvolto dall\'incontro con Hardin Scott, ragazzo tatuato e difficile con un passato doloroso che sembra andare deliberatamente contro ogni regola. Tra scontri e attrazione, Tessa e Hardin sviluppano una relazione intensa e turbolenta che mette alla prova entrambi in modo profondo. Originariamente scritto come fan fiction su Harry Styles, il romanzo ha conquistato milioni di giovani lettori diventando un fenomeno culturale globale.',
        genre: 'Romanzo', pages: 582, year: 2014, tag: 'Young Adult', rating: 4.1, readers: '9.5M', chaptersCount: 98, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80&fit=crop'
      },
      {
        id: 406, title: 'The Notebook', author: 'Nicholas Sparks',
        desc: 'Negli anni Quaranta nella Carolina del Nord, Noah Calhoun e Allie Nelson si innamorano durante un\'estate, ma la guerra e le differenze di classe li separano: Noah parte per il fronte, Allie si fidanza con un altro. Quattordici anni dopo, il giornale pubblica la foto della villa che Noah ha ristrutturato — la casa che aveva promesso ad Allie — e lei, ormai fidanzata ufficialmente, va da lui. Nel presente, un vecchio legge questo racconto a una donna anziana con l\'Alzheimer ogni giorno, sperando che il potere della storia riporti la memoria. Un romanzo romantico di delicata malinconia.',
        genre: 'Romanzo', pages: 214, year: 1996, tag: 'Romantico', rating: 4.4, readers: '8.1M', chaptersCount: 19, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80&fit=crop'
      },
      {
        id: 407, title: 'Outlander', author: 'Diana Gabaldon',
        desc: 'Claire Randall, ex infermiera militare in viaggio di piacere in Scozia nel 1945 con il marito dopo la fine della Seconda Guerra Mondiale, tocca un menhir del cerchio di pietre di Craigh na Dun e si ritrova catapultata nel 1743 nelle Highlands scozzesi, nel mezzo delle violente tensioni tra clan e soldati inglesi. Per sopravvivere, è costretta a sposare il giovane guerriero Jamie Fraser, e tra i due nasce un amore che dovrà sfidare il tempo stesso. Gabaldon firma la saga romantica storica per eccellenza, con un\'attenzione al dettaglio storico e alla costruzione dei personaggi di rara qualità.',
        genre: 'Romanzo', pages: 627, year: 1991, tag: 'Storico-Romantico', rating: 4.6, readers: '6.2M', chaptersCount: 43, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80&fit=crop'
      },
      {
        id: 408, title: 'The Fault in Our Stars', author: 'John Green',
        desc: 'Hazel Grace Lancaster, sedici anni e cancro ai polmoni, si reca controvoglia al gruppo di supporto per giovani malati di cancro dove incontra Augustus Waters, ex giocatore di basket rimasto con una gamba sola che ha l\'abitudine irresistibile di mettere sigarette non accese in bocca come metafora del rifiuto di lasciare che le cose lo distruggano. La loro relazione — brillante, ironica, appassionata e consapevole della propria brevità — li porta fino ad Amsterdam in cerca dell\'autore del romanzo preferito di Hazel. Green scrive su malattia e morte con rara onestà e umorismo.',
        genre: 'Romanzo', pages: 313, year: 2012, tag: 'Coming of Age', rating: 4.6, readers: '11.0M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80&fit=crop'
      },
      {
        id: 409, title: 'Beach Read', author: 'Emily Henry',
        desc: 'January Andrews, scrittrice di romanzi rosa, eredita la casa al lago del padre defunto e scopre che viveva lì con l\'amante — la stessa estate in cui January era con lui, il padre che credeva il matrimonio perfetto. Accanto alla casa vive Augustus Everett, suo vecchio rivale universitario e ora scrittore letterario di successo: i due fanno una scommessa per uscire dai blocchi creativi reciproci scambiando i generi letterari per l\'estate. Henry costruisce un romance intelligente che discute con ironia le aspettative sui generi letterari mentre sviluppa una storia d\'amore genuinamente commovente.',
        genre: 'Romanzo', pages: 361, year: 2020, tag: 'Romance', rating: 4.4, readers: '4.8M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?w=300&q=80&fit=crop'
      },
      {
        id: 410, title: 'People We Meet on Vacation', author: 'Emily Henry',
        desc: 'Alex e Poppy sono amici inseparabili da dieci anni nonostante siano opposti in tutto, e ogni estate si concedono un viaggio insieme che è diventato il momento più atteso dell\'anno per entrambi. Due anni fa, però, qualcosa è andato storto durante il viaggio a Croazia, e da allora non si parlano. Ora Poppy convince Alex a tentare ancora una volta, sperando che una settimana insieme possa riparare ciò che si è rotto — e scoprendo nel processo cosa fosse davvero la loro amicizia. Henry firma il suo secondo successo con un romance dalla struttura temporale intrecciata di grande efficacia emotiva.',
        genre: 'Romanzo', pages: 370, year: 2021, tag: 'Romance', rating: 4.5, readers: '5.5M', chaptersCount: 33, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80&fit=crop'
      },
      {
        id: 411, title: 'It Ends with Us', author: 'Colleen Hoover',
        desc: 'Lily Bloom si trasferisce a Boston con il sogno di aprire una fioreria e incontra il neurochirurgo Ryle Kincaid, bellissimo e intenso, che non vuole relazioni ma non riesce a stare lontano da lei. Mentre la relazione si sviluppa, Lily ritrova il diario adolescenziale in cui aveva scritto della sua storia con Atlas Corrigan, il ragazzo senza casa che suo padre maltrattava e lei aveva protetto — e Atlas torna nella sua vita. Hoover affronta il tema della violenza domestica con una delicatezza e un coraggio rari nel genere, senza semplificazioni né giudizi facili.',
        genre: 'Romanzo', pages: 368, year: 2016, tag: 'Romance', rating: 4.6, readers: '12.0M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&q=80&fit=crop'
      },
      {
        id: 412, title: 'November 9', author: 'Colleen Hoover',
        desc: 'Fallon e Ben si incontrano il 9 novembre — il giorno in cui Fallon lascia Los Angeles per New York — e in poche ore sviluppano una connessione così intensa che decidono di rivedersi ogni 9 novembre per cinque anni, senza contatti nel frattempo. Il romanzo segue ciascuno degli appuntamenti annuali, rivelando come entrambi cambino e crescano e come le verità che non si sono detti possano diventare nel tempo ostacoli insormontabili. Hoover costruisce una struttura narrativa elegante per una storia d\'amore che gioca con il tempo e la crescita personale.',
        genre: 'Romanzo', pages: 310, year: 2015, tag: 'Romance', rating: 4.5, readers: '7.2M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 413, title: 'Ugly Love', author: 'Colleen Hoover',
        desc: 'Tate Collins si trasferisce a San Francisco per un tirocinio da infermiera e incontra Miles Archer, pilota di linea silenzioso e misterioso che condivide l\'appartamento con suo fratello. Miles propone un accordo senza sentimenti: sesso senza aspettative e senza domande sul suo passato. Tate accetta, convinta di potersi proteggere emotivamente, ma man mano che i capitoli rivelano il trauma che ha spezzato Miles, capisce che alcune regole non possono essere rispettate. Hoover intreccia presente e passato in un\'alternanza di voci che aumenta la tensione emotiva capitolo dopo capitolo.',
        genre: 'Romanzo', pages: 321, year: 2014, tag: 'Romance', rating: 4.4, readers: '6.8M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 414, title: 'The Hating Game', author: 'Sally Thorne',
        desc: 'Lucy Hutton e Joshua Templeman condividono la scrivania di fronte nella nuova struttura aziendale risultante dalla fusione tra due case editrici, e fin dal primo giorno si dichiarano guerra con giochi psicologici competitivi e una rivalità ostentata che tiene in scacco tutto l\'ufficio. Quando l\'azienda annuncia che uno dei due sarà promosso, la competizione si fa ancora più intensa — fino a quando una serie di eventi li costringe a passare del tempo insieme e scoprire che l\'odio non era esattamente ciò che credevano. Un romance dal ritmo brillante e dialoghi taglienti.',
        genre: 'Romanzo', pages: 379, year: 2016, tag: 'Enemies to Lovers', rating: 4.4, readers: '5.1M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&q=80&fit=crop'
      },
      {
        id: 415, title: 'One Day in December', author: 'Josie Silver',
        desc: 'Laurie scorge da un autobus londonese un ragazzo che la guarda con la stessa intensità con cui lei guarda lui, e per un momento c\'è una connessione magica prima che l\'autobus riparta. Passa un anno a cercarlo senza successo, finché lui appare sulla porta di casa sua — come nuovo fidanzato della sua migliore amica Sarah. Nel corso di dieci anni e molti dicembri, Laurie e Jack si ritrovano ripetutamente a doversi misurare con ciò che sentono e con la lealtà verso Sarah. Silver costruisce un romanzo romantico lento e autentico sulla differenza tra l\'amore perfetto e l\'amore vero.',
        genre: 'Romanzo', pages: 390, year: 2018, tag: 'Romance', rating: 4.3, readers: '4.2M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 416, title: 'The Kiss Quotient', author: 'Helen Hoang',
        desc: 'Stella Lane è un\'econometrica di successo con sindrome di Asperger che si trova più a suo agio con i numeri che con le persone, e decide di assumere un escort professionista per imparare a fare sesso in modo soddisfacente. Michael Phan, metà americano e metà vietnamita, porta con sé il peso della propria famiglia e i propri sogni di stilista, e il loro accordo inizialmente professionale si complica rapidamente quando entrambi iniziano a sentire qualcosa di reale. Hoang scrive una storia d\'amore genuinamente originale con una rappresentazione autentica e affettuosa dell\'autismo.',
        genre: 'Romanzo', pages: 336, year: 2018, tag: 'Romance', rating: 4.4, readers: '3.8M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 417, title: 'The Spanish Love Deception', author: 'Elena Armas',
        desc: 'Catalina Martin accetta di portare un finto fidanzato al matrimonio della sorella in Spagna pur di smentire le bugie che aveva raccontato alla famiglia — e l\'unico volontario disponibile è Aaron Blackford, il suo saccente collega americano con cui ha un rapporto di ostentata ostilità. Quattro giorni in Spagna, un paese che ama, con la sua famiglia chiassosa e un uomo che non sopporta: ma Aaron si rivela molto diverso da come Catalina lo aveva catalogato. Armas firma un romance enemies-to-lovers ambientato in Spagna con calore, umorismo e personaggi indimenticabili.',
        genre: 'Romanzo', pages: 400, year: 2021, tag: 'Enemies to Lovers', rating: 4.3, readers: '4.7M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 418, title: 'Icebreaker', author: 'Hannah Grace',
        desc: 'Anastasia Allen è la stella della squadra di pattinaggio artistico del Maple Hills College, Nathan Hawkins è il capitano della squadra di hockey su ghiaccio maschile, e i due si trovano a condividere la pista di allenamento in orari sovrapposti per una serie di circostanze sfortunate. Le scaramucce quotidiane si trasformano gradualmente in qualcosa di molto più complicato quando Nathan offre protezione ad Anastasia da un ex molesto e tra loro nascono intimità e fiducia. Grace costruisce un romance sportivo universitario con personaggi ben costruiti e una tensione che si sviluppa organicamente.',
        genre: 'Romanzo', pages: 448, year: 2022, tag: 'Sports Romance', rating: 4.3, readers: '5.2M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 419, title: 'Happy Place', author: 'Emily Henry',
        desc: 'Harriet e Wyn erano la coppia perfetta fino a quando si sono lasciati cinque mesi fa — ma non lo hanno ancora detto ai loro migliori amici che hanno organizzato l\'ultima vacanza estiva nel cottage del Maine che amano tutti da anni. Per non rovinare l\'ultima estate tutti insieme prima che il cottage venga venduto, decidono di fingere di stare ancora insieme: sei giorni, una camera doppia, una recita convincente davanti a quattro amici intimi. Henry firma il suo romanzo più emotivo, che esplora cosa rimane di due persone che si amano quando le circostanze della vita li portano in direzioni diverse.',
        genre: 'Romanzo', pages: 392, year: 2023, tag: 'Romance', rating: 4.5, readers: '5.9M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 420, title: 'Things We Never Got Over', author: 'Lucy Score',
        desc: 'Naomi, scappata dal suo matrimonio il giorno delle nozze, arriva nella piccola città di Knockemout, Virginia, per trovare la sorella gemella Tina con cui non ha rapporti da anni — solo per scoprire che Tina è scomparsa lasciandole in custodia la nipote Waylay, una bambina di undici anni diffidente e selvatica. Knox Morgan, il burbero proprietario del bar locale con una reputazione da duro, finisce coinvolto suo malgrado nella situazione di Naomi. Score costruisce un romance small-town con personaggi secondari vivissimi e una protagonista alle prese con una trasformazione radicale.',
        genre: 'Romanzo', pages: 548, year: 2022, tag: 'Small Town Romance', rating: 4.4, readers: '6.3M', chaptersCount: 53, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1551269901-5c5e14c25df7?w=300&q=80&fit=crop'
      },
      {
        id: 421, title: 'Sense & Sensibility', author: 'Jane Austen',
        desc: 'Le sorelle Elinor e Marianne Dashwood, rimaste senza patrimonio alla morte del padre, si trovano a dover navigare la società inglese dell\'inizio Ottocento con risorse limitate e cuori vulnerabili: Elinor con il suo autocontrollo razionale nasconde un amore per il signor Edward Ferrars che non può esprimere, mentre Marianne si abbandona alla passione per il brillante e poco affidabile Willoughby. Austen contrappone con finezza le due filosofie di vita — ragione e sentimento — mostrando come entrambe abbiano i propri limiti e la propria saggezza, in uno dei suoi romanzi più emotivamente ricchi.',
        genre: 'Romanzo', pages: 374, year: 1811, tag: 'Classico', rating: 4.6, readers: '7.1M', chaptersCount: 50, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 422, title: 'Jane Eyre', author: 'Charlotte Brontë',
        desc: 'Jane Eyre, orfana tenace e di grande dignità interiore cresciuta in condizioni di miseria e sopruso, diventa istitutrice a Thornfield Hall, la misteriosa residenza del tormentato e carismatico Edward Rochester. Tra i due nasce un amore di rara intensità emotiva che deve confrontarsi con il segreto oscuro nascosto nell\'ala del terzo piano — e con la capacità di Jane di non rinunciare alla propria integrità morale nemmeno di fronte alla passione. Charlotte Brontë firma un romanzo di formazione e d\'amore che è anche una potente dichiarazione sull\'indipendenza femminile.',
        genre: 'Romanzo', pages: 532, year: 1847, tag: 'Gotico Romantico', rating: 4.7, readers: '8.4M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 423, title: 'The Seven Husbands', author: 'Taylor Jenkins Reid',
        desc: 'Monique Grant, giornalista poco ambiziosa con una carriera in stallo, ottiene l\'intervista impossibile: Evelyn Hugo, leggendaria attrice hollywoodiana degli anni Cinquanta e Sessanta, finalmente pronta a rivelare la verità sulla propria vita e i suoi sette matrimoni. Ma Evelyn ha le proprie ragioni per aver scelto Monique, e il motivo — rivelato nell\'atto finale — cambia tutto. Reid costruisce un romanzo che è contemporaneamente glamour e doloroso, esplorazione dell\'industria cinematografica americana, della bisessualità e di come le donne siano state costrette a sopravvivere in un mondo fatto di uomini.',
        genre: 'Romanzo', pages: 400, year: 2017, tag: 'Hollywood', rating: 4.7, readers: '8.9M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 424, title: 'Daisy Jones & the Six', author: 'Taylor Jenkins Reid',
        desc: 'Attraverso la forma del documentario musicale — interviste, aneddoti, ricordi contraddittori di ex-band member — Reid racconta l\'ascesa e il crollo definitivo di una delle band rock più celebri degli anni Settanta. Al centro c\'è la relazione esplosiva tra Daisy Jones, cantante carismatica e autodistruttiva, e Billy Dunne, leader della band con i propri demoni e una famiglia a casa. Reid cattura in modo straordinariamente credibile l\'estetica e le tensioni dell\'era rock con una struttura narrativa che fa uso magistrale della voce multipla e della contraddizione dei ricordi.',
        genre: 'Romanzo', pages: 368, year: 2019, tag: 'Rock n Roll', rating: 4.6, readers: '6.7M', chaptersCount: 17, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 425, title: 'Malibu Rising', author: 'Taylor Jenkins Reid',
        desc: 'Nel corso di una sola notte — quella del leggendario party annuale della fine dell\'estate a Malibu del 1983 — Reid racconta la storia dei quattro fratelli Riva, figli del famoso cantante country Mick Riva assente e irresponsabile, cresciuti insieme contro il mondo con la forza dell\'amore fraterno. Nina, la più grande e la surfista di fama mondiale che ospita la festa, vede quella notte implodere tutto ciò che aveva costruito mentre i segreti di famiglia vengono a galla uno a uno. Un romanzo multigenerazionale sulla famiglia, l\'amore e l\'impatto dei padri sui figli.',
        genre: 'Romanzo', pages: 368, year: 2021, tag: 'Familiare', rating: 4.5, readers: '5.3M', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 426, title: "The Time Traveler's Wife", author: 'Audrey Niffenegger',
        desc: 'Henry DeTamble è affetto da una condizione genetica che lo fa viaggiare involontariamente nel tempo — senza controllo su quando e dove andrà — mentre Clare Abshire, sua moglie, impara ad aspettarlo in un presente che lui continua ad abbandonare. Niffenegger racconta la loro storia d\'amore in ordine non lineare, con Henry che visita Clare da bambina e da adulta in un modo che sfida la logica causale e genera una storia emotivamente devastante sulla perdita, l\'attesa e il peso dell\'amore quando il tempo non si comporta come dovrebbe.',
        genre: 'Romanzo', pages: 518, year: 2003, tag: 'Fantascientifico-Romantico', rating: 4.5, readers: '6.4M', chaptersCount: 52, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 427, title: 'A Man Called Ove', author: 'Fredrik Backman',
        desc: 'Ove è un uomo burbero, rigido e apparentemente impossibile da sopportare: ogni giorno fa il giro del condominio a verificare che tutti rispettino le regole, litiga con i vicini e maledice il mondo moderno. Ma quando una famiglia rumorosa e caotica si trasferisce di fianco a lui, Ove si trova lentamente trascinato fuori dalla solitudine in cui viveva dopo la morte della moglie. Backman rivela il cuore spezzato e la storia d\'amore di trent\'anni che si nascondono dietro la scorza dura di Ove, in un romanzo che fa ridere e commuovere con straordinaria abilità.',
        genre: 'Romanzo', pages: 337, year: 2012, tag: 'Commovente', rating: 4.7, readers: '7.5M', chaptersCount: 43, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 428, title: 'Eleanor Oliphant', author: 'Gail Honeyman',
        desc: 'Eleanor Oliphant, ventinovenne dal vocabolario formale e dai modi socialmente incomprensibili, conduce una vita di rigidissima routine e solitudine radicale, bevendo vodka da sola ogni fine settimana e non essendo in grado di capire perché le persone la trovino strana. Quando incontra Raymond, un collega, e insieme salvano un vecchio svenuto per strada, Eleanor viene trascinata suo malgrado in relazioni umane che la costringeranno a fare i conti con il trauma devastante che ha sepolto. Honeyman scrive con cura e delicatezza straordinarie intorno a un personaggio indimenticabile.',
        genre: 'Romanzo', pages: 327, year: 2017, tag: 'Commovente', rating: 4.6, readers: '6.8M', chaptersCount: 37, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=300&q=80&fit=crop'
      },
      {
        id: 429, title: 'Normal People', author: 'Sally Rooney',
        desc: 'Connell e Marianne si conoscono al liceo in Irlanda: lui è il ragazzo popolare del campo sportivo, lei la strana solitaria che nessuno frequenta, ma tra loro c\'è una connessione intellettuale e fisica che li porterà a un rapporto clandestino di cui Connell ha paura di che cosa pensino gli amici. All\'università di Dublino i ruoli si invertono — Marianne fiorisce socialmente mentre Connell si sente spaesato — e il loro legame continua a spingersi e ritirarsi nel corso di anni. Rooney scrive con prosa densa e psicologica una storia generazionale sulla classe, il desiderio e la difficoltà di comunicare ciò che si sente davvero.',
        genre: 'Romanzo', pages: 273, year: 2018, tag: 'Contemporaneo', rating: 4.4, readers: '7.2M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&q=80&fit=crop'
      },
      {
        id: 430, title: 'Conversations with Friends', author: 'Sally Rooney',
        desc: 'Frances, studentessa universitaria di Dublino e poetessa, e la sua ex-fidanzata Bobbi entrano nell\'orbita di Melissa, fotografa di successo, e del marito Nick, attore affascinante e un po\' triste. Frances inizia una relazione clandestina con Nick che la trasformerà profondamente mentre mette alla prova la sua amicizia con Bobbi e la sua capacità di comunicare emozioni che ha sempre tenuto compresse sotto un\'ironia protettiva. Il romanzo di esordio di Rooney, già maturo nella sua capacità di cogliere le dinamiche di potere nelle relazioni intime.',
        genre: 'Romanzo', pages: 320, year: 2017, tag: 'Contemporaneo', rating: 4.3, readers: '4.1M', chaptersCount: 36, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1474506221399-ac56ba7ee9ae?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── FANTASCIENZA ──────────────────
    fantascienza: [
      {
        id: 501, title: 'Dune', author: 'Frank Herbert',
        desc: 'Paul Atreides, erede della Casa Atreides, si trasferisce con la famiglia sul pianeta desertico Arrakis — l\'unica fonte nell\'universo della Spezia melange, la sostanza più preziosa che esiste, capace di estendere la vita e consentire la navigazione spaziale interstellare. Quando il padre viene tradito e assassinato, Paul si rifugia nei deserti con la madre Jessica tra i Fremen, i nativi di Arrakis, e inizia a comprendere che potrebbe essere il Kwisatz Haderach — il supressore di spazio e tempo — atteso da secoli. Herbert costruisce un universo di complessità ecologica, politica e religiosa che ha definito il genere fantascientifico.',
        genre: 'Fantascienza', pages: 896, year: 1965, tag: 'Space Opera', rating: 4.8, readers: '12.0M', chaptersCount: 48, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80&fit=crop'
      },
      {
        id: 502, title: 'Foundation', author: 'Isaac Asimov',
        desc: 'Lo psicostorico Hari Seldon ha calcolato matematicamente che l\'Impero Galattico è destinato a collassare, inaugurando un\'era oscura di trentamila anni — ma con la giusta preparazione, quel periodo può essere ridotto a mille anni. Fonda una colonia di scienziati chiamata la Fondazione ai margini della galassia, con lo scopo di preservare la conoscenza umana e accelerare la ripresa. Asimov racconta attraverso secoli di storia galattica come la Fondazione sopravviva alle crisi previste e impreviste, in uno dei cicli di fantascienza più ambiziosi e influenti mai scritti.',
        genre: 'Fantascienza', pages: 255, year: 1951, tag: 'Classico', rating: 4.7, readers: '8.5M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80&fit=crop'
      },
      {
        id: 503, title: '1984', author: 'George Orwell',
        desc: 'Nella distopia totalitaria dell\'Oceania del 1984, il funzionario Winston Smith lavora al Ministero della Verità riscrivendo la storia passata in accordo con le direttive del Partito, mentre il Grande Fratello — che potrebbe non esistere come persona fisica — sorveglia ogni pensiero attraverso le telecamere e i Teleschermi. Quando Winston inizia una relazione clandestina con Julia e contatta l\'uomo che crede sia la resistenza, sta firmando la propria condanna. Orwell crea in questo romanzo il vocabolario del totalitarismo — Neolingua, Bispensiero, Grande Fratello — che ha permeato il discorso politico globale.',
        genre: 'Fantascienza', pages: 328, year: 1949, tag: 'Distopia', rating: 4.8, readers: '16.0M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&q=80&fit=crop'
      },
      {
        id: 504, title: 'Do Androids Dream', author: 'Philip K. Dick',
        desc: 'Nella San Francisco post-apocalittica del 1992, il cacciatore di taglie Rick Deckard riceve l\'incarico di "ritirare" — uccidere — sei androidi Nexus-6 sfuggiti dalle colonie di Marte, i più avanzati mai costruiti e quasi impossibili da distinguere dagli umani tramite il test dell\'empatia. Mentre dà la caccia agli androidi, Deckard si interroga su cosa significhi essere umano, se l\'empatia sia davvero esclusiva degli esseri organici e se le proprie motivazioni siano più automatiche di quelle dei robot che insegue. Dick costruisce una meditazione sulla coscienza che ha ispirato Blade Runner.',
        genre: 'Fantascienza', pages: 244, year: 1968, tag: 'Cyberpunk', rating: 4.6, readers: '5.2M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&q=80&fit=crop'
      },
      {
        id: 505, title: 'The Martian', author: 'Andy Weir',
        desc: 'Mark Watney, botanico e ingegnere della missione Ares 3 su Marte, viene lasciato per morto dopo una violenta tempesta di sabbia che costringe il resto dell\'equipaggio all\'evacuazione di emergenza. Vivo e da solo sul pianeta rosso, con provviste per qualche mese e nessun mezzo di comunicazione con la Terra, Mark mette in campo ogni grammo di ingegno scientifico e la propria irrefrenabile ironia per sopravvivere. Weir costruisce un thriller scientifico di precisione millimetrica con uno dei protagonisti più carismatici della fantascienza moderna.',
        genre: 'Fantascienza', pages: 369, year: 2011, tag: 'Hard SF', rating: 4.7, readers: '9.3M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&q=80&fit=crop'
      },
      {
        id: 506, title: "Ender's Game", author: 'Orson Scott Card',
        desc: 'In un futuro in cui la Terra è stata quasi distrutta da due invasioni aliene dei Formici, il governo seleziona i bambini più brillanti per addestrarli alla Battle School orbitante, dove simulazioni di combattimento preparano il futuro comandante della flotta umana. Andrew "Ender" Wiggin, sei anni, viene identificato come il candidato ideale e sottoposto a prove sempre più dure, socialmente e fisicamente, che lo isolano dagli altri ma affinano le sue capacità strategiche fino all\'impossibile. Card scrive un romanzo sulla leadership, il trauma infantile e il prezzo morale della guerra.',
        genre: 'Fantascienza', pages: 352, year: 1985, tag: 'Militare', rating: 4.7, readers: '7.8M', chaptersCount: 15, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&q=80&fit=crop'
      },
      {
        id: 507, title: 'Neuromancer', author: 'William Gibson',
        desc: 'Case è un ex-hacker del futuro prossimo che è stato neurologicamente punito dal proprio ex-capo per aver rubato: non può più accedere al cyberspazio, la matrice di dati globale dove i cowboy del consolato si muovono come fantasmi. Quando un misterioso datore di lavoro gli offre di guarirlo in cambio di un\'ultima missione di hacking contro una potente IA, Case si ritrova in un viaggio allucinante tra Tokyo, Istanbul e la colonia orbitante di Freeside. Gibson inventa con Neuromancer il vocabolario del cyberpunk e anticipa Internet con una chiaroveggenza letteraria straordinaria.',
        genre: 'Fantascienza', pages: 271, year: 1984, tag: 'Cyberpunk', rating: 4.5, readers: '4.3M', chaptersCount: 24, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=80&fit=crop'
      },
      {
        id: 508, title: "The Hitchhiker's Guide", author: 'Douglas Adams',
        desc: 'Arthur Dent ha appena scoperto che la sua casa sta per essere demolita per costruire un raccordo autostradale quando l\'intera Terra viene demolita da un\'astronave Vogon per costruire un\'autostrada iperspaziale — per fortuna il suo migliore amico Ford Prefect è in realtà un ricercatore alieno per la Guida Galattica per Autostoppisti e lo trascina con sé. Inizia così un viaggio interstellare assurdo e filosoficamente denso che Adams usa per satirizzare la condizione umana con un umorismo britannico di straordinaria finezza e invenzione linguistica.',
        genre: 'Fantascienza', pages: 193, year: 1979, tag: 'Umoristico', rating: 4.7, readers: '10.5M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 509, title: 'Brave New World', author: 'Aldous Huxley',
        desc: 'In un futuro lontano dove gli esseri umani sono prodotti in incubatrici e condizionati fin dalla nascita al proprio ruolo sociale con la droga del soma e la tecnologia del condizionamento, Bernard Marx è un Alfa — la casta superiore — che si sente fuori posto nella perfezione anestetizzata del Mondo Nuovo. Quando porta dalla Riserva dei Selvaggi John, figlio di una donna del Mondo Nuovo cresciuto con Shakespeare, l\'incontro tra le due culture rivela le crepe di una società costruita sulla felicità obbligatoria. Huxley firma una distopia che anticipa la società dei consumi con agghiacciante precisione.',
        genre: 'Fantascienza', pages: 311, year: 1932, tag: 'Distopia', rating: 4.6, readers: '8.7M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 510, title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin',
        desc: 'L\'inviato Genly Ai arriva sul pianeta Gethen per conto della Lega dei Mondi con lo scopo di convincere la nazione ad aderire all\'alleanza interplanetaria, ma si trova di fronte a una cultura che non riesce a comprendere: gli abitanti di Gethen sono ambisessuali, senza un sesso fisso, e questa differenza biologica ha prodotto una civilizzazione radicalmente diversa da qualsiasi altra. Il suo unico alleato diventa Estraven, un politico caduto in disgrazia, con cui intraprende un epico attraversamento glaciale. Le Guin usa il fantascientifico per esplorare genere, politica e empatia.',
        genre: 'Fantascienza', pages: 286, year: 1969, tag: 'Sociologico', rating: 4.6, readers: '3.1M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80&fit=crop'
      },
      {
        id: 511, title: 'Fahrenheit 451', author: 'Ray Bradbury',
        desc: 'In un\'America futura dove i libri sono proibiti e i pompieri non spengono incendi ma li appiccano bruciando le biblioteche, Guy Montag è un pompiere orgoglioso del proprio lavoro fino a quando un incontro con la giovane Clarisse — che lo spinge a interrogarsi sull\'utilità del pensiero — e la visione di una donna che sceglie di bruciare con la propria biblioteca lo mettono in crisi profonda. Bradbury scrive con Fahrenheit 451 una delle più appassionate difese della letteratura e del pensiero libero mai messe su carta.',
        genre: 'Fantascienza', pages: 158, year: 1953, tag: 'Distopia', rating: 4.7, readers: '11.0M', chaptersCount: 3, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80&fit=crop'
      },
      {
        id: 512, title: 'The War of the Worlds', author: 'H.G. Wells',
        desc: 'Il narratore senza nome racconta l\'invasione dell\'Inghilterra vittoriana da parte di marziani che arrivano in cilindri lanciati da Marte, portando macchine da guerra tripodi e raggi termici con cui distruggono sistematicamente la civiltà umana mentre la popolazione fugge in preda al panico. Wells — che scrive il romanzo come risposta alla colonizzazione britannica — mostra l\'umanità impotente e ridimensionata di fronte a una tecnologia superiore, e risolve la storia non con eroismo militare ma con la vulnerabilità dei conquistatori a microbi terrestri. Un classico fondativo della fantascienza.',
        genre: 'Fantascienza', pages: 192, year: 1898, tag: 'Invasione Aliena', rating: 4.5, readers: '6.3M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 513, title: 'Annihilation', author: 'Jeff VanderMeer',
        desc: 'Una biologa senza nome fa parte della dodicesima spedizione nella Zona X, una regione costiera americana isolata da un confine invisibile dove le regole della natura sembrano non applicarsi e le spedizioni precedenti sono tornate indietro cambiate, o non sono tornate affatto. All\'interno trovano un pozzo che la biologa chiama Torre, dal quale emana qualcosa di incomprensibile. VanderMeer scrive fantascienza weird di rara potenza atmosferica, in cui l\'ignoto non viene spiegato ma amplificato, creando un senso di meraviglia cosmica e terrore che non abbandona il lettore.',
        genre: 'Fantascienza', pages: 208, year: 2014, tag: 'Weird Fiction', rating: 4.3, readers: '3.5M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80&fit=crop'
      },
      {
        id: 514, title: 'The Three-Body Problem', author: 'Liu Cixin',
        desc: 'Durante la Rivoluzione Culturale cinese, la fisica Ye Wenjie assiste all\'uccisione del padre e viene inviata in un campo di lavoro, dove partecipa a un progetto segreto di comunicazione spaziale e prende una decisione che avrà conseguenze per l\'intera umanità. Nel presente, il fisico Wang Miao inizia a vedere conto alla rovescia nelle fotografie e viene coinvolto nelle indagini sulla morte misteriosa di scienziati di tutto il mondo, scoprendo un videogame chiamato Tre Corpi che cela la verità su un\'invasione aliena pianificata da secoli. Liu firma hard science fiction di ambizione cosmica.',
        genre: 'Fantascienza', pages: 400, year: 2008, tag: 'Hard SF', rating: 4.7, readers: '7.1M', chaptersCount: 34, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 515, title: 'Dark Forest', author: 'Liu Cixin',
        desc: 'Nell\'attesa dei quattrocento anni che separano l\'umanità dall\'arrivo della flotta Trisolaris, le nazioni si trovano di fronte al problema degli Spiriti Sofoni — sonde aliene capaci di ascoltare e spiare ogni conversazione e piano umano. Il Consiglio di Sicurezza ONU lancia il Progetto Dissuasori: quattro individui ricevono carta bianca assoluta per elaborare piani di difesa in completo isolamento. Il romanzo centrale della trilogia espande la Foresta Oscura — la teoria della cosmologia feroci che spiega il silenzio dell\'universo — in uno dei romanzi di fantascienza più ambiziosi del secolo.',
        genre: 'Fantascienza', pages: 512, year: 2008, tag: 'Hard SF', rating: 4.7, readers: '5.8M', chaptersCount: 39, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80&fit=crop'
      },
      {
        id: 516, title: 'Project Hail Mary', author: 'Andy Weir',
        desc: 'Ryland Grace si sveglia solo su un\'astronave a milioni di chilometri dalla Terra, senza ricordare chi sia né perché si trovi lì. Scopre gradualmente attraverso flash di memoria che è il superstite di una missione suicida per salvare l\'umanità da una catastrofe astrofisica che sta lentamente spegnendo il sole. Weir firma il suo romanzo più emozionante e inventivo, con una storia di scienza applicata, problem solving sotto pressione e — nella sua parte più originale e commovente — l\'incontro con la prima forma di vita aliena.',
        genre: 'Fantascienza', pages: 476, year: 2021, tag: 'Hard SF', rating: 4.9, readers: '5.5M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 517, title: 'Recursion', author: 'Blake Crouch',
        desc: 'A New York, il detective Barry Sutton indaga su un\'epidemia di Falsa Memoria — persone che all\'improvviso "ricordano" di aver vissuto vite completamente diverse. Nel frattempo, la neuroscienziata Helena Smith sta sviluppando una tecnologia per permettere ai pazienti di Alzheimer di conservare i propri ricordi — ma la sua invenzione si rivelerà capace di qualcosa di molto più destabilizzante per il tessuto della realtà. Crouch scrive un thriller fantascientifico ad alta tensione che usa il viaggio nel tempo non come gadget ma come strumento per esplorare rimpianto, scelta e identità.',
        genre: 'Fantascienza', pages: 342, year: 2019, tag: 'Viaggio nel Tempo', rating: 4.6, readers: '4.2M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 518, title: 'Dark Matter', author: 'Blake Crouch',
        desc: 'Jason Dessen, fisico universitario di Chicago con moglie e figlio adolescente che ha sacrificato la carriera per la famiglia, viene rapito una notte e si sveglia in un laboratorio dove tutti lo trattano come il brillante scienziato che è sempre stato nel mondo in cui ha fatto le scelte opposte. Intrappolato in un multiverso creato dalla propria ricerca, Jason deve attraversare mondi alternativi per tornare alla sua famiglia, mentre la propria coscienza si moltiplica in modi che mettono in discussione l\'identità stessa. Crouch scrive fantascienza accessibile di ritmo cinematografico.',
        genre: 'Fantascienza', pages: 342, year: 2016, tag: 'Multiverso', rating: 4.5, readers: '5.1M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 519, title: "Old Man's War", author: 'John Scalzi',
        desc: 'John Perry si arruola nell\'Esercito delle Forze di Difesa Coloniali il giorno del suo settantacinquesimo compleanno — perché è questa l\'età minima per arruolarsi, e in cambio si riceve un nuovo corpo giovane e potenziato per combattere nelle guerre interstellari per la colonizzazione dei pianeti. Scalzi rivisita Starship Troopers e The Forever War con ironia post-moderna e grande senso del ritmo, costruendo un universo militare fantascientifico che esplora cosa significhi combattere quando si ha già vissuto una vita intera.',
        genre: 'Fantascienza', pages: 362, year: 2005, tag: 'Militare', rating: 4.6, readers: '3.4M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 520, title: 'A Fire Upon the Deep', author: 'Vernor Vinge',
        desc: 'L\'universo di Vinge è diviso in Zone di Pensiero in cui le leggi della fisica — e dell\'intelligenza — funzionano diversamente: nei Margini è possibile viaggiare più veloce della luce e le intelligenze artificiali superumane prosperano. Quando una spedizione umana risveglia accidentalmente un\'entità di potere immenso, un\'astronave fugge con i soli dati che potrebbero distruggerla, naufragando su un pianeta di creature medievali dal gruppo-mind canino. Vinge costruisce una space opera di immagini cosmologiche straordinarie e grande ambizione concettuale.',
        genre: 'Fantascienza', pages: 613, year: 1992, tag: 'Space Opera', rating: 4.5, readers: '1.8M', chaptersCount: 46, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 521, title: 'Hyperion', author: 'Dan Simmons',
        desc: 'Sette pellegrini intraprendono il viaggio verso il pianeta Hyperion dove li attende lo Shrike, creatura temibile dall\'aspetto di croci di lame, mentre l\'universo umano è al bordo di una guerra totale con l\'IA degli Ousters. Nel corso del viaggio, ciascuno racconta la propria storia — che Simmons costruisce come variazioni di generi diversi: romanzo gotico, diari di guerra, storia d\'amore fantascientifica — rivelando come ognuno di loro sia legato al mistero di Hyperion. Un\'opera di ambizione strutturale unica nel panorama fantascientifico, ispirata ai Canterbury Tales.',
        genre: 'Fantascienza', pages: 482, year: 1989, tag: 'Space Opera', rating: 4.7, readers: '4.9M', chaptersCount: 7, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 522, title: 'The Road', author: 'Cormac McCarthy',
        desc: 'Un padre e suo figlio camminano verso sud attraverso un\'America post-apocalittica di cenere e silenzio, spingendo un carrello del supermercato con tutto ciò che possiedono, cercando di raggiungere il mare mentre evitano le bande di cannibali che setacciano il paesaggio desolato. McCarthy scrive senza virgolette, senza nomi dei personaggi, con una prosa minimalista che amplifica il peso di ogni pagina, costruendo una storia d\'amore paterno di devastante purezza in un mondo da cui ogni speranza sembra bandita — tranne quella che il padre porta per il figlio.',
        genre: 'Fantascienza', pages: 287, year: 2006, tag: 'Post-Apocalittico', rating: 4.7, readers: '6.8M', chaptersCount: 0, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 523, title: 'Station Eleven', author: 'Emily St. John Mandel',
        desc: 'Una pandemia influenzale di devastante mortalità spazza via il 99% della popolazione mondiale in pochi giorni. Vent\'anni dopo, una compagnia itinerante di teatro e musica percorre i Grandi Laghi americani portando Shakespeare alle comunità sopravvissute, con il motto: "Survival is insufficient." Mandel alterna presente e passato con eleganza magistrale, tessendo le storie di personaggi connessi dallo strano capo d\'opera di fumetti Station Eleven, esplorando cosa preserviamo quando tutto crolla e perché l\'arte sopravvive all\'apocalisse.',
        genre: 'Fantascienza', pages: 333, year: 2014, tag: 'Post-Apocalittico', rating: 4.6, readers: '4.3M', chaptersCount: 55, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 524, title: 'The Power', author: 'Naomi Alderman',
        desc: 'In un futuro prossimo le donne sviluppano il potere di generare scosse elettriche letali con le mani, ribaltando in pochi anni gli equilibri di potere della civiltà umana: gli uomini diventano la classe vulnerabile, i governi vengono scalzati, la religione riscritta. Alderman — guidata dalla mentore Margaret Atwood — costruisce un esperimento mentale rigoroso sulle strutture del potere, mostrando che il problema non è chi lo detiene ma il potere stesso. Un romanzo di fantascienza speculativa presentato come documento storico ritrovato.',
        genre: 'Fantascienza', pages: 386, year: 2016, tag: 'Speculativo', rating: 4.4, readers: '3.2M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 525, title: 'Exhalation', author: 'Ted Chiang',
        desc: 'Una raccolta di nove racconti che esplorano le domande più profonde della fantascienza — coscienza, libero arbitrio, identità, comunicazione con l\'altro — con una precisione concettuale e una profondità emotiva che pochi autori del genere hanno raggiunto. Il racconto che dà il titolo alla raccolta immagina un universo meccanico in cui un essere prende coscienza della propria natura mortale attraverso un\'esperienza di anatomia di sé stesso; altri racconti esplorano il paradosso del viaggio nel tempo, gli animali con parziale linguaggio e il rapporto con le macchine intelligenti. Chiang è il narratore breve più importante della fantascienza contemporanea.',
        genre: 'Fantascienza', pages: 340, year: 2019, tag: 'Racconti', rating: 4.8, readers: '2.7M', chaptersCount: 9, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 526, title: 'Stories of Your Life', author: 'Ted Chiang',
        desc: 'La prima raccolta di Chiang include il celebre racconto "Storia della tua vita", in cui una linguista impara il linguaggio di alieni chiamati Eptapodi e scopre che la loro percezione del tempo — simultanea invece che sequenziale — cambia fondamentalmente il modo in cui si comprende la propria vita. Il racconto ha ispirato il film Arrival ed è uno dei più belli della fantascienza moderna, accompagnato da altri sette racconti che spaziano dalla matematica alla religione alla fisica quantistica, tutti unificati dalla voce precisa e umana di Chiang.',
        genre: 'Fantascienza', pages: 281, year: 2002, tag: 'Racconti', rating: 4.8, readers: '2.4M', chaptersCount: 8, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 527, title: 'The Expanse', author: 'James S.A. Corey',
        desc: 'Due secoli nel futuro, l\'umanità ha colonizzato il sistema solare: la Terra è sovrappopolata e dominante, Marte è una potenza militare in ascesa, e le Cinture — gli asteroidi — vivono di estrazione mineraria in condizioni di miseria. Il detective Holden e la detective Miller si trovano al centro di una cospirazione intorno alla scomparsa di una giovane della Terra nelle Cinture, che rivela qualcosa di molto più grande: una tecnologia aliena di miliardi di anni che potrebbe cambiare o distruggere l\'umanità. Il primo volume di una delle space opera più cinematografiche degli ultimi anni.',
        genre: 'Fantascienza', pages: 561, year: 2011, tag: 'Space Opera', rating: 4.6, readers: '4.7M', chaptersCount: 55, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 528, title: 'Blindsight', author: 'Peter Watts',
        desc: 'Un oggetto alieno brucia nell\'atmosfera terrestre e poi scompare; mesi dopo, una trasmissione segnala qualcosa oltre Nettuno. La nave Theseus — con un equipaggio di specialisti cognitivamente modificati e guidata da un vampiro risvegliato dal Pleistocene — viene inviata a fare primo contatto. Watts scrive hard SF filosoficamente devastante che usa il contatto alieno per porre la domanda più radicale possibile: la coscienza è davvero necessaria all\'intelligenza, o è un errore evolutivo? Un romanzo che sfida il lettore scientificamente e filosoficamente ad ogni pagina.',
        genre: 'Fantascienza', pages: 384, year: 2006, tag: 'Hard SF', rating: 4.5, readers: '1.6M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 529, title: 'Snow Crash', author: 'Neal Stephenson',
        desc: 'Nel futuro prossimo degli Stati Uniti privatizzati, Hiro Protagonist — e sì, questo è il suo nome — è un pizzaiolo a Los Angeles e un guerriero-hacker nel Metaverso, la realtà virtuale tridimensionale che Gibson aveva anticipato e Stephenson disegna con dettagli che anticipano Internet. Quando una droga chiamata Snow Crash inizia a colpire sia i cervelli biologici che quelli digitali, Hiro si trova al centro di una cospirazione che risale ai linguisti della Mesopotamia antica. Stephenson inventa il termine "avatar" e il concetto di metaverso in un romanzo cyberpunk di energia inesauribile.',
        genre: 'Fantascienza', pages: 440, year: 1992, tag: 'Cyberpunk', rating: 4.5, readers: '4.0M', chaptersCount: 71, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80&fit=crop'
      },
      {
        id: 530, title: 'Ready Player One', author: 'Ernest Cline',
        desc: 'Nel 2045, la realtà è talmente desolante che la maggior parte dell\'umanità trascorre il tempo nell\'OASIS, un massiccio mondo virtuale dove tutto è possibile. Quando il suo creatore muore lasciando un\'eredità miliardaria al primo che troverà tre easter egg nascosti nel gioco, il diciottenne Wade Watts — alter ego Parzival nell\'OASIS — si trova in competizione con milioni di giocatori e con una corporation senza scrupoli per trovare gli indizi nascosti nella cultura pop degli anni Ottanta. Cline firma una lettera d\'amore entusiasta al gaming e alla cultura geek.',
        genre: 'Fantascienza', pages: 374, year: 2011, tag: 'Gaming', rating: 4.3, readers: '8.6M', chaptersCount: 39, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1488229297570-58520851e868?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── STORICO ──────────────────
    storico: [
      {
        id: 601, title: 'Il Nome della Rosa', author: 'Umberto Eco',
        desc: 'Il frate francescano Guglielmo da Baskerville e il suo novizio Adso da Melk arrivano in una abbazia benedettina del Nord Italia nel 1327, invitati per partecipare a un controverso incontro teologico, e si trovano invece al centro di una serie di morti misteriose tra i monaci. L\'abbazia custodisce una biblioteca labirintica e inaccessibile che nasconde un libro proibito, e Guglielmo — con metodo semiologico che anticipa di secoli Sherlock Holmes — deve risolvere il mistero prima che nuove morti accadano. Eco intreccia thriller medievale, filosofia, semiotica e storia della Chiesa in un romanzo di straordinaria erudizione.',
        genre: 'Storico', pages: 502, year: 1980, tag: 'Medievale', rating: 4.7, readers: '9.5M', chaptersCount: 7, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80&fit=crop'
      },
      {
        id: 602, title: 'Il Gattopardo', author: 'G. T. di Lampedusa',
        desc: 'Don Fabrizio Corbera, Principe di Salina, aristocratico siciliano di straordinaria intelligenza e statura fisica, osserva con lucidità distaccata e malinconica il tramonto della propria classe durante il Risorgimento — mentre Garibaldi sbarca in Sicilia e il vecchio mondo dei Borboni cede al nuovo regno d\'Italia. Il nipote Tancredi, che si unisce ai garibaldini con il celebre motto "bisogna che tutto cambi perché tutto rimanga com\'è", incarna il trasformismo gattopardesco. L\'unico romanzo di Lampedusa è considerato il capolavoro del Novecento italiano, un\'elegia per un mondo che scompare.',
        genre: 'Storico', pages: 319, year: 1958, tag: 'Risorgimento', rating: 4.8, readers: '5.3M', chaptersCount: 8, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1568133037310-90cd7b4d52c7?w=300&q=80&fit=crop'
      },
      {
        id: 603, title: 'Pillars of the Earth', author: 'Ken Follett',
        desc: 'Nell\'Inghilterra del XII secolo, durante il periodo di guerra civile chiamato "L\'Anarchia", il priore Philip sogna di costruire la cattedrale più bella dell\'Inghilterra nella piccola città di Kingsbridge, e il mastro costruttore Tom Builder trova nel progetto lo scopo che cercava dopo aver perso tutto. Nel corso di decenni, le vite di decine di personaggi si intrecciano intorno alla costruzione, tra lotte di potere tra vescovi e baroni, intrighi ecclesiastici e storie d\'amore. Follett trasforma l\'architettura medievale in narrativa pulsante, uno dei romanzi storici più letti del mondo.',
        genre: 'Storico', pages: 973, year: 1989, tag: 'Medievale', rating: 4.8, readers: '11.0M', chaptersCount: 9, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1548611635-9f2cac09fe65?w=300&q=80&fit=crop'
      },
      {
        id: 604, title: 'Gone with the Wind', author: 'Margaret Mitchell',
        desc: 'Scarlett O\'Hara, cocciuta e vitale figlia di una piantagione della Georgia, vede il proprio mondo dissolversi con la Guerra di Secessione Americana e lotta con tutte le sue forze per sopravvivere, ricostruire Tara e mantenere la propria famiglia, attraverso gli anni della Ricostruzione in un Sud sconfitto e umiliato. La sua storia si intreccia con quella del cinico e affascinante Rhett Butler, l\'unico che la veda per quello che è. Mitchell firma un affresco storico epocale e una storia romantica di proporzioni leggendarie, con la complessità e le contraddizioni della sua ambivalente protagonista.',
        genre: 'Storico', pages: 1037, year: 1936, tag: 'Guerra Civile Americana', rating: 4.6, readers: '14.0M', chaptersCount: 63, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80&fit=crop'
      },
      {
        id: 605, title: 'The Book Thief', author: 'Markus Zusak',
        desc: 'Liesel Meminger arriva nella città bavarese di Molching nel 1939 con la famiglia adottiva dei Hubermann, e sotto la guida del bonario Hans Hubermann impara a leggere — diventando ossessionata dai libri che ruba dalla biblioteca del sindaco e da un fuoco nazista. Nella cantina dei Hubermann viene nascosto il giovane ebreo Max, e tra lui e Liesel nasce un\'amicizia straordinaria. Il romanzo è narrato dalla Morte stessa, che trova in Liesel qualcosa che la meraviglia e commuove. Zusak scrive la Seconda Guerra Mondiale dalla prospettiva di un\'infanzia tedesca senza semplificazioni.',
        genre: 'Storico', pages: 552, year: 2005, tag: 'Seconda Guerra Mondiale', rating: 4.8, readers: '10.5M', chaptersCount: 88, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80&fit=crop'
      },
      {
        id: 606, title: 'All Quiet on the Western Front', author: 'Erich M. Remarque',
        desc: 'Paul Bäumer e i suoi compagni di liceo si arruolano entusiasti nella Prima Guerra Mondiale spinti dall\'entusiasmo patriottico dei loro insegnanti, ma nelle trincee delle Fiandre trovano qualcosa di completamente diverso dai discorsi eroici: fango, gas, morti indegne, disperazione e la graduale erosione di ogni illusione. Remarque — veterano lui stesso — scrive il più potente romanzo antibellico della storia, con una voce in prima persona che porta il lettore direttamente nel terrore quotidiano delle trincee e nella perdita di una generazione intera.',
        genre: 'Storico', pages: 296, year: 1929, tag: 'Prima Guerra Mondiale', rating: 4.8, readers: '8.9M', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1548611635-9f2cac09fe65?w=300&q=80&fit=crop'
      },
      {
        id: 607, title: 'The Kite Runner', author: 'Khaled Hosseini',
        desc: 'Amir, figlio di un ricco commerciante di Kabul, e Hassan, figlio del suo servitore e suo migliore amico, crescono insieme in un\'Afghanistan pre-sovietica che è ancora un mondo di aquiloni e melagrane. Il tradimento di Amir verso Hassan in un vicolo di Kabul nel 1975 lo perseguiterà per tutta la vita, attraverso la fuga in America dopo l\'invasione sovietica e il ritorno in un Afghanistan devastato dai Talebani. Hosseini scrive con una potenza emotiva diretta e senza calcolo, tessendo storia personale e storia politica in una narrativa sull\'amicizia, la colpa e la redenzione.',
        genre: 'Storico', pages: 372, year: 2003, tag: 'Afghanistan', rating: 4.7, readers: '12.0M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop'
      },
      {
        id: 608, title: 'A Thousand Splendid Suns', author: 'Khaled Hosseini',
        desc: 'Mariam, figlia illegittima costretta in un matrimonio infelice, e Laila, ragazza istruita e piena di speranze, si ritrovano ad essere entrambe mogli del brutale Rasheed a Kabul mentre l\'Afghanistan attraversa l\'invasione sovietica, la guerra civile e il regime talebano. Dalla rivalità iniziale nasce tra le due donne una solidarietà e un amore materno-filiale che diventa la loro unica speranza di sopravvivenza. Hosseini firma un romanzo sull\'oppressione femminile in Afghanistan di forza emotiva devastante, con due protagoniste indimenticabili.',
        genre: 'Storico', pages: 372, year: 2007, tag: 'Afghanistan', rating: 4.8, readers: '9.8M', chaptersCount: 51, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80&fit=crop'
      },
      {
        id: 609, title: 'I Promessi Sposi', author: 'Alessandro Manzoni',
        desc: 'Renzo e Lucia, due giovani fidanzati della Lombardia del XVII secolo, vedono il proprio matrimonio impedito dall\'arroganza del signorotto locale Don Rodrigo, che vuole Lucia per sé. La fuga, la separazione, la carestia, la guerra dei Trent\'Anni, la peste del 1630 — tutto il dramma della storia italiana confluisce nel romanzo fondativo della letteratura italiana moderna, con personaggi entrati nell\'uso comune come Fra\' Cristoforo, Don Abbondio, l\'Innominato e la Monaca di Monza. Un romanzo di fede, storia e umanità che ha formato la lingua italiana nazionale.',
        genre: 'Storico', pages: 665, year: 1827, tag: 'Italia Barocca', rating: 4.4, readers: '7.5M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80&fit=crop'
      },
      {
        id: 610, title: 'The Bronze Horseman', author: 'Paullina Simons',
        desc: 'Tatiana Metanova, diciassette anni a Leningrado nell\'estate del 1941, incontra il soldato Alexander nel giorno in cui Hitler invade l\'Unione Sovietica, e tra loro nasce immediatamente qualcosa di impossibile e inevitabile. Il romanzo si svolge durante l\'assedio di Leningrado — 872 giorni di fame, freddo e bombardamenti che uccisero un milione di persone — con la storia d\'amore di Tatiana e Alexander come cuore pulsante di una narrazione storica che non risparmia nulla dell\'orrore. Considerato da molti il più bel romanzo romantico storico mai scritto.',
        genre: 'Storico', pages: 832, year: 2000, tag: 'Seconda Guerra Mondiale', rating: 4.8, readers: '3.9M', chaptersCount: 41, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1568133037310-90cd7b4d52c7?w=300&q=80&fit=crop'
      },
      {
        id: 611, title: 'Birdsong', author: 'Sebastian Faulks',
        desc: 'La storia si sviluppa su tre piani temporali intrecciati: la Francia del 1910 con la storia d\'amore tra il giovane inglese Stephen Wraysford e la moglie del suo ospite; le trincee della Somme durante la Prima Guerra Mondiale dove Stephen combatte; e gli anni Ottanta in cui sua nipote cerca di scoprire chi fosse il nonno. Faulks scrive le battaglie della Prima Guerra Mondiale con una precisione e una forza visiva che eguagliano i migliori diari di guerra, e la storia d\'amore con una sensualità e una malinconia di grande qualità letteraria.',
        genre: 'Storico', pages: 502, year: 1993, tag: 'Prima Guerra Mondiale', rating: 4.6, readers: '3.2M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80&fit=crop'
      },
      {
        id: 612, title: 'The Nightingale', author: 'Kristin Hannah',
        desc: 'Due sorelle francesi — la prudente Vianne e la ribelle Isabelle — affrontano l\'occupazione nazista della Francia in modi radicalmente diversi: Vianne cerca di proteggere la propria figlia e sopravvivere, mentre Isabelle si unisce alla Resistenza e guida partigiani e piloti alleati abbattuti attraverso i Pirenei verso la Spagna. Hannah alterna le due voci con grande abilità drammatica, rendendo omaggio alle donne della Resistenza francese che la storia aveva dimenticato, in un romanzo che ha venduto milioni di copie in tutto il mondo.',
        genre: 'Storico', pages: 440, year: 2015, tag: 'Seconda Guerra Mondiale', rating: 4.8, readers: '8.7M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80&fit=crop'
      },
      {
        id: 613, title: 'Beneath a Scarlet Sky', author: 'Mark Sullivan',
        desc: 'Basato sulla vera storia di Pino Lella, giovane milanese che durante la Seconda Guerra Mondiale guida ebrei e rifugiati attraverso le Alpi verso la Svizzera a diciassette anni, poi si finge di entrare nelle Waffen-SS come autista di un generale nazista per spiare per la Resistenza. Sullivan ricostruisce la storia di Pino — di cui aveva perso i ricordi per decenni e li ha recuperati in tarda età — con dovizia di dettagli storici e una tensione narrativa da thriller. Una storia di coraggio straordinario in circostanze impossibili.',
        genre: 'Storico', pages: 391, year: 2017, tag: 'Seconda Guerra Mondiale', rating: 4.7, readers: '4.5M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop'
      },
      {
        id: 614, title: 'Code Name Verity', author: 'Elizabeth Wein',
        desc: 'Una giovane spia britannica catturata dalla Gestapo nella Francia occupata negozia di scrivere tutto ciò che sa sull\'aviazione britannica in cambio di tempo — tempo che usa per raccontare la storia della sua amicizia con la pilota che l\'ha portata in Francia. Il romanzo, scritto come documento autentico con due voci narrative che si rivelano progressivamente l\'una all\'altra, è un\'esplorazione straordinariamente commovente dell\'amicizia femminile in tempo di guerra, e contiene uno dei finali più devastanti della narrativa storica contemporanea.',
        genre: 'Storico', pages: 343, year: 2012, tag: 'Seconda Guerra Mondiale', rating: 4.7, readers: '2.8M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80&fit=crop'
      },
      {
        id: 615, title: 'The Alice Network', author: 'Kate Quinn',
        desc: 'Nel 1947, la giovane americana Charlie St. Clair — incinta e in fuga dalla famiglia che la vuole mandare in Svizzera per "sistemarsi" — e la cinica ex-spia inglese Eve Gardiner si trovano a collaborare nella ricerca di una cugina di Charlie scomparsa nella Francia occupata. Il romanzo alterna il presente del 1947 con il passato di Eve durante la Prima Guerra Mondiale, quando faceva parte della rete di spionaggio Alice operando come cameriera in un ristorante frequentato dagli ufficiali tedeschi. Quinn fa rivivere le eroine dimenticate della storia.',
        genre: 'Storico', pages: 522, year: 2017, tag: 'Spionaggio', rating: 4.6, readers: '3.5M', chaptersCount: 53, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80&fit=crop'
      },
      {
        id: 616, title: 'The Rose Code', author: 'Kate Quinn',
        desc: 'Tre donne — la debutante Osla Kendall, la matematica Mab Churt e la silenziosa Beth Finch — si ritrovano a Bletchley Park durante la Seconda Guerra Mondiale a decodificare i messaggi nazisti criptati di Enigma, stringendo un\'amicizia che verrà spezzata da un tradimento. Dieci anni dopo, alla vigilia dell\'incoronazione di Elisabetta II, si ritrovano a dover risolvere insieme un ultimo mistero legato ai loro giorni a Bletchley. Quinn rende omaggio alle migliaia di donne anonime che lavorarono nella decrittazione e la cui storia è rimasta segreta per decenni.',
        genre: 'Storico', pages: 608, year: 2021, tag: 'Seconda Guerra Mondiale', rating: 4.6, readers: '2.9M', chaptersCount: 60, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1548611635-9f2cac09fe65?w=300&q=80&fit=crop'
      },
      {
        id: 617, title: 'The Paris Wife', author: 'Paula McLain',
        desc: 'Hadley Richardson racconta la propria storia come prima moglie di Ernest Hemingway: l\'incontro a Chicago nel 1920, il matrimonio impulsivo, il trasferimento a Parigi dove Hemingway era determinato a diventare scrittore e dove frequentavano Gertrude Stein, Ezra Pound e Scott Fitzgerald. McLain ricostruisce con accuratezza storica e voce narrativa convincente la Parigi perduta degli anni Venti e il prezzo che Hadley pagò per essere la moglie di un uomo che metteva sempre la propria ambizione artistica al primo posto.',
        genre: 'Storico', pages: 320, year: 2011, tag: 'Anni Venti', rating: 4.4, readers: '3.1M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80&fit=crop'
      },
      {
        id: 618, title: 'Lincoln in the Bardo', author: 'George Saunders',
        desc: 'La notte dopo la sepoltura del figlio Willie, morto di febbre tifoide a undici anni nel febbraio 1862, il presidente Lincoln viene al cimitero Oak Hill e tiene in braccio il cadavere del figlio nella cripta. In quella stessa notte, Willie si trova nel bardo tibetano — uno spazio liminale tra vita e morte — in compagnia di decine di altri spiriti bloccati nell\'incapacità di accettare la propria morte. Saunders costruisce un romanzo formalmente sperimentale di straordinaria potenza emotiva, alternando le voci degli spiriti con frammenti di documenti storici reali.',
        genre: 'Storico', pages: 352, year: 2017, tag: 'Guerra Civile Americana', rating: 4.3, readers: '2.1M', chaptersCount: 166, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80&fit=crop'
      },
      {
        id: 619, title: 'Wolf Hall', author: 'Hilary Mantel',
        desc: 'Thomas Cromwell, figlio di un fabbro diventato il più potente consigliere di Enrico VIII, naviga con intelligenza pragmatica e glaciale la corte Tudor durante gli anni in cui il re annulla il matrimonio con Caterina d\'Aragona per sposare Anna Bolena, scontrandosi con la Chiesa di Roma e inaugurando la Riforma anglicana. Mantel scrive con la sua caratteristica voce in terza persona presente che rende Cromwell straordinariamente immediato, riabilitando una figura storicamente demonizzata con complessità psicologica. Premio Booker 2009.',
        genre: 'Storico', pages: 672, year: 2009, tag: 'Tudor', rating: 4.7, readers: '4.2M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1568133037310-90cd7b4d52c7?w=300&q=80&fit=crop'
      },
      {
        id: 620, title: 'Bring Up the Bodies', author: 'Hilary Mantel',
        desc: 'Il secondo volume della trilogia di Cromwell segue il declino e la caduta di Anna Bolena, di cui Enrico VIII si è stancato dopo tre anni di matrimonio — e Cromwell, che aveva contribuito alla sua ascesa, è ora lo strumento della sua distruzione. Mantel costruisce un thriller politico di precisi ingranaggi narrativi, mostrando come Cromwell orchestri il processo contro Anna con la stessa fredda efficienza con cui gestisce ogni cosa, pur portando con sé i fantasmi del proprio passato. Premio Booker 2012, il secondo consecutivo per Mantel.',
        genre: 'Storico', pages: 432, year: 2012, tag: 'Tudor', rating: 4.7, readers: '3.1M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop'
      },
      {
        id: 621, title: 'The Name of the Rose', author: 'Umberto Eco',
        desc: 'Versione inglese dello stesso romanzo di Eco già presente in questa lista, "The Name of the Rose" ha conquisto i lettori anglosassoni con la stessa forza con cui il testo italiano aveva conquistato il pubblico europeo. La traduzione di William Weaver preserva il ritmo e la densità erudita dell\'originale, permettendo all\'abbazia benedettina, ai suoi segreti e a Guglielmo da Baskerville di vivere in lingua inglese con piena efficacia narrativa. Un romanzo poliziesco medievale che è anche un\'enciclopedia della cultura del Medioevo.',
        genre: 'Storico', pages: 502, year: 1983, tag: 'Medievale', rating: 4.7, readers: '6.8M', chaptersCount: 7, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80&fit=crop'
      },
      {
        id: 622, title: 'The Physician', author: 'Noah Gordon',
        desc: 'Rob J. Cole, orfano nell\'Inghilterra medievale del XI secolo, scopre di possedere il Dono — la capacità di sentire la morte imminente attraverso il semplice tocco della mano. Apprendista da un barbiere-chirurgo itinerante, Rob decide di compiere il viaggio impossibile fino a Isfahan, in Persia, per studiare medicina alla scuola di Avicenna — il più grande medico del suo tempo — travestendosi da ebreo per essere ammesso. Gordon costruisce un romanzo d\'avventura e formazione di ampio respiro che è anche un\'appassionante storia della medicina medievale.',
        genre: 'Storico', pages: 640, year: 1986, tag: 'Medievale', rating: 4.7, readers: '5.5M', chaptersCount: 52, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80&fit=crop'
      },
      {
        id: 623, title: 'Shogun', author: 'James Clavell',
        desc: 'Nel 1600, il navigatore inglese John Blackthorne sopravvive a un naufragio e si ritrova nel Giappone feudale dei samurai, diventando strumento involontario dei giochi di potere tra i daimyo rivali in lotta per il titolo di Shogun. Attraverso gli occhi di Blackthorne — e degli interpreti che lo avvicinano — Clavell ricostruisce il Giappone del periodo Edo con minuzia antropologica e narrativa appassionante, in uno dei romanzi storici più amati del XX secolo che ha introdotto al grande pubblico occidentale la cultura giapponese.',
        genre: 'Storico', pages: 1210, year: 1975, tag: 'Giappone Feudale', rating: 4.7, readers: '6.2M', chaptersCount: 48, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1548611635-9f2cac09fe65?w=300&q=80&fit=crop'
      },
      {
        id: 624, title: 'Memoirs of a Geisha', author: 'Arthur Golden',
        desc: 'Chiyo Sakamoto viene venduta dalla famiglia all\'età di nove anni a una casa di geisha di Kyoto, e dopo anni di umiliazioni e addestramento emerge come Sayuri — una delle geisha più celebrate degli anni prima e durante la Seconda Guerra Mondiale. Golden ricostruisce con straordinaria cura il mondo chiuso e rituale delle geisha — le arti, le gerarchie, i meccenati, le rivalità — attraverso una voce in prima persona convincente che rende omaggio e mette in discussione un\'istituzione complessa e contraddittoria della cultura giapponese.',
        genre: 'Storico', pages: 434, year: 1997, tag: 'Giappone', rating: 4.6, readers: '8.1M', chaptersCount: 31, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1568133037310-90cd7b4d52c7?w=300&q=80&fit=crop'
      },
      {
        id: 625, title: 'The Last Kingdom', author: 'Bernard Cornwell',
        desc: 'Uhtred di Bebbanburg nasce sassone ma viene catturato e cresciuto tra i vichinghi danesi, e si trova a combattere — con ambivalenza e pragmatismo — dalla parte del re anglosassone Alfred il Grande nella lotta per il controllo dell\'Inghilterra nel IX secolo. Cornwell ricostruisce le battaglie dell\'era vichinga con la precisione tattica di un esperto militare e la voce narrativa avvincente di un romanziere di razza, in quello che è diventato uno dei cicli di romanzi storici più amati degli ultimi trent\'anni.',
        genre: 'Storico', pages: 334, year: 2004, tag: 'Vichinghi', rating: 4.7, readers: '5.1M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=300&q=80&fit=crop'
      },
      {
        id: 626, title: 'Gates of Fire', author: 'Steven Pressfield',
        desc: 'L\'unico sopravvissuto greco della battaglia delle Termopili — non uno dei trecento spartani ma un perieco, un non-cittadino — racconta la storia del re Leonida e dei suoi guerrieri a un amanuense del re persiano Serse dopo la battaglia. Pressfield ricrea la cultura spartana con immersione totale: l\'addestramento brutale, il culto del coraggio, la struttura militare, i legami tra guerrieri. Un romanzo di battaglia di potenza cinematografica che è anche una meditazione su cosa significhi morire per qualcosa che vale.',
        genre: 'Storico', pages: 386, year: 1998, tag: 'Grecia Antica', rating: 4.7, readers: '3.8M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80&fit=crop'
      },
      {
        id: 627, title: 'The Pillars of the Earth', author: 'Ken Follett',
        desc: 'Il romanzo considerato il capolavoro di Ken Follett segue la costruzione di una cattedrale gotica nell\'Inghilterra del XII secolo attraverso le vicende di tre generazioni di personaggi: il priore Philip che sogna la cattedrale perfetta, il mastro muratore Tom Builder che trova nello scopo la ragione di vivere, e Ellen e la sua stirpe selvaggia. Follett intreccia storia, politica ecclesiastica, architettura e storie personali in un affresco medievale di 973 pagine che si legge come un romanzo d\'avventura moderno.',
        genre: 'Storico', pages: 973, year: 1989, tag: 'Medievale', rating: 4.8, readers: '11.0M', chaptersCount: 9, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop'
      },
      {
        id: 628, title: 'Exodus', author: 'Leon Uris',
        desc: 'Il romanzo epico di Uris racconta la nascita dello Stato di Israele, dall\'immediato dopoguerra con le navi di rifugiati ebrei che cercano di raggiungere la Palestina britannica, alle guerre di indipendenza del 1948. Attraverso personaggi di finzione — Ari Ben Canaan, ex combattente della Haganah, e la crocerossina americana Kitty Fremont — Uris costruisce un panorama narrativo che abbraccia i kibbutz, il terrorismo della resistenza ebraica, i campi di profughi ciprioti e le battaglie del deserto. Un romanzo che ha formato l\'opinione pubblica mondiale su Israele.',
        genre: 'Storico', pages: 626, year: 1958, tag: 'Israele', rating: 4.5, readers: '4.7M', chaptersCount: 53, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80&fit=crop'
      },
      {
        id: 629, title: 'Centennial', author: 'James Michener',
        desc: 'Il romanzo epico di Michener racconta la storia della cittadina immaginaria di Centennial, Colorado, dalla formazione geologica delle Montagne Rocciose milioni di anni fa fino agli anni Settanta del Novecento, attraverso storie di dinosauri, mammut, nativi americani, esploratori europei, trapper, allevatori, cowboys e agricoltori che si succedono in quel pezzo di Grande Pianura. Un\'opera di straordinaria ambizione storica e geografica che usa la fiction per spiegare la formazione dell\'Ovest americano.',
        genre: 'Storico', pages: 909, year: 1974, tag: 'West Americano', rating: 4.5, readers: '2.9M', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=300&q=80&fit=crop'
      },
      {
        id: 630, title: 'The Bronze Age', author: 'Christian Cameron',
        desc: 'Cameron ricostruisce il mondo del Mediterraneo dell\'Età del Bronzo — l\'Egitto dei Ramses, la Grecia micenea, i popoli del mare, i Fenici e gli Ittiti — attraverso la storia di Daud, giovane guerriero che si trova al centro degli scontri tra le grandi civiltà del secondo millennio avanti Cristo. Con la stessa attenzione ai dettagli dell\'equipaggiamento militare e alla tattica che caratterizza la sua serie sull\'antica Grecia, Cameron porta il lettore in un\'era dimenticata con la precisione di uno storico e l\'energia di un narratore di battaglie.',
        genre: 'Storico', pages: 480, year: 2013, tag: 'Bronzo', rating: 4.3, readers: '850K', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1568133037310-90cd7b4d52c7?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── WESTERN ──────────────────
    western: [
      {
        id: 701, title: 'Blood Meridian', author: 'Cormac McCarthy',
        desc: 'Negli anni 1840-1850, un ragazzo senza nome del Tennessee si unisce a una banda di cacciatori di scalpi mercenari guidata dal brutale Capitan White nelle pianure di confine tra Texas e Messico, finendo per fare parte della banda del Giudice Holden, una figura di violenza cosmica e intelletto devastante. McCarthy scrive il western come epopea biblica della violenza, con una prosa poetica e spietata che non concede nulla al romanticismo del genere. Considerato il più grande romanzo americano del XX secolo da molti critici, il libro è tanto bello quanto inaccessibile.',
        genre: 'Western', pages: 351, year: 1985, tag: 'Violenza', rating: 4.5, readers: '2.8M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=300&q=80&fit=crop'
      },
      {
        id: 702, title: 'Lonesome Dove', author: 'Larry McMurtry',
        desc: 'Gli ex-Texas Ranger Gus McCrae e Woodrow Call partono con un gruppo di cowboy e una mandria di bovini dal Texas meridionale per il Montana, in quello che è il più epico cattle drive della narrativa western. McMurtry popola il romanzo di un cast memorabile — Deets, Newt, Jake Spoon, July Johnson e molti altri — e segue i loro destini lungo i mesi e le migliaia di miglia del viaggio con una malinconica consapevolezza che l\'era della frontiera sta finendo. Vincitore del Premio Pulitzer 1986, è il romanzo western definitivo.',
        genre: 'Western', pages: 945, year: 1985, tag: 'Frontiera', rating: 4.9, readers: '4.1M', chaptersCount: 141, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=80&fit=crop'
      },
      {
        id: 703, title: 'True Grit', author: 'Charles Portis',
        desc: 'Mattie Ross, quattordici anni e con più grinta dei cowboy del territorio indiano, vuole vendicare l\'assassinio del padre ucciso da uno scapestrato di nome Tom Chaney. Assume il marshal Rooster Cogburn — vecchio, alcolista e impietoso — perché ha la reputazione di essere duro, e insieme al Texas Ranger LaBoeuf seguono la pista di Chaney e della banda di Lucky Ned Pepper. Portis scrive un western narrato dalla voce adulta di Mattie, ormai anziana, con un umorismo secco e una dignità morale che rendono il romanzo unico nel genere.',
        genre: 'Western', pages: 215, year: 1968, tag: 'Vendetta', rating: 4.7, readers: '3.2M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80&fit=crop'
      },
      {
        id: 704, title: 'Riders of the Purple Sage', author: 'Zane Grey',
        desc: 'Jane Withersteen, proprietaria di un ranch nello Utah del 1871, si trova sotto la pressione crescente della comunità mormona locale che vuole costringerla a sposare un uomo di chiesa contro la propria volontà. Quando il pistolero solitario Lassiter arriva in suo aiuto e la sua amica viene rapita, la storia si trasforma in una caccia attraverso gli spettacolari canyon dello Utah che Grey descrive con una lirismo paesaggistico che nessun altro autore del genere ha eguagliato. Il romanzo western più venduto della prima metà del Novecento.',
        genre: 'Western', pages: 334, year: 1912, tag: 'Classico', rating: 4.4, readers: '3.8M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=300&q=80&fit=crop'
      },
      {
        id: 705, title: 'No Country for Old Men', author: 'Cormac McCarthy',
        desc: 'Llewelyn Moss trova sul deserto del Texas un\'enorme quantità di denaro che è l\'esito di un accordo di droga andato male, e decide di prenderla, scatenando la caccia spietata di Anton Chigurh — un assassino che usa una pistola ad aria compressa e un codice morale assurdo e assoluto — e del vecchio sceriffo Ed Tom Bell che cerca invano di arrivare prima di Chigurh. McCarthy scrive un noir western che è anche una meditazione sul male incontrollabile e sulla resa del mondo vecchio davanti all\'incomprensibilità del presente.',
        genre: 'Western', pages: 309, year: 2005, tag: 'Noir', rating: 4.7, readers: '5.1M', chaptersCount: 13, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 706, title: 'Deadwood', author: 'Pete Dexter',
        desc: 'La città mineraria di Deadwood nel Dakota del Sud nel 1876 è una città senza legge dove l\'oro porta le peggiori facce dell\'umanità. Wild Bill Hickok arriva con il suo compagno Charlie Utter, e Dexter ricostruisce gli ultimi giorni di Hickok prima dell\'assassinio con una prosa brutale e cinica che cattura perfettamente l\'anarchia e la violenza di Deadwood. Un western letterario che non ha niente del romanticismo di genere ma tutta la complessità morale di un grande romanzo americano.',
        genre: 'Western', pages: 384, year: 1986, tag: 'Storico', rating: 4.4, readers: '780K', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 707, title: 'Centennial', author: 'James Michener',
        desc: 'L\'epopea storica di Michener include alcune delle più belle pagine mai scritte sulla frontiera americana del West: i cacciatori di bisonti che decimano le mandrie, i cowboy che guidano le mandrie di bovini lungo il Chisholm Trail, i conflitti tra allevatori e agricoltori, e le comunità indigene che vedono il proprio mondo dissolversi. Michener tratta il West non con la romanticizzazione del genere ma con la precisione dello storico e la passione del narratore, costruendo un\'America multiculturale e contraddittoria.',
        genre: 'Western', pages: 909, year: 1974, tag: 'Epopea', rating: 4.5, readers: '2.9M', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 708, title: 'The Big Sky', author: 'A.B. Guthrie Jr.',
        desc: 'Boone Caudill fugge dalla famiglia opprimente del Kentucky e si unisce ai trapper e cacciatori di montagna degli anni 1830, penetrando nel territorio selvaggio e inesplorato delle Montagne Rocciose e delle Grandi Pianure in quella che è l\'ultima era dell\'uomo libero prima che la civiltà raggiunga anche i luoghi più remoti. Guthrie scrive uno dei romanzi della frontiera più autentici mai prodotti, con una precisione storica nella ricostruzione del mountain man e un senso della perdita per un\'America che stava già scomparendo nel momento in cui veniva scoperta.',
        genre: 'Western', pages: 386, year: 1947, tag: 'Mountain Men', rating: 4.5, readers: '1.2M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 709, title: 'Shane', author: 'Jack Schaefer',
        desc: 'Narrato dall\'occhio innocente del bambino Bob Starrett, Shane è la storia di un pistolero misterioso e silenzioso che si ferma nella valle dello Wyoming dove la famiglia Starrett e gli altri piccoli agricoltori sono minacciati dal grande allevatore Fletcher e dai suoi uomini. Shane aiuta la famiglia e difende la valle, ma il bambino capisce che Shane porta con sé qualcosa che lo rende diverso dagli altri — e che non potrà restare. Un western di rara purezza formale e potenza simbolica che ha definito il mito del pistolero solitario.',
        genre: 'Western', pages: 214, year: 1949, tag: 'Pistolero', rating: 4.6, readers: '3.5M', chaptersCount: 16, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80&fit=crop'
      },
      {
        id: 710, title: 'The Virginian', author: 'Owen Wister',
        desc: 'Il romanzo che ha fondato il genere western segue il narratore senza nome — un gentiluomo dell\'Est in visita nel Wyoming del 1874 — e il suo incontro con il Virginiano, un cowboy senza nome di fascino e codice morale assoluto che diventerà ranch manager e poi giudice nelle comunità della frontiera. La famosa scena dello scontro verbale al saloon ("Quando chiamate qualcuno con quella parola, sorridi!") ha definito il modello del conflitto western per un secolo. Un romanzo fondativo della cultura americana.',
        genre: 'Western', pages: 382, year: 1902, tag: 'Classico', rating: 4.4, readers: '2.1M', chaptersCount: 36, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 711, title: 'Hondo', author: 'Louis L\'Amour',
        desc: 'Hondo Lane è uno scout dell\'esercito americano di mezza età con un passato apache che trova una donna sola con un bambino nel territorio di guerra degli Apache durante le guerre dello Cochise degli anni 1870. La storia di Hondo, Angie e il figlio Johnny si sviluppa sullo sfondo di una delle ultime grandi campagne apaches, con L\'Amour che usa la sua enciclopedica conoscenza del West per costruire una storia di sopravvivenza e rispetto reciproco tra culture opposte. Uno dei bestseller western più venduti della storia.',
        genre: 'Western', pages: 190, year: 1953, tag: 'Apache', rating: 4.5, readers: '4.2M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 712, title: 'Flint', author: 'Louis L\'Amour',
        desc: 'James T. Kettleman, imprenditore di successo di New York che scopre di avere una malattia mortale, decide di tornare a morire nel West della propria giovinezza, nei deserti del Nuovo Messico dove era stato abbandonato da bambino. Ma il contatto con la terra risveglia l\'istinto di sopravvivenza di Flint — l\'uomo che era prima — e lo mette nel mezzo di una guerra per la terra tra un\'allevatrice vedova e un gentiluomo corrotto. L\'Amour scrive con la rapidità e la compattezza narrativa che lo hanno reso il western writer più letto della storia.',
        genre: 'Western', pages: 192, year: 1960, tag: 'Sopravvivenza', rating: 4.4, readers: '2.8M', chaptersCount: 21, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80&fit=crop'
      },
      {
        id: 713, title: 'Conagher', author: 'Louis L\'Amour',
        desc: 'Conn Conagher è un cowboy onesto e solitario che lavora per il ranch Ladder Five quando incontra Evie Teale, vedova con due bambini che vive in una stazione di posta isolata minacciata da una banda di fuorilegge. Tra i due si sviluppa una storia che L\'Amour racconta con il pudore e il rispetto tipici dei suoi migliori romanzi — l\'attrazione mai dichiarata, il rispetto reciproco, la durezza della vita nella frontiera. Uno dei romanzi western più amati di L\'Amour per la sua autenticità emotiva oltre che storica.',
        genre: 'Western', pages: 198, year: 1969, tag: 'Frontiera', rating: 4.5, readers: '2.3M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80&fit=crop'
      },
      {
        id: 714, title: 'The Ox-Bow Incident', author: 'Walter Van Tilburg Clark',
        desc: 'In una piccola città del Nevada nel 1885, la notizia dell\'assassinio di un allevatore scatena la formazione di un gruppo di vigilantes che cattura tre sospetti e li vuole impiccàre prima dell\'alba, nonostante l\'assenza di qualsiasi processo. Clark scrive uno dei più potenti romanzi americani sulla giustizia sommaria e sulla psicologia della folla, con una chiarezza morale assoluta sulla tragedia di ciò che sta accadendo e un analisi impietosa di come gli individui cedano alla violenza collettiva.',
        genre: 'Western', pages: 309, year: 1940, tag: 'Giustizia', rating: 4.6, readers: '1.5M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 715, title: 'To the Last Man', author: 'Zane Grey',
        desc: 'La Guerra delle Pietre dello Arizona degli anni 1880 — uno dei più violenti conflitti tra allevatori della storia americana — è lo sfondo di questa storia che vede le famiglie Isbel e Jorth in una faida sanguinosa che travolge tutti coloro che vi sono coinvolti. Grey costruisce la storia con la sua solita maestria paesaggistica e un senso tragico del destino che sovasta i personaggi, mostrando come i conflitti tribali si autoalimentino fino alla distruzione totale. Uno dei suoi romanzi più duri e meno romantici.',
        genre: 'Western', pages: 316, year: 1921, tag: 'Faida', rating: 4.3, readers: '1.8M', chaptersCount: 23, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80&fit=crop'
      },
      {
        id: 716, title: 'Warlock', author: 'Oakley Hall',
        desc: 'La città mineraria di Warlock, Arizona, priva di legge statale, assume il pistolero Clay Blaisedell come marshal privato per tenere a bada i fuorilegge. Nel corso del romanzo, Hall costruisce un affresco corale della comunità — il farmacista diario, il deputy Morgan, il cow-boy Curley Burne — che esplora la natura ambigua della giustizia privata, dell\'eroismo e della legittimità del potere con una profondità che supera di gran lunga le convenzioni del genere. Considerato uno dei romanzi western letterariamente più validi.',
        genre: 'Western', pages: 395, year: 1958, tag: 'Comunità', rating: 4.4, readers: '620K', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 717, title: 'The Son', author: 'Philipp Meyer',
        desc: 'Il romanzo multigenerazionale di Meyer segue la famiglia McCullough del Texas attraverso quasi due secoli di storia americana: Eli McCullough, catturato e cresciuto dai Comanche nel 1849; suo figlio Peter, che assiste al massacro di una famiglia messicana negli anni della Rivoluzione; e la pronipote Jeannie, che gestisce l\'impero petrolifero della famiglia negli anni Settanta. Meyer esplora senza edulcorazioni la conquista del Texas come storia di violenza, sopravvivenza e costruzione di identità. Un western letterario di ambizione pari a McCarthy.',
        genre: 'Western', pages: 562, year: 2013, tag: 'Saga Familiare', rating: 4.5, readers: '1.9M', chaptersCount: 57, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 718, title: "Butcher's Crossing", author: 'John Williams',
        desc: 'Will Andrews lascia Harvard nel 1873 e va nel Kansas per trovare la vita autentica, unendosi a una spedizione di cacciatori di bufali guidata dal misterioso Miller verso un\'impervia valle del Colorado dove sostiene che esistano migliaia di bisonti ancora incontaminati dalla caccia commerciale. La spedizione trova i bisonti — e Miller inizia il massacro più brutale e sistematico immaginabile, trasformando la ricerca di autenticità in una discesa negli inferi. Williams scrive un anti-western radicale sulla violenza della conquista americana.',
        genre: 'Western', pages: 309, year: 1960, tag: 'Anti-Western', rating: 4.5, readers: '890K', chaptersCount: 26, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80&fit=crop'
      },
      {
        id: 719, title: 'Appaloosa', author: 'Robert B. Parker',
        desc: 'I marshall Virgil Cole e Everett Hitch arrivano nella città mineraria di Appaloosa per fermare il rancher Bragg che terrorizza la città con i suoi uomini. Parker — meglio noto per la serie di Spenser — costruisce un western che porta nel genere la stessa ironia e complessità psicologica dei suoi noir urbani, con dialoghi serrati e una relazione tra Cole e Hitch che è il cuore del romanzo: due uomini che si conoscono e si fidano con la completezza che solo una lunga condivisione di pericoli può creare.',
        genre: 'Western', pages: 288, year: 2005, tag: 'Pistolero', rating: 4.5, readers: '1.4M', chaptersCount: 32, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 720, title: 'Comanche Moon', author: 'Larry McMurtry',
        desc: 'Il terzo volume della saga di Lonesome Dove in ordine cronologico segue il giovane Gus McCrae e Call — ancora Texas Ranger — nella loro campagna contro il guerriero Comanche Buffalo Hump, figura mitica e terrificante, e il pistolero messicano Joey Garza. McMurtry racconta il Texas degli anni 1850-1860 con la stessa maestria che ha applicato all\'era post-Guerra Civile in Lonesome Dove, costruendo personaggi secondari memorabili e scene di battaglia di grande potenza visiva.',
        genre: 'Western', pages: 752, year: 1997, tag: 'Frontiera', rating: 4.6, readers: '1.8M', chaptersCount: 79, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 721, title: "Dead Man's Walk", author: 'Larry McMurtry',
        desc: 'Il primo volume prequel della saga di Lonesome Dove segue il giovane Gus McCrae e Woodrow Call nella loro prima avventura come Texas Rangers, una spedizione disastrosa attraverso il deserto del Texas e il Messico che li vede affrontare gli Apache, i soldati messicani e la brutalità del deserto. McMurtry mostra come i due uomini che diventano leggenda in Lonesome Dove siano stati formati dalla sofferenza e dalla sopravvivenza in condizioni estreme, rivelando il carattere sotto pressione.',
        genre: 'Western', pages: 477, year: 1995, tag: 'Frontiera', rating: 4.5, readers: '1.5M', chaptersCount: 55, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 722, title: 'The Shootist', author: 'Glendon Swarthout',
        desc: 'John Bernard Books, l’ultimo dei grandi pistoleri, arriva a El Paso per morire in pace, ma il suo passato non gli dà tregua. Un romanzo crepuscolare che riflette sulla fine di un’epoca e sulla dignità della morte, con una tensione morale che trascende il genere.',
        genre: 'Western', pages: 224, year: 1975, tag: 'Leggenda', rating: 4.7, readers: '850K', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 723, title: 'Elmore Leonard\'s West', author: 'Elmore Leonard',
        desc: 'Una raccolta dei migliori racconti western del maestro del crime. Leonard applica il suo orecchio assoluto per il parlato e il suo realismo sporco alla frontiera, popolando queste storie di uomini comuni che si trovano a gestire situazioni straordinarie e letali.',
        genre: 'Western', pages: 416, year: 1998, tag: 'Antologia', rating: 4.3, readers: '500K', chaptersCount: 15, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 724, title: 'Valdez is Coming', author: 'Elmore Leonard',
        desc: 'Bob Valdez, un vice sceriffo di mezza età spesso sottovalutato, viene costretto a una vendetta implacabile dopo essere stato umiliato da un ricco proprietario terriero. Un classico racconto di giustizia privata che brilla per ritmo e caratterizzazione.',
        genre: 'Western', pages: 208, year: 1970, tag: 'Vendetta', rating: 4.6, readers: '920K', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 725, title: 'The Last Stand', author: 'Nathaniel Philbrick',
        desc: 'Un’accurata ricostruzione storica della battaglia di Little Bighorn. Philbrick intreccia le biografie di Custer e Toro Seduto per spiegare come lo scontro di due culture abbia portato a uno dei momenti più iconici e tragici della storia americana.',
        genre: 'Western', pages: 496, year: 2010, tag: 'Storia', rating: 4.8, readers: '1.1M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 726, title: 'Empire of the Summer Moon', author: 'S.C. Gwynne',
        desc: 'La straordinaria epopea dei Comanche, la tribù più potente della storia americana. Al centro della narrazione vi è la figura di Quanah Parker, il capo guerriero nato dall\'unione tra un guerriero e una donna bianca rapita, Cynthia Ann Parker.',
        genre: 'Western', pages: 384, year: 2010, tag: 'Comanche', rating: 4.9, readers: '2.3M', chaptersCount: 22, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 727, title: 'Bury My Heart at Wounded Knee', author: 'Dee Brown',
        desc: 'Un saggio fondamentale che ha cambiato la percezione del West, raccontando la conquista della frontiera dal punto di vista dei nativi americani. Un libro doloroso, documentato e necessario sulle promesse tradite e il genocidio delle tribù indiane.',
        genre: 'Western', pages: 512, year: 1970, tag: 'Documento', rating: 4.9, readers: '3.5M', chaptersCount: 19, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 728, title: 'The Way West', author: 'A.B. Guthrie Jr.',
        desc: 'Vincitore del premio Pulitzer, il romanzo segue una carovana di pionieri in viaggio dal Missouri verso l\'Oregon nel 1845. Guthrie cattura con maestria la fatica, le speranze e la durezza quotidiana di chi ha costruito l\'America un passo alla volta.',
        genre: 'Western', pages: 448, year: 1949, tag: 'Pionieri', rating: 4.5, readers: '700K', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 729, title: 'Ride the Wind', author: 'Lucia St. Clair Robson',
        desc: 'La versione romanzata della vita di Cynthia Ann Parker. Rapita dai Comanche a nove anni, la bambina diventa una donna della tribù, scegliendo di restare con il suo nuovo popolo anche quando i coloni cercheranno di "salvarla". Un’immersione totale nella cultura nativa.',
        genre: 'Western', pages: 560, year: 1982, tag: 'Cultura', rating: 4.6, readers: '1.2M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 730, title: 'The Buffalo Hunters', author: 'Mari Sandoz',
        desc: 'Un resoconto vivido della distruzione sistematica delle grandi mandrie di bisonti nelle Grandi Pianure tra il 1860 e il 1880. Sandoz analizza l\'impatto devastante che questa caccia ebbe sia sull\'ambiente che sull\'economia di sussistenza dei nativi.',
        genre: 'Western', pages: 372, year: 1954, tag: 'Frontiera', rating: 4.4, readers: '400K', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── AVVENTURA ──────────────────
    avventura: [
      {
        id: 801, title: "L'Isola del Tesoro", author: 'R.L. Stevenson',
        desc: 'Il giovane Jim Hawkins trova una mappa del tesoro e si imbarca in un viaggio verso mari ignoti. Tra pirati traditori come Long John Silver e pericoli costanti, Stevenson crea il prototipo del romanzo d\'avventura moderno, dove il confine tra bene e male è sottile.',
        genre: 'Avventura', pages: 280, year: 1883, tag: 'Pirati', rating: 4.8, readers: '10M', chaptersCount: 34, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300&q=80&fit=crop'
      },
      {
        id: 802, title: 'Robinson Crusoe', author: 'Daniel Defoe',
        desc: 'Dopo un naufragio, Crusoe sopravvive da solo su un\'isola deserta per ventotto anni. Un’opera che celebra l\'ingegno umano e la capacità di adattamento, diventando un simbolo universale della lotta dell\'uomo contro la natura ostile.',
        genre: 'Avventura', pages: 320, year: 1719, tag: 'Sopravvivenza', rating: 4.3, readers: '8M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=300&q=80&fit=crop'
      },
      {
        id: 803, title: 'Into the Wild', author: 'Jon Krakauer',
        desc: 'La storia vera di Christopher McCandless, che abbandona la civiltà per cercare se stesso nelle terre selvagge dell\'Alaska. Krakauer indaga le motivazioni psicologiche di una scelta estrema che oscilla tra idealismo puro e imprudenza fatale.',
        genre: 'Avventura', pages: 224, year: 1996, tag: 'Natura', rating: 4.7, readers: '5.5M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 804, title: 'Around the World in 80 Days', author: 'Jules Verne',
        desc: 'Phileas Fogg accetta una scommessa impossibile: circumnavigare il globo in soli ottanta giorni. Un viaggio frenetico attraverso culture e tecnologie emergenti dell\'Ottocento, accompagnato dal fedele maggiordomo Passepartout.',
        genre: 'Avventura', pages: 250, year: 1872, tag: 'Viaggio', rating: 4.6, readers: '7M', chaptersCount: 37, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&q=80&fit=crop'
      },
      {
        id: 805, title: 'The Call of the Wild', author: 'Jack London',
        desc: 'Buck, un cane domestico, viene venduto come cane da slitta durante la corsa all\'oro del Klondike. La narrazione segue il suo progressivo ritorno allo stato selvaggio, in un inno alla forza primordiale e all\'istinto di sopravvivenza.',
        genre: 'Avventura', pages: 160, year: 1903, tag: 'Animali', rating: 4.8, readers: '4M', chaptersCount: 7, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80&fit=crop'
      },
      {
        id: 806, title: 'Life of Pi', author: 'Yann Martel',
        desc: 'Dopo un naufragio nell\'Oceano Pacifico, un ragazzo indiano di nome Pi si ritrova su una scialuppa con una tigre del Bengala. Una parabola magica e filosofica sulla fede, la narrazione e la volontà ferrea di non arrendersi.',
        genre: 'Avventura', pages: 352, year: 2001, tag: 'Spirituale', rating: 4.5, readers: '6M', chaptersCount: 100, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&q=80&fit=crop'
      },
      {
        id: 807, title: 'The Old Man and the Sea', author: 'Ernest Hemingway',
        desc: 'La battaglia epica tra un anziano pescatore cubano e un gigantesco marlin. In uno stile asciutto e potente, Hemingway racconta la dignità della sconfitta e il rispetto tra il cacciatore e la sua preda.',
        genre: 'Avventura', pages: 128, year: 1952, tag: 'Classico', rating: 4.7, readers: '9M', chaptersCount: 1, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 808, title: 'Twenty Thousand Leagues', author: 'Jules Verne',
        desc: 'Il capitano Nemo solca gli abissi a bordo del Nautilus, una meraviglia tecnologica isolata dal resto dell\'umanità. Un’avventura sottomarina che mescola anticipazioni scientifiche e spirito di ribellione politica.',
        genre: 'Avventura', pages: 400, year: 1870, tag: 'Sottomarino', rating: 4.7, readers: '5M', chaptersCount: 47, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&q=80&fit=crop'
      },
      {
        id: 809, title: 'Journey to the Center', author: 'Jules Verne',
        desc: 'Seguendo una mappa criptica, il professor Lidenbrock e suo nipote scendono nel cuore della Terra attraverso un cratere in Islanda. Un viaggio tra ere geologiche e creature preistoriche incredibilmente preservate.',
        genre: 'Avventura', pages: 300, year: 1864, tag: 'Esplorazione', rating: 4.5, readers: '3M', chaptersCount: 45, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=300&q=80&fit=crop'
      },
      {
        id: 810, title: 'The Swiss Family Robinson', author: 'Johann D. Wyss',
        desc: 'Una famiglia naufraga su un\'isola tropicale e deve costruire una nuova vita utilizzando solo le risorse naturali e ciò che resta della nave. Un manuale di ingegnosità domestica e spirito d\'unione familiare.',
        genre: 'Avventura', pages: 420, year: 1812, tag: 'Famiglia', rating: 4.2, readers: '2M', chaptersCount: 44, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=300&q=80&fit=crop'
      },
      {
        id: 811, title: 'Moby Dick', author: 'Herman Melville',
        desc: 'L\'ossessione del capitano Achab per la leggendaria balena bianca trascina l\'equipaggio del Pequod verso un destino fatale. Più che un romanzo d\'avventura, è un trattato metafisico sulla natura del male e l\'insensatezza dell\'uomo.',
        genre: 'Avventura', pages: 650, year: 1851, tag: 'Balenieri', rating: 4.9, readers: '12M', chaptersCount: 135, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?w=300&q=80&fit=crop'
      },
      {
        id: 812, title: 'White Fang', author: 'Jack London',
        desc: 'Speculare a "Il richiamo della foresta", questo romanzo segue il percorso di un lupo selvaggio che viene gradualmente addomesticato, esplorando il potere trasformativo della violenza contro quello dell\'amore e della fiducia.',
        genre: 'Avventura', pages: 240, year: 1906, tag: 'Lupo', rating: 4.7, readers: '3.8M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1563241527-3034442642b8?w=300&q=80&fit=crop'
      },
      {
        id: 813, title: 'The Count of Monte Cristo', author: 'Alexandre Dumas',
        desc: 'Edmond Dantès viene ingiustamente imprigionato e, dopo anni, evade per mettere in atto una vendetta meticolosa e spettacolare. Un labirinto di intrighi, ricchezza e trasformazioni ambientato nella Francia dell\'Ottocento.',
        genre: 'Avventura', pages: 1200, year: 1844, tag: 'Vendetta', rating: 4.9, readers: '15M', chaptersCount: 117, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=300&q=80&fit=crop'
      },
      {
        id: 814, title: 'The Three Musketeers', author: 'Alexandre Dumas',
        desc: 'Il giovane D\'Artagnan arriva a Parigi per unirsi ai Moschettieri del Re. Tra duelli, complotti di stato e amicizie incrollabili, Dumas definisce lo standard del romanzo di cappa e spada.',
        genre: 'Avventura', pages: 700, year: 1844, tag: 'Eroismo', rating: 4.8, readers: '11M', chaptersCount: 67, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&q=80&fit=crop'
      },
      {
        id: 815, title: 'Don Quixote', author: 'Miguel de Cervantes',
        desc: 'Un nobile spagnolo impazzisce per i troppi libri di cavalleria e decide di farsi cavaliere errante. Accompagnato dal fedele Sancho Panza, combatte contro mulini a vento in una tragicomica parodia degli ideali cavallereschi.',
        genre: 'Avventura', pages: 900, year: 1605, tag: 'Pazzia', rating: 4.7, readers: '20M', chaptersCount: 126, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=300&q=80&fit=crop'
      },
      {
        id: 816, title: 'The Alchemist', author: 'Paulo Coelho',
        desc: 'Il giovane pastore Santiago intraprende un viaggio alla ricerca di un tesoro nelle piramidi d\'Egitto. Lungo la strada, scopre che la vera ricchezza consiste nel seguire la propria Leggenda Personale e ascoltare il proprio cuore.',
        genre: 'Avventura', pages: 208, year: 1988, tag: 'Destino', rating: 4.4, readers: '65M', chaptersCount: 2, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=300&q=80&fit=crop'
      },
      {
        id: 817, title: 'Papillon', author: 'Henri Charrière',
        desc: 'La straordinaria storia autobiografica di un uomo condannato all\'ergastolo nella colonia penale della Guyana francese. Una serie incessante di tentativi di fuga che testimoniano l\'invincibilità dello spirito umano.',
        genre: 'Avventura', pages: 560, year: 1969, tag: 'Fuga', rating: 4.6, readers: '4.5M', chaptersCount: 13, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 818, title: 'Wild', author: 'Cheryl Strayed',
        desc: 'Dopo una serie di tragedie personali, l\'autrice decide di percorrere a piedi il Pacific Crest Trail, oltre mille miglia tra California e Oregon. Un viaggio fisico e interiore di guarigione e riscatto.',
        genre: 'Avventura', pages: 315, year: 2012, tag: 'Cammino', rating: 4.5, readers: '3M', chaptersCount: 19, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80&fit=crop'
      },
      {
        id: 819, title: 'In Patagonia', author: 'Bruce Chatwin',
        desc: 'Chatwin parte per l\'estremità meridionale del mondo alla ricerca di un pezzo di pelle di bradipo. Il risultato è un resoconto di viaggio che mescola realtà, leggenda e descrizioni paesaggistiche di rara bellezza.',
        genre: 'Avventura', pages: 220, year: 1977, tag: 'Reportage', rating: 4.3, readers: '1.5M', chaptersCount: 97, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 820, title: 'A Walk in the Woods', author: 'Bill Bryson',
        desc: 'Con lo stile ironico che lo contraddistingue, Bryson racconta il suo tentativo (fallimentare ma esilarante) di percorrere il Sentiero degli Appalachi. Una riflessione divertente sull\'ecologia e sulla natura selvaggia americana.',
        genre: 'Avventura', pages: 300, year: 1998, tag: 'Umorismo', rating: 4.4, readers: '2.5M', chaptersCount: 21, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 821, title: 'The Unlikely Pilgrimage', author: 'Rachel Joyce',
        desc: 'Harold Fry esce di casa per spedire una lettera e decide di camminare per ottocento miglia per consegnarla a mano a un\'amica malata. Un’avventura fatta di incontri casuali e memorie dolorose che riemergono lungo la strada.',
        genre: 'Avventura', pages: 320, year: 2012, tag: 'Pellegrinaggio', rating: 4.2, readers: '2.1M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 822, title: 'Kon-Tiki', author: 'Thor Heyerdahl',
        desc: 'L\'autore attraversa l\'Oceano Pacifico su una zattera di legno di balsa per dimostrare che i popoli antichi avrebbero potuto compiere simili traversate. Un’avventura scientifica carica di tensione e meraviglia marina.',
        genre: 'Avventura', pages: 250, year: 1948, tag: 'Zattera', rating: 4.6, readers: '4M', chaptersCount: 8, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 823, title: 'Endurance', author: 'Alfred Lansing',
        desc: 'La cronaca dell\'incredibile spedizione di Shackleton nell\'Antartico. Quando la loro nave rimane intrappolata nel ghiaccio, inizia un\'odissea di sopravvivenza che resta uno dei più grandi esempi di leadership e resistenza umana.',
        genre: 'Avventura', pages: 350, year: 1959, tag: 'Antartide', rating: 4.9, readers: '2.2M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 824, title: 'Into Thin Air', author: 'Jon Krakauer',
        desc: 'Un resoconto in prima persona della disastrosa spedizione sull\'Everest del 1996. Krakauer analizza con spietata onestà gli errori e le circostanze che portarono alla morte di diversi alpinisti sul tetto del mondo.',
        genre: 'Avventura', pages: 320, year: 1997, tag: 'Montagna', rating: 4.8, readers: '4.8M', chaptersCount: 21, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 825, title: 'Touching the Void', author: 'Joe Simpson',
        desc: 'Il racconto di un incredibile miracolo alpinistico sulle Ande peruviane. Dopo essersi spezzato una gamba e essere stato dato per morto dal compagno, Simpson riesce a trascinarsi fuori da un crepaccio verso la salvezza.',
        genre: 'Avventura', pages: 218, year: 1988, tag: 'Coraggio', rating: 4.7, readers: '1.2M', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 826, title: 'The Lost City of Z', author: 'David Grann',
        desc: 'Grann ricostruisce la storia dell\'esploratore Percy Fawcett, scomparso nella foresta amazzonica negli anni \'20 mentre cercava un\'antica civiltà. Un intreccio tra ricerca storica e avventura personale dell\'autore.',
        genre: 'Avventura', pages: 352, year: 2009, tag: 'Amazzonia', rating: 4.5, readers: '1.8M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 827, title: 'Adrift', author: 'Steven Callahan',
        desc: 'La storia vera di un uomo rimasto alla deriva per 76 giorni su un canotto di salvataggio nell\'Atlantico. Una cronaca dettagliata della lotta contro la fame, la sete e la follia nel vuoto dell\'oceano.',
        genre: 'Avventura', pages: 256, year: 1986, tag: 'Naufragio', rating: 4.6, readers: '900K', chaptersCount: 15, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 828, title: 'Tracks', author: 'Robyn Davidson',
        desc: 'Una giovane donna decide di attraversare 1.700 miglia del deserto australiano accompagnata solo da quattro cammelli e un cane. Un’avventura solitaria che sfida le convenzioni sociali e celebra l\'indipendenza.',
        genre: 'Avventura', pages: 256, year: 1980, tag: 'Deserto', rating: 4.4, readers: '1.1M', chaptersCount: 11, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 829, title: 'The Beach', author: 'Alex Garland',
        desc: 'Un giovane backpacker a Bangkok riceve una mappa per una spiaggia segreta e incontaminata. Quello che inizia come il sogno di un paradiso alternativo si trasforma rapidamente in un incubo distopico e violento.',
        genre: 'Avventura', pages: 448, year: 1996, tag: 'Zaino in spalla', rating: 4.3, readers: '3.2M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 830, title: 'Lord of the Flies', author: 'William Golding',
        desc: 'Un gruppo di ragazzi britannici naufraga su un\'isola deserta e tenta di autogovernarsi. Il collasso sociale che ne segue rivela la sottile linea che separa la civiltà dalla barbarie insita nell\'essere umano.',
        genre: 'Avventura', pages: 224, year: 1954, tag: 'Psicologico', rating: 4.8, readers: '15M', chaptersCount: 12, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
    ],

    // ────────────────── BIOGRAFIA ──────────────────
    biografia: [
      {
        id: 901, title: 'Steve Jobs', author: 'Walter Isaacson',
        desc: 'Basata su oltre quaranta interviste, questa biografia svela la vita del genio creativo che ha rivoluzionato il mondo dell\'informatica e dell\'animazione, senza tacere i lati più spigolosi del suo carattere.',
        genre: 'Biografia', pages: 656, year: 2011, tag: 'Innovazione', rating: 4.7, readers: '8M', chaptersCount: 42, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80&fit=crop'
      },
      {
        id: 902, title: 'Long Walk to Freedom', author: 'Nelson Mandela',
        desc: 'L\'autobiografia di Mandela ripercorre la sua lotta contro l\'apartheid, i ventisette anni di prigionia e il cammino trionfale verso la presidenza di un Sudafrica democratico e multirazziale.',
        genre: 'Biografia', pages: 640, year: 1994, tag: 'Diritti', rating: 4.9, readers: '12M', chaptersCount: 115, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80&fit=crop'
      },
      {
        id: 903, title: 'The Diary of Anne Frank', author: 'Anne Frank',
        desc: 'Il racconto intimo e commovente di una ragazzina ebrea nascosta ad Amsterdam durante l\'occupazione nazista. Un documento universale sull\'umanità che resiste anche nelle condizioni più oscure.',
        genre: 'Biografia', pages: 350, year: 1947, tag: 'Memoria', rating: 4.9, readers: '30M', chaptersCount: 50, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80&fit=crop'
      },
      {
        id: 904, title: 'Educated', author: 'Tara Westover',
        desc: 'Nata in una famiglia di sopravvissuti delle montagne dell\'Idaho, Tara non mette piede in una scuola fino a diciassette anni. Il libro narra la sua incredibile lotta per l\'istruzione e l\'emancipazione.',
        genre: 'Biografia', pages: 352, year: 2018, tag: 'Resilienza', rating: 4.8, readers: '5.2M', chaptersCount: 40, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 905, title: 'Becoming', author: 'Michelle Obama',
        desc: 'L\'ex First Lady degli Stati Uniti racconta con sincerità la sua vita, dalle radici nel South Side di Chicago agli anni trascorsi alla Casa Bianca, esplorando il suo ruolo di madre, moglie e leader.',
        genre: 'Biografia', pages: 448, year: 2018, tag: 'Leadership', rating: 4.7, readers: '10M', chaptersCount: 24, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 906, title: 'The Glass Castle', author: 'Jeannette Walls',
        desc: 'Un memoir scioccante e al tempo stesso resiliente su un\'infanzia trascorsa con genitori brillanti ma profondamente disfunzionali e nomadi. Una storia di povertà, amore e sopravvivenza estrema.',
        genre: 'Biografia', pages: 288, year: 2005, tag: 'Famiglia', rating: 4.6, readers: '4.1M', chaptersCount: 35, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=300&q=80&fit=crop'
      },
      {
        id: 907, title: 'I Know Why the Caged Bird Sings', author: 'Maya Angelou',
        desc: 'La prima parte dell\'autobiografia di Maya Angelou descrive con poesia e forza la sua crescita nell\'America segnata dal razzismo, trasformando il trauma in una voce letteraria potente e liberatrice.',
        genre: 'Biografia', pages: 304, year: 1969, tag: 'Ispirazione', rating: 4.8, readers: '5M', chaptersCount: 36, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=80&fit=crop'
      },
      {
        id: 908, title: 'The Story of My Experiments with Truth', author: 'Gandhi',
        desc: 'In questo testo fondamentale, Gandhi esplora i principi della non-violenza (Ahimsa) e della verità (Satyagraha) che hanno guidato la sua vita e la lotta per l\'indipendenza dell\'India.',
        genre: 'Biografia', pages: 560, year: 1927, tag: 'Pace', rating: 4.5, readers: '7M', chaptersCount: 105, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=80&fit=crop'
      },
      {
        id: 909, title: 'Surely You\'re Joking Mr. Feynman', author: 'R. Feynman',
        desc: 'Le avventure eccentriche e geniali di un premio Nobel per la fisica. Feynman racconta con umorismo i suoi esperimenti, il lavoro sulla bomba atomica e la sua insaziabile curiosità per ogni aspetto della vita.',
        genre: 'Biografia', pages: 350, year: 1985, tag: 'Scienza', rating: 4.8, readers: '2.5M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?w=300&q=80&fit=crop'
      },
      {
        id: 910, title: 'Leonardo da Vinci', author: 'Walter Isaacson',
        desc: 'Un ritratto monumentale dell\'uomo che incarna il Rinascimento. Isaacson esplora come la curiosità febbrile di Leonardo abbia unito arte e scienza, osservazione della natura e invenzione tecnologica.',
        genre: 'Biografia', pages: 624, year: 2017, tag: 'Genio', rating: 4.8, readers: '3M', chaptersCount: 33, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&q=80&fit=crop'
      },
      {
        id: 911, title: 'Einstein', author: 'Walter Isaacson',
        desc: 'Isaacson indaga la vita e le scoperte del fisico che ha cambiato la nostra comprensione dell\'universo, evidenziando il legame tra la sua mente ribelle e la sua capacità di immaginare l\'invisibile.',
        genre: 'Biografia', pages: 700, year: 2007, tag: 'Fisica', rating: 4.7, readers: '2.8M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 912, title: 'Benjamin Franklin', author: 'Walter Isaacson',
        desc: 'La biografia di uno dei Padri Fondatori più versatili d\'America. Scienziato, inventore, diplomatico e scrittore, Franklin viene qui analizzato come il primo grande borghese e pragmatico americano.',
        genre: 'Biografia', pages: 600, year: 2003, tag: 'Diplomazia', rating: 4.6, readers: '1.2M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 913, title: 'Born a Crime', author: 'Trevor Noah',
        desc: 'Il comico del Daily Show racconta la sua infanzia in Sudafrica durante l\'apartheid, dove la sua stessa esistenza (nato da madre nera e padre bianco) era un atto illegale. Un libro esilarante e straziante.',
        genre: 'Biografia', pages: 304, year: 2016, tag: 'Identità', rating: 4.9, readers: '6M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 914, title: 'When Breath Becomes Air', author: 'Paul Kalanithi',
        desc: 'Un giovane neurochirurgo riceve una diagnosi di cancro terminale. In questo libro postumo, riflette sulla vita, sulla mortalità e sulla trasformazione da medico che cura i pazienti a paziente che affronta la fine.',
        genre: 'Biografia', pages: 256, year: 2016, tag: 'Filosofia', rating: 4.9, readers: '4.5M', chaptersCount: 2, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
      {
        id: 915, title: 'Option B', author: 'Sheryl Sandberg',
        desc: 'Dopo la morte improvvisa del marito, la direttrice operativa di Facebook affronta il tema del lutto e della resilienza, offrendo consigli pratici per ritrovare la gioia dopo una perdita devastante.',
        genre: 'Biografia', pages: 240, year: 2017, tag: 'Crescita', rating: 4.3, readers: '1.8M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=300&q=80&fit=crop'
      },
      {
        id: 916, title: 'The Autobiography of Malcolm X', author: 'Malcolm X',
        desc: 'Scritta con Alex Haley, questa autobiografia documenta la trasformazione di Malcolm Little da criminale di strada a uno dei leader più influenti e controversi del movimento per i diritti civili.',
        genre: 'Biografia', pages: 466, year: 1965, tag: 'Attivismo', rating: 4.8, readers: '5.5M', chaptersCount: 19, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=300&q=80&fit=crop'
      },
      {
        id: 917, title: 'Kitchen Confidential', author: 'Anthony Bourdain',
        desc: 'Uno sguardo brutale e appassionato dietro le quinte del mondo della ristorazione. Bourdain scrive con lo stile di una rockstar, svelando i segreti e le follie delle cucine di New York.',
        genre: 'Biografia', pages: 320, year: 2000, tag: 'Cucina', rating: 4.7, readers: '3.5M', chaptersCount: 28, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=300&q=80&fit=crop'
      },
      {
        id: 918, title: 'A Beautiful Mind', author: 'Sylvia Nasar',
        desc: 'La vita di John Nash, genio matematico e premio Nobel colpito dalla schizofrenia. Una cronaca accurata del suo trionfo intellettuale, della sua discesa nell\'oscurità e della sua lenta guarigione.',
        genre: 'Biografia', pages: 464, year: 1998, tag: 'Matematica', rating: 4.6, readers: '2M', chaptersCount: 50, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=300&q=80&fit=crop'
      },
      {
        id: 919, title: 'Open', author: 'Andre Agassi',
        desc: 'Forse la biografia sportiva più sincera mai scritta. Agassi confessa il suo odio per il tennis, la pressione subita dal padre e il lungo viaggio per trovare finalmente se stesso dentro e fuori dal campo.',
        genre: 'Biografia', pages: 400, year: 2009, tag: 'Tennis', rating: 4.9, readers: '7.5M', chaptersCount: 30, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=300&q=80&fit=crop'
      },
      {
        id: 920, title: 'The Immortal Life of Henrietta Lacks', author: 'R. Skloot',
        desc: 'La storia di una donna afroamericana le cui cellule vennero prelevate a sua insaputa nel 1951, diventando uno strumento fondamentale per la ricerca medica moderna senza che la sua famiglia ne sapesse nulla.',
        genre: 'Biografia', pages: 384, year: 2010, tag: 'Etica', rating: 4.8, readers: '4M', chaptersCount: 38, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&q=80&fit=crop'
      },
      {
        id: 921, title: 'Shoe Dog', author: 'Phil Knight',
        desc: 'Il fondatore della Nike racconta come ha trasformato una piccola start-up nata nel bagagliaio della sua auto in uno dei marchi più famosi del mondo, tra rischi enormi e successi insperati.',
        genre: 'Biografia', pages: 400, year: 2016, tag: 'Business', rating: 4.8, readers: '5M', chaptersCount: 20, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&q=80&fit=crop'
      },
      {
        id: 922, title: 'My Own Story', author: 'Emmeline Pankhurst',
        desc: 'L\'autobiografia della leader del movimento delle suffragette britanniche. Un resoconto militante delle lotte, degli scioperi della fame e delle proteste per ottenere il diritto di voto alle donne.',
        genre: 'Biografia', pages: 280, year: 1914, tag: 'Suffragette', rating: 4.6, readers: '1M', chaptersCount: 15, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1617791160588-241658ad0d3f?w=300&q=80&fit=crop'
      },
      {
        id: 923, title: 'Unbroken', author: 'Laura Hillenbrand',
        desc: 'La vita incredibile di Louis Zamperini: corridore olimpico, sopravvissuto a un naufragio nel Pacifico e prigioniero di guerra nei campi giapponesi durante la Seconda Guerra Mondiale.',
        genre: 'Biografia', pages: 496, year: 2010, tag: 'Guerra', rating: 4.9, readers: '6.5M', chaptersCount: 39, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300&q=80&fit=crop'
      },
      {
        id: 924, title: 'The Wright Brothers', author: 'David McCullough',
        desc: 'McCullough narra la storia di due fratelli di Dayton, Ohio, che con pochi mezzi ma una determinazione incrollabile insegnarono all\'uomo a volare, cambiando per sempre il corso della storia.',
        genre: 'Biografia', pages: 320, year: 2015, tag: 'Volo', rating: 4.7, readers: '2M', chaptersCount: 10, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&q=80&fit=crop'
      },
      {
        id: 925, title: 'Into the Wild', author: 'Jon Krakauer',
        desc: 'Presente anche qui come biografia di Christopher McCandless. L\'analisi di Krakauer scava nel diario del ragazzo per ricostruire i suoi ultimi mesi e la sua filosofia di vita alternativa.',
        genre: 'Biografia', pages: 224, year: 1996, tag: 'Minimalismo', rating: 4.7, readers: '5.5M', chaptersCount: 18, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80&fit=crop'
      },
      {
        id: 926, title: 'Hillbilly Elegy', author: 'J.D. Vance',
        desc: 'Un memoir sulle radici della classe operaia americana bianca in declino. Vance racconta la sua infanzia travagliata in Ohio e il sistema di valori della cultura "hillbilly" tra speranza e disperazione.',
        genre: 'Biografia', pages: 272, year: 2016, tag: 'Società', rating: 4.4, readers: '3.8M', chaptersCount: 15, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80&fit=crop'
      },
      {
        id: 927, title: 'The Color of Water', author: 'James McBride',
        desc: 'L\'autore intreccia la sua autobiografia con quella della madre bianca ed ebrea che crebbe dodici figli neri a Brooklyn. Un’esplorazione profonda di razza, religione e amore materno.',
        genre: 'Biografia', pages: 291, year: 1995, tag: 'Famiglia', rating: 4.7, readers: '2.5M', chaptersCount: 25, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=300&q=80&fit=crop'
      },
      {
        id: 928, title: 'Just Kids', author: 'Patti Smith',
        desc: 'La sacerdotessa del rock racconta la sua amicizia con il fotografo Robert Mapplethorpe nella New York vibrante degli anni \'60 e \'70. Un inno alla giovinezza, all\'arte e alla vita bohémien.',
        genre: 'Biografia', pages: 304, year: 2010, tag: 'Arte', rating: 4.8, readers: '4.2M', chaptersCount: 5, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300&q=80&fit=crop'
      },
      {
        id: 929, title: 'Dreams from My Father', author: 'Barack Obama',
        desc: 'Scritto prima della sua ascesa politica, questo libro segue Obama nella ricerca della verità sulle origini di suo padre keniota, affrontando temi di identità razziale e appartenenza.',
        genre: 'Biografia', pages: 464, year: 1995, tag: 'Radici', rating: 4.6, readers: '3.5M', chaptersCount: 19, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=300&q=80&fit=crop'
      },
      {
        id: 930, title: 'A Promised Land', author: 'Barack Obama',
        desc: 'Il primo volume delle memorie presidenziali. Obama ripercorre gli anni della sua elezione storica e i primi passi nello Studio Ovale, svelando i retroscena delle decisioni che hanno segnato il mondo.',
        genre: 'Biografia', pages: 768, year: 2020, tag: 'Politica', rating: 4.8, readers: '6M', chaptersCount: 27, bookmarked: false, liked: false,
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&q=80&fit=crop'
      },
    ],
  };

  getBySlug(slug: string): Book[] {
    return (this.books[slug] ?? []).map(b => ({ ...b }));
  }

  getById(id: string): Book | undefined {

    const allBooks = Object.values(this.books).flat();

    return allBooks.find((book: Book) =>
      book.id.toString() === id
    );
  }
}
