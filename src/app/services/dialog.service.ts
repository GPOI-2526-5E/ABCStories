import { Injectable, signal, inject } from '@angular/core';
import { LoadingService } from './loading.service';

export interface DialogOptions {
  title: string;
  message: string;
  type: 'alert' | 'confirm';
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  private loadingService = inject(LoadingService);

  public activeDialog = signal<DialogOptions | null>(null);
  private resolveFn: ((value: boolean) => void) | null = null;

  confirm(title: string, message: string): Promise<boolean> {
    this.loadingService.block();
    this.activeDialog.set({ title, message, type: 'confirm' });
    return new Promise<boolean>((resolve) => {
      this.resolveFn = resolve;
    });
  }

  alert(title: string, message: string): Promise<boolean> {
    this.loadingService.block();
    this.activeDialog.set({ title, message, type: 'alert' });
    return new Promise<boolean>((resolve) => {
      this.resolveFn = (val) => resolve(true);
    });
  }

  resolve(value: boolean) {
    const resolve = this.resolveFn;
    this.activeDialog.set(null);
    this.resolveFn = null;
    this.loadingService.unblock();
    if (resolve) {
      resolve(value);
    }
  }
}
