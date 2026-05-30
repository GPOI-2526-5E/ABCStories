import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Navbar } from "./components/navbar/navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ABC_Stories');
  private themeService = inject(ThemeService);
}
