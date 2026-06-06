import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { Navbar } from "./components/navbar/navbar";
import { PageLoader } from './components/page-loader/page-loader';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLoader, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App {
  protected readonly title = signal('ABC_Stories');
  private themeService = inject(ThemeService);
  public dialogService = inject(DialogService);
}
