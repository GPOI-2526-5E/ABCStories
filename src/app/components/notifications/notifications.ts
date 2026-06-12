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
  filter: 'all' | 'unread' | 'likes' | 'bookmarks' | 'authors' = 'all';
  loading = true;

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadNotifications();
    this.loadFollowedAuthors();
    this.interactions.loadUserInteractions().subscribe();
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
    if (this.filter === 'authors') {
      return this.notifications.filter(n => n.sender_id && this.followedAuthorIds.has(n.sender_id));
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

  get authorsCount(): number {
    return this.notifications.filter(n => n.sender_id && this.followedAuthorIds.has(n.sender_id)).length;
  }

  setFilter(filter: 'all' | 'unread' | 'likes' | 'bookmarks' | 'authors'): void {
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

    if (!notification.story_id) {
      // La storia è stata eliminata, segna solo come letto senza reindirizzare
      return;
    }

    if (notification.type === 'new_story' || notification.type === 'update_story') {
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
      default: return '🔔';
    }
  }
}
