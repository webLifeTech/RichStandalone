import { Component, Input } from '@angular/core';
import { ContactComponent } from './widgets/contact/contact.component';
import { AboutComponent } from './widgets/about/about.component';
import { CopyRightComponent } from './widgets/copy-right/copy-right.component';
import { LocationComponent } from './widgets/location/location.component';
import { NewTopicComponent } from './widgets/new-topic/new-topic.component';
import { SocialMediaComponent } from './widgets/social-media/social-media.component';
import { UsefulLinksComponent } from './widgets/useful-links/useful-links.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ContactComponent,
    AboutComponent,
    CopyRightComponent,
    LocationComponent,
    NewTopicComponent,
    SocialMediaComponent,
    UsefulLinksComponent,
    CommonModule
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  @Input() type: string;
  @Input() location: boolean;
  @Input() places: boolean;
  @Input() sticky: boolean;
  @Input() bgImage: boolean = false;
  @Input() subFooter: boolean = true;
  @Input() footerClass: boolean = false;

}
