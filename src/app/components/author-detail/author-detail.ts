import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../navbar/navbar';
import { BookSlider } from '../book-slider/book-slider';
import { Footer } from '../footer/footer';
import { LoadingService } from '../../services/loading.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar, BookSlider, Footer],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.scss',
})
export class AuthorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(Api);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private loadingService = inject(LoadingService);
  private platformId = inject(PLATFORM_ID);

  authorId: string | null = null;
  author: any = null;
  stories: any[] = [];

  isFollowing = false;
  isCurrentUser = false;

  // Followers Info
  followersList: any[] = [];
  followingList: any[] = [];
  followersCount: number = 0;
  followingCount: number = 0;
  displayedFollowersCount: number = 10;
  displayedFollowingCount: number = 10;

  // Pagination
  displayedBooksCount: number = 10;

  // New State for Tabs
  tabs = ['Tutte', 'Più popolari', 'Recenti'];
  activeTab = 'Tutte';


  // Recommended Books
  recommendedBooks: any[] = [];

  get initials(): string {
    return this.author?.username?.slice(0, 2).toUpperCase() || 'AU';
  }

  get filteredStories() {
    if (!this.stories) return [];

    const copy = [...this.stories];
    if (this.activeTab === 'Più popolari') {
      copy.sort((a, b) => (b.readers_count || 0) - (a.readers_count || 0));
    } else if (this.activeTab === 'Recenti') {
      copy.sort((a, b) => {
        const idA = a.id ? parseInt(a.id, 10) : 0;
        const idB = b.id ? parseInt(b.id, 10) : 0;
        return idB - idA;
      });
    }
    return copy; // 'Tutte'
  }

  get displayedStories() {
    return this.filteredStories.slice(0, this.displayedBooksCount);
  }

  get displayedFollowers() {
    return this.followersList.slice(0, this.displayedFollowersCount);
  }

  get displayedFollowing() {
    return this.followingList.slice(0, this.displayedFollowingCount);
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.displayedBooksCount = 10; // Reset pagination on tab change
  }

  showMoreBooks() {
    this.displayedBooksCount += 10;
  }

  showMoreFollowers() {
    this.displayedFollowersCount += 10;
  }

  showMoreFollowing() {
    this.displayedFollowingCount += 10;
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && id !== this.authorId) {
        this.authorId = id;
        this.loadAuthorData();
      }
    });
  }

  loadAuthorData() {
    const currentUser = this.auth.currentUser();

    if (this.authorId) {
      this.isCurrentUser = (currentUser && currentUser.id === this.authorId) ? true : false;
      this.isFollowing = false;
      this.activeTab = 'Tutte';
      this.displayedBooksCount = 10;
      this.displayedFollowersCount = 10;

      // Fetch Author Profile
      this.api.getUserProfile(this.authorId).subscribe({
        next: (data) => {
          this.author = data;
          if (this.author?.profilePictureUrl) {
            this.preloadImage(this.author.profilePictureUrl);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching author', err)
      });

      // Fetch Author Stories
      this.api.getAuthorStories(this.authorId).subscribe({
        next: (data) => {
          this.stories = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching stories', err)
      });

      // Fetch Followers and Follow Counts
      this.api.getFollowsCount(this.authorId).subscribe({
        next: (data) => {
          this.followersCount = data.followersCount;
          this.followingCount = data.followingCount;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching follow counts', err)
      });

      this.api.getAuthorFollowers(this.authorId).subscribe({
        next: (data) => {
          this.followersList = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching followers', err)
      });

      this.api.getFollowedAuthors(this.authorId).subscribe({
        next: (data) => {
          this.followingList = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching following', err)
      });

      // Fetch Recommended Books
      this.api.getAuthorRecommended(this.authorId).subscribe({
        next: (data) => {
          this.recommendedBooks = data.map((s: any) => ({
            id: s.id,
            title: s.title,
            author: s.author_name || s.author_id,
            desc: s.description,
            img: s.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=320&q=80',
            genre: s.genre,
            tag: s.genre,
            rating: s.rating ? parseFloat(s.rating) : 0,
            readers: s.readers_count
          }));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error fetching recommended', err)
      });

      // Check follow status
      if (currentUser && !this.isCurrentUser) {
        this.api.checkFollowStatus(currentUser.id, this.authorId).subscribe({
          next: (data) => {
            this.isFollowing = data.following;
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Error checking follow status', err)
        });
      }
    }
  }

  toggleFollow() {
    const currentUser = this.auth.currentUser();
    if (!currentUser || !this.authorId || this.isCurrentUser) return;

    if (this.isFollowing) {
      this.api.unfollowUser(currentUser.id, this.authorId).subscribe({
        next: () => {
          this.isFollowing = false;
          this.followersCount = Math.max(0, this.followersCount - 1);
          this.followersList = this.followersList.filter(f => f.id !== currentUser.id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error unfollowing', err)
      });
    } else {
      this.api.followUser(currentUser.id, this.authorId).subscribe({
        next: () => {
          this.isFollowing = true;
          this.followersCount += 1;

          // Aggiungi immediatamente l'utente corrente alla lista
          this.followersList.unshift({
            id: currentUser.id,
            name: currentUser.username,
            handle: currentUser.email,
            description: (currentUser as any).bio || '',
            avatar_url: (currentUser as any).avatar_url || '',
            stories_count: 0, // Mocked for immediate display
            followers_count: 0, // Mocked
            following_count: 0 // Mocked
          });

          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error following', err)
      });
    }
  }

  private preloadImage(url: string) {
    if (!isPlatformBrowser(this.platformId) || !url) return;
    this.loadingService.show();
    const img = new Image();
    img.onload = () => this.loadingService.hide();
    img.onerror = () => this.loadingService.hide();
    img.src = url;
  }
}
