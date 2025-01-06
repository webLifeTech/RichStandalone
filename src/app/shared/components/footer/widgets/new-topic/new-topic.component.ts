import { Component } from '@angular/core';
import { footerNewTopic } from '../../../data/data/footer';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-topic',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './new-topic.component.html',
  styleUrls: ['./new-topic.component.scss']
})
export class NewTopicComponent {

  public footerNewTopic = footerNewTopic;

}
