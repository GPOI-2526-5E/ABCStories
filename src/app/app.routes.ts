import { Routes } from '@angular/router';
import { Presentazione } from './components/presentazione/presentazione';
import { Login } from './components/login/login';
import { Home } from './components/home/home';
import { Register } from './components/register/register';
import { BookDetail } from './components/book-detail/book-detail';
import { Generi } from './components/generi/generi';
import { GeneriDetail } from './components/generi-detail/generi-detail';
import { User } from './components/user/user';
import { Reader } from './components/reader/reader';
import { AuthorDetail } from './components/author-detail/author-detail';
import { ScriviDashboard } from './components/scrivi-dashboard/scrivi-dashboard';
import { StoryEditor } from './components/story-editor/story-editor';
import { authGuard } from './services/auth.guard';
import { guestGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '',        component: Presentazione, canActivate: [guestGuard] },
  { path: 'login',   component: Login,         canActivate: [guestGuard] },
  { path: 'register',component: Register,      canActivate: [guestGuard] },
  { path: 'home',    component: Home,          canActivate: [authGuard]  },
  { path: 'book/:id',        component: BookDetail,    canActivate: [authGuard] },
  { path: 'reader/:storyId/:chapterId', component: Reader, canActivate: [authGuard] },
  { path: 'generi',          component: Generi,        canActivate: [authGuard] },
  { path: 'generi/:slug',    component: GeneriDetail,  canActivate: [authGuard] },
  { path: 'user',            component: User,          canActivate: [authGuard] },
  { path: 'author/:id',      component: AuthorDetail,  canActivate: [authGuard] },
  { path: 'scrivi',          component: ScriviDashboard, canActivate: [authGuard] },
  { path: 'scrivi/:storyId', component: StoryEditor,     canActivate: [authGuard] },
];
