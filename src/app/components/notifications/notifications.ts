import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { InteractionsService } from '../../services/interactions.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  private router = inject(Router);
  private api = inject(Api);
  private auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  public interactions = inject(InteractionsService);

  notifications: any[] = [];
  followedAuthorIds = new Set<string>();
  filter: 'all' | 'unread' | 'likes' | 'bookmarks' | 'comments' | 'follows' | 'stories' | 'interactions' | 'community' = 'all';
  loading = true;
  userProfile: any = null;

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadNotifications();
    this.loadFollowedAuthors();
    this.interactions.loadUserInteractions().subscribe();
    this.api.getUserProfile(user.id).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('Errore caricamento profilo in notifiche:', err)
    });
  }

  loadNotifications(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.loading = true;
    this.api.getNotifications(user.id).subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore nel caricamento delle notifiche:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadFollowedAuthors(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.getFollowedAuthors(user.id).subscribe({
      next: (authors) => {
        this.followedAuthorIds = new Set(authors.map((a: any) => a.id));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore caricamento autori seguiti:', err)
    });
  }

  get filteredNotifications() {
    if (this.filter === 'unread') {
      return this.notifications.filter(n => !n.is_read);
    }
    if (this.filter === 'likes') {
      return this.notifications.filter(n => n.story_id && this.interactions.isLiked(n.story_id));
    }
    if (this.filter === 'bookmarks') {
      return this.notifications.filter(n => n.story_id && this.interactions.isBookmarked(n.story_id));
    }
    if (this.filter === 'comments') {
      return this.notifications.filter(n => n.type === 'comment_reply' || n.type === 'comment_like');
    }
    if (this.filter === 'follows') {
      return this.notifications.filter(n => n.type === 'new_follower');
    }
    if (this.filter === 'stories') {
      return this.notifications.filter(n => ['new_story', 'update_story', 'new_chapter', 'update_chapter'].includes(n.type));
    }
    if (this.filter === 'interactions') {
      return this.notifications.filter(n => n.type === 'story_like' || n.type === 'story_bookmark');
    }
    if (this.filter === 'community') {
      return this.notifications.filter(n => n.type === 'community_like' || n.type === 'community_comment');
    }
    return this.notifications;
  }

  get unreadCount(): number {
    return this.notifications.filter(n => !n.is_read).length;
  }

  get likesCount(): number {
    return this.notifications.filter(n => n.story_id && this.interactions.isLiked(n.story_id)).length;
  }

  get bookmarksCount(): number {
    return this.notifications.filter(n => n.story_id && this.interactions.isBookmarked(n.story_id)).length;
  }

  get commentsCount(): number {
    return this.notifications.filter(n => n.type === 'comment_reply' || n.type === 'comment_like').length;
  }

  get followsCount(): number {
    return this.notifications.filter(n => n.type === 'new_follower').length;
  }

  get storiesCount(): number {
    return this.notifications.filter(n => ['new_story', 'update_story', 'new_chapter', 'update_chapter'].includes(n.type)).length;
  }

  get interactionsCount(): number {
    return this.notifications.filter(n => n.type === 'story_like' || n.type === 'story_bookmark').length;
  }

  get communityCount(): number {
    return this.notifications.filter(n => n.type === 'community_like' || n.type === 'community_comment').length;
  }

  setFilter(filter: 'all' | 'unread' | 'likes' | 'bookmarks' | 'comments' | 'follows' | 'stories' | 'interactions' | 'community'): void {
    this.filter = filter;
  }

  markAsRead(notification: any, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (notification.is_read) return;

    this.api.markNotificationAsRead(notification.id).subscribe({
      next: () => {
        notification.is_read = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore nel segnare la notifica come letta:', err)
    });
  }

  markAllAsRead(): void {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.markAllNotificationsAsRead(user.id).subscribe({
      next: () => {
        this.notifications.forEach(n => n.is_read = true);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Errore nel segnare tutte le notifiche come lette:', err)
    });
  }

  onNotificationClick(notification: any): void {
    this.markAsRead(notification);

    if (notification.type === 'new_follower') {
      this.router.navigate(['/author'], { state: { authorId: notification.sender_id } });
      return;
    }

    if (notification.type === 'community_like' || notification.type === 'community_comment') {
      this.router.navigate(['/community']);
      return;
    }

    if (!notification.story_id) {
      // La storia è stata eliminata, segna solo come letto senza reindirizzare
      return;
    }

    if (notification.type === 'new_story' || notification.type === 'update_story' || notification.type === 'comment_reply' || notification.type === 'comment_like' || notification.type === 'story_like' || notification.type === 'story_bookmark') {
      this.router.navigate(['/book', notification.story_id]);
    } else if (notification.type === 'new_chapter' || notification.type === 'update_chapter') {
      if (notification.chapter_id) {
        this.router.navigate(['/reader', notification.story_id, notification.chapter_id]);
      } else {
        this.router.navigate(['/book', notification.story_id]);
      }
    }
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

  getInitials(username: string): string {
    return username ? username.slice(0, 2).toUpperCase() : 'US';
  }

  getNotificationIcon(type: string): string {
    switch(type) {
      case 'new_story': return '📖';
      case 'update_story': return '📝';
      case 'new_chapter': return '🔖';
      case 'update_chapter': return '⚙️';
      case 'comment_reply': return '💬';
      case 'comment_like': return '❤️';
      case 'new_follower': return '👤';
      case 'story_like': return '💖';
      case 'story_bookmark': return '⭐';
      case 'community_like': return '❤️';
      case 'community_comment': return '💬';
      default: return '🔔';
    }
  }

  isFilterDisabled(filterName: string): boolean {
    if (!this.userProfile) return false;
    if (filterName === 'comments') {
      return this.userProfile.notifiche_risposte_commenti === false && 
             this.userProfile.notifiche_like_commenti === false;
    }
    if (filterName === 'follows') {
      return this.userProfile.notifiche_nuovo_follower === false;
    }
    if (filterName === 'stories') {
      return this.userProfile.notifiche_aggiornamenti_nuova_storia === false &&
             this.userProfile.notifiche_aggiornamenti_nuovo_capitolo === false &&
             this.userProfile.notifiche_aggiornamenti_modifica_storia === false &&
             this.userProfile.notifiche_aggiornamenti_modifica_capitolo === false;
    }
    if (filterName === 'interactions') {
      return this.userProfile.notifiche_storie_like === false &&
             this.userProfile.notifiche_storie_preferiti === false;
    }
    if (filterName === 'community') {
      return this.userProfile.notifiche_community_like === false &&
             this.userProfile.notifiche_community_commento === false;
    }
    return false;
  }
}
