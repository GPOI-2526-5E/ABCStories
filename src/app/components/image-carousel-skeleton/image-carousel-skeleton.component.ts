import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel-skeleton.component.html',
  styleUrls: ['./image-carousel-skeleton.component.scss']
})
export class ImageCarouselSkeletonComponent {
  @Input() cardCount: number = 3;

  get cards(): number[] {
    return Array(this.cardCount).fill(0);
  }
}
