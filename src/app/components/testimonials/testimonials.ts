import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService, Review } from '../../services/review.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit {
  private reviewService = inject(ReviewService);
  reviews = signal<Review[]>([]);
  loading = signal(false);
  activeIndex = signal(0);

  latestReviews = computed(() => this.reviews().slice(0, 5));

  ngOnInit() {
    this.loadAllReviews();
  }

  loadAllReviews() {
    this.loading.set(true);
    this.reviewService.getAllApprovedReviews().subscribe({
      next: (data) => {
        this.reviews.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  next() {
    if (this.activeIndex() < this.latestReviews().length - 1) {
      this.activeIndex.update(i => i + 1);
    }
  }

  prev() {
    if (this.activeIndex() > 0) {
      this.activeIndex.update(i => i - 1);
    }
  }

  goTo(index: number) {
    this.activeIndex.set(index);
  }
}