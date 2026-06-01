import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-author-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.scss',
})
export class AuthorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(Api);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  authorId: string | null = null;
  author: any = null;
  stories: any[] = [];
  
  isFollowing = false;
  isCurrentUser = false;

  get initials(): string {
    return this.author?.username?.slice(0, 2).toUpperCase() || 'AU';
  }

  ngOnInit() {
    this.authorId = this.route.snapshot.paramMap.get('id');
    const currentUser = this.auth.currentUser();

    if (this.authorId) {
      if (currentUser && currentUser.id === this.authorId) {
        this.isCurrentUser = true;
      }

      // Fetch Author Profile
      this.api.getUserProfile(this.authorId).subscribe({
        next: (data) => {
          this.author = data;
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
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error unfollowing', err)
      });
    } else {
      this.api.followUser(currentUser.id, this.authorId).subscribe({
        next: () => {
          this.isFollowing = true;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error following', err)
      });
    }
  }
}
