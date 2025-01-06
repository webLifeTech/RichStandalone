import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-two',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './title-two.component.html',
  styleUrls: ['./title-two.component.scss']
})
export class TitleTwoComponent {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() textWhite: boolean;

}
