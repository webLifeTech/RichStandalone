import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-one',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './title-one.component.html',
  styleUrls: ['./title-one.component.scss']
})
export class TitleOneComponent {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() background_text: string;
  @Input() rounded: boolean;
  @Input() textWhite: boolean;

}
