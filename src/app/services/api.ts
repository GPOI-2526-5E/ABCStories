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
}
