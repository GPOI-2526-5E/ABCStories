const { Pool } = require('pg');

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
    });

async function runSeed() {
  try {
    console.log('[SEED] Connessione al database...');
    
    // 1. Aggiorna completion_status per distribuire le storie
    const storiesRes = await pool.query("SELECT id FROM stories WHERE status = 'published'");
    const stories = storiesRes.rows;
    console.log(`[SEED] Trovate ${stories.length} storie pubblicate.`);

    if (stories.length >= 35) {
      // Imposta le prime 15 a 'completato'
      const completedIds = stories.slice(0, 15).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['completato', completedIds]);
      console.log(`[SEED] Impostate ${completedIds.length} storie come 'completato'.`);

      // Imposta le successive 10 a 'incompleto'
      const incompleteIds = stories.slice(15, 25).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['incompleto', incompleteIds]);
      console.log(`[SEED] Impostate ${incompleteIds.length} storie come 'incompleto'.`);

      // Imposta le successive 10 a 'sospeso'
      const suspendedIds = stories.slice(25, 35).map(s => s.id);
      await pool.query('UPDATE stories SET completion_status = $1 WHERE id = ANY($2)', ['sospeso', suspendedIds]);
      console.log(`[SEED] Impostate ${suspendedIds.length} storie come 'sospeso'.`);

      // Imposta 15 storie come 18+ (is_18_plus = TRUE)
      await pool.query('UPDATE stories SET is_18_plus = FALSE');
      const nsfwIds = stories.slice(10, 25).map(s => s.id);
      await pool.query('UPDATE stories SET is_18_plus = TRUE WHERE id = ANY($1)', [nsfwIds]);
      console.log(`[SEED] Impostate ${nsfwIds.length} storie come 18+ (is_18_plus = TRUE).`);
    } else {
      console.log('[SEED] Attenzione: non ci sono abbastanza storie nel database per ripartire gli status.');
    }

    // 2. Modifica la data di registrazione degli utenti per testare "Nuovi talenti"
    const usersRes = await pool.query('SELECT id FROM users');
    const users = usersRes.rows;
    console.log(`[SEED] Trovati ${users.length} utenti.`);

    // Metà creati 3 mesi fa (non nuovi talenti), metà creati 15 giorni fa (nuovi talenti)
    for (let i = 0; i < users.length; i++) {
      const interval = i % 2 === 0 ? "3 months" : "15 days";
      await pool.query(`UPDATE users SET created_at = NOW() - INTERVAL '${interval}' WHERE id = $1`, [users[i].id]);
    }
    console.log(`[SEED] Aggiornate date di registrazione utenti.`);

    // 3. Genera visualizzazioni recenti (ultimi 7 giorni) per testare "Classifica"
    // Rimuoviamo vecchie visualizzazioni recenti per avere controllo sui dati di test
    await pool.query("DELETE FROM story_views WHERE viewed_at >= NOW() - INTERVAL '7 days'");

    // Inseriamo da 1 a 10 visualizzazioni per le prime 15 storie
    let viewInsertCount = 0;
    for (let i = 0; i < Math.min(15, stories.length); i++) {
      const storyId = stories[i].id;
      const viewsToInsert = 15 - i; // story 0 ha 15 visualizzazioni, story 1 ha 14, ecc.
      for (let j = 0; j < viewsToInsert; j++) {
        // Distribuisci nei passati 6 giorni
        const daysAgo = j % 6;
        const randomUser = users[Math.floor(Math.random() * users.length)].id;
        await pool.query(
          `INSERT INTO story_views (story_id, user_id, viewed_at) VALUES ($1, $2, NOW() - INTERVAL '${daysAgo} days')`,
          [storyId, randomUser]
        );
        viewInsertCount++;
      }
    }
    console.log(`[SEED] Inserite ${viewInsertCount} visualizzazioni recenti negli ultimi 7 giorni.`);

    // 4. Genera follows per popolare gli artisti
    await pool.query('DELETE FROM follows');
    let followCount = 0;
    for (let i = 0; i < Math.min(10, users.length); i++) {
      const followedId = users[i].id;
      const followerCountForUser = 10 - i; // Il primo ha più followers
      for (let j = 0; j < followerCountForUser; j++) {
        const followerId = users[(i + j + 1) % users.length].id;
        if (followerId !== followedId) {
          await pool.query(
            'INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [followerId, followedId]
          );
          followCount++;
        }
      }
    }
    console.log(`[SEED] Inserite relazioni di follow per ${followCount} combinazioni.`);

    // 5. Seeding Community Posts
    console.log('[SEED] Seeding community posts...');
    
    // Clear existing community tables to prevent duplicates/errors
    await pool.query('DELETE FROM community_post_comments');
    await pool.query('DELETE FROM community_post_votes');
    await pool.query('DELETE FROM community_posts');

    // Retrieve active stories and users
    const allStoriesRes = await pool.query("SELECT id, title, is_18_plus FROM stories WHERE status = 'published'");
    const dbStories = allStoriesRes.rows;
    const allUsersRes = await pool.query('SELECT id, username FROM users');
    const dbUsers = allUsersRes.rows;

    if (dbUsers.length > 0 && dbStories.length > 0) {
      // Find user 'a' to seed bookmarks and follows
      const userA = dbUsers.find(u => u.username === 'a');
      if (userA) {
        // Clear old bookmarks for user 'a' to make sure it's fresh
        await pool.query('DELETE FROM story_bookmarks WHERE user_id = $1', [userA.id]);
        
        // Select 4 stories to bookmark (follow) for user 'a'
        const bookmarkStories = dbStories.slice(0, 4);
        for (const story of bookmarkStories) {
          await pool.query('INSERT INTO story_bookmarks (user_id, story_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userA.id, story.id]);
        }
        console.log(`[SEED] Inseriti 4 bookmark di test per l'utente 'a'.`);

        // Seed default follows for user 'a'
        const targetAuthors = dbUsers.filter(u => u.username !== 'a').slice(0, 4);
        for (const author of targetAuthors) {
          await pool.query('INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [userA.id, author.id]);
        }
        console.log(`[SEED] Inseriti follows di test per l'utente 'a' verso ${targetAuthors.map(au => au.username).join(', ')}.`);
      }

      // Helper function to find a story by title prefix, or fallback to a random one
      const getStoryIdByTitle = (titleKeyword) => {
        const found = dbStories.find(s => s.title.toLowerCase().includes(titleKeyword.toLowerCase()));
        return found ? found.id : dbStories[Math.floor(Math.random() * dbStories.length)].id;
      };

      // Define some realistic community posts
      const postsToSeed = [
        {
          title: "La figura dell'Innominato nei Promessi Sposi",
          type: "general",
          content: "Trovo che il percorso di redenzione dell'Innominato sia una delle vette letterarie di Manzoni. Voi cosa ne pensate? La conversione è stata troppo repentina o psicologicamente giustificata?",
          story_title_keyword: "Promessi Sposi",
          views_count: 342,
          created_days_ago: 2
        },
        {
          title: "Una citazione indimenticabile da 1984",
          type: "quote",
          quote: "Chi controlla il passato controlla il futuro: chi controlla il presente controlla il passato.",
          content: "Questa frase mi fa riflettere ogni volta sull'importanza della memoria storica. Orwell era un visionario.",
          story_title_keyword: "1984",
          views_count: 512,
          created_days_ago: 1
        },
        {
          title: "Il mio pensiero su Frankenstein di Mary Shelley",
          type: "comment",
          comment_text: "La creatura che impara a parlare osservando la famiglia De Lacey nel bosco e scopre i sentimenti umani è la parte più toccante del libro.",
          feeling: "like",
          content: "Consiglio a tutti di rileggere questo classico. Va ben oltre l'horror gotico superficiale, è un trattato sulla solitudine.",
          story_title_keyword: "Frankenstein",
          views_count: 220,
          created_days_ago: 5
        },
        {
          title: "Consigli per combattere il blocco dello scrittore?",
          type: "general",
          content: "Ciao a tutti! Sono a metà del mio secondo capitolo su ABCStories ma non riesco a procedere. Avete tecniche particolari? Scrivere di getto o pianificare prima nei minimi dettagli?",
          story_title_keyword: null,
          views_count: 185,
          created_days_ago: 3
        },
        {
          title: "Opinione controversa su Sherlock Holmes",
          type: "comment",
          comment_text: "Watson è il vero eroe di queste storie, senza la sua pazienza Sherlock non avrebbe mai combinato nulla di buono.",
          feeling: "dislike",
          content: "Non sono d'accordo con chi reputa Watson una spalla comica. È un medico militare coraggioso e fondamentale.",
          story_title_keyword: "Sherlock",
          views_count: 95,
          created_days_ago: 4
        },
        {
          title: "Il finale di 'Il Vecchio e il Mare'",
          type: "general",
          content: "Quel finale è straziante ma allo stesso tempo di una dignità incredibile. Santiago torna sconfitto nel corpo ma vincitore nello spirito.",
          story_title_keyword: "Vecchio",
          views_count: 420,
          created_days_ago: 6
        },
        {
          title: "Citazione poetica da 'Il Piccolo Principe'",
          type: "quote",
          quote: "Non si vede bene che col cuore. L'essenziale è invisibile agli occhi.",
          content: "Semplice, eterna, bellissima.",
          story_title_keyword: "Piccolo Principe",
          views_count: 600,
          created_days_ago: 10
        },
        {
          title: "Discussione sulla complessità di Don Chisciotte",
          type: "general",
          content: "Don Chisciotte è un pazzo o semplicemente l'unico uomo che ha compreso la vera bellezza della vita? Il confine tra realtà e immaginazione è sottilissimo.",
          story_title_keyword: "Don Chisciotte",
          views_count: 290,
          created_days_ago: 7
        },
        {
          title: "Una splendida frase da Orgoglio e Pregiudizio",
          type: "quote",
          quote: "In nove casi su dieci un uomo è meglio che si mostri più innamorato di quanto non sia.",
          content: "Cosa ne pensate di questa affermazione cinica di Charlotte Lucas? Jane Austen ha inserito verità acute in bocca a personaggi secondari.",
          story_title_keyword: "Orgoglio",
          views_count: 310,
          created_days_ago: 8
        },
        {
          title: "Che delusione questo finale!",
          type: "comment",
          comment_text: "E vissero felici e contenti senza nessuna spiegazione su come abbiano risolto i loro conflitti familiari.",
          feeling: "dislike",
          content: "Il capitolo finale mi è sembrato scritto di fretta e privo di quella coerenza psicologica che aveva caratterizzato il resto del libro.",
          story_title_keyword: "Cime Tempestose",
          views_count: 150,
          created_days_ago: 9
        },
        {
          title: "Il romanticismo eterno di Cime Tempestose",
          type: "general",
          content: "Cime Tempestose non è una storia d'amore, è una storia di ossessione, vendetta e distruzione reciproca. Ed è proprio per questo che è così affascinante.",
          story_title_keyword: "Cime Tempestose",
          views_count: 240,
          created_days_ago: 11
        },
        {
          title: "Citazione sull'assurdità in La Metamorfosi",
          type: "quote",
          quote: "Gregor Samsa, svegliandosi una mattina da sogni agitati, si trovò trasformato nel suo letto in un enorme insetto.",
          content: "L'inizio più folle e geniale di tutta la letteratura mondiale. Kafka racchiude in una riga l'alienazione dell'uomo moderno.",
          story_title_keyword: "Metamorfosi",
          views_count: 480,
          created_days_ago: 12
        },
        {
          title: "Scrivere il thriller perfetto",
          type: "general",
          content: "Trovo che l'uso della narrazione in prima persona alternata ai diari di Alicia in 'The Silent Patient' crei una tensione psicologica incredibile. Quali sono secondo voi i migliori meccanismi per depistare il lettore?",
          story_title_keyword: "Silent Patient",
          author_username: "Alex Michaelides",
          views_count: 410,
          created_days_ago: 1
        },
        {
          title: "Il potere della nostalgia e dei ricordi",
          type: "general",
          content: "Nei miei libri cerco sempre di catturare l'intimità dei sentimenti e il senso di nostalgia che accompagna le prime scoperte amorose. Scrivere è un modo per rivivere momenti che altrimenti andrebbero perduti.",
          story_title_keyword: null,
          author_username: "André Aciman",
          views_count: 285,
          created_days_ago: 2
        },
        {
          title: "La vendetta come arte letteraria",
          type: "general",
          content: "La riflessione sulla pazienza e sulla giustizia divina è centrale nel mio lavoro. La vendetta non deve essere una pulsione cieca, ma un atto di calcolo morale e drammatico.",
          story_title_keyword: null,
          author_username: "Alexandre Dumas",
          views_count: 530,
          created_days_ago: 3
        },
        {
          title: "L'immortalità e la malinconia gotica",
          type: "general",
          content: "I miei vampiri non sono semplici mostri della notte, ma anime tormentate che affrontano il peso dell'eternità. Il connubio tra gotico e sensibilità psicologica moderna è ciò che rende affascinante questo genere.",
          story_title_keyword: null,
          author_username: "Anne Rice",
          views_count: 670,
          created_days_ago: 4
        }
      ];

      for (const p of postsToSeed) {
        let author;
        if (p.author_username) {
          author = dbUsers.find(u => u.username === p.author_username);
        }
        if (!author) {
          author = dbUsers[Math.floor(Math.random() * dbUsers.length)];
        }
        const storyId = p.story_title_keyword ? getStoryIdByTitle(p.story_title_keyword) : null;
        
        const postInsert = await pool.query(`
          INSERT INTO community_posts (author_id, title, type, content, story_id, quote, comment_text, feeling, views_count, created_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() - INTERVAL '${p.created_days_ago} days')
          RETURNING id
        `, [
          author.id,
          p.title,
          p.type,
          p.content || null,
          storyId,
          p.quote || null,
          p.comment_text || null,
          p.feeling || null,
          p.views_count
        ]);
        
        const newPostId = postInsert.rows[0].id;

        // Seed votes (random likes and dislikes)
        const votersCount = Math.floor(Math.random() * 10) + 5; // da 5 a 15 votanti
        const shuffledUsers = [...dbUsers].sort(() => 0.5 - Math.random());
        for (let v = 0; v < Math.min(votersCount, shuffledUsers.length); v++) {
          const voter = shuffledUsers[v];
          if (voter.id !== author.id) {
            // 80% probabilità di like, 20% dislike (tranne per post controversi)
            let vote = Math.random() < 0.8 ? 'like' : 'dislike';
            if (p.title.includes("controversa") || p.title.includes("delusione")) {
              vote = Math.random() < 0.4 ? 'like' : 'dislike';
            }
            await pool.query(`
              INSERT INTO community_post_votes (post_id, user_id, vote)
              VALUES ($1, $2, $3)
              ON CONFLICT DO NOTHING
            `, [newPostId, voter.id, vote]);
          }
        }

        // Seed comments (da 0 a 4 commenti)
        const commentsCount = Math.floor(Math.random() * 4);
        const commentTexts = [
          "Completamente d'accordo con questa analisi!",
          "Non ci avevo mai pensato sotto questo aspetto, grazie per lo spunto.",
          "Credo che l'autore intendesse qualcosa di leggermente diverso, ma è un'ottima chiave di lettura.",
          "Questo classico non invecchia mai.",
          "Personalmente preferisco la seconda parte del libro.",
          "Orribile! Non mi è piaciuto per niente quel risvolto.",
          "Grazie per aver condiviso questa frase memorabile, è la mia preferita."
        ];
        
        for (let c = 0; c < commentsCount; c++) {
          const commentAuthor = dbUsers[Math.floor(Math.random() * dbUsers.length)];
          const text = commentTexts[Math.floor(Math.random() * commentTexts.length)];
          await pool.query(`
            INSERT INTO community_post_comments (post_id, author_id, content, created_at)
            VALUES ($1, $2, $3, NOW() - INTERVAL '${p.created_days_ago} days' + INTERVAL '${c * 4} hours')
          `, [newPostId, commentAuthor.id, text]);
        }
      }
      console.log(`[SEED] Inseriti con successo ${postsToSeed.length} post della community con voti e commenti.`);
    } else {
      console.log('[SEED] Impossibile inserire post community: mancano storie o utenti.');
    }

    console.log('[SEED] Seeding completato con successo!');
    process.exit(0);
  } catch (err) {
    console.error('[SEED ERROR] Errore durante il seeding:', err);
    process.exit(1);
  }
}

runSeed();
