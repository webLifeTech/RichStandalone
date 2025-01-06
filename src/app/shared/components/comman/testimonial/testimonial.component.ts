import { Component, Input } from '@angular/core';
import { testimonial } from '../../../../shared/interface/cab';
import { CommonModule } from '@angular/common';
import { TestimonialOneComponent } from './testimonial-one/testimonial-one.component';
import { TestimonialTwoComponent } from './testimonial-two/testimonial-two.component';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [
    CommonModule,
    TestimonialOneComponent,
    TestimonialTwoComponent
  ],
  templateUrl: './testimonial.component.html',
  styleUrls: ['./testimonial.component.scss']
})
export class TestimonialComponent {

  @Input() type: string;
  @Input() testimonial: testimonial[];

}
