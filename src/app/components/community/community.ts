import { Component, OnInit, inject, ChangeDetectorRef, HostListener, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from '../../services/loading.service';
import { DialogService } from '../../services/dialog.service';
import { Navbar } from '../navbar/navbar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BookService } from '../../services/book';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './community.html',
  styleUrl: './community.scss'
})
export class Community implements OnInit {
  private api = inject(Api);
  private auth = inject(AuthService);
  private loadingService = inject(LoadingService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookService = inject(BookService);
  private platformId = inject(PLATFORM_ID);

  currentUser = this.auth.currentUser;

  posts: any[] = [];
  stories: any[] = [];
  loading = true;

  // Tab di visualizzazione feed: 'all' | 'quote' | 'comment'
  activeTab = signal<'all' | 'quote' | 'comment'>('all');

  // Sezione attiva di navigazione nella sidebar
  activeSection = signal<'home' | 'popular' | 'new' | 'following' | 'top_voted' | 'highlights'>('home');
  activeMobileTab = signal<'feed' | 'composer' | 'activity'>('feed');
  followedStories = signal<any[]>([]);
  followedAuthors = signal<any[]>([]);
  showAllFollowed = signal<boolean>(false);
  selectedCommunityId = signal<string | null>(null);
  selectedCommunityTitle = signal<string | null>(null);
  selectedAuthorId = signal<string | null>(null);
  selectedAuthor = signal<any | null>(null);
  filterDropdownOpen = false;
  searchScope = signal<'all' | 'post' | 'author' | 'story'>('all');
  activeRightTab: 'saved' | 'liked' = 'saved';

  communityHighlights: any[] = [];
  activeShareHighlightId: string | null = null;
  highlightQuote = '';
  userHighlights: any[] = [];
  searchUserHighlightText = '';



  // Stato Profilo Destro & Statistiche Community (Calcolate dinamicamente sui post caricati)
  userWrittenPostsCount = 0;
  userLikesReceivedCount = 0;
  fullProfile: any = null;

  // Impostazioni sincronizzate in tempo reale con il database
  settings = {
    nome: '',
    email: '',
    posizione: '',
    bio: '',
    avatar_url: '',
    social_instagram: '',
    social_twitter: '',
    social_facebook: '',
    social_website: '',
    social_tiktok: '',
    social_linkedin: '',
    tema: 'tropical',
    notifiche: {
      risposte_commenti: true,
      like_commenti: true,
      nuovo_follower: true,
      storie_like: true,
      storie_preferiti: true,
      aggiornamenti_nuova_storia: true,
      aggiornamenti_nuovo_capitolo: true,
      aggiornamenti_modifica_storia: true,
      aggiornamenti_modifica_capitolo: true,
      newsletter: true,
      community_like: true,
      community_commento: true
    },
    visualizza_18plus: false,
    visualizza_18plus_community: false,
    sensitive_filter: false
  };

  showSettingsCollapse = false;

  // Stato del Compositore della Sidebar Destra
  rightComposerType: 'general' | 'quote' | 'reply_review' | 'reply_comment' = 'general';
  postTitle = '';
  postText = '';
  postImageBase64: string | null = null;
  
  likedAndBookmarkedStories: any[] = [];
  rightSelectedStoryId: string | null = null;
  rightSelectedStory: any = null;
  rightSearchStoryText = '';
  showRightStoryDropdown = false;

  reviewCommentType: 'review' | 'comment' = 'review';
  fetchedReviewsOrComments: any[] = [];
  selectedReviewOrComment: any = null;
  selectedReviewOrCommentId: string | null = null;
  commentSearchQuery = '';

  get filteredLikedAndBookmarkedStories() {
    const list = this.likedAndBookmarkedStories || [];
    if (!this.rightSearchStoryText.trim()) {
      return list;
    }
    const q = this.rightSearchStoryText.toLowerCase().trim();
    return list.filter(s =>
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.author_name && s.author_name.toLowerCase().includes(q))
    );
  }

  get filteredReviewsOrComments() {
    const list = this.fetchedReviewsOrComments || [];
    if (!this.commentSearchQuery.trim()) {
      return list;
    }
    const q = this.commentSearchQuery.toLowerCase().trim();
    return list.filter(item => {
      const author = (item.name || item.author_name || '').toLowerCase();
      const content = (item.content || item.text || '').toLowerCase();
      return author.includes(q) || content.includes(q);
    });
  }

  showPreviewModal = false;
  showCenterComposer = false;
  searchQuery = '';

  // Stato delle bozze
  drafts: any[] = [];
  activeDraftId: string | null = null;

  // Stato della sezione commenti nidificata
  activeCommentsPostId: string | null = null;
  comments: any[] = [];
  newCommentText = '';
  loadingComments = false;

  // Evidenziazione post condiviso (da link diretto)
  sharedPostId: string | null = null;

  // Feedback visivo
  showToast = false;
  toastMessage = '';
  private toastTimeout: any = null;

  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Controlla se c'è un post id nei parametri di ricerca per evidenziazione o shareStoryId
    this.route.queryParams.subscribe(params => {
      if (params['post']) {
        this.sharedPostId = params['post'];
      }
      if (params['shareStoryId'] || params['shareHighlightText']) {
        if (this.stories && this.stories.length > 0) {
          this.checkShareStoryIdFromRoute();
        }
      }
    });

    this.loadPosts();
    this.loadStories();
    this.loadFollowedStories();
    this.loadFollowedAuthors();
    this.loadLikedAndBookmarkedStories();
    this.loadSettings();
    this.loadDrafts();
    this.loadUserHighlights();
  }

  loadPosts(): void {
    const user = this.currentUser();
    if (!user) return;

    this.loading = true;
    this.api.getCommunityPosts(user.id).subscribe({
      next: (data) => {
        this.posts = data;
        this.loading = false;
        this.updateUserStats();
        this.cdr.detectChanges();

        // Se c'è un post condiviso, scrolla fino ad esso
        if (this.sharedPostId) {
          setTimeout(() => {
            const el = document.getElementById(`post-${this.sharedPostId}`);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      },
      error: (err) => {
        console.error('Errore caricamento feed community:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadStories(): void {
    this.api.getStories().subscribe({
      next: (data) => {
        this.stories = data;
        this.cdr.detectChanges();
        this.checkShareStoryIdFromRoute();
      },
      error: (err) => {
        console.error('Errore caricamento storie:', err);
        this.checkShareStoryIdFromRoute();
      }
    });
  }

  loadFollowedStories(): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.getBookmarkedStories(user.id).subscribe({
      next: (data) => {
        this.followedStories.set(data);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore caricamento community seguite:', err)
    });
  }

  loadFollowedAuthors(): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.getFollowedAuthors(user.id).subscribe({
      next: (authors) => {
        this.followedAuthors.set(authors.map(a => ({
          ...a,
          initials: a.name ? a.name.slice(0, 2).toUpperCase() : 'AU',
          avatarGradient: 'linear-gradient(135deg, #f0d870, #f08878)'
        })));
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore caricamento autori seguiti:', err)
    });
  }

  loadLikedAndBookmarkedStories(): void {
    const user = this.currentUser();
    if (!user) return;

    forkJoin({
      liked: this.api.getLikedStories(user.id).pipe(catchError(() => of([]))),
      bookmarked: this.api.getBookmarkedStories(user.id).pipe(catchError(() => of([])))
    }).subscribe(({ liked, bookmarked }) => {
      const combined = [...liked, ...bookmarked];
      const unique = [];
      const seen = new Set();
      for (const s of combined) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          unique.push(s);
        }
      }
      this.likedAndBookmarkedStories = unique;
      if (this.rightSelectedStory) {
        this.addStoryToLikedAndBookmarked(this.rightSelectedStory);
      }
      this.cdr.detectChanges();
    });
  }

  addStoryToLikedAndBookmarked(story: any): void {
    if (!story) return;
    const exists = this.likedAndBookmarkedStories.some(s => String(s.id) === String(story.id));
    if (!exists) {
      this.likedAndBookmarkedStories = [story, ...this.likedAndBookmarkedStories];
    }
  }

  loadSettings(): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.getUserProfile(user.id).subscribe({
      next: (profile) => {
        this.fullProfile = profile;
        this.settings.nome = profile.username || user.username;
        this.settings.email = profile.email || user.email;
        this.settings.posizione = profile.location || '';
        this.settings.bio = profile.bio || '';
        this.settings.avatar_url = profile.avatar_url || '';
        this.settings.social_instagram = profile.social_instagram || '';
        this.settings.social_twitter = profile.social_twitter || '';
        this.settings.social_facebook = profile.social_facebook || '';
        this.settings.social_website = profile.social_website || '';
        this.settings.social_tiktok = profile.social_tiktok || '';
        this.settings.social_linkedin = profile.social_linkedin || '';
        this.settings.tema = profile.theme || 'tropical';

        if (profile.notifiche_risposte_commenti !== undefined) this.settings.notifiche.risposte_commenti = profile.notifiche_risposte_commenti;
        if (profile.notifiche_like_commenti !== undefined) this.settings.notifiche.like_commenti = profile.notifiche_like_commenti;
        if (profile.notifiche_nuovo_follower !== undefined) this.settings.notifiche.nuovo_follower = profile.notifiche_nuovo_follower;
        if (profile.notifiche_storie_like !== undefined) this.settings.notifiche.storie_like = profile.notifiche_storie_like;
        if (profile.notifiche_storie_preferiti !== undefined) this.settings.notifiche.storie_preferiti = profile.notifiche_storie_preferiti;
        if (profile.notifiche_aggiornamenti_nuova_storia !== undefined) this.settings.notifiche.aggiornamenti_nuova_storia = profile.notifiche_aggiornamenti_nuova_storia;
        if (profile.notifiche_aggiornamenti_nuovo_capitolo !== undefined) this.settings.notifiche.aggiornamenti_nuovo_capitolo = profile.notifiche_aggiornamenti_nuovo_capitolo;
        if (profile.notifiche_aggiornamenti_modifica_storia !== undefined) this.settings.notifiche.aggiornamenti_modifica_storia = profile.notifiche_aggiornamenti_modifica_storia;
        if (profile.notifiche_aggiornamenti_modifica_capitolo !== undefined) this.settings.notifiche.aggiornamenti_modifica_capitolo = profile.notifiche_aggiornamenti_modifica_capitolo;
        if (profile.notifiche_newsletter !== undefined) this.settings.notifiche.newsletter = profile.notifiche_newsletter;
        if (profile.notifiche_community_like !== undefined) this.settings.notifiche.community_like = profile.notifiche_community_like;
        if (profile.notifiche_community_commento !== undefined) this.settings.notifiche.community_commento = profile.notifiche_community_commento;

        if (profile.visualizza_18plus !== undefined) this.settings.visualizza_18plus = profile.visualizza_18plus;
        if (profile.visualizza_18plus_community !== undefined) this.settings.visualizza_18plus_community = profile.visualizza_18plus_community;
        if (profile.sensitive_filter !== undefined) this.settings.sensitive_filter = profile.sensitive_filter;

        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore caricamento impostazioni community:', err)
    });
  }

  saveSettings(): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.updateUserProfile(user.id, {
      username: this.settings.nome,
      bio: this.settings.bio,
      location: this.settings.posizione,
      avatar_url: this.settings.avatar_url,
      social_instagram: this.settings.social_instagram || null,
      social_twitter: this.settings.social_twitter || null,
      social_facebook: this.settings.social_facebook || null,
      social_website: this.settings.social_website || null,
      social_tiktok: this.settings.social_tiktok || null,
      social_linkedin: this.settings.social_linkedin || null,
      theme: this.settings.tema,
      notifiche_risposte_commenti: this.settings.notifiche.risposte_commenti,
      notifiche_like_commenti: this.settings.notifiche.like_commenti,
      notifiche_nuovo_follower: this.settings.notifiche.nuovo_follower,
      notifiche_storie_like: this.settings.notifiche.storie_like,
      notifiche_storie_preferiti: this.settings.notifiche.storie_preferiti,
      notifiche_aggiornamenti_nuova_storia: this.settings.notifiche.aggiornamenti_nuova_storia,
      notifiche_aggiornamenti_nuovo_capitolo: this.settings.notifiche.aggiornamenti_nuovo_capitolo,
      notifiche_aggiornamenti_modifica_storia: this.settings.notifiche.aggiornamenti_modifica_storia,
      notifiche_aggiornamenti_modifica_capitolo: this.settings.notifiche.aggiornamenti_modifica_capitolo,
      notifiche_newsletter: this.settings.notifiche.newsletter,
      notifiche_community_like: this.settings.notifiche.community_like,
      notifiche_community_commento: this.settings.notifiche.community_commento,
      privacy_profilo_pubblico: true,
      privacy_mostra_libreria: false,
      privacy_indicizza: true,
      visualizza_18plus: this.settings.visualizza_18plus,
      visualizza_18plus_community: this.settings.visualizza_18plus_community,
      reading_font: 'sans-serif',
      reading_font_size: 'medium',
      reading_mode: 'scroll',
      reading_width: 'medium',
      sensitive_filter: this.settings.sensitive_filter
    }).subscribe({
      next: (updatedUser) => {
        this.auth.updateCurrentUser(updatedUser);
        this.fullProfile = updatedUser;
        this.triggerToast('Impostazioni aggiornate!');
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore aggiornamento impostazioni:', err)
    });
  }

  updateUserStats(): void {
    const user = this.currentUser();
    if (!user) return;

    const userPosts = this.posts.filter(p => String(p.author_id) === String(user.id));
    this.userWrittenPostsCount = userPosts.length;
    this.userLikesReceivedCount = userPosts.reduce((acc, p) => acc + (Number(p.likes_count) || 0), 0);
  }

  setSection(section: 'home' | 'popular' | 'new' | 'following' | 'top_voted' | 'highlights'): void {
    this.checkAndSaveDraft();
    this.activeSection.set(section);
    this.activeMobileTab.set('feed');
    this.selectedCommunityId.set(null);
    this.selectedCommunityTitle.set(null);
    this.selectedAuthorId.set(null);
    this.selectedAuthor.set(null);
    this.showCenterComposer = false;
    this.activeDraftId = null;
    this.resetComposerFields();
    if (section === 'highlights') {
      this.loadCommunityHighlights();
    }
    this.cdr.detectChanges();
  }

  filterByCommunity(storyId: string, storyTitle: string): void {
    this.checkAndSaveDraft();
    this.selectedCommunityId.set(storyId);
    this.selectedCommunityTitle.set(storyTitle);
    this.activeMobileTab.set('feed');
    this.selectedAuthorId.set(null);
    this.selectedAuthor.set(null);
    this.activeSection.set('home'); // Ritorna al feed principale della community selezionata
    this.showCenterComposer = false;
    this.activeDraftId = null;
    this.resetComposerFields();
    this.cdr.detectChanges();
  }

  clearCommunityFilter(): void {
    this.selectedCommunityId.set(null);
    this.selectedCommunityTitle.set(null);
    this.cdr.detectChanges();
  }

  toggleShowAllFollowed(): void {
    this.showAllFollowed.update(val => !val);
    this.cdr.detectChanges();
  }

  filterByAuthor(author: any): void {
    this.checkAndSaveDraft();
    this.selectedAuthorId.set(author.id ? String(author.id) : null);
    this.selectedAuthor.set(author);
    this.activeMobileTab.set('feed');
    this.selectedCommunityId.set(null);
    this.selectedCommunityTitle.set(null);
    this.activeSection.set('home');
    this.showCenterComposer = false;
    this.activeDraftId = null;
    this.resetComposerFields();
    this.cdr.detectChanges();
  }

  filterByAuthorId(authorId: string, authorUsername?: string): void {
    this.checkAndSaveDraft();
    this.selectedAuthorId.set(authorId);
    this.activeMobileTab.set('feed');
    this.selectedCommunityId.set(null);
    this.selectedCommunityTitle.set(null);
    this.activeSection.set('home');
    this.showCenterComposer = false;
    this.activeDraftId = null;
    this.resetComposerFields();

    const tempUsername = authorUsername || 'Scrittore';
    this.selectedAuthor.set({
      id: authorId,
      name: tempUsername,
      description: '',
      avatar_url: null,
      initials: tempUsername.slice(0, 2).toUpperCase(),
      avatarGradient: 'linear-gradient(135deg, #f0d870, #f08878)'
    });

    this.api.getUserProfile(String(authorId)).subscribe({
      next: (profile) => {
        this.selectedAuthor.set({
          id: profile.id,
          name: profile.username || profile.name || tempUsername,
          description: profile.bio || profile.description || '',
          avatar_url: profile.avatar_url,
          initials: (profile.username || profile.name || tempUsername).slice(0, 2).toUpperCase(),
          avatarGradient: 'linear-gradient(135deg, #f0d870, #f08878)'
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore recupero profilo autore per scheda community:', err)
    });
    this.cdr.detectChanges();
  }

  isFollowingSelectedAuthor(): boolean {
    const author = this.selectedAuthor();
    if (!author) return false;
    return this.followedAuthors().some(a => String(a.id) === String(author.id));
  }

  toggleFollowSelectedAuthor(): void {
    const currentUser = this.auth.currentUser();
    const author = this.selectedAuthor();
    if (!currentUser || !author) return;

    const authorIdStr = String(author.id);
    const currentlyFollowing = this.isFollowingSelectedAuthor();

    if (currentlyFollowing) {
      this.api.unfollowUser(currentUser.id, String(author.id)).subscribe({
        next: () => {
          this.followedAuthors.update(authors => authors.filter(a => String(a.id) !== authorIdStr));
          this.triggerToast(`Non segui più ${author.name}`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore unfollow:', err)
      });
    } else {
      this.api.followUser(currentUser.id, String(author.id)).subscribe({
        next: () => {
          const newAuthor = {
            id: author.id,
            name: author.name,
            avatar_url: author.avatar_url,
            initials: author.initials || author.name.slice(0, 2).toUpperCase(),
            avatarGradient: author.avatarGradient || 'linear-gradient(135deg, #f0d870, #f08878)',
            description: author.description || ''
          };
          this.followedAuthors.update(authors => [...authors, newAuthor]);
          this.triggerToast(`Ora segui ${author.name}`);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore follow:', err)
      });
    }
  }

  toggleFilterDropdown(): void {
    this.filterDropdownOpen = !this.filterDropdownOpen;
    this.cdr.detectChanges();
  }

  selectFilterOption(option: 'all' | 'post' | 'author' | 'story'): void {
    this.searchScope.set(option);
    this.filterDropdownOpen = false;
    this.cdr.detectChanges();
  }

  getFilterDropdownLabel(): string {
    const scope = this.searchScope();
    if (scope === 'all') return 'Cerca: Tutto';
    if (scope === 'author') return 'Cerca: Autori';
    if (scope === 'story') return 'Cerca: Storie';
    if (scope === 'post') return 'Cerca: Post';
    return 'Cerca: Tutto';
  }

  openRulesAlert(): void {
    const rulesHtml = `
      <ol>
        <li><strong>Rispetto reciproco:</strong> Non sono tollerati insulti, volgarità o attacchi personali. Sii sempre gentile e costruttivo.</li>
        <li><strong>Segnala gli spoiler:</strong> Rispetta la lettura altrui. Se parli di eventi chiave di una trama, avvisa chiaramente o inserisci il tag spoiler.</li>
        <li><strong>Rimani a tema:</strong> La community è incentrata sulla letteratura, le storie di ABCStories e i consigli di lettura. Evita contenuti fuori tema (spam, politica, ecc.).</li>
        <li><strong>No Spam o Autopromozione eccessiva:</strong> È vietato fare spam di link esterni o fare pubblicità a servizi terzi non autorizzati.</li>
      </ol>
    `;
    this.dialogService.alert('Regolamento della Community', rulesHtml);
  }

  setTab(tab: 'all' | 'quote' | 'comment'): void {
    this.activeTab.set(tab);
  }

  setRightComposerType(type: 'general' | 'quote' | 'reply_review' | 'reply_comment'): void {
    this.rightComposerType = type;
    if (type === 'reply_review') {
      this.reviewCommentType = 'review';
      this.selectedReviewOrComment = null;
      this.selectedReviewOrCommentId = null;
      this.commentSearchQuery = '';
      this.loadReviewsOrComments();
    } else if (type === 'reply_comment') {
      this.reviewCommentType = 'comment';
      this.selectedReviewOrComment = null;
      this.selectedReviewOrCommentId = null;
      this.commentSearchQuery = '';
      this.loadReviewsOrComments();
    }
    this.cdr.detectChanges();
  }

  get filteredStoriesForSearch() {
    if (!this.rightSearchStoryText.trim()) return [];
    return this.stories.filter(s =>
      s.title.toLowerCase().includes(this.rightSearchStoryText.toLowerCase())
    );
  }

  selectStoryRight(story: any): void {
    if (this.rightSelectedStoryId === story.id) {
      this.removeRightSelectedStory();
    } else {
      this.rightSelectedStory = story;
      this.rightSelectedStoryId = story.id;
      this.rightSearchStoryText = '';
      this.showRightStoryDropdown = false;
      this.selectedReviewOrComment = null;
      this.selectedReviewOrCommentId = null;
      this.fetchedReviewsOrComments = [];
      this.commentSearchQuery = '';

      if (this.rightComposerType === 'reply_review') {
        this.reviewCommentType = 'review';
      } else if (this.rightComposerType === 'reply_comment') {
        this.reviewCommentType = 'comment';
      }

      this.loadReviewsOrComments();
    }
    this.cdr.detectChanges();
  }

  removeRightSelectedStory(): void {
    this.rightSelectedStory = null;
    this.rightSelectedStoryId = null;
    this.selectedReviewOrComment = null;
    this.selectedReviewOrCommentId = null;
    this.fetchedReviewsOrComments = [];
    this.commentSearchQuery = '';
    this.cdr.detectChanges();
  }

  onReviewCommentTypeChange(type: 'review' | 'comment'): void {
    this.reviewCommentType = type;
    this.selectedReviewOrComment = null;
    this.selectedReviewOrCommentId = null;
    this.commentSearchQuery = '';
    this.loadReviewsOrComments();
  }

  loadReviewsOrComments(): void {
    if (!this.rightSelectedStory) return;
    const storyId = this.rightSelectedStory.id;

    if (this.reviewCommentType === 'review') {
      this.api.getStoryReviews(storyId).subscribe({
        next: (data) => {
          this.fetchedReviewsOrComments = data;
          this.checkPreselectedReviewOrComment();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore caricamento recensioni:', err)
      });
    } else {
      this.api.getStoryComments(storyId).subscribe({
        next: (data) => {
          this.fetchedReviewsOrComments = data;
          this.checkPreselectedReviewOrComment();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Errore caricamento commenti:', err)
      });
    }
  }

  checkPreselectedReviewOrComment(): void {
    const shareReviewId = this.route.snapshot.queryParams['shareReviewId'];
    const shareCommentId = this.route.snapshot.queryParams['shareCommentId'];

    if (this.reviewCommentType === 'review' && shareReviewId) {
      const foundReview = this.fetchedReviewsOrComments.find(r => String(r.id) === String(shareReviewId));
      if (foundReview) {
        this.selectedReviewOrComment = foundReview;
        this.selectedReviewOrCommentId = foundReview.id;
      }
    } else if (this.reviewCommentType === 'comment' && shareCommentId) {
      const foundComment = this.fetchedReviewsOrComments.find(c => String(c.id) === String(shareCommentId));
      if (foundComment) {
        this.selectedReviewOrComment = foundComment;
        this.selectedReviewOrCommentId = foundComment.id;
      }
    }
  }

  selectReviewOrComment(item: any): void {
    this.selectedReviewOrComment = item;
    this.selectedReviewOrCommentId = item.id;
    this.cdr.detectChanges();
  }

  onRightImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (file.size > maxBytes) {
      this.dialogService.alert('Immagine troppo grande', 'Il limite massimo è 2MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.postImageBase64 = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  removeRightUploadedImage(): void {
    this.postImageBase64 = null;
    this.cdr.detectChanges();
  }

  openPreviewModal(): void {
    if (!this.postTitle.trim()) {
      this.dialogService.alert('Titolo mancante', 'Inserisci un titolo per visualizzare l\'anteprima.');
      return;
    }
    if (this.rightComposerType === 'quote' && !this.highlightQuote.trim()) {
      this.dialogService.alert('Citazione mancante', 'Inserisci il testo della citazione per visualizzare l\'anteprima.');
      return;
    }
    if (this.rightComposerType !== 'quote' && !this.postText.trim()) {
      this.dialogService.alert('Contenuto mancante', 'Scrivi qualcosa prima di visualizzare l\'anteprima.');
      return;
    }
    const isReplyType = this.rightComposerType === 'reply_review' || this.rightComposerType === 'reply_comment';
    if (isReplyType && !this.selectedReviewOrComment) {
      this.dialogService.alert('Elemento mancante', 'Seleziona una recensione o un commento da citare.');
      return;
    }
    this.showPreviewModal = true;
    this.cdr.detectChanges();
  }

  closePreviewModal(): void {
    this.showPreviewModal = false;
    this.cdr.detectChanges();
  }

  triggerToast(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    this.cdr.detectChanges();

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
      this.cdr.detectChanges();
    }, 3000);
  }

  publishPost(): void {
    const user = this.currentUser();
    if (!user) return;

    if (!this.postTitle.trim()) {
      this.dialogService.alert('Titolo mancante', 'Inserisci un titolo per il tuo post.');
      return;
    }
    if (this.rightComposerType === 'quote' && !this.highlightQuote.trim()) {
      this.dialogService.alert('Citazione mancante', 'Inserisci il testo della citazione.');
      return;
    }
    if (this.rightComposerType !== 'quote' && !this.postText.trim()) {
      this.dialogService.alert('Contenuto mancante', 'Scrivi qualcosa prima di pubblicare il post.');
      return;
    }
    const isReplyType = this.rightComposerType === 'reply_review' || this.rightComposerType === 'reply_comment';
    if (isReplyType) {
      if (!this.rightSelectedStory) {
        this.dialogService.alert('Storia mancante', 'Seleziona una storia.');
        return;
      }
      if (!this.selectedReviewOrComment) {
        this.dialogService.alert('Elemento mancante', 'Seleziona una recensione o un commento da commentare.');
        return;
      }
    }

    const payload: any = {
      author_id: user.id,
      title: this.postTitle.trim(),
      type: this.highlightQuote ? 'quote' : (isReplyType ? 'review_comment' : 'general'),
      story_id: this.rightSelectedStory ? this.rightSelectedStory.id : null,
      story_title: this.rightSelectedStory ? this.rightSelectedStory.title : null,
      story_image: this.rightSelectedStory ? (this.rightSelectedStory.image_url || this.rightSelectedStory.img) : null,
      post_image: this.rightComposerType === 'general' && !this.highlightQuote ? this.postImageBase64 : null,
      content: this.postText.trim()
    };

    if (this.highlightQuote) {
      payload.quote = this.highlightQuote;
    }

    if (isReplyType) {
      payload.commented_author = this.reviewCommentType === 'review' ? this.selectedReviewOrComment.name : this.selectedReviewOrComment.author_name;
      payload.commented_text = this.reviewCommentType === 'review' ? this.selectedReviewOrComment.content : this.selectedReviewOrComment.text;
      payload.commented_type = this.reviewCommentType;
    }

    this.loadingService.show();
    this.api.createCommunityPost(payload).subscribe({
      next: (newPost) => {
        this.loadingService.hide();
        this.posts.unshift(newPost);
        this.triggerToast('Post pubblicato con successo!');
        this.updateUserStats();
        
        // Delete current draft if active
        if (this.activeDraftId) {
          this.drafts = this.drafts.filter(d => d.id !== this.activeDraftId);
          this.saveDraftsToStorage();
          this.activeDraftId = null;
        }

        this.showCenterComposer = false;
        this.activeMobileTab.set('feed');
        this.resetComposerFields();
        this.showPreviewModal = false;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Errore creazione post:', err);
        this.dialogService.alert('Errore', 'Impossibile pubblicare il post. Riprova più tardi.');
      }
    });
  }


  votePost(post: any, voteType: 'like' | 'dislike'): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.voteCommunityPost(post.id, user.id, voteType).subscribe({
      next: (res) => {
        post.user_vote = res.user_vote;
        post.likes_count = res.likes_count;
        post.dislikes_count = res.dislikes_count;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore votazione post community:', err)
    });
  }

  togglePostBookmark(post: any): void {
    const user = this.currentUser();
    if (!user) return;

    this.api.toggleCommunityPostBookmark(post.id, user.id).subscribe({
      next: (res) => {
        post.user_bookmarked = res.bookmarked;
        this.cdr.detectChanges();
        this.triggerToast(res.bookmarked ? 'Post aggiunto ai preferiti!' : 'Post rimosso dai preferiti.');
      },
      error: (err) => console.error('Errore durante salvataggio post nei preferiti:', err)
    });
  }

  async deletePost(post: any): Promise<void> {
    const confirmed = await this.dialogService.confirm(
      'Elimina Post',
      'Sei sicuro di voler eliminare definitivamente questo post?'
    );
    if (!confirmed) return;

    this.loadingService.show();
    this.api.deleteCommunityPost(post.id).subscribe({
      next: (res) => {
        this.loadingService.hide();
        if (res.success) {
          this.posts = this.posts.filter(p => p.id !== post.id);
          this.triggerToast('Post eliminato con successo.');
          this.cdr.detectChanges();
        } else {
          this.dialogService.alert('Errore', 'Impossibile eliminare il post.');
        }
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Errore eliminazione post community:', err);
        this.dialogService.alert('Errore', 'Si è verificato un errore durante l\'eliminazione del post.');
      }
    });
  }

  scrollToOrFilterPost(post: any): void {
    const isVisible = this.getFilteredPosts().some(p => p.id === post.id);
    if (!isVisible) {
      this.resetAllFilters();
    }
    this.activeMobileTab.set('feed');
    setTimeout(() => {
      const el = document.getElementById(`post-${post.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('shared-highlight');
        setTimeout(() => {
          el.classList.remove('shared-highlight');
        }, 3000);
      }
    }, 150);
  }

  get bookmarkedCommunityPosts() {
    return this.posts.filter(p => p.user_bookmarked);
  }

  get likedCommunityPosts() {
    return this.posts.filter(p => p.user_vote === 'like');
  }

  openComments(post: any): void {
    if (this.activeCommentsPostId === post.id) {
      // Chiudi
      this.activeCommentsPostId = null;
      this.comments = [];
      this.cdr.detectChanges();
      return;
    }

    this.activeCommentsPostId = post.id;
    this.loadingComments = true;
    this.newCommentText = '';
    this.cdr.detectChanges();

    this.api.getCommunityPostComments(post.id).subscribe({
      next: (data) => {
        this.comments = data;
        this.loadingComments = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento commenti post community:', err);
        this.loadingComments = false;
        this.cdr.detectChanges();
      }
    });
  }

  addComment(post: any): void {
    const user = this.currentUser();
    if (!user || !this.newCommentText.trim()) return;

    const content = this.newCommentText.trim();
    this.newCommentText = '';

    this.api.addCommunityPostComment(post.id, user.id, content).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        post.comments_count++;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore pubblicazione commento post community:', err);
        this.dialogService.alert('Errore', 'Impossibile aggiungere il commento.');
      }
    });
  }

  sharePost(post: any): void {
    const shareUrl = `${window.location.origin}/community?post=${post.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Post della Community su ABCStories',
        text: post.type === 'quote' ? `"${post.quote}"` : post.content || 'Guarda questo post su ABCStories!',
        url: shareUrl
      }).then(() => {
        this.triggerToast('Condiviso con successo!');
      }).catch((err) => {
        console.log('Condivisione annullata o fallita:', err);
      });
    } else {
      // Clipboard fallback
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.triggerToast('Link del post copiato negli appunti!');
      }).catch((err) => {
        console.error('Errore copia negli appunti:', err);
        this.triggerToast('Impossibile copiare il link.');
      });
    }
  }

  getFilteredPosts() {
    let result = this.posts;

    // Filtra per query di ricerca
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      const scope = this.searchScope();
      if (scope === 'all') {
        result = result.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) || 
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.author_username && p.author_username.toLowerCase().includes(q)) ||
          (p.story_title && p.story_title.toLowerCase().includes(q)) ||
          (p.quote && p.quote.toLowerCase().includes(q)) ||
          (p.comment_text && p.comment_text.toLowerCase().includes(q))
        );
      } else if (scope === 'author') {
        result = result.filter(p => 
          (p.author_username && p.author_username.toLowerCase().includes(q))
        );
      } else if (scope === 'story') {
        result = result.filter(p => 
          (p.story_title && p.story_title.toLowerCase().includes(q))
        );
      } else if (scope === 'post') {
        result = result.filter(p => 
          (p.title && p.title.toLowerCase().includes(q)) || 
          (p.content && p.content.toLowerCase().includes(q)) ||
          (p.quote && p.quote.toLowerCase().includes(q)) ||
          (p.comment_text && p.comment_text.toLowerCase().includes(q))
        );
      }
    }

    // 1. Filtra per specifica community (se selezionata)
    const commId = this.selectedCommunityId();
    if (commId) {
      result = result.filter(p => p.story_id === commId);
    }

    // 1b. Filtra per autore (se selezionato)
    const authorId = this.selectedAuthorId();
    if (authorId) {
      result = result.filter(p => String(p.author_id) === String(authorId));
    }

    // 2. Applica la sezione attiva (Ordinamento / Filtro)
    const section = this.activeSection();
    if (section === 'home') {
      // Feed personalizzato/principale (default, ordinati per data come arrivano dal db)
    } else if (section === 'popular') {
      // Ordina per popolarità: (likes_count + comments_count * 2 + views_count) desc
      result = [...result].sort((a, b) => {
        const scoreA = (a.likes_count || 0) + (a.comments_count || 0) * 2 + (a.views_count || 0);
        const scoreB = (b.likes_count || 0) + (b.comments_count || 0) * 2 + (b.views_count || 0);
        return scoreB - scoreA;
      });
    } else if (section === 'new') {
      // Ordina strettamente per data decrescente
      result = [...result].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (section === 'following') {
      // Filtra solo post di storie seguite (bookmarkate)
      const followedIds = new Set(this.followedStories().map(s => s.id));
      result = result.filter(p => p.story_id && followedIds.has(p.story_id));
    } else if (section === 'top_voted') {
      // Ordina per più votati (likes_count desc, poi likes - dislikes desc)
      result = [...result].sort((a, b) => {
        const diff = (b.likes_count || 0) - (a.likes_count || 0);
        if (diff !== 0) return diff;
        const netA = (a.likes_count || 0) - (a.dislikes_count || 0);
        const netB = (b.likes_count || 0) - (b.dislikes_count || 0);
        return netB - netA;
      });
    }

    // 3. Applica il sotto-filtro di tipo (Tutti, Citazioni, Opinioni)
    const tab = this.activeTab();
    if (tab !== 'all') {
      result = result.filter(p => p.type === tab);
    }

    return result;
  }

  formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Adesso';
    if (diffMins < 60) return `${diffMins} min fa`;
    if (diffHours < 24) return `${diffHours} ore fa`;
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays} giorni fa`;
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  }

  activateCenterComposer(type: 'general' | 'quote' | 'reply_review' | 'reply_comment'): void {
    this.checkAndSaveDraft();
    this.activeDraftId = null;
    this.rightComposerType = type;
    this.showCenterComposer = true;
    this.activeMobileTab.set('composer');
    this.resetComposerFields();

    if (type === 'reply_review') {
      this.reviewCommentType = 'review';
    } else if (type === 'reply_comment') {
      this.reviewCommentType = 'comment';
    }

    this.cdr.detectChanges();
  }

  cancelCenterComposer(): void {
    this.checkAndSaveDraft();
    this.showCenterComposer = false;
    this.activeMobileTab.set('feed');
    this.activeDraftId = null;
    this.resetComposerFields();
    this.cdr.detectChanges();
  }

  // Metodi gestione bozze
  loadDrafts(): void {
    const saved = localStorage.getItem('abc_stories_community_drafts');
    if (saved) {
      try {
        this.drafts = JSON.parse(saved);
      } catch (e) {
        this.drafts = [];
      }
    }
  }

  saveDraftsToStorage(): void {
    localStorage.setItem('abc_stories_community_drafts', JSON.stringify(this.drafts));
  }

  checkAndSaveDraft(): void {
    if (!this.showCenterComposer) return;
    
    const hasContent = this.postTitle.trim() || this.postText.trim() || this.postImageBase64 || this.rightSelectedStory;
    if (!hasContent) return;

    if (this.activeDraftId) {
      const draft = this.drafts.find(d => d.id === this.activeDraftId);
      if (draft) {
        draft.title = this.postTitle || 'Bozza senza titolo';
        draft.text = this.postText;
        draft.type = this.rightComposerType;
        draft.postImageBase64 = this.postImageBase64;
        draft.rightSelectedStory = this.rightSelectedStory;
        draft.reviewCommentType = this.reviewCommentType;
        draft.selectedReviewOrComment = this.selectedReviewOrComment;
        draft.updatedAt = new Date().toISOString();
      }
    } else {
      const newDraft = {
        id: 'draft_' + Date.now(),
        title: this.postTitle || 'Bozza senza titolo',
        text: this.postText,
        type: this.rightComposerType,
        postImageBase64: this.postImageBase64,
        rightSelectedStory: this.rightSelectedStory,
        reviewCommentType: this.reviewCommentType,
        selectedReviewOrComment: this.selectedReviewOrComment,
        updatedAt: new Date().toISOString()
      };
      this.drafts.push(newDraft);
      this.activeDraftId = newDraft.id;
    }
    this.saveDraftsToStorage();
    this.triggerToast('Bozza salvata');
  }

  loadDraft(draft: any): void {
    this.checkAndSaveDraft();

    this.activeDraftId = draft.id;
    this.postTitle = draft.title === 'Bozza senza titolo' ? '' : draft.title;
    this.postText = draft.text;
    this.rightComposerType = draft.type;
    this.postImageBase64 = draft.postImageBase64;
    this.rightSelectedStory = draft.rightSelectedStory;
    this.rightSelectedStoryId = draft.rightSelectedStory ? draft.rightSelectedStory.id : null;
    this.reviewCommentType = draft.reviewCommentType || 'review';
    this.selectedReviewOrComment = draft.selectedReviewOrComment;
    this.selectedReviewOrCommentId = draft.selectedReviewOrComment ? draft.selectedReviewOrComment.id : null;
    
    if (this.rightSelectedStory) {
      this.loadReviewsOrComments();
    }

    this.showCenterComposer = true;
    this.activeMobileTab.set('composer');
    this.cdr.detectChanges();
    this.triggerToast('Bozza caricata');
  }

  deleteDraft(draftId: string, event: Event): void {
    event.stopPropagation();
    this.drafts = this.drafts.filter(d => d.id !== draftId);
    this.saveDraftsToStorage();
    if (this.activeDraftId === draftId) {
      this.activeDraftId = null;
      this.resetComposerFields();
      this.showCenterComposer = false;
    }
    this.triggerToast('Bozza eliminata');
    this.cdr.detectChanges();
  }

  resetComposerFields(): void {
    this.postTitle = '';
    this.postText = '';
    this.postImageBase64 = null;
    this.rightSelectedStory = null;
    this.rightSelectedStoryId = null;
    this.selectedReviewOrComment = null;
    this.selectedReviewOrCommentId = null;
    this.fetchedReviewsOrComments = [];
    this.rightSearchStoryText = '';
    this.commentSearchQuery = '';
    this.highlightQuote = '';
  }

  getActiveSectionName(): string {
    const sect = this.activeSection();
    if (sect === 'popular') return 'Popolari';
    if (sect === 'new') return 'Update';
    if (sect === 'following') return 'Seguendo';
    if (sect === 'top_voted') return 'Più Votati';
    return '';
  }

  resetAllFilters(): void {
    this.checkAndSaveDraft();
    this.selectedCommunityId.set(null);
    this.selectedCommunityTitle.set(null);
    this.selectedAuthorId.set(null);
    this.selectedAuthor.set(null);
    this.activeSection.set('home');
    this.searchQuery = '';
    this.searchScope.set('all');
    this.showCenterComposer = false;
    this.activeMobileTab.set('feed');
    this.activeDraftId = null;
    this.resetComposerFields();
    this.cdr.detectChanges();
  }

  checkShareStoryIdFromRoute(): void {
    const shareStoryId = this.route.snapshot.queryParams['shareStoryId'];
    const shareReviewId = this.route.snapshot.queryParams['shareReviewId'];
    const shareCommentId = this.route.snapshot.queryParams['shareCommentId'];
    const shareHighlightText = this.route.snapshot.queryParams['shareHighlightText'];

    if (shareStoryId || shareHighlightText) {
      const found = shareStoryId ? this.stories.find(s => String(s.id) === String(shareStoryId)) : null;

      const setupComposer = (story: any) => {
        if (story) {
          this.rightSelectedStory = story;
          this.rightSelectedStoryId = story.id;
          this.addStoryToLikedAndBookmarked(story);
        }

        if (shareHighlightText) {
          this.highlightQuote = shareHighlightText;
          this.rightComposerType = 'quote';
          this.postTitle = 'Una citazione stupenda';
        } else if (shareReviewId) {
          this.rightComposerType = 'reply_review';
          this.reviewCommentType = 'review';
        } else if (shareCommentId) {
          this.rightComposerType = 'reply_comment';
          this.reviewCommentType = 'comment';
        } else {
          this.rightComposerType = 'general';
        }

        this.showCenterComposer = true;
        this.activeMobileTab.set('composer');
        if (shareStoryId && (shareReviewId || shareCommentId)) {
          this.loadReviewsOrComments();
        }
        this.cdr.detectChanges();
      };

      if (shareStoryId) {
        if (found) {
          setupComposer(found);
        } else {
          // Carica la storia dall'API
          this.api.getStory(shareStoryId).subscribe({
            next: (story) => {
              if (story) {
                const mappedStory = {
                  id: story.id,
                  title: story.title,
                  author_name: story.author_name || story.author_username,
                  img: story.image_url || story.img
                };
                setupComposer(mappedStory);
              } else {
                setupComposer(null);
              }
            },
            error: (err) => {
              console.warn('Errore caricamento della storia da API, provo locale:', err);
              const localBook = this.bookService.getById(shareStoryId);
              if (localBook) {
                const mappedStory = {
                  id: String(localBook.id),
                  title: localBook.title,
                  author_name: localBook.author,
                  img: localBook.img
                };
                setupComposer(mappedStory);
              } else {
                setupComposer(null);
              }
            }
          });
        }
      } else {
        setupComposer(null);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target && typeof target.closest === 'function') {
      if (!target.closest('.general-search-wrapper')) {
        this.showRightStoryDropdown = false;
      }
      if (!target.closest('.gd-dropdown')) {
        this.filterDropdownOpen = false;
      }
      if (!target.closest('.highlight-share-container')) {
        this.activeShareHighlightId = null;
      }

      // Automatically close the composer and save the draft if clicking outside
      if (this.showCenterComposer) {
        const clickedInsideComposer = target.closest('.center-composer-card');
        const clickedSelectTypeBtn = target.closest('.btn-select-composer-type');
        const clickedPreviewModal = target.closest('.preview-modal-overlay');
        const clickedCustomModal = target.closest('.custom-modal-overlay');
        const clickedDraftItem = target.closest('.draft-item');
        const clickedToast = target.closest('.glass-toast');
        const isDetached = !document.body.contains(target);

        if (!clickedInsideComposer && !clickedSelectTypeBtn && !clickedPreviewModal && !clickedCustomModal && !clickedDraftItem && !clickedToast && !isDetached) {
          this.cancelCenterComposer();
        }
      }
    }
  }

  loadUserHighlights(): void {
    const user = this.currentUser();
    if (!user) return;
    this.api.getUserHighlights(user.id).subscribe({
      next: (data) => {
        this.userHighlights = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore caricamento sottolineature utente per composer:', err)
    });
  }

  get filteredUserHighlights() {
    const list = this.userHighlights || [];
    if (!this.searchUserHighlightText.trim()) {
      return list;
    }
    const q = this.searchUserHighlightText.toLowerCase().trim();
    return list.filter(hl =>
      (hl.text && hl.text.toLowerCase().includes(q)) ||
      (hl.story_title && hl.story_title.toLowerCase().includes(q)) ||
      (hl.chapter_title && hl.chapter_title.toLowerCase().includes(q))
    );
  }

  selectUserHighlight(hl: any): void {
    this.highlightQuote = hl.text;
    this.postTitle = 'Una citazione da ' + hl.story_title;
    
    // Trova la storia collegata
    const foundStory = this.stories.find(s => String(s.id) === String(hl.story_id));
    if (foundStory) {
      this.rightSelectedStory = foundStory;
      this.rightSelectedStoryId = foundStory.id;
    } else {
      this.rightSelectedStory = {
        id: hl.story_id,
        title: hl.story_title,
        img: hl.story_image_url || hl.story_image
      };
      this.rightSelectedStoryId = hl.story_id;
    }
    this.cdr.detectChanges();
  }

  loadCommunityHighlights(): void {
    const user = this.currentUser();
    if (!user) return;
    this.api.getCommunityHighlights().subscribe({
      next: (data) => {
        this.communityHighlights = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento sottolineature community:', err);
      }
    });
  }

  getFilteredCommunityHighlights() {
    let result = this.communityHighlights;
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(hl =>
        (hl.text && hl.text.toLowerCase().includes(q)) ||
        (hl.user_name && hl.user_name.toLowerCase().includes(q)) ||
        (hl.story_title && hl.story_title.toLowerCase().includes(q)) ||
        (hl.chapter_title && hl.chapter_title.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getHighlightClass(color: string): string {
    if (!color) return 'yellow';
    if (color.includes('rgba(241, 196, 15') || color.includes('241, 196, 15')) return 'yellow';
    if (color.includes('rgba(46, 204, 113') || color.includes('46, 204, 113')) return 'green';
    if (color.includes('rgba(52, 152, 219') || color.includes('52, 152, 219')) return 'blue';
    if (color.includes('rgba(231, 76, 60') || color.includes('231, 76, 60')) return 'red';
    if (color.includes('rgba(155, 89, 182') || color.includes('155, 89, 182')) return 'purple';
    if (color.includes('rgba(230, 126, 34') || color.includes('230, 126, 34')) return 'orange';
    if (color.includes('rgba(244, 143, 177') || color.includes('244, 143, 177')) return 'pink';
    return 'yellow';
  }

  goToStory(storyId: any): void {
    this.router.navigate(['/book', storyId]);
  }

  goToChapterFromHighlight(hl: any): void {
    this.router.navigate(['/reader', hl.story_id, hl.chapter_id], {
      queryParams: { highlightId: hl.id }
    });
  }

  toggleHighlightShare(hl: any, event: Event): void {
    event.stopPropagation();
    this.activeShareHighlightId = this.activeShareHighlightId === hl.id ? null : hl.id;
    this.cdr.detectChanges();
  }

  copyHighlightLink(hl: any, event: Event): void {
    event.stopPropagation();
    const url = `${window.location.origin}/reader/${hl.story_id}/${hl.chapter_id}?highlightId=${hl.id}`;
    navigator.clipboard.writeText(url).then(
      () => {
        this.triggerToast('Link copiato negli appunti!');
        this.activeShareHighlightId = null;
        this.cdr.detectChanges();
      },
      () => {
        this.triggerToast('Impossibile copiare il link.');
      }
    );
  }

  shareHighlightToCommunity(hl: any, event: Event): void {
    event.stopPropagation();
    this.activeShareHighlightId = null;
    this.highlightQuote = hl.text;
    this.rightComposerType = 'quote';
    this.postTitle = 'Una citazione stupenda';
    
    const foundStory = this.stories.find(s => String(s.id) === String(hl.story_id));
    if (foundStory) {
      this.rightSelectedStory = foundStory;
      this.rightSelectedStoryId = foundStory.id;
    } else {
      this.rightSelectedStory = {
        id: hl.story_id,
        title: hl.story_title,
        img: hl.story_image
      };
      this.rightSelectedStoryId = hl.story_id;
    }
    
    this.showCenterComposer = true;
    this.activeMobileTab.set('composer');
    this.cdr.detectChanges();
  }

  isNativeShareSupported(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!navigator.share;
  }

  shareHighlightOnSocial(hl: any, platform: string, event: Event): void {
    event.stopPropagation();
    const url = encodeURIComponent(`${window.location.origin}/reader/${hl.story_id}/${hl.chapter_id}?highlightId=${hl.id}`);
    const title = encodeURIComponent(`"${hl.text}" - Citazione da ${hl.story_title}`);
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${title}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'x':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: `Citazione da ${hl.story_title}`,
            text: `"${hl.text}"`,
            url: decodeURIComponent(url)
          }).then(() => {
            this.triggerToast('Condiviso con successo!');
            this.activeShareHighlightId = null;
            this.cdr.detectChanges();
          }).catch((err) => {
            console.log('Condivisione annullata o fallita:', err);
          });
        }
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      this.activeShareHighlightId = null;
      this.cdr.detectChanges();
    }
  }
}
