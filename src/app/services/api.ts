import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/api/user`);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/user/login`, { email, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/user/register`, { email, username, password });
  }

  // ═══════════════ LIKES ═══════════════

  toggleLike(userId: string, storyId: string) {
    return this.http.post<{ liked: boolean }>(`${this.apiUrl}/api/likes/toggle`, { user_id: userId, story_id: storyId });
  }

  getLikedIds(userId: string) {
    return this.http.get<string[]>(`${this.apiUrl}/api/likes/${userId}`);
  }

  getLikedStories(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/likes/${userId}/stories`);
  }

  // ═══════════════ BOOKMARKS ═══════════════

  toggleBookmark(userId: string, storyId: string) {
    return this.http.post<{ bookmarked: boolean }>(`${this.apiUrl}/api/bookmarks/toggle`, { user_id: userId, story_id: storyId });
  }

  getBookmarkedIds(userId: string) {
    return this.http.get<string[]>(`${this.apiUrl}/api/bookmarks/${userId}`);
  }

  getBookmarkedStories(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/bookmarks/${userId}/stories`);
  }

  // ═══════════════ STORIES ═══════════════

  getStories() {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories`);
  }

  getStory(id: string) {
    return this.http.get<any>(`${this.apiUrl}/api/stories/${id}`);
  }

  getPopularStories() {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/popular`);
  }

  getStoriesByGenre(genre: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/genre/${genre}`);
  }

  getTrendingStories() {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/trending`);
  }

  getContinueReading(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/continue/${userId}`);
  }

  // ═══════════════ VIEWS ═══════════════

  recordView(storyId: string, userId?: string) {
    return this.http.post(`${this.apiUrl}/api/views`, { story_id: storyId, user_id: userId });
  }

  // ═══════════════ READING PROGRESS ═══════════════

  getReadingProgress(userId: string, storyId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/progress/${userId}/${storyId}`);
  }

  saveReadingProgress(userId: string, chapterId: string, progressPct: number) {
    return this.http.post(`${this.apiUrl}/api/progress`, {
      user_id: userId,
      chapter_id: chapterId,
      progress_pct: progressPct
    });
  }

  // ═══════════════ CHAPTERS ═══════════════

  getChapters(storyId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/${storyId}/chapters`);
  }

  getChapter(chapterId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/chapters/${chapterId}`);
  }
}
