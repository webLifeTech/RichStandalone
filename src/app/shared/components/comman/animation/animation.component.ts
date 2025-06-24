import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AnimationBirdComponent } from './animation-bird/animation-bird.component';
import { AnimationDotsComponent } from './animation-dots/animation-dots.component';

@Component({
  selector: 'app-animations',
  standalone: true,
  imports: [
    CommonModule,
    AnimationBirdComponent,
    AnimationDotsComponent
  ],
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.scss']
})
export class AnimationComponent {

  @Input() type: string;

}
