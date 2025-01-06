import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title-four',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './title-four.component.html',
  styleUrls: ['./title-four.component.scss']
})
export class TitleFourComponent {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() description: string;

}
