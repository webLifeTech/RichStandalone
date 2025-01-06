import { Component, Input } from '@angular/core';
import { TitleFourComponent } from './title-four/title-four.component';
import { TitleTwoComponent } from './title-two/title-two.component';
import { TitleThreeComponent } from './title-three/title-three.component';
import { TitleOneComponent } from './title-one/title-one.component';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [
    TitleOneComponent,
    TitleThreeComponent,
    TitleTwoComponent,
    TitleFourComponent,
  ],
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent {

  @Input() type: string;
  @Input() title: string;
  @Input() subTitle: string;
  @Input() background_text: string;
  @Input() description: string;
  @Input() textWhite: boolean = false;
  @Input() titleClass: string;
  @Input() rounded: boolean = false;

}
