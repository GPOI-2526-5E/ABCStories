import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Navbar } from "../navbar/navbar";

@Component({
  selector: 'app-book-detail',
  imports: [CommonModule, Navbar],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.scss',
})
export class BookDetail implements OnInit {
  book: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    const navState = this.router.getCurrentNavigation()?.extras?.state?.['book'];

    if (navState) {
      this.book = navState;
    } else if (isPlatformBrowser(this.platformId)) {
      this.book = history.state?.book ?? null;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
