import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-ngx-skeleton-loader',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './ngx-skeleton-loader.component.html',
  styleUrls: ['./ngx-skeleton-loader.component.scss']
})
export class NgxSkeletonLoaderComponent {

  public loaderHide: boolean = false;

  constructor() {
    setTimeout(() => {
      this.loaderHide = true;
    }, 5000);
  }
}
