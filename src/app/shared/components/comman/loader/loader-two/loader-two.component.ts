import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-loader-two',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './loader-two.component.html',
  styleUrls: ['./loader-two.component.scss']
})
export class LoaderTwoComponent {

  public loaderHide: boolean = false;

  constructor() {
    setTimeout(() => {
      this.loaderHide = true;
    }, 5000);
  }
}
