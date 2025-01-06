import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-three',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './title-three.component.html',
  styleUrls: ['./title-three.component.scss']
})
export class TitleThreeComponent {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() description: string;
  @Input() titleClass: string;

}
