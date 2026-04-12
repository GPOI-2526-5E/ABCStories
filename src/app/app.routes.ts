import { Routes } from '@angular/router';
import { Presentazione } from './components/presentazione/presentazione';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { BookDetail } from './components/book-detail/book-detail';

export const routes: Routes = [
  { path: '', component: Presentazione },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'register', component: Register},
  { path: 'book/:id', component: BookDetail }
];
