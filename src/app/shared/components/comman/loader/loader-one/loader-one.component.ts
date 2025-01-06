import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-one',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './loader-one.component.html',
  styleUrls: ['./loader-one.component.scss']
})
export class LoaderOneComponent {

  public loaderHide: boolean = false;

  constructor() {
    setTimeout(() => {
      this.loaderHide = true;
    }, 4000);
  }
}
