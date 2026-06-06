import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { Navbar } from '../navbar/navbar';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-scrivi-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './scrivi-dashboard.html',
  styleUrl: './scrivi-dashboard.scss',
})
export class ScriviDashboard implements OnInit {
  private api = inject(Api);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);

  stories: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadStories();
  }

  loadStories() {
    const user = this.auth.currentUser();
    if (!user) {
      if (typeof window !== 'undefined') {
        this.router.navigate(['/login']);
      }
      return;
    }
    this.loading = true;
    this.api.getAuthorDashboardStories(user.id).subscribe({
      next: (data) => {
        this.stories = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dashboard stories', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createNewStory() {
    const user = this.auth.currentUser();
    if (!user) return;
    
    // Create draft story
    this.api.createStory({ author_id: user.id, title: 'Nuova Storia' }).subscribe({
      next: (story) => {
        // Navigate to editor
        this.router.navigate(['/scrivi', story.id]);
      },
      error: async (err) => {
        console.error('Error creating story', err);
        await this.dialogService.alert("Errore", "Errore durante la creazione della storia! Assicurati di aver riavviato il server Node dal terminale.\n\nDettaglio: " + err.message);
      }
    });
  }

  async deleteStory(storyId: string, event: Event) {
    event.stopPropagation();
    const confirmed = await this.dialogService.confirm("Elimina Storia", "Sei sicuro di voler eliminare questa storia? L'azione è irreversibile.");
    if (confirmed) {
      this.api.deleteStory(storyId).subscribe({
        next: () => {
          this.stories = this.stories.filter(s => s.id !== storyId);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error deleting story', err)
      });
    }
  }

  publishStory(story: any, event: Event) {
    event.stopPropagation();
    const newStatus = story.status === 'published' ? 'draft' : 'published';
    this.api.updateStory(story.id, { status: newStatus }).subscribe({
      next: (updated) => {
        story.status = updated.status;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error publishing story', err)
    });
  }

  goToEditor(storyId: string) {
    this.router.navigate(['/scrivi', storyId]);
  }
}
