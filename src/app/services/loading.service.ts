import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loadingCount = 0;
  public isLoading = signal<boolean>(false);
  public isBlocked = signal<boolean>(false);

  show() {
    this._loadingCount++;
    this.update();
  }

  hide() {
    this._loadingCount = Math.max(0, this._loadingCount - 1);
    this.update();
  }

  block() {
    this.isBlocked.set(true);
  }

  unblock() {
    this.isBlocked.set(false);
  }

  private update() {
    this.isLoading.set(this._loadingCount > 0);
  }
}
