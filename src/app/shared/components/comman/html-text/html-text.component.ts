import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-html-text',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './html-text.component.html',
  styleUrls: ['./html-text.component.scss']
})
export class HtmlTextComponent {

  @Input() content: string;

}
