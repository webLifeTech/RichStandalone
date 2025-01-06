import { Component, Input } from '@angular/core';
import { testimonial } from '../../../../interface/cab';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-testimonial-two',
  standalone: true,
  imports: [
    CommonModule,
    CarouselModule
  ],
  templateUrl: './testimonial-two.component.html',
  styleUrls: ['./testimonial-two.component.scss']
})
export class TestimonialTwoComponent {

  @Input() testimonial: testimonial[];

  public options = {
    loop: true,
    nav: true,
    dots: false,
    navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>",],
    responsive: {
      0: {
        items: 1,
      },
    },
  };
}
