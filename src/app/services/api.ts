import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class Api {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}


  getUsers() {
    return this.http.get(`${this.apiUrl}/api/user`);
  }

  getUserProfile(id: string) {
    return this.http.post<any>(`${this.apiUrl}/api/user/profile`, { id });
  }

  updateUserProfile(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/api/user/${id}`, data);
  }

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/user/login`, { email, password });
  }

  register(email: string, username: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/user/register`, { email, username, password });
  }

  sendVerificationCode(email: string) {
    return this.http.post<any>(`${this.apiUrl}/api/email/send-code`, { email });
  }

  verifyCode(email: string, code: string) {
    return this.http.post<any>(`${this.apiUrl}/api/email/verify-code`, { email, code });
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

  getTrendingStories(userId?: string) {
    let url = `${this.apiUrl}/api/stories/trending`;
    if (userId) url += `?userId=${userId}`;
    return this.http.get<any[]>(url);
  }

  getSimilarStories(storyId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/similar/${storyId}`);
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

  getAuthorChapters(storyId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/author/stories/${storyId}/chapters`);
  }

  getChapter(chapterId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/chapters/${chapterId}`);
  }

  // ═══════════════ REVIEWS & COMMENTS ═══════════════

  getStoryReviews(storyId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/${storyId}/reviews`);
  }

  getStoryComments(storyId: string, userId?: string) {
    let url = `${this.apiUrl}/api/stories/${storyId}/comments`;
    if (userId) url += `?userId=${userId}`;
    return this.http.get<any[]>(url);
  }

  addComment(storyId: string, authorId: string, content: string) {
    return this.http.post<any>(`${this.apiUrl}/api/stories/${storyId}/comments`, { author_id: authorId, content });
  }

  addReply(commentId: string, authorId: string, content: string) {
    return this.http.post<any>(`${this.apiUrl}/api/comments/${commentId}/replies`, { author_id: authorId, content });
  }

  toggleCommentLike(commentId: string, userId: string) {
    return this.http.post<{ liked: boolean }>(`${this.apiUrl}/api/comments/${commentId}/like`, { user_id: userId });
  }

  toggleReplyLike(replyId: string, userId: string) {
    return this.http.post<{ liked: boolean }>(`${this.apiUrl}/api/comments/replies/${replyId}/like`, { user_id: userId });
  }

  // ═══════════════ FOLLOWS & AUTHORS ═══════════════

  followUser(followerId: string, followedId: string) {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/api/follows`, { follower_id: followerId, followed_id: followedId });
  }

  unfollowUser(followerId: string, followedId: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/api/follows/${followerId}/${followedId}`);
  }

  getFollowedAuthors(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/follows/${userId}`);
  }

  getAuthorFollowers(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/follows/followers/${userId}`);
  }

  getFollowsCount(userId: string) {
    return this.http.get<{ followersCount: number, followingCount: number }>(`${this.apiUrl}/api/follows/count/${userId}`);
  }

  checkFollowStatus(followerId: string, followedId: string) {
    return this.http.get<{ following: boolean }>(`${this.apiUrl}/api/follows/check/${followerId}/${followedId}`);
  }

  getAuthorStories(authorId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/stories/author/${authorId}`);
  }

  // ═══════════════ USER SETTINGS & RECOMMENDED ═══════════════

  getAuthorRecommended(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/user/${userId}/recommended`);
  }

  updateAuthorRecommended(userId: string, storyIds: string[]) {
    return this.http.put<{ success: boolean }>(`${this.apiUrl}/api/user/${userId}/recommended`, { storyIds });
  }

  // ═══════════════ AUTHOR DASHBOARD & EDITOR ═══════════════

  getAuthorDashboardStories(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/author/my-stories/${userId}`);
  }

  createStory(storyData: any) {
    return this.http.post<any>(`${this.apiUrl}/api/stories`, storyData);
  }

  updateStory(storyId: string, storyData: any) {
    return this.http.put<any>(`${this.apiUrl}/api/stories/${storyId}`, storyData);
  }

  deleteStory(storyId: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/api/stories/${storyId}`);
  }

  createChapter(chapterData: any) {
    return this.http.post<any>(`${this.apiUrl}/api/chapters`, chapterData);
  }

  updateChapter(chapterId: string, chapterData: any) {
    return this.http.put<any>(`${this.apiUrl}/api/chapters/${chapterId}`, chapterData);
  }

  deleteChapter(chapterId: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/api/chapters/${chapterId}`);
  }

  search(query: string) {
    return this.http.get<{ stories: any[], authors: any[], genres: string[] }>(`${this.apiUrl}/api/search?q=${query}`);
  }

  // ═══════════════ NOTIFICATIONS ═══════════════

  getNotifications(userId: string) {
    return this.http.get<any[]>(`${this.apiUrl}/api/notifications/${userId}`);
  }

  markNotificationAsRead(id: string) {
    return this.http.put<any>(`${this.apiUrl}/api/notifications/${id}/read`, {});
  }

  markAllNotificationsAsRead(userId: string) {
    return this.http.put<any>(`${this.apiUrl}/api/notifications/user/${userId}/read-all`, {});
  }
}

