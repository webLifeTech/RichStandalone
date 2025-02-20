import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SafeHtmlPipePipe } from '../../../pipe/safe-html-pipe.pipe';

@Component({
  selector: 'app-html-text',
  standalone: true,
  imports: [
    CommonModule,
    SafeHtmlPipePipe
  ],
  templateUrl: './html-text.component.html',
  styleUrls: ['./html-text.component.scss']
})
export class HtmlTextComponent {

  @Input() content: string;

}
