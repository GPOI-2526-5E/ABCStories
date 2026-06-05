import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Navbar } from "./components/navbar/navbar";
import { PageLoader } from './components/page-loader/page-loader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLoader],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ABC_Stories');
  private themeService = inject(ThemeService);
}
