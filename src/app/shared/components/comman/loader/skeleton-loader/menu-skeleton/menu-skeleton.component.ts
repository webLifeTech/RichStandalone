import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-menu-skeleton',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './menu-skeleton.component.html',
  styleUrls: ['./menu-skeleton.component.scss']
})
export class MenuSkeletonComponent {

  @Input() skeletonType: string;

}
