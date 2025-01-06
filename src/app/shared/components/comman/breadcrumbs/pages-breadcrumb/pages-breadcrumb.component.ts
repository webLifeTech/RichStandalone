import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-pages-breadcrumb',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './pages-breadcrumb.component.html',
  styleUrl: './pages-breadcrumb.component.scss'
})
export class PagesBreadcrumbComponent {

  @Input() bg_image: string;
  @Input() title: string;
  @Input() parent: string;
  @Input() child: string;
  @Input() paddingClass: boolean;

  constructor() {
  }

}
