import { Component, OnInit, inject, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Api } from '../../services/api';
import { Navbar } from '../navbar/navbar';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-story-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar],
  templateUrl: './story-editor.html',
  styleUrl: './story-editor.scss',
})
export class StoryEditor implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(Api);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(DialogService);

  storyId: string | null = null;
  story: any = null;
  chapters: any[] = [];

  availableGenres: string[] = [
    'Horror', 'Fantasy', 'Thriller', 'Romanzo', 'Fantascienza', 'Storico', 'Western', 'Avventura',
    'Biografia', 'Giallo', 'Poesia', 'Distopico', 'Young Adult', 'Mistero', 'Cyberpunk', 'Steampunk',
    'Noir', 'Drammatico', 'Comico', 'Psicologico', 'Mitologia', 'Apocalittico', 'Urban Fantasy',
    'Dark Fantasy', 'Crime', 'Azione', 'Survival', 'Paranormale', 'Gotico', 'Fiaba', 'Umoristico',
    'Militare', 'Slice of Life', 'Epico'
  ];

  selectedChapter: any = null;
  saving = false;

  // Upload immagini
  MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
  storyImagePreview: string | null = null;
  chapterImagePreview: string | null = null;

  originalStory: string | null = null;
  originalChapter: string | null = null;

  serializeStory(story: any): string {
    if (!story) return '';
    return JSON.stringify({
      title: story.title ?? '',
      genre: story.genre ?? '',
      description: story.description ?? '',
      image_url: story.image_url ?? ''
    });
  }

  serializeChapter(chapter: any): string {
    if (!chapter) return '';
    return JSON.stringify({
      title: chapter.title ?? '',
      content: chapter.content ?? '',
      image_url: chapter.image_url ?? ''
    });
  }

  hasUnsavedChanges(): boolean {
    if (this.story && this.originalStory) {
      if (this.serializeStory(this.story) !== this.originalStory) {
        return true;
      }
    }
    if (this.selectedChapter && this.originalChapter) {
      if (this.serializeChapter(this.selectedChapter) !== this.originalChapter) {
        return true;
      }
    }
    return false;
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    if (this.hasUnsavedChanges()) {
      $event.returnValue = true;
    }
  }

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('storyId');
    if (this.storyId) {
      this.loadStoryData();
    }
  }

  loadStoryData() {
    // Load story details
    this.api.getStory(this.storyId!).subscribe({
      next: (data) => {
        this.story = data;
        this.originalStory = this.serializeStory(data);
        // Se l'immagine nel DB è già base64, mostrala come preview
        if (data.image_url && data.image_url.startsWith('data:')) {
          this.storyImagePreview = data.image_url;
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });

    // Load chapters
    this.api.getAuthorChapters(this.storyId!).subscribe({
      next: (data) => {
        this.chapters = data;
        if (this.chapters.length > 0 && !this.selectedChapter) {
          this.selectChapter(this.chapters[0]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  saveStoryInfo() {
    if (!this.story) return;
    this.api.updateStory(this.story.id, {
      title: this.story.title,
      genre: this.story.genre,
      description: this.story.description,
      image_url: this.story.image_url || null
    }).subscribe({
      next: (updated) => {
        this.originalStory = this.serializeStory(this.story);
        this.dialogService.alert('Successo', 'Storia aggiornata con successo!');
      },
      error: (err) => this.dialogService.alert('Errore', 'Errore durante l\'aggiornamento della storia.')
    });
  }

  async selectChapter(chapter: any) {
    if (this.hasUnsavedChanges()) {
      const confirmed = await this.dialogService.confirm(
        'Modifiche non salvate',
        'Ci sono modifiche non salvate. Vuoi cambiare capitolo ed eliminare le modifiche?'
      );
      if (!confirmed) {
        return;
      }
    }
    this.selectedChapter = chapter;
    this.originalChapter = this.serializeChapter(chapter);
    // Mostra preview immagine capitolo se è già base64
    if (chapter.image_url && chapter.image_url.startsWith('data:')) {
      this.chapterImagePreview = chapter.image_url;
    } else {
      this.chapterImagePreview = null;
    }
    this.cdr.detectChanges();
    this.autoResizeTextareas();
  }

  adjustTitleHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  adjustTextareaHeight(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  autoResizeTextareas() {
    setTimeout(() => {
      const titleEl = document.querySelector('.reader-chapter-title-input') as HTMLTextAreaElement;
      const contentEl = document.querySelector('.reader-text-input') as HTMLTextAreaElement;
      if (titleEl) {
        titleEl.style.height = 'auto';
        titleEl.style.height = titleEl.scrollHeight + 'px';
      }
      if (contentEl) {
        contentEl.style.height = 'auto';
        contentEl.style.height = contentEl.scrollHeight + 'px';
      }
    }, 50);
  }

  onStoryImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > this.MAX_IMAGE_SIZE_BYTES) {
      this.dialogService.alert('Errore', 'Immagine troppo grande! Il limite massimo è 2MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.storyImagePreview = base64;
      if (this.story) this.story.image_url = base64;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  onChapterImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > this.MAX_IMAGE_SIZE_BYTES) {
      this.dialogService.alert('Errore', 'Immagine troppo grande! Il limite massimo è 2MB.');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.chapterImagePreview = base64;
      if (this.selectedChapter) this.selectedChapter.image_url = base64;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }

  addChapter() {
    const newOrder = this.chapters.length > 0 ? Math.max(...this.chapters.map(c => c.order_index)) + 1 : 1;
    this.api.createChapter({
      story_id: this.storyId,
      title: 'Nuovo Capitolo',
      content: '',
      order_index: newOrder
    }).subscribe({
      next: (chap) => {
        this.chapters.push(chap);
        this.originalChapter = null; // bypass prompt when changing to new chap
        this.selectChapter(chap);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.dialogService.alert("Errore", "Errore nella creazione del capitolo! Dettaglio: " + err.message);
      }
    });
  }

  saveChapter() {
    if (!this.selectedChapter) return;
    this.saving = true;
    this.api.updateChapter(this.selectedChapter.id, {
      title: this.selectedChapter.title,
      content: this.selectedChapter.content,
      image_url: this.selectedChapter.image_url,
      status: 'published'
    }).subscribe({
      next: (updated) => {
        this.saving = false;
        // update local list
        const idx = this.chapters.findIndex(c => c.id === updated.id);
        if (idx !== -1) this.chapters[idx] = updated;
        this.originalChapter = this.serializeChapter(this.selectedChapter);
        this.cdr.detectChanges();
        this.dialogService.alert('Successo', 'Capitolo salvato con successo!');
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.dialogService.alert('Errore', 'Errore durante il salvataggio: ' + err.message);
      }
    });
  }

  async deleteChapter(chapterId: string, event: Event) {
    event.stopPropagation();
    const confirmed = await this.dialogService.confirm(
      'Elimina Capitolo',
      'Vuoi davvero eliminare questo capitolo? L\'azione è irreversibile.'
    );
    if (confirmed) {
      this.api.deleteChapter(chapterId).subscribe({
        next: () => {
          this.chapters = this.chapters.filter(c => c.id !== chapterId);
          if (this.selectedChapter?.id === chapterId) {
            this.originalChapter = null; // reset to prevent prompt
            this.selectedChapter = this.chapters.length > 0 ? this.chapters[0] : null;
            if (this.selectedChapter) {
              this.originalChapter = this.serializeChapter(this.selectedChapter);
            }
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err)
      });
    }
  }

  isGenreDropdownOpen = false;

  toggleGenreDropdown(event: Event) {
    event.stopPropagation();
    this.isGenreDropdownOpen = !this.isGenreDropdownOpen;
    this.cdr.detectChanges();
  }

  selectGenre(genre: string, event: Event) {
    event.stopPropagation();
    if (this.story) {
      this.story.genre = genre;
    }
    this.isGenreDropdownOpen = false;
    this.cdr.detectChanges();
  }

  // HostListener per chiudere il menu cliccando fuori
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // target.closest may not exist on some SVGElements in older setups, but stopPropagation covers us
    if (target && typeof target.closest === 'function' && !target.closest('.custom-dropdown')) {
      this.isGenreDropdownOpen = false;
    }
  }

  goBack() {
    this.router.navigate(['/scrivi']);
  }

}
