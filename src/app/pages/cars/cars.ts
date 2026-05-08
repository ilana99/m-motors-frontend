import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gallery } from "./components/gallery/gallery";

@Component({
  selector: 'app-cars',
  imports: [Gallery],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit, OnDestroy {
  showSubmissionSuccess = signal(false);
  private submissionSuccessTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('submission') === 'success') {
      this.showTemporarySubmissionSuccess();
    }
  }

  ngOnDestroy(): void {
    this.clearSubmissionSuccessTimeout();
  }

  private showTemporarySubmissionSuccess(): void {
    this.clearSubmissionSuccessTimeout();
    this.showSubmissionSuccess.set(true);
    this.submissionSuccessTimeout = setTimeout(() => {
      this.showSubmissionSuccess.set(false);
      this.submissionSuccessTimeout = null;
    }, 2500);
  }

  private clearSubmissionSuccessTimeout(): void {
    if (this.submissionSuccessTimeout) {
      clearTimeout(this.submissionSuccessTimeout);
      this.submissionSuccessTimeout = null;
    }
  }
}
