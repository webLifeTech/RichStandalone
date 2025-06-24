import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteTrackerService {
  private previousUrl: string | null = null;
  private currentUrl: string | null = null;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe((events: [NavigationEnd, NavigationEnd]) => {
        this.previousUrl = events[0].urlAfterRedirects;
        this.currentUrl = events[1].urlAfterRedirects;
        console.log('Previous URL:', this.previousUrl);
        console.log('Current URL:', this.currentUrl);
      });
  }

  public getPreviousUrl(): string | null {
    return this.previousUrl;
  }

  public getCurrentUrl(): string | null {
    return this.currentUrl;
  }
}
